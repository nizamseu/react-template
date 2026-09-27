// StoryProgressSlider

// Slider01 · Social Networks & Communities › Animated Slider

// Description:
// Social-story viewer for Moments' "Golden Hour Club": six full-screen story frames from
// members such as noor.frames, kaito.walks and lina.north, under the headline "Six moments
// from today's golden hour." Each frame has the poster's avatar, time and place, a sticker,
// a caption, a "Reply to …" link and a like button. Use it on a community home or profile
// page to preview the day's stories in the familiar tap-through format.

// Design:
// - Black #000 stage, #fafafa text, zinc #a1a1aa secondary text, pastel story-ring gradient
//   #fdba74 → #f9a8d4 → #c4b5fd (rings, sticker, headline accent); a blurred copy of the
//   current photo glows behind the viewer.
// - Centred composition: header, a tray of avatar rings (grey once seen), a 9:16 viewer
//   (w-full → max 340px → sm 360px, rounded-[1.75rem]) and a counter row with arrows.
// - Viewer chrome: segmented progress bars across the top, avatar/user/time row, play-pause
//   button, bottom gradient with rotated sticker, semibold caption and reply/like row.
// - Motion: frames push in from the side with a spring (direction-aware) while the old one
//   shrinks away, slow zoom on each photo, staggered caption and sticker pop, the viewer
//   leans with the finger while dragging; MotionConfig reducedMotion="user" drops transforms.
// - lg: dimmed "previous" and "next" story cards flank the viewer; below lg only the viewer
//   shows; tray usernames appear from sm.

// What it does:
// - State: [index, direction], seen stories, likes, hover/focus/hold flags and a play-pause
//   preference. A framer-motion animate() fills the active bar over 5 s and then advances
//   (looping to the first story); it resumes from where it stopped and is stopped on unmount.
// - Autoplay pauses on mouse hover, keyboard focus and while a finger or mouse button is held
//   on the viewer; it is off for prefers-reduced-motion until Play is pressed.
// - Tap/click the left or right half to go back or forward, swipe/drag (60 px or a flick),
//   use ←/→/Home/End, the arrow buttons, the side cards or the avatar tray. Long presses
//   and drags never count as taps, and a click that ends a drag is ignored.
// - Reply links point to #moments-reply-<user>; "All stories" → #moments-stories.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StoryProgressSlider from '@/TestComponent/PageSections/community/Slider01';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <StoryProgressSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
    AnimatePresence,
    MotionConfig,
    animate,
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from 'framer-motion';
import {
    HiArrowLongLeft,
    HiArrowLongRight,
    HiArrowUpRight,
    HiHeart,
    HiMiniMapPin,
    HiMiniPause,
    HiMiniPlay,
    HiOutlineHeart,
} from 'react-icons/hi2';
import { PiHandTap } from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const FRAME_SECONDS = 5
const EASE = [0.22, 1, 0.36, 1]
const RING = 'bg-linear-to-tr from-[#fdba74] via-[#f9a8d4] to-[#c4b5fd]'

const frames = [
    {
        id: 'noor',
        user: 'noor.frames',
        time: '2h',
        place: 'Ember & Oat, Fitzrovia',
        sticker: '#slowsunday',
        caption: 'Sunday ritual: two flat whites and absolutely zero plans.',
        likes: 214,
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        alt: 'Two lattes with leaf latte art on a wooden café table',
    },
    {
        id: 'kaito',
        user: 'kaito.walks',
        time: '3h',
        place: 'Higashiyama, Kyoto',
        sticker: '6:40 am walk',
        caption: 'Found the quiet side of Higashiyama before the first tour bus.',
        likes: 1032,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        alt: 'Narrow Kyoto street with wooden houses leading up to a five-storey pagoda',
    },
    {
        id: 'ines',
        user: 'ines.sol',
        time: '5h',
        place: 'Praia da Adraga, Sintra',
        sticker: 'Meet-up #14',
        caption: 'Meet-up #14 is on: Saturday, 7:10 pm. Bring a blanket and a friend.',
        likes: 389,
        avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        alt: 'Calm sea washing onto a sandy beach under a pastel sunset sky',
    },
    {
        id: 'theo',
        user: 'theo.makes',
        time: '6h',
        place: 'Studio 4B, Leipzig',
        sticker: 'Work in progress',
        caption: 'Poster for Friday’s zine night. Colour or no colour? Reply and vote.',
        likes: 147,
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80',
        alt: 'Hand sketching with a stylus on a tablet on a desk',
    },
    {
        id: 'maya',
        user: 'maya.lens',
        time: '9h',
        place: 'Twin Peaks, San Francisco',
        sticker: '10k members',
        caption: 'Ten thousand of you now. I’m a little speechless. Thank you, club.',
        likes: 2418,
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
        alt: 'Group of friends hugging and laughing together at sunset',
    },
    {
        id: 'lina',
        user: 'lina.north',
        time: '11h',
        place: 'Abisko, Sweden',
        sticker: 'Aurora alert',
        caption: 'Aurora at 2:14 am. Worth every single frozen finger.',
        likes: 3771,
        avatar: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
        alt: 'Green aurora ribbons glowing over a dark, snowy landscape',
    },
]

const total = frames.length
const pad = (n) => String(n).padStart(2, '0')
const formatCount = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n))

const frameVariants = {
    enter: (dir) => ({ x: dir < 0 ? '-34%' : '34%', scale: 1.04, opacity: 0, zIndex: 2 }),
    center: {
        x: '0%',
        scale: 1,
        opacity: 1,
        zIndex: 2,
        transition: {
            x: { type: 'spring', stiffness: 210, damping: 28 },
            scale: { duration: 0.6, ease: EASE },
            opacity: { duration: 0.35, ease: 'easeOut' },
            delayChildren: 0.18,
            staggerChildren: 0.07,
        },
    },
    exit: (dir) => ({
        x: dir < 0 ? '16%' : '-16%',
        scale: 0.9,
        opacity: 0,
        zIndex: 1,
        transition: { duration: 0.5, ease: EASE },
    }),
}

const rise = {
    enter: { y: 18, opacity: 0 },
    center: { y: 0, opacity: 1, transition: { duration: 0.55, ease: EASE } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
}

const pop = {
    enter: { scale: 0.5, rotate: -18, opacity: 0 },
    center: { scale: 1, rotate: -4, opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 17 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
}

function PeekCard({ frame, label, onSelect }) {
    return (
        <button
            type="button"
            aria-label={`${label}: ${frame.user}, ${frame.time} ago`}
            className="group relative hidden aspect-[9/16] w-[190px] shrink-0 overflow-hidden rounded-[1.25rem] bg-[#18181b] opacity-55 transition-opacity duration-300 hover:opacity-90 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c4b5fd] lg:block xl:w-[210px]"
            onClick={onSelect}
        >
            <AnimatePresence initial={false}>
                <motion.span
                    key={frame.id}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute inset-0 block"
                >
                    <img
                        src={frame.image}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/55" />
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
                        <span className={cn('block h-16 w-16 rounded-full p-[2px]', RING)}>
                            <span className="block h-full w-full rounded-full bg-black p-[2px]">
                                <img
                                    src={frame.avatar}
                                    alt=""
                                    loading="lazy"
                                    draggable={false}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </span>
                        </span>
                        <span className="block max-w-full truncate text-sm font-semibold text-[#fafafa]">
                            {frame.user}
                        </span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#fafafa]/60">
                            {label} · {frame.time}
                        </span>
                    </span>
                </motion.span>
            </AnimatePresence>
        </button>
    )
}

export function StoryProgressSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const [[index, direction], setPage] = useState([0, 0])
    const [seen, setSeen] = useState([frames[0].id])
    const [liked, setLiked] = useState({})
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [held, setHeld] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dragX = useMotionValue(0)
    const leanX = useTransform(dragX, (v) => v * 0.4)
    const leanRotate = useTransform(dragX, [-320, 0, 320], [-4, 0, 4])
    const viewerRef = useRef(null)
    const press = useRef(null)
    const pressedAt = useRef(0)
    const ignorePan = useRef(false)
    const moved = useRef(false)
    const springRef = useRef(null)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !held

    const frame = frames[index]
    const prevFrame = frames[(index - 1 + total) % total]
    const nextFrame = frames[(index + 1) % total]
    const activeFill = reduce && !autoplayOn ? 1 : progress

    const paginate = useCallback(
        (dir) => {
            progress.jump(0)
            setPage(([current]) => [(current + dir + total) % total, dir])
        },
        [progress],
    )

    const goTo = (target) => {
        if (target === index) return
        progress.jump(0)
        setPage([target, target > index ? 1 : -1])
    }

    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        const id = frames[index].id
        setSeen((list) => (list.includes(id) ? list : [...list, id]))
        const preload = new window.Image()
        preload.src = frames[(index + 1) % total].image
    }, [index])

    // Autoplay: fill the active bar 0 → 1, resuming from the current value after a pause.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: FRAME_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    useEffect(() => {
        const spring = springRef
        return () => {
            if (spring.current) spring.current.stop()
        }
    }, [])

    const releaseLean = () => {
        if (springRef.current) springRef.current.stop()
        springRef.current = animate(dragX, 0, reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 })
    }

    const isControl = (target) => Boolean(target && target.closest && target.closest('button, a'))

    const handlePointerDown = (event) => {
        if (!event.isPrimary || event.button > 0) return
        const ignore = isControl(event.target)
        ignorePan.current = ignore
        moved.current = false
        pressedAt.current = performance.now()
        press.current = { x: event.clientX, y: event.clientY, t: pressedAt.current, ignore }
        if (!ignore) setHeld(true)
    }

    const handlePointerUp = (event) => {
        const start = press.current
        press.current = null
        setHeld(false)
        if (!start || start.ignore) return
        const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y)
        const quick = performance.now() - start.t < 350
        // A short, still press is a tap: left half goes back, right half goes forward.
        if (distance < 10 && quick && !moved.current) {
            const rect = event.currentTarget.getBoundingClientRect()
            paginate(event.clientX - rect.left < rect.width / 2 ? -1 : 1)
        }
    }

    const handlePointerLeave = (event) => {
        if (event.pointerType === 'mouse') setHovered(false)
        press.current = null
        setHeld(false)
    }

    // framer-motion runs onPan synchronously but defers onPanStart/onPanEnd to after the
    // frame renders, so drag state is read from refs set on pointerdown, never onPanStart.
    const handlePan = (_, info) => {
        if (ignorePan.current) return
        if (springRef.current) springRef.current.stop()
        if (Math.abs(info.offset.x) > 6) moved.current = true
        dragX.set(info.offset.x)
    }

    const handlePanEnd = (_, info) => {
        releaseLean()
        if (ignorePan.current) return
        const { offset, velocity } = info
        if (Math.abs(offset.x) < Math.abs(offset.y)) return
        // Pan velocity reads low after an idle frame loop, so a short, fast swipe also counts.
        const flick = performance.now() - pressedAt.current < 250 && Math.abs(offset.x) > 24
        if (offset.x < -60 || (offset.x < -16 && velocity.x < -450) || (flick && offset.x < 0)) paginate(1)
        else if (offset.x > 60 || (offset.x > 16 && velocity.x > 450) || (flick && offset.x > 0)) paginate(-1)
    }

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        const isMove = event.key in moves
        if (!isMove && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        setFocused(true)
        // Keep focus alive when the focused link belongs to the frame that is leaving.
        const viewer = viewerRef.current
        if (viewer && viewer !== event.target && viewer.contains(event.target)) {
            viewer.focus({ preventScroll: true })
        }
        if (isMove) paginate(moves[event.key])
        else goTo(event.key === 'Home' ? 0 : total - 1)
    }

    const handleFocus = (event) => {
        let visible = true
        try {
            visible = event.target.matches(':focus-visible')
        } catch {
            visible = true
        }
        if (visible) setFocused(true)
    }

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
    }

    const isLiked = Boolean(liked[frame.id])

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-black px-4 py-12 text-base font-normal text-[#fafafa] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                    <AnimatePresence initial={false}>
                        <motion.img
                            key={frame.id}
                            src={frame.image}
                            alt=""
                            loading="lazy"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.42 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="absolute left-1/2 top-[58%] h-[70%] w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 object-cover blur-[90px]"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-linear-to-b from-black via-black/40 to-black" />
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/75 sm:text-[11px]">
                            <span className={cn('h-1.5 w-1.5 rounded-full', RING)} />
                            Moments · Golden Hour Club
                        </p>
                        <h2 className="mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#fafafa] sm:text-5xl lg:text-6xl">
                            Six moments from{' '}
                            <span className="bg-linear-to-r from-[#fdba74] via-[#f9a8d4] to-[#c4b5fd] bg-clip-text font-serif font-normal italic text-transparent">
                                today’s golden hour.
                            </span>
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#a1a1aa] sm:text-base sm:leading-7">
                            Stories from members of the club, posted in the last 12 hours. They fade out at
                            midnight.
                        </p>
                    </div>

                    <div
                        role="group"
                        aria-label="Choose a story"
                        className="mt-8 flex justify-center gap-2.5 sm:mt-10 sm:gap-4"
                    >
                        {frames.map((item, i) => {
                            const active = i === index
                            const wasSeen = !active && seen.includes(item.id)
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-label={`Story ${i + 1} of ${total}: ${item.user}${wasSeen ? ', seen' : ''}`}
                                    aria-current={active ? 'true' : undefined}
                                    className="group relative flex w-11 flex-col items-center gap-1.5 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c4b5fd] sm:w-16"
                                    onClick={() => goTo(i)}
                                >
                                    <span
                                        className={cn(
                                            'block aspect-square w-full rounded-full p-[2px] transition-transform duration-300',
                                            wasSeen ? 'bg-white/20' : RING,
                                            active ? 'scale-110' : 'group-hover:scale-105',
                                        )}
                                    >
                                        <span className="block h-full w-full rounded-full bg-black p-[2px]">
                                            <img
                                                src={item.avatar}
                                                alt=""
                                                loading="lazy"
                                                draggable={false}
                                                className={cn(
                                                    'h-full w-full rounded-full object-cover transition-opacity',
                                                    wasSeen && 'opacity-60',
                                                )}
                                            />
                                        </span>
                                    </span>
                                    <span
                                        className={cn(
                                            'hidden w-full truncate text-center text-[11px] transition-colors sm:block',
                                            active ? 'text-[#fafafa]' : 'text-[#a1a1aa]',
                                        )}
                                    >
                                        {item.user}
                                    </span>
                                    {active && (
                                        <motion.span
                                            layoutId={`${uid}-tray-dot`}
                                            className="absolute -bottom-3 h-1 w-1 rounded-full bg-[#f9a8d4] sm:-bottom-2.5"
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Golden Hour Club stories"
                        className="mt-8 sm:mt-10"
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    >
                        <div className="flex items-center justify-center gap-10 xl:gap-14">
                            <PeekCard frame={prevFrame} label="Previous" onSelect={() => paginate(-1)} />

                            <motion.div
                                ref={viewerRef}
                                role="group"
                                tabIndex={0}
                                aria-label="Story viewer. Tap the right half or press the right arrow for the next story, the left half or left arrow to go back. Press and hold to pause."
                                style={{ x: leanX, rotate: leanRotate }}
                                className="relative isolate aspect-[9/16] w-full max-w-[340px] cursor-pointer touch-pan-y select-none overflow-hidden rounded-[1.75rem] bg-[#18181b] shadow-[0_40px_80px_-30px_rgba(249,168,212,0.35)] [-webkit-touch-callout:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c4b5fd] sm:max-w-[360px]"
                                onPointerDown={handlePointerDown}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={() => {
                                    press.current = null
                                    setHeld(false)
                                }}
                                onPointerEnter={(event) => {
                                    if (event.pointerType === 'mouse') setHovered(true)
                                }}
                                onPointerLeave={handlePointerLeave}
                                onContextMenu={(event) => {
                                    if (press.current) event.preventDefault()
                                }}
                                onClickCapture={(event) => {
                                    if (moved.current) {
                                        event.preventDefault()
                                        event.stopPropagation()
                                    }
                                }}
                                onPan={handlePan}
                                onPanEnd={handlePanEnd}
                            >
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={frame.id}
                                        role="group"
                                        aria-roledescription="slide"
                                        aria-label={`${index + 1} of ${total}: ${frame.user}, ${frame.time} ago`}
                                        custom={direction}
                                        variants={frameVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute inset-0 overflow-hidden rounded-[1.75rem]"
                                    >
                                        <motion.img
                                            src={frame.image}
                                            alt={frame.alt}
                                            loading="lazy"
                                            draggable={false}
                                            initial={{ scale: 1.14 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: FRAME_SECONDS + 1.5, ease: 'easeOut' }}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/70 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-black/90 via-black/45 to-transparent" />

                                        <motion.div
                                            variants={rise}
                                            className="absolute inset-x-0 top-0 flex items-center gap-2.5 px-3.5 pr-32 pt-7"
                                        >
                                            <span className={cn('block h-9 w-9 shrink-0 rounded-full p-[1.5px]', RING)}>
                                                <img
                                                    src={frame.avatar}
                                                    alt=""
                                                    loading="lazy"
                                                    draggable={false}
                                                    className="h-full w-full rounded-full border-2 border-black object-cover"
                                                />
                                            </span>
                                            <span className="min-w-0 leading-tight">
                                                <span className="flex items-baseline gap-1.5">
                                                    <span className="truncate text-sm font-semibold text-[#fafafa]">
                                                        {frame.user}
                                                    </span>
                                                    <span className="shrink-0 text-xs text-[#fafafa]/60">{frame.time}</span>
                                                </span>
                                                <span className="mt-0.5 flex items-center gap-1 text-[11px] text-[#fafafa]/70">
                                                    <HiMiniMapPin aria-hidden="true" className="shrink-0" />
                                                    <span className="truncate">{frame.place}</span>
                                                </span>
                                            </span>
                                        </motion.div>

                                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                                            <motion.span
                                                variants={pop}
                                                className={cn(
                                                    'inline-block rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-black shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
                                                    RING,
                                                )}
                                            >
                                                {frame.sticker}
                                            </motion.span>
                                            <motion.p
                                                variants={rise}
                                                className="mt-3 text-lg font-semibold leading-snug tracking-[-0.01em] text-[#fafafa] sm:text-xl"
                                            >
                                                {frame.caption}
                                            </motion.p>
                                            <motion.div variants={rise} className="mt-4 flex items-center gap-2">
                                                <a
                                                    href={`#moments-reply-${frame.id}`}
                                                    draggable={false}
                                                    className="flex h-11 min-w-0 flex-1 items-center rounded-full border border-white/35 bg-black/20 px-4 text-sm text-[#fafafa]/80 backdrop-blur-sm transition-colors hover:border-white/70 hover:text-[#fafafa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd]"
                                                >
                                                    <span className="truncate">Reply to {frame.user}…</span>
                                                </a>
                                                <button
                                                    type="button"
                                                    aria-pressed={isLiked}
                                                    aria-label={isLiked ? `Unlike ${frame.user}’s story` : `Like ${frame.user}’s story`}
                                                    className="flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm tabular-nums text-[#fafafa] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd]"
                                                    onClick={() => setLiked((map) => ({ ...map, [frame.id]: !map[frame.id] }))}
                                                >
                                                    <motion.span
                                                        key={isLiked ? 'on' : 'off'}
                                                        initial={{ scale: 0.4 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
                                                        className={cn('text-2xl', isLiked ? 'text-[#f9a8d4]' : 'text-[#fafafa]')}
                                                    >
                                                        {isLiked ? <HiHeart aria-hidden="true" /> : <HiOutlineHeart aria-hidden="true" />}
                                                    </motion.span>
                                                    {formatCount(frame.likes + (isLiked ? 1 : 0))}
                                                </button>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-3 pt-3">
                                    <div aria-hidden="true" className="flex gap-1">
                                        {frames.map((item, i) => (
                                            <span
                                                key={item.id}
                                                className="relative block h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
                                            >
                                                <motion.span
                                                    className="absolute inset-0 origin-left rounded-full bg-white"
                                                    style={{ scaleX: i === index ? activeFill : i < index ? 1 : 0 }}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute right-2 top-5 z-10 flex items-center gap-1">
                                    <AnimatePresence>
                                        {autoplayOn && !playing && (
                                            <motion.span
                                                initial={{ opacity: 0, x: 6 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="pointer-events-none rounded-full bg-black/45 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/85 backdrop-blur-sm"
                                            >
                                                Paused
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    <button
                                        type="button"
                                        aria-label={autoplayOn ? 'Pause stories' : 'Play stories'}
                                        className="grid h-10 w-10 place-items-center rounded-full text-xl text-[#fafafa] transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#c4b5fd]"
                                        onClick={() => setPlayPref(!autoplayOn)}
                                    >
                                        {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                    </button>
                                </div>
                            </motion.div>

                            <PeekCard frame={nextFrame} label="Next" onSelect={() => paginate(1)} />
                        </div>

                        <div className="mx-auto mt-6 flex max-w-[360px] items-center justify-between gap-3 sm:mt-8 lg:max-w-[560px]">
                            <button
                                type="button"
                                aria-label="Previous story"
                                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-lg transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd]"
                                onClick={() => paginate(-1)}
                            >
                                <HiArrowLongLeft aria-hidden="true" />
                            </button>
                            <div className="min-w-0 text-center">
                                <p className="font-mono text-xs tabular-nums tracking-[0.24em] text-[#fafafa]/45">
                                    <span className="text-[#fafafa]">{pad(index + 1)}</span> / {pad(total)}
                                </p>
                                <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-[#a1a1aa]">
                                    <PiHandTap aria-hidden="true" className="shrink-0 text-sm text-[#f9a8d4]" />
                                    <span className="truncate">Tap the sides · hold to pause</span>
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Next story"
                                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-lg transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd]"
                                onClick={() => paginate(1)}
                            >
                                <HiArrowLongRight aria-hidden="true" />
                            </button>
                        </div>

                        <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                            Story {index + 1} of {total}: {frame.user}, {frame.time} ago. {frame.caption}
                        </p>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <a
                            href="#moments-stories"
                            className="group inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-sm text-[#fafafa]/75 transition-colors hover:text-[#fafafa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd]"
                        >
                            All stories
                            <HiArrowUpRight
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </a>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default StoryProgressSlider

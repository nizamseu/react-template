// HeadlineCarouselSlider

// Slider01 · Blogs & Digital Media › Animated Slider

// Description:
// News hero carousel for the city daily Metro Chronicle, under a double-ruled masthead and
// a "Top stories" heading. Five stories (Transit, Housing, Culture, Business, Sport) each
// show a photo with a red category tag, "12 min ago"-style time stamp, read time, a serif
// headline such as "Night buses return to 14 routes as the Riverside line shuts for 11
// weeks", a dek, the byline and a "Read the story" link. Use it at the top of a news or
// magazine homepage to rotate the day's lead stories.

// Design:
// - White #ffffff page, ink #0a0a0a type and rules, alert red #dc2626 for tags, the live
//   dot, numbers and progress; greys #525252 / #737373 / #e5e5e5 for meta text and tracks.
// - Newspaper feel: serif black wordmark over a 3px + 1px double rule, square corners
//   everywhere, square 44px outline buttons; serif bold headline text-[1.7rem] →
//   sm:text-[2.35rem] → lg:text-[2.6rem], mono uppercase meta and counters.
// - lg: 12-column grid, story (photo aspect-[16/9] + text) spans 8 columns and a
//   numbered "Top stories" rail spans 4, each rail item with a vertical red progress bar.
//   Below lg the rail becomes a 5-column row of progress segments (numbers, category
//   from sm); photo is aspect-[4/3] on mobile, aspect-[16/9] from sm.
// - Motion: a red edge bar wipes the new photo in (clip-path inset, direction-aware) while
//   the old one dims, slow zoom settle on the photo, headline words rise out of a mask
//   with a stagger, rolling counter digits. Reduced motion uses a plain crossfade.
// - Invisible copies of every story's text share one grid cell, so height never jumps.

// What it does:
// - State: [index, direction], hover/focus/drag flags and a play/pause preference. A
//   framer-motion animate() fills a 0→1 progress value over 6 s (the red bar on the active
//   rail item), then moves to the next story; it resumes where it stopped after a pause.
// - Autoplay pauses on mouse hover, keyboard focus inside the carousel and while dragging;
//   it is off for prefers-reduced-motion unless Play is pressed. Animations stop on unmount.
// - Drag/swipe the story (60 px or a quick flick; left = next, right = previous), use
//   ←/→/Home/End while it has focus, the prev/next buttons or the rail items. A click that
//   ends a drag never follows a link. The current story is announced in an aria-live line.
// - "Read the story" links go to #story-<id>; "All top stories" → #metro-top-stories.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HeadlineCarouselSlider from '@/TestComponent/PageSections/media/Slider01';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <HeadlineCarouselSlider />
//     </main>
// )
// ```

'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiArrowUpRight, HiPause, HiPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6
const EASE = [0.22, 1, 0.36, 1]
const WIPE = { duration: 0.85, ease: [0.77, 0, 0.18, 1] }

const stories = [
    {
        id: 'riverside-closure',
        category: 'Transit',
        ago: '12 min ago',
        read: '4 min read',
        headline: 'Night buses return to 14 routes as the Riverside line shuts for 11 weeks',
        dek: 'Replacement buses will run every six minutes at peak, but officials warn cross-river commutes could take up to 18 minutes longer until December 8.',
        author: 'Priya Raman',
        desk: 'Transport reporter',
        image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
        alt: 'City street at dusk with light trails from traffic between tall buildings',
        credit: 'Dana Okafor',
    },
    {
        id: 'harbour-street-homes',
        category: 'Housing',
        ago: '38 min ago',
        read: '5 min read',
        headline: 'Council approves 1,200 homes on the old Harbour Street rail yard',
        dek: 'The 9–4 vote clears the city’s largest housing project in a decade, with 35% of units priced as affordable and a 4-acre riverside park.',
        author: 'Tomás Beltrán',
        desk: 'City Hall reporter',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80',
        alt: 'Angular white modern building against a clear sky',
        credit: 'Lena Fischer',
    },
    {
        id: 'symphony-founders-park',
        category: 'Culture',
        ago: '1 hr ago',
        read: '3 min read',
        headline: 'Metro Symphony opens its 88th season with a free night in Founders Park',
        dek: 'More than 20,000 people are expected on the lawn on Saturday. Gates open at 5 p.m. and the programme closes with Stravinsky’s Firebird.',
        author: 'Hana Sato',
        desk: 'Classical music critic',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80',
        alt: 'Crowd with raised hands in front of a stage washed in bright light',
        credit: 'Marco Ruiz',
    },
    {
        id: 'office-vacancy',
        category: 'Business',
        ago: '2 hr ago',
        read: '6 min read',
        headline: 'Downtown office vacancy falls to 14.2%, its lowest level since 2019',
        dek: 'Lab and studio conversions filled 1.1 million sq ft this year, though brokers say rents in older towers are still sliding.',
        author: 'Marcus Webb',
        desk: 'Economy editor',
        image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80',
        alt: 'Glass office towers photographed from the street, looking straight up',
        credit: 'Ines Carvalho',
    },
    {
        id: 'academy-cup-final',
        category: 'Sport',
        ago: '3 hr ago',
        read: '4 min read',
        headline: 'Metro FC’s academy side books a place in the national youth cup final',
        dek: 'Two late goals from 17-year-old Ade Mensah sealed a 3–2 comeback at Eastgate. The final kicks off on October 18 in front of a sell-out crowd.',
        author: 'Jordan Ellis',
        desk: 'Sports reporter',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=80',
        alt: 'Football boot resting on top of a ball on a grass pitch',
        credit: 'Sam Adeyemi',
    },
]

const total = stories.length
const pad = (n) => String(n).padStart(2, '0')

// Photo layer: the new photo is revealed by a clip-path wipe travelling in the direction
// of travel; the old one stays underneath and dims.
const layerWipe = {
    enter: { zIndex: 2 },
    center: { zIndex: 2 },
    exit: { zIndex: 1 },
}

const clipWipe = {
    enter: (dir) => ({ clipPath: dir < 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)', filter: 'brightness(1)' }),
    center: { clipPath: 'inset(0% 0% 0% 0%)', filter: 'brightness(1)', transition: WIPE },
    exit: { clipPath: 'inset(0% 0% 0% 0%)', filter: 'brightness(0.45)', transition: WIPE },
}

const edgeBar = {
    enter: (dir) => ({ x: dir < 0 ? '-100%' : '100%' }),
    center: { x: '0%', transition: WIPE },
    exit: { x: '0%' },
}

const layerFade = {
    enter: { opacity: 0, zIndex: 2 },
    center: { opacity: 1, zIndex: 2, transition: { duration: 0.45 } },
    exit: { opacity: 0, zIndex: 1, transition: { duration: 0.45, delay: 0.15 } },
}

const textGroup = {
    hidden: { transition: { duration: 0 } },
    shown: { transition: { staggerChildren: 0.03, delayChildren: 0.18 } },
}

const rise = {
    hidden: { opacity: 0, y: 12, transition: { duration: 0 } },
    shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

const wordRise = {
    hidden: { y: '110%', transition: { duration: 0 } },
    shown: { y: '0%', transition: { duration: 0.6, ease: EASE } },
}

export function HeadlineCarouselSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [[index, direction], setPage] = useState([0, 1])
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dragX = useMotionValue(0)
    const stageRef = useRef(null)
    const panning = useRef(false)
    const moved = useRef(false)
    const panAt = useRef(0)
    const snapBack = useRef(null)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const story = stories[index]

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
        const snap = snapBack
        return () => {
            if (snap.current) snap.current.stop()
        }
    }, [])

    // Autoplay: fill the progress value 0 → 1, resuming from where it stopped.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    // Warm the cache for the next story's photo.
    useEffect(() => {
        const preload = new window.Image()
        preload.src = stories[(index + 1) % total].image
    }, [index])

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(total - 1)
        else return
        event.preventDefault()
        // A focused link inside the story that is leaving would be hidden; keep focus alive.
        const stage = stageRef.current
        if (stage && stage !== event.target && stage.contains(event.target)) stage.focus({ preventScroll: true })
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

    // framer-motion calls onPan synchronously but defers onPanStart to the next frame,
    // so whichever handler runs first sets up the drag.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        panAt.current = performance.now()
        if (snapBack.current) snapBack.current.stop()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        dragX.set(info.offset.x * 0.4)
    }

    const handlePanEnd = (_, info) => {
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        // Pan velocity reads low when the frame loop was idle, so a short, quick swipe
        // (< 250 ms, > 24 px) also counts as a flick in the drag direction.
        const flick = performance.now() - panAt.current < 250 && Math.abs(offset.x) > 24
        if (offset.x < -60 || (offset.x < -10 && (velocity.x < -400 || flick))) paginate(1)
        else if (offset.x > 60 || (offset.x > 10 && (velocity.x > 400 || flick))) paginate(-1)
        snapBack.current = animate(dragX, 0, { type: 'spring', stiffness: 320, damping: 34 })
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-10 text-base font-normal text-[#0a0a0a] sm:px-6 sm:py-14 lg:px-10 lg:py-16',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b-[3px] border-[#0a0a0a] pb-3">
                        <div className="flex items-center gap-3">
                            <span
                                aria-hidden="true"
                                className="grid h-10 w-10 shrink-0 place-items-center bg-[#dc2626] font-serif text-2xl font-black leading-none text-white"
                            >
                                M
                            </span>
                            <div className="leading-none">
                                <p className="font-serif text-[1.65rem] font-black tracking-[-0.03em] text-[#0a0a0a] sm:text-[2rem]">
                                    Metro Chronicle
                                </p>
                                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#525252]">
                                    Sunday 27 September · City edition
                                </p>
                            </div>
                        </div>
                        <a
                            href="#metro-top-stories"
                            className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#0a0a0a] underline decoration-[#dc2626] decoration-2 underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
                        >
                            All top stories
                            <HiArrowRight
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                    </div>
                    <div aria-hidden="true" className="mt-[3px] h-px bg-[#0a0a0a]" />

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Metro Chronicle top stories"
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onPointerEnter={(event) => {
                            if (event.pointerType === 'mouse') setHovered(true)
                        }}
                        onPointerLeave={(event) => {
                            if (event.pointerType === 'mouse') setHovered(false)
                        }}
                    >
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 sm:mt-8">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                                    {!reduce && (
                                        <motion.span
                                            className="absolute inset-0 rounded-full bg-[#dc2626]"
                                            animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                                        />
                                    )}
                                    <span className="relative h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
                                </span>
                                <h2 className="text-xl font-black uppercase tracking-[0.06em] text-[#0a0a0a] sm:text-2xl">
                                    Top stories
                                </h2>
                                <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-[#737373] sm:inline">
                                    Updated 09:42
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <p className="mr-2 flex items-baseline gap-1.5 font-mono tabular-nums">
                                    <span className="relative inline-flex h-7 overflow-hidden text-2xl font-bold leading-7 text-[#dc2626]">
                                        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                                            <motion.span
                                                key={index}
                                                custom={direction}
                                                initial={{ y: direction < 0 ? '-100%' : '100%' }}
                                                animate={{ y: '0%' }}
                                                exit={{ y: direction < 0 ? '100%' : '-100%' }}
                                                transition={{ duration: 0.45, ease: EASE }}
                                                className="block"
                                            >
                                                {pad(index + 1)}
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                    <span className="text-sm text-[#737373]">/ {pad(total)}</span>
                                </p>
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="grid h-11 w-11 place-items-center text-lg text-[#0a0a0a] transition-colors hover:bg-[#f5f5f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? <HiPause aria-hidden="true" /> : <HiPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous story"
                                    className="grid h-11 w-11 place-items-center border-2 border-[#0a0a0a] text-lg transition-colors hover:border-[#dc2626] hover:bg-[#dc2626] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
                                    onClick={() => paginate(-1)}
                                >
                                    <HiArrowLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next story"
                                    className="grid h-11 w-11 place-items-center border-2 border-[#0a0a0a] bg-[#0a0a0a] text-lg text-white transition-colors hover:border-[#dc2626] hover:bg-[#dc2626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
                                    onClick={() => paginate(1)}
                                >
                                    <HiArrowRight aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-6 sm:mt-6 lg:grid-cols-12 lg:gap-10">
                            <motion.div
                                ref={stageRef}
                                role="group"
                                tabIndex={0}
                                aria-label="Story, drag or use the left and right arrow keys to browse"
                                className={cn(
                                    'touch-pan-y select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dc2626] lg:col-span-8',
                                    dragging ? 'cursor-grabbing' : 'cursor-grab',
                                )}
                                onPointerDownCapture={() => {
                                    moved.current = false
                                }}
                                onClickCapture={(event) => {
                                    // Swallow only the click that ends a drag.
                                    if (moved.current) {
                                        moved.current = false
                                        event.preventDefault()
                                        event.stopPropagation()
                                    }
                                }}
                                onKeyDownCapture={() => {
                                    moved.current = false
                                }}
                                onPanStart={beginPan}
                                onPan={handlePan}
                                onPanEnd={handlePanEnd}
                            >
                                <div className="relative isolate aspect-[4/3] overflow-hidden bg-[#f1f1f1] sm:aspect-[16/9]">
                                    <motion.div className="absolute inset-0" style={{ x: dragX }}>
                                        <AnimatePresence initial={false} custom={direction}>
                                            <motion.div
                                                key={story.id}
                                                custom={direction}
                                                variants={reduce ? layerFade : layerWipe}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                className="absolute inset-0"
                                            >
                                                <motion.div
                                                    custom={direction}
                                                    variants={reduce ? undefined : clipWipe}
                                                    className="absolute inset-0 overflow-hidden"
                                                >
                                                    <motion.img
                                                        src={story.image}
                                                        alt={story.alt}
                                                        draggable={false}
                                                        initial={{ scale: 1.1 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 1.6, ease: EASE }}
                                                        className="absolute inset-0 h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent" />
                                                    <span className="absolute left-0 top-0 bg-[#dc2626] px-3 py-2 text-[11px] font-bold uppercase leading-none tracking-[0.18em] text-white sm:left-5 sm:top-5">
                                                        {story.category}
                                                    </span>
                                                    <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/85 sm:bottom-4 sm:right-4">
                                                        Photo: {story.credit}
                                                    </span>
                                                </motion.div>
                                                {!reduce && (
                                                    <motion.div
                                                        aria-hidden="true"
                                                        custom={direction}
                                                        variants={edgeBar}
                                                        className="pointer-events-none absolute inset-0"
                                                    >
                                                        <span
                                                            className={cn(
                                                                'absolute inset-y-0 w-3 bg-[#dc2626] sm:w-4',
                                                                direction < 0 ? 'right-0 translate-x-full' : 'left-0 -translate-x-full',
                                                            )}
                                                        />
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.div>
                                </div>

                                <div className="mt-5 grid sm:mt-6">
                                    {stories.map((item, i) => {
                                        const active = i === index
                                        const words = item.headline.split(' ')
                                        return (
                                            <motion.article
                                                key={item.id}
                                                role="group"
                                                aria-roledescription="slide"
                                                aria-label={`${i + 1} of ${total}: ${item.category}`}
                                                aria-hidden={active ? undefined : true}
                                                initial={false}
                                                animate={active ? 'shown' : 'hidden'}
                                                variants={textGroup}
                                                className={cn('[grid-area:1/1]', !active && 'invisible')}
                                            >
                                                <motion.p
                                                    variants={rise}
                                                    className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#525252]"
                                                >
                                                    <span className="font-bold text-[#dc2626]">{item.category}</span>
                                                    <span aria-hidden="true" className="h-3 w-px bg-[#d4d4d4]" />
                                                    <span className="text-[#0a0a0a]">{item.ago}</span>
                                                    <span aria-hidden="true" className="h-3 w-px bg-[#d4d4d4]" />
                                                    <span>{item.read}</span>
                                                </motion.p>
                                                <h3 className="mt-3 font-serif text-[1.7rem] font-bold leading-[1.08] tracking-[-0.015em] text-[#0a0a0a] sm:text-[2.35rem] lg:text-[2.6rem]">
                                                    {words.map((word, wi) => (
                                                        <Fragment key={`${word}-${wi}`}>
                                                            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                                                                <motion.span variants={wordRise} className="inline-block">
                                                                    {word}
                                                                </motion.span>
                                                            </span>
                                                            {wi < words.length - 1 ? ' ' : null}
                                                        </Fragment>
                                                    ))}
                                                </h3>
                                                <motion.p
                                                    variants={rise}
                                                    className="mt-4 max-w-2xl text-base leading-7 text-[#404040] sm:text-lg sm:leading-8"
                                                >
                                                    {item.dek}
                                                </motion.p>
                                                <motion.div
                                                    variants={rise}
                                                    className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[#e5e5e5] pt-4"
                                                >
                                                    <p className="text-sm text-[#525252]">
                                                        By <span className="font-semibold text-[#0a0a0a]">{item.author}</span>
                                                        <span className="text-[#a3a3a3]"> · </span>
                                                        {item.desk}
                                                    </p>
                                                    <a
                                                        href={`#story-${item.id}`}
                                                        draggable={false}
                                                        className="group inline-flex min-h-10 items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#0a0a0a] transition-colors hover:text-[#dc2626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
                                                    >
                                                        Read the story
                                                        <HiArrowUpRight
                                                            aria-hidden="true"
                                                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                        />
                                                    </a>
                                                </motion.div>
                                            </motion.article>
                                        )
                                    })}
                                </div>
                            </motion.div>

                            <div className="lg:col-span-4">
                                <p className="mb-3 hidden font-mono text-[11px] uppercase tracking-[0.2em] text-[#737373] lg:block">
                                    In the carousel
                                </p>
                                <ol
                                    aria-label="Choose a story"
                                    className="grid grid-cols-5 gap-2 lg:grid-cols-1 lg:gap-0 lg:border-t lg:border-[#e5e5e5]"
                                >
                                    {stories.map((item, i) => {
                                        const active = i === index
                                        const fill = active ? (reduce && !autoplayOn ? 1 : progress) : 0
                                        return (
                                            <li key={item.id} className="min-w-0">
                                                <button
                                                    type="button"
                                                    aria-label={`Story ${i + 1}: ${item.headline}`}
                                                    aria-current={active ? 'true' : undefined}
                                                    className="group relative flex h-12 w-full min-w-0 flex-col justify-start text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626] lg:h-auto lg:flex-row lg:gap-4 lg:border-b lg:border-[#e5e5e5] lg:py-4 lg:pl-5 lg:pr-1"
                                                    onClick={() => goTo(i)}
                                                >
                                                    <span className="relative block h-[3px] w-full overflow-hidden bg-[#e5e5e5] transition-colors group-hover:bg-[#d4d4d4] lg:hidden">
                                                        <motion.span
                                                            className="absolute inset-0 origin-left bg-[#dc2626]"
                                                            style={{ scaleX: fill }}
                                                        />
                                                    </span>
                                                    <span className="absolute inset-y-0 left-0 hidden w-[3px] overflow-hidden bg-[#e5e5e5] lg:block">
                                                        <motion.span
                                                            className="absolute inset-0 origin-top bg-[#dc2626]"
                                                            style={{ scaleY: fill }}
                                                        />
                                                    </span>
                                                    <span className="mt-2 flex min-w-0 items-baseline gap-1.5 lg:mt-0 lg:block">
                                                        <span
                                                            className={cn(
                                                                'font-mono text-xs font-bold tabular-nums transition-colors lg:font-serif lg:text-3xl lg:font-black lg:leading-none',
                                                                active ? 'text-[#dc2626]' : 'text-[#a3a3a3] group-hover:text-[#0a0a0a]',
                                                            )}
                                                        >
                                                            {pad(i + 1)}
                                                        </span>
                                                        <span className="hidden min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373] sm:block lg:hidden">
                                                            {item.category}
                                                        </span>
                                                    </span>
                                                    <span className="hidden min-w-0 lg:block">
                                                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#737373]">
                                                            <span className={cn(active && 'text-[#dc2626]')}>{item.category}</span>
                                                            {' · '}
                                                            {item.ago}
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                'mt-1.5 line-clamp-3 block font-serif text-[1.05rem] font-semibold leading-snug transition-colors',
                                                                active ? 'text-[#0a0a0a]' : 'text-[#525252] group-hover:text-[#0a0a0a]',
                                                            )}
                                                        >
                                                            {item.headline}
                                                        </span>
                                                    </span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ol>
                                <p className="mt-3 text-xs text-[#737373] lg:mt-4">
                                    Swipe or drag the story, or use ← → to browse.
                                </p>
                            </div>
                        </div>

                        <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                            Story {index + 1} of {total}: {story.headline}
                        </p>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default HeadlineCarouselSlider

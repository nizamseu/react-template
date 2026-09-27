// ShowreelSlider

// Slider01 · Portfolios & Personal Websites › Animated Slider

// Description:
// Full-bleed showreel for photographer and art director Theo Laurent. Five projects ("Salt
// & Stone", "Night Shift", "Quiet Rooms", "Soft Focus", "High Desert") play like the
// chapters of a reel: each fills the stage with a photo, a giant split-letter title, the
// client, role, place and year, and a "View project" link. Use it as the opening section of
// a photography or art-direction portfolio where the work should take the whole screen.

// Design:
// - Near-black #0a0a0a bezel around a full-width stage (h-[600px] → sm:h-[660px] →
//   lg:h-[clamp(640px,86vh,800px)]); full-bleed photo under black gradients, viewfinder
//   corner marks, cream #ede6da type and a signal-red #ff4d2e REC dot and playhead.
// - Titles in font-black uppercase sans, leading-[0.84], sized to the stage with container
//   units: text-[min(13cqw,9rem)], then text-[min(9cqw,10rem)] once the stage is 56rem wide,
//   where a meta list (client, role, location, year) with hairline rules moves right of the
//   title; narrower stages show client and place on one line beside the CTA.
// - Motion: the new frame wipes in with a clip-path from the side it comes from while the
//   old frame drifts away, the photo scales in 1.25 → 1, title letters rise out of line masks
//   with a stagger, and a running timecode plus playhead follow the autoplay.
// - A scrubber rail with chapter ticks (labels from md) doubles as dots and 6 s progress,
//   next to play/pause, previous and next buttons; below sm the buttons drop to their own
//   row with a "Swipe or ← →" hint.

// What it does:
// - State: [index, direction], hover/focus/drag flags and a play/pause preference.
//   animate() fills a 0 → 1 progress value over 6 s and then advances; it resumes where it
//   stopped after a pause and is stopped on unmount. Prefers-reduced-motion gets no autoplay
//   (Play still works) and plain cross-fades instead of wipes.
// - Autoplay pauses on mouse hover, keyboard focus and while dragging. Drag or swipe the stage
//   (60 px or a quick flick; left = next, right = previous), use ←/→/Home/End while it has
//   focus, the arrow buttons or the chapter ticks. A click that ends a drag is swallowed.
// - "View project" links point to #work-<project-id>; the next photo is preloaded.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ShowreelSlider from '@/TestComponent/PageSections/portfolio/Slider01';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <ShowreelSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    AnimatePresence,
    MotionConfig,
    animate,
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6
const FPS = 24
const EASE = [0.76, 0, 0.24, 1]
const EASE_OUT = [0.22, 1, 0.36, 1]

const reels = [
    {
        id: 'salt-and-stone',
        label: 'Salt & Stone',
        title: ['Salt &', 'Stone'],
        kind: 'Editorial',
        client: 'Maison Calloway',
        role: 'Photography, art direction',
        place: 'Folegandros, GR',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
        alt: 'Whitewashed island steps and pink bougainvillea above a deep blue bay',
        focus: 'object-[50%_55%]',
    },
    {
        id: 'night-shift',
        label: 'Night Shift',
        title: ['Night', 'Shift'],
        kind: 'Campaign',
        client: 'Kiyomi Audio',
        role: 'Art direction, photography',
        place: 'Shinjuku, Tokyo',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
        alt: 'Tokyo street at night lined with glowing neon signs',
        focus: 'object-[50%_45%]',
    },
    {
        id: 'quiet-rooms',
        label: 'Quiet Rooms',
        title: ['Quiet', 'Rooms'],
        kind: 'Interiors',
        client: 'Atelier Norden',
        role: 'Photography, set styling',
        place: 'Copenhagen, DK',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
        alt: 'Sunlit modern living room with sculptural chairs and a floor lamp',
        focus: 'object-[50%_50%]',
    },
    {
        id: 'soft-focus',
        label: 'Soft Focus',
        title: ['Soft', 'Focus'],
        kind: 'Portraits',
        client: 'Rosewater Magazine',
        role: 'Photography, casting',
        place: 'Lisbon, PT',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1600&q=80',
        alt: 'Woman with long wavy blonde hair posing against a pastel pink wall',
        focus: 'object-[50%_30%]',
    },
    {
        id: 'high-desert',
        label: 'High Desert',
        title: ['High', 'Desert'],
        kind: 'Road film',
        client: 'Vanta Outdoor',
        role: 'Art direction, stills',
        place: 'Moab, Utah',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80',
        alt: 'Camper van parked on an empty desert road between red rock formations',
        focus: 'object-[50%_60%]',
    },
]

const total = reels.length
const pad = (n) => String(n).padStart(2, '0')

// Reel position in seconds → SMPTE-style timecode at 24 fps.
const toTimecode = (seconds) => {
    const whole = Math.floor(seconds)
    const frames = Math.min(FPS - 1, Math.floor((seconds - whole) * FPS))
    return `00:00:${pad(whole)}:${pad(frames)}`
}

const frameWipe = {
    enter: (dir) => ({
        clipPath: dir < 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
        x: '0%',
        zIndex: 2,
    }),
    center: {
        clipPath: 'inset(0% 0% 0% 0%)',
        x: '0%',
        zIndex: 2,
        transition: { duration: 1.15, ease: EASE },
    },
    exit: (dir) => ({
        x: dir < 0 ? '12%' : '-12%',
        zIndex: 1,
        transition: { duration: 1.15, ease: EASE },
    }),
}

const frameFade = {
    enter: { opacity: 0, zIndex: 2 },
    center: { opacity: 1, zIndex: 2, transition: { duration: 0.5 } },
    exit: { opacity: 0, zIndex: 1, transition: { duration: 0.5 } },
}

const textGroup = {
    enter: {},
    center: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
    exit: { transition: { staggerChildren: 0.012 } },
}

const letter = {
    enter: { y: '108%', rotate: 7 },
    center: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: EASE_OUT } },
    exit: { y: '-108%', rotate: -3, transition: { duration: 0.4, ease: [0.55, 0, 1, 0.45] } },
}

const fadeUp = {
    enter: { opacity: 0, y: 14 },
    center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
}

const corners = [
    'left-3 top-3 border-l border-t sm:left-4 sm:top-4',
    'right-3 top-3 border-r border-t sm:right-4 sm:top-4',
    'bottom-3 left-3 border-b border-l sm:bottom-4 sm:left-4',
    'bottom-3 right-3 border-b border-r sm:bottom-4 sm:right-4',
]

export function ShowreelSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [[index, direction], setPage] = useState([0, 0])
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dragX = useMotionValue(0)
    const stageRef = useRef(null)
    const moved = useRef(false)
    const panning = useRef(false)
    const panAt = useRef(0)
    const snapBack = useRef(null)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const reel = reels[index]

    // Both read the current index through the render closure (useTransform re-runs it).
    const timecode = useTransform(progress, (p) => toTimecode((index + p) * AUTOPLAY_SECONDS))
    const playhead = useTransform(progress, (p) => `${((index + p) / total) * 100}%`)

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

    // Autoplay: fill progress 0 → 1, resuming from where it stopped after a pause.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    // Warm the cache for the next frame.
    useEffect(() => {
        const preload = new window.Image()
        preload.src = reels[(index + 1) % total].image
    }, [index])

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(total - 1)
        else return
        event.preventDefault()
        // A focused link in the leaving chapter would vanish; keep focus on the stage.
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
        dragX.set(Math.max(-36, Math.min(36, info.offset.x * 0.18)))
    }

    const handlePanEnd = (_, info) => {
        beginPan()
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        // Pan velocity reads low when the frame loop was idle (autoplay paused on hover), so a
        // short, quick swipe (< 250 ms, > 24 px) also counts as a flick in the drag direction.
        const flick = performance.now() - panAt.current < 250 && Math.abs(offset.x) > 24
        const horizontal = Math.abs(offset.x) > Math.abs(offset.y)
        if (horizontal && (offset.x < -60 || (offset.x < -10 && (velocity.x < -400 || flick)))) paginate(1)
        else if (horizontal && (offset.x > 60 || (offset.x > 10 && (velocity.x > 400 || flick)))) paginate(-1)
        snapBack.current = animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 32 })
    }

    const controlButton =
        'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#ede6da]/30 text-lg text-[#ede6da] transition-colors hover:border-[#ede6da] hover:bg-[#ede6da] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d2e]'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0a0a0a] p-2 text-base font-normal text-[#ede6da] sm:p-3 lg:p-4',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Theo Laurent showreel"
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
                    <motion.div
                        ref={stageRef}
                        role="group"
                        tabIndex={0}
                        aria-label="Showreel, drag or use the left and right arrow keys to browse"
                        className={cn(
                            '@container relative isolate h-[600px] touch-pan-y select-none overflow-hidden bg-[#161514] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d2e] sm:h-[660px] lg:h-[clamp(640px,86vh,800px)]',
                            dragging ? 'cursor-grabbing' : 'cursor-grab',
                        )}
                        onPointerDownCapture={() => {
                            moved.current = false
                        }}
                        onKeyDownCapture={() => {
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
                        onPanStart={beginPan}
                        onPan={handlePan}
                        onPanEnd={handlePanEnd}
                    >
                        <motion.div className="absolute inset-y-0 -inset-x-10" style={{ x: dragX }}>
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={reel.id}
                                    custom={direction}
                                    variants={reduce ? frameFade : frameWipe}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="absolute inset-0 overflow-hidden"
                                >
                                    <motion.img
                                        src={reel.image}
                                        alt={reel.alt}
                                        draggable={false}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        initial={{ scale: 1.25 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 1.8, ease: EASE_OUT }}
                                        className={cn('h-full w-full object-cover', reel.focus)}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-40 bg-linear-to-b from-black/70 to-black/0"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[78%] bg-linear-to-t from-black/90 via-black/45 to-black/0"
                        />
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[6] hidden sm:block">
                            {corners.map((corner) => (
                                <span key={corner} className={cn('absolute h-5 w-5 border-[#ede6da]/55', corner)} />
                            ))}
                            <span className="absolute left-1/2 top-1/2 hidden h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-[#ede6da]/35 md:block" />
                            <span className="absolute left-1/2 top-1/2 hidden h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-[#ede6da]/35 md:block" />
                        </div>

                        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-5 sm:p-8 lg:px-10">
                            <div className="leading-tight">
                                <p className="text-sm font-semibold tracking-tight text-[#ede6da] sm:text-base">Theo Laurent</p>
                                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede6da]/60">
                                    Photographer & Art Director
                                </p>
                            </div>
                            <p className="hidden pt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#ede6da]/60 md:block">
                                Showreel ’19 — ’26
                            </p>
                            <p className="flex items-center gap-2 pt-0.5 font-mono text-[11px] tabular-nums text-[#ede6da]/85">
                                <motion.span
                                    aria-hidden="true"
                                    className="h-2 w-2 rounded-full bg-[#ff4d2e]"
                                    animate={playing && !reduce ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                                    transition={
                                        playing && !reduce ? { duration: 1.2, repeat: Infinity } : { duration: 0.2 }
                                    }
                                />
                                <span className="uppercase tracking-[0.18em]">{playing ? 'Rec' : 'Hold'}</span>
                                <motion.span aria-hidden="true">{timecode}</motion.span>
                            </p>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5 sm:px-8 sm:pb-7 lg:px-10 lg:pb-9">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={reel.id}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${index + 1} of ${total}: ${reel.label}`}
                                    variants={textGroup}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="grid gap-5 @4xl:grid-cols-[minmax(0,1fr)_17rem] @4xl:items-end @4xl:gap-10"
                                >
                                    <div className="min-w-0">
                                        <motion.p
                                            variants={fadeUp}
                                            className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#ede6da]/75 sm:text-[11px]"
                                        >
                                            <span className="tabular-nums text-[#ede6da]">
                                                {pad(index + 1)} / {pad(total)}
                                            </span>
                                            <span aria-hidden="true" className="h-px w-8 bg-[#ff4d2e]" />
                                            {reel.kind}, {reel.year}
                                        </motion.p>
                                        <h2 className="mt-3 text-[min(13cqw,9rem)] font-black uppercase leading-[0.84] tracking-[-0.045em] text-[#ede6da] sm:mt-4 @4xl:text-[min(9cqw,10rem)]">
                                            <span className="sr-only">{reel.label}</span>
                                            {reel.title.map((line) => (
                                                <span
                                                    key={line}
                                                    aria-hidden="true"
                                                    className="block overflow-hidden whitespace-nowrap pb-[0.04em]"
                                                >
                                                    {Array.from(line).map((char, i) => (
                                                        <motion.span
                                                            key={`${line}-${i}`}
                                                            variants={letter}
                                                            className="inline-block origin-bottom-left"
                                                        >
                                                            {char === ' ' ? ' ' : char}
                                                        </motion.span>
                                                    ))}
                                                </span>
                                            ))}
                                        </h2>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 @4xl:block">
                                        <motion.dl variants={fadeUp} className="hidden text-sm @4xl:block">
                                            {[
                                                ['Client', reel.client],
                                                ['Role', reel.role],
                                                ['Location', reel.place],
                                                ['Year', reel.year],
                                            ].map(([term, value]) => (
                                                <div
                                                    key={term}
                                                    className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-t border-[#ede6da]/20 py-2.5"
                                                >
                                                    <dt className="font-mono text-[10px] uppercase leading-5 tracking-[0.2em] text-[#ede6da]/55">
                                                        {term}
                                                    </dt>
                                                    <dd className="leading-5 text-[#ede6da]">{value}</dd>
                                                </div>
                                            ))}
                                        </motion.dl>
                                        <motion.p
                                            variants={fadeUp}
                                            className="min-w-0 text-sm leading-5 text-[#ede6da]/80 @4xl:hidden"
                                        >
                                            <span className="text-[#ede6da]">{reel.client}</span>
                                            <span className="block text-[#ede6da]/60 sm:inline">
                                                <span className="hidden sm:inline"> · </span>
                                                {reel.place}
                                            </span>
                                        </motion.p>
                                        <motion.div variants={fadeUp} className="shrink-0 @4xl:mt-5">
                                            <a
                                                href={`#work-${reel.id}`}
                                                draggable={false}
                                                className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-[#ede6da] pl-5 pr-1.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d2e]"
                                            >
                                                View project
                                                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0a0a0a] text-[#ede6da] transition-transform duration-300 group-hover:rotate-45">
                                                    <HiArrowUpRight aria-hidden="true" />
                                                </span>
                                            </a>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-end sm:gap-6">
                                <div className="relative min-w-0 flex-1">
                                    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[#ede6da]/25">
                                        <motion.div className="absolute inset-y-0 left-0 bg-[#ede6da]" style={{ width: playhead }} />
                                    </div>
                                    <motion.div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute -top-2 z-10 h-5 w-[2px] -translate-x-1/2 bg-[#ff4d2e]"
                                        style={{ left: playhead }}
                                    >
                                        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#ff4d2e]" />
                                    </motion.div>
                                    <div role="group" aria-label="Choose a project" className="flex">
                                        {reels.map((item, i) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                aria-label={`Go to project ${i + 1}: ${item.label}`}
                                                aria-current={i === index ? 'true' : undefined}
                                                className="group relative flex h-11 min-w-0 flex-1 items-end gap-2 pb-1 pl-2 text-left focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#ff4d2e]"
                                                onClick={() => goTo(i)}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'absolute left-0 top-0 w-px transition-all',
                                                        i === index ? 'h-4 bg-[#ede6da]' : 'h-2.5 bg-[#ede6da]/50',
                                                    )}
                                                />
                                                <span
                                                    className={cn(
                                                        'font-mono text-[10px] tabular-nums tracking-[0.12em] transition-colors',
                                                        i === index
                                                            ? 'text-[#ede6da]'
                                                            : 'text-[#ede6da]/50 group-hover:text-[#ede6da]/80',
                                                    )}
                                                >
                                                    {pad(i + 1)}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'hidden truncate text-xs transition-colors md:block',
                                                        i === index
                                                            ? 'text-[#ede6da]'
                                                            : 'text-[#ede6da]/45 group-hover:text-[#ede6da]/75',
                                                    )}
                                                >
                                                    {item.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ede6da]/55 sm:hidden">
                                        Swipe or ← →
                                    </p>
                                    <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                                        Project {index + 1} of {total}: {reel.label}, {reel.client}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            aria-label={autoplayOn ? 'Pause showreel' : 'Play showreel'}
                                            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg text-[#ede6da]/85 transition-colors hover:bg-[#ede6da]/10 hover:text-[#ede6da] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d2e]"
                                            onClick={() => setPlayPref(!autoplayOn)}
                                        >
                                            {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Previous project"
                                            className={controlButton}
                                            onClick={() => paginate(-1)}
                                        >
                                            <HiArrowLongLeft aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Next project"
                                            className={controlButton}
                                            onClick={() => paginate(1)}
                                        >
                                            <HiArrowLongRight aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default ShowreelSlider

// PhotoEssaySlider

// Slider02 · Blogs & Digital Media › Animated Slider

// Description:
// Full-bleed black-and-white photo essay for the photography magazine Lens & Light:
// "Where the fog sits", seven frames from the Dolomites by Mara Lindqvist. Each frame
// fills the width of the page with a big "03 / 07" counter, a location stamp and a thin
// progress line; below it sit the frame title ("Above the inversion"), a caption, the
// place, coordinates, time and exposure, plus a contact-sheet strip of all seven frames.
// Use it for long-form visual stories, portfolio features or travel photo essays.

// Design:
// - Pure black #000000 page, white #ffffff type, white at 45–75% for secondary text and
//   white/15 hairlines; photos are grayscale with a touch of extra contrast.
// - Header: letter-spaced wordmark with an SVG aperture mark, mono meta line, serif
//   title text-[2.75rem] → sm:text-7xl → lg:text-[6.25rem] with an italic word; intro
//   paragraph beside it from lg (7 / 5 columns).
// - Stage is edge to edge: aspect-[4/5] → sm:aspect-[3/2] → lg:aspect-[2/1] (max 780px
//   tall). Serif counter top-left (text-6xl → lg:text-8xl), round 48px outline buttons
//   bottom-right, mono location stamp bottom-left, 2px progress line along the bottom.
// - Caption block: serif italic title, caption and a 2-column mono spec list (lg: 7 / 5
//   columns); invisible copies of every caption share one grid cell so height is stable.
//   Contact sheet: 7 square thumbnails in a 7-column grid on mobile, 3:2 frames from sm.
// - Motion: parallax slide (the new frame slides over, its photo counter-moves and
//   settles from a 1.16 zoom, the old frame drifts 35% and darkens), rolling counter
//   digits and a caption fade-up; reduced motion swaps all of it for a crossfade.

// What it does:
// - State: [index, direction], hover/focus/drag flags and a play/pause preference. A
//   framer-motion animate() fills the progress line over 7 s and advances to the next
//   frame; it resumes where it stopped after a pause and is stopped on unmount.
// - Autoplay pauses on mouse hover, keyboard focus inside the essay and while dragging;
//   it is off for prefers-reduced-motion unless the visitor presses Play.
// - Drag/swipe the photo (70 px or a quick flick; left = next, right = previous), ←/→/
//   Home/End while the essay has focus, the round prev/next buttons or the contact-sheet
//   thumbnails. Frames wrap around. The current frame is announced in an aria-live line.
// - Visual only: no links; the next frame's photo is preloaded.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PhotoEssaySlider from '@/TestComponent/PageSections/media/Slider02';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <PhotoEssaySlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 7
const EASE = [0.22, 1, 0.36, 1]
const SLIDE = { duration: 1.05, ease: [0.7, 0, 0.2, 1] }

const frames = [
    {
        id: 'inversion',
        title: 'Above the inversion',
        caption:
            'By six the valley towns vanish under a lid of cloud. Only the peaks of the Sella group stand clear, catching light the streets below won’t see for another hour.',
        place: 'Sass Pordoi, 2,950 m',
        coords: '46.49° N, 11.81° E',
        time: '06:12',
        exposure: '1/500 s · f/8 · ISO 100',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
        alt: 'Jagged mountain peaks rising above a sea of cloud at first light',
    },
    {
        id: 'still-water',
        title: 'Eleven still minutes',
        caption:
            'The lake holds perfectly flat until the first rowboats are untied at 07:30. I waited on the jetty with the focus already set on the far shore.',
        place: 'Lago di Braies',
        coords: '46.69° N, 12.08° E',
        time: '07:18',
        exposure: '1/125 s · f/11 · ISO 64',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80',
        alt: 'Wooden rowboat on a calm alpine lake below forested mountains',
    },
    {
        id: 'beech-fog',
        title: 'Where the fog sits',
        caption:
            'Fog pools in the beech wood long after the ridges have burned clear. The path disappears about forty metres in, and so does every sound.',
        place: 'Val di Funes',
        coords: '46.64° N, 11.69° E',
        time: '08:40',
        exposure: '1/60 s · f/5.6 · ISO 400',
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=400&q=80',
        alt: 'Footpath leading into a forest thick with mist',
    },
    {
        id: 'meltwater',
        title: 'Meltwater',
        caption:
            'In late September the river still runs loud and glacier-grey through the pines, carrying the last of the summer melt down the valley.',
        place: 'Rienz valley',
        coords: '46.74° N, 12.21° E',
        time: '10:05',
        exposure: '1/4 s · f/16 · ISO 50',
        image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=80',
        alt: 'River winding through a dense pine forest',
    },
    {
        id: 'long-basin',
        title: 'The long basin',
        caption:
            'Midday flattens everything, so I turned the camera on the reflection instead: a whole range folded into a lake no deeper than a church.',
        place: 'Lago di Misurina',
        coords: '46.58° N, 12.25° E',
        time: '12:30',
        exposure: '1/250 s · f/11 · ISO 100',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        alt: 'Still lake reflecting a mountain range under a wide sky',
    },
    {
        id: 'star-exposure',
        title: 'Fourteen minutes of stars',
        caption:
            'A single 14-minute exposure from the Seceda ridge, cold enough that the lens hood had frosted over before the shutter closed.',
        place: 'Seceda ridge, 2,519 m',
        coords: '46.60° N, 11.73° E',
        time: '23:47',
        exposure: '840 s · f/4 · ISO 200',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
        alt: 'Night sky full of stars above dark snow-capped mountains',
    },
    {
        id: 'walk-back',
        title: 'The walk back',
        caption:
            'Descending on the final morning. Every photograph in this essay was made within nine kilometres of this meadow.',
        place: 'Above Ortisei',
        coords: '46.57° N, 11.67° E',
        time: '07:02',
        exposure: '1/320 s · f/8 · ISO 100',
        image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=400&q=80',
        alt: 'Lone walker standing in an open field looking toward distant mountains',
    },
]

const total = frames.length
const pad = (n) => String(n).padStart(2, '0')

const frameParallax = {
    enter: (dir) => ({ x: dir < 0 ? '-100%' : '100%', zIndex: 2 }),
    center: { x: '0%', zIndex: 2, transition: SLIDE },
    exit: (dir) => ({ x: dir < 0 ? '35%' : '-35%', zIndex: 1, transition: SLIDE }),
}

const imageParallax = {
    enter: (dir) => ({ x: dir < 0 ? '60%' : '-60%', scale: 1.16 }),
    center: { x: '0%', scale: 1, transition: { x: SLIDE, scale: { duration: 1.8, ease: EASE } } },
    exit: { x: '0%', scale: 1.06, transition: SLIDE },
}

const shadeParallax = {
    enter: { opacity: 0 },
    center: { opacity: 0 },
    exit: { opacity: 0.65, transition: SLIDE },
}

const frameFade = {
    enter: { opacity: 0, zIndex: 2 },
    center: { opacity: 1, zIndex: 2, transition: { duration: 0.5 } },
    exit: { opacity: 0, zIndex: 1, transition: { duration: 0.5, delay: 0.2 } },
}

const captionGroup = {
    hidden: { transition: { duration: 0 } },
    shown: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
}

const fadeUp = {
    hidden: { opacity: 0, y: 14, transition: { duration: 0 } },
    shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

function ApertureMark() {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 shrink-0">
            <circle cx="16" cy="16" r="14.5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            <path
                d="M16 1.5 21 13M30.5 16 19 21M16 30.5 11 19M1.5 16 13 11M26.3 5.7 20.5 17.5M26.3 26.3 14.5 20.5M5.7 26.3 11.5 14.5M5.7 5.7 17.5 11.5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
            />
        </svg>
    )
}

export function PhotoEssaySlider({
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
    const frame = frames[index]

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

    // Autoplay: fill the progress line 0 → 1, resuming from where it stopped.
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
        preload.src = frames[(index + 1) % total].image
    }, [index])

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(total - 1)
        else return
        event.preventDefault()
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
        dragX.set(info.offset.x * 0.55)
    }

    const handlePanEnd = (_, info) => {
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        // Pan velocity reads low when the frame loop was idle, so a short, quick swipe
        // (< 250 ms, > 24 px) also counts as a flick in the drag direction.
        const flick = performance.now() - panAt.current < 250 && Math.abs(offset.x) > 24
        if (offset.x < -70 || (offset.x < -10 && (velocity.x < -400 || flick))) paginate(1)
        else if (offset.x > 70 || (offset.x > 10 && (velocity.x > 400 || flick))) paginate(-1)
        snapBack.current = animate(dragX, 0, { type: 'spring', stiffness: 260, damping: 32 })
    }

    const roundButton =
        'grid h-12 w-12 place-items-center rounded-full border border-white/45 bg-black/25 text-xl text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-black py-10 text-base font-normal text-white sm:py-14 lg:py-16', className)}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                    <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                        <div className="flex items-center gap-3">
                            <ApertureMark />
                            <span className="text-[13px] font-semibold uppercase tracking-[0.32em] text-white">
                                Lens & Light
                            </span>
                        </div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Essay No. 118</p>
                    </div>

                    <div className="grid gap-5 py-8 sm:py-10 lg:grid-cols-12 lg:items-end lg:gap-10 lg:py-14">
                        <div className="lg:col-span-7">
                            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/55">
                                Photo essay · 7 frames · Dolomites, Italy
                            </p>
                            <h2 className="mt-4 font-serif text-[2.75rem] font-normal leading-[0.92] tracking-[-0.03em] text-white sm:text-7xl lg:text-[6.25rem]">
                                Where the <span className="italic">fog</span> sits
                            </h2>
                        </div>
                        <div className="lg:col-span-5 lg:pb-2">
                            <p className="max-w-md text-base leading-7 text-white/70">
                                Four mornings above and below the cloud line, photographed in black and white by{' '}
                                <span className="text-white">Mara Lindqvist</span>.
                            </p>
                            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                                Published 21 Sep 2026 · Drag, swipe or use ← →
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Where the fog sits, a photo essay in seven frames"
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
                        aria-label="Photographs, drag or use the left and right arrow keys to browse"
                        className={cn(
                            'relative isolate aspect-[4/5] w-full touch-pan-y select-none overflow-hidden bg-[#111111] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white sm:aspect-[3/2] lg:aspect-[2/1] lg:max-h-[780px]',
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
                        <motion.div className="absolute inset-0" style={{ x: dragX }}>
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.figure
                                    key={frame.id}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`Frame ${index + 1} of ${total}: ${frame.title}`}
                                    custom={direction}
                                    variants={reduce ? frameFade : frameParallax}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="absolute inset-0 m-0 overflow-hidden"
                                >
                                    <motion.img
                                        src={frame.image}
                                        alt={frame.alt}
                                        draggable={false}
                                        custom={direction}
                                        variants={reduce ? undefined : imageParallax}
                                        className="absolute inset-0 h-full w-full object-cover contrast-[1.08] grayscale"
                                    />
                                    <motion.div
                                        aria-hidden="true"
                                        variants={reduce ? undefined : shadeParallax}
                                        className="absolute inset-0 bg-black opacity-0"
                                    />
                                </motion.figure>
                            </AnimatePresence>
                        </motion.div>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-black/55 via-transparent via-40% to-black/65"
                        />

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-4 z-10 flex items-baseline gap-2 sm:left-6 sm:top-6 lg:left-10 lg:top-8"
                        >
                            <span className="relative inline-flex h-[1em] overflow-hidden font-serif text-6xl leading-none tabular-nums sm:text-7xl lg:text-8xl">
                                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                                    <motion.span
                                        key={index}
                                        custom={direction}
                                        initial={{ y: direction < 0 ? '-100%' : '100%' }}
                                        animate={{ y: '0%' }}
                                        exit={{ y: direction < 0 ? '100%' : '-100%' }}
                                        transition={{ duration: 0.7, ease: EASE }}
                                        className="block"
                                    >
                                        {pad(index + 1)}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                            <span className="font-serif text-2xl text-white/60 sm:text-3xl">/ {pad(total)}</span>
                        </div>

                        <div className="absolute inset-x-4 bottom-5 z-10 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-7 lg:inset-x-10 lg:bottom-9">
                            <AnimatePresence initial={false} mode="wait">
                                <motion.p
                                    key={frame.id}
                                    aria-hidden="true"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="min-w-0 font-mono text-[10px] uppercase leading-5 tracking-[0.18em] text-white/80 sm:text-[11px]"
                                >
                                    <span className="block truncate text-white">{frame.place}</span>
                                    <span className="block truncate">
                                        {frame.coords} · {frame.time}
                                    </span>
                                </motion.p>
                            </AnimatePresence>
                            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    aria-label="Previous frame"
                                    className={roundButton}
                                    onClick={() => paginate(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next frame"
                                    className={roundButton}
                                    onClick={() => paginate(1)}
                                >
                                    <HiArrowLongRight aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-[2px] bg-white/20">
                            <motion.div
                                className="h-full origin-left bg-white"
                                style={{ scaleX: reduce && !autoplayOn ? 0 : progress }}
                            />
                        </div>
                    </motion.div>

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                        <div className="grid border-b border-white/15 py-8 sm:py-10">
                            {frames.map((item, i) => {
                                const active = i === index
                                return (
                                    <motion.div
                                        key={item.id}
                                        aria-hidden={active ? undefined : true}
                                        initial={false}
                                        animate={active ? 'shown' : 'hidden'}
                                        variants={captionGroup}
                                        className={cn(
                                            'grid gap-6 [grid-area:1/1] lg:grid-cols-12 lg:gap-10',
                                            !active && 'invisible',
                                        )}
                                    >
                                        <div className="lg:col-span-7">
                                            <motion.p
                                                variants={fadeUp}
                                                className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/50"
                                            >
                                                Frame {pad(i + 1)} of {pad(total)}
                                            </motion.p>
                                            <motion.h3
                                                variants={fadeUp}
                                                className="mt-3 font-serif text-3xl font-normal italic leading-tight tracking-[-0.01em] text-white sm:text-4xl"
                                            >
                                                {item.title}
                                            </motion.h3>
                                            <motion.p
                                                variants={fadeUp}
                                                className="mt-4 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8"
                                            >
                                                {item.caption}
                                            </motion.p>
                                        </div>
                                        <motion.dl
                                            variants={fadeUp}
                                            className="grid grid-cols-2 gap-x-6 gap-y-4 self-end border-t border-white/15 pt-5 font-mono text-xs lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
                                        >
                                            {[
                                                ['Location', item.place],
                                                ['Coordinates', item.coords],
                                                ['Local time', item.time],
                                                ['Exposure', item.exposure],
                                            ].map(([term, value]) => (
                                                <div key={term} className="min-w-0">
                                                    <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                                                        {term}
                                                    </dt>
                                                    <dd className="mt-1.5 text-white/90">{value}</dd>
                                                </div>
                                            ))}
                                        </motion.dl>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-end sm:justify-between">
                            <div
                                role="group"
                                aria-label="Choose a frame"
                                className="grid min-w-0 flex-1 grid-cols-7 gap-1.5 sm:max-w-[30rem] sm:gap-2 lg:max-w-[40rem]"
                            >
                                {frames.map((item, i) => {
                                    const active = i === index
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            aria-label={`Frame ${i + 1}: ${item.title}`}
                                            aria-current={active ? 'true' : undefined}
                                            className="group min-w-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                            onClick={() => goTo(i)}
                                        >
                                            <span
                                                className={cn(
                                                    'mb-1.5 block font-mono text-[10px] tabular-nums tracking-[0.12em] transition-colors',
                                                    active ? 'text-white' : 'text-white/40 group-hover:text-white/75',
                                                )}
                                            >
                                                {pad(i + 1)}
                                            </span>
                                            <span
                                                className={cn(
                                                    'relative block aspect-square overflow-hidden bg-[#1a1a1a] outline outline-1 outline-offset-2 transition-[outline-color] sm:aspect-[3/2]',
                                                    active ? 'outline-white' : 'outline-transparent',
                                                )}
                                            >
                                                <img
                                                    src={item.thumb}
                                                    alt=""
                                                    loading="lazy"
                                                    draggable={false}
                                                    className={cn(
                                                        'h-full w-full object-cover grayscale transition duration-500',
                                                        active ? 'opacity-100' : 'opacity-40 group-hover:opacity-75',
                                                    )}
                                                />
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex items-center justify-between gap-4 sm:justify-end">
                                <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                                    Frame {index + 1} of {total}: {frame.title}, {frame.place}
                                </p>
                                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 sm:hidden">
                                    {pad(index + 1)} / {pad(total)}
                                </p>
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause slideshow' : 'Play slideshow'}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/85 transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? (
                                        <HiMiniPause aria-hidden="true" className="text-base" />
                                    ) : (
                                        <HiMiniPlay aria-hidden="true" className="text-base" />
                                    )}
                                    {autoplayOn ? 'Pause' : 'Play'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default PhotoEssaySlider

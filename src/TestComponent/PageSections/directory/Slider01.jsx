// NeighbourhoodGuideSlider

// Slider01 · Directories & Search Aggregators › Animated Slider

// Description:
// A guidebook-style carousel for Townguide, "Neighbourhoods worth the detour." Five
// slides (Gion in Kyoto, Shinjuku after dark, San Polo in Venice, Manarola and the Rive
// Gauche) each pair a full photo with a sliding caption panel listing the top 3 places,
// vibe tags and a "Read the guide" link, while an index of all five doubles as the
// progress dots. Use it on a city-guide home page or a "where to stay / where to wander"
// feature.

// Design:
// - Cream #fdf6e3 paper, warm ink #1f1a14 and Townguide red #d62828; serif display
//   heading (text-4xl → lg:6xl), mono labels, 2px ink borders and a hard red offset
//   shadow on the panel
// - Stage: photo aspect-[4/3] → sm:16/10 → lg:h-[600px] with a coordinates stamp; the
//   caption panel sits below the photo on mobile and floats bottom-right (w-[420px]) on
//   lg
// - Caption height is fixed by an invisible stack of every caption, so slides never jump
// - Motion: direction-aware clip-path wipe with a slow zoom, old photo drifts away, panel
//   slides in after it; reduced motion swaps both for a plain crossfade
// - Index: 5 thin progress bars under the stage on mobile, a numbered vertical index with
//   names, cities and a red progress line in a 240px left column on lg

// What it does:
// - State: [index, direction], hover/focus/drag flags and a play/pause preference; a 6 s
//   progress motion value (animate(), stopped on pause/unmount) advances slides
// - Autoplay pauses on mouse hover, keyboard focus and while dragging, and is off for
//   prefers-reduced-motion users unless they press Play
// - The photo can be dragged or swiped (70 px, a fast fling, or a short flick under 250
//   ms and over 24 px); ←/→/Home/End work when the carousel has focus; prev/next and the
//   index buttons jump; the active slide is announced via aria-current and a live label
// - Place names link to #townguide-<slide>-<place>; "Read the guide" →
//   #townguide-<slide>; "All 48 guides" → #townguide-guides

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NeighbourhoodGuideSlider from '@/TestComponent/PageSections/directory/Slider01';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <NeighbourhoodGuideSlider />
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
import { HiArrowLongLeft, HiArrowLongRight, HiArrowRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6
const EASE = [0.22, 1, 0.36, 1]

const slides = [
    {
        id: 'gion',
        name: 'Gion',
        city: 'Kyoto, Japan',
        coords: '35.00° N · 135.78° E',
        summary: 'Wooden machiya, lantern-lit lanes and tea houses that open long before the tour buses arrive.',
        walk: '2.1 km loop · best at 7 am',
        places: [
            { id: 'kissa-tsubame', name: 'Kissa Tsubame', kind: 'Coffee', note: 'Siphon coffee and thick toast from 7 am' },
            { id: 'yasaka-lane', name: 'Yasaka lane walk', kind: 'Walk', note: 'Uphill to the pagoda before 8 am' },
            { id: 'shirakawa-soba', name: 'Shirakawa Soba', kind: 'Eat', note: 'Cold soba by the willow canal' },
        ],
        tags: ['Lantern-lit', 'Tea houses', 'Early starts'],
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
        alt: 'A sloping Kyoto street of wooden houses leading up to a five-storey pagoda',
        focus: 'object-[50%_45%]',
    },
    {
        id: 'shinjuku',
        name: 'Shinjuku after dark',
        city: 'Tokyo, Japan',
        coords: '35.69° N · 139.70° E',
        summary: 'Neon canyons, six-seat bars and yakitori smoke drifting down alleys barely a shoulder wide.',
        walk: '1.4 km · best after 9 pm',
        places: [
            { id: 'kemuri-yakitori', name: 'Kemuri Yakitori', kind: 'Eat', note: 'Charcoal skewers since 1978, six seats' },
            { id: 'bar-hoshizora', name: 'Bar Hoshizora', kind: 'Drink', note: 'Whisky highballs on the ninth floor' },
            { id: 'night-record-kan', name: 'Night Record Kan', kind: 'Shop', note: 'City-pop vinyl until 2 am' },
        ],
        tags: ['Neon', 'Standing bars', 'Open late'],
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
        alt: 'A busy Tokyo street at night lit by stacked neon signs',
        focus: 'object-[50%_50%]',
    },
    {
        id: 'san-polo',
        name: 'San Polo',
        city: 'Venice, Italy',
        coords: '45.44° N · 12.33° E',
        summary: 'Market mornings by the Rialto, cicchetti counters at noon and quiet canals once the day-trippers leave.',
        walk: '1.8 km · best before 10 am',
        places: [
            { id: 'cantina-due-ponti', name: 'Cantina Due Ponti', kind: 'Drink', note: 'Spritz and cicchetti at the counter' },
            { id: 'rialto-market', name: 'Rialto fish market', kind: 'See', note: 'Tue–Sat, busiest before 10 am' },
            { id: 'carta-marmorizzata', name: 'Carta Marmorizzata', kind: 'Shop', note: 'Hand-marbled paper since 1954' },
        ],
        tags: ['Canal-side', 'Cicchetti', 'Market mornings'],
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=80',
        alt: 'The Rialto bridge over the Grand Canal in Venice with gondolas below',
        focus: 'object-[50%_55%]',
    },
    {
        id: 'manarola',
        name: 'Manarola',
        city: 'Cinque Terre, Italy',
        coords: '44.11° N · 9.73° E',
        summary: 'Pastel houses stacked above a tiny harbour, with vineyard paths and sea swims straight off the rocks.',
        walk: '3.2 km · best at sunset',
        places: [
            { id: 'harbour-rocks', name: 'Harbour rocks', kind: 'Swim', note: 'Ladder into the sea, June to September' },
            { id: 'trattoria-scoglio', name: 'Trattoria Scoglio', kind: 'Eat', note: 'Trofie al pesto on the terrace' },
            { id: 'enoteca-terrazze', name: 'Enoteca Terrazze', kind: 'Drink', note: 'Local sciacchetrà at golden hour' },
        ],
        tags: ['Cliff paths', 'Sea swims', 'Sunset'],
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80',
        alt: 'Colourful houses stacked on a cliff above the sea in an Italian coastal village',
        focus: 'object-[50%_40%]',
    },
    {
        id: 'rive-gauche',
        name: 'Rive Gauche',
        city: 'Paris, France',
        coords: '48.85° N · 2.33° E',
        summary: 'Bookshops, zinc-bar bistros and long riverside walks that end on a bridge at dusk.',
        walk: '2.6 km · best at dusk',
        places: [
            { id: 'librairie-du-quai', name: 'Librairie du Quai', kind: 'Shop', note: 'Rare maps and poetry in English' },
            { id: 'bistrot-clement', name: 'Bistrot Clément', kind: 'Eat', note: 'Steak frites and a carafe of Brouilly' },
            { id: 'three-bridges', name: 'Three-bridge stroll', kind: 'Walk', note: 'Cross the Seine three times before dinner' },
        ],
        tags: ['Bookshops', 'Bistros', 'River walks'],
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
        alt: 'An ornate Paris bridge over the Seine glowing at dusk',
        focus: 'object-[50%_50%]',
    },
]

const total = slides.length
const pad = (n) => String(n).padStart(2, '0')

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62828]'

const wipe = {
    enter: (dir) => ({
        clipPath: dir < 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
        scale: 1.12,
        x: '0%',
        zIndex: 2,
    }),
    center: {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        x: '0%',
        zIndex: 2,
        transition: { clipPath: { duration: 0.95, ease: EASE }, scale: { duration: 1.8, ease: EASE } },
    },
    exit: (dir) => ({
        x: dir < 0 ? '8%' : '-8%',
        zIndex: 1,
        transition: { duration: 0.95, ease: EASE },
    }),
}

const fade = {
    enter: { opacity: 0, zIndex: 2 },
    center: { opacity: 1, zIndex: 2, transition: { duration: 0.5 } },
    exit: { opacity: 0, zIndex: 1, transition: { duration: 0.5 } },
}

const panel = {
    enter: (dir) => ({ x: dir < 0 ? -56 : 56, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, ease: EASE, delay: 0.25 } },
    exit: (dir) => ({ x: dir < 0 ? 40 : -40, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }),
}

function Caption({ slide, index, interactive = true }) {
    return (
        <div className="rounded-[4px] border-2 border-[#1f1a14] bg-[#fdf6e3] p-5 shadow-[6px_6px_0_#d62828] sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#d62828]">
                No. {pad(index + 1)} · {slide.city}
            </p>
            <h3 className="mt-2 font-serif text-3xl font-normal leading-[1.05] tracking-[-0.01em] text-[#1f1a14] sm:text-4xl">
                {slide.name}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#1f1a14]/75">{slide.summary}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1f1a14]/55">Top 3 places</p>
            <ol className="mt-2 divide-y divide-[#1f1a14]/15 border-y border-[#1f1a14]/15">
                {slide.places.map((place, i) => (
                    <li key={place.id} className="flex items-baseline gap-3 py-2.5">
                        <span className="font-mono text-xs text-[#d62828]">{i + 1}</span>
                        <span className="min-w-0 flex-1">
                            {interactive ? (
                                <a
                                    href={`#townguide-${slide.id}-${place.id}`}
                                    draggable={false}
                                    className={cn(
                                        'rounded text-sm font-semibold text-[#1f1a14] decoration-[#d62828] underline-offset-4 hover:underline',
                                        focusRing,
                                    )}
                                >
                                    {place.name}
                                </a>
                            ) : (
                                <span className="text-sm font-semibold">{place.name}</span>
                            )}
                            <span className="block text-xs leading-5 text-[#1f1a14]/65">{place.note}</span>
                        </span>
                        <span className="shrink-0 rounded-full border border-[#1f1a14]/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#1f1a14]/70">
                            {place.kind}
                        </span>
                    </li>
                ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-1.5" aria-label="Vibe">
                    {slide.tags.map((tag) => (
                        <li key={tag} className="rounded-full bg-[#1f1a14] px-2.5 py-1 text-[11px] font-medium text-[#fdf6e3]">
                            {tag}
                        </li>
                    ))}
                </ul>
                {interactive ? (
                    <a
                        href={`#townguide-${slide.id}`}
                        draggable={false}
                        className={cn(
                            'group inline-flex min-h-10 items-center gap-1.5 rounded text-sm font-semibold text-[#d62828]',
                            focusRing,
                        )}
                    >
                        Read the guide
                        <HiArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                ) : (
                    <span className="min-h-10 text-sm font-semibold">Read the guide</span>
                )}
            </div>
        </div>
    )
}

export function NeighbourhoodGuideSlider({
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
    const photoShift = useTransform(dragX, (v) => v * 0.35)
    const drag = useRef({ active: false, moved: false, t0: 0 })
    const regionRef = useRef(null)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const slide = slides[index]

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
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    useEffect(() => {
        const preload = new window.Image()
        preload.src = slides[(index + 1) % total].image
    }, [index])

    const beginDrag = () => {
        if (drag.current.active) return
        drag.current.active = true
        drag.current.moved = true
        setDragging(true)
    }

    const endDrag = (_, info) => {
        if (!drag.current.active) return
        drag.current.active = false
        setDragging(false)
        const dx = info.offset.x
        const vx = info.velocity.x
        const quick = performance.now() - drag.current.t0 < 250 && Math.abs(dx) > 24
        const fling = Math.abs(vx) > 500 && Math.sign(vx) === Math.sign(dx)
        animate(dragX, 0, { type: 'spring', stiffness: 320, damping: 34 })
        if (Math.abs(dx) > 70 || quick || fling) paginate(dx < 0 ? 1 : -1)
        // Let the click that follows pointerup see the drag, then reset.
        setTimeout(() => {
            drag.current.moved = false
        }, 0)
    }

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        if (!(event.key in moves) && event.key !== 'Home' && event.key !== 'End') return
        if (event.target.tagName === 'SELECT' || event.target.tagName === 'INPUT') return
        event.preventDefault()
        setFocused(true)
        if (event.key in moves) paginate(moves[event.key])
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

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fdf6e3] px-4 py-14 text-base font-normal text-[#1f1a14] sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center gap-4 border-b-2 border-[#1f1a14] pb-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                        <span className="font-semibold">Townguide</span>
                        <span aria-hidden="true" className="h-px flex-1 bg-[#1f1a14]/30" />
                        <span className="text-[#d62828]">Autumn edition · 2026</span>
                    </div>
                    <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <h2 className="max-w-3xl font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#1f1a14] sm:text-5xl lg:text-6xl">
                            Neighbourhoods <em className="text-[#d62828]">worth the detour.</em>
                        </h2>
                        <div className="max-w-sm">
                            <p className="text-base leading-7 text-[#1f1a14]/75">
                                Five walkable quarters picked by our local editors, each with the three places they
                                would send a friend first.
                            </p>
                            <a
                                href="#townguide-guides"
                                className={cn(
                                    'group mt-3 inline-flex min-h-10 items-center gap-2 rounded text-sm font-semibold underline decoration-[#d62828] decoration-2 underline-offset-4',
                                    focusRing,
                                )}
                            >
                                All 48 guides
                                <HiArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>

                    <div
                        ref={regionRef}
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Townguide neighbourhood guides"
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onPointerEnter={(event) => {
                            if (event.pointerType === 'mouse') setHovered(true)
                        }}
                        onPointerLeave={(event) => {
                            if (event.pointerType === 'mouse') setHovered(false)
                        }}
                        className={cn('mt-10 grid gap-6 rounded-[4px] lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10', focusRing, 'focus-visible:outline-offset-8')}
                    >
                        <div className="relative lg:order-2">
                            <motion.div
                                className="relative aspect-[4/3] w-full cursor-grab touch-pan-y select-none overflow-hidden rounded-[4px] border-2 border-[#1f1a14] bg-[#efe0bd] active:cursor-grabbing sm:aspect-[16/10] lg:aspect-auto lg:h-[600px]"
                                onPointerDown={() => {
                                    drag.current.t0 = performance.now()
                                    drag.current.moved = false
                                }}
                                onPanStart={beginDrag}
                                onPan={(_, info) => {
                                    beginDrag()
                                    dragX.set(info.offset.x)
                                }}
                                onPanEnd={endDrag}
                                onClickCapture={(event) => {
                                    if (drag.current.moved) {
                                        event.preventDefault()
                                        event.stopPropagation()
                                    }
                                }}
                            >
                                <motion.div className="absolute inset-0" style={{ x: photoShift }}>
                                    <AnimatePresence initial={false} custom={direction}>
                                        <motion.img
                                            key={slide.id}
                                            src={slide.image}
                                            alt={slide.alt}
                                            draggable={false}
                                            custom={direction}
                                            variants={reduce ? fade : wipe}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className={cn('absolute inset-0 h-full w-full object-cover', slide.focus)}
                                        />
                                    </AnimatePresence>
                                </motion.div>
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 z-[3] bg-linear-to-t from-[#1f1a14]/35 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-[#1f1a14]/30"
                                />
                                <div className="pointer-events-none absolute left-3 top-3 z-[4] sm:left-4 sm:top-4">
                                    <AnimatePresence initial={false} mode="wait">
                                        <motion.p
                                            key={slide.id}
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.3 }}
                                            className="rounded-[3px] bg-[#fdf6e3] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1f1a14] shadow-[3px_3px_0_#1f1a14] sm:text-[11px]"
                                        >
                                            {slide.coords}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>
                                <p className="pointer-events-none absolute bottom-8 left-8 z-[4] hidden font-mono text-[11px] uppercase tracking-[0.2em] text-[#fdf6e3] lg:block">
                                    {slide.walk}
                                </p>
                            </motion.div>

                            <div className="relative z-[5] mx-3 -mt-8 grid sm:mx-8 sm:-mt-12 lg:absolute lg:bottom-8 lg:right-8 lg:mx-0 lg:mt-0 lg:w-[420px]">
                                {slides.map((item, i) => (
                                    <div key={item.id} aria-hidden="true" className="invisible col-start-1 row-start-1">
                                        <Caption slide={item} index={i} interactive={false} />
                                    </div>
                                ))}
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={slide.id}
                                        role="group"
                                        aria-roledescription="slide"
                                        aria-label={`${index + 1} of ${total}: ${slide.name}, ${slide.city}`}
                                        custom={direction}
                                        variants={panel}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute inset-0"
                                    >
                                        <Caption slide={slide} index={index} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:order-1 lg:justify-between lg:gap-8">
                            <div role="group" aria-label="Choose a neighbourhood" className="flex gap-2 lg:flex-col lg:gap-0">
                                {slides.map((item, i) => {
                                    const current = i === index
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            aria-label={`Show ${item.name}, ${item.city}`}
                                            aria-current={current ? 'true' : undefined}
                                            onClick={() => goTo(i)}
                                            className={cn(
                                                'group relative flex h-10 min-w-0 flex-1 flex-col justify-center rounded-[3px] text-left lg:h-auto lg:flex-none lg:border-t lg:border-[#1f1a14]/20 lg:py-4 lg:last:border-b',
                                                focusRing,
                                            )}
                                        >
                                            <span className="block h-[3px] overflow-hidden rounded-full bg-[#1f1a14]/15 lg:hidden">
                                                <motion.span
                                                    className="block h-full origin-left rounded-full bg-[#d62828]"
                                                    style={{ scaleX: current ? (reduce && !playPref ? 1 : progress) : i < index ? 1 : 0 }}
                                                />
                                            </span>
                                            <span className="hidden items-baseline gap-3 lg:flex">
                                                <span
                                                    className={cn(
                                                        'font-mono text-xs transition-colors',
                                                        current ? 'text-[#d62828]' : 'text-[#1f1a14]/45',
                                                    )}
                                                >
                                                    {pad(i + 1)}
                                                </span>
                                                <span className="min-w-0">
                                                    <span
                                                        className={cn(
                                                            'block truncate font-serif text-xl leading-tight transition-colors',
                                                            current ? 'text-[#1f1a14]' : 'text-[#1f1a14]/55 group-hover:text-[#1f1a14]',
                                                        )}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#1f1a14]/50">
                                                        {item.city}
                                                    </span>
                                                </span>
                                            </span>
                                            {current ? (
                                                <span className="absolute inset-x-0 -top-px hidden h-[2px] lg:block">
                                                    <motion.span
                                                        className="block h-full origin-left bg-[#d62828]"
                                                        style={{ scaleX: reduce && !playPref ? 1 : progress }}
                                                    />
                                                </span>
                                            ) : null}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <p className="font-mono text-sm tabular-nums">
                                    <span className="text-2xl text-[#d62828]">{pad(index + 1)}</span>
                                    <span className="text-[#1f1a14]/50"> / {pad(total)}</span>
                                </p>
                                <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                                    Slide {index + 1} of {total}: {slide.name}, {slide.city}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                        onClick={() => setPlayPref(!autoplayOn)}
                                        className={cn(
                                            'grid h-11 w-11 place-items-center rounded-full text-lg text-[#1f1a14] transition-colors hover:bg-[#1f1a14]/10',
                                            focusRing,
                                        )}
                                    >
                                        {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Previous neighbourhood"
                                        onClick={() => paginate(-1)}
                                        className={cn(
                                            'grid h-11 w-11 place-items-center rounded-[3px] border-2 border-[#1f1a14] text-lg transition-colors hover:bg-[#1f1a14] hover:text-[#fdf6e3]',
                                            focusRing,
                                        )}
                                    >
                                        <HiArrowLongLeft aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next neighbourhood"
                                        onClick={() => paginate(1)}
                                        className={cn(
                                            'grid h-11 w-11 place-items-center rounded-[3px] border-2 border-[#1f1a14] bg-[#1f1a14] text-lg text-[#fdf6e3] shadow-[3px_3px_0_#d62828] transition-colors hover:bg-[#d62828]',
                                            focusRing,
                                        )}
                                    >
                                        <HiArrowLongRight aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default NeighbourhoodGuideSlider

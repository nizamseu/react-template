// CategorySpotlightSlider

// Slider03 · Directories & Search Aggregators › Animated Slider

// Description:
// A bold category carousel for Callout, "Explore Dhaka by mood." Six category slides
// (Food & Drink, Nightlife, Wellness, Services, Culture, Outdoors) each show a giant icon
// sitting in a morphing blob, a place count, a one-line pitch, sub-category chips, what's
// trending and an "Explore Nightlife"-style CTA, while the background gradient shifts
// with every slide. Use it on a directory home page to route people into the main
// categories.

// Design:
// - Deep violet #2e1065 section; the stage is a rounded-[32px] panel whose layered radial
//   + linear gradient crossfades per slide (violet, plum, indigo, fuchsia) with pink
//   #f472b6 accents; a giant faint mono slide number sits behind the content
// - Text: mono pink eyebrow, huge tight sans title (text-5xl → sm:6xl → lg:7xl), stat
//   row, outlined chips and a white pill CTA; text height is fixed by an invisible stack
//   of all slides so the stage never jumps
// - Icon: an SVG blob (8-point Catmull-Rom path) morphs its shape and gradient between
//   slides inside a slowly spinning dashed ring, and the icon springs in with scale +
//   rotate
// - Controls: pill dots (active dot widens and fills with the 5.5 s progress), counter
//   with the category name, pause and prev/next; MotionConfig reducedMotion="user"
// - Responsive: icon above text on mobile (w-56 → sm:w-72), side by side from lg; padding
//   grows p-5 → sm:p-10 → lg:p-14; the control bar wraps below 640px

// What it does:
// - State: [index, direction], hover/focus/drag flags and a play preference; a framer
//   animate() progress value advances every 5.5 s and is stopped on pause/unmount
// - Autoplay pauses on hover, keyboard focus and drag, and is off for
//   prefers-reduced-motion users (the ring stops spinning too) unless they press Play
// - Drag/swipe the stage (70 px, a matching fast fling, or a flick under 250 ms and over
//   24 px); ←/→/Home/End keys when focused; dots and prev/next jump; the active slide is
//   exposed via aria-current on its dot and a polite live label
// - Chips link to #callout-<category>-<chip>, the CTA to #callout-<category>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CategorySpotlightSlider from '@/TestComponent/PageSections/directory/Slider03';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <CategorySpotlightSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowRight, HiMiniPause, HiMiniPlay, HiOutlineMegaphone } from 'react-icons/hi2';
import {
    PiFlowerLotusDuotone,
    PiForkKnifeDuotone,
    PiMartiniDuotone,
    PiMountainsDuotone,
    PiPaletteDuotone,
    PiWrenchDuotone,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 5.5
const EASE = [0.22, 1, 0.36, 1]

function blobPath(radii) {
    const n = radii.length
    const pts = radii.map((r, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2
        return [200 + Math.cos(a) * r, 200 + Math.sin(a) * r]
    })
    const f = (v) => v.toFixed(1)
    let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`
    for (let i = 0; i < n; i += 1) {
        const p0 = pts[(i - 1 + n) % n]
        const p1 = pts[i]
        const p2 = pts[(i + 1) % n]
        const p3 = pts[(i + 2) % n]
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
        d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
    }
    return `${d} Z`
}

const slides = [
    {
        id: 'food-drink',
        name: 'Food & Drink',
        short: 'Food & Drink',
        Icon: PiForkKnifeDuotone,
        count: 412,
        fresh: 38,
        avg: 4.5,
        pitch: 'From 3 am tehari to twelve-course tasting menus.',
        chips: ['Biryani', 'Rooftops', 'Street food', 'Bakeries'],
        trending: ['Halim Corner', 'Ember & Oak', 'Morning Loaf'],
        accent: '#f472b6',
        accent2: '#fbcfe8',
        blob: blobPath([168, 150, 176, 142, 170, 154, 178, 146]),
        bg: 'radial-gradient(120% 90% at 85% 15%, rgba(219,39,119,0.55) 0%, rgba(219,39,119,0) 55%), linear-gradient(135deg, #3b0764 0%, #2e1065 60%, #1e0a45 100%)',
    },
    {
        id: 'nightlife',
        name: 'Nightlife',
        short: 'Nightlife',
        Icon: PiMartiniDuotone,
        count: 138,
        fresh: 12,
        avg: 4.3,
        pitch: 'Rooftop bars, jazz rooms and dance floors that start after midnight.',
        chips: ['Rooftop bars', 'Live jazz', 'Karaoke', 'Lounges'],
        trending: ['Bar Hoshizora', 'Blue Note Room', 'Skyline 21'],
        accent: '#e879f9',
        accent2: '#f5d0fe',
        blob: blobPath([150, 182, 140, 176, 158, 184, 136, 172]),
        bg: 'radial-gradient(110% 90% at 15% 85%, rgba(192,38,211,0.55) 0%, rgba(192,38,211,0) 55%), linear-gradient(160deg, #1e1b4b 0%, #2e1065 55%, #4a044e 100%)',
    },
    {
        id: 'wellness',
        name: 'Wellness',
        short: 'Wellness',
        Icon: PiFlowerLotusDuotone,
        count: 204,
        fresh: 17,
        avg: 4.7,
        pitch: 'Yoga lofts, hammams and day spas for a slow Saturday.',
        chips: ['Yoga', 'Day spas', 'Pilates', 'Ayurveda'],
        trending: ['Calm Room Day Spa', 'Lotus Loft', 'Breathe Studio'],
        accent: '#f9a8d4',
        accent2: '#fdf2f8',
        blob: blobPath([176, 168, 160, 172, 178, 166, 158, 170]),
        bg: 'radial-gradient(120% 100% at 80% 80%, rgba(244,114,182,0.45) 0%, rgba(244,114,182,0) 55%), linear-gradient(135deg, #4c1d95 0%, #2e1065 55%, #3b0764 100%)',
    },
    {
        id: 'services',
        name: 'Services',
        short: 'Services',
        Icon: PiWrenchDuotone,
        count: 596,
        fresh: 54,
        avg: 4.4,
        pitch: 'Plumbers, tailors and phone repairs rated by your neighbours.',
        chips: ['AC repair', 'Tailors', 'Cleaners', 'Movers'],
        trending: ['Tailor & Thread', 'CoolFix AC', 'Greenwheel Cycles'],
        accent: '#fb7185',
        accent2: '#ffe4e6',
        blob: blobPath([142, 178, 150, 186, 140, 176, 152, 184]),
        bg: 'radial-gradient(120% 90% at 10% 10%, rgba(225,29,72,0.45) 0%, rgba(225,29,72,0) 55%), linear-gradient(135deg, #2e1065 0%, #312e81 60%, #1e0a45 100%)',
    },
    {
        id: 'culture',
        name: 'Culture',
        short: 'Culture',
        Icon: PiPaletteDuotone,
        count: 97,
        fresh: 9,
        avg: 4.6,
        pitch: 'Galleries, indie cinemas and bookshops with readings every week.',
        chips: ['Galleries', 'Indie cinema', 'Theatre', 'Readings'],
        trending: ['Chhaya Art Gallery', 'Paperboat Books', 'Reel 35'],
        accent: '#c084fc',
        accent2: '#f3e8ff',
        blob: blobPath([180, 146, 166, 152, 184, 142, 170, 150]),
        bg: 'radial-gradient(110% 90% at 90% 90%, rgba(147,51,234,0.6) 0%, rgba(147,51,234,0) 55%), linear-gradient(145deg, #2e1065 0%, #3b0764 50%, #581c87 100%)',
    },
    {
        id: 'outdoors',
        name: 'Outdoors',
        short: 'Outdoors',
        Icon: PiMountainsDuotone,
        count: 76,
        fresh: 6,
        avg: 4.5,
        pitch: 'Lakeside loops, cycling routes and escapes within two hours of town.',
        chips: ['Parks', 'Cycling', 'Boating', 'Day trips'],
        trending: ['Dhanmondi Lake loop', 'Hatirjheel ride', 'Sreemangal tea trail'],
        accent: '#f0abfc',
        accent2: '#fae8ff',
        blob: blobPath([160, 174, 182, 150, 164, 178, 186, 148]),
        bg: 'radial-gradient(120% 90% at 50% 0%, rgba(217,70,239,0.45) 0%, rgba(217,70,239,0) 55%), linear-gradient(180deg, #2e1065 0%, #1e1b4b 100%)',
    },
]

const total = slides.length
const totalPlaces = slides.reduce((sum, s) => sum + s.count, 0)
const pad = (n) => String(n).padStart(2, '0')

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9a8d4]'

const textVariants = {
    enter: (dir) => ({ x: dir < 0 ? -48 : 48, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, ease: EASE, delay: 0.1 } },
    exit: (dir) => ({ x: dir < 0 ? 32 : -32, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }),
}

const iconVariants = {
    enter: (dir) => ({ scale: 0.35, rotate: dir < 0 ? 35 : -35, opacity: 0 }),
    center: { scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 16, delay: 0.1 } },
    exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
}

function SlideText({ slide, index, interactive = true }) {
    const Tag = interactive ? 'a' : 'span'
    return (
        <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: slide.accent }}>
                Category {pad(index + 1)} / {pad(total)}
            </p>
            <h3 className="mt-3 text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                {slide.name}
            </h3>
            <p className="mt-4 max-w-md text-lg leading-7 text-violet-100/85">{slide.pitch}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {[
                    ['Places', slide.count.toLocaleString('en-US')],
                    ['New this month', `+${slide.fresh}`],
                    ['Avg. rating', `${slide.avg} ★`],
                ].map(([label, value]) => (
                    <div key={label}>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-violet-200/60">{label}</dt>
                        <dd className="mt-0.5 text-xl font-semibold tabular-nums text-white">{value}</dd>
                    </div>
                ))}
            </dl>
            <ul className="mt-6 flex flex-wrap gap-2">
                {slide.chips.map((chip) => (
                    <li key={chip}>
                        <Tag
                            {...(interactive
                                ? { href: `#callout-${slide.id}-${chip.toLowerCase().replace(/\s+/g, '-')}`, draggable: false }
                                : {})}
                            className={cn(
                                'inline-flex min-h-10 items-center rounded-full border border-white/25 px-4 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10',
                                focusRing,
                            )}
                        >
                            {chip}
                        </Tag>
                    </li>
                ))}
            </ul>
            <p className="mt-5 text-sm text-violet-200/75">
                <span className="font-semibold text-white">Trending:</span> {slide.trending.join(' · ')}
            </p>
            <Tag
                {...(interactive ? { href: `#callout-${slide.id}`, draggable: false } : {})}
                className={cn(
                    'group mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-white pl-6 pr-2 text-sm font-semibold text-[#2e1065] transition-transform duration-300 hover:-translate-y-0.5',
                    focusRing,
                )}
            >
                Explore {slide.short}
                <span
                    className="grid h-9 w-9 place-items-center rounded-full text-[#2e1065] transition-transform duration-300 group-hover:translate-x-0.5"
                    style={{ backgroundColor: slide.accent }}
                >
                    <HiArrowRight aria-hidden="true" />
                </span>
            </Tag>
        </div>
    )
}

export function CategorySpotlightSlider({
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
    const drag = useRef({ active: false, moved: false, t0: 0 })
    const gradId = `cs${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const slide = slides[index]
    const { Icon } = slide

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
        if (Math.abs(dx) > 70 || quick || fling) paginate(dx < 0 ? 1 : -1)
        setTimeout(() => {
            drag.current.moved = false
        }, 0)
    }

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        if (!(event.key in moves) && event.key !== 'Home' && event.key !== 'End') return
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
                'relative overflow-hidden bg-[#2e1065] px-4 py-14 text-base font-normal text-violet-100 sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f472b6] text-[#2e1065]">
                                    <HiOutlineMegaphone aria-hidden="true" />
                                </span>
                                Callout
                            </p>
                            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                                Explore Dhaka <span className="text-[#f472b6]">by mood.</span>
                            </h2>
                        </div>
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-200/70">
                            {total} categories · {totalPlaces.toLocaleString('en-US')} places
                        </p>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Callout category spotlight"
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
                        className={cn(
                            'relative isolate mt-10 overflow-hidden rounded-[28px] border border-white/10 sm:rounded-[32px]',
                            focusRing,
                            'focus-visible:outline-offset-4',
                        )}
                    >
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={slide.id}
                                aria-hidden="true"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.9, ease: 'easeInOut' }}
                                className="absolute inset-0 -z-10"
                                style={{ backgroundImage: slide.bg }}
                            />
                        </AnimatePresence>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-8 -left-2 -z-10 font-mono text-[9rem] font-semibold leading-none text-white/[0.05] sm:text-[13rem] lg:text-[18rem]"
                        >
                            {pad(index + 1)}
                        </span>

                        <motion.div
                            onPointerDown={() => {
                                drag.current.t0 = performance.now()
                                drag.current.moved = false
                            }}
                            onPanStart={beginDrag}
                            onPan={beginDrag}
                            onPanEnd={endDrag}
                            onClickCapture={(event) => {
                                if (drag.current.moved) {
                                    event.preventDefault()
                                    event.stopPropagation()
                                }
                            }}
                            className="grid cursor-grab touch-pan-y select-none items-center gap-6 p-5 active:cursor-grabbing sm:gap-10 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:p-14"
                        >
                            <div className="relative mx-auto aspect-square w-56 sm:w-72 lg:order-2 lg:w-full lg:max-w-[440px]">
                                <motion.div
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-full border-2 border-dashed border-white/20"
                                    animate={reduce ? { rotate: 0 } : { rotate: 360 }}
                                    transition={reduce ? { duration: 0 } : { duration: 40, ease: 'linear', repeat: Infinity }}
                                />
                                <svg viewBox="0 0 400 400" className="absolute inset-[6%] h-[88%] w-[88%] overflow-visible" aria-hidden="true">
                                    <defs>
                                        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                                            <motion.stop
                                                offset="0%"
                                                initial={false}
                                                animate={{ stopColor: slide.accent2 }}
                                                transition={{ duration: 0.9 }}
                                            />
                                            <motion.stop
                                                offset="100%"
                                                initial={false}
                                                animate={{ stopColor: slide.accent }}
                                                transition={{ duration: 0.9 }}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <g transform="translate(200 200) scale(1.1) rotate(18) translate(-200 -200)">
                                        <motion.path
                                            initial={false}
                                            animate={{ d: slide.blob }}
                                            transition={{ duration: 0.9, ease: EASE }}
                                            fill="none"
                                            stroke="rgba(255,255,255,0.25)"
                                            strokeWidth="1.5"
                                        />
                                    </g>
                                    <motion.path
                                        initial={false}
                                        animate={{ d: slide.blob }}
                                        transition={{ duration: 0.9, ease: EASE }}
                                        fill={`url(#${gradId})`}
                                    />
                                </svg>
                                <div className="absolute inset-0 grid place-items-center">
                                    <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                                        <motion.span
                                            key={slide.id}
                                            custom={direction}
                                            variants={iconVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            aria-hidden="true"
                                            className="block text-[6.5rem] text-[#2e1065] drop-shadow-[0_18px_30px_rgba(46,16,101,0.35)] sm:text-[8.5rem] lg:text-[11rem]"
                                        >
                                            <Icon />
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                                <span className="absolute right-0 top-[8%] rounded-full bg-white px-3 py-1.5 text-xs font-semibold tabular-nums text-[#2e1065] shadow-lg sm:text-sm">
                                    {slide.count} places
                                </span>
                            </div>

                            <div className="relative grid lg:order-1">
                                {slides.map((item, i) => (
                                    <div key={item.id} aria-hidden="true" className="invisible col-start-1 row-start-1">
                                        <SlideText slide={item} index={i} interactive={false} />
                                    </div>
                                ))}
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={slide.id}
                                        role="group"
                                        aria-roledescription="slide"
                                        aria-label={`${index + 1} of ${total}: ${slide.name}`}
                                        custom={direction}
                                        variants={textVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute inset-0"
                                    >
                                        <SlideText slide={slide} index={index} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#1e0a45]/40 px-5 py-4 backdrop-blur-sm sm:px-10 lg:px-14">
                            <div role="group" aria-label="Choose a category" className="flex items-center gap-1">
                                {slides.map((item, i) => {
                                    const current = i === index
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            aria-label={`Show ${item.name}`}
                                            aria-current={current ? 'true' : undefined}
                                            onClick={() => goTo(i)}
                                            className={cn('group grid h-10 place-items-center rounded-full px-1', focusRing)}
                                        >
                                            <span
                                                className={cn(
                                                    'relative block h-2.5 overflow-hidden rounded-full transition-[width,background-color] duration-500',
                                                    current ? 'w-10 bg-white/25' : 'w-2.5 bg-white/35 group-hover:bg-white/70',
                                                )}
                                            >
                                                {current ? (
                                                    <motion.span
                                                        className="absolute inset-0 origin-left rounded-full bg-[#f472b6]"
                                                        style={{ scaleX: reduce && !playPref ? 1 : progress }}
                                                    />
                                                ) : null}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                            <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="order-3 w-full font-mono text-xs uppercase tracking-[0.18em] text-violet-200/80 sm:order-none sm:w-auto">
                                <span className="text-white">{pad(index + 1)}</span> / {pad(total)} · {slide.name}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    onClick={() => setPlayPref(!autoplayOn)}
                                    className={cn(
                                        'grid h-11 w-11 place-items-center rounded-full text-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white',
                                        focusRing,
                                    )}
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous category"
                                    onClick={() => paginate(-1)}
                                    className={cn(
                                        'grid h-11 w-11 place-items-center rounded-full border border-white/25 text-lg text-white transition-colors hover:border-white hover:bg-white hover:text-[#2e1065]',
                                        focusRing,
                                    )}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next category"
                                    onClick={() => paginate(1)}
                                    className={cn(
                                        'grid h-11 w-11 place-items-center rounded-full bg-[#f472b6] text-lg text-[#2e1065] transition-colors hover:bg-[#f9a8d4]',
                                        focusRing,
                                    )}
                                >
                                    <HiArrowLongRight aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default CategorySpotlightSlider

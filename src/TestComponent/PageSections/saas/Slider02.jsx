// CaseMetricSlider

// Slider02 · SaaS Platforms › Animated Slider

// Description:
// A dark, high-contrast case-study carousel for Scaleup, a product-led growth platform.
// Under "Growth you can put in a board deck." five customer stories (Kestrel, Oakline,
// Vantage Labs, Polymer, Tidewater) each lead with one huge result such as "+212%
// trial-to-paid conversion", a before/after bar pair, the client wordmark and a quote
// with portrait. Use it on a SaaS homepage, customers page or pricing page as proof.

// Design:
// - Near-black #0a0a0a background with faint 80px vertical grid lines and a blurred green
//   glow; text #f5f5f5 / #a3a3a3; electric green #00ff94 for the active metric, bars,
//   progress, quote mark and hover fills; cards #111111 with white/10 hairlines, rounded-[28px].
// - Peek track: cards are w-[86%] → sm:w-[80%] → lg:w-[72%] of the container with gap-4 →
//   lg:gap-6; neighbours bleed to the viewport edge (clipped by the root's overflow-hidden)
//   and dim to 35%; card body is one column, then two columns (metric / quote) from lg.
// - Metric type: semibold, tracking-[-0.06em], text-[4.25rem] → sm:text-[6.5rem] →
//   lg:text-[7.5rem]; inactive cards show it as an outline (-webkit-text-stroke).
//   Wordmarks are type + simple SVG marks; mono uppercase labels; square 48px buttons.
// - Motion: the track follows the pointer and springs to the snapped card; the active
//   metric counts up, its "after" bar grows; the counter cross-fades; the wordmark rail
//   shows a 7 s progress line. MotionConfig reducedMotion="user" drops transforms.
// - Bottom rail: 5 wordmark buttons (SVG mark only below lg, mark + name from lg).

// What it does:
// - State: [index, direction], hover/focus/drag flags, the measured card step (card width
//   + gap, kept up to date with a ResizeObserver) and a play/pause preference.
// - Drag/swipe the track with mouse or touch (framer-motion pan, touch-action pan-y): it
//   follows the pointer with rubber-banding at both ends; releasing snaps by distance (max
//   2 cards) or moves one card on a flick, never against the drag direction. Clicking a
//   dimmed neighbour card opens it; ←/→/Home/End work while the carousel has focus;
//   prev/next buttons and autoplay wrap round.
// - Autoplay: animate() fills a progress motion value over 7 s, pauses on hover, keyboard
//   focus or drag, resumes where it stopped, stops on unmount and is off for
//   prefers-reduced-motion until Play is pressed. Count-ups show the final value instantly
//   for reduced motion and on the server.
// - An sr-only aria-live label announces "Case study 2 of 5: Oakline, −38% time to first
//   value" (polite while paused); "Read the … story" links go to #case-<client>, "All 120+
//   case studies" → #scaleup-customers. A click that ends a drag is ignored.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CaseMetricSlider from '@/TestComponent/PageSections/saas/Slider02';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <CaseMetricSlider />
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
import { HiArrowLeft, HiArrowRight, HiArrowUpRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 7
const EASE = [0.16, 1, 0.3, 1]

const cases = [
    {
        id: 'kestrel',
        client: 'Kestrel',
        sector: 'Fintech · Series B',
        metric: { prefix: '+', value: 212, decimals: 0, suffix: '%' },
        label: 'trial-to-paid conversion',
        timeframe: 'in 90 days · Q2 2026',
        before: { label: 'Before', value: '4.1%', pct: 32 },
        after: { label: 'After', value: '12.8%', pct: 100 },
        quote: 'We ran 41 onboarding experiments in one quarter. Scaleup turned our free trial into the best salesperson we have.',
        name: 'Priya Raman',
        role: 'VP Growth, Kestrel',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        alt: 'Priya Raman, smiling, in a grey blazer',
    },
    {
        id: 'oakline',
        client: 'Oakline',
        sector: 'Field service · Series A',
        metric: { prefix: '−', value: 38, decimals: 0, suffix: '%' },
        label: 'time to first value',
        timeframe: '9.1 → 5.6 days · in 8 weeks',
        before: { label: 'Before', value: '9.1 d', pct: 100 },
        after: { label: 'After', value: '5.6 d', pct: 62 },
        quote: 'Checklists, nudges and a paywall test shipped in a week — without borrowing a single sprint from engineering.',
        name: 'Marcus Bell',
        role: 'Head of Product, Oakline',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        alt: 'Marcus Bell in glasses and a dark suit',
    },
    {
        id: 'vantage',
        client: 'Vantage Labs',
        sector: 'Biotech SaaS · Growth',
        metric: { prefix: '$', value: 4.8, decimals: 1, suffix: 'M' },
        label: 'new expansion ARR',
        timeframe: 'FY2026 · from in-app upgrades',
        before: { label: 'FY25', value: '$1.9M', pct: 40 },
        after: { label: 'FY26', value: '$4.8M', pct: 100 },
        quote: 'Usage-based upgrade prompts now book more expansion revenue than our account managers did in all of 2025.',
        name: 'Dr. Amara Nwosu',
        role: 'COO, Vantage Labs',
        photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
        alt: 'Dr. Amara Nwosu, smiling, with curly hair and a blazer',
    },
    {
        id: 'polymer',
        client: 'Polymer',
        sector: 'Developer tools · Seed',
        metric: { prefix: '', value: 3.1, decimals: 1, suffix: '×' },
        label: 'weekly active teams',
        timeframe: '12 months after launch',
        before: { label: 'Launch', value: '1,240', pct: 32 },
        after: { label: 'Now', value: '3,850', pct: 100 },
        quote: 'Scaleup showed us exactly where new teams stalled. Fixing two onboarding steps tripled our weekly actives.',
        name: 'Jonas Weber',
        role: 'Co-founder & CEO, Polymer',
        photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
        alt: 'Jonas Weber with glasses and a beard',
    },
    {
        id: 'tidewater',
        client: 'Tidewater',
        sector: 'Logistics · Series C',
        metric: { prefix: '−', value: 27, decimals: 0, suffix: '%' },
        label: 'logo churn',
        timeframe: 'year over year · 2,300 accounts',
        before: { label: '2025', value: '11.2%', pct: 100 },
        after: { label: '2026', value: '8.2%', pct: 73 },
        quote: 'Health scores and save offers flag at-risk fleets weeks earlier. Churn is finally a number we control.',
        name: 'Sofia Marin',
        role: 'Director of Customer Success, Tidewater',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        alt: 'Sofia Marin, smiling, with her hair in a bun',
    },
]

const total = cases.length
const pad = (n) => String(n).padStart(2, '0')
const formatMetric = (metric, v) => `${metric.prefix}${v.toFixed(metric.decimals)}${metric.suffix}`

const wordmarks = {
    kestrel: {
        text: 'font-semibold tracking-[-0.03em]',
        mark: <path d="M2 19 12 4l10 15-10-5z" fill="currentColor" />,
    },
    oakline: {
        text: 'font-serif italic',
        mark: (
            <>
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M3.5 12h17" stroke="currentColor" strokeWidth="2.5" />
            </>
        ),
    },
    vantage: {
        text: 'text-[0.8em] font-bold uppercase tracking-[0.18em]',
        mark: (
            <>
                <path d="m12 2.5 9.5 9.5-9.5 9.5L2.5 12z" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            </>
        ),
    },
    polymer: {
        text: 'font-mono lowercase tracking-tight',
        mark: <path d="M12 2.5 20.5 7.25v9.5L12 21.5l-8.5-4.75v-9.5z" fill="none" stroke="currentColor" strokeWidth="2.5" />,
    },
    tidewater: {
        text: 'font-black tracking-[-0.04em]',
        mark: (
            <path
                d="M2 9c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1M2 15.5c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        ),
    },
}

function Wordmark({ id, name, compact = false, className }) {
    const brand = wordmarks[id]
    return (
        <span className={cn('inline-flex min-w-0 items-center gap-2', className)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.3em] w-[1.3em] shrink-0">
                {brand.mark}
            </svg>
            <span className={cn('truncate', brand.text, compact && 'hidden lg:inline')}>{name}</span>
        </span>
    )
}

function CountUp({ metric, active, reduce }) {
    const value = useMotionValue(metric.value)
    const text = useTransform(value, (v) => formatMetric(metric, v))

    useEffect(() => {
        if (!active || reduce) {
            value.jump(metric.value)
            return undefined
        }
        value.jump(0)
        const controls = animate(value, metric.value, { duration: 1.4, ease: EASE, delay: 0.15 })
        return () => controls.stop()
    }, [active, reduce, metric.value, value])

    return <motion.span>{text}</motion.span>
}

export function CaseMetricSlider({
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
    const [stepPx, setStepPx] = useState(0)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const x = useMotionValue(0)
    const firstCardRef = useRef(null)
    const trackAnim = useRef(null)
    const panning = useRef(false)
    const panBase = useRef(0)
    const panStartTime = useRef(0)
    const moved = useRef(false)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const active = cases[index]

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

    const slideTrack = useCallback(
        (target) => {
            if (trackAnim.current) trackAnim.current.stop()
            trackAnim.current = null
            if (reduce) x.jump(target)
            else trackAnim.current = animate(x, target, { type: 'spring', stiffness: 170, damping: 28 })
            return trackAnim.current
        },
        [reduce, x],
    )

    useEffect(() => {
        setHydrated(true)
    }, [])

    // Measure one card + gap; the track moves by that step.
    useEffect(() => {
        const card = firstCardRef.current
        if (!card) return undefined
        const measure = () => {
            const gap = parseFloat(window.getComputedStyle(card.parentElement).columnGap) || 0
            setStepPx(card.offsetWidth + gap)
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(card)
        return () => observer.disconnect()
    }, [])

    // Snap the track to the active card.
    useEffect(() => {
        if (!stepPx || panning.current) return undefined
        const controls = slideTrack(-index * stepPx)
        return () => controls && controls.stop()
    }, [index, stepPx, slideTrack])

    // Autoplay: animate progress 0 → 1, resume from the current value after a pause.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    // framer-motion calls onPan before onPanStart, so whichever runs first sets up the drag.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        if (trackAnim.current) trackAnim.current.stop()
        panBase.current = x.get()
        panStartTime.current = performance.now()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        const min = -(total - 1) * stepPx
        let next = panBase.current + info.offset.x
        if (next > 0) next *= 0.3
        else if (next < min) next = min + (next - min) * 0.3
        x.set(next)
    }

    const handlePanEnd = (_, info) => {
        beginPan()
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        // A short, quick swipe also counts as a flick: framer's velocity can read low when
        // the frameloop was idle before the gesture.
        const elapsed = Math.max(performance.now() - panStartTime.current, 16)
        const flick = Math.abs(velocity.x) > 400 || (elapsed < 250 && Math.abs(offset.x) > 24)
        let steps = Math.round(-offset.x / (stepPx || 1))
        if (steps === 0 && Math.abs(offset.x) > 8 && (Math.abs(offset.x) > 60 || flick)) {
            steps = offset.x < 0 ? 1 : -1
        }
        // Never move against the drag direction, never more than two cards per gesture.
        if (Math.sign(steps) === Math.sign(offset.x)) steps = 0
        steps = Math.max(-2, Math.min(2, steps))
        const target = Math.max(0, Math.min(total - 1, index + steps))
        if (target === index) slideTrack(-index * stepPx)
        else {
            progress.jump(0)
            setPage([target, target > index ? 1 : -1])
        }
    }

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        const isMove = event.key in moves
        if (!isMove && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        setFocused(true)
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

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0a0a0a] px-4 py-16 text-base font-normal text-[#f5f5f5] sm:px-6 sm:py-20 lg:px-10 lg:py-28',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:80px_100%]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-[#00ff94]/20 blur-[120px]"
            />

            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#a3a3a3]">
                                <span className="grid h-7 w-7 place-items-center rounded-md bg-[#00ff94] text-[#0a0a0a]">
                                    <HiArrowUpRight aria-hidden="true" className="text-sm" />
                                </span>
                                Scaleup · Customer outcomes
                            </p>
                            <h2 className="mt-6 text-[2.35rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#f5f5f5] sm:text-6xl lg:text-7xl">
                                Growth you can put in a <span className="text-[#00ff94]">board deck.</span>
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-7 text-[#a3a3a3]">
                                Five teams, five numbers, one playbook: experiment on onboarding, pricing and retention
                                without waiting on engineering.
                            </p>
                        </div>

                        <div className="flex items-end justify-between gap-6 lg:flex-col lg:items-end">
                            <p aria-hidden="true" className="flex items-baseline gap-2 font-mono">
                                <span className="relative inline-block w-[2.3ch] text-5xl leading-none tracking-tight text-[#f5f5f5] sm:text-6xl">
                                    <AnimatePresence initial={false} mode="popLayout">
                                        <motion.span
                                            key={index}
                                            initial={{ opacity: 0, y: direction < 0 ? -18 : 18, filter: 'blur(8px)' }}
                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, y: direction < 0 ? 18 : -18, filter: 'blur(8px)' }}
                                            transition={{ duration: 0.35 }}
                                            className="block"
                                        >
                                            {pad(index + 1)}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <span className="text-sm text-[#737373]">/ {pad(total)}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="grid h-12 w-12 place-items-center rounded-lg text-lg text-[#a3a3a3] transition-colors hover:bg-white/10 hover:text-[#f5f5f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff94]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous case study"
                                    className="grid h-12 w-12 place-items-center rounded-lg border border-white/15 text-lg transition-colors hover:border-[#00ff94] hover:bg-[#00ff94] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff94]"
                                    onClick={() => paginate(-1)}
                                >
                                    <HiArrowLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next case study"
                                    className="grid h-12 w-12 place-items-center rounded-lg border border-white/15 text-lg transition-colors hover:border-[#00ff94] hover:bg-[#00ff94] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff94]"
                                    onClick={() => paginate(1)}
                                >
                                    <HiArrowRight aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Scaleup customer case studies"
                        className="mt-10 sm:mt-14"
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
                        <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                            Case study {index + 1} of {total}: {active.client},{' '}
                            {formatMetric(active.metric, active.metric.value)} {active.label}
                        </p>

                        <motion.div
                            tabIndex={0}
                            aria-label="Case studies, drag or use the left and right arrow keys to browse"
                            className="cursor-grab touch-pan-y select-none rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00ff94] active:cursor-grabbing"
                            onPanStart={beginPan}
                            onPan={handlePan}
                            onPanEnd={handlePanEnd}
                            onPointerDownCapture={() => {
                                moved.current = false
                            }}
                            onClickCapture={(event) => {
                                if (moved.current) {
                                    event.preventDefault()
                                    event.stopPropagation()
                                }
                            }}
                        >
                            <motion.div className="flex gap-4 lg:gap-6" style={{ x }}>
                                {cases.map((item, i) => {
                                    const isActive = i === index
                                    return (
                                        <motion.article
                                            key={item.id}
                                            ref={i === 0 ? firstCardRef : undefined}
                                            role="group"
                                            aria-roledescription="slide"
                                            aria-label={`${i + 1} of ${total}: ${item.client}`}
                                            aria-current={isActive ? 'true' : undefined}
                                            aria-hidden={isActive ? undefined : true}
                                            initial={false}
                                            animate={{ opacity: isActive ? 1 : 0.35 }}
                                            transition={{ duration: 0.45 }}
                                            className={cn(
                                                'relative flex w-[86%] shrink-0 flex-col overflow-hidden rounded-[28px] border bg-[#111111] p-5 sm:w-[80%] sm:p-8 lg:w-[72%] lg:p-10',
                                                isActive ? 'border-white/15' : 'cursor-pointer border-white/10',
                                            )}
                                            onClick={() => {
                                                if (!isActive && !moved.current) goTo(i)
                                            }}
                                        >
                                            <div
                                                aria-hidden="true"
                                                className={cn(
                                                    'pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#00ff94]/10 blur-3xl transition-opacity duration-700',
                                                    isActive ? 'opacity-100' : 'opacity-0',
                                                )}
                                            />
                                            <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                                                <Wordmark id={item.id} name={item.client} className="text-xl text-[#f5f5f5] sm:text-2xl" />
                                                <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#a3a3a3]">
                                                    {item.sector}
                                                </span>
                                            </div>

                                            <div className="relative mt-8 grid flex-1 gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
                                                <div className="min-w-0">
                                                    <p
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'whitespace-nowrap text-[4.25rem] font-semibold leading-[0.85] tracking-[-0.06em] tabular-nums transition-colors duration-500 sm:text-[6.5rem] lg:text-[7.5rem]',
                                                            isActive
                                                                ? 'text-[#00ff94]'
                                                                : 'text-transparent [-webkit-text-stroke:1.5px_#3f3f46]',
                                                        )}
                                                    >
                                                        <CountUp metric={item.metric} active={isActive} reduce={reduce} />
                                                    </p>
                                                    <p className="mt-4 text-lg font-medium leading-snug text-[#f5f5f5] sm:text-xl">
                                                        <span className="sr-only">
                                                            {formatMetric(item.metric, item.metric.value)}{' '}
                                                        </span>
                                                        {item.label}
                                                    </p>
                                                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#737373]">
                                                        {item.timeframe}
                                                    </p>
                                                    <dl className="mt-6 space-y-2.5">
                                                        {[item.before, item.after].map((bar, b) => (
                                                            <div key={bar.label} className="grid grid-cols-[3.5rem_minmax(0,1fr)_3.75rem] items-center gap-3">
                                                                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#737373]">
                                                                    {bar.label}
                                                                </dt>
                                                                <dd className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                                                    <motion.span
                                                                        initial={false}
                                                                        animate={{ scaleX: b === 0 || isActive ? 1 : 0 }}
                                                                        transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
                                                                        className={cn(
                                                                            'block h-full origin-left rounded-full',
                                                                            b === 0 ? 'bg-[#525252]' : 'bg-[#00ff94]',
                                                                        )}
                                                                        style={{ width: `${bar.pct}%` }}
                                                                    />
                                                                </dd>
                                                                <dd
                                                                    className={cn(
                                                                        'text-right font-mono text-xs',
                                                                        b === 0 ? 'text-[#a3a3a3]' : 'text-[#00ff94]',
                                                                    )}
                                                                >
                                                                    {bar.value}
                                                                </dd>
                                                            </div>
                                                        ))}
                                                    </dl>
                                                </div>

                                                <figure className="flex min-w-0 flex-col justify-between gap-6 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                                                    <blockquote className="text-base leading-7 text-[#e5e5e5] sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                                                        <span aria-hidden="true" className="mb-2 block font-serif text-5xl leading-none text-[#00ff94]">
                                                            “
                                                        </span>
                                                        {item.quote}
                                                    </blockquote>
                                                    <div>
                                                        <figcaption className="flex items-center gap-3">
                                                            <img
                                                                src={item.photo}
                                                                alt={item.alt}
                                                                loading="lazy"
                                                                draggable={false}
                                                                className="h-12 w-12 shrink-0 rounded-full object-cover grayscale"
                                                            />
                                                            <span className="min-w-0">
                                                                <span className="block truncate text-sm font-semibold text-[#f5f5f5]">
                                                                    {item.name}
                                                                </span>
                                                                <span className="block truncate text-xs text-[#a3a3a3]">{item.role}</span>
                                                            </span>
                                                        </figcaption>
                                                        <a
                                                            href={`#case-${item.id}`}
                                                            draggable={false}
                                                            tabIndex={isActive ? undefined : -1}
                                                            className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-[#00ff94] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff94]"
                                                        >
                                                            Read the {item.client} story
                                                            <HiArrowUpRight
                                                                aria-hidden="true"
                                                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                            />
                                                        </a>
                                                    </div>
                                                </figure>
                                            </div>
                                        </motion.article>
                                    )
                                })}
                            </motion.div>
                        </motion.div>

                        <div
                            role="group"
                            aria-label="Choose a case study"
                            className="mt-8 grid grid-cols-5 gap-2 border-t border-white/10 sm:mt-10 sm:gap-4"
                        >
                            {cases.map((item, i) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-label={`Case study ${i + 1}: ${item.client}`}
                                    aria-current={i === index ? 'true' : undefined}
                                    className={cn(
                                        'group relative flex min-h-14 min-w-0 items-center justify-center pt-1 text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff94] lg:justify-start',
                                        i === index ? 'text-[#f5f5f5]' : 'text-[#525252] hover:text-[#a3a3a3]',
                                    )}
                                    onClick={() => goTo(i)}
                                >
                                    <span className="absolute inset-x-0 -top-px h-0.5 overflow-hidden">
                                        <motion.span
                                            className="absolute inset-0 origin-left bg-[#00ff94]"
                                            style={{
                                                scaleX: i === index ? (autoplayOn ? progress : 1) : 0,
                                            }}
                                        />
                                    </span>
                                    <Wordmark id={item.id} name={item.client} compact />
                                </button>
                            ))}
                        </div>
                    </div>

                    <a
                        href="#scaleup-customers"
                        className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-[#f5f5f5] underline decoration-white/20 underline-offset-8 transition-colors hover:decoration-[#00ff94] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff94]"
                    >
                        All 120+ case studies
                        <HiArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </div>
            </MotionConfig>
        </section>
    )
}

export default CaseMetricSlider

// AnnualReportSlider

// Slider01 · Corporate & Business › Animated Slider

// Description:
// "The year in five figures." An annual-report carousel for Clearwater Bank's 2025 results:
// five chapters (Deposits $6.8B, Lending $4.2B, CET1 capital 14.2%, $38.5M returned to
// members, $612M green lending), each with a counting headline figure, the change on 2024,
// a two-sentence narrative, a source note and a five-year bar chart. Use it on an investor,
// results or about page to walk visitors through the key numbers of a report.

// Design:
// - White section with ink #10262d; the stage is a deep teal #0f4c5c panel framed by a
//   brass #b08d57 hairline with corner marks, chart well #0b3c49, muted teal bars #2f6f80
//   and a brass bar for 2025
// - Serif figures (text-[3.75rem] → sm:text-8xl → lg:text-[7.5rem]) with tabular digits,
//   serif chapter titles, mono brass labels; square corners like a printed report
// - Motion: content slides ±60px in the travel direction and fades, the figure counts up
//   from zero, chart bars grow from the baseline with a stagger; drag gives a 0.35×
//   follow; MotionConfig reducedMotion="user" drops transforms and counting
// - Controls under the stage: a rolling "02 / 05" counter with the chapter name, five
//   labelled segments that fill as the 7 s autoplay progress bar, and pause/prev/next
// - Responsive: one column (figure, narrative, then chart) on base/md; at lg the stage
//   splits 1.2fr / 1fr; segment labels show from sm; stage height is fixed by an invisible
//   stack of every slide so nothing jumps between chapters

// What it does:
// - State [index, direction] plus hover, focus, drag and play/pause flags. A framer-motion
//   animate() fills a 0→1 progress value over 7 s and advances on complete; it pauses on
//   mouse hover, keyboard focus and while dragging, and is off for reduced motion until
//   Play is pressed
// - Drag or swipe the stage (60 px, a fast flick, or any >24 px swipe under 250 ms; left =
//   next), ←/→/Home/End keys, prev/next buttons and the segments all navigate, wrapping at
//   the ends; a click that ends a drag is swallowed so links don't fire
// - Chapter links go to #clearwater-report-<id>; "Download the full report" to
//   #clearwater-annual-report-2025

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AnnualReportSlider from '@/TestComponent/PageSections/corporate/Slider01';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <AnnualReportSlider />
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
    useInView,
    useReducedMotion,
    useTransform,
} from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowTrendingUp, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 7
const EASE = [0.22, 1, 0.36, 1]
const YEARS = [2021, 2022, 2023, 2024, 2025]

const chapters = [
    {
        id: 'deposits',
        label: 'Deposits',
        title: 'Held for our members',
        value: 6.8,
        decimals: 1,
        prefix: '$',
        suffix: 'B',
        delta: '+7.9%',
        narrative:
            'Members trusted us with $496 million more than a year ago, most of it from 11,300 current accounts opened at a branch counter rather than in an app store.',
        source: 'Consolidated balance sheet, note 9',
        series: [5.1, 5.5, 5.9, 6.3, 6.8],
    },
    {
        id: 'lending',
        label: 'Lending',
        title: 'Lent back in the valley',
        value: 4.2,
        decimals: 1,
        prefix: '$',
        suffix: 'B',
        delta: '+10.5%',
        narrative:
            'Every loan was approved by someone living within 40 miles of the borrower: 2,940 first homes, 1,180 small businesses and 212 family farms.',
        source: 'Loan portfolio review, note 14',
        series: [3.1, 3.4, 3.6, 3.8, 4.2],
    },
    {
        id: 'capital',
        label: 'Capital',
        title: 'Capital strength, CET1 ratio',
        value: 14.2,
        decimals: 1,
        prefix: '',
        suffix: '%',
        delta: '+0.6 pts',
        narrative:
            'Nearly twice the regulatory minimum of 7%. We grew lending without selling a loan book or raising a cent of outside capital.',
        source: 'Pillar 3 disclosures, table 2',
        series: [12.8, 13.1, 13.4, 13.6, 14.2],
    },
    {
        id: 'returned',
        label: 'Returned',
        title: 'Returned to member-owners',
        value: 38.5,
        decimals: 1,
        prefix: '$',
        suffix: 'M',
        delta: '+13.6%',
        narrative:
            'Paid out as the member dividend and loyalty rate rebates: an average of $207 for each of our 186,400 member-owners.',
        source: 'Statement of members’ equity, note 21',
        series: [24.0, 27.6, 30.2, 33.9, 38.5],
    },
    {
        id: 'green',
        label: 'Green lending',
        title: 'Lent for cleaner homes and farms',
        value: 612,
        decimals: 0,
        prefix: '$',
        suffix: 'M',
        delta: '+30.2%',
        narrative:
            '1,460 rooftop solar systems, 3,100 heat pumps and 41 irrigation upgrades, financed at 0.75 points below our standard rates.',
        source: 'Sustainability annex, section 3',
        series: [180, 260, 350, 470, 612],
    },
]

const total = chapters.length
const pad = (n) => String(n).padStart(2, '0')
const format = (c, v) => `${c.prefix}${v.toFixed(c.decimals)}${c.suffix}`

const content = {
    enter: (dir) => ({ x: dir < 0 ? -60 : 60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
    exit: (dir) => ({ x: dir < 0 ? 60 : -60, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }),
}

// Counts up once the figure is on screen; the server (and reduced motion) show the value.
function CountUp({ chapter, run }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, amount: 0.6 })
    const mv = useMotionValue(chapter.value)
    const text = useTransform(mv, (v) => format(chapter, v))
    useEffect(() => {
        if (!run || !inView) {
            mv.set(chapter.value)
            return undefined
        }
        mv.set(0)
        const controls = animate(mv, chapter.value, { duration: 1.4, ease: EASE, delay: 0.15 })
        return () => controls.stop()
    }, [run, inView, chapter, mv])
    return (
        <motion.span ref={ref} aria-hidden="true">
            {text}
        </motion.span>
    )
}

function ChapterBody({ chapter, index, live, reduce }) {
    const max = Math.max(...chapter.series)
    return (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
            <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#d4b98a]">
                    Chapter {pad(index + 1)} · {chapter.label}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-normal leading-tight text-white sm:text-3xl">{chapter.title}</h3>
                <p className="mt-4 font-serif text-[3.75rem] font-normal leading-[0.95] tracking-[-0.03em] text-white tabular-nums sm:text-8xl lg:text-[7.5rem]">
                    {live ? <CountUp chapter={chapter} run={!reduce} /> : format(chapter, chapter.value)}
                    {live && <span className="sr-only">{format(chapter, chapter.value)}</span>}
                </p>
                <p className="mt-5 inline-flex items-center gap-2 border border-[#b08d57]/60 px-3 py-1.5 font-mono text-xs text-[#e7d3ae]">
                    <HiArrowTrendingUp aria-hidden="true" className="text-sm text-[#b08d57]" />
                    {chapter.delta} vs 2024
                </p>
                <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/80 sm:text-base sm:leading-7">{chapter.narrative}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <a
                        href={`#clearwater-report-${chapter.id}`}
                        draggable={false}
                        tabIndex={live ? undefined : -1}
                        className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white underline decoration-[#b08d57] underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                    >
                        Read the chapter
                        <HiArrowLongRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                    </a>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">{chapter.source}</span>
                </div>
            </div>

            <figure className="min-w-0 self-end border border-white/10 bg-[#0b3c49] p-4 sm:p-6">
                <figcaption className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                    <span>Five-year trend</span>
                    <span className="text-[#d4b98a]">{chapter.label}</span>
                </figcaption>
                <div className="mt-5 flex h-40 items-end gap-2 border-b border-white/25 sm:h-52 sm:gap-4" aria-hidden={live ? undefined : true}>
                    {chapter.series.map((v, i) => {
                        const current = i === chapter.series.length - 1
                        return (
                            <div key={YEARS[i]} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                                <span className={cn('font-mono text-[10px] tabular-nums sm:text-xs', current ? 'text-[#e7d3ae]' : 'text-white/55')}>
                                    {format(chapter, v)}
                                </span>
                                <motion.span
                                    className={cn('block w-full origin-bottom', current ? 'bg-[#b08d57]' : 'bg-[#2f6f80]')}
                                    style={{ height: `${(v / max) * 82}%` }}
                                    initial={live && !reduce ? { scaleY: 0 } : false}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.08 }}
                                />
                            </div>
                        )
                    })}
                </div>
                <div className="mt-2 flex gap-2 sm:gap-4">
                    {YEARS.map((y, i) => (
                        <span
                            key={y}
                            className={cn(
                                'flex-1 text-center font-mono text-[10px] tabular-nums sm:text-xs',
                                i === YEARS.length - 1 ? 'text-white' : 'text-white/45',
                            )}
                        >
                            {y}
                        </span>
                    ))}
                </div>
            </figure>
        </div>
    )
}

export function AnnualReportSlider({
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
    const panning = useRef(false)
    const moved = useRef(false)
    const panAt = useRef(0)
    const snapBack = useRef(null)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const chapter = chapters[index]

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

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(total - 1)
        else return
        event.preventDefault()
        // A focused link inside the leaving chapter would vanish; keep focus on the stage.
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
        dragX.set(info.offset.x * 0.35)
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
                'relative overflow-hidden bg-white px-4 py-14 text-base font-normal text-[#10262d] sm:px-6 sm:py-16 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#0f4c5c]">
                                <svg viewBox="0 0 40 40" aria-hidden="true" className="h-9 w-9 text-[#b08d57]">
                                    <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1" />
                                    <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
                                    <text x="20" y="24" textAnchor="middle" fontSize="11" fill="currentColor" className="font-serif">
                                        CB
                                    </text>
                                </svg>
                                Clearwater Bank · Annual Report 2025
                            </p>
                            <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#0f4c5c] sm:text-5xl lg:text-6xl">
                                The year in five figures.
                            </h2>
                        </div>
                        <a
                            href="#clearwater-annual-report-2025"
                            className="group inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-[#0f4c5c] underline decoration-[#b08d57] underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57] md:self-auto"
                        >
                            Download the full report (PDF, 4.2 MB)
                            <HiArrowLongRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Clearwater Bank 2025 key figures"
                        className="mt-10"
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
                            aria-label="Figures, drag or use the left and right arrow keys to browse"
                            className={cn(
                                'relative isolate touch-pan-y select-none overflow-hidden bg-[#0f4c5c] p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b08d57] sm:p-10 lg:p-14',
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
                            <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-[#b08d57]/35 sm:inset-4" />
                            {['left-1.5 top-1.5', 'right-1.5 top-1.5', 'bottom-1.5 left-1.5', 'bottom-1.5 right-1.5'].map((pos) => (
                                <span
                                    key={pos}
                                    aria-hidden="true"
                                    className={cn('pointer-events-none absolute h-2 w-2 rotate-45 bg-[#b08d57] sm:m-[5px] sm:h-2.5 sm:w-2.5', pos)}
                                />
                            ))}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-6 -top-10 font-serif text-[9rem] leading-none text-white/[0.04] sm:text-[14rem] lg:text-[18rem]"
                            >
                                2025
                            </span>

                            <motion.div className="relative grid" style={{ x: dragX }}>
                                {/* Invisible stack of every chapter keeps the stage height stable. */}
                                {chapters.map((c, i) => (
                                    <div key={c.id} aria-hidden="true" className="invisible col-start-1 row-start-1">
                                        <ChapterBody chapter={c} index={i} live={false} reduce />
                                    </div>
                                ))}
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={chapter.id}
                                        role="group"
                                        aria-roledescription="slide"
                                        aria-label={`${index + 1} of ${total}: ${chapter.label}`}
                                        custom={direction}
                                        variants={content}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="col-start-1 row-start-1"
                                    >
                                        <ChapterBody chapter={chapter} index={index} live reduce={reduce} />
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>

                        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 lg:grid-cols-[14rem_minmax(0,1fr)_auto] lg:gap-x-10">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="relative inline-flex h-8 overflow-hidden font-serif text-3xl leading-8 tabular-nums text-[#0f4c5c]">
                                    <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                                        <motion.span
                                            key={index}
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
                                <span className="whitespace-nowrap font-mono text-sm text-[#10262d]/45">/ {pad(total)}</span>
                                <p
                                    aria-live={playing ? 'off' : 'polite'}
                                    aria-atomic="true"
                                    className="min-w-0 truncate text-sm font-semibold text-[#10262d]"
                                >
                                    <span className="sr-only">
                                        Chapter {index + 1} of {total}:{' '}
                                    </span>
                                    {chapter.label}
                                </p>
                            </div>

                            <div
                                role="group"
                                aria-label="Choose a chapter"
                                className="col-span-2 row-start-2 flex gap-1.5 sm:gap-3 lg:col-span-1 lg:col-start-2 lg:row-start-1"
                            >
                                {chapters.map((c, i) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        aria-label={`Go to chapter ${i + 1}: ${c.label}`}
                                        aria-current={i === index ? 'true' : undefined}
                                        onClick={() => goTo(i)}
                                        className="group flex h-11 min-w-0 flex-1 flex-col justify-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                                    >
                                        <span className="relative block h-[3px] w-full overflow-hidden bg-[#0f4c5c]/15 transition-colors group-hover:bg-[#0f4c5c]/30">
                                            <motion.span
                                                className={cn('absolute inset-0 origin-left', i === index ? 'bg-[#b08d57]' : 'bg-[#0f4c5c]')}
                                                style={{ scaleX: i === index ? (autoplayOn && !reduce ? progress : 1) : i < index ? 1 : 0 }}
                                            />
                                        </span>
                                        <span
                                            className={cn(
                                                'hidden truncate font-mono text-[10px] uppercase tracking-[0.16em] sm:block',
                                                i === index ? 'text-[#0f4c5c]' : 'text-[#10262d]/45 group-hover:text-[#10262d]/75',
                                            )}
                                        >
                                            {c.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 lg:col-start-3">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    onClick={() => setPlayPref(!autoplayOn)}
                                    className="grid h-11 w-11 place-items-center text-lg text-[#0f4c5c] transition-colors hover:bg-[#0f4c5c]/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous chapter"
                                    onClick={() => paginate(-1)}
                                    className="grid h-11 w-11 place-items-center border border-[#0f4c5c]/30 text-lg text-[#0f4c5c] transition-colors hover:border-[#0f4c5c] hover:bg-[#0f4c5c] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next chapter"
                                    onClick={() => paginate(1)}
                                    className="grid h-11 w-11 place-items-center border border-[#0f4c5c] bg-[#0f4c5c] text-lg text-white transition-colors hover:border-[#b08d57] hover:bg-[#b08d57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
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

export default AnnualReportSlider

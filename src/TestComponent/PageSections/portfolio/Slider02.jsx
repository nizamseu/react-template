// CaseCarouselSlider

// Slider02 · Portfolios & Personal Websites › Animated Slider

// Description:
// Case-study carousel for product designer Elena Rossi under the heading "Case studies, one
// story at a time." Six cases (Fernwood Bank, Tessellate, Harbor Health, Loam Grocery, Atlas
// Rail, Kindling) sit side by side as slim espresso spines; the active one opens into a wide
// card with a photo, the headline, a short summary, two result metrics and "Read case study".
// Use it on a portfolio home or work page to walk visitors through a handful of deep cases.

// Design:
// - Blush #f7e8e1 section, espresso #3b2a24 text and spines, paper #fffaf7 cards, clay
//   #b0573d accents; font-serif headings with italic accents, tracked uppercase labels,
//   rounded-[1.25rem] cards with a soft espresso shadow.
// - Sizes live in CSS variables set by container queries on the track: spines are 48 px,
//   64 px from a 600 px track and 104 px from 960 px, with one spine visible after the open
//   card below 960 px and three above; the open card takes the rest (100cqw). Track height
//   is fixed (560 px, 500 px from a 616 px track), so nothing jumps between cases.
// - Open card: photo on top with the text below; photo and text side by side (plus tag chips)
//   once the card is 540 px wide, larger type from 760 px (container queries on the card).
// - Motion: one continuous position motion value drives every card's width, the spine / card
//   cross-fade, a 1.18 → 1 photo zoom and the track offset; it follows the pointer while
//   dragging and springs to the nearest case on release.
// - Controls: rolling serif counter with the case name (from sm), numbered serif dots with a
//   6 s autoplay underline, play/pause and prev/next; below sm the dots take their own row.

// What it does:
// - State: target case, live active case (rounded position), hover/focus/drag flags and a
//   play/pause preference. Autoplay advances every 6 s (rewinding to the first case after
//   the last), pauses on mouse hover, keyboard focus and drag, and is off for
//   prefers-reduced-motion, where cases also switch without the spring.
// - Drag/swipe with mouse or touch: cards follow the pointer and snap to the nearest case;
//   80 px or a quick flick (velocity, or < 250 ms and > 24 px) moves one case in the drag
//   direction; both ends rubber-band. ←/→/Home/End while focused, prev/next (inactive at the
//   ends), the dots and clicking a spine also work; a click that ends a drag is ignored.
// - Links: "Read case study" → #case-<case-id>, "All 14 case studies" → #case-studies.
//   Closed cards are inert, so only the open card's link is focusable.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CaseCarouselSlider from '@/TestComponent/PageSections/portfolio/Slider02';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <CaseCarouselSlider />
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
    useMotionValueEvent,
    useReducedMotion,
    useTransform,
} from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { PiHandGrabbing } from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6
const EASE = [0.22, 1, 0.36, 1]
const spring = { type: 'spring', stiffness: 170, damping: 28, mass: 0.9 }

const cases = [
    {
        id: 'fernwood-onboarding',
        tags: ['Research', 'Onboarding', 'Prototyping'],
        client: 'Fernwood Bank',
        short: 'Mobile onboarding',
        title: 'Opening an account in under two minutes',
        role: 'Lead product designer',
        duration: '14 weeks',
        year: '2025',
        summary:
            'Turned an 11-screen sign-up into five calm steps with an instant ID check, plain-language copy and a save-and-return flow for people who get interrupted.',
        metrics: [
            ['+38%', 'completed sign-ups'],
            ['1m 45s', 'median sign-up time'],
        ],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80',
        alt: 'Designer mapping a sign-up flow in sticky notes while the team follows on laptops',
    },
    {
        id: 'tessellate-system',
        tags: ['Design system', 'Tokens', 'Docs'],
        client: 'Tessellate',
        short: 'Design system',
        title: 'One design system for four product teams',
        role: 'Design systems lead',
        duration: '9 months',
        year: '2024',
        summary:
            'Audited 1,400 screens, merged 38 button styles into one and shipped a token-based library in Figma and React, with docs the engineers actually read.',
        metrics: [
            ['212', 'components shipped'],
            ['−30%', 'UI bugs per release'],
        ],
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1000&q=80',
        alt: 'Designer sketching interface ideas on a tablet with a stylus',
    },
    {
        id: 'harbor-health-booking',
        tags: ['Service design', 'iOS', 'Android'],
        client: 'Harbor Health',
        short: 'Patient app',
        title: 'Fewer missed appointments, calmer mornings',
        role: 'Senior product designer',
        duration: '5 months',
        year: '2024',
        summary:
            'Redesigned booking and reminders for 120 clinics: one-tap rescheduling, travel-time nudges and a check-in you can do from the car park.',
        metrics: [
            ['−42%', 'missed appointments'],
            ['4.8★', 'App Store rating'],
        ],
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
        alt: 'Doctor in a white coat and stethoscope checking a phone',
    },
    {
        id: 'loam-checkout',
        tags: ['E-commerce', 'A/B testing', 'UX writing'],
        client: 'Loam Grocery',
        short: 'Checkout redesign',
        title: 'A checkout that remembers your weekly shop',
        role: 'Product designer',
        duration: '10 weeks',
        year: '2023',
        summary:
            'Replaced a five-step checkout with one editable basket, smart substitutions and delivery slots that appear before payment instead of after it.',
        metrics: [
            ['+19%', 'checkout conversion'],
            ['−27%', 'support tickets'],
        ],
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
        alt: 'Neatly stocked shelves of fresh fruit and vegetables in a grocery store',
    },
    {
        id: 'atlas-rail-kiosk',
        tags: ['Field research', 'Kiosk', 'Accessibility'],
        client: 'Atlas Rail',
        short: 'Ticket kiosk',
        title: 'Buying a ticket before the train leaves',
        role: 'UX lead',
        duration: '6 months',
        year: '2022',
        summary:
            'Field-tested a touchscreen flow at three stations: destination-first search, oversized targets and a rush mode for trains leaving in under five minutes.',
        metrics: [
            ['38 s', 'median purchase'],
            ['AA', 'WCAG 2.2 audit'],
        ],
        image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80',
        alt: 'Busy downtown street between skyscrapers at dusk',
    },
    {
        id: 'kindling-reader',
        tags: ['Co-design', 'Kids', 'Illustration'],
        client: 'Kindling',
        short: 'Kids’ reading app',
        title: 'A reading app kids ask to open',
        role: 'Product designer',
        duration: '4 months',
        year: '2021',
        summary:
            'Co-designed with 24 children and their teachers: read-along highlighting, sticker streaks without leaderboards and a parent mode behind a grown-up question.',
        metrics: [
            ['3×', 'weekly reading minutes'],
            ['61%', 'day-30 retention'],
        ],
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
        alt: 'Tall stack of colourful hardback books',
    },
]

const total = cases.length
const pad = (n) => String(n).padStart(2, '0')
const clampIndex = (n) => Math.max(0, Math.min(total - 1, n))

function CaseCard({ item, i, pos, isActive, onOpen }) {
    // 1 when this case is centred, falling to 0 one case away.
    const t = useTransform(pos, (p) => Math.max(0, 1 - Math.abs(i - p)))
    const openOpacity = useTransform(t, [0.4, 0.95], [0, 1])
    const spineOpacity = useTransform(t, [0, 0.5], [1, 0])
    const spineVisibility = useTransform(t, (v) => (v > 0.5 ? 'hidden' : 'visible'))
    const photoScale = useTransform(t, [0, 1], [1.18, 1])

    return (
        <motion.article
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}: ${item.client}, ${item.short}`}
            aria-current={isActive ? 'true' : undefined}
            style={{ '--t': t }}
            className="relative h-full w-[calc(var(--c)_+_(var(--e)_-_var(--c))_*_var(--t,0))] shrink-0 overflow-hidden rounded-[1.25rem] bg-[#fffaf7] shadow-[0_24px_48px_-30px_rgba(59,42,36,0.55)]"
        >
            <motion.div
                inert={!isActive}
                style={{ opacity: openOpacity }}
                className="@container absolute inset-y-0 left-0 w-[var(--e)]"
            >
                <div className="flex h-full flex-col @min-[540px]:flex-row">
                    <div className="relative h-[170px] shrink-0 overflow-hidden bg-[#ead3c9] @min-[540px]:h-full @min-[540px]:w-[42%]">
                        <motion.img
                            src={item.image}
                            alt={item.alt}
                            loading="lazy"
                            draggable={false}
                            style={{ scale: photoScale }}
                            className="h-full w-full object-cover"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-[#fffaf7]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3b2a24] backdrop-blur">
                            Case {pad(i + 1)} · {item.year}
                        </span>
                    </div>
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col p-5 @min-[440px]:p-6 @min-[760px]:p-9">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b0573d]">
                            {item.client}
                        </p>
                        <h3 className="mt-2 font-serif text-xl font-normal leading-[1.15] tracking-[-0.01em] text-[#3b2a24] @min-[440px]:text-2xl @min-[760px]:text-[2.1rem] @min-[760px]:leading-[1.1]">
                            {item.title}
                        </h3>
                        <p className="mb-4 mt-3 line-clamp-3 min-h-0 text-sm leading-6 text-[#3b2a24]/75 @min-[540px]:line-clamp-4 @min-[760px]:text-base @min-[760px]:leading-7">
                            {item.summary}
                        </p>
                        <ul className="mb-4 hidden flex-wrap gap-1.5 @min-[540px]:flex">
                            {item.tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full border border-[#3b2a24]/20 px-2.5 py-1 text-[11px] leading-4 text-[#3b2a24]/75"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                        <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-[#3b2a24]/15 pt-4">
                            {item.metrics.map(([value, label]) => (
                                <div key={label} className="flex min-w-0 flex-col-reverse justify-end gap-1.5">
                                    <dt className="text-xs leading-4 text-[#3b2a24]/65">{label}</dt>
                                    <dd className="font-serif text-2xl leading-none text-[#3b2a24] @min-[760px]:text-[2rem]">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="hidden min-w-0 truncate text-xs text-[#3b2a24]/60 @min-[440px]:block">
                                {item.role} · {item.duration}
                            </p>
                            <a
                                href={`#case-${item.id}`}
                                draggable={false}
                                className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#3b2a24] pl-4 pr-1.5 text-sm font-medium text-[#f7e8e1] transition-colors hover:bg-[#b0573d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b2a24]"
                            >
                                Read case study
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f7e8e1] text-[#3b2a24] transition-transform duration-300 group-hover:rotate-45">
                                    <HiArrowUpRight aria-hidden="true" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                style={{ opacity: spineOpacity, visibility: spineVisibility }}
                className="group absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#3b2a24] py-5 text-[#f7e8e1]"
                onClick={() => onOpen(i)}
            >
                <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity transition-opacity duration-500 group-hover:opacity-45"
                />
                <span className="relative font-serif text-lg italic leading-none">{pad(i + 1)}</span>
                <span className="relative rotate-180 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] [writing-mode:vertical-rl]">
                    {item.client} — {item.short}
                </span>
                <span className="relative font-mono text-[10px] tracking-[0.1em] text-[#f7e8e1]/70">{item.year}</span>
            </motion.button>
        </motion.article>
    )
}

export function CaseCarouselSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [target, setTarget] = useState(0)
    const [active, setActive] = useState(0)
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const pos = useMotionValue(0)
    const progress = useMotionValue(0)
    const viewportRef = useRef(null)
    const trackRef = useRef(null)
    const controlsRef = useRef(null)
    const moved = useRef(false)
    const panning = useRef(false)
    const panAt = useRef(0)
    const panStart = useRef(0)
    const panUnit = useRef(300)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const current = cases[active]

    useMotionValueEvent(pos, 'change', (latest) => setActive(clampIndex(Math.round(latest))))

    const settle = useCallback(
        (to) => {
            const next = clampIndex(to)
            if (controlsRef.current) controlsRef.current.stop()
            progress.jump(0)
            setTarget(next)
            controlsRef.current = animate(pos, next, reduce ? { duration: 0 } : spring)
        },
        [pos, progress, reduce],
    )

    useEffect(() => {
        setHydrated(true)
        const controls = controlsRef
        return () => {
            if (controls.current) controls.current.stop()
        }
    }, [])

    // Autoplay: fill progress 0 → 1, then open the next case (rewinding after the last one).
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => settle(target >= total - 1 ? 0 : target + 1),
        })
        return () => controls.stop()
    }, [playing, target, settle, progress])

    const step = (dir) => {
        const next = clampIndex(target + dir)
        if (next !== target) settle(next)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') step(1)
        else if (event.key === 'ArrowLeft') step(-1)
        else if (event.key === 'Home') settle(0)
        else if (event.key === 'End') settle(total - 1)
        else return
        event.preventDefault()
        // The open card's link goes inert when it closes; keep focus on the track.
        const viewport = viewportRef.current
        if (viewport && viewport !== event.target && viewport.contains(event.target)) {
            viewport.focus({ preventScroll: true })
        }
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
        if (controlsRef.current) controlsRef.current.stop()
        panStart.current = pos.get()
        // One case = the distance the next card's edge travels (open width + gap), capped
        // so a mouse drag on a wide screen does not need half a metre.
        const track = trackRef.current
        const viewport = viewportRef.current
        if (track && viewport) {
            const styles = window.getComputedStyle(track)
            const c = parseFloat(styles.getPropertyValue('--c'))
            const g = parseFloat(styles.getPropertyValue('--g'))
            const k = parseFloat(styles.getPropertyValue('--k'))
            const unit = viewport.clientWidth - k * (c + g) + g
            panUnit.current = Number.isFinite(unit) && unit > 0 ? Math.min(unit, 480) : 300
        }
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        let next = panStart.current - info.offset.x / panUnit.current
        if (next < 0) next *= 0.3
        else if (next > total - 1) next = total - 1 + (next - (total - 1)) * 0.3
        pos.set(next)
    }

    const handlePanEnd = (_, info) => {
        beginPan()
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        const base = Math.round(panStart.current)
        let to = Math.round(pos.get())
        // Pan velocity reads low when the frame loop was idle (autoplay paused on hover), so a
        // short, quick swipe (< 250 ms, > 24 px) also counts as a flick in the drag direction.
        const flick =
            Math.abs(velocity.x) > 400 || (performance.now() - panAt.current < 250 && Math.abs(offset.x) > 24)
        if (to === base && Math.abs(offset.x) > 10 && (flick || Math.abs(offset.x) > 80)) {
            to = base + (offset.x < 0 ? 1 : -1)
        }
        // Never settle against the drag direction.
        if ((offset.x < 0 && to < base) || (offset.x > 0 && to > base)) to = base
        settle(to)
    }

    const handleOpen = (i) => {
        if (moved.current) return
        settle(i)
    }

    const arrowButton =
        'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#3b2a24]/25 text-lg text-[#3b2a24] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b2a24]'
    const atStart = target === 0
    const atEnd = target === total - 1

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f7e8e1] px-4 py-14 text-base font-normal text-[#3b2a24] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b2a24]/70">
                                <span
                                    aria-hidden="true"
                                    className="grid h-8 w-8 place-items-center rounded-full bg-[#3b2a24] font-serif text-sm normal-case italic tracking-normal text-[#f7e8e1]"
                                >
                                    E
                                </span>
                                Elena Rossi · Product designer
                            </p>
                            <h2 className="mt-5 font-serif text-[2.5rem] font-normal leading-[1.02] tracking-[-0.02em] text-[#3b2a24] sm:text-5xl lg:text-[4rem]">
                                Case studies, <em className="italic text-[#b0573d]">one story</em> at a time.
                            </h2>
                        </div>
                        <div className="max-w-sm md:text-right">
                            <p className="text-sm leading-6 text-[#3b2a24]/75">
                                Six projects from 2021 to 2026. Drag the cards or pick a number: each one opens to
                                the brief, what shipped and what changed.
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 md:justify-end">
                                <span className="hidden items-center gap-1.5 text-xs text-[#3b2a24]/60 md:inline-flex">
                                    <PiHandGrabbing aria-hidden="true" className="text-base" />
                                    Drag to browse
                                </span>
                                <a
                                    href="#case-studies"
                                    className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#3b2a24] underline decoration-[#b0573d] decoration-2 underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b2a24]"
                                >
                                    All 14 case studies
                                    <HiArrowLongRight
                                        aria-hidden="true"
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Elena Rossi case studies"
                        className="mt-10 sm:mt-12"
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
                            ref={viewportRef}
                            role="group"
                            tabIndex={0}
                            aria-label="Case studies, drag or use the left and right arrow keys to browse"
                            className={cn(
                                '@container relative touch-pan-y select-none overflow-hidden rounded-[1.25rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3b2a24]',
                                dragging ? 'cursor-grabbing' : 'cursor-grab',
                            )}
                            onScroll={(event) => {
                                // Focus can scroll an overflow-hidden box; the offset is ours to set.
                                event.currentTarget.scrollLeft = 0
                            }}
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
                            <motion.div
                                ref={trackRef}
                                style={{ '--pos': pos, '--last': total - 1 }}
                                className="flex h-[560px] translate-x-[calc(min(var(--pos,0),var(--max))_*_(var(--c)_+_var(--g))_*_-1)] gap-[var(--g)] [--c:48px] [--e:calc(100cqw_-_var(--k)_*_(var(--c)_+_var(--g)))] [--g:8px] [--k:1] [--max:calc(var(--last)_-_var(--k))] @min-[600px]:[--c:64px] @min-[600px]:[--g:12px] @min-[616px]:h-[500px] @min-[960px]:[--c:104px] @min-[960px]:[--g:14px] @min-[960px]:[--k:3]"
                            >
                                {cases.map((item, i) => (
                                    <CaseCard
                                        key={item.id}
                                        item={item}
                                        i={i}
                                        pos={pos}
                                        isActive={i === active}
                                        onOpen={handleOpen}
                                    />
                                ))}
                            </motion.div>
                        </motion.div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 sm:mt-8">
                            <div className="flex min-w-0 flex-1 items-baseline gap-4 sm:flex-none">
                                <p className="flex items-baseline font-serif leading-none tabular-nums text-[#3b2a24]">
                                    <span className="relative inline-flex h-9 overflow-hidden text-4xl italic leading-9">
                                        <AnimatePresence initial={false} mode="popLayout">
                                            <motion.span
                                                key={active}
                                                initial={{ y: '100%', opacity: 0 }}
                                                animate={{ y: '0%', opacity: 1 }}
                                                exit={{ y: '-100%', opacity: 0 }}
                                                transition={{ duration: 0.45, ease: EASE }}
                                                className="block"
                                            >
                                                {pad(active + 1)}
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                    <span className="ml-1.5 text-base text-[#3b2a24]/45">/ {pad(total)}</span>
                                </p>
                                <p
                                    aria-live={playing ? 'off' : 'polite'}
                                    aria-atomic="true"
                                    className="sr-only min-w-0 truncate text-sm text-[#3b2a24]/75 sm:not-sr-only"
                                >
                                    <span className="sr-only">
                                        Case {active + 1} of {total}:{' '}
                                    </span>
                                    {current.client} — {current.short}
                                </p>
                            </div>

                            <div
                                role="group"
                                aria-label="Choose a case study"
                                className="order-last flex w-full justify-between sm:order-none sm:w-auto sm:justify-start"
                            >
                                {cases.map((item, i) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-label={`Show case ${i + 1}: ${item.client}`}
                                        aria-current={i === active ? 'true' : undefined}
                                        className="group relative grid h-11 w-10 place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#3b2a24]"
                                        onClick={() => settle(i)}
                                    >
                                        <span
                                            className={cn(
                                                'font-serif text-base italic tabular-nums transition-colors',
                                                i === active
                                                    ? 'text-[#3b2a24]'
                                                    : 'text-[#3b2a24]/40 group-hover:text-[#3b2a24]/75',
                                            )}
                                        >
                                            {pad(i + 1)}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-x-2.5 bottom-1.5 h-[2px] overflow-hidden rounded-full bg-[#3b2a24]/10"
                                        >
                                            {i === active && (
                                                <motion.span
                                                    className="absolute inset-0 origin-left rounded-full bg-[#b0573d]"
                                                    style={{ scaleX: autoplayOn ? progress : 1 }}
                                                />
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg text-[#3b2a24]/80 transition-colors hover:bg-[#3b2a24]/10 hover:text-[#3b2a24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b2a24]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous case study"
                                    aria-disabled={atStart ? 'true' : undefined}
                                    className={cn(
                                        arrowButton,
                                        atStart
                                            ? 'cursor-not-allowed opacity-35'
                                            : 'hover:border-[#3b2a24] hover:bg-[#3b2a24] hover:text-[#f7e8e1]',
                                    )}
                                    onClick={() => step(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next case study"
                                    aria-disabled={atEnd ? 'true' : undefined}
                                    className={cn(
                                        arrowButton,
                                        atEnd
                                            ? 'cursor-not-allowed opacity-35'
                                            : 'border-[#3b2a24] bg-[#3b2a24] text-[#f7e8e1] hover:border-[#b0573d] hover:bg-[#b0573d]',
                                    )}
                                    onClick={() => step(1)}
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

export default CaseCarouselSlider

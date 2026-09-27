// ReleaseTimelineSlider

// Slider03 · SaaS Platforms › Animated Slider

// Description:
// A horizontal changelog timeline for Releasenote, a release-notes platform. Under
// "Twelve months of shipping, one release at a time." eight releases from v3.0 Spaces
// (Oct 14, 2025) to v4.2 Release analytics (Sep 15, 2026) sit on a rail as slim vertical
// cards; the active release expands to show its version badge, date, summary, New /
// Improved / Fixed highlights and a "Read v4.2 notes" link. Use it on a changelog,
// "What's new" or product-updates page.

// Design:
// - Off-white #faf8f5 background, ink #111111, grey #6b6b6b copy, pink #ec4899 for the
//   version badge, "New" tags, active node, shipped part of the rail, dots and hover
//   fills; a pale pink #fbcfe8 highlighter stroke on the headline.
// - Cards have 1.5px ink borders and rounded-[18px]; the open card is white with a hard
//   6px ink offset shadow, closed cards are #efebe4 with a vertical title (writing-mode).
//   Heights: 490px → sm:470px → md:420px → lg:430px.
// - Widths are measured from the viewport: closed 56 / 76 / 100px, open card fills the
//   rest (max 520px / 680px); below ~560px the open card starts at the left edge with the
//   next release peeking, above that the previous release stays visible on the left.
// - Type: bold tight sans headline text-[2.3rem] → sm:text-5xl → lg:text-[4.25rem]; mono
//   dates, versions and counters; tag chips show only an icon below sm.
// - Motion: the open card's width and the track's x animate together (0.6 s ease), the
//   pink rail grows to the active node, content cross-fades; a pink bar on the open card
//   shows the 5.5 s autoplay progress. Reduced motion makes these changes instant.

// What it does:
// - State: [index, direction], hover/focus/drag flags, the measured viewport width and a
//   play/pause preference. Starts at v3.0 and autoplays forward (wrapping round); autoplay
//   pauses on hover, keyboard focus or drag, resumes where it stopped, is stopped on
//   unmount and is off for prefers-reduced-motion until Play is pressed.
// - Drag/swipe the timeline (framer-motion pan, touch-action pan-y): the track follows the
//   pointer with rubber-banding at the ends; release moves by distance (max 3) or one
//   release on a flick, always in the drag direction. Click a closed card to open it;
//   ←/→/Home/End while focus is in the timeline; prev/next wrap; 8 dot buttons jump directly.
// - "Jump to latest" opens v4.2; an sr-only aria-live label (polite while paused) announces
//   the active release; the open card has aria-current. Links: #release-<version>,
//   "Subscribe to updates" → #releasenote-subscribe. A click that ends a drag is ignored.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ReleaseTimelineSlider from '@/TestComponent/PageSections/saas/Slider03';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <ReleaseTimelineSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import {
    HiArrowLongLeft,
    HiArrowLongRight,
    HiArrowTrendingUp,
    HiMiniPause,
    HiMiniPlay,
    HiRss,
    HiSparkles,
    HiWrenchScrewdriver,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 5.5
const EASE = [0.22, 1, 0.36, 1]
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const releases = [
    {
        version: 'v3.0',
        name: 'Spaces',
        date: 'Oct 14, 2025',
        short: "Oct '25",
        kind: 'Major',
        changes: 46,
        summary: 'Run a separate changelog for every product line from one workspace, each with its own domain, theme and audience.',
        highlights: [
            ['New', 'Spaces with per-space themes and roles'],
            ['New', 'Custom domains with automatic SSL'],
            ['Improved', 'Editor opens 2× faster on long posts'],
        ],
    },
    {
        version: 'v3.1',
        name: 'Scheduled posts',
        date: 'Dec 2, 2025',
        short: "Dec '25",
        kind: 'Minor',
        changes: 21,
        summary: 'Write notes ahead of launch day and let Releasenote publish them the minute your deploy goes green.',
        highlights: [
            ['New', 'Publish on a schedule or on a deploy webhook'],
            ['Improved', 'Timezone-aware preview for every locale'],
            ['Fixed', 'Autosave conflicts between two open tabs'],
        ],
    },
    {
        version: 'v3.2',
        name: 'Reactions',
        date: 'Jan 20, 2026',
        short: "Jan '26",
        kind: 'Minor',
        changes: 18,
        summary: 'Readers can react to and comment on any entry, so you see which launches land and which confuse.',
        highlights: [
            ['New', 'Emoji reactions and threaded comments'],
            ['New', 'Moderation queue with a spam filter'],
            ['Fixed', 'RSS feed skipped posts with images'],
        ],
    },
    {
        version: 'v3.3',
        name: 'Draft from PRs',
        date: 'Mar 3, 2026',
        short: "Mar '26",
        kind: 'Minor',
        changes: 29,
        summary: 'Connect a repository and get a first draft of every release note, written from your merged pull requests.',
        highlights: [
            ['New', 'Drafts built from merged PR titles and labels'],
            ['Improved', 'Label rules sort PRs into New, Improved, Fixed'],
            ['Fixed', 'Markdown tables lost alignment on export'],
        ],
    },
    {
        version: 'v3.4',
        name: 'Segments',
        date: 'Apr 22, 2026',
        short: "Apr '26",
        kind: 'Minor',
        changes: 24,
        summary: 'Show enterprise-only or beta features to exactly the customers who have them — nobody else sees the noise.',
        highlights: [
            ['New', 'Audience segments by plan, region or trait'],
            ['Improved', 'Widget resolves segments in under 40 ms'],
            ['Fixed', 'Digests ignored unsubscribes on mobile'],
        ],
    },
    {
        version: 'v4.0',
        name: 'Widget 2.0',
        date: 'Jun 9, 2026',
        short: "Jun '26",
        kind: 'Major',
        changes: 63,
        summary: 'A rebuilt in-app widget: 9 kB, themeable with CSS variables and able to open straight to a single release.',
        highlights: [
            ['New', 'Launcher, sidebar and modal layouts'],
            ['Improved', 'Bundle cut from 31 kB to 9 kB gzipped'],
            ['Improved', 'Full keyboard and screen-reader support'],
        ],
    },
    {
        version: 'v4.1',
        name: 'Translations',
        date: 'Jul 28, 2026',
        short: "Jul '26",
        kind: 'Minor',
        changes: 32,
        summary: 'Publish every entry in 14 languages with machine drafts, reviewer approval and per-locale scheduling.',
        highlights: [
            ['New', '14 languages with a reviewer workflow'],
            ['New', 'Locale-aware email digests'],
            ['Fixed', 'Right-to-left layout inside the widget'],
        ],
    },
    {
        version: 'v4.2',
        name: 'Release analytics',
        date: 'Sep 15, 2026',
        short: "Sep '26",
        kind: 'Latest',
        changes: 38,
        summary: 'See who read each release, which feature they opened next and how adoption moved over the following 30 days.',
        highlights: [
            ['New', 'Read-through and click-through per release'],
            ['New', '30-day adoption curves per feature flag'],
            ['Improved', 'CSV and warehouse export of every event'],
        ],
    },
]

const total = releases.length
const slug = (version) => version.replace('.', '-')

const kindTone = {
    Latest: 'bg-[#fdf2f8] text-[#be185d] ring-1 ring-[#ec4899]',
    Major: 'bg-[#111111] text-white',
    Minor: 'bg-[#efebe4] text-[#4a4a4a]',
}

const tagTone = {
    New: { className: 'bg-[#ec4899] text-white', icon: HiSparkles },
    Improved: { className: 'bg-[#111111] text-white', icon: HiArrowTrendingUp },
    Fixed: { className: 'border border-[#111111] text-[#111111]', icon: HiWrenchScrewdriver },
}

// Card geometry from the measured viewport width (px).
function geometry(width) {
    const w = width || 1184
    if (w < 560) {
        const cw = 56
        const gap = 8
        return { w, cw, gap, lead: false, aw: Math.round(w - cw * 0.6 - gap) }
    }
    const large = w >= 960
    const cw = large ? 100 : 76
    const gap = large ? 14 : 12
    return { w, cw, gap, lead: true, aw: Math.round(Math.min(w - (cw + gap) * 2.5, large ? 680 : 520)) }
}

function trackTarget(i, g) {
    const unit = g.cw + g.gap
    const trackWidth = total * unit - g.gap + (g.aw - g.cw)
    const minX = Math.min(0, g.w - trackWidth)
    const x = -(i * unit) + (g.lead && i > 0 ? unit : 0)
    return { x: Math.max(Math.min(x, 0), minX), minX }
}

export function ReleaseTimelineSlider({
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
    const [viewportWidth, setViewportWidth] = useState(0)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const x = useMotionValue(0)
    const viewportRef = useRef(null)
    const lastWidth = useRef(0)
    const trackAnim = useRef(null)
    const panning = useRef(false)
    const panBase = useRef(0)
    const panStartTime = useRef(0)
    const moved = useRef(false)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const g = geometry(viewportWidth)
    const unit = g.cw + g.gap
    const active = releases[index]
    const sizeTransition = reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }

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

    // Measure the viewport before paint so the first frame already has real widths.
    useIsoLayoutEffect(() => {
        const node = viewportRef.current
        if (!node) return undefined
        // pr-2 on the viewport leaves room for the open card's offset shadow.
        const measure = () => setViewportWidth(Math.max(0, node.clientWidth - 8))
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    // Move the track with the open card; jump (no animation) after a resize.
    useEffect(() => {
        if (panning.current) return undefined
        const target = trackTarget(index, geometry(viewportWidth)).x
        const resized = lastWidth.current !== viewportWidth
        lastWidth.current = viewportWidth
        if (trackAnim.current) trackAnim.current.stop()
        trackAnim.current = null
        if (resized || reduce) {
            x.jump(target)
            return undefined
        }
        const controls = animate(x, target, { duration: 0.6, ease: EASE })
        trackAnim.current = controls
        return () => controls.stop()
    }, [index, viewportWidth, reduce, x])

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
        const { minX } = trackTarget(index, g)
        let next = panBase.current + info.offset.x
        if (next > 0) next *= 0.3
        else if (next < minX) next = minX + (next - minX) * 0.3
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
        let steps = Math.round(-offset.x / Math.max(unit, 110))
        if (steps === 0 && Math.abs(offset.x) > 8 && (Math.abs(offset.x) > 50 || flick)) {
            steps = offset.x < 0 ? 1 : -1
        }
        // Never move against the drag direction, never more than three releases per gesture.
        if (Math.sign(steps) === Math.sign(offset.x)) steps = 0
        steps = Math.max(-3, Math.min(3, steps))
        const target = Math.max(0, Math.min(total - 1, index + steps))
        if (target !== index) {
            progress.jump(0)
            setPage([target, target > index ? 1 : -1])
            return
        }
        const back = trackTarget(index, g).x
        if (reduce) x.jump(back)
        else trackAnim.current = animate(x, back, { type: 'spring', stiffness: 260, damping: 30 })
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

    const latest = releases[total - 1]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#faf8f5] px-4 py-16 text-base font-normal text-[#111111] sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
                        <div className="max-w-3xl">
                            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#6b6b6b]">
                                <span className="h-2.5 w-2.5 rotate-45 bg-[#ec4899]" />
                                Releasenote · Changelog
                            </p>
                            <h2 className="mt-5 text-[2.3rem] font-bold leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-5xl lg:text-[4.25rem]">
                                Twelve months of shipping,{' '}
                                <span className="bg-[linear-gradient(transparent_60%,#fbcfe8_60%,#fbcfe8_92%,transparent_92%)] box-decoration-clone">
                                    one release at a time.
                                </span>
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                aria-label={`Jump to the latest release, ${latest.version} ${latest.name}`}
                                className="inline-flex h-11 items-center gap-2.5 rounded-full border-[1.5px] border-[#111111] bg-white px-4 text-sm font-semibold text-[#111111] shadow-[3px_3px_0_#111111] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec4899]"
                                onClick={() => goTo(total - 1)}
                            >
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#ec4899] opacity-60 motion-safe:animate-ping" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ec4899]" />
                                </span>
                                Jump to latest
                                <span className="font-mono text-xs text-[#6b6b6b]">{latest.version}</span>
                            </button>
                            <a
                                href="#releasenote-subscribe"
                                className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#111111] underline decoration-[#ec4899] decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec4899]"
                            >
                                <HiRss aria-hidden="true" className="text-[#ec4899]" />
                                Subscribe to updates
                            </a>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Releasenote release timeline"
                        className="mt-12 sm:mt-16"
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
                            Release {index + 1} of {total}: {active.version} {active.name}, {active.date}
                        </p>

                        <motion.div
                            ref={viewportRef}
                            tabIndex={0}
                            aria-label="Release timeline, drag or use the left and right arrow keys to browse"
                            className="relative cursor-grab touch-pan-y select-none overflow-hidden pb-3 pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ec4899] active:cursor-grabbing"
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
                            <motion.div className="relative flex w-max items-start" style={{ x, columnGap: g.gap }}>
                                <span aria-hidden="true" className="absolute inset-x-0 top-[17px] h-[1.5px] bg-[#111111]/20" />
                                <motion.span
                                    aria-hidden="true"
                                    className="absolute left-0 top-[17px] h-[1.5px] bg-[#ec4899]"
                                    initial={false}
                                    animate={{ width: index * unit }}
                                    transition={sizeTransition}
                                />

                                {releases.map((release, i) => {
                                    const isActive = i === index
                                    return (
                                        <motion.div
                                            key={release.version}
                                            role="group"
                                            aria-roledescription="slide"
                                            aria-label={`${release.version} ${release.name}, ${release.date}`}
                                            aria-current={isActive ? 'true' : undefined}
                                            initial={false}
                                            animate={{ width: isActive ? g.aw : g.cw }}
                                            transition={sizeTransition}
                                            className="relative shrink-0"
                                        >
                                            <div className="relative h-12">
                                                <span
                                                    className={cn(
                                                        'absolute left-0 top-[11px] h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300',
                                                        isActive
                                                            ? 'border-[#ec4899] bg-[#ec4899] shadow-[0_0_0_4px_#fbcfe8]'
                                                            : i < index
                                                              ? 'border-[#ec4899] bg-[#faf8f5]'
                                                              : 'border-[#111111] bg-[#faf8f5]',
                                                    )}
                                                />
                                                <span
                                                    className={cn(
                                                        'absolute left-0 top-[31px] whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.06em]',
                                                        isActive ? 'font-semibold text-[#be185d]' : 'text-[#6b6b6b]',
                                                    )}
                                                >
                                                    {release.short}
                                                </span>
                                            </div>

                                            <div
                                                className={cn(
                                                    'relative mt-2 h-[490px] overflow-hidden rounded-[18px] border-[1.5px] border-[#111111] transition-[background-color,box-shadow] duration-500 sm:h-[470px] md:h-[420px] lg:h-[430px]',
                                                    isActive
                                                        ? 'bg-white shadow-[6px_6px_0_#111111]'
                                                        : 'cursor-pointer bg-[#efebe4] hover:bg-[#e7e1d7]',
                                                )}
                                                onClick={() => {
                                                    if (!isActive && !moved.current) goTo(i)
                                                }}
                                            >
                                                {isActive && (
                                                    <span className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden">
                                                        <motion.span
                                                            className="absolute inset-0 origin-left bg-[#ec4899]"
                                                            style={{ scaleX: autoplayOn ? progress : 1 }}
                                                        />
                                                    </span>
                                                )}
                                                <AnimatePresence initial={false}>
                                                    {isActive ? (
                                                        <motion.div
                                                            key="open"
                                                            initial={{ opacity: 0, x: direction < 0 ? -16 : 16 }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                                transition: { duration: 0.45, ease: EASE, delay: 0.18 },
                                                            }}
                                                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                                            className="absolute inset-y-0 left-0 flex flex-col p-5 sm:p-6 lg:p-8"
                                                            style={{ width: g.aw }}
                                                        >
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="rounded-md bg-[#ec4899] px-2 py-1 font-mono text-xs font-bold text-white">
                                                                    {release.version}
                                                                </span>
                                                                <span
                                                                    className={cn(
                                                                        'rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
                                                                        kindTone[release.kind],
                                                                    )}
                                                                >
                                                                    {release.kind}
                                                                </span>
                                                                <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-[#6b6b6b]">
                                                                    {release.date}
                                                                </span>
                                                            </div>
                                                            <h3 className="mt-5 text-2xl font-bold leading-tight tracking-[-0.03em] text-[#111111] sm:text-3xl lg:text-4xl">
                                                                {release.name}
                                                            </h3>
                                                            <p className="mt-3 text-sm leading-6 text-[#4a4a4a] sm:text-[15px]">
                                                                {release.summary}
                                                            </p>
                                                            <ul className="mt-5 space-y-2.5">
                                                                {release.highlights.map(([tag, text]) => {
                                                                    const Icon = tagTone[tag].icon
                                                                    return (
                                                                        <li
                                                                            key={text}
                                                                            className="flex items-start gap-3 text-sm leading-5 text-[#111111]"
                                                                        >
                                                                            <span
                                                                                className={cn(
                                                                                    'inline-flex h-6 w-6 shrink-0 items-center justify-center gap-1 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] sm:w-[5.5rem] sm:justify-start sm:px-2',
                                                                                    tagTone[tag].className,
                                                                                )}
                                                                            >
                                                                                <Icon aria-hidden="true" className="shrink-0 text-xs" />
                                                                                <span className="sr-only sm:not-sr-only">{tag}</span>
                                                                            </span>
                                                                            <span className="min-w-0 pt-0.5">{text}</span>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#111111]/10 pt-3">
                                                                <span className="font-mono text-[11px] text-[#6b6b6b]">
                                                                    {release.changes} changes
                                                                </span>
                                                                <a
                                                                    href={`#release-${slug(release.version)}`}
                                                                    draggable={false}
                                                                    className="group inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-semibold text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec4899]"
                                                                >
                                                                    Read {release.version} notes
                                                                    <HiArrowLongRight
                                                                        aria-hidden="true"
                                                                        className="text-[#ec4899] transition-transform duration-300 group-hover:translate-x-1"
                                                                    />
                                                                </a>
                                                            </div>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="closed"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.2 } }}
                                                            exit={{ opacity: 0, transition: { duration: 0.12 } }}
                                                            className="absolute inset-0 flex flex-col items-center justify-between py-5"
                                                        >
                                                            <span className="font-mono text-[11px] font-bold text-[#111111] lg:text-xs">
                                                                {release.version}
                                                            </span>
                                                            <span className="rotate-180 whitespace-nowrap text-sm font-semibold tracking-tight text-[#111111] [writing-mode:vertical-rl] lg:text-base">
                                                                {release.name}
                                                            </span>
                                                            <span className="flex flex-col items-center gap-1.5">
                                                                <span
                                                                    className={cn(
                                                                        'h-2 w-2 rounded-full',
                                                                        release.kind === 'Minor' ? 'bg-[#111111]/25' : 'bg-[#ec4899]',
                                                                    )}
                                                                />
                                                                <span className="font-mono text-[10px] text-[#6b6b6b]">
                                                                    {release.changes}
                                                                </span>
                                                            </span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        </motion.div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 sm:mt-8">
                            <p aria-hidden="true" className="flex items-baseline gap-3 font-mono">
                                <span className="text-2xl font-bold tracking-tight text-[#111111]">{active.version}</span>
                                <span className="text-xs uppercase tracking-[0.12em] text-[#6b6b6b]">
                                    Release {index + 1} of {total}
                                </span>
                            </p>
                            <div className="order-last flex w-full items-center sm:order-none sm:w-auto" role="group" aria-label="Choose a release">
                                {releases.map((release, i) => (
                                    <button
                                        key={release.version}
                                        type="button"
                                        aria-label={`${release.version} ${release.name}`}
                                        aria-current={i === index ? 'true' : undefined}
                                        className="group grid h-10 min-w-7 flex-1 place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#ec4899] sm:flex-none"
                                        onClick={() => goTo(i)}
                                    >
                                        <span
                                            className={cn(
                                                'block h-2 rounded-full transition-all duration-300',
                                                i === index ? 'w-6 bg-[#ec4899]' : 'w-2 bg-[#111111]/25 group-hover:bg-[#111111]/55',
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="grid h-11 w-11 place-items-center rounded-xl text-lg text-[#111111] transition-colors hover:bg-[#efebe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec4899]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous release"
                                    className="grid h-11 w-11 place-items-center rounded-xl border-[1.5px] border-[#111111] bg-white text-lg text-[#111111] transition-colors hover:bg-[#ec4899] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec4899]"
                                    onClick={() => paginate(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next release"
                                    className="grid h-11 w-11 place-items-center rounded-xl border-[1.5px] border-[#111111] bg-[#111111] text-lg text-white transition-colors hover:border-[#ec4899] hover:bg-[#ec4899] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec4899]"
                                    onClick={() => paginate(1)}
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

export default ReleaseTimelineSlider

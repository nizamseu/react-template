// GuideShowcaseSlider

// Slider03 · Knowledge Bases & Documentation › Animated Slider

// Description:
// A bright, photo-led row of Helpbase's most-read guides under "Popular guides this
// week". Eight cards ("Set up two-factor authentication", "Invite your team and assign
// roles", "Build your first automation" …) sit in a draggable track that snaps card by
// card; the active card lifts, shows its reading time and a "Read guide" link. Use it
// on a help-center home page or at the end of an article to surface popular
// walkthroughs.

// Design:
// - White section, slate #0f172a text, blue #2563eb accents on a pale #eff6ff band
//   behind the track; cards are rounded-[1.75rem] white tiles with a 4:3 photo,
//   category chip, number, title, two-line excerpt and a fixed-height footer
// - Card widths peek the next card at every size: 82% → sm:44% → lg:29% → xl:22%, with
//   a 20px gap; the viewport uses overflow-x-clip so shadows and the lift stay visible
// - Active card: blue ring, deeper shadow, 8px lift and a slow photo zoom; its footer
//   crossfades from the skill level to a clock icon + "6 min read" and a blue "Read
//   guide" pill
// - Play/pause and prev/next sit in the header (stacks on mobile, splits from md);
//   under the row are 8 dots (the active dot stretches and fills with autoplay
//   progress) and a counter
// - Motion: spring snapping of the track (instant for reduced motion), MotionConfig
//   reducedMotion="user" for the card lift and footer transitions

// What it does:
// - State: active index, hover/focus/drag flags, a play preference and measured card
//   step / max offset (ResizeObserver). A motion value x positions the track at the
//   active card, clamped so the last cards never leave empty space
// - Drag or swipe the row: it follows the pointer (with rubber-banding at the ends) and
//   on release moves by the cards travelled, or one card for a fast flick or any >24 px
//   swipe under 250 ms (left = next); a click that ends a drag is swallowed
// - Clicking a card, keyboard focus on a card, ←/→/Home/End, prev/next (wrapping) and
//   the dots change the active guide; autoplay advances every 5 s, pauses on
//   hover/focus/drag and is off for prefers-reduced-motion. "Read guide" links go to
//   #guide-<slug>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GuideShowcaseSlider from '@/TestComponent/PageSections/knowledge/Slider03';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <GuideShowcaseSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiMiniPause, HiMiniPlay, HiOutlineClock } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 5
const EASE = [0.22, 1, 0.36, 1]

const guides = [
    {
        slug: 'two-factor-authentication',
        title: 'Set up two-factor authentication',
        excerpt: 'Protect every agent account with an authenticator app, backup codes and a recovery email.',
        category: 'Security',
        level: 'Beginner',
        minutes: 4,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        alt: 'Close-up of a green circuit board with chips and copper traces',
    },
    {
        slug: 'invite-your-team',
        title: 'Invite your team and assign roles',
        excerpt: 'Add agents in bulk, pick Admin, Agent or Light roles and set who can see billing.',
        category: 'Team',
        level: 'Beginner',
        minutes: 6,
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
        alt: 'A small team meeting around a table in a bright office',
    },
    {
        slug: 'first-automation',
        title: 'Build your first automation',
        excerpt: 'Auto-tag refund requests, assign them to Billing and send a reply in under a minute.',
        category: 'Automation',
        level: 'Intermediate',
        minutes: 8,
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
        alt: 'Hands typing on a laptop keyboard at a wooden desk',
    },
    {
        slug: 'customize-help-widget',
        title: 'Customize the help widget',
        excerpt: 'Match your brand colors, choose a launcher icon and suggest articles per page.',
        category: 'Branding',
        level: 'Beginner',
        minutes: 5,
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80',
        alt: 'A designer sketching on a tablet with a stylus',
    },
    {
        slug: 'import-tickets-csv',
        title: 'Import tickets from a CSV file',
        excerpt: 'Map columns, keep original timestamps and bring up to 50,000 tickets across in one go.',
        category: 'Data',
        level: 'Intermediate',
        minutes: 7,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        alt: 'A laptop screen showing charts and a spreadsheet',
    },
    {
        slug: 'support-reports',
        title: 'Read your support reports',
        excerpt: 'Understand first-response time, CSAT and backlog trends, and share a weekly digest.',
        category: 'Reporting',
        level: 'Advanced',
        minutes: 9,
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
        alt: 'An analytics dashboard with line charts on a monitor',
    },
    {
        slug: 'macros-that-sound-human',
        title: 'Write macros that sound human',
        excerpt: 'Use placeholders, a friendly tone guide and three templates our top teams swear by.',
        category: 'Writing',
        level: 'Beginner',
        minutes: 6,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
        alt: 'A fountain pen writing on a sheet of paper',
    },
    {
        slug: 'live-chat-routing',
        title: 'Route live chats by language',
        excerpt: 'Send Spanish, French and German chats to the right agents with skills-based routing.',
        category: 'Channels',
        level: 'Advanced',
        minutes: 5,
        image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80',
        alt: 'A support agent wearing headphones working at a laptop',
    },
]

const total = guides.length
const pad = (n) => String(n).padStart(2, '0')
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export function GuideShowcaseSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [index, setIndex] = useState(0)
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const [metrics, setMetrics] = useState({ step: 0, max: 0 })
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const x = useMotionValue(0)
    const viewportRef = useRef(null)
    const trackRef = useRef(null)
    const panning = useRef(false)
    const moved = useRef(false)
    const panAt = useRef(0)
    const panStartX = useRef(0)
    const slide = useRef(null)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const active = guides[index]

    const offsetFor = useCallback((i) => -Math.min(i * metrics.step, metrics.max), [metrics])

    const moveTrack = useCallback(
        (target) => {
            slide.current?.stop()
            if (reduce) x.jump(target)
            else slide.current = animate(x, target, { type: 'spring', stiffness: 260, damping: 34 })
        },
        [reduce, x],
    )

    const goTo = useCallback(
        (target) => {
            progress.jump(0)
            setIndex((target + total) % total)
        },
        [progress],
    )

    useEffect(() => {
        setHydrated(true)
    }, [])

    // Measure the distance between cards and how far the track can travel.
    useEffect(() => {
        const viewport = viewportRef.current
        const track = trackRef.current
        if (!viewport || !track) return undefined
        const measure = () => {
            const cards = track.children
            if (cards.length < 2) return
            const first = cards[0]
            const last = cards[cards.length - 1]
            const step = cards[1].offsetLeft - first.offsetLeft
            const width = last.offsetLeft + last.offsetWidth - first.offsetLeft
            const style = window.getComputedStyle(viewport)
            const inner = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
            const max = Math.max(0, width - inner)
            setMetrics((prev) => (prev.step === step && prev.max === max ? prev : { step, max }))
        }
        measure()
        if (typeof ResizeObserver === 'undefined') return undefined
        const observer = new ResizeObserver(measure)
        observer.observe(viewport)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!panning.current) moveTrack(offsetFor(index))
    }, [index, offsetFor, moveTrack])

    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => goTo(index + 1),
        })
        return () => controls.stop()
    }, [playing, index, goTo, progress])

    useEffect(() => () => slide.current?.stop(), [])

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') goTo(index + 1)
        else if (event.key === 'ArrowLeft') goTo(index - 1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(total - 1)
        else return
        event.preventDefault()
        setFocused(true)
    }

    const isKeyboardFocus = (event) => {
        try {
            return event.target.matches(':focus-visible')
        } catch {
            return true
        }
    }

    const handleFocus = (event) => {
        if (isKeyboardFocus(event)) setFocused(true)
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
        slide.current?.stop()
        panStartX.current = x.get()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        let next = panStartX.current + info.offset.x
        const min = -metrics.max
        if (next > 0) next *= 0.3
        else if (next < min) next = min + (next - min) * 0.3
        x.set(next)
    }

    const handlePanEnd = (_, info) => {
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        const step = metrics.step || 1
        // Pan velocity reads low when the frame loop was idle, so a short, quick swipe
        // (< 250 ms, > 24 px) also counts as a flick in the drag direction.
        const flick = performance.now() - panAt.current < 250 && Math.abs(offset.x) > 24
        let delta = Math.round(-(offset.x + velocity.x * 0.2) / step)
        if (delta === 0 && (flick || Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 400)) delta = offset.x < 0 ? 1 : -1
        if (offset.x < 0) delta = Math.max(delta, 0)
        else delta = Math.min(delta, 0)
        const target = clamp(index + delta, 0, total - 1)
        progress.jump(0)
        setIndex(target)
        moveTrack(offsetFor(target))
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 lg:px-10 lg:py-24', className)}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[#eff6ff]" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[radial-gradient(#2563eb_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.07]"
            />

            <MotionConfig reducedMotion="user">
                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Popular Helpbase guides"
                    className="relative mx-auto max-w-7xl"
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
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-xl">
                            <p className="flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
                                <span className="size-2 rounded-full bg-[#2563eb]" />
                                Helpbase Guides
                            </p>
                            <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-[#0f172a] sm:text-5xl">
                                Popular guides this week
                            </h2>
                            <p className="mt-4 text-base leading-7 text-[#475569]">
                                The walkthroughs our support team links to most, read by 12,480 admins in the last 7 days.
                                Drag the row to explore.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                className="grid size-11 place-items-center rounded-full text-lg text-[#475569] transition-colors hover:bg-[#eff6ff] hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                onClick={() => setPlayPref(!autoplayOn)}
                            >
                                {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                            </button>
                            <button
                                type="button"
                                aria-label="Previous guide"
                                className="grid size-12 place-items-center rounded-full border border-[#cbd5e1] bg-white text-lg text-[#0f172a] transition-colors hover:border-[#2563eb] hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                onClick={() => goTo(index - 1)}
                            >
                                <HiArrowLongLeft aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next guide"
                                className="grid size-12 place-items-center rounded-full bg-[#2563eb] text-lg text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.9)] transition-colors hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                onClick={() => goTo(index + 1)}
                            >
                                <HiArrowLongRight aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-10">
                        <motion.div
                            ref={viewportRef}
                            role="group"
                            tabIndex={0}
                            aria-label="Guides, drag or use the left and right arrow keys to browse"
                            className={cn(
                                '-mx-2 touch-pan-y select-none overflow-x-clip rounded-[2rem] px-2 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]',
                                dragging ? 'cursor-grabbing' : 'cursor-grab',
                            )}
                            onPointerDownCapture={() => {
                                moved.current = false
                            }}
                            onClickCapture={(event) => {
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
                            <motion.ul ref={trackRef} className="flex gap-5" style={{ x }}>
                                {guides.map((guide, i) => {
                                    const isActive = i === index
                                    return (
                                        <motion.li
                                            key={guide.slug}
                                            role="group"
                                            aria-roledescription="slide"
                                            aria-label={`${i + 1} of ${total}: ${guide.title}`}
                                            aria-current={isActive ? 'true' : undefined}
                                            animate={{ y: isActive ? -8 : 0 }}
                                            transition={{ duration: 0.45, ease: EASE }}
                                            className={cn(
                                                'relative flex w-[82%] shrink-0 flex-col rounded-[1.75rem] bg-white p-2.5 transition-shadow duration-500 sm:w-[44%] lg:w-[29%] xl:w-[22%]',
                                                isActive
                                                    ? 'shadow-[0_0_0_2px_#2563eb,0_30px_60px_-30px_rgba(37,99,235,0.55)]'
                                                    : 'shadow-[0_0_0_1px_#e2e8f0,0_14px_30px_-24px_rgba(15,23,42,0.35)]',
                                            )}
                                        >
                                            <button
                                                type="button"
                                                aria-label={isActive ? `${guide.title}, selected` : `Show guide: ${guide.title}`}
                                                aria-pressed={isActive}
                                                className="absolute inset-0 z-0 rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563eb]"
                                                onFocus={(event) => {
                                                    if (isKeyboardFocus(event) && !isActive) goTo(i)
                                                }}
                                                onClick={() => {
                                                    if (!isActive) goTo(i)
                                                }}
                                            />
                                            <div className="pointer-events-none relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#e2e8f0]">
                                                <img
                                                    src={guide.image}
                                                    alt={guide.alt}
                                                    loading="lazy"
                                                    draggable={false}
                                                    className={cn(
                                                        'h-full w-full object-cover transition-transform duration-[1200ms] ease-out',
                                                        isActive ? 'scale-105' : 'scale-100',
                                                    )}
                                                />
                                                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#1d4ed8] shadow-sm">
                                                    {guide.category}
                                                </span>
                                                <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-[#0f172a]/70 font-mono text-[11px] text-white backdrop-blur">
                                                    {pad(i + 1)}
                                                </span>
                                            </div>
                                            <div className="pointer-events-none flex flex-1 flex-col px-2.5 pb-2 pt-4">
                                                <h3 className="text-lg font-semibold leading-snug tracking-[-0.01em] text-[#0f172a]">{guide.title}</h3>
                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#64748b]">{guide.excerpt}</p>
                                                <div className="mt-auto grid pt-4">
                                                    <AnimatePresence initial={false}>
                                                        {isActive ? (
                                                            <motion.div
                                                                key="active"
                                                                initial={{ opacity: 0, y: 8 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -6 }}
                                                                transition={{ duration: 0.3, ease: EASE }}
                                                                className="col-start-1 row-start-1 flex min-h-11 items-center justify-between gap-2"
                                                            >
                                                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-[#0f172a] sm:text-sm">
                                                                    <HiOutlineClock aria-hidden="true" className="size-4 text-[#2563eb]" />
                                                                    {guide.minutes} min read
                                                                </span>
                                                                <a
                                                                    href={`#guide-${guide.slug}`}
                                                                    draggable={false}
                                                                    className="pointer-events-auto relative z-10 inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#2563eb] px-3.5 text-[13px] font-semibold sm:px-4 sm:text-sm text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                                                >
                                                                    Read guide
                                                                    <HiArrowLongRight aria-hidden="true" />
                                                                </a>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.p
                                                                key="idle"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.25 }}
                                                                className="col-start-1 row-start-1 flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.14em] text-[#94a3b8]"
                                                            >
                                                                {guide.level}
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </motion.li>
                                    )
                                })}
                            </motion.ul>
                        </motion.div>

                        <div className="mt-6 flex items-center justify-between gap-4">
                            <div role="group" aria-label="Choose a guide" className="flex flex-wrap items-center">
                                {guides.map((guide, i) => (
                                    <button
                                        key={guide.slug}
                                        type="button"
                                        aria-label={`Guide ${i + 1}: ${guide.title}`}
                                        aria-current={i === index ? 'true' : undefined}
                                        className="group grid h-10 w-6 place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563eb] sm:w-7"
                                        onClick={() => goTo(i)}
                                    >
                                        <span
                                            className={cn(
                                                'relative block h-2 overflow-hidden rounded-full transition-all duration-300',
                                                i === index ? 'w-8 bg-[#bfdbfe]' : 'w-2 bg-[#cbd5e1] group-hover:bg-[#94a3b8]',
                                            )}
                                        >
                                            {i === index && (
                                                <motion.span className="absolute inset-0 origin-left bg-[#2563eb]" style={{ scaleX: autoplayOn ? progress : 1 }} />
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className="shrink-0 font-mono text-sm tabular-nums text-[#64748b]">
                                <span className="text-[#0f172a]">{pad(index + 1)}</span> / {pad(total)}
                            </p>
                        </div>
                        <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                            Guide {index + 1} of {total}: {active.title}, {active.minutes} minute read
                        </p>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default GuideShowcaseSlider

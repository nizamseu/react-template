// ClientVoicesSlider

// Slider03 · Corporate & Business › Animated Slider

// Description:
// "In their words." A testimonial carousel for Arcadia Advisory: five large client quotes
// (Halden Group, Sundarban Textiles, Norrland Freight, Brightwater Utilities, Castell
// Pharmaceuticals), each with a portrait, name, title, the engagement and its measured
// result such as "$140M off the price". Quotes change with a gold-edged wipe, and a thin
// ruler-style timeline of client names from 2021 to 2025 sits underneath as the pager.
// Use it on advisory, consulting or B2B service pages as the social-proof moment.

// Design:
// - Near-black #0b0b0a section, warm white #f4efe4 text, muted #8a8373, hairlines #2a2721,
//   gold #b68d40 for the quote mark, wipe edge, results, timeline cursor and focus rings
// - Serif quote text-[1.7rem] → sm:text-4xl → lg:text-[3.1rem], leading 1.12; grayscale
//   44px portraits in a gold ring; mono small caps for engagements and years
// - Wipe: the new quote is revealed by a clip-path inset that travels in the navigation
//   direction while the old one is clipped away on the same edge and a 2px gold line rides
//   the seam; reduced motion swaps it for a plain cross-fade
// - Timeline: 1px ruler with minor ticks, a labelled tick per client (year below), a gold
//   diamond cursor that glides to the active client (layoutId) and a gold fill for the
//   6.5 s autoplay progress towards the next tick; names show from md, years always
// - Responsive: the quote block's height is set by an invisible stack of all five quotes
//   so it never jumps; attribution stacks on base and splits into person / result from sm

// What it does:
// - State [index, direction] plus hover, focus, drag and play/pause flags; a framer-motion
//   animate() fills a progress value and advances on complete, pausing on hover, focus and
//   drag, and staying off for reduced motion until Play is pressed
// - Drag or swipe the quote (60 px, a fast flick, or any >24 px swipe under 250 ms; left =
//   next), ←/→/Home/End keys, the Previous/Next buttons and the timeline ticks all
//   navigate, wrapping at both ends; the active slide is announced in a polite live region
// - "Read the case" links go to #arcadia-case-<id>; "All client stories" to
//   #arcadia-client-stories

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ClientVoicesSlider from '@/TestComponent/PageSections/corporate/Slider03';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <ClientVoicesSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6.5
const WIPE = [0.77, 0, 0.18, 1]

const voices = [
    {
        id: 'halden',
        company: 'Halden Group',
        year: 2021,
        quote: 'Arcadia told us what our own board would not: our best-selling division was destroying value. Eighteen months after the carve-out we are a smaller company, and a far better one.',
        name: 'Margaret Hale',
        title: 'Chief Executive, Halden Group',
        engagement: 'Portfolio review & carve-out',
        result: '+310 bps',
        resultLabel: 'operating margin',
        portrait: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'sundarban',
        company: 'Sundarban Textiles',
        year: 2022,
        quote: 'They sat with our plant managers in Gazipur before they sat with our bankers. That is why the restructuring plan actually worked on the factory floor.',
        name: 'Tanvir Hossain',
        title: 'Managing Director, Sundarban Textiles',
        engagement: 'Operational restructuring',
        result: '−42%',
        resultLabel: 'net debt in 24 months',
        portrait: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'norrland',
        company: 'Norrland Freight',
        year: 2023,
        quote: 'Two weeks before signing, their diligence team found a pension liability nobody else had modelled. It changed the price we paid by a hundred and forty million dollars.',
        name: 'Daniel Reyes',
        title: 'Chief Financial Officer, Norrland Freight',
        engagement: 'Buy-side due diligence',
        result: '$140M',
        resultLabel: 'off the purchase price',
        portrait: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'brightwater',
        company: 'Brightwater Utilities',
        year: 2024,
        quote: 'No slideware. Every recommendation came with a named owner, a date and a number, and a year later they came back, unasked, to check.',
        name: 'Amara Okoye',
        title: 'Chair, Brightwater Utilities',
        engagement: 'Board effectiveness review',
        result: '9 of 9',
        resultLabel: 'board actions closed',
        portrait: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'castell',
        company: 'Castell Pharmaceuticals',
        year: 2025,
        quote: 'We asked for a growth strategy and were handed a list of markets to leave. Revenue is up twenty-three per cent since we left them.',
        name: 'Olivier Martin',
        title: 'Founder & CEO, Castell Pharmaceuticals',
        engagement: 'Growth strategy',
        result: '+23%',
        resultLabel: 'revenue in 12 months',
        portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
]

const total = voices.length
const pad = (n) => String(n).padStart(2, '0')

const wipe = {
    enter: (dir) => ({ clipPath: dir < 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)', x: dir < 0 ? -24 : 24 }),
    center: { clipPath: 'inset(0% 0% 0% 0%)', x: 0, transition: { duration: 0.9, ease: WIPE } },
    exit: (dir) => ({
        clipPath: dir < 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
        x: dir < 0 ? 12 : -12,
        transition: { duration: 0.9, ease: WIPE },
    }),
}

const fade = {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
}

function Voice({ voice, live }) {
    return (
        <figure className="relative">
            <blockquote className="font-serif text-[1.7rem] font-normal leading-[1.12] tracking-[-0.015em] text-[#f4efe4] sm:text-4xl lg:text-[3.1rem]">
                {voice.quote}
            </blockquote>
            <figcaption className="mt-8 grid gap-6 border-t border-[#2a2721] pt-6 sm:mt-10 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="flex items-center gap-4">
                    <img
                        src={voice.portrait}
                        alt={live ? `Portrait of ${voice.name}` : ''}
                        loading="lazy"
                        draggable={false}
                        className="h-11 w-11 shrink-0 rounded-full object-cover object-top grayscale ring-1 ring-[#b68d40] ring-offset-2 ring-offset-[#0b0b0a]"
                    />
                    <div className="min-w-0">
                        <p className="text-base font-semibold text-[#f4efe4]">{voice.name}</p>
                        <p className="text-sm text-[#8a8373]">{voice.title}</p>
                    </div>
                </div>
                <div className="flex items-end justify-between gap-6 sm:justify-end sm:text-right">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a8373]">
                            {voice.engagement} · {voice.year}
                        </p>
                        <p className="mt-1 text-[#f4efe4]">
                            <span className="font-serif text-3xl text-[#b68d40]">{voice.result}</span>{' '}
                            <span className="text-sm text-[#c9c1b0]">{voice.resultLabel}</span>
                        </p>
                    </div>
                    <a
                        href={`#arcadia-case-${voice.id}`}
                        draggable={false}
                        tabIndex={live ? undefined : -1}
                        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm font-semibold text-[#f4efe4] underline decoration-[#b68d40] underline-offset-[6px] hover:text-[#b68d40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]"
                    >
                        Read the case
                    </a>
                </div>
            </figcaption>
        </figure>
    )
}

export function ClientVoicesSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
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
    const voice = voices[index]

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
        dragX.set(info.offset.x * 0.3)
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

    const tickLeft = (i) => `${(i / (total - 1)) * 100}%`

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0b0b0a] px-4 py-14 text-base font-normal text-[#f4efe4] sm:px-6 sm:py-20 lg:px-10 lg:py-28',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#b68d40]">Arcadia Advisory · Client voices</p>
                            <h2 className="mt-4 font-serif text-4xl font-normal leading-none tracking-[-0.02em] text-[#f4efe4] sm:text-5xl lg:text-6xl">
                                In their <span className="italic text-[#b68d40]">words.</span>
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
                            <p className="text-sm leading-6 text-[#8a8373]">
                                <span className="block font-serif text-3xl text-[#f4efe4]">71</span>
                                Net promoter score, 2025
                                <br />
                                client survey (164 replies)
                            </p>
                            <a
                                href="#arcadia-client-stories"
                                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#f4efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]"
                            >
                                All client stories
                                <HiArrowLongRight aria-hidden="true" className="text-[#b68d40]" />
                            </a>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Arcadia client testimonials"
                        className="mt-12 lg:mt-16"
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
                        <div className="grid gap-6 lg:grid-cols-[4rem_1fr] lg:gap-10">
                            <div aria-hidden="true" className="flex items-start justify-between lg:flex-col lg:justify-start lg:gap-6">
                                <span className="block h-12 font-serif text-[6rem] leading-[0.8] text-[#b68d40] lg:h-auto lg:text-[8rem]">“</span>
                                <span className="font-mono text-xs tabular-nums text-[#8a8373] lg:[writing-mode:vertical-rl]">
                                    {pad(index + 1)} — {pad(total)}
                                </span>
                            </div>

                            <motion.div
                                ref={stageRef}
                                role="group"
                                tabIndex={0}
                                aria-label="Testimonials, drag or use the left and right arrow keys to browse"
                                className={cn(
                                    'relative touch-pan-y select-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#b68d40]',
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
                                <motion.div className="relative grid" style={{ x: dragX }}>
                                    {/* Invisible stack of all quotes fixes the height at every width. */}
                                    {voices.map((v) => (
                                        <div key={v.id} aria-hidden="true" className="invisible col-start-1 row-start-1">
                                            <Voice voice={v} live={false} />
                                        </div>
                                    ))}
                                    <AnimatePresence initial={false} custom={direction}>
                                        <motion.div
                                            key={voice.id}
                                            role="group"
                                            aria-roledescription="slide"
                                            aria-label={`${index + 1} of ${total}: ${voice.name}, ${voice.company}`}
                                            custom={direction}
                                            variants={reduce ? fade : wipe}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="col-start-1 row-start-1 bg-[#0b0b0a]"
                                        >
                                            <Voice voice={voice} live />
                                        </motion.div>
                                    </AnimatePresence>
                                    {!reduce && direction !== 0 && (
                                        <motion.span
                                            key={`seam-${index}`}
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-y-0 z-10 w-[2px] bg-[#b68d40] shadow-[0_0_24px_rgba(182,141,64,0.6)]"
                                            initial={{ left: direction < 0 ? '0%' : '100%', opacity: 1 }}
                                            animate={{ left: direction < 0 ? '100%' : '0%', opacity: [1, 1, 0] }}
                                            transition={{ duration: 0.9, ease: WIPE, opacity: { duration: 0.9, times: [0, 0.8, 1] } }}
                                        />
                                    )}
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="mt-14 lg:mt-20 lg:pl-[6.5rem]">
                            <div className="flex items-center justify-between gap-4">
                                <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="min-w-0 truncate text-sm text-[#c9c1b0] md:sr-only">
                                    <span className="sr-only">
                                        Testimonial {index + 1} of {total}:{' '}
                                    </span>
                                    {voice.company}
                                </p>
                                <div className="ml-auto flex items-center gap-1">
                                    <button
                                        type="button"
                                        aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                        onClick={() => setPlayPref(!autoplayOn)}
                                        className="grid h-11 w-11 place-items-center rounded-full text-lg text-[#c9c1b0] transition-colors hover:text-[#f4efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]"
                                    >
                                        {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Previous testimonial"
                                        onClick={() => paginate(-1)}
                                        className="grid h-11 w-11 place-items-center rounded-full border border-[#2a2721] text-lg text-[#f4efe4] transition-colors hover:border-[#b68d40] hover:text-[#b68d40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]"
                                    >
                                        <HiArrowLongLeft aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next testimonial"
                                        onClick={() => paginate(1)}
                                        className="grid h-11 w-11 place-items-center rounded-full border border-[#b68d40] text-lg text-[#b68d40] transition-colors hover:bg-[#b68d40] hover:text-[#0b0b0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]"
                                    >
                                        <HiArrowLongRight aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative mx-5 mt-6 sm:mx-8 md:mx-16 lg:mx-20">
                                <div aria-hidden="true" className="absolute inset-x-0 top-8 h-px bg-[#2a2721] md:top-12" />
                                <div aria-hidden="true" className="absolute inset-x-0 top-8 flex justify-between md:top-12">
                                    {Array.from({ length: (total - 1) * 4 + 1 }, (_, i) => (
                                        <span key={i} className={cn('block w-px', i % 4 === 0 ? 'h-0' : 'h-1.5 bg-[#2a2721]')} />
                                    ))}
                                </div>
                                <div
                                    aria-hidden="true"
                                    className="absolute left-0 top-8 h-px bg-[#b68d40] transition-[width] duration-700 md:top-12"
                                    style={{ width: tickLeft(index) }}
                                />
                                {index < total - 1 && (
                                    <div
                                        aria-hidden="true"
                                        className="absolute top-8 h-px md:top-12"
                                        style={{ left: tickLeft(index), width: `${100 / (total - 1)}%` }}
                                    >
                                        <motion.span
                                            className="absolute inset-0 origin-left bg-[#b68d40]/60"
                                            style={{ scaleX: autoplayOn && !reduce ? progress : 0 }}
                                        />
                                    </div>
                                )}
                                <div role="group" aria-label="Choose a client" className="relative h-20 md:h-24">
                                    {voices.map((v, i) => {
                                        const active = i === index
                                        return (
                                            <button
                                                key={v.id}
                                                type="button"
                                                aria-label={`Go to testimonial ${i + 1}: ${v.name}, ${v.company}`}
                                                aria-current={active ? 'true' : undefined}
                                                onClick={() => goTo(i)}
                                                style={{ left: tickLeft(i) }}
                                                className="group absolute top-0 flex h-full w-14 -translate-x-1/2 flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40] md:w-32 lg:w-40"
                                            >
                                                <span
                                                    className={cn(
                                                        'hidden h-6 max-w-full truncate text-xs leading-6 transition-colors md:block',
                                                        active ? 'text-[#f4efe4]' : 'text-[#8a8373] group-hover:text-[#c9c1b0]',
                                                    )}
                                                >
                                                    {v.company}
                                                </span>
                                                <span className="relative mt-4 flex h-8 w-full justify-center md:mt-2">
                                                    <span
                                                        className={cn(
                                                            'block w-px transition-all',
                                                            active ? 'h-8 bg-[#b68d40]' : 'mt-2 h-4 bg-[#5a5448] group-hover:bg-[#c9c1b0]',
                                                        )}
                                                    />
                                                    {active && (
                                                        <motion.span
                                                            layoutId={`${uid}-cursor`}
                                                            className="absolute top-[calc(50%-5px)] h-2.5 w-2.5 rotate-45 border border-[#b68d40] bg-[#0b0b0a]"
                                                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                                                        />
                                                    )}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'mt-2 font-mono text-[10px] tabular-nums tracking-[0.12em] transition-colors sm:text-[11px]',
                                                        active ? 'text-[#b68d40]' : 'text-[#8a8373]',
                                                    )}
                                                >
                                                    {v.year}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default ClientVoicesSlider

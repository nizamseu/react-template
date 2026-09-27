// TopRatedCardsSlider

// Slider02 · Directories & Search Aggregators › Animated Slider

// Description:
// A draggable rail of the ten highest-rated local businesses on Yardstick Reviews, headed
// "The ten highest-rated in Dhaka right now." Each card shows a photo, overall rank, a
// big emerald score, star bar, review count, a one-line review quote and a "Read reviews"
// link. Cards snap into place, arrows step through them and a scroll progress bar with a
// "01–04 / 10" counter tracks the position. Use it for "top rated", "trending" or awards
// rows.

// Design:
// - White section, slate #0f172a ink, emerald #059669 accents; mono eyebrow, tight sans
//   heading (text-4xl → lg:6xl) and round 44px arrow buttons (emerald fill for "next")
// - Cards: rounded-[20px] slate-200 hairline, 5:4 photos with a white "No. 01" chip, a
//   big emerald score tile, clipped star bar, italic quote and a verified footer
// - Rail: 84% cards on mobile (next card peeks), 2 per view from sm, 3 from lg, 4 from
//   xl; gap-4 → lg:gap-5; a 4px emerald fill bar shows how far along the rail you are
// - Motion: framer-motion x motion value with spring snaps, rubber-band past the ends,
//   photo zoom on hover; reduced motion jumps instead of animating
// - Rail height is set by the tallest card (flex stretch), so nothing jumps between
//   slides

// What it does:
// - State: leftmost index, drag/hover/focus flags and a play preference; a ResizeObserver
//   measures card step, cards per view and max offset; the progress bar follows the
//   rail's x position and the "01–04 / 10" counter follows the index
// - Drag with mouse or swipe (snaps to the nearest card; a short flick under 250 ms and
//   over 24 px, a fast fling or a 20% drag always moves one card); ←/→/Home/End keys,
//   prev/next buttons (disabled at the ends) and focusing an off-screen card all snap the
//   rail
// - Autoplay steps one card every 4.5 s and rewinds at the end; it pauses on hover, focus
//   and drag and is off for prefers-reduced-motion users unless they press Play
// - Card links go to #yardstick-<id>; "See the full ranking" → #yardstick-top-rated

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TopRatedCardsSlider from '@/TestComponent/PageSections/directory/Slider02';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <TopRatedCardsSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import {
    HiArrowLongLeft,
    HiArrowLongRight,
    HiArrowRight,
    HiCheckBadge,
    HiMiniPause,
    HiMiniPlay,
    HiMiniStar,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_MS = 4500

const businesses = [
    {
        id: 'razor-rose',
        name: 'Razor & Rose Barbers',
        category: 'Barber',
        area: 'Gulshan 1',
        rating: 4.9,
        reviews: 1284,
        quote: 'Best skin fade in the city, and they actually listen.',
        author: 'Imran K.',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        alt: 'A barber trimming a client’s beard in a classic barber chair',
    },
    {
        id: 'calm-room',
        name: 'Calm Room Day Spa',
        category: 'Spa',
        area: 'Banani',
        rating: 4.9,
        reviews: 862,
        quote: 'Ninety minutes that felt like a week off work.',
        author: 'Farzana T.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        alt: 'A woman relaxing during a facial treatment at a spa',
    },
    {
        id: 'ember-oak',
        name: 'Ember & Oak',
        category: 'Fine dining',
        area: 'Gulshan 2',
        rating: 4.9,
        reviews: 2310,
        quote: 'The seven-course hilsa menu is a genuine event.',
        author: 'Rumana S.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
        alt: 'A plated fine-dining dish on a restaurant table with glassware',
    },
    {
        id: 'morning-loaf',
        name: 'Morning Loaf Bakery',
        category: 'Bakery',
        area: 'Dhanmondi',
        rating: 4.8,
        reviews: 1540,
        quote: 'Sourdough that sells out by ten, for good reason.',
        author: 'Tahmid R.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        alt: 'Rustic sourdough loaves on a floured bakery counter',
    },
    {
        id: 'ironbark',
        name: 'Ironbark Fitness Club',
        category: 'Gym',
        area: 'Dhanmondi',
        rating: 4.8,
        reviews: 1967,
        quote: 'Coaches who fix your form without being asked.',
        author: 'Nusrat J.',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
        alt: 'An athlete lifting a loaded barbell in a gym',
    },
    {
        id: 'paperboat-books',
        name: 'Paperboat Books',
        category: 'Bookshop',
        area: 'Dhanmondi',
        rating: 4.8,
        reviews: 604,
        quote: 'Found me a 1970s poetry collection in two days.',
        author: 'Arif H.',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
        alt: 'Tall wooden shelves full of books in a quiet bookshop',
    },
    {
        id: 'second-cup',
        name: 'Second Cup Roasters',
        category: 'Café',
        area: 'Banani',
        rating: 4.8,
        reviews: 1102,
        quote: 'Flat whites as good as anything I had in Melbourne.',
        author: 'Samira P.',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        alt: 'Two latte art coffees on a wooden table among plants',
    },
    {
        id: 'leaf-loam',
        name: 'Leaf & Loam Plants',
        category: 'Plant shop',
        area: 'Uttara',
        rating: 4.7,
        reviews: 391,
        quote: 'They repotted my dying fiddle-leaf fig for free.',
        author: 'Kamal D.',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        alt: 'A small succulent in a mint green pot',
    },
    {
        id: 'nightowl-grocers',
        name: 'Nightowl Grocers',
        category: 'Grocery',
        area: 'Mohammadpur',
        rating: 4.7,
        reviews: 758,
        quote: 'Open till 2 am and always has fresh limes.',
        author: 'Laila M.',
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
        alt: 'An “Open” sign hanging in a shop window',
    },
    {
        id: 'blade-bristle',
        name: 'Blade & Bristle',
        category: 'Grooming',
        area: 'Baridhara',
        rating: 4.7,
        reviews: 933,
        quote: 'A hot-towel shave that ruined every other shave.',
        author: 'Zubair A.',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        alt: 'A black and white barber shop interior with leather chairs and mirrors',
    },
]

const total = businesses.length
const pad = (n) => String(n).padStart(2, '0')
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]'

function Stars({ rating }) {
    return (
        <span className="relative inline-flex text-sm" aria-hidden="true">
            <span className="flex text-slate-200">
                {[0, 1, 2, 3, 4].map((i) => (
                    <HiMiniStar key={i} />
                ))}
            </span>
            <span className="absolute inset-y-0 left-0 flex overflow-hidden text-[#059669]" style={{ width: `${(rating / 5) * 100}%` }}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <HiMiniStar key={i} className="shrink-0" />
                ))}
            </span>
        </span>
    )
}

export function TopRatedCardsSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [index, setIndex] = useState(0)
    const [metrics, setMetrics] = useState({ step: 0, maxX: 0, perView: 4 })
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const viewportRef = useRef(null)
    const trackRef = useRef(null)
    const metricsRef = useRef(metrics)
    const indexRef = useRef(0)
    const controlsRef = useRef(null)
    const drag = useRef({ active: false, moved: false, t0: 0, startX: 0, startIndex: 0 })
    const x = useMotionValue(0)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging

    const maxIndex = metrics.step ? Math.max(0, Math.ceil((metrics.maxX - 1) / metrics.step)) : total - 1
    const lastVisible = Math.min(total, index + metrics.perView)

    metricsRef.current = metrics
    indexRef.current = index

    const fill = useMotionValue(0.4)

    const positionFor = useCallback((i) => {
        const { step, maxX } = metricsRef.current
        return -Math.min(i * step, maxX)
    }, [])

    const moveTo = useCallback(
        (target, instant = false) => {
            const { step, maxX } = metricsRef.current
            const last = step ? Math.max(0, Math.ceil((maxX - 1) / step)) : total - 1
            const next = clamp(target, 0, last)
            setIndex(next)
            controlsRef.current?.stop()
            const to = positionFor(next)
            if (instant) x.set(to)
            else controlsRef.current = animate(x, to, { type: 'spring', stiffness: 260, damping: 34, restDelta: 0.5 })
        },
        [positionFor, x],
    )

    useEffect(() => {
        setHydrated(true)
    }, [])

    // Measure the rail and keep the current card aligned when the layout changes.
    useEffect(() => {
        const viewport = viewportRef.current
        const track = trackRef.current
        if (!viewport || !track) return undefined
        const measure = () => {
            const cards = track.children
            if (cards.length < 2) return
            const step = cards[1].offsetLeft - cards[0].offsetLeft
            const lastCard = cards[cards.length - 1]
            const maxX = Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth - viewport.clientWidth)
            const perView = Math.max(1, Math.round((viewport.clientWidth + (step - cards[0].offsetWidth)) / step))
            metricsRef.current = { step, maxX, perView }
            setMetrics({ step, maxX, perView })
            const last = Math.max(0, Math.ceil((maxX - 1) / step))
            const i = Math.min(indexRef.current, last)
            setIndex(i)
            controlsRef.current?.stop()
            x.set(-Math.min(i * step, maxX))
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(viewport)
        return () => observer.disconnect()
    }, [x])

    useEffect(() => () => controlsRef.current?.stop(), [])

    // Scroll progress: the visible share of the rail plus how far it has travelled.
    useEffect(() => {
        const update = (v) => {
            const visible = Math.min(1, metrics.perView / total)
            const p = metrics.maxX ? clamp(-v / metrics.maxX, 0, 1) : 0
            fill.set(visible + (1 - visible) * p)
        }
        update(x.get())
        return x.on('change', update)
    }, [metrics, x, fill])

    useEffect(() => {
        if (!playing) return undefined
        const timer = setTimeout(() => {
            moveTo(index >= maxIndex ? 0 : index + 1, reduce)
        }, AUTOPLAY_MS)
        return () => clearTimeout(timer)
    }, [playing, index, maxIndex, moveTo, reduce])

    const beginDrag = () => {
        if (drag.current.active) return
        controlsRef.current?.stop()
        drag.current.active = true
        drag.current.moved = true
        drag.current.startX = x.get()
        drag.current.startIndex = indexRef.current
        setDragging(true)
    }

    const onPan = (_, info) => {
        beginDrag()
        const { maxX } = metricsRef.current
        let next = drag.current.startX + info.offset.x
        if (next > 0) next *= 0.3
        else if (next < -maxX) next = -maxX + (next + maxX) * 0.3
        x.set(next)
    }

    const onPanEnd = (_, info) => {
        if (!drag.current.active) return
        drag.current.active = false
        setDragging(false)
        const { step, maxX } = metricsRef.current
        const dx = info.offset.x
        const vx = info.velocity.x
        const quick = performance.now() - drag.current.t0 < 250 && Math.abs(dx) > 24
        const fling = Math.abs(vx) > 400 && Math.sign(vx) === Math.sign(dx)
        const last = step ? Math.max(0, Math.ceil((maxX - 1) / step)) : 0
        const current = -x.get()
        let target = drag.current.startIndex
        let best = Infinity
        for (let i = 0; i <= last; i += 1) {
            const distance = Math.abs(Math.min(i * step, maxX) - current)
            if (distance < best) {
                best = distance
                target = i
            }
        }
        const pushed = quick || fling || Math.abs(dx) > step * 0.2
        if (pushed && target === drag.current.startIndex && dx !== 0) target += dx < 0 ? 1 : -1
        moveTo(target, reduce)
        setTimeout(() => {
            drag.current.moved = false
        }, 0)
    }

    const handleKeyDown = (event) => {
        const keys = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: maxIndex }
        if (!(event.key in keys)) return
        event.preventDefault()
        setFocused(true)
        moveTo(keys[event.key], reduce)
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
                'relative overflow-hidden bg-white px-4 py-14 text-base font-normal text-slate-900 sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#059669]">
                                Yardstick Reviews · Top rated · Sep 2026
                            </p>
                            <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-6xl">
                                The ten highest-rated in Dhaka <span className="text-[#059669]">right now.</span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                onClick={() => setPlayPref(!autoplayOn)}
                                className={cn(
                                    'grid h-11 w-11 place-items-center rounded-full text-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900',
                                    focusRing,
                                )}
                            >
                                {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                            </button>
                            <button
                                type="button"
                                aria-label="Previous businesses"
                                disabled={index === 0}
                                onClick={() => moveTo(index - 1, reduce)}
                                className={cn(
                                    'grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-lg text-slate-900 transition-colors hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-300',
                                    focusRing,
                                )}
                            >
                                <HiArrowLongLeft aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next businesses"
                                disabled={index >= maxIndex}
                                onClick={() => moveTo(index + 1, reduce)}
                                className={cn(
                                    'grid h-11 w-11 place-items-center rounded-full bg-[#059669] text-lg text-white transition-colors hover:bg-[#047857] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400',
                                    focusRing,
                                )}
                            >
                                <HiArrowLongRight aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Top-rated businesses"
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
                        className={cn('mt-10 rounded-[22px]', focusRing, 'focus-visible:outline-offset-4')}
                    >
                        <motion.div
                            ref={viewportRef}
                            onScroll={(event) => {
                                event.currentTarget.scrollLeft = 0
                            }}
                            onPointerDown={() => {
                                drag.current.t0 = performance.now()
                                drag.current.moved = false
                            }}
                            onPanStart={beginDrag}
                            onPan={onPan}
                            onPanEnd={onPanEnd}
                            onClickCapture={(event) => {
                                if (drag.current.moved) {
                                    event.preventDefault()
                                    event.stopPropagation()
                                }
                            }}
                            className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
                        >
                            <motion.ul ref={trackRef} style={{ x }} className="flex gap-4 lg:gap-5">
                                {businesses.map((item, i) => (
                                    <li
                                        key={item.id}
                                        role="group"
                                        aria-roledescription="slide"
                                        aria-label={`${i + 1} of ${total}: ${item.name}`}
                                        onFocus={() => {
                                            if (i < index || i >= index + metrics.perView) moveTo(i, true)
                                        }}
                                        className="w-[84%] shrink-0 sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]"
                                    >
                                        <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-[0_24px_50px_-28px_rgba(5,150,105,0.45)]">
                                            <div className="relative aspect-[5/4] overflow-hidden bg-slate-100">
                                                <img
                                                    src={item.image}
                                                    alt={item.alt}
                                                    loading="lazy"
                                                    draggable={false}
                                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                                                />
                                                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-900 shadow-sm">
                                                    No. {pad(i + 1)}
                                                </span>
                                            </div>
                                            <div className="flex flex-1 flex-col p-5">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                                                            {item.category} · {item.area}
                                                        </p>
                                                        <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight text-slate-900">
                                                            {item.name}
                                                        </h3>
                                                    </div>
                                                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#059669] text-lg font-semibold tabular-nums text-white">
                                                        {item.rating.toFixed(1)}
                                                        <span className="sr-only"> out of 5</span>
                                                    </span>
                                                </div>
                                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                                    <Stars rating={item.rating} />
                                                    {item.reviews.toLocaleString('en-US')} reviews
                                                </div>
                                                <blockquote className="mt-4 border-l-2 border-[#059669]/40 pl-3 text-sm italic leading-6 text-slate-700">
                                                    “{item.quote}”
                                                    <footer className="mt-1 text-xs not-italic text-slate-500">— {item.author}</footer>
                                                </blockquote>
                                                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#047857]">
                                                        <HiCheckBadge aria-hidden="true" className="text-base" />
                                                        Verified
                                                    </span>
                                                    <a
                                                        href={`#yardstick-${item.id}`}
                                                        draggable={false}
                                                        className={cn(
                                                            'group/link inline-flex min-h-10 items-center gap-1.5 rounded text-sm font-semibold text-slate-900 hover:text-[#047857]',
                                                            focusRing,
                                                        )}
                                                    >
                                                        Read reviews
                                                        <span className="sr-only"> of {item.name}</span>
                                                        <HiArrowRight
                                                            aria-hidden="true"
                                                            className="transition-transform duration-300 group-hover/link:translate-x-1"
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                        </article>
                                    </li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                        <div className="flex flex-1 items-center gap-4">
                            <p className="shrink-0 font-mono text-sm tabular-nums text-slate-900">
                                {pad(index + 1)}–{pad(lastVisible)}
                                <span className="text-slate-400"> / {pad(total)}</span>
                            </p>
                            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                                <motion.span
                                    className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[#059669]"
                                    style={{ scaleX: fill }}
                                />
                            </div>
                        </div>
                        <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                            Showing businesses {index + 1} to {lastVisible} of {total}
                        </p>
                        <a
                            href="#yardstick-top-rated"
                            className={cn(
                                'group inline-flex min-h-10 items-center gap-2 self-start rounded text-sm font-semibold text-[#047857] sm:self-auto',
                                focusRing,
                            )}
                        >
                            See the full ranking
                            <HiArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default TopRatedCardsSlider

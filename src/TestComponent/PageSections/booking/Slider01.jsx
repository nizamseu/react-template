// DestinationParallaxSlider

// Slider01 · Booking & Reservations › Animated Slider

// Description:
// A Wayfare "Where to next?" destination slider with five autumn escapes (Kyoto, Amalfi
// Coast, Hạ Long Bay, the Dolomites and Bali). Each slide pairs a framed photo with the
// destination name, a serif tagline, three quick facts, a "From $1,240 · 7 nights"
// price chip and an "Explore …" link, and every layer moves at its own speed so the
// photo drifts slower than the text. Use it on a travel homepage or an inspiration
// landing page.

// Design:
// - White #ffffff section, ink #0c2d48 text, ocean blue #0369a1 accent, pale sea
//   #e0f2fe photo well; outlined ghost name (text-stroke) behind the copy, white price
//   chip with a soft blue shadow, rounded-[1.75rem] photo frame
// - Stage has a fixed height per breakpoint (640px → sm:600px → lg:540px): photo on top
//   and copy below at base/sm; photo in the right 60% and copy in the left 36% from lg
// - Layers per slide share one x motion value: text 1×, price chip 0.6×, ghost name
//   0.45×, photo 0.18× (inside an oversized image); layers fade with distance
// - Controls: counter in the header; a row of destination tabs (progress line, labels
//   from md) with pause / prev / next round buttons; mono labels, semibold tight names

// What it does:
// - State: [index, previous] slide, hover/focus/drag flags, play preference. A progress
//   motion value animates 0 → 1 over 6 s and advances; paused on mouse hover, keyboard
//   focus and drag, resumed where it stopped; off for prefers-reduced-motion (until
//   Play)
// - Navigation animates the new slide in from the side it comes from while the old one
//   continues out from wherever the drag left it. Drag/swipe (framer-motion pan with
//   touch-action pan-y) moves 18% of the stage, a fast flick (> 500 px/s, or < 250 ms
//   and > 24 px) also counts; ←/→/Home/End on the focused stage, dots and buttons work
//   too
// - The active slide is announced in an aria-live label (quiet while autoplaying); a
//   click after a drag never follows the CTA; CTAs link to #wayfare-<destination>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DestinationParallaxSlider from '@/TestComponent/PageSections/booking/Slider01';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <DestinationParallaxSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, motionValue, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { LuWaves } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6
const EASE = [0.22, 1, 0.36, 1]
const SPRING = { type: 'spring', stiffness: 110, damping: 21 }

const slides = [
    {
        id: 'kyoto',
        name: 'Kyoto',
        region: 'Japan · Kansai',
        tagline: 'Temple bells and maple season.',
        copy: 'Seven nights in a Gion ryokan with a kaiseki dinner, a dawn walk through Fushimi Inari and a day in Nara.',
        facts: [
            ['Best', 'Mid-Nov'],
            ['Flight', '11h 20m'],
            ['Avg', '14°C'],
        ],
        price: '$1,240',
        nights: '7 nights',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80',
        alt: 'Stone-paved Kyoto street leading to a five-storey pagoda',
    },
    {
        id: 'amalfi',
        name: 'Amalfi Coast',
        region: 'Italy · Campania',
        tagline: 'Lemon groves and late swims.',
        copy: 'Cliffside hotel in Positano, a private boat day to Capri and a cooking class in a Ravello lemon grove.',
        facts: [
            ['Best', 'Early Oct'],
            ['Flight', '9h 40m'],
            ['Sea', '23°C'],
        ],
        price: '$1,580',
        nights: '6 nights',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=80',
        alt: 'Pastel houses stacked on cliffs above the sea on the Amalfi Coast',
    },
    {
        id: 'halong',
        name: 'Hạ Long Bay',
        region: 'Vietnam · Quảng Ninh',
        tagline: 'Sleep among limestone islands.',
        copy: 'Two nights on a teak junk, kayaking into hidden lagoons, then Hanoi street food with a local guide.',
        facts: [
            ['Best', 'Oct–Nov'],
            ['Flight', '15h 05m'],
            ['Avg', '26°C'],
        ],
        price: '$990',
        nights: '8 nights',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80',
        alt: 'Wooden boats on calm green water between karst islands in Hạ Long Bay',
    },
    {
        id: 'dolomites',
        name: 'Dolomites',
        region: 'Italy · South Tyrol',
        tagline: 'Alpine mornings on still water.',
        copy: 'Hut-to-hut hiking with luggage transfers, a rowing-boat morning on Lago di Braies and a spa night in Cortina.',
        facts: [
            ['Best', 'Late Sep'],
            ['Flight', '10h 15m'],
            ['Avg', '11°C'],
        ],
        price: '$1,120',
        nights: '6 nights',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80',
        alt: 'Rowing boat on a turquoise alpine lake below forested mountains',
    },
    {
        id: 'bali',
        name: 'Bali',
        region: 'Indonesia · Tabanan',
        tagline: 'Water temples and rice terraces.',
        copy: 'Villa with a plunge pool in Ubud, sunrise at Ulun Danu Beratan and a slow day on the Nusa Penida coast.',
        facts: [
            ['Best', 'Sep–Oct'],
            ['Flight', '17h 30m'],
            ['Avg', '28°C'],
        ],
        price: '$1,060',
        nights: '9 nights',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80',
        alt: 'Balinese water temple with tiered roofs on a misty lake',
    },
]

const total = slides.length
const wrap = (i) => ((i % total) + total) % total
const pad = (n) => String(n).padStart(2, '0')

function PhotoLayer({ slide, x, width, current, eager }) {
    const px = useTransform(x, (v) => v * 0.18)
    const opacity = useTransform([x, width], ([v, w]) => 1 - Math.min(1, Math.abs(v) / (w * 0.85)))
    const scale = useTransform([x, width], ([v, w]) => 1.06 + Math.min(1, Math.abs(v) / w) * 0.06)
    return (
        <motion.div style={{ opacity }} className={cn('absolute inset-0', current ? 'z-10' : 'z-0')}>
            <motion.img
                src={slide.image}
                alt={current ? slide.alt : ''}
                aria-hidden={current ? undefined : true}
                loading={eager ? undefined : 'lazy'}
                draggable={false}
                style={{ x: px, scale }}
                className="absolute inset-y-0 -left-[14%] h-full w-[128%] max-w-none select-none object-cover"
            />
        </motion.div>
    )
}

function CopyLayer({ slide, x, width, current, index, moved }) {
    const opacity = useTransform([x, width], ([v, w]) => 1 - Math.min(1, Math.abs(v) / (w * 0.45)))
    const chipX = useTransform(x, (v) => v * 0.6)
    const ghostX = useTransform(x, (v) => v * 0.45)
    return (
        <div aria-hidden={current ? undefined : true} className={cn('absolute inset-0', current ? 'z-20' : 'pointer-events-none z-10')}>
            <motion.p
                aria-hidden="true"
                style={{ x: ghostX, opacity }}
                className="pointer-events-none absolute bottom-2 left-0 -z-10 whitespace-nowrap text-[5.5rem] font-bold uppercase leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_rgba(3,105,161,0.24)] sm:text-[8rem] lg:-bottom-4 lg:text-[11rem]"
            >
                {slide.name}
            </motion.p>

            <motion.div
                style={{ x: chipX, opacity }}
                className="absolute left-4 top-[222px] z-30 inline-flex items-baseline gap-2 rounded-full bg-white px-4 py-2.5 text-[#0c2d48] shadow-[0_14px_30px_-12px_rgba(3,105,161,0.55)] sm:top-[240px] lg:left-[36%] lg:top-auto lg:bottom-10"
            >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0369a1]">From</span>
                <span className="text-lg font-semibold tracking-tight">{slide.price}</span>
                <span className="text-xs text-[#0c2d48]/60">· {slide.nights}, flights incl.</span>
            </motion.div>

            <motion.div
                style={{ x, opacity }}
                className="absolute inset-x-0 bottom-0 top-[300px] flex flex-col sm:top-[322px] lg:inset-y-0 lg:right-auto lg:w-[36%] lg:justify-center lg:pr-4"
            >
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0369a1]">
                    <span className="h-px w-6 bg-[#0369a1]" />
                    {pad(index + 1)} · {slide.region}
                </p>
                <h3 className="mt-3 text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.04em] text-[#0c2d48] sm:text-6xl lg:text-7xl">
                    {slide.name}
                </h3>
                <p className="mt-2 font-serif text-xl italic text-[#0369a1] sm:text-2xl">{slide.tagline}</p>
                <p className="mt-3 line-clamp-3 max-w-md text-sm leading-6 text-[#0c2d48]/70 sm:text-base sm:leading-7">
                    {slide.copy}
                </p>
                <dl className="mt-4 flex gap-5 sm:gap-8">
                    {slide.facts.map(([k, v]) => (
                        <div key={k}>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0c2d48]/50">{k}</dt>
                            <dd className="text-sm font-semibold text-[#0c2d48]">{v}</dd>
                        </div>
                    ))}
                </dl>
                <a
                    href={`#wayfare-${slide.id}`}
                    tabIndex={current ? undefined : -1}
                    draggable={false}
                    className="group mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#0369a1] pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#075985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                    onClickCapture={(event) => {
                        if (moved.current && event.detail > 0) {
                            event.preventDefault()
                            event.stopPropagation()
                        }
                    }}
                >
                    Explore {slide.name}
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-45">
                        <HiArrowUpRight aria-hidden="true" />
                    </span>
                </a>
            </motion.div>
        </div>
    )
}

export function DestinationParallaxSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [[index, previous], setPair] = useState([0, null])
    const [xs] = useState(() => slides.map(() => motionValue(0)))
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const width = useMotionValue(1000)
    const stageRef = useRef(null)
    const indexRef = useRef(0)
    const generation = useRef(0)
    const panning = useRef(false)
    const moved = useRef(false)
    const downAt = useRef(0)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging

    useEffect(() => {
        setHydrated(true)
        const el = stageRef.current
        if (!el) return undefined
        const measure = () => width.set(el.offsetWidth || 1000)
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [width])

    const goTo = useCallback(
        (target, dir) => {
            const from = indexRef.current
            const to = wrap(target)
            if (to === from) return
            const w = width.get()
            const token = (generation.current += 1)
            indexRef.current = to
            progress.jump(0)
            const oldX = xs[from]
            const newX = xs[to]
            newX.stop()
            if (reduce) {
                oldX.jump(0)
                newX.jump(0)
                setPair([to, null])
                return
            }
            newX.jump(dir * w)
            setPair([to, from])
            animate(newX, 0, SPRING)
            animate(oldX, -dir * w, { duration: 0.75, ease: EASE }).then(() => {
                if (generation.current === token) setPair(([i]) => [i, null])
            })
        },
        [progress, reduce, width, xs],
    )

    const paginate = useCallback((dir) => goTo(indexRef.current + dir, dir), [goTo])

    const jumpTo = (target) => {
        if (target === indexRef.current) return
        goTo(target, target > indexRef.current ? 1 : -1)
    }

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
        preload.src = slides[wrap(index + 1)].image
    }, [index])

    // framer-motion runs onPan before onPanStart, so whichever fires first sets up the drag.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        xs[indexRef.current].stop()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        xs[indexRef.current].set(info.offset.x * 0.7)
    }

    const handlePanEnd = (_, info) => {
        beginPan()
        panning.current = false
        setDragging(false)
        const dx = info.offset.x
        const elapsed = performance.now() - downAt.current
        const threshold = Math.min(140, width.get() * 0.18)
        let dir = 0
        if (Math.abs(dx) > threshold) dir = dx < 0 ? 1 : -1
        else if (Math.abs(info.velocity.x) > 500 && Math.sign(info.velocity.x) === Math.sign(dx)) dir = dx < 0 ? 1 : -1
        else if (elapsed < 250 && Math.abs(dx) > 24) dir = dx < 0 ? 1 : -1
        if (dir) paginate(dir)
        else animate(xs[indexRef.current], 0, SPRING)
    }

    const handleKeyDown = (event) => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
        // Keep focus alive when the focused CTA belongs to the slide that is leaving.
        const stage = stageRef.current
        if (stage && stage !== event.target && stage.contains(event.target)) stage.focus({ preventScroll: true })
        if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Home') jumpTo(0)
        else if (event.key === 'End') jumpTo(total - 1)
        else return
        event.preventDefault()
        setFocused(true)
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

    const slide = slides[index]
    const rendered = previous === null ? [index] : [previous, index]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#ffffff] px-4 py-14 text-base font-normal text-[#0c2d48] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#0369a1]">
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0369a1] text-white">
                                <LuWaves aria-hidden="true" className="h-4 w-4" />
                            </span>
                            Wayfare · Autumn escapes 2026
                        </p>
                        <h2 className="mt-4 text-4xl font-semibold leading-[1] tracking-[-0.04em] text-[#0c2d48] sm:text-5xl lg:text-6xl">
                            Where to <span className="font-serif font-normal italic text-[#0369a1]">next?</span>
                        </h2>
                    </div>
                    <p aria-hidden="true" className="font-mono text-sm text-[#0c2d48]/45">
                        <span className="text-3xl font-semibold text-[#0c2d48] sm:text-4xl">{pad(index + 1)}</span> / {pad(total)}
                    </p>
                </div>

                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Wayfare featured destinations"
                    className="mt-8 sm:mt-10"
                    onFocus={handleFocus}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
                    }}
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
                        aria-label="Destinations, drag or use the left and right arrow keys to browse"
                        className={cn(
                            'relative isolate h-[640px] touch-pan-y select-none overflow-hidden rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0369a1] sm:h-[600px] lg:h-[540px]',
                            dragging ? 'cursor-grabbing' : 'cursor-grab',
                        )}
                        onKeyDown={handleKeyDown}
                        onPointerDownCapture={() => {
                            moved.current = false
                            downAt.current = performance.now()
                        }}
                        onPanStart={beginPan}
                        onPan={handlePan}
                        onPanEnd={handlePanEnd}
                    >
                        <div className="absolute inset-x-0 top-0 h-[280px] overflow-hidden rounded-[1.75rem] bg-[#e0f2fe] sm:h-[300px] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[60%]">
                            {rendered.map((i) => (
                                <PhotoLayer
                                    key={slides[i].id}
                                    slide={slides[i]}
                                    x={xs[i]}
                                    width={width}
                                    current={i === index}
                                    eager={i === 0}
                                />
                            ))}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 z-20 bg-linear-to-t from-[#0c2d48]/25 via-transparent to-transparent"
                            />
                        </div>
                        {rendered.map((i) => (
                            <CopyLayer
                                key={slides[i].id}
                                slide={slides[i]}
                                x={xs[i]}
                                width={width}
                                current={i === index}
                                index={i}
                                moved={moved}
                            />
                        ))}
                    </motion.div>

                    <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                        Destination {index + 1} of {total}: {slide.name}, from {slide.price}
                    </p>

                    <div className="mt-6 flex items-center gap-4 sm:gap-6">
                        <div role="group" aria-label="Choose a destination" className="flex min-w-0 flex-1 gap-2 sm:gap-3">
                            {slides.map((s, i) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    aria-label={`Go to ${s.name}`}
                                    aria-current={i === index ? 'true' : undefined}
                                    className="group flex h-11 min-w-0 flex-1 flex-col justify-center gap-2 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                                    onClick={() => jumpTo(i)}
                                >
                                    <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-[#0369a1]/15">
                                        <motion.span
                                            className="absolute inset-0 origin-left rounded-full bg-[#0369a1]"
                                            style={{ scaleX: i === index ? (autoplayOn ? progress : 1) : 0 }}
                                        />
                                    </span>
                                    <span
                                        className={cn(
                                            'hidden truncate text-xs font-semibold transition-colors md:block',
                                            i === index ? 'text-[#0c2d48]' : 'text-[#0c2d48]/40 group-hover:text-[#0c2d48]/70',
                                        )}
                                    >
                                        {s.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                className="grid h-11 w-11 place-items-center rounded-full text-lg text-[#0c2d48]/70 transition-colors hover:bg-[#e0f2fe] hover:text-[#0c2d48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                                onClick={() => setPlayPref(!autoplayOn)}
                            >
                                {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                            </button>
                            <button
                                type="button"
                                aria-label="Previous destination"
                                className="grid h-11 w-11 place-items-center rounded-full border border-[#0369a1]/30 text-lg text-[#0369a1] transition-colors hover:bg-[#e0f2fe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                                onClick={() => paginate(-1)}
                            >
                                <HiArrowLongLeft aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next destination"
                                className="grid h-11 w-11 place-items-center rounded-full bg-[#0369a1] text-lg text-white transition-colors hover:bg-[#075985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                                onClick={() => paginate(1)}
                            >
                                <HiArrowLongRight aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DestinationParallaxSlider

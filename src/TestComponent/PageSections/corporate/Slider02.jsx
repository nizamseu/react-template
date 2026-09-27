// OfficeLocationsSlider

// Slider02 · Corporate & Business › Animated Slider

// Description:
// "Five desks, one promise." A location carousel for Meridian Logistics that moves through
// its Chicago headquarters and the Hai Phong, Tokyo, Paris and New York desks. Each slide
// is a city photograph with an overlapping office card (stop code, role, one-line story,
// team size, year opened, floor space, services, address, phone, "Plan a visit"), and a
// route line of stops underneath doubles as the pager. Use it on about, contact or
// careers pages to show where a company works.

// Design:
// - Navy #0b1f3a section, card #0e2645 with a 3px signal-orange #ff6b1a top rule, text
//   #e8eef7, muted #a9bbd6; mono stop codes (MRD-CHI) and a huge outlined city code
// - Parallax: the incoming photo layer slides over the old one while the photo inside it
//   moves at half speed, the old layer drifts 30% and dims; the card and the outlined code
//   travel on their own, later curves, so image and text separate as they move; while
//   dragging the photo follows 1×, the card 0.5× and the code 0.25×
// - Route line: five stops on a hairline; visited stops and the line fill orange and the
//   current leg fills with the 6 s autoplay progress; city names show from sm
// - Responsive: base/md the photo (4:3 → sm:16:9) sits above the card, which overlaps it
//   by 2.5rem; at lg the photo spans 8 of 12 columns and the card overlaps it from the
//   right; card height is fixed by an invisible stack of every card (no jumps)

// What it does:
// - State [index, direction] plus hover, focus, drag and play/pause flags; a framer-motion
//   animate() fills the progress value and advances on complete, pausing on hover, focus
//   and drag; autoplay is off for reduced motion until Play is pressed
// - Drag or swipe the photo (60 px, a fast flick, or any >24 px swipe under 250 ms; left
//   = next), ←/→/Home/End keys, prev/next buttons and the route stops all navigate,
//   wrapping at the ends; the next photo is preloaded
// - Links go to #meridian-visit-<code>, #meridian-call-<code> and #meridian-hubs

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OfficeLocationsSlider from '@/TestComponent/PageSections/corporate/Slider02';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <OfficeLocationsSlider />
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
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6
const EASE = [0.76, 0, 0.24, 1]
const SOFT = [0.22, 1, 0.36, 1]

const offices = [
    {
        id: 'chi',
        code: 'MRD-CHI',
        city: 'Chicago',
        country: 'United States',
        role: 'Headquarters & 24/7 dispatch',
        story: 'Where two box trucks became 31 hubs. Dispatch runs around the clock from the fourth floor.',
        address: '1140 W Fulton Market, Chicago, IL 60607',
        phone: '+1 (312) 555-0198',
        team: '412',
        opened: '1998',
        space: '6,800 m²',
        services: ['Road', 'Air', 'Customs'],
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80',
        alt: 'Aerial view of downtown Chicago towers with Lake Michigan behind them at dusk',
    },
    {
        id: 'hph',
        code: 'MRD-HPH',
        city: 'Hai Phong',
        country: 'Vietnam',
        role: 'Sea-freight consolidation desk',
        story: 'Our busiest desk per square metre: 4,200 TEU in its first year, 61,000 last year.',
        address: 'Lot B4, Dinh Vu Industrial Zone, Hai Phong',
        phone: '+84 225 3555 0170',
        team: '86',
        opened: '2007',
        space: '22,000 m²',
        services: ['Ocean', 'Consolidation', 'Customs'],
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
        alt: 'Boats moored among limestone karsts in Ha Long Bay, near Hai Phong',
    },
    {
        id: 'tyo',
        code: 'MRD-TYO',
        city: 'Tokyo',
        country: 'Japan',
        role: 'Air gateway & pharma cold chain',
        story: 'Temperature-logged pharma lanes to Chicago in 19 hours, door to door.',
        address: 'Narita Cargo Building 7, Narita, Chiba 282-0011',
        phone: '+81 476 55 0142',
        team: '54',
        opened: '2016',
        space: '9,400 m²',
        services: ['Air', 'Cold chain'],
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
        alt: 'Neon-lit Tokyo street at night with signs above the crowd',
    },
    {
        id: 'cdg',
        code: 'MRD-CDG',
        city: 'Paris',
        country: 'France',
        role: 'European road & air hub',
        story: 'Overnight trucking to 14 EU countries, customs cleared before the trailers arrive.',
        address: 'Zone de Fret 4, 95700 Roissy-en-France',
        phone: '+33 1 70 55 01 80',
        team: '128',
        opened: '2012',
        space: '31,000 m²',
        services: ['Road', 'Air', 'Customs'],
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
        alt: 'Stone bridge over the Seine in Paris at dusk',
    },
    {
        id: 'ewr',
        code: 'MRD-EWR',
        city: 'New York',
        country: 'United States',
        role: 'Port Newark & East Coast gateway',
        story: 'Containers come off the ship at Port Newark and leave on a Chicago-bound train within 36 hours.',
        address: '1210 Corbin St, Port Newark, NJ 07114',
        phone: '+1 (973) 555-0164',
        team: '97',
        opened: '2020',
        space: '14,500 m²',
        services: ['Ocean', 'Rail', 'Customs'],
        image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
        alt: 'Lower Manhattan skyline across the water at dusk',
    },
]

const total = offices.length

const layer = {
    enter: (dir) => ({ x: dir < 0 ? '-100%' : '100%', zIndex: 2 }),
    center: { x: '0%', zIndex: 2, transition: { duration: 0.95, ease: EASE } },
    exit: (dir) => ({ x: dir < 0 ? '30%' : '-30%', zIndex: 1, transition: { duration: 0.95, ease: EASE } }),
}

const photo = {
    enter: (dir) => ({ x: dir < 0 ? '50%' : '-50%', scale: 1.08 }),
    center: { x: '0%', scale: 1, transition: { duration: 0.95, ease: EASE } },
    exit: { x: '0%', transition: { duration: 0.95 } },
}

const shade = {
    enter: { opacity: 0 },
    center: { opacity: 0 },
    exit: { opacity: 0.6, transition: { duration: 0.95 } },
}

const card = {
    enter: (dir) => ({ x: dir < 0 ? -90 : 90, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.8, ease: SOFT, delay: 0.25 } },
    exit: (dir) => ({ x: dir < 0 ? 40 : -40, opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }),
}

const ghost = {
    enter: (dir) => ({ x: dir < 0 ? -160 : 160, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 1.2, ease: SOFT, delay: 0.1 } },
    exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0, transition: { duration: 0.5 } }),
}

function OfficeCard({ office, live }) {
    return (
        <div className="relative">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#ff6b1a]">
                {office.code}
                <span className="text-[#a9bbd6]">{office.role}</span>
            </p>
            <h3 className="mt-3 text-4xl font-semibold leading-none tracking-[-0.035em] text-[#f5f8fc] sm:text-5xl">
                {office.city}
                <span className="ml-3 align-middle text-sm font-normal tracking-normal text-[#a9bbd6]">{office.country}</span>
            </h3>
            <p className="mt-4 text-[15px] leading-7 text-[#c3d0e3]">{office.story}</p>
            <dl className="mt-5 grid grid-cols-3 gap-px border border-[#26446e] bg-[#26446e]">
                {[
                    ['Team', office.team],
                    ['Opened', office.opened],
                    ['Space', office.space],
                ].map(([k, v]) => (
                    <div key={k} className="min-w-0 bg-[#0e2645] px-2.5 py-2.5 sm:px-3">
                        <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#a9bbd6]">{k}</dt>
                        <dd className="mt-0.5 whitespace-nowrap text-base font-semibold tabular-nums text-[#f5f8fc] sm:text-lg">{v}</dd>
                    </div>
                ))}
            </dl>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Services">
                {office.services.map((s) => (
                    <li key={s} className="rounded-full border border-[#3a5d8c] px-2.5 py-1 text-xs text-[#e8eef7]">
                        {s}
                    </li>
                ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-[#c3d0e3]">{office.address}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                    href={`#meridian-visit-${office.id}`}
                    draggable={false}
                    tabIndex={live ? undefined : -1}
                    className="group inline-flex h-11 items-center gap-2 bg-[#ff6b1a] px-4 text-sm font-semibold text-[#0b1f3a] transition-colors hover:bg-[#ff8440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8eef7]"
                >
                    Plan a visit
                    <HiArrowUpRight aria-hidden="true" className="transition-transform group-hover:rotate-45" />
                </a>
                <a
                    href={`#meridian-call-${office.id}`}
                    draggable={false}
                    tabIndex={live ? undefined : -1}
                    className="inline-flex min-h-10 items-center font-mono text-sm tabular-nums text-[#e8eef7] underline decoration-[#3a5d8c] underline-offset-4 hover:decoration-[#ff6b1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                >
                    {office.phone}
                </a>
            </div>
        </div>
    )
}

export function OfficeLocationsSlider({
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
    const cardX = useTransform(dragX, (v) => v * 0.5)
    const ghostX = useTransform(dragX, (v) => v * 0.25)
    const stageRef = useRef(null)
    const panning = useRef(false)
    const moved = useRef(false)
    const panAt = useRef(0)
    const snapBack = useRef(null)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const office = offices[index]

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

    // Warm the cache for the next city's photo.
    useEffect(() => {
        const preload = new window.Image()
        preload.src = offices[(index + 1) % total].image
    }, [index])

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
        dragX.set(info.offset.x)
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
        snapBack.current = animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 34 })
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0b1f3a] px-4 py-14 text-base font-normal text-[#e8eef7] sm:px-6 sm:py-16 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#a9bbd6]">
                                <span aria-hidden="true" className="h-2.5 w-2.5 bg-[#ff6b1a]" />
                                Meridian Logistics · Offices
                            </p>
                            <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#f5f8fc] sm:text-5xl lg:text-6xl">
                                Five desks, <span className="text-[#ff6b1a]">one promise.</span>
                            </h2>
                        </div>
                        <a
                            href="#meridian-hubs"
                            className="group inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-[#e8eef7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a] md:self-auto"
                        >
                            See all 31 hubs
                            <HiArrowLongRight aria-hidden="true" className="text-[#ff6b1a] transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Meridian office locations"
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
                            aria-label="Offices, drag or use the left and right arrow keys to browse"
                            className={cn(
                                'relative grid touch-pan-y select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b1a] lg:grid-cols-12',
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
                            <div className="relative isolate aspect-[4/3] overflow-hidden bg-[#081830] sm:aspect-[16/9] lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:aspect-[16/11]">
                                <motion.div className="absolute inset-0" style={{ x: dragX }}>
                                    <AnimatePresence initial={false} custom={direction}>
                                        <motion.div
                                            key={office.id}
                                            custom={direction}
                                            variants={layer}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="absolute inset-0 overflow-hidden"
                                        >
                                            <motion.img
                                                src={office.image}
                                                alt={office.alt}
                                                draggable={false}
                                                custom={direction}
                                                variants={photo}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                            <motion.span variants={shade} aria-hidden="true" className="absolute inset-0 bg-[#081830]" />
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-0 bg-linear-to-t from-[#081830]/70 via-transparent to-[#081830]/10"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </motion.div>
                                <p className="pointer-events-none absolute left-4 top-4 z-10 bg-[#0b1f3a]/80 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#e8eef7] backdrop-blur-sm sm:left-6 sm:top-6">
                                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {office.city}
                                </p>
                            </div>

                            <motion.div
                                aria-hidden="true"
                                style={{ x: ghostX }}
                                className="pointer-events-none absolute right-0 top-0 z-0 hidden lg:block"
                            >
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.span
                                        key={office.id}
                                        custom={direction}
                                        variants={ghost}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute right-0 top-0 block font-mono text-[11rem] font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(169,187,214,0.18)]"
                                    >
                                        {office.id.toUpperCase()}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.div>

                            <motion.div
                                style={{ x: cardX }}
                                className="relative z-10 mx-3 -mt-10 border-t-[3px] border-[#ff6b1a] bg-[#0e2645] p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] sm:mx-8 sm:p-7 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0 lg:mt-0 lg:self-end lg:-translate-y-10 lg:p-8"
                            >
                                <div className="grid">
                                    {offices.map((o) => (
                                        <div key={o.id} aria-hidden="true" className="invisible col-start-1 row-start-1">
                                            <OfficeCard office={o} live={false} />
                                        </div>
                                    ))}
                                    <AnimatePresence initial={false} custom={direction}>
                                        <motion.div
                                            key={office.id}
                                            role="group"
                                            aria-roledescription="slide"
                                            aria-label={`${index + 1} of ${total}: ${office.city}`}
                                            custom={direction}
                                            variants={card}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="col-start-1 row-start-1"
                                        >
                                            <OfficeCard office={office} live />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </motion.div>

                        <div className="mt-8 flex flex-col gap-4 lg:mt-4 lg:flex-row lg:items-center lg:gap-10">
                            <div className="relative min-w-0 flex-1">
                                <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-[21px] h-px bg-[#26446e]" />
                                <div
                                    aria-hidden="true"
                                    className="absolute left-[10%] top-[21px] h-px bg-[#ff6b1a] transition-[width] duration-700"
                                    style={{ width: `${(index / (total - 1)) * 80}%` }}
                                />
                                {index < total - 1 && (
                                    <div
                                        aria-hidden="true"
                                        className="absolute top-[21px] h-px w-[20%]"
                                        style={{ left: `${((index + 0.5) / total) * 100}%` }}
                                    >
                                        <motion.span
                                            className="absolute inset-0 origin-left bg-[#ff6b1a]/70"
                                            style={{ scaleX: autoplayOn && !reduce ? progress : 0 }}
                                        />
                                    </div>
                                )}
                                <div role="group" aria-label="Choose an office" className="relative grid grid-cols-5">
                                    {offices.map((o, i) => {
                                        const active = i === index
                                        return (
                                            <button
                                                key={o.id}
                                                type="button"
                                                aria-label={`Go to ${o.city}, ${o.role}`}
                                                aria-current={active ? 'true' : undefined}
                                                onClick={() => goTo(i)}
                                                className="group flex min-h-11 flex-col items-center gap-2 pt-4 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                                            >
                                                <span
                                                    className={cn(
                                                        'block h-3 w-3 rotate-45 border-2 transition-colors',
                                                        active && 'border-[#ff6b1a] bg-[#ff6b1a] ring-4 ring-[#ff6b1a]/25',
                                                        !active && i < index && 'border-[#ff6b1a] bg-[#0b1f3a]',
                                                        !active && i > index && 'border-[#3a5d8c] bg-[#0b1f3a] group-hover:border-[#a9bbd6]',
                                                    )}
                                                />
                                                <span
                                                    className={cn(
                                                        'font-mono text-[10px] uppercase tracking-[0.16em] sm:text-[11px]',
                                                        active ? 'text-[#ff6b1a]' : 'text-[#a9bbd6] group-hover:text-[#e8eef7]',
                                                    )}
                                                >
                                                    {o.id}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'hidden text-sm sm:block',
                                                        active ? 'font-semibold text-[#f5f8fc]' : 'text-[#a9bbd6]',
                                                    )}
                                                >
                                                    {o.city}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 lg:justify-end">
                                <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                                    Office {index + 1} of {total}: {office.city}, {office.role}
                                </p>
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    onClick={() => setPlayPref(!autoplayOn)}
                                    className="inline-flex h-11 items-center gap-2 px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#a9bbd6] transition-colors hover:text-[#f5f8fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" className="text-base" /> : <HiMiniPlay aria-hidden="true" className="text-base" />}
                                    {autoplayOn ? 'Pause' : 'Play'}
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        aria-label="Previous office"
                                        onClick={() => paginate(-1)}
                                        className="grid h-12 w-12 place-items-center border border-[#3a5d8c] text-xl text-[#e8eef7] transition-colors hover:border-[#ff6b1a] hover:text-[#ff6b1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                                    >
                                        <HiArrowLongLeft aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next office"
                                        onClick={() => paginate(1)}
                                        className="grid h-12 w-12 place-items-center bg-[#ff6b1a] text-xl text-[#0b1f3a] transition-colors hover:bg-[#ff8440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8eef7]"
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

export default OfficeLocationsSlider

// PriceBubbleMapView

// MapView03 · Booking & Reservations › Interactive Map View

// Description:
// A nautical-chart style villa map for Harbourline Villas. The cartouche headline "Villas
// along the Lagos coast" sits over a sand-and-sea SVG chart of the Algarve cliffs, where
// eight navy price bubbles (€310 – €760 a night) mark each villa. Clicking a bubble opens
// a small listing card on the map with photo, bedrooms, rating and "View villa". Use it
// for coastal or resort inventories where the view and the beach matter most.

// Design:
// - One large chart frame (560 → sm: 620 → lg: 700px tall, rounded-[32px]); from xl the
//   header "cartouche" floats over the chart's top-left corner, below xl it sits above
// - Sand #f6efe6 page, chart land #efe2cc with field patches, seafoam sea #c9dedc with
//   dotted depth contours and soundings, deep-sea navy #0b3954 for type and bubbles
// - Serif display heading (text-4xl → sm: 5xl), small-caps chart labels, a compass rose
//   and a lighthouse on Ponta da Piedade; bubbles are pills with a tail, viewed ones fade
//   to #5d7e96, filtered-out villas shrink to dots
// - The chart is a 1000×1000 SVG in "slice" mode with bubbles placed by container-query
//   units; the card is a bottom sheet inside the frame on mobile and, from sm, is measured
//   and set beside its bubble, kept inside the frame and clear of the xl cartouche
// - framer-motion springs bubbles, fades the card in and slides the filter pill;
//   everything is instant with reduced motion

// What it does:
// - openId opens the popup card and moves focus into it; Escape, the close button or a
//   click outside closes it and returns focus to the bubble
// - viewed (Set) remembers opened villas and tints their bubbles like visited links
// - minBeds (Any / 3+ / 4+ / 5+) and poolOnly filter the bubbles and close the card; the
//   match count is announced politely; "View villa" links point to #villa-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PriceBubbleMapView from '@/TestComponent/PageSections/booking/MapView03';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <PriceBubbleMapView />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiStar, HiXMark } from 'react-icons/hi2';
import { LuBedDouble, LuUsers, LuWaves } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const villas = [
    {
        id: 'casa-mare',
        name: 'Casa Maré',
        price: 420,
        beds: 3,
        guests: 6,
        pool: true,
        seaView: true,
        rating: 4.94,
        reviews: 61,
        x: 360,
        y: 560,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
        alt: 'White modern villa with a long pool and sun loungers',
    },
    {
        id: 'villa-farol',
        name: 'Villa Farol',
        price: 680,
        beds: 5,
        guests: 10,
        pool: true,
        seaView: true,
        rating: 4.98,
        reviews: 38,
        x: 455,
        y: 690,
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
        alt: 'Infinity pool deck that seems to run straight into the sea',
    },
    {
        id: 'quinta-rochas',
        name: 'Quinta das Rochas',
        price: 365,
        beds: 4,
        guests: 8,
        pool: true,
        seaView: false,
        rating: 4.86,
        reviews: 92,
        x: 520,
        y: 420,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
        alt: 'Villa with a turquoise pool framed by palm trees',
    },
    {
        id: 'casa-salina',
        name: 'Casa Salina',
        price: 310,
        beds: 2,
        guests: 4,
        pool: false,
        seaView: false,
        rating: 4.9,
        reviews: 47,
        x: 640,
        y: 330,
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
        alt: 'White house with a covered porch and a neat lawn',
    },
    {
        id: 'villa-alcatruz',
        name: 'Villa Alcatruz',
        price: 545,
        beds: 4,
        guests: 8,
        pool: true,
        seaView: true,
        rating: 4.92,
        reviews: 74,
        x: 700,
        y: 560,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        alt: 'White modernist villa with a pool under a blue sky',
    },
    {
        id: 'monte-sol',
        name: 'Monte do Sol',
        price: 395,
        beds: 3,
        guests: 6,
        pool: true,
        seaView: false,
        rating: 4.81,
        reviews: 55,
        x: 420,
        y: 330,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80',
        alt: 'Palm-lined pool glowing at sunset',
    },
    {
        id: 'casa-ponta',
        name: 'Casa Ponta',
        price: 760,
        beds: 6,
        guests: 12,
        pool: true,
        seaView: true,
        rating: 4.97,
        reviews: 29,
        x: 600,
        y: 640,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
        alt: 'Large white villa with a pool and lounge terrace',
    },
    {
        id: 'villa-amendoeira',
        name: 'Villa Amendoeira',
        price: 480,
        beds: 4,
        guests: 8,
        pool: false,
        seaView: false,
        rating: 4.88,
        reviews: 40,
        x: 725,
        y: 430,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        alt: 'Dark timber house under a large tree at dusk',
    },
]

const bedOptions = [
    { value: 0, label: 'Any' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 5, label: '5+' },
]

const COAST =
    'M0 520 C 80 540 150 600 230 610 C 290 618 320 650 340 700 C 360 760 420 800 470 770 C 520 740 540 700 590 705 C 640 712 650 690 665 672 C 700 640 760 652 820 622 C 880 592 940 602 1000 580'

const roads = [
    'M0 300 C 200 280 400 262 600 250 C 750 244 880 230 1000 200',
    'M300 282 C 320 400 330 480 360 560',
    'M520 252 C 512 330 520 380 520 420 C 525 500 560 580 600 640',
    'M640 248 L640 330',
    'M600 640 C 620 600 680 580 700 560 C 720 520 730 470 725 430',
    'M360 560 C 400 620 430 660 455 690',
    'M725 430 C 780 440 830 470 900 480 L1000 470',
    'M420 330 C 440 280 470 262 500 256',
    'M230 610 C 240 560 270 520 300 500',
]

const fields = [
    'M80 360 L200 340 L220 440 L100 460 Z',
    'M560 290 L620 280 L630 360 L570 370 Z',
    'M780 300 L900 280 L920 380 L800 400 Z',
    'M380 400 L470 390 L480 470 L390 480 Z',
    'M640 440 L700 420 L710 500 L650 510 Z',
]

const soundings = [
    { t: '12', x: 250, y: 760 },
    { t: '18', x: 150, y: 820 },
    { t: '9', x: 560, y: 790 },
    { t: '21', x: 700, y: 820 },
    { t: '14', x: 860, y: 720 },
    { t: '30', x: 420, y: 900 },
    { t: '26', x: 900, y: 880 },
]

// Deterministic scatter of olive and carob trees on the land (seeded, so SSR = client)
const trees = (() => {
    let seed = 7
    const rand = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
    }
    return Array.from({ length: 90 }, () => ({
        x: Math.round(rand() * 1000),
        y: Math.round(40 + rand() * 470),
        r: Math.round((2 + rand() * 3) * 10) / 10,
    }))
})()

const U = 'max(100cqw / 1000, 100cqh / 1000)'
const at = (x, y) => ({
    left: `calc(50% + ${x - 500} * ${U})`,
    top: `calc(50% + ${y - 500} * ${U})`,
})

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const euro = (n) => `€${n}`

export function PriceBubbleMapView({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [openId, setOpenId] = useState(null)
    const [viewed, setViewed] = useState(() => new Set())
    const [minBeds, setMinBeds] = useState(0)
    const [poolOnly, setPoolOnly] = useState(false)
    const bubbleRefs = useRef({})
    const cardRef = useRef(null)
    const mapRef = useRef(null)
    const headerRef = useRef(null)
    const [cardPos, setCardPos] = useState(null)
    const closeRef = useRef(null)

    const matches = (v) => v.beds >= minBeds && (!poolOnly || v.pool)
    const matchPrices = villas.filter(matches).map((v) => v.price)
    const matchCount = matchPrices.length
    const fromPrice = matchCount ? Math.min(...matchPrices) : null
    const open = villas.find((v) => v.id === openId && matches(v)) ?? null

    useEffect(() => {
        if (!open) return undefined
        closeRef.current?.focus({ preventScroll: true })
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setOpenId(null)
                bubbleRefs.current[open.id]?.focus()
            }
        }
        const onPointer = (e) => {
            if (cardRef.current?.contains(e.target)) return
            if (Object.values(bubbleRefs.current).some((el) => el?.contains(e.target))) return
            setOpenId(null)
        }
        document.addEventListener('keydown', onKey)
        document.addEventListener('pointerdown', onPointer)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.removeEventListener('pointerdown', onPointer)
        }
    }, [open])

    // From sm up the card is anchored next to its bubble: measure and keep it inside the chart
    useIsoLayoutEffect(() => {
        if (!open) return undefined
        const place = () => {
            const map = mapRef.current
            const card = cardRef.current
            const bubble = bubbleRefs.current[open.id]
            if (!map || !card || !bubble) return
            const m = map.getBoundingClientRect()
            const b = bubble.getBoundingClientRect()
            const cw = card.offsetWidth
            const ch = card.offsetHeight
            let left = Math.min(Math.max(10, b.left + b.width / 2 - m.left - cw / 2), m.width - cw - 10)
            let top = b.bottom - m.top + 12
            if (top + ch > m.height - 10) top = b.top - m.top - 12 - ch
            top = Math.min(Math.max(10, top), m.height - ch - 10)
            // From xl the header floats over the chart: slide the card clear of it
            const head = headerRef.current
            if (head && window.getComputedStyle(head).position === 'absolute') {
                const h = head.getBoundingClientRect()
                const overlapsY = m.top + top < h.bottom && m.top + top + ch > h.top
                if (overlapsY && m.left + left < h.right + 10) left = Math.min(h.right + 10 - m.left, m.width - cw - 10)
            }
            setCardPos({ left: Math.round(left), top: Math.round(top) })
        }
        place()
        window.addEventListener('resize', place)
        return () => window.removeEventListener('resize', place)
    }, [open])

    const toggleVilla = (id) => {
        if (openId === id) {
            setOpenId(null)
            return
        }
        setOpenId(id)
        setViewed((prev) => new Set(prev).add(id))
    }

    const closeCard = () => {
        const id = open?.id
        setOpenId(null)
        if (id) bubbleRefs.current[id]?.focus()
    }

    const spring = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 30 }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#f6efe6] py-14 text-base font-normal text-[#0b3954] md:py-20', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    <div ref={headerRef} className="xl:absolute xl:left-6 xl:top-6 xl:z-40 xl:w-[340px] xl:rounded-[26px] xl:border xl:border-[#0b3954]/15 xl:bg-[#f6efe6]/95 xl:p-7 xl:shadow-[0_24px_60px_-30px_rgba(11,57,84,0.55)] xl:backdrop-blur">
                        <p className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.24em] text-[#0b3954]/70">
                            <span>Harbourline Villas</span>
                            <span>Chart Nº 07</span>
                        </p>
                        <h2 className="mt-3 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#0b3954] sm:text-5xl xl:text-[44px]">
                            Villas along the <em className="italic">Lagos coast</em>
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#0b3954]/75">
                            Jul 4 – 11, 2026 · 7 nights · nightly rates include cleaning and linen. Tap a
                            price to peek inside.
                        </p>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center xl:flex-col xl:items-stretch">
                            <div>
                                <p id={`${uid}-beds`} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0b3954]/60">
                                    Bedrooms
                                </p>
                                <div className="mt-2 inline-flex rounded-full border border-[#0b3954]/20 bg-white/60 p-1" role="group" aria-labelledby={`${uid}-beds`}>
                                    {bedOptions.map((o) => (
                                        <button
                                            key={o.value}
                                            type="button"
                                            aria-pressed={minBeds === o.value}
                                            className="relative min-h-10 min-w-12 rounded-full px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3954]"
                                            onClick={() => {
                                                setMinBeds(o.value)
                                                setOpenId(null)
                                            }}
                                        >
                                            {minBeds === o.value && (
                                                <motion.span
                                                    layoutId={`${uid}-beds-pill`}
                                                    transition={spring}
                                                    className="absolute inset-0 rounded-full bg-[#0b3954]"
                                                />
                                            )}
                                            <span className={cn('relative', minBeds === o.value ? 'text-[#f6efe6]' : 'text-[#0b3954]')}>
                                                {o.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={poolOnly}
                                className="inline-flex min-h-11 items-center gap-3 self-start rounded-full py-1 pr-2 text-sm font-semibold text-[#0b3954] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3954] sm:self-end xl:self-start"
                                onClick={() => {
                                    setPoolOnly((p) => !p)
                                    setOpenId(null)
                                }}
                            >
                                <span className={cn('relative h-6 w-11 rounded-full transition-colors', poolOnly ? 'bg-[#0b3954]' : 'bg-[#0b3954]/20')}>
                                    <motion.span
                                        initial={false}
                                        animate={{ x: poolOnly ? 20 : 0 }}
                                        transition={spring}
                                        className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow"
                                    />
                                </span>
                                Private pool only
                            </button>
                        </div>

                        <p className="mt-5 border-t border-dashed border-[#0b3954]/25 pt-4 font-mono text-xs text-[#0b3954]/75" aria-live="polite">
                            {matchCount} of {villas.length} villas match
                            {fromPrice !== null && ` · from ${euro(fromPrice)} a night`}
                        </p>
                    </div>

                    <div ref={mapRef} className="relative mt-8 h-[560px] overflow-hidden rounded-[32px] border border-[#0b3954]/15 bg-[#c9dedc] [container-type:size] sm:h-[620px] lg:h-[700px] xl:mt-0">
                        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
                            <defs>
                                <pattern id={`${uid}-grain`} width="8" height="8" patternUnits="userSpaceOnUse">
                                    <rect width="8" height="8" fill="#efe2cc" />
                                    <circle cx="2" cy="2" r="0.9" fill="#e4d3b6" />
                                    <circle cx="6" cy="6" r="0.7" fill="#e7d8bf" />
                                </pattern>
                                <pattern id={`${uid}-cliff`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
                                    <line x1="0" y1="0" x2="0" y2="7" stroke="#c9b28c" strokeWidth="1.4" />
                                </pattern>
                            </defs>
                            <rect width="1000" height="1000" fill="#c9dedc" />
                            {[40, 90, 150].map((d) => (
                                <path
                                    key={d}
                                    d={COAST}
                                    transform={`translate(0 ${d})`}
                                    fill="none"
                                    stroke="#a9c9c7"
                                    strokeWidth="1.5"
                                    strokeDasharray="2 7"
                                />
                            ))}
                            <path d={`${COAST} L1000 0 L0 0 Z`} fill={`url(#${uid}-grain)`} />
                            {fields.map((d) => (
                                <path key={d} d={d} fill="#e8d6b7" opacity="0.8" />
                            ))}
                            <g fill="none" stroke="#e0cdaa" strokeWidth="1.5">
                                <path d="M560 360 C 600 320 680 330 700 380 C 720 430 660 470 600 450 C 550 430 530 390 560 360 Z" />
                                <path d="M580 370 C 610 345 665 352 680 385 C 690 415 650 440 610 430 C 575 420 562 392 580 370 Z" />
                                <path d="M120 250 C 200 220 300 240 320 300 C 330 350 250 380 180 360 C 110 340 70 280 120 250 Z" />
                            </g>
                            <g fill="#d8c49e" opacity="0.75">
                                {trees.map((t, i) => (
                                    <circle key={i} cx={t.x} cy={t.y} r={t.r} />
                                ))}
                            </g>
                            <path d={COAST} fill="none" stroke={`url(#${uid}-cliff)`} strokeWidth="16" />
                            <path d={COAST} fill="none" stroke="#b39a73" strokeWidth="2" />
                            <path d="M535 718 C 555 706 575 704 590 705" fill="none" stroke="#fbf5ea" strokeWidth="8" strokeLinecap="round" />
                            <path d="M180 600 C 200 606 215 609 230 610" fill="none" stroke="#fbf5ea" strokeWidth="8" strokeLinecap="round" />
                            <path d="M590 705 L 600 745 M620 708 L630 740" stroke="#8a7657" strokeWidth="4" strokeLinecap="round" />
                            <g fill="none" strokeLinecap="round">
                                {roads.map((d) => (
                                    <path key={`${d}-e`} d={d} stroke="#dac6a2" strokeWidth="9" />
                                ))}
                                {roads.map((d) => (
                                    <path key={d} d={d} stroke="#fbf6ec" strokeWidth="5" />
                                ))}
                            </g>
                            <g fill="#7ea3a8" fontSize="14" fontStyle="italic" fontFamily="ui-serif, Georgia, serif">
                                {soundings.map((s) => (
                                    <text key={`${s.x}-${s.y}`} x={s.x} y={s.y} textAnchor="middle">
                                        {s.t}
                                    </text>
                                ))}
                            </g>
                            <g transform="translate(470 790)">
                                <circle r="16" fill="#0b3954" opacity="0.08" />
                                <path d="M-5 8 L-3 -10 L3 -10 L5 8 Z" fill="#0b3954" />
                                <rect x="-4" y="-15" width="8" height="5" fill="#d98e5f" />
                            </g>
                            <g fill="#0b3954" fontFamily="ui-serif, Georgia, serif" textAnchor="middle">
                                <text x="860" y="455" fontSize="17" letterSpacing="5" opacity="0.7">LAGOS</text>
                                <text x="210" y="500" fontSize="14" letterSpacing="4" opacity="0.6">PRAIA DA LUZ</text>
                                <text x="470" y="835" fontSize="14" fontStyle="italic" opacity="0.75">Ponta da Piedade</text>
                                <text x="600" y="930" fontSize="24" fontStyle="italic" letterSpacing="8" opacity="0.45">Oceano Atlântico</text>
                                <text x="260" y="270" fontSize="11" letterSpacing="3" opacity="0.5">N125</text>
                            </g>
                            <g transform="translate(900 300)" opacity="0.8">
                                <circle r="46" fill="none" stroke="#0b3954" strokeOpacity="0.3" />
                                <circle r="36" fill="none" stroke="#0b3954" strokeOpacity="0.2" strokeDasharray="2 4" />
                                <path d="M0 -44 L7 0 L0 44 L-7 0 Z" fill="#0b3954" />
                                <path d="M-44 0 L0 -7 L44 0 L0 7 Z" fill="#0b3954" opacity="0.45" />
                                <text y="-52" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0b3954">N</text>
                            </g>
                        </svg>

                        {villas.map((v) => {
                            const ok = matches(v)
                            const isOpen = open?.id === v.id
                            const seen = viewed.has(v.id)
                            return (
                                <div key={v.id} className={cn('absolute', isOpen ? 'z-30' : 'z-20')} style={at(v.x, v.y)}>
                                    <AnimatePresence initial={false}>
                                        {ok ? (
                                            <motion.button
                                                key="bubble"
                                                ref={(el) => {
                                                    bubbleRefs.current[v.id] = el
                                                }}
                                                type="button"
                                                aria-haspopup="dialog"
                                                aria-expanded={isOpen}
                                                aria-label={`${v.name}, ${euro(v.price)} per night${seen ? ', viewed' : ''}`}
                                                initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                                                animate={{ scale: isOpen ? 1.12 : 1, opacity: 1 }}
                                                exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { scale: 0.4, opacity: 0 }}
                                                whileHover={reduceMotion ? undefined : { scale: isOpen ? 1.12 : 1.08 }}
                                                transition={spring}
                                                className={cn(
                                                    'absolute bottom-[7px] left-0 flex min-h-8 -translate-x-1/2 origin-bottom items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-bold tabular-nums shadow-[0_8px_18px_-8px_rgba(11,57,84,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3954]',
                                                    isOpen
                                                        ? 'bg-white text-[#0b3954] ring-2 ring-[#0b3954]'
                                                        : seen
                                                          ? 'bg-[#5d7e96] text-white'
                                                          : 'bg-[#0b3954] text-white',
                                                )}
                                                onClick={() => toggleVilla(v.id)}
                                            >
                                                {v.seaView && <LuWaves className="size-3.5 opacity-80" aria-hidden="true" />}
                                                {euro(v.price)}
                                                <span
                                                    className={cn(
                                                        'absolute -bottom-[5px] left-1/2 size-2.5 -translate-x-1/2 rotate-45',
                                                        isOpen ? 'bg-white' : seen ? 'bg-[#5d7e96]' : 'bg-[#0b3954]',
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            </motion.button>
                                        ) : (
                                            <motion.span
                                                key="dot"
                                                initial={reduceMotion ? false : { scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0, transition: { duration: reduceMotion ? 0 : 0.15 } }}
                                                className="absolute left-0 top-0 block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0b3954]/35"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}

                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    key="villa-card"
                                    ref={cardRef}
                                    role="dialog"
                                    aria-labelledby={`${uid}-${open.id}-title`}
                                    initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                    style={cardPos ? { '--card-left': `${cardPos.left}px`, '--card-top': `${cardPos.top}px` } : undefined}
                                    className="absolute inset-x-3 bottom-3 z-40 flex overflow-hidden rounded-[22px] bg-[#fffaf2] text-[#0b3954] shadow-[0_28px_60px_-24px_rgba(11,57,84,0.7)] sm:right-auto sm:bottom-auto sm:left-[var(--card-left)] sm:top-[var(--card-top)] sm:block sm:w-[256px]"
                                >
                                    <div className="relative w-28 shrink-0 bg-[#e8dccb] sm:aspect-[16/9] sm:w-auto">
                                        <img src={open.image} alt={open.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                                        {open.seaView && (
                                            <span className="absolute left-3 top-3 hidden items-center gap-1 rounded-full bg-[#fffaf2]/95 px-2.5 py-1 text-[11px] font-bold text-[#0b3954] sm:inline-flex">
                                                <LuWaves className="size-3" aria-hidden="true" /> Sea view
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        ref={closeRef}
                                        type="button"
                                        aria-label={`Close ${open.name}`}
                                        className="absolute right-2 top-2 z-10 grid size-10 place-items-center rounded-full bg-[#fffaf2]/95 text-[#0b3954] shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3954]"
                                        onClick={closeCard}
                                    >
                                        <HiXMark className="size-5" aria-hidden="true" />
                                    </button>
                                    <div className="min-w-0 flex-1 p-3.5 sm:p-4">
                                        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0.5 pr-10 sm:pr-0">
                                            <h3 id={`${uid}-${open.id}-title`} className="font-serif text-lg font-normal leading-tight text-[#0b3954] sm:text-xl">
                                                {open.name}
                                            </h3>
                                            <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[#0b3954] sm:mt-1">
                                                <HiStar className="size-3.5" aria-hidden="true" />
                                                {open.rating.toFixed(2)}
                                                <span className="font-normal text-[#0b3954]/60">({open.reviews})</span>
                                            </span>
                                        </div>
                                        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#0b3954]/70">
                                            <span className="inline-flex items-center gap-1">
                                                <LuBedDouble className="size-3.5" aria-hidden="true" /> {open.beds} bedrooms
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <LuUsers className="size-3.5" aria-hidden="true" /> {open.guests} guests
                                            </span>
                                            <span className="hidden sm:inline">{open.pool ? 'Private pool' : 'Garden & hot tub'}</span>
                                        </p>
                                        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-dashed border-[#0b3954]/20 pt-2.5 sm:mt-3 sm:pt-3">
                                            <p className="text-sm">
                                                <span className="text-lg font-bold">{euro(open.price)}</span>
                                                <span className="text-[#0b3954]/65"> / night</span>
                                            </p>
                                            <a
                                                href={`#villa-${open.id}`}
                                                className="group inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#0b3954] px-3.5 text-xs font-bold text-[#f6efe6] hover:bg-[#0e4a6d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3954] sm:px-4"
                                            >
                                                View villa
                                                <HiArrowLongRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pointer-events-none absolute bottom-3 right-3 z-10 hidden flex-col gap-1.5 rounded-2xl bg-[#fffaf2]/90 px-3.5 py-3 text-[11px] font-medium text-[#0b3954] shadow-sm sm:flex">
                            <span className="flex items-center gap-2">
                                <span className="h-3 w-6 rounded-full bg-[#0b3954]" /> Available
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="h-3 w-6 rounded-full bg-[#5d7e96]" /> Viewed
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="ml-1.5 size-3 rounded-full border-2 border-white bg-[#0b3954]/35" /> Not a match
                            </span>
                        </div>
                        <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-end gap-2 font-mono text-[10px] uppercase tracking-widest text-[#0b3954]/70">
                            <span className="flex h-2 w-16">
                                <span className="w-1/2 border border-[#0b3954]/60 bg-[#0b3954]/60" />
                                <span className="w-1/2 border border-[#0b3954]/60" />
                            </span>
                            1 km
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PriceBubbleMapView

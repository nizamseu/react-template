// LinkedPinsMapView

// MapView01 · Booking & Reservations › Interactive Map View

// Description:
// A split "list + map" results view for the rental marketplace Nestaway. Under the heading
// "Stays around the castle hill" it lists eight Lisbon homes (e.g. "Tiled loft above the
// fado bars", €148 a night) beside a stylised SVG map of Chiado, Baixa, Alfama and Graça
// with numbered coral pins. List rows and pins are linked, so hovering or focusing either
// one lights up the other. Use it for search results where location matters.

// Design:
// - lg: 5/12 list column + 7/12 sticky map (640px tall); below lg a List / Map segmented
//   toggle shows one at a time, the map is 460px (sm: 560px) with a bottom preview card
// - White page, charcoal #222222 text, grey #717171 meta, coral #ff5a5f pins and accents;
//   the map is #f1f5f9 with #e3e9f0 city blocks, white streets, sage parks and a blue river
// - Rounded-2xl list rows (4:5 → sm: 4:3 photos, numbered badge that matches its pin),
//   rounded-[28px] map frame; pins are teardrops with the stay number
// - The map is drawn in a 1000×1000 viewBox with "slice" scaling; pins are HTML buttons
//   placed with container-query units so they stay glued to the art at every size
// - framer-motion springs the highlighted pin up, fades its price chip and slides the
//   mobile preview card; all motion is instant with reduced motion

// What it does:
// - hoverId (list or pin hover/focus) and selectedId (last clicked pin) drive the linked
//   highlight; clicking a pin scrolls its row into view on lg or updates the mobile card
// - view ("list" | "map") switches panes below lg; each row's pin button jumps to the map
// - saved (Set) toggles wishlist hearts; "Search as I move the map" is a controlled
//   checkbox that is visual-only; titles link to #stay-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LinkedPinsMapView from '@/TestComponent/PageSections/booking/MapView01';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <LinkedPinsMapView />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiHeart,
    HiOutlineHeart,
    HiOutlineListBullet,
    HiOutlineMap,
    HiOutlineMapPin,
    HiStar,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const NIGHTS = 4

const stays = [
    {
        id: 'alfama-tiled-loft',
        title: 'Tiled loft above the fado bars',
        area: 'Alfama',
        type: 'Entire loft',
        guests: '2 guests · 1 bedroom · 1 bath',
        rating: 4.96,
        reviews: 212,
        price: 148,
        favourite: true,
        x: 690,
        y: 600,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
        alt: 'Living room with a mustard armchair, white walls and a round side table',
    },
    {
        id: 'graca-castle-view',
        title: 'Sunlit flat with a castle view',
        area: 'Graça',
        type: 'Entire flat',
        guests: '4 guests · 2 bedrooms · 1 bath',
        rating: 4.89,
        reviews: 164,
        price: 126,
        x: 715,
        y: 300,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        alt: 'Bright living room with tall windows, a sofa and potted plants',
    },
    {
        id: 'baixa-rua-augusta',
        title: 'Pombaline apartment on Rua Augusta',
        area: 'Baixa',
        type: 'Entire apartment',
        guests: '4 guests · 2 bedrooms · 2 baths',
        rating: 4.91,
        reviews: 98,
        price: 172,
        x: 345,
        y: 560,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
        alt: 'Open-plan living room with pale sofas and big windows',
    },
    {
        id: 'mouraria-tram-studio',
        title: 'Blue-sofa studio by the tram 28 stop',
        area: 'Mouraria',
        type: 'Studio',
        guests: '2 guests · Studio · 1 bath',
        rating: 4.78,
        reviews: 57,
        price: 94,
        x: 505,
        y: 330,
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
        alt: 'White studio with a blue sofa, wooden floor and green plants',
    },
    {
        id: 'chiado-terrace',
        title: 'Chiado townhouse with a roof terrace',
        area: 'Chiado',
        type: 'Entire townhouse',
        guests: '6 guests · 3 bedrooms · 2 baths',
        rating: 4.97,
        reviews: 143,
        price: 265,
        favourite: true,
        x: 225,
        y: 455,
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
        alt: 'Modern living room with designer chairs and a floor lamp',
    },
    {
        id: 'alfama-riverside',
        title: 'Riverside two-bed near Santa Apolónia',
        area: 'Alfama',
        type: 'Entire flat',
        guests: '4 guests · 2 bedrooms · 1 bath',
        rating: 4.85,
        reviews: 76,
        price: 189,
        x: 790,
        y: 705,
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        alt: 'Living room with a navy sofa and a white dresser',
    },
    {
        id: 'graca-garden-room',
        title: 'Quiet garden room behind the miradouro',
        area: 'Graça',
        type: 'Private room',
        guests: '2 guests · 1 bed · Shared bath',
        rating: 4.82,
        reviews: 41,
        price: 82,
        x: 590,
        y: 205,
        image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
        alt: 'Bedroom with orange stools and framed art above the bed',
    },
    {
        id: 'baixa-figueira-suite',
        title: 'Classic suite off Praça da Figueira',
        area: 'Baixa',
        type: 'Entire suite',
        guests: '3 guests · 1 bedroom · 1 bath',
        rating: 4.93,
        reviews: 188,
        price: 158,
        x: 420,
        y: 440,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
        alt: 'Classic bedroom with a tufted headboard and crisp white linen',
    },
]

// Street geometry in a 1000×1000 viewBox (Lisbon-inspired, not to scale)
const minorStreets = [
    'M280 400 L280 770',
    'M320 400 L320 770',
    'M360 400 L360 770',
    'M400 400 L400 770',
    'M440 400 L440 770',
    'M268 430 L452 430',
    'M268 480 L452 480',
    'M268 530 L452 530',
    'M268 580 L452 580',
    'M268 630 L452 630',
    'M268 680 L452 680',
    'M268 730 L452 730',
    'M110 380 L270 455',
    'M130 520 L268 520',
    'M90 610 L268 600',
    'M190 290 C 210 380 225 470 250 560',
    'M60 700 C 140 670 200 690 268 680',
    'M520 560 C 560 600 600 590 640 640 S 720 700 760 730',
    'M600 520 C 640 540 660 580 720 590 S 800 620 860 640',
    'M640 470 C 680 500 700 520 760 520 S 840 560 920 560',
    'M560 520 C 580 560 560 620 600 680 S 660 740 700 765',
    'M700 470 C 690 520 720 560 700 620 S 720 700 770 760',
    'M780 520 C 800 580 830 620 880 690',
    'M560 300 L720 240 L900 255',
    'M600 170 C 640 230 660 280 700 345',
    'M720 150 L765 430',
    'M620 385 C 700 365 780 385 900 345',
    'M800 200 C 830 260 860 300 940 320',
    'M440 300 C 470 340 500 360 470 420',
    'M380 275 L560 255',
    'M420 360 L540 330',
    'M460 180 C 480 220 520 240 560 255',
    'M120 180 L300 250',
]

const majorStreets = [
    'M0 775 C 200 745 420 790 600 765 C 760 745 880 705 1000 685',
    'M450 400 C 480 340 560 320 620 330 C 690 345 705 420 660 470',
    'M320 400 C 420 380 470 300 560 250 C 640 205 760 180 1000 150',
    'M0 520 C 100 500 200 480 270 430',
    'M660 470 C 760 480 880 520 1000 525',
    'M250 0 C 280 150 300 280 320 400',
]

const labels = [
    { text: 'CHIADO', x: 150, y: 470 },
    { text: 'BAIXA', x: 360, y: 660 },
    { text: 'ALFAMA', x: 745, y: 640 },
    { text: 'GRAÇA', x: 820, y: 300 },
    { text: 'MOURARIA', x: 420, y: 232 },
    { text: 'BAIRRO ALTO', x: 120, y: 350 },
]

const U = 'max(100cqw / 1000, 100cqh / 1000)'
const at = (x, y) => ({
    left: `calc(50% + ${x - 500} * ${U})`,
    top: `calc(50% + ${y - 500} * ${U})`,
})

const euro = (n) => `€${n.toLocaleString('en-GB')}`

function PinShape({ active }) {
    return (
        <svg viewBox="0 0 32 42" className="h-[42px] w-8 drop-shadow-[0_6px_8px_rgba(34,34,34,0.28)]" aria-hidden="true">
            <path
                d="M16 1C7.7 1 1 7.6 1 15.8c0 10.6 12.3 22.4 14.2 24.2a1.2 1.2 0 0 0 1.6 0C18.7 38.2 31 26.4 31 15.8 31 7.6 24.3 1 16 1Z"
                fill={active ? '#222222' : '#ff5a5f'}
                stroke="#ffffff"
                strokeWidth="2"
            />
        </svg>
    )
}

export function LinkedPinsMapView({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [hoverId, setHoverId] = useState(null)
    const [selectedId, setSelectedId] = useState(stays[0].id)
    const [view, setView] = useState('list')
    const [saved, setSaved] = useState(() => new Set(['chiado-terrace']))
    const [searchOnMove, setSearchOnMove] = useState(true)
    const rowRefs = useRef({})

    const highlightId = hoverId ?? selectedId
    const selected = stays.find((s) => s.id === selectedId) ?? stays[0]
    const spring = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 26 }

    const toggleSaved = (id) => {
        setSaved((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const selectFromMap = (id) => {
        setSelectedId(id)
        if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
            rowRefs.current[id]?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' })
        }
    }

    const showOnMap = (id) => {
        setSelectedId(id)
        setView('map')
    }

    const hoverHandlers = (id) => ({
        onMouseEnter: () => setHoverId(id),
        onMouseLeave: () => setHoverId(null),
        onFocus: () => setHoverId(id),
        onBlur: () => setHoverId(null),
    })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white py-14 text-base font-normal text-[#222222] md:py-20', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5a5f]">
                            <span className="size-2 rounded-full bg-[#ff5a5f]" aria-hidden="true" />
                            Nestaway · Lisbon, Portugal
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#222222] sm:text-4xl lg:text-[44px]">
                            Stays around the castle hill
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-[#717171] sm:text-base">
                            Sep 18 – 22, 2026 · 2 guests · Prices include all fees before taxes. Hover a
                            home to find it on the map, or tap a pin to find the home.
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                        <p className="text-sm text-[#717171]">
                            <span className="font-semibold text-[#222222]">8</span> of 312 stays in this area
                        </p>
                        <div
                            className="inline-flex rounded-full border border-[#dddddd] bg-white p-1 lg:hidden"
                            role="group"
                            aria-label="Results view"
                        >
                            {[
                                { id: 'list', label: 'List', Icon: HiOutlineListBullet },
                                { id: 'map', label: 'Map', Icon: HiOutlineMap },
                            ].map(({ id, label, Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    aria-pressed={view === id}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]',
                                        view === id ? 'bg-[#222222] text-white' : 'text-[#222222] hover:bg-[#f7f7f7]',
                                    )}
                                    onClick={() => setView(id)}
                                >
                                    <Icon className="size-4" aria-hidden="true" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12">
                    <ul className={cn('space-y-3 lg:col-span-5 lg:block', view === 'map' && 'hidden')}>
                        {stays.map((stay, index) => {
                            const isHi = highlightId === stay.id
                            const isSaved = saved.has(stay.id)
                            return (
                                <li
                                    key={stay.id}
                                    ref={(el) => {
                                        rowRefs.current[stay.id] = el
                                    }}
                                    className="scroll-my-6"
                                    {...hoverHandlers(stay.id)}
                                >
                                    <article
                                        className={cn(
                                            'relative flex gap-3 rounded-2xl border p-2 transition-colors duration-200 sm:gap-4 sm:p-2.5',
                                            isHi
                                                ? 'border-[#ff5a5f]/60 bg-[#fff6f6] shadow-[0_10px_30px_-18px_rgba(255,90,95,0.8)]'
                                                : 'border-[#ebebeb] bg-white',
                                        )}
                                    >
                                        <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-xl bg-[#f1f5f9] sm:aspect-[4/3] sm:w-44">
                                            <img
                                                src={stay.image}
                                                alt={stay.alt}
                                                loading="lazy"
                                                className={cn(
                                                    'absolute inset-0 h-full w-full object-cover transition-transform duration-700',
                                                    isHi && 'scale-105',
                                                )}
                                            />
                                            <span
                                                className={cn(
                                                    'absolute left-2 top-2 grid size-7 place-items-center rounded-full text-xs font-bold shadow-sm transition-colors',
                                                    isHi ? 'bg-[#222222] text-white' : 'bg-white text-[#222222]',
                                                )}
                                                aria-hidden="true"
                                            >
                                                {index + 1}
                                            </span>
                                            {stay.favourite && (
                                                <span className="absolute inset-x-2 bottom-2 hidden truncate rounded-full bg-white/95 px-2 py-1 text-center text-[11px] font-semibold text-[#222222] sm:block">
                                                    Guest favourite
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col py-1 pr-10">
                                            <p className="truncate text-xs text-[#717171]">
                                                {stay.type} in {stay.area}
                                            </p>
                                            <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-[#222222] sm:text-base">
                                                <a
                                                    href={`#stay-${stay.id}`}
                                                    className="rounded-sm after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[#ff5a5f]"
                                                >
                                                    <span className="line-clamp-2">{stay.title}</span>
                                                </a>
                                            </h3>
                                            <p className="mt-1 hidden text-xs text-[#717171] sm:block">{stay.guests}</p>
                                            <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#222222]">
                                                <HiStar className="size-3.5" aria-hidden="true" />
                                                <span className="font-semibold">{stay.rating.toFixed(2)}</span>
                                                <span className="text-[#717171]">({stay.reviews})</span>
                                            </p>
                                            <p className="mt-auto pt-2 text-sm text-[#222222]">
                                                <span className="font-semibold">{euro(stay.price)}</span> night
                                                <span className="block text-xs text-[#717171] sm:ml-1 sm:inline">
                                                    {euro(stay.price * NIGHTS)} total
                                                </span>
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            aria-pressed={isSaved}
                                            aria-label={isSaved ? `Remove ${stay.title} from wishlist` : `Save ${stay.title} to wishlist`}
                                            className="absolute right-2 top-2 z-10 grid size-10 place-items-center rounded-full text-[#222222] transition-colors hover:bg-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-[#ff5a5f]"
                                            onClick={() => toggleSaved(stay.id)}
                                        >
                                            <motion.span
                                                key={isSaved ? 'on' : 'off'}
                                                initial={reduceMotion ? false : { scale: 0.6 }}
                                                animate={{ scale: 1 }}
                                                transition={spring}
                                                className="grid place-items-center"
                                            >
                                                {isSaved ? (
                                                    <HiHeart className="size-5 text-[#ff5a5f]" aria-hidden="true" />
                                                ) : (
                                                    <HiOutlineHeart className="size-5" aria-hidden="true" />
                                                )}
                                            </motion.span>
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={`Show ${stay.title} on the map`}
                                            className="absolute bottom-2 right-2 z-10 grid size-10 place-items-center rounded-full border border-[#dddddd] bg-white text-[#222222] transition-colors hover:border-[#222222] focus-visible:outline-2 focus-visible:outline-[#ff5a5f] lg:hidden"
                                            onClick={() => showOnMap(stay.id)}
                                        >
                                            <HiOutlineMapPin className="size-5" aria-hidden="true" />
                                        </button>
                                    </article>
                                </li>
                            )
                        })}
                    </ul>

                    <div className={cn('lg:col-span-7 lg:block', view === 'list' && 'hidden')}>
                        <div className="relative h-[460px] overflow-hidden rounded-[28px] border border-[#e2e8f0] bg-[#f1f5f9] [container-type:size] sm:h-[560px] lg:sticky lg:top-6 lg:h-[640px]">
                            <svg
                                viewBox="0 0 1000 1000"
                                preserveAspectRatio="xMidYMid slice"
                                className="absolute inset-0 h-full w-full"
                                aria-hidden="true"
                            >
                                <defs>
                                    <pattern
                                        id={`${uid}-park`}
                                        width="12"
                                        height="12"
                                        patternUnits="userSpaceOnUse"
                                        patternTransform="rotate(35)"
                                    >
                                        <rect width="12" height="12" fill="#d9ecdc" />
                                        <line x1="0" y1="0" x2="0" y2="12" stroke="#cbe3cf" strokeWidth="4" />
                                    </pattern>
                                    <linearGradient id={`${uid}-river`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0" stopColor="#d3e5f5" />
                                        <stop offset="1" stopColor="#b9d3ec" />
                                    </linearGradient>
                                </defs>
                                <rect width="1000" height="1000" fill="#f1f5f9" />
                                <rect width="1000" height="800" fill="#e3e9f0" />
                                <path
                                    d="M470 385 C 520 355 612 368 642 420 C 662 470 622 522 560 522 C 498 522 452 470 470 385 Z"
                                    fill={`url(#${uid}-park)`}
                                />
                                <path d="M40 200 C 90 170 170 190 170 250 C 170 300 100 320 60 300 C 30 280 20 230 40 200 Z" fill={`url(#${uid}-park)`} />
                                <path d="M840 360 C 880 350 930 370 930 410 C 928 450 880 460 850 440 C 826 424 818 372 840 360 Z" fill={`url(#${uid}-park)`} />
                                <rect x="300" y="735" width="120" height="30" rx="4" fill="#f8fafc" stroke="#d5dde7" />
                                <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round">
                                    {minorStreets.map((d) => (
                                        <path key={d} d={d} strokeWidth="7" />
                                    ))}
                                </g>
                                <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    {majorStreets.map((d) => (
                                        <path key={`${d}-edge`} d={d} stroke="#d5dde7" strokeWidth="19" />
                                    ))}
                                    {majorStreets.map((d) => (
                                        <path key={d} d={d} stroke="#ffffff" strokeWidth="15" />
                                    ))}
                                </g>
                                <path
                                    d="M0 800 C 180 772 380 812 560 792 C 720 774 860 732 1000 712 L1000 1000 L0 1000 Z"
                                    fill={`url(#${uid}-river)`}
                                />
                                <path
                                    d="M0 800 C 180 772 380 812 560 792 C 720 774 860 732 1000 712"
                                    fill="none"
                                    stroke="#a9c6e3"
                                    strokeWidth="2"
                                />
                                <path d="M120 900 C 300 880 560 905 900 850" fill="none" stroke="#c8dcf0" strokeWidth="2" strokeDasharray="4 10" />
                                <g className="font-sans" fill="#94a3b8" fontSize="15" fontWeight="600" letterSpacing="3">
                                    {labels.map((l) => (
                                        <text key={l.text} x={l.x} y={l.y} textAnchor="middle">
                                            {l.text}
                                        </text>
                                    ))}
                                </g>
                                <text x="556" y="452" textAnchor="middle" fill="#5f8f68" fontSize="13" fontStyle="italic">
                                    Castelo de S. Jorge
                                </text>
                                <text x="360" y="754" textAnchor="middle" fill="#94a3b8" fontSize="11">
                                    Praça do Comércio
                                </text>
                                <text x="520" y="905" textAnchor="middle" fill="#6b93bd" fontSize="22" fontStyle="italic" letterSpacing="6">
                                    Rio Tejo
                                </text>
                            </svg>

                            <label className="absolute left-3 top-3 z-30 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-[#222222] shadow-[0_6px_18px_-8px_rgba(34,34,34,0.4)]">
                                <input
                                    type="checkbox"
                                    checked={searchOnMove}
                                    className="size-4 rounded accent-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]"
                                    onChange={(e) => setSearchOnMove(e.target.checked)}
                                />
                                Search as I move the map
                            </label>

                            <div className="pointer-events-none absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full bg-white/90 text-[10px] font-bold text-[#222222] shadow-sm" aria-hidden="true">
                                <span className="absolute top-1 text-[#ff5a5f]">N</span>
                                <span className="h-4 w-px bg-[#222222]" />
                            </div>

                            <div className="pointer-events-none absolute bottom-3 left-3 z-20 hidden items-end gap-2 text-[11px] font-medium text-[#64748b] lg:flex" aria-hidden="true">
                                <span className="h-2 w-16 border-x-2 border-b-2 border-[#64748b]" />
                                200 m
                            </div>

                            {stays.map((stay, index) => {
                                const isHi = highlightId === stay.id
                                return (
                                    <button
                                        key={stay.id}
                                        type="button"
                                        style={at(stay.x, stay.y)}
                                        aria-pressed={selectedId === stay.id}
                                        aria-label={`${index + 1}. ${stay.title}, ${euro(stay.price)} per night`}
                                        onClick={() => selectFromMap(stay.id)}
                                        {...hoverHandlers(stay.id)}
                                        className={cn(
                                            'absolute -translate-x-1/2 -translate-y-full rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222222]',
                                            isHi ? 'z-20' : 'z-10',
                                        )}
                                    >
                                        <motion.span
                                            initial={false}
                                            animate={{ scale: isHi ? 1.2 : 1, y: isHi ? -4 : 0 }}
                                            transition={spring}
                                            className="relative block origin-bottom"
                                        >
                                            <PinShape active={isHi} />
                                            <span className="absolute inset-x-0 top-[8px] text-center text-[12px] font-bold leading-none text-white">
                                                {index + 1}
                                            </span>
                                        </motion.span>
                                        <AnimatePresence>
                                            {isHi && (
                                                <motion.span
                                                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 6 }}
                                                    transition={{ duration: 0.18 }}
                                                    className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#222222] shadow-[0_8px_20px_-8px_rgba(34,34,34,0.45)]"
                                                >
                                                    {euro(stay.price)}
                                                    <span className="ml-1 font-normal text-[#717171]">
                                                        · ★ {stay.rating.toFixed(2)}
                                                    </span>
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                )
                            })}

                            <AnimatePresence mode="wait" initial={false}>
                                <motion.a
                                    key={selected.id}
                                    href={`#stay-${selected.id}`}
                                    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 24 }}
                                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-x-3 bottom-3 z-30 flex gap-3 rounded-2xl bg-white p-2 shadow-[0_16px_40px_-16px_rgba(34,34,34,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f] lg:hidden"
                                >
                                    <img
                                        src={selected.image}
                                        alt=""
                                        loading="lazy"
                                        className="aspect-square w-20 shrink-0 rounded-xl object-cover sm:w-24"
                                    />
                                    <span className="flex min-w-0 flex-col justify-center">
                                        <span className="truncate text-xs text-[#717171]">
                                            {selected.type} in {selected.area}
                                        </span>
                                        <span className="truncate text-sm font-semibold text-[#222222]">{selected.title}</span>
                                        <span className="mt-1 text-sm text-[#222222]">
                                            <span className="font-semibold">{euro(selected.price)}</span> night ·{' '}
                                            <span className="inline-flex items-center gap-0.5 text-xs">
                                                <HiStar className="size-3" aria-hidden="true" />
                                                {selected.rating.toFixed(2)}
                                            </span>
                                        </span>
                                    </span>
                                </motion.a>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <p className="sr-only" aria-live="polite">
                    {selected ? `${selected.title} selected on the map` : ''}
                </p>
            </div>
        </section>
    )
}

export default LinkedPinsMapView

// NearbyLayersMapView

// MapView02 · Booking & Reservations › Interactive Map View

// Description:
// A neighbourhood explorer for a hotel page on the travel site Wayfare. Under "What's
// around Hotel Marisol" a stylised El Born map shows the hotel with 5 / 10 / 15-minute
// walking rings and 18 nearby places in four layers (Restaurants, Transit, Parks, Sights).
// Guests switch layers on and off, pick a walking radius and open any place for its walk
// time. Use it on hotel detail pages below the photo gallery or the room list.

// Design:
// - Header + toolbar (four layer toggles in a 2×2 → sm: 4-up grid, radius segmented
//   control), then lg: 8/12 map (480 → sm: 560 → lg: 620px tall) + 4/12 place list
// - Ocean blue #0369a1 brand, slate #0f172a text; map land #e3eee5, parks #b9dfc1, sea
//   #b7dbef, white streets and an Eixample block grid; layer colours coral #e4572e,
//   blue #0369a1, green #15803d and violet #7c3aed
// - Rounded-[26px] map frame, round 36px category markers with white icons, a 52px hotel
//   badge with a pulsing halo; list rows are rounded-xl with a colour chip and minutes
// - The map is a 1000×1000 SVG in "slice" mode; markers are HTML buttons placed with
//   container-query units so they stay locked to the art from 360px to 1440px+
// - framer-motion pops markers in and out, draws the hotel-to-place line and fades the
//   popover; the halo pulse and draw animations are skipped for reduced motion

// What it does:
// - layers (Set) toggles each category's markers and list rows; radius (5 | 10 | 15)
//   highlights its ring, dims markers beyond it and filters the list
// - selectedId opens a popover on the map (walk time, distance, note) and highlights
//   the list row; Escape or the close button clears it and returns focus to the marker,
//   and clicking the map background also closes it
// - Walk times are derived from each marker's distance to the hotel (80 m per minute);
//   "Directions" links point to #directions-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NearbyLayersMapView from '@/TestComponent/PageSections/booking/MapView02';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <NearbyLayersMapView />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuBedDouble, LuFootprints, LuLandmark, LuTrainFront, LuTrees, LuUtensils, LuX } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const HOTEL = { x: 500, y: 500 }
const UNITS_PER_MIN = 24

const layers = [
    { id: 'food', label: 'Restaurants', Icon: LuUtensils, color: '#e4572e', soft: '#fde7df' },
    { id: 'transit', label: 'Transit', Icon: LuTrainFront, color: '#0369a1', soft: '#dbeefa' },
    { id: 'parks', label: 'Parks', Icon: LuTrees, color: '#15803d', soft: '#dcf2e3' },
    { id: 'sights', label: 'Sights', Icon: LuLandmark, color: '#7c3aed', soft: '#ede5fd' },
]

const rawPlaces = [
    { id: 'taverna-born', cat: 'food', name: 'Taverna del Born', note: 'Tapas & vermouth · €€ · open till 00:30', x: 405, y: 445 },
    { id: 'sal-i-fum', cat: 'food', name: 'Sal i Fum', note: 'Charcoal seafood grill · €€€', x: 600, y: 610 },
    { id: 'cafe-ribera', cat: 'food', name: 'Cafè Ribera', note: 'Breakfast & flat whites from 07:30', x: 575, y: 420 },
    { id: 'la-pescadora', cat: 'food', name: 'La Pescadora', note: 'Paella for two · book ahead', x: 300, y: 640 },
    { id: 'vermut-club', cat: 'food', name: 'Vermut Club', note: 'Terrace bar · live jazz on Thursdays', x: 690, y: 480 },
    { id: 'forn-petit', cat: 'food', name: 'Forn Petit', note: 'Bakery · ensaïmadas out at 08:00', x: 420, y: 300 },
    { id: 'jaume-i', cat: 'transit', name: 'Jaume I', note: 'Metro L4 · trains every 4 min', x: 330, y: 420 },
    { id: 'barceloneta', cat: 'transit', name: 'Barceloneta', note: 'Metro L4 · beach and marina', x: 470, y: 760 },
    { id: 'arc-triomf', cat: 'transit', name: 'Arc de Triomf', note: 'Metro L1 · Rodalies to the airport', x: 640, y: 250 },
    { id: 'estacio-franca', cat: 'transit', name: 'Estació de França', note: 'Regional rail · 1929 iron hall', x: 720, y: 640 },
    { id: 'ciutadella', cat: 'parks', name: 'Parc de la Ciutadella', note: 'Boating lake · open 10:00–22:30', x: 780, y: 390 },
    { id: 'jardins-ribera', cat: 'parks', name: 'Jardins de la Ribera', note: 'Shady benches and a playground', x: 560, y: 700 },
    { id: 'sant-sebastia', cat: 'parks', name: 'Platja de Sant Sebastià', note: 'Beach · lifeguards May–Sep', x: 260, y: 800 },
    { id: 'santa-maria', cat: 'sights', name: 'Santa Maria del Mar', note: 'Gothic basilica · rooftop tours €10', x: 440, y: 592 },
    { id: 'museu-picasso', cat: 'sights', name: 'Museu Picasso', note: 'Free on Thursdays from 17:00', x: 500, y: 360 },
    { id: 'santa-caterina', cat: 'sights', name: 'Mercat de Santa Caterina', note: 'Wave-roof market · closed Sundays', x: 330, y: 300 },
    { id: 'palau-musica', cat: 'sights', name: 'Palau de la Música', note: 'Modernista concert hall · tours hourly', x: 230, y: 230 },
    { id: 'tres-dragons', cat: 'sights', name: 'Castell dels Tres Dragons', note: '1888 café-restaurant turned museum', x: 800, y: 270 },
]

const places = rawPlaces.map((p) => {
    const minutes = Math.max(1, Math.round(Math.hypot(p.x - HOTEL.x, p.y - HOTEL.y) / UNITS_PER_MIN))
    return { ...p, minutes, meters: minutes * 80 }
})

const layerById = Object.fromEntries(layers.map((l) => [l.id, l]))
const radii = [5, 10, 15]

const minorStreets = [
    'M360 330 C 390 380 400 430 420 500 S 450 600 440 700',
    'M420 380 C 470 400 520 390 560 430 S 640 460 700 440',
    'M300 520 C 360 510 420 530 480 520 S 600 540 660 560',
    'M540 300 C 540 360 530 430 560 480 S 600 560 590 640',
    'M460 420 C 480 460 470 520 510 560 S 560 640 540 700',
    'M380 600 C 420 590 460 620 520 640 S 620 660 700 700',
    'M600 380 C 640 420 650 500 700 560',
    'M260 470 C 300 450 330 470 370 450',
    'M250 560 C 290 600 330 610 360 660',
    'M640 320 C 660 360 700 380 740 380',
    'M300 360 C 360 360 420 340 480 330',
    'M0 420 C 80 430 160 420 250 440',
    'M0 600 C 90 590 170 610 260 580',
    'M60 700 C 120 660 200 680 280 700',
    'M150 250 C 170 330 180 420 170 520 S 190 640 180 760',
    'M760 200 C 800 160 880 150 1000 170',
    'M860 560 C 880 620 900 660 960 700',
    'M760 560 C 790 600 800 660 780 720',
    'M680 120 C 720 160 780 180 860 200',
    'M430 120 C 450 180 470 230 470 280',
    'M20 280 L300 270',
    'M880 0 C 860 80 870 160 900 300',
]

const majorStreets = [
    'M300 0 C 320 160 330 300 350 420 C 365 520 330 640 300 780',
    'M0 760 C 200 770 380 780 520 760 C 680 735 820 690 1000 640',
    'M560 0 C 590 120 620 230 680 300 C 760 390 880 520 1000 560',
    'M0 330 C 160 340 300 310 450 300 C 560 290 640 250 720 200',
]

const eixample = Array.from({ length: 12 }, (_, i) => ({ col: i % 4, row: Math.floor(i / 4) }))

const U = 'max(100cqw / 1000, 100cqh / 1000)'
const at = (x, y) => ({
    left: `calc(50% + ${x - 500} * ${U})`,
    top: `calc(50% + ${y - 500} * ${U})`,
})

export function NearbyLayersMapView({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [visible, setVisible] = useState(() => new Set(layers.map((l) => l.id)))
    const [radius, setRadius] = useState(10)
    const [selectedId, setSelectedId] = useState(null)
    const markerRefs = useRef({})

    const shown = places.filter((p) => visible.has(p.cat))
    const listed = shown.filter((p) => p.minutes <= radius).sort((a, b) => a.minutes - b.minutes)
    const active = shown.find((p) => p.id === selectedId) ?? null

    useEffect(() => {
        if (!active) return undefined
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setSelectedId(null)
                markerRefs.current[active.id]?.focus()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [active])

    const toggleLayer = (id) => {
        setVisible((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const closePopover = () => {
        const id = active?.id
        setSelectedId(null)
        if (id) markerRefs.current[id]?.focus()
    }

    const popoverSide = (p) => ({
        vertical: p.y < 450 ? 'top-full mt-7' : 'bottom-full mb-7',
        horizontal: p.x > 620 ? 'right-[-12px]' : p.x < 380 ? 'left-[-12px]' : 'left-1/2 -translate-x-1/2',
    })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#f7faf8] py-14 text-base font-normal text-[#0f172a] md:py-20', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0369a1]">
                            Wayfare · Neighbourhood guide
                        </p>
                        <h2 className="mt-3 text-3xl font-bold leading-[1.08] tracking-tight text-[#0f172a] sm:text-4xl lg:text-5xl">
                            What’s around Hotel Marisol
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
                            Carrer de l’Argenteria 37, El Born · Barcelona. Switch layers on and off, pick
                            how far you’re happy to walk and tap any place for directions.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 self-start rounded-2xl border border-[#d5e6dc] bg-white px-4 py-3 lg:self-auto">
                        <span className="grid size-12 place-items-center rounded-xl bg-[#0369a1] text-lg font-bold text-white">
                            9.6
                        </span>
                        <span className="text-sm leading-snug">
                            <span className="block font-semibold text-[#0f172a]">Exceptional location</span>
                            <span className="text-[#475569]">from 2,418 guest reviews</span>
                        </span>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-wrap" role="group" aria-label="Map layers">
                        {layers.map(({ id, label, Icon, color, soft }) => {
                            const on = visible.has(id)
                            const count = places.filter((p) => p.cat === id).length
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    aria-pressed={on}
                                    className={cn(
                                        'group inline-flex min-h-11 items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]',
                                        on
                                            ? 'border-transparent bg-white text-[#0f172a] shadow-[0_6px_18px_-10px_rgba(15,23,42,0.45)]'
                                            : 'border-[#cbd5e1] bg-transparent text-[#64748b] hover:border-[#94a3b8]',
                                    )}
                                    onClick={() => toggleLayer(id)}
                                >
                                    <span
                                        className="grid size-8 shrink-0 place-items-center rounded-full transition-colors"
                                        style={{ backgroundColor: on ? color : soft, color: on ? '#ffffff' : color }}
                                    >
                                        <Icon className="size-4" aria-hidden="true" />
                                    </span>
                                    <span className={cn('truncate', !on && 'line-through decoration-[#94a3b8]')}>{label}</span>
                                    <span className="ml-auto hidden text-xs font-medium text-[#94a3b8] sm:inline">{count}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#334155]">
                            <LuFootprints className="size-4 text-[#0369a1]" aria-hidden="true" />
                            Walk
                        </span>
                        <div className="inline-flex rounded-full bg-[#e2ece6] p-1" role="group" aria-label="Walking radius">
                            {radii.map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    aria-pressed={radius === r}
                                    className="relative min-h-10 rounded-full px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                                    onClick={() => setRadius(r)}
                                >
                                    {radius === r && (
                                        <motion.span
                                            layoutId={`${uid}-radius`}
                                            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 36 }}
                                            className="absolute inset-0 rounded-full bg-[#0369a1]"
                                        />
                                    )}
                                    <span className={cn('relative', radius === r ? 'text-white' : 'text-[#334155]')}>
                                        {r} min
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                    <div
                        className="relative h-[480px] overflow-hidden rounded-[26px] border border-[#cfe0d5] bg-[#e3eee5] [container-type:size] sm:h-[560px] lg:col-span-8 lg:h-[620px]"
                        onClick={(e) => {
                            if (e.target === e.currentTarget || e.target.closest?.('svg[data-map-art]')) {
                                setSelectedId(null)
                            }
                        }}
                    >
                        <svg
                            data-map-art=""
                            viewBox="0 0 1000 1000"
                            preserveAspectRatio="xMidYMid slice"
                            className="absolute inset-0 h-full w-full"
                            aria-hidden="true"
                        >
                            <defs>
                                <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
                                    <stop offset="0" stopColor="#0369a1" stopOpacity="0.16" />
                                    <stop offset="1" stopColor="#0369a1" stopOpacity="0.03" />
                                </radialGradient>
                                <pattern id={`${uid}-waves`} width="46" height="18" patternUnits="userSpaceOnUse">
                                    <rect width="46" height="18" fill="#b7dbef" />
                                    <path d="M0 10 Q 11.5 4 23 10 T 46 10" fill="none" stroke="#a2cfe8" strokeWidth="2" />
                                </pattern>
                            </defs>
                            <rect width="1000" height="1000" fill="#e3eee5" />
                            {eixample.map(({ col, row }) => {
                                const x = 20 + col * 62
                                const y = 20 + row * 62
                                return (
                                    <path
                                        key={`${col}-${row}`}
                                        d={`M${x + 10} ${y} H${x + 40} L${x + 50} ${y + 10} V${y + 40} L${x + 40} ${y + 50} H${x + 10} L${x} ${y + 40} V${y + 10} Z`}
                                        fill="#d6e5da"
                                    />
                                )
                            })}
                            <path d="M700 320 C 760 296 860 290 910 312 C 940 380 936 450 912 500 C 850 518 760 516 720 500 C 700 440 690 370 700 320 Z" fill="#b9dfc1" stroke="#a3d2ad" strokeWidth="3" />
                            <path d="M800 400 C 820 388 850 392 858 410 C 862 428 840 440 818 436 C 798 432 790 412 800 400 Z" fill="#b7dbef" />
                            <rect x="520" y="676" width="84" height="52" rx="10" fill="#b9dfc1" />
                            <g fill="none" stroke="#ffffff" strokeLinecap="round">
                                {minorStreets.map((d) => (
                                    <path key={d} d={d} strokeWidth="8" />
                                ))}
                            </g>
                            <g fill="none" strokeLinecap="round">
                                {majorStreets.map((d) => (
                                    <path key={`${d}-e`} d={d} stroke="#cfe0d5" strokeWidth="20" />
                                ))}
                                {majorStreets.map((d) => (
                                    <path key={d} d={d} stroke="#ffffff" strokeWidth="15" />
                                ))}
                            </g>
                            <path d="M0 850 C 240 842 420 826 600 800 C 760 776 880 742 1000 700 L1000 1000 L0 1000 Z" fill="#efe7cf" />
                            <path d="M0 872 C 240 866 420 850 600 824 C 760 800 880 768 1000 728 L1000 1000 L0 1000 Z" fill={`url(#${uid}-waves)`} />
                            <path d="M660 815 L700 900 M720 800 L770 880 M780 782 L830 860" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
                            <g fill="#64748b" fontSize="14" fontWeight="700" letterSpacing="4" textAnchor="middle">
                                <text x="120" y="190">EIXAMPLE</text>
                                <text x="380" y="250">SANT PERE</text>
                                <text x="640" y="560">EL BORN</text>
                                <text x="360" y="720">LA RIBERA</text>
                            </g>
                            <text x="820" y="340" textAnchor="middle" fill="#3f7f50" fontSize="13" fontStyle="italic">
                                Ciutadella
                            </text>
                            <text x="440" y="930" textAnchor="middle" fill="#4b8bb5" fontSize="20" fontStyle="italic" letterSpacing="5">
                                Mar Mediterrània
                            </text>

                            {radii.map((r) => {
                                const on = r === radius
                                const rr = r * UNITS_PER_MIN
                                return (
                                    <g key={r}>
                                        {on && <circle cx={HOTEL.x} cy={HOTEL.y} r={rr} fill={`url(#${uid}-glow)`} />}
                                        <circle
                                            cx={HOTEL.x}
                                            cy={HOTEL.y}
                                            r={rr}
                                            fill="none"
                                            stroke="#0369a1"
                                            strokeOpacity={on ? 0.9 : 0.35}
                                            strokeWidth={on ? 3 : 2}
                                            strokeDasharray={on ? '0' : '6 8'}
                                        />
                                        <rect
                                            x={HOTEL.x - 30}
                                            y={HOTEL.y - rr - 13}
                                            width="60"
                                            height="26"
                                            rx="13"
                                            fill={on ? '#0369a1' : '#ffffff'}
                                            stroke="#0369a1"
                                            strokeOpacity="0.4"
                                        />
                                        <text
                                            x={HOTEL.x}
                                            y={HOTEL.y - rr + 5}
                                            textAnchor="middle"
                                            fontSize="13"
                                            fontWeight="700"
                                            fill={on ? '#ffffff' : '#0369a1'}
                                        >
                                            {r} min
                                        </text>
                                    </g>
                                )
                            })}

                            {active && (
                                <motion.path
                                    key={active.id}
                                    d={`M${HOTEL.x} ${HOTEL.y} L${active.x} ${active.y}`}
                                    stroke={layerById[active.cat].color}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    fill="none"
                                    initial={reduceMotion ? false : { pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                />
                            )}
                        </svg>

                        <div
                            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                            style={at(HOTEL.x, HOTEL.y)}
                        >
                            {!reduceMotion && (
                                <motion.span
                                    className="absolute inset-0 rounded-2xl bg-[#0369a1]"
                                    animate={{ scale: [1, 1.8], opacity: [0.35, 0] }}
                                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                                    aria-hidden="true"
                                />
                            )}
                            <span className="relative grid size-[52px] place-items-center rounded-2xl border-[3px] border-white bg-[#0369a1] text-white shadow-[0_10px_24px_-10px_rgba(3,105,161,0.9)]">
                                <LuBedDouble className="size-6" aria-hidden="true" />
                                <span className="sr-only">Hotel Marisol</span>
                            </span>
                        </div>

                        <AnimatePresence initial={false}>
                            {shown.map((p) => {
                                const layer = layerById[p.cat]
                                const Icon = layer.Icon
                                const isActive = active?.id === p.id
                                const outside = p.minutes > radius
                                const side = popoverSide(p)
                                return (
                                    <motion.div
                                        key={p.id}
                                        className={cn('absolute', isActive ? 'z-30' : 'z-20')}
                                        style={at(p.x, p.y)}
                                        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: outside && !isActive ? 0.4 : 1 }}
                                        exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { scale: 0, opacity: 0 }}
                                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 24 }}
                                    >
                                        <button
                                            ref={(el) => {
                                                markerRefs.current[p.id] = el
                                            }}
                                            type="button"
                                            aria-expanded={isActive}
                                            aria-label={`${p.name}, ${layer.label}, ${p.minutes} minute walk`}
                                            className={cn(
                                                'absolute left-0 top-0 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-white shadow-[0_6px_14px_-6px_rgba(15,23,42,0.6)] transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f172a]',
                                                isActive && 'scale-125 ring-4 ring-white/70',
                                            )}
                                            style={{ backgroundColor: layer.color }}
                                            onClick={() => setSelectedId(isActive ? null : p.id)}
                                        >
                                            <Icon className="size-4" aria-hidden="true" />
                                        </button>

                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    role="dialog"
                                                    aria-label={`${p.name} details`}
                                                    initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.94 }}
                                                    transition={{ duration: 0.18 }}
                                                    className={cn(
                                                        'absolute w-[220px] rounded-2xl bg-white p-4 text-left shadow-[0_18px_40px_-16px_rgba(15,23,42,0.55)]',
                                                        side.vertical,
                                                        side.horizontal,
                                                    )}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: layer.color }}>
                                                                {layer.label}
                                                            </p>
                                                            <p className="mt-1 text-[15px] font-bold leading-snug text-[#0f172a]">{p.name}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            aria-label="Close place details"
                                                            className="-mr-2 -mt-2 grid size-10 shrink-0 place-items-center rounded-full text-[#64748b] hover:bg-[#f1f5f9] focus-visible:outline-2 focus-visible:outline-[#0369a1]"
                                                            onClick={closePopover}
                                                        >
                                                            <LuX className="size-4" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 text-xs leading-relaxed text-[#475569]">{p.note}</p>
                                                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#e2e8f0] pt-3">
                                                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f172a]">
                                                            <LuFootprints className="size-4 text-[#0369a1]" aria-hidden="true" />
                                                            {p.minutes} min · {p.meters} m
                                                        </span>
                                                        <a
                                                            href={`#directions-${p.id}`}
                                                            className="inline-flex min-h-10 items-center rounded-full px-2 text-xs font-bold text-[#0369a1] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#0369a1]"
                                                        >
                                                            Directions
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>

                        <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden rounded-xl bg-white/90 px-3 py-2 text-[11px] font-medium text-[#334155] shadow-sm sm:block">
                            <span className="flex items-center gap-2">
                                <span className="h-0 w-6 border-t-2 border-[#0369a1]" /> {radius}-min walk ·{' '}
                                {radius * 80 >= 1000 ? `${(radius * 0.08).toFixed(1)} km` : `${radius * 80} m`}
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="flex items-baseline justify-between gap-3">
                            <h3 className="text-lg font-bold text-[#0f172a]">Within a {radius}-min walk</h3>
                            <p className="text-sm text-[#64748b]" aria-live="polite">
                                {listed.length} {listed.length === 1 ? 'place' : 'places'}
                            </p>
                        </div>
                        <ul className="mt-4 space-y-2 lg:max-h-[572px] lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin]">
                            {listed.length === 0 && (
                                <li className="rounded-xl border border-dashed border-[#cbd5e1] p-5 text-sm text-[#64748b]">
                                    No places match. Turn a layer back on or widen the walking radius.
                                </li>
                            )}
                            {listed.map((p) => {
                                const layer = layerById[p.cat]
                                const Icon = layer.Icon
                                const isActive = active?.id === p.id
                                return (
                                    <li key={p.id}>
                                        <button
                                            type="button"
                                            aria-pressed={isActive}
                                            className={cn(
                                                'flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]',
                                                isActive
                                                    ? 'border-[#0369a1] bg-white shadow-[0_8px_20px_-14px_rgba(3,105,161,0.9)]'
                                                    : 'border-transparent bg-white/70 hover:bg-white',
                                            )}
                                            onClick={() => setSelectedId(isActive ? null : p.id)}
                                        >
                                            <span
                                                className="grid size-9 shrink-0 place-items-center rounded-lg"
                                                style={{ backgroundColor: layer.soft, color: layer.color }}
                                            >
                                                <Icon className="size-4" aria-hidden="true" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-semibold text-[#0f172a]">{p.name}</span>
                                                <span className="block truncate text-xs text-[#64748b]">{p.note}</span>
                                            </span>
                                            <span className="shrink-0 text-right">
                                                <span className="block text-sm font-bold tabular-nums text-[#0f172a]">{p.minutes} min</span>
                                                <span className="block text-[11px] tabular-nums text-[#94a3b8]">{p.meters} m</span>
                                            </span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NearbyLayersMapView

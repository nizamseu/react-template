// FloorplanHotspotAmenityChecklist

// AmenityChecklist05 · Booking & Reservations › Amenity & Service Checklist

// Description:
// An architectural floor plan of "The Larkspur", a two-bedroom lakeside cabin from
// Hearthside Cabins. Numbered hotspots sit on each of seven spaces (Great room, Kitchen &
// dining, Primary bedroom, Mudroom, Bathroom, Bunk room, Screened porch & deck); choosing
// one lights the room up on the plan and lists what's in it, e.g. "Cedar hot tub for
// four". Use it on cabin, villa or apartment pages to show amenities room by room.

// Design:
// - lg: 7/12 plan card + 5/12 room panel, stacked below lg; room chips wrap above the
//   checklist; prev / next buttons at the bottom of the panel
// - Pine #1f3b2c page with cream #f5efe4 type; the plan is a cream paper card with a
//   20-unit #e8dfcd grid, pine walls, door swings, windows, furniture outlines and a
//   decked porch; selected room tinted honey #ecd3a1, hotspots ember #d9822b
// - The plan is an 820×560 SVG in a matching aspect-ratio box, so HTML hotspots placed by
//   percentage always sit on their room; dimension lines and a north arrow frame it
// - framer-motion pulses the active hotspot, slides the chip highlight and fades the
//   checklist rows in; pulses and fades are off for reduced motion
// - Hotspots are 36px buttons; rooms can also be clicked directly with a mouse

// What it does:
// - selectedId (hotspots, chips with arrow keys / Home / End, room areas, prev / next)
//   picks the room; hoverId previews a room while a hotspot is hovered or focused
// - The panel lists the room's size, dimensions and amenities; the header sums the cabin
//   (sleeps 7, 138 m²); "Check availability" links to #book-the-larkspur
// - Everything is client-side state; the plan artwork itself is decorative (aria-hidden)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FloorplanHotspotAmenityChecklist from '@/TestComponent/PageSections/booking/AmenityChecklist05';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <FloorplanHotspotAmenityChecklist />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuArrowLeft, LuArrowRight, LuCheck, LuRuler } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const W = 820
const H = 560

const rooms = [
    {
        id: 'great-room',
        name: 'Great room',
        area: '38 m²',
        dims: '7.2 × 5.2 m',
        rect: [40, 40, 360, 260],
        spot: [215, 150],
        items: [
            'Cast-iron wood stove, logs stacked daily',
            'Deep sectional sofa that sleeps one',
            'Record player and 40 vinyl LPs',
            'Board games, puzzles and a chess set',
            'Floor-to-ceiling window onto Loon Lake',
        ],
    },
    {
        id: 'kitchen',
        name: 'Kitchen & dining',
        area: '22 m²',
        dims: '4.4 × 5.2 m',
        rect: [400, 40, 220, 260],
        spot: [505, 118],
        items: [
            'Four-burner gas range and oven',
            'Pour-over kit, French press and local beans',
            'Dishwasher and full-size fridge',
            'Cast-iron skillets and a Dutch oven',
            'Round oak table for six',
        ],
    },
    {
        id: 'primary',
        name: 'Primary bedroom',
        area: '19 m²',
        dims: '4.4 × 4.4 m',
        rect: [40, 300, 220, 220],
        spot: [150, 425],
        items: [
            'King bed with wool and linen layers',
            'Blackout linen curtains',
            'Reading lamps with USB-C ports',
            'Wardrobe with robes and slippers',
        ],
    },
    {
        id: 'mudroom',
        name: 'Mudroom & entry',
        area: '9 m²',
        dims: '2.0 × 4.4 m',
        rect: [260, 300, 100, 220],
        spot: [310, 440],
        items: [
            'Boot dryer and oak bench',
            'Coat hooks and golf umbrellas',
            'Headlamps for night walks',
            'Key lockbox for self check-in',
        ],
    },
    {
        id: 'bath',
        name: 'Bathroom & laundry',
        area: '11 m²',
        dims: '2.4 × 4.4 m',
        rect: [360, 300, 120, 220],
        spot: [420, 395],
        items: [
            'Walk-in rain shower',
            'Heated slate floor',
            'Organic toiletries and thick towels',
            'Washer-dryer and a drying rack',
        ],
    },
    {
        id: 'bunk',
        name: 'Bunk room',
        area: '13 m²',
        dims: '2.8 × 4.4 m',
        rect: [480, 300, 140, 220],
        spot: [550, 480],
        items: [
            'Two twin-over-twin bunks, sleeps four',
            'Night lights and blackout blinds',
            'Kids’ field guides and binoculars',
            'Hooks for wet rain gear',
        ],
    },
    {
        id: 'deck',
        name: 'Screened porch & deck',
        area: '26 m²',
        dims: '3.2 × 9.6 m',
        rect: [620, 40, 160, 480],
        spot: [700, 300],
        items: [
            'Cedar hot tub for four',
            'Screened sleeping porch with a daybed',
            'Propane grill and prep counter',
            'Fire pit with Adirondack chairs',
        ],
    },
]

const pct = ([x, y]) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` })

export function FloorplanHotspotAmenityChecklist({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [selectedId, setSelectedId] = useState('great-room')
    const [hoverId, setHoverId] = useState(null)
    const chipRefs = useRef([])

    const index = rooms.findIndex((r) => r.id === selectedId)
    const room = rooms[index] ?? rooms[0]
    const litId = hoverId ?? selectedId

    const step = (delta) => setSelectedId(rooms[(index + delta + rooms.length) % rooms.length].id)

    const onChipKey = (e, i) => {
        const last = rooms.length - 1
        let next = null
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1
        if (e.key === 'Home') next = 0
        if (e.key === 'End') next = last
        if (next === null) return
        e.preventDefault()
        setSelectedId(rooms[next].id)
        chipRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#1f3b2c] py-16 text-base font-normal text-[#f5efe4] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#d9b98a]">
                            Hearthside Cabins · Cabin 04
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#f5efe4] sm:text-5xl lg:text-6xl">
                            Walk through The Larkspur
                        </h2>
                        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#f5efe4]/70">
                            A 1962 lakeside cabin, rebuilt by hand in 2024. Tap a number on the plan to see
                            what’s waiting in every room.
                        </p>
                    </div>
                    <ul className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-wider text-[#f5efe4]/80">
                        {['Sleeps 7', '2 bedrooms + bunks', '1 bath', '138 m²'].map((fact) => (
                            <li key={fact} className="rounded-full border border-[#f5efe4]/25 px-3 py-1.5">
                                {fact}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-7">
                        <div className="rounded-[28px] bg-[#f5efe4] p-3 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-5">
                            <div className="relative aspect-[41/28]">
                                <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
                                    <defs>
                                        <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M20 0 H0 V20" fill="none" stroke="#e8dfcd" strokeWidth="1" />
                                        </pattern>
                                        <pattern id={`${uid}-deck`} width="160" height="14" patternUnits="userSpaceOnUse">
                                            <rect width="160" height="14" fill="#efe3cc" />
                                            <line x1="0" y1="13" x2="160" y2="13" stroke="#dccaa6" strokeWidth="1.5" />
                                        </pattern>
                                    </defs>
                                    <rect width={W} height={H} fill={`url(#${uid}-grid)`} />
                                    <rect x="620" y="40" width="160" height="480" fill={`url(#${uid}-deck)`} />

                                    {rooms.map((r) => {
                                        const on = r.id === litId
                                        const sel = r.id === selectedId
                                        const [x, y, w, h] = r.rect
                                        return (
                                            <rect
                                                key={r.id}
                                                x={x}
                                                y={y}
                                                width={w}
                                                height={h}
                                                className="cursor-pointer"
                                                style={{
                                                    fill: sel ? '#ecd3a1' : on ? '#f1e2c3' : r.id === 'deck' ? 'transparent' : '#fbf7ef',
                                                    fillOpacity: sel ? 0.9 : 1,
                                                    transition: 'fill 300ms ease',
                                                }}
                                                onClick={() => setSelectedId(r.id)}
                                            />
                                        )
                                    })}

                                    <g fill="none" stroke="#1f3b2c" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
                                        {/* great room furniture */}
                                        <path d="M80 170 H240 V200 H110 V260 H80 Z" strokeWidth="2" />
                                        <rect x="130" y="210" width="80" height="36" rx="4" strokeWidth="1.5" />
                                        <rect x="72" y="150" width="190" height="126" rx="10" strokeWidth="1" strokeDasharray="4 5" />
                                        <rect x="318" y="58" width="56" height="56" strokeWidth="1.5" />
                                        <circle cx="346" cy="86" r="18" strokeWidth="2.5" />
                                        <path d="M346 68 V48" strokeWidth="2" />
                                        <rect x="300" y="200" width="44" height="44" rx="10" strokeWidth="2" />
                                        {/* kitchen */}
                                        <path d="M420 58 H600 V110" strokeWidth="2" />
                                        <path d="M420 58 V76 H582 V110" strokeWidth="1.5" />
                                        <circle cx="560" cy="67" r="6" strokeWidth="1.5" />
                                        <circle cx="530" cy="67" r="6" strokeWidth="1.5" />
                                        <rect x="436" y="150" width="112" height="44" rx="4" strokeWidth="2" />
                                        {[452, 480, 508, 536].map((cx) => (
                                            <circle key={cx} cx={cx} cy="210" r="7" strokeWidth="1.5" />
                                        ))}
                                        <circle cx="548" cy="252" r="28" strokeWidth="2" />
                                        {[
                                            [548, 214],
                                            [548, 290],
                                            [510, 252],
                                            [586, 252],
                                        ].map(([cx, cy]) => (
                                            <rect key={`${cx}-${cy}`} x={cx - 7} y={cy - 7} width="14" height="14" rx="3" strokeWidth="1.5" />
                                        ))}
                                        {/* primary bedroom */}
                                        <rect x="62" y="340" width="140" height="150" rx="6" strokeWidth="2" />
                                        <rect x="72" y="348" width="54" height="26" rx="6" strokeWidth="1.5" />
                                        <rect x="138" y="348" width="54" height="26" rx="6" strokeWidth="1.5" />
                                        <path d="M62 400 H202" strokeWidth="1.5" />
                                        <rect x="210" y="344" width="30" height="30" rx="3" strokeWidth="1.5" />
                                        <rect x="62" y="498" width="120" height="14" strokeWidth="1.5" />
                                        {/* mudroom */}
                                        <rect x="266" y="360" width="22" height="110" rx="3" strokeWidth="1.5" />
                                        {[330, 348, 366].map((cy) => (
                                            <circle key={cy} cx="350" cy={cy} r="3" strokeWidth="1.5" />
                                        ))}
                                        {/* bath */}
                                        <rect x="368" y="308" width="70" height="70" strokeWidth="2" />
                                        <path d="M368 308 L438 378 M438 308 L368 378" strokeWidth="1" />
                                        <ellipse cx="462" cy="330" rx="11" ry="15" strokeWidth="1.5" />
                                        <rect x="452" y="398" width="22" height="30" rx="8" strokeWidth="1.5" />
                                        <rect x="370" y="468" width="40" height="40" rx="4" strokeWidth="1.5" />
                                        <circle cx="390" cy="488" r="12" strokeWidth="1.5" />
                                        <rect x="414" y="468" width="40" height="40" rx="4" strokeWidth="1.5" />
                                        <circle cx="434" cy="488" r="12" strokeWidth="1.5" />
                                        {/* bunk room */}
                                        <rect x="494" y="312" width="52" height="112" rx="4" strokeWidth="2" />
                                        <rect x="558" y="312" width="52" height="112" rx="4" strokeWidth="2" />
                                        <path d="M494 330 H546 M558 330 H610" strokeWidth="1.5" />
                                        <path d="M494 312 L546 424 M558 312 L610 424" strokeWidth="0.8" strokeDasharray="3 4" />
                                        {/* deck */}
                                        <path d="M620 250 H780" strokeWidth="1.5" strokeDasharray="2 5" />
                                        <rect x="640" y="70" width="120" height="62" rx="10" strokeWidth="2" />
                                        <circle cx="700" cy="420" r="46" strokeWidth="2.5" />
                                        <circle cx="700" cy="420" r="36" strokeWidth="1" />
                                        <rect x="640" y="280" width="40" height="28" rx="4" strokeWidth="1.5" />
                                        <path d="M735 300 l20 -12 l14 20 l-20 12 Z M744 330 l22 -4 l4 22 l-22 4 Z" strokeWidth="1.5" />
                                    </g>

                                    <g stroke="#1f3b2c" strokeLinecap="square" pointerEvents="none">
                                        <rect x="40" y="40" width="580" height="480" fill="none" strokeWidth="9" />
                                        <path d="M40 300 H232 M270 300 H350 M360 300 H520 M558 300 H620" strokeWidth="5" />
                                        <path d="M260 300 V330 M260 372 V520" strokeWidth="5" />
                                        <path d="M360 300 V436 M360 478 V520" strokeWidth="5" />
                                        <path d="M480 300 V520" strokeWidth="5" />
                                        <path d="M400 40 V104" strokeWidth="5" />
                                    </g>
                                    <g fill="none" stroke="#fbf7ef" strokeWidth="10" pointerEvents="none">
                                        <path d="M80 40 H200 M240 40 H370 M450 40 H560 M40 100 V230 M40 360 V460 M520 520 H600 M620 120 V210 M290 520 H335" />
                                    </g>
                                    <g fill="none" stroke="#1f3b2c" strokeWidth="1.4" pointerEvents="none">
                                        <path d="M80 36 H200 M80 44 H200 M240 36 H370 M240 44 H370 M450 36 H560 M450 44 H560 M36 100 V230 M44 100 V230 M36 360 V460 M44 360 V460 M520 516 H600 M520 524 H600" />
                                        <path d="M616 120 V210 M624 120 V210 M620 165 H616" />
                                        <path d="M232 300 A 38 38 0 0 0 270 338" strokeDasharray="3 3" />
                                        <path d="M270 300 V338" />
                                        <path d="M260 330 A 42 42 0 0 1 302 372" strokeDasharray="3 3" />
                                        <path d="M360 436 A 42 42 0 0 0 318 478" strokeDasharray="3 3" />
                                        <path d="M520 300 A 38 38 0 0 0 558 338" strokeDasharray="3 3" />
                                        <path d="M290 520 A 45 45 0 0 1 335 475" strokeDasharray="3 3" />
                                        <path d="M335 520 V475" />
                                    </g>

                                    <g fontFamily="ui-monospace, monospace" fill="#1f3b2c" pointerEvents="none">
                                        <path d="M40 18 H620 M40 12 V24 M620 12 V24" stroke="#1f3b2c" strokeWidth="1" />
                                        <rect x="300" y="10" width="60" height="16" fill="#f5efe4" />
                                        <text x="330" y="22" textAnchor="middle" fontSize="11">11.6 m</text>
                                        <path d="M18 40 V520 M12 40 H24 M12 520 H24" stroke="#1f3b2c" strokeWidth="1" />
                                        <rect x="9" y="262" width="18" height="36" fill="#f5efe4" />
                                        <text x="22" y="280" textAnchor="middle" fontSize="11" transform="rotate(-90 22 280)">9.6 m</text>
                                        <text x="700" y="545" textAnchor="middle" fontSize="10" letterSpacing="2" opacity="0.7">DECK</text>
                                        <text x="312" y="545" textAnchor="middle" fontSize="10" letterSpacing="2" opacity="0.7">ENTRY</text>
                                    </g>
                                    <g transform="translate(795 40)" pointerEvents="none">
                                        <path d="M0 -14 L7 8 L0 3 L-7 8 Z" fill="#1f3b2c" />
                                        <text y="24" textAnchor="middle" fontSize="11" fontFamily="ui-monospace, monospace" fill="#1f3b2c">N</text>
                                    </g>
                                </svg>

                                {rooms.map((r, i) => {
                                    const sel = r.id === selectedId
                                    return (
                                        <button
                                            key={r.id}
                                            type="button"
                                            style={pct(r.spot)}
                                            aria-pressed={sel}
                                            aria-label={`${i + 1}. ${r.name}, ${r.items.length} amenities`}
                                            className={cn(
                                                'absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 font-mono text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3b2c]',
                                                sel
                                                    ? 'z-20 border-[#f5efe4] bg-[#1f3b2c] text-[#f5efe4]'
                                                    : 'z-10 border-[#fbf7ef] bg-[#d9822b] text-[#1f3b2c] shadow-[0_6px_14px_-6px_rgba(31,59,44,0.7)] hover:bg-[#e4964a]',
                                            )}
                                            onClick={() => setSelectedId(r.id)}
                                            onMouseEnter={() => setHoverId(r.id)}
                                            onMouseLeave={() => setHoverId(null)}
                                            onFocus={() => setHoverId(r.id)}
                                            onBlur={() => setHoverId(null)}
                                        >
                                            {sel && !reduceMotion && (
                                                <motion.span
                                                    className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#d9822b]"
                                                    animate={{ scale: [1, 1.9], opacity: [0.9, 0] }}
                                                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            {i + 1}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-4 px-1 font-mono text-[10px] uppercase tracking-widest text-[#1f3b2c]/70 sm:text-[11px]">
                                <span>Plan · The Larkspur · 1:100</span>
                                <span className="flex items-center gap-2">
                                    <span className="flex h-1.5 w-12">
                                        <span className="w-1/2 bg-[#1f3b2c]" />
                                        <span className="w-1/2 border border-[#1f3b2c]" />
                                    </span>
                                    2 m
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:col-span-5">
                        <div role="tablist" aria-label="Rooms" className="flex flex-wrap gap-2">
                            {rooms.map((r, i) => {
                                const on = r.id === selectedId
                                return (
                                    <button
                                        key={r.id}
                                        ref={(el) => {
                                            chipRefs.current[i] = el
                                        }}
                                        type="button"
                                        role="tab"
                                        id={`${uid}-tab-${r.id}`}
                                        aria-selected={on}
                                        aria-controls={`${uid}-panel`}
                                        tabIndex={on ? 0 : -1}
                                        className={cn(
                                            'relative inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b98a]',
                                            on ? 'border-transparent text-[#1f3b2c]' : 'border-[#f5efe4]/25 text-[#f5efe4]/85 hover:border-[#f5efe4]/60',
                                        )}
                                        onClick={() => setSelectedId(r.id)}
                                        onKeyDown={(e) => onChipKey(e, i)}
                                    >
                                        {on && (
                                            <motion.span
                                                layoutId={`${uid}-chip`}
                                                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 38 }}
                                                className="absolute inset-0 rounded-full bg-[#f5efe4]"
                                            />
                                        )}
                                        <span className="relative font-mono text-xs font-bold">{i + 1}</span>
                                        <span className="relative">{r.name}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <div
                            id={`${uid}-panel`}
                            role="tabpanel"
                            aria-labelledby={`${uid}-tab-${room.id}`}
                            className="mt-6 flex flex-1 flex-col rounded-[28px] border border-[#f5efe4]/15 bg-[#183025] p-6 sm:p-8"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={room.id}
                                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#d9822b] font-mono text-lg font-bold text-[#1f3b2c]">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <h3 className="font-serif text-3xl font-normal leading-tight text-[#f5efe4]">{room.name}</h3>
                                            <p className="mt-1 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#f5efe4]/60">
                                                <LuRuler className="size-3.5" aria-hidden="true" />
                                                {room.area} · {room.dims}
                                            </p>
                                        </div>
                                    </div>
                                    <ul className="mt-7 space-y-3">
                                        {room.items.map((item, i) => (
                                            <motion.li
                                                key={item}
                                                initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.06 * i }}
                                                className="flex items-start gap-3 border-b border-[#f5efe4]/10 pb-3 text-[15px] leading-snug text-[#f5efe4]"
                                            >
                                                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#f5efe4] text-[#1f3b2c]">
                                                    <LuCheck className="size-3" strokeWidth={3} aria-hidden="true" />
                                                </span>
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 lg:mt-auto lg:pt-8">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        aria-label="Previous room"
                                        className="grid size-11 place-items-center rounded-full border border-[#f5efe4]/25 text-[#f5efe4] transition-colors hover:bg-[#f5efe4]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b98a]"
                                        onClick={() => step(-1)}
                                    >
                                        <LuArrowLeft className="size-5" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next room"
                                        className="grid size-11 place-items-center rounded-full border border-[#f5efe4]/25 text-[#f5efe4] transition-colors hover:bg-[#f5efe4]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b98a]"
                                        onClick={() => step(1)}
                                    >
                                        <LuArrowRight className="size-5" aria-hidden="true" />
                                    </button>
                                </div>
                                <a
                                    href="#book-the-larkspur"
                                    className="inline-flex min-h-11 items-center rounded-full bg-[#f5efe4] px-5 text-sm font-semibold text-[#1f3b2c] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b98a]"
                                >
                                    Check availability
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FloorplanHotspotAmenityChecklist

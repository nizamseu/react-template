// NumberedMapResultsList

// ResultsList04 · Directories & Search Aggregators › Aggregated Results List

// Description:
// A guidebook-style results page for Townguide, "Around the lake, in eight stops." Eight
// places around Dhanmondi Lake (a tea stall, an amphitheatre, a kacchi house, a
// bookshop…) are listed with big numbers that match numbered pins on a hand-drawn SVG
// mini map, joined by a dashed walking route. Hovering or focusing a result lights up its
// pin and vice versa; clicking a pin scrolls to its entry. Use it for walking guides or
// "things to do" results.

// Design:
// - Cream #fdf6e3 paper, warm ink #1f1a14 text and rules, Townguide red #d62828 numbers,
//   pins and route; serif display heading (text-4xl → lg:6xl) with a mono "Walk No. 04"
//   rule
// - List: hairline-ruled entries with 44px serif number discs, mono kind/hours line,
//   serif names and a meta row (★ rating, price, walk time); the lit entry gets a tinted
//   band
// - Map: 4:3 inline SVG with city blocks, an outlined lake filled with a hatch pattern
//   (useId ids), cream roads with mono labels, compass and 200 m scale bar; HTML pin
//   buttons
// - Motion: the dashed route fades in and pins pop in/out on filter change, the lit pin
//   scales up with a name label; MotionConfig reducedMotion="user" drops the movement
// - Responsive: map sits on top on mobile, then lg:grid-cols-2 with the map sticky on the
//   right; filter buttons wrap; pins are 30px (34px from sm) with 40px+ hit areas

// What it does:
// - Kind filters (All, Eat, Drink, See, Shop) and an "Open now" toggle filter the local
//   array; numbers and pins renumber 1…n, with a live stop count and an empty state
// - hoverId (list or pin hover/focus) and selectedId (pin or "Locate" click) decide the
//   lit pair; a pin click also scrolls its entry into view (smooth unless reduced motion)
// - Names link to #townguide-<id>; "Download the walk" → #townguide-walk-04-pdf

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NumberedMapResultsList from '@/TestComponent/PageSections/directory/ResultsList04';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <NumberedMapResultsList />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { HiArrowDownTray, HiMiniStar, HiOutlineMapPin } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const INK = '#1f1a14'
const RED = '#d62828'

const stops = [
    {
        id: 'lakeshore-tea',
        name: 'Lakeshore Tea Stall',
        kind: 'Drink',
        blurb: 'Milky cha and hot singara at the water’s edge, served in clay cups.',
        hours: 'Open until 11 pm',
        open: true,
        rating: 4.6,
        price: '৳',
        walk: 4,
        x: 96,
        y: 70,
    },
    {
        id: 'lakeside-amphitheatre',
        name: 'Lakeside Amphitheatre',
        kind: 'See',
        blurb: 'Open-air brick steps where students sing Tagore songs most evenings.',
        hours: 'Closed · gates open 4 pm',
        open: false,
        rating: 4.7,
        price: 'Free',
        walk: 9,
        x: 150,
        y: 132,
    },
    {
        id: 'kacchi-co',
        name: 'Kacchi & Co.',
        kind: 'Eat',
        blurb: 'Slow-cooked mutton kacchi in brass handis; go before 1 pm or queue.',
        hours: 'Open until 10:30 pm',
        open: true,
        rating: 4.8,
        price: '৳৳',
        walk: 14,
        x: 226,
        y: 52,
    },
    {
        id: 'paper-kite',
        name: 'Paper Kite Books',
        kind: 'Shop',
        blurb: 'Three rooms of Bangla poetry, old maps and second-hand paperbacks.',
        hours: 'Closed · opens 11 am',
        open: false,
        rating: 4.5,
        price: '৳',
        walk: 19,
        x: 318,
        y: 84,
    },
    {
        id: 'ghat-32',
        name: 'Ghat 32 Coffee',
        kind: 'Drink',
        blurb: 'A pour-over bar on stilts over the lake with the best sunset seats.',
        hours: 'Open until midnight',
        open: true,
        rating: 4.4,
        price: '৳৳',
        walk: 24,
        x: 268,
        y: 172,
    },
    {
        id: 'chhaya-gallery',
        name: 'Chhaya Art Gallery',
        kind: 'See',
        blurb: 'Rotating shows by young Dhaka photographers in a 1960s bungalow.',
        hours: 'Closed · opens Tue 3 pm',
        open: false,
        rating: 4.6,
        price: 'Free',
        walk: 31,
        x: 344,
        y: 238,
    },
    {
        id: 'banyan-cafe',
        name: 'The Banyan Café',
        kind: 'Eat',
        blurb: 'Khichuri, egg bhuna and lime soda under a 90-year-old banyan tree.',
        hours: 'Open until 11 pm',
        open: true,
        rating: 4.3,
        price: '৳৳',
        walk: 38,
        x: 196,
        y: 236,
    },
    {
        id: 'jamdani-loom',
        name: 'Jamdani Loom House',
        kind: 'Shop',
        blurb: 'Hand-woven jamdani saris and scarves straight from Rupganj weavers.',
        hours: 'Open until 9 pm',
        open: true,
        rating: 4.7,
        price: '৳৳৳',
        walk: 45,
        x: 78,
        y: 214,
    },
]

const kinds = ['All', 'Eat', 'Drink', 'See', 'Shop']

const blocks = [
    [8, 8, 70, 40],
    [108, 8, 70, 30],
    [250, 8, 60, 34],
    [330, 8, 62, 40],
    [8, 150, 50, 44],
    [96, 168, 64, 26],
    [214, 118, 40, 40],
    [300, 124, 40, 44],
    [8, 256, 70, 36],
    [118, 262, 60, 30],
    [230, 262, 70, 30],
    [292, 196, 30, 40],
]

const roads = [
    { d: 'M 0 48 H 400', label: 'ROAD 2', lx: 300, ly: 44 },
    { d: 'M 0 250 H 400', label: 'ROAD 27', lx: 12, ly: 246 },
    { d: 'M 88 0 V 300', label: 'MIRPUR RD', lx: 92, ly: 294, vertical: true },
    { d: 'M 290 0 V 300', label: 'SATMASJID RD', lx: 294, ly: 294, vertical: true },
    { d: 'M 190 48 V 250', label: '', lx: 0, ly: 0 },
]

const LAKE = 'M -20 96 C 40 80 70 124 128 112 S 214 70 250 112 S 300 206 360 196 S 404 230 420 236'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62828]'

function LakeMap({ visible, activeId, uid }) {
    const hatch = `${uid}-hatch`
    const paper = `${uid}-paper`
    const route = visible.map((stop) => `${stop.x},${stop.y}`).join(' ')

    return (
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
                <pattern id={hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke={INK} strokeOpacity="0.28" strokeWidth="1.2" />
                </pattern>
                <pattern id={paper} width="4" height="4" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.5" fill={INK} fillOpacity="0.08" />
                </pattern>
            </defs>
            <rect width="400" height="300" fill="#f7ecd2" />
            <rect width="400" height="300" fill={`url(#${paper})`} />
            {blocks.map(([x, y, w, h]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="3" fill="#efe0bd" stroke={INK} strokeOpacity="0.18" />
            ))}
            {roads.map((road) => (
                <g key={road.d}>
                    <path d={road.d} stroke={INK} strokeOpacity="0.55" strokeWidth="9" fill="none" />
                    <path d={road.d} stroke="#fdf6e3" strokeWidth="7" fill="none" />
                    {road.label ? (
                        <text
                            x={road.lx}
                            y={road.ly}
                            transform={road.vertical ? `rotate(-90 ${road.lx} ${road.ly})` : undefined}
                            fontFamily="ui-monospace, monospace"
                            fontSize="7"
                            letterSpacing="1.2"
                            fill={INK}
                            fillOpacity="0.6"
                        >
                            {road.label}
                        </text>
                    ) : null}
                </g>
            ))}
            <path d={LAKE} stroke={INK} strokeWidth="30" strokeLinecap="round" fill="none" />
            <path d={LAKE} stroke="#e4d7b3" strokeWidth="27" strokeLinecap="round" fill="none" />
            <path d={LAKE} stroke={`url(#${hatch})`} strokeWidth="27" strokeLinecap="round" fill="none" />
            <text
                x="150"
                y="96"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontSize="10"
                fill={INK}
                fillOpacity="0.75"
                transform="rotate(-6 150 96)"
            >
                Dhanmondi Lake
            </text>
            {visible.length > 1 ? (
                <motion.polyline
                    key={route}
                    points={route}
                    fill="none"
                    stroke={RED}
                    strokeWidth="2"
                    strokeDasharray="2 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            ) : null}
            {visible.map((stop) =>
                stop.id === activeId ? (
                    <circle key={stop.id} cx={stop.x} cy={stop.y} r="20" fill={RED} fillOpacity="0.12" stroke={RED} strokeOpacity="0.5" />
                ) : null,
            )}
            <g transform="translate(372 30)">
                <circle r="15" fill="#fdf6e3" stroke={INK} strokeOpacity="0.6" />
                <path d="M 0 -11 L 4 3 L 0 0 L -4 3 Z" fill={RED} />
                <text y="12" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fill={INK}>
                    N
                </text>
            </g>
            <g transform="translate(14 282)">
                <rect width="44" height="4" fill={INK} />
                <rect x="22" width="22" height="4" fill="#fdf6e3" stroke={INK} strokeWidth="0.8" />
                <text y="-4" fontFamily="ui-monospace, monospace" fontSize="6.5" fill={INK}>
                    200 m
                </text>
            </g>
        </svg>
    )
}

export function NumberedMapResultsList({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [kind, setKind] = useState('All')
    const [openNow, setOpenNow] = useState(false)
    const [hoverId, setHoverId] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const itemRefs = useRef({})
    const uid = `tg${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    const reduce = useReducedMotion()

    const visible = useMemo(
        () => stops.filter((stop) => (kind === 'All' || stop.kind === kind) && (!openNow || stop.open)),
        [kind, openNow],
    )

    const activeId = hoverId ?? selectedId
    const counts = useMemo(
        () =>
            Object.fromEntries(
                kinds.map((k) => [k, stops.filter((s) => (k === 'All' || s.kind === k) && (!openNow || s.open)).length]),
            ),
        [openNow],
    )

    const selectFromMap = (id) => {
        setSelectedId(id)
        itemRefs.current[id]?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
    }

    const totalMinutes = visible.length ? visible[visible.length - 1].walk : 0

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fdf6e3] px-4 py-14 text-base font-normal text-[#1f1a14] sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center gap-4 border-b-2 border-[#1f1a14] pb-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                        <span className="font-semibold">Townguide</span>
                        <span aria-hidden="true" className="h-px flex-1 bg-[#1f1a14]/30" />
                        <span className="text-[#d62828]">Walk No. 04</span>
                    </div>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
                        <h2 className="font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#1f1a14] sm:text-5xl lg:text-6xl">
                            Around the lake, <em className="text-[#d62828]">in eight stops.</em>
                        </h2>
                        <div className="lg:pb-2">
                            <p className="text-base leading-7 text-[#1f1a14]/75">
                                A slow late-afternoon loop of Dhanmondi Lake: tea on the water, kacchi, a bookshop
                                and a gallery. Best started around 4 pm from the Road 2 footbridge.
                            </p>
                            <dl className="mt-5 grid grid-cols-3 border-y border-[#1f1a14]/20 font-mono text-xs">
                                {[
                                    ['Loop', '2.6 km'],
                                    ['Walking', '≈ 3 hrs'],
                                    ['Stops', String(stops.length)],
                                ].map(([label, value]) => (
                                    <div key={label} className="py-3 pr-2">
                                        <dt className="uppercase tracking-[0.18em] text-[#1f1a14]/55">{label}</dt>
                                        <dd className="mt-1 text-sm font-semibold text-[#1f1a14]">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div role="group" aria-label="Filter stops by kind" className="flex flex-wrap gap-2">
                            {kinds.map((k) => (
                                <button
                                    key={k}
                                    type="button"
                                    aria-pressed={kind === k}
                                    onClick={() => setKind(k)}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                                        kind === k
                                            ? 'border-[#1f1a14] bg-[#1f1a14] text-[#fdf6e3]'
                                            : 'border-[#1f1a14]/25 text-[#1f1a14] hover:border-[#1f1a14]',
                                        focusRing,
                                    )}
                                >
                                    {k}
                                    <span
                                        className={cn(
                                            'font-mono text-[11px]',
                                            kind === k ? 'text-[#fdf6e3]/60' : 'text-[#1f1a14]/45',
                                        )}
                                    >
                                        {counts[k]}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={openNow}
                                onClick={() => setOpenNow((v) => !v)}
                                className={cn('inline-flex min-h-10 items-center gap-2.5 rounded-full pr-1 text-sm font-medium', focusRing)}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'relative h-6 w-10 rounded-full border border-[#1f1a14] transition-colors',
                                        openNow ? 'bg-[#d62828]' : 'bg-transparent',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'absolute top-0.5 h-[18px] w-[18px] rounded-full border border-[#1f1a14] bg-[#fdf6e3] transition-[left] duration-200',
                                            openNow ? 'left-[18px]' : 'left-0.5',
                                        )}
                                    />
                                </span>
                                Open now
                            </button>
                            <p aria-live="polite" aria-atomic="true" className="font-mono text-xs uppercase tracking-[0.16em] text-[#1f1a14]/70">
                                {visible.length} {visible.length === 1 ? 'stop' : 'stops'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
                        <div className="order-2 lg:order-1">
                            {visible.length ? (
                                <ol className="border-b border-[#1f1a14]/20">
                                    {visible.map((stop, index) => {
                                        const lit = activeId === stop.id
                                        return (
                                            <li
                                                key={stop.id}
                                                ref={(node) => {
                                                    itemRefs.current[stop.id] = node
                                                }}
                                                className="scroll-mt-6"
                                                onMouseEnter={() => setHoverId(stop.id)}
                                                onMouseLeave={() => setHoverId(null)}
                                                onFocus={() => setHoverId(stop.id)}
                                                onBlur={() => setHoverId(null)}
                                            >
                                                <article
                                                    className={cn(
                                                        'relative flex gap-4 border-t border-[#1f1a14]/20 px-2 py-5 transition-colors duration-300 sm:gap-5 sm:px-3',
                                                        lit ? 'bg-[#f5e6c4]' : 'bg-transparent',
                                                    )}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'absolute inset-y-0 left-0 w-[3px] origin-top bg-[#d62828] transition-transform duration-300',
                                                            lit ? 'scale-y-100' : 'scale-y-0',
                                                        )}
                                                    />
                                                    <span
                                                        className={cn(
                                                            'grid h-11 w-11 shrink-0 place-items-center rounded-full border font-serif text-xl transition-colors duration-300',
                                                            lit
                                                                ? 'border-[#d62828] bg-[#d62828] text-[#fdf6e3]'
                                                                : 'border-[#1f1a14] text-[#1f1a14]',
                                                        )}
                                                    >
                                                        <span className="sr-only">Stop </span>
                                                        {index + 1}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f1a14]/60">
                                                            {stop.kind} ·{' '}
                                                            <span className={stop.open ? 'text-[#1f1a14]' : 'text-[#d62828]'}>
                                                                {stop.hours}
                                                            </span>
                                                        </p>
                                                        <h3 className="mt-1 font-serif text-xl font-normal leading-snug text-[#1f1a14] sm:text-2xl">
                                                            <a
                                                                href={`#townguide-${stop.id}`}
                                                                className={cn('rounded decoration-[#d62828] underline-offset-4 hover:underline', focusRing)}
                                                            >
                                                                {stop.name}
                                                            </a>
                                                        </h3>
                                                        <p className="mt-1.5 text-sm leading-6 text-[#1f1a14]/75">{stop.blurb}</p>
                                                        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#1f1a14]/70">
                                                            <span className="inline-flex items-center gap-1 text-[#1f1a14]">
                                                                <HiMiniStar aria-hidden="true" className="text-[#d62828]" />
                                                                {stop.rating.toFixed(1)}
                                                                <span className="sr-only"> out of 5</span>
                                                            </span>
                                                            <span>{stop.price}</span>
                                                            <span>{stop.walk} min into the walk</span>
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        aria-pressed={selectedId === stop.id}
                                                        aria-label={`Locate ${stop.name} on the map`}
                                                        onClick={() => setSelectedId((current) => (current === stop.id ? null : stop.id))}
                                                        className={cn(
                                                            'grid h-10 w-10 shrink-0 place-items-center self-start rounded-full border text-lg transition-colors',
                                                            selectedId === stop.id
                                                                ? 'border-[#d62828] bg-[#d62828] text-[#fdf6e3]'
                                                                : 'border-[#1f1a14]/25 text-[#1f1a14] hover:border-[#1f1a14]',
                                                            focusRing,
                                                        )}
                                                    >
                                                        <HiOutlineMapPin aria-hidden="true" />
                                                    </button>
                                                </article>
                                            </li>
                                        )
                                    })}
                                </ol>
                            ) : (
                                <div className="border-y border-[#1f1a14]/20 px-4 py-14 text-center">
                                    <p className="font-serif text-3xl italic text-[#d62828]">Nothing open here yet.</p>
                                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#1f1a14]/70">
                                        None of the “{kind}” stops on this walk are open right now. Switch off “Open
                                        now” or pick another kind.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setKind('All')
                                            setOpenNow(false)
                                        }}
                                        className={cn(
                                            'mt-6 inline-flex min-h-11 items-center rounded-full bg-[#1f1a14] px-5 text-sm font-semibold text-[#fdf6e3] hover:bg-[#d62828]',
                                            focusRing,
                                        )}
                                    >
                                        Show all eight stops
                                    </button>
                                </div>
                            )}
                            <a
                                href="#townguide-walk-04-pdf"
                                className={cn(
                                    'mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#1f1a14] px-5 text-sm font-semibold transition-colors hover:bg-[#1f1a14] hover:text-[#fdf6e3]',
                                    focusRing,
                                )}
                            >
                                <HiArrowDownTray aria-hidden="true" />
                                Download the walk
                            </a>
                        </div>

                        <div className="order-1 lg:order-2">
                            <figure className="lg:sticky lg:top-6">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] border-2 border-[#1f1a14] bg-[#f7ecd2] shadow-[6px_6px_0_#1f1a14]">
                                    <LakeMap visible={visible} activeId={activeId} uid={uid} />
                                    <AnimatePresence initial={false}>
                                        {visible.map((stop, index) => {
                                            const lit = activeId === stop.id
                                            const below = stop.y < 70
                                            return (
                                                <motion.button
                                                    key={stop.id}
                                                    type="button"
                                                    aria-label={`Stop ${index + 1}: ${stop.name}, ${stop.kind}`}
                                                    aria-pressed={selectedId === stop.id}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: lit ? 1.22 : 1, opacity: 1 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                                                    onMouseEnter={() => setHoverId(stop.id)}
                                                    onMouseLeave={() => setHoverId(null)}
                                                    onFocus={() => setHoverId(stop.id)}
                                                    onBlur={() => setHoverId(null)}
                                                    onClick={() => selectFromMap(stop.id)}
                                                    style={{ left: `${(stop.x / 400) * 100}%`, top: `${(stop.y / 300) * 100}%` }}
                                                    className={cn(
                                                        'absolute -ml-[15px] -mt-[15px] grid h-[30px] w-[30px] place-items-center rounded-full border-2 font-serif text-sm font-semibold shadow-[2px_2px_0_#1f1a14] after:absolute after:-inset-[6px] after:rounded-full sm:-ml-[17px] sm:-mt-[17px] sm:h-[34px] sm:w-[34px] sm:text-base',
                                                        lit
                                                            ? 'z-20 border-[#1f1a14] bg-[#1f1a14] text-[#fdf6e3]'
                                                            : 'z-10 border-[#fdf6e3] bg-[#d62828] text-[#fdf6e3]',
                                                        focusRing,
                                                    )}
                                                >
                                                    {index + 1}
                                                    {lit ? (
                                                        <span
                                                            aria-hidden="true"
                                                            className={cn(
                                                                'pointer-events-none absolute w-max max-w-[150px] truncate rounded-sm bg-[#1f1a14] px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[#fdf6e3]',
                                                                below ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]',
                                                                stop.x > 300 ? 'right-0' : stop.x < 100 ? 'left-0' : 'left-1/2 -translate-x-1/2',
                                                            )}
                                                        >
                                                            {stop.name}
                                                        </span>
                                                    ) : null}
                                                </motion.button>
                                            )
                                        })}
                                    </AnimatePresence>
                                </div>
                                <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f1a14]/60">
                                    <span>Map 04 · Dhanmondi Lake loop</span>
                                    <span className="inline-flex items-center gap-2">
                                        <span aria-hidden="true" className="h-0 w-6 border-t-2 border-dotted border-[#d62828]" />
                                        {visible.length > 1 ? `Route · about ${totalMinutes} min` : 'Route'}
                                    </span>
                                </figcaption>
                            </figure>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default NumberedMapResultsList

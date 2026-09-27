// RouteWalkMapView

// MapView04 · Booking & Reservations › Interactive Map View

// Description:
// A concierge-style walking guide for the Grand Aurelia Hotel on Vienna's Ringstraße.
// Under the serif heading "Four walks from our front door" guests pick one of four
// attractions (Stephansdom, Hofburg, Stadtpark, Naschmarkt); a gold route draws itself
// from the hotel across a stylised ivory city map while the distance counts up and a
// card lists hours, a concierge tip and turn-by-turn steps. Use it on hotel location pages.

// Design:
// - Centred header with gold hairline ornament; a 2×2 → md: 4-up tab row of attractions
//   (roman numerals I–IV); then lg: 8/12 map (460 → sm: 540 → lg: ≥600px, stretched to
//   the card) + 4/12 concierge card
// - Ivory #faf6ee page, map #f3ede0 with #e9dfc9 old-town blocks, white streets, sage
//   parks, grey-blue Donaukanal and Wien river; navy #1b2a4a type, gold #b8975a routes
// - Serif display type (text-4xl → lg: 6xl), small-caps labels, "RINGSTRASSE" set on a
//   textPath; map frame has an inset gold hairline, rounded-[30px]; card is rounded-[26px]
// - The map is a 1000×1000 SVG in "slice" mode; markers are HTML buttons placed with
//   container-query units, so they sit on the art at every breakpoint
// - One framer-motion value drives the route (pathLength), the walking dot and the metre
//   counter; the draw starts when the map scrolls into view and is skipped for reduced
//   motion

// What it does:
// - selectedId (tabs, arrow keys / Home / End, or the map markers) picks the route; the
//   progress value re-animates from 0 to 1 on every change
// - mode ("walk" | "car") swaps the time between walking pace (80 m/min) and the hotel
//   car estimate; distances are derived from the route geometry
// - "Ask the concierge" links to #concierge and "Send to my phone" to #send-route-<id>;
//   the other three routes stay visible as faint dotted lines

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RouteWalkMapView from '@/TestComponent/PageSections/booking/MapView04';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <RouteWalkMapView />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { LuCar, LuClock, LuFootprints, LuSend } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const HOTEL = [530, 700]
const METERS_PER_UNIT = 2.9

const rawRoutes = [
    {
        id: 'stephansdom',
        numeral: 'I',
        name: 'Stephansdom',
        kind: 'Gothic cathedral · founded 1147',
        hours: 'Daily 06:00 – 22:00 · South Tower €6.50',
        tip: 'Climb the 343 steps of the South Tower before 10:00 — you will have the roof tiles to yourself.',
        steps: [
            'Turn right out of the lobby onto Kärntner Ring',
            'Cross at the Opera and enter Kärntner Straße',
            'Walk north through the pedestrian zone',
            'Arrive at Stephansplatz, south portal ahead',
        ],
        pts: [HOTEL, [534, 640], [538, 560], [530, 480], [522, 410]],
    },
    {
        id: 'hofburg',
        numeral: 'II',
        name: 'Hofburg Palace',
        kind: 'Imperial residence · Sisi Museum',
        hours: '09:00 – 17:30 · combined ticket €19',
        tip: 'Ask us for the State Hall of the National Library — we hold ten timed tickets every morning.',
        steps: [
            'Head west along the Ring past the Albertina',
            'Cut through Burggarten by the Palmenhaus',
            'Pass the Mozart monument',
            'Enter Heldenplatz through the Burgtor',
        ],
        pts: [HOTEL, [470, 688], [430, 640], [395, 560], [350, 480]],
    },
    {
        id: 'stadtpark',
        numeral: 'III',
        name: 'Stadtpark & Kursalon',
        kind: 'Landscaped park · opened 1862',
        hours: 'Open 24 hours · waltz concerts 20:15',
        tip: 'The gilded Johann Strauss statue photographs best in the late-afternoon light.',
        steps: [
            'Turn left onto Kärntner Ring towards Schwarzenbergplatz',
            'Continue onto Schubertring',
            'Enter the park at the Wien river portal',
            'Follow the pond to the Kursalon terrace',
        ],
        pts: [HOTEL, [610, 688], [690, 650], [735, 600], [760, 555]],
    },
    {
        id: 'naschmarkt',
        numeral: 'IV',
        name: 'Naschmarkt',
        kind: 'Open-air market · since the 1700s',
        hours: 'Mon – Fri 06:00 – 19:30 · Sat 06:00 – 17:00',
        tip: 'Saturdays add a flea market at the Kettenbrückengasse end — go early for silver and prints.',
        steps: [
            'Leave by the Opera side entrance',
            'Walk past the Secession and its golden dome',
            'Follow the Linke Wienzeile stalls',
            'Stop for coffee at stall 412',
        ],
        pts: [HOTEL, [470, 722], [400, 742], [320, 765]],
    },
]

const routes = rawRoutes.map((r) => {
    const lens = r.pts.slice(1).map((p, i) => Math.hypot(p[0] - r.pts[i][0], p[1] - r.pts[i][1]))
    const len = lens.reduce((a, b) => a + b, 0)
    const meters = Math.round((len * METERS_PER_UNIT) / 10) * 10
    return {
        ...r,
        lens,
        len,
        meters,
        walk: Math.max(1, Math.round(meters / 80)),
        car: Math.round(meters / 300) + 4,
        end: r.pts[r.pts.length - 1],
        d: `M${r.pts.map((p) => p.join(' ')).join(' L')}`,
    }
})

const pointAt = (route, t) => {
    let dist = Math.min(1, Math.max(0, t)) * route.len
    for (let i = 0; i < route.lens.length; i++) {
        const [ax, ay] = route.pts[i]
        const [bx, by] = route.pts[i + 1]
        if (dist <= route.lens[i]) {
            const f = route.lens[i] ? dist / route.lens[i] : 0
            return [ax + (bx - ax) * f, ay + (by - ay) * f]
        }
        dist -= route.lens[i]
    }
    return route.end
}

const RING =
    'M300 330 C 360 250 480 222 600 232 C 700 242 780 300 800 380 C 820 470 790 560 740 620 C 680 690 600 715 520 712 C 430 710 350 670 300 600 C 260 530 255 400 300 330 Z'

const streets = [
    'M430 420 L520 405 L610 420',
    'M522 410 L470 330 L430 270',
    'M522 410 L600 330 L650 260',
    'M380 380 L470 330',
    'M360 560 L450 520 L530 480',
    'M600 420 L680 470 L760 480',
    'M620 560 L700 540',
    'M420 460 L360 420',
    'M540 560 L620 560 L660 620',
    'M300 600 L180 650 L60 690',
    'M300 330 L200 250 L120 170',
    'M800 380 L900 360 L1000 350',
    'M740 620 L820 700 L900 800',
    'M520 712 L520 820 L510 1000',
    'M300 600 L260 700 L220 820',
    'M600 232 L620 120 L640 0',
    'M430 240 L400 120 L380 0',
    'M270 470 L150 470 L0 480',
    'M640 900 L760 860 L900 850',
    'M100 300 L230 380',
    'M820 180 L900 220 L1000 230',
    'M160 900 L300 880 L420 900',
    'M330 400 L420 380',
    'M600 330 L700 360 L760 420',
    'M560 480 L660 500',
    'M470 600 L420 560',
    'M620 620 L580 680',
    'M350 520 L300 480',
    'M650 300 L720 330',
    'M470 330 L430 380',
    'M600 620 L680 600',
    'M400 620 L460 660',
    'M700 420 L740 520',
]

const U = 'max(100cqw / 1000, 100cqh / 1000)'
const at = ([x, y]) => ({
    left: `calc(50% + ${x - 500} * ${U})`,
    top: `calc(50% + ${y - 500} * ${U})`,
})

const km = (m) => `${(m / 1000).toFixed(2)} km`

export function RouteWalkMapView({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [selectedId, setSelectedId] = useState(routes[0].id)
    const [mode, setMode] = useState('walk')
    const mapRef = useRef(null)
    const tabRefs = useRef([])
    const inView = useInView(mapRef, { once: true, amount: 0.35 })

    const route = routes.find((r) => r.id === selectedId) ?? routes[0]
    const progress = useMotionValue(1)
    const dotX = useTransform(progress, (v) => pointAt(route, v)[0])
    const dotY = useTransform(progress, (v) => pointAt(route, v)[1])
    const distanceText = useTransform(progress, (v) => km(v * route.meters))

    useEffect(() => {
        if (!inView || reduceMotion) {
            progress.set(1)
            return undefined
        }
        progress.set(0)
        const controls = animate(progress, 1, { duration: 1.8, ease: [0.65, 0, 0.35, 1] })
        return () => controls.stop()
    }, [selectedId, inView, reduceMotion, progress])

    const select = (id) => {
        if (id === selectedId) return
        if (inView && !reduceMotion) progress.set(0)
        setSelectedId(id)
    }

    const onTabKey = (e, index) => {
        const last = routes.length - 1
        let next = null
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
        if (e.key === 'Home') next = 0
        if (e.key === 'End') next = last
        if (next === null) return
        e.preventDefault()
        select(routes[next].id)
        tabRefs.current[next]?.focus()
    }

    const minutes = mode === 'walk' ? route.walk : route.car

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#faf6ee] py-16 text-base font-normal text-[#1b2a4a] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b8975a]">
                        <span className="hidden h-px w-8 bg-[#b8975a] sm:block" aria-hidden="true" />
                        Grand Aurelia Hotel · Vienna
                        <span className="hidden h-px w-8 bg-[#b8975a] sm:block" aria-hidden="true" />
                    </p>
                    <h2 className="mt-5 text-balance font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#1b2a4a] sm:text-5xl lg:text-6xl">
                        Four walks from our <em className="text-[#b8975a]">front door</em>
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#1b2a4a]/70 sm:text-base">
                        Kärntner Ring 9, directly across from the State Opera. Choose a destination and
                        our concierge team will trace the loveliest way there.
                    </p>
                </div>

                <div
                    role="tablist"
                    aria-label="Walking destinations"
                    className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4"
                >
                    {routes.map((r, i) => {
                        const on = r.id === route.id
                        return (
                            <button
                                key={r.id}
                                ref={(el) => {
                                    tabRefs.current[i] = el
                                }}
                                type="button"
                                role="tab"
                                id={`${uid}-tab-${r.id}`}
                                aria-selected={on}
                                aria-controls={`${uid}-panel`}
                                tabIndex={on ? 0 : -1}
                                className={cn(
                                    'group relative flex min-h-16 items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a] sm:px-4',
                                    on ? 'border-[#1b2a4a] bg-[#1b2a4a] text-[#faf6ee]' : 'border-[#e5dac3] bg-white/60 text-[#1b2a4a] hover:border-[#b8975a]',
                                )}
                                onClick={() => select(r.id)}
                                onKeyDown={(e) => onTabKey(e, i)}
                            >
                                <span
                                    className={cn(
                                        'grid size-9 shrink-0 place-items-center rounded-full border font-serif text-sm',
                                        on ? 'border-[#b8975a] text-[#e9d6ad]' : 'border-[#d9c7a2] text-[#b8975a]',
                                    )}
                                >
                                    {r.numeral}
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-serif text-[15px] leading-tight sm:text-base">{r.name}</span>
                                    <span className={cn('mt-0.5 block text-xs', on ? 'text-[#faf6ee]/65' : 'text-[#1b2a4a]/55')}>
                                        {r.walk} min walk
                                    </span>
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                    <div
                        ref={mapRef}
                        className="relative h-[460px] overflow-hidden rounded-[30px] bg-[#f3ede0] [container-type:size] sm:h-[540px] lg:col-span-8 lg:h-auto lg:min-h-[600px]"
                    >
                        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
                            <defs>
                                <path id={`${uid}-ring`} d={RING} />
                                <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="6" />
                                </filter>
                            </defs>
                            <rect width="1000" height="1000" fill="#f3ede0" />
                            <path d={RING} fill="#e9dfc9" />
                            <path d="M250 300 C 280 290 310 300 320 330 L 290 380 C 260 380 240 340 250 300 Z" fill="#dfe3cb" />
                            <path d="M300 470 C 320 450 360 452 380 480 L 400 560 C 370 590 330 590 310 560 Z" fill="#dfe3cb" />
                            <path d="M720 520 C 760 505 830 510 860 540 C 880 580 870 640 840 670 C 800 680 760 660 740 630 C 725 600 712 550 720 520 Z" fill="#dfe3cb" />
                            <path d="M770 580 C 785 570 805 575 808 590 C 810 604 792 612 778 606 C 766 600 762 590 770 580 Z" fill="#d3e0e4" />
                            <g fill="none" stroke="#fffdf8" strokeLinecap="round" strokeLinejoin="round">
                                {streets.map((d) => (
                                    <path key={d} d={d} strokeWidth="9" />
                                ))}
                            </g>
                            <path d={RING} fill="none" stroke="#e2d4b6" strokeWidth="26" />
                            <path d={RING} fill="none" stroke="#fffdf8" strokeWidth="20" />
                            <path d="M100 110 C 300 180 500 160 690 190 C 820 212 900 262 1000 330" fill="none" stroke="#cfdbe0" strokeWidth="34" strokeLinecap="round" />
                            <path d="M0 832 C 150 802 260 777 330 767 C 420 754 560 766 700 700 C 760 672 800 640 900 612 L1000 590" fill="none" stroke="#d3e0e4" strokeWidth="14" strokeLinecap="round" />
                            <g fill="#ddcfb2">
                                <path d="M512 380 h20 v14 h12 v12 h-12 v36 h-20 v-36 h-12 v-12 h12 Z" />
                                <path d="M318 448 h70 v16 h-54 v40 h54 v16 h-70 Z" />
                                <rect x="550" y="672" width="34" height="22" rx="3" />
                                <rect x="790" y="540" width="40" height="16" rx="3" />
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <rect key={i} x={250 + i * 22} y={775 - i * 2} width="16" height="8" rx="2" />
                                ))}
                            </g>
                            <text fontSize="13" fontWeight="600" letterSpacing="6" fill="#b8975a" opacity="0.8">
                                <textPath href={`#${uid}-ring`} startOffset="6%">
                                    RINGSTRASSE
                                </textPath>
                            </text>
                            <g fontFamily="ui-serif, Georgia, serif" textAnchor="middle" fill="#1b2a4a">
                                <text x="500" y="300" fontSize="15" letterSpacing="7" opacity="0.4">INNERE STADT</text>
                                <text x="800" y="150" fontSize="16" fontStyle="italic" opacity="0.45">Donaukanal</text>
                                <text x="150" y="860" fontSize="15" fontStyle="italic" opacity="0.45">Wien</text>
                                <text x="800" y="700" fontSize="13" fontStyle="italic" opacity="0.5">Stadtpark</text>
                                <text x="280" y="610" fontSize="12" fontStyle="italic" opacity="0.5">Burggarten</text>
                            </g>

                            {routes
                                .filter((r) => r.id !== route.id)
                                .map((r) => (
                                    <path
                                        key={r.id}
                                        d={r.d}
                                        fill="none"
                                        stroke="#b8975a"
                                        strokeOpacity="0.45"
                                        strokeWidth="3"
                                        strokeDasharray="1 9"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                ))}
                            <path d={route.d} fill="none" stroke="#b8975a" strokeOpacity="0.18" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                            <motion.path
                                key={route.id}
                                d={route.d}
                                fill="none"
                                stroke="#b8975a"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ pathLength: progress }}
                            />
                            <motion.circle cx={dotX} cy={dotY} r="16" fill="#b8975a" opacity="0.35" filter={`url(#${uid}-glow)`} />
                            <motion.circle cx={dotX} cy={dotY} r="8" fill="#fffdf8" stroke="#1b2a4a" strokeWidth="3" />
                        </svg>

                        <div className="pointer-events-none absolute inset-2 rounded-[24px] border border-[#b8975a]/35" aria-hidden="true" />

                        <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={at(HOTEL)}>
                            <span className="grid size-12 place-items-center rounded-full border-2 border-[#b8975a] bg-[#1b2a4a] font-serif text-sm tracking-wider text-[#e9d6ad] shadow-[0_10px_24px_-10px_rgba(27,42,74,0.9)]">
                                GA
                            </span>
                            <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1b2a4a] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#faf6ee]">
                                Your hotel
                            </span>
                        </div>

                        {routes.map((r) => {
                            const on = r.id === route.id
                            return (
                                <button
                                    key={r.id}
                                    type="button"
                                    style={at(r.end)}
                                    aria-label={`Show the route to ${r.name}`}
                                    aria-pressed={on}
                                    className={cn(
                                        'absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1b2a4a]',
                                        on && 'z-30',
                                    )}
                                    onClick={() => select(r.id)}
                                >
                                    <span
                                        className={cn(
                                            'grid size-10 place-items-center rounded-full border-2 font-serif text-sm shadow-[0_8px_18px_-10px_rgba(27,42,74,0.8)] transition-all duration-300',
                                            on ? 'scale-110 border-[#1b2a4a] bg-[#b8975a] text-[#1b2a4a]' : 'border-[#b8975a] bg-[#fffdf8] text-[#b8975a] hover:bg-[#f6ecd6]',
                                        )}
                                    >
                                        {r.numeral}
                                    </span>
                                    {on && (
                                        <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-full bg-[#fffdf8] px-3 py-1 font-serif text-sm text-[#1b2a4a] shadow-[0_6px_16px_-8px_rgba(27,42,74,0.6)] sm:block">
                                            {r.name}
                                        </span>
                                    )}
                                </button>
                            )
                        })}

                        <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-2xl bg-[#1b2a4a]/92 px-4 py-3 text-[#faf6ee] shadow-lg" aria-hidden="true">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e9d6ad]">Route to {route.name}</p>
                            <p className="mt-1 font-serif text-2xl tabular-nums leading-none">
                                <motion.span>{distanceText}</motion.span>
                            </p>
                        </div>
                    </div>

                    <div
                        id={`${uid}-panel`}
                        role="tabpanel"
                        aria-labelledby={`${uid}-tab-${route.id}`}
                        className="flex flex-col rounded-[26px] border border-[#e5dac3] bg-white/70 p-6 sm:p-7 lg:col-span-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b8975a]">
                                    Walk {route.numeral} of IV
                                </p>
                                <h3 className="mt-2 font-serif text-3xl font-normal leading-tight text-[#1b2a4a]">{route.name}</h3>
                                <p className="mt-1 text-sm text-[#1b2a4a]/60">{route.kind}</p>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-[#f3ede0] px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1b2a4a]/55">Distance</p>
                                <p className="mt-1 font-serif text-2xl tabular-nums text-[#1b2a4a]">{km(route.meters)}</p>
                            </div>
                            <div className="rounded-2xl bg-[#1b2a4a] px-4 py-3 text-[#faf6ee]">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e9d6ad]">
                                    {mode === 'walk' ? 'On foot' : 'Hotel car'}
                                </p>
                                <p className="mt-1 font-serif text-2xl tabular-nums" aria-live="polite">
                                    {minutes} min
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 inline-flex self-start rounded-full border border-[#e5dac3] p-1" role="group" aria-label="Travel mode">
                            {[
                                { id: 'walk', label: 'Walk', Icon: LuFootprints },
                                { id: 'car', label: 'Hotel car', Icon: LuCar },
                            ].map(({ id, label, Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    aria-pressed={mode === id}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a]',
                                        mode === id ? 'bg-[#b8975a] text-[#1b2a4a]' : 'text-[#1b2a4a]/70 hover:text-[#1b2a4a]',
                                    )}
                                    onClick={() => setMode(id)}
                                >
                                    <Icon className="size-4" aria-hidden="true" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        <p className="mt-5 flex items-center gap-2 text-sm text-[#1b2a4a]/75">
                            <LuClock className="size-4 shrink-0 text-[#b8975a]" aria-hidden="true" />
                            {route.hours}
                        </p>

                        <ol className="mt-5 space-y-3 border-t border-[#e5dac3] pt-5">
                            {route.steps.map((step, i) => (
                                <li key={step} className="flex gap-3 text-sm leading-snug text-[#1b2a4a]">
                                    <span className="font-serif text-base leading-none text-[#b8975a]">{i + 1}.</span>
                                    {step}
                                </li>
                            ))}
                        </ol>

                        <blockquote className="mt-5 border-l-2 border-[#b8975a] pl-4 font-serif text-[15px] italic leading-relaxed text-[#1b2a4a]/80">
                            “{route.tip}”
                        </blockquote>

                        <div className="mt-6 flex flex-wrap gap-2 lg:mt-auto lg:pt-6">
                            <a
                                href="#concierge"
                                className="inline-flex min-h-11 items-center rounded-full bg-[#1b2a4a] px-5 text-sm font-semibold text-[#faf6ee] transition-colors hover:bg-[#26385f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a]"
                            >
                                Ask the concierge
                            </a>
                            <a
                                href={`#send-route-${route.id}`}
                                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#b8975a] px-5 text-sm font-semibold text-[#1b2a4a] transition-colors hover:bg-[#f6ecd6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a]"
                            >
                                <LuSend className="size-4" aria-hidden="true" />
                                Send to my phone
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RouteWalkMapView

// RouteSwapBookingSearch

// BookingSearch04 · Booking & Reservations › Search / Booking Engine

// Description:
// A night-sky flight search for the fictional airline Skylark Air. The oversized heading
// "Where to next?" sits under a dotted flight arc; below it a glassy form has One-way /
// Round-trip, cabin and passengers controls, From / To airport pickers with an animated
// swap button, travel dates and "Search flights", which lists three sample fares for the
// route (times, duration, stops, price per adult). Use it as the hero of an airline or
// flight-comparison homepage.

// Design:
// - Navy #0a1f44 section, deeper #081936 fields, sky #7dd3fc accents (arc, codes on focus,
//   segmented pill, CTA); white text with 60–70% white for secondary copy
// - Display heading text-5xl → sm:text-7xl → lg:text-8xl, bold, tight tracking; airport
//   codes are 3xl bold with the city as a small input underneath; rounded-2xl fields
// - Glass form: white/[0.04] fill, white/10 hairline, rounded-[28px]; popovers are white
//   cards with navy text and a sky highlight on the active option
// - Base: everything stacks, From above To with the swap button on the right edge turned
//   90°; lg: one row — route pair (2 cols) · depart · return · search button
// - framer-motion: dotted arc draws in on view, swap button spins 180° while the codes
//   slide in, sliding trip-type pill, popovers fade/scale; reduced motion removes the
//   drawing, spin and slides

// What it does:
// - From / To are ARIA comboboxes over 12 airports (type to filter, Arrow keys + Enter,
//   Escape or outside click closes and restores the last pick); the swap button exchanges
//   them; "Popular routes" chips fill both
// - One-way swaps the Return input for a "+ Add return" button; date min values come
//   from "today" in useEffect (the server renders fixed 14 → 21 Oct 2026 dates); cabin
//   is a native select
// - Passengers popover: adults 1 – 9, children 0 – 8, infants ≤ adults; closes on Done,
//   Escape or outside click; submit validates both airports, same-airport and date order,
//   then shows three fare rows priced by a deterministic route × cabin model

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RouteSwapBookingSearch from '@/TestComponent/PageSections/booking/BookingSearch04';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <RouteSwapBookingSearch />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiChevronDown, HiMinus, HiPlus } from 'react-icons/hi2';
import { LuArrowLeftRight, LuArrowRight, LuPlane, LuPlaneLanding, LuPlaneTakeoff, LuUsers } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const airports = [
    { code: 'LHR', city: 'London Heathrow', country: 'United Kingdom' },
    { code: 'LGW', city: 'London Gatwick', country: 'United Kingdom' },
    { code: 'JFK', city: 'New York JFK', country: 'United States' },
    { code: 'DXB', city: 'Dubai International', country: 'United Arab Emirates' },
    { code: 'DAC', city: 'Dhaka Shahjalal', country: 'Bangladesh' },
    { code: 'SIN', city: 'Singapore Changi', country: 'Singapore' },
    { code: 'HND', city: 'Tokyo Haneda', country: 'Japan' },
    { code: 'CDG', city: 'Paris Charles de Gaulle', country: 'France' },
    { code: 'LIS', city: 'Lisbon Humberto Delgado', country: 'Portugal' },
    { code: 'SYD', city: 'Sydney Kingsford Smith', country: 'Australia' },
    { code: 'YYZ', city: 'Toronto Pearson', country: 'Canada' },
    { code: 'CPT', city: 'Cape Town International', country: 'South Africa' },
]

const byCode = (code) => airports.find((a) => a.code === code)

const routes = [
    ['LHR', 'JFK'],
    ['DAC', 'DXB'],
    ['SIN', 'HND'],
    ['CDG', 'LIS'],
]

const cabins = [
    { id: 'economy', label: 'Economy', factor: 1 },
    { id: 'premium', label: 'Premium Economy', factor: 1.7 },
    { id: 'business', label: 'Business', factor: 3.6 },
    { id: 'first', label: 'First', factor: 6.2 },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const pad = (n) => String(n).padStart(2, '0')
const toIso = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const addDays = (iso, days) => {
    const [y, m, d] = iso.split('-').map(Number)
    return toIso(new Date(y, m - 1, d + days))
}
const niceDate = (iso) => {
    const [y, m, d] = iso.split('-').map(Number)
    return `${DAYS[new Date(y, m - 1, d).getDay()]} ${d} ${MONTHS[m - 1]}`
}

function routeHash(a, b) {
    let h = 17
    for (const c of `${a}${b}`) h = (h * 31 + c.charCodeAt(0)) % 9973
    return h
}

function baseFare(from, to) {
    return 110 + (routeHash([from, to].sort()[0], [from, to].sort()[1]) % 470)
}

function fareRows(from, to, cabin) {
    const h = routeHash(from, to)
    const base = baseFare(from, to) * cabin.factor
    const hours = 2 + (h % 13)
    const departs = ['07:40', '11:15', '19:05']
    return departs.map((dep, i) => {
        const duration = hours * 60 + ((h >> i) % 50) + (i === 1 ? 95 : 0)
        const [dh, dm] = dep.split(':').map(Number)
        const arrMin = (dh * 60 + dm + duration) % 1440
        const nextDay = dh * 60 + dm + duration >= 1440
        return {
            id: dep,
            dep,
            arr: `${pad(Math.floor(arrMin / 60))}:${pad(arrMin % 60)}${nextDay ? ' +1' : ''}`,
            duration: `${Math.floor(duration / 60)}h ${pad(duration % 60)}m`,
            stops: i === 1 ? '1 stop · DOH' : 'Direct',
            price: Math.round(base * [1, 0.86, 1.18][i]),
        }
    })
}

function AirportField({ label, icon: Icon, value, onChange, open, onOpen, onClose, error, className, align }) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [query, setQuery] = useState('')
    const [hi, setHi] = useState(0)
    const wrapRef = useRef(null)
    const inputRef = useRef(null)
    const airport = byCode(value)
    const q = query.trim().toLowerCase()
    const list =
        !q || (airport && q === airport.city.toLowerCase())
            ? airports
            : airports.filter((a) => `${a.code} ${a.city} ${a.country}`.toLowerCase().includes(q))

    useEffect(() => {
        if (!open) return undefined
        const onPointer = (event) => {
            if (wrapRef.current && !wrapRef.current.contains(event.target)) onClose()
        }
        document.addEventListener('pointerdown', onPointer)
        return () => document.removeEventListener('pointerdown', onPointer)
    }, [open, onClose])

    const choose = (a) => {
        onChange(a.code)
        onClose()
    }

    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (!open) onOpen()
            setHi((i) => Math.min(list.length - 1, i + 1))
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setHi((i) => Math.max(0, i - 1))
        } else if (event.key === 'Enter' && open) {
            event.preventDefault()
            if (list[hi]) choose(list[hi])
        } else if (event.key === 'Escape' && open) {
            event.preventDefault()
            onClose()
        }
    }

    return (
        <div ref={wrapRef} className={cn('relative min-w-0', className)}>
            <div
                className={cn(
                    'flex min-h-[84px] items-center gap-4 rounded-2xl border bg-[#081936] px-5 py-3 transition-colors',
                    align === 'to' && 'lg:pl-9',
                    open ? 'border-[#7dd3fc]' : 'border-white/10 hover:border-white/25',
                    error && !open && 'border-[#fca5a5]/70',
                )}
                onClick={() => inputRef.current?.focus()}
            >
                <Icon aria-hidden="true" className="size-5 shrink-0 text-[#7dd3fc]" />
                <div className={cn('min-w-0 flex-1 pr-10', align === 'to' ? 'lg:pr-0' : 'lg:pr-6')}>
                    <label htmlFor={`${uid}-input`} className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                        {label}
                    </label>
                    <div className="relative h-9 overflow-hidden">
                        <AnimatePresence initial={false} mode="popLayout">
                            <motion.span
                                key={value || 'none'}
                                initial={{ y: reduceMotion ? 0 : align === 'from' ? -28 : 28, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: reduceMotion ? 0 : align === 'from' ? 28 : -28, opacity: 0 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                className={cn(
                                    'block text-3xl font-bold leading-9 tracking-tight',
                                    value ? (open ? 'text-[#7dd3fc]' : 'text-white') : 'text-white/25',
                                )}
                            >
                                {value || '———'}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <input
                        ref={inputRef}
                        id={`${uid}-input`}
                        role="combobox"
                        aria-expanded={open}
                        aria-controls={`${uid}-list`}
                        aria-autocomplete="list"
                        aria-activedescendant={open && list[hi] ? `${uid}-opt-${list[hi].code}` : undefined}
                        aria-invalid={Boolean(error)}
                        value={open ? query : airport ? airport.city : ''}
                        placeholder="City or airport"
                        autoComplete="off"
                        className="block w-full min-w-0 truncate bg-transparent text-sm text-white/70 outline-none placeholder:text-white/35"
                        onFocus={(e) => {
                            setQuery(airport ? airport.city : '')
                            setHi(0)
                            onOpen()
                            e.target.select()
                        }}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setHi(0)
                            if (!open) onOpen()
                        }}
                        onKeyDown={onKeyDown}
                    />
                </div>
            </div>
            {error && !open && <p className="mt-1.5 px-1 text-xs font-medium text-[#fca5a5]">{error}</p>}
            <AnimatePresence>
                {open && (
                    <motion.ul
                        id={`${uid}-list`}
                        role="listbox"
                        aria-label={`${label} airports`}
                        initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                        transition={{ duration: 0.16 }}
                        className="absolute inset-x-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-2xl bg-white p-1.5 text-[#0a1f44] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
                    >
                        {list.length === 0 && <li className="px-3 py-3 text-sm text-[#0a1f44]/60">No airports match “{query}”</li>}
                        {list.map((a, i) => (
                            <li
                                key={a.code}
                                id={`${uid}-opt-${a.code}`}
                                role="option"
                                aria-selected={a.code === value}
                                className={cn(
                                    'flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2',
                                    i === hi ? 'bg-[#7dd3fc]/30' : 'hover:bg-[#0a1f44]/5',
                                )}
                                onMouseEnter={() => setHi(i)}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => choose(a)}
                            >
                                <span className="w-11 shrink-0 rounded-md bg-[#0a1f44] py-1 text-center text-xs font-bold tracking-wider text-[#7dd3fc]">
                                    {a.code}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold">{a.city}</span>
                                    <span className="block truncate text-xs text-[#0a1f44]/55">{a.country}</span>
                                </span>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}

export function RouteSwapBookingSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [trip, setTrip] = useState('round')
    const [from, setFrom] = useState('LHR')
    const [to, setTo] = useState('JFK')
    const [openField, setOpenField] = useState(null)
    const [spins, setSpins] = useState(0)
    const [depart, setDepart] = useState('2026-10-14')
    const [ret, setRet] = useState('2026-10-21')
    const [minDate, setMinDate] = useState('2026-10-01')
    const [cabinId, setCabinId] = useState('economy')
    const [pax, setPax] = useState({ adults: 1, children: 0, infants: 0 })
    const [paxOpen, setPaxOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [result, setResult] = useState(null)
    const paxRef = useRef(null)
    const paxButtonRef = useRef(null)

    const cabin = cabins.find((c) => c.id === cabinId)
    const totalPax = pax.adults + pax.children + pax.infants

    useEffect(() => {
        const today = toIso(new Date())
        setMinDate(today)
        setDepart((d) => (d < today ? addDays(today, 14) : d))
        setRet((r) => (r < today ? addDays(today, 21) : r))
    }, [])

    useEffect(() => {
        if (!paxOpen) return undefined
        const onPointer = (event) => {
            if (paxRef.current && !paxRef.current.contains(event.target)) setPaxOpen(false)
        }
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setPaxOpen(false)
                paxButtonRef.current?.focus()
            }
        }
        document.addEventListener('pointerdown', onPointer)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onPointer)
            document.removeEventListener('keydown', onKey)
        }
    }, [paxOpen])

    const closeFrom = useRef(() => setOpenField((f) => (f === 'from' ? null : f))).current
    const closeTo = useRef(() => setOpenField((f) => (f === 'to' ? null : f))).current

    const swap = () => {
        setFrom(to)
        setTo(from)
        setSpins((s) => s + 1)
        setResult(null)
    }

    const setP = (key, value) =>
        setPax((p) => {
            const next = { ...p, [key]: value }
            if (next.infants > next.adults) next.infants = next.adults
            return next
        })

    const onSubmit = (event) => {
        event.preventDefault()
        const next = {}
        if (!from) next.from = 'Choose where you’re flying from'
        if (!to) next.to = 'Choose a destination'
        if (from && to && from === to) next.to = 'Pick a different airport to your origin'
        if (!depart || depart < minDate) next.depart = 'Pick a date from today onwards'
        if (trip === 'round' && (!ret || ret < depart)) next.ret = 'Return can’t be before departure'
        setErrors(next)
        if (Object.keys(next).length) {
            setResult(null)
            return
        }
        setPaxOpen(false)
        setResult({
            from,
            to,
            when: trip === 'round' ? `${niceDate(depart)} – ${niceDate(ret)}` : `${niceDate(depart)} · one-way`,
            who: `${totalPax} passenger${totalPax > 1 ? 's' : ''}`,
            cabin: cabin.label,
            rows: fareRows(from, to, cabin),
            count: 9 + (routeHash(from, to) % 23),
        })
    }

    const dateField =
        'block h-8 w-full min-w-0 bg-transparent text-sm font-semibold text-white outline-none [color-scheme:dark] disabled:opacity-40 sm:text-base'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0a1f44] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_80%_-10%,rgba(125,211,252,0.18),transparent),radial-gradient(40rem_20rem_at_0%_110%,rgba(125,211,252,0.1),transparent)]"
            />
            <svg
                viewBox="0 0 1200 260"
                aria-hidden="true"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 top-6 h-48 w-full md:h-64"
            >
                <motion.path
                    d="M-20 230 C 300 20, 850 -10, 1220 150"
                    fill="none"
                    stroke="#7dd3fc"
                    strokeWidth="1.5"
                    strokeDasharray="2 10"
                    strokeLinecap="round"
                    initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0.5 }}
                    whileInView={{ pathLength: 1, opacity: 0.7 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.2, ease: 'easeInOut' }}
                />
            </svg>

            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#7dd3fc]">
                            <LuPlane aria-hidden="true" className="size-4 -rotate-45" />
                            Skylark Air
                        </p>
                        <h2 className="mt-4 text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">
                            Where to <span className="text-[#7dd3fc]">next?</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-base leading-relaxed text-white/65">
                        112 destinations, lie-flat seats from £1,340 and a 23 kg bag on every fare — even
                        the cheapest.
                    </p>
                </div>

                <form
                    noValidate
                    aria-label="Search flights"
                    className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:p-5 md:mt-14"
                    onSubmit={onSubmit}
                >
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                        <div role="group" aria-label="Trip type" className="relative col-span-2 grid grid-cols-2 rounded-full bg-[#081936] p-1 ring-1 ring-white/10 sm:col-span-1 sm:flex">
                            {[
                                { id: 'oneway', label: 'One-way' },
                                { id: 'round', label: 'Round-trip' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    aria-pressed={trip === t.id}
                                    className={cn(
                                        'relative min-h-10 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]',
                                        trip === t.id ? 'text-[#0a1f44]' : 'text-white/70 hover:text-white',
                                    )}
                                    onClick={() => {
                                        setTrip(t.id)
                                        setResult(null)
                                    }}
                                >
                                    {trip === t.id && (
                                        <motion.span
                                            layoutId={`${uid}-trip`}
                                            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 36 }}
                                            className="absolute inset-0 rounded-full bg-[#7dd3fc]"
                                        />
                                    )}
                                    <span className="relative">{t.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <label htmlFor={`${uid}-cabin`} className="sr-only">
                                Cabin class
                            </label>
                            <select
                                id={`${uid}-cabin`}
                                value={cabinId}
                                className="min-h-12 w-full cursor-pointer appearance-none rounded-full bg-[#081936] pl-4 pr-10 text-sm font-semibold text-white ring-1 ring-white/10 outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
                                onChange={(e) => setCabinId(e.target.value)}
                            >
                                {cabins.map((c) => (
                                    <option key={c.id} value={c.id} className="text-[#0a1f44]">
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                            <HiChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#7dd3fc]" />
                        </div>

                        <div ref={paxRef} className="relative sm:ml-auto">
                            <button
                                ref={paxButtonRef}
                                type="button"
                                aria-haspopup="dialog"
                                aria-expanded={paxOpen}
                                aria-controls={`${uid}-pax`}
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#081936] px-3 text-sm font-semibold text-white ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
                                onClick={() => setPaxOpen((o) => !o)}
                            >
                                <LuUsers aria-hidden="true" className="hidden size-4 text-[#7dd3fc] sm:block" />
                                {totalPax} passenger{totalPax > 1 ? 's' : ''}
                                <HiChevronDown aria-hidden="true" className={cn('size-4 text-[#7dd3fc] transition-transform', paxOpen && 'rotate-180')} />
                            </button>
                            <AnimatePresence>
                                {paxOpen && (
                                    <motion.div
                                        id={`${uid}-pax`}
                                        role="dialog"
                                        aria-label="Passengers"
                                        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                        transition={{ duration: 0.16 }}
                                        className="absolute right-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-3rem))] origin-top-right rounded-2xl bg-white p-4 text-[#0a1f44] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
                                    >
                                        {[
                                            { key: 'adults', label: 'Adults', hint: '12+ years', min: 1, max: 9 },
                                            { key: 'children', label: 'Children', hint: '2 – 11 years', min: 0, max: 8 },
                                            { key: 'infants', label: 'Infants', hint: 'Under 2, on lap', min: 0, max: pax.adults },
                                        ].map((row) => (
                                            <div key={row.key} className="flex items-center justify-between gap-3 border-b border-[#0a1f44]/10 py-3 last:border-0">
                                                <div>
                                                    <p className="text-sm font-semibold text-[#0a1f44]">{row.label}</p>
                                                    <p className="text-xs text-[#0a1f44]/55">{row.hint}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        aria-label={`Fewer ${row.label.toLowerCase()}`}
                                                        disabled={pax[row.key] <= row.min}
                                                        className="grid size-10 place-items-center rounded-full bg-[#0a1f44]/5 text-[#0a1f44] hover:bg-[#7dd3fc]/40 focus-visible:outline-2 focus-visible:outline-[#0a1f44] disabled:cursor-not-allowed disabled:opacity-30"
                                                        onClick={() => setP(row.key, pax[row.key] - 1)}
                                                    >
                                                        <HiMinus aria-hidden="true" className="size-4" />
                                                    </button>
                                                    <span aria-live="polite" className="w-5 text-center font-bold tabular-nums">
                                                        {pax[row.key]}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        aria-label={`More ${row.label.toLowerCase()}`}
                                                        disabled={pax[row.key] >= row.max}
                                                        className="grid size-10 place-items-center rounded-full bg-[#0a1f44]/5 text-[#0a1f44] hover:bg-[#7dd3fc]/40 focus-visible:outline-2 focus-visible:outline-[#0a1f44] disabled:cursor-not-allowed disabled:opacity-30"
                                                        onClick={() => setP(row.key, pax[row.key] + 1)}
                                                    >
                                                        <HiPlus aria-hidden="true" className="size-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="mt-3 min-h-11 w-full rounded-xl bg-[#0a1f44] text-sm font-semibold text-white hover:bg-[#12306a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a1f44]"
                                            onClick={() => {
                                                setPaxOpen(false)
                                                paxButtonRef.current?.focus()
                                            }}
                                        >
                                            Done
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mt-3 grid gap-3 sm:mt-4 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                        <div className="relative grid gap-2 lg:grid-cols-2 lg:gap-4">
                            <AirportField
                                label="From"
                                icon={LuPlaneTakeoff}
                                align="from"
                                value={from}
                                open={openField === 'from'}
                                error={errors.from}
                                className={openField === 'from' ? 'z-30' : 'z-10'}
                                onChange={(code) => {
                                    setFrom(code)
                                    setResult(null)
                                    setErrors((e) => ({ ...e, from: undefined }))
                                }}
                                onOpen={() => setOpenField('from')}
                                onClose={closeFrom}
                            />
                            <AirportField
                                label="To"
                                icon={LuPlaneLanding}
                                align="to"
                                value={to}
                                open={openField === 'to'}
                                error={errors.to}
                                className={openField === 'to' ? 'z-30' : 'z-10'}
                                onChange={(code) => {
                                    setTo(code)
                                    setResult(null)
                                    setErrors((e) => ({ ...e, to: undefined }))
                                }}
                                onOpen={() => setOpenField('to')}
                                onClose={closeTo}
                            />
                            <button
                                type="button"
                                aria-label={`Swap origin and destination${from && to ? ` (${from} and ${to})` : ''}`}
                                className="absolute right-4 top-[66px] z-20 grid size-11 place-items-center rounded-full border border-[#7dd3fc]/50 bg-[#0a1f44] text-[#7dd3fc] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] transition-colors hover:bg-[#7dd3fc] hover:text-[#0a1f44] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc] lg:left-1/2 lg:right-auto lg:top-5 lg:-translate-x-1/2"
                                onClick={swap}
                            >
                                <motion.span
                                    animate={{ rotate: reduceMotion ? 0 : spins * 180 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                    className="grid place-items-center"
                                >
                                    <LuArrowLeftRight aria-hidden="true" className="size-5 rotate-90 lg:rotate-0" />
                                </motion.span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 lg:contents">
                            <div>
                                <div className="flex min-h-[84px] flex-col justify-center rounded-2xl border border-white/10 bg-[#081936] px-4 py-3 focus-within:border-[#7dd3fc] sm:px-5">
                                    <label htmlFor={`${uid}-depart`} className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                                        Depart
                                    </label>
                                    <input
                                        id={`${uid}-depart`}
                                        type="date"
                                        value={depart}
                                        min={minDate}
                                        aria-invalid={Boolean(errors.depart)}
                                        className={dateField}
                                        onChange={(e) => {
                                            setDepart(e.target.value)
                                            if (e.target.value && ret < e.target.value) setRet(e.target.value)
                                        }}
                                    />
                                </div>
                                {errors.depart && <p className="mt-1.5 px-1 text-xs font-medium text-[#fca5a5]">{errors.depart}</p>}
                            </div>
                            <div>
                                <div
                                    className={cn(
                                        'flex min-h-[84px] flex-col justify-center rounded-2xl border border-white/10 bg-[#081936] px-4 py-3 transition-opacity focus-within:border-[#7dd3fc] sm:px-5',
                                        trip === 'oneway' && 'border-dashed opacity-50',
                                    )}
                                >
                                    <label htmlFor={`${uid}-return`} className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                                        Return
                                    </label>
                                    {trip === 'oneway' ? (
                                        <button
                                            type="button"
                                            id={`${uid}-return`}
                                            className="h-8 text-left text-sm font-semibold text-[#7dd3fc] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#7dd3fc]"
                                            onClick={() => setTrip('round')}
                                        >
                                            + Add return
                                        </button>
                                    ) : (
                                        <input
                                            id={`${uid}-return`}
                                            type="date"
                                            value={ret}
                                            min={depart || minDate}
                                            aria-invalid={Boolean(errors.ret)}
                                            className={dateField}
                                            onChange={(e) => setRet(e.target.value)}
                                        />
                                    )}
                                </div>
                                {errors.ret && trip === 'round' && (
                                    <p className="mt-1.5 px-1 text-xs font-medium text-[#fca5a5]">{errors.ret}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="inline-flex min-h-[84px] items-center justify-center gap-2 rounded-2xl bg-[#7dd3fc] px-7 text-base font-bold text-[#0a1f44] transition-colors hover:bg-[#bae6fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]"
                        >
                            Search flights
                            <LuArrowRight aria-hidden="true" className="size-5" />
                        </button>
                    </div>
                </form>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Popular routes</span>
                    {routes.map(([a, b]) => (
                        <button
                            key={`${a}${b}`}
                            type="button"
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm text-white/80 transition-colors hover:border-[#7dd3fc] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]"
                            onClick={() => {
                                setFrom(a)
                                setTo(b)
                                setErrors({})
                                setResult(null)
                            }}
                        >
                            <span className="font-bold tracking-wide">{a}</span>
                            <LuArrowRight aria-hidden="true" className="size-3.5 text-[#7dd3fc]" />
                            <span className="font-bold tracking-wide">{b}</span>
                            <span className="text-white/50">from £{baseFare(a, b)}</span>
                        </button>
                    ))}
                </div>

                <div aria-live="polite">
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-8 rounded-[28px] bg-white p-4 text-[#0a1f44] sm:p-6"
                            >
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                    <p className="text-lg font-bold text-[#0a1f44]">
                                        {result.count} fares · {result.from} → {result.to}
                                    </p>
                                    <p className="text-sm text-[#0a1f44]/60">
                                        {result.when} · {result.who} · {result.cabin}
                                    </p>
                                </div>
                                <ul className="mt-4 divide-y divide-[#0a1f44]/10">
                                    {result.rows.map((row, i) => (
                                        <li key={row.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[1fr_1fr_auto]">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl font-bold tabular-nums text-[#0a1f44]">{row.dep}</span>
                                                <span aria-hidden="true" className="relative h-px w-10 bg-[#0a1f44]/25 sm:w-16">
                                                    <LuPlane className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-45 text-[#0a1f44]/50" />
                                                </span>
                                                <span className="text-xl font-bold tabular-nums text-[#0a1f44]">{row.arr}</span>
                                            </div>
                                            <p className="col-start-1 text-sm text-[#0a1f44]/60 sm:col-start-auto">
                                                {row.duration} · {row.stops}
                                            </p>
                                            <div className="col-start-2 row-span-2 row-start-1 text-right sm:col-start-auto sm:row-span-1 sm:row-start-auto">
                                                {i === 1 && (
                                                    <span className="mb-1 inline-block rounded-full bg-[#7dd3fc]/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0a1f44]">
                                                        Cheapest
                                                    </span>
                                                )}
                                                <p className="text-2xl font-bold text-[#0a1f44]">£{row.price.toLocaleString('en-GB')}</p>
                                                <p className="text-xs text-[#0a1f44]/55">per adult</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default RouteSwapBookingSearch

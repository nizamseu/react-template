// TableReservationBookingSearch

// BookingSearch03 · Booking & Reservations › Search / Booking Engine

// Description:
// A candle-lit table reservation block for the fictional Marylebone restaurant Saffron
// Room. Beside a photo of the dining room and the serif heading "Reserve a table by
// candlelight." sits a four-step card: pick one of the next seven days, set the party
// size, choose a seating and an evening time, then "Reserve table" confirms with a
// reference number. Use it on a restaurant homepage or a dedicated reservations page.

// Design:
// - Deep burgundy #4a0e1a section, cream #f5ecd9 text, antique gold #c9a45c hairlines,
//   numerals and CTA; a faint gold sunburst SVG sits behind the card
// - Serif display heading (text-4xl → lg:text-6xl) with italic gold word; step titles use
//   italic serif roman numerals; body copy in sans; card has a double gold hairline frame
// - Date chips (weekday, big serif day, month) — 7 columns from sm, a snap row on
//   mobile; Mondays render as "Closed"; time grid 3 → sm:5 columns; booked slots are
//   struck through, "last table" slots carry a gold dot
// - Layout: stacked at base, lg:grid-cols-[5fr_7fr] with the photo (16:10 → lg 4:5) and
//   details list on the left and the sticky card on the right
// - framer-motion: form ↔ confirmation cross-fade, gold selection pill on the time grid
//   (layoutId), gentle slide on entry; transforms are removed for reduced motion

// What it does:
// - The seven dates start from a fixed Wed 14 Oct 2026 on the server and are rebuilt from
//   the real "today" in useEffect; the first open day is preselected
// - Party stepper (1 – 10) and Dining room / Chef’s counter seating (counter max 4)
//   feed a deterministic availability model: weekends, prime time and big parties book
//   up first; a selected slot that becomes unavailable is cleared
// - "Reserve table" validates that a time is chosen, then swaps in a confirmation with
//   a reference like "SR-1016-219"; "Change booking" returns to the form; the "Call us"
//   link points to #saffron-call

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TableReservationBookingSearch from '@/TestComponent/PageSections/booking/BookingSearch03';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <TableReservationBookingSearch />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiMinus, HiPlus } from 'react-icons/hi2';
import { LuChefHat, LuClock, LuMapPin, LuPhone, LuWine } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const PHOTO = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]
const TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']
const FIXED_START = [2026, 9, 14]

const details = [
    { icon: LuClock, label: 'Tuesday – Sunday', value: '17:30 – 23:00, last seating 22:00' },
    { icon: LuChefHat, label: 'Tasting menu', value: '£95 · seven courses, saffron to finish' },
    { icon: LuWine, label: 'Cellar pairing', value: '£65 · or by the glass from £9' },
    { icon: LuMapPin, label: '14 Aubrey Mews', value: 'Marylebone, London W1U 4QX' },
]

function buildDays([y, m, d]) {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(y, m, d + i)
        return {
            key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            dow: date.getDay(),
            day: date.getDate(),
            month: date.getMonth(),
            closed: date.getDay() === 1,
            label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAYS[date.getDay()],
        }
    })
}

function slotState(day, slotIndex, party, seating) {
    if (!day || day.closed) return 'full'
    const busy = day.dow === 5 || day.dow === 6 ? 2 : 0
    const prime = slotIndex >= 3 && slotIndex <= 6 ? 2 : 0
    const big = party > 6 ? 3 : party > 4 ? 2 : party > 2 ? 1 : 0
    const seed = (day.day * 31 + slotIndex * 17 + party * 7 + (seating === 'counter' ? 11 : 0)) % 13
    const score = seed + busy + prime + big
    if (score >= 12) return 'full'
    if (score >= 10) return 'last'
    return 'open'
}

const firstOpen = (days) => Math.max(0, days.findIndex((d) => !d.closed))

export function TableReservationBookingSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [days, setDays] = useState(() => buildDays(FIXED_START))
    const [dayIndex, setDayIndex] = useState(() => firstOpen(buildDays(FIXED_START)))
    const [party, setParty] = useState(2)
    const [seating, setSeating] = useState('dining')
    const [time, setTime] = useState(null)
    const [error, setError] = useState('')
    const [confirmed, setConfirmed] = useState(null)

    useEffect(() => {
        const now = new Date()
        const next = buildDays([now.getFullYear(), now.getMonth(), now.getDate()])
        setDays(next)
        setDayIndex(firstOpen(next))
    }, [])

    const day = days[dayIndex]
    const states = TIMES.map((_, i) => slotState(day, i, party, seating))
    const openCount = states.filter((s) => s !== 'full').length
    const selectedState = time === null ? null : states[TIMES.indexOf(time)]

    useEffect(() => {
        if (selectedState === 'full') setTime(null)
    }, [selectedState])

    const changeParty = (value) => {
        const next = Math.min(10, Math.max(1, value))
        setParty(next)
        if (next > 4 && seating === 'counter') setSeating('dining')
    }

    const onReserve = (event) => {
        event.preventDefault()
        if (!time) {
            setError('Choose a time to continue')
            return
        }
        setError('')
        setConfirmed({
            ref: `SR-${String(day.month + 1).padStart(2, '0')}${String(day.day).padStart(2, '0')}-${party}${time.replace(':', '').slice(0, 2)}`,
            date: `${DAYS_LONG[day.dow]} ${day.day} ${MONTHS_LONG[day.month]}`,
            time,
            party,
            seating: seating === 'counter' ? 'Chef’s counter' : 'Dining room',
        })
    }

    const stepTitle = 'flex items-baseline gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f5ecd9]'
    const numeral = 'font-serif text-lg normal-case italic tracking-normal text-[#c9a45c]'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#4a0e1a] px-4 py-16 text-base font-normal text-[#f5ecd9] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <svg
                viewBox="0 0 400 400"
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 top-1/2 h-[46rem] w-[46rem] max-w-none -translate-y-1/2 text-[#c9a45c] opacity-[0.07]"
            >
                {Array.from({ length: 36 }, (_, i) => (
                    <line
                        key={i}
                        x1="200"
                        y1="200"
                        x2={200 + 200 * Math.cos((i * Math.PI) / 18)}
                        y2={200 + 200 * Math.sin((i * Math.PI) / 18)}
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                ))}
                <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>

            <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
                <div>
                    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c9a45c]">
                        <span aria-hidden="true" className="h-px w-8 bg-[#c9a45c]" />
                        Saffron Room · Est. 2014
                    </p>
                    <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#f5ecd9] sm:text-5xl lg:text-6xl">
                        Reserve a table by <em className="text-[#c9a45c]">candlelight.</em>
                    </h2>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-[#f5ecd9]/70">
                        Forty covers, one open kitchen and a menu that follows the saffron harvest from
                        La Mancha to Pampore. Tables are released 30 days ahead at noon.
                    </p>

                    <div className="relative mt-8">
                        <img
                            src={PHOTO}
                            alt="Dim, modern dining room with dark wood tables and warm pendant lights"
                            loading="lazy"
                            className="aspect-[16/10] w-full object-cover lg:aspect-[4/5]"
                        />
                        <span aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#c9a45c]/60" />
                        <span className="absolute bottom-6 left-6 bg-[#4a0e1a]/90 px-3 py-2 font-serif text-sm italic text-[#f5ecd9]">
                            Michelin Guide 2026 · Bib Gourmand
                        </span>
                    </div>

                    <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                        {details.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex gap-3 border-t border-[#c9a45c]/30 pt-4">
                                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#c9a45c]" />
                                <div>
                                    <dt className="text-sm font-semibold text-[#f5ecd9]">{label}</dt>
                                    <dd className="mt-0.5 text-sm text-[#f5ecd9]/65">{value}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="relative self-start border border-[#c9a45c]/70 p-1.5 lg:sticky lg:top-8">
                    <div className="border border-[#c9a45c]/30 bg-[#3d0b15] p-5 sm:p-8">
                        <AnimatePresence mode="wait" initial={false}>
                            {confirmed ? (
                                <motion.div
                                    key="done"
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex min-h-[32rem] flex-col items-center justify-center text-center"
                                    role="status"
                                >
                                    <span className="grid size-20 place-items-center rounded-full border border-[#c9a45c] font-serif text-2xl italic text-[#c9a45c] outline outline-1 outline-offset-4 outline-[#c9a45c]/40">
                                        SR
                                    </span>
                                    <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c9a45c]">
                                        Table reserved
                                    </p>
                                    <h3 className="mt-3 font-serif text-3xl font-normal text-[#f5ecd9] sm:text-4xl">
                                        We’ll light a candle for you.
                                    </h3>
                                    <dl className="mt-8 grid w-full max-w-sm grid-cols-2 gap-px bg-[#c9a45c]/30 text-left">
                                        {[
                                            ['Date', confirmed.date],
                                            ['Time', confirmed.time],
                                            ['Party', `${confirmed.party} guest${confirmed.party > 1 ? 's' : ''}`],
                                            ['Seating', confirmed.seating],
                                        ].map(([k, v]) => (
                                            <div key={k} className="bg-[#3d0b15] p-4">
                                                <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f5ecd9]/55">
                                                    {k}
                                                </dt>
                                                <dd className="mt-1 font-serif text-lg text-[#f5ecd9]">{v}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <p className="mt-6 text-sm text-[#f5ecd9]/65">
                                        Reference <span className="font-mono font-semibold text-[#c9a45c]">{confirmed.ref}</span> ·
                                        held for 15 minutes past your time
                                    </p>
                                    <button
                                        type="button"
                                        className="mt-8 min-h-11 border-b border-[#c9a45c] px-1 text-sm font-semibold uppercase tracking-[0.2em] text-[#f5ecd9] transition-colors hover:text-[#c9a45c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a45c]"
                                        onClick={() => setConfirmed(null)}
                                    >
                                        Change booking
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    noValidate
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                                    transition={{ duration: 0.3 }}
                                    aria-label="Reserve a table"
                                    onSubmit={onReserve}
                                >
                                    <fieldset>
                                        <legend className={stepTitle}>
                                            <span className={numeral}>i.</span> Choose a date
                                        </legend>
                                        <div className="-mx-1 mt-4 flex snap-x gap-2 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-7 sm:overflow-visible sm:pb-0">
                                            {days.map((d, i) => {
                                                const selected = i === dayIndex
                                                return (
                                                    <button
                                                        key={d.key}
                                                        type="button"
                                                        disabled={d.closed}
                                                        aria-pressed={selected}
                                                        aria-label={`${DAYS_LONG[d.dow]} ${d.day} ${MONTHS_LONG[d.month]}${d.closed ? ', closed' : ''}`}
                                                        className={cn(
                                                            'flex min-h-[92px] w-[4.5rem] shrink-0 snap-start flex-col items-center justify-center gap-0.5 border px-1 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a45c] sm:w-auto',
                                                            selected
                                                                ? 'border-[#c9a45c] bg-[#c9a45c] text-[#3d0b15]'
                                                                : 'border-[#f5ecd9]/15 text-[#f5ecd9] hover:border-[#c9a45c]/70',
                                                            d.closed && 'cursor-not-allowed border-dashed opacity-40 hover:border-[#f5ecd9]/15',
                                                        )}
                                                        onClick={() => {
                                                            setDayIndex(i)
                                                            setError('')
                                                        }}
                                                    >
                                                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                                                            {d.label}
                                                        </span>
                                                        <span className="font-serif text-2xl leading-none">{d.day}</span>
                                                        <span className="text-[10px] uppercase tracking-[0.14em] opacity-75">
                                                            {d.closed ? 'Closed' : MONTHS[d.month]}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </fieldset>

                                    <div className="mt-8 grid gap-8 sm:grid-cols-2">
                                        <fieldset>
                                            <legend className={stepTitle}>
                                                <span className={numeral}>ii.</span> Party size
                                            </legend>
                                            <div className="mt-4 flex items-center justify-between border border-[#f5ecd9]/15 p-1.5">
                                                <button
                                                    type="button"
                                                    aria-label="Fewer guests"
                                                    disabled={party <= 1}
                                                    className="grid size-11 place-items-center text-[#f5ecd9] transition-colors hover:bg-[#f5ecd9]/10 focus-visible:outline-2 focus-visible:outline-[#c9a45c] disabled:cursor-not-allowed disabled:opacity-30"
                                                    onClick={() => changeParty(party - 1)}
                                                >
                                                    <HiMinus aria-hidden="true" className="size-4" />
                                                </button>
                                                <p aria-live="polite" className="text-center">
                                                    <span className="font-serif text-3xl leading-none text-[#f5ecd9]">{party}</span>
                                                    <span className="ml-2 text-sm text-[#f5ecd9]/65">
                                                        guest{party > 1 ? 's' : ''}
                                                    </span>
                                                </p>
                                                <button
                                                    type="button"
                                                    aria-label="More guests"
                                                    disabled={party >= 10}
                                                    className="grid size-11 place-items-center text-[#f5ecd9] transition-colors hover:bg-[#f5ecd9]/10 focus-visible:outline-2 focus-visible:outline-[#c9a45c] disabled:cursor-not-allowed disabled:opacity-30"
                                                    onClick={() => changeParty(party + 1)}
                                                >
                                                    <HiPlus aria-hidden="true" className="size-4" />
                                                </button>
                                            </div>
                                            <p className="mt-2 text-xs text-[#f5ecd9]/55">
                                                {party >= 9 ? 'Nine or ten? We’ll seat you in the Salon on the set menu.' : 'Up to 10 online · larger groups, please call.'}
                                            </p>
                                        </fieldset>

                                        <fieldset>
                                            <legend className={stepTitle}>
                                                <span className={numeral}>iii.</span> Seating
                                            </legend>
                                            <div className="mt-4 grid grid-cols-2 border border-[#f5ecd9]/15 p-1.5">
                                                {[
                                                    { id: 'dining', label: 'Dining room' },
                                                    { id: 'counter', label: 'Chef’s counter' },
                                                ].map((option) => {
                                                    const locked = option.id === 'counter' && party > 4
                                                    return (
                                                        <button
                                                            key={option.id}
                                                            type="button"
                                                            aria-pressed={seating === option.id}
                                                            disabled={locked}
                                                            className={cn(
                                                                'min-h-11 px-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#c9a45c]',
                                                                seating === option.id
                                                                    ? 'bg-[#f5ecd9] text-[#3d0b15]'
                                                                    : 'text-[#f5ecd9]/75 hover:text-[#f5ecd9]',
                                                                locked && 'cursor-not-allowed opacity-35',
                                                            )}
                                                            onClick={() => setSeating(option.id)}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                            <p className="mt-2 text-xs text-[#f5ecd9]/55">
                                                The counter seats up to 4 and watches the pass.
                                            </p>
                                        </fieldset>
                                    </div>

                                    <fieldset className="mt-8">
                                        <legend className={stepTitle}>
                                            <span className={numeral}>iv.</span> Evening time
                                        </legend>
                                        <p className="mt-2 text-xs text-[#f5ecd9]/55">
                                            {openCount} of {TIMES.length} times free for {party} on {day ? `${DAYS_LONG[day.dow]} ${day.day} ${MONTHS[day.month]}` : ''}
                                        </p>
                                        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                                            {TIMES.map((t, i) => {
                                                const state = states[i]
                                                const selected = time === t
                                                return (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        disabled={state === 'full'}
                                                        aria-pressed={selected}
                                                        aria-label={`${t}${state === 'full' ? ', fully booked' : state === 'last' ? ', last table' : ''}`}
                                                        className={cn(
                                                            'relative isolate min-h-12 border text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a45c]',
                                                            state === 'full'
                                                                ? 'cursor-not-allowed border-transparent bg-[#f5ecd9]/[0.04] text-[#f5ecd9]/30 line-through'
                                                                : selected
                                                                  ? 'border-[#c9a45c] text-[#3d0b15]'
                                                                  : 'border-[#f5ecd9]/20 text-[#f5ecd9] hover:border-[#c9a45c]',
                                                        )}
                                                        onClick={() => {
                                                            setTime(t)
                                                            setError('')
                                                        }}
                                                    >
                                                        {selected && (
                                                            <motion.span
                                                                layoutId={`${uid}-slot`}
                                                                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }}
                                                                className="absolute inset-0 -z-10 bg-[#c9a45c]"
                                                            />
                                                        )}
                                                        {t}
                                                        {state === 'last' && (
                                                            <span
                                                                aria-hidden="true"
                                                                className={cn(
                                                                    'absolute right-1.5 top-1.5 size-1.5 rounded-full',
                                                                    selected ? 'bg-[#3d0b15]' : 'bg-[#c9a45c]',
                                                                )}
                                                            />
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#f5ecd9]/55">
                                            <span className="inline-flex items-center gap-1.5">
                                                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#c9a45c]" /> Last table
                                            </span>
                                            <span className="line-through">19:30</span> Fully booked
                                        </p>
                                    </fieldset>

                                    <div className="mt-8 flex flex-col gap-4 border-t border-[#c9a45c]/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                        <div aria-live="polite" className="min-h-5 text-sm">
                                            {error ? (
                                                <p className="font-semibold text-[#f3a6a6]">{error}</p>
                                            ) : time ? (
                                                <p className="text-[#f5ecd9]/80">
                                                    {party} · {day && `${DAYS[day.dow]} ${day.day} ${MONTHS[day.month]}`} · {time}
                                                </p>
                                            ) : (
                                                <a
                                                    href="#saffron-call"
                                                    className="inline-flex min-h-10 items-center gap-2 text-[#f5ecd9]/70 underline-offset-4 hover:text-[#f5ecd9] hover:underline focus-visible:outline-2 focus-visible:outline-[#c9a45c]"
                                                >
                                                    <LuPhone aria-hidden="true" className="size-4" /> Call us · 020 7946 0321
                                                </a>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            className="min-h-12 bg-[#c9a45c] px-8 text-sm font-bold uppercase tracking-[0.22em] text-[#3d0b15] transition-colors hover:bg-[#dcbb78] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a45c]"
                                        >
                                            Reserve table
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TableReservationBookingSearch

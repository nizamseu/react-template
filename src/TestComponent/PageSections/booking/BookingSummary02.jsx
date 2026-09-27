// CheckoutStepperBookingSummary

// BookingSummary02 · Booking & Reservations › Booking Summary & Add-ons

// Description:
// A three-step airline checkout for Skylark Air flight SK 318, Seattle (SEA) → Honolulu
// (HNL) on Thu 22 Oct 2026 for two passengers. Step 1 "Add-ons" has a seat map, checked
// bags, priority boarding and breakfast; step 2 "Passenger details" collects names,
// dates of birth and contact info; step 3 "Confirm" reviews everything behind a
// fare-rules checkbox and "Pay …", ending with a booking reference. Use it as the
// checkout of a flight booking.

// Design:
// - Navy #0a1f44 section with a #0f2957 step panel (white/10 borders,
//   rounded-[1.75rem]) and a sky #7dd3fc summary card with navy text; lg grid
//   minmax(0,1fr) + 360px sticky rail
// - Header: flight strip SEA ─ ✈ ─ HNL with a dashed route line, times in font-mono,
//   and a numbered stepper (sky progress bar, check marks for finished steps)
// - Seat map drawn in markup: rounded nose, A–C | row number | D–F, 40px seats coloured
//   by price band (extra legroom / front / standard / taken) with a legend
// - Inputs: dark navy wells, 44px tall, sky focus rings, red #fca5a5 messages; semibold
//   tight headings (text-3xl → lg:text-5xl)
// - Motion: steps slide in the direction of travel, the progress bar grows, totals and
//   the booking reference animate in; reduced motion drops the offsets

// What it does:
// - State: step (0–2), seats per passenger (+ active passenger), "assign at check-in",
//   bag count, priority/breakfast toggles, passenger + contact fields, errors, rules
//   checkbox, payment status and the reference. Finished steps can be revisited from
//   the stepper
// - Totals come from state: 2 × $289 fare + 2 × $48.60 taxes + seat prices + bags × $35
//   + 2 × $12 priority + 2 × $14 breakfast; each line shows its maths in the sky rail
// - "Continue" validates each step (2 seats or check-in assignment; names, DOB before
//   the flight with the lead passenger 18+, email, phone; rules accepted). "Pay" shows
//   a 1.1 s processing state (timer cleared on unmount) then the confirmation; "Book
//   another trip" resets. Headings receive focus on step change; links point to
//   #skylark-fare-rules

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CheckoutStepperBookingSummary from '@/TestComponent/PageSections/booking/BookingSummary02';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <CheckoutStepperBookingSummary />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiCheck, HiExclamationCircle, HiMinus, HiPlus } from 'react-icons/hi2';
import { LuCoffee, LuLuggage, LuPlane, LuTimer } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const PAX = 2
const FARE = 289
const TAXES = 48.6
const BAG_PRICE = 35
const MAX_BAGS = 4
const PRIORITY_PRICE = 12
const MEAL_PRICE = 14
const FLIGHT_DATE = '2026-10-22'
const ADULT_CUTOFF = '2008-10-22'

const steps = ['Add-ons', 'Passengers', 'Confirm']
const SEAT_ROWS = [12, 13, 14, 15, 16, 17]
const LEFT = ['A', 'B', 'C']
const RIGHT = ['D', 'E', 'F']
const TAKEN = new Set(['12B', '12C', '13A', '13E', '14D', '14F', '15B', '15F', '16A', '16C', '16D', '17E', '17F'])

const bands = {
    legroom: { label: 'Extra legroom', price: 42, cls: 'bg-[#f5c451] text-[#0a1f44] hover:bg-[#ffd873]' },
    front: { label: 'Up front', price: 22, cls: 'bg-[#7dd3fc] text-[#0a1f44] hover:bg-[#a5e3ff]' },
    standard: { label: 'Standard', price: 16, cls: 'bg-[#2f5da8] text-white hover:bg-[#3b6fc4]' },
}

const bandOf = (seat) => {
    const row = Number.parseInt(seat, 10)
    if (row === 12) return 'legroom'
    if (row <= 14) return 'front'
    return 'standard'
}

const round2 = (n) => Math.round(n * 100) / 100

function money(n) {
    const [int, dec] = round2(n).toFixed(2).split('.')
    return `$${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`
}

function makeRef(seed) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let h = 2166136261
    for (const c of seed) {
        h ^= c.charCodeAt(0)
        h = Math.imul(h, 16777619)
    }
    let out = ''
    for (let i = 0; i < 6; i += 1) {
        out += chars[(h >>> 0) % chars.length]
        h = Math.imul(h ^ (h >>> 13), 0x5bd1e995)
    }
    return out
}

const emptyPax = () => ({ first: '', last: '', dob: '' })
const NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validateDetails(pax, contact) {
    const e = {}
    pax.forEach((p, i) => {
        if (!p.first.trim()) e[`p${i}-first`] = 'Enter the first name as on the passport.'
        else if (!NAME_RE.test(p.first.trim())) e[`p${i}-first`] = 'Use letters, spaces, hyphens or apostrophes.'
        if (!p.last.trim()) e[`p${i}-last`] = 'Enter the last name as on the passport.'
        else if (!NAME_RE.test(p.last.trim())) e[`p${i}-last`] = 'Use letters, spaces, hyphens or apostrophes.'
        if (!p.dob) e[`p${i}-dob`] = 'Enter a date of birth.'
        else if (p.dob < '1900-01-01' || p.dob >= FLIGHT_DATE) e[`p${i}-dob`] = 'Date of birth must be before 22 Oct 2026.'
        else if (i === 0 && p.dob > ADULT_CUTOFF) e[`p${i}-dob`] = 'The lead passenger must be 18+ on the day of travel.'
    })
    if (!EMAIL_RE.test(contact.email.trim())) e.email = 'Enter an email like name@example.com.'
    if (contact.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a phone number with at least 7 digits.'
    return e
}

const inputCls = (error) =>
    cn(
        'mt-1.5 h-11 w-full rounded-xl border bg-[#0a1f44] px-3.5 text-sm text-white placeholder:text-white/35 [color-scheme:dark] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7dd3fc]',
        error ? 'border-[#fca5a5]' : 'border-white/15',
    )

function FieldError({ id, message }) {
    if (!message) return null
    return (
        <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-[#fca5a5]">
            <HiExclamationCircle aria-hidden="true" className="shrink-0" />
            {message}
        </p>
    )
}

export function CheckoutStepperBookingSummary({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduce = useReducedMotion()
    const [[step, dir], setStepState] = useState([0, 1])
    const [seats, setSeats] = useState([null, null])
    const [activePax, setActivePax] = useState(0)
    const [skipSeats, setSkipSeats] = useState(false)
    const [bags, setBags] = useState(1)
    const [priority, setPriority] = useState(false)
    const [meal, setMeal] = useState(true)
    const [pax, setPax] = useState([emptyPax(), emptyPax()])
    const [contact, setContact] = useState({ email: '', phone: '' })
    const [rules, setRules] = useState(false)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle')
    const [reference, setReference] = useState('')
    const moved = useRef(false)
    const timerRef = useRef(null)

    useEffect(() => () => clearTimeout(timerRef.current), [])

    // Headings mount after the step transition; move focus to them once the user has
    // navigated (never on first render).
    const focusHeading = useCallback((node) => {
        if (node && moved.current) node.focus({ preventScroll: true })
    }, [])

    const seatTotal = seats.reduce((sum, s) => sum + (s && !skipSeats ? bands[bandOf(s)].price : 0), 0)
    const lines = [
        { key: 'fare', label: 'Classic fare', maths: `${PAX} × ${money(FARE)}`, amount: PAX * FARE },
        { key: 'tax', label: 'Taxes & airport fees', maths: `${PAX} × ${money(TAXES)}`, amount: PAX * TAXES },
        {
            key: 'seats',
            label: 'Seats',
            maths: skipSeats
                ? 'Assigned free at check-in'
                : seats.some(Boolean)
                  ? seats.map((s) => (s ? `${s} $${bands[bandOf(s)].price}` : 'not chosen')).join(' + ')
                  : 'None chosen yet',
            amount: seatTotal,
        },
        { key: 'bags', label: 'Checked bags (23 kg)', maths: `${bags} × ${money(BAG_PRICE)}`, amount: bags * BAG_PRICE },
    ]
    if (priority) {
        lines.push({
            key: 'priority',
            label: 'Priority boarding',
            maths: `${PAX} × ${money(PRIORITY_PRICE)}`,
            amount: PAX * PRIORITY_PRICE,
        })
    }
    if (meal) {
        lines.push({ key: 'meal', label: 'Hot breakfast', maths: `${PAX} × ${money(MEAL_PRICE)}`, amount: PAX * MEAL_PRICE })
    }
    const total = round2(lines.reduce((sum, l) => sum + l.amount, 0))

    const go = (target) => {
        moved.current = true
        setErrors({})
        setStepState([target, target > step ? 1 : -1])
    }

    const pickSeat = (seat) => {
        setSkipSeats(false)
        setErrors({})
        const owner = seats.indexOf(seat)
        const next = [...seats]
        if (owner === activePax) {
            next[activePax] = null
            setSeats(next)
            return
        }
        if (owner >= 0) next[owner] = null
        next[activePax] = seat
        setSeats(next)
        const other = activePax === 0 ? 1 : 0
        if (!next[other]) setActivePax(other)
    }

    const next = () => {
        if (step === 0) {
            if (!skipSeats && seats.some((s) => !s)) {
                setErrors({ seats: 'Choose a seat for both passengers, or let us assign seats at check-in.' })
                return
            }
            go(1)
        } else if (step === 1) {
            const e = validateDetails(pax, contact)
            setErrors(e)
            const first = Object.keys(e)[0]
            if (first) {
                document.getElementById(`${uid}-${first}`)?.focus()
                return
            }
            go(2)
        }
    }

    const pay = (event) => {
        event.preventDefault()
        if (!rules) {
            setErrors({ rules: 'Please accept the fare rules to continue.' })
            return
        }
        setErrors({})
        setStatus('processing')
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            moved.current = true
            setReference(makeRef(`${pax[0].last}${pax[1].last}${seats.join('')}${total}`))
            setStatus('done')
        }, 1100)
    }

    const reset = () => {
        moved.current = true
        setSeats([null, null])
        setActivePax(0)
        setSkipSeats(false)
        setBags(1)
        setPriority(false)
        setMeal(true)
        setPax([emptyPax(), emptyPax()])
        setContact({ email: '', phone: '' })
        setRules(false)
        setErrors({})
        setReference('')
        setStatus('idle')
        setStepState([0, -1])
    }

    const setPaxField = (i, field, value) =>
        setPax((list) => list.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)))

    const slide = {
        initial: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 48 }),
        animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
        exit: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -32, transition: { duration: 0.2 } }),
    }

    const done = status === 'done'
    const progress = done ? 1 : step / (steps.length - 1)

    const renderSeat = (col, row) => {
        const seat = `${row}${col}`
        const taken = TAKEN.has(seat)
        const owner = seats.indexOf(seat)
        const band = bands[bandOf(seat)]
        return (
            <button
                key={seat}
                type="button"
                disabled={taken}
                aria-pressed={owner >= 0}
                aria-label={
                    taken
                        ? `Seat ${seat}, taken`
                        : `Seat ${seat}, ${band.label}, $${band.price}${owner >= 0 ? `, passenger ${owner + 1}` : ''}`
                }
                className={cn(
                    'relative grid h-10 w-10 place-items-center rounded-t-xl rounded-b-md text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                    taken ? 'cursor-not-allowed bg-white/10 text-white/25' : band.cls,
                    owner >= 0 && 'bg-white text-[#0a1f44] ring-2 ring-[#7dd3fc] ring-offset-2 ring-offset-[#0f2957] hover:bg-white',
                )}
                onClick={() => pickSeat(seat)}
            >
                {taken ? '×' : owner >= 0 ? `P${owner + 1}` : col}
            </button>
        )
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0a1f44] px-4 py-14 text-base font-normal text-[#e6eefb] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#7dd3fc]/10 blur-3xl"
            />
            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#7dd3fc]">
                            Skylark Air · Checkout
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                            Almost wheels-up.
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 sm:gap-5 sm:px-5">
                        <div>
                            <p className="font-mono text-2xl font-semibold text-white">SEA</p>
                            <p className="font-mono text-xs text-white/55">07:40</p>
                        </div>
                        <div className="relative flex min-w-20 flex-1 items-center sm:min-w-32">
                            <span className="h-px flex-1 border-t border-dashed border-[#7dd3fc]/60" />
                            <LuPlane aria-hidden="true" className="mx-1 h-4 w-4 rotate-45 text-[#7dd3fc]" />
                            <span className="h-px flex-1 border-t border-dashed border-[#7dd3fc]/60" />
                            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-white/45">
                                6h 15m
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-2xl font-semibold text-white">HNL</p>
                            <p className="font-mono text-xs text-white/55">10:55</p>
                        </div>
                        <div className="hidden border-l border-white/10 pl-5 text-xs leading-5 text-white/60 sm:block">
                            SK 318 · A321neo
                            <br />
                            Thu 22 Oct 2026
                        </div>
                    </div>
                </div>

                <nav aria-label="Checkout progress" className="mt-10">
                    <div className="relative">
                        <div aria-hidden="true" className="absolute left-5 right-5 top-5 h-0.5 rounded-full bg-white/10">
                            <motion.div
                                className="h-full origin-left rounded-full bg-[#7dd3fc]"
                                initial={false}
                                animate={{ scaleX: progress }}
                                transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                        <ol className="relative grid grid-cols-3">
                            {steps.map((label, i) => {
                                const complete = done || i < step
                                const current = !done && i === step
                                return (
                                    <li
                                        key={label}
                                        className={cn(
                                            'flex',
                                            i === 0 ? 'justify-start' : i === 2 ? 'justify-end' : 'justify-center',
                                        )}
                                    >
                                        <button
                                            type="button"
                                            disabled={!complete || done || status === 'processing'}
                                            aria-current={current ? 'step' : undefined}
                                            className="group flex flex-col items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7dd3fc] disabled:cursor-default"
                                            onClick={() => go(i)}
                                        >
                                            <span
                                                className={cn(
                                                    'grid h-10 w-10 place-items-center rounded-full border-2 font-mono text-sm font-semibold transition-colors',
                                                    complete && 'border-[#7dd3fc] bg-[#7dd3fc] text-[#0a1f44]',
                                                    current && 'border-[#7dd3fc] bg-[#0a1f44] text-[#7dd3fc]',
                                                    !complete && !current && 'border-white/20 bg-[#0a1f44] text-white/40',
                                                )}
                                            >
                                                {complete ? <HiCheck aria-hidden="true" /> : i + 1}
                                            </span>
                                            <span
                                                className={cn(
                                                    'text-xs sm:text-sm',
                                                    current || complete ? 'text-white' : 'text-white/45',
                                                    complete && !done && 'group-hover:underline',
                                                )}
                                            >
                                                {label}
                                                {complete ? <span className="sr-only"> (completed, edit)</span> : null}
                                            </span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                </nav>

                <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
                    <div className="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0f2957] p-3 sm:p-7 lg:p-8">
                        <AnimatePresence mode="wait" initial={false} custom={dir}>
                            {done ? (
                                <motion.div
                                    key="done"
                                    custom={dir}
                                    variants={slide}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="py-4 text-center sm:py-10"
                                >
                                    <motion.span
                                        initial={reduce ? false : { scale: 0.4, rotate: -30 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                                        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#7dd3fc] text-3xl text-[#0a1f44]"
                                    >
                                        <HiCheck aria-hidden="true" />
                                    </motion.span>
                                    <h3
                                        ref={focusHeading}
                                        tabIndex={-1}
                                        className="mt-5 text-2xl font-semibold tracking-tight text-white outline-none sm:text-3xl"
                                    >
                                        You&apos;re booked, {pax[0].first.trim()}.
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/65">
                                        Tickets for {pax[0].first.trim()} and {pax[1].first.trim()} are on their way to{' '}
                                        {contact.email.trim()}. Online check-in opens Wed 21 Oct at 07:40.
                                    </p>
                                    <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-2xl border border-dashed border-[#7dd3fc]/50 px-6 py-4 sm:px-10">
                                        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/50">
                                            Booking reference
                                        </span>
                                        <span className="mt-1 font-mono text-3xl font-semibold tracking-[0.3em] text-[#7dd3fc] sm:text-4xl">
                                            {reference}
                                        </span>
                                    </div>
                                    <p className="mt-4 font-mono text-sm text-white/70">Paid {money(total)}</p>
                                    <button
                                        type="button"
                                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]"
                                        onClick={reset}
                                    >
                                        Book another trip
                                    </button>
                                </motion.div>
                            ) : step === 0 ? (
                                <motion.div
                                    key="addons"
                                    custom={dir}
                                    variants={slide}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <h3
                                        ref={focusHeading}
                                        tabIndex={-1}
                                        className="text-xl font-semibold tracking-tight text-white outline-none sm:text-2xl"
                                    >
                                        Seats, bags & extras
                                    </h3>
                                    <div className="mt-6 grid gap-8 xl:grid-cols-[21rem_minmax(0,1fr)]">
                                        <div className="min-w-0">
                                            <div role="group" aria-label="Choose whose seat to pick" className="flex flex-wrap gap-2">
                                                {[0, 1].map((i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        aria-pressed={activePax === i}
                                                        className={cn(
                                                            'inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]',
                                                            activePax === i
                                                                ? 'border-[#7dd3fc] bg-[#7dd3fc]/15 text-white'
                                                                : 'border-white/15 text-white/70 hover:border-white/35',
                                                        )}
                                                        onClick={() => setActivePax(i)}
                                                    >
                                                        Passenger {i + 1}
                                                        <span className="font-mono text-xs text-[#7dd3fc]">
                                                            {seats[i] && !skipSeats ? seats[i] : '—'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="mt-4 w-fit rounded-t-[7rem] rounded-b-3xl border border-white/10 bg-[#0a1f44] px-2 pb-4 pt-12 sm:px-5">
                                                <div role="group" aria-label="Seat map, rows 12 to 17" className="space-y-2">
                                                    {SEAT_ROWS.map((row) => (
                                                        <div key={row} className="flex items-center gap-0.5 sm:gap-1">
                                                            {LEFT.map((c) => renderSeat(c, row))}
                                                            <span className="w-6 text-center font-mono text-[10px] text-white/40 sm:w-7">
                                                                {row}
                                                            </span>
                                                            {RIGHT.map((c) => renderSeat(c, row))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/65">
                                                {Object.values(bands).map((b) => (
                                                    <li key={b.label} className="inline-flex items-center gap-1.5">
                                                        <span className={cn('h-3 w-3 rounded-sm', b.cls)} />
                                                        {b.label} ${b.price}
                                                    </li>
                                                ))}
                                                <li className="inline-flex items-center gap-1.5">
                                                    <span className="h-3 w-3 rounded-sm bg-white/10" />
                                                    Taken
                                                </li>
                                            </ul>
                                            <label className="mt-4 flex min-h-10 cursor-pointer items-center gap-3 text-sm text-white/80">
                                                <input
                                                    type="checkbox"
                                                    checked={skipSeats}
                                                    className="h-5 w-5 shrink-0 accent-[#7dd3fc]"
                                                    onChange={(event) => {
                                                        setSkipSeats(event.target.checked)
                                                        setErrors({})
                                                    }}
                                                />
                                                Skip — assign free seats at check-in
                                            </label>
                                            <FieldError id={`${uid}-seats-error`} message={errors.seats} />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-white/10 bg-[#0a1f44] p-4">
                                                <LuLuggage aria-hidden="true" className="h-6 w-6 shrink-0 text-[#7dd3fc]" />
                                                <div className="min-w-[8rem] flex-1">
                                                    <p className="text-sm font-semibold text-white">Checked bags</p>
                                                    <p className="text-xs text-white/55">23 kg each · $35 per bag</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        aria-label="Remove a checked bag"
                                                        disabled={bags <= 0}
                                                        className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#7dd3fc] disabled:opacity-30"
                                                        onClick={() => setBags((b) => b - 1)}
                                                    >
                                                        <HiMinus aria-hidden="true" />
                                                    </button>
                                                    <span aria-live="polite" className="w-6 text-center font-mono text-sm text-white">
                                                        {bags}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        aria-label="Add a checked bag"
                                                        disabled={bags >= MAX_BAGS}
                                                        className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#7dd3fc] disabled:opacity-30"
                                                        onClick={() => setBags((b) => b + 1)}
                                                    >
                                                        <HiPlus aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            {[
                                                {
                                                    id: 'priority',
                                                    icon: LuTimer,
                                                    title: 'Priority boarding',
                                                    text: 'Board in group 1 · $12 per passenger',
                                                    on: priority,
                                                    set: setPriority,
                                                },
                                                {
                                                    id: 'meal',
                                                    icon: LuCoffee,
                                                    title: 'Hot breakfast',
                                                    text: 'Kalua hash or mango oats · $14 per passenger',
                                                    on: meal,
                                                    set: setMeal,
                                                },
                                            ].map((x) => (
                                                <button
                                                    key={x.id}
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={x.on}
                                                    className={cn(
                                                        'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]',
                                                        x.on ? 'border-[#7dd3fc]/60 bg-[#7dd3fc]/10' : 'border-white/10 bg-[#0a1f44] hover:border-white/25',
                                                    )}
                                                    onClick={() => x.set(!x.on)}
                                                >
                                                    <x.icon aria-hidden="true" className="h-6 w-6 shrink-0 text-[#7dd3fc]" />
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block text-sm font-semibold text-white">{x.title}</span>
                                                        <span className="block text-xs text-white/55">{x.text}</span>
                                                    </span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'grid h-6 w-6 shrink-0 place-items-center rounded-md border text-sm',
                                                            x.on ? 'border-[#7dd3fc] bg-[#7dd3fc] text-[#0a1f44]' : 'border-white/30',
                                                        )}
                                                    >
                                                        {x.on ? <HiCheck /> : null}
                                                    </span>
                                                </button>
                                            ))}
                                            <p className="rounded-2xl bg-white/[0.04] p-4 text-xs leading-5 text-white/55">
                                                One 7 kg cabin bag and a personal item are included for each passenger.
                                                Seats are priced per seat; bags are shared across the booking.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : step === 1 ? (
                                <motion.div
                                    key="pax"
                                    custom={dir}
                                    variants={slide}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <h3
                                        ref={focusHeading}
                                        tabIndex={-1}
                                        className="text-xl font-semibold tracking-tight text-white outline-none sm:text-2xl"
                                    >
                                        Who&apos;s flying?
                                    </h3>
                                    <p className="mt-1 text-sm text-white/55">
                                        Names must match the passports exactly. All fields are required.
                                    </p>
                                    <form
                                        noValidate
                                        className="mt-6 space-y-6"
                                        onSubmit={(event) => {
                                            event.preventDefault()
                                            next()
                                        }}
                                    >
                                        {pax.map((p, i) => (
                                            <fieldset key={i} className="rounded-2xl border border-white/10 p-4 sm:p-5">
                                                <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7dd3fc]">
                                                    Passenger {i + 1} · Adult
                                                    {seats[i] && !skipSeats ? ` · Seat ${seats[i]}` : ''}
                                                </legend>
                                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                                    {[
                                                        ['first', 'First name', 'text', 'given-name'],
                                                        ['last', 'Last name', 'text', 'family-name'],
                                                        ['dob', 'Date of birth', 'date', 'bday'],
                                                    ].map(([field, label, type, auto]) => {
                                                        const key = `p${i}-${field}`
                                                        return (
                                                            <div key={field}>
                                                                <label htmlFor={`${uid}-${key}`} className="text-xs text-white/70">
                                                                    {label}
                                                                </label>
                                                                <input
                                                                    id={`${uid}-${key}`}
                                                                    type={type}
                                                                    autoComplete={i === 0 ? auto : 'off'}
                                                                    max={type === 'date' ? '2026-10-21' : undefined}
                                                                    value={p[field]}
                                                                    aria-invalid={Boolean(errors[key])}
                                                                    aria-describedby={errors[key] ? `${uid}-${key}-error` : undefined}
                                                                    className={inputCls(errors[key])}
                                                                    onChange={(event) => setPaxField(i, field, event.target.value)}
                                                                />
                                                                <FieldError id={`${uid}-${key}-error`} message={errors[key]} />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </fieldset>
                                        ))}
                                        <fieldset className="rounded-2xl border border-white/10 p-4 sm:p-5">
                                            <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7dd3fc]">
                                                Contact for this booking
                                            </legend>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {[
                                                    ['email', 'Email', 'email', 'email', 'you@example.com'],
                                                    ['phone', 'Mobile phone', 'tel', 'tel', '+1 206 555 0144'],
                                                ].map(([field, label, type, auto, ph]) => (
                                                    <div key={field}>
                                                        <label htmlFor={`${uid}-${field}`} className="text-xs text-white/70">
                                                            {label}
                                                        </label>
                                                        <input
                                                            id={`${uid}-${field}`}
                                                            type={type}
                                                            autoComplete={auto}
                                                            placeholder={ph}
                                                            value={contact[field]}
                                                            aria-invalid={Boolean(errors[field])}
                                                            aria-describedby={errors[field] ? `${uid}-${field}-error` : undefined}
                                                            className={inputCls(errors[field])}
                                                            onChange={(event) =>
                                                                setContact((c) => ({ ...c, [field]: event.target.value }))
                                                            }
                                                        />
                                                        <FieldError id={`${uid}-${field}-error`} message={errors[field]} />
                                                    </div>
                                                ))}
                                            </div>
                                        </fieldset>
                                        <button type="submit" tabIndex={-1} aria-hidden="true" className="sr-only">
                                            Continue to confirm
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="confirm"
                                    custom={dir}
                                    variants={slide}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <h3
                                        ref={focusHeading}
                                        tabIndex={-1}
                                        className="text-xl font-semibold tracking-tight text-white outline-none sm:text-2xl"
                                    >
                                        Check it over
                                    </h3>
                                    <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
                                        {[
                                            ['Flight', 'SK 318 · Thu 22 Oct 2026, 07:40 SEA → 10:55 HNL'],
                                            ['Cabin', 'Economy Classic · 7 kg cabin bag each'],
                                            ...pax.map((p, i) => [
                                                `Passenger ${i + 1}`,
                                                `${p.first.trim()} ${p.last.trim()} · ${
                                                    skipSeats || !seats[i] ? 'seat at check-in' : `seat ${seats[i]}`
                                                }`,
                                            ]),
                                            ['Extras', `${bags} checked ${bags === 1 ? 'bag' : 'bags'}${priority ? ' · priority' : ''}${meal ? ' · breakfast' : ''}`],
                                            ['Contact', `${contact.email.trim()} · ${contact.phone.trim()}`],
                                        ].map(([k, v]) => (
                                            <div key={k} className="bg-[#0a1f44] p-4">
                                                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{k}</dt>
                                                <dd className="mt-1 break-words text-sm text-white">{v}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <form noValidate className="mt-6" onSubmit={pay}>
                                        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-white/80">
                                            <input
                                                type="checkbox"
                                                checked={rules}
                                                aria-invalid={Boolean(errors.rules)}
                                                aria-describedby={errors.rules ? `${uid}-rules-error` : undefined}
                                                className="mt-0.5 h-5 w-5 shrink-0 accent-[#7dd3fc]"
                                                onChange={(event) => {
                                                    setRules(event.target.checked)
                                                    setErrors({})
                                                }}
                                            />
                                            <span>
                                                I accept the{' '}
                                                <a
                                                    href="#skylark-fare-rules"
                                                    className="text-[#7dd3fc] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#7dd3fc]"
                                                >
                                                    Classic fare rules
                                                </a>
                                                : changes $75 per person, refunds only within 24 hours of booking.
                                            </span>
                                        </label>
                                        <FieldError id={`${uid}-rules-error`} message={errors.rules} />
                                        <button
                                            type="submit"
                                            disabled={status === 'processing'}
                                            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#7dd3fc] px-6 text-base font-semibold text-[#0a1f44] transition-colors hover:bg-[#a5e3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-80 sm:w-auto"
                                        >
                                            {status === 'processing' ? (
                                                <>
                                                    <motion.span
                                                        aria-hidden="true"
                                                        animate={reduce ? undefined : { rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                                        className="h-4 w-4 rounded-full border-2 border-[#0a1f44]/30 border-t-[#0a1f44]"
                                                    />
                                                    Processing payment…
                                                </>
                                            ) : (
                                                `Pay ${money(total)}`
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!done && step < 2 ? (
                            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                                {step > 0 ? (
                                    <button
                                        type="button"
                                        className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#7dd3fc]"
                                        onClick={() => go(step - 1)}
                                    >
                                        <HiArrowLongLeft aria-hidden="true" /> Back
                                    </button>
                                ) : (
                                    <span aria-hidden="true" />
                                )}
                                <button
                                    type="button"
                                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#7dd3fc] px-6 text-sm font-semibold text-[#0a1f44] transition-colors hover:bg-[#a5e3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    onClick={next}
                                >
                                    Continue to {steps[step + 1].toLowerCase()}
                                    <HiArrowLongRight aria-hidden="true" />
                                </button>
                            </div>
                        ) : null}
                        {!done && step === 2 ? (
                            <button
                                type="button"
                                disabled={status === 'processing'}
                                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#7dd3fc] disabled:opacity-40"
                                onClick={() => go(1)}
                            >
                                <HiArrowLongLeft aria-hidden="true" /> Back to passengers
                            </button>
                        ) : null}
                    </div>

                    <aside
                        aria-label="Price summary"
                        className="relative self-start overflow-hidden rounded-[1.75rem] bg-[#7dd3fc] p-5 text-[#0a1f44] sm:p-6 lg:sticky lg:top-6"
                    >
                        <span aria-hidden="true" className="absolute -left-3 top-[69px] h-6 w-6 rounded-full bg-[#0a1f44] sm:top-[73px]" />
                        <span aria-hidden="true" className="absolute -right-3 top-[69px] h-6 w-6 rounded-full bg-[#0a1f44] sm:top-[73px]" />
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#0a1f44]/70">Trip total</p>
                        <p className="mt-1 text-sm font-semibold text-[#0a1f44]">2 adults · Economy Classic · one way</p>
                        <div aria-hidden="true" className="my-5 border-t-2 border-dashed border-[#0a1f44]/25" />
                        <dl className="space-y-3">
                            {lines.map((l) => (
                                <div key={l.key} className="flex items-start justify-between gap-3">
                                    <dt className="min-w-0 text-sm text-[#0a1f44]">
                                        {l.label}
                                        <span className="block font-mono text-[11px] text-[#0a1f44]/65">{l.maths}</span>
                                    </dt>
                                    <dd className="shrink-0 font-mono text-sm tabular-nums text-[#0a1f44]">{money(l.amount)}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="mt-5 flex items-end justify-between gap-3 border-t-2 border-[#0a1f44] pt-4">
                            <p className="text-sm font-semibold text-[#0a1f44]">Total USD</p>
                            <p aria-live="polite" className="overflow-hidden font-mono text-2xl font-semibold tabular-nums text-[#0a1f44]">
                                <AnimatePresence initial={false} mode="popLayout">
                                    <motion.span
                                        key={total}
                                        initial={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
                                        animate={{ y: '0%', opacity: 1 }}
                                        exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="block"
                                    >
                                        {money(total)}
                                    </motion.span>
                                </AnimatePresence>
                            </p>
                        </div>
                        <p className="mt-4 text-xs leading-5 text-[#0a1f44]/70">
                            Fare held until 23:59 today. Prices include all taxes for 2 passengers.
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default CheckoutStepperBookingSummary

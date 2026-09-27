// ReceiptRailBookingSummary

// BookingSummary01 · Booking & Reservations › Booking Summary & Add-ons

// Description:
// A Nestaway listing checkout for "Casa Limonaia, a terrace loft above the harbour" in
// Positano: photos, host and house notes on the left and a sticky receipt rail on the
// right that prints a live bill. Guests change the nights and party size, open the
// nightly breakdown and switch add-ons on or off; every line shows its maths and the
// total updates. "Reserve" sends the request under the note "You won't be charged yet".
// Use it on a holiday-rental listing page.

// Design:
// - White #ffffff section, charcoal #222222 text, coral #ff5a5f accent, greys #6a6a6a,
//   #dddddd and #f7f7f7; lg grid of minmax(0,1fr) + a 400px rail (lg:sticky lg:top-6)
// - Rail = charcoal "printer" bar with the white receipt paper feeding out beneath it;
//   the paper has a zig-zag tear edge (CSS conic-gradient mask) and a drop-shadow
//   filter
// - Receipt lines in font-mono tabular numbers with dotted leaders; add-ons are
//   full-width switch rows with a coral track; semibold sans headings with tight
//   tracking
// - Photos: large + 2 small in a 2-col grid (main spans the row) → 3 cols from sm
// - Motion: the paper nudges like a print feed whenever the total changes, total digits
//   slide, breakdown and guest panels expand in height; all off for reduced motion

// What it does:
// - State: nights (2–14 from a fixed check-in, Fri 16 Oct 2026), adults/children (max
//   6), add-on switches, breakdown/guest panel open flags and a reserve status
// - Totals are derived from state: weekday × $214 + weekend × $256, −8% weekly discount
//   from 7 nights, $22 × extra guests × nights over 4 guests, $68 cleaning, 12% service
//   fee on stay + cleaning, then add-ons (breakfast = $14 × guests × nights)
// - "Reserve" shows "Checking availability…" for 0.9 s (timer cleared on unmount) and
//   then a success panel with a request number and "Edit trip"; Escape closes the guest
//   panel. "Message Giulia" (from sm) links to #message-host; photos are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ReceiptRailBookingSummary from '@/TestComponent/PageSections/booking/BookingSummary01';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <ReceiptRailBookingSummary />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'framer-motion';
import { HiCheck, HiChevronDown, HiMinus, HiPlus, HiStar } from 'react-icons/hi2';
import { LuCalendarCheck, LuKeyRound, LuWaves } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const DAY_MS = 86400000
const CHECK_IN = Date.UTC(2026, 9, 16)
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const RATE_WEEKDAY = 214
const RATE_WEEKEND = 256
const CLEANING = 68
const SERVICE_RATE = 0.12
const EXTRA_GUEST_FEE = 22
const INCLUDED_GUESTS = 4
const MAX_GUESTS = 6
const WEEKLY_DISCOUNT = 0.08
const MIN_NIGHTS = 2
const MAX_NIGHTS = 14

const addOns = [
    {
        id: 'early',
        label: 'Early check-in from 11:00',
        note: 'Drop your bags and swim before lunch',
        price: 45,
        perGuestNight: false,
    },
    {
        id: 'transfer',
        label: 'Private transfer from Naples airport',
        note: 'Driver meets you at arrivals · 75 min',
        price: 120,
        perGuestNight: false,
    },
    {
        id: 'breakfast',
        label: 'Breakfast hamper on the terrace',
        note: '$14 per guest, every morning',
        price: 14,
        perGuestNight: true,
    },
    {
        id: 'clean',
        label: 'Mid-stay clean + fresh linen',
        note: 'For stays of 4 nights or more',
        price: 55,
        perGuestNight: false,
        minNights: 4,
    },
]

const highlights = [
    { icon: LuKeyRound, title: 'Self check-in', text: 'Key safe by the blue door, codes sent 48 h before arrival.' },
    { icon: LuWaves, title: 'Sea-view terrace', text: '38 m² lemon-tree terrace facing the harbour and Li Galli islands.' },
    {
        icon: LuCalendarCheck,
        title: 'Free cancellation before Fri 9 Oct',
        text: 'Full refund up to 7 days before check-in, 50% after that.',
    },
]

const dateAt = (offset) => new Date(CHECK_IN + offset * DAY_MS)
const fmtDay = (d) => `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
const round2 = (n) => Math.round(n * 100) / 100

function money(n) {
    const v = round2(n)
    const [int, dec] = Math.abs(v).toFixed(2).split('.')
    return `${v < 0 ? '−' : ''}$${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`
}

function Stepper({ label, value, min, max, onChange, unit }) {
    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                aria-label={`Fewer ${label}`}
                disabled={value <= min}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#b0b0b0] text-[#222222] transition-colors hover:border-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f] disabled:cursor-not-allowed disabled:border-[#ebebeb] disabled:text-[#c7c7c7]"
                onClick={() => onChange(value - 1)}
            >
                <HiMinus aria-hidden="true" />
            </button>
            <span aria-live="polite" className="min-w-[4.25rem] text-center text-sm tabular-nums text-[#222222]">
                {value}
                {unit ? ` ${unit}` : ''}
                <span className="sr-only"> {label}</span>
            </span>
            <button
                type="button"
                aria-label={`More ${label}`}
                disabled={value >= max}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#b0b0b0] text-[#222222] transition-colors hover:border-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f] disabled:cursor-not-allowed disabled:border-[#ebebeb] disabled:text-[#c7c7c7]"
                onClick={() => onChange(value + 1)}
            >
                <HiPlus aria-hidden="true" />
            </button>
        </div>
    )
}

function Line({ label, detail, amount, accent = false }) {
    return (
        <div className="flex items-baseline gap-2 py-1.5">
            <dt className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className={cn('min-w-0 text-sm', accent ? 'text-[#c13515]' : 'text-[#222222]')}>
                    {label}
                    {detail ? (
                        <span className="block font-mono text-[11px] leading-5 text-[#6a6a6a]">{detail}</span>
                    ) : null}
                </span>
                <span aria-hidden="true" className="h-px min-w-4 flex-1 border-b border-dotted border-[#c9c9c9]" />
            </dt>
            <dd className={cn('shrink-0 font-mono text-sm tabular-nums', accent ? 'text-[#c13515]' : 'text-[#222222]')}>
                {amount}
            </dd>
        </div>
    )
}

export function ReceiptRailBookingSummary({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [nights, setNights] = useState(5)
    const [adults, setAdults] = useState(2)
    const [children, setChildren] = useState(1)
    const [selected, setSelected] = useState({ early: false, transfer: true, breakfast: false, clean: false })
    const [guestsOpen, setGuestsOpen] = useState(false)
    const [breakdownOpen, setBreakdownOpen] = useState(false)
    const [status, setStatus] = useState('idle')
    const [scope, animatePaper] = useAnimate()
    const reduce = useReducedMotion()
    const timerRef = useRef(null)
    const firstRender = useRef(true)
    const guestsButtonRef = useRef(null)
    const uid = useId()
    const guestsId = `${uid}-guests`
    const nightsId = `${uid}-nights`

    const guests = adults + children
    const nightList = Array.from({ length: nights }, (_, i) => {
        const d = dateAt(i)
        const weekend = d.getUTCDay() === 5 || d.getUTCDay() === 6
        return { key: i, label: fmtDay(d), weekend, rate: weekend ? RATE_WEEKEND : RATE_WEEKDAY }
    })
    const weekendCount = nightList.filter((n) => n.weekend).length
    const weekdayCount = nights - weekendCount
    const nightsSubtotal = weekdayCount * RATE_WEEKDAY + weekendCount * RATE_WEEKEND
    const discount = nights >= 7 ? round2(nightsSubtotal * WEEKLY_DISCOUNT) : 0
    const extraGuests = Math.max(0, guests - INCLUDED_GUESTS)
    const extraFee = extraGuests * EXTRA_GUEST_FEE * nights
    const serviceBase = nightsSubtotal - discount + extraFee + CLEANING
    const service = round2(serviceBase * SERVICE_RATE)
    const addOnLines = addOns
        .filter((a) => selected[a.id] && (!a.minNights || nights >= a.minNights))
        .map((a) => ({
            ...a,
            amount: a.perGuestNight ? a.price * guests * nights : a.price,
            detail: a.perGuestNight ? `${guests} guests × $${a.price} × ${nights} mornings` : 'One-off',
        }))
    const addOnTotal = addOnLines.reduce((sum, a) => sum + a.amount, 0)
    const total = round2(serviceBase + service + addOnTotal)
    const checkOut = fmtDay(dateAt(nights))

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        if (reduce || !scope.current) return
        animatePaper(scope.current, { y: [-9, 0] }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] })
    }, [total, reduce, animatePaper, scope])

    useEffect(() => () => clearTimeout(timerRef.current), [])

    const updateGuests = (nextAdults, nextChildren) => {
        if (nextAdults + nextChildren > MAX_GUESTS) return
        setAdults(nextAdults)
        setChildren(nextChildren)
    }

    const reserve = () => {
        setStatus('checking')
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setStatus('sent'), 900)
    }

    const requestNo = `NST-${1016 + nights}${String(total).replace('.', '').slice(-4)}-${guests}${adults}`

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#ffffff] px-4 py-14 text-base font-normal text-[#222222] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
                <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#6a6a6a]">
                        <span className="font-semibold text-[#ff5a5f]">nestaway</span>
                        <span aria-hidden="true">/</span>
                        <span>Italy</span>
                        <span aria-hidden="true">/</span>
                        <span>Amalfi Coast</span>
                        <span aria-hidden="true">/</span>
                        <span className="text-[#222222]">Positano</span>
                    </p>
                    <h2 className="mt-3 max-w-2xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#222222] sm:text-5xl">
                        Casa Limonaia, a terrace loft above the harbour
                    </h2>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#222222]">
                        <span className="inline-flex items-center gap-1 font-semibold">
                            <HiStar aria-hidden="true" className="text-[#222222]" />
                            4.93
                            <span className="font-normal text-[#6a6a6a] underline underline-offset-2">212 reviews</span>
                        </span>
                        <span className="rounded-full border border-[#222222] px-3 py-1 text-xs font-semibold">
                            Guest favourite
                        </span>
                        <span className="text-[#6a6a6a]">2 bedrooms · 3 beds · 1.5 baths</span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <div className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-2xl bg-[#f7f7f7] sm:row-span-2 sm:aspect-auto">
                            <img
                                src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80"
                                alt="Pastel houses stacked on the cliffs above a blue bay"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f7f7f7]">
                            <img
                                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
                                alt="Bright living room with a white sofa and potted plants"
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f7f7f7]">
                            <img
                                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80"
                                alt="Bedroom with a tufted headboard and crisp linen"
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4 border-b border-[#ebebeb] pb-8">
                        <img
                            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
                            alt="Giulia, the host"
                            loading="lazy"
                            className="h-14 w-14 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold text-[#222222]">Hosted by Giulia</p>
                            <p className="text-sm text-[#6a6a6a]">Superhost · 6 years hosting · replies within an hour</p>
                        </div>
                        <a
                            href="#message-host"
                            className="hidden min-h-10 items-center rounded-lg border border-[#222222] px-4 text-sm font-semibold text-[#222222] transition-colors hover:bg-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f] sm:inline-flex"
                        >
                            Message Giulia
                        </a>
                    </div>

                    <ul className="mt-8 grid gap-6">
                        {highlights.map((h) => (
                            <li key={h.title} className="flex gap-4">
                                <h.icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-[#222222]" />
                                <div>
                                    <p className="text-base font-semibold text-[#222222]">{h.title}</p>
                                    <p className="mt-0.5 text-sm leading-6 text-[#6a6a6a]">{h.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-8 max-w-2xl border-t border-[#ebebeb] pt-8 text-base leading-7 text-[#3f3f3f]">
                        Ninety-two steps above Spiaggia Grande, the loft sits in a 1920s lemon-grower&apos;s house:
                        whitewashed vaults, hand-painted Vietri tiles and a terrace where breakfast runs long.
                        The bakery on Via Pasitea opens at 7, the ferry pier is an eight-minute walk downhill.
                    </p>

                    <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#ebebeb] bg-[#ebebeb] sm:grid-cols-4">
                        {[
                            ['Check-in', '15:00–20:00'],
                            ['Checkout', 'by 11:00'],
                            ['Guests', `Up to ${MAX_GUESTS}`],
                            ['Weekly stays', '−8% from 7 nights'],
                        ].map(([k, v]) => (
                            <div key={k} className="bg-white p-4">
                                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6a6a6a]">{k}</dt>
                                <dd className="mt-1 text-sm font-semibold text-[#222222]">{v}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <aside aria-label="Booking summary" className="min-w-0 lg:sticky lg:top-6 lg:self-start">
                    <div className="relative z-10 flex items-center justify-between gap-3 rounded-2xl bg-[#222222] px-5 pb-6 pt-4 text-white">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold">
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ff5a5f] text-[11px] font-bold text-white">
                                n
                            </span>
                            Your trip receipt
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                            Live quote
                        </span>
                        <span aria-hidden="true" className="absolute inset-x-5 bottom-2.5 h-1 rounded-full bg-black/70" />
                    </div>

                    <div className="-mt-4 px-2.5 drop-shadow-[0_18px_28px_rgba(34,34,34,0.16)]">
                        <div
                            ref={scope}
                            className="bg-white px-5 pb-10 pt-8 [mask-image:conic-gradient(from_-45deg_at_bottom,transparent,#000_1deg_89deg,transparent_90deg)] [mask-position:50%_0] [mask-repeat:repeat-x] [mask-size:18px_100%] sm:px-6"
                        >
                            <div className="flex flex-wrap items-end justify-between gap-2">
                                <p className="text-sm text-[#6a6a6a]">
                                    <span className="text-2xl font-semibold tracking-tight text-[#222222]">
                                        ${RATE_WEEKDAY}
                                    </span>{' '}
                                    night
                                    <span className="block text-xs">Fri &amp; Sat ${RATE_WEEKEND}</span>
                                </p>
                                <p className="inline-flex items-center gap-1 text-sm font-semibold text-[#222222]">
                                    <HiStar aria-hidden="true" /> 4.93
                                    <span className="font-normal text-[#6a6a6a]">· 212</span>
                                </p>
                            </div>

                            <div className="mt-5 overflow-hidden rounded-xl border border-[#b0b0b0]">
                                <div className="grid grid-cols-2 divide-x divide-[#b0b0b0]">
                                    <div className="p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#222222]">
                                            Check-in
                                        </p>
                                        <p className="mt-0.5 text-sm text-[#222222]">{fmtDay(dateAt(0))} 2026</p>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#222222]">
                                            Checkout
                                        </p>
                                        <AnimatePresence initial={false} mode="popLayout">
                                            <motion.p
                                                key={checkOut}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ duration: 0.25 }}
                                                className="mt-0.5 text-sm text-[#222222]"
                                            >
                                                {checkOut} 2026
                                            </motion.p>
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-3 border-t border-[#b0b0b0] px-3 py-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#222222]">
                                        Nights
                                    </p>
                                    <Stepper
                                        label="nights"
                                        unit={nights === 1 ? 'night' : 'nights'}
                                        value={nights}
                                        min={MIN_NIGHTS}
                                        max={MAX_NIGHTS}
                                        onChange={setNights}
                                    />
                                </div>
                                <div
                                    className="border-t border-[#b0b0b0]"
                                    onKeyDown={(event) => {
                                        if (event.key === 'Escape' && guestsOpen) {
                                            event.stopPropagation()
                                            setGuestsOpen(false)
                                            guestsButtonRef.current?.focus()
                                        }
                                    }}
                                >
                                    <button
                                        ref={guestsButtonRef}
                                        type="button"
                                        aria-expanded={guestsOpen}
                                        aria-controls={guestsId}
                                        className="flex min-h-14 w-full items-center justify-between gap-3 px-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff5a5f]"
                                        onClick={() => setGuestsOpen((o) => !o)}
                                    >
                                        <span>
                                            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#222222]">
                                                Guests
                                            </span>
                                            <span className="block text-sm text-[#222222]">
                                                {adults} {adults === 1 ? 'adult' : 'adults'}
                                                {children ? `, ${children} ${children === 1 ? 'child' : 'children'}` : ''}
                                            </span>
                                        </span>
                                        <HiChevronDown
                                            aria-hidden="true"
                                            className={cn(
                                                'h-5 w-5 text-[#222222] transition-transform',
                                                guestsOpen && 'rotate-180',
                                            )}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {guestsOpen ? (
                                            <motion.div
                                                id={guestsId}
                                                initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                                animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                                                exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-3 bg-[#f7f7f7] px-3 py-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="text-sm text-[#222222]">
                                                            Adults
                                                            <span className="block text-xs text-[#6a6a6a]">Age 13+</span>
                                                        </p>
                                                        <Stepper
                                                            label="adults"
                                                            value={adults}
                                                            min={1}
                                                            max={MAX_GUESTS - children}
                                                            onChange={(v) => updateGuests(v, children)}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="text-sm text-[#222222]">
                                                            Children
                                                            <span className="block text-xs text-[#6a6a6a]">Ages 2–12</span>
                                                        </p>
                                                        <Stepper
                                                            label="children"
                                                            value={children}
                                                            min={0}
                                                            max={MAX_GUESTS - adults}
                                                            onChange={(v) => updateGuests(adults, v)}
                                                        />
                                                    </div>
                                                    <p className="text-xs leading-5 text-[#6a6a6a]">
                                                        {INCLUDED_GUESTS} guests included, then ${EXTRA_GUEST_FEE} per extra
                                                        guest per night. Maximum {MAX_GUESTS}.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <fieldset className="mt-6">
                                <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6a6a6a]">
                                    Add to your stay
                                </legend>
                                <div className="mt-2 divide-y divide-[#ebebeb]">
                                    {addOns.map((a) => {
                                        const unavailable = Boolean(a.minNights && nights < a.minNights)
                                        const on = selected[a.id] && !unavailable
                                        return (
                                            <button
                                                key={a.id}
                                                type="button"
                                                role="switch"
                                                aria-checked={on}
                                                disabled={unavailable}
                                                className="flex min-h-14 w-full items-center gap-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f] disabled:cursor-not-allowed disabled:opacity-50"
                                                onClick={() => setSelected((s) => ({ ...s, [a.id]: !s[a.id] }))}
                                            >
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-sm font-medium text-[#222222]">{a.label}</span>
                                                    <span className="block text-xs leading-5 text-[#6a6a6a]">
                                                        {unavailable ? 'Needs 4+ nights' : a.note}
                                                    </span>
                                                </span>
                                                <span className="shrink-0 font-mono text-xs tabular-nums text-[#222222]">
                                                    {a.perGuestNight ? `$${a.price}/pp` : `$${a.price}`}
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors',
                                                        on ? 'bg-[#ff5a5f]' : 'bg-[#dddddd]',
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] text-[#ff5a5f] shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200',
                                                            on ? 'translate-x-[18px]' : 'translate-x-0.5',
                                                        )}
                                                    >
                                                        {on ? <HiCheck /> : null}
                                                    </span>
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </fieldset>

                            <dl className="mt-5 border-t border-dashed border-[#b0b0b0] pt-4">
                                {weekdayCount ? (
                                    <Line
                                        label={`${weekdayCount} weekday ${weekdayCount === 1 ? 'night' : 'nights'}`}
                                        detail={`${weekdayCount} × $${RATE_WEEKDAY}`}
                                        amount={money(weekdayCount * RATE_WEEKDAY)}
                                    />
                                ) : null}
                                {weekendCount ? (
                                    <Line
                                        label={`${weekendCount} weekend ${weekendCount === 1 ? 'night' : 'nights'}`}
                                        detail={`${weekendCount} × $${RATE_WEEKEND}`}
                                        amount={money(weekendCount * RATE_WEEKEND)}
                                    />
                                ) : null}
                            </dl>
                            <button
                                type="button"
                                aria-expanded={breakdownOpen}
                                aria-controls={nightsId}
                                className="mt-1 inline-flex min-h-10 items-center gap-1 rounded text-xs font-semibold text-[#222222] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]"
                                onClick={() => setBreakdownOpen((o) => !o)}
                            >
                                {breakdownOpen ? 'Hide' : 'Show'} nightly breakdown
                                <HiChevronDown
                                    aria-hidden="true"
                                    className={cn('transition-transform', breakdownOpen && 'rotate-180')}
                                />
                            </button>
                            <AnimatePresence initial={false}>
                                {breakdownOpen ? (
                                    <motion.div
                                        id={nightsId}
                                        initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                        animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <ol className="my-2 grid grid-cols-1 gap-1 rounded-lg bg-[#f7f7f7] p-3 min-[400px]:grid-cols-2 min-[400px]:gap-x-4">
                                            {nightList.map((n) => (
                                                <li
                                                    key={n.key}
                                                    className="flex items-center justify-between font-mono text-[11px] text-[#3f3f3f]"
                                                >
                                                    <span className={cn(n.weekend && 'text-[#ff5a5f]')}>{n.label}</span>
                                                    <span className="tabular-nums">${n.rate}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                            <dl>
                                {discount ? (
                                    <Line
                                        accent
                                        label="Weekly stay discount"
                                        detail={`8% of ${money(nightsSubtotal)}`}
                                        amount={money(-discount)}
                                    />
                                ) : null}
                                {extraFee ? (
                                    <Line
                                        label="Extra guests"
                                        detail={`${extraGuests} × $${EXTRA_GUEST_FEE} × ${nights} nights`}
                                        amount={money(extraFee)}
                                    />
                                ) : null}
                                <Line label="Cleaning fee" detail="One-off" amount={money(CLEANING)} />
                                <Line
                                    label="Nestaway service fee"
                                    detail={`12% of ${money(serviceBase)}`}
                                    amount={money(service)}
                                />
                                {addOnLines.map((a) => (
                                    <Line key={a.id} label={a.label} detail={a.detail} amount={money(a.amount)} />
                                ))}
                            </dl>

                            <div className="mt-4 flex items-end justify-between gap-3 border-t-2 border-[#222222] pt-4">
                                <p className="text-base font-semibold text-[#222222]">
                                    Total
                                    <span className="block text-xs font-normal text-[#6a6a6a]">
                                        {nights} nights · {guests} guests · USD
                                    </span>
                                </p>
                                <p aria-live="polite" className="relative overflow-hidden text-2xl font-semibold tabular-nums text-[#222222]">
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

                            <div className="mt-6">
                                <AnimatePresence mode="wait" initial={false}>
                                    {status === 'sent' ? (
                                        <motion.div
                                            key="sent"
                                            role="status"
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="rounded-xl border border-[#222222] p-4"
                                        >
                                            <p className="flex items-center gap-2 text-base font-semibold text-[#222222]">
                                                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ff5a5f] text-white">
                                                    <HiCheck aria-hidden="true" />
                                                </span>
                                                Request sent to Giulia
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-[#6a6a6a]">
                                                {fmtDay(dateAt(0))} → {checkOut} · {money(total)}. She usually replies within
                                                an hour; you won&apos;t be charged until she accepts.
                                            </p>
                                            <p className="mt-2 font-mono text-xs text-[#222222]">Request {requestNo}</p>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[#222222] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]"
                                                onClick={() => setStatus('idle')}
                                            >
                                                Edit trip
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <button
                                                type="button"
                                                disabled={status === 'checking'}
                                                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e61e4d] via-[#ff385c] to-[#ff5a5f] text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(255,56,92,0.7)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222222] disabled:cursor-wait disabled:opacity-80"
                                                onClick={reserve}
                                            >
                                                {status === 'checking' ? (
                                                    <>
                                                        <motion.span
                                                            aria-hidden="true"
                                                            animate={reduce ? undefined : { rotate: 360 }}
                                                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                                            className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                                                        />
                                                        Checking availability…
                                                    </>
                                                ) : (
                                                    'Reserve'
                                                )}
                                            </button>
                                            <p className="mt-3 text-center text-sm text-[#6a6a6a]">
                                                You won&apos;t be charged yet
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    )
}

export default ReceiptRailBookingSummary

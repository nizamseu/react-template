// TravelTabsBookingSearch

// BookingSearch01 · Booking & Reservations › Search / Booking Engine

// Description:
// A full-bleed travel hero for the fictional booking brand Wayfare: an aerial photo of
// turquoise water behind the heading "Salt air, slow mornings, one search away." and a
// white search card that overlaps the photo. Tabs switch between Stays, Flights and Cars,
// each with its own fields, and a valid search shows a live line such as "Searching 1,284
// stays in Lisbon, Portugal". Use it as the landing hero of a travel or OTA homepage.

// Design:
// - Photo hero (min-h 600px → md:680px) with a deep-sea #03263f gradient scrim; white
//   display heading text-4xl → sm:text-6xl → lg:text-7xl, semibold, tight tracking
// - White card, rounded-[28px], layered navy shadow, pulled up over the photo with -mt;
//   ocean blue #0369a1 for the active tab underline, focus rings, CTA and result line
// - Fields are soft slate #f1f5f9 wells with an icon, a tiny uppercase label and a 44px
//   control; errors show in red #b91c1c under the field with aria-invalid on the input
// - Grid: 1 column at base, 2 at sm, 5 at lg (destination wider, CTA auto width); the
//   guests popover spans the field on mobile and is a 20rem panel from lg
// - framer-motion: sliding tab underline (layoutId), fields cross-fade per tab, popover
//   scales in, result line slides up; all offsets drop for reduced motion

// What it does:
// - tab state (Stays / Flights / Cars, arrow keys move between tabs) changes labels,
//   fields and the CTA; destination, origin, dates, guests and driver age are controlled
// - Native date inputs get min dates from "today", computed in useEffect (the server
//   renders fixed 2026 dates); out-of-range defaults move to two weeks from today
// - Guests popover: adult / child / room steppers with limits (rooms ≤ adults), closes
//   on Done, Escape or an outside click; submit validates, then shows "Searching …" for
//   1.2 s (timer cleared on unmount) and the found count with a #wayfare-results link
// - "Popular right now" chips fill the destination field; the idle price note and the
//   perks row are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TravelTabsBookingSearch from '@/TestComponent/PageSections/booking/BookingSearch01';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <TravelTabsBookingSearch />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiMagnifyingGlass, HiMinus, HiPlus } from 'react-icons/hi2';
import {
    LuBedDouble,
    LuCalendarDays,
    LuCar,
    LuHeadphones,
    LuMapPin,
    LuPlane,
    LuPlaneTakeoff,
    LuShieldCheck,
    LuBadgePercent,
    LuUsers,
    LuUserRound,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const HERO =
    'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1600&q=80'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const tabs = [
    {
        id: 'stays',
        label: 'Stays',
        icon: LuBedDouble,
        where: 'Destination',
        wherePh: 'City, region or hotel',
        start: 'Check-in',
        end: 'Check-out',
        endError: 'Check-out must be after check-in',
        noun: 'stays',
        base: 1284,
        cta: 'Search stays',
    },
    {
        id: 'flights',
        label: 'Flights',
        icon: LuPlane,
        where: 'Flying to',
        wherePh: 'City or airport',
        start: 'Depart',
        end: 'Return',
        endError: 'Return must be after departure',
        noun: 'flights',
        base: 312,
        cta: 'Search flights',
    },
    {
        id: 'cars',
        label: 'Cars',
        icon: LuCar,
        where: 'Pick-up location',
        wherePh: 'Airport, station or city',
        start: 'Pick-up',
        end: 'Drop-off',
        endError: 'Drop-off must be after pick-up',
        noun: 'cars',
        base: 86,
        cta: 'Search cars',
    },
]

const popular = ['Lisbon, Portugal', 'Kyoto, Japan', 'Oaxaca, Mexico', 'Cape Town, South Africa', 'Hạ Long Bay, Vietnam']

const perks = [
    { icon: LuShieldCheck, text: 'Free cancellation on 8 in 10 stays' },
    { icon: LuBadgePercent, text: 'Price match within 24 hours' },
    { icon: LuHeadphones, text: 'Real people on call, 24/7' },
]

const pad = (n) => String(n).padStart(2, '0')
const toIso = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const addDays = (iso, days) => {
    const [y, m, d] = iso.split('-').map(Number)
    return toIso(new Date(y, m - 1, d + days))
}
const nightsBetween = (a, b) => {
    const [y1, m1, d1] = a.split('-').map(Number)
    const [y2, m2, d2] = b.split('-').map(Number)
    return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000)
}
const shortDate = (iso) => {
    if (!iso) return ''
    const [, m, d] = iso.split('-').map(Number)
    return `${d} ${MONTHS[m - 1]}`
}

function countFor(tab, where) {
    const key = where.trim().toLowerCase()
    if (key === 'lisbon, portugal' || key === 'lisbon') return tab.base
    let hash = 0
    for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) % 1000
    return Math.max(12, Math.round(tab.base * (0.35 + hash / 900)))
}

function Stepper({ label, hint, value, min, max, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <div>
                <p className="text-sm font-semibold text-[#0b1b2b]">{label}</p>
                <p className="text-xs text-[#0b1b2b]/55">{hint}</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label={`Remove one ${label.toLowerCase()}`}
                    disabled={value <= min}
                    className="grid size-10 place-items-center rounded-full border border-[#0b1b2b]/15 text-[#0b1b2b] transition-colors hover:border-[#0369a1] hover:text-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#0b1b2b]/15 disabled:hover:text-[#0b1b2b]"
                    onClick={() => onChange(value - 1)}
                >
                    <HiMinus aria-hidden="true" className="size-4" />
                </button>
                <span aria-live="polite" className="w-5 text-center text-base font-semibold tabular-nums text-[#0b1b2b]">
                    {value}
                </span>
                <button
                    type="button"
                    aria-label={`Add one ${label.toLowerCase()}`}
                    disabled={value >= max}
                    className="grid size-10 place-items-center rounded-full border border-[#0b1b2b]/15 text-[#0b1b2b] transition-colors hover:border-[#0369a1] hover:text-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#0b1b2b]/15 disabled:hover:text-[#0b1b2b]"
                    onClick={() => onChange(value + 1)}
                >
                    <HiPlus aria-hidden="true" className="size-4" />
                </button>
            </div>
        </div>
    )
}

function Field({ id, label, icon: Icon, error, className, children }) {
    return (
        <div className={cn('min-w-0', className)}>
            <div
                className={cn(
                    'flex h-full items-center gap-3 rounded-2xl bg-[#f1f5f9] px-4 py-2.5 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0369a1]',
                    error && 'ring-[#b91c1c]/60',
                )}
            >
                <Icon aria-hidden="true" className="size-5 shrink-0 text-[#0369a1]" />
                <div className="min-w-0 flex-1">
                    <label
                        htmlFor={id}
                        className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0b1b2b]/55"
                    >
                        {label}
                    </label>
                    {children}
                </div>
            </div>
            {error && (
                <p id={`${id}-error`} className="mt-1.5 px-1 text-xs font-medium text-[#b91c1c]">
                    {error}
                </p>
            )}
        </div>
    )
}

export function TravelTabsBookingSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [tabId, setTabId] = useState('stays')
    const [where, setWhere] = useState('Lisbon, Portugal')
    const [origin, setOrigin] = useState('London (all airports)')
    const [start, setStart] = useState('2026-10-16')
    const [end, setEnd] = useState('2026-10-21')
    const [minDate, setMinDate] = useState('2026-10-01')
    const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 })
    const [driverAge, setDriverAge] = useState('25-69')
    const [guestsOpen, setGuestsOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState({ phase: 'idle' })
    const tabRefs = useRef([])
    const guestsRef = useRef(null)
    const guestsButtonRef = useRef(null)

    const tab = tabs.find((t) => t.id === tabId)

    useEffect(() => {
        const today = toIso(new Date())
        setMinDate(today)
        setStart((current) => (current < today ? addDays(today, 14) : current))
        setEnd((current) => (current <= today ? addDays(today, 19) : current))
    }, [])

    useEffect(() => {
        if (!guestsOpen) return undefined
        const onPointer = (event) => {
            if (guestsRef.current && !guestsRef.current.contains(event.target)) setGuestsOpen(false)
        }
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setGuestsOpen(false)
                guestsButtonRef.current?.focus()
            }
        }
        document.addEventListener('pointerdown', onPointer)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onPointer)
            document.removeEventListener('keydown', onKey)
        }
    }, [guestsOpen])

    useEffect(() => {
        if (status.phase !== 'searching') return undefined
        const id = setTimeout(() => setStatus((s) => ({ ...s, phase: 'done' })), 1200)
        return () => clearTimeout(id)
    }, [status.phase])

    const selectTab = (index) => {
        const next = tabs[(index + tabs.length) % tabs.length]
        setTabId(next.id)
        setErrors({})
        setStatus({ phase: 'idle' })
        setGuestsOpen(false)
        tabRefs.current[(index + tabs.length) % tabs.length]?.focus()
    }

    const onTabKey = (event) => {
        const index = tabs.findIndex((t) => t.id === tabId)
        if (event.key === 'ArrowRight') selectTab(index + 1)
        else if (event.key === 'ArrowLeft') selectTab(index - 1)
        else if (event.key === 'Home') selectTab(0)
        else if (event.key === 'End') selectTab(tabs.length - 1)
        else return
        event.preventDefault()
    }

    const setGuest = (key, value) => {
        setGuests((g) => {
            const next = { ...g, [key]: value }
            if (next.rooms > next.adults) next.rooms = next.adults
            return next
        })
    }

    const guestSummary =
        tabId === 'stays'
            ? `${guests.adults} adult${guests.adults > 1 ? 's' : ''}${guests.children ? ` · ${guests.children} child${guests.children > 1 ? 'ren' : ''}` : ''} · ${guests.rooms} room${guests.rooms > 1 ? 's' : ''}`
            : `${guests.adults + guests.children} traveller${guests.adults + guests.children > 1 ? 's' : ''}`

    const onSubmit = (event) => {
        event.preventDefault()
        const next = {}
        if (!where.trim()) next.where = tabId === 'cars' ? 'Add a pick-up location' : 'Tell us where you’re going'
        if (tabId === 'flights') {
            if (!origin.trim()) next.origin = 'Add a departure city'
            else if (origin.trim().toLowerCase() === where.trim().toLowerCase())
                next.where = 'Origin and destination can’t be the same'
        }
        if (!start) next.start = 'Pick a date'
        else if (start < minDate) next.start = 'Pick a date from today onwards'
        if (!end) next.end = 'Pick a date'
        else if (start && end <= start) next.end = tab.endError
        setErrors(next)
        if (Object.keys(next).length) {
            setStatus({ phase: 'idle' })
            return
        }
        setGuestsOpen(false)
        setStatus({
            phase: 'searching',
            count: countFor(tab, where),
            noun: tab.noun,
            where: where.trim(),
            origin: origin.trim(),
            tabId,
            range: `${shortDate(start)} – ${shortDate(end)}`,
            nights: nightsBetween(start, end),
            who: guestSummary,
        })
    }

    const fieldId = (name) => `${uid}-${name}`
    const describe = (name) => (errors[name] ? `${fieldId(name)}-error` : undefined)
    const inputClass =
        'mt-0.5 block h-7 w-full min-w-0 truncate bg-transparent text-[15px] font-semibold text-[#0b1b2b] outline-none placeholder:font-normal placeholder:text-[#0b1b2b]/40'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white text-base font-normal text-[#0b1b2b]', className)}
            {...props}
        >
            <div className="relative isolate min-h-[600px] md:min-h-[680px]">
                <img
                    src={HERO}
                    alt="Aerial view of turquoise sea with small boats moored near the shore"
                    className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-linear-to-b from-[#03263f]/75 via-[#03263f]/35 to-[#03263f]/70"
                />
                <div className="mx-auto max-w-6xl px-4 pb-56 pt-8 sm:px-6 md:pt-10 lg:px-8">
                    <div className="flex items-center justify-between gap-4 text-white">
                        <a
                            href="#wayfare-home"
                            className="inline-flex min-h-10 items-center gap-2 rounded-full text-lg font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        >
                            <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7">
                                <circle cx="16" cy="16" r="15" fill="#0369a1" />
                                <path
                                    d="M6 17c3-3 5-3 8 0s5 3 8 0 4-2 5-1M6 22c3-3 5-3 8 0s5 3 8 0 4-2 5-1"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Wayfare
                        </a>
                        <p className="hidden text-sm text-white/80 sm:block">
                            <span className="font-semibold text-white">4.8/5</span> from 212,400 trips
                        </p>
                    </div>
                    <div className="mt-16 max-w-3xl md:mt-24">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7dd3fc]">
                            Autumn escapes · Oct – Dec 2026
                        </p>
                        <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                            Salt air, slow mornings, one search away.
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                            Stays, flights and cars across 190 countries, with the total price shown up
                            front, taxes included.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mx-auto -mt-40 max-w-6xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
                <div className="rounded-[28px] bg-white shadow-[0_40px_80px_-30px_rgba(3,38,63,0.55),0_2px_6px_rgba(3,38,63,0.08)] ring-1 ring-[#0b1b2b]/5">
                    <div
                        role="tablist"
                        aria-label="What are you booking?"
                        className="flex gap-1 overflow-x-auto border-b border-[#0b1b2b]/10 px-3 sm:px-6"
                        onKeyDown={onTabKey}
                    >
                        {tabs.map((t, index) => {
                            const Icon = t.icon
                            const active = t.id === tabId
                            return (
                                <button
                                    key={t.id}
                                    ref={(el) => {
                                        tabRefs.current[index] = el
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`${uid}-tab-${t.id}`}
                                    aria-selected={active}
                                    aria-controls={`${uid}-panel`}
                                    tabIndex={active ? 0 : -1}
                                    className={cn(
                                        'relative inline-flex min-h-14 shrink-0 items-center gap-2 px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#0369a1] sm:px-4',
                                        active ? 'text-[#0369a1]' : 'text-[#0b1b2b]/55 hover:text-[#0b1b2b]',
                                    )}
                                    onClick={() => selectTab(index)}
                                >
                                    <Icon aria-hidden="true" className="size-[18px]" />
                                    {t.label}
                                    {active && (
                                        <motion.span
                                            layoutId={`${uid}-underline`}
                                            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }}
                                            className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-[#0369a1]"
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <form
                        noValidate
                        id={`${uid}-panel`}
                        role="tabpanel"
                        aria-labelledby={`${uid}-tab-${tabId}`}
                        className="p-3 sm:p-5 lg:p-6"
                        onSubmit={onSubmit}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={tabId}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                                transition={{ duration: 0.22 }}
                                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.15fr_auto]"
                            >
                                {tabId === 'flights' && (
                                    <Field
                                        id={fieldId('origin')}
                                        label="Flying from"
                                        icon={LuPlaneTakeoff}
                                        error={errors.origin}
                                        className="sm:col-span-2 lg:col-span-5 lg:max-w-md"
                                    >
                                        <input
                                            id={fieldId('origin')}
                                            value={origin}
                                            placeholder="City or airport"
                                            autoComplete="off"
                                            aria-invalid={Boolean(errors.origin)}
                                            aria-describedby={describe('origin')}
                                            className={inputClass}
                                            onChange={(e) => setOrigin(e.target.value)}
                                        />
                                    </Field>
                                )}
                                <Field
                                    id={fieldId('where')}
                                    label={tab.where}
                                    icon={LuMapPin}
                                    error={errors.where}
                                    className="sm:col-span-2 lg:col-span-1"
                                >
                                    <input
                                        id={fieldId('where')}
                                        value={where}
                                        placeholder={tab.wherePh}
                                        autoComplete="off"
                                        aria-invalid={Boolean(errors.where)}
                                        aria-describedby={describe('where')}
                                        className={inputClass}
                                        onChange={(e) => setWhere(e.target.value)}
                                    />
                                </Field>
                                <Field id={fieldId('start')} label={tab.start} icon={LuCalendarDays} error={errors.start}>
                                    <input
                                        id={fieldId('start')}
                                        type="date"
                                        value={start}
                                        min={minDate}
                                        aria-invalid={Boolean(errors.start)}
                                        aria-describedby={describe('start')}
                                        className={inputClass}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setStart(value)
                                            if (value && end && end <= value) setEnd(addDays(value, 1))
                                        }}
                                    />
                                </Field>
                                <Field id={fieldId('end')} label={tab.end} icon={LuCalendarDays} error={errors.end}>
                                    <input
                                        id={fieldId('end')}
                                        type="date"
                                        value={end}
                                        min={start ? addDays(start, 1) : minDate}
                                        aria-invalid={Boolean(errors.end)}
                                        aria-describedby={describe('end')}
                                        className={inputClass}
                                        onChange={(e) => setEnd(e.target.value)}
                                    />
                                </Field>

                                {tabId === 'cars' ? (
                                    <Field
                                        id={fieldId('age')}
                                        label="Driver age"
                                        icon={LuUserRound}
                                        className="sm:col-span-2 lg:col-span-1"
                                    >
                                        <select
                                            id={fieldId('age')}
                                            value={driverAge}
                                            className={cn(inputClass, 'cursor-pointer')}
                                            onChange={(e) => setDriverAge(e.target.value)}
                                        >
                                            <option value="18-24">18 – 24 (young driver fee)</option>
                                            <option value="25-69">25 – 69</option>
                                            <option value="70+">70 and over</option>
                                        </select>
                                    </Field>
                                ) : (
                                    <div ref={guestsRef} className="relative min-w-0 sm:col-span-2 lg:col-span-1">
                                        <p id={`${uid}-guests-label`} className="sr-only">
                                            {tabId === 'stays' ? 'Guests and rooms' : 'Travellers'}
                                        </p>
                                        <button
                                            ref={guestsButtonRef}
                                            type="button"
                                            aria-haspopup="dialog"
                                            aria-expanded={guestsOpen}
                                            aria-controls={`${uid}-guests`}
                                            className={cn(
                                                'flex h-full min-h-[58px] w-full items-center gap-3 rounded-2xl bg-[#f1f5f9] px-4 py-2.5 text-left ring-1 ring-transparent transition focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0369a1]',
                                                guestsOpen && 'bg-white ring-2 ring-[#0369a1]',
                                            )}
                                            onClick={() => setGuestsOpen((o) => !o)}
                                        >
                                            <LuUsers aria-hidden="true" className="size-5 shrink-0 text-[#0369a1]" />
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0b1b2b]/55">
                                                    {tabId === 'stays' ? 'Guests & rooms' : 'Travellers'}
                                                </span>
                                                <span className="mt-0.5 block truncate text-[15px] font-semibold text-[#0b1b2b]">
                                                    {guestSummary}
                                                </span>
                                            </span>
                                        </button>
                                        <AnimatePresence>
                                            {guestsOpen && (
                                                <motion.div
                                                    id={`${uid}-guests`}
                                                    role="dialog"
                                                    aria-labelledby={`${uid}-guests-label`}
                                                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : -6 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : -6 }}
                                                    transition={{ duration: 0.18 }}
                                                    className="absolute inset-x-0 top-full z-30 mt-2 origin-top rounded-2xl bg-white p-4 shadow-[0_24px_48px_-16px_rgba(3,38,63,0.45)] ring-1 ring-[#0b1b2b]/10 lg:left-auto lg:right-0 lg:w-80"
                                                >
                                                    <div className="divide-y divide-[#0b1b2b]/10">
                                                        <Stepper
                                                            label="Adults"
                                                            hint="Age 18+"
                                                            value={guests.adults}
                                                            min={1}
                                                            max={16}
                                                            onChange={(v) => setGuest('adults', v)}
                                                        />
                                                        <Stepper
                                                            label="Children"
                                                            hint="Ages 0 – 17"
                                                            value={guests.children}
                                                            min={0}
                                                            max={10}
                                                            onChange={(v) => setGuest('children', v)}
                                                        />
                                                        {tabId === 'stays' && (
                                                            <Stepper
                                                                label="Rooms"
                                                                hint="Up to one per adult"
                                                                value={guests.rooms}
                                                                min={1}
                                                                max={Math.min(8, guests.adults)}
                                                                onChange={(v) => setGuest('rooms', v)}
                                                            />
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="mt-3 min-h-11 w-full rounded-xl bg-[#0b1b2b] text-sm font-semibold text-white transition-colors hover:bg-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                                                        onClick={() => {
                                                            setGuestsOpen(false)
                                                            guestsButtonRef.current?.focus()
                                                        }}
                                                    >
                                                        Done
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-[#0369a1] px-6 text-[15px] font-semibold text-white shadow-[0_12px_24px_-12px_rgba(3,105,161,0.9)] transition-colors hover:bg-[#075985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1] sm:col-span-2 lg:col-span-1"
                                >
                                    <HiMagnifyingGlass aria-hidden="true" className="size-5" />
                                    <span className="lg:sr-only xl:not-sr-only">{tab.cta}</span>
                                </button>
                            </motion.div>
                        </AnimatePresence>

                        <div aria-live="polite" className="mt-4 min-h-6 px-1">
                            <AnimatePresence mode="wait" initial={false}>
                                {status.phase === 'idle' ? (
                                    <motion.p
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm text-[#0b1b2b]/55"
                                    >
                                        Total prices shown, taxes and fees included · no booking fees on Wayfare
                                    </motion.p>
                                ) : (
                                    <motion.div
                                        key={status.phase}
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        {status.phase === 'searching' ? (
                                            <p className="flex items-center gap-2.5 font-semibold text-[#0369a1]">
                                                <span className="relative flex size-2.5">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0369a1]/60 motion-reduce:animate-none" />
                                                    <span className="relative inline-flex size-2.5 rounded-full bg-[#0369a1]" />
                                                </span>
                                                Searching {status.count.toLocaleString('en-US')} {status.noun}{' '}
                                                {status.tabId === 'flights' ? `from ${status.origin} to` : 'in'} {status.where}…
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-[#0b1b2b]/75">
                                                    <span className="font-semibold text-[#0b1b2b]">
                                                        {status.count.toLocaleString('en-US')} {status.noun}
                                                    </span>{' '}
                                                    {status.tabId === 'flights' ? `${status.origin} → ${status.where}` : `in ${status.where}`}
                                                    {' · '}
                                                    {status.range} · {status.nights} {status.tabId === 'stays' ? 'night' : 'day'}
                                                    {status.nights > 1 ? 's' : ''}
                                                    {status.tabId !== 'cars' && ` · ${status.who}`}
                                                </p>
                                                <a
                                                    href="#wayfare-results"
                                                    className="group inline-flex min-h-10 shrink-0 items-center gap-1.5 font-semibold text-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                                                >
                                                    View results
                                                    <HiArrowLongRight
                                                        aria-hidden="true"
                                                        className="size-4 transition-transform group-hover:translate-x-1"
                                                    />
                                                </a>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </div>

                <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b1b2b]/50">
                            Popular right now
                        </span>
                        {popular.map((place) => (
                            <button
                                key={place}
                                type="button"
                                aria-pressed={where === place}
                                className={cn(
                                    'min-h-10 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]',
                                    where === place
                                        ? 'border-[#0369a1] bg-[#0369a1]/10 text-[#0369a1]'
                                        : 'border-[#0b1b2b]/15 text-[#0b1b2b]/75 hover:border-[#0369a1] hover:text-[#0369a1]',
                                )}
                                onClick={() => {
                                    setWhere(place)
                                    setErrors((e) => ({ ...e, where: undefined }))
                                }}
                            >
                                {place.split(',')[0]}
                            </button>
                        ))}
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-3 lg:flex lg:gap-6">
                        {perks.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-2.5 text-sm text-[#0b1b2b]/70">
                                <Icon aria-hidden="true" className="size-5 shrink-0 text-[#0369a1]" />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default TravelTabsBookingSearch

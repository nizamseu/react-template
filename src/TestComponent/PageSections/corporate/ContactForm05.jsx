// SlotBookingContactForm

// ContactForm05 · Corporate & Business › Contact & Lead Form

// Description:
// A self-serve call booking panel for Keystone Consulting: "Book 45 minutes with a
// partner." Visitors pick one of the next ten weekdays, choose a free time slot (taken ones
// are struck through), then add name, email, company and topic. Confirming turns the panel
// into an invitation card with the chosen date, time, host and topic, plus "Add to
// calendar", "Reschedule" and "Book another call". Use it for discovery calls or demos.

// Design:
// - White section, ink #0f172a, royal blue #1d4ed8 for selected chips, slot fills, links
//   and the confirm button; tints #eff4ff / #f8fafc, hairlines #e2e8f0
// - Host card with a round portrait and call facts; the booking card is a 16px-radius
//   bordered panel split into "1 Pick a day · 2 Pick a time" and "3 Your details"
// - Day chips: two 5-column rows labelled with their date range; each chip shows weekday,
//   big date and month (full days say "Full"); time slots are 44px pills, taken slots are
//   dimmed and struck through
// - Confirmation: a ticket card with a blue calendar tile (weekday / date / month), a
//   dashed perforation and the booking facts; it rises in with a spring (fade only for
//   reduced motion)
// - Responsive: the host card sits under the heading and the booking card is one column
//   until lg, where both split (heading 1.2fr / host 1fr, booking
//   1.35fr / 1fr); the nine slots sit in a 3 × 3 grid; the ticket stacks on base and
//   splits at sm

// What it does:
// - The server renders the ten weekdays from Mon 28 Sep 2026; after mount the list is
//   rebuilt from tomorrow's real date (a selection that is no longer listed is cleared)
// - Availability is a deterministic pattern per date, so the same day always shows the
//   same free slots; choosing a new day clears a slot that is taken on that day
// - Confirm validates day, time, name, email and topic, focuses the first problem and
//   shows the ticket (no network); "Reschedule" returns with the details kept, "Book
//   another call" clears everything. "Add to calendar" links to #keystone-add-to-calendar

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SlotBookingContactForm from '@/TestComponent/PageSections/corporate/ContactForm05';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <SlotBookingContactForm />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { HiArrowRight, HiCalendarDays, HiCheckCircle, HiOutlineClock, HiOutlineVideoCamera } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const LONG_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const LONG_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]
const CALL_MINUTES = 45

const slotTimes = ['09:00', '09:45', '10:30', '11:15', '13:00', '13:45', '14:30', '15:15', '16:00']

const topics = [
    'Operations & supply chain',
    'Pricing strategy',
    'M&A integration',
    'Digital transformation',
    'Something else',
]

const pad = (n) => String(n).padStart(2, '0')

// Next ten weekdays after `from` (not including it).
const buildDays = (from) => {
    const days = []
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
    while (days.length < 10) {
        d.setDate(d.getDate() + 1)
        const dow = d.getDay()
        if (dow !== 0 && dow !== 6) {
            const y = d.getFullYear()
            const m = d.getMonth()
            const date = d.getDate()
            const seed = y * 372 + m * 31 + date
            const taken = slotTimes.map((_, i) => (seed * 7919 + (i + 1) * ((seed % 7) + 3) * 104729) % 13 < 4)
            const full = seed % 12 === 4
            days.push({
                key: `${y}-${pad(m + 1)}-${pad(date)}`,
                dow,
                date,
                month: m,
                year: y,
                taken: full ? slotTimes.map(() => true) : taken,
                full,
            })
        }
    }
    return days
}

const SERVER_DAYS = buildDays(new Date(2026, 8, 27))

const to12h = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    const suffix = h >= 12 ? 'pm' : 'am'
    return `${((h + 11) % 12) + 1}:${pad(m)} ${suffix}`
}

const endOf = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    const total = h * 60 + m + CALL_MINUTES
    return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}

const blank = { name: '', email: '', company: '', topic: '', note: '' }

export function SlotBookingContactForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [days, setDays] = useState(SERVER_DAYS)
    const [dayKey, setDayKey] = useState('')
    const [slot, setSlot] = useState('')
    const [values, setValues] = useState(blank)
    const [touched, setTouched] = useState({})
    const [attempted, setAttempted] = useState(false)
    const [booked, setBooked] = useState(false)
    const refs = useRef({})
    const focusTarget = useRef(null)

    useEffect(() => {
        const fresh = buildDays(new Date())
        setDays(fresh)
        setDayKey((key) => (fresh.some((d) => d.key === key) ? key : ''))
    }, [])

    const day = days.find((d) => d.key === dayKey)
    const firstOpenDay = days.find((d) => !d.full)?.key
    const firstFreeSlot = day ? day.taken.findIndex((t) => !t) : -1

    const errors = {}
    if (!day) errors.day = 'Pick a day for the call.'
    if (!slot) errors.slot = day ? 'Pick one of the free times.' : 'Times appear once you pick a day.'
    if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
    if (!EMAIL_RE.test(values.email.trim())) errors.email = 'We’ll send the invite here, so it needs to be valid.'
    if (!values.topic) errors.topic = 'Choose a topic so we bring the right partner.'
    const show = (name) => ((touched[name] || attempted) && errors[name]) || undefined

    const chooseDay = (d) => {
        setDayKey(d.key)
        if (slot && d.taken[slotTimes.indexOf(slot)]) setSlot('')
    }

    const update = (name) => (e) => setValues((prev) => ({ ...prev, [name]: e.target.value }))
    const blur = (name) => () => setTouched((prev) => ({ ...prev, [name]: true }))

    const handleSubmit = (event) => {
        event.preventDefault()
        setAttempted(true)
        const first = ['day', 'slot', 'name', 'email', 'topic'].find((k) => errors[k])
        if (first) {
            if (refs.current[first]) refs.current[first].focus()
            return
        }
        focusTarget.current = 'ticket'
        setBooked(true)
    }

    const reschedule = () => {
        focusTarget.current = 'form'
        setBooked(false)
    }

    const bookAnother = () => {
        setDayKey('')
        setSlot('')
        setValues(blank)
        setTouched({})
        setAttempted(false)
        focusTarget.current = 'form'
        setBooked(false)
    }

    const focusOnMount = (target) => (el) => {
        if (el && focusTarget.current === target) {
            focusTarget.current = null
            el.focus()
        }
    }

    const register = (name) => (el) => {
        refs.current[name] = el
    }

    const errorLine = (name) =>
        show(name) ? (
            <p id={`${uid}-${name}-err`} className="mt-2 text-[13px] font-medium text-[#b91c1c]">
                {errors[name]}
            </p>
        ) : null

    const inputClass = (name) =>
        cn(
            'h-12 w-full rounded-lg border bg-white px-3.5 text-[15px] text-[#0f172a] placeholder:text-[#94a3b8] outline-none transition-[border-color,box-shadow] focus:border-[#1d4ed8] focus:shadow-[0_0_0_3px_rgba(29,78,216,0.18)]',
            show(name) ? 'border-[#b91c1c]' : 'border-[#cbd5e1] hover:border-[#94a3b8]',
        )
    const label = 'mb-1.5 block text-sm font-semibold text-[#0f172a]'

    const summary = day && slot ? `${DAY_NAMES[day.dow]} ${day.date} ${MONTHS[day.month]} · ${to12h(slot)}–${to12h(endOf(slot))} ET` : null

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-14 text-base font-normal text-[#0f172a] sm:px-6 sm:py-16 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1d4ed8]">Keystone Consulting</p>
                            <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-[#0f172a] sm:text-5xl lg:text-6xl">
                                Book 45 minutes with a partner.
                            </h2>
                            <p className="mt-4 max-w-xl text-[17px] leading-7 text-[#475569]">
                                No pitch deck. Bring one problem and we’ll leave you with a first-pass view of how we’d
                                size it, and who on our team has solved it before.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 sm:p-5">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                                alt="Priya Raman, Keystone partner, in a grey blazer"
                                loading="lazy"
                                className="h-16 w-16 shrink-0 rounded-full object-cover object-top ring-4 ring-white"
                            />
                            <div className="min-w-0">
                                <p className="text-base font-semibold text-[#0f172a]">Priya Raman</p>
                                <p className="text-sm text-[#475569]">Partner · Operations & Supply Chain</p>
                                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#475569]">
                                    <li className="flex items-center gap-1.5">
                                        <HiOutlineClock aria-hidden="true" className="text-[#1d4ed8]" />
                                        45 min
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <HiOutlineVideoCamera aria-hidden="true" className="text-[#1d4ed8]" />
                                        Zoom or Teams
                                    </li>
                                    <li>Free, no obligation</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        {booked && day ? (
                            <motion.div
                                key="ticket"
                                ref={focusOnMount('ticket')}
                                tabIndex={-1}
                                role="status"
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                                className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8] lg:mt-14"
                            >
                                <div className="flex items-center gap-2 bg-[#eff4ff] px-5 py-3 text-sm font-semibold text-[#1d4ed8] sm:px-8">
                                    <HiCheckCircle aria-hidden="true" className="text-lg" />
                                    You’re booked. A calendar invite is on its way to {values.email.trim()}.
                                </div>
                                <div className="grid sm:grid-cols-[11rem_1fr]">
                                    <div className="relative flex items-center gap-5 border-b border-dashed border-[#cbd5e1] p-6 sm:flex-col sm:justify-center sm:gap-0 sm:border-b-0 sm:border-r sm:p-8">
                                        <div className="w-24 overflow-hidden rounded-xl border border-[#1d4ed8] text-center">
                                            <p className="bg-[#1d4ed8] py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
                                                {DAY_NAMES[day.dow]}
                                            </p>
                                            <p className="py-1 text-4xl font-bold tabular-nums text-[#0f172a]">{day.date}</p>
                                            <p className="pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#475569]">
                                                {MONTHS[day.month]}
                                            </p>
                                        </div>
                                        <p className="text-sm text-[#475569] sm:mt-4 sm:text-center">
                                            {to12h(slot)}
                                            <br className="hidden sm:block" /> Eastern Time
                                        </p>
                                    </div>
                                    <div className="p-6 sm:p-8">
                                        <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#0f172a] sm:text-3xl">
                                            {values.topic}, with Priya Raman
                                        </h3>
                                        <dl className="mt-5 grid gap-4 text-[15px] sm:grid-cols-2">
                                            {[
                                                ['When', `${LONG_DAYS[day.dow]}, ${day.date} ${LONG_MONTHS[day.month]} ${day.year}`],
                                                ['Time', `${to12h(slot)} – ${to12h(endOf(slot))} ET`],
                                                ['Guest', `${values.name.trim()}${values.company.trim() ? `, ${values.company.trim()}` : ''}`],
                                                ['Where', 'Video link in the invite'],
                                            ].map(([k, v]) => (
                                                <div key={k}>
                                                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">{k}</dt>
                                                    <dd className="mt-1 font-medium text-[#0f172a]">{v}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                        <div className="mt-7 flex flex-wrap gap-3">
                                            <a
                                                href="#keystone-add-to-calendar"
                                                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1d4ed8] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                            >
                                                <HiCalendarDays aria-hidden="true" className="text-base" />
                                                Add to calendar
                                            </a>
                                            <button
                                                type="button"
                                                onClick={reschedule}
                                                className="inline-flex h-11 items-center rounded-lg border border-[#cbd5e1] px-5 text-sm font-semibold text-[#0f172a] transition-colors hover:border-[#1d4ed8] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                            >
                                                Reschedule
                                            </button>
                                            <button
                                                type="button"
                                                onClick={bookAnother}
                                                className="inline-flex h-11 items-center px-3 text-sm font-semibold text-[#475569] underline underline-offset-4 hover:text-[#0f172a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                            >
                                                Book another call
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                noValidate
                                aria-label="Book a call with Keystone"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: EASE }}
                                className="mt-10 grid overflow-hidden rounded-2xl border border-[#e2e8f0] lg:mt-14 lg:grid-cols-[1.35fr_1fr]"
                                onSubmit={handleSubmit}
                            >
                                <div className="p-5 sm:p-8">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <h3
                                            id={`${uid}-day-label`}
                                            ref={focusOnMount('form')}
                                            tabIndex={-1}
                                            className="text-lg font-bold text-[#0f172a] outline-none"
                                        >
                                            <span className="mr-2 text-[#1d4ed8]">1</span>Pick a day
                                        </h3>
                                        <p className="text-[13px] text-[#64748b]">Next 10 weekdays</p>
                                    </div>
                                    <div
                                        role="radiogroup"
                                        aria-labelledby={`${uid}-day-label`}
                                        aria-describedby={show('day') ? `${uid}-day-err` : undefined}
                                        className="mt-4 space-y-3"
                                    >
                                        {[days.slice(0, 5), days.slice(5, 10)].map((week, w) => (
                                            <div key={w}>
                                                <p aria-hidden="true" className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                                                    {week[0].date} {MONTHS[week[0].month]} – {week[4].date} {MONTHS[week[4].month]}
                                                </p>
                                                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                                                    {week.map((d) => {
                                                        const on = d.key === dayKey
                                                        const free = d.taken.filter((t) => !t).length
                                                        return (
                                                            <label
                                                                key={d.key}
                                                                className={cn('relative', d.full ? 'cursor-not-allowed' : 'cursor-pointer')}
                                                            >
                                                                <input
                                                                    ref={d.key === firstOpenDay ? register('day') : undefined}
                                                                    type="radio"
                                                                    name={`${uid}-day`}
                                                                    value={d.key}
                                                                    checked={on}
                                                                    disabled={d.full}
                                                                    aria-label={`${LONG_DAYS[d.dow]} ${d.date} ${LONG_MONTHS[d.month]}, ${d.full ? 'fully booked' : `${free} times free`}`}
                                                                    onChange={() => chooseDay(d)}
                                                                    className="peer sr-only"
                                                                />
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={cn(
                                                                        'flex min-h-[4.5rem] flex-col items-center justify-center rounded-xl border text-center transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1d4ed8]',
                                                                        on && 'border-[#1d4ed8] bg-[#1d4ed8] text-white',
                                                                        !on && !d.full && 'border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#1d4ed8]',
                                                                        d.full && 'border-dashed border-[#e2e8f0] bg-[#f8fafc] text-[#94a3b8]',
                                                                    )}
                                                                >
                                                                    <span className={cn('text-[11px] font-semibold uppercase tracking-[0.1em]', on ? 'text-white/80' : 'text-[#64748b]')}>
                                                                        {DAY_NAMES[d.dow]}
                                                                    </span>
                                                                    <span className="text-xl font-bold tabular-nums leading-tight sm:text-2xl">{d.date}</span>
                                                                    <span className={cn('text-[10px] font-medium sm:text-[11px]', on ? 'text-white/80' : 'text-[#94a3b8]')}>
                                                                        {d.full ? 'Full' : MONTHS[d.month]}
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errorLine('day')}

                                    <div className="mt-8 flex items-baseline justify-between gap-3">
                                        <h3 id={`${uid}-slot-label`} className="text-lg font-bold text-[#0f172a]">
                                            <span className="mr-2 text-[#1d4ed8]">2</span>Pick a time
                                        </h3>
                                        <p className="text-[13px] text-[#64748b]">Eastern Time (ET)</p>
                                    </div>
                                    <div
                                        role="radiogroup"
                                        aria-labelledby={`${uid}-slot-label`}
                                        aria-describedby={show('slot') ? `${uid}-slot-err` : undefined}
                                        className="mt-4 grid grid-cols-3 gap-2"
                                    >
                                        {slotTimes.map((t, i) => {
                                            const taken = !day || day.taken[i]
                                            const on = slot === t && !taken
                                            return (
                                                <label key={t} className={cn('relative', taken ? 'cursor-not-allowed' : 'cursor-pointer')}>
                                                    <input
                                                        ref={i === firstFreeSlot ? register('slot') : undefined}
                                                        type="radio"
                                                        name={`${uid}-slot`}
                                                        value={t}
                                                        checked={on}
                                                        disabled={taken}
                                                        onChange={() => setSlot(t)}
                                                        className="peer sr-only"
                                                    />
                                                    <span
                                                        className={cn(
                                                            'flex h-11 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1d4ed8]',
                                                            on && 'border-[#1d4ed8] bg-[#1d4ed8] text-white',
                                                            !on && !taken && 'border-[#bfd0fb] bg-[#eff4ff] text-[#1d4ed8] hover:border-[#1d4ed8]',
                                                            taken && day && 'border-[#f1f5f9] bg-white text-[#cbd5e1] line-through',
                                                            !day && 'border-[#f1f5f9] bg-[#f8fafc] text-[#cbd5e1]',
                                                        )}
                                                    >
                                                        {to12h(t)}
                                                        {taken && day && <span className="sr-only"> (taken)</span>}
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                    {errorLine('slot')}
                                    {!day && !show('slot') && <p className="mt-2 text-[13px] text-[#64748b]">Times appear once you pick a day.</p>}
                                </div>

                                <div className="border-t border-[#e2e8f0] bg-[#f8fafc] p-5 sm:p-8 lg:border-l lg:border-t-0">
                                    <h3 className="text-lg font-bold text-[#0f172a]">
                                        <span className="mr-2 text-[#1d4ed8]">3</span>Your details
                                    </h3>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                        <div>
                                            <label htmlFor={`${uid}-name`} className={label}>
                                                Full name
                                            </label>
                                            <input
                                                id={`${uid}-name`}
                                                ref={register('name')}
                                                type="text"
                                                autoComplete="name"
                                                placeholder="Marcus Bell"
                                                value={values.name}
                                                aria-invalid={Boolean(show('name'))}
                                                aria-describedby={show('name') ? `${uid}-name-err` : undefined}
                                                className={inputClass('name')}
                                                onChange={update('name')}
                                                onBlur={blur('name')}
                                            />
                                            {errorLine('name')}
                                        </div>
                                        <div>
                                            <label htmlFor={`${uid}-email`} className={label}>
                                                Work email
                                            </label>
                                            <input
                                                id={`${uid}-email`}
                                                ref={register('email')}
                                                type="email"
                                                autoComplete="email"
                                                placeholder="marcus@fieldstone.com"
                                                value={values.email}
                                                aria-invalid={Boolean(show('email'))}
                                                aria-describedby={show('email') ? `${uid}-email-err` : undefined}
                                                className={inputClass('email')}
                                                onChange={update('email')}
                                                onBlur={blur('email')}
                                            />
                                            {errorLine('email')}
                                        </div>
                                        <div>
                                            <label htmlFor={`${uid}-company`} className={label}>
                                                Company <span className="font-normal text-[#64748b]">(optional)</span>
                                            </label>
                                            <input
                                                id={`${uid}-company`}
                                                type="text"
                                                autoComplete="organization"
                                                placeholder="Fieldstone Foods"
                                                value={values.company}
                                                className={inputClass('company')}
                                                onChange={update('company')}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`${uid}-topic`} className={label}>
                                                Topic
                                            </label>
                                            <select
                                                id={`${uid}-topic`}
                                                ref={register('topic')}
                                                value={values.topic}
                                                aria-invalid={Boolean(show('topic'))}
                                                aria-describedby={show('topic') ? `${uid}-topic-err` : undefined}
                                                className={cn(inputClass('topic'), 'cursor-pointer', !values.topic && 'text-[#94a3b8]')}
                                                onChange={update('topic')}
                                                onBlur={blur('topic')}
                                            >
                                                <option value="" disabled>
                                                    Choose a topic
                                                </option>
                                                {topics.map((t) => (
                                                    <option key={t} value={t} className="text-[#0f172a]">
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                            {errorLine('topic')}
                                        </div>
                                        <div className="sm:col-span-2 lg:col-span-1">
                                            <label htmlFor={`${uid}-note`} className={label}>
                                                Anything to prepare? <span className="font-normal text-[#64748b]">(optional)</span>
                                            </label>
                                            <textarea
                                                id={`${uid}-note`}
                                                rows={3}
                                                maxLength={500}
                                                placeholder="We run 14 DCs and our cost-to-serve jumped 9% this year…"
                                                value={values.note}
                                                className={cn(inputClass('note'), 'h-auto resize-y py-3 leading-6')}
                                                onChange={update('note')}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-xl border border-[#e2e8f0] bg-white p-4" aria-live="polite">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Your slot</p>
                                        <p className={cn('mt-1 text-[15px] font-semibold', summary ? 'text-[#0f172a]' : 'text-[#94a3b8]')}>
                                            {summary || 'No time chosen yet'}
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="group mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                    >
                                        Confirm booking
                                        <HiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                    <p className="mt-3 text-center text-[12px] text-[#64748b]">
                                        You can reschedule or cancel from the invite at any time.
                                    </p>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </MotionConfig>
        </section>
    )
}

export default SlotBookingContactForm

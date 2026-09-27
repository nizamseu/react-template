// AvailabilityCalendarContactSocials

// ContactSocials05 · Portfolios & Personal Websites › Contact / Socials

// Description:
// A terminal-flavoured booking block for backend engineer Nadia Karim. Under the heading
// "Four weeks out. Pick a week." an availability grid shows the next four working weeks day
// by day as open, on hold or booked; choosing a week loads a "Request a slot" form (name,
// email, engagement type, preferred days, short brief) that answers with a queued request
// ticket and marks the requested days on the grid. Use it as the contact section of a
// freelance engineer’s or consultant’s portfolio.

// Design:
// - Two columns from lg (grid-cols-[1.2fr_1fr]): legend, four week rows and totals on the
//   left; a #111111 form panel with a shell-prompt header on the right
// - Near-black #0c0c0c background, #e6edf3 text, green #7ee787 for open days, selection
//   rings, buttons and prompts; holds use a green hatch, booked days #1a1a1a with dim text,
//   errors #ff7b72
// - Mono type throughout (font-mono) with a tight text-4xl → lg:text-6xl heading; rows and
//   panels rounded-xl/2xl with white/10 hairlines; day cells h-14 with day number + label
// - Form ↔ ticket crossfade with AnimatePresence and a blinking cursor on the ticket; both
//   become instant/static for reduced motion
// - Responsive: base puts each week label above its five day cells and stacks the form
//   under the grid; sm adds a Mon–Fri header and a 168px label column; lg places the form
//   beside the grid

// What it does:
// - Dates render from a fixed Monday (28 Sep 2026) on the server, then useEffect moves the
//   grid to the coming Monday; ISO week numbers and ranges are derived from that date
// - selectedWeek (aria-pressed week buttons; fully booked weeks are disabled) drives the
//   day checkboxes; the form validates name, email, engagement, at least one day and a
//   15–400 character brief, focusing the first invalid field
// - A valid submit (preventDefault, no network) shows "Queuing…" for 0.7 s (timer cleared
//   on unmount), then a REQ ticket; requested days turn into "you" holds on the grid and
//   the totals line counts them; links point to #github, #linkedin, #email and #pgp

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AvailabilityCalendarContactSocials from '@/TestComponent/PageSections/portfolio/ContactSocials05';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <AvailabilityCalendarContactSocials />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { HiOutlineEnvelope, HiOutlineKey } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const DAY = 86400000
const INITIAL_START = Date.UTC(2026, 8, 28)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const schedule = [
    { days: ['booked', 'booked', 'tentative', 'open', 'open'], note: 'wrapping up a Postgres 16 migration' },
    { days: ['booked', 'booked', 'booked', 'booked', 'booked'], note: 'on-site with a payments client' },
    { days: ['open', 'open', 'tentative', 'booked', 'open'], note: 'mostly free — Thursday is a workshop' },
    { days: ['tentative', 'open', 'open', 'open', 'open'], note: 'wide open after a conference talk' },
]

const engagements = [
    'Architecture review (2–3 days)',
    'API or service build',
    'Performance & Postgres tuning',
    'Incident / on-call cover',
]

const statusLabel = { open: 'open', tentative: 'hold', booked: 'busy' }
const EMPTY = { name: '', email: '', engagement: '', brief: '' }

const links = [
    { id: 'github', label: 'github/nkarim', icon: FaGithub },
    { id: 'linkedin', label: 'in/nadia-karim', icon: FaLinkedinIn },
    { id: 'email', label: 'nadia@karim.sh', icon: HiOutlineEnvelope },
    { id: 'pgp', label: 'PGP key', icon: HiOutlineKey },
]

function comingMonday() {
    const now = new Date()
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    const weekday = new Date(today).getUTCDay()
    const add = weekday === 1 ? 0 : (8 - weekday) % 7
    return today + add * DAY
}

function isoWeek(ms) {
    const date = new Date(ms)
    const weekday = date.getUTCDay() || 7
    date.setUTCDate(date.getUTCDate() + 4 - weekday)
    const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1)
    return Math.ceil(((date.getTime() - yearStart) / DAY + 1) / 7)
}

const dayOf = (ms) => new Date(ms).getUTCDate()
const shortDate = (ms) => `${dayOf(ms)} ${MONTHS[new Date(ms).getUTCMonth()]}`

function buildWeeks(start) {
    return schedule.map((week, index) => {
        const monday = start + index * 7 * DAY
        const friday = monday + 4 * DAY
        const counts = { open: 0, tentative: 0, booked: 0 }
        week.days.forEach((status) => {
            counts[status] += 1
        })
        return {
            ...week,
            index,
            number: isoWeek(monday),
            dates: week.days.map((_, day) => monday + day * DAY),
            range: `${shortDate(monday)} – ${shortDate(friday)}`,
            counts,
            full: counts.open + counts.tentative === 0,
        }
    })
}

function validate(values, days) {
    const errors = {}
    if (values.name.trim().length < 2) errors.name = 'name: required (2+ characters)'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'email: expected you@company.com'
    if (!values.engagement) errors.engagement = 'engagement: pick one'
    if (days.length === 0) errors.days = 'days: select at least one open or held day'
    const length = values.brief.trim().length
    if (length < 15) errors.brief = `brief: ${15 - length} more characters needed`
    else if (length > 400) errors.brief = 'brief: max 400 characters'
    return errors
}

const fieldClass =
    'mt-1.5 w-full rounded-lg bg-[#0c0c0c] px-3.5 py-2.5 font-mono text-sm text-[#e6edf3] ring-1 placeholder:text-[#e6edf3]/30 focus:outline-none focus:ring-2 focus:ring-[#7ee787]'

export function AvailabilityCalendarContactSocials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [start, setStart] = useState(INITIAL_START)
    const [selectedWeek, setSelectedWeek] = useState(0)
    const [days, setDays] = useState([])
    const [values, setValues] = useState(EMPTY)
    const [touched, setTouched] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [status, setStatus] = useState('idle')
    const [ticket, setTicket] = useState(null)
    const [holds, setHolds] = useState([])
    const timer = useRef(null)
    const refs = { name: useRef(null), email: useRef(null), engagement: useRef(null), days: useRef(null), brief: useRef(null) }

    useEffect(() => {
        setStart(comingMonday())
    }, [])

    useEffect(() => () => clearTimeout(timer.current), [])

    const weeks = buildWeeks(start)
    const week = weeks[selectedWeek]
    const isHeld = (w, d) => holds.some((hold) => hold.week === w && hold.day === d)
    const selectable = week.days
        .map((statusName, day) => ({ status: statusName, day }))
        .filter((item) => item.status !== 'booked' && !isHeld(selectedWeek, item.day))

    const totals = { open: 0, tentative: 0, booked: 0, requested: 0 }
    weeks.forEach((item) =>
        item.days.forEach((statusName, day) => {
            totals[isHeld(item.index, day) ? 'requested' : statusName] += 1
        }),
    )

    const errors = validate(values, days)
    const show = (field) => (touched[field] || submitted) && errors[field]

    const pickWeek = (index) => {
        setSelectedWeek(index)
        setDays([])
        setTouched((prev) => ({ ...prev, days: false }))
    }

    const toggleDay = (day) => {
        setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()))
        setTouched((prev) => ({ ...prev, days: true }))
    }

    const update = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))
    const blur = (field) => () => setTouched((prev) => ({ ...prev, [field]: true }))

    const handleSubmit = (event) => {
        event.preventDefault()
        if (status === 'sending') return
        setSubmitted(true)
        const first = ['name', 'email', 'engagement', 'days', 'brief'].find((field) => errors[field])
        if (first) {
            const target = refs[first].current
            if (first === 'days') target?.querySelector('input')?.focus()
            else target?.focus()
            return
        }
        setStatus('sending')
        const request = {
            id: `REQ-${week.number}-${100 + ((values.name.length * 37 + values.email.length * 11) % 900)}`,
            week: week.number,
            weekIndex: selectedWeek,
            range: week.range,
            days: [...days],
            engagement: values.engagement,
            email: values.email.trim(),
        }
        timer.current = setTimeout(() => {
            setTicket(request)
            setHolds((prev) => [...prev, ...request.days.map((day) => ({ week: request.weekIndex, day }))])
            setStatus('sent')
        }, 700)
    }

    const reset = () => {
        setValues(EMPTY)
        setDays([])
        setTouched({})
        setSubmitted(false)
        setTicket(null)
        setStatus('idle')
    }

    const fade = {
        initial: { opacity: 0, y: reduceMotion ? 0 : 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: reduceMotion ? 0 : -6 },
        transition: { duration: 0.3, ease: 'easeOut' },
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0c0c0c] px-4 py-16 font-mono text-base font-normal text-[#e6edf3] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <p className="text-xs text-[#7ee787]">
                    <span className="text-[#e6edf3]/45">~/nadia $</span> cal --next 4w --tz America/Toronto
                </p>
                <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <h2 className="max-w-3xl font-mono text-4xl font-semibold leading-[1.05] tracking-tight text-[#e6edf3] sm:text-5xl lg:text-6xl">
                        Four weeks out. <span className="text-[#7ee787]">Pick a week.</span>
                    </h2>
                    <p className="max-w-sm text-sm leading-relaxed text-[#e6edf3]/60">
                        Backend engineer for APIs, queues and Postgres. I book in day blocks from Toronto (ET);
                        holds may still move, booked days won’t.
                    </p>
                </div>

                <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
                    <div>
                        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[#e6edf3]/60" aria-label="Legend">
                            <li className="flex items-center gap-2">
                                <span aria-hidden="true" className="size-3 rounded-sm bg-[#7ee787]" /> open
                            </li>
                            <li className="flex items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className="size-3 rounded-sm bg-[repeating-linear-gradient(135deg,rgba(126,231,135,0.5)_0_2px,transparent_2px_4px)] ring-1 ring-[#7ee787]/60"
                                />{' '}
                                hold
                            </li>
                            <li className="flex items-center gap-2">
                                <span aria-hidden="true" className="size-3 rounded-sm bg-[#1f1f1f] ring-1 ring-white/10" /> booked
                            </li>
                            <li className="flex items-center gap-2">
                                <span aria-hidden="true" className="size-3 rounded-sm ring-2 ring-[#e6edf3]" /> your request
                            </li>
                        </ul>

                        <div className="mt-5 hidden grid-cols-[168px_repeat(5,minmax(0,1fr))] gap-2 px-3 text-[10px] uppercase tracking-[0.18em] text-[#e6edf3]/40 sm:grid">
                            <span>Week</span>
                            {DAY_NAMES.map((name) => (
                                <span key={name}>{name}</span>
                            ))}
                        </div>

                        <div role="group" aria-label="Availability for the next four weeks" className="mt-3 space-y-2.5 sm:mt-2">
                            {weeks.map((item) => {
                                const active = item.index === selectedWeek
                                return (
                                    <button
                                        key={item.index}
                                        type="button"
                                        disabled={item.full}
                                        aria-pressed={active}
                                        aria-label={`Week ${item.number}, ${item.range}: ${item.counts.open} open, ${item.counts.tentative} on hold, ${item.counts.booked} booked${item.full ? ', fully booked' : ''}`}
                                        className={cn(
                                            'grid w-full grid-cols-5 gap-2 rounded-xl p-3 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787] sm:grid-cols-[168px_repeat(5,minmax(0,1fr))]',
                                            active
                                                ? 'bg-[#7ee787]/[0.07] ring-2 ring-[#7ee787]'
                                                : 'ring-1 ring-white/10 hover:bg-white/[0.03] hover:ring-white/25',
                                            item.full && 'cursor-not-allowed opacity-55 hover:bg-transparent hover:ring-white/10',
                                        )}
                                        onClick={() => pickWeek(item.index)}
                                    >
                                        <span className="col-span-5 flex items-baseline justify-between gap-3 pb-1 sm:col-span-1 sm:flex-col sm:justify-center sm:gap-0.5 sm:pb-0">
                                            <span className={cn('text-sm font-semibold', active ? 'text-[#7ee787]' : 'text-[#e6edf3]')}>
                                                {active ? '▸ ' : ''}W{item.number}
                                            </span>
                                            <span className="text-[11px] text-[#e6edf3]/55">
                                                {item.full ? 'fully booked' : item.range}
                                            </span>
                                        </span>
                                        {item.days.map((statusName, day) => {
                                            const held = isHeld(item.index, day)
                                            return (
                                                <span
                                                    key={day}
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'flex h-14 flex-col justify-between rounded-md px-2 py-1.5 text-[10px] leading-none',
                                                        statusName === 'open' && 'bg-[#7ee787] text-[#0c0c0c]',
                                                        statusName === 'tentative' &&
                                                            'bg-[repeating-linear-gradient(135deg,rgba(126,231,135,0.28)_0_4px,transparent_4px_8px)] text-[#7ee787] ring-1 ring-inset ring-[#7ee787]/55',
                                                        statusName === 'booked' && 'bg-[#1a1a1a] text-[#e6edf3]/30',
                                                        held && 'bg-[#0c0c0c] bg-none text-[#e6edf3] ring-2 ring-inset ring-[#e6edf3]',
                                                    )}
                                                >
                                                    <span className="text-xs font-semibold">
                                                        <span className="sm:hidden">{DAY_NAMES[day].slice(0, 2)} </span>
                                                        {dayOf(item.dates[day])}
                                                    </span>
                                                    <span className={cn(statusName === 'booked' && !held && 'line-through')}>
                                                        {held ? 'you' : statusLabel[statusName]}
                                                    </span>
                                                </span>
                                            )
                                        })}
                                    </button>
                                )
                            })}
                        </div>

                        <p className="mt-5 text-xs text-[#e6edf3]/55">
                            <span className="text-[#7ee787]">{totals.open}</span> open ·{' '}
                            <span className="text-[#7ee787]">{totals.tentative}</span> on hold · {totals.booked} booked
                            {totals.requested > 0 && (
                                <>
                                    {' · '}
                                    <span className="text-[#e6edf3]">{totals.requested}</span> requested by you
                                </>
                            )}
                            <span className="text-[#e6edf3]/35">{` // ${week.note}`}</span>
                        </p>

                        <ul className="mt-8 flex flex-wrap gap-2">
                            {links.map((link) => {
                                const Icon = link.icon
                                return (
                                    <li key={link.id}>
                                        <a
                                            href={`#${link.id}`}
                                            className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs text-[#e6edf3]/80 ring-1 ring-white/15 transition-colors hover:text-[#7ee787] hover:ring-[#7ee787]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787]"
                                        >
                                            <Icon aria-hidden="true" className="size-4" />
                                            {link.label}
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="self-start overflow-hidden rounded-2xl bg-[#111111] ring-1 ring-white/10">
                        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-[11px] text-[#e6edf3]/50">
                            <span aria-hidden="true" className="flex gap-1.5">
                                <span className="size-2.5 rounded-full bg-[#ff7b72]/80" />
                                <span className="size-2.5 rounded-full bg-[#e3b341]/80" />
                                <span className="size-2.5 rounded-full bg-[#7ee787]/80" />
                            </span>
                            <span className="ml-2 truncate">request-slot --week {week.number}</span>
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            {status === 'sent' && ticket ? (
                                <motion.div key="ticket" {...fade} role="status" className="p-5 text-sm leading-relaxed sm:p-7">
                                    <p className="text-[#e6edf3]/45">
                                        $ request-slot --week {ticket.week} --days{' '}
                                        {ticket.days.map((day) => DAY_NAMES[day].toLowerCase()).join(',')}
                                    </p>
                                    <h3 className="mt-4 font-mono text-2xl font-semibold text-[#7ee787]">✓ {ticket.id} queued</h3>
                                    <p className="mt-3 text-[#e6edf3]/80">
                                        → W{ticket.week} · {ticket.range} ·{' '}
                                        {ticket.days.map((day) => DAY_NAMES[day]).join(', ')}
                                    </p>
                                    <p className="text-[#e6edf3]/80">→ {ticket.engagement}</p>
                                    <p className="text-[#e6edf3]/80">
                                        → confirmation to <span className="text-[#7ee787]">{ticket.email}</span> within 24 h (ET)
                                    </p>
                                    <p className="mt-4 text-[#e6edf3]/45">
                                        exit 0
                                        <motion.span
                                            aria-hidden="true"
                                            className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[#7ee787]"
                                            animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0, 1] }}
                                            transition={reduceMotion ? { duration: 0 } : { duration: 1, repeat: Infinity }}
                                        />
                                    </p>
                                    <button
                                        type="button"
                                        className="mt-8 inline-flex min-h-11 items-center rounded-lg px-4 text-sm text-[#7ee787] ring-1 ring-[#7ee787]/50 transition-colors hover:bg-[#7ee787] hover:text-[#0c0c0c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787]"
                                        onClick={reset}
                                    >
                                        New request
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form key="form" {...fade} noValidate className="p-5 sm:p-7" onSubmit={handleSubmit}>
                                    <h3 className="font-mono text-xl font-semibold text-[#e6edf3]">Request a slot</h3>
                                    <p className="mt-1 text-xs text-[#e6edf3]/55">
                                        W{week.number} · {week.range} · {selectable.length} day{selectable.length === 1 ? '' : 's'} available
                                    </p>

                                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                        {['name', 'email'].map((field) => (
                                            <div key={field}>
                                                <label htmlFor={`nadia-${field}`} className="text-[11px] text-[#e6edf3]/60">
                                                    {field === 'name' ? '--name' : '--email'}
                                                </label>
                                                <input
                                                    ref={refs[field]}
                                                    id={`nadia-${field}`}
                                                    type={field === 'email' ? 'email' : 'text'}
                                                    autoComplete={field === 'email' ? 'email' : 'name'}
                                                    placeholder={field === 'email' ? 'you@company.com' : 'Jordan Reyes'}
                                                    value={values[field]}
                                                    aria-invalid={show(field) ? true : undefined}
                                                    aria-describedby={show(field) ? `nadia-${field}-error` : undefined}
                                                    className={cn(fieldClass, show(field) ? 'ring-[#ff7b72]' : 'ring-white/15')}
                                                    onChange={update(field)}
                                                    onBlur={blur(field)}
                                                />
                                                {show(field) && (
                                                    <p id={`nadia-${field}-error`} className="mt-1.5 text-[11px] text-[#ff7b72]">
                                                        {errors[field]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor="nadia-engagement" className="text-[11px] text-[#e6edf3]/60">
                                            --engagement
                                        </label>
                                        <select
                                            ref={refs.engagement}
                                            id="nadia-engagement"
                                            value={values.engagement}
                                            aria-invalid={show('engagement') ? true : undefined}
                                            aria-describedby={show('engagement') ? 'nadia-engagement-error' : undefined}
                                            className={cn(fieldClass, 'min-h-11', show('engagement') ? 'ring-[#ff7b72]' : 'ring-white/15')}
                                            onChange={update('engagement')}
                                            onBlur={blur('engagement')}
                                        >
                                            <option value="">Choose an engagement…</option>
                                            {engagements.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        {show('engagement') && (
                                            <p id="nadia-engagement-error" className="mt-1.5 text-[11px] text-[#ff7b72]">
                                                {errors.engagement}
                                            </p>
                                        )}
                                    </div>

                                    <fieldset
                                        ref={refs.days}
                                        className="mt-4"
                                        aria-describedby={show('days') ? 'nadia-days-error' : undefined}
                                    >
                                        <legend className="text-[11px] text-[#e6edf3]/60">--days</legend>
                                        {selectable.length === 0 ? (
                                            <p className="mt-2 text-xs text-[#e6edf3]/50">
                                                Nothing left this week — pick another one on the grid.
                                            </p>
                                        ) : (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectable.map((item) => {
                                                    const checked = days.includes(item.day)
                                                    return (
                                                        <label
                                                            key={item.day}
                                                            className={cn(
                                                                'inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-xs transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#7ee787]',
                                                                checked
                                                                    ? 'bg-[#7ee787] text-[#0c0c0c]'
                                                                    : 'text-[#e6edf3] ring-1 ring-white/15 hover:ring-[#7ee787]/60',
                                                            )}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                className="sr-only"
                                                                onChange={() => toggleDay(item.day)}
                                                            />
                                                            <span aria-hidden="true">{checked ? '[x]' : '[ ]'}</span>
                                                            {DAY_NAMES[item.day]} {dayOf(week.dates[item.day])}
                                                            {item.status === 'tentative' && (
                                                                <span className={checked ? 'text-[#0c0c0c]/60' : 'text-[#7ee787]/80'}>hold</span>
                                                            )}
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        )}
                                        {show('days') && (
                                            <p id="nadia-days-error" className="mt-1.5 text-[11px] text-[#ff7b72]">
                                                {errors.days}
                                            </p>
                                        )}
                                    </fieldset>

                                    <div className="mt-4">
                                        <div className="flex items-baseline justify-between gap-4">
                                            <label htmlFor="nadia-brief" className="text-[11px] text-[#e6edf3]/60">
                                                --brief
                                            </label>
                                            <span className="text-[10px] tabular-nums text-[#e6edf3]/40">
                                                {values.brief.length}/400
                                            </span>
                                        </div>
                                        <textarea
                                            ref={refs.brief}
                                            id="nadia-brief"
                                            rows={3}
                                            placeholder="Our Node API times out under Black Friday load…"
                                            value={values.brief}
                                            aria-invalid={show('brief') ? true : undefined}
                                            aria-describedby={show('brief') ? 'nadia-brief-error' : undefined}
                                            className={cn(fieldClass, 'resize-none', show('brief') ? 'ring-[#ff7b72]' : 'ring-white/15')}
                                            onChange={update('brief')}
                                            onBlur={blur('brief')}
                                        />
                                        {show('brief') && (
                                            <p id="nadia-brief-error" className="mt-1.5 text-[11px] text-[#ff7b72]">
                                                {errors.brief}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#7ee787] px-5 text-sm font-semibold text-[#0c0c0c] transition-colors hover:bg-[#a5f0ab] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787] disabled:cursor-wait disabled:opacity-80"
                                    >
                                        {status === 'sending' ? 'Queuing…' : `$ request W${week.number}`}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AvailabilityCalendarContactSocials

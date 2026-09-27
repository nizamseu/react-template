// BoardingPassBookingSummary

// BookingSummary03 · Booking & Reservations › Booking Summary & Add-ons

// Description:
// A restaurant reservation for Saffron Room rendered as a cream boarding-pass ticket on
// a burgundy page: "Your table is set." above a pass for Amara Okafor with date, time,
// party, table, menu and occasion, a pre-paid bill with its maths, a tear line and a
// stub with a QR-style code. "Add to calendar" offers an .ics download and "Modify"
// opens a dialog to change the day, time, party size, wine pairings and notes. Use it
// on a booking confirmation page or in a "My reservations" area.

// Design:
// - Burgundy #4a0e1a section, cream #f6ecd9 ticket, stub #efdcb8, gold #c9a44c accents,
//   ink text #3a0a14; a slowly turning dashed gold rosette sits behind the ticket
// - Ticket: stacked with a horizontal tear line at base, side-by-side with a vertical
//   dashed tear line from md; round burgundy notches at both ends of the tear line;
//   drop-shadow filter, rounded-3xl, serif display names and mono labels/codes
// - Details grid 2 cols → 3 cols from sm; bill lines use tabular mono numbers; QR drawn
//   as one SVG path (25×25 modules, three finder squares) with a gold centre badge
// - Modify dialog: bottom sheet on mobile, centred 34rem card from sm, burgundy chips
//   and steppers; toast confirms changes; motion is fade/slide, rosette spin off when
//   reduced

// What it does:
// - State: the reservation (date, time, party 2–8, pairings ≤ party, occasion, notes),
//   a draft copy while the dialog is open, dialog/popover flags, errors and a toast
//   message
// - Bill = party × $128 tasting menu + pairings × $68 + 12.5% service − $25 × party
//   deposit; lines re-render with the maths whenever the reservation changes
// - Modify: validates time (cleared if the new day has it full) and notes ≤ 160 chars,
//   saves and shows a toast (timer cleared on unmount); Escape or the backdrop closes
//   it, Tab is trapped inside and focus returns to "Modify"
// - Add to calendar: popover (Escape/outside click closes) with a generated .ics
//   download and a #add-to-google-calendar link; "Directions" links to
//   #saffron-room-directions

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BoardingPassBookingSummary from '@/TestComponent/PageSections/booking/BookingSummary03';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <BoardingPassBookingSummary />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCalendarDays, HiCheck, HiMapPin, HiMinus, HiPencilSquare, HiPlus, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const MENU_PRICE = 128
const PAIRING_PRICE = 68
const SERVICE_RATE = 0.125
const DEPOSIT = 25
const CODE = 'SR-4821-KQ'
const NOTES_MAX = 160

const days = [
    { id: '2026-10-16', label: 'Fri 16 Oct', long: 'Friday 16 October 2026', full: ['19:45', '20:15'] },
    { id: '2026-10-17', label: 'Sat 17 Oct', long: 'Saturday 17 October 2026', full: ['19:00', '19:45'] },
    { id: '2026-10-18', label: 'Sun 18 Oct', long: 'Sunday 18 October 2026', full: ['18:00', '21:30'] },
    { id: '2026-10-22', label: 'Thu 22 Oct', long: 'Thursday 22 October 2026', full: [] },
]
const slots = ['18:00', '18:30', '19:00', '19:45', '20:15', '21:00', '21:30']
const occasions = ['None', 'Anniversary', 'Birthday', 'Business dinner', 'Proposal']

const initialBooking = { day: '2026-10-17', time: '20:15', party: 4, pairings: 2, occasion: 'Anniversary', notes: 'One guest is pescatarian.' }

const dayOf = (id) => days.find((d) => d.id === id) || days[0]
const tableFor = (party) => (party <= 2 ? 'Alcove · T4' : party <= 4 ? 'Window banquette · T12' : 'Garden table · T20')

function fmtTime(t) {
    const [h, m] = t.split(':').map(Number)
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} pm`
}

function money(n) {
    const v = Math.round(n * 100) / 100
    const [int, dec] = Math.abs(v).toFixed(2).split('.')
    return `${v < 0 ? '−' : ''}$${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`
}

function qrPath(seed) {
    const n = 25
    let h = 2166136261
    for (const c of seed) {
        h ^= c.charCodeAt(0)
        h = Math.imul(h, 16777619)
    }
    const rand = () => {
        h ^= h << 13
        h ^= h >>> 17
        h ^= h << 5
        return (h >>> 0) / 4294967296
    }
    const finder = (x, y) => {
        for (const [fx, fy] of [
            [0, 0],
            [n - 7, 0],
            [0, n - 7],
        ]) {
            const dx = x - fx
            const dy = y - fy
            if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
                if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return 0
                const ring = Math.min(dx, dy, 6 - dx, 6 - dy)
                return ring === 1 ? 0 : 1
            }
        }
        return -1
    }
    let d = ''
    for (let y = 0; y < n; y += 1) {
        for (let x = 0; x < n; x += 1) {
            const f = finder(x, y)
            const centre = x >= 10 && x <= 14 && y >= 10 && y <= 14
            const on = f === -1 ? !centre && rand() > 0.52 : f === 1
            if (on) d += `M${x} ${y}h1v1h-1z`
        }
    }
    return d
}

function Stepper({ label, value, min, max, onChange }) {
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                aria-label={`Fewer ${label}`}
                disabled={value <= min}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#4a0e1a]/25 text-[#4a0e1a] transition-colors hover:bg-[#4a0e1a] hover:text-[#f6ecd9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c] disabled:pointer-events-none disabled:opacity-30"
                onClick={() => onChange(value - 1)}
            >
                <HiMinus aria-hidden="true" />
            </button>
            <span aria-live="polite" className="w-8 text-center font-mono text-lg text-[#3a0a14]">
                {value}
                <span className="sr-only"> {label}</span>
            </span>
            <button
                type="button"
                aria-label={`More ${label}`}
                disabled={value >= max}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#4a0e1a]/25 text-[#4a0e1a] transition-colors hover:bg-[#4a0e1a] hover:text-[#f6ecd9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c] disabled:pointer-events-none disabled:opacity-30"
                onClick={() => onChange(value + 1)}
            >
                <HiPlus aria-hidden="true" />
            </button>
        </div>
    )
}

export function BoardingPassBookingSummary({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduce = useReducedMotion()
    const [booking, setBooking] = useState(initialBooking)
    const [draft, setDraft] = useState(initialBooking)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [calOpen, setCalOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [toast, setToast] = useState('')
    const modifyRef = useRef(null)
    const panelRef = useRef(null)
    const calRef = useRef(null)
    const toastTimer = useRef(null)
    const path = useMemo(() => qrPath(CODE), [])

    const day = dayOf(booking.day)
    const menuTotal = booking.party * MENU_PRICE
    const pairingTotal = booking.pairings * PAIRING_PRICE
    const service = (menuTotal + pairingTotal) * SERVICE_RATE
    const deposit = booking.party * DEPOSIT
    const due = menuTotal + pairingTotal + service - deposit

    useEffect(() => () => clearTimeout(toastTimer.current), [])

    useEffect(() => {
        if (!dialogOpen) return undefined
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const first = panelRef.current?.querySelector('button, input, select, textarea')
        first?.focus()
        return () => {
            document.body.style.overflow = previous
        }
    }, [dialogOpen])

    useEffect(() => {
        if (!calOpen) return undefined
        const onDown = (event) => {
            if (calRef.current && !calRef.current.contains(event.target)) setCalOpen(false)
        }
        document.addEventListener('pointerdown', onDown)
        return () => document.removeEventListener('pointerdown', onDown)
    }, [calOpen])

    const showToast = (message) => {
        setToast(message)
        clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToast(''), 4000)
    }

    const openDialog = () => {
        setDraft(booking)
        setErrors({})
        setDialogOpen(true)
    }

    const closeDialog = () => {
        setDialogOpen(false)
        modifyRef.current?.focus()
    }

    const updateDraft = (patch) => {
        setErrors({})
        setDraft((d) => {
            const nextDraft = { ...d, ...patch }
            if (nextDraft.pairings > nextDraft.party) nextDraft.pairings = nextDraft.party
            if (patch.day && dayOf(patch.day).full.includes(nextDraft.time)) nextDraft.time = ''
            return nextDraft
        })
    }

    const save = (event) => {
        event.preventDefault()
        const e = {}
        if (!draft.time) e.time = 'That time is fully booked on the new day — pick another slot.'
        if (draft.notes.length > NOTES_MAX) e.notes = `Keep notes under ${NOTES_MAX} characters.`
        setErrors(e)
        if (Object.keys(e).length) return
        setBooking(draft)
        closeDialog()
        showToast(`Updated: ${dayOf(draft.day).label}, ${fmtTime(draft.time)} for ${draft.party}. We've emailed Amara.`)
    }

    const trapTab = (event) => {
        if (event.key === 'Escape') {
            event.stopPropagation()
            closeDialog()
            return
        }
        if (event.key !== 'Tab' || !panelRef.current) return
        const items = [...panelRef.current.querySelectorAll('button:not([disabled]), input, select, textarea')]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }

    const downloadIcs = () => {
        const [y, mo, d] = booking.day.split('-')
        const [hh, mm] = booking.time.split(':')
        const start = `${y}${mo}${d}T${hh}${mm}00`
        const endH = String(Number(hh) + 3).padStart(2, '0')
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Saffron Room//Reservations//EN',
            'BEGIN:VEVENT',
            `UID:${CODE}@saffronroom.example`,
            `DTSTART:${start}`,
            `DTEND:${y}${mo}${d}T${endH}${mm}00`,
            `SUMMARY:Saffron Room · table for ${booking.party}`,
            'LOCATION:Saffron Room, 18 Mercer Lane',
            `DESCRIPTION:Reservation ${CODE} · ${tableFor(booking.party)}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n')
        const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
        const link = document.createElement('a')
        link.href = url
        link.download = `saffron-room-${booking.day}.ics`
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        setCalOpen(false)
        showToast('Calendar file downloaded — open it to add the dinner.')
    }

    const details = [
        ['Date', day.label + ' 2026'],
        ['Time', fmtTime(booking.time)],
        ['Party', `${booking.party} guests`],
        ['Table', tableFor(booking.party)],
        ['Menu', 'Monsoon tasting · 9 courses'],
        ['Occasion', booking.occasion],
    ]

    const bill = [
        ['Tasting menu', `${booking.party} × ${money(MENU_PRICE)}`, menuTotal],
        ['Wine pairing', `${booking.pairings} × ${money(PAIRING_PRICE)}`, pairingTotal],
        ['Service', `12.5% of ${money(menuTotal + pairingTotal)}`, service],
        ['Deposit paid', `${booking.party} × ${money(DEPOSIT)}`, -deposit],
    ]

    const draftDay = dayOf(draft.day)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#4a0e1a] px-4 py-16 text-base font-normal text-[#f6ecd9] sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <motion.svg
                aria-hidden="true"
                viewBox="0 0 400 400"
                className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] text-[#c9a44c]/25 sm:h-[34rem] sm:w-[34rem]"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ repeat: Infinity, duration: 120, ease: 'linear' }}
            >
                {[190, 160, 130, 100].map((r, i) => (
                    <circle
                        key={r}
                        cx="200"
                        cy="200"
                        r={r}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray={i % 2 ? '2 8' : '14 6'}
                    />
                ))}
                {Array.from({ length: 16 }, (_, i) => (
                    <ellipse
                        key={i}
                        cx="200"
                        cy="120"
                        rx="10"
                        ry="34"
                        fill="none"
                        stroke="currentColor"
                        transform={`rotate(${i * 22.5} 200 200)`}
                    />
                ))}
            </motion.svg>

            <div className="relative mx-auto max-w-5xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#c9a44c]">
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#c9a44c] text-[#4a0e1a]">
                                <HiCheck aria-hidden="true" className="h-3 w-3" />
                            </span>
                            Reservation confirmed
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal italic leading-[1] tracking-[-0.02em] text-[#f6ecd9] sm:text-6xl">
                            Your table is set.
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-6 text-[#f6ecd9]/70">
                        Arrive ten minutes early for a welcome cup of saffron-cardamom chai at the bar.
                    </p>
                </div>

                <motion.div
                    initial={reduce ? false : { y: 40, rotate: -1.5 }}
                    whileInView={{ y: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-10 flex flex-col drop-shadow-[0_30px_40px_rgba(20,0,6,0.45)] md:flex-row"
                >
                    <article
                        aria-label={`Reservation ${CODE}`}
                        className="min-w-0 flex-1 rounded-t-3xl bg-[#f6ecd9] p-5 text-[#3a0a14] sm:p-8 md:rounded-l-3xl md:rounded-tr-none"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#4a0e1a]/15 pb-5">
                            <div>
                                <p className="font-serif text-2xl font-semibold uppercase tracking-[0.2em] text-[#4a0e1a] sm:text-3xl">
                                    Saffron Room
                                </p>
                                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#4a0e1a]/60">
                                    Modern Indian · 18 Mercer Lane
                                </p>
                            </div>
                            <p className="rounded-full border border-[#4a0e1a] px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-[#4a0e1a]">
                                Admit {booking.party}
                            </p>
                        </div>

                        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#4a0e1a]/60">Guest</p>
                        <p className="font-serif text-2xl italic text-[#3a0a14] sm:text-3xl">Amara Okafor</p>

                        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                            {details.map(([k, v]) => (
                                <div key={k} className="min-w-0">
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#4a0e1a]/60">{k}</dt>
                                    <AnimatePresence initial={false} mode="popLayout">
                                        <motion.dd
                                            key={v}
                                            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="mt-0.5 text-sm font-semibold text-[#3a0a14] sm:text-base"
                                        >
                                            {v}
                                        </motion.dd>
                                    </AnimatePresence>
                                </div>
                            ))}
                        </dl>

                        <dl className="mt-6 rounded-2xl bg-[#4a0e1a]/[0.06] p-4">
                            {bill.map(([label, maths, amount]) => (
                                <div key={label} className="flex items-baseline justify-between gap-3 py-1">
                                    <dt className="min-w-0 text-sm text-[#3a0a14]">
                                        {label}{' '}
                                        <span className="font-mono text-[11px] text-[#4a0e1a]/60">{maths}</span>
                                    </dt>
                                    <dd className="shrink-0 font-mono text-sm tabular-nums text-[#3a0a14]">{money(amount)}</dd>
                                </div>
                            ))}
                            <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-dashed border-[#4a0e1a]/30 pt-3">
                                <dt className="text-sm font-semibold text-[#3a0a14]">Due on the night</dt>
                                <dd className="font-mono text-lg font-semibold tabular-nums text-[#4a0e1a]">{money(due)}</dd>
                            </div>
                        </dl>

                        <div className="mt-6 flex flex-wrap gap-2">
                            <div
                                ref={calRef}
                                className="relative"
                                onKeyDown={(event) => {
                                    if (event.key === 'Escape' && calOpen) {
                                        setCalOpen(false)
                                        calRef.current?.querySelector('button')?.focus()
                                    }
                                }}
                            >
                                <button
                                    type="button"
                                    aria-expanded={calOpen}
                                    aria-controls={`${uid}-cal`}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#4a0e1a] px-5 text-sm font-semibold text-[#f6ecd9] transition-colors hover:bg-[#6b1627] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]"
                                    onClick={() => setCalOpen((o) => !o)}
                                >
                                    <HiCalendarDays aria-hidden="true" className="h-4 w-4" />
                                    Add to calendar
                                </button>
                                <AnimatePresence>
                                    {calOpen ? (
                                        <motion.div
                                            id={`${uid}-cal`}
                                            initial={{ opacity: 0, y: reduce ? 0 : -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute left-0 top-full z-20 mt-2 w-[min(16rem,calc(100vw-4rem))] rounded-2xl border border-[#4a0e1a]/15 bg-[#fffaf0] p-2 text-[#3a0a14] shadow-[0_20px_40px_-12px_rgba(58,10,20,0.45)]"
                                        >
                                            <button
                                                type="button"
                                                className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm hover:bg-[#4a0e1a]/[0.07] focus-visible:outline-2 focus-visible:outline-[#c9a44c]"
                                                onClick={downloadIcs}
                                            >
                                                Download .ics (Apple, Outlook)
                                            </button>
                                            <a
                                                href="#add-to-google-calendar"
                                                className="flex min-h-11 w-full items-center rounded-xl px-3 text-sm hover:bg-[#4a0e1a]/[0.07] focus-visible:outline-2 focus-visible:outline-[#c9a44c]"
                                                onClick={() => setCalOpen(false)}
                                            >
                                                Google Calendar
                                            </a>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                            <button
                                ref={modifyRef}
                                type="button"
                                aria-haspopup="dialog"
                                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#4a0e1a]/30 px-5 text-sm font-semibold text-[#4a0e1a] transition-colors hover:border-[#4a0e1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]"
                                onClick={openDialog}
                            >
                                <HiPencilSquare aria-hidden="true" className="h-4 w-4" />
                                Modify
                            </button>
                            <a
                                href="#saffron-room-directions"
                                className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-[#4a0e1a] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]"
                            >
                                <HiMapPin aria-hidden="true" className="h-4 w-4" />
                                Directions
                            </a>
                        </div>
                    </article>

                    <div className="relative flex flex-col items-center justify-center gap-4 rounded-b-3xl border-t-2 border-dashed border-[#4a0e1a]/35 bg-[#efdcb8] p-6 text-[#3a0a14] sm:flex-row sm:gap-6 md:w-64 md:flex-col md:rounded-r-3xl md:rounded-bl-none md:border-l-2 md:border-t-0 lg:w-72">
                        <span aria-hidden="true" className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#4a0e1a]" />
                        <span
                            aria-hidden="true"
                            className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#4a0e1a] md:-bottom-3 md:-left-3 md:right-auto md:top-auto"
                        />
                        <div className="relative rounded-2xl bg-[#fffaf0] p-3 shadow-[inset_0_0_0_1px_rgba(74,14,26,0.12)]">
                            <svg
                                role="img"
                                aria-label={`Check-in code for reservation ${CODE}`}
                                viewBox="-1 -1 27 27"
                                shapeRendering="crispEdges"
                                className="h-36 w-36 text-[#3a0a14] lg:h-40 lg:w-40"
                            >
                                <path d={path} fill="currentColor" />
                            </svg>
                            <span
                                aria-hidden="true"
                                className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#c9a44c] font-serif text-sm italic text-[#4a0e1a]"
                            >
                                S
                            </span>
                        </div>
                        <div className="text-center sm:text-left md:text-center">
                            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#4a0e1a]/60">Confirmation</p>
                            <p className="font-mono text-lg font-semibold tracking-[0.12em] text-[#4a0e1a]">{CODE}</p>
                            <p className="mt-2 font-serif text-3xl italic text-[#4a0e1a]">{fmtTime(booking.time)}</p>
                            <p className="mt-1 text-xs text-[#3a0a14]/70">Show this at the host stand</p>
                        </div>
                    </div>
                </motion.div>

                <div aria-live="polite" className="mt-6 min-h-12">
                    <AnimatePresence>
                        {toast ? (
                            <motion.p
                                key={toast}
                                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#c9a44c]/50 bg-[#c9a44c]/10 px-4 py-2.5 text-sm text-[#f6ecd9]"
                            >
                                <HiCheck aria-hidden="true" className="shrink-0 text-[#c9a44c]" />
                                {toast}
                            </motion.p>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {dialogOpen ? (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end justify-center bg-[#1c0409]/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                        onClick={(event) => {
                            if (event.target === event.currentTarget) closeDialog()
                        }}
                    >
                        <motion.div
                            ref={panelRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`${uid}-dialog-title`}
                            initial={{ y: reduce ? 0 : 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: reduce ? 0 : 30, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-[#f6ecd9] p-5 text-[#3a0a14] sm:max-w-[34rem] sm:rounded-3xl sm:p-7"
                            onKeyDown={trapTab}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#4a0e1a]/60">{CODE}</p>
                                    <h3
                                        id={`${uid}-dialog-title`}
                                        className="mt-1 font-serif text-2xl font-normal italic text-[#4a0e1a] sm:text-3xl"
                                    >
                                        Modify reservation
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    aria-label="Close"
                                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl text-[#4a0e1a] hover:bg-[#4a0e1a]/10 focus-visible:outline-2 focus-visible:outline-[#c9a44c]"
                                    onClick={closeDialog}
                                >
                                    <HiXMark aria-hidden="true" />
                                </button>
                            </div>

                            <form noValidate className="mt-5 space-y-6" onSubmit={save}>
                                <fieldset>
                                    <legend className="text-sm font-semibold text-[#3a0a14]">Day</legend>
                                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {days.map((d) => (
                                            <button
                                                key={d.id}
                                                type="button"
                                                aria-pressed={draft.day === d.id}
                                                className={cn(
                                                    'min-h-11 rounded-xl border text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]',
                                                    draft.day === d.id
                                                        ? 'border-[#4a0e1a] bg-[#4a0e1a] text-[#f6ecd9]'
                                                        : 'border-[#4a0e1a]/20 text-[#3a0a14] hover:border-[#4a0e1a]/60',
                                                )}
                                                onClick={() => updateDraft({ day: d.id })}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend className="text-sm font-semibold text-[#3a0a14]">
                                        Time <span className="font-normal text-[#3a0a14]/60">· {draftDay.long}</span>
                                    </legend>
                                    <div
                                        className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4"
                                        aria-describedby={errors.time ? `${uid}-time-error` : undefined}
                                    >
                                        {slots.map((t) => {
                                            const full = draftDay.full.includes(t)
                                            return (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    disabled={full}
                                                    aria-pressed={draft.time === t}
                                                    aria-label={full ? `${fmtTime(t)}, fully booked` : fmtTime(t)}
                                                    className={cn(
                                                        'min-h-11 rounded-xl border font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]',
                                                        full && 'cursor-not-allowed border-transparent bg-[#4a0e1a]/5 text-[#3a0a14]/30 line-through',
                                                        !full && draft.time === t && 'border-[#c9a44c] bg-[#c9a44c] text-[#3a0a14]',
                                                        !full && draft.time !== t && 'border-[#4a0e1a]/20 text-[#3a0a14] hover:border-[#4a0e1a]/60',
                                                    )}
                                                    onClick={() => updateDraft({ time: t })}
                                                >
                                                    {fmtTime(t)}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    {errors.time ? (
                                        <p id={`${uid}-time-error`} role="alert" className="mt-2 text-xs text-[#b42318]">
                                            {errors.time}
                                        </p>
                                    ) : null}
                                </fieldset>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm font-semibold text-[#3a0a14]">Party size</p>
                                        <p className="text-xs text-[#3a0a14]/60">2–8 guests</p>
                                        <div className="mt-2">
                                            <Stepper
                                                label="guests"
                                                value={draft.party}
                                                min={2}
                                                max={8}
                                                onChange={(v) => updateDraft({ party: v })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#3a0a14]">Wine pairings</p>
                                        <p className="text-xs text-[#3a0a14]/60">$68 each · up to {draft.party}</p>
                                        <div className="mt-2">
                                            <Stepper
                                                label="wine pairings"
                                                value={draft.pairings}
                                                min={0}
                                                max={draft.party}
                                                onChange={(v) => updateDraft({ pairings: v })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor={`${uid}-occasion`} className="text-sm font-semibold text-[#3a0a14]">
                                        Occasion
                                    </label>
                                    <select
                                        id={`${uid}-occasion`}
                                        value={draft.occasion}
                                        className="mt-2 h-11 w-full rounded-xl border border-[#4a0e1a]/20 bg-[#fffaf0] px-3 text-sm text-[#3a0a14] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#c9a44c]"
                                        onChange={(event) => updateDraft({ occasion: event.target.value })}
                                    >
                                        {occasions.map((o) => (
                                            <option key={o}>{o}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <div className="flex items-baseline justify-between gap-3">
                                        <label htmlFor={`${uid}-notes`} className="text-sm font-semibold text-[#3a0a14]">
                                            Dietary notes
                                        </label>
                                        <span
                                            className={cn(
                                                'font-mono text-[11px]',
                                                draft.notes.length > NOTES_MAX ? 'text-[#b42318]' : 'text-[#3a0a14]/50',
                                            )}
                                        >
                                            {draft.notes.length}/{NOTES_MAX}
                                        </span>
                                    </div>
                                    <textarea
                                        id={`${uid}-notes`}
                                        rows={3}
                                        value={draft.notes}
                                        aria-invalid={Boolean(errors.notes)}
                                        aria-describedby={errors.notes ? `${uid}-notes-error` : undefined}
                                        className={cn(
                                            'mt-2 w-full resize-none rounded-xl border bg-[#fffaf0] px-3 py-2.5 text-sm text-[#3a0a14] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#c9a44c]',
                                            errors.notes ? 'border-[#b42318]' : 'border-[#4a0e1a]/20',
                                        )}
                                        onChange={(event) => updateDraft({ notes: event.target.value })}
                                    />
                                    {errors.notes ? (
                                        <p id={`${uid}-notes-error`} className="mt-1 text-xs text-[#b42318]">
                                            {errors.notes}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="flex flex-col-reverse gap-2 border-t border-[#4a0e1a]/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-[#3a0a14]/70">
                                        New estimate{' '}
                                        <span className="font-mono text-sm font-semibold text-[#4a0e1a]">
                                            {money(
                                                (draft.party * MENU_PRICE + draft.pairings * PAIRING_PRICE) * (1 + SERVICE_RATE) -
                                                    draft.party * DEPOSIT,
                                            )}
                                        </span>{' '}
                                        due on the night
                                    </p>
                                    <button
                                        type="submit"
                                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#4a0e1a] px-6 text-sm font-semibold text-[#f6ecd9] transition-colors hover:bg-[#6b1627] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </section>
    )
}

export default BoardingPassBookingSummary

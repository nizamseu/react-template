// RangeCalendarBookingSearch

// BookingSearch05 · Booking & Reservations › Search / Booking Engine

// Description:
// A slow, cabin-lodge date picker for the fictional Hearthside Cabins. Under the serif
// heading "Choose your nights by the fire." a hand-built two-month calendar lets guests
// pick a check-in and check-out range while booked nights are struck through; a pine
// summary card beside it shows the Fernhollow A-frame, the nights count, weeknight and
// weekend subtotals and the total, with "Reserve these dates". Use it on a single-
// property or small-portfolio booking page where the calendar is the hero.

// Design:
// - Cream #f5efe4 section, pine #1f3b2c text and fills, moss #6b8f71 for hover/preview,
//   ember #c2410c for the weekend-rate dot; faint contour-line SVG behind the heading
// - Calendar card #fbf8f2, rounded-[28px], pine/15 border; 44 → 48px round days; the
//   range is a pine/12 band with solid pine end caps; booked nights struck through at 30%
// - Serif month titles and display heading (text-4xl → lg:text-6xl); nightly price in
//   10px under each day from sm; summary card is pine with cream type and a 16:10 photo
// - Base: one month + summary stacked; md: two months side by side;
//   lg: grid-cols-[1fr_22rem] with the summary sticky
// - framer-motion: month pair slides left/right when paging, summary numbers fade on
//   change, success state cross-fades; slides are removed for reduced motion

// What it does:
// - Fixed example calendar (Oct 2026 – Mar 2027, "today" = Tue 6 Oct 2026) so server
//   and client match; click a check-in, then a check-out; after a check-in, days past the
//   next booked night are disabled (a booked morning can still be the check-out) and the
//   minimum stay is 2 nights; Oct 16 → 21 is preselected
// - Hovering or focusing a later day previews the range; arrow keys move focus by day or
//   week, PageUp/PageDown by month (the view follows), Enter/Space selects
// - Sun–Thu nights cost $185 and Fri/Sat nights $235 plus $60 cleaning & firewood;
//   "Clear dates" resets, "Reserve these dates" shows a held-booking confirmation

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RangeCalendarBookingSearch from '@/TestComponent/PageSections/booking/BookingSearch05';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <RangeCalendarBookingSearch />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { LuBath, LuFlame, LuTrees, LuUsers } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const PHOTO = 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=80'
const TODAY = '2026-10-06'
const FIRST_MONTH = [2026, 9]
const MONTH_COUNT = 6
const WEEKNIGHT = 185
const WEEKEND = 235
const CLEANING = 60
const MONTHS = [
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
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const BOOKED = new Set([
    '2026-10-09',
    '2026-10-10',
    '2026-10-23',
    '2026-10-24',
    '2026-10-30',
    '2026-10-31',
    '2026-11-06',
    '2026-11-07',
    '2026-11-08',
    '2026-11-13',
    '2026-11-14',
    '2026-11-26',
    '2026-11-27',
    '2026-11-28',
    '2026-12-11',
    '2026-12-12',
    '2026-12-24',
    '2026-12-25',
    '2026-12-26',
    '2026-12-27',
    '2026-12-31',
    '2027-01-01',
    '2027-02-12',
    '2027-02-13',
    '2027-02-14',
])

const pad = (n) => String(n).padStart(2, '0')
const parts = (iso) => iso.split('-').map(Number)
const toIso = (y, m, d) => {
    const date = new Date(Date.UTC(y, m, d))
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}
const shift = (iso, days) => {
    const [y, m, d] = parts(iso)
    return toIso(y, m - 1, d + days)
}
const dow = (iso) => {
    const [y, m, d] = parts(iso)
    return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}
const isWeekendNight = (iso) => dow(iso) === 5 || dow(iso) === 6
const priceOf = (iso) => (isWeekendNight(iso) ? WEEKEND : WEEKNIGHT)
const monthIndexOf = (iso) => {
    const [y, m] = parts(iso)
    return (y - FIRST_MONTH[0]) * 12 + (m - 1 - FIRST_MONTH[1])
}
const monthMeta = (index) => {
    const total = FIRST_MONTH[1] + index
    const y = FIRST_MONTH[0] + Math.floor(total / 12)
    const m = total % 12
    return { y, m, label: `${MONTHS[m]} ${y}` }
}
const longDate = (iso) => {
    const [y, m, d] = parts(iso)
    return `${DAY_NAMES[dow(iso)]} ${d} ${MONTHS[m - 1]} ${y}`
}
const shortDate = (iso) => {
    const [, m, d] = parts(iso)
    return `${DAY_NAMES[dow(iso)].slice(0, 3)} ${d} ${MONTHS[m - 1].slice(0, 3)}`
}
const lastDay = shift(toIso(monthMeta(MONTH_COUNT - 1).y, monthMeta(MONTH_COUNT - 1).m + 1, 1), -1)

function monthCells(index) {
    const { y, m } = monthMeta(index)
    const first = new Date(Date.UTC(y, m, 1)).getUTCDay()
    const lead = (first + 6) % 7
    const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
    return [
        ...Array.from({ length: lead }, (_, i) => ({ blank: true, key: `b${i}` })),
        ...Array.from({ length: days }, (_, i) => ({ iso: toIso(y, m, i + 1), day: i + 1, key: toIso(y, m, i + 1) })),
    ]
}

function nightsIn(start, end) {
    const list = []
    for (let d = start; d < end; d = shift(d, 1)) list.push(d)
    return list
}

function nextBlocked(start) {
    for (let d = start; d <= lastDay; d = shift(d, 1)) if (BOOKED.has(d)) return d
    return lastDay
}

export function RangeCalendarBookingSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [view, setView] = useState(0)
    const [dir, setDir] = useState(1)
    const [start, setStart] = useState('2026-10-16')
    const [end, setEnd] = useState('2026-10-21')
    const [hover, setHover] = useState(null)
    const [focusIso, setFocusIso] = useState('2026-10-16')
    const [message, setMessage] = useState('')
    const [held, setHeld] = useState(false)
    const [wide, setWide] = useState(false)
    const cellRefs = useRef(new Map())
    const keyNav = useRef(false)

    const maxView = wide ? MONTH_COUNT - 2 : MONTH_COUNT - 1
    const visibleCount = wide ? 2 : 1

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)')
        const update = () => setWide(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    useEffect(() => {
        if (view > maxView) setView(maxView)
    }, [view, maxView])

    useEffect(() => {
        if (!keyNav.current) return
        keyNav.current = false
        cellRefs.current.get(focusIso)?.focus()
    }, [focusIso, view])

    const choosingEnd = Boolean(start && !end)
    const limit = choosingEnd ? nextBlocked(start) : null

    const stateOf = (iso) => {
        if (iso < TODAY || iso > lastDay) return { off: true, reason: 'unavailable' }
        if (choosingEnd && iso > start) {
            if (iso > limit) return { off: true, reason: 'unavailable after a booked night' }
            if (iso === shift(start, 1)) return { off: true, reason: 'minimum stay is 2 nights' }
            return { off: false }
        }
        if (BOOKED.has(iso)) return { off: true, reason: 'booked' }
        return { off: false }
    }

    const previewEnd = choosingEnd && hover && hover > start && !stateOf(hover).off ? hover : null
    const rangeEnd = end || previewEnd

    const select = (iso) => {
        const st = stateOf(iso)
        if (st.off) {
            const notes = {
                'minimum stay is 2 nights': 'Minimum stay is 2 nights.',
                booked: 'That night is already booked.',
                'unavailable after a booked night': 'There’s a booked night before that date.',
            }
            setMessage(notes[st.reason] || '')
            return
        }
        setHeld(false)
        if (!start || end || iso <= start) {
            setStart(iso)
            setEnd(null)
            setMessage('Now choose your check-out day.')
        } else {
            setEnd(iso)
            setHover(null)
            setMessage('')
        }
    }

    const moveFocus = (iso) => {
        let next = iso
        if (next < toIso(FIRST_MONTH[0], FIRST_MONTH[1], 1)) next = toIso(FIRST_MONTH[0], FIRST_MONTH[1], 1)
        if (next > lastDay) next = lastDay
        const mi = monthIndexOf(next)
        if (mi < view) {
            setDir(-1)
            setView(mi)
        } else if (mi > view + visibleCount - 1) {
            setDir(1)
            setView(Math.min(maxView, mi - visibleCount + 1))
        }
        keyNav.current = true
        setFocusIso(next)
    }

    const onKeyDown = (event, iso) => {
        const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
        if (moves[event.key]) {
            event.preventDefault()
            moveFocus(shift(iso, moves[event.key]))
        } else if (event.key === 'PageUp' || event.key === 'PageDown') {
            event.preventDefault()
            const [y, m, d] = parts(iso)
            const delta = event.key === 'PageUp' ? -1 : 1
            const maxDay = new Date(Date.UTC(y, m - 1 + delta + 1, 0)).getUTCDate()
            moveFocus(toIso(y, m - 1 + delta, Math.min(d, maxDay)))
        }
    }

    const page = (delta) => {
        setDir(delta)
        setView((v) => Math.min(maxView, Math.max(0, v + delta)))
    }

    const nights = start && end ? nightsIn(start, end) : []
    const weekendNights = nights.filter(isWeekendNight).length
    const weekNights = nights.length - weekendNights
    const subtotal = weekNights * WEEKNIGHT + weekendNights * WEEKEND
    const total = nights.length ? subtotal + CLEANING : 0
    const money = (n) => `$${n.toLocaleString('en-US')}`
    const focusMonth = monthIndexOf(focusIso)
    const tabbable =
        focusMonth >= view && focusMonth < view + visibleCount
            ? focusIso
            : toIso(monthMeta(view).y, monthMeta(view).m, 1)

    const renderMonth = (index, extraClass) => {
        const meta = monthMeta(index)
        return (
            <div key={index} className={cn('min-w-0', extraClass)} role="group" aria-labelledby={`${uid}-m${index}`}>
                <p id={`${uid}-m${index}`} className="text-center font-serif text-xl text-[#1f3b2c]">
                    {meta.label}
                </p>
                <div aria-hidden="true" className="mt-4 grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1f3b2c]/50">
                    {WEEK.map((w) => (
                        <span key={w}>{w}</span>
                    ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-y-1">
                    {monthCells(index).map((cell) => {
                        if (cell.blank) return <span key={cell.key} aria-hidden="true" />
                        const { iso } = cell
                        const st = stateOf(iso)
                        const isStart = iso === start
                        const isEnd = iso === end || (!end && iso === previewEnd)
                        const inRange = start && rangeEnd && iso > start && iso < rangeEnd
                        const booked = BOOKED.has(iso)
                        const band =
                            start && rangeEnd && (inRange || (isStart && rangeEnd > start) || isEnd)
                        return (
                            <div key={cell.key} className="relative flex justify-center py-0.5">
                                {band && (
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'absolute inset-y-0.5',
                                            end ? 'bg-[#1f3b2c]/12' : 'bg-[#6b8f71]/15',
                                            isStart ? 'left-1/2 right-0' : isEnd ? 'left-0 right-1/2' : 'inset-x-0',
                                        )}
                                    />
                                )}
                                <button
                                    ref={(el) => {
                                        if (el) cellRefs.current.set(iso, el)
                                        else cellRefs.current.delete(iso)
                                    }}
                                    type="button"
                                    tabIndex={iso === tabbable ? 0 : -1}
                                    aria-disabled={st.off}
                                    aria-pressed={isStart || iso === end}
                                    aria-label={`${longDate(iso)}${isStart ? ', check-in' : ''}${iso === end ? ', check-out' : ''}${st.off ? `, ${st.reason}` : `, ${money(priceOf(iso))} night`}`}
                                    className={cn(
                                        'relative flex size-11 flex-col items-center justify-center rounded-full text-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#c2410c] sm:size-12',
                                        isStart || isEnd
                                            ? 'bg-[#1f3b2c] font-semibold text-[#f5efe4]'
                                            : st.off
                                              ? 'cursor-not-allowed text-[#1f3b2c]/30'
                                              : 'text-[#1f3b2c] hover:bg-[#6b8f71]/20',
                                        booked && !isEnd && 'line-through decoration-[#1f3b2c]/40',
                                        !end && isEnd && 'bg-[#6b8f71]',
                                    )}
                                    onClick={() => {
                                        setFocusIso(iso)
                                        select(iso)
                                    }}
                                    onKeyDown={(e) => onKeyDown(e, iso)}
                                    onMouseEnter={() => setHover(iso)}
                                    onMouseLeave={() => setHover(null)}
                                    onFocus={() => setHover(iso)}
                                >
                                    <span className="leading-none">{cell.day}</span>
                                    {!st.off && !booked && (
                                        <span
                                            className={cn(
                                                'mt-0.5 hidden text-[9px] leading-none sm:block',
                                                isStart || isEnd ? 'text-[#f5efe4]/70' : 'text-[#1f3b2c]/45',
                                            )}
                                        >
                                            {priceOf(iso)}
                                        </span>
                                    )}
                                    {isWeekendNight(iso) && !st.off && !isStart && !isEnd && (
                                        <span aria-hidden="true" className="absolute right-1.5 top-1.5 size-1 rounded-full bg-[#c2410c]" />
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#f5efe4] px-4 py-16 text-base font-normal text-[#1f3b2c] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <svg
                viewBox="0 0 600 300"
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 right-0 h-80 w-[40rem] max-w-none text-[#1f3b2c] opacity-[0.08]"
            >
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <path
                        key={i}
                        d={`M${-20 + i * 6} ${260 - i * 26} C ${140 + i * 10} ${200 - i * 30}, ${260 - i * 8} ${300 - i * 34}, ${400 + i * 4} ${180 - i * 22} S ${560 - i * 6} ${120 - i * 14}, ${640} ${150 - i * 20}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                ))}
            </svg>

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1f3b2c]/70">
                            Hearthside Cabins · Wye Valley
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#1f3b2c] sm:text-5xl lg:text-6xl">
                            Choose your nights by the fire.
                        </h2>
                    </div>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#1f3b2c]/75">
                        <li className="flex items-center gap-2">
                            <span aria-hidden="true" className="size-2 rounded-full bg-[#1f3b2c]" /> Your stay
                        </li>
                        <li className="flex items-center gap-2">
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#c2410c]" /> Weekend rate
                        </li>
                        <li className="flex items-center gap-2">
                            <span aria-hidden="true" className="text-[#1f3b2c]/40 line-through">
                                12
                            </span>{' '}
                            Booked
                        </li>
                    </ul>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
                    <div className="rounded-[28px] border border-[#1f3b2c]/15 bg-[#fbf8f2] p-4 sm:p-6 lg:p-8">
                        <div className="flex items-center justify-between gap-3">
                            <button
                                type="button"
                                aria-label="Previous month"
                                disabled={view === 0}
                                className="grid size-11 place-items-center rounded-full border border-[#1f3b2c]/20 text-[#1f3b2c] transition-colors hover:bg-[#1f3b2c] hover:text-[#f5efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1f3b2c]"
                                onClick={() => page(-1)}
                            >
                                <HiChevronLeft aria-hidden="true" className="size-5" />
                            </button>
                            <p aria-live="polite" className="min-h-5 text-center text-sm text-[#1f3b2c]/70">
                                {message || (start && end ? `${nights.length} nights selected` : 'Select a check-in day')}
                            </p>
                            <button
                                type="button"
                                aria-label="Next month"
                                disabled={view >= maxView}
                                className="grid size-11 place-items-center rounded-full border border-[#1f3b2c]/20 text-[#1f3b2c] transition-colors hover:bg-[#1f3b2c] hover:text-[#f5efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1f3b2c]"
                                onClick={() => page(1)}
                            >
                                <HiChevronRight aria-hidden="true" className="size-5" />
                            </button>
                        </div>

                        <div className="relative mt-4 overflow-hidden" onMouseLeave={() => setHover(null)}>
                            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                                <motion.div
                                    key={view}
                                    custom={dir}
                                    initial={{ opacity: 0, x: reduceMotion ? 0 : dir * 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: reduceMotion ? 0 : dir * -40 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    className="grid gap-8 md:grid-cols-2 md:gap-10"
                                >
                                    {renderMonth(view)}
                                    {view + 1 < MONTH_COUNT && renderMonth(view + 1, 'hidden md:block')}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 border-t border-[#1f3b2c]/10 pt-4 text-sm text-[#1f3b2c]/70 sm:flex-row sm:items-center sm:justify-between">
                            <p>Check-in from 16:00 · check-out by 10:30 · 2-night minimum</p>
                            <button
                                type="button"
                                className="min-h-10 self-start rounded-full px-3 font-semibold text-[#1f3b2c] underline decoration-[#1f3b2c]/30 underline-offset-4 hover:decoration-[#1f3b2c] focus-visible:outline-2 focus-visible:outline-[#c2410c] sm:self-auto"
                                onClick={() => {
                                    setStart(null)
                                    setEnd(null)
                                    setHeld(false)
                                    setMessage('Dates cleared. Select a check-in day.')
                                }}
                            >
                                Clear dates
                            </button>
                        </div>
                    </div>

                    <aside className="overflow-hidden rounded-[28px] bg-[#1f3b2c] text-[#f5efe4] lg:sticky lg:top-8">
                        <div className="relative">
                            <img
                                src={PHOTO}
                                alt="Small wooden cabin among tall trees in a forest"
                                loading="lazy"
                                className="aspect-[16/10] w-full object-cover"
                            />
                            <span className="absolute left-4 top-4 rounded-full bg-[#f5efe4] px-3 py-1 text-xs font-semibold text-[#1f3b2c]">
                                4.96 · 188 stays
                            </span>
                        </div>
                        <div className="p-5 sm:p-6">
                            <h3 className="font-serif text-2xl font-normal text-[#f5efe4]">Fernhollow A-frame</h3>
                            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#f5efe4]/70">
                                <li className="flex items-center gap-1.5">
                                    <LuUsers aria-hidden="true" className="size-3.5" /> Sleeps 4
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <LuFlame aria-hidden="true" className="size-3.5" /> Wood burner
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <LuBath aria-hidden="true" className="size-3.5" /> Cedar hot tub
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <LuTrees aria-hidden="true" className="size-3.5" /> 3 acres
                                </li>
                            </ul>

                            <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#f5efe4]/20">
                                <div className="border-r border-[#f5efe4]/20 p-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5efe4]/60">Check-in</p>
                                    <p className="mt-1 text-sm font-semibold">{start ? shortDate(start) : 'Add date'}</p>
                                </div>
                                <div className="p-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5efe4]/60">Check-out</p>
                                    <p className="mt-1 text-sm font-semibold">{end ? shortDate(end) : 'Add date'}</p>
                                </div>
                            </div>

                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={`${start}-${end}-${held}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    {nights.length ? (
                                        <dl className="mt-5 space-y-2.5 text-sm">
                                            {weekNights > 0 && (
                                                <div className="flex justify-between gap-3">
                                                    <dt className="text-[#f5efe4]/75">
                                                        {weekNights} weeknight{weekNights > 1 ? 's' : ''} × {money(WEEKNIGHT)}
                                                    </dt>
                                                    <dd className="tabular-nums">{money(weekNights * WEEKNIGHT)}</dd>
                                                </div>
                                            )}
                                            {weekendNights > 0 && (
                                                <div className="flex justify-between gap-3">
                                                    <dt className="text-[#f5efe4]/75">
                                                        {weekendNights} weekend night{weekendNights > 1 ? 's' : ''} × {money(WEEKEND)}
                                                    </dt>
                                                    <dd className="tabular-nums">{money(weekendNights * WEEKEND)}</dd>
                                                </div>
                                            )}
                                            <div className="flex justify-between gap-3">
                                                <dt className="text-[#f5efe4]/75">Cleaning &amp; firewood</dt>
                                                <dd className="tabular-nums">{money(CLEANING)}</dd>
                                            </div>
                                            <div className="flex items-baseline justify-between gap-3 border-t border-[#f5efe4]/20 pt-3">
                                                <dt className="font-semibold">
                                                    Total · {nights.length} nights
                                                </dt>
                                                <dd className="font-serif text-3xl tabular-nums">{money(total)}</dd>
                                            </div>
                                        </dl>
                                    ) : (
                                        <p className="mt-5 text-sm leading-relaxed text-[#f5efe4]/70">
                                            From {money(WEEKNIGHT)} a night Sunday to Thursday and {money(WEEKEND)} on
                                            Friday and Saturday nights. Pick two dates to see your total.
                                        </p>
                                    )}
                                    {held ? (
                                        <p role="status" className="mt-5 rounded-2xl bg-[#f5efe4] p-4 text-sm text-[#1f3b2c]">
                                            <span className="block font-semibold">Held for 20 minutes</span>
                                            {shortDate(start)} → {shortDate(end)} · ref HC-{start.slice(5).replace('-', '')}
                                            {nights.length}
                                        </p>
                                    ) : null}
                                </motion.div>
                            </AnimatePresence>

                            <button
                                type="button"
                                disabled={!nights.length || held}
                                className="mt-5 min-h-12 w-full rounded-full bg-[#f5efe4] text-sm font-bold text-[#1f3b2c] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5efe4] disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={() => setHeld(true)}
                            >
                                {held ? 'Dates held' : 'Reserve these dates'}
                            </button>
                            <p className="mt-3 text-center text-xs text-[#f5efe4]/60">
                                Free cancellation until 14 days before arrival
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default RangeCalendarBookingSearch

// EventGroupsGroupSidebar

// GroupSidebar05 · Social Networks & Communities › Community / Group Sidebar

// Description:
// A planner-style events sidebar for the meetup app Meetwell. A mini month calendar
// (September–November 2026) marks event days with coloured dots per group; picking a day
// filters the list to that day's events, otherwise it shows each group with its next
// event. The detail pane shows the chosen event with a date block, venue, attendees, a
// "Going" RSVP toggle and the group's other dates. Use it for meetup, club or city apps.

// Design:
// - lg:grid-cols-[24rem_1fr]: sidebar (calendar card + event list) and event detail;
//   stacked below lg; the calendar is a 7-column grid of 40px day buttons at every width
// - Cream #fffbeb section, indigo #4338ca (selected day, buttons, focus), deep ink
//   #1e1b4b, warm grey #78716c, hairlines #f1e7c9; each group has its own dot colour
// - Serif display heading (text-4xl → lg:text-6xl) and serif date numerals; sans UI text,
//   rounded-3xl white cards with a soft indigo-tinted shadow, square photo thumbs
// - List rows and the detail card animate on filter/selection changes (AnimatePresence,
//   layout); movement is removed for reduced motion
// - Detail: date block + title stack on mobile and sit side by side from sm up; photo
//   header uses a 16:7 crop

// What it does:
// - The calendar is computed from fixed dates (UTC maths, Monday first) so server and
//   client match; "today" is only outlined after mount (useEffect) if it is in view
// - Prev / next buttons move between Sep and Nov 2026; clicking a day (aria-pressed)
//   filters the list, clicking it again or "Show all" clears; arrow keys move between days
// - Selecting a row shows that event; "Going" (aria-pressed) adds you to the attendee
//   count; "Other dates" chips jump the calendar to that day; links go to #event-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EventGroupsGroupSidebar from '@/TestComponent/PageSections/community/GroupSidebar05';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <EventGroupsGroupSidebar />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiCheck,
    HiChevronLeft,
    HiChevronRight,
    HiOutlineCalendarDays,
    HiOutlineClock,
    HiOutlineMapPin,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_HEADS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const YEAR = 2026
const FIRST_MONTH = 8
const LAST_MONTH = 10

const attendeeFaces = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80',
]

const groups = [
    {
        id: 'run',
        name: 'Sunrise Run Club',
        dot: 'bg-[#f59e0b]',
        ring: 'ring-[#f59e0b]',
        members: 318,
        photo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        alt: 'Runner sprinting down an athletics track',
        title: 'Saturday 5K + coffee',
        time: '07:00 – 08:30',
        venue: 'Riverside Boathouse',
        going: 42,
        dates: ['2026-09-26', '2026-10-03', '2026-10-17', '2026-10-31', '2026-11-14'],
    },
    {
        id: 'games',
        name: 'Board Game Social',
        dot: 'bg-[#4338ca]',
        ring: 'ring-[#4338ca]',
        members: 204,
        photo: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
        alt: 'Friends sharing plates of food around a table',
        title: 'Strategy night: Wingspan & co.',
        time: '19:00 – 22:30',
        venue: 'The Meeple Café, 12 Arch St',
        going: 28,
        dates: ['2026-09-24', '2026-10-08', '2026-10-22', '2026-11-05', '2026-11-19'],
    },
    {
        id: 'product',
        name: 'Women in Product',
        dot: 'bg-[#db2777]',
        ring: 'ring-[#db2777]',
        members: 1146,
        photo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
        alt: 'Speaker presenting to a small team',
        title: 'Roadmaps that survive contact',
        time: '18:30 – 20:30',
        venue: 'Loft 9, Canal Works',
        going: 87,
        dates: ['2026-10-14', '2026-11-11'],
    },
    {
        id: 'sketch',
        name: 'Sketch & Sip',
        dot: 'bg-[#0d9488]',
        ring: 'ring-[#0d9488]',
        members: 96,
        photo: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80',
        alt: 'Hand drawing on a tablet with a stylus',
        title: 'Figure drawing, 5-minute poses',
        time: '19:30 – 21:30',
        venue: 'Kiln Studio',
        going: 19,
        dates: ['2026-09-18', '2026-10-09', '2026-10-23', '2026-11-06'],
    },
    {
        id: 'code',
        name: 'Code & Coffee',
        dot: 'bg-[#2563eb]',
        ring: 'ring-[#2563eb]',
        members: 532,
        photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        alt: 'Team coding together on laptops',
        title: 'Pairing hour + lightning demos',
        time: '08:30 – 10:00',
        venue: 'Common Room, Level 2',
        going: 35,
        dates: ['2026-09-21', '2026-10-05', '2026-10-19', '2026-11-02', '2026-11-16'],
    },
    {
        id: 'trail',
        name: 'Trail Crew',
        dot: 'bg-[#16a34a]',
        ring: 'ring-[#16a34a]',
        members: 241,
        photo: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80',
        alt: 'Hikers walking a mountain trail',
        title: 'Hollow Wood loop (9 mi)',
        time: '09:00 – 14:00',
        venue: 'Hollow Wood car park',
        going: 23,
        dates: ['2026-10-03', '2026-10-25', '2026-11-22'],
    },
]

const groupById = Object.fromEntries(groups.map((g) => [g.id, g]))
const allEvents = groups
    .flatMap((g) => g.dates.map((date) => ({ key: `${g.id}:${date}`, group: g.id, date })))
    .sort((a, b) => a.date.localeCompare(b.date) || a.group.localeCompare(b.group))

const parse = (iso) => iso.split('-').map(Number)
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
const weekday = (s) => {
    const [y, m, d] = parse(s)
    return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}
const longDate = (s) => {
    const [, m, d] = parse(s)
    return `${WEEKDAYS[weekday(s)]} ${d} ${MONTHS[m - 1]}`
}
const shortMonth = (s) => MONTHS[parse(s)[1] - 1].slice(0, 3)

function monthGrid(year, month) {
    const first = new Date(Date.UTC(year, month, 1)).getUTCDay()
    const lead = (first + 6) % 7
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    return { lead, days }
}

export function EventGroupsGroupSidebar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()

    const [month, setMonth] = useState(9)
    const [day, setDay] = useState(null)
    const [focusDay, setFocusDay] = useState(1)
    const [selected, setSelected] = useState('games:2026-10-08')
    const [going, setGoing] = useState({ 'run:2026-10-03': true })
    const [today, setToday] = useState(null)

    useEffect(() => {
        const now = new Date()
        setToday(iso(now.getFullYear(), now.getMonth(), now.getDate()))
    }, [])

    const { lead, days } = monthGrid(YEAR, month)
    const monthPrefix = iso(YEAR, month, 1).slice(0, 8)
    const monthEvents = allEvents.filter((e) => e.date.startsWith(monthPrefix))
    const eventsByDay = monthEvents.reduce((map, e) => {
        const d = parse(e.date)[2]
        map[d] = [...(map[d] ?? []), e]
        return map
    }, {})

    const listed = day
        ? eventsByDay[day] ?? []
        : groups
              .map((g) => monthEvents.find((e) => e.group === g.id))
              .filter(Boolean)
              .sort((a, b) => a.date.localeCompare(b.date))
    const quiet = day ? [] : groups.filter((g) => !monthEvents.some((e) => e.group === g.id))

    const [selGroupId, selDate] = selected.split(':')
    const selGroup = groupById[selGroupId]
    const isGoing = Boolean(going[selected])
    const otherDates = selGroup.dates.filter((d) => d !== selDate)

    const changeMonth = (delta) => {
        const next = Math.min(LAST_MONTH, Math.max(FIRST_MONTH, month + delta))
        setMonth(next)
        setDay(null)
        setFocusDay(1)
    }

    const pickDay = (d) => {
        setFocusDay(d)
        if (day === d) {
            setDay(null)
            return
        }
        setDay(d)
        const first = eventsByDay[d]?.[0]
        if (first) setSelected(first.key)
    }

    const onDayKey = (event, d) => {
        const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
        if (!(event.key in moves)) return
        event.preventDefault()
        const next = d + moves[event.key]
        if (next < 1 || next > days) return
        setFocusDay(next)
        document.getElementById(`${uid}-day-${next}`)?.focus()
    }

    const jumpTo = (date) => {
        const [, m, d] = parse(date)
        setMonth(m - 1)
        setDay(d)
        setFocusDay(d)
        setSelected(`${selGroupId}:${date}`)
    }

    const rovingDay = day ?? focusDay

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#fffbeb] px-4 py-16 text-base font-normal text-[#1e1b4b] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-6 border-b border-[#f1e7c9] pb-10 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#4338ca]">Meetwell · Your calendar</p>
                        <h2 className="mt-4 max-w-2xl font-serif text-4xl font-normal leading-[1.04] tracking-tight text-[#1e1b4b] sm:text-5xl lg:text-6xl">
                            Six groups, one <em className="text-[#4338ca]">very good</em> October.
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-[#78716c]">
                        Tap a dotted day to see who is meeting. Every dot is an event from a group you have joined.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)]">
                    <aside aria-label="Groups and events" className="min-w-0 space-y-5">
                        <div className="rounded-3xl bg-white p-4 shadow-[0_24px_60px_-36px_rgba(67,56,202,0.45)] ring-1 ring-[#f1e7c9] sm:p-5">
                            <div className="flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    disabled={month <= FIRST_MONTH}
                                    aria-label="Previous month"
                                    className="grid size-10 place-items-center rounded-full text-[#4338ca] transition-colors hover:bg-[#eef2ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                    onClick={() => changeMonth(-1)}
                                >
                                    <HiChevronLeft className="size-5" aria-hidden="true" />
                                </button>
                                <h3 id={`${uid}-month`} aria-live="polite" className="font-serif text-xl font-normal text-[#1e1b4b]">
                                    {MONTHS[month]} {YEAR}
                                </h3>
                                <button
                                    type="button"
                                    disabled={month >= LAST_MONTH}
                                    aria-label="Next month"
                                    className="grid size-10 place-items-center rounded-full text-[#4338ca] transition-colors hover:bg-[#eef2ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                    onClick={() => changeMonth(1)}
                                >
                                    <HiChevronRight className="size-5" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="mt-4 grid grid-cols-7 gap-y-1 text-center" aria-hidden="true">
                                {DAY_HEADS.map((h) => (
                                    <span key={h} className="text-[11px] font-bold uppercase tracking-wider text-[#a8a29e]">
                                        {h}
                                    </span>
                                ))}
                            </div>
                            <div role="group" aria-labelledby={`${uid}-month`} className="mt-1 grid grid-cols-7 place-items-center gap-y-1">
                                {Array.from({ length: lead }, (_, i) => (
                                    <span key={`lead-${i}`} aria-hidden="true" />
                                ))}
                                {Array.from({ length: days }, (_, i) => {
                                    const d = i + 1
                                    const list = eventsByDay[d] ?? []
                                    const isSel = day === d
                                    const isToday = today === iso(YEAR, month, d)
                                    const date = iso(YEAR, month, d)
                                    return (
                                        <button
                                            key={d}
                                            id={`${uid}-day-${d}`}
                                            type="button"
                                            tabIndex={d === rovingDay ? 0 : -1}
                                            aria-pressed={isSel}
                                            aria-label={`${longDate(date)}${list.length ? `, ${list.length} ${list.length === 1 ? 'event' : 'events'}` : ', no events'}${isToday ? ', today' : ''}`}
                                            className={cn(
                                                'relative flex size-10 flex-col items-center justify-center rounded-full font-serif text-[15px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4338ca]',
                                                isSel
                                                    ? 'bg-[#4338ca] text-white'
                                                    : list.length
                                                      ? 'font-semibold text-[#1e1b4b] hover:bg-[#eef2ff]'
                                                      : 'text-[#a8a29e] hover:bg-[#fef3c7]',
                                                isToday && !isSel && 'ring-2 ring-[#4338ca] ring-inset',
                                            )}
                                            onClick={() => pickDay(d)}
                                            onKeyDown={(e) => onDayKey(e, d)}
                                        >
                                            <span className="leading-none">{d}</span>
                                            {list.length > 0 && (
                                                <span className="absolute bottom-1 flex gap-0.5" aria-hidden="true">
                                                    {list.slice(0, 3).map((e) => (
                                                        <span
                                                            key={e.key}
                                                            className={cn('size-1 rounded-full', isSel ? 'bg-white' : groupById[e.group].dot)}
                                                        />
                                                    ))}
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <p className="mt-4 border-t border-[#f5efdc] pt-3 text-xs text-[#78716c]">
                                {monthEvents.length} events in {MONTHS[month]} across{' '}
                                {new Set(monthEvents.map((e) => e.group)).size} groups
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white p-4 ring-1 ring-[#f1e7c9] sm:p-5">
                            <div className="flex min-h-10 items-center justify-between gap-3">
                                <h3 className="font-serif text-lg font-normal text-[#1e1b4b]">
                                    {day ? longDate(iso(YEAR, month, day)) : `Next up in ${MONTHS[month]}`}
                                </h3>
                                {day && (
                                    <button
                                        type="button"
                                        className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full bg-[#eef2ff] px-3 text-xs font-bold text-[#4338ca] hover:bg-[#e0e7ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]"
                                        onClick={() => setDay(null)}
                                    >
                                        <HiXMark className="size-3.5" aria-hidden="true" />
                                        Show all
                                    </button>
                                )}
                            </div>
                            <ul className="mt-3 space-y-1">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {listed.map((e) => {
                                        const g = groupById[e.group]
                                        const active = selected === e.key
                                        return (
                                            <motion.li
                                                key={e.key}
                                                layout={!reduceMotion}
                                                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.22 }}
                                            >
                                                <button
                                                    type="button"
                                                    aria-current={active ? 'true' : undefined}
                                                    className={cn(
                                                        'flex min-h-16 w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4338ca]',
                                                        active ? 'bg-[#eef2ff]' : 'hover:bg-[#fffbeb]',
                                                    )}
                                                    onClick={() => setSelected(e.key)}
                                                >
                                                    <span className="relative shrink-0">
                                                        <img src={g.photo} alt="" loading="lazy" className="size-12 rounded-xl object-cover" />
                                                        <span className={cn('absolute -right-1 -top-1 size-3.5 rounded-full border-2 border-white', g.dot)} aria-hidden="true" />
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm font-bold text-[#1e1b4b]">{g.name}</span>
                                                        <span className="block truncate text-xs text-[#78716c]">{g.title}</span>
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'shrink-0 rounded-xl px-2 py-1 text-center leading-none',
                                                            active ? 'bg-[#4338ca] text-white' : 'bg-[#fef3c7] text-[#1e1b4b]',
                                                        )}
                                                    >
                                                        <span className="block text-[9px] font-bold uppercase tracking-wider">{shortMonth(e.date)}</span>
                                                        <span className="mt-0.5 block font-serif text-lg">{parse(e.date)[2]}</span>
                                                    </span>
                                                </button>
                                            </motion.li>
                                        )
                                    })}
                                </AnimatePresence>
                            </ul>
                            {listed.length === 0 && (
                                <p className="px-2 py-6 text-center text-sm text-[#78716c]">
                                    Nothing planned on this day. Pick a dotted date instead.
                                </p>
                            )}
                            {quiet.length > 0 && (
                                <p className="mt-3 border-t border-[#f5efdc] px-2 pt-3 text-xs text-[#a8a29e]">
                                    No {MONTHS[month]} dates yet: {quiet.map((g) => g.name).join(', ')}
                                </p>
                            )}
                        </div>
                    </aside>

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.article
                            key={selected}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.28 }}
                            className="min-w-0 self-start overflow-hidden rounded-3xl bg-white ring-1 ring-[#f1e7c9]"
                        >
                            <img src={selGroup.photo} alt={selGroup.alt} loading="lazy" className="aspect-[16/7] w-full object-cover" />
                            <div className="p-5 sm:p-8">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                                    <div className="w-20 shrink-0 overflow-hidden rounded-2xl text-center ring-1 ring-[#e0e7ff]">
                                        <p className="bg-[#4338ca] py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">{shortMonth(selDate)}</p>
                                        <p className="py-1 font-serif text-4xl leading-tight text-[#1e1b4b]">{parse(selDate)[2]}</p>
                                        <p className="pb-2 text-[11px] font-semibold text-[#78716c]">{WEEKDAYS[weekday(selDate)].slice(0, 3)}</p>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#4338ca]">
                                            <span className={cn('size-2 rounded-full', selGroup.dot)} aria-hidden="true" />
                                            {selGroup.name} · {selGroup.members.toLocaleString('en-US')} members
                                        </p>
                                        <h3 className="mt-2 font-serif text-3xl font-normal leading-tight text-[#1e1b4b] sm:text-4xl">{selGroup.title}</h3>
                                        <ul className="mt-4 space-y-2 text-sm text-[#44403c]">
                                            <li className="flex items-center gap-2">
                                                <HiOutlineCalendarDays className="size-4 shrink-0 text-[#4338ca]" aria-hidden="true" />
                                                {longDate(selDate)} {YEAR}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <HiOutlineClock className="size-4 shrink-0 text-[#4338ca]" aria-hidden="true" />
                                                {selGroup.time}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <HiOutlineMapPin className="size-4 shrink-0 text-[#4338ca]" aria-hidden="true" />
                                                {selGroup.venue}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#f5efdc] pt-6">
                                    <div className="flex -space-x-2">
                                        {attendeeFaces.map((f) => (
                                            <img key={f} src={f} alt="" loading="lazy" className="size-9 rounded-full border-2 border-white object-cover" />
                                        ))}
                                    </div>
                                    <p className="mr-auto text-sm text-[#44403c]">
                                        <span className="font-bold text-[#1e1b4b]">{selGroup.going + (isGoing ? 1 : 0)} going</span>
                                        {isGoing && ' · including you'}
                                    </p>
                                    <button
                                        type="button"
                                        aria-pressed={isGoing}
                                        className={cn(
                                            'inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]',
                                            isGoing ? 'bg-[#eef2ff] text-[#4338ca] ring-1 ring-[#c7d2fe]' : 'bg-[#4338ca] text-white hover:bg-[#3730a3]',
                                        )}
                                        onClick={() => setGoing((g) => ({ ...g, [selected]: !g[selected] }))}
                                    >
                                        {isGoing && <HiCheck className="size-4" aria-hidden="true" />}
                                        {isGoing ? 'Going' : 'RSVP — I’m going'}
                                    </button>
                                </div>

                                {otherDates.length > 0 && (
                                    <div className="mt-6">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a8a29e]">Other dates</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {otherDates.map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    className="min-h-10 rounded-full border border-[#f1e7c9] px-4 text-sm text-[#1e1b4b] transition-colors hover:border-[#4338ca] hover:text-[#4338ca] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]"
                                                    onClick={() => jumpTo(d)}
                                                >
                                                    {WEEKDAYS[weekday(d)].slice(0, 3)} {parse(d)[2]} {shortMonth(d)}
                                                    {going[`${selGroupId}:${d}`] && (
                                                        <>
                                                            <HiCheck className="ml-1 inline size-3.5 text-[#4338ca]" aria-hidden="true" />
                                                            <span className="sr-only"> (going)</span>
                                                        </>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <a
                                    href={`#event-${selGroupId}-${selDate}`}
                                    className="mt-6 inline-flex min-h-10 items-center gap-1 text-sm font-bold text-[#4338ca] underline decoration-[#c7d2fe] decoration-2 underline-offset-4 hover:decoration-[#4338ca] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4338ca]"
                                >
                                    Event details & chat
                                    <HiChevronRight className="size-4" aria-hidden="true" />
                                </a>
                            </div>
                        </motion.article>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default EventGroupsGroupSidebar

// WeekPlannerLearnerDashboard

// LearnerDashboard05 · Learning Management Systems › Interactive Dashboard

// Description:
// A fresh, calendar-first planner for the fictional tutoring service Tempo Tutoring. Under
// "Your week, in tempo." it lays out 28 Sep – 4 Oct as a weekly grid of live tutoring
// sessions and homework deadlines; clicking any event opens a details panel with tutor,
// time and a "Join room" or "Mark done" action, and a progress donut shows how much of the
// week is done. Use it on a student or parent dashboard for scheduled, tutor-led learning.

// Design:
// - Mint #e6fcf5 section, white calendar card, teal #0ca678 for live sessions, ink #0b1f1a
//   for deadlines and text; hour lines drawn with a repeating-linear-gradient background
// - Events are rounded-xl blocks positioned by start time and length (48px per hour);
//   live = teal fill, deadline = ink pill with a flag icon; done events get a check and
//   a softer tint; the selected event gets a 2px ink ring
// - Sans type with semibold tracking-tight headings and mono times; the donut is an SVG
//   ring whose teal arc animates its pathLength when progress changes
// - Details panel crossfades (AnimatePresence) and events lift slightly on hover; motion is
//   instant for reduced motion
// - Responsive: md+ shows the full 7-column grid with an hour gutter; below md a scrollable
//   row of day chips picks one day and shows it as an agenda list; the side column (donut +
//   details) sits beside the calendar on lg and below it otherwise

// What it does:
// - selectedId state opens the details panel for an event (buttons use aria-pressed); the
//   close button or Escape inside the panel clears it
// - doneIds state is toggled by "Mark done" / "Mark attended"; the donut, "3 of 8 done"
//   label and event styling update from it
// - mobileDay state switches the agenda list below md; "Join room" links go to
//   #join-<event>; dates are fixed (no clock) so server and client render the same

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import WeekPlannerLearnerDashboard from '@/TestComponent/PageSections/learning/LearnerDashboard05';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <WeekPlannerLearnerDashboard />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheck, HiOutlineFlag, HiOutlineVideoCamera, HiVideoCamera, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const START = 9
const END = 21
const HOUR = 48

const days = [
    { id: 'mon', short: 'Mon', name: 'Monday', date: 28, month: 'Sep' },
    { id: 'tue', short: 'Tue', name: 'Tuesday', date: 29, month: 'Sep' },
    { id: 'wed', short: 'Wed', name: 'Wednesday', date: 30, month: 'Sep' },
    { id: 'thu', short: 'Thu', name: 'Thursday', date: 1, month: 'Oct' },
    { id: 'fri', short: 'Fri', name: 'Friday', date: 2, month: 'Oct' },
    { id: 'sat', short: 'Sat', name: 'Saturday', date: 3, month: 'Oct' },
    { id: 'sun', short: 'Sun', name: 'Sunday', date: 4, month: 'Oct' },
]

const events = [
    { id: 'algebra', day: 'mon', type: 'live', title: 'Algebra II: quadratics', start: '16:00', end: '17:00', who: 'Ms. Adaeze Okafor', initials: 'AO', note: 'Bring last week’s factoring worksheet.' },
    { id: 'reading-log', day: 'mon', type: 'deadline', title: 'Reading log, ch. 4–6', start: '20:00', who: 'English · Mr. Owen Hale', initials: 'OH', note: 'Upload a photo or PDF of your log.' },
    { id: 'chemistry', day: 'tue', type: 'live', title: 'Chemistry: moles & molar mass', start: '17:30', end: '19:00', who: 'Mr. Tomasz Lewandowski', initials: 'TL', note: 'Calculator and periodic table needed.' },
    { id: 'essay', day: 'wed', type: 'deadline', title: 'English essay draft', start: '18:00', who: 'English · Mr. Owen Hale', initials: 'OH', note: '800–1,000 words on The Giver, double-spaced.' },
    { id: 'sat-math', day: 'thu', type: 'live', title: 'SAT Math drill', start: '16:30', end: '17:30', who: 'Ms. Adaeze Okafor', initials: 'AO', note: 'Timed section: 22 questions, 35 minutes.' },
    { id: 'physics', day: 'fri', type: 'deadline', title: 'Physics problem set 3', start: '17:00', who: 'Physics · Dr. Kenji Imai', initials: 'KI', note: 'Show working for questions 4, 7 and 9.' },
    { id: 'spanish', day: 'sat', type: 'live', title: 'Spanish conversation', start: '10:00', end: '11:30', who: 'Sra. Lucía Ferrer', initials: 'LF', note: 'Topic: planning a weekend trip.' },
    { id: 'review', day: 'sun', type: 'live', title: 'Weekly review with your coach', start: '19:00', end: '19:45', who: 'Coach Dev Mehta', initials: 'DM', note: 'We’ll set goals for next week together.' },
]

const toHours = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h + m / 60
}
const hourLabel = (h) => `${h}:00`

export function WeekPlannerLearnerDashboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [selectedId, setSelectedId] = useState('essay')
    const [doneIds, setDoneIds] = useState(['algebra', 'reading-log', 'chemistry'])
    const [mobileDay, setMobileDay] = useState('wed')

    const selected = events.find((e) => e.id === selectedId) || null
    const doneCount = doneIds.length
    const ratio = doneCount / events.length
    const liveHours = events.filter((e) => e.type === 'live').reduce((s, e) => s + toHours(e.end) - toHours(e.start), 0)
    const toggleDone = (id) => setDoneIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

    const eventLabel = (e) => {
        const d = days.find((x) => x.id === e.day)
        const when = e.type === 'live' ? `${e.start} to ${e.end}` : `due ${e.start}`
        return `${e.title}, ${d.name} ${when}, ${e.type === 'live' ? 'live session' : 'deadline'}${doneIds.includes(e.id) ? ', done' : ''}`
    }

    const eventClasses = (e) => {
        const done = doneIds.includes(e.id)
        return cn(
            'text-left transition-[translate,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b1f1a] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-12px_rgba(11,31,26,0.6)] motion-reduce:hover:translate-y-0',
            e.type === 'live'
                ? done
                    ? 'bg-[#c3f0e0] text-[#0b1f1a]'
                    : 'bg-[#0ca678] text-white'
                : done
                  ? 'bg-[#0b1f1a]/15 text-[#0b1f1a]'
                  : 'bg-[#0b1f1a] text-[#e6fcf5]',
            selectedId === e.id && 'ring-2 ring-[#0b1f1a] ring-offset-2 ring-offset-white',
        )
    }

    const eventIcon = (e, iconClass) => {
        if (doneIds.includes(e.id)) return <HiCheck className={iconClass} aria-hidden="true" />
        return e.type === 'live' ? <HiVideoCamera className={iconClass} aria-hidden="true" /> : <HiOutlineFlag className={iconClass} aria-hidden="true" />
    }
    const selectedDay = selected ? days.find((d) => d.id === selected.day) : null

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#e6fcf5] px-4 py-16 text-base font-normal text-[#0b1f1a] antialiased sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2 text-sm font-semibold text-[#0ca678]">
                            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                <path d="M8 21 L10.5 3 H13.5 L16 21 Z" fill="none" stroke="#0ca678" strokeWidth="1.8" strokeLinejoin="round" />
                                <path d="M12 16 L17 6" stroke="#0b1f1a" strokeWidth="1.8" strokeLinecap="round" />
                                <circle cx="15.6" cy="8.8" r="1.6" fill="#0b1f1a" />
                            </svg>
                            Tempo Tutoring
                        </p>
                        <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-[#0b1f1a] sm:text-5xl">
                            Your week, <span className="text-[#0ca678]">in tempo.</span>
                        </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#0b1f1a]/70">
                        <span className="font-mono">28 Sep – 4 Oct 2026</span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded bg-[#0ca678]" aria-hidden="true" /> Live session
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded bg-[#0b1f1a]" aria-hidden="true" /> Deadline
                        </span>
                    </div>
                </div>

                <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_320px]">
                    <div className="min-w-0 rounded-3xl bg-white p-4 shadow-[0_24px_50px_-30px_rgba(12,166,120,0.55)] sm:p-6">
                        {/* Mobile: day chips + agenda */}
                        <div className="md:hidden">
                            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none]" role="group" aria-label="Choose day">
                                {days.map((d) => {
                                    const count = events.filter((e) => e.day === d.id).length
                                    return (
                                        <button
                                            key={d.id}
                                            type="button"
                                            aria-pressed={mobileDay === d.id}
                                            aria-label={`${d.name} ${d.date}, ${count} event${count === 1 ? '' : 's'}`}
                                            className={cn(
                                                'flex min-h-14 w-12 shrink-0 flex-col items-center justify-center rounded-2xl text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b1f1a]',
                                                mobileDay === d.id ? 'bg-[#0b1f1a] text-white' : 'bg-[#e6fcf5] text-[#0b1f1a]',
                                            )}
                                            onClick={() => setMobileDay(d.id)}
                                        >
                                            <span className="font-medium">{d.short}</span>
                                            <span className="text-base font-semibold tabular-nums">{d.date}</span>
                                        </button>
                                    )
                                })}
                            </div>
                            <ul className="mt-3 space-y-2">
                                {events
                                    .filter((e) => e.day === mobileDay)
                                    .map((e) => (
                                        <li key={e.id}>
                                            <button
                                                type="button"
                                                aria-pressed={selectedId === e.id}
                                                aria-controls="tempo-details"
                                                aria-label={eventLabel(e)}
                                                className={cn(eventClasses(e), 'flex min-h-14 w-full items-center gap-3 rounded-2xl px-4 py-3')}
                                                onClick={() => setSelectedId(e.id)}
                                            >
                                                {eventIcon(e, 'h-5 w-5 shrink-0')}
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-semibold">{e.title}</span>
                                                    <span className="block font-mono text-xs opacity-80">
                                                        {e.type === 'live' ? `${e.start}–${e.end}` : `Due ${e.start}`}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        {/* md+: full week grid */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] gap-x-1.5">
                                <span />
                                {days.map((d) => (
                                    <div key={d.id} className="pb-3 text-center">
                                        <p className="text-xs font-medium text-[#0b1f1a]/55">{d.short}</p>
                                        <p className="text-lg font-semibold tabular-nums text-[#0b1f1a]">{d.date}</p>
                                    </div>
                                ))}

                                <div className="relative" style={{ height: (END - START) * HOUR }} aria-hidden="true">
                                    {Array.from({ length: END - START }, (_, i) => (
                                        <span key={i} className="absolute right-1 -translate-y-1/2 font-mono text-[10px] text-[#0b1f1a]/45" style={{ top: i * HOUR }}>
                                            {hourLabel(START + i)}
                                        </span>
                                    ))}
                                </div>
                                {days.map((d) => (
                                    <ul
                                        key={d.id}
                                        aria-label={`${d.name} ${d.date}`}
                                        className="relative rounded-xl border-t border-[#0b1f1a]/10 bg-[repeating-linear-gradient(to_bottom,transparent_0_47px,rgba(11,31,26,0.07)_47px_48px)]"
                                        style={{ height: (END - START) * HOUR }}
                                    >
                                        {events
                                            .filter((e) => e.day === d.id)
                                            .map((e) => {
                                                const top = (toHours(e.start) - START) * HOUR
                                                const height = e.type === 'live' ? (toHours(e.end) - toHours(e.start)) * HOUR - 3 : 30
                                                return (
                                                    <li key={e.id} className="absolute inset-x-0.5" style={{ top: top + 1, height }}>
                                                        <button
                                                            type="button"
                                                            aria-pressed={selectedId === e.id}
                                                            aria-controls="tempo-details"
                                                            aria-label={eventLabel(e)}
                                                            className={cn(
                                                                eventClasses(e),
                                                                'flex h-full w-full flex-col overflow-hidden px-2 py-1',
                                                                e.type === 'live' ? 'rounded-xl' : 'flex-row items-center gap-1 rounded-full',
                                                            )}
                                                            onClick={() => setSelectedId(e.id)}
                                                        >
                                                            {e.type === 'live' ? (
                                                                <>
                                                                    <span className="flex items-center gap-1 font-mono text-[10px] opacity-85">
                                                                        {eventIcon(e, 'h-3 w-3 shrink-0')}
                                                                        {e.start}
                                                                    </span>
                                                                    <span
                                                                        className={cn(
                                                                            'mt-0.5 text-[11px] font-semibold leading-tight lg:text-xs',
                                                                            height > 60 ? 'line-clamp-2' : 'truncate',
                                                                        )}
                                                                    >
                                                                        {e.title}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {eventIcon(e, 'h-3.5 w-3.5 shrink-0')}
                                                                    <span className="truncate text-[11px] font-semibold">{e.title}</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </li>
                                                )
                                            })}
                                    </ul>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
                        <div className="flex items-center gap-5 rounded-3xl bg-[#0b1f1a] p-5 text-[#e6fcf5]">
                            <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0 -rotate-90" role="img" aria-label={`${Math.round(ratio * 100)} percent of this week done`}>
                                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(230,252,245,0.14)" strokeWidth="12" />
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#0ca678"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    initial={false}
                                    animate={{ pathLength: ratio }}
                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 18 }}
                                />
                            </svg>
                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#e6fcf5]/60">This week</p>
                                <p className="mt-1 text-3xl font-semibold tabular-nums text-white" aria-live="polite">
                                    {doneCount} of {events.length} done
                                </p>
                                <p className="mt-1 text-sm text-[#e6fcf5]/70">{+liveHours.toFixed(2)} h of live tutoring planned</p>
                            </div>
                        </div>

                        <div
                            id="tempo-details"
                            className="min-h-64 rounded-3xl border border-[#0ca678]/25 bg-white p-5"
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') setSelectedId(null)
                            }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {selected ? (
                                    <motion.div
                                        key={selected.id}
                                        initial={reduce ? false : { opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span
                                                className={cn(
                                                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                                                    selected.type === 'live' ? 'bg-[#e6fcf5] text-[#087f5b]' : 'bg-[#0b1f1a] text-[#e6fcf5]',
                                                )}
                                            >
                                                {selected.type === 'live' ? (
                                                    <HiOutlineVideoCamera className="h-3.5 w-3.5" aria-hidden="true" />
                                                ) : (
                                                    <HiOutlineFlag className="h-3.5 w-3.5" aria-hidden="true" />
                                                )}
                                                {selected.type === 'live' ? 'Live session' : 'Deadline'}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label="Close details"
                                                className="grid h-10 w-10 place-items-center rounded-full text-[#0b1f1a]/60 transition-colors hover:bg-[#e6fcf5] hover:text-[#0b1f1a] focus-visible:outline-2 focus-visible:outline-[#0b1f1a]"
                                                onClick={() => setSelectedId(null)}
                                            >
                                                <HiXMark className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </div>
                                        <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-[#0b1f1a]">{selected.title}</h3>
                                        <p className="mt-1 font-mono text-sm text-[#0b1f1a]/70">
                                            {selectedDay.name} {selectedDay.date} {selectedDay.month} ·{' '}
                                            {selected.type === 'live' ? `${selected.start}–${selected.end}` : `due ${selected.start}`}
                                        </p>
                                        <p className="mt-4 flex items-center gap-2.5 text-sm">
                                            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e6fcf5] text-xs font-semibold text-[#087f5b]" aria-hidden="true">
                                                {selected.initials}
                                            </span>
                                            {selected.who}
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed text-[#0b1f1a]/70">{selected.note}</p>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {selected.type === 'live' && (
                                                <a
                                                    href={`#join-${selected.id}`}
                                                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0ca678] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#099268] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b1f1a]"
                                                >
                                                    <HiVideoCamera className="h-4 w-4" aria-hidden="true" />
                                                    Join room
                                                </a>
                                            )}
                                            <button
                                                type="button"
                                                aria-pressed={doneIds.includes(selected.id)}
                                                className={cn(
                                                    'inline-flex min-h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b1f1a]',
                                                    doneIds.includes(selected.id)
                                                        ? 'border-[#0b1f1a] bg-[#0b1f1a] text-white'
                                                        : 'border-[#0b1f1a]/20 text-[#0b1f1a] hover:border-[#0b1f1a]',
                                                )}
                                                onClick={() => toggleDone(selected.id)}
                                            >
                                                <HiCheck className="h-4 w-4" aria-hidden="true" />
                                                {doneIds.includes(selected.id)
                                                    ? 'Done'
                                                    : selected.type === 'live'
                                                      ? 'Mark attended'
                                                      : 'Mark done'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.p
                                        key="empty"
                                        initial={reduce ? false : { opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid min-h-52 place-items-center text-center text-sm text-[#0b1f1a]/55"
                                    >
                                        Pick a session or deadline to see the details.
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WeekPlannerLearnerDashboard

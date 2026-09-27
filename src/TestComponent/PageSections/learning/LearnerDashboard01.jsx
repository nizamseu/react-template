// SidebarClassicLearnerDashboard

// LearnerDashboard01 · Learning Management Systems › Interactive Dashboard

// Description:
// A clean, logged-in learner home for the fictional LMS Brightpath. An app frame pairs a
// sidebar (Overview, My courses, Deadlines, Streak) with a main panel that greets "Welcome
// back, Amara", shows a blue "Pick up where you left off" card with a "Continue" button, a
// 12-day streak counter, course progress cards and upcoming deadlines. Use it as the first
// screen after sign-in on any course platform.

// Design:
// - App frame: white rounded-3xl card with a gray-200 border on a gray-50 #f9fafb section;
//   lg:grid-cols-[248px_1fr] with the sidebar on the left and a hairline divider
// - Blue #2563eb for the active nav item, progress bars, links and the Continue card;
//   slate #0f172a text, gray-500 secondary copy, per-course accent dots
// - Sans typography with tight tracking on headings; rounded-2xl inner cards, 1px borders,
//   a soft blue shadow on the Continue card; streak week shown as seven round day dots
// - Panels crossfade and rise 8px on switch (AnimatePresence); progress bars grow from the
//   left; both are instant for reduced motion
// - Responsive: below lg the sidebar collapses into a horizontal, scrollable tab strip under
//   the brand row; card grids go 1 → sm:2 → xl:3 columns

// What it does:
// - activeTab state (overview / courses / deadlines / streak) switches the main panel; the
//   nav is a role="tablist" with arrow-key, Home and End support
// - Deadlines can be ticked off (doneIds state); the open count in the nav badge, the
//   overview list and the Deadlines panel all update from the same state
// - "Continue" buttons link to #continue-<course>, the bell to #notifications; "All
//   courses" switches to the My courses tab; the streak heatmap is visual (fixed data)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SidebarClassicLearnerDashboard from '@/TestComponent/PageSections/learning/LearnerDashboard01';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <SidebarClassicLearnerDashboard />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiCheck,
    HiFire,
    HiOutlineBell,
    HiOutlineBookOpen,
    HiOutlineCalendarDays,
    HiOutlineClock,
    HiOutlineFire,
    HiOutlineSquares2X2,
    HiPlay,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tabs = [
    { id: 'overview', label: 'Overview', icon: HiOutlineSquares2X2 },
    { id: 'courses', label: 'My courses', icon: HiOutlineBookOpen },
    { id: 'deadlines', label: 'Deadlines', icon: HiOutlineCalendarDays },
    { id: 'streak', label: 'Streak', icon: HiOutlineFire },
]

const courses = [
    {
        id: 'ux-research',
        title: 'UX Research Foundations',
        lesson: 'Lesson 4.3 · Running a moderated usability test',
        mentor: 'Dr. Lena Ortiz',
        done: 17,
        total: 25,
        minutesLeft: 18,
        dot: 'bg-[#2563eb]',
    },
    {
        id: 'sql',
        title: 'SQL for Product Teams',
        lesson: 'Lesson 2.5 · Window functions in practice',
        mentor: 'Marcus Webb',
        done: 9,
        total: 22,
        minutesLeft: 24,
        dot: 'bg-[#0ea5e9]',
    },
    {
        id: 'ux-writing',
        title: 'Writing for Interfaces',
        lesson: 'Lesson 6.1 · Error messages that actually help',
        mentor: 'Priya Natarajan',
        done: 19,
        total: 22,
        minutesLeft: 11,
        dot: 'bg-[#6366f1]',
    },
    {
        id: 'design-systems',
        title: 'Design Systems 101',
        lesson: 'Lesson 1.3 · Tokens, not hex codes',
        mentor: 'Tomás Reyes',
        done: 3,
        total: 24,
        minutesLeft: 32,
        dot: 'bg-[#14b8a6]',
    },
]

const deadlines = [
    { id: 'd1', title: 'Usability test report', course: 'UX Research Foundations', date: 'Tue 29 Sep', time: '23:59', week: 'This week' },
    { id: 'd2', title: 'Quiz: joins and subqueries', course: 'SQL for Product Teams', date: 'Wed 30 Sep', time: '18:00', week: 'This week' },
    { id: 'd3', title: 'Rewrite 5 onboarding screens', course: 'Writing for Interfaces', date: 'Fri 2 Oct', time: '12:00', week: 'This week' },
    { id: 'd4', title: 'Token audit worksheet', course: 'Design Systems 101', date: 'Mon 5 Oct', time: '09:00', week: 'Next week' },
    { id: 'd5', title: 'Peer review: interview guide', course: 'UX Research Foundations', date: 'Thu 8 Oct', time: '17:00', week: 'Next week' },
]

const week = [
    { day: 'M', label: 'Monday', studied: true },
    { day: 'T', label: 'Tuesday', studied: true },
    { day: 'W', label: 'Wednesday', studied: true },
    { day: 'T', label: 'Thursday', studied: true },
    { day: 'F', label: 'Friday', studied: true },
    { day: 'S', label: 'Saturday', studied: true },
    { day: 'S', label: 'Sunday', studied: false },
]

// minutes studied per day for the last five weeks (oldest first)
const heat = [
    0, 25, 40, 0, 15, 0, 0, 30, 45, 20, 0, 35, 60, 10, 0, 20, 35, 50, 40, 0, 0, 0, 30, 45, 55, 40, 70,
    35, 50, 20, 40, 65, 30, 45, 0,
]

const heatClass = (m) =>
    m === 0 ? 'bg-gray-100' : m < 25 ? 'bg-[#bfdbfe]' : m < 45 ? 'bg-[#60a5fa]' : 'bg-[#2563eb]'

const pct = (c) => Math.round((c.done / c.total) * 100)

function ProgressBar({ value, reduce, className }) {
    return (
        <div className={cn('h-2 w-full overflow-hidden rounded-full bg-gray-100', className)}>
            <motion.div
                className="h-full origin-left rounded-full bg-[#2563eb]"
                style={{ width: `${value}%` }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
        </div>
    )
}

function DeadlineRow({ item, done, onToggle }) {
    return (
        <li className="flex items-center gap-3 py-3">
            <button
                type="button"
                aria-pressed={done}
                aria-label={done ? `Mark “${item.title}” as not done` : `Mark “${item.title}” as done`}
                className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]',
                    done
                        ? 'border-[#2563eb] bg-[#2563eb] text-white'
                        : 'border-gray-200 bg-white text-transparent hover:border-[#2563eb]/60 hover:text-[#2563eb]/40',
                )}
                onClick={onToggle}
            >
                <HiCheck className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
                <p
                    className={cn(
                        'truncate text-sm font-semibold text-[#0f172a]',
                        done && 'text-gray-400 line-through decoration-gray-300',
                    )}
                >
                    {item.title}
                </p>
                <p className="truncate text-xs text-gray-500">{item.course}</p>
            </div>
            <div className="shrink-0 text-right">
                <p className={cn('text-xs font-semibold text-[#0f172a]', done && 'text-gray-400')}>{item.date}</p>
                <p className="text-[11px] tabular-nums text-gray-500">{item.time}</p>
            </div>
        </li>
    )
}

export function SidebarClassicLearnerDashboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [activeTab, setActiveTab] = useState('overview')
    const [doneIds, setDoneIds] = useState(['d5'])
    const tabRefs = useRef([])

    const openCount = deadlines.filter((d) => !doneIds.includes(d.id)).length
    const toggleDone = (id) =>
        setDoneIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
    const current = courses[0]

    const onTabKeyDown = (event, index) => {
        const last = tabs.length - 1
        let next = null
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = last
        if (next === null) return
        event.preventDefault()
        setActiveTab(tabs[next].id)
        tabRefs.current[next]?.focus()
    }

    const panelMotion = reduce
        ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
              transition: { duration: 0.25, ease: 'easeOut' },
          }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f9fafb] px-4 py-12 text-base font-normal text-[#0f172a] antialiased sm:px-6 md:py-20 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.25)] lg:grid lg:grid-cols-[248px_1fr]">
                {/* Sidebar / mobile tab strip */}
                <aside className="border-b border-gray-200 lg:flex lg:flex-col lg:border-b-0 lg:border-r lg:bg-[#f9fafb]/60">
                    <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6 lg:px-5 lg:pt-6">
                        <a
                            href="#brightpath-home"
                            className="inline-flex min-h-10 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                        >
                            <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
                                <rect width="32" height="32" rx="9" fill="#2563eb" />
                                <path d="M9 22 L16 9 L23 22" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="16" cy="22" r="2.2" fill="#bfdbfe" />
                            </svg>
                            <span className="text-lg font-semibold tracking-tight text-[#0f172a]">Brightpath</span>
                        </a>
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#dbeafe] text-sm font-semibold text-[#1d4ed8] lg:hidden" aria-hidden="true">
                            AO
                        </span>
                    </div>

                    <div
                        role="tablist"
                        aria-label="Dashboard sections"
                        className="mt-3 flex gap-1 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:px-6 lg:mt-8 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
                    >
                        {tabs.map((tab, index) => {
                            const Icon = tab.icon
                            const selected = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    ref={(el) => {
                                        tabRefs.current[index] = el
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`bp-tab-${tab.id}`}
                                    aria-selected={selected}
                                    aria-controls={`bp-panel-${tab.id}`}
                                    tabIndex={selected ? 0 : -1}
                                    className={cn(
                                        'relative flex min-h-10 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] lg:w-full',
                                        selected
                                            ? 'bg-[#eff6ff] text-[#2563eb]'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-[#0f172a]',
                                    )}
                                    onClick={() => setActiveTab(tab.id)}
                                    onKeyDown={(e) => onTabKeyDown(e, index)}
                                >
                                    {selected && (
                                        <span className="absolute inset-y-2 left-0 hidden w-1 rounded-full bg-[#2563eb] lg:block" aria-hidden="true" />
                                    )}
                                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                    {tab.label}
                                    {tab.id === 'deadlines' && openCount > 0 && (
                                        <span className="ml-auto rounded-full bg-[#2563eb] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">
                                            {openCount}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mx-3 mb-5 mt-auto hidden rounded-2xl border border-gray-200 bg-white p-4 lg:block">
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#dbeafe] text-sm font-semibold text-[#1d4ed8]" aria-hidden="true">
                                AO
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#0f172a]">Amara Osei</p>
                                <p className="truncate text-xs text-gray-500">Product Design track</p>
                            </div>
                        </div>
                        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#2563eb]">
                            <HiFire className="h-4 w-4" aria-hidden="true" />
                            12-day streak · keep it going
                        </p>
                    </div>
                </aside>

                {/* Main panel */}
                <div className="min-w-0 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Sunday, 27 September</p>
                            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#0f172a] sm:text-3xl">
                                Welcome back, Amara
                            </h2>
                        </div>
                        <a
                            href="#notifications"
                            aria-label="Notifications, 3 new"
                            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-[#2563eb]/40 hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                        >
                            <HiOutlineBell className="h-5 w-5" aria-hidden="true" />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2563eb] ring-2 ring-white" aria-hidden="true" />
                        </a>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={activeTab}
                            role="tabpanel"
                            id={`bp-panel-${activeTab}`}
                            aria-labelledby={`bp-tab-${activeTab}`}
                            tabIndex={0}
                            className="mt-6 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563eb]"
                            {...panelMotion}
                        >
                            {activeTab === 'overview' && (
                                <div className="grid gap-4 xl:grid-cols-3">
                                    <div className="relative overflow-hidden rounded-2xl bg-[#2563eb] p-5 text-white shadow-[0_18px_40px_-20px_rgba(37,99,235,0.8)] sm:p-6 xl:col-span-2">
                                        <svg className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 text-white/10" viewBox="0 0 100 100" aria-hidden="true">
                                            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="10" />
                                            <circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="10" />
                                        </svg>
                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">Pick up where you left off</p>
                                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">{current.title}</h3>
                                        <p className="mt-1 text-sm text-white/80">{current.lesson}</p>
                                        <div className="mt-5 flex items-center gap-3">
                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
                                                <div className="h-full rounded-full bg-white" style={{ width: `${pct(current)}%` }} />
                                            </div>
                                            <span className="text-sm font-semibold tabular-nums">{pct(current)}%</span>
                                        </div>
                                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                                            <a
                                                href={`#continue-${current.id}`}
                                                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#2563eb] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                                            >
                                                <HiPlay className="h-4 w-4" aria-hidden="true" />
                                                Continue
                                            </a>
                                            <span className="inline-flex items-center gap-1.5 text-sm text-white/80">
                                                <HiOutlineClock className="h-4 w-4" aria-hidden="true" />
                                                {current.minutesLeft} min left in this lesson
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 p-5 sm:p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-[#0f172a]">Study streak</h3>
                                            <HiFire className="h-5 w-5 text-[#2563eb]" aria-hidden="true" />
                                        </div>
                                        <p className="mt-3 flex items-baseline gap-2">
                                            <span className="text-5xl font-semibold tracking-tight tabular-nums text-[#0f172a]">12</span>
                                            <span className="text-sm text-gray-500">days in a row</span>
                                        </p>
                                        <ul className="mt-4 flex justify-between gap-1" aria-label="This week">
                                            {week.map((d) => (
                                                <li key={d.label} className="flex flex-col items-center gap-1.5">
                                                    <span
                                                        className={cn(
                                                            'grid h-8 w-8 place-items-center rounded-full text-[11px] font-semibold',
                                                            d.studied
                                                                ? 'bg-[#2563eb] text-white'
                                                                : 'border border-dashed border-gray-300 text-gray-400',
                                                        )}
                                                    >
                                                        {d.studied ? <HiCheck className="h-3.5 w-3.5" aria-hidden="true" /> : '·'}
                                                    </span>
                                                    <span className="text-[11px] text-gray-500" aria-hidden="true">{d.day}</span>
                                                    <span className="sr-only">
                                                        {d.label}: {d.studied ? 'studied' : 'not yet'}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="mt-4 text-xs text-gray-500">15 minutes today keeps your streak alive.</p>
                                    </div>

                                    <div className="xl:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-semibold text-[#0f172a]">In progress</h3>
                                            <button
                                                type="button"
                                                className="min-h-10 rounded-lg px-2 text-sm font-medium text-[#2563eb] hover:underline focus-visible:outline-2 focus-visible:outline-[#2563eb]"
                                                onClick={() => setActiveTab('courses')}
                                            >
                                                All courses
                                            </button>
                                        </div>
                                        <ul className="mt-2 grid gap-3 sm:grid-cols-3">
                                            {courses.slice(1).map((c) => (
                                                <li key={c.id} className="rounded-2xl border border-gray-200 p-4">
                                                    <span className={cn('block h-2 w-2 rounded-full', c.dot)} aria-hidden="true" />
                                                    <p className="mt-3 text-sm font-semibold leading-snug text-[#0f172a]">{c.title}</p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {c.done}/{c.total} lessons
                                                    </p>
                                                    <ProgressBar value={pct(c)} reduce={reduce} className="mt-3" />
                                                    <p className="mt-1.5 text-right text-xs font-semibold tabular-nums text-[#0f172a]">{pct(c)}%</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 p-5">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-semibold text-[#0f172a]">Upcoming</h3>
                                            <span className="rounded-full bg-[#eff6ff] px-2.5 py-1 text-xs font-semibold text-[#2563eb]">{openCount} open</span>
                                        </div>
                                        <ul className="mt-1 divide-y divide-gray-100">
                                            {deadlines
                                                .filter((d) => !doneIds.includes(d.id))
                                                .slice(0, 3)
                                                .map((d) => (
                                                    <DeadlineRow key={d.id} item={d} done={false} onToggle={() => toggleDone(d.id)} />
                                                ))}
                                        </ul>
                                        {openCount === 0 && (
                                            <p className="py-6 text-center text-sm text-gray-500">All caught up. Nothing due.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'courses' && (
                                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {courses.map((c) => (
                                        <li key={c.id} className="flex flex-col rounded-2xl border border-gray-200 p-5">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className={cn('h-2 w-2 rounded-full', c.dot)} aria-hidden="true" />
                                                {c.mentor}
                                            </div>
                                            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-[#0f172a]">{c.title}</h3>
                                            <p className="mt-1 text-sm text-gray-500">Next: {c.lesson}</p>
                                            <div className="mt-auto pt-5">
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>
                                                        {c.done} of {c.total} lessons
                                                    </span>
                                                    <span className="font-semibold tabular-nums text-[#0f172a]">{pct(c)}%</span>
                                                </div>
                                                <ProgressBar value={pct(c)} reduce={reduce} className="mt-2" />
                                                <a
                                                    href={`#continue-${c.id}`}
                                                    className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#2563eb]/25 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-[#2563eb] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                                >
                                                    Continue
                                                    <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {activeTab === 'deadlines' && (
                                <div className="grid gap-6 lg:grid-cols-2">
                                    {['This week', 'Next week'].map((group) => (
                                        <div key={group} className="rounded-2xl border border-gray-200 px-4 py-3 sm:px-5">
                                            <h3 className="pt-1 text-sm font-semibold text-[#0f172a]">{group}</h3>
                                            <ul className="divide-y divide-gray-100">
                                                {deadlines
                                                    .filter((d) => d.week === group)
                                                    .map((d) => (
                                                        <DeadlineRow key={d.id} item={d} done={doneIds.includes(d.id)} onToggle={() => toggleDone(d.id)} />
                                                    ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <p className="text-sm text-gray-500 lg:col-span-2" aria-live="polite">
                                        {openCount} open · {deadlines.length - openCount} done
                                    </p>
                                </div>
                            )}

                            {activeTab === 'streak' && (
                                <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                                    <div className="rounded-2xl border border-gray-200 p-5 sm:p-6">
                                        <h3 className="text-base font-semibold text-[#0f172a]">Last five weeks</h3>
                                        <p className="mt-1 text-sm text-gray-500">Each square is a day. Darker means more minutes studied.</p>
                                        <div className="mt-5 grid max-w-md grid-cols-7 gap-1.5" role="img" aria-label="Study heatmap: 25 of the last 35 days had study time">
                                            {heat.map((m, i) => (
                                                <span key={i} className={cn('aspect-square rounded-md', heatClass(m))} />
                                            ))}
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500" aria-hidden="true">
                                            Less
                                            {[0, 20, 40, 60].map((m) => (
                                                <span key={m} className={cn('h-3 w-3 rounded', heatClass(m))} />
                                            ))}
                                            More
                                        </div>
                                    </div>
                                    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                                        {[
                                            ['Current streak', '12 days'],
                                            ['Longest streak', '21 days'],
                                            ['This week', '4 h 10 min'],
                                            ['Lessons finished', '48'],
                                        ].map(([k, v]) => (
                                            <div key={k} className="rounded-2xl border border-gray-200 p-4">
                                                <dt className="text-xs text-gray-500">{k}</dt>
                                                <dd className="mt-1 text-xl font-semibold tracking-tight tabular-nums text-[#0f172a]">{v}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default SidebarClassicLearnerDashboard

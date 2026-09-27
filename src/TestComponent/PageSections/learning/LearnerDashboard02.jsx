// NightOwlStatsLearnerDashboard

// LearnerDashboard02 · Learning Management Systems › Interactive Dashboard

// Description:
// A dark, data-forward learner dashboard for the fictional Nightowl Academy, built for people
// who study after hours. Under "Your week, after dark." it shows an SVG bar chart of study
// minutes per day with a dashed 90-minute goal line and hover/focus tooltips, a "Resume
// lesson" card with a code-editor preview and progress bar, and a list of recent quiz
// scores. Use it as the stats home of a coding or self-paced course platform.

// Design:
// - Night #0d1117 background with #161b22 cards and #262d38 borders; purple #a78bfa for
//   bars under goal, green #34d399 for bars on goal and passing scores; light #e6edf3 text
// - Chart: SVG with preserveAspectRatio="none" inside a fixed-height box, HTML axis labels,
//   non-scaling dashed goal line, rounded bars that animate height when the week changes
// - Sans headings with tight tracking, mono for numbers, times and code; rounded-2xl cards,
//   a blurred purple moon glow top-right, a tiny SVG owl mark in the eyebrow
// - Bento grid: stacked on mobile, lg:grid-cols-3 with the chart spanning two columns;
//   stat tiles 1 → sm:3; quiz rows keep name and score on one line down to 360px

// What it does:
// - weekKey state ("this" / "last") swaps the dataset via two aria-pressed buttons; totals,
//   days-on-goal and the bars update
// - activeDay state is set on hover/focus of invisible full-height column buttons and shows
//   a tooltip (minutes and goal status); leaving or blurring clears it
// - "Resume lesson" links to #resume-lesson; "Retake" links go to #retake-<quiz>; bar
//   motion is skipped when useReducedMotion() is true

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NightOwlStatsLearnerDashboard from '@/TestComponent/PageSections/learning/LearnerDashboard02';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <NightOwlStatsLearnerDashboard />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowPath, HiOutlineClock, HiPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const GOAL = 90
const MAX = 180

const weeks = {
    this: {
        label: 'This week',
        range: '21 – 27 Sep',
        days: [
            { day: 'Mon', name: 'Monday', minutes: 95 },
            { day: 'Tue', name: 'Tuesday', minutes: 40 },
            { day: 'Wed', name: 'Wednesday', minutes: 120 },
            { day: 'Thu', name: 'Thursday', minutes: 75 },
            { day: 'Fri', name: 'Friday', minutes: 30 },
            { day: 'Sat', name: 'Saturday', minutes: 155 },
            { day: 'Sun', name: 'Sunday', minutes: 105 },
        ],
    },
    last: {
        label: 'Last week',
        range: '14 – 20 Sep',
        days: [
            { day: 'Mon', name: 'Monday', minutes: 60 },
            { day: 'Tue', name: 'Tuesday', minutes: 85 },
            { day: 'Wed', name: 'Wednesday', minutes: 45 },
            { day: 'Thu', name: 'Thursday', minutes: 110 },
            { day: 'Fri', name: 'Friday', minutes: 0 },
            { day: 'Sat', name: 'Saturday', minutes: 130 },
            { day: 'Sun', name: 'Sunday', minutes: 70 },
        ],
    },
}

const quizzes = [
    { id: 'big-o', name: 'Big-O notation', date: '24 Sep', score: 92 },
    { id: 'sorting', name: 'Sorting algorithms', date: '22 Sep', score: 97 },
    { id: 'recursion', name: 'Recursion', date: '19 Sep', score: 85 },
    { id: 'linked-lists', name: 'Linked lists', date: '16 Sep', score: 78 },
    { id: 'hash-tables', name: 'Hash tables', date: '12 Sep', score: 64 },
]

const code = [
    [{ c: 'text-[#a78bfa]', t: 'const ' }, { c: 'text-[#e6edf3]', t: 'memo = ' }, { c: 'text-[#8b949e]', t: 'new Map()' }],
    [{ c: 'text-[#a78bfa]', t: 'function ' }, { c: 'text-[#34d399]', t: 'fib' }, { c: 'text-[#e6edf3]', t: '(n) {' }],
    [{ c: 'text-[#a78bfa]', t: '  if ' }, { c: 'text-[#e6edf3]', t: '(n < 2) ' }, { c: 'text-[#a78bfa]', t: 'return ' }, { c: 'text-[#e6edf3]', t: 'n' }],
    [{ c: 'text-[#a78bfa]', t: '  if ' }, { c: 'text-[#e6edf3]', t: '(memo.' }, { c: 'text-[#34d399]', t: 'has' }, { c: 'text-[#e6edf3]', t: '(n)) …' }],
]

const fmt = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`)
const barH = (m) => (m / MAX) * 220
const goalY = 240 - barH(GOAL)

export function NightOwlStatsLearnerDashboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [weekKey, setWeekKey] = useState('this')
    const [activeDay, setActiveDay] = useState(null)

    const week = weeks[weekKey]
    const total = week.days.reduce((sum, d) => sum + d.minutes, 0)
    const onGoal = week.days.filter((d) => d.minutes >= GOAL).length
    const avgQuiz = Math.round(quizzes.reduce((s, q) => s + q.score, 0) / quizzes.length)
    const active = activeDay === null ? null : week.days[activeDay]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0d1117] px-4 py-16 text-base font-normal text-[#e6edf3] antialiased sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-[#a78bfa]/20 blur-3xl"
                aria-hidden="true"
            />
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[#a78bfa]">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                <path d="M4 6 L7 3 L10 6 M14 6 L17 3 L20 6" fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="8" cy="12" r="4" fill="none" stroke="#a78bfa" strokeWidth="1.6" />
                                <circle cx="16" cy="12" r="4" fill="none" stroke="#a78bfa" strokeWidth="1.6" />
                                <circle cx="8" cy="12" r="1.4" fill="#34d399" />
                                <circle cx="16" cy="12" r="1.4" fill="#34d399" />
                                <path d="M11 17 L12 19 L13 17" fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinejoin="round" />
                            </svg>
                            Nightowl Academy · Algorithms at Midnight
                        </p>
                        <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#f5f3ff] sm:text-5xl">
                            Your week, <span className="text-[#a78bfa]">after dark.</span>
                        </h2>
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#8b949e]">
                            You focus best between 21:00 and 23:30. Hit {GOAL} minutes and the bar turns green.
                        </p>
                    </div>
                    <div className="inline-flex self-start rounded-xl border border-[#262d38] bg-[#161b22] p-1 md:self-auto" role="group" aria-label="Choose week">
                        {Object.entries(weeks).map(([key, w]) => (
                            <button
                                key={key}
                                type="button"
                                aria-pressed={weekKey === key}
                                className={cn(
                                    'min-h-10 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]',
                                    weekKey === key ? 'bg-[#a78bfa] text-[#0d1117]' : 'text-[#8b949e] hover:text-[#e6edf3]',
                                )}
                                onClick={() => {
                                    setWeekKey(key)
                                    setActiveDay(null)
                                }}
                            >
                                {w.label}
                            </button>
                        ))}
                    </div>
                </div>

                <dl className="mt-10 grid gap-3 sm:grid-cols-3">
                    {[
                        ['Study time', fmt(total), week.range],
                        ['Days on goal', `${onGoal} / 7`, `${GOAL} min a day`],
                        ['Quiz average', `${avgQuiz}%`, 'last 5 quizzes'],
                    ].map(([k, v, hint]) => (
                        <div key={k} className="rounded-2xl border border-[#262d38] bg-[#161b22] px-5 py-4">
                            <dt className="text-xs text-[#8b949e]">{k}</dt>
                            <dd className="mt-1 flex items-baseline justify-between gap-3">
                                <span className="font-mono text-2xl font-semibold tabular-nums text-[#f5f3ff]">{v}</span>
                                <span className="text-xs text-[#8b949e]">{hint}</span>
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-[#262d38] bg-[#161b22] p-5 sm:p-6 lg:col-span-2 lg:row-span-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-base font-semibold text-[#f5f3ff]">Study time per day</h3>
                            <div className="flex items-center gap-4 text-xs text-[#8b949e]" aria-hidden="true">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-sm bg-[#34d399]" /> On goal
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-sm bg-[#a78bfa]" /> Under goal
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <div className="relative h-56 w-8 shrink-0 font-mono text-[11px] text-[#8b949e] sm:h-72" aria-hidden="true">
                                {[180, 120, 60, 0].map((m) => (
                                    <span key={m} className="absolute right-0 -translate-y-1/2" style={{ top: `${((240 - barH(m)) / 240) * 100}%` }}>
                                        {m / 60}h
                                    </span>
                                ))}
                            </div>
                            <div className="relative min-w-0 flex-1">
                                <div className="relative h-56 sm:h-72">
                                    <svg viewBox="0 0 700 240" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                                        {[60, 120, 180].map((m) => (
                                            <line key={m} x1="0" x2="700" y1={240 - barH(m)} y2={240 - barH(m)} stroke="#262d38" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                        ))}
                                        <line x1="0" x2="700" y1="240" y2="240" stroke="#30363d" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                        {week.days.map((d, i) => {
                                            const h = Math.max(barH(d.minutes), 3)
                                            const dim = activeDay !== null && activeDay !== i
                                            return (
                                                <motion.rect
                                                    key={d.day}
                                                    x={i * 100 + 24}
                                                    width="52"
                                                    rx="6"
                                                    initial={false}
                                                    animate={{ y: 240 - h, height: h, opacity: dim ? 0.35 : 1 }}
                                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 22 }}
                                                    fill={d.minutes >= GOAL ? '#34d399' : '#a78bfa'}
                                                />
                                            )
                                        })}
                                        <line x1="0" x2="700" y1={goalY} y2={goalY} stroke="#34d399" strokeWidth="1.5" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
                                    </svg>
                                    <span
                                        className="absolute right-0 -translate-y-full pb-1 font-mono text-[10px] uppercase tracking-wider text-[#34d399]"
                                        style={{ top: `${(goalY / 240) * 100}%` }}
                                        aria-hidden="true"
                                    >
                                        Goal {GOAL}m
                                    </span>

                                    <div className="absolute inset-0 grid grid-cols-7">
                                        {week.days.map((d, i) => (
                                            <button
                                                key={d.day}
                                                type="button"
                                                aria-label={`${d.name}: ${fmt(d.minutes)} studied, ${d.minutes >= GOAL ? 'goal met' : `${GOAL - d.minutes} minutes under goal`}`}
                                                className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
                                                onMouseEnter={() => setActiveDay(i)}
                                                onMouseLeave={() => setActiveDay(null)}
                                                onFocus={() => setActiveDay(i)}
                                                onBlur={() => setActiveDay(null)}
                                                onClick={() => setActiveDay(i)}
                                            />
                                        ))}
                                    </div>

                                    <AnimatePresence>
                                        {active && (
                                            <motion.div
                                                key={`${weekKey}-${activeDay}`}
                                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                                className={cn(
                                                    'pointer-events-none absolute z-10 w-36 rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]',
                                                    activeDay <= 1 ? 'left-0' : activeDay >= 5 ? 'right-0' : '-translate-x-1/2',
                                                )}
                                                style={{
                                                    left: activeDay > 1 && activeDay < 5 ? `${((activeDay + 0.5) / 7) * 100}%` : undefined,
                                                    top: `calc(${((240 - Math.max(barH(active.minutes), 3)) / 240) * 100}% - 64px)`,
                                                }}
                                                aria-hidden="true"
                                            >
                                                <p className="text-xs text-[#8b949e]">{active.name}</p>
                                                <p className="font-mono text-sm font-semibold text-[#f5f3ff]">{fmt(active.minutes)}</p>
                                                <p className={cn('text-[11px]', active.minutes >= GOAL ? 'text-[#34d399]' : 'text-[#a78bfa]')}>
                                                    {active.minutes >= GOAL ? 'Goal met' : `${GOAL - active.minutes}m to goal`}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="mt-3 grid grid-cols-7 text-center font-mono text-[11px] text-[#8b949e]" aria-hidden="true">
                                    {week.days.map((d, i) => (
                                        <span key={d.day} className={cn(activeDay === i && 'text-[#f5f3ff]')}>
                                            {d.day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="sr-only" aria-live="polite">
                            {week.label}: {fmt(total)} in total, {onGoal} of 7 days on goal.
                        </p>
                    </div>

                    <div className="flex flex-col rounded-2xl border border-[#262d38] bg-[#161b22] p-5 sm:p-6">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#a78bfa]">Resume lesson</p>
                        <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-[#f5f3ff]">
                            Dynamic programming: memoize everything
                        </h3>
                        <p className="mt-1 text-sm text-[#8b949e]">Module 4 · Lesson 6 · with Ines Kowalczyk</p>
                        <div className="mt-4 overflow-hidden rounded-xl border border-[#262d38] bg-[#0d1117] p-3 font-mono text-[12px] leading-6" aria-hidden="true">
                            <div className="mb-2 flex gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-[#30363d]" />
                                <span className="h-2 w-2 rounded-full bg-[#30363d]" />
                                <span className="h-2 w-2 rounded-full bg-[#30363d]" />
                            </div>
                            {code.map((line, i) => (
                                <div key={i} className="flex gap-3 whitespace-pre">
                                    <span className="w-3 text-right text-[#484f58]">{i + 1}</span>
                                    <span className="truncate">
                                        {line.map((tok, j) => (
                                            <span key={j} className={tok.c}>
                                                {tok.t}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between font-mono text-xs text-[#8b949e]">
                            <span className="inline-flex items-center gap-1.5">
                                <HiOutlineClock className="h-4 w-4" aria-hidden="true" /> 12:48 / 20:00
                            </span>
                            <span className="text-[#f5f3ff]">64%</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#262d38]" role="progressbar" aria-valuenow={64} aria-valuemin={0} aria-valuemax={100} aria-label="Lesson progress">
                            <div className="h-full w-[64%] rounded-full bg-linear-to-r from-[#a78bfa] to-[#34d399]" />
                        </div>
                        <a
                            href="#resume-lesson"
                            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#a78bfa] px-5 text-sm font-semibold text-[#0d1117] transition-colors hover:bg-[#c4b5fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34d399]"
                        >
                            <HiPlay className="h-4 w-4" aria-hidden="true" />
                            Resume lesson
                        </a>
                    </div>

                    <div className="rounded-2xl border border-[#262d38] bg-[#161b22] p-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-[#f5f3ff]">Quiz scores</h3>
                            <span className="font-mono text-xs text-[#8b949e]">pass ≥ 70%</span>
                        </div>
                        <ul className="mt-4 space-y-4">
                            {quizzes.map((q) => {
                                const pass = q.score >= 70
                                return (
                                    <li key={q.id}>
                                        <div className="flex items-baseline justify-between gap-3">
                                            <p className="min-w-0 truncate text-sm text-[#e6edf3]">{q.name}</p>
                                            <p className={cn('shrink-0 font-mono text-sm font-semibold tabular-nums', pass ? 'text-[#34d399]' : 'text-[#a78bfa]')}>
                                                {q.score}%
                                            </p>
                                        </div>
                                        <div className="mt-1.5 flex items-center gap-3">
                                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#262d38]">
                                                <div className={cn('h-full rounded-full', pass ? 'bg-[#34d399]' : 'bg-[#a78bfa]')} style={{ width: `${q.score}%` }} />
                                            </div>
                                            {pass ? (
                                                <span className="w-14 text-right font-mono text-[11px] text-[#8b949e]">{q.date}</span>
                                            ) : (
                                                <a
                                                    href={`#retake-${q.id}`}
                                                    className="inline-flex min-h-8 w-14 items-center justify-end gap-1 rounded font-mono text-[11px] text-[#a78bfa] hover:text-[#c4b5fd] focus-visible:outline-2 focus-visible:outline-[#a78bfa]"
                                                    aria-label={`Retake ${q.name} quiz`}
                                                >
                                                    <HiArrowPath className="h-3.5 w-3.5" aria-hidden="true" />
                                                    Retake
                                                </a>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NightOwlStatsLearnerDashboard

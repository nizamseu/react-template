// KanbanWeeksCourseSyllabus

// CourseSyllabus05 · Learning Management Systems › Course Overview & Syllabus

// Description:
// A kanban-board syllabus for "Agile Product Management" (Cohort 14) at the fictional
// Sprintwise PM Academy. A workload bar at the top shows hours per week and per format;
// below, four columns (Week 1 Discovery → Week 4 Launch) hold lesson cards tagged Video,
// Live or Assignment with durations, live session times and due dates. Type chips highlight
// one format across the board. Use it for bootcamps and cohort courses that run in sprints.

// Design:
// - Cool grey #f5f6f8 section, slate #334155 / #0f172a text, violet #6d28d9 for the
//   heading accent, workload segments (four violet shades) and focus rings
// - Tag chips: Video violet (#ede9fe / #6d28d9), Live rose (#ffe4e6 / #be123c), Assignment
//   amber (#fef3c7 / #b45309); cards are white rounded-xl with a slate-200 border and lift
//   1px on hover
// - Workload card: a stacked bar whose segment widths match each week's share of the total,
//   growing from the left when scrolled into view (static for reduced motion), with labels
//   and a per-format breakdown underneath
// - Columns are #eceef2 rounded-2xl lanes headed by week, theme and an hours badge
// - Mobile: columns scroll sideways with scroll-snap (85% → sm:46% wide); lg: 4-column grid

// What it does:
// - filter state (All / Video / Live / Assignment, aria-pressed chips): cards of other
//   formats fade to 30% opacity so the board layout stays put; a live line reports how many
//   cards match
// - Week, format and course totals are summed from the card data (e.g. 24h 25m in total)
// - "Enrol in Cohort 14" links to #sprintwise-enrol; "Add live sessions to calendar" to
//   #sprintwise-calendar

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import KanbanWeeksCourseSyllabus from '@/TestComponent/PageSections/learning/CourseSyllabus05';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <KanbanWeeksCourseSyllabus />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import { LuCalendarDays, LuClipboardCheck, LuClock, LuRadio, LuSquarePlay } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const types = {
    video: { label: 'Video', icon: LuSquarePlay, chip: 'bg-[#ede9fe] text-[#6d28d9]', dot: 'bg-[#6d28d9]' },
    live: { label: 'Live', icon: LuRadio, chip: 'bg-[#ffe4e6] text-[#be123c]', dot: 'bg-[#be123c]' },
    assignment: { label: 'Assignment', icon: LuClipboardCheck, chip: 'bg-[#fef3c7] text-[#b45309]', dot: 'bg-[#b45309]' },
}

const weeks = [
    {
        id: 'w1',
        theme: 'Discovery',
        shade: 'bg-[#6d28d9]',
        cards: [
            { id: 'kickoff', type: 'live', title: 'Kick-off & team formation', min: 90, meta: 'Tue 6 Oct · 18:00 CET' },
            { id: 'four-risks', type: 'video', title: 'Why products fail: the four risks', min: 35, meta: 'Watch anytime' },
            { id: 'interviews', type: 'video', title: 'Customer interviews that are not leading', min: 40, meta: 'Watch anytime' },
            { id: 'ost', type: 'video', title: 'Opportunity solution trees', min: 30, meta: 'Watch anytime' },
            { id: 'problem-interviews', type: 'assignment', title: 'Run three problem interviews', min: 120, meta: 'Due Sun 11 Oct' },
        ],
    },
    {
        id: 'w2',
        theme: 'Definition',
        shade: 'bg-[#7c3aed]',
        cards: [
            { id: 'prd', type: 'video', title: 'Writing a one-page PRD', min: 30, meta: 'Watch anytime' },
            { id: 'rice', type: 'video', title: 'Prioritisation: RICE vs. Kano', min: 45, meta: 'Watch anytime' },
            { id: 'teardown', type: 'live', title: 'PRD teardown with a Head of Product', min: 90, meta: 'Tue 13 Oct · 18:00 CET' },
            { id: 'metrics', type: 'video', title: 'Metrics that matter', min: 35, meta: 'Watch anytime' },
            { id: 'draft-prd', type: 'assignment', title: 'Draft your PRD', min: 180, meta: 'Due Sun 18 Oct' },
        ],
    },
    {
        id: 'w3',
        theme: 'Delivery',
        shade: 'bg-[#8b5cf6]',
        cards: [
            { id: 'scrum', type: 'video', title: 'Scrum, Kanban and what actually works', min: 40, meta: 'Watch anytime' },
            { id: 'planning-sim', type: 'live', title: 'Sprint planning simulation', min: 120, meta: 'Tue 20 Oct · 18:00 CET' },
            { id: 'eng', type: 'video', title: 'Working well with engineering', min: 35, meta: 'Watch anytime' },
            { id: 'office-hours', type: 'live', title: 'Mentor office hours', min: 60, meta: 'Thu 22 Oct · 12:30 CET' },
            { id: 'updates', type: 'video', title: 'Stakeholder updates that get read', min: 25, meta: 'Watch anytime' },
            { id: 'roadmap', type: 'assignment', title: 'Build a two-sprint roadmap', min: 180, meta: 'Due Sun 25 Oct' },
        ],
    },
    {
        id: 'w4',
        theme: 'Launch',
        shade: 'bg-[#a78bfa]',
        cards: [
            { id: 'gtm', type: 'video', title: 'Go-to-market basics', min: 30, meta: 'Watch anytime' },
            { id: 'experiments', type: 'video', title: 'Experiment design & A/B tests', min: 40, meta: 'Watch anytime' },
            { id: 'retro', type: 'live', title: 'Launch review & retrospective', min: 90, meta: 'Tue 27 Oct · 18:00 CET' },
            { id: 'capstone', type: 'assignment', title: 'Capstone: launch plan presentation', min: 150, meta: 'Due Fri 30 Oct' },
        ],
    },
]

const sumMinutes = (cards) => cards.reduce((sum, c) => sum + c.min, 0)

const formatMinutes = (minutes) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (!h) return `${m}m`
    return m ? `${h}h ${m}m` : `${h}h`
}

const allCards = weeks.flatMap((w) => w.cards)
const totalMinutes = sumMinutes(allCards)
const heaviest = weeks.reduce((a, b) => (sumMinutes(b.cards) > sumMinutes(a.cards) ? b : a))

const filters = [
    { id: 'all', label: 'All' },
    ...Object.entries(types).map(([id, t]) => ({ id, label: t.label })),
]

export function KanbanWeeksCourseSyllabus({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [filter, setFilter] = useState('all')
    const matching = filter === 'all' ? allCards.length : allCards.filter((c) => c.type === filter).length

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f5f6f8] px-4 py-16 text-base font-normal text-[#334155] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold text-[#6d28d9]">Sprintwise PM Academy · Cohort 14</p>
                        <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-[#0f172a] sm:text-5xl">
                            Agile Product Management, <span className="text-[#6d28d9]">sprint by sprint.</span>
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-[#334155]">
                            Four weekly sprints, five live sessions and four graded assignments. Starts
                            Tuesday 6 October 2026, fully online.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                            href="#sprintwise-enrol"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6d28d9] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(109,40,217,0.8)] transition-colors hover:bg-[#5b21b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d28d9]"
                        >
                            Enrol in Cohort 14
                            <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <a
                            href="#sprintwise-calendar"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 text-sm font-semibold text-[#0f172a] transition-colors hover:border-[#6d28d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d28d9]"
                        >
                            <LuCalendarDays className="h-4 w-4 text-[#6d28d9]" aria-hidden="true" />
                            Add live sessions to calendar
                        </a>
                    </div>
                </div>

                <div className="mt-10 rounded-2xl border border-[#e2e8f0] bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base font-semibold text-[#0f172a]">Workload</h3>
                        <p className="text-sm text-[#64748b]">
                            <span className="font-semibold text-[#0f172a]">{formatMinutes(totalMinutes)}</span> over{' '}
                            {weeks.length} weeks · busiest: Week {weeks.indexOf(heaviest) + 1}
                        </p>
                    </div>
                    <div
                        className="mt-4 flex h-4 gap-1 overflow-hidden rounded-full bg-[#f1f5f9]"
                        role="img"
                        aria-label={weeks.map((w, i) => `Week ${i + 1}: ${formatMinutes(sumMinutes(w.cards))}`).join(', ')}
                    >
                        {weeks.map((week, index) => (
                            <motion.span
                                key={week.id}
                                className={cn('h-full origin-left first:rounded-l-full last:rounded-r-full', week.shade)}
                                style={{ width: `${(sumMinutes(week.cards) / totalMinutes) * 100}%` }}
                                initial={reduceMotion ? false : { scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                            />
                        ))}
                    </div>
                    <ul className="mt-3 flex gap-1 text-xs" aria-hidden="true">
                        {weeks.map((week, index) => (
                            <li
                                key={week.id}
                                className="min-w-0"
                                style={{ width: `${(sumMinutes(week.cards) / totalMinutes) * 100}%` }}
                            >
                                <span className="block truncate font-semibold text-[#0f172a]">W{index + 1}</span>
                                <span className="block truncate text-[#64748b]">{formatMinutes(sumMinutes(week.cards))}</span>
                            </li>
                        ))}
                    </ul>
                    <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#f1f5f9] pt-4 text-sm">
                        {Object.entries(types).map(([id, t]) => (
                            <li key={id} className="inline-flex items-center gap-2 text-[#334155]">
                                <span className={cn('h-2.5 w-2.5 rounded-full', t.dot)} aria-hidden="true" />
                                {t.label}
                                <span className="font-semibold text-[#0f172a]">
                                    {formatMinutes(sumMinutes(allCards.filter((c) => c.type === id)))}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Highlight a format">
                        {filters.map((f) => {
                            const on = f.id === filter
                            return (
                                <button
                                    key={f.id}
                                    type="button"
                                    aria-pressed={on}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d28d9]',
                                        on
                                            ? 'border-[#0f172a] bg-[#0f172a] text-white'
                                            : 'border-[#cbd5e1] bg-white text-[#334155] hover:border-[#6d28d9]',
                                    )}
                                    onClick={() => setFilter(f.id)}
                                >
                                    {f.id !== 'all' && <span className={cn('h-2 w-2 rounded-full', types[f.id].dot)} aria-hidden="true" />}
                                    {f.label}
                                </button>
                            )
                        })}
                    </div>
                    <p className="text-sm text-[#64748b]" aria-live="polite">
                        {filter === 'all' ? `${allCards.length} cards across 4 weeks` : `${matching} ${types[filter].label.toLowerCase()} cards highlighted`}
                    </p>
                </div>

                <div className="-mx-4 mt-5 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-pl-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
                    {weeks.map((week, index) => (
                        <div
                            key={week.id}
                            className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl bg-[#eceef2] p-3 sm:w-[46%] lg:w-auto"
                        >
                            <div className="flex items-center justify-between gap-2 px-2 pb-3 pt-1">
                                <div className="min-w-0">
                                    <h3 className="text-base font-bold text-[#0f172a]">Week {index + 1}</h3>
                                    <p className="truncate text-xs text-[#64748b]">{week.theme}</p>
                                </div>
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#0f172a]">
                                    <LuClock className="h-3.5 w-3.5 text-[#6d28d9]" aria-hidden="true" />
                                    {formatMinutes(sumMinutes(week.cards))}
                                </span>
                            </div>
                            <ul className="flex flex-1 flex-col gap-2.5">
                                {week.cards.map((card) => {
                                    const t = types[card.type]
                                    const Icon = t.icon
                                    const dim = filter !== 'all' && filter !== card.type
                                    return (
                                        <li
                                            key={card.id}
                                            className={cn(
                                                'rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-[opacity,translate,box-shadow] duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_-10px_rgba(15,23,42,0.35)]',
                                                dim && 'opacity-30',
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold', t.chip)}>
                                                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                                    {t.label}
                                                </span>
                                                <span className="text-xs tabular-nums text-[#64748b]">{formatMinutes(card.min)}</span>
                                            </div>
                                            <p className="mt-2.5 text-sm font-semibold leading-snug text-[#0f172a]">{card.title}</p>
                                            <p
                                                className={cn(
                                                    'mt-1.5 text-xs',
                                                    card.type === 'assignment' ? 'font-semibold text-[#b45309]' : 'text-[#64748b]',
                                                )}
                                            >
                                                {card.meta}
                                            </p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default KanbanWeeksCourseSyllabus

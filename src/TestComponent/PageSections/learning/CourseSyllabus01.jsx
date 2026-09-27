// ModuleAccordionCourseSyllabus

// CourseSyllabus01 · Learning Management Systems › Course Overview & Syllabus

// Description:
// A course overview and syllabus for "Applied Data Engineering with Python" from the
// fictional Northwind Data Academy. A sticky overview card lists total length, lectures,
// projects, level and certificate with an "Enrol for $499" button; beside it, six modules
// open as an accordion of lecture rows (video / reading / quiz icons, durations and
// "Preview" badges) with "Expand all" / "Collapse all" and a total-length summary. Use it on
// a course detail page directly under the hero.

// Design:
// - Slate #0f172a section, white type, sky #38bdf8 accents (icons, Preview badges, CTA,
//   focus rings); panels are white/[0.04] with white/10 hairlines and rounded-2xl corners
// - Left card: sans title text-3xl, a 2×2 stat grid with large tabular numbers, a
//   certificate row and full-width CTA; lg:sticky lg:top-8 so it follows the syllabus
// - Module headers show a mono "Module 02" label, title, lecture count and duration with a
//   rotating chevron; lecture rows are hairline-separated with right-aligned mono times
// - Panels open and close with a height + opacity animation (AnimatePresence); instant for
//   reduced motion
// - Mobile: single column, overview card first; lg: 5/7 split (xl: 4/8) with the card
//   sticky

// What it does:
// - open state (array of module ids, module 1 open at start); each header button toggles
//   its module and carries aria-expanded / aria-controls
// - "Expand all" / "Collapse all" open or close every module and are disabled when there is
//   nothing left to do
// - Totals (lectures, projects, length per module and overall) are calculated from the data
// - Preview badges link to #preview-<lecture-id>; "Enrol for $499" to #enrol-northwind-de

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ModuleAccordionCourseSyllabus from '@/TestComponent/PageSections/learning/CourseSyllabus01';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <ModuleAccordionCourseSyllabus />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiChevronDown,
    HiOutlineAcademicCap,
    HiOutlineDocumentText,
    HiOutlinePlayCircle,
    HiOutlineQuestionMarkCircle,
} from 'react-icons/hi2';
import { LuAward, LuChartBar, LuClock, LuFolderKanban, LuLayers } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const typeMeta = {
    video: { icon: HiOutlinePlayCircle, label: 'Video', className: 'text-[#38bdf8]' },
    reading: { icon: HiOutlineDocumentText, label: 'Reading', className: 'text-white/70' },
    quiz: { icon: HiOutlineQuestionMarkCircle, label: 'Quiz', className: 'text-[#7dd3fc]' },
}

const modules = [
    {
        id: 'orientation',
        title: 'Getting Oriented',
        lectures: [
            { id: 'welcome', title: 'Welcome to the programme', type: 'video', time: '4:12', preview: true },
            { id: 'data-teams', title: 'How data teams actually work', type: 'video', time: '11:40', preview: true },
            { id: 'setup', title: 'Setting up Python, uv and VS Code', type: 'reading', time: '8:00' },
            { id: 'orientation-quiz', title: 'Orientation check', type: 'quiz', time: '5:00' },
        ],
    },
    {
        id: 'python',
        title: 'Python for Pipelines',
        lectures: [
            { id: 'typing', title: 'Functions, typing and dataclasses', type: 'video', time: '18:25' },
            { id: 'file-formats', title: 'Reading CSV, JSON and Parquet', type: 'video', time: '22:10', preview: true },
            { id: 'errors', title: 'Error handling that does not hide bugs', type: 'reading', time: '12:00' },
            { id: 'bike-project', title: 'Project: Clean the city-bike dataset', type: 'reading', time: '45:00' },
            { id: 'python-quiz', title: 'Python checkpoint', type: 'quiz', time: '10:00' },
        ],
    },
    {
        id: 'sql',
        title: 'SQL & Warehousing',
        lectures: [
            { id: 'modelling', title: 'Modelling facts and dimensions', type: 'video', time: '24:30' },
            { id: 'windows', title: 'Window functions in practice', type: 'video', time: '19:50' },
            { id: 'engines', title: 'Postgres vs. DuckDB vs. BigQuery', type: 'reading', time: '15:00' },
            { id: 'star-project', title: 'Project: Build a star schema', type: 'reading', time: '60:00' },
            { id: 'sql-quiz', title: 'SQL checkpoint', type: 'quiz', time: '12:00' },
        ],
    },
    {
        id: 'airflow',
        title: 'Orchestration with Airflow',
        lectures: [
            { id: 'dags', title: 'DAGs, tasks and schedules', type: 'video', time: '21:15', preview: true },
            { id: 'backfills', title: 'Backfills without tears', type: 'video', time: '16:40' },
            { id: 'ingestion-project', title: 'Project: A nightly ingestion DAG', type: 'reading', time: '75:00' },
            { id: 'airflow-quiz', title: 'Orchestration quiz', type: 'quiz', time: '8:00' },
        ],
    },
    {
        id: 'quality',
        title: 'Data Quality & Testing',
        lectures: [
            { id: 'contracts', title: 'Contracts, expectations and dbt tests', type: 'video', time: '20:05' },
            { id: 'freshness', title: 'Monitoring freshness and volume', type: 'video', time: '14:30' },
            { id: 'tests-project', title: 'Project: Add tests to your warehouse', type: 'reading', time: '50:00' },
            { id: 'quality-quiz', title: 'Quality checkpoint', type: 'quiz', time: '10:00' },
        ],
    },
    {
        id: 'capstone',
        title: 'Streaming & Capstone',
        lectures: [
            { id: 'kafka', title: 'Kafka in one afternoon', type: 'video', time: '26:45' },
            { id: 'cdc', title: 'Change data capture', type: 'video', time: '17:20' },
            { id: 'brief', title: 'Capstone brief', type: 'reading', time: '10:00' },
            { id: 'capstone-project', title: 'Project: End-to-end capstone pipeline', type: 'reading', time: '120:00' },
            { id: 'final', title: 'Final assessment', type: 'quiz', time: '20:00' },
        ],
    },
]

const toSeconds = (time) => {
    const [m, s] = time.split(':').map(Number)
    return m * 60 + s
}

const formatTotal = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.round((seconds % 3600) / 60)
    return h ? `${h}h ${m}m` : `${m}m`
}

const formatLecture = (time) => {
    const seconds = toSeconds(time)
    return seconds >= 3600 ? formatTotal(seconds) : time
}

const moduleSeconds = (module) => module.lectures.reduce((sum, l) => sum + toSeconds(l.time), 0)

const allLectures = modules.flatMap((m) => m.lectures)
const totalSeconds = modules.reduce((sum, m) => sum + moduleSeconds(m), 0)
const projectCount = allLectures.filter((l) => l.title.startsWith('Project:')).length
const typeCounts = Object.keys(typeMeta).map((type) => [type, allLectures.filter((l) => l.type === type).length])

export function ModuleAccordionCourseSyllabus({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [open, setOpen] = useState([modules[0].id])

    const toggle = (id) => {
        setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }

    const stats = [
        { label: 'Total length', value: formatTotal(totalSeconds), icon: LuClock },
        { label: 'Lectures', value: allLectures.length, icon: LuLayers },
        { label: 'Projects', value: projectCount, icon: LuFolderKanban },
        { label: 'Level', value: 'Intermediate', icon: LuChartBar },
    ]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#0f172a] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12 lg:gap-12">
                <aside className="lg:col-span-5 lg:self-start xl:col-span-4 lg:sticky lg:top-8">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
                            <HiOutlineAcademicCap className="h-4 w-4" aria-hidden="true" />
                            Northwind Data Academy
                        </p>
                        <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                            Applied Data Engineering with Python
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-white/65">
                            Build, schedule and test the pipelines behind a real analytics team. Six
                            modules, about four hours a week, finished in six weeks.
                        </p>

                        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                            {stats.map(({ label, value, icon: Icon }) => (
                                <div key={label} className="bg-[#0f172a] p-3 sm:p-4">
                                    <dt className="flex items-center gap-1.5 text-xs text-white/55">
                                        <Icon className="h-3.5 w-3.5 text-[#38bdf8]" aria-hidden="true" />
                                        {label}
                                    </dt>
                                    <dd className="mt-1.5 text-lg font-semibold tabular-nums text-white sm:text-2xl">{value}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 p-4">
                            <LuAward className="mt-0.5 h-5 w-5 shrink-0 text-[#38bdf8]" aria-hidden="true" />
                            <p className="text-sm leading-relaxed text-white/80">
                                <span className="font-semibold text-white">Verified certificate</span> after
                                the capstone review, shareable on LinkedIn with a public credential link.
                            </p>
                        </div>

                        <a
                            href="#enrol-northwind-de"
                            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#38bdf8] px-6 text-base font-semibold text-[#0f172a] transition-colors hover:bg-[#7dd3fc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#38bdf8]"
                        >
                            Enrol for $499
                        </a>
                        <p className="mt-3 text-center text-xs text-white/50">
                            Next start 5 Oct 2026 · 30-day refund · Updated Sep 2026
                        </p>
                    </div>
                </aside>

                <div className="lg:col-span-7 xl:col-span-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Course content</h3>
                            <p className="mt-2 text-sm text-white/60">
                                {modules.length} modules · {allLectures.length} lectures ·{' '}
                                <span className="font-semibold text-white">{formatTotal(totalSeconds)}</span> total length
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={open.length === modules.length}
                                className="min-h-10 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:border-[#38bdf8] hover:text-[#38bdf8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/15 disabled:hover:text-white"
                                onClick={() => setOpen(modules.map((m) => m.id))}
                            >
                                Expand all
                            </button>
                            <button
                                type="button"
                                disabled={open.length === 0}
                                className="min-h-10 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:border-[#38bdf8] hover:text-[#38bdf8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/15 disabled:hover:text-white"
                                onClick={() => setOpen([])}
                            >
                                Collapse all
                            </button>
                        </div>
                    </div>

                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60" aria-label="Lecture types">
                        {typeCounts.map(([type, count]) => {
                            const { icon: Icon, label, className: tone } = typeMeta[type]
                            return (
                                <li key={type} className="inline-flex items-center gap-1.5">
                                    <Icon className={cn('h-4 w-4', tone)} aria-hidden="true" />
                                    {count} {label.toLowerCase()}
                                    {count === 1 ? '' : type === 'quiz' ? 'zes' : 's'}
                                </li>
                            )
                        })}
                    </ul>

                    <ol className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                        {modules.map((module, index) => {
                            const isOpen = open.includes(module.id)
                            const panelId = `nw-module-${module.id}`
                            return (
                                <li key={module.id} className="border-b border-white/10 last:border-b-0">
                                    <h4 className="text-base font-normal text-white">
                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            className={cn(
                                                'flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#38bdf8] sm:px-6 sm:py-5',
                                                isOpen && 'bg-white/[0.04]',
                                            )}
                                            onClick={() => toggle(module.id)}
                                        >
                                            <span className="min-w-0 flex-1">
                                                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-[#38bdf8]">
                                                    Module {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <span className="mt-1 block text-lg font-semibold text-white sm:text-xl">
                                                    {module.title}
                                                </span>
                                            </span>
                                            <span className="hidden shrink-0 text-right text-sm text-white/55 sm:block">
                                                {module.lectures.length} lectures · {formatTotal(moduleSeconds(module))}
                                            </span>
                                            <HiChevronDown
                                                className={cn(
                                                    'h-5 w-5 shrink-0 text-white/70 transition-transform duration-300',
                                                    isOpen && 'rotate-180 text-[#38bdf8]',
                                                )}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </h4>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="panel"
                                                id={panelId}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-4 pt-1 text-xs text-white/50 sm:hidden">
                                                    {module.lectures.length} lectures · {formatTotal(moduleSeconds(module))}
                                                </p>
                                                <ul className="px-4 pb-4 sm:px-6 sm:pb-5">
                                                    {module.lectures.map((lecture) => {
                                                        const { icon: Icon, label, className: tone } = typeMeta[lecture.type]
                                                        return (
                                                            <li
                                                                key={lecture.id}
                                                                className="flex items-center gap-3 border-t border-white/[0.06] py-3 first:border-t-0"
                                                            >
                                                                <Icon className={cn('h-5 w-5 shrink-0', tone)} aria-hidden="true" />
                                                                <span className="sr-only">{label}:</span>
                                                                <span className="min-w-0 flex-1 text-sm text-white/85">{lecture.title}</span>
                                                                {lecture.preview && (
                                                                    <a
                                                                        href={`#preview-${lecture.id}`}
                                                                        className="inline-flex min-h-8 shrink-0 items-center rounded-full border border-[#38bdf8]/50 px-2.5 text-[11px] font-semibold text-[#38bdf8] transition-colors hover:bg-[#38bdf8] hover:text-[#0f172a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]"
                                                                    >
                                                                        Preview
                                                                        <span className="sr-only">: {lecture.title}</span>
                                                                    </a>
                                                                )}
                                                                <span className="w-14 shrink-0 text-right font-mono text-xs tabular-nums text-white/55">
                                                                    {formatLecture(lecture.time)}
                                                                </span>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>
        </section>
    )
}

export default ModuleAccordionCourseSyllabus

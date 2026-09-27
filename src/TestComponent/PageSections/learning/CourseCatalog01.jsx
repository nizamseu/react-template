// CohortTrackCourseCatalog

// CourseCatalog01 · Learning Management Systems › Course Catalog

// Description:
// A filterable cohort catalogue for the fictional Fieldstone Academy. Under the heading
// "Pick a track. Finish it with thirty others." learners narrow nine live courses with
// level pills (All / Beginner / Intermediate / Advanced) and a topic select; each card shows
// lessons, hours, rating, the next cohort start date, seats left and price. Use it on a
// course index or "Autumn cohorts" landing page where people browse by skill level.

// Design:
// - Chalk #f4f1e8 section, deep teal #0e3b43 ink and panels, saffron #f2a541 accents; a
//   teal filter bar with a pill segmented control and a styled native select
// - Cards: #fbf9f3 paper, rounded-[20px], 1px teal/10 border, a 6px level strip on top
//   (Beginner saffron, Intermediate #3f8f8a, Advanced teal) and a matching level badge
// - Type: sans heading text-4xl → md:text-6xl with a saffron underline swoosh (SVG); mono
//   tabular numbers for dates and prices; cards lift 4px with a teal shadow on hover
// - Grid grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-3; cards animate in/out with
//   AnimatePresence + layout (fade only for reduced motion)
// - Filter bar stacks on mobile (pills scroll sideways if needed) and sits in one row on md+

// What it does:
// - level and topic state filter the card list; the result count ("Showing 4 of 9
//   courses") is announced in an aria-live region
// - Level pills are buttons with aria-pressed; the topic select is a labelled controlled
//   <select>
// - When no course matches (e.g. Advanced + Writing), a friendly empty state explains why
//   and "Reset filters" sets both back to All; the active pill glides via layoutId
// - Links: "Join cohort" → #cohort-<id>, "See the full timetable" → #cohort-timetable,
//   "Join the waitlist" → #cohort-waitlist

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CohortTrackCourseCatalog from '@/TestComponent/PageSections/learning/CourseCatalog01';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <CohortTrackCourseCatalog />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiChevronDown, HiStar } from 'react-icons/hi2';
import { LuBookOpen, LuClock, LuSearchX, LuUsers } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

const topics = ['All topics', 'Data', 'Design', 'Writing', 'Business']

const levelStyles = {
    Beginner: { strip: 'bg-[#f2a541]', badge: 'bg-[#f2a541]/20 text-[#7a4a0c]' },
    Intermediate: { strip: 'bg-[#3f8f8a]', badge: 'bg-[#3f8f8a]/15 text-[#1f5c58]' },
    Advanced: { strip: 'bg-[#0e3b43]', badge: 'bg-[#0e3b43] text-[#f4f1e8]' },
}

const courses = [
    {
        id: 'data-foundations',
        title: 'Foundations of Data Analysis',
        topic: 'Data',
        level: 'Beginner',
        blurb: 'Spreadsheets to SQL basics, with a real city-budget dataset.',
        lessons: 24,
        hours: 18,
        rating: 4.8,
        reviews: 1204,
        cohort: 'Mon 12 Oct 2026',
        seats: 7,
        price: 390,
    },
    {
        id: 'sql-product',
        title: 'SQL for Product Teams',
        topic: 'Data',
        level: 'Intermediate',
        blurb: 'Funnels, retention curves and window functions you will actually use.',
        lessons: 18,
        hours: 14,
        rating: 4.7,
        reviews: 642,
        cohort: 'Wed 21 Oct 2026',
        seats: 12,
        price: 450,
    },
    {
        id: 'ml-practice',
        title: 'Machine Learning in Practice',
        topic: 'Data',
        level: 'Advanced',
        blurb: 'Ship one model end to end, from feature store to monitoring.',
        lessons: 32,
        hours: 40,
        rating: 4.9,
        reviews: 388,
        cohort: 'Wed 4 Nov 2026',
        seats: 4,
        price: 890,
    },
    {
        id: 'ux-research',
        title: 'UX Research Essentials',
        topic: 'Design',
        level: 'Beginner',
        blurb: 'Plan, run and synthesise five interviews in your first fortnight.',
        lessons: 20,
        hours: 16,
        rating: 4.8,
        reviews: 917,
        cohort: 'Mon 19 Oct 2026',
        seats: 11,
        price: 360,
    },
    {
        id: 'design-systems',
        title: 'Design Systems at Scale',
        topic: 'Design',
        level: 'Advanced',
        blurb: 'Tokens, governance and a component audit of a live product.',
        lessons: 26,
        hours: 30,
        rating: 4.9,
        reviews: 276,
        cohort: 'Wed 11 Nov 2026',
        seats: 9,
        price: 780,
    },
    {
        id: 'web-writing',
        title: 'Writing for the Web',
        topic: 'Writing',
        level: 'Beginner',
        blurb: 'Plain-language pages, headlines that earn the click, zero fluff.',
        lessons: 14,
        hours: 10,
        rating: 4.6,
        reviews: 530,
        cohort: 'Mon 12 Oct 2026',
        seats: 18,
        price: 240,
    },
    {
        id: 'product-storytelling',
        title: 'Product Storytelling',
        topic: 'Writing',
        level: 'Intermediate',
        blurb: 'Launch notes, narratives and memos that get a clear yes.',
        lessons: 16,
        hours: 12,
        rating: 4.7,
        reviews: 301,
        cohort: 'Wed 28 Oct 2026',
        seats: 14,
        price: 320,
    },
    {
        id: 'finance-founders',
        title: 'Finance for Founders',
        topic: 'Business',
        level: 'Intermediate',
        blurb: 'Build a three-statement model and a runway plan you trust.',
        lessons: 22,
        hours: 20,
        rating: 4.5,
        reviews: 219,
        cohort: 'Mon 2 Nov 2026',
        seats: 6,
        price: 520,
    },
    {
        id: 'negotiation-lab',
        title: 'Negotiation Lab',
        topic: 'Business',
        level: 'Beginner',
        blurb: 'Weekly role-plays with feedback, from salary talks to vendor deals.',
        lessons: 12,
        hours: 9,
        rating: 4.8,
        reviews: 455,
        cohort: 'Mon 26 Oct 2026',
        seats: 3,
        price: 280,
    },
]

export function CohortTrackCourseCatalog({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [level, setLevel] = useState('All')
    const [topic, setTopic] = useState('All topics')

    const visible = courses.filter(
        (course) =>
            (level === 'All' || course.level === level) &&
            (topic === 'All topics' || course.topic === topic),
    )

    const resetFilters = () => {
        setLevel('All')
        setTopic('All topics')
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f4f1e8] px-4 py-16 text-base font-normal text-[#0e3b43] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-8">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[#0e3b43]/15 bg-[#fbf9f3] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0e3b43]">
                            <span className="h-2 w-2 rounded-full bg-[#f2a541]" aria-hidden="true" />
                            Fieldstone Academy · Autumn cohorts 2026
                        </p>
                        <h2 className="mt-6 text-4xl font-bold leading-[1.02] tracking-tight text-[#0e3b43] sm:text-5xl md:text-6xl">
                            Pick a track.{' '}
                            <span className="relative inline-block">
                                Finish it
                                <svg
                                    viewBox="0 0 200 12"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-1 left-0 h-3 w-full text-[#f2a541]"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2 9 C 50 2, 120 2, 198 7"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>{' '}
                            with thirty others.
                        </h2>
                    </div>
                    <div className="md:col-span-4">
                        <p className="text-base leading-relaxed text-[#0e3b43]/75">
                            Live 6–10 week cohorts, weekly mentor office hours and a capstone
                            reviewed by people who hire for the job.
                        </p>
                        <a
                            href="#cohort-timetable"
                            className="group mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#0e3b43] underline decoration-[#f2a541] decoration-2 underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e3b43]"
                        >
                            See the full timetable
                            <HiArrowRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 rounded-[24px] bg-[#0e3b43] p-3 sm:p-4 md:mt-14 md:flex-row md:items-center md:justify-between">
                    <div
                        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:pb-0"
                        aria-label="Filter by level"
                        role="group"
                    >
                        {levels.map((item) => {
                            const active = item === level
                            return (
                                <button
                                    key={item}
                                    type="button"
                                    aria-pressed={active}
                                    className={cn(
                                        'relative min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2a541] sm:px-5',
                                        active ? 'text-[#0e3b43]' : 'text-[#f4f1e8]/75 hover:text-[#f4f1e8]',
                                    )}
                                    onClick={() => setLevel(item)}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="cohort-level-pill"
                                            className="absolute inset-0 rounded-full bg-[#f2a541]"
                                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="relative">{item}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label htmlFor="cohort-topic" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f1e8]/70">
                            Topic
                        </label>
                        <div className="relative">
                            <select
                                id="cohort-topic"
                                value={topic}
                                className="min-h-11 w-full appearance-none rounded-full border border-[#f4f1e8]/20 bg-[#0b2f36] pl-4 pr-11 text-sm font-semibold text-[#f4f1e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2a541] sm:w-52"
                                onChange={(event) => setTopic(event.target.value)}
                            >
                                {topics.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                            <HiChevronDown
                                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f2a541]"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-sm text-[#0e3b43]/70" aria-live="polite">
                    Showing <span className="font-semibold text-[#0e3b43]">{visible.length}</span> of{' '}
                    {courses.length} courses
                </p>

                <motion.div layout={!reduceMotion} className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {visible.map((course) => {
                            const style = levelStyles[course.level]
                            return (
                                <motion.article
                                    key={course.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className="group flex flex-col overflow-hidden rounded-[20px] border border-[#0e3b43]/10 bg-[#fbf9f3] transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(14,59,67,0.55)] motion-reduce:hover:translate-y-0"
                                >
                                    <div className={cn('h-1.5 w-full', style.strip)} aria-hidden="true" />
                                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0e3b43]/60">
                                                {course.topic}
                                            </span>
                                            <span
                                                className={cn(
                                                    'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                                                    style.badge,
                                                )}
                                            >
                                                {course.level}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-xl font-bold leading-snug text-[#0e3b43] sm:text-2xl">
                                            {course.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-[#0e3b43]/70">{course.blurb}</p>

                                        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#0e3b43]/80">
                                            <li className="inline-flex items-center gap-1.5">
                                                <LuBookOpen className="h-4 w-4 text-[#3f8f8a]" aria-hidden="true" />
                                                {course.lessons} lessons
                                            </li>
                                            <li className="inline-flex items-center gap-1.5">
                                                <LuClock className="h-4 w-4 text-[#3f8f8a]" aria-hidden="true" />
                                                {course.hours} h
                                            </li>
                                            <li className="inline-flex items-center gap-1.5">
                                                <HiStar className="h-4 w-4 text-[#f2a541]" aria-hidden="true" />
                                                <span className="font-semibold text-[#0e3b43]">{course.rating}</span>
                                                <span className="text-[#0e3b43]/55">
                                                    ({course.reviews.toLocaleString('en-US')})
                                                </span>
                                            </li>
                                        </ul>

                                        <div className="mt-auto pt-6">
                                            <div className="flex items-end justify-between gap-4 border-t border-dashed border-[#0e3b43]/20 pt-4">
                                                <div>
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0e3b43]/55">
                                                        Next cohort
                                                    </p>
                                                    <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-[#0e3b43]">
                                                        {course.cohort}
                                                    </p>
                                                    <p
                                                        className={cn(
                                                            'mt-1 inline-flex items-center gap-1 text-xs',
                                                            course.seats <= 5
                                                                ? 'font-semibold text-[#b5620a]'
                                                                : 'text-[#0e3b43]/60',
                                                        )}
                                                    >
                                                        <LuUsers className="h-3.5 w-3.5" aria-hidden="true" />
                                                        {course.seats} of 30 seats left
                                                    </p>
                                                </div>
                                                <p className="font-mono text-2xl font-semibold tabular-nums text-[#0e3b43]">
                                                    ${course.price}
                                                </p>
                                            </div>
                                            <a
                                                href={`#cohort-${course.id}`}
                                                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0e3b43] px-5 text-sm font-semibold text-[#f4f1e8] transition-colors hover:bg-[#f2a541] hover:text-[#0e3b43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2a541]"
                                            >
                                                Join cohort
                                                <span className="sr-only">: {course.title}</span>
                                                <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.article>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>

                {visible.length === 0 && (
                    <div className="mt-2 flex flex-col items-center rounded-[24px] border-2 border-dashed border-[#0e3b43]/20 bg-[#fbf9f3] px-6 py-14 text-center">
                        <span className="grid h-16 w-16 place-items-center rounded-full bg-[#f2a541]/25 text-[#0e3b43]">
                            <LuSearchX className="h-7 w-7" aria-hidden="true" />
                        </span>
                        <h3 className="mt-5 text-2xl font-bold text-[#0e3b43]">No {level.toLowerCase()} {topic} cohort yet</h3>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#0e3b43]/70">
                            We are still writing that one. Try another level, or join the waitlist and
                            we will email you when the spring 2027 timetable goes live.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#0e3b43] px-6 text-sm font-semibold text-[#f4f1e8] transition-colors hover:bg-[#0b2f36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2a541]"
                                onClick={resetFilters}
                            >
                                Reset filters
                            </button>
                            <a
                                href="#cohort-waitlist"
                                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#0e3b43]/25 px-6 text-sm font-semibold text-[#0e3b43] transition-colors hover:border-[#0e3b43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2a541]"
                            >
                                Join the waitlist
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default CohortTrackCourseCatalog

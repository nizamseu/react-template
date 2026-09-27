// DayOneDayNinetyLearningOutcomes

// LearningOutcomes04 · Learning Management Systems › Learning Outcomes

// Description:
// A before/after comparison for the fictional language course Fluent in 90 (Spanish
// track). Under "Same you. Ninety days apart." three headline stats (words, CEFR level,
// longest conversation) sit above a split board: a muted grey "Day 1" column and a vivid
// yellow "Day 90" column describing six real-life situations — at a café, small talk,
// podcasts, phone calls, reading, writing — each with a sample Spanish line. Use it on a
// language or skills course page to make progress tangible.

// Design:
// - Page #fafaf7 with ink #111 text; Day 1 cells are grey #ecece8 with #6b6b66 text and
//   dashed example rules; Day 90 cells are yellow #ffd60a with black text and a black
//   header band; the board is rounded-[32px] with a 2px ink border
// - Rows are paired 2-column grids so both sides of a situation always align; each cell
//   has a mono topic label, a statement and an italic example line
// - Bold sans heading text-4xl → lg:text-7xl; stats in a 3-column row with "→" between
//   the before and after numbers; a round ink arrow badge joins the two headers on md+
// - Mobile toggle: segmented "Day 1 / Day 90" control with a sliding ink pill
//   (framer-motion layoutId, instant for reduced motion)
// - Responsive: below md only the selected column shows; from md both columns show side
//   by side and the toggle hides; stats stack to one column under sm

// What it does:
// - view state ('day1' | 'day90', default 'day90') set by the aria-pressed toggle; it
//   only affects the mobile layout (hidden/flex classes), both columns show from md
// - An aria-live line announces which day is shown on mobile
// - "Start Day 1 free" links to #fluent90-start; "Hear real Day 90 recordings" to
//   #fluent90-recordings

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DayOneDayNinetyLearningOutcomes from '@/TestComponent/PageSections/learning/LearningOutcomes04';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <DayOneDayNinetyLearningOutcomes />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const stats = [
    { label: 'Words you can use', before: '50', after: '1,800' },
    { label: 'CEFR level', before: 'A0', after: 'B1' },
    { label: 'Longest conversation', before: '0 min', after: '25 min' },
]

const rows = [
    {
        topic: 'At a café',
        day1: 'Point at the menu and hope for the best.',
        day1Example: '“Un café… ¿por favor?”',
        day90: 'Order for the whole table, ask what’s gluten-free and split the bill.',
        day90Example: '“¿Nos pones dos cortados y algo sin gluten para ella?”',
    },
    {
        topic: 'Small talk',
        day1: 'Say your name and where you’re from, then panic.',
        day1Example: '“Me llamo Sam. Soy de… Leeds.”',
        day90: 'Keep a 20-minute chat going about work, family and weekend plans.',
        day90Example: '“El finde pasado fuimos a la sierra, ¿y vosotros?”',
    },
    {
        topic: 'Listening',
        day1: 'Catch one word in ten on a podcast at normal speed.',
        day1Example: '“…hola… mañana… ¿vale?”',
        day90: 'Follow a news podcast at 1× speed and sum it up afterwards.',
        day90Example: '“Hablaban de la subida del alquiler en Madrid.”',
    },
    {
        topic: 'Phone calls',
        day1: 'Let it ring. Text back in English.',
        day1Example: '“Sorry, ¿inglés?”',
        day90: 'Book a dentist appointment and reschedule it without switching language.',
        day90Example: '“¿Podríamos pasar la cita al jueves por la tarde?”',
    },
    {
        topic: 'Reading',
        day1: 'Spot the easy cognates on a menu: chocolate, hotel, tomate.',
        day1Example: '“Tomate… ¡tomato!”',
        day90: 'Read a short story in one sitting, reaching for the dictionary twice.',
        day90Example: '“Aquella tarde, el tren llegó con retraso…”',
    },
    {
        topic: 'Writing',
        day1: 'Copy phrases from the app, letter by letter.',
        day1Example: '“Buenos días. Gracias.”',
        day90: 'Write a 150-word email to your landlord about the broken boiler.',
        day90Example: '“Le escribo porque la caldera no funciona desde el lunes.”',
    },
]

const views = [
    { id: 'day1', label: 'Day 1' },
    { id: 'day90', label: 'Day 90' },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]'

export function DayOneDayNinetyLearningOutcomes({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [view, setView] = useState('day90')

    const day1Cell = cn(view === 'day1' ? 'flex' : 'hidden', 'md:flex')
    const day90Cell = cn(view === 'day90' ? 'flex' : 'hidden', 'md:flex')

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fafaf7] px-4 py-16 text-base font-normal text-[#111] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-[#111] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd60a]">
                            Fluent in 90 · Spanish track
                        </p>
                        <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.03em] text-[#111] sm:text-6xl lg:text-7xl">
                            Same you.{' '}
                            <span className="bg-[#ffd60a] px-2 [box-decoration-break:clone]">Ninety days</span>{' '}
                            apart.
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-[#111]/65">
                        20 minutes a day plus three live conversations a week with a tutor. This is what
                        our median learner can do at each end.
                    </p>
                </div>

                <dl className="mt-10 grid gap-3 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <div key={stat.label} className="rounded-2xl border-2 border-[#111] bg-white px-5 py-4">
                            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#111]/60">
                                {stat.label}
                            </dt>
                            <dd className="mt-2 flex items-baseline gap-2.5">
                                <span className="text-xl font-bold text-[#8a8a85] line-through decoration-2">
                                    {stat.before}
                                </span>
                                <HiArrowRight className="h-4 w-4 self-center text-[#111]" aria-hidden="true" />
                                <span className="text-3xl font-black tracking-tight text-[#111]">{stat.after}</span>
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-10 md:hidden">
                    <div
                        role="group"
                        aria-label="Compare day 1 and day 90"
                        className="grid grid-cols-2 rounded-full border-2 border-[#111] bg-white p-1"
                    >
                        {views.map((item) => {
                            const isActive = view === item.id
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() => setView(item.id)}
                                    className={cn(
                                        'relative min-h-11 rounded-full text-sm font-bold transition-colors',
                                        isActive ? (item.id === 'day90' ? 'text-[#ffd60a]' : 'text-white') : 'text-[#111]',
                                        focusRing,
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="fluent90-toggle"
                                            className="absolute inset-0 rounded-full bg-[#111]"
                                            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="relative">{item.label}</span>
                                </button>
                            )
                        })}
                    </div>
                    <p className="sr-only" aria-live="polite">
                        {view === 'day1' ? 'Showing Day 1 abilities' : 'Showing Day 90 abilities'}
                    </p>
                </div>

                <div className="mt-4 overflow-hidden rounded-[32px] border-2 border-[#111] md:mt-10">
                    <div className="relative grid md:grid-cols-2">
                        <div className={cn(day1Cell, 'items-end justify-between gap-4 bg-[#dcdcd7] px-5 py-6 sm:px-8')}>
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b6b66]">
                                    A0 · Absolute beginner
                                </p>
                                <h3 className="mt-1 text-4xl font-black tracking-tight text-[#6b6b66] sm:text-5xl">
                                    Day 1
                                </h3>
                            </div>
                            <span className="mb-1 text-sm text-[#6b6b66]">Nervous. Curious.</span>
                        </div>
                        <div className={cn(day90Cell, 'items-end justify-between gap-4 bg-[#111] px-5 py-6 sm:px-8 md:pl-12')}>
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ffd60a]/80">
                                    B1 · Independent user
                                </p>
                                <h3 className="mt-1 text-4xl font-black tracking-tight text-[#ffd60a] sm:text-5xl">
                                    Day 90
                                </h3>
                            </div>
                            <span className="mb-1 text-sm text-[#ffd60a]/80">Chatty. Confident.</span>
                        </div>
                        <span
                            className="absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#111] bg-[#ffd60a] text-[#111] md:grid"
                            aria-hidden="true"
                        >
                            <HiArrowRight className="h-5 w-5" />
                        </span>
                    </div>

                    <ul>
                        {rows.map((row) => (
                            <li key={row.topic} className="grid border-t-2 border-[#111] md:grid-cols-2">
                                <div
                                    className={cn(
                                        day1Cell,
                                        'flex-col gap-2 bg-[#ecece8] px-5 py-6 sm:px-8 md:border-r-2 md:border-[#111]',
                                    )}
                                >
                                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8a85]">
                                        {row.topic}
                                    </p>
                                    <p className="text-lg font-semibold leading-snug text-[#6b6b66]">{row.day1}</p>
                                    <p lang="es" className="border-l-2 border-dashed border-[#b5b5af] pl-3 text-sm italic text-[#8a8a85]">
                                        {row.day1Example}
                                    </p>
                                </div>
                                <div className={cn(day90Cell, 'flex-col gap-2 bg-[#ffd60a] px-5 py-6 sm:px-8 md:pl-12')}>
                                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#111]/60">
                                        {row.topic}
                                    </p>
                                    <p className="text-lg font-bold leading-snug text-[#111]">{row.day90}</p>
                                    <p lang="es" className="border-l-2 border-[#111] pl-3 text-sm italic text-[#111]/80">
                                        {row.day90Example}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <a
                        href="#fluent90-start"
                        className={cn(
                            'group/start inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#111] px-7 text-sm font-bold text-[#ffd60a] transition-transform hover:-translate-y-0.5',
                            focusRing,
                        )}
                    >
                        Start Day 1 free
                        <HiArrowLongRight
                            className="h-5 w-5 transition-transform group-hover/start:translate-x-1"
                            aria-hidden="true"
                        />
                    </a>
                    <a
                        href="#fluent90-recordings"
                        className={cn(
                            'inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#111] px-6 text-sm font-bold text-[#111] transition-colors hover:bg-[#ffd60a]',
                            focusRing,
                        )}
                    >
                        Hear real Day 90 recordings
                    </a>
                    <p className="text-sm text-[#111]/55 sm:ml-auto">7-day free trial, then $14 a month.</p>
                </div>
            </div>
        </section>
    )
}

export default DayOneDayNinetyLearningOutcomes

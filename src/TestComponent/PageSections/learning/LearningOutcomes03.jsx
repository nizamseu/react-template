// ChecklistRingLearningOutcomes

// LearningOutcomes03 · Learning Management Systems › Learning Outcomes

// Description:
// A hands-on skills checklist for the fictional Greenleaf Gardening Course. Under "Grow
// the skills, watch the ring fill." twelve practical outcomes are grouped into four
// modules (Soil & site, Sowing & propagation, Growing & care, Harvest & planning). Ticking
// an item fills an SVG progress ring and updates "7 of 12 skills", a growth-stage label
// and each module's count. Use it on a course page or learner area to show what students
// will be able to do and let them self-assess.

// Design:
// - Sage #eef3e8 background, forest #2f5d3a for text, the ring card, checked boxes and
//   module pills; the ring stroke is fresh green #b7e08f on the forest card
// - Serif heading text-4xl → lg:text-6xl with an italic word; module cards are white/70
//   rounded-3xl with forest/10 borders, a thin progress bar and a count pill
// - Custom checkboxes: sr-only native input + rounded-lg box that fills forest with a
//   white check; checked rows get a pale green wash; practice time in small caps
// - Motion: ring strokeDashoffset and module bars animate with framer-motion; the stage
//   icon (sprout, leaf, flower, wheat) pops in when it changes; instant for reduced motion
// - Responsive: ring card above the list on mobile; from lg a 5/7 split with the ring
//   card sticky (top-8); module cards are 1 column → sm:2 columns

// What it does:
// - checked state (a Set of skill ids) starts with 7 of 12 ticked; each checkbox toggles
//   its id and updates the ring, percentage, "N of 12 skills", stage and module counts
// - "Tick all" and "Reset" buttons set every skill / none; the count is in an aria-live
//   region so screen readers hear progress changes
// - "Enrol in the spring cohort" links to #greenleaf-enrol; leaves are decorative only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ChecklistRingLearningOutcomes from '@/TestComponent/PageSections/learning/LearningOutcomes03';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <ChecklistRingLearningOutcomes />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiCheck } from 'react-icons/hi2';
import { LuFlower2, LuLeaf, LuSprout, LuWheat } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const modules = [
    {
        id: 'soil',
        title: 'Soil & site',
        items: [
            { id: 'ribbon-test', label: 'Read soil texture with the ribbon test', time: '20 min' },
            { id: 'sun-map', label: 'Map sun and shade across a full day', time: '1 day' },
            { id: 'hot-compost', label: 'Build a hot compost that reaches 55 °C', time: '2 weeks' },
        ],
    },
    {
        id: 'sowing',
        title: 'Sowing & propagation',
        items: [
            { id: 'sow-depth', label: 'Sow seeds at the right depth and spacing', time: '30 min' },
            { id: 'cuttings', label: 'Take softwood cuttings that actually root', time: '3 weeks' },
            { id: 'harden-off', label: 'Harden off seedlings over ten days', time: '10 days' },
        ],
    },
    {
        id: 'care',
        title: 'Growing & care',
        items: [
            { id: 'water-deep', label: 'Water deeply, not daily', time: 'Ongoing' },
            { id: 'aphids', label: 'Spot and treat aphids without sprays', time: '15 min' },
            { id: 'cordons', label: 'Pinch out and train tomato cordons', time: '1 hour' },
        ],
    },
    {
        id: 'harvest',
        title: 'Harvest & planning',
        items: [
            { id: 'rotation', label: 'Plan a four-bed crop rotation', time: '2 hours' },
            { id: 'seed-saving', label: 'Save seed from open-pollinated plants', time: '1 week' },
            { id: 'green-manure', label: 'Put a bed to rest with green manure', time: '45 min' },
        ],
    },
]

const ALL_IDS = modules.flatMap((module) => module.items.map((item) => item.id))
const INITIAL = ['ribbon-test', 'sun-map', 'hot-compost', 'sow-depth', 'cuttings', 'water-deep', 'aphids']

const stages = [
    { min: 0, label: 'Seed', note: 'Every garden starts somewhere.', icon: LuSprout },
    { min: 0.25, label: 'Sprouting', note: 'Roots are down. Keep going.', icon: LuSprout },
    { min: 0.5, label: 'In leaf', note: 'You’re growing fast.', icon: LuLeaf },
    { min: 0.75, label: 'In bloom', note: 'Almost harvest time.', icon: LuFlower2 },
    { min: 1, label: 'Harvest-ready', note: 'Every skill ticked. Well grown!', icon: LuWheat },
]

const RADIUS = 84
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f5d3a]'

export function ChecklistRingLearningOutcomes({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [checked, setChecked] = useState(() => new Set(INITIAL))

    const toggle = (id) =>
        setChecked((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })

    const done = checked.size
    const total = ALL_IDS.length
    const ratio = done / total
    const percent = Math.round(ratio * 100)
    const stage = [...stages].reverse().find((item) => ratio >= item.min)
    const StageIcon = stage.icon
    const transition = { duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#eef3e8] px-4 py-16 text-base font-normal text-[#2f5d3a] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <LuLeaf
                className="pointer-events-none absolute -right-10 -top-6 h-56 w-56 rotate-[35deg] text-[#2f5d3a]/[0.06]"
                aria-hidden="true"
            />

            <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
                <div className="lg:sticky lg:top-8 lg:self-start">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2f5d3a]/80">
                        <LuSprout className="h-4 w-4" aria-hidden="true" />
                        Greenleaf Gardening Course · 8 weeks
                    </p>
                    <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#1f3f27] sm:text-5xl lg:text-6xl">
                        Grow the skills, watch the <em>ring fill</em>.
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-[#2f5d3a]/80">
                        Twelve things you’ll be able to do in your own plot by week eight. Tick the ones you
                        can already do to see where you’d start.
                    </p>

                    <div className="mt-8 rounded-[32px] bg-[#2f5d3a] p-6 text-[#eef3e8] shadow-[0_30px_60px_-36px_rgba(31,63,39,0.9)] sm:p-8">
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                            <div className="relative h-48 w-48 shrink-0">
                                <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
                                    <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="rgba(238,243,232,0.15)" strokeWidth="14" />
                                    <motion.circle
                                        cx="100"
                                        cy="100"
                                        r={RADIUS}
                                        fill="none"
                                        stroke="#b7e08f"
                                        strokeWidth="14"
                                        strokeLinecap="round"
                                        strokeDasharray={CIRCUMFERENCE}
                                        initial={false}
                                        animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - ratio) }}
                                        transition={transition}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="font-serif text-5xl leading-none text-[#eef3e8]">
                                        {percent}
                                        <span className="text-2xl">%</span>
                                    </span>
                                    <span className="mt-1.5 text-xs uppercase tracking-[0.18em] text-[#eef3e8]/70">
                                        complete
                                    </span>
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-2xl font-semibold text-[#eef3e8]" aria-live="polite">
                                    {done} of {total} skills
                                </p>
                                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#eef3e8]/10 px-3 py-1.5 text-sm text-[#b7e08f]">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.span
                                            key={stage.label}
                                            initial={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                                            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 22 }}
                                            className="inline-flex"
                                        >
                                            <StageIcon className="h-4 w-4" aria-hidden="true" />
                                        </motion.span>
                                    </AnimatePresence>
                                    Stage: {stage.label}
                                </div>
                                <p className="mt-3 text-sm text-[#eef3e8]/75">{stage.note}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3 border-t border-[#eef3e8]/15 pt-6">
                            <button
                                type="button"
                                onClick={() => setChecked(new Set(ALL_IDS))}
                                disabled={done === total}
                                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#b7e08f] px-4 text-sm font-semibold text-[#1f3f27] transition-colors hover:bg-[#c9eba6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7e08f] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Tick all
                            </button>
                            <button
                                type="button"
                                onClick={() => setChecked(new Set())}
                                disabled={done === 0}
                                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[#eef3e8]/30 px-4 text-sm font-semibold text-[#eef3e8] transition-colors hover:border-[#eef3e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7e08f] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {modules.map((module, moduleIndex) => {
                            const moduleDone = module.items.filter((item) => checked.has(item.id)).length
                            return (
                                <fieldset
                                    key={module.id}
                                    className="rounded-3xl border border-[#2f5d3a]/10 bg-white/70 p-5 backdrop-blur-sm"
                                >
                                    <legend className="sr-only">{`Module ${moduleIndex + 1}: ${module.title}`}</legend>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2f5d3a]/60">
                                                Module {moduleIndex + 1}
                                            </p>
                                            <h3 className="mt-1 font-serif text-xl font-normal text-[#1f3f27]">
                                                {module.title}
                                            </h3>
                                        </div>
                                        <span
                                            className={cn(
                                                'shrink-0 rounded-full px-2.5 py-1 font-mono text-xs font-semibold tabular-nums',
                                                moduleDone === module.items.length
                                                    ? 'bg-[#2f5d3a] text-[#eef3e8]'
                                                    : 'bg-[#2f5d3a]/10 text-[#2f5d3a]',
                                            )}
                                        >
                                            {moduleDone}/{module.items.length}
                                        </span>
                                    </div>
                                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#2f5d3a]/10">
                                        <motion.div
                                            className="h-full rounded-full bg-[#2f5d3a]"
                                            initial={false}
                                            animate={{ width: `${(moduleDone / module.items.length) * 100}%` }}
                                            transition={transition}
                                        />
                                    </div>
                                    <ul className="mt-4 space-y-1.5">
                                        {module.items.map((item) => {
                                            const isChecked = checked.has(item.id)
                                            return (
                                                <li key={item.id}>
                                                    <label
                                                        className={cn(
                                                            'group flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl px-2.5 py-2.5 transition-colors',
                                                            isChecked ? 'bg-[#dcebcf]' : 'hover:bg-[#2f5d3a]/5',
                                                        )}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggle(item.id)}
                                                            className="peer sr-only"
                                                        />
                                                        <span
                                                            className={cn(
                                                                'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-lg border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2f5d3a]',
                                                                isChecked
                                                                    ? 'border-[#2f5d3a] bg-[#2f5d3a] text-white'
                                                                    : 'border-[#2f5d3a]/40 bg-white text-transparent',
                                                            )}
                                                            aria-hidden="true"
                                                        >
                                                            <HiCheck className="h-3.5 w-3.5" />
                                                        </span>
                                                        <span className="min-w-0">
                                                            <span
                                                                className={cn(
                                                                    'block text-sm leading-snug',
                                                                    isChecked ? 'font-semibold text-[#1f3f27]' : 'text-[#2f5d3a]',
                                                                )}
                                                            >
                                                                {item.label}
                                                            </span>
                                                            <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em] text-[#2f5d3a]/55">
                                                                Practice · {item.time}
                                                            </span>
                                                        </span>
                                                    </label>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </fieldset>
                            )
                        })}
                    </div>

                    <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-dashed border-[#2f5d3a]/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-[#2f5d3a]/80">
                            Spring cohort starts <span className="font-semibold text-[#1f3f27]">Sat 6 March 2027</span>{' '}
                            · weekly allotment visits · £189
                        </p>
                        <a
                            href="#greenleaf-enrol"
                            className={cn(
                                'group/enrol inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#2f5d3a] px-5 text-sm font-semibold text-[#eef3e8] transition-colors hover:bg-[#1f3f27] sm:self-auto',
                                focusRing,
                            )}
                        >
                            Enrol in the spring cohort
                            <HiArrowLongRight
                                className="h-5 w-5 transition-transform group-hover/enrol:translate-x-1"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChecklistRingLearningOutcomes

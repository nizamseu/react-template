// SkillRadarLearningOutcomes

// LearningOutcomes02 · Learning Management Systems › Learning Outcomes

// Description:
// A data-driven outcomes section for the fictional Quantix Analytics Academy's 16-week
// Data Analyst Career Track. Under "See your skills change shape." an SVG radar chart
// plots six skills (storytelling, SQL, Python, A/B testing, statistics, data viz); a
// "Week 1 / Week 16" toggle morphs the polygon between the average learner's scores at
// enrolment and at graduation, while a legend, an average score and a per-skill list with
// bars follow along. Use it on an analytics or technical course page to prove progress.

// Design:
// - Navy #0a1628 background, white text, cyan #22d3ee for the active polygon, vertices,
//   bars, toggle pill and eyebrow; a faint dot grid and cyan glow behind the chart card
// - Radar: inline SVG (viewBox 440×400), five concentric hexagon rings, axis spokes,
//   dashed white ghost for Week 1, dotted cyan ghost for Week 16, filled cyan/20 active
//   polygon with navy-filled vertex dots; short axis labels, full names in the list
// - Typography: bold sans heading text-4xl → lg:text-6xl, mono numerals (tabular) for
//   scores, small uppercase legend labels
// - Motion: a single progress motion value (0 → 1) animated with animate() drives the
//   polygon points, vertex positions, bar widths and every number; instant for reduced
//   motion
// - Responsive: stacked (intro, chart, list) on mobile; from lg a 2-column grid with the
//   chart card spanning both rows on the right

// What it does:
// - view state ('before' | 'after', default 'after') set by two aria-pressed buttons;
//   changing it animates progress between 0 and 1 (animation stopped on change/unmount)
// - The SVG has role="img" with an aria-label listing the current scores; an aria-live
//   line announces the view and average score
// - "Download the skills report" links to #quantix-skills-report; decorative grid only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SkillRadarLearningOutcomes from '@/TestComponent/PageSections/learning/LearningOutcomes02';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <SkillRadarLearningOutcomes />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowDownTray } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const skills = [
    { short: 'Storytelling', name: 'Stakeholder storytelling', before: 45, after: 84 },
    { short: 'SQL', name: 'SQL & data wrangling', before: 28, after: 88 },
    { short: 'Python', name: 'Python for analysis', before: 18, after: 80 },
    { short: 'A/B testing', name: 'Experiment design', before: 12, after: 74 },
    { short: 'Stats', name: 'Statistics & probability', before: 32, after: 76 },
    { short: 'Data viz', name: 'Data visualisation', before: 40, after: 92 },
]

const CX = 220
const CY = 200
const R = 130
const views = [
    { id: 'before', label: 'Week 1', sub: 'Before' },
    { id: 'after', label: 'Week 16', sub: 'After' },
]

const angleOf = (index) => ((-90 + index * 60) * Math.PI) / 180
const pointAt = (index, value) => [
    CX + ((R * value) / 100) * Math.cos(angleOf(index)),
    CY + ((R * value) / 100) * Math.sin(angleOf(index)),
]
const toPoints = (values) =>
    values.map((value, index) => pointAt(index, value).map((n) => n.toFixed(1)).join(',')).join(' ')
const mix = (skill, t) => skill.before + (skill.after - skill.before) * t
const average = (key) => Math.round(skills.reduce((sum, skill) => sum + skill[key], 0) / skills.length)

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]'

function Vertex({ index, skill, progress }) {
    const cx = useTransform(progress, (t) => pointAt(index, mix(skill, t))[0])
    const cy = useTransform(progress, (t) => pointAt(index, mix(skill, t))[1])
    return <motion.circle cx={cx} cy={cy} r="5.5" fill="#0a1628" stroke="#22d3ee" strokeWidth="2.5" />
}

function AxisLabel({ index, text }) {
    const [x, y] = pointAt(index, 100 + 16)
    const cos = Math.cos(angleOf(index))
    const sin = Math.sin(angleOf(index))
    const anchor = Math.abs(cos) < 0.1 ? 'middle' : cos > 0 ? 'start' : 'end'
    const dy = sin < -0.9 ? -4 : sin > 0.9 ? 16 : 5
    return (
        <text x={x} y={y + dy} textAnchor={anchor} className="fill-white/80 text-[16px] font-semibold">
            {text}
        </text>
    )
}

function SkillRow({ skill, progress }) {
    const value = useTransform(progress, (t) => Math.round(mix(skill, t)))
    const width = useTransform(progress, (t) => `${mix(skill, t)}%`)
    return (
        <li className="py-3.5">
            <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-white">{skill.name}</span>
                <span className="font-mono text-sm tabular-nums text-[#22d3ee]">
                    <motion.span>{value}</motion.span>
                    <span className="text-white/40">/100</span>
                </span>
            </div>
            <div className="relative mt-2.5 h-1.5 rounded-full bg-white/10">
                <motion.div className="absolute inset-y-0 left-0 rounded-full bg-[#22d3ee]" style={{ width }} />
                <span
                    className="absolute -top-1 h-3.5 w-0.5 rounded-full bg-white"
                    style={{ left: `${skill.before}%` }}
                    aria-hidden="true"
                />
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-white/50">
                Week 1: {skill.before} · Week 16: {skill.after} · +{skill.after - skill.before}
            </p>
        </li>
    )
}

export function SkillRadarLearningOutcomes({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [view, setView] = useState('after')
    const progress = useMotionValue(1)
    const points = useTransform(progress, (t) => toPoints(skills.map((skill) => mix(skill, t))))
    const avg = useTransform(progress, (t) => Math.round(skills.reduce((sum, skill) => sum + mix(skill, t), 0) / skills.length))

    useEffect(() => {
        const controls = animate(progress, view === 'after' ? 1 : 0, {
            duration: reduceMotion ? 0 : 0.9,
            ease: [0.22, 1, 0.36, 1],
        })
        return () => controls.stop()
    }, [view, reduceMotion, progress])

    const key = view === 'after' ? 'after' : 'before'
    const chartLabel = `Radar chart of ${view === 'after' ? 'week 16' : 'week 1'} skill scores: ${skills
        .map((skill) => `${skill.name} ${skill[key]}`)
        .join(', ')}`

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0a1628] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(34,211,238,0.12)_1px,transparent_1px)] bg-size-[22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
                aria-hidden="true"
            />

            <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#22d3ee]">
                        Quantix Analytics Academy · Data Analyst Track
                    </p>
                    <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                        See your skills change shape.
                    </h2>
                    <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
                        Average scores from 1,284 learners on our six skill assessments, taken in week 1 and
                        again after the 16-week capstone.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-5">
                        <div
                            role="group"
                            aria-label="Compare skill scores"
                            className="inline-flex rounded-full border border-white/15 bg-white/5 p-1"
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
                                            'relative inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors',
                                            isActive ? 'text-[#0a1628]' : 'text-white/75 hover:text-white',
                                            focusRing,
                                        )}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="quantix-toggle-pill"
                                                className="absolute inset-0 rounded-full bg-[#22d3ee]"
                                                transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span className="relative">{item.label}</span>
                                        <span
                                            className={cn(
                                                'relative font-mono text-[10px] uppercase tracking-[0.14em]',
                                                isActive ? 'text-[#0a1628]/70' : 'text-white/45',
                                            )}
                                        >
                                            {item.sub}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        <p className="flex items-baseline gap-2">
                            <span className="text-xs uppercase tracking-[0.18em] text-white/55">Average</span>
                            <motion.span className="font-mono text-3xl font-semibold tabular-nums text-white">
                                {avg}
                            </motion.span>
                            <span className="font-mono text-sm text-white/40">/100</span>
                        </p>
                    </div>
                    <p className="sr-only" aria-live="polite">
                        {`Showing ${view === 'after' ? 'week 16' : 'week 1'} scores, average ${average(key)} out of 100`}
                    </p>
                </div>

                <div className="relative rounded-[28px] border border-[#22d3ee]/15 bg-white/[0.03] p-4 sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
                    <div
                        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22d3ee]/15 blur-3xl"
                        aria-hidden="true"
                    />
                    <svg viewBox="0 0 440 400" className="relative mx-auto block w-full max-w-[520px]" role="img" aria-label={chartLabel}>
                        {[20, 40, 60, 80, 100].map((ring) => (
                            <polygon
                                key={ring}
                                points={toPoints(skills.map(() => ring))}
                                fill="none"
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth="1"
                            />
                        ))}
                        {skills.map((skill, index) => {
                            const [x, y] = pointAt(index, 100)
                            return (
                                <line key={skill.short} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                            )
                        })}
                        <polygon
                            points={toPoints(skills.map((skill) => skill.before))}
                            fill="none"
                            stroke="rgba(255,255,255,0.55)"
                            strokeWidth="1.5"
                            strokeDasharray="5 5"
                        />
                        <polygon
                            points={toPoints(skills.map((skill) => skill.after))}
                            fill="none"
                            stroke="rgba(34,211,238,0.45)"
                            strokeWidth="1.5"
                            strokeDasharray="1.5 4"
                            strokeLinecap="round"
                        />
                        <motion.polygon
                            points={points}
                            fill="rgba(34,211,238,0.2)"
                            stroke="#22d3ee"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                        {skills.map((skill, index) => (
                            <Vertex key={skill.short} index={index} skill={skill} progress={progress} />
                        ))}
                        {skills.map((skill, index) => (
                            <AxisLabel key={skill.short} index={index} text={skill.short} />
                        ))}
                    </svg>

                    <ul className="relative mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-white/65">
                        <li className="flex items-center gap-2">
                            <span className="h-3 w-5 rounded-sm border-2 border-[#22d3ee] bg-[#22d3ee]/20" aria-hidden="true" />
                            Selected week
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-5 border-t-2 border-dashed border-white/60" aria-hidden="true" />
                            Week 1 baseline
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-5 border-t-2 border-dotted border-[#22d3ee]/60" aria-hidden="true" />
                            Week 16 target
                        </li>
                    </ul>
                </div>

                <div className="lg:col-start-1 lg:row-start-2">
                    <ul className="divide-y divide-white/10 border-y border-white/10">
                        {skills.map((skill) => (
                            <SkillRow key={skill.short} skill={skill} progress={progress} />
                        ))}
                    </ul>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-white/55">
                            White tick = week 1 score. Average gain: +{average('after') - average('before')} points.
                        </p>
                        <a
                            href="#quantix-skills-report"
                            className={cn(
                                'inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[#22d3ee]/40 px-5 text-sm font-semibold text-[#22d3ee] transition-colors hover:bg-[#22d3ee] hover:text-[#0a1628] sm:self-auto',
                                focusRing,
                            )}
                        >
                            <HiArrowDownTray className="h-4 w-4" aria-hidden="true" />
                            Download the skills report
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SkillRadarLearningOutcomes

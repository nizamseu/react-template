// NumberedManifestoLearningOutcomes

// LearningOutcomes01 · Learning Management Systems › Learning Outcomes

// Description:
// An editorial manifesto of learning outcomes for the fictional Signal School UX Design
// Intensive. The heading "Six things you’ll do on Monday that you couldn’t do today."
// sits above six giant numerals, 01–06, each with the week range, an outcome statement
// (e.g. "Run a usability test that changes the roadmap."), a short explanation and the
// proof of work you leave with. Use it on a course or bootcamp page to set expectations
// before the syllabus or pricing.

// Design:
// - Off-white #f7f5f0 paper, black #0d0d0d ink and a single orange #ff5a1f accent (logo
//   dot, heading word, proof bullets, numeral hover fill); hairline dividers at 15% ink
// - Meta strip in mono: school wordmark with an SVG signal mark, course, duration and
//   cohort date between black rules
// - Giant outlined sans numerals (text-[5.5rem] → lg:text-[9rem], font-black, -webkit-
//   text-stroke) that fill orange on hover; statements in a tight bold sans
// - Items fade up into view with a small stagger (framer-motion, no offset for reduced
//   motion); the numeral transition is CSS
// - Responsive: 1 column on mobile; 2-column editorial grid from md with a vertical
//   hairline between columns; the intro splits into heading + aside from lg

// What it does:
// - No state: this is a content section; hover only changes the numeral colour
// - "Read the assessment rubric" links to #signal-rubric and "See the 12-week syllabus"
//   to #signal-syllabus; the signal mark and rules are decorative only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NumberedManifestoLearningOutcomes from '@/TestComponent/PageSections/learning/LearningOutcomes01';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <NumberedManifestoLearningOutcomes />
//     </main>
// )
// ```

'use client'

import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const outcomes = [
    {
        weeks: 'Weeks 1–2',
        title: 'Turn a vague brief into a sharp problem statement.',
        body: 'Run stakeholder interviews, map your assumptions and write a one-page brief your PM will actually sign off.',
        proof: 'Problem brief + assumption map',
    },
    {
        weeks: 'Weeks 3–4',
        title: 'Run a usability test that changes the roadmap.',
        body: 'Recruit five participants, moderate without leading them, and turn what you saw into three decisions within 48 hours.',
        proof: 'Recorded test + findings deck',
    },
    {
        weeks: 'Weeks 5–6',
        title: 'Sketch ten directions before falling for one.',
        body: 'Crazy-8s, storyboards and paper prototypes — and the nerve to kill your darlings in a crit without taking it personally.',
        proof: 'Concept wall, 10 directions',
    },
    {
        weeks: 'Weeks 7–8',
        title: 'Design interfaces that pass WCAG 2.2 AA.',
        body: 'Contrast, focus order, target sizes and screen-reader flows, checked with real assistive tech rather than a plugin.',
        proof: 'Accessibility audit, 20 checks',
    },
    {
        weeks: 'Weeks 9–10',
        title: 'Build a design system someone else can use.',
        body: 'Tokens, components and usage notes, handed to a developer who ships a real screen from your kit in a day.',
        proof: 'Starter kit, 24 components',
    },
    {
        weeks: 'Weeks 11–12',
        title: 'Present work that gets a yes in the room.',
        body: 'Tell the story behind a decision in ten minutes, field the hard questions, then publish it as a portfolio case study.',
        proof: 'Live crit + published case study',
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5a1f]'

export function NumberedManifestoLearningOutcomes({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f7f5f0] px-4 py-16 text-base font-normal text-[#0d0d0d] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-[#0d0d0d] py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0d0d0d] sm:text-[11px]">
                    <span className="flex items-center gap-2 font-semibold">
                        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                            <circle cx="10" cy="10" r="3" fill="#ff5a1f" />
                            <path d="M4.5 4.5a7.8 7.8 0 0 0 0 11M15.5 4.5a7.8 7.8 0 0 1 0 11" fill="none" stroke="#0d0d0d" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        Signal School
                    </span>
                    <span>UX Design Intensive</span>
                    <span>12 weeks · part-time</span>
                    <span className="sm:ml-auto">Cohort 14 · starts 3 Nov 2026</span>
                </div>

                <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
                    <h2 className="text-4xl font-extrabold leading-[0.98] tracking-[-0.035em] text-[#0d0d0d] sm:text-6xl lg:text-7xl">
                        Six things you’ll do on Monday that you{' '}
                        <span className="text-[#ff5a1f]">couldn’t do today.</span>
                    </h2>
                    <div className="border-l-2 border-[#ff5a1f] pl-5">
                        <p className="text-sm leading-relaxed text-[#0d0d0d]/70">
                            Every outcome is assessed on real work, reviewed by a practising designer. No
                            multiple-choice quizzes, no participation trophies.
                        </p>
                        <a
                            href="#signal-rubric"
                            className={cn(
                                'group/rubric mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#0d0d0d]',
                                focusRing,
                            )}
                        >
                            <span className="border-b border-[#0d0d0d] pb-0.5">Read the assessment rubric</span>
                            <HiArrowUpRight
                                className="h-4 w-4 transition-transform group-hover/rubric:-translate-y-0.5 group-hover/rubric:translate-x-0.5"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                </div>

                <ol className="mt-14 grid border-t border-[#0d0d0d] md:mt-20 md:grid-cols-2">
                    {outcomes.map((outcome, index) => (
                        <motion.li
                            key={outcome.title}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className={cn(
                                'group border-b border-[#0d0d0d]/15 py-8 sm:py-10 md:py-12',
                                index % 2 === 0 ? 'md:border-r md:pr-10 lg:pr-14' : 'md:pl-10 lg:pl-14',
                            )}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <span
                                    className="font-sans text-[5.5rem] font-black leading-[0.8] tracking-[-0.06em] text-transparent transition-colors duration-300 [-webkit-text-stroke:1.5px_#0d0d0d] group-hover:text-[#ff5a1f] group-hover:[-webkit-text-stroke-color:#ff5a1f] sm:text-[7rem] lg:text-[9rem]"
                                    aria-hidden="true"
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="mt-2 shrink-0 rounded-full border border-[#0d0d0d]/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0d0d0d]/70 sm:text-[11px]">
                                    {outcome.weeks}
                                </span>
                            </div>
                            <h3 className="mt-6 max-w-md text-2xl font-bold leading-[1.1] tracking-tight text-[#0d0d0d] sm:text-3xl">
                                <span className="sr-only">{`Outcome ${index + 1}: `}</span>
                                {outcome.title}
                            </h3>
                            <p className="mt-3 max-w-md text-base leading-relaxed text-[#0d0d0d]/70">{outcome.body}</p>
                            <p className="mt-5 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-[#0d0d0d]">
                                <span className="h-2 w-2 shrink-0 bg-[#ff5a1f]" aria-hidden="true" />
                                <span className="text-[#0d0d0d]/55">Proof —</span> {outcome.proof}
                            </p>
                        </motion.li>
                    ))}
                </ol>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-sm text-[#0d0d0d]/60">
                        92% of Cohort 13 completed all six outcomes. 41 of 48 graduates were hired within
                        six months.
                    </p>
                    <a
                        href="#signal-syllabus"
                        className={cn(
                            'group/syl inline-flex min-h-12 items-center justify-center gap-3 self-start rounded-full bg-[#0d0d0d] px-6 text-sm font-semibold text-[#f7f5f0] transition-colors hover:bg-[#ff5a1f] sm:self-auto',
                            focusRing,
                        )}
                    >
                        See the 12-week syllabus
                        <HiArrowLongRight
                            className="h-5 w-5 transition-transform group-hover/syl:translate-x-1"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default NumberedManifestoLearningOutcomes

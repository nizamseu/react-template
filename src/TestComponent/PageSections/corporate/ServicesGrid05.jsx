// ProcessPathServicesGrid

// ServicesGrid05 · Corporate & Business › Services Grid

// Description:
// The services of the digital agency Brightbridge Digital laid out as a five-step process:
// Discover, Define, Design, Build and Grow, each with a duration, a one-line promise and
// three concrete outputs. Under "Five steps from “we should” to “it’s live”." a purple SVG
// connector path draws itself from step to step as the visitor scrolls, lighting each
// numbered node on arrival. Use it for agencies, studios or consultancies that sell a
// defined method rather than a menu of services.

// Design:
// - Cream #fff8f0 section, ink #1c1330, purple #6d28d9 for the drawn path, reached nodes,
//   icons and CTA; lilac #ede4ff for the undrawn dashed track and icon tiles
// - lg: a 160px strip above five equal columns holds an S-curved path through five nodes
//   (alternating high/low), drawn with pathLength; below lg a vertical SVG line runs down
//   the left of stacked step cards with the nodes on it
// - Cards: white, rounded-3xl, 1px ink/10 border that turns purple with a soft purple
//   shadow once the path reaches them; bold tight sans titles, mono step numbers and
//   durations, check-marked outputs; hover lifts 4px (off for reduced motion)
// - Responsive: base–md one column with the left rail (pl-14); lg five columns under the
//   curved strip; footer stacks on base and splits from sm

// What it does:
// - useScroll tracks the steps wrapper ("start 75%" → "end 60%"), smoothed with useSpring;
//   it drives both paths' pathLength, and useMotionValueEvent turns it into reached (0–5)
// - reached lights nodes (purple fill + halo) and card borders; below lg each node-to-node
//   segment draws over its own slice of the progress; under reduced motion the path is
//   fully drawn and every step is reached from the start
// - "Book a discovery call" links to #brightbridge-discovery and "See a sample plan" to
//   #brightbridge-sample-plan

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ProcessPathServicesGrid from '@/TestComponent/PageSections/corporate/ServicesGrid05';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <ProcessPathServicesGrid />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { LuCheck, LuCodeXml, LuCompass, LuPenTool, LuRocket, LuSearch } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const steps = [
    {
        id: 'discover',
        icon: LuSearch,
        title: 'Discover',
        duration: '2–3 weeks',
        text: 'Interviews, analytics and a one-page problem statement everyone signs.',
        outputs: ['12 stakeholder interviews', 'Analytics & SEO audit', 'Opportunity map'],
    },
    {
        id: 'define',
        icon: LuCompass,
        title: 'Define',
        duration: '2 weeks',
        text: 'Architecture, user flows and a scope we can price to the pound.',
        outputs: ['Sitemap & user flows', 'Content model', 'Fixed-price proposal'],
    },
    {
        id: 'design',
        icon: LuPenTool,
        title: 'Design',
        duration: '4–6 weeks',
        text: 'A design system first, then every page, tested with real customers.',
        outputs: ['Component library', 'Clickable prototype', '5 rounds of user tests'],
    },
    {
        id: 'build',
        icon: LuCodeXml,
        title: 'Build',
        duration: '5–8 weeks',
        text: 'Accessible, fast front-ends on a headless CMS, shipped every Friday.',
        outputs: ['Weekly staging releases', 'WCAG 2.2 AA audit', 'Green Core Web Vitals'],
    },
    {
        id: 'grow',
        icon: LuRocket,
        title: 'Grow',
        duration: 'Ongoing',
        text: 'Launch, then measure, test and improve every month with a named lead.',
        outputs: ['Monthly experiment plan', 'Conversion reporting', 'Quarterly roadmap review'],
    },
]

const CURVE = 'M100 40C200 40 200 120 300 120S400 40 500 40S600 120 700 120S800 40 900 40'
const nodeTops = ['25%', '75%', '25%', '75%', '25%']
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d28d9]'

const threshold = (index) => (index === 0 ? 0.01 : index / (steps.length - 1) - 0.02)

function Node({ index, reached, className, style }) {
    const lit = reached > index
    return (
        <span
            aria-hidden="true"
            className={cn(
                'grid size-10 place-items-center rounded-full border-2 font-mono text-xs font-bold transition-colors duration-300',
                lit
                    ? 'border-[#6d28d9] bg-[#6d28d9] text-white shadow-[0_0_0_6px_rgba(109,40,217,0.15)]'
                    : 'border-[#d9c9fb] bg-[#fff8f0] text-[#6d28d9]',
                className,
            )}
            style={style}
        >
            {String(index + 1).padStart(2, '0')}
        </span>
    )
}

function Segment({ index, progress, reduceMotion }) {
    const span = 1 / (steps.length - 1)
    const drawn = useTransform(progress, [index * span, (index + 1) * span], [0, 1])
    return (
        <span aria-hidden="true" className="absolute -bottom-[3.75rem] -left-[38px] top-10 w-1 lg:hidden">
            <svg viewBox="0 0 4 100" preserveAspectRatio="none" className="block size-full">
                <path d="M2 0V100" stroke="#d9c9fb" strokeWidth="2" strokeDasharray="6 8" vectorEffect="non-scaling-stroke" />
                <motion.path
                    d="M2 0V100"
                    stroke="#6d28d9"
                    strokeWidth="3.5"
                    vectorEffect="non-scaling-stroke"
                    style={{ pathLength: reduceMotion ? 1 : drawn }}
                />
            </svg>
        </span>
    )
}

export function ProcessPathServicesGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const stepsRef = useRef(null)
    const [scrolled, setScrolled] = useState(0)
    const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 0.75', 'end 0.6'] })
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
    const reached = reduceMotion ? steps.length : scrolled

    useMotionValueEvent(progress, 'change', (value) => {
        const next = steps.filter((_, index) => value >= threshold(index)).length
        setScrolled((current) => (current === next ? current : next))
    })

    const pathLength = reduceMotion ? 1 : progress

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fff8f0] py-16 font-sans text-base font-normal text-[#1c1330] md:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 top-10 size-96 rounded-full bg-[#ede4ff] blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 md:grid-cols-[1fr_20rem] md:items-end">
                    <div className="min-w-0">
                        <p className="inline-flex items-center gap-2 rounded-lg bg-[#ede4ff] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6d28d9]">
                            Brightbridge Digital · How we work
                        </p>
                        <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.03] tracking-[-0.035em] text-[#1c1330] sm:text-5xl lg:text-6xl">
                            Five steps from <span className="text-[#6d28d9]">“we should”</span> to “it’s live”.
                        </h2>
                    </div>
                    <p className="leading-relaxed text-[#1c1330]/70">
                        Every service we sell is one stage of the same path. Join at any step, but you will
                        always know which one you are on and what it produces.
                    </p>
                </div>

                <div ref={stepsRef} className="mt-14 lg:mt-16">
                    <div aria-hidden="true" className="relative hidden h-40 lg:block">
                        <svg viewBox="0 0 1000 160" preserveAspectRatio="none" className="absolute inset-0 size-full">
                            <path
                                d={CURVE}
                                fill="none"
                                stroke="#d9c9fb"
                                strokeWidth="2"
                                strokeDasharray="6 8"
                                vectorEffect="non-scaling-stroke"
                            />
                            <motion.path
                                d={CURVE}
                                fill="none"
                                stroke="#6d28d9"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                                style={{ pathLength }}
                            />
                        </svg>
                        {steps.map((step, index) => (
                            <Node
                                key={step.id}
                                index={index}
                                reached={reached}
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${10 + index * 20}%`, top: nodeTops[index] }}
                            />
                        ))}
                    </div>

                    <ol className="grid gap-5 pl-14 lg:grid-cols-5 lg:gap-4 lg:pl-0">

                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isReached = reached > index
                            return (
                                <li key={step.id} className="relative">
                                    {index < steps.length - 1 && (
                                        <Segment index={index} progress={progress} reduceMotion={reduceMotion} />
                                    )}
                                    <Node index={index} reached={reached} className="absolute -left-14 top-5 z-10 lg:hidden" />
                                    <article
                                        className={cn(
                                            'flex h-full flex-col rounded-3xl border bg-white p-6 transition-[translate,border-color,box-shadow] duration-500 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:p-5 xl:p-6',
                                            isReached
                                                ? 'border-[#6d28d9]/60 shadow-[0_20px_40px_-24px_rgba(109,40,217,0.55)]'
                                                : 'border-[#1c1330]/10 shadow-[0_10px_30px_-24px_rgba(28,19,48,0.4)]',
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="grid size-11 place-items-center rounded-2xl bg-[#ede4ff] text-[#6d28d9]">
                                                <Icon aria-hidden="true" className="size-5" />
                                            </span>
                                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#1c1330]/55">
                                                Step {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-[#1c1330]">{step.title}</h3>
                                        <p className="mt-1 font-mono text-xs text-[#6d28d9]">{step.duration}</p>
                                        <p className="mt-3 text-sm leading-relaxed text-[#1c1330]/70">{step.text}</p>
                                        <ul className="mt-5 space-y-2 border-t border-dashed border-[#1c1330]/15 pt-4">
                                            {step.outputs.map((output) => (
                                                <li key={output} className="flex items-start gap-2 text-sm text-[#1c1330]/85">
                                                    <LuCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#6d28d9]" />
                                                    {output}
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                </li>
                            )
                        })}
                    </ol>
                </div>

                <div className="mt-12 flex flex-col gap-5 rounded-3xl bg-[#1c1330] p-6 text-[#fff8f0] sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <p className="max-w-xl text-sm leading-relaxed text-[#fff8f0]/80">
                        <span className="font-semibold text-[#fff8f0]">Average project: 17 weeks.</span> 94% of
                        our last 60 launches went live on the date we promised in step two.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <a
                            href="#brightbridge-sample-plan"
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#fff8f0]/30 px-5 text-sm font-semibold text-[#fff8f0] transition-colors hover:border-[#fff8f0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c4b5fd]"
                        >
                            See a sample plan
                        </a>
                        <a
                            href="#brightbridge-discovery"
                            className={cn(
                                'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#6d28d9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#7c3aed]',
                                focusRing,
                                'focus-visible:outline-[#c4b5fd]',
                            )}
                        >
                            Book a discovery call
                            <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProcessPathServicesGrid

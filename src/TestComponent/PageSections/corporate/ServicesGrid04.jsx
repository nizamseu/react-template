// IndustryTabsServicesGrid

// ServicesGrid04 · Corporate & Business › Services Grid

// Description:
// A sector-by-sector services block for Keystone Consulting. Under "Sector teams that have
// sat on your side of the table." four tabs (Healthcare, Energy, Retail, Public sector)
// swap a list of five services, the sector lead and a blue "Case in point" card with one
// headline metric (e.g. "−31% median emergency wait") and a before/after bar comparison.
// Use it on a consultancy or agency services page where offers differ by industry.

// Design:
// - White section, ink #0b1220, royal blue #1d4ed8 for the sliding tab pill, service
//   icons, links and the case card; pale blue #eff4ff tab track and icon tiles
// - Swiss-style layout: bold tight sans headings, mono eyebrows, 1px #e2e8f0 hairlines,
//   rounded-2xl cards; the case card has a faint 32px grid and white type
// - Tab pill moves between tabs with a shared layoutId spring; the panel cross-fades and
//   rises 12px, and bars grow from zero (all instant for reduced motion)
// - Responsive: tabs are a 2 × 2 grid on base and a single row from sm; the panel stacks
//   on base and splits 1.35fr / 1fr at lg; services go 1 → sm:2 columns

// What it does:
// - active (industry id) changes on tab click or ArrowLeft/Right/Home/End inside the
//   tablist (roving tabIndex, focus follows); tabs use role="tab", aria-selected and
//   aria-controls, and the panel is role="tabpanel"
// - Before/after bar widths are computed from each case's numbers (the lower bar is scaled
//   against the higher one)
// - Links: "Read the case study" → #keystone-case-<industry>, sector lead → #keystone-
//   lead-<industry>, "All 11 sectors" → #keystone-sectors

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IndustryTabsServicesGrid from '@/TestComponent/PageSections/corporate/ServicesGrid04';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <IndustryTabsServicesGrid />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import {
    LuBriefcase,
    LuChartLine,
    LuClipboardCheck,
    LuFactory,
    LuGauge,
    LuHeartPulse,
    LuLandmark,
    LuLayers,
    LuShieldCheck,
    LuShoppingBag,
    LuTruck,
    LuUsers,
    LuZap,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const industries = [
    {
        id: 'healthcare',
        label: 'Healthcare',
        icon: LuHeartPulse,
        intro: 'Hospital trusts, clinic networks and med-tech firms: fewer queues, safer staffing and capital that lands on time.',
        lead: 'Dr. Priya Raman',
        services: [
            { icon: LuGauge, title: 'Patient-flow redesign', text: 'Admission to discharge, mapped hour by hour.' },
            { icon: LuUsers, title: 'Clinical workforce planning', text: 'Rotas built on demand, not last year’s rota.' },
            { icon: LuClipboardCheck, title: 'Capital programme assurance', text: 'New wings delivered to budget and to code.' },
            { icon: LuLayers, title: 'Digital front door', text: 'Booking, triage and results in one journey.' },
            { icon: LuTruck, title: 'Clinical supply chain', text: 'Consumables tracked from dock to bedside.' },
        ],
        case: {
            client: 'Wessex Valley Health Partnership',
            metric: '−31%',
            metricLabel: 'median emergency wait',
            before: { label: 'Before', value: 252, display: '4 h 12 m' },
            after: { label: 'After', value: 174, display: '2 h 54 m' },
            detail: '18-month programme across 3 hospitals',
        },
    },
    {
        id: 'energy',
        label: 'Energy',
        icon: LuZap,
        intro: 'Utilities, generators and grid operators: more uptime from existing assets and credible routes to net zero.',
        lead: 'Tomás Herrera',
        services: [
            { icon: LuGauge, title: 'Asset performance', text: 'Reliability programmes for turbines and substations.' },
            { icon: LuZap, title: 'Grid-connection strategy', text: 'Queue position, capacity and timing, modelled.' },
            { icon: LuShieldCheck, title: 'Regulatory rate cases', text: 'Evidence packs regulators can say yes to.' },
            { icon: LuChartLine, title: 'Decarbonisation roadmaps', text: 'Costed, phased, and signed off by the board.' },
            { icon: LuClipboardCheck, title: 'Capital project controls', text: 'Earned value on every project over $50M.' },
        ],
        case: {
            client: 'Northmoor Power',
            metric: '+14 pts',
            metricLabel: 'wind-fleet availability',
            before: { label: 'Before', value: 83, display: '83%' },
            after: { label: 'After', value: 97, display: '97%' },
            detail: '212 turbines, 2 control rooms, 11 months',
        },
    },
    {
        id: 'retail',
        label: 'Retail',
        icon: LuShoppingBag,
        intro: 'Grocers, department stores and D2C brands: sharper pricing, leaner networks and customers who come back.',
        lead: 'Hannah Whitfield',
        services: [
            { icon: LuLayers, title: 'Store network optimisation', text: 'Which sites to grow, reformat or close.' },
            { icon: LuChartLine, title: 'Pricing & promotions', text: 'Elasticity models tested store by store.' },
            { icon: LuTruck, title: 'Supply-chain resilience', text: 'Dual sourcing without doubling the cost.' },
            { icon: LuUsers, title: 'Loyalty analytics', text: 'Turning points data into ranging decisions.' },
            { icon: LuFactory, title: 'Cost transformation', text: 'Back-office savings that fund the front.' },
        ],
        case: {
            client: 'Harbour & Hale Department Stores',
            metric: '+£48M',
            metricLabel: 'annual gross margin',
            before: { label: 'FY23', value: 312, display: '£312M' },
            after: { label: 'FY25', value: 360, display: '£360M' },
            detail: 'Pricing reset across 41 stores and online',
        },
    },
    {
        id: 'public',
        label: 'Public sector',
        icon: LuLandmark,
        intro: 'Councils, agencies and ministries: services that work first time and programmes that recover before they fail.',
        lead: 'Kwame Asante',
        services: [
            { icon: LuLayers, title: 'Service design & delivery', text: 'Digital services built with the people who use them.' },
            { icon: LuClipboardCheck, title: 'Programme recovery', text: 'Red-rated programmes back to amber in 90 days.' },
            { icon: LuChartLine, title: 'Spending review support', text: 'Business cases that survive the treasury.' },
            { icon: LuShieldCheck, title: 'Procurement reform', text: 'Fairer frameworks, faster awards.' },
            { icon: LuBriefcase, title: 'Workforce strategy', text: 'Skills plans for the next ten years.' },
        ],
        case: {
            client: 'Brennock City Council',
            metric: '−78%',
            metricLabel: 'housing-benefit decision time',
            before: { label: 'Before', value: 9.1, display: '9.1 days' },
            after: { label: 'After', value: 2, display: '2.0 days' },
            detail: '64,000 claims a year, one redesigned service',
        },
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]'

export function IndustryTabsServicesGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [active, setActive] = useState(industries[0].id)
    const tabRefs = useRef([])
    const activeIndex = industries.findIndex((industry) => industry.id === active)
    const industry = industries[activeIndex]
    const peak = Math.max(industry.case.before.value, industry.case.after.value)

    const onKeyDown = (event) => {
        const count = industries.length
        const targets = { ArrowRight: activeIndex + 1, ArrowLeft: activeIndex - 1, Home: 0, End: count - 1 }
        if (!(event.key in targets)) return
        event.preventDefault()
        const next = (targets[event.key] + count) % count
        setActive(industries[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white py-16 font-sans text-base font-normal text-[#0b1220] md:py-24',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 border-b border-[#e2e8f0] pb-10 md:grid-cols-[1fr_22rem] md:items-end">
                    <div className="min-w-0">
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#1d4ed8]">Keystone Consulting · Industries</p>
                        <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.03em] text-[#0b1220] sm:text-5xl">
                            Sector teams that have sat on <span className="text-[#1d4ed8]">your side</span> of the table.
                        </h2>
                    </div>
                    <p className="leading-relaxed text-[#0b1220]/65">
                        Every sector team is led by a former operator: clinicians, grid engineers, merchants and
                        civil servants who have run the thing we are now advising on.
                    </p>
                </div>

                <div
                    role="tablist"
                    aria-label="Industries"
                    className="mt-10 grid grid-cols-2 gap-1 rounded-2xl bg-[#eff4ff] p-1.5 sm:inline-flex sm:rounded-full"
                    onKeyDown={onKeyDown}
                >
                    {industries.map((item, index) => {
                        const selected = item.id === active
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                ref={(node) => {
                                    tabRefs.current[index] = node
                                }}
                                type="button"
                                role="tab"
                                id={`${uid}-tab-${item.id}`}
                                aria-selected={selected}
                                aria-controls={`${uid}-panel`}
                                tabIndex={selected ? 0 : -1}
                                className={cn(
                                    'relative flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors sm:rounded-full sm:px-5',
                                    selected ? 'text-white' : 'text-[#0b1220]/70 hover:text-[#1d4ed8]',
                                    focusRing,
                                )}
                                onClick={() => setActive(item.id)}
                            >
                                {selected && (
                                    <motion.span
                                        layoutId={`${uid}-pill`}
                                        aria-hidden="true"
                                        className="absolute inset-0 rounded-xl bg-[#1d4ed8] shadow-[0_8px_20px_-8px_rgba(29,78,216,0.7)] sm:rounded-full"
                                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                                    />
                                )}
                                <Icon aria-hidden="true" className="relative size-4" />
                                <span className="relative whitespace-nowrap">{item.label}</span>
                            </button>
                        )
                    })}
                </div>

                <div
                    id={`${uid}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${uid}-tab-${active}`}
                    tabIndex={0}
                    className={cn('mt-8 rounded-2xl', focusRing)}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={industry.id}
                            className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10"
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                            transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
                        >
                            <div>
                                <p className="max-w-2xl text-lg leading-relaxed text-[#0b1220]/80">{industry.intro}</p>
                                <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#e2e8f0] sm:grid-cols-2">
                                    {industry.services.map((service) => {
                                        const Icon = service.icon
                                        return (
                                            <li key={service.title} className="flex gap-4 bg-white p-5">
                                                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eff4ff] text-[#1d4ed8]">
                                                    <Icon aria-hidden="true" className="size-5" />
                                                </span>
                                                <div>
                                                    <h3 className="text-base font-semibold text-[#0b1220]">{service.title}</h3>
                                                    <p className="mt-1 text-sm leading-snug text-[#0b1220]/60">{service.text}</p>
                                                </div>
                                            </li>
                                        )
                                    })}
                                    <li className="flex flex-col justify-center bg-white p-5">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b1220]/50">Sector lead</p>
                                        <a
                                            href={`#keystone-lead-${industry.id}`}
                                            className={cn(
                                                'group mt-1 inline-flex min-h-10 items-center gap-2 self-start text-base font-semibold text-[#1d4ed8]',
                                                focusRing,
                                            )}
                                        >
                                            Talk to {industry.lead}
                                            <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <article className="relative flex flex-col overflow-hidden rounded-2xl bg-[#1d4ed8] p-6 text-white sm:p-8">
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:32px_32px]"
                                />
                                <p className="relative font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">Case in point</p>
                                <h3 className="relative mt-2 text-lg font-semibold text-white">{industry.case.client}</h3>
                                <p className="relative mt-6 text-6xl font-bold leading-none tracking-[-0.04em] text-white sm:text-7xl">
                                    {industry.case.metric}
                                </p>
                                <p className="relative mt-2 text-sm text-white/80">{industry.case.metricLabel}</p>

                                <div className="relative mt-8 space-y-4">
                                    {[industry.case.before, industry.case.after].map((bar, index) => (
                                        <div key={bar.label}>
                                            <div className="flex items-baseline justify-between text-xs">
                                                <span className="font-mono uppercase tracking-[0.18em] text-white/70">{bar.label}</span>
                                                <span className="font-semibold tabular-nums">{bar.display}</span>
                                            </div>
                                            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/15">
                                                <motion.div
                                                    className={cn('h-full rounded-full', index === 0 ? 'bg-white/45' : 'bg-white')}
                                                    initial={{ width: reduceMotion ? `${(bar.value / peak) * 100}%` : '0%' }}
                                                    animate={{ width: `${(bar.value / peak) * 100}%` }}
                                                    transition={{ duration: reduceMotion ? 0 : 0.8, delay: 0.15 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="relative mt-auto flex flex-wrap items-center justify-between gap-3 pt-8">
                                    <p className="text-xs text-white/70">{industry.case.detail}</p>
                                    <a
                                        href={`#keystone-case-${industry.id}`}
                                        className="group inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-[#1d4ed8] transition-colors hover:bg-[#eff4ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    >
                                        Read the case study
                                        <HiArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    </a>
                                </div>
                            </article>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-[#e2e8f0] pt-6 text-sm text-[#0b1220]/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>Also advising: telecoms, higher education, logistics, insurance and 3 more.</p>
                    <a
                        href="#keystone-sectors"
                        className={cn('inline-flex min-h-10 items-center gap-2 self-start font-semibold text-[#0b1220] hover:text-[#1d4ed8] sm:self-auto', focusRing)}
                    >
                        All 11 sectors
                        <HiArrowLongRight aria-hidden="true" className="size-5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default IndustryTabsServicesGrid

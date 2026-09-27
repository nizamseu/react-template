// MetricWallCaseStudies

// CaseStudies01 · Corporate & Business › Case Studies / Portfolio Preview

// Description:
// A black-and-gold results wall for the fictional strategy firm Arcadia Advisory. Under the
// serif heading "Results you can audit." three case cards each lead with a huge result
// ("+38%", "£212m", "3.2×"), then the KPI it moved, the client, sector and a one-line
// summary, with "Read the case" links and an "All 140 case studies" link. Use it on a
// consultancy home or services page where hard outcomes should sell the work.

// Design:
// - Near-black #0b0b0a section with a soft gold radial glow; gold #b68d40 hairlines, labels
//   and focus rings; metrics use a #ecd49c → #b68d40 gradient clipped to the text
// - Serif display heading text-4xl → md:text-6xl in ivory #f4efe4; metrics are light serif
//   lining/tabular numerals sized to fit the column (4.5rem → sm:5.5 → md:5.25 → lg:5 →
//   xl:6.75rem); mono uppercase meta labels
// - Cards are split by gold hairlines, not boxes: stacked on mobile, metric | story halves
//   on md, three columns with vertical rules from lg; a gold bar grows across the top of
//   the hovered/focused card
// - Each card has a before → after bar pair for its KPI; bars grow when scrolled into view
//   and metrics count up from zero (both skipped with reduced motion)
// - Hovering or focusing one card dims the other two to 45% (lg+); a 3-stat footer strip
//   reflows 1 → sm:3 columns

// What it does:
// - Each metric is a framer-motion value that renders the final figure on the server, resets
//   to zero after mount and animates up once 60% of it is in view (useInView, once)
// - Before/after bars animate scaleX 0 → 1 with whileInView; the real values are always in
//   the text next to them
// - "Read the case" links point to #case-<client-id>; "All 140 case studies" to
//   #arcadia-case-studies; screen readers get the final metric via an sr-only label

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MetricWallCaseStudies from '@/TestComponent/PageSections/corporate/CaseStudies01';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <MetricWallCaseStudies />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const cases = [
    {
        id: 'halden-freight',
        client: 'Halden Freight Group',
        sector: 'Logistics',
        place: 'Leeds, UK',
        period: '2024 · 14 months',
        metric: { value: 38, prefix: '+', suffix: '%', decimals: 0 },
        metricLabel: 'Operating margin',
        kpi: 'EBIT margin',
        before: { label: '9.8%', value: 9.8 },
        after: { label: '13.5%', value: 13.5 },
        max: 15,
        summary:
            'Repriced 2,300 haulage lanes and exited 41 loss-making contracts without losing a single top-20 customer.',
    },
    {
        id: 'vireo-health',
        client: 'Vireo Health Partners',
        sector: 'Healthcare',
        place: 'Manchester, UK',
        period: '2025 · 9 months',
        metric: { value: 212, prefix: '£', suffix: 'm', decimals: 0 },
        metricLabel: 'Working capital released',
        kpi: 'Cash conversion cycle',
        before: { label: '96 days', value: 96 },
        after: { label: '41 days', value: 41 },
        max: 100,
        summary:
            'One procurement playbook for 18 hospitals, with 3,400 high-cost items moved onto supplier consignment.',
    },
    {
        id: 'castell-rowe',
        client: 'Castell & Rowe',
        sector: 'Retail',
        place: 'Edinburgh, UK',
        period: '2023 · 11 months',
        metric: { value: 3.2, prefix: '', suffix: '×', decimals: 1 },
        metricLabel: 'Online revenue in two years',
        kpi: 'Online share of sales',
        before: { label: '11%', value: 11 },
        after: { label: '29%', value: 29 },
        max: 32,
        summary:
            'Turned a 140-year-old department store’s back rooms into same-day fulfilment for 26 branches.',
    },
]

const totals = [
    { value: '£1.4bn', label: 'Audited value created for clients since 2009' },
    { value: '140', label: 'Engagements across 11 sectors and 19 countries' },
    { value: '92%', label: 'Of clients bring us back within three years' },
]

function formatMetric({ prefix, suffix, decimals }, n) {
    return `${prefix}${n.toFixed(decimals)}${suffix}`
}

function CountUpMetric({ metric, reduceMotion }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, amount: 0.6 })
    const value = useMotionValue(metric.value)
    const text = useTransform(value, (n) => formatMetric(metric, n))

    useEffect(() => {
        if (reduceMotion) return
        value.set(0)
    }, [reduceMotion, value])

    useEffect(() => {
        if (!inView || reduceMotion) return undefined
        const controls = animate(value, metric.value, { duration: 1.8, ease: [0.16, 1, 0.3, 1] })
        return () => controls.stop()
    }, [inView, reduceMotion, value, metric.value])

    return (
        <p className="relative">
            <span className="sr-only">{formatMetric(metric, metric.value)}</span>
            <motion.span
                ref={ref}
                aria-hidden="true"
                className="block whitespace-nowrap bg-linear-to-b from-[#ecd49c] to-[#b68d40] bg-clip-text pb-[0.08em] font-serif text-[4.5rem] font-light leading-[0.95] tracking-[-0.04em] text-transparent lining-nums tabular-nums sm:text-[5.5rem] md:text-[5.25rem] lg:text-[5rem] xl:text-[6.75rem]"
            >
                {text}
            </motion.span>
        </p>
    )
}

export function MetricWallCaseStudies({
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
                'relative isolate overflow-hidden bg-[#0b0b0a] px-4 py-20 text-base font-normal text-[#f4efe4] sm:px-6 md:py-28 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(182,141,64,0.18),transparent)]"
            />

            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-7">
                        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[#b68d40]">
                            <span aria-hidden="true" className="h-px w-10 bg-[#b68d40]" />
                            Arcadia Advisory · Outcomes 2023–2025
                        </p>
                        <h2 className="mt-6 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#f4efe4] sm:text-5xl md:text-6xl">
                            Results you can <em className="text-[#d9b774]">audit.</em>
                        </h2>
                    </div>
                    <div className="md:col-span-5 md:justify-self-end">
                        <p className="max-w-sm text-sm leading-relaxed text-[#f4efe4]/65">
                            Every figure below was signed off by the client’s own finance team twelve months
                            after we left. No projections, no “potential value”.
                        </p>
                        <a
                            href="#arcadia-case-studies"
                            className="group/all mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-[#f4efe4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b68d40]"
                        >
                            <span className="border-b border-[#b68d40]/70 pb-0.5">All 140 case studies</span>
                            <HiArrowLongRight
                                aria-hidden="true"
                                className="size-5 text-[#b68d40] transition-transform duration-300 group-hover/all:translate-x-1"
                            />
                        </a>
                    </div>
                </div>

                <ul className="group/wall mt-14 grid border-t border-[#b68d40]/35 md:mt-20 lg:grid-cols-3">
                    {cases.map((item, index) => (
                        <li
                            key={item.id}
                            className={cn(
                                'group/card relative grid border-b border-[#b68d40]/20 py-10 transition-opacity duration-500 md:grid-cols-2 md:gap-x-12 md:py-12 lg:flex lg:flex-col lg:border-b-0 lg:px-8',
                                index > 0 && 'lg:border-l lg:border-l-[#b68d40]/20',
                                index === 0 && 'lg:pl-0',
                                index === cases.length - 1 && 'lg:pr-0',
                                'lg:group-hover/wall:opacity-45 lg:hover:opacity-100! lg:group-focus-within/wall:opacity-45 lg:focus-within:opacity-100!',
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-x-0 -top-px h-[2px] origin-left scale-x-0 bg-[#b68d40] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-x-100 group-focus-within/card:scale-x-100 motion-reduce:transition-none"
                            />

                            <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#f4efe4]/50 md:col-span-2">
                                <span>Case {String(index + 1).padStart(2, '0')}</span>
                                <span>{item.period}</span>
                            </div>

                            <div>
                                <div className="mt-8">
                                    <CountUpMetric metric={item.metric} reduceMotion={reduceMotion} />
                                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.26em] text-[#d9b774]">
                                        {item.metricLabel}
                                    </p>
                                </div>

                                <div className="mt-8 space-y-2.5">
                                    <p className="text-xs text-[#f4efe4]/55">
                                        {item.kpi}
                                        <span className="sr-only">
                                            : {item.before.label} before, {item.after.label} after
                                        </span>
                                    </p>
                                    {[
                                        { key: 'before', tag: 'Before', data: item.before, tone: 'bg-[#f4efe4]/25' },
                                        { key: 'after', tag: 'After', data: item.after, tone: 'bg-[#b68d40]' },
                                    ].map((bar) => (
                                        <div key={bar.key} aria-hidden="true" className="grid grid-cols-[3.25rem_1fr_4rem] items-center gap-3">
                                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4efe4]/45">
                                                {bar.tag}
                                            </span>
                                            <span className="relative h-1.5 overflow-hidden rounded-full bg-[#f4efe4]/8">
                                                <motion.span
                                                    initial={{ scaleX: reduceMotion ? 1 : 0 }}
                                                    whileInView={{ scaleX: 1 }}
                                                    viewport={{ once: true, amount: 0.8 }}
                                                    transition={{ duration: 1.2, delay: bar.key === 'after' ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
                                                    className={cn('absolute inset-y-0 left-0 origin-left rounded-full', bar.tone)}
                                                    style={{ width: `${(bar.data.value / item.max) * 100}%` }}
                                                />
                                            </span>
                                            <span className="text-right font-mono text-xs tabular-nums text-[#f4efe4]/80">
                                                {bar.data.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col md:self-end lg:flex-1 lg:self-auto">
                                <div className="mt-10 border-t border-[#f4efe4]/10 pt-6 md:mt-8 lg:mt-10">
                                    <h3 className="font-serif text-2xl font-normal leading-tight text-[#f4efe4]">
                                        {item.client}
                                    </h3>
                                    <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-[#f4efe4]/50">
                                        {item.sector} · {item.place}
                                    </p>
                                    <p className="mt-4 text-sm leading-relaxed text-[#f4efe4]/75">{item.summary}</p>
                                </div>

                                <a
                                    href={`#case-${item.id}`}
                                    aria-label={`Read the ${item.client} case study`}
                                    className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-8 text-sm font-medium text-[#d9b774] transition-colors hover:text-[#f4efe4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b68d40]"
                                >
                                    Read the case
                                    <HiArrowUpRight
                                        aria-hidden="true"
                                        className="size-4 transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
                                    />
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>

                <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-[#b68d40]/20 sm:grid-cols-3">
                    {totals.map((total) => (
                        <div key={total.value} className="flex flex-col-reverse justify-end gap-2 bg-[#0f0f0d] px-6 py-7">
                            <dt className="text-sm leading-snug text-[#f4efe4]/60">{total.label}</dt>
                            <dd className="font-serif text-4xl font-light tracking-tight text-[#f4efe4] lining-nums">{total.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}

export default MetricWallCaseStudies

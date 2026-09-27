// MetricStripLogoCloud

// LogoCloud02 · SaaS Platforms › Client / Social Proof Bar

// Description:
// A dark, ledger-precise proof section for the finance-ops platform Ledgerly. The heading
// "Trusted by 4,200 finance teams" sits beside a six-logo grid of fictional customers
// (Northbeam, Tidewater, Quarry, Lumos Health, Vantage Labs, Brightloop), and a metric strip
// counts up to "$38.4B reconciled", "72% faster close" and "99.2% auto-matched" when it
// scrolls into view. Use it on fintech or B2B landing pages right after the hero.

// Design:
// - Midnight #0b1220 background with a faint 64px grid and a green #22c55e glow; headings in
//   slate-50 #f8fafc, body in slate-400 #94a3b8, numbers in mono with tabular figures
// - Split layout: lg:grid-cols-12 with copy in 5 columns and the logo grid in 7; the grid
//   is 2 → sm:3 columns with 1px hairlines (gap-px over a white/10 fill) in a rounded-2xl
//   frame
// - Each cell pairs an SVG mark + wordmark with a tiny mono industry tag; hover tints the cell
//   #0f1a2e, turns the logo white and draws a green top rule
// - Metric strip: three columns (stacked below md) split by white/10 dividers, each with a
//   green trend chip, a text-4xl → lg:text-5xl figure and a caption
// - Responsive: copy stacks above the grid until lg, the logo grid gains a column at sm and
//   the metric strip switches from rows to columns at md

// What it does:
// - Figures render their final value on the server; on mount they reset to 0 and animate up
//   with framer-motion animate() once the strip is 40% in view (useInView, once)
// - useReducedMotion() skips the count-up and keeps the final numbers
// - "Read the Northbeam close story" links to #ledgerly-northbeam-story; logos are visual-only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MetricStripLogoCloud from '@/TestComponent/PageSections/saas/LogoCloud02';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <MetricStripLogoCloud />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowLongRight, HiArrowTrendingUp } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const customers = [
    { id: 'northbeam', name: 'Northbeam', industry: 'Logistics', mark: 'beam', type: 'font-sans text-lg font-bold tracking-tight' },
    { id: 'tidewater', name: 'TIDEWATER', industry: 'Marine freight', mark: 'wave', type: 'font-sans text-sm font-extrabold tracking-[0.2em]' },
    { id: 'quarry', name: 'Quarry', industry: 'Building supply', mark: 'block', type: 'font-serif text-xl font-semibold' },
    { id: 'lumos', name: 'Lumos Health', industry: 'Healthcare', mark: 'pulse', type: 'font-sans text-base font-semibold tracking-tight' },
    { id: 'vantage', name: 'vantage labs', industry: 'Biotech', mark: 'prism', type: 'font-mono text-sm font-bold' },
    { id: 'brightloop', name: 'Brightloop', industry: 'Marketplace', mark: 'ring', type: 'font-serif text-lg italic' },
]

const metrics = [
    {
        id: 'volume',
        value: 38.4,
        decimals: 1,
        prefix: '$',
        suffix: 'B',
        label: 'in transactions reconciled on Ledgerly in 2025',
        trend: '+61% YoY',
    },
    {
        id: 'close',
        value: 72,
        decimals: 0,
        prefix: '',
        suffix: '%',
        label: 'faster month-end close, 11 days down to 3 on average',
        trend: '8 days saved',
    },
    {
        id: 'match',
        value: 99.2,
        decimals: 1,
        prefix: '',
        suffix: '%',
        label: 'of bank lines matched automatically, no rules to maintain',
        trend: '1.4M lines / day',
    },
]

function Mark({ mark }) {
    const svg = { viewBox: '0 0 24 24', className: 'h-6 w-6 shrink-0', 'aria-hidden': true }
    switch (mark) {
        case 'beam':
            return (
                <svg {...svg} fill="currentColor">
                    <path d="M12 2 20 20H4Z" opacity="0.35" />
                    <path d="M12 2 16 20H8Z" />
                </svg>
            )
        case 'wave':
            return (
                <svg {...svg} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M2 8c2.5-2 5-2 7.5 0S14.5 10 17 8s3.5-2 5-1M2 14c2.5-2 5-2 7.5 0s5 2 7.5 0 3.5-2 5-1M2 20c2.5-2 5-2 7.5 0s5 2 7.5 0" />
                </svg>
            )
        case 'block':
            return (
                <svg {...svg} fill="currentColor">
                    <rect x="3" y="3" width="8" height="8" rx="1" />
                    <rect x="13" y="3" width="8" height="8" rx="1" opacity="0.5" />
                    <rect x="3" y="13" width="18" height="8" rx="1" />
                </svg>
            )
        case 'pulse':
            return (
                <svg {...svg} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="6" />
                    <path d="M6 12h3l2-4 2 8 2-4h3" />
                </svg>
            )
        case 'prism':
            return (
                <svg {...svg} fill="currentColor">
                    <path d="M12 2 22 20H2Z" opacity="0.4" />
                    <path d="M12 9 17 18H7Z" />
                </svg>
            )
        default:
            return (
                <svg {...svg} fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="8" />
                </svg>
            )
    }
}

function CountUp({ value, decimals, prefix, suffix, start, reduceMotion }) {
    const count = useMotionValue(value)
    const text = useTransform(
        count,
        (current) =>
            `${prefix}${current.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}${suffix}`,
    )

    useEffect(() => {
        if (reduceMotion) {
            count.set(value)
            return undefined
        }
        if (!start) {
            count.set(0)
            return undefined
        }
        const controls = animate(count, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1] })
        return () => controls.stop()
    }, [start, reduceMotion, count, value])

    return <motion.span>{text}</motion.span>
}

export function MetricStripLogoCloud({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const stripRef = useRef(null)
    const inView = useInView(stripRef, { once: true, amount: 0.4 })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0b1220] py-16 text-base font-normal text-[#94a3b8] md:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            />
            <div
                aria-hidden="true"
                className="absolute -left-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#22c55e]/15 blur-3xl"
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
                    <div className="lg:col-span-5">
                        <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-[#22c55e]">
                            <span className="h-2 w-2 rounded-sm bg-[#22c55e]" aria-hidden="true" />
                            Ledgerly · Customers
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#f8fafc] sm:text-5xl">
                            Trusted by <span className="text-[#22c55e]">4,200</span> finance teams
                        </h2>
                        <p className="mt-5 max-w-md text-base leading-relaxed">
                            Controllers, FP&amp;A leads and CFOs, from Series A startups to listed companies,
                            close the books on Ledgerly without the spreadsheet relay race.
                        </p>
                        <a
                            href="#ledgerly-northbeam-story"
                            className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#22c55e]/40 bg-[#22c55e]/10 px-4 text-sm font-semibold text-[#f8fafc] transition-colors hover:bg-[#22c55e] hover:text-[#0b1220] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
                        >
                            Read the Northbeam close story
                            <HiArrowLongRight
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                                aria-hidden="true"
                            />
                        </a>
                    </div>

                    <ul
                        aria-label="Ledgerly customers"
                        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:col-span-7"
                    >
                        {customers.map((customer) => (
                            <li
                                key={customer.id}
                                className="group relative flex h-28 flex-col justify-between bg-[#0b1220] p-4 transition-colors duration-300 hover:bg-[#0f1a2e] sm:h-32 sm:p-5"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[#22c55e] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
                                />
                                <span className="flex min-w-0 items-center gap-2.5 text-[#cbd5e1]/75 transition-colors duration-300 group-hover:text-[#f8fafc]">
                                    <Mark mark={customer.mark} />
                                    <span className={cn('truncate leading-none', customer.type)}>{customer.name}</span>
                                </span>
                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#64748b]">
                                    {customer.industry}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <dl
                    ref={stripRef}
                    className="mt-14 grid divide-y divide-white/10 border-y border-white/10 md:mt-20 md:grid-cols-3 md:divide-x md:divide-y-0"
                >
                    {metrics.map((metric) => (
                        <div key={metric.id} className="flex flex-col gap-3 py-7 md:px-8 md:py-9 md:first:pl-0 md:last:pr-0">
                            <dt className="order-3 max-w-xs text-sm leading-relaxed">{metric.label}</dt>
                            <dd className="order-1 inline-flex items-center gap-1.5 self-start rounded-full bg-[#22c55e]/10 px-2.5 py-1 font-mono text-[11px] font-medium text-[#22c55e]">
                                <HiArrowTrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                                {metric.trend}
                            </dd>
                            <dd className="order-2 font-mono text-4xl font-semibold tabular-nums tracking-tight text-[#f8fafc] lg:text-5xl">
                                <CountUp
                                    value={metric.value}
                                    decimals={metric.decimals}
                                    prefix={metric.prefix}
                                    suffix={metric.suffix}
                                    start={inView}
                                    reduceMotion={reduceMotion}
                                />
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}

export default MetricStripLogoCloud

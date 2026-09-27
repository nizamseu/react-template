// FeatureSplitCaseStudies

// CaseStudies03 · Corporate & Business › Case Studies / Portfolio Preview

// Description:
// A navy-and-signal-orange case file layout for the fictional freight company Meridian
// Logistics. Under "Freight problems, solved in the open." one featured case study fills
// the left (photo with route and headline result, then Challenge / Approach / Result
// columns and a "Read the full case" link), while three more cases wait in a side list.
// Choosing a side case swaps it into the featured slot. Use it on a logistics or B2B
// services site to tell one story in depth while hinting at the rest.

// Design:
// - Navy #0b1f3a section with a faint route-map dot grid, white text, signal orange #ff6b1a
//   for metrics, step numbers, route dots and focus rings; lighter navy #10294b cards
// - lg: two columns (featured 1.65fr, side list 1fr); stacks below lg with the list after
//   the featured case; Challenge / Approach / Result go 1 → sm:3 columns; the side column
//   ends with a 2×2 network stats grid and an "All case files" box
// - Featured photo aspect 4/3 → sm:16/10 with a navy gradient scrim, a mono route chip and
//   a big orange metric; rounded-[24px] cards with 1px white/10 borders
// - Side items: 72 → sm:88px thumbnail, sector, title and metric; hover/focus slides the
//   arrow and lights the border orange; items re-order with framer-motion layout animation
// - Featured content cross-fades and rises in on swap (fade only for reduced motion)

// What it does:
// - active (0–3) holds the featured case; the side list renders the other three as buttons
//   (aria-controls the featured article), clicking one sets it as active, and a "Viewing
//   02 / 04" label tracks which case is featured
// - After a swap, focus moves to the featured article (tabIndex -1, labelled by its title)
//   so keyboard and screen-reader users land on the new content; an aria-live line
//   announces "Now showing …"
// - "Read the full case" links to #case-<id>, "Download PDF" to #case-<id>-pdf and "All case
//   files" to #meridian-case-files

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FeatureSplitCaseStudies from '@/TestComponent/PageSections/corporate/CaseStudies03';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <FeatureSplitCaseStudies />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowRight, HiOutlineDocumentArrowDown } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const cases = [
    {
        id: 'aster-pharma',
        client: 'Aster Pharma',
        sector: 'Pharma · Cold chain',
        title: 'A vaccine lane that never leaves 2–8 °C',
        route: 'Antwerp → Nairobi → Kampala',
        metric: '99.7%',
        metricLabel: 'of shipments kept in range',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=80',
        alt: 'Pipette dispensing pink liquid into rows of sample tubes in a laboratory',
        challenge:
            'Aster was losing 6.1% of temperature-sensitive stock on the final 900 km, mostly while trucks waited at the Malaba border.',
        approach:
            'We pre-cleared customs digitally, added two solar-powered cold hubs and put live loggers on every pallet, alerting drivers’ phones.',
        result:
            'Temperature excursions fell from 6.1% to 0.3% in year one, saving €4.2m in written-off vaccines.',
    },
    {
        id: 'freshway',
        client: 'FreshWay Grocers',
        sector: 'Retail · Grocery',
        title: 'Same-day shelves, fed overnight',
        route: '3 hubs → 212 stores, UK',
        metric: '−31%',
        metricLabel: 'empty truck miles',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80',
        alt: 'Supermarket shelves stacked with fresh fruit and vegetables',
        challenge:
            'Day-time deliveries clashed with shoppers, and a third of FreshWay’s trucks drove home empty after every drop.',
        approach:
            'We moved replenishment to a 22:00–05:00 window and paired store drops with supplier collections on the way back.',
        result:
            'Empty running fell by 31%, 46 trucks were retired and on-shelf availability rose to 98.4%.',
    },
    {
        id: 'lumen-apparel',
        client: 'Lumen Apparel',
        sector: 'E-commerce · Fashion',
        title: 'Returns that come home in four days',
        route: '14 EU markets → Poznań',
        metric: '4.1 days',
        metricLabel: 'average returns loop',
        image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1400&q=80',
        alt: 'Boutique racks of neatly hung clothes ready for resale',
        challenge:
            'Cross-border returns took 19 days to reach the warehouse, so a third of returned stock missed its selling season.',
        approach:
            'We set up consolidation points in six countries and graded items on arrival, so good stock went straight back online.',
        result:
            'The returns loop shrank from 19 to 4.1 days and 72% of returns are resold at full price.',
    },
    {
        id: 'kestrel-aero',
        client: 'Kestrel Aero',
        sector: 'Aerospace · Air freight',
        title: 'Grounded-aircraft parts, anywhere in 18 hours',
        route: 'Toulouse → 64 airports',
        metric: '18 h',
        metricLabel: 'door-to-door for AOG parts',
        image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1400&q=80',
        alt: 'Traveller resting by an airport window as a plane takes off outside',
        challenge:
            'Every hour an airliner sits grounded costs its operator up to $150,000, and Kestrel’s parts took 41 hours on average.',
        approach:
            'We built a 24/7 control tower with on-board couriers on standby and forward stock in Dubai, Singapore and Miami.',
        result:
            'Average delivery dropped to 18 hours, with 93% of parts on the aircraft inside one working day.',
    },
]

const network = [
    { value: '31', label: 'countries with our own trucks or hubs' },
    { value: '97.8%', label: 'on-time delivery across 2025' },
    { value: '1,900', label: 'trucks, 64 cross-dock hubs' },
    { value: '−22%', label: 'CO₂ per tonne-km since 2021' },
]

const steps = [
    { key: 'challenge', label: 'Challenge' },
    { key: 'approach', label: 'Approach' },
    { key: 'result', label: 'Result' },
]

export function FeatureSplitCaseStudies({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState(0)
    const featuredRef = useRef(null)
    const featured = cases[active]
    const others = cases.filter((_, index) => index !== active)

    const choose = (id) => {
        setActive(cases.findIndex((item) => item.id === id))
        featuredRef.current?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0b1f3a] px-4 py-20 text-base font-normal text-white sm:px-6 md:py-28 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-size-[26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-24 -z-10 size-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(255,107,26,0.18),transparent)]"
            />

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.24em] text-white/70">
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#ff6b1a]" />
                            Meridian Logistics · Case files
                        </p>
                        <h2 className="mt-6 text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
                            Freight problems, solved <span className="text-[#ff6b1a]">in the open.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-white/65">
                        Four recent engagements across 31 countries, told with the numbers our customers
                        report to their own boards.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[1.65fr_1fr] lg:gap-10">
                    <article
                        ref={featuredRef}
                        id="meridian-featured-case"
                        tabIndex={-1}
                        aria-labelledby="meridian-featured-title"
                        className="overflow-hidden rounded-[24px] border border-white/10 bg-[#10294b] outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b1a]"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={featured.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                                    <img
                                        src={featured.image}
                                        alt={featured.alt}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0 bg-linear-to-t from-[#0b1f3a] via-[#0b1f3a]/35 to-[#0b1f3a]/10"
                                    />
                                    <span className="absolute left-4 top-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-[#0b1f3a]/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur sm:left-6 sm:top-6 sm:text-[11px]">
                                        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#ff6b1a]" />
                                        <span className="truncate">{featured.route}</span>
                                    </span>
                                    <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                                        <p className="text-5xl font-bold leading-none tracking-[-0.04em] text-[#ff6b1a] sm:text-7xl">
                                            {featured.metric}
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-white/85">{featured.metricLabel}</p>
                                    </div>
                                </div>

                                <div className="p-5 sm:p-8">
                                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
                                        {featured.client} · {featured.sector}
                                    </p>
                                    <h3
                                        id="meridian-featured-title"
                                        className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl"
                                    >
                                        {featured.title}
                                    </h3>

                                    <ol className="mt-8 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-6">
                                        {steps.map((step, index) => (
                                            <li key={step.key} className="relative">
                                                <p className="flex items-center gap-3">
                                                    <span className="grid size-8 place-items-center rounded-full border border-[#ff6b1a] font-mono text-xs text-[#ff6b1a]">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                                                        {step.label}
                                                    </span>
                                                </p>
                                                <p className="mt-3 text-sm leading-relaxed text-white/70">
                                                    {featured[step.key]}
                                                </p>
                                            </li>
                                        ))}
                                    </ol>

                                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                                        <a
                                            href={`#case-${featured.id}`}
                                            className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#ff6b1a] px-6 text-sm font-semibold text-[#0b1f3a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b1a]"
                                        >
                                            Read the full case
                                            <HiArrowLongRight
                                                aria-hidden="true"
                                                className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </a>
                                        <a
                                            href={`#case-${featured.id}-pdf`}
                                            className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-white/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b1a]"
                                        >
                                            <HiOutlineDocumentArrowDown aria-hidden="true" className="size-5 text-[#ff6b1a]" />
                                            Download PDF · 2.4 MB
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </article>

                    <div className="flex flex-col">
                        <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">More case files</h3>
                            <p className="font-mono text-xs text-white/50">
                                Viewing {String(active + 1).padStart(2, '0')} / {String(cases.length).padStart(2, '0')}
                            </p>
                        </div>

                        <ul className="mt-4 flex flex-col gap-3">
                            {others.map((item) => (
                                <motion.li
                                    key={item.id}
                                    layout={!reduceMotion}
                                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <button
                                        type="button"
                                        aria-controls="meridian-featured-case"
                                        className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-[#ff6b1a]/70 hover:bg-white/[0.06] focus-visible:border-[#ff6b1a] focus-visible:outline-none sm:p-4"
                                        onClick={() => choose(item.id)}
                                    >
                                        <span className="relative size-[72px] shrink-0 overflow-hidden rounded-xl sm:size-[88px]">
                                            <img
                                                src={item.image.replace('w=1400', 'w=400')}
                                                alt=""
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                                                {item.sector}
                                            </span>
                                            <span className="mt-1 block text-[15px] font-semibold leading-snug text-white">
                                                {item.title}
                                            </span>
                                            <span className="mt-1.5 block text-sm font-bold text-[#ff6b1a]">
                                                {item.metric}{' '}
                                                <span className="font-normal text-white/60">{item.metricLabel}</span>
                                            </span>
                                        </span>
                                        <HiArrowRight
                                            aria-hidden="true"
                                            className="hidden size-5 shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#ff6b1a] sm:block"
                                        />
                                        <span className="sr-only">, show this case</span>
                                    </button>
                                </motion.li>
                            ))}
                        </ul>

                        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
                            {network.map((stat) => (
                                <div key={stat.label} className="flex flex-col-reverse justify-end gap-1 bg-[#0d2544] p-4">
                                    <dt className="text-xs leading-snug text-white/55">{stat.label}</dt>
                                    <dd className="text-2xl font-bold tracking-tight text-white">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-5 lg:mt-auto">
                            <p className="text-sm leading-relaxed text-white/70">
                                112 more case files across ocean, road, air and contract logistics.
                            </p>
                            <a
                                href="#meridian-case-files"
                                className="group mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white hover:text-[#ff6b1a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b1a]"
                            >
                                All case files
                                <HiArrowLongRight
                                    aria-hidden="true"
                                    className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <p aria-live="polite" className="sr-only">
                    Now showing: {featured.client}, {featured.title}
                </p>
            </div>
        </section>
    )
}

export default FeatureSplitCaseStudies

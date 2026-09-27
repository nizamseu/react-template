// SectorFilterCaseStudies

// CaseStudies04 · Corporate & Business › Case Studies / Portfolio Preview

// Description:
// A filterable case study grid for the fictional management consultancy Keystone
// Consulting. Under "Work that moved the numbers." sector chips (All, Healthcare, Energy,
// Retail, Public sector, Financial services) and a "Newest / Biggest impact" sort re-shuffle
// ten case cards, each with a photo, client, year, title, headline metric and "Read case"
// link, while a label reads e.g. "Showing 2 of 10 case studies". Use it on a consultancy
// work page or as a portfolio preview where visitors look for their own industry.

// Design:
// - White section, ink #0b1220 text, royal blue #1d4ed8 for the active chip, metrics, count
//   badges, the CTA card and focus rings; #f1f3f8 sort track and #e5e8f0 hairlines
// - Chips are pill buttons with a count badge; the sort is a 2-option segmented control; the
//   toolbar wraps on small screens and sits on one line from md
// - Grid 1 → sm:2 → lg:3 columns; cards rounded-[20px] with a 3/2 photo, sector pill on the
//   image, blue metric row and an arrow link; hover lifts the card and zooms the photo; a
//   solid blue CTA card with ring motifs ends the grid and spans 1–2 columns so the last
//   row is always full
// - Cards animate in, out and into new positions with AnimatePresence (popLayout) + layout;
//   with reduced motion the changes are instant
// - Heading is a tight sans text-4xl → md:text-6xl with a blue underline stroke on "moved"

// What it does:
// - sector (string) and sort ("newest" | "impact") state filter and order the list; chips
//   use aria-pressed, the sort is a role="radiogroup" whose arrow keys switch and focus
//   the other option
// - An aria-live count label updates with every change ("Showing 2 of 10 case studies ·
//   Energy")
// - Card links point to #case-<id>; the blue "Don’t see your sector?" card always closes
//   the grid and its "Talk to a partner" link points to #keystone-contact

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SectorFilterCaseStudies from '@/TestComponent/PageSections/corporate/CaseStudies04';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <SectorFilterCaseStudies />
//     </main>
// )
// ```

'use client'

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`

const cases = [
    {
        id: 'st-aldric-trust',
        sector: 'Healthcare',
        client: 'St Aldric NHS Trust',
        year: 2025,
        title: 'Cutting outpatient waits without a single new hire',
        metric: '−43%',
        metricLabel: 'median wait for first appointment',
        impact: 38,
        image: img('1576091160399-112ba8d25d1d'),
        alt: 'Doctor in a white coat checking a smartphone',
    },
    {
        id: 'medivale',
        sector: 'Healthcare',
        client: 'Medivale Clinics',
        year: 2023,
        title: 'One operating-theatre schedule for nine hospitals',
        metric: '+1,900',
        metricLabel: 'extra procedures a year',
        impact: 54,
        image: img('1579684385127-1ef15d508118'),
        alt: 'Surgical team in masks looking down at a patient',
    },
    {
        id: 'nordwind',
        sector: 'Energy',
        client: 'Nordwind Renewables',
        year: 2025,
        title: 'Getting 1.2 GW of wind connected two years early',
        metric: '€310m',
        metricLabel: 'earlier revenue unlocked',
        impact: 310,
        image: img('1466611653911-95081537e5b7'),
        alt: 'Wind turbines silhouetted against an orange sunset',
    },
    {
        id: 'solace-power',
        sector: 'Energy',
        client: 'Solace Power Co.',
        year: 2022,
        title: 'A maintenance model for 4,000 solar sites',
        metric: '99.1%',
        metricLabel: 'fleet availability',
        impact: 72,
        image: img('1509391366360-2e959784a276'),
        alt: 'Rows of solar panels under a cloudy blue sky',
    },
    {
        id: 'harbour-lane',
        sector: 'Retail',
        client: 'Harbour Lane',
        year: 2024,
        title: 'Fewer, better stores for a 90-year-old fashion chain',
        metric: '+6.4 pts',
        metricLabel: 'gross margin',
        impact: 120,
        image: img('1441984904996-e0b6ba687e04'),
        alt: 'Minimal clothing store with a rail of garments and pendant lights',
    },
    {
        id: 'pantry-co',
        sector: 'Retail',
        client: 'Pantry & Co.',
        year: 2023,
        title: 'Pricing 18,000 grocery lines with store-level data',
        metric: '£46m',
        metricLabel: 'annual profit uplift',
        impact: 46,
        image: img('1488459716781-31db52582fe9'),
        alt: 'Market stall piled high with colourful fruit and vegetables',
    },
    {
        id: 'city-of-arden',
        sector: 'Public sector',
        client: 'City of Arden',
        year: 2025,
        title: 'Planning permits in 21 days instead of 94',
        metric: '4.5×',
        metricLabel: 'faster decisions',
        impact: 18,
        image: img('1449824913935-59a10b8d2000'),
        alt: 'Wide city avenue lined with tall office towers',
    },
    {
        id: 'dept-education',
        sector: 'Public sector',
        client: 'Dept. for Schools, Wales',
        year: 2022,
        title: 'Shared back offices for 212 secondary schools',
        metric: '£27m',
        metricLabel: 'returned to classrooms each year',
        impact: 27,
        image: img('1580582932707-520aed937b7b'),
        alt: 'Empty classroom with desks facing a blackboard',
    },
    {
        id: 'meridian-mutual',
        sector: 'Financial services',
        client: 'Meridian Mutual',
        year: 2024,
        title: 'Claims settled in 48 hours for 2.1m policyholders',
        metric: '48 h',
        metricLabel: 'average claim settlement',
        impact: 64,
        image: img('1460925895917-afdab827c52f'),
        alt: 'Laptop on a desk showing colourful analytics charts',
    },
    {
        id: 'granite-bank',
        sector: 'Financial services',
        client: 'Granite Bank',
        year: 2023,
        title: 'Retiring a 1980s core banking system, branch by branch',
        metric: '£88m',
        metricLabel: 'run-cost saved a year',
        impact: 88,
        image: img('1543286386-713bdd548da4'),
        alt: 'Printed line chart on paper beside a ruler and pens',
    },
]

const sectors = ['All', 'Healthcare', 'Energy', 'Retail', 'Public sector', 'Financial services']

const sorts = [
    { id: 'newest', label: 'Newest' },
    { id: 'impact', label: 'Biggest impact' },
]

export function SectorFilterCaseStudies({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [sector, setSector] = useState('All')
    const [sort, setSort] = useState('newest')

    const visible = useMemo(() => {
        const list = sector === 'All' ? cases : cases.filter((item) => item.sector === sector)
        return [...list].sort((a, b) => (sort === 'newest' ? b.year - a.year : b.impact - a.impact))
    }, [sector, sort])

    const countFor = (name) => (name === 'All' ? cases.length : cases.filter((item) => item.sector === name).length)

    const onSortKeyDown = (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
        event.preventDefault()
        const next = sort === 'newest' ? 'impact' : 'newest'
        setSort(next)
        event.currentTarget.parentElement?.querySelector(`[data-sort="${next}"]`)?.focus()
    }

    const cardTransition = reduceMotion
        ? { duration: 0 }
        : { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-20 text-base font-normal text-[#0b1220] sm:px-6 md:py-28 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1d4ed8]">
                            Keystone Consulting · Case studies
                        </p>
                        <h2 className="mt-4 text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-[#0b1220] sm:text-5xl md:text-6xl">
                            Work that{' '}
                            <span className="relative inline-block">
                                moved
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 200 12"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-1.5 left-0 h-2.5 w-full text-[#1d4ed8]"
                                >
                                    <path d="M2 9 C 50 2, 120 2, 198 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>{' '}
                            the numbers.
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[#0b1220]/65 md:col-span-4 md:justify-self-end">
                        Ten engagements from the last four years. Every metric was measured by the client
                        twelve months after go-live.
                    </p>
                </div>

                <div className="mt-10 flex flex-col gap-5 border-y border-[#e5e8f0] py-5 md:mt-14 lg:flex-row lg:items-center lg:justify-between">
                    <div role="group" aria-label="Filter by sector" className="flex flex-wrap gap-2">
                        {sectors.map((name) => {
                            const on = sector === name
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    aria-pressed={on}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]',
                                        on
                                            ? 'border-[#1d4ed8] bg-[#1d4ed8] text-white'
                                            : 'border-[#d9deea] bg-white text-[#0b1220] hover:border-[#1d4ed8]/60 hover:text-[#1d4ed8]',
                                    )}
                                    onClick={() => setSector(name)}
                                >
                                    {name}
                                    <span
                                        className={cn(
                                            'grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
                                            on ? 'bg-white/20 text-white' : 'bg-[#eef2ff] text-[#1d4ed8]',
                                        )}
                                    >
                                        {countFor(name)}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span id="keystone-sort-label" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0b1220]/50">
                            Sort
                        </span>
                        <div
                            role="radiogroup"
                            aria-labelledby="keystone-sort-label"
                            className="inline-flex rounded-full bg-[#f1f3f8] p-1"
                        >
                            {sorts.map((option) => {
                                const on = sort === option.id
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={on}
                                        tabIndex={on ? 0 : -1}
                                        data-sort={option.id}
                                        className={cn(
                                            'min-h-10 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]',
                                            on ? 'bg-white text-[#0b1220] shadow-sm' : 'text-[#0b1220]/60 hover:text-[#0b1220]',
                                        )}
                                        onClick={() => setSort(option.id)}
                                        onKeyDown={onSortKeyDown}
                                    >
                                        {option.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <p aria-live="polite" className="mt-6 text-sm text-[#0b1220]/60">
                    Showing <span className="font-semibold text-[#0b1220]">{visible.length}</span> of {cases.length} case
                    studies{sector !== 'All' && ` · ${sector}`}
                </p>

                <ul className="relative mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {visible.map((item) => (
                            <motion.li
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
                                transition={cardTransition}
                            >
                                <a
                                    href={`#case-${item.id}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e5e8f0] bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(29,78,216,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4ed8] motion-reduce:hover:translate-y-0"
                                >
                                    <div className="relative aspect-[3/2] overflow-hidden bg-[#eef1f7]">
                                        <img
                                            src={item.image}
                                            alt={item.alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                                        />
                                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#0b1220] backdrop-blur">
                                            {item.sector}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <p className="text-xs font-medium text-[#0b1220]/50">
                                            {item.client} · {item.year}
                                        </p>
                                        <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-[#0b1220]">
                                            {item.title}
                                        </h3>
                                        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                                            <p>
                                                <span className="block text-3xl font-bold tracking-[-0.03em] text-[#1d4ed8]">
                                                    {item.metric}
                                                </span>
                                                <span className="mt-0.5 block text-xs text-[#0b1220]/60">{item.metricLabel}</span>
                                            </p>
                                            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#d9deea] text-[#0b1220] transition-colors duration-300 group-hover:border-[#1d4ed8] group-hover:bg-[#1d4ed8] group-hover:text-white">
                                                <HiArrowUpRight aria-hidden="true" className="size-4" />
                                                <span className="sr-only">Read case</span>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </motion.li>
                        ))}
                        <motion.li
                            key="keystone-cta"
                            layout
                            transition={cardTransition}
                            className={cn(
                                visible.length % 2 === 0 ? 'sm:col-span-2' : 'sm:col-span-1',
                                visible.length % 3 === 1 ? 'lg:col-span-2' : 'lg:col-span-1',
                            )}
                        >
                            <div className="relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-[20px] bg-[#1d4ed8] p-6 text-white sm:p-7">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 200 200"
                                    className="pointer-events-none absolute -right-10 -top-10 size-52 text-white/10"
                                >
                                    <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                <div className="relative">
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">14 more sectors</p>
                                    <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white">
                                        Don’t see your sector?
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                                        We have partners from aviation to water. Tell us the problem and we’ll send the
                                        right one within two working days.
                                    </p>
                                </div>
                                <a
                                    href="#keystone-contact"
                                    className="group relative mt-6 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-white px-5 text-sm font-semibold text-[#1d4ed8] transition-colors hover:bg-[#0b1220] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                                >
                                    Talk to a partner
                                    <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </a>
                            </div>
                        </motion.li>
                    </AnimatePresence>
                </ul>

            </div>
        </section>
    )
}

export default SectorFilterCaseStudies

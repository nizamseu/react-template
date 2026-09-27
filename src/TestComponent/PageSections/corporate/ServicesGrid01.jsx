// ExpandRowsServicesGrid

// ServicesGrid01 · Corporate & Business › Services Grid

// Description:
// An editorial services index for the management consultancy Arcadia Advisory: six numbered
// practice rows (01 Strategy & Growth to 06 People & Transformation) under the heading
// "Six practices. One partner who picks up the phone." Opening a row reveals its
// sub-services, lead partner, typical engagement length, a recent result and a "Talk to
// us" link; only one row is open at a time. Use it as the services overview of an
// advisory, legal or professional-services firm.

// Design:
// - Ivory #faf8f3 section, near-black #141311 text and gold #b68d40 for numbers, rules,
//   bullets and the open-row accent; the "Talk to us" pill is black with a gold arrow
// - lg: 4/8 split with a sticky intro column (heading, note, three office cities, deck
//   link) beside the rows; below lg the intro sits on top
// - Rows: gold italic serif numbers, serif titles text-2xl → lg:text-[2.6rem], a one-line
//   summary, and a round +/× toggle; a gold hairline sweeps across the row bottom on hover
//   and stays when the row is open
// - Open panel animates height with AnimatePresence (instant for reduced motion); inside,
//   sub-services list in 1 → sm:2 columns beside a facts card (md: 1fr / 15rem)

// What it does:
// - openId holds the single open row (Strategy & Growth by default); clicking an open row
//   closes it, clicking another swaps it
// - Row toggles are buttons with aria-expanded/aria-controls; panels are role="region"
//   labelled by their button
// - "Talk to us" links to #talk-<practice> (e.g. #talk-strategy); "Download our
//   capabilities deck" links to #arcadia-capabilities

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ExpandRowsServicesGrid from '@/TestComponent/PageSections/corporate/ServicesGrid01';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <ExpandRowsServicesGrid />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const practices = [
    {
        id: 'strategy',
        title: 'Strategy & Growth',
        summary: 'Where to play next, and what to stop doing.',
        subs: ['Corporate & portfolio strategy', 'Market-entry assessments', 'Pricing architecture', 'Board strategy offsites', 'Growth-case modelling', 'Competitor war-gaming'],
        partner: 'Helena Voss',
        length: '8–12 weeks',
        result: 'Refocused a £1.2B packaging group on three core markets; EBITDA up 19% in two years.',
    },
    {
        id: 'deals',
        title: 'Mergers & Acquisitions',
        summary: 'Diligence that reads like a decision, not a data room.',
        subs: ['Commercial due diligence', 'Synergy sizing & tracking', 'Carve-out planning', 'Day-one readiness', 'Post-merger integration', 'Divestment preparation'],
        partner: 'Rafiq Chowdhury',
        length: '3–20 weeks',
        result: 'Carved a £340M logistics division out of its parent with zero missed deliveries.',
    },
    {
        id: 'operations',
        title: 'Operations & Cost',
        summary: 'Fewer handoffs, faster cycles, costs that stay down.',
        subs: ['Zero-based budgeting', 'Procurement & sourcing', 'Lean operations', 'Shared-service design', 'Footprint optimisation', 'Working-capital release'],
        partner: 'Marcus Adeyemi',
        length: '10–16 weeks',
        result: 'Released £62M of working capital for a Midlands manufacturer within one financial year.',
    },
    {
        id: 'capital',
        title: 'Capital & Restructuring',
        summary: 'Calm hands when the balance sheet gets loud.',
        subs: ['Liquidity forecasting', 'Refinancing strategy', 'Turnaround leadership', 'Stakeholder negotiations', 'Covenant resets', 'Interim CFO support'],
        partner: 'Sophie Lindqvist',
        length: '6–26 weeks',
        result: 'Led the turnaround of a 140-site restaurant group through a covenant breach to profit.',
    },
    {
        id: 'governance',
        title: 'Governance & Risk',
        summary: 'Boards that ask better questions, earlier.',
        subs: ['Board effectiveness reviews', 'Enterprise risk frameworks', 'Regulatory readiness', 'Crisis simulations', 'ESG disclosure strategy', 'Audit committee support'],
        partner: 'James Okonkwo',
        length: '4–10 weeks',
        result: 'Rebuilt the risk framework of a listed insurer ahead of a regulator review it passed first time.',
    },
    {
        id: 'people',
        title: 'People & Transformation',
        summary: 'Change that survives the consultants leaving.',
        subs: ['Operating-model design', 'Leadership assessment', 'Culture diagnostics', 'Transformation office', 'Workforce planning', 'Change communications'],
        partner: 'Amara Singh',
        length: '12–30 weeks',
        result: 'Moved 4,800 staff at a regional utility to a new operating model with 91% adoption.',
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]'

export function ExpandRowsServicesGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [openId, setOpenId] = useState(practices[0].id)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#faf8f3] py-16 font-sans text-base font-normal text-[#141311] md:py-24',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-24">
                        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b68d40]">
                            <span aria-hidden="true" className="h-px w-8 bg-[#b68d40]" />
                            Arcadia Advisory · Services
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#141311] sm:text-5xl">
                            Six practices. <em className="text-[#b68d40]">One partner</em> who picks up the phone.
                        </h2>
                        <p className="mt-6 max-w-sm leading-relaxed text-[#141311]/70">
                            Every engagement is led by a named partner from the first call to the final board
                            paper. No hand-offs to a bench, no 90-page decks nobody reads.
                        </p>
                        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[#141311]/55">
                            London · Dhaka · New York · Since 2004
                        </p>
                        <a
                            href="#arcadia-capabilities"
                            className={cn(
                                'group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#141311]',
                                focusRing,
                            )}
                        >
                            <span className="border-b border-[#b68d40] pb-0.5">Download our capabilities deck</span>
                            <HiArrowUpRight aria-hidden="true" className="size-4 text-[#b68d40] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                    </div>
                </div>

                <ul className="border-t border-[#141311] lg:col-span-8">
                    {practices.map((practice, index) => {
                        const open = openId === practice.id
                        const number = String(index + 1).padStart(2, '0')
                        return (
                            <li key={practice.id} className="relative border-b border-[#141311]/15">
                                <h3 className="text-base font-normal text-[#141311]">
                                    <button
                                        type="button"
                                        id={`${uid}-btn-${practice.id}`}
                                        aria-expanded={open}
                                        aria-controls={`${uid}-panel-${practice.id}`}
                                        className={cn(
                                            'group grid w-full grid-cols-[2.25rem_1fr_auto] items-start gap-3 py-6 text-left sm:grid-cols-[3.5rem_1fr_auto] sm:gap-5 sm:py-7',
                                            focusRing,
                                        )}
                                        onClick={() => setOpenId(open ? null : practice.id)}
                                    >
                                        <span className="pt-1.5 font-serif text-lg italic text-[#b68d40] sm:pt-2 sm:text-xl">{number}</span>
                                        <span className="min-w-0">
                                            <span
                                                className={cn(
                                                    'block font-serif text-2xl leading-tight tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-3xl lg:text-[2.6rem]',
                                                    open ? 'text-[#141311]' : 'text-[#141311]/85 group-hover:translate-x-1.5',
                                                )}
                                            >
                                                {practice.title}
                                            </span>
                                            <span className="mt-1.5 block text-sm text-[#141311]/60">{practice.summary}</span>
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'mt-0.5 grid size-11 place-items-center rounded-full border transition-all duration-300',
                                                open
                                                    ? 'rotate-45 border-[#b68d40] bg-[#b68d40] text-[#faf8f3]'
                                                    : 'border-[#141311]/25 text-[#141311] group-hover:border-[#b68d40] group-hover:text-[#b68d40]',
                                            )}
                                        >
                                            <HiPlus className="size-5" />
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'absolute -bottom-px left-0 h-px w-full origin-left bg-[#b68d40] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                                open ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                                            )}
                                        />
                                    </button>
                                </h3>

                                <AnimatePresence initial={false}>
                                    {open && (
                                        <motion.div
                                            key="panel"
                                            id={`${uid}-panel-${practice.id}`}
                                            role="region"
                                            aria-labelledby={`${uid}-btn-${practice.id}`}
                                            className="overflow-hidden"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <div className="grid gap-8 pb-8 sm:pl-[4.75rem] md:grid-cols-[1fr_15rem]">
                                                <ul className="grid min-w-0 gap-x-8 gap-y-3 sm:grid-cols-2">
                                                    {practice.subs.map((sub) => (
                                                        <li key={sub} className="flex items-baseline gap-3 text-[15px] text-[#141311]/85">
                                                            <span aria-hidden="true" className="h-px w-4 shrink-0 translate-y-[-4px] bg-[#b68d40]" />
                                                            {sub}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="border-l border-[#b68d40]/50 pl-5">
                                                    <dl className="space-y-3 text-sm">
                                                        <div>
                                                            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#141311]/50">Lead partner</dt>
                                                            <dd className="mt-0.5 font-serif text-lg">{practice.partner}</dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#141311]/50">Typical engagement</dt>
                                                            <dd className="mt-0.5 font-serif text-lg">{practice.length}</dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#141311]/50">Recently</dt>
                                                            <dd className="mt-0.5 leading-snug text-[#141311]/75">{practice.result}</dd>
                                                        </div>
                                                    </dl>
                                                    <a
                                                        href={`#talk-${practice.id}`}
                                                        className={cn(
                                                            'group/talk mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#141311] px-5 text-sm font-semibold text-[#faf8f3] transition-colors hover:bg-[#2a2723]',
                                                            focusRing,
                                                        )}
                                                    >
                                                        Talk to us
                                                        <HiArrowLongRight aria-hidden="true" className="size-5 text-[#b68d40] transition-transform group-hover/talk:translate-x-1" />
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default ExpandRowsServicesGrid

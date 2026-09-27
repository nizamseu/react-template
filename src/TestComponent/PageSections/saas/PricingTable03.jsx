// ComparisonMatrixPricingTable

// PricingTable03 · SaaS Platforms › Interactive Pricing Table

// Description:
// A full plan-by-plan comparison matrix for the fictional data pipeline platform DataDock.
// Under "Every plan, every limit, side by side." a real <table> compares Free, Pro ($49),
// Team ($249) and Enterprise (custom) across four collapsible groups: Pipelines, Warehouse
// & storage, Governance & security and Support, using checks, dashes and values. Use it below
// summary pricing cards when technical buyers need the fine print.

// Design:
// - White section, slate #0f172a / #64748b text, emerald #059669 accents; a thin emerald
//   top rule on the Team column plus an #ecfdf5 tint down every Team cell
// - Plan header row is sticky (top-0, white/95 with backdrop blur and a bottom hairline) so
//   names, prices and CTAs stay visible while the rows scroll past
// - Group rows are full-width buttons with an uppercase label, feature count and rotating
//   chevron; rows fade/slide in and out with AnimatePresence (plain fade when reduced motion)
// - Values: emerald check in a tinted circle, slate dash for "not included", text values
//   in font-medium tabular-nums; rows get a slate-50 hover and 1px slate-100 dividers
// - Responsive: below md a segmented plan switcher appears and the table shows the feature
//   column plus one plan; from md all four plans show in a table-fixed layout

// What it does:
// - openGroups state (all four open by default): each group button toggles its rows
//   (aria-expanded); "Collapse all" / "Expand all" toggles every group at once
// - mobilePlan state ('team' by default) is set by the switcher buttons (aria-pressed);
//   other plan columns get hidden below md and all reappear from md
// - CTAs link to #datadock-<plan>; "Talk to our data team" points to #datadock-sales

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ComparisonMatrixPricingTable from '@/TestComponent/PageSections/saas/PricingTable03';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <ComparisonMatrixPricingTable />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiCheck, HiChevronDown, HiMinus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const plans = [
    { id: 'free', name: 'Free', price: '$0', note: 'forever', cta: 'Start free' },
    { id: 'pro', name: 'Pro', price: '$49', note: 'per month', cta: 'Start trial' },
    { id: 'team', name: 'Team', price: '$249', note: 'per month', cta: 'Start trial', popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', note: 'annual contract', cta: 'Contact sales' },
]

const groups = [
    {
        id: 'pipelines',
        name: 'Pipelines',
        rows: [
            { label: 'Source connectors', values: ['5', '150+', '300+', '300+ & custom'] },
            { label: 'Sync frequency', values: ['Every 24 h', 'Every 1 h', 'Every 5 min', 'Real-time CDC'] },
            { label: 'Monthly active rows', values: ['500K', '10M', '100M', 'Unlimited'] },
            { label: 'Historical backfill', values: [false, true, true, true] },
            { label: 'SQL transformations', values: [false, true, true, true] },
        ],
    },
    {
        id: 'warehouse',
        name: 'Warehouse & storage',
        rows: [
            { label: 'Destinations', values: ['1', '3', 'Unlimited', 'Unlimited'] },
            { label: 'Sync log retention', values: ['7 days', '90 days', '1 year', 'Custom'] },
            { label: 'Reverse ETL', values: [false, false, true, true] },
            { label: 'Bring your own cloud', values: [false, false, false, true] },
        ],
    },
    {
        id: 'governance',
        name: 'Governance & security',
        rows: [
            { label: 'Role-based access', values: [false, true, true, true] },
            { label: 'SAML SSO & SCIM', values: [false, false, true, true] },
            { label: 'Audit log', values: [false, '30 days', '1 year', 'Unlimited'] },
            { label: 'Column-level masking', values: [false, false, true, true] },
            { label: 'HIPAA BAA', values: [false, false, false, true] },
        ],
    },
    {
        id: 'support',
        name: 'Support',
        rows: [
            { label: 'Community forum', values: [true, true, true, true] },
            { label: 'Email response time', values: [false, '48 h', '8 h', '1 h'] },
            { label: 'Shared support channel', values: [false, false, true, true] },
            { label: 'Uptime SLA', values: [false, false, '99.9%', '99.99%'] },
        ],
    },
]

const allGroupIds = groups.map((g) => g.id)

function Value({ value }) {
    if (value === true) {
        return (
            <span className="inline-grid size-6 place-items-center rounded-full bg-[#059669]/10 text-[#059669]">
                <HiCheck aria-hidden="true" className="size-4" />
                <span className="sr-only">Included</span>
            </span>
        )
    }
    if (value === false) {
        return (
            <span className="inline-grid size-6 place-items-center text-[#cbd5e1]">
                <HiMinus aria-hidden="true" className="size-4" />
                <span className="sr-only">Not included</span>
            </span>
        )
    }
    return <span className="font-medium tabular-nums text-[#0f172a]">{value}</span>
}

export function ComparisonMatrixPricingTable({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [openGroups, setOpenGroups] = useState(allGroupIds)
    const [mobilePlan, setMobilePlan] = useState('team')
    const reduceMotion = useReducedMotion()
    const switcherLabelId = useId()
    const allOpen = openGroups.length === allGroupIds.length

    const toggleGroup = (id) =>
        setOpenGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))

    const colClass = (plan) =>
        cn(plan.id === mobilePlan ? 'table-cell' : 'hidden md:table-cell', plan.popular && 'bg-[#ecfdf5]/70')

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
                    <div>
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#059669]">
                            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
                                <rect x="2" y="3" width="16" height="4" rx="1.5" fill="currentColor" />
                                <rect x="2" y="9" width="16" height="4" rx="1.5" fill="currentColor" opacity="0.6" />
                                <rect x="2" y="15" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
                            </svg>
                            DataDock · Compare plans
                        </p>
                        <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#0f172a] sm:text-5xl">
                            Every plan, every limit, side by side.
                        </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-[#64748b] md:justify-self-end md:text-right">
                        All plans include unlimited users and SOC 2 Type II infrastructure. Pay monthly, or save 17%
                        with an annual commitment.
                    </p>
                </div>

                <div className="mt-10 md:hidden">
                    <p id={switcherLabelId} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">
                        Show plan
                    </p>
                    <div
                        role="group"
                        aria-labelledby={switcherLabelId}
                        className="mt-2 grid grid-cols-4 gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1"
                    >
                        {plans.map((plan) => (
                            <button
                                key={plan.id}
                                type="button"
                                aria-pressed={mobilePlan === plan.id}
                                className={cn(
                                    'min-h-11 rounded-xl px-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]',
                                    mobilePlan === plan.id
                                        ? 'bg-white text-[#059669] shadow-sm ring-1 ring-slate-200'
                                        : 'text-[#64748b] hover:text-[#0f172a]',
                                )}
                                onClick={() => setMobilePlan(plan.id)}
                            >
                                {plan.name}
                            </button>
                        ))}
                    </div>
                </div>

                <table className="mt-6 w-full table-fixed border-separate border-spacing-0 text-left text-sm md:mt-12">
                    <caption className="sr-only">DataDock plan comparison: features by plan</caption>
                    <colgroup>
                        <col className="w-[54%] md:w-[28%]" />
                        {plans.map((plan, i) => (
                            <col key={plan.id} className={cn(i > 0 && 'w-0 md:w-auto')} />
                        ))}
                    </colgroup>
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 py-4 pr-3 align-bottom backdrop-blur"
                            >
                                <span className="sr-only">Feature</span>
                                <button
                                    type="button"
                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg text-xs font-semibold text-[#059669] hover:text-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]"
                                    onClick={() => setOpenGroups(allOpen ? [] : allGroupIds)}
                                >
                                    <HiChevronDown
                                        aria-hidden="true"
                                        className={cn('size-4 transition-transform duration-300', allOpen && 'rotate-180')}
                                    />
                                    {allOpen ? 'Collapse all' : 'Expand all'}
                                </button>
                            </th>
                            {plans.map((plan) => (
                                <th
                                    key={plan.id}
                                    scope="col"
                                    className={cn(
                                        'sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-2 py-4 align-bottom font-normal backdrop-blur md:px-3',
                                        colClass(plan),
                                        plan.popular && 'bg-[#ecfdf5]/95 shadow-[inset_0_3px_0_#059669]',
                                    )}
                                >
                                    {plan.popular && (
                                        <span className="mb-2 inline-block rounded-full bg-[#059669] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                            Most popular
                                        </span>
                                    )}
                                    <span className="block text-base font-semibold text-[#0f172a]">{plan.name}</span>
                                    <span className="mt-1 block text-2xl font-semibold tracking-tight tabular-nums text-[#0f172a] lg:text-3xl">
                                        {plan.price}
                                    </span>
                                    <span className="block text-xs text-[#64748b]">{plan.note}</span>
                                    <a
                                        href={`#datadock-${plan.id}`}
                                        className={cn(
                                            'mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]',
                                            plan.popular
                                                ? 'bg-[#059669] text-white hover:bg-[#047857]'
                                                : 'border border-slate-200 text-[#0f172a] hover:border-[#059669] hover:text-[#059669]',
                                        )}
                                    >
                                        {plan.cta}
                                    </a>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {groups.map((group) => {
                        const open = openGroups.includes(group.id)
                        return (
                            <tbody key={group.id}>
                                <tr>
                                    <th scope="colgroup" colSpan={plans.length + 1} className="p-0 pt-6">
                                        <button
                                            type="button"
                                            aria-expanded={open}
                                            className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 text-left transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] md:px-4"
                                            onClick={() => toggleGroup(group.id)}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f172a]">
                                                    {group.name}
                                                </span>
                                                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-[#64748b] ring-1 ring-slate-200">
                                                    {group.rows.length} features
                                                </span>
                                            </span>
                                            <HiChevronDown
                                                aria-hidden="true"
                                                className={cn(
                                                    'size-5 shrink-0 text-[#64748b] transition-transform duration-300',
                                                    open && 'rotate-180',
                                                )}
                                            />
                                        </button>
                                    </th>
                                </tr>
                                <AnimatePresence initial={false}>
                                    {open &&
                                        group.rows.map((row, index) => (
                                            <motion.tr
                                                key={row.label}
                                                initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                                                transition={{ duration: 0.25, delay: reduceMotion ? 0 : index * 0.03 }}
                                                className="group/row"
                                            >
                                                <th
                                                    scope="row"
                                                    className="border-b border-slate-100 py-3.5 pr-3 font-normal text-[#334155] group-hover/row:bg-slate-50"
                                                >
                                                    {row.label}
                                                </th>
                                                {plans.map((plan, i) => (
                                                    <td
                                                        key={plan.id}
                                                        className={cn(
                                                            'border-b border-slate-100 px-2 py-3.5 text-center group-hover/row:bg-slate-50 md:px-3',
                                                            colClass(plan),
                                                            plan.popular && 'group-hover/row:bg-[#d1fae5]/70',
                                                        )}
                                                    >
                                                        <Value value={row.values[i]} />
                                                    </td>
                                                ))}
                                            </motion.tr>
                                        ))}
                                </AnimatePresence>
                            </tbody>
                        )
                    })}
                </table>

                <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-[#0f172a] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <p className="text-lg font-semibold text-white">Syncing more than 100M rows a month?</p>
                        <p className="mt-1 text-sm text-white/70">
                            Volume pricing, private networking and a named solutions engineer.
                        </p>
                    </div>
                    <a
                        href="#datadock-sales"
                        className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#059669] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#10b981] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Talk to our data team
                        <HiArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default ComparisonMatrixPricingTable

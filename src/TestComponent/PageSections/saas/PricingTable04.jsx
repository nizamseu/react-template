// UsageEstimatorPricingTable

// PricingTable04 · SaaS Platforms › Interactive Pricing Table

// Description:
// A loud, neo-brutalist usage calculator for the fictional email API Sendwave. Under
// "Estimate your send." a stepped slider picks monthly volume (10K to 5M emails) and four
// add-on checkboxes (Dedicated IP, Inbound parsing, 30-day logs, Deliverability insights)
// feed a receipt-style estimate. Starter, Growth and Scale cards show their cost at that
// volume and a "Best fit" sticker jumps to the cheapest plan. Use it for usage-based APIs.

// Design:
// - Sunshine #ffde59 section, black #0a0a0a ink, 3px black borders, hard offset shadows
//   (3–8px, no blur) and white panels; pink #ff90e8 for stickers and the best-fit shadow
// - Heavy uppercase sans (font-black, tight tracking) for headings and numbers; slider
//   has a black track, yellow fill and a square yellow thumb with a black border
// - Receipt panel: black title bar, dashed dividers, line items in tabular-nums and a
//   huge total that pops (scale + fade) whenever it changes
// - The main CTA "presses" on hover (shifts 3px, shadow shrinks) and checked add-on cards
//   sit pressed in; the "Best fit" sticker glides between plan cards with a shared layoutId
// - Responsive: estimator and receipt stack until lg (7/5 split); plan cards 1 → sm:3
//   columns; slider tick labels show every other step below sm

// What it does:
// - step state (index 3 = 100,000 emails) is set by the range input; addOns state (Set of
//   ids, "logs" on by default) is toggled by the checkboxes
// - cost = base + (emails − included) / 1,000 × overage rate + add-ons; Starter caps at
//   100K and is excluded above it; Dedicated IP is free on Scale; the cheapest plan wins
// - The receipt and main CTA follow the recommended plan; CTAs link to
//   #sendwave-<plan>; an sr-only aria-live line reads the recommendation and total

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import UsageEstimatorPricingTable from '@/TestComponent/PageSections/saas/PricingTable04';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <UsageEstimatorPricingTable />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiCheck } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const steps = [10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000]
const stepLabels = ['10K', '25K', '50K', '100K', '250K', '500K', '1M', '2.5M', '5M']

const plans = [
    { id: 'starter', name: 'Starter', base: 15, included: 10000, rate: 1, cap: 100000, tag: 'Side projects' },
    { id: 'growth', name: 'Growth', base: 49, included: 100000, rate: 0.6, tag: 'Scaling SaaS' },
    { id: 'scale', name: 'Scale', base: 249, included: 1000000, rate: 0.35, tag: 'High volume', freeIp: true },
]

const addOnList = [
    { id: 'ip', name: 'Dedicated IP', price: 30, note: 'Warm-up included · free on Scale' },
    { id: 'inbound', name: 'Inbound parsing', price: 10, note: 'Turn replies into webhooks' },
    { id: 'logs', name: '30-day logs', price: 20, note: 'Search every event for a month' },
    { id: 'insights', name: 'Deliverability insights', price: 25, note: 'Inbox placement & DMARC reports' },
]

const fmtNum = (n) => n.toLocaleString('en-US')
const fmtMoney = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
const round2 = (n) => Math.round(n * 100) / 100

function priceFor(plan, emails, addOns) {
    const overage = round2((Math.max(0, emails - plan.included) / 1000) * plan.rate)
    const extras = addOnList
        .filter((a) => addOns.has(a.id))
        .map((a) => ({ ...a, cost: a.id === 'ip' && plan.freeIp ? 0 : a.price }))
    const total = round2(plan.base + overage + extras.reduce((sum, a) => sum + a.cost, 0))
    return { overage, extras, total, eligible: !plan.cap || emails <= plan.cap }
}

export function UsageEstimatorPricingTable({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [step, setStep] = useState(3)
    const [addOns, setAddOns] = useState(() => new Set(['logs']))
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const emails = steps[step]
    const fill = (step / (steps.length - 1)) * 100

    const quotes = plans.map((plan) => ({ plan, ...priceFor(plan, emails, addOns) }))
    const best = quotes.filter((q) => q.eligible).reduce((a, b) => (b.total < a.total ? b : a))

    const toggleAddOn = (id) =>
        setAddOns((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#ffde59] px-4 py-16 text-base font-normal text-[#0a0a0a] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="inline-block border-[3px] border-[#0a0a0a] bg-[#0a0a0a] px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#ffde59]">
                            Sendwave · Email API pricing
                        </p>
                        <h2 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[#0a0a0a] sm:text-6xl lg:text-7xl">
                            Estimate
                            <br />
                            your send.
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 md:flex-col md:items-end">
                        <span className="rotate-[-4deg] border-[3px] border-[#0a0a0a] bg-[#ff90e8] px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0_#0a0a0a]">
                            No surprise overages
                        </span>
                        <p className="max-w-xs text-sm font-medium leading-relaxed md:text-right">
                            Slide to your monthly volume, tick what you need, and we will point at the cheapest plan.
                        </p>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                    <div className="rounded-[14px] border-[3px] border-[#0a0a0a] bg-white p-5 shadow-[8px_8px_0_#0a0a0a] sm:p-8 lg:col-span-7">
                        <label htmlFor={`${uid}-volume`} className="font-mono text-xs font-bold uppercase tracking-[0.2em]">
                            Emails per month
                        </label>
                        <p className="mt-2 text-5xl font-black leading-none tracking-tighter tabular-nums sm:text-6xl">
                            {fmtNum(emails)}
                        </p>

                        <input
                            id={`${uid}-volume`}
                            type="range"
                            min={0}
                            max={steps.length - 1}
                            step={1}
                            value={step}
                            aria-valuetext={`${fmtNum(emails)} emails per month`}
                            style={{
                                background: `linear-gradient(to right, #ffde59 0%, #ffde59 ${fill}%, #0a0a0a ${fill}%, #0a0a0a 100%)`,
                            }}
                            className="mt-8 h-4 w-full cursor-pointer appearance-none rounded-none border-[3px] border-[#0a0a0a] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a] [&::-moz-range-thumb]:size-8 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#0a0a0a] [&::-moz-range-thumb]:bg-[#ffde59] [&::-webkit-slider-thumb]:size-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#0a0a0a] [&::-webkit-slider-thumb]:bg-[#ffde59] [&::-webkit-slider-thumb]:shadow-[3px_3px_0_#0a0a0a]"
                            onChange={(e) => setStep(Number(e.target.value))}
                        />
                        <div aria-hidden="true" className="mt-3 flex justify-between font-mono text-[10px] font-bold sm:text-xs">
                            {stepLabels.map((label, i) => (
                                <span
                                    key={label}
                                    className={cn(
                                        i % 2 === 1 && 'hidden sm:inline',
                                        i === step ? 'text-[#0a0a0a]' : 'text-[#0a0a0a]/45',
                                    )}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>

                        <fieldset className="mt-10">
                            <legend className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Add-ons</legend>
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {addOnList.map((addOn) => {
                                    const checked = addOns.has(addOn.id)
                                    return (
                                        <label
                                            key={addOn.id}
                                            className={cn(
                                                'relative flex min-h-16 cursor-pointer items-start gap-3 rounded-[10px] border-[3px] border-[#0a0a0a] p-3 transition-[transform,box-shadow,background-color] duration-150 has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0a0a0a]',
                                                checked
                                                    ? 'translate-x-[3px] translate-y-[3px] bg-[#ffde59] shadow-none'
                                                    : 'bg-white shadow-[3px_3px_0_#0a0a0a] hover:bg-[#fff6c9]',
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                className="sr-only"
                                                onChange={() => toggleAddOn(addOn.id)}
                                            />
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'mt-0.5 grid size-6 shrink-0 place-items-center border-[3px] border-[#0a0a0a]',
                                                    checked ? 'bg-[#0a0a0a] text-[#ffde59]' : 'bg-white',
                                                )}
                                            >
                                                {checked && <HiCheck className="size-4" />}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-baseline justify-between gap-2">
                                                    <span className="text-sm font-black uppercase leading-tight">{addOn.name}</span>
                                                    <span className="shrink-0 font-mono text-xs font-bold">+${addOn.price}</span>
                                                </span>
                                                <span className="mt-1 block text-xs font-medium text-[#0a0a0a]/70">{addOn.note}</span>
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        </fieldset>
                    </div>

                    <div className="flex flex-col overflow-hidden rounded-[14px] border-[3px] border-[#0a0a0a] bg-white shadow-[8px_8px_0_#0a0a0a] lg:col-span-5">
                        <div className="flex items-center justify-between gap-3 border-b-[3px] border-[#0a0a0a] bg-[#0a0a0a] px-5 py-3 text-[#ffde59]">
                            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Your estimate</p>
                            <p className="font-mono text-xs font-bold uppercase">Monthly</p>
                        </div>
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                            <p className="text-sm font-medium">Recommended plan</p>
                            <h3 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">
                                {best.plan.name}
                            </h3>

                            <dl className="mt-6 space-y-3 border-t-[3px] border-dashed border-[#0a0a0a] pt-5 font-mono text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt>Base · {fmtNum(best.plan.included)} incl.</dt>
                                    <dd className="font-bold tabular-nums">{fmtMoney(best.plan.base)}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt>
                                        Overage
                                        {best.overage > 0 && (
                                            <span className="block text-xs text-[#0a0a0a]/60">
                                                {fmtNum(emails - best.plan.included)} × ${best.plan.rate.toFixed(2)}/1K
                                            </span>
                                        )}
                                    </dt>
                                    <dd className="font-bold tabular-nums">{fmtMoney(best.overage)}</dd>
                                </div>
                                {best.extras.map((extra) => (
                                    <div key={extra.id} className="flex justify-between gap-4">
                                        <dt>{extra.name}</dt>
                                        <dd className="font-bold tabular-nums">
                                            {extra.cost === 0 ? 'Included' : fmtMoney(extra.cost)}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <div className="mt-6 flex items-end justify-between gap-4 border-t-[3px] border-[#0a0a0a] pt-5">
                                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Total</p>
                                <div className="relative overflow-hidden">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.p
                                            key={best.total}
                                            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.1 }}
                                            transition={{ duration: 0.2 }}
                                            className="origin-right text-5xl font-black leading-none tracking-tighter tabular-nums"
                                        >
                                            {fmtMoney(best.total)}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>
                            </div>

                            <a
                                href={`#sendwave-${best.plan.id}`}
                                className="group mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border-[3px] border-[#0a0a0a] bg-[#ffde59] px-5 text-sm font-black uppercase shadow-[4px_4px_0_#0a0a0a] transition-[transform,box-shadow] duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[1px_1px_0_#0a0a0a] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a] active:shadow-none"
                            >
                                Start with {best.plan.name}
                                <HiArrowRight aria-hidden="true" className="size-4" />
                            </a>
                            <p className="mt-3 text-center text-xs font-medium text-[#0a0a0a]/70">
                                3,000 free test emails a month on every plan.
                            </p>
                        </div>
                    </div>
                </div>

                <p aria-live="polite" className="sr-only">
                    {`${fmtNum(emails)} emails: ${best.plan.name} is the best fit at ${fmtMoney(best.total)} a month`}
                </p>

                <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {quotes.map(({ plan, total, eligible }) => {
                        const isBest = plan.id === best.plan.id
                        return (
                            <li
                                key={plan.id}
                                className={cn(
                                    'relative rounded-[14px] border-[3px] border-[#0a0a0a] p-5 transition-colors duration-200',
                                    isBest ? 'bg-[#0a0a0a] text-[#ffde59] shadow-[6px_6px_0_#ff90e8]' : 'bg-white shadow-[6px_6px_0_#0a0a0a]',
                                    !eligible && 'bg-[repeating-linear-gradient(135deg,#fff_0_10px,#f3f3f3_10px_20px)]',
                                )}
                            >
                                {isBest && (
                                    <motion.span
                                        layoutId={`${uid}-best-fit`}
                                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                                        className="absolute -right-3 -top-4 rotate-6 border-[3px] border-[#0a0a0a] bg-[#ff90e8] px-3 py-1 text-xs font-black uppercase text-[#0a0a0a] shadow-[3px_3px_0_#0a0a0a]"
                                    >
                                        Best fit
                                    </motion.span>
                                )}
                                <p className={cn('font-mono text-[11px] font-bold uppercase tracking-[0.2em]', isBest ? 'text-[#ffde59]/70' : 'text-[#0a0a0a]/60')}>
                                    {plan.tag}
                                </p>
                                <h3 className={cn('mt-1 text-2xl font-black uppercase tracking-tight', isBest ? 'text-[#ffde59]' : 'text-[#0a0a0a]')}>
                                    {plan.name}
                                </h3>
                                <p className="mt-3 font-mono text-xs leading-relaxed">
                                    ${plan.base}/mo · {fmtNum(plan.included)} incl.
                                    <br />
                                    then ${plan.rate.toFixed(2)} per 1K
                                    {plan.cap ? ` · max ${fmtNum(plan.cap)}` : ''}
                                </p>
                                <p className="mt-4 border-t-[3px] border-dashed border-current pt-3">
                                    {eligible ? (
                                        <>
                                            <span className="text-3xl font-black tracking-tighter tabular-nums">{fmtMoney(total)}</span>
                                            <span className="ml-1 text-xs font-bold uppercase">at this volume</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-black uppercase">Over the 100K limit</span>
                                    )}
                                </p>
                                {eligible && !isBest && (
                                    <a
                                        href={`#sendwave-${plan.id}`}
                                        className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-black uppercase underline decoration-[3px] underline-offset-4 hover:decoration-[#ff90e8] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a]"
                                    >
                                        Pick {plan.name}
                                    </a>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default UsageEstimatorPricingTable

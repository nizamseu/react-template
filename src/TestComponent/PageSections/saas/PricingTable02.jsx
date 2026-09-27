// SeatSliderPricingTable

// PricingTable02 · SaaS Platforms › Interactive Pricing Table

// Description:
// A dark, calculator-style pricing section for the fictional shift-scheduling app Teamline.
// Under "Pay for the seats you fill. Nothing else." a seat slider (1–200) with +/- steppers
// and quick picks drives a 200-dot seat map and live monthly totals for Essentials ($6),
// Growth ($11) and Scale ($17) per seat. Past 50 seats a "Volume pricing unlocked" note
// appears. Use it wherever price scales with headcount and buyers want to see the maths.

// Design:
// - Near-black #111827 section, violet #8b5cf6 accent with #c4b5fd highlights, white and
//   #9ca3af text; a blurred violet glow sits behind the calculator panel
// - Left panel: rounded-[32px] #1f2937 card, huge tabular seat count (text-7xl), custom
//   range input (violet filled track, white thumb with violet ring) and a 20×10 dot map
//   where seats 51+ light up in lilac to show the discounted band
// - Right: stacked plan rows (rounded-3xl, hairline #374151 borders); Growth has a violet
//   border, glow and "Best value" chip; totals count up/down with framer-motion animate()
// - Discount note slides open with AnimatePresence; Essentials dims with a cap notice
//   above 25 seats
// - Responsive: stacks on mobile and md, 5/7 split on lg; rows put price under the copy
//   below sm and to the right from sm; dot map keeps 20 columns (dots shrink on mobile)

// What it does:
// - seats state (48 by default) changes via the range input, the -/+ buttons (clamped to
//   1–200) and quick-pick chips (10 / 25 / 50 / 100 / 200)
// - Totals: price × first 50 seats + price × 0.85 × seats above 50; per-seat average and
//   monthly saving are derived from the same function
// - Essentials is unavailable above 25 seats (row dimmed, CTA replaced by a note); plan CTAs
//   link to #teamline-start-<plan>; an sr-only aria-live line reads the Growth total

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SeatSliderPricingTable from '@/TestComponent/PageSections/saas/PricingTable02';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <SeatSliderPricingTable />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowRight, HiCheck, HiMinus, HiPlus, HiOutlineSparkles } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const MIN_SEATS = 1
const MAX_SEATS = 200
const VOLUME_FROM = 50
const VOLUME_RATE = 0.85

const plans = [
    {
        id: 'essentials',
        name: 'Essentials',
        price: 6,
        cap: 25,
        pitch: 'Rotas, shift swaps and team chat for a single site.',
        features: ['Drag-and-drop rota', 'Shift swap requests', 'Team chat'],
    },
    {
        id: 'growth',
        name: 'Growth',
        price: 11,
        best: true,
        pitch: 'Multi-site scheduling with time clocks and payroll export.',
        features: ['Everything in Essentials', 'GPS time clock', 'Payroll export', 'Labour cost forecasts'],
    },
    {
        id: 'scale',
        name: 'Scale',
        price: 17,
        pitch: 'Advanced compliance, SSO and a dedicated success manager.',
        features: ['Everything in Growth', 'Break & overtime rules', 'SAML SSO', 'Named CSM'],
    },
]

const quickPicks = [10, 25, 50, 100, 200]

const dots = Array.from({ length: MAX_SEATS }, (_, i) => i)

const clamp = (n) => Math.min(MAX_SEATS, Math.max(MIN_SEATS, n))

const monthlyTotal = (price, seats) =>
    price * Math.min(seats, VOLUME_FROM) + price * VOLUME_RATE * Math.max(0, seats - VOLUME_FROM)

const formatMoney = (v) => `$${Math.round(v).toLocaleString('en-US')}`

function Ticker({ value, className }) {
    const reduceMotion = useReducedMotion()
    const mv = useMotionValue(value)
    const text = useTransform(mv, formatMoney)

    useEffect(() => {
        if (reduceMotion) {
            mv.set(value)
            return undefined
        }
        const controls = animate(mv, value, { duration: 0.5, ease: [0.22, 1, 0.36, 1] })
        return () => controls.stop()
    }, [mv, value, reduceMotion])

    return <motion.span className={className}>{text}</motion.span>
}

export function SeatSliderPricingTable({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [seats, setSeats] = useState(48)
    const reduceMotion = useReducedMotion()
    const sliderId = useId()
    const fill = ((seats - MIN_SEATS) / (MAX_SEATS - MIN_SEATS)) * 100
    const discounted = seats > VOLUME_FROM
    const growth = plans[1]
    const growthSaving = growth.price * seats - monthlyTotal(growth.price, seats)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#111827] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="absolute -left-40 top-40 -z-10 size-[520px] rounded-full bg-[#8b5cf6]/25 blur-[120px]"
            />

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c4b5fd]">
                            Teamline · Per-seat pricing
                        </p>
                        <h2 className="mt-4 text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Pay for the seats you fill.{' '}
                            <span className="text-[#8b5cf6]">Nothing else.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[#9ca3af]">
                        Drag to your team size. Every seat past 50 is billed at 15% off automatically, and you only
                        pay for people who clock in that month.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                    <div className="rounded-[32px] border border-white/10 bg-[#1f2937] p-5 shadow-[0_40px_80px_-40px_rgba(139,92,246,0.55)] sm:p-8 lg:col-span-5">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <label
                                    htmlFor={sliderId}
                                    className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9ca3af]"
                                >
                                    Team size
                                </label>
                                <p className="mt-2 flex items-baseline gap-2">
                                    <output
                                        htmlFor={sliderId}
                                        className="text-6xl font-bold leading-none tracking-tight tabular-nums text-white sm:text-7xl"
                                    >
                                        {seats}
                                    </output>
                                    <span className="text-lg text-[#9ca3af]">{seats === 1 ? 'seat' : 'seats'}</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    aria-label="Remove a seat"
                                    disabled={seats <= MIN_SEATS}
                                    className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6] disabled:opacity-40"
                                    onClick={() => setSeats((s) => clamp(s - 1))}
                                >
                                    <HiMinus aria-hidden="true" className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Add a seat"
                                    disabled={seats >= MAX_SEATS}
                                    className="grid size-11 place-items-center rounded-full bg-[#8b5cf6] text-white transition-colors hover:bg-[#7c3aed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd] disabled:opacity-40"
                                    onClick={() => setSeats((s) => clamp(s + 1))}
                                >
                                    <HiPlus aria-hidden="true" className="size-4" />
                                </button>
                            </div>
                        </div>

                        <input
                            id={sliderId}
                            type="range"
                            min={MIN_SEATS}
                            max={MAX_SEATS}
                            step={1}
                            value={seats}
                            aria-valuetext={`${seats} ${seats === 1 ? 'seat' : 'seats'}`}
                            style={{
                                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${fill}%, #374151 ${fill}%, #374151 100%)`,
                            }}
                            className="mt-8 h-2 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#8b5cf6] [&::-moz-range-thumb]:size-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#8b5cf6] [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#8b5cf6] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_6px_rgba(139,92,246,0.25)]"
                            onChange={(e) => setSeats(clamp(Number(e.target.value)))}
                        />
                        <div className="mt-3 flex justify-between text-[11px] font-medium tabular-nums text-[#6b7280]">
                            <span>1</span>
                            <span>50</span>
                            <span>100</span>
                            <span>150</span>
                            <span>200</span>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {quickPicks.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    aria-pressed={seats === n}
                                    className={cn(
                                        'min-h-10 rounded-full border px-4 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]',
                                        seats === n
                                            ? 'border-[#8b5cf6] bg-[#8b5cf6] text-white'
                                            : 'border-white/10 text-[#d1d5db] hover:border-[#8b5cf6]/60',
                                    )}
                                    onClick={() => setSeats(n)}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>

                        <div aria-hidden="true" className="mt-8 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 sm:gap-1.5">
                            {dots.map((i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        'aspect-square rounded-full transition-colors duration-300',
                                        i >= seats
                                            ? 'bg-white/[0.07]'
                                            : i >= VOLUME_FROM
                                              ? 'bg-[#c4b5fd]'
                                              : 'bg-[#8b5cf6]',
                                    )}
                                />
                            ))}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#9ca3af]">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-[#8b5cf6]" aria-hidden="true" />
                                Seats 1–50 at list price
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-[#c4b5fd]" aria-hidden="true" />
                                Seats 51+ at 15% off
                            </span>
                        </div>

                        <AnimatePresence initial={false}>
                            {discounted && (
                                <motion.div
                                    key="volume"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-6 flex gap-3 rounded-2xl border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 p-4">
                                        <HiOutlineSparkles aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#c4b5fd]" />
                                        <p className="text-sm leading-relaxed text-[#e5e7eb]">
                                            <span className="font-semibold text-white">Volume pricing unlocked.</span>{' '}
                                            Seats 51–{seats} are 15% off, saving you{' '}
                                            <span className="font-semibold text-[#c4b5fd]">
                                                {formatMoney(growthSaving)}/mo
                                            </span>{' '}
                                            on Growth.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col gap-4 lg:col-span-7">
                        <ul className="flex flex-col gap-4">
                            {plans.map((plan) => {
                                const unavailable = plan.cap && seats > plan.cap
                                const total = monthlyTotal(plan.price, seats)
                                return (
                                    <li
                                        key={plan.id}
                                        className={cn(
                                            'relative rounded-3xl border p-5 transition-[opacity,border-color] duration-300 sm:p-6',
                                            plan.best
                                                ? 'border-[#8b5cf6] bg-[#8b5cf6]/[0.08] shadow-[0_0_0_4px_rgba(139,92,246,0.12)]'
                                                : 'border-[#374151] bg-white/[0.02]',
                                            unavailable && 'opacity-50',
                                        )}
                                    >
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-xl font-semibold tracking-tight text-white">
                                                        {plan.name}
                                                    </h3>
                                                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium tabular-nums text-[#d1d5db]">
                                                        ${plan.price} / seat
                                                    </span>
                                                    {plan.best && (
                                                        <span className="rounded-full bg-[#8b5cf6] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                                                            Best value
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#9ca3af]">{plan.pitch}</p>
                                                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#d1d5db]">
                                                    {plan.features.map((f) => (
                                                        <li key={f} className="inline-flex items-center gap-1.5">
                                                            <HiCheck aria-hidden="true" className="size-3.5 text-[#8b5cf6]" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 pt-4 sm:items-end sm:border-t-0 sm:pt-0 sm:text-right">
                                                <p className="leading-none">
                                                    <Ticker
                                                        value={total}
                                                        className="text-4xl font-bold tracking-tight tabular-nums text-white"
                                                    />
                                                    <span className="ml-1 text-sm text-[#9ca3af]">/mo</span>
                                                </p>
                                                <p className="text-xs tabular-nums text-[#9ca3af]">
                                                    avg ${(total / seats).toFixed(2)} per seat
                                                </p>
                                                {unavailable ? (
                                                    <p className="max-w-[14rem] text-xs font-medium text-[#fca5a5]">
                                                        Caps at {plan.cap} seats. Move up to Growth.
                                                    </p>
                                                ) : (
                                                    <a
                                                        href={`#teamline-start-${plan.id}`}
                                                        className={cn(
                                                            'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd]',
                                                            plan.best
                                                                ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]'
                                                                : 'border border-white/15 text-white hover:border-[#8b5cf6]',
                                                        )}
                                                    >
                                                        Choose {plan.name}
                                                        <HiArrowRight
                                                            aria-hidden="true"
                                                            className="size-4 transition-transform group-hover:translate-x-0.5"
                                                        />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                        <p className="px-1 text-xs leading-relaxed text-[#6b7280]">
                            Prices in USD, billed monthly, excluding tax. Seats are counted on the last day of each
                            billing cycle.
                        </p>
                    </div>
                </div>

                <p aria-live="polite" className="sr-only">
                    {`${seats} seats: Growth costs ${formatMoney(monthlyTotal(growth.price, seats))} per month`}
                </p>
            </div>
        </section>
    )
}

export default SeatSliderPricingTable

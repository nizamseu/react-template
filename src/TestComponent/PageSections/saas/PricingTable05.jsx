// CurrencySwitchPricingTable

// PricingTable05 · SaaS Platforms › Interactive Pricing Table

// Description:
// An editorial, price-list style pricing section for the fictional multi-currency business
// account Globalyn. Beside the serif heading "One price list, in the currency you think in."
// a currency select (USD / EUR / GBP / BDT) and a Monthly / Yearly switch ("2 months free")
// re-price three plans, Local, Borderless and Worldwide, with properly localised currency
// formatting. Use it for products sold internationally with regional price points.

// Design:
// - Cream #faf6ee section, forest #1f3d2b ink and rules, muted #5b6b5f body copy, brass
//   #b08d57 details; a faint line-drawn globe sits behind the header (hidden on mobile)
// - Serif display type for the heading, plan names and prices; small uppercase sans labels
//   with wide tracking; the currency symbol is set smaller than the digits via formatToParts
// - Plans read like a menu: numbered rows (I. II. III.) divided by hairline rules; the
//   Borderless row is a solid #1f3d2b rounded-[28px] panel with cream text and a brass chip
// - Price changes blur-fade in with AnimatePresence (opacity only for reduced motion); the
//   billing switch is a pill track with a sliding knob (framer-motion layout spring)
// - Responsive: controls stack under the header on mobile and sit to the right on lg; rows
//   stack name → features → price below md and become a 3-column row from md

// What it does:
// - currency state ('USD') comes from the native <select>; billing state ('monthly') from
//   the role="switch" button or by clicking the "Monthly" / "Yearly" words
// - Prices are fixed regional price points (not live FX): yearly = 10 × monthly, shown as a
//   rounded per-month figure plus the yearly total; formatted with Intl.NumberFormat
//   (en-US, de-DE, en-GB, en-IN locales, narrow symbols)
// - CTAs link to #globalyn-open-<plan>; an sr-only aria-live line announces the change

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CurrencySwitchPricingTable from '@/TestComponent/PageSections/saas/PricingTable05';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <CurrencySwitchPricingTable />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiChevronDown } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const currencies = [
    { code: 'USD', label: 'USD — US dollar', locale: 'en-US' },
    { code: 'EUR', label: 'EUR — Euro', locale: 'de-DE' },
    { code: 'GBP', label: 'GBP — British pound', locale: 'en-GB' },
    { code: 'BDT', label: 'BDT — Bangladeshi taka', locale: 'en-IN' },
]

const plans = [
    {
        id: 'local',
        numeral: 'I.',
        name: 'Local',
        tagline: 'For sole traders invoicing a handful of overseas clients.',
        prices: { USD: 19, EUR: 18, GBP: 15, BDT: 1990 },
        features: ['2 currency balances', '20 invoices a month', '1 debit card', 'Email support'],
    },
    {
        id: 'borderless',
        numeral: 'II.',
        name: 'Borderless',
        tagline: 'For small teams paid in several currencies every week.',
        prices: { USD: 49, EUR: 45, GBP: 39, BDT: 4990 },
        features: ['10 currency balances', 'Unlimited invoices', '5 team cards', 'Batch payouts to 60 countries'],
        featured: true,
    },
    {
        id: 'worldwide',
        numeral: 'III.',
        name: 'Worldwide',
        tagline: 'For companies with entities, approvals and an accountant.',
        prices: { USD: 129, EUR: 119, GBP: 105, BDT: 13490 },
        features: ['40+ currency balances', 'Local details in 12 countries', 'Approval workflows', 'Accounting sync & API'],
    },
]

const formatters = {}
const formatterFor = (currency) => {
    if (!formatters[currency.code]) {
        formatters[currency.code] = new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
            currencyDisplay: 'narrowSymbol',
            maximumFractionDigits: 0,
        })
    }
    return formatters[currency.code]
}

function Money({ amount, currency, symbolClassName }) {
    const parts = formatterFor(currency).formatToParts(amount)
    return (
        <>
            {parts.map((part, i) =>
                part.type === 'currency' ? (
                    <span key={i} className={symbolClassName}>
                        {part.value}
                    </span>
                ) : (
                    <span key={i}>{part.value}</span>
                ),
            )}
        </>
    )
}

export function CurrencySwitchPricingTable({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [code, setCode] = useState('USD')
    const [billing, setBilling] = useState('monthly')
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const currency = currencies.find((c) => c.code === code)
    const yearly = billing === 'yearly'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#faf6ee] px-4 py-16 text-base font-normal text-[#1f3d2b] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                className="absolute -right-24 -top-24 -z-10 hidden size-[440px] text-[#1f3d2b]/10 md:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
            >
                <circle cx="100" cy="100" r="96" />
                <ellipse cx="100" cy="100" rx="40" ry="96" />
                <ellipse cx="100" cy="100" rx="72" ry="96" />
                <line x1="100" y1="4" x2="100" y2="196" />
                <ellipse cx="100" cy="100" rx="96" ry="30" />
                <ellipse cx="100" cy="100" rx="96" ry="64" />
                <line x1="4" y1="100" x2="196" y2="100" />
            </svg>

            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#b08d57]">
                            Globalyn · Price list · Edition 2026
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#1f3d2b] sm:text-5xl lg:text-6xl">
                            One price list, in the currency <em className="italic text-[#b08d57]">you think in.</em>
                        </h2>
                        <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5b6b5f]">
                            Hold, send and invoice in 40+ currencies. Our fees are set locally, so the number you see is
                            the number on your statement.
                        </p>
                    </div>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end lg:flex-col lg:items-end">
                        <div className="w-full sm:w-64">
                            <label
                                htmlFor={`${uid}-currency`}
                                className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5b6b5f]"
                            >
                                Currency
                            </label>
                            <div className="relative mt-2">
                                <select
                                    id={`${uid}-currency`}
                                    value={code}
                                    className="min-h-12 w-full cursor-pointer appearance-none rounded-full border border-[#1f3d2b]/30 bg-[#faf6ee] py-2 pl-5 pr-11 font-serif text-lg text-[#1f3d2b] transition-colors hover:border-[#1f3d2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3d2b]"
                                    onChange={(e) => setCode(e.target.value)}
                                >
                                    {currencies.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                                <HiChevronDown
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2"
                                />
                            </div>
                        </div>

                        <div className="flex min-h-12 items-center gap-3">
                            <button
                                type="button"
                                aria-pressed={!yearly}
                                className={cn(
                                    'min-h-10 rounded-md text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3d2b]',
                                    yearly ? 'text-[#5b6b5f] hover:text-[#1f3d2b]' : 'text-[#1f3d2b]',
                                )}
                                onClick={() => setBilling('monthly')}
                            >
                                Monthly
                            </button>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={yearly}
                                aria-label="Bill yearly"
                                className={cn(
                                    'flex h-8 w-14 shrink-0 items-center rounded-full border border-[#1f3d2b] p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3d2b]',
                                    yearly ? 'justify-end bg-[#1f3d2b]' : 'justify-start bg-transparent',
                                )}
                                onClick={() => setBilling(yearly ? 'monthly' : 'yearly')}
                            >
                                <motion.span
                                    layout
                                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 32 }}
                                    className={cn('block size-6 rounded-full', yearly ? 'bg-[#faf6ee]' : 'bg-[#1f3d2b]')}
                                />
                            </button>
                            <button
                                type="button"
                                aria-pressed={yearly}
                                className={cn(
                                    'min-h-10 rounded-md text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3d2b]',
                                    yearly ? 'text-[#1f3d2b]' : 'text-[#5b6b5f] hover:text-[#1f3d2b]',
                                )}
                                onClick={() => setBilling('yearly')}
                            >
                                Yearly
                            </button>
                            <span className="rounded-full border border-[#b08d57] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#b08d57]">
                                2 months free
                            </span>
                        </div>
                    </div>
                </div>

                <p aria-live="polite" className="sr-only">
                    {`Prices shown in ${currency.label.split(' — ')[1]}, ${yearly ? 'billed yearly' : 'billed monthly'}`}
                </p>

                <ol className="mt-14 border-t border-[#1f3d2b]/25">
                    {plans.map((plan) => {
                        const monthly = plan.prices[code]
                        const shown = yearly ? Math.round((monthly * 10) / 12) : monthly
                        const featured = Boolean(plan.featured)
                        return (
                            <li
                                key={plan.id}
                                className={cn(
                                    'grid grid-cols-1 gap-6 py-8 md:grid-cols-[1.2fr_1fr_auto] md:items-center md:gap-10 md:py-10',
                                    featured
                                        ? 'my-4 rounded-[28px] bg-[#1f3d2b] px-5 text-[#faf6ee] shadow-[0_30px_60px_-30px_rgba(31,61,43,0.7)] sm:px-8'
                                        : 'border-b border-[#1f3d2b]/25 px-1',
                                )}
                            >
                                <div>
                                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                                        <span
                                            className={cn(
                                                'font-serif text-xl italic',
                                                featured ? 'text-[#d9bf8f]' : 'text-[#b08d57]',
                                            )}
                                        >
                                            {plan.numeral}
                                        </span>
                                        <h3
                                            className={cn(
                                                'font-serif text-4xl font-normal tracking-tight sm:text-5xl',
                                                featured ? 'text-[#faf6ee]' : 'text-[#1f3d2b]',
                                            )}
                                        >
                                            {plan.name}
                                        </h3>
                                        {featured && (
                                            <span className="rounded-full bg-[#b08d57] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f3d2b]">
                                                Most chosen
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={cn(
                                            'mt-3 max-w-sm text-sm leading-relaxed',
                                            featured ? 'text-[#faf6ee]/75' : 'text-[#5b6b5f]',
                                        )}
                                    >
                                        {plan.tagline}
                                    </p>
                                </div>

                                <ul
                                    className={cn(
                                        'grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-1',
                                        featured ? 'text-[#faf6ee]/90' : 'text-[#1f3d2b]',
                                    )}
                                >
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2.5">
                                            <span
                                                aria-hidden="true"
                                                className={cn('h-px w-4 shrink-0', featured ? 'bg-[#d9bf8f]' : 'bg-[#b08d57]')}
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col gap-4 md:min-w-[15rem] md:items-end md:text-right">
                                    <div className="min-h-[5.5rem]">
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.div
                                                key={`${code}-${billing}`}
                                                initial={{ opacity: 0, y: reduceMotion ? 0 : 8, filter: reduceMotion ? 'none' : 'blur(6px)' }}
                                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                                exit={{ opacity: 0, y: reduceMotion ? 0 : -8, filter: reduceMotion ? 'none' : 'blur(6px)' }}
                                                transition={{ duration: 0.22 }}
                                            >
                                                <p className="font-serif text-5xl leading-none tracking-tight tabular-nums sm:text-6xl">
                                                    <Money
                                                        amount={shown}
                                                        currency={currency}
                                                        symbolClassName="align-top text-[0.5em] opacity-70"
                                                    />
                                                </p>
                                                <p
                                                    className={cn(
                                                        'mt-2 text-xs',
                                                        featured ? 'text-[#faf6ee]/70' : 'text-[#5b6b5f]',
                                                    )}
                                                >
                                                    {yearly ? (
                                                        <>
                                                            per month · <Money amount={monthly * 10} currency={currency} /> billed yearly
                                                        </>
                                                    ) : (
                                                        'per month · billed monthly'
                                                    )}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                    <a
                                        href={`#globalyn-open-${plan.id}`}
                                        className={cn(
                                            'group inline-flex min-h-11 items-center gap-2 self-start rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:self-end',
                                            featured
                                                ? 'bg-[#faf6ee] text-[#1f3d2b] hover:bg-white focus-visible:outline-[#faf6ee]'
                                                : 'border border-[#1f3d2b] text-[#1f3d2b] hover:bg-[#1f3d2b] hover:text-[#faf6ee] focus-visible:outline-[#1f3d2b]',
                                        )}
                                    >
                                        Open an account
                                        <HiArrowLongRight
                                            aria-hidden="true"
                                            className="size-4 transition-transform group-hover:translate-x-1"
                                        />
                                    </a>
                                </div>
                            </li>
                        )
                    })}
                </ol>

                <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[#5b6b5f]">
                    Regional prices are set by Globalyn, not converted at live rates. BDT pricing applies to businesses
                    registered in Bangladesh. Local taxes may apply at checkout.
                </p>
            </div>
        </section>
    )
}

export default CurrencySwitchPricingTable

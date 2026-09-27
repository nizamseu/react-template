// ToggleTierPricingTable

// PricingTable01 · SaaS Platforms › Interactive Pricing Table

// Description:
// A crisp three-tier pricing section for the fictional cloud storage product Cloudnest.
// Under the heading "Room for every file, priced for every team." a Monthly / Yearly pill
// toggle ("Save 20%") switches the Starter, Team and Business cards between $15/$30/$60 and
// $12/$24/$48 per user. Each card lists storage, features and a CTA ("Start free trial",
// "Talk to sales"). Use it on a product or pricing page with a simple per-seat model.

// Design:
// - White section with a faint #dbe6ff grid masked to a top ellipse, slate #0f172a text,
//   blue #2563eb accents; centred header, hand-drawn SVG arrow pointing at "Save 20%"
// - Toggle: rounded-full slate-100 track with a white pill that slides between options
//   via a shared framer-motion layoutId; prices roll up/down with AnimatePresence
// - Cards: rounded-[28px], 1px slate border, soft shadow; Team is solid #2563eb with white
//   text, a "Most popular" chip and lg:-my-4 so it stands taller than its neighbours
// - Each card has a storage meter (bar grows in when scrolled into view), check-icon
//   feature list and a full-width CTA; feature text-sm, price text-6xl tabular-nums
// - Responsive: cards stack (base), 3 columns from md with tighter padding, roomy on lg;
//   footer strip stacks on mobile and splits on sm; reduced motion drops roll and grow

// What it does:
// - billing state ('yearly' by default) is set by the two toggle buttons (aria-pressed);
//   it swaps each price, the "Billed $288 yearly" / "Billed monthly" line and the savings
// - CTAs link to #cloudnest-signup-<plan>; "Compare every feature" goes to #cloudnest-compare
// - An sr-only aria-live line announces the billing period after each switch

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ToggleTierPricingTable from '@/TestComponent/PageSections/saas/PricingTable01';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <ToggleTierPricingTable />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiCheck, HiOutlineCloud, HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        blurb: 'For freelancers who need client files safe and shareable.',
        monthly: 15,
        yearly: 12,
        storage: '250 GB',
        meter: 10,
        seats: '1–3 users',
        cta: 'Start free trial',
        features: ['250 GB encrypted storage', 'Password-protected share links', '30-day file history', 'Desktop & mobile sync'],
    },
    {
        id: 'team',
        name: 'Team',
        blurb: 'Shared folders and admin controls for growing studios.',
        monthly: 30,
        yearly: 24,
        storage: '2 TB',
        meter: 42,
        seats: 'Up to 25 users',
        cta: 'Start 14-day trial',
        popular: true,
        features: [
            '2 TB pooled storage',
            'Shared team folders & roles',
            '180-day file history',
            'Admin console & audit log',
            'Priority chat support',
        ],
    },
    {
        id: 'business',
        name: 'Business',
        blurb: 'Compliance, SSO and residency for regulated teams.',
        monthly: 60,
        yearly: 48,
        storage: '10 TB',
        meter: 100,
        seats: 'Unlimited users',
        cta: 'Talk to sales',
        features: [
            '10 TB pooled storage',
            'SAML SSO & SCIM provisioning',
            'Unlimited file history',
            'EU or US data residency',
            '99.99% uptime SLA',
        ],
    },
]

const options = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
]

export function ToggleTierPricingTable({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [billing, setBilling] = useState('yearly')
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const yearly = billing === 'yearly'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[linear-gradient(to_right,#dbe6ff_1px,transparent_1px),linear-gradient(to_bottom,#dbe6ff_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,#000_20%,transparent_100%)]"
            />
            <div
                aria-hidden="true"
                className="absolute left-1/2 top-24 -z-10 h-72 w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-[#2563eb]/10 blur-3xl"
            />

            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="inline-flex items-center gap-2 rounded-full border border-[#2563eb]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#2563eb] shadow-sm">
                        <HiOutlineCloud aria-hidden="true" className="size-4" />
                        Cloudnest pricing
                    </p>
                    <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
                        Room for every file, priced for every team.
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#475569]">
                        Start free for 14 days. No credit card, no migration fees, and your files stay yours if you
                        ever leave.
                    </p>
                </div>

                <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
                    <div
                        role="group"
                        aria-label="Billing period"
                        className="relative inline-flex rounded-full border border-slate-200 bg-slate-100 p-1"
                    >
                        {options.map((option) => {
                            const active = billing === option.id
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    aria-pressed={active}
                                    className={cn(
                                        'relative min-h-11 rounded-full px-6 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]',
                                        active ? 'text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a]',
                                    )}
                                    onClick={() => setBilling(option.id)}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId={`${uid}-billing-pill`}
                                            transition={
                                                reduceMotion
                                                    ? { duration: 0 }
                                                    : { type: 'spring', stiffness: 420, damping: 34 }
                                            }
                                            className="absolute inset-0 rounded-full bg-white shadow-[0_2px_10px_-2px_rgba(15,23,42,0.18)]"
                                        />
                                    )}
                                    <span className="relative">{option.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 48 24"
                            className="hidden h-6 w-12 -scale-x-100 text-[#2563eb] sm:block"
                            fill="none"
                        >
                            <path
                                d="M2 18c10-12 26-15 40-8m0 0-7-5m7 5-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors duration-300',
                                yearly ? 'bg-[#2563eb] text-white' : 'bg-[#2563eb]/10 text-[#2563eb]',
                            )}
                        >
                            Save 20%
                        </span>
                    </div>
                </div>

                <p aria-live="polite" className="sr-only">
                    {yearly ? 'Showing yearly prices, billed annually' : 'Showing monthly prices'}
                </p>

                <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-4 lg:gap-6">
                    {plans.map((plan) => {
                        const price = yearly ? plan.yearly : plan.monthly
                        const saving = (plan.monthly - plan.yearly) * 12
                        const popular = Boolean(plan.popular)
                        return (
                            <li
                                key={plan.id}
                                className={cn(
                                    'relative flex flex-col rounded-[28px] border p-6 md:p-5 lg:p-8',
                                    popular
                                        ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-[0_30px_60px_-24px_rgba(37,99,235,0.65)] lg:-my-4 lg:py-12'
                                        : 'border-slate-200 bg-white/90 text-[#0f172a] shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur',
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3
                                            className={cn(
                                                'text-xl font-semibold tracking-tight',
                                                popular ? 'text-white' : 'text-[#0f172a]',
                                            )}
                                        >
                                            {plan.name}
                                        </h3>
                                        <p
                                            className={cn(
                                                'mt-1 text-xs font-medium uppercase tracking-[0.18em]',
                                                popular ? 'text-white/70' : 'text-[#64748b]',
                                            )}
                                        >
                                            {plan.seats}
                                        </p>
                                    </div>
                                    {popular && (
                                        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#2563eb]">
                                            Most popular
                                        </span>
                                    )}
                                </div>

                                <p
                                    className={cn(
                                        'mt-4 min-h-[3rem] text-sm leading-relaxed',
                                        popular ? 'text-white/80' : 'text-[#475569]',
                                    )}
                                >
                                    {plan.blurb}
                                </p>

                                <div className="mt-6 flex items-end gap-1">
                                    <span className="pb-2 text-2xl font-semibold">$</span>
                                    <span className="relative inline-flex h-[60px] items-end overflow-hidden text-6xl font-semibold leading-none tracking-tight tabular-nums">
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            <motion.span
                                                key={price}
                                                initial={{ y: reduceMotion ? 0 : '100%', opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: reduceMotion ? 0 : '-100%', opacity: 0 }}
                                                transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                                                className="block"
                                            >
                                                {price}
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                    <span
                                        className={cn(
                                            'pb-2 text-sm leading-tight',
                                            popular ? 'text-white/75' : 'text-[#64748b]',
                                        )}
                                    >
                                        / user
                                        <br />
                                        / month
                                    </span>
                                </div>
                                <p
                                    className={cn(
                                        'mt-2 text-xs font-medium',
                                        popular ? 'text-white/80' : 'text-[#64748b]',
                                    )}
                                >
                                    {yearly
                                        ? `Billed $${plan.yearly * 12} yearly per user · you save $${saving}`
                                        : `Billed monthly · $${saving} less a year on yearly`}
                                </p>

                                <div className="mt-6">
                                    <div
                                        className={cn(
                                            'flex items-center justify-between text-xs font-semibold',
                                            popular ? 'text-white' : 'text-[#0f172a]',
                                        )}
                                    >
                                        <span>Storage</span>
                                        <span>{plan.storage}</span>
                                    </div>
                                    <div
                                        className={cn(
                                            'mt-2 h-2 overflow-hidden rounded-full',
                                            popular ? 'bg-white/20' : 'bg-slate-100',
                                        )}
                                    >
                                        <motion.div
                                            initial={{ width: reduceMotion ? `${plan.meter}%` : '0%' }}
                                            whileInView={{ width: `${plan.meter}%` }}
                                            viewport={{ once: true, amount: 0.6 }}
                                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                                            className={cn('h-full rounded-full', popular ? 'bg-white' : 'bg-[#2563eb]')}
                                        />
                                    </div>
                                </div>

                                <ul
                                    className={cn(
                                        'mt-6 flex-1 space-y-3 border-t pt-6 text-sm',
                                        popular ? 'border-white/20' : 'border-slate-100',
                                    )}
                                >
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <span
                                                className={cn(
                                                    'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                                                    popular ? 'bg-white/15 text-white' : 'bg-[#2563eb]/10 text-[#2563eb]',
                                                )}
                                            >
                                                <HiCheck aria-hidden="true" className="size-3.5" />
                                            </span>
                                            <span className={popular ? 'text-white/90' : 'text-[#334155]'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={`#cloudnest-signup-${plan.id}`}
                                    className={cn(
                                        'group mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2',
                                        popular
                                            ? 'bg-white text-[#2563eb] hover:bg-[#eff4ff] focus-visible:outline-white'
                                            : 'border border-[#2563eb]/30 text-[#2563eb] hover:border-[#2563eb] hover:bg-[#2563eb] hover:text-white focus-visible:outline-[#2563eb]',
                                    )}
                                >
                                    {plan.cta}
                                    <HiArrowRight
                                        aria-hidden="true"
                                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                    />
                                </a>
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-[#475569] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span className="inline-flex items-center gap-2">
                            <HiOutlineLockClosed aria-hidden="true" className="size-4 text-[#2563eb]" />
                            AES-256 encryption on every plan
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <HiOutlineShieldCheck aria-hidden="true" className="size-4 text-[#2563eb]" />
                            GDPR &amp; SOC 2 Type II
                        </span>
                    </div>
                    <a
                        href="#cloudnest-compare"
                        className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                    >
                        Compare every feature
                        <HiArrowRight aria-hidden="true" className="size-4" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default ToggleTierPricingTable

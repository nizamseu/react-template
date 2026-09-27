// AccordionPolicyTrustBadges

// TrustBadges03 · E-commerce & Marketplaces › Trust Badges & Policies

// Description:
// A policy explainer for Moss & Timber, an outdoor-home goods store. The left column holds
// the heading "Shop with confidence", a short promise, three mini proof points and a
// "Talk to a human" help card; the right column is an accordion of Shipping, Returns,
// Payments and Warranty, each with a one-line summary, a table of specifics and a policy
// link. Use it on product pages, the cart or a dedicated "Our promise" page.

// Design:
// - Stacked on mobile → lg:grid-cols-12 (5 / 7 split) with the left column sticky
//   (lg:sticky lg:top-24) while the accordion scrolls
// - Sage #e7ede4 background, forest #23412f text/icons, hairline forest/15 dividers; the
//   open item becomes a white/70 rounded-3xl card with a filled forest icon tile
// - Serif heading text-4xl → sm:text-5xl → lg:text-6xl; 11px mono eyebrows; spec rows are
//   a two-column dl (label / value) that collapses to stacked text on mobile
// - Panels animate height 0 → auto and opacity (AnimatePresence), the plus icon rotates
//   45° into an ×; durations drop to 0 for reduced motion
// - Trigger rows are min-h-[72px] full-width buttons; padding px-4 → sm:px-6

// What it does:
// - open (state, default "shipping") holds the single open item; clicking a trigger opens
//   it and closes the others, clicking the open one collapses it (open = null).
// - Triggers carry aria-expanded/aria-controls; panels are role="region" labelled by
//   their trigger (ids from useId).
// - Links: each panel's policy link (#shipping-policy, #returns-policy, #payment-policy,
//   #warranty-policy), help card "Start a chat" → #chat and "Email us" → #contact.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AccordionPolicyTrustBadges from '@/TestComponent/PageSections/ecommerce/TrustBadges03';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <AccordionPolicyTrustBadges />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuArrowUpRight, LuCreditCard, LuPlus, LuRotateCcw, LuShieldCheck, LuTruck } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const policies = [
    {
        id: 'shipping',
        icon: LuTruck,
        title: 'Shipping',
        summary: 'Free over $60 · ships in 1 business day',
        rows: [
            ['Standard (3–5 days)', 'Free over $60, otherwise $6.95'],
            ['Express (1–2 days)', '$14 flat, any order size'],
            ['Same-day dispatch', 'Order by 2 pm PT, Monday–Friday'],
            ['Oversized items', 'White-glove delivery, scheduled by text'],
        ],
        note: 'Every parcel is tracked and packed in recycled, plastic-free materials.',
        link: { label: 'Full shipping policy', href: '#shipping-policy' },
    },
    {
        id: 'returns',
        icon: LuRotateCcw,
        title: 'Returns',
        summary: '45 days, free return label',
        rows: [
            ['Return window', '45 days from delivery'],
            ['Return shipping', 'Free prepaid label, drop off anywhere'],
            ['Refund timing', 'Back on your card in 3–5 business days'],
            ['Used gear', 'Accepted if it didn’t live up to our promise'],
        ],
        note: 'Start a return from your order email — no receipts or phone calls needed.',
        link: { label: 'Full returns policy', href: '#returns-policy' },
    },
    {
        id: 'payments',
        icon: LuCreditCard,
        title: 'Payments',
        summary: 'Encrypted checkout · pay in 4 available',
        rows: [
            ['Encryption', 'TLS 1.3 with 256-bit keys'],
            ['Card data', 'Tokenized by a PCI DSS Level 1 processor'],
            ['Pay later', '4 interest-free payments on orders $50–$1,500'],
            ['Currency', 'USD, charged only when your order ships'],
        ],
        chips: ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'],
        note: 'We never see or store your full card number.',
        link: { label: 'Payment & security details', href: '#payment-policy' },
    },
    {
        id: 'warranty',
        icon: LuShieldCheck,
        title: 'Warranty',
        summary: '2 years standard · lifetime on cast iron',
        rows: [
            ['Furniture & textiles', '2-year craftsmanship warranty'],
            ['Cast iron & steel', 'Lifetime — pass it down'],
            ['Repairs', 'Free repair or replacement, your pick'],
            ['Claims', 'Send a photo; most are approved in 48 hours'],
        ],
        note: 'Wear and tear from years of honest use is a compliment, not a claim.',
        link: { label: 'Warranty terms', href: '#warranty-policy' },
    },
]

const proofPoints = [
    { value: '4.9/5', label: 'service rating' },
    { value: '98%', label: 'orders on time' },
    { value: '<5 min', label: 'chat reply' },
]

export function AccordionPolicyTrustBadges({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [open, setOpen] = useState('shipping')
    const reduce = useReducedMotion()
    const uid = useId()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#e7ede4] px-4 py-16 text-[#23412f] antialiased sm:px-6 md:py-24 lg:px-10 text-base font-normal',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#23412f]/65">
                        Moss &amp; Timber · Our promise
                    </p>
                    <h2 className="mt-5 font-serif text-4xl leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl text-[#23412f] font-normal">
                        Shop with confidence
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#23412f]/75">
                        Everything we sell is built to be used hard — outdoors and at home.
                        If something isn’t right, we’ll make it right. Here’s exactly how.
                    </p>

                    <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-[#23412f]/15 border-y border-[#23412f]/15">
                        {proofPoints.map((point) => (
                            <div key={point.label} className="flex flex-col-reverse gap-1 px-3 py-4 first:pl-0">
                                <dt className="text-[11px] leading-tight text-[#23412f]/60">{point.label}</dt>
                                <dd className="font-serif text-xl sm:text-2xl">{point.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-8 max-w-md rounded-3xl bg-[#23412f] p-6 text-[#e7ede4]">
                        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#b9cdb0]">
                            <span aria-hidden="true" className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9fd18b] opacity-70 motion-reduce:animate-none" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9fd18b]" />
                            </span>
                            Crew online now
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-[#e7ede4]/85">
                            Still unsure? Our Portland crew answers in under five minutes,
                            7 am–7 pm PT, every day of the week.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <a
                                href="#chat"
                                className="inline-flex min-h-11 items-center rounded-full bg-[#e7ede4] px-5 text-sm font-medium text-[#23412f] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7ede4]"
                            >
                                Start a chat
                            </a>
                            <a
                                href="#contact"
                                className="inline-flex min-h-11 items-center rounded-full border border-[#e7ede4]/30 px-5 text-sm font-medium transition-colors hover:border-[#e7ede4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7ede4]"
                            >
                                Email us
                            </a>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="flex items-baseline justify-between border-b border-[#23412f]/15 pb-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#23412f]/65">
                            Policies
                        </p>
                        <p className="font-mono text-[11px] tracking-[0.1em] text-[#23412f]/50">
                            Updated Aug 4, 2026
                        </p>
                    </div>

                    <ul className="mt-3 space-y-2">
                        {policies.map((policy, i) => {
                            const Icon = policy.icon
                            const isOpen = open === policy.id
                            const triggerId = `${uid}-${policy.id}-trigger`
                            const panelId = `${uid}-${policy.id}-panel`

                            return (
                                <li
                                    key={policy.id}
                                    className={cn(
                                        'rounded-3xl border transition-colors duration-300',
                                        isOpen
                                            ? 'border-[#23412f]/10 bg-white/70 shadow-[0_20px_40px_-28px_rgba(35,65,47,0.55)]'
                                            : 'border-transparent hover:bg-white/35',
                                    )}
                                >
                                    <h3 className="text-[#23412f] text-base font-normal">
                                        <button
                                            id={triggerId}
                                            type="button"
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            className="flex min-h-[72px] w-full items-center gap-4 rounded-3xl px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23412f] sm:gap-5 sm:px-6"
                                            onClick={() => setOpen(isOpen ? null : policy.id)}
                                        >
                                            <span
                                                className={cn(
                                                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300',
                                                    isOpen
                                                        ? 'bg-[#23412f] text-[#e7ede4]'
                                                        : 'bg-[#23412f]/10 text-[#23412f]',
                                                )}
                                            >
                                                <Icon aria-hidden="true" className="h-5 w-5" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-baseline gap-3">
                                                    <span className="font-mono text-[11px] text-[#23412f]/45">
                                                        {String(i + 1).padStart(2, '0')}
                                                    </span>
                                                    <span className="font-serif text-xl sm:text-2xl">
                                                        {policy.title}
                                                    </span>
                                                </span>
                                                <span className="mt-0.5 block text-xs leading-snug text-[#23412f]/65 sm:truncate sm:text-sm">
                                                    {policy.summary}
                                                </span>
                                            </span>
                                            <motion.span
                                                aria-hidden="true"
                                                animate={{ rotate: isOpen ? 45 : 0 }}
                                                transition={{ duration: reduce ? 0 : 0.3 }}
                                                className={cn(
                                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors',
                                                    isOpen
                                                        ? 'border-[#23412f] bg-[#23412f] text-[#e7ede4]'
                                                        : 'border-[#23412f]/25',
                                                )}
                                            >
                                                <LuPlus className="h-4 w-4" />
                                            </motion.span>
                                        </button>
                                    </h3>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="panel"
                                                id={panelId}
                                                role="region"
                                                aria-labelledby={triggerId}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{
                                                    duration: reduce ? 0 : 0.45,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-6 sm:px-6 sm:pb-7 sm:pl-[5.25rem]">
                                                    <dl className="divide-y divide-[#23412f]/10 border-y border-[#23412f]/10">
                                                        {policy.rows.map(([label, value]) => (
                                                            <div
                                                                key={label}
                                                                className="grid gap-0.5 py-3 text-sm sm:grid-cols-[11rem_1fr] sm:gap-4"
                                                            >
                                                                <dt className="text-[#23412f]/60">{label}</dt>
                                                                <dd className="font-medium">{value}</dd>
                                                            </div>
                                                        ))}
                                                    </dl>
                                                    {policy.chips && (
                                                        <ul
                                                            aria-label="Accepted payment methods"
                                                            className="mt-4 flex flex-wrap gap-2"
                                                        >
                                                            {policy.chips.map((chip) => (
                                                                <li
                                                                    key={chip}
                                                                    className="rounded-md border border-[#23412f]/20 bg-[#e7ede4]/60 px-2.5 py-1 font-mono text-[11px] tracking-wide"
                                                                >
                                                                    {chip}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    <p className="mt-4 text-sm leading-relaxed text-[#23412f]/75">
                                                        {policy.note}
                                                    </p>
                                                    <a
                                                        href={policy.link.href}
                                                        className="group mt-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium underline decoration-[#23412f]/30 underline-offset-4 transition-colors hover:decoration-[#23412f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23412f]"
                                                    >
                                                        {policy.link.label}
                                                        <LuArrowUpRight
                                                            aria-hidden="true"
                                                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                        />
                                                    </a>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default AccordionPolicyTrustBadges

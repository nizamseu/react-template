// HairlineStripTrustBadges

// TrustBadges01 · E-commerce & Marketplaces › Trust Badges & Policies

// Description:
// A calm, editorial promise strip for the Quiet Goods home store. A mono eyebrow "Quiet
// Goods — the fine print", the serif heading "Everything we promise, stated plainly." and
// four hairline-divided badges: free shipping over $75, 30-day returns, secure payment and
// carbon-neutral delivery, each ending in a "Read policy" link. Use it under a hero, above
// the footer or on a cart page of a minimal lifestyle shop.

// Design:
// - Header row (stacked → md: heading left, note right) above one ul strip: grid-cols-2
//   (a 2×2 block on mobile/tablet) → lg:grid-cols-4 in a single row, framed by border-y
// - Ivory #faf7f0 background, ink #1c1a17 text; every rule is a 1px ink/15 hairline and
//   the inner dividers switch per breakpoint (a cross on mobile, vertical lines on lg)
// - Phosphor Light (thin outline) icons in a 48px hairline circle that fills ink on
//   hover; serif titles text-base → sm:text-xl, mono 01–04 indices, square cells
// - A darker hairline draws across the top of the strip (scaleX) and cells fade up with an
//   80ms stagger on first view; the translate is dropped for reduced motion
// - Cell padding p-5 → sm:p-8 → lg:p-10; the contact line under the strip wraps on mobile

// What it does:
// - No state. Each badge is a whole-cell #hash link (#shipping-policy, #returns-policy,
//   #payment-security, #carbon-neutral) with a hover/focus tint and a nudging arrow.
// - whileInView entrance runs once per page view; useReducedMotion removes the movement.
// - The footer line links "Talk to our studio" to #contact.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HairlineStripTrustBadges from '@/TestComponent/PageSections/ecommerce/TrustBadges01';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <HairlineStripTrustBadges />
//     </main>
// )
// ```

'use client'

import { motion, useReducedMotion } from 'framer-motion';
import {
    PiArrowRightLight,
    PiArrowUUpLeftLight,
    PiLeafLight,
    PiLockKeyLight,
    PiTruckLight,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const badges = [
    {
        id: 'shipping',
        icon: PiTruckLight,
        title: 'Free shipping over $75',
        detail: 'Tracked, plastic-free parcels at your door in 2–4 business days.',
        href: '#shipping-policy',
    },
    {
        id: 'returns',
        icon: PiArrowUUpLeftLight,
        title: '30-day returns',
        detail: 'Changed your mind? Send it back unused — the return label is on us.',
        href: '#returns-policy',
    },
    {
        id: 'payment',
        icon: PiLockKeyLight,
        title: 'Secure payment',
        detail: '256-bit encryption at checkout. We never store your card details.',
        href: '#payment-security',
    },
    {
        id: 'carbon',
        icon: PiLeafLight,
        title: 'Carbon-neutral delivery',
        detail: 'Every shipment’s emissions are measured and offset, at no cost to you.',
        href: '#carbon-neutral',
    },
]

const ease = [0.22, 1, 0.36, 1]

export function HairlineStripTrustBadges({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#faf7f0] px-4 py-16 text-[#1c1a17] antialiased sm:px-6 md:py-24 lg:px-10 text-base font-normal',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#1c1a17]/55">
                            Quiet Goods — the fine print
                        </p>
                        <h2 className="mt-4 max-w-xl font-serif text-3xl leading-[1.1] tracking-tight sm:text-4xl md:text-5xl text-[#1c1a17] font-normal">
                            Everything we promise,{' '}
                            <em className="text-[#1c1a17]/60">stated plainly.</em>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-[#1c1a17]/65">
                        No asterisks and no surprise fees at the door. These four
                        commitments ride along with every order, however small.
                    </p>
                </div>

                <div className="relative mt-12 md:mt-16">
                    <motion.span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 z-10 h-px origin-left bg-[#1c1a17]/70"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: reduce ? 0 : 1.2, ease }}
                    />
                    <ul className="grid grid-cols-2 border-y border-[#1c1a17]/15 lg:grid-cols-4">
                        {badges.map((badge, i) => {
                            const Icon = badge.icon

                            return (
                                <motion.li
                                    key={badge.id}
                                    initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.4 }}
                                    transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease }}
                                    className={cn(
                                        'border-[#1c1a17]/15',
                                        i % 2 === 0 && 'border-r',
                                        i < 2 && 'border-b lg:border-b-0',
                                        i === 1 && 'lg:border-r',
                                    )}
                                >
                                    <a
                                        href={badge.href}
                                        className="group flex h-full flex-col p-5 transition-colors duration-300 hover:bg-[#f2ede2] focus-visible:bg-[#f2ede2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1c1a17] sm:p-8 lg:p-10"
                                    >
                                        <span className="flex items-start justify-between gap-3">
                                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#1c1a17]/25 transition-colors duration-300 group-hover:border-[#1c1a17] group-hover:bg-[#1c1a17] group-hover:text-[#faf7f0]">
                                                <Icon aria-hidden="true" className="h-6 w-6" />
                                            </span>
                                            <span className="font-mono text-[11px] tracking-[0.2em] text-[#1c1a17]/45">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                        </span>
                                        <h3 className="mt-6 font-serif text-base leading-snug sm:mt-10 sm:text-xl text-[#1c1a17] font-normal">
                                            {badge.title}
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-[#1c1a17]/65 sm:text-sm">
                                            {badge.detail}
                                        </p>
                                        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1c1a17]/80 sm:pt-8">
                                            Read policy
                                            <PiArrowRightLight
                                                aria-hidden="true"
                                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </span>
                                    </a>
                                </motion.li>
                            )
                        })}
                    </ul>
                </div>

                <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#1c1a17]/65">
                    <span>Questions about an order? Our studio replies within four hours, Monday to Saturday.</span>
                    <a
                        href="#contact"
                        className="inline-flex min-h-10 items-center gap-1.5 font-medium text-[#1c1a17] underline decoration-[#1c1a17]/30 underline-offset-4 transition-colors hover:decoration-[#1c1a17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1a17]"
                    >
                        Talk to our studio
                        <PiArrowRightLight aria-hidden="true" className="h-4 w-4" />
                    </a>
                </p>
            </div>
        </section>
    )
}

export default HairlineStripTrustBadges

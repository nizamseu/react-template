// SecureCheckoutTrustBadges

// TrustBadges04 · E-commerce & Marketplaces › Trust Badges & Policies

// Description:
// A dark "secure checkout" reassurance block for the Parcel & Pine general store. It pairs
// a checkout-style card (lock icon, "Secure checkout" title, a faux address bar, "Pay
// with" chips for Visa, Mastercard, Amex, PayPal and Apple Pay, plus SSL / PCI DSS / 3-D
// Secure / Fraud watch badges) with a slowly spinning "100% SATISFACTION GUARANTEED" seal
// and the promise "Love it, or it’s on us." Place it near the cart, on checkout or above
// the footer.

// Design:
// - Header copy, then a grid: stacked on mobile → lg:grid-cols-[1.35fr_1fr] (checkout
//   card left, seal card right); badges are 2 columns → sm:4 columns inside the card
// - Slate #0f172a background with a faint dot grid and an emerald #10b981 glow; cards are
//   white/[0.03] with white/10 borders, rounded-3xl; emerald for the lock tile, selected
//   chip ring, badge icons and the seal disc
// - Chips are mono text pills (min-h-11) — no brand logos; the selected one gets an
//   emerald border, tint and a check; the note below cross-fades per method
// - The seal is an SVG circle with its text on a textPath (textLength fits the ring) that
//   rotates 360° every 28s via framer-motion; stopped when reduced motion is on
// - Padding py-16 → md:py-24, card padding p-5 → sm:p-8; the address bar truncates

// What it does:
// - method (state, default "Visa") is set by the payment chips (aria-pressed) and swaps
//   the reassurance line under them with AnimatePresence (aria-live="polite").
// - The "Encrypted" status dot pulses (framer-motion), static for reduced motion.
// - Links: "Read the guarantee" → #guarantee, "Security & privacy" → #security. No real
//   payment form; it is purely a trust display.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SecureCheckoutTrustBadges from '@/TestComponent/PageSections/ecommerce/TrustBadges04';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <SecureCheckoutTrustBadges />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    LuArrowRight,
    LuBadgeCheck,
    LuCheck,
    LuFingerprint,
    LuLock,
    LuLockKeyhole,
    LuRadar,
    LuShieldCheck,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const methods = [
    {
        id: 'Visa',
        note: 'Visa cards are tokenized by our PCI Level 1 processor — your full number never touches our servers.',
    },
    {
        id: 'Mastercard',
        note: 'Larger Mastercard orders get a quick 3-D Secure confirmation from your bank.',
    },
    {
        id: 'Amex',
        note: 'American Express purchases are verified with your issuer before anything is charged.',
    },
    {
        id: 'PayPal',
        note: 'You’ll finish in a PayPal window. We never see your PayPal login or password.',
    },
    {
        id: 'Apple Pay',
        note: 'Confirm with Face ID or Touch ID. Your card number is never shared with us.',
    },
]

const badges = [
    { id: 'ssl', icon: LuLock, title: 'SSL secured', detail: '256-bit TLS' },
    { id: 'pci', icon: LuShieldCheck, title: 'PCI DSS', detail: 'Level 1' },
    { id: '3ds', icon: LuFingerprint, title: '3-D Secure', detail: 'Bank-verified' },
    { id: 'fraud', icon: LuRadar, title: 'Fraud watch', detail: 'Screened 24/7' },
]

export function SecureCheckoutTrustBadges({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [method, setMethod] = useState('Visa')
    const reduce = useReducedMotion()
    const pathId = `seal-path-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    const activeNote = methods.find((m) => m.id === method)?.note

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0f172a] px-4 py-16 text-slate-300 antialiased sm:px-6 md:py-24 lg:px-10 text-base font-normal',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[length:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.22),transparent_65%)]"
            />

            <div className="mx-auto max-w-6xl">
                <div className="max-w-2xl">
                    <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        <LuLockKeyhole aria-hidden="true" className="h-3.5 w-3.5" />
                        Parcel &amp; Pine · Secure checkout
                    </p>
                    <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
                        Checkout that keeps your card{' '}
                        <span className="text-[#10b981]">to itself.</span>
                    </h2>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
                        Every payment runs through bank-grade encryption and a certified
                        processor. We handle the security so you can simply handle the
                        cart.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#10b981] text-[#0f172a] shadow-[0_0_30px_rgba(16,185,129,0.45)]">
                                    <LuLock aria-hidden="true" className="h-6 w-6" />
                                </span>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Secure checkout</h3>
                                    <p className="text-sm text-slate-400">Your connection is private</p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-emerald-300">
                                <motion.span
                                    aria-hidden="true"
                                    className="h-2 w-2 rounded-full bg-[#10b981]"
                                    animate={reduce ? { opacity: 1 } : { opacity: [1, 0.3, 1] }}
                                    transition={
                                        reduce ? { duration: 0 } : { duration: 1.8, repeat: Infinity }
                                    }
                                />
                                Encrypted
                            </span>
                        </div>

                        <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b1222] px-3 py-2.5 font-mono text-xs text-slate-400">
                            <LuLock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#10b981]" />
                            <span className="truncate">
                                <span className="text-slate-500">https://</span>
                                <span className="text-slate-200">checkout.parcelandpine.shop</span>
                                <span className="text-slate-500">/secure/payment</span>
                            </span>
                        </div>

                        <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                            Pay with
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {methods.map((m) => {
                                const isActive = method === m.id

                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        aria-pressed={isActive}
                                        className={cn(
                                            'inline-flex min-h-11 items-center gap-1.5 rounded-xl border px-4 font-mono text-xs font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]',
                                            isActive
                                                ? 'border-[#10b981] bg-[#10b981]/10 text-white'
                                                : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25 hover:text-white',
                                        )}
                                        onClick={() => setMethod(m.id)}
                                    >
                                        {isActive && (
                                            <LuCheck aria-hidden="true" className="h-3.5 w-3.5 text-[#10b981]" />
                                        )}
                                        {m.id}
                                    </button>
                                )
                            })}
                        </div>
                        <div aria-live="polite" className="mt-4 min-h-[3rem] text-sm leading-relaxed text-slate-400">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.p
                                    key={method}
                                    initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeNote}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <ul className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
                            {badges.map((badge) => {
                                const Icon = badge.icon

                                return (
                                    <li
                                        key={badge.id}
                                        className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0b1222] p-3.5"
                                    >
                                        <Icon aria-hidden="true" className="h-5 w-5 text-[#10b981]" />
                                        <span className="text-sm font-semibold text-white">{badge.title}</span>
                                        <span className="font-mono text-[11px] text-slate-500">{badge.detail}</span>
                                    </li>
                                )
                            })}
                        </ul>

                        <p className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                            <span>We will never ask for your card PIN or password by email.</span>
                            <a
                                href="#security"
                                className="inline-flex min-h-10 items-center gap-1 font-medium text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                            >
                                Security &amp; privacy
                            </a>
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-emerald-400/[0.07] to-transparent p-8 text-center sm:p-10">
                        <div
                            role="img"
                            aria-label="100% satisfaction guaranteed seal"
                            className="relative h-52 w-52 sm:h-60 sm:w-60"
                        >
                            <motion.svg
                                aria-hidden="true"
                                viewBox="0 0 200 200"
                                className="absolute inset-0 h-full w-full"
                                animate={{ rotate: reduce ? 0 : 360 }}
                                transition={
                                    reduce
                                        ? { duration: 0 }
                                        : { duration: 28, ease: 'linear', repeat: Infinity }
                                }
                            >
                                <defs>
                                    <path
                                        id={pathId}
                                        d="M 100,100 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0"
                                    />
                                </defs>
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="97"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeOpacity="0.4"
                                    strokeDasharray="1.5 4.5"
                                />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="62"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeOpacity="0.35"
                                />
                                <text className="fill-emerald-300 font-mono text-[16px] font-semibold uppercase">
                                    <textPath href={`#${pathId}`} textLength="470" lengthAdjust="spacing">
                                        100% Satisfaction Guaranteed ·
                                    </textPath>
                                </text>
                            </motion.svg>
                            <div className="absolute inset-[23%] flex flex-col items-center justify-center rounded-full bg-[#10b981] text-[#0f172a] shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                                <LuBadgeCheck aria-hidden="true" className="h-8 w-8 sm:h-9 sm:w-9" />
                                <span className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] sm:text-[11px]">
                                    30-day
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-[11px]">
                                    Money back
                                </span>
                            </div>
                        </div>
                        <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white">
                            Love it, or it’s on us.
                        </h3>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
                            Not right? Return it within 30 days for a full refund — shipping
                            both ways included, no restocking fees.
                        </p>
                        <a
                            href="#guarantee"
                            className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                        >
                            Read the guarantee
                            <LuArrowRight
                                aria-hidden="true"
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SecureCheckoutTrustBadges

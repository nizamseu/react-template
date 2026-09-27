// BigNumeralTrustBadges

// TrustBadges02 · E-commerce & Marketplaces › Trust Badges & Policies

// Description:
// A night-navy statement band for the Marlow & Finch menswear store that sells its service
// promises as four giant serif numerals: "30" day returns, "$0" shipping fees, "24/7"
// concierge support and "100%" secure checkout, each with a small-caps label and a one-line
// explanation. The heading reads "Four numbers we’re happy to be held to." Use it between
// product rails or right above the footer when the policies are a selling point.

// Design:
// - Two-part header (stacked → lg: 7/5 split) above a dl grid: 1 → sm:2 → lg:4 columns,
//   each stat under a gold hairline with a numbered mono tag
// - Navy #111b2e background, warm ivory #ece6d8 text, gold #d4a24c for rules, prefixes /
//   suffixes ("$", "/7", "%"), the italic accent word and a soft radial glow top-right
// - Numerals font-serif text-8xl → xl:text-9xl, leading-none, tracking-tighter; the
//   prefix/suffix sit as half-size gold superscripts; labels use all-small-caps
// - Numbers count up (or down, for "$49 → $0") over 1.8s with a 120ms stagger the first
//   time the grid scrolls into view; reduced motion shows the final values immediately
// - Section padding py-20 → md:py-28; gap-y-14 between stacked stats on mobile

// What it does:
// - Each numeral is a framer-motion MotionValue rendered as text (no React re-renders);
//   useInView (once, 35% visible) starts animate() and the effect stops it on unmount.
// - Server/first render shows the final values; on mount they reset to their start value
//   so the count is visible, unless useReducedMotion() is true.
// - Screen readers get the final figure via sr-only text; the animated digits are
//   aria-hidden. The footnote links "Read the full policies" to #policies.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BigNumeralTrustBadges from '@/TestComponent/PageSections/ecommerce/TrustBadges02';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <BigNumeralTrustBadges />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const stats = [
    {
        id: 'returns',
        from: 0,
        to: 30,
        prefix: '',
        suffix: '',
        spoken: '30',
        label: 'Day returns',
        text: 'Free return label on every order. No forms, no questions asked.',
    },
    {
        id: 'shipping',
        from: 49,
        to: 0,
        prefix: '$',
        suffix: '',
        spoken: '$0',
        label: 'Shipping fees',
        text: 'Complimentary two-day express on all US orders over $150.',
    },
    {
        id: 'support',
        from: 0,
        to: 24,
        prefix: '',
        suffix: '/7',
        spoken: '24/7',
        label: 'Concierge support',
        text: 'A real stylist answers by chat, phone or email — day or night.',
    },
    {
        id: 'secure',
        from: 0,
        to: 100,
        prefix: '',
        suffix: '%',
        spoken: '100%',
        label: 'Secure checkout',
        text: 'Encrypted payments and fraud screening on every transaction.',
    },
]

function CountUpNumeral({ stat, start, reduce, delay }) {
    const value = useMotionValue(stat.to)
    const rounded = useTransform(value, (v) => Math.round(v))

    useEffect(() => {
        if (reduce) {
            value.set(stat.to)
            return undefined
        }
        if (!start) {
            value.set(stat.from)
            return undefined
        }
        const controls = animate(value, stat.to, {
            duration: 1.8,
            delay,
            ease: [0.16, 1, 0.3, 1],
        })
        return () => controls.stop()
    }, [start, reduce, delay, stat.from, stat.to, value])

    return (
        <span
            aria-hidden="true"
            className="flex items-start font-serif text-8xl leading-none tracking-tighter tabular-nums xl:text-9xl"
        >
            {stat.prefix && (
                <span className="mt-[0.08em] mr-1 text-[0.45em] text-[#d4a24c]">{stat.prefix}</span>
            )}
            <motion.span>{rounded}</motion.span>
            {stat.suffix && (
                <span className="mt-[0.08em] ml-1 text-[0.45em] text-[#d4a24c]">{stat.suffix}</span>
            )}
        </span>
    )
}

export function BigNumeralTrustBadges({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const gridRef = useRef(null)
    const inView = useInView(gridRef, { once: true, amount: 0.35 })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#111b2e] px-4 py-20 text-[#ece6d8] antialiased sm:px-6 md:py-28 lg:px-10 text-base font-normal',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-48 -right-40 -z-10 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(212,162,76,0.22),transparent_65%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#d4a24c]/40 to-transparent"
            />

            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-[#d4a24c]">
                            <span aria-hidden="true" className="h-px w-10 bg-[#d4a24c]" />
                            The Marlow &amp; Finch standard
                        </p>
                        <h2 className="mt-6 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl text-[#ece6d8] font-normal">
                            Four numbers we’re{' '}
                            <em className="text-[#d4a24c]">happy</em> to be held to.
                        </h2>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-[#ece6d8]/70 sm:text-base lg:col-span-5 lg:justify-self-end">
                        Tailoring is a long relationship. So instead of fine print, we put
                        our service promises in type large enough to hold us to them.
                    </p>
                </div>

                <dl
                    ref={gridRef}
                    className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-4"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                            animate={inView ? { opacity: 1, y: 0 } : undefined}
                            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col border-t border-[#d4a24c]/45 pt-6"
                        >
                            <dt className="flex items-center justify-between gap-4">
                                <span className="font-serif text-xl tracking-[0.08em] text-[#ece6d8] [font-variant-caps:all-small-caps]">
                                    {stat.label}
                                </span>
                                <span className="font-mono text-[11px] tracking-[0.2em] text-[#d4a24c]/80">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                            </dt>
                            <dd className="mt-6">
                                <span className="sr-only">{stat.spoken}</span>
                                <CountUpNumeral
                                    stat={stat}
                                    start={inView}
                                    reduce={reduce}
                                    delay={0.1 + i * 0.12}
                                />
                            </dd>
                            <dd className="mt-6 max-w-[18rem] text-sm leading-relaxed text-[#ece6d8]/65">
                                {stat.text}
                            </dd>
                        </motion.div>
                    ))}
                </dl>

                <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-[#ece6d8]/55 sm:flex-row sm:items-center sm:justify-between">
                    <p>Express shipping applies within the contiguous US. Returns window starts on delivery.</p>
                    <a
                        href="#policies"
                        className="group inline-flex min-h-10 items-center gap-2 self-start text-sm font-medium text-[#d4a24c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4a24c] sm:self-auto"
                    >
                        Read the full policies
                        <HiArrowRight
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default BigNumeralTrustBadges

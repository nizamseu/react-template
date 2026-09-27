// AwardBadgeLogoCloud

// LogoCloud04 · SaaS Platforms › Client / Social Proof Bar

// Description:
// A confident awards-and-ratings band for the sales CRM Beacon. The heading "The CRM reps
// actually open every morning." sits beside a 4.9 / 5 rating card with a star breakdown and
// a cluster of five review-site badges from fictional sites ("StackRank 4.9 ★", "ReviewHub
// Leader · Fall 2026", "Fastest ROI · Mid-Market", "TrustPeak Top Rated" …). A row of
// customer wordmarks closes it. Use it on pricing pages or right before a demo-request form
// to remove doubt.

// Design:
// - Lavender #f5f3ff background, ink violet #1e1b4b text, purple #7c3aed accent; soft
//   radial glow behind the badges and a white rating card with a violet-200 border
// - Split layout: lg:grid-cols-2; the left column holds copy + rating card, the right a
//   flex-wrap cluster of five SVG badges (shield, hexagon, rosette, circle with laurels),
//   each tilted a few degrees
// - Badges are SVG shapes with HTML text on top: white, purple or ink fills, tiny tracked
//   uppercase labels and an extra-bold sans headline; rating bars are rounded-full tracks
// - Motion: badges pop in with a stagger, then bob gently (5–7s loops, offset per badge) and
//   straighten + scale on hover; bars grow when in view; all loops stop for reduced motion
// - Responsive: badges are w-32 → sm:w-36 → xl:w-40 and wrap two or three per row; the
//   wordmark row goes 2 → sm:3 → lg:6 columns; everything stacks below lg

// What it does:
// - No state: entrance, bobbing and hover motion are visual only (useReducedMotion() turns
//   the bob off and the entrance into a fade)
// - Rating bars are a labelled list ("5 stars, 91% of reviews") for screen readers
// - "Read all 2,318 reviews" links to #beacon-reviews and "Book a 20-minute demo" to
//   #beacon-demo; each badge is role="img" with a full aria-label, wordmarks are plain text

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AwardBadgeLogoCloud from '@/TestComponent/PageSections/saas/LogoCloud04';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <AwardBadgeLogoCloud />
//     </main>
// )
// ```

'use client'

import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const badges = [
    {
        id: 'stackrank',
        shape: 'shield',
        site: 'StackRank',
        title: '4.9 ★',
        detail: '2,318 reviews',
        fill: '#ffffff',
        text: 'text-[#1e1b4b]',
        band: '#7c3aed',
        tilt: -4,
    },
    {
        id: 'leader',
        shape: 'hexagon',
        site: 'ReviewHub',
        title: 'Leader',
        detail: 'Fall 2026',
        fill: '#7c3aed',
        text: 'text-white',
        band: '#1e1b4b',
        tilt: 3,
    },
    {
        id: 'roi',
        shape: 'rosette',
        site: 'ReviewHub',
        title: 'Fastest ROI',
        detail: 'Mid-Market',
        fill: '#1e1b4b',
        text: 'text-white',
        band: '#a78bfa',
        tilt: -2,
    },
    {
        id: 'support',
        shape: 'hexagon',
        site: 'SaaSScore',
        title: 'Best Support',
        detail: 'Enterprise · 2026',
        fill: '#ffffff',
        text: 'text-[#1e1b4b]',
        band: '#7c3aed',
        tilt: 5,
    },
    {
        id: 'loved',
        shape: 'laurel',
        site: 'TrustPeak',
        title: 'Top Rated',
        detail: '97% recommend',
        fill: '#ede9fe',
        text: 'text-[#4c1d95]',
        band: '#7c3aed',
        tilt: -5,
    },
]

const breakdown = [
    { stars: 5, share: 91 },
    { stars: 4, share: 7 },
    { stars: 3, share: 1 },
    { stars: 2, share: 1 },
]

const customers = [
    { id: 'brightloop', name: 'Brightloop', type: 'font-sans text-lg font-bold tracking-tight', mark: 'circle' },
    { id: 'vantage', name: 'VANTAGE LABS', type: 'font-sans text-xs font-extrabold tracking-[0.22em]', mark: 'triangle' },
    { id: 'northbeam', name: 'Northbeam', type: 'font-serif text-xl italic', mark: 'bolt' },
    { id: 'hexa', name: 'hexa', type: 'font-mono text-lg font-bold', mark: 'hex' },
    { id: 'quarry', name: 'Quarry', type: 'font-serif text-lg font-semibold tracking-wide', mark: 'square' },
    { id: 'lumos', name: 'Lumos Health', type: 'font-sans text-base font-medium', mark: 'plus' },
]

function BadgeShape({ shape, fill, band }) {
    const svg = {
        viewBox: '0 0 120 150',
        className: 'absolute inset-0 h-full w-full drop-shadow-[0_14px_22px_rgba(76,29,149,0.22)]',
        'aria-hidden': true,
    }
    if (shape === 'shield') {
        return (
            <svg {...svg}>
                <path d="M60 3 114 18v58c0 36-24 58-54 71C30 134 6 112 6 76V18Z" fill={fill} stroke="#ddd6fe" strokeWidth="2" />
                <path d="M6 18 60 3l54 15v14H6Z" fill={band} />
            </svg>
        )
    }
    if (shape === 'hexagon') {
        return (
            <svg {...svg}>
                <path d="M60 3 115 33v84L60 147 5 117V33Z" fill={fill} stroke="#ddd6fe" strokeWidth="2" />
                <path d="M5 101h110v16L60 147 5 117Z" fill={band} />
            </svg>
        )
    }
    if (shape === 'rosette') {
        return (
            <svg {...svg}>
                <path d="M34 92 22 146l20-10 12 14 10-50ZM86 92l12 54-20-10-12 14-10-50Z" fill={band} />
                <circle cx="60" cy="62" r="56" fill={fill} />
                <circle cx="60" cy="62" r="47" fill="none" stroke={band} strokeWidth="2" strokeDasharray="3 5" />
            </svg>
        )
    }
    return (
        <svg {...svg}>
            <circle cx="60" cy="72" r="52" fill={fill} stroke="#c4b5fd" strokeWidth="2" />
            {[0, 1, 2, 3, 4].map((leaf) => (
                <g key={leaf} fill={band}>
                    <ellipse cx="0" cy="0" rx="4" ry="9" transform={`translate(${14 + leaf * 2} ${104 - leaf * 16}) rotate(${-40 + leaf * 12})`} />
                    <ellipse cx="0" cy="0" rx="4" ry="9" transform={`translate(${106 - leaf * 2} ${104 - leaf * 16}) rotate(${40 - leaf * 12})`} />
                </g>
            ))}
        </svg>
    )
}

function CustomerMark({ mark }) {
    const svg = { viewBox: '0 0 24 24', className: 'h-5 w-5 shrink-0', fill: 'currentColor', 'aria-hidden': true }
    switch (mark) {
        case 'circle':
            return (
                <svg {...svg}>
                    <path d="M12 2a10 10 0 1 0 10 10h-10Z" />
                </svg>
            )
        case 'triangle':
            return (
                <svg {...svg}>
                    <path d="M12 3 22 21H2Z" />
                </svg>
            )
        case 'bolt':
            return (
                <svg {...svg}>
                    <path d="M13 2 4 14h7l-1 8 9-12h-7Z" />
                </svg>
            )
        case 'hex':
            return (
                <svg {...svg}>
                    <path d="M12 2 21 7v10l-9 5-9-5V7Z" />
                </svg>
            )
        case 'square':
            return (
                <svg {...svg}>
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <rect x="8" y="8" width="8" height="8" rx="1" fill="#f5f3ff" />
                </svg>
            )
        default:
            return (
                <svg {...svg}>
                    <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7Z" />
                </svg>
            )
    }
}

export function AwardBadgeLogoCloud({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#f5f3ff] py-16 text-base font-normal text-[#1e1b4b] md:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="absolute right-[-10%] top-10 -z-10 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.18),transparent_65%)]"
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-12">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7c3aed]">
                            Beacon CRM · Rated by 2,318 sales teams
                        </p>
                        <h2 className="mt-5 max-w-xl text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[#1e1b4b] sm:text-5xl lg:text-[3.5rem]">
                            The CRM reps actually open <span className="text-[#7c3aed]">every morning.</span>
                        </h2>
                        <p className="mt-5 max-w-lg text-base leading-relaxed text-[#1e1b4b]/70">
                            Beacon logs calls, emails and meetings for you, so pipeline reviews stop being
                            data-entry reviews. Reviewers keep saying the same thing: it just gets used.
                        </p>

                        <div className="mt-8 max-w-lg rounded-3xl border border-[#ddd6fe] bg-white p-5 shadow-[0_20px_40px_-28px_rgba(76,29,149,0.45)] sm:p-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
                                <div className="shrink-0">
                                    <p className="text-5xl font-bold leading-none tracking-tight text-[#1e1b4b]">
                                        4.9<span className="text-xl font-semibold text-[#1e1b4b]/40"> / 5</span>
                                    </p>
                                    <p className="mt-2 flex text-[#7c3aed]" aria-label="Average rating 4.9 out of 5 stars">
                                        {[0, 1, 2, 3, 4].map((star) => (
                                            <HiStar key={star} className="h-5 w-5" aria-hidden="true" />
                                        ))}
                                    </p>
                                    <p className="mt-1 text-xs text-[#1e1b4b]/60">2,318 verified reviews</p>
                                </div>
                                <ul className="flex-1 space-y-2" aria-label="Rating breakdown">
                                    {breakdown.map((row, index) => (
                                        <li
                                            key={row.stars}
                                            aria-label={`${row.stars} stars, ${row.share}% of reviews`}
                                            className="flex items-center gap-3 text-xs font-semibold text-[#1e1b4b]/70"
                                        >
                                            <span className="w-6 shrink-0" aria-hidden="true">
                                                {row.stars}★
                                            </span>
                                            <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#ede9fe]" aria-hidden="true">
                                                <motion.span
                                                    className="block h-full origin-left rounded-full bg-[#7c3aed]"
                                                    style={{ width: `${Math.max(row.share, 2)}%` }}
                                                    initial={{ scaleX: reduceMotion ? 1 : 0 }}
                                                    whileInView={{ scaleX: 1 }}
                                                    viewport={{ once: true, amount: 0.8 }}
                                                    transition={{ duration: 0.9, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                                />
                                            </span>
                                            <span className="w-8 shrink-0 text-right tabular-nums" aria-hidden="true">
                                                {row.share}%
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href="#beacon-demo"
                                className="inline-flex min-h-11 items-center rounded-full bg-[#7c3aed] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(124,58,237,0.9)] transition-colors hover:bg-[#6d28d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                            >
                                Book a 20-minute demo
                            </a>
                            <a
                                href="#beacon-reviews"
                                className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#1e1b4b] transition-colors hover:text-[#7c3aed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                            >
                                Read all 2,318 reviews
                                <HiArrowLongRight
                                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </a>
                        </div>
                    </div>

                    <ul
                        aria-label="Awards and ratings"
                        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-6 sm:gap-x-6 lg:gap-y-8"
                    >
                        {badges.map((badge, index) => (
                            <motion.li
                                key={badge.id}
                                className="w-32 sm:w-36 xl:w-40"
                                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                            >
                                <motion.div
                                    role="img"
                                    aria-label={`${badge.site}: ${badge.title.replace(' ★', ' stars')}, ${badge.detail}`}
                                    className="relative aspect-[4/5] w-full cursor-default"
                                    style={{ rotate: badge.tilt }}
                                    animate={reduceMotion ? { y: 0 } : { y: [0, -7, 0] }}
                                    transition={
                                        reduceMotion
                                            ? { duration: 0 }
                                            : { duration: 5 + index * 0.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }
                                    }
                                    whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.06 }}
                                >
                                    <BadgeShape shape={badge.shape} fill={badge.fill} band={badge.band} />
                                    <div
                                        className={cn(
                                            'absolute inset-x-2 flex flex-col items-center text-center',
                                            badge.shape === 'hexagon' ? 'top-[24%]' : 'top-[27%]',
                                            badge.shape === 'shield' && 'top-[6%]',
                                            badge.text,
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px]',
                                                badge.shape === 'shield' ? 'text-white' : 'opacity-75',
                                            )}
                                        >
                                            {badge.site}
                                        </span>
                                        <span
                                            className={cn(
                                                'font-extrabold leading-tight tracking-tight',
                                                badge.shape === 'shield' ? 'mt-6 text-3xl sm:text-4xl' : 'mt-2 text-base sm:text-lg',
                                            )}
                                        >
                                            {badge.title}
                                        </span>
                                        <span className="mt-1 text-[10px] font-semibold leading-snug opacity-80 sm:text-[11px]">
                                            {badge.detail}
                                        </span>
                                    </div>
                                </motion.div>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                <div className="mt-16 border-t border-[#7c3aed]/15 pt-10 md:mt-20">
                    <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-[#1e1b4b]/55">
                        Pipelines at 3,000+ revenue teams run on Beacon
                    </p>
                    <ul className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
                        {customers.map((customer) => (
                            <li
                                key={customer.id}
                                className="flex min-w-0 items-center justify-center gap-2 text-[#4c1d95]/55 transition-colors duration-300 hover:text-[#4c1d95]"
                            >
                                <CustomerMark mark={customer.mark} />
                                <span className={cn('truncate leading-none', customer.type)}>{customer.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default AwardBadgeLogoCloud

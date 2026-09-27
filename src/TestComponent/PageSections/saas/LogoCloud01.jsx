// TwinMarqueeLogoCloud

// LogoCloud01 · SaaS Platforms › Client / Social Proof Bar

// Description:
// A bright, airy social-proof band for the workflow-automation platform Relay. Under the
// centred heading "Trusted by 9,000+ teams" two rows of fictional customer wordmarks
// (Kestrel, Oakline, Vantage Labs, Lumos Health, Tidewater …) glide in opposite directions
// between faded edges, followed by a review score, a SOC 2 note and a "Read 140+ customer
// stories" link. Use it directly under a hero or above pricing on a SaaS landing page.

// Design:
// - Centred stack on white #ffffff with a faint zinc dot grid and a soft indigo glow;
//   max-w-6xl content, two full-width marquee rows with 12% masked (faded) edges
// - Palette: zinc #18181b headings, zinc #71717a wordmarks, indigo #4338ca accent (eyebrow
//   dot, "9,000+" and focus rings); wordmarks sit in rounded-full pills with zinc-200 borders
// - Each logo is a tiny inline SVG mark plus its own type treatment (serif italic, mono caps,
//   heavy sans …) so the row reads as a real mix of brands; heading text-4xl → md:text-6xl
// - Motion: framer-motion useAnimationFrame moves the rows (left ≈ 36px/s, right ≈ 30px/s)
//   and wraps at half the doubled track, so the loop is seamless at every width
// - Responsive: pills grow from h-14 to md:h-16, the footer stacks on mobile and becomes
//   one centred line from md; the root is overflow-hidden so the tracks never scroll the page

// What it does:
// - Hovering either row pauses both; the "Pause logos" button (aria-pressed) stops them
//   until pressed again, and useReducedMotion() keeps the rows still
// - The second copy of each row is aria-hidden; the real list is announced once per row
// - "Read 140+ customer stories" links to #relay-customer-stories; wordmarks are visual-only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TwinMarqueeLogoCloud from '@/TestComponent/PageSections/saas/LogoCloud01';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <TwinMarqueeLogoCloud />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowLongRight, HiPause, HiPlay, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const topRow = [
    { id: 'kestrel', name: 'Kestrel', mark: 'wing', type: 'font-sans text-lg font-bold tracking-tight' },
    { id: 'oakline', name: 'Oakline', mark: 'leaf', type: 'font-serif text-xl italic' },
    { id: 'vantage', name: 'Vantage Labs', mark: 'squares', type: 'font-sans text-base font-semibold tracking-[-0.02em]' },
    { id: 'polymer', name: 'POLYMER', mark: 'molecule', type: 'font-mono text-sm font-bold tracking-[0.22em]' },
    { id: 'hexa', name: 'hexa', mark: 'hexagon', type: 'font-sans text-xl font-black lowercase tracking-tight' },
    { id: 'brightloop', name: 'Brightloop', mark: 'loop', type: 'font-sans text-lg font-medium tracking-tight' },
    { id: 'northbeam', name: 'NORTHBEAM', mark: 'beam', type: 'font-sans text-sm font-extrabold tracking-[0.18em]' },
]

const bottomRow = [
    { id: 'quarry', name: 'Quarry', mark: 'stack', type: 'font-serif text-xl font-semibold' },
    { id: 'lumos', name: 'Lumos Health', mark: 'cross', type: 'font-sans text-base font-semibold tracking-tight' },
    { id: 'tidewater', name: 'tidewater', mark: 'waves', type: 'font-sans text-lg font-light tracking-wide' },
    { id: 'fernway', name: 'Fernway', mark: 'diamond', type: 'font-serif text-lg font-bold tracking-tight' },
    { id: 'castellan', name: 'CASTELLAN', mark: 'tower', type: 'font-serif text-sm font-semibold tracking-[0.28em]' },
    { id: 'orbitly', name: 'orbitly', mark: 'orbit', type: 'font-mono text-base font-semibold' },
    { id: 'driftline', name: 'Driftline', mark: 'slash', type: 'font-sans text-lg font-bold italic tracking-tight' },
]

function LogoMark({ mark }) {
    const common = {
        viewBox: '0 0 24 24',
        className: 'h-6 w-6 shrink-0',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
    }
    switch (mark) {
        case 'wing':
            return (
                <svg {...common}>
                    <path d="M2 18 12 5l10 13-10-4Z" fill="currentColor" stroke="none" />
                </svg>
            )
        case 'leaf':
            return (
                <svg {...common}>
                    <path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14Z" />
                    <path d="M5 19 13 11" />
                </svg>
            )
        case 'squares':
            return (
                <svg {...common}>
                    <rect x="3" y="3" width="12" height="12" rx="2" />
                    <rect x="9" y="9" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
                </svg>
            )
        case 'molecule':
            return (
                <svg {...common}>
                    <circle cx="6" cy="7" r="3" />
                    <circle cx="18" cy="7" r="3" />
                    <circle cx="12" cy="18" r="3" fill="currentColor" />
                    <path d="M8.5 9 11 15.5M15.5 9 13 15.5M9 7h6" />
                </svg>
            )
        case 'hexagon':
            return (
                <svg {...common}>
                    <path d="M12 2 21 7v10l-9 5-9-5V7Z" fill="currentColor" stroke="none" />
                </svg>
            )
        case 'loop':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="18" cy="6" r="3" fill="currentColor" stroke="none" />
                </svg>
            )
        case 'beam':
            return (
                <svg {...common}>
                    <path d="M12 2v20M4 10l8-8 8 8" />
                </svg>
            )
        case 'stack':
            return (
                <svg {...common}>
                    <path d="M4 7h16M6 12h12M8 17h8" strokeWidth="3" />
                </svg>
            )
        case 'cross':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
                    <path d="M12 7v10M7 12h10" stroke="#ffffff" strokeWidth="2.5" />
                </svg>
            )
        case 'waves':
            return (
                <svg {...common}>
                    <path d="M2 9c3-3 5-3 8 0s5 3 8 0 3-2 4-2M2 16c3-3 5-3 8 0s5 3 8 0 3-2 4-2" />
                </svg>
            )
        case 'diamond':
            return (
                <svg {...common}>
                    <path d="M12 2 22 12 12 22 2 12Z" />
                    <path d="M12 7 17 12 12 17 7 12Z" fill="currentColor" stroke="none" />
                </svg>
            )
        case 'tower':
            return (
                <svg {...common}>
                    <path d="M4 21V5h3v3h3V5h4v3h3V5h3v16Z" fill="currentColor" stroke="none" />
                </svg>
            )
        case 'orbit':
            return (
                <svg {...common}>
                    <ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-25 12 12)" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
                </svg>
            )
        default:
            return (
                <svg {...common}>
                    <path d="M4 20 12 4M11 20 19 4" strokeWidth="3" />
                </svg>
            )
    }
}

function MarqueeRow({ logos, direction, speed, paused, reduceMotion, label }) {
    const progress = useMotionValue(direction < 0 ? 0 : -50)
    const x = useTransform(progress, (value) => `${value}%`)

    useAnimationFrame((_, delta) => {
        if (paused || reduceMotion) return
        let next = progress.get() + direction * speed * Math.min(delta, 64) / 1000
        if (next <= -50) next += 50
        if (next > 0) next -= 50
        progress.set(next)
    })

    return (
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <motion.ul aria-label={label} style={{ x }} className="flex w-max">
                {[...logos, ...logos].map((logo, index) => (
                    <li
                        key={`${logo.id}-${index}`}
                        aria-hidden={index >= logos.length || undefined}
                        className="pr-3 md:pr-4"
                    >
                        <span className="group/logo flex h-14 items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-6 text-[#71717a] shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-colors duration-300 hover:border-[#4338ca]/30 hover:text-[#18181b] md:h-16 md:px-8">
                            <LogoMark mark={logo.mark} />
                            <span className={cn('whitespace-nowrap leading-none', logo.type)}>{logo.name}</span>
                        </span>
                    </li>
                ))}
            </motion.ul>
        </div>
    )
}

export function TwinMarqueeLogoCloud({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [hovered, setHovered] = useState(false)
    const [userPaused, setUserPaused] = useState(false)
    const paused = hovered || userPaused

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#ffffff] py-16 text-base font-normal text-[#3f3f46] md:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
            />
            <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 -z-10 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-[#4338ca]/10 blur-3xl"
            />

            <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
                <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3f3f46] shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4338ca]" aria-hidden="true" />
                    Relay · Customer network
                </p>
                <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#18181b] sm:text-5xl md:text-6xl">
                    Trusted by <span className="text-[#4338ca]">9,000+</span> teams
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#71717a] md:text-lg">
                    Ops, RevOps and IT teams run 1.8 billion automated steps a month on Relay, from
                    12-person agencies to 40,000-seat enterprises.
                </p>
            </div>

            <div
                className="mt-12 space-y-3 md:mt-16 md:space-y-4"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <MarqueeRow
                    logos={topRow}
                    direction={-1}
                    speed={1.2}
                    paused={paused}
                    reduceMotion={reduceMotion}
                    label="Relay customers, part one"
                />
                <MarqueeRow
                    logos={bottomRow}
                    direction={1}
                    speed={1}
                    paused={paused}
                    reduceMotion={reduceMotion}
                    label="Relay customers, part two"
                />
            </div>

            <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-4 px-4 text-sm text-[#71717a] sm:px-6 md:mt-12 md:flex-row md:justify-center md:gap-6 lg:px-8">
                <p className="flex items-center gap-1.5">
                    <span className="flex text-[#4338ca]" aria-hidden="true">
                        {[0, 1, 2, 3, 4].map((star) => (
                            <HiStar key={star} className="h-4 w-4" />
                        ))}
                    </span>
                    <span>
                        <strong className="font-semibold text-[#18181b]">4.8 / 5</strong> from 2,600 reviews
                    </span>
                </p>
                <span className="hidden h-4 w-px bg-zinc-200 md:block" aria-hidden="true" />
                <p>SOC 2 Type II · 99.99% uptime in 2026</p>
                <span className="hidden h-4 w-px bg-zinc-200 md:block" aria-hidden="true" />
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                        type="button"
                        aria-pressed={userPaused}
                        onClick={() => setUserPaused((value) => !value)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-zinc-200 px-4 text-xs font-semibold text-[#3f3f46] transition-colors hover:border-[#4338ca]/40 hover:text-[#4338ca] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]"
                    >
                        {userPaused ? (
                            <HiPlay className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                            <HiPause className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {userPaused ? 'Play logos' : 'Pause logos'}
                    </button>
                    <a
                        href="#relay-customer-stories"
                        className="group inline-flex min-h-10 items-center gap-2 rounded-full bg-[#18181b] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#4338ca] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]"
                    >
                        Read 140+ customer stories
                        <HiArrowLongRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default TwinMarqueeLogoCloud

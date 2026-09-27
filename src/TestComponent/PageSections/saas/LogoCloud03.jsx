// HoverStatLogoCloud

// LogoCloud03 · SaaS Platforms › Client / Social Proof Bar

// Description:
// A crisp, specimen-sheet logo wall for the design-collaboration tool Canvasly. Under the
// heading "Good work gets reviewed here." eight wordmark tiles (Kestrel, Oakline, Polymer,
// Hexa …) each hide a customer result: hover, focus or tap a tile and it flips to the
// number, e.g. "42% shorter review cycles". A closing line and "Browse all customer
// results" link finish it. Use it where proof should feel tangible, not decorative.

// Design:
// - Warm white #faf7f2 page with ink #111111 text and a single coral #ff5a36 accent (cursor
//   tag, focus ring, tile dot); a shared 1px black grid (border-l/-t on the list,
//   border-r/-b per tile) makes the wall read like a printed specimen sheet
// - Tiles: h-36 → sm:h-44; front shows an SVG mark + wordmark and a tiny "01" index; the back
//   is solid ink with a warm white text-4xl → lg:text-5xl stat, caption and team size
// - Flip: framer-motion rotateY 0 → 180 on a preserve-3d wrapper with backface-hidden faces
//   (spring, ~0.6s); a decorative multiplayer cursor tag ("Maya · Kestrel") floats by the
//   heading from md up
// - Header splits into heading and helper text at md; mono meta row with thin rules on top
// - Responsive grid: 2 columns → sm:3 → lg:4; the root is overflow-hidden

// What it does:
// - One tile is active at a time: mouse hover or keyboard focus (focus-visible) flips it,
//   leaving or blurring flips it back; tap or Enter/Space toggles it (aria-pressed)
// - Each tile's aria-label carries the brand and its result, so the stat is always announced
// - useReducedMotion() swaps the 3D flip for an instant crossfade; the link goes to
//   #canvasly-customer-results

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HoverStatLogoCloud from '@/TestComponent/PageSections/saas/LogoCloud03';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <HoverStatLogoCloud />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tiles = [
    {
        id: 'kestrel',
        name: 'Kestrel',
        mark: 'wing',
        type: 'font-sans text-xl font-bold tracking-tight',
        stat: '42%',
        result: 'shorter review cycles',
        team: 'Product design · 38 designers',
    },
    {
        id: 'oakline',
        name: 'Oakline',
        mark: 'arc',
        type: 'font-serif text-2xl italic',
        stat: '3.1×',
        result: 'more feedback per file',
        team: 'Brand studio · 14 designers',
    },
    {
        id: 'polymer',
        name: 'POLYMER',
        mark: 'dots',
        type: 'font-mono text-sm font-bold tracking-[0.24em]',
        stat: '−9 days',
        result: 'from first mock to dev handoff',
        team: 'Platform UX · 22 designers',
    },
    {
        id: 'hexa',
        name: 'hexa',
        mark: 'hex',
        type: 'font-sans text-2xl font-black lowercase tracking-tighter',
        stat: '120',
        result: 'stakeholders commenting each week',
        team: 'Growth · 9 designers',
    },
    {
        id: 'northbeam',
        name: 'Northbeam',
        mark: 'star',
        type: 'font-sans text-lg font-semibold tracking-tight',
        stat: '0',
        result: 'comments lost since leaving email',
        team: 'Mobile · 17 designers',
    },
    {
        id: 'fernway',
        name: 'Fernway',
        mark: 'frond',
        type: 'font-serif text-xl font-bold',
        stat: '64%',
        result: 'fewer status meetings',
        team: 'Design systems · 11 designers',
    },
    {
        id: 'driftline',
        name: 'driftline',
        mark: 'bars',
        type: 'font-sans text-xl font-light italic tracking-wide',
        stat: '2 hrs',
        result: 'saved per designer, every week',
        team: 'Marketing design · 26 designers',
    },
    {
        id: 'castellan',
        name: 'CASTELLAN',
        mark: 'gate',
        type: 'font-serif text-sm font-semibold tracking-[0.3em]',
        stat: '18 → 4',
        result: 'review tools consolidated',
        team: 'Enterprise UX · 64 designers',
    },
]

function Mark({ mark }) {
    const svg = { viewBox: '0 0 24 24', className: 'h-7 w-7 shrink-0', 'aria-hidden': true }
    switch (mark) {
        case 'wing':
            return (
                <svg {...svg} fill="currentColor">
                    <path d="M2 19 13 4l2 7 7 1-9 7Z" />
                </svg>
            )
        case 'arc':
            return (
                <svg {...svg} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M4 20a8 8 0 0 1 16 0M8 20a4 4 0 0 1 8 0" />
                </svg>
            )
        case 'dots':
            return (
                <svg {...svg} fill="currentColor">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <rect x="15" y="15" width="6" height="6" />
                </svg>
            )
        case 'hex':
            return (
                <svg {...svg} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
                    <path d="M12 2 21 7v10l-9 5-9-5V7Z" />
                    <path d="M12 8 15.5 10v4L12 16l-3.5-2v-4Z" fill="currentColor" />
                </svg>
            )
        case 'star':
            return (
                <svg {...svg} fill="currentColor">
                    <path d="M12 1 14 10 23 12 14 14 12 23 10 14 1 12 10 10Z" />
                </svg>
            )
        case 'frond':
            return (
                <svg {...svg} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22V3M12 7l-5-3M12 7l5-3M12 12l-6-3M12 12l6-3M12 17l-7-3M12 17l7-3" />
                </svg>
            )
        case 'bars':
            return (
                <svg {...svg} fill="currentColor">
                    <rect x="3" y="10" width="4" height="11" rx="1" transform="skewX(-12)" />
                    <rect x="10" y="6" width="4" height="15" rx="1" transform="skewX(-12)" />
                    <rect x="17" y="2" width="4" height="19" rx="1" transform="skewX(-12)" />
                </svg>
            )
        default:
            return (
                <svg {...svg} fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M4 21V9a8 8 0 0 1 16 0v12M9 21v-8h6v8" />
                </svg>
            )
    }
}

function isFocusVisible(element) {
    try {
        return element.matches(':focus-visible')
    } catch {
        return true
    }
}

export function HoverStatLogoCloud({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState(null)
    const pointerType = useRef('mouse')

    const release = (id) => setActive((current) => (current === id ? null : current))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#faf7f2] py-16 text-base font-normal text-[#111111] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#111111]/60">
                    <span>Canvasly</span>
                    <span className="h-px flex-1 bg-[#111111]/20" aria-hidden="true" />
                    <span>Customer results</span>
                    <span className="hidden h-px w-16 bg-[#111111]/20 sm:block" aria-hidden="true" />
                    <span className="hidden sm:inline">Vol. 2026</span>
                </div>

                <div className="relative mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <h2 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-[#111111] sm:text-6xl lg:text-7xl">
                        Good work gets <span className="font-serif font-normal italic">reviewed</span> here.
                    </h2>
                    <p className="max-w-xs text-sm leading-relaxed text-[#111111]/65 md:text-right">
                        1,100 product teams run design crits in Canvasly. Hover, focus or tap a logo to
                        see what changed for them.
                    </p>

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-4 left-[58%] hidden -rotate-6 items-start md:flex"
                    >
                        <svg viewBox="0 0 16 16" className="h-5 w-5 text-[#ff5a36]">
                            <path d="M1 1 15 7 8.5 8.5 7 15Z" fill="currentColor" stroke="#faf7f2" strokeWidth="1" />
                        </svg>
                        <span className="mt-4 rounded-full rounded-tl-none bg-[#ff5a36] px-2.5 py-1 text-[11px] font-semibold text-white">
                            Maya · Kestrel
                        </span>
                    </div>
                </div>

                <ul className="mt-12 grid grid-cols-2 border-l border-t border-[#111111] sm:grid-cols-3 md:mt-16 lg:grid-cols-4">
                    {tiles.map((tile, index) => {
                        const flipped = active === tile.id
                        return (
                            <li key={tile.id} className="border-b border-r border-[#111111] [perspective:1200px]">
                                <button
                                    type="button"
                                    aria-pressed={flipped}
                                    aria-label={`${tile.name.charAt(0)}${tile.name.slice(1).toLowerCase()}: ${tile.stat} ${tile.result}`}
                                    className="group relative block h-36 w-full text-left focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[#ff5a36] sm:h-44"
                                    onPointerDown={(event) => {
                                        pointerType.current = event.pointerType
                                    }}
                                    onPointerEnter={(event) => {
                                        if (event.pointerType === 'mouse') setActive(tile.id)
                                    }}
                                    onPointerLeave={(event) => {
                                        if (event.pointerType === 'mouse') release(tile.id)
                                    }}
                                    onFocus={(event) => {
                                        if (isFocusVisible(event.currentTarget)) setActive(tile.id)
                                    }}
                                    onBlur={() => release(tile.id)}
                                    onClick={(event) => {
                                        if (event.detail !== 0 && pointerType.current === 'mouse') return
                                        setActive((current) => (current === tile.id ? null : tile.id))
                                    }}
                                >
                                    <motion.span
                                        aria-hidden="true"
                                        className="relative block h-full w-full [transform-style:preserve-3d]"
                                        animate={{ rotateY: flipped && !reduceMotion ? 180 : 0 }}
                                        transition={{ type: 'spring', stiffness: 170, damping: 22 }}
                                    >
                                        <span
                                            className={cn(
                                                'absolute inset-0 flex flex-col justify-between p-4 [backface-visibility:hidden] motion-reduce:transition-opacity motion-reduce:duration-200 sm:p-5',
                                                flipped ? 'motion-reduce:opacity-0' : 'motion-reduce:opacity-100',
                                            )}
                                        >
                                            <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#111111]/45">
                                                {String(index + 1).padStart(2, '0')}
                                                <span className="h-2 w-2 rounded-full border border-[#111111]/40 transition-colors group-hover:bg-[#ff5a36]" />
                                            </span>
                                            <span className="flex min-w-0 items-center gap-2.5 self-center text-[#111111]">
                                                <Mark mark={tile.mark} />
                                                <span className={cn('truncate leading-none', tile.type)}>{tile.name}</span>
                                            </span>
                                            <span className="h-3" />
                                        </span>

                                        <span
                                            className={cn(
                                                'absolute inset-0 flex flex-col justify-between bg-[#111111] p-4 text-[#faf7f2] [backface-visibility:hidden] [transform:rotateY(180deg)] motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:[transform:none] sm:p-5',
                                                flipped ? 'motion-reduce:opacity-100' : 'motion-reduce:opacity-0',
                                            )}
                                        >
                                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#faf7f2]/55">
                                                {tile.name}
                                            </span>
                                            <span>
                                                <span className="block text-4xl font-semibold leading-none tracking-[-0.04em] lg:text-5xl">
                                                    {tile.stat}
                                                </span>
                                                <span className="mt-2 block text-xs leading-snug text-[#faf7f2]/80 sm:text-sm">
                                                    {tile.result}
                                                </span>
                                            </span>
                                            <span className="hidden truncate font-mono text-[10px] text-[#faf7f2]/45 sm:block">
                                                {tile.team}
                                            </span>
                                        </span>
                                    </motion.span>
                                </button>
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-[#111111]/65">
                        Across all 1,100 teams: <strong className="font-semibold text-[#111111]">37% faster sign-off</strong>{' '}
                        in the first quarter.
                    </p>
                    <a
                        href="#canvasly-customer-results"
                        className="group inline-flex min-h-11 items-center gap-2 self-start border-b-2 border-[#111111] text-sm font-semibold text-[#111111] transition-colors hover:border-[#ff5a36] hover:text-[#ff5a36] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5a36] sm:self-auto"
                    >
                        Browse all customer results
                        <HiArrowLongRight
                            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default HoverStatLogoCloud

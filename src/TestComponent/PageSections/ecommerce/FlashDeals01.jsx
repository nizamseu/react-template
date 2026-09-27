// GiantCountdownFlashDeals

// FlashDeals01 · E-commerce & Marketplaces › Flash Deals / Countdown

// Description:
// A loud black-and-yellow flash-sale block for the fictional discount store Blitz Mart.
// A giant live HH:MM:SS countdown ("Blitz Hour #214 ends in") dominates the section under
// the heading "Half price. Full panic.", followed by a row of four deal cards with
// struck-through prices, % off stickers, stock meters and "Add to cart" buttons. Use it
// as a homepage takeover or at the top of a limited-time sale page.

// Design:
// - Full-bleed black section with a faint diagonal #ffe600 stripe texture and a yellow
//   radial glow behind the timer; max-w-7xl container, header row with "Shop all 48 deals"
// - Timer: three electric-yellow #ffe600 boxes with black font-black tabular digits
//   (text-5xl → sm:text-7xl → md:text-9xl), a hairline flip seam, unit labels in mono and
//   square yellow colon dots between the boxes; rounded-xl → md:rounded-3xl
// - Deal cards: #0f0f0f with a white/10 border that turns yellow on hover, square photos
//   that scale on hover, rotated "-50%" stickers, yellow price and white/40 line-through
// - Motion: each digit slides in from above when it changes and the colon dots pulse
//   (framer-motion); digits swap instantly and dots stay still with reduced motion
// - Responsive: header stacks on mobile and becomes a row on md; deals grid-cols-2 →
//   lg:grid-cols-4; timer paddings and gaps shrink so it fits a 360px screen

// What it does:
// - remaining (ms) starts at a fixed 04:37:12 for a stable server render; on mount a
//   deadline is set and a 1 s interval (cleared on unmount) ticks it down; at zero a new
//   6-hour drop starts
// - The timer exposes role="timer" with a readable aria-label ("4 hours 37 minutes ...")
// - "Add to cart" toggles each deal in an added Set (aria-pressed, label "Added");
//   "Shop all 48 deals" links to #blitz-deals

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GiantCountdownFlashDeals from '@/TestComponent/PageSections/ecommerce/FlashDeals01';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <GiantCountdownFlashDeals />
//     </main>
// )
// ```

'use client'

import { Fragment, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiBolt, HiCheck, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const DROP_LENGTH = 6 * 3600e3
const INITIAL_LEFT = 4 * 3600e3 + 37 * 60e3 + 12e3

const deals = [
    {
        id: 'pulse-anc',
        tag: 'Audio',
        name: 'Pulse ANC Over-Ear Headphones',
        price: 89,
        was: 179,
        left: 12,
        stock: 80,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
        alt: 'Black over-ear noise-cancelling headphones on a white background',
    },
    {
        id: 'arc-watch',
        tag: 'Wearables',
        name: 'Arc Smartwatch Series 3',
        price: 149,
        was: 249,
        left: 27,
        stock: 120,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        alt: 'White smartwatch with a sport strap lying on a white surface',
    },
    {
        id: 'noir-shades',
        tag: 'Eyewear',
        name: 'Noir Polarized Sunglasses',
        price: 54,
        was: 120,
        left: 6,
        stock: 60,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        alt: 'Pair of black sunglasses on a white background',
    },
    {
        id: 'shadow-runner',
        tag: 'Footwear',
        name: 'Shadow Knit Runner',
        price: 77,
        was: 140,
        left: 19,
        stock: 90,
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
        alt: 'Black knit running sneaker floating against a white background',
    },
]

const pad = (n) => String(n).padStart(2, '0')

function splitTime(ms) {
    const total = Math.max(0, Math.round(ms / 1000))
    return {
        h: Math.floor(total / 3600),
        m: Math.floor((total % 3600) / 60),
        s: total % 60,
    }
}

function Digit({ value, reduce }) {
    return (
        <span className="relative inline-grid [clip-path:inset(0_-0.2em)]">
            <span className="invisible">0</span>
            <AnimatePresence initial={false}>
                <motion.span
                    key={value}
                    initial={reduce ? { opacity: 1 } : { y: '-105%' }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { y: '105%' }}
                    transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

export function GiantCountdownFlashDeals({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [remaining, setRemaining] = useState(INITIAL_LEFT)
    const [added, setAdded] = useState(() => new Set())

    useEffect(() => {
        let deadline = Date.now() + INITIAL_LEFT
        const id = setInterval(() => {
            let left = deadline - Date.now()
            if (left <= 0) {
                deadline = Date.now() + DROP_LENGTH
                left = DROP_LENGTH
            }
            setRemaining(left)
        }, 1000)
        return () => clearInterval(id)
    }, [])

    const toggleAdded = (id) => {
        setAdded((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const { h, m, s } = splitTime(remaining)
    const units = [
        { label: 'Hours', value: pad(h) },
        { label: 'Minutes', value: pad(m) },
        { label: 'Seconds', value: pad(s) },
    ]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative isolate overflow-hidden bg-black py-16 text-white md:py-24 text-base font-normal', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,#ffe600_0_1px,transparent_1px_22px)] opacity-[0.06]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[28%] -z-10 h-[520px] w-[900px] max-w-[160vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,230,0,0.22),transparent_65%)]"
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#ffe600]/40 bg-[#ffe600]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-[#ffe600]">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ffe600] opacity-75 motion-reduce:animate-none" />
                                <span className="relative inline-flex size-2 rounded-full bg-[#ffe600]" />
                            </span>
                            Live · Blitz Mart
                        </span>
                        <h2 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl text-white">
                            Half price.
                            <br />
                            <span className="text-[#ffe600]">Full panic.</span>
                        </h2>
                    </div>
                    <div className="max-w-sm">
                        <p className="text-base leading-relaxed text-white/70">
                            48 deals at up to 55% off. When the clock hits zero, prices snap back — no rain
                            checks, no restocks.
                        </p>
                        <a
                            href="#blitz-deals"
                            className="group mt-4 inline-flex min-h-11 items-center gap-2 border-b-2 border-[#ffe600] pb-1 text-sm font-bold uppercase tracking-wider text-[#ffe600] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe600]"
                        >
                            Shop all 48 deals
                            <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center md:mt-16">
                    <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-white/60">
                        <HiBolt className="size-4 text-[#ffe600]" />
                        Blitz Hour #214 ends in
                    </p>
                    <div
                        role="timer"
                        aria-label={`${h} hours ${m} minutes ${s} seconds left`}
                        className="mt-5 flex items-center justify-center gap-1.5 sm:gap-3 md:gap-2 lg:gap-5"
                    >
                        {units.map((unit, i) => (
                            <Fragment key={unit.label}>
                                {i > 0 && (
                                    <motion.span
                                        aria-hidden="true"
                                        className="flex flex-col gap-2 sm:gap-4 md:gap-6"
                                        animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <span className="size-1.5 bg-[#ffe600] sm:size-2.5 md:size-3.5" />
                                        <span className="size-1.5 bg-[#ffe600] sm:size-2.5 md:size-3.5" />
                                    </motion.span>
                                )}
                                <div
                                    aria-hidden="true"
                                    className="relative flex flex-col items-center rounded-xl bg-[#ffe600] px-2 pb-2 pt-3 text-black shadow-[0_24px_80px_-24px_rgba(255,230,0,0.7)] sm:rounded-2xl sm:px-4 sm:pb-3 sm:pt-5 md:rounded-3xl md:px-4 md:pt-6 lg:px-7"
                                >
                                    <span className="flex text-5xl font-black leading-none tracking-tighter tabular-nums sm:text-7xl md:text-9xl">
                                        {unit.value.split('').map((digit, index) => (
                                            <Digit key={index} value={digit} reduce={reduce} />
                                        ))}
                                    </span>
                                    <span className="mt-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-black/60 sm:mt-3 sm:text-[11px]">
                                        {unit.label}
                                    </span>
                                    <span className="pointer-events-none absolute inset-x-0 top-[44%] h-px bg-black/20" />
                                </div>
                            </Fragment>
                        ))}
                    </div>
                    <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                        Prices reset at 00:00:00 · 1,284 of 2,000 deals claimed
                    </p>
                </div>

                <div id="blitz-deals" className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-20 lg:grid-cols-4">
                    {deals.map((deal) => {
                        const off = Math.round((1 - deal.price / deal.was) * 100)
                        const isAdded = added.has(deal.id)
                        const soldPct = Math.round(((deal.stock - deal.left) / deal.stock) * 100)
                        return (
                            <article
                                key={deal.id}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] transition-colors duration-300 hover:border-[#ffe600]"
                            >
                                <div className="relative aspect-square overflow-hidden bg-neutral-900">
                                    <img
                                        src={deal.image}
                                        alt={deal.alt}
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <span className="absolute left-2.5 top-2.5 -rotate-6 rounded-md bg-[#ffe600] px-2 py-1 text-sm font-black text-black shadow-[3px_3px_0_#000] sm:left-3 sm:top-3 sm:text-base">
                                        -{off}%
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-3 sm:p-5">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                                        {deal.tag}
                                    </p>
                                    <h3 className="mt-1.5 text-sm font-bold leading-snug sm:text-base text-white">{deal.name}</h3>
                                    <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
                                        <span className="text-2xl font-black text-[#ffe600] sm:text-3xl">${deal.price}</span>
                                        <span className="text-sm text-white/40 line-through">${deal.was}</span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-white/55">You save ${deal.was - deal.price}</p>
                                    <div className="mb-5 mt-4">
                                        <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-white/55">
                                            <span>Only {deal.left} left</span>
                                            <span className="hidden sm:inline">{soldPct}% sold</span>
                                        </div>
                                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                                            <div className="h-full rounded-full bg-[#ffe600]" style={{ width: `${soldPct}%` }} />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        aria-pressed={isAdded}
                                        className={cn(
                                            'mt-auto inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold uppercase tracking-wide sm:gap-2 sm:text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe600]',
                                            isAdded
                                                ? 'bg-white text-black'
                                                : 'bg-[#ffe600] text-black hover:bg-white',
                                        )}
                                        onClick={() => toggleAdded(deal.id)}
                                    >
                                        {isAdded ? <HiCheck className="size-4" /> : <HiPlus className="size-4" />}
                                        {isAdded ? 'Added' : 'Add to cart'}
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default GiantCountdownFlashDeals

// MarqueeStripFlashDeals

// FlashDeals03 · E-commerce & Marketplaces › Flash Deals / Countdown

// Description:
// A late-night, neon flash-sale section for the fictional marketplace Night Market. Two
// tilted marquee bands cross the top of the section reading "FLASH SALE ✦ UP TO 60% OFF ✦
// ENDS TONIGHT ✦", followed by the heading "After-dark drops." and three deal cards, each
// with its own live countdown chip, a "-60%" sticker and an "Add to bag" button. Use it
// for evening or weekend sale campaigns that should feel loud and energetic.

// Design:
// - Deep purple #1a0b2e section with blurred hot-pink #ff2e97 and acid-green #b8ff3c glows;
//   overflow-hidden root so the 120%-wide tilted bands never cause horizontal scroll
// - Bands: pink (-rotate-2) and acid green (rotate-1) strips with heavy uppercase text
//   (text-2xl → md:text-5xl) crossing each other; the heading word "drops." is outlined pink
// - Cards: rounded-[28px] white/[0.04] panels with white/10 borders, aspect-4/3 photos,
//   green mono countdown chip, rotated round pink discount sticker, pink price
// - Motion: bands scroll in opposite directions forever (framer-motion x 0 → -50%, 28 s
//   linear) and stop for reduced motion; cards lift with a pink glow on hover
// - Responsive: header stacks on mobile and splits on lg; cards grid-cols-1 → md:grid-cols-3

// What it does:
// - elapsed (seconds) starts at 0 for a stable server render; on mount a 1 s interval
//   (cleared on unmount) advances it and each card counts down from its own endsIn; at
//   zero the chip reads "Ended" and the button is disabled
// - "Add to bag" toggles the card in a bagged Set (aria-pressed) → "In bag" with a check icon
// - The marquee text is aria-hidden with a single sr-only sentence for screen readers;
//   "Browse all stalls" links to #night-market-stalls

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MarqueeStripFlashDeals from '@/TestComponent/PageSections/ecommerce/FlashDeals03';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <MarqueeStripFlashDeals />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight, HiCheck, HiOutlineShoppingBag } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const PHRASE = ['Flash sale', 'Up to 60% off', 'Ends tonight']

const deals = [
    {
        id: 'pixel-vault',
        stall: 'Stall 01 · Retro tech',
        name: 'Pixel Vault Retro Bundle',
        blurb: 'Refurbished 8-bit handheld, mini desktop and 12 tested cartridges.',
        price: 139,
        was: 289,
        endsIn: 3 * 3600 + 12 * 60 + 44,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        alt: 'Retro computers, handheld consoles and cartridges lit by pink and blue neon',
    },
    {
        id: 'afterhours-anc',
        stall: 'Stall 03 · Audio',
        name: 'Afterhours ANC Headphones',
        blurb: 'Adaptive noise cancelling, 40-hour battery, rose-gold hinges.',
        price: 92,
        was: 229,
        endsIn: 1 * 3600 + 5 * 60 + 20,
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
        alt: 'Close-up of over-ear headphones with rose-gold details',
    },
    {
        id: 'midnight-moto',
        stall: 'Stall 05 · Wardrobe',
        name: 'Midnight Moto Leather Jacket',
        blurb: 'Full-grain lambskin, brushed-steel zips, quilted lining.',
        price: 170,
        was: 340,
        endsIn: 5 * 3600 + 40 * 60 + 2,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        alt: 'Black leather biker jacket on a white background',
    },
]

const pad = (n) => String(n).padStart(2, '0')

function formatClock(seconds) {
    return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`
}

function MarqueeBand({ reverse = false, reduce, className, starClass }) {
    const words = [...PHRASE, ...PHRASE, ...PHRASE]
    const group = (
        <div className="flex shrink-0 items-center">
            {words.map((word, i) => (
                <span key={i} className="flex items-center">
                    <span className="px-4 sm:px-6">{word}</span>
                    <span className={cn('text-[0.6em]', starClass)}>✦</span>
                </span>
            ))}
        </div>
    )
    const from = reverse ? '-50%' : '0%'
    const to = reverse ? '0%' : '-50%'

    return (
        <div
            aria-hidden="true"
            className={cn(
                'relative -ml-[10%] w-[120%] overflow-hidden py-3 text-2xl font-black uppercase leading-none tracking-tight sm:py-4 sm:text-4xl md:text-5xl',
                className,
            )}
        >
            <motion.div
                className="flex w-max"
                initial={{ x: from }}
                animate={reduce ? { x: from } : { x: [from, to] }}
                transition={reduce ? { duration: 0 } : { duration: 28, ease: 'linear', repeat: Infinity }}
            >
                {group}
                {group}
            </motion.div>
        </div>
    )
}

export function MarqueeStripFlashDeals({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [elapsed, setElapsed] = useState(0)
    const [bagged, setBagged] = useState(() => new Set())

    useEffect(() => {
        const start = Date.now()
        const id = setInterval(() => {
            setElapsed(Math.floor((Date.now() - start) / 1000))
        }, 1000)
        return () => clearInterval(id)
    }, [])

    const toggleBag = (id) => {
        setBagged((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative isolate overflow-hidden bg-[#1a0b2e] pb-20 pt-10 text-white md:pb-28 md:pt-14 text-base font-normal', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-40 top-24 -z-10 size-[480px] rounded-full bg-[#ff2e97] opacity-25 blur-[120px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-[420px] rounded-full bg-[#b8ff3c] opacity-15 blur-[120px]"
            />

            <p className="sr-only">Flash sale: up to 60% off, ends tonight.</p>
            <div className="relative py-6 sm:py-8">
                <MarqueeBand
                    reduce={reduce}
                    className="relative z-10 -rotate-2 bg-[#ff2e97] text-[#1a0b2e] shadow-[0_24px_60px_-20px_rgba(255,46,151,0.7)]"
                    starClass="text-white"
                />
                <MarqueeBand
                    reverse
                    reduce={reduce}
                    className="mt-1 rotate-1 bg-[#b8ff3c] text-[#1a0b2e]"
                    starClass="text-[#ff2e97]"
                />
            </div>

            <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 md:mt-14 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#b8ff3c]">
                            Night Market · 3 stalls open
                        </p>
                        <h2 className="mt-4 text-5xl font-black leading-[0.9] tracking-tight sm:text-6xl lg:text-8xl text-white">
                            After-dark{' '}
                            <span className="text-transparent [-webkit-text-stroke:1.5px_#ff2e97] sm:[-webkit-text-stroke:2px_#ff2e97]">
                                drops.
                            </span>
                        </h2>
                    </div>
                    <div className="max-w-sm lg:pb-3">
                        <p className="text-base leading-relaxed text-white/65">
                            Three stalls, three steals. Every price vanishes at midnight — grab it before the lights go
                            out.
                        </p>
                        <a
                            href="#night-market-stalls"
                            className="group mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#ff2e97] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b8ff3c]"
                        >
                            Browse all stalls
                            <HiArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                    {deals.map((deal) => {
                        const off = Math.round((1 - deal.price / deal.was) * 100)
                        const left = Math.max(0, deal.endsIn - elapsed)
                        const ended = left === 0
                        const inBag = bagged.has(deal.id)

                        return (
                            <article
                                key={deal.id}
                                className="group flex flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-3 transition duration-300 hover:-translate-y-1 hover:border-[#ff2e97]/60 hover:shadow-[0_30px_80px_-30px_rgba(255,46,151,0.55)] motion-reduce:hover:translate-y-0"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#2a1446]">
                                    <img
                                        src={deal.image}
                                        alt={deal.alt}
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a0b2e]/70 via-transparent to-transparent" />
                                    <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-[#b8ff3c] px-3 py-1.5 font-mono text-xs font-bold tabular-nums text-[#1a0b2e]">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'size-1.5 rounded-full bg-[#1a0b2e]',
                                                !ended && 'animate-pulse motion-reduce:animate-none',
                                            )}
                                        />
                                        {ended ? 'Ended' : `Ends ${formatClock(left)}`}
                                    </span>
                                    <span className="absolute bottom-3 right-3 flex size-16 rotate-12 items-center justify-center rounded-full bg-[#ff2e97] text-lg font-black text-white shadow-[0_10px_30px_-8px_rgba(255,46,151,0.9)] sm:size-[4.5rem]">
                                        -{off}%
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
                                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#b8ff3c]/80">
                                        {deal.stall}
                                    </p>
                                    <h3 className="mt-2 text-xl font-bold leading-tight text-white">{deal.name}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/60">{deal.blurb}</p>
                                    <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black tracking-tight text-[#ff2e97]">
                                                ${deal.price.toLocaleString('en-US')}
                                            </span>
                                            <span className="text-sm text-white/40 line-through">
                                                ${deal.was.toLocaleString('en-US')}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            aria-pressed={inBag}
                                            disabled={ended}
                                            className={cn(
                                                'inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[#b8ff3c] px-5 text-sm font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2e97] disabled:cursor-not-allowed disabled:opacity-40',
                                                inBag
                                                    ? 'bg-[#b8ff3c] text-[#1a0b2e]'
                                                    : 'text-[#b8ff3c] hover:bg-[#b8ff3c] hover:text-[#1a0b2e]',
                                            )}
                                            onClick={() => toggleBag(deal.id)}
                                        >
                                            {inBag ? (
                                                <HiCheck aria-hidden="true" className="size-4" />
                                            ) : (
                                                <HiOutlineShoppingBag aria-hidden="true" className="size-4" />
                                            )}
                                            {inBag ? 'In bag' : 'Add to bag'}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default MarqueeStripFlashDeals

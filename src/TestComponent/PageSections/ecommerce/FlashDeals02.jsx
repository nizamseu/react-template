// ClaimedProgressFlashDeals

// FlashDeals02 · E-commerce & Marketplaces › Flash Deals / Countdown

// Description:
// A clean, conversion-focused flash-deal grid for the fictional marketplace DealDrop. The
// header reads "Today’s drops are going fast." with a live "claimed today" tally and a
// "See all drops" link; below, four deal cards each show a discount badge, their own mini
// countdown, a "72% claimed" style progress bar and a "Claim deal" button. Use it on a
// deals page or homepage where scarcity and social proof should drive the click.

// Design:
// - White section, slate-900/500 text, rose #e11d48 accents; max-w-7xl container with a
//   split header (eyebrow + serif-italic accent word on the left, stat pair + link right)
// - Cards: rounded-3xl white with slate-200 border and an inset rounded image (aspect-4/5),
//   rose "-39%" pill top-left, frosted white/85 timer chip top-right (turns rose under 1 h)
// - Progress: 8px rose-100 track with a rose gradient fill animated by framer-motion;
//   buttons are full-width pills, rose → rose-50 with a rose ring when claimed
// - Hover: card gains a soft slate shadow and the photo zooms to 1.04
// - Responsive: grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4; the header stacks on
//   mobile and splits into two columns on lg

// What it does:
// - elapsed (seconds) starts at 0 so the server render is stable; on mount a 1 s interval
//   (cleared on unmount) advances it and every card derives its remaining time from its
//   own endsIn value; a card that reaches zero shows "Ended" and disables its button
// - "Claim deal" toggles the card in a claimed Set (aria-pressed): the label becomes
//   "Claimed ✓", the claimed count and bar grow by one and the header tally updates
// - Progress bars expose role="progressbar" with aria-valuenow; "See all drops" → #dealdrop-all

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ClaimedProgressFlashDeals from '@/TestComponent/PageSections/ecommerce/FlashDeals02';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <ClaimedProgressFlashDeals />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineClock, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const deals = [
    {
        id: 'transit-rolltop',
        brand: 'Northbound',
        name: 'Transit Roll-Top Backpack 24L',
        price: 79,
        was: 129,
        rating: 4.8,
        reviews: 1204,
        endsIn: 2 * 3600 + 14 * 60 + 9,
        claimed: 36,
        total: 50,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        alt: 'Navy roll-top backpack standing upright',
    },
    {
        id: 'halo-lamp',
        brand: 'Lumen & Co.',
        name: 'Halo Adjustable Desk Lamp',
        price: 59,
        was: 98,
        rating: 4.7,
        reviews: 642,
        endsIn: 47 * 60 + 32,
        claimed: 41,
        total: 50,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        alt: 'Grey adjustable desk lamp against a white wall',
    },
    {
        id: 'dune-suede',
        brand: 'Fieldstep',
        name: 'Dune Canvas Low-Top Sneaker',
        price: 95,
        was: 145,
        rating: 4.6,
        reviews: 318,
        endsIn: 5 * 3600 + 2 * 60 + 45,
        claimed: 18,
        total: 50,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        alt: 'Tan canvas low-top sneaker resting on mustard fabric',
    },
    {
        id: 'saddle-crossbody',
        brand: 'Oak & Hide',
        name: 'Saddle Leather Crossbody',
        price: 108,
        was: 180,
        rating: 4.9,
        reviews: 877,
        endsIn: 1 * 3600 + 28 * 60 + 10,
        claimed: 29,
        total: 50,
        image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=800&q=80',
        alt: 'Brown leather crossbody bag on a white background',
    },
]

const pad = (n) => String(n).padStart(2, '0')

function formatClock(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export function ClaimedProgressFlashDeals({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [elapsed, setElapsed] = useState(0)
    const [claimed, setClaimed] = useState(() => new Set())

    useEffect(() => {
        const start = Date.now()
        const id = setInterval(() => {
            setElapsed(Math.floor((Date.now() - start) / 1000))
        }, 1000)
        return () => clearInterval(id)
    }, [])

    const toggleClaim = (id) => {
        setClaimed((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const claimedToday = 1860 + claimed.size

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('bg-white py-16 text-slate-900 md:py-24 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                    <div>
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e11d48]">
                            <span className="size-1.5 rounded-full bg-[#e11d48]" />
                            DealDrop · Flash drops
                        </p>
                        <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Today’s drops are going{' '}
                            <span className="font-serif font-normal italic text-[#e11d48]">fast.</span>
                        </h2>
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
                            Limited stock, hand-picked by our deal desk every morning. Claim one to lock the price for
                            30 minutes at checkout.
                        </p>
                    </div>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-end">
                        <dl className="flex gap-8">
                            <div>
                                <dt className="text-xs text-slate-500">Live drops</dt>
                                <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">{deals.length}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500">Claimed today</dt>
                                <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                                    {claimedToday.toLocaleString('en-US')}
                                </dd>
                            </div>
                        </dl>
                        <a
                            href="#dealdrop-all"
                            className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-slate-200 px-5 sm:self-auto text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48]"
                        >
                            See all drops
                            <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </a>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {deals.map((deal) => {
                        const isClaimed = claimed.has(deal.id)
                        const count = deal.claimed + (isClaimed ? 1 : 0)
                        const pct = Math.round((count / deal.total) * 100)
                        const off = Math.round((1 - deal.price / deal.was) * 100)
                        const left = Math.max(0, deal.endsIn - elapsed)
                        const ended = left === 0
                        const urgent = !ended && left < 3600

                        return (
                            <article
                                key={deal.id}
                                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-2.5 transition-shadow duration-300 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.35)]"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-slate-100">
                                    <img
                                        src={deal.image}
                                        alt={deal.alt}
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                    />
                                    <span className="absolute left-3 top-3 rounded-full bg-[#e11d48] px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                                        -{off}%
                                    </span>
                                    <span
                                        className={cn(
                                            'absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-semibold tabular-nums shadow-sm backdrop-blur',
                                            urgent ? 'bg-[#e11d48]/90 text-white' : 'bg-white/85 text-slate-800',
                                            ended && 'bg-slate-900/80 text-white',
                                        )}
                                    >
                                        <HiOutlineClock aria-hidden="true" className="size-3.5" />
                                        <span className="sr-only">Ends in </span>
                                        {ended ? 'Ended' : formatClock(left)}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-4">
                                    <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                                        <span>{deal.brand}</span>
                                        <span className="inline-flex items-center gap-1">
                                            <HiStar aria-hidden="true" className="size-3.5 text-slate-900" />
                                            <span className="font-medium text-slate-900">{deal.rating}</span>
                                            <span>({deal.reviews.toLocaleString('en-US')})</span>
                                        </span>
                                    </div>
                                    <h3 className="mt-1.5 text-base font-semibold leading-snug text-slate-900">
                                        {deal.name}
                                    </h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-2xl font-bold tracking-tight text-[#e11d48]">${deal.price}</span>
                                        <span className="text-sm text-slate-400 line-through">${deal.was}</span>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-800">{pct}% claimed</span>
                                            <span className="text-slate-500">{deal.total - count} left</span>
                                        </div>
                                        <div
                                            role="progressbar"
                                            aria-label={`${deal.name} claimed`}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={pct}
                                            className="mt-2 h-2 overflow-hidden rounded-full bg-rose-100"
                                        >
                                            <motion.div
                                                className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#e11d48]"
                                                initial={false}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-5">
                                        <button
                                            type="button"
                                            aria-pressed={isClaimed}
                                            disabled={ended}
                                            className={cn(
                                                'inline-flex min-h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
                                                isClaimed
                                                    ? 'bg-rose-50 text-[#e11d48] ring-1 ring-inset ring-rose-200 hover:bg-rose-100'
                                                    : 'bg-[#e11d48] text-white hover:bg-[#be123c]',
                                            )}
                                            onClick={() => toggleClaim(deal.id)}
                                        >
                                            {ended ? 'Deal ended' : isClaimed ? 'Claimed ✓' : 'Claim deal'}
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

export default ClaimedProgressFlashDeals

// RingTimerFlashDeals

// FlashDeals04 · E-commerce & Marketplaces › Flash Deals / Countdown

// Description:
// A calm, botanical take on a flash sale for the fictional home-goods shop Mintleaf Home.
// A deep-green panel holds a live circular ring timer whose stroke shrinks as "The Slow
// Sale" runs out, with the heading "Fresh finds, gently discounted." and a "Shop the whole
// sale" link; beside it a 2×2 grid of discounted plants, ceramics and candles with round
// add-to-cart buttons. Use it when a sale should feel urgent without shouting.

// Design:
// - Mint #dff5ea section, deep green #0b4d3a panel and text; lg:grid-cols-12 split with
//   the timer panel in 5 columns and the product grid in 7; rounded-[32px] panel
// - Ring: 240×240 SVG with a mint/15 track, a mint progress stroke (round caps), 12 hour
//   ticks and a knob that rides the end of the arc; time in the centre is tabular
// - Products: grid-cols-2 cards (white/70, ring-1 green/10, rounded-[24px]) with square
//   photos, green "-30%" pills, serif names and 40-44px round +/✓ buttons on the image corner
// - Motion: stroke-dashoffset and knob rotation ease linearly over 1 s per tick (CSS
//   transitions, disabled via motion-reduce); card photos zoom on hover
// - Responsive: stacks on mobile; inside the panel ring and copy sit side by side on md and
//   stack again on lg (ring top, copy bottom); product grid stays 2×2 at every width

// What it does:
// - remaining (ms) starts at a fixed 04:18:36 so the server render is stable; on mount a
//   deadline is set and a 1 s interval (cleared on unmount) updates it; at zero a fresh
//   12-hour sale window starts
// - The ring fraction is remaining / 12 h; the timer has role="timer" and an aria-label
// - The round buttons toggle each product in a cart Set (aria-pressed, aria-label names
//   the product); "Shop the whole sale" links to #mintleaf-sale

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RingTimerFlashDeals from '@/TestComponent/PageSections/ecommerce/FlashDeals04';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <RingTimerFlashDeals />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { HiArrowRight, HiCheck, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const WINDOW = 12 * 3600e3
const INITIAL_LEFT = 4 * 3600e3 + 18 * 60e3 + 36e3
const RADIUS = 100
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2
    const round = (n) => Math.round(n * 100) / 100
    return {
        x1: round(120 + 110 * Math.cos(angle)),
        y1: round(120 + 110 * Math.sin(angle)),
        x2: round(120 + 116 * Math.cos(angle)),
        y2: round(120 + 116 * Math.sin(angle)),
    }
})

const products = [
    {
        id: 'terrarium-succulent',
        name: 'Echeveria in Mint Glaze Pot',
        note: 'Hand-thrown pot, 4" wide',
        price: 24,
        was: 34,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        alt: 'Small succulent planted in a mint-green ceramic pot',
    },
    {
        id: 'kiln-cups',
        name: 'Kiln Stoneware Cups, Set of 4',
        note: 'Matte bone glaze',
        price: 48,
        was: 68,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        alt: 'Group of white handmade ceramic cups and vessels',
    },
    {
        id: 'fig-cedar-candle',
        name: 'Fig & Cedar Soy Candle',
        note: '60-hour burn',
        price: 29,
        was: 42,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
        alt: 'Lit candle in a glass jar in a cosy setting',
    },
    {
        id: 'pale-clay-vase',
        name: 'Pale Clay Bud Vase',
        note: 'Unglazed, 9" tall',
        price: 39,
        was: 56,
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
        alt: 'White ceramic vase holding a leafy green plant',
    },
]

const pad = (n) => String(n).padStart(2, '0')

export function RingTimerFlashDeals({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [remaining, setRemaining] = useState(INITIAL_LEFT)
    const [cart, setCart] = useState(() => new Set())

    useEffect(() => {
        let deadline = Date.now() + INITIAL_LEFT
        const id = setInterval(() => {
            let left = deadline - Date.now()
            if (left <= 0) {
                deadline = Date.now() + WINDOW
                left = WINDOW
            }
            setRemaining(left)
        }, 1000)
        return () => clearInterval(id)
    }, [])

    const toggleCart = (id) => {
        setCart((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const totalSeconds = Math.max(0, Math.round(remaining / 1000))
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    const fraction = Math.min(1, remaining / WINDOW)
    const dashOffset = CIRCUMFERENCE * (1 - fraction)
    const knobDeg = fraction * 360

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('bg-[#dff5ea] py-16 text-[#0b4d3a] md:py-24 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
                <div className="relative overflow-hidden rounded-[32px] bg-[#0b4d3a] p-6 text-[#dff5ea] sm:p-10 lg:col-span-5">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#dff5ea]/[0.06]"
                    />
                    <div className="relative flex h-full flex-col items-center gap-8 md:flex-row md:items-center lg:flex-col lg:items-stretch lg:justify-between lg:gap-12">
                        <div className="flex w-full shrink-0 justify-center md:w-[300px] lg:w-full lg:flex-1 lg:items-center">
                            <div className="relative aspect-square w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px]">
                                <svg viewBox="0 0 240 240" aria-hidden="true" className="size-full">
                                    <g transform="rotate(-90 120 120)">
                                        {ticks.map((t, i) => (
                                            <line
                                                key={i}
                                                {...t}
                                                stroke="#dff5ea"
                                                strokeOpacity={i === 0 ? 0.9 : 0.35}
                                                strokeWidth={i % 3 === 0 ? 2 : 1}
                                                strokeLinecap="round"
                                            />
                                        ))}
                                        <circle
                                            cx="120"
                                            cy="120"
                                            r={RADIUS}
                                            fill="none"
                                            stroke="#dff5ea"
                                            strokeOpacity="0.14"
                                            strokeWidth="12"
                                        />
                                        <circle
                                            cx="120"
                                            cy="120"
                                            r={RADIUS}
                                            fill="none"
                                            stroke="#dff5ea"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                            strokeDasharray={CIRCUMFERENCE}
                                            strokeDashoffset={dashOffset}
                                            className="transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
                                        />
                                        <g
                                            style={{ transform: `rotate(${knobDeg}deg)`, transformOrigin: '120px 120px' }}
                                            className="transition-transform duration-1000 ease-linear motion-reduce:transition-none"
                                        >
                                            <circle cx={120 + RADIUS} cy="120" r="10" fill="#0b4d3a" />
                                            <circle cx={120 + RADIUS} cy="120" r="5" fill="#dff5ea" />
                                        </g>
                                    </g>
                                </svg>
                                <div
                                    role="timer"
                                    aria-label={`${h} hours ${m} minutes ${s} seconds left in the sale`}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                                >
                                    <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#dff5ea]/60">
                                        Ends in
                                    </span>
                                    <span className="mt-2 text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
                                        {pad(h)}:{pad(m)}
                                        <span className="text-[#dff5ea]/50">:{pad(s)}</span>
                                    </span>
                                    <span className="mt-2 text-xs text-[#dff5ea]/60">
                                        {Math.round(fraction * 100)}% of the sale left
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#dff5ea]/70">
                                The Slow Sale · Mintleaf Home
                            </p>
                            <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl text-[#dff5ea] font-normal">
                                Fresh finds, gently discounted.
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-[#dff5ea]/75 sm:text-base">
                                Up to 31% off pots, plants and slow-made ceramics for twelve hours only. Every order ships
                                in recycled, compostable packaging.
                            </p>
                            <a
                                href="#mintleaf-sale"
                                className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#dff5ea] px-6 text-sm font-semibold text-[#0b4d3a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dff5ea]"
                            >
                                Shop the whole sale
                                <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="flex items-end justify-between gap-4 px-1">
                        <h3 className="font-serif text-2xl leading-tight sm:text-3xl text-[#0b4d3a] font-normal">Today’s four picks</h3>
                        <p className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-[#0b4d3a]/60">
                            Up to 31% off
                        </p>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5">
                        {products.map((product) => {
                            const inCart = cart.has(product.id)
                            const off = Math.round((1 - product.price / product.was) * 100)
                            return (
                                <article
                                    key={product.id}
                                    className="group flex flex-col rounded-[24px] bg-white/70 p-2 ring-1 ring-[#0b4d3a]/10 transition-colors duration-300 hover:bg-white sm:p-2.5"
                                >
                                    <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[#cdeedd]">
                                        <img
                                            src={product.image}
                                            alt={product.alt}
                                            loading="lazy"
                                            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <span className="absolute left-2.5 top-2.5 rounded-full bg-[#0b4d3a] px-2.5 py-1 text-xs font-semibold text-[#dff5ea]">
                                            -{off}%
                                        </span>
                                        <button
                                            type="button"
                                            aria-pressed={inCart}
                                            aria-label={inCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
                                            className={cn(
                                                'absolute bottom-2 right-2 flex size-10 items-center sm:bottom-2.5 sm:right-2.5 sm:size-11 justify-center rounded-full shadow-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4d3a]',
                                                inCart
                                                    ? 'bg-[#dff5ea] text-[#0b4d3a] ring-2 ring-[#0b4d3a]'
                                                    : 'bg-[#0b4d3a] text-[#dff5ea] hover:bg-[#0e5f48]',
                                            )}
                                            onClick={() => toggleCart(product.id)}
                                        >
                                            {inCart ? <HiCheck className="size-5" /> : <HiPlus className="size-5" />}
                                        </button>
                                    </div>
                                    <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
                                        <h4 className="font-serif text-base leading-snug sm:text-lg text-[#0b4d3a] font-normal">{product.name}</h4>
                                        <p className="mt-0.5 text-xs text-[#0b4d3a]/60">{product.note}</p>
                                        <p className="mt-auto flex items-baseline gap-2 pt-2">
                                            <span className="text-lg font-semibold">${product.price}</span>
                                            <span className="text-sm text-[#0b4d3a]/45 line-through">${product.was}</span>
                                        </p>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RingTimerFlashDeals

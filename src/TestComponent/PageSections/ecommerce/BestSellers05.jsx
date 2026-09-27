// GlassGradientBestSellers

// BestSellers05 · E-commerce & Marketplaces › Featured / Best Sellers

// Description:
// A glossy, after-dark best-seller grid for the gadget brand Nimbus Tech. Drifting violet,
// blue and pink light sits behind the heading "The top 1% of everything we make." and six
// frosted-glass product cards (watch, tablet, laptop, headphones, phone, smart glasses),
// each with a "Top 1%" chip, star rating, price, wishlist heart and "Add to cart". Ends
// with a "Browse all best sellers" link. Use it for consumer-tech or premium gadget stores.

// Design:
// - Card grid grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-3 (gap-5 → lg:gap-6); header
//   stacks on mobile, row on md
// - #0a0a1a base with three blurred radial blobs #7c3aed, #2563eb, #ec4899 that float on
//   slow 18-26s framer-motion loops (static for reduced motion)
// - Frosted cards: bg-white/10, backdrop-blur-xl, border-white/20, rounded-3xl; a soft white
//   spotlight follows the pointer inside each card; image wells rounded-2xl aspect-[4/3]
// - "Top 1%" chip has a violet→pink gradient border; heading highlight is violet→blue→pink
//   gradient text; white stars show fractional ratings; sans type, mono meta
// - Cards fade up in a stagger on scroll; images zoom slightly on hover

// What it does:
// - cart state (Set) toggles per card: "Add to cart" ↔ "Added ✓" (aria-pressed); the
//   header pill shows the live cart count
// - wishlist state (Set) toggles the heart button (aria-pressed, filled when saved)
// - Pointer movement writes --mx / --my CSS variables on the card for the spotlight
//   (visual only); product names link to #nimbus-<product>, the footer link to
//   #nimbus-best-sellers

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GlassGradientBestSellers from '@/TestComponent/PageSections/ecommerce/BestSellers05';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <GlassGradientBestSellers />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiCheck, HiHeart, HiOutlineHeart, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const products = [
    {
        id: 'halo-watch-s2',
        name: 'Nimbus Halo Watch S2',
        category: 'Wearables',
        rank: '#1 in Wearables',
        rating: 4.9,
        reviews: 8412,
        price: 249,
        was: 299,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        alt: 'White smartwatch with a round black face on a white surface',
    },
    {
        id: 'slate-11',
        name: 'Nimbus Slate 11 + Pen',
        category: 'Tablets',
        rank: '#1 in Tablets',
        rating: 4.8,
        reviews: 5230,
        price: 579,
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80',
        alt: 'Tablet with a stylus and keyboard being used for drawing',
    },
    {
        id: 'book-air-14',
        name: 'Nimbus Book Air 14',
        category: 'Laptops',
        rank: '#1 in Laptops',
        rating: 4.8,
        reviews: 3977,
        price: 1199,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
        alt: 'Slim open laptop on a light wooden desk',
    },
    {
        id: 'aura-anc',
        name: 'Nimbus Aura ANC',
        category: 'Audio',
        rank: '#1 in Audio',
        rating: 4.7,
        reviews: 11206,
        price: 299,
        was: 349,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
        alt: 'Black over-ear headphones on a white background',
    },
    {
        id: 'phone-ultra',
        name: 'Nimbus Phone Ultra',
        category: 'Phones',
        rank: '#1 in Phones',
        rating: 4.8,
        reviews: 6488,
        price: 999,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
        alt: 'Smartphone with a rocky landscape wallpaper against a dark background',
        position: 'object-[center_18%]',
    },
    {
        id: 'lens-glasses',
        name: 'Nimbus Lens Smart Glasses',
        category: 'Wearables',
        rank: '#2 in Wearables',
        rating: 4.6,
        reviews: 2104,
        price: 349,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        alt: 'Black smart glasses on a white background',
    },
]

const blobs = [
    {
        className: '-left-32 -top-32 h-[28rem] w-[28rem] bg-[#7c3aed]',
        animate: { x: [0, 80, 20, 0], y: [0, 40, 90, 0], scale: [1, 1.1, 0.95, 1] },
        duration: 22,
    },
    {
        className: '-right-40 top-1/3 h-[30rem] w-[30rem] bg-[#2563eb]',
        animate: { x: [0, -70, -20, 0], y: [0, -50, 30, 0], scale: [1, 0.92, 1.08, 1] },
        duration: 26,
    },
    {
        className: '-bottom-40 left-1/3 h-[26rem] w-[26rem] bg-[#ec4899]',
        animate: { x: [0, 60, -50, 0], y: [0, -60, -20, 0], scale: [1, 1.12, 1, 1] },
        duration: 18,
    },
]

const formatPrice = (value) => `$${value.toLocaleString('en-US')}`

const totalReviews = products.reduce((sum, product) => sum + product.reviews, 0)
const averageRating = products.reduce((sum, product) => sum + product.rating, 0) / products.length

function Rating({ value }) {
    return (
        <span className="relative inline-flex" aria-hidden="true">
            <span className="flex gap-0.5 text-white/20">
                {[0, 1, 2, 3, 4].map((index) => (
                    <HiStar key={index} className="h-4 w-4" />
                ))}
            </span>
            <span className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-white" style={{ width: `${(value / 5) * 100}%` }}>
                {[0, 1, 2, 3, 4].map((index) => (
                    <HiStar key={index} className="h-4 w-4 shrink-0" />
                ))}
            </span>
        </span>
    )
}

export function GlassGradientBestSellers({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [cart, setCart] = useState(() => new Set())
    const [wishlist, setWishlist] = useState(() => new Set())
    const reduceMotion = useReducedMotion()

    const toggle = (setter, id) => {
        setter((previous) => {
            const next = new Set(previous)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const trackPointer = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
        event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0a0a1a] px-4 py-16 font-normal text-white sm:px-6 md:py-24 lg:px-10 text-base',
                className,
            )}
            {...props}
        >
            {blobs.map((blob) => (
                <motion.div
                    key={blob.className}
                    className={cn('pointer-events-none absolute -z-10 rounded-full opacity-50 blur-[110px]', blob.className)}
                    animate={reduceMotion ? undefined : blob.animate}
                    transition={{ duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden="true"
                />
            ))}

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-xl">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#ec4899] shadow-[0_0_10px_#ec4899]" aria-hidden="true" />
                            Nimbus Tech · Best sellers
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl">
                            The{' '}
                            <span className="bg-linear-to-r from-[#c4b5fd] via-[#93c5fd] to-[#f9a8d4] bg-clip-text text-transparent">
                                top 1%
                            </span>{' '}
                            of everything we make.
                        </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/65">
                        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur-xl">
                            {averageRating.toFixed(1)} avg · {totalReviews.toLocaleString('en-US')} reviews
                        </span>
                        <span
                            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur-xl"
                            aria-live="polite"
                        >
                            Cart · {cart.size} {cart.size === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </div>

                <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
                    {products.map((product, index) => {
                        const inCart = cart.has(product.id)
                        const saved = wishlist.has(product.id)

                        return (
                            <motion.li
                                key={product.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative isolate flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-colors duration-300 hover:border-white/35 sm:p-4"
                                onPointerMove={trackPointer}
                            >
                                <span
                                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,0%),rgba(255,255,255,0.14),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    aria-hidden="true"
                                />

                                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
                                    <img
                                        src={product.image}
                                        alt={product.alt}
                                        loading="lazy"
                                        className={cn(
                                            'h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105',
                                            product.position,
                                        )}
                                    />
                                    <div
                                        className="absolute inset-0 bg-linear-to-t from-[#0a0a1a]/60 via-transparent to-transparent"
                                        aria-hidden="true"
                                    />
                                    <span className="absolute left-3 top-3 rounded-full bg-linear-to-r from-[#7c3aed] to-[#ec4899] p-px">
                                        <span className="block rounded-full bg-[#0a0a1a]/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                                            Top 1%
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        aria-pressed={saved}
                                        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                                        className={cn(
                                            'absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-[#0a0a1a]/40 text-white backdrop-blur-xl transition-colors duration-200 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                                            saved && 'text-[#ec4899]',
                                        )}
                                        onClick={() => toggle(setWishlist, product.id)}
                                    >
                                        {saved ? (
                                            <HiHeart className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <HiOutlineHeart className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                    <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-white/80">
                                        {product.rank}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                                        {product.category}
                                    </p>
                                    <h3 className="mt-1 text-lg font-semibold tracking-tight text-white">
                                        <a
                                            href={`#nimbus-${product.id}`}
                                            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            {product.name}
                                        </a>
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Rating value={product.rating} />
                                        <span className="text-xs text-white/65">
                                            {product.rating}
                                            <span className="sr-only"> out of 5 stars</span> ·{' '}
                                            {product.reviews.toLocaleString('en-US')} reviews
                                        </span>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                                        <p className="flex items-baseline gap-2">
                                            <span className="text-xl font-semibold text-white">{formatPrice(product.price)}</span>
                                            {product.was && (
                                                <span className="text-xs text-white/40 line-through">
                                                    {formatPrice(product.was)}
                                                </span>
                                            )}
                                        </p>
                                        <button
                                            type="button"
                                            aria-pressed={inCart}
                                            aria-label={inCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
                                            className={cn(
                                                'inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-xl transition-colors duration-200 hover:bg-white hover:text-[#0a0a1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                                                inCart && 'border-transparent bg-white text-[#0a0a1a]',
                                            )}
                                            onClick={() => toggle(setCart, product.id)}
                                        >
                                            {inCart ? (
                                                <>
                                                    Added
                                                    <HiCheck className="h-4 w-4" aria-hidden="true" />
                                                </>
                                            ) : (
                                                'Add to cart'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.li>
                        )
                    })}
                </ul>

                <div className="mt-12 flex justify-center">
                    <a
                        href="#nimbus-best-sellers"
                        className="group/link inline-flex min-h-12 items-center gap-3 rounded-full bg-linear-to-r from-[#7c3aed] via-[#2563eb] to-[#ec4899] p-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        <span className="inline-flex min-h-[46px] items-center gap-3 rounded-full bg-[#0a0a1a]/85 px-6 text-sm font-medium text-white transition-colors duration-300 group-hover/link:bg-[#0a0a1a]/40">
                            Browse all best sellers
                            <HiArrowLongRight
                                className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                                aria-hidden="true"
                            />
                        </span>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default GlassGradientBestSellers

// CompactRowProductCard

// ProductQuickView05 · E-commerce & Marketplaces › Product Card / Quick View

// Description:
// A compact, list-style product panel for the fictional desk-object brand Monolith Goods,
// headed "Objects for a quieter desk." Five horizontal rows show a greyscale thumbnail,
// name, material, star rating, price, a wishlist heart and a quantity stepper, and a live
// subtotal with a free-shipping meter and "Checkout" button closes the list. Use it for
// bundles, "complete the set" blocks, mini carts or dense category listings.

// Design:
// - Neutral-100 section with a white rounded-3xl card (neutral-200 border); strictly
//   greyscale with one cobalt #2f4bff accent (saved hearts, focus rings, meter, checkout)
// - Rows: divide-y list, 72px → sm:96px rounded-xl grayscale thumbnails that regain colour
//   on row hover, medium-weight names, neutral-500 materials, partial-fill star ratings
// - Controls: 40px round heart toggle, pill stepper with 40px −/+ buttons, tabular line
//   totals; rows at quantity 0 fade to 50% and show "—"
// - Footer: neutral-50 band with a 6px cobalt free-shipping meter (animated width), large
//   subtotal and a cobalt pill "Checkout" link next to a ghost "Keep browsing" link
// - Responsive: on mobile controls wrap onto their own full-width line under the product
//   info; from sm each row is thumbnail | info | controls; footer stacks until sm

// What it does:
// - qty (state, per product, 0-10) is changed with the steppers; line totals, item count,
//   subtotal and the $300 free-shipping meter recompute live (useMemo) and are announced
//   through an aria-live region
// - saved (state Set) is toggled by the heart buttons (aria-pressed); the header shows
//   "Saved (n)"; "Checkout" → #monolith-checkout, "Keep browsing" → #monolith-objects

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CompactRowProductCard from '@/TestComponent/PageSections/ecommerce/ProductQuickView05';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <CompactRowProductCard />
//     </main>
// )
// ```

'use client'

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiHeart, HiMinus, HiOutlineHeart, HiPlus, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const FREE_SHIPPING = 300

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const products = [
    {
        id: 'arc-lamp',
        name: 'Arc Task Lamp',
        material: 'Powder-coated steel · Graphite',
        price: 129,
        rating: 4.8,
        reviews: 214,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
        alt: 'Grey adjustable desk lamp on a white background',
    },
    {
        id: 'stoneware-cup',
        name: 'Stoneware Pen Cup',
        material: 'Matte bone glaze · 3.5" tall',
        price: 34,
        rating: 4.6,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80',
        alt: 'White handmade ceramic cups and vessels',
    },
    {
        id: 'plinth-riser',
        name: 'Plinth Laptop Riser',
        material: 'Solid ash · Smoke stain',
        price: 89,
        rating: 4.7,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80',
        alt: 'Laptop on a clean wooden desk',
    },
    {
        id: 'no4-pen',
        name: 'No.4 Fountain Pen',
        material: 'Brushed steel · Fine nib',
        price: 58,
        rating: 4.9,
        reviews: 301,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
        alt: 'Fountain pen writing on paper',
    },
    {
        id: 'graphite-set',
        name: 'Graphite Pencil Set',
        material: 'HB–6B · Set of 6',
        price: 18,
        rating: 4.5,
        reviews: 64,
        image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=400&q=80',
        alt: 'Single pencil on a minimal pale background',
    },
]

const INITIAL_QTY = { 'arc-lamp': 1, 'stoneware-cup': 1, 'plinth-riser': 0, 'no4-pen': 1, 'graphite-set': 2 }

function Stars({ rating }) {
    const stars = [0, 1, 2, 3, 4]
    return (
        <span aria-hidden="true" className="relative inline-flex">
            <span className="flex text-neutral-300">
                {stars.map((i) => (
                    <HiStar key={i} className="size-3.5 shrink-0" />
                ))}
            </span>
            <span
                className="absolute inset-y-0 left-0 flex overflow-hidden text-neutral-900"
                style={{ width: `${(rating / 5) * 100}%` }}
            >
                {stars.map((i) => (
                    <HiStar key={i} className="size-3.5 shrink-0" />
                ))}
            </span>
        </span>
    )
}

export function CompactRowProductCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [qty, setQty] = useState(INITIAL_QTY)
    const [saved, setSaved] = useState(() => new Set(['plinth-riser']))

    const changeQty = (id, delta) => {
        setQty((prev) => ({ ...prev, [id]: Math.min(10, Math.max(0, prev[id] + delta)) }))
    }

    const toggleSaved = (id) => {
        setSaved((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const { items, subtotal } = useMemo(
        () =>
            products.reduce(
                (acc, p) => ({ items: acc.items + qty[p.id], subtotal: acc.subtotal + qty[p.id] * p.price }),
                { items: 0, subtotal: 0 },
            ),
        [qty],
    )
    const toFree = Math.max(0, FREE_SHIPPING - subtotal)
    const meter = Math.min(100, Math.round((subtotal / FREE_SHIPPING) * 100))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('bg-neutral-100 py-16 text-neutral-900 md:py-24 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                            Monolith Goods — Desk objects, Nº 12
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl text-neutral-900">
                            Objects for a quieter desk.
                        </h2>
                    </div>
                    <p className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm sm:self-auto">
                        <HiHeart aria-hidden="true" className="size-4 text-[#2f4bff]" />
                        Saved ({saved.size})
                    </p>
                </div>

                <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
                    <ul className="divide-y divide-neutral-200">
                        {products.map((product) => {
                            const count = qty[product.id]
                            const isSaved = saved.has(product.id)
                            return (
                                <li
                                    key={product.id}
                                    className={cn(
                                        'group grid grid-cols-[72px_1fr] items-center gap-x-4 gap-y-4 px-4 py-5 transition-colors duration-200 hover:bg-neutral-50 sm:grid-cols-[96px_1fr_auto] sm:gap-x-6 sm:px-6',
                                        count === 0 && 'opacity-50 hover:opacity-100',
                                    )}
                                >
                                    <div className="size-[72px] overflow-hidden rounded-xl bg-neutral-100 sm:size-24">
                                        <img
                                            src={product.image}
                                            alt={product.alt}
                                            loading="lazy"
                                            className="size-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-base font-medium text-neutral-900">{product.name}</h3>
                                        <p className="mt-0.5 truncate text-sm text-neutral-500">{product.material}</p>
                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                                            <Stars rating={product.rating} />
                                            <span>
                                                <span className="sr-only">Rated </span>
                                                {product.rating}
                                                <span className="sr-only"> out of 5,</span> ({product.reviews})
                                            </span>
                                            <span aria-hidden="true" className="text-neutral-300">
                                                ·
                                            </span>
                                            <span className="font-medium tabular-nums text-neutral-900">
                                                {usd.format(product.price)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:justify-end">
                                        <button
                                            type="button"
                                            aria-pressed={isSaved}
                                            aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                                            className={cn(
                                                'flex size-10 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f4bff]',
                                                isSaved
                                                    ? 'border-[#2f4bff]/30 bg-[#2f4bff]/10 text-[#2f4bff]'
                                                    : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900',
                                            )}
                                            onClick={() => toggleSaved(product.id)}
                                        >
                                            {isSaved ? <HiHeart className="size-5" /> : <HiOutlineHeart className="size-5" />}
                                        </button>

                                        <div className="flex items-center rounded-full border border-neutral-200 bg-white">
                                            <button
                                                type="button"
                                                aria-label={`Decrease ${product.name} quantity`}
                                                disabled={count <= 0}
                                                className="flex size-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#2f4bff]"
                                                onClick={() => changeQty(product.id, -1)}
                                            >
                                                <HiMinus className="size-4" />
                                            </button>
                                            <span className="w-7 text-center text-sm font-medium tabular-nums">
                                                <span className="sr-only">{product.name} quantity: </span>
                                                {count}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label={`Increase ${product.name} quantity`}
                                                disabled={count >= 10}
                                                className="flex size-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#2f4bff]"
                                                onClick={() => changeQty(product.id, 1)}
                                            >
                                                <HiPlus className="size-4" />
                                            </button>
                                        </div>

                                        <p className="w-20 text-right text-sm font-semibold tabular-nums">
                                            {count ? usd.format(count * product.price) : '—'}
                                        </p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>

                    <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-6 sm:px-6">
                        <div>
                            <p className="text-sm text-neutral-600">
                                {toFree > 0 ? (
                                    <>
                                        Add <span className="font-semibold text-neutral-900">{usd.format(toFree)}</span> more
                                        for free shipping
                                    </>
                                ) : (
                                    <span className="font-semibold text-[#2f4bff]">Free shipping unlocked</span>
                                )}
                            </p>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                                <motion.div
                                    className="h-full rounded-full bg-[#2f4bff]"
                                    initial={false}
                                    animate={{ width: `${meter}%` }}
                                    transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div aria-live="polite">
                                <p className="text-sm text-neutral-500">
                                    Subtotal · {items} {items === 1 ? 'item' : 'items'}
                                </p>
                                <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                                    {usd.format(subtotal)}
                                </p>
                                <p className="mt-1 text-xs text-neutral-500">Taxes calculated at checkout</p>
                            </div>
                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                                <a
                                    href="#monolith-objects"
                                    className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-medium text-neutral-700 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f4bff]"
                                >
                                    Keep browsing
                                </a>
                                <a
                                    href="#monolith-checkout"
                                    aria-disabled={items === 0}
                                    tabIndex={items === 0 ? -1 : undefined}
                                    className={cn(
                                        'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2f4bff] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#1f36e0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f4bff]',
                                        items === 0 && 'pointer-events-none bg-neutral-300',
                                    )}
                                >
                                    Checkout
                                    <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CompactRowProductCard

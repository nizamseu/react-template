// SwatchSwapProductCard

// ProductQuickView02 · E-commerce & Marketplaces › Product Card / Quick View

// Description:
// A quiet, editorial apparel grid for the fictional label Linen & Ash, headed "The autumn
// uniform." Four product cards crossfade to a styled second photo on hover, swap their
// main photo when a colour swatch is picked, and reveal an "Add to bag" bar that slides up
// from the bottom of the image. Use it on collection pages or "New arrivals" rows where
// colour choice matters as much as the product itself.

// Design:
// - Oat #efe7dc section with charcoal #2b2a28 type; serif display heading, serif product
//   names, small uppercase tracking labels; square-cornered image wells (#e4dacb, aspect-3/4)
// - Tags ("Bestseller", "New", "Low stock", "Organic wool") as oat pills top-left; the
//   add bar is a charcoal button with oat text, turning oat-outlined once in the bag
// - Swatches: 40px round buttons with a 24px colour dot and a charcoal ring when selected;
//   the chosen colour name is printed under the product name
// - Motion: colour changes crossfade (framer-motion AnimatePresence); hover crossfades to
//   the styled photo over 700 ms and the bar slides up with an ease-out curve
// - Responsive: grid-cols-2 → lg:grid-cols-4; the header stacks on mobile; on touch
//   (coarse pointer) the bar is always visible and there is no hover photo

// What it does:
// - colorById stores the selected swatch per product (state); the main photo and colour
//   label follow it; swatches expose aria-pressed and "Colour: <name>" labels
// - "Add to bag" toggles the product in a bag Set (aria-pressed) → "Added to bag ✓";
//   the header "Bag (n)" count reflects it
// - Hover/focus reveal only applies to fine pointers (pointer-fine: variants);
//   "Shop new arrivals" links to #linen-ash-new

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SwatchSwapProductCard from '@/TestComponent/PageSections/ecommerce/ProductQuickView02';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <SwatchSwapProductCard />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiOutlineShoppingBag } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`

const products = [
    {
        id: 'everyday-crew',
        name: 'Everyday Crew Tee',
        detail: 'Heavyweight organic cotton',
        tag: 'Bestseller',
        price: 38,
        colors: [
            {
                name: 'Chalk',
                hex: '#f1ede4',
                image: photo('1521572163474-6864f9cf17ab'),
                alt: 'Man wearing a plain white crew-neck t-shirt',
            },
            {
                name: 'Onyx',
                hex: '#1f1f1f',
                image: photo('1618354691373-d851c5c3a990'),
                alt: 'Black crew-neck t-shirt on a wooden hanger',
            },
        ],
        hover: photo('1541099649105-f69ad21f3246'),
        hoverAlt: 'Man in a t-shirt and ripped jeans walking outdoors',
    },
    {
        id: 'camp-shirt',
        name: 'Linen Camp Shirt',
        detail: 'Stonewashed European linen',
        tag: 'New',
        price: 78,
        colors: [
            {
                name: 'Sage',
                hex: '#9aa98c',
                image: photo('1523381210434-271e8be1f52b'),
                alt: 'Sage green linen shirts hanging on a rail',
            },
            {
                name: 'Oat',
                hex: '#d9ccb7',
                image: photo('1490481651871-ab68de25d43d'),
                alt: 'Neutral-toned linen clothes hanging on a rail',
            },
        ],
        hover: photo('1473966968600-fa801b869a1a'),
        hoverAlt: 'Man wearing khaki chinos and a relaxed shirt',
    },
    {
        id: 'harbour-jacket',
        name: 'Harbour Jacket',
        detail: 'Brushed cotton twill',
        tag: 'Low stock',
        price: 168,
        colors: [
            {
                name: 'Terracotta',
                hex: '#b5583a',
                image: photo('1591047139829-d91aecb6caea'),
                alt: 'Terracotta bomber jacket on a hanger',
            },
            {
                name: 'Onyx',
                hex: '#1b1b1b',
                image: photo('1551028719-00167b16eac5'),
                alt: 'Black jacket on a plain white background',
            },
        ],
        hover: photo('1567401893414-76b7b1e5a7a5'),
        hoverAlt: 'Boutique clothing racks with jackets and knitwear',
    },
    {
        id: 'drift-poncho',
        name: 'Drift Knit Poncho',
        detail: 'Undyed merino blend',
        tag: 'Organic wool',
        price: 124,
        colors: [
            {
                name: 'Cream',
                hex: '#ece3d0',
                image: photo('1434389677669-e08b4cac3105'),
                alt: 'Cream knit poncho on a wooden hanger',
            },
            {
                name: 'Heather',
                hex: '#b9b1a5',
                image: photo('1558769132-cb1aea458c5e'),
                alt: 'Rack of soft neutral knitwear',
            },
        ],
        hover: photo('1578500494198-246f612d3b3d'),
        hoverAlt: 'Beige sofa with pampas grass in a calm living room',
    },
]

export function SwatchSwapProductCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [colorById, setColorById] = useState({})
    const [bag, setBag] = useState(() => new Set())

    const toggleBag = (id) => {
        setBag((prev) => {
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
            className={cn('bg-[#efe7dc] py-16 text-[#2b2a28] md:py-24 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 border-b border-[#2b2a28]/15 pb-10 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-serif text-sm italic text-[#2b2a28]/70">Linen & Ash — Autumn / Winter ’26</p>
                        <h2 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl text-[#2b2a28] font-normal">
                            The autumn uniform.
                        </h2>
                    </div>
                    <div className="flex items-center gap-6 md:flex-col md:items-end md:gap-3">
                        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#2b2a28]/70">
                            <HiOutlineShoppingBag aria-hidden="true" className="size-4" />
                            Bag ({bag.size})
                        </p>
                        <a
                            href="#linen-ash-new"
                            className="group inline-flex min-h-11 items-center gap-3 text-sm uppercase tracking-[0.2em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2b2a28]"
                        >
                            Shop new arrivals
                            <HiArrowLongRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
                    {products.map((product) => {
                        const colorIndex = colorById[product.id] ?? 0
                        const color = product.colors[colorIndex]
                        const inBag = bag.has(product.id)

                        return (
                            <article key={product.id}>
                                <div className="group/media relative aspect-[3/4] overflow-hidden bg-[#e4dacb]">
                                    <AnimatePresence initial={false}>
                                        <motion.img
                                            key={color.image}
                                            src={color.image}
                                            alt={color.alt}
                                            loading="lazy"
                                            className="absolute inset-0 size-full object-cover"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: reduce ? 0 : 0.5, ease: 'easeOut' }}
                                        />
                                    </AnimatePresence>
                                    <img
                                        src={product.hover}
                                        alt={product.hoverAlt}
                                        loading="lazy"
                                        className="pointer-events-none absolute inset-0 hidden size-full object-cover opacity-0 transition-opacity duration-700 ease-out pointer-fine:block pointer-fine:group-hover/media:opacity-100"
                                    />
                                    <span className="absolute left-3 top-3 bg-[#efe7dc] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] sm:text-[11px]">
                                        {product.tag}
                                    </span>
                                    <div className="absolute inset-x-0 bottom-0 p-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-3 pointer-fine:translate-y-full pointer-fine:group-hover/media:translate-y-0 pointer-fine:group-focus-within/media:translate-y-0 motion-reduce:transition-none">
                                        <button
                                            type="button"
                                            aria-pressed={inBag}
                                            aria-label={inBag ? `Remove ${product.name} from bag` : `Add ${product.name} in ${color.name} to bag`}
                                            className={cn(
                                                'flex min-h-11 w-full items-center justify-center gap-2 px-3 text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2a28] sm:text-xs',
                                                inBag
                                                    ? 'border border-[#2b2a28] bg-[#efe7dc] text-[#2b2a28]'
                                                    : 'bg-[#2b2a28] text-[#efe7dc] hover:bg-black',
                                            )}
                                            onClick={() => toggleBag(product.id)}
                                        >
                                            {inBag ? 'Added to bag ✓' : 'Add to bag'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                                    <h3 className="font-serif text-lg leading-snug sm:text-xl text-[#2b2a28] font-normal">{product.name}</h3>
                                    <p className="text-sm tabular-nums">${product.price}</p>
                                </div>
                                <p className="mt-1 text-xs text-[#2b2a28]/60">
                                    {product.detail} · <span className="text-[#2b2a28]">{color.name}</span>
                                </p>
                                <div className="-ml-1.5 mt-2 flex gap-1">
                                    {product.colors.map((option, i) => (
                                        <button
                                            key={option.name}
                                            type="button"
                                            aria-pressed={i === colorIndex}
                                            aria-label={`Colour: ${option.name}`}
                                            className="group/swatch flex size-10 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#2b2a28]"
                                            onClick={() => setColorById((prev) => ({ ...prev, [product.id]: i }))}
                                        >
                                            <span
                                                className={cn(
                                                    'size-6 rounded-full ring-1 ring-offset-2 ring-offset-[#efe7dc] transition',
                                                    i === colorIndex
                                                        ? 'ring-[#2b2a28]'
                                                        : 'ring-[#2b2a28]/15 group-hover/swatch:ring-[#2b2a28]/50',
                                                )}
                                                style={{ backgroundColor: option.hex }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default SwatchSwapProductCard

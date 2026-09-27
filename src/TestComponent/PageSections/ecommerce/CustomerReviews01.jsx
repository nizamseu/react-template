// MasonryUGCWallCustomerReviews

// CustomerReviews01 · E-commerce & Marketplaces › Customer Reviews & UGC

// Description:
// A community photo wall for the apparel brand Wild Thread built around the hashtag
// "#WornWild". Customer photos sit in a masonry wall, each with an @handle chip; hovering
// or tapping a photo reveals a pulsing product hotspot and a card with the tagged item,
// its price and a "Shop the look" link. The header invites shoppers to "Share your look",
// and "Load more looks" reveals the rest. Use it on a home page, lookbook or product page.

// Design:
// - Header (stacked → md: giant hashtag left, copy + CTA right) above a CSS-columns
//   masonry wall: columns-2 → md:columns-3 → lg:columns-4 with break-inside-avoid tiles
// - Warm white #fbf8f3 background, ink #1f1a14 text, burnt-orange #d9531e accent for the
//   hashtag mark, hotspot dot and CTA; tiles rounded-2xl with fixed aspect ratios (2/3,
//   3/4, 4/5, 1/1, 5/4) so the wall never jumps while images load
// - "#WornWild" is font-black text-6xl → sm:text-7xl → lg:text-9xl, tracking-tighter;
//   handle chips are white/85 backdrop-blur pills, the product card is a frosted
//   #fbf8f3/95 panel pinned to the tile bottom
// - Images scale 1.06 on hover; the card slides up 12px and fades in; new tiles fade and
//   rise when "Load more" is pressed (no movement with reduced motion)
// - Gaps gap-3 → sm:gap-4; card text is 11–14px so it fits 2-column phones

// What it does:
// - active (state) holds the tapped tile id; each tile’s full-size button toggles it
//   (aria-expanded) so touch users can open the card that hover/focus-within shows.
// - expanded (state) switches the wall from the first 8 looks to all 12; the button is
//   replaced by an "all caught up" note afterwards.
// - Links: each "Shop the look" → #shop-<product-slug>, "Share your look" →
//   #share-your-look.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MasonryUGCWallCustomerReviews from '@/TestComponent/PageSections/ecommerce/CustomerReviews01';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <MasonryUGCWallCustomerReviews />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuArrowUpRight, LuCamera, LuPlus, LuTag } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const looks = [
    {
        id: 'look-01',
        handle: '@mara.goes.up',
        src: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80',
        alt: 'Group of friends in flannel and hiking layers laughing below rocky mountain peaks',
        aspect: 'aspect-[4/5]',
        product: { name: 'Basecamp Flannel Overshirt', price: '$78', slug: 'basecamp-flannel-overshirt' },
        spot: { left: '40%', top: '36%' },
    },
    {
        id: 'look-02',
        handle: '@junebug.fits',
        src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
        alt: 'Woman in heart-shaped sunglasses, a red graphic tee and black jacket against a teal sky',
        aspect: 'aspect-[3/4]',
        product: { name: 'Poppy Boxy Graphic Tee', price: '$42', slug: 'poppy-boxy-graphic-tee' },
        spot: { left: '46%', top: '52%' },
    },
    {
        id: 'look-03',
        handle: '@tess.on.sand',
        src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        alt: 'Woman in a bright yellow cropped hoodie and joggers beside a beachside basketball hoop',
        aspect: 'aspect-[2/3]',
        product: { name: 'Sunday Fleece Tracksuit', price: '$124', slug: 'sunday-fleece-tracksuit' },
        spot: { left: '52%', top: '30%' },
    },
    {
        id: 'look-04',
        handle: '@kofi.walks',
        src: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        alt: 'Close-up of patched, ripped jeans mid-stride',
        aspect: 'aspect-square',
        product: { name: 'Patchwork Straight Denim', price: '$98', slug: 'patchwork-straight-denim' },
        spot: { left: '42%', top: '30%' },
    },
    {
        id: 'look-05',
        handle: '@elodie.outside',
        src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
        alt: 'Woman in a long blue coat surrounded by pigeons in front of a gothic cathedral',
        aspect: 'aspect-[3/4]',
        product: { name: 'Harbor Wool Car Coat', price: '$245', slug: 'harbor-wool-car-coat' },
        spot: { left: '40%', top: '40%' },
    },
    {
        id: 'look-06',
        handle: '@sam.layers',
        src: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
        alt: 'Back view of a person wearing a heavyweight grey hoodie',
        aspect: 'aspect-[4/5]',
        product: { name: 'Heavyweight Loop Hoodie', price: '$88', slug: 'heavyweight-loop-hoodie' },
        spot: { left: '52%', top: '40%' },
    },
    {
        id: 'look-07',
        handle: '@noor.wears',
        src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        alt: 'Woman in striped wide-leg trousers posing under a neon sign on a teal wall',
        aspect: 'aspect-[2/3]',
        product: { name: 'Deckchair Stripe Trouser', price: '$92', slug: 'deckchair-stripe-trouser' },
        spot: { left: '56%', top: '48%' },
    },
    {
        id: 'look-08',
        handle: '@wildweekends',
        src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
        alt: 'Group of friends hugging outdoors at sunset',
        aspect: 'aspect-[5/4]',
        product: { name: 'Campfire Crew Sweatshirt', price: '$72', slug: 'campfire-crew-sweatshirt' },
        spot: { left: '30%', top: '44%' },
    },
    {
        id: 'look-09',
        handle: '@dante.basics',
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        alt: 'Man wearing a plain white crew-neck t-shirt',
        aspect: 'aspect-[3/4]',
        product: { name: 'Everyday Organic Tee', price: '$34', slug: 'everyday-organic-tee' },
        spot: { left: '50%', top: '32%' },
    },
    {
        id: 'look-10',
        handle: '@isla.rae',
        src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        alt: 'Smiling woman in a denim jacket over a grey hoodie and beanie',
        aspect: 'aspect-[4/5]',
        product: { name: 'Trucker Denim Jacket', price: '$138', slug: 'trucker-denim-jacket' },
        spot: { left: '64%', top: '50%' },
    },
    {
        id: 'look-11',
        handle: '@marcus.ok',
        src: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
        alt: 'Person in khaki chinos and a denim jacket standing on a path',
        aspect: 'aspect-square',
        product: { name: 'Field Chino, Khaki', price: '$84', slug: 'field-chino-khaki' },
        spot: { left: '42%', top: '36%' },
    },
    {
        id: 'look-12',
        handle: '@priya.in.town',
        src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
        alt: 'Woman in sunglasses and a burgundy coat holding shopping bags',
        aspect: 'aspect-[3/4]',
        product: { name: 'Merlot Wool Wrap Coat', price: '$265', slug: 'merlot-wool-wrap-coat' },
        spot: { left: '62%', top: '52%' },
    },
]

const INITIAL_COUNT = 8

export function MasonryUGCWallCustomerReviews({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [active, setActive] = useState(null)
    const [expanded, setExpanded] = useState(false)
    const reduce = useReducedMotion()
    const visible = expanded ? looks : looks.slice(0, INITIAL_COUNT)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden bg-[#fbf8f3] px-4 py-16 text-[#1f1a14] antialiased sm:px-6 md:py-24 lg:px-10 text-base font-normal',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#1f1a14]/60">
                            <LuCamera aria-hidden="true" className="h-4 w-4" />
                            Wild Thread · Community
                        </p>
                        <h2 className="mt-4 text-6xl leading-[0.85] font-black tracking-tighter sm:text-7xl lg:text-9xl text-[#1f1a14]">
                            <span className="text-[#d9531e]">#</span>WornWild
                        </h2>
                    </div>
                    <div className="max-w-sm md:pb-2">
                        <p className="text-base leading-relaxed text-[#1f1a14]/70">
                            4,812 looks shared this season. Tag{' '}
                            <span className="font-semibold text-[#1f1a14]">@wildthread</span> and{' '}
                            <span className="font-semibold text-[#1f1a14]">#WornWild</span> for a
                            chance to be featured — plus $50 in store credit.
                        </p>
                        <a
                            href="#share-your-look"
                            className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1f1a14] px-5 text-sm font-semibold text-[#fbf8f3] transition-colors hover:bg-[#d9531e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9531e]"
                        >
                            Share your look
                            <LuArrowUpRight
                                aria-hidden="true"
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                    </div>
                </div>

                <ul className="mt-12 columns-2 gap-3 sm:gap-4 md:mt-16 md:columns-3 lg:columns-4">
                    <AnimatePresence initial={false}>
                        {visible.map((look, i) => {
                            const isActive = active === look.id

                            return (
                                <motion.li
                                    key={look.id}
                                    initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i >= INITIAL_COUNT ? (i - INITIAL_COUNT) * 0.07 : 0,
                                    }}
                                    className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-[#ece5d8] sm:mb-4"
                                >
                                    <div className={cn('relative w-full', look.aspect)}>
                                        <img
                                            src={look.src}
                                            alt={look.alt}
                                            loading="lazy"
                                            className={cn(
                                                'absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]',
                                                isActive && 'scale-[1.06]',
                                            )}
                                        />
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                                        />

                                        <button
                                            type="button"
                                            aria-expanded={isActive}
                                            aria-label={`Show the product tagged in ${look.handle}’s look`}
                                            className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-[#d9531e]"
                                            onClick={() => setActive(isActive ? null : look.id)}
                                        />

                                        <span
                                            aria-hidden="true"
                                            style={look.spot}
                                            className={cn(
                                                'pointer-events-none absolute z-20 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100',
                                                isActive && 'opacity-100',
                                            )}
                                        >
                                            <span className="absolute inset-0 animate-ping rounded-full bg-white/60 motion-reduce:animate-none" />
                                            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#d9531e] text-white ring-2 ring-white">
                                                <LuPlus className="h-3 w-3" />
                                            </span>
                                        </span>

                                        <span
                                            className={cn(
                                                'pointer-events-none absolute bottom-2.5 left-2.5 z-20 max-w-[calc(100%-1.25rem)] truncate rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0 sm:bottom-3 sm:left-3 sm:text-xs',
                                                isActive && 'opacity-0',
                                            )}
                                        >
                                            {look.handle}
                                        </span>

                                        <div
                                            className={cn(
                                                'pointer-events-none absolute inset-x-2 bottom-2 z-30 translate-y-3 rounded-xl bg-[#fbf8f3]/95 p-2.5 opacity-0 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 sm:inset-x-3 sm:bottom-3 sm:p-3',
                                                isActive && 'pointer-events-auto translate-y-0 opacity-100',
                                            )}
                                        >
                                            <p className="truncate text-[11px] font-semibold text-[#1f1a14]/55">
                                                {look.handle} is wearing
                                            </p>
                                            <p className="mt-1 flex items-start gap-1.5 text-xs leading-tight font-semibold sm:text-sm">
                                                <LuTag aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#d9531e]" />
                                                <span className="min-w-0 flex-1">{look.product.name}</span>
                                                <span className="shrink-0 tabular-nums">{look.product.price}</span>
                                            </p>
                                            <a
                                                href={`#shop-${look.product.slug}`}
                                                className="mt-2 flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#1f1a14] px-3 text-xs font-semibold text-[#fbf8f3] transition-colors hover:bg-[#d9531e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9531e]"
                                            >
                                                Shop the look
                                                <LuArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.li>
                            )
                        })}
                    </AnimatePresence>
                </ul>

                <div className="mt-10 flex justify-center">
                    {expanded ? (
                        <p className="text-sm text-[#1f1a14]/60">
                            You’re all caught up — see more on{' '}
                            <a
                                href="#share-your-look"
                                className="font-semibold text-[#1f1a14] underline decoration-[#d9531e] decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9531e]"
                            >
                                #WornWild
                            </a>
                        </p>
                    ) : (
                        <button
                            type="button"
                            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[#1f1a14] px-6 text-sm font-semibold transition-colors hover:bg-[#1f1a14] hover:text-[#fbf8f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9531e]"
                            onClick={() => setExpanded(true)}
                        >
                            Load more looks
                            <span className="rounded-full bg-[#d9531e] px-2 py-0.5 text-[11px] text-white">
                                +{looks.length - INITIAL_COUNT}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default MasonryUGCWallCustomerReviews

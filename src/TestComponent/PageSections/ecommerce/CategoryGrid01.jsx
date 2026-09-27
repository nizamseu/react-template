// BentoMosaicCategoryGrid

// CategoryGrid01 · E-commerce & Marketplaces › Category Grid

// Description:
// A warm, editorial "shop by room" bento for the home-goods brand Hollow & Hearth. Under
// the serif heading "Rooms that feel like home, one corner at a time." it shows eight
// photo tiles (Living Room hero, Tableware, Lighting, Vases & Vessels, Candles & Scent,
// Sofas & Seating, Planters, Ceramics) and a "Shop all rooms" link. Use it high on a home
// or furniture storefront to route shoppers into category pages.

// Design:
// - Asymmetric bento: grid-cols-2 → md:grid-cols-4 with fixed auto-rows (168px → sm:210px
//   → lg:240px); Living Room is a 2×2 hero tile, Sofas & Seating a 2×1 wide tile
// - Cream #f3efe6 background, ink #1d1b16 text, olive #5b6b3a accents (eyebrow rule, hero
//   badge, focus outline, link underline); tiles have an ink gradient scrim for legibility
// - Serif display heading text-4xl → md:text-6xl with an italic olive word; tile labels in
//   serif, counts in tiny uppercase tracking; tiles are rounded-[22px]
// - Hover: photo scales to 1.07 over 900ms and a cream arrow chip slides in top-right (the
//   chip is always visible below md, where there is no hover)
// - Tiles fade and rise in with a small stagger when scrolled into view (framer-motion);
//   the offset is removed for reduced motion

// What it does:
// - Every tile is an anchor to #shop-<room> (e.g. #shop-living-room); "Shop all rooms"
//   points to #shop-all-rooms
// - No state: the arrow chip, image zoom and entrance motion are visual only
// - useReducedMotion() turns the entrance into a plain fade

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BentoMosaicCategoryGrid from '@/TestComponent/PageSections/ecommerce/CategoryGrid01';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <BentoMosaicCategoryGrid />
//     </main>
// )
// ```

'use client'

import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const rooms = [
    {
        id: 'living-room',
        name: 'Living Room',
        count: 214,
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1200&q=80',
        alt: 'Tan sofa with a grey throw beside a vase of dried pampas grass',
        span: 'col-span-2 row-span-2',
        hero: true,
    },
    {
        id: 'tableware',
        name: 'Tableware',
        count: 86,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        alt: 'Stack of glazed blue ceramic plates on a wooden table',
    },
    {
        id: 'lighting',
        name: 'Lighting',
        count: 42,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        alt: 'Grey metal desk lamp against a white wall',
    },
    {
        id: 'vases',
        name: 'Vases & Vessels',
        count: 58,
        image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=800&q=80',
        alt: 'White ceramic vases holding a blossom branch on a wooden tray',
    },
    {
        id: 'candles',
        name: 'Candles & Scent',
        count: 31,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
        alt: 'Lit candle in a glass jar in a cosy setting',
    },
    {
        id: 'seating',
        name: 'Sofas & Seating',
        count: 64,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        alt: 'Deep green velvet sofa with cushions',
        span: 'col-span-2',
    },
    {
        id: 'planters',
        name: 'Planters',
        count: 27,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        alt: 'Small succulent planted in a mint green pot',
    },
    {
        id: 'ceramics',
        name: 'Ceramics',
        count: 49,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        alt: 'Hand-thrown white ceramic cups and vessels',
    },
]

export function BentoMosaicCategoryGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f3efe6] px-4 py-16 font-normal text-[#1d1b16] sm:px-6 md:py-24 lg:px-10 text-base',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5b6b3a]">
                            <span className="h-px w-10 bg-[#5b6b3a]" aria-hidden="true" />
                            Hollow &amp; Hearth · Shop by room
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#1d1b16] sm:text-5xl md:text-6xl">
                            Rooms that feel like <em className="text-[#5b6b3a]">home</em>, one corner at a time.
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 md:max-w-xs md:items-end md:text-right">
                        <p className="text-sm leading-relaxed text-[#1d1b16]/70">
                            Slow-made furniture, stoneware and linens from 40 small studios. Free
                            delivery over $150.
                        </p>
                        <a
                            href="#shop-all-rooms"
                            className="group/link inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-[#1d1b16] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b6b3a] md:self-end"
                        >
                            <span className="border-b border-[#5b6b3a] pb-0.5">Shop all rooms</span>
                            <HiArrowLongRight
                                className="h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                </div>

                <div className="mt-10 grid auto-rows-[168px] grid-cols-2 gap-3 sm:auto-rows-[210px] md:mt-14 md:grid-cols-4 md:gap-4 lg:auto-rows-[240px]">
                    {rooms.map((room, index) => (
                        <motion.a
                            key={room.id}
                            href={`#shop-${room.id}`}
                            aria-label={`${room.name}, ${room.count} items`}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                            className={cn(
                                'group relative isolate overflow-hidden rounded-[22px] bg-[#e4ddcd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b6b3a]',
                                room.span,
                            )}
                        >
                            <img
                                src={room.image}
                                alt={room.alt}
                                loading="lazy"
                                className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                            />
                            <div
                                className="absolute inset-0 -z-10 bg-linear-to-t from-[#1d1b16]/80 via-[#1d1b16]/15 to-transparent"
                                aria-hidden="true"
                            />

                            {room.hero && (
                                <span className="absolute left-4 top-4 rounded-full bg-[#5b6b3a] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f3efe6] sm:left-6 sm:top-6">
                                    New · Linen &amp; Oak edit
                                </span>
                            )}

                            <span
                                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[#f3efe6] text-[#1d1b16] shadow-[0_6px_20px_-8px_rgba(29,27,22,0.6)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:-translate-x-3 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-focus-visible:translate-x-0 md:group-focus-visible:opacity-100"
                                aria-hidden="true"
                            >
                                <HiArrowUpRight className="h-4 w-4" />
                            </span>

                            <div
                                className={cn(
                                    'absolute inset-x-0 bottom-0 p-4 text-[#f3efe6] sm:p-5',
                                    room.hero && 'sm:p-8',
                                )}
                            >
                                <p
                                    className={cn(
                                        'font-serif text-lg leading-tight sm:text-2xl',
                                        room.hero && 'text-3xl sm:text-5xl',
                                    )}
                                >
                                    {room.name}
                                </p>
                                {room.hero && (
                                    <p className="mt-2 hidden max-w-sm text-sm leading-relaxed text-[#f3efe6]/80 sm:block">
                                        Worn-in leather sofas, travertine side tables and throws
                                        made for long, slow evenings.
                                    </p>
                                )}
                                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f3efe6]/75 sm:text-[11px]">
                                    {room.count} items
                                </p>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BentoMosaicCategoryGrid

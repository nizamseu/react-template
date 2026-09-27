// EditorialStaffPicksBestSellers

// BestSellers04 · E-commerce & Marketplaces › Featured / Best Sellers

// Description:
// A magazine-spread take on best sellers for the stationery and home shop Paper & Loom.
// "The Staff Picks Issue" opens with the headline "What we reach for, every single day.",
// a drop-cap standfirst and an overlapping photo pair, then a large oxblood pull quote,
// then four numbered picks, each with an italic "Picked by <name>" note and an "Add to
// basket" toggle. Use it for curated, story-led shops where people buy on trust.

// Design:
// - 12-column grid on lg: headline and standfirst in cols 1-5, photo pair in cols 7-12,
//   pull quote across cols 2-11, picks in 4 staggered columns (even picks drop 64px);
//   md shows picks in 2 columns; everything is a single column on mobile
// - Paper #efe9dd background, ink #1f1b16 text, oxblood #7a1f2b for the kicker, drop cap,
//   pull quote, pick numbers and annotation rules; thin ink hairlines and a double rule
// - Serif throughout for display (text-4xl → lg:text-7xl headline, italic pull quote
//   text-3xl → lg:text-5xl); mono small caps for masthead, figure captions and prices
// - The small photo overlaps the large one (-bottom/-left offset, 8px paper border,
//   -3° tilt) on sm+; picks fade up in a stagger on scroll (reduced-motion safe)

// What it does:
// - basket state (a Set of pick ids) toggles per pick: "Add to basket — $68" becomes "In
//   your basket ✓" (aria-pressed); the masthead shows the live basket count
// - Pick titles link to #paper-loom-<pick>; "Read the full issue" points to
//   #paper-loom-staff-picks
// - The overlap, tilt and stagger are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EditorialStaffPicksBestSellers from '@/TestComponent/PageSections/ecommerce/BestSellers04';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <EditorialStaffPicksBestSellers />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiCheck } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const picks = [
    {
        id: 'brass-fountain-pen',
        name: 'No. 7 Brass Fountain Pen',
        detail: 'Fine steel nib · refillable converter',
        price: 68,
        staff: 'Mira Okafor',
        role: 'Head of Paper',
        note: 'It writes like it has been broken in for years. I own three.',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80',
        alt: 'Fountain pen writing cursive on lined paper',
    },
    {
        id: 'stoneware-desk-cups',
        name: 'Stoneware Desk Cups, set of 3',
        detail: 'Hand-thrown in Stoke · speckled glaze',
        price: 42,
        staff: 'Jonah Reyes',
        role: 'Studio Manager',
        note: 'One for pens, one for clips, one for coffee. Obviously.',
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=80',
        alt: 'Speckled stoneware cups arranged on a white shelf',
    },
    {
        id: 'beeswax-reading-candle',
        name: 'Beeswax Reading Candle',
        detail: 'Cedar & old paper · 50-hour burn',
        price: 34,
        staff: 'Elif Aydın',
        role: 'Customer Care',
        note: 'Smells exactly like a library after the rain.',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80',
        alt: 'Lit candle in a glass vessel beside fairy lights',
    },
    {
        id: 'ink-blue-plates',
        name: 'Ink Blue Side Plates, pair',
        detail: 'Reactive glaze · dishwasher safe',
        price: 58,
        staff: 'Sam Whitlock',
        role: 'Buyer',
        note: 'Bought them for the shop, kept four for my own table.',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80',
        alt: 'Stack of ink blue glazed ceramic plates on a wooden table',
    },
]

export function EditorialStaffPicksBestSellers({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [basket, setBasket] = useState(() => new Set())
    const reduceMotion = useReducedMotion()

    const toggleBasket = (id) => {
        setBasket((previous) => {
            const next = new Set(previous)
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
            className={cn(
                'relative overflow-hidden bg-[#efe9dd] px-4 py-16 font-normal text-[#1f1b16] sm:px-6 md:py-24 lg:px-10 text-base',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-2 items-center gap-2 border-y-[3px] border-double border-[#1f1b16] py-3 font-mono text-[10px] uppercase tracking-[0.25em] sm:text-[11px] md:grid-cols-3">
                    <span className="font-serif text-base normal-case italic tracking-normal">Paper &amp; Loom</span>
                    <span className="hidden text-center md:block">The Staff Picks Issue — No. 14</span>
                    <span className="text-right">
                        <span className="hidden sm:inline">October 2026 · </span>
                        Basket {basket.size}
                    </span>
                </div>

                <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5 lg:pt-6">
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#7a1f2b]">
                            Best sellers, hand-chosen
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#1f1b16] sm:text-6xl lg:text-7xl">
                            What we reach for, every single day.
                        </h2>
                        <p className="mt-8 max-w-md text-base leading-relaxed text-[#1f1b16]/80 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-[#7a1f2b]">
                            Every autumn we ask the people who pack your parcels, answer your
                            emails and choose our paper which pieces they genuinely use. These
                            four outsold everything else in the shop this season — and not one
                            of them was on sale.
                        </p>
                        <p className="mt-6 font-serif text-sm italic text-[#1f1b16]/60">
                            Words by the Paper &amp; Loom staff · Photographs by Ines Marlowe
                        </p>
                    </div>

                    <figure className="relative lg:col-span-6 lg:col-start-7">
                        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                            <img
                                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80"
                                alt="Floor-to-ceiling wooden bookshelves filled with old books"
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-4 hidden w-[42%] -rotate-3 border-8 border-[#efe9dd] bg-[#efe9dd] shadow-[0_24px_50px_-24px_rgba(31,27,22,0.6)] sm:block lg:-left-16">
                            <img
                                src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80"
                                alt="A single sharpened pencil standing on white paper"
                                loading="lazy"
                                className="aspect-[4/5] w-full object-cover"
                            />
                        </div>
                        <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1f1b16]/55 sm:ml-[46%] sm:mt-5">
                            Fig. 1 — The reading room at our Hudson shop, where every pick is tested.
                        </figcaption>
                    </figure>
                </div>

                <blockquote className="mx-auto mt-20 max-w-5xl border-y border-[#1f1b16]/20 py-12 text-center lg:mt-28 lg:py-16">
                    <span
                        className="block font-serif text-7xl leading-[0.6] text-[#7a1f2b]/35 sm:text-8xl"
                        aria-hidden="true"
                    >
                        &ldquo;
                    </span>
                    <p className="mt-2 font-serif text-3xl italic leading-[1.15] text-[#7a1f2b] sm:text-4xl lg:text-5xl">
                        A good notebook should feel like a quiet room you can carry around.
                    </p>
                    <footer className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-[#1f1b16]/65">
                        — Mira Okafor, Head of Paper
                    </footer>
                </blockquote>

                <ol className="mt-16 grid gap-12 md:grid-cols-2 md:gap-x-8 lg:mt-20 lg:grid-cols-4 lg:gap-x-8">
                    {picks.map((pick, index) => {
                        const inBasket = basket.has(pick.id)

                        return (
                            <motion.li
                                key={pick.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className={cn('flex flex-col', index % 2 === 1 && 'lg:mt-16')}
                            >
                                <div className="flex items-baseline justify-between border-b border-[#1f1b16] pb-2">
                                    <span className="font-serif text-2xl italic text-[#7a1f2b]">
                                        No. {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="font-mono text-xs text-[#1f1b16]">${pick.price}</span>
                                </div>
                                <div className="mt-4 aspect-[4/5] overflow-hidden bg-[#e3dccd]">
                                    <img
                                        src={pick.image}
                                        alt={pick.alt}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
                                    />
                                </div>
                                <h3 className="mt-5 font-serif text-2xl font-normal leading-tight text-[#1f1b16]">
                                    <a
                                        href={`#paper-loom-${pick.id}`}
                                        className="decoration-[#7a1f2b] decoration-1 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1f2b]"
                                    >
                                        {pick.name}
                                    </a>
                                </h3>
                                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#1f1b16]/55">
                                    {pick.detail}
                                </p>
                                <p className="mt-4 border-l-2 border-[#7a1f2b] pl-4 font-serif text-base italic leading-snug text-[#1f1b16]/85">
                                    Picked by {pick.staff}, {pick.role} — &ldquo;{pick.note}&rdquo;
                                </p>
                                <div className="mt-auto pt-5">
                                    <button
                                        type="button"
                                        aria-pressed={inBasket}
                                        className={cn(
                                            'inline-flex min-h-11 items-center justify-center gap-2 self-start border border-[#1f1b16] px-5 text-sm font-medium text-[#1f1b16] transition-colors duration-300 hover:bg-[#1f1b16] hover:text-[#efe9dd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1f2b]',
                                            inBasket && 'border-[#7a1f2b] bg-[#7a1f2b] text-[#efe9dd] hover:bg-[#7a1f2b]',
                                        )}
                                        onClick={() => toggleBasket(pick.id)}
                                    >
                                        {inBasket ? (
                                            <>
                                                In your basket
                                                <HiCheck className="h-4 w-4" aria-hidden="true" />
                                            </>
                                        ) : (
                                            `Add to basket — $${pick.price}`
                                        )}
                                    </button>
                                </div>
                            </motion.li>
                        )
                    })}
                </ol>

                <div className="mt-20 flex flex-col items-start gap-4 border-t border-[#1f1b16]/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-serif text-sm italic text-[#1f1b16]/65">
                        Continued on page 15: the notebooks we&rsquo;re still arguing about.
                    </p>
                    <a
                        href="#paper-loom-staff-picks"
                        className="group/link inline-flex min-h-10 items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#7a1f2b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7a1f2b]"
                    >
                        Read the full issue
                        <HiArrowLongRight
                            className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default EditorialStaffPicksBestSellers

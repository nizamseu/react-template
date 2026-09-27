// SpotlightProductBestSellers

// BestSellers03 · E-commerce & Marketplaces › Featured / Best Sellers

// Description:
// A product-spotlight best-seller section for the audio brand Hum Audio. The #1 seller,
// "Hum One ANC", is shown oversized on a terracotta disc with three spec callouts (40 mm
// beryllium drivers, 42 h battery, memory-foam headband), a rating, colour choice and "Add
// to cart"; beside it "Also in the top 5" lists four compact best-seller rows, a "Bundle
// & save $59" card and a "Shop all best sellers" link. Use it to push one hero product
// while keeping others in reach.

// Design:
// - lg: 12-column grid, spotlight card col-span-8 and the ranked column col-span-4;
//   below lg everything stacks (spotlight first); product info row stacks on mobile
// - Sand #f4e9dc page, terracotta #c65d3b disc / accents / CTA, ink #1c1512 text; the
//   circular photo layer uses mix-blend-multiply (inside an isolate card) so its white
//   backdrop melts into the card and the terracotta disc
// - Callouts (md+) are absolutely positioned: pulsing terracotta dot + 1px ink line + white
//   pill label with a mono sub-label; below md they become a 3-row list under the image
// - Serif heading and product name, mono uppercase meta; rounded-[32px] cards, rounded-2xl
//   thumbnails, rounded-full CTA and colour swatches
// - The product floats gently (y ±8px, 6s loop) and callouts stagger in on scroll; dots
//   ping only with motion-safe, and the float stops for reduced motion

// What it does:
// - colour state (Ink / Clay / Oat) changes via swatch radio buttons and updates the
//   "Colour:" label; the photo itself does not change
// - added state flips "Add to cart — $329" to "Added to cart ✓" (click again to undo)
// - Rows link to #hum-<product>; the bundle card points to #hum-bundle and "Shop all
//   best sellers" to #hum-best-sellers

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SpotlightProductBestSellers from '@/TestComponent/PageSections/ecommerce/BestSellers03';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <SpotlightProductBestSellers />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiCheck, HiChevronRight, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const specs = [
    {
        id: 'band',
        label: 'Memory-foam headband',
        detail: '254 g all day',
        position: 'left-1/2 top-[17%]',
        direction: 'right',
    },
    {
        id: 'drivers',
        label: '40 mm beryllium drivers',
        detail: '5 Hz – 40 kHz',
        position: 'right-[66%] top-[62%]',
        direction: 'left',
    },
    {
        id: 'battery',
        label: '42 h battery',
        detail: 'ANC on · fast charge',
        position: 'left-[68%] top-[70%]',
        direction: 'right',
    },
]

const colours = [
    { id: 'ink', name: 'Ink', swatch: 'bg-[#1c1512]' },
    { id: 'clay', name: 'Clay', swatch: 'bg-[#c65d3b]' },
    { id: 'oat', name: 'Oat', swatch: 'bg-[#e8dccb]' },
]

const runnersUp = [
    {
        id: 'studio-wired',
        rank: 2,
        name: 'Hum Studio Wired',
        type: 'Closed-back monitor',
        rating: 4.8,
        price: 179,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
        alt: 'Black wired studio headphones on a white background',
    },
    {
        id: 'rove-on-ear',
        rank: 3,
        name: 'Hum Rove On-Ear',
        type: 'Leather · aluminium',
        rating: 4.7,
        price: 219,
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=400&q=80',
        alt: 'Close-up of on-ear headphones with tan leather cushions',
    },
    {
        id: 'halo-max',
        rank: 4,
        name: 'Hum Halo Max',
        type: 'Spatial audio · ANC',
        rating: 4.8,
        price: 449,
        image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=400&q=80',
        alt: 'Silver over-ear headphones on an orange background',
    },
    {
        id: 'daily',
        rank: 5,
        name: 'Hum Daily',
        type: 'Wireless · 30 h battery',
        rating: 4.6,
        price: 129,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        alt: 'Black wireless headphones on a yellow background',
    },
]

function Stars({ value }) {
    return (
        <span className="flex items-center gap-0.5 text-[#c65d3b]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((index) => (
                <HiStar key={index} className={cn('h-3.5 w-3.5', index >= Math.round(value) && 'opacity-25')} />
            ))}
        </span>
    )
}

export function SpotlightProductBestSellers({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [colour, setColour] = useState('ink')
    const [added, setAdded] = useState(false)
    const reduceMotion = useReducedMotion()
    const activeColour = colours.find((item) => item.id === colour)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f4e9dc] px-4 py-16 font-normal text-[#1c1512] sm:px-6 md:py-24 lg:px-10 text-base',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#c65d3b]">
                            Hum Audio · Best sellers
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#1c1512] sm:text-5xl md:text-6xl">
                            The sound everyone&rsquo;s <em className="text-[#c65d3b]">wearing.</em>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-[#1c1512]/65">
                        Ranked by units sold across 38 countries in September 2026.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8">
                    <article className="relative isolate overflow-hidden rounded-[32px] bg-[#efdfcc] p-5 sm:p-8 lg:col-span-8 lg:p-10">
                        <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#1c1512] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4e9dc]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#c65d3b]" aria-hidden="true" />
                                No. 1 · 12,400 sold
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-widest text-[#1c1512]/55">
                                Over-ear · ANC
                            </span>
                        </div>

                        <div className="relative mx-auto mt-4 aspect-square w-full max-w-[440px]">
                            <div
                                className="absolute inset-[6%] -z-10 rounded-full bg-[#c65d3b]"
                                aria-hidden="true"
                            />
                            <motion.div
                                className="h-full w-full overflow-hidden rounded-full mix-blend-multiply"
                                animate={reduceMotion ? { y: 0 } : { y: [0, -8, 0] }}
                                transition={reduceMotion ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
                                    alt="Hum One ANC over-ear headphones in matte black"
                                    loading="lazy"
                                    className="h-full w-full scale-[1.2] object-cover"
                                />
                            </motion.div>

                            {specs.map((spec, index) => (
                                <motion.div
                                    key={spec.id}
                                    initial={{ opacity: 0, x: reduceMotion ? 0 : spec.direction === 'left' ? 12 : -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.6 }}
                                    transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                    className={cn(
                                        'absolute hidden -translate-y-1/2 items-center md:flex',
                                        spec.direction === 'left' ? '-mr-1.5 flex-row-reverse' : '-ml-1.5',
                                        spec.position,
                                    )}
                                >
                                    <span className="relative grid h-3 w-3 shrink-0 place-items-center" aria-hidden="true">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#c65d3b] opacity-60 motion-safe:animate-ping" />
                                        <span className="relative h-3 w-3 rounded-full border-2 border-[#f4e9dc] bg-[#c65d3b]" />
                                    </span>
                                    <span className="h-px w-8 bg-[#1c1512]/70" aria-hidden="true" />
                                    <span
                                        className={cn(
                                            'whitespace-nowrap rounded-full bg-white/85 px-3.5 py-2 shadow-[0_10px_30px_-15px_rgba(28,21,18,0.5)] backdrop-blur',
                                            spec.direction === 'left' && 'text-right',
                                        )}
                                    >
                                        <span className="block text-[11px] font-semibold text-[#1c1512]">{spec.label}</span>
                                        <span className="block font-mono text-[10px] uppercase tracking-wider text-[#1c1512]/55">
                                            {spec.detail}
                                        </span>
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <ul className="mt-6 grid gap-3 md:hidden">
                            {specs.map((spec) => (
                                <li key={spec.id} className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3">
                                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#c65d3b]" aria-hidden="true" />
                                    <span className="text-sm font-semibold">{spec.label}</span>
                                    <span className="ml-auto text-right font-mono text-[10px] uppercase tracking-wider text-[#1c1512]/55">
                                        {spec.detail}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-col gap-6 border-t border-[#1c1512]/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h3 className="font-serif text-3xl font-normal text-[#1c1512] sm:text-4xl">Hum One ANC</h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <Stars value={4.9} />
                                    <span className="font-mono text-[11px] text-[#1c1512]/65">4.9 · 2,184 reviews</span>
                                </div>
                                <fieldset className="mt-4">
                                    <legend className="font-mono text-[11px] uppercase tracking-widest text-[#1c1512]/65">
                                        Colour: <span className="text-[#1c1512]">{activeColour.name}</span>
                                    </legend>
                                    <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Colour">
                                        {colours.map((item) => {
                                            const isActive = item.id === colour

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={isActive}
                                                    aria-label={item.name}
                                                    className={cn(
                                                        'grid h-10 w-10 place-items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c65d3b]',
                                                        isActive && 'border-[#1c1512]',
                                                    )}
                                                    onClick={() => setColour(item.id)}
                                                >
                                                    <span
                                                        className={cn('h-7 w-7 rounded-full ring-1 ring-[#1c1512]/15', item.swatch)}
                                                    />
                                                </button>
                                            )
                                        })}
                                    </div>
                                </fieldset>
                            </div>
                            <div className="flex flex-col gap-3 sm:items-end">
                                <p className="font-serif text-3xl text-[#1c1512]">
                                    $329
                                    <span className="ml-2 align-middle font-mono text-xs text-[#1c1512]/45 line-through">
                                        $379
                                    </span>
                                </p>
                                <button
                                    type="button"
                                    aria-pressed={added}
                                    className={cn(
                                        'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c65d3b] px-7 text-sm font-semibold text-[#fff7ef] transition-colors duration-300 hover:bg-[#1c1512] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c65d3b]',
                                        added && 'bg-[#1c1512]',
                                    )}
                                    onClick={() => setAdded((value) => !value)}
                                >
                                    {added ? (
                                        <>
                                            Added to cart
                                            <HiCheck className="h-4 w-4" aria-hidden="true" />
                                        </>
                                    ) : (
                                        'Add to cart — $329'
                                    )}
                                </button>
                            </div>
                        </div>
                    </article>

                    <aside className="flex flex-col rounded-[32px] border border-[#1c1512]/10 bg-[#f8f0e6] p-5 sm:p-8 lg:col-span-4">
                        <h3 className="font-mono text-[11px] font-normal uppercase tracking-[0.3em] text-[#1c1512]/60">
                            Also in the top 5
                        </h3>
                        <ol className="mt-4 flex flex-col divide-y divide-[#1c1512]/10">
                            {runnersUp.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={`#hum-${item.id}`}
                                        className="group -mx-2 flex items-center gap-4 rounded-2xl px-2 py-4 transition-colors duration-200 hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c65d3b]"
                                    >
                                        <span className="w-6 font-mono text-xs text-[#c65d3b]">0{item.rank}</span>
                                        <span className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white">
                                            <img
                                                src={item.image}
                                                alt={item.alt}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-[#1c1512]">
                                                {item.name}
                                            </span>
                                            <span className="mt-0.5 block truncate text-xs text-[#1c1512]/55">
                                                {item.type}
                                            </span>
                                            <span className="mt-1.5 flex items-center gap-1.5">
                                                <Stars value={item.rating} />
                                                <span className="font-mono text-[10px] text-[#1c1512]/55">{item.rating}</span>
                                            </span>
                                        </span>
                                        <span className="font-serif text-lg text-[#1c1512]">${item.price}</span>
                                        <HiChevronRight
                                            className="h-4 w-4 shrink-0 text-[#1c1512]/40 transition-transform duration-200 group-hover:translate-x-0.5"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ol>
                        <div className="mt-6 flex flex-1 flex-col justify-end">
                            <a
                                href="#hum-bundle"
                                className="group/bundle relative overflow-hidden rounded-3xl bg-[#1c1512] p-5 text-[#f4e9dc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c65d3b]"
                            >
                                <span
                                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#c65d3b] transition-transform duration-500 group-hover/bundle:scale-110"
                                    aria-hidden="true"
                                />
                                <span className="relative block font-mono text-[10px] uppercase tracking-[0.25em] text-[#f4e9dc]/60">
                                    Bundle &amp; save $59
                                </span>
                                <span className="relative mt-2 block max-w-[14rem] font-serif text-xl leading-snug">
                                    Hum One ANC + Hum Daily for $399
                                </span>
                                <span className="relative mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#f4e9dc]/85">
                                    Build the bundle
                                    <HiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </span>
                            </a>
                        </div>
                        <a
                            href="#hum-best-sellers"
                            className="group/link mt-4 inline-flex min-h-12 items-center justify-between gap-3 rounded-full border border-[#1c1512] px-6 text-sm font-semibold text-[#1c1512] transition-colors duration-300 hover:bg-[#1c1512] hover:text-[#f4e9dc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c65d3b]"
                        >
                            Shop all best sellers
                            <HiArrowLongRight
                                className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                                aria-hidden="true"
                            />
                        </a>
                        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#1c1512]/50">
                            Free 2-day shipping · 45-night trial
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default SpotlightProductBestSellers

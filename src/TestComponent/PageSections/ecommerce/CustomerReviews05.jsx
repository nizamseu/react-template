// PostcardBoardCustomerReviews

// CustomerReviews05 · E-commerce & Marketplaces › Customer Reviews & UGC

// Description:
// A kraft-paper pinboard of reviews for the travel-gear brand Far & Wide Supply Co.,
// titled "Postcards from the road." Each review is a slightly rotated postcard pinned to
// the board: a perforated stamp in the corner carries the star rating, a postmark shows
// the city and date, the message is handwritten-style italic serif on ruled lines and the
// sender signs off with a portrait. Use it on a brand story page or below a best-seller.

// Design:
// - Header (stacked → md: title left, rating tag right) above a grid of postcards:
//   1 column → sm:grid-cols-2 → lg:grid-cols-3 with generous gap-10 for the tilt
// - Kraft #d9c4a3 board with a faint dot texture, cards in paper #fbf6ec, brown ink
//   #3b2a17 text, stamp colours #b5483a / #2f5d62 / #b8862a / #4b3f72, red/teal push pins
// - Message is font-serif italic text-lg on 2rem ruled lines (repeating gradient);
//   mono small caps for "POST CARD", the postmark and dates; stamps are 80×100 with a
//   radial-gradient perforated edge and drop-shadow
// - Cards rest at −2.5°…+2.5° (Tailwind rotate) and straighten, lift and deepen their
//   shadow on hover / focus-within; they drop in with a stagger on first view; transitions
//   are disabled for reduced motion (motion-reduce + no y offset)
// - section overflow-hidden keeps the tilted corners from causing horizontal scroll

// What it does:
// - No state; each card’s "Re:" product line links to #product-<slug> and the header CTA
//   "Send us a postcard" links to #write-review.
// - Stamp ratings render filled/empty stars with an sr-only "Rated n out of 5".
// - Entrance uses framer-motion whileInView (once); the tilt/straighten is pure CSS.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PostcardBoardCustomerReviews from '@/TestComponent/PageSections/ecommerce/CustomerReviews05';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <PostcardBoardCustomerReviews />
//     </main>
// )
// ```

'use client'

import { motion, useReducedMotion } from 'framer-motion';
import { PiArrowUpRightLight, PiPaperPlaneTiltLight, PiStarFill } from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const postcards = [
    {
        id: 'nadia',
        name: 'Nadia K.',
        city: 'Lisbon',
        country: 'Portugal',
        date: 'SEP 14 2026',
        rating: 5,
        product: 'Voyager 40L Carry-On',
        slug: 'voyager-40l-carry-on',
        message: 'Three weeks, four countries, one bag. The clamshell zip made repacking in tiny hostel rooms almost fun — and not a single seam gave up.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        stamp: 'bg-[#b5483a]',
        pin: 'bg-[#d7263d]',
        tilt: '-rotate-2',
    },
    {
        id: 'tom',
        name: 'Tom Achebe',
        city: 'Kyoto',
        country: 'Japan',
        date: 'AUG 30 2026',
        rating: 5,
        product: 'Merino Travel Hoodie',
        slug: 'merino-travel-hoodie',
        message: 'Wore it on a 14-hour flight and straight to dinner. Didn’t smell, didn’t wrinkle. I’ve basically stopped packing other layers.',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        stamp: 'bg-[#2f5d62]',
        pin: 'bg-[#2f5d62]',
        tilt: 'rotate-[1.5deg]',
    },
    {
        id: 'rosa',
        name: 'Rosa & Jen',
        city: 'Big Sur',
        country: 'California',
        date: 'AUG 18 2026',
        rating: 4,
        product: 'Trailhead 22L Daypack',
        slug: 'trailhead-22l-daypack',
        message: 'Comfortable on long coastal hikes, and the side pockets actually fit a 1L bottle. Only wish the hip belt were removable.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        stamp: 'bg-[#b8862a]',
        pin: 'bg-[#d7263d]',
        tilt: '-rotate-1',
    },
    {
        id: 'walter',
        name: 'Walter P.',
        city: 'Reykjavík',
        country: 'Iceland',
        date: 'JUL 29 2026',
        rating: 5,
        product: 'Stormline Rain Shell',
        slug: 'stormline-rain-shell',
        message: 'Sideways rain, 50 mph gusts, bone dry underneath. At 71 I don’t buy gear twice — this one’s a keeper.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        stamp: 'bg-[#4b3f72]',
        pin: 'bg-[#2f5d62]',
        tilt: 'rotate-[2.5deg]',
    },
    {
        id: 'imani',
        name: 'Imani Brooks',
        city: 'Marrakech',
        country: 'Morocco',
        date: 'JUL 07 2026',
        rating: 5,
        product: 'Packing Cube Trio',
        slug: 'packing-cube-trio',
        message: 'The compression cube swallowed a week of linen and still left room for a rug. Haggling skills sold separately.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        stamp: 'bg-[#b5483a]',
        pin: 'bg-[#d7263d]',
        tilt: '-rotate-[2.5deg]',
    },
    {
        id: 'leo',
        name: 'Leo Martins',
        city: 'Torres del Paine',
        country: 'Chile',
        date: 'JUN 21 2026',
        rating: 4,
        product: 'Voyager 40L Carry-On',
        slug: 'voyager-40l-carry-on',
        message: 'Took it on the full W trek as a base-camp bag. Tough as nails. A little heavy empty, but I’d still bring it again.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        stamp: 'bg-[#2f5d62]',
        pin: 'bg-[#2f5d62]',
        tilt: 'rotate-1',
    },
]

function Postmark({ city, date }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 150 72"
            className="pointer-events-none absolute top-11 right-14 z-20 h-[62px] w-[130px] -rotate-12 text-[#3b2a17] opacity-50 mix-blend-multiply"
        >
            <path
                d="M2 22 q 8 -6 16 0 t 16 0 t 16 0 M2 36 q 8 -6 16 0 t 16 0 t 16 0 M2 50 q 8 -6 16 0 t 16 0 t 16 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle cx="104" cy="36" r="31" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="104" cy="36" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
            <text
                x="104"
                y="33"
                textAnchor="middle"
                className="fill-current font-mono text-[8px] font-bold uppercase"
            >
                {city.length > 10 ? `${city.slice(0, 9)}.` : city}
            </text>
            <text x="104" y="45" textAnchor="middle" className="fill-current font-mono text-[7px]">
                {date}
            </text>
        </svg>
    )
}

export function PostcardBoardCustomerReviews({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#d9c4a3] px-4 py-16 text-[#3b2a17] antialiased sm:px-6 md:py-24 lg:px-10 text-base font-normal',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(90,62,26,0.14)_1px,transparent_1.5px)] bg-[length:14px_14px]"
            />

            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#3b2a17]/70">
                            Far &amp; Wide Supply Co. · Reviews
                        </p>
                        <h2 className="mt-4 font-serif text-4xl leading-[1.02] tracking-tight italic sm:text-5xl md:text-6xl text-[#3b2a17] font-normal">
                            Postcards from the road.
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-[#3b2a17]/75">
                            We ask every customer to write back from wherever our gear took
                            them. These are a few that made it onto the studio wall.
                        </p>
                    </div>

                    <div className="relative w-full max-w-[18rem] -rotate-1 self-start bg-[#fbf6ec] p-5 shadow-[0_14px_24px_-16px_rgba(59,42,23,0.6)] md:self-auto">
                        <span
                            aria-hidden="true"
                            className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 bg-[#f1e3bf]/80 shadow-sm"
                        />
                        <p className="flex items-baseline gap-2">
                            <span className="font-serif text-4xl">4.9</span>
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#3b2a17]/60">
                                out of 5
                            </span>
                        </p>
                        <p className="mt-1 text-sm text-[#3b2a17]/70">from 2,140 travellers in 63 countries</p>
                        <a
                            href="#write-review"
                            className="group mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#3b2a17] px-5 text-sm font-medium text-[#fbf6ec] transition-colors hover:bg-[#b5483a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b2a17]"
                        >
                            <PiPaperPlaneTiltLight aria-hidden="true" className="h-4 w-4" />
                            Send us a postcard
                        </a>
                    </div>
                </div>

                <ul className="mt-14 grid grid-cols-1 items-start gap-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-12">
                    {postcards.map((card, i) => (
                        <motion.li
                            key={card.id}
                            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <article
                                className={cn(
                                    'relative bg-[#fbf6ec] p-5 pt-6 shadow-[0_18px_30px_-18px_rgba(59,42,23,0.7),0_2px_4px_rgba(59,42,23,0.12)] transition-all duration-500 ease-out focus-within:-translate-y-1.5 focus-within:rotate-0 focus-within:shadow-[0_30px_50px_-22px_rgba(59,42,23,0.75),0_2px_4px_rgba(59,42,23,0.12)] hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_30px_50px_-22px_rgba(59,42,23,0.75),0_2px_4px_rgba(59,42,23,0.12)] motion-reduce:transition-none sm:p-6 sm:pt-7',
                                    card.tilt,
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'absolute -top-2 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full shadow-[0_3px_3px_rgba(0,0,0,0.35)]',
                                        card.pin,
                                    )}
                                >
                                    <span className="absolute top-1 left-1.5 h-1.5 w-1.5 rounded-full bg-white/60" />
                                </span>

                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 pt-1">
                                        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.35em]">
                                            Post card
                                        </p>
                                        <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[#3b2a17]/50">
                                            No. {String(i + 1).padStart(3, '0')}
                                        </p>
                                    </div>

                                    <div className="relative z-10 shrink-0 bg-[radial-gradient(circle,transparent_2.5px,#fffdf8_3px)] bg-[length:10px_10px] bg-[position:-5px_-5px] p-[5px] [filter:drop-shadow(0_1px_1.5px_rgba(59,42,23,0.35))]">
                                        <div
                                            className={cn(
                                                'flex h-[90px] w-[70px] flex-col items-center justify-between py-2 text-[#fffdf8]',
                                                card.stamp,
                                            )}
                                        >
                                            <span className="font-mono text-[7px] tracking-[0.2em] uppercase opacity-80">
                                                Far &amp; Wide
                                            </span>
                                            <span className="font-serif text-4xl leading-none italic">{card.rating}</span>
                                            <span className="flex gap-px" aria-hidden="true">
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <PiStarFill
                                                        key={n}
                                                        className={cn('h-2 w-2', n <= card.rating ? 'opacity-100' : 'opacity-30')}
                                                    />
                                                ))}
                                            </span>
                                            <span className="sr-only">Rated {card.rating} out of 5</span>
                                        </div>
                                    </div>
                                </div>

                                <Postmark city={card.city} date={card.date} />

                                <p className="relative mt-5 bg-[linear-gradient(transparent_calc(2rem-1px),rgba(59,42,23,0.16)_calc(2rem-1px))] bg-[length:100%_2rem] font-serif text-lg leading-8 text-[#3b2a17] italic">
                                    {card.message}
                                </p>

                                <a
                                    href={`#product-${card.slug}`}
                                    className="mt-4 inline-flex min-h-10 items-center gap-1 text-xs text-[#3b2a17]/70 underline decoration-[#3b2a17]/25 underline-offset-4 hover:text-[#3b2a17] hover:decoration-[#3b2a17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b2a17]"
                                >
                                    Re: {card.product}
                                    <PiArrowUpRightLight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                                </a>

                                <div className="mt-3 flex items-center gap-3 border-t border-dashed border-[#3b2a17]/30 pt-4">
                                    <img
                                        src={card.avatar}
                                        alt={`Portrait of ${card.name}`}
                                        loading="lazy"
                                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-[#fbf6ec] sepia-[.35]"
                                    />
                                    <div className="min-w-0">
                                        <p className="font-serif text-base italic">— {card.name}</p>
                                        <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-[#3b2a17]/60">
                                            {card.city}, {card.country} · {card.date}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default PostcardBoardCustomerReviews

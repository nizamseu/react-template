// SpotlightQuoteCustomerReviews

// CustomerReviews03 · E-commerce & Marketplaces › Customer Reviews & UGC

// Description:
// A stark, gallery-style testimonial for the design-objects shop Plain Matter. One huge
// serif quote fills the stage at a time (e.g. "It’s the first lamp I’ve owned that looks
// as considered switched off as it does switched on."), with the reviewer, the product
// they bought, its price and star rating underneath. A row of portrait buttons plus
// prev / next arrows switches between five reviewers. Use it as a home-page or PDP story.

// Design:
// - Single column max-w-6xl: top rule bar (label + "4.9 average · 3,106 reviews"), the
//   quote stage, a black rule, reviewer/product row, then avatars + counter + arrows
// - Pure black on white only: black text, 1px black rules, black stars, grayscale
//   portraits (the active one turns full colour with a 2px black ring offset by 4px)
// - Quote font-serif text-[1.85rem] → sm:text-5xl → md:text-6xl → lg:text-[4.25rem],
//   leading-[1.08], tracking -0.02em; mono 11px labels and a 02 / 05 counter
// - Words rise out of clipped line masks with a 30ms stagger (AnimatePresence
//   mode="wait"); the old quote fades up and out; reduced motion uses a plain fade
// - All five quotes are rendered invisibly in the same grid cell so the stage keeps the
//   tallest height and nothing jumps; avatars h-12 → sm:h-16, arrows 44px

// What it does:
// - index (state) selects the reviewer; avatar tabs (role="tab", aria-selected, roving
//   tabIndex) set it on click, ArrowLeft/Right/Home/End move between tabs, and the
//   prev/next buttons wrap around.
// - The quote block is the tabpanel labelled by the active tab; product names link to
//   #product-<slug> and "Read all reviews" to #reviews.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SpotlightQuoteCustomerReviews from '@/TestComponent/PageSections/ecommerce/CustomerReviews03';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <SpotlightQuoteCustomerReviews />
//     </main>
// )
// ```

'use client'

import { Fragment, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiStar } from 'react-icons/hi2';
import { LuArrowLeft, LuArrowRight, LuArrowUpRight } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const reviewers = [
    {
        id: 'clara',
        name: 'Clara Whitfield',
        role: 'Architect, Copenhagen',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        product: 'Arc Oak Desk Lamp',
        slug: 'arc-oak-desk-lamp',
        price: '$240',
        rating: 5,
        date: 'March 2026',
        quote: 'It’s the first lamp I’ve owned that looks as considered switched off as it does switched on.',
    },
    {
        id: 'henrik',
        name: 'Henrik Salo',
        role: 'Retired luthier, Helsinki',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        product: 'Walnut Pour-Over Stand',
        slug: 'walnut-pour-over-stand',
        price: '$118',
        rating: 5,
        date: 'May 2026',
        quote: 'The joinery is honest. You can feel that someone cared about the parts nobody will ever look at.',
    },
    {
        id: 'maeve',
        name: 'Maeve Doyle',
        role: 'Illustrator, Dublin',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
        product: 'Felted Wool Desk Pad',
        slug: 'felted-wool-desk-pad',
        price: '$64',
        rating: 5,
        date: 'June 2026',
        quote: 'My desk finally feels like a place I want to sit down at, not a place I have to.',
    },
    {
        id: 'julian',
        name: 'Julian Park',
        role: 'Product designer, Seoul',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        product: 'Solid Brass Pen Tray',
        slug: 'solid-brass-pen-tray',
        price: '$72',
        rating: 4,
        date: 'July 2026',
        quote: 'Heavy, quiet, perfectly weighted. I set my pen down in it forty times a day and it still makes me smile.',
    },
    {
        id: 'amara',
        name: 'Amara Osei',
        role: 'Head chef, Toronto',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        product: 'Stoneware Utensil Crock',
        slug: 'stoneware-utensil-crock',
        price: '$56',
        rating: 5,
        date: 'August 2026',
        quote: 'Six months of daily abuse in a busy kitchen and it still looks like the day it arrived.',
    },
]

const quoteClass =
    'font-serif text-[1.85rem] leading-[1.08] tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-[4.25rem]'

const pad = (n) => String(n).padStart(2, '0')

function QuoteWords({ text, animated, reduce }) {
    const words = `“${text}”`.split(' ')

    return words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-top">
                {animated ? (
                    <motion.span
                        className="inline-block"
                        variants={{
                            hidden: reduce ? { opacity: 0 } : { y: '105%' },
                            show: reduce
                                ? { opacity: 1, transition: { duration: 0.3 } }
                                : { y: '0%', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                        }}
                    >
                        {word}
                    </motion.span>
                ) : (
                    word
                )}
            </span>
            {i < words.length - 1 ? ' ' : null}
        </Fragment>
    ))
}

export function SpotlightQuoteCustomerReviews({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [index, setIndex] = useState(0)
    const reduce = useReducedMotion()
    const uid = useId()
    const tabRefs = useRef([])
    const active = reviewers[index]
    const count = reviewers.length

    const go = (next, focus = false) => {
        const wrapped = (next + count) % count
        setIndex(wrapped)
        if (focus) tabRefs.current[wrapped]?.focus()
    }

    const onTabKeyDown = (event) => {
        const keys = {
            ArrowRight: index + 1,
            ArrowDown: index + 1,
            ArrowLeft: index - 1,
            ArrowUp: index - 1,
            Home: 0,
            End: count - 1,
        }
        if (event.key in keys) {
            event.preventDefault()
            go(keys[event.key], true)
        }
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('bg-white px-4 py-16 text-black antialiased sm:px-6 md:py-24 lg:px-10 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-black pb-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em]">Plain Matter — In their words</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/60">
                        4.9 average · 3,106 reviews
                    </p>
                </div>

                <div
                    id={`${uid}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${uid}-tab-${active.id}`}
                    className="mt-12 md:mt-16"
                >
                    <div className="grid">
                        {reviewers.map((r) => (
                            <p
                                key={r.id}
                                aria-hidden="true"
                                className={cn('invisible col-start-1 row-start-1', quoteClass)}
                            >
                                <QuoteWords text={r.quote} animated={false} reduce={reduce} />
                            </p>
                        ))}
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.figure
                                key={active.id}
                                className="col-start-1 row-start-1"
                                initial="hidden"
                                animate="show"
                                exit={{
                                    opacity: 0,
                                    y: reduce ? 0 : -14,
                                    transition: { duration: 0.25, ease: 'easeIn' },
                                }}
                                variants={{
                                    hidden: {},
                                    show: { transition: { staggerChildren: reduce ? 0 : 0.03 } },
                                }}
                            >
                                <blockquote>
                                    <p className={quoteClass}>
                                        <QuoteWords animated text={active.quote} reduce={reduce} />
                                    </p>
                                </blockquote>
                            </motion.figure>
                        </AnimatePresence>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.4, delay: reduce ? 0 : 0.25 } }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            className="mt-10 grid gap-6 border-t border-black pt-6 md:grid-cols-2 md:items-start"
                        >
                            <div>
                                <p className="text-lg font-semibold tracking-tight">{active.name}</p>
                                <p className="mt-0.5 text-sm text-black/60">
                                    {active.role} · Verified purchase, {active.date}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:justify-end">
                                <a
                                    href={`#product-${active.slug}`}
                                    className="group inline-flex min-h-10 items-center gap-1.5 text-base font-medium underline decoration-black/25 underline-offset-[6px] transition-colors hover:decoration-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                                >
                                    {active.product}
                                    <span className="text-black/50">{active.price}</span>
                                    <LuArrowUpRight
                                        aria-hidden="true"
                                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </a>
                                <span className="flex items-center gap-2">
                                    <span className="flex gap-0.5" aria-hidden="true">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <HiStar
                                                key={n}
                                                className={cn('h-4 w-4', n <= active.rating ? 'text-black' : 'text-black/15')}
                                            />
                                        ))}
                                    </span>
                                    <span className="font-mono text-xs">
                                        {active.rating}.0<span className="sr-only"> out of 5 stars</span>
                                    </span>
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between md:mt-16">
                    <div
                        role="tablist"
                        aria-label="Choose a reviewer"
                        className="flex items-center gap-2.5 sm:gap-4"
                        onKeyDown={onTabKeyDown}
                    >
                        {reviewers.map((r, i) => {
                            const selected = i === index

                            return (
                                <button
                                    key={r.id}
                                    ref={(el) => {
                                        tabRefs.current[i] = el
                                    }}
                                    id={`${uid}-tab-${r.id}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls={`${uid}-panel`}
                                    aria-label={`${r.name}, ${r.role}`}
                                    tabIndex={selected ? 0 : -1}
                                    className={cn(
                                        'relative h-12 w-12 shrink-0 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-black sm:h-16 sm:w-16',
                                        selected
                                            ? 'ring-2 ring-black ring-offset-4 ring-offset-white'
                                            : 'opacity-45 hover:opacity-100',
                                    )}
                                    onClick={() => go(i)}
                                >
                                    <img
                                        src={r.avatar}
                                        alt={`Portrait of ${r.name}`}
                                        loading="lazy"
                                        className={cn(
                                            'h-full w-full object-cover transition-[filter] duration-500',
                                            selected ? 'grayscale-0' : 'grayscale',
                                        )}
                                    />
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <p className="font-mono text-sm tabular-nums" aria-live="polite">
                            {pad(index + 1)} <span className="text-black/35">/ {pad(count)}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="Previous review"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                onClick={() => go(index - 1)}
                            >
                                <LuArrowLeft aria-hidden="true" className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next review"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-black bg-black text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                onClick={() => go(index + 1)}
                            >
                                <LuArrowRight aria-hidden="true" className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <a
                    href="#reviews"
                    className="mt-10 inline-flex min-h-10 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] underline decoration-black/25 underline-offset-4 hover:decoration-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                    Read all reviews
                </a>
            </div>
        </section>
    )
}

export default SpotlightQuoteCustomerReviews

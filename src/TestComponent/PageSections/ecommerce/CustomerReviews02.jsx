// RatingHistogramCustomerReviews

// CustomerReviews02 · E-commerce & Marketplaces › Customer Reviews & UGC

// Description:
// A full product-review block for Loomwell’s "Stonewashed Linen Duvet Set". A summary
// panel shows the big "4.8 / 5" average from 1,284 reviews, a clickable 5→1 star histogram,
// "96% would recommend" and fit/feel meters; the list shows reviews with avatars, verified
// badges, variant chips and a "Helpful (n)" toggle. Clicking a bar filters the list and a
// "Clear filter" button resets it. Use it under a product detail page.

// Design:
// - Stacked on mobile → lg:grid-cols-[380px_1fr] two columns; the summary panel is sticky
//   on lg (top-8) while the review list scrolls
// - Neutral white background, zinc-900 text, zinc-100/200 surfaces and rules, amber-400
//   (#fbbf24) stars and histogram fills; the active bar row gets a zinc-900 ring
// - Average in text-7xl font-semibold tracking-tighter with a partially filled star row;
//   review titles font-semibold, bodies text-sm/relaxed; rounded-2xl panel, rounded-full
//   chips; verified badge is an emerald check with "Verified buyer"
// - Histogram bars grow from 0 on first view; the list re-flows with AnimatePresence +
//   layout (popLayout) when filtering; no movement for reduced motion
// - Bars are full-width buttons (min-h-10) so they stay touch-friendly at 360px

// What it does:
// - filter (state, null | 1–5) is set by the histogram buttons (aria-pressed; clicking the
//   active bar or "Clear filter" resets it); the list and the aria-live status line
//   ("Showing 2 of 9 reviews · 4 stars") update.
// - helpful (state map) toggles per review; the button shows "Helpful (n)" with n + 1
//   while pressed (aria-pressed).
// - Links: "Write a review" → #write-review, "See all 1,284 reviews" → #all-reviews.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RatingHistogramCustomerReviews from '@/TestComponent/PageSections/ecommerce/CustomerReviews02';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <RatingHistogramCustomerReviews />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheckBadge, HiStar } from 'react-icons/hi2';
import { LuPencilLine, LuThumbsUp, LuX } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const distribution = [
    { stars: 5, count: 1098 },
    { stars: 4, count: 132 },
    { stars: 3, count: 31 },
    { stars: 2, count: 12 },
    { stars: 1, count: 11 },
]

const TOTAL = 1284
const AVERAGE = 4.8

const meters = [
    { label: 'Softness', value: 4.9 },
    { label: 'True to size', value: 4.4 },
    { label: 'Colour accuracy', value: 4.6 },
]

const reviews = [
    {
        id: 'r1',
        rating: 5,
        title: 'Softer after every single wash',
        body: 'I was nervous linen would feel scratchy, but this was soft out of the box and has only improved after six washes. The sage is a gentle, muted green — exactly like the photos.',
        name: 'Hannah R.',
        place: 'Portland, OR',
        date: 'Aug 28, 2026',
        verified: true,
        helpful: 42,
        variant: ['Queen', 'Sage'],
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'r2',
        rating: 5,
        title: 'Finally, a duvet cover that stays put',
        body: 'The corner ties actually keep the insert from bunching and the hidden button closure feels sturdy. Stitching is tight and even. Worth every penny.',
        name: 'Marcus T.',
        place: 'Austin, TX',
        date: 'Aug 19, 2026',
        verified: true,
        helpful: 31,
        variant: ['King', 'Oat'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'r3',
        rating: 4,
        title: 'Beautiful, runs slightly large',
        body: 'Gorgeous colour and weight. The cover is about two inches longer than my insert, so it drapes rather than fits snugly. I don’t mind, but size down if you like it tight.',
        name: 'Priya S.',
        place: 'Chicago, IL',
        date: 'Aug 11, 2026',
        verified: true,
        helpful: 18,
        variant: ['Full/Queen', 'Terracotta'],
        avatar: null,
    },
    {
        id: 'r4',
        rating: 5,
        title: 'Hotel bed, at home',
        body: 'Heavy enough to feel luxurious, breathable enough for Denver summers. We ordered the matching pillowcases a week later.',
        name: 'Daniel K.',
        place: 'Denver, CO',
        date: 'Jul 30, 2026',
        verified: true,
        helpful: 27,
        variant: ['King', 'White'],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'r5',
        rating: 3,
        title: 'Lovely fabric, wrinkles a lot',
        body: 'The quality is there, but if you want a crisp look this isn’t it — it’s very lived-in and rumpled. The pillowcases also shrank a little in the dryer.',
        name: 'Emma L.',
        place: 'Boston, MA',
        date: 'Jul 22, 2026',
        verified: true,
        helpful: 9,
        variant: ['Queen', 'Oat'],
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'r6',
        rating: 4,
        title: 'Great set, slow to ship',
        body: 'Took eight days to arrive, which felt long. Once it did, no complaints — it’s the coolest bedding I’ve slept in.',
        name: 'Jordan P.',
        place: 'Nashville, TN',
        date: 'Jul 14, 2026',
        verified: true,
        helpful: 6,
        variant: ['Twin', 'Sage'],
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'r7',
        rating: 2,
        title: 'Colour didn’t match my screen',
        body: 'Much more orange than the rust I expected. Customer care offered a free swap to Clay, which was kind, but I wish the photos were more accurate.',
        name: 'Aisha M.',
        place: 'Atlanta, GA',
        date: 'Jul 3, 2026',
        verified: true,
        helpful: 4,
        variant: ['Queen', 'Terracotta'],
        avatar: null,
    },
    {
        id: 'r8',
        rating: 1,
        title: 'Button came off on the second wash',
        body: 'One of the closure buttons came loose almost immediately. The replacement arrived fast, but I’m hesitant to recommend it for now.',
        name: 'Greg W.',
        place: 'Phoenix, AZ',
        date: 'Jun 21, 2026',
        verified: false,
        helpful: 3,
        variant: ['King', 'White'],
        avatar: null,
    },
    {
        id: 'r9',
        rating: 5,
        title: 'Bought a second set for the guest room',
        body: 'Clay is the prettiest warm neutral. Guests keep asking where it’s from, so I’m officially your unpaid ambassador.',
        name: 'Sofia G.',
        place: 'San Diego, CA',
        date: 'Jun 9, 2026',
        verified: true,
        helpful: 15,
        variant: ['Queen', 'Clay'],
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
]

function Stars({ rating, className }) {
    return (
        <span className={cn('flex items-center gap-0.5', className)} aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
                <HiStar key={n} className={cn('h-4 w-4', n <= rating ? 'text-amber-400' : 'text-zinc-200')} />
            ))}
        </span>
    )
}

export function RatingHistogramCustomerReviews({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [filter, setFilter] = useState(null)
    const [helpful, setHelpful] = useState({})
    const reduce = useReducedMotion()

    const shown = filter ? reviews.filter((r) => r.rating === filter) : reviews
    const toggleHelpful = (id) => setHelpful((prev) => ({ ...prev, [id]: !prev[id] }))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('bg-white px-4 py-16 text-zinc-900 antialiased sm:px-6 md:py-24 lg:px-10 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-4 border-b border-zinc-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Loomwell · Stonewashed Linen Duvet Set
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-zinc-900">
                            What sleepers are saying
                        </h2>
                    </div>
                    <a
                        href="#write-review"
                        className="inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:self-auto"
                    >
                        <LuPencilLine aria-hidden="true" className="h-4 w-4" />
                        Write a review
                    </a>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-14">
                    <aside className="lg:sticky lg:top-8 lg:self-start">
                        <div className="rounded-2xl bg-zinc-50 p-6 ring-1 ring-zinc-200 sm:p-8">
                            <div className="flex items-end gap-3">
                                <p className="text-7xl leading-none font-semibold tracking-tighter">
                                    {AVERAGE.toFixed(1)}
                                </p>
                                <p className="pb-2 text-lg text-zinc-400">/ 5</p>
                            </div>
                            <div
                                role="img"
                                aria-label={`Average rating ${AVERAGE} out of 5`}
                                className="relative mt-4 inline-flex"
                            >
                                <span className="flex gap-0.5 text-zinc-200">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <HiStar key={n} aria-hidden="true" className="h-6 w-6" />
                                    ))}
                                </span>
                                <span
                                    className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-amber-400"
                                    style={{ width: `${(AVERAGE / 5) * 100}%` }}
                                >
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <HiStar key={n} aria-hidden="true" className="h-6 w-6 shrink-0" />
                                    ))}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-zinc-500">
                                Based on {TOTAL.toLocaleString('en-US')} reviews
                            </p>

                            <ul className="mt-6 space-y-1" aria-label="Filter reviews by star rating">
                                {distribution.map((row) => {
                                    const pct = (row.count / TOTAL) * 100
                                    const isActive = filter === row.stars
                                    const dimmed = filter !== null && !isActive

                                    return (
                                        <li key={row.stars}>
                                            <button
                                                type="button"
                                                aria-pressed={isActive}
                                                aria-label={`Show ${row.stars}-star reviews (${row.count.toLocaleString('en-US')})`}
                                                className={cn(
                                                    'grid min-h-10 w-full grid-cols-[2.75rem_1fr_3.25rem] items-center gap-3 rounded-lg px-2 text-sm transition-all duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-zinc-900',
                                                    isActive && 'bg-white ring-2 ring-zinc-900',
                                                    dimmed && 'opacity-45 hover:opacity-100',
                                                )}
                                                onClick={() => setFilter(isActive ? null : row.stars)}
                                            >
                                                <span className="flex items-center gap-1 font-medium tabular-nums">
                                                    {row.stars}
                                                    <HiStar aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
                                                </span>
                                                <span className="relative h-2.5 overflow-hidden rounded-full bg-zinc-200">
                                                    <motion.span
                                                        className="absolute inset-y-0 left-0 rounded-full bg-amber-400"
                                                        initial={{ width: reduce ? `${pct}%` : '0%' }}
                                                        whileInView={{ width: `${pct}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{
                                                            duration: reduce ? 0 : 0.9,
                                                            delay: (5 - row.stars) * 0.08,
                                                            ease: [0.22, 1, 0.36, 1],
                                                        }}
                                                    />
                                                </span>
                                                <span className="text-right text-zinc-500 tabular-nums">
                                                    {row.count.toLocaleString('en-US')}
                                                </span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>

                            <p className="mt-6 flex items-center gap-2 border-t border-zinc-200 pt-6 text-sm">
                                <span className="font-semibold">96%</span>
                                <span className="text-zinc-500">of reviewers would recommend this set</span>
                            </p>

                            <dl className="mt-5 space-y-3">
                                {meters.map((m) => (
                                    <div key={m.label}>
                                        <div className="flex justify-between text-xs">
                                            <dt className="text-zinc-500">{m.label}</dt>
                                            <dd className="font-semibold tabular-nums">{m.value.toFixed(1)}</dd>
                                        </div>
                                        <div aria-hidden="true" className="mt-1.5 grid grid-cols-5 gap-1">
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <span
                                                    key={n}
                                                    className={cn(
                                                        'h-1 rounded-full',
                                                        n <= Math.round(m.value) ? 'bg-zinc-900' : 'bg-zinc-200',
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </aside>

                    <div>
                        <div className="flex min-h-10 flex-wrap items-center justify-between gap-3">
                            <p aria-live="polite" className="text-sm text-zinc-500">
                                Showing{' '}
                                <span className="font-semibold text-zinc-900">
                                    {filter ? `${shown.length} of ${reviews.length}` : reviews.length}
                                </span>{' '}
                                reviews{filter ? ` · ${filter} star${filter > 1 ? 's' : ''}` : ''}
                            </p>
                            {filter && (
                                <button
                                    type="button"
                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-zinc-300 px-4 text-sm font-medium transition-colors hover:border-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                                    onClick={() => setFilter(null)}
                                >
                                    <LuX aria-hidden="true" className="h-3.5 w-3.5" />
                                    Clear filter
                                </button>
                            )}
                        </div>

                        <ul className="mt-2">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {shown.map((review) => {
                                    const pressed = Boolean(helpful[review.id])

                                    return (
                                        <motion.li
                                            key={review.id}
                                            layout={!reduce}
                                            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            className="border-b border-zinc-200 py-7 last:border-b-0"
                                        >
                                            <article>
                                                <header className="flex items-start gap-3">
                                                    {review.avatar ? (
                                                        <img
                                                            src={review.avatar}
                                                            alt={`Portrait of ${review.name}`}
                                                            loading="lazy"
                                                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span
                                                            aria-hidden="true"
                                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600"
                                                        >
                                                            {review.name.charAt(0)}
                                                        </span>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                            <span className="font-semibold">{review.name}</span>
                                                            {review.verified && (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                                                    <HiCheckBadge aria-hidden="true" className="h-3.5 w-3.5" />
                                                                    Verified buyer
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-zinc-500">
                                                            {review.place} · {review.date}
                                                        </p>
                                                    </div>
                                                </header>

                                                <div className="mt-4 flex items-center gap-2">
                                                    <Stars rating={review.rating} />
                                                    <span className="sr-only">{review.rating} out of 5 stars</span>
                                                </div>
                                                <h3 className="mt-2 font-semibold text-zinc-900 text-base">{review.title}</h3>
                                                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{review.body}</p>

                                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                    <p className="flex flex-wrap gap-1.5 text-[11px] font-medium text-zinc-600">
                                                        <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                                                            Size: {review.variant[0]}
                                                        </span>
                                                        <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                                                            Colour: {review.variant[1]}
                                                        </span>
                                                    </p>
                                                    <button
                                                        type="button"
                                                        aria-pressed={pressed}
                                                        className={cn(
                                                            'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900',
                                                            pressed
                                                                ? 'border-zinc-900 bg-zinc-900 text-white'
                                                                : 'border-zinc-300 text-zinc-700 hover:border-zinc-900',
                                                        )}
                                                        onClick={() => toggleHelpful(review.id)}
                                                    >
                                                        <LuThumbsUp aria-hidden="true" className="h-3.5 w-3.5" />
                                                        Helpful ({review.helpful + (pressed ? 1 : 0)})
                                                    </button>
                                                </div>
                                            </article>
                                        </motion.li>
                                    )
                                })}
                            </AnimatePresence>
                        </ul>

                        <a
                            href="#all-reviews"
                            className="mt-6 flex min-h-12 items-center justify-center rounded-xl border border-zinc-300 text-sm font-semibold transition-colors hover:border-zinc-900 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                        >
                            See all {TOTAL.toLocaleString('en-US')} reviews
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RatingHistogramCustomerReviews

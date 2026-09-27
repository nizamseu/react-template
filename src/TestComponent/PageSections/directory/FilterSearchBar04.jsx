// StickyQuickFiltersSearchBar

// FilterSearchBar04 · Directories & Search Aggregators › Multi-Filter Search Bar

// Description:
// A review-led search panel for Yardstick Reviews. Beside the heading "Measured by 48,210
// honest reviews." sits a tall results panel whose search field and scrollable quick-filter
// chips (Open now, Top rated, ৳৳, Delivery, Wheelchair access, Outdoor seating, Takes
// reservations) stay pinned while the review list scrolls underneath. Use it for a reviews
// site, a food-delivery directory or any "best of" list that needs fast one-tap filters.

// Design:
// - White section, ink #0b1f17 text, emerald #059669 accents; left column has an eyebrow,
//   heavy sans heading (text-4xl → lg:text-6xl), a score legend and a 4:5 (5:4 on tablet)
//   photo with a floating "Review of the week" card
// - Right column: rounded-[28px] panel, fixed height (34rem → lg:44rem) with its own scroll;
//   the sticky header (search + chip rail) gains a shadow and hairline once scrolled
// - Each row shows a yardstick ruler: 50 ticks with the score filled in emerald, a big
//   tabular score, price level, amenity icons and a one-line quoted review
// - Chips are pill toggles (emerald fill when on) with live "what-if" counts; the rail
//   scrolls sideways (snap, hidden scrollbar, right-edge fade); rows animate with motion
// - Responsive: columns stack below lg (intro, then the panel); the photo card hides below
//   sm; chips always scroll sideways; the ruler shrinks to fit and amenity tags wrap

// What it does:
// - query and an array of active chip ids are controlled state; 20 businesses filter by
//   name/cuisine/area and every active chip (AND), live; sorted by score, then reviews
// - Each chip shows how many results it would leave if toggled; aria-pressed reflects state
// - The panel's onScroll toggles the pinned header's shadow; the count line is aria-live
// - Empty state offers "Clear filters" and removal of the most recent chip; names link to
//   #yardstick-<id>, "Write a review" to #yardstick-write

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StickyQuickFiltersSearchBar from '@/TestComponent/PageSections/directory/FilterSearchBar04';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <StickyQuickFiltersSearchBar />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiOutlineMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { LuAccessibility, LuBike, LuCalendarCheck, LuSun } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const quickFilters = [
    { id: 'open', label: 'Open now', test: (b) => b.open },
    { id: 'top', label: 'Top rated', test: (b) => b.score >= 4.5 },
    { id: 'mid', label: '৳৳', test: (b) => b.price === 2 },
    { id: 'delivery', label: 'Delivery', test: (b) => b.delivery },
    { id: 'wheelchair', label: 'Wheelchair access', test: (b) => b.wheelchair },
    { id: 'outdoor', label: 'Outdoor seating', test: (b) => b.outdoor },
    { id: 'reserve', label: 'Takes reservations', test: (b) => b.reserve },
]

const businesses = [
    { id: 'kacchi-kotha', name: 'Kacchi Kotha', cuisine: 'Biryani', area: 'Old Dhaka', score: 4.8, reviews: 5120, price: 2, open: true, delivery: true, wheelchair: false, outdoor: false, reserve: false, quote: 'The mutton falls off the bone — go before 9 pm or it sells out.', by: 'Tahsin R.' },
    { id: 'green-ladle', name: 'Green Ladle Kitchen', cuisine: 'Vegan bowls', area: 'Gulshan 1', score: 4.8, reviews: 611, price: 2, open: true, delivery: true, wheelchair: true, outdoor: false, reserve: true, quote: 'Jackfruit tacos that converted my meat-loving dad.', by: 'Nabila K.' },
    { id: 'ember-room', name: 'Ember Room', cuisine: 'Modern Bengali', area: 'Gulshan 2', score: 4.9, reviews: 418, price: 4, open: false, delivery: false, wheelchair: true, outdoor: false, reserve: true, quote: 'Nine courses, and the hilsa smoked at the table stole the night.', by: 'Farhan A.' },
    { id: 'tin-roof', name: 'Tin Roof Coffee', cuisine: 'Café', area: 'Banani', score: 4.6, reviews: 1622, price: 2, open: true, delivery: true, wheelchair: true, outdoor: true, reserve: false, quote: 'Reliable Wi-Fi, plug points at every table, great cold brew.', by: 'Maisha T.' },
    { id: 'smash-club', name: 'Smash Club Burgers', cuisine: 'Burgers', area: 'Banani', score: 4.7, reviews: 1284, price: 2, open: true, delivery: true, wheelchair: false, outdoor: true, reserve: false, quote: 'Crispy-edged double smash, and the fries are properly salted.', by: 'Rafid H.' },
    { id: 'forno-lane', name: 'Forno Lane Pizzeria', cuisine: 'Pizza', area: 'Gulshan 2', score: 4.6, reviews: 932, price: 3, open: true, delivery: true, wheelchair: true, outdoor: false, reserve: true, quote: 'Leopard-spotted crust, real buffalo mozzarella.', by: 'Samira I.' },
    { id: 'bhorta-bari', name: 'Bhorta Bari', cuisine: 'Home-style Bengali', area: 'Mohammadpur', score: 4.6, reviews: 1874, price: 1, open: true, delivery: false, wheelchair: false, outdoor: false, reserve: false, quote: 'Twenty-two bhortas and they refill the rice without asking.', by: 'Imran S.' },
    { id: 'tokyo-alley', name: 'Tokyo Alley Ramen', cuisine: 'Ramen', area: 'Banani', score: 4.5, reviews: 1403, price: 3, open: true, delivery: true, wheelchair: false, outdoor: false, reserve: true, quote: 'Rich tonkotsu broth — ask for the chilli oil on the side.', by: 'Adiba N.' },
    { id: 'lakeview', name: 'Lakeview Terrace', cuisine: 'Grill & seafood', area: 'Gulshan 2', score: 4.4, reviews: 1050, price: 3, open: true, delivery: false, wheelchair: true, outdoor: true, reserve: true, quote: 'Book a lakeside table at sunset; the prawns are huge.', by: 'Zarif M.' },
    { id: 'cha-cartel', name: 'Cha Cartel', cuisine: 'Tea stall', area: 'Dhanmondi', score: 4.7, reviews: 2210, price: 1, open: true, delivery: false, wheelchair: true, outdoor: true, reserve: false, quote: 'Clay-cup malai cha and hot singara on the lake road.', by: 'Priya D.' },
    { id: 'brick-oven', name: 'Brick Oven Bakehouse', cuisine: 'Bakery', area: 'Dhanmondi', score: 4.7, reviews: 803, price: 1, open: true, delivery: true, wheelchair: true, outdoor: false, reserve: false, quote: 'The sourdough sells out by noon on Fridays.', by: 'Omar F.' },
    { id: 'skyline-27', name: 'Skyline 27', cuisine: 'Rooftop lounge', area: 'Gulshan 2', score: 4.3, reviews: 1310, price: 4, open: false, delivery: false, wheelchair: true, outdoor: true, reserve: true, quote: 'Pricey mocktails but that view over the lake is unreal.', by: 'Tanjim B.' },
    { id: 'dim-sum-den', name: 'Dim Sum Den', cuisine: 'Cantonese', area: 'Uttara', score: 4.4, reviews: 764, price: 2, open: true, delivery: true, wheelchair: true, outdoor: false, reserve: true, quote: 'Har gow with properly thin wrappers. Weekend brunch is busy.', by: 'Ishrat J.' },
    { id: 'pita-pan', name: 'Pita Pan', cuisine: 'Lebanese', area: 'Banani', score: 4.2, reviews: 540, price: 2, open: true, delivery: true, wheelchair: false, outdoor: true, reserve: false, quote: 'Chicken shawarma plate is generous and under Tk 600.', by: 'Kabir L.' },
    { id: 'hilsa-house', name: 'Hilsa House', cuisine: 'Riverfish specialists', area: 'Mirpur', score: 4.5, reviews: 689, price: 2, open: false, delivery: true, wheelchair: false, outdoor: false, reserve: true, quote: 'Shorshe ilish exactly like my nani makes it.', by: 'Nusrat P.' },
    { id: 'crumb-co', name: 'Crumb & Co.', cuisine: 'Cakes & desserts', area: 'Bashundhara', score: 4.4, reviews: 522, price: 2, open: true, delivery: true, wheelchair: true, outdoor: false, reserve: false, quote: 'The mishti doi cheesecake is a must.', by: 'Rumana C.' },
    { id: 'night-owl', name: 'Night Owl Espresso', cuisine: 'Late-night café', area: 'Banani', score: 4.1, reviews: 318, price: 2, open: false, delivery: false, wheelchair: false, outdoor: true, reserve: false, quote: 'Only place pulling decent espresso at 2 am.', by: 'Sadman O.' },
    { id: 'saffron-salt', name: 'Saffron & Salt', cuisine: 'Mughlai', area: 'Dhanmondi', score: 4.3, reviews: 977, price: 3, open: true, delivery: true, wheelchair: true, outdoor: false, reserve: true, quote: 'Rezala and naan for four came to Tk 3,200. Worth it.', by: 'Fahim Z.' },
    { id: 'seoul-bowl', name: 'Seoul Bowl', cuisine: 'Korean', area: 'Bashundhara', score: 3.9, reviews: 402, price: 2, open: true, delivery: true, wheelchair: true, outdoor: false, reserve: false, quote: 'Solid bibimbap; kimchi could be funkier.', by: 'Lamia R.' },
    { id: 'terrace-nine', name: 'Terrace Nine', cuisine: 'Rooftop grill', area: 'Banani', score: 4.2, reviews: 870, price: 3, open: true, delivery: false, wheelchair: false, outdoor: true, reserve: true, quote: 'Live acoustic on Thursdays, grilled chicken is spot on.', by: 'Arif U.' },
]

const TOTAL_REVIEWS = 48210

const filterBusinesses = (query, ids) => {
    const q = query.trim().toLowerCase()
    const tests = quickFilters.filter((f) => ids.includes(f.id)).map((f) => f.test)
    return businesses.filter(
        (b) => (!q || `${b.name} ${b.cuisine} ${b.area}`.toLowerCase().includes(q)) && tests.every((t) => t(b)),
    )
}

function Yardstick({ score }) {
    const filled = Math.round(score * 10)
    return (
        <div className="flex h-4 w-full max-w-[12.5rem] items-end justify-between" aria-hidden="true">
            {Array.from({ length: 50 }, (_, i) => (
                <span
                    key={i}
                    className={cn(
                        'w-[2px] shrink-0 rounded-full',
                        i % 10 === 9 ? 'h-4' : i % 5 === 4 ? 'h-3' : 'h-2',
                        i < filled ? 'bg-[#059669]' : 'bg-[#0b1f17]/15',
                    )}
                />
            ))}
        </div>
    )
}

export function StickyQuickFiltersSearchBar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [query, setQuery] = useState('')
    const [active, setActive] = useState(['open'])
    const [scrolled, setScrolled] = useState(false)

    const results = useMemo(
        () => filterBusinesses(query, active).sort((a, b) => b.score - a.score || b.reviews - a.reviews),
        [query, active],
    )

    const toggle = (id) => setActive((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
    const lastChip = quickFilters.find((f) => f.id === active[active.length - 1])

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0b1f17] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#ecfdf5] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#047857]">
                        <span className="grid h-4 w-4 place-items-center rounded-sm bg-[#059669] text-[9px] text-white" aria-hidden="true">
                            Y
                        </span>
                        Yardstick Reviews
                    </p>
                    <h2 className="mt-6 text-4xl font-black leading-[1] tracking-[-0.035em] text-[#0b1f17] sm:text-5xl lg:text-6xl">
                        Measured by {TOTAL_REVIEWS.toLocaleString('en-US')}{' '}
                        <span className="text-[#059669]">honest</span> reviews.
                    </h2>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-[#0b1f17]/70">
                        Every score is a weighted average of verified visits in the last 18 months —
                        no paid placements, no deleted one-stars.
                    </p>

                    <dl className="mt-8 grid max-w-md grid-cols-3 gap-3 text-sm">
                        {[
                            ['4.5+', 'Top rated'],
                            ['4.0+', 'Solid pick'],
                            ['< 4.0', 'Mixed'],
                        ].map(([v, l], i) => (
                            <div key={l} className="rounded-2xl border border-[#0b1f17]/10 p-3">
                                <dt className="text-xs text-[#0b1f17]/60">{l}</dt>
                                <dd className={cn('mt-1 text-xl font-black tabular-nums', i === 0 ? 'text-[#059669]' : 'text-[#0b1f17]')}>{v}</dd>
                            </div>
                        ))}
                    </dl>

                    <figure className="relative mt-10 hidden max-w-md sm:block">
                        <img
                            src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80"
                            alt="Friends sharing fries and plates of food around a table"
                            loading="lazy"
                            className="aspect-[4/5] w-full rounded-[28px] object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                        />
                        <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 p-4 shadow-[0_20px_40px_-20px_rgba(11,31,23,0.5)] backdrop-blur sm:inset-x-5 sm:bottom-5">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#059669]">Review of the week</p>
                            <p className="mt-1 text-sm leading-snug text-[#0b1f17]">
                                “Came for the kacchi, stayed for the borhani. Service at 11 pm was faster
                                than most places at noon.”
                            </p>
                            <p className="mt-2 text-xs text-[#0b1f17]/60">Tahsin R. · 212 reviews · Old Dhaka</p>
                        </figcaption>
                    </figure>
                </div>

                <div className="min-w-0">
                    <div
                        className="relative h-[34rem] overflow-y-auto overscroll-contain rounded-[28px] border border-[#0b1f17]/10 bg-[#f7faf8] shadow-[0_50px_100px_-50px_rgba(5,150,105,0.45)] sm:h-[40rem] lg:h-[44rem]"
                        role="region"
                        aria-label="Yardstick search results"
                        tabIndex={0}
                        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 6)}
                    >
                        <div
                            className={cn(
                                'sticky top-0 z-10 bg-white/95 px-4 pb-3 pt-4 backdrop-blur transition-shadow sm:px-6 sm:pt-6',
                                scrolled ? 'border-b border-[#0b1f17]/10 shadow-[0_12px_24px_-16px_rgba(11,31,23,0.35)]' : 'border-b border-transparent',
                            )}
                        >
                            <form role="search" className="relative" onSubmit={(e) => e.preventDefault()}>
                                <label htmlFor={`${uid}-q`} className="sr-only">
                                    Search businesses, cuisines or areas
                                </label>
                                <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#059669]" aria-hidden="true" />
                                <input
                                    id={`${uid}-q`}
                                    type="search"
                                    value={query}
                                    placeholder="Biryani, ramen, Banani…"
                                    autoComplete="off"
                                    className="min-h-12 w-full rounded-2xl border border-[#0b1f17]/15 bg-white pl-12 pr-12 text-base text-[#0b1f17] placeholder:text-[#0b1f17]/40 focus:border-[#059669] focus:outline-none focus:ring-4 focus:ring-[#059669]/15 [&::-webkit-search-cancel-button]:hidden"
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {query && (
                                    <button
                                        type="button"
                                        aria-label="Clear search"
                                        className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-[#0b1f17]/50 hover:bg-[#ecfdf5] hover:text-[#047857] focus-visible:outline-2 focus-visible:outline-[#059669]"
                                        onClick={() => setQuery('')}
                                    >
                                        <HiXMark className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                )}
                            </form>

                            <div className="relative -mx-4 mt-3 sm:-mx-6">
                                <div
                                    className="flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-1 sm:scroll-px-6 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
                                    role="group"
                                    aria-label="Quick filters"
                                >
                                    {quickFilters.map((f) => {
                                        const on = active.includes(f.id)
                                        const next = on ? active.filter((x) => x !== f.id) : [...active, f.id]
                                        const count = filterBusinesses(query, next).length
                                        return (
                                            <button
                                                key={f.id}
                                                type="button"
                                                aria-pressed={on}
                                                className={cn(
                                                    'inline-flex min-h-10 shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]',
                                                    on
                                                        ? 'border-[#059669] bg-[#059669] text-white'
                                                        : 'border-[#0b1f17]/15 bg-white text-[#0b1f17] hover:border-[#059669]',
                                                )}
                                                onClick={() => toggle(f.id)}
                                            >
                                                {f.label}
                                                <span
                                                    className={cn(
                                                        'rounded-full px-1.5 text-[11px] tabular-nums',
                                                        on ? 'bg-white/20 text-white' : 'bg-[#ecfdf5] text-[#047857]',
                                                    )}
                                                >
                                                    {count}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                                <span className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-white to-transparent" aria-hidden="true" />
                            </div>

                            <div className="mt-3 flex items-center justify-between text-xs">
                                <p className="font-semibold text-[#0b1f17]" aria-live="polite">
                                    <span className="text-[#059669]">{results.length}</span> of {businesses.length} businesses
                                </p>
                                {active.length > 0 && (
                                    <button
                                        type="button"
                                        className="min-h-10 rounded-full px-2 font-semibold text-[#047857] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#059669]"
                                        onClick={() => setActive([])}
                                    >
                                        Reset chips
                                    </button>
                                )}
                            </div>
                        </div>

                        {results.length === 0 ? (
                            <div className="flex flex-col items-center px-6 py-16 text-center">
                                <div className="w-40">
                                    <Yardstick score={0} />
                                </div>
                                <p className="mt-6 text-lg font-bold text-[#0b1f17]">Nothing measures up to all of that.</p>
                                <p className="mt-2 max-w-xs text-sm text-[#0b1f17]/60">
                                    {active.length} filters{query.trim() ? ` and “${query.trim()}”` : ''} left no matches.
                                    Loosen one and try again.
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    {lastChip && (
                                        <button
                                            type="button"
                                            className="min-h-11 rounded-full border border-[#0b1f17]/15 bg-white px-5 text-sm font-semibold text-[#0b1f17] hover:border-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]"
                                            onClick={() => toggle(lastChip.id)}
                                        >
                                            Remove “{lastChip.label}”
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="min-h-11 rounded-full bg-[#059669] px-5 text-sm font-bold text-white hover:bg-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b1f17]"
                                        onClick={() => {
                                            setActive([])
                                            setQuery('')
                                        }}
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <ol className="space-y-3 p-4 sm:p-6">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {results.map((b, i) => (
                                        <motion.li
                                            key={b.id}
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.22 }}
                                            className="rounded-2xl border border-[#0b1f17]/[0.07] bg-white p-4 sm:p-5"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 shrink-0 text-center">
                                                    <p className="text-3xl font-black leading-none tabular-nums text-[#0b1f17]">{b.score.toFixed(1)}</p>
                                                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0b1f17]/50">#{i + 1}</p>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        <a
                                                            href={`#yardstick-${b.id}`}
                                                            className="text-base font-bold text-[#0b1f17] hover:text-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] sm:text-lg"
                                                        >
                                                            {b.name}
                                                        </a>
                                                        <span className={cn('text-xs font-semibold', b.open ? 'text-[#047857]' : 'text-[#0b1f17]/45')}>
                                                            {b.open ? '● Open now' : '○ Closed'}
                                                        </span>
                                                    </div>
                                                    <p className="mt-0.5 text-sm text-[#0b1f17]/60">
                                                        {b.cuisine} · {b.area} · <span className="font-semibold text-[#0b1f17]">{'৳'.repeat(b.price)}</span>
                                                        <span className="text-[#0b1f17]/25">{'৳'.repeat(4 - b.price)}</span>
                                                    </p>
                                                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                                                        <div className="w-full max-w-[12.5rem] flex-1">
                                                            <Yardstick score={b.score} />
                                                        </div>
                                                        <span className="text-xs text-[#0b1f17]/60">{b.reviews.toLocaleString('en-US')} reviews</span>
                                                    </div>
                                                    <p className="mt-3 text-sm leading-snug text-[#0b1f17]/80">
                                                        “{b.quote}” <span className="text-[#0b1f17]/50">— {b.by}</span>
                                                    </p>
                                                    <ul className="mt-3 flex flex-wrap gap-1.5 text-[#047857]" aria-label="Amenities">
                                                        {b.delivery && (
                                                            <li className="inline-flex items-center gap-1 rounded-md bg-[#ecfdf5] px-2 py-1 text-[11px] font-semibold">
                                                                <LuBike className="h-3.5 w-3.5" aria-hidden="true" /> Delivery
                                                            </li>
                                                        )}
                                                        {b.wheelchair && (
                                                            <li className="inline-flex items-center gap-1 rounded-md bg-[#ecfdf5] px-2 py-1 text-[11px] font-semibold">
                                                                <LuAccessibility className="h-3.5 w-3.5" aria-hidden="true" /> Step-free
                                                            </li>
                                                        )}
                                                        {b.outdoor && (
                                                            <li className="inline-flex items-center gap-1 rounded-md bg-[#ecfdf5] px-2 py-1 text-[11px] font-semibold">
                                                                <LuSun className="h-3.5 w-3.5" aria-hidden="true" /> Outdoor
                                                            </li>
                                                        )}
                                                        {b.reserve && (
                                                            <li className="inline-flex items-center gap-1 rounded-md bg-[#ecfdf5] px-2 py-1 text-[11px] font-semibold">
                                                                <LuCalendarCheck className="h-3.5 w-3.5" aria-hidden="true" /> Reservations
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                                <li className="pt-3 text-center">
                                    <a
                                        href="#yardstick-write"
                                        className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold text-[#047857] underline decoration-[#059669]/40 underline-offset-4 hover:decoration-[#059669] focus-visible:outline-2 focus-visible:outline-[#059669]"
                                    >
                                        Been somewhere we missed? Write a review
                                    </a>
                                </li>
                            </ol>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StickyQuickFiltersSearchBar

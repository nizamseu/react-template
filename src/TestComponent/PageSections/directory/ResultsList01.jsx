// RichCardResultsList

// ResultsList01 · Directories & Search Aggregators › Aggregated Results List

// Description:
// A rich, photo-led results page for the local directory Localist, headed "Coffee &
// brunch near Gulshan 2". Eight Dhaka cafés are shown as cards with a photo, star rating,
// review count, ৳ price level, an opening status such as "Open until 11 pm", walking
// distance, tags, a "Visit website ↗" link and a "Save" toggle; the top result becomes a
// wide feature card with a local's quote. Use it for "near me" category results or city
// guides.

// Design:
// - White section with a soft tangerine #f97316 glow, slate #0f172a ink; sans display
//   heading (text-4xl → sm:5xl → lg:6xl) with a tangerine second line and a 3-stat strip
// - Cards: rounded-3xl, slate-200 hairline, lift shadow on hover, 16:10 photos that zoom
//   slightly, a white "No. 01" rank chip, tangerine rating pill and orange-50 tag chips
// - Status dots: emerald (open), amber (closing soon), slate (closed); price level shows
//   filled and faded ৳ signs; toolbar is a pill row between two hairlines
// - Motion: cards animate position on sort/filter (framer-motion layout + popLayout),
//   fade in/out; MotionConfig reducedMotion="user" drops the movement
// - Responsive: 1 column → md:2 → xl:3; the first card spans two columns from md with the
//   photo beside the text; toolbar stacks on mobile and splits into one row from md

// What it does:
// - Filter pills "Open now", "Budget (৳–৳৳)" and "Saved (n)" narrow the local array; a
//   sort select orders by Recommended, Highest rated, Nearest first or Price: low to high
// - A live count ("6 of 8 places") updates instantly; an empty state offers "Clear
//   filters"
// - "Save" toggles a per-place saved flag (aria-pressed) that feeds the "Saved" filter;
//   names link to #localist-<id>, "Visit website" to #localist-<id>-website, breadcrumbs
//   to #localist-dhaka / #localist-gulshan-2 and "Open map view" to #localist-map

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RichCardResultsList from '@/TestComponent/PageSections/directory/ResultsList01';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <RichCardResultsList />
//     </main>
// )
// ```

'use client'

import { useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
    HiArrowRight,
    HiArrowUpRight,
    HiChevronDown,
    HiHeart,
    HiMiniStar,
    HiOutlineArrowPath,
    HiOutlineHeart,
    HiOutlineMapPin,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const places = [
    {
        id: 'kettle-crumb',
        name: 'Kettle & Crumb',
        category: 'Brunch café',
        area: 'Road 55, Gulshan 2',
        rating: 4.8,
        reviews: 1284,
        price: 2,
        status: 'open',
        hours: 'Open until 11 pm',
        distance: 0.4,
        rank: 1,
        tags: ['Eggs all day', 'Garden seating', 'Fast Wi-Fi'],
        quote: 'The shakshuka is worth the twenty-minute wait, and the flat whites are the best in Gulshan.',
        author: 'Nabila R. · 212 reviews',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
        alt: 'Two latte art cups on a wooden table between potted plants',
    },
    {
        id: 'maple-room',
        name: 'Maple Room Bakery',
        category: 'Bakery & café',
        area: 'Road 90, Gulshan 2',
        rating: 4.9,
        reviews: 647,
        price: 2,
        status: 'open',
        hours: 'Open until 8 pm',
        distance: 0.7,
        rank: 2,
        tags: ['Sourdough', 'Cardamom buns', 'Takeaway'],
        quote: 'Get there before ten, the cardamom buns sell out every single morning.',
        author: 'Tanvir H. · 88 reviews',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
        alt: 'Rustic sourdough loaves dusted with flour on a bakery counter',
    },
    {
        id: 'tin-roof',
        name: 'Tin Roof Coffee',
        category: 'Specialty coffee',
        area: 'Road 132, Gulshan 1',
        rating: 4.7,
        reviews: 932,
        price: 1,
        status: 'open',
        hours: 'Open until 10 pm',
        distance: 1.1,
        rank: 3,
        tags: ['Single origin', 'Pour-over', 'Quiet corner'],
        quote: 'Tiny room, huge flavour. They roast Bandarban beans in-house every Tuesday.',
        author: 'Ishrat K. · 47 reviews',
        image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80',
        alt: 'A latte with a leaf pattern in a white cup seen from above',
    },
    {
        id: 'lakeside-larder',
        name: 'Lakeside Larder',
        category: 'All-day brunch',
        area: 'Road 11, Banani',
        rating: 4.6,
        reviews: 2015,
        price: 3,
        status: 'closing',
        hours: 'Closes soon · 9:30 pm',
        distance: 1.8,
        rank: 4,
        tags: ['Lake view', 'Kid friendly', 'Bookable'],
        quote: 'Ask for the terrace. Watching the boats on Banani lake with a plate of pancakes is the dream.',
        author: 'Farhan A. · 305 reviews',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
        alt: 'A waterfront restaurant terrace with tables beside the water at dusk',
    },
    {
        id: 'reading-room',
        name: 'The Reading Room',
        category: 'Book café',
        area: 'Road 17, Banani',
        rating: 4.6,
        reviews: 541,
        price: 1,
        status: 'open',
        hours: 'Open until midnight',
        distance: 2.1,
        rank: 5,
        tags: ['Board games', 'Quiet hours', 'Fast Wi-Fi'],
        quote: 'Three floors of second-hand books and a pot of masala chai that lasts an entire chapter.',
        author: 'Sadia M. · 64 reviews',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        alt: 'An industrial-style café interior with warm pendant lights and wooden tables',
    },
    {
        id: 'saffron-table',
        name: 'Saffron Table',
        category: 'Brunch & grill',
        area: 'Road 6, Baridhara',
        rating: 4.4,
        reviews: 1102,
        price: 3,
        status: 'open',
        hours: 'Open until 11:30 pm',
        distance: 2.3,
        rank: 6,
        tags: ['Weekend buffet', 'Groups', 'Parking'],
        quote: 'Friday brunch for eight people and nobody had to wait for a table. Great grilled halloumi.',
        author: 'Rafiq U. · 131 reviews',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
        alt: 'Colourful bowls of fresh ingredients laid out on a table from above',
    },
    {
        id: 'green-plate',
        name: 'Green Plate Kitchen',
        category: 'Healthy brunch',
        area: 'Road 24, Gulshan 1',
        rating: 4.3,
        reviews: 756,
        price: 2,
        status: 'closed',
        hours: 'Closed · opens 8 am',
        distance: 1.4,
        rank: 7,
        tags: ['Vegan options', 'Smoothies', 'Gluten-free'],
        quote: 'Finally a brunch place in Dhaka that labels every allergen on the menu.',
        author: 'Mehnaz J. · 29 reviews',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
        alt: 'A healthy salad bowl with avocado, chickpeas and greens',
    },
    {
        id: 'nightjar',
        name: 'Nightjar Espresso Bar',
        category: 'Coffee bar',
        area: 'Road 4, Niketan',
        rating: 4.5,
        reviews: 388,
        price: 2,
        status: 'closed',
        hours: 'Closed · opens 9 am',
        distance: 2.9,
        rank: 8,
        tags: ['Cold brew', 'Vinyl nights', 'Late mornings'],
        quote: 'Cold brew on tap and a record player in the corner. My Saturday office.',
        author: 'Arif S. · 52 reviews',
        image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
        alt: 'An industrial café with a long counter, stools and hanging lights',
    },
]

const sortOptions = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'rating', label: 'Highest rated' },
    { id: 'distance', label: 'Nearest first' },
    { id: 'price', label: 'Price: low to high' },
]

const sorters = {
    recommended: (a, b) => a.rank - b.rank,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    distance: (a, b) => a.distance - b.distance,
    price: (a, b) => a.price - b.price || b.rating - a.rating,
}

const statusStyles = {
    open: { dot: 'bg-emerald-500', text: 'text-emerald-700' },
    closing: { dot: 'bg-amber-500', text: 'text-amber-700' },
    closed: { dot: 'bg-slate-400', text: 'text-slate-500' },
}

const openCount = places.filter((place) => place.status !== 'closed').length
const avgRating = (places.reduce((sum, place) => sum + place.rating, 0) / places.length).toFixed(1)
const totalReviews = places.reduce((sum, place) => sum + place.reviews, 0)

const pad = (n) => String(n).padStart(2, '0')

const focusRing =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]'

function PriceLevel({ level }) {
    return (
        <span className="inline-flex items-center font-semibold tracking-[0.08em]">
            <span className="sr-only">Price level {level} of 4</span>
            <span aria-hidden="true" className="text-slate-900">
                {'৳'.repeat(level)}
            </span>
            <span aria-hidden="true" className="text-slate-300">
                {'৳'.repeat(4 - level)}
            </span>
        </span>
    )
}

function PlaceCard({ ref, place, index, featured, saved, onToggleSave }) {
    const status = statusStyles[place.status]

    return (
        <motion.article
            ref={ref}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                'group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-[0_28px_56px_-28px_rgba(15,23,42,0.35)]',
                featured && 'md:col-span-2 md:grid md:grid-cols-[1.08fr_1fr]',
            )}
        >
            <div
                className={cn(
                    'relative aspect-[16/10] overflow-hidden bg-orange-50',
                    featured && 'md:aspect-auto md:min-h-[380px]',
                )}
            >
                <img
                    src={place.image}
                    alt={place.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-4">
                    <span className="rounded-full bg-white/95 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900 shadow-sm">
                        No. {pad(index + 1)}
                    </span>
                    {featured ? (
                        <span className="rounded-full bg-[#f97316] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                            Top match
                        </span>
                    ) : null}
                </div>
            </div>

            <div className={cn('flex flex-1 flex-col p-5 sm:p-6', featured && 'md:p-8 lg:p-10')}>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    {place.category} · {place.area}
                </p>
                <h3
                    className={cn(
                        'mt-2 text-xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-2xl',
                        featured && 'md:text-3xl lg:text-4xl',
                    )}
                >
                    <a
                        href={`#localist-${place.id}`}
                        className={cn('rounded-md transition-colors hover:text-[#ea580c]', focusRing)}
                    >
                        {place.name}
                    </a>
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f97316] px-2.5 py-0.5 font-semibold text-white">
                        <HiMiniStar aria-hidden="true" className="text-[13px]" />
                        {place.rating.toFixed(1)}
                        <span className="sr-only"> out of 5</span>
                    </span>
                    <span className="text-slate-500">{place.reviews.toLocaleString('en-US')} reviews</span>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-300" />
                    <PriceLevel level={place.price} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                    <span className={cn('inline-flex items-center gap-2 font-medium', status.text)}>
                        <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', status.dot)} />
                        {place.hours}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-600">
                        <HiOutlineMapPin aria-hidden="true" className="text-base text-slate-400" />
                        {place.distance.toFixed(1)} km away
                    </span>
                </div>

                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${place.name} highlights`}>
                    {place.tags.map((tag) => (
                        <li
                            key={tag}
                            className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>

                {featured ? (
                    <blockquote className="mt-6 hidden border-l-2 border-[#f97316] pl-4 md:block">
                        <p className="font-serif text-lg italic leading-snug text-slate-700 lg:text-xl">
                            “{place.quote}”
                        </p>
                        <footer className="mt-2 text-xs text-slate-500">— {place.author}</footer>
                    </blockquote>
                ) : null}

                <div aria-hidden="true" className="min-h-5 flex-1" />
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <a
                        href={`#localist-${place.id}-website`}
                        className={cn(
                            'inline-flex min-h-10 items-center gap-1.5 rounded-full text-sm font-semibold text-slate-900 underline-offset-4 transition-colors hover:text-[#ea580c] hover:underline',
                            focusRing,
                        )}
                    >
                        Visit website
                        <HiArrowUpRight aria-hidden="true" />
                    </a>
                    <button
                        type="button"
                        aria-pressed={saved}
                        onClick={() => onToggleSave(place.id)}
                        className={cn(
                            'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors',
                            saved
                                ? 'border-[#f97316] bg-[#f97316] text-white hover:bg-[#ea580c]'
                                : 'border-slate-200 bg-white text-slate-900 hover:border-slate-900',
                            focusRing,
                        )}
                    >
                        {saved ? <HiHeart aria-hidden="true" /> : <HiOutlineHeart aria-hidden="true" />}
                        {saved ? 'Saved' : 'Save'}
                        <span className="sr-only"> {place.name}</span>
                    </button>
                </div>
            </div>
        </motion.article>
    )
}

export function RichCardResultsList({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [sort, setSort] = useState('recommended')
    const [openNow, setOpenNow] = useState(false)
    const [budget, setBudget] = useState(false)
    const [savedOnly, setSavedOnly] = useState(false)
    const [saved, setSaved] = useState(['maple-room'])

    const results = useMemo(
        () =>
            places
                .filter((place) => !openNow || place.status !== 'closed')
                .filter((place) => !budget || place.price <= 2)
                .filter((place) => !savedOnly || saved.includes(place.id))
                .sort(sorters[sort]),
        [openNow, budget, savedOnly, saved, sort],
    )

    const anyFilter = openNow || budget || savedOnly

    const toggleSave = (id) => {
        setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
    }

    const clearFilters = () => {
        setOpenNow(false)
        setBudget(false)
        setSavedOnly(false)
    }

    const filters = [
        { id: 'open', label: 'Open now', active: openNow, toggle: () => setOpenNow((v) => !v) },
        { id: 'budget', label: 'Budget (৳–৳৳)', active: budget, toggle: () => setBudget((v) => !v) },
        {
            id: 'saved',
            label: `Saved (${saved.length})`,
            active: savedOnly,
            toggle: () => setSavedOnly((v) => !v),
            icon: true,
        },
    ]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-white px-4 py-14 text-base font-normal text-slate-900 sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-48 -top-56 -z-10 h-[520px] w-[520px] rounded-full bg-[#f97316]/12 blur-3xl"
            />
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <span className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900">
                                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f97316] text-white">
                                        <HiOutlineMapPin aria-hidden="true" className="text-lg" />
                                    </span>
                                    Localist
                                </span>
                                <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
                                    <ol className="flex flex-wrap items-center gap-1.5">
                                        <li>
                                            <a href="#localist-dhaka" className={cn('rounded hover:text-slate-900', focusRing)}>
                                                Dhaka
                                            </a>
                                        </li>
                                        <li aria-hidden="true">/</li>
                                        <li>
                                            <a href="#localist-gulshan-2" className={cn('rounded hover:text-slate-900', focusRing)}>
                                                Gulshan 2
                                            </a>
                                        </li>
                                        <li aria-hidden="true">/</li>
                                        <li aria-current="page" className="font-medium text-slate-900">
                                            Coffee & brunch
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-slate-900 sm:text-5xl lg:text-6xl">
                                Coffee & brunch
                                <span className="block text-[#f97316]">near Gulshan 2.</span>
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                                Eight places within 3 km, ranked by{' '}
                                {totalReviews.toLocaleString('en-US')} Localist reviews. Opening hours were
                                checked by our scouts this morning.
                            </p>
                        </div>

                        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:w-[400px]">
                            {[
                                { label: 'Avg. rating', value: avgRating },
                                { label: 'Open now', value: pad(openCount) },
                                { label: 'Within', value: '3 km' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white px-3 py-4 sm:px-5">
                                    <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                                        {stat.label}
                                    </dt>
                                    <dd className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="mt-10 flex flex-col gap-4 border-y border-slate-200 py-4 md:flex-row md:items-center md:justify-between">
                        <div role="group" aria-label="Filter places" className="flex flex-wrap gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    type="button"
                                    aria-pressed={filter.active}
                                    onClick={filter.toggle}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors',
                                        filter.active
                                            ? 'border-slate-900 bg-slate-900 text-white'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900',
                                        focusRing,
                                    )}
                                >
                                    {filter.icon ? (
                                        <HiHeart
                                            aria-hidden="true"
                                            className={filter.active ? 'text-[#fdba74]' : 'text-[#f97316]'}
                                        />
                                    ) : (
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'h-1.5 w-1.5 rounded-full',
                                                filter.active ? 'bg-[#fdba74]' : 'bg-slate-300',
                                            )}
                                        />
                                    )}
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between gap-4 md:justify-end">
                            <p aria-live="polite" aria-atomic="true" className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">{results.length}</span> of{' '}
                                {places.length} places
                            </p>
                            <label className="relative inline-flex items-center">
                                <span className="sr-only">Sort places</span>
                                <select
                                    value={sort}
                                    onChange={(event) => setSort(event.target.value)}
                                    className={cn(
                                        'min-h-10 cursor-pointer appearance-none rounded-full border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-400',
                                        focusRing,
                                    )}
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <HiChevronDown
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-4 text-slate-500"
                                />
                            </label>
                        </div>
                    </div>

                    {results.length ? (
                        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                            <AnimatePresence initial={false} mode="popLayout">
                                {results.map((place, index) => (
                                    <PlaceCard
                                        key={place.id}
                                        place={place}
                                        index={index}
                                        featured={index === 0}
                                        saved={saved.includes(place.id)}
                                        onToggleSave={toggleSave}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-orange-50/40 px-6 py-16 text-center">
                            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl text-[#f97316] shadow-sm">
                                <HiOutlineMapPin aria-hidden="true" />
                            </span>
                            <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
                                No places match these filters
                            </h3>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                                {savedOnly && !saved.length
                                    ? 'You have not saved any places yet. Tap “Save” on a card to keep it here.'
                                    : 'Try switching off a filter. There are eight cafés within 3 km of Gulshan 2.'}
                            </p>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className={cn(
                                    'mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f97316] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#ea580c]',
                                    focusRing,
                                )}
                            >
                                <HiOutlineArrowPath aria-hidden="true" />
                                Clear filters
                            </button>
                        </div>
                    )}

                    <div className="mt-10 flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <p>Distances from Gulshan 2 Circle · Hours confirmed by owners and Localist scouts</p>
                        <a
                            href="#localist-map"
                            className={cn(
                                'group inline-flex min-h-10 items-center gap-2 self-start rounded-full font-semibold text-slate-900 transition-colors hover:text-[#ea580c] sm:self-auto',
                                focusRing,
                            )}
                        >
                            {anyFilter ? 'See these on the map' : 'Open map view'}
                            <HiArrowRight
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default RichCardResultsList

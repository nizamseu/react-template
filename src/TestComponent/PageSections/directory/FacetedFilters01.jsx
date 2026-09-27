// AccordionCheckboxFacetedFilters

// FacetedFilters01 · Directories & Search Aggregators › Faceted Sidebar Filters

// Description:
// A classic, polished faceted-search layout for the local directory Localist. Under the
// heading "Eat & drink in Dhaka" a sidebar of collapsible facet groups (Category, Price,
// Features, Rating) with live counts drives a photo results grid beside it; applied filters
// appear as removable chips with "Clear all", and a sort menu reorders the cards. Use it
// on any category or search-results page of a business directory.

// Design:
// - White section, slate #0f172a ink, tangerine #f97316 accents (checked boxes, chip
//   borders, counts, focus rings); breadcrumb eyebrow and a bold sans heading text-3xl →
//   lg:text-5xl
// - Sidebar: rounded-3xl card with slate-200 hairlines between accordion groups; each
//   header shows a tangerine "n selected" badge and a rotating chevron; custom square
//   checkboxes and round radios drawn with peer-checked utilities; zero-count options dim
// - Results: rounded-3xl cards with 4:3 photos, price badge, rating, area and three
//   feature icons; sm:grid-cols-2 → xl:grid-cols-3; cards animate with layout/AnimatePresence
// - Responsive: below lg the sidebar collapses behind a full-width "Filters" disclosure
//   button (with the applied count); at lg it becomes a 280px sticky column

// What it does:
// - Checkbox sets for category and price (OR within a group), features (must all match)
//   and a rating radio filter 16 places; each option's count is live (other groups applied)
// - Accordion headers toggle their group (aria-expanded/aria-controls, animated height);
//   Category, Price and Features start open, Rating starts collapsed; "Free Wi-Fi" is
//   pre-ticked so the chips row is populated on first view
// - Chips remove one value each, "Clear all" resets everything; the sort select offers
//   Recommended / Highest rated / Most reviewed / Price: low to high
// - Results count is aria-live; the empty state has a "Clear all filters" button; cards
//   link to #localist-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AccordionCheckboxFacetedFilters from '@/TestComponent/PageSections/directory/FacetedFilters01';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <AccordionCheckboxFacetedFilters />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheck, HiChevronDown, HiOutlineAdjustmentsHorizontal, HiStar, HiXMark } from 'react-icons/hi2';
import { LuBaby, LuCar, LuCreditCard, LuSun, LuTruck, LuWifi } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const categoryOptions = [
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'cafes', label: 'Cafés' },
    { id: 'bakeries', label: 'Bakeries' },
    { id: 'street', label: 'Street food' },
]

const priceOptions = [
    { id: 1, label: '৳', hint: 'under Tk 400' },
    { id: 2, label: '৳৳', hint: 'Tk 400–900' },
    { id: 3, label: '৳৳৳', hint: 'Tk 900–2,000' },
    { id: 4, label: '৳৳৳৳', hint: 'Tk 2,000+' },
]

const featureOptions = [
    { id: 'wifi', label: 'Free Wi-Fi', icon: LuWifi },
    { id: 'parking', label: 'Parking', icon: LuCar },
    { id: 'kids', label: 'Kid friendly', icon: LuBaby },
    { id: 'outdoor', label: 'Outdoor seating', icon: LuSun },
    { id: 'card', label: 'Card payment', icon: LuCreditCard },
    { id: 'delivery', label: 'Home delivery', icon: LuTruck },
]

const ratingOptions = [
    { id: 0, label: 'Any rating' },
    { id: 3.5, label: '3.5 & up' },
    { id: 4, label: '4.0 & up' },
    { id: 4.5, label: '4.5 & up' },
]

const sortOptions = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'rating', label: 'Highest rated' },
    { id: 'reviews', label: 'Most reviewed' },
    { id: 'price', label: 'Price: low to high' },
]

const places = [
    { id: 'ember-room', name: 'Ember Room', category: 'restaurants', area: 'Gulshan 2', price: 4, rating: 4.9, reviews: 418, features: ['parking', 'card', 'wifi'], image: img('1517248135467-4c7edcad34c4'), alt: 'Dark, modern dining room with laid tables' },
    { id: 'saffron-salt', name: 'Saffron & Salt', category: 'restaurants', area: 'Dhanmondi', price: 3, rating: 4.3, reviews: 977, features: ['parking', 'card', 'kids', 'delivery'], image: img('1414235077428-338989a2e8c0'), alt: 'Plated dish on a restaurant table' },
    { id: 'smash-club', name: 'Smash Club Burgers', category: 'restaurants', area: 'Banani', price: 2, rating: 4.7, reviews: 1284, features: ['delivery', 'card', 'outdoor'], image: img('1568901346375-23c9450c58cd'), alt: 'Cheeseburger on a plate' },
    { id: 'forno-lane', name: 'Forno Lane Pizzeria', category: 'restaurants', area: 'Gulshan 2', price: 3, rating: 4.6, reviews: 932, features: ['kids', 'card', 'delivery', 'wifi'], image: img('1565299624946-b28f40a0ae38'), alt: 'Pizza on a wooden board' },
    { id: 'lakeview', name: 'Lakeview Terrace', category: 'restaurants', area: 'Gulshan 2', price: 3, rating: 4.4, reviews: 1050, features: ['outdoor', 'parking', 'card', 'kids'], image: img('1559339352-11d035aa65de'), alt: 'Restaurant terrace beside the water' },
    { id: 'rare-rested', name: 'Rare & Rested', category: 'restaurants', area: 'Baridhara', price: 4, rating: 4.5, reviews: 356, features: ['parking', 'card'], image: img('1600891964092-4316c288032e'), alt: 'Sliced steak served with fries' },
    { id: 'green-ladle', name: 'Green Ladle Kitchen', category: 'restaurants', area: 'Gulshan 1', price: 2, rating: 4.8, reviews: 611, features: ['wifi', 'card', 'delivery', 'kids'], image: img('1512621776951-a57141f2eefd'), alt: 'Colourful salad bowl' },
    { id: 'tin-roof', name: 'Tin Roof Coffee', category: 'cafes', area: 'Banani', price: 2, rating: 4.6, reviews: 1622, features: ['wifi', 'card', 'outdoor'], image: img('1521017432531-fbd92d768814'), alt: 'Industrial café with wooden tables' },
    { id: 'two-cups', name: 'Two Cups Café', category: 'cafes', area: 'Uttara', price: 1, rating: 4.3, reviews: 390, features: ['wifi', 'kids'], image: img('1555396273-367ea4eb4db5'), alt: 'Warm café interior with pendant lights' },
    { id: 'monsoon-latte', name: 'Monsoon Latte Bar', category: 'cafes', area: 'Dhanmondi', price: 2, rating: 4.5, reviews: 740, features: ['wifi', 'card', 'delivery'], image: img('1517256064527-09c73fc73e38'), alt: 'Latte in a ceramic cup' },
    { id: 'drip-lab', name: 'Drip Lab', category: 'cafes', area: 'Gulshan 2', price: 3, rating: 4.8, reviews: 988, features: ['wifi', 'card', 'parking'], image: img('1509042239860-f550ce710b93'), alt: 'Latte art cups among plants' },
    { id: 'brick-oven', name: 'Brick Oven Bakehouse', category: 'bakeries', area: 'Dhanmondi', price: 1, rating: 4.7, reviews: 803, features: ['card', 'delivery', 'kids'], image: img('1509440159596-0249088772ff'), alt: 'Rustic loaves of bread' },
    { id: 'crumb-co', name: 'Crumb & Co.', category: 'bakeries', area: 'Bashundhara', price: 2, rating: 4.4, reviews: 522, features: ['card', 'delivery', 'parking', 'kids'], image: img('1495474472287-4d71bcdd2085'), alt: 'Two lattes on a café table' },
    { id: 'fuchka-corner', name: 'Fuchka Corner', category: 'street', area: 'Dhanmondi', price: 1, rating: 4.6, reviews: 2380, features: ['outdoor', 'kids'], image: img('1466978913421-dad2ebd01d17'), alt: 'Friends sharing snacks around a table' },
    { id: 'chotpoti-chowk', name: 'Chotpoti Chowk', category: 'street', area: 'Old Dhaka', price: 1, rating: 3.9, reviews: 1145, features: ['outdoor'], image: img('1504674900247-0877df9cc836'), alt: 'Bowls of food on a table from above' },
    { id: 'kebab-gali', name: 'Kebab Gali', category: 'street', area: 'Old Dhaka', price: 1, rating: 4.2, reviews: 1690, features: ['outdoor', 'delivery'], image: img('1498837167922-ddd27525d352'), alt: 'Small bowls of colourful ingredients' },
]

const emptyFilters = { categories: [], prices: [], features: [], rating: 0 }

const matches = (p, f, skip) =>
    (skip === 'categories' || !f.categories.length || f.categories.includes(p.category)) &&
    (skip === 'prices' || !f.prices.length || f.prices.includes(p.price)) &&
    (skip === 'features' || f.features.every((x) => p.features.includes(x))) &&
    (skip === 'rating' || p.rating >= f.rating)

const toggleIn = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

function Stars({ value }) {
    return (
        <span className="inline-flex" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
                <HiStar key={n} className={cn('h-4 w-4', value >= n - 0.25 ? 'text-[#f97316]' : 'text-slate-200')} />
            ))}
        </span>
    )
}

function FacetGroup({ id, title, selectedCount, open, onToggle, reduceMotion, children }) {
    return (
        <div className="border-b border-slate-200 last:border-b-0">
            <h3 className="text-base font-semibold text-[#0f172a]">
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={id}
                    className="flex min-h-14 w-full items-center justify-between gap-3 px-5 text-left text-base font-semibold text-[#0f172a] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#f97316]"
                    onClick={onToggle}
                >
                    <span className="flex items-center gap-2">
                        {title}
                        {selectedCount > 0 && (
                            <span className="rounded-full bg-[#f97316] px-2 py-0.5 text-[11px] font-bold text-white">{selectedCount} selected</span>
                        )}
                    </span>
                    <HiChevronDown className={cn('h-5 w-5 text-slate-400 transition-transform duration-300', open && 'rotate-180')} aria-hidden="true" />
                </button>
            </h3>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="panel"
                        id={id}
                        initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <fieldset className="px-5 pb-5">
                            <legend className="sr-only">{title}</legend>
                            {children}
                        </fieldset>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function OptionRow({ type = 'checkbox', name, checked, onChange, label, hint, count, icon: Icon }) {
    const empty = count === 0 && !checked
    return (
        <label className={cn('group flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-2 -mx-2 hover:bg-[#fff7ed]', empty && 'opacity-45')}>
            <input type={type} name={name} checked={checked} className="peer sr-only" onChange={onChange} />
            <span
                className={cn(
                    'grid h-5 w-5 shrink-0 place-items-center border-2 border-slate-300 bg-white text-white transition-colors peer-checked:border-[#f97316] peer-checked:bg-[#f97316] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#f97316]',
                    type === 'radio' ? 'rounded-full' : 'rounded-md',
                )}
                aria-hidden="true"
            >
                {type === 'radio' ? (
                    <span className={cn('h-2 w-2 rounded-full bg-white', !checked && 'hidden')} />
                ) : (
                    <HiCheck className={cn('h-3.5 w-3.5', !checked && 'hidden')} />
                )}
            </span>
            {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />}
            <span className="flex-1 text-sm text-[#0f172a]">
                {label}
                {hint && <span className="ml-1.5 text-xs text-slate-500">{hint}</span>}
            </span>
            <span className="text-xs tabular-nums text-slate-500">{count}</span>
        </label>
    )
}

export function AccordionCheckboxFacetedFilters({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [filters, setFilters] = useState({ ...emptyFilters, features: ['wifi'] })
    const [openGroups, setOpenGroups] = useState(['categories', 'prices', 'features'])
    const [sort, setSort] = useState('recommended')
    const [mobileOpen, setMobileOpen] = useState(false)

    const results = useMemo(() => {
        const list = places.filter((p) => matches(p, filters))
        const sorters = {
            recommended: (a, b) => b.rating * Math.log(b.reviews) - a.rating * Math.log(a.reviews),
            rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
            reviews: (a, b) => b.reviews - a.reviews,
            price: (a, b) => a.price - b.price || b.rating - a.rating,
        }
        return list.sort(sorters[sort])
    }, [filters, sort])

    const facetCount = (group, test) => places.filter((p) => matches(p, filters, group) && test(p)).length

    const chips = [
        ...filters.categories.map((c) => ({ key: `c-${c}`, label: categoryOptions.find((o) => o.id === c).label, remove: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })) })),
        ...filters.prices.map((p) => ({ key: `p-${p}`, label: priceOptions.find((o) => o.id === p).label, remove: () => setFilters((f) => ({ ...f, prices: f.prices.filter((x) => x !== p) })) })),
        ...filters.features.map((x) => ({ key: `f-${x}`, label: featureOptions.find((o) => o.id === x).label, remove: () => setFilters((f) => ({ ...f, features: f.features.filter((y) => y !== x) })) })),
        ...(filters.rating ? [{ key: 'r', label: `${filters.rating.toFixed(1)}★ & up`, remove: () => setFilters((f) => ({ ...f, rating: 0 })) }] : []),
    ]

    const toggleGroup = (g) => setOpenGroups((list) => toggleIn(list, g))
    const clearAll = () => setFilters(emptyFilters)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
                            <ol className="flex flex-wrap items-center gap-1.5">
                                <li>
                                    <a href="#localist-home" className="font-semibold text-[#f97316] hover:underline focus-visible:outline-2 focus-visible:outline-[#f97316]">
                                        Localist
                                    </a>
                                </li>
                                <li aria-hidden="true">/</li>
                                <li>Dhaka</li>
                                <li aria-hidden="true">/</li>
                                <li aria-current="page" className="text-[#0f172a]">
                                    Eat &amp; drink
                                </li>
                            </ol>
                        </nav>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-4xl lg:text-5xl">
                            Eat &amp; drink in Dhaka
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <label htmlFor={`${uid}-sort`} className="text-sm text-slate-500">
                            Sort by
                        </label>
                        <div className="relative">
                            <select
                                id={`${uid}-sort`}
                                value={sort}
                                className="min-h-11 cursor-pointer appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-10 text-sm font-semibold text-[#0f172a] hover:border-[#f97316] focus:outline-none focus-visible:border-[#f97316] focus-visible:ring-4 focus-visible:ring-[#f97316]/20"
                                onChange={(e) => setSort(e.target.value)}
                            >
                                {sortOptions.map((o) => (
                                    <option key={o.id} value={o.id}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                            <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                        </div>
                    </div>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
                    <div className="lg:sticky lg:top-6">
                        <button
                            type="button"
                            aria-expanded={mobileOpen}
                            aria-controls={`${uid}-facets`}
                            className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-[#0f172a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] lg:hidden"
                            onClick={() => setMobileOpen((o) => !o)}
                        >
                            <span className="flex items-center gap-2">
                                <HiOutlineAdjustmentsHorizontal className="h-5 w-5 text-[#f97316]" aria-hidden="true" />
                                Filters
                                {chips.length > 0 && <span className="rounded-full bg-[#f97316] px-2 py-0.5 text-[11px] text-white">{chips.length}</span>}
                            </span>
                            <HiChevronDown className={cn('h-5 w-5 text-slate-400 transition-transform', mobileOpen && 'rotate-180')} aria-hidden="true" />
                        </button>

                        <aside
                            id={`${uid}-facets`}
                            aria-label="Filters"
                            className={cn('mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white lg:mt-0 lg:block', mobileOpen ? 'block' : 'hidden')}
                        >
                            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0f172a]">Filters</p>
                                <button
                                    type="button"
                                    disabled={!chips.length}
                                    className="min-h-10 rounded-full px-2 text-sm font-semibold text-[#c2410c] hover:underline focus-visible:outline-2 focus-visible:outline-[#f97316] disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
                                    onClick={clearAll}
                                >
                                    Clear all
                                </button>
                            </div>

                            <FacetGroup
                                id={`${uid}-g-cat`}
                                title="Category"
                                selectedCount={filters.categories.length}
                                open={openGroups.includes('categories')}
                                reduceMotion={reduceMotion}
                                onToggle={() => toggleGroup('categories')}
                            >
                                {categoryOptions.map((o) => (
                                    <OptionRow
                                        key={o.id}
                                        label={o.label}
                                        checked={filters.categories.includes(o.id)}
                                        count={facetCount('categories', (p) => p.category === o.id)}
                                        onChange={() => setFilters((f) => ({ ...f, categories: toggleIn(f.categories, o.id) }))}
                                    />
                                ))}
                            </FacetGroup>

                            <FacetGroup
                                id={`${uid}-g-price`}
                                title="Price"
                                selectedCount={filters.prices.length}
                                open={openGroups.includes('prices')}
                                reduceMotion={reduceMotion}
                                onToggle={() => toggleGroup('prices')}
                            >
                                {priceOptions.map((o) => (
                                    <OptionRow
                                        key={o.id}
                                        label={o.label}
                                        hint={o.hint}
                                        checked={filters.prices.includes(o.id)}
                                        count={facetCount('prices', (p) => p.price === o.id)}
                                        onChange={() => setFilters((f) => ({ ...f, prices: toggleIn(f.prices, o.id) }))}
                                    />
                                ))}
                            </FacetGroup>

                            <FacetGroup
                                id={`${uid}-g-feat`}
                                title="Features"
                                selectedCount={filters.features.length}
                                open={openGroups.includes('features')}
                                reduceMotion={reduceMotion}
                                onToggle={() => toggleGroup('features')}
                            >
                                {featureOptions.map((o) => (
                                    <OptionRow
                                        key={o.id}
                                        label={o.label}
                                        icon={o.icon}
                                        checked={filters.features.includes(o.id)}
                                        count={places.filter((p) => matches(p, { ...filters, features: [...new Set([...filters.features, o.id])] })).length}
                                        onChange={() => setFilters((f) => ({ ...f, features: toggleIn(f.features, o.id) }))}
                                    />
                                ))}
                            </FacetGroup>

                            <FacetGroup
                                id={`${uid}-g-rating`}
                                title="Rating"
                                selectedCount={filters.rating ? 1 : 0}
                                open={openGroups.includes('rating')}
                                reduceMotion={reduceMotion}
                                onToggle={() => toggleGroup('rating')}
                            >
                                {ratingOptions.map((o) => (
                                    <OptionRow
                                        key={o.id}
                                        type="radio"
                                        name={`${uid}-rating`}
                                        label={o.label}
                                        checked={filters.rating === o.id}
                                        count={facetCount('rating', (p) => p.rating >= o.id)}
                                        onChange={() => setFilters((f) => ({ ...f, rating: o.id }))}
                                    />
                                ))}
                            </FacetGroup>
                        </aside>
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="mr-2 text-sm text-slate-600" aria-live="polite">
                                <strong className="text-lg font-bold text-[#0f172a]">{results.length}</strong> of {places.length} places
                            </p>
                            <AnimatePresence initial={false}>
                                {chips.map((c) => (
                                    <motion.button
                                        key={c.key}
                                        type="button"
                                        layout={!reduceMotion}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        aria-label={`Remove filter ${c.label}`}
                                        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#f97316]/50 bg-[#fff7ed] pl-3.5 pr-2.5 text-sm font-semibold text-[#9a3412] hover:border-[#f97316] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                                        onClick={c.remove}
                                    >
                                        {c.label}
                                        <HiXMark className="h-4 w-4" aria-hidden="true" />
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                            {chips.length > 1 && (
                                <button
                                    type="button"
                                    className="min-h-10 rounded-full px-3 text-sm font-semibold text-[#0f172a] underline decoration-[#f97316] decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#f97316]"
                                    onClick={clearAll}
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {results.length === 0 ? (
                            <div className="mt-6 flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 px-6 py-16 text-center">
                                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fff7ed] text-[#f97316]" aria-hidden="true">
                                    <HiOutlineAdjustmentsHorizontal className="h-7 w-7" />
                                </span>
                                <p className="mt-5 text-lg font-bold text-[#0f172a]">No places tick every box</p>
                                <p className="mt-2 max-w-sm text-sm text-slate-600">
                                    Features must all match, so try unticking one — or widen the price range.
                                </p>
                                <button
                                    type="button"
                                    className="mt-6 min-h-11 rounded-full bg-[#f97316] px-6 text-sm font-bold text-white hover:bg-[#ea580c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f172a]"
                                    onClick={clearAll}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {results.map((p) => (
                                        <motion.li
                                            key={p.id}
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <a
                                                href={`#localist-${p.id}`}
                                                className="group block h-full overflow-hidden rounded-3xl border border-slate-200 bg-white transition-shadow hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                                            >
                                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                                    <img
                                                        src={p.image}
                                                        alt={p.alt}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#0f172a]">
                                                        {'৳'.repeat(p.price)}
                                                    </span>
                                                </div>
                                                <div className="p-5">
                                                    <p className="text-lg font-bold text-[#0f172a] group-hover:text-[#c2410c]">{p.name}</p>
                                                    <p className="mt-0.5 text-sm text-slate-500">
                                                        {categoryOptions.find((c) => c.id === p.category).label} · {p.area}
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-2 text-sm">
                                                        <Stars value={p.rating} />
                                                        <span className="font-bold text-[#0f172a]">{p.rating.toFixed(1)}</span>
                                                        <span className="text-slate-500">({p.reviews.toLocaleString('en-US')})</span>
                                                    </div>
                                                    <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4" aria-label="Features">
                                                        {p.features.slice(0, 3).map((fid) => {
                                                            const f = featureOptions.find((o) => o.id === fid)
                                                            const Icon = f.icon
                                                            return (
                                                                <li
                                                                    key={fid}
                                                                    className={cn(
                                                                        'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs',
                                                                        filters.features.includes(fid) ? 'bg-[#fff7ed] font-semibold text-[#9a3412]' : 'bg-slate-100 text-slate-600',
                                                                    )}
                                                                >
                                                                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                                                    {f.label}
                                                                </li>
                                                            )
                                                        })}
                                                        {p.features.length > 3 && (
                                                            <li className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">+{p.features.length - 3}</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </a>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AccordionCheckboxFacetedFilters

// TripleFieldSearchBar

// FilterSearchBar01 · Directories & Search Aggregators › Multi-Filter Search Bar

// Description:
// A bright, confident three-part search bar for the local directory Localist. Under the
// heading "What are you after today?" visitors type a keyword, pick a category and set a
// place ("Use my location" resolves to "Near Gulshan, Dhaka"), then press "Search". Recent
// searches sit below as reusable chips, and a live preview list shows the matching Dhaka
// businesses. Use it at the top of a city directory, marketplace or "near me" landing page.

// Design:
// - White section with a faint slate dot grid, slate #0f172a ink and tangerine #f97316
//   accents; a sans display heading (text-4xl → lg:text-7xl) with a tangerine underline
// - Search bar: rounded-[28px] white shell, slate-200 border, deep soft shadow; three fields
//   labelled "01 What / 02 Category / 03 Where", then a tangerine rounded-[20px] Search key
// - Stacks as bordered rows on mobile; lg:grid-cols-[1.25fr_1fr_1.35fr_auto] with hairline
//   dividers on desktop; "Use my location" wraps under the 10rem-min input when narrow;
//   recent-search chips wrap; preview rows use 64px rounded thumbnails
// - Preview rows fade/slide in and out with framer-motion (layout + AnimatePresence); the
//   locating state shows a pulsing ring (static for reduced motion)
// - Responsive: header splits into two columns at lg; preview rows hide the address below
//   sm and show the distance chip only once a location has been resolved

// What it does:
// - keyword, category and location are controlled state and filter 18 businesses live (by
//   name, type and tags / category / area and address); count + empty state update instantly
// - "Use my location" shows "Locating…" for 1.4 s (timeout cleared on unmount), then fills
//   "Near Gulshan, Dhaka", keeps places within 3 km and sorts them by distance
// - Submitting ("Search" or Enter) saves the query as a recent-search chip (max 5); a chip
//   re-applies its fields, its × removes it; "Clear" resets every field
// - Result rows link to #localist-<id>; "See all" links to #localist-results

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TripleFieldSearchBar from '@/TestComponent/PageSections/directory/FilterSearchBar01';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <TripleFieldSearchBar />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiChevronDown,
    HiOutlineClock,
    HiOutlineMagnifyingGlass,
    HiOutlineMapPin,
    HiOutlineSquares2X2,
    HiStar,
    HiXMark,
} from 'react-icons/hi2';
import { TbCurrentLocation } from 'react-icons/tb';
import { cn } from '@/design-system/lib/cn';

const NEAR_LABEL = 'Near Gulshan, Dhaka'
const NEAR_RADIUS_KM = 3
const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

const categories = [
    { id: 'all', label: 'All categories' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'cafes', label: 'Cafés & bakeries' },
    { id: 'beauty', label: 'Salons & spas' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'health', label: 'Health' },
]

const places = [
    { id: 'smash-club', name: 'Smash Club Burgers', category: 'restaurants', kind: 'Burgers', tags: ['burger', 'fries', 'late night', 'delivery'], area: 'Banani', address: 'House 42, Road 11', rating: 4.7, reviews: 1284, price: '৳৳', km: 1.8, status: 'Open until 1 am', open: true, image: img('1568901346375-23c9450c58cd'), alt: 'Burger with melted cheese on a plate' },
    { id: 'forno-lane', name: 'Forno Lane Pizzeria', category: 'restaurants', kind: 'Wood-fired pizza', tags: ['pizza', 'italian', 'family'], area: 'Gulshan 2', address: 'Road 55, North Avenue', rating: 4.6, reviews: 932, price: '৳৳৳', km: 0.9, status: 'Open until 11 pm', open: true, image: img('1565299624946-b28f40a0ae38'), alt: 'Pizza with fresh toppings on a wooden board' },
    { id: 'green-ladle', name: 'Green Ladle Kitchen', category: 'restaurants', kind: 'Vegan bowls', tags: ['vegan', 'salad', 'healthy', 'brunch'], area: 'Gulshan 1', address: 'Road 132, near DCC Market', rating: 4.8, reviews: 611, price: '৳৳', km: 1.2, status: 'Open until 10 pm', open: true, image: img('1512621776951-a57141f2eefd'), alt: 'Colourful healthy salad bowl' },
    { id: 'ember-room', name: 'Ember Room', category: 'restaurants', kind: 'Modern Bengali tasting menu', tags: ['fine dining', 'bengali', 'date night'], area: 'Gulshan 2', address: 'Road 90, Lake Drive', rating: 4.9, reviews: 418, price: '৳৳৳৳', km: 0.6, status: 'Opens 6:30 pm', open: false, image: img('1517248135467-4c7edcad34c4'), alt: 'Dark, modern restaurant dining room with set tables' },
    { id: 'lakeview-terrace', name: 'Lakeview Terrace', category: 'restaurants', kind: 'Grill & seafood', tags: ['seafood', 'grill', 'outdoor', 'lake view'], area: 'Gulshan 2', address: 'Gulshan Lake Park, Gate 3', rating: 4.4, reviews: 1050, price: '৳৳৳', km: 0.4, status: 'Open until 11:30 pm', open: true, image: img('1559339352-11d035aa65de'), alt: 'Restaurant terrace by the water with outdoor tables' },
    { id: 'brick-oven', name: 'Brick Oven Bakehouse', category: 'cafes', kind: 'Sourdough bakery', tags: ['bakery', 'bread', 'breakfast', 'coffee'], area: 'Dhanmondi', address: 'Road 27, Dhanmondi', rating: 4.7, reviews: 803, price: '৳', km: 7.4, status: 'Open until 9 pm', open: true, image: img('1509440159596-0249088772ff'), alt: 'Rustic loaves of freshly baked bread' },
    { id: 'tin-roof', name: 'Tin Roof Coffee', category: 'cafes', kind: 'Specialty coffee', tags: ['coffee', 'wifi', 'laptop friendly'], area: 'Banani', address: 'Road 17, Block C', rating: 4.6, reviews: 1622, price: '৳৳', km: 1.5, status: 'Open until 11 pm', open: true, image: img('1521017432531-fbd92d768814'), alt: 'Industrial style café interior with wooden tables' },
    { id: 'monsoon-latte', name: 'Monsoon Latte Bar', category: 'cafes', kind: 'Coffee & desserts', tags: ['coffee', 'dessert', 'latte art'], area: 'Dhanmondi', address: 'Satmasjid Road, Road 9/A', rating: 4.5, reviews: 740, price: '৳৳', km: 7.8, status: 'Open until 10:30 pm', open: true, image: img('1509042239860-f550ce710b93'), alt: 'Latte art in cups surrounded by plants' },
    { id: 'two-cups', name: 'Two Cups Café', category: 'cafes', kind: 'Neighbourhood café', tags: ['coffee', 'breakfast', 'quiet'], area: 'Uttara', address: 'Sector 7, Road 18', rating: 4.3, reviews: 390, price: '৳', km: 14.2, status: 'Open until 10 pm', open: true, image: img('1495474472287-4d71bcdd2085'), alt: 'Two cups of latte on a table' },
    { id: 'chiselled', name: 'Chiselled Barber Co.', category: 'beauty', kind: 'Barbershop', tags: ['barber', 'haircut', 'beard', 'grooming'], area: 'Banani', address: 'Road 11, Level 2', rating: 4.8, reviews: 566, price: '৳৳', km: 1.6, status: 'Open until 9 pm', open: true, image: img('1503951914875-452162b0f3f1'), alt: 'Barber trimming a client’s hair' },
    { id: 'lotus-leaf', name: 'Lotus Leaf Day Spa', category: 'beauty', kind: 'Spa & facials', tags: ['spa', 'facial', 'massage', 'skincare'], area: 'Baridhara', address: 'Park Road, Baridhara', rating: 4.7, reviews: 288, price: '৳৳৳', km: 1.9, status: 'Open until 8 pm', open: true, image: img('1570172619644-dfd03ed5d881'), alt: 'Client receiving a facial treatment at a spa' },
    { id: 'iron-tide', name: 'Iron Tide Gym', category: 'fitness', kind: 'Strength gym', tags: ['gym', 'weights', 'personal trainer', '24 hours'], area: 'Tejgaon', address: 'Bir Uttam Mir Shawkat Road', rating: 4.6, reviews: 455, price: '৳৳', km: 3.8, status: 'Open 24 hours', open: true, image: img('1517836357463-d25dfeac3438'), alt: 'Athlete lifting a loaded barbell' },
    { id: 'lakeside-yoga', name: 'Lakeside Yoga Loft', category: 'fitness', kind: 'Yoga studio', tags: ['yoga', 'meditation', 'pilates'], area: 'Dhanmondi', address: 'Road 8, facing Dhanmondi Lake', rating: 4.9, reviews: 212, price: '৳৳', km: 7.1, status: 'Next class 6 pm', open: true, image: img('1544367567-0f2fcb009e0b'), alt: 'Silhouette of a yoga pose at sunset' },
    { id: 'paper-boat', name: 'Paper Boat Books', category: 'shopping', kind: 'Bookshop & reading room', tags: ['books', 'stationery', 'quiet', 'kids'], area: 'Dhanmondi', address: 'Road 4, Dhanmondi', rating: 4.8, reviews: 1190, price: '৳', km: 7.3, status: 'Open until 9 pm', open: true, image: img('1521587760476-6c12a4b040da'), alt: 'Tall shelves packed with books' },
    { id: 'jute-loom', name: 'Jute & Loom', category: 'shopping', kind: 'Handloom boutique', tags: ['clothing', 'handloom', 'saree', 'gifts'], area: 'Banani', address: 'Road 27, Block K', rating: 4.5, reviews: 340, price: '৳৳৳', km: 1.7, status: 'Open until 8:30 pm', open: true, image: img('1441986300917-64674bd600d8'), alt: 'Clothing boutique interior with rails of garments' },
    { id: 'bazaar-nine', name: 'Bazaar Nine Grocers', category: 'shopping', kind: 'Organic grocer', tags: ['grocery', 'organic', 'produce', 'delivery'], area: 'Gulshan 1', address: 'Road 9, Gulshan 1', rating: 4.4, reviews: 702, price: '৳৳', km: 1.1, status: 'Open until 10 pm', open: true, image: img('1542838132-92c53300491e'), alt: 'Shelves stocked with fresh produce' },
    { id: 'smile-square', name: 'Smile Square Dental', category: 'health', kind: 'Dental clinic', tags: ['dentist', 'dental', 'braces', 'clinic'], area: 'Dhanmondi', address: 'Road 7/A, Dhanmondi', rating: 4.7, reviews: 389, price: '৳৳৳', km: 7.6, status: 'Closed · opens 10 am', open: false, image: img('1576091160399-112ba8d25d1d'), alt: 'Doctor in a white coat holding a phone' },
    { id: 'banani-physio', name: 'Banani Physio & Rehab', category: 'health', kind: 'Physiotherapy', tags: ['physio', 'rehab', 'sports injury', 'clinic'], area: 'Banani', address: 'Road 12, Banani', rating: 4.6, reviews: 174, price: '৳৳', km: 2.1, status: 'Open until 7 pm', open: true, image: img('1571019613454-1cb2f99b2d8b'), alt: 'Woman doing a guided core exercise on a mat' },
]

const initialRecent = [
    { id: 'r1', keyword: 'burger', category: 'restaurants', location: 'Banani' },
    { id: 'r2', keyword: 'coffee', category: 'cafes', location: 'Dhanmondi' },
    { id: 'r3', keyword: '', category: 'beauty', location: 'Gulshan' },
    { id: 'r4', keyword: 'yoga', category: 'all', location: '' },
]

const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? 'All categories'

const describe = (search) => {
    const what = search.keyword || (search.category !== 'all' ? categoryLabel(search.category) : 'Anything')
    return search.location ? `${what} · ${search.location}` : what
}

export function TripleFieldSearchBar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [keyword, setKeyword] = useState('')
    const [category, setCategory] = useState('all')
    const [location, setLocation] = useState('')
    const [located, setLocated] = useState(false)
    const [locating, setLocating] = useState(false)
    const [recent, setRecent] = useState(initialRecent)
    const [lastSearch, setLastSearch] = useState(null)
    const locateTimer = useRef(null)
    const keywordRef = useRef(null)

    useEffect(() => () => clearTimeout(locateTimer.current), [])

    const results = useMemo(() => {
        const k = keyword.trim().toLowerCase()
        const nearMe = located && location === NEAR_LABEL
        const loc = location.trim().toLowerCase().replace(/,\s*dhaka$/, '')
        const list = places.filter((p) => {
            if (category !== 'all' && p.category !== category) return false
            if (k && ![p.name, p.kind, ...p.tags].some((t) => t.toLowerCase().includes(k))) return false
            if (nearMe) return p.km <= NEAR_RADIUS_KM
            if (loc && !`${p.area} ${p.address}`.toLowerCase().includes(loc)) return false
            return true
        })
        return nearMe
            ? [...list].sort((a, b) => a.km - b.km)
            : [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    }, [keyword, category, location, located])

    const preview = results.slice(0, 5)
    const hasQuery = Boolean(keyword.trim() || category !== 'all' || location.trim())

    const locateMe = () => {
        if (locating) return
        clearTimeout(locateTimer.current)
        setLocating(true)
        setLocated(false)
        locateTimer.current = setTimeout(() => {
            setLocating(false)
            setLocated(true)
            setLocation(NEAR_LABEL)
        }, 1400)
    }

    const applySearch = (search) => {
        clearTimeout(locateTimer.current)
        setLocating(false)
        setKeyword(search.keyword)
        setCategory(search.category)
        setLocation(search.location)
        setLocated(search.location === NEAR_LABEL)
    }

    const clearAll = () => {
        applySearch({ keyword: '', category: 'all', location: '' })
        setLastSearch(null)
        keywordRef.current?.focus()
    }

    const onSubmit = (event) => {
        event.preventDefault()
        const search = { keyword: keyword.trim(), category, location: location.trim() }
        setLastSearch(search)
        if (!search.keyword && search.category === 'all' && !search.location) return
        setRecent((list) => {
            const label = describe(search).toLowerCase()
            const rest = list.filter((r) => describe(r).toLowerCase() !== label)
            return [{ ...search, id: `s-${Date.now()}` }, ...rest].slice(0, 5)
        })
    }

    const labelClass = 'flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500'
    const fieldClass = 'group/field relative flex flex-col justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-[#f97316] lg:rounded-none lg:border-0 lg:border-r lg:px-6 lg:py-4'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f97316]/15 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
                    <div>
                        <p className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f97316] text-white" aria-hidden="true">
                                <HiOutlineMapPin className="h-4 w-4" />
                            </span>
                            Localist
                            <span className="text-slate-400">/ Dhaka</span>
                        </p>
                        <h2 className="mt-6 text-4xl font-extrabold leading-[0.98] tracking-[-0.03em] text-[#0f172a] sm:text-6xl lg:text-7xl">
                            What are you{' '}
                            <span className="relative inline-block">
                                after
                                <svg
                                    viewBox="0 0 200 20"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-2 left-0 h-3 w-full text-[#f97316] sm:h-4"
                                    aria-hidden="true"
                                >
                                    <path d="M3 14 C 50 4, 120 4, 197 12" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                </svg>
                            </span>{' '}
                            today?
                        </h2>
                    </div>
                    <div className="max-w-sm text-sm leading-relaxed text-slate-600 lg:justify-self-end">
                        <p>
                            3,480 neighbourhood businesses across 64 Dhaka areas, checked by locals and
                            updated every Friday.
                        </p>
                        <dl className="mt-4 flex gap-6">
                            <div>
                                <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Reviews</dt>
                                <dd className="text-lg font-bold text-[#0f172a]">212k</dd>
                            </div>
                            <div>
                                <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">New this week</dt>
                                <dd className="text-lg font-bold text-[#f97316]">+46</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <form
                    role="search"
                    aria-label="Search Localist"
                    className="mt-10 grid gap-3 rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.45)] lg:mt-14 lg:grid-cols-[1.25fr_1fr_1.35fr_auto] lg:gap-0 lg:p-2"
                    onSubmit={onSubmit}
                >
                    <div className={fieldClass}>
                        <label htmlFor={`${uid}-keyword`} className={labelClass}>
                            <span className="text-[#f97316]">01</span> What
                        </label>
                        <div className="flex items-center gap-2">
                            <HiOutlineMagnifyingGlass className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                            <input
                                ref={keywordRef}
                                id={`${uid}-keyword`}
                                type="text"
                                value={keyword}
                                placeholder="burger, dentist, yoga…"
                                autoComplete="off"
                                className="min-h-10 w-full min-w-0 bg-transparent text-lg font-semibold text-[#0f172a] placeholder:font-normal placeholder:text-slate-400 focus:outline-none"
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={fieldClass}>
                        <label htmlFor={`${uid}-category`} className={labelClass}>
                            <span className="text-[#f97316]">02</span> Category
                        </label>
                        <div className="relative flex items-center gap-2">
                            <HiOutlineSquares2X2 className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                            <select
                                id={`${uid}-category`}
                                value={category}
                                className="min-h-10 w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-7 text-lg font-semibold text-[#0f172a] focus:outline-none"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                            <HiChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-slate-500" aria-hidden="true" />
                        </div>
                    </div>

                    <div className={fieldClass}>
                        <label htmlFor={`${uid}-location`} className={labelClass}>
                            <span className="text-[#f97316]">03</span> Where
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="relative grid h-5 w-5 shrink-0 place-items-center" aria-hidden="true">
                                {locating && !reduceMotion && (
                                    <motion.span
                                        className="absolute inset-0 rounded-full bg-[#f97316]/40"
                                        animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
                                    />
                                )}
                                <HiOutlineMapPin className={cn('relative h-5 w-5', located || locating ? 'text-[#f97316]' : 'text-slate-400')} />
                            </span>
                            <input
                                id={`${uid}-location`}
                                type="text"
                                value={location}
                                placeholder={locating ? 'Locating…' : 'Area, e.g. Banani'}
                                autoComplete="off"
                                className="min-h-10 min-w-[10rem] flex-1 bg-transparent text-lg font-semibold text-[#0f172a] placeholder:font-normal placeholder:text-slate-400 focus:outline-none"
                                onChange={(e) => {
                                    setLocation(e.target.value)
                                    setLocated(false)
                                }}
                            />
                            <button
                                type="button"
                                aria-busy={locating}
                                className={cn(
                                    'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]',
                                    located
                                        ? 'border-[#f97316] bg-[#fff7ed] text-[#c2410c]'
                                        : 'border-slate-200 text-slate-700 hover:border-[#f97316] hover:text-[#c2410c]',
                                )}
                                onClick={locateMe}
                            >
                                <TbCurrentLocation className={cn('h-4 w-4', locating && !reduceMotion && 'animate-spin')} aria-hidden="true" />
                                {locating ? 'Locating…' : located ? 'Located' : 'Use my location'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-stretch lg:pl-2">
                        <button
                            type="submit"
                            className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-[20px] bg-[#f97316] px-7 text-base font-bold text-white shadow-[0_14px_30px_-12px_rgba(249,115,22,0.8)] transition-colors hover:bg-[#ea580c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f172a] lg:w-auto"
                        >
                            Search
                            <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </button>
                    </div>
                </form>

                <p className="sr-only" aria-live="polite">
                    {locating ? 'Finding your location…' : located && location === NEAR_LABEL ? `Location set to ${NEAR_LABEL}` : ''}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        <HiOutlineClock className="h-4 w-4" aria-hidden="true" />
                        Recent
                    </span>
                    {recent.length === 0 && <span className="text-sm text-slate-400">No recent searches</span>}
                    <AnimatePresence initial={false}>
                        {recent.map((r) => (
                            <motion.span
                                key={r.id}
                                layout={!reduceMotion}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="inline-flex items-center rounded-full border border-slate-200 bg-white text-sm text-slate-700"
                            >
                                <button
                                    type="button"
                                    className="min-h-10 rounded-l-full pl-4 pr-2 font-medium hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                                    onClick={() => applySearch(r)}
                                >
                                    {describe(r)}
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Remove recent search ${describe(r)}`}
                                    className="grid h-10 w-9 place-items-center rounded-r-full text-slate-400 hover:text-[#0f172a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                                    onClick={() => setRecent((list) => list.filter((x) => x.id !== r.id))}
                                >
                                    <HiXMark className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>

                <div id="localist-results" className="mt-10 rounded-[28px] bg-slate-50 p-4 ring-1 ring-slate-200/70 sm:p-6 lg:p-8">
                    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f97316]">Live preview</p>
                            <h3 className="mt-1 text-xl font-bold text-[#0f172a] sm:text-2xl" aria-live="polite">
                                {results.length} {results.length === 1 ? 'place' : 'places'}
                                <span className="font-normal text-slate-500"> of {places.length}</span>
                            </h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span>{located && location === NEAR_LABEL ? `Nearest first · within ${NEAR_RADIUS_KM} km` : 'Highest rated first'}</span>
                            {hasQuery && (
                                <button
                                    type="button"
                                    className="min-h-10 rounded-full px-3 font-semibold text-[#0f172a] underline decoration-[#f97316] decoration-2 underline-offset-4 hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-[#f97316]"
                                    onClick={clearAll}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {lastSearch && (
                        <p className="mt-4 text-sm text-slate-600">
                            You searched for <strong className="font-semibold text-[#0f172a]">{describe(lastSearch)}</strong>
                            {lastSearch.category !== 'all' && lastSearch.keyword ? ` in ${categoryLabel(lastSearch.category)}` : ''}.
                        </p>
                    )}

                    {results.length === 0 ? (
                        <div className="flex flex-col items-center px-4 py-14 text-center">
                            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-[#f97316] shadow-sm ring-1 ring-slate-200" aria-hidden="true">
                                <HiOutlineMagnifyingGlass className="h-7 w-7" />
                            </span>
                            <p className="mt-5 text-lg font-bold text-[#0f172a]">Nothing on Localist matches that yet</p>
                            <p className="mt-2 max-w-md text-sm text-slate-600">
                                Try a broader word like “coffee”, switch to “All categories” or search a
                                nearby area such as Banani or Gulshan 1.
                            </p>
                            <button
                                type="button"
                                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0f172a] px-6 text-sm font-semibold text-white hover:bg-[#1e293b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                                onClick={clearAll}
                            >
                                Clear all fields
                            </button>
                        </div>
                    ) : (
                        <ul className="mt-2 divide-y divide-slate-200">
                            <AnimatePresence initial={false} mode="popLayout">
                                {preview.map((p) => (
                                    <motion.li
                                        key={p.id}
                                        layout={!reduceMotion}
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.28 }}
                                    >
                                        <a
                                            href={`#localist-${p.id}`}
                                            className="group -mx-2 flex items-center gap-4 rounded-2xl px-2 py-3 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[#f97316]"
                                        >
                                            <img
                                                src={p.image}
                                                alt={p.alt}
                                                loading="lazy"
                                                className="aspect-square h-16 w-16 shrink-0 rounded-2xl object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                                    <p className="truncate text-base font-bold text-[#0f172a] group-hover:text-[#c2410c]">{p.name}</p>
                                                    <span className="inline-flex items-center gap-0.5 rounded-md bg-[#0f172a] px-1.5 py-0.5 text-xs font-bold text-white">
                                                        <HiStar className="h-3 w-3 text-[#fdba74]" aria-hidden="true" />
                                                        {p.rating.toFixed(1)}
                                                    </span>
                                                    <span className="text-xs text-slate-500">({p.reviews.toLocaleString('en-US')})</span>
                                                </div>
                                                <p className="mt-0.5 truncate text-sm text-slate-600">
                                                    {p.kind} · {p.price} · {p.area}
                                                    <span className="hidden sm:inline"> · {p.address}</span>
                                                </p>
                                                <p className={cn('mt-1 text-xs font-semibold', p.open ? 'text-emerald-700' : 'text-slate-500')}>
                                                    {p.status}
                                                </p>
                                            </div>
                                            {located && location === NEAR_LABEL && (
                                                <span className="shrink-0 rounded-full bg-[#fff7ed] px-2.5 py-1 text-xs font-bold text-[#c2410c]">
                                                    {p.km} km
                                                </span>
                                            )}
                                        </a>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    )}

                    {results.length > preview.length && (
                        <a
                            href="#localist-results"
                            className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#0f172a] hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f97316]"
                        >
                            See all {results.length} results
                            <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                    )}
                </div>
            </div>
        </section>
    )
}

export default TripleFieldSearchBar

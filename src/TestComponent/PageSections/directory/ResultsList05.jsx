// SponsoredSplitResultsList

// ResultsList05 · Directories & Search Aggregators › Aggregated Results List

// Description:
// A split results page for the aggregator Callout answering "late-night food in
// Dhanmondi" under the heading "Still hungry at 1 am?". A clearly labelled "Sponsored"
// venue (Nocturne Kitchen & Bar, with a "Why this ad?" note and a "Reserve a table" CTA)
// sits apart from 15 organic results, each carrying a "Results from 4 sources" rating
// breakdown, with Prev / 1 2 3 / Next pagination. Use it for search results that mix paid
// and organic listings.

// Design:
// - Deep violet #2e1065 section with a pink #f472b6 glow, violet-100 text; sans display
//   heading (text-4xl → lg:6xl) with the query shown as a pink-outlined search pill
// - Sponsored card: 4:3 photo, pink "Sponsored" tag, dashed pink offer ticket, white CTA;
//   organic rows: white/4% rounded-2xl panels with big mono ranks, pink stars and moon
//   icon
// - Source breakdown: four mini cards (Callout, MapNotes, Tablehop, Grubgram) with
//   rating, review count and a pink share bar; pagination uses 44px rounded-xl buttons
// - Motion: result pages crossfade/slide, breakdowns expand with height; MotionConfig
//   reducedMotion="user" removes the movement
// - Responsive: stacked on mobile (ad first, then results); lg:grid-cols-[380px_1fr]
//   split with the ad sticky; toolbar and rows wrap, source cards 2 → sm:4 columns

// What it does:
// - Toggles "Open past 2 am", "Veg-friendly" and "Budget ৳" plus a sort select (Best
//   match, Highest rated, Most reviewed, Open latest) filter/sort the local array; the
//   page resets to 1 and "Showing 1–5 of 15" updates live; an empty state offers "Reset
//   filters"
// - Pagination (5 per page) uses aria-current="page"; changing page scrolls the results
//   top back into view if it is above the viewport (smooth unless reduced motion)
// - "Results from 4 sources" (on every result and the ad) toggles a breakdown
//   (aria-expanded); "Why this ad?" opens a note that closes on Escape or outside click
// - Names link to #callout-<id>; "Reserve a table" → #callout-nocturne-reserve and "Menu"
//   → #callout-nocturne-menu

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SponsoredSplitResultsList from '@/TestComponent/PageSections/directory/ResultsList05';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <SponsoredSplitResultsList />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowUpRight,
    HiChevronDown,
    HiChevronLeft,
    HiChevronRight,
    HiMiniStar,
    HiOutlineArrowPath,
    HiOutlineInformationCircle,
    HiOutlineMagnifyingGlass,
    HiOutlineMegaphone,
    HiOutlineMoon,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const PAGE_SIZE = 5
const SOURCES = ['Callout', 'MapNotes', 'Tablehop', 'Grubgram']
const SHARES = [0.41, 0.28, 0.19, 0.12]
const OFFSETS = [
    [0, -0.1, 0.1, -0.2],
    [0.1, -0.2, 0, 0.1],
    [-0.1, 0.1, -0.1, 0],
]

const raw = [
    { id: 'halim-corner', name: 'Halim Corner', cuisine: 'Street food', area: 'Mirpur Rd', rating: 4.7, reviews: 3812, closes: 'Open until 3 am', closeHour: 27, price: 1, veg: false },
    { id: 'chullah-grill', name: 'Chullah Night Grill', cuisine: 'BBQ & kebabs', area: 'Road 2', rating: 4.6, reviews: 2904, closes: 'Open until 3 am', closeHour: 27, price: 2, veg: false },
    { id: 'kathi-house', name: 'Kolkata Kathi House', cuisine: 'Kathi rolls', area: 'Road 4', rating: 4.6, reviews: 1977, closes: 'Open until 1 am', closeHour: 25, price: 1, veg: true },
    { id: 'tehari-lane', name: 'Tehari Lane', cuisine: 'Old Dhaka tehari', area: 'Road 8', rating: 4.5, reviews: 2488, closes: 'Open until 1 am', closeHour: 25, price: 1, veg: false },
    { id: 'ember-pizza', name: 'Ember Pizza Co.', cuisine: 'Wood-fired pizza', area: 'Road 16', rating: 4.5, reviews: 1356, closes: 'Open until 2 am', closeHour: 26, price: 2, veg: true },
    { id: 'nihari-1971', name: 'Nihari House 1971', cuisine: 'Mughlai', area: 'Road 15', rating: 4.5, reviews: 1640, closes: 'Open until 2 am', closeHour: 26, price: 2, veg: false },
    { id: 'moonrise-ramen', name: 'Moonrise Ramen Bar', cuisine: 'Japanese', area: 'Road 11', rating: 4.4, reviews: 988, closes: 'Open until 1:30 am', closeHour: 25.5, price: 3, veg: true },
    { id: 'sugar-rush', name: 'Sugar Rush Desserts', cuisine: 'Desserts & shakes', area: 'Road 7', rating: 4.4, reviews: 1120, closes: 'Open until 1 am', closeHour: 25, price: 2, veg: true },
    { id: 'bhoj-24', name: 'Bhoj 24', cuisine: 'Bengali home-style', area: 'Satmasjid Rd', rating: 4.3, reviews: 2210, closes: 'Open 24 hours', closeHour: 48, price: 2, veg: true },
    { id: 'pho-night', name: 'Pho Night Market', cuisine: 'Vietnamese', area: 'Road 9A', rating: 4.3, reviews: 642, closes: 'Open until 1 am', closeHour: 25, price: 2, veg: true },
    { id: 'chaap-chaap', name: 'Chaap Chaap', cuisine: 'Kolkata-style chaap', area: 'Road 27', rating: 4.2, reviews: 1433, closes: 'Open until 1 am', closeHour: 25, price: 1, veg: false },
    { id: 'green-chilli', name: 'Green Chilli Vegan', cuisine: 'Vegan bowls', area: 'Road 10', rating: 4.2, reviews: 511, closes: 'Open until 12:30 am', closeHour: 24.5, price: 2, veg: true },
    { id: 'late-plate', name: 'Late Plate Diner', cuisine: 'Burgers & shakes', area: 'Road 12A', rating: 4.1, reviews: 1874, closes: 'Open until 2:30 am', closeHour: 26.5, price: 2, veg: false },
    { id: 'saltwater-shack', name: 'Saltwater Shack', cuisine: 'Seafood', area: 'Road 32', rating: 4.0, reviews: 734, closes: 'Open until 1 am', closeHour: 25, price: 3, veg: false },
    { id: 'dragon-wok', name: 'Dragon Wok Express', cuisine: 'Chinese', area: 'Road 3', rating: 3.9, reviews: 1092, closes: 'Open until midnight', closeHour: 24, price: 1, veg: true },
]

const withSources = (item, i) => {
    const offsets = OFFSETS[i % OFFSETS.length]
    let used = 0
    const sources = SOURCES.map((name, s) => {
        const count = s === SOURCES.length - 1 ? item.reviews - used : Math.round(item.reviews * SHARES[s])
        used += count
        const rating = Math.min(5, Math.max(1, item.rating + offsets[s]))
        return { name, count, rating: rating.toFixed(1), share: count / item.reviews }
    })
    return { ...item, match: i, sources }
}

const results = raw.map(withSources)

const sponsored = withSources(
    { id: 'nocturne', name: 'Nocturne Kitchen & Bar', cuisine: 'Modern Bengali', area: 'Road 27', rating: 4.7, reviews: 2940 },
    1,
)

const sortOptions = [
    { id: 'match', label: 'Best match', fn: (a, b) => a.match - b.match },
    { id: 'rating', label: 'Highest rated', fn: (a, b) => b.rating - a.rating || b.reviews - a.reviews },
    { id: 'reviews', label: 'Most reviewed', fn: (a, b) => b.reviews - a.reviews },
    { id: 'late', label: 'Open latest', fn: (a, b) => b.closeHour - a.closeHour || a.match - b.match },
]

const filterDefs = [
    { id: 'late', label: 'Open past 2 am', test: (r) => r.closeHour >= 26 },
    { id: 'veg', label: 'Veg-friendly', test: (r) => r.veg },
    { id: 'budget', label: 'Budget ৳', test: (r) => r.price === 1 },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f472b6]'

function SourceBreakdown({ sources, id }) {
    return (
        <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
        >
            <ul className="grid grid-cols-2 gap-2 pt-4 sm:grid-cols-4">
                {sources.map((source) => (
                    <li key={source.name} className="rounded-xl border border-white/10 bg-[#1e0a45]/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">{source.name}</p>
                        <p className="mt-1 flex items-baseline gap-1.5 text-white">
                            <span className="text-lg font-semibold tabular-nums">{source.rating}</span>
                            <span className="text-xs text-violet-300">{source.count.toLocaleString('en-US')} reviews</span>
                        </p>
                        <span aria-hidden="true" className="mt-2 block h-1 overflow-hidden rounded-full bg-white/10">
                            <span className="block h-full rounded-full bg-[#f472b6]" style={{ width: `${Math.round(source.share * 100)}%` }} />
                        </span>
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}

function ResultRow({ item, rank, expanded, onToggle }) {
    const panelId = useId()
    return (
        <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-white/20 sm:p-5">
            <div className="flex gap-4 sm:gap-5">
                <span className="w-9 shrink-0 pt-0.5 font-mono text-2xl font-semibold leading-none text-[#f472b6]/70 sm:w-11 sm:text-3xl">
                    {String(rank).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
                                <a href={`#callout-${item.id}`} className={cn('rounded hover:text-[#f9a8d4]', focusRing)}>
                                    {item.name}
                                </a>
                            </h3>
                            <p className="mt-0.5 text-sm text-violet-200/80">
                                {item.cuisine} · {item.area} · <span className="text-white">{'৳'.repeat(item.price)}</span>
                                <span className="text-violet-200/35">{'৳'.repeat(3 - item.price)}</span>
                                {item.veg ? <span className="ml-2 rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">Veg-friendly</span> : null}
                            </p>
                        </div>
                        <p className="inline-flex shrink-0 items-center gap-1.5 text-sm text-violet-100">
                            <HiMiniStar aria-hidden="true" className="text-[#f472b6]" />
                            <span className="font-semibold text-white">{item.rating.toFixed(1)}</span>
                            <span className="sr-only">out of 5 from</span>
                            <span className="text-violet-300">({item.reviews.toLocaleString('en-US')})</span>
                        </p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <p className="inline-flex items-center gap-1.5 text-sm text-violet-100">
                            <HiOutlineMoon aria-hidden="true" className="text-[#f472b6]" />
                            {item.closes}
                        </p>
                        <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={panelId}
                            onClick={onToggle}
                            className={cn(
                                'inline-flex min-h-10 items-center gap-2 rounded-full border border-dashed border-[#f472b6]/50 px-3.5 text-xs font-semibold text-[#f9a8d4] transition-colors hover:border-[#f472b6] hover:bg-[#f472b6]/10',
                                focusRing,
                            )}
                        >
                            <span className="flex -space-x-1" aria-hidden="true">
                                {['bg-[#f472b6]', 'bg-violet-300', 'bg-white', 'bg-fuchsia-500'].map((tone) => (
                                    <span key={tone} className={cn('h-2.5 w-2.5 rounded-full ring-2 ring-[#2e1065]', tone)} />
                                ))}
                            </span>
                            Results from {item.sources.length} sources
                            <HiChevronDown
                                aria-hidden="true"
                                className={cn('transition-transform duration-300', expanded && 'rotate-180')}
                            />
                        </button>
                    </div>
                    <AnimatePresence initial={false}>
                        {expanded ? <SourceBreakdown key="panel" id={panelId} sources={item.sources} /> : null}
                    </AnimatePresence>
                </div>
            </div>
        </li>
    )
}

export function SponsoredSplitResultsList({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [active, setActive] = useState([])
    const [sort, setSort] = useState('match')
    const [page, setPage] = useState(1)
    const [expandedId, setExpandedId] = useState(null)
    const [adInfo, setAdInfo] = useState(false)
    const [adExpanded, setAdExpanded] = useState(false)
    const listTopRef = useRef(null)
    const adInfoRef = useRef(null)
    const sortId = useId()
    const adNoteId = useId()
    const adPanelId = useId()
    const reduce = useReducedMotion()

    const filtered = useMemo(() => {
        const sorter = sortOptions.find((option) => option.id === sort).fn
        return results
            .filter((item) => active.every((id) => filterDefs.find((f) => f.id === id).test(item)))
            .sort(sorter)
    }, [active, sort])

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const current = Math.min(page, pageCount)
    const start = (current - 1) * PAGE_SIZE
    const pageItems = filtered.slice(start, start + PAGE_SIZE)

    useEffect(() => {
        if (!adInfo) return undefined
        const onKey = (event) => {
            if (event.key === 'Escape') setAdInfo(false)
        }
        const onPointer = (event) => {
            if (adInfoRef.current && !adInfoRef.current.contains(event.target)) setAdInfo(false)
        }
        document.addEventListener('keydown', onKey)
        document.addEventListener('pointerdown', onPointer)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.removeEventListener('pointerdown', onPointer)
        }
    }, [adInfo])

    const toggleFilter = (id) => {
        setActive((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
        setPage(1)
    }

    const goToPage = (next) => {
        if (next < 1 || next > pageCount || next === current) return
        setPage(next)
        setExpandedId(null)
        const top = listTopRef.current
        if (top && top.getBoundingClientRect().top < 0) {
            top.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
        }
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#2e1065] px-4 py-14 text-base font-normal text-violet-100 sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-40 top-24 -z-10 h-[460px] w-[460px] rounded-full bg-[#f472b6]/20 blur-[120px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-[420px] w-[520px] rounded-full bg-violet-500/25 blur-[120px]"
            />
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f472b6] text-[#2e1065]">
                                    <HiOutlineMegaphone aria-hidden="true" />
                                </span>
                                Callout
                            </p>
                            <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                                Still hungry at 1 am?
                            </h2>
                            <p className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#f472b6]/60 bg-white/5 py-2 pl-3 pr-4 text-sm text-white">
                                <HiOutlineMagnifyingGlass aria-hidden="true" className="shrink-0 text-[#f472b6]" />
                                <span className="truncate">
                                    late-night food <span className="text-violet-300">in</span> Dhanmondi
                                </span>
                            </p>
                        </div>
                        <p className="max-w-sm text-sm leading-6 text-violet-200/80">
                            We merged ratings from Callout, MapNotes, Tablehop and Grubgram so you don’t have to open
                            four apps at midnight.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-10">
                        <aside aria-label="Sponsored result" className="lg:sticky lg:top-6 lg:self-start">
                            <article className="overflow-hidden rounded-[26px] border border-[#f472b6]/40 bg-[#3b0f7a] shadow-[0_30px_80px_-30px_rgba(244,114,182,0.45)]">
                                <div className="relative aspect-[4/3] bg-[#1e0a45]">
                                    <img
                                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
                                        alt="A dark, moody restaurant dining room with warm pendant lights"
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-[#3b0f7a] via-transparent to-transparent" />
                                    <div ref={adInfoRef} className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
                                        <span className="rounded-full bg-[#f472b6] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#2e1065]">
                                            Sponsored
                                        </span>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                aria-expanded={adInfo}
                                                aria-controls={adNoteId}
                                                onClick={() => setAdInfo((v) => !v)}
                                                className={cn(
                                                    'inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#2e1065]/80 px-3 text-xs font-medium text-white backdrop-blur hover:bg-[#2e1065]',
                                                    focusRing,
                                                )}
                                            >
                                                <HiOutlineInformationCircle aria-hidden="true" className="text-sm" />
                                                Why this ad?
                                            </button>
                                            <AnimatePresence>
                                                {adInfo ? (
                                                    <motion.div
                                                        id={adNoteId}
                                                        initial={{ opacity: 0, y: -6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -6 }}
                                                        className="absolute right-0 top-[calc(100%+8px)] z-10 w-64 max-w-[calc(100vw-4rem)] rounded-2xl bg-white p-4 text-sm leading-6 text-[#2e1065] shadow-xl"
                                                    >
                                                        Nocturne paid to appear first for “late-night food” in Dhanmondi.
                                                        Ads never change the order of the results beside it.
                                                    </motion.div>
                                                ) : null}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 sm:p-6">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f9a8d4]">
                                        {sponsored.cuisine} · {sponsored.area}
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                        {sponsored.name}
                                    </h3>
                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                        <span className="inline-flex items-center gap-1.5">
                                            <HiMiniStar aria-hidden="true" className="text-[#f472b6]" />
                                            <span className="font-semibold text-white">{sponsored.rating.toFixed(1)}</span>
                                            <span className="text-violet-300">({sponsored.reviews.toLocaleString('en-US')})</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <HiOutlineMoon aria-hidden="true" className="text-[#f472b6]" />
                                            Open until 2 am
                                        </span>
                                    </div>
                                    <div className="mt-5 rounded-2xl border-2 border-dashed border-[#f472b6]/60 px-4 py-3">
                                        <p className="text-sm font-semibold text-white">20% off after 11 pm</p>
                                        <p className="mt-0.5 text-xs text-violet-200">
                                            Show code <span className="font-mono font-semibold text-[#f9a8d4]">NIGHTOWL</span> ·
                                            Sun–Thu until 31 Oct
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        aria-expanded={adExpanded}
                                        aria-controls={adPanelId}
                                        onClick={() => setAdExpanded((v) => !v)}
                                        className={cn(
                                            'mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-full text-xs font-semibold text-[#f9a8d4] hover:text-white',
                                            focusRing,
                                        )}
                                    >
                                        Results from {sponsored.sources.length} sources
                                        <HiChevronDown
                                            aria-hidden="true"
                                            className={cn('transition-transform duration-300', adExpanded && 'rotate-180')}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {adExpanded ? (
                                            <SourceBreakdown key="ad-panel" id={adPanelId} sources={sponsored.sources} />
                                        ) : null}
                                    </AnimatePresence>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <a
                                            href="#callout-nocturne-reserve"
                                            className={cn(
                                                'inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#2e1065] transition-colors hover:bg-[#f9a8d4]',
                                                focusRing,
                                            )}
                                        >
                                            Reserve a table
                                            <HiArrowUpRight aria-hidden="true" />
                                        </a>
                                        <a
                                            href="#callout-nocturne-menu"
                                            className={cn(
                                                'inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white hover:border-white',
                                                focusRing,
                                            )}
                                        >
                                            Menu
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </aside>

                        <div ref={listTopRef} className="scroll-mt-6">
                            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 xl:flex-row xl:items-center xl:justify-between">
                                <div role="group" aria-label="Filter results" className="flex flex-wrap gap-2">
                                    {filterDefs.map((filter) => {
                                        const on = active.includes(filter.id)
                                        return (
                                            <button
                                                key={filter.id}
                                                type="button"
                                                aria-pressed={on}
                                                onClick={() => toggleFilter(filter.id)}
                                                className={cn(
                                                    'inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors',
                                                    on
                                                        ? 'border-[#f472b6] bg-[#f472b6] text-[#2e1065]'
                                                        : 'border-white/20 text-violet-100 hover:border-white/50',
                                                    focusRing,
                                                )}
                                            >
                                                {filter.label}
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor={sortId} className="text-sm text-violet-300">
                                        Sort
                                    </label>
                                    <div className="relative">
                                        <select
                                            id={sortId}
                                            value={sort}
                                            onChange={(event) => {
                                                setSort(event.target.value)
                                                setPage(1)
                                            }}
                                            className={cn(
                                                'min-h-10 cursor-pointer appearance-none rounded-full border border-white/20 bg-[#3b0f7a] py-2 pl-4 pr-9 text-sm font-semibold text-white',
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
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-violet-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-baseline justify-between gap-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">Organic results</p>
                                <p aria-live="polite" aria-atomic="true" className="text-sm text-violet-200">
                                    {filtered.length ? (
                                        <>
                                            Showing{' '}
                                            <span className="font-semibold text-white">
                                                {start + 1}–{start + pageItems.length}
                                            </span>{' '}
                                            of {filtered.length}
                                        </>
                                    ) : (
                                        'No results'
                                    )}
                                </p>
                            </div>

                            {filtered.length ? (
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.ol
                                        key={`${current}-${sort}-${active.join('.')}`}
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -24 }}
                                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                        className="mt-4 space-y-3"
                                    >
                                        {pageItems.map((item, i) => (
                                            <ResultRow
                                                key={item.id}
                                                item={item}
                                                rank={start + i + 1}
                                                expanded={expandedId === item.id}
                                                onToggle={() => setExpandedId((id) => (id === item.id ? null : item.id))}
                                            />
                                        ))}
                                    </motion.ol>
                                </AnimatePresence>
                            ) : (
                                <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-white/20 px-6 py-16 text-center">
                                    <HiOutlineMoon aria-hidden="true" className="text-4xl text-[#f472b6]" />
                                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                                        Nothing that late, that cheap and veg-friendly
                                    </h3>
                                    <p className="mt-2 max-w-sm text-sm leading-6 text-violet-200">
                                        None of the 15 places tick every box. Drop a filter to widen the net.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActive([])
                                            setPage(1)
                                        }}
                                        className={cn(
                                            'mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f472b6] px-5 text-sm font-semibold text-[#2e1065] hover:bg-[#f9a8d4]',
                                            focusRing,
                                        )}
                                    >
                                        <HiOutlineArrowPath aria-hidden="true" />
                                        Reset filters
                                    </button>
                                </div>
                            )}

                            {filtered.length ? (
                                <nav aria-label="Results pages" className="mt-8 flex items-center justify-between gap-2 sm:justify-center">
                                    <button
                                        type="button"
                                        onClick={() => goToPage(current - 1)}
                                        disabled={current === 1}
                                        className={cn(
                                            'inline-flex h-11 items-center gap-1 rounded-xl border border-white/20 px-3 text-sm font-semibold text-white transition-colors hover:border-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/20 sm:px-4',
                                            focusRing,
                                        )}
                                    >
                                        <HiChevronLeft aria-hidden="true" />
                                        Prev
                                    </button>
                                    <ul className="flex items-center gap-1.5">
                                        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                                            <li key={n}>
                                                <button
                                                    type="button"
                                                    aria-label={`Page ${n}`}
                                                    aria-current={n === current ? 'page' : undefined}
                                                    onClick={() => goToPage(n)}
                                                    className={cn(
                                                        'grid h-11 w-11 place-items-center rounded-xl font-mono text-sm font-semibold transition-colors',
                                                        n === current
                                                            ? 'bg-[#f472b6] text-[#2e1065]'
                                                            : 'text-violet-100 hover:bg-white/10',
                                                        focusRing,
                                                    )}
                                                >
                                                    {n}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        type="button"
                                        onClick={() => goToPage(current + 1)}
                                        disabled={current === pageCount}
                                        className={cn(
                                            'inline-flex h-11 items-center gap-1 rounded-xl border border-white/20 px-3 text-sm font-semibold text-white transition-colors hover:border-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/20 sm:px-4',
                                            focusRing,
                                        )}
                                    >
                                        Next
                                        <HiChevronRight aria-hidden="true" />
                                    </button>
                                </nav>
                            ) : null}
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default SponsoredSplitResultsList

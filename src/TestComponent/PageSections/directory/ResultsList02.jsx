// SortableTableResultsList

// ResultsList02 · Directories & Search Aggregators › Aggregated Results List

// Description:
// A dense "league table" of the best-reviewed businesses in Dhanmondi for Yardstick
// Reviews, titled "Dhanmondi's best-reviewed, measured." Twelve local businesses
// (dentist, bakery, gym, vet, bookshop…) are listed with Name, Category, Rating, Reviews
// and Distance; every header re-sorts the table and a filter box narrows it. Use it for
// review aggregators, "best of" rankings or any comparison-heavy directory page.

// Design:
// - White section, slate #0f172a ink, emerald #059669 accents; an emerald ruler-tick
//   strip on top, mono uppercase eyebrow/headers and a big tight sans heading (text-4xl →
//   lg:6xl)
// - Table: table-fixed, hairline slate-100 rows, tabular numerals, monogram tiles (lg),
//   five-segment rating bars, "+24 this month" review deltas and an emerald-tinted sorted
//   column
// - Top-3 ranks sit in emerald discs; verified businesses carry an emerald check badge
// - Motion: rows glide to their new position on sort/filter (framer-motion
//   layout="position"); MotionConfig reducedMotion="user" turns the glide off
// - Responsive: below md the table collapses into ranked cards with a sort <select> and a
//   3-stat row; toolbar stacks on mobile and aligns in one row from sm

// What it does:
// - Header buttons sort by a column (text A–Z, numbers high→low, distance near→far); a
//   second click flips the direction; th elements expose aria-sort
// - The filter box (name, category or road) and a "Verified only" toggle filter the local
//   array; a live "Showing 9 of 12" count, an empty state and a "Reset" button update
//   instantly
// - Names link to #yardstick-<id>; "Methodology" → #yardstick-methodology and "Download
//   CSV" → #yardstick-dhanmondi-csv (no download happens)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SortableTableResultsList from '@/TestComponent/PageSections/directory/ResultsList02';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <SortableTableResultsList />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import {
    HiArrowUpRight,
    HiCheckBadge,
    HiChevronDown,
    HiChevronUp,
    HiChevronUpDown,
    HiOutlineArrowPath,
    HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const businesses = [
    { id: 'lakeview-dental', name: 'Lakeview Dental Studio', category: 'Dentist', area: 'Road 8A', rating: 4.9, reviews: 812, recent: 24, distance: 1.2, verified: true },
    { id: 'bluebell-vet', name: 'Bluebell Veterinary Clinic', category: 'Vet', area: 'Road 15', rating: 4.9, reviews: 438, recent: 17, distance: 3.1, verified: true },
    { id: 'paperboat-books', name: 'Paperboat Books', category: 'Bookshop', area: 'Road 4', rating: 4.8, reviews: 604, recent: 12, distance: 1.9, verified: true },
    { id: 'kinship-kids', name: 'Kinship Kids Clinic', category: 'Paediatrician', area: 'Road 11', rating: 4.8, reviews: 1126, recent: 31, distance: 1.7, verified: true },
    { id: 'rooftop-tandoor', name: 'Rooftop Tandoor House', category: 'Restaurant', area: 'Road 27', rating: 4.7, reviews: 3412, recent: 96, distance: 0.8, verified: true },
    { id: 'greenwheel', name: 'Greenwheel Cycle Works', category: 'Bike repair', area: 'Road 9A', rating: 4.7, reviews: 289, recent: 9, distance: 2.8, verified: false },
    { id: 'morning-loaf', name: 'Morning Loaf Bakery', category: 'Bakery', area: 'Road 12', rating: 4.6, reviews: 1540, recent: 44, distance: 1.5, verified: true },
    { id: 'ironbark', name: 'Ironbark Fitness Club', category: 'Gym', area: 'Satmasjid Rd', rating: 4.5, reviews: 1967, recent: 58, distance: 0.5, verified: true },
    { id: 'studio-kesh', name: 'Studio Kesh Salon', category: 'Salon', area: 'Road 2', rating: 4.4, reviews: 973, recent: 21, distance: 2.4, verified: false },
    { id: 'crescent-pharmacy', name: 'Crescent Pharmacy 24/7', category: 'Pharmacy', area: 'Mirpur Rd', rating: 4.3, reviews: 2288, recent: 63, distance: 0.3, verified: true },
    { id: 'chai-adda', name: 'Chai Adda Corner', category: 'Café', area: 'Road 32', rating: 4.2, reviews: 4105, recent: 138, distance: 0.2, verified: false },
    { id: 'tailor-thread', name: 'Tailor & Thread', category: 'Tailor', area: 'Road 6', rating: 4.1, reviews: 522, recent: 6, distance: 2.2, verified: false },
]

const columns = [
    { key: 'name', label: 'Name', defaultDir: 'asc', asc: 'A–Z', desc: 'Z–A' },
    { key: 'category', label: 'Category', defaultDir: 'asc', asc: 'A–Z', desc: 'Z–A' },
    { key: 'rating', label: 'Rating', defaultDir: 'desc', asc: 'low to high', desc: 'high to low' },
    { key: 'reviews', label: 'Reviews', defaultDir: 'desc', asc: 'fewest first', desc: 'most first' },
    { key: 'distance', label: 'Distance', defaultDir: 'asc', asc: 'nearest first', desc: 'farthest first' },
]

const DEFAULT_SORT = { key: 'rating', dir: 'desc' }

const monogramTones = ['bg-[#059669] text-white', 'bg-[#064e3b] text-[#a7f3d0]', 'bg-[#d1fae5] text-[#064e3b]', 'bg-[#0f172a] text-[#6ee7b7]']

const totalReviews = businesses.reduce((sum, item) => sum + item.reviews, 0)

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]'

const initials = (name) =>
    name
        .split(' ')
        .filter((word) => /^[A-Z]/.test(word))
        .slice(0, 2)
        .map((word) => word[0])
        .join('')

function compare(a, b, key) {
    const x = a[key]
    const y = b[key]
    if (typeof x === 'string') return x.localeCompare(y)
    return x - y
}

function RatingBars({ rating }) {
    return (
        <span aria-hidden="true" className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="relative h-1.5 w-3 overflow-hidden rounded-full bg-slate-200">
                    <span
                        className="absolute inset-y-0 left-0 rounded-full bg-[#059669]"
                        style={{ width: `${Math.max(0, Math.min(1, rating - i)) * 100}%` }}
                    />
                </span>
            ))}
        </span>
    )
}

function RankBadge({ rank }) {
    return (
        <span
            className={cn(
                'grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold tabular-nums',
                rank <= 3 ? 'bg-[#059669] text-white' : 'bg-slate-100 text-slate-600',
            )}
        >
            {rank}
        </span>
    )
}

function SortIcon({ active, dir }) {
    if (!active) return <HiChevronUpDown aria-hidden="true" className="text-sm text-slate-300 group-hover:text-slate-500" />
    return dir === 'asc' ? (
        <HiChevronUp aria-hidden="true" className="text-sm text-[#059669]" />
    ) : (
        <HiChevronDown aria-hidden="true" className="text-sm text-[#059669]" />
    )
}

export function SortableTableResultsList({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [sort, setSort] = useState(DEFAULT_SORT)
    const [query, setQuery] = useState('')
    const [verifiedOnly, setVerifiedOnly] = useState(false)
    const filterId = useId()
    const sortId = useId()

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase()
        const factor = sort.dir === 'asc' ? 1 : -1
        return businesses
            .filter((item) => !verifiedOnly || item.verified)
            .filter((item) => !q || `${item.name} ${item.category} ${item.area}`.toLowerCase().includes(q))
            .sort((a, b) => factor * compare(a, b, sort.key) || a.name.localeCompare(b.name))
    }, [query, verifiedOnly, sort])

    const changed = query || verifiedOnly || sort.key !== DEFAULT_SORT.key || sort.dir !== DEFAULT_SORT.dir

    const sortBy = (key) => {
        setSort((current) => {
            if (current.key === key) return { key, dir: current.dir === 'asc' ? 'desc' : 'asc' }
            return { key, dir: columns.find((column) => column.key === key).defaultDir }
        })
    }

    const reset = () => {
        setSort(DEFAULT_SORT)
        setQuery('')
        setVerifiedOnly(false)
    }

    const cellTone = (key) => (sort.key === key ? 'bg-[#ecfdf5]/70' : '')
    const activeColumn = columns.find((column) => column.key === sort.key)

    const emptyState = (
        <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ecfdf5] text-xl text-[#059669]">
                <HiOutlineMagnifyingGlass aria-hidden="true" />
            </span>
            <p className="mt-4 text-lg font-semibold text-slate-900">
                No businesses match{query ? ` “${query.trim()}”` : ' these filters'}
            </p>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
                Try a category like “Bakery” or a road such as “Road 27”.
            </p>
            <button
                type="button"
                onClick={reset}
                className={cn(
                    'mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#059669] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#047857]',
                    focusRing,
                )}
            >
                <HiOutlineArrowPath aria-hidden="true" />
                Reset table
            </button>
        </div>
    )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 pb-16 pt-0 text-base font-normal text-slate-900 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="-mx-4 h-4 bg-[repeating-linear-gradient(90deg,#059669_0_1px,transparent_1px_10px)] opacity-60 [mask-image:linear-gradient(to_bottom,black_40%,transparent)] sm:-mx-6 lg:-mx-10"
            />
            <div
                aria-hidden="true"
                className="-mx-4 h-3 bg-[repeating-linear-gradient(90deg,#059669_0_1px,transparent_1px_50px)] opacity-60 sm:-mx-6 lg:-mx-10"
            />
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl pt-12 sm:pt-16">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                        <div>
                            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#059669]">
                                Yardstick Reviews · League table
                            </p>
                            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-6xl">
                                Dhanmondi’s best-reviewed, <span className="text-[#059669]">measured.</span>
                            </h2>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                                {businesses.length} local businesses ranked by {totalReviews.toLocaleString('en-US')}{' '}
                                verified reviews. Click any column heading to re-rank the table.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 p-5">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">Last measured</p>
                            <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">27 Sep 2026 · 06:00</p>
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                                <a
                                    href="#yardstick-methodology"
                                    className={cn('inline-flex min-h-10 items-center gap-1 rounded font-semibold text-[#047857] hover:underline', focusRing)}
                                >
                                    Methodology <HiArrowUpRight aria-hidden="true" />
                                </a>
                                <a
                                    href="#yardstick-dhanmondi-csv"
                                    className={cn('inline-flex min-h-10 items-center rounded font-semibold text-slate-700 hover:underline', focusRing)}
                                >
                                    Download CSV
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label htmlFor={filterId} className="sr-only">
                                Filter by name, category or road
                            </label>
                            <div className="relative sm:w-80">
                                <HiOutlineMagnifyingGlass
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id={filterId}
                                    type="search"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Filter by name, category or road"
                                    className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
                                />
                            </div>
                            <button
                                type="button"
                                aria-pressed={verifiedOnly}
                                onClick={() => setVerifiedOnly((v) => !v)}
                                className={cn(
                                    'inline-flex h-11 items-center gap-2 self-start rounded-lg border px-4 text-sm font-semibold transition-colors sm:self-auto',
                                    verifiedOnly
                                        ? 'border-[#059669] bg-[#059669] text-white'
                                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900',
                                    focusRing,
                                )}
                            >
                                <HiCheckBadge aria-hidden="true" className={verifiedOnly ? 'text-white' : 'text-[#059669]'} />
                                Verified only
                            </button>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <p aria-live="polite" aria-atomic="true" className="text-sm text-slate-500">
                                Showing <span className="font-semibold text-slate-900">{rows.length}</span> of{' '}
                                {businesses.length}
                            </p>
                            {changed ? (
                                <button
                                    type="button"
                                    onClick={reset}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-[#047857] hover:bg-[#ecfdf5]',
                                        focusRing,
                                    )}
                                >
                                    <HiOutlineArrowPath aria-hidden="true" />
                                    Reset
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {/* Mobile: sortable card list */}
                    <div className="mt-6 md:hidden">
                        <label htmlFor={sortId} className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Sort by
                        </label>
                        <div className="relative mt-2">
                            <select
                                id={sortId}
                                value={`${sort.key}:${sort.dir}`}
                                onChange={(event) => {
                                    const [key, dir] = event.target.value.split(':')
                                    setSort({ key, dir })
                                }}
                                className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm font-semibold text-slate-900 focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
                            >
                                {columns.flatMap((column) =>
                                    ['desc', 'asc'].map((dir) => (
                                        <option key={`${column.key}:${dir}`} value={`${column.key}:${dir}`}>
                                            {column.label} · {column[dir]}
                                        </option>
                                    )),
                                )}
                            </select>
                            <HiChevronDown
                                aria-hidden="true"
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                        </div>

                        {rows.length ? (
                            <ol className="mt-4 space-y-3">
                                {rows.map((item, i) => (
                                    <motion.li
                                        key={item.id}
                                        layout="position"
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className="rounded-2xl border border-slate-200 p-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <RankBadge rank={i + 1} />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base font-semibold leading-snug text-slate-900">
                                                    <a
                                                        href={`#yardstick-${item.id}`}
                                                        className={cn('rounded hover:text-[#047857]', focusRing)}
                                                    >
                                                        {item.name}
                                                    </a>
                                                    {item.verified ? (
                                                        <HiCheckBadge
                                                            aria-label="Verified business"
                                                            role="img"
                                                            className="ml-1 inline align-[-2px] text-[#059669]"
                                                        />
                                                    ) : null}
                                                </h3>
                                                <p className="mt-0.5 text-sm text-slate-500">
                                                    {item.category} · {item.area}
                                                </p>
                                            </div>
                                        </div>
                                        <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                                            {[
                                                {
                                                    key: 'rating',
                                                    label: 'Rating',
                                                    value: item.rating.toFixed(1),
                                                    extra: <RatingBars rating={item.rating} />,
                                                },
                                                {
                                                    key: 'reviews',
                                                    label: 'Reviews',
                                                    value: item.reviews.toLocaleString('en-US'),
                                                    extra: <span className="text-xs text-[#047857]">+{item.recent}</span>,
                                                },
                                                {
                                                    key: 'distance',
                                                    label: 'Distance',
                                                    value: `${item.distance.toFixed(1)} km`,
                                                },
                                            ].map((stat) => (
                                                <div
                                                    key={stat.key}
                                                    className={cn(
                                                        'rounded-xl px-2.5 py-2',
                                                        sort.key === stat.key ? 'bg-[#ecfdf5]' : 'bg-slate-50',
                                                    )}
                                                >
                                                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                                        {stat.label}
                                                    </dt>
                                                    <dd className="mt-1 font-semibold tabular-nums text-slate-900">{stat.value}</dd>
                                                    {stat.extra ? <dd className="mt-1">{stat.extra}</dd> : null}
                                                </div>
                                            ))}
                                        </dl>
                                    </motion.li>
                                ))}
                            </ol>
                        ) : (
                            <div className="mt-4 rounded-2xl border border-dashed border-slate-300">{emptyState}</div>
                        )}
                    </div>

                    {/* Tablet & desktop: sortable table */}
                    <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
                        <table className="w-full table-fixed border-collapse text-left text-sm">
                            <caption className="sr-only">
                                Best-reviewed businesses in Dhanmondi, sorted by {activeColumn.label.toLowerCase()} (
                                {activeColumn[sort.dir]})
                            </caption>
                            <colgroup>
                                <col className="w-14" />
                                <col />
                                <col className="w-[17%]" />
                                <col className="w-[17%]" />
                                <col className="w-[14%]" />
                                <col className="w-[13%]" />
                            </colgroup>
                            <thead className="border-b border-slate-200 bg-slate-50/80">
                                <tr>
                                    <th scope="col" className="px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 lg:px-4">
                                        #
                                    </th>
                                    {columns.map((column) => {
                                        const active = sort.key === column.key
                                        const numeric = column.key !== 'name' && column.key !== 'category'
                                        return (
                                            <th
                                                key={column.key}
                                                scope="col"
                                                aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                                                className={cn('px-2 py-1.5 lg:px-3', cellTone(column.key))}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => sortBy(column.key)}
                                                    className={cn(
                                                        'group inline-flex min-h-10 w-full items-center gap-1.5 rounded-md px-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                                                        numeric && 'justify-end text-right',
                                                        active ? 'text-[#047857]' : 'text-slate-500 hover:text-slate-900',
                                                        focusRing,
                                                    )}
                                                >
                                                    {column.label}
                                                    <SortIcon active={active} dir={sort.dir} />
                                                    <span className="sr-only">
                                                        {active ? `, sorted ${column[sort.dir]}` : ', sort'}
                                                    </span>
                                                </button>
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((item, i) => (
                                    <motion.tr
                                        key={item.id}
                                        layout="position"
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/80"
                                    >
                                        <td className="px-3 py-3 lg:px-4">
                                            <RankBadge rank={i + 1} />
                                        </td>
                                        <td className={cn('px-3 py-3', cellTone('name'))}>
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'hidden h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold tracking-wide lg:grid',
                                                        monogramTones[businesses.indexOf(item) % monogramTones.length],
                                                    )}
                                                >
                                                    {initials(item.name)}
                                                </span>
                                                <div className="min-w-0">
                                                    <a
                                                        href={`#yardstick-${item.id}`}
                                                        className={cn(
                                                            'block truncate rounded font-semibold text-slate-900 hover:text-[#047857]',
                                                            focusRing,
                                                        )}
                                                    >
                                                        {item.name}
                                                    </a>
                                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                                        {item.verified ? (
                                                            <>
                                                                <HiCheckBadge aria-hidden="true" className="text-[#059669]" />
                                                                <span className="sr-only">Verified,</span>
                                                            </>
                                                        ) : null}
                                                        <span className="truncate">{item.area}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={cn('px-3 py-3 text-slate-600', cellTone('category'))}>
                                            <span className="block truncate">{item.category}</span>
                                        </td>
                                        <td className={cn('px-3 py-3 lg:px-4', cellTone('rating'))}>
                                            <div className="flex flex-col items-end gap-1.5">
                                                <span className="font-semibold tabular-nums text-slate-900">
                                                    {item.rating.toFixed(1)}
                                                    <span className="sr-only"> out of 5</span>
                                                </span>
                                                <RatingBars rating={item.rating} />
                                            </div>
                                        </td>
                                        <td className={cn('px-3 py-3 text-right lg:px-4', cellTone('reviews'))}>
                                            <span className="block font-semibold tabular-nums text-slate-900">
                                                {item.reviews.toLocaleString('en-US')}
                                            </span>
                                            <span className="block text-xs tabular-nums text-[#047857]">
                                                +{item.recent}
                                                <span className="hidden lg:inline"> this month</span>
                                            </span>
                                        </td>
                                        <td className={cn('px-3 py-3 text-right lg:px-4', cellTone('distance'))}>
                                            <span className="block font-semibold tabular-nums text-slate-900">
                                                {item.distance.toFixed(1)} km
                                            </span>
                                            <span className="block text-xs text-slate-500">
                                                {Math.max(1, Math.round(item.distance * 12.5))} min walk
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                                {rows.length ? null : (
                                    <tr>
                                        <td colSpan={6}>{emptyState}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-5 text-xs leading-5 text-slate-500">
                        Ratings are Bayesian averages of reviews from the last 24 months. Distances measured from
                        Dhanmondi 27 bus stop.
                    </p>
                </div>
            </MotionConfig>
        </section>
    )
}

export default SortableTableResultsList

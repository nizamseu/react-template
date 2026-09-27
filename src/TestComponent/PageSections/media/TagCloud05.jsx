// SortableBarsTagCloud

// TagCloud05 · Blogs & Digital Media › Tag Cloud & Categories

// Description:
// A data-journalism topic index for Datapoint, drawn as a bar chart. Under "Every story
// we’ve filed, counted." 32 topics (Elections, Climate, Housing, AI…) are listed with a
// horizontal count bar, story total and 30-day change. A filter box narrows the list and a
// Popular / Rising / A–Z toggle re-sorts it with animated reordering. Use it as the topics
// or tags page of a data, research or analysis publication.

// Design:
// - Slate #0f172a section, #e2e8f0 text, muted #94a3b8 labels, teal #2dd4bf bars and
//   accents, rose #fb7185 for falling topics; a small bar-glyph wordmark
// - Rows share one grid (rank · name · bar · count · change) with a tick axis 0–400 on top;
//   tracks draw faint gridlines every 100 stories via repeating-linear-gradient
// - Mono tabular numbers, sans names; the sort toggle is a pill group with a sliding teal
//   indicator (layoutId); filter matches are highlighted in teal
// - Rows reorder with framer-motion layout springs and bars grow from the left when they
//   scroll into view; reduced motion turns both off
// - Responsive: at base the 30-day change moves under the topic name and the name column is
//   7rem; from sm it gets its own column and the name column widens to 11rem

// What it does:
// - query (controlled search, "/" focuses it, Escape clears) filters topics; sort
//   ("popular" | "rising" | "az", aria-pressed buttons) orders them
// - Without a query the list shows the top 12 with a "Show all 32 topics" toggle
//   (aria-expanded); a polite live line reports "Showing 12 of 32 · by popularity"
// - Topic and story totals are computed from the data; each row links to
//   #datapoint-topic-<slug>; the empty state has a "Clear filter" button

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SortableBarsTagCloud from '@/TestComponent/PageSections/media/TagCloud05';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <SortableBarsTagCloud />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowTrendingDown, HiArrowTrendingUp, HiChevronDown, HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AXIS_MAX = 450
const TICKS = [0, 100, 200, 300, 400]
const LIMIT = 12

const topics = [
    ['Elections', 412, 18], ['Climate', 388, 6], ['Housing', 301, 24], ['Inflation', 276, -9],
    ['AI', 264, 41], ['Health care', 241, 3], ['Migration', 220, 12], ['Energy', 198, -4],
    ['Education', 187, 2], ['Crime', 176, -11], ['Transport', 164, 7], ['Water', 142, 15],
    ['Wildfires', 138, 52], ['Labour', 131, -3], ['Trade', 127, 9], ['Tech policy', 121, 19],
    ['Wages', 115, -6], ['Public spending', 108, 1], ['Air quality', 96, 27], ['Census', 88, -14],
    ['Obesity', 81, 5], ['Tourism', 77, 33], ['Agriculture', 73, -2], ['Pensions', 69, 4],
    ['Space', 64, 22], ['Sport', 58, -7], ['Oceans', 55, 11], ['Pandemics', 51, -38],
    ['Gender pay gap', 49, 6], ['Broadband', 44, -1], ['Biodiversity', 41, 16], ['Libraries', 33, 8],
].map(([name, count, change]) => ({ name, count, change, slug: name.toLowerCase().replace(/[^a-z]+/g, '-') }))

const totalStories = topics.reduce((sum, t) => sum + t.count, 0)

const sorts = [
    { id: 'popular', label: 'Popular', note: 'by popularity' },
    { id: 'rising', label: 'Rising', note: 'by 30-day change' },
    { id: 'az', label: 'A–Z', note: 'alphabetically' },
]

const gridlines = {
    backgroundImage: `repeating-linear-gradient(to right, rgba(148,163,184,0.16) 0 1px, transparent 1px ${(100 / AXIS_MAX) * 100}%)`,
}

const rowGrid =
    'grid grid-cols-[1.5rem_minmax(0,7rem)_minmax(0,1fr)_2.75rem] items-center gap-2 sm:grid-cols-[2rem_11rem_minmax(0,1fr)_3.5rem_4.5rem] sm:gap-4'

function Highlight({ text, query }) {
    const q = query.trim().toLowerCase()
    const at = q ? text.toLowerCase().indexOf(q) : -1
    if (at < 0) return text
    return (
        <>
            {text.slice(0, at)}
            <mark className="rounded-[2px] bg-[#2dd4bf]/20 text-[#2dd4bf]">{text.slice(at, at + q.length)}</mark>
            {text.slice(at + q.length)}
        </>
    )
}

function Change({ value, className }) {
    const up = value >= 0
    const Icon = up ? HiArrowTrendingUp : HiArrowTrendingDown
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 font-mono text-xs tabular-nums',
                up ? 'text-[#2dd4bf]' : 'text-[#fb7185]',
                className,
            )}
        >
            <Icon aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{up ? 'up' : 'down'}</span>
            {up ? '+' : '−'}
            {Math.abs(value)}%
        </span>
    )
}

export function SortableBarsTagCloud({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const inputRef = useRef(null)
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('popular')
    const [expanded, setExpanded] = useState(false)

    useEffect(() => {
        const onKey = (event) => {
            if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
            const target = event.target
            const tag = target?.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return
            event.preventDefault()
            inputRef.current?.focus()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const ranked = useMemo(() => {
        const list = [...topics]
        if (sort === 'popular') list.sort((a, b) => b.count - a.count)
        if (sort === 'rising') list.sort((a, b) => b.change - a.change)
        if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name))
        return list
    }, [sort])

    const q = query.trim().toLowerCase()
    const filtered = q ? ranked.filter((t) => t.name.toLowerCase().includes(q)) : ranked
    const rows = q || expanded ? filtered : filtered.slice(0, LIMIT)
    const sortNote = sorts.find((s) => s.id === sort).note

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0f172a] px-4 py-16 text-base font-normal text-[#e2e8f0] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.24em] text-[#2dd4bf]">
                            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
                                <rect x="1" y="9" width="3" height="6" fill="currentColor" />
                                <rect x="6.5" y="4" width="3" height="11" fill="currentColor" />
                                <rect x="12" y="1" width="3" height="14" fill="currentColor" opacity="0.5" />
                            </svg>
                            Datapoint · Topics index
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Every story we’ve filed, <span className="text-[#2dd4bf]">counted.</span>
                        </h2>
                    </div>
                    <dl className="grid shrink-0 grid-cols-3 gap-6 font-mono text-xs text-[#94a3b8] md:gap-8">
                        <div>
                            <dt>Topics</dt>
                            <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">{topics.length}</dd>
                        </div>
                        <div>
                            <dt>Stories</dt>
                            <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
                                {totalStories.toLocaleString('en-US')}
                            </dd>
                        </div>
                        <div>
                            <dt>Updated</dt>
                            <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">27 Sep</dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-10 rounded-2xl border border-[#334155]/70 bg-[#111c33] p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <label htmlFor={`${uid}-filter`} className="sr-only">
                                Filter topics
                            </label>
                            <HiMagnifyingGlass
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]"
                            />
                            <input
                                ref={inputRef}
                                id={`${uid}-filter`}
                                type="search"
                                placeholder="Filter topics"
                                value={query}
                                className="min-h-11 w-full rounded-lg border border-[#334155] bg-[#0f172a] pl-9 pr-16 text-base text-white placeholder:text-[#94a3b8]/70 focus:border-[#2dd4bf] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]/30 [&::-webkit-search-cancel-button]:hidden"
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={(event) => event.key === 'Escape' && setQuery('')}
                            />
                            {query ? (
                                <button
                                    type="button"
                                    aria-label="Clear filter"
                                    className="absolute right-0.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-[#94a3b8] hover:text-white focus-visible:outline-2 focus-visible:outline-[#2dd4bf]"
                                    onClick={() => setQuery('')}
                                >
                                    <HiXMark aria-hidden="true" className="size-4" />
                                </button>
                            ) : (
                                <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[#334155] px-1.5 font-mono text-[11px] text-[#94a3b8]">
                                    /
                                </kbd>
                            )}
                        </div>

                        <div role="group" aria-label="Sort topics" className="flex rounded-lg border border-[#334155] bg-[#0f172a] p-1">
                            {sorts.map((option) => {
                                const on = sort === option.id
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        aria-pressed={on}
                                        className={cn(
                                            'relative min-h-9 flex-1 rounded-md px-4 font-mono text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2dd4bf] sm:flex-none',
                                            on ? 'text-[#0f172a]' : 'text-[#94a3b8] hover:text-white',
                                        )}
                                        onClick={() => setSort(option.id)}
                                    >
                                        {on && (
                                            <motion.span
                                                layoutId={`${uid}-sort`}
                                                className="absolute inset-0 rounded-md bg-[#2dd4bf]"
                                                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 36 }}
                                            />
                                        )}
                                        <span className="relative">{option.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <p aria-live="polite" className="mt-4 font-mono text-xs text-[#94a3b8]">
                        Showing {rows.length} of {topics.length} · {sortNote}
                        {q ? ` · matching “${query.trim()}”` : ''}
                    </p>

                    <div aria-hidden="true" className={cn(rowGrid, 'mt-5 border-b border-[#334155] pb-2 font-mono text-[10px] text-[#94a3b8]')}>
                        <span>#</span>
                        <span>Topic</span>
                        <span className="relative h-4">
                            {TICKS.map((tick) => (
                                <span
                                    key={tick}
                                    className={cn('absolute top-0', tick > 0 && '-translate-x-1/2')}
                                    style={{ left: `${(tick / AXIS_MAX) * 100}%` }}
                                >
                                    {tick}
                                </span>
                            ))}
                        </span>
                        <span className="text-right">Stories</span>
                        <span className="hidden text-right sm:block">30 days</span>
                    </div>

                    {rows.length === 0 ? (
                        <div className="py-14 text-center">
                            <p className="text-lg font-semibold text-white">No topics match “{query.trim()}”.</p>
                            <button
                                type="button"
                                className="mt-4 min-h-11 rounded-lg border border-[#2dd4bf]/60 px-5 font-mono text-xs font-semibold text-[#2dd4bf] hover:bg-[#2dd4bf]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2dd4bf]"
                                onClick={() => setQuery('')}
                            >
                                Clear filter
                            </button>
                        </div>
                    ) : (
                        <ol id={`${uid}-list`} className="divide-y divide-[#334155]/50">
                            <AnimatePresence initial={false}>
                                {rows.map((topic, index) => (
                                    <motion.li
                                        key={topic.slug}
                                        layout={reduceMotion ? false : 'position'}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 380, damping: 36, opacity: { duration: 0.2 } }}
                                    >
                                        <a
                                            href={`#datapoint-topic-${topic.slug}`}
                                            className={cn(
                                                rowGrid,
                                                'group min-h-12 py-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2dd4bf]',
                                            )}
                                        >
                                            <span className="font-mono text-xs tabular-nums text-[#94a3b8]">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-medium text-[#e2e8f0] group-hover:text-white sm:text-base">
                                                    <Highlight text={topic.name} query={query} />
                                                </span>
                                                <Change value={topic.change} className="sm:hidden" />
                                            </span>
                                            <span className="relative block h-6 overflow-hidden rounded-[3px]" style={gridlines}>
                                                <motion.span
                                                    className="absolute inset-y-0 left-0 block origin-left rounded-[3px] bg-[#2dd4bf]/85 transition-colors group-hover:bg-[#5eead4]"
                                                    style={{ width: `${(topic.count / AXIS_MAX) * 100}%` }}
                                                    initial={reduceMotion ? false : { scaleX: 0 }}
                                                    whileInView={{ scaleX: 1 }}
                                                    viewport={{ once: true, amount: 0.6 }}
                                                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                                />
                                            </span>
                                            <span className="text-right font-mono text-sm tabular-nums text-white">
                                                {topic.count}
                                            </span>
                                            <Change value={topic.change} className="hidden justify-end sm:inline-flex" />
                                        </a>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ol>
                    )}

                    {!q && filtered.length > LIMIT && (
                        <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={`${uid}-list`}
                            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#334155] font-mono text-xs font-semibold text-[#e2e8f0] transition-colors hover:border-[#2dd4bf] hover:text-[#2dd4bf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2dd4bf]"
                            onClick={() => setExpanded((open) => !open)}
                        >
                            {expanded ? 'Show top 12' : `Show all ${topics.length} topics`}
                            <HiChevronDown
                                aria-hidden="true"
                                className={cn('size-4 transition-transform motion-reduce:transition-none', expanded && 'rotate-180')}
                            />
                        </button>
                    )}
                </div>

                <p className="mt-5 font-mono text-[11px] leading-relaxed text-[#94a3b8]">
                    Counts include explainers, charts and investigations since January 2021. Change compares the last 30
                    days with the 30 before.
                </p>
            </div>
        </section>
    )
}

export default SortableBarsTagCloud

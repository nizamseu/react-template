// AlphabetIndexTagCloud

// TagCloud02 · Blogs & Digital Media › Tag Cloud & Categories

// Description:
// A Swiss-style A–Z category index for the online reference site Encyclopedia Nova. Under
// "Every field of knowledge, filed A to Z." a 26-letter jump bar sits above a scrollable
// index of 64 fields (Aeronautics to Zoology) grouped under large blue letters, each with its
// article count. Letters with no entries (Q, X, Y) are disabled, and a filter box narrows the
// index live. Use it for category directories, glossaries or "browse all topics" pages.

// Design:
// - White section, black #0a0a0a text, blue #1d4ed8 accents; hairline black/10 rules, a
//   drawn four-point "nova" star wordmark, no rounded corners except the focus rings
// - Jump bar: grid-cols-9 → sm:grid-cols-13 → lg:grid-cols-[repeat(26,minmax(0,1fr))] of
//   40px letter buttons; the active letter has a blue sliding underline (layoutId); empty
//   letters are grey, struck through and disabled
// - Index pane: max-h-[560px] scroll box; each group is md:grid-cols-[120px_1fr] with a
//   text-6xl font-black blue letter (sticky on md) and entries in 1 → sm:2 → lg:3 columns
// - Entries show name, tabular count and an arrow that slides in on hover/focus; filter
//   matches are highlighted in blue
// - Responsive: header stacks at base and splits on md; stats wrap; pane keeps its own
//   scroll so the page never overflows at 360px

// What it does:
// - query (controlled search input) filters entries; letters whose group becomes empty are
//   disabled, and an empty state offers "Clear filter"
// - Clicking a letter scrolls the pane to that group (smooth unless reduced motion) and
//   focuses its heading; scrolling the pane updates the active letter from group offsets
// - Totals (fields, articles) are computed from the data; every entry links to
//   #nova-<slug>; "Suggest a field" links to #nova-suggest

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AlphabetIndexTagCloud from '@/TestComponent/PageSections/media/TagCloud02';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <AlphabetIndexTagCloud />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight, HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const fields = [
    ['Aeronautics', 1840], ['Anthropology', 2215], ['Archaeology', 3108], ['Architecture', 2764], ['Astronomy', 4021],
    ['Biochemistry', 1532], ['Botany', 2890], ['Byzantine History', 611],
    ['Cartography', 488], ['Chemistry', 3710], ['Classical Music', 1964], ['Climatology', 902], ['Cryptography', 537],
    ['Dance', 842], ['Demography', 395],
    ['Ecology', 1677], ['Economics', 3345], ['Egyptology', 764], ['Epidemiology', 1120], ['Ethics', 986],
    ['Film', 2480], ['Folklore', 1033], ['Forestry', 441],
    ['Genetics', 2198], ['Geology', 2356], ['Glaciology', 214],
    ['Heraldry', 322], ['Horticulture', 875],
    ['Immunology', 1289], ['Islamic Art', 590],
    ['Jazz', 1411], ['Jurisprudence', 1265],
    ['Kinetics', 308],
    ['Linguistics', 2043], ['Logic', 667],
    ['Marine Biology', 1502], ['Mathematics', 4388], ['Metallurgy', 419], ['Mycology', 356], ['Mythology', 2611],
    ['Neuroscience', 1934], ['Numismatics', 287],
    ['Oceanography', 1018], ['Optics', 733], ['Ornithology', 1395],
    ['Paleontology', 1760], ['Philosophy', 3902], ['Photography', 1248], ['Physics', 4450],
    ['Religion', 3217], ['Renaissance Art', 1586], ['Robotics', 944],
    ['Seismology', 381], ['Sociology', 2089], ['Space Exploration', 1633],
    ['Textiles', 502], ['Theatre', 1732], ['Typography', 418],
    ['Urban Planning', 1144],
    ['Viticulture', 366], ['Volcanology', 529],
    ['Weather', 1377], ['World Wars', 3854],
    ['Zoology', 2672],
].map(([name, count]) => ({
    name,
    count,
    slug: name.toLowerCase().replace(/[^a-z]+/g, '-'),
    isNew: ['Glaciology', 'Robotics', 'Cryptography', 'Kinetics'].includes(name),
}))

const totalArticles = fields.reduce((sum, f) => sum + f.count, 0)

function Highlight({ text, query }) {
    const q = query.trim().toLowerCase()
    const at = q ? text.toLowerCase().indexOf(q) : -1
    if (at < 0) return text
    return (
        <>
            {text.slice(0, at)}
            <mark className="bg-[#1d4ed8]/15 text-[#1d4ed8]">{text.slice(at, at + q.length)}</mark>
            {text.slice(at + q.length)}
        </>
    )
}

export function AlphabetIndexTagCloud({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const paneRef = useRef(null)
    const groupRefs = useRef({})
    const [query, setQuery] = useState('')
    const [active, setActive] = useState('A')

    const groups = useMemo(() => {
        const q = query.trim().toLowerCase()
        const list = q ? fields.filter((f) => f.name.toLowerCase().includes(q)) : fields
        return LETTERS.map((letter) => ({ letter, entries: list.filter((f) => f.name[0] === letter) }))
    }, [query])

    const visible = groups.filter((g) => g.entries.length)
    const shownCount = visible.reduce((sum, g) => sum + g.entries.length, 0)
    const current = visible.some((g) => g.letter === active) ? active : visible[0]?.letter

    const jumpTo = (letter) => {
        const pane = paneRef.current
        const el = groupRefs.current[letter]
        if (!pane || !el) return
        setActive(letter)
        pane.scrollTo({ top: el.offsetTop, behavior: reduceMotion ? 'auto' : 'smooth' })
        el.querySelector('h3')?.focus({ preventScroll: true })
    }

    const handleScroll = () => {
        const pane = paneRef.current
        if (!pane) return
        let next = visible[0]?.letter
        for (const g of visible) {
            const el = groupRefs.current[g.letter]
            if (el && el.offsetTop - pane.scrollTop <= 32) next = g.letter
        }
        if (pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 4) next = visible[visible.length - 1]?.letter
        if (next && next !== active) setActive(next)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0a0a0a] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 border-b-2 border-[#0a0a0a] pb-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.2em] text-[#0a0a0a]">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-[#1d4ed8]">
                                <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
                            </svg>
                            Encyclopedia Nova
                        </p>
                        <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.03em] text-[#0a0a0a] sm:text-5xl lg:text-7xl">
                            Every field of knowledge, filed <span className="text-[#1d4ed8]">A to Z.</span>
                        </h2>
                    </div>
                    <dl className="flex shrink-0 gap-8 text-sm">
                        <div>
                            <dt className="text-[#0a0a0a]/55">Fields</dt>
                            <dd className="mt-1 text-3xl font-black tabular-nums text-[#0a0a0a]">{fields.length}</dd>
                        </div>
                        <div>
                            <dt className="text-[#0a0a0a]/55">Articles</dt>
                            <dd className="mt-1 text-3xl font-black tabular-nums text-[#0a0a0a]">
                                {totalArticles.toLocaleString('en-US')}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <label htmlFor={`${uid}-filter`} className="sr-only">
                            Filter fields
                        </label>
                        <HiMagnifyingGlass
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#0a0a0a]/50"
                        />
                        <input
                            id={`${uid}-filter`}
                            type="search"
                            placeholder={`Filter ${fields.length} fields…`}
                            value={query}
                            className="min-h-11 w-full border border-[#0a0a0a]/20 bg-white pl-10 pr-10 text-base text-[#0a0a0a] placeholder:text-[#0a0a0a]/40 focus:border-[#1d4ed8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8]/30 [&::-webkit-search-cancel-button]:hidden"
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => event.key === 'Escape' && setQuery('')}
                        />
                        {query && (
                            <button
                                type="button"
                                aria-label="Clear filter"
                                className="absolute right-0.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-[#0a0a0a]/60 hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-[#1d4ed8]"
                                onClick={() => setQuery('')}
                            >
                                <HiXMark aria-hidden="true" className="size-5" />
                            </button>
                        )}
                    </div>
                    <p aria-live="polite" className="text-sm text-[#0a0a0a]/60">
                        {query.trim()
                            ? `${shownCount} of ${fields.length} fields match “${query.trim()}”`
                            : `Showing all ${fields.length} fields`}
                    </p>
                </div>

                <nav
                    aria-label="Jump to letter"
                    className="mt-6 grid grid-cols-9 border-l border-t border-[#0a0a0a]/10 sm:grid-cols-13 lg:grid-cols-[repeat(26,minmax(0,1fr))]"
                >
                    {groups.map(({ letter, entries }) => {
                        const empty = entries.length === 0
                        const on = !empty && letter === current
                        return (
                            <button
                                key={letter}
                                type="button"
                                disabled={empty}
                                aria-current={on ? 'true' : undefined}
                                aria-label={empty ? `${letter}, no entries` : `${letter}, ${entries.length} fields`}
                                className={cn(
                                    'relative flex min-h-11 items-center justify-center border-b border-r border-[#0a0a0a]/10 text-sm font-bold transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1d4ed8]',
                                    empty
                                        ? 'cursor-not-allowed text-[#0a0a0a]/20 line-through'
                                        : on
                                          ? 'text-[#1d4ed8]'
                                          : 'text-[#0a0a0a] hover:bg-[#1d4ed8]/[0.06] hover:text-[#1d4ed8]',
                                )}
                                onClick={() => jumpTo(letter)}
                            >
                                {letter}
                                {on && (
                                    <motion.span
                                        layoutId={`${uid}-letter`}
                                        aria-hidden="true"
                                        className="absolute inset-x-1.5 bottom-0 h-[3px] bg-[#1d4ed8]"
                                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }}
                                    />
                                )}
                            </button>
                        )
                    })}
                </nav>

                <div
                    ref={paneRef}
                    tabIndex={0}
                    aria-label="Fields index"
                    className="relative mt-2 max-h-[560px] overflow-y-auto overscroll-contain border-b border-[#0a0a0a]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                    onScroll={handleScroll}
                >
                    {visible.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-2xl font-black text-[#0a0a0a]">No fields match “{query.trim()}”.</p>
                            <button
                                type="button"
                                className="mt-4 min-h-11 border-2 border-[#0a0a0a] px-5 text-sm font-bold text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                onClick={() => setQuery('')}
                            >
                                Clear filter
                            </button>
                        </div>
                    )}

                    {visible.map(({ letter, entries }) => (
                        <div
                            key={letter}
                            ref={(el) => {
                                groupRefs.current[letter] = el
                            }}
                            role="group"
                            aria-labelledby={`${uid}-group-${letter}`}
                            className="grid gap-3 border-t border-[#0a0a0a]/10 py-6 first:border-t-0 md:grid-cols-[120px_1fr] md:gap-6"
                        >
                            <div>
                                <h3
                                    id={`${uid}-group-${letter}`}
                                    tabIndex={-1}
                                    className="text-6xl font-black leading-none tracking-tight text-[#1d4ed8] outline-none md:sticky md:top-4"
                                >
                                    {letter}
                                </h3>
                            </div>
                            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                                {entries.map((entry) => (
                                    <li key={entry.slug} className="border-b border-[#0a0a0a]/10">
                                        <a
                                            href={`#nova-${entry.slug}`}
                                            className="group flex min-h-12 items-center justify-between gap-3 py-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                        >
                                            <span className="flex min-w-0 items-center gap-2">
                                                <span className="truncate text-base font-semibold text-[#0a0a0a] group-hover:text-[#1d4ed8]">
                                                    <Highlight text={entry.name} query={query} />
                                                </span>
                                                {entry.isNew && (
                                                    <span className="shrink-0 bg-[#1d4ed8] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                                                        New
                                                    </span>
                                                )}
                                            </span>
                                            <span className="flex shrink-0 items-center gap-2 text-sm tabular-nums text-[#0a0a0a]/50">
                                                {entry.count.toLocaleString('en-US')}
                                                <HiArrowUpRight
                                                    aria-hidden="true"
                                                    className="size-4 -translate-x-1 text-[#1d4ed8] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                                                />
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 text-sm text-[#0a0a0a]/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>Greyed letters have no fields yet. Counts update nightly.</p>
                    <a
                        href="#nova-suggest"
                        className="inline-flex min-h-10 items-center gap-1.5 font-bold text-[#1d4ed8] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                    >
                        Suggest a field
                        <HiArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default AlphabetIndexTagCloud

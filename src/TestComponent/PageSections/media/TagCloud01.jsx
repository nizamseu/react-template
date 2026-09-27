// WeightedCloudTagCloud

// TagCloud01 · Blogs & Digital Media › Tag Cloud & Categories

// Description:
// A typographic tag cloud for the essay journal Margins. Under the heading "Read around the
// edges." twenty-four themes (Memory, Attention, Walking, The Sea…) are set in serif at
// sizes weighted by how many essays carry them. Selecting several themes circles them in
// rust and a reading-list panel reports "34 essays match", with the best picks and a "Read
// the selection" link. Use it on archive, topic or "explore" pages of a writing site.

// Design:
// - Paper #f7f3ea section, ink #221e1a text, rust #b4532a accents; the cloud sits on a
//   ruled "page" with a double rust margin line (sm+) and faint horizontal rules
// - Six weighted sizes from text-sm to text-6xl (scaled down one step at base); words
//   alternate serif, serif italic and tight sans for texture; counts as mono superscripts
// - Selected words turn rust inside a hand-drawn SVG ellipse that draws itself (pathLength);
//   words that no matching essay carries fade to 25%
// - Panel: hairline-ruled aside with a text-7xl serif count that slides on change, Any/All
//   toggle, removable pills and up to three matching essays
// - Responsive: stacked at base; lg:grid-cols-[minmax(0,1fr)_340px] with the panel sticky;
//   cloud padding and margin rules appear from sm

// What it does:
// - selected (tag ids, two preset) and mode ("any" | "all") drive a filter over a 212-essay
//   archive (12 hand-written picks + 200 seeded entries) to produce the match count
// - Tag buttons use aria-pressed; tag weights are real counts from the same archive; words
//   are dimmed when no matching essay also carries them
// - "Clear all" and the × on pills deselect; the count is announced in an aria-live region;
//   "Read the selection" links to #margins-reading-list, essay titles to #essay-<slug>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import WeightedCloudTagCloud from '@/TestComponent/PageSections/media/TagCloud01';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <WeightedCloudTagCloud />
//     </main>
// )
// ```

'use client'

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tags = [
    { id: 'memory', label: 'Memory', w: 9 },
    { id: 'rivers', label: 'Rivers', w: 3 },
    { id: 'attention', label: 'Attention', w: 10 },
    { id: 'grief', label: 'Grief', w: 5 },
    { id: 'cities', label: 'Cities', w: 7 },
    { id: 'letters', label: 'Letters', w: 2 },
    { id: 'walking', label: 'Walking', w: 8 },
    { id: 'kitchens', label: 'Kitchens', w: 3 },
    { id: 'translation', label: 'Translation', w: 4 },
    { id: 'solitude', label: 'Solitude', w: 7 },
    { id: 'weather', label: 'Weather', w: 2 },
    { id: 'reading', label: 'Reading', w: 9 },
    { id: 'fathers', label: 'Fathers', w: 3 },
    { id: 'islands', label: 'Islands', w: 2 },
    { id: 'work', label: 'Work', w: 6 },
    { id: 'gardens', label: 'Gardens', w: 4 },
    { id: 'music', label: 'Music', w: 5 },
    { id: 'insomnia', label: 'Insomnia', w: 2 },
    { id: 'home', label: 'Home', w: 8 },
    { id: 'maps', label: 'Maps', w: 3 },
    { id: 'faith', label: 'Faith', w: 4 },
    { id: 'friendship', label: 'Friendship', w: 6 },
    { id: 'the-sea', label: 'The Sea', w: 5 },
    { id: 'boredom', label: 'Boredom', w: 1 },
]

const picks = [
    { slug: 'stopped-taking-photographs', title: 'The Year I Stopped Taking Photographs', author: 'Noor Haddad', mins: 14, tags: ['memory', 'attention', 'home'] },
    { slug: 'every-river', title: 'Every River I Have Lived Beside', author: 'Tomasz Wren', mins: 11, tags: ['rivers', 'home', 'walking'] },
    { slug: 'theory-of-boredom', title: 'Notes Toward a Theory of Boredom', author: 'Imogen Achebe', mins: 9, tags: ['boredom', 'attention', 'work'] },
    { slug: 'fathers-handwriting', title: 'My Father’s Handwriting', author: 'Callum Ferreira', mins: 12, tags: ['fathers', 'letters', 'grief'] },
    { slug: 'night-walks', title: 'Night Walks in a City That Won’t Sleep', author: 'Aiko Brandt', mins: 16, tags: ['walking', 'cities', 'insomnia'] },
    { slug: 'grandmothers-recipes', title: 'Translating My Grandmother’s Recipes', author: 'Lucía Moreno', mins: 10, tags: ['translation', 'kitchens', 'memory'] },
    { slug: 'island-argument', title: 'An Island Is a Kind of Argument', author: 'Ruth Okafor', mins: 13, tags: ['islands', 'solitude', 'the-sea'] },
    { slug: 'what-the-garden-knew', title: 'What the Garden Knew Before I Did', author: 'Beatrix Hale', mins: 8, tags: ['gardens', 'grief', 'weather'] },
    { slug: 'proust-night-bus', title: 'Reading Proust on the Night Bus', author: 'Samir Qureshi', mins: 15, tags: ['reading', 'cities', 'attention'] },
    { slug: 'friendship-at-forty', title: 'Friendship at Forty', author: 'Dana Whitfield', mins: 11, tags: ['friendship', 'solitude', 'home'] },
    { slug: 'hymns-for-unbelieving', title: 'Hymns for the Unbelieving', author: 'Owen Price', mins: 12, tags: ['faith', 'music', 'memory'] },
    { slug: 'map-of-crying', title: 'A Map of Everywhere I Have Cried', author: 'Priya Raman', mins: 7, tags: ['maps', 'grief', 'cities'] },
]

function seeded(seed) {
    let s = seed
    return () => {
        s = (s * 16807) % 2147483647
        return s / 2147483647
    }
}

function buildArchive() {
    const rand = seeded(2026)
    const total = tags.reduce((sum, t) => sum + t.w, 0)
    const pick = () => {
        let r = rand() * total
        for (const t of tags) {
            r -= t.w
            if (r <= 0) return t.id
        }
        return tags[tags.length - 1].id
    }
    const generated = Array.from({ length: 200 }, (_, i) => {
        const want = rand() > 0.5 ? 3 : 2
        const set = new Set()
        while (set.size < want) set.add(pick())
        return { slug: `archive-${i + 1}`, tags: [...set] }
    })
    return [...picks, ...generated]
}

const archive = buildArchive()
const counts = Object.fromEntries(tags.map((t) => [t.id, archive.filter((a) => a.tags.includes(t.id)).length]))
const minCount = Math.min(...Object.values(counts))
const maxCount = Math.max(...Object.values(counts))

const SIZES = [
    'text-sm sm:text-base',
    'text-base sm:text-lg',
    'text-lg sm:text-2xl',
    'text-2xl sm:text-3xl',
    'text-3xl sm:text-4xl',
    'text-4xl sm:text-5xl lg:text-6xl',
]
const FACES = ['font-serif', 'font-serif italic', 'font-serif', 'font-sans font-medium tracking-tight']

const sizeFor = (count) => SIZES[Math.min(5, Math.floor(((count - minCount) / (maxCount - minCount)) * 6))]
const labelOf = (id) => tags.find((t) => t.id === id)?.label ?? id

const ruled = {
    backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 39px, rgba(34,30,26,0.07) 39px 40px)',
}

export function WeightedCloudTagCloud({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [selected, setSelected] = useState(['attention', 'cities'])
    const [mode, setMode] = useState('any')

    const matches = useMemo(() => {
        if (!selected.length) return archive
        return archive.filter((a) =>
            mode === 'any' ? selected.some((t) => a.tags.includes(t)) : selected.every((t) => a.tags.includes(t)),
        )
    }, [selected, mode])

    const reachable = useMemo(() => {
        const set = new Set()
        matches.forEach((a) => a.tags.forEach((t) => set.add(t)))
        return set
    }, [matches])

    const featured = useMemo(
        () =>
            picks
                .filter((p) => matches.includes(p))
                .map((p) => ({ ...p, hits: p.tags.filter((t) => selected.includes(t)).length }))
                .sort((a, b) => b.hits - a.hits)
                .slice(0, 3),
        [matches, selected],
    )

    const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    const joiner = mode === 'any' ? ' or ' : ' and '

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f7f3ea] px-4 py-16 text-base font-normal text-[#221e1a] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 border-b border-[#221e1a]/15 pb-10 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#b4532a]">
                            Margins · Essays on the long way round
                        </p>
                        <h2 className="mt-4 font-serif text-5xl font-normal leading-[0.95] tracking-tight text-[#221e1a] sm:text-6xl lg:text-7xl">
                            Read around the <em className="text-[#b4532a]">edges.</em>
                        </h2>
                    </div>
                    <p className="max-w-sm text-base leading-relaxed text-[#221e1a]/70">
                        {tags.length} threads run through {archive.length} essays. The bigger the word, the more
                        often we’ve written about it. Pick a few and we’ll pull every essay that shares them.
                    </p>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
                    <div className="relative py-6 sm:border sm:border-[#221e1a]/10 sm:bg-[#fbf8f1] sm:py-12 sm:pl-16 sm:pr-8" style={ruled}>
                        <span aria-hidden="true" className="absolute inset-y-0 left-9 hidden w-px bg-[#b4532a]/40 sm:block" />
                        <span aria-hidden="true" className="absolute inset-y-0 left-10 hidden w-px bg-[#b4532a]/40 sm:block" />
                        <ul aria-label="Essay themes" className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 sm:justify-start sm:gap-x-3">
                            {tags.map((tag, index) => {
                                const on = selected.includes(tag.id)
                                const dim = selected.length > 0 && !on && !reachable.has(tag.id)
                                return (
                                    <li key={tag.id}>
                                        <button
                                            type="button"
                                            aria-pressed={on}
                                            aria-label={`${tag.label}, ${counts[tag.id]} essays`}
                                            className={cn(
                                                'group relative inline-flex min-h-10 items-baseline gap-0.5 rounded-sm px-2 py-1 leading-none transition-[color,opacity] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b4532a]',
                                                on ? 'text-[#b4532a]' : 'text-[#221e1a] hover:text-[#b4532a]',
                                                dim && 'opacity-25 hover:opacity-70',
                                            )}
                                            onClick={() => toggle(tag.id)}
                                        >
                                            {on && (
                                                <svg
                                                    aria-hidden="true"
                                                    viewBox="0 0 200 50"
                                                    preserveAspectRatio="none"
                                                    className="pointer-events-none absolute -inset-x-1 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)] text-[#b4532a]"
                                                >
                                                    <motion.path
                                                        d="M8 26 C 6 10 50 3 104 4 C 158 5 197 13 194 28 C 191 42 140 48 92 46 C 44 44 4 38 10 20"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                        vectorEffect="non-scaling-stroke"
                                                        initial={reduceMotion ? false : { pathLength: 0 }}
                                                        animate={{ pathLength: 1 }}
                                                        transition={{ duration: 0.55, ease: 'easeOut' }}
                                                    />
                                                </svg>
                                            )}
                                            <span className={cn(FACES[index % FACES.length], sizeFor(counts[tag.id]))}>
                                                {tag.label}
                                            </span>
                                            <sup className="font-mono text-[10px] font-normal not-italic text-[#221e1a]/45">
                                                {counts[tag.id]}
                                            </sup>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <aside className="border-t-2 border-[#221e1a] pt-6 lg:sticky lg:top-8 lg:self-start">
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#221e1a]/60">
                            Your reading list
                        </p>
                        <div aria-live="polite" className="mt-3 flex items-end gap-3">
                            <span className="relative block h-[4.5rem] min-w-[3ch] overflow-hidden font-serif text-7xl leading-none tabular-nums text-[#221e1a]">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                        key={matches.length}
                                        className="block"
                                        initial={reduceMotion ? { opacity: 0 } : { y: '100%', opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={reduceMotion ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {matches.length}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                            <span className="pb-2 font-serif text-xl italic text-[#221e1a]/80">
                                {selected.length
                                    ? `${matches.length === 1 ? 'essay matches' : 'essays match'}`
                                    : 'essays in the archive'}
                            </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-[#221e1a]/65">
                            {selected.length
                                ? `Tagged ${selected.map(labelOf).join(joiner)}.`
                                : 'Tap a word in the cloud to start a reading list.'}
                        </p>

                        <div role="group" aria-label="Match mode" className="mt-5 inline-flex border border-[#221e1a]/20 p-0.5">
                            {[
                                ['any', 'Any tag'],
                                ['all', 'All tags'],
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={mode === value}
                                    className={cn(
                                        'min-h-10 px-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b4532a]',
                                        mode === value ? 'bg-[#221e1a] text-[#f7f3ea]' : 'text-[#221e1a]/70 hover:text-[#221e1a]',
                                    )}
                                    onClick={() => setMode(value)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {selected.length > 0 && (
                            <ul aria-label="Selected themes" className="mt-5 flex flex-wrap gap-2">
                                {selected.map((id) => (
                                    <li key={id}>
                                        <button
                                            type="button"
                                            aria-label={`Remove ${labelOf(id)}`}
                                            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#b4532a]/40 bg-[#b4532a]/[0.06] pl-3.5 pr-2.5 text-sm text-[#b4532a] transition-colors hover:bg-[#b4532a] hover:text-[#f7f3ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b4532a]"
                                            onClick={() => toggle(id)}
                                        >
                                            {labelOf(id)}
                                            <HiXMark aria-hidden="true" className="size-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-7 border-t border-[#221e1a]/15">
                            {featured.length > 0 ? (
                                <ol>
                                    {featured.map((essay) => (
                                        <li key={essay.slug} className="border-b border-[#221e1a]/15">
                                            <a
                                                href={`#essay-${essay.slug}`}
                                                className="group block py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b4532a]"
                                            >
                                                <span className="block font-serif text-lg leading-snug text-[#221e1a] group-hover:text-[#b4532a]">
                                                    {essay.title}
                                                </span>
                                                <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.16em] text-[#221e1a]/55">
                                                    {essay.author} · {essay.mins} min
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="border-b border-[#221e1a]/15 py-4 text-sm leading-relaxed text-[#221e1a]/65">
                                    {matches.length
                                        ? 'None of this season’s picks, but the archive has you covered.'
                                        : 'No essay carries all of these yet. Try “Any tag”.'}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                            <a
                                href="#margins-reading-list"
                                className="group inline-flex min-h-11 items-center gap-2 bg-[#b4532a] px-5 text-sm font-semibold text-[#f7f3ea] transition-colors hover:bg-[#9a4522] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221e1a]"
                            >
                                Read the selection
                                <HiArrowLongRight
                                    aria-hidden="true"
                                    className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                                />
                            </a>
                            <button
                                type="button"
                                disabled={!selected.length}
                                className="min-h-11 px-1 text-sm font-medium text-[#221e1a]/70 underline underline-offset-4 hover:text-[#221e1a] disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b4532a]"
                                onClick={() => setSelected([])}
                            >
                                Clear all
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default WeightedCloudTagCloud

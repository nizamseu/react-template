// CategoryTilesTagCloud

// TagCloud03 · Blogs & Digital Media › Tag Cloud & Categories

// Description:
// A field-guide category browser for the adventure magazine Outpost. Under the heading "Six
// directions. Pick one and go." six photo tiles (Expeditions, Wild Water, Night Skies,
// Deserts, Forests, Base Camp) show story counts and map coordinates; on desktop they are
// expanding strips. A row of smaller field tags (#packrafting, #dark-sky, #van-life…) lights
// up the categories each tag lives in. Use it on a magazine home, a section index or a hub.

// Design:
// - Dark olive #1f241c section, bone #efe6d0 text, sand #d9c9a3 accents; photos slightly
//   desaturated and sepia-warmed under an olive bottom gradient; mono index numbers and
//   coordinates, serif titles
// - Tiles: rounded-[18px]; grid-cols-2 (3:4) → sm:grid-cols-3 (4:5) → lg:flex strips in a
//   540px row where the active strip grows to flex 3.4 over 700ms
// - On lg collapsed strips show a vertical serif label; the active strip fades in its title,
//   blurb and "Explore" arrow after a short delay; photos zoom 5% on hover
// - Tag chips: mono "#tag" pills with counts; picked chips fill sand, and tiles outside the
//   picked tags drop to 40% opacity and greyscale
// - Motion is CSS transitions only (motion-reduce:transition-none on tiles)

// What it does:
// - active (tile index) follows hover and keyboard focus on lg; every tile links to
//   #outpost-<category>
// - picked (tag ids) toggles with aria-pressed chips; the live summary reports tagged story
//   totals and the categories they span; "Clear tags" resets
// - The 478-story total is summed from the tile data; "Browse every story" links to
//   #outpost-archive

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CategoryTilesTagCloud from '@/TestComponent/PageSections/media/TagCloud03';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <CategoryTilesTagCloud />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const categories = [
    {
        id: 'expeditions',
        name: 'Expeditions',
        count: 128,
        coord: '46.55° N · 7.98° E',
        blurb: 'Multi-week journeys on foot, ski and sledge, told by the people who went.',
        image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=900&q=80',
        alt: 'Hikers with backpacks crossing a mountain ridge',
    },
    {
        id: 'water',
        name: 'Wild Water',
        count: 86,
        coord: '51.49° N · 115.93° W',
        blurb: 'Rivers, lakes and cold coasts: packrafting, swimming and the long paddle home.',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
        alt: 'Small boat on a turquoise mountain lake',
    },
    {
        id: 'skies',
        name: 'Night Skies',
        count: 42,
        coord: '44.00° S · 170.47° E',
        blurb: 'Dark-sky reserves, aurora chasing and sleeping out under a full moon.',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
        alt: 'Starry night sky above snowy mountains',
    },
    {
        id: 'deserts',
        name: 'Deserts',
        count: 57,
        coord: '36.99° N · 110.10° W',
        blurb: 'Heat, silence and the long straight roads that run between them.',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80',
        alt: 'Camper van on a desert road between red rock formations',
    },
    {
        id: 'forests',
        name: 'Forests',
        count: 94,
        coord: '47.86° N · 123.93° W',
        blurb: 'Old growth, rewilding projects and the people who know every tree by name.',
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=900&q=80',
        alt: 'Path through a misty green forest',
    },
    {
        id: 'basecamp',
        name: 'Base Camp',
        count: 71,
        coord: '61.24° N · 8.20° E',
        blurb: 'Gear tested hard, camp cooking and the craft of staying out one night longer.',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80',
        alt: 'View from inside a tent opening onto a forest',
    },
]

const fieldTags = [
    { id: 'solo-travel', count: 34, cats: ['expeditions', 'deserts', 'forests'] },
    { id: 'packrafting', count: 18, cats: ['water', 'expeditions'] },
    { id: 'dark-sky', count: 22, cats: ['skies', 'deserts'] },
    { id: 'rewilding', count: 27, cats: ['forests', 'water'] },
    { id: 'long-read', count: 61, cats: ['expeditions', 'deserts', 'forests', 'skies'] },
    { id: 'field-notes', count: 48, cats: ['basecamp', 'forests', 'water'] },
    { id: 'cold-weather', count: 29, cats: ['expeditions', 'skies', 'basecamp'] },
    { id: 'photo-essay', count: 40, cats: ['skies', 'deserts', 'water'] },
    { id: 'van-life', count: 15, cats: ['deserts', 'basecamp'] },
    { id: 'first-person', count: 52, cats: ['expeditions', 'water', 'basecamp'] },
    { id: 'conservation', count: 31, cats: ['forests', 'water', 'skies'] },
    { id: 'maps-and-routes', count: 24, cats: ['expeditions', 'basecamp', 'deserts'] },
]

const totalStories = categories.reduce((sum, c) => sum + c.count, 0)
const pad = (n) => String(n).padStart(2, '0')

export function CategoryTilesTagCloud({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [active, setActive] = useState(0)
    const [picked, setPicked] = useState([])

    const pickedTags = fieldTags.filter((t) => picked.includes(t.id))
    const litIds = new Set(pickedTags.flatMap((t) => t.cats))
    const tagged = pickedTags.reduce((sum, t) => sum + t.count, 0)
    const litNames = categories.filter((c) => litIds.has(c.id)).map((c) => c.name)

    const toggle = (id) => setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#1f241c] px-4 py-16 text-base font-normal text-[#efe6d0] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#d9c9a3]">
                            <svg viewBox="0 0 28 18" aria-hidden="true" className="h-4 w-7">
                                <path d="M1 17 L10 3 L15 10 L19 5 L27 17 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                            Outpost · Field-tested since 2014
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#efe6d0] sm:text-5xl lg:text-6xl">
                            Six directions. <span className="italic text-[#d9c9a3]">Pick one and go.</span>
                        </h2>
                    </div>
                    <div className="md:max-w-xs md:text-right">
                        <p className="font-serif text-5xl leading-none tabular-nums text-[#d9c9a3]">{totalStories}</p>
                        <p className="mt-2 text-sm leading-relaxed text-[#efe6d0]/65">
                            stories filed from six kinds of wild places, by 140 writers and photographers.
                        </p>
                    </div>
                </div>

                <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:h-[540px]">
                    {categories.map((cat, index) => {
                        const isActive = active === index
                        const dim = picked.length > 0 && !litIds.has(cat.id)
                        return (
                            <li
                                key={cat.id}
                                className={cn(
                                    'min-w-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                                    isActive ? 'lg:flex-[3.4_1_0%]' : 'lg:flex-[1_1_0%]',
                                )}
                            >
                                <a
                                    href={`#outpost-${cat.id}`}
                                    className={cn(
                                        'group relative isolate block aspect-[3/4] overflow-hidden rounded-[18px] bg-[#2b3226] transition-[opacity,filter] duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9c9a3] sm:aspect-[4/5] lg:aspect-auto lg:h-full',
                                        dim && 'opacity-40 grayscale',
                                    )}
                                    onMouseEnter={() => setActive(index)}
                                    onFocus={() => setActive(index)}
                                >
                                    <img
                                        src={cat.image}
                                        alt={cat.alt}
                                        loading="lazy"
                                        className="absolute inset-0 -z-10 h-full w-full object-cover saturate-[0.8] sepia-[0.15] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 -z-10 bg-linear-to-t from-[#1f241c]/95 via-[#1f241c]/25 to-[#1f241c]/10"
                                    />

                                    <span className="absolute left-3 top-3 font-mono text-[11px] tracking-[0.2em] text-[#efe6d0]/85 sm:left-4 sm:top-4">
                                        {pad(index + 1)}
                                    </span>
                                    <span className="absolute right-3 top-3 rounded-full bg-[#1f241c]/60 px-2.5 py-1 font-mono text-[11px] tabular-nums text-[#efe6d0] backdrop-blur-sm sm:right-4 sm:top-4">
                                        {cat.count}
                                    </span>

                                    <span
                                        className={cn(
                                            'absolute inset-x-0 bottom-0 block p-3 transition-[opacity,transform] duration-500 sm:p-5 lg:p-7 motion-reduce:transition-none',
                                            isActive
                                                ? 'lg:translate-y-0 lg:opacity-100 lg:delay-200'
                                                : 'lg:translate-y-4 lg:opacity-0',
                                        )}
                                    >
                                        <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-[#d9c9a3] lg:block">
                                            {cat.coord}
                                        </span>
                                        <span className="mt-1 block font-serif text-xl leading-tight text-[#efe6d0] sm:text-2xl lg:mt-2 lg:text-4xl">
                                            {cat.name}
                                        </span>
                                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#efe6d0]/70 lg:hidden">
                                            {cat.count} stories
                                        </span>
                                        <span className="mt-3 hidden max-w-sm text-sm leading-relaxed text-[#efe6d0]/80 lg:block">
                                            {cat.blurb}
                                        </span>
                                        <span className="mt-5 hidden items-center gap-2 text-sm font-semibold text-[#d9c9a3] lg:inline-flex">
                                            Explore {cat.count} stories
                                            <HiArrowUpRight aria-hidden="true" className="size-4" />
                                        </span>
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'absolute bottom-7 left-1/2 hidden -translate-x-1/2 transition-opacity duration-300 lg:block',
                                            isActive ? 'lg:opacity-0' : 'lg:opacity-100',
                                        )}
                                    >
                                        <span className="block rotate-180 whitespace-nowrap font-serif text-2xl text-[#efe6d0] [writing-mode:vertical-rl]">
                                            {cat.name}
                                        </span>
                                    </span>
                                </a>
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-12 border-t border-[#efe6d0]/15 pt-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#d9c9a3]">Field tags</p>
                        <p aria-live="polite" className="text-sm text-[#efe6d0]/70">
                            {picked.length
                                ? `${tagged} tagged stories across ${litNames.join(', ')}`
                                : 'Tap a tag to light up where it lives.'}
                        </p>
                    </div>
                    <ul aria-label="Field tags" className="mt-5 flex flex-wrap gap-2">
                        {fieldTags.map((tag) => {
                            const on = picked.includes(tag.id)
                            return (
                                <li key={tag.id}>
                                    <button
                                        type="button"
                                        aria-pressed={on}
                                        className={cn(
                                            'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 font-mono text-[13px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c9a3]',
                                            on
                                                ? 'border-[#d9c9a3] bg-[#d9c9a3] text-[#1f241c]'
                                                : 'border-[#efe6d0]/20 text-[#efe6d0]/85 hover:border-[#d9c9a3]/70 hover:text-[#efe6d0]',
                                        )}
                                        onClick={() => toggle(tag.id)}
                                    >
                                        <span>#{tag.id}</span>
                                        <span className={cn('text-[11px] tabular-nums', on ? 'text-[#1f241c]/70' : 'text-[#efe6d0]/45')}>
                                            {tag.count}
                                        </span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <a
                            href="#outpost-archive"
                            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d9c9a3] px-6 text-sm font-semibold text-[#1f241c] transition-colors hover:bg-[#e8dcbf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c9a3]"
                        >
                            Browse every story
                            <HiArrowLongRight
                                aria-hidden="true"
                                className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                            />
                        </a>
                        {picked.length > 0 && (
                            <button
                                type="button"
                                className="min-h-11 px-1 text-sm font-medium text-[#efe6d0]/70 underline underline-offset-4 hover:text-[#efe6d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c9a3]"
                                onClick={() => setPicked([])}
                            >
                                Clear tags
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategoryTilesTagCloud

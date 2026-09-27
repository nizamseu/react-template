// IconTileFacetedFilters

// FacetedFilters05 · Directories & Search Aggregators › Faceted Sidebar Filters

// Description:
// A moody, nightlife-flavoured discovery page for the local app Callout. Under "Pick a
// category. Set the vibe." a sidebar of eight icon tiles (Food, Coffee, Nightlife,
// Wellness, Fitness, Shopping, Arts, Services) and ambience chips (Cozy, Lively, Romantic,
// Rooftop, Late night…) works as multi-select facets, with a "Match any / all vibes" switch.
// Poster-style photo cards update live. Use it for "things to do" or city-guide browse pages.

// Design:
// - Deep violet #2e1065 section with pink #f472b6 accents and blurred pink/indigo glows
//   (clipped in their own layer so the sidebar can stay sticky); white heading
//   text-4xl → lg:text-6xl whose second sentence is pink
// - Sidebar panel: rounded-[32px] white/5 glass card; 4-column grid of square icon tiles
//   (white/5 → pink fill with dark icon and a check badge when selected) showing live
//   counts; ambience chips are rounded-full outlines that fill pink when on
// - Match any / all: a two-option segmented radio group under the chips
// - Poster cards: 4:3 (phone) / 4:5 photos with a violet gradient, pink category label,
//   name, area · rating · price and ambience tags overlaid; hover zooms the photo
// - Responsive: sidebar stacks above the grid below lg and becomes a 380px sticky column at
//   lg; cards grid-cols-1 → sm:grid-cols-2 → xl:grid-cols-3; layout animations respect
//   reduced motion

// What it does:
// - Selected categories (OR) and ambience tags (Any = at least one, All = every tag) filter
//   18 places live; tile and chip counts show matches with the other facet applied
// - Tiles and chips are toggle buttons with aria-pressed; "Clear" resets categories and
//   vibes separately; the count line is aria-live
// - Empty state suggests switching to "Match any" (with its count) or clearing everything;
//   cards link to #callout-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IconTileFacetedFilters from '@/TestComponent/PageSections/directory/FacetedFilters05';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <IconTileFacetedFilters />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheck, HiStar } from 'react-icons/hi2';
import { LuCoffee, LuDumbbell, LuFlower2, LuMartini, LuPalette, LuScissors, LuShoppingBag, LuUtensils } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const categories = [
    { id: 'food', label: 'Food', icon: LuUtensils },
    { id: 'coffee', label: 'Coffee', icon: LuCoffee },
    { id: 'nightlife', label: 'Nightlife', icon: LuMartini },
    { id: 'wellness', label: 'Wellness', icon: LuFlower2 },
    { id: 'fitness', label: 'Fitness', icon: LuDumbbell },
    { id: 'shopping', label: 'Shopping', icon: LuShoppingBag },
    { id: 'arts', label: 'Arts', icon: LuPalette },
    { id: 'services', label: 'Services', icon: LuScissors },
]

const vibes = [
    { id: 'cozy', label: 'Cozy' },
    { id: 'lively', label: 'Lively' },
    { id: 'romantic', label: 'Romantic' },
    { id: 'quiet', label: 'Quiet' },
    { id: 'family', label: 'Family-friendly' },
    { id: 'music', label: 'Live music' },
    { id: 'rooftop', label: 'Rooftop' },
    { id: 'late', label: 'Late night' },
    { id: 'gem', label: 'Hidden gem' },
]

const vibeLabel = Object.fromEntries(vibes.map((v) => [v.id, v.label]))
const categoryLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]))

const places = [
    { id: 'green-ladle', name: 'Green Ladle Kitchen', category: 'food', area: 'Gulshan 1', rating: 4.8, price: 2, vibes: ['cozy', 'family'], image: img('1512621776951-a57141f2eefd'), alt: 'Colourful salad bowl' },
    { id: 'kacchi-kotha', name: 'Kacchi Kotha', category: 'food', area: 'Old Dhaka', rating: 4.8, price: 2, vibes: ['lively', 'late', 'family'], image: img('1466978913421-dad2ebd01d17'), alt: 'Friends sharing plates of food around a table' },
    { id: 'ember-room', name: 'Ember Room', category: 'food', area: 'Gulshan 2', rating: 4.9, price: 4, vibes: ['romantic', 'quiet'], image: img('1517248135467-4c7edcad34c4'), alt: 'Dimly lit, modern dining room' },
    { id: 'lakeview', name: 'Lakeview Terrace', category: 'food', area: 'Gulshan 2', rating: 4.4, price: 3, vibes: ['romantic', 'lively'], image: img('1559339352-11d035aa65de'), alt: 'Waterfront terrace with outdoor tables' },
    { id: 'tin-roof', name: 'Tin Roof Coffee', category: 'coffee', area: 'Banani', rating: 4.6, price: 2, vibes: ['cozy', 'lively'], image: img('1521017432531-fbd92d768814'), alt: 'Industrial café with wooden tables' },
    { id: 'drip-lab', name: 'Drip Lab', category: 'coffee', area: 'Gulshan 2', rating: 4.8, price: 3, vibes: ['quiet', 'gem'], image: img('1509042239860-f550ce710b93'), alt: 'Latte art cups among plants' },
    { id: 'monsoon-latte', name: 'Monsoon Latte Bar', category: 'coffee', area: 'Dhanmondi', rating: 4.5, price: 2, vibes: ['cozy', 'romantic'], image: img('1517256064527-09c73fc73e38'), alt: 'Latte in a ceramic cup' },
    { id: 'night-owl', name: 'Night Owl Espresso', category: 'coffee', area: 'Banani', rating: 4.1, price: 2, vibes: ['late', 'gem', 'quiet'], image: img('1503899036084-c55cdd92da26'), alt: 'Neon-lit street at night' },
    { id: 'skyline-27', name: 'Skyline 27', category: 'nightlife', area: 'Gulshan 2', rating: 4.3, price: 4, vibes: ['rooftop', 'lively', 'romantic', 'late'], image: img('1514565131-fce0801e5785'), alt: 'City skyline glowing at dusk' },
    { id: 'terrace-nine', name: 'Terrace Nine', category: 'nightlife', area: 'Banani', rating: 4.2, price: 3, vibes: ['rooftop', 'music', 'lively'], image: img('1485872299829-c673f5194813'), alt: 'Friends raising drinks together' },
    { id: 'vinyl-room', name: 'The Vinyl Room', category: 'nightlife', area: 'Dhanmondi', rating: 4.6, price: 2, vibes: ['music', 'cozy', 'late', 'gem'], image: img('1598488035139-bdbb2231ce04'), alt: 'Music room with guitars on the wall' },
    { id: 'lotus-leaf', name: 'Lotus Leaf Day Spa', category: 'wellness', area: 'Baridhara', rating: 4.7, price: 3, vibes: ['quiet', 'cozy', 'romantic'], image: img('1570172619644-dfd03ed5d881'), alt: 'Facial treatment at a spa' },
    { id: 'lakeside-yoga', name: 'Lakeside Yoga Loft', category: 'wellness', area: 'Dhanmondi', rating: 4.9, price: 2, vibes: ['quiet', 'gem'], image: img('1544367567-0f2fcb009e0b'), alt: 'Silhouette of a yoga pose at sunset' },
    { id: 'iron-tide', name: 'Iron Tide Gym', category: 'fitness', area: 'Tejgaon', rating: 4.6, price: 2, vibes: ['lively', 'late'], image: img('1517836357463-d25dfeac3438'), alt: 'Athlete lifting a barbell' },
    { id: 'pulse-cycle', name: 'Pulse Cycle Studio', category: 'fitness', area: 'Gulshan 1', rating: 4.5, price: 3, vibes: ['lively', 'music'], image: img('1571019613454-1cb2f99b2d8b'), alt: 'Woman doing a core workout on a mat' },
    { id: 'jute-loom', name: 'Jute & Loom', category: 'shopping', area: 'Banani', rating: 4.5, price: 3, vibes: ['cozy', 'gem'], image: img('1441986300917-64674bd600d8'), alt: 'Boutique with rails of clothing' },
    { id: 'shilpo', name: 'Shilpo Gallery Collective', category: 'arts', area: 'Dhanmondi', rating: 4.7, price: 1, vibes: ['quiet', 'gem', 'romantic'], image: img('1515187029135-18ee286d815b'), alt: 'Visitors talking in a gallery' },
    { id: 'chiselled', name: 'Chiselled Barber Co.', category: 'services', area: 'Banani', rating: 4.8, price: 2, vibes: ['lively', 'music'], image: img('1503951914875-452162b0f3f1'), alt: 'Barber cutting a client’s hair' },
]

const matchVibes = (p, selected, mode) =>
    !selected.length || (mode === 'all' ? selected.every((v) => p.vibes.includes(v)) : selected.some((v) => p.vibes.includes(v)))

const runFilter = (cats, vibeIds, mode) => places.filter((p) => (!cats.length || cats.includes(p.category)) && matchVibes(p, vibeIds, mode))

const toggleIn = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

export function IconTileFacetedFilters({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [cats, setCats] = useState(['food', 'nightlife'])
    const [picked, setPicked] = useState(['romantic'])
    const [mode, setMode] = useState('all')

    const results = useMemo(() => runFilter(cats, picked, mode).sort((a, b) => b.rating - a.rating), [cats, picked, mode])
    const anyCount = runFilter(cats, picked, 'any').length

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#2e1065] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#f472b6]/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#6366f1]/20 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#f472b6]">Callout · Browse Dhaka</p>
                        <h2 className="mt-4 text-4xl font-extrabold leading-[1] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                            Pick a category.{' '}
                            <span className="text-[#f472b6]">Set the vibe.</span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-white/65">
                        Vibes are tagged by 12,800 Callout regulars, not by the venues themselves.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
                    <aside aria-label="Filters" className="rounded-[32px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm sm:p-6 lg:sticky lg:top-6">
                        <div className="flex items-center justify-between">
                            <p id={`${uid}-cats`} className="text-sm font-bold text-white">
                                Categories
                            </p>
                            <button
                                type="button"
                                disabled={!cats.length}
                                className="min-h-10 rounded-full px-3 text-xs font-semibold text-[#f472b6] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#f472b6] disabled:text-white/30 disabled:hover:bg-transparent"
                                onClick={() => setCats([])}
                            >
                                Clear
                            </button>
                        </div>
                        <div role="group" aria-labelledby={`${uid}-cats`} className="mt-3 grid grid-cols-4 gap-2">
                            {categories.map((c) => {
                                const on = cats.includes(c.id)
                                const count = runFilter([c.id], picked, mode).length
                                const Icon = c.icon
                                return (
                                    <motion.button
                                        key={c.id}
                                        type="button"
                                        aria-pressed={on}
                                        aria-label={`${c.label}, ${count} places`}
                                        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                                        className={cn(
                                            'relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f472b6]',
                                            on
                                                ? 'border-[#f472b6] bg-[#f472b6] text-[#2e1065] shadow-[0_12px_30px_-10px_rgba(244,114,182,0.7)]'
                                                : 'border-white/10 bg-white/[0.04] text-white hover:border-white/30',
                                        )}
                                        onClick={() => setCats((l) => toggleIn(l, c.id))}
                                    >
                                        {on && (
                                            <span className="absolute right-1 top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#2e1065] text-[#f472b6] sm:right-1.5 sm:top-1.5 sm:h-4 sm:w-4" aria-hidden="true">
                                                <HiCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                            </span>
                                        )}
                                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                                        <span className="text-[11px] font-semibold leading-none">{c.label}</span>
                                        <span className={cn('text-[10px] tabular-nums leading-none', on ? 'text-[#2e1065]/70' : 'text-white/45')} aria-hidden="true">
                                            {count}
                                        </span>
                                    </motion.button>
                                )
                            })}
                        </div>

                        <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                            <p id={`${uid}-vibes`} className="text-sm font-bold text-white">
                                Vibe
                            </p>
                            <button
                                type="button"
                                disabled={!picked.length}
                                className="min-h-10 rounded-full px-3 text-xs font-semibold text-[#f472b6] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#f472b6] disabled:text-white/30 disabled:hover:bg-transparent"
                                onClick={() => setPicked([])}
                            >
                                Clear
                            </button>
                        </div>
                        <div role="group" aria-labelledby={`${uid}-vibes`} className="mt-3 flex flex-wrap gap-2">
                            {vibes.map((v) => {
                                const on = picked.includes(v.id)
                                const count = runFilter(cats, [v.id], 'any').length
                                return (
                                    <button
                                        key={v.id}
                                        type="button"
                                        aria-pressed={on}
                                        className={cn(
                                            'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f472b6]',
                                            on
                                                ? 'border-[#f472b6] bg-[#f472b6] font-semibold text-[#2e1065]'
                                                : 'border-white/20 text-white/85 hover:border-[#f472b6]/70',
                                        )}
                                        onClick={() => setPicked((l) => toggleIn(l, v.id))}
                                    >
                                        {v.label}
                                        <span className={cn('text-[11px] tabular-nums', on ? 'text-[#2e1065]/65' : 'text-white/40')}>{count}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <fieldset className="mt-5">
                            <legend className="text-xs text-white/55">When several vibes are picked, match</legend>
                            <div className="mt-2 inline-grid grid-cols-2 rounded-full border border-white/15 p-1">
                                {[
                                    ['any', 'Any vibe'],
                                    ['all', 'All vibes'],
                                ].map(([id, label]) => (
                                    <label key={id} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`${uid}-mode`}
                                            value={id}
                                            checked={mode === id}
                                            className="peer sr-only"
                                            onChange={() => setMode(id)}
                                        />
                                        <span className="grid min-h-9 place-items-center rounded-full px-4 text-xs font-semibold text-white/70 transition-colors peer-checked:bg-white peer-checked:text-[#2e1065] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#f472b6]">
                                            {label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </aside>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 pb-4">
                            <h3 className="text-2xl font-bold text-white sm:text-3xl" aria-live="polite">
                                <span className="text-[#f472b6]">{results.length}</span> {results.length === 1 ? 'spot matches' : 'spots match'} your vibe
                            </h3>
                            <p className="text-sm text-white/55">
                                {cats.length ? cats.map((c) => categoryLabel[c]).join(' + ') : 'All categories'}
                                {picked.length ? ` · ${picked.map((v) => vibeLabel[v]).join(mode === 'all' ? ' & ' : ' or ')}` : ''}
                            </p>
                        </div>

                        {results.length === 0 ? (
                            <div className="mt-8 rounded-[32px] border border-dashed border-white/20 px-6 py-16 text-center">
                                <p className="text-5xl" aria-hidden="true">
                                    <span className="text-[#f472b6]">✦</span>
                                </p>
                                <p className="mt-4 text-xl font-bold text-white">No spot is all of that at once.</p>
                                <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
                                    Try matching any of your vibes instead of all of them, or start from scratch.
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    {mode === 'all' && picked.length > 1 && (
                                        <button
                                            type="button"
                                            className="min-h-11 rounded-full border border-white/25 px-5 text-sm font-semibold text-white hover:border-[#f472b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f472b6]"
                                            onClick={() => setMode('any')}
                                        >
                                            Match any vibe → {anyCount}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="min-h-11 rounded-full bg-[#f472b6] px-5 text-sm font-bold text-[#2e1065] hover:bg-[#f9a8d4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        onClick={() => {
                                            setCats([])
                                            setPicked([])
                                        }}
                                    >
                                        Clear everything
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {results.map((p) => (
                                        <motion.li
                                            key={p.id}
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <a
                                                href={`#callout-${p.id}`}
                                                className="group relative block aspect-[4/3] overflow-hidden rounded-[28px] sm:aspect-[4/5] bg-[#3b0764] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f472b6]"
                                            >
                                                <img
                                                    src={p.image}
                                                    alt={p.alt}
                                                    loading="lazy"
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                                                />
                                                <span className="absolute inset-0 bg-linear-to-t from-[#2e1065] via-[#2e1065]/40 to-transparent" aria-hidden="true" />
                                                <span className="absolute left-4 top-4 rounded-full bg-[#2e1065]/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f472b6] backdrop-blur">
                                                    {categoryLabel[p.category]}
                                                </span>
                                                <span className="absolute inset-x-0 bottom-0 p-5">
                                                    <span className="block text-xl font-bold leading-tight text-white">{p.name}</span>
                                                    <span className="mt-1 flex items-center gap-1.5 text-sm text-white/75">
                                                        {p.area} ·
                                                        <HiStar className="h-4 w-4 text-[#f472b6]" aria-hidden="true" />
                                                        {p.rating.toFixed(1)} · {'৳'.repeat(p.price)}
                                                    </span>
                                                    <span className="mt-3 flex flex-wrap gap-1.5">
                                                        {p.vibes.map((v) => (
                                                            <span
                                                                key={v}
                                                                className={cn(
                                                                    'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                                                                    picked.includes(v) ? 'bg-[#f472b6] text-[#2e1065]' : 'bg-white/15 text-white',
                                                                )}
                                                            >
                                                                {vibeLabel[v]}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </span>
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

export default IconTileFacetedFilters

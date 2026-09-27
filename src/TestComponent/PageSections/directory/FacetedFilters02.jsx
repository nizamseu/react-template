// RangeRatingFacetedFilters

// FacetedFilters02 · Directories & Search Aggregators › Faceted Sidebar Filters

// Description:
// A dark, instrument-panel style filter column for the directory aggregator Findly. Under
// "Dial it in." visitors drag a dual-thumb price-per-person range over a live price
// histogram, pick a minimum star rating and choose a distance ("Within 1 km" to "Any
// distance"); the list of Dhaka restaurants beside it updates instantly with a count and
// average spend. Use it for food, hotel or service directories where budget and quality matter.

// Design:
// - Navy #0f172a section, lime #bef264 accents, slate text; mono labels and tabular numbers;
//   heading text-4xl → lg:text-6xl with "in." in lime
// - Filter panel: rounded-[28px] #111b30 card split by hairlines; a 19-bin histogram (lime
//   inside the range, white/10 outside) sits on top of a single track with a lime fill
//   between two lime thumbs (two stacked range inputs, thumbs styled via pseudo-elements)
// - Star picker: 44px star buttons with hover preview and a readout ("4.0+ · 13 places");
//   distance: 2×2 grid of radio tiles with lime selected borders
// - Results: rows with a big lime distance figure, name, cuisine · area, a mini price gauge,
//   rating and price; framer-motion layout/AnimatePresence (reduced-motion aware)
// - Responsive: panel stacks above results below lg, becomes a 360px sticky column at lg;
//   row meta wraps under the name on small screens

// What it does:
// - lo/hi price (Tk 200–4,000, step 100, 200 minimum gap), minRating (0–5) and distance
//   (1 / 3 / 5 km / any) are controlled state filtering 24 places; sorted nearest first
// - Star picker is a radiogroup: click, hover preview, ←/→ keys; "Any" clears it
// - Count, average spend and the empty state ("Reset filters" / "Any distance") update
//   live; "Reset" restores the defaults; rows link to #findly-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RangeRatingFacetedFilters from '@/TestComponent/PageSections/directory/FacetedFilters02';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <RangeRatingFacetedFilters />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowPath, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const MIN = 200
const MAX = 4000
const STEP = 100
const GAP = 200
const BIN = 200
const DEFAULTS = { lo: 400, hi: 2400, rating: 4, distance: '5' }

const distances = [
    { id: '1', label: 'Within 1 km', km: 1 },
    { id: '3', label: 'Within 3 km', km: 3 },
    { id: '5', label: 'Within 5 km', km: 5 },
    { id: 'any', label: 'Any distance', km: Infinity },
]

const places = [
    { id: 'drip-lab', name: 'Drip Lab', cuisine: 'Coffee & brunch', area: 'Gulshan 2', pp: 850, rating: 4.8, reviews: 988, km: 0.4 },
    { id: 'forno-lane', name: 'Forno Lane Pizzeria', cuisine: 'Neapolitan pizza', area: 'Gulshan 2', pp: 1400, rating: 4.6, reviews: 932, km: 0.7 },
    { id: 'lakeview', name: 'Lakeview Terrace', cuisine: 'Grill & seafood', area: 'Gulshan 2', pp: 2200, rating: 4.4, reviews: 1050, km: 0.9 },
    { id: 'ember-room', name: 'Ember Room', cuisine: 'Bengali tasting menu', area: 'Gulshan 2', pp: 3800, rating: 4.9, reviews: 418, km: 1.1 },
    { id: 'green-ladle', name: 'Green Ladle Kitchen', cuisine: 'Vegan bowls', area: 'Gulshan 1', pp: 750, rating: 4.8, reviews: 611, km: 1.3 },
    { id: 'ferment-co', name: 'Ferment & Co.', cuisine: 'Korean small plates', area: 'Gulshan 1', pp: 1600, rating: 5.0, reviews: 38, km: 1.5 },
    { id: 'bazaar-grill', name: 'Bazaar Nine Grill', cuisine: 'Kebabs & naan', area: 'Gulshan 1', pp: 600, rating: 4.1, reviews: 802, km: 1.6 },
    { id: 'tin-roof', name: 'Tin Roof Coffee', cuisine: 'Specialty coffee', area: 'Banani', pp: 550, rating: 4.6, reviews: 1622, km: 1.8 },
    { id: 'smash-club', name: 'Smash Club Burgers', cuisine: 'Burgers', area: 'Banani', pp: 700, rating: 4.7, reviews: 1284, km: 2.0 },
    { id: 'tokyo-alley', name: 'Tokyo Alley Ramen', cuisine: 'Ramen', area: 'Banani', pp: 1300, rating: 4.5, reviews: 1403, km: 2.2 },
    { id: 'pita-pan', name: 'Pita Pan', cuisine: 'Lebanese', area: 'Banani', pp: 650, rating: 4.2, reviews: 540, km: 2.3 },
    { id: 'terrace-nine', name: 'Terrace Nine', cuisine: 'Rooftop grill', area: 'Banani', pp: 1900, rating: 4.2, reviews: 870, km: 2.6 },
    { id: 'rare-rested', name: 'Rare & Rested', cuisine: 'Steakhouse', area: 'Baridhara', pp: 3200, rating: 4.5, reviews: 356, km: 2.9 },
    { id: 'skyline-27', name: 'Skyline 27', cuisine: 'Rooftop lounge', area: 'Gulshan 2', pp: 2800, rating: 4.3, reviews: 1310, km: 3.1 },
    { id: 'iron-wok', name: 'Iron Wok Tejgaon', cuisine: 'Thai-Chinese', area: 'Tejgaon', pp: 900, rating: 3.9, reviews: 712, km: 3.8 },
    { id: 'dim-sum-den', name: 'Dim Sum Den', cuisine: 'Cantonese', area: 'Mohakhali', pp: 1100, rating: 4.4, reviews: 764, km: 4.2 },
    { id: 'crumb-co', name: 'Crumb & Co.', cuisine: 'Cakes & coffee', area: 'Bashundhara', pp: 450, rating: 4.4, reviews: 522, km: 4.6 },
    { id: 'seoul-bowl', name: 'Seoul Bowl', cuisine: 'Korean', area: 'Bashundhara', pp: 800, rating: 3.9, reviews: 402, km: 4.9 },
    { id: 'saffron-salt', name: 'Saffron & Salt', cuisine: 'Mughlai', area: 'Dhanmondi', pp: 1500, rating: 4.3, reviews: 977, km: 7.2 },
    { id: 'brick-oven', name: 'Brick Oven Bakehouse', cuisine: 'Bakery', area: 'Dhanmondi', pp: 350, rating: 4.7, reviews: 803, km: 7.4 },
    { id: 'bhorta-bari', name: 'Bhorta Bari', cuisine: 'Home-style Bengali', area: 'Mohammadpur', pp: 300, rating: 4.6, reviews: 1874, km: 8.1 },
    { id: 'kacchi-kotha', name: 'Kacchi Kotha', cuisine: 'Biryani', area: 'Old Dhaka', pp: 450, rating: 4.8, reviews: 5120, km: 9.6 },
    { id: 'hilsa-house', name: 'Hilsa House', cuisine: 'River fish', area: 'Mirpur', pp: 1000, rating: 4.5, reviews: 689, km: 9.9 },
    { id: 'two-cups', name: 'Two Cups Café', cuisine: 'Neighbourhood café', area: 'Uttara', pp: 400, rating: 4.3, reviews: 390, km: 12.4 },
]

const bins = Array.from({ length: (MAX - MIN) / BIN }, (_, i) => {
    const from = MIN + i * BIN
    return { from, to: from + BIN, count: places.filter((p) => p.pp >= from && p.pp < from + BIN).length }
})
const maxBin = Math.max(...bins.map((b) => b.count))

const taka = (n) => `৳${n.toLocaleString('en-US')}`
const pct = (v) => ((v - MIN) / (MAX - MIN)) * 100

const runFilter = ({ lo, hi, rating, distance }) => {
    const km = distances.find((d) => d.id === distance)?.km ?? Infinity
    return places.filter((p) => p.pp >= lo && p.pp <= hi && p.rating >= rating && p.km <= km)
}

const thumbClass =
    'pointer-events-none absolute inset-x-0 top-1/2 h-10 w-full -translate-y-1/2 appearance-none bg-transparent focus:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#0f172a] [&::-moz-range-thumb]:bg-[#bef264] [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-[#0f172a] [&::-webkit-slider-thumb]:bg-[#bef264] [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_#bef264] focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_2px_#bef264,0_0_0_8px_rgba(190,242,100,0.3)] focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_6px_rgba(190,242,100,0.35)]'

export function RangeRatingFacetedFilters({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [lo, setLo] = useState(DEFAULTS.lo)
    const [hi, setHi] = useState(DEFAULTS.hi)
    const [rating, setRating] = useState(DEFAULTS.rating)
    const [hoverRating, setHoverRating] = useState(0)
    const [distance, setDistance] = useState(DEFAULTS.distance)
    const starRefs = useRef([])

    const results = useMemo(() => runFilter({ lo, hi, rating, distance }).sort((a, b) => a.km - b.km), [lo, hi, rating, distance])
    const average = results.length ? Math.round(results.reduce((s, p) => s + p.pp, 0) / results.length / 10) * 10 : 0
    const isDefault = lo === DEFAULTS.lo && hi === DEFAULTS.hi && rating === DEFAULTS.rating && distance === DEFAULTS.distance
    const shownRating = hoverRating || rating
    const ratingCount = (r) => runFilter({ lo, hi, rating: r, distance }).length

    const reset = () => {
        setLo(DEFAULTS.lo)
        setHi(DEFAULTS.hi)
        setRating(DEFAULTS.rating)
        setDistance(DEFAULTS.distance)
    }

    const onStarKey = (event) => {
        const keys = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
        if (!(event.key in keys)) return
        event.preventDefault()
        const next = Math.min(5, Math.max(1, (rating || 0) + keys[event.key]))
        setRating(next)
        starRefs.current[next - 1]?.focus()
    }

    const labelClass = 'font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#0f172a] px-4 py-16 text-base font-normal text-slate-200 sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#bef264]">Findly / Filters</p>
                        <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                            Dial it <span className="text-[#bef264]">in.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-slate-400">
                        Prices are the average spend per person, drinks included, from 31,400 receipts
                        shared by Findly members this year.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
                    <aside aria-label="Filters" className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111b30] lg:sticky lg:top-6">
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                            <p className="text-sm font-bold text-white">Filters</p>
                            <button
                                type="button"
                                disabled={isDefault}
                                className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#bef264] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#bef264] disabled:cursor-default disabled:text-slate-600 disabled:hover:bg-transparent"
                                onClick={reset}
                            >
                                <HiArrowPath className="h-3.5 w-3.5" aria-hidden="true" />
                                Reset
                            </button>
                        </div>

                        <fieldset className="border-b border-white/10 px-6 py-6">
                            <legend className="sr-only">Price per person</legend>
                            <div className="flex items-baseline justify-between">
                                <p className={labelClass} aria-hidden="true">
                                    Price / person
                                </p>
                                <p className="font-mono text-sm font-semibold tabular-nums text-white">
                                    {taka(lo)} – {hi >= MAX ? `${taka(MAX)}+` : taka(hi)}
                                </p>
                            </div>
                            <div className="mt-5 flex h-16 items-end gap-[3px]" aria-hidden="true">
                                {bins.map((b) => (
                                    <span
                                        key={b.from}
                                        className={cn(
                                            'flex-1 rounded-t-[3px] transition-colors duration-300',
                                            b.to > lo && b.from <= hi ? 'bg-[#bef264]' : 'bg-white/10',
                                        )}
                                        style={{ height: `${b.count ? 14 + (b.count / maxBin) * 86 : 6}%` }}
                                    />
                                ))}
                            </div>
                            <div className="relative h-10">
                                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/10" aria-hidden="true" />
                                <div
                                    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#bef264]"
                                    style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
                                    aria-hidden="true"
                                />
                                <input
                                    type="range"
                                    min={MIN}
                                    max={MAX}
                                    step={STEP}
                                    value={lo}
                                    aria-label="Minimum price per person"
                                    aria-valuetext={taka(lo)}
                                    className={thumbClass}
                                    onChange={(e) => setLo(Math.min(Number(e.target.value), hi - GAP))}
                                />
                                <input
                                    type="range"
                                    min={MIN}
                                    max={MAX}
                                    step={STEP}
                                    value={hi}
                                    aria-label="Maximum price per person"
                                    aria-valuetext={hi >= MAX ? `${taka(MAX)} or more` : taka(hi)}
                                    className={thumbClass}
                                    onChange={(e) => setHi(Math.max(Number(e.target.value), lo + GAP))}
                                />
                            </div>
                            <div className="flex justify-between font-mono text-[11px] text-slate-500" aria-hidden="true">
                                <span>{taka(MIN)}</span>
                                <span>{taka(MAX)}+</span>
                            </div>
                        </fieldset>

                        <div className="border-b border-white/10 px-6 py-6">
                            <div className="flex items-baseline justify-between">
                                <p id={`${uid}-rating-label`} className={labelClass}>
                                    Minimum rating
                                </p>
                                <p className="font-mono text-sm tabular-nums text-white">
                                    {shownRating ? `${shownRating.toFixed(1)}+` : 'Any'}
                                    <span className="text-slate-500"> · {ratingCount(shownRating)} places</span>
                                </p>
                            </div>
                            <div className="mt-4 flex items-center gap-1">
                                <div
                                    role="radiogroup"
                                    aria-labelledby={`${uid}-rating-label`}
                                    className="flex"
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            ref={(el) => {
                                                starRefs.current[n - 1] = el
                                            }}
                                            type="button"
                                            role="radio"
                                            aria-checked={rating === n}
                                            aria-label={n === 5 ? '5.0 stars only' : `${n}.0 stars and up`}
                                            tabIndex={rating === n || (!rating && n === 1) ? 0 : -1}
                                            className="grid h-11 w-11 place-items-center rounded-xl focus-visible:outline-2 focus-visible:outline-[#bef264]"
                                            onClick={() => setRating(n)}
                                            onMouseEnter={() => setHoverRating(n)}
                                            onKeyDown={onStarKey}
                                        >
                                            <HiStar
                                                className={cn(
                                                    'h-8 w-8 transition-all duration-200',
                                                    n <= shownRating ? 'scale-100 text-[#bef264]' : 'scale-90 text-white/15',
                                                )}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    aria-pressed={rating === 0}
                                    className={cn(
                                        'ml-auto min-h-10 rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.16em] focus-visible:outline-2 focus-visible:outline-[#bef264]',
                                        rating === 0 ? 'border-[#bef264] text-[#bef264]' : 'border-white/15 text-slate-400 hover:text-white',
                                    )}
                                    onClick={() => setRating(0)}
                                >
                                    Any
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            <p id={`${uid}-distance-label`} className={labelClass}>
                                Distance from Gulshan 2
                            </p>
                            <div role="radiogroup" aria-labelledby={`${uid}-distance-label`} className="mt-4 grid grid-cols-2 gap-2">
                                {distances.map((d) => {
                                    const count = runFilter({ lo, hi, rating, distance: d.id }).length
                                    return (
                                        <label key={d.id} className="relative cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`${uid}-distance`}
                                                value={d.id}
                                                checked={distance === d.id}
                                                className="peer sr-only"
                                                onChange={() => setDistance(d.id)}
                                            />
                                            <span className="flex min-h-16 flex-col justify-center rounded-2xl border border-white/10 px-4 py-3 transition-colors hover:border-white/30 peer-checked:border-[#bef264] peer-checked:bg-[#bef264]/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#bef264]">
                                                <span className="text-sm font-semibold text-white">{d.label}</span>
                                                <span className="font-mono text-[11px] text-slate-400">{count} places</span>
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
                            <h3 className="text-2xl font-bold text-white sm:text-3xl" aria-live="polite">
                                <span className="text-[#bef264]">{results.length}</span> {results.length === 1 ? 'match' : 'matches'}
                                <span className="font-normal text-slate-500"> / {places.length}</span>
                            </h3>
                            {results.length > 0 && (
                                <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
                                    Avg {taka(average)} pp · nearest first
                                </p>
                            )}
                        </div>

                        {results.length === 0 ? (
                            <div className="mt-6 rounded-[28px] border border-dashed border-white/15 px-6 py-16 text-center">
                                <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#bef264]">No signal</p>
                                <p className="mt-3 text-xl font-bold text-white">Nothing fits that budget, rating and radius.</p>
                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                                    Widen the price range, drop a star, or look a little further out.
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    {distance !== 'any' && (
                                        <button
                                            type="button"
                                            className="min-h-11 rounded-full border border-white/20 px-5 text-sm font-semibold text-white hover:border-[#bef264] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bef264]"
                                            onClick={() => setDistance('any')}
                                        >
                                            Any distance
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="min-h-11 rounded-full bg-[#bef264] px-5 text-sm font-bold text-[#0f172a] hover:bg-[#d9f99d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        onClick={reset}
                                    >
                                        Reset filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-white/10">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {results.map((p) => (
                                        <motion.li
                                            key={p.id}
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.22 }}
                                        >
                                            <a
                                                href={`#findly-${p.id}`}
                                                className="group grid grid-cols-[4.5rem_1fr] items-center gap-x-4 gap-y-3 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bef264] sm:grid-cols-[5.5rem_1fr_auto]"
                                            >
                                                <p className="font-mono text-2xl font-bold leading-none tabular-nums text-[#bef264] sm:text-3xl">
                                                    {p.km.toFixed(1)}
                                                    <span className="ml-0.5 text-xs text-slate-500">km</span>
                                                </p>
                                                <div className="min-w-0">
                                                    <p className="truncate text-lg font-bold text-white group-hover:text-[#bef264]">{p.name}</p>
                                                    <p className="truncate text-sm text-slate-400">
                                                        {p.cuisine} · {p.area}
                                                    </p>
                                                </div>
                                                <div className="col-span-2 flex items-center gap-5 sm:col-span-1 sm:justify-end">
                                                    <div className="w-20" aria-hidden="true">
                                                        <div className="relative h-1 rounded-full bg-white/10">
                                                            <span
                                                                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bef264]"
                                                                style={{ left: `${Math.min(100, pct(p.pp))}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="font-mono text-sm tabular-nums text-white">{taka(p.pp)}</p>
                                                    <p className="inline-flex items-center gap-1 font-mono text-sm tabular-nums text-white">
                                                        <HiStar className="h-4 w-4 text-[#bef264]" aria-hidden="true" />
                                                        {p.rating.toFixed(1)}
                                                        <span className="text-slate-500">({p.reviews.toLocaleString('en-US')})</span>
                                                    </p>
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

export default RangeRatingFacetedFilters

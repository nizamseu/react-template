// SwitchBoardFacetedFilters

// FacetedFilters04 · Directories & Search Aggregators › Faceted Sidebar Filters

// Description:
// A tactile "switchboard" of filters for Yardstick Reviews. Under the heading "Flip a
// switch. Keep the good ones." four large toggle tiles (Open now, Verified, Accepts cards,
// Pet friendly) each preview how many businesses they would leave, and a segmented control
// sorts the results (Best match, Top rated, Most reviewed, Nearest). Cards glide into their
// new order. Use it for review directories and local shortlists with a few yes/no facets.

// Design:
// - White section with a soft emerald #059669 wash at the top, ink #0b1f17 text; heavy sans
//   heading text-4xl → lg:text-6xl with "switch" in emerald
// - Switch board: a rounded-[32px] #f4f8f6 console holding a grid of white tiles
//   (grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4); each tile has an icon, a 52×30px pill
//   switch with a spring-animated knob, a label, a hint and a "→ n results" preview
// - Sort control: rounded-full track with an emerald pill that slides between options via
//   a shared layoutId; scrolls sideways on very narrow screens
// - Results: cards with 16:10 photos, verified badge, big score, amenity pills; reorder with
//   framer-motion layout; sm:grid-cols-2 → lg:grid-cols-3
// - Reduced motion: layout/knob animations are turned off (instant changes)

// What it does:
// - Four switches (role="switch", aria-checked) filter 15 businesses with AND logic; each
//   tile shows what the count would be if it were flipped; Open now starts on
// - Sort is a radiogroup (click or ←/→): Best match weighs score, review volume and distance;
//   others sort by score, review count or distance
// - Count is aria-live; "Reset switches" turns everything off; the empty state lists the
//   switches that are on with one-tap buttons to turn each off; cards link to #yardstick-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SwitchBoardFacetedFilters from '@/TestComponent/PageSections/directory/FacetedFilters04';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <SwitchBoardFacetedFilters />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheckBadge, HiOutlineMapPin } from 'react-icons/hi2';
import { LuClock, LuCreditCard, LuPawPrint, LuShieldCheck } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const switches = [
    { id: 'open', label: 'Open now', hint: 'Hours checked at 7:40 pm', icon: LuClock },
    { id: 'verified', label: 'Verified', hint: 'Owner confirmed by Yardstick', icon: LuShieldCheck },
    { id: 'cards', label: 'Accepts cards', hint: 'Visa, Mastercard, Amex', icon: LuCreditCard },
    { id: 'pets', label: 'Pet friendly', hint: 'Dogs welcome inside', icon: LuPawPrint },
]

const sorts = [
    { id: 'best', label: 'Best match' },
    { id: 'score', label: 'Top rated' },
    { id: 'reviews', label: 'Most reviewed' },
    { id: 'near', label: 'Nearest' },
]

const businesses = [
    { id: 'tin-roof', name: 'Tin Roof Coffee', category: 'Café', area: 'Banani', score: 4.6, reviews: 1622, km: 1.5, open: true, verified: false, cards: true, pets: true, image: img('1521017432531-fbd92d768814'), alt: 'Industrial café interior with wooden tables' },
    { id: 'lakeview', name: 'Lakeview Terrace', category: 'Grill & seafood', area: 'Gulshan 2', score: 4.4, reviews: 1050, km: 0.4, open: true, verified: true, cards: true, pets: false, image: img('1559339352-11d035aa65de'), alt: 'Waterfront restaurant terrace' },
    { id: 'green-ladle', name: 'Green Ladle Kitchen', category: 'Vegan kitchen', area: 'Gulshan 1', score: 4.8, reviews: 611, km: 1.2, open: true, verified: true, cards: true, pets: false, image: img('1512621776951-a57141f2eefd'), alt: 'Colourful salad bowl' },
    { id: 'smash-club', name: 'Smash Club Burgers', category: 'Burgers', area: 'Banani', score: 4.7, reviews: 1284, km: 1.8, open: true, verified: false, cards: true, pets: true, image: img('1568901346375-23c9450c58cd'), alt: 'Cheeseburger on a plate' },
    { id: 'monsoon-latte', name: 'Monsoon Latte Bar', category: 'Café', area: 'Dhanmondi', score: 4.5, reviews: 740, km: 7.8, open: true, verified: true, cards: false, pets: true, image: img('1517256064527-09c73fc73e38'), alt: 'Latte in a ceramic cup' },
    { id: 'chiselled', name: 'Chiselled Barber Co.', category: 'Barbershop', area: 'Banani', score: 4.8, reviews: 566, km: 1.6, open: true, verified: true, cards: true, pets: false, image: img('1503951914875-452162b0f3f1'), alt: 'Barber trimming a client’s hair' },
    { id: 'lotus-leaf', name: 'Lotus Leaf Day Spa', category: 'Spa & facials', area: 'Baridhara', score: 4.7, reviews: 288, km: 1.9, open: false, verified: true, cards: true, pets: false, image: img('1570172619644-dfd03ed5d881'), alt: 'Facial treatment in a spa' },
    { id: 'iron-tide', name: 'Iron Tide Gym', category: 'Strength gym', area: 'Tejgaon', score: 4.6, reviews: 455, km: 3.8, open: true, verified: false, cards: true, pets: false, image: img('1517836357463-d25dfeac3438'), alt: 'Athlete lifting a barbell' },
    { id: 'lakeside-yoga', name: 'Lakeside Yoga Loft', category: 'Yoga studio', area: 'Dhanmondi', score: 4.9, reviews: 212, km: 7.1, open: false, verified: true, cards: false, pets: false, image: img('1544367567-0f2fcb009e0b'), alt: 'Yoga silhouette at sunset' },
    { id: 'paper-boat', name: 'Paper Boat Books', category: 'Bookshop', area: 'Dhanmondi', score: 4.8, reviews: 1190, km: 7.3, open: true, verified: true, cards: true, pets: false, image: img('1521587760476-6c12a4b040da'), alt: 'Bookshelves full of books' },
    { id: 'jute-loom', name: 'Jute & Loom', category: 'Handloom boutique', area: 'Banani', score: 4.5, reviews: 340, km: 1.7, open: true, verified: true, cards: true, pets: false, image: img('1441986300917-64674bd600d8'), alt: 'Boutique interior with clothing rails' },
    { id: 'bazaar-nine', name: 'Bazaar Nine Grocers', category: 'Organic grocer', area: 'Gulshan 1', score: 4.4, reviews: 702, km: 1.1, open: true, verified: false, cards: true, pets: true, image: img('1542838132-92c53300491e'), alt: 'Shelves of fresh produce' },
    { id: 'desk-collective', name: 'The Desk Collective', category: 'Coworking', area: 'Gulshan 1', score: 4.7, reviews: 298, km: 0.9, open: false, verified: true, cards: true, pets: true, image: img('1497215728101-856f4ea42174'), alt: 'Bright office with plants and desks' },
    { id: 'cha-cartel', name: 'Cha Cartel', category: 'Tea stall', area: 'Dhanmondi', score: 4.7, reviews: 2210, km: 7.6, open: true, verified: false, cards: false, pets: true, image: img('1495474472287-4d71bcdd2085'), alt: 'Two milky drinks on a table' },
    { id: 'thread-count', name: 'Thread Count Tailors', category: 'Tailor & alterations', area: 'Gulshan 2', score: 4.3, reviews: 187, km: 0.7, open: false, verified: true, cards: false, pets: false, image: img('1567401893414-76b7b1e5a7a5'), alt: 'Clothing racks inside a boutique' },
]

const filterBy = (on) => businesses.filter((b) => on.every((id) => b[id]))

const sorters = {
    best: (a, b) => b.score * Math.log10(b.reviews) - b.km * 0.12 - (a.score * Math.log10(a.reviews) - a.km * 0.12),
    score: (a, b) => b.score - a.score || b.reviews - a.reviews,
    reviews: (a, b) => b.reviews - a.reviews,
    near: (a, b) => a.km - b.km,
}

export function SwitchBoardFacetedFilters({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [on, setOn] = useState(['open'])
    const [sort, setSort] = useState('best')
    const sortRefs = useRef([])

    const results = useMemo(() => filterBy(on).sort(sorters[sort]), [on, sort])
    const flip = (id) => setOn((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))

    const onSortKey = (event, index) => {
        const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
        if (!delta) return
        event.preventDefault()
        const next = (index + delta + sorts.length) % sorts.length
        setSort(sorts[next].id)
        sortRefs.current[next]?.focus()
    }

    const spring = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 600, damping: 34 }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0b1f17] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-linear-to-b from-[#ecfdf5] to-transparent" aria-hidden="true" />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#047857]">Yardstick Reviews · Shortlist builder</p>
                        <h2 className="mt-4 text-4xl font-black leading-[1] tracking-[-0.035em] text-[#0b1f17] sm:text-5xl lg:text-6xl">
                            Flip a <span className="text-[#059669]">switch.</span> Keep the good ones.
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[#0b1f17]/65">
                        Every switch is checked against owner-confirmed data and the last 90 days of
                        reviews in Gulshan, Banani and Dhanmondi.
                    </p>
                </div>

                <div className="mt-10 rounded-[32px] border border-[#0b1f17]/[0.06] bg-[#f4f8f6] p-3 sm:p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {switches.map((s) => {
                            const active = on.includes(s.id)
                            const preview = filterBy(active ? on.filter((x) => x !== s.id) : [...on, s.id]).length
                            const Icon = s.icon
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    role="switch"
                                    aria-checked={active}
                                    className={cn(
                                        'group flex flex-col rounded-3xl border bg-white p-5 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]',
                                        active
                                            ? 'border-[#059669] shadow-[0_18px_40px_-24px_rgba(5,150,105,0.7)]'
                                            : 'border-transparent shadow-[0_1px_2px_rgba(11,31,23,0.06)] hover:border-[#0b1f17]/15',
                                    )}
                                    onClick={() => flip(s.id)}
                                >
                                    <span className="flex w-full items-center justify-between">
                                        <span
                                            className={cn(
                                                'grid h-11 w-11 place-items-center rounded-2xl transition-colors',
                                                active ? 'bg-[#059669] text-white' : 'bg-[#ecfdf5] text-[#047857]',
                                            )}
                                            aria-hidden="true"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span
                                            className={cn(
                                                'flex h-[30px] w-[52px] items-center rounded-full p-[3px] transition-colors',
                                                active ? 'justify-end bg-[#059669]' : 'justify-start bg-[#0b1f17]/15',
                                            )}
                                            aria-hidden="true"
                                        >
                                            <motion.span layout transition={spring} className="h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(11,31,23,0.3)]" />
                                        </span>
                                    </span>
                                    <span className="mt-5 text-lg font-bold text-[#0b1f17]">{s.label}</span>
                                    <span className="mt-0.5 text-sm text-[#0b1f17]/55">{s.hint}</span>
                                    <span className="mt-4 border-t border-[#0b1f17]/[0.08] pt-3 text-xs font-semibold text-[#047857]">
                                        {active ? 'Turn off' : 'Turn on'} → {preview} {preview === 1 ? 'result' : 'results'}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-black tracking-tight text-[#0b1f17]" aria-live="polite">
                            {results.length} <span className="font-semibold text-[#0b1f17]/50">{results.length === 1 ? 'business' : 'businesses'}</span>
                        </h3>
                        {on.length > 0 && (
                            <button
                                type="button"
                                className="min-h-10 rounded-full px-3 text-sm font-semibold text-[#047857] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#059669]"
                                onClick={() => setOn([])}
                            >
                                Reset switches
                            </button>
                        )}
                    </div>
                    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                        <div
                            role="radiogroup"
                            aria-label="Sort results"
                            className="inline-flex rounded-full border border-[#0b1f17]/10 bg-[#f4f8f6] p-1"
                        >
                            {sorts.map((s, i) => {
                                const active = sort === s.id
                                return (
                                    <button
                                        key={s.id}
                                        ref={(el) => {
                                            sortRefs.current[i] = el
                                        }}
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        tabIndex={active ? 0 : -1}
                                        className={cn(
                                            'relative min-h-10 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]',
                                            active ? 'text-white' : 'text-[#0b1f17]/70 hover:text-[#0b1f17]',
                                        )}
                                        onClick={() => setSort(s.id)}
                                        onKeyDown={(e) => onSortKey(e, i)}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId={`${uid}-sort-pill`}
                                                transition={spring}
                                                className="absolute inset-0 rounded-full bg-[#059669]"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span className="relative">{s.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {results.length === 0 ? (
                    <div className="mt-8 rounded-[32px] border-2 border-dashed border-[#0b1f17]/10 px-6 py-16 text-center">
                        <p className="text-xl font-bold text-[#0b1f17]">Every switch on, nobody left standing.</p>
                        <p className="mx-auto mt-2 max-w-md text-sm text-[#0b1f17]/60">
                            No business in this shortlist meets all {on.length} conditions. Turn one off:
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {switches
                                .filter((s) => on.includes(s.id))
                                .map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        className="min-h-11 rounded-full border border-[#059669] px-5 text-sm font-semibold text-[#047857] hover:bg-[#ecfdf5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]"
                                        onClick={() => flip(s.id)}
                                    >
                                        {s.label} off → {filterBy(on.filter((x) => x !== s.id)).length}
                                    </button>
                                ))}
                        </div>
                    </div>
                ) : (
                    <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence initial={false} mode="popLayout">
                            {results.map((b) => (
                                <motion.li
                                    key={b.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <a
                                        href={`#yardstick-${b.id}`}
                                        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#0b1f17]/[0.08] bg-white transition-shadow hover:shadow-[0_30px_60px_-34px_rgba(11,31,23,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <img src={b.image} alt={b.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            {b.verified && (
                                                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#047857]">
                                                    <HiCheckBadge className="h-4 w-4" aria-hidden="true" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="truncate text-lg font-bold text-[#0b1f17] group-hover:text-[#047857]">{b.name}</p>
                                                    <p className="mt-0.5 flex items-center gap-1 text-sm text-[#0b1f17]/55">
                                                        {b.category} · <HiOutlineMapPin className="h-3.5 w-3.5" aria-hidden="true" /> {b.area}, {b.km} km
                                                    </p>
                                                </div>
                                                <div className="shrink-0 rounded-2xl bg-[#059669] px-2.5 py-1.5 text-center text-white">
                                                    <p className="text-lg font-black leading-none tabular-nums">{b.score.toFixed(1)}</p>
                                                    <p className="mt-0.5 text-[10px] tabular-nums text-white/80">{b.reviews.toLocaleString('en-US')}</p>
                                                </div>
                                            </div>
                                            <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Details">
                                                {switches.map((s) => (
                                                    <li
                                                        key={s.id}
                                                        className={cn(
                                                            'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                                                            b[s.id] && on.includes(s.id) && 'bg-[#059669] text-white',
                                                            b[s.id] && !on.includes(s.id) && 'bg-[#ecfdf5] text-[#047857]',
                                                            !b[s.id] && 'bg-[#0b1f17]/[0.04] text-[#0b1f17]/40',
                                                            !b[s.id] && s.id !== 'open' && 'line-through',
                                                        )}
                                                    >
                                                        {s.id === 'open' && !b.open ? 'Closed now' : s.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </a>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                )}
            </div>
        </section>
    )
}

export default SwitchBoardFacetedFilters

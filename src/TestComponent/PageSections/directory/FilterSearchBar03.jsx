// SentenceBuilderSearchBar

// FilterSearchBar03 · Directories & Search Aggregators › Multi-Filter Search Bar

// Description:
// An editorial, newspaper-style search for the city guide Townguide. Instead of fields, one
// oversized serif sentence does the work: "I’m looking for [coffee] in [Banani] open [now]."
// Each bracket is an inline control, and the numbered guide entries below re-filter as the
// sentence changes, with a live "Townguide found N places" line and one-tap fixes when
// nothing fits. Use it as a playful hero search for a city guide or neighbourhood magazine.

// Design:
// - Cream #fdf6e3 paper, ink #1b1a17 type and red #d62828 accents; a masthead with double
//   ink rules, small-caps edition line and the fixed reference time "Sat · 7:40 pm"
// - The sentence is font-serif text-4xl → sm:text-6xl → lg:text-8xl; each blank is a red
//   italic word on a thick red underline that sizes itself to the text, with the real
//   input/select laid invisibly on top (no fixed widths; focus ring on the blank)
// - Entries: numbered (italic serif red numerals) on thin ink rules, sepia-toned photos
//   that regain colour on hover, small-caps type labels; md:grid-cols-2
// - Entry list animates with framer-motion layout/AnimatePresence (off for reduced motion)
// - Responsive: the sentence wraps naturally at 360px; masthead meta hides below sm;
//   photos shrink from w-36 to w-24 on small screens

// What it does:
// - what (text input), area (select) and when (select: now / late tonight / for breakfast /
//   any time) are controlled state that filter 17 places by tags, neighbourhood and opening
//   hours (checked against the fixed 7:40 pm reference, 11:30 pm, or 8 am)
// - "Try:" buttons drop a word into the first blank; the count line is aria-live
// - Empty state offers fixes ("Open any time", "All of Dhaka", "Clear the first blank"),
//   each showing how many places it would bring back
// - Entry names link to #townguide-<id>; the masthead and rules are decorative

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SentenceBuilderSearchBar from '@/TestComponent/PageSections/directory/FilterSearchBar03';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <SentenceBuilderSearchBar />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

const areas = [
    { id: 'all', label: 'all of Dhaka' },
    { id: 'Banani', label: 'Banani' },
    { id: 'Gulshan', label: 'Gulshan' },
    { id: 'Dhanmondi', label: 'Dhanmondi' },
    { id: 'Old Dhaka', label: 'Old Dhaka' },
    { id: 'Uttara', label: 'Uttara' },
    { id: 'Mirpur', label: 'Mirpur' },
]

const times = [
    { id: 'now', label: 'now', at: 19 * 60 + 40 },
    { id: 'late', label: 'late tonight', at: 23 * 60 + 30 },
    { id: 'breakfast', label: 'for breakfast', at: 8 * 60 },
    { id: 'any', label: 'any time', at: null },
]

const suggestions = ['coffee', 'biryani', 'books', 'rooftop', 'haircut', 'breakfast']

const places = [
    { id: 'tin-roof', name: 'Tin Roof Coffee', type: 'Specialty coffee', area: 'Banani', street: 'Road 17', tags: ['coffee', 'espresso', 'wifi'], open: 480, close: 1380, price: '৳৳', note: 'Order the jaggery cold brew and sit upstairs.', image: img('1521017432531-fbd92d768814'), alt: 'Industrial café with long wooden tables' },
    { id: 'drip-lab', name: 'Drip Lab', type: 'Pour-over bar', area: 'Gulshan', street: 'Road 55, Gulshan 2', tags: ['coffee', 'pour over', 'brunch', 'breakfast'], open: 540, close: 1320, price: '৳৳৳', note: 'Single-origin beans from the Chittagong Hill Tracts.', image: img('1509042239860-f550ce710b93'), alt: 'Cups with latte art among potted plants' },
    { id: 'cha-cartel', name: 'Cha Cartel', type: 'Tea & coffee stall', area: 'Dhanmondi', street: 'Road 8/A', tags: ['tea', 'coffee', 'snacks'], open: 960, close: 60, price: '৳', note: 'Malai cha in clay cups until 1 am.', image: img('1495474472287-4d71bcdd2085'), alt: 'Two milky coffees on a café table' },
    { id: 'monsoon-latte', name: 'Monsoon Latte Bar', type: 'Coffee & desserts', area: 'Dhanmondi', street: 'Satmasjid Road', tags: ['coffee', 'dessert', 'latte'], open: 660, close: 1350, price: '৳৳', note: 'The date-palm latte is worth the queue.', image: img('1517256064527-09c73fc73e38'), alt: 'Latte in a ceramic cup' },
    { id: 'two-cups', name: 'Two Cups Café', type: 'Neighbourhood café', area: 'Uttara', street: 'Sector 7, Road 18', tags: ['coffee', 'breakfast', 'eggs'], open: 450, close: 1320, price: '৳', note: 'Paratha egg rolls and a quiet window seat.', image: img('1555396273-367ea4eb4db5'), alt: 'Warm industrial café interior with hanging lights' },
    { id: 'night-owl', name: 'Night Owl Espresso', type: 'Late-night coffee', area: 'Banani', street: 'Road 11', tags: ['coffee', 'late night', 'espresso'], open: 1080, close: 180, price: '৳৳', note: 'Opens at six, pulls shots until three.', image: img('1447933601403-0c6688de566e'), alt: 'Roasted coffee beans close-up' },
    { id: 'kacchi-kotha', name: 'Kacchi Kotha', type: 'Biryani house', area: 'Old Dhaka', street: 'Nazira Bazar Lane', tags: ['biryani', 'kacchi', 'bengali', 'late night'], open: 720, close: 60, price: '৳৳', note: 'Mutton kacchi, borhani, and nothing else needed.', image: img('1466978913421-dad2ebd01d17'), alt: 'Friends sharing plates of food around a table' },
    { id: 'nazira-tehari', name: 'Nazira Tehari Ghar', type: 'Tehari & breakfast', area: 'Old Dhaka', street: 'Bangshal Road', tags: ['biryani', 'tehari', 'breakfast', 'bengali'], open: 420, close: 900, price: '৳', note: 'Beef tehari at 7 am, sold out by two.', image: img('1504674900247-0877df9cc836'), alt: 'Bowls of food laid out on a table from above' },
    { id: 'bhorta-bari', name: 'Bhorta Bari', type: 'Home-style Bengali', area: 'Mirpur', street: 'Section 10, Road 3', tags: ['bengali', 'bhorta', 'lunch'], open: 720, close: 1320, price: '৳', note: 'Twenty-two bhortas, rice refilled for free.', image: img('1498837167922-ddd27525d352'), alt: 'Colourful small bowls of ingredients from above' },
    { id: 'tokyo-alley', name: 'Tokyo Alley Ramen', type: 'Ramen counter', area: 'Banani', street: 'Road 27, Block K', tags: ['ramen', 'japanese', 'noodles'], open: 720, close: 1410, price: '৳৳৳', note: 'Spicy miso with an extra ajitama egg.', image: img('1503899036084-c55cdd92da26'), alt: 'Neon-lit night street lined with signs' },
    { id: 'paper-boat', name: 'Paper Boat Books', type: 'Bookshop & reading room', area: 'Dhanmondi', street: 'Road 4', tags: ['books', 'reading', 'kids'], open: 600, close: 1260, price: '৳', note: 'Bangla poetry upstairs, kids’ corner below.', image: img('1521587760476-6c12a4b040da'), alt: 'Floor-to-ceiling bookshelves' },
    { id: 'leaf-spine', name: 'Leaf & Spine Books', type: 'Secondhand books', area: 'Gulshan', street: 'Road 90, Gulshan 2', tags: ['books', 'secondhand', 'vinyl'], open: 660, close: 1200, price: '৳', note: 'Tk 150 paperbacks and a crate of old vinyl.', image: img('1497633762265-9d179a990aa6'), alt: 'Stack of colourful books' },
    { id: 'skyline-27', name: 'Skyline 27', type: 'Rooftop lounge', area: 'Gulshan', street: 'Gulshan Avenue', tags: ['rooftop', 'mocktails', 'view', 'late night'], open: 1020, close: 60, price: '৳৳৳৳', note: 'Book the east rail for the lake at sunset.', image: img('1514565131-fce0801e5785'), alt: 'City skyline glowing at dusk' },
    { id: 'terrace-nine', name: 'Terrace Nine', type: 'Rooftop grill', area: 'Banani', street: 'Road 11, 9th floor', tags: ['rooftop', 'grill', 'live music'], open: 1080, close: 1410, price: '৳৳৳', note: 'Live acoustic sets every Thursday.', image: img('1485872299829-c673f5194813'), alt: 'Friends raising drinks at an evening gathering' },
    { id: 'chiselled', name: 'Chiselled Barber Co.', type: 'Barbershop', area: 'Banani', street: 'Road 12', tags: ['haircut', 'barber', 'beard'], open: 600, close: 1260, price: '৳৳', note: 'Hot-towel shave, walk-ins before 5 pm.', image: img('1560066984-138dadb4c035'), alt: 'Black and white barbershop interior with chairs' },
    { id: 'brick-oven', name: 'Brick Oven Bakehouse', type: 'Sourdough bakery', area: 'Dhanmondi', street: 'Road 27', tags: ['bakery', 'breakfast', 'bread', 'coffee'], open: 420, close: 1260, price: '৳', note: 'Loaves out of the oven at 7:30 sharp.', image: img('1509440159596-0249088772ff'), alt: 'Rustic sourdough loaves' },
    { id: 'lakeview', name: 'Lakeview Terrace', type: 'Grill & seafood', area: 'Gulshan', street: 'Gulshan Lake Park', tags: ['seafood', 'grill', 'dinner', 'view'], open: 750, close: 1410, price: '৳৳৳', note: 'Grilled rupchanda right by the water.', image: img('1559339352-11d035aa65de'), alt: 'Waterfront restaurant terrace' },
]

const isOpenAt = (p, t) => (p.close > p.open ? t >= p.open && t < p.close : t >= p.open || t < p.close)

const fmt = (m) => {
    const h24 = Math.floor(m / 60) % 24
    const min = m % 60
    if (h24 === 0 && min === 0) return 'midnight'
    const h = h24 % 12 || 12
    return `${h}${min ? `:${String(min).padStart(2, '0')}` : ''} ${h24 < 12 ? 'am' : 'pm'}`
}

const runFilter = (what, area, when) => {
    const w = what.trim().toLowerCase()
    const at = times.find((t) => t.id === when)?.at ?? null
    return places.filter(
        (p) =>
            (!w || [p.name, p.type, ...p.tags].some((s) => s.toLowerCase().includes(w))) &&
            (area === 'all' || p.area === area) &&
            (at === null || isOpenAt(p, at)),
    )
}

function Blank({ display, children }) {
    return (
        <span className="relative inline-block max-w-full rounded-md align-baseline focus-within:outline-[3px] focus-within:outline-offset-4 focus-within:outline-[#1b1a17]">
            <span
                aria-hidden="true"
                className="block whitespace-pre-wrap border-b-[5px] border-[#d62828] px-1 italic text-[#d62828] [overflow-wrap:anywhere] sm:border-b-[7px]"
            >
                {display}
            </span>
            {children}
        </span>
    )
}

export function SentenceBuilderSearchBar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [what, setWhat] = useState('coffee')
    const [area, setArea] = useState('Banani')
    const [when, setWhen] = useState('now')

    const results = useMemo(() => runFilter(what, area, when), [what, area, when])
    const areaLabel = areas.find((a) => a.id === area)?.label
    const whenLabel = times.find((t) => t.id === when)?.label

    const fixes = [
        when !== 'any' && { id: 'when', label: 'Open any time', count: runFilter(what, area, 'any').length, apply: () => setWhen('any') },
        area !== 'all' && { id: 'area', label: 'All of Dhaka', count: runFilter(what, 'all', when).length, apply: () => setArea('all') },
        what.trim() && { id: 'what', label: 'Clear the first blank', count: runFilter('', area, when).length, apply: () => setWhat('') },
    ].filter(Boolean)

    const controlClass = 'absolute inset-0 h-full w-full min-w-0 cursor-pointer appearance-none bg-transparent text-base opacity-0'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fdf6e3] px-4 py-14 text-base font-normal text-[#1b1a17] sm:px-6 md:py-20 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center justify-between gap-4 border-y-[3px] border-double border-[#1b1a17] py-2 text-[11px] uppercase tracking-[0.26em]">
                    <span className="font-serif text-base font-bold normal-case tracking-tight text-[#1b1a17]">Townguide</span>
                    <span className="hidden sm:inline">The Dhaka Edition · No. 142</span>
                    <span className="text-[#d62828]">Sat · 7:40 pm</span>
                </div>

                <form
                    role="search"
                    aria-label="Build your Townguide search"
                    className="mt-10 md:mt-14"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <h2 className="sr-only text-base font-normal text-[#1b1a17]">Build your search sentence</h2>
                    <p className="font-serif text-4xl font-normal leading-[1.2] tracking-[-0.02em] text-[#1b1a17] sm:text-6xl lg:text-8xl lg:leading-[1.08]">
                        I’m looking for{' '}
                        <Blank display={what || 'anything'}>
                            <label htmlFor={`${uid}-what`} className="sr-only">
                                What are you looking for?
                            </label>
                            <input
                                id={`${uid}-what`}
                                type="text"
                                size={1}
                                value={what}
                                placeholder="anything"
                                autoComplete="off"
                                className="absolute inset-0 h-full w-full min-w-0 bg-transparent px-1 italic text-transparent caret-[#d62828] placeholder:text-transparent focus:outline-none"
                                onChange={(e) => setWhat(e.target.value)}
                            />
                        </Blank>{' '}
                        in{' '}
                        <Blank display={areaLabel}>
                            <label htmlFor={`${uid}-area`} className="sr-only">
                                Neighbourhood
                            </label>
                            <select id={`${uid}-area`} value={area} className={controlClass} onChange={(e) => setArea(e.target.value)}>
                                {areas.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.label}
                                    </option>
                                ))}
                            </select>
                        </Blank>{' '}
                        open{' '}
                        <Blank display={whenLabel}>
                            <label htmlFor={`${uid}-when`} className="sr-only">
                                Open when
                            </label>
                            <select id={`${uid}-when`} value={when} className={controlClass} onChange={(e) => setWhen(e.target.value)}>
                                {times.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </Blank>
                        .
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
                        <span className="mr-1 text-[11px] uppercase tracking-[0.24em] text-[#1b1a17]/60">Try:</span>
                        {suggestions.map((s) => (
                            <button
                                key={s}
                                type="button"
                                aria-pressed={what.trim().toLowerCase() === s}
                                className={cn(
                                    'min-h-10 rounded-full border px-4 font-serif italic transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62828]',
                                    what.trim().toLowerCase() === s
                                        ? 'border-[#d62828] bg-[#d62828] text-[#fdf6e3]'
                                        : 'border-[#1b1a17]/25 text-[#1b1a17] hover:border-[#1b1a17]',
                                )}
                                onClick={() => setWhat(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </form>

                <div className="mt-12 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#1b1a17] pb-3">
                    <p className="font-serif text-xl italic text-[#1b1a17] sm:text-2xl" aria-live="polite">
                        Townguide found{' '}
                        <strong className="font-bold not-italic text-[#d62828]">
                            {results.length} {results.length === 1 ? 'place' : 'places'}
                        </strong>{' '}
                        {results.length ? 'that fit.' : '— none fit that sentence.'}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#1b1a17]/60">
                        {what.trim() || 'anything'} · {areaLabel} · open {whenLabel}
                    </p>
                </div>

                {results.length === 0 ? (
                    <div className="py-12 md:py-16">
                        <p className="max-w-xl font-serif text-2xl leading-snug text-[#1b1a17] sm:text-3xl">
                            Our reporters haven’t filed anything for that one. Loosen one blank:
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {fixes.map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    className="group inline-flex min-h-11 items-center gap-2 border border-[#1b1a17] bg-[#fdf6e3] px-5 text-sm font-semibold text-[#1b1a17] shadow-[4px_4px_0_#1b1a17] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#d62828] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d62828]"
                                    onClick={f.apply}
                                >
                                    {f.label}
                                    <HiArrowLongRight className="h-4 w-4" aria-hidden="true" />
                                    <span className="font-serif italic text-[#d62828]">
                                        {f.count} {f.count === 1 ? 'place' : 'places'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <ol className="grid md:grid-cols-2 md:gap-x-10">
                        <AnimatePresence initial={false} mode="popLayout">
                            {results.map((p, i) => (
                                <motion.li
                                    key={p.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="group flex gap-4 border-b border-[#1b1a17]/20 py-6 sm:gap-6"
                                >
                                    <span className="w-8 shrink-0 font-serif text-3xl italic leading-none text-[#d62828] sm:w-10 sm:text-4xl" aria-hidden="true">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#1b1a17]/60">
                                            {p.type} · {p.price}
                                        </p>
                                        <a
                                            href={`#townguide-${p.id}`}
                                            className="mt-1 inline-block font-serif text-2xl font-bold leading-tight text-[#1b1a17] decoration-[#d62828] decoration-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62828]"
                                        >
                                            {p.name}
                                        </a>
                                        <p className="mt-2 font-serif text-base italic leading-snug text-[#1b1a17]/80">“{p.note}”</p>
                                        <p className="mt-3 text-sm text-[#1b1a17]/70">
                                            {p.street}, {p.area} · {p.open === 0 && p.close === 1440 ? 'Open 24 hours' : `${fmt(p.open)} – ${fmt(p.close)}`}
                                        </p>
                                    </div>
                                    <img
                                        src={p.image}
                                        alt={p.alt}
                                        loading="lazy"
                                        className="aspect-[4/5] w-24 shrink-0 self-start object-cover sepia-[.45] transition-[filter] duration-500 group-hover:sepia-0 sm:w-36"
                                    />
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ol>
                )}
            </div>
        </section>
    )
}

export default SentenceBuilderSearchBar

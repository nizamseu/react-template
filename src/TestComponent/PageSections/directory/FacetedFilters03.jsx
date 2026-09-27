// DrawerSheetFacetedFilters

// FacetedFilters03 · Directories & Search Aggregators › Faceted Sidebar Filters

// Description:
// A guidebook-style listings page for the city guide Townguide. Under "The rainy-day
// index" a ruled sidebar of facets (Neighbourhood, Type, Good for, Budget) filters a grid
// of editorial place cards on desktop. On phones and tablets the sidebar becomes a
// "Filters (3)" button that opens a bottom sheet with the same facets and "Reset" /
// "Show N places" actions. Use it for curated city guides, event listings or local roundups.

// Design:
// - Cream #fdf6e3 paper, ink #1b1a17 type and rules, red #d62828 accents; serif display
//   heading text-4xl → lg:text-7xl with an italic red word, small-caps facet legends
// - Sidebar: 260px sticky column with a serif header, square ink checkboxes that fill red,
//   and a 4-step budget scale (Any / ৳ / ৳৳ / ৳৳৳) as a segmented ink control
// - Cards: 3:2 photos with a hard ink offset shadow on hover, red small-caps type label,
//   serif name, one-line blurb and "good for" tags; sm:grid-cols-2 → xl:grid-cols-3
// - Bottom sheet: rounded-t-[28px] cream panel (max 85vh) over a 50% ink backdrop; slides
//   up with framer-motion (fade only for reduced motion) and can be dragged down by its
//   handle to close; scrollable body with a pinned Reset / Show N places footer
// - Responsive: below lg the sidebar hides and the "Filters (n)" button appears; from lg
//   the sidebar sits beside the grid; applied-filter chips show above the grid at all sizes

// What it does:
// - applied filters (neighbourhoods, types, budget, good-for tags) filter 17 places live;
//   neighbourhoods and types are OR'd, good-for tags must all match, budget is a ceiling
// - The sheet edits a draft copy: "Show N places" applies it, "Reset" clears the draft,
//   the close button / backdrop / Escape / drag-down discard it; focus moves into the sheet,
//   Tab is trapped inside, body scroll is locked, focus returns to the trigger on close, and
//   the sheet closes itself if the viewport grows to the desktop (lg) layout
// - Chips remove single values, "Clear all" empties everything; count is aria-live and the
//   empty state offers "Clear all filters"; card titles link to #townguide-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DrawerSheetFacetedFilters from '@/TestComponent/PageSections/directory/FacetedFilters03';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <DrawerSheetFacetedFilters />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'framer-motion';
import { HiCheck, HiOutlineAdjustmentsHorizontal, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const facets = {
    areas: { label: 'Neighbourhood', options: [['Banani', 'Banani'], ['Gulshan', 'Gulshan'], ['Dhanmondi', 'Dhanmondi'], ['Old Dhaka', 'Old Dhaka'], ['Uttara', 'Uttara'], ['Mirpur', 'Mirpur']] },
    types: { label: 'Type', options: [['cafe', 'Cafés'], ['books', 'Bookshops'], ['bakery', 'Bakeries'], ['market', 'Markets'], ['gallery', 'Galleries'], ['food', 'Restaurants']] },
    good: { label: 'Good for', options: [['solo', 'Going solo'], ['dates', 'Dates'], ['groups', 'Groups'], ['kids', 'Kids'], ['rainy', 'Rainy days'], ['late', 'Late night']] },
}

const budgets = [
    { id: 0, label: 'Any' },
    { id: 1, label: '৳' },
    { id: 2, label: '৳৳' },
    { id: 3, label: '৳৳৳' },
]

const typeLabel = Object.fromEntries(facets.types.options)
const goodLabel = Object.fromEntries(facets.good.options)

const places = [
    { id: 'tin-roof', name: 'Tin Roof Coffee', type: 'cafe', area: 'Banani', price: 2, good: ['solo', 'rainy'], blurb: 'Corrugated roof, loud rain, louder espresso machine.', image: img('1521017432531-fbd92d768814'), alt: 'Industrial café with wooden tables and hanging lights' },
    { id: 'monsoon-latte', name: 'Monsoon Latte Bar', type: 'cafe', area: 'Dhanmondi', price: 2, good: ['dates', 'rainy', 'late'], blurb: 'Window booths facing the lake; date-palm lattes till 10:30.', image: img('1517256064527-09c73fc73e38'), alt: 'Latte in a ceramic cup' },
    { id: 'cha-cartel', name: 'Cha Cartel', type: 'cafe', area: 'Dhanmondi', price: 1, good: ['groups', 'late'], blurb: 'Clay-cup malai cha on plastic stools until 1 am.', image: img('1495474472287-4d71bcdd2085'), alt: 'Two milky coffees on a table' },
    { id: 'drip-lab', name: 'Drip Lab', type: 'cafe', area: 'Gulshan', price: 3, good: ['solo', 'dates'], blurb: 'Pour-overs weighed to the gram, quiet by design.', image: img('1509042239860-f550ce710b93'), alt: 'Latte art cups among plants' },
    { id: 'mirpur-tea', name: 'Section 10 Tea Garden', type: 'cafe', area: 'Mirpur', price: 1, good: ['groups', 'late', 'rainy'], blurb: 'A tin-roofed courtyard where the kettles never cool.', image: img('1555396273-367ea4eb4db5'), alt: 'Warm café interior with pendant lights' },
    { id: 'paper-boat', name: 'Paper Boat Books', type: 'books', area: 'Dhanmondi', price: 1, good: ['solo', 'kids', 'rainy'], blurb: 'Bangla poetry upstairs, a floor cushion kingdom below.', image: img('1521587760476-6c12a4b040da'), alt: 'Tall shelves packed with books' },
    { id: 'leaf-spine', name: 'Leaf & Spine Books', type: 'books', area: 'Gulshan', price: 1, good: ['solo', 'rainy'], blurb: 'Tk 150 paperbacks and a crate of 1970s vinyl.', image: img('1497633762265-9d179a990aa6'), alt: 'Stack of colourful books' },
    { id: 'book-row', name: 'Bangla Bazar Book Row', type: 'books', area: 'Old Dhaka', price: 1, good: ['solo', 'groups'], blurb: 'Three hundred stalls of textbooks, novels and old maps.', image: img('1481627834876-b7833e8f5570'), alt: 'Long corridor lined with bookshelves' },
    { id: 'brick-oven', name: 'Brick Oven Bakehouse', type: 'bakery', area: 'Dhanmondi', price: 1, good: ['kids', 'solo'], blurb: 'Loaves out at 7:30 am, cinnamon knots by nine.', image: img('1509440159596-0249088772ff'), alt: 'Rustic sourdough loaves' },
    { id: 'lalbagh-market', name: 'Lalbagh Morning Market', type: 'market', area: 'Old Dhaka', price: 1, good: ['groups', 'kids'], blurb: 'Mangoes, marigolds and river fish before 8 am.', image: img('1488459716781-31db52582fe9'), alt: 'Market stall piled with fresh produce' },
    { id: 'saturday-organics', name: 'Saturday Organics', type: 'market', area: 'Gulshan', price: 2, good: ['kids', 'solo'], blurb: 'Farm stalls, honey tastings and a kids’ seed swap.', image: img('1542838132-92c53300491e'), alt: 'Shelves of fresh fruit and vegetables' },
    { id: 'shilpo', name: 'Shilpo Gallery Collective', type: 'gallery', area: 'Dhanmondi', price: 1, good: ['dates', 'rainy', 'solo'], blurb: 'Free entry, new young painters every month.', image: img('1515187029135-18ee286d815b'), alt: 'People talking in a gallery space' },
    { id: 'art-loft', name: 'Uttara Art Loft', type: 'gallery', area: 'Uttara', price: 1, good: ['dates', 'groups'], blurb: 'Digital illustration shows and Friday life drawing.', image: img('1558655146-9f40138edfeb'), alt: 'Artist drawing on a tablet with a stylus' },
    { id: 'ember-room', name: 'Ember Room', type: 'food', area: 'Gulshan', price: 3, good: ['dates'], blurb: 'Nine courses of modern Bengali by candlelight.', image: img('1517248135467-4c7edcad34c4'), alt: 'Dark dining room with set tables' },
    { id: 'kacchi-kotha', name: 'Kacchi Kotha', type: 'food', area: 'Old Dhaka', price: 2, good: ['groups', 'late'], blurb: 'Mutton kacchi in brass handis, open past midnight.', image: img('1466978913421-dad2ebd01d17'), alt: 'Friends sharing plates of food' },
    { id: 'lakeview', name: 'Lakeview Terrace', type: 'food', area: 'Gulshan', price: 3, good: ['dates', 'groups'], blurb: 'Grilled rupchanda with the lake lit up at night.', image: img('1559339352-11d035aa65de'), alt: 'Restaurant terrace by the water' },
    { id: 'bhorta-bari', name: 'Bhorta Bari', type: 'food', area: 'Mirpur', price: 1, good: ['groups', 'kids'], blurb: 'Twenty-two bhortas and free rice refills.', image: img('1498837167922-ddd27525d352'), alt: 'Small bowls of colourful ingredients' },
]

const emptyFilters = { areas: [], types: [], good: [], budget: 0 }
const initialFilters = { areas: [], types: ['cafe', 'books'], good: ['rainy'], budget: 0 }

const applyFilters = (f) =>
    places.filter(
        (p) =>
            (!f.areas.length || f.areas.includes(p.area)) &&
            (!f.types.length || f.types.includes(p.type)) &&
            f.good.every((g) => p.good.includes(g)) &&
            (!f.budget || p.price <= f.budget),
    )

const countFilters = (f) => f.areas.length + f.types.length + f.good.length + (f.budget ? 1 : 0)
const toggleIn = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

function Facets({ value, onChange, idPrefix }) {
    return (
        <div className="space-y-8">
            {Object.entries(facets).map(([key, facet]) => (
                <fieldset key={key}>
                    <legend className="w-full border-b border-[#1b1a17] pb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#1b1a17]">
                        {facet.label}
                        {value[key].length > 0 && <span className="ml-2 text-[#d62828]">· {value[key].length}</span>}
                    </legend>
                    <div className="mt-3 grid grid-cols-2 gap-x-3 lg:grid-cols-1">
                        {facet.options.map(([id, label]) => {
                            const checked = value[key].includes(id)
                            return (
                                <label key={id} className="flex min-h-10 cursor-pointer items-center gap-3 text-[15px] text-[#1b1a17]">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        className="peer sr-only"
                                        id={`${idPrefix}-${key}-${id}`}
                                        onChange={() => onChange({ ...value, [key]: toggleIn(value[key], id) })}
                                    />
                                    <span
                                        className="grid h-5 w-5 shrink-0 place-items-center border-[1.5px] border-[#1b1a17] bg-transparent text-[#fdf6e3] transition-colors peer-checked:border-[#d62828] peer-checked:bg-[#d62828] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#d62828]"
                                        aria-hidden="true"
                                    >
                                        <HiCheck className={cn('h-3.5 w-3.5', !checked && 'invisible')} />
                                    </span>
                                    <span className={cn(checked && 'font-semibold')}>{label}</span>
                                </label>
                            )
                        })}
                    </div>
                </fieldset>
            ))}
            <fieldset>
                <legend className="w-full border-b border-[#1b1a17] pb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#1b1a17]">
                    Budget (up to)
                </legend>
                <div className="mt-4 grid grid-cols-4 border border-[#1b1a17]">
                    {budgets.map((b) => (
                        <label key={b.id} className="relative cursor-pointer border-l border-[#1b1a17] first:border-l-0">
                            <input
                                type="radio"
                                name={`${idPrefix}-budget`}
                                checked={value.budget === b.id}
                                className="peer sr-only"
                                onChange={() => onChange({ ...value, budget: b.id })}
                            />
                            <span className="grid min-h-11 place-items-center text-sm font-semibold text-[#1b1a17] transition-colors peer-checked:bg-[#1b1a17] peer-checked:text-[#fdf6e3] peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-4 peer-focus-visible:outline-[#d62828]">
                                {b.label}
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>
        </div>
    )
}

export function DrawerSheetFacetedFilters({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const dragControls = useDragControls()
    const [filters, setFilters] = useState(initialFilters)
    const [draft, setDraft] = useState(initialFilters)
    const [sheetOpen, setSheetOpen] = useState(false)
    const triggerRef = useRef(null)
    const sheetRef = useRef(null)
    const closeRef = useRef(null)

    const results = useMemo(() => applyFilters(filters), [filters])
    const draftCount = useMemo(() => applyFilters(draft).length, [draft])
    const applied = countFilters(filters)

    const openSheet = () => {
        setDraft(filters)
        setSheetOpen(true)
    }

    useEffect(() => {
        if (!sheetOpen) return undefined
        const trigger = triggerRef.current
        const sheet = sheetRef.current
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeRef.current?.focus()
        const onKey = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                setSheetOpen(false)
                return
            }
            if (event.key !== 'Tab' || !sheet) return
            const nodes = [...sheet.querySelectorAll('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
            if (!nodes.length) return
            const first = nodes[0]
            const last = nodes[nodes.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }
        const desktop = window.matchMedia('(min-width: 1024px)')
        const onDesktop = () => desktop.matches && setSheetOpen(false)
        document.addEventListener('keydown', onKey)
        desktop.addEventListener('change', onDesktop)
        return () => {
            document.body.style.overflow = previous
            document.removeEventListener('keydown', onKey)
            desktop.removeEventListener('change', onDesktop)
            trigger?.focus()
        }
    }, [sheetOpen])

    const chips = [
        ...filters.areas.map((v) => ({ key: `a-${v}`, label: v, remove: () => setFilters((f) => ({ ...f, areas: f.areas.filter((x) => x !== v) })) })),
        ...filters.types.map((v) => ({ key: `t-${v}`, label: typeLabel[v], remove: () => setFilters((f) => ({ ...f, types: f.types.filter((x) => x !== v) })) })),
        ...filters.good.map((v) => ({ key: `g-${v}`, label: goodLabel[v], remove: () => setFilters((f) => ({ ...f, good: f.good.filter((x) => x !== v) })) })),
        ...(filters.budget ? [{ key: 'b', label: `Up to ${'৳'.repeat(filters.budget)}`, remove: () => setFilters((f) => ({ ...f, budget: 0 })) }] : []),
    ]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#fdf6e3] px-4 py-16 text-base font-normal text-[#1b1a17] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-6 border-b-[3px] border-double border-[#1b1a17] pb-8 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d62828]">Townguide · Dhaka · Monsoon issue</p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#1b1a17] sm:text-6xl lg:text-7xl">
                            The <em className="text-[#d62828]">rainy-day</em> index
                        </h2>
                    </div>
                    <p className="max-w-xs font-serif text-lg italic leading-snug text-[#1b1a17]/75">
                        Seventeen places our writers duck into when the monsoon arrives without warning.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-2 lg:hidden">
                    <button
                        ref={triggerRef}
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded={sheetOpen}
                        className="inline-flex min-h-12 items-center gap-2 bg-[#1b1a17] px-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#fdf6e3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62828]"
                        onClick={openSheet}
                    >
                        <HiOutlineAdjustmentsHorizontal className="h-5 w-5" aria-hidden="true" />
                        Filters ({applied})
                    </button>
                </div>

                <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[260px_1fr] xl:gap-14">
                    <aside aria-label="Filters" className="hidden lg:block">
                        <div className="lg:sticky lg:top-6">
                            <div className="mb-6 flex items-center justify-between">
                                <p className="font-serif text-2xl text-[#1b1a17]">Filters</p>
                                <button
                                    type="button"
                                    disabled={!applied}
                                    className="min-h-10 px-1 text-sm font-semibold text-[#d62828] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#d62828] disabled:text-[#1b1a17]/35 disabled:no-underline"
                                    onClick={() => setFilters(emptyFilters)}
                                >
                                    Clear all
                                </button>
                            </div>
                            <Facets value={filters} idPrefix={`${uid}-side`} onChange={setFilters} />
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="mr-3 font-serif text-xl italic text-[#1b1a17]" aria-live="polite">
                                <strong className="font-bold not-italic text-[#d62828]">{results.length}</strong> of {places.length} places
                            </p>
                            {chips.map((c) => (
                                <button
                                    key={c.key}
                                    type="button"
                                    aria-label={`Remove filter ${c.label}`}
                                    className="inline-flex min-h-10 items-center gap-1.5 border border-[#1b1a17] px-3 text-sm text-[#1b1a17] hover:bg-[#1b1a17] hover:text-[#fdf6e3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62828]"
                                    onClick={c.remove}
                                >
                                    {c.label}
                                    <HiXMark className="h-4 w-4" aria-hidden="true" />
                                </button>
                            ))}
                        </div>

                        {results.length === 0 ? (
                            <div className="mt-8 border-y border-[#1b1a17] py-16 text-center">
                                <p className="font-serif text-3xl italic text-[#1b1a17]">Not a single dry corner.</p>
                                <p className="mx-auto mt-3 max-w-sm text-sm text-[#1b1a17]/70">
                                    No place ticks every box. Remove a “good for” tag — those have to match
                                    all at once.
                                </p>
                                <button
                                    type="button"
                                    className="mt-6 min-h-11 bg-[#d62828] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#fdf6e3] hover:bg-[#b91c1c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b1a17]"
                                    onClick={() => setFilters(emptyFilters)}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {results.map((p) => (
                                        <motion.li
                                            key={p.id}
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="group"
                                        >
                                            <div className="overflow-hidden border border-[#1b1a17] transition-shadow duration-300 group-hover:shadow-[6px_6px_0_#1b1a17]">
                                                <img src={p.image} alt={p.alt} loading="lazy" className="aspect-[3/2] w-full object-cover" />
                                            </div>
                                            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#d62828]">
                                                {typeLabel[p.type]} · {p.area} · {'৳'.repeat(p.price)}
                                            </p>
                                            <h3 className="mt-1 font-serif text-2xl font-bold leading-tight text-[#1b1a17]">
                                                <a
                                                    href={`#townguide-${p.id}`}
                                                    className="decoration-[#d62828] decoration-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62828]"
                                                >
                                                    {p.name}
                                                </a>
                                            </h3>
                                            <p className="mt-2 font-serif text-base italic leading-snug text-[#1b1a17]/75">{p.blurb}</p>
                                            <p className="mt-3 text-xs text-[#1b1a17]/60">
                                                Good for: {p.good.map((g) => goodLabel[g].toLowerCase()).join(', ')}
                                            </p>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {sheetOpen && (
                    <div key="sheet-layer" className="fixed inset-0 z-50 lg:hidden">
                        <motion.div
                            key="backdrop"
                            className="absolute inset-0 bg-[#1b1a17]/50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            aria-hidden="true"
                            onClick={() => setSheetOpen(false)}
                        />
                        <motion.div
                            key="sheet"
                            ref={sheetRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`${uid}-sheet-title`}
                            drag={reduceMotion ? false : 'y'}
                            dragListener={false}
                            dragControls={dragControls}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.7 }}
                            initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
                            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                            exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
                            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-[28px] bg-[#fdf6e3] text-[#1b1a17] shadow-[0_-20px_60px_-20px_rgba(27,26,23,0.6)]"
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 110 || info.velocity.y > 600) setSheetOpen(false)
                            }}
                        >
                            <div
                                className="flex cursor-grab touch-none justify-center pb-1 pt-3 active:cursor-grabbing"
                                aria-hidden="true"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <span className="h-1.5 w-12 rounded-full bg-[#1b1a17]/25" />
                            </div>
                            <div className="flex items-center justify-between border-b-[3px] border-double border-[#1b1a17] px-5 pb-3">
                                <h3 id={`${uid}-sheet-title`} className="font-serif text-2xl font-normal text-[#1b1a17]">
                                    Filters
                                    <span className="ml-2 text-base italic text-[#d62828]">{countFilters(draft)} selected</span>
                                </h3>
                                <button
                                    ref={closeRef}
                                    type="button"
                                    aria-label="Close filters"
                                    className="grid h-11 w-11 place-items-center text-[#1b1a17] hover:text-[#d62828] focus-visible:outline-2 focus-visible:outline-[#d62828]"
                                    onClick={() => setSheetOpen(false)}
                                >
                                    <HiXMark className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
                                <Facets value={draft} idPrefix={`${uid}-sheet`} onChange={setDraft} />
                            </div>
                            <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-[#1b1a17] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                                <button
                                    type="button"
                                    className="min-h-12 border border-[#1b1a17] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#1b1a17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62828]"
                                    onClick={() => setDraft(emptyFilters)}
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="min-h-12 bg-[#d62828] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#fdf6e3] hover:bg-[#b91c1c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b1a17]"
                                    onClick={() => {
                                        setFilters(draft)
                                        setSheetOpen(false)
                                    }}
                                >
                                    Show {draftCount} {draftCount === 1 ? 'place' : 'places'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default DrawerSheetFacetedFilters

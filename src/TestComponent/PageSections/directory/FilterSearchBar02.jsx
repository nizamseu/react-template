// SuggestChipsSearchBar

// FilterSearchBar02 · Directories & Search Aggregators › Multi-Filter Search Bar

// Description:
// A dark, keyboard-first token search for the directory aggregator Findly. Under the
// heading "Type less. Find more." one combobox suggests Categories, Places and Businesses as
// you type ("caf" → Cafés, "ban" → Banani); every pick becomes a removable chip and the
// result cards below re-filter live with a running count. Use it as the main search on a
// directory home page or above a results page where people stack several filters at once.

// Design:
// - Navy #0f172a section with a lime #bef264 glow and hairline grid; mono eyebrow, sans
//   display heading (text-4xl → lg:text-7xl) with the word "more." in lime
// - Token field: rounded-3xl #111b30 shell with a lime focus ring; chips are colour-coded by
//   type (category = solid lime, place = lime outline, business = white/10, text = dashed)
// - Suggestion popover: grouped listbox with small uppercase group labels, type icons,
//   lime-highlighted matched letters and counts; the active row gets a lime left bar
// - Result cards (no photos): big rating numeral, monogram tile, area and tag line;
//   grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-3, animated in/out with framer-motion
// - Responsive: chips wrap inside the field; the popover spans the field width; header
//   stacks on mobile and splits at lg

// What it does:
// - query + chips are controlled state; typing opens grouped suggestions (up to 4 categories,
//   4 places, 5 businesses) excluding chips already chosen
// - Keyboard: ↑/↓ move the active option (aria-activedescendant), Enter picks it (or adds the
//   typed text as a "text" chip), Escape closes, Backspace on an empty field removes the
//   last chip; clicking an option works too and the popover closes on blur
// - Results = businesses matching every chip type (categories OR'd, places OR'd, picked
//   businesses, text chips and the live query); count, empty state and "Clear all" update live
// - Cards link to #findly-<id>; icons and the glow are decorative

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SuggestChipsSearchBar from '@/TestComponent/PageSections/directory/FilterSearchBar02';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <SuggestChipsSearchBar />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiOutlineBuildingStorefront,
    HiOutlineHashtag,
    HiOutlineMagnifyingGlass,
    HiOutlineMapPin,
    HiOutlineSquares2X2,
    HiStar,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const categories = [
    { id: 'cafes', label: 'Cafés' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'bakeries', label: 'Bakeries' },
    { id: 'rooftops', label: 'Rooftop lounges' },
    { id: 'gyms', label: 'Gyms & studios' },
    { id: 'salons', label: 'Salons & barbers' },
    { id: 'bookshops', label: 'Bookshops' },
    { id: 'coworking', label: 'Coworking spaces' },
    { id: 'pharmacies', label: 'Pharmacies' },
]

const areas = ['Banani', 'Gulshan 1', 'Gulshan 2', 'Dhanmondi', 'Uttara', 'Bashundhara', 'Mirpur', 'Mohammadpur', 'Old Dhaka', 'Baridhara', 'Lalmatia']

const businesses = [
    { id: 'tin-roof', name: 'Tin Roof Coffee', category: 'cafes', area: 'Banani', tags: ['specialty coffee', 'wifi', 'laptop friendly'], rating: 4.6, reviews: 1622, price: '৳৳', open: 'Open until 11 pm' },
    { id: 'cha-cartel', name: 'Cha Cartel', category: 'cafes', area: 'Dhanmondi', tags: ['tea', 'milk tea', 'singara'], rating: 4.7, reviews: 2210, price: '৳', open: 'Open until midnight' },
    { id: 'monsoon-latte', name: 'Monsoon Latte Bar', category: 'cafes', area: 'Dhanmondi', tags: ['latte art', 'desserts'], rating: 4.5, reviews: 740, price: '৳৳', open: 'Open until 10:30 pm' },
    { id: 'drip-lab', name: 'Drip Lab Gulshan', category: 'cafes', area: 'Gulshan 2', tags: ['pour over', 'cold brew', 'brunch'], rating: 4.8, reviews: 988, price: '৳৳৳', open: 'Open until 10 pm' },
    { id: 'two-cups', name: 'Two Cups Café', category: 'cafes', area: 'Uttara', tags: ['breakfast', 'quiet'], rating: 4.3, reviews: 390, price: '৳', open: 'Open until 10 pm' },
    { id: 'kacchi-kotha', name: 'Kacchi Kotha', category: 'restaurants', area: 'Old Dhaka', tags: ['kacchi biryani', 'bengali', 'late night'], rating: 4.8, reviews: 5120, price: '৳৳', open: 'Open until 1 am' },
    { id: 'bhorta-bari', name: 'Bhorta Bari', category: 'restaurants', area: 'Mohammadpur', tags: ['bhorta', 'home style', 'lunch'], rating: 4.6, reviews: 1874, price: '৳', open: 'Open until 10 pm' },
    { id: 'green-ladle', name: 'Green Ladle Kitchen', category: 'restaurants', area: 'Gulshan 1', tags: ['vegan', 'salad bowls', 'brunch'], rating: 4.8, reviews: 611, price: '৳৳', open: 'Open until 10 pm' },
    { id: 'tokyo-alley', name: 'Tokyo Alley Ramen', category: 'restaurants', area: 'Banani', tags: ['ramen', 'japanese', 'late night'], rating: 4.5, reviews: 1403, price: '৳৳৳', open: 'Open until 11:30 pm' },
    { id: 'brick-oven', name: 'Brick Oven Bakehouse', category: 'bakeries', area: 'Dhanmondi', tags: ['sourdough', 'croissant'], rating: 4.7, reviews: 803, price: '৳', open: 'Open until 9 pm' },
    { id: 'crumb-co', name: 'Crumb & Co.', category: 'bakeries', area: 'Bashundhara', tags: ['cakes', 'custom orders'], rating: 4.4, reviews: 522, price: '৳৳', open: 'Open until 9:30 pm' },
    { id: 'skyline-27', name: 'Skyline 27', category: 'rooftops', area: 'Gulshan 2', tags: ['rooftop', 'mocktails', 'city view'], rating: 4.5, reviews: 1310, price: '৳৳৳৳', open: 'Open until 1 am' },
    { id: 'terrace-nine', name: 'Terrace Nine', category: 'rooftops', area: 'Banani', tags: ['rooftop', 'shisha', 'live music'], rating: 4.2, reviews: 870, price: '৳৳৳', open: 'Open until midnight' },
    { id: 'iron-tide', name: 'Iron Tide Gym', category: 'gyms', area: 'Mirpur', tags: ['weights', '24 hours', 'trainers'], rating: 4.6, reviews: 455, price: '৳৳', open: 'Open 24 hours' },
    { id: 'lakeside-yoga', name: 'Lakeside Yoga Loft', category: 'gyms', area: 'Dhanmondi', tags: ['yoga', 'meditation'], rating: 4.9, reviews: 212, price: '৳৳', open: 'Next class 6 pm' },
    { id: 'chiselled', name: 'Chiselled Barber Co.', category: 'salons', area: 'Banani', tags: ['barber', 'beard trim'], rating: 4.8, reviews: 566, price: '৳৳', open: 'Open until 9 pm' },
    { id: 'kesh-studio', name: 'Kesh Studio', category: 'salons', area: 'Lalmatia', tags: ['haircut', 'colour', 'bridal'], rating: 4.6, reviews: 431, price: '৳৳৳', open: 'Open until 8 pm' },
    { id: 'paper-boat', name: 'Paper Boat Books', category: 'bookshops', area: 'Dhanmondi', tags: ['bookshop', 'reading room', 'kids'], rating: 4.8, reviews: 1190, price: '৳', open: 'Open until 9 pm' },
    { id: 'desk-collective', name: 'The Desk Collective', category: 'coworking', area: 'Gulshan 1', tags: ['day pass', 'meeting rooms', 'wifi'], rating: 4.7, reviews: 298, price: '৳৳', open: 'Open until 10 pm' },
    { id: 'neem-tree', name: 'Neem Tree Pharmacy', category: 'pharmacies', area: 'Baridhara', tags: ['24 hours', 'delivery'], rating: 4.5, reviews: 1015, price: '৳', open: 'Open 24 hours' },
]

const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? id
const countIn = (key, value) => businesses.filter((b) => b[key] === value).length

const matchesText = (b, text) => {
    const t = text.trim().toLowerCase()
    if (!t) return true
    return [b.name, b.area, categoryLabel(b.category), ...b.tags].some((s) => s.toLowerCase().includes(t))
}

const typeStyles = {
    category: 'bg-[#bef264] text-[#0f172a]',
    place: 'border border-[#bef264] text-[#bef264]',
    business: 'bg-white/10 text-white',
    text: 'border border-dashed border-white/40 text-white',
}

const typeIcons = {
    category: HiOutlineSquares2X2,
    place: HiOutlineMapPin,
    business: HiOutlineBuildingStorefront,
    text: HiOutlineHashtag,
}

function Highlight({ text, query }) {
    const i = text.toLowerCase().indexOf(query.trim().toLowerCase())
    if (!query.trim() || i < 0) return text
    const end = i + query.trim().length
    return (
        <>
            {text.slice(0, i)}
            <span className="text-[#bef264]">{text.slice(i, end)}</span>
            {text.slice(end)}
        </>
    )
}

export function SuggestChipsSearchBar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const listboxId = `${uid}-listbox`
    const reduceMotion = useReducedMotion()
    const inputRef = useRef(null)
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(0)
    const [chips, setChips] = useState([{ type: 'category', value: 'cafes', label: 'Cafés' }])

    const chipKey = (c) => `${c.type}:${c.value}`
    const chosen = useMemo(() => new Set(chips.map(chipKey)), [chips])

    const groups = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return []
        const cat = categories
            .filter((c) => c.label.toLowerCase().includes(q) && !chosen.has(`category:${c.id}`))
            .slice(0, 4)
            .map((c) => ({ type: 'category', value: c.id, label: c.label, meta: `${countIn('category', c.id)} places` }))
        const plc = areas
            .filter((a) => a.toLowerCase().includes(q) && !chosen.has(`place:${a}`))
            .slice(0, 4)
            .map((a) => ({ type: 'place', value: a, label: a, meta: `${countIn('area', a)} listed · Dhaka` }))
        const biz = businesses
            .filter((b) => (b.name.toLowerCase().includes(q) || b.tags.some((t) => t.includes(q))) && !chosen.has(`business:${b.id}`))
            .slice(0, 5)
            .map((b) => ({ type: 'business', value: b.id, label: b.name, meta: `${categoryLabel(b.category)} · ${b.area}` }))
        return [
            { id: 'categories', title: 'Categories', items: cat },
            { id: 'places', title: 'Places', items: plc },
            { id: 'businesses', title: 'Businesses', items: biz },
        ].filter((g) => g.items.length)
    }, [query, chosen])

    const flat = groups.flatMap((g) => g.items)
    const expanded = open && query.trim().length > 0
    const activeIndex = Math.min(active, Math.max(flat.length - 1, 0))

    const results = useMemo(() => {
        const cats = chips.filter((c) => c.type === 'category').map((c) => c.value)
        const plcs = chips.filter((c) => c.type === 'place').map((c) => c.value)
        const bizs = chips.filter((c) => c.type === 'business').map((c) => c.value)
        const texts = chips.filter((c) => c.type === 'text').map((c) => c.value)
        return businesses
            .filter((b) =>
                (!cats.length || cats.includes(b.category)) &&
                (!plcs.length || plcs.includes(b.area)) &&
                (!bizs.length || bizs.includes(b.id)) &&
                texts.every((t) => matchesText(b, t)) &&
                matchesText(b, query),
            )
            .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    }, [chips, query])

    const addChip = (chip) => {
        if (!chosen.has(chipKey(chip))) setChips((list) => [...list, chip])
        setQuery('')
        setActive(0)
        setOpen(false)
        inputRef.current?.focus()
    }

    const removeChip = (chip) => {
        setChips((list) => list.filter((c) => chipKey(c) !== chipKey(chip)))
        inputRef.current?.focus()
    }

    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
            if (flat.length) setActive((activeIndex + 1) % flat.length)
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
            if (flat.length) setActive((activeIndex - 1 + flat.length) % flat.length)
        } else if (event.key === 'Enter') {
            event.preventDefault()
            if (expanded && flat[activeIndex]) addChip(flat[activeIndex])
            else if (query.trim()) addChip({ type: 'text', value: query.trim(), label: `“${query.trim()}”` })
        } else if (event.key === 'Escape') {
            if (expanded) {
                event.preventDefault()
                setOpen(false)
            } else if (query) {
                setQuery('')
            }
        } else if (event.key === 'Backspace' && !query && chips.length) {
            setChips((list) => list.slice(0, -1))
        }
    }

    const onBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
    }

    const optionId = (i) => `${uid}-opt-${i}`
    let flatIndex = -1

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0f172a] px-4 py-16 text-base font-normal text-slate-100 sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
                aria-hidden="true"
            />
            <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-[#bef264]/10 blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-[#bef264]">
                            <span className="h-2 w-2 rounded-full bg-[#bef264]" aria-hidden="true" />
                            Findly · Dhaka index
                        </p>
                        <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                            Type less. <span className="text-[#bef264]">Find more.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-slate-400">
                        Stack categories, neighbourhoods and names into one search. Use ↑ ↓ to
                        move, Enter to add, Backspace to drop the last chip.
                    </p>
                </div>

                <div className="relative mt-10" onBlur={onBlur}>
                    <label htmlFor={`${uid}-input`} className="sr-only">
                        Search categories, places and businesses
                    </label>
                    <div
                        className="flex min-h-16 flex-wrap items-center gap-2 rounded-3xl border border-white/10 bg-[#111b30] p-2.5 pl-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] transition-shadow focus-within:border-[#bef264]/70 focus-within:shadow-[0_0_0_4px_rgba(190,242,100,0.15),0_30px_80px_-30px_rgba(0,0,0,0.8)]"
                        onClick={() => inputRef.current?.focus()}
                    >
                        <HiOutlineMagnifyingGlass className="h-6 w-6 shrink-0 text-[#bef264]" aria-hidden="true" />
                        <ul className="contents" aria-label="Selected filters">
                            <AnimatePresence initial={false}>
                                {chips.map((chip) => {
                                    const Icon = typeIcons[chip.type]
                                    return (
                                        <motion.li
                                            key={chipKey(chip)}
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.85 }}
                                            transition={{ duration: 0.18 }}
                                            className={cn('inline-flex max-w-full items-center gap-1.5 rounded-full py-1 pl-3 pr-1 text-sm font-semibold', typeStyles[chip.type])}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                                            <span className="truncate">{chip.label}</span>
                                            <button
                                                type="button"
                                                aria-label={`Remove ${chip.label}`}
                                                className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-black/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeChip(chip)
                                                }}
                                            >
                                                <HiXMark className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                        </motion.li>
                                    )
                                })}
                            </AnimatePresence>
                        </ul>
                        <input
                            ref={inputRef}
                            id={`${uid}-input`}
                            type="text"
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded={expanded}
                            aria-controls={listboxId}
                            aria-activedescendant={expanded && flat.length ? optionId(activeIndex) : undefined}
                            value={query}
                            placeholder={chips.length ? 'Add another filter…' : 'Try “roof”, “Dhan” or “ramen”'}
                            autoComplete="off"
                            className="min-h-11 min-w-[9rem] flex-1 bg-transparent px-1 text-lg text-white placeholder:text-slate-500 focus:outline-none"
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setActive(0)
                                setOpen(true)
                            }}
                            onFocus={() => setOpen(true)}
                            onKeyDown={onKeyDown}
                        />
                        {(chips.length > 0 || query) && (
                            <button
                                type="button"
                                className="min-h-11 shrink-0 rounded-full px-4 font-mono text-xs uppercase tracking-[0.18em] text-slate-400 hover:text-[#bef264] focus-visible:outline-2 focus-visible:outline-[#bef264]"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setChips([])
                                    setQuery('')
                                    inputRef.current?.focus()
                                }}
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                                transition={{ duration: 0.16 }}
                                className="absolute inset-x-0 top-full z-20 mt-2 max-h-[22rem] overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1324] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
                            >
                                <ul id={listboxId} role="listbox" aria-label="Suggestions">
                                    {groups.map((group) => (
                                        <li key={group.id} role="presentation" className="py-1">
                                            <p id={`${uid}-${group.id}`} className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500">
                                                {group.title}
                                            </p>
                                            <ul role="group" aria-labelledby={`${uid}-${group.id}`}>
                                                {group.items.map((item) => {
                                                    flatIndex += 1
                                                    const i = flatIndex
                                                    const Icon = typeIcons[item.type]
                                                    const isActive = i === activeIndex
                                                    return (
                                                        <li
                                                            key={`${item.type}:${item.value}`}
                                                            id={optionId(i)}
                                                            role="option"
                                                            aria-selected={isActive}
                                                            className={cn(
                                                                'relative flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-sm',
                                                                isActive ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]',
                                                            )}
                                                            onMouseDown={(e) => e.preventDefault()}
                                                            onMouseEnter={() => setActive(i)}
                                                            onClick={() => addChip(item)}
                                                        >
                                                            {isActive && <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-[#bef264]" aria-hidden="true" />}
                                                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-[#bef264]" aria-hidden="true">
                                                                <Icon className="h-4 w-4" />
                                                            </span>
                                                            <span className="min-w-0 flex-1 truncate font-semibold text-white">
                                                                <Highlight text={item.label} query={query} />
                                                            </span>
                                                            <span className="hidden shrink-0 text-xs text-slate-500 sm:inline">{item.meta}</span>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                                {flat.length === 0 && (
                                    <p className="px-3 py-4 text-sm text-slate-400">
                                        No suggestions. Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">Enter</kbd> to
                                        search “{query.trim()}” as text.
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-12 flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-bold text-white sm:text-3xl" aria-live="polite">
                        <span className="text-[#bef264]">{results.length}</span> {results.length === 1 ? 'result' : 'results'}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                        {chips.length ? `${chips.length} ${chips.length === 1 ? 'filter' : 'filters'} · sorted by rating` : 'All of Dhaka · sorted by rating'}
                    </p>
                </div>

                {results.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-dashed border-white/15 px-6 py-14 text-center">
                        <p className="font-mono text-5xl font-bold text-[#bef264]">0</p>
                        <p className="mt-3 text-lg font-semibold text-white">No place ticks every chip.</p>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                            Two neighbourhoods are OR’d, but a category and a business name have to agree.
                            Drop the last chip or start over.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <button
                                type="button"
                                className="min-h-11 rounded-full border border-white/20 px-5 text-sm font-semibold text-white hover:border-[#bef264] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bef264]"
                                onClick={() => {
                                    setQuery('')
                                    setChips((list) => list.slice(0, -1))
                                }}
                            >
                                Remove last filter
                            </button>
                            <button
                                type="button"
                                className="min-h-11 rounded-full bg-[#bef264] px-5 text-sm font-bold text-[#0f172a] hover:bg-[#d9f99d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                onClick={() => {
                                    setQuery('')
                                    setChips([])
                                }}
                            >
                                Start over
                            </button>
                        </div>
                    </div>
                ) : (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence initial={false} mode="popLayout">
                            {results.map((b) => (
                                <motion.li
                                    key={b.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                    transition={{ duration: 0.22 }}
                                >
                                    <a
                                        href={`#findly-${b.id}`}
                                        className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[#bef264]/60 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bef264]"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#bef264] font-mono text-sm font-bold text-[#0f172a]" aria-hidden="true">
                                                {b.name.replace(/^The /, '').slice(0, 2).toUpperCase()}
                                            </span>
                                            <p className="flex items-baseline gap-1 text-3xl font-black tracking-tight text-white">
                                                {b.rating.toFixed(1)}
                                                <HiStar className="h-4 w-4 text-[#bef264]" aria-hidden="true" />
                                                <span className="sr-only">out of 5</span>
                                            </p>
                                        </div>
                                        <p className="mt-5 text-lg font-bold text-white group-hover:text-[#bef264]">{b.name}</p>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {categoryLabel(b.category)} · {b.area} · {b.price}
                                        </p>
                                        <p className="mt-4 flex-1 text-sm text-slate-300">{b.tags.join(' / ')}</p>
                                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                                            <span className="text-[#bef264]">{b.open}</span>
                                            <span className="text-slate-500">{b.reviews.toLocaleString('en-US')} reviews</span>
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

export default SuggestChipsSearchBar

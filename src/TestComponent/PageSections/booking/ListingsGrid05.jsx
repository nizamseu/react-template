// CompareTrayListingsGrid

// ListingsGrid05 · Booking & Reservations › Listings / Availability Grid

// Description:
// A Mediterranean villa collection for the fictional rental house Harbourline Villas. The
// serif heading "Six villas on the water. Compare any three." sits over arched photo cards
// (Villa Aster in Kalkan to Palm Court in Mallorca) with bedrooms, sleeps, beach distance
// and nightly price; ticking "Compare" on up to three fills a tray pinned to the bottom
// that expands into a side-by-side table with the best value in each row marked.

// Design:
// - Sand #f6efe6 section, deep sea #0b3954 type, tray and checked states, sea-glass
//   #7fb7be for "best" markers and focus rings, white cards with a #e6dccd border
// - Arched photos (4:5, rounded-t-full) with a white price tag; serif names and heading
//   (text-4xl → lg:text-6xl), tracking-wide uppercase labels; pill-shaped compare toggles
// - Grid 1 → sm:2 → lg:3 columns; the tray is sticky bottom-4 inside the section, a
//   deep sea rounded-[28px] bar with three 36 → 48px slots; on narrow screens the table
//   scrolls sideways with its row labels pinned in a sticky first column
// - framer-motion: tray slides up when the first villa is ticked, grows into the table
//   (height auto), thumbnails pop into slots; reduced motion keeps fades only

// What it does:
// - selected (max 3, Villa Aster and Villa Thalassa preselected) toggles from each card's
//   checkbox; once three are chosen the other checkboxes disable and say "Tray full"
// - The tray button (aria-expanded) opens the comparison when two or more are selected;
//   Escape or "Hide" collapses it; per-column ✕ and "Clear" remove villas
// - Rows mark the lowest price, most bedrooms/bathrooms/sleeps, closest beach, highest
//   rating and shortest minimum stay; "View villa" links go to #harbourline-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CompareTrayListingsGrid from '@/TestComponent/PageSections/booking/ListingsGrid05';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <CompareTrayListingsGrid />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheck, HiChevronUp, HiStar, HiXMark } from 'react-icons/hi2';
import { LuBath, LuBedDouble, LuUsers, LuWaves } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const MAX = 3

const villas = [
    {
        id: 'aster',
        name: 'Villa Aster',
        place: 'Kalkan, Türkiye',
        price: 640,
        beds: 4,
        baths: 4,
        sleeps: 8,
        pool: 'Heated infinity pool',
        beach: 350,
        rating: 4.93,
        minStay: 5,
        cancel: 'Until 30 days before',
        img: '1512917774080-9991f1c4c750',
        alt: 'Modern white villa with a long pool at dusk',
    },
    {
        id: 'mare',
        name: 'Casa Maré',
        place: 'Comporta, Portugal',
        price: 520,
        beds: 3,
        baths: 3,
        sleeps: 6,
        pool: 'Saltwater pool',
        beach: 1200,
        rating: 4.88,
        minStay: 4,
        cancel: 'Until 14 days before',
        img: '1613490493576-7fde63acd811',
        alt: 'White villa with a pool and loungers',
    },
    {
        id: 'thalassa',
        name: 'Villa Thalassa',
        place: 'Paros, Greece',
        price: 780,
        beds: 5,
        baths: 5,
        sleeps: 10,
        pool: 'Infinity pool',
        beach: 90,
        rating: 4.97,
        minStay: 7,
        cancel: 'Until 60 days before',
        img: '1533105079780-92b9be482077',
        alt: 'Whitewashed houses stepping down to a blue sea',
    },
    {
        id: 'harbour-house',
        name: 'Harbour House',
        place: 'Hvar, Croatia',
        price: 910,
        beds: 4,
        baths: 3,
        sleeps: 8,
        pool: 'Heated pool + private jetty',
        beach: 0,
        rating: 4.95,
        minStay: 7,
        cancel: 'Until 30 days before',
        img: '1584132967334-10e028bd69f7',
        alt: 'Infinity pool deck overlooking the open sea',
    },
    {
        id: 'solace',
        name: 'Villa Solace',
        place: 'Ibiza, Spain',
        price: 1120,
        beds: 6,
        baths: 6,
        sleeps: 12,
        pool: 'Pool, spa and sauna',
        beach: 2400,
        rating: 4.9,
        minStay: 7,
        cancel: 'Until 45 days before',
        img: '1600596542815-ffad4c1539a9',
        alt: 'White modernist house with a pool under a blue sky',
    },
    {
        id: 'palm-court',
        name: 'Palm Court',
        place: 'Mallorca, Spain',
        price: 460,
        beds: 3,
        baths: 2,
        sleeps: 6,
        pool: 'Plunge pool',
        beach: 600,
        rating: 4.84,
        minStay: 3,
        cancel: 'Until 7 days before',
        img: '1564013799919-ab600027ffc6',
        alt: 'Villa with a pool framed by tall palm trees',
    },
]

const img = (id, w = 700) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`
const beachText = (m) => (m === 0 ? 'On the water' : m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`)
const euro = (n) => `€${n.toLocaleString('en-US')}`

const rows = [
    { label: 'Price / night', key: 'price', best: 'min', fmt: euro },
    { label: 'Bedrooms', key: 'beds', best: 'max' },
    { label: 'Bathrooms', key: 'baths', best: 'max' },
    { label: 'Sleeps', key: 'sleeps', best: 'max' },
    { label: 'Pool', key: 'pool' },
    { label: 'To the beach', key: 'beach', best: 'min', fmt: beachText },
    { label: 'Guest rating', key: 'rating', best: 'max', fmt: (n) => `${n.toFixed(2)} ★` },
    { label: 'Minimum stay', key: 'minStay', best: 'min', fmt: (n) => `${n} nights` },
    { label: 'Free cancellation', key: 'cancel' },
]

export function CompareTrayListingsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [selected, setSelected] = useState(['aster', 'thalassa'])
    const [open, setOpen] = useState(false)
    const toggleRef = useRef(null)

    const chosen = selected.map((id) => villas.find((v) => v.id === id))
    const full = selected.length >= MAX
    const canCompare = selected.length >= 2
    const expanded = open && canCompare

    useEffect(() => {
        if (!expanded) return undefined
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setOpen(false)
                toggleRef.current?.focus()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [expanded])

    const toggle = (id) =>
        setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= MAX ? s : [...s, id]))

    const bestOf = (row) => {
        if (!row.best || chosen.length < 2) return null
        const values = chosen.map((v) => v[row.key])
        const target = row.best === 'min' ? Math.min(...values) : Math.max(...values)
        return values.every((v) => v === target) ? null : target
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#f6efe6] px-4 pb-10 pt-16 text-base font-normal text-[#0b3954] sm:px-6 md:pt-24 lg:px-8', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#0b3954]/70">
                            Harbourline Villas · Summer 2027 collection
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#0b3954] sm:text-5xl lg:text-6xl">
                            Six villas on the water. <em className="text-[#0b3954]/60">Compare any three.</em>
                        </h2>
                    </div>
                    <p className="max-w-md text-base leading-relaxed text-[#0b3954]/70 lg:justify-self-end">
                        Every villa is visited by our team each spring, fully staffed on request and
                        cleaned between every stay. Tick “Compare” to line them up side by side.
                    </p>
                </div>

                <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {villas.map((villa, i) => {
                        const checked = selected.includes(villa.id)
                        const locked = full && !checked
                        return (
                            <li key={villa.id}>
                                <article
                                    className={cn(
                                        'group h-full rounded-[28px] border bg-white p-3 transition-[border-color,box-shadow] duration-300',
                                        checked
                                            ? 'border-[#0b3954] shadow-[0_24px_50px_-30px_rgba(11,57,84,0.8)]'
                                            : 'border-[#e6dccd] hover:shadow-[0_24px_50px_-34px_rgba(11,57,84,0.6)]',
                                    )}
                                >
                                    <div className="relative overflow-hidden rounded-t-full rounded-b-[20px]">
                                        <img
                                            src={img(villa.img)}
                                            alt={villa.alt}
                                            loading="lazy"
                                            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
                                        />
                                        <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1.5 text-sm text-[#0b3954] shadow-sm">
                                            <span className="font-semibold">{euro(villa.price)}</span> / night
                                        </span>
                                        <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-[#0b3954] font-serif text-sm text-white">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="px-2 pb-2 pt-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="font-serif text-2xl font-normal text-[#0b3954]">
                                                    <a
                                                        href={`#harbourline-${villa.id}`}
                                                        className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fb7be]"
                                                    >
                                                        {villa.name}
                                                    </a>
                                                </h3>
                                                <p className="mt-0.5 text-sm text-[#0b3954]/65">{villa.place}</p>
                                            </div>
                                            <p className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#0b3954]">
                                                <HiStar aria-hidden="true" className="size-4 text-[#0b3954]" />
                                                {villa.rating.toFixed(2)}
                                            </p>
                                        </div>
                                        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-[#0b3954]/75">
                                            <li className="flex items-center gap-2">
                                                <LuBedDouble aria-hidden="true" className="size-4 shrink-0" /> {villa.beds} bedrooms
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <LuUsers aria-hidden="true" className="size-4 shrink-0" /> Sleeps {villa.sleeps}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <LuBath aria-hidden="true" className="size-4 shrink-0" /> {villa.baths} bathrooms
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <LuWaves aria-hidden="true" className="size-4 shrink-0" /> {beachText(villa.beach)}
                                            </li>
                                        </ul>
                                        <label
                                            className={cn(
                                                'mt-5 flex min-h-11 items-center justify-between gap-3 rounded-full border px-4 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#7fb7be]',
                                                checked
                                                    ? 'border-[#0b3954] bg-[#0b3954] text-white'
                                                    : locked
                                                      ? 'cursor-not-allowed border-dashed border-[#0b3954]/25 text-[#0b3954]/45'
                                                      : 'cursor-pointer border-[#0b3954]/25 text-[#0b3954] hover:border-[#0b3954]',
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                disabled={locked}
                                                className="sr-only"
                                                onChange={() => toggle(villa.id)}
                                            />
                                            <span>{checked ? 'Added to compare' : locked ? 'Tray full (3 of 3)' : 'Compare'}</span>
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'grid size-5 place-items-center rounded-md border',
                                                    checked ? 'border-white bg-white text-[#0b3954]' : 'border-current',
                                                )}
                                            >
                                                {checked && <HiCheck className="size-3.5" />}
                                            </span>
                                        </label>
                                    </div>
                                </article>
                            </li>
                        )
                    })}
                </ul>

                <div className="sticky bottom-4 z-30 mt-10">
                    <AnimatePresence initial={false}>
                        {selected.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden rounded-[28px] bg-[#0b3954] text-white shadow-[0_30px_60px_-24px_rgba(11,57,84,0.8)]"
                            >
                                <AnimatePresence initial={false}>
                                    {expanded && (
                                        <motion.div
                                            id={`${uid}-table`}
                                            role="region"
                                            aria-label="Villa comparison"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <div className="max-h-[60vh] overflow-auto border-b border-white/15 p-4 sm:p-6">
                                                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                                                    <caption className="sr-only">Selected villas compared side by side</caption>
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="sticky left-0 z-10 w-28 bg-[#0b3954] pb-4 pr-3 align-bottom text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:w-36">
                                                                {chosen.length} villas
                                                            </th>
                                                            {chosen.map((v) => (
                                                                <th key={v.id} scope="col" className="px-3 pb-4 align-bottom font-normal">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="flex min-w-0 items-center gap-3">
                                                                            <img
                                                                                src={img(v.img, 200)}
                                                                                alt=""
                                                                                loading="lazy"
                                                                                className="size-12 shrink-0 rounded-t-full rounded-b-lg object-cover"
                                                                            />
                                                                            <div className="min-w-0">
                                                                                <p className="truncate font-serif text-lg text-white">{v.name}</p>
                                                                                <p className="truncate text-xs text-white/60">{v.place}</p>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            aria-label={`Remove ${v.name} from comparison`}
                                                                            className="grid size-10 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#7fb7be]"
                                                                            onClick={() => toggle(v.id)}
                                                                        >
                                                                            <HiXMark aria-hidden="true" className="size-4" />
                                                                        </button>
                                                                    </div>
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {rows.map((row) => {
                                                            const best = bestOf(row)
                                                            return (
                                                                <tr key={row.key} className="border-t border-white/10">
                                                                    <th scope="row" className="sticky left-0 z-10 bg-[#0b3954] py-3 pr-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/55 sm:tracking-[0.16em]">
                                                                        {row.label}
                                                                    </th>
                                                                    {chosen.map((v) => {
                                                                        const value = v[row.key]
                                                                        const isBest = best !== null && value === best
                                                                        return (
                                                                            <td key={v.id} className="px-3 py-3">
                                                                                <span
                                                                                    className={cn(
                                                                                        'inline-flex items-center gap-2',
                                                                                        isBest ? 'font-semibold text-[#bfe3e7]' : 'text-white/90',
                                                                                    )}
                                                                                >
                                                                                    {row.fmt ? row.fmt(value) : value}
                                                                                    {isBest && (
                                                                                        <span className="rounded-full bg-[#7fb7be] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0b3954]">
                                                                                            Best
                                                                                        </span>
                                                                                    )}
                                                                                </span>
                                                                            </td>
                                                                        )
                                                                    })}
                                                                </tr>
                                                            )
                                                        })}
                                                        <tr className="border-t border-white/10">
                                                            <td className="sticky left-0 z-10 bg-[#0b3954]" />
                                                            {chosen.map((v) => (
                                                                <td key={v.id} className="px-3 pt-4">
                                                                    <a
                                                                        href={`#harbourline-${v.id}`}
                                                                        className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-[#0b3954] hover:bg-[#f6efe6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fb7be]"
                                                                    >
                                                                        View villa
                                                                    </a>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center gap-2 p-3 sm:gap-4 sm:p-4">
                                    <ul className="flex shrink-0 gap-1.5 sm:gap-2" aria-label="Villas in the compare tray">
                                        {Array.from({ length: MAX }, (_, slot) => {
                                            const v = chosen[slot]
                                            return (
                                                <li key={slot} className="relative size-9 sm:size-12">
                                                    <AnimatePresence mode="popLayout" initial={false}>
                                                        {v ? (
                                                            <motion.img
                                                                key={v.id}
                                                                src={img(v.img, 200)}
                                                                alt={v.name}
                                                                initial={{ scale: reduceMotion ? 1 : 0.5, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                exit={{ scale: reduceMotion ? 1 : 0.5, opacity: 0 }}
                                                                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                                                                className="size-full rounded-t-full rounded-b-lg object-cover ring-2 ring-white/80"
                                                            />
                                                        ) : (
                                                            <span
                                                                key="empty"
                                                                className="grid size-full place-items-center rounded-t-full rounded-b-lg border border-dashed border-white/35 text-lg text-white/40"
                                                            >
                                                                <span aria-hidden="true">+</span>
                                                                <span className="sr-only">Empty slot</span>
                                                            </span>
                                                        )}
                                                    </AnimatePresence>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <p aria-live="polite" className="hidden min-w-0 flex-1 text-sm text-white/75 md:block">
                                        <span className="font-semibold text-white">{selected.length} of {MAX}</span>{' '}
                                        {canCompare ? 'ready to compare' : 'add one more villa to compare'}
                                    </p>
                                    <div className="ml-auto flex items-center gap-1 sm:gap-2">
                                        <button
                                            type="button"
                                            className="min-h-11 rounded-full px-2 text-sm font-semibold text-white/75 hover:text-white focus-visible:outline-2 focus-visible:outline-[#7fb7be] sm:px-4"
                                            onClick={() => {
                                                setSelected([])
                                                setOpen(false)
                                            }}
                                        >
                                            Clear
                                        </button>
                                        <button
                                            ref={toggleRef}
                                            type="button"
                                            aria-expanded={expanded}
                                            aria-controls={`${uid}-table`}
                                            disabled={!canCompare}
                                            className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#f6efe6] px-3 text-sm font-semibold text-[#0b3954] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fb7be] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                                            onClick={() => setOpen((o) => !o)}
                                        >
                                            {expanded ? 'Hide' : `Compare (${selected.length})`}
                                            <HiChevronUp
                                                aria-hidden="true"
                                                className={cn('hidden size-4 transition-transform sm:block', expanded && 'rotate-180')}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default CompareTrayListingsGrid

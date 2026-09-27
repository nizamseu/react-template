// ComparePickResultsList

// ResultsList03 · Directories & Search Aggregators › Aggregated Results List

// Description:
// A dark, data-forward results list for the search app Findly: "Coworking in Dhaka, side
// by side." Eight coworking spaces show a photo, rating, day-pass price, Wi-Fi speed,
// hours and meeting rooms. Visitors tick "Compare" on up to three spaces; a tray docks at
// the bottom and its "Compare 3" button slides up a sheet with a side-by-side view that
// flags the best value in each row. Use it for any directory where people shortlist and
// weigh options.

// Design:
// - Slate #0f172a section with lime #bef264 accents and a faint lime glow; heading in
//   tight sans (text-4xl → lg:6xl) with "side by side" set on a lime marker; mono spec
//   labels
// - Cards: rounded-[22px] white/3% panels with 4:3 photos, a lime rating, big mono price
//   and spec chips; a picked card gets a lime ring and a filled check in its "Compare"
//   toggle
// - Tray: sticky bottom-4 glass bar with three slots (thumb + ×, or dashed "+") and a
//   lime "Compare 2/3" button; the sheet is a fixed bottom panel over a slate/75 backdrop
// - Motion: tray and sheet slide up with springs, cards scale on pick; MotionConfig
//   reducedMotion="user" removes the movement
// - Responsive: cards 1 → sm:2 → lg:4 columns; the comparison stacks each row label above
//   its values on mobile and uses a 9rem label column from sm

// What it does:
// - Toggles "Open 24/7", "Under ৳800/day" and "Phone booths" filter the local array with
//   a live count and an empty state ("Reset filters")
// - "Compare" (aria-pressed) keeps up to 3 picks in order (Canopy Commons and Hive Loft
//   start picked); a 4th try shows "Compare holds 3 spaces" for 2.5 s (timeout cleared on
//   unmount); picks survive filtering; "Clear" empties the tray; aria-live announces
//   changes
// - "Compare 2/3" (reads "Pick 1 more" below 2) opens a role="dialog" sheet: focus moves
//   to Close, Tab is trapped, Escape/backdrop close it and focus returns; page scroll is
//   locked while open, and removing picks below two closes it
// - Names link to #findly-<id>, "Book a tour" to #findly-<id>-tour

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ComparePickResultsList from '@/TestComponent/PageSections/directory/ResultsList03';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <ComparePickResultsList />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
    HiArrowRight,
    HiCheck,
    HiMiniStar,
    HiOutlineArrowPath,
    HiOutlineClock,
    HiOutlineMagnifyingGlass,
    HiOutlineUserGroup,
    HiOutlineWifi,
    HiPlus,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const MAX_PICKS = 3

const spaces = [
    {
        id: 'hive-loft',
        name: 'Hive Loft',
        area: 'Gulshan 1',
        rating: 4.8,
        reviews: 412,
        dayPass: 900,
        monthly: 14500,
        wifi: 500,
        hours: 'Open 24/7',
        is247: true,
        rooms: 6,
        distance: 1.4,
        booths: true,
        showers: true,
        parking: false,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        alt: 'A large open-plan coworking floor with long shared desks',
    },
    {
        id: 'workbench-banani',
        name: 'Workbench Banani',
        area: 'Road 11, Banani',
        rating: 4.6,
        reviews: 287,
        dayPass: 650,
        monthly: 11000,
        wifi: 300,
        hours: '8 am – 11 pm',
        is247: false,
        rooms: 3,
        distance: 2.2,
        booths: true,
        showers: false,
        parking: false,
        image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
        alt: 'An open office with an exposed industrial ceiling and rows of desks',
    },
    {
        id: 'deskline',
        name: 'Deskline Dhanmondi',
        area: 'Road 27, Dhanmondi',
        rating: 4.4,
        reviews: 198,
        dayPass: 500,
        monthly: 8500,
        wifi: 200,
        hours: '9 am – 10 pm',
        is247: false,
        rooms: 2,
        distance: 6.8,
        booths: false,
        showers: false,
        parking: true,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        alt: 'People working together on laptops around a café-style table',
    },
    {
        id: 'northlight',
        name: 'Northlight Studio',
        area: 'Sector 7, Uttara',
        rating: 4.7,
        reviews: 156,
        dayPass: 750,
        monthly: 12000,
        wifi: 400,
        hours: 'Open 24/7',
        is247: true,
        rooms: 4,
        distance: 9.5,
        booths: false,
        showers: false,
        parking: true,
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
        alt: 'A bright studio office with plants, white desks and big windows',
    },
    {
        id: 'canopy-commons',
        name: 'Canopy Commons',
        area: 'Baridhara',
        rating: 4.9,
        reviews: 341,
        dayPass: 1200,
        monthly: 18000,
        wifi: 1000,
        hours: 'Open 24/7',
        is247: true,
        rooms: 9,
        distance: 2.9,
        booths: true,
        showers: true,
        parking: true,
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
        alt: 'A calm open-plan office with wooden floors and glass meeting rooms',
    },
    {
        id: 'tinshed',
        name: 'Tinshed Collective',
        area: 'Mohakhali DOHS',
        rating: 4.3,
        reviews: 122,
        dayPass: 450,
        monthly: 7500,
        wifi: 150,
        hours: '8 am – 9 pm',
        is247: false,
        rooms: 1,
        distance: 3.6,
        booths: false,
        showers: false,
        parking: true,
        image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
        alt: 'An industrial café-style workspace with a long counter and stools',
    },
    {
        id: 'glasshouse',
        name: 'Glasshouse Works',
        area: 'Tejgaon',
        rating: 4.5,
        reviews: 209,
        dayPass: 800,
        monthly: 13000,
        wifi: 600,
        hours: '7 am – midnight',
        is247: false,
        rooms: 5,
        distance: 4.1,
        booths: true,
        showers: true,
        parking: false,
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
        alt: 'A glass-walled office corridor with meeting rooms on both sides',
    },
    {
        id: 'meridian',
        name: 'Meridian Suites',
        area: 'Gulshan 2',
        rating: 4.6,
        reviews: 264,
        dayPass: 1000,
        monthly: 16000,
        wifi: 500,
        hours: 'Open 24/7',
        is247: true,
        rooms: 7,
        distance: 0.9,
        booths: false,
        showers: true,
        parking: true,
        image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
        alt: 'A meeting room with a long table overlooking the city skyline',
    },
]

const taka = (n) => `৳${n.toLocaleString('en-US')}`

const filterDefs = [
    { id: 'always', label: 'Open 24/7', test: (s) => s.is247 },
    { id: 'budget', label: 'Under ৳800/day', test: (s) => s.dayPass < 800 },
    { id: 'booths', label: 'Phone booths', test: (s) => s.booths },
]

const compareRows = [
    { id: 'rating', label: 'Rating', best: 'max', value: (s) => s.rating, render: (s) => `${s.rating.toFixed(1)} ★`, sub: (s) => `${s.reviews} reviews` },
    { id: 'day', label: 'Day pass', best: 'min', value: (s) => s.dayPass, render: (s) => taka(s.dayPass) },
    { id: 'month', label: 'Hot desk / month', best: 'min', value: (s) => s.monthly, render: (s) => taka(s.monthly) },
    { id: 'wifi', label: 'Wi-Fi speed', best: 'max', value: (s) => s.wifi, render: (s) => `${s.wifi} Mbps` },
    { id: 'hours', label: 'Hours', best: 'max', value: (s) => (s.is247 ? 1 : 0), render: (s) => s.hours },
    { id: 'rooms', label: 'Meeting rooms', best: 'max', value: (s) => s.rooms, render: (s) => String(s.rooms) },
    { id: 'distance', label: 'From Gulshan 2', best: 'min', value: (s) => s.distance, render: (s) => `${s.distance.toFixed(1)} km` },
    { id: 'booths', label: 'Phone booths', flag: 'booths' },
    { id: 'showers', label: 'Showers', flag: 'showers' },
    { id: 'parking', label: 'Parking', flag: 'parking' },
]

const totalReviews = spaces.reduce((sum, s) => sum + s.reviews, 0)

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bef264]'

function bestSet(row, picks) {
    if (!row.best) return new Set()
    const values = picks.map(row.value)
    if (values.every((v) => v === values[0])) return new Set()
    const target = row.best === 'max' ? Math.max(...values) : Math.min(...values)
    return new Set(picks.filter((s) => row.value(s) === target).map((s) => s.id))
}

export function ComparePickResultsList({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [active, setActive] = useState([])
    const [picked, setPicked] = useState(['canopy-commons', 'hive-loft'])
    const [open, setOpen] = useState(false)
    const [limitHit, setLimitHit] = useState(false)
    const [announcement, setAnnouncement] = useState('')
    const limitTimer = useRef(null)
    const openerRef = useRef(null)
    const closeRef = useRef(null)
    const sheetRef = useRef(null)
    const titleId = useId()

    const results = useMemo(
        () => spaces.filter((s) => active.every((id) => filterDefs.find((f) => f.id === id).test(s))),
        [active],
    )
    const picks = picked.map((id) => spaces.find((s) => s.id === id))
    const full = picked.length >= MAX_PICKS
    const canCompare = picks.length >= 2

    useEffect(() => () => clearTimeout(limitTimer.current), [])

    useEffect(() => {
        if (!open) return undefined
        const opener = openerRef.current
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeRef.current?.focus()
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setOpen(false)
                return
            }
            if (event.key !== 'Tab' || !sheetRef.current) return
            const nodes = sheetRef.current.querySelectorAll('a[href], button:not([disabled])')
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
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
            opener?.focus()
        }
    }, [open])

    // Close the sheet if a removal leaves fewer than two picks.
    useEffect(() => {
        if (open && picked.length < 2) setOpen(false)
    }, [open, picked.length])

    const toggleFilter = (id) => {
        setActive((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
    }

    const togglePick = (space) => {
        if (picked.includes(space.id)) {
            setPicked((current) => current.filter((id) => id !== space.id))
            setAnnouncement(`Removed ${space.name} from compare, ${picked.length - 1} of ${MAX_PICKS} picked`)
            return
        }
        if (full) {
            clearTimeout(limitTimer.current)
            setLimitHit(true)
            setAnnouncement(`Compare holds ${MAX_PICKS} spaces. Remove one to add ${space.name}.`)
            limitTimer.current = setTimeout(() => setLimitHit(false), 2500)
            return
        }
        setPicked((current) => [...current, space.id])
        setAnnouncement(`Added ${space.name} to compare, ${picked.length + 1} of ${MAX_PICKS} picked`)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-clip bg-[#0f172a] px-4 py-14 text-base font-normal text-slate-100 sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bef264]/10 blur-3xl"
            />
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
                                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#bef264] text-sm text-[#0f172a]">
                                    <HiOutlineMagnifyingGlass aria-hidden="true" />
                                </span>
                                Findly · Workspaces
                            </p>
                            <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                                Coworking in Dhaka,{' '}
                                <span className="whitespace-nowrap rounded-xl bg-[#bef264] px-2 text-[#0f172a] [box-decoration-break:clone]">
                                    side by side.
                                </span>
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                                Pick up to three spaces and weigh day passes, Wi-Fi speeds and meeting rooms before
                                you book a tour.
                            </p>
                        </div>
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                            {spaces.length} spaces · {totalReviews.toLocaleString('en-US')} reviews · prices in BDT
                        </p>
                    </div>

                    <div className="mt-10 flex flex-col gap-4 border-y border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div role="group" aria-label="Filter spaces" className="flex flex-wrap gap-2">
                            {filterDefs.map((filter) => {
                                const on = active.includes(filter.id)
                                return (
                                    <button
                                        key={filter.id}
                                        type="button"
                                        aria-pressed={on}
                                        onClick={() => toggleFilter(filter.id)}
                                        className={cn(
                                            'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                                            on
                                                ? 'border-[#bef264] bg-[#bef264] text-[#0f172a]'
                                                : 'border-white/15 text-slate-300 hover:border-white/40 hover:text-white',
                                            focusRing,
                                        )}
                                    >
                                        {on ? <HiCheck aria-hidden="true" /> : <HiPlus aria-hidden="true" className="text-slate-500" />}
                                        {filter.label}
                                    </button>
                                )
                            })}
                        </div>
                        <p aria-live="polite" aria-atomic="true" className="font-mono text-sm text-slate-400">
                            <span className="text-[#bef264]">{String(results.length).padStart(2, '0')}</span> /{' '}
                            {String(spaces.length).padStart(2, '0')} spaces
                        </p>
                    </div>

                    {results.length ? (
                        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                            {results.map((space) => {
                                const isPicked = picked.includes(space.id)
                                const blocked = full && !isPicked
                                return (
                                    <motion.li
                                        key={space.id}
                                        layout
                                        animate={{ scale: isPicked ? 0.985 : 1 }}
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        className={cn(
                                            'flex flex-col rounded-[22px] border bg-white/[0.03] p-2 transition-colors',
                                            isPicked ? 'border-[#bef264] ring-1 ring-[#bef264]' : 'border-white/10 hover:border-white/25',
                                        )}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-800">
                                            <img
                                                src={space.image}
                                                alt={space.alt}
                                                loading="lazy"
                                                className="h-full w-full object-cover"
                                            />
                                            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-[#0f172a]/85 px-2.5 py-1 text-xs font-semibold text-[#bef264] backdrop-blur">
                                                <HiMiniStar aria-hidden="true" />
                                                {space.rating.toFixed(1)}
                                                <span className="font-normal text-slate-400">({space.reviews})</span>
                                                <span className="sr-only"> out of 5, {space.reviews} reviews</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="text-lg font-semibold leading-tight tracking-tight text-white">
                                                        <a
                                                            href={`#findly-${space.id}`}
                                                            className={cn('rounded hover:text-[#bef264]', focusRing)}
                                                        >
                                                            {space.name}
                                                        </a>
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-400">{space.area}</p>
                                                </div>
                                                <p className="shrink-0 text-right font-mono text-lg font-semibold leading-tight text-white">
                                                    {taka(space.dayPass)}
                                                    <span className="block text-[11px] font-normal uppercase tracking-[0.14em] text-slate-500">
                                                        per day
                                                    </span>
                                                </p>
                                            </div>
                                            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px] text-slate-300">
                                                <li className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1">
                                                    <HiOutlineWifi aria-hidden="true" className="text-[#bef264]" />
                                                    {space.wifi} Mbps
                                                </li>
                                                <li className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1">
                                                    <HiOutlineClock aria-hidden="true" className="text-[#bef264]" />
                                                    {space.hours}
                                                </li>
                                                <li className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1">
                                                    <HiOutlineUserGroup aria-hidden="true" className="text-[#bef264]" />
                                                    {space.rooms} {space.rooms === 1 ? 'room' : 'rooms'}
                                                </li>
                                            </ul>
                                            <button
                                                type="button"
                                                aria-pressed={isPicked}
                                                aria-disabled={blocked || undefined}
                                                onClick={() => togglePick(space)}
                                                className={cn(
                                                    'mt-5 inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3 text-sm font-semibold transition-colors',
                                                    isPicked
                                                        ? 'border-[#bef264]/60 bg-[#bef264]/10 text-[#bef264]'
                                                        : 'border-white/10 text-slate-200 hover:border-white/30',
                                                    blocked && 'cursor-not-allowed opacity-50 hover:border-white/10',
                                                    focusRing,
                                                )}
                                            >
                                                <span className="inline-flex items-center gap-2.5">
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'grid h-5 w-5 place-items-center rounded-md border text-xs',
                                                            isPicked ? 'border-[#bef264] bg-[#bef264] text-[#0f172a]' : 'border-slate-500',
                                                        )}
                                                    >
                                                        {isPicked ? <HiCheck /> : null}
                                                    </span>
                                                    Compare
                                                    <span className="sr-only"> {space.name}</span>
                                                </span>
                                                <span className="font-mono text-[11px] font-normal text-slate-500">
                                                    {isPicked ? `#${picked.indexOf(space.id) + 1}` : blocked ? 'Full' : ''}
                                                </span>
                                            </button>
                                        </div>
                                    </motion.li>
                                )
                            })}
                        </ul>
                    ) : (
                        <div className="mt-8 flex flex-col items-center rounded-[22px] border border-dashed border-white/15 px-6 py-16 text-center">
                            <p className="font-mono text-5xl font-semibold text-[#bef264]">00</p>
                            <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">No spaces tick every box</h3>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                                Nothing open 24/7 is under ৳800 a day with phone booths yet. Drop a filter to see more.
                            </p>
                            <button
                                type="button"
                                onClick={() => setActive([])}
                                className={cn(
                                    'mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#bef264] px-5 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#d9f99d]',
                                    focusRing,
                                )}
                            >
                                <HiOutlineArrowPath aria-hidden="true" />
                                Reset filters
                            </button>
                        </div>
                    )}

                    <p className="sr-only" aria-live="polite" aria-atomic="true">
                        {announcement}
                    </p>

                    <div className="pointer-events-none sticky bottom-4 z-30 mt-8 flex justify-center">
                        <AnimatePresence initial={false}>
                            {picks.length ? (
                                <motion.div
                                    key="tray"
                                    initial={{ y: 80, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 80, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                                    className="pointer-events-auto relative w-full max-w-3xl rounded-[22px] border border-white/15 bg-[#0b1222]/90 p-2.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-3"
                                >
                                    <AnimatePresence>
                                        {limitHit ? (
                                            <motion.p
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 6 }}
                                                className="absolute -top-11 left-1/2 w-max max-w-[calc(100vw-3rem)] -translate-x-1/2 rounded-full bg-[#bef264] px-4 py-2 text-xs font-semibold text-[#0f172a]"
                                            >
                                                Compare holds {MAX_PICKS} spaces. Remove one first.
                                            </motion.p>
                                        ) : null}
                                    </AnimatePresence>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <ul className="flex min-w-0 flex-1 gap-1.5 sm:gap-2" aria-label="Picked for compare">
                                            {Array.from({ length: MAX_PICKS }, (_, slot) => {
                                                const space = picks[slot]
                                                if (!space) {
                                                    return (
                                                        <li
                                                            key={`empty-${slot}`}
                                                            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-dashed border-white/20 text-slate-500 sm:h-12 sm:w-auto sm:flex-1 sm:basis-0"
                                                        >
                                                            <HiPlus aria-hidden="true" />
                                                            <span className="sr-only">Empty slot</span>
                                                        </li>
                                                    )
                                                }
                                                return (
                                                    <li
                                                        key={space.id}
                                                        className="relative flex h-11 w-11 shrink-0 items-center gap-2 rounded-xl bg-white/5 sm:h-12 sm:w-auto sm:min-w-0 sm:flex-1 sm:basis-0 sm:pr-9"
                                                    >
                                                        <img
                                                            src={space.image}
                                                            alt=""
                                                            loading="lazy"
                                                            className="h-11 w-11 shrink-0 rounded-xl object-cover sm:h-12 sm:w-12"
                                                        />
                                                        <span className="hidden truncate text-sm font-medium text-white sm:block">
                                                            {space.name}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            aria-label={`Remove ${space.name} from compare`}
                                                            onClick={() => togglePick(space)}
                                                            className={cn(
                                                                'absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white text-xs text-[#0f172a] shadow after:absolute after:-inset-2 sm:right-1.5 sm:top-1/2 sm:h-7 sm:w-7 sm:-translate-y-1/2 sm:bg-white/10 sm:text-white sm:hover:bg-white/20',
                                                                focusRing,
                                                            )}
                                                        >
                                                            <HiXMark aria-hidden="true" />
                                                        </button>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        <button
                                            type="button"
                                            onClick={() => setPicked([])}
                                            className={cn(
                                                'hidden min-h-11 rounded-xl px-3 text-sm font-medium text-slate-400 hover:text-white sm:inline-flex sm:items-center',
                                                focusRing,
                                            )}
                                        >
                                            Clear
                                        </button>
                                        <button
                                            ref={openerRef}
                                            type="button"
                                            disabled={!canCompare}
                                            onClick={() => setOpen(true)}
                                            className={cn(
                                                'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-[#bef264] px-3.5 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#d9f99d] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 sm:min-h-12 sm:px-5',
                                                focusRing,
                                            )}
                                        >
                                            {canCompare ? `Compare ${picks.length}` : 'Pick 1 more'}
                                            <HiArrowRight aria-hidden="true" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>

                <AnimatePresence>
                    {open ? (
                        <div key="sheet" className="fixed inset-0 z-[70] flex items-end justify-center">
                            <motion.div
                                aria-hidden="true"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#020617]/75 backdrop-blur-sm"
                                onClick={() => setOpen(false)}
                            />
                            <motion.div
                                ref={sheetRef}
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby={titleId}
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                                className="relative max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-t-[28px] border border-b-0 border-white/15 bg-[#0b1222] px-4 pb-8 pt-3 text-slate-100 sm:px-8"
                            >
                                <div aria-hidden="true" className="mx-auto h-1.5 w-12 rounded-full bg-white/20" />
                                <div className="mt-4 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#bef264]">
                                            Findly compare
                                        </p>
                                        <h3 id={titleId} className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                            {picks.length} spaces, side by side
                                        </h3>
                                    </div>
                                    <button
                                        ref={closeRef}
                                        type="button"
                                        aria-label="Close compare"
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-lg text-white hover:bg-white/10',
                                            focusRing,
                                        )}
                                    >
                                        <HiXMark aria-hidden="true" />
                                    </button>
                                </div>

                                <div
                                    role="table"
                                    aria-label="Coworking spaces compared"
                                    style={{ '--cols': picks.length }}
                                    className="mt-6"
                                >
                                    <div
                                        role="row"
                                        className="grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-3 pb-4 sm:grid-cols-[9rem_repeat(var(--cols),minmax(0,1fr))]"
                                    >
                                        <span role="columnheader" className="sr-only sm:not-sr-only sm:self-end sm:font-mono sm:text-[11px] sm:uppercase sm:tracking-[0.18em] sm:text-slate-500">
                                            Space
                                        </span>
                                        {picks.map((space) => (
                                            <div role="columnheader" key={space.id} className="min-w-0">
                                                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-800">
                                                    <img src={space.image} alt={space.alt} className="h-full w-full object-cover" />
                                                    <button
                                                        type="button"
                                                        aria-label={`Remove ${space.name} from compare`}
                                                        onClick={() => togglePick(space)}
                                                        className={cn(
                                                            'absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-[#0f172a]/80 text-sm text-white hover:bg-[#0f172a]',
                                                            focusRing,
                                                        )}
                                                    >
                                                        <HiXMark aria-hidden="true" />
                                                    </button>
                                                </div>
                                                <p className="mt-2 truncate text-sm font-semibold text-white sm:text-base">{space.name}</p>
                                                <p className="truncate text-xs text-slate-400">{space.area}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {compareRows.map((row) => {
                                        const winners = bestSet(row, picks)
                                        return (
                                            <div
                                                role="row"
                                                key={row.id}
                                                className="grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-3 gap-y-1.5 border-t border-white/10 py-3 sm:grid-cols-[9rem_repeat(var(--cols),minmax(0,1fr))] sm:items-center"
                                            >
                                                <span
                                                    role="rowheader"
                                                    className="col-span-full font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 sm:col-span-1"
                                                >
                                                    {row.label}
                                                </span>
                                                {picks.map((space) => {
                                                    const win = winners.has(space.id)
                                                    return (
                                                        <span role="cell" key={space.id} className="min-w-0 text-sm">
                                                            {row.flag ? (
                                                                <span
                                                                    className={cn(
                                                                        'inline-flex items-center gap-1.5',
                                                                        space[row.flag] ? 'text-[#bef264]' : 'text-slate-500',
                                                                    )}
                                                                >
                                                                    {space[row.flag] ? <HiCheck aria-hidden="true" /> : <HiXMark aria-hidden="true" />}
                                                                    {space[row.flag] ? 'Yes' : 'No'}
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <span
                                                                        className={cn(
                                                                            'font-semibold tabular-nums',
                                                                            win ? 'text-[#bef264]' : 'text-white',
                                                                        )}
                                                                    >
                                                                        {row.render(space)}
                                                                    </span>
                                                                    {win ? (
                                                                        <span className="ml-1.5 inline-block rounded bg-[#bef264] px-1.5 py-px align-middle font-mono text-[10px] font-semibold uppercase text-[#0f172a]">
                                                                            Best
                                                                        </span>
                                                                    ) : null}
                                                                    {row.sub ? (
                                                                        <span className="block text-xs text-slate-500">{row.sub(space)}</span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}

                                    <div
                                        role="row"
                                        className="grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-3 border-t border-white/10 pt-4 sm:grid-cols-[9rem_repeat(var(--cols),minmax(0,1fr))]"
                                    >
                                        <span aria-hidden="true" className="hidden sm:block" />
                                        {picks.map((space) => (
                                            <span role="cell" key={space.id} className="min-w-0">
                                                <a
                                                    href={`#findly-${space.id}-tour`}
                                                    className={cn(
                                                        'inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-white px-2 text-center text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#bef264]',
                                                        focusRing,
                                                    )}
                                                >
                                                    Book a tour
                                                    <span className="sr-only"> at {space.name}</span>
                                                </a>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : null}
                </AnimatePresence>
            </MotionConfig>
        </section>
    )
}

export default ComparePickResultsList

// ExpandingPillBookingSearch

// BookingSearch02 · Booking & Reservations › Search / Booking Engine

// Description:
// A bright, friendly home-rental search for the fictional brand Nestaway. Under the
// heading "Stay somewhere that feels like yours." sits a single rounded pill split into
// Where / When / Who; clicking a segment grows a panel beneath it with suggested places,
// quick date presets or guest counters, and "Search" returns a line like "212 homes in
// Manarola, Italy". Use it as the hero search on a vacation-rental marketplace.

// Design:
// - White section, charcoal #222222 text, coral #ff5a5f accents (italic headline word with
//   a hand-drawn SVG underline, step numbers, counters, search button); soft coral glow
// - Pill: rounded-full, 1px #e7e3e1 border, long soft shadow; when a segment is open the
//   pill turns warm grey #f5f2f1 and a white raised lozenge slides to the active segment
// - Panel: rounded-[32px] white card under the pill; suggestion tiles with square photos,
//   preset tiles with date ranges, 44px circular steppers; tilted photo cards frame the
//   heading on xl only (decorative)
// - Base: the pill becomes a stacked rounded-[28px] card with a full-width Search button;
//   md+: a horizontal pill whose round coral button widens into "Search" while a panel
//   is open
// - framer-motion: layoutId lozenge, panel height/opacity reveal, content cross-fade,
//   result line slide-up; motion offsets are removed for reduced motion

// What it does:
// - active segment state opens one panel; Escape or a click outside the pill closes it
//   (Escape returns focus); choosing a place moves to When, a preset moves to Who
// - Where filters the six suggestions as you type and offers "Search for “…”"; When has
//   four fixed 2026 presets plus a ± flexibility choice; Who counts adults, children,
//   infants and pets (adding anyone else sets adults to at least 1)
// - Search without a destination reopens Where with a hint; otherwise it shows the result
//   line with a link to #nestaway-results; the framing photos are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ExpandingPillBookingSearch from '@/TestComponent/PageSections/booking/BookingSearch02';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <ExpandingPillBookingSearch />
//     </main>
// )
// ```

'use client'

import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiMagnifyingGlass, HiMinus, HiPlus } from 'react-icons/hi2';
import { LuCalendarDays, LuMapPin, LuSparkles } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const img = (id, w = 400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const places = [
    {
        name: 'Manarola, Italy',
        note: 'Cliffside village · 4h by train',
        homes: 212,
        src: img('1516483638261-f4dbaf036963'),
        alt: 'Colourful houses stacked on a cliff above the sea',
    },
    {
        name: 'Oia, Greece',
        note: 'Whitewashed coast · ferry access',
        homes: 348,
        src: img('1533105079780-92b9be482077'),
        alt: 'White coastal houses above a blue sea',
    },
    {
        name: 'Kyoto, Japan',
        note: 'Machiya townhouses · tea houses',
        homes: 526,
        src: img('1493976040374-85c8e12f0c0e'),
        alt: 'Kyoto street leading to a wooden pagoda',
    },
    {
        name: 'Lake Braies, Italy',
        note: 'Alpine cabins · lake swims',
        homes: 94,
        src: img('1476514525535-07fb3b4ae5f1'),
        alt: 'Wooden rowboats on a green alpine lake below mountains',
    },
    {
        name: 'Hạ Long Bay, Vietnam',
        note: 'Karst islands · boat stays',
        homes: 131,
        src: img('1528127269322-539801943592'),
        alt: 'Traditional boats among limestone karsts in a bay',
    },
    {
        name: 'Ubud, Bali',
        note: 'Jungle villas · lake temples',
        homes: 611,
        src: img('1537996194471-e657df975ab4'),
        alt: 'Balinese temple standing on a calm lake',
    },
]

const presets = [
    { id: 'weekend', label: 'This weekend', range: 'Fri 16 – Sun 18 Oct', short: '16 – 18 Oct', nights: 2 },
    { id: 'week', label: 'Next week', range: 'Mon 19 – Sun 25 Oct', short: '19 – 25 Oct', nights: 6 },
    { id: 'halfterm', label: 'Half-term', range: 'Sat 24 Oct – Sun 1 Nov', short: '24 Oct – 1 Nov', nights: 8 },
    { id: 'november', label: 'Long weekend', range: 'Fri 13 – Mon 16 Nov', short: '13 – 16 Nov', nights: 3 },
]

const flexOptions = ['Exact dates', '± 1 day', '± 2 days', '± 3 days', '± 7 days']

const guestRows = [
    { key: 'adults', label: 'Adults', hint: 'Ages 13 or above', max: 16 },
    { key: 'children', label: 'Children', hint: 'Ages 2 – 12', max: 15 },
    { key: 'infants', label: 'Infants', hint: 'Under 2', max: 5 },
    { key: 'pets', label: 'Pets', hint: 'Well-behaved, house-trained', max: 3 },
]

const segments = [
    { id: 'where', label: 'Where', num: '01' },
    { id: 'when', label: 'When', num: '02' },
    { id: 'who', label: 'Who', num: '03' },
]

function homesFor(name) {
    const known = places.find((p) => p.name.toLowerCase() === name.toLowerCase())
    if (known) return known.homes
    let hash = 7
    for (const char of name.toLowerCase()) hash = (hash * 33 + char.charCodeAt(0)) % 900
    return 40 + hash
}

function guestText(g) {
    const people = g.adults + g.children
    const parts = []
    if (people) parts.push(`${people} guest${people > 1 ? 's' : ''}`)
    if (g.infants) parts.push(`${g.infants} infant${g.infants > 1 ? 's' : ''}`)
    if (g.pets) parts.push(`${g.pets} pet${g.pets > 1 ? 's' : ''}`)
    return parts.join(', ')
}

export function ExpandingPillBookingSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState(null)
    const [where, setWhere] = useState('')
    const [query, setQuery] = useState('')
    const [presetId, setPresetId] = useState(null)
    const [flex, setFlex] = useState('Exact dates')
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })
    const [hint, setHint] = useState('')
    const [result, setResult] = useState(null)
    const wrapRef = useRef(null)
    const segmentRefs = useRef({})
    const queryRef = useRef(null)

    const preset = presets.find((p) => p.id === presetId)
    const matches = places.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))

    useEffect(() => {
        if (!active) return undefined
        const onPointer = (event) => {
            if (wrapRef.current && !wrapRef.current.contains(event.target)) setActive(null)
        }
        const onKey = (event) => {
            if (event.key === 'Escape') {
                segmentRefs.current[active]?.focus()
                setActive(null)
            }
        }
        document.addEventListener('pointerdown', onPointer)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onPointer)
            document.removeEventListener('keydown', onKey)
        }
    }, [active])

    useEffect(() => {
        if (active === 'where') queryRef.current?.focus({ preventScroll: true })
    }, [active])

    const toggle = (id) => setActive((current) => (current === id ? null : id))

    const pickPlace = (name) => {
        setWhere(name)
        setQuery('')
        setHint('')
        setActive('when')
    }

    const setGuest = (key, value) => {
        setGuests((g) => {
            const next = { ...g, [key]: Math.max(0, value) }
            if (key !== 'adults' && value > g[key] && next.adults === 0) next.adults = 1
            if (key === 'adults' && next.adults === 0 && next.children + next.infants + next.pets > 0) next.adults = 1
            return next
        })
    }

    const onSearch = () => {
        if (!where) {
            setHint('Choose a destination to start your search')
            setActive('where')
            setResult(null)
            return
        }
        setActive(null)
        setResult({
            where,
            homes: homesFor(where),
            dates: preset ? `${preset.short}${flex !== 'Exact dates' ? ` (${flex})` : ''}` : 'Any week',
            guests: guestText(guests) || 'Any number of guests',
        })
    }

    const values = {
        where: where || 'Search destinations',
        when: preset ? preset.short : 'Add dates',
        who: guestText(guests) || 'Add guests',
    }
    const filled = { where: Boolean(where), when: Boolean(preset), who: Boolean(guestText(guests)) }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#222222] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[56rem] max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,90,95,0.14),transparent)]"
            />

            <div className="relative mx-auto max-w-5xl">
                <div aria-hidden="true" className="hidden xl:block">
                    <div className="absolute left-0 top-2 w-28 -rotate-6 rounded-2xl bg-white p-2 shadow-[0_24px_40px_-20px_rgba(34,34,34,0.45)]">
                        <img src={places[0].src} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
                        <p className="mt-2 whitespace-nowrap px-1 text-[10px] font-semibold text-[#222222]">Manarola ★ 4.97</p>
                    </div>
                    <div className="absolute right-0 top-24 w-28 rotate-6 rounded-2xl bg-white p-2 shadow-[0_24px_40px_-20px_rgba(34,34,34,0.45)]">
                        <img src={places[1].src} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
                        <p className="mt-2 whitespace-nowrap px-1 text-[10px] font-semibold text-[#222222]">Oia · from €142</p>
                    </div>
                </div>

                <div className="mx-auto max-w-3xl text-center">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#222222]">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 text-[#ff5a5f]">
                            <path
                                d="M3 11.5 12 4l9 7.5M5.5 9.5V19a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="12" cy="14.5" r="2.2" fill="currentColor" />
                        </svg>
                        nestaway
                    </p>
                    <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#222222] sm:text-5xl lg:text-[4.25rem]">
                        Stay somewhere that feels like{' '}
                        <span className="relative inline-block italic text-[#ff5a5f]">
                            yours.
                            <svg
                                viewBox="0 0 200 18"
                                aria-hidden="true"
                                preserveAspectRatio="none"
                                className="absolute -bottom-2 left-0 h-3 w-full text-[#ff5a5f]"
                            >
                                <path
                                    d="M3 12c40-8 90-11 140-6 18 2 36 4 54 1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#222222]/65 sm:text-lg">
                        2.1 million homes, from cliffside flats to lake cabins, each checked by a local
                        Nestaway host team.
                    </p>
                </div>

                <div ref={wrapRef} className="relative mx-auto mt-10 max-w-4xl md:mt-12">
                    <div
                        className={cn(
                            'flex flex-col rounded-[28px] border border-[#e7e3e1] p-1.5 shadow-[0_18px_50px_-24px_rgba(34,34,34,0.35)] transition-colors duration-300 md:flex-row md:items-center md:rounded-full',
                            active ? 'bg-[#f5f2f1]' : 'bg-white',
                        )}
                    >
                        {segments.map((segment, index) => {
                            const isActive = active === segment.id
                            return (
                                <Fragment key={segment.id}>
                                    {index > 0 && (
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'mx-5 h-px bg-[#e7e3e1] transition-opacity md:mx-0 md:h-8 md:w-px',
                                                (active === segment.id || active === segments[index - 1].id) && 'opacity-0',
                                            )}
                                        />
                                    )}
                                    <button
                                        ref={(el) => {
                                            segmentRefs.current[segment.id] = el
                                        }}
                                        type="button"
                                        aria-expanded={isActive}
                                        aria-controls={`${uid}-panel`}
                                        className={cn(
                                            'relative flex min-h-16 w-full items-center gap-3 rounded-[22px] px-5 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5a5f] md:min-w-0 md:flex-1 md:rounded-full md:px-7',
                                            !isActive && 'hover:bg-[#222222]/[0.04]',
                                        )}
                                        onClick={() => toggle(segment.id)}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId={`${uid}-lozenge`}
                                                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                                                className="absolute inset-0 rounded-[22px] bg-white shadow-[0_10px_30px_-12px_rgba(34,34,34,0.35)] md:rounded-full"
                                            />
                                        )}
                                        <span className="relative font-mono text-[11px] font-semibold text-[#ff5a5f]">
                                            {segment.num}
                                        </span>
                                        <span className="relative min-w-0">
                                            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[#222222]">
                                                {segment.label}
                                            </span>
                                            <span
                                                className={cn(
                                                    'block truncate text-sm',
                                                    filled[segment.id] ? 'font-semibold text-[#222222]' : 'text-[#222222]/50',
                                                )}
                                            >
                                                {values[segment.id]}
                                            </span>
                                        </span>
                                    </button>
                                </Fragment>
                            )
                        })}
                        <motion.button
                            layout={!reduceMotion}
                            type="button"
                            className="mt-1.5 inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-[22px] bg-[#ff5a5f] px-5 text-base font-bold text-white transition-colors hover:bg-[#e8484d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222222] md:mt-0 md:ml-1 md:rounded-full md:px-[18px]"
                            onClick={onSearch}
                        >
                            <HiMagnifyingGlass aria-hidden="true" className="size-5" />
                            <span className={cn(!active && 'md:sr-only')}>Search</span>
                        </motion.button>
                    </div>

                    <AnimatePresence initial={false}>
                        {active && (
                            <motion.div
                                id={`${uid}-panel`}
                                role="region"
                                aria-label={`${segments.find((s) => s.id === active).label} options`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="mb-8 mt-3 rounded-[32px] border border-[#e7e3e1] bg-white p-4 shadow-[0_24px_40px_-28px_rgba(34,34,34,0.35)] sm:p-6">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.div
                                            key={active}
                                            initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            {active === 'where' && (
                                                <div>
                                                    <label htmlFor={`${uid}-q`} className="sr-only">
                                                        Search destinations
                                                    </label>
                                                    <div className="flex items-center gap-3 rounded-2xl bg-[#f5f2f1] px-4 focus-within:ring-2 focus-within:ring-[#ff5a5f]">
                                                        <LuMapPin aria-hidden="true" className="size-5 text-[#ff5a5f]" />
                                                        <input
                                                            ref={queryRef}
                                                            id={`${uid}-q`}
                                                            value={query}
                                                            placeholder="Try “Kyoto” or “lake”"
                                                            autoComplete="off"
                                                            className="h-12 min-w-0 flex-1 bg-transparent text-base text-[#222222] outline-none placeholder:text-[#222222]/40"
                                                            onChange={(e) => setQuery(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && query.trim()) {
                                                                    e.preventDefault()
                                                                    pickPlace(matches[0]?.name ?? query.trim())
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    {hint && (
                                                        <p role="alert" className="mt-3 text-sm font-semibold text-[#e8484d]">
                                                            {hint}
                                                        </p>
                                                    )}
                                                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#222222]/55">
                                                        {query.trim() ? 'Matching places' : 'Suggested for October'}
                                                    </p>
                                                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                                        {matches.map((place) => (
                                                            <li key={place.name}>
                                                                <button
                                                                    type="button"
                                                                    aria-pressed={where === place.name}
                                                                    className={cn(
                                                                        'group flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#ff5a5f]',
                                                                        where === place.name ? 'bg-[#ff5a5f]/10' : 'hover:bg-[#f5f2f1]',
                                                                    )}
                                                                    onClick={() => pickPlace(place.name)}
                                                                >
                                                                    <img
                                                                        src={place.src}
                                                                        alt={place.alt}
                                                                        loading="lazy"
                                                                        className="size-14 shrink-0 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                                                                    />
                                                                    <span className="min-w-0">
                                                                        <span className="block truncate text-sm font-bold text-[#222222]">
                                                                            {place.name}
                                                                        </span>
                                                                        <span className="block truncate text-xs text-[#222222]/60">
                                                                            {place.note}
                                                                        </span>
                                                                    </span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                        {query.trim() && (
                                                            <li>
                                                                <button
                                                                    type="button"
                                                                    className="flex min-h-[72px] w-full items-center gap-3 rounded-2xl border border-dashed border-[#ff5a5f]/50 p-2 text-left text-sm font-semibold text-[#222222] transition-colors hover:bg-[#ff5a5f]/5 focus-visible:outline-2 focus-visible:outline-[#ff5a5f]"
                                                                    onClick={() => pickPlace(query.trim())}
                                                                >
                                                                    <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#ff5a5f]/10 text-[#ff5a5f]">
                                                                        <HiMagnifyingGlass aria-hidden="true" className="size-5" />
                                                                    </span>
                                                                    <span className="min-w-0 truncate">Search for “{query.trim()}”</span>
                                                                </button>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                            {active === 'when' && (
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#222222]/55">
                                                        Quick picks · 2026
                                                    </p>
                                                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                                        {presets.map((p) => (
                                                            <button
                                                                key={p.id}
                                                                type="button"
                                                                aria-pressed={presetId === p.id}
                                                                className={cn(
                                                                    'flex min-h-24 flex-col justify-between rounded-2xl border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]',
                                                                    presetId === p.id
                                                                        ? 'border-[#222222] bg-[#222222] text-white'
                                                                        : 'border-[#e7e3e1] text-[#222222] hover:border-[#222222]',
                                                                )}
                                                                onClick={() => {
                                                                    setPresetId(p.id)
                                                                    setActive('who')
                                                                }}
                                                            >
                                                                <span className="flex items-center justify-between gap-2 text-sm font-bold">
                                                                    {p.label}
                                                                    <LuCalendarDays
                                                                        aria-hidden="true"
                                                                        className={cn('size-4', presetId === p.id ? 'text-[#ff5a5f]' : 'text-[#222222]/40')}
                                                                    />
                                                                </span>
                                                                <span className="mt-3 block text-sm">{p.range}</span>
                                                                <span
                                                                    className={cn(
                                                                        'text-xs',
                                                                        presetId === p.id ? 'text-white/65' : 'text-[#222222]/55',
                                                                    )}
                                                                >
                                                                    {p.nights} nights
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#222222]/55">
                                                        How flexible are you?
                                                    </p>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {flexOptions.map((option) => (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                aria-pressed={flex === option}
                                                                className={cn(
                                                                    'min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]',
                                                                    flex === option
                                                                        ? 'border-[#ff5a5f] bg-[#ff5a5f] text-white'
                                                                        : 'border-[#e7e3e1] text-[#222222] hover:border-[#222222]',
                                                                )}
                                                                onClick={() => setFlex(option)}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {active === 'who' && (
                                                <div className="grid gap-x-10 sm:grid-cols-2">
                                                    {guestRows.map((row) => (
                                                        <div
                                                            key={row.key}
                                                            className="flex items-center justify-between gap-4 border-b border-[#e7e3e1] py-4 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
                                                        >
                                                            <div>
                                                                <p className="text-base font-bold text-[#222222]">{row.label}</p>
                                                                <p className="text-sm text-[#222222]/55">{row.hint}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    type="button"
                                                                    aria-label={`Fewer ${row.label.toLowerCase()}`}
                                                                    disabled={guests[row.key] === 0}
                                                                    className="grid size-11 place-items-center rounded-full border border-[#222222]/20 text-[#222222] transition-colors hover:border-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f] disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-[#222222]/20"
                                                                    onClick={() => setGuest(row.key, guests[row.key] - 1)}
                                                                >
                                                                    <HiMinus aria-hidden="true" className="size-4" />
                                                                </button>
                                                                <span
                                                                    aria-live="polite"
                                                                    aria-label={`${guests[row.key]} ${row.label.toLowerCase()}`}
                                                                    className="w-6 text-center text-lg font-bold tabular-nums text-[#222222]"
                                                                >
                                                                    {guests[row.key]}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    aria-label={`More ${row.label.toLowerCase()}`}
                                                                    disabled={guests[row.key] >= row.max}
                                                                    className="grid size-11 place-items-center rounded-full border border-[#222222]/20 text-[#222222] transition-colors hover:border-[#ff5a5f] hover:bg-[#ff5a5f] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f] disabled:cursor-not-allowed disabled:opacity-25"
                                                                    onClick={() => setGuest(row.key, guests[row.key] + 1)}
                                                                >
                                                                    <HiPlus aria-hidden="true" className="size-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div aria-live="polite" className="mt-6 min-h-12">
                        <AnimatePresence>
                            {result && !active && (
                                <motion.div
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex flex-col items-center gap-3 rounded-3xl bg-[#222222] px-5 py-4 text-center text-sm text-white sm:flex-row sm:justify-between sm:rounded-full sm:py-3 sm:pl-6 sm:pr-2 sm:text-left"
                                >
                                    <p className="flex items-center gap-2">
                                        <LuSparkles aria-hidden="true" className="size-4 shrink-0 text-[#ff5a5f]" />
                                        <span>
                                            <span className="font-bold">
                                                {result.homes} homes in {result.where}
                                            </span>
                                            <span className="text-white/65">
                                                {' '}
                                                · {result.dates} · {result.guests}
                                            </span>
                                        </span>
                                    </p>
                                    <a
                                        href="#nestaway-results"
                                        className="group inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-white px-4 font-bold text-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]"
                                    >
                                        Show homes
                                        <HiArrowLongRight aria-hidden="true" className="size-4 text-[#ff5a5f] transition-transform group-hover:translate-x-0.5" />
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#222222]/60">
                    <li>
                        <span className="font-bold text-[#222222]">4.91 ★</span> average stay rating
                    </li>
                    <li>
                        <span className="font-bold text-[#222222]">Free</span> cancellation on most homes
                    </li>
                    <li>
                        <span className="font-bold text-[#222222]">No</span> booking fees in October
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default ExpandingPillBookingSearch

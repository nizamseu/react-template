// VoiceMicSearchBar

// FilterSearchBar05 · Directories & Search Aggregators › Multi-Filter Search Bar

// Description:
// A night-sky voice search for the local discovery app Callout. Under "Just say it." a
// glassy pill input carries a large mic button: tapping it shows an animated waveform,
// "hears" the phrase "vegan brunch near me", types it into the field and filters the spots
// below. Typing works too, and "Try saying" prompts replay other phrases. Callout then shows
// what it understood ("vegan", "brunch", "within 2 km"). Use it as an app-style hero search.

// Design:
// - Diagonal gradient #1e1b4b → #4c1d95 with blurred pink/indigo orbs; white type, pink
//   #f472b6 accent; centred heading text-5xl → lg:text-8xl with a gradient-clipped word
// - Search pill: rounded-full white/10 glass, white/20 border, backdrop blur; the 56px mic
//   button is white (idle) or pink with two expanding pulse rings (listening)
// - Waveform: 32 rounded bars scaling on staggered framer-motion loops (static heights for
//   reduced motion); the transcript types in with a blinking caret
// - Results: glass cards (rounded-3xl, 4:3 photos, pink tag chips, distance + rating row),
//   grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-3, animated with layout/AnimatePresence
// - Responsive: pill keeps a single row at 360px (mic shrinks to 48px); prompts wrap and the
//   interpretation chips wrap under the field

// What it does:
// - Mic toggles a mock listening state (no real audio): 0.9 s of waveform, then the phrase
//   types in (45 ms per letter) and becomes the query; tapping again stops and keeps what was
//   heard, Escape cancels; every timer is cleared on stop and unmount
// - The query is parsed live: "near me" → within 2 km, "open now" → open, "cheap" → ৳, other
//   words (minus filler like "to", "for") must all match a spot's name, type or tags
// - 14 spots filter and sort by distance; count + empty state update live; aria-live text
//   announces listening and the heard phrase; cards link to #callout-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VoiceMicSearchBar from '@/TestComponent/PageSections/directory/FilterSearchBar05';

// const DirectoryPage = () => (
//     <main className="space-y-6">
//         <VoiceMicSearchBar />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiMiniStop, HiOutlineMagnifyingGlass, HiOutlineMapPin, HiStar, HiXMark } from 'react-icons/hi2';
import { LuMic } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const DEFAULT_PHRASE = 'vegan brunch near me'
const NEAR_KM = 2
const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const prompts = [DEFAULT_PHRASE, 'late night biryani', 'quiet coffee to work from', 'cheap haircut open now']
const filler = new Set(['a', 'an', 'the', 'to', 'for', 'from', 'in', 'with', 'and', 'some', 'place', 'places', 'spot', 'spots', 'good', 'best', 'find', 'me'])

const spots = [
    { id: 'green-ladle', name: 'Green Ladle Kitchen', type: 'Vegan kitchen', tags: ['vegan', 'brunch', 'salad', 'healthy'], km: 0.8, rating: 4.8, price: 2, open: true, hours: 'Open until 10 pm', image: img('1512621776951-a57141f2eefd'), alt: 'Healthy salad bowl with greens and vegetables' },
    { id: 'sprout-stone', name: 'Sprout & Stone', type: 'Plant-based café', tags: ['vegan', 'brunch', 'smoothie bowls', 'coffee'], km: 1.6, rating: 4.6, price: 2, open: true, hours: 'Open until 6 pm', image: img('1498837167922-ddd27525d352'), alt: 'Colourful bowls of fresh ingredients from above' },
    { id: 'leafy-lane', name: 'Leafy Lane Bistro', type: 'Vegetarian bistro', tags: ['vegetarian', 'vegan options', 'brunch', 'pasta'], km: 3.4, rating: 4.5, price: 3, open: true, hours: 'Open until 11 pm', image: img('1540189549336-e6e99c3679fe'), alt: 'Fresh salad served in a black bowl' },
    { id: 'brick-oven', name: 'Brick Oven Bakehouse', type: 'Bakery & brunch', tags: ['brunch', 'bakery', 'eggs', 'coffee'], km: 5.2, rating: 4.7, price: 1, open: true, hours: 'Open until 9 pm', image: img('1509440159596-0249088772ff'), alt: 'Loaves of crusty bread' },
    { id: 'drip-lab', name: 'Drip Lab', type: 'Pour-over bar', tags: ['coffee', 'quiet', 'work friendly', 'wifi'], km: 1.1, rating: 4.8, price: 3, open: true, hours: 'Open until 10 pm', image: img('1509042239860-f550ce710b93'), alt: 'Latte art cups among plants' },
    { id: 'tin-roof', name: 'Tin Roof Coffee', type: 'Specialty coffee', tags: ['coffee', 'work friendly', 'wifi', 'music'], km: 1.9, rating: 4.6, price: 2, open: true, hours: 'Open until 11 pm', image: img('1521017432531-fbd92d768814'), alt: 'Industrial café with wooden tables' },
    { id: 'paper-boat', name: 'Paper Boat Books', type: 'Bookshop café', tags: ['books', 'quiet', 'coffee', 'work friendly'], km: 6.3, rating: 4.8, price: 1, open: true, hours: 'Open until 9 pm', image: img('1521587760476-6c12a4b040da'), alt: 'Bookshelves filled with books' },
    { id: 'kacchi-kotha', name: 'Kacchi Kotha', type: 'Biryani house', tags: ['biryani', 'kacchi', 'late night', 'bengali'], km: 8.5, rating: 4.8, price: 2, open: true, hours: 'Open until 1 am', image: img('1466978913421-dad2ebd01d17'), alt: 'Friends sharing plates of food' },
    { id: 'dum-pot', name: 'Dum Pot Cloud Kitchen', type: 'Delivery kitchen', tags: ['biryani', 'late night', 'delivery', 'tehari'], km: 1.4, rating: 4.4, price: 1, open: true, hours: 'Delivers until 3 am', image: img('1551218808-94e220e084d2'), alt: 'Chef chopping vegetables in a kitchen' },
    { id: 'smash-club', name: 'Smash Club Burgers', type: 'Burger bar', tags: ['burger', 'late night', 'fries'], km: 1.5, rating: 4.7, price: 2, open: true, hours: 'Open until 1 am', image: img('1568901346375-23c9450c58cd'), alt: 'Cheeseburger on a plate' },
    { id: 'chiselled', name: 'Chiselled Barber Co.', type: 'Barbershop', tags: ['haircut', 'barber', 'beard', 'hot towel'], km: 1.2, rating: 4.8, price: 2, open: true, hours: 'Open until 9 pm', image: img('1503951914875-452162b0f3f1'), alt: 'Barber cutting a client’s hair' },
    { id: 'clip-joint', name: 'Clip Joint Barbers', type: 'Walk-in barber', tags: ['haircut', 'barber', 'walk-in'], km: 2.8, rating: 4.3, price: 1, open: true, hours: 'Open until 10 pm', image: img('1560066984-138dadb4c035'), alt: 'Black and white barbershop interior' },
    { id: 'lotus-leaf', name: 'Lotus Leaf Day Spa', type: 'Day spa', tags: ['spa', 'facial', 'massage', 'quiet'], km: 1.7, rating: 4.7, price: 3, open: false, hours: 'Closed · opens 10 am', image: img('1570172619644-dfd03ed5d881'), alt: 'Facial treatment at a spa' },
    { id: 'lakeside-yoga', name: 'Lakeside Yoga Loft', type: 'Yoga studio', tags: ['yoga', 'meditation', 'quiet', 'vegan café'], km: 5.9, rating: 4.9, price: 2, open: true, hours: 'Next class 6 pm', image: img('1544367567-0f2fcb009e0b'), alt: 'Silhouette of a yoga pose at sunset' },
]

const parse = (raw) => {
    let text = ` ${raw.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ')} `
    const nearMe = / near me /.test(text) || / nearby /.test(text)
    const openNow = / open now /.test(text)
    const cheap = / cheap /.test(text)
    text = text.replace(/ near me /g, ' ').replace(/ nearby /g, ' ').replace(/ open now /g, ' ').replace(/ cheap /g, ' ')
    const terms = text.split(/\s+/).filter((w) => w && !filler.has(w))
    return { nearMe, openNow, cheap, terms }
}

const WAVE_HEIGHTS = ['h-4', 'h-7', 'h-10', 'h-6', 'h-12', 'h-8', 'h-5', 'h-9', 'h-11', 'h-3', 'h-8']
const WAVE = Array.from({ length: 32 }, (_, i) => WAVE_HEIGHTS[(i * 7) % WAVE_HEIGHTS.length])

export function VoiceMicSearchBar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [query, setQuery] = useState('')
    const [listening, setListening] = useState(false)
    const [heard, setHeard] = useState('')
    const [announce, setAnnounce] = useState('')
    const timers = useRef([])
    const heardRef = useRef('')
    const inputRef = useRef(null)

    const clearTimers = () => {
        timers.current.forEach((t) => clearTimeout(t))
        timers.current = []
    }

    useEffect(() => {
        const list = timers
        return () => list.current.forEach((t) => clearTimeout(t))
    }, [])

    const finish = (text) => {
        clearTimers()
        setListening(false)
        setHeard('')
        heardRef.current = ''
        if (text) {
            setQuery(text)
            setAnnounce(`Heard: ${text}`)
        } else {
            setAnnounce('Stopped listening')
        }
    }

    const listen = (phrase = DEFAULT_PHRASE) => {
        clearTimers()
        setListening(true)
        setHeard('')
        heardRef.current = ''
        setAnnounce('Listening…')
        const start = reduceMotion ? 400 : 900
        const step = reduceMotion ? 0 : 45
        for (let i = 1; i <= phrase.length; i += 1) {
            timers.current.push(
                setTimeout(() => {
                    heardRef.current = phrase.slice(0, i)
                    setHeard(heardRef.current)
                }, start + i * step),
            )
        }
        timers.current.push(setTimeout(() => finish(phrase), start + phrase.length * step + 550))
    }

    const toggleMic = () => (listening ? finish(heardRef.current) : listen())

    useEffect(() => {
        if (!listening) return undefined
        const onKey = (e) => {
            if (e.key === 'Escape') finish('')
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    })

    const parsed = useMemo(() => parse(query), [query])

    const results = useMemo(
        () =>
            spots
                .filter((s) => {
                    if (parsed.nearMe && s.km > NEAR_KM) return false
                    if (parsed.openNow && !s.open) return false
                    if (parsed.cheap && s.price > 1) return false
                    const hay = `${s.name} ${s.type} ${s.tags.join(' ')}`.toLowerCase()
                    return parsed.terms.every((t) => hay.includes(t))
                })
                .sort((a, b) => a.km - b.km),
        [parsed],
    )

    const understood = [
        ...parsed.terms.map((t) => ({ id: `t-${t}`, label: t })),
        parsed.nearMe && { id: 'near', label: `within ${NEAR_KM} km`, icon: true },
        parsed.openNow && { id: 'open', label: 'open now' },
        parsed.cheap && { id: 'cheap', label: '৳ budget' },
    ].filter(Boolean)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#1e1b4b] bg-linear-to-br from-[#1e1b4b] to-[#4c1d95] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#f472b6]/25 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-[#6366f1]/25 blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto max-w-6xl">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#f472b6]" aria-hidden="true" />
                        Callout · Voice search
                    </p>
                    <h2 className="mt-6 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">
                        Just{' '}
                        <span className="bg-linear-to-r from-[#f9a8d4] via-[#f472b6] to-[#c4b5fd] bg-clip-text text-transparent">say it.</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/70">
                        Tap the mic and tell Callout what you’re craving. It works out the rest —
                        distance, opening hours and budget.
                    </p>

                    <form
                        role="search"
                        className={cn(
                            'relative mt-10 flex items-center gap-2 rounded-full border bg-white/10 p-1.5 pl-5 shadow-[0_30px_80px_-30px_rgba(15,10,50,0.9)] backdrop-blur-xl transition-colors sm:p-2 sm:pl-6',
                            listening ? 'border-[#f472b6]/70' : 'border-white/20 focus-within:border-white/50',
                        )}
                        onSubmit={(e) => {
                            e.preventDefault()
                            inputRef.current?.blur()
                        }}
                    >
                        <HiOutlineMagnifyingGlass className="h-5 w-5 shrink-0 text-white/60" aria-hidden="true" />
                        <label htmlFor={`${uid}-q`} className="sr-only">
                            Search Callout
                        </label>
                        <input
                            ref={inputRef}
                            id={`${uid}-q`}
                            type="text"
                            value={listening ? heard : query}
                            readOnly={listening}
                            placeholder={listening ? 'Listening…' : 'Say or type “vegan brunch near me”'}
                            autoComplete="off"
                            className="min-h-11 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/45 focus:outline-none sm:text-lg"
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && !listening && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#f472b6]"
                                onClick={() => {
                                    setQuery('')
                                    inputRef.current?.focus()
                                }}
                            >
                                <HiXMark className="h-5 w-5" aria-hidden="true" />
                            </button>
                        )}
                        <span className="relative shrink-0">
                            {listening && !reduceMotion && (
                                <>
                                    <motion.span
                                        className="absolute inset-0 rounded-full bg-[#f472b6]"
                                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                                        aria-hidden="true"
                                    />
                                    <motion.span
                                        className="absolute inset-0 rounded-full bg-[#f472b6]"
                                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.7 }}
                                        aria-hidden="true"
                                    />
                                </>
                            )}
                            <button
                                type="button"
                                aria-pressed={listening}
                                aria-label={listening ? 'Stop listening' : 'Start voice search'}
                                className={cn(
                                    'relative grid h-12 w-12 place-items-center rounded-full shadow-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-14 sm:w-14',
                                    listening ? 'bg-[#f472b6] text-[#2e1065]' : 'bg-white text-[#4c1d95] hover:bg-[#fce7f3]',
                                )}
                                onClick={toggleMic}
                            >
                                {listening ? <HiMiniStop className="h-5 w-5" aria-hidden="true" /> : <LuMic className="h-6 w-6" aria-hidden="true" />}
                            </button>
                        </span>
                    </form>

                    <p className="sr-only" aria-live="polite">
                        {announce}
                    </p>

                    <div className="mt-6 flex min-h-24 flex-col items-center justify-center">
                        <AnimatePresence mode="wait" initial={false}>
                            {listening ? (
                                <motion.div
                                    key="wave"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="flex h-12 items-center gap-[3px]" aria-hidden="true">
                                        {WAVE.map((h, i) => (
                                            <motion.span
                                                key={i}
                                                className={cn('w-1 rounded-full bg-linear-to-t from-[#f472b6] to-[#c4b5fd]', h)}
                                                animate={reduceMotion ? undefined : { scaleY: [0.3, 1, 0.45, 0.85, 0.3] }}
                                                transition={{ duration: 0.9 + (i % 5) * 0.12, repeat: Infinity, ease: 'easeInOut', delay: (i % 7) * 0.06 }}
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-3 text-sm text-white/70">
                                        {heard ? (
                                            <span className="text-lg italic text-white">
                                                “{heard}
                                                <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-[#f472b6] motion-reduce:animate-none" aria-hidden="true" />”
                                            </span>
                                        ) : (
                                            'Listening… press Esc to cancel'
                                        )}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="prompts"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-wrap items-center justify-center gap-2"
                                >
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Try saying</span>
                                    {prompts.map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white/90 transition-colors hover:border-[#f472b6] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f472b6]"
                                            onClick={() => listen(p)}
                                        >
                                            <LuMic className="h-3.5 w-3.5 text-[#f472b6]" aria-hidden="true" />“{p}”
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-2xl font-bold text-white sm:text-3xl" aria-live="polite">
                        {results.length} {results.length === 1 ? 'spot' : 'spots'}{' '}
                        <span className="font-normal text-white/60">{query.trim() ? 'match' : 'around Gulshan'}</span>
                    </h3>
                    {understood.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Callout heard</span>
                            {understood.map((u) => (
                                <span key={u.id} className="inline-flex items-center gap-1 rounded-full bg-[#f472b6]/15 px-3 py-1 text-sm font-semibold text-[#fbcfe8] ring-1 ring-[#f472b6]/40">
                                    {u.icon && <HiOutlineMapPin className="h-4 w-4" aria-hidden="true" />}
                                    {u.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {results.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center backdrop-blur">
                        <LuMic className="mx-auto h-10 w-10 text-[#f472b6]" aria-hidden="true" />
                        <p className="mt-4 text-xl font-bold text-white">Nothing nearby answers to “{query.trim()}”.</p>
                        <p className="mx-auto mt-2 max-w-md text-sm text-white/65">
                            Drop a word, say “nearby” instead of a street, or try one of these.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            <button
                                type="button"
                                className="min-h-11 rounded-full bg-white px-5 text-sm font-bold text-[#4c1d95] hover:bg-[#fce7f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f472b6]"
                                onClick={() => setQuery('')}
                            >
                                Show everything
                            </button>
                            <button
                                type="button"
                                className="min-h-11 rounded-full border border-white/25 px-5 text-sm font-semibold text-white hover:border-[#f472b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f472b6]"
                                onClick={() => listen(DEFAULT_PHRASE)}
                            >
                                Say “{DEFAULT_PHRASE}”
                            </button>
                        </div>
                    </div>
                ) : (
                    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence initial={false} mode="popLayout">
                            {results.map((s) => (
                                <motion.li
                                    key={s.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <a
                                        href={`#callout-${s.id}`}
                                        className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur transition-colors hover:border-[#f472b6]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f472b6]"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={s.image}
                                                alt={s.alt}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#1e1b4b]/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                                                <HiOutlineMapPin className="h-3.5 w-3.5 text-[#f472b6]" aria-hidden="true" />
                                                {s.km} km
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-lg font-bold text-white">{s.name}</p>
                                                    <p className="text-sm text-white/60">
                                                        {s.type} · {'৳'.repeat(s.price)}
                                                    </p>
                                                </div>
                                                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-white">
                                                    <HiStar className="h-4 w-4 text-[#f472b6]" aria-hidden="true" />
                                                    {s.rating.toFixed(1)}
                                                </span>
                                            </div>
                                            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
                                                {s.tags.slice(0, 3).map((t) => (
                                                    <li
                                                        key={t}
                                                        className={cn(
                                                            'rounded-full px-2.5 py-0.5 text-xs',
                                                            parsed.terms.some((term) => t.includes(term))
                                                                ? 'bg-[#f472b6] font-semibold text-[#2e1065]'
                                                                : 'bg-white/10 text-white/80',
                                                        )}
                                                    >
                                                        {t}
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className={cn('mt-4 text-xs font-semibold', s.open ? 'text-[#86efac]' : 'text-white/50')}>{s.hours}</p>
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

export default VoiceMicSearchBar

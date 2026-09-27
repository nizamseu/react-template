// PhotoDotListingsGrid

// ListingsGrid01 · Booking & Reservations › Listings / Availability Grid

// Description:
// A photo-first grid of eight holiday homes around Lisbon for the fictional rental brand
// Nestaway. Under "Guest favourites near Lisbon" each card has its own mini photo carousel
// (dots, hover arrows, swipe), a wishlist heart, a "Guest favourite" badge, the rating,
// dates and a per-night price; category chips (City, Beach, Countryside, Pools) filter
// the grid and a switch shows 5-night totals. Use it for search results or a curated
// collection.

// Design:
// - White section, charcoal #222222 type, coral #ff5a5f for the active chip, switch,
//   hearts and focus rings; soft #f7f7f7 skeleton behind photos
// - Grid 1 → sm:2 → lg:4 columns (gap-x-6 gap-y-10); square rounded-3xl photos, cards
//   have no border — the photo is the card, text sits beneath in a compact stack
// - Carousel: white 40px arrow buttons fade in on hover/focus (always visible on touch
//   screens), dots at the bottom grow and turn white for the active photo; a white badge
//   with a laurel SVG marks guest favourites
// - Header splits on md (heading left, total switch right); the chip row below scrolls
//   horizontally inside its own strip on small screens
// - framer-motion: track slides between photos, cards re-flow with layout animation when
//   filtered, heart pops on save, toast slides up; reduced motion removes the movement

// What it does:
// - Each card keeps its own photo index: arrows, swipe (pan end > 40 px) or ArrowLeft /
//   ArrowRight on the focused photo move it; an aria-live label reads "Photo 2 of 4"
// - Heart toggles a saved set (Sintra starts saved; aria-pressed) and shows a 2.6 s toast
//   such as "Saved Alfama, Lisbon to “Portugal, autumn”" (timer cleared on change/unmount)
// - Category chips filter the list (aria-pressed); the switch toggles per-night vs total
//   for 16 – 21 Oct including the cleaning fee; titles link to #stay-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PhotoDotListingsGrid from '@/TestComponent/PageSections/booking/ListingsGrid01';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <PhotoDotListingsGrid />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiHeart, HiOutlineHeart, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`
const NIGHTS = 5

const stays = [
    {
        id: 'alfama',
        place: 'Alfama, Lisbon',
        blurb: 'Rooftop flat with river views',
        type: 'city',
        rating: 4.94,
        reviews: 212,
        price: 142,
        fee: 45,
        favourite: true,
        photos: [
            ['1560448204-e02f11c3d0e2', 'Bright open-plan living room with large windows'],
            ['1505693416388-ac5ce068fe85', 'Bedroom with a tufted headboard and crisp linen'],
            ['1586023492125-27b2c045efd7', 'Living room corner with a yellow armchair'],
        ],
    },
    {
        id: 'comporta',
        place: 'Comporta',
        blurb: 'Rice-field cabin, 8 min to the dunes',
        type: 'beach',
        rating: 4.88,
        reviews: 97,
        price: 189,
        fee: 60,
        favourite: true,
        photos: [
            ['1568605114967-8130f3a36994', 'Modern timber cabin lit up at dusk'],
            ['1512918728675-ed5a9ecdebfd', 'Minimal white bedroom with soft light'],
            ['1473186578172-c141e6798cf4', 'Two beach chairs facing a calm sea'],
            ['1519046904884-53103b34b206', 'Sandy beach with a leaning palm tree'],
        ],
    },
    {
        id: 'sintra',
        place: 'Sintra',
        blurb: 'Garden villa below the palaces',
        type: 'countryside',
        rating: 4.97,
        reviews: 64,
        price: 226,
        fee: 70,
        favourite: true,
        photos: [
            ['1600596542815-ffad4c1539a9', 'White modernist house beside a pool under blue sky'],
            ['1493809842364-78817add7ffb', 'White room with a blue sofa and plants'],
            ['1524758631624-e2822e304c36', 'Modern living room with chairs and a floor lamp'],
        ],
    },
    {
        id: 'ericeira',
        place: 'Ericeira',
        blurb: 'Surf house with a hot outdoor shower',
        type: 'beach',
        rating: 4.81,
        reviews: 143,
        price: 118,
        fee: 40,
        photos: [
            ['1533105079780-92b9be482077', 'White houses on the coast above the sea'],
            ['1522708323590-d24dbb6b0267', 'Living room with a red armchair'],
            ['1582719478250-c89cae4dc85b', 'Bedroom with a wooden bed and a view'],
            ['1510414842594-a61c69b5ae57', 'Rocky cove with turquoise water'],
        ],
    },
    {
        id: 'cascais',
        place: 'Cascais',
        blurb: 'Modern villa with a heated pool',
        type: 'pools',
        rating: 4.92,
        reviews: 58,
        price: 410,
        fee: 120,
        favourite: true,
        photos: [
            ['1613490493576-7fde63acd811', 'Modern white villa with a pool'],
            ['1571896349842-33c89424de2d', 'Infinity pool lit at night above the sea'],
            ['1590490360182-c33d57733427', 'Classic room with a sofa and a large bed'],
            ['1512917774080-9991f1c4c750', 'White villa with a long pool at dusk'],
        ],
    },
    {
        id: 'monsaraz',
        place: 'Monsaraz, Alentejo',
        blurb: 'Whitewashed farmhouse among vines',
        type: 'countryside',
        rating: 4.9,
        reviews: 121,
        price: 164,
        fee: 55,
        photos: [
            ['1570129477492-45c003edd2be', 'White farmhouse with a porch and lawn'],
            ['1611892440504-42a792e24d32', 'Warm dark-wood bedroom suite'],
            ['1578500494198-246f612d3b3d', 'Beige sofa with a vase of pampas grass'],
            ['1551882547-ff40c63fe5fa', 'Palm-lined pool at sunset'],
        ],
    },
    {
        id: 'principe-real',
        place: 'Príncipe Real, Lisbon',
        blurb: 'Tiled 1890s apartment, two balconies',
        type: 'city',
        rating: 4.86,
        reviews: 305,
        price: 131,
        fee: 45,
        photos: [
            ['1513694203232-719a280e022f', 'Living room with a navy sofa and white dresser'],
            ['1502672260266-1c1ef2d93688', 'Bright living room filled with plants'],
            ['1540518614846-7eded433c457', 'Bedroom with orange stools and framed art'],
        ],
    },
    {
        id: 'lagos',
        place: 'Lagos, Algarve',
        blurb: 'Cliff house with an infinity pool',
        type: 'pools',
        rating: 4.95,
        reviews: 76,
        price: 348,
        fee: 95,
        favourite: true,
        photos: [
            ['1564013799919-ab600027ffc6', 'Villa with a pool framed by palm trees'],
            ['1584132967334-10e028bd69f7', 'Infinity pool deck overlooking the sea'],
            ['1571003123894-1f0594d2b5d9', 'Cabanas beside a tropical pool'],
            ['1515238152791-8216bfdf89a7', 'Tropical beach with a palm tree'],
        ],
    },
]

const filters = [
    { id: 'all', label: 'All homes' },
    { id: 'city', label: 'City' },
    { id: 'beach', label: 'Beach' },
    { id: 'countryside', label: 'Countryside' },
    { id: 'pools', label: 'Pools' },
]

function Laurel({ flip }) {
    return (
        <svg viewBox="0 0 12 20" aria-hidden="true" className={cn('h-3.5 w-2', flip && '-scale-x-100')}>
            <path
                d="M10 19C4 16 2 10 4 2M4 6c-2 0-3-1-3-3 2 0 3 1 3 3Zm0 5c-2 0-3.5-1-3.5-3 2 0 3.5 1 3.5 3Zm1.5 5C3.5 16 2 15 2 13c2 0 3.5 1 3.5 3Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    )
}

function StayCard({ stay, saved, showTotal, onToggleSave }) {
    const reduceMotion = useReducedMotion()
    const [index, setIndex] = useState(0)
    const count = stay.photos.length
    const go = (delta) => setIndex((i) => Math.min(count - 1, Math.max(0, i + delta)))
    const total = stay.price * NIGHTS + stay.fee

    return (
        <motion.article
            layout={!reduceMotion}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="group min-w-0"
        >
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f7f7f7]">
                <motion.div
                    role="group"
                    aria-roledescription="carousel"
                    aria-label={`${stay.place} photos`}
                    tabIndex={0}
                    className="h-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff5a5f]"
                    onPanEnd={(_, info) => {
                        if (info.offset.x < -40) go(1)
                        else if (info.offset.x > 40) go(-1)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowRight') {
                            e.preventDefault()
                            go(1)
                        } else if (e.key === 'ArrowLeft') {
                            e.preventDefault()
                            go(-1)
                        }
                    }}
                >
                    <motion.div
                        className="flex h-full"
                        animate={{ x: `${-index * 100}%` }}
                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 34 }}
                    >
                        {stay.photos.map(([id, alt], i) => (
                            <img
                                key={id}
                                src={photo(id)}
                                alt={alt}
                                loading="lazy"
                                draggable={false}
                                aria-hidden={i !== index}
                                className="h-full w-full shrink-0 select-none object-cover"
                            />
                        ))}
                    </motion.div>
                    <p aria-live="polite" className="sr-only">
                        Photo {index + 1} of {count}
                    </p>
                </motion.div>

                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/35 to-transparent" />

                {stay.favourite && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#222222] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                        <Laurel />
                        Guest favourite
                        <Laurel flip />
                    </span>
                )}

                <button
                    type="button"
                    aria-pressed={saved}
                    aria-label={saved ? `Remove ${stay.place} from wishlist` : `Save ${stay.place} to wishlist`}
                    className="absolute right-2 top-2 grid size-10 place-items-center rounded-full text-white transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-white"
                    onClick={() => onToggleSave(stay)}
                >
                    <motion.span
                        key={saved ? 'on' : 'off'}
                        initial={{ scale: reduceMotion ? 1 : saved ? 0.4 : 1 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
                        className="grid place-items-center"
                    >
                        {saved ? (
                            <HiHeart aria-hidden="true" className="size-7 text-[#ff5a5f] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                        ) : (
                            <HiOutlineHeart aria-hidden="true" className="size-7 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" />
                        )}
                    </motion.span>
                </button>

                {index > 0 && (
                    <button
                        type="button"
                        aria-label={`Previous photo of ${stay.place}`}
                        className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#222222] opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-opacity hover:bg-white focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[#ff5a5f] group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                        onClick={() => go(-1)}
                    >
                        <HiChevronLeft aria-hidden="true" className="size-4" />
                    </button>
                )}
                {index < count - 1 && (
                    <button
                        type="button"
                        aria-label={`Next photo of ${stay.place}`}
                        className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#222222] opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-opacity hover:bg-white focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[#ff5a5f] group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                        onClick={() => go(1)}
                    >
                        <HiChevronRight aria-hidden="true" className="size-4" />
                    </button>
                )}

                <div aria-hidden="true" className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                    {stay.photos.map(([id], i) => (
                        <span
                            key={id}
                            className={cn(
                                'h-1.5 rounded-full transition-all duration-300',
                                i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60',
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-3 px-0.5">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 truncate text-[15px] font-bold text-[#222222]">
                        <a
                            href={`#stay-${stay.id}`}
                            className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]"
                        >
                            {stay.place}
                        </a>
                    </h3>
                    <p className="flex shrink-0 items-center gap-1 text-sm text-[#222222]">
                        <HiStar aria-hidden="true" className="size-3.5" />
                        <span className="font-semibold">{stay.rating.toFixed(2)}</span>
                        <span className="text-[#222222]/55">({stay.reviews})</span>
                    </p>
                </div>
                <p className="mt-0.5 truncate text-sm text-[#222222]/65">{stay.blurb}</p>
                <p className="text-sm text-[#222222]/65">16 – 21 Oct</p>
                <p className="mt-1.5 text-[15px] text-[#222222]">
                    {showTotal ? (
                        <>
                            <span className="font-bold underline decoration-[#222222]/30 underline-offset-4">
                                €{total.toLocaleString('en-US')}
                            </span>{' '}
                            total before taxes
                        </>
                    ) : (
                        <>
                            <span className="font-bold">€{stay.price}</span> night
                        </>
                    )}
                </p>
            </div>
        </motion.article>
    )
}

export function PhotoDotListingsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [filter, setFilter] = useState('all')
    const [saved, setSaved] = useState(() => new Set(['sintra']))
    const [showTotal, setShowTotal] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        if (!toast) return undefined
        const id = setTimeout(() => setToast(null), 2600)
        return () => clearTimeout(id)
    }, [toast])

    const toggleSave = (stay) => {
        const adding = !saved.has(stay.id)
        setSaved((current) => {
            const next = new Set(current)
            if (adding) next.add(stay.id)
            else next.delete(stay.id)
            return next
        })
        setToast({
            key: Date.now(),
            text: adding ? `Saved ${stay.place} to “Portugal, autumn”` : `Removed ${stay.place} from wishlist`,
        })
    }

    const visible = stays.filter((s) => filter === 'all' || s.type === filter)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-16 text-base font-normal text-[#222222] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                        <p className="text-sm font-semibold text-[#ff5a5f]">Nestaway · 16 – 21 October</p>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-[#222222] sm:text-4xl">
                            Guest favourites near Lisbon
                        </h2>
                        <p className="mt-3 text-base text-[#222222]/65">
                            Homes in the top 5% for comfort and cleanliness, with hosts who reply within the
                            hour.
                        </p>
                    </div>
                    <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 self-start rounded-full border border-[#222222]/15 py-1.5 pl-4 pr-1.5 text-sm font-semibold text-[#222222] md:self-auto">
                        Show 5-night total
                        <input
                            type="checkbox"
                            role="switch"
                            checked={showTotal}
                            className="peer sr-only"
                            onChange={(e) => setShowTotal(e.target.checked)}
                        />
                        <span
                            aria-hidden="true"
                            className="relative h-7 w-12 rounded-full bg-[#222222]/20 transition-colors peer-checked:bg-[#ff5a5f] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#ff5a5f] after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
                        />
                    </label>
                </div>

                <div className="-mx-4 mt-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                    <div role="group" aria-label="Filter homes" className="flex w-max gap-2">
                        {filters.map((f) => {
                            const count = f.id === 'all' ? stays.length : stays.filter((s) => s.type === f.id).length
                            return (
                                <button
                                    key={f.id}
                                    type="button"
                                    aria-pressed={filter === f.id}
                                    className={cn(
                                        'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]',
                                        filter === f.id
                                            ? 'border-[#222222] bg-[#222222] text-white'
                                            : 'border-[#222222]/15 text-[#222222] hover:border-[#222222]',
                                    )}
                                    onClick={() => setFilter(f.id)}
                                >
                                    {f.label}
                                    <span
                                        className={cn(
                                            'rounded-full px-1.5 text-xs',
                                            filter === f.id ? 'bg-[#ff5a5f] text-white' : 'bg-[#f7f7f7] text-[#222222]/60',
                                        )}
                                    >
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <motion.div layout={!reduceMotion} className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {visible.map((stay) => (
                            <StayCard
                                key={stay.id}
                                stay={stay}
                                saved={saved.has(stay.id)}
                                showTotal={showTotal}
                                onToggleSave={toggleSave}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                <div className="mt-12 flex justify-center">
                    <a
                        href="#nestaway-portugal"
                        className="inline-flex min-h-12 items-center rounded-full border border-[#222222] px-6 text-sm font-bold text-[#222222] transition-colors hover:bg-[#222222] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a5f]"
                    >
                        Show all 1,120 homes in Portugal
                    </a>
                </div>
            </div>

            <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
                <AnimatePresence>
                    {toast && (
                        <motion.p
                            key={toast.key}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                            transition={{ duration: 0.22 }}
                            className="flex max-w-full items-center gap-2 rounded-full bg-[#222222] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
                        >
                            <HiHeart aria-hidden="true" className="size-4 shrink-0 text-[#ff5a5f]" />
                            <span className="truncate">{toast.text}</span>
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}

export default PhotoDotListingsGrid

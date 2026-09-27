// SortRowsListingsGrid

// ListingsGrid02 · Booking & Reservations › Listings / Availability Grid

// Description:
// A results list of six Lisbon hotels for the fictional travel brand Wayfare, headed
// "6 stays in Lisbon that fit your trip". Each row shows a photo, star class, neighbourhood
// and distance from the centre, a guest score, amenity icons, a cancellation note and the
// nightly and total price with "See availability". A sort select (Recommended, Price, Guest
// rating, Distance) re-orders the rows and a "Free cancellation" chip filters them.

// Design:
// - White section, ink #0b1b2b text, ocean blue #0369a1 for scores, links, the sort focus
//   ring and CTA; emerald #047857 for free cancellation, amber #b45309 for non-refundable
// - Rows are rounded-[20px] cards with a slate #e2e8f0 border that turns blue/40 with a
//   blue-tinted shadow on hover; the photo sits inset with rounded-[14px] corners
// - Row grid: stacked at base (16:10 photo, details, price bar), md: [15rem_1fr] with the
//   price under the details, lg: [16rem_1fr_13rem] with a divided price column
// - Amenities are 36px slate tiles with an icon and an sr-only/tooltip label; scores are
//   solid blue squares with tabular numerals; "Autumn deal" rows show a struck-out price
// - framer-motion layout animation slides rows into their new order and fades rows in or
//   out when filtered; reduced motion turns the movement off

// What it does:
// - sort state (native select) orders by recommended rank, price ascending or descending,
//   guest rating or distance; the heading count and an aria-live line announce the result
// - "Free cancellation" chip (aria-pressed) hides the two non-refundable rows and the
//   count in the heading updates
// - Totals are 5 nights (16 – 21 Oct) × nightly price + 10% taxes; "See availability"
//   links to #wayfare-stay-<id> and "Show on map" to #wayfare-map

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SortRowsListingsGrid from '@/TestComponent/PageSections/booking/ListingsGrid02';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <SortRowsListingsGrid />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiChevronDown, HiStar } from 'react-icons/hi2';
import {
    LuCircleCheck,
    LuCircleParking,
    LuCoffee,
    LuDumbbell,
    LuFlower2,
    LuInfo,
    LuMap,
    LuMapPin,
    LuPawPrint,
    LuSnowflake,
    LuUtensils,
    LuWaves,
    LuWifi,
    LuWine,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const NIGHTS = 5
const TAX = 0.1

const amenityMeta = {
    wifi: { icon: LuWifi, label: 'Free Wi-Fi' },
    breakfast: { icon: LuCoffee, label: 'Breakfast included' },
    pool: { icon: LuWaves, label: 'Outdoor pool' },
    parking: { icon: LuCircleParking, label: 'Parking' },
    aircon: { icon: LuSnowflake, label: 'Air conditioning' },
    gym: { icon: LuDumbbell, label: 'Fitness room' },
    spa: { icon: LuFlower2, label: 'Spa' },
    pets: { icon: LuPawPrint, label: 'Pets allowed' },
    bar: { icon: LuWine, label: 'Bar' },
    kitchen: { icon: LuUtensils, label: 'Shared kitchen' },
}

const stays = [
    {
        id: 'casa-do-rio',
        name: 'Casa do Rio Boutique Hotel',
        stars: 4,
        area: 'Alfama',
        km: 1.2,
        score: 9.1,
        reviews: 1832,
        price: 186,
        was: 219,
        room: 'Deluxe double · 1 king bed',
        amenities: ['wifi', 'breakfast', 'aircon', 'bar'],
        cancel: 'Free cancellation until 14 Oct',
        refundable: true,
        left: 2,
        img: '1590490360182-c33d57733427',
        alt: 'Classic hotel room with a sofa at the foot of a large bed',
    },
    {
        id: 'miradouro',
        name: 'Miradouro Suites',
        stars: 4,
        area: 'Graça',
        km: 2,
        score: 9.4,
        reviews: 604,
        price: 238,
        room: 'Suite with viewpoint terrace',
        amenities: ['wifi', 'aircon', 'breakfast', 'pets'],
        cancel: 'Free cancellation until 13 Oct',
        refundable: true,
        img: '1582719478250-c89cae4dc85b',
        alt: 'Bedroom with a wooden bed facing a large window with a view',
    },
    {
        id: 'azulejo-chiado',
        name: 'Hotel Azulejo Chiado',
        stars: 3,
        area: 'Chiado',
        km: 0.4,
        score: 8.7,
        reviews: 2941,
        price: 164,
        room: 'Classic double · city side',
        amenities: ['wifi', 'breakfast', 'gym', 'aircon'],
        cancel: 'Non-refundable · pay now, save 12%',
        refundable: false,
        img: '1505693416388-ac5ce068fe85',
        alt: 'Hotel bedroom with a tufted headboard and bedside lamps',
    },
    {
        id: 'tejo-riverside',
        name: 'Tejo Riverside Resort & Spa',
        stars: 5,
        area: 'Belém',
        km: 6.1,
        score: 8.9,
        reviews: 1120,
        price: 212,
        was: 249,
        room: 'Garden king · pool access',
        amenities: ['pool', 'spa', 'parking', 'gym', 'wifi'],
        cancel: 'Free cancellation until 11 Oct',
        refundable: true,
        left: 4,
        img: '1542314831-068cd1dbfeeb',
        alt: 'Resort pool lit up at dusk in front of the hotel',
    },
    {
        id: 'palacio-verde',
        name: 'Palácio Verde Townhouse',
        stars: 5,
        area: 'Príncipe Real',
        km: 1.1,
        score: 9.6,
        reviews: 318,
        price: 295,
        room: 'Garden suite · freestanding tub',
        amenities: ['wifi', 'breakfast', 'aircon', 'bar', 'spa'],
        cancel: 'Free cancellation until 9 Oct',
        refundable: true,
        img: '1611892440504-42a792e24d32',
        alt: 'Warm dark-wood bedroom suite with soft lighting',
    },
    {
        id: 'estacao',
        name: 'Estação Rooms',
        stars: 2,
        area: 'Cais do Sodré',
        km: 0.9,
        score: 8.2,
        reviews: 4210,
        price: 74,
        room: 'Compact double · shared lounge',
        amenities: ['wifi', 'kitchen', 'bar'],
        cancel: 'Non-refundable',
        refundable: false,
        img: '1512918728675-ed5a9ecdebfd',
        alt: 'Minimal white bedroom with a simple double bed',
    },
]

const sorts = [
    { id: 'recommended', label: 'Recommended', fn: () => 0 },
    { id: 'price-asc', label: 'Price (lowest first)', fn: (a, b) => a.price - b.price },
    { id: 'price-desc', label: 'Price (highest first)', fn: (a, b) => b.price - a.price },
    { id: 'rating', label: 'Guest rating', fn: (a, b) => b.score - a.score },
    { id: 'distance', label: 'Distance from centre', fn: (a, b) => a.km - b.km },
]

const scoreWord = (s) => (s >= 9.5 ? 'Exceptional' : s >= 9 ? 'Superb' : s >= 8.5 ? 'Excellent' : 'Very good')
const euro = (n) => `€${n.toLocaleString('en-US')}`

export function SortRowsListingsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [sortId, setSortId] = useState('recommended')
    const [freeOnly, setFreeOnly] = useState(false)

    const sort = sorts.find((s) => s.id === sortId)
    const rows = stays.filter((s) => !freeOnly || s.refundable).sort(sort.fn)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-16 text-base font-normal text-[#0b1b2b] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <p className="flex flex-wrap items-center gap-x-2 text-sm text-[#0b1b2b]/60">
                    <span className="font-semibold text-[#0369a1]">Wayfare</span>
                    <span aria-hidden="true">/</span> Portugal <span aria-hidden="true">/</span> Lisbon
                    <span aria-hidden="true">·</span> 16 – 21 Oct · 2 adults
                </p>
                <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#0b1b2b] sm:text-4xl">
                        {rows.length} stays in Lisbon that fit your trip
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            aria-pressed={freeOnly}
                            className={cn(
                                'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]',
                                freeOnly
                                    ? 'border-[#047857] bg-[#047857]/10 text-[#047857]'
                                    : 'border-[#e2e8f0] text-[#0b1b2b] hover:border-[#0b1b2b]/40',
                            )}
                            onClick={() => setFreeOnly((v) => !v)}
                        >
                            <LuCircleCheck aria-hidden="true" className="size-4" />
                            Free cancellation
                        </button>
                        <div className="relative flex min-h-11 items-center rounded-full border border-[#e2e8f0] pl-4 focus-within:border-[#0369a1] focus-within:ring-2 focus-within:ring-[#0369a1]/30">
                            <label htmlFor={`${uid}-sort`} className="shrink-0 text-sm text-[#0b1b2b]/60">
                                Sort by
                            </label>
                            <select
                                id={`${uid}-sort`}
                                value={sortId}
                                className="min-h-11 cursor-pointer appearance-none bg-transparent pl-2 pr-9 text-sm font-semibold text-[#0b1b2b] outline-none"
                                onChange={(e) => setSortId(e.target.value)}
                            >
                                {sorts.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                            <HiChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 size-4 text-[#0369a1]" />
                        </div>
                        <a
                            href="#wayfare-map"
                            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0b1b2b] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                        >
                            <LuMap aria-hidden="true" className="size-4" />
                            Show on map
                        </a>
                    </div>
                </div>
                <p aria-live="polite" className="sr-only">
                    {rows.length} stays sorted by {sort.label}
                </p>

                <motion.ul layout={!reduceMotion} className="mt-8 space-y-4">
                    <AnimatePresence initial={false} mode="popLayout">
                        {rows.map((stay) => {
                            const total = Math.round(stay.price * NIGHTS * (1 + TAX))
                            return (
                                <motion.li
                                    key={stay.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 380, damping: 38, opacity: { duration: 0.2 } }}
                                >
                                    <article className="grid gap-4 rounded-[20px] border border-[#e2e8f0] bg-white p-3 transition-[border-color,box-shadow] duration-300 hover:border-[#0369a1]/40 hover:shadow-[0_20px_40px_-24px_rgba(3,105,161,0.45)] md:grid-cols-[15rem_1fr] lg:grid-cols-[16rem_1fr_13rem]">
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] md:row-span-2 md:aspect-auto md:h-full md:min-h-52 lg:row-span-1">
                                            <img
                                                src={`https://images.unsplash.com/photo-${stay.img}?auto=format&fit=crop&w=700&q=80`}
                                                alt={stay.alt}
                                                loading="lazy"
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                            {stay.was && (
                                                <span className="absolute left-2 top-2 rounded-full bg-[#0369a1] px-2.5 py-1 text-[11px] font-bold text-white">
                                                    Autumn deal −{Math.round((1 - stay.price / stay.was) * 100)}%
                                                </span>
                                            )}
                                        </div>

                                        <div className="min-w-0 px-1 md:py-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="flex items-center gap-0.5 text-[#f59e0b]">
                                                        <span className="sr-only">{stay.stars}-star hotel</span>
                                                        {Array.from({ length: stay.stars }, (_, i) => (
                                                            <HiStar key={i} aria-hidden="true" className="size-3.5" />
                                                        ))}
                                                    </p>
                                                    <h3 className="mt-1 text-lg font-semibold leading-snug text-[#0b1b2b] sm:text-xl">
                                                        {stay.name}
                                                    </h3>
                                                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#0b1b2b]/65">
                                                        <LuMapPin aria-hidden="true" className="size-4 shrink-0 text-[#0369a1]" />
                                                        {stay.area} · {stay.km.toFixed(1)} km from centre
                                                    </p>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    <div className="hidden text-right sm:block">
                                                        <p className="text-sm font-semibold text-[#0b1b2b]">{scoreWord(stay.score)}</p>
                                                        <p className="text-xs text-[#0b1b2b]/55">{stay.reviews.toLocaleString('en-US')} reviews</p>
                                                    </div>
                                                    <span className="grid size-11 place-items-center rounded-xl rounded-bl-sm bg-[#0369a1] text-base font-bold tabular-nums text-white">
                                                        <span className="sr-only">Guest score </span>
                                                        {stay.score.toFixed(1)}
                                                        <span className="sr-only"> out of 10</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-sm font-semibold text-[#0b1b2b]">{stay.room}</p>

                                            <ul className="mt-3 flex flex-wrap gap-1.5">
                                                {stay.amenities.map((a) => {
                                                    const { icon: Icon, label } = amenityMeta[a]
                                                    return (
                                                        <li
                                                            key={a}
                                                            title={label}
                                                            className="grid size-9 place-items-center rounded-lg bg-[#f1f5f9] text-[#0b1b2b]/75"
                                                        >
                                                            <Icon aria-hidden="true" className="size-4" />
                                                            <span className="sr-only">{label}</span>
                                                        </li>
                                                    )
                                                })}
                                            </ul>

                                            <p
                                                className={cn(
                                                    'mt-3 flex items-center gap-1.5 text-sm font-semibold',
                                                    stay.refundable ? 'text-[#047857]' : 'text-[#b45309]',
                                                )}
                                            >
                                                {stay.refundable ? (
                                                    <LuCircleCheck aria-hidden="true" className="size-4 shrink-0" />
                                                ) : (
                                                    <LuInfo aria-hidden="true" className="size-4 shrink-0" />
                                                )}
                                                {stay.cancel}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-[#e2e8f0] px-1 pt-3 md:col-start-2 lg:col-start-3 lg:flex-col lg:flex-nowrap lg:items-end lg:justify-end lg:border-l lg:border-t-0 lg:pl-5 lg:pt-1">
                                            <div className="lg:text-right">
                                                {stay.left && (
                                                    <p className="mb-1 text-xs font-bold text-[#b91c1c]">
                                                        Only {stay.left} rooms left at this price
                                                    </p>
                                                )}
                                                <p className="text-sm text-[#0b1b2b]/60">
                                                    {stay.was && <span className="mr-1.5 line-through">{euro(stay.was)}</span>}
                                                    <span className="text-2xl font-bold text-[#0b1b2b]">{euro(stay.price)}</span> / night
                                                </p>
                                                <p className="text-xs text-[#0b1b2b]/55">
                                                    {euro(total)} for {NIGHTS} nights incl. taxes
                                                </p>
                                            </div>
                                            <a
                                                href={`#wayfare-stay-${stay.id}`}
                                                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0369a1] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#075985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1] lg:w-full"
                                            >
                                                See availability
                                            </a>
                                        </div>
                                    </article>
                                </motion.li>
                            )
                        })}
                    </AnimatePresence>
                </motion.ul>

            </div>
        </section>
    )
}

export default SortRowsListingsGrid

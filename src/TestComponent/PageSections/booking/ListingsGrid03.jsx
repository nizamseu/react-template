// RoomCalendarListingsGrid

// ListingsGrid03 · Booking & Reservations › Listings / Availability Grid

// Description:
// A classic grand-hotel availability board for the fictional Grand Aurelia Hotel. Under
// "Rooms & availability" four room types (Classic Queen to the Aurelia Suite) each show a
// photo, size, bed and view, and a 14-day strip of nightly prices marked available, few
// left or sold out. Picking a night and a length of stay fills a navy summary bar with the
// total and "Reserve". Use it on a hotel's rooms page or as the step after a date search.

// Design:
// - Ivory #fbf8f1 section, navy #1b2a4a type and selected cells, antique gold #b8914a
//   hairlines, "few left" markers and numerals; sold-out cells use a diagonal hatch
// - Serif room names and heading (text-4xl → lg:text-6xl), small-caps style labels with
//   wide tracking; square corners throughout with 1px gold/navy rules
// - Rooms: a small 4:3 photo beside the name and facts at base, lg:grid-cols-[15rem_1fr]
//   with facts and "from" price above the strip; the 14-cell strip is a fixed-width row
//   that scrolls inside its own container below xl and stretches to fit at xl
// - Summary bar: navy with gold numerals, sticky at the bottom of the section; wraps to
//   two rows on small screens
// - framer-motion: strips cross-slide when paging the 14-day window, the summary bar
//   slides in; reduced motion keeps only fades

// What it does:
// - Fixed example dates: three 14-day windows from Mon 12 Oct 2026, paged with the arrows;
//   prices and availability come from a deterministic per-room model (weekends +18%)
// - Clicking an available or few-left night selects that room and check-in (aria-
//   pressed; Deluxe King from Tue 13 Oct is preselected); the nights stepper (1 – 5)
//   highlights the following cells and totals their prices
// - If a later night is sold out the bar explains which date blocks the stay and disables
//   "Reserve"; otherwise Reserve shows a held reference like "GA-1013-DK2"

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RoomCalendarListingsGrid from '@/TestComponent/PageSections/booking/ListingsGrid03';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <RoomCalendarListingsGrid />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiMinus, HiPlus } from 'react-icons/hi2';
import { LuBedDouble, LuEye, LuRuler, LuUsers } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const BASE = [2026, 9, 12]
const WINDOW = 14
const WINDOWS = 3
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const rooms = [
    {
        id: 'classic',
        code: 'CQ',
        name: 'Classic Queen',
        size: '24 m²',
        bed: 'Queen bed',
        view: 'Courtyard view',
        sleeps: 2,
        base: 260,
        pressure: 1,
        img: '1505693416388-ac5ce068fe85',
        alt: 'Classic bedroom with a tufted headboard and white linen',
    },
    {
        id: 'deluxe',
        code: 'DK',
        name: 'Deluxe King',
        size: '32 m²',
        bed: 'King bed',
        view: 'Boulevard view',
        sleeps: 2,
        base: 340,
        pressure: 0,
        img: '1590490360182-c33d57733427',
        alt: 'Hotel room with a sofa at the foot of a large bed',
    },
    {
        id: 'junior',
        code: 'JS',
        name: 'Junior Suite',
        size: '48 m²',
        bed: 'King + sofa bed',
        view: 'Balcony, river side',
        sleeps: 3,
        base: 480,
        pressure: 1,
        img: '1611892440504-42a792e24d32',
        alt: 'Suite with warm dark-wood panelling and soft lamps',
    },
    {
        id: 'aurelia',
        code: 'AS',
        name: 'Aurelia Suite',
        size: '86 m²',
        bed: 'King + salon',
        view: 'Private terrace',
        sleeps: 4,
        base: 920,
        pressure: 1,
        img: '1582719478250-c89cae4dc85b',
        alt: 'Suite bedroom with a wooden bed facing a window with a view',
    },
]

function dayInfo(offset) {
    const date = new Date(BASE[0], BASE[1], BASE[2] + offset)
    return { dow: date.getDay(), day: date.getDate(), month: date.getMonth() }
}

function nightFor(room, roomIndex, offset) {
    const { dow } = dayInfo(offset)
    const weekend = dow === 5 || dow === 6
    const seed = ((offset + 3) * (roomIndex + 5) * 29 + offset * offset * 7 + roomIndex * 11) % 17
    const price = Math.round((room.base * (weekend ? 1.18 : 1) * (1 + (seed % 5) * 0.03)) / 5) * 5
    const soldScore = seed + room.pressure * 2 + (weekend ? 3 : 0)
    if (soldScore >= 17) return { state: 'sold', price }
    if (soldScore >= 13) return { state: 'few', left: 1 + (seed % 3), price }
    return { state: 'open', price }
}

const fmt = (offset) => {
    const d = dayInfo(offset)
    return `${DAYS[d.dow]} ${d.day} ${MONTHS[d.month]}`
}
const euro = (n) => `€${n.toLocaleString('en-US')}`

export function RoomCalendarListingsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [win, setWin] = useState(0)
    const [dir, setDir] = useState(1)
    const [pick, setPick] = useState({ roomId: 'deluxe', offset: 1 })
    const [nights, setNights] = useState(2)
    const [held, setHeld] = useState(null)

    const start = win * WINDOW
    const pickRoomIndex = pick ? rooms.findIndex((r) => r.id === pick.roomId) : -1
    const pickRoom = rooms[pickRoomIndex]
    const stay = pick
        ? Array.from({ length: nights }, (_, i) => ({ offset: pick.offset + i, ...nightFor(pickRoom, pickRoomIndex, pick.offset + i) }))
        : []
    const blocked = stay.find((n) => n.state === 'sold')
    const total = stay.reduce((sum, n) => sum + n.price, 0)

    const page = (delta) => {
        setDir(delta)
        setWin((w) => Math.min(WINDOWS - 1, Math.max(0, w + delta)))
    }

    const choose = (roomId, offset) => {
        setPick({ roomId, offset })
        setHeld(null)
    }

    const first = dayInfo(start)
    const last = dayInfo(start + WINDOW - 1)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#fbf8f1] px-4 py-16 text-base font-normal text-[#1b2a4a] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 border-b border-[#b8914a]/40 pb-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#b8914a]">
                            Grand Aurelia Hotel · Lisbon
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight text-[#1b2a4a] sm:text-5xl lg:text-6xl">
                            Rooms &amp; availability
                        </h2>
                    </div>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.18em] text-[#1b2a4a]/70">
                            <li className="flex items-center gap-2">
                                <span aria-hidden="true" className="size-3.5 border border-[#1b2a4a]/25 bg-white" /> Available
                            </li>
                            <li className="flex items-center gap-2">
                                <span aria-hidden="true" className="size-3.5 border-t-2 border-[#b8914a] bg-white" /> Few left
                            </li>
                            <li className="flex items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className="size-3.5 bg-[repeating-linear-gradient(135deg,rgba(27,42,74,0.25)_0_2px,transparent_2px_5px)]"
                                />{' '}
                                Sold out
                            </li>
                        </ul>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="Previous 14 days"
                                disabled={win === 0}
                                className="grid size-11 place-items-center border border-[#1b2a4a]/25 text-[#1b2a4a] transition-colors hover:border-[#1b2a4a] hover:bg-[#1b2a4a] hover:text-[#fbf8f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8914a] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1b2a4a]"
                                onClick={() => page(-1)}
                            >
                                <HiChevronLeft aria-hidden="true" className="size-5" />
                            </button>
                            <p aria-live="polite" className="min-w-36 text-center font-serif text-lg text-[#1b2a4a]">
                                {first.day} {MONTHS[first.month]} – {last.day} {MONTHS[last.month]}
                            </p>
                            <button
                                type="button"
                                aria-label="Next 14 days"
                                disabled={win === WINDOWS - 1}
                                className="grid size-11 place-items-center border border-[#1b2a4a]/25 text-[#1b2a4a] transition-colors hover:border-[#1b2a4a] hover:bg-[#1b2a4a] hover:text-[#fbf8f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8914a] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1b2a4a]"
                                onClick={() => page(1)}
                            >
                                <HiChevronRight aria-hidden="true" className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <ul className="divide-y divide-[#b8914a]/30">
                    {rooms.map((room, roomIndex) => (
                        <li
                            key={room.id}
                            className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-5 py-8 sm:grid-cols-[10rem_1fr] lg:grid-cols-[15rem_1fr] lg:gap-x-8"
                        >
                            <div className="relative self-start lg:row-span-2">
                                <img
                                    src={`https://images.unsplash.com/photo-${room.img}?auto=format&fit=crop&w=600&q=80`}
                                    alt={room.alt}
                                    loading="lazy"
                                    className="aspect-[4/3] w-full object-cover"
                                />
                                <span aria-hidden="true" className="pointer-events-none absolute inset-1.5 border border-[#fbf8f1]/60" />
                            </div>
                            <div className="flex min-w-0 flex-col gap-3 self-center lg:flex-row lg:items-end lg:justify-between lg:self-end">
                                <div className="min-w-0">
                                    <h3 className="font-serif text-2xl font-normal text-[#1b2a4a] sm:text-[1.75rem]">{room.name}</h3>
                                    <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#1b2a4a]/70">
                                        <li className="flex items-center gap-2">
                                            <LuRuler aria-hidden="true" className="size-4 text-[#b8914a]" /> {room.size}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <LuBedDouble aria-hidden="true" className="size-4 text-[#b8914a]" /> {room.bed}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <LuEye aria-hidden="true" className="size-4 text-[#b8914a]" /> {room.view}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <LuUsers aria-hidden="true" className="size-4 text-[#b8914a]" /> Sleeps {room.sleeps}
                                        </li>
                                    </ul>
                                </div>
                                <p className="shrink-0 text-sm text-[#1b2a4a]/70">
                                    from <span className="font-serif text-2xl text-[#1b2a4a]">{euro(room.base)}</span> / night
                                </p>
                            </div>

                            <div className="col-span-2 min-w-0 lg:col-span-1 lg:col-start-2">
                                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1b2a4a]/55 xl:hidden">
                                    Nightly rates · swipe for more
                                </p>
                                <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 xl:overflow-visible">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.div
                                            key={win}
                                            role="group"
                                            aria-label={`${room.name} nightly availability`}
                                            initial={{ opacity: 0, x: reduceMotion ? 0 : dir * 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: reduceMotion ? 0 : dir * -30 }}
                                            transition={{ duration: 0.25 }}
                                            className="grid w-max grid-cols-[repeat(14,3.5rem)] gap-1 xl:w-full xl:grid-cols-14"
                                        >
                                            {Array.from({ length: WINDOW }, (_, i) => {
                                                const offset = start + i
                                                const d = dayInfo(offset)
                                                const night = nightFor(room, roomIndex, offset)
                                                const isPick = pick && pick.roomId === room.id && pick.offset === offset
                                                const inStay =
                                                    pick && pick.roomId === room.id && offset > pick.offset && offset < pick.offset + nights
                                                const sold = night.state === 'sold'
                                                return (
                                                    <button
                                                        key={offset}
                                                        type="button"
                                                        disabled={sold}
                                                        aria-pressed={Boolean(isPick)}
                                                        aria-label={`${room.name}, ${fmt(offset)}: ${sold ? 'sold out' : `${euro(night.price)}${night.state === 'few' ? `, ${night.left} left` : ''}`}`}
                                                        className={cn(
                                                            'relative flex min-h-[76px] flex-col items-center justify-between border px-0.5 py-2 text-center transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#b8914a]',
                                                            sold
                                                                ? 'cursor-not-allowed border-transparent bg-[repeating-linear-gradient(135deg,rgba(27,42,74,0.12)_0_2px,transparent_2px_6px)] text-[#1b2a4a]/35'
                                                                : isPick
                                                                  ? 'border-[#1b2a4a] bg-[#1b2a4a] text-[#fbf8f1]'
                                                                  : inStay
                                                                    ? 'border-[#1b2a4a]/60 bg-[#1b2a4a]/10 text-[#1b2a4a]'
                                                                    : 'border-[#1b2a4a]/15 bg-white text-[#1b2a4a] hover:border-[#1b2a4a]',
                                                            night.state === 'few' && !isPick && 'border-t-2 border-t-[#b8914a]',
                                                        )}
                                                        onClick={() => choose(room.id, offset)}
                                                    >
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                                                            {DAYS[d.dow].slice(0, 2)}
                                                        </span>
                                                        <span className="font-serif text-lg leading-none">{d.day}</span>
                                                        <span
                                                            className={cn(
                                                                'text-[10px] font-semibold tabular-nums',
                                                                sold && 'uppercase tracking-wider',
                                                                night.state === 'few' && !isPick && 'text-[#b8914a]',
                                                            )}
                                                        >
                                                            {sold ? 'Sold' : night.state === 'few' ? `${night.left} left` : night.price}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div aria-live="polite" className="sticky bottom-4 z-20 mt-4">
                    <AnimatePresence initial={false}>
                        {pick && (
                            <motion.div
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col gap-4 bg-[#1b2a4a] p-4 text-[#fbf8f1] shadow-[0_24px_50px_-20px_rgba(27,42,74,0.7)] sm:p-5 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b8914a]">
                                        {pickRoom.name}
                                    </p>
                                    <p className="mt-1 font-serif text-xl text-[#fbf8f1]">
                                        {fmt(pick.offset)} → {fmt(pick.offset + nights)}
                                    </p>
                                    {blocked ? (
                                        <p className="mt-1 text-sm text-[#f5c9a8]">
                                            Sold out on {fmt(blocked.offset)} — shorten the stay or pick another night.
                                        </p>
                                    ) : held ? (
                                        <p className="mt-1 text-sm text-[#fbf8f1]/80">
                                            Held for 20 minutes · reference{' '}
                                            <span className="font-mono font-semibold text-[#b8914a]">{held}</span>
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-sm text-[#fbf8f1]/70">
                                            {stay.map((n) => euro(n.price)).join(' + ')} · breakfast in the Salão included
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                                    <div className="flex items-center border border-[#fbf8f1]/25">
                                        <button
                                            type="button"
                                            aria-label="One night fewer"
                                            disabled={nights <= 1}
                                            className="grid size-11 place-items-center text-[#fbf8f1] hover:bg-[#fbf8f1]/10 focus-visible:outline-2 focus-visible:outline-[#b8914a] disabled:cursor-not-allowed disabled:opacity-30"
                                            onClick={() => {
                                                setNights((n) => Math.max(1, n - 1))
                                                setHeld(null)
                                            }}
                                        >
                                            <HiMinus aria-hidden="true" className="size-4" />
                                        </button>
                                        <span className="min-w-20 text-center text-sm font-semibold">
                                            {nights} night{nights > 1 ? 's' : ''}
                                        </span>
                                        <button
                                            type="button"
                                            aria-label="One night more"
                                            disabled={nights >= 5}
                                            className="grid size-11 place-items-center text-[#fbf8f1] hover:bg-[#fbf8f1]/10 focus-visible:outline-2 focus-visible:outline-[#b8914a] disabled:cursor-not-allowed disabled:opacity-30"
                                            onClick={() => {
                                                setNights((n) => Math.min(5, n + 1))
                                                setHeld(null)
                                            }}
                                        >
                                            <HiPlus aria-hidden="true" className="size-4" />
                                        </button>
                                    </div>
                                    <p className="font-serif text-3xl tabular-nums text-[#b8914a]">{blocked ? '—' : euro(total)}</p>
                                    <button
                                        type="button"
                                        disabled={Boolean(blocked) || Boolean(held)}
                                        className="min-h-11 flex-1 bg-[#b8914a] px-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#1b2a4a] transition-colors hover:bg-[#cfa962] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8914a] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                                        onClick={() => {
                                            const d = dayInfo(pick.offset)
                                            setHeld(`GA-${String(d.month + 1).padStart(2, '0')}${String(d.day).padStart(2, '0')}-${pickRoom.code}${nights}`)
                                        }}
                                    >
                                        {held ? 'Held' : 'Reserve'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default RoomCalendarListingsGrid

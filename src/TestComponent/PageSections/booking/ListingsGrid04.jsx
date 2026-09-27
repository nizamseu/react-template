// HourlySlotsListingsGrid

// ListingsGrid04 · Booking & Reservations › Listings / Availability Grid

// Description:
// A meeting-room availability grid for the fictional coworking brand Deskhive in
// Shoreditch. Under "Book a room by the hour." six rooms show a photo, level, capacity,
// hourly price, kit icons and a row of today's hour chips from 08:00 to 18:00; picking
// free hours writes a summary like "Fern Room · 10:00 – 12:00 · 2 h · £56 + VAT" with
// "Book". Use it on a coworking, studio or desk-booking page where time is the main choice.

// Design:
// - Mint #ecfdf5 section, emerald #047857 accents (selected chips, prices, CTA), ink
//   #052e22 text; white rounded-[24px] cards with an emerald/15 border and inset photos
// - Mono time chips (min-h 40px, rounded-lg): free = white with emerald/25 border, taken =
//   mint with struck-through faded text, selected = solid emerald, yours = dashed emerald
// - Grid 1 → md:2 → xl:3 columns; chips 5 per row on every size; capacity filter pills
//   wrap under the heading on mobile and sit right of it from lg
// - Hexagon wordmark SVG, a pulsing "Live" dot next to the date and a soft emerald glow
// - framer-motion: cards fade/scale in and re-flow on filter (layout), the summary line
//   cross-fades; reduced motion removes the scale and layout movement

// What it does:
// - The date label renders a fixed "Tue 13 Oct" on the server and switches to the real
//   today in useEffect; taken hours are fixed example data per room
// - Clicking free chips builds one contiguous range in one room (Fern Room 10:00 – 12:00
//   is preselected; clicking an end trims it, a far chip extends it if nothing in between
//   is taken, otherwise restarts it); a chip in another room moves the selection there
// - "Book" turns the hours into dashed "yours" chips and shows a confirmation with a
//   reference like "DH-FERN-1013" (aria-live); capacity pills filter rooms by headcount

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HourlySlotsListingsGrid from '@/TestComponent/PageSections/booking/ListingsGrid04';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <HourlySlotsListingsGrid />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi2';
import { LuCoffee, LuMonitor, LuPencil, LuPhone, LuUsers, LuVideo } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const kitMeta = {
    screen: { icon: LuMonitor, label: '65″ screen' },
    video: { icon: LuVideo, label: 'Video conferencing' },
    board: { icon: LuPencil, label: 'Whiteboard wall' },
    phone: { icon: LuPhone, label: 'Conference phone' },
    coffee: { icon: LuCoffee, label: 'Coffee & water' },
}

const rooms = [
    {
        id: 'fern',
        name: 'Fern Room',
        level: 'Level 2',
        seats: 6,
        rate: 28,
        kit: ['screen', 'video', 'board'],
        taken: [9, 13, 14],
        img: '1517502884422-41eaead166d4',
        alt: 'Meeting room with a long table and a city view',
    },
    {
        id: 'hive',
        name: 'The Hive',
        level: 'Level 4',
        seats: 12,
        rate: 64,
        kit: ['screen', 'video', 'phone', 'coffee'],
        taken: [8, 9, 10, 15, 16],
        img: '1521737604893-d14cc237f11d',
        alt: 'Team meeting around a table in a bright office',
    },
    {
        id: 'nook',
        name: 'Nook One',
        level: 'Level 1',
        seats: 2,
        rate: 12,
        kit: ['video', 'coffee'],
        taken: [11, 12, 17],
        img: '1497215728101-856f4ea42174',
        alt: 'Bright office corner with desks and plants',
    },
    {
        id: 'loft',
        name: 'Studio Loft',
        level: 'Level 5',
        seats: 8,
        rate: 42,
        kit: ['screen', 'board', 'coffee'],
        taken: [10, 11, 12, 13],
        img: '1531973576160-7125cd663d86',
        alt: 'Open studio with an industrial ceiling and long desks',
    },
    {
        id: 'glass',
        name: 'Glasshouse',
        level: 'Level 3',
        seats: 4,
        rate: 22,
        kit: ['screen', 'video'],
        taken: [8, 16, 17],
        img: '1497366754035-f200968a6e72',
        alt: 'Glass-walled meeting rooms along an office corridor',
    },
    {
        id: 'library',
        name: 'Library Room',
        level: 'Level 2',
        seats: 5,
        rate: 26,
        kit: ['board', 'phone', 'coffee'],
        taken: [12, 13],
        img: '1521587760476-6c12a4b040da',
        alt: 'Wall of full bookshelves in a quiet room',
    },
]

const sizes = [
    { id: 'any', label: 'Any size', test: () => true },
    { id: 'small', label: '1 – 4', test: (n) => n <= 4 },
    { id: 'mid', label: '5 – 8', test: (n) => n >= 5 && n <= 8 },
    { id: 'large', label: '9+', test: (n) => n >= 9 },
]

const hh = (h) => `${String(h).padStart(2, '0')}:00`

export function HourlySlotsListingsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [dateLabel, setDateLabel] = useState('Tue 13 Oct')
    const [dateCode, setDateCode] = useState('1013')
    const [sizeId, setSizeId] = useState('any')
    const [sel, setSel] = useState({ roomId: 'fern', hours: [10, 11] })
    const [mine, setMine] = useState({})
    const [done, setDone] = useState(null)

    useEffect(() => {
        const now = new Date()
        setDateLabel(`${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`)
        setDateCode(`${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`)
    }, [])

    const isTaken = (room, h) => room.taken.includes(h) || (mine[room.id] || []).includes(h)

    const toggle = (room, h) => {
        setDone(null)
        setSel((prev) => {
            if (!prev || prev.roomId !== room.id) return { roomId: room.id, hours: [h] }
            const hs = prev.hours
            const lo = Math.min(...hs)
            const hi = Math.max(...hs)
            if (hs.includes(h)) {
                if (hs.length === 1) return null
                if (h === lo || h === hi) return { roomId: room.id, hours: hs.filter((x) => x !== h) }
                return { roomId: room.id, hours: [h] }
            }
            const from = Math.min(lo, h)
            const to = Math.max(hi, h)
            const range = Array.from({ length: to - from + 1 }, (_, i) => from + i)
            if (range.every((x) => !isTaken(room, x))) return { roomId: room.id, hours: range }
            return { roomId: room.id, hours: [h] }
        })
    }

    const book = (room) => {
        const hs = sel.hours
        setMine((m) => ({ ...m, [room.id]: [...(m[room.id] || []), ...hs] }))
        setDone({
            roomId: room.id,
            text: `${room.name} · ${hh(Math.min(...hs))} – ${hh(Math.max(...hs) + 1)}`,
            ref: `DH-${room.id.toUpperCase()}-${dateCode}`,
        })
        setSel(null)
    }

    const test = sizes.find((s) => s.id === sizeId).test
    const visible = rooms.filter((r) => test(r.seats))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#ecfdf5] px-4 py-16 text-base font-normal text-[#052e22] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-40 -top-40 size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(4,120,87,0.16),transparent)]"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-[#047857]">
                            <span className="inline-flex items-center gap-2 text-[#052e22]">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
                                    <path d="M12 2 21 7v10l-9 5-9-5V7z" fill="#047857" />
                                    <path d="M12 7.5 16 9.8v4.4L12 16.5 8 14.2V9.8z" fill="#ecfdf5" />
                                </svg>
                                deskhive
                            </span>
                            <span aria-hidden="true" className="text-[#052e22]/30">
                                /
                            </span>
                            Shoreditch, 41 Curtain Road
                        </p>
                        <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[#052e22] sm:text-5xl lg:text-6xl">
                            Book a room by the hour.
                        </h2>
                        <p className="mt-4 flex items-center gap-2 text-base text-[#052e22]/70">
                            <span className="relative flex size-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#047857]/50 motion-reduce:animate-none" />
                                <span className="relative inline-flex size-2.5 rounded-full bg-[#047857]" />
                            </span>
                            Live availability for today · {dateLabel} · 08:00 – 18:00
                        </p>
                    </div>
                    <div role="group" aria-label="Filter rooms by capacity" className="flex flex-wrap gap-2">
                        {sizes.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                aria-pressed={sizeId === s.id}
                                className={cn(
                                    'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]',
                                    sizeId === s.id
                                        ? 'bg-[#047857] text-white'
                                        : 'bg-white text-[#052e22] ring-1 ring-[#047857]/20 hover:ring-[#047857]',
                                )}
                                onClick={() => setSizeId(s.id)}
                            >
                                {s.id !== 'any' && <LuUsers aria-hidden="true" className="size-4" />}
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.ul layout={!reduceMotion} className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {visible.map((room) => {
                            const active = sel && sel.roomId === room.id
                            const hours = active ? sel.hours : []
                            const freeCount = HOURS.filter((h) => !isTaken(room, h)).length
                            const confirmed = done && done.roomId === room.id
                            return (
                                <motion.li
                                    key={room.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
                                    transition={{ duration: 0.25 }}
                                    className={cn(
                                        'flex flex-col rounded-[24px] border bg-white p-3 transition-shadow',
                                        active
                                            ? 'border-[#047857] shadow-[0_24px_50px_-28px_rgba(4,120,87,0.7)]'
                                            : 'border-[#047857]/15',
                                    )}
                                >
                                    <div className="relative">
                                        <img
                                            src={`https://images.unsplash.com/photo-${room.img}?auto=format&fit=crop&w=700&q=80`}
                                            alt={room.alt}
                                            loading="lazy"
                                            className="aspect-[16/9] w-full rounded-[18px] object-cover"
                                        />
                                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#052e22]">
                                            {room.level}
                                        </span>
                                        <span className="absolute right-3 top-3 rounded-full bg-[#047857] px-2.5 py-1 text-[11px] font-semibold text-white">
                                            {freeCount} of {HOURS.length} h free
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between gap-3 px-2 pt-4">
                                        <div className="min-w-0">
                                            <h3 className="text-xl font-bold tracking-tight text-[#052e22]">{room.name}</h3>
                                            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#052e22]/65">
                                                <LuUsers aria-hidden="true" className="size-4" /> Up to {room.seats}{' '}
                                                {room.seats === 1 ? 'person' : 'people'}
                                            </p>
                                        </div>
                                        <p className="shrink-0 text-right">
                                            <span className="text-2xl font-bold text-[#047857]">£{room.rate}</span>
                                            <span className="text-sm text-[#052e22]/60"> / hour</span>
                                        </p>
                                    </div>

                                    <ul className="mt-3 flex flex-wrap gap-1.5 px-2">
                                        {room.kit.map((k) => {
                                            const { icon: Icon, label } = kitMeta[k]
                                            return (
                                                <li
                                                    key={k}
                                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-1 text-xs font-medium text-[#052e22]/75"
                                                >
                                                    <Icon aria-hidden="true" className="size-3.5 text-[#047857]" />
                                                    {label}
                                                </li>
                                            )
                                        })}
                                    </ul>

                                    <div
                                        role="group"
                                        aria-label={`${room.name} free hours today`}
                                        className="mt-4 grid grid-cols-5 gap-1.5 px-2"
                                    >
                                        {HOURS.map((h) => {
                                            const taken = room.taken.includes(h)
                                            const yours = (mine[room.id] || []).includes(h)
                                            const picked = hours.includes(h)
                                            return (
                                                <button
                                                    key={h}
                                                    type="button"
                                                    disabled={taken || yours}
                                                    aria-pressed={picked}
                                                    aria-label={`${hh(h)} to ${hh(h + 1)}${taken ? ', taken' : yours ? ', booked by you' : ''}`}
                                                    className={cn(
                                                        'min-h-10 rounded-lg border font-mono text-xs font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]',
                                                        taken
                                                            ? 'cursor-not-allowed border-transparent bg-[#ecfdf5] text-[#052e22]/30 line-through'
                                                            : yours
                                                              ? 'cursor-not-allowed border-dashed border-[#047857] bg-white text-[#047857]'
                                                              : picked
                                                                ? 'border-[#047857] bg-[#047857] text-white'
                                                                : 'border-[#047857]/25 bg-white text-[#052e22] hover:border-[#047857] hover:bg-[#ecfdf5]',
                                                    )}
                                                    onClick={() => toggle(room, h)}
                                                >
                                                    {hh(h)}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <div aria-live="polite" className="mt-4 flex min-h-[4.5rem] flex-1 items-end px-2 pb-1">
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.div
                                                key={confirmed ? 'done' : active ? hours.join('-') : 'idle'}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                                className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-[#047857]/15 pt-3"
                                            >
                                                {confirmed ? (
                                                    <p className="flex items-start gap-2 text-sm text-[#052e22]">
                                                        <HiCheckCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#047857]" />
                                                        <span>
                                                            <span className="font-semibold">Booked · {done.text}</span>
                                                            <span className="block text-xs text-[#052e22]/60">
                                                                Invite sent · ref <span className="font-mono">{done.ref}</span>
                                                            </span>
                                                        </span>
                                                    </p>
                                                ) : active ? (
                                                    <>
                                                        <p className="text-sm text-[#052e22]">
                                                            <span className="font-semibold">
                                                                {room.name} · {hh(Math.min(...hours))} – {hh(Math.max(...hours) + 1)}
                                                            </span>
                                                            <span className="text-[#052e22]/65">
                                                                {' '}
                                                                · {hours.length} h · £{room.rate * hours.length} + VAT
                                                            </span>
                                                        </p>
                                                        <button
                                                            type="button"
                                                            className="min-h-10 rounded-full bg-[#047857] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#065f46] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]"
                                                            onClick={() => book(room)}
                                                        >
                                                            Book
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-[#052e22]/55">
                                                        {freeCount ? 'Pick one or more free hours' : 'Fully booked today'}
                                                    </p>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </motion.li>
                            )
                        })}
                    </AnimatePresence>
                </motion.ul>

                <p className="mt-10 text-center text-sm text-[#052e22]/60">
                    Members save 20% on every hour.{' '}
                    <a
                        href="#deskhive-membership"
                        className="font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 hover:decoration-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]"
                    >
                        See membership plans
                    </a>
                </p>
            </div>
        </section>
    )
}

export default HourlySlotsListingsGrid

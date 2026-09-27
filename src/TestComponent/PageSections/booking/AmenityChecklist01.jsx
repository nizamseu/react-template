// IconGridAmenitiesChecklist

// AmenityChecklist01 · Booking & Reservations › Amenity & Service Checklist

// Description:
// The "What this place offers" block of a Nestaway listing page (Casa Azulejo, a tiled
// loft in Lisbon's Alfama). Eight headline amenities (River view, 320 Mbps Wi-Fi,
// Dedicated workspace…) sit in an icon grid next to a host note, and "Show all 36
// amenities" opens a searchable dialog grouped into nine categories plus "Not included".
// Use it on any rental or hotel detail page right after the description.

// Design:
// - lg: 4/12 intro column (eyebrow, heading, host note + avatar, Wi-Fi card) + 8/12 grid of
//   eight tiles (2 → sm: 4 columns); everything stacks below lg
// - White page, charcoal #222222 text and icons, grey #717171 detail text, hairline
//   #ebebeb borders, a small coral #ff5a5f accent on the eyebrow and the speed gauge
// - Tiles are rounded-2xl, 1px bordered, icon top-left and label + detail at the bottom;
//   hover lifts the border to charcoal and nudges the icon
// - Dialog: bottom sheet on mobile (rounded-t-3xl), centred rounded-3xl card from sm; a
//   sticky header with search and scrollable category chips; sections list icon rows,
//   "Not included" rows are struck through
// - framer-motion fades the backdrop and slides the sheet; instant with reduced motion

// What it does:
// - open toggles the dialog from the button or any tile (a tile jumps straight to its
//   category); Escape, the close button or the backdrop closes it and focus returns to
//   the control that opened it; Tab is trapped inside and page scroll is locked
// - query filters amenities by name and detail, hiding empty categories and showing a
//   "No amenities match" state; category chips scroll the list to that section
// - No network calls; the Wi-Fi gauge and host note are visual-only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IconGridAmenitiesChecklist from '@/TestComponent/PageSections/booking/AmenityChecklist01';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <IconGridAmenitiesChecklist />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    LuArrowUpDown,
    LuBath,
    LuBedDouble,
    LuBellRing,
    LuBlinds,
    LuBookOpen,
    LuBriefcaseMedical,
    LuCalendarDays,
    LuCoffee,
    LuCookingPot,
    LuDroplets,
    LuFan,
    LuFireExtinguisher,
    LuFlame,
    LuHeater,
    LuKeyRound,
    LuLaptop,
    LuLockKeyhole,
    LuLuggage,
    LuMonitor,
    LuRefrigerator,
    LuSearch,
    LuShirt,
    LuShowerHead,
    LuSiren,
    LuSnowflake,
    LuSparkles,
    LuSpeaker,
    LuSquareParking,
    LuSun,
    LuSunrise,
    LuThermometer,
    LuTv,
    LuUtensils,
    LuUtensilsCrossed,
    LuWashingMachine,
    LuWaves,
    LuWifi,
    LuWind,
    LuWine,
    LuX,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const categories = [
    {
        id: 'bathroom',
        title: 'Bathroom',
        items: [
            { name: 'Hair dryer', Icon: LuWind },
            { name: 'Shampoo & conditioner', detail: 'Refillable, made in Porto', Icon: LuDroplets },
            { name: 'Hot water', Icon: LuThermometer },
            { name: 'Rain shower', detail: 'Walk-in, azulejo-tiled', Icon: LuShowerHead },
            { name: 'Bidet', Icon: LuBath },
        ],
    },
    {
        id: 'bedroom',
        title: 'Bedroom & laundry',
        items: [
            { name: 'Washer', detail: 'In the unit', Icon: LuWashingMachine },
            { name: 'Dryer', detail: 'Heat-pump, in the unit', Icon: LuWind },
            { name: 'Iron & board', Icon: LuShirt },
            { name: 'Blackout curtains', Icon: LuBlinds },
            { name: 'Extra pillows & blankets', Icon: LuBedDouble },
        ],
    },
    {
        id: 'entertainment',
        title: 'Entertainment',
        items: [
            { name: '50" TV', detail: 'With streaming apps', Icon: LuTv },
            { name: 'Bluetooth speaker', Icon: LuSpeaker },
            { name: 'Books & reading material', detail: 'A shelf of Portuguese poetry in translation', Icon: LuBookOpen },
        ],
    },
    {
        id: 'climate',
        title: 'Heating & cooling',
        items: [
            { name: 'Air conditioning', detail: 'Split unit in the bedroom', Icon: LuSnowflake },
            { name: 'Ceiling fan', Icon: LuFan },
            { name: 'Portable heater', Icon: LuHeater },
        ],
    },
    {
        id: 'safety',
        title: 'Home safety',
        items: [
            { name: 'Smoke alarm', Icon: LuBellRing },
            { name: 'Fire extinguisher', Icon: LuFireExtinguisher },
            { name: 'First aid kit', Icon: LuBriefcaseMedical },
            { name: 'Keypad lock', detail: 'New code for every stay', Icon: LuLockKeyhole },
        ],
    },
    {
        id: 'office',
        title: 'Internet & office',
        items: [
            { name: 'Wi-Fi', detail: '320 Mbps fibre, verified Aug 2026', Icon: LuWifi },
            { name: 'Dedicated workspace', detail: 'Oak desk by the river window', Icon: LuLaptop },
            { name: '27" monitor & USB-C hub', Icon: LuMonitor },
        ],
    },
    {
        id: 'kitchen',
        title: 'Kitchen & dining',
        items: [
            { name: 'Kitchen', detail: 'Space where guests can cook their own meals', Icon: LuCookingPot },
            { name: 'Refrigerator', Icon: LuRefrigerator },
            { name: 'Espresso machine', detail: 'Coffee beans from the corner roastery included', Icon: LuCoffee },
            { name: 'Dishwasher', Icon: LuSparkles },
            { name: 'Oven', Icon: LuFlame },
            { name: 'Cooking basics', detail: 'Pots, pans, oil, salt and pepper', Icon: LuUtensils },
            { name: 'Dining table for 4', Icon: LuUtensilsCrossed },
        ],
    },
    {
        id: 'outdoor',
        title: 'Location & outdoor',
        items: [
            { name: 'River view', detail: 'Over the Tagus from the living room', Icon: LuWaves },
            { name: 'Private balcony', Icon: LuSun },
            { name: 'Outdoor dining area', Icon: LuWine },
        ],
    },
    {
        id: 'services',
        title: 'Services',
        items: [
            { name: 'Self check-in', detail: 'Keypad, any time after 15:00', Icon: LuKeyRound },
            { name: 'Luggage drop-off', detail: 'From 10:00 on arrival day', Icon: LuLuggage },
            { name: 'Long-term stays allowed', detail: '28 nights or more', Icon: LuCalendarDays },
        ],
    },
    {
        id: 'missing',
        title: 'Not included',
        missing: true,
        items: [
            { name: 'Free parking on premises', detail: 'Public garage 400 m away, €22/day', Icon: LuSquareParking },
            { name: 'Elevator', detail: 'Fourth-floor walk-up, 68 steps', Icon: LuArrowUpDown },
            { name: 'Carbon monoxide alarm', detail: 'No gas appliances in the loft', Icon: LuSiren },
            { name: 'Pool', Icon: LuSunrise },
        ],
    },
]

const TOTAL = categories.filter((c) => !c.missing).reduce((n, c) => n + c.items.length, 0)

const highlight = [
    ['outdoor', 'River view'],
    ['office', 'Wi-Fi'],
    ['office', 'Dedicated workspace'],
    ['kitchen', 'Kitchen'],
    ['bedroom', 'Washer'],
    ['climate', 'Air conditioning'],
    ['services', 'Self check-in'],
    ['kitchen', 'Espresso machine'],
].map(([cat, name]) => ({ cat, ...categories.find((c) => c.id === cat).items.find((i) => i.name === name) }))

const shortDetail = {
    'River view': 'Tagus from the sofa',
    'Wi-Fi': '320 Mbps fibre',
    'Dedicated workspace': 'Desk by the window',
    Kitchen: 'Fully equipped',
    Washer: 'In the unit',
    'Air conditioning': 'Bedroom split unit',
    'Self check-in': 'Keypad, 24 h',
    'Espresso machine': 'Beans included',
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

export function IconGridAmenitiesChecklist({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [open, setOpen] = useState(false)
    const [jumpTo, setJumpTo] = useState(null)
    const [query, setQuery] = useState('')
    const dialogRef = useRef(null)
    const bodyRef = useRef(null)
    const searchRef = useRef(null)
    const returnFocusRef = useRef(null)

    const q = query.trim().toLowerCase()
    const filtered = categories
        .map((c) => ({
            ...c,
            items: c.items.filter((i) => !q || i.name.toLowerCase().includes(q) || (i.detail ?? '').toLowerCase().includes(q)),
        }))
        .filter((c) => c.items.length > 0)
    const matchCount = filtered.filter((c) => !c.missing).reduce((n, c) => n + c.items.length, 0)

    const openDialog = (categoryId = null) => {
        returnFocusRef.current = typeof document !== 'undefined' ? document.activeElement : null
        setQuery('')
        setJumpTo(categoryId)
        setOpen(true)
    }

    const scrollToCategory = (id, smooth) => {
        const body = bodyRef.current
        const el = body?.querySelector(`[data-category="${id}"]`)
        if (!body || !el) return
        body.scrollTo({ top: el.offsetTop - 8, behavior: smooth && !reduceMotion ? 'smooth' : 'auto' })
    }

    useEffect(() => {
        if (!open) return undefined
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const body = bodyRef.current
        const target = jumpTo ? body?.querySelector(`[data-category="${jumpTo}"]`) : null
        if (body && target) {
            body.scrollTop = target.offsetTop - 8
            dialogRef.current?.querySelector('[data-close]')?.focus({ preventScroll: true })
        } else {
            searchRef.current?.focus({ preventScroll: true })
        }

        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                setOpen(false)
                return
            }
            if (e.key !== 'Tab' || !dialogRef.current) return
            const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
            if (!nodes.length) return
            const first = nodes[0]
            const last = nodes[nodes.length - 1]
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', onKey)
            returnFocusRef.current?.focus?.({ preventScroll: true })
        }
    }, [open, jumpTo])

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white py-16 text-base font-normal text-[#222222] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-10">
                <div className="lg:col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5a5f]">
                        Nestaway · Casa Azulejo, Alfama
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#222222] sm:text-4xl">
                        What this place offers
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-[#484848]">
                        Everything below was checked by Joana, your host since 2019, before the last
                        guest arrived. If something’s missing, message her — she lives two streets away.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                            alt="Joana, the host, smiling in a red sweater"
                            loading="lazy"
                            className="size-12 rounded-full object-cover"
                        />
                        <p className="text-sm leading-snug">
                            <span className="block font-semibold text-[#222222]">Hosted by Joana</span>
                            <span className="text-[#717171]">Superhost · 6 years hosting · replies in 1 h</span>
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#ebebeb] p-4">
                        <svg viewBox="0 0 64 40" className="h-10 w-16 shrink-0" aria-hidden="true">
                            <path d="M6 36 A 26 26 0 0 1 58 36" fill="none" stroke="#ebebeb" strokeWidth="6" strokeLinecap="round" />
                            <path d="M6 36 A 26 26 0 0 1 52 18" fill="none" stroke="#ff5a5f" strokeWidth="6" strokeLinecap="round" />
                            <circle cx="32" cy="36" r="3" fill="#222222" />
                            <path d="M32 36 L48 22" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-[#222222]">Fast Wi-Fi · 320 Mbps</p>
                            <p className="text-xs leading-snug text-[#717171]">
                                Good for 4K video calls. Speed test by the host on Aug 30, 2026.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                        {highlight.map((item, i) => {
                            const Icon = item.Icon
                            return (
                                <motion.li
                                    key={item.name}
                                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <button
                                        type="button"
                                        aria-label={`${item.name}, ${shortDetail[item.name]}. See all ${categories.find((c) => c.id === item.cat).title} amenities`}
                                        className="group flex aspect-square w-full flex-col justify-between rounded-2xl border border-[#ebebeb] p-4 text-left transition-colors duration-200 hover:border-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222222] sm:aspect-[4/5] sm:p-5"
                                        onClick={() => openDialog(item.cat)}
                                    >
                                        <Icon
                                            className="size-7 text-[#222222] transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-8"
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />
                                        <span>
                                            <span className="block text-[15px] font-semibold leading-snug text-[#222222]">{item.name}</span>
                                            <span className="mt-1 block text-xs leading-snug text-[#717171]">{shortDetail[item.name]}</span>
                                        </span>
                                    </button>
                                </motion.li>
                            )
                        })}
                    </ul>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            aria-haspopup="dialog"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#222222] px-6 text-[15px] font-semibold text-[#222222] transition-colors hover:bg-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222222]"
                            onClick={() => openDialog()}
                        >
                            Show all {TOTAL} amenities
                        </button>
                        <p className="text-sm text-[#717171]">Tap any tile to jump to its category.</p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="amenities-dialog"
                        className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    >
                        <div className="absolute inset-0 bg-[#222222]/55" aria-hidden="true" onClick={() => setOpen(false)} />
                        <motion.div
                            ref={dialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`${uid}-title`}
                            initial={reduceMotion ? false : { y: 48, opacity: 0.6 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={reduceMotion ? { opacity: 0 } : { y: 48, opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white text-[#222222] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] sm:max-w-2xl sm:rounded-3xl"
                        >
                            <div className="border-b border-[#ebebeb] px-5 pb-4 pt-5 sm:px-8 sm:pt-7">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 id={`${uid}-title`} className="text-2xl font-semibold tracking-tight text-[#222222]">
                                            What this place offers
                                        </h3>
                                        <p className="mt-1 text-sm text-[#717171]" aria-live="polite">
                                            {q ? `${matchCount} of ${TOTAL} amenities match` : `${TOTAL} amenities · 4 not included`}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        data-close=""
                                        aria-label="Close amenities"
                                        className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-[#222222]"
                                        onClick={() => setOpen(false)}
                                    >
                                        <LuX className="size-5" aria-hidden="true" />
                                    </button>
                                </div>
                                <label className="relative mt-4 block">
                                    <span className="sr-only">Search amenities</span>
                                    <LuSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#717171]" aria-hidden="true" />
                                    <input
                                        ref={searchRef}
                                        type="search"
                                        value={query}
                                        placeholder="Search amenities, e.g. coffee"
                                        className="h-12 w-full rounded-full border border-[#dddddd] bg-white pl-11 pr-4 text-[15px] text-[#222222] placeholder:text-[#9a9a9a] focus:border-[#222222] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#222222]/15"
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </label>
                                {!q && (
                                    <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8">
                                        {categories.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                className="min-h-10 shrink-0 rounded-full border border-[#dddddd] px-3.5 text-sm font-medium text-[#222222] transition-colors hover:border-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222222]"
                                                onClick={() => scrollToCategory(c.id, true)}
                                            >
                                                {c.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div ref={bodyRef} className="relative flex-1 overflow-y-auto px-5 pb-8 sm:px-8">
                                {filtered.length === 0 && (
                                    <p className="py-12 text-center text-sm text-[#717171]">
                                        No amenities match “{query}”. Try “wifi” or “kitchen”.
                                    </p>
                                )}
                                {filtered.map((c) => (
                                    <div key={c.id} data-category={c.id} className="pt-7">
                                        <h4 className="text-lg font-semibold text-[#222222]">{c.title}</h4>
                                        <ul className="mt-2 divide-y divide-[#ebebeb]">
                                            {c.items.map((item) => {
                                                const Icon = item.Icon
                                                return (
                                                    <li key={item.name} className="flex items-start gap-4 py-4">
                                                        <Icon
                                                            className={cn('mt-0.5 size-6 shrink-0', c.missing ? 'text-[#b0b0b0]' : 'text-[#222222]')}
                                                            strokeWidth={1.5}
                                                            aria-hidden="true"
                                                        />
                                                        <span className="min-w-0">
                                                            <span
                                                                className={cn(
                                                                    'block text-[15px] text-[#222222]',
                                                                    c.missing && 'text-[#717171] line-through decoration-[#717171]',
                                                                )}
                                                            >
                                                                {c.missing && <span className="sr-only">Not included: </span>}
                                                                {item.name}
                                                            </span>
                                                            {item.detail && (
                                                                <span className="mt-0.5 block text-sm leading-snug text-[#717171]">{item.detail}</span>
                                                            )}
                                                        </span>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default IconGridAmenitiesChecklist

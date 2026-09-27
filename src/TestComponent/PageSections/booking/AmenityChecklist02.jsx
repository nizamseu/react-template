// IncludedExcludedAmenityChecklist

// AmenityChecklist02 · Booking & Reservations › Amenity & Service Checklist

// Description:
// A rate-transparency checklist for Hotel Marisol on the travel site Wayfare. Under
// "What’s included in your rate" guests switch between three rates (Room only €189, Bed &
// breakfast €219, Flexible plus €249) and watch amenities move between an "Included"
// column (green ticks) and a "Not included" column (struck through, with prices such as
// "Parking — €18/night"). Extras can be added to a live estimate. Use it before checkout.

// Design:
// - Header + stay line, a 1 → md: 3-column rate picker, then 1 → md: 2 columns (Included /
//   Not included) and a summary bar that stacks on mobile and splits from sm
// - White page, slate #0f172a text, Wayfare ocean blue #0369a1 for the selected rate and
//   CTA, green #15803d / #f0fdf4 ticks, red #dc2626 / #fef2f2 crosses and strike-throughs
// - Rounded-2xl rate cards with a radio dot, rows are rounded-xl with 36px icon chips;
//   excluded names use a 2px red line-through, prices in tabular numerals
// - framer-motion layout animation glides each row across columns when the rate changes
//   and springs the totals; instant with reduced motion

// What it does:
// - rateId (radiogroup with arrow keys) decides which amenities are included; counts in
//   the column headings update with it
// - extras (Set) holds "Add" toggles on priced, not-included rows; the estimate adds
//   them for 3 nights and 2 adults and ignores anything the chosen rate already includes
// - "Continue with <rate>" links to #book-<rateId>; no network calls

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IncludedExcludedAmenityChecklist from '@/TestComponent/PageSections/booking/AmenityChecklist02';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <IncludedExcludedAmenityChecklist />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import {
    LuBaggageClaim,
    LuBus,
    LuCalendarCheck,
    LuCheck,
    LuClock,
    LuConciergeBell,
    LuCoffee,
    LuDog,
    LuDumbbell,
    LuFlower2,
    LuGlassWater,
    LuLandmark,
    LuPlus,
    LuSparkles,
    LuSquareParking,
    LuWifi,
    LuWine,
    LuX,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const NIGHTS = 3
const ADULTS = 2

const rates = [
    { id: 'room-only', name: 'Room only', price: 189, perk: 'Non-refundable · best price' },
    { id: 'bed-breakfast', name: 'Bed & breakfast', price: 219, perk: 'Free cancellation until Sep 15' },
    { id: 'flexible-plus', name: 'Flexible plus', price: 249, perk: 'Cancel free up to 24 h before' },
]

// in: rates that include the item; cost: [amount, unit] charged when it is not included
const amenities = [
    { id: 'wifi', name: 'Wi-Fi', Icon: LuWifi, in: ['room-only', 'bed-breakfast', 'flexible-plus'], note: 'Fibre in rooms and on the roof' },
    { id: 'housekeeping', name: 'Daily housekeeping', Icon: LuSparkles, in: ['room-only', 'bed-breakfast', 'flexible-plus'], note: 'Between 10:00 and 15:00' },
    { id: 'pool', name: 'Rooftop pool & gym', Icon: LuDumbbell, in: ['room-only', 'bed-breakfast', 'flexible-plus'], note: 'Pool 08:00 – 21:00, gym 24 h' },
    { id: 'reception', name: '24-hour reception', Icon: LuConciergeBell, in: ['room-only', 'bed-breakfast', 'flexible-plus'], note: 'Luggage storage included' },
    { id: 'welcome', name: 'Welcome cava', Icon: LuGlassWater, in: ['room-only', 'bed-breakfast', 'flexible-plus'], note: 'On the terrace at check-in' },
    {
        id: 'breakfast',
        name: 'Breakfast buffet',
        Icon: LuCoffee,
        in: ['bed-breakfast', 'flexible-plus'],
        note: '07:00 – 10:30 in the courtyard',
        cost: [24, 'person-night'],
        costLabel: '€24 per person a day',
    },
    {
        id: 'cancellation',
        name: 'Free cancellation',
        Icon: LuCalendarCheck,
        in: ['bed-breakfast', 'flexible-plus'],
        note: 'Full refund within the window',
        missingNote: 'Non-refundable once booked',
    },
    {
        id: 'parking',
        name: 'Parking',
        Icon: LuSquareParking,
        in: ['flexible-plus'],
        note: 'Underground, valet included',
        cost: [18, 'night'],
        costLabel: '€18/night',
    },
    {
        id: 'late-checkout',
        name: 'Late checkout (14:00)',
        Icon: LuClock,
        in: ['flexible-plus'],
        note: 'Guaranteed, no need to ask',
        cost: [35, 'stay'],
        costLabel: '€35 flat',
    },
    {
        id: 'spa',
        name: 'Spa circuit',
        Icon: LuFlower2,
        in: ['flexible-plus'],
        note: 'One 90-minute session each',
        cost: [40, 'person'],
        costLabel: '€40 per person',
    },
    {
        id: 'shuttle',
        name: 'Airport shuttle',
        Icon: LuBus,
        in: [],
        note: 'Door to T1 or T2',
        cost: [35, 'trip'],
        costLabel: '€35 each way',
    },
    { id: 'minibar', name: 'Minibar', Icon: LuWine, in: [], missingNote: 'Pay for what you use' },
    {
        id: 'pets',
        name: 'Pet stay',
        Icon: LuDog,
        in: [],
        note: 'One dog up to 15 kg · bed and bowls provided',
        cost: [25, 'night'],
        costLabel: '€25/night',
    },
    { id: 'city-tax', name: 'City tax', Icon: LuLandmark, in: [], missingNote: '€5 per person per night, paid at the hotel' },
    { id: 'luggage', name: 'Early bag drop', Icon: LuBaggageClaim, in: ['room-only', 'bed-breakfast', 'flexible-plus'], note: 'From 08:00 on arrival day' },
]

const costOf = (a) => {
    if (!a.cost) return 0
    const [amount, unit] = a.cost
    if (unit === 'night') return amount * NIGHTS
    if (unit === 'person-night') return amount * NIGHTS * ADULTS
    if (unit === 'person') return amount * ADULTS
    if (unit === 'trip') return amount * 2
    return amount
}

const costHint = (a) => {
    const [, unit] = a.cost
    if (unit === 'night') return `× ${NIGHTS} nights`
    if (unit === 'person-night') return `× ${ADULTS} adults × ${NIGHTS} nights`
    if (unit === 'person') return `× ${ADULTS} adults`
    if (unit === 'trip') return 'return trip'
    return 'per stay'
}

const eur = (n) => `€${n.toLocaleString('en-GB')}`

export function IncludedExcludedAmenityChecklist({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [rateId, setRateId] = useState('bed-breakfast')
    const [extras, setExtras] = useState(() => new Set(['shuttle']))
    const rateRefs = useRef([])

    const rate = rates.find((r) => r.id === rateId) ?? rates[0]
    const included = amenities.filter((a) => a.in.includes(rateId))
    const excluded = amenities.filter((a) => !a.in.includes(rateId))
    const activeExtras = excluded.filter((a) => a.cost && extras.has(a.id))
    const extrasTotal = activeExtras.reduce((n, a) => n + costOf(a), 0)
    const roomTotal = rate.price * NIGHTS
    const layoutTransition = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }

    const toggleExtra = (id) => {
        setExtras((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const onRateKey = (e, index) => {
        const last = rates.length - 1
        let next = null
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
        if (next === null) return
        e.preventDefault()
        setRateId(rates[next].id)
        rateRefs.current[next]?.focus()
    }

    const renderRow = (a, isIncluded) => {
        const Icon = a.Icon
        const added = !isIncluded && a.cost && extras.has(a.id)
        return (
            <motion.li
                key={a.id}
                layoutId={`amenity-${a.id}`}
                layout="position"
                transition={layoutTransition}
                className={cn(
                    'flex items-center gap-3 rounded-xl border px-3 py-3 sm:px-4',
                    isIncluded ? 'border-[#dcfce7] bg-[#f0fdf4]/60' : 'border-[#fee2e2] bg-[#fef2f2]/50',
                    added && 'border-[#0369a1]/40 bg-[#f0f9ff]',
                )}
            >
                <span
                    className={cn(
                        'relative grid size-9 shrink-0 place-items-center rounded-lg',
                        isIncluded ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]',
                    )}
                >
                    <Icon className="size-4" aria-hidden="true" />
                    <span
                        className={cn(
                            'absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full border-2 border-white text-white',
                            isIncluded ? 'bg-[#15803d]' : 'bg-[#dc2626]',
                        )}
                        aria-hidden="true"
                    >
                        {isIncluded ? <LuCheck className="size-2.5" strokeWidth={4} /> : <LuX className="size-2.5" strokeWidth={4} />}
                    </span>
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[#0f172a]">
                        <span className="sr-only">{isIncluded ? 'Included: ' : 'Not included: '}</span>
                        <span className={cn(!isIncluded && 'text-[#475569] line-through decoration-[#dc2626] decoration-2')}>
                            {isIncluded ? a.name : a.name.split(' (')[0]}
                        </span>
                        {!isIncluded && a.cost && <span className="font-medium text-[#0f172a]"> — {a.costLabel}</span>}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-[#64748b]">
                        {isIncluded || a.cost ? a.note : a.missingNote}
                    </span>
                </span>
                {!isIncluded && a.cost && (
                    <button
                        type="button"
                        aria-pressed={Boolean(added)}
                        aria-label={`${added ? 'Remove' : 'Add'} ${a.name}: ${eur(costOf(a))} for your stay (${a.costLabel}, ${costHint(a)})`}
                        title={`${a.costLabel}, ${costHint(a)}`}
                        className={cn(
                            'inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full border px-3 text-xs font-bold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]',
                            added
                                ? 'border-[#0369a1] bg-[#0369a1] text-white'
                                : 'border-[#cbd5e1] bg-white text-[#0f172a] hover:border-[#0369a1]',
                        )}
                        onClick={() => toggleExtra(a.id)}
                    >
                        {added ? <LuCheck className="size-3.5" aria-hidden="true" /> : <LuPlus className="size-3.5" aria-hidden="true" />}
                        {eur(costOf(a))}
                    </button>
                )}
            </motion.li>
        )
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white py-16 text-base font-normal text-[#0f172a] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0369a1]">Wayfare · Rate details</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-4xl">
                            What’s included in your rate
                        </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-[#475569] md:text-right">
                        Hotel Marisol, Barcelona · Deluxe King, city view
                        <span className="block font-semibold text-[#0f172a]">Sep 18 – 21, 2026 · 3 nights · 2 adults</span>
                    </p>
                </div>

                <div role="radiogroup" aria-label="Choose a rate" className="mt-8 grid gap-3 md:grid-cols-3">
                    {rates.map((r, i) => {
                        const on = r.id === rateId
                        const count = amenities.filter((a) => a.in.includes(r.id)).length
                        return (
                            <button
                                key={r.id}
                                ref={(el) => {
                                    rateRefs.current[i] = el
                                }}
                                type="button"
                                role="radio"
                                aria-checked={on}
                                tabIndex={on ? 0 : -1}
                                className={cn(
                                    'relative flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1] sm:p-5',
                                    on ? 'border-[#0369a1] bg-[#f0f9ff]' : 'border-[#e2e8f0] bg-white hover:border-[#94a3b8]',
                                )}
                                onClick={() => setRateId(r.id)}
                                onKeyDown={(e) => onRateKey(e, i)}
                            >
                                <span
                                    className={cn(
                                        'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2',
                                        on ? 'border-[#0369a1]' : 'border-[#cbd5e1]',
                                    )}
                                    aria-hidden="true"
                                >
                                    {on && <span className="size-2.5 rounded-full bg-[#0369a1]" />}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-baseline justify-between gap-2">
                                        <span className="text-base font-bold text-[#0f172a]">{r.name}</span>
                                        <span className="text-lg font-bold tabular-nums text-[#0f172a]">
                                            {eur(r.price)}
                                            <span className="text-xs font-medium text-[#64748b]"> /night</span>
                                        </span>
                                    </span>
                                    <span className="mt-1 block text-xs text-[#475569]">{r.perk}</span>
                                    <span className="mt-2 block text-xs font-semibold text-[#15803d]">
                                        {count} of {amenities.length} included
                                    </span>
                                </span>
                            </button>
                        )
                    })}
                </div>

                <LayoutGroup id={uid}>
                    <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-6">
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-bold text-[#15803d]">
                                <span className="grid size-6 place-items-center rounded-full bg-[#15803d] text-white">
                                    <LuCheck className="size-3.5" strokeWidth={3} aria-hidden="true" />
                                </span>
                                Included
                                <span className="text-sm font-semibold text-[#64748b]">· {included.length}</span>
                            </h3>
                            <ul className="mt-4 space-y-2">{included.map((a) => renderRow(a, true))}</ul>
                        </div>
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-bold text-[#dc2626]">
                                <span className="grid size-6 place-items-center rounded-full bg-[#dc2626] text-white">
                                    <LuX className="size-3.5" strokeWidth={3} aria-hidden="true" />
                                </span>
                                Not included
                                <span className="text-sm font-semibold text-[#64748b]">· {excluded.length}</span>
                            </h3>
                            <ul className="mt-4 space-y-2">{excluded.map((a) => renderRow(a, false))}</ul>
                        </div>
                    </div>
                </LayoutGroup>

                <div className="mt-10 flex flex-col gap-5 rounded-2xl bg-[#0f172a] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <dl className="grid grid-cols-3 gap-4 text-sm sm:gap-8">
                        <div>
                            <dt className="text-xs text-white/60">{rate.name}</dt>
                            <dd className="mt-1 font-semibold tabular-nums">{eur(roomTotal)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-white/60">Extras ({activeExtras.length})</dt>
                            <dd className="mt-1 font-semibold tabular-nums">{eur(extrasTotal)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-white/60">Estimated total</dt>
                            <dd className="mt-1 text-lg font-bold tabular-nums text-[#7dd3fc]" aria-live="polite">
                                <AnimatePresence initial={false} mode="wait">
                                    <motion.span
                                        key={roomTotal + extrasTotal}
                                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.08 } }}
                                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                        className="inline-block"
                                    >
                                        {eur(roomTotal + extrasTotal)}
                                    </motion.span>
                                </AnimatePresence>
                            </dd>
                        </div>
                    </dl>
                    <a
                        href={`#book-${rate.id}`}
                        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0369a1] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0284c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Continue with {rate.name}
                    </a>
                </div>
                <p className="mt-3 text-xs text-[#64748b]">
                    Taxes and fees included except city tax. Extras are estimates and are paid at the hotel.
                </p>
            </div>
        </section>
    )
}

export default IncludedExcludedAmenityChecklist

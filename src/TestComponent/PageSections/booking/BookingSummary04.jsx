// UpsellCardsBookingSummary

// BookingSummary04 · Booking & Reservations › Booking Summary & Add-ons

// Description:
// A pre-arrival upsell page for the Grand Aurelia Hotel: "Make it a stay to remember."
// above six photo cards (terrace breakfast, signature spa ritual, airport transfer,
// late checkout, champagne on arrival, chef's table dinner), each with a quantity
// stepper. A navy running-total panel shows the room, every extra with its maths, a
// bundle saving, city tax and VAT; on mobile the total lives in a sticky bottom bar.
// Use it in a booking flow or a "prepare for your stay" email landing page.

// Design:
// - Ivory #f8f4ec section, navy #14213d text and summary panel, gold #b08d57 accents
//   and rules; serif display heading (text-4xl → lg:text-6xl) with mono labels
// - Cards: white, rounded-[1.5rem], aspect-[4/3] photo with slow hover zoom, badge
//   chips ("Most booked", "2 slots left Sat"), gold price in serif, stepper pinned to
//   the bottom; selected cards get a gold ring and an "×2 added" seal
// - Grid: 1 col → sm:2 cols (xl stays 2 beside the 340px sticky summary from lg)
// - Mobile/tablet (< lg): sticky navy bar at the bottom of the viewport with total, a
//   Details toggle that expands the breakdown and the confirm button
// - Motion: totals slide between values, seals pop in, breakdown expands in height; all
//   transforms off for reduced motion

// What it does:
// - State: quantities per add-on (with per-card maximums), details-open flag, error and
//   a saved flag; changing any quantity clears the saved state
// - Totals derive from state: 3 × $389 room + Σ qty × price extras, −10% on extras once
//   3 or more different extras are chosen, $4.50 × 2 guests × 3 nights city tax and 12%
//   VAT on room + extras (after the saving)
// - "Confirm extras" needs at least one extra (error message otherwise) and then shows
//   a success banner with the reservation number; "Skip for now" links to
//   #aurelia-check-in

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import UpsellCardsBookingSummary from '@/TestComponent/PageSections/booking/BookingSummary04';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <UpsellCardsBookingSummary />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheck, HiChevronUp, HiMinus, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const NIGHTS = 3
const GUESTS = 2
const ROOM_RATE = 389
const CITY_TAX = 4.5
const VAT = 0.12
const BUNDLE_RATE = 0.1
const BUNDLE_MIN = 3

const extras = [
    {
        id: 'breakfast',
        title: 'Breakfast on the Aurelia Terrace',
        text: 'Sourdough from our bakery, Tuscan eggs, fresh-pressed juices. 7–11 am.',
        price: 34,
        unit: 'per guest, per morning',
        noun: 'breakfast',
        max: GUESTS * NIGHTS,
        badge: 'Most booked',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        alt: 'Rustic sourdough loaves on a floured board',
    },
    {
        id: 'spa',
        title: 'Signature Aurelia spa ritual',
        text: '60 minutes: warm-stone massage and a rose-gold facial in the Solarium spa.',
        price: 165,
        unit: 'per treatment',
        noun: 'treatment',
        max: 4,
        badge: '2 slots left Sat',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        alt: 'Guest relaxing during a facial treatment at the spa',
    },
    {
        id: 'transfer',
        title: 'Private airport transfer',
        text: 'E-Class sedan, chilled water and Wi-Fi. Driver tracks your flight.',
        price: 95,
        unit: 'per trip, up to 3 guests',
        noun: 'trip',
        max: 2,
        image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
        alt: 'Traveller relaxing by an airport window with a plane outside',
    },
    {
        id: 'late',
        title: 'Late checkout until 4 pm',
        text: 'Keep the room for a slow last morning. Guaranteed, not on request.',
        price: 60,
        unit: 'per stay',
        noun: 'late checkout',
        max: 1,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        alt: 'Classic hotel bedroom with a tufted headboard',
    },
    {
        id: 'champagne',
        title: 'Champagne on arrival',
        text: 'A chilled bottle of grower champagne and strawberries waiting in the room.',
        price: 78,
        unit: 'per bottle',
        noun: 'bottle',
        max: 2,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        alt: 'Two glasses of wine raised in a toast',
    },
    {
        id: 'dinner',
        title: "Chef's table at Aurelia Grill",
        text: 'Seven courses at the pass with chef Matteo Ricci. Fri & Sat, 8 pm.',
        price: 120,
        unit: 'per guest',
        noun: 'seat',
        max: 4,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        alt: 'Dark, modern dining room with low pendant lights',
    },
]

const round2 = (n) => Math.round(n * 100) / 100

function money(n) {
    const v = round2(n)
    const [int, dec] = Math.abs(v).toFixed(2).split('.')
    return `${v < 0 ? '−' : ''}$${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`
}

function RollingAmount({ value, reduce, className }) {
    return (
        <span className={cn('relative inline-flex overflow-hidden', className)}>
            <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                    key={value}
                    initial={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="block"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

function Breakdown({ lines, roomTotal, bundle, cityTax, vat, vatBase, dark = true }) {
    const muted = dark ? 'text-[#f8f4ec]/60' : 'text-[#14213d]/60'
    const strong = dark ? 'text-[#f8f4ec]' : 'text-[#14213d]'
    return (
        <dl className="space-y-2.5">
            <div className="flex items-start justify-between gap-3">
                <dt className={cn('min-w-0 text-sm', strong)}>
                    Deluxe King, Garden Wing
                    <span className={cn('block font-mono text-[11px]', muted)}>
                        {NIGHTS} nights × {money(ROOM_RATE)}
                    </span>
                </dt>
                <dd className={cn('shrink-0 font-mono text-sm tabular-nums', strong)}>{money(roomTotal)}</dd>
            </div>
            {lines.map((l) => (
                <div key={l.id} className="flex items-start justify-between gap-3">
                    <dt className={cn('min-w-0 text-sm', strong)}>
                        {l.title}
                        <span className={cn('block font-mono text-[11px]', muted)}>
                            {l.qty} × {money(l.price)}
                        </span>
                    </dt>
                    <dd className={cn('shrink-0 font-mono text-sm tabular-nums', strong)}>{money(l.qty * l.price)}</dd>
                </div>
            ))}
            {bundle ? (
                <div className="flex items-start justify-between gap-3">
                    <dt className="min-w-0 text-sm text-[#d9b779]">
                        Aurelia bundle saving
                        <span className={cn('block font-mono text-[11px]', muted)}>10% off {BUNDLE_MIN}+ extras</span>
                    </dt>
                    <dd className="shrink-0 font-mono text-sm tabular-nums text-[#d9b779]">{money(-bundle)}</dd>
                </div>
            ) : null}
            <div className="flex items-start justify-between gap-3">
                <dt className={cn('min-w-0 text-sm', strong)}>
                    City tax
                    <span className={cn('block font-mono text-[11px]', muted)}>
                        {money(CITY_TAX)} × {GUESTS} guests × {NIGHTS} nights
                    </span>
                </dt>
                <dd className={cn('shrink-0 font-mono text-sm tabular-nums', strong)}>{money(cityTax)}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
                <dt className={cn('min-w-0 text-sm', strong)}>
                    VAT
                    <span className={cn('block font-mono text-[11px]', muted)}>12% of {money(vatBase)}</span>
                </dt>
                <dd className={cn('shrink-0 font-mono text-sm tabular-nums', strong)}>{money(vat)}</dd>
            </div>
        </dl>
    )
}

export function UpsellCardsBookingSummary({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduce = useReducedMotion()
    const [qty, setQty] = useState({ breakfast: 2, spa: 0, transfer: 1, late: 0, champagne: 0, dinner: 0 })
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [error, setError] = useState('')
    const [saved, setSaved] = useState(false)

    const lines = extras.filter((e) => qty[e.id] > 0).map((e) => ({ ...e, qty: qty[e.id] }))
    const roomTotal = NIGHTS * ROOM_RATE
    const extrasTotal = lines.reduce((sum, l) => sum + l.qty * l.price, 0)
    const bundle = lines.length >= BUNDLE_MIN ? round2(extrasTotal * BUNDLE_RATE) : 0
    const vatBase = roomTotal + extrasTotal - bundle
    const vat = round2(vatBase * VAT)
    const cityTax = CITY_TAX * GUESTS * NIGHTS
    const total = round2(vatBase + vat + cityTax)
    const toBundle = Math.max(0, BUNDLE_MIN - lines.length)

    const change = (id, delta, max) => {
        setSaved(false)
        setError('')
        setQty((q) => ({ ...q, [id]: Math.min(max, Math.max(0, q[id] + delta)) }))
    }

    const confirm = () => {
        if (!lines.length) {
            setError('Add at least one extra — or skip this step and go straight to check-in.')
            setSaved(false)
            return
        }
        setError('')
        setSaved(true)
    }

    const breakdownProps = { lines, roomTotal, bundle, cityTax, vat, vatBase }

    const confirmButton = (extra) => (
        <button
            type="button"
            className={cn(
                'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]',
                saved ? 'bg-[#d9b779] text-[#14213d]' : 'bg-[#b08d57] text-[#14213d] hover:bg-[#c7a36a]',
                extra,
            )}
            onClick={confirm}
        >
            {saved ? (
                <>
                    <HiCheck aria-hidden="true" /> Extras saved
                </>
            ) : (
                'Confirm extras'
            )}
        </button>
    )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#f8f4ec] px-4 pt-14 text-base font-normal text-[#14213d] sm:px-6 sm:pt-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 border-b border-[#b08d57]/40 pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#b08d57]">
                            Grand Aurelia Hotel · GA-240817
                        </p>
                        <h2 className="mt-3 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#14213d] sm:text-5xl lg:text-6xl">
                            Make it a stay
                            <br className="hidden sm:block" /> <em className="text-[#b08d57]">to remember.</em>
                        </h2>
                    </div>
                    <ul className="flex flex-wrap gap-2 text-xs text-[#14213d] md:max-w-sm md:justify-end">
                        {['Deluxe King, Garden Wing', 'Thu 22 – Sun 25 Oct 2026', `${NIGHTS} nights`, `${GUESTS} adults`].map(
                            (chip) => (
                                <li key={chip} className="rounded-full border border-[#14213d]/15 bg-white/60 px-3 py-1.5">
                                    {chip}
                                </li>
                            ),
                        )}
                    </ul>
                </div>

                <AnimatePresence>
                    {saved ? (
                        <motion.div
                            role="status"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <p className="mt-6 flex items-start gap-3 rounded-2xl border border-[#b08d57]/50 bg-white px-4 py-3 text-sm leading-6 text-[#14213d]">
                                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#14213d] text-[#d9b779]">
                                    <HiCheck aria-hidden="true" />
                                </span>
                                <span>
                                    <strong className="font-semibold">Added to reservation GA-240817.</strong> {lines.length}{' '}
                                    {lines.length === 1 ? 'extra' : 'extras'}, new stay total {money(total)} — settled at
                                    checkout, nothing is charged today.
                                </span>
                            </p>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
                    <ul className="grid gap-5 sm:grid-cols-2">
                        {extras.map((e) => {
                            const count = qty[e.id]
                            const on = count > 0
                            return (
                                <li
                                    key={e.id}
                                    className={cn(
                                        'group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_1px_0_rgba(20,33,61,0.06),0_18px_40px_-28px_rgba(20,33,61,0.45)] ring-1 transition-shadow',
                                        on ? 'ring-2 ring-[#b08d57]' : 'ring-[#14213d]/8',
                                    )}
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-[#ece4d4]">
                                        <img
                                            src={e.image}
                                            alt={e.alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                        />
                                        {e.badge ? (
                                            <span className="absolute left-3 top-3 rounded-full bg-[#14213d]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f8f4ec] backdrop-blur">
                                                {e.badge}
                                            </span>
                                        ) : null}
                                        <AnimatePresence>
                                            {on ? (
                                                <motion.span
                                                    key="seal"
                                                    initial={reduce ? { opacity: 0 } : { scale: 0.3, rotate: -30, opacity: 0 }}
                                                    animate={{ scale: 1, rotate: -8, opacity: 1 }}
                                                    exit={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
                                                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                                                    className="absolute right-3 top-3 grid h-16 w-16 place-content-center rounded-full border-2 border-dashed border-[#14213d]/30 bg-[#d9b779] text-center text-[#14213d] shadow-lg"
                                                >
                                                    <span className="font-serif text-lg leading-none">×{count}</span>
                                                    <span className="font-mono text-[9px] uppercase tracking-[0.14em]">added</span>
                                                </motion.span>
                                            ) : null}
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="font-serif text-xl font-normal leading-tight text-[#14213d]">{e.title}</h3>
                                        <p className="mt-2 flex-1 text-sm leading-6 text-[#14213d]/70">{e.text}</p>
                                        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#14213d]/10 pt-4">
                                            <p className="min-w-0">
                                                <span className="font-serif text-2xl text-[#b08d57]">${e.price}</span>
                                                <span className="block text-xs text-[#14213d]/60">{e.unit}</span>
                                            </p>
                                            <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#f8f4ec] p-1">
                                                <button
                                                    type="button"
                                                    aria-label={`Remove one ${e.noun}`}
                                                    disabled={count === 0}
                                                    className="grid h-10 w-10 place-items-center rounded-full text-[#14213d] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[#b08d57] disabled:opacity-30"
                                                    onClick={() => change(e.id, -1, e.max)}
                                                >
                                                    <HiMinus aria-hidden="true" />
                                                </button>
                                                <span
                                                    aria-live="polite"
                                                    className="w-6 text-center font-mono text-sm tabular-nums text-[#14213d]"
                                                >
                                                    {count}
                                                    <span className="sr-only"> × {e.title}</span>
                                                </span>
                                                <button
                                                    type="button"
                                                    aria-label={`Add one ${e.noun}`}
                                                    disabled={count >= e.max}
                                                    className="grid h-10 w-10 place-items-center rounded-full bg-[#14213d] text-[#f8f4ec] transition-colors hover:bg-[#23355e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57] disabled:opacity-30"
                                                    onClick={() => change(e.id, 1, e.max)}
                                                >
                                                    <HiPlus aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-[#14213d]/45">
                                            Max {e.max}
                                        </p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>

                    <aside aria-label="Running total" className="hidden lg:block">
                        <div className="sticky top-6 rounded-[1.75rem] bg-[#14213d] p-7 text-[#f8f4ec]">
                            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#d9b779]">Your stay</p>
                            <p className="mt-2 font-serif text-2xl text-[#f8f4ec]">Running total</p>
                            <div className="my-5 h-px bg-linear-to-r from-[#b08d57] via-[#b08d57]/40 to-transparent" />
                            <Breakdown {...breakdownProps} />
                            <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#b08d57]/50 pt-4">
                                <p className="text-sm text-[#f8f4ec]/70">Total</p>
                                <RollingAmount
                                    value={money(total)}
                                    reduce={reduce}
                                    className="font-serif text-3xl text-[#f8f4ec]"
                                />
                            </div>
                            <p aria-live="polite" className="mt-3 text-xs leading-5 text-[#d9b779]">
                                {bundle
                                    ? `Bundle unlocked — you save ${money(bundle)} on extras.`
                                    : `Add ${toBundle} more ${toBundle === 1 ? 'extra' : 'extras'} to save 10% on all extras.`}
                            </p>
                            {confirmButton('mt-6 w-full')}
                            {error ? (
                                <p role="alert" className="mt-3 text-xs leading-5 text-[#fca5a5]">
                                    {error}
                                </p>
                            ) : null}
                            <a
                                href="#aurelia-check-in"
                                className="mt-3 flex min-h-10 items-center justify-center text-sm text-[#f8f4ec]/70 underline-offset-4 hover:text-[#f8f4ec] hover:underline focus-visible:outline-2 focus-visible:outline-[#b08d57]"
                            >
                                Skip for now
                            </a>
                        </div>
                    </aside>
                </div>
            </div>

            <div className="sticky bottom-0 z-30 -mx-4 mt-10 sm:-mx-6 lg:hidden">
                <div className="rounded-t-[1.5rem] bg-[#14213d] px-4 pb-4 pt-3 text-[#f8f4ec] shadow-[0_-12px_30px_-12px_rgba(20,33,61,0.5)] sm:px-6">
                    <AnimatePresence initial={false}>
                        {detailsOpen ? (
                            <motion.div
                                id={`${uid}-details`}
                                initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                                exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="max-h-[50vh] overflow-y-auto border-b border-[#b08d57]/40 pb-4 pt-2">
                                    <Breakdown {...breakdownProps} />
                                    <p className="mt-3 text-xs text-[#d9b779]">
                                        {bundle
                                            ? `Bundle unlocked — you save ${money(bundle)}.`
                                            : `Add ${toBundle} more ${toBundle === 1 ? 'extra' : 'extras'} to save 10%.`}
                                    </p>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                            type="button"
                            aria-expanded={detailsOpen}
                            aria-controls={`${uid}-details`}
                            className="flex min-h-12 min-w-0 items-center gap-2 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-[#b08d57]"
                            onClick={() => setDetailsOpen((o) => !o)}
                        >
                            <span className="min-w-0">
                                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#d9b779]">
                                    Total · {lines.length} {lines.length === 1 ? 'extra' : 'extras'}
                                </span>
                                <RollingAmount value={money(total)} reduce={reduce} className="font-serif text-xl text-[#f8f4ec]" />
                            </span>
                            <HiChevronUp
                                aria-hidden="true"
                                className={cn('h-5 w-5 shrink-0 text-[#d9b779] transition-transform', detailsOpen && 'rotate-180')}
                            />
                            <span className="sr-only">{detailsOpen ? 'Hide' : 'Show'} price details</span>
                        </button>
                        {confirmButton('shrink-0 px-5')}
                    </div>
                    {error ? (
                        <p role="alert" className="mt-2 text-xs leading-5 text-[#fca5a5]">
                            {error}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    )
}

export default UpsellCardsBookingSummary

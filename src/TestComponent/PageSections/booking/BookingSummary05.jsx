// PromoPolicyBookingSummary

// BookingSummary05 · Booking & Reservations › Booking Summary & Add-ons

// Description:
// The final checkout step for Harbourline Villas: "Villa Maris is almost yours." A
// summary card (photo, Sat 31 Oct → Sat 7 Nov 2026, party size, price lines) carries a
// promo code field where SUMMER10 takes 10% off the nightly rate; a colour-coded
// cancellation timeline shows what you would get back at each stage; and a guest
// details form ends in "Confirm and book". Use it as the last step of a villa or
// holiday-home booking flow.

// Design:
// - Sand #f6efe6 section, deep sea #0b3954 text, white/cream #fffaf3 cards with
//   sea-tinted borders; policy colours lagoon #2a9d8f, amber #e9a23b and coral #e76f51;
//   faint wave lines along the top edge
// - Type: light (font-light) large sans heading text-4xl → lg:text-6xl with
//   wide-tracked uppercase eyebrows, mono tabular numbers for money and codes
// - lg: 2-col grid, form + timeline on the left, the 400px summary card sticky on the
//   right; below lg the summary comes first. Timeline is a vertical list at base and a
//   3-segment horizontal bar from md, with dated markers
// - Motion: promo chip and discount line slide in, total rolls, timeline selection
//   indicator glides (layoutId), success panel scales in; offsets off for reduced
//   motion

// What it does:
// - State: promo input/applied/error, guests (2–8), form fields, field errors, submit
//   status and the selected cancellation phase
// - Totals: 7 × $540 nights − 10% with SUMMER10, + $220 cleaning, 4% booking fee on
//   that subtotal, + $2 × guests × 7 nights tourist tax. Refunds per phase = (total −
//   booking fee) × 100% / 50% / 0%, recalculated live with the promo and guest count
// - Promo: case-insensitive; empty → "Enter a promo code", anything but SUMMER10 →
//   "isn't valid"; the applied chip can be removed. Form validates name, email, phone,
//   arrival time and the policy checkbox, focuses the first error, shows "Confirming…"
//   for 1 s (timer cleared on unmount) and then a success panel with a booking number
// - Links: #harbourline-house-rules and #harbourline-full-policy

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PromoPolicyBookingSummary from '@/TestComponent/PageSections/booking/BookingSummary05';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <PromoPolicyBookingSummary />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheck, HiExclamationCircle, HiMinus, HiPlus, HiTag, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const NIGHTS = 7
const RATE = 540
const CLEANING = 220
const FEE_RATE = 0.04
const TOURIST_TAX = 2
const PROMO = 'SUMMER10'
const PROMO_RATE = 0.1

const phases = [
    {
        id: 'full',
        label: 'Full refund',
        range: 'Until Thu 1 Oct',
        pct: 1,
        dot: 'bg-[#2a9d8f]',
        text: 'text-[#1f7a70]',
        width: 'md:w-[46%]',
        note: 'Cancel up to 30 days before check-in and get everything back except the booking fee.',
    },
    {
        id: 'half',
        label: '50% refund',
        range: 'Fri 2 – Sat 17 Oct',
        pct: 0.5,
        dot: 'bg-[#e9a23b]',
        text: 'text-[#a8680c]',
        width: 'md:w-[30%]',
        note: 'Between 29 and 14 days before check-in, half of the stay is refunded.',
    },
    {
        id: 'none',
        label: 'Non-refundable',
        range: 'From Sun 18 Oct',
        pct: 0,
        dot: 'bg-[#e76f51]',
        text: 'text-[#b8472c]',
        width: 'md:w-[24%]',
        note: 'Within 14 days of arrival the stay can no longer be refunded, but you can change the lead guest.',
    },
]

const arrivals = ['14:00–16:00', '16:00–18:00', '18:00–20:00', '20:00–22:00', 'After 22:00 (self check-in)']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const round2 = (n) => Math.round(n * 100) / 100

function money(n) {
    const v = round2(n)
    const [int, dec] = Math.abs(v).toFixed(2).split('.')
    return `${v < 0 ? '−' : ''}$${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`
}

function validate(form) {
    const e = {}
    if (form.name.trim().split(/\s+/).length < 2) e.name = 'Enter first and last name.'
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email, e.g. lena@example.com.'
    if (form.phone.replace(/\D/g, '').length < 8) e.phone = 'Enter a phone number with country code.'
    if (!form.arrival) e.arrival = 'Choose when you expect to arrive.'
    if (!form.agree) e.agree = 'Please accept the house rules and cancellation policy.'
    return e
}

function ErrorText({ id, message }) {
    if (!message) return null
    return (
        <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-[#b8472c]">
            <HiExclamationCircle aria-hidden="true" className="shrink-0" />
            {message}
        </p>
    )
}

const fieldCls = (error) =>
    cn(
        'mt-1.5 h-12 w-full rounded-xl border bg-[#fffaf3] px-4 text-sm text-[#0b3954] placeholder:text-[#0b3954]/35 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0b3954]',
        error ? 'border-[#e76f51]' : 'border-[#0b3954]/20',
    )

export function PromoPolicyBookingSummary({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduce = useReducedMotion()
    const [promoInput, setPromoInput] = useState('')
    const [promo, setPromo] = useState(null)
    const [promoError, setPromoError] = useState('')
    const [guests, setGuests] = useState(6)
    const [phase, setPhase] = useState('full')
    const [form, setForm] = useState({ name: '', email: '', phone: '', arrival: '', requests: '', agree: false })
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle')
    const timerRef = useRef(null)

    useEffect(() => () => clearTimeout(timerRef.current), [])

    // The success heading mounts after the form's exit animation, so focus it on mount.
    const focusOnMount = useCallback((node) => {
        if (node) node.focus()
    }, [])

    const nightsTotal = NIGHTS * RATE
    const discount = promo ? round2(nightsTotal * PROMO_RATE) : 0
    const subtotal = nightsTotal - discount + CLEANING
    const fee = round2(subtotal * FEE_RATE)
    const tax = TOURIST_TAX * guests * NIGHTS
    const total = round2(subtotal + fee + tax)
    const activePhase = phases.find((p) => p.id === phase)
    const refund = round2((total - fee) * activePhase.pct)

    const applyPromo = () => {
        const code = promoInput.trim().toUpperCase()
        if (!code) {
            setPromoError('Enter a promo code.')
            return
        }
        if (code !== PROMO) {
            setPromoError(`"${code}" isn't a valid code for these dates.`)
            return
        }
        setPromo(code)
        setPromoError('')
        setPromoInput('')
    }

    const setField = (key, value) => {
        setForm((f) => ({ ...f, [key]: value }))
        if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
    }

    const submit = (event) => {
        event.preventDefault()
        const e = validate(form)
        setErrors(e)
        const first = ['name', 'email', 'phone', 'arrival', 'agree'].find((k) => e[k])
        if (first) {
            document.getElementById(`${uid}-${first}`)?.focus()
            return
        }
        setStatus('sending')
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setStatus('done'), 1000)
    }

    const bookingNo = `HBL-${String(Math.round(total * 100)).slice(-5)}-${guests}${promo ? 'S' : 'R'}`

    const summary = (
        <aside
            aria-label="Booking summary"
            className="min-w-0 lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1 lg:self-start"
        >
            <div className="overflow-hidden rounded-[1.75rem] border border-[#0b3954]/15 bg-[#fffaf3] shadow-[0_24px_50px_-30px_rgba(11,57,84,0.45)]">
                <div className="relative aspect-[16/9] bg-[#e7dccb]">
                    <img
                        src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80"
                        alt="Villa Maris with its pool and palm trees"
                        className="h-full w-full object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-[#fffaf3]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0b3954]">
                        Hvar · Croatia
                    </span>
                </div>
                <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-semibold tracking-tight text-[#0b3954]">Villa Maris</h3>
                    <p className="mt-1 text-sm text-[#0b3954]/65">4 bedrooms · heated pool · 60 m from the water</p>
                    <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#0b3954]/15 bg-[#0b3954]/15">
                        <div className="bg-[#fffaf3] p-3">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0b3954]/55">Check-in</dt>
                            <dd className="mt-0.5 text-sm font-semibold text-[#0b3954]">Sat 31 Oct 2026</dd>
                        </div>
                        <div className="bg-[#fffaf3] p-3">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0b3954]/55">Checkout</dt>
                            <dd className="mt-0.5 text-sm font-semibold text-[#0b3954]">Sat 7 Nov 2026</dd>
                        </div>
                        <div className="col-span-2 flex items-center justify-between gap-3 bg-[#fffaf3] p-3">
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0b3954]/55">Guests</dt>
                                <dd className="mt-0.5 text-sm font-semibold text-[#0b3954]">{guests} guests · sleeps 8</dd>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    aria-label="Fewer guests"
                                    disabled={guests <= 2 || status === 'done'}
                                    className="grid h-10 w-10 place-items-center rounded-full border border-[#0b3954]/20 text-[#0b3954] hover:border-[#0b3954] focus-visible:outline-2 focus-visible:outline-[#0b3954] disabled:opacity-30"
                                    onClick={() => setGuests((g) => g - 1)}
                                >
                                    <HiMinus aria-hidden="true" />
                                </button>
                                <span aria-live="polite" className="sr-only">
                                    {guests} guests
                                </span>
                                <button
                                    type="button"
                                    aria-label="More guests"
                                    disabled={guests >= 8 || status === 'done'}
                                    className="grid h-10 w-10 place-items-center rounded-full border border-[#0b3954]/20 text-[#0b3954] hover:border-[#0b3954] focus-visible:outline-2 focus-visible:outline-[#0b3954] disabled:opacity-30"
                                    onClick={() => setGuests((g) => g + 1)}
                                >
                                    <HiPlus aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </dl>

                    <div className="mt-5">
                        <AnimatePresence mode="wait" initial={false}>
                            {promo ? (
                                <motion.div
                                    key="applied"
                                    initial={{ opacity: 0, x: reduce ? 0 : -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-[#2a9d8f] bg-[#2a9d8f]/10 px-3 py-2"
                                >
                                    <p className="flex min-w-0 items-center gap-2 text-sm text-[#0b3954]">
                                        <HiTag aria-hidden="true" className="shrink-0 text-[#2a9d8f]" />
                                        <span className="font-mono font-semibold">{promo}</span>
                                        <span className="truncate text-[#0b3954]/65">−10% nightly rate</span>
                                    </p>
                                    <button
                                        type="button"
                                        aria-label={`Remove promo code ${promo}`}
                                        disabled={status === 'done'}
                                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#0b3954] hover:bg-[#0b3954]/10 focus-visible:outline-2 focus-visible:outline-[#0b3954] disabled:opacity-30"
                                        onClick={() => setPromo(null)}
                                    >
                                        <HiXMark aria-hidden="true" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="field"
                                    noValidate
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={(event) => {
                                        event.preventDefault()
                                        applyPromo()
                                    }}
                                >
                                    <label htmlFor={`${uid}-promo`} className="text-sm font-semibold text-[#0b3954]">
                                        Promo code
                                    </label>
                                    <div className="mt-1.5 flex gap-2">
                                        <input
                                            id={`${uid}-promo`}
                                            value={promoInput}
                                            placeholder="e.g. SUMMER10"
                                            autoComplete="off"
                                            aria-invalid={Boolean(promoError)}
                                            aria-describedby={promoError ? `${uid}-promo-error` : undefined}
                                            className={cn(fieldCls(promoError), 'mt-0 min-w-0 flex-1 font-mono uppercase placeholder:font-sans placeholder:normal-case')}
                                            onChange={(event) => {
                                                setPromoInput(event.target.value)
                                                setPromoError('')
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={status === 'done'}
                                            className="h-12 shrink-0 rounded-xl bg-[#0b3954] px-5 text-sm font-semibold text-[#f6efe6] transition-colors hover:bg-[#124a6b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3954] disabled:opacity-40"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    <ErrorText id={`${uid}-promo-error`} message={promoError} />
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <dl className="mt-5 space-y-2.5 border-t border-[#0b3954]/15 pt-5">
                        <div className="flex items-start justify-between gap-3">
                            <dt className="text-sm text-[#0b3954]">
                                Nights
                                <span className="block font-mono text-[11px] text-[#0b3954]/55">
                                    {NIGHTS} × {money(RATE)}
                                </span>
                            </dt>
                            <dd className="font-mono text-sm tabular-nums text-[#0b3954]">{money(nightsTotal)}</dd>
                        </div>
                        <AnimatePresence initial={false}>
                            {promo ? (
                                <motion.div
                                    key="discount"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-start justify-between gap-3 overflow-hidden"
                                >
                                    <dt className="text-sm text-[#1f7a70]">
                                        {promo}
                                        <span className="block font-mono text-[11px] text-[#0b3954]/55">
                                            10% of {money(nightsTotal)}
                                        </span>
                                    </dt>
                                    <dd className="font-mono text-sm tabular-nums text-[#1f7a70]">{money(-discount)}</dd>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                        <div className="flex items-start justify-between gap-3">
                            <dt className="text-sm text-[#0b3954]">
                                Cleaning & linen
                                <span className="block font-mono text-[11px] text-[#0b3954]/55">One-off</span>
                            </dt>
                            <dd className="font-mono text-sm tabular-nums text-[#0b3954]">{money(CLEANING)}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                            <dt className="text-sm text-[#0b3954]">
                                Booking fee
                                <span className="block font-mono text-[11px] text-[#0b3954]/55">
                                    4% of {money(subtotal)} · non-refundable
                                </span>
                            </dt>
                            <dd className="font-mono text-sm tabular-nums text-[#0b3954]">{money(fee)}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                            <dt className="text-sm text-[#0b3954]">
                                Tourist tax
                                <span className="block font-mono text-[11px] text-[#0b3954]/55">
                                    {money(TOURIST_TAX)} × {guests} guests × {NIGHTS} nights
                                </span>
                            </dt>
                            <dd className="font-mono text-sm tabular-nums text-[#0b3954]">{money(tax)}</dd>
                        </div>
                    </dl>
                    <div className="mt-5 flex items-end justify-between gap-3 border-t-2 border-[#0b3954] pt-4">
                        <p className="text-base font-semibold text-[#0b3954]">
                            Total
                            <span className="block text-xs font-normal text-[#0b3954]/60">USD, taxes included</span>
                        </p>
                        <p aria-live="polite" className="overflow-hidden font-mono text-2xl font-semibold tabular-nums text-[#0b3954]">
                            <AnimatePresence initial={false} mode="popLayout">
                                <motion.span
                                    key={total}
                                    initial={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
                                    animate={{ y: '0%', opacity: 1 }}
                                    exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="block"
                                >
                                    {money(total)}
                                </motion.span>
                            </AnimatePresence>
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f6efe6] px-4 py-14 text-base font-normal text-[#0b3954] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full text-[#0b3954]/10"
            >
                {[20, 45, 70].map((y, i) => (
                    <path
                        key={y}
                        d={`M0 ${y} C 180 ${y - 18}, 360 ${y + 18}, 540 ${y} S 900 ${y - 18}, 1080 ${y} S 1440 ${y + 18}, 1440 ${y}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={i === 1 ? 2 : 1}
                    />
                ))}
            </svg>

            <div className="relative mx-auto max-w-6xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#0b3954]/60">
                    Harbourline Villas · Secure checkout
                </p>
                <h2 className="mt-3 max-w-3xl text-4xl font-light leading-[1.02] tracking-[-0.03em] text-[#0b3954] sm:text-5xl lg:text-6xl">
                    Villa Maris is <span className="font-semibold">almost yours.</span>
                </h2>

                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
                    {summary}

                    <div className="min-w-0 space-y-8 lg:col-start-1 lg:row-start-1">
                        <div className="rounded-[1.75rem] border border-[#0b3954]/15 bg-[#fffaf3]/60 p-5 sm:p-7">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h3 className="text-xl font-semibold tracking-tight text-[#0b3954]">Cancellation policy</h3>
                                <a
                                    href="#harbourline-full-policy"
                                    className="inline-flex min-h-10 items-center text-sm text-[#0b3954] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#0b3954]"
                                >
                                    Full policy
                                </a>
                            </div>

                            <div className="mt-6 hidden md:block" aria-hidden="true">
                                <div className="flex h-2.5 overflow-hidden rounded-full">
                                    {phases.map((p) => (
                                        <span
                                            key={p.id}
                                            className={cn('h-full transition-opacity', p.dot, p.width, phase !== p.id && 'opacity-35')}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#0b3954]/55">
                                    <span>Book today</span>
                                    <span>1 Oct</span>
                                    <span>17 Oct</span>
                                    <span>Check-in 31 Oct</span>
                                </div>
                            </div>

                            <div role="group" aria-label="Cancellation stages" className="mt-5 grid gap-2 md:grid-cols-3">
                                {phases.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        aria-pressed={phase === p.id}
                                        className={cn(
                                            'relative flex min-h-16 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3954]',
                                            phase === p.id
                                                ? 'border-[#0b3954] bg-[#fffaf3]'
                                                : 'border-[#0b3954]/15 hover:border-[#0b3954]/40',
                                        )}
                                        onClick={() => setPhase(p.id)}
                                    >
                                        {phase === p.id ? (
                                            <motion.span
                                                layoutId={`${uid}-phase`}
                                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                                                className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#0b3954]"
                                            />
                                        ) : null}
                                        <span className={cn('h-3 w-3 shrink-0 rounded-full', p.dot)} />
                                        <span className="min-w-0">
                                            <span className={cn('block text-sm font-semibold', p.text)}>{p.label}</span>
                                            <span className="block text-xs text-[#0b3954]/60">{p.range}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div aria-live="polite" className="mt-4 rounded-2xl bg-[#0b3954] p-4 text-[#f6efe6] sm:p-5">
                                <p className="text-sm leading-6 text-[#f6efe6]/80">{activePhase.note}</p>
                                <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-sm">
                                    You&apos;d get back
                                    <span className="font-mono text-xl font-semibold text-white">{money(refund)}</span>
                                    <span className="font-mono text-xs text-[#f6efe6]/60">
                                        = ({money(total)} − {money(fee)} fee) × {Math.round(activePhase.pct * 100)}%
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-[#0b3954]/15 bg-[#fffaf3] p-5 sm:p-7">
                            <AnimatePresence mode="wait" initial={false}>
                                {status === 'done' ? (
                                    <motion.div
                                        key="done"
                                        initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-6 text-center"
                                    >
                                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#2a9d8f] text-2xl text-white">
                                            <HiCheck aria-hidden="true" />
                                        </span>
                                        <h3
                                            ref={focusOnMount}
                                            tabIndex={-1}
                                            className="mt-4 text-2xl font-semibold tracking-tight text-[#0b3954] outline-none"
                                        >
                                            Villa Maris is booked.
                                        </h3>
                                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#0b3954]/70">
                                            Thanks, {form.name.trim().split(/\s+/)[0]}. Confirmation and your arrival guide are on
                                            the way to {form.email.trim()}. Total {money(total)}
                                            {promo ? ` with ${promo} applied` : ''}.
                                        </p>
                                        <p className="mt-4 inline-block rounded-full border border-dashed border-[#0b3954]/40 px-4 py-2 font-mono text-sm tracking-[0.12em] text-[#0b3954]">
                                            {bookingNo}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        noValidate
                                        exit={{ opacity: 0 }}
                                        onSubmit={submit}
                                    >
                                        <h3 className="text-xl font-semibold tracking-tight text-[#0b3954]">Lead guest</h3>
                                        <p className="mt-1 text-sm text-[#0b3954]/60">
                                            We&apos;ll send keys and directions to these details.
                                        </p>
                                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                            {[
                                                ['name', 'Full name', 'text', 'name', 'Lena Marković'],
                                                ['email', 'Email', 'email', 'email', 'lena@example.com'],
                                                ['phone', 'Phone', 'tel', 'tel', '+385 91 555 0182'],
                                            ].map(([key, label, type, auto, ph]) => (
                                                <div key={key} className={cn(key === 'name' && 'sm:col-span-2')}>
                                                    <label htmlFor={`${uid}-${key}`} className="text-sm font-semibold text-[#0b3954]">
                                                        {label}
                                                    </label>
                                                    <input
                                                        id={`${uid}-${key}`}
                                                        type={type}
                                                        autoComplete={auto}
                                                        placeholder={ph}
                                                        value={form[key]}
                                                        aria-invalid={Boolean(errors[key])}
                                                        aria-describedby={errors[key] ? `${uid}-${key}-error` : undefined}
                                                        className={fieldCls(errors[key])}
                                                        onChange={(event) => setField(key, event.target.value)}
                                                    />
                                                    <ErrorText id={`${uid}-${key}-error`} message={errors[key]} />
                                                </div>
                                            ))}
                                            <div>
                                                <label htmlFor={`${uid}-arrival`} className="text-sm font-semibold text-[#0b3954]">
                                                    Arrival time
                                                </label>
                                                <select
                                                    id={`${uid}-arrival`}
                                                    value={form.arrival}
                                                    aria-invalid={Boolean(errors.arrival)}
                                                    aria-describedby={errors.arrival ? `${uid}-arrival-error` : undefined}
                                                    className={fieldCls(errors.arrival)}
                                                    onChange={(event) => setField('arrival', event.target.value)}
                                                >
                                                    <option value="">Select a time</option>
                                                    {arrivals.map((a) => (
                                                        <option key={a} value={a}>
                                                            {a}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ErrorText id={`${uid}-arrival-error`} message={errors.arrival} />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label htmlFor={`${uid}-requests`} className="text-sm font-semibold text-[#0b3954]">
                                                    Requests <span className="font-normal text-[#0b3954]/55">(optional)</span>
                                                </label>
                                                <textarea
                                                    id={`${uid}-requests`}
                                                    rows={3}
                                                    value={form.requests}
                                                    placeholder="Cot for a toddler, boat transfer from Split…"
                                                    className="mt-1.5 w-full resize-none rounded-xl border border-[#0b3954]/20 bg-[#fffaf3] px-4 py-3 text-sm text-[#0b3954] placeholder:text-[#0b3954]/35 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0b3954]"
                                                    onChange={(event) => setField('requests', event.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#0b3954]/80">
                                            <input
                                                id={`${uid}-agree`}
                                                type="checkbox"
                                                checked={form.agree}
                                                aria-invalid={Boolean(errors.agree)}
                                                aria-describedby={errors.agree ? `${uid}-agree-error` : undefined}
                                                className="mt-0.5 h-5 w-5 shrink-0 accent-[#0b3954]"
                                                onChange={(event) => setField('agree', event.target.checked)}
                                            />
                                            <span>
                                                I agree to the{' '}
                                                <a
                                                    href="#harbourline-house-rules"
                                                    className="font-semibold text-[#0b3954] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#0b3954]"
                                                >
                                                    house rules
                                                </a>{' '}
                                                and the cancellation policy above.
                                            </span>
                                        </label>
                                        <ErrorText id={`${uid}-agree-error`} message={errors.agree} />
                                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-xs text-[#0b3954]/60">
                                                You&apos;ll pay {money(total)} today. Free cancellation until Thu 1 Oct.
                                            </p>
                                            <button
                                                type="submit"
                                                disabled={status === 'sending'}
                                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0b3954] px-7 text-sm font-semibold text-[#f6efe6] transition-colors hover:bg-[#124a6b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3954] disabled:cursor-wait disabled:opacity-80"
                                            >
                                                {status === 'sending' ? (
                                                    <>
                                                        <motion.span
                                                            aria-hidden="true"
                                                            animate={reduce ? undefined : { rotate: 360 }}
                                                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                                            className="h-4 w-4 rounded-full border-2 border-[#f6efe6]/30 border-t-[#f6efe6]"
                                                        />
                                                        Confirming…
                                                    </>
                                                ) : (
                                                    'Confirm and book'
                                                )}
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PromoPolicyBookingSummary

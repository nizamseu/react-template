// TabbedScreensFeatureBreakdown

// FeatureBreakdown03 · SaaS Platforms › Feature Breakdown

// Description:
// A tabbed walkthrough of the invoicing app Invoicely. Under the heading "Get paid in four
// clicks, not four follow-ups." a segmented tab bar (Create / Send / Track / Reconcile)
// swaps a live-looking invoice mockup for Fieldnote Studio's invoice INV-2026-0418 to
// Oakline, plus a short explanation, three bullets and a proof stat for each step. Use it
// on a features page to explain a linear workflow without a long scroll.

// Design:
// - Pale blue #eff6ff section, navy #0b1b3f headings, slate #475569 body, blue #1d4ed8
//   accent; the mockup sits on a solid blue stage with a faint white dot grid
// - Tab bar: white rounded-full segmented control; the active pill is a blue layoutId
//   element that slides between tabs; step numbers in mono
// - Panel: lg:grid-cols-[1fr_1.15fr] copy + stage; the invoice is a white rounded-2xl
//   "paper" with a status pill (Draft → Sent → Part-paid → Paid), tabular figures and
//   hairline rules
// - Motion: panels cross-fade with AnimatePresence; line items stagger in, the email card
//   slides over the invoice, the payment bar fills and matched bank lines slide in; offsets
//   are dropped for reduced motion
// - Responsive: tabs are a 4-column grid on mobile (number above label) and inline pills
//   from sm; copy stacks above the stage below lg; the stage keeps a min height so the
//   page does not jump

// What it does:
// - activeTab state (default "create") changes on click; ArrowLeft/Right, Home and End move
//   focus and selection (roving tabindex, role="tablist"/"tab"/"tabpanel", aria-selected,
//   aria-controls)
// - Totals are computed from the line items ($12,970.00 + 8% tax = $14,007.60) and reused in
//   every step; the mockups are aria-hidden with the copy describing each step
// - "Send your first invoice free" links to #invoicely-signup

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TabbedScreensFeatureBreakdown from '@/TestComponent/PageSections/saas/FeatureBreakdown03';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <TabbedScreensFeatureBreakdown />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiCheck, HiOutlineArrowsRightLeft, HiOutlineEye, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const steps = [
    {
        id: 'create',
        label: 'Create',
        title: 'A finished invoice in about 90 seconds',
        body: 'Start from your rate card or duplicate last month’s invoice. Invoicely fills in the client, currency and tax rules, so you only type what changed.',
        points: ['Line items from saved services and hourly rates', 'Tax, discounts and currency set per client', 'Recurring schedules for retainers'],
        stat: { value: '90 sec', label: 'average time from blank to ready-to-send' },
        status: { text: 'Draft', className: 'bg-slate-100 text-slate-600' },
    },
    {
        id: 'send',
        label: 'Send',
        title: 'An email your client can pay from',
        body: 'Every invoice goes out as a branded email with a pay button and the PDF attached for their accounts team. No portal, no login.',
        points: ['One-click pay page for card, ACH and SEPA', '34 currencies, converted at send time', 'Custom sender domain and signature'],
        stat: { value: '11 days', label: 'sooner paid than PDF-only invoices' },
        status: { text: 'Sent', className: 'bg-[#dbeafe] text-[#1d4ed8]' },
    },
    {
        id: 'track',
        label: 'Track',
        title: 'Know the moment it is opened',
        body: 'See when the invoice is viewed, forwarded and paid. Friendly reminders go out on your schedule, and stop the second money arrives.',
        points: ['Open, forward and payment activity', 'Reminders at 7, 14 and 30 days overdue', 'Deposits and part-payments tracked'],
        stat: { value: '64%', label: 'of late invoices settle after the first reminder' },
        status: { text: 'Part-paid', className: 'bg-amber-100 text-amber-700' },
    },
    {
        id: 'reconcile',
        label: 'Reconcile',
        title: 'Payments matched to invoices for you',
        body: 'Connect your bank and Invoicely matches incoming payments to open invoices, marks them paid and syncs the entries to your ledger.',
        points: ['Bank feeds from 11,000 institutions', 'Split and combined payments matched', 'Two-way sync with your accounting ledger'],
        stat: { value: '98.7%', label: 'of payments matched without a click' },
        status: { text: 'Paid', className: 'bg-emerald-100 text-emerald-700' },
    },
]

const lineItems = [
    { id: 'identity', name: 'Brand identity sprint', qty: '1 × $6,400', amount: 6400 },
    { id: 'web', name: 'Website design', qty: '38 h × $140', amount: 5320 },
    { id: 'illustration', name: 'Illustration pack', qty: '1 × $1,250', amount: 1250 },
]

const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
const tax = subtotal * 0.08
const total = subtotal + tax

const money = (value) =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

function Paper({ status, className, children }) {
    return (
        <div
            className={cn(
                'rounded-2xl bg-white p-4 text-[#0b1b3f] shadow-[0_24px_50px_-24px_rgba(11,27,63,0.55)] sm:p-5',
                className,
            )}
        >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0b1b3f] text-[10px] font-bold text-white">
                        FS
                    </span>
                    <div className="leading-tight">
                        <p className="text-[12px] font-semibold">Fieldnote Studio</p>
                        <p className="text-[10px] text-slate-500">Bill to Oakline</p>
                    </div>
                </div>
                <div className="text-right leading-tight">
                    <p className="font-mono text-[10px] text-slate-500">INV-2026-0418</p>
                    <span className={cn('mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold', status.className)}>
                        {status.text}
                    </span>
                </div>
            </div>
            {children}
        </div>
    )
}

function Totals() {
    return (
        <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-[11px] tabular-nums">
            <p className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
            </p>
            <p className="flex justify-between text-slate-500">
                <span>Sales tax 8%</span>
                <span>{money(tax)}</span>
            </p>
            <p className="flex justify-between pt-1 text-[13px] font-semibold text-[#0b1b3f]">
                <span>Total due Oct 27</span>
                <span>{money(total)}</span>
            </p>
        </div>
    )
}

function Mockup({ step, reduceMotion }) {
    const shift = reduceMotion ? 0 : 1

    if (step.id === 'send') {
        return (
            <div className="relative pt-12">
                <Paper status={step.status} className="absolute inset-x-0 top-0 origin-top scale-[0.92] opacity-60 blur-[0.5px]">
                    <div className="mt-3 space-y-2">
                        {lineItems.map((item) => (
                            <div key={item.id} className="h-3 rounded bg-slate-100" />
                        ))}
                    </div>
                    <Totals />
                </Paper>
                <motion.div
                    initial={{ opacity: 0, y: 40 * shift }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mx-3 rounded-2xl bg-white p-4 shadow-[0_30px_60px_-20px_rgba(11,27,63,0.6)] ring-1 ring-slate-200 sm:mx-6 sm:p-5"
                >
                    <div className="space-y-1 border-b border-slate-100 pb-3 text-[11px] text-slate-500">
                        <p className="truncate">
                            <span className="font-semibold text-[#0b1b3f]">To</span> accounts@oakline.co
                        </p>
                        <p className="truncate">
                            <span className="font-semibold text-[#0b1b3f]">Subject</span> Invoice INV-2026-0418 from
                            Fieldnote Studio
                        </p>
                    </div>
                    <p className="mt-3 text-[12px] leading-relaxed text-slate-600">
                        Hi Dana, thanks again for the sprint. Your invoice is attached, and you can pay online below.
                    </p>
                    <div className="mt-4 rounded-xl bg-[#eff6ff] p-3 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Amount due</p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0b1b3f]">{money(total)}</p>
                        <span className="mt-3 inline-flex min-h-8 items-center rounded-lg bg-[#1d4ed8] px-5 text-[12px] font-semibold text-white">
                            Pay invoice
                        </span>
                        <p className="mt-2 text-[10px] text-slate-500">Card · ACH · SEPA · Apple Pay</p>
                    </div>
                    <motion.span
                        initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.6, rotate: -14 }}
                        animate={{ opacity: 1, scale: 1, rotate: -14 }}
                        transition={{ duration: 0.4, delay: 0.55 }}
                        className="absolute -right-2 -top-4 rounded-md border-2 border-[#1d4ed8] bg-white px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#1d4ed8]"
                    >
                        Sent 9:14
                    </motion.span>
                </motion.div>
            </div>
        )
    }

    if (step.id === 'track') {
        const events = [
            { id: 'sent', text: 'Sent to accounts@oakline.co', time: 'Sep 27 · 9:14' },
            { id: 'opened', text: 'Opened twice, forwarded to Dana', time: 'Sep 27 · 11:02' },
            { id: 'paid', text: 'Part-payment received · $7,000.00', time: 'Oct 3 · 16:40' },
            { id: 'reminder', text: 'Reminder scheduled for the balance', time: 'Oct 20 · 9:00', upcoming: true },
        ]
        return (
            <Paper status={step.status}>
                <ol className="mt-4 space-y-3">
                    {events.map((event, index) => (
                        <motion.li
                            key={event.id}
                            initial={{ opacity: 0, x: -12 * shift }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35, delay: 0.1 + index * 0.1 }}
                            className="flex items-start gap-3"
                        >
                            <span
                                className={cn(
                                    'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full',
                                    event.upcoming ? 'border border-dashed border-slate-300 bg-white' : 'bg-[#1d4ed8] text-white',
                                )}
                            >
                                {!event.upcoming && (index === 1 ? <HiOutlineEye className="h-3 w-3" /> : <HiCheck className="h-3 w-3" />)}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className={cn('block text-[12px]', event.upcoming ? 'text-slate-500' : 'text-[#0b1b3f]')}>
                                    {event.text}
                                </span>
                                <span className="block text-[10px] text-slate-400">{event.time}</span>
                            </span>
                        </motion.li>
                    ))}
                </ol>
                <div className="mt-5 rounded-xl bg-[#f8fafc] p-3">
                    <div className="flex justify-between text-[11px] tabular-nums">
                        <span className="font-semibold text-[#0b1b3f]">$7,000.00 paid</span>
                        <span className="text-slate-500">$7,007.60 left</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                        <motion.div
                            className="h-full rounded-full bg-[#1d4ed8]"
                            initial={{ width: reduceMotion ? '50%' : '0%' }}
                            animate={{ width: '50%' }}
                            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </div>
                </div>
            </Paper>
        )
    }

    if (step.id === 'reconcile') {
        const bankLines = [
            { id: 'b1', memo: 'OAKLINE LLC · ACH CREDIT', date: 'Oct 3', amount: 7000 },
            { id: 'b2', memo: 'OAKLINE LLC · ACH CREDIT', date: 'Oct 21', amount: total - 7000 },
        ]
        return (
            <div className="space-y-3">
                <div className="rounded-2xl bg-white/10 p-3 text-white ring-1 ring-white/20 backdrop-blur-sm">
                    <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                        <span>Bank feed · Harbor CU ••4410</span>
                        <span>2 new</span>
                    </p>
                    <ul className="mt-2 space-y-2">
                        {bankLines.map((line, index) => (
                            <motion.li
                                key={line.id}
                                initial={{ opacity: 0, x: 24 * shift }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + index * 0.15 }}
                                className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-[#0b1b3f]"
                            >
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-mono text-[10px] text-slate-500">{line.memo}</span>
                                    <span className="block text-[12px] font-semibold tabular-nums">+{money(line.amount)}</span>
                                </span>
                                <span className="text-[10px] text-slate-400">{line.date}</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                    <HiCheck className="h-3 w-3" />
                                    Matched
                                </span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-center text-white/80">
                    <HiOutlineArrowsRightLeft className="h-5 w-5 rotate-90" />
                </div>
                <Paper status={step.status}>
                    <div className="mt-3 flex items-center justify-between text-[12px] tabular-nums">
                        <span className="text-slate-500">2 payments applied</span>
                        <span className="font-semibold">{money(total)}</span>
                    </div>
                    <p className="mt-3 rounded-lg bg-[#f8fafc] px-3 py-2 font-mono text-[10px] text-slate-500">
                        Synced to ledger · 1200 Accounts receivable → 1010 Operating cash
                    </p>
                </Paper>
            </div>
        )
    }

    return (
        <Paper status={step.status}>
            <div className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                <span>Item</span>
                <span>Amount</span>
            </div>
            <ul className="mt-2 space-y-2">
                {lineItems.map((item, index) => (
                    <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 10 * shift }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 + index * 0.12 }}
                        className="grid grid-cols-[1fr_auto] items-center gap-x-4 rounded-lg px-1 py-1"
                    >
                        <span className="min-w-0">
                            <span className="block truncate text-[12px] font-medium">{item.name}</span>
                            <span className="block text-[10px] text-slate-500">{item.qty}</span>
                        </span>
                        <span className="text-[12px] tabular-nums">{money(item.amount)}</span>
                    </motion.li>
                ))}
            </ul>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-[#1d4ed8]/40 px-2 py-2 text-[11px] font-semibold text-[#1d4ed8]"
            >
                <HiPlus className="h-3.5 w-3.5" />
                Add line item
                <span className="ml-auto font-normal text-slate-400">Autosaved</span>
            </motion.p>
            <Totals />
        </Paper>
    )
}

export function TabbedScreensFeatureBreakdown({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [activeTab, setActiveTab] = useState('create')
    const tabRefs = useRef([])
    const baseId = useId()
    const activeIndex = steps.findIndex((step) => step.id === activeTab)
    const step = steps[activeIndex]

    const onKeyDown = (event) => {
        let next = null
        if (event.key === 'ArrowRight') next = (activeIndex + 1) % steps.length
        if (event.key === 'ArrowLeft') next = (activeIndex - 1 + steps.length) % steps.length
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = steps.length - 1
        if (next === null) return
        event.preventDefault()
        setActiveTab(steps[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#eff6ff] py-16 text-base font-normal text-[#475569] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1d4ed8]">Invoicely · How it works</p>
                    <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[#0b1b3f] sm:text-5xl lg:text-6xl">
                        Get paid in four clicks, <span className="text-[#1d4ed8]">not four follow-ups.</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed md:text-lg">
                        31,000 freelancers and studios bill with Invoicely. Here is the whole journey of one
                        invoice, from draft to reconciled.
                    </p>
                </div>

                <div
                    role="tablist"
                    aria-label="Invoice workflow steps"
                    className="mx-auto mt-10 grid max-w-2xl grid-cols-4 gap-1 rounded-3xl bg-white p-1.5 shadow-[0_10px_30px_-18px_rgba(29,78,216,0.5)] ring-1 ring-[#1d4ed8]/10 sm:flex sm:rounded-full md:mt-12"
                >
                    {steps.map((item, index) => {
                        const selected = item.id === activeTab
                        return (
                            <button
                                key={item.id}
                                ref={(node) => {
                                    tabRefs.current[index] = node
                                }}
                                id={`${baseId}-tab-${item.id}`}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                aria-controls={`${baseId}-panel`}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => setActiveTab(item.id)}
                                onKeyDown={onKeyDown}
                                className={cn(
                                    'relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8] sm:flex-1 sm:flex-row sm:gap-2 sm:rounded-full sm:text-sm',
                                    selected ? 'text-white' : 'text-[#475569] hover:text-[#0b1b3f]',
                                )}
                            >
                                {selected && (
                                    <motion.span
                                        layoutId={`${baseId}-pill`}
                                        className="absolute inset-0 rounded-[1.25rem] bg-[#1d4ed8] sm:rounded-full"
                                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                    />
                                )}
                                <span className={cn('relative font-mono text-[10px]', selected ? 'text-white/70' : 'text-[#1d4ed8]')}>
                                    0{index + 1}
                                </span>
                                <span className="relative">{item.label}</span>
                            </button>
                        )
                    })}
                </div>

                <div
                    id={`${baseId}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${baseId}-tab-${step.id}`}
                    className="mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="font-mono text-xs font-semibold text-[#1d4ed8]">
                                Step {activeIndex + 1} of {steps.length}
                            </p>
                            <h3 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-[#0b1b3f] sm:text-4xl">
                                {step.title}
                            </h3>
                            <p className="mt-4 max-w-lg text-base leading-relaxed">{step.body}</p>
                            <ul className="mt-6 space-y-3">
                                {step.points.map((point) => (
                                    <li key={point} className="flex items-start gap-3 text-sm text-[#0b1b3f]">
                                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1d4ed8] text-white">
                                            <HiCheck className="h-3 w-3" aria-hidden="true" />
                                        </span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-[#1d4ed8]/10">
                                <span className="text-3xl font-bold tracking-tight text-[#1d4ed8]">{step.stat.value}</span>
                                <span className="text-sm leading-snug">{step.stat.label}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div
                        aria-hidden="true"
                        className="relative flex min-h-[27rem] items-center rounded-[2rem] bg-[#1d4ed8] p-4 sm:min-h-[29rem] sm:p-10"
                    >
                        <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:16px_16px]" />
                        <div className="relative mx-auto w-full max-w-md">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Mockup step={step} reduceMotion={reduceMotion} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-center md:mt-16">
                    <a
                        href="#invoicely-signup"
                        className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0b1b3f] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                    >
                        Send your first invoice free
                        <HiArrowLongRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default TabbedScreensFeatureBreakdown

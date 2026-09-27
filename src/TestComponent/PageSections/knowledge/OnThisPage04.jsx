// NumberedStepsOnThisPage

// OnThisPage04 · Knowledge Bases & Documentation › On-This-Page Navigation

// Description:
// A Payloop Support how-to, "Connect Payloop to your accounting software", laid out as
// six numbered steps inside a scrolling paper-like article box. A numbered rail (01–06)
// runs beside it with a vertical green line that fills down to the step being read; on
// smaller screens the rail turns into a horizontal stepper with the current step title.
// Use it for procedural guides where the order of sections matters.

// Design:
// - Cream #fdfaf3 page, ink #1c1917 text, green #15803d accent; serif headings and step
//   numbers, mono "Step 0x" labels; the article box is #fffdf8 with a 1px #e7e0cf
//   border
// - Rail (lg): 44px numbered discs on a #e7e0cf track; the green fill scales to the
//   active step (spring, instant for reduced motion); done steps turn solid green, the
//   active one gets a green ring, upcoming ones stay outlined; a time-left note sits
//   underneath
// - Below lg: six 40px discs spaced across the width with a horizontal track and fill,
//   and "Step 3 of 6 · Authorise the connection" underneath
// - Article parts built in markup: ledger picker cards, a consent mock, an account
//   mapping table, a sync progress card and a reconcile checklist
// - Box height 460px → sm:520px → lg:600px; title text-3xl → sm:4xl → lg:5xl (serif)

// What it does:
// - IntersectionObserver rooted on the box (rootMargin -75% bottom) plus a debounced
//   scroll-end check choose the active step (last heading above the 25% line; last at
//   the bottom); the fill, disc states and minutes left follow it
// - Discs are #hash links (aria-current="step" on the active one); clicking
//   smooth-scrolls the box to that step and focuses its heading (instant for reduced
//   motion)
// - Ledger cards, the consent mock and the sync card are visual only; the FAQ link is a
//   #hash anchor (#payloop-accounting-faq)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NumberedStepsOnThisPage from '@/TestComponent/PageSections/knowledge/OnThisPage04';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <NumberedStepsOnThisPage />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiCheck, HiOutlineArrowsRightLeft, HiOutlineLockClosed } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const STEPS = [
    { id: 'requirements', label: 'Check requirements', minutes: 1 },
    { id: 'ledger', label: 'Choose your ledger', minutes: 1 },
    { id: 'authorise', label: 'Authorise the connection', minutes: 2 },
    { id: 'map', label: 'Map your accounts', minutes: 4 },
    { id: 'sync', label: 'Run the first sync', minutes: 2 },
    { id: 'reconcile', label: 'Review and reconcile', minutes: 3 },
]

const SPY_IDS = STEPS.map((step) => step.id)

const LEDGERS = [
    { name: 'Ledgerly', note: 'Two-way sync', mark: 'L', picked: true },
    { name: 'Booksmith', note: 'Two-way sync', mark: 'B' },
    { name: 'Tallyhouse', note: 'Export only', mark: 'T' },
    { name: 'CSV', note: 'Any software', mark: '⋯' },
]

const MAPPING = [
    ['Sales', '4000 · Revenue'],
    ['Processing fees', '6120 · Payment fees'],
    ['Refunds', '4010 · Sales returns'],
    ['Payouts', '1010 · Business checking'],
]

function useScrollSpy(ids, reduceMotion) {
    const boxRef = useRef(null)
    const headingRefs = useRef({})
    const lockRef = useRef(0)
    const [active, setActive] = useState(ids[0])

    useEffect(() => {
        const root = boxRef.current
        if (!root) return undefined

        const compute = () => {
            const line = root.getBoundingClientRect().top + root.clientHeight * 0.25
            let current = ids[0]
            ids.forEach((id) => {
                const el = headingRefs.current[id]
                if (el && el.getBoundingClientRect().top <= line) current = id
            })
            if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4) current = ids[ids.length - 1]
            setActive(current)
        }

        let observer = null
        if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
                () => {
                    if (Date.now() > lockRef.current) compute()
                },
                { root, rootMargin: '0px 0px -75% 0px', threshold: [0, 1] },
            )
            ids.forEach((id) => headingRefs.current[id] && observer.observe(headingRefs.current[id]))
        }

        let idle = null
        const onScroll = () => {
            clearTimeout(idle)
            idle = setTimeout(() => {
                if (Date.now() < lockRef.current) {
                    lockRef.current = 0
                    return
                }
                compute()
            }, 140)
        }
        root.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            observer?.disconnect()
            root.removeEventListener('scroll', onScroll)
            clearTimeout(idle)
        }
    }, [ids])

    const jump = (id) => {
        const root = boxRef.current
        const el = headingRefs.current[id]
        if (!root || !el) return
        const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 52
        lockRef.current = Date.now() + 1500
        root.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' })
        setActive(id)
        el.focus({ preventScroll: true })
    }

    return { boxRef, headingRefs, active, jump }
}

export function NumberedStepsOnThisPage({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const { boxRef, headingRefs, active, jump } = useScrollSpy(SPY_IDS, reduceMotion)
    const activeIndex = SPY_IDS.indexOf(active)
    const ratio = activeIndex / (STEPS.length - 1)
    const minutesLeft = STEPS.slice(activeIndex).reduce((sum, step) => sum + step.minutes, 0)
    const fillTransition = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 22 }

    const hid = (id) => `${uid}-${id}`
    const headingProps = (id) => ({
        id: hid(id),
        ref: (el) => {
            headingRefs.current[id] = el
        },
        tabIndex: -1,
    })
    const onLink = (event, id) => {
        event.preventDefault()
        jump(id)
    }
    const stateOf = (i) => (i < activeIndex ? 'done' : i === activeIndex ? 'current' : 'next')
    const discClass = (state) =>
        cn(
            'relative z-10 grid shrink-0 place-items-center rounded-full font-serif transition-colors duration-300',
            state === 'done' && 'bg-[#15803d] text-[#fdfaf3]',
            state === 'current' && 'bg-[#fdfaf3] text-[#15803d] ring-2 ring-[#15803d] ring-offset-4 ring-offset-[#fdfaf3]',
            state === 'next' && 'border border-[#d6ccb4] bg-[#fdfaf3] text-[#a8a29e]',
        )

    const stepLabel = 'font-mono text-[11px] uppercase tracking-[0.22em] text-[#15803d]'
    const h3 = 'mt-2 scroll-mt-6 font-serif text-[26px] font-normal leading-tight tracking-tight text-[#1c1917] outline-none sm:text-3xl'
    const p = 'text-[16px] leading-7 text-[#44403c]'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-[#fdfaf3] px-4 py-16 text-base font-normal text-[#1c1917] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 border-b border-[#1c1917] pb-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#15803d]">
                            <span aria-hidden="true" className="h-px w-10 bg-[#15803d]" />
                            Payloop Support · Integrations
                        </p>
                        <h2 className="mt-5 font-serif text-3xl font-normal leading-[1.05] tracking-tight text-[#1c1917] sm:text-4xl lg:text-5xl">
                            Connect Payloop to your <em className="text-[#15803d]">accounting software</em>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-6 text-[#57534e]">
                        Six steps, about 13 minutes. You will need admin access to both Payloop and your ledger.
                    </p>
                </div>

                <nav aria-label="Steps, compact" className="mt-8 lg:hidden">
                    <div className="relative">
                        <span aria-hidden="true" className="absolute inset-x-5 top-1/2 h-0.5 -translate-y-1/2 bg-[#e7e0cf]" />
                        <motion.span
                            aria-hidden="true"
                            className="absolute left-5 right-5 top-1/2 h-0.5 origin-left -translate-y-1/2 bg-[#15803d]"
                            initial={false}
                            animate={{ scaleX: ratio }}
                            transition={fillTransition}
                        />
                        <ol className="relative flex items-center justify-between">
                            {STEPS.map((step, i) => {
                                const state = stateOf(i)
                                return (
                                    <li key={step.id} className="relative">
                                        <a
                                            href={`#${hid(step.id)}`}
                                            aria-label={`Step ${i + 1}: ${step.label}`}
                                            aria-current={state === 'current' ? 'step' : undefined}
                                            className={cn(
                                                discClass(state),
                                                'size-10 text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803d]',
                                            )}
                                            onClick={(event) => onLink(event, step.id)}
                                        >
                                            {state === 'done' ? <HiCheck aria-hidden="true" className="size-4" /> : i + 1}
                                        </a>
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                    <p className="mt-4 text-sm text-[#57534e]">
                        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#15803d]">
                            Step {activeIndex + 1} of {STEPS.length}
                        </span>
                        <span className="mx-2 text-[#d6ccb4]">·</span>
                        <span className="font-serif text-lg text-[#1c1917]">{STEPS[activeIndex].label}</span>
                    </p>
                </nav>

                <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
                    <div className="relative min-w-0 overflow-hidden rounded-[26px] border border-[#e7e0cf] bg-[#fffdf8] shadow-[0_1px_0_#e7e0cf,0_30px_60px_-40px_rgba(28,25,23,0.35)]">
                        <div
                            ref={boxRef}
                            role="region"
                            aria-label="Article: Connect Payloop to your accounting software"
                            tabIndex={0}
                            className="h-[460px] overflow-y-auto overscroll-y-contain px-5 py-8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#15803d] sm:h-[520px] sm:px-10 lg:h-[600px]"
                        >
                            <article className="mx-auto max-w-2xl space-y-5">
                                <p className="font-serif text-xl leading-8 text-[#292524]">
                                    Once connected, every sale, fee, refund and payout lands in your books automatically —
                                    matched to the right account, ready to reconcile.
                                </p>

                                <div className="pt-4">
                                    <p className={stepLabel}>Step 01</p>
                                    <h3 {...headingProps('requirements')} className={h3}>
                                        Check requirements
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {[
                                        'Payloop Growth plan or higher',
                                        'Admin access to your accounting software',
                                        'The same base currency in both tools (USD, EUR or GBP)',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-[15.5px] leading-7 text-[#44403c]">
                                            <span className="mt-1.5 grid size-5 shrink-0 place-items-center rounded-full border border-[#15803d] text-[#15803d]">
                                                <HiCheck aria-hidden="true" className="size-3" />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-8">
                                    <p className={stepLabel}>Step 02</p>
                                    <h3 {...headingProps('ledger')} className={h3}>
                                        Choose your ledger
                                    </h3>
                                </div>
                                <p className={p}>
                                    Go to Settings → Integrations → Accounting and pick your software. Two-way sync also
                                    pulls invoice payments back from your ledger.
                                </p>
                                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {LEDGERS.map((ledger) => (
                                        <li
                                            key={ledger.name}
                                            className={cn(
                                                'rounded-2xl border p-3 text-center',
                                                ledger.picked ? 'border-[#15803d] bg-[#f0fdf4]' : 'border-[#e7e0cf] bg-white',
                                            )}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'mx-auto grid size-9 place-items-center rounded-xl font-serif text-lg',
                                                    ledger.picked ? 'bg-[#15803d] text-white' : 'bg-[#f5efe1] text-[#57534e]',
                                                )}
                                            >
                                                {ledger.mark}
                                            </span>
                                            <span className="mt-2 block text-sm font-semibold text-[#1c1917]">{ledger.name}</span>
                                            <span className="text-xs text-[#78716c]">{ledger.note}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-8">
                                    <p className={stepLabel}>Step 03</p>
                                    <h3 {...headingProps('authorise')} className={h3}>
                                        Authorise the connection
                                    </h3>
                                </div>
                                <p className={p}>
                                    You are sent to Ledgerly to approve access. Payloop asks for permission to create
                                    journal entries and read your chart of accounts — nothing else.
                                </p>
                                <div className="rounded-2xl border border-[#e7e0cf] bg-white p-4 sm:p-5">
                                    <div className="flex items-center justify-center gap-3 text-[#57534e]">
                                        <span className="grid size-10 place-items-center rounded-xl bg-[#15803d] font-serif text-lg text-white">
                                            P
                                        </span>
                                        <HiOutlineArrowsRightLeft aria-hidden="true" className="size-5" />
                                        <span className="grid size-10 place-items-center rounded-xl bg-[#1c1917] font-serif text-lg text-white">
                                            L
                                        </span>
                                    </div>
                                    <p className="mt-3 text-center text-sm font-semibold text-[#1c1917]">
                                        Payloop wants to access Northwind Studio Ltd
                                    </p>
                                    <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-[#78716c]">
                                        <HiOutlineLockClosed aria-hidden="true" className="size-3.5" />
                                        Read accounts · Write journal entries
                                    </p>
                                </div>

                                <div className="pt-8">
                                    <p className={stepLabel}>Step 04</p>
                                    <h3 {...headingProps('map')} className={h3}>
                                        Map your accounts
                                    </h3>
                                </div>
                                <p className={p}>
                                    Tell Payloop where each kind of money should go. We suggest accounts based on their
                                    names; check each one before you continue.
                                </p>
                                <div className="overflow-hidden rounded-2xl border border-[#e7e0cf] bg-white">
                                    {MAPPING.map(([from, to]) => (
                                        <div
                                            key={from}
                                            className="flex flex-col gap-1 border-b border-[#f1ebdd] px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <span className="text-sm font-semibold text-[#1c1917]">{from}</span>
                                            <span className="flex items-center gap-2 font-mono text-[13px] text-[#15803d]">
                                                <HiArrowRight aria-hidden="true" className="size-3.5 text-[#a8a29e]" />
                                                {to}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8">
                                    <p className={stepLabel}>Step 05</p>
                                    <h3 {...headingProps('sync')} className={h3}>
                                        Run the first sync
                                    </h3>
                                </div>
                                <p className={p}>
                                    Choose a start date — usually the first day of your current financial quarter — and
                                    press Start sync. Large histories run in the background; we email you when it is done.
                                </p>
                                <div className="rounded-2xl bg-[#1c1917] p-5 text-[#fdfaf3]">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <p className="text-sm font-semibold">Syncing from Jul 1, 2026</p>
                                        <p className="font-mono text-xs text-[#86efac]">822 / 1,284</p>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                                        <div className="h-full w-[64%] rounded-full bg-[#22c55e]" />
                                    </div>
                                    <p className="mt-2 text-xs text-[#a8a29e]">About 3 minutes left</p>
                                </div>

                                <div className="pt-8">
                                    <p className={stepLabel}>Step 06</p>
                                    <h3 {...headingProps('reconcile')} className={h3}>
                                        Review and reconcile
                                    </h3>
                                </div>
                                <p className={p}>
                                    Each payout arrives in your ledger as one bank deposit, with sales and fees broken out
                                    underneath, so it matches your bank feed line for line.
                                </p>
                                <ul className="space-y-2">
                                    {[
                                        'Match the latest payout to your bank feed',
                                        'Confirm fees landed in 6120 · Payment fees',
                                        'Turn on daily sync in Settings',
                                    ].map((item, i) => (
                                        <li key={item} className="flex items-center gap-3 rounded-xl bg-[#f5efe1] px-4 py-3 text-[15px] text-[#292524]">
                                            <span className="font-serif text-lg text-[#15803d]">{i + 1}.</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="pb-44 pt-8">
                                    <a
                                        href="#payloop-accounting-faq"
                                        className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803d]"
                                    >
                                        <span className="border-b border-[#15803d]/40 pb-0.5 group-hover:border-[#15803d]">
                                            Accounting integration FAQ
                                        </span>
                                        <HiArrowRight
                                            aria-hidden="true"
                                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </a>
                                </div>
                            </article>
                        </div>
                    </div>

                    <aside className="hidden lg:block">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#78716c]">In this guide</p>
                        <nav aria-label="Steps" className="relative mt-5">
                            <span aria-hidden="true" className="absolute bottom-[22px] left-[21px] top-[22px] w-0.5 bg-[#e7e0cf]" />
                            <span aria-hidden="true" className="absolute bottom-[22px] left-[21px] top-[22px] w-0.5">
                                <motion.span
                                    className="block h-full w-full origin-top bg-[#15803d]"
                                    initial={false}
                                    animate={{ scaleY: ratio }}
                                    transition={fillTransition}
                                />
                            </span>
                            <ol className="relative space-y-3">
                                {STEPS.map((step, i) => {
                                    const state = stateOf(i)
                                    return (
                                        <li key={step.id}>
                                            <a
                                                href={`#${hid(step.id)}`}
                                                aria-current={state === 'current' ? 'step' : undefined}
                                                className="group flex min-h-11 items-center gap-4 rounded-full pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803d]"
                                                onClick={(event) => onLink(event, step.id)}
                                            >
                                                <span className={cn(discClass(state), 'size-11 text-lg')}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'text-sm leading-snug transition-colors',
                                                        state === 'current' && 'font-semibold text-[#1c1917]',
                                                        state === 'done' && 'text-[#57534e] group-hover:text-[#1c1917]',
                                                        state === 'next' && 'text-[#a8a29e] group-hover:text-[#57534e]',
                                                    )}
                                                >
                                                    {step.label}
                                                    <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#a8a29e]">
                                                        {step.minutes} min
                                                    </span>
                                                </span>
                                            </a>
                                        </li>
                                    )
                                })}
                            </ol>
                        </nav>
                        <p className="mt-8 border-t border-[#e7e0cf] pt-4 text-sm text-[#57534e]">
                            <span className="font-serif text-2xl text-[#1c1917]">{minutesLeft} min</span> left in this guide
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default NumberedStepsOnThisPage

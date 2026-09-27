// ProgressRingOnThisPage

// OnThisPage02 · Knowledge Bases & Documentation › On-This-Page Navigation

// Description:
// A Nimbus Developer Hub guide, "Receive webhooks you can trust", whose article scrolls
// in a dark framed box next to an "On this page" panel. A cyan reading-progress ring
// fills as the box scrolls ("42% read · About 4 min left") and the seven headings (How
// webhooks work → Go live) show passed / current / upcoming states. Use it on long
// guides where readers like to see how far they have come.

// Design:
// - Navy #0f172a page with a cyan #22d3ee glow; the article box is #0b1222 with a 1px
//   white/10 border, slate #cbd5e1 body text, white headings and cyan inline code
// - Progress ring: 120px SVG, #1e293b track, cyan→sky gradient stroke (ids from useId)
//   driven by a spring motion value; percentage and minutes left in the centre / below
// - Heading list markers: passed = filled cyan check, current = cyan ring with a
//   glowing dot, upcoming = hollow slate circle, joined by a thin vertical rule
// - Below lg the panel collapses into a bar above the box: 44px ring, "Section 3 of 7"
//   and the current title, plus a "Sections" button that expands the full list
// - Box height 460px → sm:520px → lg:600px; title text-3xl → sm:4xl → lg:5xl

// What it does:
// - Box scroll updates a motion value (ring) and a rounded percentage (text); minutes
//   left = 7 × (1 − progress), rounded up
// - An IntersectionObserver rooted on the box (rootMargin -75% bottom) plus a debounced
//   scroll-end check set the active heading (last one above the 25% line; last at
//   bottom)
// - Heading links (#hash, click intercepted) smooth-scroll the box and focus the
//   heading (instant for reduced motion); the mobile "Sections" disclosure closes after
//   a jump

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ProgressRingOnThisPage from '@/TestComponent/PageSections/knowledge/OnThisPage02';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <ProgressRingOnThisPage />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { HiCheck, HiChevronDown, HiOutlineBolt, HiOutlineInformationCircle } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const TOTAL_MIN = 7

const TOC = [
    { id: 'how', label: 'How webhooks work' },
    { id: 'register', label: 'Register an endpoint' },
    { id: 'verify', label: 'Verify signatures' },
    { id: 'retries', label: 'Handle retries' },
    { id: 'events', label: 'Event types' },
    { id: 'local', label: 'Test locally' },
    { id: 'live', label: 'Go live' },
]

const SPY_IDS = TOC.map((item) => item.id)

const EVENTS = [
    ['payment.succeeded', 'A charge settled'],
    ['payment.failed', 'The issuer declined'],
    ['refund.created', 'You refunded a payment'],
    ['payout.paid', 'Funds reached your bank'],
    ['dispute.opened', 'A customer disputed a charge'],
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
        const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 20
        lockRef.current = Date.now() + 1500
        root.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' })
        setActive(id)
        el.focus({ preventScroll: true })
    }

    return { boxRef, headingRefs, active, jump }
}

function Ring({ progress, size, stroke, gradientId, children }) {
    const r = (size - stroke) / 2
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                </defs>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    style={{ pathLength: progress }}
                    className="drop-shadow-[0_0_6px_rgba(34,211,238,0.55)]"
                />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
        </div>
    )
}

function Marker({ state }) {
    if (state === 'passed')
        return (
            <span className="relative z-10 grid size-5 shrink-0 place-items-center rounded-full bg-[#22d3ee] text-[#083344]">
                <HiCheck aria-hidden="true" className="size-3" />
            </span>
        )
    if (state === 'current')
        return (
            <span className="relative z-10 grid size-5 shrink-0 place-items-center rounded-full border-2 border-[#22d3ee] bg-[#0f172a]">
                <span className="size-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]" />
            </span>
        )
    return <span className="relative z-10 size-5 shrink-0 rounded-full border-2 border-[#334155] bg-[#0f172a]" />
}

export function ProgressRingOnThisPage({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const gid = `ring-${uid.replace(/[^\w-]/g, '')}`
    const reduceMotion = useReducedMotion()
    const { boxRef, headingRefs, active, jump } = useScrollSpy(SPY_IDS, reduceMotion)
    const progress = useMotionValue(0)
    const smooth = useSpring(progress, { stiffness: 160, damping: 28, restDelta: 0.001 })
    const [pct, setPct] = useState(0)
    const [listOpen, setListOpen] = useState(false)
    const activeIndex = SPY_IDS.indexOf(active)
    const minutesLeft = Math.max(0, Math.ceil(TOTAL_MIN * (1 - pct / 100)))

    useEffect(() => {
        const root = boxRef.current
        if (!root) return undefined
        const onScroll = () => {
            const max = root.scrollHeight - root.clientHeight
            const value = max > 0 ? Math.min(1, root.scrollTop / max) : 0
            progress.set(value)
            setPct(Math.round(value * 100))
        }
        onScroll()
        root.addEventListener('scroll', onScroll, { passive: true })
        return () => root.removeEventListener('scroll', onScroll)
    }, [boxRef, progress])

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
        setListOpen(false)
    }
    const stateOf = (i) => (i < activeIndex ? 'passed' : i === activeIndex ? 'current' : 'upcoming')

    const headingList = (compact) => (
        <div className="relative">
            <span aria-hidden="true" className="absolute bottom-5 left-[9.5px] top-5 w-px bg-[#1e293b]" />
            <ul className="relative space-y-0.5">
                {TOC.map((item, i) => {
                    const state = stateOf(i)
                    return (
                        <li key={item.id}>
                            <a
                                href={`#${hid(item.id)}`}
                                aria-current={state === 'current' ? 'location' : undefined}
                                className={cn(
                                    'flex min-h-10 items-center gap-3 rounded-lg pr-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]',
                                    state === 'current' && 'font-semibold text-white',
                                    state === 'passed' && 'text-[#94a3b8] hover:text-white',
                                    state === 'upcoming' && 'text-[#64748b] hover:text-[#cbd5e1]',
                                    compact && 'min-h-11',
                                )}
                                onClick={(event) => onLink(event, item.id)}
                            >
                                <Marker state={state} />
                                {item.label}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )

    const h3 = 'scroll-mt-6 text-2xl font-semibold tracking-[-0.02em] text-white outline-none sm:text-[26px]'
    const p = 'text-[15.5px] leading-7 text-[#cbd5e1]'
    const code = 'rounded bg-[#22d3ee]/10 px-1.5 py-0.5 font-mono text-[0.86em] text-[#67e8f9]'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-[#0f172a] px-4 py-16 text-base font-normal text-[#e2e8f0] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-1/3 size-[32rem] rounded-full bg-[#22d3ee]/10 blur-3xl"
            />
            <div className="relative mx-auto max-w-6xl">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#22d3ee]">
                    Nimbus Developer Hub · Guides · Webhooks
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                    Receive webhooks you can trust
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-[#94a3b8]">
                    {['7 min read', 'Intermediate', 'Updated Sep 20, 2026'].map((chip) => (
                        <li key={chip} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                            {chip}
                        </li>
                    ))}
                </ul>

                <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b1222] lg:hidden">
                    <div className="flex items-center gap-3 p-3">
                        <Ring progress={smooth} size={44} stroke={4} gradientId={`${gid}-sm`}>
                            <span className="font-mono text-[10px] font-semibold tabular-nums text-white">{pct}</span>
                        </Ring>
                        <div className="min-w-0 flex-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#64748b]">
                                Section {activeIndex + 1} of {TOC.length}
                            </p>
                            <p className="truncate text-sm font-semibold text-white">{TOC[activeIndex].label}</p>
                        </div>
                        <button
                            type="button"
                            aria-expanded={listOpen}
                            aria-controls={`${uid}-mobile-list`}
                            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-white/10 px-3 text-xs font-semibold text-[#e2e8f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                            onClick={() => setListOpen((v) => !v)}
                        >
                            Sections
                            <HiChevronDown
                                aria-hidden="true"
                                className={cn('size-4 transition-transform duration-300', listOpen && 'rotate-180')}
                            />
                        </button>
                    </div>
                    <AnimatePresence initial={false}>
                        {listOpen && (
                            <motion.nav
                                id={`${uid}-mobile-list`}
                                aria-label="On this page, compact"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="border-t border-white/10 px-3 py-2">{headingList(true)}</div>
                            </motion.nav>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-4 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
                    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0b1222]">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-linear-to-t from-[#0b1222] to-transparent"
                        />
                        <div
                            ref={boxRef}
                            role="region"
                            aria-label="Article: Receive webhooks you can trust"
                            tabIndex={0}
                            className="h-[460px] overflow-y-auto overscroll-y-contain px-5 py-8 [scrollbar-color:#334155_transparent] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#22d3ee] sm:h-[520px] sm:px-10 lg:h-[600px]"
                        >
                            <article className="mx-auto max-w-2xl space-y-5">
                                <p className="text-lg leading-8 text-[#e2e8f0]">
                                    Webhooks push events to your server the moment they happen, so you never poll for a
                                    payment status again. This guide takes you from an empty route to a verified,
                                    retry-safe endpoint.
                                </p>

                                <h3 {...headingProps('how')} className={cn(h3, 'pt-4')}>
                                    How webhooks work
                                </h3>
                                <p className={p}>
                                    When something changes in your account, Nimbus sends an HTTPS <code className={code}>POST</code>{' '}
                                    with a JSON event to every endpoint subscribed to that event type. Your server answers
                                    with any <code className={code}>2xx</code> within 10 seconds to acknowledge it.
                                </p>
                                <ol className="grid gap-2 sm:grid-cols-3">
                                    {['Event happens', 'Nimbus signs & sends', 'You verify & ack'].map((stepLabel, i) => (
                                        <li
                                            key={stepLabel}
                                            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-[#cbd5e1]"
                                        >
                                            <span className="font-mono text-xs text-[#22d3ee]">0{i + 1}</span>
                                            <span className="mt-1 block font-semibold text-white">{stepLabel}</span>
                                        </li>
                                    ))}
                                </ol>

                                <h3 {...headingProps('register')} className={cn(h3, 'pt-6')}>
                                    Register an endpoint
                                </h3>
                                <p className={p}>
                                    In the dashboard open Developers → Webhooks → Add endpoint. Enter a public HTTPS URL such
                                    as <code className={code}>https://api.acme.io/hooks/nimbus</code> and pick only the events
                                    you handle — fewer events means less noise and fewer retries.
                                </p>
                                <p className={p}>
                                    Each endpoint gets its own signing secret, prefixed <code className={code}>whsec_</code>.
                                    Store it in your secret manager next to your API key.
                                </p>

                                <h3 {...headingProps('verify')} className={cn(h3, 'pt-6')}>
                                    Verify signatures
                                </h3>
                                <p className={p}>
                                    Every request carries a <code className={code}>Nimbus-Signature</code> header with a
                                    timestamp and an HMAC-SHA256 of <code className={code}>timestamp.body</code>. Recompute it
                                    with your secret over the raw body — before any JSON parsing — and compare in constant
                                    time.
                                </p>
                                <div className="flex gap-3 rounded-2xl border border-[#22d3ee]/25 bg-[#22d3ee]/[0.06] p-4">
                                    <HiOutlineInformationCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#22d3ee]" />
                                    <p className="text-sm leading-6 text-[#cffafe]">
                                        Reject events older than five minutes. Together with the signature this blocks replay
                                        attacks.
                                    </p>
                                </div>

                                <h3 {...headingProps('retries')} className={cn(h3, 'pt-6')}>
                                    Handle retries
                                </h3>
                                <p className={p}>
                                    If your endpoint times out or returns an error, Nimbus retries with exponential back-off
                                    for up to three days: after 1 minute, 5 minutes, 30 minutes, then hourly.
                                </p>
                                <p className={p}>
                                    Retries mean the same event can arrive twice. Record each event <code className={code}>id</code>{' '}
                                    and skip ones you have already processed, and answer quickly — queue slow work instead of
                                    doing it inside the request.
                                </p>

                                <h3 {...headingProps('events')} className={cn(h3, 'pt-6')}>
                                    Event types
                                </h3>
                                <ul className="divide-y divide-white/[0.06] rounded-2xl border border-white/10">
                                    {EVENTS.map(([name, text]) => (
                                        <li key={name} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                            <code className="font-mono text-[13px] text-[#67e8f9]">{name}</code>
                                            <span className="text-sm text-[#94a3b8]">{text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <h3 {...headingProps('local')} className={cn(h3, 'pt-6')}>
                                    Test locally
                                </h3>
                                <p className={p}>
                                    Run <code className={code}>nimbus listen --forward localhost:3000/hooks</code> to tunnel
                                    test-mode events to your laptop, then trigger one with{' '}
                                    <code className={code}>nimbus trigger payment.succeeded</code>. The CLI prints each
                                    delivery and your response code.
                                </p>
                                <p className={p}>
                                    The CLI uses a temporary signing secret — copy it from the first line of output into your
                                    local environment.
                                </p>

                                <h3 {...headingProps('live')} className={cn(h3, 'pt-6')}>
                                    Go live
                                </h3>
                                <ul className="space-y-2">
                                    {[
                                        'Endpoint uses HTTPS with a valid certificate',
                                        'Signatures and timestamps are verified',
                                        'Duplicate event ids are ignored',
                                        'Slow work is queued, the response stays under 10 s',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-[15px] leading-6 text-[#cbd5e1]">
                                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-[#22d3ee]/15 text-[#22d3ee]">
                                                <HiCheck aria-hidden="true" className="size-3.5" />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className={p}>
                                    Then switch the endpoint to live mode in the dashboard. Nimbus sends a{' '}
                                    <code className={code}>ping</code> event to confirm everything is wired up.
                                </p>
                                <div className="pb-48 pt-8">
                                    <p className="flex items-center justify-center gap-2 border-t border-white/10 pt-6 text-xs text-[#64748b]">
                                        <HiOutlineBolt aria-hidden="true" className="size-4 text-[#22d3ee]" />
                                        You made it to the end. Next up: idempotent requests.
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>

                    <aside className="hidden lg:block">
                        <div className="rounded-3xl border border-white/10 bg-[#0b1222]/80 p-6">
                            <div className="flex items-center gap-5">
                                <Ring progress={smooth} size={120} stroke={8} gradientId={`${gid}-lg`}>
                                    <span>
                                        <span className="block text-3xl font-semibold tabular-nums tracking-tight text-white">
                                            {pct}
                                            <span className="text-base text-[#64748b]">%</span>
                                        </span>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#64748b]">read</span>
                                    </span>
                                </Ring>
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {pct >= 100 ? 'All done' : `About ${minutesLeft} min left`}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-[#64748b]">
                                        {pct >= 100 ? TOC.length : activeIndex} of {TOC.length} sections finished
                                    </p>
                                </div>
                            </div>
                            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748b]">On this page</p>
                            <nav aria-label="On this page" className="mt-3">
                                {headingList(false)}
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default ProgressRingOnThisPage

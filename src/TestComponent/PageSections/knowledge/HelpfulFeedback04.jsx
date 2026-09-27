// StickyBannerHelpfulFeedback

// HelpfulFeedback04 · Knowledge Bases & Documentation › Feedback / Was this helpful?

// Description:
// A Payloop Support article, "Refunds: how they work and how long they take", shown in
// a scrollable reading box with a feedback banner pinned to its bottom edge. The banner
// asks "Was this page helpful?" (Yes / No), links to "Edit this page", shows "Last
// updated Sep 12, 2026" and can be dismissed; a "No" opens a one-line "What were you
// looking for?" field. Use it for help-center or policy articles where feedback should
// stay in reach while reading.

// Design:
// - Cream #fdfaf3 section, warm ink #1c1917 text, green #15803d accents; the article
//   box is white with a #e7e0cf border, rounded-[1.75rem], h-[34rem] → sm:h-[38rem],
//   scrolling inside
// - Serif article headings, sans body, a refund-timeline table (scrolls sideways on
//   narrow screens), a green "Good to know" callout; a green scroll-progress hairline
//   pinned on top
// - Banner: a dark green #14532d rounded-2xl bar held 12px above the box's bottom edge
//   by a sticky anchor, over a white fade; cream text and pill buttons; two rows on
//   mobile, one row from md; slides up/down on show/hide
// - Left rail: wordmark and facts (a 3-column row above the box below lg, a column on
//   lg) plus "In this article" jump buttons on lg only
// - framer-motion for banner enter/exit, the height of the follow-up row and the
//   progress bar (useScroll on the box); MotionConfig reducedMotion="user"

// What it does:
// - State: answer (null / yes / no / sent), the "What were you looking for?" text +
//   error and a dismissed flag. "No" reveals the field; sending needs 8+ characters,
//   then a thank-you replaces the buttons; "Yes" thanks immediately
// - The × button (or Escape inside the banner) hides the banner and focuses a small
//   "Page feedback" pill that brings it back (focus returns to the banner)
// - "In this article" buttons smooth-scroll the box to each heading (instant for
//   reduced motion). "Edit this page" → #edit-refunds-article, "Contact support" →
//   #payloop-contact

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StickyBannerHelpfulFeedback from '@/TestComponent/PageSections/knowledge/HelpfulFeedback04';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <StickyBannerHelpfulFeedback />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll } from 'framer-motion';
import { HiCheck, HiOutlineChatBubbleLeftEllipsis, HiOutlinePencilSquare, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]

const toc = [
    { id: 'overview', label: 'How refunds work' },
    { id: 'partial', label: 'Full and partial refunds' },
    { id: 'timing', label: 'How long refunds take' },
    { id: 'failed', label: 'When a refund fails' },
    { id: 'api', label: 'Refunding with the API' },
]

const timings = [
    { method: 'Credit and debit cards', time: '5–10 business days', fee: 'Not returned' },
    { method: 'ACH debit', time: '3–5 business days', fee: 'Not returned' },
    { method: 'Digital wallets', time: '1–3 business days', fee: 'Not returned' },
    { method: 'SEPA bank transfer', time: '2–4 business days', fee: 'Returned' },
]

const steps = [
    'Open Payments and find the charge you want to refund.',
    'Choose Refund, then Full or Partial and enter an amount.',
    'Pick a reason: duplicate, fraudulent or requested by customer.',
    'Confirm. Your customer gets an emailed receipt straight away.',
]

export function StickyBannerHelpfulFeedback({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduce = useReducedMotion()
    const boxRef = useRef(null)
    const restoreRef = useRef(null)
    const bannerRef = useRef(null)
    const inputRef = useRef(null)
    const pendingFocus = useRef(null)
    const focusThanks = useRef(false)
    const [answer, setAnswer] = useState(null)
    const [text, setText] = useState('')
    const [error, setError] = useState('')
    const [dismissed, setDismissed] = useState(false)
    const { scrollYProgress } = useScroll({ container: boxRef })

    const headingId = (id) => `${uid}-${id}`
    const inputId = `${uid}-missing`
    const errorId = `${uid}-missing-error`

    useEffect(() => {
        const target = pendingFocus.current
        pendingFocus.current = null
        if (target === 'restore') restoreRef.current?.focus()
        if (target === 'banner') bannerRef.current?.focus()
        if (target === 'input') inputRef.current?.focus()
    }, [dismissed, answer])

    const jumpTo = (id) => {
        const box = boxRef.current
        const heading = box?.querySelector(`[data-heading="${id}"]`)
        if (!box || !heading) return
        box.scrollTo({ top: Math.max(0, heading.offsetTop - 20), behavior: reduce ? 'auto' : 'smooth' })
    }

    const dismiss = () => {
        pendingFocus.current = 'restore'
        setDismissed(true)
    }

    const restore = () => {
        pendingFocus.current = 'banner'
        setDismissed(false)
    }

    const sayNo = () => {
        pendingFocus.current = 'input'
        setAnswer('no')
    }

    const handleSend = (event) => {
        event.preventDefault()
        if (text.trim().length < 8) {
            setError('Add a few words (8+ characters) so we know what to add.')
            inputRef.current?.focus()
            return
        }
        setError('')
        focusThanks.current = true
        setAnswer('sent')
    }

    const thanked = answer === 'yes' || answer === 'sent'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#fdfaf3] px-4 py-16 text-base font-normal text-[#1c1917] sm:px-6 lg:px-10 lg:py-24', className)}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
                    <aside className="flex flex-col gap-6">
                        <div className="flex items-center gap-2.5">
                            <svg viewBox="0 0 40 24" aria-hidden="true" className="h-6 w-10 text-[#15803d]">
                                <path
                                    d="M12 4a8 8 0 1 0 0 16c4.5 0 6.5-3.5 8-8s3.5-8 8-8a8 8 0 1 1 0 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <p className="leading-tight">
                                <span className="block text-sm font-semibold text-[#1c1917]">Payloop Support</span>
                                <span className="block text-xs text-[#1c1917]/55">Billing & refunds</span>
                            </p>
                        </div>

                        <dl className="grid grid-cols-3 gap-3 text-xs sm:max-w-md lg:max-w-none lg:grid-cols-1 lg:gap-4">
                            <div>
                                <dt className="text-[#1c1917]/50">Last updated</dt>
                                <dd className="mt-0.5 font-semibold text-[#1c1917]">Sep 12, 2026</dd>
                            </div>
                            <div>
                                <dt className="text-[#1c1917]/50">Reading time</dt>
                                <dd className="mt-0.5 font-semibold text-[#1c1917]">5 minutes</dd>
                            </div>
                            <div>
                                <dt className="text-[#1c1917]/50">Written by</dt>
                                <dd className="mt-0.5 font-semibold text-[#1c1917]">Priya Natarajan</dd>
                            </div>
                        </dl>

                        <nav aria-label="In this article" className="hidden lg:block">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">In this article</p>
                            <ul className="mt-3 space-y-1 border-l border-[#e7e0cf]">
                                {toc.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            className="-ml-px flex min-h-10 w-full items-center border-l-2 border-transparent pl-4 text-left text-sm text-[#1c1917]/70 transition-colors hover:border-[#15803d] hover:text-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                                            onClick={() => jumpTo(item.id)}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    <div
                        ref={boxRef}
                        tabIndex={0}
                        role="region"
                        aria-label="Article: Refunds, how they work and how long they take"
                        className="relative h-[34rem] overflow-y-auto overscroll-contain rounded-[1.75rem] border border-[#e7e0cf] bg-white shadow-[0_30px_60px_-45px_rgba(20,83,45,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803d] sm:h-[38rem]"
                    >
                        <div className="sticky top-0 z-10 h-1 bg-white">
                            <motion.div className="h-full origin-left bg-[#15803d]" style={{ scaleX: scrollYProgress }} />
                        </div>

                        <article className="px-5 pb-44 pt-8 sm:px-10 sm:pt-10 md:pb-32 lg:px-14">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">Billing & refunds</p>
                            <h2
                                data-heading="overview"
                                className="mt-3 font-serif text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-[#1c1917] sm:text-4xl"
                            >
                                Refunds: how they work and how long they take
                            </h2>
                            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#1c1917]/80">
                                When you refund a payment, Payloop sends the money back to your customer’s original
                                payment method. You can refund in full or in part, any time up to 180 days after the
                                original charge, and you can issue several partial refunds as long as they don’t add
                                up to more than the charge.
                            </p>

                            <h3
                                id={headingId('partial')}
                                data-heading="partial"
                                className="mt-10 font-serif text-2xl font-semibold text-[#1c1917]"
                            >
                                Full and partial refunds
                            </h3>
                            <ol className="mt-4 space-y-3">
                                {steps.map((step, i) => (
                                    <li key={step} className="flex gap-3 text-[15px] leading-7 text-[#1c1917]/80">
                                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#dcfce7] font-mono text-xs font-semibold text-[#15803d]">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ol>

                            <h3
                                id={headingId('timing')}
                                data-heading="timing"
                                className="mt-10 font-serif text-2xl font-semibold text-[#1c1917]"
                            >
                                How long refunds take
                            </h3>
                            <p className="mt-3 text-[15px] leading-7 text-[#1c1917]/80">
                                Refunds leave Payloop within minutes. How soon your customer sees the money depends on
                                their bank:
                            </p>
                            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e7e0cf]">
                                <table className="w-full min-w-[28rem] text-left text-sm">
                                    <thead className="bg-[#fdfaf3] text-xs uppercase tracking-[0.08em] text-[#1c1917]/60">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 font-semibold">Payment method</th>
                                            <th scope="col" className="px-4 py-3 font-semibold">Customer sees it</th>
                                            <th scope="col" className="px-4 py-3 font-semibold">Processing fee</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e7e0cf]">
                                        {timings.map((row) => (
                                            <tr key={row.method}>
                                                <th scope="row" className="px-4 py-3 font-semibold text-[#1c1917]">{row.method}</th>
                                                <td className="px-4 py-3 text-[#1c1917]/75">{row.time}</td>
                                                <td className="px-4 py-3 text-[#1c1917]/75">{row.fee}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-5 rounded-2xl border-l-4 border-[#15803d] bg-[#f0fdf4] px-5 py-4 text-sm leading-6 text-[#14532d]">
                                <strong className="font-semibold">Good to know:</strong> Payloop doesn’t charge for refunds,
                                but the original processing fee (2.9% + 30¢) isn’t returned for card payments.
                            </div>

                            <h3
                                id={headingId('failed')}
                                data-heading="failed"
                                className="mt-10 font-serif text-2xl font-semibold text-[#1c1917]"
                            >
                                When a refund fails
                            </h3>
                            <p className="mt-3 text-[15px] leading-7 text-[#1c1917]/80">
                                About 1 in 400 refunds can’t be delivered, usually because the card was cancelled or the
                                bank account was closed. We’ll email you, mark the refund as Failed and move the funds
                                back to your Payloop balance within 2 business days, so you can pay the customer
                                another way.
                            </p>

                            <h3
                                id={headingId('api')}
                                data-heading="api"
                                className="mt-10 font-serif text-2xl font-semibold text-[#1c1917]"
                            >
                                Refunding with the API
                            </h3>
                            <p className="mt-3 text-[15px] leading-7 text-[#1c1917]/80">
                                Send{' '}
                                <code className="rounded-md bg-[#f5f1e6] px-1.5 py-0.5 font-mono text-[13px] text-[#14532d]">
                                    POST /v1/refunds
                                </code>{' '}
                                with the payment ID and an optional amount in cents. Add an idempotency key so a retried
                                request never refunds twice.
                            </p>
                            <p className="mt-6 text-[15px] leading-7 text-[#1c1917]/80">
                                Still stuck?{' '}
                                <a
                                    href="#payloop-contact"
                                    className="font-semibold text-[#15803d] underline decoration-[#15803d]/30 underline-offset-4 hover:decoration-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                                >
                                    Contact support
                                </a>{' '}
                                and we’ll reply within 4 hours on weekdays.
                            </p>
                        </article>

                        <div className="pointer-events-none sticky bottom-0 z-10 h-0">
                            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white via-white/80 to-transparent" />
                            <AnimatePresence initial={false}>
                                {!dismissed ? (
                                    <motion.div
                                        key="banner"
                                        ref={bannerRef}
                                        tabIndex={-1}
                                        role="region"
                                        aria-label="Page feedback"
                                        initial={{ y: 40, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 40, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: EASE }}
                                        className="pointer-events-auto absolute inset-x-3 bottom-3 rounded-2xl bg-[#14532d] p-3 outline-none text-[#fdfaf3] shadow-[0_20px_40px_-18px_rgba(20,83,45,0.7)] sm:inset-x-4 sm:bottom-4 sm:p-4"
                                        onKeyDown={(event) => {
                                            if (event.key === 'Escape') {
                                                event.stopPropagation()
                                                dismiss()
                                            }
                                        }}
                                    >
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                            <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
                                                <AnimatePresence initial={false} mode="wait">
                                                    {thanked ? (
                                                        <motion.p
                                                            key="thanks"
                                                            ref={(el) => {
                                                                if (el && focusThanks.current) {
                                                                    focusThanks.current = false
                                                                    el.focus()
                                                                }
                                                            }}
                                                            tabIndex={-1}
                                                            role="status"
                                                            initial={{ opacity: 0, y: 6 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex min-h-10 items-center gap-2 text-sm font-semibold outline-none"
                                                        >
                                                            <span className="grid size-6 place-items-center rounded-full bg-[#86efac] text-[#14532d]">
                                                                <HiCheck aria-hidden="true" className="size-4" />
                                                            </span>
                                                            {answer === 'yes' ? 'Thanks! Glad this sorted it.' : 'Thanks, we’ll add that to the article.'}
                                                        </motion.p>
                                                    ) : (
                                                        <motion.div
                                                            key="ask"
                                                            initial={{ opacity: 0, y: 6 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex flex-wrap items-center gap-x-3 gap-y-2"
                                                        >
                                                            <p className="text-sm font-semibold">
                                                                Was this page helpful?
                                                            </p>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="min-h-10 rounded-full border border-[#fdfaf3]/35 px-4 text-sm font-semibold transition-colors hover:bg-[#fdfaf3] hover:text-[#14532d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86efac]"
                                                                    onClick={() => {
                                                                        focusThanks.current = true
                                                                        setAnswer('yes')
                                                                    }}
                                                                >
                                                                    Yes
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    aria-pressed={answer === 'no'}
                                                                    className={cn(
                                                                        'min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86efac]',
                                                                        answer === 'no'
                                                                            ? 'border-[#fdfaf3] bg-[#fdfaf3] text-[#14532d]'
                                                                            : 'border-[#fdfaf3]/35 hover:bg-[#fdfaf3] hover:text-[#14532d]',
                                                                    )}
                                                                    onClick={sayNo}
                                                                >
                                                                    No
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <div className="order-last flex w-full items-center gap-x-4 gap-y-1 border-t border-[#fdfaf3]/15 pt-2 text-xs text-[#fdfaf3]/70 md:order-none md:ml-auto md:w-auto md:border-0 md:pt-0">
                                                <a
                                                    href="#edit-refunds-article"
                                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-md font-semibold text-[#fdfaf3] underline decoration-[#fdfaf3]/30 underline-offset-4 hover:decoration-[#fdfaf3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86efac]"
                                                >
                                                    <HiOutlinePencilSquare aria-hidden="true" className="size-4" />
                                                    Edit this page
                                                </a>
                                                <span>
                                                    Last updated <time dateTime="2026-09-12">Sep 12, 2026</time>
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                aria-label="Dismiss feedback banner"
                                                className="grid size-10 shrink-0 place-items-center rounded-full text-[#fdfaf3]/75 transition-colors hover:bg-[#fdfaf3]/10 hover:text-[#fdfaf3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86efac]"
                                                onClick={dismiss}
                                            >
                                                <HiXMark aria-hidden="true" className="size-5" />
                                            </button>
                                        </div>

                                        <AnimatePresence initial={false}>
                                            {answer === 'no' && (
                                                <motion.form
                                                    key="missing"
                                                    noValidate
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: EASE }}
                                                    className="overflow-hidden"
                                                    onSubmit={handleSend}
                                                >
                                                    <div className="p-1 pt-3">
                                                        <label htmlFor={inputId} className="text-xs font-semibold text-[#fdfaf3]/85">
                                                            What were you looking for?
                                                        </label>
                                                        <div className="mt-1.5 flex gap-2">
                                                            <input
                                                                ref={inputRef}
                                                                id={inputId}
                                                                type="text"
                                                                value={text}
                                                                maxLength={200}
                                                                placeholder="e.g. refunds on subscriptions"
                                                                aria-invalid={Boolean(error)}
                                                                aria-describedby={error ? errorId : undefined}
                                                                className={cn(
                                                                    'h-11 min-w-0 flex-1 rounded-xl border bg-[#fdfaf3] px-4 text-sm text-[#1c1917] placeholder:text-[#1c1917]/40 focus:outline-none focus:ring-4 focus:ring-[#86efac]/40',
                                                                    error ? 'border-[#fca5a5]' : 'border-transparent',
                                                                )}
                                                                onChange={(event) => {
                                                                    setText(event.target.value)
                                                                    if (error) setError('')
                                                                }}
                                                            />
                                                            <button
                                                                type="submit"
                                                                className="h-11 shrink-0 rounded-xl bg-[#86efac] px-5 text-sm font-semibold text-[#14532d] transition-colors hover:bg-[#bbf7d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fdfaf3]"
                                                            >
                                                                Send
                                                            </button>
                                                        </div>
                                                        {error && (
                                                            <p id={errorId} role="alert" className="mt-2 text-xs font-semibold text-[#fecaca]">
                                                                {error}
                                                            </p>
                                                        )}
                                                    </div>
                                                </motion.form>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="restore"
                                        ref={restoreRef}
                                        type="button"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.25 }}
                                        className="pointer-events-auto absolute bottom-4 right-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#14532d] px-4 text-xs font-semibold text-[#fdfaf3] shadow-lg transition-colors hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                                        onClick={restore}
                                    >
                                        <HiOutlineChatBubbleLeftEllipsis aria-hidden="true" className="size-4" />
                                        Page feedback
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default StickyBannerHelpfulFeedback

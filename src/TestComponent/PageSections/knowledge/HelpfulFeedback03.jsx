// StarRatingHelpfulFeedback

// HelpfulFeedback03 · Knowledge Bases & Documentation › Feedback / Was this helpful?

// Description:
// A developer-console style rating block for the Nimbus Developer Hub guide
// "Authenticate with the OAuth 2.0 device flow". The left panel shows the community
// score (4.6 from 2,318 ratings) with partial stars and a 5 → 1 breakdown; the right
// asks "How useful was this guide?" with a five-star radio group, a follow-up question
// and "Submit rating", then plays a star-burst thank-you. Use it at the foot of API
// guides, tutorials or SDK docs.

// Design:
// - Midnight #0f172a section with an amber #f59e0b glow and a faint 48px grid; panels
//   are rounded-3xl with slate #1e293b borders, the rating card has an amber-tinted
//   border
// - Mono uppercase eyebrows, a 7xl → lg:8xl tabular average, amber stars; slate #94a3b8
//   secondary text; amber submit button with navy text and a focus ring in amber
// - Breakdown bars ease their width when your vote is added; the summary shows a "You"
//   chip once rated
// - Thank-you: a check ring draws itself (pathLength) while eight small stars burst
//   outward and fade (burst skipped for reduced motion; MotionConfig drops other
//   transforms)
// - Stacked on mobile, lg:grid-cols-[0.9fr_1.1fr]; stars are 48px targets at every size

// What it does:
// - Stars are a role="radiogroup" with roving tabindex: ←/→/↑/↓ move and select,
//   Home/End jump; hover previews the fill and the caption ("4 of 5 — Helpful")
// - Ratings of 1-3 ask a required "What held it back?" (native radio pills); 4-5 ask an
//   optional "What helped most?". Submit validates (rating first, then the reason),
//   adds your score to the counts and average, then shows the thank-you with "Change
//   rating"
// - "Report an issue" links to #nimbus-docs-issues and "View guide changelog" to
//   #oauth-device-flow-changelog; no network calls

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StarRatingHelpfulFeedback from '@/TestComponent/PageSections/knowledge/HelpfulFeedback03';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <StarRatingHelpfulFeedback />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowPath, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]
const BASE_COUNTS = { 5: 1760, 4: 330, 3: 120, 2: 55, 1: 53 }
const STARS = [1, 2, 3, 4, 5]

const captions = {
    1: 'Unusable',
    2: 'Needs work',
    3: 'Okay',
    4: 'Helpful',
    5: 'Exactly what I needed',
}

const lowReasons = ['Code sample failed', 'Missing context', 'Outdated for v3.2', 'Too long to follow']
const highReasons = ['Copy-paste samples', 'Sequence diagram', 'Troubleshooting tips', 'Error code table']

const burst = Array.from({ length: 8 }, (_, i) => ({ id: `burst-${i}`, angle: (i / 8) * Math.PI * 2 + Math.PI / 8 }))

function StarRow({ className, starClass }) {
    return (
        <span className={cn('flex whitespace-nowrap', className)}>
            {STARS.map((s) => (
                <HiStar key={s} aria-hidden="true" className={cn('size-6 shrink-0', starClass)} />
            ))}
        </span>
    )
}

export function StarRatingHelpfulFeedback({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduce = useReducedMotion()
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [reason, setReason] = useState('')
    const [error, setError] = useState('')
    const [saved, setSaved] = useState(false)
    const starRefs = useRef([])
    const focusThanks = useRef(false)
    const focusStar = useRef(false)

    const counts = { ...BASE_COUNTS }
    if (saved && rating) counts[rating] += 1
    const total = STARS.reduce((sum, s) => sum + counts[s], 0)
    const average = STARS.reduce((sum, s) => sum + s * counts[s], 0) / total
    const shown = hover || rating
    const low = rating > 0 && rating <= 3
    const reasons = low ? lowReasons : highReasons

    const ids = {
        title: `${uid}-title`,
        caption: `${uid}-caption`,
        reason: `${uid}-reason`,
        error: `${uid}-error`,
    }

    const pick = (value, moveFocus = false) => {
        if ((value <= 3) !== (rating <= 3) || !rating) setReason('')
        setRating(value)
        setError('')
        if (moveFocus) starRefs.current[value - 1]?.focus()
    }

    const handleStarKey = (event, value) => {
        const keys = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
        let next = null
        if (event.key in keys) next = ((value - 1 + keys[event.key] + 5) % 5) + 1
        else if (event.key === 'Home') next = 1
        else if (event.key === 'End') next = 5
        if (next === null) return
        event.preventDefault()
        pick(next, true)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!rating) {
            setError('Choose a rating from 1 to 5 stars first.')
            starRefs.current[0]?.focus()
            return
        }
        if (low && !reason) {
            setError('Tell us what held the guide back so we can fix it.')
            return
        }
        setError('')
        focusThanks.current = true
        setSaved(true)
    }

    const restart = () => {
        focusStar.current = true
        setSaved(false)
        setError('')
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0f172a] px-4 py-16 text-base font-normal text-[#e2e8f0] sm:px-6 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 -z-10 size-[28rem] rounded-full bg-[#f59e0b] opacity-20 blur-[120px]" />

            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#f59e0b]">
                                Nimbus Developer Hub · Guides · v3.2
                            </p>
                            <p className="mt-2 text-sm text-[#94a3b8]">Authenticate with the OAuth 2.0 device flow</p>
                        </div>
                        <a
                            href="#oauth-device-flow-changelog"
                            className="inline-flex min-h-10 items-center gap-2 self-start rounded-md font-mono text-xs text-[#94a3b8] transition-colors hover:text-[#fbbf24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b] sm:self-auto"
                        >
                            View guide changelog
                            <HiArrowLongRight aria-hidden="true" />
                        </a>
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
                        <div className="rounded-3xl border border-[#1e293b] bg-[#111a2e]/80 p-6 sm:p-8">
                            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#94a3b8]">Community score</p>
                            <div className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-3">
                                <p className="text-7xl font-semibold leading-none tracking-[-0.05em] text-white tabular-nums lg:text-8xl">
                                    {average.toFixed(1)}
                                </p>
                                <div className="pb-1">
                                    <div
                                        role="img"
                                        aria-label={`Average ${average.toFixed(1)} out of 5 stars`}
                                        className="relative inline-block"
                                    >
                                        <StarRow starClass="text-[#334155]" />
                                        <span
                                            className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-700"
                                            style={{ width: `${(average / 5) * 100}%` }}
                                        >
                                            <StarRow starClass="text-[#f59e0b]" />
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-[#94a3b8]">
                                        <span className="tabular-nums text-[#e2e8f0]">{total.toLocaleString('en-US')}</span> ratings
                                        {saved && (
                                            <span className="ml-2 rounded-full bg-[#f59e0b]/15 px-2 py-0.5 text-xs font-semibold text-[#fbbf24]">
                                                You: {rating}★
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <ul className="mt-8 space-y-2.5" aria-label="Rating breakdown">
                                {[...STARS].reverse().map((s) => {
                                    const pct = (counts[s] / total) * 100
                                    return (
                                        <li key={s} className="grid grid-cols-[2.25rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm">
                                            <span className="flex items-center gap-1 font-mono text-[#cbd5e1]">
                                                {s}
                                                <HiStar aria-hidden="true" className="size-3.5 text-[#f59e0b]" />
                                            </span>
                                            <span className="h-2 overflow-hidden rounded-full bg-[#1e293b]">
                                                <span
                                                    className={cn(
                                                        'block h-full rounded-full transition-[width] duration-700',
                                                        saved && rating === s ? 'bg-[#fbbf24]' : 'bg-[#f59e0b]/80',
                                                    )}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </span>
                                            <span className="text-right font-mono text-xs tabular-nums text-[#94a3b8]">
                                                {Math.round(pct)}%
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>

                            <p className="mt-8 border-t border-[#1e293b] pt-5 text-xs leading-relaxed text-[#64748b]">
                                Ratings from signed-in developers over the last 90 days. Maintained by the Identity
                                team · last reviewed Sep 9, 2026.
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl border border-[#f59e0b]/25 bg-[linear-gradient(160deg,#1e293b,#0f172a_70%)] p-6 sm:p-8 lg:p-10">
                            <AnimatePresence initial={false} mode="wait">
                                {!saved ? (
                                    <motion.form
                                        key="form"
                                        noValidate
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -14 }}
                                        transition={{ duration: 0.35, ease: EASE }}
                                        onSubmit={handleSubmit}
                                    >
                                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f59e0b]">Rate this guide</p>
                                        <h2
                                            id={ids.title}
                                            className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-3xl"
                                        >
                                            How useful was this guide?
                                        </h2>

                                        <div
                                            role="radiogroup"
                                            aria-labelledby={ids.title}
                                            aria-describedby={error && !rating ? ids.error : undefined}
                                            className="mt-6 flex gap-1 sm:gap-2"
                                            onPointerLeave={() => setHover(0)}
                                        >
                                            {STARS.map((s) => {
                                                const lit = s <= shown
                                                return (
                                                    <button
                                                        key={s}
                                                        ref={(el) => {
                                                            starRefs.current[s - 1] = el
                                                            if (el && focusStar.current && s === rating) {
                                                                focusStar.current = false
                                                                el.focus()
                                                            }
                                                        }}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={rating === s}
                                                        aria-label={`${s} ${s === 1 ? 'star' : 'stars'}, ${captions[s]}`}
                                                        tabIndex={s === (rating || 1) ? 0 : -1}
                                                        className="group grid size-12 place-items-center rounded-xl transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f59e0b] sm:size-14"
                                                        onClick={() => pick(s)}
                                                        onKeyDown={(event) => handleStarKey(event, s)}
                                                        onPointerEnter={() => setHover(s)}
                                                    >
                                                        <motion.span
                                                            animate={{ scale: rating === s ? [1, 1.3, 1] : 1 }}
                                                            transition={{ duration: 0.35 }}
                                                            className="grid place-items-center"
                                                        >
                                                            <HiStar
                                                                aria-hidden="true"
                                                                className={cn(
                                                                    'size-9 transition-colors duration-150 sm:size-10',
                                                                    lit ? 'text-[#f59e0b] drop-shadow-[0_0_12px_rgba(245,158,11,0.45)]' : 'text-[#334155]',
                                                                )}
                                                            />
                                                        </motion.span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <p id={ids.caption} aria-hidden="true" className="mt-3 min-h-6 font-mono text-sm text-[#cbd5e1]">
                                            {shown ? (
                                                <>
                                                    <span className="text-[#fbbf24]">{shown} of 5</span> — {captions[shown]}
                                                </>
                                            ) : (
                                                <span className="text-[#64748b]">Tap a star, or use the arrow keys</span>
                                            )}
                                        </p>

                                        <AnimatePresence initial={false}>
                                            {rating > 0 && (
                                                <motion.div
                                                    key={low ? 'low' : 'high'}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: EASE }}
                                                    className="overflow-hidden"
                                                >
                                                    <fieldset
                                                        aria-describedby={error && rating ? ids.error : undefined}
                                                        className="m-0 min-w-0 border-0 p-1 pt-6"
                                                    >
                                                        <legend className="float-left w-full p-0 text-sm font-semibold text-white">
                                                            {low ? 'What held it back?' : 'What helped most?'}{' '}
                                                            <span className="font-normal text-[#94a3b8]">{low ? '(required)' : '(optional)'}</span>
                                                        </legend>
                                                        <div className="clear-both flex flex-wrap gap-2 pt-3">
                                                            {reasons.map((r) => (
                                                                <label
                                                                    key={r}
                                                                    className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[#334155] px-3.5 text-[13px] text-[#cbd5e1] transition-colors hover:border-[#64748b] has-[:checked]:border-[#f59e0b] has-[:checked]:bg-[#f59e0b]/15 has-[:checked]:text-[#fde68a] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#f59e0b]"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={ids.reason}
                                                                        value={r}
                                                                        checked={reason === r}
                                                                        className="sr-only"
                                                                        onChange={() => {
                                                                            setReason(r)
                                                                            setError('')
                                                                        }}
                                                                    />
                                                                    {r}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </fieldset>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <p
                                            id={ids.error}
                                            role="alert"
                                            className={cn('text-sm text-[#fca5a5]', error ? 'mt-4' : 'sr-only')}
                                        >
                                            {error}
                                        </p>

                                        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                                            <button
                                                type="submit"
                                                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#f59e0b] px-6 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#fbbf24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fbbf24]"
                                            >
                                                Submit rating
                                                <HiArrowLongRight aria-hidden="true" />
                                            </button>
                                            <a
                                                href="#nimbus-docs-issues"
                                                className="inline-flex min-h-10 items-center rounded-md text-sm text-[#94a3b8] underline decoration-[#334155] underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                                            >
                                                Report an issue instead
                                            </a>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="thanks"
                                        role="status"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex min-h-[22rem] flex-col items-center justify-center text-center"
                                    >
                                        <div className="relative grid size-28 place-items-center">
                                            {!reduce &&
                                                burst.map((b, i) => (
                                                    <motion.span
                                                        key={b.id}
                                                        aria-hidden="true"
                                                        initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                                                        animate={{
                                                            x: Math.cos(b.angle) * 90,
                                                            y: Math.sin(b.angle) * 90,
                                                            scale: [0, 1, 0.4],
                                                            opacity: [0, 1, 0],
                                                            rotate: i % 2 ? 90 : -90,
                                                        }}
                                                        transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
                                                        className="absolute text-[#fbbf24]"
                                                    >
                                                        <HiStar className={i % 2 ? 'size-4' : 'size-6'} />
                                                    </motion.span>
                                                ))}
                                            <svg viewBox="0 0 64 64" aria-hidden="true" className="size-24">
                                                <motion.circle
                                                    cx="32"
                                                    cy="32"
                                                    r="29"
                                                    fill="rgba(245,158,11,0.12)"
                                                    stroke="#f59e0b"
                                                    strokeWidth="2.5"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.6, ease: EASE }}
                                                />
                                                <motion.path
                                                    d="M20 33 L28 41 L45 23"
                                                    fill="none"
                                                    stroke="#fbbf24"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
                                                />
                                            </svg>
                                        </div>
                                        <h2
                                            ref={(el) => {
                                                if (el && focusThanks.current) {
                                                    focusThanks.current = false
                                                    el.focus()
                                                }
                                            }}
                                            tabIndex={-1}
                                            className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-white outline-none sm:text-3xl"
                                        >
                                            Rating saved, thank you!
                                        </h2>
                                        <p className="mt-2 flex items-center gap-1" aria-label={`You rated ${rating} of 5 stars`}>
                                            {STARS.map((s) => (
                                                <HiStar key={s} aria-hidden="true" className={cn('size-5', s <= rating ? 'text-[#f59e0b]' : 'text-[#334155]')} />
                                            ))}
                                        </p>
                                        <p className="mt-3 max-w-sm text-sm leading-6 text-[#94a3b8]">
                                            {low
                                                ? `Logged “${reason}” for the Identity team. Low ratings are triaged in the next sprint review.`
                                                : `Nice. ${reason ? `We’ll keep the ${reason.toLowerCase()} coming.` : 'Your score now counts toward the guide average.'}`}
                                        </p>
                                        <button
                                            type="button"
                                            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#334155] px-4 text-sm font-semibold text-[#e2e8f0] transition-colors hover:border-[#f59e0b] hover:text-[#fbbf24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                                            onClick={restart}
                                        >
                                            <HiArrowPath aria-hidden="true" />
                                            Change rating
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default StarRatingHelpfulFeedback

// ThumbsFollowupHelpfulFeedback

// HelpfulFeedback01 · Knowledge Bases & Documentation › Feedback / Was this helpful?

// Description:
// End-of-page feedback block for the Stackdocs guide "Deploying to edge regions". A
// dark "Page pulse" panel shows "83% found this helpful" with a 40-tick meter and vote
// counts; beside it "Was this page helpful?" offers "Yes, it helped" / "Not really".
// "Not really" opens a follow-up with reason chips and a note field, and sending shows
// a thank-you card. Use it at the bottom of any docs article, above the previous/next
// page pager.

// Design:
// - Rounded-[2rem] card split into a #0b0b0f pulse panel and a white question panel:
//   stacked on mobile, lg:grid-cols-[0.85fr_1.15fr] side by side from lg
// - White section, ink #0b0b0f text, violet #8b5cf6 (fills, ticks, glow) and #7c3aed
//   (text, focus rings); faint dotted violet backdrop; mono uppercase eyebrows, tight
//   sans headings
// - Big 6xl → lg:8xl percentage, a 40-tick meter that grows in when scrolled into view
//   and yes/no counters whose digits roll when your vote lands
// - Answer buttons are 56px rounded-2xl tiles with icon badges (Yes fills violet, No
//   fills ink); reason chips are rounded-full toggles; the follow-up opens with a
//   height animation and the thank-you card crossfades in (MotionConfig
//   reducedMotion="user")
// - Pager row with previous/next page cards stacks on mobile and splits from sm

// What it does:
// - State: vote (null / yes / no), stage (ask / followup / thanks), picked reasons,
//   note text and an error. Counts start at 1,066 yes / 218 no and include your vote,
//   so the percentage, meter and totals recompute when you vote or undo
// - "Yes" goes straight to thanks. "No" opens the follow-up and focuses the first chip;
//   submitting needs a reason or a 10+ character note ("Something else" needs the
//   note); errors show inline with aria-invalid, success moves focus to the thank-you
//   heading
// - "Change my answer" resets everything. Pager links point to
//   #docs-environment-variables and #docs-custom-domains; no network calls

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ThumbsFollowupHelpfulFeedback from '@/TestComponent/PageSections/knowledge/HelpfulFeedback01';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <ThumbsFollowupHelpfulFeedback />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUturnLeft, HiCheck, HiHandThumbDown, HiHandThumbUp } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const BASE_YES = 1066
const BASE_NO = 218
const TICKS = 40
const MAX_NOTE = 400
const EASE = [0.22, 1, 0.36, 1]

const reasons = [
    { id: 'example', label: 'Missing a code example' },
    { id: 'steps', label: 'Steps didn’t work' },
    { id: 'outdated', label: 'Out of date for CLI v4' },
    { id: 'unclear', label: 'Hard to follow' },
    { id: 'link', label: 'Broken link' },
    { id: 'other', label: 'Something else' },
]

const tickIds = Array.from({ length: TICKS }, (_, i) => `tick-${i}`)
const format = (n) => n.toLocaleString('en-US')

function RollingNumber({ value, className }) {
    return (
        <span className={cn('relative inline-flex overflow-hidden tabular-nums', className)}>
            <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="block"
                >
                    {format(value)}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

export function ThumbsFollowupHelpfulFeedback({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const [vote, setVote] = useState(null)
    const [stage, setStage] = useState('ask')
    const [picked, setPicked] = useState([])
    const [note, setNote] = useState('')
    const [error, setError] = useState('')
    const firstChipRef = useRef(null)
    const thanksRef = useRef(null)
    const pendingFocus = useRef(null)

    const yes = BASE_YES + (vote === 'yes' ? 1 : 0)
    const no = BASE_NO + (vote === 'no' ? 1 : 0)
    const total = yes + no
    const percent = Math.round((yes / total) * 100)
    const lit = Math.round((yes / total) * TICKS)

    const noteId = `${uid}-note`
    const errorId = `${uid}-error`
    const reasonsLabelId = `${uid}-reasons`

    useEffect(() => {
        const target = pendingFocus.current
        pendingFocus.current = null
        if (target === 'followup') firstChipRef.current?.focus()
        if (target === 'thanks') thanksRef.current?.focus()
    }, [stage])

    const reset = () => {
        setVote(null)
        setStage('ask')
        setPicked([])
        setNote('')
        setError('')
    }

    const answerYes = () => {
        setVote('yes')
        setError('')
        pendingFocus.current = 'thanks'
        setStage('thanks')
    }

    const answerNo = () => {
        if (stage === 'followup') return
        setVote('no')
        pendingFocus.current = 'followup'
        setStage('followup')
    }

    const toggleReason = (id) => {
        setError('')
        setPicked((current) => (current.includes(id) ? current.filter((r) => r !== id) : [...current, id]))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const words = note.trim()
        if (!picked.length && words.length < 10) {
            setError('Pick at least one reason, or write a short note (10+ characters).')
            return
        }
        if (picked.includes('other') && words.length < 10) {
            setError('Tell us a little more about “Something else” (10+ characters).')
            return
        }
        if (note.length > MAX_NOTE) {
            setError(`Keep the note under ${MAX_NOTE} characters.`)
            return
        }
        setError('')
        pendingFocus.current = 'thanks'
        setStage('thanks')
    }

    const noteInvalid = Boolean(error) && (picked.includes('other') || !picked.length)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0b0b0f] sm:px-6 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
            />

            <MotionConfig reducedMotion="user">
                <div className="relative mx-auto max-w-6xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#0b0b0f]/60">
                            <span className="grid size-6 place-items-center rounded-md bg-[#0b0b0f] text-[10px] font-bold text-[#8b5cf6]">
                                S/
                            </span>
                            Stackdocs <span className="text-[#0b0b0f]/30">/</span> Deploy{' '}
                            <span className="text-[#0b0b0f]/30">/</span> Edge regions
                        </p>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0b0b0f]/50">
                            Updated Sep 18, 2026
                        </p>
                    </div>

                    <div className="mt-6 grid overflow-hidden rounded-[2rem] border border-[#0b0b0f]/10 bg-white shadow-[0_30px_80px_-40px_rgba(76,29,149,0.45)] lg:grid-cols-[0.85fr_1.15fr]">
                        <div className="relative isolate flex flex-col overflow-hidden bg-[#0b0b0f] p-6 text-white sm:p-8 lg:p-10">
                            <div
                                aria-hidden="true"
                                className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-[#8b5cf6] opacity-30 blur-3xl"
                            />
                            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
                                Page pulse · last 30 days
                            </p>
                            <p className="mt-6 flex items-end gap-3">
                                <span className="text-6xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
                                    {percent}
                                    <span className="text-[#8b5cf6]">%</span>
                                </span>
                                <span className="pb-1 text-sm leading-snug text-white/70 lg:pb-2">
                                    found this
                                    <br />
                                    helpful
                                </span>
                            </p>

                            <div
                                role="img"
                                aria-label={`${percent} percent of ${format(total)} readers found this page helpful`}
                                className="mt-8 mb-8 flex h-12 items-end justify-between"
                            >
                                {tickIds.map((id, i) => (
                                    <motion.span
                                        key={id}
                                        initial={{ scaleY: 0.35 }}
                                        whileInView={{ scaleY: 1 }}
                                        viewport={{ once: true, amount: 0.6 }}
                                        transition={{ duration: 0.5, delay: i * 0.015, ease: EASE }}
                                        className={cn(
                                            'block w-[3px] origin-bottom rounded-full transition-colors duration-500',
                                            i < lit ? 'bg-[#8b5cf6]' : 'bg-white/15',
                                            i % 5 === 0 ? 'h-12' : 'h-9',
                                        )}
                                    />
                                ))}
                            </div>

                            <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 lg:mt-auto">
                                <div>
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Yes</dt>
                                    <dd className="mt-1 text-xl font-semibold text-white">
                                        <RollingNumber value={yes} />
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">No</dt>
                                    <dd className="mt-1 text-xl font-semibold text-white">
                                        <RollingNumber value={no} />
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Votes</dt>
                                    <dd className="mt-1 text-xl font-semibold text-[#c4b5fd]">
                                        <RollingNumber value={total} />
                                    </dd>
                                </div>
                            </dl>
                            <p className="mt-6 text-xs leading-relaxed text-white/45">
                                Owned by the Platform docs team · 3 open suggestions on this page
                            </p>
                        </div>

                        <div className="relative p-6 sm:p-8 lg:p-12">
                            <div className="grid">
                                <AnimatePresence initial={false}>
                                    {stage !== 'thanks' ? (
                                        <motion.div
                                            key="ask"
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -12 }}
                                            transition={{ duration: 0.35, ease: EASE }}
                                            className="col-start-1 row-start-1"
                                        >
                                            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#7c3aed]">
                                                You reached the end of the guide
                                            </p>
                                            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#0b0b0f] sm:text-4xl">
                                                Was this page helpful?
                                            </h2>
                                            <p className="mt-3 max-w-md text-sm leading-6 text-[#0b0b0f]/65">
                                                Your answer goes straight to the team that owns “Deploying to edge
                                                regions”. It takes one click.
                                            </p>

                                            <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                                <button
                                                    type="button"
                                                    aria-pressed={vote === 'yes'}
                                                    className={cn(
                                                        'group flex min-h-14 items-center gap-3 rounded-2xl border px-3 text-left text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]',
                                                        vote === 'yes'
                                                            ? 'border-[#8b5cf6] bg-[#8b5cf6] text-white'
                                                            : 'border-[#0b0b0f]/12 bg-white text-[#0b0b0f] hover:border-[#8b5cf6] hover:bg-[#f5f3ff]',
                                                    )}
                                                    onClick={answerYes}
                                                >
                                                    <span
                                                        className={cn(
                                                            'grid size-10 shrink-0 place-items-center rounded-xl text-lg transition-transform duration-300 group-hover:-rotate-12',
                                                            vote === 'yes' ? 'bg-white/20 text-white' : 'bg-[#ede9fe] text-[#7c3aed]',
                                                        )}
                                                    >
                                                        <HiHandThumbUp aria-hidden="true" />
                                                    </span>
                                                    Yes, it helped
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-pressed={vote === 'no'}
                                                    aria-expanded={stage === 'followup'}
                                                    className={cn(
                                                        'group flex min-h-14 items-center gap-3 rounded-2xl border px-3 text-left text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]',
                                                        vote === 'no'
                                                            ? 'border-[#0b0b0f] bg-[#0b0b0f] text-white'
                                                            : 'border-[#0b0b0f]/12 bg-white text-[#0b0b0f] hover:border-[#0b0b0f] hover:bg-[#fafafa]',
                                                    )}
                                                    onClick={answerNo}
                                                >
                                                    <span
                                                        className={cn(
                                                            'grid size-10 shrink-0 place-items-center rounded-xl text-lg transition-transform duration-300 group-hover:rotate-12',
                                                            vote === 'no' ? 'bg-white/15 text-[#c4b5fd]' : 'bg-[#f4f4f5] text-[#0b0b0f]',
                                                        )}
                                                    >
                                                        <HiHandThumbDown aria-hidden="true" />
                                                    </span>
                                                    Not really
                                                </button>
                                            </div>

                                            <AnimatePresence initial={false}>
                                                {stage === 'followup' && (
                                                    <motion.form
                                                        key="followup"
                                                        noValidate
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: EASE }}
                                                        className="overflow-hidden"
                                                        onSubmit={handleSubmit}
                                                    >
                                                        <div className="p-1 pt-7">
                                                            <p
                                                                id={reasonsLabelId}
                                                                className="text-sm font-semibold text-[#0b0b0f]"
                                                            >
                                                                Sorry about that. What went wrong?
                                                            </p>
                                                            <div
                                                                role="group"
                                                                aria-labelledby={reasonsLabelId}
                                                                className="mt-3 flex flex-wrap gap-2"
                                                            >
                                                                {reasons.map((reason, i) => {
                                                                    const on = picked.includes(reason.id)
                                                                    return (
                                                                        <button
                                                                            key={reason.id}
                                                                            ref={i === 0 ? firstChipRef : undefined}
                                                                            type="button"
                                                                            aria-pressed={on}
                                                                            className={cn(
                                                                                'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]',
                                                                                on
                                                                                    ? 'border-[#7c3aed] bg-[#f5f3ff] text-[#5b21b6]'
                                                                                    : 'border-[#0b0b0f]/12 text-[#0b0b0f]/75 hover:border-[#0b0b0f]/35',
                                                                            )}
                                                                            onClick={() => toggleReason(reason.id)}
                                                                        >
                                                                            {on && <HiCheck aria-hidden="true" className="size-3.5" />}
                                                                            {reason.label}
                                                                        </button>
                                                                    )
                                                                })}
                                                            </div>

                                                            <div className="mt-5 flex items-baseline justify-between gap-3">
                                                                <label htmlFor={noteId} className="text-sm font-semibold text-[#0b0b0f]">
                                                                    Tell us more{' '}
                                                                    <span className="font-normal text-[#0b0b0f]/50">
                                                                        {picked.includes('other') ? '(required)' : '(optional)'}
                                                                    </span>
                                                                </label>
                                                                <span
                                                                    className={cn(
                                                                        'font-mono text-[11px] tabular-nums',
                                                                        note.length > MAX_NOTE - 40 ? 'text-[#b91c1c]' : 'text-[#0b0b0f]/45',
                                                                    )}
                                                                >
                                                                    {note.length}/{MAX_NOTE}
                                                                </span>
                                                            </div>
                                                            <textarea
                                                                id={noteId}
                                                                rows={3}
                                                                maxLength={MAX_NOTE}
                                                                value={note}
                                                                placeholder="e.g. The region list doesn’t include ap-south-2 yet"
                                                                aria-invalid={noteInvalid}
                                                                aria-describedby={error ? errorId : undefined}
                                                                className={cn(
                                                                    'mt-2 block w-full resize-none rounded-2xl border bg-[#fafafa] px-4 py-3 text-sm leading-6 text-[#0b0b0f] placeholder:text-[#0b0b0f]/35 focus:border-[#7c3aed] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/15',
                                                                    noteInvalid ? 'border-[#b91c1c]' : 'border-[#0b0b0f]/12',
                                                                )}
                                                                onChange={(event) => {
                                                                    setNote(event.target.value)
                                                                    if (error) setError('')
                                                                }}
                                                            />
                                                            <p
                                                                id={errorId}
                                                                role="alert"
                                                                className={cn('text-sm text-[#b91c1c]', error ? 'mt-2' : 'sr-only')}
                                                            >
                                                                {error}
                                                            </p>

                                                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                                                <button
                                                                    type="submit"
                                                                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#7c3aed] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                                                                >
                                                                    Send feedback
                                                                    <HiArrowLongRight aria-hidden="true" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-[#0b0b0f]/60 transition-colors hover:text-[#0b0b0f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                                                                    onClick={reset}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.form>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="thanks"
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -12 }}
                                            transition={{ duration: 0.45, ease: EASE }}
                                            className="col-start-1 row-start-1"
                                        >
                                            <motion.span
                                                initial={{ scale: 0.4, rotate: -30 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                                                className="grid size-14 place-items-center rounded-2xl bg-[#8b5cf6] text-2xl text-white shadow-[0_12px_30px_-10px_rgba(139,92,246,0.8)]"
                                            >
                                                <HiCheck aria-hidden="true" />
                                            </motion.span>
                                            <h2
                                                ref={thanksRef}
                                                tabIndex={-1}
                                                className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#0b0b0f] outline-none sm:text-4xl"
                                            >
                                                {vote === 'yes' ? 'Thanks, glad it helped!' : 'Thanks, we’re on it.'}
                                            </h2>
                                            <p className="mt-3 max-w-md text-sm leading-6 text-[#0b0b0f]/65">
                                                {vote === 'yes'
                                                    ? `You’re one of ${format(yes)} readers who found this guide useful. Next up: pointing a custom domain at your edge deployment.`
                                                    : 'Your note went to the Platform docs team. We triage page feedback every weekday and most fixes ship within three days.'}
                                            </p>
                                            {vote === 'no' && picked.length > 0 && (
                                                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Reasons you sent">
                                                    {reasons
                                                        .filter((reason) => picked.includes(reason.id))
                                                        .map((reason) => (
                                                            <li
                                                                key={reason.id}
                                                                className="rounded-full bg-[#f5f3ff] px-3 py-1 text-xs font-medium text-[#5b21b6]"
                                                            >
                                                                {reason.label}
                                                            </li>
                                                        ))}
                                                </ul>
                                            )}
                                            <button
                                                type="button"
                                                className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0b0b0f]/12 px-4 text-sm font-semibold text-[#0b0b0f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                                                onClick={reset}
                                            >
                                                <HiArrowUturnLeft aria-hidden="true" />
                                                Change my answer
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <nav aria-label="Pagination" className="mt-6 grid gap-3 sm:grid-cols-2">
                        <a
                            href="#docs-environment-variables"
                            className="group flex min-h-16 items-center gap-4 rounded-2xl border border-[#0b0b0f]/10 bg-white px-5 py-4 transition-colors hover:border-[#8b5cf6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                        >
                            <HiArrowLongLeft
                                aria-hidden="true"
                                className="shrink-0 text-[#7c3aed] transition-transform group-hover:-translate-x-1"
                            />
                            <span className="min-w-0">
                                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#0b0b0f]/45">
                                    Previous
                                </span>
                                <span className="block truncate text-sm font-semibold">Environment variables</span>
                            </span>
                        </a>
                        <a
                            href="#docs-custom-domains"
                            className="group flex min-h-16 items-center justify-end gap-4 rounded-2xl border border-[#0b0b0f]/10 bg-white px-5 py-4 text-right transition-colors hover:border-[#8b5cf6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                        >
                            <span className="min-w-0">
                                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#0b0b0f]/45">
                                    Next
                                </span>
                                <span className="block truncate text-sm font-semibold">Custom domains and TLS</span>
                            </span>
                            <HiArrowLongRight
                                aria-hidden="true"
                                className="shrink-0 text-[#7c3aed] transition-transform group-hover:translate-x-1"
                            />
                        </a>
                    </nav>
                </div>
            </MotionConfig>
        </section>
    )
}

export default ThumbsFollowupHelpfulFeedback

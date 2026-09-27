// FiveFacesHelpfulFeedback

// HelpfulFeedback02 · Knowledge Bases & Documentation › Feedback / Was this helpful?

// Description:
// A friendly five-face rating block for the Helpbase article "Reset your password and
// recover a locked account". Under "How did this article make you feel?" readers pick
// one of five hand-drawn SVG faces (Awful → Loved it); a large face on the left morphs
// to match, an optional comment and "Contact me about this" email field slide in, and
// "Send feedback" shows a thank-you card. Use it at the end of help-center and FAQ
// articles.

// Design:
// - Pale blue #eff6ff card (rounded-[2.5rem]) with a white inner panel; stacked on
//   mobile, lg:grid-cols-2 with the big face on the left and the scale + form on the
//   right
// - White section, slate #0f172a text, blue #2563eb accents with #dbeafe → #1d4ed8
//   tints per level; dashed orbit rings around the face, a 5-segment stacked bar of
//   this month's ratings with a legend
// - Faces are inline SVG (circle, eyes, brows, quadratic mouth); the big face's mouth
//   and brows morph with framer-motion path animation and its fill shifts per level
// - Scale buttons lift on hover and fill blue when selected; form opens with a height
//   animation; on thanks the face bounces inside a ring of dots (off for reduced
//   motion)
// - Scale is grid-cols-5 at every width (≥46px targets at 360px); labels shrink to 11px

// What it does:
// - The scale is a role="radiogroup" with roving tabindex: ←/→/↑/↓ move and select,
//   Home/End jump; hovering or focusing previews the face and label on the left
// - After a pick, the form offers an optional 280-character comment (placeholder
//   changes by score) and a "Contact me" checkbox that reveals a required, validated
//   email field
// - Submit (preventDefault) validates, bumps the monthly count to 2,407 and shows
//   "Feedback HB-20931" with "Edit my response"; no network calls
// - The breadcrumb links point to #help-account and #help-account-security

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FiveFacesHelpfulFeedback from '@/TestComponent/PageSections/knowledge/HelpfulFeedback02';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <FiveFacesHelpfulFeedback />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiCheck, HiOutlinePencilSquare } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]
const MAX_COMMENT = 280
const BASE_COUNT = 2406
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const levels = [
    {
        value: 1,
        label: 'Awful',
        long: 'Awful — it made things worse',
        share: 4,
        fill: '#e2e8f0',
        mouth: 'M15 34 Q24 26 33 34',
        brows: ['M12 17 Q16 17 20 13.5', 'M36 17 Q32 17 28 13.5'],
        placeholder: 'What went wrong? Where did you get stuck?',
    },
    {
        value: 2,
        label: 'Meh',
        long: 'Not great — still confused',
        share: 7,
        fill: '#dbeafe',
        mouth: 'M16 33 Q24 29.5 32 33',
        brows: ['M12 16.5 Q16 16.5 20 14.5', 'M36 16.5 Q32 16.5 28 14.5'],
        placeholder: 'Which step was unclear?',
    },
    {
        value: 3,
        label: 'Okay',
        long: 'Okay — it did the job',
        share: 14,
        fill: '#bfdbfe',
        mouth: 'M16 32 Q24 32 32 32',
        brows: ['M12 15.5 Q16 15.5 20 15.5', 'M36 15.5 Q32 15.5 28 15.5'],
        placeholder: 'What would have made this better?',
    },
    {
        value: 4,
        label: 'Good',
        long: 'Good — solved my problem',
        share: 38,
        fill: '#93c5fd',
        mouth: 'M16 30 Q24 36.5 32 30',
        brows: ['M12 16 Q16 13.5 20 15.5', 'M36 16 Q32 13.5 28 15.5'],
        placeholder: 'Anything we could add?',
    },
    {
        value: 5,
        label: 'Loved it',
        long: 'Loved it — clear and quick',
        share: 37,
        fill: '#2563eb',
        mouth: 'M14 29 Q24 41 34 29',
        brows: ['M12 15 Q16 11.5 20 14', 'M36 15 Q32 11.5 28 14'],
        placeholder: 'What did you like most?',
    },
]

const neutral = {
    fill: '#ffffff',
    mouth: 'M18 32 Q24 32 30 32',
    brows: ['M13 16 Q16.5 16 20 16', 'M35 16 Q31.5 16 28 16'],
}

const segmentTints = ['bg-[#dbeafe]', 'bg-[#bfdbfe]', 'bg-[#93c5fd]', 'bg-[#3b82f6]', 'bg-[#1d4ed8]']
const burstDots = Array.from({ length: 12 }, (_, i) => ({ id: `dot-${i}`, angle: (i / 12) * Math.PI * 2 }))

function Face({ level, checked, className }) {
    const dark = level.value === 5 && !checked
    const ink = dark ? '#ffffff' : checked ? '#1d4ed8' : '#1e3a8a'
    return (
        <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
            <circle
                cx="24"
                cy="24"
                r="21"
                fill={checked ? '#ffffff' : level.fill}
                stroke={dark ? '#1d4ed8' : '#1e3a8a'}
                strokeOpacity={checked ? 0 : dark ? 1 : 0.25}
                strokeWidth="1.5"
            />
            {level.brows.map((d) => (
                <path key={d} d={d} fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
            ))}
            <circle cx="18" cy="22.5" r="2.4" fill={ink} />
            <circle cx="30" cy="22.5" r="2.4" fill={ink} />
            <path d={level.mouth} fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
    )
}

export function FiveFacesHelpfulFeedback({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduce = useReducedMotion()
    const [selected, setSelected] = useState(null)
    const [preview, setPreview] = useState(null)
    const [comment, setComment] = useState('')
    const [contact, setContact] = useState(false)
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({})
    const [sent, setSent] = useState(false)
    const radioRefs = useRef([])
    const emailRef = useRef(null)
    const focusThanks = useRef(false)
    const focusRadio = useRef(false)

    const shown = preview ?? selected
    const face = shown ? levels[shown - 1] : neutral
    const faceInk = shown === 5 ? '#ffffff' : '#1e3a8a'
    const count = BASE_COUNT + (sent ? 1 : 0)
    const current = selected ? levels[selected - 1] : null

    const ids = {
        heading: `${uid}-heading`,
        comment: `${uid}-comment`,
        commentHint: `${uid}-comment-hint`,
        email: `${uid}-email`,
        emailError: `${uid}-email-error`,
        commentError: `${uid}-comment-error`,
    }

    const choose = (value, moveFocus = false) => {
        setSelected(value)
        setSent(false)
        if (moveFocus) radioRefs.current[value - 1]?.focus()
    }

    const handleRadioKey = (event, value) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
        let next = null
        if (event.key in keys) next = ((value - 1 + keys[event.key] + 5) % 5) + 1
        else if (event.key === 'Home') next = 1
        else if (event.key === 'End') next = 5
        if (next === null) return
        event.preventDefault()
        choose(next, true)
        setPreview(next)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const nextErrors = {}
        if (comment.length > MAX_COMMENT) nextErrors.comment = `Please keep it under ${MAX_COMMENT} characters.`
        if (contact && !email.trim()) nextErrors.email = 'Add an email so we can reply, or untick “Contact me”.'
        else if (contact && !EMAIL_RE.test(email.trim())) nextErrors.email = 'That email doesn’t look right, e.g. sam@company.com'
        setErrors(nextErrors)
        if (nextErrors.email) {
            emailRef.current?.focus()
            return
        }
        if (nextErrors.comment) return
        focusThanks.current = true
        setSent(true)
    }

    const focusedIndex = selected ?? 1

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 lg:px-10 lg:py-24', className)}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                        <span className="inline-flex items-center gap-2 font-semibold tracking-tight text-[#0f172a]">
                            <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
                                <rect width="28" height="28" rx="9" fill="#2563eb" />
                                <path d="M9 7v14M9 14h7a3 3 0 0 1 3 3v4" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
                            </svg>
                            Helpbase
                        </span>
                        <span aria-hidden="true" className="text-[#0f172a]/25">/</span>
                        <a href="#help-account" className="rounded text-[#0f172a]/60 hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]">
                            Account
                        </a>
                        <span aria-hidden="true" className="text-[#0f172a]/25">/</span>
                        <a href="#help-account-security" className="rounded text-[#0f172a]/60 hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]">
                            Sign-in and security
                        </a>
                    </div>

                    <div className="mt-6 grid overflow-hidden rounded-[2.5rem] border border-[#2563eb]/10 bg-[#eff6ff] lg:grid-cols-2">
                        <div className="relative flex flex-col items-center px-6 pb-8 pt-10 text-center sm:px-10 lg:justify-center lg:py-12">
                            <div className="relative grid size-56 place-items-center sm:size-64">
                                <span aria-hidden="true" className="absolute inset-0 rounded-full border border-dashed border-[#2563eb]/25" />
                                <span aria-hidden="true" className="absolute inset-6 rounded-full border border-[#2563eb]/15" />
                                {sent && !reduce && (
                                    <span aria-hidden="true" className="absolute inset-0">
                                        {burstDots.map((dot) => (
                                            <motion.span
                                                key={dot.id}
                                                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                                                animate={{
                                                    x: Math.cos(dot.angle) * 118,
                                                    y: Math.sin(dot.angle) * 118,
                                                    scale: [0, 1.2, 0.6],
                                                    opacity: [1, 1, 0],
                                                }}
                                                transition={{ duration: 1.1, ease: EASE }}
                                                className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 size-3 rounded-full bg-[#2563eb]"
                                            />
                                        ))}
                                    </span>
                                )}
                                <motion.svg
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                    className="relative size-40 drop-shadow-[0_24px_30px_rgba(37,99,235,0.25)] sm:size-44"
                                    animate={sent ? { scale: [1, 1.12, 0.96, 1], rotate: [0, -6, 4, 0] } : { scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.8, ease: EASE }}
                                >
                                    <motion.circle
                                        cx="24"
                                        cy="24"
                                        r="21"
                                        initial={false}
                                        animate={{ fill: face.fill }}
                                        stroke="#1e3a8a"
                                        strokeOpacity="0.2"
                                        strokeWidth="1"
                                        transition={{ duration: 0.35 }}
                                    />
                                    {[0, 1].map((i) => (
                                        <motion.path
                                            key={`brow-${i}`}
                                            initial={false}
                                            animate={{ d: face.brows[i], stroke: faceInk }}
                                            fill="none"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            transition={{ duration: 0.35, ease: EASE }}
                                        />
                                    ))}
                                    <motion.circle cx="18" cy="22.5" r="2.2" initial={false} animate={{ fill: faceInk }} />
                                    <motion.circle cx="30" cy="22.5" r="2.2" initial={false} animate={{ fill: faceInk }} />
                                    <motion.path
                                        initial={false}
                                        animate={{ d: face.mouth, stroke: faceInk }}
                                        fill="none"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        transition={{ duration: 0.4, ease: EASE }}
                                    />
                                </motion.svg>
                            </div>
                            <p aria-hidden="true" className="mt-6 min-h-10 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                                {shown ? levels[shown - 1].label : 'Pick a face'}
                            </p>
                            <p aria-hidden="true" className="mt-1 min-h-5 text-sm text-[#0f172a]/55">
                                {shown ? levels[shown - 1].long.split(' — ')[1] : 'Hover, tap or use the arrow keys'}
                            </p>

                            <div className="mt-8 w-full max-w-sm text-left">
                                <div className="flex items-baseline justify-between text-xs">
                                    <span className="font-semibold text-[#0f172a]">This month</span>
                                    <span className="tabular-nums text-[#0f172a]/55">{count.toLocaleString('en-US')} ratings</span>
                                </div>
                                <div
                                    role="img"
                                    aria-label={`Ratings this month: ${levels.map((l) => `${l.label} ${l.share}%`).join(', ')}`}
                                    className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-white"
                                >
                                    {levels.map((level, i) => (
                                        <span key={level.value} className={cn('h-full', segmentTints[i])} style={{ width: `${level.share}%` }} />
                                    ))}
                                </div>
                                <ul aria-hidden="true" className="mt-2 flex justify-between text-[11px] text-[#0f172a]/55">
                                    {levels.map((level, i) => (
                                        <li key={level.value} className="flex items-center gap-1">
                                            <span className={cn('size-2 rounded-full', segmentTints[i])} />
                                            {level.share}%
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="m-2 rounded-[2rem] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(30,58,138,0.5)] sm:m-3 sm:p-8 lg:p-10">
                            <AnimatePresence initial={false} mode="wait">
                                {!sent ? (
                                    <motion.div
                                        key="ask"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.3, ease: EASE }}
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563eb]">Article feedback</p>
                                        <h2
                                            id={ids.heading}
                                            className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#0f172a] sm:text-3xl"
                                        >
                                            How did this article make you feel?
                                        </h2>
                                        <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-1.5 text-xs text-[#1e3a8a]">
                                            <span className="truncate">Reset your password and recover a locked account</span>
                                            <span className="shrink-0 text-[#1e3a8a]/50">· 4 min</span>
                                        </p>

                                        <div
                                            role="radiogroup"
                                            aria-labelledby={ids.heading}
                                            className="mt-7 grid grid-cols-5 gap-1.5 sm:gap-3"
                                            onPointerLeave={() => setPreview(null)}
                                        >
                                            {levels.map((level) => {
                                                const checked = selected === level.value
                                                return (
                                                    <button
                                                        key={level.value}
                                                        ref={(el) => {
                                                            radioRefs.current[level.value - 1] = el
                                                            if (el && focusRadio.current && level.value === selected) {
                                                                focusRadio.current = false
                                                                el.focus()
                                                            }
                                                        }}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={checked}
                                                        aria-label={level.long}
                                                        tabIndex={level.value === focusedIndex ? 0 : -1}
                                                        className={cn(
                                                            'group flex min-w-0 flex-col items-center gap-2 rounded-2xl border px-0.5 pb-2.5 pt-3 transition-[background-color,border-color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] motion-safe:hover:-translate-y-1',
                                                            checked
                                                                ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-[0_14px_30px_-14px_rgba(37,99,235,0.9)]'
                                                                : 'border-[#0f172a]/10 bg-white text-[#0f172a]/70 hover:border-[#2563eb]/50 hover:bg-[#eff6ff]',
                                                        )}
                                                        onClick={() => choose(level.value)}
                                                        onKeyDown={(event) => handleRadioKey(event, level.value)}
                                                        onPointerEnter={() => setPreview(level.value)}
                                                        onFocus={() => setPreview(level.value)}
                                                        onBlur={() => setPreview(null)}
                                                    >
                                                        <Face
                                                            level={level}
                                                            checked={checked}
                                                            className={cn(
                                                                'size-9 transition-transform duration-300 sm:size-12',
                                                                checked ? 'scale-110' : 'group-hover:scale-105',
                                                            )}
                                                        />
                                                        <span className="w-full truncate text-center text-[11px] font-semibold sm:text-xs">{level.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <div className="mt-2 flex justify-between px-1 text-[11px] text-[#0f172a]/45" aria-hidden="true">
                                            <span>Not helpful</span>
                                            <span>Very helpful</span>
                                        </div>

                                        <AnimatePresence initial={false}>
                                            {current && (
                                                <motion.form
                                                    key="details"
                                                    noValidate
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: EASE }}
                                                    className="overflow-hidden"
                                                    onSubmit={handleSubmit}
                                                >
                                                    <div className="p-1 pt-6">
                                                        <div className="flex items-baseline justify-between gap-3">
                                                            <label htmlFor={ids.comment} className="text-sm font-semibold text-[#0f172a]">
                                                                Anything to add? <span className="font-normal text-[#0f172a]/50">(optional)</span>
                                                            </label>
                                                            <span
                                                                id={ids.commentHint}
                                                                className={cn(
                                                                    'font-mono text-[11px] tabular-nums',
                                                                    comment.length > MAX_COMMENT - 30 ? 'text-[#dc2626]' : 'text-[#0f172a]/45',
                                                                )}
                                                            >
                                                                {comment.length}/{MAX_COMMENT}
                                                            </span>
                                                        </div>
                                                        <textarea
                                                            id={ids.comment}
                                                            rows={3}
                                                            maxLength={MAX_COMMENT}
                                                            value={comment}
                                                            placeholder={current.placeholder}
                                                            aria-invalid={Boolean(errors.comment)}
                                                            aria-describedby={[ids.commentHint, errors.comment && ids.commentError].filter(Boolean).join(' ')}
                                                            className="mt-2 block w-full resize-none rounded-2xl border border-[#0f172a]/12 bg-[#f8fafc] px-4 py-3 text-sm leading-6 text-[#0f172a] placeholder:text-[#0f172a]/35 focus:border-[#2563eb] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2563eb]/15"
                                                            onChange={(event) => setComment(event.target.value)}
                                                        />
                                                        {errors.comment && (
                                                            <p id={ids.commentError} className="mt-2 text-sm text-[#dc2626]">
                                                                {errors.comment}
                                                            </p>
                                                        )}

                                                        <label className="mt-4 flex min-h-10 cursor-pointer items-center gap-3 text-sm text-[#0f172a]/80">
                                                            <input
                                                                type="checkbox"
                                                                checked={contact}
                                                                className="size-5 shrink-0 cursor-pointer rounded accent-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                                                onChange={(event) => {
                                                                    setContact(event.target.checked)
                                                                    setErrors((e) => ({ ...e, email: undefined }))
                                                                }}
                                                            />
                                                            Contact me about this feedback
                                                        </label>
                                                        <AnimatePresence initial={false}>
                                                            {contact && (
                                                                <motion.div
                                                                    key="email"
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3, ease: EASE }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="p-1 pt-2">
                                                                        <label htmlFor={ids.email} className="text-sm font-semibold text-[#0f172a]">
                                                                            Work email
                                                                        </label>
                                                                        <input
                                                                            ref={emailRef}
                                                                            id={ids.email}
                                                                            type="email"
                                                                            autoComplete="email"
                                                                            value={email}
                                                                            placeholder="sam@company.com"
                                                                            aria-invalid={Boolean(errors.email)}
                                                                            aria-describedby={errors.email ? ids.emailError : undefined}
                                                                            className={cn(
                                                                                'mt-2 block h-11 w-full rounded-xl border bg-[#f8fafc] px-4 text-sm text-[#0f172a] placeholder:text-[#0f172a]/35 focus:border-[#2563eb] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2563eb]/15',
                                                                                errors.email ? 'border-[#dc2626]' : 'border-[#0f172a]/12',
                                                                            )}
                                                                            onChange={(event) => {
                                                                                setEmail(event.target.value)
                                                                                if (errors.email) setErrors((e) => ({ ...e, email: undefined }))
                                                                            }}
                                                                        />
                                                                        {errors.email && (
                                                                            <p id={ids.emailError} role="alert" className="mt-2 text-sm text-[#dc2626]">
                                                                                {errors.email}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        <button
                                                            type="submit"
                                                            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] sm:w-auto"
                                                        >
                                                            Send feedback
                                                            <HiArrowLongRight aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </motion.form>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="thanks"
                                        role="status"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.35, ease: EASE }}
                                        className="flex min-h-72 flex-col justify-center"
                                    >
                                        <span className="grid size-12 place-items-center rounded-full bg-[#dbeafe] text-xl text-[#2563eb]">
                                            <HiCheck aria-hidden="true" />
                                        </span>
                                        <h2
                                            ref={(el) => {
                                                if (el && focusThanks.current) {
                                                    focusThanks.current = false
                                                    el.focus()
                                                }
                                            }}
                                            tabIndex={-1}
                                            className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#0f172a] outline-none sm:text-3xl"
                                        >
                                            Thank you, that really helps.
                                        </h2>
                                        <p className="mt-3 text-sm leading-6 text-[#0f172a]/65">
                                            You rated this article <strong className="font-semibold text-[#0f172a]">“{current?.label}”</strong>.
                                            {contact && email ? ` We’ll reply to ${email.trim()} within one business day.` : ' Our content team reviews every comment on Mondays.'}
                                        </p>
                                        <dl className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-[#f8fafc] p-4 text-sm">
                                            <div>
                                                <dt className="text-xs text-[#0f172a]/50">Reference</dt>
                                                <dd className="font-mono font-semibold text-[#0f172a]">HB-20931</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs text-[#0f172a]/50">Comment</dt>
                                                <dd className="truncate font-semibold text-[#0f172a]">{comment.trim() ? `${comment.trim().length} characters` : 'None'}</dd>
                                            </div>
                                        </dl>
                                        <button
                                            type="button"
                                            className="mt-6 inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[#0f172a]/12 px-4 text-sm font-semibold text-[#0f172a] transition-colors hover:border-[#2563eb] hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                            onClick={() => {
                                                focusRadio.current = true
                                                setSent(false)
                                            }}
                                        >
                                            <HiOutlinePencilSquare aria-hidden="true" />
                                            Edit my response
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

export default FiveFacesHelpfulFeedback

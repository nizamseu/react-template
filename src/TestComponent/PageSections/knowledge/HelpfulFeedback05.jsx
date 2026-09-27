// SuggestEditHelpfulFeedback

// HelpfulFeedback05 · Knowledge Bases & Documentation › Feedback / Was this helpful?

// Description:
// A "Suggest an edit" workflow for the Orbit Wiki page "Permissions & roles". The page
// outline lists four sections, each with its own pencil button, and "Suggest an edit"
// opens a side form with a section select (plus the current wording), "What’s wrong?"
// chips, a suggestion textarea and an optional email. Sending shows reference OW-4821
// with a review timeline. Use it on community-maintained wikis, handbooks or docs that
// accept edits.

// Design:
// - Zinc #f4f4f5 section, #18181b ink, orange #ea580c accents (#c2410c for text on
//   white); white rounded-2xl cards with #e4e4e7 borders and a soft shadow; mono
//   section numbers
// - lg:grid-cols-[1.05fr_0.95fr]: outline on the left, form panel on the right (sticky
//   top-6 on lg); stacked on mobile where the panel follows the outline
// - The selected section gets an orange left rule; chips are rounded-full toggles that
//   turn orange; fields use 44px heights, orange focus rings and red #dc2626 error text
// - Panel states (invite → form → success) crossfade and slide with AnimatePresence;
//   the success timeline dots pop in one after another (MotionConfig
//   reducedMotion="user")

// What it does:
// - State: panel mode (invite / form / sent), section, chosen issues, suggestion,
//   email, per-field errors and a 700 ms "Sending…" flag (timeout cleared on unmount)
// - Pencil buttons open the form with that section preselected and focus the textarea;
//   the main button focuses the select. Escape or "Cancel" closes the form and returns
//   to invite; "Suggest another edit" clears the form, "Done" goes back to the invite
//   card
// - Validation: section required, at least one issue, suggestion 20-600 characters,
//   email optional but must be valid; the first invalid field is focused and errors are
//   linked with aria-describedby. "View history" → #wiki-permissions-history; no
//   network calls

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SuggestEditHelpfulFeedback from '@/TestComponent/PageSections/knowledge/HelpfulFeedback05';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <SuggestEditHelpfulFeedback />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { HiArrowLongRight, HiCheck, HiChevronDown, HiOutlinePencilSquare, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]
const MIN_TEXT = 20
const MAX_TEXT = 600
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const sections = [
    {
        id: 'overview',
        title: 'Overview',
        excerpt: 'Every Orbit workspace has three built-in roles: Owner, Editor and Viewer. Roles apply per space.',
    },
    {
        id: 'roles',
        title: 'Roles at a glance',
        excerpt: 'Editors can create and move pages but cannot delete a space or change billing settings.',
    },
    {
        id: 'custom',
        title: 'Custom roles',
        excerpt: 'On the Team plan you can create up to 10 custom roles from Settings → Members → Roles.',
    },
    {
        id: 'guests',
        title: 'Guest access',
        excerpt: 'Guests see only the pages shared with them and are removed automatically after 30 days.',
    },
]

const issues = ['Typo or grammar', 'Outdated info', 'Broken link', 'Unclear wording', 'Missing step', 'Wrong screenshot']

const timeline = [
    { label: 'Submitted', detail: 'Just now' },
    { label: 'Editor review', detail: 'Within 2 business days' },
    { label: 'Published', detail: 'You’ll be credited in page history' },
]

const blankErrors = {}

export function SuggestEditHelpfulFeedback({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const [mode, setMode] = useState('invite')
    const [section, setSection] = useState('')
    const [picked, setPicked] = useState([])
    const [text, setText] = useState('')
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState(blankErrors)
    const [sending, setSending] = useState(false)
    const selectRef = useRef(null)
    const chipsRef = useRef(null)
    const textRef = useRef(null)
    const emailRef = useRef(null)
    const openButtonRef = useRef(null)
    const doneRef = useRef(null)
    const pendingFocus = useRef(null)
    const timerRef = useRef(null)

    const ids = {
        section: `${uid}-section`,
        sectionError: `${uid}-section-error`,
        issues: `${uid}-issues`,
        issuesError: `${uid}-issues-error`,
        text: `${uid}-text`,
        textHint: `${uid}-text-hint`,
        textError: `${uid}-text-error`,
        email: `${uid}-email`,
        emailError: `${uid}-email-error`,
    }

    const chosen = sections.find((s) => s.id === section)

    useEffect(() => () => clearTimeout(timerRef.current), [])

    // Panels mount after the previous one has animated out, so focus lands via callback refs.
    const focusWhenReady = (key, ref) => (el) => {
        ref.current = el
        if (el && pendingFocus.current === key) {
            pendingFocus.current = null
            el.focus()
        }
    }

    useEffect(() => {
        if (pendingFocus.current !== 'open') return
        pendingFocus.current = null
        openButtonRef.current?.focus()
    }, [mode])

    const openForm = (sectionId) => {
        if (sectionId) setSection(sectionId)
        setErrors(blankErrors)
        if (mode === 'form') {
            const field = sectionId ? textRef : selectRef
            field.current?.focus()
            return
        }
        pendingFocus.current = sectionId ? 'text' : 'select'
        setMode('form')
    }

    const closeForm = () => {
        clearTimeout(timerRef.current)
        setSending(false)
        pendingFocus.current = 'open'
        setMode('invite')
    }

    const resetAll = (next) => {
        setSection('')
        setPicked([])
        setText('')
        setEmail('')
        setErrors(blankErrors)
        pendingFocus.current = next === 'form' ? 'select' : 'open'
        setMode(next)
    }

    const toggleIssue = (issue) => {
        setPicked((current) => (current.includes(issue) ? current.filter((i) => i !== issue) : [...current, issue]))
        if (errors.issues) setErrors((e) => ({ ...e, issues: undefined }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (sending) return
        const next = {}
        if (!section) next.section = 'Choose the section your edit is about.'
        if (!picked.length) next.issues = 'Pick at least one thing that’s wrong.'
        const trimmed = text.trim()
        if (trimmed.length < MIN_TEXT) next.text = `Describe the change in at least ${MIN_TEXT} characters (${trimmed.length} so far).`
        else if (trimmed.length > MAX_TEXT) next.text = `Keep it under ${MAX_TEXT} characters.`
        if (email.trim() && !EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email, e.g. ana@orbit.team, or leave it empty.'
        setErrors(next)
        if (next.section) selectRef.current?.focus()
        else if (next.issues) chipsRef.current?.querySelector('button')?.focus()
        else if (next.text) textRef.current?.focus()
        else if (next.email) emailRef.current?.focus()
        else {
            setSending(true)
            timerRef.current = setTimeout(() => {
                setSending(false)
                pendingFocus.current = 'done'
                setMode('sent')
            }, 700)
        }
    }

    const fieldClass = (hasError) =>
        cn(
            'mt-2 block w-full rounded-xl border bg-white text-sm text-[#18181b] placeholder:text-[#18181b]/35 focus:border-[#ea580c] focus:outline-none focus:ring-4 focus:ring-[#ea580c]/15',
            hasError ? 'border-[#dc2626]' : 'border-[#d4d4d8]',
        )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#f4f4f5] px-4 py-16 text-base font-normal text-[#18181b] sm:px-6 lg:px-10 lg:py-24', className)}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-6xl">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#18181b]/55">
                        <svg viewBox="0 0 32 32" aria-hidden="true" className="mr-1 size-6">
                            <circle cx="16" cy="16" r="6" fill="#ea580c" />
                            <ellipse cx="16" cy="16" rx="14" ry="6" fill="none" stroke="#18181b" strokeWidth="1.6" transform="rotate(-25 16 16)" />
                        </svg>
                        <span className="font-sans text-sm font-semibold text-[#18181b]">Orbit Wiki</span>
                        <span aria-hidden="true">›</span>
                        <span>Workspace admin</span>
                        <span aria-hidden="true">›</span>
                        <span className="text-[#c2410c]">Permissions & roles</span>
                    </p>

                    <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
                        <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_20px_40px_-30px_rgba(24,24,27,0.25)] sm:p-8">
                            <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-[#18181b] sm:text-4xl">
                                Permissions & roles
                            </h2>
                            <p className="mt-2 text-sm text-[#18181b]/55">
                                Edited Sep 24, 2026 by Tomasz Wiśniewski · 14 contributors · Rev. 42
                            </p>

                            <ol className="mt-7 space-y-2">
                                {sections.map((s, i) => {
                                    const active = mode === 'form' && section === s.id
                                    return (
                                        <li
                                            key={s.id}
                                            className={cn(
                                                'group relative flex gap-4 rounded-xl border-l-[3px] py-3 pl-4 pr-2 transition-colors',
                                                active ? 'border-[#ea580c] bg-[#fff7ed]' : 'border-transparent hover:bg-[#fafafa]',
                                            )}
                                        >
                                            <span className="pt-0.5 font-mono text-xs font-semibold text-[#c2410c]">§{i + 1}</span>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base font-semibold text-[#18181b]">{s.title}</h3>
                                                <p className="mt-1 text-sm leading-6 text-[#18181b]/65">{s.excerpt}</p>
                                            </div>
                                            <button
                                                type="button"
                                                aria-label={`Suggest an edit to “${s.title}”`}
                                                className={cn(
                                                    'grid size-10 shrink-0 place-items-center rounded-lg text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]',
                                                    active
                                                        ? 'bg-[#ea580c] text-white'
                                                        : 'text-[#18181b]/40 group-hover:text-[#c2410c] hover:bg-[#ffedd5]',
                                                )}
                                                onClick={() => openForm(s.id)}
                                            >
                                                <HiOutlinePencilSquare aria-hidden="true" />
                                            </button>
                                        </li>
                                    )
                                })}
                            </ol>

                            <div className="mt-7 flex flex-col gap-4 border-t border-dashed border-[#d4d4d8] pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-[#18181b]/65">Spotted something out of date?</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <a
                                        href="#wiki-permissions-history"
                                        className="inline-flex min-h-10 items-center rounded-lg px-2 text-sm font-medium text-[#18181b]/65 underline decoration-[#d4d4d8] underline-offset-4 hover:text-[#18181b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                    >
                                        View history
                                    </a>
                                    <button
                                        ref={openButtonRef}
                                        type="button"
                                        aria-expanded={mode === 'form'}
                                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#18181b] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#ea580c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                        onClick={() => openForm()}
                                    >
                                        <HiOutlinePencilSquare aria-hidden="true" />
                                        Suggest an edit
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:sticky lg:top-6">
                            <AnimatePresence initial={false} mode="wait">
                                {mode === 'invite' && (
                                    <motion.div
                                        key="invite"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.3, ease: EASE }}
                                        className="relative overflow-hidden rounded-2xl bg-[#18181b] p-6 text-white sm:p-8"
                                    >
                                        <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute -right-16 -top-16 size-64 opacity-60">
                                            <ellipse cx="100" cy="100" rx="90" ry="36" fill="none" stroke="#ea580c" strokeWidth="1" transform="rotate(-25 100 100)" />
                                            <ellipse cx="100" cy="100" rx="70" ry="26" fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" transform="rotate(20 100 100)" />
                                            <circle cx="100" cy="100" r="14" fill="#ea580c" />
                                        </svg>
                                        <p className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-[#fdba74]">Open to edits</p>
                                        <h3 className="relative mt-3 max-w-xs text-2xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-3xl">
                                            Help keep this page right.
                                        </h3>
                                        <p className="relative mt-3 max-w-sm text-sm leading-6 text-white/70">
                                            Orbit Wiki is maintained by 1,240 contributors. An editor reviews every suggestion
                                            within two business days.
                                        </p>
                                        <dl className="relative mt-6 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl bg-white/5 p-3">
                                                <dt className="text-xs text-white/55">Merged this month</dt>
                                                <dd className="mt-1 text-2xl font-semibold text-white">38</dd>
                                            </div>
                                            <div className="rounded-xl bg-white/5 p-3">
                                                <dt className="text-xs text-white/55">Median review</dt>
                                                <dd className="mt-1 text-2xl font-semibold text-white">19 h</dd>
                                            </div>
                                        </dl>
                                        <button
                                            type="button"
                                            className="relative mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#ea580c] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#f97316] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fdba74]"
                                            onClick={() => openForm()}
                                        >
                                            Suggest an edit
                                            <HiArrowLongRight aria-hidden="true" />
                                        </button>
                                    </motion.div>
                                )}

                                {mode === 'form' && (
                                    <motion.form
                                        key="form"
                                        noValidate
                                        aria-label="Suggest an edit"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.3, ease: EASE }}
                                        className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_24px_50px_-30px_rgba(234,88,12,0.45)] sm:p-7"
                                        onSubmit={handleSubmit}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Escape') {
                                                event.preventDefault()
                                                closeForm()
                                            }
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#c2410c]">Suggest an edit</p>
                                                <h3 className="mt-1 text-xl font-bold tracking-[-0.02em] text-[#18181b]">What should change?</h3>
                                            </div>
                                            <button
                                                type="button"
                                                aria-label="Close the suggestion form"
                                                className="grid size-10 shrink-0 place-items-center rounded-lg text-[#18181b]/55 transition-colors hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                                onClick={closeForm}
                                            >
                                                <HiXMark aria-hidden="true" className="size-5" />
                                            </button>
                                        </div>

                                        <div className="mt-5">
                                            <label htmlFor={ids.section} className="text-sm font-semibold text-[#18181b]">
                                                Section
                                            </label>
                                            <div className="relative">
                                                <select
                                                    ref={focusWhenReady('select', selectRef)}
                                                    id={ids.section}
                                                    value={section}
                                                    aria-invalid={Boolean(errors.section)}
                                                    aria-describedby={errors.section ? ids.sectionError : undefined}
                                                    className={cn(fieldClass(errors.section), 'h-11 cursor-pointer appearance-none pl-4 pr-10')}
                                                    onChange={(event) => {
                                                        setSection(event.target.value)
                                                        if (errors.section) setErrors((e) => ({ ...e, section: undefined }))
                                                    }}
                                                >
                                                    <option value="">Choose a section…</option>
                                                    {sections.map((s, i) => (
                                                        <option key={s.id} value={s.id}>
                                                            §{i + 1} {s.title}
                                                        </option>
                                                    ))}
                                                    <option value="page">Whole page</option>
                                                </select>
                                                <HiChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 mt-1 -translate-y-1/2 text-[#18181b]/50" />
                                            </div>
                                            {errors.section && (
                                                <p id={ids.sectionError} className="mt-1.5 text-xs font-medium text-[#dc2626]">
                                                    {errors.section}
                                                </p>
                                            )}
                                            {chosen && (
                                                <blockquote className="mt-3 rounded-xl border border-dashed border-[#fdba74] bg-[#fff7ed] px-4 py-3 text-xs leading-5 text-[#9a3412]">
                                                    <span className="font-mono font-semibold uppercase tracking-[0.12em]">Currently says: </span>
                                                    {chosen.excerpt}
                                                </blockquote>
                                            )}
                                        </div>

                                        <div className="mt-5">
                                            <p id={ids.issues} className="text-sm font-semibold text-[#18181b]">
                                                What’s wrong?
                                            </p>
                                            <div
                                                ref={chipsRef}
                                                role="group"
                                                aria-labelledby={ids.issues}
                                                aria-describedby={errors.issues ? ids.issuesError : undefined}
                                                className="mt-2 flex flex-wrap gap-2"
                                            >
                                                {issues.map((issue) => {
                                                    const on = picked.includes(issue)
                                                    return (
                                                        <button
                                                            key={issue}
                                                            type="button"
                                                            aria-pressed={on}
                                                            className={cn(
                                                                'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]',
                                                                on
                                                                    ? 'border-[#ea580c] bg-[#ea580c] text-white'
                                                                    : cn(
                                                                          'bg-white text-[#18181b]/75 hover:border-[#18181b]/40',
                                                                          errors.issues ? 'border-[#dc2626]/60' : 'border-[#d4d4d8]',
                                                                      ),
                                                            )}
                                                            onClick={() => toggleIssue(issue)}
                                                        >
                                                            {on && <HiCheck aria-hidden="true" className="size-3.5" />}
                                                            {issue}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                            {errors.issues && (
                                                <p id={ids.issuesError} className="mt-1.5 text-xs font-medium text-[#dc2626]">
                                                    {errors.issues}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-5">
                                            <div className="flex items-baseline justify-between gap-3">
                                                <label htmlFor={ids.text} className="text-sm font-semibold text-[#18181b]">
                                                    Your suggestion
                                                </label>
                                                <span
                                                    id={ids.textHint}
                                                    className={cn(
                                                        'font-mono text-[11px] tabular-nums',
                                                        text.trim().length >= MIN_TEXT ? 'text-[#16a34a]' : 'text-[#18181b]/45',
                                                    )}
                                                >
                                                    {text.length}/{MAX_TEXT}
                                                </span>
                                            </div>
                                            <textarea
                                                ref={focusWhenReady('text', textRef)}
                                                id={ids.text}
                                                rows={4}
                                                maxLength={MAX_TEXT}
                                                value={text}
                                                placeholder="e.g. Custom roles are now available on the Business plan too, and the limit is 25."
                                                aria-invalid={Boolean(errors.text)}
                                                aria-describedby={[ids.textHint, errors.text && ids.textError].filter(Boolean).join(' ')}
                                                className={cn(fieldClass(errors.text), 'resize-none px-4 py-3 leading-6')}
                                                onChange={(event) => {
                                                    setText(event.target.value)
                                                    if (errors.text) setErrors((e) => ({ ...e, text: undefined }))
                                                }}
                                            />
                                            {errors.text && (
                                                <p id={ids.textError} className="mt-1.5 text-xs font-medium text-[#dc2626]">
                                                    {errors.text}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-5">
                                            <label htmlFor={ids.email} className="text-sm font-semibold text-[#18181b]">
                                                Email <span className="font-normal text-[#18181b]/50">(optional, for credit)</span>
                                            </label>
                                            <input
                                                ref={emailRef}
                                                id={ids.email}
                                                type="email"
                                                autoComplete="email"
                                                value={email}
                                                placeholder="ana@orbit.team"
                                                aria-invalid={Boolean(errors.email)}
                                                aria-describedby={errors.email ? ids.emailError : undefined}
                                                className={cn(fieldClass(errors.email), 'h-11 px-4')}
                                                onChange={(event) => {
                                                    setEmail(event.target.value)
                                                    if (errors.email) setErrors((e) => ({ ...e, email: undefined }))
                                                }}
                                            />
                                            {errors.email && (
                                                <p id={ids.emailError} className="mt-1.5 text-xs font-medium text-[#dc2626]">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-6 flex flex-wrap items-center gap-3">
                                            <button
                                                type="submit"
                                                aria-disabled={sending}
                                                className={cn(
                                                    'inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ea580c] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]',
                                                    sending && 'cursor-progress opacity-80',
                                                )}
                                            >
                                                {sending ? (
                                                    <>
                                                        <motion.span
                                                            aria-hidden="true"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                                            className="size-4 rounded-full border-2 border-white/40 border-t-white"
                                                        />
                                                        Sending…
                                                    </>
                                                ) : (
                                                    <>
                                                        Send suggestion
                                                        <HiArrowLongRight aria-hidden="true" />
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-medium text-[#18181b]/60 transition-colors hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                                onClick={closeForm}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </motion.form>
                                )}

                                {mode === 'sent' && (
                                    <motion.div
                                        key="sent"
                                        role="status"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.3, ease: EASE }}
                                        className="rounded-2xl border border-[#e4e4e7] bg-white p-6 sm:p-8"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="grid size-11 place-items-center rounded-full bg-[#ea580c] text-xl text-white">
                                                <HiCheck aria-hidden="true" />
                                            </span>
                                            <p className="font-mono text-xs font-semibold text-[#c2410c]">OW-4821</p>
                                        </div>
                                        <h3
                                            ref={focusWhenReady('done', doneRef)}
                                            tabIndex={-1}
                                            className="mt-4 text-2xl font-bold tracking-[-0.02em] text-[#18181b] outline-none"
                                        >
                                            Suggestion sent. Thank you!
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-[#18181b]/65">
                                            {`For “${chosen ? chosen.title : 'the whole page'}”: ${picked.join(', ').toLowerCase()}.`}
                                            {email.trim() ? ` We’ll email ${email.trim()} when it’s reviewed.` : ''}
                                        </p>

                                        <ol className="mt-6">
                                            {timeline.map((step, i) => (
                                                <li key={step.label} className="relative flex gap-4 pb-5 last:pb-0">
                                                    {i < timeline.length - 1 && (
                                                        <span aria-hidden="true" className="absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px bg-[#e4e4e7]" />
                                                    )}
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 380, damping: 20, delay: 0.15 + i * 0.15 }}
                                                        className={cn(
                                                            'relative grid size-6 shrink-0 place-items-center rounded-full border-2',
                                                            i === 0 ? 'border-[#ea580c] bg-[#ea580c] text-white' : 'border-[#d4d4d8] bg-white',
                                                        )}
                                                    >
                                                        {i === 0 && <HiCheck aria-hidden="true" className="size-3.5" />}
                                                    </motion.span>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#18181b]">{step.label}</p>
                                                        <p className="text-xs text-[#18181b]/55">{step.detail}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>

                                        <div className="mt-7 flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#18181b] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#ea580c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                                onClick={() => resetAll('form')}
                                            >
                                                <HiOutlinePencilSquare aria-hidden="true" />
                                                Suggest another edit
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-medium text-[#18181b]/65 transition-colors hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                                onClick={() => resetAll('invite')}
                                            >
                                                Done
                                            </button>
                                        </div>
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

export default SuggestEditHelpfulFeedback

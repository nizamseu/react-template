// UnderlineTypeContactForm

// ContactForm04 · Corporate & Business › Contact & Lead Form

// Description:
// A sentence-shaped new-business form for Northlight Studio, a brand consultancy. In very
// large type it reads "Hello, my name is ___ from ___, and I’d like to talk about ___. You
// can reach me at ___. Our budget is roughly ___." Each blank is an underline-only input
// with a floating label; topic suggestions fill the blank, and "Send it" swaps the sentence
// for a personal reply. Use it on a studio or agency contact page that should feel crafted.

// Design:
// - Black #0a0a0a section, off-white #f2efe8 type, grey #8c877d for labels and hints,
//   hairlines #2a2826; a single soft coral #ff8f7a marks errors
// - The sentence is light sans text-[1.75rem] → sm:text-5xl → lg:text-[4.25rem] with loose
//   leading so floating labels (mono 10–11px caps) fit above each blank
// - Blanks are inline inputs sized in ch to their content, 1px grey underline plus a white
//   2px line that grows from the left on focus; the label rests in the blank as grey
//   placeholder text and floats up as a small caption when focused or filled
// - Submit is a full-width row: "Send it" in display type with a circle arrow that turns
//   and fills on hover; three caption blocks (write, call, visit) sit under a hairline
// - Responsive: the sentence wraps naturally (blanks cap at 100% width); captions stack on
//   base and form three columns from md; the message field stays at text-lg

// What it does:
// - Controlled values (name, company, topic, email, budget, note); errors appear after the
//   first submit (and per field after blur) in a numbered list tied to each blank via
//   aria-describedby; the first invalid blank receives focus
// - Topic chips ("a rebrand", "naming", …) write their text into the topic blank; the
//   budget blank is a native select
// - A valid submit (no network) cross-fades to "Lovely to meet you, …" with the details
//   echoed back; "Start over" restores an empty sentence. Caption links are #northlight-*

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import UnderlineTypeContactForm from '@/TestComponent/PageSections/corporate/ContactForm04';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <UnderlineTypeContactForm />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { HiArrowRight, HiArrowUturnLeft, HiChevronDown } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const suggestions = ['a rebrand', 'naming', 'a launch campaign', 'packaging', 'a new website', 'brand strategy']
const budgets = ['not sure yet', '£20–40k', '£40–80k', '£80–150k', '£150k or more']

const blank = { name: '', company: '', topic: '', email: '', budget: budgets[0], note: '' }
const order = ['name', 'company', 'topic', 'email']

const validate = (v) => {
    const e = {}
    if (v.name.trim().length < 2) e.name = 'We need your name to say hello back.'
    if (v.company.trim().length < 2) e.company = 'Tell us where you’re from: a company, a project, anything.'
    if (v.topic.trim().length < 3) e.topic = 'What would you like to talk about? Pick a suggestion or write your own.'
    if (!v.email.trim()) e.email = 'Leave an email so we can reply.'
    else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address is missing something.'
    return e
}

// The resting label is the input's own placeholder (so it sits exactly on the text line);
// on focus or once filled it fades out and a small caption label floats in above.
function Blank({ id, label, value, error, describedBy, minCh = 8, inputRef, className, ...rest }) {
    const width = Math.max(value.length, label.length, minCh) + 1
    return (
        <span className={cn('relative inline-flex max-w-full align-baseline', className)}>
            <input
                id={id}
                ref={inputRef}
                value={value}
                placeholder={label}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                style={{ width: `${width}ch` }}
                className={cn(
                    'peer max-w-full border-0 border-b bg-transparent px-0 pb-1 pt-0 font-normal leading-[1.15] tracking-[inherit] text-[#f2efe8] outline-none placeholder:transition-colors placeholder:duration-300 focus:placeholder:text-transparent',
                    error ? 'border-[#ff8f7a] placeholder:text-[#ff8f7a]/70' : 'border-[#57534c] placeholder:text-[#5f5b53]',
                )}
                {...rest}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#f2efe8] transition-transform duration-500 ease-out peer-focus:scale-x-100"
            />
            <label
                htmlFor={id}
                className={cn(
                    'pointer-events-none absolute bottom-full left-0 mb-0.5 translate-y-2 whitespace-nowrap font-mono text-[10px] uppercase leading-none tracking-[0.2em] opacity-0 transition-all duration-300 ease-out sm:text-[11px]',
                    'peer-focus:translate-y-0 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:opacity-100',
                    error ? 'text-[#ff8f7a]' : 'text-[#8c877d]',
                )}
            >
                {label}
            </label>
        </span>
    )
}

export function UnderlineTypeContactForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [values, setValues] = useState(blank)
    const [touched, setTouched] = useState({})
    const [attempted, setAttempted] = useState(false)
    const [sent, setSent] = useState(null)
    const refs = useRef({})
    const focusTarget = useRef(null)

    const errors = validate(values)
    const show = (name) => ((touched[name] || attempted) && errors[name]) || undefined
    const visibleErrors = order.filter((k) => show(k))

    const field = (name) => ({
        id: `${uid}-${name}`,
        value: values[name],
        error: show(name),
        describedBy: show(name) ? `${uid}-${name}-err` : undefined,
        inputRef: (el) => {
            refs.current[name] = el
            if (el && name === 'name' && focusTarget.current === 'form') {
                focusTarget.current = null
                el.focus()
            }
        },
        onChange: (e) => setValues((prev) => ({ ...prev, [name]: e.target.value })),
        onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    })

    const handleSubmit = (event) => {
        event.preventDefault()
        setAttempted(true)
        const first = order.find((k) => errors[k])
        if (first) {
            if (refs.current[first]) refs.current[first].focus()
            return
        }
        focusTarget.current = 'sent'
        setSent({ ...values, first: values.name.trim().split(' ')[0] })
    }

    const reset = () => {
        setValues(blank)
        setTouched({})
        setAttempted(false)
        focusTarget.current = 'form'
        setSent(null)
    }

    const pickTopic = (text) => {
        setValues((prev) => ({ ...prev, topic: text }))
        setTouched((prev) => ({ ...prev, topic: true }))
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0a0a0a] px-4 py-14 text-base font-normal text-[#f2efe8] sm:px-6 sm:py-20 lg:px-12 lg:py-28',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between gap-4 whitespace-nowrap border-b border-[#2a2826] pb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8c877d] sm:text-[11px] sm:tracking-[0.22em]">
                        <p className="flex items-center gap-2.5 text-[#f2efe8]">
                            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
                                <path d="M10 1 L12 8 L19 10 L12 12 L10 19 L8 12 L1 10 L8 8 Z" fill="currentColor" />
                            </svg>
                            Northlight Studio
                        </p>
                        <p>New business · 2026</p>
                    </div>

                    <h2 className="mt-10 font-mono text-[11px] font-normal uppercase tracking-[0.26em] text-[#8c877d] sm:mt-14">
                        Start a conversation
                    </h2>

                    <AnimatePresence mode="wait" initial={false}>
                        {sent ? (
                            <motion.div
                                key="sent"
                                ref={(el) => {
                                    if (el && focusTarget.current === 'sent') {
                                        focusTarget.current = null
                                        el.focus()
                                    }
                                }}
                                tabIndex={-1}
                                role="status"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.6, ease: EASE }}
                                className="mt-6 outline-none"
                            >
                                <p className="text-[1.75rem] font-light leading-[1.3] tracking-[-0.03em] text-[#f2efe8] sm:text-5xl sm:leading-[1.2] lg:text-[4.25rem]">
                                    Lovely to meet you, {sent.first}.{' '}
                                    <span className="text-[#8c877d]">
                                        We’ll write to <span className="text-[#f2efe8] underline decoration-1 underline-offset-8">{sent.email.trim()}</span>{' '}
                                        about {sent.topic.trim()} within two working days.
                                    </span>
                                </p>
                                <p className="mt-8 max-w-lg text-lg leading-8 text-[#8c877d]">
                                    Expect a short note from Signe or Tomás with two questions about {sent.company.trim()} and a
                                    time to talk.
                                    {sent.budget !== budgets[0] && ` We’ve noted a budget of ${sent.budget}.`}
                                </p>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="mt-10 inline-flex min-h-11 items-center gap-2 border-b border-[#57534c] pb-1 font-mono text-xs uppercase tracking-[0.22em] text-[#f2efe8] transition-colors hover:border-[#f2efe8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2efe8]"
                                >
                                    <HiArrowUturnLeft aria-hidden="true" />
                                    Start over
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                noValidate
                                aria-label="Tell Northlight about your project"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.6, ease: EASE }}
                                className="mt-6"
                                onSubmit={handleSubmit}
                            >
                                <p className="text-[1.75rem] font-light leading-[2.1] tracking-[-0.03em] text-[#f2efe8] sm:text-5xl sm:leading-[1.85] lg:text-[4.25rem] lg:leading-[1.7]">
                                    Hello, my name is{' '}
                                    <Blank label="your name" type="text" autoComplete="name" minCh={9} {...field('name')} />
                                    {' '}from{' '}
                                    <Blank label="company or project" type="text" autoComplete="organization" {...field('company')} />
                                    , and I’d like to talk about{' '}
                                    <Blank label="a topic" type="text" minCh={10} {...field('topic')} />
                                    . You can reach me at{' '}
                                    <Blank label="email address" type="email" autoComplete="email" minCh={14} {...field('email')} />
                                    . Our budget is roughly{' '}
                                    <span className="relative inline-block max-w-full align-baseline">
                                        <label htmlFor={`${uid}-budget`} className="sr-only">
                                            Budget
                                        </label>
                                        <select
                                            id={`${uid}-budget`}
                                            value={values.budget}
                                            onChange={(e) => setValues((prev) => ({ ...prev, budget: e.target.value }))}
                                            style={{ width: `${values.budget.length + 2}ch` }}
                                            className="max-w-full cursor-pointer appearance-none border-0 border-b border-[#57534c] bg-transparent px-0 pb-1 font-light leading-[1.1] text-[#f2efe8] outline-none transition-colors hover:border-[#f2efe8] focus:border-[#f2efe8]"
                                        >
                                            {budgets.map((b) => (
                                                <option key={b} value={b} className="bg-[#0a0a0a] text-base text-[#f2efe8]">
                                                    {b}
                                                </option>
                                            ))}
                                        </select>
                                        <HiChevronDown
                                            aria-hidden="true"
                                            className="pointer-events-none absolute bottom-[0.3em] right-0 h-[0.45em] w-[0.45em] text-[#8c877d]"
                                        />
                                    </span>
                                    .
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-2">
                                    <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8c877d]">Topics we love</span>
                                    {suggestions.map((s) => {
                                        const on = values.topic.trim() === s
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                aria-pressed={on}
                                                onClick={() => pickTopic(s)}
                                                className={cn(
                                                    'min-h-10 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2efe8]',
                                                    on
                                                        ? 'border-[#f2efe8] bg-[#f2efe8] text-[#0a0a0a]'
                                                        : 'border-[#2a2826] text-[#c9c4b9] hover:border-[#8c877d] hover:text-[#f2efe8]',
                                                )}
                                            >
                                                {s}
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="mt-12 max-w-3xl">
                                    <label htmlFor={`${uid}-note`} className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8c877d]">
                                        Anything else? <span className="normal-case tracking-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        id={`${uid}-note`}
                                        rows={3}
                                        maxLength={800}
                                        value={values.note}
                                        placeholder="Deadlines, links, the thing keeping you up at night…"
                                        onChange={(e) => setValues((prev) => ({ ...prev, note: e.target.value }))}
                                        className="mt-3 w-full resize-y border-0 border-b border-[#57534c] bg-transparent px-0 pb-3 text-lg leading-8 text-[#f2efe8] placeholder:text-[#5f5b53] outline-none transition-colors focus:border-[#f2efe8]"
                                    />
                                </div>

                                <div aria-live="polite">
                                    {visibleErrors.length > 0 && (
                                        <ol className="mt-8 space-y-2 border-l border-[#ff8f7a] pl-4">
                                            {visibleErrors.map((k, i) => (
                                                <li key={k} id={`${uid}-${k}-err`} className="flex gap-3 text-[15px] leading-6 text-[#ff8f7a]">
                                                    <span className="font-mono text-xs leading-6 text-[#ff8f7a]/70">0{i + 1}</span>
                                                    {errors[k]}
                                                </li>
                                            ))}
                                        </ol>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="group mt-12 flex w-full items-center justify-between gap-6 border-y border-[#2a2826] py-6 text-left transition-colors hover:border-[#f2efe8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2efe8] sm:py-8"
                                >
                                    <span className="text-4xl font-light tracking-[-0.04em] text-[#f2efe8] sm:text-6xl lg:text-7xl">Send it</span>
                                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#57534c] text-2xl text-[#f2efe8] transition-all duration-500 group-hover:-rotate-45 group-hover:border-[#f2efe8] group-hover:bg-[#f2efe8] group-hover:text-[#0a0a0a] sm:h-20 sm:w-20 sm:text-3xl">
                                        <HiArrowRight aria-hidden="true" />
                                    </span>
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="mt-14 grid gap-8 text-sm leading-6 text-[#8c877d] md:grid-cols-3">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5f5b53]">Write</p>
                            <a
                                href="#northlight-email"
                                className="mt-2 inline-block text-lg text-[#f2efe8] underline decoration-[#57534c] underline-offset-4 hover:decoration-[#f2efe8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2efe8]"
                            >
                                hello@northlight.studio
                            </a>
                            <p>Replies Monday to Thursday.</p>
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5f5b53]">Call</p>
                            <a
                                href="#northlight-call"
                                className="mt-2 inline-block text-lg text-[#f2efe8] underline decoration-[#57534c] underline-offset-4 hover:decoration-[#f2efe8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2efe8]"
                            >
                                +44 20 7946 0321
                            </a>
                            <p>Ask for Signe Aalto, new business.</p>
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5f5b53]">Visit</p>
                            <p className="mt-2 text-lg text-[#f2efe8]">Studio 4, 11 Calvert Avenue</p>
                            <p>London E2 7JP · coffee is on us.</p>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default UnderlineTypeContactForm

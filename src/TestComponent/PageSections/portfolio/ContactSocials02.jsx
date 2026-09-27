// FormAndLinksContactSocials

// ContactSocials02 · Portfolios & Personal Websites › Contact / Socials

// Description:
// A calm, letter-like contact section for product designer Elena Rossi. The serif heading
// "Tell me what you’re making." sits over four large link rows (GitHub, LinkedIn, Dribbble,
// Email), while a paper card on the right holds a short message form: topic chips, name,
// email and a 600-character note with a "Send note" button. Submitting a valid form swaps
// in a "Grazie, …!" confirmation with a reply-by date. Use it as the contact block of a
// designer portfolio or personal site.

// Design:
// - Split layout from lg (grid-cols-[1fr_1.05fr]): heading, intro, availability meta and
//   link rows on the left; a rounded-[32px] #fdf6f2 form card with a rotated stamp right
// - Blush #f7e8e1 background, espresso #3b2a24 text/buttons, terracotta #b5654a accents,
//   error red #a33a22; hairline espresso/15 dividers and a soft espresso card shadow
// - Serif display (text-4xl → lg:text-6xl) and serif link labels; underline-only inputs in
//   serif text-xl; small uppercase tracking labels; pill topic chips
// - Link rows italicise and slide their arrow disc to espresso on hover; form ↔ success
//   crossfade with AnimatePresence (no offset for reduced motion)
// - Responsive: base single column (links, then form) with stacked name/email; sm puts
//   name and email side by side; lg becomes the two-column split with larger type

// What it does:
// - Controlled fields (topic, name, email, message) validate on blur and on submit: name
//   ≥ 2 characters, a valid email, message 20–600 characters; errors are linked with
//   aria-describedby/aria-invalid and the first invalid field receives focus
// - A valid submit (preventDefault, no network) shows "Sending…" for 0.9 s (timer cleared
//   on unmount), then a focused success panel with a reply-by date two working days ahead
//   and a "Send another note" reset
// - Link rows point to #github, #linkedin, #dribbble and #email

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FormAndLinksContactSocials from '@/TestComponent/PageSections/portfolio/ContactSocials02';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <FormAndLinksContactSocials />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FaDribbble, FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { HiArrowUpRight, HiCheck, HiOutlineEnvelope } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const links = [
    { id: 'github', label: 'GitHub', handle: 'github.com/elenarossi', note: 'Figma plugins & side projects', icon: FaGithub },
    { id: 'linkedin', label: 'LinkedIn', handle: 'in/elena-rossi-design', note: '12 years of work history', icon: FaLinkedinIn },
    { id: 'dribbble', label: 'Dribbble', handle: 'dribbble.com/elenarossi', note: 'Shots, explorations, type', icon: FaDribbble },
    { id: 'email', label: 'Email', handle: 'ciao@elenarossi.studio', note: 'The fastest way to reach me', icon: HiOutlineEnvelope },
]

const topics = ['Product design', 'Design system', 'Research sprint', 'Just saying ciao']
const MAX = 600
const EMPTY = { topic: topics[0], name: '', email: '', message: '' }
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function validate(values) {
    const errors = {}
    if (values.name.trim().length < 2) errors.name = 'Please add your name (at least 2 letters).'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'That email doesn’t look right — try name@studio.com.'
    const length = values.message.trim().length
    if (length < 20) errors.message = `A little more, please — ${20 - length} more characters.`
    else if (length > MAX) errors.message = `Keep it under ${MAX} characters.`
    return errors
}

function replyByLabel() {
    const date = new Date()
    let added = 0
    while (added < 2) {
        date.setDate(date.getDate() + 1)
        if (date.getDay() !== 0 && date.getDay() !== 6) added += 1
    }
    return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`
}

const inputClass =
    'mt-1 w-full rounded-none border-0 border-b bg-transparent px-0 py-2.5 font-serif text-xl text-[#3b2a24] placeholder:text-[#3b2a24]/35 transition-colors focus:outline-none focus:ring-0'

export function FormAndLinksContactSocials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [values, setValues] = useState(EMPTY)
    const [touched, setTouched] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [status, setStatus] = useState('idle')
    const [receipt, setReceipt] = useState(null)
    const fieldRefs = { name: useRef(null), email: useRef(null), message: useRef(null) }
    const successRef = useRef(null)
    const timer = useRef(null)

    useEffect(() => () => clearTimeout(timer.current), [])

    useEffect(() => {
        if (status === 'sent') successRef.current?.focus()
    }, [status])

    const errors = validate(values)
    const show = (field) => (touched[field] || submitted) && errors[field]

    const update = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))
    const blur = (field) => () => setTouched((prev) => ({ ...prev, [field]: true }))

    const handleSubmit = (event) => {
        event.preventDefault()
        if (status === 'sending') return
        setSubmitted(true)
        const first = ['name', 'email', 'message'].find((field) => errors[field])
        if (first) {
            fieldRefs[first].current?.focus()
            return
        }
        setStatus('sending')
        timer.current = setTimeout(() => {
            setReceipt({
                firstName: values.name.trim().split(/\s+/)[0],
                topic: values.topic,
                replyBy: replyByLabel(),
                ref: `ER-${String(Date.now()).slice(-4)}`,
            })
            setStatus('sent')
        }, 900)
    }

    const reset = () => {
        setValues(EMPTY)
        setTouched({})
        setSubmitted(false)
        setReceipt(null)
        setStatus('idle')
    }

    const fade = {
        initial: { opacity: 0, y: reduceMotion ? 0 : 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: reduceMotion ? 0 : -8 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f7e8e1] px-4 py-16 text-base font-normal text-[#3b2a24] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b5654a]">
                        Contact — Elena Rossi
                    </p>
                    <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#3b2a24] sm:text-5xl lg:text-6xl">
                        Tell me what <br className="hidden sm:block" />
                        you’re <em className="text-[#b5654a]">making.</em>
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#3b2a24]/75">
                        I take on two product engagements a quarter and read every note myself. Short is
                        perfect — a link, a sentence, a deadline.
                    </p>
                    <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 text-sm">
                        <div>
                            <dt className="text-[11px] uppercase tracking-[0.2em] text-[#3b2a24]/55">Based in</dt>
                            <dd className="mt-1 font-serif text-lg text-[#3b2a24]">Milan · CET</dd>
                        </div>
                        <div>
                            <dt className="text-[11px] uppercase tracking-[0.2em] text-[#3b2a24]/55">Next opening</dt>
                            <dd className="mt-1 font-serif text-lg text-[#3b2a24]">January 2027</dd>
                        </div>
                    </dl>

                    <ul className="mt-10 border-b border-[#3b2a24]/15">
                        {links.map((link) => {
                            const Icon = link.icon
                            return (
                                <li key={link.id} className="border-t border-[#3b2a24]/15">
                                    <a
                                        href={`#${link.id}`}
                                        className="group grid min-h-[76px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b5654a]"
                                    >
                                        <span className="grid size-11 place-items-center rounded-full ring-1 ring-[#3b2a24]/20">
                                            <Icon aria-hidden="true" className="size-[18px]" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block font-serif text-2xl leading-tight text-[#3b2a24] transition-all duration-300 group-hover:translate-x-1 group-hover:italic motion-reduce:group-hover:translate-x-0 sm:text-3xl">
                                                {link.label}
                                            </span>
                                            <span className="mt-0.5 block truncate text-xs text-[#3b2a24]/60">
                                                <span className="font-medium text-[#3b2a24]/80">{link.handle}</span>
                                                <span className="hidden sm:inline"> · {link.note}</span>
                                            </span>
                                        </span>
                                        <span className="grid size-10 place-items-center rounded-full bg-[#3b2a24]/[0.06] transition-colors duration-300 group-hover:bg-[#3b2a24] group-hover:text-[#f7e8e1]">
                                            <HiArrowUpRight
                                                aria-hidden="true"
                                                className="size-4 transition-transform duration-300 group-hover:rotate-45"
                                            />
                                        </span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="relative self-start rounded-[32px] bg-[#fdf6f2] p-6 shadow-[0_40px_80px_-50px_rgba(59,42,36,0.55)] ring-1 ring-[#3b2a24]/10 sm:p-10">
                    <div
                        aria-hidden="true"
                        className="absolute right-5 top-5 grid size-20 rotate-6 place-items-center rounded-md border-2 border-dashed border-[#b5654a]/60 text-center font-serif text-[11px] italic leading-tight text-[#b5654a] sm:right-8 sm:top-8 sm:size-24 sm:text-xs"
                    >
                        Posta
                        <br />
                        Milano
                        <br />
                        2026
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        {status === 'sent' && receipt ? (
                            <motion.div key="sent" {...fade} className="flex min-h-[520px] flex-col justify-center sm:min-h-[585px]">
                                <div ref={successRef} tabIndex={-1} role="status" className="focus:outline-none">
                                    <span className="grid size-14 place-items-center rounded-full bg-[#3b2a24] text-[#f7e8e1]">
                                        <HiCheck aria-hidden="true" className="size-7" />
                                    </span>
                                    <h3 className="mt-8 font-serif text-4xl font-normal leading-tight text-[#3b2a24] sm:text-5xl">
                                        Grazie, {receipt.firstName}!
                                    </h3>
                                    <p className="mt-4 max-w-md text-base leading-relaxed text-[#3b2a24]/75">
                                        Your note about <em className="font-serif text-[#b5654a]">{receipt.topic.toLowerCase()}</em>{' '}
                                        is in my inbox. I reply to everything within two working days — expect
                                        something by <strong className="font-semibold text-[#3b2a24]">{receipt.replyBy}</strong>.
                                    </p>
                                    <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[#3b2a24]/50">
                                        Ref {receipt.ref} · sent to ciao@elenarossi.studio
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="mt-10 inline-flex min-h-11 items-center self-start rounded-full px-5 text-sm font-semibold text-[#3b2a24] ring-1 ring-[#3b2a24]/30 transition-colors hover:bg-[#3b2a24] hover:text-[#f7e8e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5654a]"
                                    onClick={reset}
                                >
                                    Send another note
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form key="form" {...fade} noValidate onSubmit={handleSubmit}>
                                <h3 className="max-w-[70%] font-serif text-2xl font-normal leading-tight text-[#3b2a24] sm:text-3xl">
                                    Write me a note
                                </h3>
                                <p className="mt-2 max-w-[70%] text-sm text-[#3b2a24]/60">All fields are required.</p>

                                <fieldset className="mt-8">
                                    <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3b2a24]/60">
                                        What’s it about?
                                    </legend>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {topics.map((topic) => {
                                            const active = values.topic === topic
                                            return (
                                                <label
                                                    key={topic}
                                                    className={cn(
                                                        'inline-flex min-h-10 cursor-pointer items-center rounded-full px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#b5654a]',
                                                        active
                                                            ? 'bg-[#3b2a24] text-[#f7e8e1]'
                                                            : 'text-[#3b2a24] ring-1 ring-[#3b2a24]/20 hover:ring-[#3b2a24]/50',
                                                    )}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="elena-topic"
                                                        value={topic}
                                                        checked={active}
                                                        className="sr-only"
                                                        onChange={() => setValues((prev) => ({ ...prev, topic }))}
                                                    />
                                                    {topic}
                                                </label>
                                            )
                                        })}
                                    </div>
                                </fieldset>

                                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                                    {['name', 'email'].map((field) => (
                                        <div key={field}>
                                            <label
                                                htmlFor={`elena-${field}`}
                                                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3b2a24]/60"
                                            >
                                                {field === 'name' ? 'Your name' : 'Email'}
                                            </label>
                                            <input
                                                ref={fieldRefs[field]}
                                                id={`elena-${field}`}
                                                type={field === 'email' ? 'email' : 'text'}
                                                autoComplete={field === 'email' ? 'email' : 'name'}
                                                placeholder={field === 'email' ? 'you@company.com' : 'Maya Lindholm'}
                                                value={values[field]}
                                                aria-invalid={show(field) ? true : undefined}
                                                aria-describedby={show(field) ? `elena-${field}-error` : undefined}
                                                className={cn(
                                                    inputClass,
                                                    show(field)
                                                        ? 'border-[#a33a22]'
                                                        : 'border-[#3b2a24]/30 focus:border-[#3b2a24]',
                                                )}
                                                onChange={update(field)}
                                                onBlur={blur(field)}
                                            />
                                            {show(field) && (
                                                <p id={`elena-${field}-error`} className="mt-2 text-xs text-[#a33a22]">
                                                    {errors[field]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-baseline justify-between gap-4">
                                        <label
                                            htmlFor="elena-message"
                                            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3b2a24]/60"
                                        >
                                            Message
                                        </label>
                                        <span
                                            className={cn(
                                                'font-mono text-[11px] tabular-nums',
                                                values.message.length > MAX ? 'text-[#a33a22]' : 'text-[#3b2a24]/50',
                                            )}
                                        >
                                            {values.message.length}/{MAX}
                                        </span>
                                    </div>
                                    <textarea
                                        ref={fieldRefs.message}
                                        id="elena-message"
                                        rows={4}
                                        placeholder="We’re a 12-person fintech team redesigning onboarding for March…"
                                        value={values.message}
                                        aria-invalid={show('message') ? true : undefined}
                                        aria-describedby={show('message') ? 'elena-message-error' : undefined}
                                        className={cn(
                                            inputClass,
                                            'resize-none leading-snug',
                                            show('message')
                                                ? 'border-[#a33a22]'
                                                : 'border-[#3b2a24]/30 focus:border-[#3b2a24]',
                                        )}
                                        onChange={update('message')}
                                        onBlur={blur('message')}
                                    />
                                    {show('message') && (
                                        <p id="elena-message-error" className="mt-2 text-xs text-[#a33a22]">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-[#3b2a24]/55">Replies within two working days.</p>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#3b2a24] px-7 text-sm font-semibold text-[#f7e8e1] transition-colors hover:bg-[#b5654a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5654a] disabled:cursor-wait disabled:opacity-80"
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <span
                                                    aria-hidden="true"
                                                    className="size-4 animate-spin rounded-full border-2 border-[#f7e8e1]/30 border-t-[#f7e8e1] motion-reduce:animate-none"
                                                />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                Send note
                                                <HiArrowUpRight
                                                    aria-hidden="true"
                                                    className="size-4 transition-transform duration-300 group-hover:rotate-45"
                                                />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default FormAndLinksContactSocials

// PostageStampNewsletterCard

// NewsletterCard01 · Blogs & Digital Media › Newsletter Subscription Card

// Description:
// An air-mail envelope sign-up card for the weekly essay newsletter The Sunday Letter. The
// serif heading "Good letters still arrive on Sundays." sits beside an address-block form
// ("Name on the envelope", "Email address", "Seal & send") under a perforated postage stamp.
// A valid submit cancels the stamp with a postmark and shows "Sealed & posted." Use it at
// the end of an essay, on an about page or as a standalone newsletter sign-up section.

// Design:
// - Cream #f6efe3 section; a paper #fbf7ef envelope framed by a red #c1121f / navy #1d2d50
//   air-mail stripe border (repeating-linear-gradient) with a faint SVG flap crease
// - Stamp: radial-gradient mask perforation around a 4:5 fountain-pen photo, rotated 3deg
//   with a drop-shadow; the postmark is an SVG double ring, circular text and cancel waves
// - Serif display heading text-4xl → sm:text-5xl → lg:text-6xl with an italic red word; mono
//   small-caps labels; ruled "address line" inputs; red button with a hard navy offset shadow
// - The postmark lands with a spring (scale 1.6 → 1, rotate) and the form cross-fades into
//   the success note; with reduced motion both become a plain fade
// - Responsive: stacked with the stamp top-right at base; md:grid-cols-[1.15fr_1fr] puts the
//   form in its own dashed-rule column; envelope padding p-5 → sm:p-8 → lg:p-14

// What it does:
// - Controlled name + email inputs; submit validates the email (empty / malformed) and shows
//   an inline error with aria-invalid, re-checking live while the error is visible
// - A valid submit stores the address, stamps today's date on the postmark and computes the
//   next Sunday for the delivery note; "Use a different address" resets and refocuses email
// - The success note is announced via role="status"; the return address, stripes and stamp
//   art are visual only; nothing is sent over the network

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PostageStampNewsletterCard from '@/TestComponent/PageSections/media/NewsletterCard01';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <PostageStampNewsletterCard />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowUturnLeft, HiOutlinePaperAirplane } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const PERFORATION =
    'radial-gradient(circle 4px at 6px 6px, #0000 95%, #000) -6px -6px / 12px 12px round, linear-gradient(#000 0 0) content-box'
const perforated = { WebkitMask: PERFORATION, mask: PERFORATION }
const airmail = {
    backgroundImage:
        'repeating-linear-gradient(135deg, #c1121f 0 16px, #fbf7ef 16px 26px, #1d2d50 26px 42px, #fbf7ef 42px 52px)',
}
const ruled = {
    backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 31px, rgba(29,45,80,0.07) 31px 32px)',
}

const perks = [
    { label: 'Arrives', value: 'Sundays, 7:00 am' },
    { label: 'Length', value: 'An 8-minute read' },
    { label: 'Readers', value: '61,400 and counting' },
]

const pad = (n) => String(n).padStart(2, '0')

function validate(value) {
    const v = value.trim()
    if (!v) return 'We need an address to post it to.'
    if (!EMAIL_RE.test(v)) return 'That address looks smudged. Check the @ and the domain.'
    return ''
}

export function PostageStampNewsletterCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [posted, setPosted] = useState(null)
    const refocusEmail = useRef(false)

    const nameId = `${uid}-name`
    const emailId = `${uid}-email`
    const errorId = `${uid}-error`
    const arcId = `${uid}-arc`

    const handleSubmit = (event) => {
        event.preventDefault()
        const message = validate(email)
        setError(message)
        if (message) return
        const today = new Date()
        const sunday = new Date(today)
        sunday.setDate(today.getDate() + ((7 - today.getDay()) % 7 || 7))
        setPosted({
            email: email.trim(),
            first: name.trim().split(/\s+/)[0] || '',
            day: DAYS[today.getDay()],
            mark: `${pad(today.getDate())} ${MONTHS[today.getMonth()]} ${String(today.getFullYear()).slice(2)}`,
            arrives: sunday.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
        })
    }

    const reset = () => {
        refocusEmail.current = true
        setPosted(null)
        setEmail('')
        setError('')
    }

    const fade = reduceMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f6efe3] px-4 py-16 text-base font-normal text-[#1d2d50] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#1d2d50]/70">
                    <span>The Sunday Letter · Issue No. 364</span>
                    <span className="text-[#c1121f]">Postage paid · Weekly</span>
                </div>

                <div
                    className="rounded-[10px] p-2.5 shadow-[0_40px_70px_-40px_rgba(29,45,80,0.55)] sm:p-3"
                    style={airmail}
                >
                    <div className="relative overflow-hidden rounded-[4px] bg-[#fbf7ef] p-5 sm:p-8 lg:p-14">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 100 50"
                            preserveAspectRatio="none"
                            className="pointer-events-none absolute inset-x-0 top-0 h-[58%] w-full text-[#1d2d50]/10"
                        >
                            <path
                                d="M0 0 L50 50 L100 0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>

                        <div className="relative flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <div className="inline-flex flex-col border-2 border-[#1d2d50] px-3 py-2">
                                    <span className="text-sm font-black uppercase tracking-[0.24em] text-[#1d2d50]">
                                        Par avion
                                    </span>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#1d2d50]/70">
                                        By air mail · Priority
                                    </span>
                                </div>
                                <p className="mt-4 max-w-[15rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-[#1d2d50]/60">
                                    From: Iris Calloway
                                    <br />
                                    14 Larkin Row, Bath BA1 2QT
                                </p>
                            </div>

                            <div className="relative w-24 shrink-0 rotate-3 sm:w-32 lg:w-36">
                                <div className="drop-shadow-[0_8px_10px_rgba(29,45,80,0.28)]">
                                    <div className="bg-[#fffdf8] p-[6px]" style={perforated}>
                                        <div className="bg-[#fffdf8] p-1.5 sm:p-2">
                                            <div className="relative overflow-hidden border border-[#1d2d50]/20">
                                                <img
                                                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80"
                                                    alt="Fountain pen writing on cream paper"
                                                    loading="lazy"
                                                    className="aspect-[4/5] w-full object-cover sepia-[0.35] saturate-[0.85]"
                                                />
                                                <span className="absolute left-1.5 top-1 font-serif text-lg font-bold leading-none text-[#fbf7ef] [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:text-2xl">
                                                    52
                                                </span>
                                            </div>
                                            <p className="mt-1.5 text-center font-mono text-[7px] uppercase tracking-[0.2em] text-[#1d2d50] sm:text-[8px]">
                                                The Sunday Letter
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {posted && (
                                        <motion.svg
                                            key="postmark"
                                            aria-hidden="true"
                                            viewBox="0 0 220 128"
                                            className="pointer-events-none absolute -left-16 top-[38%] w-[150px] text-[#1d2d50] mix-blend-multiply sm:-left-24 sm:w-[200px]"
                                            initial={
                                                reduceMotion
                                                    ? { opacity: 0, rotate: -9 }
                                                    : { opacity: 0, scale: 1.6, rotate: -26 }
                                            }
                                            animate={{ opacity: 0.88, scale: 1, rotate: -9 }}
                                            exit={{ opacity: 0 }}
                                            transition={
                                                reduceMotion
                                                    ? { duration: 0.3 }
                                                    : { type: 'spring', stiffness: 420, damping: 17 }
                                            }
                                        >
                                            <defs>
                                                <path id={arcId} d="M 158 64 m -41 0 a 41 41 0 1 1 82 0 a 41 41 0 1 1 -82 0" />
                                            </defs>
                                            <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                                                {[36, 50, 64, 78, 92].map((y) => (
                                                    <path
                                                        key={y}
                                                        d={`M4 ${y} q 9 -7 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0`}
                                                    />
                                                ))}
                                                <circle cx="158" cy="64" r="50" />
                                                <circle cx="158" cy="64" r="32" strokeWidth="1.6" />
                                            </g>
                                            <text
                                                fill="currentColor"
                                                fontFamily="ui-monospace, monospace"
                                                fontSize="9"
                                                fontWeight="700"
                                            >
                                                <textPath href={`#${arcId}`} textLength="252" lengthAdjust="spacing">
                                                    THE SUNDAY LETTER ✦ SUBSCRIBED ✦
                                                </textPath>
                                            </text>
                                            <text
                                                x="158"
                                                y="60"
                                                textAnchor="middle"
                                                fill="currentColor"
                                                fontFamily="ui-monospace, monospace"
                                                fontSize="10"
                                                fontWeight="700"
                                            >
                                                {posted.day}
                                            </text>
                                            <text
                                                x="158"
                                                y="75"
                                                textAnchor="middle"
                                                fill="currentColor"
                                                fontFamily="ui-monospace, monospace"
                                                fontSize="10"
                                                fontWeight="700"
                                            >
                                                {posted.mark}
                                            </text>
                                        </motion.svg>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="relative mt-10 grid gap-12 md:grid-cols-[1.15fr_1fr] md:gap-10 lg:mt-6 lg:gap-16">
                            <div>
                                <h2 className="max-w-xl font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#1d2d50] sm:text-5xl lg:text-6xl">
                                    Good letters still arrive on <em className="text-[#c1121f]">Sundays.</em>
                                </h2>
                                <p className="mt-5 max-w-md text-base leading-relaxed text-[#1d2d50]/75">
                                    One long, unhurried letter a week: a personal essay, three things worth your
                                    evening and a reply to a reader’s question. No news, no hot takes, no hurry.
                                </p>
                                <p className="mt-5 font-serif text-lg italic text-[#1d2d50]/80">
                                    Yours, Iris Calloway, editor
                                </p>
                                <dl className="mt-8 grid max-w-md grid-cols-3 gap-3 border-t border-[#1d2d50]/15 pt-5">
                                    {perks.map((perk) => (
                                        <div key={perk.label}>
                                            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c1121f]">
                                                {perk.label}
                                            </dt>
                                            <dd className="mt-1 font-serif text-sm leading-snug text-[#1d2d50] sm:text-base">
                                                {perk.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="md:border-l md:border-dashed md:border-[#1d2d50]/25 md:pl-10 lg:pl-12">
                                <AnimatePresence mode="wait" initial={false}>
                                    {posted ? (
                                        <motion.div
                                            key="posted"
                                            role="status"
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            {...fade}
                                        >
                                            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#c1121f]">
                                                Postmarked {posted.mark}
                                            </p>
                                            <h3
                                                ref={(el) => el?.focus()}
                                                tabIndex={-1}
                                                className="mt-4 font-serif text-3xl font-normal leading-tight text-[#1d2d50] outline-none sm:text-4xl"
                                            >
                                                Sealed &amp; posted.
                                            </h3>
                                            <p className="mt-4 text-base leading-relaxed text-[#1d2d50]/80">
                                                {posted.first ? `Thank you, ${posted.first}. ` : ''}Your first letter is
                                                on its way to{' '}
                                                <strong className="break-all font-semibold text-[#1d2d50]">
                                                    {posted.email}
                                                </strong>{' '}
                                                and lands on {posted.arrives}, a little after 7 am.
                                            </p>
                                            <ul className="mt-6 space-y-2.5 border-t border-dashed border-[#1d2d50]/25 pt-5 text-sm leading-relaxed text-[#1d2d50]/75">
                                                <li className="flex gap-3">
                                                    <span className="font-mono text-[#c1121f]">01</span>
                                                    Add letters@thesundayletter.co to your contacts.
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="font-mono text-[#c1121f]">02</span>
                                                    Reply to any letter. Iris reads every one.
                                                </li>
                                            </ul>
                                            <button
                                                type="button"
                                                className="mt-7 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#1d2d50] underline decoration-[#c1121f] decoration-2 underline-offset-[6px] hover:text-[#c1121f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c1121f]"
                                                onClick={reset}
                                            >
                                                <HiArrowUturnLeft aria-hidden="true" className="size-4" />
                                                Use a different address
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            noValidate
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            onSubmit={handleSubmit}
                                            {...fade}
                                        >
                                            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#c1121f]">
                                                Deliver to
                                            </p>
                                            <div className="mt-5 space-y-6 px-0.5" style={ruled}>
                                                <div>
                                                    <label
                                                        htmlFor={nameId}
                                                        className="block font-mono text-[10px] uppercase tracking-[0.24em] text-[#1d2d50]/60"
                                                    >
                                                        Name on the envelope{' '}
                                                        <span className="normal-case tracking-normal">(optional)</span>
                                                    </label>
                                                    <input
                                                        id={nameId}
                                                        type="text"
                                                        autoComplete="name"
                                                        placeholder="Ada Whitlock"
                                                        value={name}
                                                        className="mt-1 block min-h-11 w-full border-0 border-b-2 border-[#1d2d50]/25 bg-transparent px-0 py-2 font-serif text-xl italic text-[#1d2d50] transition-colors placeholder:text-[#1d2d50]/30 focus:border-[#1d2d50] focus:outline-none"
                                                        onChange={(event) => setName(event.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor={emailId}
                                                        className="block font-mono text-[10px] uppercase tracking-[0.24em] text-[#1d2d50]/60"
                                                    >
                                                        Email address
                                                    </label>
                                                    <input
                                                        ref={(el) => {
                                                            if (el && refocusEmail.current) {
                                                                refocusEmail.current = false
                                                                el.focus()
                                                            }
                                                        }}
                                                        id={emailId}
                                                        type="email"
                                                        inputMode="email"
                                                        autoComplete="email"
                                                        placeholder="ada@whitlock.studio"
                                                        value={email}
                                                        aria-invalid={Boolean(error)}
                                                        aria-describedby={error ? errorId : undefined}
                                                        className={cn(
                                                            'mt-1 block min-h-11 w-full border-0 border-b-2 bg-transparent px-0 py-2 font-serif text-xl italic text-[#1d2d50] transition-colors placeholder:text-[#1d2d50]/30 focus:outline-none',
                                                            error
                                                                ? 'border-[#c1121f]'
                                                                : 'border-[#1d2d50]/25 focus:border-[#1d2d50]',
                                                        )}
                                                        onChange={(event) => {
                                                            setEmail(event.target.value)
                                                            if (error) setError(validate(event.target.value))
                                                        }}
                                                    />
                                                    <p
                                                        id={errorId}
                                                        aria-live="polite"
                                                        className="mt-2 min-h-5 text-sm font-medium text-[#c1121f]"
                                                    >
                                                        {error}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-[3px] bg-[#c1121f] px-7 font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#fbf7ef] shadow-[4px_4px_0_#1d2d50] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1d2d50] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d2d50] active:translate-y-0 active:shadow-[2px_2px_0_#1d2d50] motion-reduce:transition-none sm:w-auto"
                                            >
                                                <HiOutlinePaperAirplane aria-hidden="true" className="size-4" />
                                                Seal &amp; send
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm leading-relaxed text-[#1d2d50]/70">
                    No spam, no tracking pixels. Unsubscribe with one click from the foot of any letter.
                </p>
            </div>
        </section>
    )
}

export default PostageStampNewsletterCard

// TopicPickerNewsletterCard

// NewsletterCard04 · Blogs & Digital Media › Newsletter Subscription Card

// Description:
// A build-your-own-briefing sign-up for Morning Atlas, framed like a map legend. A navy
// chart panel ("Chart your own morning.") with a compass rose summarises the edition live,
// while the form walks through three steps: pick beats (12 multi-select topic chips), choose
// Daily or Weekly, and enter an email ("Plot my edition"). The success view lists the chosen
// beats, frequency and first delivery. Use it where readers can personalise a newsletter.

// Design:
// - Sand #f5ede0 section with faint navy topographic contour lines; the card is split into
//   a navy #102a43 chart panel and a lighter #fbf6ee form panel, rounded-[28px], soft shadow
// - Serif display heading in sand on navy (text-4xl → lg:text-5xl); mono coordinates and
//   step numbers ("01 / Beats"); chips are 40px pills that fill navy with a check when picked
// - Frequency uses real radio inputs as cards (peer-checked fills navy); the compass needle
//   springs 30deg per picked beat; form ↔ summary cross-fade (plain fade for reduced motion)
// - Responsive: panels stack at base and sit side by side on lg (0.85fr / 1.15fr); radio
//   cards stack at base and pair on sm; padding p-6 → sm:p-10 → lg:p-12

// What it does:
// - selected (array of topic ids, three preset), frequency ("daily" | "weekly") and email
//   are controlled state; the chart panel recomputes beats, read time (~minutes) and legend
// - Submit validates at least one beat and a well-formed email, showing inline errors with
//   aria-invalid; on success it shows the summary (role="status")
// - "Clear" empties the beats, "Edit choices" returns to the form with everything kept;
//   "See a sample edition" links to #morning-atlas-sample

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TopicPickerNewsletterCard from '@/TestComponent/PageSections/media/NewsletterCard04';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <TopicPickerNewsletterCard />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    TbArrowRight,
    TbAtom,
    TbBallFootball,
    TbBook,
    TbBuildingSkyscraper,
    TbChartLine,
    TbCheck,
    TbCompass,
    TbCpu,
    TbHeartbeat,
    TbLeaf,
    TbMasksTheater,
    TbPencil,
    TbPlane,
    TbToolsKitchen2,
    TbWorld,
} from 'react-icons/tb';
import { cn } from '@/design-system/lib/cn';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const topics = [
    { id: 'geopolitics', label: 'Geopolitics', icon: TbWorld, mins: 3 },
    { id: 'climate', label: 'Climate', icon: TbLeaf, mins: 2 },
    { id: 'markets', label: 'Markets', icon: TbChartLine, mins: 2 },
    { id: 'science', label: 'Science', icon: TbAtom, mins: 2 },
    { id: 'cities', label: 'Cities', icon: TbBuildingSkyscraper, mins: 2 },
    { id: 'culture', label: 'Culture', icon: TbMasksTheater, mins: 2 },
    { id: 'technology', label: 'Technology', icon: TbCpu, mins: 2 },
    { id: 'food', label: 'Food', icon: TbToolsKitchen2, mins: 1 },
    { id: 'travel', label: 'Travel', icon: TbPlane, mins: 2 },
    { id: 'health', label: 'Health', icon: TbHeartbeat, mins: 2 },
    { id: 'books', label: 'Books', icon: TbBook, mins: 1 },
    { id: 'sport', label: 'Sport', icon: TbBallFootball, mins: 1 },
]

const frequencies = [
    { id: 'daily', label: 'Daily', detail: 'Mon–Fri at 6:00 am', first: 'Tomorrow, 6:00 am' },
    { id: 'weekly', label: 'Weekly', detail: 'Sundays at 8:00 am, the week in one read', first: 'Sunday, 8:00 am' },
]

const legendMarks = ['rounded-full', 'rotate-45', 'rounded-[2px]', 'rounded-full border-2 bg-transparent']

const contour =
    'M0 -90 C 55 -92 98 -48 96 4 C 94 58 52 88 -2 90 C -60 92 -100 50 -96 -6 C -92 -58 -52 -88 0 -90 Z'

function estimate(selected, frequency) {
    const base = selected.reduce((sum, id) => sum + (topics.find((t) => t.id === id)?.mins ?? 0), 0)
    return frequency === 'weekly' ? base * 3 + 2 : base + 1
}

export function TopicPickerNewsletterCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [selected, setSelected] = useState(['geopolitics', 'climate', 'cities'])
    const [frequency, setFrequency] = useState('daily')
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({})
    const [done, setDone] = useState(null)

    const minutes = estimate(selected, frequency)
    const chosen = topics.filter((t) => selected.includes(t.id))
    const freq = frequencies.find((f) => f.id === frequency)

    const toggle = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
        if (errors.topics) setErrors((prev) => ({ ...prev, topics: '' }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const value = email.trim()
        const next = {
            topics: selected.length ? '' : 'Pick at least one beat to plot your edition.',
            email: !value
                ? 'We need an email address to deliver to.'
                : EMAIL_RE.test(value)
                  ? ''
                  : 'Check that address: it needs an @ and a domain.',
        }
        setErrors(next)
        if (next.topics || next.email) return
        setDone({ email: value })
    }

    const fade = reduceMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -18 } }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f5ede0] px-4 py-16 text-base font-normal text-[#102a43] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <svg
                aria-hidden="true"
                viewBox="-200 -200 400 400"
                className="pointer-events-none absolute -right-40 -top-40 size-[720px] text-[#102a43]/[0.09]"
            >
                {[0.35, 0.6, 0.85, 1.1, 1.35, 1.6, 1.85].map((k) => (
                    <path
                        key={k}
                        d={contour}
                        transform={`rotate(${k * 24}) scale(${k})`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
            </svg>

            <div className="relative mx-auto max-w-6xl">
                <div className="grid overflow-hidden rounded-[28px] border border-[#102a43]/15 shadow-[0_30px_80px_-40px_rgba(16,42,67,0.55)] lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="relative overflow-hidden bg-[#102a43] p-6 text-[#f5ede0] sm:p-10 lg:p-12">
                        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.26em] text-[#f5ede0]/70">
                            <TbCompass aria-hidden="true" className="size-4" />
                            Morning Atlas
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#f5ede0] lg:text-5xl">
                            Chart your own <em>morning.</em>
                        </h2>
                        <p className="mt-4 max-w-sm text-base leading-relaxed text-[#f5ede0]/70">
                            Pick the beats you care about. Our desks in six cities write one briefing
                            around them, and leave out everything else.
                        </p>

                        <div className="mt-8 flex items-center gap-6">
                            <svg viewBox="0 0 200 200" aria-hidden="true" className="size-28 shrink-0 sm:size-32">
                                <circle cx="100" cy="100" r="92" fill="none" stroke="#f5ede0" strokeOpacity="0.25" />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="78"
                                    fill="none"
                                    stroke="#f5ede0"
                                    strokeOpacity="0.4"
                                    strokeDasharray="2 6"
                                />
                                <path
                                    d="M100 22 L108 92 L178 100 L108 108 L100 178 L92 108 L22 100 L92 92 Z"
                                    fill="#f5ede0"
                                    fillOpacity="0.12"
                                    stroke="#f5ede0"
                                    strokeOpacity="0.35"
                                />
                                {[
                                    ['N', 100, 16],
                                    ['E', 188, 104],
                                    ['S', 100, 194],
                                    ['W', 12, 104],
                                ].map(([letter, x, y]) => (
                                    <text
                                        key={letter}
                                        x={x}
                                        y={y}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fontFamily="ui-monospace, monospace"
                                        fill="#f5ede0"
                                        fillOpacity="0.7"
                                    >
                                        {letter}
                                    </text>
                                ))}
                                <motion.g
                                    initial={false}
                                    animate={{ rotate: selected.length * 30 }}
                                    transition={
                                        reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 11 }
                                    }
                                >
                                    <path d="M100 34 L110 100 L90 100 Z" fill="#f5ede0" />
                                    <path d="M100 166 L110 100 L90 100 Z" fill="#f5ede0" fillOpacity="0.3" />
                                </motion.g>
                                <circle cx="100" cy="100" r="5" fill="#102a43" stroke="#f5ede0" strokeWidth="2" />
                            </svg>
                            <div className="min-w-0">
                                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5ede0]/50">
                                    Your edition
                                </p>
                                <p aria-live="polite" className="mt-2 font-serif text-2xl leading-tight text-[#f5ede0]">
                                    {selected.length} {selected.length === 1 ? 'beat' : 'beats'} · {freq.label}
                                </p>
                                <p className="mt-1 text-sm text-[#f5ede0]/60">
                                    {selected.length ? `About ${minutes} minutes to read` : 'Nothing plotted yet'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-[#f5ede0]/15 pt-5">
                            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5ede0]/50">Legend</p>
                            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#f5ede0]/85">
                                {chosen.length === 0 && <li className="col-span-2 text-[#f5ede0]/50">Pick a beat to begin.</li>}
                                {chosen.map((topic, index) => (
                                    <li key={topic.id} className="flex min-w-0 items-center gap-2.5">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'size-2.5 shrink-0 border-[#f5ede0] bg-[#f5ede0]',
                                                legendMarks[index % legendMarks.length],
                                            )}
                                        />
                                        <span className="truncate">{topic.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5ede0]/40">
                            51.5072° N · 0.1276° W · London desk
                        </p>
                    </div>

                    <div className="bg-[#fbf6ee] p-6 sm:p-10 lg:p-12">
                        <AnimatePresence mode="wait" initial={false}>
                            {done ? (
                                <motion.div
                                    key="done"
                                    role="status"
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    {...fade}
                                >
                                    <span className="grid size-12 place-items-center rounded-full bg-[#102a43] text-[#f5ede0]">
                                        <TbCheck aria-hidden="true" className="size-6" />
                                    </span>
                                    <h3 className="mt-5 font-serif text-3xl font-normal leading-tight text-[#102a43] sm:text-4xl">
                                        Your atlas is set.
                                    </h3>
                                    <p className="mt-3 max-w-md text-base leading-relaxed text-[#102a43]/70">
                                        We’ve plotted a {freq.label.toLowerCase()} edition around{' '}
                                        {chosen.length} {chosen.length === 1 ? 'beat' : 'beats'}. A confirmation link is
                                        waiting in your inbox.
                                    </p>

                                    <dl className="mt-8 divide-y divide-[#102a43]/10 border-y border-[#102a43]/10">
                                        <div className="grid gap-2 py-4 sm:grid-cols-[9rem_1fr]">
                                            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#102a43]/55">
                                                Beats
                                            </dt>
                                            <dd className="flex flex-wrap gap-2">
                                                {chosen.map((topic) => (
                                                    <span
                                                        key={topic.id}
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#102a43] px-3 py-1 text-sm text-[#f5ede0]"
                                                    >
                                                        <topic.icon aria-hidden="true" className="size-4" />
                                                        {topic.label}
                                                    </span>
                                                ))}
                                            </dd>
                                        </div>
                                        <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr]">
                                            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#102a43]/55">
                                                Frequency
                                            </dt>
                                            <dd className="text-[#102a43]">
                                                {freq.label} · {freq.detail}
                                            </dd>
                                        </div>
                                        <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr]">
                                            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#102a43]/55">
                                                Delivered to
                                            </dt>
                                            <dd className="break-all text-[#102a43]">{done.email}</dd>
                                        </div>
                                        <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr]">
                                            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#102a43]/55">
                                                First edition
                                            </dt>
                                            <dd className="text-[#102a43]">
                                                {freq.first} · about {minutes} min
                                            </dd>
                                        </div>
                                    </dl>

                                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                                        <button
                                            type="button"
                                            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[#102a43] px-5 text-sm font-semibold text-[#102a43] transition-colors hover:bg-[#102a43] hover:text-[#f5ede0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102a43]"
                                            onClick={() => setDone(null)}
                                        >
                                            <TbPencil aria-hidden="true" className="size-4" />
                                            Edit choices
                                        </button>
                                        <a
                                            href="#morning-atlas-sample"
                                            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102a43] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#102a43]"
                                        >
                                            See a sample edition
                                            <TbArrowRight aria-hidden="true" className="size-4" />
                                        </a>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    noValidate
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className="space-y-9"
                                    onSubmit={handleSubmit}
                                    {...fade}
                                >
                                    <fieldset>
                                        <legend className="sr-only">Pick your beats</legend>
                                        <div className="flex flex-wrap items-end justify-between gap-3">
                                            <p
                                                aria-hidden="true"
                                                className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#102a43]/60"
                                            >
                                                01 / Pick your beats
                                            </p>
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="tabular-nums text-[#102a43]/60">
                                                    {selected.length} of {topics.length}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={!selected.length}
                                                    className="min-h-10 px-1 font-semibold text-[#102a43] underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102a43]"
                                                    onClick={() => setSelected([])}
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {topics.map((topic) => {
                                                const on = selected.includes(topic.id)
                                                return (
                                                    <button
                                                        key={topic.id}
                                                        type="button"
                                                        aria-pressed={on}
                                                        className={cn(
                                                            'inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102a43]',
                                                            on
                                                                ? 'border-[#102a43] bg-[#102a43] text-[#f5ede0]'
                                                                : 'border-[#102a43]/20 bg-white/70 text-[#102a43] hover:border-[#102a43]/60',
                                                        )}
                                                        onClick={() => toggle(topic.id)}
                                                    >
                                                        {on ? (
                                                            <TbCheck aria-hidden="true" className="size-4" />
                                                        ) : (
                                                            <topic.icon aria-hidden="true" className="size-4" />
                                                        )}
                                                        {topic.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <p aria-live="polite" className="mt-2 min-h-5 text-sm font-medium text-[#b42318]">
                                            {errors.topics}
                                        </p>
                                    </fieldset>

                                    <fieldset>
                                        <legend className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#102a43]/60">
                                            02 / How often?
                                        </legend>
                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            {frequencies.map((option) => (
                                                <label key={option.id} className="relative block cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`${uid}-frequency`}
                                                        value={option.id}
                                                        checked={frequency === option.id}
                                                        className="peer sr-only"
                                                        onChange={() => setFrequency(option.id)}
                                                    />
                                                    <span className="flex h-full flex-col rounded-2xl border border-[#102a43]/20 bg-white/70 p-4 transition-colors peer-checked:border-[#102a43] peer-checked:bg-[#102a43] peer-checked:text-[#f5ede0] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#102a43]">
                                                        <span className="flex items-center justify-between gap-3">
                                                            <span className="font-serif text-xl">{option.label}</span>
                                                            <span className="font-mono text-[11px] opacity-70">
                                                                ~{estimate(selected, option.id)} min
                                                            </span>
                                                        </span>
                                                        <span className="mt-1 text-sm opacity-70">{option.detail}</span>
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>

                                    <div>
                                        <label
                                            htmlFor={`${uid}-email`}
                                            className="block font-mono text-[11px] uppercase tracking-[0.24em] text-[#102a43]/60"
                                        >
                                            03 / Where should we send it?
                                        </label>
                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                            <input
                                                id={`${uid}-email`}
                                                type="email"
                                                inputMode="email"
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                aria-invalid={Boolean(errors.email)}
                                                aria-describedby={`${uid}-email-error`}
                                                className={cn(
                                                    'min-h-12 min-w-0 flex-1 rounded-full border bg-white px-5 text-base text-[#102a43] placeholder:text-[#102a43]/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#102a43]',
                                                    errors.email ? 'border-[#b42318]' : 'border-[#102a43]/25',
                                                )}
                                                onChange={(event) => {
                                                    setEmail(event.target.value)
                                                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                                                }}
                                            />
                                            <button
                                                type="submit"
                                                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#102a43] px-6 text-sm font-semibold text-[#f5ede0] transition-colors hover:bg-[#1c3d5e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102a43]"
                                            >
                                                Plot my edition
                                                <TbArrowRight
                                                    aria-hidden="true"
                                                    className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                                />
                                            </button>
                                        </div>
                                        <p
                                            id={`${uid}-email-error`}
                                            aria-live="polite"
                                            className="mt-2 min-h-5 px-2 text-sm font-medium text-[#b42318]"
                                        >
                                            {errors.email}
                                        </p>
                                        <p className="mt-1 px-2 text-xs text-[#102a43]/50">
                                            Free. Change beats or unsubscribe from any edition.
                                        </p>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TopicPickerNewsletterCard

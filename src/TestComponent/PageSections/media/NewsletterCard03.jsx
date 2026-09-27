// IssuePreviewNewsletterCard

// NewsletterCard03 · Blogs & Digital Media › Newsletter Subscription Card

// Description:
// A morning-briefing sign-up for Daybreak Digest that shows exactly what readers will get.
// The left column carries the heading "The whole world, before your coffee cools.", a
// "Join 48,000 readers" proof row and an email form ("Get tomorrow’s issue"); the right
// column is a mock inbox view of a real issue with a Mon / Wed / Sat sample-issue toggle.
// Use it on news sites, landing pages or anywhere a newsletter needs to sell its format.

// Design:
// - White #ffffff section, ink #16130f text, sun yellow #facc15 accents: a half-sun with
//   rays behind the heading, a yellow highlighter swipe on "coffee", yellow pill button
// - Heading: sans text-4xl → sm:text-5xl → lg:text-6xl, font-black, tracking-tight; form is
//   a 2px ink pill that splits into input + button on sm and stacks at base
// - Issue mock: rounded-[22px] window with ink 2px border, a solid yellow offset block
//   behind (rotated 2deg on lg), From / To / Subject rows, masthead, 16:9 photo, lead story
//   and a numbered "Before 7 am" list
// - Tabs use a sliding ink pill (layoutId); issue content cross-fades on switch; the success
//   card rises in; reduced motion removes the offsets and keeps plain fades
// - Responsive: one column at base, lg:grid-cols-[0.95fr_1.05fr]; tab labels shorten below
//   sm; mock padding p-4 → sm:p-6

// What it does:
// - Tabs (role="tablist", arrow keys move between them) swap the previewed issue: No. 812
//   (Mon), No. 814 (Wed) and the Saturday weekend edition
// - Controlled email + "Also send the Saturday long read" checkbox; submit validates the
//   address with inline errors (aria-invalid), then shows the success card, bumps the reader
//   count to 48,001 and addresses the mock's "To:" line to the new subscriber
// - "Undo" restores the form; "Browse the archive" links to #daybreak-archive

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IssuePreviewNewsletterCard from '@/TestComponent/PageSections/media/NewsletterCard03';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <IssuePreviewNewsletterCard />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiCheck, HiOutlineSun, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const BASE_READERS = 48000

const readers = [
    {
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
        alt: 'Reader smiling in a red sweater',
    },
    {
        src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
        alt: 'Reader in a grey sweater',
    },
    {
        src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
        alt: 'Reader in a striped shirt',
    },
    {
        src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
        alt: 'Reader in a dark sweater',
    },
]

const issues = [
    {
        id: 'mon',
        tab: 'Mon',
        tabLong: 'Mon · No. 812',
        date: 'Monday 21 September 2026',
        subject: 'Rate cuts, rail strikes and a very good dog',
        image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=900&q=80',
        alt: 'City skyline lit up at dusk',
        kicker: 'Markets',
        headline: 'Central banks blink first',
        body: 'Three banks cut rates within 36 hours. What it means for your mortgage, in four lines.',
        items: [
            { tag: 'World', text: 'Ceasefire talks resume in Geneva with a new mediator' },
            { tag: 'UK', text: 'Rail strike called off hours before the 6 am walkout' },
            { tag: 'Tech', text: 'The EU’s phone-charger rule finally reaches laptops' },
            { tag: 'Joy', text: 'Otto, a border collie, has herded 400 lost footballs' },
        ],
        read: '5 min',
    },
    {
        id: 'wed',
        tab: 'Wed',
        tabLong: 'Wed · No. 814',
        date: 'Wednesday 23 September 2026',
        subject: 'Wind beats coal (again) and the four-day week verdict',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=80',
        alt: 'Wind turbines on a ridge at sunset',
        kicker: 'Climate',
        headline: 'Wind out-generated coal for 90 days straight',
        body: 'A first for the grid. We charted the quarter so you can win the argument at lunch.',
        items: [
            { tag: 'Work', text: 'Four-day week pilot: 56 of 61 firms are keeping it' },
            { tag: 'Health', text: 'A cheaper hay-fever jab clears its final trial' },
            { tag: 'Culture', text: 'The Booker shortlist, ranked by how long they take to read' },
            { tag: 'Space', text: 'Tonight’s harvest moon rises at 19:12. Look east.' },
        ],
        read: '6 min',
    },
    {
        id: 'sat',
        tab: 'Sat',
        tabLong: 'Sat · Weekend',
        date: 'Saturday 26 September 2026',
        subject: 'The weekend edition: slow reads for a slow morning',
        image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=900&q=80',
        alt: 'Hands writing in a planner next to a cup of coffee',
        kicker: 'Long read',
        headline: 'The quiet return of the paper diary',
        body: 'Why 1 in 5 under-30s now plan their week on paper, and what they say it fixed.',
        items: [
            { tag: 'Cook', text: 'A 20-minute tomato orzo that tastes like August' },
            { tag: 'Listen', text: 'Six albums from the week, sequenced for a Saturday' },
            { tag: 'Quiz', text: 'Ten questions on the week. Last week’s average: 6.4' },
            { tag: 'Walk', text: 'A 7 km riverside loop with two good pubs on it' },
        ],
        read: '12 min',
    },
]

function validate(value) {
    const v = value.trim()
    if (!v) return 'Pop your email in first.'
    if (!EMAIL_RE.test(v)) return 'That doesn’t look like an email yet, e.g. sam@example.com'
    return ''
}

export function IssuePreviewNewsletterCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const tabRefs = useRef([])
    const [issueIndex, setIssueIndex] = useState(0)
    const [email, setEmail] = useState('')
    const [weekend, setWeekend] = useState(true)
    const [error, setError] = useState('')
    const [subscriber, setSubscriber] = useState(null)

    const issue = issues[issueIndex]
    const readerCount = BASE_READERS + (subscriber ? 1 : 0)

    const handleSubmit = (event) => {
        event.preventDefault()
        const message = validate(email)
        setError(message)
        if (!message) setSubscriber({ email: email.trim(), weekend })
    }

    const handleTabKey = (event, index) => {
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % issues.length
        if (event.key === 'ArrowLeft') next = (index - 1 + issues.length) % issues.length
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = issues.length - 1
        if (next === null) return
        event.preventDefault()
        setIssueIndex(next)
        tabRefs.current[next]?.focus()
    }

    const rise = reduceMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#16130f] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
                <div className="relative min-w-0">
                    <svg
                        aria-hidden="true"
                        viewBox="-10 -30 220 140"
                        className="pointer-events-none absolute -left-10 -top-14 w-64 text-[#facc15] sm:-left-16 sm:w-80"
                    >
                        <path d="M20 100 a80 80 0 0 1 160 0 z" fill="currentColor" opacity="0.9" />
                        {[-70, -45, -20, 5, 30, 55, 80].map((angle) => (
                            <line
                                key={angle}
                                x1="100"
                                y1="100"
                                x2="100"
                                y2="-20"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="0 90 18"
                                transform={`rotate(${angle} 100 100)`}
                            />
                        ))}
                    </svg>

                    <p className="relative inline-flex items-center gap-2 rounded-full border-2 border-[#16130f] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#16130f]">
                        <HiOutlineSun aria-hidden="true" className="size-4" />
                        Daybreak Digest · Weekdays 6:30 am
                    </p>

                    <h2 className="relative mt-7 max-w-xl text-4xl font-black leading-[0.98] tracking-tight text-[#16130f] sm:text-5xl lg:text-6xl">
                        The whole world, before your{' '}
                        <span className="relative whitespace-nowrap">
                            <span
                                aria-hidden="true"
                                className="absolute inset-x-[-4px] bottom-[0.06em] h-[0.42em] -skew-x-6 bg-[#facc15]"
                            />
                            <span className="relative">coffee</span>
                        </span>{' '}
                        cools.
                    </h2>
                    <p className="relative mt-5 max-w-md text-lg leading-relaxed text-[#16130f]/70">
                        Five stories, one chart and a good thing, written by humans and read in five minutes.
                        Free, every weekday before 7.
                    </p>

                    <div className="relative mt-8 flex flex-wrap items-center gap-4">
                        <div className="flex -space-x-3">
                            {readers.map((reader) => (
                                <img
                                    key={reader.src}
                                    src={reader.src}
                                    alt={reader.alt}
                                    loading="lazy"
                                    className="size-11 rounded-full border-2 border-white object-cover ring-1 ring-[#16130f]/10"
                                />
                            ))}
                        </div>
                        <div>
                            <div className="flex text-[#eab308]" aria-hidden="true">
                                {[0, 1, 2, 3, 4].map((star) => (
                                    <HiStar key={star} className="size-4" />
                                ))}
                            </div>
                            <p className="text-sm font-semibold text-[#16130f]">
                                Join <span className="tabular-nums">{readerCount.toLocaleString('en-US')}</span>{' '}
                                readers
                                <span className="sr-only">, rated 4.9 out of 5</span>
                            </p>
                        </div>
                    </div>

                    <div className="relative mt-8 max-w-lg">
                        <AnimatePresence mode="wait" initial={false}>
                            {subscriber ? (
                                <motion.div
                                    key="done"
                                    role="status"
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative overflow-hidden rounded-[22px] border-2 border-[#16130f] bg-[#fef9c3] p-6"
                                    {...rise}
                                >
                                    <motion.span
                                        aria-hidden="true"
                                        className="absolute -right-10 -top-10 size-36 rounded-full bg-[#facc15]"
                                        initial={reduceMotion ? false : { y: 60 }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                    <span className="relative grid size-10 place-items-center rounded-full bg-[#16130f] text-[#facc15]">
                                        <HiCheck aria-hidden="true" className="size-5" />
                                    </span>
                                    <h3 className="relative mt-4 text-2xl font-black leading-tight tracking-tight text-[#16130f] sm:text-3xl">
                                        You’re in. See you at 6:30.
                                    </h3>
                                    <p className="relative mt-2 text-base leading-relaxed text-[#16130f]/75">
                                        A welcome note is on its way to{' '}
                                        <strong className="break-all font-semibold text-[#16130f]">
                                            {subscriber.email}
                                        </strong>
                                        . Tomorrow’s issue, No. 815, lands before breakfast
                                        {subscriber.weekend ? ', and the long read arrives on Saturday.' : '.'}
                                    </p>
                                    <div className="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                                        <a
                                            href="#daybreak-archive"
                                            className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#16130f] underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16130f]"
                                        >
                                            Browse the archive
                                            <HiArrowRight aria-hidden="true" className="size-4" />
                                        </a>
                                        <button
                                            type="button"
                                            className="min-h-10 text-sm font-medium text-[#16130f]/60 hover:text-[#16130f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16130f]"
                                            onClick={() => {
                                                setSubscriber(null)
                                                setEmail('')
                                            }}
                                        >
                                            Undo
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    noValidate
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSubmit}
                                    {...rise}
                                >
                                    <label htmlFor={`${uid}-email`} className="sr-only">
                                        Email address
                                    </label>
                                    <div
                                        className={cn(
                                            'flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:border-2 sm:bg-white sm:p-1.5',
                                            error ? 'sm:border-[#dc2626]' : 'sm:border-[#16130f]',
                                        )}
                                    >
                                        <input
                                            id={`${uid}-email`}
                                            type="email"
                                            inputMode="email"
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            aria-invalid={Boolean(error)}
                                            aria-describedby={error ? `${uid}-error` : `${uid}-note`}
                                            className={cn(
                                                'min-h-12 min-w-0 flex-1 rounded-full border-2 bg-white px-5 text-base text-[#16130f] placeholder:text-[#16130f]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#facc15] sm:border-0 sm:px-4 sm:focus-visible:ring-0',
                                                error ? 'border-[#dc2626]' : 'border-[#16130f]',
                                            )}
                                            onChange={(event) => {
                                                setEmail(event.target.value)
                                                if (error) setError(validate(event.target.value))
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-[#16130f] bg-[#facc15] px-6 text-sm font-black text-[#16130f] transition-colors hover:bg-[#fde047] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16130f] sm:border-0"
                                        >
                                            Get tomorrow’s issue
                                            <HiArrowRight
                                                aria-hidden="true"
                                                className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                            />
                                        </button>
                                    </div>
                                    <p id={`${uid}-error`} aria-live="polite" className="mt-2 min-h-5 px-2 text-sm font-semibold text-[#dc2626]">
                                        {error}
                                    </p>
                                    <label className="mt-1 inline-flex min-h-10 cursor-pointer items-center gap-3 px-1 text-sm text-[#16130f]/80">
                                        <input
                                            type="checkbox"
                                            checked={weekend}
                                            className="size-5 rounded border-2 border-[#16130f] accent-[#16130f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16130f]"
                                            onChange={(event) => setWeekend(event.target.checked)}
                                        />
                                        Also send the Saturday long read
                                    </label>
                                    <p id={`${uid}-note`} className="mt-2 px-1 text-xs leading-relaxed text-[#16130f]/50">
                                        One click to unsubscribe. We never sell or share your address.
                                    </p>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="relative min-w-0">
                    <div
                        role="tablist"
                        aria-label="Sample issues"
                        className="relative z-10 mx-auto mb-5 flex w-fit rounded-full border-2 border-[#16130f] bg-white p-1"
                    >
                        {issues.map((item, index) => {
                            const active = index === issueIndex
                            return (
                                <button
                                    key={item.id}
                                    ref={(el) => {
                                        tabRefs.current[index] = el
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`${uid}-tab-${item.id}`}
                                    aria-selected={active}
                                    aria-controls={`${uid}-panel`}
                                    tabIndex={active ? 0 : -1}
                                    className={cn(
                                        'relative min-h-10 rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16130f] sm:px-5',
                                        active ? 'text-[#facc15]' : 'text-[#16130f]/70 hover:text-[#16130f]',
                                    )}
                                    onClick={() => setIssueIndex(index)}
                                    onKeyDown={(event) => handleTabKey(event, index)}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId={`${uid}-tab-pill`}
                                            className="absolute inset-0 rounded-full bg-[#16130f]"
                                            transition={
                                                reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }
                                            }
                                        />
                                    )}
                                    <span className="relative sm:hidden">{item.tab}</span>
                                    <span className="relative hidden sm:inline">{item.tabLong}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="relative">
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[22px] bg-[#facc15] sm:translate-x-4 sm:translate-y-4 lg:rotate-2"
                        />
                        <div
                            id={`${uid}-panel`}
                            role="tabpanel"
                            aria-labelledby={`${uid}-tab-${issue.id}`}
                            className="relative overflow-hidden rounded-[22px] border-2 border-[#16130f] bg-white"
                        >
                            <div className="flex items-center gap-2 border-b-2 border-[#16130f] bg-[#fafaf9] px-4 py-2.5">
                                <span aria-hidden="true" className="flex gap-1.5">
                                    <span className="size-2.5 rounded-full border-[1.5px] border-[#16130f]" />
                                    <span className="size-2.5 rounded-full border-[1.5px] border-[#16130f]" />
                                    <span className="size-2.5 rounded-full border-[1.5px] border-[#16130f] bg-[#facc15]" />
                                </span>
                                <p className="ml-2 text-xs font-semibold text-[#16130f]/60">Inbox · 1 new</p>
                            </div>

                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={issue.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                                >
                                    <dl className="space-y-1 border-b border-[#16130f]/10 px-4 py-3 text-xs sm:px-6 sm:text-sm">
                                        <div className="flex gap-2">
                                            <dt className="w-14 shrink-0 text-[#16130f]/45">From</dt>
                                            <dd className="min-w-0 truncate font-semibold text-[#16130f]">
                                                Daybreak Digest
                                            </dd>
                                        </div>
                                        <div className="flex gap-2">
                                            <dt className="w-14 shrink-0 text-[#16130f]/45">To</dt>
                                            <dd className="min-w-0 truncate text-[#16130f]/80">
                                                {subscriber ? subscriber.email : 'you@example.com'}
                                            </dd>
                                        </div>
                                        <div className="flex gap-2">
                                            <dt className="w-14 shrink-0 text-[#16130f]/45">Subject</dt>
                                            <dd className="min-w-0 font-semibold text-[#16130f]">☀ {issue.subject}</dd>
                                        </div>
                                    </dl>

                                    <div className="p-4 sm:p-6">
                                        <div className="flex items-end justify-between gap-3 border-b-2 border-[#16130f] pb-3">
                                            <p className="text-lg font-black uppercase tracking-tight text-[#16130f] sm:text-xl">
                                                Daybreak<span className="text-[#eab308]">●</span>Digest
                                            </p>
                                            <p className="text-right text-[11px] font-medium leading-tight text-[#16130f]/55">
                                                {issue.date}
                                                <br />
                                                {issue.read} read
                                            </p>
                                        </div>

                                        <div className="mt-4 grid gap-4 sm:grid-cols-[1.1fr_1fr] sm:gap-5">
                                            <img
                                                src={issue.image}
                                                alt={issue.alt}
                                                loading="lazy"
                                                className="aspect-[16/9] w-full rounded-xl object-cover sm:aspect-[4/3]"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a16207]">
                                                    {issue.kicker}
                                                </p>
                                                <h3 className="mt-1.5 text-xl font-black leading-tight tracking-tight text-[#16130f]">
                                                    {issue.headline}
                                                </h3>
                                                <p className="mt-2 text-sm leading-relaxed text-[#16130f]/70">{issue.body}</p>
                                            </div>
                                        </div>

                                        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#16130f]/50">
                                            Before 7 am
                                        </p>
                                        <ol className="mt-2 divide-y divide-[#16130f]/10">
                                            {issue.items.map((item, index) => (
                                                <li key={item.text} className="flex items-baseline gap-3 py-2.5 text-sm">
                                                    <span className="font-black tabular-nums text-[#eab308]">{index + 1}</span>
                                                    <span className="w-16 shrink-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[#16130f]/45">
                                                        {item.tag}
                                                    </span>
                                                    <span className="min-w-0 leading-snug text-[#16130f]">{item.text}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default IssuePreviewNewsletterCard

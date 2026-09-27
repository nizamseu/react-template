// ZigzagStoryFeatureBreakdown

// FeatureBreakdown04 · SaaS Platforms › Feature Breakdown

// Description:
// A warm, story-led feature section for the HR platform Harbor HR. Under the heading
// "Everything your people need, from offer letter to payslip." three alternating rows pair
// a workplace photo and a floating product card (a day-one checklist, a kudos + review
// card, an October payroll run) with feature copy, tags and one metric each ("94% ready on
// day one", "5-day review cycles", "11 minutes to run payroll"). Use it on an HR or people-
// ops product page where the human side matters as much as the features.

// Design:
// - Sand #f7efe5 section, ink #1f2a2a headings, #5b6563 body, teal #0f766e accent (numbers,
//   checks, links) with amber #b45309 for pending states; white UI cards with soft shadows
// - Rows: lg:grid-cols-2 with gap-16; even rows flip (photo right, card anchored left); the
//   photo is aspect-[4/3] rounded-[2rem] and the card hangs off its bottom corner
// - Copy column: mono "01 / Onboarding" eyebrow, text-3xl → lg:text-4xl heading, paragraph,
//   pill tags and a metric block split by a teal rule; a wave divider sits under the header
// - Motion: photos slide in from their side and cards pop up when in view; each card also
//   drifts ±28px with scroll (useScroll + useTransform); both are disabled for reduced motion
// - Responsive: single column below lg with the photo first, card inset 16px from the
//   photo edge; rows get more breathing room (space-y-24 → lg:space-y-36)

// What it does:
// - No state: entrance and parallax motion are visual only; product cards are aria-hidden
//   because the row copy describes the same feature
// - Links: "See onboarding" → #harbor-onboarding, "See reviews" → #harbor-reviews,
//   "See payroll" → #harbor-payroll, "Book a Harbor HR demo" → #harbor-demo

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ZigzagStoryFeatureBreakdown from '@/TestComponent/PageSections/saas/FeatureBreakdown04';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <ZigzagStoryFeatureBreakdown />
//     </main>
// )
// ```

'use client'

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HiArrowLongRight, HiCheck, HiOutlineClock, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const rows = [
    {
        id: 'onboarding',
        label: 'Onboarding',
        title: 'New hires arrive to a desk, a laptop and a buddy',
        body: 'Harbor turns a signed offer into a checklist for IT, finance and the hiring manager, then nudges each owner until day one is ready.',
        tags: ['Offer e-sign', 'Equipment requests', 'Buddy matching'],
        metric: { value: '94%', label: 'of new hires have everything ready on day one' },
        link: { href: '#harbor-onboarding', text: 'See onboarding' },
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80',
        alt: 'A team gathered around a table in a bright office, welcoming a colleague',
    },
    {
        id: 'reviews',
        label: 'Reviews & recognition',
        title: 'Reviews that take days, not the whole quarter',
        body: 'Short, structured check-ins replace the 14-page form. Kudos collected all quarter show up in the review, so good work is never forgotten.',
        tags: ['Quarterly check-ins', 'Peer kudos', 'Calibration'],
        metric: { value: '5 days', label: 'average review cycle, down from three weeks' },
        link: { href: '#harbor-reviews', text: 'See reviews' },
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80',
        alt: 'Two colleagues high-fiving across a desk in an office',
    },
    {
        id: 'payroll',
        label: 'Payroll',
        title: 'Payroll for four countries before your coffee cools',
        body: 'Hours, leave and bonuses flow in automatically. Review the run, approve it once, and Harbor files the taxes and sends every payslip.',
        tags: ['US · UK · DE · BD', 'Automatic tax filing', 'Payslips by email'],
        metric: { value: '11 min', label: 'to run payroll for 240 people across 4 countries' },
        link: { href: '#harbor-payroll', text: 'See payroll' },
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
        alt: 'Laptop, charts and handwritten notes spread across a desk',
    },
]

function OnboardingCard() {
    const tasks = [
        { id: 'contract', text: 'Contract signed', done: true },
        { id: 'laptop', text: 'Laptop shipped · arrives Fri', done: true },
        { id: 'buddy', text: 'Buddy assigned: Leo Park', done: true },
        { id: 'bank', text: 'Bank details for payroll', done: false },
    ]
    return (
        <>
            <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ccfbf1] text-xs font-bold text-[#0f766e]">
                    AO
                </span>
                <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#1f2a2a]">Amara Osei starts Mon, Oct 5</p>
                    <p className="text-[11px] text-[#5b6563]">Product Designer · Lisbon</p>
                </div>
            </div>
            <ul className="mt-3 space-y-2">
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center gap-2 text-[12px]">
                        <span
                            className={cn(
                                'grid h-4 w-4 shrink-0 place-items-center rounded-full',
                                task.done ? 'bg-[#0f766e] text-white' : 'border border-dashed border-[#b45309]',
                            )}
                        >
                            {task.done && <HiCheck className="h-2.5 w-2.5" />}
                        </span>
                        <span className={cn('truncate', task.done ? 'text-[#1f2a2a]' : 'text-[#b45309]')}>{task.text}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-3 flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1e7da]">
                    <span className="block h-full w-3/4 rounded-full bg-[#0f766e]" />
                </span>
                <span className="text-[10px] font-semibold text-[#5b6563]">3 of 4</span>
            </div>
        </>
    )
}

function ReviewCard() {
    return (
        <>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f766e]">Kudos · 2 hours ago</p>
            <p className="mt-2 text-[13px] leading-snug text-[#1f2a2a]">
                “Priya carried the Q3 launch. Calm, fast, and she wrote the runbook we all use now.”
            </p>
            <p className="mt-1 text-[11px] text-[#5b6563]">Jonas Weber → Priya Shah</p>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f7efe5] px-3 py-2">
                <span className="text-[11px] text-[#1f2a2a]">
                    Q3 reviews <span className="font-semibold">86% done</span>
                </span>
                <span className="flex text-[#0f766e]">
                    {[0, 1, 2, 3, 4].map((star) => (
                        <HiStar key={star} className="h-3 w-3" />
                    ))}
                </span>
            </div>
        </>
    )
}

function PayrollCard() {
    return (
        <>
            <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[#1f2a2a]">October payroll</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-[#b45309]">
                    <HiOutlineClock className="h-3 w-3" />
                    Due Oct 28
                </span>
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-[#1f2a2a]">$1,284,310.42</p>
            <p className="text-[11px] text-[#5b6563]">240 people · 4 countries · 0 errors found</p>
            <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] text-[#5b6563]">
                {['US 132', 'UK 54', 'DE 31', 'BD 23'].map((country) => (
                    <span key={country} className="rounded-md bg-[#f7efe5] py-1 font-semibold">
                        {country}
                    </span>
                ))}
            </div>
            <span className="mt-3 flex min-h-9 items-center justify-center rounded-lg bg-[#0f766e] text-[12px] font-semibold text-white">
                Approve run
            </span>
        </>
    )
}

const cards = { onboarding: OnboardingCard, reviews: ReviewCard, payroll: PayrollCard }

function StoryRow({ row, index, reduceMotion }) {
    const rowRef = useRef(null)
    const flipped = index % 2 === 1
    const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start end', 'end start'] })
    const drift = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [28, -28])
    const CardBody = cards[row.id]

    return (
        <article ref={rowRef} className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <div className={cn('relative pb-16 lg:pb-10', flipped && 'lg:order-2')}>
                <motion.div
                    initial={{ opacity: 0, x: reduceMotion ? 0 : flipped ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden rounded-[2rem] bg-[#eadfce]"
                >
                    <img src={row.image} alt={row.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </motion.div>

                <motion.div
                    style={{ y: drift }}
                    className={cn(
                        'absolute bottom-0 w-[min(17.5rem,calc(100%-2rem))]',
                        flipped ? 'left-4 lg:-left-8' : 'right-4 lg:-right-8',
                    )}
                >
                    <motion.div
                        aria-hidden="true"
                        initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-2xl bg-white p-4 shadow-[0_24px_48px_-20px_rgba(31,42,42,0.45)] ring-1 ring-[#1f2a2a]/5"
                    >
                        <CardBody />
                    </motion.div>
                </motion.div>
            </div>

            <div className={cn('max-w-xl', flipped && 'lg:order-1 lg:justify-self-end')}>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0f766e]">
                    {String(index + 1).padStart(2, '0')} / {row.label}
                </p>
                <h3 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-[#1f2a2a] lg:text-4xl">
                    {row.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#5b6563]">{row.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                    {row.tags.map((tag) => (
                        <li
                            key={tag}
                            className="rounded-full border border-[#0f766e]/20 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#1f2a2a]"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
                <div className="mt-8 flex items-end gap-5 border-t-2 border-[#0f766e] pt-5">
                    <p className="shrink-0 text-4xl font-semibold tracking-tight text-[#0f766e] sm:text-5xl">{row.metric.value}</p>
                    <p className="pb-1 text-sm leading-snug text-[#5b6563]">{row.metric.label}</p>
                </div>
                <a
                    href={row.link.href}
                    className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0f766e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f766e]"
                >
                    <span className="border-b border-[#0f766e]/40 pb-0.5 transition-colors group-hover:border-[#0f766e]">
                        {row.link.text}
                    </span>
                    <HiArrowLongRight
                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                    />
                </a>
            </div>
        </article>
    )
}

export function ZigzagStoryFeatureBreakdown({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#f7efe5] py-16 text-base font-normal text-[#5b6563] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0f766e]">Harbor HR · Platform</p>
                    <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#1f2a2a] sm:text-5xl lg:text-6xl">
                        Everything your people need, from <span className="italic text-[#0f766e]">offer letter</span> to payslip.
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed md:text-lg">
                        1,600 companies run hiring, reviews and payroll on Harbor, so their HR teams can spend
                        the week with people instead of spreadsheets.
                    </p>
                    <svg viewBox="0 0 120 12" className="mx-auto mt-8 h-3 w-28 text-[#0f766e]" aria-hidden="true">
                        <path
                            d="M0 6c10-6 20-6 30 0s20 6 30 0 20-6 30 0 20 6 30 0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <div className="mt-16 space-y-24 md:mt-20 lg:space-y-36">
                    {rows.map((row, index) => (
                        <StoryRow key={row.id} row={row} index={index} reduceMotion={reduceMotion} />
                    ))}
                </div>

                <div className="mt-20 flex flex-col items-center gap-4 text-center md:mt-28">
                    <p className="text-lg text-[#1f2a2a]">Switching from spreadsheets or another HR tool? We move your data for free.</p>
                    <a
                        href="#harbor-demo"
                        className="inline-flex min-h-12 items-center rounded-full bg-[#0f766e] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#115e59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
                    >
                        Book a Harbor HR demo
                    </a>
                </div>
            </div>
        </section>
    )
}

export default ZigzagStoryFeatureBreakdown

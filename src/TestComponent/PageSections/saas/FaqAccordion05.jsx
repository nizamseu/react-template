// CardGridFaqAccordion

// FaqAccordion05 · SaaS Platforms › FAQ Accordion

// Description:
// A cheerful card-based FAQ for the fictional payroll platform Brightside Payroll. Under the
// heading "Payroll questions, sunny answers." nine pastel cards each hold one question
// (first pay run, tax filings, paying contractors abroad, fixing mistakes, payslips,
// benefits, accounting sync, pricing, data security) and expand in place to reveal the
// answer and a guide link. A closing strip offers "Chat with a specialist". Use it on a
// pricing or product page for small-business audiences.

// Design:
// - White background, ink #1c1917 text; cards cycle through butter #fde68a, sky #bfdbfe,
//   pink #fbcfe8 and mint #bbf7d0 with rounded-[28px] corners and no borders
// - Heading text-4xl → lg:text-6xl bold with a small SVG sun beside it; card
//   questions text-lg semibold, category labels 11px uppercase with wide tracking
// - Each card has a white 40px icon badge and a white round toggle whose plus rotates into a
//   ×; open cards gain a soft drop shadow
// - framer-motion layout animation: the card grows in place and its neighbours glide to
//   their new positions; answer text fades in; MotionConfig reducedMotion="user"
// - Responsive grid: 1 column → md:2 → lg:3, items-start so only the opened card grows

// What it does:
// - openIds (array, default ["first-run"]) lets any number of cards be open; each card
//   header is a button with aria-expanded / aria-controls and answers are role="region"
// - Guide links point to #brightside-guide-<id>; the closing strip links to
//   #brightside-chat and #brightside-demo
// - Reduced-motion users get instant expansion (no layout animation, only a short fade)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CardGridFaqAccordion from '@/TestComponent/PageSections/saas/FaqAccordion05';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <CardGridFaqAccordion />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
    HiArrowRight,
    HiArrowUturnLeft,
    HiBuildingLibrary,
    HiCurrencyDollar,
    HiDevicePhoneMobile,
    HiGlobeAlt,
    HiHeart,
    HiPlus,
    HiPuzzlePiece,
    HiRocketLaunch,
    HiShieldCheck,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tints = ['bg-[#fde68a]', 'bg-[#bfdbfe]', 'bg-[#fbcfe8]', 'bg-[#bbf7d0]']

const faqs = [
    {
        id: 'first-run',
        cat: 'Getting started',
        icon: HiRocketLaunch,
        q: 'How fast can I run my first payroll?',
        a: 'Most teams run their first payroll within a day. Import employees from a spreadsheet, confirm pay rates and bank details, and Brightside checks everything before you approve.',
    },
    {
        id: 'filings',
        cat: 'Taxes',
        icon: HiBuildingLibrary,
        q: 'Do you file payroll taxes for me?',
        a: 'Yes. We calculate, pay and file federal, state and local payroll taxes on time, every time, and send W-2s and 1099s at year end. If we ever miss a deadline, we pay the penalty.',
    },
    {
        id: 'contractors',
        cat: 'Global',
        icon: HiGlobeAlt,
        q: 'Can I pay contractors in other countries?',
        a: 'Pay contractors in 120+ countries in their local currency, with exchange rates locked when you approve the run. Each payment costs a flat $4, with no FX markup.',
    },
    {
        id: 'mistakes',
        cat: 'Corrections',
        icon: HiArrowUturnLeft,
        q: 'What if I make a mistake in a pay run?',
        a: 'Edit or cancel any pay run until 5 pm the day before payday. After that, create an off-cycle correction in two clicks and taxes are adjusted automatically.',
    },
    {
        id: 'payslips',
        cat: 'Employees',
        icon: HiDevicePhoneMobile,
        q: 'Can employees see their own payslips?',
        a: 'Everyone gets the Brightside app to view payslips, update bank details, download tax forms and request time off, so you stop answering “where’s my payslip?” emails.',
    },
    {
        id: 'benefits',
        cat: 'Benefits',
        icon: HiHeart,
        q: 'Which benefits can I offer my team?',
        a: 'Health, dental and vision plans, 401(k) with employer matching, commuter benefits and wellness stipends. Deductions flow into payroll automatically from day one.',
    },
    {
        id: 'accounting',
        cat: 'Integrations',
        icon: HiPuzzlePiece,
        q: 'Does Brightside sync with my accounting?',
        a: 'Payroll journals post to your accounting software after every run, mapped to the accounts you choose. Time-tracking and HR tools sync hours and new hires both ways.',
    },
    {
        id: 'pricing',
        cat: 'Pricing',
        icon: HiCurrencyDollar,
        q: 'How is pricing calculated?',
        a: 'A $40 monthly base plus $6 per active person. Contractors you don’t pay in a month are free, and there are no setup fees or annual contracts.',
    },
    {
        id: 'security',
        cat: 'Security',
        icon: HiShieldCheck,
        q: 'Is my employees’ data secure?',
        a: 'Salary and bank data are encrypted with AES-256, access needs two-factor sign-in, and we are SOC 2 Type II audited every year. Admin actions are logged for 7 years.',
    },
]

export function CardGridFaqAccordion({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const [openIds, setOpenIds] = useState(['first-run'])

    const toggle = (id) => setOpenIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#1c1917] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="relative max-w-3xl">
                            <p className="inline-flex items-center rounded-full bg-[#fde68a] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#1c1917]">
                                Brightside Payroll · FAQ
                            </p>
                            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-tight text-[#1c1917] sm:text-5xl lg:text-6xl">
                                Payroll questions,{' '}
                                <span className="relative inline-block whitespace-nowrap">
                                    sunny answers.
                                    <svg
                                        viewBox="0 0 64 64"
                                        aria-hidden="true"
                                        className="absolute -right-8 -top-7 size-10 text-[#f59e0b] sm:-right-10 sm:-top-8 sm:size-12"
                                    >
                                        <circle cx="32" cy="32" r="11" fill="currentColor" />
                                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                            <path
                                                key={deg}
                                                d="M32 6v9"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                transform={`rotate(${deg} 32 32)`}
                                            />
                                        ))}
                                    </svg>
                                </span>
                            </h2>
                        </div>
                        <p className="max-w-sm text-base leading-relaxed text-[#57534e]">
                            The things 14,000 small businesses asked before switching to Brightside. Tap a card
                            to open it, as many as you like.
                        </p>
                    </div>

                    <ul className="mt-12 grid items-start gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                        {faqs.map((item, index) => {
                            const isOpen = openIds.includes(item.id)
                            const Icon = item.icon
                            return (
                                <motion.li
                                    key={item.id}
                                    layout
                                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                                    className={cn(
                                        'overflow-hidden rounded-[28px] transition-shadow duration-300',
                                        tints[index % tints.length],
                                        isOpen && 'shadow-[0_24px_50px_-24px_rgba(28,25,23,0.45)]',
                                    )}
                                >
                                    <motion.h3 layout="position" className="text-lg font-semibold leading-snug text-[#1c1917]">
                                        <button
                                            type="button"
                                            id={`${uid}-q-${item.id}`}
                                            aria-expanded={isOpen}
                                            aria-controls={`${uid}-a-${item.id}`}
                                            className="group flex w-full flex-col gap-5 p-6 text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#1c1917] sm:p-7"
                                            onClick={() => toggle(item.id)}
                                        >
                                            <span className="flex w-full items-center justify-between gap-3">
                                                <span className="inline-flex items-center gap-2.5">
                                                    <span className="grid size-10 place-items-center rounded-full bg-white/80 text-[#1c1917]">
                                                        <Icon className="size-5" aria-hidden="true" />
                                                    </span>
                                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1c1917]/70">
                                                        {item.cat}
                                                    </span>
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'grid size-10 shrink-0 place-items-center rounded-full transition-all duration-300 motion-reduce:transition-none',
                                                        isOpen ? 'rotate-45 bg-[#1c1917] text-white' : 'bg-white text-[#1c1917] group-hover:scale-110',
                                                    )}
                                                >
                                                    <HiPlus className="size-5" />
                                                </span>
                                            </span>
                                            <span className="text-lg font-semibold leading-snug sm:text-xl">{item.q}</span>
                                        </button>
                                    </motion.h3>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="answer"
                                                id={`${uid}-a-${item.id}`}
                                                role="region"
                                                aria-labelledby={`${uid}-q-${item.id}`}
                                                layout="position"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.1 } }}
                                                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                                className="px-6 pb-6 sm:px-7 sm:pb-7"
                                            >
                                                <p className="border-t border-[#1c1917]/15 pt-4 text-[15px] leading-relaxed text-[#1c1917]/80">
                                                    {item.a}
                                                </p>
                                                <a
                                                    href={`#brightside-guide-${item.id}`}
                                                    className="group/link mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-[#1c1917] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1917]"
                                                >
                                                    <span className="underline decoration-2 underline-offset-4">Read the guide</span>
                                                    <HiArrowRight className="size-4 transition-transform duration-300 group-hover/link:translate-x-0.5" aria-hidden="true" />
                                                </a>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.li>
                            )
                        })}
                    </ul>

                    <div className="mt-6 flex flex-col gap-5 rounded-[28px] bg-[#1c1917] p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xl font-bold text-white">Still have a question?</p>
                            <p className="mt-1 text-sm text-white/70">
                                Our payroll specialists answer in under 5 minutes, 7 am to 7 pm ET.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <a
                                href="#brightside-chat"
                                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#fde68a] px-5 text-sm font-bold text-[#1c1917] transition-colors hover:bg-[#fcd34d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                Chat with a specialist
                            </a>
                            <a
                                href="#brightside-demo"
                                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 px-5 text-sm font-bold text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                Book a 15-min demo
                            </a>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default CardGridFaqAccordion

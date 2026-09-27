// SplitIntroFaqAccordion

// FaqAccordion01 · SaaS Platforms › FAQ Accordion

// Description:
// A crisp two-column FAQ for the fictional form builder Formly. The left column carries the
// heading "Questions, answered before you hit submit.", a short intro and a black "Still
// stuck?" contact card with three support-team portraits, "Chat with us" and "Email
// support". The right column is a single-open accordion of eight questions (free plan,
// payments, conditional logic, data storage, embedding and more), each with a "Was this
// helpful?" prompt. Use it near the bottom of a pricing or product page.

// Design:
// - White background, near-black #0a0a0a text, blue #3b82f6 accent for the sliding open
//   marker, the open item's icon, links and focus rings; neutral-200 hairlines
// - Heading text-4xl → lg:text-6xl semibold with tight tracking; questions text-base →
//   sm:text-lg semibold with a small mono index ("01"); answers text-sm/base neutral-600
// - A 3px blue bar slides between open items (shared layoutId) and the chevron sits in a
//   40px circle that fills blue and flips when open; answers animate height and opacity
// - Contact card: rounded-3xl #0a0a0a panel, overlapping round portraits with white rings,
//   a blue pill button and an outline button, plus office hours in small caps
// - Responsive: stacked below lg (intro, card, accordion); on lg a 5/7 split with the intro
//   column sticky

// What it does:
// - openId (default "free-plan") holds the single open item; clicking the open question
//   closes it; buttons carry aria-expanded / aria-controls and answers are role="region"
// - Arrow Up/Down, Home and End move focus between questions
// - "Was this helpful?" Yes/No buttons store a per-question vote (aria-pressed) and show a
//   thank-you line; "Chat with us" links to #formly-chat and "Email support" to
//   #formly-support
// - useReducedMotion() turns the height animation and sliding marker into instant changes

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SplitIntroFaqAccordion from '@/TestComponent/PageSections/saas/FaqAccordion01';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <SplitIntroFaqAccordion />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiChatBubbleLeftRight, HiChevronDown, HiEnvelope } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const faqs = [
    {
        id: 'free-plan',
        q: 'Is there really a free plan?',
        a: 'Yes. Free includes 3 live forms, 100 responses a month and every field type, with no time limit and no card required. Upgrade to Pro ($19/month) when you need unlimited forms, custom domains or file uploads over 10 MB.',
    },
    {
        id: 'payments',
        q: 'Can I take payments inside a form?',
        a: 'Add a payment block to collect one-off or recurring payments in 36 currencies. Formly charges no extra fee on Pro and above; your payment provider’s standard rates still apply.',
    },
    {
        id: 'logic',
        q: 'How does conditional logic work?',
        a: 'Every question can show, hide or skip based on earlier answers, calculated scores or URL parameters. Build rules visually with “if this, then that” blocks, then preview each path before you publish.',
    },
    {
        id: 'storage',
        q: 'Where is my response data stored?',
        a: 'Pick EU (Frankfurt) or US (Oregon) hosting when you create a workspace. Responses are encrypted at rest with AES-256, and you can set automatic deletion after 30, 90 or 365 days.',
    },
    {
        id: 'embed',
        q: 'Can I embed Formly on my own website?',
        a: 'Copy one snippet to embed a form inline, as a pop-up or as a slide-in. Embeds inherit your fonts, resize automatically and load in under 60 KB.',
    },
    {
        id: 'uploads',
        q: 'Do you support file uploads?',
        a: 'Yes, up to 10 MB per file on Free and 1 GB on Business. Files land in your Formly workspace, and can sync to cloud drives through our integrations.',
    },
    {
        id: 'limits',
        q: 'What happens if I go over my response limit?',
        a: 'Your forms keep accepting responses. We email you at 80% and 100%, and extra responses stay hidden (never deleted) until you upgrade or the new month starts.',
    },
    {
        id: 'cancel',
        q: 'Can I cancel at any time?',
        a: 'Cancel from Billing in two clicks. You keep paid features until the end of the period, then drop to Free; export every response as CSV or JSON whenever you like.',
    },
]

const team = [
    {
        name: 'Priya',
        src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=160&q=80',
    },
    {
        name: 'Tomás',
        src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
    },
    {
        name: 'Hana',
        src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
    },
]

export function SplitIntroFaqAccordion({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const [openId, setOpenId] = useState('free-plan')
    const [votes, setVotes] = useState({})
    const buttonRefs = useRef([])

    const onKeyDown = (event, index) => {
        const last = faqs.length - 1
        let next = null
        if (event.key === 'ArrowDown') next = index === last ? 0 : index + 1
        if (event.key === 'ArrowUp') next = index === 0 ? last : index - 1
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = last
        if (next === null) return
        event.preventDefault()
        buttonRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-16 text-base font-normal text-[#0a0a0a] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-10">
                        <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
                            <span className="size-1.5 rounded-full bg-[#3b82f6]" aria-hidden="true" />
                            Formly help center
                        </p>
                        <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-[#0a0a0a] sm:text-5xl lg:text-6xl">
                            Questions, answered before you hit <span className="text-[#3b82f6]">submit.</span>
                        </h2>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600">
                            The eight things people ask us most, from free plans to where your data lives.
                            Can’t see yours? A real human is one click away.
                        </p>

                        <div className="mt-10 rounded-3xl bg-[#0a0a0a] p-6 text-white sm:p-8">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {team.map((person) => (
                                        <img
                                            key={person.name}
                                            src={person.src}
                                            alt={`${person.name} from Formly support`}
                                            loading="lazy"
                                            className="size-11 rounded-full object-cover ring-2 ring-[#0a0a0a]"
                                        />
                                    ))}
                                </div>
                                <p className="text-xs leading-snug text-white/60">
                                    Priya, Tomás and Hana
                                    <br />
                                    reply in about 1 h 48 m
                                </p>
                            </div>
                            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">Still stuck?</h3>
                            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
                                Send us a screenshot of your form and we’ll tell you exactly which setting to
                                flip. No bots, no ticket queues.
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="#formly-chat"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#3b82f6] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    <HiChatBubbleLeftRight className="size-4" aria-hidden="true" />
                                    Chat with us
                                </a>
                                <a
                                    href="#formly-support"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    <HiEnvelope className="size-4" aria-hidden="true" />
                                    Email support
                                </a>
                            </div>
                            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                                Mon–Fri · 08:00–20:00 CET
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <ul className="border-t border-neutral-200">
                        {faqs.map((item, index) => {
                            const isOpen = openId === item.id
                            const vote = votes[item.id]
                            return (
                                <li key={item.id} className="relative border-b border-neutral-200">
                                    {isOpen && (
                                        <motion.span
                                            layoutId={`${uid}-marker`}
                                            aria-hidden="true"
                                            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
                                            className="absolute -left-px top-0 bottom-0 w-[3px] rounded-full bg-[#3b82f6] sm:-left-4"
                                        />
                                    )}
                                    <h3 className="text-base font-semibold text-[#0a0a0a] sm:text-lg">
                                        <button
                                            ref={(el) => {
                                                buttonRefs.current[index] = el
                                            }}
                                            type="button"
                                            id={`${uid}-q-${item.id}`}
                                            aria-expanded={isOpen}
                                            aria-controls={`${uid}-a-${item.id}`}
                                            className="group flex w-full items-center gap-4 py-5 pl-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b82f6] sm:py-6 sm:pl-0"
                                            onClick={() => setOpenId(isOpen ? null : item.id)}
                                            onKeyDown={(event) => onKeyDown(event, index)}
                                        >
                                            <span className="w-6 shrink-0 font-mono text-xs font-normal text-neutral-400">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="flex-1 leading-snug group-hover:text-[#3b82f6]">{item.q}</span>
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300',
                                                    isOpen
                                                        ? 'border-[#3b82f6] bg-[#3b82f6] text-white'
                                                        : 'border-neutral-200 text-[#0a0a0a] group-hover:border-[#0a0a0a]',
                                                )}
                                            >
                                                <HiChevronDown
                                                    className={cn('size-4 transition-transform duration-300', isOpen && 'rotate-180')}
                                                />
                                            </span>
                                        </button>
                                    </h3>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="answer"
                                                id={`${uid}-a-${item.id}`}
                                                role="region"
                                                aria-labelledby={`${uid}-q-${item.id}`}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-6 pl-[3.25rem] pr-2 sm:pl-10 sm:pr-14">
                                                    <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">{item.a}</p>
                                                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                                                        {vote ? (
                                                            <p role="status" className="py-2">
                                                                Thanks, {vote === 'yes' ? 'glad it helped.' : 'we’ll improve this answer.'}
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <span>Was this helpful?</span>
                                                                {['yes', 'no'].map((value) => (
                                                                    <button
                                                                        key={value}
                                                                        type="button"
                                                                        aria-pressed={vote === value}
                                                                        className="min-h-10 rounded-full border border-neutral-200 px-4 font-semibold capitalize text-[#0a0a0a] transition-colors hover:border-[#3b82f6] hover:text-[#3b82f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b82f6]"
                                                                        onClick={() => setVotes((v) => ({ ...v, [item.id]: value }))}
                                                                    >
                                                                        {value}
                                                                    </button>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default SplitIntroFaqAccordion

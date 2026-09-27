// ChatThreadFaqAccordion

// FaqAccordion04 · SaaS Platforms › FAQ Accordion

// Description:
// A conversational FAQ for the fictional messaging API Chatterbox. Beside the heading "Ask
// like you’d ask a teammate." a dark chat window opens with a greeting from Echo, the docs
// bot, followed by six suggested questions shown as outline chat bubbles (pricing, channels,
// sandbox, delivery rate, webhooks, bringing your own number). Tapping one sends it as a
// green outgoing bubble, shows a typing indicator, then Echo’s answer bubble. Use it on a
// developer product or API pricing page where a friendlier FAQ fits the brand.

// Design:
// - Graphite #0f1115 section, #15181e chat window with a #23272f border, green #25d366 for
//   sent bubbles, the online dot and accents; answer bubbles are #1f232b with white text
// - Heading text-4xl → lg:text-6xl bold with tight tracking; bubbles text-sm/[15px];
//   inline API names (POST /v2/messages) in font-mono chips
// - Unsent questions are dashed green outline bubbles with a paper-plane icon; sent ones
//   fill green with dark text, a squared bottom-right corner and a double-tick receipt
// - Typing indicator: three dots bouncing in sequence; answers pop in with a small scale
//   and fade (framer-motion); a fixed 09:41 timestamp keeps server and client in sync
// - Responsive: copy column stacks above the chat below lg; the chat is max-w-xl and
//   bubbles cap at 85% width so nothing overflows at 360px

// What it does:
// - threads maps a question id to "typing" or "open"; clicking an unsent question sets
//   "typing" and a 1.1 s timeout switches it to "open"; clicking a sent question closes it
//   (and cancels a pending timeout); all timeouts are cleared on unmount
// - Question buttons carry aria-expanded / aria-controls; the typing bubble is role="status"
//   ("Echo is typing") and the answer is role="region" labelled by the question
// - useReducedMotion() skips the typing step and the pop-in animation
// - "Read the API docs" links to #chatterbox-docs, "Talk to a human" to #chatterbox-support

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ChatThreadFaqAccordion from '@/TestComponent/PageSections/saas/FaqAccordion04';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <ChatThreadFaqAccordion />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiPaperAirplane } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const questions = [
    {
        id: 'pricing',
        q: 'How are messages priced?',
        a: ['Outbound messages are $0.004 each and inbound ones are free. Volume pricing starts automatically at 1M messages a month, and there are no platform fees or minimums.'],
    },
    {
        id: 'channels',
        q: 'Which channels can I send on?',
        a: ['SMS, RCS, in-app chat, email fallback and voice OTP, all from one endpoint:', { code: 'POST /v2/messages' }, 'Set channel to "auto" and we pick the cheapest one that reaches the user.'],
    },
    {
        id: 'sandbox',
        q: 'Is there a sandbox I can test in?',
        a: ['Every account gets a free sandbox with 1,000 test messages a month and 5 verified phone numbers. Switch to live by swapping', { code: 'cb_test_' }, 'for', { code: 'cb_live_' }, 'in your key.'],
    },
    {
        id: 'delivery',
        q: 'What delivery rate should I expect?',
        a: ['Our median delivery rate across 190 countries was 98.7% last quarter, with p95 latency of 1.8 s from API call to handset. Live numbers are on our status page.'],
    },
    {
        id: 'webhooks',
        q: 'Do you have webhooks for receipts?',
        a: ['Yes. Subscribe to', { code: 'message.delivered' }, ',', { code: 'message.failed' }, 'and', { code: 'message.read' }, '. Every webhook is signed with HMAC-SHA256 and retried for 24 hours.'],
    },
    {
        id: 'numbers',
        q: 'Can I bring my own phone number?',
        a: ['You can port existing long codes and toll-free numbers in about 5 business days, or buy new ones instantly in 60+ countries from the console.'],
    },
]

const stats = [
    { value: '42 s', label: 'Median first reply from our engineers' },
    { value: '9', label: 'Official SDKs, from Go to Swift' },
    { value: '99.95%', label: 'API uptime over the last 12 months' },
]

function EchoAvatar({ small = false }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'grid shrink-0 place-items-center rounded-full bg-[#25d366] text-[#0f1115]',
                small ? 'size-7' : 'size-10',
            )}
        >
            <svg viewBox="0 0 24 24" className={small ? 'size-4' : 'size-5'}>
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3 0-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z" fill="currentColor" />
                <circle cx="9" cy="9.5" r="1.3" fill="#25d366" />
                <circle cx="15" cy="9.5" r="1.3" fill="#25d366" />
            </svg>
        </span>
    )
}

export function ChatThreadFaqAccordion({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const [threads, setThreads] = useState({})
    const timers = useRef({})

    useEffect(() => {
        const pending = timers.current
        return () => Object.values(pending).forEach((t) => clearTimeout(t))
    }, [])

    const toggle = (id) => {
        clearTimeout(timers.current[id])
        if (threads[id]) {
            setThreads((t) => {
                const next = { ...t }
                delete next[id]
                return next
            })
            return
        }
        if (reduceMotion) {
            setThreads((t) => ({ ...t, [id]: 'open' }))
            return
        }
        setThreads((t) => ({ ...t, [id]: 'typing' }))
        timers.current[id] = setTimeout(() => setThreads((t) => (t[id] ? { ...t, [id]: 'open' } : t)), 1100)
    }

    const pop = {
        initial: reduceMotion ? false : { opacity: 0, scale: 0.92, y: 6 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.96 },
        transition: { duration: 0.22, ease: 'easeOut' },
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0f1115] px-4 py-16 text-base font-normal text-[#c9ced6] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 right-0 -z-10 size-[520px] rounded-full bg-[#25d366]/10 blur-[110px]"
            />

            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
                <div className="lg:sticky lg:top-10">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#25d366]">
                        <span className="size-2 rounded-full bg-[#25d366]" aria-hidden="true" />
                        Chatterbox API · FAQ
                    </p>
                    <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Ask like you’d ask a <span className="text-[#25d366]">teammate.</span>
                    </h2>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-[#9aa1ac]">
                        Pick a question and Echo, our docs bot, answers in the thread. Everything here is
                        also in the docs, but this is quicker.
                    </p>

                    <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[#23272f] pt-6">
                        {stats.map((stat) => (
                            <div key={stat.value} className="flex flex-col">
                                <dt className="order-2 mt-1 text-xs leading-snug text-[#8b919c]">{stat.label}</dt>
                                <dd className="order-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-10 flex flex-wrap gap-3">
                        <a
                            href="#chatterbox-docs"
                            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25d366] px-5 text-sm font-semibold text-[#0f1115] transition-colors hover:bg-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25d366]"
                        >
                            Read the API docs
                            <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                        </a>
                        <a
                            href="#chatterbox-support"
                            className="inline-flex min-h-11 items-center rounded-full border border-[#2d323c] px-5 text-sm font-semibold text-white transition-colors hover:border-[#25d366] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25d366]"
                        >
                            Talk to a human
                        </a>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-[#23272f] bg-[#15181e] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)] lg:mx-0 lg:justify-self-end">
                    <div className="flex items-center gap-3 border-b border-[#23272f] px-4 py-3.5 sm:px-5">
                        <EchoAvatar />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">Echo · Chatterbox Support</p>
                            <p className="flex items-center gap-1.5 text-xs text-[#8b919c]">
                                <span className="size-1.5 rounded-full bg-[#25d366]" aria-hidden="true" />
                                Online · replies instantly
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 px-3 py-5 sm:px-5">
                        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5d636e]">Today</p>

                        <div className="flex items-end gap-2">
                            <EchoAvatar small />
                            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-[#1f232b] px-4 py-2.5 text-sm leading-relaxed text-white">
                                Hey! I’m Echo. Tap any question below and I’ll answer right here in the thread.
                                <span className="mt-1 block text-right text-[10px] text-[#8b919c]">09:41</span>
                            </div>
                        </div>

                        <ul className="space-y-3 pt-2">
                            {questions.map((item) => {
                                const state = threads[item.id]
                                const sent = Boolean(state)
                                return (
                                    <li key={item.id} className="space-y-3">
                                        <div className="flex justify-end">
                                            <h3 className="max-w-[85%] text-sm font-medium text-white sm:text-[15px]">
                                                <button
                                                    type="button"
                                                    id={`${uid}-q-${item.id}`}
                                                    aria-expanded={state === 'open'}
                                                    aria-controls={`${uid}-a-${item.id}`}
                                                    className={cn(
                                                        'flex min-h-10 items-center gap-2 rounded-2xl rounded-br-md px-4 py-2.5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]',
                                                        sent
                                                            ? 'bg-[#25d366] text-[#06200f] hover:bg-[#22c55e]'
                                                            : 'border border-dashed border-[#25d366]/60 text-[#d7fbe4] hover:border-solid hover:bg-[#25d366]/10',
                                                    )}
                                                    onClick={() => toggle(item.id)}
                                                >
                                                    <span>{item.q}</span>
                                                    {sent ? (
                                                        <svg viewBox="0 0 20 12" className="h-3 w-5 shrink-0" aria-hidden="true">
                                                            <path d="M1 6.5 4.5 10 11 2M8 9.5l.5.5L15 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    ) : (
                                                        <HiPaperAirplane className="size-4 shrink-0 text-[#25d366]" aria-hidden="true" />
                                                    )}
                                                </button>
                                            </h3>
                                        </div>

                                        <AnimatePresence initial={false} mode="wait">
                                            {state === 'typing' && (
                                                <motion.div key="typing" {...pop} className="flex items-end gap-2">
                                                    <EchoAvatar small />
                                                    <div role="status" className="flex h-10 items-center gap-1 rounded-2xl rounded-bl-md bg-[#1f232b] px-4">
                                                        <span className="sr-only">Echo is typing</span>
                                                        {[0, 1, 2].map((dot) => (
                                                            <motion.span
                                                                key={dot}
                                                                aria-hidden="true"
                                                                className="size-1.5 rounded-full bg-[#8b919c]"
                                                                animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                                                                transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                            {state === 'open' && (
                                                <motion.div
                                                    key="answer"
                                                    {...pop}
                                                    id={`${uid}-a-${item.id}`}
                                                    role="region"
                                                    aria-labelledby={`${uid}-q-${item.id}`}
                                                    className="flex items-end gap-2"
                                                >
                                                    <EchoAvatar small />
                                                    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-[#1f232b] px-4 py-2.5 text-sm leading-relaxed text-white">
                                                        {item.a.map((part, i) =>
                                                            typeof part === 'string' ? (
                                                                <span key={i}>{i > 0 && !/^[,.]/.test(part) ? ' ' : ''}{part}</span>
                                                            ) : (
                                                                <span key={i}>
                                                                    {' '}
                                                                    <code className="rounded-md bg-[#25d366]/15 px-1.5 py-0.5 font-mono text-[12px] text-[#86efac] [overflow-wrap:anywhere]">
                                                                        {part.code}
                                                                    </code>
                                                                </span>
                                                            ),
                                                        )}
                                                        <span className="mt-1 block text-right text-[10px] text-[#8b919c]">09:41</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="flex items-center gap-3 border-t border-[#23272f] px-4 py-3 sm:px-5">
                        <p className="min-w-0 flex-1 truncate rounded-full bg-[#1f232b] px-4 py-2.5 text-sm text-[#5d636e]">
                            Tap a question to ask Echo
                        </p>
                        <a
                            href="#chatterbox-support"
                            aria-label="Talk to a human"
                            className="grid size-10 shrink-0 place-items-center rounded-full bg-[#25d366] text-[#0f1115] transition-colors hover:bg-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]"
                        >
                            <HiPaperAirplane className="size-4" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChatThreadFaqAccordion

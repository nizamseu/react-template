// ChatWindowContactSocials

// ContactSocials03 · Portfolios & Personal Websites › Contact / Socials

// Description:
// A contact section for creative technologist Mei Tanaka that behaves like a messenger.
// Next to the heading "Skip the form. Just chat." a chat window greets visitors with three
// auto-typed bubbles, offers quick replies ("I have a project", "Can you give a talk?",
// "What are your rates?", "Just saying hi") and a message box; every message you send gets
// a typing indicator and a typed-out reply. Direct links (email, Instagram, GitHub,
// LinkedIn) sit on the left. Use it as a playful contact block on a dark, bold portfolio.

// Design:
// - Two columns from lg (grid-cols-[0.9fr_1.1fr]): heading, intro and a 2×2 link grid on
//   the left; a rounded-[28px] #1a1a1a chat window (header, log, chips, composer) right
// - #111111 background, off-white #f4f1ec text, orange #ff8a00 for your bubbles, chips,
//   send button and the glow behind the window; Mei’s bubbles are graphite #262626
// - Heavy sans display heading (text-5xl → lg:text-7xl, font-black, tracking-tighter); mono
//   eyebrow, handles and "Today"/"Sent" labels; rounded-[20px] bubbles with a tucked corner
// - Bubbles rise in with framer-motion, the typing dots bounce, replies type at ~120
//   characters per second; reduced motion shows replies whole with a short pause, no bounce
// - Responsive: base stacks heading, links, then the chat with a 380px log; sm log 420px
//   and links in two columns; lg side-by-side layout with the chat window on the right

// What it does:
// - messages/typing state plus a ref-based reply queue: on mount the second and third
//   greetings are typed in; sending (Enter or the send button) adds your bubble, queues a
//   keyword-based reply (project, talk, rates, hello, or an email address) and types it
// - Empty or 280+ character messages show an inline error; used quick replies disappear;
//   "Restart chat" clears timers and the queue and shows the greetings again
// - All timeouts live in a ref set cleared on unmount; the log scrolls itself (not the
//   page); links point to #email, #instagram, #github and #linkedin

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ChatWindowContactSocials from '@/TestComponent/PageSections/portfolio/ContactSocials03';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <ChatWindowContactSocials />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { HiArrowPath, HiArrowUpRight, HiOutlineEnvelope, HiPaperAirplane } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const greetings = [
    'Hey, I’m Mei — a creative technologist in Tokyo.',
    'I build rooms, screens and sensors that react to people: museum walls, shop windows, festival installs.',
    'What are you working on? Pick a quick reply or just type.',
]

const quickReplies = ['I have a project', 'Can you give a talk?', 'What are your rates?', 'Just saying hi']

const links = [
    { id: 'email', label: 'Email', handle: 'hi@meitanaka.jp', icon: HiOutlineEnvelope },
    { id: 'instagram', label: 'Instagram', handle: '@mei.makes.light', icon: FaInstagram },
    { id: 'github', label: 'GitHub', handle: 'mei-tanaka', icon: FaGithub },
    { id: 'linkedin', label: 'LinkedIn', handle: 'in/meitanaka', icon: FaLinkedinIn },
]

const firstMessage = { id: 'g0', from: 'mei', text: greetings[0] }

function replyFor(text) {
    const lower = text.toLowerCase()
    const email = text.match(/[^\s@]+@[^\s@]+\.[^\s@]{2,}/)
    if (email) {
        return `Perfect — I’ve noted ${email[0]}. You’ll get a real reply from me (not this window) within a day, Tokyo time.`
    }
    if (/(project|build|install|commission|brief|museum|shop|window|exhibit)/.test(lower)) {
        return 'Ooh, tell me more! What’s the space — a museum, a shop window, a stage? Drop your email here and I’ll send back questions (and probably a sketch) within 24 hours.'
    }
    if (/(talk|speak|conference|workshop|panel|keynote)/.test(lower)) {
        return 'I love giving talks. The current one is “Sensors are just feelings with wires” — 35 minutes, in English or Japanese. Two dates are left for 2027: which city and month?'
    }
    if (/(rate|price|pricing|budget|cost|fee|quote)/.test(lower)) {
        return 'Prototype sprints start at ¥600,000 for two weeks. Full installations are quoted per project, usually ¥3–12M. Museums and non-profits get 20% off.'
    }
    if (/\b(hi|hello|hey|yo|ciao|konnichiwa)\b/.test(lower)) {
        return 'Hi back! Thanks for dropping by. If a project, a talk or a strange sensor is on your mind, tell me here.'
    }
    return 'Got it, thank you! I read every message myself. Leave your email in the next message and I’ll get back to you by tomorrow, Tokyo time.'
}

export function ChatWindowContactSocials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [messages, setMessages] = useState([firstMessage])
    const [typing, setTyping] = useState(false)
    const [draft, setDraft] = useState('')
    const [error, setError] = useState('')
    const [used, setUsed] = useState([])

    const reduceRef = useRef(false)
    const queue = useRef([])
    const busy = useRef(false)
    const generation = useRef(0)
    const timers = useRef(new Set())
    const nextId = useRef(1)
    const listRef = useRef(null)
    const inputRef = useRef(null)

    const wait = useCallback(
        (ms) =>
            new Promise((resolve) => {
                const id = setTimeout(() => {
                    timers.current.delete(id)
                    resolve()
                }, ms)
                timers.current.add(id)
            }),
        [],
    )

    const pump = useCallback(async () => {
        if (busy.current) return
        busy.current = true
        const gen = generation.current
        while (queue.current.length) {
            const text = queue.current.shift()
            const instant = reduceRef.current
            setTyping(true)
            await wait(instant ? 300 : 650 + Math.min(900, text.length * 7))
            if (gen !== generation.current) return
            setTyping(false)
            const id = `m${nextId.current++}`
            if (instant) {
                setMessages((prev) => [...prev, { id, from: 'mei', text }])
            } else {
                setMessages((prev) => [...prev, { id, from: 'mei', text, shown: 0 }])
                for (let shown = 2; shown < text.length; shown += 2) {
                    await wait(16)
                    if (gen !== generation.current) return
                    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, shown } : m)))
                }
                setMessages((prev) => prev.map((m) => (m.id === id ? { id: m.id, from: m.from, text: m.text } : m)))
            }
            await wait(instant ? 0 : 280)
            if (gen !== generation.current) return
        }
        busy.current = false
    }, [wait])

    const stopAll = useCallback(() => {
        generation.current += 1
        timers.current.forEach((id) => clearTimeout(id))
        timers.current.clear()
        queue.current = []
        busy.current = false
    }, [])

    useEffect(() => {
        reduceRef.current = Boolean(reduceMotion)
    }, [reduceMotion])

    useEffect(() => {
        queue.current.push(...greetings.slice(1))
        pump()
        return stopAll
    }, [pump, stopAll])

    useEffect(() => {
        const list = listRef.current
        if (list) list.scrollTop = list.scrollHeight
    }, [messages, typing])

    const send = (raw) => {
        const text = raw.trim()
        if (!text) {
            setError('Type a message first — even “hi” works.')
            inputRef.current?.focus()
            return
        }
        if (text.length > 280) {
            setError('Keep it under 280 characters — the rest can go in an email.')
            return
        }
        setError('')
        setMessages((prev) => [...prev, { id: `m${nextId.current++}`, from: 'you', text }])
        queue.current.push(replyFor(text))
        pump()
    }

    const submit = (event) => {
        event.preventDefault()
        const text = draft
        send(text)
        if (text.trim() && text.trim().length <= 280) setDraft('')
    }

    const restart = () => {
        stopAll()
        setTyping(false)
        setError('')
        setDraft('')
        setUsed([])
        setMessages(greetings.map((text, index) => ({ id: `g${index}-r${nextId.current++}`, from: 'mei', text })))
    }

    const chips = quickReplies.filter((chip) => !used.includes(chip))
    const lastYou = [...messages].reverse().find((m) => m.from === 'you')?.id

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#111111] px-4 py-16 text-base font-normal text-[#f4f1ec] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#ff8a00]">
                        Contact · Tokyo, GMT+9
                    </p>
                    <h2 className="mt-5 text-5xl font-black leading-[0.92] tracking-tighter text-[#f4f1ec] sm:text-6xl lg:text-7xl">
                        Skip the form.
                        <br />
                        Just <span className="text-[#ff8a00]">chat.</span>
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#f4f1ec]/65">
                        Tell me about the room, the screen or the strange sensor you’re working with. The
                        replies here are instant; the real ones arrive by email within a day.
                    </p>

                    <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                        {links.map((link) => {
                            const Icon = link.icon
                            return (
                                <li key={link.id}>
                                    <a
                                        href={`#${link.id}`}
                                        className="group flex min-h-16 items-center gap-3 rounded-2xl bg-[#1a1a1a] px-4 py-3 ring-1 ring-white/10 transition-colors duration-200 hover:bg-[#ff8a00] hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]"
                                    >
                                        <Icon aria-hidden="true" className="size-5 shrink-0 text-[#ff8a00] group-hover:text-[#111111]" />
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-bold">{link.label}</span>
                                            <span className="block truncate font-mono text-xs opacity-65">{link.handle}</span>
                                        </span>
                                        <HiArrowUpRight
                                            aria-hidden="true"
                                            className="size-4 shrink-0 transition-transform duration-300 group-hover:rotate-45"
                                        />
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="relative">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-8 -bottom-6 top-10 rounded-[40px] bg-[#ff8a00]/25 blur-3xl"
                    />
                    <div className="relative overflow-hidden rounded-[28px] bg-[#1a1a1a] ring-1 ring-white/10">
                        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 sm:px-5">
                            <span className="relative shrink-0">
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                                    alt="Mei Tanaka"
                                    loading="lazy"
                                    width={44}
                                    height={44}
                                    className="size-11 rounded-full object-cover"
                                />
                                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[#ff8a00] ring-2 ring-[#1a1a1a]" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-[#f4f1ec]">Mei Tanaka</p>
                                <p className="truncate text-xs text-[#f4f1ec]/55">
                                    {typing ? 'typing…' : 'Online · usually replies in ~2 h'}
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Restart chat"
                                className="grid size-10 shrink-0 place-items-center rounded-full text-[#f4f1ec]/70 transition-colors hover:bg-white/10 hover:text-[#f4f1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]"
                                onClick={restart}
                            >
                                <HiArrowPath aria-hidden="true" className="size-5" />
                            </button>
                        </div>

                        <ol
                            ref={listRef}
                            role="log"
                            aria-live="polite"
                            aria-label="Conversation with Mei"
                            className="flex h-[380px] flex-col gap-2.5 overflow-y-auto px-4 py-5 sm:h-[420px] sm:px-5"
                        >
                            <li className="self-center pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4f1ec]/35">
                                Today
                            </li>
                            {messages.map((message) => {
                                const mine = message.from === 'you'
                                const partial = typeof message.shown === 'number'
                                return (
                                    <motion.li
                                        key={message.id}
                                        initial={message.id === 'g0' ? false : { opacity: 0, y: reduceMotion ? 0 : 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeOut' }}
                                        className={cn('flex max-w-[85%] flex-col', mine ? 'self-end items-end' : 'self-start')}
                                    >
                                        <p
                                            className={cn(
                                                'rounded-[20px] px-4 py-2.5 text-[15px] leading-relaxed',
                                                mine
                                                    ? 'rounded-br-md bg-[#ff8a00] text-[#111111]'
                                                    : 'rounded-bl-md bg-[#262626] text-[#f4f1ec]',
                                            )}
                                        >
                                            <span className="sr-only">{mine ? 'You: ' : 'Mei: '}</span>
                                            {partial ? (
                                                <span aria-hidden="true">
                                                    {message.text.slice(0, message.shown)}
                                                    <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-[#ff8a00]" />
                                                </span>
                                            ) : (
                                                message.text
                                            )}
                                        </p>
                                        {mine && message.id === lastYou && (
                                            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f4f1ec]/40">
                                                Sent
                                            </span>
                                        )}
                                    </motion.li>
                                )
                            })}
                            {typing && (
                                <li className="self-start">
                                    <span className="sr-only">Mei is typing</span>
                                    <span aria-hidden="true" className="flex h-10 items-center gap-1 rounded-[20px] rounded-bl-md bg-[#262626] px-4">
                                        {[0, 1, 2].map((dot) => (
                                            <motion.span
                                                key={dot}
                                                className="size-1.5 rounded-full bg-[#f4f1ec]/70"
                                                animate={reduceMotion ? { opacity: 0.7 } : { y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                                                transition={
                                                    reduceMotion
                                                        ? { duration: 0 }
                                                        : { duration: 0.8, repeat: Infinity, delay: dot * 0.15 }
                                                }
                                            />
                                        ))}
                                    </span>
                                </li>
                            )}
                        </ol>

                        {chips.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-4 pb-3 sm:px-5" role="group" aria-label="Quick replies">
                                {chips.map((chip) => (
                                    <button
                                        key={chip}
                                        type="button"
                                        className="inline-flex min-h-10 items-center rounded-full px-3.5 text-sm font-medium text-[#ff8a00] ring-1 ring-[#ff8a00]/50 transition-colors hover:bg-[#ff8a00] hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]"
                                        onClick={() => {
                                            setUsed((prev) => [...prev, chip])
                                            send(chip)
                                        }}
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form noValidate className="border-t border-white/10 p-3 sm:p-4" onSubmit={submit}>
                            <div className="flex items-center gap-2">
                                <label htmlFor="mei-chat-input" className="sr-only">
                                    Message Mei
                                </label>
                                <input
                                    ref={inputRef}
                                    id="mei-chat-input"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Write a message…"
                                    value={draft}
                                    aria-invalid={error ? true : undefined}
                                    aria-describedby={error ? 'mei-chat-error' : undefined}
                                    className="min-h-12 min-w-0 flex-1 rounded-full bg-[#111111] px-5 text-[15px] text-[#f4f1ec] ring-1 ring-white/10 placeholder:text-[#f4f1ec]/35 focus:outline-none focus:ring-2 focus:ring-[#ff8a00]"
                                    onChange={(event) => {
                                        setDraft(event.target.value)
                                        if (error) setError('')
                                    }}
                                />
                                <button
                                    type="submit"
                                    aria-label="Send message"
                                    className="grid size-12 shrink-0 place-items-center rounded-full bg-[#ff8a00] text-[#111111] transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00] motion-reduce:hover:scale-100"
                                >
                                    <HiPaperAirplane aria-hidden="true" className="size-5" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between gap-4 px-2 pt-2">
                                <p id="mei-chat-error" role="alert" className="text-xs text-[#ffb366]">
                                    {error}
                                </p>
                                <p
                                    className={cn(
                                        'shrink-0 font-mono text-[10px] tabular-nums',
                                        draft.length > 280 ? 'text-[#ffb366]' : 'text-[#f4f1ec]/35',
                                    )}
                                >
                                    {draft.length}/280
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChatWindowContactSocials

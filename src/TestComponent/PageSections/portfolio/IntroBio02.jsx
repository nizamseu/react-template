// ShellSessionIntroBio

// IntroBio02 · Portfolios & Personal Websites › Intro / Bio

// Description:
// A terminal-first intro for backend engineer Nadia Karim. Beside the mono headline "I
// build backends that stay boring under load." a zsh window types `whoami`, `cat
// skills.txt` and `ls projects/` and prints their output, then lets visitors run `cat
// now.txt` or `clear` from chips. Includes latency/uptime stats and "cd ~/projects" /
// "mail nadia" CTAs. Use it as the opening section of an engineer's personal site.

// Design:
// - Near-black #0c0c0c section with a dotted grid and a green #7ee787 glow; body copy
//   #c9d1d9, prompt paths #79c0ff, keys #d2a8ff, dim text #8b949e; mono except the bio
// - Two columns from lg (5 / 7): intro, stats and CTAs left, terminal right; stacks with
//   the terminal below the intro on mobile and tablet
// - Terminal: #0d1117 panel, rounded-xl, #30363d hairlines, soft green outer glow, fixed
//   body height (22rem → sm:26rem) that scrolls internally, green tmux-style status bar
// - Commands type character by character with a blinking block cursor; output lines fade
//   up in sequence; reduced motion prints everything instantly with no blinking
// - Mobile: key/value output uses a 5.5rem label column, long values wrap, chips wrap

// What it does:
// - When the terminal scrolls into view the three commands are queued and typed one after
//   another (timeouts cleared on unmount); history is a role="log" region
// - Chips queue `whoami`, `cat skills.txt`, `ls projects/`, `cat now.txt` or `clear`;
//   "Replay" restarts the session, "Skip" prints everything that is still pending
// - The status bar shows Lisbon time: fixed "14:32" on the server, then the real
//   Europe/Lisbon time from useEffect, refreshed every 15 s
// - "cd ~/projects" links to #projects and "mail nadia" to #contact

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ShellSessionIntroBio from '@/TestComponent/PageSections/portfolio/IntroBio02';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <ShellSessionIntroBio />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { HiOutlineArrowPath, HiOutlineForward } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const COMMANDS = {
    whoami: {
        cmd: 'whoami',
        out: [
            { kind: 'text', parts: [['hi', 'nadia karim'], ['', ' · staff backend engineer @ tallyrail']] },
            { kind: 'text', parts: [['dim', 'lisbon, pt · utc+1 · she/her']] },
            {
                kind: 'text',
                parts: [['', '7 yrs of payment rails, queues and apis nobody notices. that is the point.']],
            },
        ],
    },
    skills: {
        cmd: 'cat skills.txt',
        out: [
            { kind: 'kv', k: 'languages', v: 'go · rust · python · sql' },
            { kind: 'kv', k: 'storage', v: 'postgres · redis · clickhouse · s3' },
            { kind: 'kv', k: 'streaming', v: 'kafka · nats · debezium' },
            { kind: 'kv', k: 'infra', v: 'kubernetes · terraform · nix · aws' },
            { kind: 'kv', k: 'practice', v: 'slos · event sourcing · chaos drills · blameless reviews' },
        ],
    },
    projects: {
        cmd: 'ls projects/',
        out: [
            { kind: 'ls', items: ['ledgerd/', 'quietq/', 'pgshard-cli/', 'tracewell/', 'status-kit/', 'README.md'] },
            { kind: 'text', parts: [['dim', '# write-ups for each one live in the projects section below']] },
        ],
    },
    now: {
        cmd: 'cat now.txt',
        out: [
            { kind: 'kv', k: 'shipping', v: 'ledgerd v2: idempotent transfers at 12k rps' },
            { kind: 'kv', k: 'reading', v: 'designing data-intensive applications (3rd pass)' },
            { kind: 'kv', k: 'learning', v: 'zig, slowly · tla+, stubbornly' },
            { kind: 'kv', k: 'open to', v: 'staff / principal roles · remote, eu hours' },
        ],
    },
    clear: { cmd: 'clear', out: [] },
}

const AUTO = ['whoami', 'skills', 'projects']
const CHIPS = ['whoami', 'skills', 'projects', 'now', 'clear']
const INITIAL_TIME = '14:32'

const tones = {
    '': 'text-[#c9d1d9]',
    hi: 'font-bold text-[#7ee787]',
    dim: 'text-[#8b949e]',
}

const stats = [
    { value: '38 ms', label: 'p99 at 12k rps', note: 'ledgerd, prod' },
    { value: '99.995%', label: 'uptime, last 12 mo', note: 'payments api' },
    { value: '1,412', label: 'pages acked < 5 min', note: 'since 2019' },
]

function Prompt() {
    return (
        <span aria-hidden="true" className="select-none">
            <span className="text-[#7ee787]">nadia@karim</span>
            <span className="text-[#8b949e]">:</span>
            <span className="text-[#79c0ff]">~</span>
            <span className="text-[#8b949e]"> $ </span>
        </span>
    )
}

function Cursor({ reduceMotion }) {
    return (
        <motion.span
            aria-hidden="true"
            className="ml-px inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-[#7ee787]"
            animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }}
        />
    )
}

function OutputLine({ line }) {
    if (line.kind === 'kv') {
        return (
            <div className="grid grid-cols-[5.5rem_1fr] gap-x-3 sm:grid-cols-[7rem_1fr]">
                <span className="text-[#d2a8ff]">{line.k}</span>
                <span className="text-[#c9d1d9]">{line.v}</span>
            </div>
        )
    }
    if (line.kind === 'ls') {
        return (
            <div className="flex flex-wrap gap-x-5 gap-y-0.5">
                {line.items.map((item) => (
                    <span key={item} className={item.endsWith('/') ? 'font-bold text-[#79c0ff]' : 'text-[#c9d1d9]'}>
                        {item}
                    </span>
                ))}
            </div>
        )
    }
    return (
        <p>
            {line.parts.map(([tone, text]) => (
                <span key={text} className={tones[tone]}>
                    {text}
                </span>
            ))}
        </p>
    )
}

export function ShellSessionIntroBio({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const terminalRef = useRef(null)
    const bodyRef = useRef(null)
    const keyRef = useRef(0)
    const inView = useInView(terminalRef, { once: true, amount: 0.35 })
    const [started, setStarted] = useState(false)
    const [history, setHistory] = useState([])
    const [queue, setQueue] = useState([])
    const [typing, setTyping] = useState(null)
    const [time, setTime] = useState(INITIAL_TIME)

    const nextKey = () => {
        keyRef.current += 1
        return keyRef.current
    }

    useEffect(() => {
        if (!inView || started) return
        setStarted(true)
        if (reduceMotion) {
            setHistory(AUTO.map((id, index) => ({ id, key: `auto-${index}` })))
        } else {
            setQueue(AUTO)
        }
    }, [inView, started, reduceMotion])

    useEffect(() => {
        if (typing || queue.length === 0) return undefined
        const id = setTimeout(() => {
            keyRef.current += 1
            setTyping({ id: queue[0], chars: 0, key: keyRef.current })
            setQueue((q) => q.slice(1))
        }, 420)
        return () => clearTimeout(id)
    }, [typing, queue])

    useEffect(() => {
        if (!typing) return undefined
        const full = COMMANDS[typing.id].cmd
        if (typing.chars < full.length) {
            const id = setTimeout(
                () => setTyping((t) => (t ? { ...t, chars: t.chars + 1 } : t)),
                45 + ((typing.chars * 37) % 60),
            )
            return () => clearTimeout(id)
        }
        const id = setTimeout(() => {
            if (typing.id === 'clear') setHistory([])
            else setHistory((h) => [...h, { id: typing.id, key: typing.key }])
            setTyping(null)
        }, 260)
        return () => clearTimeout(id)
    }, [typing])

    useEffect(() => {
        const el = bodyRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [history, typing])

    useEffect(() => {
        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Lisbon',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        const tick = () => setTime(formatter.format(new Date()))
        tick()
        const id = setInterval(tick, 15000)
        return () => clearInterval(id)
    }, [])

    const run = (id) => {
        setStarted(true)
        if (reduceMotion) {
            if (id === 'clear') setHistory([])
            else setHistory((h) => [...h, { id, key: nextKey() }])
            return
        }
        setQueue((q) => [...q, id])
    }

    const skip = () => {
        let list = [...history]
        const pending = started ? [...(typing ? [typing.id] : []), ...queue] : AUTO
        pending.forEach((id) => {
            if (id === 'clear') list = []
            else list = [...list, { id, key: nextKey() }]
        })
        setStarted(true)
        setHistory(list)
        setQueue([])
        setTyping(null)
    }

    const replay = () => {
        setStarted(true)
        setTyping(null)
        if (reduceMotion) {
            setQueue([])
            setHistory(AUTO.map((id) => ({ id, key: nextKey() })))
            return
        }
        setHistory([])
        setQueue(AUTO)
    }

    const busy = Boolean(typing) || queue.length > 0 || !started

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0c0c0c] px-4 py-16 font-mono text-base font-normal text-[#c9d1d9] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(126,231,135,0.09)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-10 -z-10 size-[36rem] rounded-full bg-[#7ee787]/10 blur-[120px]"
            />

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#7ee787]">
                        <span className="size-1.5 rounded-full bg-[#7ee787]" aria-hidden="true" />
                        ~/about · backend engineer
                    </p>
                    <h2 className="mt-6 font-mono text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#f0f6fc] sm:text-5xl lg:text-[3.35rem]">
                        I build backends that stay <span className="text-[#7ee787]">boring</span> under load.
                    </h2>
                    <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-[#c9d1d9]/80 md:text-lg">
                        Nadia Karim — staff engineer in Lisbon. Payment rails, event pipelines and the kind of
                        APIs nobody thinks about until they break. Mine mostly don&apos;t.
                    </p>

                    <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-[#30363d] bg-[#30363d]">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col-reverse justify-end bg-[#0d1117] p-3 sm:p-4">
                                <dt className="mt-1 text-[10px] leading-snug text-[#8b949e] sm:text-[11px]">
                                    {stat.label}
                                    <span className="block text-[#8b949e]/60">{stat.note}</span>
                                </dt>
                                <dd className="text-lg font-bold tracking-tight text-[#7ee787] sm:text-2xl">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href="#projects"
                            className="inline-flex min-h-11 items-center rounded-md bg-[#7ee787] px-4 text-sm font-bold text-[#0c0c0c] transition-colors hover:bg-[#aff5b4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7ee787]"
                        >
                            <span aria-hidden="true" className="mr-2 opacity-60">
                                $
                            </span>
                            cd ~/projects
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex min-h-11 items-center rounded-md border border-[#30363d] px-4 text-sm font-bold text-[#c9d1d9] transition-colors hover:border-[#7ee787] hover:text-[#7ee787] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7ee787]"
                        >
                            <span aria-hidden="true" className="mr-2 opacity-60">
                                $
                            </span>
                            mail nadia
                        </a>
                    </div>
                </div>

                <div className="min-w-0 lg:col-span-7">
                    <div
                        ref={terminalRef}
                        className="overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] shadow-[0_0_0_1px_rgba(126,231,135,0.05),0_40px_120px_-40px_rgba(126,231,135,0.35)]"
                    >
                        <div className="flex h-12 items-center gap-3 border-b border-[#30363d] bg-[#161b22] pl-4 pr-1.5">
                            <span className="flex gap-1.5" aria-hidden="true">
                                <span className="size-3 rounded-full bg-[#30363d]" />
                                <span className="size-3 rounded-full bg-[#30363d]" />
                                <span className="size-3 rounded-full bg-[#7ee787]/70" />
                            </span>
                            <p className="min-w-0 flex-1 truncate text-center text-xs text-[#8b949e]">
                                nadia@karim: ~ <span className="hidden sm:inline">— zsh — 96×28</span>
                            </p>
                            <button
                                type="button"
                                aria-label="Replay terminal session"
                                className="inline-flex size-10 items-center justify-center gap-1.5 rounded-md text-xs text-[#8b949e] transition-colors hover:bg-[#30363d]/60 hover:text-[#f0f6fc] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7ee787] sm:w-auto sm:px-2.5"
                                onClick={replay}
                            >
                                <HiOutlineArrowPath aria-hidden="true" className="size-4" />
                                <span className="hidden sm:inline">Replay</span>
                            </button>
                            <button
                                type="button"
                                disabled={!busy}
                                aria-label="Skip typing and print everything"
                                className="inline-flex size-10 items-center justify-center gap-1.5 rounded-md text-xs text-[#8b949e] transition-colors hover:bg-[#30363d]/60 hover:text-[#f0f6fc] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7ee787] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#8b949e] sm:w-auto sm:px-2.5"
                                onClick={skip}
                            >
                                <HiOutlineForward aria-hidden="true" className="size-4" />
                                <span className="hidden sm:inline">Skip</span>
                            </button>
                        </div>

                        <div
                            ref={bodyRef}
                            tabIndex={0}
                            aria-label="Terminal output"
                            className="h-[22rem] overflow-y-auto overscroll-contain px-4 py-4 text-[13px] leading-6 [scrollbar-color:#30363d_transparent] [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7ee787]/60 sm:h-[26rem] sm:px-5 sm:text-sm"
                        >
                            <p className="text-[#8b949e]">Last login: Sun Sep 27 09:12:44 on ttys004</p>
                            <div role="log" aria-live="polite">
                                {history.map((entry) => {
                                    const command = COMMANDS[entry.id]
                                    return (
                                        <div key={entry.key} className="mt-3">
                                            <p className="break-words">
                                                <Prompt />
                                                <span className="sr-only">$ </span>
                                                <span className="text-[#f0f6fc]">{command.cmd}</span>
                                            </p>
                                            <div className="mt-1 space-y-0.5 break-words">
                                                {command.out.map((line, index) => (
                                                    <motion.div
                                                        key={`${entry.key}-${index}`}
                                                        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.25, delay: index * 0.07 }}
                                                    >
                                                        <OutputLine line={line} />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="mt-3 break-words" aria-hidden="true">
                                <Prompt />
                                <span className="text-[#f0f6fc]">
                                    {typing ? COMMANDS[typing.id].cmd.slice(0, typing.chars) : ''}
                                </span>
                                <Cursor reduceMotion={reduceMotion} />
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-t border-[#30363d] px-3 py-3 sm:px-4">
                            <span className="mr-1 text-xs text-[#8b949e]">try:</span>
                            {CHIPS.map((id) => (
                                <button
                                    key={id}
                                    type="button"
                                    aria-label={`Run ${COMMANDS[id].cmd}`}
                                    className="inline-flex min-h-10 items-center rounded-md border border-[#30363d] bg-[#161b22] px-3 text-xs text-[#c9d1d9] transition-colors hover:border-[#7ee787]/70 hover:text-[#7ee787] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787] active:translate-y-px"
                                    onClick={() => run(id)}
                                >
                                    {COMMANDS[id].cmd}
                                </button>
                            ))}
                        </div>

                        <div className="flex h-7 items-center justify-between gap-3 bg-[#7ee787] px-3 text-[11px] font-bold text-[#0c0c0c]">
                            <span className="truncate">
                                [nadia] 0:zsh* <span className="hidden font-normal sm:inline">1:logs- 2:psql-</span>
                            </span>
                            <span className="shrink-0 tabular-nums">
                                <span className="hidden font-normal sm:inline">on-call: off · </span>
                                lisbon {time}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShellSessionIntroBio

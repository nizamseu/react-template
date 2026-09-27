// TerminalPromptNewsletterCard

// NewsletterCard02 · Blogs & Digital Media › Newsletter Subscription Card

// Description:
// A developer-newsletter sign-up for diff/weekly styled as a shell session. The mono heading
// "Read the diff, skip the firehose." sits over a red/green diff of what the newsletter
// replaces, next to a terminal window where readers type into "$ subscribe --email" and
// press Enter (or "Run"). Bad input prints an error line; a valid address types out
// confirmation lines. Use it on dev blogs, docs sites or changelog pages.

// Design:
// - Black #050505 section with a faint dot grid; text #d4d4d4, green #4ade80 accents, error
//   red #f87171; everything in font-mono with tight tracking on the display heading
// - Diff block: rounded-xl bordered panel, "@@ issue #212 @@" hunk header, "-" rows on a
//   red/10 wash and "+" rows on a green/10 wash; three stats underneath in a divided row
// - Terminal: #0b0b0b window, rounded-2xl, 1px white/10 border, green glow shadow, title
//   bar with window dots, "~/inbox — zsh" and an "exit 0 / exit 1" status chip
// - Confirmation lines type out character by character with a blinking block cursor; with
//   reduced motion they appear at once and the cursor stops blinking
// - Responsive: stacked at base, lg:grid-cols-[0.9fr_1.1fr]; terminal text text-xs →
//   sm:text-sm, lines use pre-wrap + break-words so long emails never overflow at 360px

// What it does:
// - Controlled email input inside the prompt plus a "--format" toggle (html / plain,
//   aria-pressed) that is written into the echoed command
// - Submit (Enter or "Run") echoes the command into the log; invalid input appends an error
//   and hint line and sets exit 1; valid input starts a timeout-driven typewriter (cleared on
//   unmount) and ends with a "subscribed" line and exit 0
// - ArrowUp restores the last address typed, Escape clears the input, clicking the terminal
//   body focuses the prompt; "subscribe another" resets; "Read issue #212" links to
//   #diff-weekly-issue-212

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TerminalPromptNewsletterCard from '@/TestComponent/PageSections/media/NewsletterCard02';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <TerminalPromptNewsletterCard />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { LuArrowUpRight, LuCornerDownLeft, LuRotateCcw } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const diffRows = [
    { sign: '-', text: '43 open tabs of release notes' },
    { sign: '-', text: '6 RSS feeds you swore you’d read' },
    { sign: '-', text: '“did anyone see this?” threads' },
    { sign: '+', text: 'one email, Fridays 09:00 UTC' },
    { sign: '+', text: '12 links, each with a two-line why' },
    { sign: '+', text: 'a diff of what changed on the platform' },
]

const stats = [
    { value: '38,900', label: 'readers' },
    { value: '71%', label: 'open rate' },
    { value: '212', label: 'issues' },
]

const bootLines = [
    { text: 'Last login: Fri Sep 25 08:59:12 on ttys004', tone: 'dim' },
    { text: '$ cat ~/diff-weekly/README', tone: 'cmd' },
    { text: 'diff/weekly: a weekly changelog for people who build the web.', tone: 'out' },
    { text: 'What shipped in browsers, what broke in frameworks, and the', tone: 'out' },
    { text: 'twelve links actually worth your Friday.', tone: 'out' },
    { text: '$ diff-weekly stats', tone: 'cmd' },
    { text: '  issues     212    readers   38,900', tone: 'out' },
    { text: '  open rate  71%    since     2022-03', tone: 'out' },
]

const toneClass = {
    dim: 'text-[#d4d4d4]/40',
    cmd: 'text-[#f5f5f5]',
    out: 'text-[#d4d4d4]/75',
    err: 'text-[#f87171]',
    hint: 'text-[#f87171]/70',
    ok: 'text-[#4ade80]',
    step: 'text-[#d4d4d4]/80',
}

function successLines(email, format) {
    const domain = email.split('@')[1]
    return [
        { text: '→ validating address ............ ok', tone: 'step' },
        { text: `→ resolving MX for ${domain} ... ok`, tone: 'step' },
        { text: `→ adding ${email} to readers ... done`, tone: 'step' },
        { text: `→ queueing welcome issue #212 (${format}) ... sent`, tone: 'step' },
        { text: '✔ subscribed. next diff lands Fri 09:00 UTC.', tone: 'ok' },
    ]
}

function Line({ line, children }) {
    return (
        <p className={cn('whitespace-pre-wrap break-words', toneClass[line.tone])}>
            {line.tone === 'cmd' ? (
                <>
                    <span className="text-[#4ade80]">$</span>
                    {line.text.slice(1)}
                </>
            ) : (
                line.text
            )}
            {children}
        </p>
    )
}

export function TerminalPromptNewsletterCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const inputRef = useRef(null)
    const entryId = useRef(0)
    const [email, setEmail] = useState('')
    const [format, setFormat] = useState('html')
    const [log, setLog] = useState([])
    const [exitCode, setExitCode] = useState(null)
    const [lastTyped, setLastTyped] = useState('')
    const [queue, setQueue] = useState([])
    const [cursor, setCursor] = useState({ line: 0, char: 0 })
    const [phase, setPhase] = useState('idle')

    useEffect(() => {
        if (phase !== 'typing') return undefined
        if (reduceMotion) {
            setCursor({ line: queue.length - 1, char: queue[queue.length - 1].text.length })
            setPhase('done')
            setExitCode(0)
            return undefined
        }
        const current = queue[cursor.line]
        let id
        if (cursor.char < current.text.length) {
            id = setTimeout(() => setCursor({ line: cursor.line, char: cursor.char + 2 }), 16)
        } else if (cursor.line < queue.length - 1) {
            id = setTimeout(() => setCursor({ line: cursor.line + 1, char: 0 }), 240)
        } else {
            id = setTimeout(() => {
                setPhase('done')
                setExitCode(0)
            }, 200)
        }
        return () => clearTimeout(id)
    }, [phase, cursor, queue, reduceMotion])

    const handleSubmit = (event) => {
        event.preventDefault()
        if (phase === 'typing') return
        const value = email.trim()
        if (value) setLastTyped(value)
        const command = { text: `$ subscribe --email ${value || '""'} --format=${format}`, tone: 'cmd' }
        if (!EMAIL_RE.test(value)) {
            const lines = value
                ? [
                      { text: `error: invalid value '${value}' for '--email <address>'`, tone: 'err' },
                      { text: '  hint: expected something like you@domain.dev', tone: 'hint' },
                  ]
                : [
                      { text: "error: the argument '--email <address>' requires a value", tone: 'err' },
                      { text: '  hint: type your address after --email and press Enter', tone: 'hint' },
                  ]
            entryId.current += 1
            setLog((prev) => [...prev, { id: entryId.current, lines: [command, ...lines] }].slice(-4))
            setExitCode(1)
            return
        }
        entryId.current += 1
        setLog((prev) => [...prev, { id: entryId.current, lines: [command] }].slice(-4))
        setQueue(successLines(value, format))
        setCursor({ line: 0, char: 0 })
        setExitCode(null)
        setPhase('typing')
    }

    const reset = () => {
        setPhase('idle')
        setQueue([])
        setLog([])
        setEmail('')
        setExitCode(null)
        requestAnimationFrame(() => inputRef.current?.focus())
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp' && lastTyped) {
            event.preventDefault()
            setEmail(lastTyped)
        } else if (event.key === 'Escape') {
            setEmail('')
        }
    }

    const lastError = exitCode === 1
    const inputId = `${uid}-email`
    const errorId = `${uid}-error`

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#050505] px-4 py-16 font-mono text-base font-normal text-[#d4d4d4] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage: 'radial-gradient(rgba(74,222,128,0.13) 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                    maskImage: 'radial-gradient(ellipse at 70% 40%, #000 20%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at 70% 40%, #000 20%, transparent 75%)',
                }}
            />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div className="min-w-0">
                    <p className="flex items-center gap-3 text-xs text-[#4ade80]">
                        <span className="grid size-6 place-items-center rounded-[4px] bg-[#4ade80] text-[11px] font-black text-[#050505]">
                            d/
                        </span>
                        diff/weekly · a changelog for the web
                    </p>
                    <h2 className="mt-6 font-mono text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-[#f5f5f5] sm:text-5xl lg:text-6xl">
                        Read the <span className="text-[#4ade80]">diff</span>, skip the firehose.
                    </h2>
                    <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-[#d4d4d4]/70">
                        Every Friday, one email with what actually changed in browsers, frameworks and
                        tooling, written by two engineers who read the release notes so you don’t have to.
                    </p>

                    <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] text-[13px] leading-7">
                        <p className="border-b border-white/10 px-4 py-1.5 text-[#a78bfa]">
                            @@ issue #212 · Fri 25 Sep @@
                        </p>
                        <div className="py-2">
                            {diffRows.map((row) => (
                                <p
                                    key={row.text}
                                    className={cn(
                                        'flex gap-3 px-4',
                                        row.sign === '+'
                                            ? 'bg-[#4ade80]/10 text-[#bbf7d0]'
                                            : 'bg-[#f87171]/[0.08] text-[#fecaca]/80',
                                    )}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={row.sign === '+' ? 'text-[#4ade80]' : 'text-[#f87171]'}
                                    >
                                        {row.sign}
                                    </span>
                                    <span className="sr-only">{row.sign === '+' ? 'Added:' : 'Removed:'}</span>
                                    <span className={cn('min-w-0', row.sign === '-' && 'line-through decoration-[#f87171]/40')}>
                                        {row.text}
                                    </span>
                                </p>
                            ))}
                        </div>
                    </div>

                    <dl className="mt-8 grid max-w-md grid-cols-3 divide-x divide-white/10 border-y border-white/10">
                        {stats.map((stat) => (
                            <div key={stat.label} className="px-3 py-4 first:pl-0">
                                <dt className="text-[10px] uppercase tracking-[0.22em] text-[#d4d4d4]/50">
                                    {stat.label}
                                </dt>
                                <dd className="mt-1 text-xl font-bold tabular-nums text-[#f5f5f5] sm:text-2xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(74,222,128,0.06),0_40px_90px_-40px_rgba(74,222,128,0.45)]">
                    <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                        <span aria-hidden="true" className="flex gap-1.5">
                            <span className="size-3 rounded-full bg-[#f87171]/80" />
                            <span className="size-3 rounded-full bg-[#fbbf24]/80" />
                            <span className="size-3 rounded-full bg-[#4ade80]/80" />
                        </span>
                        <p className="min-w-0 flex-1 truncate text-center text-xs text-[#d4d4d4]/50">
                            readers@diff-weekly: ~/inbox — zsh
                        </p>
                        <span
                            className={cn(
                                'rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]',
                                exitCode === 0 && 'border-[#4ade80]/40 text-[#4ade80]',
                                exitCode === 1 && 'border-[#f87171]/40 text-[#f87171]',
                                exitCode === null && 'border-white/10 text-[#d4d4d4]/40',
                            )}
                        >
                            {exitCode === null ? (phase === 'typing' ? 'running' : 'ready') : `exit ${exitCode}`}
                        </span>
                    </div>

                    <div
                        className="min-h-[380px] cursor-text space-y-0.5 p-4 text-xs leading-6 sm:p-6 sm:text-sm sm:leading-7"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {bootLines.map((line) => (
                            <Line key={line.text} line={line} />
                        ))}

                        {log.map((entry) => (
                            <div key={entry.id} className="space-y-0.5">
                                {entry.lines.map((line, index) => (
                                    <Line key={`${entry.id}-${index}`} line={line} />
                                ))}
                            </div>
                        ))}

                        {phase !== 'idle' && (
                            <div className="space-y-0.5">
                                {queue.slice(0, cursor.line + 1).map((line, index) => {
                                    const typing = phase === 'typing' && index === cursor.line
                                    return (
                                        <Line
                                            key={line.text}
                                            line={{ ...line, text: typing ? line.text.slice(0, cursor.char) : line.text }}
                                        >
                                            {typing && (
                                                <span
                                                    aria-hidden="true"
                                                    className="ml-0.5 inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-[#4ade80] motion-safe:animate-pulse"
                                                />
                                            )}
                                        </Line>
                                    )
                                })}
                            </div>
                        )}

                        <p id={errorId} role="status" className="sr-only">
                            {lastError ? log[log.length - 1]?.lines[1]?.text : ''}
                            {phase === 'done' ? 'Subscribed. The next diff lands Friday at 09:00 UTC.' : ''}
                        </p>

                        {phase === 'done' && (
                            <div className="flex flex-wrap items-center gap-2 pt-3">
                                <span className="text-[#4ade80]">$</span>
                                <button
                                    type="button"
                                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 px-3 text-xs text-[#f5f5f5] transition-colors hover:border-[#4ade80] hover:text-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        reset()
                                    }}
                                >
                                    <LuRotateCcw aria-hidden="true" className="size-3.5" />
                                    subscribe another
                                </button>
                                <a
                                    href="#diff-weekly-issue-212"
                                    className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#4ade80] px-3 text-xs font-bold text-[#050505] transition-colors hover:bg-[#86efac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    Read issue #212
                                    <LuArrowUpRight aria-hidden="true" className="size-3.5" />
                                </a>
                            </div>
                        )}

                        {phase === 'idle' && (
                            <form noValidate className="pt-1" onSubmit={handleSubmit}>
                                <label htmlFor={inputId} className="sr-only">
                                    Email address
                                </label>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="whitespace-nowrap text-[#f5f5f5]">
                                        <span className="text-[#4ade80]">$</span> subscribe --email
                                    </span>
                                    <input
                                        ref={inputRef}
                                        id={inputId}
                                        type="email"
                                        inputMode="email"
                                        autoComplete="email"
                                        spellCheck={false}
                                        placeholder="you@domain.dev"
                                        value={email}
                                        aria-invalid={lastError}
                                        aria-describedby={lastError ? errorId : undefined}
                                        className="min-h-10 min-w-[10rem] flex-1 border-0 bg-transparent p-0 font-mono text-[#4ade80] caret-[#4ade80] outline-none placeholder:text-[#d4d4d4]/25"
                                        onChange={(event) => setEmail(event.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-dashed border-white/10 pt-4">
                                    <div
                                        role="group"
                                        aria-label="Email format"
                                        className="inline-flex items-center rounded-md border border-white/10 p-0.5 text-xs"
                                    >
                                        <span className="px-2 text-[#d4d4d4]/50">--format</span>
                                        {['html', 'plain'].map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                aria-pressed={format === option}
                                                className={cn(
                                                    'min-h-9 rounded-[5px] px-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4ade80]',
                                                    format === option
                                                        ? 'bg-[#4ade80]/15 text-[#4ade80]'
                                                        : 'text-[#d4d4d4]/60 hover:text-[#f5f5f5]',
                                                )}
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    setFormat(option)
                                                }}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-md bg-[#4ade80] px-4 text-xs font-bold text-[#050505] transition-colors hover:bg-[#86efac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]"
                                    >
                                        Run
                                        <LuCornerDownLeft aria-hidden="true" className="size-3.5" />
                                    </button>
                                </div>
                                <p className="mt-3 text-[11px] leading-5 text-[#d4d4d4]/35">
                                    ↑ recalls your last address · esc clears · unsubscribe with one link, any time
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TerminalPromptNewsletterCard

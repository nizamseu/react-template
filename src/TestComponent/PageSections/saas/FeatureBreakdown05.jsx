// CommandPaletteFeatureBreakdown

// FeatureBreakdown05 · SaaS Platforms › Feature Breakdown

// Description:
// A hands-on feature tour for the developer platform Shipyard, built as a working fake ⌘K
// command palette. Under the heading "Every feature is one keystroke away." visitors type to
// filter seven commands (Deploy preview, Roll back production, Tail live logs, Add
// environment secret …), move with the arrow keys and press Enter; the chosen command opens
// a feature panel with a short pitch, a replayed terminal session and three facts. Use it
// on developer-tool landing pages where "show, don't tell" matters.

// Design:
// - Black #000000 section, #0a0a0a panels with white/10 borders, neutral #a3a3a3 text,
//   #fafafa headings and orange #f97316 for the caret, matches, active row and prompts;
//   monospace type throughout, with a soft orange glow behind the palette
// - lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]: palette on the left (search row, grouped
//   list Deploy / Observe / Configure with shortcut keycaps, key-hint footer), feature panel
//   on the right (title, copy, terminal window, three fact chips)
// - Active option: orange left bar + white/6 fill; typed matches are highlighted in orange;
//   the empty state suggests other terms
// - Motion: the panel cross-fades on change and terminal lines appear one by one (180ms
//   apart) with a blinking cursor; reduced motion shows all lines at once, no blink
// - Responsive: palette above panel below lg; the list scrolls inside a max-h-[20rem] box and
//   keycaps hide below sm so labels never squeeze

// What it does:
// - query filters commands by label and keywords (every typed word must match); highlight
//   resets to the first result; ArrowUp/Down wrap, Enter selects, Escape clears the query
// - Combobox pattern: input role="combobox" with aria-activedescendant, listbox with grouped
//   options (aria-selected), result count and chosen command announced via aria-live
// - While the section is in view, ⌘K / Ctrl+K focuses the search field; clicking an option
//   selects it; "Start deploying free" links to #shipyard-signup

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CommandPaletteFeatureBreakdown from '@/TestComponent/PageSections/saas/FeatureBreakdown05';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <CommandPaletteFeatureBreakdown />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import {
    LuCornerDownLeft,
    LuDatabase,
    LuGauge,
    LuKeyRound,
    LuRocket,
    LuScrollText,
    LuSearch,
    LuUndo2,
    LuUserPlus,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const groups = ['Deploy', 'Observe', 'Configure']

const commands = [
    {
        id: 'deploy-preview',
        group: 'Deploy',
        label: 'Deploy preview',
        keywords: 'branch pull request pr url build',
        keys: ['D', 'P'],
        icon: LuRocket,
        title: 'A preview URL for every pull request',
        body: 'Push a branch and Shipyard builds it in an isolated environment with its own database snapshot. Reviewers click a link instead of pulling code.',
        terminal: [
            { kind: 'cmd', text: 'shipyard deploy --preview' },
            { kind: 'info', text: 'Building feat/checkout-v2 (a41c9e2)' },
            { kind: 'info', text: '212 modules · build cache hit 94%' },
            { kind: 'ok', text: 'Ready in 38s → checkout-v2.preview.shipyard.dev' },
        ],
        facts: ['38s median build', 'Unlimited previews', 'Auto-deleted on merge'],
    },
    {
        id: 'rollback',
        group: 'Deploy',
        label: 'Roll back production',
        keywords: 'revert release undo restore incident',
        keys: ['R', 'B'],
        icon: LuUndo2,
        title: 'Instant rollbacks, no rebuild',
        body: 'Every release stays warm for 30 days. Rolling back flips traffic to a known-good build in seconds, and the incident channel gets the diff.',
        terminal: [
            { kind: 'cmd', text: 'shipyard rollback production --to v2026.09.24-3' },
            { kind: 'info', text: 'Found 3 healthy releases in the last 72h' },
            { kind: 'info', text: 'Shifting traffic 0% → 100% across 12 instances' },
            { kind: 'ok', text: 'Rolled back in 4.2s · zero cold starts' },
        ],
        facts: ['4.2s average rollback', '30-day release history', 'One-click from chat'],
    },
    {
        id: 'migrate',
        group: 'Deploy',
        label: 'Run database migration',
        keywords: 'db postgres schema sql migrate',
        keys: ['M'],
        icon: LuDatabase,
        title: 'Migrations that plan before they run',
        body: 'Shipyard dry-runs every migration against a copy of production, estimates lock time and blocks anything that would take the site down.',
        terminal: [
            { kind: 'cmd', text: 'shipyard db migrate --plan' },
            { kind: 'info', text: '2 pending: 0142_invoices_index, 0143_backfill_currency' },
            { kind: 'info', text: 'Estimated table lock: 0 ms (online index build)' },
            { kind: 'ok', text: 'Applied 2 migrations in 11.8s' },
        ],
        facts: ['Dry-run on a prod copy', 'Lock-time estimates', 'Automatic backups first'],
    },
    {
        id: 'logs',
        group: 'Observe',
        label: 'Tail live logs',
        keywords: 'errors stream debug follow output',
        keys: ['L'],
        icon: LuScrollText,
        title: 'Every instance, one log stream',
        body: 'Follow logs from all regions in one place, filter by level or request ID, and jump from an error straight to the commit that shipped it.',
        terminal: [
            { kind: 'cmd', text: 'shipyard logs api --follow --level=warn' },
            { kind: 'err', text: '14:02:11 ERROR payments timeout after 3000ms (eu-west-1)' },
            { kind: 'info', text: '14:02:12 WARN  payments retry 1/3 succeeded' },
            { kind: 'ok', text: 'Streaming from 12 instances in 3 regions' },
        ],
        facts: ['30-day retention', 'Search by request ID', 'Linked to commits'],
    },
    {
        id: 'metrics',
        group: 'Observe',
        label: 'Open performance metrics',
        keywords: 'latency p95 apm monitoring dashboard',
        keys: ['P', 'M'],
        icon: LuGauge,
        title: 'Latency and error budgets out of the box',
        body: 'Shipyard measures every route without an agent. Set an error budget and deploys pause automatically when a release starts burning it.',
        terminal: [
            { kind: 'cmd', text: 'shipyard metrics api --window=1h' },
            { kind: 'info', text: 'p50 42 ms · p95 118 ms · p99 240 ms' },
            { kind: 'info', text: '1.8M requests · 3 regions' },
            { kind: 'ok', text: 'Error rate 0.02% (budget 0.10%)' },
        ],
        facts: ['No agent to install', 'Per-route p95', 'Deploys pause on burn'],
    },
    {
        id: 'secrets',
        group: 'Configure',
        label: 'Add environment secret',
        keywords: 'env variable key config token',
        keys: ['S', 'E'],
        icon: LuKeyRound,
        title: 'Secrets that roll out without a restart',
        body: 'Add or rotate a secret once and Shipyard pushes it to every instance in the environment, encrypted end to end and recorded in the audit log.',
        terminal: [
            { kind: 'cmd', text: 'shipyard secrets set PAYMENTS_API_KEY --env=production' },
            { kind: 'info', text: 'Encrypted with AES-256-GCM · version 7' },
            { kind: 'info', text: 'Audit entry written for ada@northbeam.dev' },
            { kind: 'ok', text: 'Rolled to 12 instances, no restart needed' },
        ],
        facts: ['AES-256-GCM at rest', 'Versioned + audited', 'Zero-restart rotation'],
    },
    {
        id: 'invite',
        group: 'Configure',
        label: 'Invite teammate',
        keywords: 'team member user access role sso',
        keys: ['I'],
        icon: LuUserPlus,
        title: 'Roles that match how you ship',
        body: 'Give people exactly the access they need: viewer, deployer or admin, per project. SSO and SCIM keep the list in sync with your directory.',
        terminal: [
            { kind: 'cmd', text: 'shipyard team invite kai@northbeam.dev --role=deployer' },
            { kind: 'info', text: 'Project scope: api, web · SSO enforced' },
            { kind: 'ok', text: 'Invite sent · expires in 7 days' },
        ],
        facts: ['Per-project roles', 'SSO + SCIM', 'Unlimited viewers'],
    },
]

function matches(command, words) {
    const haystack = `${command.label} ${command.keywords} ${command.group}`.toLowerCase()
    return words.every((word) => haystack.includes(word))
}

function Highlight({ text, query }) {
    const needle = query.trim().toLowerCase().split(/\s+/)[0]
    const at = needle ? text.toLowerCase().indexOf(needle) : -1
    if (at < 0) return text
    return (
        <>
            {text.slice(0, at)}
            <span className="text-[#f97316]">{text.slice(at, at + needle.length)}</span>
            {text.slice(at + needle.length)}
        </>
    )
}

const lineStyles = {
    cmd: 'text-[#fafafa]',
    info: 'text-[#a3a3a3]',
    ok: 'text-[#4ade80]',
    err: 'text-[#f87171]',
}

const linePrefix = { cmd: '$', info: '▸', ok: '✓', err: '✗' }

export function CommandPaletteFeatureBreakdown({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [query, setQuery] = useState('')
    const [highlight, setHighlight] = useState(0)
    const [selectedId, setSelectedId] = useState(commands[0].id)
    const inputRef = useRef(null)
    const optionRefs = useRef({})
    const sectionRef = useRef(null)
    const inView = useInView(sectionRef, { amount: 0.3 })
    const baseId = useId()
    const listId = `${baseId}-list`

    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const filtered = commands.filter((command) => matches(command, words))
    const active = filtered[Math.min(highlight, filtered.length - 1)]
    const selected = commands.find((command) => command.id === selectedId)
    const SelectedIcon = selected.icon

    useEffect(() => {
        if (!inView) return undefined
        const onKey = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                inputRef.current?.focus()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [inView])

    const moveTo = (index) => {
        setHighlight(index)
        const target = filtered[index]
        if (target) optionRefs.current[target.id]?.scrollIntoView({ block: 'nearest' })
    }

    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown' && filtered.length) {
            event.preventDefault()
            moveTo((highlight + 1) % filtered.length)
        } else if (event.key === 'ArrowUp' && filtered.length) {
            event.preventDefault()
            moveTo((highlight - 1 + filtered.length) % filtered.length)
        } else if (event.key === 'Enter') {
            event.preventDefault()
            if (active) setSelectedId(active.id)
        } else if (event.key === 'Escape') {
            event.preventDefault()
            setQuery('')
            setHighlight(0)
        }
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative isolate overflow-hidden bg-[#000000] py-16 font-mono text-base font-normal text-[#a3a3a3] md:py-24', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="absolute left-[-10%] top-1/3 -z-10 h-[28rem] w-[28rem] rounded-full bg-[#f97316]/15 blur-[120px]"
            />

            <div ref={sectionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-xs text-[#f97316]">~/shipyard/features</p>
                        <h2 className="mt-4 font-mono text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-[#fafafa] sm:text-5xl lg:text-6xl">
                            Every feature is one keystroke away.
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed">
                        Try it: press{' '}
                        <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[#fafafa]">⌘K</kbd> or{' '}
                        <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[#fafafa]">Ctrl K</kbd>,
                        type “logs” or “roll”, then hit Enter.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
                    <div className="self-start overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_40px_80px_-40px_rgba(249,115,22,0.35)]">
                        <div className="flex items-center gap-3 border-b border-white/10 px-4">
                            <LuSearch className="h-4 w-4 shrink-0 text-[#737373]" aria-hidden="true" />
                            <label htmlFor={`${baseId}-input`} className="sr-only">
                                Search Shipyard commands
                            </label>
                            <input
                                ref={inputRef}
                                id={`${baseId}-input`}
                                type="text"
                                role="combobox"
                                autoComplete="off"
                                spellCheck={false}
                                aria-expanded="true"
                                aria-controls={listId}
                                aria-autocomplete="list"
                                aria-activedescendant={active ? `${baseId}-opt-${active.id}` : undefined}
                                placeholder="Type a command or search…"
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value)
                                    setHighlight(0)
                                }}
                                onKeyDown={onKeyDown}
                                className="min-h-14 min-w-0 flex-1 bg-transparent text-sm text-[#fafafa] caret-[#f97316] outline-none placeholder:text-[#525252]"
                            />
                            <button
                                type="button"
                                onClick={() => inputRef.current?.focus()}
                                aria-label="Focus command search"
                                className="shrink-0 rounded-md border border-white/15 px-2 py-1 text-[11px] text-[#a3a3a3] transition-colors hover:border-[#f97316]/60 hover:text-[#fafafa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                            >
                                ⌘K
                            </button>
                        </div>

                        <div id={listId} role="listbox" aria-label="Shipyard commands" className="max-h-[20rem] overflow-y-auto p-2">
                            {filtered.length === 0 && (
                                <div className="px-3 py-10 text-center text-sm">
                                    <p className="text-[#fafafa]">No commands match “{query.trim()}”.</p>
                                    <p className="mt-2 text-xs text-[#737373]">Try “deploy”, “logs” or “secret”.</p>
                                </div>
                            )}
                            {groups.map((group) => {
                                const items = filtered.filter((command) => command.group === group)
                                if (!items.length) return null
                                return (
                                    <div key={group} role="group" aria-labelledby={`${baseId}-group-${group}`} className="py-1">
                                        <p
                                            id={`${baseId}-group-${group}`}
                                            role="presentation"
                                            className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-[0.2em] text-[#525252]"
                                        >
                                            {group}
                                        </p>
                                        {items.map((command) => {
                                            const isActive = active?.id === command.id
                                            const isSelected = selectedId === command.id
                                            const Icon = command.icon
                                            return (
                                                <div
                                                    key={command.id}
                                                    ref={(node) => {
                                                        optionRefs.current[command.id] = node
                                                    }}
                                                    id={`${baseId}-opt-${command.id}`}
                                                    role="option"
                                                    aria-selected={isActive}
                                                    onMouseMove={() => {
                                                        const index = filtered.indexOf(command)
                                                        if (index !== highlight) setHighlight(index)
                                                    }}
                                                    onClick={() => {
                                                        setHighlight(filtered.indexOf(command))
                                                        setSelectedId(command.id)
                                                        inputRef.current?.focus()
                                                    }}
                                                    className={cn(
                                                        'relative flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm transition-colors',
                                                        isActive ? 'bg-white/[0.06] text-[#fafafa]' : 'text-[#a3a3a3]',
                                                    )}
                                                >
                                                    {isActive && (
                                                        <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#f97316]" aria-hidden="true" />
                                                    )}
                                                    <Icon
                                                        className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#f97316]' : 'text-[#737373]')}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="min-w-0 flex-1 truncate">
                                                        <Highlight text={command.label} query={query} />
                                                    </span>
                                                    {isSelected && (
                                                        <span className="shrink-0 rounded bg-[#f97316]/15 px-1.5 py-0.5 text-[10px] text-[#f97316]">
                                                            open
                                                        </span>
                                                    )}
                                                    <span className="hidden shrink-0 gap-1 sm:flex" aria-hidden="true">
                                                        {command.keys.map((key) => (
                                                            <kbd
                                                                key={key}
                                                                className="grid h-5 min-w-5 place-items-center rounded border border-white/10 bg-white/5 px-1 text-[10px] text-[#a3a3a3]"
                                                            >
                                                                {key}
                                                            </kbd>
                                                        ))}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 px-4 py-3 text-[11px] text-[#737373]">
                            <span>↑↓ navigate</span>
                            <span className="inline-flex items-center gap-1">
                                <LuCornerDownLeft className="h-3 w-3" aria-hidden="true" /> open
                            </span>
                            <span>esc clear</span>
                            <span className="ml-auto" aria-live="polite">
                                {filtered.length} {filtered.length === 1 ? 'command' : 'commands'}
                                {words.length ? ' found' : ''}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 sm:p-8">
                        <p className="sr-only" aria-live="polite">
                            {selected.label} opened
                        </p>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.article
                                key={selected.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <p className="flex items-center gap-2 text-xs text-[#f97316]">
                                    <SelectedIcon className="h-4 w-4" aria-hidden="true" />
                                    {selected.group} › {selected.label}
                                </p>
                                <h3 className="mt-4 font-mono text-2xl font-bold leading-tight tracking-[-0.03em] text-[#fafafa] sm:text-3xl">
                                    {selected.title}
                                </h3>
                                <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-[#a3a3a3]">{selected.body}</p>

                                <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#050505]" aria-hidden="true">
                                    <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                                        <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                                        <span className="h-2 w-2 rounded-full bg-white/15" />
                                        <span className="h-2 w-2 rounded-full bg-white/15" />
                                        <span className="ml-2 text-[10px] text-[#525252]">zsh · shipyard-cli 4.12.0</span>
                                    </div>
                                    <div className="space-y-1.5 p-4 text-[12px] leading-relaxed sm:text-[13px]">
                                        {selected.terminal.map((line, index) => (
                                            <motion.p
                                                key={line.text}
                                                initial={{ opacity: reduceMotion ? 1 : 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.2, delay: reduceMotion ? 0 : 0.2 + index * 0.18 }}
                                                className={cn('flex gap-2 break-all', lineStyles[line.kind])}
                                            >
                                                <span className={cn('shrink-0', line.kind === 'cmd' ? 'text-[#f97316]' : 'opacity-70')}>
                                                    {linePrefix[line.kind]}
                                                </span>
                                                <span className="min-w-0">{line.text}</span>
                                            </motion.p>
                                        ))}
                                        <p className="flex gap-2 text-[#f97316]">
                                            <span>$</span>
                                            <span className="h-4 w-2 translate-y-0.5 bg-[#f97316] motion-safe:animate-pulse" />
                                        </p>
                                    </div>
                                </div>

                                <ul className="mt-6 flex flex-wrap gap-2">
                                    {selected.facts.map((fact) => (
                                        <li
                                            key={fact}
                                            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#fafafa]"
                                        >
                                            {fact}
                                        </li>
                                    ))}
                                </ul>
                            </motion.article>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-16">
                    <p className="text-sm">
                        <span className="text-[#fafafa]">shipyard init</span> · free for hobby projects, $20 per seat for
                        teams.
                    </p>
                    <a
                        href="#shipyard-signup"
                        className="group inline-flex min-h-11 items-center gap-2 self-start rounded-lg bg-[#f97316] px-5 text-sm font-bold text-[#000000] transition-colors hover:bg-[#fb923c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] sm:self-auto"
                    >
                        Start deploying free
                        <HiArrowLongRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CommandPaletteFeatureBreakdown

// TroubleshootingDocsContent

// DocsContent05 · Knowledge Bases & Documentation › Main Content Area

// Description:
// An Orbit Wiki troubleshooting page, "Pages won’t sync? Start here." Symptom chips
// (All, Sync, Sign-in, Editor, Export) filter five problem accordions; each opens into
// Symptom → Cause → Fix, with numbered steps and, where needed, a copyable terminal
// command. Beside them sit a sync error log with an "Errors only" switch and a "Still
// broken?" support box. Use it for a troubleshooting article, error-code reference or
// known-issues page.

// Design:
// - Light gray #f4f4f5 page, zinc #18181b text, orange #ea580c accent; white cards with
//   1px #e4e4e7 borders and rounded-2xl; mono error codes in orange-tinted badges
// - Heading text-4xl → sm:5xl → lg:6xl with a highlighter swipe (#fed7aa) under "Start
//   here."; mono uppercase section labels; hazard stripes on the "Still broken?" box
// - Accordion panels lay out Symptom / Cause side by side from md and a full-width Fix
//   list with orange numbered markers; commands use a small dark code row with token
//   colours
// - Error log: #18181b terminal card, timestamp / level / scope / message columns, WARN
//   amber, ERROR red with a tinted row; lines never wrap, the log scrolls sideways
//   inside
// - Layout: one column below lg; on lg accordions (left) and a 380px sticky column with
//   the log and support box (right); chips scroll horizontally inside their row on
//   phones

// What it does:
// - topic filter (aria-pressed chips) narrows the accordions and shows a count; several
//   accordions can be open at once (aria-expanded, height animation, instant when
//   reduced)
// - "Errors only" (role="switch") hides INFO lines; the "Known issues in this log"
//   buttons reset the filter, open the matching accordion and scroll it into view
// - Copy buttons (commands, whole log) use the clipboard API with a textarea fallback
//   and show "Copied" for 1.8 s; ticket, community and status links are #hash anchors

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TroubleshootingDocsContent from '@/TestComponent/PageSections/knowledge/DocsContent05';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <TroubleshootingDocsContent />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiCheck,
    HiOutlineChatBubbleLeftRight,
    HiOutlineClipboardDocument,
    HiOutlineExclamationTriangle,
    HiOutlineSignal,
    HiOutlineTicket,
    HiPlus,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const TOPICS = [
    { id: 'all', label: 'All issues' },
    { id: 'sync', label: 'Sync' },
    { id: 'signin', label: 'Sign-in' },
    { id: 'editor', label: 'Editor' },
    { id: 'export', label: 'Export' },
]

const problems = [
    {
        id: 'pending-sync',
        topic: 'sync',
        code: 'ERR_SYNC_409',
        title: 'Changes stay in “Pending sync”',
        affects: 'Desktop 3.6+ · Web',
        symptom: 'The cloud icon keeps spinning and teammates never see your edits, even though you are online.',
        cause: 'Two devices edited the same block while offline. Orbit pauses syncing that page until you pick which version wins.',
        fix: [
            'Open Settings → Sync → Conflicts.',
            'For each block, keep one version or choose “Merge both”.',
            'Click Resume sync. Queued changes upload within a few seconds.',
        ],
    },
    {
        id: 'proxy-tls',
        topic: 'sync',
        code: 'ERR_NET_TLS',
        title: 'Sync fails behind a company proxy',
        affects: 'Desktop 3.x',
        symptom: 'Sync stops right after connecting and the log shows “unable to verify certificate chain”.',
        cause: 'Your network re-signs TLS traffic with a company certificate that Orbit does not trust yet.',
        fix: ['Ask IT for the root certificate as a .pem file.', 'Point Orbit at it with the command below.', 'Quit and reopen the desktop app.'],
        command: 'orbit config set network.caFile ~/certs/company-root.pem',
    },
    {
        id: 'login-loop',
        topic: 'signin',
        code: 'ERR_AUTH_STATE',
        title: 'Sign-in loops back to the login page',
        affects: 'Web · Safari, Firefox strict mode',
        symptom: 'You sign in successfully, the page reloads, and you are asked to sign in again.',
        cause: 'Cookies for auth.orbitwiki.app are blocked, so the session is never stored in the browser.',
        fix: [
            'Allow cookies for [*.]orbitwiki.app in your browser settings.',
            'Clear site data for orbitwiki.app, then sign in again.',
            'Still looping? Use “Email me a sign-in link” on the login page.',
        ],
    },
    {
        id: 'paste-tables',
        topic: 'editor',
        code: 'No error code',
        title: 'Pasted tables lose their formatting',
        affects: 'All platforms',
        symptom: 'Tables copied from a spreadsheet arrive as a single column of plain text.',
        cause: 'Spreadsheet apps put styled HTML on the clipboard, which Orbit strips for safety before pasting.',
        fix: ['Paste with ⌘ ⇧ V (Ctrl Shift V on Windows) to keep rows and columns.', 'For large sheets, use Insert → Table → Import CSV.'],
    },
    {
        id: 'pdf-timeout',
        topic: 'export',
        code: 'ERR_EXPORT_TIMEOUT',
        title: 'PDF export times out on large spaces',
        affects: 'Web · Desktop',
        symptom: 'The export progress bar stops at 90% and the download never starts.',
        cause: 'Spaces over 2,000 pages exceed the 120-second limit for a single PDF export.',
        fix: ['Export one section at a time from its … menu.', 'Or split the export into 500-page files with the CLI.'],
        command: 'orbit export --space eng-handbook --format pdf --split 500',
    },
]

const LOG = [
    { t: '14:02:11.482', level: 'INFO', scope: 'sync', msg: 'Connected to eu-west-2 (latency 48 ms)' },
    { t: '14:02:11.907', level: 'INFO', scope: 'sync', msg: 'Pulled 12 changes for space eng-handbook' },
    { t: '14:02:12.330', level: 'WARN', scope: 'sync', msg: 'Block b_7f31 edited on 2 devices while offline' },
    { t: '14:02:12.331', level: 'ERROR', scope: 'sync', msg: 'ERR_SYNC_409 conflict on page "Incident runbook"' },
    { t: '14:02:12.334', level: 'INFO', scope: 'sync', msg: 'Sync paused, 3 local changes queued' },
    { t: '14:02:40.018', level: 'WARN', scope: 'net', msg: 'Retrying in 30 s (attempt 2 of 5)' },
    { t: '14:03:10.102', level: 'ERROR', scope: 'net', msg: 'ERR_NET_TLS unable to verify certificate chain' },
]

const LEVEL_CLASS = {
    INFO: 'text-[#71717a]',
    WARN: 'text-[#fbbf24]',
    ERROR: 'text-[#f87171]',
}

const CMD_RE = /(--?[A-Za-z][\w-]*)|(\b\d+\b)|([^\s]+)|(\s+)/g

function tokenizeCommand(line) {
    return [...line.matchAll(CMD_RE)].map((m, i) => {
        const [text, flag, num, word] = m
        if (flag) return { className: 'text-[#fdba74]', text }
        if (num) return { className: 'text-[#fcd34d]', text }
        if (word && i === 0) return { className: 'text-[#fb923c] font-semibold', text }
        if (word && (word.includes('/') || word.includes('.'))) return { className: 'text-[#a7f3d0]', text }
        return { className: 'text-[#e4e4e7]', text }
    })
}

function legacyCopy(text) {
    try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.top = '0'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        return ok
    } catch {
        return false
    }
}

async function copyText(text) {
    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
            return true
        }
    } catch {
        // clipboard API unavailable here: use the fallback
    }
    return legacyCopy(text)
}

function useCopy() {
    const [status, setStatus] = useState({ state: 'idle', n: 0 })

    useEffect(() => {
        if (status.state === 'idle') return undefined
        const id = setTimeout(() => setStatus((s) => ({ ...s, state: 'idle' })), 1800)
        return () => clearTimeout(id)
    }, [status])

    const copy = async (text) => {
        const ok = await copyText(text)
        setStatus((s) => ({ state: ok ? 'copied' : 'failed', n: s.n + 1 }))
    }

    return [status.state, copy]
}

function CopyLabel({ state }) {
    return (
        <>
            {state === 'copied' ? (
                <HiCheck aria-hidden="true" className="size-4" />
            ) : (
                <HiOutlineClipboardDocument aria-hidden="true" className="size-4" />
            )}
            {state === 'copied' ? 'Copied' : state === 'failed' ? 'Press ⌘C' : 'Copy'}
        </>
    )
}

function Command({ text }) {
    const [state, copy] = useCopy()
    const tokens = useMemo(() => tokenizeCommand(text), [text])
    return (
        <div className="mt-4 flex items-stretch overflow-hidden rounded-xl bg-[#18181b]">
            <span aria-hidden="true" className="grid shrink-0 place-items-center pl-4 pr-2 font-mono text-[13px] text-[#52525b]">
                $
            </span>
            <pre
                aria-label="Terminal command"
                tabIndex={0}
                className="min-w-0 flex-1 overflow-x-auto py-3 pr-4 font-mono text-[13px] leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c]"
            >
                <code className="whitespace-pre">
                    {tokens.map((token, i) => (
                        <span key={i} className={token.className}>
                            {token.text}
                        </span>
                    ))}
                </code>
            </pre>
            <button
                type="button"
                aria-label={state === 'copied' ? 'Command copied' : 'Copy command'}
                className={cn(
                    'inline-flex min-h-11 shrink-0 items-center gap-1.5 border-l border-white/10 px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c]',
                    state === 'copied' ? 'bg-[#ea580c] text-white' : 'text-[#d4d4d8] hover:bg-white/5 hover:text-white',
                )}
                onClick={() => copy(text)}
            >
                <CopyLabel state={state} />
            </button>
            <span aria-live="polite" className="sr-only">
                {state === 'copied' ? 'Command copied to clipboard' : ''}
            </span>
        </div>
    )
}

export function TroubleshootingDocsContent({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [topic, setTopic] = useState('all')
    const [openIds, setOpenIds] = useState(['pending-sync'])
    const [errorsOnly, setErrorsOnly] = useState(false)
    const [logState, copyLog] = useCopy()
    const itemRefs = useRef({})
    const [pendingScroll, setPendingScroll] = useState(null)

    useEffect(() => {
        if (!pendingScroll) return undefined
        const id = setTimeout(() => {
            itemRefs.current[pendingScroll]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
            setPendingScroll(null)
        }, 60)
        return () => clearTimeout(id)
    }, [pendingScroll, reduceMotion])

    const shown = problems.filter((p) => topic === 'all' || p.topic === topic)
    const logLines = errorsOnly ? LOG.filter((l) => l.level !== 'INFO') : LOG
    const logText = logLines.map((l) => `${l.t}  ${l.level.padEnd(5)}  ${l.scope.padEnd(4)}  ${l.msg}`).join('\n')
    const knownIssues = problems.filter((p) => LOG.some((l) => l.msg.startsWith(p.code)))

    const toggle = (id) => setOpenIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

    const openIssue = (id) => {
        setTopic('all')
        setOpenIds((ids) => (ids.includes(id) ? ids : [...ids, id]))
        setPendingScroll(id)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-[#f4f4f5] px-4 py-16 text-base font-normal text-[#18181b] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:gap-12">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#71717a]">
                            <span className="text-[#ea580c]">●</span> Orbit Wiki / Help / Troubleshooting
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#18181b] sm:text-5xl lg:text-6xl">
                            Pages won’t sync?{' '}
                            <span className="bg-[linear-gradient(transparent_62%,#fed7aa_62%)] px-1">Start here.</span>
                        </h2>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#52525b]">
                            Find your symptom, read why it happens, then follow the fix. Most sync problems clear up in
                            under five minutes without contacting support.
                        </p>
                    </div>
                    <dl className="grid grid-cols-3 divide-x divide-[#e4e4e7] rounded-2xl border border-[#e4e4e7] bg-white text-center">
                        {[
                            ['Known issues', '5'],
                            ['Median fix', '4 min'],
                            ['Solved here', '87%'],
                        ].map(([term, value]) => (
                            <div key={term} className="px-2 py-4">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#71717a]">{term}</dt>
                                <dd className="mt-1 text-2xl font-semibold tracking-tight text-[#18181b]">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div
                                role="group"
                                aria-label="Filter by symptom"
                                className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
                            >
                                {TOPICS.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        aria-pressed={topic === t.id}
                                        className={cn(
                                            'min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]',
                                            topic === t.id
                                                ? 'border-[#18181b] bg-[#18181b] text-white'
                                                : 'border-[#d4d4d8] bg-white text-[#3f3f46] hover:border-[#ea580c] hover:text-[#c2410c]',
                                        )}
                                        onClick={() => setTopic(t.id)}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            <p aria-live="polite" className="font-mono text-xs text-[#71717a]">
                                {shown.length} of {problems.length} issues
                            </p>
                        </div>

                        <ul className="mt-6 space-y-3">
                            {shown.map((p) => {
                                const isOpen = openIds.includes(p.id)
                                const panelId = `${uid}-${p.id}`
                                return (
                                    <li
                                        key={p.id}
                                        ref={(el) => {
                                            itemRefs.current[p.id] = el
                                        }}
                                        className={cn(
                                            'scroll-mt-6 overflow-hidden rounded-2xl border bg-white transition-colors duration-300',
                                            isOpen ? 'border-[#fdba74]' : 'border-[#e4e4e7] hover:border-[#d4d4d8]',
                                        )}
                                    >
                                        <h3 className="text-base font-semibold text-[#18181b]">
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                                className="flex w-full items-start gap-4 px-4 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c] sm:px-5 sm:py-5"
                                                onClick={() => toggle(p.id)}
                                            >
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex flex-wrap items-center gap-2">
                                                        <span
                                                            className={cn(
                                                                'rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold',
                                                                p.code.startsWith('ERR')
                                                                    ? 'bg-[#fff7ed] text-[#c2410c] ring-1 ring-inset ring-[#fed7aa]'
                                                                    : 'bg-[#f4f4f5] text-[#71717a]',
                                                            )}
                                                        >
                                                            {p.code}
                                                        </span>
                                                        <span className="text-xs font-medium text-[#a1a1aa]">{p.affects}</span>
                                                    </span>
                                                    <span className="mt-2 block text-[17px] font-semibold leading-snug tracking-tight text-[#18181b] sm:text-lg">
                                                        {p.title}
                                                    </span>
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'mt-1 grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300',
                                                        isOpen
                                                            ? 'rotate-45 border-[#ea580c] bg-[#ea580c] text-white'
                                                            : 'border-[#e4e4e7] text-[#52525b]',
                                                    )}
                                                >
                                                    <HiPlus className="size-4" />
                                                </span>
                                            </button>
                                        </h3>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    id={panelId}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="border-t border-dashed border-[#e4e4e7] px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
                                                        <div className="grid gap-4 md:grid-cols-2">
                                                            <div className="rounded-xl bg-[#fafafa] p-4">
                                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71717a]">
                                                                    01 · Symptom
                                                                </p>
                                                                <p className="mt-2 text-[15px] leading-6 text-[#3f3f46]">{p.symptom}</p>
                                                            </div>
                                                            <div className="rounded-xl bg-[#fafafa] p-4">
                                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71717a]">
                                                                    02 · Cause
                                                                </p>
                                                                <p className="mt-2 text-[15px] leading-6 text-[#3f3f46]">{p.cause}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 rounded-xl border border-[#fed7aa] bg-[#fff7ed]/60 p-4">
                                                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
                                                                03 · Fix
                                                            </p>
                                                            <ol className="mt-3 space-y-2.5">
                                                                {p.fix.map((step, i) => (
                                                                    <li key={step} className="flex gap-3 text-[15px] leading-6 text-[#27272a]">
                                                                        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#ea580c] font-mono text-xs font-bold text-white">
                                                                            {i + 1}
                                                                        </span>
                                                                        {step}
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                            {p.command && <Command text={p.command} />}
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

                    <div className="min-w-0">
                        <div className="space-y-5 lg:sticky lg:top-6">
                            <div className="overflow-hidden rounded-2xl bg-[#18181b] text-[#e4e4e7] shadow-[0_24px_48px_-30px_rgba(24,24,27,0.8)]">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 py-2 pl-4 pr-2">
                                    <p className="flex items-center gap-2 font-mono text-xs text-[#a1a1aa]">
                                        <span aria-hidden="true" className="size-2 rounded-full bg-[#f87171]" />
                                        sync.log
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={errorsOnly}
                                            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-xs font-semibold text-[#d4d4d8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                            onClick={() => setErrorsOnly((v) => !v)}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'relative h-5 w-9 rounded-full transition-colors',
                                                    errorsOnly ? 'bg-[#ea580c]' : 'bg-[#3f3f46]',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform duration-300',
                                                        errorsOnly && 'translate-x-4',
                                                    )}
                                                />
                                            </span>
                                            Errors only
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={logState === 'copied' ? 'Log copied' : 'Copy log'}
                                            className={cn(
                                                'inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]',
                                                logState === 'copied'
                                                    ? 'bg-[#ea580c] text-white'
                                                    : 'text-[#d4d4d8] hover:bg-white/5 hover:text-white',
                                            )}
                                            onClick={() => copyLog(logText)}
                                        >
                                            <CopyLabel state={logState} />
                                        </button>
                                    </div>
                                </div>
                                <pre
                                    aria-label="Sync error log"
                                    tabIndex={0}
                                    className="overflow-x-auto py-3 font-mono text-[12px] leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c]"
                                >
                                    <code className="block w-max min-w-full">
                                        {logLines.map((line) => (
                                            <span
                                                key={line.t}
                                                className={cn(
                                                    'flex gap-3 whitespace-pre px-4',
                                                    line.level === 'ERROR' && 'bg-[#f87171]/10 shadow-[inset_2px_0_0_#f87171]',
                                                )}
                                            >
                                                <span className="text-[#52525b]">{line.t}</span>
                                                <span className={cn('w-10 font-semibold', LEVEL_CLASS[line.level])}>{line.level}</span>
                                                <span className="w-8 text-[#a78bfa]">{line.scope}</span>
                                                <span className={line.level === 'ERROR' ? 'text-[#fecaca]' : 'text-[#d4d4d8]'}>
                                                    {line.msg}
                                                </span>
                                            </span>
                                        ))}
                                    </code>
                                </pre>
                                <div className="border-t border-white/10 px-4 py-3">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#71717a]">
                                        Known issues in this log
                                    </p>
                                    <ul className="mt-2 space-y-1">
                                        {knownIssues.map((p) => (
                                            <li key={p.id}>
                                                <button
                                                    type="button"
                                                    className="group flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-2 text-left text-sm text-[#e4e4e7] transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                                    onClick={() => openIssue(p.id)}
                                                >
                                                    <span className="min-w-0 truncate">
                                                        <span className="font-mono text-xs text-[#fb923c]">{p.code}</span>{' '}
                                                        <span className="text-[#a1a1aa]">·</span> {p.title}
                                                    </span>
                                                    <HiArrowRight
                                                        aria-hidden="true"
                                                        className="size-4 shrink-0 text-[#71717a] transition-transform group-hover:translate-x-0.5 group-hover:text-[#fb923c]"
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <span aria-live="polite" className="sr-only">
                                    {logState === 'copied' ? 'Log copied to clipboard' : ''}
                                </span>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white">
                                <div
                                    aria-hidden="true"
                                    className="h-2.5 bg-[repeating-linear-gradient(135deg,#ea580c_0_10px,#18181b_10px_20px)]"
                                />
                                <div className="p-5 sm:p-6">
                                    <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ea580c]">
                                        <HiOutlineExclamationTriangle aria-hidden="true" className="size-4" />
                                        Still broken?
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#18181b]">
                                        Send us your log — a human replies in about 2 hours.
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-[#52525b]">
                                        Copy the log above and paste it into your ticket so we can skip the back-and-forth.
                                    </p>
                                    <a
                                        href="#orbit-open-ticket"
                                        className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-4 text-sm font-bold text-white transition-colors hover:bg-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                    >
                                        <HiOutlineTicket aria-hidden="true" className="size-5" />
                                        Open a support ticket
                                    </a>
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <a
                                            href="#orbit-community"
                                            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e4e4e7] px-3 text-sm font-semibold text-[#27272a] transition-colors hover:border-[#ea580c] hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                        >
                                            <HiOutlineChatBubbleLeftRight aria-hidden="true" className="size-4" />
                                            Community
                                        </a>
                                        <a
                                            href="#orbit-status"
                                            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e4e4e7] px-3 text-sm font-semibold text-[#27272a] transition-colors hover:border-[#ea580c] hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                        >
                                            <HiOutlineSignal aria-hidden="true" className="size-4" />
                                            Status
                                        </a>
                                    </div>
                                    <p className="mt-4 flex items-center gap-2 text-xs text-[#71717a]">
                                        <span aria-hidden="true" className="size-2 rounded-full bg-[#22c55e]" />
                                        All systems operational · checked 14:05 UTC
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TroubleshootingDocsContent

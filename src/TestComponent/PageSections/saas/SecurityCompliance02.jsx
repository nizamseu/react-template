// StatusConsoleSecurityCompliance

// SecurityCompliance02 · SaaS Platforms › Security & Compliance

// Description:
// A terminal-style security posture board for the fictional cloud guardrails platform
// Guardrail. Beside the heading "Security posture, streamed live." a console window lists
// seven checks with pulsing status dots (platform uptime 99.998%, last pen-test, key
// rotation, staff MFA, patch SLA, open CVEs, restore drill) and an audit log that prints a
// new line every couple of seconds. Use it on a trust, security or enterprise page for a
// technical audience that wants evidence rather than badges.

// Design:
// - Terminal dark #0c0f0a background with a faint scanline overlay; phosphor green #4ade80
//   for passing checks and log text, amber #fbbf24 for items that need attention
// - Everything is font-mono: heading text-4xl → lg:text-5xl, 11px uppercase eyebrows,
//   tabular numbers; the console is rounded-2xl with a 1px green/15 border and inner glow
// - Console layout: title bar (pane tabs + pause button), status pane and log pane side by
//   side on lg (stacked below), and a tmux-like status bar at the bottom
// - Status dots use a ping halo (motion-safe only); new log lines slide in from the left
//   with framer-motion and a blinking block cursor sits under the newest line
// - Responsive: copy column stacks above the console below lg; status rows keep label and
//   value on one line and wrap the metadata; log lines wrap instead of scrolling sideways

// What it does:
// - seq (number of printed log lines) starts at a fixed 5 for the server render; a 1.8 s
//   interval in useEffect adds a line (cycling through 10 messages) and is cleared on
//   unmount or while paused; only the last 7 lines are shown
// - "Pause stream" / "Resume stream" toggles the interval (aria-pressed); with reduced
//   motion the stream starts paused and lines appear without sliding
// - The passing/attention summary is derived from the checks data; "Open the status page"
//   links to #guardrail-status and "Subscribe to advisories" to #guardrail-advisories

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StatusConsoleSecurityCompliance from '@/TestComponent/PageSections/saas/SecurityCompliance02';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <StatusConsoleSecurityCompliance />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiPause, HiPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const INITIAL_SEQ = 5
const VISIBLE_LINES = 7
const BASE_SECONDS = 14 * 3600 + 2 * 60 + 7

const checks = [
    { id: 'uptime', label: 'Platform uptime', value: '99.998%', meta: '90-day rolling · 52 s total downtime', tone: 'ok' },
    { id: 'pentest', label: 'Last pen-test', value: '21 Aug 2026', meta: 'Northbeam Offensive · 0 critical, 2 low (fixed)', tone: 'ok' },
    { id: 'rotation', label: 'Key rotation', value: 'due in 4 d', meta: 'KMS master keys · 30-day cycle · auto', tone: 'warn' },
    { id: 'mfa', label: 'Staff MFA', value: '412 / 412', meta: 'Hardware security keys enforced', tone: 'ok' },
    { id: 'patch', label: 'Critical patch SLA', value: '< 24 h', meta: 'Median 6 h 12 m this quarter', tone: 'ok' },
    { id: 'cves', label: 'Open CVEs', value: '1 medium', meta: 'SEC-2291 · fix ships 30 Sep', tone: 'warn' },
    { id: 'restore', label: 'Restore drill', value: 'passed', meta: '12 Sep 2026 · RTO 38 min · RPO 5 min', tone: 'ok' },
]

const feed = [
    { level: 'INFO', src: 'waf', msg: 'blocked 312 req from 203.0.113.42 · rule sqli-942100' },
    { level: 'PASS', src: 'kms', msg: 'rotated data key tenant=t_8841 · aes-256-gcm' },
    { level: 'INFO', src: 'auth', msg: 'sso assertion ok · idp=hexa-corp · mfa=webauthn' },
    { level: 'PASS', src: 'scan', msg: 'image api:4.18.2 · 0 critical · 0 high' },
    { level: 'WARN', src: 'tls', msg: 'cert api.guardrail.dev expires in 21 d · renewal queued' },
    { level: 'PASS', src: 'backup', msg: 'snapshot eu-central-1 verified · sha256 match' },
    { level: 'INFO', src: 'audit', msg: 'role admin → viewer for j.mendes · CHG-1180' },
    { level: 'INFO', src: 'ids', msg: 'anomaly score 0.12 · threshold 0.70 · no action' },
    { level: 'WARN', src: 'deps', msg: '1 medium CVE open · SEC-2291 · owner @platform' },
    { level: 'PASS', src: 'probe', msg: '23/23 regions healthy · p95 182 ms' },
]

const pad = (n) => String(n).padStart(2, '0')

function stamp(seq) {
    const t = BASE_SECONDS + seq * 3
    return `${pad(Math.floor(t / 3600) % 24)}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`
}

const levelTone = {
    INFO: 'text-[#4ade80]/60',
    PASS: 'text-[#4ade80]',
    WARN: 'text-[#fbbf24]',
}

function StatusDot({ tone }) {
    const color = tone === 'warn' ? 'bg-[#fbbf24]' : 'bg-[#4ade80]'
    return (
        <span className="relative mt-1.5 flex size-2.5 shrink-0" aria-hidden="true">
            <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping', color)} />
            <span className={cn('relative inline-flex size-2.5 rounded-full', color)} />
        </span>
    )
}

export function StatusConsoleSecurityCompliance({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [seq, setSeq] = useState(INITIAL_SEQ)
    const [paused, setPaused] = useState(null)
    const isPaused = paused ?? Boolean(reduceMotion)

    useEffect(() => {
        if (isPaused) return undefined
        const id = setInterval(() => setSeq((s) => s + 1), 1800)
        return () => clearInterval(id)
    }, [isPaused])

    const passing = checks.filter((c) => c.tone === 'ok').length
    const attention = checks.length - passing
    const lines = []
    for (let n = Math.max(0, seq - VISIBLE_LINES); n < seq; n++) {
        lines.push({ n, time: stamp(n), ...feed[n % feed.length] })
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0c0f0a] px-4 py-16 font-mono text-base font-normal text-[#c8f5d4] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(to_bottom,rgba(74,222,128,0.035)_0px,rgba(74,222,128,0.035)_1px,transparent_1px,transparent_4px)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-10 -z-10 size-[520px] rounded-full bg-[#4ade80]/10 blur-3xl"
            />

            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:items-center lg:gap-14">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#4ade80]">guardrail://trust</p>
                    <h2 className="mt-5 font-mono text-4xl font-bold leading-[1.05] tracking-tight text-[#ecfdf3] lg:text-5xl">
                        Security posture, streamed <span className="text-[#4ade80]">live.</span>
                    </h2>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-[#c8f5d4]/70">
                        No quarterly PDF, no marketing gloss. These are the same checks our on-call
                        engineers watch, piped straight from Guardrail’s control plane.
                    </p>

                    <dl className="mt-8 grid max-w-sm grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#4ade80]/15 bg-[#4ade80]/15">
                        <div className="flex flex-col bg-[#0c0f0a] p-4">
                            <dt className="order-2 mt-1 text-[11px] uppercase tracking-widest text-[#c8f5d4]/60">passing</dt>
                            <dd className="order-1 text-3xl font-bold tabular-nums text-[#4ade80]">{passing}</dd>
                        </div>
                        <div className="flex flex-col bg-[#0c0f0a] p-4">
                            <dt className="order-2 mt-1 text-[11px] uppercase tracking-widest text-[#c8f5d4]/60">need attention</dt>
                            <dd className="order-1 text-3xl font-bold tabular-nums text-[#fbbf24]">{attention}</dd>
                        </div>
                    </dl>

                    <div className="mt-8 flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
                        <a
                            href="#guardrail-status"
                            className="group inline-flex min-h-10 items-center gap-2 font-bold text-[#4ade80] hover:text-[#86efac] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]"
                        >
                            <span aria-hidden="true">$</span> Open the status page
                            <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                        </a>
                        <a
                            href="#guardrail-advisories"
                            className="inline-flex min-h-10 items-center gap-2 text-[#c8f5d4]/80 underline decoration-[#4ade80]/40 underline-offset-4 hover:text-[#ecfdf3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]"
                        >
                            Subscribe to advisories
                        </a>
                    </div>
                </div>

                <div className="min-w-0 overflow-hidden rounded-2xl border border-[#4ade80]/15 bg-[#080a07] shadow-[0_0_0_1px_rgba(74,222,128,0.04),0_30px_80px_-30px_rgba(74,222,128,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="flex items-center justify-between gap-3 border-b border-[#4ade80]/15 px-3 py-2 sm:px-4">
                        <div className="flex min-w-0 items-center gap-1 text-[11px]">
                            <span className="rounded-md bg-[#4ade80]/15 px-2 py-1 text-[#4ade80]">0:status</span>
                            <span className="hidden px-2 py-1 text-[#c8f5d4]/50 sm:inline">1:audit.log</span>
                        </div>
                        <button
                            type="button"
                            aria-pressed={isPaused}
                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#4ade80]/25 px-3 text-xs text-[#c8f5d4] transition-colors hover:border-[#4ade80] hover:text-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]"
                            onClick={() => setPaused(!isPaused)}
                        >
                            {isPaused ? <HiPlay className="size-3.5" aria-hidden="true" /> : <HiPause className="size-3.5" aria-hidden="true" />}
                            {isPaused ? 'Resume stream' : 'Pause stream'}
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                        <div className="border-b border-[#4ade80]/15 p-4 sm:p-5 lg:border-b-0 lg:border-r">
                            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c8f5d4]/60">
                                ▸ checks ({checks.length})
                            </h3>
                            <ul className="mt-3 divide-y divide-[#4ade80]/10">
                                {checks.map((check) => (
                                    <li key={check.id} className="flex gap-3 py-2.5">
                                        <StatusDot tone={check.tone} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-baseline justify-between gap-3 text-[13px]">
                                                <span className="truncate text-[#ecfdf3]">{check.label}</span>
                                                <span
                                                    className={cn(
                                                        'shrink-0 font-bold tabular-nums',
                                                        check.tone === 'warn' ? 'text-[#fbbf24]' : 'text-[#4ade80]',
                                                    )}
                                                >
                                                    {check.value}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-[11px] leading-snug text-[#c8f5d4]/50">
                                                <span className="sr-only">{check.tone === 'warn' ? 'Needs attention. ' : 'Passing. '}</span>
                                                {check.meta}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex min-w-0 flex-col p-4 sm:p-5">
                            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c8f5d4]/60">
                                ▸ tail -f audit.log
                            </h3>
                            <ol role="log" aria-live="off" aria-label="Security audit log" className="mt-3 flex min-h-[18rem] flex-col justify-end gap-2 text-[11.5px] leading-snug sm:text-xs">
                                <AnimatePresence initial={false}>
                                    {lines.map((line) => (
                                        <motion.li
                                            key={line.n}
                                            layout={!reduceMotion}
                                            initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.35, ease: 'easeOut' }}
                                            className="flex gap-2"
                                        >
                                            <span className="shrink-0 tabular-nums text-[#c8f5d4]/40">{line.time}</span>
                                            <span className="min-w-0 break-words">
                                                <span className={cn('font-bold', levelTone[line.level])}>{line.level}</span>{' '}
                                                <span className="text-[#c8f5d4]/60">[{line.src}]</span>{' '}
                                                <span className={line.level === 'WARN' ? 'text-[#fde68a]' : 'text-[#c8f5d4]'}>
                                                    {line.msg}
                                                </span>
                                            </span>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ol>
                            <span
                                aria-hidden="true"
                                className="mt-2 block h-4 w-2 bg-[#4ade80] motion-safe:animate-pulse"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-[#4ade80] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0c0f0a] sm:px-4 sm:text-[11px]">
                        <span>[guardrail]</span>
                        <span>eu-central-1</span>
                        <span>{checks.length} checks</span>
                        <span>stream: {isPaused ? 'paused' : 'live'}</span>
                        <span className="ml-auto tabular-nums">lines {seq}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StatusConsoleSecurityCompliance

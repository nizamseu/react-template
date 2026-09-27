// BrowserFrameProjectsGrid

// ProjectsGrid03 · Portfolios & Personal Websites › Featured Projects Grid

// Description:
// Backend engineer Nadia Karim's projects shown as live-looking browser windows. Each of
// the four cards (ledgerd docs, quietq status page, tracewell dashboard, pgshard landing)
// has traffic-light dots, a URL bar and a long page built in markup that scrolls itself on
// hover, focus or the play button. Below each window: name, year, one-liner, stack, a
// production metric and "Visit ↗" / "Source ↗" links. Use it as an engineer's work grid.

// Design:
// - #0c0c0c section, green #7ee787 accent, #30363d hairlines, #8b949e muted text; mono
//   headings and labels; browser chrome #161b22 with #ff5f57 / #febc2e / #28c840 dots
// - Grid 1 → md:2 columns; window viewport h-60 → sm:h-72 with a green scroll thumb that
//   tracks the page position; windows rounded-xl with a soft green hover glow
// - Mini pages are real markup (docs, status bars, charts, trace waterfall, install box),
//   two dark and two light so the grid has contrast
// - Scroll-on-hover: translateY to the page bottom over 4.5 s ease-in-out, back in 0.7 s;
//   reduced motion drops the animation and makes the viewport natively scrollable

// What it does:
// - Each card tracks hovered (mouse enter/leave or focus within) and playing (the play /
//   pause button, aria-pressed, for touch and keyboard); either one scrolls the page
// - Mini pages are decorative: the viewport is role="img" with a descriptive label
// - "Visit ↗" links to #visit-<id>, "Source ↗" to #source-<id>, "$ ls ~/repositories
//   --all" to #repositories

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BrowserFrameProjectsGrid from '@/TestComponent/PageSections/portfolio/ProjectsGrid03';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <BrowserFrameProjectsGrid />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight, HiChevronLeft, HiChevronRight, HiLockClosed, HiPause, HiPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

function LedgerdDocs() {
    const endpoints = [
        ['POST', '/v1/transfers', 'Move money between two accounts'],
        ['GET', '/v1/accounts/:id/balance', 'Balance at any point in time'],
        ['GET', '/v1/entries?since=', 'Stream journal entries'],
        ['POST', '/v1/holds', 'Reserve funds before capture'],
    ]
    return (
        <div className="bg-[#0d1117] font-sans text-[#c9d1d9]">
            <div className="flex items-center justify-between border-b border-[#30363d] px-5 py-3 text-[10px]">
                <span className="font-mono text-xs font-bold text-[#7ee787]">▣ ledgerd</span>
                <span className="flex gap-4 text-[#8b949e]">
                    <span className="text-[#f0f6fc]">Docs</span>
                    <span>API</span>
                    <span>Changelog</span>
                </span>
                <span className="rounded border border-[#30363d] px-2 py-0.5 text-[#8b949e]">⌘K</span>
            </div>
            <div className="px-5 pb-6 pt-8">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7ee787]">v2.4 · quickstart</p>
                <p className="mt-2 text-[22px] font-bold leading-tight text-[#f0f6fc]">Double-entry, exactly once.</p>
                <p className="mt-2 text-[11px] leading-relaxed text-[#8b949e]">
                    A ledger service for money that must never be counted twice.
                </p>
                <div className="mt-4 flex gap-2 text-[10px] font-semibold">
                    <span className="rounded bg-[#7ee787] px-3 py-1.5 text-[#0c0c0c]">Quickstart →</span>
                    <span className="rounded border border-[#30363d] px-3 py-1.5">★ 4.2k</span>
                </div>
            </div>
            <div className="mx-5 rounded-md border border-[#30363d] bg-[#010409] p-3 font-mono text-[10px] leading-5">
                <p>
                    <span className="text-[#8b949e]">$</span> curl -X POST{' '}
                    <span className="text-[#79c0ff]">api.ledgerd.dev/v1/transfers</span> \
                </p>
                <p className="pl-3">
                    -H <span className="text-[#a5d6ff]">&quot;Idempotency-Key: 7f3a…&quot;</span> \
                </p>
                <p className="pl-3">
                    -d <span className="text-[#a5d6ff]">&apos;&#123;&quot;amount&quot;: 12500, &quot;currency&quot;: &quot;EUR&quot;&#125;&apos;</span>
                </p>
                <p className="mt-2 text-[#7ee787]">201 Created · 11 ms</p>
            </div>
            <div className="grid grid-cols-3 gap-2 px-5 py-6 text-[10px]">
                {['Idempotency keys', 'Point-in-time balances', 'Postgres-native'].map((f) => (
                    <div key={f} className="rounded-md border border-[#30363d] p-2.5">
                        <span className="block size-4 rounded bg-[#7ee787]/20" />
                        <p className="mt-2 font-semibold leading-tight text-[#f0f6fc]">{f}</p>
                        <p className="mt-1 leading-snug text-[#8b949e]">No duplicate postings, ever.</p>
                    </div>
                ))}
            </div>
            <div className="px-5">
                <p className="text-xs font-bold text-[#f0f6fc]">Endpoints</p>
                <div className="mt-2 divide-y divide-[#30363d] rounded-md border border-[#30363d] text-[10px]">
                    {endpoints.map(([method, path, note]) => (
                        <div key={path} className="flex items-center gap-2 px-3 py-2">
                            <span className={cn('w-9 font-mono font-bold', method === 'POST' ? 'text-[#ffa657]' : 'text-[#7ee787]')}>
                                {method}
                            </span>
                            <span className="font-mono text-[#f0f6fc]">{path}</span>
                            <span className="ml-auto hidden text-[#8b949e] sm:inline">{note}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-5 py-6">
                <p className="text-xs font-bold text-[#f0f6fc]">Benchmarks · 12k rps</p>
                {[
                    ['p50', 34, '9 ms'],
                    ['p95', 62, '21 ms'],
                    ['p99', 88, '38 ms'],
                ].map(([label, width, value]) => (
                    <div key={label} className="mt-2 flex items-center gap-2 font-mono text-[10px]">
                        <span className="w-7 text-[#8b949e]">{label}</span>
                        <span className="h-2 rounded-full bg-[#7ee787]" style={{ width: `${width}%` }} />
                        <span>{value}</span>
                    </div>
                ))}
            </div>
            <div className="border-t border-[#30363d] px-5 py-4 text-[10px] text-[#8b949e]">
                MIT licensed · Made in Lisbon · Edit this page on GitHub
            </div>
        </div>
    )
}

function QuietqStatus() {
    const components = [
        ['API', '99.99%', [11, 30]],
        ['Workers', '99.97%', [7, 22, 38]],
        ['Dashboard', '100%', []],
        ['Webhooks', '99.95%', [18, 19, 41]],
        ['Scheduler', '99.99%', [33]],
    ]
    return (
        <div className="bg-white font-sans text-[#1f2328]">
            <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-black tracking-tight">
                    quietq<span className="text-[#1a7f37]">.</span> status
                </span>
                <span className="rounded-md bg-[#1f2328] px-2.5 py-1 text-[10px] font-semibold text-white">Subscribe</span>
            </div>
            <div className="mx-5 flex items-center gap-2 rounded-lg bg-[#1a7f37] px-4 py-3 text-xs font-bold text-white">
                <span className="grid size-4 place-items-center rounded-full bg-white text-[9px] text-[#1a7f37]">✓</span>
                All systems operational
            </div>
            <p className="px-5 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#656d76]">
                Uptime · last 45 days
            </p>
            <div className="mx-5 divide-y divide-[#d0d7de] rounded-lg border border-[#d0d7de]">
                {components.map(([name, uptime, bad]) => (
                    <div key={name} className="px-3 py-2.5">
                        <div className="flex justify-between text-[11px]">
                            <span className="font-semibold">{name}</span>
                            <span className="text-[#656d76]">{uptime}</span>
                        </div>
                        <div className="mt-1.5 flex h-5 gap-[2px]">
                            {Array.from({ length: 45 }, (_, i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        'flex-1 rounded-[1px]',
                                        bad.includes(i) ? (i % 2 ? 'bg-[#d4a72c]' : 'bg-[#cf222e]') : 'bg-[#2da44e]',
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <p className="px-5 pb-2 pt-6 text-sm font-bold">Past incidents</p>
            <div className="space-y-3 px-5 pb-6 text-[11px]">
                {[
                    ['Sep 14', 'Elevated webhook latency', 'Resolved in 18 min — a noisy tenant hit a hot partition.'],
                    ['Aug 30', 'Delayed job retries in eu-west-1', 'Resolved in 42 min — retry queue rebalanced.'],
                    ['Aug 02', 'Scheduled maintenance', 'Postgres 16 upgrade, zero downtime.'],
                ].map(([date, title, body]) => (
                    <div key={date} className="border-l-2 border-[#d0d7de] pl-3">
                        <p className="text-[10px] text-[#656d76]">{date}</p>
                        <p className="font-semibold">{title}</p>
                        <p className="text-[#656d76]">{body}</p>
                    </div>
                ))}
            </div>
            <div className="border-t border-[#d0d7de] px-5 py-4 text-[10px] text-[#656d76]">Powered by status-kit</div>
        </div>
    )
}

function TracewellDash() {
    const spans = [
        ['POST /checkout', 0, 100, '#7ee787'],
        ['auth.verify', 2, 11, '#79c0ff'],
        ['cart.load', 12, 24, '#d2a8ff'],
        ['pg.query', 16, 16, '#ffa657'],
        ['ledgerd.transfer', 38, 37, '#7ee787'],
        ['kafka.publish', 78, 9, '#79c0ff'],
    ]
    return (
        <div className="bg-[#0d1117] font-sans text-[#c9d1d9]">
            <div className="flex items-center justify-between border-b border-[#30363d] px-5 py-3 text-[10px]">
                <span className="font-mono">
                    <span className="text-[#d2a8ff]">tracewell</span> / checkout-api
                </span>
                <span className="rounded border border-[#30363d] px-2 py-0.5 text-[#8b949e]">Last 1h ▾</span>
            </div>
            <div className="grid grid-cols-4 gap-2 p-5">
                {[
                    ['Requests', '12.4k/s'],
                    ['Errors', '0.02%'],
                    ['p50', '12 ms'],
                    ['p99', '38 ms'],
                ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-[#30363d] p-2">
                        <p className="text-[9px] text-[#8b949e]">{k}</p>
                        <p className="mt-1 font-mono text-xs font-bold text-[#f0f6fc]">{v}</p>
                    </div>
                ))}
            </div>
            <div className="mx-5 rounded-md border border-[#30363d] p-3">
                <p className="text-[10px] font-semibold text-[#f0f6fc]">Latency · p50 / p99</p>
                <svg viewBox="0 0 300 90" className="mt-2 h-24 w-full" preserveAspectRatio="none">
                    <path
                        d="M0 70 L20 66 L40 68 L60 60 L80 64 L100 58 L120 62 L140 55 L160 60 L180 52 L200 57 L220 50 L240 54 L260 49 L280 53 L300 48 L300 90 L0 90 Z"
                        fill="rgba(126,231,135,0.18)"
                    />
                    <path
                        d="M0 70 L20 66 L40 68 L60 60 L80 64 L100 58 L120 62 L140 55 L160 60 L180 52 L200 57 L220 50 L240 54 L260 49 L280 53 L300 48"
                        fill="none"
                        stroke="#7ee787"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M0 34 L20 30 L40 36 L60 22 L80 28 L100 18 L120 26 L140 14 L160 24 L180 20 L200 28 L220 16 L240 22 L260 12 L280 20 L300 17"
                        fill="none"
                        stroke="#d2a8ff"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                    />
                </svg>
            </div>
            <div className="px-5 py-5">
                <p className="text-[10px] font-semibold text-[#f0f6fc]">Trace 9c1e…f02 · 38 ms</p>
                <div className="mt-2 space-y-1.5">
                    {spans.map(([name, start, width, color]) => (
                        <div key={name} className="grid grid-cols-[6.5rem_1fr] items-center gap-2 font-mono text-[9px]">
                            <span className="truncate text-[#8b949e]">{name}</span>
                            <span className="relative h-3 rounded-sm bg-[#161b22]">
                                <span
                                    className="absolute inset-y-0 rounded-sm"
                                    style={{ left: `${start}%`, width: `${width}%`, backgroundColor: color }}
                                />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mx-5 mb-5 rounded-md border border-[#30363d] bg-[#010409] p-3 font-mono text-[9px] leading-4">
                {[
                    ['INFO', 'transfer committed id=tr_81f2 amount=125.00'],
                    ['INFO', 'kafka ack partition=7 offset=5512093'],
                    ['WARN', 'retry 1/3 upstream=fx-rates 502'],
                    ['INFO', 'retry ok upstream=fx-rates 31ms'],
                    ['INFO', 'checkout completed user=u_4410'],
                ].map(([level, msg], i) => (
                    <p key={i} className="truncate">
                        <span className={level === 'WARN' ? 'text-[#d29922]' : 'text-[#7ee787]'}>{level}</span>{' '}
                        <span className="text-[#8b949e]">{msg}</span>
                    </p>
                ))}
            </div>
            <div className="border-t border-[#30363d] px-5 py-4 text-[10px] text-[#8b949e]">
                OpenTelemetry native · 14 services instrumented
            </div>
        </div>
    )
}

function PgshardLanding() {
    return (
        <div className="bg-[#f6f8f2] font-sans text-[#14210f]">
            <div className="flex items-center justify-between px-5 py-4 text-[10px]">
                <span className="font-mono text-xs font-bold">pgshard</span>
                <span className="flex gap-4 text-[#14210f]/60">
                    <span>Docs</span>
                    <span>Pricing</span>
                    <span>GitHub</span>
                </span>
            </div>
            <div className="px-5 pb-6 pt-6 text-center">
                <p className="mx-auto w-fit rounded-full bg-[#1a7f37]/10 px-2.5 py-1 text-[9px] font-semibold text-[#1a7f37]">
                    v1.0 is here
                </p>
                <p className="mt-3 text-2xl font-black leading-tight tracking-tight">Shard Postgres without a rewrite.</p>
                <p className="mx-auto mt-2 max-w-[16rem] text-[11px] leading-relaxed text-[#14210f]/60">
                    Plan, migrate and rebalance shards online, from one CLI.
                </p>
                <p className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-md bg-[#14210f] px-3 py-2 font-mono text-[10px] text-[#7ee787]">
                    $ brew install pgshard <span className="text-white/40">⧉</span>
                </p>
            </div>
            <div className="mx-5 rounded-lg bg-[#14210f] p-3 font-mono text-[9px] leading-4 text-[#c9d1d9]">
                <p className="text-[#7ee787]">$ pgshard plan --tables orders,payments --shards 8</p>
                <p>→ analysing 412M rows on primary…</p>
                <p>→ shard key: customer_id (skew 1.04)</p>
                <p>→ est. migration: 3h 12m, online</p>
                <p className="text-[#7ee787]">✓ plan saved to plan.toml</p>
            </div>
            <div className="px-5 py-6">
                <div className="mx-auto w-20 rounded-md border-2 border-[#14210f] py-1.5 text-center font-mono text-[9px] font-bold">
                    primary
                </div>
                <div className="mx-auto h-4 w-px bg-[#14210f]/40" />
                <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 8 }, (_, i) => (
                        <span key={i} className="rounded bg-[#1a7f37] py-1.5 text-center font-mono text-[8px] font-bold text-white">
                            s{i + 1}
                        </span>
                    ))}
                </div>
            </div>
            <p className="px-5 text-center text-[9px] uppercase tracking-[0.2em] text-[#14210f]/50">Used in production by</p>
            <div className="flex justify-center gap-5 px-5 pb-6 pt-2 text-[11px] font-black text-[#14210f]/70">
                <span>Tallyrail</span>
                <span className="font-serif italic">Fernpay</span>
                <span className="tracking-widest">NORTHWIND</span>
            </div>
            <div className="mx-5 mb-6 rounded-lg border border-[#14210f]/10 bg-white p-4">
                <p className="font-serif text-xs italic leading-relaxed">
                    “We split a 3 TB orders table on a Tuesday afternoon. Nobody noticed. That was the goal.”
                </p>
                <p className="mt-2 text-[9px] font-semibold text-[#14210f]/60">— Head of Platform, Tallyrail</p>
            </div>
            <div className="border-t border-[#14210f]/10 px-5 py-4 text-[10px] text-[#14210f]/50">Apache-2.0 · pgshard.sh</div>
        </div>
    )
}

const projects = [
    {
        id: 'ledgerd',
        name: 'ledgerd',
        year: '2026',
        url: 'ledgerd.dev/docs/quickstart',
        summary: 'Double-entry ledger service with idempotent transfers and point-in-time balances.',
        stack: ['Go', 'Postgres', 'Kafka'],
        metric: 'p99 38 ms at 12k rps',
        Page: LedgerdDocs,
        label: 'Screenshot of the ledgerd documentation site with a curl example, endpoints table and benchmarks',
    },
    {
        id: 'quietq',
        name: 'quietq',
        year: '2025',
        url: 'status.quietq.io',
        summary: 'Multi-tenant job queue; this is the public status page it ships with.',
        stack: ['Rust', 'Redis', 'NATS'],
        metric: '99.99% API uptime, 45 days',
        Page: QuietqStatus,
        label: 'Screenshot of the quietq status page showing all systems operational and uptime bars',
    },
    {
        id: 'tracewell',
        name: 'tracewell',
        year: '2025',
        url: 'app.tracewell.io/services/checkout-api',
        summary: 'Lightweight tracing UI on top of OpenTelemetry for teams without a Datadog budget.',
        stack: ['Go', 'ClickHouse', 'OTel'],
        metric: '1.2B spans/day on one node',
        Page: TracewellDash,
        label: 'Screenshot of the tracewell dashboard with latency chart, trace waterfall and logs',
    },
    {
        id: 'pgshard',
        name: 'pgshard-cli',
        year: '2024',
        url: 'pgshard.sh',
        summary: 'CLI that plans and runs online Postgres sharding migrations.',
        stack: ['Rust', 'Postgres', 'Nix'],
        metric: '3 TB table split with zero downtime',
        Page: PgshardLanding,
        label: 'Screenshot of the pgshard landing page with install command, CLI output and shard diagram',
    },
]

function BrowserCard({ project, index, reduceMotion }) {
    const [hovered, setHovered] = useState(false)
    const [playing, setPlaying] = useState(false)
    const scrolled = !reduceMotion && (hovered || playing)
    const { Page } = project

    return (
        <motion.li
            className="min-w-0"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
            <article
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setHovered(true)}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false)
                }}
            >
                <div
                    className={cn(
                        'overflow-hidden rounded-xl border bg-[#161b22] transition-[border-color,box-shadow] duration-500',
                        scrolled
                            ? 'border-[#7ee787]/50 shadow-[0_30px_80px_-40px_rgba(126,231,135,0.55)]'
                            : 'border-[#30363d] shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)]',
                    )}
                >
                    <div className="flex h-12 items-center gap-2 border-b border-[#30363d] pl-3 pr-1 sm:gap-3">
                        <span className="flex shrink-0 gap-1.5" aria-hidden="true">
                            <span className="size-3 rounded-full bg-[#ff5f57]" />
                            <span className="size-3 rounded-full bg-[#febc2e]" />
                            <span className="size-3 rounded-full bg-[#28c840]" />
                        </span>
                        <span className="hidden shrink-0 items-center text-[#8b949e]/60 sm:flex" aria-hidden="true">
                            <HiChevronLeft className="size-4" />
                            <HiChevronRight className="size-4" />
                        </span>
                        <span className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-md bg-[#0d1117] px-2.5 font-mono text-[11px] text-[#8b949e]">
                            <HiLockClosed aria-hidden="true" className="size-3 shrink-0 text-[#7ee787]" />
                            <span className="truncate">
                                <span className="text-[#c9d1d9]">{project.url.split('/')[0]}</span>
                                {project.url.includes('/') ? `/${project.url.split('/').slice(1).join('/')}` : ''}
                            </span>
                        </span>
                        {!reduceMotion && (
                            <button
                                type="button"
                                aria-pressed={playing}
                                aria-label={`${playing ? 'Stop' : 'Play'} scrolling preview of ${project.name}`}
                                className="grid size-10 shrink-0 place-items-center rounded-md text-[#8b949e] transition-colors hover:bg-[#30363d]/60 hover:text-[#7ee787] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7ee787]"
                                onClick={() => setPlaying((v) => !v)}
                            >
                                {playing ? (
                                    <HiPause aria-hidden="true" className="size-4" />
                                ) : (
                                    <HiPlay aria-hidden="true" className="size-4" />
                                )}
                            </button>
                        )}
                    </div>

                    <div
                        role="img"
                        aria-label={project.label}
                        tabIndex={reduceMotion ? 0 : undefined}
                        className={cn(
                            'relative h-60 bg-[#0d1117] sm:h-72',
                            reduceMotion
                                ? 'overflow-y-auto focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7ee787]'
                                : 'overflow-hidden',
                        )}
                    >
                        <div
                            aria-hidden="true"
                            className={cn(
                                'transition-transform ease-in-out',
                                scrolled
                                    ? '-translate-y-[calc(100%-15rem)] duration-[4500ms] sm:-translate-y-[calc(100%-18rem)]'
                                    : 'translate-y-0 duration-700',
                            )}
                        >
                            <Page />
                        </div>
                        {!reduceMotion && (
                            <span aria-hidden="true" className="absolute bottom-2 right-1.5 top-2 w-1 rounded-full bg-white/10">
                                <span
                                    className={cn(
                                        'absolute left-0 h-10 w-full rounded-full bg-[#7ee787] transition-[top] ease-in-out',
                                        scrolled ? 'top-[calc(100%-2.5rem)] duration-[4500ms]' : 'top-0 duration-700',
                                    )}
                                />
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-mono text-xl font-bold text-[#f0f6fc]">
                        <span className="text-[#7ee787]">./</span>
                        {project.name}
                    </h3>
                    <span className="font-mono text-xs text-[#8b949e]">{project.year}</span>
                </div>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#c9d1d9]/80">{project.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
                    <span className="flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                            <span key={tech} className="rounded border border-[#30363d] px-2 py-0.5 text-[#c9d1d9]">
                                {tech}
                            </span>
                        ))}
                    </span>
                    <span className="text-[#7ee787]">▲ {project.metric}</span>
                </div>
                <div className="mt-4 flex gap-2 font-mono text-sm">
                    <a
                        href={`#visit-${project.id}`}
                        aria-label={`Visit ${project.name}`}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 font-bold text-[#f0f6fc] underline decoration-[#7ee787]/50 underline-offset-4 transition-colors hover:text-[#7ee787] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787]"
                    >
                        Visit
                        <HiArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                    <a
                        href={`#source-${project.id}`}
                        aria-label={`Source code for ${project.name}`}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 font-bold text-[#8b949e] transition-colors hover:text-[#7ee787] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787]"
                    >
                        Source
                        <HiArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                </div>
            </article>
        </motion.li>
    )
}

export function BrowserFrameProjectsGrid({
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
            className={cn(
                'relative overflow-hidden bg-[#0c0c0c] px-4 py-16 text-base font-normal text-[#c9d1d9] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#7ee787]">~/projects · 4 in production</p>
                        <h2 className="mt-5 font-mono text-3xl font-semibold leading-[1.15] tracking-[-0.03em] text-[#f0f6fc] sm:text-4xl lg:text-5xl">
                            Systems in production, with the screens to prove it.
                        </h2>
                    </div>
                    <p className="max-w-xs font-mono text-xs leading-relaxed text-[#8b949e]">
                        <span className="text-[#7ee787]">#</span> hover a window (or press ▶) to scroll the whole page
                    </p>
                </div>

                <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
                    {projects.map((project, index) => (
                        <BrowserCard key={project.id} project={project} index={index} reduceMotion={reduceMotion} />
                    ))}
                </ul>

                <div className="mt-16 flex justify-center">
                    <a
                        href="#repositories"
                        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#30363d] px-5 font-mono text-sm font-bold text-[#c9d1d9] transition-colors hover:border-[#7ee787] hover:text-[#7ee787] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7ee787]"
                    >
                        <span className="text-[#7ee787]">$</span> ls ~/repositories --all
                        <HiArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default BrowserFrameProjectsGrid

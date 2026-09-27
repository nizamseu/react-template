// ProficiencyMeterSkillsToolset

// SkillsToolset02 · Portfolios & Personal Websites › Skills & Toolset

// Description:
// A btop-style terminal dashboard of backend engineer Nadia Karim's skills. Under the prompt
// "nadia@karim:~$ skills --list --bars" and the heading "Proficiency, measured honestly."
// eight rows (Go, PostgreSQL, Observability, Kubernetes, Python, gRPC, Kafka, Terraform) fill
// ASCII meters like "[████████░░] 80%" when scrolled into view, with years and a usage
// note. Side panels list what she is "currently learning" and a few career stats. Use it
// as the skills section of an engineer's portfolio.

// Design:
// - Near-black #0c0c0c page, terminal green #7ee787 for bars and highlights, grey #c9d1d9
//   body text, everything font-mono; panels are 1px green/25 boxes with their title set
//   into the top border like box-drawing TUI windows
// - Meter rows: logo + name, block-character bar (10 cells → sm 20 → lg 30), padded
//   percent and years; a dim "#" comment line underneath; hover tints the row and shows ">"
// - Sort flags (--sort=level / years / name) are pill toggles; rows reorder with framer
//   layout animation; a blinking block cursor follows the prompt
// - Learning panel: braille spinner on in-progress items, mini ▓░ meters and start dates
// - Layout: single column → lg two columns (meters | 360px side panels)

// What it does:
// - useInView (once) starts a requestAnimationFrame timeline that counts every meter from
//   0 to its value with a 90 ms stagger; reduced motion shows final values immediately,
//   and each row is a role="meter" with the real aria-valuenow from the first render
// - sort state reorders rows; the buttons expose aria-pressed
// - A 90 ms interval animates the spinner (skipped for reduced motion, cleared on unmount)
// - "open ./resume.pdf" links to #nadia-resume; everything else is display-only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ProficiencyMeterSkillsToolset from '@/TestComponent/PageSections/portfolio/SkillsToolset02';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <ProficiencyMeterSkillsToolset />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight } from 'react-icons/hi2';
import {
    SiApachekafka,
    SiGo,
    SiGrafana,
    SiKubernetes,
    SiPostgresql,
    SiPython,
    SiRust,
    SiTerraform,
    SiZig,
} from 'react-icons/si';
import { LuNetwork } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const skills = [
    { id: 'go', name: 'go', Icon: SiGo, level: 92, years: 7, note: 'ledger + payout services, 40k req/s at peak' },
    { id: 'postgres', name: 'postgresql', Icon: SiPostgresql, level: 88, years: 9, note: 'partitioning, logical replication, vacuum tuning' },
    { id: 'observability', name: 'observability', Icon: SiGrafana, level: 84, years: 6, note: 'prometheus, grafana, 212 SLO alerts I actually trust' },
    { id: 'k8s', name: 'kubernetes', Icon: SiKubernetes, level: 80, years: 5, note: '41 services, 3 clusters, zero-downtime upgrades' },
    { id: 'python', name: 'python', Icon: SiPython, level: 76, years: 9, note: 'tooling, data backfills, incident scripts' },
    { id: 'grpc', name: 'grpc', Icon: LuNetwork, level: 74, years: 5, note: 'protobuf contracts across 6 teams' },
    { id: 'kafka', name: 'kafka', Icon: SiApachekafka, level: 71, years: 4, note: 'event-sourced settlement pipeline' },
    { id: 'terraform', name: 'terraform', Icon: SiTerraform, level: 68, years: 5, note: 'multi-account cloud, 1.2k managed resources' },
]

const learning = [
    { id: 'rust', name: 'rust', Icon: SiRust, status: 'active', progress: 38, since: 'feb 2026', note: 'rewriting our log-shipper sidecar' },
    { id: 'ebpf', name: 'ebpf', Icon: null, status: 'active', progress: 24, since: 'may 2026', note: 'tracing syscalls without restarts' },
    { id: 'zig', name: 'zig', Icon: SiZig, status: 'queued', progress: 0, since: 'next', note: 'after the sidecar ships' },
    { id: 'tla', name: 'tla+', Icon: null, status: 'done', progress: 100, since: 'aug 2026', note: 'modelled the payout state machine' },
]

const sorts = [
    { id: 'level', label: 'level' },
    { id: 'years', label: 'years' },
    { id: 'name', label: 'name' },
]

const stats = [
    ['uptime', '9y 4m in prod'],
    ['services', '41 owned'],
    ['pages', '112 resolved'],
    ['mttr', '12m p50'],
]

const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const STAGGER = 90
const FILL = 900
const TOTAL = FILL + STAGGER * (skills.length - 1)

const ease = (x) => 1 - Math.pow(1 - x, 3)

function bar(value, cells) {
    const filled = Math.round((value / 100) * cells)
    return { on: '█'.repeat(filled), off: '░'.repeat(cells - filled) }
}

function Panel({ title, meta, className, children }) {
    return (
        <div className={cn('relative rounded-md border border-[#7ee787]/25 px-4 pb-5 pt-7 sm:px-6', className)}>
            <p className="absolute -top-2.5 left-3 flex items-center gap-2 bg-[#0c0c0c] px-2 text-xs text-[#7ee787]">
                <span aria-hidden="true">┤</span>
                <span className="font-bold">{title}</span>
                <span aria-hidden="true">├</span>
            </p>
            {meta && (
                <p className="absolute -top-2.5 right-3 bg-[#0c0c0c] px-2 text-[11px] text-[#c9d1d9]/50">{meta}</p>
            )}
            {children}
        </div>
    )
}

export function ProficiencyMeterSkillsToolset({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const listRef = useRef(null)
    const inView = useInView(listRef, { once: true, amount: 0.25 })
    const [elapsed, setElapsed] = useState(0)
    const [sortBy, setSortBy] = useState('level')
    const [frame, setFrame] = useState(0)

    useEffect(() => {
        if (!inView || reduceMotion) return undefined
        let raf = 0
        const start = performance.now()
        const tick = (now) => {
            const e = Math.min(now - start, TOTAL)
            setElapsed(e)
            if (e < TOTAL) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [inView, reduceMotion])

    useEffect(() => {
        if (reduceMotion) return undefined
        const id = setInterval(() => setFrame((f) => (f + 1) % SPINNER.length), 90)
        return () => clearInterval(id)
    }, [reduceMotion])

    const time = reduceMotion ? TOTAL : elapsed
    const order = skills.map((skill, i) => ({ ...skill, order: i }))
    const sorted = [...order].sort((a, b) => {
        if (sortBy === 'years') return b.years - a.years || b.level - a.level
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return b.level - a.level
    })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0c0c0c] font-mono text-base font-normal text-[#c9d1d9]', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(126,231,135,0.035)_1px,transparent_1px)] [background-size:100%_4px]"
            />
            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <p className="flex flex-wrap items-center gap-x-2 text-sm">
                    <span>
                        <span className="text-[#7ee787]">nadia@karim</span>
                        <span className="text-[#c9d1d9]/50">:~$</span>
                    </span>
                    <span className="text-[#c9d1d9]">skills --list --bars</span>
                    <motion.span
                        aria-hidden="true"
                        className="inline-block h-4 w-2 bg-[#7ee787]"
                        animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                    />
                </p>

                <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="font-mono text-3xl font-bold leading-tight tracking-tight text-[#f0f6fc] sm:text-5xl">
                            Proficiency, <span className="text-[#7ee787]">measured honestly.</span>
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-[#c9d1d9]/70">
                            # self-assessed, then calibrated against nine years of on-call. 100% is reserved for
                            people who wrote the thing.
                        </p>
                    </div>
                    <div role="group" aria-label="Sort skills" className="flex flex-wrap gap-2">
                        {sorts.map((sort) => {
                            const on = sortBy === sort.id
                            return (
                                <button
                                    key={sort.id}
                                    type="button"
                                    aria-pressed={on}
                                    className={cn(
                                        'min-h-10 rounded border px-3 text-xs transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787]',
                                        on
                                            ? 'border-[#7ee787] bg-[#7ee787] text-[#0c0c0c]'
                                            : 'border-[#7ee787]/30 text-[#c9d1d9] hover:border-[#7ee787]/70 hover:text-[#7ee787]',
                                    )}
                                    onClick={() => setSortBy(sort.id)}
                                >
                                    --sort={sort.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
                    <Panel title="skills.bars" meta={`${skills.length} rows`}>
                        <ul ref={listRef} className="-mx-2 space-y-1 sm:-mx-3">
                            {sorted.map((skill) => {
                                const local = Math.min(1, Math.max(0, (time - skill.order * STAGGER) / FILL))
                                const shown = Math.round(skill.level * ease(local))
                                const small = bar(shown, 10)
                                const medium = bar(shown, 20)
                                const large = bar(shown, 30)
                                const Icon = skill.Icon
                                return (
                                    <motion.li
                                        key={skill.id}
                                        layout={!reduceMotion}
                                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        role="meter"
                                        aria-label={`${skill.name}, ${skill.years} years`}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={skill.level}
                                        className="group rounded px-2 py-2.5 transition-colors duration-200 hover:bg-[#7ee787]/[0.06] sm:px-3"
                                    >
                                        <div aria-hidden="true" className="flex items-center gap-1.5 text-[13px] sm:gap-3 sm:text-sm">
                                            <span className="hidden w-2 text-[#7ee787] opacity-0 transition-opacity group-hover:opacity-100 sm:inline-block">
                                                &gt;
                                            </span>
                                            <Icon className="size-3.5 shrink-0 text-[#7ee787]/80" />
                                            <span className="w-[6.5rem] shrink-0 truncate text-[#f0f6fc] sm:w-36">{skill.name}</span>
                                            <span className="whitespace-pre text-[#c9d1d9]/40">
                                                [
                                                <span className="text-[#7ee787] sm:hidden">{small.on}</span>
                                                <span className="sm:hidden">{small.off}</span>
                                                <span className="hidden text-[#7ee787] sm:inline lg:hidden">{medium.on}</span>
                                                <span className="hidden sm:inline lg:hidden">{medium.off}</span>
                                                <span className="hidden text-[#7ee787] lg:inline">{large.on}</span>
                                                <span className="hidden lg:inline">{large.off}</span>
                                                ]
                                            </span>
                                            <span className="ml-auto w-10 shrink-0 text-right tabular-nums text-[#f0f6fc]">
                                                {String(shown).padStart(3, ' ')}%
                                            </span>
                                            <span className="hidden w-8 shrink-0 text-right text-[#c9d1d9]/50 sm:inline">
                                                {skill.years}y
                                            </span>
                                        </div>
                                        <p className="mt-1 pl-5 text-xs leading-relaxed text-[#c9d1d9]/45 sm:truncate sm:pl-[2.875rem]">
                                            # {skill.note}
                                        </p>
                                    </motion.li>
                                )
                            })}
                        </ul>
                    </Panel>

                    <div className="space-y-10">
                        <Panel title="currently_learning" meta="4 items">
                            <ul className="space-y-4">
                                {learning.map((item) => {
                                    const Icon = item.Icon
                                    const mini = Math.round(item.progress / 12.5)
                                    return (
                                        <li key={item.id} className="text-sm">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'w-9 shrink-0',
                                                        item.status === 'active' && 'text-[#7ee787]',
                                                        item.status === 'done' && 'text-[#7ee787]/60',
                                                        item.status === 'queued' && 'text-[#c9d1d9]/40',
                                                    )}
                                                >
                                                    [{item.status === 'active' ? (reduceMotion ? '~' : SPINNER[frame]) : item.status === 'done' ? 'x' : ' '}]
                                                </span>
                                                {Icon ? (
                                                    <Icon aria-hidden="true" className="size-3.5 shrink-0 text-[#7ee787]/80" />
                                                ) : (
                                                    <span aria-hidden="true" className="w-3.5 shrink-0 text-center text-[10px] text-[#7ee787]/80">
                                                        ◆
                                                    </span>
                                                )}
                                                <span
                                                    className={cn(
                                                        'text-[#f0f6fc]',
                                                        item.status === 'done' && 'text-[#c9d1d9]/60 line-through decoration-[#7ee787]/60',
                                                    )}
                                                >
                                                    {item.name}
                                                </span>
                                                <span className="ml-auto text-[11px] text-[#c9d1d9]/45">{item.since}</span>
                                            </div>
                                            <div className="mt-1.5 flex items-center gap-2 pl-11 text-xs">
                                                {item.status === 'queued' ? (
                                                    <span className="text-[#c9d1d9]/40">queued</span>
                                                ) : (
                                                    <>
                                                        <span aria-hidden="true" className="whitespace-pre">
                                                            <span className="text-[#7ee787]">{'▓'.repeat(mini)}</span>
                                                            <span className="text-[#c9d1d9]/25">{'░'.repeat(8 - mini)}</span>
                                                        </span>
                                                        <span className="tabular-nums text-[#c9d1d9]/70">{item.progress}%</span>
                                                    </>
                                                )}
                                            </div>
                                            <p className="mt-1 pl-11 text-xs text-[#c9d1d9]/45"># {item.note}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </Panel>

                        <Panel title="stats">
                            <dl className="space-y-2 text-sm">
                                {stats.map(([key, value]) => (
                                    <div key={key} className="flex items-baseline gap-2">
                                        <dt className="w-20 shrink-0 text-[#7ee787]">{key}</dt>
                                        <dd
                                            aria-hidden="true"
                                            className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-[#c9d1d9]/20"
                                        >
                                            ........................................
                                        </dd>
                                        <dd className="shrink-0 text-[#f0f6fc]">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                            <a
                                href="#nadia-resume"
                                className="group mt-6 flex min-h-11 items-center justify-between rounded border border-[#7ee787]/40 px-4 text-sm text-[#7ee787] transition-colors duration-200 hover:bg-[#7ee787] hover:text-[#0c0c0c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787]"
                            >
                                <span>$ open ./resume.pdf</span>
                                <HiArrowUpRight
                                    aria-hidden="true"
                                    className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>
                        </Panel>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProficiencyMeterSkillsToolset

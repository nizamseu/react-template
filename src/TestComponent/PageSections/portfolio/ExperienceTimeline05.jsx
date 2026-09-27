// CommitGraphExperienceTimeline

// ExperienceTimeline05 · Portfolios & Personal Websites › Experience & Education Timeline

// Description:
// Backend engineer Nadia Karim's career rendered as `git log --graph`. Under the heading
// "Eleven years of history. No force-pushes." twelve commits run from "init: graduated BSc
// Computer Science" to "feat: promoted to Staff SRE at Ledgerline", with green work
// commits on main and purple side branches for her part-time MSc and the open-source
// tracing library tidewire forking off and merging back. Click a commit to "git show" its
// story as diff lines. Use it as a playful experience section for an engineer.

// Design:
// - #0c0c0c page, a #0f0f0f log panel with a white/10 border, font-mono throughout; main
//   lane and "+" lines in green #7ee787, branch lanes, tags and "-" lines in purple
//   #d2a8ff, hashes and meta in grey #8b949e, messages in #f0f6fc
// - Graph: a 56px column per row drawing lanes with 2px absolutely positioned segments
//   and SVG bezier curves for forks and merges; nodes are 12px rings (HEAD is filled and
//   glows); lanes stretch through expanded rows so the graph never breaks
// - Row: hash, decorations "(HEAD -> main, tag: staff-sre)", conventional-commit message
//   with a coloured type prefix and the date; hover tints the row and details open with a
//   height tween (instant for reduced motion)
// - Header: prompt line, bold mono heading, legend and an Expand all / Collapse all
//   button; footer with commit stats and a "git checkout hire-nadia" link
// - Responsive: date moves under the message below sm; the log panel never scrolls
//   sideways (messages wrap); legend stacks under the heading below lg

// What it does:
// - open is a Set of commit hashes (first commit open by default); each row button
//   toggles its hash and exposes aria-expanded / aria-controls; the details region is
//   labelled by its row
// - "Expand all" opens every commit, "Collapse all" closes them (aria-pressed)
// - "$ git checkout hire-nadia" links to #nadia-contact; the graph is aria-hidden and
//   each row's lane is also stated in text for screen readers

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CommitGraphExperienceTimeline from '@/TestComponent/PageSections/portfolio/ExperienceTimeline05';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <CommitGraphExperienceTimeline />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const GREEN = '#7ee787'
const PURPLE = '#d2a8ff'
const LANE_X = [16, 38]
const LANE_COLOR = [GREEN, PURPLE]
const NODE_Y = 22
const CURVE = 26

// Edge: [fromLane, from ('top' | 'node'), toLane, to ('node' | 'bottom')]
const commits = [
    {
        hash: 'e41b7a2',
        lane: 0,
        edges: [[0, 'node', 0, 'bottom']],
        refs: [{ label: 'HEAD -> main', tone: 'head' }, { label: 'tag: staff-sre', tone: 'tag' }],
        type: 'feat',
        message: 'promoted to Staff SRE at Ledgerline',
        date: 'Mar 2025',
        long: 'Mon Mar 3 09:12 2025',
        body: 'I own reliability for the ledger and payouts platform: 41 services, 3 regions, a 99.99% SLO.',
        stats: ['+ cut p99 ledger write latency from 180ms to 42ms', '+ led the move of 41 services to Kubernetes 1.30', '- pager load down 63% after a full alert audit'],
    },
    {
        hash: '9c0d5f1',
        lane: 0,
        edges: [[0, 'top', 0, 'node'], [0, 'node', 0, 'bottom'], [0, 'node', 1, 'bottom']],
        refs: [],
        type: 'merge',
        message: 'branch oss/tidewire into main',
        date: 'Nov 2024',
        long: 'Thu Nov 14 17:40 2024',
        body: 'My side project came home: Ledgerline now runs tidewire in production.',
        stats: ['+ tidewire traces 1.8B spans a day at Ledgerline', '+ 2,140 GitHub stars, 36 contributors'],
    },
    {
        hash: '3f8e2aa',
        lane: 1,
        edges: [[0, 'top', 0, 'bottom'], [1, 'top', 1, 'node'], [1, 'node', 1, 'bottom']],
        refs: [{ label: 'tag: tidewire/v1.0', tone: 'tag' }],
        type: 'release',
        message: 'tidewire v1.0, adopted by 40+ teams',
        date: 'Aug 2024',
        long: 'Tue Aug 20 21:03 2024',
        body: 'Shipped v1.0 with OpenTelemetry export and about 3µs of overhead per span.',
        stats: ['+ talk: "Tracing without tears", Harbour Go Conference', '- dropped the last external dependency'],
    },
    {
        hash: 'b72c19e',
        lane: 0,
        edges: [[0, 'top', 0, 'node'], [0, 'node', 0, 'bottom'], [1, 'top', 1, 'bottom']],
        refs: [{ label: 'tag: ledgerline', tone: 'tag' }],
        type: 'feat',
        message: 'joined Ledgerline (fintech) as Senior SRE',
        date: 'Jan 2023',
        long: 'Mon Jan 9 08:30 2023',
        body: 'B2B payments platform. Joined the ledger team as its second SRE.',
        stats: ['+ built the idempotency layer for 40k req/s payment writes', '+ wrote the incident-review template the org still uses', '- deploy time down from 38 min to 9 min'],
    },
    {
        hash: '0d4a6e3',
        lane: 1,
        edges: [[0, 'top', 0, 'bottom'], [1, 'top', 1, 'node'], [1, 'node', 0, 'bottom']],
        refs: [{ label: 'oss/tidewire', tone: 'branch' }],
        type: 'init',
        message: 'first commit of tidewire, a tiny Go tracing lib',
        date: 'Jun 2022',
        long: 'Sat Jun 11 02:47 2022',
        body: 'Born from a 3am incident where nobody could see which service was slow.',
        stats: ['+ 412 lines, zero dependencies', '+ first outside pull request within nine days'],
    },
    {
        hash: '5aa81f0',
        lane: 0,
        edges: [[0, 'top', 0, 'node'], [0, 'node', 0, 'bottom']],
        refs: [],
        type: 'fix',
        message: 'on-call at Parcelgrid, MTTR 47 → 12 min',
        date: 'Oct 2021',
        long: 'Fri Oct 1 16:20 2021',
        body: 'Rebuilt the rotation, the runbooks and the habit of blameless reviews.',
        stats: ['- mean time to recovery from 47 min to 12 min', '+ 28 runbooks, each tested in a game day'],
    },
    {
        hash: 'c19e7b4',
        lane: 0,
        edges: [[0, 'top', 0, 'node'], [0, 'node', 0, 'bottom'], [0, 'node', 1, 'bottom']],
        refs: [{ label: 'tag: msc', tone: 'tag' }],
        type: 'merge',
        message: 'branch edu/msc-distributed-systems',
        date: 'Sep 2019',
        long: 'Wed Sep 18 11:00 2019',
        body: 'Graduated with distinction after two years of evenings and weekends.',
        stats: ['+ MSc Distributed Systems, with distinction', '+ workshop paper on partition-tolerant consensus'],
    },
    {
        hash: '8e6d03b',
        lane: 1,
        edges: [[0, 'top', 0, 'bottom'], [1, 'top', 1, 'node'], [1, 'node', 1, 'bottom']],
        refs: [],
        type: 'docs',
        message: 'thesis on consensus under partial partitions',
        date: 'Jun 2019',
        long: 'Mon Jun 24 23:58 2019',
        body: 'A Raft variant tested on 5-node clusters with injected network faults.',
        stats: ['+ 94 pages, 11 chaos experiments', '+ supervised by Prof. Ilse Varga'],
    },
    {
        hash: 'f02b8d6',
        lane: 0,
        edges: [[0, 'top', 0, 'node'], [0, 'node', 0, 'bottom'], [1, 'top', 1, 'bottom']],
        refs: [{ label: 'tag: parcelgrid', tone: 'tag' }],
        type: 'feat',
        message: 'joined Parcelgrid (logistics) as Backend Engineer',
        date: 'Feb 2018',
        long: 'Thu Feb 1 09:00 2018',
        body: 'Last-mile delivery platform. Worked on routing and the parcel event stream.',
        stats: ['+ route-assignment service in Go, 2M parcels a day', '+ moved 3 MySQL shards to PostgreSQL with zero downtime'],
    },
    {
        hash: '41c7a9e',
        lane: 1,
        edges: [[0, 'top', 0, 'bottom'], [1, 'top', 1, 'node'], [1, 'node', 0, 'bottom']],
        refs: [{ label: 'edu/msc-distributed-systems', tone: 'branch' }],
        type: 'init',
        message: 'enrolled, part-time MSc at Northfield Tech',
        date: 'Sep 2017',
        long: 'Mon Sep 25 18:30 2017',
        body: 'Northfield Technical University, part-time MSc in Distributed Systems.',
        stats: ['+ modules: consensus, storage engines, formal methods', '- free evenings (temporarily)'],
    },
    {
        hash: '2d9e0b1',
        lane: 0,
        edges: [[0, 'top', 0, 'node'], [0, 'node', 0, 'bottom']],
        refs: [{ label: 'tag: first-job', tone: 'tag' }],
        type: 'feat',
        message: 'Junior Backend Dev at Quayside Telecom',
        date: 'Jul 2015',
        long: 'Wed Jul 1 09:00 2015',
        body: 'Billing team. Learned Python, SQL and on-call the hard way.',
        stats: ['- invoice batch job from 6 hours to 40 minutes', '+ first production incident, first postmortem'],
    },
    {
        hash: '0a1f3c9',
        lane: 0,
        edges: [[0, 'top', 0, 'node']],
        refs: [{ label: 'tag: v0.1', tone: 'tag' }],
        type: 'init',
        message: 'graduated BSc Computer Science, Riverbend University',
        date: 'May 2015',
        long: 'Fri May 29 14:00 2015',
        body: 'The repository begins. First-class honours.',
        stats: ['+ final project: a toy key-value store in C'],
    },
]

const TYPE_COLOR = {
    feat: 'text-[#7ee787]',
    fix: 'text-[#7ee787]',
    merge: 'text-[#d2a8ff]',
    release: 'text-[#d2a8ff]',
    docs: 'text-[#d2a8ff]',
    init: 'text-[#8b949e]',
}

function Segment({ lane, top, bottom, height }) {
    return (
        <span
            className="absolute w-[2px] rounded-full"
            style={{ left: LANE_X[lane] - 1, top, bottom, height, backgroundColor: LANE_COLOR[lane] }}
        />
    )
}

function Graph({ commit, isHead }) {
    const parts = []
    commit.edges.forEach(([fromLane, from, toLane, to], i) => {
        const key = `e${i}`
        if (from === 'top' && to === 'node') {
            parts.push(<Segment key={key} lane={fromLane} top={0} height={NODE_Y} />)
        } else if (from === 'top' && to === 'bottom') {
            parts.push(<Segment key={key} lane={fromLane} top={0} bottom={0} />)
        } else if (from === 'node' && fromLane === toLane) {
            parts.push(<Segment key={key} lane={fromLane} top={NODE_Y} bottom={0} />)
        } else {
            const branchLane = Math.max(fromLane, toLane)
            const x1 = LANE_X[fromLane]
            const x2 = LANE_X[toLane]
            parts.push(
                <svg
                    key={key}
                    className="absolute left-0 overflow-visible"
                    style={{ top: NODE_Y, width: 56, height: CURVE }}
                    viewBox={`0 0 56 ${CURVE}`}
                >
                    <path
                        d={`M${x1} 0 C ${x1} ${CURVE * 0.6}, ${x2} ${CURVE * 0.4}, ${x2} ${CURVE}`}
                        fill="none"
                        stroke={LANE_COLOR[branchLane]}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>,
            )
            parts.push(<Segment key={`${key}-tail`} lane={toLane} top={NODE_Y + CURVE} bottom={0} />)
        }
    })

    const color = LANE_COLOR[commit.lane]
    return (
        <div aria-hidden="true" className="relative w-14 shrink-0 self-stretch">
            {parts}
            <span
                className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{
                    left: LANE_X[commit.lane],
                    top: NODE_Y,
                    borderColor: color,
                    backgroundColor: isHead ? color : '#0f0f0f',
                    boxShadow: isHead ? `0 0 0 4px ${color}33, 0 0 16px ${color}` : undefined,
                }}
            />
        </div>
    )
}

export function CommitGraphExperienceTimeline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const [open, setOpen] = useState(() => new Set([commits[0].hash]))
    const allOpen = open.size === commits.length

    const toggle = (hash) => {
        setOpen((prev) => {
            const next = new Set(prev)
            if (next.has(hash)) next.delete(hash)
            else next.add(hash)
            return next
        })
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0c0c0c] font-mono text-base font-normal text-[#c9d1d9]', className)}
            {...props}
        >
            <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <p className="flex flex-wrap items-center gap-x-2 text-sm">
                    <span className="text-[#7ee787]">nadia@karim</span>
                    <span className="text-[#8b949e]">~/career</span>
                    <span className="text-[#d2a8ff]">(main)</span>
                    <span className="text-[#8b949e]">$</span>
                    <span className="text-[#f0f6fc]">git log --graph --decorate</span>
                </p>

                <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <h2 className="max-w-2xl font-mono text-3xl font-bold leading-tight tracking-tight text-[#f0f6fc] sm:text-5xl">
                        Eleven years of history. <span className="text-[#7ee787]">No force-pushes.</span>
                    </h2>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
                        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#8b949e]">
                            <li className="flex items-center gap-2">
                                <span aria-hidden="true" className="size-2.5 rounded-full bg-[#7ee787]" />
                                main · work
                            </li>
                            <li className="flex items-center gap-2">
                                <span aria-hidden="true" className="size-2.5 rounded-full bg-[#d2a8ff]" />
                                branches · study &amp; open source
                            </li>
                        </ul>
                        <button
                            type="button"
                            aria-pressed={allOpen}
                            className="inline-flex min-h-10 items-center self-start rounded border border-[#7ee787]/40 px-3 text-xs text-[#7ee787] transition-colors duration-200 hover:bg-[#7ee787] hover:text-[#0c0c0c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787] lg:self-end"
                            onClick={() => setOpen(allOpen ? new Set() : new Set(commits.map((c) => c.hash)))}
                        >
                            {allOpen ? 'git show --collapse-all' : 'git show --all'}
                        </button>
                    </div>
                </div>

                <ol className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-[#0f0f0f] py-2">
                    {commits.map((commit, index) => {
                        const isOpen = open.has(commit.hash)
                        const rowId = `${uid}-commit-${commit.hash}`
                        const panelId = `${uid}-show-${commit.hash}`
                        return (
                            <li
                                key={commit.hash}
                                className={cn(
                                    'flex pl-1 transition-colors duration-200 sm:pl-2',
                                    isOpen ? 'bg-white/[0.035]' : 'hover:bg-white/[0.025]',
                                )}
                            >
                                <Graph commit={commit} isHead={index === 0} />
                                <div className="min-w-0 flex-1 pr-3 sm:pr-5">
                                    <h3 className="text-sm font-normal text-[#c9d1d9]">
                                        <button
                                            id={rowId}
                                            type="button"
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            className="group flex w-full flex-col gap-1 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7ee787] sm:flex-row sm:items-baseline sm:gap-4"
                                            onClick={() => toggle(commit.hash)}
                                        >
                                            <span className="min-w-0 flex-1 leading-5">
                                                <span className="mr-2 text-[#8b949e] transition-colors group-hover:text-[#f0f6fc]">
                                                    {commit.hash}
                                                </span>
                                                {commit.refs.length > 0 && (
                                                    <span className="mr-2 text-[#8b949e]">
                                                        (
                                                        {commit.refs.map((ref, i) => (
                                                            <span key={ref.label}>
                                                                {i > 0 && ', '}
                                                                <span
                                                                    className={cn(
                                                                        ref.tone === 'head' && 'font-bold text-[#7ee787]',
                                                                        ref.tone === 'tag' && 'text-[#d2a8ff]',
                                                                        ref.tone === 'branch' && 'text-[#d2a8ff] underline decoration-dotted underline-offset-2',
                                                                    )}
                                                                >
                                                                    {ref.label}
                                                                </span>
                                                            </span>
                                                        ))}
                                                        )
                                                    </span>
                                                )}
                                                <span className={TYPE_COLOR[commit.type]}>{commit.type}:</span>{' '}
                                                <span className="text-[#f0f6fc]">{commit.message}</span>
                                                <span className="sr-only">
                                                    {commit.lane === 0 ? ', on main' : ', on a side branch'}
                                                </span>
                                            </span>
                                            <span className="shrink-0 text-xs text-[#8b949e] sm:text-right">
                                                {commit.date}
                                            </span>
                                        </button>
                                    </h3>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                id={panelId}
                                                key="show"
                                                role="region"
                                                aria-labelledby={rowId}
                                                initial={{ height: reduceMotion ? 'auto' : 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: reduceMotion ? 'auto' : 0, opacity: 0 }}
                                                transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mb-4 rounded-md border border-white/[0.08] bg-[#0c0c0c] p-4 text-[13px] leading-relaxed">
                                                    <p className="text-[#8b949e]">
                                                        commit <span className="text-[#f0f6fc]">{commit.hash}</span>
                                                    </p>
                                                    <p className="text-[#8b949e]">Author: Nadia Karim</p>
                                                    <p className="text-[#8b949e]">Date:   {commit.long}</p>
                                                    <p className="mt-3 border-l-2 border-white/10 pl-3 text-[#c9d1d9]">{commit.body}</p>
                                                    <ul className="mt-3 space-y-1">
                                                        {commit.stats.map((line) => (
                                                            <li
                                                                key={line}
                                                                className={cn(
                                                                    'rounded px-2 py-0.5',
                                                                    line.startsWith('+')
                                                                        ? 'bg-[#7ee787]/[0.08] text-[#7ee787]'
                                                                        : 'bg-[#d2a8ff]/[0.08] text-[#d2a8ff]',
                                                                )}
                                                            >
                                                                {line}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </li>
                        )
                    })}
                </ol>

                <div className="mt-6 flex flex-col gap-4 text-xs text-[#8b949e] sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        {commits.length} commits · 2 branches merged · <span className="text-[#7ee787]">0 reverts</span>
                    </p>
                    <a
                        href="#nadia-contact"
                        className="group inline-flex min-h-11 items-center gap-2 self-start rounded border border-white/15 px-4 text-sm text-[#f0f6fc] transition-colors duration-200 hover:border-[#7ee787] hover:text-[#7ee787] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ee787] sm:self-auto"
                    >
                        $ git checkout hire-nadia
                        <HiArrowRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CommitGraphExperienceTimeline

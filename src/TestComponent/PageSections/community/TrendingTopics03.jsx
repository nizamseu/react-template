// MomentumSparkTrendingTopics

// TrendingTopics03 · Social Networks & Communities › Trending Topics / Hashtags

// Description:
// A "momentum board" for the fictional discussion site Agora Forums. Under the serif heading
// "Which conversations are gathering pace?" eight threads (e.g. "Balcony tomato blight — what
// actually worked?") are ranked by how fast their reply rate is changing, each with an SVG
// sparkline and a rising or cooling percentage. A featured chart shows the selected thread
// in detail. Use it on a forum home, a community digest or a moderator dashboard.

// Design:
// - Paper #fafafa section, white cards with #e7e5e4 hairlines, stone ink #1c1917 / #57534e,
//   Agora forest #166534 for the window pill, selected row rule and links
// - Direction colours green #15803d / red #b91c1c appear only on sparklines, the featured
//   line and deltas, always paired with an up/down arrow and a +/− sign
// - Serif display heading (text-4xl → lg:text-6xl), mono uppercase eyebrows and tabular
//   numbers; rounded-3xl cards with a soft stone shadow; 2px chart lines with a fading area
// - The window control has a sliding forest pill (layoutId); rows re-sort with layout
//   animation and the featured line redraws (pathLength) on change — off for reduced motion
// - Responsive: a single column below lg with the featured chart first; on lg the ranked
//   list (left) sits beside a sticky chart card (right); summary stats go 1 → 3 columns

// What it does:
// - The 1h / 24h / 7d tabs switch every series, delta, total and axis label; the list is
//   re-ranked by momentum for that window
// - Filter chips All / Rising / Cooling narrow the list; clicking a row (aria-pressed)
//   shows that thread in the featured chart
// - The featured chart has a crosshair tooltip on pointer move; it is also focusable, with
//   ← / → / Home / End moving the crosshair and an aria-live line reading the value out
// - "Open thread" links to #agora-thread-<id>; all data is deterministic mock data

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MomentumSparkTrendingTopics from '@/TestComponent/PageSections/community/TrendingTopics03';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <MomentumSparkTrendingTopics />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowDownRight, HiArrowUpRight, HiArrowRight, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const UP = '#15803d'
const DOWN = '#b91c1c'

const windows = [
    { id: '1h', label: '1h', long: 'the last hour', points: 12, unit: 'replies per 5 min', axis: ['60 min ago', '30 min', 'now'] },
    { id: '24h', label: '24h', long: 'the last 24 hours', points: 24, unit: 'replies per hour', axis: ['24 h ago', '12 h', 'now'] },
    { id: '7d', label: '7d', long: 'the last 7 days', points: 14, unit: 'replies per 12 h', axis: ['Mon 21', 'Thu 24', 'Sun 27'] },
]

const DAYS = ['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27']

function bucketLabel(win, i) {
    if (win === '1h') return i === 11 ? 'last 5 min' : `${(11 - i) * 5} min ago`
    if (win === '24h') return i === 23 ? 'this hour' : `${23 - i} h ago`
    return `${DAYS[Math.floor(i / 2)]} · ${i % 2 === 0 ? 'morning' : 'evening'}`
}

const threads = [
    { id: 'tomato-blight', title: 'Balcony tomato blight — what actually worked?', forum: 'g/urban-gardening', base: [5, 38, 210], delta: [0.38, 1.24, 2.12] },
    { id: 'four-day-week', title: 'Six months into the four-day week: honest reports', forum: 'g/workplace', base: [9, 64, 380], delta: [-0.14, 0.46, 0.88] },
    { id: 'sourdough-fails', title: 'Show us your first sourdough fails', forum: 'g/bread-club', base: [6, 52, 300], delta: [0.21, -0.18, 0.35] },
    { id: 'candidate-qa', title: 'Council elections: candidate Q&A megathread', forum: 'g/civic-hall', base: [11, 72, 340], delta: [0.64, 0.92, 1.45] },
    { id: 'ebike-winter', title: 'E-bike batteries and winter storage', forum: 'g/commuters', base: [4, 30, 190], delta: [-0.26, -0.31, 0.12] },
    { id: 'rewilding-yard', title: 'Rewilding a 40 m² backyard, month by month', forum: 'g/nature-notes', base: [3, 26, 170], delta: [0.1, 0.27, -0.22] },
    { id: 'lefty-pens', title: 'Which fountain pen for left-handers?', forum: 'g/ink-and-nib', base: [4, 34, 220], delta: [-0.09, -0.44, -0.36] },
    { id: 'board-game-cafes', title: 'Board-game cafés worth the trip', forum: 'g/tabletop', base: [5, 41, 260], delta: [0.16, 0.06, -0.48] },
]

function makeSeries(seed, n, base, delta) {
    let s = seed
    const rand = () => {
        s = (s * 16807) % 2147483647
        return s / 2147483647
    }
    const end = base * (1 + delta)
    return Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1)
        const eased = t * t * (3 - 2 * t)
        const value = base + (end - base) * eased
        const wobble = i === 0 || i === n - 1 ? 0 : (rand() - 0.5) * 0.3 * Math.max(base, end)
        return Math.max(1, Math.round(value + wobble))
    })
}

const data = Object.fromEntries(
    threads.map((thread, ti) => [
        thread.id,
        Object.fromEntries(
            windows.map((win, wi) => {
                const series = makeSeries(ti * 971 + wi * 131 + 17, win.points, thread.base[wi], thread.delta[wi])
                const pct = Math.round((series[series.length - 1] / series[0] - 1) * 100)
                const total = series.reduce((sum, v) => sum + v, 0)
                return [win.id, { series, pct, total }]
            }),
        ),
    ]),
)

function smoothPath(points) {
    return points.reduce((d, [x, y], i, arr) => {
        if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`
        const [x0, y0] = arr[i - 1]
        const cx = ((x0 + x) / 2).toFixed(1)
        return `${d} C${cx},${y0.toFixed(1)} ${cx},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`
    }, '')
}

function niceMax(max) {
    const mag = 10 ** Math.floor(Math.log10(max))
    const step = mag / 2
    return Math.ceil((max * 1.1) / step) * step
}

const formatPct = (pct) => `${pct >= 0 ? '+' : '−'}${Math.abs(pct)}%`

function Sparkline({ series, up }) {
    const w = 96
    const h = 32
    const max = Math.max(...series)
    const min = Math.min(...series)
    const pts = series.map((v, i) => [2 + (i * (w - 4)) / (series.length - 1), 3 + (1 - (v - min) / (max - min || 1)) * (h - 6)])
    const last = pts[pts.length - 1]
    return (
        <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} className="h-8 w-20 shrink-0 sm:w-24">
            <path d={smoothPath(pts)} fill="none" stroke={up ? UP : DOWN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={last[0]} cy={last[1]} r="2.5" fill={up ? UP : DOWN} />
        </svg>
    )
}

function Delta({ pct, className }) {
    const up = pct >= 0
    const Icon = up ? HiArrowUpRight : HiArrowDownRight
    return (
        <span className={cn('inline-flex items-center gap-0.5 font-semibold tabular-nums', className)} style={{ color: up ? UP : DOWN }}>
            <Icon aria-hidden="true" className="size-4" />
            <span className="sr-only">{up ? 'rising' : 'cooling'}</span>
            {formatPct(pct)}
        </span>
    )
}

const CW = 640
const CH = 250
const PAD = { l: 40, r: 14, t: 18, b: 30 }

export function MomentumSparkTrendingTopics({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const uid = useId()
    const gradId = `agora${uid.replace(/[^a-zA-Z0-9_-]/g, '')}`
    const svgRef = useRef(null)
    const [win, setWin] = useState('24h')
    const [filter, setFilter] = useState('all')
    const [selected, setSelected] = useState('tomato-blight')
    const [cursor, setCursor] = useState(null)

    const winMeta = windows.find((w) => w.id === win)
    const ranked = [...threads].sort((a, b) => data[b.id][win].pct - data[a.id][win].pct)
    const list = ranked.filter((t) => (filter === 'all' ? true : filter === 'rising' ? data[t.id][win].pct >= 0 : data[t.id][win].pct < 0))
    const risingCount = ranked.filter((t) => data[t.id][win].pct >= 0).length
    const totalReplies = threads.reduce((sum, t) => sum + data[t.id][win].total, 0)
    const fastest = ranked[0]

    const thread = threads.find((t) => t.id === selected)
    const current = data[selected][win]
    const up = current.pct >= 0
    const color = up ? UP : DOWN
    const top = niceMax(Math.max(...current.series))
    const x = (i) => PAD.l + (i * (CW - PAD.l - PAD.r)) / (current.series.length - 1)
    const y = (v) => PAD.t + (1 - v / top) * (CH - PAD.t - PAD.b)
    const pts = current.series.map((v, i) => [x(i), y(v)])
    const line = smoothPath(pts)
    const area = `${line} L${x(current.series.length - 1).toFixed(1)},${CH - PAD.b} L${PAD.l},${CH - PAD.b} Z`
    const peakIndex = current.series.indexOf(Math.max(...current.series))
    const cursorIndex = cursor === null ? null : Math.min(cursor, current.series.length - 1)

    const changeWindow = (id) => {
        setWin(id)
        setCursor(null)
    }

    const onPointerMove = (e) => {
        const rect = svgRef.current?.getBoundingClientRect()
        if (!rect) return
        const vx = ((e.clientX - rect.left) / rect.width) * CW
        const ratio = (vx - PAD.l) / (CW - PAD.l - PAD.r)
        setCursor(Math.max(0, Math.min(current.series.length - 1, Math.round(ratio * (current.series.length - 1)))))
    }

    const onChartKey = (e) => {
        const last = current.series.length - 1
        const keys = {
            ArrowRight: (c) => Math.min(last, (c ?? -1) + 1),
            ArrowLeft: (c) => Math.max(0, (c ?? last + 1) - 1),
            Home: () => 0,
            End: () => last,
        }
        if (keys[e.key]) {
            e.preventDefault()
            setCursor((c) => keys[e.key](c))
        } else if (e.key === 'Escape') {
            setCursor(null)
        }
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#fafafa] py-16 text-base font-normal text-[#1c1917] sm:py-20 lg:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 border-b border-[#e7e5e4] pb-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[#166534]">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                                <path d="M3 7.5 12 3l9 4.5v1H3z" fill="#166534" />
                                <path d="M5.5 10h2v8h-2zm5.5 0h2v8h-2zm5.5 0h2v8h-2zM3 19.5h18V21H3z" fill="#166534" />
                            </svg>
                            Agora Forums · Momentum
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-[#1c1917] sm:text-5xl lg:text-6xl">
                            Which conversations are <em className="text-[#166534]">gathering pace?</em>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#78716c]">Window</span>
                        <div role="tablist" aria-label="Time window" className="inline-flex self-start rounded-full border border-[#e7e5e4] bg-white p-1 shadow-sm">
                            {windows.map((w) => {
                                const active = win === w.id
                                return (
                                    <button
                                        key={w.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        className={cn(
                                            'relative min-h-10 min-w-16 rounded-full px-4 font-mono text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]',
                                            active ? 'text-white' : 'text-[#57534e] hover:text-[#1c1917]',
                                        )}
                                        onClick={() => changeWindow(w.id)}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId={`${uid}-window`}
                                                aria-hidden="true"
                                                className="absolute inset-0 rounded-full bg-[#166534]"
                                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                            />
                                        )}
                                        <span className="relative">{w.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <dl className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-[#e7e5e4] bg-[#e7e5e4] sm:grid-cols-3">
                    {[
                        { label: 'Direction', value: `${risingCount} rising · ${threads.length - risingCount} cooling` },
                        { label: `Replies in ${winMeta.long}`, value: totalReplies.toLocaleString('en-US') },
                        { label: 'Fastest climber', value: `${formatPct(data[fastest.id][win].pct)} · ${fastest.forum}` },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white px-5 py-4 sm:px-6">
                            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#78716c]">{stat.label}</dt>
                            <dd className="mt-1.5 truncate text-lg font-semibold tabular-nums text-[#1c1917]">{stat.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
                    <div className="min-w-0 rounded-3xl border border-[#e7e5e4] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(28,25,23,0.45)] sm:p-7 lg:sticky lg:top-6 lg:order-2 lg:self-start">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#166534]">{thread.forum}</p>
                                <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-[#1c1917] sm:text-3xl">{thread.title}</h3>
                            </div>
                            <div className="text-right">
                                <Delta pct={current.pct} className="text-3xl sm:text-4xl" />
                                <p className="mt-1 text-xs text-[#78716c]">in {winMeta.long}</p>
                            </div>
                        </div>

                        <div
                            tabIndex={0}
                            role="group"
                            aria-label={`Reply chart for ${thread.title}, ${winMeta.unit}. Use arrow keys to read values.`}
                            className="relative mt-6 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#166534]"
                            onKeyDown={onChartKey}
                            onBlur={() => setCursor(null)}
                        >
                            <svg
                                ref={svgRef}
                                viewBox={`0 0 ${CW} ${CH}`}
                                className="block h-auto w-full touch-pan-y"
                                onPointerMove={onPointerMove}
                                onPointerLeave={() => setCursor(null)}
                            >
                                <defs>
                                    <linearGradient id={`${gradId}-area`} x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {[0, 0.5, 1].map((f) => (
                                    <g key={f}>
                                        <line x1={PAD.l} x2={CW - PAD.r} y1={y(top * f)} y2={y(top * f)} stroke="#e7e5e4" strokeDasharray={f === 0 ? undefined : '3 5'} />
                                        <text x={PAD.l - 8} y={y(top * f) + 4} textAnchor="end" fontSize="11" fill="#78716c" className="font-mono">
                                            {Math.round(top * f)}
                                        </text>
                                    </g>
                                ))}
                                {winMeta.axis.map((label, i) => (
                                    <text
                                        key={label}
                                        x={i === 0 ? PAD.l : i === 1 ? (PAD.l + CW - PAD.r) / 2 : CW - PAD.r}
                                        y={CH - 8}
                                        textAnchor={i === 0 ? 'start' : i === 1 ? 'middle' : 'end'}
                                        fontSize="11"
                                        fill="#78716c"
                                        className="font-mono"
                                    >
                                        {label}
                                    </text>
                                ))}
                                <AnimatePresence initial={false} mode="wait">
                                    <motion.g
                                        key={`${selected}-${win}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: reduce ? 0 : 0.2 }}
                                    >
                                        <path d={area} fill={`url(#${gradId}-area)`} />
                                        <motion.path
                                            d={line}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={reduce ? false : { pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                        <circle cx={pts[peakIndex][0]} cy={pts[peakIndex][1]} r="4" fill="#ffffff" stroke={color} strokeWidth="2" />
                                        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="5" fill={color} stroke="#ffffff" strokeWidth="2" />
                                    </motion.g>
                                </AnimatePresence>
                                {cursorIndex !== null && (
                                    <g aria-hidden="true">
                                        <line x1={pts[cursorIndex][0]} x2={pts[cursorIndex][0]} y1={PAD.t} y2={CH - PAD.b} stroke="#1c1917" strokeOpacity="0.35" strokeDasharray="2 4" />
                                        <circle cx={pts[cursorIndex][0]} cy={pts[cursorIndex][1]} r="6" fill={color} stroke="#ffffff" strokeWidth="2.5" />
                                    </g>
                                )}
                                <rect x={PAD.l} y={PAD.t} width={CW - PAD.l - PAD.r} height={CH - PAD.t - PAD.b} fill="transparent" />
                            </svg>

                            {cursorIndex !== null && (
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute z-10 w-max rounded-xl bg-[#1c1917] px-3 py-2 text-xs text-white shadow-lg"
                                    style={{
                                        left: `${(pts[cursorIndex][0] / CW) * 100}%`,
                                        top: `${(pts[cursorIndex][1] / CH) * 100}%`,
                                        transform: `translate(${pts[cursorIndex][0] / CW > 0.75 ? '-100%' : pts[cursorIndex][0] / CW < 0.25 ? '0%' : '-50%'}, calc(-100% - 14px))`,
                                    }}
                                >
                                    <span className="block font-semibold tabular-nums">{current.series[cursorIndex]} replies</span>
                                    <span className="block text-[#d6d3d1]">{bucketLabel(win, cursorIndex)}</span>
                                </div>
                            )}
                        </div>
                        <p aria-live="polite" className="sr-only">
                            {cursorIndex !== null ? `${current.series[cursorIndex]} replies, ${bucketLabel(win, cursorIndex)}` : ''}
                        </p>

                        <div className="mt-5 flex flex-col gap-4 border-t border-[#e7e5e4] pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="flex items-center gap-2 text-sm text-[#57534e]">
                                <HiOutlineChatBubbleLeftRight aria-hidden="true" className="size-4 text-[#166534]" />
                                <span>
                                    <strong className="font-semibold tabular-nums text-[#1c1917]">{current.total.toLocaleString('en-US')}</strong> replies ·
                                    peak {current.series[peakIndex]} {bucketLabel(win, peakIndex)}
                                </span>
                            </p>
                            <a
                                href={`#agora-thread-${thread.id}`}
                                className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-[#166534] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#14532d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534] sm:self-auto"
                            >
                                Open thread
                                <HiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </a>
                        </div>
                    </div>

                    <div className="min-w-0 lg:order-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#78716c]">Ranked by momentum</p>
                            <div role="group" aria-label="Filter threads" className="flex gap-1.5">
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'rising', label: 'Rising' },
                                    { id: 'cooling', label: 'Cooling' },
                                ].map((chip) => (
                                    <button
                                        key={chip.id}
                                        type="button"
                                        aria-pressed={filter === chip.id}
                                        className={cn(
                                            'min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]',
                                            filter === chip.id
                                                ? 'border-[#1c1917] bg-[#1c1917] text-white'
                                                : 'border-[#e7e5e4] bg-white text-[#57534e] hover:border-[#a8a29e]',
                                        )}
                                        onClick={() => setFilter(chip.id)}
                                    >
                                        {chip.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ol className="mt-4 grid gap-2">
                            <AnimatePresence initial={false}>
                                {list.map((t) => {
                                    const d = data[t.id][win]
                                    const isSel = selected === t.id
                                    return (
                                        <motion.li
                                            key={t.id}
                                            layout={!reduce}
                                            initial={reduce ? false : { opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.15 } }}
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <button
                                                type="button"
                                                aria-pressed={isSel}
                                                className={cn(
                                                    'relative grid w-full grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534] sm:grid-cols-[2rem_minmax(0,1fr)_auto_4.5rem]',
                                                    isSel ? 'border-[#166534]/40 bg-white shadow-sm' : 'border-transparent hover:border-[#e7e5e4] hover:bg-white',
                                                )}
                                                onClick={() => setSelected(t.id)}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={cn('absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#166534] transition-opacity', isSel ? 'opacity-100' : 'opacity-0')}
                                                />
                                                <span className="font-mono text-sm tabular-nums text-[#a8a29e]">
                                                    {String(ranked.indexOf(t) + 1).padStart(2, '0')}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#78716c]">{t.forum}</span>
                                                    <span className="mt-0.5 block text-[15px] font-semibold leading-snug text-[#1c1917]">{t.title}</span>
                                                </span>
                                                <span className="col-start-2 flex items-center justify-between gap-3 sm:col-start-auto sm:contents">
                                                    <Sparkline series={d.series} up={d.pct >= 0} />
                                                    <Delta pct={d.pct} className="justify-end text-sm" />
                                                </span>
                                            </button>
                                        </motion.li>
                                    )
                                })}
                            </AnimatePresence>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MomentumSparkTrendingTopics

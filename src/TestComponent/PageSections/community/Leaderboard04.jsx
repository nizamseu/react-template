// StreakHeatmapLeaderboard

// Leaderboard04 · Social Networks & Communities › Leaderboard / Badges

// Description:
// A developer-community streak board for the fictional coding club Codecircle. Under the
// heading "Keep the streak alive." a 52 × 7 contribution heatmap covers 28 Sep 2025 – 26 Sep
// 2026 with a per-day tooltip, four stat tiles (current streak, longest streak, contributions,
// best day) and a "Friends" ranking you can sort by streak or yearly total and click to view
// anyone’s year. Use it on a profile, a community dashboard or a habit-building page.

// Design:
// - Ink #0d1117 section, panels #121821 with #263040 borders and rounded-2xl corners, text
//   #e2e8f0 / #8a94a6, mono labels and tabular numbers; accent green #4be381
// - Sequential green scale for the heatmap: #1a212b (none), #0f4a2c, #16703f, #22a355,
//   #4be381 (10+), with a Less → More legend; the active cell gets a white 1.5px outline
// - Heatmap is one inline SVG (12px cells, 3px gaps, month and Mon/Wed/Fri labels) inside a
//   horizontal scroller that starts scrolled to the most recent weeks on small screens
// - Motion: the ranking re-orders with layout animation and a sliding sort pill; the heatmap
//   cells cross-fade when you switch person — all instant for reduced motion
// - Responsive: stat tiles 2 → sm:4 columns; heatmap scrolls sideways below ~720px; the
//   friends panel sits in a 20rem column on lg and below the heatmap otherwise

// What it does:
// - Hovering a cell, or focusing the heatmap and using ← → ↑ ↓ / Home / End, shows a tooltip
//   such as "7 contributions · Tue 14 Jul 2026" and reads it out via aria-live
// - Friends rows (aria-pressed) switch the heatmap and stat tiles to that person; the header
//   line reports your rank among friends ("#3 of 6 by current streak")
// - "Streak / This year" tabs re-sort the friends list; each row shows a 12-week mini bar chart
// - All data is generated deterministically from fixed seeds and a fixed end date, so server
//   and client render the same; "Invite a friend" links to #codecircle-invite

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StreakHeatmapLeaderboard from '@/TestComponent/PageSections/community/Leaderboard04';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <StreakHeatmapLeaderboard />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiFire, HiOutlineBolt, HiOutlineCalendarDays, HiOutlineCodeBracket } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const DAY_MS = 86400000
const WEEKS = 52
const DAYS = WEEKS * 7
const END = Date.UTC(2026, 8, 26)
const START = END - (DAYS - 1) * DAY_MS
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SCALE = ['#1a212b', '#0f4a2c', '#16703f', '#22a355', '#4be381']

const CELL = 12
const STEP = 15
const LEFT = 30
const TOP = 18
const VW = LEFT + WEEKS * STEP
const VH = TOP + 7 * STEP

const dateOf = (i) => new Date(START + i * DAY_MS)
const dateLabel = (i) => {
    const d = dateOf(i)
    return `${DOW[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}
const levelOf = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4)

function generate(seed, activity, streak) {
    let s = seed
    const rand = () => {
        s = (s * 16807) % 2147483647
        return s / 2147483647
    }
    const days = Array.from({ length: DAYS }, (_, i) => {
        const dow = i % 7
        const weekend = dow === 0 || dow === 6
        const season = 0.72 + 0.28 * Math.sin(i / 37 + seed)
        const p = activity * season * (weekend ? 0.45 : 1)
        if (rand() > p) return 0
        return 1 + Math.floor(rand() ** 2 * 15)
    })
    for (let k = 0; k < streak; k += 1) {
        if (days[DAYS - 1 - k] === 0) days[DAYS - 1 - k] = 1 + Math.floor(rand() * 5)
    }
    days[DAYS - 1 - streak] = 0
    return days
}

function stats(days) {
    let current = 0
    for (let i = days.length - 1; i >= 0 && days[i] > 0; i -= 1) current += 1
    let longest = 0
    let run = 0
    days.forEach((n) => {
        run = n > 0 ? run + 1 : 0
        longest = Math.max(longest, run)
    })
    const total = days.reduce((sum, n) => sum + n, 0)
    const best = days.indexOf(Math.max(...days))
    const weekly = Array.from({ length: 12 }, (_, w) => days.slice(DAYS - (12 - w) * 7, DAYS - (11 - w) * 7).reduce((a, b) => a + b, 0))
    return { current, longest, total, best, bestCount: days[best], weekly }
}

const people = [
    { id: 'you', name: 'Devon Kim', handle: 'devon.k', photo: '1570295999919-56ceb5ecca61', seed: 11, activity: 0.62, streak: 23, you: true },
    { id: 'mira', name: 'Mira Chen', handle: 'mirac', photo: '1487412720507-e7ab37603c6f', seed: 29, activity: 0.72, streak: 41 },
    { id: 'sam', name: 'Sam Otieno', handle: 'samo', photo: '1506277886164-e25aa3f4ef7f', seed: 47, activity: 0.5, streak: 17 },
    { id: 'lucia', name: 'Lucía Paredes', handle: 'luciap', photo: '1502685104226-ee32379fefbe', seed: 63, activity: 0.58, streak: 9 },
    { id: 'arjun', name: 'Arjun Mehta', handle: 'arjun.m', photo: '1599566150163-29194dcaad36', seed: 81, activity: 0.8, streak: 56 },
    { id: 'hana', name: 'Hana Kobayashi', handle: 'hana.k', photo: '1554151228-14d9def656e4', seed: 97, activity: 0.42, streak: 4 },
].map((p) => {
    const days = generate(p.seed, p.activity, p.streak)
    return { ...p, days, ...stats(days) }
})

const monthStarts = []
for (let w = 0; w < WEEKS; w += 1) {
    const m = dateOf(w * 7).getUTCMonth()
    const prev = w === 0 ? null : dateOf((w - 1) * 7).getUTCMonth()
    if (m !== prev && w < WEEKS - 2) monthStarts.push({ w, label: MONTHS[m] })
}
const monthLabels = monthStarts.filter((m, i) => !monthStarts[i + 1] || monthStarts[i + 1].w - m.w >= 3)

const portrait = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`
const fmt = (n) => n.toLocaleString('en-US')

function MiniBars({ weekly }) {
    const max = Math.max(...weekly, 1)
    return (
        <svg aria-hidden="true" viewBox="0 0 60 20" className="h-5 w-14 shrink-0">
            {weekly.map((v, i) => {
                const h = Math.max(1.5, (v / max) * 18)
                return <rect key={i} x={i * 5} y={20 - h} width="3.5" height={h} rx="1" fill={i === weekly.length - 1 ? '#4be381' : '#22a355'} opacity={0.45 + (i / weekly.length) * 0.55} />
            })}
        </svg>
    )
}

export function StreakHeatmapLeaderboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const uid = useId()
    const scrollerRef = useRef(null)
    const innerRef = useRef(null)
    const [viewing, setViewing] = useState('you')
    const [sortBy, setSortBy] = useState('streak')
    const [active, setActive] = useState(null)

    useEffect(() => {
        const el = scrollerRef.current
        if (el) el.scrollLeft = el.scrollWidth
    }, [])

    const person = people.find((p) => p.id === viewing)
    const byStreak = [...people].sort((a, b) => b.current - a.current)
    const ranking = sortBy === 'streak' ? byStreak : [...people].sort((a, b) => b.total - a.total)
    const myRank = byStreak.findIndex((p) => p.you) + 1
    const me = byStreak[myRank - 1]
    const ahead = byStreak[myRank - 2]
    const firstName = person.you ? 'Your' : `${person.name.split(' ')[0]}’s`

    const keepVisible = (i) => {
        const scroller = scrollerRef.current
        const inner = innerRef.current
        if (!scroller || !inner) return
        const px = ((LEFT + Math.floor(i / 7) * STEP) / VW) * inner.clientWidth
        if (px < scroller.scrollLeft + 24) scroller.scrollLeft = px - 48
        else if (px > scroller.scrollLeft + scroller.clientWidth - 24) scroller.scrollLeft = px - scroller.clientWidth + 64
    }

    const onKeyDown = (e) => {
        const moves = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 }
        let next = null
        if (e.key in moves) next = (active ?? DAYS - 1) + moves[e.key]
        if (e.key === 'Home') next = 0
        if (e.key === 'End') next = DAYS - 1
        if (e.key === 'Escape') {
            setActive(null)
            return
        }
        if (next === null) return
        e.preventDefault()
        const clamped = Math.max(0, Math.min(DAYS - 1, next))
        setActive(clamped)
        keepVisible(clamped)
    }

    const tip = active === null ? null : { i: active, x: LEFT + Math.floor(active / 7) * STEP, y: TOP + (active % 7) * STEP }
    const tipText = tip ? `${person.days[tip.i] === 0 ? 'No' : person.days[tip.i]} contribution${person.days[tip.i] === 1 ? '' : 's'} · ${dateLabel(tip.i)}` : ''
    const tipAlign = tip ? (tip.x / VW < 0.15 ? '-10%' : tip.x / VW > 0.85 ? '-90%' : '-50%') : '-50%'

    const tiles = [
        { label: 'Current streak', value: `${person.current} days`, Icon: HiFire, accent: true },
        { label: 'Longest streak', value: `${person.longest} days`, Icon: HiOutlineBolt },
        { label: 'Contributions', value: fmt(person.total), Icon: HiOutlineCodeBracket },
        { label: 'Best day', value: `${person.bestCount} · ${dateLabel(person.best).slice(4, -5)}`, Icon: HiOutlineCalendarDays },
    ]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0d1117] py-16 text-base font-normal text-[#e2e8f0] sm:py-20 lg:py-24', className)}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-[#22a355]/15 blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#8a94a6]">
                            <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-full border border-[#4be381]/50 text-[#4be381]">
                                <HiOutlineCodeBracket className="size-4" />
                            </span>
                            Codecircle · friends board
                        </p>
                        <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Keep the streak <span className="font-mono text-[#4be381]">alive.</span>
                        </h2>
                        <p className="mt-4 font-mono text-sm text-[#8a94a6]">
                            You’re <strong className="font-semibold text-white">#{myRank} of {people.length}</strong> friends by current
                            streak
                            {ahead && (
                                <>
                                    {' '}
                                    · {ahead.name.split(' ')[0]} is{' '}
                                    <span className="text-[#4be381]">{ahead.current - me.current} days</span> ahead
                                </>
                            )}
                        </p>
                    </div>
                    <a
                        href="#codecircle-invite"
                        className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[#263040] bg-[#121821] px-5 font-mono text-sm font-semibold text-white transition-colors hover:border-[#4be381] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4be381] lg:self-auto"
                    >
                        Invite a friend
                        <HiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </a>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="min-w-0 rounded-2xl border border-[#263040] bg-[#121821] p-4 sm:p-6">
                        <div className="flex items-center gap-3">
                            <img src={portrait(person.photo)} alt="" className="size-10 rounded-full object-cover ring-2 ring-[#263040]" />
                            <div className="min-w-0">
                                <h3 className="truncate text-lg font-semibold text-white">{firstName} year in code</h3>
                                <p className="truncate font-mono text-xs text-[#8a94a6]">
                                    @{person.handle} · 28 Sep 2025 – 26 Sep 2026
                                </p>
                            </div>
                        </div>

                        <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                            {tiles.map(({ label, value, Icon, accent }) => (
                                <div key={label} className="rounded-xl border border-[#263040] bg-[#0d1117] px-3 py-3 sm:px-4">
                                    <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#8a94a6]">
                                        <Icon aria-hidden="true" className={cn('size-3.5', accent ? 'text-[#f97316]' : 'text-[#4be381]')} />
                                        {label}
                                    </dt>
                                    <dd className="mt-1.5 truncate text-lg font-semibold tabular-nums text-white sm:text-xl">{value}</dd>
                                </div>
                            ))}
                        </dl>

                        <div ref={scrollerRef} className="mt-6 overflow-x-auto pb-2">
                            <div
                                ref={innerRef}
                                role="group"
                                tabIndex={0}
                                aria-label={`${firstName} contribution heatmap. Use arrow keys to move between days.`}
                                aria-describedby={`${uid}-tip`}
                                className="relative min-w-[720px] rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4be381]"
                                onKeyDown={onKeyDown}
                                onFocus={() => setActive((a) => a ?? DAYS - 1)}
                                onBlur={() => setActive(null)}
                                onMouseLeave={() => setActive(null)}
                            >
                                <svg viewBox={`0 0 ${VW} ${VH}`} className="block h-auto w-full">
                                    {monthLabels.map((m) => (
                                        <text key={`${m.label}-${m.w}`} x={LEFT + m.w * STEP} y="11" fontSize="10" fill="#8a94a6" className="font-mono">
                                            {m.label}
                                        </text>
                                    ))}
                                    {[1, 3, 5].map((r) => (
                                        <text key={r} x="0" y={TOP + r * STEP + 10} fontSize="10" fill="#8a94a6" className="font-mono">
                                            {DOW[r]}
                                        </text>
                                    ))}
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.g
                                            key={person.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: reduce ? 0 : 0.18 }}
                                        >
                                            {person.days.map((n, i) => (
                                                <rect
                                                    key={i}
                                                    x={LEFT + Math.floor(i / 7) * STEP}
                                                    y={TOP + (i % 7) * STEP}
                                                    width={CELL}
                                                    height={CELL}
                                                    rx="2.5"
                                                    fill={SCALE[levelOf(n)]}
                                                    onMouseEnter={() => setActive(i)}
                                                />
                                            ))}
                                        </motion.g>
                                    </AnimatePresence>
                                    {tip && (
                                        <rect
                                            aria-hidden="true"
                                            x={tip.x - 1.5}
                                            y={tip.y - 1.5}
                                            width={CELL + 3}
                                            height={CELL + 3}
                                            rx="3.5"
                                            fill="none"
                                            stroke="#ffffff"
                                            strokeWidth="1.5"
                                            pointerEvents="none"
                                        />
                                    )}
                                </svg>
                                {tip && (
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute z-10 w-max rounded-lg border border-[#263040] bg-[#1c2430] px-2.5 py-1.5 font-mono text-xs text-white shadow-[0_12px_24px_-8px_rgba(0,0,0,0.7)]"
                                        style={{
                                            left: `${((tip.x + CELL / 2) / VW) * 100}%`,
                                            top: `${(tip.y / VH) * 100}%`,
                                            transform: `translate(${tipAlign}, calc(-100% - 8px))`,
                                        }}
                                    >
                                        {tipText}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p id={`${uid}-tip`} aria-live="polite" className="sr-only">
                            {tipText}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-[#8a94a6]">
                            <span>{fmt(person.total)} contributions in the last year</span>
                            <span className="flex items-center gap-1.5">
                                Less
                                {SCALE.map((c) => (
                                    <span key={c} aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: c }} />
                                ))}
                                More
                            </span>
                        </div>
                    </div>

                    <aside aria-label="Friends ranking" className="rounded-2xl border border-[#263040] bg-[#121821] p-4 sm:p-5 lg:self-start">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Friends</h3>
                            <div role="tablist" aria-label="Sort friends" className="inline-flex rounded-full border border-[#263040] bg-[#0d1117] p-1">
                                {[
                                    { id: 'streak', label: 'Streak' },
                                    { id: 'total', label: 'This year' },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={sortBy === t.id}
                                        className={cn(
                                            'relative min-h-10 rounded-full px-3 font-mono text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4be381]',
                                            sortBy === t.id ? 'text-[#0d1117]' : 'text-[#8a94a6] hover:text-white',
                                        )}
                                        onClick={() => setSortBy(t.id)}
                                    >
                                        {sortBy === t.id && (
                                            <motion.span
                                                layoutId={`${uid}-sort`}
                                                aria-hidden="true"
                                                className="absolute inset-0 rounded-full bg-[#4be381]"
                                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                            />
                                        )}
                                        <span className="relative">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ol className="mt-4 grid gap-1.5">
                            {ranking.map((p, i) => (
                                <motion.li key={p.id} layout={!reduce} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
                                    <button
                                        type="button"
                                        aria-pressed={viewing === p.id}
                                        aria-current={p.you ? 'true' : undefined}
                                        className={cn(
                                            'flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4be381]',
                                            viewing === p.id ? 'border-[#4be381]/60 bg-[#4be381]/10' : 'border-transparent hover:bg-white/[0.04]',
                                        )}
                                        onClick={() => setViewing(p.id)}
                                    >
                                        <span className={cn('w-5 font-mono text-sm font-semibold tabular-nums', i === 0 ? 'text-[#4be381]' : 'text-[#8a94a6]')}>{i + 1}</span>
                                        <img src={portrait(p.photo)} alt="" loading="lazy" className="size-9 shrink-0 rounded-full object-cover" />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-white">
                                                {p.name}
                                                {p.you && <span className="ml-1.5 rounded bg-[#4be381] px-1 py-px font-mono text-[9px] font-bold uppercase text-[#0d1117]">you</span>}
                                            </span>
                                            <span className="flex items-center gap-1 font-mono text-[11px] text-[#8a94a6]">
                                                {sortBy === 'streak' ? (
                                                    <>
                                                        <HiFire aria-hidden="true" className="size-3 text-[#f97316]" />
                                                        {p.current} day streak
                                                    </>
                                                ) : (
                                                    `${fmt(p.total)} this year`
                                                )}
                                            </span>
                                        </span>
                                        <MiniBars weekly={p.weekly} />
                                    </button>
                                </motion.li>
                            ))}
                        </ol>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default StreakHeatmapLeaderboard

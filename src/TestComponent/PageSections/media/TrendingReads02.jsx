// HeatSparkTrendingReads

// TrendingReads02 · Blogs & Digital Media › Popular / Trending Reads

// Description:
// A dark, data-desk style trending board for the tech newsroom Signal Wire. Under "What's
// running hot on the wire." each of eight stories gets a row with its section, headline,
// a 24-hour views sparkline, a ten-cell heat meter, a ▲/▼ rank movement and a live view
// count. Readers can re-sort by "Hottest", "Most viewed" or "Climbing" and pause the live
// counter. Use it on tech, finance or analytics-heavy publications.

// Design:
// - Near-black #0d1117 section, #161b22 row panels with #30363d hairlines, #e6edf3 text,
//   amber #fbbf24 for heat, sparklines, rises and the live dot; soft red #f87171 for falls
// - Sparklines are inline SVG (120×36) with an amber stroke, gradient area fill and an end
//   dot; heat is 10 cells ramping from #5c4410 to #fde68a with the score in mono (e.g. 94°)
// - Mono uppercase labels, tabular numerals, rounded-2xl rows that lift to #1c2430 and
//   brighten the sparkline on hover/focus
// - Rows reorder with framer-motion layout animation when the sort changes (off for reduced
//   motion); the live dot pings unless reduced motion is on
// - Responsive: on mobile each row stacks (headline, then sparkline + heat + views); from
//   lg rows become a 6-column table with a column header row

// What it does:
// - sort state ('hot' | 'views' | 'climb') is set by the aria-pressed segmented buttons;
//   rank numbers follow the current order
// - views start at fixed values for a stable server render; after mount a 2.5 s interval
//   adds a few hundred views to random stories until "Pause live" is pressed (cleared on
//   unmount); updated counts flash amber briefly
// - Headlines link to #wire-<slug>; "Open the full trending dashboard" links to
//   #signal-wire-trending; sparklines and heat meters are visual only (with sr-only text)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HeatSparkTrendingReads from '@/TestComponent/PageSections/media/TrendingReads02';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <HeatSparkTrendingReads />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiPause, HiPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

function makeSeries(seed, shape) {
    let s = seed
    const rand = () => {
        s = (s * 9301 + 49297) % 233280
        return s / 233280
    }
    return Array.from({ length: 24 }, (_, i) => {
        const t = i / 23
        let v = 0.5
        if (shape === 'rise') v = 0.12 + t * t * 0.82
        if (shape === 'fall') v = 0.92 - t * 0.68
        if (shape === 'spike') v = 0.18 + Math.exp(-((t - 0.62) ** 2) / 0.012) * 0.76
        if (shape === 'steady') v = 0.5 + Math.sin(t * 7) * 0.1
        if (shape === 'surge') v = t < 0.68 ? 0.1 + t * 0.12 : 0.18 + (t - 0.68) * 2.5
        return Math.max(0.05, Math.min(1, v + (rand() - 0.5) * 0.14))
    })
}

const stories = [
    { slug: 'chipmaker-no-poach-fine', section: 'Policy', title: 'EU fines two chipmakers €1.1bn over a secret “no-poach” pact', author: 'Lena Varga', age: '3h', heat: 94, views: 182400, move: 3, series: makeSeries(11, 'spike') },
    { slug: 'payment-terminal-outage', section: 'Infrastructure', title: 'Inside the 40-hour outage that froze a quarter of Europe’s card terminals', author: 'Marcus Ide', age: '9h', heat: 91, views: 241900, move: 0, series: makeSeries(23, 'fall') },
    { slug: 'maintainer-said-no', section: 'Open source', title: 'The maintainer who turned down a $30m acquisition, in her own words', author: 'Ruth Adeyemi', age: '5h', heat: 88, views: 96300, move: 7, series: makeSeries(37, 'rise') },
    { slug: 'solid-state-road-test', section: 'Energy', title: 'Solid-state cells pass 1,000 cycles in a road test, not a lab', author: 'Kenji Mori', age: '2h', heat: 84, views: 128700, move: 1, series: makeSeries(41, 'surge') },
    { slug: 'same-camera-sensor', section: 'Hardware', title: 'Why every phone launched this autumn uses the same camera sensor', author: 'Sofia Lind', age: '14h', heat: 77, views: 143200, move: -2, series: makeSeries(53, 'fall') },
    { slug: 'config-typo-flights', section: 'Infrastructure', title: 'One typo in a config file grounded 212 flights. We read the diff', author: 'Marcus Ide', age: '1h', heat: 73, views: 88050, move: null, series: makeSeries(67, 'surge') },
    { slug: 'satellite-cheaper-than-fibre', section: 'Telecom', title: 'Satellite broadband now undercuts fibre in nine US states', author: 'Dev Patel', age: '20h', heat: 69, views: 64900, move: -4, series: makeSeries(71, 'steady') },
    { slug: 'passkeys-half-of-logins', section: 'Security', title: 'The quiet death of the password: passkeys pass 50% of sign-ins', author: 'Ruth Adeyemi', age: '11h', heat: 65, views: 112600, move: -1, series: makeSeries(89, 'fall') },
]

const sorts = [
    { id: 'hot', label: 'Hottest' },
    { id: 'views', label: 'Most viewed' },
    { id: 'climb', label: 'Climbing' },
]

const heatCells = ['#5c4410', '#6f5212', '#836115', '#987118', '#ad811b', '#c3911e', '#d9a221', '#fbbf24', '#fcd34d', '#fde68a']

const W = 120
const H = 36

function sparkPaths(series) {
    const pts = series.map((v, i) => [(i / (series.length - 1)) * W, H - 3 - v * (H - 8)])
    const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
    const area = `${line} L${W} ${H} L0 ${H} Z`
    return { line, area, end: pts[pts.length - 1] }
}

const fmt = (n) => n.toLocaleString('en-US')

function Sparkline({ series, gradId }) {
    const { line, area, end } = useMemo(() => sparkPaths(series), [series])
    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-9 w-[120px] overflow-visible"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={area}
                fill={`url(#${gradId})`}
                className="opacity-50 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
            />
            <path
                d={line}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="opacity-70 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
            />
            <circle cx={end[0]} cy={end[1]} r="2.6" fill="#fbbf24" />
        </svg>
    )
}

function Movement({ move }) {
    if (move === null) {
        return (
            <span className="rounded-md bg-[#fbbf24] px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-[#0d1117]">
                NEW
            </span>
        )
    }
    if (move === 0) {
        return (
            <span className="font-mono text-sm text-[#8b949e]">
                <span aria-hidden="true">–</span>
                <span className="sr-only">No change</span>
            </span>
        )
    }
    const up = move > 0
    return (
        <span className={cn('font-mono text-sm font-bold tabular-nums', up ? 'text-[#fbbf24]' : 'text-[#f87171]')}>
            <span aria-hidden="true">{up ? '▲' : '▼'} {Math.abs(move)}</span>
            <span className="sr-only">{up ? `Up ${move} places` : `Down ${Math.abs(move)} places`}</span>
        </span>
    )
}

export function HeatSparkTrendingReads({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [sort, setSort] = useState('hot')
    const [live, setLive] = useState(true)
    const [views, setViews] = useState(() => Object.fromEntries(stories.map((s) => [s.slug, s.views])))
    const [flash, setFlash] = useState([])

    useEffect(() => {
        if (!live) return undefined
        const id = setInterval(() => {
            const picks = stories.filter(() => Math.random() < 0.45).map((s) => s.slug)
            if (!picks.length) return
            setViews((prev) => {
                const next = { ...prev }
                picks.forEach((slug) => {
                    next[slug] += 40 + Math.round(Math.random() * 420)
                })
                return next
            })
            setFlash(picks)
        }, 2500)
        return () => clearInterval(id)
    }, [live])

    useEffect(() => {
        if (!flash.length) return undefined
        const id = setTimeout(() => setFlash([]), 900)
        return () => clearTimeout(id)
    }, [flash])

    const ordered = useMemo(() => {
        const list = [...stories]
        if (sort === 'hot') list.sort((a, b) => b.heat - a.heat)
        if (sort === 'views') list.sort((a, b) => views[b.slug] - views[a.slug])
        if (sort === 'climb') list.sort((a, b) => (b.move ?? 99) - (a.move ?? 99))
        return list
    }, [sort, views])

    const totalViews = Object.values(views).reduce((sum, n) => sum + n, 0)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0d1117] px-4 py-16 text-base font-normal text-[#e6edf3] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 -top-40 size-[28rem] rounded-full bg-[#fbbf24]/10 blur-3xl"
            />
            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#8b949e]">
                            <span className="relative flex size-2.5" aria-hidden="true">
                                {live && !reduceMotion && (
                                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#fbbf24] opacity-60" />
                                )}
                                <span
                                    className={cn(
                                        'relative inline-flex size-2.5 rounded-full',
                                        live ? 'bg-[#fbbf24]' : 'bg-[#8b949e]',
                                    )}
                                />
                            </span>
                            <span>
                                <span className="text-[#fbbf24]">Signal Wire</span> · Trending desk ·{' '}
                                {live ? 'Live' : 'Paused'}
                            </span>
                        </p>
                        <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-[#f0f6fc] sm:text-5xl lg:text-6xl">
                            What’s running hot on the wire.
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#8b949e] sm:text-base">
                            Views per hour over the last 24 hours. Heat blends reading velocity, shares and
                            time on page.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div
                            role="group"
                            aria-label="Sort stories"
                            className="grid grid-cols-3 rounded-xl border border-[#30363d] bg-[#161b22] p-1"
                        >
                            {sorts.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    aria-pressed={sort === s.id}
                                    className={cn(
                                        'min-h-10 whitespace-nowrap rounded-lg px-3 font-mono text-xs font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fbbf24] sm:px-4',
                                        sort === s.id
                                            ? 'bg-[#fbbf24] text-[#0d1117]'
                                            : 'text-[#8b949e] hover:text-[#e6edf3]',
                                    )}
                                    onClick={() => setSort(s.id)}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            aria-pressed={!live}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#30363d] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#e6edf3] transition-colors hover:border-[#fbbf24]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fbbf24]"
                            onClick={() => setLive((v) => !v)}
                        >
                            {live ? (
                                <HiPause aria-hidden="true" className="size-4 text-[#fbbf24]" />
                            ) : (
                                <HiPlay aria-hidden="true" className="size-4 text-[#fbbf24]" />
                            )}
                            {live ? 'Pause live' : 'Resume live'}
                        </button>
                    </div>
                </div>

                <div
                    aria-hidden="true"
                    className="mt-12 hidden grid-cols-[3rem_1fr_120px_150px_110px_64px] items-center gap-6 px-5 pb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6e7681] lg:grid"
                >
                    <span>Rank</span>
                    <span>Story</span>
                    <span>Views · 24h</span>
                    <span>Heat</span>
                    <span className="text-right">Views</span>
                    <span className="text-right">Move</span>
                </div>

                <ol className="mt-10 space-y-2 lg:mt-0">
                    {ordered.map((story, index) => {
                        const flashing = flash.includes(story.slug)
                        const lit = Math.round(story.heat / 10)
                        return (
                            <motion.li
                                key={story.slug}
                                layout={reduceMotion ? false : 'position'}
                                transition={{ type: 'spring', stiffness: 380, damping: 38 }}
                                className="group relative rounded-2xl border border-[#30363d] bg-[#161b22] transition-colors duration-300 hover:border-[#fbbf24]/40 hover:bg-[#1c2430] focus-within:border-[#fbbf24]/40 focus-within:bg-[#1c2430]"
                            >
                                <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 gap-y-4 p-4 sm:p-5 lg:grid-cols-[3rem_1fr_120px_150px_110px_64px] lg:items-center lg:gap-6">
                                    <span className="font-mono text-2xl font-bold leading-none tabular-nums text-[#e6edf3] lg:text-3xl">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <div className="min-w-0">
                                        <p className="flex flex-wrap items-center gap-x-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8b949e]">
                                            <span className="text-[#fbbf24]">{story.section}</span>
                                            <span aria-hidden="true">/</span>
                                            <span>{story.author}</span>
                                            <span aria-hidden="true">/</span>
                                            <span>{story.age} ago</span>
                                        </p>
                                        <a
                                            href={`#wire-${story.slug}`}
                                            className="mt-1.5 block text-base font-semibold leading-snug text-[#f0f6fc] after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[#fbbf24] sm:text-lg"
                                        >
                                            {story.title}
                                        </a>
                                    </div>

                                    <div className="col-span-2 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-dashed border-[#30363d] pt-4 lg:contents">
                                        <div className="flex-1 basis-32 lg:flex-none">
                                            <Sparkline series={story.series} gradId={`${uid}-g-${story.slug}`} />
                                            <span className="sr-only">
                                                Views over 24 hours are{' '}
                                                {story.series[23] > story.series[0] ? 'rising' : 'falling'}.
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="flex gap-[3px]" aria-hidden="true">
                                                {heatCells.map((color, i) => (
                                                    <span
                                                        key={color}
                                                        className="h-4 w-[7px] rounded-[2px]"
                                                        style={{ backgroundColor: i < lit ? color : '#262c36' }}
                                                    />
                                                ))}
                                            </span>
                                            <span className="font-mono text-sm font-bold tabular-nums text-[#fbbf24]">
                                                {story.heat}°
                                                <span className="sr-only"> heat score</span>
                                            </span>
                                        </div>

                                        <p
                                            className={cn(
                                                'font-mono text-sm tabular-nums transition-colors duration-500 lg:text-right',
                                                flashing ? 'text-[#fbbf24]' : 'text-[#e6edf3]',
                                            )}
                                        >
                                            {fmt(views[story.slug])}
                                            <span className="ml-1 text-[10px] uppercase tracking-wider text-[#6e7681] lg:sr-only">
                                                views
                                            </span>
                                        </p>

                                        <div className="lg:text-right">
                                            <Movement move={story.move} />
                                        </div>
                                    </div>
                                </div>
                            </motion.li>
                        )
                    })}
                </ol>

                <div className="mt-8 flex flex-col gap-4 border-t border-[#30363d] pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8b949e] sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        <span className="tabular-nums text-[#e6edf3]">{fmt(totalViews)}</span> views across the top
                        eight · Sun 27 Sep
                    </p>
                    <a
                        href="#signal-wire-trending"
                        className="group inline-flex min-h-10 items-center gap-2 self-start font-bold text-[#fbbf24] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24] sm:self-auto"
                    >
                        Open the full trending dashboard
                        <HiArrowLongRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default HeatSparkTrendingReads

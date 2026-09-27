// BubbleClusterTrendingTopics

// TrendingTopics02 · Social Networks & Communities › Trending Topics / Hashtags

// Description:
// A night-mode "live trend map" for the fictional audio-room community Pulseroom. Under the
// heading "Tonight, the room is loud about…" eighteen hashtags float as a packed cluster of
// SVG bubbles sized by post volume and coloured by category (Music, Tech, Food, Gaming,
// Sports, Film). Hovering or focusing a bubble shows a tooltip; clicking it opens a detail
// card with stats, a sample post, Follow and "Open the pulse". Use it on an explore or
// discovery page where the shape of the conversation matters more than a plain list.

// Design:
// - Deep navy #0b1020 with a faint 22px dot grid and two blurred colour glows; ink #f8fafc,
//   muted #94a3b8, hairlines white/10; panels rounded-[1.75rem] with white/[0.03] fills
// - Category hues (validated for dark mode + colour-blind separation): #e0439a, #0ea5c6,
//   #c98009, #8b5cf6, #5fa40f, #3b82f6 as radial gradients; every bubble is direct-labelled
//   when large enough, and a legend plus a list view mean colour never carries identity alone
// - Circles are packed once at module load (greedy tangent placement, radius ∝ √volume)
//   into two layouts: 760×480 for sm+ and a taller 340×520 for phones
// - Bubbles bob gently (framer-motion, staggered 4–7 s loops); the selected bubble gets a
//   slowly rotating dashed orbit; the detail card cross-fades — all static for reduced motion
// - Responsive: header and legend stack on mobile; the map and the 22rem detail aside sit
//   side by side on lg and stack below; the list view is one column at every size

// What it does:
// - Hover or keyboard focus on a bubble (role="button", tabIndex 0) shows a tooltip with the
//   tag, category, posts and 24 h growth; Enter / Space / click selects it (aria-pressed)
// - Legend chips toggle categories on/off (aria-pressed); switched-off bubbles fade to 18%
// - "Map / List" tabs swap the bubble map for a ranked, bar-scaled list that also selects
// - The detail card shows the selected topic’s share of its category, live rooms, a sample
//   post, a Follow toggle and a link to #pulse-<topic-id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BubbleClusterTrendingTopics from '@/TestComponent/PageSections/community/TrendingTopics02';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <BubbleClusterTrendingTopics />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight, HiCheck, HiOutlineListBullet, HiOutlineSignal, HiOutlineSquares2X2, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const categories = [
    { id: 'music', label: 'Music', color: '#e0439a', light: '#f39ac9' },
    { id: 'tech', label: 'Tech', color: '#0ea5c6', light: '#7fdcf0' },
    { id: 'food', label: 'Food', color: '#c98009', light: '#f2c35e' },
    { id: 'gaming', label: 'Gaming', color: '#8b5cf6', light: '#c4b0fd' },
    { id: 'sports', label: 'Sports', color: '#5fa40f', light: '#b4e26c' },
    { id: 'film', label: 'Film', color: '#3b82f6', light: '#9cc2fb' },
]

const avatar = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

const topics = [
    { id: 'synthwave-sunday', tag: 'SynthwaveSunday', cat: 'music', volume: 184000, growth: 42, rooms: 38, author: 'nova.hz', photo: '1534528741775-53994a69daeb', post: 'Room 4 just hit 3,000 listeners for the all-analog set. The Juno solo at 01:12 is unreal.' },
    { id: 'retro-handhelds', tag: 'RetroHandhelds', cat: 'gaming', volume: 152000, growth: 18, rooms: 24, author: 'pixel.pia', photo: '1554151228-14d9def656e4', post: 'Modded a 2001 handheld with a backlit screen and a USB-C port. Ask me anything tonight.' },
    { id: 'ai-studio-tools', tag: 'AIStudioTools', cat: 'tech', volume: 139000, growth: 27, rooms: 19, author: 'devon.writes', photo: '1506794778202-cad84cf45f1d', post: 'Live teardown of the new stem-splitter: what it gets right, and where the vocals smear.' },
    { id: 'street-food-crawl', tag: 'StreetFoodCrawl', cat: 'food', volume: 121000, growth: 9, rooms: 15, author: 'mango.and.chili', photo: '1531123897727-8f129e1688ce', post: 'Nine stalls, four hours, one stomach. Voting on the best skewer closes at midnight.' },
    { id: 'derby-day', tag: 'DerbyDay', cat: 'sports', volume: 116000, growth: 64, rooms: 31, author: 'terrace.talk', photo: '1506277886164-e25aa3f4ef7f', post: 'Post-match room is open. That 89th-minute header deserves at least an hour of replays.' },
    { id: 'festival-lineups', tag: 'FestivalLineups', cat: 'music', volume: 98000, growth: 31, rooms: 17, author: 'lena.live', photo: '1517841905240-472988babdf9', post: 'Poster just dropped — three reunions and a headliner nobody saw coming.' },
    { id: 'speedrun-marathon', tag: 'SpeedrunMarathon', cat: 'gaming', volume: 87000, growth: 12, rooms: 11, author: 'framecount', photo: '1542909168-82c3e7fdca5c', post: 'Hour 31 of the charity marathon and we are $4,800 short of the next donation goal.' },
    { id: 'horror-season', tag: 'HorrorSeason', cat: 'film', volume: 81000, growth: 55, rooms: 14, author: 'midnight.reel', photo: '1524504388940-b1c1722653e1', post: 'Watch-along of the 1982 cult classic starts at 22:00. Lights off, cameras optional.' },
    { id: 'home-lab-setups', tag: 'HomeLabSetups', cat: 'tech', volume: 72000, growth: 6, rooms: 9, author: 'rack.rat', photo: '1599566150163-29194dcaad36', post: 'Shared my 3-node cluster that runs off a solar panel. Idle draw is 38 watts.' },
    { id: 'sourdough-science', tag: 'SourdoughScience', cat: 'food', volume: 64000, growth: -4, rooms: 6, author: 'crumb.shot', photo: '1580489944761-15a19d654956', post: 'Hydration at 78% vs 82%: same flour, same oven, very different crumb.' },
    { id: 'night-run-club', tag: 'NightRunClub', cat: 'sports', volume: 55000, growth: 21, rooms: 7, author: 'kmsandcoffee', photo: '1500648767791-00dcc994a43e', post: '10 km loop along the river, headlamps on. 64 of us showed up in the rain.' },
    { id: 'vinyl-finds', tag: 'VinylFinds', cat: 'music', volume: 47000, growth: 3, rooms: 5, author: 'dusty.grooves', photo: '1472099645785-5658abf4ff4e', post: 'Found a first pressing in the £2 bin. The sleeve smells like 1974.' },
    { id: 'indie-dev-logs', tag: 'IndieDevLogs', cat: 'gaming', volume: 41000, growth: 15, rooms: 8, author: 'tinytile', photo: '1488426862026-3ee34a7d66df', post: 'Day 212: the fishing minigame finally feels good. Showing it live at 21:30.' },
    { id: 'film-photo-friday', tag: 'FilmPhotoFriday', cat: 'film', volume: 36000, growth: 8, rooms: 4, author: 'grain.club', photo: '1546961329-78bef0414d7c', post: 'Portra vs. expired Gold 200 at golden hour — which roll wins?' },
    { id: 'keyboard-mods', tag: 'KeyboardMods', cat: 'tech', volume: 31000, growth: -2, rooms: 3, author: 'thock.theory', photo: '1566492031773-4f4e44671857', post: 'Tape mod vs. foam mod, recorded on the same mic. Headphones recommended.' },
    { id: 'matcha-everything', tag: 'MatchaEverything', cat: 'food', volume: 26000, growth: 11, rooms: 3, author: 'whisk.and.wander', photo: '1487412720507-e7ab37603c6f', post: 'Matcha tiramisu, step by step. The trick is a very cold whisk.' },
    { id: 'climbing-beta', tag: 'ClimbingBeta', cat: 'sports', volume: 21000, growth: 19, rooms: 2, author: 'crimp.queen', photo: '1502685104226-ee32379fefbe', post: 'Finally sent the V6 roof. The heel hook everyone skips is the whole problem.' },
    { id: 'score-composers', tag: 'ScoreComposers', cat: 'film', volume: 17000, growth: 24, rooms: 2, author: 'cue.sheet', photo: '1552058544-f2b08422138a', post: 'Breaking down the four-note motif that runs through the whole trilogy.' },
]

const catById = Object.fromEntries(categories.map((c) => [c.id, c]))
const catTotals = topics.reduce((acc, t) => ({ ...acc, [t.cat]: (acc[t.cat] || 0) + t.volume }), {})
const MAX_VOLUME = topics[0].volume

function packBubbles(width, height, fill, gap) {
    const total = topics.reduce((sum, t) => sum + t.volume, 0)
    const k = Math.sqrt((fill * width * height) / (Math.PI * total))
    const cx = width / 2
    const cy = height / 2
    const ax = width / Math.max(width, height)
    const ay = height / Math.max(width, height)
    const score = (x, y) => ((x - cx) / ax) ** 2 + ((y - cy) / ay) ** 2
    const placed = []
    const fits = (x, y, r) =>
        x - r >= 2 &&
        x + r <= width - 2 &&
        y - r >= 2 &&
        y + r <= height - 2 &&
        placed.every((p) => Math.hypot(p.x - x, p.y - y) >= p.r + r + gap - 0.01)

    topics.forEach((topic) => {
        const r = Math.max(14, k * Math.sqrt(topic.volume))
        if (!placed.length) {
            placed.push({ ...topic, r, x: cx, y: cy })
            return
        }
        const candidates = []
        placed.forEach((p) => {
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 18) {
                const d = p.r + r + gap
                candidates.push([p.x + Math.cos(a) * d, p.y + Math.sin(a) * d])
            }
        })
        for (let i = 0; i < placed.length; i += 1) {
            for (let j = i + 1; j < placed.length; j += 1) {
                const A = placed[i]
                const B = placed[j]
                const ra = A.r + r + gap
                const rb = B.r + r + gap
                const dx = B.x - A.x
                const dy = B.y - A.y
                const d = Math.hypot(dx, dy)
                if (d === 0 || d > ra + rb || d < Math.abs(ra - rb)) continue
                const a = (ra * ra - rb * rb + d * d) / (2 * d)
                const h = Math.sqrt(Math.max(0, ra * ra - a * a))
                const mx = A.x + (a * dx) / d
                const my = A.y + (a * dy) / d
                candidates.push([mx + (h * dy) / d, my - (h * dx) / d], [mx - (h * dy) / d, my + (h * dx) / d])
            }
        }
        let best = null
        let bestScore = Infinity
        candidates.forEach(([x, y]) => {
            if (!fits(x, y, r)) return
            const s = score(x, y)
            if (s < bestScore) {
                bestScore = s
                best = [x, y]
            }
        })
        if (best) placed.push({ ...topic, r, x: best[0], y: best[1] })
    })
    return placed
}

const WIDE = { key: 'wide', width: 760, height: 480, minFont: 10, bubbles: packBubbles(760, 480, 0.56, 5) }
const NARROW = { key: 'narrow', width: 340, height: 520, minFont: 8.5, bubbles: packBubbles(340, 520, 0.55, 4) }

const formatK = (n) => `${Math.round(n / 1000)}K`
const formatGrowth = (g) => `${g > 0 ? '+' : '−'}${Math.abs(g)}%`

function labelFont(bubble) {
    const text = `#${bubble.tag}`
    return Math.min(bubble.r / 3.2, (1.7 * bubble.r) / (text.length * 0.58))
}

function BubbleField({ layout, hovered, selected, off, reduce, gradId, onHover, onSelect, className }) {
    const tip = layout.bubbles.find((b) => b.id === hovered)
    const tipX = tip ? tip.x / layout.width : 0
    const tipShift = tipX < 0.22 ? '-12%' : tipX > 0.78 ? '-88%' : '-50%'

    return (
        <div className={cn('relative', className)}>
            <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="block h-auto w-full overflow-visible">
                <defs>
                    {categories.map((c) => (
                        <radialGradient key={c.id} id={`${gradId}-${layout.key}-${c.id}`} cx="34%" cy="28%" r="78%">
                            <stop offset="0%" stopColor={c.light} />
                            <stop offset="100%" stopColor={c.color} />
                        </radialGradient>
                    ))}
                </defs>
                {layout.bubbles.map((b, i) => {
                    const active = hovered === b.id
                    const isSelected = selected === b.id
                    const font = labelFont(b)
                    const showLabel = font >= layout.minFont
                    const cat = catById[b.cat]
                    return (
                        <g
                            key={b.id}
                            role="button"
                            tabIndex={0}
                            aria-pressed={isSelected}
                            aria-label={`#${b.tag}, ${cat.label}, ${formatK(b.volume)} posts, ${formatGrowth(b.growth)} today`}
                            className="cursor-pointer outline-none"
                            style={{ opacity: off.includes(b.cat) ? 0.18 : 1, transition: 'opacity 300ms ease' }}
                            onMouseEnter={() => onHover(b.id)}
                            onMouseLeave={() => onHover(null)}
                            onFocus={() => onHover(b.id)}
                            onBlur={() => onHover(null)}
                            onClick={() => onSelect(b.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    onSelect(b.id)
                                }
                            }}
                        >
                            <motion.g
                                animate={reduce ? { y: 0 } : { y: [0, -3.5, 0] }}
                                transition={reduce ? { duration: 0 } : { duration: 4 + (i % 5) * 0.75, repeat: Infinity, ease: 'easeInOut', delay: (i % 7) * 0.35 }}
                            >
                                {isSelected && (
                                    <motion.circle
                                        cx={b.x}
                                        cy={b.y}
                                        r={b.r + 7}
                                        fill="none"
                                        stroke="#f8fafc"
                                        strokeOpacity="0.75"
                                        strokeWidth="1.5"
                                        strokeDasharray="3 7"
                                        animate={reduce ? { rotate: 0 } : { rotate: 360 }}
                                        transition={reduce ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: 'linear' }}
                                    />
                                )}
                                <circle
                                    cx={b.x}
                                    cy={b.y}
                                    r={b.r}
                                    fill={`url(#${gradId}-${layout.key}-${b.cat})`}
                                    stroke={active || isSelected ? '#f8fafc' : '#0b1020'}
                                    strokeWidth={active || isSelected ? 2.5 : 2}
                                    style={{ transition: 'stroke 200ms ease' }}
                                />
                                {showLabel && (
                                    <text
                                        x={b.x}
                                        y={b.y}
                                        textAnchor="middle"
                                        fill="#ffffff"
                                        stroke="rgba(11,16,32,0.35)"
                                        strokeWidth="3"
                                        paintOrder="stroke"
                                        className="pointer-events-none select-none font-sans"
                                    >
                                        <tspan x={b.x} dy={-font * 0.15} fontSize={font} fontWeight="700">
                                            #{b.tag}
                                        </tspan>
                                        <tspan x={b.x} dy={font * 1.2} fontSize={font * 0.85} fontWeight="500" fillOpacity="0.85">
                                            {formatK(b.volume)}
                                        </tspan>
                                    </text>
                                )}
                            </motion.g>
                        </g>
                    )
                })}
            </svg>

            {tip && (
                <div
                    role="tooltip"
                    className="pointer-events-none absolute z-10 w-max max-w-[14rem] rounded-2xl border border-white/15 bg-[#141b33]/95 px-3.5 py-2.5 text-left shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur"
                    style={{
                        left: `${tipX * 100}%`,
                        top: `${((tip.y - tip.r) / layout.height) * 100}%`,
                        transform: `translate(${tipShift}, calc(-100% - 12px))`,
                    }}
                >
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                        <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: catById[tip.cat].color }} />
                        {catById[tip.cat].label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#f8fafc]">#{tip.tag}</p>
                    <p className="mt-0.5 text-xs text-[#cbd5e1]">
                        {formatK(tip.volume)} posts · {formatGrowth(tip.growth)} today
                    </p>
                </div>
            )}
        </div>
    )
}

export function BubbleClusterTrendingTopics({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const rawId = useId()
    const gradId = `pulse${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`
    const [hovered, setHovered] = useState(null)
    const [selected, setSelected] = useState('synthwave-sunday')
    const [off, setOff] = useState([])
    const [view, setView] = useState('map')
    const [followed, setFollowed] = useState([])

    const topic = topics.find((t) => t.id === selected)
    const cat = catById[topic.cat]
    const share = Math.round((topic.volume / catTotals[topic.cat]) * 100)
    const isFollowed = followed.includes(topic.id)

    const toggleCat = (id) => setOff((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
    const toggleFollow = () =>
        setFollowed((prev) => (prev.includes(topic.id) ? prev.filter((id) => id !== topic.id) : [...prev, topic.id]))

    const fieldProps = { hovered, selected, off, reduce, gradId, onHover: setHovered, onSelect: setSelected }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0b1020] py-16 text-base font-normal text-[#f8fafc] sm:py-20 lg:py-24', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:22px_22px]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 size-[28rem] rounded-full bg-[#e0439a]/20 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 size-[30rem] rounded-full bg-[#0ea5c6]/15 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#cbd5e1]">
                            <HiOutlineSignal aria-hidden="true" className="size-4 text-[#e0439a]" />
                            Pulseroom · live trend map
                        </p>
                        <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-tight text-[#f8fafc] sm:text-5xl lg:text-6xl">
                            Tonight, the room is{' '}
                            <span className="bg-gradient-to-r from-[#f39ac9] via-[#c4b0fd] to-[#7fdcf0] bg-clip-text text-transparent">
                                loud about…
                            </span>
                        </h2>
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-[#94a3b8]">
                            1.2M people across 238 live rooms. Bubble size is posts in the last 24 hours —
                            tap one to see what’s being said.
                        </p>
                    </div>

                    <div className="flex items-end gap-4 text-xs text-[#94a3b8]" aria-hidden="true">
                        <svg viewBox="0 0 120 64" className="h-16 w-28">
                            <circle cx="32" cy="32" r="30" fill="none" stroke="#94a3b8" strokeOpacity="0.6" strokeDasharray="3 4" />
                            <circle cx="32" cy="46" r="16" fill="none" stroke="#94a3b8" strokeOpacity="0.6" strokeDasharray="3 4" />
                            <text x="70" y="10" fill="#94a3b8" fontSize="10">180K</text>
                            <line x1="32" y1="2" x2="66" y2="7" stroke="#94a3b8" strokeOpacity="0.4" />
                            <text x="70" y="36" fill="#94a3b8" fontSize="10">50K</text>
                            <line x1="32" y1="30" x2="66" y2="33" stroke="#94a3b8" strokeOpacity="0.4" />
                        </svg>
                        <span className="pb-1 leading-tight">
                            Size = posts
                            <br />
                            in 24 hours
                        </span>
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Show or hide categories">
                    {categories.map((c) => {
                        const on = !off.includes(c.id)
                        return (
                            <button
                                key={c.id}
                                type="button"
                                aria-pressed={on}
                                className={cn(
                                    'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f8fafc]',
                                    on
                                        ? 'border-white/20 bg-white/10 text-[#f8fafc] hover:bg-white/15'
                                        : 'border-white/10 bg-transparent text-[#64748b] line-through hover:text-[#94a3b8]',
                                )}
                                onClick={() => toggleCat(c.id)}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn('size-2.5 rounded-full transition-opacity', !on && 'opacity-30')}
                                    style={{ backgroundColor: c.color }}
                                />
                                {c.label}
                            </button>
                        )
                    })}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="min-w-0 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-3 sm:p-5">
                        <div className="flex items-center justify-between gap-3 px-1 pb-3 sm:px-2">
                            <p className="text-sm font-semibold text-[#cbd5e1]">
                                <span className="tabular-nums text-[#f8fafc]">{topics.length}</span> topics trending
                            </p>
                            <div role="tablist" aria-label="Choose view" className="inline-flex rounded-full border border-white/10 bg-[#0b1020] p-1">
                                {[
                                    { id: 'map', label: 'Map', Icon: HiOutlineSquares2X2 },
                                    { id: 'list', label: 'List', Icon: HiOutlineListBullet },
                                ].map(({ id, label, Icon }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        role="tab"
                                        aria-selected={view === id}
                                        className={cn(
                                            'inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f8fafc]',
                                            view === id ? 'bg-[#f8fafc] text-[#0b1020]' : 'text-[#94a3b8] hover:text-[#f8fafc]',
                                        )}
                                        onClick={() => setView(id)}
                                    >
                                        <Icon aria-hidden="true" className="size-4" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {view === 'map' ? (
                            <div role="tabpanel" aria-label="Bubble map of trending topics">
                                <BubbleField layout={WIDE} className="hidden sm:block" {...fieldProps} />
                                <BubbleField layout={NARROW} className="sm:hidden" {...fieldProps} />
                            </div>
                        ) : (
                            <ol role="tabpanel" aria-label="Trending topics list" className="grid gap-1.5">
                                {topics.map((t, index) => {
                                    const c = catById[t.cat]
                                    const isSel = selected === t.id
                                    return (
                                        <li key={t.id} className={cn('transition-opacity', off.includes(t.cat) && 'opacity-30')}>
                                            <button
                                                type="button"
                                                aria-pressed={isSel}
                                                className={cn(
                                                    'grid min-h-12 w-full grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f8fafc]',
                                                    isSel ? 'bg-white/10' : 'hover:bg-white/5',
                                                )}
                                                onClick={() => setSelected(t.id)}
                                            >
                                                <span className="text-xs font-semibold tabular-nums text-[#64748b]">{String(index + 1).padStart(2, '0')}</span>
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-semibold text-[#f8fafc]">#{t.tag}</span>
                                                    <span aria-hidden="true" className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white/5">
                                                        <span
                                                            className="block h-full rounded-full"
                                                            style={{ width: `${(t.volume / MAX_VOLUME) * 100}%`, backgroundColor: c.color }}
                                                        />
                                                    </span>
                                                </span>
                                                <span className="text-right text-xs tabular-nums text-[#94a3b8]">
                                                    <span className="block font-semibold text-[#f8fafc]">{formatK(t.volume)}</span>
                                                    {c.label}
                                                </span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ol>
                        )}
                    </div>

                    <aside aria-label="Selected topic" aria-live="polite" className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 lg:self-start">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full opacity-40 blur-3xl transition-colors duration-500"
                            style={{ backgroundColor: cat.color }}
                        />
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={topic.id}
                                className="relative"
                                initial={reduce ? false : { opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -10 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#cbd5e1]">
                                    <span aria-hidden="true" className="size-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                    {cat.label}
                                </p>
                                <h3 className="mt-3 break-words text-2xl font-bold tracking-tight text-[#f8fafc] sm:text-3xl">#{topic.tag}</h3>

                                <dl className="mt-5 grid grid-cols-3 gap-2">
                                    {[
                                        { label: 'Posts', value: formatK(topic.volume) },
                                        { label: 'Today', value: formatGrowth(topic.growth) },
                                        { label: 'Rooms', value: topic.rooms },
                                    ].map((stat) => (
                                        <div key={stat.label} className="rounded-2xl bg-white/5 px-3 py-3">
                                            <dt className="text-[11px] font-medium uppercase tracking-wider text-[#94a3b8]">{stat.label}</dt>
                                            <dd className="mt-1 text-lg font-bold tabular-nums text-[#f8fafc]">{stat.value}</dd>
                                        </div>
                                    ))}
                                </dl>

                                <div className="mt-5">
                                    <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                                        <span>Share of {cat.label} talk</span>
                                        <span className="font-semibold tabular-nums text-[#f8fafc]">{share}%</span>
                                    </div>
                                    <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                                        <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: cat.color }} />
                                    </div>
                                </div>

                                <figure className="mt-5 rounded-2xl border border-white/10 bg-[#0b1020]/70 p-4">
                                    <figcaption className="flex items-center gap-3">
                                        <img
                                            src={avatar(topic.photo)}
                                            alt={`@${topic.author}`}
                                            loading="lazy"
                                            className="size-9 rounded-full object-cover ring-2 ring-white/15"
                                        />
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-semibold text-[#f8fafc]">@{topic.author}</span>
                                            <span className="block text-xs text-[#94a3b8]">hosting a room · 12 min ago</span>
                                        </span>
                                    </figcaption>
                                    <blockquote className="mt-3 text-sm leading-relaxed text-[#cbd5e1]">{topic.post}</blockquote>
                                </figure>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        aria-pressed={isFollowed}
                                        className={cn(
                                            'inline-flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f8fafc]',
                                            isFollowed ? 'bg-white/10 text-[#f8fafc] ring-1 ring-white/25' : 'bg-[#f8fafc] text-[#0b1020] hover:bg-white',
                                        )}
                                        onClick={toggleFollow}
                                    >
                                        {isFollowed ? <HiCheck aria-hidden="true" className="size-4" /> : <HiPlus aria-hidden="true" className="size-4" />}
                                        {isFollowed ? 'Following' : 'Follow'}
                                    </button>
                                    <a
                                        href={`#pulse-${topic.id}`}
                                        className="group inline-flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-4 text-sm font-semibold text-[#f8fafc] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f8fafc]"
                                    >
                                        Open the pulse
                                        <HiArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    </a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default BubbleClusterTrendingTopics

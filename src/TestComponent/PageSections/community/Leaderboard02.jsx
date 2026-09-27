// XpLevelLeaderboard

// Leaderboard02 · Social Networks & Communities › Leaderboard / Badges

// Description:
// A neon, season-ladder leaderboard for the fictional gaming community Pixelhaven. A profile
// card for "Kat Moreno · kaiju_kat" shows a hex portrait, level badge, segmented XP bar and
// three daily quests you can claim; beside it the "Season 7 · Neon Tides" ranking table lists
// Global or Friends players with pixel identicons, levels and XP, and your row highlighted.
// Use it on a game-community hub, a season page or a profile dashboard.

// Design:
// - Night #0b0b1e with a starfield and a pink synthwave floor grid (SVG); panels #12122b with
//   white/10 borders, rounded-3xl; neon pink #ff3ea5 and cyan #22d3ee for glows, the XP
//   gradient and your row; top-three rank chips in #facc15 / #cbd5e1 / #fb923c
// - Type: heavy sans headline with a pink → cyan gradient word, mono uppercase labels and
//   tabular numbers; hex-clipped portrait and level badge via clip-path polygons
// - XP bar: gradient fill under a 20-segment repeating-gradient mask, animated width; other
//   players get 5×5 mirrored pixel identicons generated from their names
// - Motion: claiming a quest floats a "+450 XP" chip, a "LEVEL UP" banner pops when you cross
//   a level, and table rows re-order with layout animation; reduced motion makes it instant
// - Responsive: profile card above the table below lg, 24rem sticky column on lg; the win-rate
//   column appears from sm; quests stay full-width buttons

// What it does:
// - Level = floor(XP / 2,500) + 1; claiming a quest (once each) adds its XP, updates the bar,
//   "XP to next level", your level in the table and your rank — claim enough to pass Sir Pixel
//   (Global) or dex.exe (Friends)
// - The level-up banner and the gain chip hide themselves after 2.6 s / 1.2 s (timeouts
//   cleared on unmount); changes are announced in an aria-live region
// - Global / Friends tabs (role="tablist") switch the table; your row has aria-current="true"
// - "Full season standings" links to #pixelhaven-season-7

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import XpLevelLeaderboard from '@/TestComponent/PageSections/community/Leaderboard02';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <XpLevelLeaderboard />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiBolt, HiCheck, HiOutlineFire, HiOutlineTrophy } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const XP_PER_LEVEL = 2500
const START_XP = 84340
const levelOf = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1
const fmt = (n) => n.toLocaleString('en-US')

const quests = [
    { id: 'ranked', label: 'Win 3 ranked matches', detail: '3 / 3 wins', xp: 450 },
    { id: 'cheer', label: 'Cheer 10 squadmates’ clips', detail: '10 / 10 cheers', xp: 200 },
    { id: 'raid', label: 'Host a raid night', detail: '1 / 1 raid · 14 joined', xp: 600 },
]

const boards = {
    global: [
        { id: 'raijin', name: 'xXRaijinXx', clan: 'VOLT', xp: 112480, win: 68 },
        { id: 'mothlight', name: 'mothlight', clan: 'LUNA', xp: 104920, win: 64 },
        { id: 'bytebandit', name: 'ByteBandit', clan: 'HEIST', xp: 99310, win: 62 },
        { id: 'lunarfox', name: 'lunarfox', clan: 'LUNA', xp: 93770, win: 59 },
        { id: 'glitchgoblin', name: 'glitchgoblin', clan: 'GOOP', xp: 90150, win: 57 },
        { id: 'sirpixel', name: 'Sir Pixel', clan: 'ROUND', xp: 85120, win: 55 },
        { id: 'you', you: true },
        { id: 'neonnoodle', name: 'neonnoodle', clan: 'NEON', xp: 82910, win: 53 },
        { id: 'tanktoptess', name: 'tanktopTess', clan: 'FLEX', xp: 80450, win: 58 },
        { id: 'quietstorm', name: 'quietstorm', clan: 'CALM', xp: 78030, win: 51 },
    ],
    friends: [
        { id: 'mothlight', name: 'mothlight', clan: 'LUNA', xp: 104920, win: 64 },
        { id: 'pixelpaloma', name: 'pixelpaloma', clan: 'NEON', xp: 88600, win: 60 },
        { id: 'dexexe', name: 'dex.exe', clan: 'NEON', xp: 85200, win: 56 },
        { id: 'you', you: true },
        { id: 'neonnoodle', name: 'neonnoodle', clan: 'NEON', xp: 82910, win: 53 },
        { id: 'crumbcake', name: 'crumbcake', clan: 'BAKE', xp: 71300, win: 49 },
        { id: 'orbitz', name: 'orbitz', clan: 'VOLT', xp: 64880, win: 47 },
    ],
}

const ME = { name: 'kaiju_kat', realName: 'Kat Moreno', clan: 'NEON', win: 61, photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80' }

const NEON = ['#ff3ea5', '#22d3ee', '#a3e635', '#facc15', '#a78bfa', '#fb923c']
const RANK_CHIP = ['bg-[#facc15] text-[#0b0b1e]', 'bg-[#cbd5e1] text-[#0b0b1e]', 'bg-[#fb923c] text-[#0b0b1e]']

function hash(str) {
    let h = 2166136261
    for (const ch of str) {
        h ^= ch.charCodeAt(0)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

function Identicon({ name }) {
    const h = hash(name)
    const color = NEON[h % NEON.length]
    const cells = []
    for (let y = 0; y < 5; y += 1) {
        for (let x = 0; x < 3; x += 1) {
            if ((h >> (y * 3 + x + 3)) & 1) {
                cells.push([x, y])
                if (x < 2) cells.push([4 - x, y])
            }
        }
    }
    return (
        <span aria-hidden="true" className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1b1b3d] p-1.5 ring-1 ring-white/10 sm:size-10">
            <svg viewBox="0 0 5 5" shapeRendering="crispEdges" className="size-full">
                {cells.map(([x, y]) => (
                    <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
                ))}
            </svg>
        </span>
    )
}

const HEX = '[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]'

export function XpLevelLeaderboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const uid = useId()
    const gid = `pxh${uid.replace(/[^a-zA-Z0-9_-]/g, '')}`
    const gainKey = useRef(0)
    const [xp, setXp] = useState(START_XP)
    const [claimed, setClaimed] = useState([])
    const [board, setBoard] = useState('global')
    const [gain, setGain] = useState(null)
    const [levelUp, setLevelUp] = useState(null)
    const [announcement, setAnnouncement] = useState('')

    useEffect(() => {
        if (!levelUp) return undefined
        const t = setTimeout(() => setLevelUp(null), 2600)
        return () => clearTimeout(t)
    }, [levelUp])

    useEffect(() => {
        if (!gain) return undefined
        const t = setTimeout(() => setGain(null), 1200)
        return () => clearTimeout(t)
    }, [gain])

    const level = levelOf(xp)
    const progress = xp % XP_PER_LEVEL
    const pct = (progress / XP_PER_LEVEL) * 100

    const rankedFor = (id) =>
        boards[id]
            .map((p) => (p.you ? { ...ME, id: 'you', you: true, xp } : p))
            .sort((a, b) => b.xp - a.xp)
            .map((p, i) => ({ ...p, rank: i + 1 }))
    const rows = rankedFor(board)
    const globalRank = rankedFor('global').find((p) => p.you).rank

    const claim = (quest) => {
        if (claimed.includes(quest.id)) return
        const next = xp + quest.xp
        const nextLevel = levelOf(next)
        gainKey.current += 1
        setXp(next)
        setClaimed((prev) => [...prev, quest.id])
        setGain({ key: gainKey.current, amount: quest.xp })
        if (nextLevel > level) setLevelUp(nextLevel)
        setAnnouncement(`${quest.label} claimed, plus ${quest.xp} XP.${nextLevel > level ? ` Level up! You reached level ${nextLevel}.` : ''}`)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0b0b1e] py-16 text-base font-normal text-[#e4e4f7] sm:py-20 lg:py-24', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(1px_1px_at_10%_20%,#ffffff99_50%,transparent),radial-gradient(1px_1px_at_70%_12%,#ffffff80_50%,transparent),radial-gradient(1.5px_1.5px_at_40%_35%,#22d3ee99_50%,transparent),radial-gradient(1px_1px_at_85%_45%,#ffffff70_50%,transparent),radial-gradient(1.5px_1.5px_at_20%_60%,#ff3ea599_50%,transparent)]"
            />
            <svg aria-hidden="true" viewBox="0 0 1200 300" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full opacity-40">
                <defs>
                    <linearGradient id={`${gid}-floor`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="40" y2="300">
                        <stop offset="0%" stopColor="#ff3ea5" stopOpacity="0" />
                        <stop offset="100%" stopColor="#ff3ea5" stopOpacity="0.9" />
                    </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <line key={`h${i}`} x1="0" x2="1200" y1={40 + i * i * 6 + i * 12} y2={40 + i * i * 6 + i * 12} stroke={`url(#${gid}-floor)`} strokeWidth="1.5" />
                ))}
                {Array.from({ length: 17 }).map((_, i) => (
                    <line key={`v${i}`} x1={600 + (i - 8) * 30} y1="40" x2={600 + (i - 8) * 180} y2="300" stroke={`url(#${gid}-floor)`} strokeWidth="1.5" />
                ))}
            </svg>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#22d3ee]">
                            <svg aria-hidden="true" viewBox="0 0 8 7" shapeRendering="crispEdges" className="h-5 w-6">
                                <path d="M1 0h2v1h2V0h2v1h1v3H7v1H6v1H5v1H3V6H2V5H1V4H0V1h1z" fill="#ff3ea5" />
                            </svg>
                            Pixelhaven · Season 7 · Neon Tides
                        </p>
                        <h2 className="mt-4 text-5xl font-black uppercase italic leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-7xl">
                            Climb the{' '}
                            <span className="bg-gradient-to-r from-[#ff3ea5] to-[#22d3ee] bg-clip-text pr-2 text-transparent">ladder.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm font-mono text-sm leading-relaxed text-[#9a9ac4]">
                        Season ends 12 Oct · 2,500 XP per level · top 100 unlock the holo-frame.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)] lg:gap-8">
                    <div className="relative self-start rounded-3xl border border-white/10 bg-[#12122b]/90 p-5 shadow-[0_0_60px_-20px_rgba(255,62,165,0.45)] backdrop-blur sm:p-6 lg:sticky lg:top-6">
                        <AnimatePresence>
                            {levelUp && (
                                <motion.div
                                    key={levelUp}
                                    role="status"
                                    initial={reduce ? false : { opacity: 0, scale: 0.6, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: reduce ? 1 : 1.1, transition: { duration: reduce ? 0 : 0.25 } }}
                                    transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                                    className="absolute inset-x-5 -top-5 z-10 rounded-2xl bg-gradient-to-r from-[#ff3ea5] to-[#22d3ee] p-px shadow-[0_0_40px_rgba(255,62,165,0.6)]"
                                >
                                    <p className="rounded-2xl bg-[#0b0b1e] px-4 py-2 text-center font-mono text-sm font-black uppercase tracking-[0.3em] text-white">
                                        Level up! → {levelUp}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                                <div className={cn('size-24 bg-gradient-to-br from-[#ff3ea5] to-[#22d3ee] p-[3px]', HEX)}>
                                    <img src={ME.photo} alt={ME.realName} className={cn('size-full object-cover', HEX)} />
                                </div>
                                <span
                                    className={cn(
                                        'absolute -bottom-2 -right-2 flex size-11 flex-col items-center justify-center bg-[#ff3ea5] font-mono leading-none text-[#0b0b1e]',
                                        HEX,
                                    )}
                                >
                                    <span className="text-[8px] font-bold">LVL</span>
                                    <span className="text-base font-black tabular-nums">{level}</span>
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#22d3ee]">[{ME.clan}]</p>
                                <h3 className="truncate text-2xl font-black tracking-tight text-white">{ME.name}</h3>
                                <p className="truncate text-sm text-[#9a9ac4]">{ME.realName} · Neon Tides</p>
                            </div>
                        </div>

                        <div className="relative mt-6">
                            <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-wider">
                                <span className="text-[#9a9ac4]">XP · Level {level}</span>
                                <span className="tabular-nums text-white">
                                    {fmt(progress)} / {fmt(XP_PER_LEVEL)}
                                </span>
                            </div>
                            <div
                                role="progressbar"
                                aria-label={`Level ${level} progress`}
                                aria-valuemin={0}
                                aria-valuemax={XP_PER_LEVEL}
                                aria-valuenow={progress}
                                className="relative mt-2 h-4 overflow-hidden rounded-md bg-white/10"
                            >
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#ff3ea5] to-[#22d3ee] shadow-[0_0_16px_rgba(34,211,238,0.7)]"
                                    initial={false}
                                    animate={{ width: `${pct}%` }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(5%-2px),#12122b_calc(5%-2px),#12122b_5%)]"
                                />
                            </div>
                            <p className="mt-2 font-mono text-xs text-[#9a9ac4]">
                                <span className="font-bold tabular-nums text-[#ff3ea5]">{fmt(XP_PER_LEVEL - progress)} XP</span> to level {level + 1} ·
                                total {fmt(xp)}
                            </p>
                            <AnimatePresence>
                                {gain && (
                                    <motion.span
                                        key={gain.key}
                                        aria-hidden="true"
                                        initial={reduce ? false : { opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: reduce ? 0 : -18 }}
                                        exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.3 } }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute -top-2 right-0 rounded-full bg-[#22d3ee] px-2.5 py-0.5 font-mono text-xs font-black text-[#0b0b1e]"
                                    >
                                        +{gain.amount} XP
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        <dl className="mt-6 grid grid-cols-3 gap-2">
                            {[
                                { label: 'Global', value: `#${globalRank}`, Icon: HiOutlineTrophy },
                                { label: 'Win rate', value: `${ME.win}%`, Icon: HiBolt },
                                { label: 'Streak', value: '9 d', Icon: HiOutlineFire },
                            ].map(({ label, value, Icon }) => (
                                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                                    <dt className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#9a9ac4]">
                                        <Icon aria-hidden="true" className="size-3.5 text-[#22d3ee]" />
                                        {label}
                                    </dt>
                                    <dd className="mt-1 text-xl font-black tabular-nums text-white">{value}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-6">
                            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#9a9ac4]">Daily quests · ready to claim</p>
                            <ul className="mt-3 grid gap-2">
                                {quests.map((q) => {
                                    const done = claimed.includes(q.id)
                                    return (
                                        <li key={q.id}>
                                            <button
                                                type="button"
                                                disabled={done}
                                                className={cn(
                                                    'flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]',
                                                    done
                                                        ? 'cursor-default border-white/5 bg-white/[0.02] text-[#6b6b94]'
                                                        : 'border-[#ff3ea5]/40 bg-[#ff3ea5]/10 text-white hover:border-[#ff3ea5] hover:bg-[#ff3ea5]/20',
                                                )}
                                                onClick={() => claim(q)}
                                            >
                                                <span className="min-w-0 flex-1">
                                                    <span className={cn('block truncate text-sm font-bold', done && 'line-through')}>{q.label}</span>
                                                    <span className="block font-mono text-[11px] text-[#9a9ac4]">{q.detail}</span>
                                                </span>
                                                <span
                                                    className={cn(
                                                        'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-mono text-xs font-black',
                                                        done ? 'bg-white/5 text-[#6b6b94]' : 'bg-[#ff3ea5] text-[#0b0b1e]',
                                                    )}
                                                >
                                                    {done ? <HiCheck aria-hidden="true" className="size-3.5" /> : null}
                                                    {done ? 'Claimed' : `Claim +${q.xp}`}
                                                </span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="min-w-0 rounded-3xl border border-white/10 bg-[#12122b]/80 p-3 backdrop-blur sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-4 sm:px-2">
                            <h3 className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-white">Season ranking</h3>
                            <div role="tablist" aria-label="Ranking scope" className="inline-flex rounded-full border border-white/10 bg-[#0b0b1e] p-1">
                                {[
                                    { id: 'global', label: 'Global' },
                                    { id: 'friends', label: 'Friends' },
                                ].map((t) => {
                                    const active = board === t.id
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            className={cn(
                                                'relative min-h-10 rounded-full px-4 font-mono text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]',
                                                active ? 'text-[#0b0b1e]' : 'text-[#9a9ac4] hover:text-white',
                                            )}
                                            onClick={() => setBoard(t.id)}
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId={`${uid}-scope`}
                                                    aria-hidden="true"
                                                    className="absolute inset-0 rounded-full bg-[#22d3ee]"
                                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                                />
                                            )}
                                            <span className="relative">{t.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div
                            aria-hidden="true"
                            className="grid grid-cols-[2.25rem_minmax(0,1fr)_3.25rem_5.25rem] gap-3 border-b border-white/10 px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b6b94] sm:grid-cols-[3rem_minmax(0,1fr)_4.5rem_7rem_4rem] sm:px-4"
                        >
                            <span>Rank</span>
                            <span>Player</span>
                            <span className="text-center">Lvl</span>
                            <span className="text-right">XP</span>
                            <span className="hidden text-right sm:block">Win</span>
                        </div>

                        <ol aria-label={`${board === 'global' ? 'Global' : 'Friends'} season ranking`} className="mt-2 grid gap-1.5">
                            {rows.map((p) => {
                                const lvl = levelOf(p.xp)
                                const lvlPct = ((p.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100
                                return (
                                    <motion.li
                                        key={`${board}-${p.id}`}
                                        layout={!reduce}
                                        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                                        aria-current={p.you ? 'true' : undefined}
                                        className={cn(
                                            'relative grid grid-cols-[2.25rem_minmax(0,1fr)_3.25rem_5.25rem] items-center gap-3 rounded-2xl px-3 py-2.5 sm:grid-cols-[3rem_minmax(0,1fr)_4.5rem_7rem_4rem] sm:px-4',
                                            p.you
                                                ? 'z-10 bg-gradient-to-r from-[#ff3ea5]/25 to-[#22d3ee]/10 ring-2 ring-[#ff3ea5] shadow-[0_0_32px_-6px_rgba(255,62,165,0.8)]'
                                                : 'bg-white/[0.02] hover:bg-white/[0.05]',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'inline-flex size-8 items-center justify-center rounded-lg font-mono text-sm font-black tabular-nums',
                                                p.rank <= 3 ? RANK_CHIP[p.rank - 1] : 'text-[#9a9ac4]',
                                            )}
                                        >
                                            {p.rank}
                                        </span>
                                        <span className="flex min-w-0 items-center gap-3">
                                            {p.you ? (
                                                <img src={ME.photo} alt="" className={cn('size-9 shrink-0 object-cover sm:size-10', HEX)} />
                                            ) : (
                                                <Identicon name={p.name} />
                                            )}
                                            <span className="min-w-0">
                                                <span className="flex items-center gap-2">
                                                    <span className="truncate text-sm font-bold text-white">{p.name}</span>
                                                    {p.you && (
                                                        <span className="shrink-0 rounded bg-[#ff3ea5] px-1.5 py-0.5 font-mono text-[9px] font-black uppercase text-[#0b0b1e]">
                                                            You
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6b6b94]">[{p.clan}]</span>
                                            </span>
                                        </span>
                                        <span className="text-center">
                                            <span className="inline-block rounded-md border border-[#22d3ee]/40 px-1.5 py-0.5 font-mono text-xs font-bold tabular-nums text-[#22d3ee]">
                                                {lvl}
                                            </span>
                                        </span>
                                        <span className="text-right">
                                            <span className="block font-mono text-sm font-bold tabular-nums text-white">{fmt(p.xp)}</span>
                                            <span aria-hidden="true" className="mt-1 ml-auto block h-1 w-full max-w-20 overflow-hidden rounded-full bg-white/10">
                                                <span className="block h-full rounded-full bg-[#22d3ee]" style={{ width: `${lvlPct}%` }} />
                                            </span>
                                        </span>
                                        <span className="hidden text-right font-mono text-sm tabular-nums text-[#9a9ac4] sm:block">{p.win}%</span>
                                    </motion.li>
                                )
                            })}
                        </ol>

                        <div className="mt-4 flex justify-end px-1 sm:px-2">
                            <a
                                href="#pixelhaven-season-7"
                                className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#22d3ee] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                            >
                                Full season standings
                                <HiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </a>
                        </div>
                    </div>
                </div>

                <p aria-live="polite" className="sr-only">
                    {announcement}
                </p>
            </div>
        </section>
    )
}

export default XpLevelLeaderboard

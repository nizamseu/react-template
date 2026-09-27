// ArcadeHighScoreLeaderboard

// Leaderboard05 · Social Networks & Communities › Leaderboard / Badges

// Description:
// A retro arcade-cabinet high-score screen for the fictional retro-gaming club Retrocade. A lit
// "RETROCADE" marquee sits above a CRT screen with a pixel-font "HI-SCORES" title, a HUD
// ("1UP", "HI-SCORE", "CREDIT 02") and tabs for three cabinets (NEON DRIFT, HEX INVADERS,
// PIXEL PANIC). Your fresh 184,220 run on NEON DRIFT lands at 3RD with a blinking "NEW HIGH
// SCORE" row and an arcade initials entry. Use it on a gaming community, event or club page.

// Design:
// - Black #000 page with a magenta #ff2bd6 underglow; cabinet bezel #141414, screen #040704;
//   neon green #39ff14 and magenta as the main inks, with cyan #22e3ff and yellow #fff35c
//   cycling through table rows like a classic attract screen
// - All type is font-mono uppercase with wide tracking and text-shadow glow; titles are drawn
//   as a 5×7 pixel font in SVG (crispEdges) with a magenta offset copy for chromatic bleed
// - CRT overlay: 3px repeating scanlines, a dark radial vignette and a slow bright scan band;
//   arcade control buttons are round with inset bottom shadows that press down on :active
// - Motion (framer-motion): "NEW HIGH SCORE", "1UP", "INSERT COIN" and the active initial
//   blink in hard steps and the scan band sweeps — all static for reduced motion
// - Responsive: bezel padding and pixel title scale from 360px up; the table keeps four
//   compact columns (stage hides below sm); control buttons wrap under the screen

// What it does:
// - Cabinet tabs (role="tablist") swap the top-ten table; only NEON DRIFT holds your new run
// - Initials entry: ▲ / ▼ cycle the active letter A–Z, ◀ / ▶ move between the three slots,
//   ENTER saves; with the entry focused you can also type letters, use arrow keys, Backspace
//   and Enter. After saving the row keeps its blinking tag and "Edit initials" reopens entry
// - Saving is announced in an aria-live region; "Join the Retrocade league" links to
//   #retrocade-league

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ArcadeHighScoreLeaderboard from '@/TestComponent/PageSections/community/Leaderboard05';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <ArcadeHighScoreLeaderboard />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiChevronDown, HiChevronLeft, HiChevronRight, HiChevronUp } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const GLYPHS = {
    A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
    C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
    D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
    E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
    I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
    O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
    S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
    T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
    '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
}

function PixelText({ text, color, shadow, className }) {
    const chars = text.split('')
    const cells = []
    chars.forEach((ch, ci) => {
        const glyph = GLYPHS[ch]
        if (!glyph) return
        glyph.forEach((row, y) => {
            row.split('').forEach((bit, x) => {
                if (bit === '1') cells.push([ci * 6 + x, y])
            })
        })
    })
    const width = chars.length * 6 - 1
    return (
        <svg aria-hidden="true" viewBox={`-0.5 -0.5 ${width + 1} 8`} shapeRendering="crispEdges" className={className}>
            {shadow &&
                cells.map(([x, y]) => <rect key={`s${x}-${y}`} x={x + 0.35} y={y} width="0.9" height="0.9" fill={shadow} opacity="0.75" />)}
            {cells.map(([x, y]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width="0.9" height="0.9" fill={color} />
            ))}
        </svg>
    )
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ROW_COLORS = ['#fff35c', '#ff2bd6', '#22e3ff', '#39ff14']
const PENDING = { score: 184220, stage: '7-3' }

const games = [
    {
        id: 'neon-drift',
        label: 'Neon Drift',
        rows: [
            ['ZAP', 250110, '9-4'], ['KIT', 212480, '8-2'], ['MOX', 176900, '7-1'], ['RAD', 158300, '6-4'], ['JJB', 141050, '6-1'],
            ['LUX', 129775, '5-3'], ['OWL', 114020, '5-1'], ['BEN', 98640, '4-2'], ['ACE', 87310, '3-4'], ['PIP', 80125, '3-2'],
        ],
    },
    {
        id: 'hex-invaders',
        label: 'Hex Invaders',
        rows: [
            ['VEX', 998430, '32'], ['NYX', 874200, '29'], ['ZAP', 812660, '27'], ['GGG', 790015, '27'], ['TOM', 655900, '22'],
            ['AMY', 610430, '21'], ['KIT', 588120, '20'], ['DOC', 502875, '18'], ['SUE', 467200, '17'], ['MOX', 430050, '15'],
        ],
    },
    {
        id: 'pixel-panic',
        label: 'Pixel Panic',
        rows: [
            ['BIT', 73420, 'L12'], ['OWL', 70115, 'L12'], ['RAD', 68990, 'L11'], ['CJM', 61240, 'L10'], ['ZOE', 59875, 'L10'],
            ['LUX', 55300, 'L9'], ['HAL', 51220, 'L9'], ['PIP', 48760, 'L8'], ['JJB', 46115, 'L8'], ['ACE', 42980, 'L7'],
        ],
    },
]

const ORD = (n) => `${n}${n === 1 ? 'ST' : n === 2 ? 'ND' : n === 3 ? 'RD' : 'TH'}`
const pad = (n) => String(n).padStart(7, '0')

function Blink({ children, reduce, className, period = 1 }) {
    return (
        <motion.span
            className={className}
            animate={reduce ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
            transition={reduce ? { duration: 0 } : { duration: period, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }}
        >
            {children}
        </motion.span>
    )
}

function ArcadeButton({ label, onClick, disabled, children, tone = 'green', className }) {
    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            className={cn(
                'inline-flex h-12 w-12 items-center justify-center rounded-full font-mono text-sm font-black text-black transition-[transform,box-shadow] duration-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-0.5 active:shadow-[inset_0_-1px_0_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:opacity-35 sm:h-14 sm:w-14',
                tone === 'green'
                    ? 'bg-[#39ff14] shadow-[inset_0_-5px_0_rgba(0,0,0,0.35),0_0_18px_rgba(57,255,20,0.45)]'
                    : 'bg-[#ff2bd6] shadow-[inset_0_-5px_0_rgba(0,0,0,0.35),0_0_18px_rgba(255,43,214,0.5)]',
                className,
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export function ArcadeHighScoreLeaderboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [gameId, setGameId] = useState('neon-drift')
    const [initials, setInitials] = useState(['A', 'A', 'A'])
    const [slot, setSlot] = useState(0)
    const [saved, setSaved] = useState(false)
    const [announcement, setAnnouncement] = useState('')

    const game = games.find((g) => g.id === gameId)
    const hasRun = gameId === 'neon-drift'
    const base = game.rows.map(([name, score, stage]) => ({ name, score, stage }))
    const rows = (hasRun ? [...base, { name: initials.join(''), score: PENDING.score, stage: PENDING.stage, you: true }] : base)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
    const yourRank = rows.findIndex((r) => r.you) + 1
    const hiScore = rows[0].score

    const cycle = (dir) => setInitials((prev) => prev.map((c, i) => (i === slot ? LETTERS[(LETTERS.indexOf(c) + dir + 26) % 26] : c)))
    const move = (dir) => setSlot((s) => Math.max(0, Math.min(2, s + dir)))
    const save = () => {
        setSaved(true)
        setAnnouncement(`Saved ${initials.join('')} at ${ORD(yourRank)} place with ${PENDING.score.toLocaleString('en-US')} points`)
    }
    const edit = () => {
        setSaved(false)
        setSlot(0)
        setAnnouncement('Initials entry reopened')
    }

    const onEntryKey = (e) => {
        if (saved) return
        const key = e.key
        if (key === 'ArrowUp') cycle(-1)
        else if (key === 'ArrowDown') cycle(1)
        else if (key === 'ArrowLeft' || key === 'Backspace') move(-1)
        else if (key === 'ArrowRight') move(1)
        else if (key === 'Enter') save()
        else if (/^[a-z]$/i.test(key)) {
            const ch = key.toUpperCase()
            setInitials((prev) => prev.map((c, i) => (i === slot ? ch : c)))
            move(1)
        } else return
        e.preventDefault()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-black py-16 font-mono text-base font-normal text-[#39ff14] sm:py-20 lg:py-24', className)}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[60rem] max-w-none -translate-x-1/2 rounded-full bg-[#ff2bd6]/20 blur-3xl" />

            <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
                <div className="rounded-t-[1.75rem] border-x-4 border-t-4 border-[#1f1f1f] bg-gradient-to-b from-[#2a0624] to-[#140312] px-4 py-5 text-center shadow-[inset_0_0_40px_rgba(255,43,214,0.35)] sm:px-8">
                    <PixelText text="RETROCADE" color="#ff2bd6" shadow="#22e3ff" className="mx-auto h-7 w-auto max-w-full drop-shadow-[0_0_10px_rgba(255,43,214,0.9)] sm:h-10" />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff9ae8] sm:text-xs">Est. 1987 · Arcade league</p>
                </div>

                <div className="rounded-b-[2.5rem] bg-[#141414] p-3 shadow-[inset_0_2px_0_#2a2a2a,0_40px_80px_-30px_rgba(255,43,214,0.45)] sm:p-6">
                    <div className="relative overflow-hidden rounded-[1.75rem] bg-[#040704] px-3 pb-6 pt-5 shadow-[inset_0_0_70px_rgba(57,255,20,0.14)] sm:px-8 sm:pb-8 sm:pt-7">
                        <div className="relative z-[1]">
                            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-widest sm:text-sm">
                                <p>
                                    <Blink reduce={reduce} className="block text-[#ff2bd6]">
                                        1UP
                                    </Blink>
                                    <span className="tabular-nums text-white">{hasRun ? pad(PENDING.score) : '0000000'}</span>
                                </p>
                                <p>
                                    <span className="block text-[#ff2bd6]">Hi-score</span>
                                    <span className="tabular-nums text-white">{pad(hiScore)}</span>
                                </p>
                                <p>
                                    <span className="block text-[#ff2bd6]">Credit</span>
                                    <span className="tabular-nums text-white">02</span>
                                </p>
                            </div>

                            <h2 className="mt-6 text-center text-4xl font-black text-[#39ff14]">
                                <span className="sr-only">High scores</span>
                                <PixelText text="HI-SCORES" color="#39ff14" shadow="#ff2bd6" className="mx-auto h-9 w-auto max-w-full drop-shadow-[0_0_12px_rgba(57,255,20,0.8)] sm:h-14" />
                            </h2>

                            <div role="tablist" aria-label="Choose cabinet" className="mt-6 flex flex-wrap justify-center gap-2">
                                {games.map((g) => {
                                    const active = g.id === gameId
                                    return (
                                        <button
                                            key={g.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            className={cn(
                                                'min-h-10 border-2 px-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4 sm:text-xs',
                                                active
                                                    ? 'border-[#39ff14] bg-[#39ff14] text-black shadow-[0_0_16px_rgba(57,255,20,0.6)]'
                                                    : 'border-[#39ff14]/40 text-[#39ff14] hover:border-[#39ff14]',
                                            )}
                                            onClick={() => setGameId(g.id)}
                                        >
                                            {g.label}
                                        </button>
                                    )
                                })}
                            </div>

                            <div
                                aria-hidden="true"
                                className="mt-6 grid grid-cols-[3rem_minmax(0,1fr)_3.5rem] gap-2 border-b-2 border-dashed border-[#39ff14]/40 pb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#22e3ff] sm:grid-cols-[4.5rem_minmax(0,1fr)_5rem_4rem] sm:text-xs"
                            >
                                <span>Rank</span>
                                <span className="text-right sm:text-center">Score</span>
                                <span className="text-right sm:text-center">Name</span>
                                <span className="hidden text-right sm:block">Stage</span>
                            </div>

                            <ol aria-label={`${game.label} top ten`} className="mt-2">
                                {rows.map((r, i) => {
                                    const color = ROW_COLORS[i % ROW_COLORS.length]
                                    return (
                                        <li
                                            key={`${gameId}-${r.you ? 'you' : r.name}-${r.score}`}
                                            aria-current={r.you ? 'true' : undefined}
                                            className={cn(
                                                'text-sm font-bold uppercase tracking-[0.18em] sm:text-lg',
                                                r.you && '-mx-2 my-1 border-2 border-[#ff2bd6] bg-[#ff2bd6]/10 px-2 py-1 shadow-[0_0_24px_rgba(255,43,214,0.45)] sm:-mx-3 sm:px-3',
                                            )}
                                            style={{ color: r.you ? '#ff2bd6' : color, textShadow: `0 0 8px ${r.you ? '#ff2bd6' : color}` }}
                                        >
                                            <div className="grid grid-cols-[3rem_minmax(0,1fr)_3.5rem] items-center gap-2 py-1.5 sm:grid-cols-[4.5rem_minmax(0,1fr)_5rem_4rem]">
                                                <span>{ORD(i + 1)}</span>
                                                <span className="text-right tabular-nums sm:text-center">{pad(r.score)}</span>
                                                <span className="text-right sm:text-center">
                                                    {r.you && !saved ? (
                                                        <span className="inline-flex gap-0.5">
                                                            {initials.map((c, si) => (
                                                                <span key={si} className={cn('inline-block w-[1.1ch] border-b-2', si === slot ? 'border-white' : 'border-[#ff2bd6]/60')}>
                                                                    {si === slot ? (
                                                                        <Blink reduce={reduce} period={0.6} className="text-white">
                                                                            {c}
                                                                        </Blink>
                                                                    ) : (
                                                                        c
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    ) : (
                                                        r.name
                                                    )}
                                                </span>
                                                <span className="hidden text-right tabular-nums sm:block">{r.stage}</span>
                                            </div>
                                            {r.you && (
                                                <Blink reduce={reduce} className="block pb-1 text-center text-[10px] tracking-[0.35em] text-white sm:text-xs">
                                                    ▶ New high score ◀
                                                </Blink>
                                            )}
                                        </li>
                                    )
                                })}
                            </ol>

                            <p className="mt-6 text-center text-[11px] font-bold uppercase tracking-[0.35em] text-[#22e3ff] sm:text-xs">
                                <Blink reduce={reduce} period={1.4}>
                                    Insert coin
                                </Blink>
                            </p>
                        </div>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-[2] bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,rgba(0,0,0,0.38)_2px,rgba(0,0,0,0.38)_3px)]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.8)_100%)]"
                        />
                        {!reduce && (
                            <motion.div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-transparent via-[#39ff14]/[0.06] to-transparent"
                                animate={{ y: ['-100%', '900%'] }}
                                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                            />
                        )}
                    </div>

                    <div className="mt-5 flex flex-col items-center gap-5 rounded-[1.75rem] bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] px-4 py-5 sm:flex-row sm:justify-between sm:px-6">
                        {hasRun ? (
                            <>
                                <div
                                    role="group"
                                    tabIndex={saved ? -1 : 0}
                                    aria-label={
                                        saved
                                            ? `Initials saved: ${initials.join('')}`
                                            : `Enter your initials, slot ${slot + 1} of 3 is ${initials[slot]}. Type letters or use arrow keys, Enter to save.`
                                    }
                                    className="text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff14] sm:text-left"
                                    onKeyDown={onEntryKey}
                                >
                                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ff2bd6]">
                                        {saved ? 'Initials saved' : 'Enter your initials'}
                                    </p>
                                    <p className="mt-1 flex items-center justify-center gap-2 text-3xl font-black tracking-[0.3em] text-white sm:justify-start [text-shadow:0_0_10px_#ff2bd6]">
                                        {initials.map((c, i) => (
                                            <span key={i} className={cn('inline-block w-[1.2ch] border-b-4 text-center', !saved && i === slot ? 'border-[#39ff14]' : 'border-white/20')}>
                                                {c}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#8f8f8f]">
                                        {PENDING.score.toLocaleString('en-US')} pts · stage {PENDING.stage} · 27 Sep 26
                                    </p>
                                </div>

                                {saved ? (
                                    <button
                                        type="button"
                                        className="min-h-11 border-2 border-[#39ff14] px-5 text-xs font-bold uppercase tracking-[0.25em] text-[#39ff14] transition-colors hover:bg-[#39ff14] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        onClick={edit}
                                    >
                                        Edit initials
                                    </button>
                                ) : (
                                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                                        <ArcadeButton label="Previous slot" disabled={slot === 0} onClick={() => move(-1)}>
                                            <HiChevronLeft aria-hidden="true" className="size-6" />
                                        </ArcadeButton>
                                        <ArcadeButton label="Previous letter" onClick={() => cycle(-1)}>
                                            <HiChevronUp aria-hidden="true" className="size-6" />
                                        </ArcadeButton>
                                        <ArcadeButton label="Next letter" onClick={() => cycle(1)}>
                                            <HiChevronDown aria-hidden="true" className="size-6" />
                                        </ArcadeButton>
                                        <ArcadeButton label="Next slot" disabled={slot === 2} onClick={() => move(1)}>
                                            <HiChevronRight aria-hidden="true" className="size-6" />
                                        </ArcadeButton>
                                        <ArcadeButton label="Enter, save initials" tone="magenta" className="w-auto px-5 sm:w-auto" onClick={save}>
                                            Enter
                                        </ArcadeButton>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-[#8f8f8f] sm:text-left">
                                    No new score on {game.label} yet
                                </p>
                                <button
                                    type="button"
                                    className="min-h-11 border-2 border-[#ff2bd6] px-5 text-xs font-bold uppercase tracking-[0.25em] text-[#ff2bd6] transition-colors hover:bg-[#ff2bd6] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    onClick={() => setGameId('neon-drift')}
                                >
                                    Back to your run
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <a
                        href="#retrocade-league"
                        className="group inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#39ff14] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff14]"
                    >
                        Join the Retrocade league
                        <HiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </a>
                </div>

                <p aria-live="polite" className="sr-only">
                    {announcement}
                </p>
            </div>
        </section>
    )
}

export default ArcadeHighScoreLeaderboard

// PodiumRankLeaderboard

// Leaderboard01 · Social Networks & Communities › Leaderboard / Badges

// Description:
// A heraldic "Hall of Renown" leaderboard for the fictional writing guild Guildhall. Under
// the serif heading "Honours of the Guild" the top three members stand on a gold, ink and
// bronze podium with portraits, guild titles and renown points, followed by a ruled ledger of
// ranks IV–X and a "Your standing" note. A Week / Month / All-time filter swaps the whole
// table. Use it on a community home, a gamified forum or a monthly recognition page.

// Design:
// - Parchment #f6f1e7 with a darker #ebe2cf ledger, warm ink #2a211b / #6b5d4f, burgundy
//   #7f1d1d for the filter, the first-place plinth and rules, gold #b8860b for the crown,
//   laurel and first-place ring; silver #8d8a86 and bronze #9a5b2e rings for II and III
// - Serif type throughout (display text-5xl → lg:text-7xl), small-caps eyebrows with wide
//   tracking, roman numerals for every rank, dotted leaders between names and points
// - Ornaments are inline SVG: a shield crest, a crown, two laurel branches and a rule-diamond-rule
//   divider; plinths are square-cornered with a 4px burgundy cap
// - Motion: the filter pill slides (layoutId), podium portraits cross-fade and plinths rise
//   when the period changes, ledger rows re-order with layout animation; all instant for
//   reduced motion
// - Responsive: the podium stays three columns (II · I · III) at every width with smaller
//   portraits below sm; the ledger is one column, the standing note stacks below sm

// What it does:
// - The Week / Month / All-time tabs (role="tablist") switch the date line, the podium, the
//   ranks IV–X, movement markers (▲ / ▼ / new / —) and the "Your standing" figures
// - Rank movement is shown with an arrow and screen-reader text, never colour alone
// - "How renown is earned" links to #guildhall-renown; member names link to
//   #guildhall-member-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PodiumRankLeaderboard from '@/TestComponent/PageSections/community/Leaderboard01';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <PodiumRankLeaderboard />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiChevronDown, HiChevronUp, HiMinus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const portrait = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

const members = {
    maya: { name: 'Maya Okafor', handle: 'maya.ink', title: 'Master Illuminator', photo: '1438761681033-6461ffad8d80' },
    omar: { name: 'Omar Haddad', handle: 'omar.h', title: 'Mentor of Scribes', photo: '1506794778202-cad84cf45f1d' },
    ines: { name: 'Inês Duarte', handle: 'ines.d', title: 'Keeper of Threads', photo: '1544005313-94ddf0286df2' },
    tobias: { name: 'Tobias Lindqvist', handle: 'tobi.l', title: 'Royal Cartographer', photo: '1472099645785-5658abf4ff4e' },
    aiko: { name: 'Aiko Tanaka', handle: 'aiko.t', title: 'Herald of the East Wing', photo: '1554151228-14d9def656e4' },
    rafael: { name: 'Rafael Mendes', handle: 'rafa.m', title: 'Warden of the Stacks', photo: '1463453091185-61582044d556' },
    grace: { name: 'Grace Whitfield', handle: 'grace.w', title: 'Archivist', photo: '1580489944761-15a19d654956' },
    kwame: { name: 'Kwame Asante', handle: 'kwame.a', title: 'Quartermaster', photo: '1599566150163-29194dcaad36' },
    sofia: { name: 'Sofia Marchetti', handle: 'sofia.m', title: 'Chronicler', photo: '1531123897727-8f129e1688ce' },
    liam: { name: 'Liam O’Connell', handle: 'liam.oc', title: 'Journeyman Binder', photo: '1570295999919-56ceb5ecca61' },
    priya: { name: 'Priya Raman', handle: 'priya.r', title: 'Scholar of Lore', photo: '1573497019940-1c28c88b4f3e' },
    jonas: { name: 'Jonas Weber', handle: 'jonas.w', title: 'Squire of Ink', photo: '1566492031773-4f4e44671857' },
}

const periods = [
    {
        id: 'week',
        label: 'Week',
        range: 'The week of 21–27 September 2026',
        rows: [
            ['maya', 1840, 2], ['omar', 1715, -1], ['aiko', 1602, 4], ['ines', 1488, 0], ['kwame', 1390, 3],
            ['grace', 1312, -2], ['liam', 1275, 5], ['tobias', 1201, -3], ['priya', 1150, 1], ['jonas', 1098, 'new'],
        ],
        you: { rank: 23, points: 640, gap: 58 },
    },
    {
        id: 'month',
        label: 'Month',
        range: 'The month of September 2026',
        rows: [
            ['omar', 6920, 1], ['maya', 6710, -1], ['ines', 6285, 0], ['tobias', 5930, 2], ['aiko', 5602, 3],
            ['rafael', 5410, -2], ['grace', 5188, -1], ['sofia', 4975, 1], ['kwame', 4760, 'new'], ['priya', 4510, -3],
        ],
        you: { rank: 41, points: 2180, gap: 115 },
    },
    {
        id: 'all',
        label: 'All-time',
        range: 'Since the founding of the Guild, 2019',
        rows: [
            ['tobias', 184220, 0], ['omar', 171905, 0], ['ines', 158340, 1], ['maya', 149870, -1], ['rafael', 131260, 0],
            ['sofia', 128415, 2], ['grace', 119030, -1], ['kwame', 104775, -1], ['aiko', 98410, 3], ['jonas', 87960, 1],
        ],
        you: { rank: 312, points: 12480, gap: 240 },
    },
]

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
const fmt = (n) => n.toLocaleString('en-US')

const podiumStyle = {
    1: { ring: 'ring-[#b8860b]', size: 'size-20 sm:size-32', plinth: 'h-28 sm:h-40 bg-[#7f1d1d] text-[#e9c46a]', numeral: 'text-4xl sm:text-6xl', medal: 'bg-[#b8860b]' },
    2: { ring: 'ring-[#8d8a86]', size: 'size-14 sm:size-24', plinth: 'h-20 sm:h-28 bg-[#ebe2cf] text-[#7f1d1d]', numeral: 'text-3xl sm:text-5xl', medal: 'bg-[#8d8a86]' },
    3: { ring: 'ring-[#9a5b2e]', size: 'size-14 sm:size-24', plinth: 'h-14 sm:h-20 bg-[#ebe2cf] text-[#7f1d1d]', numeral: 'text-3xl sm:text-4xl', medal: 'bg-[#9a5b2e]' },
}

function Movement({ change }) {
    if (change === 'new') {
        return <span className="font-serif text-xs italic text-[#7f1d1d]">new</span>
    }
    if (change === 0) {
        return (
            <span className="inline-flex items-center text-[#6b5d4f]">
                <HiMinus aria-hidden="true" className="size-3.5" />
                <span className="sr-only">no change</span>
            </span>
        )
    }
    const up = change > 0
    const Icon = up ? HiChevronUp : HiChevronDown
    return (
        <span className={cn('inline-flex items-center text-xs font-semibold tabular-nums', up ? 'text-[#3f6212]' : 'text-[#7f1d1d]')}>
            <Icon aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{up ? 'up' : 'down'}</span>
            {Math.abs(change)}
        </span>
    )
}

function Crest() {
    return (
        <svg aria-hidden="true" viewBox="0 0 48 56" className="mx-auto h-14 w-12">
            <path d="M24 2 44 9v18c0 13-9 22-20 27C13 49 4 40 4 27V9z" fill="#7f1d1d" />
            <path d="M24 7 39 12.5V27c0 10-7 17.5-15 21.5C16 44.5 9 37 9 27V12.5z" fill="none" stroke="#e9c46a" strokeWidth="1.2" />
            <text x="24" y="34" textAnchor="middle" fontFamily="Georgia, serif" fontSize="18" fontWeight="700" fill="#e9c46a">
                G
            </text>
        </svg>
    )
}

function Divider() {
    return (
        <svg aria-hidden="true" viewBox="0 0 240 12" className="mx-auto mt-6 h-3 w-60 max-w-full text-[#7f1d1d]">
            <line x1="0" y1="6" x2="104" y2="6" stroke="currentColor" strokeWidth="1" />
            <line x1="136" y1="6" x2="240" y2="6" stroke="currentColor" strokeWidth="1" />
            <path d="M120 0 126 6 120 12 114 6z" fill="#b8860b" />
            <circle cx="108" cy="6" r="1.8" fill="currentColor" />
            <circle cx="132" cy="6" r="1.8" fill="currentColor" />
        </svg>
    )
}

const LEAVES = [
    [29, 90, -58],
    [21, 79, -48],
    [15, 67, -36],
    [11, 54, -24],
    [9, 41, -14],
    [10, 28, -4],
    [13, 16, 8],
]

function LaurelBranch({ className }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 40 100" className={className}>
            <path d="M34 98C14 88 4 60 13 8" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
            {LEAVES.map(([x, y, a], i) => (
                <g key={y}>
                    <ellipse cx={x - 5} cy={y} rx="3.6" ry="8" transform={`rotate(${a} ${x - 5} ${y})`} fill="#b8860b" opacity={0.95 - i * 0.05} />
                    {i % 2 === 1 && <ellipse cx={x + 5} cy={y - 3} rx="2.8" ry="6.5" transform={`rotate(${a + 70} ${x + 5} ${y - 3})`} fill="#d4a72c" opacity="0.8" />}
                </g>
            ))}
        </svg>
    )
}

function Crown() {
    return (
        <svg aria-hidden="true" viewBox="0 0 40 24" className="h-6 w-10 sm:h-8 sm:w-14">
            <path d="M3 20 6 5l9 8 5-11 5 11 9-8 3 15z" fill="#b8860b" stroke="#7a5a07" strokeWidth="1" strokeLinejoin="round" />
            <rect x="3" y="20" width="34" height="3" rx="1" fill="#7a5a07" />
            <circle cx="20" cy="2.5" r="2" fill="#7f1d1d" />
        </svg>
    )
}

export function PodiumRankLeaderboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const uid = useId()
    const [periodId, setPeriodId] = useState('week')
    const [switched, setSwitched] = useState(false)
    const period = periods.find((p) => p.id === periodId)
    const ranked = period.rows.map(([id, points, change], i) => ({ id, points, change, rank: i + 1, ...members[id] }))
    const podium = [ranked[1], ranked[0], ranked[2]]
    const ledger = ranked.slice(3)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#f6f1e7] py-16 text-base font-normal text-[#2a211b] sm:py-20 lg:py-24', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-[#7f1d1d]/20 sm:inset-6 [box-shadow:inset_0_0_0_4px_#f6f1e7,inset_0_0_0_5px_rgba(127,29,29,0.15)]"
            />
            <div className="relative mx-auto max-w-5xl px-4 sm:px-8">
                <header className="text-center">
                    <Crest />
                    <p className="mt-4 font-serif text-xs font-semibold uppercase tracking-[0.4em] text-[#7f1d1d]">Guildhall · Hall of Renown</p>
                    <h2 className="mt-3 font-serif text-5xl font-semibold leading-none tracking-tight text-[#2a211b] sm:text-6xl lg:text-7xl">
                        Honours of the Guild
                    </h2>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                            key={period.id}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="mt-4 font-serif text-lg italic text-[#6b5d4f]"
                        >
                            {period.range}
                        </motion.p>
                    </AnimatePresence>
                    <Divider />

                    <div role="tablist" aria-label="Leaderboard period" className="mx-auto mt-8 inline-flex border border-[#7f1d1d]/40 bg-[#fbf8f1] p-1">
                        {periods.map((p) => {
                            const active = p.id === periodId
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    className={cn(
                                        'relative min-h-10 whitespace-nowrap px-3 font-serif text-sm font-semibold uppercase tracking-[0.12em] transition-colors sm:tracking-[0.18em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d] sm:px-6',
                                        active ? 'text-[#f6f1e7]' : 'text-[#6b5d4f] hover:text-[#7f1d1d]',
                                    )}
                                    onClick={() => {
                                        setPeriodId(p.id)
                                        setSwitched(true)
                                    }}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId={`${uid}-period`}
                                            aria-hidden="true"
                                            className="absolute inset-0 bg-[#7f1d1d]"
                                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
                                        />
                                    )}
                                    <span className="relative">{p.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </header>

                <ol aria-label="Top three" className="mt-14 grid grid-cols-3 items-end gap-2 sm:gap-5">
                    {podium.map((m) => {
                        const style = podiumStyle[m.rank]
                        return (
                            <li key={`slot-${m.rank}`} className="flex min-w-0 flex-col items-center text-center">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={m.id}
                                        initial={reduce ? false : { opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                                        transition={{ duration: 0.3, delay: reduce ? 0 : m.rank * 0.05 }}
                                        className="flex w-full min-w-0 flex-col items-center"
                                    >
                                        {m.rank === 1 ? <Crown /> : <span aria-hidden="true" className="h-6 sm:h-8" />}
                                        <div className="relative mt-1">
                                            {m.rank === 1 && (
                                                <>
                                                    <LaurelBranch className="pointer-events-none absolute right-[80%] top-1/2 h-[112%] w-auto -translate-y-1/2" />
                                                    <LaurelBranch className="pointer-events-none absolute left-[80%] top-1/2 h-[112%] w-auto -translate-y-1/2 -scale-x-100" />
                                                </>
                                            )}
                                            <img
                                                src={portrait(m.photo)}
                                                alt={m.name}
                                                loading="lazy"
                                                className={cn('relative rounded-full object-cover ring-4 ring-offset-4 ring-offset-[#f6f1e7]', style.size, style.ring)}
                                            />
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'absolute -bottom-2 left-1/2 inline-flex size-7 -translate-x-1/2 items-center justify-center rounded-full font-serif text-xs font-bold text-[#f6f1e7] ring-2 ring-[#f6f1e7] sm:size-8 sm:text-sm',
                                                    style.medal,
                                                )}
                                            >
                                                {m.rank}
                                            </span>
                                        </div>
                                        <a
                                            href={`#guildhall-member-${m.id}`}
                                            className="mt-5 block max-w-full truncate font-serif text-sm font-semibold text-[#2a211b] hover:text-[#7f1d1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d] sm:text-lg"
                                        >
                                            {m.name}
                                        </a>
                                        <p className="mt-0.5 line-clamp-1 max-w-full font-serif text-[11px] italic text-[#6b5d4f] sm:text-sm">{m.title}</p>
                                        <p className="mt-1.5 text-xs text-[#6b5d4f] sm:text-sm">
                                            <span className="font-semibold tabular-nums text-[#2a211b]">{fmt(m.points)}</span> renown
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                                <motion.div
                                    key={`${period.id}-${m.rank}`}
                                    initial={reduce || !switched ? false : { scaleY: 0.35 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ originY: 1 }}
                                    className={cn('mt-4 flex w-full items-start justify-center border-t-4 border-[#7f1d1d] pt-3 font-serif font-semibold', style.plinth)}
                                >
                                    <span aria-hidden="true" className={style.numeral}>
                                        {ROMAN[m.rank - 1]}
                                    </span>
                                    <span className="sr-only">Rank {m.rank}</span>
                                </motion.div>
                            </li>
                        )
                    })}
                </ol>

                <div className="border-x border-b border-[#7f1d1d]/25 bg-[#ebe2cf]/60 px-4 py-2 sm:px-8">
                    <ol aria-label="Ranks four to ten" start={4}>
                        <AnimatePresence initial={false} mode="popLayout">
                            {ledger.map((m) => (
                                <motion.li
                                    key={m.id}
                                    layout={!reduce}
                                    initial={reduce ? false : { opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: 12 }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className="grid grid-cols-[2.25rem_2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-dashed border-[#7f1d1d]/20 py-3.5 last:border-b-0 sm:grid-cols-[3rem_3rem_minmax(0,1fr)_auto] sm:gap-4"
                                >
                                    <span className="font-serif text-lg font-semibold text-[#7f1d1d] sm:text-xl">
                                        <span aria-hidden="true">{ROMAN[m.rank - 1]}</span>
                                        <span className="sr-only">Rank {m.rank}</span>
                                    </span>
                                    <img src={portrait(m.photo)} alt="" loading="lazy" className="size-10 rounded-full object-cover ring-2 ring-[#f6f1e7] sm:size-12" />
                                    <div className="flex min-w-0 items-baseline gap-3">
                                        <div className="min-w-0 shrink">
                                            <a
                                                href={`#guildhall-member-${m.id}`}
                                                className="block truncate font-serif text-base font-semibold text-[#2a211b] hover:text-[#7f1d1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d] sm:text-lg"
                                            >
                                                {m.name}
                                            </a>
                                            <p className="truncate font-serif text-xs italic text-[#6b5d4f] sm:text-sm">
                                                {m.title} · @{m.handle}
                                            </p>
                                        </div>
                                        <span aria-hidden="true" className="hidden h-px min-w-6 flex-1 translate-y-[-0.35rem] border-b-2 border-dotted border-[#6b5d4f]/40 sm:block" />
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5 text-right">
                                        <span className="font-serif text-base font-semibold tabular-nums text-[#2a211b] sm:text-lg">{fmt(m.points)}</span>
                                        <Movement change={m.change} />
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ol>
                </div>

                <div className="mt-8 flex flex-col gap-4 border-y-2 border-double border-[#7f1d1d]/50 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-serif text-base text-[#2a211b]">
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7f1d1d]">Your standing</span>
                        <br />
                        No. <span className="font-semibold tabular-nums">{fmt(period.you.rank)}</span> ·{' '}
                        <span className="font-semibold tabular-nums">{fmt(period.you.points)}</span> renown ·{' '}
                        <em className="text-[#6b5d4f]">{period.you.gap} more to rise a place</em>
                    </p>
                    <a
                        href="#guildhall-renown"
                        className="group inline-flex min-h-11 items-center gap-2 self-start border border-[#7f1d1d] px-5 font-serif text-sm font-semibold uppercase tracking-[0.16em] text-[#7f1d1d] transition-colors hover:bg-[#7f1d1d] hover:text-[#f6f1e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d] sm:self-auto"
                    >
                        How renown is earned
                        <HiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default PodiumRankLeaderboard

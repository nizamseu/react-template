// BadgeCaseLeaderboard

// Leaderboard03 · Social Networks & Communities › Leaderboard / Badges

// Description:
// A friendly achievement "badge case" for the fictional neighbourhood network Neighbour Net.
// Under the heading "Your badge case" twelve SVG badges (e.g. "Welcome Wagon", "Good
// Samaritan — 7 / 10 answers", "Block Captain") show as earned or locked with progress; picking
// one reveals how to earn it, its rarity and a next step, and a "Top collectors on Maple
// Street" mini leaderboard ranks neighbours. Use it on a profile, rewards or community page.

// Design:
// - White #ffffff with a #f0fdf4 wash and a dotted #dcfce7 pattern behind the header; ink
//   #10231a / #5b6b60, Neighbour Net green #16a34a for progress, focus and CTAs
// - Badges are inline SVG medals in six shapes (circle, shield, hexagon, seal, star, leaf) and
//   eight tones (#16a34a, #0d9488, #65a30d, #d97706, #0284c7, #e11d48, #4f46e5, #b45309);
//   locked ones turn #f1f5f4 with a dashed inner rim, grey icon, lock chip and a progress ring
// - Cards are rounded-3xl with #e5ece7 borders; the selected card gets a green ring; type is
//   a rounded, friendly sans (font-semibold → font-extrabold for the heading)
// - Motion: detail content cross-fades, the mobile sheet slides up with a spring and badges
//   pop slightly on hover — all instant or off for reduced motion
// - Responsive: grid 2 → sm:3 → xl:4 columns; on lg a sticky 22rem detail panel sits beside
//   the grid, below lg a bottom sheet opens instead; the leaderboard follows the grid on mobile

// What it does:
// - Filter chips All / Earned / In progress (aria-pressed, with counts) narrow the grid
// - Clicking a badge (aria-pressed) selects it; on lg the side panel updates, below lg a
//   bottom-sheet dialog opens (aria-modal) that closes with its button, the backdrop or
//   Escape and hands focus back to the badge
// - Details show status, description, "How to earn" steps (ticked by progress), a progress
//   bar, rarity and a CTA linking to #neighbour-net-<action>
// - Leaderboard names link to #neighbour-net-member-<id>; your row is marked aria-current

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BadgeCaseLeaderboard from '@/TestComponent/PageSections/community/Leaderboard03';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <BadgeCaseLeaderboard />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiCheck,
    HiLockClosed,
    HiOutlineArrowsRightLeft,
    HiOutlineCalendarDays,
    HiOutlineChatBubbleLeftRight,
    HiOutlineHandRaised,
    HiOutlineHome,
    HiOutlineMagnifyingGlass,
    HiOutlineMoon,
    HiOutlineSparkles,
    HiOutlineStar,
    HiOutlineSun,
    HiOutlineTrophy,
    HiOutlineWrenchScrewdriver,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

function sealPath(points, outer, inner) {
    return (
        Array.from({ length: points * 2 }, (_, i) => {
            const r = i % 2 === 0 ? outer : inner
            const a = (Math.PI * i) / points - Math.PI / 2
            return `${i === 0 ? 'M' : 'L'}${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`
        }).join(' ') + 'Z'
    )
}

const SHAPES = {
    circle: 'M50 5a45 45 0 1 1 0 90a45 45 0 1 1 0-90Z',
    shield: 'M50 5 88 18v28c0 25-16 41-38 49C28 87 12 71 12 46V18Z',
    hexagon: 'M50 4 90 27v46L50 96 10 73V27Z',
    seal: sealPath(16, 47, 41),
    star: sealPath(8, 48, 36),
    leaf: 'M50 5c24 9 40 28 39 50-1 22-17 38-39 40C28 93 12 77 11 55 10 33 26 14 50 5Z',
}

const TONES = {
    green: { fill: '#16a34a', rim: '#86efac' },
    teal: { fill: '#0d9488', rim: '#5eead4' },
    lime: { fill: '#65a30d', rim: '#d9f99d' },
    amber: { fill: '#d97706', rim: '#fcd34d' },
    sky: { fill: '#0284c7', rim: '#7dd3fc' },
    rose: { fill: '#e11d48', rim: '#fda4af' },
    indigo: { fill: '#4f46e5', rim: '#a5b4fc' },
    gold: { fill: '#b45309', rim: '#fde68a' },
}

const badges = [
    { id: 'welcome-wagon', name: 'Welcome Wagon', shape: 'circle', tone: 'green', Icon: HiOutlineHandRaised, have: 5, need: 5, unit: 'greetings', earned: '14 Jan 2026', rarity: 41, desc: 'Say hello to five new neighbours during their first week on Maple Street.', steps: ['Open “New on Maple Street”', 'Leave a welcome note on an intro post', 'Greet five different neighbours'], cta: { label: 'See new neighbours', href: 'new-neighbours' } },
    { id: 'good-samaritan', name: 'Good Samaritan', shape: 'shield', tone: 'teal', Icon: HiOutlineChatBubbleLeftRight, have: 7, need: 10, unit: 'answers', rarity: 12, desc: 'Answer ten questions in Ask Maple Street that the asker marks as helpful.', steps: ['Open Ask Maple Street', 'Reply with something useful', 'Get ten answers marked helpful'], cta: { label: 'Answer a question', href: 'questions' } },
    { id: 'green-thumb', name: 'Green Thumb', shape: 'leaf', tone: 'lime', Icon: HiOutlineSun, have: 3, need: 3, unit: 'garden tips', earned: '2 May 2026', rarity: 23, desc: 'Share three gardening tips or seed swaps in the Allotment group.', steps: ['Join the Allotment group', 'Post a tip, photo or seed swap', 'Share three of them'], cta: { label: 'Visit the Allotment', href: 'allotment' } },
    { id: 'lost-and-found', name: 'Lost & Found Hero', shape: 'hexagon', tone: 'amber', Icon: HiOutlineMagnifyingGlass, have: 1, need: 1, unit: 'reunion', earned: '19 Jun 2026', rarity: 6, desc: 'Help reunite a lost pet or item with its owner through a Lost & Found post.', steps: ['Spot a Lost & Found post', 'Reply with a sighting or the item', 'Owner confirms it’s back home'], cta: { label: 'Browse Lost & Found', href: 'lost-and-found' } },
    { id: 'street-sweeper', name: 'Street Sweeper', shape: 'seal', tone: 'sky', Icon: HiOutlineSparkles, have: 1, need: 2, unit: 'clean-ups', rarity: 15, desc: 'Join two neighbourhood clean-up events and check in on the day.', steps: ['RSVP to a clean-up event', 'Check in with the organiser’s QR code', 'Attend two events'], cta: { label: 'See upcoming clean-ups', href: 'clean-ups' } },
    { id: 'swap-star', name: 'Swap Star', shape: 'star', tone: 'rose', Icon: HiOutlineArrowsRightLeft, have: 5, need: 5, unit: 'swaps', earned: '30 Jul 2026', rarity: 19, desc: 'Complete five swaps or giveaways in the Free & Swap marketplace.', steps: ['List something to swap or give away', 'Arrange a pick-up', 'Mark five swaps as done'], cta: { label: 'Open Free & Swap', href: 'free-and-swap' } },
    { id: 'night-owl', name: 'Night Owl Watch', shape: 'shield', tone: 'indigo', Icon: HiOutlineMoon, have: 0, need: 3, unit: 'safety alerts', rarity: 4, desc: 'Post three verified safety alerts — street-light outages, flooding or road hazards.', steps: ['Tap “Safety alert” when posting', 'Add a photo and the exact spot', 'Three alerts verified by moderators'], cta: { label: 'Post a safety alert', href: 'safety' } },
    { id: 'recommendation-guru', name: 'Recommendation Guru', shape: 'circle', tone: 'amber', Icon: HiOutlineStar, have: 18, need: 25, unit: 'helpful votes', rarity: 9, desc: 'Collect 25 helpful votes on your recommendations for local plumbers, cafés and more.', steps: ['Answer a “Can anyone recommend…” post', 'Add why you recommend them', 'Reach 25 helpful votes'], cta: { label: 'See open requests', href: 'recommendations' } },
    { id: 'event-host', name: 'Event Host', shape: 'hexagon', tone: 'green', Icon: HiOutlineCalendarDays, have: 1, need: 1, unit: 'event', earned: '23 Aug 2026', rarity: 11, desc: 'Host a neighbourhood event that at least eight neighbours attend.', steps: ['Create an event with a date and place', 'Invite the street', 'Eight neighbours check in'], cta: { label: 'Plan an event', href: 'events' } },
    { id: 'tool-lender', name: 'Tool Library Lender', shape: 'seal', tone: 'teal', Icon: HiOutlineWrenchScrewdriver, have: 3, need: 8, unit: 'loans', rarity: 8, desc: 'Lend tools from your shed through the street’s shared Tool Library eight times.', steps: ['Add a tool to the Tool Library', 'Approve a borrow request', 'Complete eight loans'], cta: { label: 'Add a tool', href: 'tool-library' } },
    { id: 'block-captain', name: 'Block Captain', shape: 'star', tone: 'gold', Icon: HiOutlineTrophy, have: 0, need: 1, unit: 'monthly vote', rarity: 1, desc: 'Be voted top helper of the month by your neighbours. Only one captain per street, per month.', steps: ['Earn at least five other badges', 'Get nominated by a neighbour', 'Win the monthly street vote'], cta: { label: 'See this month’s nominees', href: 'block-captain' } },
    { id: 'founding-neighbour', name: 'Founding Neighbour', shape: 'shield', tone: 'rose', Icon: HiOutlineHome, have: 1, need: 1, unit: 'beta', earned: '3 Feb 2024', rarity: 2, desc: 'Joined Maple Street during the 2024 beta and helped shape the first community rules.', steps: ['Join during the 2024 beta', 'Vote on the first community rules', 'Stay a member ever since'], cta: { label: 'Read the community rules', href: 'rules' } },
]

const collectors = [
    { id: 'rosa', name: 'Rosa Ibáñez', street: 'Maple St. 14', count: 11, photo: '1494790108377-be9c29b29330' },
    { id: 'tom', name: 'Tom Becker', street: 'Maple St. 3', count: 9, photo: '1539571696357-5a69c17a67c6' },
    { id: 'aiko', name: 'Aiko Tanaka', street: 'Elm Row 8', count: 8, photo: '1554151228-14d9def656e4' },
    { id: 'you', name: 'Priya Raman', street: 'Maple St. 22', count: 6, photo: '1573497019940-1c28c88b4f3e', you: true },
    { id: 'dan', name: 'Dan Okoye', street: 'Maple St. 9', count: 5, photo: '1506277886164-e25aa3f4ef7f' },
]

const portrait = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`
const isEarned = (b) => b.have >= b.need
const earnedCount = badges.filter(isEarned).length

function Medal({ badge, className, ring = true }) {
    const earned = isEarned(badge)
    const tone = TONES[badge.tone]
    const pct = badge.have / badge.need
    const C = 2 * Math.PI * 48
    const { Icon } = badge
    return (
        <div className={cn('relative', className)}>
            <svg aria-hidden="true" viewBox="-4 -4 108 108" className="size-full overflow-visible">
                {!earned && ring && (
                    <g>
                        <circle cx="50" cy="50" r="48" fill="none" stroke="#e5ece7" strokeWidth="3" />
                        <circle
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke="#16a34a"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${C * pct} ${C}`}
                            transform="rotate(-90 50 50)"
                        />
                    </g>
                )}
                <g transform={earned || !ring ? undefined : 'translate(50 50) scale(0.86) translate(-50 -50)'}>
                    <path d={SHAPES[badge.shape]} fill={earned ? tone.fill : '#f1f5f4'} stroke={earned ? 'none' : '#d7e0da'} strokeWidth="1.5" />
                    <path
                        d={SHAPES[badge.shape]}
                        transform="translate(50 50) scale(0.8) translate(-50 -50)"
                        fill="none"
                        stroke={earned ? tone.rim : '#c3cdc6'}
                        strokeWidth="2.5"
                        strokeDasharray={earned ? undefined : '4 5'}
                    />
                    {earned && <ellipse cx="42" cy="30" rx="22" ry="11" fill="#ffffff" opacity="0.16" transform="rotate(-20 42 30)" />}
                </g>
            </svg>
            <Icon
                aria-hidden="true"
                className={cn('absolute left-1/2 top-1/2 size-[36%] -translate-x-1/2 -translate-y-1/2', earned ? 'text-white' : 'text-[#94a3b8]')}
            />
            {!earned && (
                <span className="absolute bottom-[4%] right-[4%] inline-flex size-[30%] min-h-5 min-w-5 items-center justify-center rounded-full bg-[#10231a] text-white ring-2 ring-white">
                    <HiLockClosed aria-hidden="true" className="size-[55%]" />
                </span>
            )}
        </div>
    )
}

function BadgeDetail({ badge, headingId }) {
    const earned = isEarned(badge)
    const pct = Math.round((badge.have / badge.need) * 100)
    return (
        <div>
            <div className="flex items-center gap-4">
                <Medal badge={badge} className="size-24 shrink-0" ring={false} />
                <div className="min-w-0">
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
                            earned ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#f1f5f4] text-[#5b6b60]',
                        )}
                    >
                        {earned ? <HiCheck aria-hidden="true" className="size-3.5" /> : <HiLockClosed aria-hidden="true" className="size-3.5" />}
                        {earned ? `Earned ${badge.earned}` : `In progress · ${pct}%`}
                    </span>
                    <h3 id={headingId} className="mt-2 text-2xl font-extrabold tracking-tight text-[#10231a]">
                        {badge.name}
                    </h3>
                </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#5b6b60]">{badge.desc}</p>

            <div className="mt-5">
                <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-[#10231a]">Progress</span>
                    <span className="tabular-nums text-[#5b6b60]">
                        <strong className="font-bold text-[#10231a]">{badge.have}</strong> / {badge.need} {badge.unit}
                    </span>
                </div>
                <div
                    role="progressbar"
                    aria-label={`${badge.name} progress`}
                    aria-valuemin={0}
                    aria-valuemax={badge.need}
                    aria-valuenow={badge.have}
                    className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e5ece7]"
                >
                    <div className="h-full rounded-full bg-[#16a34a]" style={{ width: `${pct}%` }} />
                </div>
            </div>

            <h4 className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#5b6b60]">How to earn</h4>
            <ol className="mt-3 grid gap-2.5">
                {badge.steps.map((step, i) => {
                    const done = earned || (badge.have > 0 && i < badge.steps.length - 1)
                    return (
                        <li key={step} className="flex items-start gap-3 text-sm text-[#10231a]">
                            <span
                                className={cn(
                                    'mt-px inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                    done ? 'bg-[#16a34a] text-white' : 'border border-[#cfdad3] text-[#5b6b60]',
                                )}
                            >
                                {done ? <HiCheck aria-hidden="true" className="size-3.5" /> : i + 1}
                            </span>
                            <span className={cn('leading-snug', done && 'text-[#5b6b60]')}>
                                {step}
                                {done && <span className="sr-only"> (done)</span>}
                            </span>
                        </li>
                    )
                })}
            </ol>

            <p className="mt-6 rounded-2xl bg-[#f0fdf4] px-4 py-3 text-sm text-[#15803d]">
                Earned by <strong className="font-bold">{badge.rarity}%</strong> of Maple Street neighbours
                {badge.rarity <= 5 ? ' — one of the rarest.' : '.'}
            </p>

            <a
                href={`#neighbour-net-${badge.cta.href}`}
                className="group mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#16a34a] px-5 text-sm font-bold text-white transition-colors hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
            >
                {badge.cta.label}
                <HiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
        </div>
    )
}

export function BadgeCaseLeaderboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const uid = useId()
    const closeRef = useRef(null)
    const triggerRef = useRef(null)
    const [filter, setFilter] = useState('all')
    const [selected, setSelected] = useState('good-samaritan')
    const [sheetOpen, setSheetOpen] = useState(false)

    const badge = badges.find((b) => b.id === selected)
    const shown = badges.filter((b) => (filter === 'all' ? true : filter === 'earned' ? isEarned(b) : !isEarned(b)))
    const nextUp = badges.filter((b) => !isEarned(b) && b.have > 0).sort((a, b) => b.have / b.need - a.have / a.need)[0]

    const closeSheet = () => {
        setSheetOpen(false)
        triggerRef.current?.focus()
    }

    useEffect(() => {
        if (!sheetOpen) return undefined
        closeRef.current?.focus()
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setSheetOpen(false)
                triggerRef.current?.focus()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [sheetOpen])

    const pick = (b, e) => {
        setSelected(b.id)
        triggerRef.current = e.currentTarget
        const desktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
        if (!desktop) setSheetOpen(true)
    }

    const chips = [
        { id: 'all', label: 'All', count: badges.length },
        { id: 'earned', label: 'Earned', count: earnedCount },
        { id: 'progress', label: 'In progress', count: badges.length - earnedCount },
    ]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white py-16 text-base font-normal text-[#10231a] sm:py-20 lg:py-24', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(#bbf7d0_1.2px,transparent_1.2px)] bg-[size:18px_18px] [mask-image:linear-gradient(to_bottom,#000,transparent)]"
            />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#15803d] shadow-sm ring-1 ring-[#dcfce7]">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                                <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="#16a34a" />
                                <path d="M15 8c3-3 6-2 6-2s0 4-3 6" fill="none" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Neighbour Net · Maple Street
                        </p>
                        <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-[#10231a] sm:text-5xl lg:text-6xl">
                            Your badge case
                        </h2>
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-[#5b6b60]">
                            Every badge is a small thank-you from the street. Tap one to see what it’s for and how
                            close you are.
                        </p>
                    </div>

                    <div className="w-full max-w-sm rounded-3xl border border-[#e5ece7] bg-white p-5 shadow-[0_20px_40px_-30px_rgba(16,35,26,0.5)]">
                        <p className="flex items-baseline justify-between">
                            <span className="text-sm font-semibold text-[#5b6b60]">Collection</span>
                            <span className="text-sm text-[#5b6b60]">
                                <strong className="text-2xl font-extrabold tabular-nums text-[#10231a]">{earnedCount}</strong> / {badges.length} earned
                            </span>
                        </p>
                        <div className="mt-3 flex gap-1" aria-hidden="true">
                            {badges.map((b) => (
                                <span key={b.id} className={cn('h-2 flex-1 rounded-full', isEarned(b) ? 'bg-[#16a34a]' : 'bg-[#e5ece7]')} />
                            ))}
                        </div>
                        {nextUp && (
                            <p className="mt-3 text-sm text-[#5b6b60]">
                                Next up: <strong className="font-semibold text-[#10231a]">{nextUp.name}</strong> —{' '}
                                {nextUp.need - nextUp.have} {nextUp.unit} to go
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="min-w-0">
                        <div role="group" aria-label="Filter badges" className="flex flex-wrap gap-2">
                            {chips.map((chip) => (
                                <button
                                    key={chip.id}
                                    type="button"
                                    aria-pressed={filter === chip.id}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]',
                                        filter === chip.id ? 'bg-[#10231a] text-white' : 'bg-[#f0fdf4] text-[#15803d] hover:bg-[#dcfce7]',
                                    )}
                                    onClick={() => setFilter(chip.id)}
                                >
                                    {chip.label}
                                    <span
                                        className={cn(
                                            'rounded-full px-1.5 text-xs tabular-nums',
                                            filter === chip.id ? 'bg-white/15' : 'bg-white text-[#15803d]',
                                        )}
                                    >
                                        {chip.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                            {shown.map((b) => {
                                const earned = isEarned(b)
                                const active = selected === b.id
                                return (
                                    <li key={b.id}>
                                        <button
                                            type="button"
                                            aria-pressed={active}
                                            aria-haspopup="dialog"
                                            aria-label={`${b.name}, ${earned ? `earned ${b.earned}` : `locked, ${b.have} of ${b.need} ${b.unit}`}`}
                                            className={cn(
                                                'group flex h-full w-full flex-col items-center rounded-3xl border bg-white px-3 pb-4 pt-5 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]',
                                                active
                                                    ? 'border-[#16a34a] ring-2 ring-[#16a34a]/30'
                                                    : 'border-[#e5ece7] hover:border-[#bbf7d0] hover:shadow-[0_16px_30px_-24px_rgba(22,163,74,0.8)]',
                                            )}
                                            onClick={(e) => pick(b, e)}
                                        >
                                            <Medal
                                                badge={b}
                                                className="size-20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100 sm:size-24"
                                            />
                                            <span className="mt-3 text-sm font-bold leading-tight text-[#10231a]">{b.name}</span>
                                            {earned ? (
                                                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#15803d]">
                                                    <HiCheck aria-hidden="true" className="size-3.5" />
                                                    {b.earned}
                                                </span>
                                            ) : (
                                                <span className="mt-1.5 w-full max-w-28">
                                                    <span className="block text-xs font-semibold tabular-nums text-[#5b6b60]">
                                                        {b.have} / {b.need} {b.unit}
                                                    </span>
                                                    <span aria-hidden="true" className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[#e5ece7]">
                                                        <span className="block h-full rounded-full bg-[#16a34a]" style={{ width: `${(b.have / b.need) * 100}%` }} />
                                                    </span>
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
                        <aside aria-label="Badge details" className="hidden rounded-3xl border border-[#e5ece7] bg-white p-6 shadow-[0_24px_48px_-36px_rgba(16,35,26,0.55)] lg:block">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={badge.id}
                                    initial={reduce ? false : { opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <BadgeDetail badge={badge} headingId={`${uid}-side-title`} />
                                </motion.div>
                            </AnimatePresence>
                        </aside>

                        <div className="rounded-3xl bg-[#f0fdf4] p-5 sm:p-6">
                            <h3 className="text-base font-extrabold text-[#10231a]">Top collectors on Maple Street</h3>
                            <ol className="mt-4 grid gap-1.5">
                                {collectors.map((c, i) => (
                                    <li
                                        key={c.id}
                                        aria-current={c.you ? 'true' : undefined}
                                        className={cn('flex items-center gap-3 rounded-2xl px-3 py-2', c.you ? 'bg-white ring-2 ring-[#16a34a]' : 'bg-white/60')}
                                    >
                                        <span className="w-5 text-sm font-extrabold tabular-nums text-[#15803d]">{i + 1}</span>
                                        <img src={portrait(c.photo)} alt="" loading="lazy" className="size-9 rounded-full object-cover" />
                                        <span className="min-w-0 flex-1">
                                            <a
                                                href={`#neighbour-net-member-${c.id}`}
                                                className="block truncate text-sm font-bold text-[#10231a] hover:text-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
                                            >
                                                {c.you ? `${c.name} (you)` : c.name}
                                            </a>
                                            <span className="block truncate text-xs text-[#5b6b60]">{c.street}</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2.5 py-1 text-xs font-bold tabular-nums text-[#15803d]">
                                            <HiOutlineTrophy aria-hidden="true" className="size-3.5" />
                                            {c.count}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {sheetOpen && (
                    <motion.div key="badge-sheet" className="fixed inset-0 z-50 lg:hidden">
                        <motion.div
                            aria-hidden="true"
                            className="absolute inset-0 bg-[#10231a]/45 backdrop-blur-[2px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.2 }}
                            onClick={closeSheet}
                        />
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`${uid}-sheet-title`}
                            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] bg-white px-5 pb-8 pt-3 shadow-[0_-20px_40px_-20px_rgba(16,35,26,0.4)] sm:px-8"
                            initial={reduce ? { opacity: 0 } : { y: '100%' }}
                            animate={reduce ? { opacity: 1 } : { y: 0 }}
                            exit={reduce ? { opacity: 0 } : { y: '100%' }}
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 36 }}
                        >
                            <div className="mx-auto max-w-lg">
                                <div className="flex items-center justify-between">
                                    <span aria-hidden="true" className="mx-auto h-1.5 w-12 rounded-full bg-[#e5ece7]" />
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <button
                                        ref={closeRef}
                                        type="button"
                                        aria-label="Close badge details"
                                        className="inline-flex size-10 items-center justify-center rounded-full bg-[#f1f5f4] text-[#10231a] transition-colors hover:bg-[#e5ece7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
                                        onClick={closeSheet}
                                    >
                                        <HiXMark aria-hidden="true" className="size-5" />
                                    </button>
                                </div>
                                <BadgeDetail badge={badge} headingId={`${uid}-sheet-title`} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default BadgeCaseLeaderboard

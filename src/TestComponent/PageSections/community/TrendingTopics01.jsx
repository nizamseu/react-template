// RankedHashtagTrendingTopics

// TrendingTopics01 · Social Networks & Communities › Trending Topics / Hashtags

// Description:
// A clean, ranked "Explore" board for the fictional micro-blogging network Chirpline. Under
// the heading "What the timeline can’t stop chirping about." it lists fourteen hashtags
// (e.g. "#OpenSourceFriday", "#TransferDeadline") with their global rank, category label,
// rank movement, a one-line context note, chirp count and a Follow toggle, plus a sky-blue
// "Your topics" card. Use it on an explore page, a sidebar-less trends page or a feed rail.

// Design:
// - Two columns on lg (ranked list + 20rem sticky aside), stacked below; max-w-6xl container
//   with a soft #e0f2fe glow blob in the corner (clipped by overflow-hidden on the root)
// - White #ffffff surface, slate ink #0f172a / #475569, Chirpline sky #0284c7 accents;
//   emerald #047857 / rose #be123c only for rank movement, always with an arrow + text
// - Oversized rank numerals (text-4xl → sm:text-6xl): #1–#3 filled sky, the rest outlined
//   with a 1.5px #7dd3fc text stroke; hashtags semibold text-lg → sm:text-xl; pill buttons
// - Filter tabs with a sliding sky pill (framer-motion layoutId); rows fade/slide in when
//   revealed and re-flow with layout animation (both off for reduced motion)
// - Responsive: tabs scroll sideways on narrow screens, Follow collapses to an icon button
//   below sm, the "Your topics" card drops under the list below lg

// What it does:
// - Tabs (All / Tech / Sports / Culture / News) filter the list and reset the "Show more"
//   state; ranks stay global so "#7" always means seventh worldwide
// - "Show more (n)" reveals the rest of the filtered list (aria-expanded) and flips to
//   "Show less"; the list starts with six rows
// - Follow toggles (aria-pressed) add or remove a tag from "Your topics", which updates the
//   count, the combined chirp total and a chip list whose × buttons unfollow; changes are
//   announced in an aria-live region
// - Hashtags link to #chirpline-tag-<id> and "Trend settings" to #chirpline-trend-settings

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RankedHashtagTrendingTopics from '@/TestComponent/PageSections/community/TrendingTopics01';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <RankedHashtagTrendingTopics />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiArrowTrendingDown,
    HiArrowTrendingUp,
    HiCheck,
    HiChevronDown,
    HiMinus,
    HiPlus,
    HiSparkles,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const PAGE = 6

const tabs = [
    { id: 'all', label: 'All' },
    { id: 'tech', label: 'Tech' },
    { id: 'sports', label: 'Sports' },
    { id: 'culture', label: 'Culture' },
    { id: 'news', label: 'News' },
]

const trends = [
    {
        id: 'open-source-friday',
        tag: 'OpenSourceFriday',
        group: 'tech',
        category: 'Technology',
        posts: 48200,
        move: 'up',
        delta: 3,
        note: 'Maintainers are sharing the first pull request they ever got merged',
    },
    {
        id: 'harvest-moon',
        tag: 'HarvestMoon',
        group: 'news',
        category: 'Science · Space',
        posts: 41700,
        move: 'new',
        note: 'Photos of tonight’s moonrise are pouring in from 60+ countries',
    },
    {
        id: 'transfer-deadline',
        tag: 'TransferDeadline',
        group: 'sports',
        category: 'Sports · Football',
        posts: 36900,
        move: 'down',
        delta: 1,
        note: 'Six hours left and three clubs still chasing the same striker',
    },
    {
        id: 'city-cycle-week',
        tag: 'CityCycleWeek',
        group: 'news',
        category: 'Local · Transport',
        posts: 29400,
        move: 'up',
        delta: 5,
        note: 'Riders are mapping the new protected lanes, street by street',
    },
    {
        id: 'indie-game-fest',
        tag: 'IndieGameFest',
        group: 'tech',
        category: 'Gaming',
        posts: 24100,
        move: 'same',
        note: 'The cosy-farming demo with a talking goose is winning the weekend',
    },
    {
        id: 'booktok-classics',
        tag: 'BookTokClassics',
        group: 'culture',
        category: 'Books',
        posts: 19800,
        move: 'up',
        delta: 2,
        note: 'Readers are ranking the Brontë sisters — and nobody agrees',
    },
    {
        id: 'heatwave-tips',
        tag: 'HeatwaveTips',
        group: 'news',
        category: 'Weather',
        posts: 17300,
        move: 'down',
        delta: 4,
        note: 'Cooling-centre hours and the wet-towel trick, shared by city services',
    },
    {
        id: 'night-market-eats',
        tag: 'NightMarketEats',
        group: 'culture',
        category: 'Food & Drink',
        posts: 15600,
        move: 'up',
        delta: 1,
        note: 'The queue for the ube soft-serve stand reached the river again',
    },
    {
        id: 'vinyl-revival',
        tag: 'VinylRevival',
        group: 'culture',
        category: 'Music',
        posts: 12200,
        move: 'same',
        note: 'Crate-diggers are posting their best £1 finds of the month',
    },
    {
        id: 'marathon-training',
        tag: 'MarathonTraining',
        group: 'sports',
        category: 'Fitness',
        posts: 10900,
        move: 'up',
        delta: 6,
        note: 'Four weeks to race day: long-run playlists and blister confessions',
    },
    {
        id: 'remote-work-diaries',
        tag: 'RemoteWorkDiaries',
        group: 'tech',
        category: 'Careers',
        posts: 9400,
        move: 'down',
        delta: 2,
        note: 'Desk setups, quiet hours and the great return-to-office debate',
    },
    {
        id: 'tiny-home-tours',
        tag: 'TinyHomeTours',
        group: 'culture',
        category: 'Lifestyle',
        posts: 8100,
        move: 'new',
        note: 'A 19 m² canal boat with a bathtub has the whole feed jealous',
    },
    {
        id: 'derby-day',
        tag: 'DerbyDay',
        group: 'sports',
        category: 'Sports · Rugby',
        posts: 7200,
        move: 'up',
        delta: 3,
        note: 'Kick-off at 3 pm and the fan zone is already singing',
    },
    {
        id: 'keyboard-mods',
        tag: 'KeyboardMods',
        group: 'tech',
        category: 'Hardware',
        posts: 6300,
        move: 'same',
        note: 'Lubed switches, foam mods and one very loud typing test',
    },
].map((trend, index) => ({ ...trend, rank: index + 1 }))

const MAX_POSTS = trends[0].posts

const formatK = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}K` : String(n))

function Movement({ trend }) {
    if (trend.move === 'new') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e0f2fe] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#0369a1]">
                <HiSparkles aria-hidden="true" className="size-3" />
                New
            </span>
        )
    }
    if (trend.move === 'same') {
        return (
            <span className="inline-flex items-center gap-1 text-[#64748b]">
                <HiMinus aria-hidden="true" className="size-3.5" />
                Steady
            </span>
        )
    }
    const up = trend.move === 'up'
    const Icon = up ? HiArrowTrendingUp : HiArrowTrendingDown
    return (
        <span className={cn('inline-flex items-center gap-1 font-semibold', up ? 'text-[#047857]' : 'text-[#be123c]')}>
            <Icon aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{up ? 'Up' : 'Down'}</span>
            {trend.delta}
            <span className="sr-only">{trend.delta === 1 ? 'place' : 'places'}</span>
        </span>
    )
}

function ChirplineMark() {
    return (
        <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8">
            <rect width="32" height="32" rx="10" fill="#0284c7" />
            <path d="M8 19c3.5 0 6-2 7.5-5.5C17 10 19.5 8.5 23 9l1.5-1.5-.5 3.5c.5 5.5-3.5 11-10 11-2.5 0-4.5-.8-6-2z" fill="#ffffff" />
            <circle cx="20.5" cy="11.5" r="1" fill="#0284c7" />
        </svg>
    )
}

export function RankedHashtagTrendingTopics({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const uid = useId()
    const listId = `${uid}-list`
    const [tab, setTab] = useState('all')
    const [expanded, setExpanded] = useState(false)
    const [following, setFollowing] = useState(['city-cycle-week', 'vinyl-revival'])
    const [announcement, setAnnouncement] = useState('')

    const filtered = tab === 'all' ? trends : trends.filter((trend) => trend.group === tab)
    const visible = expanded ? filtered : filtered.slice(0, PAGE)
    const followed = following.map((id) => trends.find((trend) => trend.id === id)).filter(Boolean)
    const followedPosts = followed.reduce((sum, trend) => sum + trend.posts, 0)

    const toggleFollow = (trend) => {
        const isFollowing = following.includes(trend.id)
        setFollowing((prev) => (isFollowing ? prev.filter((id) => id !== trend.id) : [...prev, trend.id]))
        setAnnouncement(isFollowing ? `Unfollowed #${trend.tag}` : `Following #${trend.tag}`)
    }

    const selectTab = (id) => {
        setTab(id)
        setExpanded(false)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white py-16 text-base font-normal text-[#0f172a] sm:py-20 lg:py-24', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 -top-40 size-[30rem] rounded-full bg-[#e0f2fe] opacity-80 blur-3xl"
            />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-sm font-medium text-[#475569]">
                            <ChirplineMark />
                            <span className="font-semibold text-[#0f172a]">Chirpline Explore</span>
                            <span aria-hidden="true" className="size-1 rounded-full bg-[#94a3b8]" />
                            <span>Worldwide · updated 3 min ago</span>
                        </p>
                        <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
                            What the timeline can’t stop{' '}
                            <span className="text-[#0284c7]">chirping about.</span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-[#475569]">
                        Ranked by unique chirpers in the last 24 hours, weighted for how fast a tag is
                        climbing — not just how loud it is.
                    </p>
                </div>

                <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
                    <div className="min-w-0">
                        <div className="overflow-x-auto pb-1">
                            <div
                                role="tablist"
                                aria-label="Filter trends by topic"
                                className="inline-flex gap-1 rounded-full border border-[#e2e8f0] bg-[#f8fafc] p-1"
                            >
                                {tabs.map((item) => {
                                    const active = tab === item.id
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            aria-controls={listId}
                                            className={cn(
                                                'relative min-h-10 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]',
                                                active ? 'text-white' : 'text-[#475569] hover:text-[#0f172a]',
                                            )}
                                            onClick={() => selectTab(item.id)}
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId={`${uid}-tab-pill`}
                                                    aria-hidden="true"
                                                    className="absolute inset-0 rounded-full bg-[#0284c7] shadow-[0_6px_16px_-6px_rgba(2,132,199,0.7)]"
                                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                                />
                                            )}
                                            <span className="relative">{item.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <ol id={listId} role="tabpanel" aria-label={`${tabs.find((t) => t.id === tab).label} trends`} className="mt-6 border-t border-[#e2e8f0]">
                            <AnimatePresence initial={false} mode="popLayout">
                                {visible.map((trend) => {
                                    const isFollowing = following.includes(trend.id)
                                    return (
                                        <motion.li
                                            key={trend.id}
                                            layout={!reduce}
                                            initial={reduce ? false : { opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            className="group grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#e2e8f0] py-5 sm:grid-cols-[4.75rem_minmax(0,1fr)_auto] sm:gap-5"
                                        >
                                            <span
                                                aria-label={`Rank ${trend.rank}`}
                                                className={cn(
                                                    'text-4xl font-black leading-none tracking-tighter tabular-nums sm:text-6xl',
                                                    trend.rank <= 3
                                                        ? 'text-[#0284c7]'
                                                        : 'text-transparent [-webkit-text-stroke:1.5px_#7dd3fc]',
                                                )}
                                            >
                                                {trend.rank}
                                            </span>

                                            <div className="min-w-0">
                                                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#64748b]">
                                                    <span>{trend.category}</span>
                                                    <span aria-hidden="true">·</span>
                                                    <Movement trend={trend} />
                                                </p>
                                                <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-[#0f172a] sm:text-xl">
                                                    <a
                                                        href={`#chirpline-tag-${trend.id}`}
                                                        className="rounded-sm transition-colors hover:text-[#0284c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                                                    >
                                                        #{trend.tag}
                                                    </a>
                                                </h3>
                                                <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#475569] sm:line-clamp-1">
                                                    {trend.note}
                                                </p>
                                                <div className="mt-3 flex items-center gap-3">
                                                    <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-[#0f172a]">
                                                        {formatK(trend.posts)}{' '}
                                                        <span className="font-normal text-[#64748b]">chirps</span>
                                                    </span>
                                                    <span aria-hidden="true" className="h-1 w-full max-w-40 overflow-hidden rounded-full bg-[#e0f2fe]">
                                                        <span
                                                            className="block h-full rounded-full bg-[#0284c7]"
                                                            style={{ width: `${Math.max(6, (trend.posts / MAX_POSTS) * 100)}%` }}
                                                        />
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                aria-pressed={isFollowing}
                                                aria-label={`Follow #${trend.tag}`}
                                                className={cn(
                                                    'inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] sm:px-4',
                                                    isFollowing
                                                        ? 'bg-[#0284c7] text-white hover:bg-[#0369a1]'
                                                        : 'border border-[#bae6fd] bg-white text-[#0284c7] hover:border-[#0284c7] hover:bg-[#f0f9ff]',
                                                )}
                                                onClick={() => toggleFollow(trend)}
                                            >
                                                {isFollowing ? (
                                                    <HiCheck aria-hidden="true" className="size-4" />
                                                ) : (
                                                    <HiPlus aria-hidden="true" className="size-4" />
                                                )}
                                                <span className="hidden sm:inline">{isFollowing ? 'Following' : 'Follow'}</span>
                                            </button>
                                        </motion.li>
                                    )
                                })}
                            </AnimatePresence>
                        </ol>

                        {filtered.length > PAGE && (
                            <button
                                type="button"
                                aria-expanded={expanded}
                                aria-controls={listId}
                                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-5 text-sm font-semibold text-[#0284c7] transition-colors hover:border-[#0284c7] hover:bg-[#f0f9ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                                onClick={() => setExpanded((open) => !open)}
                            >
                                {expanded ? 'Show less' : `Show more (${filtered.length - PAGE})`}
                                <HiChevronDown
                                    aria-hidden="true"
                                    className={cn('size-4 transition-transform duration-300', expanded && 'rotate-180')}
                                />
                            </button>
                        )}
                    </div>

                    <aside aria-label="Your topics" className="self-start lg:sticky lg:top-6">
                        <div className="relative overflow-hidden rounded-[1.75rem] bg-[#0284c7] p-6 text-white shadow-[0_24px_48px_-24px_rgba(2,132,199,0.75)]">
                            <svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute -right-16 -top-16 size-56 text-white/15">
                                <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e0f2fe]">Your topics</p>
                            <p className="mt-3 flex items-baseline gap-2">
                                <span className="text-5xl font-semibold tabular-nums tracking-tight">{followed.length}</span>
                                <span className="text-sm text-[#e0f2fe]">followed</span>
                            </p>
                            <p className="mt-1 text-sm text-[#e0f2fe]">
                                {followed.length > 0
                                    ? `${formatK(followedPosts)} chirps from them today`
                                    : 'Follow a trend to pin it here.'}
                            </p>
                            <ul className="relative mt-5 flex flex-wrap gap-2">
                                <AnimatePresence initial={false}>
                                    {followed.map((trend) => (
                                        <motion.li
                                            key={trend.id}
                                            layout={!reduce}
                                            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.8 }}
                                            className="inline-flex max-w-full items-center rounded-full bg-white/15 pl-3 text-sm font-medium ring-1 ring-white/25"
                                        >
                                            <span className="truncate">#{trend.tag}</span>
                                            <button
                                                type="button"
                                                aria-label={`Unfollow #${trend.tag}`}
                                                className="ml-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
                                                onClick={() => toggleFollow(trend)}
                                            >
                                                <HiXMark aria-hidden="true" className="size-4" />
                                            </button>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        </div>

                        <div className="mt-4 rounded-[1.75rem] border border-[#e2e8f0] bg-[#f8fafc] p-6">
                            <p className="text-sm font-semibold text-[#0f172a]">Trends near Lisbon</p>
                            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                                #CityCycleWeek is 2× more active within 25 km of you than anywhere else.
                            </p>
                            <a
                                href="#chirpline-trend-settings"
                                className="group mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#0284c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                            >
                                Trend settings
                                <HiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </a>
                        </div>
                    </aside>
                </div>

                <p aria-live="polite" className="sr-only">
                    {announcement}
                </p>
            </div>
        </section>
    )
}

export default RankedHashtagTrendingTopics

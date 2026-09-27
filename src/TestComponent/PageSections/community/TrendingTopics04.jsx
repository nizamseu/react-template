// DiscussionCardTrendingTopics

// TrendingTopics04 · Social Networks & Communities › Trending Topics / Hashtags

// Description:
// A photo-first grid of trending discussions for the fictional photo-sharing app Snapshot.
// Under the heading "Trending discussions" six topic cards (e.g. "#AuroraWatch — Aurora
// forecast is KP 7 tonight, where are you shooting?") pair a cover photo with the question,
// the top comment and a stack of participant avatars, sorted by Hot, New or Most replies.
// Use it on an explore tab, a community landing page or a "what’s happening" rail.

// Design:
// - Pure black #000 section, white #fff type, zinc #a1a1aa secondary text, cards #0e0e0e
//   with white/10 borders and rounded-[28px]; Snapshot gradient #f97316 → #db2777 for the
//   wordmark ring, the gradient heading word, the active tab, rank chips and Join buttons
// - Bento grid: 1 → sm:2 → lg:3 columns; whichever card ranks first becomes the featured
//   card (sm:col-span-2, lg:col-span-2 + row-span-2 with a taller photo)
// - Cover photos with a bottom black scrim, hashtag set in heavy tight type over the photo;
//   the photo scales to 1.05 on hover (motion-reduce off)
// - Cards re-sort with framer-motion layout animation (springs), the tab pill slides via
//   layoutId; all motion is removed for reduced motion
// - Responsive: header stacks below md; tabs stay on one row; comment text clamps to 3
//   lines on small cards; every control is at least 40px tall

// What it does:
// - Tabs Hot / New / Most replies (role="tablist") re-order the cards by hot score, start
//   time or reply count, and the first card is promoted to the featured slot
// - The heart on each top comment toggles a like (aria-pressed) and updates its count
// - "Join" (aria-pressed) adds a "You" avatar to the participant stack and bumps the joined
//   count; "Joined" undoes it
// - Card titles link to #snapshot-topic-<id>; "Browse all discussions" to #snapshot-discussions

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DiscussionCardTrendingTopics from '@/TestComponent/PageSections/community/TrendingTopics04';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <DiscussionCardTrendingTopics />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiCheck, HiHeart, HiOutlineChatBubbleOvalLeft, HiOutlineHeart, HiOutlinePhoto } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const topics = [
    {
        id: 'golden-hour-city',
        tag: 'GoldenHourCity',
        question: 'Which city owns golden hour right now?',
        cover: '1519501025264-65ba15a82390',
        alt: 'City street glowing with warm light at dusk',
        posts: '18.4K',
        replies: 1204,
        joined: 2184,
        started: '2 h ago',
        startedMin: 120,
        hot: 98,
        comment: { user: 'lena.frames', photo: '1517841905240-472988babdf9', text: 'The 7:42 pm light bouncing off the tram wires on my street is unbeatable. Fight me.', likes: 842 },
        people: ['1494790108377-be9c29b29330', '1500648767791-00dcc994a43e', '1534528741775-53994a69daeb'],
    },
    {
        id: 'aurora-watch',
        tag: 'AuroraWatch',
        question: 'Aurora forecast is KP 7 tonight — where are you shooting?',
        cover: '1517411032315-54ef2cb783bb',
        alt: 'Green aurora rippling over a dark horizon',
        posts: '22.9K',
        replies: 2318,
        joined: 4506,
        started: '40 min ago',
        startedMin: 40,
        hot: 96,
        comment: { user: 'sol.north', photo: '1580489944761-15a19d654956', text: '15 s at f/2.8, ISO 1600 got me pillars I could see without the camera. Head north of the lake.', likes: 1390 },
        people: ['1506794778202-cad84cf45f1d', '1544005313-94ddf0286df2', '1539571696357-5a69c17a67c6'],
    },
    {
        id: 'neon-nights',
        tag: 'NeonNights',
        question: 'Best neon street for night photography?',
        cover: '1503899036084-c55cdd92da26',
        alt: 'Busy street lined with glowing neon signs at night',
        posts: '15.1K',
        replies: 986,
        joined: 1742,
        started: '5 h ago',
        startedMin: 300,
        hot: 91,
        comment: { user: 'kenji.after.dark', photo: '1542909168-82c3e7fdca5c', text: 'Go after rain. Wet asphalt doubles every sign, and the crowds thin out after 11.', likes: 611 },
        people: ['1524504388940-b1c1722653e1', '1570295999919-56ceb5ecca61', '1531123897727-8f129e1688ce'],
    },
    {
        id: 'front-row-friday',
        tag: 'FrontRowFriday',
        question: 'Post the best shot you took from the pit this summer',
        cover: '1470229722913-7c0e2dbbafd3',
        alt: 'Concert crowd with hands raised under bright stage lights',
        posts: '9.7K',
        replies: 1648,
        joined: 1120,
        started: '9 h ago',
        startedMin: 540,
        hot: 84,
        comment: { user: 'mira.gig', photo: '1438761681033-6461ffad8d80', text: 'Shot the encore on a 35 mm prime from the barrier. Lost my voice, kept the frame.', likes: 488 },
        people: ['1463453091185-61582044d556', '1502685104226-ee32379fefbe', '1527980965255-d3b416303d12'],
    },
    {
        id: 'summit-shots',
        tag: 'SummitShots',
        question: 'Sunrise from a summit: was the 3 am alarm worth it?',
        cover: '1492691527719-9d1e07e534b4',
        alt: 'Photographer standing on a mountain ridge above the clouds',
        posts: '11.3K',
        replies: 1057,
        joined: 1433,
        started: '12 min ago',
        startedMin: 12,
        hot: 79,
        comment: { user: 'alpine.ines', photo: '1544005313-94ddf0286df2', text: 'Every single time. Thermos, headlamp, and a spare battery in your inside pocket.', likes: 402 },
        people: ['1472099645785-5658abf4ff4e', '1554151228-14d9def656e4', '1566492031773-4f4e44671857'],
    },
    {
        id: 'film-is-not-dead',
        tag: 'FilmIsNotDead',
        question: 'What’s your go-to film stock for autumn light?',
        cover: '1516035069371-29a1b244cc32',
        alt: 'Camera body and lenses laid out on a table',
        posts: '6.2K',
        replies: 734,
        joined: 862,
        started: '1 day ago',
        startedMin: 1440,
        hot: 72,
        comment: { user: 'grain.theory', photo: '1599566150163-29194dcaad36', text: 'Portra 400 pushed one stop. Warm skin, forgiving shadows, zero regrets.', likes: 297 },
        people: ['1487412720507-e7ab37603c6f', '1552058544-f2b08422138a', '1546961329-78bef0414d7c'],
    },
]

const sorts = [
    { id: 'hot', label: 'Hot', fn: (a, b) => b.hot - a.hot },
    { id: 'new', label: 'New', fn: (a, b) => a.startedMin - b.startedMin },
    { id: 'replies', label: 'Most replies', fn: (a, b) => b.replies - a.replies },
]

const fmt = (n) => n.toLocaleString('en-US')

function SnapshotMark() {
    return (
        <span aria-hidden="true" className="relative inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#f97316] to-[#db2777] p-[2.5px]">
            <span className="flex size-full items-center justify-center rounded-full bg-black">
                <span className="size-2.5 rounded-full bg-white" />
            </span>
        </span>
    )
}

export function DiscussionCardTrendingTopics({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const uid = useId()
    const [sort, setSort] = useState('hot')
    const [liked, setLiked] = useState([])
    const [joined, setJoined] = useState(['aurora-watch'])

    const order = [...topics].sort(sorts.find((s) => s.id === sort).fn)
    const toggle = (setter, id) => setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-black py-16 text-base font-normal text-white sm:py-20 lg:py-24', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-48 left-1/2 h-96 w-[48rem] max-w-none -translate-x-1/2 rounded-full bg-gradient-to-r from-[#f97316]/25 to-[#db2777]/25 blur-3xl"
            />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2.5 text-sm font-semibold text-white">
                            <SnapshotMark />
                            snapshot
                            <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-medium text-[#a1a1aa]">Explore</span>
                        </p>
                        <h2 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                            Trending
                            <br />
                            <span className="bg-gradient-to-r from-[#f97316] to-[#db2777] bg-clip-text pr-1 text-transparent">discussions</span>
                        </h2>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-[#a1a1aa]">
                            The threads everyone is posting into today — jump in with a photo or just lurk the
                            top comments.
                        </p>
                    </div>

                    <div role="tablist" aria-label="Sort discussions" className="inline-flex self-start rounded-full border border-white/15 bg-white/5 p-1 md:self-auto">
                        {sorts.map((s) => {
                            const active = sort === s.id
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    className={cn(
                                        'relative min-h-10 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5',
                                        active ? 'text-white' : 'text-[#a1a1aa] hover:text-white',
                                    )}
                                    onClick={() => setSort(s.id)}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId={`${uid}-sort`}
                                            aria-hidden="true"
                                            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f97316] to-[#db2777]"
                                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }}
                                        />
                                    )}
                                    <span className="relative">{s.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                    {order.map((topic, index) => {
                        const featured = index === 0
                        const isLiked = liked.includes(topic.id)
                        const isJoined = joined.includes(topic.id)
                        return (
                            <motion.article
                                key={topic.id}
                                layout={!reduce}
                                transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                                className={cn(
                                    'group relative flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0e0e0e]',
                                    featured && 'sm:col-span-2 lg:row-span-2',
                                )}
                            >
                                <motion.div
                                    layout={reduce ? false : 'position'}
                                    className={cn('relative overflow-hidden', featured ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[20rem] lg:flex-1' : 'aspect-[16/10]')}
                                >
                                    <img
                                        src={img(topic.cover, featured ? 1400 : 800)}
                                        alt={topic.alt}
                                        loading={featured ? 'eager' : 'lazy'}
                                        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                    />
                                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
                                    <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                                        <span className="rounded-full bg-gradient-to-r from-[#f97316] to-[#db2777] p-px">
                                            <span className="block rounded-full bg-black/80 px-3 py-1 text-xs font-bold tabular-nums text-white backdrop-blur">
                                                #{index + 1} · {sorts.find((s) => s.id === sort).label}
                                            </span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                                            <HiOutlinePhoto aria-hidden="true" className="size-3.5" />
                                            {topic.posts} posts
                                        </span>
                                    </div>
                                    <p
                                        className={cn(
                                            'absolute inset-x-4 bottom-4 truncate font-black tracking-[-0.03em] text-white sm:inset-x-6',
                                            featured ? 'text-3xl sm:text-5xl' : 'text-2xl',
                                        )}
                                    >
                                        #{topic.tag}
                                    </p>
                                </motion.div>

                                <motion.div layout={reduce ? false : 'position'} className={cn('flex flex-col gap-4 p-4', featured ? 'sm:p-6' : 'flex-1 sm:p-5')}>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#a1a1aa]">
                                        <span>Started {topic.started}</span>
                                        <span aria-hidden="true">·</span>
                                        <span className="inline-flex items-center gap-1">
                                            <HiOutlineChatBubbleOvalLeft aria-hidden="true" className="size-3.5" />
                                            {fmt(topic.replies)} replies
                                        </span>
                                    </div>
                                    <h3 className={cn('font-bold leading-snug tracking-tight text-white', featured ? 'text-2xl sm:text-3xl' : 'text-lg')}>
                                        <a
                                            href={`#snapshot-topic-${topic.id}`}
                                            className="rounded-sm transition-colors hover:text-[#fdba74] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            {topic.question}
                                        </a>
                                    </h3>

                                    <figure className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                                        <figcaption className="flex items-center gap-2.5">
                                            <img
                                                src={img(topic.comment.photo, 400)}
                                                alt={`@${topic.comment.user}`}
                                                loading="lazy"
                                                className="size-8 shrink-0 rounded-full object-cover"
                                            />
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-semibold text-white">@{topic.comment.user}</span>
                                                <span className="block text-[11px] uppercase tracking-[0.16em] text-[#a1a1aa]">Top comment</span>
                                            </span>
                                            <button
                                                type="button"
                                                aria-pressed={isLiked}
                                                aria-label={`Like comment by @${topic.comment.user}`}
                                                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold tabular-nums text-[#d4d4d8] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                                onClick={() => toggle(setLiked, topic.id)}
                                            >
                                                <motion.span
                                                    key={isLiked ? 'on' : 'off'}
                                                    initial={reduce || !isLiked ? false : { scale: 0.4 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                                    className="inline-flex"
                                                >
                                                    {isLiked ? (
                                                        <HiHeart aria-hidden="true" className="size-4 text-[#f43f5e]" />
                                                    ) : (
                                                        <HiOutlineHeart aria-hidden="true" className="size-4" />
                                                    )}
                                                </motion.span>
                                                {fmt(topic.comment.likes + (isLiked ? 1 : 0))}
                                            </button>
                                        </figcaption>
                                        <blockquote className={cn('mt-2.5 text-sm leading-relaxed text-[#d4d4d8]', !featured && 'line-clamp-3')}>
                                            “{topic.comment.text}”
                                        </blockquote>
                                    </figure>

                                    <div className="mt-auto flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <div className="flex shrink-0 -space-x-2.5">
                                                {isJoined && (
                                                    <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#f97316] to-[#db2777] text-[10px] font-bold text-white ring-2 ring-[#0e0e0e]">
                                                        You
                                                    </span>
                                                )}
                                                {topic.people.map((p, i) => (
                                                    <img
                                                        key={p}
                                                        src={img(p, 400)}
                                                        alt=""
                                                        loading="lazy"
                                                        className={cn('size-8 rounded-full object-cover ring-2 ring-[#0e0e0e]', isJoined && i === 2 && 'hidden sm:block')}
                                                    />
                                                ))}
                                            </div>
                                            <p className="truncate text-xs text-[#a1a1aa]">
                                                <span className="font-semibold tabular-nums text-white">{fmt(topic.joined + (isJoined ? 1 : 0))}</span> joined
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            aria-pressed={isJoined}
                                            aria-label={`Join the #${topic.tag} discussion`}
                                            className={cn(
                                                'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                                                isJoined
                                                    ? 'border border-white/25 text-white hover:bg-white/10'
                                                    : 'bg-gradient-to-r from-[#f97316] to-[#db2777] text-white hover:brightness-110',
                                            )}
                                            onClick={() => toggle(setJoined, topic.id)}
                                        >
                                            {isJoined && <HiCheck aria-hidden="true" className="size-4" />}
                                            {isJoined ? 'Joined' : 'Join'}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.article>
                        )
                    })}
                </div>

                <div className="mt-10 flex justify-center">
                    <a
                        href="#snapshot-discussions"
                        className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Browse all discussions
                        <HiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default DiscussionCardTrendingTopics

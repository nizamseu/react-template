// ClassicPostActivityFeed

// ActivityFeed01 · Social Networks & Communities › Activity / Community Feed

// Description:
// The home feed of Hive, a community app for hobby groups. Under "Your feed" with a
// Latest / Top toggle it lists three posts (a rye loaf in Sourdough Society, an offline-mode
// win in Night Owl Devs, a balcony harvest in Balcony Gardeners), each with avatar, hive
// chip, relative time, text, photo and Like / Comment / Share actions; a "Who to follow"
// card sits alongside on large screens. Use it as the main timeline of a community app.

// Design:
// - Gray-50 #f9fafb canvas, white rounded-3xl post cards with a #e5e7eb border, gray-900
//   #111827 text, honey #f59e0b for liked hearts, hive chips, hashtags and focus rings
// - Posts: 44px avatars, bold names, honey hive chip, 16:10 photos in rounded-2xl frames,
//   a quiet counts row and a three-button action bar with 44px targets
// - Comments open in a tinted #fffbeb panel with bubble-style replies and a pill input;
//   a honey heart bursts over the photo on double-click
// - Motion: likes pop with a spring, comment panels expand by height, new comments fade
//   in; reduced motion removes scaling and uses plain fades
// - Responsive: single feed column (max 640px) on base / md; from lg a 300px sticky
//   sidebar ("Who to follow" + a dark "Hive pulse" bar chart card) sits to the right

// What it does:
// - Like toggles per post (aria-pressed, count ±1); double-clicking a photo likes it; Save
//   toggles a bookmark; Latest / Top re-sorts by age or like count
// - Comment toggles the post's comment panel (aria-expanded; the first post starts open);
//   the controlled input validates (empty or over 280 characters) and appends your
//   comment as "Just now"
// - Share copies https://hive.social/p/<id> to the clipboard, shows "Copied" for 2 s
//   (timeout cleared) and adds one to the share count; relative times start fixed and
//   tick every 60 s after mount
// - Follow buttons in the sidebar toggle aria-pressed; hive chips link to #hive-<slug>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ClassicPostActivityFeed from '@/TestComponent/PageSections/community/ActivityFeed01';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <ClassicPostActivityFeed />
//     </main>
// )
// ```

'use client'

import { Fragment, useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiBookmark,
    HiCheck,
    HiHeart,
    HiOutlineArrowUpTray,
    HiOutlineBookmark,
    HiOutlineChatBubbleOvalLeft,
    HiOutlineHeart,
    HiOutlinePaperAirplane,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const ME = {
    name: 'Priya Raman',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
}

const posts = [
    {
        id: 'rye-day-9',
        author: 'Aisha Bello',
        handle: 'aisha.bakes',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        hive: 'Sourdough Society',
        slug: 'sourdough-society',
        minutesAgo: 12,
        text: 'Day 9 of the rye experiment: 20% wholegrain, 78% hydration, cold-proofed for 14 hours. The ear finally showed up!',
        tags: ['#rye', '#sourdough'],
        photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
        alt: 'Rustic sourdough loaves with a floury crust on a wooden board',
        likes: 248,
        shares: 12,
        moreComments: 34,
        comments: [
            {
                id: 'c1',
                name: 'Jonah Weiss',
                img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                text: 'That ear! Did you steam with a tray or a Dutch oven?',
                minutesAgo: 8,
            },
            {
                id: 'c2',
                name: 'Mei Tanaka',
                img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
                text: 'Saving this for Saturday’s bake. 78% with rye is brave.',
                minutesAgo: 5,
            },
        ],
    },
    {
        id: 'offline-mode',
        author: 'Tomás Ortega',
        handle: 'tomas.codes',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        hive: 'Night Owl Devs',
        slug: 'night-owl-devs',
        minutesAgo: 134,
        text: 'Shipped offline mode at 2:14 am. The trick: queue writes in IndexedDB and replay them on reconnect. Coffee count: 4.',
        tags: ['#shipit', '#pwa'],
        photo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        alt: 'Laptop showing code on a wooden desk next to a coffee cup',
        likes: 392,
        shares: 41,
        moreComments: 57,
        comments: [
            {
                id: 'c3',
                name: 'Leo Hartmann',
                img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
                text: 'How are you resolving conflicts when two devices edit offline?',
                minutesAgo: 96,
            },
        ],
    },
    {
        id: 'balcony-harvest',
        author: 'Mei Tanaka',
        handle: 'mei.grows',
        avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
        hive: 'Balcony Gardeners',
        slug: 'balcony-gardeners',
        minutesAgo: 318,
        text: 'This week from a 2 m² balcony: 3.4 kg of tomatoes, a fistful of chillies and one very proud courgette. Seed swap Saturday at 10:00!',
        tags: ['#harvest', '#seedswap'],
        photo: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
        alt: 'Crates of fresh tomatoes and vegetables at a market stall',
        likes: 171,
        shares: 9,
        moreComments: 18,
        comments: [],
    },
]

const suggestions = [
    {
        id: 'grace',
        name: 'Grace Kim',
        meta: 'Ceramics Collective',
        img: 'https://images.unsplash.com/photo-1614644147724-2d4785d69962?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'kofi',
        name: 'Kofi Mensah',
        meta: 'Night Owl Devs',
        img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'ines',
        name: 'Inès Laurent',
        meta: 'Sourdough Society',
        img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80',
    },
]

function rel(minutes) {
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} h`
    return `${Math.floor(minutes / 1440)} d`
}

const MAX = 280

export function ClassicPostActivityFeed({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const baseId = useId()
    const [elapsed, setElapsed] = useState(0)
    const [sort, setSort] = useState('latest')
    const [likes, setLikes] = useState(() =>
        Object.fromEntries(posts.map((p) => [p.id, { liked: false, count: p.likes }])),
    )
    const [saved, setSaved] = useState({})
    const [open, setOpen] = useState({ 'rye-day-9': true })
    const [comments, setComments] = useState(() => Object.fromEntries(posts.map((p) => [p.id, p.comments])))
    const [drafts, setDrafts] = useState({})
    const [errors, setErrors] = useState({})
    const [copied, setCopied] = useState(null)
    const [shared, setShared] = useState({})
    const [bursts, setBursts] = useState({})
    const [following, setFollowing] = useState({})

    useEffect(() => {
        const id = setInterval(() => setElapsed((m) => m + 1), 60000)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        if (!copied) return undefined
        const id = setTimeout(() => setCopied(null), 2000)
        return () => clearTimeout(id)
    }, [copied])

    const sorted = [...posts].sort((a, b) =>
        sort === 'latest' ? a.minutesAgo - b.minutesAgo : likes[b.id].count - likes[a.id].count,
    )

    const toggleLike = (id, forceOn = false) => {
        setLikes((prev) => {
            const cur = prev[id]
            if (forceOn && cur.liked) return prev
            const liked = forceOn ? true : !cur.liked
            return { ...prev, [id]: { liked, count: cur.count + (liked ? 1 : -1) } }
        })
    }

    const onDoubleLike = (id) => {
        toggleLike(id, true)
        setBursts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
    }

    const share = async (id) => {
        const url = `https://hive.social/p/${id}`
        let ok = false
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url)
                ok = true
            }
        } catch {
            ok = false
        }
        setCopied({ id, ok })
        if (ok) setShared((prev) => ({ ...prev, [id]: true }))
    }

    const submitComment = (event, id) => {
        event.preventDefault()
        const text = (drafts[id] ?? '').trim()
        if (!text) {
            setErrors((prev) => ({ ...prev, [id]: 'Write something before posting.' }))
            return
        }
        if (text.length > MAX) {
            setErrors((prev) => ({ ...prev, [id]: `Keep it under ${MAX} characters.` }))
            return
        }
        setComments((prev) => ({
            ...prev,
            [id]: [...prev[id], { id: `me-${Date.now()}`, name: ME.name, img: ME.img, text, at: elapsed, mine: true }],
        }))
        setDrafts((prev) => ({ ...prev, [id]: '' }))
        setErrors((prev) => ({ ...prev, [id]: '' }))
    }

    const ageOf = (comment) => (comment.mine ? elapsed - comment.at : comment.minutesAgo + elapsed)

    const renderText = (post) => (
        <p className="mt-3 text-[15px] leading-relaxed text-[#1f2937]">
            {post.text}{' '}
            {post.tags.map((tag, i) => (
                <Fragment key={tag}>
                    {i > 0 && ' '}
                    <a
                        href={`#hive-tag-${tag.slice(1)}`}
                        className="rounded font-semibold text-[#b45309] hover:underline focus-visible:outline-2 focus-visible:outline-[#f59e0b]"
                    >
                        {tag}
                    </a>
                </Fragment>
            ))}
        </p>
    )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#f9fafb] py-12 text-base font-normal text-[#111827] md:py-20', className)}
            {...props}
        >
            <div className="mx-auto grid max-w-[1040px] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,640px)_300px] lg:justify-center lg:px-8">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#b45309]">
                                <span aria-hidden="true" className="size-2 rotate-45 rounded-[2px] bg-[#f59e0b]" />
                                Hive · Home
                            </p>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">Your feed</h2>
                        </div>
                        <div role="group" aria-label="Sort posts" className="flex rounded-full border border-[#e5e7eb] bg-white p-1">
                            {['latest', 'top'].map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    aria-pressed={sort === key}
                                    className={cn(
                                        'min-h-10 rounded-full px-4 text-sm font-semibold capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                        sort === key ? 'bg-[#111827] text-white' : 'text-[#6b7280] hover:text-[#111827]',
                                    )}
                                    onClick={() => setSort(key)}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ul className="mt-8 space-y-6">
                        {sorted.map((post) => {
                            const like = likes[post.id]
                            const list = comments[post.id]
                            const isOpen = Boolean(open[post.id])
                            const draft = drafts[post.id] ?? ''
                            const panelId = `${baseId}-${post.id}-comments`
                            const copiedHere = copied?.id === post.id
                            return (
                                <motion.li key={post.id} layout={!reduceMotion} transition={{ duration: 0.35 }}>
                                    <article className="rounded-3xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(17,24,39,0.04)] sm:p-6">
                                        <header className="flex items-start gap-3">
                                            <img
                                                src={post.avatar}
                                                alt={`${post.author}’s avatar`}
                                                loading="lazy"
                                                className="size-11 shrink-0 rounded-full object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-[15px] font-bold leading-tight text-[#111827]">
                                                    {post.author}
                                                </h3>
                                                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6b7280]">
                                                    <a
                                                        href={`#hive-${post.slug}`}
                                                        className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2 py-0.5 font-semibold text-[#92400e] hover:bg-[#fde68a] focus-visible:outline-2 focus-visible:outline-[#f59e0b]"
                                                    >
                                                        <span aria-hidden="true" className="size-1.5 rotate-45 bg-[#f59e0b]" />
                                                        {post.hive}
                                                    </a>
                                                    <span>@{post.handle}</span>
                                                    <span aria-hidden="true">·</span>
                                                    <span>{rel(post.minutesAgo + elapsed)}</span>
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                aria-pressed={Boolean(saved[post.id])}
                                                aria-label={saved[post.id] ? 'Remove from saved' : 'Save post'}
                                                className={cn(
                                                    'grid size-10 shrink-0 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                                    saved[post.id] ? 'text-[#d97706]' : 'text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#111827]',
                                                )}
                                                onClick={() => setSaved((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                                            >
                                                {saved[post.id] ? (
                                                    <HiBookmark aria-hidden="true" className="size-5" />
                                                ) : (
                                                    <HiOutlineBookmark aria-hidden="true" className="size-5" />
                                                )}
                                            </button>
                                        </header>

                                        {renderText(post)}

                                        <div
                                            className="relative mt-4 overflow-hidden rounded-2xl bg-[#f3f4f6]"
                                            onDoubleClick={() => onDoubleLike(post.id)}
                                        >
                                            <img
                                                src={post.photo}
                                                alt={post.alt}
                                                loading="lazy"
                                                draggable={false}
                                                className="aspect-[16/10] w-full select-none object-cover"
                                            />
                                            <AnimatePresence>
                                                {bursts[post.id] > 0 && (
                                                    <motion.span
                                                        key={bursts[post.id]}
                                                        aria-hidden="true"
                                                        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.4 }}
                                                        animate={{ opacity: [0, 1, 1, 0], scale: reduceMotion ? 1 : [0.4, 1.15, 1, 1.1] }}
                                                        transition={{ duration: 0.9, times: [0, 0.25, 0.7, 1] }}
                                                        className="pointer-events-none absolute inset-0 grid place-items-center"
                                                    >
                                                        <HiHeart className="size-24 text-[#f59e0b] drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]" />
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#6b7280]">
                                            <span className="inline-flex items-center gap-1">
                                                <span className="grid size-4 place-items-center rounded-full bg-[#f59e0b]" aria-hidden="true">
                                                    <HiHeart className="size-2.5 text-white" />
                                                </span>
                                                {like.count.toLocaleString('en-US')} likes
                                            </span>
                                            <span>{list.length + post.moreComments} comments</span>
                                            <span>{post.shares + (shared[post.id] ? 1 : 0)} shares</span>
                                        </p>

                                        <div className="mt-3 grid grid-cols-3 gap-1 border-t border-[#f3f4f6] pt-2">
                                            <button
                                                type="button"
                                                aria-pressed={like.liked}
                                                aria-label={`${like.liked ? 'Unlike' : 'Like'} post by ${post.author}`}
                                                className={cn(
                                                    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                                    like.liked ? 'text-[#d97706]' : 'text-[#4b5563] hover:bg-[#f9fafb]',
                                                )}
                                                onClick={() => toggleLike(post.id)}
                                            >
                                                <motion.span
                                                    key={like.liked ? 'on' : 'off'}
                                                    initial={{ scale: reduceMotion ? 1 : 0.6 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 600, damping: 15 }}
                                                    className="grid"
                                                >
                                                    {like.liked ? (
                                                        <HiHeart aria-hidden="true" className="size-5" />
                                                    ) : (
                                                        <HiOutlineHeart aria-hidden="true" className="size-5" />
                                                    )}
                                                </motion.span>
                                                <span>Like</span>
                                            </button>
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                                className={cn(
                                                    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                                    isOpen ? 'bg-[#fffbeb] text-[#92400e]' : 'text-[#4b5563] hover:bg-[#f9fafb]',
                                                )}
                                                onClick={() => setOpen((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                                            >
                                                <HiOutlineChatBubbleOvalLeft aria-hidden="true" className="size-5" />
                                                <span>Comment</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-[#4b5563] transition-colors hover:bg-[#f9fafb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                                                onClick={() => share(post.id)}
                                            >
                                                {copiedHere && copied.ok ? (
                                                    <HiCheck aria-hidden="true" className="size-5 text-[#d97706]" />
                                                ) : (
                                                    <HiOutlineArrowUpTray aria-hidden="true" className="size-5" />
                                                )}
                                                <span className="whitespace-nowrap">
                                                    {copiedHere ? (copied.ok ? 'Copied' : 'Try again') : 'Share'}
                                                </span>
                                            </button>
                                        </div>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    id={panelId}
                                                    key="comments"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-3 rounded-2xl bg-[#fffbeb] p-3 sm:p-4">
                                                        {post.moreComments > 0 && (
                                                            <a
                                                                href={`#hive-post-${post.id}`}
                                                                className="mb-3 inline-flex min-h-8 items-center rounded text-xs font-semibold text-[#92400e] hover:underline focus-visible:outline-2 focus-visible:outline-[#f59e0b]"
                                                            >
                                                                View {post.moreComments} earlier comments
                                                            </a>
                                                        )}
                                                        <ul className="space-y-3">
                                                            <AnimatePresence initial={false}>
                                                                {list.map((c) => (
                                                                    <motion.li
                                                                        key={c.id}
                                                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        className="flex items-start gap-2.5"
                                                                    >
                                                                        <img src={c.img} alt="" loading="lazy" className="size-8 shrink-0 rounded-full object-cover" />
                                                                        <div className="min-w-0">
                                                                            <div
                                                                                className={cn(
                                                                                    'rounded-2xl rounded-tl-md px-3 py-2',
                                                                                    c.mine ? 'bg-[#fde68a]' : 'bg-white',
                                                                                )}
                                                                            >
                                                                                <p className="text-xs font-bold text-[#111827]">{c.name}</p>
                                                                                <p className="mt-0.5 break-words text-sm leading-snug text-[#374151]">
                                                                                    {c.text}
                                                                                </p>
                                                                            </div>
                                                                            <p className="mt-1 pl-3 text-[11px] text-[#9ca3af]">{rel(ageOf(c))}</p>
                                                                        </div>
                                                                    </motion.li>
                                                                ))}
                                                            </AnimatePresence>
                                                        </ul>
                                                        {list.length === 0 && (
                                                            <p className="text-sm text-[#92400e]">Be the first to reply to {post.author.split(' ')[0]}.</p>
                                                        )}
                                                        <form
                                                            noValidate
                                                            className="mt-3 flex items-start gap-2"
                                                            onSubmit={(event) => submitComment(event, post.id)}
                                                        >
                                                            <img src={ME.img} alt="" className="mt-1 size-8 shrink-0 rounded-full object-cover" />
                                                            <div className="min-w-0 flex-1">
                                                                <label htmlFor={`${panelId}-input`} className="sr-only">
                                                                    Write a comment to {post.author}
                                                                </label>
                                                                <div className="flex items-center gap-1 rounded-full border border-[#fde68a] bg-white pl-4 pr-1 focus-within:border-[#f59e0b] focus-within:ring-4 focus-within:ring-[#f59e0b]/15">
                                                                    <input
                                                                        id={`${panelId}-input`}
                                                                        value={draft}
                                                                        placeholder="Write a comment…"
                                                                        autoComplete="off"
                                                                        aria-invalid={Boolean(errors[post.id])}
                                                                        aria-describedby={`${panelId}-msg`}
                                                                        className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none"
                                                                        onChange={(event) => {
                                                                            const value = event.target.value
                                                                            setDrafts((prev) => ({ ...prev, [post.id]: value }))
                                                                            if (errors[post.id]) setErrors((prev) => ({ ...prev, [post.id]: '' }))
                                                                        }}
                                                                    />
                                                                    <button
                                                                        type="submit"
                                                                        aria-label="Post comment"
                                                                        disabled={!draft.trim()}
                                                                        className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f59e0b] text-[#111827] transition-opacity hover:bg-[#fbbf24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b] disabled:opacity-40"
                                                                    >
                                                                        <HiOutlinePaperAirplane aria-hidden="true" className="size-4" />
                                                                    </button>
                                                                </div>
                                                                <p
                                                                    id={`${panelId}-msg`}
                                                                    aria-live="polite"
                                                                    className={cn(
                                                                        'mt-1 flex justify-between gap-2 px-3 text-[11px]',
                                                                        errors[post.id] || draft.length > MAX ? 'text-[#dc2626]' : 'text-[#9ca3af]',
                                                                    )}
                                                                >
                                                                    <span>{errors[post.id] || 'Be kind, it’s a hive.'}</span>
                                                                    <span className="tabular-nums">
                                                                        {draft.length}/{MAX}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </article>
                                </motion.li>
                            )
                        })}
                    </ul>
                    <p aria-live="polite" className="sr-only">
                        {copied ? (copied.ok ? 'Link copied to clipboard' : 'Could not copy the link') : ''}
                    </p>
                </div>

                <aside className="hidden lg:block">
                    <div className="sticky top-6 space-y-6">
                        <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5">
                            <h3 className="text-base font-bold text-[#111827]">Who to follow</h3>
                            <ul className="mt-4 space-y-4">
                                {suggestions.map((s) => (
                                    <li key={s.id} className="flex items-center gap-3">
                                        <img src={s.img} alt="" loading="lazy" className="size-10 rounded-full object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-[#111827]">{s.name}</p>
                                            <p className="truncate text-xs text-[#6b7280]">{s.meta}</p>
                                        </div>
                                        <button
                                            type="button"
                                            aria-pressed={Boolean(following[s.id])}
                                            aria-label={`${following[s.id] ? 'Unfollow' : 'Follow'} ${s.name}`}
                                            className={cn(
                                                'min-h-9 rounded-full px-3.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                                following[s.id]
                                                    ? 'border border-[#e5e7eb] bg-white text-[#374151]'
                                                    : 'bg-[#f59e0b] text-[#111827] hover:bg-[#fbbf24]',
                                            )}
                                            onClick={() => setFollowing((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                                        >
                                            {following[s.id] ? 'Following' : 'Follow'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-3xl bg-[#111827] p-5 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fcd34d]">Hive pulse</p>
                            <p className="mt-2 text-2xl font-extrabold tracking-tight text-white">1,284 posts today</p>
                            <p className="mt-1 text-sm text-white/60">across your 12 hives · up 18% on last Sunday</p>
                            <div aria-hidden="true" className="mt-4 flex h-12 items-end gap-1">
                                {[30, 42, 38, 55, 48, 70, 64, 82, 76, 100].map((h, i) => (
                                    <span key={i} className="flex-1 rounded-t bg-[#f59e0b]" style={{ height: `${h}%`, opacity: 0.35 + i * 0.065 }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    )
}

export default ClassicPostActivityFeed

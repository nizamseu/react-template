// DriftingTagsTrendingTopics

// TrendingTopics05 · Social Networks & Communities › Trending Topics / Hashtags

// Description:
// A soft, pastel "drifting tags" wall for the fictional photo-diary app Moments. Under the
// heading "Catch a drifting tag." eighteen hashtags (e.g. "#MatchaMornings", "#CabinWeekend",
// "#AuroraHunt") float past in three rows at different speeds and sizes. Clicking a tag opens
// a card with its post count, growth, a Follow toggle and a sample post with photo. Use it as
// a playful discovery band on a home feed, a landing page or an empty search state.

// Design:
// - Pastel wash #fdf2f8 → #f5f3ff → #eef2ff with blurred pink / lavender / mint blobs; ink
//   indigo #312e81, muted #6b6394, accent pink #db2777; white/70 frosted cards, rounded-[2rem]
// - Tag pills in six pastel tones (pink, lavender, mint, peach, sky, butter) with dark text
//   of the same hue; the three rows use large (text-xl → sm:text-2xl), medium and small pills
// - Rows are full-bleed marquees with a faded mask at both edges; heading mixes a sans
//   headline with an italic serif "drifting"
// - Motion: each row is a framer-motion value driven by useAnimationFrame (3 copies, wraps
//   at one third) and eases to a stop on hover/focus; the detail card cross-fades
// - Responsive: header copy and the pause button stack on mobile; the detail card is one
//   column below md and a tag panel + sample post split on md+

// What it does:
// - Rows drift at 0.9, 1.4 (reversed) and 1.15 % of their track per second, only while on
//   screen; hovering or focusing inside a row slows it to a stop
// - "Pause drift" (aria-pressed) stops all rows; with prefers-reduced-motion the rows never
//   move and instead become horizontally scrollable, showing one copy of each tag
// - Clicking a tag (aria-pressed) shows its post count, growth, people posting and a sample
//   post; "Follow tag" and the post’s heart toggle locally (aria-pressed)
// - "See all posts" links to #moments-tag-<id>; duplicate marquee copies are aria-hidden and
//   out of the tab order

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DriftingTagsTrendingTopics from '@/TestComponent/PageSections/community/TrendingTopics05';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <DriftingTagsTrendingTopics />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import {
    AnimatePresence,
    motion,
    useAnimationFrame,
    useInView,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from 'framer-motion';
import { HiArrowRight, HiCheck, HiHeart, HiOutlineHeart, HiPause, HiPlay, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const COPIES = 3

const tones = {
    pink: 'border-[#fbcfe8] bg-[#fce7f3] text-[#9d174d]',
    lavender: 'border-[#ddd6fe] bg-[#ede9fe] text-[#5b21b6]',
    mint: 'border-[#a7f3d0] bg-[#d1fae5] text-[#065f46]',
    peach: 'border-[#fed7aa] bg-[#ffedd5] text-[#9a3412]',
    sky: 'border-[#bae6fd] bg-[#e0f2fe] text-[#075985]',
    butter: 'border-[#fde68a] bg-[#fef9c3] text-[#854d0e]',
}

const img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const rows = [
    [
        { id: 'matcha-mornings', tag: 'MatchaMornings', tone: 'mint', posts: 128400, growth: 18, people: '42.1K', photo: '1517256064527-09c73fc73e38', alt: 'Latte in a ceramic cup on a café table', author: 'Hana Sato', handle: 'hana.slowdays', avatar: '1554151228-14d9def656e4', text: 'Oat milk, a bamboo whisk and ten quiet minutes before anyone else wakes up. Best part of my day.', time: '14 min ago', likes: 2381 },
        { id: 'golden-hour-walks', tag: 'GoldenHourWalks', tone: 'peach', posts: 96200, growth: 24, people: '31.8K', photo: '1507525428034-b723cf961d3e', alt: 'Beach at sunset with gentle waves', author: 'Leo Moreau', handle: 'leo.outside', avatar: '1500648767791-00dcc994a43e', text: 'Walked until the sun gave up. 7.2 km, zero notifications, one very sandy phone.', time: '38 min ago', likes: 1904 },
        { id: 'cabin-weekend', tag: 'CabinWeekend', tone: 'butter', posts: 74900, growth: 9, people: '22.4K', photo: '1449158743715-0a90ebb6d2d8', alt: 'Small wooden cabin among tall forest trees', author: 'Ines Duarte', handle: 'ines.and.pines', avatar: '1544005313-94ddf0286df2', text: 'No signal, a wood stove and a stack of paperbacks. Checking back in on Monday.', time: '1 h ago', likes: 3120 },
        { id: 'book-nook', tag: 'BookNook', tone: 'lavender', posts: 58300, growth: 12, people: '19.6K', photo: '1521587760476-6c12a4b040da', alt: 'Tall wooden bookshelf filled with books', author: 'Priya Raman', handle: 'priya.reads', avatar: '1573497019940-1c28c88b4f3e', text: 'Finally organised the shelf by colour. Yes, I can still find everything. Mostly.', time: '2 h ago', likes: 1277 },
        { id: 'city-lights', tag: 'CityLightsAtNight', tone: 'sky', posts: 51700, growth: 7, people: '17.2K', photo: '1514565131-fce0801e5785', alt: 'City skyline lit up at dusk', author: 'Marcus Hale', handle: 'marcus.frames', avatar: '1506794778202-cad84cf45f1d', text: 'Twenty-third floor, blue hour, and the whole city switching on one window at a time.', time: '3 h ago', likes: 988 },
        { id: 'sunday-bakes', tag: 'SundayBakes', tone: 'pink', posts: 44800, growth: 31, people: '15.9K', photo: '1509440159596-0249088772ff', alt: 'Rustic loaves of bread on a wooden board', author: 'Maya Okafor', handle: 'maya.crumbs', avatar: '1531123897727-8f129e1688ce', text: 'Loaf number 14 and the ear finally opened. Sharing the recipe in the comments.', time: '4 h ago', likes: 2045 },
    ],
    [
        { id: 'plant-parenthood', tag: 'PlantParenthood', tone: 'mint', posts: 67200, growth: 5, people: '21.3K', photo: '1485955900006-10f4d324d411', alt: 'Small succulent in a mint green pot', author: 'Aiko Tanaka', handle: 'aiko.greens', avatar: '1487412720507-e7ab37603c6f', text: 'This little one survived two house moves and one very enthusiastic cat.', time: '22 min ago', likes: 1432 },
        { id: 'thrift-haul', tag: 'ThriftHaul', tone: 'peach', posts: 59100, growth: 27, people: '18.8K', photo: '1512436991641-6745cdb1723f', alt: 'Rack of warm-toned second-hand clothes', author: 'Sofia Marchetti', handle: 'sofia.secondhand', avatar: '1488426862026-3ee34a7d66df', text: 'Wool coat, silk scarf, corduroy trousers: €31 total. The thrift gods were kind today.', time: '46 min ago', likes: 2780 },
        { id: 'coastal-walks', tag: 'CoastalWalks', tone: 'sky', posts: 48600, growth: 14, people: '16.1K', photo: '1533105079780-92b9be482077', alt: 'White houses above a bright blue sea', author: 'Nikos Pappas', handle: 'nikos.shoreline', avatar: '1527980965255-d3b416303d12', text: 'The cliff path from the harbour to the chapel takes 40 minutes. Worth every step.', time: '1 h ago', likes: 1655 },
        { id: 'cozy-candles', tag: 'CozyCandles', tone: 'butter', posts: 39400, growth: 42, people: '13.7K', photo: '1603006905003-be475563bc59', alt: 'Lit candle glowing in a cosy room', author: 'Grace Whitfield', handle: 'grace.at.home', avatar: '1580489944761-15a19d654956', text: 'First candle of autumn is lit. Fig and cedar, if you were wondering.', time: '2 h ago', likes: 3302 },
        { id: 'latte-art-club', tag: 'LatteArtClub', tone: 'pink', posts: 33800, growth: 11, people: '10.4K', photo: '1509042239860-f550ce710b93', alt: 'Two latte art cups surrounded by plants', author: 'Tom Becker', handle: 'tom.pours', avatar: '1539571696357-5a69c17a67c6', text: 'Day 60 of practising a swan. It currently looks like a very confident duck.', time: '3 h ago', likes: 1189 },
        { id: 'studio-sessions', tag: 'StudioSessions', tone: 'lavender', posts: 28900, growth: 19, people: '9.2K', photo: '1598488035139-bdbb2231ce04', alt: 'Recording studio with guitars on the wall', author: 'Dani Cruz', handle: 'dani.demos', avatar: '1463453091185-61582044d556', text: 'Tracked the bridge in one take at 2 am. Sometimes tired hands play it best.', time: '5 h ago', likes: 874 },
    ],
    [
        { id: 'sunset-yoga', tag: 'SunsetYoga', tone: 'peach', posts: 31200, growth: 8, people: '11.5K', photo: '1544367567-0f2fcb009e0b', alt: 'Silhouette doing a yoga pose at sunset', author: 'Lucía Paredes', handle: 'lucia.breathes', avatar: '1502685104226-ee32379fefbe', text: 'Twenty minutes of stretching facing west. My back and my brain both say thank you.', time: '31 min ago', likes: 1540 },
        { id: 'aurora-hunt', tag: 'AuroraHunt', tone: 'mint', posts: 27600, growth: 64, people: '8.9K', photo: '1517411032315-54ef2cb783bb', alt: 'Green aurora over a dark landscape', author: 'Erik Lund', handle: 'erik.northbound', avatar: '1472099645785-5658abf4ff4e', text: 'Drove three hours north on a hunch. The sky started dancing at 23:40.', time: '1 h ago', likes: 4210 },
        { id: 'street-eats', tag: 'StreetEats', tone: 'butter', posts: 24300, growth: 15, people: '8.1K', photo: '1466978913421-dad2ebd01d17', alt: 'Friends sharing fries and small dishes at a table', author: 'Omar Haddad', handle: 'omar.eats', avatar: '1506277886164-e25aa3f4ef7f', text: 'Five friends, eleven dishes, one tiny table. We regret nothing.', time: '2 h ago', likes: 1098 },
        { id: 'tiny-apartment', tag: 'TinyApartment', tone: 'lavender', posts: 19800, growth: 6, people: '6.6K', photo: '1502672260266-1c1ef2d93688', alt: 'Bright small living room full of plants', author: 'Chloé Martin', handle: 'chloe.28sqm', avatar: '1546961329-78bef0414d7c', text: '28 m², three windows and far too many plants. Home tour in my stories.', time: '3 h ago', likes: 1876 },
        { id: 'trail-days', tag: 'TrailDays', tone: 'sky', posts: 16500, growth: 21, people: '5.8K', photo: '1539635278303-d4002c07eae3', alt: 'Hikers walking a mountain trail', author: 'Sam Otieno', handle: 'sam.onfoot', avatar: '1570295999919-56ceb5ecca61', text: 'Ridge loop done in 6 h 12 min. Knees filed a formal complaint at the summit.', time: '6 h ago', likes: 742 },
        { id: 'picnic-season', tag: 'PicnicSeason', tone: 'pink', posts: 12900, growth: 33, people: '4.7K', photo: '1528605248644-14dd04022da1', alt: 'Friends sharing a long meal together', author: 'Rosa Ibáñez', handle: 'rosa.shares', avatar: '1494790108377-be9c29b29330', text: 'Last warm Saturday of the year, so we carried the whole kitchen to the park.', time: '8 h ago', likes: 956 },
    ],
]

const allTags = rows.flat()

const rowConfig = [
    { speed: 0.9, reverse: false, pill: 'min-h-14 gap-3 px-5 text-xl sm:min-h-16 sm:px-6 sm:text-2xl', hash: 'size-8 text-base', label: 'Trending tags, row one' },
    { speed: 1.4, reverse: true, pill: 'min-h-12 gap-2.5 px-4 text-lg', hash: 'size-7 text-sm', label: 'Trending tags, row two' },
    { speed: 1.15, reverse: false, pill: 'min-h-10 gap-2 px-3.5 text-sm', hash: 'size-6 text-xs', label: 'Trending tags, row three' },
]

const compact = (n) => `${(n / 1000).toFixed(1)}K`

function DriftRow({ tags, config, paused, reduce, selected, onPick }) {
    const ref = useRef(null)
    const inView = useInView(ref, { margin: '120px' })
    const span = 100 / COPIES
    const x = useMotionValue(config.reverse ? -span : 0)
    const translate = useTransform(x, (v) => `${v}%`)
    const factor = useRef(1)
    const hold = useRef(false)

    useAnimationFrame((_, delta) => {
        if (reduce || !inView) return
        const target = paused || hold.current ? 0 : 1
        factor.current += (target - factor.current) * Math.min(1, delta / 260)
        if (target === 0 && factor.current < 0.002) return
        let next = x.get() + (config.reverse ? 1 : -1) * config.speed * factor.current * (Math.min(delta, 64) / 1000)
        if (next <= -span) next += span
        if (next > 0) next -= span
        x.set(next)
    })

    const copies = reduce ? 1 : COPIES

    return (
        <div
            ref={ref}
            role="group"
            aria-label={config.label}
            className={cn(
                'relative',
                reduce
                    ? 'overflow-x-auto px-4 sm:px-6'
                    : 'overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]',
            )}
            onMouseEnter={() => {
                hold.current = true
            }}
            onMouseLeave={() => {
                hold.current = false
            }}
            onFocus={() => {
                hold.current = true
            }}
            onBlur={() => {
                hold.current = false
            }}
        >
            <motion.ul style={reduce ? undefined : { x: translate }} className="flex w-max py-2">
                {Array.from({ length: copies }).flatMap((_, copy) =>
                    tags.map((tag) => {
                        const active = selected === tag.id
                        const clone = copy > 0
                        return (
                            <li key={`${copy}-${tag.id}`} aria-hidden={clone || undefined} className="shrink-0 pr-3 sm:pr-4">
                                <button
                                    type="button"
                                    tabIndex={clone ? -1 : 0}
                                    aria-pressed={active}
                                    className={cn(
                                        'inline-flex items-center whitespace-nowrap rounded-full border font-semibold tracking-tight shadow-[0_8px_20px_-14px_rgba(49,46,129,0.5)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#312e81] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                                        tones[tag.tone],
                                        config.pill,
                                        active && 'ring-2 ring-[#312e81] ring-offset-2 ring-offset-[#fdf2f8]',
                                    )}
                                    onClick={() => onPick(tag.id)}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-white/75 font-bold', config.hash)}
                                    >
                                        #
                                    </span>
                                    {tag.tag}
                                    <span className="text-[0.7em] font-medium tabular-nums opacity-70">{compact(tag.posts)}</span>
                                </button>
                            </li>
                        )
                    }),
                )}
            </motion.ul>
        </div>
    )
}

export function DriftingTagsTrendingTopics({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [paused, setPaused] = useState(false)
    const [selected, setSelected] = useState('matcha-mornings')
    const [followed, setFollowed] = useState([])
    const [liked, setLiked] = useState([])

    const tag = allTags.find((t) => t.id === selected)
    const isFollowed = followed.includes(tag.id)
    const isLiked = liked.includes(tag.id)
    const toggle = (setter, id) => setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-gradient-to-br from-[#fdf2f8] via-[#f5f3ff] to-[#eef2ff] py-16 text-base font-normal text-[#312e81] sm:py-20 lg:py-24',
                className,
            )}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 size-80 rounded-full bg-[#fbcfe8]/70 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 size-96 rounded-full bg-[#ddd6fe]/70 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 size-80 rounded-full bg-[#a7f3d0]/40 blur-3xl" />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6394] ring-1 ring-white">
                            <span aria-hidden="true" className="size-2.5 rounded-full bg-gradient-to-br from-[#f472b6] to-[#818cf8]" />
                            Moments · drifting now
                        </p>
                        <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-tight text-[#312e81] sm:text-5xl lg:text-6xl">
                            Catch a <span className="font-serif font-medium italic text-[#db2777]">drifting</span> tag.
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-[#6b6394]">
                            Everything people are sharing today, floating by. Hover to slow a row down, tap a tag
                            to peek inside.
                        </p>
                    </div>
                    {!reduce && (
                        <button
                            type="button"
                            aria-pressed={paused}
                            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-white/80 px-5 text-sm font-semibold text-[#312e81] shadow-sm ring-1 ring-white transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#312e81] md:self-auto"
                            onClick={() => setPaused((p) => !p)}
                        >
                            {paused ? <HiPlay aria-hidden="true" className="size-4" /> : <HiPause aria-hidden="true" className="size-4" />}
                            {paused ? 'Resume drift' : 'Pause drift'}
                        </button>
                    )}
                </div>
            </div>

            <div className="relative mt-12 space-y-3 sm:space-y-4">
                {rows.map((tags, i) => (
                    <DriftRow
                        key={rowConfig[i].label}
                        tags={tags}
                        config={rowConfig[i]}
                        paused={paused}
                        reduce={reduce}
                        selected={selected}
                        onPick={setSelected}
                    />
                ))}
            </div>

            <div className="relative mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
                <div aria-live="polite" className="rounded-[2rem] bg-white/70 p-3 shadow-[0_30px_60px_-40px_rgba(49,46,129,0.45)] ring-1 ring-white backdrop-blur sm:p-4">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={tag.id}
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-4"
                        >
                            <div className={cn('flex flex-col justify-between gap-8 rounded-[1.5rem] border p-6 sm:p-8', tones[tag.tone])}>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">Trending on Moments</p>
                                    <h3 className="mt-3 break-words text-3xl font-bold tracking-tight text-current sm:text-4xl">#{tag.tag}</h3>
                                </div>
                                <div>
                                    <p className="text-5xl font-bold tabular-nums tracking-tight sm:text-6xl">{tag.posts.toLocaleString('en-US')}</p>
                                    <p className="mt-1 text-sm font-medium opacity-80">moments posted this week</p>
                                    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-2xl bg-white/60 px-4 py-3">
                                            <dt className="text-xs opacity-70">Since yesterday</dt>
                                            <dd className="mt-0.5 text-lg font-bold tabular-nums">+{tag.growth}%</dd>
                                        </div>
                                        <div className="rounded-2xl bg-white/60 px-4 py-3">
                                            <dt className="text-xs opacity-70">People posting</dt>
                                            <dd className="mt-0.5 text-lg font-bold tabular-nums">{tag.people}</dd>
                                        </div>
                                    </dl>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            aria-pressed={isFollowed}
                                            className={cn(
                                                'inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#312e81]',
                                                isFollowed ? 'bg-white text-[#312e81]' : 'bg-[#312e81] text-white hover:bg-[#1e1b4b]',
                                            )}
                                            onClick={() => toggle(setFollowed, tag.id)}
                                        >
                                            {isFollowed ? <HiCheck aria-hidden="true" className="size-4" /> : <HiPlus aria-hidden="true" className="size-4" />}
                                            {isFollowed ? 'Following' : 'Follow tag'}
                                        </button>
                                        <a
                                            href={`#moments-tag-${tag.id}`}
                                            className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-current underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#312e81]"
                                        >
                                            See all posts
                                            <HiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <article className="overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-[#ede9fe]">
                                <header className="flex items-center gap-3 p-4">
                                    <img src={img(tag.avatar, 400)} alt={tag.author} loading="lazy" className="size-10 rounded-full object-cover ring-2 ring-[#fce7f3]" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-[#312e81]">{tag.author}</p>
                                        <p className="truncate text-xs text-[#6b6394]">
                                            @{tag.handle} · {tag.time}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-[#fdf2f8] px-2.5 py-1 text-[11px] font-semibold text-[#db2777]">Sample post</span>
                                </header>
                                <div className="aspect-[16/10] bg-[#f5f3ff]">
                                    <img src={img(tag.photo, 1000)} alt={tag.alt} loading="lazy" className="size-full object-cover" />
                                </div>
                                <div className="flex items-start gap-3 p-4 sm:p-5">
                                    <p className="min-w-0 flex-1 text-sm leading-relaxed text-[#3f3a6b]">
                                        {tag.text} <span className="font-semibold text-[#db2777]">#{tag.tag}</span>
                                    </p>
                                    <button
                                        type="button"
                                        aria-pressed={isLiked}
                                        aria-label={`Like ${tag.author}’s post`}
                                        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#fdf2f8] px-3 text-xs font-semibold tabular-nums text-[#9d174d] transition-colors hover:bg-[#fce7f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#db2777]"
                                        onClick={() => toggle(setLiked, tag.id)}
                                    >
                                        {isLiked ? <HiHeart aria-hidden="true" className="size-4 text-[#db2777]" /> : <HiOutlineHeart aria-hidden="true" className="size-4" />}
                                        {(tag.likes + (isLiked ? 1 : 0)).toLocaleString('en-US')}
                                    </button>
                                </div>
                            </article>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default DriftingTagsTrendingTopics

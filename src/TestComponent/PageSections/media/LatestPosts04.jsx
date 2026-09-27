// DayTimelineLatestPosts

// LatestPosts04 · Blogs & Digital Media › Latest Posts Grid / Feed

// Description:
// A cosy, diary-like feed for the fictional food blog Slow Kitchen. Under "What’s been
// simmering" nine recipes, market notes, journal entries and videos hang off a vertical
// timeline, grouped under day headers (Today, Yesterday, Thursday, 12 Sep) with the time
// each was posted, prep time, servings and a save button; a "Jump to day" rail follows along.
// Use it for food, craft or personal blogs that publish several small posts a day.

// Design:
// - Cream #fff3e2 background, cocoa ink #3a2218 for text, terracotta #c8553d for the timeline,
//   day pills, type chips, the saved counter, hearts and focus rings; cards are #fffaf2 with a
//   terracotta/15 border and rounded-3xl corners
// - Timeline: a dashed terracotta/30 rail with a solid terracotta line drawn over it as the
//   list scrolls (useScroll → scaleY); ring dots mark each post, and day headers are pills
//   that sit on the rail
// - Cards: square photo (full-width 16:10 on mobile → w-44 square from sm), serif title
//   text-xl → sm:text-2xl, meta row with prep time and servings icons
// - lg:grid-cols-12: sticky "Jump to day" rail in 3 columns, timeline in 9; below lg the rail
//   turns into a horizontally scrolling chip row
// - Cards rise in as they enter the viewport (whileInView, once); reduced motion removes the
//   offset and shows the rail fully drawn

// What it does:
// - An IntersectionObserver scrollspy marks the day in view as active (aria-current) in the
//   rail; rail links scroll smoothly to that day (instant with reduced motion)
// - Heart buttons (aria-pressed) save or unsave posts and update the "Saved" counter in the
//   header
// - Titles link to #slow-kitchen-<id>; "Browse the full archive" links to
//   #slow-kitchen-archive

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DayTimelineLatestPosts from '@/TestComponent/PageSections/media/LatestPosts04';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <DayTimelineLatestPosts />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { HiArrowLongRight, HiHeart, HiOutlineClock, HiOutlineHeart, HiOutlineUsers } from 'react-icons/hi2';
import { LuCookingPot } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const days = [
    {
        id: 'today',
        label: 'Today',
        date: 'Sun 27 Sep',
        posts: [
            { id: 'pear-loaf', time: '08:10', type: 'Recipe', title: 'Brown-butter pear loaf for a slow Sunday', excerpt: 'Three ripe pears, a pan of nutty butter and an hour in the oven. The kitchen will smell like a bakery until Tuesday.', prep: '1 h 20 min', serves: 'Serves 8', image: img('1509440159596-0249088772ff'), alt: 'Rustic loaves of bread cooling on a board' },
            { id: 'market-plums', time: '12:45', type: 'Market', title: 'What’s good this week: late plums and the first squash', excerpt: 'Our Saturday market haul, what it cost (£23.40) and the five things we are cooking with it.', prep: '4 min read', serves: 'Market notes', image: img('1488459716781-31db52582fe9'), alt: 'Crates of colourful vegetables at a market stall' },
            { id: 'leek-farro', time: '18:30', type: 'Recipe', title: 'Charred leek and farro salad with whipped feta', excerpt: 'Warm grains, blistered leeks, lemon and a handful of dill. Good hot, better the next day.', prep: '45 min', serves: 'Serves 4', image: img('1540189549336-e6e99c3679fe'), alt: 'Fresh salad served in a black bowl' },
        ],
    },
    {
        id: 'yesterday',
        label: 'Yesterday',
        date: 'Sat 26 Sep',
        posts: [
            { id: 'whole-beans', time: '09:00', type: 'Journal', title: 'Why I finally stopped buying pre-ground coffee', excerpt: 'A £30 hand grinder, a month of mornings, and the tasting notes I did not know I was missing.', prep: '6 min read', serves: 'Kitchen diary', image: img('1447933601403-0c6688de566e'), alt: 'Pile of dark roasted coffee beans' },
            { id: 'pizza-bianca', time: '16:20', type: 'Recipe', title: 'Slow-roasted tomato pizza bianca, overnight dough', excerpt: 'A 24-hour cold ferment does the hard work. You just need a hot oven and a little patience.', prep: '24 h · 30 min active', serves: 'Makes 2', image: img('1565299624946-b28f40a0ae38'), alt: 'Pizza with tomatoes and basil on a wooden board' },
        ],
    },
    {
        id: 'thursday',
        label: 'Thursday',
        date: '24 Sep',
        posts: [
            { id: 'flat-white', time: '07:45', type: 'Video', title: 'A proper flat white at home, no machine needed', excerpt: 'A French press, a jam jar and 14 minutes of video. Latte art optional but encouraged.', prep: '14 min video', serves: 'Serves 2', image: img('1509042239860-f550ce710b93'), alt: 'Cups of coffee with latte art beside green plants' },
            { id: 'green-bowls', time: '19:10', type: 'Recipe', title: 'Green goddess grain bowls for a crowd', excerpt: 'A big-batch dressing, three roasted veg and a build-your-own table for eight hungry people.', prep: '50 min', serves: 'Serves 8', image: img('1512621776951-a57141f2eefd'), alt: 'Colourful healthy salad bowl with vegetables and grains' },
        ],
    },
    {
        id: 'sep-12',
        label: '12 Sep',
        date: 'Saturday',
        posts: [
            { id: 'pantry-week', time: '10:30', type: 'Journal', title: 'A week of cooking only from the pantry', excerpt: 'Seven dinners, zero shopping trips and the lentil dish that is now on permanent rotation.', prep: '8 min read', serves: 'Kitchen diary', image: img('1498837167922-ddd27525d352'), alt: 'Bowls of colourful ingredients laid out on a table' },
            { id: 'long-lunch', time: '17:00', type: 'Recipe', title: 'Setting the table for a very long lunch', excerpt: 'Our favourite hand-glazed plates, a menu that cooks itself and a timeline for the host.', prep: '3 h', serves: 'Serves 10', image: img('1578749556568-bc2c40e68b61'), alt: 'Stacked blue ceramic plates on a wooden table' },
        ],
    },
]

export function DayTimelineLatestPosts({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [activeDay, setActiveDay] = useState(days[0].id)
    const [saved, setSaved] = useState([])
    const timelineRef = useRef(null)
    const dayRefs = useRef({})
    const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 75%', 'end 60%'] })

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return undefined
        const observer = new IntersectionObserver(
            (entries) => {
                const hit = entries.find((entry) => entry.isIntersecting)
                if (hit) setActiveDay(hit.target.dataset.day)
            },
            { rootMargin: '-35% 0px -55% 0px' },
        )
        Object.values(dayRefs.current).forEach((node) => node && observer.observe(node))
        return () => observer.disconnect()
    }, [])

    const jumpTo = (event, id) => {
        event.preventDefault()
        setActiveDay(id)
        dayRefs.current[id]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    }

    const toggleSave = (id) => {
        setSaved((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]))
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#fff3e2] py-16 text-base font-normal text-[#3a2218] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2 font-serif text-lg italic text-[#c8553d]">
                            <LuCookingPot aria-hidden="true" className="size-5" />
                            Slow Kitchen
                        </p>
                        <h2 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-[#3a2218] sm:text-5xl md:text-6xl">
                            What’s been <em className="font-normal text-[#c8553d]">simmering</em>
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#3a2218]/70">
                            Recipes, market notes and kitchen diaries, posted the moment they come out of the oven.
                        </p>
                    </div>
                    <p
                        aria-live="polite"
                        className="inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-[#c8553d]/30 bg-[#fffaf2] px-4 text-sm font-semibold text-[#3a2218] md:self-auto"
                    >
                        <HiHeart aria-hidden="true" className="size-4 text-[#c8553d]" />
                        {saved.length} saved {saved.length === 1 ? 'recipe' : 'recipes'}
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    <nav aria-label="Jump to day" className="lg:col-span-3">
                        <div className="lg:sticky lg:top-8">
                            <p className="hidden text-[11px] font-bold uppercase tracking-[0.25em] text-[#3a2218]/60 lg:block">
                                Jump to day
                            </p>
                            <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:mt-4 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0">
                                {days.map((day) => {
                                    const active = activeDay === day.id
                                    return (
                                        <li key={day.id} className="shrink-0">
                                            <a
                                                href={`#slow-kitchen-${day.id}`}
                                                aria-current={active ? 'true' : undefined}
                                                className={cn(
                                                    'flex min-h-11 items-center justify-between gap-4 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8553d] lg:rounded-2xl',
                                                    active
                                                        ? 'bg-[#c8553d] text-[#fff3e2]'
                                                        : 'bg-[#fffaf2] text-[#3a2218] hover:bg-[#c8553d]/10 lg:bg-transparent',
                                                )}
                                                onClick={(event) => jumpTo(event, day.id)}
                                            >
                                                <span className="whitespace-nowrap">
                                                    {day.label}
                                                    <span className={cn('ml-2 font-normal', active ? 'text-[#fff3e2]/80' : 'text-[#3a2218]/55')}>
                                                        {day.date}
                                                    </span>
                                                </span>
                                                <span
                                                    className={cn(
                                                        'rounded-full px-2 text-xs tabular-nums',
                                                        active ? 'bg-[#fff3e2]/20' : 'bg-[#c8553d]/10 text-[#c8553d]',
                                                    )}
                                                >
                                                    {day.posts.length}
                                                </span>
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </nav>

                    <div ref={timelineRef} className="relative lg:col-span-9">
                        <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 border-l-2 border-dashed border-[#c8553d]/30" />
                        <motion.div
                            aria-hidden="true"
                            style={reduceMotion ? undefined : { scaleY: scrollYProgress }}
                            className="absolute bottom-0 left-[7px] top-0 w-0.5 origin-top bg-[#c8553d]"
                        />

                        {days.map((day) => (
                            <div
                                key={day.id}
                                ref={(node) => {
                                    dayRefs.current[day.id] = node
                                }}
                                id={`slow-kitchen-${day.id}`}
                                data-day={day.id}
                                className="relative scroll-mt-8 pb-6"
                            >
                                <h3 className="relative flex items-center gap-3 pb-6 pl-0 font-serif text-2xl font-semibold text-[#3a2218]">
                                    <span className="relative z-10 inline-flex items-center rounded-full bg-[#c8553d] px-4 py-1.5 text-base font-semibold text-[#fff3e2]">
                                        {day.label}
                                    </span>
                                    <span className="text-base font-normal italic text-[#3a2218]/60">{day.date}</span>
                                </h3>

                                <ol className="space-y-6">
                                    {day.posts.map((post) => {
                                        const isSaved = saved.includes(post.id)
                                        return (
                                            <motion.li
                                                key={post.id}
                                                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                                className="relative pl-8 sm:pl-12"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute left-0 top-6 size-4 rounded-full border-[3px] border-[#c8553d] bg-[#fff3e2]"
                                                />
                                                <time className="mb-2 block font-mono text-xs font-semibold text-[#c8553d]">{post.time}</time>
                                                <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#c8553d]/15 bg-[#fffaf2] transition-shadow hover:shadow-[0_20px_40px_-28px_rgba(200,85,61,0.6)] sm:flex-row">
                                                    <div className="aspect-[16/10] shrink-0 overflow-hidden bg-[#c8553d]/10 sm:aspect-square sm:w-44">
                                                        <img
                                                            src={post.image}
                                                            alt={post.alt}
                                                            loading="lazy"
                                                            className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                                        />
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <span className="rounded-full bg-[#c8553d]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c8553d]">
                                                                {post.type}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                aria-pressed={isSaved}
                                                                aria-label={`${isSaved ? 'Unsave' : 'Save'} ${post.title}`}
                                                                className={cn(
                                                                    'relative z-10 -mr-2 -mt-2 flex size-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-[#c8553d]',
                                                                    isSaved ? 'text-[#c8553d]' : 'text-[#3a2218]/50 hover:text-[#c8553d]',
                                                                )}
                                                                onClick={() => toggleSave(post.id)}
                                                            >
                                                                {isSaved ? (
                                                                    <HiHeart aria-hidden="true" className="size-5" />
                                                                ) : (
                                                                    <HiOutlineHeart aria-hidden="true" className="size-5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <h4 className="mt-2 font-serif text-xl font-semibold leading-snug text-[#3a2218] sm:text-2xl">
                                                            <a
                                                                href={`#slow-kitchen-${post.id}`}
                                                                className="decoration-[#c8553d] decoration-2 underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:rounded-3xl focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-[#c8553d]"
                                                            >
                                                                {post.title}
                                                            </a>
                                                        </h4>
                                                        <p className="mt-2 text-sm leading-relaxed text-[#3a2218]/75">{post.excerpt}</p>
                                                        <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs font-semibold text-[#3a2218]/65">
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <HiOutlineClock aria-hidden="true" className="size-4 text-[#c8553d]" />
                                                                {post.prep}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <HiOutlineUsers aria-hidden="true" className="size-4 text-[#c8553d]" />
                                                                {post.serves}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </article>
                                            </motion.li>
                                        )
                                    })}
                                </ol>
                            </div>
                        ))}

                        <div className="relative pl-8 pt-2 sm:pl-12">
                            <span aria-hidden="true" className="absolute left-0 top-3 size-4 rounded-full bg-[#c8553d]" />
                            <a
                                href="#slow-kitchen-archive"
                                className="group inline-flex min-h-10 items-center gap-2 font-serif text-lg italic text-[#3a2218] hover:text-[#c8553d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8553d]"
                            >
                                Browse the full archive, 412 posts since 2019
                                <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DayTimelineLatestPosts

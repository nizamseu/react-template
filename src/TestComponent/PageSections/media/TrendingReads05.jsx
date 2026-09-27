// PodiumPopTrendingReads

// TrendingReads05 · Blogs & Digital Media › Popular / Trending Reads

// Description:
// A loud, neo-brutalist chart for the pop-culture site Pop Index. Under "This week's
// most-read, ranked by you." the top three stories stand on a podium (2 · 1 · 3) with
// tilted photo cards, and places 4–8 follow as a compact list next to a "See the full Pop
// Index 100" tile. Every story has a heart "Hype" button that readers can toggle. Use it
// for entertainment, music or celebrity homepages and weekly chart round-ups.

// Design:
// - Sunflower #ffd23f section, black #0a0a0a type and 3px borders, hot pink #ff3d7f
//   accents; hard offset shadows (6px 6px 0 #0a0a0a) and a rotated pink sticker label
// - Podium blocks: No. 1 pink, No. 2 black with sunflower digits, No. 3 white; huge
//   black-weight numerals; photo cards are rounded-2xl with slight alternating tilts
// - Blocks grow up from the floor (scaleY from the bottom) when scrolled into view with a
//   stagger; hearts pop on toggle; both are skipped for reduced motion
// - Responsive: below sm each podium place is a row (rank block left, card right, 1-2-3
//   order); from sm the three places stand side by side in 2-1-3 order with step heights
//   (h-28/h-40/h-56 → lg taller); 4–8 rows put the heart under the title and hide the
//   thumbnail below sm; the list is one column, then 2 columns from lg

// What it does:
// - hyped state (a Set of slugs) is toggled by each heart button (aria-pressed); the
//   count adds one while hyped and the heart fills pink
// - Cards and rows link to #pop-<slug>; "See the full Pop Index 100" links to
//   #pop-index-100; podium growth and tilts are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PodiumPopTrendingReads from '@/TestComponent/PageSections/media/TrendingReads05';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <PodiumPopTrendingReads />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight, HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const podium = [
    {
        slug: 'marlowe-vance-record',
        rank: 1,
        section: 'Music',
        title: 'Marlowe Vance’s surprise album just broke the debut-week streaming record',
        reads: '412k',
        hype: 18204,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
        alt: 'Singer performing on a smoky stage under white lights',
        order: 'order-1 sm:order-2',
        block: 'bg-[#ff3d7f] text-[#0a0a0a] sm:h-56 lg:h-64',
        tilt: 'sm:-rotate-2',
    },
    {
        slug: 'solstice-awards-looks',
        rank: 2,
        section: 'Style',
        title: 'Every look from the Solstice Awards red carpet, ranked',
        reads: '338k',
        hype: 11760,
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
        alt: 'Woman in sunglasses and a red top against a teal backdrop',
        order: 'order-2 sm:order-1',
        block: 'bg-[#0a0a0a] text-[#ffd23f] sm:h-40 lg:h-48',
        tilt: 'sm:rotate-2',
    },
    {
        slug: 'low-tide-finale',
        rank: 3,
        section: 'TV',
        title: 'The “Low Tide” finale, explained: who was really on the boat?',
        reads: '297k',
        hype: 9433,
        image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
        alt: 'Film reels stacked next to a vintage projector',
        order: 'order-3',
        block: 'bg-white text-[#0a0a0a] sm:h-28 lg:h-36',
        tilt: 'sm:-rotate-1',
    },
]

const chart = [
    {
        slug: 'film-cameras-return',
        section: 'Trends',
        title: 'Why everyone under 25 is shooting on film again',
        reads: '241k',
        hype: 6120,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
        alt: 'Camera body surrounded by lenses',
    },
    {
        slug: 'festival-sets',
        section: 'Music',
        title: 'Festival season recap: the nine sets people still can’t stop posting',
        reads: '205k',
        hype: 5384,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
        alt: 'Festival crowd under bright stage lights',
    },
    {
        slug: 'chunky-sneakers',
        section: 'Style',
        title: 'The chunky-sneaker revival has officially peaked. Or has it?',
        reads: '177k',
        hype: 4012,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80',
        alt: 'Colourful sneakers arranged on a white box',
    },
    {
        slug: 'nine-dollar-sandwich',
        section: 'Food',
        title: 'Star chefs are opening $9 sandwich shops. We tried five',
        reads: '149k',
        hype: 3297,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        alt: 'Stacked burger on a wooden board',
    },
    {
        slug: 'cosy-games',
        section: 'Games',
        title: 'Inside the cosy-game boom: the farm sims that ate our weekends',
        reads: '128k',
        hype: 2865,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
        alt: 'Retro computers and consoles lit with pink neon',
    },
]

const fmt = (n) => n.toLocaleString('en-US')

function HypeButton({ story, hyped, onToggle, reduceMotion }) {
    const count = story.hype + (hyped ? 1 : 0)
    return (
        <button
            type="button"
            aria-pressed={hyped}
            aria-label={`Hype “${story.title}”, ${fmt(count)} hypes`}
            className={cn(
                'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border-[3px] border-[#0a0a0a] px-2.5 text-xs font-bold tabular-nums transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a]',
                hyped ? 'bg-[#ff3d7f] text-[#0a0a0a]' : 'bg-white text-[#0a0a0a] hover:bg-[#ffe99a]',
            )}
            onClick={onToggle}
        >
            <motion.span
                key={hyped ? 'on' : 'off'}
                initial={reduceMotion ? false : { scale: hyped ? 0.4 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 600, damping: 14 }}
                className="inline-flex"
                aria-hidden="true"
            >
                {hyped ? <HiHeart className="size-4" /> : <HiOutlineHeart className="size-4" />}
            </motion.span>
            {fmt(count)}
        </button>
    )
}

export function PodiumPopTrendingReads({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [hyped, setHyped] = useState(() => new Set())

    const toggle = (slug) =>
        setHyped((prev) => {
            const next = new Set(prev)
            if (next.has(slug)) next.delete(slug)
            else next.add(slug)
            return next
        })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#ffd23f] px-4 py-16 text-base font-normal text-[#0a0a0a] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0a0a0a_1.2px,transparent_1.2px)] [background-size:22px_22px] opacity-[0.12]"
            />
            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="inline-flex -rotate-3 items-center gap-2 rounded-lg border-[3px] border-[#0a0a0a] bg-[#ff3d7f] px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#0a0a0a] shadow-[4px_4px_0_#0a0a0a]">
                            Pop Index <span aria-hidden="true">★</span> Week 39
                        </p>
                        <h2 className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#0a0a0a] sm:text-6xl lg:text-7xl">
                            This week’s most-read,{' '}
                            <span className="text-[#ff3d7f] [text-shadow:3px_3px_0_#0a0a0a]">ranked by you.</span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm font-medium leading-relaxed text-[#0a0a0a]/75 md:text-right">
                        21–27 September · 3.1M reads · Hype a story to push it up next week’s chart.
                    </p>
                </div>

                <ol className="mt-12 flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:items-end sm:gap-3 md:mt-16 lg:gap-5">
                    {podium.map((story, index) => (
                        <li key={story.slug} className={cn('flex flex-row-reverse gap-3 sm:flex-col sm:gap-0', story.order)}>
                            <article
                                className={cn(
                                    'relative flex min-w-0 flex-1 gap-3 rounded-2xl border-[3px] border-[#0a0a0a] bg-white p-3 shadow-[6px_6px_0_#0a0a0a] transition-transform duration-300 hover:-translate-y-1 sm:mb-4 sm:flex-col sm:p-3.5 motion-reduce:hover:translate-y-0',
                                    story.tilt,
                                )}
                            >
                                <img
                                    src={story.image}
                                    alt={story.alt}
                                    loading="lazy"
                                    className="size-16 shrink-0 rounded-xl border-[3px] border-[#0a0a0a] object-cover sm:aspect-square sm:size-auto sm:w-full"
                                />
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff3d7f]">
                                        {story.section}
                                        <span className="text-[#0a0a0a]/50"> · {story.reads} reads</span>
                                    </p>
                                    <a
                                        href={`#pop-${story.slug}`}
                                        className="mt-1 text-sm font-extrabold leading-snug text-[#0a0a0a] decoration-[#ff3d7f] decoration-[3px] underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none sm:text-[15px] lg:text-base"
                                    >
                                        {story.title}
                                    </a>
                                    <div className="mt-3 sm:mt-auto sm:pt-3">
                                        <HypeButton
                                            story={story}
                                            hyped={hyped.has(story.slug)}
                                            reduceMotion={reduceMotion}
                                            onToggle={() => toggle(story.slug)}
                                        />
                                    </div>
                                </div>
                            </article>

                            <motion.div
                                initial={reduceMotion ? false : { scaleY: 0.2, opacity: 0 }}
                                whileInView={{ scaleY: 1, opacity: 1 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                                className={cn(
                                    'flex w-16 shrink-0 origin-bottom items-center justify-center rounded-2xl border-[3px] border-[#0a0a0a] shadow-[6px_6px_0_#0a0a0a] sm:w-full sm:items-start sm:rounded-b-none sm:rounded-t-2xl sm:pt-4 sm:shadow-none',
                                    story.block,
                                )}
                            >
                                <span className="sr-only">Rank </span>
                                <span className="text-4xl font-black leading-none tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                                    {story.rank}
                                </span>
                            </motion.div>
                        </li>
                    ))}
                </ol>
                <div aria-hidden="true" className="hidden h-3 rounded-b-lg border-[3px] border-t-0 border-[#0a0a0a] bg-[#0a0a0a] sm:block" />

                <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-5">
                    <ol start={4} className="contents">
                        {chart.map((story, index) => (
                            <li
                                key={story.slug}
                                className="group grid grid-cols-[2rem_1fr] items-center gap-x-3 gap-y-2 rounded-2xl border-[3px] border-[#0a0a0a] bg-white p-3 transition-shadow duration-200 hover:shadow-[6px_6px_0_#ff3d7f] focus-within:shadow-[6px_6px_0_#ff3d7f] sm:grid-cols-[2.5rem_3.5rem_1fr_auto] sm:gap-x-4 sm:p-4"
                            >
                                <span className="row-span-2 text-center text-2xl font-black tabular-nums tracking-[-0.04em] sm:row-span-1 sm:text-3xl">
                                    {index + 4}
                                </span>
                                <img
                                    src={story.image}
                                    alt={story.alt}
                                    loading="lazy"
                                    className="hidden size-14 rounded-full border-[3px] border-[#0a0a0a] object-cover sm:block"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff3d7f]">
                                        {story.section}
                                        <span className="text-[#0a0a0a]/50"> · {story.reads}</span>
                                    </p>
                                    <a
                                        href={`#pop-${story.slug}`}
                                        className="mt-0.5 block text-sm font-bold leading-snug text-[#0a0a0a] decoration-[#ff3d7f] decoration-2 underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none sm:text-[15px]"
                                    >
                                        {story.title}
                                    </a>
                                </div>
                                <div className="col-start-2 justify-self-start sm:col-start-auto">
                                    <HypeButton
                                        story={story}
                                        hyped={hyped.has(story.slug)}
                                        reduceMotion={reduceMotion}
                                        onToggle={() => toggle(story.slug)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ol>
                    <a
                        href="#pop-index-100"
                        className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl border-[3px] border-[#0a0a0a] bg-[#ff3d7f] p-4 text-[#0a0a0a] shadow-[6px_6px_0_#0a0a0a] transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a] sm:p-5 motion-reduce:hover:translate-y-0"
                    >
                        <span>
                            <span className="block text-[10px] font-black uppercase tracking-[0.22em]">
                                Places 9–100
                            </span>
                            <span className="mt-1 block text-xl font-black uppercase leading-none tracking-[-0.02em] sm:text-2xl">
                                See the full Pop Index 100
                            </span>
                        </span>
                        <span className="grid size-12 shrink-0 place-items-center rounded-full border-[3px] border-[#0a0a0a] bg-[#ffd23f] transition-transform duration-300 group-hover:rotate-45">
                            <HiArrowUpRight aria-hidden="true" className="size-5" />
                        </span>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default PodiumPopTrendingReads

// SnapStripTrendingReads

// TrendingReads03 · Blogs & Digital Media › Popular / Trending Reads

// Description:
// A playful, swipeable trending strip for the culture title Glossary. Under "Words for the
// week: the eight reads everyone's quoting." eight tall photo cards sit in a horizontal
// scroll-snap strip, each with a rank badge, section, a glossary-style term ("encore
// economy, n.") and headline. Prev/next buttons and a progress bar steer the strip. Use it
// on culture, arts or lifestyle homepages where trending reads should feel browsable.

// Design:
// - Pastel lilac #ede7ff section with ink #1b1433 type; cards are rounded-[28px] photos
//   with a white #fdfcff caption panel inset at the bottom and an ink rank badge (№ 1–8)
// - Serif italic glossary terms (text-lg) over a bold sans headline; mono micro-labels for
//   section and reading counts; lilac #d8ccff hairlines and a lilac-deep #c9b8ff progress
//   track with an ink fill
// - Cards are w-[78%] → sm:w-[46%] → md:w-[34%] → lg:w-[23.5%], aspect 3:4.4, snap-start;
//   photos ease-scale to 1.06 and the badge tilts on hover/focus
// - Strip bleeds to the section edge on mobile (root overflow-hidden) and aligns to the
//   max-w-7xl container from lg; scrollbar hidden, focus ring on the strip itself
// - Header stacks on mobile; controls sit right of the heading from md

// What it does:
// - Prev/next buttons scroll the strip by one card (smooth, or instant for reduced motion)
//   and are disabled at either end; start/end state and the "03 / 08" counter update from
//   the strip's scroll position
// - The progress bar follows useScroll({ container }) → scrollXProgress (scaleX)
// - The strip is a focusable list that scrolls natively with arrow keys, trackpad or swipe;
//   cards link to #glossary-<slug>, "All trending culture" links to #glossary-trending

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SnapStripTrendingReads from '@/TestComponent/PageSections/media/TrendingReads03';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <SnapStripTrendingReads />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const reads = [
    {
        slug: 'encore-economy',
        section: 'Music',
        term: 'encore economy',
        pos: 'n.',
        title: 'The comeback tour nobody asked for sold out in 11 minutes',
        count: '48.2k',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
        alt: 'Performer on a smoky stage lit by white spotlights',
    },
    {
        slug: 'second-run',
        section: 'Film',
        term: 'second run',
        pos: 'n.',
        title: 'Repertory cinemas are having their best year since 1998',
        count: '39.7k',
        image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
        alt: 'Vintage film reels beside a projector',
    },
    {
        slug: 'furniture-music',
        section: 'Classical',
        term: 'furniture music',
        pos: 'n.',
        title: 'The 23-year-old pianist rewriting Satie for modular synths',
        count: '31.4k',
        image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=800&q=80',
        alt: 'Black and white close-up of hands playing a piano',
    },
    {
        slug: 'slow-looking',
        section: 'Art',
        term: 'slow looking',
        pos: 'v.',
        title: 'Why three big museums just switched off their audio guides',
        count: '27.9k',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
        alt: 'Small group talking together in a bright gallery space',
    },
    {
        slug: 'shelf-life',
        section: 'Books',
        term: 'shelf life',
        pos: 'n.',
        title: 'A 640-page debut novel went viral from a 15-second clip',
        count: '24.6k',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
        alt: 'Tall wooden bookshelves packed with books',
    },
    {
        slug: 'demake',
        section: 'Games',
        term: 'demake',
        pos: 'n.',
        title: 'Pixel art is back, and this time it isn’t about nostalgia',
        count: '21.3k',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        alt: 'Retro computers and a games console lit by pink neon',
    },
    {
        slug: 'room-tone',
        section: 'Music',
        term: 'room tone',
        pos: 'n.',
        title: 'Inside the basement studio behind three prize-shortlisted albums',
        count: '18.8k',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
        alt: 'Recording studio with guitars hanging on the wall',
    },
    {
        slug: 'listening-bar',
        section: 'Nightlife',
        term: 'listening bar',
        pos: 'n.',
        title: 'A night walk through the city’s last vinyl-only listening bars',
        count: '15.1k',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        alt: 'Narrow city street glowing with neon signs at night',
    },
]

const pad = (n) => String(n).padStart(2, '0')

export function SnapStripTrendingReads({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const stripRef = useRef(null)
    const [edge, setEdge] = useState({ start: true, end: false })
    const [first, setFirst] = useState(0)
    const { scrollXProgress } = useScroll({ container: stripRef })

    useEffect(() => {
        const strip = stripRef.current
        if (!strip) return undefined
        const update = () => {
            const max = strip.scrollWidth - strip.clientWidth
            setEdge({ start: strip.scrollLeft <= 4, end: strip.scrollLeft >= max - 4 })
            const card = strip.querySelector('li')
            if (card) {
                const step = card.getBoundingClientRect().width + 16
                setFirst(Math.min(reads.length - 1, Math.round(strip.scrollLeft / step)))
            }
        }
        update()
        strip.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            strip.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [])

    const scrollByCard = (dir) => {
        const strip = stripRef.current
        if (!strip) return
        const card = strip.querySelector('li')
        const step = card ? card.getBoundingClientRect().width + 16 : strip.clientWidth * 0.8
        strip.scrollBy({ left: dir * step, behavior: reduceMotion ? 'auto' : 'smooth' })
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#ede7ff] py-16 text-base font-normal text-[#1b1433] md:py-24', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-[#d8ccff] blur-3xl"
            />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[#1b1433] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[#1b1433]">
                            <span className="font-serif text-sm normal-case italic tracking-normal">Glossary</span>
                            <span aria-hidden="true">/</span>
                            Trending in culture
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#1b1433] sm:text-5xl lg:text-6xl">
                            Words for the week: <em className="italic">the eight reads</em> everyone’s quoting.
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="font-mono text-sm tabular-nums text-[#1b1433]/70" aria-live="polite">
                            <span className="font-bold text-[#1b1433]">{pad(first + 1)}</span> / {pad(reads.length)}
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                aria-label="Previous reads"
                                disabled={edge.start}
                                className="grid size-12 place-items-center rounded-full border border-[#1b1433] text-[#1b1433] transition-colors duration-200 hover:bg-[#1b1433] hover:text-[#ede7ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b1433] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1b1433]"
                                onClick={() => scrollByCard(-1)}
                            >
                                <HiArrowLeft aria-hidden="true" className="size-5" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next reads"
                                disabled={edge.end}
                                className="grid size-12 place-items-center rounded-full bg-[#1b1433] text-[#ede7ff] transition-colors duration-200 hover:bg-[#3a2d6b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b1433] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#1b1433]"
                                onClick={() => scrollByCard(1)}
                            >
                                <HiArrowRight aria-hidden="true" className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative mx-auto mt-10 max-w-7xl md:mt-14 lg:px-10">
                <ul
                    ref={stripRef}
                    tabIndex={0}
                    aria-label="Trending culture reads, scroll horizontally"
                    className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1b1433] sm:scroll-px-6 sm:px-6 lg:scroll-px-0 lg:rounded-[28px] lg:px-0 [&::-webkit-scrollbar]:hidden"
                >
                    {reads.map((read, index) => (
                        <li
                            key={read.slug}
                            className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-[34%] lg:w-[calc((100%-3rem)/4)]"
                        >
                            <a
                                href={`#glossary-${read.slug}`}
                                className="group relative block aspect-[3/4.4] overflow-hidden rounded-[28px] bg-[#d8ccff] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#ede7ff]"
                            >
                                <img
                                    src={read.image}
                                    alt={read.alt}
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-linear-to-b from-[#1b1433]/35 via-transparent to-transparent"
                                />

                                <span className="absolute left-4 top-4 grid size-14 -rotate-6 place-items-center rounded-full bg-[#1b1433] text-[#ede7ff] shadow-[0_8px_20px_-8px_rgba(27,20,51,0.8)] transition-transform duration-500 group-hover:rotate-6 group-focus-visible:rotate-6">
                                    <span className="sr-only">Rank </span>
                                    <span className="font-serif text-2xl italic leading-none">
                                        <span aria-hidden="true" className="mr-0.5 align-top text-[11px] not-italic">
                                            №
                                        </span>
                                        {index + 1}
                                    </span>
                                </span>
                                <span className="absolute right-4 top-5 rounded-full bg-[#fdfcff]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1b1433] backdrop-blur-sm">
                                    {read.section}
                                </span>

                                <span className="absolute inset-x-3 bottom-3 block rounded-[20px] bg-[#fdfcff] p-4 shadow-[0_12px_30px_-18px_rgba(27,20,51,0.7)] sm:p-5">
                                    <span className="flex items-baseline gap-1.5 border-b border-[#d8ccff] pb-2 font-serif text-lg italic text-[#1b1433]">
                                        {read.term}
                                        <span className="font-mono text-[11px] not-italic text-[#1b1433]/55">{read.pos}</span>
                                    </span>
                                    <span className="mt-2.5 block text-[15px] font-bold leading-snug text-[#1b1433] sm:text-base">
                                        {read.title}
                                    </span>
                                    <span className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-[#1b1433]/60">
                                        {read.count} reading now
                                        <HiArrowUpRight
                                            aria-hidden="true"
                                            className="size-4 text-[#1b1433] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </span>
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="relative mx-auto mt-8 flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:gap-10 sm:px-6 lg:px-10">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#c9b8ff]" aria-hidden="true">
                    <motion.div
                        className="h-full origin-left rounded-full bg-[#1b1433]"
                        style={{ scaleX: scrollXProgress }}
                    />
                </div>
                <a
                    href="#glossary-trending"
                    className="group inline-flex min-h-10 items-center gap-2 self-start whitespace-nowrap text-sm font-bold text-[#1b1433] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1b1433] sm:self-auto"
                >
                    <span className="border-b-2 border-[#1b1433] pb-0.5">All trending culture</span>
                    <HiArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                </a>
            </div>
        </section>
    )
}

export default SnapStripTrendingReads

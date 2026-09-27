// NumberedRailTrendingReads

// TrendingReads01 · Blogs & Digital Media › Popular / Trending Reads

// Description:
// A compact "Most read" rail for the regional daily Northern Post. Under the heading "The
// ten stories the North can't stop reading." it lists the top 10 articles with big
// outlined rank numerals, section, headline, byline, read time and reader counts, and lets
// readers switch the ranking between "Today", "This week" and "This month". Use it beside
// or below an article feed, or as a standalone popular-reads block on a news homepage.

// Design:
// - White #ffffff section, charcoal #1f2329 text, teal #0f766e accents (eyebrow, section
//   labels, outlined numerals, focus rings); a 3px charcoal rule over a hairline frames the
//   list like a newspaper rail
// - Numerals are text-5xl → sm:text-6xl bold serif digits drawn as a 1.5px teal outline
//   (-webkit-text-stroke) that fills solid teal when the row is hovered or focused
// - Segmented tabs in a hairline pill; the active tab gets a charcoal pill that slides
//   between tabs (framer-motion layoutId) and a live reader total in teal
// - Rows fade and rise in with a 40ms stagger whenever the list changes; the offset is
//   dropped for reduced motion
// - Responsive: header stacks on mobile and splits on lg; the list is one column on
//   mobile and two columns of five (1–5 left, 6–10 right) from md

// What it does:
// - range state ('today' | 'week' | 'month') is changed by the tabs; the tablist supports
//   ArrowLeft/ArrowRight/Home/End with roving tabindex, and the panel swaps its 10 stories
// - The header shows the total reads and update time of the selected range
// - Each row links to #story-<slug>; "Browse the full Most Read archive" links to
//   #northern-post-most-read; the numeral fill and arrow nudge are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NumberedRailTrendingReads from '@/TestComponent/PageSections/media/TrendingReads01';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <NumberedRailTrendingReads />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const ranges = [
    { id: 'today', label: 'Today', total: '1.28M reads', updated: 'Updated 09:40' },
    { id: 'week', label: 'This week', total: '6.9M reads', updated: 'Mon 21 – Sun 27 Sep' },
    { id: 'month', label: 'This month', total: '24.3M reads', updated: 'September 2026' },
]

const stories = {
    today: [
        { slug: 'night-buses-return', section: 'Transport', title: 'Night buses return to 14 routes after drivers accept a 6.5% pay offer', author: 'Priya Raman', read: 4, reads: '84.1k' },
        { slug: 'pennine-snow-warning', section: 'Weather', title: 'Amber snow warning for the Pennines: what it means for Thursday’s commute', author: 'Tom Hartley', read: 3, reads: '71.6k' },
        { slug: 'shipyard-hiring', section: 'Business', title: 'The Humber shipyard that won a £420m ferry order is hiring 900 people', author: 'Grace Oduya', read: 6, reads: '63.9k' },
        { slug: 'derby-three-all', section: 'Sport', title: 'Five things we learned from a chaotic 3–3 derby in the rain', author: 'Callum Reid', read: 5, reads: '58.2k' },
        { slug: 'hexham-pie-queue', section: 'Food', title: 'The £6 pie shop with a 90-minute queue every Saturday morning', author: 'Maggie Thorne', read: 4, reads: '47.5k' },
        { slug: 'charity-shop-sketch', section: 'Culture', title: 'A lost pencil sketch turned up in a Whitby charity shop. Here’s how it was verified', author: 'Ade Bankole', read: 7, reads: '41.0k' },
        { slug: 'council-tax-rise', section: 'Politics', title: 'Council tax to rise 4.99% as the combined authority closes a £38m gap', author: 'Helen Voss', read: 5, reads: '36.4k' },
        { slug: 'tram-map-redrawn', section: 'Transport', title: 'Why the new tram map has already been redrawn three times', author: 'Priya Raman', read: 6, reads: '29.8k' },
        { slug: 'fund-the-north', section: 'Opinion', title: 'Stop branding the North. Start funding it', author: 'Dan Fairweather', read: 4, reads: '24.1k' },
        { slug: 'hidden-coast-walk', section: 'Outdoors', title: 'The 12-mile coast walk locals have kept quiet about for years', author: 'Isla Brennan', read: 8, reads: '19.7k' },
    ],
    week: [
        { slug: 'hospital-wait-times', section: 'Health', title: 'A&E waits fall below four hours at six hospitals for the first time since 2019', author: 'Nadia Karim', read: 5, reads: '512k' },
        { slug: 'shipyard-hiring', section: 'Business', title: 'The Humber shipyard that won a £420m ferry order is hiring 900 people', author: 'Grace Oduya', read: 6, reads: '468k' },
        { slug: 'rail-timetable', section: 'Transport', title: 'December timetable: 38 extra trains a day between Leeds and Newcastle', author: 'Priya Raman', read: 4, reads: '401k' },
        { slug: 'rent-cap-vote', section: 'Housing', title: 'Renters could get a two-year cap on rises under a plan going to vote next week', author: 'Helen Voss', read: 7, reads: '377k' },
        { slug: 'night-buses-return', section: 'Transport', title: 'Night buses return to 14 routes after drivers accept a 6.5% pay offer', author: 'Priya Raman', read: 4, reads: '352k' },
        { slug: 'school-meals', section: 'Education', title: 'Free breakfast clubs are coming to 212 primary schools this term', author: 'Owen Pryce', read: 3, reads: '318k' },
        { slug: 'derby-three-all', section: 'Sport', title: 'Five things we learned from a chaotic 3–3 derby in the rain', author: 'Callum Reid', read: 5, reads: '287k' },
        { slug: 'charity-shop-sketch', section: 'Culture', title: 'A lost pencil sketch turned up in a Whitby charity shop. Here’s how it was verified', author: 'Ade Bankole', read: 7, reads: '244k' },
        { slug: 'energy-bills-winter', section: 'Money', title: 'Energy bills this winter: the three numbers every household should know', author: 'Farah Ali', read: 6, reads: '209k' },
        { slug: 'fund-the-north', section: 'Opinion', title: 'Stop branding the North. Start funding it', author: 'Dan Fairweather', read: 4, reads: '176k' },
    ],
    month: [
        { slug: 'flood-defences', section: 'Environment', title: 'Inside the £96m flood wall that kept the river out of the city centre', author: 'Isla Brennan', read: 9, reads: '1.9M' },
        { slug: 'hospital-wait-times', section: 'Health', title: 'A&E waits fall below four hours at six hospitals for the first time since 2019', author: 'Nadia Karim', read: 5, reads: '1.6M' },
        { slug: 'rent-cap-vote', section: 'Housing', title: 'Renters could get a two-year cap on rises under a plan going to vote next week', author: 'Helen Voss', read: 7, reads: '1.4M' },
        { slug: 'gigafactory-deal', section: 'Business', title: 'Battery gigafactory confirmed for the Tees: 3,400 jobs by 2029', author: 'Grace Oduya', read: 6, reads: '1.3M' },
        { slug: 'rail-timetable', section: 'Transport', title: 'December timetable: 38 extra trains a day between Leeds and Newcastle', author: 'Priya Raman', read: 4, reads: '1.1M' },
        { slug: 'promotion-parade', section: 'Sport', title: '70,000 lined the quayside for the promotion parade. The best photos', author: 'Callum Reid', read: 3, reads: '986k' },
        { slug: 'school-meals', section: 'Education', title: 'Free breakfast clubs are coming to 212 primary schools this term', author: 'Owen Pryce', read: 3, reads: '874k' },
        { slug: 'heritage-cinema', section: 'Culture', title: 'The 1930s cinema saved by 4,000 small donors reopens on Friday', author: 'Ade Bankole', read: 5, reads: '731k' },
        { slug: 'energy-bills-winter', section: 'Money', title: 'Energy bills this winter: the three numbers every household should know', author: 'Farah Ali', read: 6, reads: '688k' },
        { slug: 'hidden-coast-walk', section: 'Outdoors', title: 'The 12-mile coast walk locals have kept quiet about for years', author: 'Isla Brennan', read: 8, reads: '642k' },
    ],
}

const pad = (n) => String(n).padStart(2, '0')

export function NumberedRailTrendingReads({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [range, setRange] = useState('today')
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const tabRefs = useRef([])

    const current = ranges.find((r) => r.id === range)
    const list = stories[range]

    const onTabKeyDown = (event, index) => {
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % ranges.length
        if (event.key === 'ArrowLeft') next = (index - 1 + ranges.length) % ranges.length
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = ranges.length - 1
        if (next === null) return
        event.preventDefault()
        setRange(ranges[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#1f2329] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#0f766e]">
                            <span className="font-serif text-sm normal-case italic tracking-normal text-[#1f2329]">
                                Northern Post
                            </span>
                            <span className="h-px w-8 bg-[#0f766e]" aria-hidden="true" />
                            Most read
                        </p>
                        <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-[#1f2329] sm:text-5xl lg:text-6xl">
                            The ten stories the North can’t stop reading.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                        <div
                            role="tablist"
                            aria-label="Time range"
                            className="inline-flex w-full rounded-full border border-[#1f2329]/15 p-1 sm:w-auto"
                        >
                            {ranges.map((r, index) => {
                                const active = r.id === range
                                return (
                                    <button
                                        key={r.id}
                                        ref={(el) => {
                                            tabRefs.current[index] = el
                                        }}
                                        type="button"
                                        role="tab"
                                        id={`${uid}-tab-${r.id}`}
                                        aria-selected={active}
                                        aria-controls={`${uid}-panel`}
                                        tabIndex={active ? 0 : -1}
                                        className={cn(
                                            'relative min-h-10 flex-1 whitespace-nowrap rounded-full px-3 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] sm:flex-none sm:px-5',
                                            active ? 'text-white' : 'text-[#1f2329]/65 hover:text-[#1f2329]',
                                        )}
                                        onClick={() => setRange(r.id)}
                                        onKeyDown={(event) => onTabKeyDown(event, index)}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId={`${uid}-pill`}
                                                aria-hidden="true"
                                                className="absolute inset-0 rounded-full bg-[#1f2329]"
                                                transition={
                                                    reduceMotion
                                                        ? { duration: 0 }
                                                        : { type: 'spring', stiffness: 420, damping: 36 }
                                                }
                                            />
                                        )}
                                        <span className="relative">{r.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                        <p className="text-xs text-[#1f2329]/60" aria-live="polite">
                            <span className="font-semibold text-[#0f766e]">{current.total}</span>
                            <span aria-hidden="true"> · </span>
                            <span className="sr-only">, </span>
                            {current.updated}
                        </p>
                    </div>
                </div>

                <div className="mt-10 border-t-[3px] border-[#1f2329] md:mt-14" aria-hidden="true" />
                <div className="mt-[3px] border-t border-[#1f2329]/25" aria-hidden="true" />

                <div
                    role="tabpanel"
                    id={`${uid}-panel`}
                    aria-labelledby={`${uid}-tab-${range}`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.ol
                            key={range}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="grid grid-cols-1 md:grid-flow-col md:grid-cols-2 md:grid-rows-5 md:gap-x-10 lg:gap-x-16"
                        >
                            {list.map((story, index) => (
                                <motion.li
                                    key={story.slug}
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                    className="border-b border-[#1f2329]/12"
                                >
                                    <a
                                        href={`#story-${story.slug}`}
                                        className="group flex min-h-10 items-start gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] sm:gap-6"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="w-[3.25rem] shrink-0 font-serif text-5xl font-bold leading-[0.85] tracking-[-0.04em] text-transparent tabular-nums transition-colors duration-300 [-webkit-text-stroke:1.5px_#0f766e] group-hover:text-[#0f766e] group-focus-visible:text-[#0f766e] sm:w-[4.5rem] sm:text-6xl"
                                        >
                                            {pad(index + 1)}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0f766e]">
                                                <span className="sr-only">Number {index + 1}, </span>
                                                {story.section}
                                                {index === 0 && (
                                                    <span className="rounded-full bg-[#0f766e] px-2 py-0.5 text-[9px] tracking-[0.18em] text-white">
                                                        Top story
                                                    </span>
                                                )}
                                            </span>
                                            <span className="mt-1.5 block text-[17px] font-bold leading-snug tracking-[-0.01em] text-[#1f2329] decoration-[#0f766e] decoration-2 underline-offset-4 group-hover:underline sm:text-lg">
                                                {story.title}
                                            </span>
                                            <span className="mt-2 flex flex-wrap items-center gap-x-2 text-[13px] text-[#1f2329]/60">
                                                <span>{story.author}</span>
                                                <span aria-hidden="true">·</span>
                                                <span>{story.read} min read</span>
                                                <span aria-hidden="true">·</span>
                                                <span className="font-semibold text-[#1f2329]/80">{story.reads} reads</span>
                                            </span>
                                        </span>
                                        <HiArrowUpRight
                                            aria-hidden="true"
                                            className="mt-1 hidden size-4 shrink-0 text-[#1f2329]/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0f766e] sm:block"
                                        />
                                    </a>
                                </motion.li>
                            ))}
                        </motion.ol>
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-col gap-4 text-sm text-[#1f2329]/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>Ranked by unique readers. Rankings refresh every 15 minutes.</p>
                    <a
                        href="#northern-post-most-read"
                        className="group inline-flex min-h-10 items-center gap-2 self-start font-semibold text-[#1f2329] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f766e] sm:self-auto"
                    >
                        <span className="border-b-2 border-[#0f766e] pb-0.5">Browse the full Most Read archive</span>
                        <HiArrowLongRight
                            aria-hidden="true"
                            className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default NumberedRailTrendingReads

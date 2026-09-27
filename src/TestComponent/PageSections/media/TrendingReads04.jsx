// MostTabsTrendingReads

// TrendingReads04 · Blogs & Digital Media › Popular / Trending Reads

// Description:
// A classic, serif "reader pulse" module for the city paper The Civic Times. Under "What
// Civic Times readers are talking about" three tabs, "Most read", "Most shared" and "Most
// commented", each swap a ranked list of seven stories: No. 1 is featured with a photo,
// dek and count, and 2–7 follow as ruled rows with their own read/share/comment counts.
// Use it near the end of articles or on a local-news homepage.

// Design:
// - Ivory #f7f3e8 section, navy #1e3a5f accents and ink #1b2433 type, hairline rules in
//   #d8d0bd; everything is set in font-serif, with small-caps style tracking for labels
// - Tabs sit on a rule; the active tab gets a 3px navy underline that slides between tabs
//   (framer-motion layoutId) and shows its weekly total in a navy chip (chips from sm;
//   below sm the labels shorten to Read / Shared / Commented and share the width)
// - Featured story: 4:3 photo with a thin navy frame offset, italic "No. 1", display
//   headline text-3xl → lg:text-4xl; list rows use italic navy numerals and right-aligned
//   tabular counts with the tab's icon
// - Panels cross-fade and rows rise in with a small stagger on tab change (reduced motion:
//   fade only); headlines underline on hover/focus
// - Responsive: one column on mobile (feature, then list); from lg a 5/7 split with the
//   feature on the left and the ranked list on the right

// What it does:
// - tab state ('read' | 'shared' | 'commented') is changed by role="tab" buttons with
//   ArrowLeft/ArrowRight/Home/End keyboard support and roving tabindex
// - Each tab has its own seven stories and counts; the panel is labelled by the active tab
// - Stories link to #civic-<slug>; "How we rank stories" links to #civic-rankings; the
//   photo frame offset and underline are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MostTabsTrendingReads from '@/TestComponent/PageSections/media/TrendingReads04';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <MostTabsTrendingReads />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiOutlineChatBubbleLeftRight, HiOutlineEye, HiOutlineShare } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tabs = [
    { id: 'read', short: 'read', unit: 'reads', total: '1.9M', icon: HiOutlineEye },
    { id: 'shared', short: 'shared', unit: 'shares', total: '84k', icon: HiOutlineShare },
    { id: 'commented', short: 'commented', unit: 'comments', total: '12k', icon: HiOutlineChatBubbleLeftRight },
]

const lists = {
    read: {
        feature: {
            slug: 'transit-pilot',
            section: 'City Hall',
            title: 'Council approves a 24-hour transit pilot on four bus lines',
            dek: 'The six-month trial starts 2 November on the 12, 19, 40 and 71, with buses every 20 minutes through the night.',
            author: 'Eleanor Pryce',
            count: '214,380',
            image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80',
            alt: 'City street at dusk with lit shop fronts and traffic',
        },
        rows: [
            { slug: 'property-tax-bills', section: 'Money', title: 'Your 2027 property tax bill, explained in five numbers', author: 'Marcus Bell', count: '162,905' },
            { slug: 'bridge-closure', section: 'Transport', title: 'The Harbor Street bridge will close for 11 weeks. Here are the detours', author: 'Aiyana Ross', count: '131,240' },
            { slug: 'school-board-vote', section: 'Education', title: 'School board votes 5–2 to push start times to 8:45 a.m.', author: 'Daniel Okoro', count: '98,617' },
            { slug: 'water-main-map', section: 'Utilities', title: 'Map: every water-main break this year, and what they cost', author: 'Priya Shah', count: '87,332' },
            { slug: 'library-hours', section: 'Culture', title: 'Libraries restore Sunday hours at nine branches', author: 'Grace Whitman', count: '71,048' },
            { slug: 'mayor-budget-interview', section: 'Politics', title: 'The mayor on the $4.2bn budget: “Nobody gets everything”', author: 'Eleanor Pryce', count: '64,511' },
        ],
    },
    shared: {
        feature: {
            slug: 'library-heatwave',
            section: 'Community',
            title: 'The library that stayed open all night during the heatwave',
            dek: 'When the power failed across three neighborhoods, 41 staff volunteered to keep the Central Branch cool for 1,300 residents.',
            author: 'Grace Whitman',
            count: '18,902',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80',
            alt: 'Long corridor of a grand library lined with bookshelves',
        },
        rows: [
            { slug: 'transit-pilot', section: 'City Hall', title: 'Council approves a 24-hour transit pilot on four bus lines', author: 'Eleanor Pryce', count: '12,774' },
            { slug: 'crossing-guard', section: 'People', title: 'After 38 years, the city’s longest-serving crossing guard hangs up her sign', author: 'Aiyana Ross', count: '9,815' },
            { slug: 'water-main-map', section: 'Utilities', title: 'Map: every water-main break this year, and what they cost', author: 'Priya Shah', count: '7,460' },
            { slug: 'free-swim', section: 'Parks', title: 'All six public pools will be free on weekends through October', author: 'Tomás Rivera', count: '6,128' },
            { slug: 'rent-relief', section: 'Housing', title: 'How to apply for the new $1,200 rent-relief grant before it closes', author: 'Marcus Bell', count: '5,903' },
            { slug: 'tree-canopy', section: 'Environment', title: 'The neighborhoods that lost the most tree cover, block by block', author: 'Priya Shah', count: '4,387' },
        ],
    },
    commented: {
        feature: {
            slug: 'riverfront-car-park',
            section: 'Opinion',
            title: 'Should the riverfront car park become a park? Readers are split 52–48',
            dek: 'We asked 3,000 residents. The answers fell along age lines more than neighborhood ones, and both sides had a point.',
            author: 'The Editorial Board',
            count: '2,316',
            image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1000&q=80',
            alt: 'Aerial view of a city skyline beside the water',
        },
        rows: [
            { slug: 'school-board-vote', section: 'Education', title: 'School board votes 5–2 to push start times to 8:45 a.m.', author: 'Daniel Okoro', count: '1,884' },
            { slug: 'bike-lane-removal', section: 'Transport', title: 'Council member proposes removing the Elm Avenue bike lane', author: 'Tomás Rivera', count: '1,502' },
            { slug: 'mayor-budget-interview', section: 'Politics', title: 'The mayor on the $4.2bn budget: “Nobody gets everything”', author: 'Eleanor Pryce', count: '1,137' },
            { slug: 'stadium-subsidy', section: 'Sport', title: 'Letters: the $310m stadium subsidy, for and against', author: 'Readers', count: '962' },
            { slug: 'property-tax-bills', section: 'Money', title: 'Your 2027 property tax bill, explained in five numbers', author: 'Marcus Bell', count: '815' },
            { slug: 'short-lets-cap', section: 'Housing', title: 'A 90-night cap on short-term rentals clears its first vote', author: 'Aiyana Ross', count: '744' },
        ],
    },
}

export function MostTabsTrendingReads({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [tab, setTab] = useState('read')
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const tabRefs = useRef([])

    const active = tabs.find((t) => t.id === tab)
    const Icon = active.icon
    const { feature, rows } = lists[tab]

    const onKeyDown = (event, index) => {
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = tabs.length - 1
        if (next === null) return
        event.preventDefault()
        setTab(tabs[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f7f3e8] px-4 py-16 font-serif text-base font-normal text-[#1b2433] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs uppercase tracking-[0.32em] text-[#1e3a5f]">
                            The Civic Times · Reader pulse · Week 39
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-[-0.01em] text-[#1b2433] sm:text-5xl">
                            What <em className="text-[#1e3a5f]">Civic Times</em> readers are talking about
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm italic leading-relaxed text-[#1b2433]/65 md:text-right">
                        Counts cover the last seven days and refresh hourly. Sunday, 27 September 2026.
                    </p>
                </div>

                <div
                    role="tablist"
                    aria-label="Rank stories by"
                    className="mt-10 flex border-b border-[#d8d0bd] md:mt-12"
                >
                    {tabs.map((t, index) => {
                        const selected = t.id === tab
                        const TabIcon = t.icon
                        return (
                            <button
                                key={t.id}
                                ref={(el) => {
                                    tabRefs.current[index] = el
                                }}
                                type="button"
                                role="tab"
                                id={`${uid}-tab-${t.id}`}
                                aria-selected={selected}
                                aria-controls={`${uid}-panel`}
                                tabIndex={selected ? 0 : -1}
                                className={cn(
                                    'relative flex min-h-12 flex-1 items-center justify-center gap-2 px-2 pb-3 pt-2 text-base capitalize sm:flex-none sm:justify-start sm:normal-case transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1e3a5f] sm:px-5 sm:text-lg',
                                    selected ? 'text-[#1e3a5f]' : 'text-[#1b2433]/55 hover:text-[#1b2433]',
                                )}
                                onClick={() => setTab(t.id)}
                                onKeyDown={(event) => onKeyDown(event, index)}
                            >
                                <TabIcon aria-hidden="true" className="hidden size-5 sm:block" />
                                <span className="whitespace-nowrap">
                                    <span className="sr-only sm:not-sr-only">Most </span>
                                    {t.short}
                                </span>
                                <span
                                    className={cn(
                                        'hidden rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold tracking-wider transition-colors sm:inline',
                                        selected ? 'bg-[#1e3a5f] text-[#f7f3e8]' : 'bg-[#1b2433]/8 text-[#1b2433]/60',
                                    )}
                                >
                                    {t.total}
                                </span>
                                {selected && (
                                    <motion.span
                                        layoutId={`${uid}-underline`}
                                        aria-hidden="true"
                                        className="absolute inset-x-0 -bottom-px h-[3px] bg-[#1e3a5f]"
                                        transition={
                                            reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }
                                        }
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>

                <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${tab}`} className="mt-10">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-10 lg:grid-cols-12 lg:gap-14"
                        >
                            <article className="lg:col-span-5">
                                <a
                                    href={`#civic-${feature.slug}`}
                                    className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1e3a5f]"
                                >
                                    <div className="relative mr-3 mb-3">
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 translate-x-3 translate-y-3 border border-[#1e3a5f]"
                                        />
                                        <img
                                            src={feature.image}
                                            alt={feature.alt}
                                            loading="lazy"
                                            className="relative aspect-[4/3] w-full object-cover saturate-[0.85] transition-[filter] duration-500 group-hover:saturate-100"
                                        />
                                    </div>
                                    <p className="mt-6 flex items-baseline gap-3 text-sm">
                                        <span className="text-2xl italic text-[#1e3a5f]">No. 1</span>
                                        <span className="uppercase tracking-[0.24em] text-[#1b2433]/60 text-[11px]">
                                            {feature.section}
                                        </span>
                                    </p>
                                    <h3 className="mt-2 font-serif text-3xl font-normal leading-[1.1] text-[#1b2433] decoration-[#1e3a5f] decoration-1 underline-offset-[6px] group-hover:underline lg:text-4xl">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-3 text-base leading-relaxed text-[#1b2433]/75">{feature.dek}</p>
                                    <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#1b2433]/65">
                                        <span className="italic">By {feature.author}</span>
                                        <span aria-hidden="true" className="h-3 w-px bg-[#1b2433]/30" />
                                        <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold tabular-nums text-[#1e3a5f]">
                                            <Icon aria-hidden="true" className="size-4" />
                                            {feature.count} {active.unit}
                                        </span>
                                    </p>
                                </a>
                            </article>

                            <ol className="border-t-2 border-[#1b2433] lg:col-span-7">
                                {rows.map((row, index) => (
                                    <motion.li
                                        key={row.slug}
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.05 + index * 0.05 }}
                                        className="border-b border-[#d8d0bd]"
                                    >
                                        <a
                                            href={`#civic-${row.slug}`}
                                            className="group grid grid-cols-[2.5rem_1fr] gap-x-3 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e3a5f] sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-x-5"
                                        >
                                            <span className="text-3xl italic leading-none text-[#1e3a5f] sm:text-4xl">
                                                {index + 2}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-[11px] uppercase tracking-[0.24em] text-[#1b2433]/55">
                                                    {row.section}
                                                </span>
                                                <span className="mt-1 block text-lg leading-snug text-[#1b2433] decoration-[#1e3a5f] decoration-1 underline-offset-4 group-hover:underline sm:text-xl">
                                                    {row.title}
                                                </span>
                                                <span className="mt-1 block text-sm italic text-[#1b2433]/60">
                                                    {row.author}
                                                </span>
                                            </span>
                                            <span className="col-start-2 mt-2 inline-flex items-center gap-1.5 font-sans text-xs font-semibold tabular-nums text-[#1e3a5f] sm:col-start-3 sm:mt-0 sm:justify-end sm:text-sm">
                                                <Icon aria-hidden="true" className="size-4" />
                                                {row.count}
                                                <span className="text-[#1b2433]/50 sm:sr-only">{active.unit}</span>
                                            </span>
                                        </a>
                                    </motion.li>
                                ))}
                            </ol>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-[#d8d0bd] pt-6 text-sm text-[#1b2433]/65 sm:flex-row sm:items-center sm:justify-between">
                    <p className="italic">Rankings exclude paid promotions and newsletter traffic.</p>
                    <a
                        href="#civic-rankings"
                        className="group inline-flex min-h-10 items-center gap-2 self-start font-semibold text-[#1e3a5f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1e3a5f] sm:self-auto"
                    >
                        How we rank stories
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

export default MostTabsTrendingReads

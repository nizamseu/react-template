// RankedChartBestSellers

// BestSellers01 · E-commerce & Marketplaces › Featured / Best Sellers

// Description:
// A music-chart style best-seller list for the gourmet grocer Evergreen Pantry. Under
// "Top of the shelf." six ranked rows show a giant chart numeral, product photo, name,
// pack size, a sales bar, units sold, price and a ▲ / ▼ / NEW movement marker. A "This
// week / All time" switch re-ranks the chart, and "Shop the full chart" closes it out. Use
// it on food, drink or subscription stores to turn best sellers into a weekly ritual.

// Design:
// - Ordered list of six rows: one column → lg:two columns filled top-to-bottom
//   (grid-flow-col, 3 rows); each row is numeral · 64-80px thumbnail · details · price
// - Forest #0f2e24 background, cream #f2ead8 text and hairlines (cream/15), gold #e3b23c
//   for #1, sales bars, ▲ markers and the NEW chip; ▼ markers are cream/55
// - Serif numerals text-5xl → sm:text-7xl: #1 is solid gold, #2-#6 are outlined cream
//   (-webkit-text-stroke); serif heading with an italic gold word; mono meta
// - Toggle is a rounded-full segmented control whose cream pill slides between options
//   (layoutId); rows reorder with layout animation and bars grow from 0 on each switch
// - Reduced motion (MotionConfig "user") keeps fades but drops movement

// What it does:
// - range state ("week" | "all") is changed by the segmented tabs (role="tab",
//   aria-selected); the list is its tabpanel and is re-derived with useMemo
// - Each ranking has its own order, sales %, units sold, movement and chart stat
// - Rows link to #pantry-<product>; "Shop the full chart" points to #pantry-charts

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RankedChartBestSellers from '@/TestComponent/PageSections/ecommerce/BestSellers01';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <RankedChartBestSellers />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const products = {
    preserves: {
        name: 'Orchard Preserves Trio',
        meta: 'Apricot, fig & quince · 3 × 220 g',
        price: 38,
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
        alt: 'Colourful flat lay of fresh fruit',
    },
    beans: {
        name: 'Yirgacheffe Single-Origin',
        meta: 'Whole bean coffee · 340 g',
        price: 24,
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=400&q=80',
        alt: 'Freshly roasted coffee beans',
    },
    grenache: {
        name: 'Old-Vine Grenache',
        meta: 'Natural red wine · 750 ml',
        price: 29,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80',
        alt: 'Glasses of red wine raised in a toast',
    },
    pantryBox: {
        name: 'Wild Harvest Pantry Box',
        meta: 'Seasonal produce & dry goods',
        price: 64,
        image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80',
        alt: 'Crates of fresh market vegetables',
    },
    chai: {
        name: 'Stone-Ground Masala Chai',
        meta: 'Loose leaf · 200 g',
        price: 16,
        image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80',
        alt: 'Milky spiced latte in a ceramic cup',
    },
    coldBrew: {
        name: 'Night Shift Cold Brew',
        meta: 'Steeping pouches · pack of 8',
        price: 32,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
        alt: 'Kraft coffee bag with a minimal label',
    },
    espresso: {
        name: 'Evergreen House Espresso',
        meta: 'Chocolate & cherry · 1 kg',
        price: 42,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
        alt: 'Two lattes with foam art on a table',
    },
}

const rankings = {
    week: [
        { id: 'preserves', share: 100, sold: '3,482', move: 'up', by: 2, stat: '6 wks on chart' },
        { id: 'beans', share: 91, sold: '3,168', move: 'down', by: 1, stat: '31 wks on chart' },
        { id: 'grenache', share: 80, sold: '2,806', move: 'new', stat: 'First week' },
        { id: 'pantryBox', share: 68, sold: '2,370', move: 'down', by: 2, stat: '12 wks on chart' },
        { id: 'chai', share: 57, sold: '1,984', move: 'up', by: 3, stat: '4 wks on chart' },
        { id: 'coldBrew', share: 44, sold: '1,532', move: 'down', by: 1, stat: '19 wks on chart' },
    ],
    all: [
        { id: 'beans', share: 100, sold: '184,210', move: 'up', by: 1, stat: 'Since 2019' },
        { id: 'espresso', share: 88, sold: '162,904', move: 'down', by: 1, stat: 'Since 2019' },
        { id: 'preserves', share: 75, sold: '137,550', move: 'up', by: 2, stat: 'Since 2020' },
        { id: 'coldBrew', share: 61, sold: '112,318', move: 'down', by: 1, stat: 'Since 2021' },
        { id: 'pantryBox', share: 52, sold: '96,044', move: 'down', by: 1, stat: 'Since 2022' },
        { id: 'chai', share: 39, sold: '71,280', move: 'new', stat: 'New to top 6' },
    ],
}

const ranges = [
    { id: 'week', label: 'This week', soldLabel: 'sold this week', note: 'Week 39 · Sep 21 – 27, 2026' },
    { id: 'all', label: 'All time', soldLabel: 'sold since launch', note: '1.2M orders since 2019' },
]

function Movement({ move, by }) {
    if (move === 'new') {
        return (
            <span className="rounded-full bg-[#e3b23c] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0f2e24]">
                New<span className="sr-only"> entry</span>
            </span>
        )
    }

    const up = move === 'up'

    return (
        <span className={cn('font-mono text-xs font-semibold', up ? 'text-[#e3b23c]' : 'text-[#f2ead8]/55')}>
            <span aria-hidden="true">
                {up ? '▲' : '▼'} {by}
            </span>
            <span className="sr-only">{`${up ? 'Up' : 'Down'} ${by} place${by > 1 ? 's' : ''}`}</span>
        </span>
    )
}

export function RankedChartBestSellers({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [range, setRange] = useState('week')
    const uid = useId()
    const activeRange = ranges.find((item) => item.id === range)

    const rows = useMemo(
        () => rankings[range].map((entry, index) => ({ ...entry, rank: index + 1, ...products[entry.id] })),
        [range],
    )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0f2e24] px-4 py-16 font-normal text-[#f2ead8] sm:px-6 md:py-24 lg:px-10 text-base',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute -left-32 top-0 -z-10 h-96 w-96 rounded-full bg-[#e3b23c]/10 blur-3xl"
                aria-hidden="true"
            />
            <MotionConfig reducedMotion="user">
                <LayoutGroup id={uid}>
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col gap-8 border-b border-[#f2ead8]/15 pb-8 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#e3b23c]">
                                    Evergreen Pantry · The Pantry Charts
                                </p>
                                <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#f2ead8] sm:text-5xl md:text-6xl">
                                    Top of the <em className="text-[#e3b23c]">shelf.</em>
                                </h2>
                                <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#f2ead8]/55">
                                    {activeRange.note}
                                </p>
                            </div>

                            <div
                                role="tablist"
                                aria-label="Chart range"
                                className="flex self-start rounded-full border border-[#f2ead8]/20 p-1 md:self-auto"
                            >
                                {ranges.map((item) => {
                                    const isActive = item.id === range

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            role="tab"
                                            id={`${uid}-tab-${item.id}`}
                                            aria-selected={isActive}
                                            aria-controls={`${uid}-chart`}
                                            className={cn(
                                                'relative min-h-10 rounded-full px-5 text-sm font-medium text-[#f2ead8]/70 transition-colors duration-300 hover:text-[#f2ead8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3b23c]',
                                                isActive && 'text-[#0f2e24] hover:text-[#0f2e24]',
                                            )}
                                            onClick={() => setRange(item.id)}
                                        >
                                            {isActive && (
                                                <motion.span
                                                    layoutId="pantry-range-pill"
                                                    className="absolute inset-0 rounded-full bg-[#f2ead8]"
                                                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <span className="relative">{item.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <ol
                            id={`${uid}-chart`}
                            role="tabpanel"
                            aria-labelledby={`${uid}-tab-${range}`}
                            className="relative grid lg:grid-flow-col lg:grid-rows-3 lg:gap-x-14"
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                {rows.map((row) => (
                                    <motion.li
                                        key={row.id}
                                        layout
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="border-b border-[#f2ead8]/15"
                                    >
                                        <a
                                            href={`#pantry-${row.id}`}
                                            className="group grid grid-cols-[2.75rem_auto_minmax(0,1fr)_auto] items-center gap-3 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3b23c] sm:grid-cols-[4.5rem_auto_minmax(0,1fr)_auto] sm:gap-5 sm:py-6"
                                        >
                                            <span
                                                className={cn(
                                                    'text-right font-serif text-5xl leading-none tabular-nums sm:text-7xl',
                                                    row.rank === 1
                                                        ? 'text-[#e3b23c]'
                                                        : 'text-transparent [-webkit-text-stroke:1px_rgba(242,234,216,0.7)]',
                                                )}
                                            >
                                                <span className="sr-only">Number </span>
                                                {row.rank}
                                            </span>
                                            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f2ead8]/10 sm:h-20 sm:w-20">
                                                <img
                                                    src={row.image}
                                                    alt={row.alt}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-semibold text-[#f2ead8] underline-offset-4 group-hover:underline sm:text-base">
                                                    {row.name}
                                                </span>
                                                <span className="mt-0.5 block truncate text-xs text-[#f2ead8]/55">
                                                    {row.meta}
                                                </span>
                                                <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-[#f2ead8]/10">
                                                    <motion.span
                                                        key={`${range}-${row.id}`}
                                                        className="block h-full rounded-full bg-[#e3b23c]"
                                                        initial={{ width: '0%' }}
                                                        animate={{ width: `${row.share}%` }}
                                                        transition={{ duration: 0.9, delay: 0.1 + row.rank * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                                    />
                                                </span>
                                                <span className="mt-1.5 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[#f2ead8]/55 sm:text-[11px]">
                                                    <span className="truncate">
                                                        {row.sold} {activeRange.soldLabel}
                                                    </span>
                                                    <span className="hidden shrink-0 sm:inline">{row.stat}</span>
                                                </span>
                                            </span>
                                            <span className="flex flex-col items-end gap-2 self-start pt-1 sm:pt-2">
                                                <Movement move={row.move} by={row.by} />
                                                <span className="font-serif text-lg text-[#f2ead8] sm:text-xl">${row.price}</span>
                                            </span>
                                        </a>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ol>

                        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-[#f2ead8]/55">
                                <span>
                                    <span className="text-[#e3b23c]">▲</span> Climbing
                                </span>
                                <span>▼ Falling</span>
                                <span>
                                    <span className="text-[#e3b23c]">New</span> Entry
                                </span>
                                <span>Updated Mondays 09:00</span>
                            </p>
                            <a
                                href="#pantry-charts"
                                className="group/link inline-flex min-h-11 items-center gap-3 self-start rounded-full bg-[#e3b23c] px-6 text-sm font-semibold text-[#0f2e24] transition-colors duration-300 hover:bg-[#f2ead8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e3b23c]"
                            >
                                Shop the full chart
                                <HiArrowLongRight
                                    className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                                    aria-hidden="true"
                                />
                            </a>
                        </div>
                    </div>
                </LayoutGroup>
            </MotionConfig>
        </section>
    )
}

export default RankedChartBestSellers

// FilterTabsProjectsGrid

// ProjectsGrid02 · Portfolios & Personal Websites › Featured Projects Grid

// Description:
// An editorial case-study grid for product designer Elena Rossi. Under the serif heading
// "Work that made someone's day a little easier." a tab row (All 8 / Product 3 / Brand 3 /
// Motion 2) filters eight projects — Fernwood Pharmacy, Onda, Casa Mirto and more — and
// the grid re-flows with animated layout. Each card shows a photo, discipline, year, title
// and one-line outcome. Use it as the main work index of a designer portfolio.

// Design:
// - Blush #f7e8e1 background, espresso #3b2a24 type, warm mid-tone #8a5a48 for italics
//   and counts; serif headings, sans UI; cards rounded-[28px] with photo-first layout
// - Grid 1 → sm:2 → lg:3 columns with grid-flow-dense; in "All" four wide cases span two
//   columns (aspect 16/10) beside 4/5 portrait cards; filtered views use uniform cards
// - Tabs sit in a pill track with a sliding espresso indicator (shared layoutId); counts
//   in small superscripts; on mobile the track scrolls horizontally if it must
// - Filtering animates with layout + AnimatePresence (fade/scale out, fade in); hover
//   scales the photo 1.04 and reveals a round "View case" badge; reduced motion keeps
//   only opacity fades
// - Header stacks on mobile and splits heading / tabs from lg

// What it does:
// - filter state ('all' | 'product' | 'brand' | 'motion') is set by the tabs
//   (role="tablist", aria-selected, roving tabindex, Arrow/Home/End keys)
// - The grid is a role="tabpanel" labelled by the active tab; an aria-live line says how
//   many cases are showing
// - Cards link to #case-<id>; "Browse the full archive" links to #archive

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FilterTabsProjectsGrid from '@/TestComponent/PageSections/portfolio/ProjectsGrid02';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <FilterTabsProjectsGrid />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'product', label: 'Product' },
    { id: 'brand', label: 'Brand' },
    { id: 'motion', label: 'Motion' },
]

const cases = [
    {
        id: 'fernwood',
        title: 'Fernwood Pharmacy',
        category: 'product',
        discipline: 'Product · iOS & Android',
        year: '2026',
        outcome: 'Refilling a prescription in three taps — 2M patients, 4.8★ rating.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        alt: 'Doctor in a white coat holding a smartphone',
        wide: true,
    },
    {
        id: 'lumo',
        title: 'Lumo Health Portal',
        category: 'product',
        discipline: 'Product · Web app',
        year: '2025',
        outcome: 'A patient portal people actually open: weekly use up 3×.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        alt: 'Laptop on a desk showing health charts and graphs',
    },
    {
        id: 'tostatura',
        title: 'Tostatura Bruna',
        category: 'brand',
        discipline: 'Brand · Packaging',
        year: '2025',
        outcome: 'Identity and bags for a Milanese coffee roaster, now in 60 cafés.',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
        alt: 'Close-up of freshly roasted coffee beans',
    },
    {
        id: 'onda',
        title: 'Onda',
        category: 'motion',
        discipline: 'Motion · App animation',
        year: '2025',
        outcome: 'Breathing animations that pace a four-minute calm-down session.',
        image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
        alt: 'Soft pastel gradient blending pink, lilac and blue',
        wide: true,
    },
    {
        id: 'casa-mirto',
        title: 'Casa Mirto',
        category: 'brand',
        discipline: 'Brand · Menu system',
        year: '2024',
        outcome: 'Brand, menus and signage for a Sicilian trattoria in Brera.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
        alt: 'Plated fine-dining dish on a restaurant table',
        wide: true,
    },
    {
        id: 'faenza',
        title: 'Atelier Faenza',
        category: 'brand',
        discipline: 'Brand · Identity',
        year: '2024',
        outcome: 'A glaze-inspired identity for a family ceramics studio.',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        alt: 'Stack of glazed blue ceramic plates on wood',
    },
    {
        id: 'treno',
        title: 'Treno Notte',
        category: 'product',
        discipline: 'Product · Booking flow',
        year: '2024',
        outcome: 'Booking sleeper trains without the spreadsheet: 31% more completions.',
        image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
        alt: 'Traveller relaxing by a large airport window',
    },
    {
        id: 'marea',
        title: 'Marea Bank',
        category: 'motion',
        discipline: 'Motion · Launch film',
        year: '2023',
        outcome: 'Launch film and UI transitions for a digital bank’s first app.',
        image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=1200&q=80',
        alt: 'Swirling pink and blue marbled texture',
        wide: true,
    },
]

const countFor = (id) => (id === 'all' ? cases.length : cases.filter((c) => c.category === id).length)

export function FilterTabsProjectsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [filter, setFilter] = useState('all')
    const tabRefs = useRef([])
    const visible = filter === 'all' ? cases : cases.filter((c) => c.category === filter)
    const activeLabel = FILTERS.find((f) => f.id === filter).label

    const onTabKeyDown = (event, index) => {
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % FILTERS.length
        if (event.key === 'ArrowLeft') next = (index - 1 + FILTERS.length) % FILTERS.length
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = FILTERS.length - 1
        if (next === null) return
        event.preventDefault()
        setFilter(FILTERS[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f7e8e1] px-4 py-16 text-base font-normal text-[#3b2a24] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#3b2a24]/60">
                            Selected case studies · 2023—2026
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#3b2a24] sm:text-5xl lg:text-6xl">
                            Work that made someone&apos;s day a little <em className="italic text-[#8a5a48]">easier.</em>
                        </h2>
                    </div>

                    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
                        <div
                            role="tablist"
                            aria-label="Filter case studies by discipline"
                            className="inline-flex gap-0.5 rounded-full border border-[#3b2a24]/15 bg-[#fdf5f1] p-1 sm:gap-1 sm:p-1.5"
                        >
                            {FILTERS.map((f, index) => {
                                const selected = filter === f.id
                                return (
                                    <button
                                        key={f.id}
                                        ref={(el) => {
                                            tabRefs.current[index] = el
                                        }}
                                        id={`${uid}-tab-${f.id}`}
                                        type="button"
                                        role="tab"
                                        aria-selected={selected}
                                        aria-controls={`${uid}-panel`}
                                        tabIndex={selected ? 0 : -1}
                                        className={cn(
                                            'relative inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold sm:px-5 sm:text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b2a24]',
                                            selected ? 'text-[#f7e8e1]' : 'text-[#3b2a24]/70 hover:text-[#3b2a24]',
                                        )}
                                        onClick={() => setFilter(f.id)}
                                        onKeyDown={(event) => onTabKeyDown(event, index)}
                                    >
                                        {selected && (
                                            <motion.span
                                                layoutId={`${uid}-pill`}
                                                aria-hidden="true"
                                                className="absolute inset-0 rounded-full bg-[#3b2a24]"
                                                transition={
                                                    reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }
                                                }
                                            />
                                        )}
                                        <span className="relative">{f.label}</span>
                                        <sup className={cn('relative text-[10px]', selected ? 'text-[#f7e8e1]/70' : 'text-[#8a5a48]')}>
                                            {countFor(f.id)}
                                        </sup>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <p aria-live="polite" className="mt-10 font-serif text-lg italic text-[#3b2a24]/70">
                    {filter === 'all'
                        ? `All ${visible.length} case studies`
                        : `${visible.length} ${activeLabel.toLowerCase()} ${visible.length === 1 ? 'case' : 'cases'}`}
                </p>

                <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${filter}`} className="mt-5">
                    <motion.ul
                        layout={!reduceMotion}
                        className="grid grid-flow-dense grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7"
                    >
                        <AnimatePresence mode="popLayout" initial={false}>
                            {visible.map((item) => {
                                const wide = item.wide && filter === 'all'
                                return (
                                    <motion.li
                                        key={item.id}
                                        layout={!reduceMotion}
                                        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
                                        transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        className={cn(wide && 'sm:col-span-2')}
                                    >
                                        <a
                                            href={`#case-${item.id}`}
                                            className="group block rounded-[30px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3b2a24]"
                                        >
                                            <div
                                                className={cn(
                                                    'relative overflow-hidden rounded-[28px] bg-[#efd6ca]',
                                                    wide ? 'aspect-[4/3] sm:aspect-[16/10]' : 'aspect-[4/5]',
                                                )}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.alt}
                                                    loading="lazy"
                                                    className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                                                />
                                                <span className="absolute left-4 top-4 rounded-full bg-[#fdf5f1]/90 px-3 py-1.5 text-[11px] font-semibold text-[#3b2a24] backdrop-blur">
                                                    {item.discipline}
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute bottom-4 right-4 grid size-20 place-items-center rounded-full bg-[#3b2a24] text-center font-serif text-sm italic leading-tight text-[#f7e8e1] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:scale-50 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100 md:group-focus-visible:scale-100 md:group-focus-visible:opacity-100"
                                                >
                                                    <span className="flex flex-col items-center gap-0.5">
                                                        View case
                                                        <HiArrowUpRight className="size-4" />
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="mt-4 flex items-baseline justify-between gap-4 px-1">
                                                <h3 className="font-serif text-2xl font-normal leading-tight text-[#3b2a24] sm:text-[1.7rem]">
                                                    {item.title}
                                                </h3>
                                                <span className="shrink-0 font-serif text-base italic text-[#8a5a48]">{item.year}</span>
                                            </div>
                                            <p className="mt-1.5 max-w-md px-1 text-sm leading-relaxed text-[#3b2a24]/70">
                                                {item.outcome}
                                            </p>
                                        </a>
                                    </motion.li>
                                )
                            })}
                        </AnimatePresence>
                    </motion.ul>
                </div>

                <div className="mt-14 flex justify-center">
                    <a
                        href="#archive"
                        className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-[#3b2a24] px-7 text-sm font-semibold text-[#3b2a24] transition-colors duration-300 hover:bg-[#3b2a24] hover:text-[#f7e8e1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3b2a24]"
                    >
                        Browse the full archive · 24 projects
                        <HiArrowRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default FilterTabsProjectsGrid

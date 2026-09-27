// CategoryTabsSkillsToolset

// SkillsToolset04 · Portfolios & Personal Websites › Skills & Toolset

// Description:
// An editorial, serif skills section for product designer Elena Rossi. Under the heading
// "A designer's toolbox, sorted by how I think." four large numbered tabs, (01) Design,
// (02) Research, (03) Prototyping and (04) Code, swap a panel with an italic lead line, a
// short paragraph, a photo with a proof-point stat, the tools used for that craft (logo,
// since-year, how often) and the deliverables it produces. Use it on a designer portfolio
// to show breadth without a wall of logos.

// Design:
// - Blush #f7e8e1 page, espresso #3b2a24 type, paler cards #fbf1ec and hairlines at 15%;
//   font-serif display (text-5xl → lg:text-7xl) with an italic phrase, sans body copy
// - Tabs: grid-cols-2 → md:grid-cols-4 of serif words with mono numbers; the active tab
//   gets an espresso underline that glides between tabs via a shared layoutId
// - Panel: lg 12-col split, a 4:5 rounded-[32px] photo (col-span-5) with a blush stat
//   badge, and content (col-span-7): italic serif lead, body, tool rows with circular logo
//   chips and three "frequency" dots, and outlined deliverable pills
// - Motion: the panel cross-fades and rises 16px on tab change (no offset for reduced
//   motion); tool rows get a warm tint on hover
// - Responsive: photo stacks above content below lg; tool rows wrap their meta under sm

// What it does:
// - active tab state; tabs follow the WAI-ARIA tabs pattern (role tablist/tab/tabpanel,
//   aria-selected, aria-controls, roving tabIndex) with Arrow Left/Right, Home and End
// - Changing tabs re-keys the panel so AnimatePresence plays the swap
// - "Book a portfolio review" links to #elena-contact; photos load lazily

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CategoryTabsSkillsToolset from '@/TestComponent/PageSections/portfolio/SkillsToolset04';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <CategoryTabsSkillsToolset />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import {
    SiAdobeaftereffects,
    SiAdobeillustrator,
    SiAdobephotoshop,
    SiCss3,
    SiDovetail,
    SiFigma,
    SiFramer,
    SiHotjar,
    SiHtml5,
    SiMaze,
    SiMiro,
    SiReact,
    SiRive,
    SiSketch,
    SiStorybook,
    SiWebflow,
} from 'react-icons/si';
import { cn } from '@/design-system/lib/cn';

const FREQ = { Daily: 3, Weekly: 2, Monthly: 1 }

const categories = [
    {
        id: 'design',
        index: '01',
        label: 'Design',
        lead: 'Systems first, then the pixels.',
        body: 'I start with the smallest reusable part, a button or a spacing token, and grow the interface outwards. At Fernwood that habit became a 212-component library four squads build with every day.',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80',
        alt: 'Hand sketching an interface on a tablet with a stylus',
        stat: ['212', 'components in Fernwood DS v4'],
        tools: [
            { name: 'Figma', Icon: SiFigma, since: 2017, freq: 'Daily', use: 'Variables, components and every file’s single source of truth' },
            { name: 'Illustrator', Icon: SiAdobeillustrator, since: 2012, freq: 'Weekly', use: 'Icon families and editorial spot illustrations' },
            { name: 'Photoshop', Icon: SiAdobephotoshop, since: 2011, freq: 'Monthly', use: 'Retouching product shots before they reach a mock-up' },
            { name: 'Sketch', Icon: SiSketch, since: 2014, freq: 'Monthly', use: 'Legacy libraries for two long-running clients' },
        ],
        deliverables: ['Design systems', 'UI kits', 'Icon sets', 'Interaction specs'],
    },
    {
        id: 'research',
        index: '02',
        label: 'Research',
        lead: 'Listen a little longer than feels comfortable.',
        body: 'Most redesigns I have led began with a transcript, not a sketch. I plan studies with engineers in the room, so the insight and the fix arrive in the same sprint.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
        alt: 'Team arranging sticky notes on a wall during a planning session',
        stat: ['140+', 'user interviews since 2019'],
        tools: [
            { name: 'Dovetail', Icon: SiDovetail, since: 2020, freq: 'Weekly', use: 'Tagging interviews into themes the whole team can search' },
            { name: 'Maze', Icon: SiMaze, since: 2021, freq: 'Weekly', use: 'Unmoderated tests on prototypes before a line of code' },
            { name: 'Miro', Icon: SiMiro, since: 2019, freq: 'Weekly', use: 'Journey maps and opportunity trees with stakeholders' },
            { name: 'Hotjar', Icon: SiHotjar, since: 2018, freq: 'Monthly', use: 'Heatmaps that tell me where to point the next study' },
        ],
        deliverables: ['Interview guides', 'Journey maps', 'Usability reports', 'Opportunity trees'],
    },
    {
        id: 'prototyping',
        index: '03',
        label: 'Prototyping',
        lead: 'If it moves, prototype how it moves.',
        body: 'Static screens hide the hard questions. I prototype transitions, loading states and empty states early, then hand engineers a timing sheet instead of a vague “make it feel smooth”.',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
        alt: 'Smartphone resting on an open laptop keyboard',
        stat: ['63', 'prototypes tested with real users'],
        tools: [
            { name: 'Framer', Icon: SiFramer, since: 2019, freq: 'Daily', use: 'High-fidelity flows with real data and real latency' },
            { name: 'Rive', Icon: SiRive, since: 2022, freq: 'Weekly', use: 'Interactive icons and onboarding illustrations' },
            { name: 'After Effects', Icon: SiAdobeaftereffects, since: 2015, freq: 'Monthly', use: 'Motion studies and launch films' },
            { name: 'Webflow', Icon: SiWebflow, since: 2018, freq: 'Monthly', use: 'Landing-page experiments shipped without a ticket' },
        ],
        deliverables: ['Clickable flows', 'Motion specs', 'Timing sheets', 'Test scripts'],
    },
    {
        id: 'code',
        index: '04',
        label: 'Code',
        lead: 'Enough code to argue kindly with engineers.',
        body: 'I write the HTML and CSS for my own case studies and keep Storybook docs in sync with Figma. It keeps my designs honest about what the platform already does well.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
        alt: 'Laptop showing code on a desk beside a small plant',
        stat: ['38', 'Storybook stories I maintain'],
        tools: [
            { name: 'HTML', Icon: SiHtml5, since: 2010, freq: 'Weekly', use: 'Semantic, accessible markup for my own site' },
            { name: 'CSS', Icon: SiCss3, since: 2010, freq: 'Weekly', use: 'Grid, container queries and fluid type scales' },
            { name: 'React', Icon: SiReact, since: 2020, freq: 'Monthly', use: 'Reading and tweaking components in design reviews' },
            { name: 'Storybook', Icon: SiStorybook, since: 2021, freq: 'Weekly', use: 'Docs pages that mirror the Figma library' },
        ],
        deliverables: ['Coded prototypes', 'Token files', 'Storybook docs', 'QA checklists'],
    },
]

export function CategoryTabsSkillsToolset({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const [active, setActive] = useState('design')
    const tabRefs = useRef([])
    const activeIndex = categories.findIndex((c) => c.id === active)
    const current = categories[activeIndex]

    const onKeyDown = (event) => {
        const last = categories.length - 1
        let next = null
        if (event.key === 'ArrowRight') next = activeIndex === last ? 0 : activeIndex + 1
        if (event.key === 'ArrowLeft') next = activeIndex === 0 ? last : activeIndex - 1
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = last
        if (next === null) return
        event.preventDefault()
        setActive(categories[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#f7e8e1] text-base font-normal text-[#3b2a24]', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#3b2a24]/60">
                            Elena Rossi — Craft &amp; tools
                        </p>
                        <h2 className="mt-5 font-serif text-5xl font-normal leading-[1.02] tracking-tight text-[#3b2a24] sm:text-6xl lg:text-7xl">
                            A designer’s toolbox, sorted by <em className="font-serif italic">how I think.</em>
                        </h2>
                    </div>
                    <p className="max-w-sm text-base leading-relaxed text-[#3b2a24]/70 lg:col-span-4 lg:justify-self-end">
                        Twelve years across product, brand and motion. Pick a room of the house to see the
                        tools that live there.
                    </p>
                </div>

                <div
                    role="tablist"
                    aria-label="Skill categories"
                    className="mt-12 grid grid-cols-2 border-t border-[#3b2a24]/15 md:grid-cols-4"
                    onKeyDown={onKeyDown}
                >
                    {categories.map((category, index) => {
                        const selected = category.id === active
                        return (
                            <button
                                key={category.id}
                                ref={(el) => {
                                    tabRefs.current[index] = el
                                }}
                                id={`${uid}-tab-${category.id}`}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                aria-controls={`${uid}-panel`}
                                tabIndex={selected ? 0 : -1}
                                className={cn(
                                    'group relative flex min-h-[84px] flex-col items-start justify-end gap-2 border-b border-[#3b2a24]/15 px-1 pb-4 pt-5 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#3b2a24] sm:min-h-[104px]',
                                    selected ? 'text-[#3b2a24]' : 'text-[#3b2a24]/45 hover:text-[#3b2a24]/80',
                                )}
                                onClick={() => setActive(category.id)}
                            >
                                <span className="font-mono text-[11px] tracking-wider">({category.index})</span>
                                <span className="font-serif text-2xl leading-none md:text-3xl lg:text-4xl">{category.label}</span>
                                {selected && (
                                    <motion.span
                                        layoutId={`${uid}-underline`}
                                        aria-hidden="true"
                                        className="absolute inset-x-0 -bottom-px h-[3px] bg-[#3b2a24]"
                                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>

                <div
                    id={`${uid}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${uid}-tab-${current.id}`}
                    tabIndex={0}
                    className="mt-10 rounded-[32px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#3b2a24] md:mt-14"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="grid gap-10 lg:grid-cols-12 lg:gap-14"
                        >
                            <figure className="relative self-start lg:col-span-5">
                                <div className="aspect-[4/5] overflow-hidden rounded-[32px] bg-[#ecd5cb] sm:aspect-[16/10] lg:aspect-[4/5]">
                                    <img
                                        src={current.image}
                                        alt={current.alt}
                                        loading="lazy"
                                        className="size-full object-cover"
                                    />
                                </div>
                                <figcaption className="absolute bottom-4 left-4 right-4 flex items-end gap-3 rounded-3xl bg-[#f7e8e1]/95 p-4 shadow-[0_18px_40px_-20px_rgba(59,42,36,0.6)] sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[80%] sm:p-5">
                                    <span className="font-serif text-4xl leading-none text-[#3b2a24] sm:text-5xl">{current.stat[0]}</span>
                                    <span className="pb-1 text-sm leading-snug text-[#3b2a24]/75">{current.stat[1]}</span>
                                </figcaption>
                            </figure>

                            <div className="lg:col-span-7">
                                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#3b2a24]/55">
                                    {current.index} / {String(categories.length).padStart(2, '0')} · {current.label}
                                </p>
                                <h3 className="mt-4 font-serif text-3xl font-normal italic leading-tight text-[#3b2a24] sm:text-4xl">
                                    “{current.lead}”
                                </h3>
                                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#3b2a24]/75">{current.body}</p>

                                <ul className="mt-8 border-t border-[#3b2a24]/15">
                                    {current.tools.map((tool) => {
                                        const Icon = tool.Icon
                                        const dots = FREQ[tool.freq]
                                        return (
                                            <li
                                                key={tool.name}
                                                className="flex items-start gap-4 border-b border-[#3b2a24]/15 px-2 py-4 transition-colors duration-300 hover:bg-[#fbf1ec] sm:items-center"
                                            >
                                                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#3b2a24]/20 bg-[#fbf1ec] text-[#3b2a24]">
                                                    <Icon aria-hidden="true" className="size-5" />
                                                </span>
                                                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-6">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-serif text-xl leading-tight text-[#3b2a24]">{tool.name}</p>
                                                        <p className="mt-0.5 text-sm leading-snug text-[#3b2a24]/65">{tool.use}</p>
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-4 sm:mt-0 sm:shrink-0">
                                                        <span className="font-mono text-[11px] text-[#3b2a24]/55">since {tool.since}</span>
                                                        <span className="flex items-center gap-1.5">
                                                            <span aria-hidden="true" className="flex gap-1">
                                                                {[1, 2, 3].map((n) => (
                                                                    <span
                                                                        key={n}
                                                                        className={cn(
                                                                            'size-1.5 rounded-full',
                                                                            n <= dots ? 'bg-[#3b2a24]' : 'bg-[#3b2a24]/20',
                                                                        )}
                                                                    />
                                                                ))}
                                                            </span>
                                                            <span className="w-14 text-xs text-[#3b2a24]/70">{tool.freq}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>

                                <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#3b2a24]/55">
                                            What you get
                                        </p>
                                        <ul className="mt-3 flex flex-wrap gap-2">
                                            {current.deliverables.map((item) => (
                                                <li
                                                    key={item}
                                                    className="rounded-full border border-[#3b2a24]/30 px-3.5 py-1.5 text-sm text-[#3b2a24]"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <a
                                        href="#elena-contact"
                                        className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full bg-[#3b2a24] px-5 text-sm font-semibold text-[#f7e8e1] transition-colors duration-300 hover:bg-[#2a1d18] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3b2a24] sm:self-auto"
                                    >
                                        Book a portfolio review
                                        <HiArrowLongRight
                                            aria-hidden="true"
                                            className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default CategoryTabsSkillsToolset

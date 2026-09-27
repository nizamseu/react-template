// QuoteMasonryTestimonials

// Testimonials01 · Portfolios & Personal Websites › Testimonials / Recommendations

// Description:
// A warm, editorial wall of recommendations for product designer Elena Rossi. Under the
// serif heading "Elena, according to the people who’ve worked with her." eight quote cards
// flow in a masonry layout, each with an avatar, name, role and a relationship line such as
// "Managed Elena at Fernwood, 2019–2022". Chips filter the wall by Managers, Teammates and
// Clients. Use it on a portfolio home or about page as social proof before the contact
// form.

// Design:
// - Masonry built with CSS columns (columns-1 → sm:columns-2 → lg:columns-3, gap-5) and
//   break-inside-avoid cards; the header splits into heading + stats from md
// - Blush #f7e8e1 background, espresso #3b2a24 text, terracotta #b5654a accents; card tones
//   paper #fdf5f1, feature #fffaf7, rose #ecc9bb and one solid espresso card
// - Serif quotes (text-lg, text-2xl on feature cards, text-3xl on the espresso card) with
//   one phrase drawn as a rose marker stroke; sans captions; rounded-[28px] cards, hairline
//   rings, a soft shadow on feature cards
// - Filter changes fade and rise the wall (AnimatePresence mode="wait"); cards lift 4px on
//   hover; movement is removed for reduced motion, the first paint is not animated
// - Responsive: base single column with stacked header; sm two columns; md header row with
//   stats on the right; lg three columns and larger display type

// What it does:
// - filter state ('all' | 'manager' | 'teammate' | 'client') is set by the chip buttons
//   (aria-pressed, each shows its count) and decides which cards render
// - A polite aria-live line announces how many recommendations are shown
// - "Read all 38 recommendations" links to #recommendations and "Ask Elena for a reference"
//   links to #contact; avatars and marker strokes are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import QuoteMasonryTestimonials from '@/TestComponent/PageSections/portfolio/Testimonials01';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <QuoteMasonryTestimonials />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const recommendations = [
    {
        id: 'hannah',
        name: 'Hannah Whitfield',
        role: 'VP of Design, Fernwood',
        relation: 'Managed Elena at Fernwood, 2019–2022',
        group: 'manager',
        tone: 'feature',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        quote: [
            'Elena is the designer I’d clone first. She took our checkout from a nine-step maze to three calm screens and ',
            'lifted conversion by 31%',
            ' — then ran a lunch-and-learn so the whole team could do it too.',
        ],
    },
    {
        id: 'marcus',
        name: 'Marcus Oyelaran',
        role: 'Staff Engineer, Loop Health',
        relation: 'Built the Loop Health app with Elena',
        group: 'teammate',
        tone: 'paper',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        quote: [
            'Her Figma files read like a spec. Every state, every empty screen, every error — ',
            'named, annotated and talked through',
            ' with us before sprint planning even started.',
        ],
    },
    {
        id: 'priya',
        name: 'Priya Natarajan',
        role: 'Head of Product, Marlow Bank',
        relation: 'Hired Elena for the Marlow savings redesign',
        group: 'client',
        tone: 'rose',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
        quote: [
            'We came to Elena with a 40-page brief. She came back with one sentence that became our product principle — and fourteen weeks later with ',
            'an app our members rate 4.8',
            '.',
        ],
    },
    {
        id: 'amara',
        name: 'Amara Osei',
        role: 'UX Researcher, Loop Health',
        relation: 'Ran 60+ user interviews with Elena',
        group: 'teammate',
        tone: 'espresso',
        avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80',
        quote: ['Elena listens like a researcher and ', 'ships like an engineer', '.'],
    },
    {
        id: 'david',
        name: 'David Kim',
        role: 'Chief Product Officer, Fernwood',
        relation: 'Elena’s skip-level manager at Fernwood',
        group: 'manager',
        tone: 'paper',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        quote: [
            'When the research said we were wrong, Elena was the one who said it out loud in the board room — ',
            'with data, with kindness',
            ', and with a plan B already prototyped.',
        ],
    },
    {
        id: 'giulia',
        name: 'Giulia Bassi',
        role: 'Founder, Orto Farm Boxes',
        relation: 'Elena’s first freelance client, 2018',
        group: 'client',
        tone: 'paper',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
        quote: [
            'She sketched our ordering flow on a napkin over espresso. The version we shipped is almost identical, and it ',
            'doubled repeat orders',
            ' in one season.',
        ],
    },
    {
        id: 'tomas',
        name: 'Tomás Ferreira',
        role: 'Design Lead, Tessera Studio',
        relation: 'Shared a desk with Elena at Tessera',
        group: 'teammate',
        tone: 'paper',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
        quote: [
            'Elena critiques the work, never the person. ',
            'Juniors left her reviews smarter and happier',
            ' — which, in this industry, is rare.',
        ],
    },
    {
        id: 'leon',
        name: 'Leon Hartmann',
        role: 'Product Manager, Brightline Transit',
        relation: 'Worked with Elena on Brightline Tickets',
        group: 'client',
        tone: 'feature',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        quote: [
            'Riders over 65 used to phone our helpline just to buy a ticket. After Elena’s redesign, ',
            'support calls dropped 42%',
            ' in the first quarter.',
        ],
    },
]

const filters = [
    { id: 'all', label: 'All' },
    { id: 'manager', label: 'Managers' },
    { id: 'teammate', label: 'Teammates' },
    { id: 'client', label: 'Clients' },
]

const groupLabel = { manager: 'Manager', teammate: 'Teammate', client: 'Client' }

const tones = {
    paper: 'bg-[#fdf5f1] text-[#3b2a24] ring-1 ring-[#3b2a24]/10',
    feature:
        'bg-[#fffaf7] text-[#3b2a24] ring-1 ring-[#3b2a24]/15 shadow-[0_40px_70px_-45px_rgba(59,42,36,0.6)]',
    rose: 'bg-[#ecc9bb] text-[#3b2a24]',
    espresso: 'bg-[#3b2a24] text-[#f7e8e1]',
}

const stats = [
    { label: 'Written recommendations', value: '38' },
    { label: 'Companies & studios', value: '5' },
    { label: 'Years in product design', value: '12' },
]

export function QuoteMasonryTestimonials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [filter, setFilter] = useState('all')

    const visible = filter === 'all' ? recommendations : recommendations.filter((item) => item.group === filter)
    const countFor = (id) =>
        id === 'all' ? recommendations.length : recommendations.filter((item) => item.group === id).length

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
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 -top-40 size-[28rem] rounded-full bg-[#f1d6ca] blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b5654a]">
                            <span aria-hidden="true" className="h-px w-10 bg-[#b5654a]" />
                            Kind words · Elena Rossi, Product Designer
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-tight text-[#3b2a24] sm:text-5xl lg:text-6xl">
                            Elena, according to the people who’ve{' '}
                            <em className="text-[#b5654a]">worked with her.</em>
                        </h2>
                    </div>

                    <dl className="grid grid-cols-3 gap-4 border-t border-[#3b2a24]/15 pt-6 sm:gap-8 md:max-w-sm md:border-t-0 md:pt-0">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col-reverse gap-1">
                                <dt className="text-[11px] leading-snug text-[#3b2a24]/65">{stat.label}</dt>
                                <dd className="font-serif text-4xl leading-none text-[#3b2a24] sm:text-5xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div role="group" aria-label="Filter recommendations" className="flex flex-wrap gap-2">
                        {filters.map((item) => {
                            const active = filter === item.id
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={active}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5654a]',
                                        active
                                            ? 'bg-[#3b2a24] text-[#f7e8e1]'
                                            : 'bg-transparent text-[#3b2a24] ring-1 ring-[#3b2a24]/25 hover:bg-[#3b2a24]/5',
                                    )}
                                    onClick={() => setFilter(item.id)}
                                >
                                    {item.label}
                                    <span
                                        className={cn(
                                            'font-serif text-xs italic',
                                            active ? 'text-[#f1c7b6]' : 'text-[#b5654a]',
                                        )}
                                    >
                                        {countFor(item.id)}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                    <p aria-live="polite" className="font-serif text-sm italic text-[#3b2a24]/70">
                        Showing {visible.length} of 38 recommendations
                    </p>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={filter}
                        initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3"
                    >
                        {visible.map((item) => {
                            const dark = item.tone === 'espresso'
                            return (
                                <figure
                                    key={item.id}
                                    className={cn(
                                        'mb-5 break-inside-avoid rounded-[28px] p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7',
                                        tones[item.tone],
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'font-serif text-7xl leading-[0.7]',
                                                dark ? 'text-[#e7a58c]' : 'text-[#b5654a]',
                                            )}
                                        >
                                            “
                                        </span>
                                        <span
                                            className={cn(
                                                'rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]',
                                                dark
                                                    ? 'bg-[#f7e8e1]/10 text-[#f7e8e1]'
                                                    : 'bg-[#3b2a24]/[0.06] text-[#3b2a24]/80',
                                            )}
                                        >
                                            {groupLabel[item.group]}
                                        </span>
                                    </div>

                                    <blockquote
                                        className={cn(
                                            'mt-3 font-serif leading-snug',
                                            item.tone === 'feature' && 'text-2xl leading-[1.25] sm:text-[1.65rem]',
                                            item.tone === 'espresso' && 'text-3xl leading-[1.15]',
                                            (item.tone === 'paper' || item.tone === 'rose') && 'text-lg',
                                        )}
                                    >
                                        <p>
                                            {item.quote[0]}
                                            <mark
                                                className={cn(
                                                    'box-decoration-clone bg-transparent px-0.5 text-inherit',
                                                    dark
                                                        ? 'bg-[linear-gradient(transparent_60%,rgba(231,165,140,0.45)_60%)]'
                                                        : 'bg-[linear-gradient(transparent_58%,#eab9a5_58%)]',
                                                )}
                                            >
                                                {item.quote[1]}
                                            </mark>
                                            {item.quote[2]}
                                        </p>
                                    </blockquote>

                                    <figcaption
                                        className={cn(
                                            'mt-6 flex items-center gap-3 border-t pt-5',
                                            dark ? 'border-[#f7e8e1]/15' : 'border-[#3b2a24]/12',
                                        )}
                                    >
                                        <img
                                            src={item.avatar}
                                            alt={`Portrait of ${item.name}`}
                                            loading="lazy"
                                            width={44}
                                            height={44}
                                            className="size-11 shrink-0 rounded-full object-cover ring-2 ring-[#f7e8e1]"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold leading-tight">{item.name}</p>
                                            <p
                                                className={cn(
                                                    'mt-0.5 text-xs',
                                                    dark ? 'text-[#f7e8e1]/70' : 'text-[#3b2a24]/65',
                                                )}
                                            >
                                                {item.role}
                                            </p>
                                            <p
                                                className={cn(
                                                    'mt-1.5 font-serif text-[13px] italic',
                                                    dark ? 'text-[#e7a58c]' : 'text-[#b5654a]',
                                                )}
                                            >
                                                {item.relation}
                                            </p>
                                        </div>
                                    </figcaption>
                                </figure>
                            )
                        })}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex flex-col gap-4 border-t border-[#3b2a24]/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3" aria-hidden="true">
                            {recommendations.slice(0, 4).map((item) => (
                                <img
                                    key={item.id}
                                    src={item.avatar}
                                    alt=""
                                    loading="lazy"
                                    width={36}
                                    height={36}
                                    className="size-9 rounded-full object-cover ring-2 ring-[#f7e8e1]"
                                />
                            ))}
                        </div>
                        <p className="font-serif text-base italic text-[#3b2a24]/80">
                            38 of 38 said they’d hire her again.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <a
                            href="#recommendations"
                            className="group inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#3b2a24] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b5654a]"
                        >
                            <span className="border-b border-[#3b2a24]/40 pb-0.5 transition-colors group-hover:border-[#b5654a]">
                                Read all 38 recommendations
                            </span>
                            <HiArrowUpRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </a>
                        <a
                            href="#contact"
                            className="group inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#b5654a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b5654a]"
                        >
                            <span className="border-b border-[#b5654a]/40 pb-0.5 transition-colors group-hover:border-[#b5654a]">
                                Ask Elena for a reference
                            </span>
                            <HiArrowUpRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default QuoteMasonryTestimonials

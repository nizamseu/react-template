// RecommendationLettersTestimonials

// Testimonials02 · Portfolios & Personal Websites › Testimonials / Recommendations

// Description:
// A crisp, document-like register of five recommendation letters for frontend developer
// Rafi Chowdhury. Under the heading "Recommendation letters, unabridged." each row shows
// the recommender, date, relationship and time worked together next to the letter’s opening
// paragraph; "Read full letter" expands the rest with a signature. Use it on a developer
// portfolio or CV page when detailed references matter more than one-line quotes.

// Design:
// - Ruled register: rows split into a meta column and a letter column from lg
//   (grid-cols-[280px_1fr]); hairline #0b0b0f/10 dividers, generous vertical rhythm
// - White #ffffff background, near-black #0b0b0f text, cobalt #1f3fff for reference
//   numbers, relationship chips, the open-letter rule and links
// - Tight sans display heading (text-4xl → sm:6xl → lg:7xl, tracking -0.03em); mono dates,
//   reference numbers and word counts; opening paragraphs text-xl → sm:text-2xl
// - Expanding letters animate height/opacity with framer-motion (instant for reduced
//   motion); the chevron rotates and a cobalt left rule marks open letters
// - Responsive: base stacks meta (number and date on one line) above the letter; sm grows
//   the type; lg switches to the two-column register (number over date) with a right-aligned
//   summary and button in the header

// What it does:
// - open state is a list of letter ids; each "Read full letter" button toggles its id
//   (aria-expanded + aria-controls); "Expand all letters" / "Collapse all letters"
//   (aria-pressed) toggles every letter
// - Word counts are derived from the letter text in the data
// - "Request a reference call" links to #contact and "Download letters (PDF)" links to
//   #references-pdf; avatars are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RecommendationLettersTestimonials from '@/TestComponent/PageSections/portfolio/Testimonials02';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <RecommendationLettersTestimonials />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowDownTray, HiArrowRight, HiChevronDown } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const letters = [
    {
        id: 'ref-01',
        name: 'Farzana Haque',
        role: 'Engineering Manager, Shohoj Pay',
        relation: 'Managed Rafi directly',
        together: '3 yrs together',
        date: '12.03.2026',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        opening:
            'Rafi joined Shohoj Pay as our third frontend engineer and left as the person the whole company asked “is this fast enough?”. I would hire him again tomorrow.',
        body: [
            'He led the rebuild of our merchant dashboard from a jQuery-era app to React and TypeScript. He cut the work into eleven shippable slices so we never froze features, and p75 load time fell from 6.8 s to 1.9 s on a mid-range Android phone on 3G.',
            'Just as important: he wrote the docs nobody asked for. Our component library, the accessibility checklist and the onboarding guide for new engineers all started as his Friday-afternoon notes.',
            'If you need someone who cares about the last 10% — focus states, loading skeletons, the error message on the fifth retry — Rafi is that engineer.',
        ],
    },
    {
        id: 'ref-02',
        name: 'Jonas Lindqvist',
        role: 'Design Director, Northbeam Labs',
        relation: 'Design partner on Northbeam Studio',
        together: '14 months',
        date: '03.02.2026',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        opening:
            'Rafi is the rare developer designers argue over. He reads a design file like a score, then quietly makes it better.',
        body: [
            'On Northbeam Studio he turned a 40-screen prototype into a production app with 60 fps transitions on every route. When a spec was ambiguous he never guessed — he sent a 20-second screen recording with two options and a recommendation.',
            'He also authored our motion tokens: five durations and three easing curves, still used across web and iOS two years later.',
        ],
    },
    {
        id: 'ref-03',
        name: 'Aisha Rahman',
        role: 'CTO, Parcelly',
        relation: 'Hired Rafi as a contractor',
        together: '6 weeks, 2024',
        date: '18.11.2025',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        opening:
            'We gave Rafi six weeks to ship a parcel-tracking page before peak season. He shipped in four, and it handled 1.2 million visits over Eid weekend without a single incident.',
        body: [
            'He set up our first performance budget in CI. It still fails the build whenever the tracking bundle grows past 180 KB, and it has saved us from ourselves at least a dozen times.',
            'The surprise was communication: short written updates every evening, clear trade-offs, no drama. Our ops team asked if we could keep him.',
        ],
    },
    {
        id: 'ref-04',
        name: 'Daniel Okoye',
        role: 'Core maintainer, Orbit UI (open source)',
        relation: 'Reviewed 70+ of Rafi’s pull requests',
        together: 'Since 2021',
        date: '07.08.2025',
        avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80',
        opening:
            'Rafi’s pull requests are the ones I can merge before my first coffee: small, tested, and with a description that explains the why.',
        body: [
            'He contributed the keyboard-navigation layer for our combobox and menu primitives, which closed 19 open accessibility issues in a single release.',
            'He also runs office hours for first-time contributors in our community chat twice a week — patiently, and for free.',
        ],
    },
    {
        id: 'ref-05',
        name: 'Sarah Holm',
        role: 'Senior Product Manager, Kitebase',
        relation: 'Shipped Kitebase Checkout with Rafi',
        together: '2 yrs together',
        date: '22.04.2025',
        avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
        opening: 'Rafi turns a vague product idea into something you can click by Friday.',
        body: [
            'Our checkout experiments ran twice as fast once he built a feature-flag playground for product managers. We tested 14 variants in one quarter and kept the one that lifted completed orders by 9%.',
            'He is honest about estimates — and, annoyingly for the rest of us, usually right.',
        ],
    },
].map((letter) => ({
    ...letter,
    words: [letter.opening, ...letter.body].join(' ').split(/\s+/).length,
}))

export function RecommendationLettersTestimonials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [open, setOpen] = useState([])
    const allOpen = open.length === letters.length

    const toggle = (id) => setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    const toggleAll = () => setOpen(allOpen ? [] : letters.map((letter) => letter.id))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-white px-4 py-16 text-base font-normal text-[#0b0b0f] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#1f3fff]">
                            05 / References — Rafi Chowdhury
                        </p>
                        <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.03em] text-[#0b0b0f] sm:text-6xl lg:text-7xl">
                            Recommendation letters, <span className="text-[#1f3fff]">unabridged.</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-5 lg:items-end lg:text-right">
                        <p className="max-w-sm text-sm leading-relaxed text-[#0b0b0f]/65">
                            Five letters from managers, clients and maintainers I’ve worked with since 2020 —
                            published in full, with their permission.
                        </p>
                        <button
                            type="button"
                            aria-pressed={allOpen}
                            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[#0b0b0f] px-5 text-sm font-semibold text-[#0b0b0f] transition-colors duration-200 hover:bg-[#0b0b0f] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff] lg:self-end"
                            onClick={toggleAll}
                        >
                            {allOpen ? 'Collapse all letters' : 'Expand all letters'}
                            <HiChevronDown
                                aria-hidden="true"
                                className={cn('size-4 transition-transform duration-300', allOpen && 'rotate-180')}
                            />
                        </button>
                    </div>
                </div>

                <ol className="mt-14 border-b border-[#0b0b0f]/10">
                    {letters.map((letter, index) => {
                        const isOpen = open.includes(letter.id)
                        const panelId = `${letter.id}-letter`
                        return (
                            <li key={letter.id} className="border-t border-[#0b0b0f]/10">
                                <article className="grid gap-6 py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14 lg:py-10">
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center justify-between gap-4 font-mono text-xs lg:flex-col lg:items-start lg:gap-1">
                                            <span className="text-[#1f3fff]">REF—{String(index + 1).padStart(2, '0')}</span>
                                            <span className="text-[#0b0b0f]/55">
                                                <span className="sr-only">Written on </span>
                                                {letter.date}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={letter.avatar}
                                                alt={`Portrait of ${letter.name}`}
                                                loading="lazy"
                                                width={48}
                                                height={48}
                                                className="size-12 shrink-0 rounded-full object-cover grayscale"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-semibold leading-tight text-[#0b0b0f]">{letter.name}</p>
                                                <p className="mt-0.5 text-sm leading-snug text-[#0b0b0f]/60">{letter.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-[#1f3fff]/[0.08] px-3 py-1 text-xs font-medium text-[#1f3fff]">
                                                {letter.relation}
                                            </span>
                                            <span className="font-mono text-[11px] text-[#0b0b0f]/55">{letter.together}</span>
                                        </div>
                                    </div>

                                    <div
                                        className={cn(
                                            'min-w-0 border-l-2 pl-5 transition-colors duration-300 sm:pl-7',
                                            isOpen ? 'border-[#1f3fff]' : 'border-[#0b0b0f]/[0.06]',
                                        )}
                                    >
                                        <p className="text-sm text-[#0b0b0f]/50">Dear hiring team,</p>
                                        <p className="mt-3 max-w-3xl text-xl font-medium leading-snug tracking-tight text-[#0b0b0f] sm:text-2xl">
                                            {letter.opening}
                                        </p>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    key="body"
                                                    id={panelId}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="max-w-3xl space-y-4 pt-5 text-base leading-relaxed text-[#0b0b0f]/75">
                                                        {letter.body.map((paragraph) => (
                                                            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                                                        ))}
                                                        <div className="pt-3">
                                                            <p className="font-serif text-2xl italic text-[#0b0b0f]">
                                                                — {letter.name}
                                                            </p>
                                                            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[#0b0b0f]/50">
                                                                {letter.role} · contact details on request
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            className="group mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#1f3fff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3fff]"
                                            onClick={() => toggle(letter.id)}
                                        >
                                            <span className="border-b border-[#1f3fff]/30 pb-0.5 group-hover:border-[#1f3fff]">
                                                {isOpen ? 'Show less' : 'Read full letter'}
                                            </span>
                                            <span className="font-mono text-[11px] font-normal text-[#0b0b0f]/45">
                                                {letter.words} words
                                            </span>
                                            <HiChevronDown
                                                aria-hidden="true"
                                                className={cn('size-4 transition-transform duration-300', isOpen && 'rotate-180')}
                                            />
                                        </button>
                                    </div>
                                </article>
                            </li>
                        )
                    })}
                </ol>

                <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-sm leading-relaxed text-[#0b0b0f]/65">
                        Want to talk to one of them? I’ll introduce you to any of these five people within a
                        working day.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="#references-pdf"
                            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0b0b0f]/15 px-5 text-sm font-semibold text-[#0b0b0f] transition-colors hover:border-[#0b0b0f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]"
                        >
                            <HiArrowDownTray aria-hidden="true" className="size-4" />
                            Download letters (PDF)
                        </a>
                        <a
                            href="#contact"
                            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1f3fff] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0b0b0f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]"
                        >
                            Request a reference call
                            <HiArrowRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RecommendationLettersTestimonials

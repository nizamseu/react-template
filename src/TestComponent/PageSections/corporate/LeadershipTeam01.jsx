// MonochromeGridLeadershipTeam

// LeadershipTeam01 · Corporate & Business › Leadership / Core Team

// Description:
// A calm, monochrome portrait grid of the executive committee for the fictional Clearwater
// Bank. Under "The people accountable for your money." eight leaders appear in black and
// white with name, title and a LinkedIn link; each portrait turns to colour on hover or
// focus, and a "+" button reveals that person’s remit and start year. Footer links lead to
// the Board of Directors and the 2025 governance report. Use it on an about, investor or
// governance page for a bank, insurer or other regulated business.

// Design:
// - White section, deep teal #0f4c5c headings, index chips and hover fills, brass #b08d57
//   for the eyebrow rule, top-edge hover line, remit labels and focus rings; ink #14232a
// - Grid 2 → sm:3 → lg:4 columns; 4/5 portraits with square corners, grayscale + slight
//   contrast, easing to full colour and a 1.03 zoom over 700ms on hover / focus-within
// - Remit overlay: teal at 94% over the portrait with a brass label and three duties; the
//   round "+" button rotates to "×" while open
// - Serif display heading text-4xl → md:text-6xl; names in semibold sans teal, titles in
//   small ink/60; LinkedIn icon buttons are 40px circles that fill teal on hover
// - Portraits fade and rise in with a stagger when scrolled into view (no offset with
//   reduced motion); header stacks on mobile and splits 7/5 from md

// What it does:
// - openId holds the leader whose remit overlay is open (one at a time); the "+" button
//   toggles it with aria-expanded / aria-controls, and Escape closes it and returns focus
// - An open overlay also keeps that portrait in colour; hover and keyboard focus inside a
//   card do the same without state
// - LinkedIn links point to #linkedin-<id>; footer links to #clearwater-board and
//   #clearwater-governance-2025

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MonochromeGridLeadershipTeam from '@/TestComponent/PageSections/corporate/LeadershipTeam01';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <MonochromeGridLeadershipTeam />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiOutlineDocumentArrowDown, HiPlus } from 'react-icons/hi2';
import { RiLinkedinFill } from 'react-icons/ri';
import { cn } from '@/design-system/lib/cn';

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const leaders = [
    {
        id: 'helena-marsh',
        name: 'Helena Marsh',
        title: 'Group Chief Executive',
        since: 2016,
        image: photo('1573496359142-b8d87734a5a2'),
        alt: 'Helena Marsh smiling in a grey blazer',
        remit: ['Group strategy and culture', 'Relationship with the regulator', 'The 2030 net-zero lending plan'],
    },
    {
        id: 'tobias-reinholt',
        name: 'Tobias Reinholt',
        title: 'Chief Financial Officer',
        since: 2019,
        image: photo('1560250097-0b93528c311a'),
        alt: 'Tobias Reinholt in glasses and a dark suit',
        remit: ['Capital and liquidity', 'Investor relations', 'Treasury and tax'],
    },
    {
        id: 'adaeze-nwosu',
        name: 'Adaeze Nwosu',
        title: 'Chief Risk Officer',
        since: 2014,
        image: photo('1573497019940-1c28c88b4f3e'),
        alt: 'Adaeze Nwosu smiling, with curly hair and a patterned blazer',
        remit: ['Credit and market risk', 'Fraud and financial crime', 'Stress testing'],
    },
    {
        id: 'graham-pell',
        name: 'Graham Pell',
        title: 'Chief Operating Officer',
        since: 2011,
        image: photo('1472099645785-5658abf4ff4e'),
        alt: 'Graham Pell, an older man in glasses and a dark polo shirt',
        remit: ['Branches and contact centres', 'Payments operations', 'Property and procurement'],
    },
    {
        id: 'ama-boateng',
        name: 'Ama Boateng',
        title: 'Chief Technology Officer',
        since: 2021,
        image: photo('1531123897727-8f129e1688ce'),
        alt: 'Ama Boateng in a white collar, lit by warm light',
        remit: ['Core banking platform', 'Cyber security', 'Data and AI governance'],
    },
    {
        id: 'jonas-lindqvist',
        name: 'Jonas Lindqvist',
        title: 'Managing Director, Retail Banking',
        since: 2018,
        image: photo('1599566150163-29194dcaad36'),
        alt: 'Jonas Lindqvist with glasses and a red beard',
        remit: ['Current accounts and savings', 'Mortgages', '2.4m personal customers'],
    },
    {
        id: 'sofia-marchetti',
        name: 'Sofia Marchetti',
        title: 'Chief People Officer',
        since: 2020,
        image: photo('1580489944761-15a19d654956'),
        alt: 'Sofia Marchetti smiling, with her hair in a bun',
        remit: ['Hiring and development', 'Pay and pensions', 'Inclusion for 6,800 colleagues'],
    },
    {
        id: 'daniel-rosen',
        name: 'Daniel Rosen',
        title: 'General Counsel & Company Secretary',
        since: 2017,
        image: photo('1500648767791-00dcc994a43e'),
        alt: 'Daniel Rosen smiling in a grey sweater over a collared shirt',
        remit: ['Legal and compliance', 'Board governance', 'Conduct and complaints'],
    },
]

export function MonochromeGridLeadershipTeam({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [openId, setOpenId] = useState(null)

    const toggle = (id) => setOpenId((current) => (current === id ? null : id))

    const onCardKeyDown = (event, id) => {
        if (event.key !== 'Escape' || openId !== id) return
        event.stopPropagation()
        setOpenId(null)
        event.currentTarget.querySelector('[data-remit-toggle]')?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-20 text-base font-normal text-[#14232a] sm:px-6 md:py-28 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-7">
                        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0f4c5c]">
                            <span aria-hidden="true" className="h-px w-10 bg-[#b08d57]" />
                            Clearwater Bank · Executive Committee
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-tight text-[#0f4c5c] sm:text-5xl md:text-6xl">
                            The people accountable for <em className="text-[#b08d57]">your money.</em>
                        </h2>
                    </div>
                    <div className="md:col-span-5 md:pl-8">
                        <p className="text-sm leading-relaxed text-[#14232a]/70">
                            Eight executives with 72 years at Clearwater between them. Each one is personally
                            named by the regulator for the areas they run, so you know exactly who answers for
                            what.
                        </p>
                    </div>
                </div>

                <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 md:mt-16 lg:grid-cols-4 lg:gap-y-14">
                    {leaders.map((leader, index) => {
                        const open = openId === leader.id
                        return (
                            <motion.li
                                key={leader.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                                onKeyDown={(event) => onCardKeyDown(event, leader.id)}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'absolute inset-x-0 top-0 z-10 h-[3px] origin-left bg-[#b08d57] transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100',
                                        open ? 'scale-x-100' : 'scale-x-0',
                                    )}
                                />
                                <div className="relative aspect-[4/5] overflow-hidden bg-[#e7eef0]">
                                    <img
                                        src={leader.image}
                                        alt={leader.alt}
                                        loading="lazy"
                                        className={cn(
                                            'h-full w-full object-cover contrast-105 grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-within:grayscale-0 motion-reduce:transition-none',
                                            open && 'grayscale-0',
                                        )}
                                    />
                                    <span className="absolute left-3 top-3 bg-white/90 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.2em] text-[#0f4c5c]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <motion.div
                                        id={`remit-${leader.id}`}
                                        aria-hidden={!open}
                                        initial={false}
                                        animate={{ opacity: open ? 1 : 0, y: open || reduceMotion ? 0 : 12 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className={cn(
                                            'absolute inset-0 flex flex-col justify-end bg-[#0f4c5c]/94 p-4 pb-16 text-white sm:p-5 sm:pb-16',
                                            !open && 'pointer-events-none',
                                        )}
                                    >
                                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8bb8c]">Remit</p>
                                        <ul className="mt-2 space-y-1.5 text-xs leading-snug sm:text-sm">
                                            {leader.remit.map((duty) => (
                                                <li key={duty} className="flex gap-2">
                                                    <span aria-hidden="true" className="mt-[0.45em] h-px w-3 shrink-0 bg-[#d8bb8c]" />
                                                    {duty}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="mt-3 text-[11px] text-white/70">At Clearwater since {leader.since}</p>
                                    </motion.div>

                                    <button
                                        type="button"
                                        data-remit-toggle=""
                                        aria-expanded={open}
                                        aria-controls={`remit-${leader.id}`}
                                        aria-label={open ? `Hide ${leader.name}’s remit` : `Show ${leader.name}’s remit`}
                                        className={cn(
                                            'absolute bottom-3 right-3 grid size-10 place-items-center rounded-full border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]',
                                            open
                                                ? 'border-[#d8bb8c] bg-transparent text-[#d8bb8c]'
                                                : 'border-white/70 bg-white/90 text-[#0f4c5c] hover:bg-white',
                                        )}
                                        onClick={() => toggle(leader.id)}
                                    >
                                        <HiPlus
                                            aria-hidden="true"
                                            className={cn('size-5 transition-transform duration-300', open && 'rotate-45')}
                                        />
                                    </button>
                                </div>

                                <div className="mt-4 flex items-start justify-between gap-2 border-t border-[#0f4c5c]/15 pt-3">
                                    <div className="min-w-0">
                                        <h3 className="text-base font-semibold leading-tight text-[#0f4c5c] sm:text-lg">{leader.name}</h3>
                                        <p className="mt-1 text-xs leading-snug text-[#14232a]/60 sm:text-sm">{leader.title}</p>
                                    </div>
                                    <a
                                        href={`#linkedin-${leader.id}`}
                                        aria-label={`${leader.name} on LinkedIn`}
                                        className="grid size-10 shrink-0 place-items-center rounded-full border border-[#0f4c5c]/20 text-[#0f4c5c] transition-colors hover:border-[#0f4c5c] hover:bg-[#0f4c5c] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                                    >
                                        <RiLinkedinFill aria-hidden="true" className="size-4" />
                                    </a>
                                </div>
                            </motion.li>
                        )
                    })}
                </ul>

                <div className="mt-16 flex flex-col gap-4 border-t border-[#0f4c5c]/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <a
                        href="#clearwater-board"
                        className="group inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-[#0f4c5c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b08d57]"
                    >
                        <span className="border-b border-[#b08d57] pb-0.5">Meet the Board of Directors (11)</span>
                        <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                    <a
                        href="#clearwater-governance-2025"
                        className="inline-flex min-h-11 items-center gap-2 text-sm text-[#14232a]/70 hover:text-[#0f4c5c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b08d57]"
                    >
                        <HiOutlineDocumentArrowDown aria-hidden="true" className="size-5 text-[#b08d57]" />
                        2025 Governance report · PDF, 3.1 MB
                    </a>
                </div>
            </div>
        </section>
    )
}

export default MonochromeGridLeadershipTeam

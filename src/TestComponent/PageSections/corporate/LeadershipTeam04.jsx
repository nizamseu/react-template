// ChairSpotlightLeadershipTeam

// LeadershipTeam04 · Corporate & Business › Leadership / Core Team

// Description:
// A warm, editorial leadership section for the fictional food company Tidewater Foods. A
// large spotlight introduces chief executive Rosa Almeida with her portrait, a rotating
// "Chief Executive · Since 2019" sticker, the quote "Good food is a long game…", a
// hand-drawn signature and three facts. Below, the rest of the board sits in a compact row
// of six; choosing a member opens their card (role, committees, joining year, a short
// note). Use it on an about or investor page where one leader fronts the story.

// Design:
// - Warm white #fbf7f0 section, ink #2a1d17 type, tomato #e4572e for the offset photo block,
//   quote marks, signature, sticker and active board ring; cream #f3ebdd panels
// - lg: 5/7 split — portrait (4/5, rounded-[28px]) with a tomato block offset behind it,
//   quote column beside it; stacks on mobile with the portrait capped at 420px
// - Serif quote text-3xl → lg:text-[3.4rem] with tomato hanging quote marks; the SVG
//   signature draws itself (pathLength) when scrolled into view
// - Board row: 2 → sm:3 → lg:6 compact stacked buttons (48–56px round avatar, name, role);
//   the active one gets a white card and tomato ring, others sit at 80% saturation
// - Sticker text rotates slowly on a 24s loop; signature draw and sticker spin are off for
//   reduced motion; the detail card cross-fades between members

// What it does:
// - active (index) selects a board member; buttons use aria-pressed and aria-controls the
//   detail card, which is an aria-live="polite" region
// - ← / → on a focused board button move selection and focus to the neighbouring member
// - Links: "Read Rosa’s letter to shareholders" → #tidewater-letter-2026, "Governance &
//   committees" → #tidewater-governance

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ChairSpotlightLeadershipTeam from '@/TestComponent/PageSections/corporate/LeadershipTeam04';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <ChairSpotlightLeadershipTeam />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const photo = (id, w = 500) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const chief = {
    name: 'Rosa Almeida',
    title: 'Chief Executive Officer',
    image: photo('1494790108377-be9c29b29330', 1000),
    alt: 'Rosa Almeida smiling in a red sweater',
    facts: [
        { value: '2004', label: 'Joined as a line cook in Porto' },
        { value: '2019', label: 'Became Tidewater’s third CEO' },
        { value: '1,200', label: 'Colleagues across 3 countries' },
    ],
}

const board = [
    {
        id: 'kwame-mensah',
        name: 'Kwame Mensah',
        role: 'Chair',
        since: 2017,
        image: photo('1507003211169-0a1dd7228f2d'),
        alt: 'Kwame Mensah smiling in a white T-shirt',
        committees: ['Nomination (chair)', 'Remuneration'],
        note: 'Former head of sourcing at a West African cocoa cooperative; keeps the board honest about what farmers are paid.',
    },
    {
        id: 'ingrid-solberg',
        name: 'Ingrid Solberg',
        role: 'Chief Financial Officer',
        since: 2020,
        image: photo('1508214751196-bcfd4ca60f91'),
        alt: 'Ingrid Solberg smiling outdoors with long blonde hair',
        committees: ['Risk', 'Sustainability'],
        note: 'Moved Tidewater onto 60-day supplier payment terms or better, and tied every bonus to food-waste targets.',
    },
    {
        id: 'tunde-bakare',
        name: 'Tunde Bakare',
        role: 'Chief Supply Officer',
        since: 2015,
        image: photo('1463453091185-61582044d556'),
        alt: 'Tunde Bakare smiling in a striped shirt in front of graffiti',
        committees: ['Sustainability (chair)'],
        note: 'Runs our 212 partner farms and the regenerative tomato programme now covering 3,400 hectares.',
    },
    {
        id: 'hannah-clarke',
        name: 'Hannah Clarke',
        role: 'Independent Director',
        since: 2021,
        image: photo('1546961329-78bef0414d7c'),
        alt: 'Hannah Clarke smiling in a denim jacket',
        committees: ['Audit (chair)', 'Risk'],
        note: 'Chartered accountant and former audit partner; chairs the committee that signs off our annual report.',
    },
    {
        id: 'luca-ferraro',
        name: 'Luca Ferraro',
        role: 'Chief Operating Officer',
        since: 2018,
        image: photo('1570295999919-56ceb5ecca61'),
        alt: 'Luca Ferraro in a navy sweater against a grey backdrop',
        committees: ['Risk', 'Health & Safety (chair)'],
        note: 'Looks after our 4 kitchens and 2 factories, and brought lost-time injuries down 58% since 2021.',
    },
    {
        id: 'marta-nowak',
        name: 'Marta Nowak',
        role: 'Employee Director',
        since: 2023,
        image: photo('1619895862022-09114b41f16f'),
        alt: 'Marta Nowak in a striped top outdoors',
        committees: ['Remuneration', 'Colleague Forum (chair)'],
        note: 'Elected by colleagues from the Gdańsk factory floor, where she still runs the night shift twice a month.',
    },
]

const signaturePath =
    'M10 62 C 18 24, 40 10, 36 38 C 32 62, 16 70, 22 52 C 28 34, 54 30, 58 46 C 62 60, 46 64, 50 50 C 54 38, 72 36, 74 48 C 76 60, 64 58, 70 46 C 76 34, 92 40, 90 54 C 88 66, 102 60, 108 44 C 114 28, 120 30, 118 48 C 116 66, 128 62, 136 44 C 142 32, 152 34, 150 50 C 148 64, 162 60, 168 42 C 172 30, 180 18, 178 36 C 176 52, 174 64, 186 56 C 198 48, 206 40, 216 46 C 226 52, 234 44, 246 38'
const underlinePath = 'M28 80 C 90 71, 170 69, 262 62'

export function ChairSpotlightLeadershipTeam({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState(0)
    const buttonRefs = useRef([])
    const member = board[active]

    const onBoardKeyDown = (event, index) => {
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % board.length
        if (event.key === 'ArrowLeft') next = (index - 1 + board.length) % board.length
        if (next === null) return
        event.preventDefault()
        setActive(next)
        buttonRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fbf7f0] px-4 py-20 text-base font-normal text-[#2a1d17] sm:px-6 md:py-28 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2a1d17]/15 pb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#e4572e]">
                        Tidewater Foods · Leadership 2026
                    </p>
                    <h2 className="text-sm font-semibold text-[#2a1d17] sm:text-base">Led from the kitchen table.</h2>
                </div>

                <div className="mt-12 grid items-center gap-14 md:mt-16 lg:grid-cols-12 lg:gap-16">
                    <div className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:max-w-none">
                        <div
                            aria-hidden="true"
                            className="absolute -bottom-4 -right-4 h-3/4 w-3/4 rounded-[28px] bg-[#e4572e] sm:-bottom-6 sm:-right-6"
                        />
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#efe4d3]">
                            <img src={chief.image} alt={chief.alt} className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute -left-2 -top-6 size-28 sm:-left-6 sm:size-32" aria-hidden="true">
                            <div className="absolute inset-0 rounded-full bg-[#2a1d17]" />
                            <motion.svg
                                viewBox="0 0 100 100"
                                className="absolute inset-0 h-full w-full"
                                animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                                transition={reduceMotion ? { duration: 0 } : { duration: 24, ease: 'linear', repeat: Infinity }}
                            >
                                <defs>
                                    <path id="tidewater-sticker-circle" d="M50 50 m -36 0 a 36 36 0 1 1 72 0 a 36 36 0 1 1 -72 0" />
                                </defs>
                                <text className="fill-[#fbf7f0] font-mono text-[8.5px] uppercase">
                                    <textPath href="#tidewater-sticker-circle" textLength="222" lengthAdjust="spacing">
                                        Chief Executive · Since 2019 ·
                                    </textPath>
                                </text>
                            </motion.svg>
                            <span className="absolute inset-0 grid place-items-center font-serif text-3xl italic text-[#e4572e]">R</span>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2a1d17]/55">
                            From our chief executive
                        </p>
                        <figure className="mt-5">
                            <blockquote className="relative font-serif text-3xl leading-[1.12] tracking-tight text-[#2a1d17] sm:text-4xl lg:text-[3.4rem]">
                                <span aria-hidden="true" className="text-[#e4572e]">
                                    “
                                </span>
                                Good food is a long game. We plant orchards we won’t harvest and train cooks who’ll
                                outgrow us. That’s the point.
                                <span aria-hidden="true" className="text-[#e4572e]">
                                    ”
                                </span>
                            </blockquote>
                            <figcaption className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-3">
                                <svg
                                    viewBox="0 0 270 90"
                                    role="img"
                                    aria-label="Signature of Rosa Almeida"
                                    className="h-16 w-auto text-[#e4572e] sm:h-20"
                                >
                                    <motion.path
                                        d={signaturePath}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: reduceMotion ? 1 : 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true, amount: 0.8 }}
                                        transition={{ duration: 2.2, ease: 'easeInOut' }}
                                    />
                                    <motion.path
                                        d={underlinePath}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        initial={{ pathLength: reduceMotion ? 1 : 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true, amount: 0.8 }}
                                        transition={{ duration: 0.6, delay: reduceMotion ? 0 : 2.1, ease: 'easeOut' }}
                                    />
                                </svg>
                                <span className="pb-2">
                                    <span className="block text-lg font-semibold text-[#2a1d17]">{chief.name}</span>
                                    <span className="block text-sm text-[#2a1d17]/60">{chief.title}</span>
                                </span>
                            </figcaption>
                        </figure>

                        <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-[#2a1d17]/10 sm:grid-cols-3">
                            {chief.facts.map((fact) => (
                                <div key={fact.value} className="flex flex-col-reverse justify-end gap-1 bg-[#f3ebdd] px-5 py-4">
                                    <dt className="text-sm leading-snug text-[#2a1d17]/65">{fact.label}</dt>
                                    <dd className="font-serif text-3xl text-[#2a1d17]">{fact.value}</dd>
                                </div>
                            ))}
                        </dl>

                        <a
                            href="#tidewater-letter-2026"
                            className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2a1d17] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4572e]"
                        >
                            <span className="border-b-2 border-[#e4572e] pb-0.5">Read Rosa’s letter to shareholders</span>
                            <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>

                <div className="mt-20 border-t border-[#2a1d17]/15 pt-10 md:mt-24">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="font-serif text-3xl font-normal leading-tight text-[#2a1d17]">The rest of the board</h3>
                            <p className="mt-2 text-sm text-[#2a1d17]/65">
                                Four executives, an independent director and a colleague elected from the factory floor.
                            </p>
                        </div>
                        <a
                            href="#tidewater-governance"
                            className="inline-flex min-h-10 items-center text-sm font-medium text-[#2a1d17]/75 underline decoration-[#e4572e] decoration-2 underline-offset-4 hover:text-[#2a1d17] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4572e]"
                        >
                            Governance &amp; committees
                        </a>
                    </div>

                    <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {board.map((person, index) => {
                            const on = index === active
                            return (
                                <li key={person.id}>
                                    <button
                                        ref={(el) => {
                                            buttonRefs.current[index] = el
                                        }}
                                        type="button"
                                        aria-pressed={on}
                                        aria-controls="tidewater-board-detail"
                                        className={cn(
                                            'group flex h-full w-full flex-col items-start gap-3 rounded-2xl border p-3 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e4572e]',
                                            on
                                                ? 'border-[#e4572e] bg-white shadow-[0_14px_30px_-18px_rgba(228,87,46,0.6)]'
                                                : 'border-[#2a1d17]/10 bg-transparent hover:border-[#2a1d17]/30 hover:bg-white/60',
                                        )}
                                        onClick={() => setActive(index)}
                                        onKeyDown={(event) => onBoardKeyDown(event, index)}
                                    >
                                        <img
                                            src={person.image}
                                            alt=""
                                            loading="lazy"
                                            className={cn(
                                                'size-12 shrink-0 rounded-full object-cover transition-[filter] duration-300 sm:size-14',
                                                on ? 'ring-2 ring-[#e4572e] ring-offset-2 ring-offset-white' : 'saturate-[.8] group-hover:saturate-100',
                                            )}
                                        />
                                        <span className="min-w-0">
                                            <span className="block text-sm font-semibold leading-tight text-[#2a1d17]">{person.name}</span>
                                            <span className="mt-0.5 block text-xs leading-snug text-[#2a1d17]/60">{person.role}</span>
                                        </span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>

                    <div
                        id="tidewater-board-detail"
                        aria-live="polite"
                        className="mt-4 overflow-hidden rounded-[22px] bg-[#f3ebdd]"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6 lg:grid-cols-[auto_1.2fr_1fr] lg:gap-10"
                            >
                                <img
                                    src={member.image}
                                    alt={member.alt}
                                    loading="lazy"
                                    className="size-24 rounded-[20px] object-cover sm:size-28"
                                />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e4572e]">
                                        On the board since {member.since}
                                    </p>
                                    <h4 className="mt-2 font-serif text-2xl font-normal leading-tight text-[#2a1d17]">
                                        {member.name}, <span className="italic text-[#2a1d17]/70">{member.role}</span>
                                    </h4>
                                    <p className="mt-2 text-sm leading-relaxed text-[#2a1d17]/75">{member.note}</p>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-1">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2a1d17]/50">Committees</p>
                                    <ul className="mt-3 flex flex-wrap gap-2">
                                        {member.committees.map((committee) => (
                                            <li
                                                key={committee}
                                                className="rounded-full border border-[#2a1d17]/15 bg-[#fbf7f0] px-3 py-1.5 text-xs font-medium text-[#2a1d17]"
                                            >
                                                {committee}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChairSpotlightLeadershipTeam

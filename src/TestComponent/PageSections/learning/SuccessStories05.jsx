// BadgeCabinetSuccessStories

// SuccessStories05 · Learning Management Systems › Student Success Stories & Certificates

// Description:
// A dark, museum-cabinet display of skill badges for the fictional craft school Guildworks.
// Under "Earned, not given." eight SVG hexagon badges in gold and silver sit on glass
// shelves; selecting one opens a detail panel with the badge name and tier, how many
// learners earned it ("2,184 learners"), its rarity, the assessment criteria and a quote
// from a learner who holds it. Use it on a credentials, programme or community page.

// Design:
// - Charcoal #1c1c1e section with #e8e6e1 text; badges use metallic SVG linear gradients
//   (gold #f7e7a1 → #c9a227 → #8a6d1a, silver #f5f5f7 → #a1a1aa → #52525b) around a
//   charcoal inner hexagon with a lucide icon
// - Cabinet: rounded-[28px] glass panel (white/[0.03], white/10 border) with three rows of
//   badges (3 · 2 · 3, centred like a honeycomb) standing on gradient shelf strips
// - Serif heading with a gold gradient word; small-caps tracking for tiers; detail panel
//   is a #242426 card with a gold-to-transparent top rule and a rarity bar
// - The selected badge lifts and glows (scale 1.08, drop shadow) and the detail panel
//   crossfades; both are instant for reduced motion
// - Responsive: stacked on mobile with 88px badges; lg:grid-cols-[1.1fr_1fr] side by side
//   with badges growing to 112px (sm) and 128px (xl)

// What it does:
// - selectedId state picks the badge; the badges form a role="radiogroup" with roving
//   tabIndex, arrow keys / Home / End move the selection and focus
// - The detail panel shows earned count, share of all 35,100 learners (rarity bar width),
//   three criteria and a learner quote; an sr-only aria-live line announces the change
// - "See how assessments work" links to #assessments; no other side effects

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BadgeCabinetSuccessStories from '@/TestComponent/PageSections/learning/SuccessStories05';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <BadgeCabinetSuccessStories />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { LuFlame, LuHammer, LuLeaf, LuPalette, LuPenTool, LuRuler, LuScissors, LuWrench } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const LEARNERS = 35100

const avatar = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=200&q=80`

const badges = [
    {
        id: 'joiner',
        name: 'Master Joiner',
        tier: 'gold',
        level: 'Level 3',
        icon: LuHammer,
        earned: 2184,
        criteria: ['Cut a through-dovetailed carcass to ±0.5 mm', 'Pass a 3-hour hand-tool assessment', 'Portfolio of five finished pieces'],
        quote: 'The assessor spent twenty minutes on one drawer. When it slid shut on a cushion of air, she just nodded. Best nod of my life.',
        who: 'Elif Kaya',
        role: 'Cabinetmaker, Izmir · earned Mar 2026',
        image: avatar('1534528741775-53994a69daeb'),
        alt: 'Woman lit by blue light',
    },
    {
        id: 'measurer',
        name: 'Precision Measurer',
        tier: 'silver',
        level: 'Level 1',
        icon: LuRuler,
        earned: 9410,
        criteria: ['Read a vernier and micrometer to 0.02 mm', 'Mark out a panel from a cut list', 'Pass the tolerances quiz'],
        quote: 'Sounds basic until you realise every mistake I made on my first table started with a sloppy pencil line.',
        who: 'Jonas Weber',
        role: 'Apprentice joiner, Leipzig · earned Jan 2026',
        image: avatar('1539571696357-5a69c17a67c6'),
        alt: 'Young man wearing a hat',
    },
    {
        id: 'cutter',
        name: 'Pattern Cutter',
        tier: 'silver',
        level: 'Level 2',
        icon: LuScissors,
        earned: 5062,
        criteria: ['Draft a block pattern from measurements', 'Grade it across four sizes', 'Sew a toile with a clean fit review'],
        quote: 'I drafted my first coat pattern at the kitchen table. Now I cut samples for a small label in Porto.',
        who: 'Inês Carvalho',
        role: 'Pattern cutter, Porto · earned Nov 2025',
        image: avatar('1524504388940-b1c1722653e1'),
        alt: 'Woman with long hair against a dark backdrop',
    },
    {
        id: 'forge',
        name: 'Forge Hand',
        tier: 'gold',
        level: 'Level 3',
        icon: LuFlame,
        earned: 1318,
        criteria: ['Forge-weld a billet without inclusions', 'Heat-treat a blade to spec', 'Supervised safety sign-off'],
        quote: 'Rarest badge I hold, and the only one my grandfather — a farrier — actually understood.',
        who: 'Callum Reid',
        role: 'Bladesmith, Perth · earned Jul 2026',
        image: avatar('1519085360753-af0119f7cbe7'),
        alt: 'Man in a dark suit',
    },
    {
        id: 'typesetter',
        name: 'Type Setter',
        tier: 'silver',
        level: 'Level 2',
        icon: LuPenTool,
        earned: 4275,
        criteria: ['Hand-set a 12-line poem in metal type', 'Lock up and proof a forme', 'Print 50 clean copies'],
        quote: 'Getting the spacing right by hand taught me more about typography than ten years of software.',
        who: 'Mira Holm',
        role: 'Letterpress printer, Aarhus · earned Feb 2026',
        image: avatar('1508214751196-bcfd4ca60f91'),
        alt: 'Blonde woman outdoors',
    },
    {
        id: 'mechanic',
        name: 'Bench Mechanic',
        tier: 'silver',
        level: 'Level 1',
        icon: LuWrench,
        earned: 7733,
        criteria: ['Strip and rebuild a hand plane', 'Sharpen three edge profiles', 'Tune a bench vice'],
        quote: 'I restored my great-uncle’s plane for the assessment. It now takes shavings you can read through.',
        who: 'Samir Haddad',
        role: 'Hobbyist, Lyon · earned Aug 2026',
        image: avatar('1544723795-3fb6469f5b39'),
        alt: 'Man in a cap against a red backdrop',
    },
    {
        id: 'glaze',
        name: 'Glaze Chemist',
        tier: 'gold',
        level: 'Level 3',
        icon: LuPalette,
        earned: 1906,
        criteria: ['Formulate three glazes from raw oxides', 'Document a 30-tile test grid', 'Fire to cone 6 with consistent results'],
        quote: 'Two hundred test tiles and one beautiful celadon. The badge is on my studio door.',
        who: 'Aiko Tanaka',
        role: 'Ceramicist, Kyoto · earned May 2026',
        image: avatar('1500917293891-ef795e70e1f6'),
        alt: 'Woman with long wavy hair',
    },
    {
        id: 'green',
        name: 'Green Woodworker',
        tier: 'silver',
        level: 'Level 2',
        icon: LuLeaf,
        earned: 3580,
        criteria: ['Cleave and shave a chair leg from a log', 'Turn on a pole lathe', 'Assemble a three-legged stool'],
        quote: 'No power tools, no dust mask, just birdsong and a drawknife. I did not expect it to be this calming.',
        who: 'Nia Mensah',
        role: 'Furniture maker, Bristol · earned Apr 2026',
        image: avatar('1607746882042-944635dfe10e'),
        alt: 'Woman against a dark backdrop',
    },
]

const rows = [
    [0, 1, 2],
    [3, 4],
    [5, 6, 7],
]

const gradients = {
    gold: [
        ['0', '#f7e7a1'],
        ['0.35', '#c9a227'],
        ['0.65', '#8a6d1a'],
        ['1', '#e8cf73'],
    ],
    silver: [
        ['0', '#f5f5f7'],
        ['0.4', '#a1a1aa'],
        ['0.7', '#52525b'],
        ['1', '#d4d4d8'],
    ],
}

function Hex({ badge, uid, className, iconClass }) {
    const Icon = badge.icon
    const gid = `${uid}-${badge.id}`
    return (
        <span className={cn('relative block', className)}>
            <svg viewBox="0 0 100 115" className="h-full w-full" aria-hidden="true">
                <defs>
                    <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                        {gradients[badge.tier].map(([o, c]) => (
                            <stop key={o} offset={o} stopColor={c} />
                        ))}
                    </linearGradient>
                </defs>
                <polygon points="50,2 97,29 97,86 50,113 3,86 3,29" fill={`url(#${gid})`} />
                <polygon points="50,12 88,34 88,81 50,103 12,81 12,34" fill="#1c1c1e" />
                <polygon points="50,16 84,36 84,79 50,99 16,79 16,36" fill="none" stroke={`url(#${gid})`} strokeWidth="1" opacity="0.7" />
            </svg>
            <Icon
                className={cn(
                    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                    badge.tier === 'gold' ? 'text-[#e8cf73]' : 'text-[#d4d4d8]',
                    iconClass,
                )}
                aria-hidden="true"
            />
        </span>
    )
}

export function BadgeCabinetSuccessStories({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const uid = `gw${useId().replace(/[^a-zA-Z0-9]/g, '')}`
    const [selectedId, setSelectedId] = useState('joiner')
    const refs = useRef({})

    const selected = badges.find((b) => b.id === selectedId)
    const share = (selected.earned / LEARNERS) * 100

    const onKeyDown = (event, index) => {
        const last = badges.length - 1
        let next = null
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = last
        if (next === null) return
        event.preventDefault()
        setSelectedId(badges[next].id)
        refs.current[badges[next].id]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#1c1c1e] px-4 py-16 text-base font-normal text-[#e8e6e1] antialiased sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-[#c9a227]/10 blur-3xl"
                aria-hidden="true"
            />
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#a1a1aa]">Guildworks · Badge cabinet</p>
                        <h2 className="mt-4 font-serif text-5xl font-normal leading-none tracking-tight text-[#f5f5f7] sm:text-6xl lg:text-7xl">
                            Earned,{' '}
                            <em className="bg-linear-to-r from-[#f7e7a1] via-[#c9a227] to-[#e8cf73] bg-clip-text text-transparent">not given.</em>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[#e8e6e1]/70">
                        Every Guildworks badge is signed off by a practising craftsperson after a portfolio
                        review. Pick one to see who holds it.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-stretch">
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-3 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:px-6 sm:py-8">
                        <div role="radiogroup" aria-label="Guildworks badges" className="space-y-6 sm:space-y-8">
                            {rows.map((row) => (
                                <div key={row.join('-')}>
                                    <div className="flex justify-center gap-2 sm:gap-6">
                                        {row.map((index) => {
                                            const b = badges[index]
                                            const active = b.id === selectedId
                                            return (
                                                <button
                                                    key={b.id}
                                                    ref={(el) => {
                                                        refs.current[b.id] = el
                                                    }}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={active}
                                                    tabIndex={active ? 0 : -1}
                                                    className="group flex w-[5.5rem] flex-col items-center rounded-2xl pb-1 pt-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8cf73] sm:w-28 xl:w-32"
                                                    onClick={() => setSelectedId(b.id)}
                                                    onKeyDown={(e) => onKeyDown(e, index)}
                                                >
                                                    <motion.span
                                                        className="block"
                                                        animate={{ scale: active ? 1.08 : 1, y: active && !reduce ? -4 : 0, opacity: active ? 1 : 0.72 }}
                                                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 22 }}
                                                        whileHover={reduce ? undefined : { opacity: 1, y: -3 }}
                                                    >
                                                        <Hex
                                                            badge={b}
                                                            uid={uid}
                                                            className={cn(
                                                                'h-[4.6rem] w-16 sm:h-[5.75rem] sm:w-20 xl:h-[6.9rem] xl:w-24',
                                                                active && (b.tier === 'gold' ? 'drop-shadow-[0_0_18px_rgba(201,162,39,0.55)]' : 'drop-shadow-[0_0_18px_rgba(212,212,216,0.4)]'),
                                                            )}
                                                            iconClass="h-6 w-6 sm:h-7 sm:w-7 xl:h-8 xl:w-8"
                                                        />
                                                    </motion.span>
                                                    <span
                                                        className={cn(
                                                            'mt-2 text-center text-[11px] leading-tight transition-colors sm:text-xs',
                                                            active ? 'font-semibold text-[#f5f5f7]' : 'text-[#e8e6e1]/60 group-hover:text-[#e8e6e1]',
                                                        )}
                                                    >
                                                        {b.name}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <div className="mx-auto mt-2 h-2 w-[92%] rounded-full bg-linear-to-b from-white/15 to-white/[0.02] shadow-[0_8px_16px_-6px_rgba(0,0,0,0.8)]" aria-hidden="true" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[28px] bg-[#242426] p-6 sm:p-8">
                        <p className="sr-only" aria-live="polite">
                            {selected.name}, {selected.tier} badge, earned by {selected.earned.toLocaleString('en-US')} learners.
                        </p>
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#c9a227] to-transparent" aria-hidden="true" />
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={selected.id}
                                initial={reduce ? false : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="flex items-center gap-5">
                                    <Hex badge={selected} uid={`${uid}-big`} className="h-24 w-20 shrink-0 sm:h-28 sm:w-24" iconClass="h-8 w-8 sm:h-9 sm:w-9" />
                                    <div className="min-w-0">
                                        <p className={cn('text-[11px] font-semibold uppercase tracking-[0.24em]', selected.tier === 'gold' ? 'text-[#e8cf73]' : 'text-[#d4d4d8]')}>
                                            {selected.tier} · {selected.level}
                                        </p>
                                        <h3 className="mt-1 font-serif text-3xl font-normal leading-tight text-[#f5f5f7] sm:text-4xl">{selected.name}</h3>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 border-y border-white/10 py-5">
                                    <div>
                                        <p className="font-serif text-3xl tabular-nums text-[#f5f5f7] sm:text-4xl">{selected.earned.toLocaleString('en-US')}</p>
                                        <p className="mt-1 text-xs text-[#e8e6e1]/60">learners earned it</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-3xl tabular-nums text-[#f5f5f7] sm:text-4xl">{share.toFixed(1)}%</p>
                                        <p className="mt-1 text-xs text-[#e8e6e1]/60">of all {LEARNERS.toLocaleString('en-US')} learners</p>
                                    </div>
                                    <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                                        <div
                                            className={cn('h-full rounded-full', selected.tier === 'gold' ? 'bg-linear-to-r from-[#8a6d1a] to-[#f7e7a1]' : 'bg-linear-to-r from-[#52525b] to-[#f5f5f7]')}
                                            style={{ width: `${Math.max(share, 2)}%` }}
                                        />
                                    </div>
                                </div>

                                <ul className="mt-5 space-y-2 text-sm text-[#e8e6e1]/80">
                                    {selected.criteria.map((c) => (
                                        <li key={c} className="flex gap-3">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#c9a227]" aria-hidden="true" />
                                            {c}
                                        </li>
                                    ))}
                                </ul>

                                <figure className="mt-6 rounded-2xl bg-[#1c1c1e] p-5">
                                    <blockquote className="font-serif text-lg leading-snug text-[#f5f5f7]">“{selected.quote}”</blockquote>
                                    <figcaption className="mt-4 flex items-center gap-3">
                                        <img src={selected.image} alt={selected.alt} loading="lazy" className="h-10 w-10 rounded-full object-cover grayscale" />
                                        <span className="min-w-0 text-sm">
                                            <span className="block font-semibold text-[#f5f5f7]">{selected.who}</span>
                                            <span className="block text-xs text-[#e8e6e1]/60">{selected.role}</span>
                                        </span>
                                    </figcaption>
                                </figure>
                            </motion.div>
                        </AnimatePresence>
                        <a
                            href="#assessments"
                            className="mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#e8cf73] underline decoration-[#c9a227]/50 underline-offset-8 hover:decoration-[#e8cf73] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8cf73]"
                        >
                            See how assessments work
                            <HiArrowLongRight className="h-5 w-5" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BadgeCabinetSuccessStories

// LedgerTableLeadershipTeam

// LeadershipTeam05 · Corporate & Business › Leadership / Core Team

// Description:
// A refined, ledger-style partner table for the fictional management consultancy Keystone
// Consulting. Under "The partners who sign our work." seven partners are listed with
// number, name, title, practice, office and tenure ("Since 2006 · 20 yrs"); hovering or
// focusing a row floats that partner’s portrait and focus area beside the table on md+,
// while phones get a stacked list with inline avatars. Name and tenure columns sort. Use it
// on a consultancy, law or finance firm’s people page where restraint signals seniority.

// Design:
// - White section, ink #111111 type, a 2px black rule above and below the ledger and
//   black/10 hairlines between rows; royal blue #1d4ed8 only for the active-row tick, sort
//   arrows and focus rings
// - Serif display heading text-4xl → md:text-6xl; mono numerals for No., years and tenure;
//   sans names at text-lg
// - md+: two columns — table (1fr) and a 220px → lg:280px portrait rail; the portrait card
//   (3/4 photo, name, practice, focus line) glides on a spring to sit level with the active
//   row and cross-fades between people; rows tint #f5f5f2 when active; the Practice
//   column appears from lg and folds into the title line at md
// - Below md: a list of rows with 48px grayscale round avatars, name, title, practice,
//   office and tenure, plus a compact 3-way sort control (Seniority / Name / Tenure)
// - Reduced motion: the portrait jumps instead of gliding and the cross-fade is instant

// What it does:
// - activeId follows hover and keyboard focus (each name is a link); the portrait offset is
//   measured from the row’s position and clamped inside the table, and re-measured after a
//   sort or window resize
// - sort ({ key: rank | name | since, dir }) is changed by header buttons (aria-sort on the
//   th, click again to flip direction) or, on mobile, by the segmented control
// - Names link to #partner-<id>; "Download partner CVs (PDF)" to #keystone-partner-cvs

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LedgerTableLeadershipTeam from '@/TestComponent/PageSections/corporate/LeadershipTeam05';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <LedgerTableLeadershipTeam />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowDownTray, HiChevronDown, HiChevronUp, HiChevronUpDown } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const FY = 2026
const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const partners = [
    {
        id: 'samuel-adeyemi',
        rank: 1,
        name: 'Samuel Adeyemi',
        title: 'Managing Partner',
        practice: 'Strategy & Transformation',
        office: 'London',
        since: 2006,
        focus: 'Board-level turnarounds; has coached 34 first-time CEOs.',
        image: photo('1566492031773-4f4e44671857'),
        alt: 'Samuel Adeyemi in glasses and a striped T-shirt, resting his chin on his hand',
    },
    {
        id: 'clemence-duval',
        rank: 2,
        name: 'Clémence Duval',
        title: 'Senior Partner',
        practice: 'Healthcare',
        office: 'Paris',
        since: 2011,
        focus: 'Hospital networks and payer reform across 9 EU health systems.',
        image: photo('1554151228-14d9def656e4'),
        alt: 'Clémence Duval, a young woman with freckles, looking into the camera',
    },
    {
        id: 'marcus-bell',
        rank: 3,
        name: 'Marcus Bell',
        title: 'Partner',
        practice: 'Financial Services',
        office: 'New York',
        since: 2008,
        focus: 'Core-banking replacements and claims operations for insurers.',
        image: photo('1506277886164-e25aa3f4ef7f'),
        alt: 'Marcus Bell smiling broadly in a green patterned shirt',
    },
    {
        id: 'isabel-moreno',
        rank: 4,
        name: 'Isabel Moreno',
        title: 'Partner',
        practice: 'Retail & Consumer',
        office: 'Madrid',
        since: 2014,
        focus: 'Store estate strategy and pricing for grocers and fashion chains.',
        image: photo('1524504388940-b1c1722653e1'),
        alt: 'Isabel Moreno with long hair against a dark backdrop',
    },
    {
        id: 'priya-nair',
        rank: 5,
        name: 'Priya Nair',
        title: 'Partner',
        practice: 'Energy & Utilities',
        office: 'Singapore',
        since: 2017,
        focus: 'Grid connection, offshore wind and utility cost-to-serve.',
        image: photo('1520813792240-56fc4a3765a7'),
        alt: 'Priya Nair smiling, with shoulder-length hair and a fringe',
    },
    {
        id: 'yasmin-karimi',
        rank: 6,
        name: 'Yasmin Karimi',
        title: 'Partner',
        practice: 'Public Sector',
        office: 'Dubai',
        since: 2013,
        focus: 'Digital permits and shared services for city governments.',
        image: photo('1531746020798-e6953c6e8e04'),
        alt: 'Yasmin Karimi with dark hair tied back, against a pink backdrop',
    },
    {
        id: 'felix-hartmann',
        rank: 7,
        name: 'Felix Hartmann',
        title: 'Partner',
        practice: 'Digital & Data',
        office: 'Berlin',
        since: 2021,
        focus: 'Data platforms and AI governance for regulated industries.',
        image: photo('1539571696357-5a69c17a67c6'),
        alt: 'Felix Hartmann smiling, with curly hair and a black hat',
    },
]

const totalYears = partners.reduce((sum, p) => sum + (FY - p.since), 0)

const mobileSorts = [
    { key: 'rank', label: 'Seniority' },
    { key: 'name', label: 'Name' },
    { key: 'since', label: 'Tenure' },
]

const pad = (n) => String(n).padStart(2, '0')

export function LedgerTableLeadershipTeam({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [activeId, setActiveId] = useState(partners[0].id)
    const [offset, setOffset] = useState(0)
    const [sort, setSort] = useState({ key: 'rank', dir: 'asc' })
    const wrapRef = useRef(null)
    const cardRef = useRef(null)
    const active = partners.find((p) => p.id === activeId)

    const rows = useMemo(() => {
        const list = [...partners]
        const factor = sort.dir === 'asc' ? 1 : -1
        list.sort((a, b) => {
            if (sort.key === 'name') return a.name.localeCompare(b.name) * factor
            if (sort.key === 'since') return (a.since - b.since) * factor
            return (a.rank - b.rank) * factor
        })
        return list
    }, [sort])

    const positionFor = useCallback((id) => {
        const wrap = wrapRef.current
        const card = cardRef.current
        if (!wrap || !card) return
        const row = wrap.querySelector(`tr[data-id="${id}"]`)
        if (!row || row.offsetParent === null) return
        const wrapRect = wrap.getBoundingClientRect()
        const rowRect = row.getBoundingClientRect()
        const cardHeight = card.offsetHeight
        const target = rowRect.top - wrapRect.top + rowRect.height / 2 - cardHeight / 2
        const max = Math.max(0, wrapRect.height - cardHeight)
        setOffset(Math.min(max, Math.max(0, target)))
    }, [])

    const activate = (id) => setActiveId(id)

    useEffect(() => {
        positionFor(activeId)
    }, [rows, activeId, positionFor])

    useEffect(() => {
        const onResize = () => positionFor(activeId)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [activeId, positionFor])

    const toggleSort = (key) =>
        setSort((current) =>
            current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
        )

    const ariaSort = (key) => {
        if (sort.key !== key) return 'none'
        return sort.dir === 'asc' ? 'ascending' : 'descending'
    }

    const sortIcon = (column) => {
        if (sort.key !== column) return <HiChevronUpDown aria-hidden="true" className="size-4 text-[#111111]/35" />
        if (sort.dir === 'asc') return <HiChevronUp aria-hidden="true" className="size-4 text-[#1d4ed8]" />
        return <HiChevronDown aria-hidden="true" className="size-4 text-[#1d4ed8]" />
    }

    const headerButton =
        'inline-flex min-h-10 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#111111]/60 transition-colors hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-20 text-base font-normal text-[#111111] sm:px-6 md:py-28 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#111111]/15 pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111]/55">
                    <span>Keystone Consulting</span>
                    <span>Partners’ ledger · FY{FY}</span>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-12 md:items-end">
                    <h2 className="font-serif text-4xl font-normal leading-[1.04] tracking-tight text-[#111111] sm:text-5xl md:col-span-8 md:text-6xl">
                        The partners who <em>sign</em> our work.
                    </h2>
                    <p className="text-sm leading-relaxed text-[#111111]/65 md:col-span-4">
                        {partners.length} partners, {totalYears} combined years at the firm. Every report we
                        deliver carries one of these names on the last page.
                    </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3 md:hidden">
                    <span id="keystone-ledger-sort" className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#111111]/55">
                        Sort
                    </span>
                    <div role="group" aria-labelledby="keystone-ledger-sort" className="inline-flex border border-[#111111]">
                        {mobileSorts.map((option) => {
                            const on = sort.key === option.key
                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    aria-pressed={on}
                                    className={cn(
                                        'min-h-10 px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]',
                                        on ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#f5f5f2]',
                                    )}
                                    onClick={() => setSort({ key: option.key, dir: 'asc' })}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div ref={wrapRef} className="relative mt-6 md:mt-12 md:grid md:grid-cols-[1fr_220px] md:gap-10 lg:grid-cols-[1fr_280px] lg:gap-14">
                    <div className="border-y-2 border-[#111111]">
                        <table className="hidden w-full border-collapse text-left md:table">
                            <caption className="sr-only">
                                Keystone Consulting partners with practice, office and tenure. Sortable by name and
                                tenure.
                            </caption>
                            <thead>
                                <tr className="border-b border-[#111111]">
                                    <th scope="col" className="w-14 py-2 pl-3 pr-3 font-mono text-[11px] font-normal uppercase tracking-[0.18em] text-[#111111]/60">
                                        No.
                                    </th>
                                    <th scope="col" aria-sort={ariaSort('name')} className="py-2 pr-4 font-normal">
                                        <button type="button" className={headerButton} onClick={() => toggleSort('name')}>
                                            Name
                                            {sortIcon('name')}
                                        </button>
                                    </th>
                                    <th scope="col" className="hidden py-2 pr-4 font-mono text-[11px] font-normal uppercase tracking-[0.18em] text-[#111111]/60 lg:table-cell">
                                        Practice
                                    </th>
                                    <th scope="col" className="py-2 pr-4 font-mono text-[11px] font-normal uppercase tracking-[0.18em] text-[#111111]/60">
                                        Office
                                    </th>
                                    <th scope="col" aria-sort={ariaSort('since')} className="py-2 text-right font-normal">
                                        <button type="button" className={cn(headerButton, 'ml-auto')} onClick={() => toggleSort('since')}>
                                            Since
                                            {sortIcon('since')}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((p) => {
                                    const on = p.id === activeId
                                    return (
                                        <tr
                                            key={p.id}
                                            data-id={p.id}
                                            className={cn(
                                                'border-b border-[#111111]/10 transition-colors duration-200 last:border-b-0',
                                                on && 'bg-[#f5f5f2]',
                                            )}
                                            onMouseEnter={() => activate(p.id)}
                                            onFocus={() => activate(p.id)}
                                        >
                                            <td
                                                className={cn(
                                                    'py-5 pl-3 pr-3 align-top font-mono text-xs text-[#111111]/50 transition-shadow',
                                                    on && 'shadow-[inset_2px_0_0_#1d4ed8]',
                                                )}
                                            >
                                                {pad(p.rank)}
                                            </td>
                                            <td className="py-5 pr-4 align-top">
                                                <a
                                                    href={`#partner-${p.id}`}
                                                    className="text-lg font-medium leading-tight text-[#111111] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                                >
                                                    {p.name}
                                                </a>
                                                <span className="mt-0.5 block text-sm text-[#111111]/55">
                                                    {p.title}
                                                    <span className="lg:hidden"> · {p.practice}</span>
                                                </span>
                                                <span className="sr-only">. Focus: {p.focus}</span>
                                            </td>
                                            <td className="hidden py-5 pr-4 align-top text-sm text-[#111111]/80 lg:table-cell">
                                                {p.practice}
                                            </td>
                                            <td className="py-5 pr-4 align-top text-sm text-[#111111]/80">{p.office}</td>
                                            <td className="py-5 pr-3 text-right align-top font-mono text-sm tabular-nums text-[#111111]">
                                                {p.since}
                                                <span className="block text-xs text-[#111111]/50">{FY - p.since} yrs</span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        <ul className="divide-y divide-[#111111]/10 md:hidden">
                            {rows.map((p) => (
                                <li key={p.id} className="flex items-center gap-4 py-4">
                                    <img
                                        src={p.image}
                                        alt=""
                                        loading="lazy"
                                        className="size-12 shrink-0 rounded-full object-cover object-top grayscale"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <a
                                            href={`#partner-${p.id}`}
                                            className="text-base font-medium leading-tight text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                        >
                                            {p.name}
                                        </a>
                                        <p className="mt-0.5 text-xs text-[#111111]/60">
                                            {p.title} · {p.practice}
                                        </p>
                                        <p className="text-xs text-[#111111]/45">{p.office}</p>
                                    </div>
                                    <p className="shrink-0 text-right font-mono text-xs tabular-nums text-[#111111]">
                                        {p.since}
                                        <span className="block text-[#111111]/50">{FY - p.since} yrs</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative hidden md:block" aria-hidden="true">
                        <motion.div
                            ref={cardRef}
                            initial={false}
                            animate={{ y: offset }}
                            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
                            className="absolute inset-x-0 top-0"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-[#efefec]">
                                <AnimatePresence initial={false}>
                                    <motion.img
                                        key={active.id}
                                        src={active.image}
                                        alt=""
                                        loading="lazy"
                                        initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.04 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </AnimatePresence>
                                <span className="absolute left-3 top-3 bg-white px-1.5 py-0.5 font-mono text-[10px] tracking-[0.18em] text-[#111111]">
                                    No. {pad(active.rank)}
                                </span>
                            </div>
                            <div className="border-b border-[#111111] py-3">
                                <p className="text-base font-medium text-[#111111]">{active.name}</p>
                                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111111]/55">
                                    {active.practice}
                                </p>
                                <p className="mt-2 text-xs leading-relaxed text-[#111111]/70">{active.focus}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#111111]/50">
                        Tenure as partner, counted to FY{FY}
                    </p>
                    <a
                        href="#keystone-partner-cvs"
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#111111] underline decoration-[#111111]/30 underline-offset-4 hover:decoration-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4ed8]"
                    >
                        <HiArrowDownTray aria-hidden="true" className="size-4" />
                        Download partner CVs (PDF)
                    </a>
                </div>
            </div>
        </section>
    )
}

export default LedgerTableLeadershipTeam

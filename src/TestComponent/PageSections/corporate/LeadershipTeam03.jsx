// OrgChartLeadershipTeam

// LeadershipTeam03 · Corporate & Business › Leadership / Core Team

// Description:
// A blueprint-style organisation chart for the fictional engineering group Vectorline
// Engineering. Under "Who runs what, drawn to scale." the CEO sits at the top, four
// C-suite executives branch below with photos and team sizes, and twelve directors hang
// from their executives. Every branch collapses and expands, with "Expand all" / "Collapse
// all" controls and a legend ("1 CEO · 4 executives · 12 directors"). Use it on an about,
// investor or careers page where visitors need to see reporting lines, not just faces.

// Design:
// - Slate #0f172a section with a faint 40px engineering grid, #111b30 node cards with
//   slate-700 borders, white names and cyan #06b6d4 titles, connector lines, badges and
//   focus rings; a cyan gradient ring marks the CEO node
// - xl+: true tree — CEO centred, a vertical drop into a horizontal bus, and four columns
//   with their own drop lines; directors hang off a rail under each executive
// - Below xl: the same data as a stacked tree with left rails and elbow stubs (the last
//   child’s rail stops at its stub), so it reads cleanly at 360px
// - Directors are compact chips with cyan initials; hovering a branch brightens its lines
// - Branches open/close with a height + fade animation (instant with reduced motion);
//   chevrons rotate; 40px toggle buttons

// What it does:
// - orgOpen (CEO level) and open (map of executive id → boolean) state drive what is shown;
//   each toggle has aria-expanded and aria-controls pointing at a persistent wrapper
// - "Expand all" / "Collapse all" set every branch at once (and the CEO level) and are
//   disabled when they would change nothing
// - Nodes are static text; "Full leadership directory" links to #vectorline-directory

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OrgChartLeadershipTeam from '@/TestComponent/PageSections/corporate/LeadershipTeam03';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <OrgChartLeadershipTeam />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiChevronDown } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

const ceo = {
    name: 'Adrian Kessler',
    title: 'Chief Executive Officer',
    meta: 'Joined 2008 · built the first test rig',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    alt: 'Adrian Kessler in a dark suit and tie',
}

const execs = [
    {
        id: 'cto',
        name: 'Priya Raman',
        title: 'Chief Technology Officer',
        team: 'R&D · 610 people',
        image: photo('1607746882042-944635dfe10e'),
        alt: 'Priya Raman smiling against a dark background',
        directors: [
            { name: 'Leo Brandt', title: 'Director, Embedded Systems' },
            { name: 'Hana Sato', title: 'Director, Simulation & Digital Twins' },
            { name: 'Omar Haddad', title: 'Director, Product Security' },
        ],
    },
    {
        id: 'coo',
        name: 'Kenji Arai',
        title: 'Chief Operating Officer',
        team: 'Operations · 540 people',
        image: photo('1542909168-82c3e7fdca5c'),
        alt: 'Kenji Arai in a dark shirt against a dark background',
        directors: [
            { name: 'Tessa Moreau', title: 'Director, Manufacturing' },
            { name: 'Rui Costa', title: 'Director, Supply Chain' },
            { name: 'Aisha Bello', title: 'Director, Quality & Compliance' },
            { name: 'Dan Whitaker', title: 'Director, Field Service' },
        ],
    },
    {
        id: 'cfo',
        name: 'Elin Sørensen',
        title: 'Chief Financial Officer',
        team: 'Finance · 120 people',
        image: photo('1534528741775-53994a69daeb'),
        alt: 'Elin Sørensen lit by cool blue light',
        directors: [
            { name: 'Marcus Lee', title: 'Director, FP&A' },
            { name: 'Grace Owusu', title: 'Director, Procurement' },
        ],
    },
    {
        id: 'cco',
        name: 'Mateo Ruiz',
        title: 'Chief Commercial Officer',
        team: 'Commercial · 210 people',
        image: photo('1535713875002-d1d0cf377fde'),
        alt: 'Mateo Ruiz in a dark shirt against a light grey wall',
        directors: [
            { name: 'Sophie Laurent', title: 'Director, Sales EMEA' },
            { name: 'Ethan Brooks', title: 'Director, Sales Americas' },
            { name: 'Ingrid Nilsson', title: 'Director, Partnerships & Channels' },
        ],
    },
]

const directorCount = execs.reduce((sum, exec) => sum + exec.directors.length, 0)
const allOpen = Object.fromEntries(execs.map((exec) => [exec.id, true]))
const allClosed = Object.fromEntries(execs.map((exec) => [exec.id, false]))
const initials = (name) =>
    name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)

function Toggle({ open, controls, label, count, onClick }) {
    return (
        <button
            type="button"
            aria-expanded={open}
            aria-controls={controls}
            className={cn(
                'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06b6d4]',
                open
                    ? 'border-[#06b6d4]/50 bg-[#06b6d4]/10 text-[#67e8f9]'
                    : 'border-slate-600 text-slate-300 hover:border-[#06b6d4]/60 hover:text-[#67e8f9]',
            )}
            onClick={onClick}
        >
            <span aria-hidden="true">{count}</span>
            <span className="sr-only">{open ? `Hide ${label}` : `Show ${label}`}</span>
            <HiChevronDown
                aria-hidden="true"
                className={cn('size-4 transition-transform duration-300', open && 'rotate-180')}
            />
        </button>
    )
}

export function OrgChartLeadershipTeam({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [orgOpen, setOrgOpen] = useState(true)
    const [open, setOpen] = useState(allOpen)

    const everythingOpen = orgOpen && execs.every((exec) => open[exec.id])
    const everythingClosed = !orgOpen && execs.every((exec) => !open[exec.id])

    const expandAll = () => {
        setOrgOpen(true)
        setOpen(allOpen)
    }

    const collapseAll = () => {
        setOrgOpen(false)
        setOpen(allClosed)
    }

    const collapse = {
        initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] },
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0f172a] px-4 py-20 text-base font-normal text-slate-300 sm:px-6 md:py-28 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-size-[40px_40px] [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_80%)]"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#06b6d4]">
                            Vectorline Engineering / Leadership structure / Rev. 2026.09
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
                            Who runs what, <span className="text-[#06b6d4]">drawn to scale.</span>
                        </h2>
                        <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-400">
                            Seventeen leaders responsible for 1,480 engineers, technicians and specialists
                            across Stuttgart, Pune and Austin. Open a branch to see who reports to whom.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
                        <p className="font-mono text-xs text-slate-400">
                            1 CEO · {execs.length} executives · {directorCount} directors
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={everythingOpen}
                                className="min-h-10 rounded-lg border border-slate-600 px-4 text-sm font-medium text-white transition-colors hover:border-[#06b6d4] hover:text-[#67e8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06b6d4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-600 disabled:hover:text-white"
                                onClick={expandAll}
                            >
                                Expand all
                            </button>
                            <button
                                type="button"
                                disabled={everythingClosed}
                                className="min-h-10 rounded-lg border border-slate-600 px-4 text-sm font-medium text-white transition-colors hover:border-[#06b6d4] hover:text-[#67e8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06b6d4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-600 disabled:hover:text-white"
                                onClick={collapseAll}
                            >
                                Collapse all
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-14 md:mt-16">
                    <div className="xl:flex xl:justify-center">
                        <div className="rounded-[18px] bg-linear-to-br from-[#06b6d4] via-[#06b6d4]/30 to-slate-700 p-px xl:w-[420px]">
                            <div className="flex items-center gap-4 rounded-[17px] bg-[#0d1628] p-3 sm:p-4">
                                <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-[#1e293b] sm:size-16">
                                    <img
                                        src={ceo.image}
                                        alt={ceo.alt}
                                        loading="lazy"
                                        className="h-full w-full origin-[50%_10%] scale-[1.9] object-cover"
                                    />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-semibold leading-tight text-white sm:text-lg">{ceo.name}</h3>
                                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#22d3ee]">{ceo.title}</p>
                                    <p className="mt-1 hidden text-xs text-slate-400 sm:block">{ceo.meta}</p>
                                </div>
                                <Toggle
                                    open={orgOpen}
                                    controls="vectorline-org-execs"
                                    label={`the ${execs.length} executives reporting to ${ceo.name}`}
                                    count={execs.length}
                                    onClick={() => setOrgOpen((value) => !value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div id="vectorline-org-execs">
                        <AnimatePresence initial={false}>
                            {orgOpen && (
                                <motion.div key="execs" className="overflow-hidden" {...collapse}>
                                    <span aria-hidden="true" className="mx-auto hidden h-10 w-px bg-[#06b6d4]/50 xl:block" />
                                    <ul className="ml-10 sm:ml-12 xl:ml-0 xl:grid xl:grid-cols-4">
                                        {execs.map((exec, index) => {
                                            const isFirst = index === 0
                                            const isLast = index === execs.length - 1
                                            const branchOpen = open[exec.id]
                                            return (
                                                <li key={exec.id} className="group/branch relative pl-6 pt-4 sm:pl-8 xl:px-3 xl:pt-10">
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'absolute left-0 top-0 w-px bg-[#06b6d4]/35 transition-colors group-hover/branch:bg-[#06b6d4] xl:hidden',
                                                            isLast ? 'h-[56px]' : 'bottom-0',
                                                        )}
                                                    />
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute left-0 top-[56px] h-px w-6 bg-[#06b6d4]/35 transition-colors group-hover/branch:bg-[#06b6d4] sm:w-8 xl:hidden"
                                                    />
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'absolute top-0 hidden h-px bg-[#06b6d4]/50 xl:block',
                                                            isFirst ? 'left-1/2 right-0' : isLast ? 'left-0 right-1/2' : 'inset-x-0',
                                                        )}
                                                    />
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute left-1/2 top-0 hidden h-10 w-px bg-[#06b6d4]/50 transition-colors group-hover/branch:bg-[#06b6d4] xl:block"
                                                    />

                                                    <div className="rounded-2xl border border-slate-700/80 bg-[#111b30] p-4 transition-colors group-hover/branch:border-[#06b6d4]/50">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <img
                                                                src={exec.image}
                                                                alt={exec.alt}
                                                                loading="lazy"
                                                                className="size-12 shrink-0 rounded-xl object-cover"
                                                            />
                                                            <Toggle
                                                                open={branchOpen}
                                                                controls={`vectorline-branch-${exec.id}`}
                                                                label={`the ${exec.directors.length} directors reporting to ${exec.name}`}
                                                                count={exec.directors.length}
                                                                onClick={() => setOpen((state) => ({ ...state, [exec.id]: !state[exec.id] }))}
                                                            />
                                                        </div>
                                                        <h3 className="mt-3 text-base font-semibold leading-tight text-white">{exec.name}</h3>
                                                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#22d3ee]">
                                                            {exec.title}
                                                        </p>
                                                        <p className="mt-2 text-xs text-slate-400">{exec.team}</p>
                                                    </div>

                                                    <div id={`vectorline-branch-${exec.id}`}>
                                                        <AnimatePresence initial={false}>
                                                            {branchOpen && (
                                                                <motion.ul
                                                                    key="directors"
                                                                    className="ml-10 overflow-hidden"
                                                                    {...collapse}
                                                                >
                                                                    {exec.directors.map((director, dIndex) => {
                                                                        const lastDirector = dIndex === exec.directors.length - 1
                                                                        return (
                                                                            <li key={director.name} className="relative pl-5 pt-2">
                                                                                <span
                                                                                    aria-hidden="true"
                                                                                    className={cn(
                                                                                        'absolute left-0 top-0 w-px bg-[#06b6d4]/25 transition-colors group-hover/branch:bg-[#06b6d4]/70',
                                                                                        lastDirector ? 'h-[33px]' : 'bottom-0',
                                                                                    )}
                                                                                />
                                                                                <span
                                                                                    aria-hidden="true"
                                                                                    className="absolute left-0 top-[33px] h-px w-5 bg-[#06b6d4]/25 transition-colors group-hover/branch:bg-[#06b6d4]/70"
                                                                                />
                                                                                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#0d1628]/80 px-3 py-2">
                                                                                    <span
                                                                                        aria-hidden="true"
                                                                                        className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#06b6d4]/12 font-mono text-[11px] font-semibold text-[#67e8f9]"
                                                                                    >
                                                                                        {initials(director.name)}
                                                                                    </span>
                                                                                    <div className="min-w-0">
                                                                                        <p className="text-sm font-medium leading-tight text-white">{director.name}</p>
                                                                                        <p className="mt-0.5 text-xs leading-snug text-slate-400">{director.title}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    })}
                                                                </motion.ul>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        Drawing current as of 1 September 2026
                    </p>
                    <a
                        href="#vectorline-directory"
                        className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white hover:text-[#67e8f9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06b6d4]"
                    >
                        Full leadership directory
                        <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default OrgChartLeadershipTeam

// OrbitHubIntegrationsGrid

// IntegrationsGrid01 · SaaS Platforms › Integrations Grid

// Description:
// A space-themed integrations showcase for the fictional two-way sync platform Syncly.
// Under "Every tool, orbiting one source of truth." the Syncly hub sits at the centre of
// three SVG rings while 22 fictional apps (Chatwise, Codebase Hub, Dealwell, Paylane,
// Pagecraft and more) slowly orbit it. Six category cards below (Communication, CRM &
// support, Dev tools, Docs & storage, Analytics, Payments) highlight their apps on the
// orbit. Use it on a product page.

// Design:
// - Deep space navy #0b1026 with a scatter of faint stars, cyan #67e8f9 accents, white and
//   #94a3b8 text; the hub is a cyan-to-indigo gradient disc with a soft pulsing halo
// - Orbit: square stage (max 600px) with three dashed SVG rings; icon tiles are rounded-2xl
//   chips in each app's colour with a white generic icon (lucide), upright while rings turn
// - Rings rotate at different speeds and directions (40s / 65s / 95s per turn) driven by
//   useAnimationFrame; non-matching tiles fade to 20% when a category is picked
// - Category cards: rounded-2xl, 1px white/10 borders, cyan fill + glow when pressed, app
//   names listed in small text; a pill "Pause orbit" control sits under the stage
// - Responsive: tiles 36px → sm:48px → lg:56px; category grid 1 → sm:2 → lg:3 columns;
//   the root clips the star field and rings

// What it does:
// - Rotation pauses while the pointer is over the stage and while the "Pause orbit" button
//   (aria-pressed) is on; useReducedMotion() stops the rotation and hub pulse entirely
// - category state (null by default) is set by the category buttons (aria-pressed); pressing
//   the active card again clears it; an sr-only aria-live line names the highlighted apps
// - "Browse all 180+ integrations" links to #syncly-integrations; orbit icons are decorative

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OrbitHubIntegrationsGrid from '@/TestComponent/PageSections/saas/IntegrationsGrid01';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <OrbitHubIntegrationsGrid />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowRight, HiPause, HiPlay } from 'react-icons/hi2';
import {
    LuBookOpen,
    LuChartLine,
    LuChartPie,
    LuContact,
    LuCreditCard,
    LuDatabase,
    LuFileText,
    LuFolder,
    LuGitBranch,
    LuGitMerge,
    LuHandshake,
    LuHash,
    LuHeadphones,
    LuKanban,
    LuLifeBuoy,
    LuListTodo,
    LuMail,
    LuMessagesSquare,
    LuReceipt,
    LuTable,
    LuVideo,
    LuWallet,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const categories = [
    { id: 'communication', name: 'Communication', blurb: 'Threads, meetings and inboxes' },
    { id: 'crm', name: 'CRM & support', blurb: 'Accounts, deals and tickets' },
    { id: 'dev', name: 'Dev tools', blurb: 'Repos, issues and sprints' },
    { id: 'docs', name: 'Docs & storage', blurb: 'Files, wikis and bases' },
    { id: 'analytics', name: 'Analytics', blurb: 'Events and warehouses' },
    { id: 'payments', name: 'Payments', blurb: 'Revenue and ledgers' },
]

const apps = [
    { name: 'Chatwise', icon: LuMessagesSquare, category: 'communication', color: '#6366f1' },
    { name: 'Codebase Hub', icon: LuGitBranch, category: 'dev', color: '#f97316' },
    { name: 'Dealwell', icon: LuHandshake, category: 'crm', color: '#0ea5e9' },
    { name: 'Pagecraft', icon: LuFileText, category: 'docs', color: '#a855f7' },
    { name: 'Paylane', icon: LuCreditCard, category: 'payments', color: '#10b981' },
    { name: 'Huddlo', icon: LuVideo, category: 'communication', color: '#3b82f6' },
    { name: 'Tracklane', icon: LuKanban, category: 'dev', color: '#f43f5e' },
    { name: 'Clientloop', icon: LuContact, category: 'crm', color: '#f59e0b' },
    { name: 'Boxvault', icon: LuFolder, category: 'docs', color: '#ca8a04' },
    { name: 'Funnelry', icon: LuChartPie, category: 'analytics', color: '#ec4899' },
    { name: 'Coinpost', icon: LuWallet, category: 'payments', color: '#0d9488' },
    { name: 'Pingroom', icon: LuHash, category: 'communication', color: '#8b5cf6' },
    { name: 'Taskpond', icon: LuListTodo, category: 'dev', color: '#16a34a' },
    { name: 'Driftdesk', icon: LuHeadphones, category: 'crm', color: '#0891b2' },
    { name: 'Sheetly', icon: LuTable, category: 'docs', color: '#15803d' },
    { name: 'Warehaus', icon: LuDatabase, category: 'analytics', color: '#0284c7' },
    { name: 'Ledgerbook', icon: LuReceipt, category: 'payments', color: '#65a30d' },
    { name: 'Mailforge', icon: LuMail, category: 'communication', color: '#e11d48' },
    { name: 'Mergebox', icon: LuGitMerge, category: 'dev', color: '#7c3aed' },
    { name: 'Caselane', icon: LuLifeBuoy, category: 'crm', color: '#db2777' },
    { name: 'Wikiwise', icon: LuBookOpen, category: 'docs', color: '#9333ea' },
    { name: 'Metricjar', icon: LuChartLine, category: 'analytics', color: '#ea580c' },
]

const rings = [
    { id: 'inner', radius: 20, seconds: 40, direction: 1, offset: -90, items: apps.slice(0, 5) },
    { id: 'middle', radius: 32, seconds: 65, direction: -1, offset: -70, items: apps.slice(5, 13) },
    { id: 'outer', radius: 44, seconds: 95, direction: 1, offset: -80, items: apps.slice(13) },
]

const stars = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: (i * 37.7) % 100,
    top: (i * 61.3 + (i % 7) * 11) % 100,
    size: i % 5 === 0 ? 2 : 1,
    opacity: 0.25 + ((i * 13) % 50) / 100,
}))

function OrbitRing({ ring, paused, reduceMotion, category }) {
    const rotate = useMotionValue(0)
    const counterRotate = useTransform(rotate, (v) => -v)

    useAnimationFrame((_, delta) => {
        if (paused || reduceMotion) return
        const step = (360 / (ring.seconds * 1000)) * delta * ring.direction
        rotate.set((rotate.get() + step) % 360)
    })

    return (
        <motion.div aria-hidden="true" style={{ rotate }} className="absolute inset-0">
            {ring.items.map((app, i) => {
                const angle = ((ring.offset + (360 / ring.items.length) * i) * Math.PI) / 180
                const left = (50 + ring.radius * Math.cos(angle)).toFixed(3)
                const top = (50 + ring.radius * Math.sin(angle)).toFixed(3)
                const Icon = app.icon
                const dimmed = category && app.category !== category
                const lit = category && app.category === category
                return (
                    <div
                        key={app.name}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${left}%`, top: `${top}%` }}
                    >
                        <motion.div
                            style={{ rotate: counterRotate, backgroundColor: app.color }}
                            className={cn(
                                'grid size-9 place-items-center rounded-xl border text-white transition-[opacity,box-shadow,border-color] duration-500 sm:size-12 sm:rounded-2xl lg:size-14',
                                lit
                                    ? 'border-[#67e8f9] shadow-[0_0_0_2px_#67e8f9,0_0_28px_rgba(103,232,249,0.6)]'
                                    : 'border-white/25 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]',
                                dimmed && 'opacity-20',
                            )}
                        >
                            <Icon className="size-4 sm:size-5 lg:size-6" />
                        </motion.div>
                    </div>
                )
            })}
        </motion.div>
    )
}

export function OrbitHubIntegrationsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [paused, setPaused] = useState(false)
    const [hovering, setHovering] = useState(false)
    const [category, setCategory] = useState(null)
    const reduceMotion = useReducedMotion()
    const activeCategory = categories.find((c) => c.id === category)
    const highlighted = apps.filter((a) => a.category === category).map((a) => a.name)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0b1026] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div aria-hidden="true" className="absolute inset-0 -z-10">
                {stars.map((star) => (
                    <span
                        key={star.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            width: star.size,
                            height: star.size,
                            opacity: star.opacity,
                        }}
                    />
                ))}
                <div className="absolute left-1/2 top-1/3 size-[640px] -translate-x-1/2 rounded-full bg-[#312e81]/40 blur-[140px]" />
            </div>

            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#67e8f9]">Syncly integrations</p>
                    <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Every tool, orbiting one source of truth.
                    </h2>
                    <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#94a3b8]">
                        180+ apps sync both ways through Syncly every 60 seconds. Change a record anywhere and it lands
                        everywhere else.
                    </p>
                </div>

                <div
                    className="relative mx-auto mt-12 aspect-square w-full max-w-[600px]"
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                >
                    <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 size-full" fill="none">
                        {rings.map((ring) => (
                            <circle
                                key={ring.id}
                                cx="50"
                                cy="50"
                                r={ring.radius}
                                stroke="#67e8f9"
                                strokeOpacity="0.22"
                                strokeWidth="0.25"
                                strokeDasharray="0.8 1.4"
                            />
                        ))}
                        <circle cx="50" cy="50" r="12" fill="#67e8f9" fillOpacity="0.06" />
                    </svg>

                    {rings.map((ring) => (
                        <OrbitRing
                            key={ring.id}
                            ring={ring}
                            paused={paused || hovering}
                            reduceMotion={reduceMotion}
                            category={category}
                        />
                    ))}

                    <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
                        {!reduceMotion && (
                            <motion.span
                                aria-hidden="true"
                                className="absolute size-full rounded-full border border-[#67e8f9]/60"
                                animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                            />
                        )}
                        <div className="relative grid size-16 place-items-center rounded-full bg-[linear-gradient(135deg,#67e8f9,#6366f1)] shadow-[0_0_60px_rgba(103,232,249,0.45)] sm:size-24">
                            <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 text-[#0b1026] sm:size-11" fill="none">
                                <path
                                    d="M9 12a8 8 0 0 1 14-3m0 11a8 8 0 0 1-14 3"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="m23 4 .5 5.5L18 10M9 28l-.5-5.5L14 22"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="sr-only">Syncly</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        aria-pressed={paused}
                        className={cn(
                            'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors hover:border-[#67e8f9]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67e8f9]',
                            paused ? 'border-[#67e8f9]/70 bg-[#67e8f9]/15 text-white' : 'border-white/15 text-[#cbd5e1]',
                        )}
                        onClick={() => setPaused((p) => !p)}
                    >
                        {paused ? <HiPlay aria-hidden="true" className="size-4" /> : <HiPause aria-hidden="true" className="size-4" />}
                        Pause orbit
                    </button>
                </div>

                <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <h3 className="text-lg font-semibold text-white">Explore by category</h3>
                    <p className="text-sm text-[#94a3b8]">Pick one to light it up on the orbit.</p>
                </div>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => {
                        const members = apps.filter((a) => a.category === cat.id)
                        const active = category === cat.id
                        return (
                            <li key={cat.id}>
                                <button
                                    type="button"
                                    aria-pressed={active}
                                    className={cn(
                                        'flex min-h-24 w-full flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67e8f9]',
                                        active
                                            ? 'border-[#67e8f9] bg-[#67e8f9]/10 shadow-[0_0_40px_-12px_rgba(103,232,249,0.6)]'
                                            : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]',
                                    )}
                                    onClick={() => setCategory(active ? null : cat.id)}
                                >
                                    <span className="flex w-full items-center justify-between gap-3">
                                        <span className={cn('text-base font-semibold', active ? 'text-[#67e8f9]' : 'text-white')}>
                                            {cat.name}
                                        </span>
                                        <span className="flex -space-x-1.5" aria-hidden="true">
                                            {members.map((m) => {
                                                const Icon = m.icon
                                                return (
                                                    <span
                                                        key={m.name}
                                                        className="grid size-6 place-items-center rounded-full border border-[#0b1026] text-white"
                                                        style={{ backgroundColor: m.color }}
                                                    >
                                                        <Icon className="size-3" />
                                                    </span>
                                                )
                                            })}
                                        </span>
                                    </span>
                                    <span className="text-xs text-[#94a3b8]">{cat.blurb}</span>
                                    <span className="text-xs text-white/70">{members.map((m) => m.name).join(' · ')}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>

                <p aria-live="polite" className="sr-only">
                    {activeCategory ? `${activeCategory.name} highlighted: ${highlighted.join(', ')}` : ''}
                </p>

                <div className="mt-10 flex justify-center">
                    <a
                        href="#syncly-integrations"
                        className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#67e8f9] px-6 text-sm font-semibold text-[#0b1026] transition-colors hover:bg-[#a5f3fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Browse all 180+ integrations
                        <HiArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default OrbitHubIntegrationsGrid

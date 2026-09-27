// VerticalMarqueeIntegrationsGrid

// IntegrationsGrid05 · SaaS Platforms › Integrations Grid

// Description:
// A bold, gradient integrations section for the fictional no-code automation tool Linkforge.
// On the left, "Forge a link to every tool your team touches." sits with three stats (250+
// connectors, 2 min median setup, 99.98% sync success) and two CTAs; on the right three
// columns of fictional app tiles (Chatwise, Codebase Hub, Pagecraft, Paylane and 20 more)
// drift up and down at different speeds. Use it as an eye-catching integrations band on a
// product page.

// Design:
// - Diagonal gradient #2e1065 → #7c3aed with a soft pink-violet light blob; white headings,
//   lilac #ddd6fe body text, #c4b5fd eyebrow; the root clips everything
// - Tiles: rounded-2xl glass cards (white/10 fill, white/15 border, backdrop blur) with a
//   generic lucide icon on a square in the app's colour, name and category; every fifth
//   tile is solid white with ink/violet text
// - Marquee: three columns in a fixed-height window (380 → sm:460 → lg:560px) with a
//   top/bottom fade mask; columns move up / down / up at 34s, 46s and 40s per loop
// - Left column: text-4xl → lg:6xl heading, a 3-up stat row split by hairlines, a white pill
//   CTA and an outline pill CTA; a small pill button pauses the motion
// - Responsive: copy then marquee on mobile/tablet; 5/7 split from lg; tile text truncates
//   in narrow columns

// What it does:
// - Each column is driven by useAnimationFrame and a motion value (seamless loop over a
//   duplicated list); it pauses on hover, when the section is off-screen (useInView) and
//   when the "Pause motion" button (aria-pressed) is on
// - useReducedMotion() keeps every column still (static tiles, no drift, button hidden)
// - The marquee is decorative (aria-hidden); CTAs link to #linkforge-integrations and
//   #linkforge-custom-connector

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VerticalMarqueeIntegrationsGrid from '@/TestComponent/PageSections/saas/IntegrationsGrid05';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <VerticalMarqueeIntegrationsGrid />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowRight, HiPause, HiPlay } from 'react-icons/hi2';
import {
    LuCalendarClock,
    LuClapperboard,
    LuClipboardList,
    LuContact,
    LuCreditCard,
    LuFileText,
    LuFolder,
    LuGitBranch,
    LuGitMerge,
    LuGlobe,
    LuHandshake,
    LuHardDrive,
    LuHeadphones,
    LuInbox,
    LuLifeBuoy,
    LuListTodo,
    LuMail,
    LuMegaphone,
    LuMessagesSquare,
    LuPenTool,
    LuSquareKanban,
    LuStore,
    LuTable2,
    LuVideo,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const columns = [
    {
        id: 'a',
        seconds: 34,
        direction: 'up',
        items: [
            { name: 'Chatwise', kind: 'Chat', icon: LuMessagesSquare, color: '#0ea5e9' },
            { name: 'Pagecraft', kind: 'Docs', icon: LuFileText, color: '#f59e0b' },
            { name: 'Framewell', kind: 'Design', icon: LuPenTool, color: '#f43f5e' },
            { name: 'Huddlo', kind: 'Meetings', icon: LuVideo, color: '#3b82f6' },
            { name: 'Paylane', kind: 'Payments', icon: LuCreditCard, color: '#10b981' },
            { name: 'Dealwell', kind: 'CRM', icon: LuHandshake, color: '#f97316' },
            { name: 'Tracklane', kind: 'Issues', icon: LuListTodo, color: '#ec4899' },
            { name: 'Boxvault', kind: 'Files', icon: LuFolder, color: '#ca8a04' },
        ],
    },
    {
        id: 'b',
        seconds: 46,
        direction: 'down',
        items: [
            { name: 'Codebase Hub', kind: 'Code', icon: LuGitBranch, color: '#1f2937' },
            { name: 'Clientloop', kind: 'CRM', icon: LuContact, color: '#06b6d4' },
            { name: 'Gridbase', kind: 'Database', icon: LuTable2, color: '#22c55e' },
            { name: 'Postbird', kind: 'Email', icon: LuMail, color: '#ef4444' },
            { name: 'Mergebox', kind: 'CI', icon: LuGitMerge, color: '#fb923c' },
            { name: 'Newsbeat', kind: 'Marketing', icon: LuMegaphone, color: '#d946ef' },
            { name: 'Tillhouse', kind: 'Commerce', icon: LuStore, color: '#65a30d' },
            { name: 'Pagewave', kind: 'Websites', icon: LuGlobe, color: '#2563eb' },
        ],
    },
    {
        id: 'c',
        seconds: 40,
        direction: 'up',
        items: [
            { name: 'Roadnest', kind: 'Projects', icon: LuClipboardList, color: '#ea580c' },
            { name: 'Filedrop', kind: 'Files', icon: LuHardDrive, color: '#14b8a6' },
            { name: 'Driftdesk', kind: 'Support', icon: LuHeadphones, color: '#0891b2' },
            { name: 'Caselane', kind: 'Helpdesk', icon: LuLifeBuoy, color: '#e11d48' },
            { name: 'Taskpond', kind: 'Boards', icon: LuSquareKanban, color: '#059669' },
            { name: 'Askbox', kind: 'Forms', icon: LuInbox, color: '#f59e0b' },
            { name: 'Bookslot', kind: 'Scheduling', icon: LuCalendarClock, color: '#0284c7' },
            { name: 'Clipreel', kind: 'Video', icon: LuClapperboard, color: '#db2777' },
        ],
    },
]

const stats = [
    { value: '250+', label: 'native connectors' },
    { value: '2 min', label: 'median setup' },
    { value: '99.98%', label: 'sync success' },
]

function MarqueeColumn({ column, index, running }) {
    const progress = useMotionValue(0)
    const y = useTransform(progress, (v) => `${column.direction === 'up' ? -v : v - 50}%`)

    useAnimationFrame((_, delta) => {
        if (!running) return
        let next = progress.get() + (50 / (column.seconds * 1000)) * delta
        if (next >= 50) next -= 50
        progress.set(next)
    })

    const doubled = [...column.items, ...column.items]

    return (
        <div className="relative h-full min-w-0 overflow-hidden">
            <motion.ul style={{ y }} className="flex flex-col">
                {doubled.map((item, i) => {
                    const Icon = item.icon
                    const solid = (i + index * 2) % 5 === 0
                    return (
                        <li key={`${item.name}-${i}`} className="pb-3">
                            <div
                                className={cn(
                                    'flex flex-col gap-3 rounded-2xl border p-3 sm:p-4',
                                    solid
                                        ? 'border-white bg-white'
                                        : 'border-white/15 bg-white/10 backdrop-blur-md',
                                )}
                            >
                                <span
                                    className="grid size-9 place-items-center rounded-xl text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)] sm:size-11"
                                    style={{ backgroundColor: item.color }}
                                >
                                    <Icon className="size-5 sm:size-6" />
                                </span>
                                <div className="min-w-0">
                                    <p className={cn('truncate text-xs font-semibold sm:text-sm', solid ? 'text-[#2e1065]' : 'text-white')}>
                                        {item.name}
                                    </p>
                                    <p className={cn('truncate text-[10px] sm:text-xs', solid ? 'text-[#6d28d9]/80' : 'text-[#ddd6fe]/80')}>
                                        {item.kind}
                                    </p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </motion.ul>
        </div>
    )
}

export function VerticalMarqueeIntegrationsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [paused, setPaused] = useState(false)
    const [hovering, setHovering] = useState(false)
    const stageRef = useRef(null)
    const inView = useInView(stageRef, { margin: '100px' })
    const reduceMotion = useReducedMotion()
    const running = inView && !paused && !hovering && !reduceMotion

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-linear-to-br from-[#2e1065] to-[#7c3aed] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="absolute -right-32 top-1/4 -z-10 size-[520px] rounded-full bg-[#e879f9]/25 blur-[120px]"
            />
            <div
                aria-hidden="true"
                className="absolute -left-40 -top-40 -z-10 size-[420px] rounded-full bg-[#1e1b4b]/60 blur-[100px]"
            />

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c4b5fd]">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none">
                            <path
                                d="M9 15 15 9M10 6.5l1.5-1.5a4.2 4.2 0 0 1 6 6L16 12.5M14 17.5 12.5 19a4.2 4.2 0 0 1-6-6L8 11.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        Linkforge integrations
                    </p>
                    <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Forge a link to every tool your team touches.
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#ddd6fe]">
                        Drag two apps onto the canvas, map a few fields and Linkforge keeps them in step. When a
                        connector does not exist yet, build one from any REST or GraphQL API in minutes.
                    </p>

                    <dl className="mt-10 grid grid-cols-3 divide-x divide-white/15 border-y border-white/15 py-5">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col-reverse px-3 first:pl-0">
                                <dt className="mt-1 text-xs leading-snug text-[#ddd6fe]/80">{stat.label}</dt>
                                <dd className="text-xl font-bold tracking-tight tabular-nums text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="#linkforge-integrations"
                            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#5b21b6] transition-colors hover:bg-[#f5f3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Browse integrations
                            <HiArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                        <a
                            href="#linkforge-custom-connector"
                            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Build a custom connector
                        </a>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div
                        ref={stageRef}
                        aria-hidden="true"
                        className="grid h-[380px] grid-cols-3 gap-3 [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] sm:h-[460px] sm:gap-4 lg:h-[560px]"
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                    >
                        {columns.map((column, index) => (
                            <MarqueeColumn key={column.id} column={column} index={index} running={running} />
                        ))}
                    </div>
                    {!reduceMotion && (
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                aria-pressed={paused}
                                className={cn(
                                    'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                                    paused ? 'border-white/60 bg-white/20 text-white' : 'border-white/20 bg-white/5 text-[#ddd6fe]',
                                )}
                                onClick={() => setPaused((p) => !p)}
                            >
                                {paused ? <HiPlay aria-hidden="true" className="size-4" /> : <HiPause aria-hidden="true" className="size-4" />}
                                Pause motion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default VerticalMarqueeIntegrationsGrid

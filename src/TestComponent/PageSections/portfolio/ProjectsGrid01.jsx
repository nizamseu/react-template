// StackBadgeProjectsGrid

// ProjectsGrid01 · Portfolios & Personal Websites › Featured Projects Grid

// Description:
// A Swiss-grid "Things I've shipped" section for frontend developer Rafi Chowdhury. Six
// project cards (Parcel Pulse, Tidewater Banking, Loom Design System, Kiln & Co., Dhaka
// Bus Atlas, Metric Garden) each show a screenshot, year, role, client, a result metric,
// tech-stack badges and split "Live ↗" / "Code ↗" links. Clicking any stack badge
// highlights every project built with it. Use it as the work index on a developer site.

// Design:
// - Off-white #f2f0eb with ink #0a0a0a hairline borders and cobalt #1f3fff accents;
//   square corners throughout, mono labels, font-black sans titles
// - Grid 1 → md:2 → lg:3 columns; each card has a № / type / year strip, a 16:10 shot, body
//   copy, a role/client list, badge row and a two-cell link footer that floods cobalt
// - Screenshots start slightly desaturated and go full colour + scale 1.05 on hover; a
//   cobalt metric bar slides up from the bottom of the image (always shown below md)
// - Cards fade and rise in with a stagger when scrolled into view (plain fade for reduced
//   motion); unrelated cards fade to 35% opacity while a stack is highlighted
// - Header: title with "(06)" count and a stack index of the five most used tools

// What it does:
// - activeTech (click, aria-pressed) and hoverTech (hover/focus preview) decide which
//   cards stay highlighted; clicking the active badge again or "Clear" resets it
// - An aria-live line reports "4 of 6 projects use TypeScript" or a usage tip
// - "Live ↗" links to #live-<id> and "Code ↗" to #code-<id>; the NDA project shows a
//   non-link "Code · NDA" cell instead

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StackBadgeProjectsGrid from '@/TestComponent/PageSections/portfolio/ProjectsGrid01';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <StackBadgeProjectsGrid />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight, HiLockClosed, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const projects = [
    {
        id: 'parcel-pulse',
        title: 'Parcel Pulse',
        year: '2026',
        kind: 'Web app',
        summary: 'Real-time tracking dashboard for 40,000 daily deliveries across three cities.',
        role: 'Lead frontend',
        client: 'Parcel Pulse Logistics',
        metric: 'p75 INP down to 92 ms',
        stack: ['React', 'TypeScript', 'D3', 'Tailwind'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
        alt: 'Dark analytics dashboard with line and bar charts',
    },
    {
        id: 'tidewater',
        title: 'Tidewater Banking',
        year: '2025',
        kind: 'Fintech',
        summary: 'Responsive web banking rebuilt from a 2014 jQuery app without a single outage.',
        role: 'Frontend architect',
        client: 'Tidewater Bank',
        metric: '41% fewer support tickets',
        stack: ['Next.js', 'TypeScript', 'Framer Motion', 'Storybook'],
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
        alt: 'Smartphone resting on an open laptop keyboard',
        nda: true,
    },
    {
        id: 'loom',
        title: 'Loom Design System',
        year: '2025',
        kind: 'Design system',
        summary: '72 accessible components and tokens shared by nine product teams.',
        role: 'Design-system lead',
        client: 'Loom & Leaf',
        metric: 'WCAG 2.2 AA across the kit',
        stack: ['React', 'Radix', 'Storybook', 'Style Dictionary'],
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80',
        alt: 'Designer sketching interface layouts on a tablet with a stylus',
    },
    {
        id: 'kiln',
        title: 'Kiln & Co. Storefront',
        year: '2024',
        kind: 'E-commerce',
        summary: 'Headless ceramics shop with scroll-driven product stories and a 0.9 s LCP.',
        role: 'Solo developer',
        client: 'Kiln & Co.',
        metric: '+23% conversion in 90 days',
        stack: ['Remix', 'GSAP', 'Sanity', 'Tailwind'],
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80',
        alt: 'Hand-thrown white ceramic cups and vessels',
    },
    {
        id: 'bus-atlas',
        title: 'Dhaka Bus Atlas',
        year: '2024',
        kind: 'Open source',
        summary: 'Offline-first map of 180 city bus routes, built with volunteers on weekends.',
        role: 'Maintainer',
        client: 'Community project',
        metric: '2.1k GitHub stars',
        stack: ['React', 'TypeScript', 'MapLibre', 'PWA'],
        image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
        alt: 'Busy city street glowing with lights at dusk',
    },
    {
        id: 'metric-garden',
        title: 'Metric Garden',
        year: '2023',
        kind: 'Library',
        summary: 'Tiny analytics widgets you can drop into any page with one script tag.',
        role: 'Co-creator',
        client: 'Side project',
        metric: '11 kB gzipped',
        stack: ['Svelte', 'D3', 'TypeScript', 'Vite'],
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=900&q=80',
        alt: 'Web analytics dashboard with colourful charts on a screen',
    },
]

const usage = projects
    .flatMap((p) => p.stack)
    .reduce((acc, tech) => ({ ...acc, [tech]: (acc[tech] || 0) + 1 }), {})

const topStack = Object.entries(usage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

export function StackBadgeProjectsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [activeTech, setActiveTech] = useState(null)
    const [hoverTech, setHoverTech] = useState(null)
    const shownTech = hoverTech || activeTech
    const matches = shownTech ? projects.filter((p) => p.stack.includes(shownTech)).length : projects.length

    const toggleTech = (tech) => setActiveTech((current) => (current === tech ? null : tech))

    const badgeProps = (tech) => ({
        type: 'button',
        'aria-pressed': activeTech === tech,
        onClick: () => toggleTech(tech),
        onMouseEnter: () => setHoverTech(tech),
        onMouseLeave: () => setHoverTech(null),
        onFocus: () => setHoverTech(tech),
        onBlur: () => setHoverTech(null),
    })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#f2f0eb] px-4 py-16 text-base font-normal text-[#0a0a0a] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 border-b border-[#0a0a0a] pb-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f3fff]">
                            (02) — Selected work, 2023–2026
                        </p>
                        <h2 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.05em] text-[#0a0a0a] sm:text-6xl lg:text-7xl">
                            Things I&apos;ve shipped
                            <sup className="ml-2 align-super font-mono text-base font-semibold tracking-normal text-[#1f3fff] sm:text-lg">
                                (06)
                            </sup>
                        </h2>
                    </div>
                    <div className="lg:col-span-5">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0a0a0a]/60">Stack index</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {topStack.map(([tech, count]) => (
                                <button
                                    key={tech}
                                    {...badgeProps(tech)}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-2 border px-3 font-mono text-xs font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]',
                                        shownTech === tech
                                            ? 'border-[#1f3fff] bg-[#1f3fff] text-white'
                                            : 'border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#f2f0eb]',
                                    )}
                                >
                                    {tech}
                                    <span className="opacity-60">×{count}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 flex min-h-10 items-center justify-between gap-4">
                            <p aria-live="polite" className="text-sm text-[#0a0a0a]/70">
                                {shownTech ? (
                                    <>
                                        <strong className="font-semibold text-[#0a0a0a]">
                                            {matches} of {projects.length}
                                        </strong>{' '}
                                        projects use <span className="text-[#1f3fff]">{shownTech}</span>
                                    </>
                                ) : (
                                    'Tap any stack badge to highlight where I have used it.'
                                )}
                            </p>
                            {activeTech && (
                                <button
                                    type="button"
                                    className="inline-flex min-h-10 shrink-0 items-center gap-1 px-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#0a0a0a] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]"
                                    onClick={() => setActiveTech(null)}
                                >
                                    <HiXMark aria-hidden="true" className="size-4" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {projects.map((project, index) => {
                        const dimmed = shownTech && !project.stack.includes(shownTech)
                        return (
                            <motion.li
                                key={project.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className="flex"
                            >
                                <article
                                    className={cn(
                                        'group flex w-full flex-col border border-[#0a0a0a] bg-[#f2f0eb] transition-opacity duration-300',
                                        dimmed && 'opacity-35',
                                    )}
                                >
                                    <div className="flex h-10 items-center justify-between border-b border-[#0a0a0a] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">
                                        <span>№ {String(index + 1).padStart(2, '0')}</span>
                                        <span className="text-[#0a0a0a]/60">{project.kind}</span>
                                        <span>{project.year}</span>
                                    </div>

                                    <div className="relative aspect-[16/10] overflow-hidden border-b border-[#0a0a0a] bg-[#0a0a0a]">
                                        <img
                                            src={project.image}
                                            alt={project.alt}
                                            loading="lazy"
                                            className="size-full object-cover grayscale-[45%] transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
                                        />
                                        <p className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-[#1f3fff] px-4 py-2.5 font-mono text-xs font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:translate-y-full md:group-focus-within:translate-y-0 md:group-hover:translate-y-0">
                                            <span className="uppercase tracking-[0.14em] text-white/70">Result</span>
                                            <span className="truncate">{project.metric}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="text-2xl font-black leading-tight tracking-[-0.03em] text-[#0a0a0a]">
                                            {project.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-[#0a0a0a]/70">{project.summary}</p>

                                        <dl className="mt-4 grid grid-cols-[4.5rem_1fr] gap-y-1 text-xs">
                                            <dt className="font-mono uppercase tracking-[0.14em] text-[#0a0a0a]/50">Role</dt>
                                            <dd className="font-semibold text-[#0a0a0a]">{project.role}</dd>
                                            <dt className="font-mono uppercase tracking-[0.14em] text-[#0a0a0a]/50">Client</dt>
                                            <dd className="font-semibold text-[#0a0a0a]">{project.client}</dd>
                                        </dl>

                                        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label={`${project.title} tech stack`}>
                                            {project.stack.map((tech) => (
                                                <li key={tech}>
                                                    <button
                                                        {...badgeProps(tech)}
                                                        className={cn(
                                                            'inline-flex min-h-10 items-center border px-2.5 font-mono text-[11px] font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]',
                                                            shownTech === tech
                                                                ? 'border-[#1f3fff] bg-[#1f3fff] text-white'
                                                                : 'border-[#0a0a0a]/25 text-[#0a0a0a] hover:border-[#1f3fff] hover:text-[#1f3fff]',
                                                        )}
                                                    >
                                                        {tech}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid grid-cols-2 border-t border-[#0a0a0a] text-sm font-semibold">
                                        <a
                                            href={`#live-${project.id}`}
                                            aria-label={`${project.title} live site`}
                                            className="group/link flex min-h-12 items-center justify-between px-4 text-[#0a0a0a] transition-colors duration-200 hover:bg-[#1f3fff] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#1f3fff]"
                                        >
                                            Live
                                            <HiArrowUpRight
                                                aria-hidden="true"
                                                className="size-4 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                            />
                                        </a>
                                        {project.nda ? (
                                            <span className="flex min-h-12 items-center justify-between border-l border-[#0a0a0a] px-4 text-[#0a0a0a]/45">
                                                Code · NDA
                                                <HiLockClosed aria-hidden="true" className="size-4" />
                                            </span>
                                        ) : (
                                            <a
                                                href={`#code-${project.id}`}
                                                aria-label={`${project.title} source code`}
                                                className="group/link flex min-h-12 items-center justify-between border-l border-[#0a0a0a] px-4 text-[#0a0a0a] transition-colors duration-200 hover:bg-[#1f3fff] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#1f3fff]"
                                            >
                                                Code
                                                <HiArrowUpRight
                                                    aria-hidden="true"
                                                    className="size-4 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                                />
                                            </a>
                                        )}
                                    </div>
                                </article>
                            </motion.li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default StackBadgeProjectsGrid

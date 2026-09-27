// StickyStackProjectsGrid

// ProjectsGrid04 · Portfolios & Personal Websites › Featured Projects Grid

// Description:
// Creative technologist Mei Tanaka's featured work as a deck of cards that stack while you
// scroll. Under the heading "Work, stacked." four projects (Murmur, Hikari Lab website,
// Tide Table, Paper Machines) pin one after another with growing top offsets, each with a
// giant number, discipline, year, one-paragraph story, role / client / tools and a "View
// case study" link. Use it as the featured-work section of an interactive-art portfolio.

// Design:
// - #111 section with orange #ff8a00 accents; cards cycle orange (#111 text), #1c1c1c,
//   cream #efeae4 and #1a1a1a with an orange hairline so each layer reads against the last
// - Cards are rounded-[28px]; text column (big number text-[5.5rem] → lg:[9rem], title,
//   copy, details list from sm) beside a photo, stacked on mobile, 5 / 7 columns from md
// - Sticky tops use a CSS variable: calc(4.5rem + i × 0.9rem) → md: calc(6rem + i × 1.6rem),
//   so earlier cards peek out as a stepped edge above the current one
// - As the list scrolls, each covered card scales down (5% per layer below it) via
//   useScroll + useTransform; reduced motion keeps the stacking but drops the scaling
// - The root uses overflow-x-clip (not overflow-hidden) so position: sticky keeps working

// What it does:
// - Page scrollY (useScroll) is mapped to the list's own 0 → 1 progress (top of list at
//   the viewport top → bottom of list at the viewport bottom); card i scales from 1 to
//   1 - (n - 1 - i) × 0.05 over the rest of that progress
// - Each card's "View case study" links to #case-<id>; "Browse the archive" to #archive
// - No other state: the stacking itself is pure CSS sticky positioning

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StickyStackProjectsGrid from '@/TestComponent/PageSections/portfolio/ProjectsGrid04';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <StickyStackProjectsGrid />
//     </main>
// )
// ```

'use client'

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HiArrowRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const projects = [
    {
        id: 'murmur',
        title: 'Murmur',
        discipline: 'Interactive installation',
        year: '2026',
        story: '1,200 LEDs strung through a Kyoto warehouse ripple outward from every footstep. Over nine days, 48,000 visitors learned to walk slowly, together.',
        role: 'Concept & tech lead',
        client: 'Kyoto Design Week',
        tools: 'TouchDesigner · LiDAR · Arduino',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        alt: 'Crowd surrounded by bright festival lights in a dark hall',
        theme: 'orange',
    },
    {
        id: 'hikari-web',
        title: 'Hikari Lab website',
        discipline: 'WebGL site',
        year: '2025',
        story: 'The studio site renders our light experiments live in the browser, with a 60 fps fallback path for older phones and a no-WebGL reading mode.',
        role: 'Creative developer',
        client: 'Hikari Lab',
        tools: 'Three.js · GLSL · Astro',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        alt: 'Tokyo street at night glowing with neon signs',
        theme: 'dark',
    },
    {
        id: 'tide-table',
        title: 'Tide Table',
        discipline: 'Kinetic data sculpture',
        year: '2024',
        story: 'Forty-eight wooden slats rise and fall with live tide data from Osaka Bay, a slow clock for a harbourside library reading room.',
        role: 'Engineering & fabrication',
        client: 'Minato Public Library',
        tools: 'Python · Raspberry Pi · steppers',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Close-up of a rippling blue ocean surface',
        theme: 'cream',
    },
    {
        id: 'paper-machines',
        title: 'Paper Machines',
        discipline: 'Mixed-reality theatre',
        year: '2023',
        story: 'A headset play for children where paper puppets come alive around them; 312 sold-out shows and a touring version in 2027.',
        role: 'Interaction design',
        client: 'Nishiki Children’s Theatre',
        tools: 'Unity · Quest 3 · risograph',
        image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80',
        alt: 'Person wearing a virtual-reality headset in soft light',
        theme: 'ink',
    },
]

const themes = {
    orange: {
        card: 'bg-[#ff8a00] text-[#111]',
        number: 'text-[#111]',
        muted: 'text-[#111]/70',
        line: 'border-[#111]/20',
        link: 'bg-[#111] text-[#ff8a00] hover:bg-[#2a2a2a] focus-visible:outline-[#111]',
        title: 'text-[#111]',
    },
    dark: {
        card: 'bg-[#1c1c1c] text-[#f4f1ec]',
        number: 'text-[#ff8a00]',
        muted: 'text-[#f4f1ec]/65',
        line: 'border-[#f4f1ec]/15',
        link: 'bg-[#ff8a00] text-[#111] hover:bg-[#ffa133] focus-visible:outline-[#ff8a00]',
        title: 'text-[#f4f1ec]',
    },
    cream: {
        card: 'bg-[#efeae4] text-[#111]',
        number: 'text-[#ff8a00]',
        muted: 'text-[#111]/65',
        line: 'border-[#111]/15',
        link: 'bg-[#111] text-[#efeae4] hover:bg-[#2a2a2a] focus-visible:outline-[#111]',
        title: 'text-[#111]',
    },
    ink: {
        card: 'bg-[#1a1a1a] text-[#f4f1ec] ring-1 ring-inset ring-[#ff8a00]/60',
        number: 'text-transparent [-webkit-text-stroke:2px_#ff8a00]',
        muted: 'text-[#f4f1ec]/65',
        line: 'border-[#f4f1ec]/15',
        link: 'bg-[#ff8a00] text-[#111] hover:bg-[#ffa133] focus-visible:outline-[#ff8a00]',
        title: 'text-[#f4f1ec]',
    },
}

function StackCard({ project, index, total, progress, reduceMotion }) {
    const start = index / total
    const targetScale = 1 - (total - 1 - index) * 0.05
    const scale = useTransform(progress, [start, 1], [1, targetScale])
    const t = themes[project.theme]

    return (
        <li
            className="sticky top-[calc(4.5rem+var(--i)*0.9rem)] md:top-[calc(6rem+var(--i)*1.6rem)]"
            style={{ '--i': index }}
        >
            <motion.article
                style={reduceMotion ? undefined : { scale, transformOrigin: '50% 0%' }}
                className={cn(
                    'grid grid-cols-1 gap-6 overflow-hidden rounded-[28px] p-5 shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.9)] sm:p-7 md:min-h-[30rem] md:grid-cols-12 md:gap-8 lg:min-h-[34rem] lg:p-9',
                    t.card,
                )}
            >
                <div className="flex flex-col md:col-span-5">
                    <div className="flex items-start justify-between gap-4">
                        <span
                            aria-hidden="true"
                            className={cn(
                                'font-sans text-[5.5rem] font-black leading-[0.8] tracking-[-0.06em] sm:text-[7rem] lg:text-[9rem]',
                                t.number,
                            )}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={cn('mt-1 text-right font-mono text-[10px] uppercase tracking-[0.2em]', t.muted)}>
                            {project.discipline}
                            <br />
                            {project.year}
                        </span>
                    </div>

                    <h3 className={cn('mt-6 text-3xl font-black leading-[0.95] tracking-[-0.04em] sm:text-4xl lg:text-5xl', t.title)}>
                        <span className="sr-only">Project {index + 1}: </span>
                        {project.title}
                    </h3>
                    <p className={cn('mt-4 max-w-md text-sm leading-relaxed md:text-base', t.muted)}>{project.story}</p>

                    <dl className={cn('mt-6 hidden grid-cols-[4.5rem_1fr] gap-y-1.5 border-t pt-4 text-xs sm:grid', t.line)}>
                        <dt className={cn('font-mono uppercase tracking-[0.16em]', t.muted)}>Role</dt>
                        <dd className="font-semibold">{project.role}</dd>
                        <dt className={cn('font-mono uppercase tracking-[0.16em]', t.muted)}>Client</dt>
                        <dd className="font-semibold">{project.client}</dd>
                        <dt className={cn('font-mono uppercase tracking-[0.16em]', t.muted)}>Tools</dt>
                        <dd className="font-semibold">{project.tools}</dd>
                    </dl>

                    <a
                        href={`#case-${project.id}`}
                        className={cn(
                            'group mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 md:mt-auto',
                            t.link,
                        )}
                    >
                        View case study
                        <span className="sr-only">: {project.title}</span>
                        <HiArrowUpRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] md:col-span-7 md:aspect-auto md:h-full md:min-h-[24rem]">
                    <img
                        src={project.image}
                        alt={project.alt}
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover"
                    />
                    <span
                        className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur"
                    >
                        {project.client}
                    </span>
                </div>
            </motion.article>
        </li>
    )
}

export function StickyStackProjectsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const listRef = useRef(null)
    const { scrollY } = useScroll()
    const listProgress = useTransform(scrollY, () => {
        const el = listRef.current
        if (!el || typeof window === 'undefined') return 0
        const rect = el.getBoundingClientRect()
        const distance = rect.height - window.innerHeight
        if (distance <= 0) return rect.top <= 0 ? 1 : 0
        return Math.min(1, Math.max(0, -rect.top / distance))
    })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-x-clip bg-[#111] px-4 py-16 text-base font-normal text-[#f4f1ec] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#ff8a00]">
                            Featured work · 2023—2026
                        </p>
                        <h2 className="mt-4 text-6xl font-black leading-[0.85] tracking-[-0.06em] text-[#f4f1ec] sm:text-7xl lg:text-[8rem]">
                            Work, stacked<span className="text-[#ff8a00]">.</span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-[#a3a09b]">
                        Four projects where code meets rooms, bodies and weather. Keep scrolling — each one pins
                        and the next slides over it.
                    </p>
                </div>

                <ol ref={listRef} className="relative mt-14 space-y-8 md:mt-20 md:space-y-12">
                    {projects.map((project, index) => (
                        <StackCard
                            key={project.id}
                            project={project}
                            index={index}
                            total={projects.length}
                            progress={listProgress}
                            reduceMotion={reduceMotion}
                        />
                    ))}
                </ol>

                <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-[#f4f1ec]/10 pt-8 sm:flex-row sm:items-center">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a3a09b]">
                        + 23 more experiments in the archive
                    </p>
                    <a
                        href="#archive"
                        className="group inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#f4f1ec] underline decoration-[#ff8a00] decoration-2 underline-offset-8 transition-colors hover:text-[#ff8a00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a00]"
                    >
                        Browse the archive
                        <HiArrowRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default StickyStackProjectsGrid

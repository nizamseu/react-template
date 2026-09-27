// LogoGridSkillsToolset

// SkillsToolset01 · Portfolios & Personal Websites › Skills & Toolset

// Description:
// A Swiss-style logo grid of the 22 tools frontend developer Rafi Chowdhury works with,
// grouped into "01 Languages", "02 Frameworks" and "03 Tools" under the heading "22 tools,
// held long enough to trust." Hovering, focusing or tapping a tile turns it cobalt and
// reveals how many years he has used it; on desktop a sticky readout card shows the big
// year count, a 2016–2026 ruler and a one-line note. Use it as the skills block of a
// developer portfolio.

// Design:
// - Header: mono eyebrow row with hairline, grotesk display heading (text-5xl → lg:text-8xl,
//   tracking-tighter) with a cobalt #1f3fff phrase, intro copy and three stat figures
// - Body: lg 12-col grid; sticky cobalt readout card (col-span-4, hidden below lg) next to
//   the three groups (col-span-8); white #ffffff page, ink #0a0a0a, hairline borders
// - Tiles: bordered cells, index number, 32–40px Simple Icons logo, name; the active tile
//   floods cobalt, shows "7 yrs · since 2019" and a white years bar along its bottom edge
// - Motion: tiles rise in with a stagger, the readout number slides between values; both
//   drop the offset for reduced motion
// - Responsive: tiles grid-cols-2 → sm:3 → md:4; heading and stats stack below md

// What it does:
// - active (tool id, default "typescript") is set on tile hover, focus and click, so
//   touch users can tap; the tile exposes aria-pressed and an aria-label with the years
// - Years are derived from a fixed "as of 2026" constant, so server and client match
// - An sr-only aria-live line announces the active tool, years and note
// - "Full stack list" links to #rafi-stack-list; the "currently exploring" pill is visual

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LogoGridSkillsToolset from '@/TestComponent/PageSections/portfolio/SkillsToolset01';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <LogoGridSkillsToolset />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight } from 'react-icons/hi2';
import {
    SiAstro,
    SiCss3,
    SiCypress,
    SiDocker,
    SiFigma,
    SiFramer,
    SiGit,
    SiGraphql,
    SiHtml5,
    SiJavascript,
    SiNextdotjs,
    SiPython,
    SiReact,
    SiStorybook,
    SiSvelte,
    SiTailwindcss,
    SiThreedotjs,
    SiTypescript,
    SiVercel,
    SiVite,
    SiVitest,
    SiVuedotjs,
} from 'react-icons/si';
import { cn } from '@/design-system/lib/cn';

const AS_OF = 2026
const FIRST_YEAR = 2016
const SPAN = AS_OF - FIRST_YEAR

const groups = [
    {
        id: 'languages',
        index: '01',
        label: 'Languages',
        blurb: 'What I think in.',
        tools: [
            { id: 'typescript', name: 'TypeScript', Icon: SiTypescript, since: 2019, note: 'Default on every client build since the Kestrel dashboard rewrite.' },
            { id: 'javascript', name: 'JavaScript', Icon: SiJavascript, since: 2016, note: 'Where it started: jQuery sliders for a Dhaka print shop.' },
            { id: 'html', name: 'HTML5', Icon: SiHtml5, since: 2016, note: 'Semantic first. Every component starts life as plain markup.' },
            { id: 'css', name: 'CSS3', Icon: SiCss3, since: 2016, note: 'Container queries, :has() and cascade layers, all in production.' },
            { id: 'graphql', name: 'GraphQL', Icon: SiGraphql, since: 2021, note: 'Typed queries against the Loomwork design-asset API.' },
            { id: 'python', name: 'Python', Icon: SiPython, since: 2020, note: 'Build scripts, image pipelines and the odd scraper.' },
        ],
    },
    {
        id: 'frameworks',
        index: '02',
        label: 'Frameworks',
        blurb: 'What I build with.',
        tools: [
            { id: 'react', name: 'React', Icon: SiReact, since: 2017, note: '41 shipped products, from storefronts to a WebGL whiteboard.' },
            { id: 'next', name: 'Next.js', Icon: SiNextdotjs, since: 2019, note: 'App Router in production since its first stable release.' },
            { id: 'tailwind', name: 'Tailwind CSS', Icon: SiTailwindcss, since: 2020, note: 'Tokens in, utilities out. Maintains a 60-token preset.' },
            { id: 'framer', name: 'Framer Motion', Icon: SiFramer, since: 2021, note: 'Layout animations and gesture-driven carousels.' },
            { id: 'three', name: 'Three.js', Icon: SiThreedotjs, since: 2022, note: 'Product configurators rendering at a steady 60fps.' },
            { id: 'svelte', name: 'Svelte', Icon: SiSvelte, since: 2022, note: 'Small, fast widgets embedded in third-party pages.' },
            { id: 'vue', name: 'Vue', Icon: SiVuedotjs, since: 2018, note: 'Two years of Vue 2 admin panels at Tidepool Commerce.' },
            { id: 'astro', name: 'Astro', Icon: SiAstro, since: 2023, note: 'Content sites that ship almost zero JavaScript.' },
        ],
    },
    {
        id: 'tools',
        index: '03',
        label: 'Tools',
        blurb: 'What keeps it honest.',
        tools: [
            { id: 'figma', name: 'Figma', Icon: SiFigma, since: 2018, note: 'Reads variables, writes the tokens that mirror them in code.' },
            { id: 'git', name: 'Git', Icon: SiGit, since: 2016, note: 'Tidy history, small PRs, interactive rebase before review.' },
            { id: 'vite', name: 'Vite', Icon: SiVite, since: 2021, note: 'Moved three Webpack monorepos over; cold starts under 1s.' },
            { id: 'storybook', name: 'Storybook', Icon: SiStorybook, since: 2019, note: 'Docs and visual tests for a 140-component library.' },
            { id: 'vitest', name: 'Vitest', Icon: SiVitest, since: 2023, note: '1,900 unit tests running in 14 seconds on CI.' },
            { id: 'cypress', name: 'Cypress', Icon: SiCypress, since: 2020, note: 'End-to-end checkout flows on every pull request.' },
            { id: 'docker', name: 'Docker', Icon: SiDocker, since: 2021, note: 'Reproducible preview environments for every branch.' },
            { id: 'vercel', name: 'Vercel', Icon: SiVercel, since: 2019, note: 'Edge middleware, preview links and ISR for content sites.' },
        ],
    },
]

const allTools = groups.flatMap((group) => group.tools.map((tool) => ({ ...tool, group: group.label })))
const toolCount = allTools.length
const rulerYears = Array.from({ length: SPAN + 1 }, (_, i) => FIRST_YEAR + i)

const yearsOf = (tool) => AS_OF - tool.since

export function LogoGridSkillsToolset({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState('typescript')
    const current = allTools.find((tool) => tool.id === active) ?? allTools[0]
    const currentYears = yearsOf(current)
    const CurrentIcon = current.Icon

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white text-base font-normal text-[#0a0a0a]', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <div className="flex items-center justify-between gap-4 border-b border-[#0a0a0a]/15 pb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#0a0a0a]/60">
                    <span>(03) Toolset</span>
                    <span className="text-right">Rafi Chowdhury · Frontend Developer</span>
                </div>

                <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
                    <h2 className="font-sans text-5xl font-semibold leading-[0.92] tracking-tighter text-[#0a0a0a] sm:text-6xl md:col-span-8 lg:text-8xl">
                        {toolCount} tools, held long enough <span className="text-[#1f3fff]">to trust.</span>
                    </h2>
                    <div className="md:col-span-4">
                        <p className="max-w-sm text-base leading-relaxed text-[#0a0a0a]/70">
                            Ten years of shipping for the web, sorted by how I use them. Hover, focus or tap
                            a tile to see how long it has been in my hands.
                        </p>
                        <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[#0a0a0a]/15 pt-5">
                            {[
                                ['10', 'yrs on the web'],
                                ['64', 'projects shipped'],
                                ['3', 'design systems'],
                            ].map(([value, label]) => (
                                <div key={label}>
                                    <dt className="sr-only">{label}</dt>
                                    <dd className="text-3xl font-semibold tracking-tight text-[#0a0a0a] sm:text-4xl">{value}</dd>
                                    <dd className="mt-1 text-xs leading-snug text-[#0a0a0a]/60">{label}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
                    <aside className="hidden lg:col-span-4 lg:block" aria-hidden="true">
                        <div className="sticky top-8 overflow-hidden rounded-[28px] bg-[#1f3fff] p-8 text-white shadow-[0_30px_60px_-30px_rgba(31,63,255,0.7)]">
                            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
                                <span>Now reading</span>
                                <span>{current.group}</span>
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                                <span className="grid size-14 place-items-center rounded-2xl bg-white text-[#1f3fff]">
                                    <CurrentIcon className="size-7" />
                                </span>
                                <p className="text-3xl font-semibold tracking-tight">{current.name}</p>
                            </div>
                            <div className="relative mt-6 flex h-[132px] items-end gap-3 overflow-hidden">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                        key={current.id}
                                        initial={{ y: reduceMotion ? 0 : 60, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: reduceMotion ? 0 : -60, opacity: 0 }}
                                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        className="block text-[136px] font-semibold leading-[0.8] tracking-tighter tabular-nums"
                                    >
                                        {String(currentYears).padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="pb-2 font-mono text-xs uppercase tracking-[0.2em] text-white/70">
                                    years
                                </span>
                            </div>

                            <div className="mt-8">
                                <div className="relative h-2 rounded-full bg-white/20">
                                    <motion.span
                                        className="absolute inset-y-0 right-0 rounded-full bg-white"
                                        animate={{ left: `${((current.since - FIRST_YEAR) / SPAN) * 100}%` }}
                                        transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </div>
                                <div className="mt-2 flex justify-between font-mono text-[10px] text-white/60">
                                    {rulerYears.map((year) => (
                                        <span
                                            key={year}
                                            className={cn(year === current.since && 'font-bold text-white')}
                                        >
                                            {year % 2 === 0 || year === current.since ? `’${String(year).slice(2)}` : '·'}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="mt-8 border-t border-white/20 pt-5 text-sm leading-relaxed text-white/85">
                                {current.note}
                            </p>
                            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                                Since {current.since} · as of {AS_OF}
                            </p>
                        </div>
                    </aside>

                    <div className="space-y-12 lg:col-span-8">
                        {groups.map((group) => (
                            <div key={group.id}>
                                <div className="flex items-baseline justify-between gap-4">
                                    <h3 className="flex items-baseline gap-3 text-2xl font-semibold tracking-tight text-[#0a0a0a] sm:text-3xl">
                                        <span className="font-mono text-xs font-normal text-[#1f3fff]">{group.index}</span>
                                        {group.label}
                                    </h3>
                                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0a0a0a]/55">
                                        {group.blurb} · {group.tools.length}
                                    </p>
                                </div>
                                <ul className="mt-4 grid grid-cols-2 border-l border-t border-[#0a0a0a]/12 sm:grid-cols-3 md:grid-cols-4">
                                    {group.tools.map((tool, index) => {
                                        const isActive = tool.id === active
                                        const years = yearsOf(tool)
                                        const Icon = tool.Icon
                                        return (
                                            <motion.li
                                                key={tool.id}
                                                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                                className="border-b border-r border-[#0a0a0a]/12"
                                            >
                                                <button
                                                    type="button"
                                                    aria-pressed={isActive}
                                                    aria-label={`${tool.name}: ${years} years, since ${tool.since}`}
                                                    className={cn(
                                                        'group relative flex h-full min-h-[136px] w-full flex-col justify-between gap-4 overflow-hidden p-4 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#0a0a0a] sm:min-h-[156px] sm:p-5',
                                                        isActive
                                                            ? 'bg-[#1f3fff] text-white'
                                                            : 'bg-white text-[#0a0a0a] hover:bg-[#f2f4ff]',
                                                    )}
                                                    onMouseEnter={() => setActive(tool.id)}
                                                    onFocus={() => setActive(tool.id)}
                                                    onClick={() => setActive(tool.id)}
                                                >
                                                    <span className="flex items-start justify-between">
                                                        <Icon
                                                            aria-hidden="true"
                                                            className={cn(
                                                                'size-8 transition-transform duration-300 sm:size-10',
                                                                !isActive && 'text-[#0a0a0a] group-hover:-rotate-6',
                                                            )}
                                                        />
                                                        <span
                                                            className={cn(
                                                                'font-mono text-[10px] tracking-[0.15em]',
                                                                isActive ? 'text-white/70' : 'text-[#0a0a0a]/40',
                                                            )}
                                                        >
                                                            {group.index}.{String(index + 1).padStart(2, '0')}
                                                        </span>
                                                    </span>
                                                    <span>
                                                        <span className="block text-[15px] font-medium leading-tight">{tool.name}</span>
                                                        <span
                                                            className={cn(
                                                                'mt-1 block font-mono text-[11px] transition-all duration-300',
                                                                isActive
                                                                    ? 'translate-y-0 text-white/80 opacity-100'
                                                                    : 'translate-y-1 text-[#1f3fff] opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
                                                            )}
                                                        >
                                                            {years} yrs · since {tool.since}
                                                        </span>
                                                    </span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'absolute inset-x-0 bottom-0 h-1 transition-opacity duration-300',
                                                            isActive ? 'bg-white/25 opacity-100' : 'opacity-0',
                                                        )}
                                                    >
                                                        <span
                                                            className="block h-full bg-white"
                                                            style={{ width: `${(years / SPAN) * 100}%` }}
                                                        />
                                                    </span>
                                                </button>
                                            </motion.li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}

                        <div className="flex flex-col gap-5 border-t border-[#0a0a0a]/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="inline-flex items-center gap-2 self-start rounded-full border border-[#1f3fff]/30 bg-[#f2f4ff] px-3.5 py-2 text-sm text-[#0a0a0a]">
                                <span className="relative flex size-2">
                                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#1f3fff] opacity-60 motion-reduce:animate-none" />
                                    <span className="relative inline-flex size-2 rounded-full bg-[#1f3fff]" />
                                </span>
                                Currently exploring WebGPU &amp; View Transitions
                            </p>
                            <a
                                href="#rafi-stack-list"
                                className="group inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[#0a0a0a] hover:text-[#1f3fff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3fff] sm:self-auto"
                            >
                                <span className="border-b border-current pb-0.5">Full stack list</span>
                                <HiArrowUpRight
                                    aria-hidden="true"
                                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <p aria-live="polite" className="sr-only">
                    {`${current.name}, ${currentYears} years, since ${current.since}. ${current.note}`}
                </p>
            </div>
        </section>
    )
}

export default LogoGridSkillsToolset

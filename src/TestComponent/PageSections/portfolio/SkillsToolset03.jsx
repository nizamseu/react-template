// OrbitSystemSkillsToolset

// SkillsToolset03 · Portfolios & Personal Websites › Skills & Toolset

// Description:
// A night-sky "solar system" of creative technologist Mei Tanaka's toolkit. Next to the
// heading "Everything orbits the idea." fifteen tool logos circle her portrait on three
// rings, Ring 01 Code, Ring 02 Make and Ring 03 Stage, each turning at its own speed. Hover,
// focus or tap a planet to read its years and the installation it powered; the ring legend
// spotlights one orbit. On phones the orbit becomes a grouped chip list. Use it as the
// skills block of a creative-coding or interactive-studio portfolio.

// Design:
// - #111111 page, warm white #f5f5f4 text, lanyard orange #ff8a00 accents with a soft
//   orange radial glow behind the stage; grotesk display heading (text-5xl → lg:text-7xl)
// - Stage: square (max 600px) with three dashed rings (radii 20% / 32% / 44%), mono ring
//   labels, a 24% round portrait with an orange halo, and 48–56px dark "planet" buttons that
//   counter-rotate so logos and labels stay upright
// - Active planet turns orange with a label pill; legend buttons dim the other rings
// - Detail card: bordered #1a1a1a panel with logo, ring, years, level and "Used in" line
// - Responsive: base shows chip list + card; md adds legend and the orbit under the text;
//   lg splits text (5 cols) and orbit (7 cols)

// What it does:
// - One useAnimationFrame clock drives all rings via useTransform (ring 1 one turn per
//   70 s, ring 2 reversed per 95 s, ring 3 per 130 s); it stops while the pointer is over
//   the stage, while a planet has focus, when "Pause orbit" is pressed, and for reduced
//   motion (static layout)
// - active (tool id) is set by hover, focus or click on planets and mobile chips;
//   focusRing (legend, aria-pressed) dims the other rings; the card is aria-live
// - "See the installations" links to #mei-installations

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OrbitSystemSkillsToolset from '@/TestComponent/PageSections/portfolio/SkillsToolset03';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <OrbitSystemSkillsToolset />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowUpRight, HiPause, HiPlay } from 'react-icons/hi2';
import {
    SiAdobeaftereffects,
    SiArduino,
    SiBlender,
    SiFigma,
    SiGithub,
    SiHoudini,
    SiNodedotjs,
    SiProcessingfoundation,
    SiRaspberrypi,
    SiThreedotjs,
    SiTypescript,
    SiUnity,
    SiUnrealengine,
    SiVercel,
    SiWebgl,
} from 'react-icons/si';
import { cn } from '@/design-system/lib/cn';

const rings = [
    {
        id: 'code',
        index: '01',
        label: 'Code',
        caption: 'What runs the piece',
        radius: 20,
        period: 70,
        dir: 1,
        offset: -90,
        tools: [
            { id: 'three', name: 'Three.js', Icon: SiThreedotjs, years: 7, level: 'Daily', usedIn: 'Lumen Garden, 2025: 40,000 reactive petals' },
            { id: 'webgl', name: 'WebGL / GLSL', Icon: SiWebgl, years: 6, level: 'Daily', usedIn: 'Custom shaders for every projection-mapped wall' },
            { id: 'ts', name: 'TypeScript', Icon: SiTypescript, years: 6, level: 'Daily', usedIn: 'Show-control software and sensor dashboards' },
            { id: 'processing', name: 'Processing', Icon: SiProcessingfoundation, years: 11, level: 'Weekly', usedIn: 'Sketchbook since art school, 900+ saved sketches' },
        ],
    },
    {
        id: 'make',
        index: '02',
        label: 'Make',
        caption: 'What you can touch',
        radius: 32,
        period: 95,
        dir: -1,
        offset: -60,
        tools: [
            { id: 'arduino', name: 'Arduino', Icon: SiArduino, years: 10, level: 'Weekly', usedIn: 'Tidal Choir: 64 pressure pads on a wooden pier' },
            { id: 'rpi', name: 'Raspberry Pi', Icon: SiRaspberrypi, years: 8, level: 'Weekly', usedIn: 'Networked kiosks at the Shiokaze Science Museum' },
            { id: 'node', name: 'Node.js', Icon: SiNodedotjs, years: 7, level: 'Daily', usedIn: 'OSC and MIDI bridges between sensors and visuals' },
            { id: 'blender', name: 'Blender', Icon: SiBlender, years: 5, level: 'Project', usedIn: 'Previs for rooms before a single cable is laid' },
            { id: 'unity', name: 'Unity', Icon: SiUnity, years: 4, level: 'Project', usedIn: 'Paper Moon, an AR picture book for 6-year-olds' },
        ],
    },
    {
        id: 'stage',
        index: '03',
        label: 'Stage',
        caption: 'How it reaches people',
        radius: 44,
        period: 130,
        dir: 1,
        offset: -30,
        tools: [
            { id: 'unreal', name: 'Unreal Engine', Icon: SiUnrealengine, years: 3, level: 'Project', usedIn: 'Real-time LED volume for the Hikari launch show' },
            { id: 'houdini', name: 'Houdini', Icon: SiHoudini, years: 3, level: 'Project', usedIn: 'Particle sims baked for a 12-metre projection' },
            { id: 'ae', name: 'After Effects', Icon: SiAdobeaftereffects, years: 9, level: 'Weekly', usedIn: 'Pitch films and installation documentation' },
            { id: 'figma', name: 'Figma', Icon: SiFigma, years: 6, level: 'Weekly', usedIn: 'Interface flows for visitor-facing touchscreens' },
            { id: 'github', name: 'GitHub', Icon: SiGithub, years: 9, level: 'Daily', usedIn: '31 open-source creative-coding repos' },
            { id: 'vercel', name: 'Vercel', Icon: SiVercel, years: 4, level: 'Weekly', usedIn: 'Web companions that ship with each installation' },
        ],
    },
]

const allTools = rings.flatMap((ring) => ring.tools.map((tool) => ({ ...tool, ring })))

const AVATAR = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'

function position(ring, index) {
    const angle = ((ring.offset + (index / ring.tools.length) * 360) * Math.PI) / 180
    const x = 50 + ring.radius * Math.cos(angle)
    const y = 50 + ring.radius * Math.sin(angle)
    return { left: `${x.toFixed(3)}%`, top: `${y.toFixed(3)}%` }
}

function OrbitRing({ ring, clock, active, dimmed, onActivate, onFocusChange }) {
    const rotate = useTransform(clock, (t) => (ring.dir * t * 360) / ring.period)
    const counter = useTransform(rotate, (r) => -r)

    return (
        <>
            <div
                aria-hidden="true"
                className={cn(
                    'absolute rounded-full border border-dashed transition-colors duration-500',
                    dimmed ? 'border-white/[0.07]' : 'border-white/20',
                )}
                style={{ inset: `${50 - ring.radius}%` }}
            />
            <span
                aria-hidden="true"
                className={cn(
                    'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111111] px-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-500',
                    dimmed ? 'text-white/20' : 'text-white/50',
                )}
                style={{ top: `${50 + ring.radius}%` }}
            >
                {ring.index} {ring.label}
            </span>
            <motion.ul style={{ rotate }} className="pointer-events-none absolute inset-0" aria-label={`Ring ${ring.index}: ${ring.label}`}>
                {ring.tools.map((tool, index) => {
                    const isActive = active === tool.id
                    const Icon = tool.Icon
                    return (
                        <li key={tool.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={position(ring, index)}>
                            <motion.button
                                type="button"
                                style={{ rotate: counter }}
                                aria-pressed={isActive}
                                aria-label={`${tool.name}, ${tool.years} years`}
                                className={cn(
                                    'pointer-events-auto relative grid size-12 place-items-center rounded-full border transition-[background-color,border-color,color,opacity,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a00] lg:size-14',
                                    isActive
                                        ? 'border-[#ff8a00] bg-[#ff8a00] text-[#111111] shadow-[0_0_0_6px_rgba(255,138,0,0.18),0_0_40px_rgba(255,138,0,0.45)]'
                                        : 'border-white/15 bg-[#1c1c1c] text-[#f5f5f4] hover:border-[#ff8a00]/70',
                                    dimmed && !isActive && 'opacity-25',
                                )}
                                onMouseEnter={() => onActivate(tool.id)}
                                onFocus={() => {
                                    onActivate(tool.id)
                                    onFocusChange(true)
                                }}
                                onBlur={() => onFocusChange(false)}
                                onClick={() => onActivate(tool.id)}
                            >
                                <Icon aria-hidden="true" className="size-5 lg:size-6" />
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#f5f5f4] px-2.5 py-1 text-[11px] font-semibold text-[#111111] transition-opacity duration-200',
                                        isActive ? 'opacity-100' : 'opacity-0',
                                    )}
                                >
                                    {tool.name}
                                </span>
                            </motion.button>
                        </li>
                    )
                })}
            </motion.ul>
        </>
    )
}

export function OrbitSystemSkillsToolset({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const clock = useMotionValue(0)
    const hoverRef = useRef(false)
    const focusRef = useRef(false)
    const [paused, setPaused] = useState(false)
    const [active, setActive] = useState('three')
    const [focusRing, setFocusRing] = useState(null)

    useAnimationFrame((_, delta) => {
        if (reduceMotion || paused || hoverRef.current || focusRef.current) return
        clock.set(clock.get() + Math.min(delta, 64) / 1000)
    })

    const current = allTools.find((tool) => tool.id === active) ?? allTools[0]
    const CurrentIcon = current.Icon

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#111111] text-base font-normal text-[#f5f5f4]', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-1/2 size-[720px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,138,0,0.16),transparent_62%)]"
            />
            <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8">
                <div className="lg:col-span-5">
                    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-white/60">
                        <span className="size-2 bg-[#ff8a00]" aria-hidden="true" />
                        Mei Tanaka · Toolkit
                    </p>
                    <h2 className="mt-6 font-sans text-5xl font-bold leading-[0.95] tracking-tight text-[#f5f5f4] sm:text-6xl lg:text-7xl">
                        Everything orbits <span className="text-[#ff8a00]">the idea.</span>
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-white/65">
                        Fifteen tools on three rings: the code that runs a piece, the hardware you can
                        touch, and the stage it finally reaches. The closer the ring, the more often I
                        reach for it.
                    </p>

                    <div className="mt-10 hidden space-y-2 md:block" role="group" aria-label="Spotlight a ring">
                        {rings.map((ring) => {
                            const on = focusRing === ring.id
                            return (
                                <button
                                    key={ring.id}
                                    type="button"
                                    aria-pressed={on}
                                    className={cn(
                                        'group flex min-h-12 w-full items-center gap-4 rounded-2xl border px-4 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]',
                                        on
                                            ? 'border-[#ff8a00] bg-[#ff8a00]/10'
                                            : 'border-white/10 hover:border-white/30',
                                    )}
                                    onClick={() => setFocusRing(on ? null : ring.id)}
                                >
                                    <span className={cn('font-mono text-xs', on ? 'text-[#ff8a00]' : 'text-white/45')}>
                                        {ring.index}
                                    </span>
                                    <span className="text-base font-semibold text-[#f5f5f4]">{ring.label}</span>
                                    <span className="text-sm text-white/50">{ring.caption}</span>
                                    <span className="ml-auto font-mono text-xs text-white/45">{ring.tools.length}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-10 space-y-6 md:hidden">
                        {rings.map((ring) => (
                            <div key={ring.id}>
                                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
                                    <span className="text-[#ff8a00]">{ring.index}</span> {ring.label} · {ring.caption}
                                </p>
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {ring.tools.map((tool) => {
                                        const isActive = active === tool.id
                                        const Icon = tool.Icon
                                        return (
                                            <li key={tool.id}>
                                                <button
                                                    type="button"
                                                    aria-pressed={isActive}
                                                    className={cn(
                                                        'inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]',
                                                        isActive
                                                            ? 'border-[#ff8a00] bg-[#ff8a00] font-semibold text-[#111111]'
                                                            : 'border-white/15 bg-[#1c1c1c] text-[#f5f5f4]',
                                                    )}
                                                    onClick={() => setActive(tool.id)}
                                                >
                                                    <Icon aria-hidden="true" className="size-4" />
                                                    {tool.name}
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div
                        aria-live="polite"
                        className="mt-8 rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 sm:p-6"
                    >
                        <div className="flex items-center gap-4">
                            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#ff8a00] text-[#111111]">
                                <CurrentIcon aria-hidden="true" className="size-6" />
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-xl font-semibold text-[#f5f5f4]">{current.name}</p>
                                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                                    Ring {current.ring.index} · {current.ring.label}
                                </p>
                            </div>
                            <p className="ml-auto text-right">
                                <span className="block text-3xl font-bold tabular-nums leading-none text-[#ff8a00]">
                                    {current.years}
                                </span>
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">yrs</span>
                            </p>
                        </div>
                        <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/75">
                            <span className="text-white/45">Used in </span>
                            {current.usedIn}
                        </p>
                        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                            Reach for it: {current.level}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {!reduceMotion && (
                            <button
                                type="button"
                                aria-pressed={paused}
                                className="hidden min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-medium text-[#f5f5f4] transition-colors duration-200 hover:border-[#ff8a00] hover:text-[#ff8a00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00] md:inline-flex"
                                onClick={() => setPaused((p) => !p)}
                            >
                                {paused ? <HiPlay aria-hidden="true" className="size-4" /> : <HiPause aria-hidden="true" className="size-4" />}
                                {paused ? 'Resume orbit' : 'Pause orbit'}
                            </button>
                        )}
                        <a
                            href="#mei-installations"
                            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ff8a00] px-5 text-sm font-semibold text-[#111111] transition-colors duration-200 hover:bg-[#ffa133] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]"
                        >
                            See the installations
                            <HiArrowUpRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </a>
                    </div>
                </div>

                <div className="hidden md:block lg:col-span-7">
                    <div
                        className="relative mx-auto aspect-square w-full max-w-[600px]"
                        onPointerEnter={() => {
                            hoverRef.current = true
                        }}
                        onPointerLeave={() => {
                            hoverRef.current = false
                        }}
                    >
                        <div
                            aria-hidden="true"
                            className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]"
                        />
                        <div className="absolute inset-[38%] overflow-hidden rounded-full border-2 border-[#ff8a00] shadow-[0_0_0_10px_rgba(255,138,0,0.12),0_0_80px_rgba(255,138,0,0.35)]">
                            <img
                                src={AVATAR}
                                alt="Portrait of Mei Tanaka with long dark hair against a dark backdrop"
                                loading="lazy"
                                className="size-full object-cover"
                            />
                        </div>
                        {rings.map((ring) => (
                            <OrbitRing
                                key={ring.id}
                                ring={ring}
                                clock={clock}
                                active={active}
                                dimmed={focusRing !== null && focusRing !== ring.id}
                                onActivate={setActive}
                                onFocusChange={(value) => {
                                    focusRef.current = value
                                }}
                            />
                        ))}
                    </div>
                    <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
                        {reduceMotion ? 'Orbit held still · tap a planet' : 'Hover to stop the orbit · tap a planet'}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default OrbitSystemSkillsToolset

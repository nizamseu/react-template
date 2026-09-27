// MotionTileLearningOutcomes

// LearningOutcomes05 · Learning Management Systems › Learning Outcomes

// Description:
// A playful outcomes grid for the fictional animation course Motion Lab. Under "Ten weeks.
// Six new reflexes." six gradient tiles each name a principle you'll master (Squash &
// stretch, Easing, Timing & spacing, Seamless loops, Shape morphing, Choreography) with
// a looping micro-animation that demonstrates it. Hovering or focusing a tile widens it
// and reveals what you'll make, when, and the skills involved. Use it on a creative or
// design course page where the outcomes should feel as lively as the craft.

// Design:
// - Near-black #111 section, white text; tiles use the three course gradients
//   (#ff7eb3→#7afcff, #fdfc47→#24fe41, #a18cd1→#fbc2eb) with #111 text, rounded-[28px]
// - Each tile has a black rounded-2xl icon well with a framer-motion loop (bouncing ball
//   with squash, eased dot, staggered spacing dots, spinning square, morphing blob,
//   staggered bars); loops are not started when reduced motion is preferred
// - Heavy sans type: heading text-4xl → lg:text-7xl with a gradient-clipped word, tile
//   titles font-black text-2xl; mono week labels and tag chips
// - Expansion: on lg the tiles sit in two flex rows and the active one grows (flex-grow
//   1 → 2.2, CSS transition); its details panel opens with a grid-rows 0fr → 1fr
//   transition; transitions are off under motion-reduce
// - Responsive: tiles stack full-width below lg (only the active one shows details),
//   two rows of three from lg; header stacks, then splits at md

// What it does:
// - active state (tile id, default the first tile): mouse enter, focus or click on a tile
//   sets it; the tile's full-size button carries aria-expanded + aria-controls
// - The details panel lists what you'll make, the weeks and skill tags; the last active
//   tile stays open when the pointer leaves
// - "Watch the student reel" links to #motion-lab-reel and "See the full curriculum" to
//   #motion-lab-curriculum

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MotionTileLearningOutcomes from '@/TestComponent/PageSections/learning/LearningOutcomes05';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <MotionTileLearningOutcomes />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiOutlinePlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tiles = [
    {
        id: 'squash',
        kind: 'bounce',
        title: 'Squash & stretch',
        statement: 'Make weight visible: a ball, then a flour sack, that reads heavy or light.',
        make: 'A 3-second bounce test at 24 fps',
        weeks: 'Weeks 1–2',
        tags: ['Arcs', 'Weight', 'Volume'],
        gradient: 'bg-linear-to-br from-[#ff7eb3] to-[#7afcff]',
    },
    {
        id: 'easing',
        kind: 'ease',
        title: 'Easing',
        statement: 'Shape custom cubic-bezier curves in the graph editor instead of settling for linear.',
        make: 'A set of six UI micro-interactions',
        weeks: 'Week 3',
        tags: ['Graph editor', 'Bezier', 'UI motion'],
        gradient: 'bg-linear-to-br from-[#fdfc47] to-[#24fe41]',
    },
    {
        id: 'timing',
        kind: 'timing',
        title: 'Timing & spacing',
        statement: 'Count frames, not seconds, so a head turn reads as tired, curious or startled.',
        make: 'A head-turn triptych, 3 × 2 seconds',
        weeks: 'Weeks 4–5',
        tags: ['Spacing charts', 'Holds', 'Anticipation'],
        gradient: 'bg-linear-to-br from-[#a18cd1] to-[#fbc2eb]',
    },
    {
        id: 'loops',
        kind: 'loop',
        title: 'Seamless loops',
        statement: 'Build loops that never reveal their start: stickers, loaders and idle cycles.',
        make: 'A loader pack of five perfect loops',
        weeks: 'Week 6',
        tags: ['Cycles', 'Offsets', 'Export'],
        gradient: 'bg-linear-to-bl from-[#ff7eb3] to-[#7afcff]',
    },
    {
        id: 'morph',
        kind: 'morph',
        title: 'Shape morphing',
        statement: 'Keep vertex counts clean so logos and icons melt into each other smoothly.',
        make: 'A 4-second logo morph sting',
        weeks: 'Weeks 7–8',
        tags: ['Paths', 'Vertices', 'Masks'],
        gradient: 'bg-linear-to-bl from-[#fdfc47] to-[#24fe41]',
    },
    {
        id: 'choreo',
        kind: 'bars',
        title: 'Choreography',
        statement: 'Stagger, overlap and follow through so thirty elements move like one idea.',
        make: 'A 15-second title sequence (final project)',
        weeks: 'Weeks 9–10',
        tags: ['Stagger', 'Overlap', 'Hierarchy'],
        gradient: 'bg-linear-to-bl from-[#a18cd1] to-[#fbc2eb]',
    },
]

const rows = [tiles.slice(0, 3), tiles.slice(3)]

function MicroIcon({ kind, reduce }) {
    const loop = { repeat: Infinity }

    if (kind === 'bounce') {
        return (
            <span className="relative flex h-full w-full items-end justify-center pb-3">
                <motion.span
                    className="block h-5 w-5 rounded-full bg-[#ff7eb3]"
                    style={{ originY: 1 }}
                    animate={reduce ? undefined : { y: [-24, 0, -24], scaleX: [0.92, 1.35, 0.92], scaleY: [1.08, 0.65, 1.08] }}
                    transition={{ ...loop, duration: 0.9, times: [0, 0.5, 1], ease: ['easeIn', 'easeOut'] }}
                />
                <span className="absolute bottom-2.5 h-0.5 w-9 rounded-full bg-white/25" />
            </span>
        )
    }

    if (kind === 'ease') {
        return (
            <span className="relative flex h-full w-full flex-col items-center justify-center gap-2">
                <svg viewBox="0 0 40 20" className="h-5 w-10" fill="none">
                    <path d="M2 18 C 16 18, 24 2, 38 2" stroke="#fdfc47" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="relative h-0.5 w-10 rounded-full bg-white/25">
                    <motion.span
                        className="absolute -top-1 left-1/2 -ml-1 block h-2.5 w-2.5 rounded-full bg-[#24fe41]"
                        animate={reduce ? undefined : { x: [-16, 16] }}
                        transition={{ ...loop, repeatType: 'reverse', duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
                    />
                </span>
            </span>
        )
    }

    if (kind === 'timing') {
        return (
            <span className="flex h-full w-full items-center justify-center gap-[3px]">
                {[0, 1, 2, 3, 4].map((index) => (
                    <motion.span
                        key={index}
                        className="block h-2 w-2 rounded-full bg-[#fbc2eb]"
                        style={{ marginLeft: index * 1.5 }}
                        animate={reduce ? undefined : { scale: [1, 1.7, 1], opacity: [0.45, 1, 0.45] }}
                        transition={{ ...loop, duration: 1.2, delay: index * 0.12, ease: 'easeInOut' }}
                    />
                ))}
            </span>
        )
    }

    if (kind === 'loop') {
        return (
            <span className="relative grid h-full w-full place-items-center">
                <motion.span
                    className="block h-7 w-7 rounded-md border-2 border-[#7afcff]"
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ ...loop, duration: 2.4, ease: 'linear' }}
                />
                <motion.span
                    className="absolute inset-2"
                    animate={reduce ? undefined : { rotate: -360 }}
                    transition={{ ...loop, duration: 1.6, ease: 'linear' }}
                >
                    <span className="absolute left-1/2 top-0 -ml-1 block h-2 w-2 rounded-full bg-[#ff7eb3]" />
                </motion.span>
            </span>
        )
    }

    if (kind === 'morph') {
        return (
            <span className="grid h-full w-full place-items-center">
                <motion.span
                    className="block h-8 w-8 bg-linear-to-br from-[#fdfc47] to-[#24fe41]"
                    style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                    animate={
                        reduce
                            ? undefined
                            : {
                                  borderRadius: [
                                      '30% 70% 70% 30% / 30% 30% 70% 70%',
                                      '60% 40% 30% 70% / 60% 30% 70% 40%',
                                      '50% 50% 20% 80% / 25% 80% 20% 75%',
                                      '30% 70% 70% 30% / 30% 30% 70% 70%',
                                  ],
                                  rotate: [0, 60, 120, 180],
                              }
                    }
                    transition={{ ...loop, duration: 3.6, ease: 'easeInOut' }}
                />
            </span>
        )
    }

    return (
        <span className="flex h-full w-full items-end justify-center gap-1 pb-4">
            {[0, 1, 2, 3].map((index) => (
                <motion.span
                    key={index}
                    className="block h-7 w-1.5 rounded-full bg-[#a18cd1]"
                    style={{ originY: 1 }}
                    animate={reduce ? undefined : { scaleY: [0.3, 1, 0.3] }}
                    transition={{ ...loop, duration: 1, delay: index * 0.14, ease: 'easeInOut' }}
                />
            ))}
        </span>
    )
}

export function MotionTileLearningOutcomes({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState(tiles[0].id)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#111] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#a18cd1]/25 blur-3xl"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-[#7afcff]/15 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.22em] text-white/70">
                            <span className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-[#ff7eb3] to-[#7afcff]" aria-hidden="true" />
                            Motion Lab · Principles of Motion
                        </p>
                        <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                            Ten weeks. Six new{' '}
                            <span className="bg-linear-to-r from-[#ff7eb3] via-[#fdfc47] to-[#7afcff] bg-clip-text text-transparent">
                                reflexes.
                            </span>
                        </h2>
                    </div>
                    <div className="max-w-xs">
                        <p className="text-sm leading-relaxed text-white/65">
                            Twelve-person cohorts, weekly frame-by-frame feedback and any animation tool with a
                            graph editor. Next cohort 12 Jan 2027 · 18 seats.
                        </p>
                        <a
                            href="#motion-lab-reel"
                            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#111] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                        >
                            <HiOutlinePlay className="h-4 w-4" aria-hidden="true" />
                            Watch the student reel
                        </a>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-3 lg:mt-16">
                    {rows.map((row, rowIndex) => (
                        <ul key={rowIndex} className="flex flex-col gap-3 lg:flex-row">
                            {row.map((tile) => {
                                const isActive = active === tile.id
                                const panelId = `motion-lab-${tile.id}`
                                return (
                                    <li
                                        key={tile.id}
                                        onMouseEnter={() => setActive(tile.id)}
                                        onFocus={() => setActive(tile.id)}
                                        className={cn(
                                            'relative flex min-h-[240px] flex-col overflow-hidden rounded-[28px] p-5 text-[#111] transition-[flex-grow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:p-6 lg:min-h-[330px] lg:basis-0',
                                            tile.gradient,
                                            isActive ? 'lg:grow-[2.2]' : 'lg:grow',
                                        )}
                                    >
                                        <button
                                            type="button"
                                            aria-expanded={isActive}
                                            aria-controls={panelId}
                                            onClick={() => setActive(tile.id)}
                                            className="absolute inset-0 z-10 rounded-[28px] focus-visible:outline-[3px] focus-visible:-outline-offset-[6px] focus-visible:outline-[#111]"
                                        >
                                            <span className="sr-only">{`${tile.title}: show what you’ll make`}</span>
                                        </button>

                                        <div className="flex items-start justify-between gap-3">
                                            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#111] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)]" aria-hidden="true">
                                                <MicroIcon kind={tile.kind} reduce={reduceMotion} />
                                            </span>
                                            <span className="rounded-full bg-[#111]/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#111]">
                                                {tile.weeks}
                                            </span>
                                        </div>

                                        <h3 className="mt-auto pt-8 text-2xl font-black leading-[1.05] tracking-tight text-[#111] sm:text-3xl">
                                            {tile.title}
                                        </h3>
                                        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#111]/80">
                                            {tile.statement}
                                        </p>

                                        <div
                                            id={panelId}
                                            className={cn(
                                                'grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                                                isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                                            )}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="mt-4 rounded-2xl bg-[#111] p-4 text-white">
                                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                                                        You’ll make
                                                    </p>
                                                    <p className="mt-1 text-base font-bold text-white">{tile.make}</p>
                                                    <ul className="mt-3 flex flex-wrap gap-1.5">
                                                        {tile.tags.map((tag) => (
                                                            <li
                                                                key={tag}
                                                                className="rounded-full border border-white/20 px-2.5 py-0.5 font-mono text-[11px] text-white/80"
                                                            >
                                                                {tag}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    ))}
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">
                        6 principles · 9 exercises · 1 title sequence · 40 hours of feedback
                    </p>
                    <a
                        href="#motion-lab-curriculum"
                        className="group/cur inline-flex min-h-10 items-center gap-2 self-start text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:self-auto"
                    >
                        <span className="border-b-2 border-[#ff7eb3] pb-0.5">See the full curriculum</span>
                        <HiArrowLongRight
                            className="h-5 w-5 transition-transform group-hover/cur:translate-x-1"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default MotionTileLearningOutcomes

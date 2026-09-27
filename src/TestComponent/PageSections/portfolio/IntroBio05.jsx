// IdBadgeIntroBio

// IntroBio05 · Portfolios & Personal Websites › Intro / Bio

// Description:
// A conference-lanyard intro for creative technologist Mei Tanaka. An orange lanyard holds a
// Hikari Lab staff badge (photo, "Creative Technologist", ID MT-0427, QR-style code) that
// tilts in 3D under the pointer and flips to show its back. Next to it: the headline "I
// build things you can touch.", a short bio, a Now / Recently / Next list and "Explore my
// work" / "Say hello" CTAs. Use it as the opening section of a creative-coding portfolio.

// Design:
// - #111 background with a faint 48px grid and an orange #ff8a00 glow behind the badge;
//   headline #f4f1ec, muted copy #a3a09b, mono labels in orange
// - Badge 17.5rem → sm:19rem, rounded-[22px], paper #f4f1ec with an orange header band,
//   punched clip slot, mono meta grid and a 25×25 QR-style SVG; the back is #1b1b1b with a
//   magnetic stripe, return address and signature
// - Lanyard: a 1.75rem orange strap printed with vertical "HIKARI LAB" text, running from
//   the top edge to a metal clip; the badge hangs from its top edge (transform-origin top)
// - Motion: spring rotateX/rotateY tilt (±12° / ±16°) plus a holographic sheen that follows
//   the pointer; the flip is a 0.7 s rotateY; reduced motion disables tilt and sheen and
//   makes the flip instant
// - Responsive: badge column above the bio on mobile/tablet, 5 / 7 columns from lg

// What it does:
// - Pointer position over the badge area (mouse and pen) drives motion values for the
//   tilt; leaving the area springs it back to rest
// - "Flip badge" (aria-pressed) toggles the front/back; the hidden face is aria-hidden
// - "Explore my work" links to #work, "Say hello" to #contact; the QR code is decorative
//   and generated from a fixed seed so server and client render the same pattern

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IdBadgeIntroBio from '@/TestComponent/PageSections/portfolio/IntroBio05';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <IdBadgeIntroBio />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { HiArrowRight, HiArrowsRightLeft } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const QR_SIZE = 25

function buildQrPath(seed) {
    let h = 2166136261
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
    const rand = () => {
        h ^= h << 13
        h ^= h >>> 17
        h ^= h << 5
        return ((h >>> 0) % 1000) / 1000
    }
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > QR_SIZE - 9 && y < 8) || (x < 8 && y > QR_SIZE - 9)
    let d = ''
    for (let y = 0; y < QR_SIZE; y += 1) {
        for (let x = 0; x < QR_SIZE; x += 1) {
            if (!inFinder(x, y) && rand() > 0.5) d += `M${x} ${y}h1v1h-1z`
        }
    }
    return d
}

const QR_PATH = buildQrPath('mei.tanaka.works/badge/MT-0427')
const FINDERS = [
    [0, 0],
    [QR_SIZE - 7, 0],
    [0, QR_SIZE - 7],
]

const timeline = [
    { label: 'Now', text: 'Tech lead at Hikari Lab, Kyoto — interactive spaces for museums and brands' },
    { label: 'Recently', text: '“Murmur”, 1,200 LEDs that answer your footsteps · Kyoto Design Week 2026' },
    { label: 'Next', text: 'Artist residency at Werkhalle Nord, Berlin · January 2027' },
]

function QrCode({ className }) {
    return (
        <svg aria-hidden="true" viewBox={`-1 -1 ${QR_SIZE + 2} ${QR_SIZE + 2}`} shapeRendering="crispEdges" className={className}>
            <rect x="-1" y="-1" width={QR_SIZE + 2} height={QR_SIZE + 2} fill="#f4f1ec" />
            <path d={QR_PATH} fill="#111" />
            {FINDERS.map(([x, y]) => (
                <g key={`${x}-${y}`}>
                    <rect x={x} y={y} width="7" height="7" fill="#111" />
                    <rect x={x + 1} y={y + 1} width="5" height="5" fill="#f4f1ec" />
                    <rect x={x + 2} y={y + 2} width="3" height="3" fill="#ff8a00" />
                </g>
            ))}
        </svg>
    )
}

export function IdBadgeIntroBio({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [flipped, setFlipped] = useState(false)

    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const sx = useSpring(mx, { stiffness: 150, damping: 18, mass: 0.6 })
    const sy = useSpring(my, { stiffness: 150, damping: 18, mass: 0.6 })
    const rotateY = useTransform(sx, [-0.5, 0.5], [-16, 16])
    const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12])
    const sheenPos = useTransform(sx, [-0.5, 0.5], ['0% 50%', '100% 50%'])
    const shadowX = useTransform(sx, [-0.5, 0.5], [18, -18])

    const handleMove = (event) => {
        if (reduceMotion || event.pointerType === 'touch') return
        const rect = event.currentTarget.getBoundingClientRect()
        mx.set(Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5)))
        my.set(Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5)))
    }

    const handleLeave = () => {
        mx.set(0)
        my.set(0)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#111] text-base font-normal text-[#f4f1ec] selection:bg-[#ff8a00] selection:text-[#111]',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
            />

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-x-10 gap-y-14 px-4 pb-16 sm:px-6 md:pb-24 lg:grid-cols-12 lg:px-10">
                <div className="relative flex flex-col items-center lg:col-span-5 lg:self-start">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[26rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#ff8a00]/20 blur-[110px]"
                    />

                    <div aria-hidden="true" className="flex flex-col items-center">
                        <div className="relative h-28 w-7 overflow-hidden bg-[#ff8a00] shadow-[inset_-4px_0_0_rgba(0,0,0,0.12)] sm:h-36">
                            <p className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-bold tracking-[0.3em] text-[#111] [writing-mode:vertical-rl]">
                                HIKARI LAB · HIKARI LAB · HIKARI LAB
                            </p>
                        </div>
                        <div className="h-4 w-10 rounded-b-md rounded-t-sm bg-[linear-gradient(180deg,#d9d6d0,#8d8a85)] shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                        <div className="-mt-1 h-6 w-3 rounded-full border-[3px] border-[#b9b5ae]" />
                    </div>

                    <div
                        className="-mt-3 w-full max-w-[26rem] touch-pan-y px-4 pb-6 [perspective:1200px]"
                        onPointerMove={handleMove}
                        onPointerLeave={handleLeave}
                    >
                        <motion.div
                            style={reduceMotion ? undefined : { rotateX, rotateY, transformOrigin: '50% 0%' }}
                            className="relative mx-auto w-[17.5rem] transform-3d sm:w-[19rem]"
                        >
                            <motion.div
                                animate={{ rotateY: flipped ? 180 : 0 }}
                                transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="relative transform-3d"
                            >
                                <div
                                    aria-hidden={flipped}
                                    className="relative overflow-hidden rounded-[22px] bg-[#f4f1ec] text-[#111] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] backface-hidden"
                                >
                                    <div className="relative flex h-16 items-end justify-between bg-[#ff8a00] px-5 pb-3">
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-1/2 top-2.5 h-2.5 w-14 -translate-x-1/2 rounded-full bg-[#111]/85"
                                        />
                                        <span className="flex items-center gap-1.5 font-mono text-[11px] font-black tracking-[0.22em]">
                                            <span aria-hidden="true" className="size-3 rounded-full border-[3px] border-[#111]" />
                                            HIKARI LAB
                                        </span>
                                        <span className="rounded-sm bg-[#111] px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.2em] text-[#ff8a00]">
                                            STAFF
                                        </span>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex gap-4">
                                            <img
                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
                                                alt="Mei Tanaka lit by cool blue light"
                                                className="aspect-[4/5] w-24 shrink-0 rounded-xl object-cover sm:w-28"
                                            />
                                            <div className="flex min-w-0 flex-col">
                                                <p className="font-mono text-[10px] tracking-[0.18em] text-[#111]/55">ID · MT-0427</p>
                                                <p className="mt-2 text-[1.7rem] font-black leading-[0.9] tracking-[-0.03em] text-[#111]">
                                                    Mei
                                                    <br />
                                                    Tanaka
                                                </p>
                                                <p className="mt-2 text-xs font-semibold leading-snug text-[#111]/75">
                                                    Creative Technologist
                                                </p>
                                                <p className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-[#111] px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.16em] text-[#ff8a00]">
                                                    ALL AREAS
                                                </p>
                                            </div>
                                        </div>

                                        <dl className="mt-5 grid grid-cols-3 gap-2 border-y border-dashed border-[#111]/25 py-3 font-mono">
                                            {[
                                                ['Dept', 'R&D'],
                                                ['Base', 'Kyoto'],
                                                ['Valid', '04.28'],
                                            ].map(([k, v]) => (
                                                <div key={k}>
                                                    <dt className="text-[9px] uppercase tracking-[0.2em] text-[#111]/50">{k}</dt>
                                                    <dd className="text-xs font-bold text-[#111]">{v}</dd>
                                                </div>
                                            ))}
                                        </dl>

                                        <div className="mt-4 flex items-end justify-between gap-3">
                                            <div className="min-w-0">
                                                <div aria-hidden="true" className="flex h-7 items-stretch gap-[2px]">
                                                    {[3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 3].map((w, i) => (
                                                        <span key={i} className="bg-[#111]" style={{ width: w }} />
                                                    ))}
                                                </div>
                                                <p className="mt-1.5 truncate font-mono text-[10px] text-[#111]/60">mei.tanaka.works</p>
                                            </div>
                                            <QrCode className="size-[4.5rem] shrink-0 sm:size-20" />
                                        </div>
                                    </div>

                                    {!reduceMotion && (
                                        <motion.span
                                            aria-hidden="true"
                                            style={{ backgroundPosition: sheenPos }}
                                            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.55)_45%,rgba(255,138,0,0.35)_52%,rgba(120,200,255,0.25)_58%,transparent_75%)] bg-[size:250%_100%] mix-blend-soft-light"
                                        />
                                    )}
                                </div>

                                <div
                                    aria-hidden={!flipped}
                                    className="absolute inset-0 flex rotate-y-180 flex-col overflow-hidden rounded-[22px] bg-[#1b1b1b] p-5 text-[#f4f1ec] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] backface-hidden"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-1/2 top-2.5 h-2.5 w-14 -translate-x-1/2 rounded-full bg-[#111]"
                                    />
                                    <div className="-mx-5 mt-8 h-10 bg-[#050505]" />
                                    <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff8a00]">
                                        If found, please return to
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-[#f4f1ec]/85">
                                        Hikari Lab, 3-14 Kiyamachi-dori,
                                        <br />
                                        Nakagyo-ku, Kyoto 604-8017
                                    </p>
                                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff8a00]">
                                        Access notes
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-[#f4f1ec]/85">
                                        Studio B after 22:00 — bring snacks, not questions.
                                    </p>
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 160 40"
                                        fill="none"
                                        className="mt-auto h-10 w-36 text-[#f4f1ec]/80"
                                    >
                                        <path
                                            d="M4 30 C 14 6, 22 6, 20 30 C 26 12, 34 10, 34 28 C 40 18, 46 16, 50 26 C 56 20, 60 22, 62 28 M 70 12 L 70 32 M 62 14 C 70 12, 80 12, 86 14 M 92 30 C 100 18, 112 18, 118 26 C 126 34, 138 20, 154 18"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <p className="mt-2 border-t border-[#f4f1ec]/15 pt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[#f4f1ec]/45">
                                        Property of Hikari Lab · not a travel document
                                    </p>
                                </div>
                            </motion.div>

                            {!reduceMotion && (
                                <motion.span
                                    aria-hidden="true"
                                    style={{ x: shadowX }}
                                    className="pointer-events-none absolute -bottom-8 left-1/2 -z-10 h-6 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/60 blur-xl"
                                />
                            )}
                        </motion.div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <button
                            type="button"
                            aria-pressed={flipped}
                            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#f4f1ec]/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#f4f1ec] transition-colors hover:border-[#ff8a00] hover:text-[#ff8a00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a00]"
                            onClick={() => setFlipped((v) => !v)}
                        >
                            <HiArrowsRightLeft aria-hidden="true" className="size-4" />
                            {flipped ? 'Show front' : 'Flip badge'}
                        </button>
                        <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[#a3a09b] md:block">
                            Hover to tilt the badge
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-7 lg:pt-24">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#ff8a00]">
                        Creative technologist — Kyoto ↔ Berlin
                    </p>
                    <h2 className="mt-6 text-[2.6rem] font-black leading-[0.95] tracking-[-0.04em] text-[#f4f1ec] sm:text-6xl xl:text-[5.25rem]">
                        I build things you can{' '}
                        <span className="text-[#ff8a00]">touch.</span>
                    </h2>
                    <p className="mt-7 max-w-xl text-base leading-relaxed text-[#a3a09b] md:text-lg">
                        I&apos;m Mei Tanaka — I prototype with TouchDesigner, Three.js and a soldering iron,
                        and I&apos;m happiest when a room full of strangers starts playing with something I
                        made. Eight years across light installations, museum interactives and the web.
                    </p>

                    <dl className="mt-10 max-w-2xl divide-y divide-[#f4f1ec]/10 border-y border-[#f4f1ec]/10">
                        {timeline.map((row) => (
                            <div key={row.label} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
                                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff8a00]">
                                    {row.label}
                                </dt>
                                <dd className="text-sm leading-relaxed text-[#f4f1ec]/85 md:text-base">{row.text}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="#work"
                            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#ff8a00] px-7 text-sm font-bold text-[#111] transition-colors hover:bg-[#ffa133] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a00]"
                        >
                            Explore my work
                            <HiArrowRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#f4f1ec]/25 px-7 text-sm font-bold text-[#f4f1ec] transition-colors hover:border-[#f4f1ec] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a00]"
                        >
                            Say hello
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default IdBadgeIntroBio

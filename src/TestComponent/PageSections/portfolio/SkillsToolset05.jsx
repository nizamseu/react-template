// StackMarqueeSkillsToolset

// SkillsToolset05 · Portfolios & Personal Websites › Skills & Toolset

// Description:
// A notebook-page skills section for illustrator Sam Okafor. On lined paper with a red
// margin, the italic heading "What’s in my pencil case" gets a red-pen underline, then two
// marquee rows drift in opposite directions: digital apps as hand-bordered stickers (with
// Simple Icons logos) and analogue tools as strips of washi tape. Below, a "Desert-island
// five" list opens hand-written notes on why each favourite earns its place, next to a
// taped desk photo. Use it on an illustrator's or artist's portfolio.

// Design:
// - Paper #fffdf6 with 32px pale-blue #d9e5f4 rules, a double red #e2554f margin line and
//   punched holes; all text in ballpoint blue #2340a0, font-serif italic for headings
// - Sticker chips use a wobbly hand-drawn border radius, 2px ink border and alternating
//   ±1–2° tilt; tape chips use pastel fills with a torn clip-path edge and lucide icons
// - Favourites: big italic numerals that get a red scribble circle (SVG path drawn with
//   pathLength) when opened; notes slide open with a ↳ arrow; polaroid photo held by tape,
//   plus a tilted yellow sticky note
// - Motion: rows move at 38 and 30 px/s; underline and circles draw in; reduced motion
//   turns the marquees into wrapped static rows and removes drawing/sliding
// - Responsive: margin line and gutter grow at sm / lg; favourites and photo sit side by
//   side from lg (7 / 5 cols), stacked below

// What it does:
// - Each marquee row runs on useAnimationFrame + a motion value, wraps seamlessly over a
//   duplicated (aria-hidden) track, pauses while hovered, and stops for "Pause the drift"
//   (aria-pressed) or reduced motion
// - open (favourite id, default "brush") toggles one note at a time; buttons expose
//   aria-expanded / aria-controls
// - "Commission a drawing" links to #sam-commissions; the photo loads lazily

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StackMarqueeSkillsToolset from '@/TestComponent/PageSections/portfolio/SkillsToolset05';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <StackMarqueeSkillsToolset />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import {
    LuBrush,
    LuDroplets,
    LuEraser,
    LuLamp,
    LuNotebookPen,
    LuPalette,
    LuPause,
    LuPenTool,
    LuPencil,
    LuPlay,
    LuPrinter,
    LuScanLine,
    LuScissors,
} from 'react-icons/lu';
import {
    SiAdobeaftereffects,
    SiAdobeillustrator,
    SiAdobeindesign,
    SiAdobephotoshop,
    SiAffinitydesigner,
    SiAffinityphoto,
    SiAseprite,
    SiBlender,
    SiFigma,
    SiInkscape,
    SiKrita,
} from 'react-icons/si';
import { cn } from '@/design-system/lib/cn';

const digital = [
    { name: 'Photoshop', Icon: SiAdobephotoshop, since: '’12' },
    { name: 'Illustrator', Icon: SiAdobeillustrator, since: '’13' },
    { name: 'InDesign', Icon: SiAdobeindesign, since: '’15' },
    { name: 'Krita', Icon: SiKrita, since: '’19' },
    { name: 'Affinity Designer', Icon: SiAffinitydesigner, since: '’20' },
    { name: 'Affinity Photo', Icon: SiAffinityphoto, since: '’20' },
    { name: 'Inkscape', Icon: SiInkscape, since: '’16' },
    { name: 'Aseprite', Icon: SiAseprite, since: '’21' },
    { name: 'Blender', Icon: SiBlender, since: '’22' },
    { name: 'Figma', Icon: SiFigma, since: '’18' },
    { name: 'After Effects', Icon: SiAdobeaftereffects, since: '’17' },
]

const analogue = [
    { name: 'Brush pens', Icon: LuBrush },
    { name: 'Blue pencil', Icon: LuPencil },
    { name: 'Gouache', Icon: LuPalette },
    { name: 'Dip pen & India ink', Icon: LuPenTool },
    { name: 'Risograph', Icon: LuPrinter },
    { name: 'Scalpel & cutting mat', Icon: LuScissors },
    { name: 'Kneaded eraser', Icon: LuEraser },
    { name: 'Lightbox', Icon: LuLamp },
    { name: 'Watercolour', Icon: LuDroplets },
    { name: 'A5 sketchbook', Icon: LuNotebookPen },
    { name: 'Flatbed scanner', Icon: LuScanLine },
]

const favourites = [
    {
        id: 'brush',
        name: 'Pocket brush pen',
        kind: 'ink',
        why: 'Every line in Moth & Moon was inked with one. The nib has a pulse: press harder and the line gets braver.',
    },
    {
        id: 'pencil',
        name: 'Non-photo blue pencil',
        kind: 'roughs',
        why: 'Roughs only. The scanner ignores blue, so I can be as messy as I like underneath the ink.',
    },
    {
        id: 'tablet',
        name: 'A tablet on the night bus',
        kind: 'colour',
        why: 'Flats and textures on the commute, with one grain brush I have been tuning for three years.',
    },
    {
        id: 'riso',
        name: 'Risograph at Inkhouse Press',
        kind: 'print',
        why: 'Two-colour zines, fluorescent pink over teal, and the small joy of slightly wrong registration.',
    },
    {
        id: 'gouache',
        name: 'Twelve tubes of gouache',
        kind: 'paint',
        why: 'Covers for the Lantern Books series are painted flat, scanned at 1200 dpi, then barely touched.',
    },
]

const tilts = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2']
const tapes = ['bg-[#fbe6a2]/90', 'bg-[#f8cfd0]/90', 'bg-[#cfe8d5]/90', 'bg-[#d4e2fb]/90']
const WOBBLY = 'rounded-[255px_15px_225px_15px/15px_225px_15px_255px]'
const TORN = '[clip-path:polygon(0_10%,3%_0,50%_6%,97%_0,100%_12%,98%_50%,100%_90%,96%_100%,50%_94%,4%_100%,0_88%,2%_50%)]'

function Sticker({ item, index }) {
    const Icon = item.Icon
    return (
        <span
            className={cn(
                'inline-flex items-center gap-2.5 whitespace-nowrap border-2 border-[#2340a0] bg-[#fffdf6] px-4 py-2.5 text-[#2340a0] shadow-[2px_3px_0_rgba(35,64,160,0.18)]',
                WOBBLY,
                tilts[index % tilts.length],
            )}
        >
            <Icon aria-hidden="true" className="size-5" />
            <span className="font-serif text-lg italic">{item.name}</span>
            <span className="font-mono text-[11px] text-[#2340a0]/60">{item.since}</span>
        </span>
    )
}

function Tape({ item, index }) {
    const Icon = item.Icon
    return (
        <span
            className={cn(
                'inline-flex items-center gap-2.5 whitespace-nowrap px-6 py-3 text-[#2340a0]',
                TORN,
                tapes[index % tapes.length],
                tilts[(index + 1) % tilts.length],
            )}
        >
            <Icon aria-hidden="true" className="size-5" />
            <span className="text-base font-medium">{item.name}</span>
        </span>
    )
}

function MarqueeRow({ items, direction, speed, stopped, reduceMotion, label, Chip }) {
    const x = useMotionValue(0)
    const trackRef = useRef(null)
    const hoverRef = useRef(false)

    useAnimationFrame((_, delta) => {
        if (stopped || hoverRef.current) return
        const track = trackRef.current
        if (!track) return
        const half = track.scrollWidth / 2
        if (!half) return
        let next = x.get() - (direction * speed * Math.min(delta, 64)) / 1000
        if (next <= -half) next += half
        if (next > 0) next -= half
        x.set(next)
    })

    if (reduceMotion) {
        return (
            <ul aria-label={label} className="flex flex-wrap gap-x-4 gap-y-5 px-4 py-3 sm:px-8">
                {items.map((item, index) => (
                    <li key={item.name}>
                        <Chip item={item} index={index} />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div
            className="overflow-hidden py-3"
            onPointerEnter={() => {
                hoverRef.current = true
            }}
            onPointerLeave={() => {
                hoverRef.current = false
            }}
        >
            <motion.div ref={trackRef} style={{ x }} className="flex w-max">
                {[0, 1].map((copy) => (
                    <ul
                        key={copy}
                        aria-label={copy === 0 ? label : undefined}
                        aria-hidden={copy === 1 ? true : undefined}
                        className="flex shrink-0 items-center gap-4 pr-4"
                    >
                        {items.map((item, index) => (
                            <li key={item.name}>
                                <Chip item={item} index={index} />
                            </li>
                        ))}
                    </ul>
                ))}
            </motion.div>
        </div>
    )
}

export function StackMarqueeSkillsToolset({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [paused, setPaused] = useState(false)
    const [open, setOpen] = useState('brush')
    const stopped = paused || Boolean(reduceMotion)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#fffdf6] text-base font-normal text-[#2340a0]', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_31px,#d9e5f4_31px,#d9e5f4_32px)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-10 w-[5px] border-x border-[#e2554f]/60 sm:left-24 lg:left-36"
            />
            {['top-[14%]', 'top-1/2', 'top-[86%]'].map((top) => (
                <span
                    key={top}
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute left-3 size-4 -translate-y-1/2 rounded-full bg-[#ebe5d6] shadow-[inset_1px_2px_3px_rgba(0,0,0,0.18)] sm:left-8 sm:size-5 lg:left-12',
                        top,
                    )}
                />
            ))}

            <div className="relative py-16 md:py-24">
                <div className="pl-16 pr-4 sm:pl-32 sm:pr-10 lg:pl-44 lg:pr-16">
                    <p className="font-serif text-lg italic leading-8 text-[#2340a0]/70">— the kit, page 14</p>
                    <h2 className="mt-2 max-w-4xl font-serif text-4xl font-normal italic leading-[1.15] text-[#2340a0] sm:text-6xl lg:text-7xl">
                        What’s in my{' '}
                        <span className="relative inline-block whitespace-nowrap">
                            pencil case
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 300 18"
                                preserveAspectRatio="none"
                                className="absolute -bottom-2 left-0 h-3 w-full overflow-visible sm:-bottom-3 sm:h-4"
                            >
                                <motion.path
                                    d="M3 12 C 50 4, 95 15, 150 9 S 240 3, 297 10"
                                    fill="none"
                                    stroke="#e2554f"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    initial={{ pathLength: reduceMotion ? 1 : 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: 0.2, ease: 'easeInOut' }}
                                />
                            </svg>
                        </span>
                    </h2>
                    <p className="mt-8 max-w-xl text-base leading-8 text-[#2340a0]/85">
                        Half of it runs on batteries, half of it smells of turpentine. I sketch on paper, ink
                        by hand, then colour and lay out on screen for books, posters and the odd album sleeve.
                    </p>
                </div>

                <div className="mt-12 space-y-4">
                    <MarqueeRow
                        items={digital}
                        direction={1}
                        speed={38}
                        stopped={stopped}
                        reduceMotion={reduceMotion}
                        label="Digital tools"
                        Chip={Sticker}
                    />
                    <MarqueeRow
                        items={analogue}
                        direction={-1}
                        speed={30}
                        stopped={stopped}
                        reduceMotion={reduceMotion}
                        label="Analogue tools"
                        Chip={Tape}
                    />
                </div>

                <div className="pl-16 pr-4 sm:pl-32 sm:pr-10 lg:pl-44 lg:pr-16">
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <p className="font-serif text-base italic leading-8 text-[#2340a0]/65">
                            ↑ screens on top, paper underneath (hover to hold still)
                        </p>
                        {!reduceMotion && (
                            <button
                                type="button"
                                aria-pressed={paused}
                                className={cn(
                                    'inline-flex min-h-10 items-center gap-2 border-2 border-[#2340a0] px-4 text-sm font-medium text-[#2340a0] transition-colors duration-200 hover:bg-[#2340a0] hover:text-[#fffdf6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e2554f]',
                                    WOBBLY,
                                )}
                                onClick={() => setPaused((p) => !p)}
                            >
                                {paused ? <LuPlay aria-hidden="true" className="size-4" /> : <LuPause aria-hidden="true" className="size-4" />}
                                {paused ? 'Let it drift' : 'Pause the drift'}
                            </button>
                        )}
                    </div>

                    <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-7">
                            <h3 className="flex items-center gap-3 font-serif text-3xl font-normal italic leading-10 text-[#2340a0] sm:text-4xl">
                                Desert-island five
                                <svg aria-hidden="true" viewBox="0 0 40 40" className="size-8 text-[#e2554f]">
                                    <path
                                        d="M20 4 L24 15 L36 15 L26 22 L30 34 L20 27 L10 34 L14 22 L4 15 L16 15 Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </h3>
                            <p className="font-serif text-base italic leading-8 text-[#2340a0]/65">
                                (tap one and I’ll tell you why)
                            </p>
                            <ol className="mt-4">
                                {favourites.map((fav, index) => {
                                    const isOpen = open === fav.id
                                    const panelId = `sam-fav-${fav.id}`
                                    return (
                                        <li key={fav.id} className="border-b border-dashed border-[#2340a0]/25">
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                                className="group flex min-h-16 w-full items-center gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2554f]"
                                                onClick={() => setOpen(isOpen ? null : fav.id)}
                                            >
                                                <span className="relative grid size-12 shrink-0 place-items-center font-serif text-3xl italic text-[#2340a0]">
                                                    {index + 1}
                                                    <svg
                                                        aria-hidden="true"
                                                        viewBox="0 0 58 50"
                                                        className="pointer-events-none absolute -inset-1 size-14 overflow-visible"
                                                    >
                                                        <motion.path
                                                            d="M31 5 C 13 4, 3 16, 5 28 C 7 41, 22 47, 35 44 C 48 41, 56 30, 53 18 C 50 8, 38 3, 24 7"
                                                            fill="none"
                                                            stroke="#e2554f"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            initial={false}
                                                            animate={{ pathLength: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                                                            transition={{ duration: reduceMotion ? 0 : 0.5, ease: 'easeInOut' }}
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="min-w-0 flex-1 font-serif text-xl leading-8 text-[#2340a0] decoration-[#e2554f] decoration-2 underline-offset-4 group-hover:underline sm:text-2xl">
                                                    {fav.name}
                                                </span>
                                                <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-[#2340a0]/55 sm:inline">
                                                    {fav.kind}
                                                </span>
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        id={panelId}
                                                        key="note"
                                                        initial={{ height: reduceMotion ? 'auto' : 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: reduceMotion ? 'auto' : 0, opacity: 0 }}
                                                        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="pb-4 pl-16 font-serif text-lg italic leading-8 text-[#2340a0]/85">
                                                            <span aria-hidden="true" className="mr-2 not-italic text-[#e2554f]">↳</span>
                                                            {fav.why}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    )
                                })}
                            </ol>
                        </div>

                        <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:mt-6">
                            <figure className="relative rotate-2 bg-white p-3 pb-4 shadow-[0_2px_4px_rgba(0,0,0,0.08),0_22px_40px_-18px_rgba(35,64,160,0.45)]">
                                <span
                                    aria-hidden="true"
                                    className="absolute -top-4 left-1/2 h-8 w-28 -translate-x-1/2 -rotate-3 bg-[#fbe6a2]/80 shadow-sm"
                                />
                                <div className="aspect-[4/5] overflow-hidden bg-[#ece6d8]">
                                    <img
                                        src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
                                        alt="Close-up of a fountain pen writing on paper"
                                        loading="lazy"
                                        className="size-full object-cover"
                                    />
                                </div>
                                <figcaption className="mt-3 font-serif text-lg italic leading-snug text-[#2340a0]">
                                    Tue, 11:40pm, inking page 32 of Moth &amp; Moon
                                </figcaption>
                            </figure>
                            <div className="relative -mt-8 ml-auto w-52 -rotate-6 bg-[#fdf0a6] p-4 shadow-[0_14px_24px_-14px_rgba(0,0,0,0.35)] sm:-mr-6">
                                <p className="font-serif text-base italic leading-6 text-[#2340a0]">
                                    Currently refilling: 3 brush pens, 1 bottle of ink, 0 patience.
                                </p>
                            </div>
                        </div>
                    </div>

                    <a
                        href="#sam-commissions"
                        className="group mt-14 inline-flex min-h-11 items-center gap-3 font-serif text-2xl italic text-[#2340a0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e2554f]"
                    >
                        <span className="underline decoration-[#e2554f] decoration-2 underline-offset-8">Commission a drawing</span>
                        <HiArrowLongRight
                            aria-hidden="true"
                            className="size-6 transition-transform duration-300 group-hover:translate-x-1.5"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default StackMarqueeSkillsToolset

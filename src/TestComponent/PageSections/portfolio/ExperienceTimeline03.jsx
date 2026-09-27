// ScrollRailExperienceTimeline

// ExperienceTimeline03 · Portfolios & Personal Websites › Experience & Education Timeline

// Description:
// A horizontal, scroll-snapping career rail for creative technologist Mei Tanaka. Under
// the heading "A decade of making rooms react." a year rail (2014 → 2025) sits above seven
// photo cards: art school in Kyoto, Hikari Interactive, a residency at Oddfellow Labs, the
// Shiokaze Science Museum, Lumen Garden Studio, a Prism Media Award and her own Studio
// Orenji. An orange progress line tracks the scroll. Use it to tell a career story on an
// interactive-studio or creative-coding portfolio.

// Design:
// - #111111 page, #f5f5f4 text, orange #ff8a00 for the progress line, active year, card
//   border and outlined year numerals (-webkit-text-stroke); cards are #1a1a1a with
//   rounded-[28px], 16:10 photos that are greyscale until the card is active or hovered
// - Year rail: hairline track with evenly spaced year buttons; the orange line scales
//   with horizontal scroll progress and the active year gets a filled dot
// - Scroller: full-bleed, snap-x mandatory, hidden scrollbar, padding aligned to the 80rem
//   container; cards are 82vw (max 360px) → sm 400px → lg 420px
// - Header: grotesk heading (text-5xl → lg:text-7xl) with prev/next circle buttons and a
//   mono "03 / 07" counter; below md the buttons move under the heading
// - Reduced motion: programmatic scrolling jumps instead of smooth-scrolling

// What it does:
// - useScroll({ container }) gives scrollXProgress for the progress line; a rAF-throttled
//   scroll handler works out the active card (nearest to the snap edge, last at the end)
// - Prev / next, year buttons and ← / → keys on the focused rail scroll to a card by its
//   offset; buttons disable at the ends; the counter is announced via aria-live
// - Each card's "Case notes" links to #mei-<id>; photos load lazily

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ScrollRailExperienceTimeline from '@/TestComponent/PageSections/portfolio/ExperienceTimeline03';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <ScrollRailExperienceTimeline />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const stops = [
    {
        id: 'kamo',
        year: '2014',
        kind: 'Education',
        role: 'BA Media Design',
        org: 'Kamo Institute of Media Arts',
        place: 'Kyoto',
        text: 'Four years between the print studio and the electronics lab. Graduation piece: a paper lantern that dims when you whisper.',
        tags: ['Processing', 'Arduino', 'Letterpress'],
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
        alt: 'Student walking down a long library aisle between tall shelves',
    },
    {
        id: 'hikari',
        year: '2016',
        kind: 'Work',
        role: 'Junior Interactive Developer',
        org: 'Hikari Interactive',
        place: 'Tokyo',
        text: 'Built touch walls and motion-tracked window displays for department-store launches in Shibuya and Ginza.',
        tags: ['openFrameworks', 'Kinect', 'Node.js'],
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        alt: 'Tokyo street at night glowing with neon signs',
    },
    {
        id: 'oddfellow',
        year: '2018',
        kind: 'Residency',
        role: 'Artist in Residence',
        org: 'Oddfellow Labs',
        place: 'Rotterdam',
        text: 'Six months building custom circuit boards for “Murmur”, a ceiling of 300 fabric petals that ripple with footsteps.',
        tags: ['PCB design', 'Servo control', 'C++'],
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        alt: 'Close-up of a green circuit board with chips and traces',
    },
    {
        id: 'shiokaze',
        year: '2019',
        kind: 'Work',
        role: 'Creative Technologist',
        org: 'Shiokaze Science Museum',
        place: 'Osaka',
        text: 'Led 11 permanent exhibits, including a VR tide-pool dive that 410,000 visitors have taken so far.',
        tags: ['Unity', 'VR', 'Raspberry Pi'],
        image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80',
        alt: 'Visitor wearing a virtual reality headset in a dark room',
    },
    {
        id: 'lumen',
        year: '2021',
        kind: 'Work',
        role: 'Senior Creative Technologist',
        org: 'Lumen Garden Studio',
        place: 'Kyoto',
        text: 'Real-time light shows for festivals and brand launches: 40,000 reactive petals, 18 projectors, one laptop backstage.',
        tags: ['Three.js', 'GLSL', 'DMX'],
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        alt: 'Festival crowd lit by colourful stage lights',
    },
    {
        id: 'prism',
        year: '2023',
        kind: 'Award',
        role: 'Gold, Interactive Installation',
        org: 'Prism Media Awards',
        place: 'Seoul',
        text: '“Tidal Choir”: 64 pressure pads along a wooden pier that sing with the waves. Also shortlisted for the audience prize.',
        tags: ['Sound', 'Sensors', 'Public space'],
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
        alt: 'Performer on a smoky stage under a spotlight',
    },
    {
        id: 'orenji',
        year: '2025',
        kind: 'Founder',
        role: 'Founder & Lead Technologist',
        org: 'Studio Orenji',
        place: 'Kyoto · remote',
        text: 'A four-person studio making rooms, stages and screens that react to people. Now booking installations for 2027.',
        tags: ['Studio lead', 'Installations', 'R&D'],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        alt: 'Laptop on a desk lit by purple neon light',
    },
]

export function ScrollRailExperienceTimeline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const scrollerRef = useRef(null)
    const rafRef = useRef(0)
    const [active, setActive] = useState(0)
    const { scrollXProgress } = useScroll({ container: scrollerRef })

    useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

    const measure = () => {
        const el = scrollerRef.current
        if (!el) return
        const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
        const max = el.scrollWidth - el.clientWidth
        if (max > 0 && el.scrollLeft >= max - 4) {
            setActive(stops.length - 1)
            return
        }
        let best = 0
        let bestDist = Infinity
        Array.from(el.children).forEach((child, i) => {
            const dist = Math.abs(child.offsetLeft - pad - el.scrollLeft)
            if (dist < bestDist) {
                bestDist = dist
                best = i
            }
        })
        setActive(best)
    }

    const onScroll = () => {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(measure)
    }

    const goTo = (index) => {
        const el = scrollerRef.current
        if (!el) return
        const clamped = Math.max(0, Math.min(stops.length - 1, index))
        const child = el.children[clamped]
        if (!child) return
        const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
        el.scrollTo({ left: child.offsetLeft - pad, behavior: reduceMotion ? 'auto' : 'smooth' })
        setActive(clamped)
    }

    const onKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault()
            goTo(active + 1)
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault()
            goTo(active - 1)
        }
    }

    const navButton =
        'grid size-12 place-items-center rounded-full border border-white/20 text-[#f5f5f4] transition-colors duration-200 hover:border-[#ff8a00] hover:bg-[#ff8a00] hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00] disabled:pointer-events-none disabled:opacity-30'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#111111] py-16 text-base font-normal text-[#f5f5f4] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-white/60">
                            <span className="size-2 bg-[#ff8a00]" aria-hidden="true" />
                            Mei Tanaka · Timeline 2014 → 2026
                        </p>
                        <h2 className="mt-6 font-sans text-5xl font-bold leading-[0.95] tracking-tight text-[#f5f5f4] sm:text-6xl lg:text-7xl">
                            A decade of making <span className="text-[#ff8a00]">rooms react.</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <p aria-live="polite" className="font-mono text-sm tabular-nums text-white/60">
                            <span className="text-[#f5f5f4]">{String(active + 1).padStart(2, '0')}</span> /{' '}
                            {String(stops.length).padStart(2, '0')}
                            <span className="sr-only">: {stops[active].year}, {stops[active].org}</span>
                        </p>
                        <button
                            type="button"
                            aria-label="Previous stop"
                            disabled={active === 0}
                            className={navButton}
                            onClick={() => goTo(active - 1)}
                        >
                            <HiArrowLeft aria-hidden="true" className="size-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next stop"
                            disabled={active === stops.length - 1}
                            className={navButton}
                            onClick={() => goTo(active + 1)}
                        >
                            <HiArrowRight aria-hidden="true" className="size-5" />
                        </button>
                    </div>
                </div>

                <div className="relative mt-12">
                    <div aria-hidden="true" className="absolute inset-x-0 top-[7px] h-px bg-white/15" />
                    <motion.div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-[6px] h-[3px] origin-left bg-[#ff8a00]"
                        style={{ scaleX: scrollXProgress }}
                    />
                    <ol className="relative flex justify-between" aria-label="Jump to year">
                        {stops.map((stop, index) => {
                            const on = index === active
                            const passed = index <= active
                            return (
                                <li key={stop.id} className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        aria-current={on ? 'step' : undefined}
                                        aria-label={`${stop.year}: ${stop.org}`}
                                        className="group flex min-h-10 min-w-10 flex-col items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]"
                                        onClick={() => goTo(index)}
                                    >
                                        <span
                                            className={cn(
                                                'size-4 rounded-full border-2 transition-colors duration-300',
                                                on
                                                    ? 'border-[#ff8a00] bg-[#ff8a00] shadow-[0_0_0_5px_rgba(255,138,0,0.2)]'
                                                    : passed
                                                      ? 'border-[#ff8a00] bg-[#111111]'
                                                      : 'border-white/30 bg-[#111111] group-hover:border-white/70',
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                'font-mono text-[11px] tabular-nums transition-colors duration-300 sm:text-xs',
                                                on ? 'text-[#ff8a00]' : 'text-white/50 group-hover:text-white/80',
                                            )}
                                        >
                                            <span className="sm:hidden">’{stop.year.slice(2)}</span>
                                            <span className="hidden sm:inline">{stop.year}</span>
                                        </span>
                                    </button>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>

            <ol
                ref={scrollerRef}
                tabIndex={0}
                aria-label="Career stops, use left and right arrow keys to move"
                className="relative mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff8a00] sm:gap-6 sm:scroll-px-6 sm:px-6 lg:scroll-px-[max(2rem,calc((100vw_-_80rem)/2_+_2rem))] lg:px-[max(2rem,calc((100vw_-_80rem)/2_+_2rem))] [&::-webkit-scrollbar]:hidden"
                onScroll={onScroll}
                onKeyDown={onKeyDown}
            >
                {stops.map((stop, index) => {
                    const on = index === active
                    return (
                        <li
                            key={stop.id}
                            className={cn(
                                'group w-[82vw] max-w-[360px] shrink-0 snap-start overflow-hidden rounded-[28px] border bg-[#1a1a1a] transition-colors duration-500 sm:w-[400px] sm:max-w-none lg:w-[420px]',
                                on ? 'border-[#ff8a00]' : 'border-white/10 hover:border-white/25',
                            )}
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                    src={stop.image}
                                    alt={stop.alt}
                                    loading="lazy"
                                    className={cn(
                                        'size-full object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                        on ? 'scale-100 grayscale-0' : 'scale-105 grayscale group-hover:grayscale-0',
                                    )}
                                />
                                <span className="absolute left-4 top-4 rounded-full bg-[#111111]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f5f4] backdrop-blur">
                                    {stop.kind}
                                </span>
                            </div>
                            <div className="p-6 sm:p-7">
                                <div className="flex items-end justify-between gap-4">
                                    <p
                                        className={cn(
                                            'font-sans text-6xl font-bold leading-none tracking-tighter text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_#ff8a00]',
                                            on && 'text-[#ff8a00]',
                                        )}
                                    >
                                        {stop.year}
                                    </p>
                                    <p className="pb-1 text-right font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                                        {stop.place}
                                    </p>
                                </div>
                                <h3 className="mt-5 text-xl font-semibold leading-snug text-[#f5f5f4] sm:text-2xl">
                                    {stop.role}
                                </h3>
                                <p className="mt-1 text-sm font-medium text-[#ff8a00]">{stop.org}</p>
                                <p className="mt-4 text-sm leading-relaxed text-white/70">{stop.text}</p>
                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                    <ul className="flex flex-wrap gap-1.5" aria-label="Tools and themes">
                                        {stop.tags.map((tag) => (
                                            <li
                                                key={tag}
                                                className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] text-white/70"
                                            >
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={`#mei-${stop.id}`}
                                        className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#f5f5f4] hover:text-[#ff8a00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]"
                                    >
                                        Case notes
                                        <HiArrowUpRight aria-hidden="true" className="size-4" />
                                    </a>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ol>

            <p className="mx-auto mt-6 max-w-7xl px-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40 sm:px-6 lg:px-8">
                Swipe, scroll or use ← → on the rail
            </p>
        </section>
    )
}

export default ScrollRailExperienceTimeline

// DoubleMarqueeTestimonials

// Testimonials03 · Portfolios & Personal Websites › Testimonials / Recommendations

// Description:
// A loud, kinetic testimonial band for creative technologist Mei Tanaka. The heading "Nice
// things, on repeat." sits above two endless rows of short quotes from curators, producers
// and engineers that glide in opposite directions, followed by a stat strip ("41
// collaborators", "9 countries") and a "Work with Mei" call to action. Use it between
// project sections of a bold, dark portfolio where quotes should feel alive but brief.

// Design:
// - Two full-bleed marquee rows (top drifts left, bottom drifts right) with cards
//   w-[280px] → sm:w-[360px]; edge fades from #111111 cover both ends
// - #111111 background, off-white #f4f1ec text, orange #ff8a00 accents and a soft orange
//   glow top-right; cards rotate through three styles: graphite #1b1b1b, solid orange with
//   #111111 text, and an orange outline
// - Heavy sans display heading (text-5xl → lg:text-8xl, font-black, tracking-tighter), mono
//   eyebrow and stats, rounded-[22px] cards with 40px round avatars
// - Motion: framer-motion useAnimationFrame moves a percentage motion value so the doubled
//   track loops seamlessly; reduced motion swaps the rows for a static grid
// - Responsive: base header stacks and the grid fallback is one column; sm 2 columns; md
//   header splits into heading + intro; lg 3-column fallback grid and larger type

// What it does:
// - Each row pauses while hovered (pointer enter/leave); the "Pause quotes" button
//   (aria-pressed) stops both rows until pressed again, and rows also stop when the
//   section is scrolled out of view (useInView)
// - The duplicated half of each track is aria-hidden so every quote is read once
// - "Work with Mei" links to #contact and "All 41 testimonials" to #testimonials

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DoubleMarqueeTestimonials from '@/TestComponent/PageSections/portfolio/Testimonials03';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <DoubleMarqueeTestimonials />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowUpRight, HiPause, HiPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const topRow = [
    {
        id: 'jun',
        quote: 'Mei made a museum wall react to breath. Kids queued for forty minutes to fog it.',
        name: 'Jun Park',
        role: 'Curator, Hanami Science Museum',
        avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'lena',
        quote: 'Shipped a WebGL launch site in nine days. It ran at 60 fps on my four-year-old phone.',
        name: 'Lena Vogt',
        role: 'Brand Lead, Kōbō Audio',
        avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'ade',
        quote: 'The only technologist who asks what it should feel like before what it should do.',
        name: 'Ade Bakare',
        role: 'Executive Creative Director, Field & Signal',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'ines',
        quote: '38,000 visitors, eleven days, zero crashes. Mei slept fine. I didn’t, but that’s on me.',
        name: 'Ines Duarte',
        role: 'Producer, Lumen Days Festival',
        avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'kenji',
        quote: 'She prototypes in an afternoon what agencies quote us six weeks for.',
        name: 'Kenji Mori',
        role: 'Founder, Tiny Orbit Games',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    },
]

const bottomRow = [
    {
        id: 'sofia',
        quote: 'Mei’s creative-code reviews are the best hour of my week.',
        name: 'Sofia Brandt',
        role: 'Creative Engineer, Field & Signal',
        avatar: 'https://images.unsplash.com/photo-1614644147724-2d4785d69962?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'omar',
        quote: 'She turned our track-sensor data into a light sculpture that commuters stop to hug.',
        name: 'Omar Haddad',
        role: 'Head of Innovation, Northline Rail',
        avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'clara',
        quote: 'Every prototype arrives with a README. Every. Single. One.',
        name: 'Clara Nguyen',
        role: 'Producer, Studio Paperplane',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'mateo',
        quote: 'Calm on install day — the highest compliment in our trade.',
        name: 'Mateo Reyes',
        role: 'Technical Director, Casa Eco Pavilion',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'yuki',
        quote: 'Ask Mei for one idea and you get three — plus a working demo of the best one.',
        name: 'Yuki Sato',
        role: 'Creative Director, Pixel & Rice',
        avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=400&q=80',
    },
]

const cardStyles = [
    'bg-[#1b1b1b] text-[#f4f1ec] ring-1 ring-white/10',
    'bg-[#ff8a00] text-[#111111]',
    'bg-transparent text-[#f4f1ec] ring-1 ring-[#ff8a00]/45',
]

const stats = [
    { value: '41', label: 'collaborators' },
    { value: '9', label: 'countries' },
    { value: '0', label: 'crashed installs' },
]

function QuoteCard({ item, tone, fluid = false }) {
    const orange = tone === 1
    return (
        <figure
            className={cn(
                'flex h-full shrink-0 flex-col justify-between gap-6 rounded-[22px] p-6',
                fluid ? 'w-full' : 'w-[280px] sm:w-[360px]',
                cardStyles[tone],
            )}
        >
            <blockquote>
                <p className="text-lg font-semibold leading-snug tracking-tight sm:text-xl">“{item.quote}”</p>
            </blockquote>
            <figcaption className="flex items-center gap-3">
                <img
                    src={item.avatar}
                    alt={`Portrait of ${item.name}`}
                    loading="lazy"
                    width={40}
                    height={40}
                    className={cn(
                        'size-10 shrink-0 rounded-full object-cover ring-2',
                        orange ? 'ring-[#111111]/20' : 'ring-[#ff8a00]/60',
                    )}
                />
                <div className="min-w-0">
                    <p className="text-sm font-bold leading-tight">{item.name}</p>
                    <p className={cn('mt-0.5 text-xs leading-snug', orange ? 'text-[#111111]/70' : 'text-[#f4f1ec]/60')}>
                        {item.role}
                    </p>
                </div>
            </figcaption>
        </figure>
    )
}

function MarqueeRow({ items, direction, duration, stopped, toneOffset }) {
    const [hovered, setHovered] = useState(false)
    const base = useMotionValue(direction === 'left' ? 0 : -50)
    const x = useTransform(base, (value) => `${value}%`)

    useAnimationFrame((_, delta) => {
        if (stopped || hovered) return
        const step = (50 / duration) * (Math.min(delta, 64) / 1000)
        let next = base.get() + (direction === 'left' ? -step : step)
        if (next <= -50) next += 50
        if (next > 0) next -= 50
        base.set(next)
    })

    return (
        <div
            className="overflow-hidden py-2"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >
            <motion.div style={{ x }} className="flex w-max">
                {[0, 1].map((copy) => (
                    <ul
                        key={copy}
                        aria-hidden={copy === 1 ? true : undefined}
                        className="flex shrink-0 items-stretch gap-4 pr-4"
                    >
                        {items.map((item, index) => (
                            <li key={item.id} className="flex">
                                <QuoteCard item={item} tone={(index + toneOffset) % 3} />
                            </li>
                        ))}
                    </ul>
                ))}
            </motion.div>
        </div>
    )
}

export function DoubleMarqueeTestimonials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [paused, setPaused] = useState(false)
    const bandRef = useRef(null)
    const inView = useInView(bandRef, { margin: '120px 0px' })
    const stopped = paused || !inView

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#111111] py-16 text-base font-normal text-[#f4f1ec] md:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 -top-56 size-[30rem] rounded-full bg-[#ff8a00]/15 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#ff8a00]">
                            <span aria-hidden="true" className="size-2 rounded-full bg-[#ff8a00]" />
                            Kind words · 10 of 41 collaborators
                        </p>
                        <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-tighter text-[#f4f1ec] sm:text-7xl lg:text-8xl">
                            Nice things,
                            <br />
                            <span className="text-[#ff8a00]">on repeat.</span>
                        </h2>
                    </div>
                    <div className="flex max-w-sm flex-col gap-5">
                        <p className="text-sm leading-relaxed text-[#f4f1ec]/65 sm:text-base">
                            Curators, producers and engineers on working with Mei Tanaka — a creative
                            technologist building rooms, screens and sensors that react to people.
                        </p>
                        {!reduceMotion && (
                            <button
                                type="button"
                                aria-pressed={paused}
                                className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[#f4f1ec]/25 px-5 font-mono text-xs uppercase tracking-[0.18em] text-[#f4f1ec] transition-colors hover:border-[#ff8a00] hover:text-[#ff8a00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]"
                                onClick={() => setPaused((value) => !value)}
                            >
                                {paused ? (
                                    <HiPlay aria-hidden="true" className="size-4" />
                                ) : (
                                    <HiPause aria-hidden="true" className="size-4" />
                                )}
                                {paused ? 'Play quotes' : 'Pause quotes'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div ref={bandRef} className="relative mt-12 md:mt-16">
                {reduceMotion ? (
                    <ul className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-10">
                        {[...topRow, ...bottomRow].map((item, index) => (
                            <li key={item.id} className="flex">
                                <QuoteCard fluid item={item} tone={index % 3} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        <div className="space-y-2">
                            <MarqueeRow items={topRow} direction="left" duration={48} stopped={stopped} toneOffset={0} />
                            <MarqueeRow items={bottomRow} direction="right" duration={56} stopped={stopped} toneOffset={1} />
                        </div>
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-[#111111] to-transparent sm:w-32"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-[#111111] to-transparent sm:w-32"
                        />
                    </>
                )}
            </div>

            <div className="relative mx-auto mt-12 max-w-7xl px-4 sm:px-6 md:mt-16 lg:px-10">
                <div className="flex flex-col gap-8 border-t border-[#f4f1ec]/10 pt-8 md:flex-row md:items-center md:justify-between">
                    <dl className="grid grid-cols-3 gap-4 sm:gap-12">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col-reverse justify-end gap-1">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#f4f1ec]/55 sm:text-[11px] sm:tracking-[0.16em]">
                                    {stat.label}
                                </dt>
                                <dd className="text-4xl font-black tracking-tighter text-[#f4f1ec] sm:text-5xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <a
                            href="#testimonials"
                            className="inline-flex min-h-11 items-center rounded-full font-mono text-xs uppercase tracking-[0.16em] text-[#f4f1ec]/75 underline decoration-[#f4f1ec]/30 underline-offset-4 transition-colors hover:text-[#f4f1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00]"
                        >
                            All 41 testimonials
                        </a>
                        <a
                            href="#contact"
                            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#ff8a00] px-6 text-sm font-bold text-[#111111] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a00] motion-reduce:hover:translate-y-0"
                        >
                            Work with Mei
                            <HiArrowUpRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:rotate-45"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DoubleMarqueeTestimonials

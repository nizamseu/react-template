// BentoCaseProjectsGrid

// ProjectsGrid05 · Portfolios & Personal Websites › Featured Projects Grid

// Description:
// An editorial bento of selected cases for photographer and art director Theo Laurent.
// Seven photo tiles (Pigeon Square for Maison Verlaine, Blue Hour, Coastline Diaries,
// Objects at Rest, Concrete Poems, Night Portraits, Kyoto, Slowly) sit alongside a black
// quote tile and a "212 covers & campaigns" stat tile; hovering or focusing a photo
// reveals its client and year. Use it as a photographer's or studio's work grid.

// Design:
// - Cream #ede6da page, ink #111 type, darker cream #e2d8c8 stat tile, black quote tile;
//   serif display headings with italic accents, mono uppercase meta labels
// - Grid 2 → md:4 columns with grid-flow-dense and fixed auto-rows (11rem → md:13rem →
//   lg:15rem); a 2×2 hero, a 1×2 portrait, three 2×1 wides and 1×1 tiles; rounded-2xl
// - From md photos sit in grayscale and bloom into colour + scale 1.05 on hover/focus while
//   a cream caption panel slides up with client and year; below md they stay in colour
//   with the caption always visible
// - Tiles fade up with a small stagger in view and the stat counts from 0 to 212 once;
//   reduced motion keeps a plain fade and skips the rise and the count-up

// What it does:
// - Photo tiles are links to #case-<id>; "Full index" links to #index
// - count starts at 212 on the server and in the DOM, then animates 0 → 212 with
//   framer-motion's animate() the first time the stat tile enters the view (stopped on
//   unmount)
// - The quote and stat tiles are static content (a <figure> and a <dl>)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BentoCaseProjectsGrid from '@/TestComponent/PageSections/portfolio/ProjectsGrid05';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <BentoCaseProjectsGrid />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const TOTAL = 212

const tiles = [
    {
        type: 'photo',
        id: 'pigeon-square',
        title: 'Pigeon Square',
        client: 'Maison Verlaine',
        kind: 'AW26 campaign',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Woman in a blue coat standing in a square as pigeons take off',
        span: 'col-span-2 row-span-2',
        hero: true,
    },
    { type: 'quote', id: 'quote', span: 'col-span-2' },
    {
        type: 'photo',
        id: 'blue-hour',
        title: 'Blue Hour',
        client: 'Atelier Nord',
        kind: 'lookbook',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        alt: 'Model in striped trousers posing against a teal backdrop',
        span: 'row-span-2',
    },
    { type: 'stat', id: 'stat', span: '' },
    {
        type: 'photo',
        id: 'coastline',
        title: 'Coastline Diaries',
        client: 'Voyageur Magazine',
        kind: 'travel story',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
        alt: 'Colourful houses stacked on a cliff above the sea',
        span: 'col-span-2',
    },
    {
        type: 'photo',
        id: 'objects-at-rest',
        title: 'Objects at Rest',
        client: 'Forme Studio',
        kind: 'still life',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
        alt: 'Simple wooden stool against a flat blue wall',
        span: '',
    },
    {
        type: 'photo',
        id: 'concrete-poems',
        title: 'Concrete Poems',
        client: 'Archi/Ville',
        kind: 'photo book',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80',
        alt: 'Curved white building facade against a blue sky',
        span: '',
    },
    {
        type: 'photo',
        id: 'night-portraits',
        title: 'Night Portraits',
        client: 'Revue Ocre',
        kind: 'cover series',
        year: '2022',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        alt: 'Portrait of a woman with long hair against a dark backdrop',
        span: '',
    },
    {
        type: 'photo',
        id: 'kyoto-slowly',
        title: 'Kyoto, Slowly',
        client: 'Hotel Kanade',
        kind: 'brand film stills',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        alt: 'Quiet Kyoto street leading to a wooden pagoda',
        span: 'col-span-2',
    },
]

function PhotoTile({ tile }) {
    return (
        <a
            href={`#case-${tile.id}`}
            className="group relative block size-full overflow-hidden rounded-2xl bg-[#d8cdbb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]"
        >
            <img
                src={tile.image}
                alt={tile.alt}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:grayscale md:group-hover:scale-105 md:group-hover:grayscale-0 md:group-focus-visible:scale-105 md:group-focus-visible:grayscale-0"
            />
            <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/45 to-transparent"
            />
            <h3
                className={cn(
                    'absolute left-3 top-3 font-serif font-normal italic leading-tight text-white sm:left-4 sm:top-4',
                    tile.hero ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-xl',
                )}
            >
                {tile.title}
            </h3>
            <span className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-3 rounded-xl bg-[#ede6da] px-3 py-2 text-[#111] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:inset-x-3 md:bottom-3 md:translate-y-[calc(100%+1rem)] md:px-4 md:py-3 md:group-hover:translate-y-0 md:group-focus-visible:translate-y-0">
                <span className="min-w-0">
                    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#111]/55">Client</span>
                    <span className="block truncate text-xs font-semibold sm:text-sm">
                        {tile.client}
                        <span className="hidden font-normal text-[#111]/60 md:inline"> · {tile.kind}</span>
                    </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold">
                    {tile.year}
                    <HiArrowUpRight aria-hidden="true" className="hidden size-4 md:block" />
                </span>
            </span>
        </a>
    )
}

function QuoteTile() {
    return (
        <figure className="flex size-full flex-col justify-between rounded-2xl bg-[#111] p-4 text-[#ede6da] sm:p-6">
            <span aria-hidden="true" className="hidden font-serif text-5xl leading-[0.6] text-[#ede6da]/40 sm:block">
                “
            </span>
            <blockquote className="font-serif text-base leading-snug sm:text-lg lg:text-2xl xl:text-[1.7rem]">
                Theo doesn&apos;t take photographs. He builds <em className="italic">weather</em>, then waits for someone to
                walk into it.
            </blockquote>
            <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ede6da]/60">
                Inès Moreau — Creative Director, Revue Ocre
            </figcaption>
        </figure>
    )
}

function StatTile({ reduceMotion }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, amount: 0.6 })
    const [count, setCount] = useState(TOTAL)

    useEffect(() => {
        if (!inView || reduceMotion) return undefined
        const controls = animate(0, TOTAL, {
            duration: 1.6,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (value) => setCount(Math.round(value)),
        })
        return () => controls.stop()
    }, [inView, reduceMotion])

    return (
        <div ref={ref} className="flex size-full flex-col justify-between rounded-2xl bg-[#e2d8c8] p-4 text-[#111] ring-1 ring-inset ring-[#111]/10 sm:p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#111]/55 sm:text-[10px]">Since 2014</p>
            <dl>
                <dt className="sr-only">Covers and campaigns</dt>
                <dd className="font-serif text-5xl leading-none tabular-nums tracking-[-0.03em] text-[#111] sm:text-6xl">
                    {count}
                </dd>
                <dd aria-hidden="true" className="mt-1 text-xs leading-snug text-[#111]/70 sm:text-sm">
                    covers &amp; campaigns
                </dd>
                <dt className="sr-only">Reach</dt>
                <dd className="mt-3 border-t border-[#111]/15 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#111]/70">
                    31 countries · 9 awards
                </dd>
            </dl>
        </div>
    )
}

export function BentoCaseProjectsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#ede6da] px-4 py-16 text-base font-normal text-[#111] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 border-b border-[#111]/15 pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#111]/60">
                            Theo Laurent — Photographer &amp; Art Director
                        </p>
                        <h2 className="mt-4 font-serif text-5xl font-normal leading-[0.95] tracking-[-0.03em] text-[#111] sm:text-6xl lg:text-8xl">
                            Selected <em className="italic">cases</em>
                        </h2>
                    </div>
                    <div className="max-w-sm md:text-right">
                        <p className="text-sm leading-relaxed text-[#111]/70">
                            Campaigns, editorials and still lifes from Paris, Lisbon and wherever the light was
                            better.<span className="hidden md:inline"> Hover a frame for the client and year.</span>
                        </p>
                        <a
                            href="#index"
                            className="group mt-4 inline-flex min-h-11 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#111] underline decoration-[#111]/30 underline-offset-8 transition-colors hover:decoration-[#111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]"
                        >
                            Full index (212)
                            <HiArrowRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                    </div>
                </div>

                <ul className="mt-10 grid grid-flow-dense auto-rows-[11rem] grid-cols-2 gap-3 md:auto-rows-[13rem] md:grid-cols-4 md:gap-4 lg:auto-rows-[15rem]">
                    {tiles.map((tile, index) => (
                        <motion.li
                            key={tile.id}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                            className={cn('min-w-0', tile.span)}
                        >
                            {tile.type === 'photo' && <PhotoTile tile={tile} />}
                            {tile.type === 'quote' && <QuoteTile />}
                            {tile.type === 'stat' && <StatTile reduceMotion={reduceMotion} />}
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default BentoCaseProjectsGrid

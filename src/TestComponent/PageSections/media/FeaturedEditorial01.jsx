// BreakingTickerFeaturedEditorial

// FeaturedEditorial01 · Blogs & Digital Media › Breaking News / Featured Editorial

// Description:
// A newsroom front for the fictional daily The Daily Meridian. A red "Breaking" bar runs a
// looping ticker of six timestamped headlines, then the lead story "Meridian votes to raise
// its sea wall 1.8 metres before the 2032 king tides" (photo, dek, byline, read time) sits
// beside a column of three secondary stories. Use it at the top of a news home page or a
// section front when one story leads and several others are developing.

// Design:
// - Newsprint #fbfbf8 background, ink #0a0a0a text, alert red #d00000 for the ticker bar,
//   kickers, "Special report" tag, hover underlines and focus rings; hairline rules in ink/15
// - Masthead row (date · serif black wordmark · "Today’s paper") over a double rule and a
//   section nav that scrolls sideways on small screens; ticker label is a black block with a
//   pulsing dot
// - Lead: serif black headline text-3xl → lg:text-[3.4rem], 16:10 photo with italic credit,
//   dek in serif, byline and read time in small caps tracking; secondary cards use a 4:3
//   thumbnail, red kicker and serif bold headline
// - Grid: 1 column → md:3 (secondaries become a row under the lead) → lg:3 with the lead
//   spanning two columns and the secondaries stacked in the third, split by vertical rules
// - Photos zoom to 1.05 on hover; ticker drifts at 60 px/s via a motion value

// What it does:
// - Ticker: useAnimationFrame moves a duplicated headline track and wraps it seamlessly; it
//   pauses while the pointer or keyboard focus is inside and via the Pause/Play button
//   (aria-pressed); with reduced motion it stops and the strip becomes horizontally scrollable
// - Ticker items link to #meridian-<id>; stories link to #meridian-sea-wall and similar
//   hashes, "Today’s paper" to #meridian-todays-paper and the section nav to #meridian-<slug>
// - The duplicate ticker copy is aria-hidden and removed from the tab order

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BreakingTickerFeaturedEditorial from '@/TestComponent/PageSections/media/FeaturedEditorial01';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <BreakingTickerFeaturedEditorial />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiOutlineClock, HiPause, HiPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const SPEED = 60

const tickerItems = [
    { id: 'rates', time: '10:14', text: 'Central bank holds rates at 3.25% but signals a cut before December' },
    { id: 'rail', time: '10:02', text: 'Northern rail strike called off after overnight talks at the Exchange' },
    { id: 'tremor', time: '09:47', text: 'Magnitude 5.1 tremor felt along the Ionian coast; no injuries reported' },
    { id: 'maps', time: '09:30', text: 'Harbour Museum confirms the return of 212 archived sea charts' },
    { id: 'cup', time: '09:12', text: 'Meridian FC reach the cup semi-final with a 94th-minute winner' },
    { id: 'heat', time: '08:55', text: 'Heat advisory lifted for inland districts as temperatures fall to 24°C' },
]

const sections = ['Front page', 'World', 'City', 'Climate', 'Business', 'Culture', 'Sport', 'Opinion']

const secondary = [
    {
        id: 'wind-farm',
        kicker: 'Energy',
        title: 'Offshore wind farm reaches full output three months early',
        byline: 'Priya Nair',
        time: '2h ago',
        read: '5 min',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80',
        alt: 'Row of wind turbines silhouetted against an orange sunset',
    },
    {
        id: 'custom-house',
        kicker: 'Education',
        title: 'Night lectures return to the old Custom House after 30 years',
        byline: 'Amos Kett',
        time: '3h ago',
        read: '4 min',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
        alt: 'Students seated in a lecture hall facing a speaker',
    },
    {
        id: 'okoro-record',
        kicker: 'Athletics',
        title: 'Okoro breaks a 20-year-old 400m record at the Meridian Games',
        byline: 'Hana Sato',
        time: '5h ago',
        read: '3 min',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
        alt: 'Sprinter crouched in the starting blocks on a running track',
    },
]

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export function BreakingTickerFeaturedEditorial({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [userPaused, setUserPaused] = useState(false)
    const [hovering, setHovering] = useState(false)
    const groupRef = useRef(null)
    const x = useMotionValue(0)

    const paused = userPaused || hovering || Boolean(reduceMotion)

    useAnimationFrame((_, delta) => {
        if (reduceMotion) {
            if (x.get() !== 0) x.set(0)
            return
        }
        if (paused) return
        const width = groupRef.current?.offsetWidth ?? 0
        if (!width) return
        let next = x.get() - (Math.min(delta, 100) / 1000) * SPEED
        if (next <= -width) next += width
        x.set(next)
    })

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHovering(false)
    }

    const renderGroup = (copy) => (
        <ul
            ref={copy ? undefined : groupRef}
            aria-hidden={copy || undefined}
            className="flex shrink-0 items-center"
        >
            {tickerItems.map((item) => (
                <li key={item.id} className="flex items-center">
                    <a
                        href={`#meridian-${item.id}`}
                        tabIndex={copy ? -1 : undefined}
                        className="flex min-h-11 items-center gap-2.5 whitespace-nowrap px-5 text-sm font-semibold text-white decoration-2 underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                        <span className="font-mono text-xs font-medium text-white/70">{item.time}</span>
                        {item.text}
                    </a>
                    <span aria-hidden="true" className="size-1.5 rotate-45 bg-white/60" />
                </li>
            ))}
        </ul>
    )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fbfbf8] pb-16 pt-6 text-base font-normal text-[#0a0a0a] md:pb-24',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
                    <p className="order-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a0a0a]/60 sm:order-1">
                        Sunday, 27 September 2026
                    </p>
                    <p className="order-1 font-serif text-3xl font-black leading-none tracking-tight text-[#0a0a0a] sm:order-2 sm:text-center md:text-4xl">
                        The Daily Meridian
                    </p>
                    <a
                        href="#meridian-todays-paper"
                        className="order-3 inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a0a0a] hover:text-[#d00000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d00000] sm:justify-self-end"
                    >
                        Today’s paper
                        <HiArrowLongRight aria-hidden="true" className="size-4" />
                    </a>
                </div>

                <div aria-hidden="true" className="mt-4 h-1 border-y border-[#0a0a0a]" />

                <nav aria-label="Sections" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                    <ul className="flex w-max gap-1 py-1.5 sm:w-auto sm:flex-wrap">
                        {sections.map((name, index) => (
                            <li key={name}>
                                <a
                                    href={`#meridian-${slug(name)}`}
                                    aria-current={index === 0 ? 'page' : undefined}
                                    className={cn(
                                        'inline-flex min-h-10 items-center whitespace-nowrap px-3 text-sm font-semibold transition-colors hover:text-[#d00000] focus-visible:outline-2 focus-visible:outline-[#d00000]',
                                        index === 0 ? 'text-[#d00000]' : 'text-[#0a0a0a]/75',
                                    )}
                                >
                                    {name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div
                    className="flex items-stretch overflow-hidden bg-[#d00000] text-white"
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    onFocus={() => setHovering(true)}
                    onBlur={handleBlur}
                >
                    <p className="flex shrink-0 items-center gap-2 bg-[#0a0a0a] px-3 text-[11px] font-black uppercase tracking-[0.22em] text-white sm:px-4">
                        <span className="relative flex size-2.5" aria-hidden="true">
                            <span className="absolute inset-0 animate-ping rounded-full bg-[#d00000] motion-reduce:animate-none" />
                            <span className="relative size-2.5 rounded-full bg-[#d00000]" />
                        </span>
                        Breaking
                    </p>
                    <div
                        className={cn(
                            'relative min-w-0 flex-1',
                            reduceMotion ? 'overflow-x-auto' : 'overflow-hidden',
                        )}
                        aria-label="Breaking headlines"
                        role="region"
                    >
                        <motion.div style={{ x }} className="flex w-max">
                            {renderGroup(false)}
                            {renderGroup(true)}
                        </motion.div>
                    </div>
                    {!reduceMotion && (
                        <button
                            type="button"
                            aria-pressed={userPaused}
                            aria-label={userPaused ? 'Play breaking news ticker' : 'Pause breaking news ticker'}
                            className="flex w-11 shrink-0 items-center justify-center border-l border-white/25 text-white transition-colors hover:bg-[#0a0a0a]/25 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                            onClick={() => setUserPaused((value) => !value)}
                        >
                            {userPaused ? (
                                <HiPlay aria-hidden="true" className="size-4" />
                            ) : (
                                <HiPause aria-hidden="true" className="size-4" />
                            )}
                        </button>
                    )}
                </div>

                <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-0">
                    <article className="md:col-span-3 lg:col-span-2 lg:border-r lg:border-[#0a0a0a]/15 lg:pr-10">
                        <a
                            href="#meridian-sea-wall"
                            className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d00000]"
                        >
                            <figure>
                                <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]/10">
                                    <img
                                        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80"
                                        alt="Aerial view of a dense coastal city skyline meeting the sea"
                                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                    />
                                    <span className="absolute left-0 top-4 bg-[#d00000] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white">
                                        Special report
                                    </span>
                                </div>
                                <figcaption className="mt-2 font-serif text-xs italic text-[#0a0a0a]/55">
                                    The Wharf district, where 14,000 homes sit less than two metres above high tide.
                                    Photograph: Iris Vale / The Daily Meridian
                                </figcaption>
                            </figure>
                            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#d00000]">
                                Climate · City hall
                            </p>
                            <h2 className="mt-3 font-serif text-3xl font-black leading-[1.03] tracking-tight text-[#0a0a0a] decoration-[#d00000] decoration-4 underline-offset-[6px] group-hover:underline sm:text-4xl lg:text-[3.4rem]">
                                Meridian votes to raise its sea wall 1.8 metres before the 2032 king tides
                            </h2>
                        </a>
                        <p className="mt-5 max-w-3xl font-serif text-lg leading-relaxed text-[#0a0a0a]/80 sm:text-xl">
                            After a 9–2 council vote, the city will spend $1.4 billion on harbour defences, its
                            largest public works project since the 1961 floods. Wharf residents say they were
                            told, not asked.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#0a0a0a]/15 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#0a0a0a]/65">
                            <span className="text-[#0a0a0a]">
                                By Lena Okafor <span className="text-[#0a0a0a]/50">and</span> Tomás Reyes
                            </span>
                            <span>Updated 10:05 AM</span>
                            <span className="inline-flex items-center gap-1.5">
                                <HiOutlineClock aria-hidden="true" className="size-4" />
                                8 min read
                            </span>
                        </div>
                    </article>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:col-span-3 md:gap-6 lg:col-span-1 lg:grid-cols-1 lg:gap-0 lg:pl-10">
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0a0a0a] sm:col-span-3 lg:col-span-1 lg:pb-4">
                            <span className="mr-2 inline-block h-2 w-5 bg-[#d00000] align-middle" aria-hidden="true" />
                            Also developing
                        </p>
                        {secondary.map((story, index) => (
                            <article
                                key={story.id}
                                className={cn(
                                    'border-t border-[#0a0a0a]/15 pt-5 lg:pb-6',
                                    index === 0 && 'lg:border-t-2 lg:border-[#0a0a0a]',
                                )}
                            >
                                <a
                                    href={`#meridian-${story.id}`}
                                    className="group flex gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d00000] sm:flex-col lg:flex-row-reverse"
                                >
                                    <div className="aspect-[4/3] w-28 shrink-0 overflow-hidden bg-[#0a0a0a]/10 sm:w-full lg:w-28">
                                        <img
                                            src={story.image}
                                            alt={story.alt}
                                            loading="lazy"
                                            className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d00000]">
                                            {story.kicker}
                                        </p>
                                        <h3 className="mt-1.5 font-serif text-lg font-bold leading-snug text-[#0a0a0a] decoration-[#d00000] decoration-2 underline-offset-4 group-hover:underline">
                                            {story.title}
                                        </h3>
                                        <p className="mt-2 text-xs text-[#0a0a0a]/60">
                                            {story.byline} · {story.time} · {story.read} read
                                        </p>
                                    </div>
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BreakingTickerFeaturedEditorial

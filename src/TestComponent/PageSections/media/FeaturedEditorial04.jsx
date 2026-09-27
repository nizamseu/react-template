// LiveCoverageFeaturedEditorial

// FeaturedEditorial04 · Blogs & Digital Media › Breaking News / Featured Editorial

// Description:
// A live-blog lead for the fictional rolling-news service Pulse Live, covering "Storm Maris
// makes landfall on the east coast". A pulsing LIVE badge, four headline figures and a
// timestamped stream of updates sit beside a "Key points" sidebar; every ~20 seconds a new
// update arrives and waits behind a "1 new update" pill until the reader reveals it. Use it
// for elections, storms, launches or any story that changes by the minute.

// Design:
// - Navy #0b1d33 background, white text at 100/80/60%, alert red #ff4d4d for the LIVE badge,
//   key-event dots, "Breaking" chips, the new-updates pill and focus rings; panels are
//   white/5 with white/10 borders and rounded-2xl corners
// - Header: brand row, LIVE badge with an expanding red halo, h2 up to lg:text-6xl, and a
//   stats strip of four figures (2 → md:4 columns) in tabular numerals
// - Stream: an ordered timeline with a time column (4.5rem → sm:6rem) and a vertical rule;
//   key events get a red ring dot and label; one update carries a 16:9 photo and one a quote
// - lg:grid-cols-12: stream 8 columns, sticky "Key points" sidebar 4 columns; below lg the
//   key points collapse into a disclosure above the stream
// - Motion: new updates slide down into place (AnimatePresence + layout), the pill springs
//   in; the halo pulse and layout motion are disabled for reduced motion

// What it does:
// - A timeout chain delivers the next of four queued updates every 20 s (cleared on unmount);
//   they are held behind a sticky "N new updates" pill, announced via aria-live, and clicking
//   the pill reveals them at the top and focuses the stream heading
// - "All updates" / "Key events" (aria-pressed) filters the stream; "Get alerts" toggles
//   a visual-only follow state; the Key points disclosure uses aria-expanded
// - "Updated" in the header always shows the time of the newest revealed update; update
//   permalinks point to #pulse-live-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LiveCoverageFeaturedEditorial from '@/TestComponent/PageSections/media/FeaturedEditorial04';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <LiveCoverageFeaturedEditorial />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowUp, HiBellAlert, HiChevronDown, HiOutlineBell, HiOutlineLink, HiSignal } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const ARRIVAL_MS = 20000

const stats = [
    { label: 'Peak gust', value: '142 km/h' },
    { label: 'Homes without power', value: '212,400' },
    { label: 'Flights cancelled', value: '1,180' },
    { label: 'People evacuated', value: '38,000' },
]

const keyPoints = [
    'Maris made landfall near Port Aven at 11:40 as a Category 2 storm, the strongest on this coast since 1987.',
    '212,400 homes are without power; repair crews from four states are on standby.',
    'A red wind warning stays in force for Aven and Kell counties until 21:00.',
    'All ferries and 1,180 flights are cancelled; rail north of Kell is suspended.',
    'No deaths reported; two people were rescued from a stranded car near Dunmore.',
]

const initialUpdates = [
    {
        id: 'gust-record',
        time: '14:52',
        tag: 'Breaking',
        key: true,
        title: 'Gust of 142 km/h recorded at Kell Point',
        body: 'The national weather office says it is the highest wind speed measured on the mainland since records began at the station in 1971.',
        author: 'Nadia Rahman, weather desk',
    },
    {
        id: 'emergency',
        time: '14:40',
        tag: 'Official',
        title: 'Governor declares a state of emergency for three counties',
        body: 'The declaration frees $40m in disaster funds and lets the National Guard assist with evacuations in Aven, Kell and Marrow counties.',
        quote: '“Stay home, stay off the coast roads, and check on your neighbours,” Governor Elena Sørvik told reporters.',
        author: 'James Okwu, politics',
    },
    {
        id: 'harbour-wall',
        time: '14:21',
        tag: 'Photo',
        title: 'Waves break over the harbour wall at Port Aven',
        body: 'Our photographer on the seafront describes swells of six to seven metres; the promenade has been closed since 10:00.',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80',
        alt: 'Churning dark ocean surface whipped up by strong wind',
        author: 'Leo Brandt, Port Aven',
    },
    {
        id: 'outages',
        time: '13:58',
        tag: 'Breaking',
        key: true,
        title: 'Power outages pass 200,000 homes',
        body: 'Coastline Energy says most cuts are caused by fallen trees on overhead lines and that full restoration may take until Wednesday.',
        author: 'Nadia Rahman, weather desk',
    },
    {
        id: 'analysis',
        time: '13:30',
        tag: 'Analysis',
        title: 'Why Maris strengthened overnight',
        body: 'Sea temperatures 2.4°C above the September average gave the storm a final burst of energy just before landfall, explains meteorologist Ana Queiroz.',
        author: 'Ana Queiroz, meteorologist',
    },
    {
        id: 'landfall',
        time: '11:40',
        tag: 'Breaking',
        key: true,
        title: 'Storm Maris makes landfall near Port Aven',
        body: 'The eye crossed the coast four kilometres south of Port Aven with sustained winds of 165 km/h.',
        author: 'Pulse Live newsroom',
    },
]

const incomingUpdates = [
    {
        id: 'rail',
        time: '14:54',
        tag: 'Travel',
        title: 'Rail services north of Kell suspended until Monday',
        body: 'Northline Rail says trees have blocked the track in at least 11 places between Kell and Brannock.',
        author: 'Sofia Lind, transport',
    },
    {
        id: 'sports-hall',
        time: '14:57',
        tag: 'Breaking',
        key: true,
        title: 'Roof torn from Dunmore sports hall',
        body: 'Police have cordoned off Mill Street. The building was empty; the town’s evacuation centre moved to the high school on Friday.',
        author: 'Leo Brandt, Dunmore',
    },
    {
        id: 'runway',
        time: '15:01',
        tag: 'Travel',
        title: 'Airport reopens one runway for emergency flights',
        body: 'Aven International will accept relief and medical flights only. Passenger flights remain cancelled until at least 06:00.',
        author: 'Sofia Lind, transport',
    },
    {
        id: 'easing',
        time: '15:06',
        tag: 'Forecast',
        title: 'Winds expected to ease below 90 km/h by 20:00',
        body: 'The storm is now moving north-east at 30 km/h. The red warning may be downgraded to amber this evening.',
        author: 'Nadia Rahman, weather desk',
    },
]

const tagStyles = {
    Breaking: 'bg-[#ff4d4d] text-white',
    Official: 'bg-white text-[#0b1d33]',
    Photo: 'border border-white/30 text-white',
    Analysis: 'border border-white/30 text-white',
    Travel: 'border border-white/30 text-white',
    Forecast: 'border border-white/30 text-white',
}

export function LiveCoverageFeaturedEditorial({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [arrived, setArrived] = useState(0)
    const [revealed, setRevealed] = useState(0)
    const [filter, setFilter] = useState('all')
    const [pointsOpen, setPointsOpen] = useState(false)
    const [following, setFollowing] = useState(false)
    const streamHeadingRef = useRef(null)

    useEffect(() => {
        if (arrived >= incomingUpdates.length) return undefined
        const id = setTimeout(() => setArrived((count) => count + 1), ARRIVAL_MS)
        return () => clearTimeout(id)
    }, [arrived])

    const queued = arrived - revealed
    const allUpdates = [...incomingUpdates.slice(0, revealed).reverse(), ...initialUpdates]
    const visible = filter === 'key' ? allUpdates.filter((update) => update.key) : allUpdates
    const lastUpdated = allUpdates[0].time

    const revealUpdates = () => {
        setRevealed(arrived)
        setFilter('all')
        const heading = streamHeadingRef.current
        if (heading) {
            heading.focus({ preventScroll: true })
            if (heading.getBoundingClientRect().top < 0) {
                heading.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
            }
        }
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#0b1d33] py-14 text-base font-normal text-white md:py-20', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white">
                        <HiSignal aria-hidden="true" className="size-5 text-[#ff4d4d]" />
                        Pulse Live
                    </p>
                    <span className="relative inline-flex items-center gap-2 rounded-full bg-[#ff4d4d] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">
                        <span className="relative flex size-2">
                            {!reduceMotion && (
                                <motion.span
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-full bg-white"
                                    animate={{ scale: [1, 2.6], opacity: [0.9, 0] }}
                                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                                />
                            )}
                            <span aria-hidden="true" className="relative size-2 rounded-full bg-white" />
                        </span>
                        Live
                    </span>
                    <p className="text-sm text-white/60">
                        Updated <time className="font-semibold tabular-nums text-white">{lastUpdated}</time> BST ·
                        Sunday 27 September
                    </p>
                </div>

                <h2 className="mt-6 max-w-4xl text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Storm Maris makes landfall on the east coast: <span className="text-[#ff4d4d]">live updates</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
                    The strongest storm in almost four decades is moving inland with red warnings in two counties.
                    Our reporters in Port Aven, Kell and Dunmore are following it minute by minute.
                </p>

                <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 md:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className={cn(
                                'bg-white/[0.03] p-4 sm:p-5',
                                index % 2 === 1 && 'border-l border-white/10',
                                index > 1 && 'border-t border-white/10 md:border-t-0',
                                index === 2 && 'md:border-l',
                            )}
                        >
                            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">{stat.label}</dt>
                            <dd className="mt-1.5 text-2xl font-extrabold tabular-nums text-white sm:text-3xl">{stat.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                    <aside className="lg:order-2 lg:col-span-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:sticky lg:top-6 lg:p-6">
                            <button
                                type="button"
                                aria-expanded={pointsOpen}
                                aria-controls="pulse-live-key-points"
                                className="flex min-h-10 w-full items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d4d] lg:hidden"
                                onClick={() => setPointsOpen((open) => !open)}
                            >
                                <span className="text-lg font-bold text-white">Key points</span>
                                <HiChevronDown
                                    aria-hidden="true"
                                    className={cn('size-5 text-white/70 transition-transform', pointsOpen && 'rotate-180')}
                                />
                            </button>
                            <h3 className="hidden text-lg font-bold text-white lg:block">Key points</h3>
                            <div id="pulse-live-key-points" className={cn(pointsOpen ? 'block' : 'hidden', 'lg:block')}>
                                <ul className="mt-4 space-y-4">
                                    {keyPoints.map((point) => (
                                        <li key={point} className="flex gap-3 text-sm leading-relaxed text-white/80">
                                            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[#ff4d4d]" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    aria-pressed={following}
                                    className={cn(
                                        'mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d4d]',
                                        following
                                            ? 'bg-white text-[#0b1d33]'
                                            : 'border border-white/25 text-white hover:border-white',
                                    )}
                                    onClick={() => setFollowing((value) => !value)}
                                >
                                    {following ? (
                                        <HiBellAlert aria-hidden="true" className="size-4 text-[#ff4d4d]" />
                                    ) : (
                                        <HiOutlineBell aria-hidden="true" className="size-4" />
                                    )}
                                    {following ? 'Alerts on for Storm Maris' : 'Get alerts'}
                                </button>
                            </div>
                        </div>
                    </aside>

                    <div className="relative lg:order-1 lg:col-span-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <h3
                                ref={streamHeadingRef}
                                tabIndex={-1}
                                className="scroll-mt-6 text-lg font-bold text-white focus:outline-none"
                            >
                                {allUpdates.length} updates
                            </h3>
                            <div className="flex gap-1 rounded-full bg-white/5 p-1" role="group" aria-label="Filter updates">
                                {[
                                    { id: 'all', label: 'All updates' },
                                    { id: 'key', label: 'Key events' },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        aria-pressed={filter === option.id}
                                        className={cn(
                                            'min-h-10 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#ff4d4d]',
                                            filter === option.id ? 'bg-white text-[#0b1d33]' : 'text-white/70 hover:text-white',
                                        )}
                                        onClick={() => setFilter(option.id)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sticky top-4 z-10 flex h-0 justify-center overflow-visible">
                            <AnimatePresence>
                                {queued > 0 && (
                                    <motion.button
                                        type="button"
                                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                                        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ff4d4d] px-5 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(255,77,77,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        onClick={revealUpdates}
                                    >
                                        <HiArrowUp aria-hidden="true" className="size-4" />
                                        {queued} new {queued === 1 ? 'update' : 'updates'}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                        <p aria-live="polite" className="sr-only">
                            {queued > 0 ? `${queued} new ${queued === 1 ? 'update' : 'updates'} available` : ''}
                        </p>

                        <ol className="mt-4">
                            <AnimatePresence initial={false} mode="popLayout">
                                {visible.map((update) => (
                                    <motion.li
                                        key={update.id}
                                        layout={reduceMotion ? false : 'position'}
                                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.35, ease: 'easeOut' }}
                                        className="grid grid-cols-[4.5rem_1fr] sm:grid-cols-[6rem_1fr]"
                                    >
                                        <div className="pt-6">
                                            <time className="font-mono text-sm font-semibold tabular-nums text-white">{update.time}</time>
                                            {update.key && (
                                                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff4d4d]">Key event</p>
                                            )}
                                        </div>
                                        <article className="relative min-w-0 border-l border-white/15 pb-8 pl-5 pt-6 sm:pl-7">
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'absolute -left-[5px] top-7 size-2.5 rounded-full',
                                                    update.key ? 'bg-[#ff4d4d] ring-4 ring-[#ff4d4d]/25' : 'bg-white/50',
                                                )}
                                            />
                                            <span
                                                className={cn(
                                                    'inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em]',
                                                    tagStyles[update.tag],
                                                )}
                                            >
                                                {update.tag}
                                            </span>
                                            <h4 className="mt-3 text-lg font-bold leading-snug text-white sm:text-xl">{update.title}</h4>
                                            <p className="mt-2 leading-relaxed text-white/75">{update.body}</p>
                                            {update.quote && (
                                                <blockquote className="mt-4 border-l-2 border-[#ff4d4d] pl-4 text-lg italic leading-snug text-white">
                                                    {update.quote}
                                                </blockquote>
                                            )}
                                            {update.image && (
                                                <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-white/5">
                                                    <img src={update.image} alt={update.alt} loading="lazy" className="size-full object-cover" />
                                                </div>
                                            )}
                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/55">
                                                <span>{update.author}</span>
                                                <a
                                                    href={`#pulse-live-${update.id}`}
                                                    aria-label={`Link to update: ${update.title}`}
                                                    className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ff4d4d]"
                                                >
                                                    <HiOutlineLink aria-hidden="true" className="size-4" />
                                                    Link
                                                </a>
                                            </div>
                                        </article>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ol>
                        <p className="border-t border-white/10 pt-5 text-sm text-white/55">
                            Coverage began at 06:00. Earlier updates are in our{' '}
                            <a
                                href="#pulse-live-morning"
                                className="font-semibold text-white underline decoration-[#ff4d4d] underline-offset-4 hover:text-[#ff4d4d] focus-visible:outline-2 focus-visible:outline-[#ff4d4d]"
                            >
                                morning blog
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LiveCoverageFeaturedEditorial

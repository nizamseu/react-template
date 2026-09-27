// EndlessFeedLatestPosts

// LatestPosts03 · Blogs & Digital Media › Latest Posts Grid / Feed

// Description:
// An infinite-scroll feed of field dispatches for the fictional environmental news desk
// Field Report. Under "Dispatches, as they land." cards show a photo, dispatch number, GPS
// coordinates, beat, headline, correspondent and date; scrolling to the end of the grid shows
// skeleton cards and loads six more, until all 18 are in and "You’re all caught up" appears.
// Use it for news, science or photo-journalism archives that should feel bottomless.

// Design:
// - Near-black #111111 background, cards #181818 with white/10 borders, off-white text and
//   signal orange #ff7a00 for dispatch tags, coordinates, the progress bar, hover outlines and
//   focus rings; a faint 48px grid texture sits behind the header
// - Mono type for dispatch numbers, coordinates and dates; headlines in sans bold
//   (text-lg → sm:text-xl) with tight leading; rounded-xl cards with 3:2 photos
// - Grid: 1 → sm:2 → lg:3 columns with gap-5; skeleton cards match the card layout and pulse
//   (static with reduced motion)
// - Cards fade up with a 60 ms stagger as each batch arrives; photos lift from 85% brightness
//   and zoom 1.05 on hover
// - Header stacks on mobile; the progress bar and count sit in a mono status line

// What it does:
// - An IntersectionObserver watches a sentinel below the grid (240px bottom rootMargin);
//   while it is visible the feed enters a 1.2 s "loading" state (skeletons, aria-busy) and
//   then appends six dispatches, stopping at 18
// - A "Load the next 6 now" button does the same for keyboard users and then focuses the
//   first new card; timers and the observer are cleaned up on unmount; status changes are
//   announced via aria-live
// - The end state shows "You’re all caught up" with a "Back to the top" link to
//   #field-report-latest; cards link to #field-report-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EndlessFeedLatestPosts from '@/TestComponent/PageSections/media/LatestPosts03';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <EndlessFeedLatestPosts />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowUp, HiCheckCircle } from 'react-icons/hi2';
import { TbCurrentLocation } from 'react-icons/tb';
import { cn } from '@/design-system/lib/cn';

const BATCH = 6
const TOTAL = 18
const LOAD_MS = 1200

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`

const dispatches = [
    { id: 'ice-orbit', no: '058', beat: 'Space', title: 'The satellite counting Arctic sea ice every 90 minutes', place: 'Low Earth orbit', coords: '540 km altitude', reporter: 'Hana Ishikawa', date: '27 Sep', image: img('1446776811953-b23d57bd21aa'), alt: 'The curve of the Earth seen from orbit' },
    { id: 'soil-lab', no: '057', beat: 'Science', title: 'Inside the lab sequencing 40,000 soil samples', place: 'Wageningen, NL', coords: '51.98° N, 5.66° E', reporter: 'Joost de Wit', date: '27 Sep', image: img('1532187863486-abf9dbad1b69'), alt: 'Scientist pipetting samples into lab tubes' },
    { id: 'night-lights', no: '056', beat: 'Energy', title: 'What night-time satellite images reveal about the grid', place: 'Orbital data', coords: '824 km altitude', reporter: 'Hana Ishikawa', date: '26 Sep', image: img('1451187580459-43490279c0fa'), alt: 'City lights spread across the Earth at night seen from space' },
    { id: 'self-cleaning-solar', no: '055', beat: 'Energy', title: 'The desert solar farm that cleans its panels with dew', place: 'Ouarzazate, Morocco', coords: '30.99° N, 6.86° W', reporter: 'Salma Idrissi', date: '26 Sep', image: img('1509391366360-2e959784a276'), alt: 'Rows of solar panels under a clear sky' },
    { id: 'glacier-1920', no: '054', beat: 'Mountains', title: 'Measuring a glacier’s retreat with a 1920s photograph', place: 'Aletsch, Switzerland', coords: '46.44° N, 8.08° E', reporter: 'Lukas Meier', date: '25 Sep', image: img('1492691527719-9d1e07e534b4'), alt: 'Photographer standing on a mountain ridge above the clouds' },
    { id: 'rewilded', no: '053', beat: 'Forests', title: 'Ten years on: walking a rewilded estate with its ecologist', place: 'West Sussex, UK', coords: '50.97° N, 0.36° W', reporter: 'Ruth Calloway', date: '25 Sep', image: img('1441974231531-c6227db76b6e'), alt: 'Sunlit path through a dense green forest' },
    { id: 'cloud-forest', no: '052', beat: 'Climate', title: 'Cloud forests are losing their clouds', place: 'Monteverde, Costa Rica', coords: '10.30° N, 84.82° W', reporter: 'Diego Solano', date: '24 Sep', image: img('1470071459604-3b5ec3a7fe05'), alt: 'Mist drifting over steep green hills' },
    { id: 'namib-survey', no: '051', beat: 'Deserts', title: 'Four days with the team mapping the moving dunes of the Namib', place: 'Sossusvlei, Namibia', coords: '24.73° S, 15.29° E', reporter: 'Thandi Nkosi', date: '23 Sep', image: img('1500530855697-b586d89ba3ee'), alt: 'Empty road running straight into the desert' },
    { id: 'fire-lookouts', no: '050', beat: 'Wildfire', title: 'The fire lookouts still staffed by people, not cameras', place: 'Flathead, Montana', coords: '47.92° N, 114.05° W', reporter: 'Cody Hart', date: '22 Sep', image: img('1511497584788-876760111969'), alt: 'Pine forest silhouetted against an orange sunset' },
    { id: 'southern-ocean', no: '049', beat: 'Oceans', title: '12 days aboard a research ship in the Southern Ocean', place: 'Drake Passage', coords: '58.00° S, 63.00° W', reporter: 'Maren Olsen', date: '21 Sep', image: img('1518837695005-2083093ee35b'), alt: 'Dark, rough ocean surface' },
    { id: 'shoreline-drones', no: '048', beat: 'Coasts', title: 'Mapping a vanishing shoreline with a fleet of drones', place: 'Outer Banks, USA', coords: '35.56° N, 75.47° W', reporter: 'Cody Hart', date: '20 Sep', image: img('1505142468610-359e7d316be0'), alt: 'Aerial view of waves washing onto a beach' },
    { id: 'rainforest-mics', no: '047', beat: 'Wildlife', title: 'Listening to a rainforest through 300 hidden microphones', place: 'Danum Valley, Borneo', coords: '4.96° N, 117.80° E', reporter: 'Aisyah Rahman', date: '19 Sep', image: img('1500673922987-e212871fec22'), alt: 'Misty path winding into a forest' },
    { id: 'dam-removal', no: '046', beat: 'Rivers', title: 'The dam removal that brought the salmon back', place: 'Olympic Peninsula, USA', coords: '48.03° N, 123.59° W', reporter: 'Maren Olsen', date: '18 Sep', image: img('1433086966358-54859d0ed716'), alt: 'Waterfall with a wooden footbridge in a green gorge' },
    { id: 'dark-skies', no: '045', beat: 'Night skies', title: 'Chile’s dark-sky reserves versus the satellite swarm', place: 'Elqui Valley, Chile', coords: '30.03° S, 70.49° W', reporter: 'Diego Solano', date: '17 Sep', image: img('1519681393784-d120267933ba'), alt: 'Starry night sky over snowy mountains' },
    { id: 'aurora-max', no: '044', beat: 'Space weather', title: 'Chasing the strongest aurora in two decades', place: 'Tromsø, Norway', coords: '69.65° N, 18.96° E', reporter: 'Lukas Meier', date: '16 Sep', image: img('1517411032315-54ef2cb783bb'), alt: 'Green aurora rippling across the night sky' },
    { id: 'alpine-wolves', no: '043', beat: 'Wildlife', title: 'Tracking the return of wolves to the high Alps', place: 'Valais, Switzerland', coords: '46.23° N, 7.36° E', reporter: 'Ruth Calloway', date: '15 Sep', image: img('1464822759023-fed622ff2c3b'), alt: 'Forested mountain valley under rocky peaks' },
    { id: 'herders', no: '042', beat: 'Farming', title: 'The alpine herders adapting to ever-earlier springs', place: 'Tyrol, Austria', coords: '47.26° N, 11.39° E', reporter: 'Joost de Wit', date: '14 Sep', image: img('1503023345310-bd7c1de61c7d'), alt: 'Person standing in a meadow looking toward mountains' },
    { id: 'topsoil', no: '041', beat: 'Soil', title: 'The farmers rebuilding topsoil one cover crop at a time', place: 'Palouse, USA', coords: '46.91° N, 117.07° W', reporter: 'Thandi Nkosi', date: '13 Sep', image: img('1472214103451-9374bd1c798e'), alt: 'Rolling green hills at sunset' },
]

function SkeletonCard() {
    return (
        <div aria-hidden="true" className="overflow-hidden rounded-xl border border-white/10 bg-[#181818]">
            <div className="aspect-[3/2] animate-pulse bg-white/[0.06] motion-reduce:animate-none" />
            <div className="space-y-3 p-5">
                <div className="h-3 w-1/3 animate-pulse rounded bg-[#ff7a00]/25 motion-reduce:animate-none" />
                <div className="h-5 w-11/12 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06] motion-reduce:animate-none" />
            </div>
        </div>
    )
}

export function EndlessFeedLatestPosts({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [count, setCount] = useState(BATCH)
    const [busy, setBusy] = useState(false)
    const [sentinelVisible, setSentinelVisible] = useState(false)
    const sentinelRef = useRef(null)
    const linkRefs = useRef([])
    const focusIndex = useRef(null)

    useEffect(() => {
        const node = sentinelRef.current
        if (!node || typeof IntersectionObserver === 'undefined') return undefined
        const observer = new IntersectionObserver(([entry]) => setSentinelVisible(entry.isIntersecting), {
            rootMargin: '0px 0px 240px 0px',
        })
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (sentinelVisible && !busy && count < TOTAL) setBusy(true)
    }, [sentinelVisible, busy, count])

    useEffect(() => {
        if (!busy) return undefined
        const id = setTimeout(() => {
            setCount((value) => Math.min(value + BATCH, TOTAL))
            setBusy(false)
        }, LOAD_MS)
        return () => clearTimeout(id)
    }, [busy])

    useEffect(() => {
        if (focusIndex.current === null || focusIndex.current >= count) return
        linkRefs.current[focusIndex.current]?.focus()
        focusIndex.current = null
    }, [count])

    const loadNow = () => {
        focusIndex.current = count
        setBusy(true)
    }

    const visible = dispatches.slice(0, count)
    const done = count >= TOTAL
    const skeletons = Math.min(3, TOTAL - count)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#111111] py-16 text-base font-normal text-[#f2f2f2] md:py-24', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#ff7a00]">
                            <TbCurrentLocation aria-hidden="true" className="size-4" />
                            Field Report
                        </p>
                        <h2
                            id="field-report-latest"
                            className="mt-4 scroll-mt-6 text-4xl font-extrabold leading-[1] tracking-tight text-[#f2f2f2] sm:text-5xl lg:text-6xl"
                        >
                            Dispatches, as they land.
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[#f2f2f2]/65 md:text-right">
                        Eighteen reports filed this fortnight by 11 correspondents on four continents. Keep
                        scrolling; the feed keeps up.
                    </p>
                </div>

                <div className="mt-8 flex items-center gap-4 border-y border-white/10 py-3 font-mono text-xs text-[#f2f2f2]/60">
                    <span className="shrink-0 tabular-nums">
                        <span className="text-[#ff7a00]">{String(count).padStart(2, '0')}</span> / {TOTAL}
                    </span>
                    <div aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-[#ff7a00] transition-[width] duration-700 motion-reduce:transition-none"
                            style={{ width: `${(count / TOTAL) * 100}%` }}
                        />
                    </div>
                    <span className="hidden shrink-0 sm:inline">Newest first</span>
                </div>

                <div aria-busy={busy} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((item, index) => (
                        <motion.article
                            key={item.id}
                            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: (index % BATCH) * 0.06, ease: 'easeOut' }}
                            className="group overflow-hidden rounded-xl border border-white/10 bg-[#181818] transition-colors hover:border-[#ff7a00]/70"
                        >
                            <a
                                ref={(node) => {
                                    linkRefs.current[index] = node
                                }}
                                href={`#field-report-${item.id}`}
                                className="block rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff7a00]"
                            >
                                <div className="relative aspect-[3/2] overflow-hidden bg-white/5">
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        loading="lazy"
                                        className="size-full object-cover brightness-[0.85] transition duration-700 group-hover:scale-105 group-hover:brightness-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                    />
                                    <span className="absolute left-0 top-0 bg-[#ff7a00] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                                        Dispatch {item.no}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <p className="font-mono text-[11px] uppercase tracking-wider text-[#ff7a00]">
                                        {item.beat} · {item.coords}
                                    </p>
                                    <h3 className="mt-2 text-lg font-bold leading-snug text-[#f2f2f2] decoration-[#ff7a00] decoration-2 underline-offset-4 group-hover:underline sm:text-xl">
                                        {item.title}
                                    </h3>
                                    <p className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-white/15 pt-3 text-xs text-[#f2f2f2]/60">
                                        <span>
                                            <span className="font-semibold text-[#f2f2f2]">{item.reporter}</span> · {item.place}
                                        </span>
                                        <span className="font-mono">{item.date}</span>
                                    </p>
                                </div>
                            </a>
                        </motion.article>
                    ))}
                    {busy && Array.from({ length: skeletons }, (_, index) => <SkeletonCard key={`skeleton-${index}`} />)}
                </div>

                <p aria-live="polite" className="sr-only">
                    {busy ? `Loading ${Math.min(BATCH, TOTAL - count)} more dispatches` : done ? 'You’re all caught up' : `Showing ${count} of ${TOTAL} dispatches`}
                </p>

                <div ref={sentinelRef} className="mt-10 flex min-h-24 flex-col items-center justify-center gap-3 text-center">
                    {done ? (
                        <>
                            <HiCheckCircle aria-hidden="true" className="size-9 text-[#ff7a00]" />
                            <p className="text-xl font-bold text-[#f2f2f2]">You’re all caught up</p>
                            <p className="font-mono text-xs text-[#f2f2f2]/55">
                                All 18 dispatches loaded · next batch expected 06:00 UTC
                            </p>
                            <a
                                href="#field-report-latest"
                                className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-4 font-mono text-xs font-semibold text-[#f2f2f2] transition-colors hover:border-[#ff7a00] hover:text-[#ff7a00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a00]"
                            >
                                <HiArrowUp aria-hidden="true" className="size-4" />
                                Back to the top
                            </a>
                        </>
                    ) : busy ? (
                        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#f2f2f2]/60">
                            <span className="size-4 animate-spin rounded-full border-2 border-[#ff7a00] border-t-transparent motion-reduce:animate-none" />
                            Receiving transmissions…
                        </p>
                    ) : (
                        <button
                            type="button"
                            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-[#f2f2f2]/80 transition-colors hover:border-[#ff7a00] hover:text-[#ff7a00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a00]"
                            onClick={loadNow}
                        >
                            Load the next {Math.min(BATCH, TOTAL - count)} now
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default EndlessFeedLatestPosts

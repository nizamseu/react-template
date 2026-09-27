// YearRailAboutStory

// AboutStory02 · Corporate & Business › About Us / Story

// Description:
// The company story of Meridian Logistics told as a route map: a horizontal year rail from
// 1998 to 2026 with eight stops, and a panel that swaps in each milestone's photo, story and
// two hard numbers. It opens with "From two box trucks to 31 hubs, one promise at a time."
// and ends on "Today: 31 hubs, one promise". Use it on an about or history page for any
// operations-heavy company with a long, dated track record.

// Design:
// - Navy #0b1f3a section with a deeper #081830 panel, text #e8eef7 and signal orange
//   #ff6b1a for the progress line, active stop, stat numbers and focus rings
// - Rail: 8 equal year tabs over a hairline track; an orange line grows from 1998 to the
//   active year and visited stops fill orange; mono stop codes (MRD-1998) and big tabular
//   years in sans; the panel year is a huge outlined numeral behind the photo
// - Panel: photo 4:3 with a clip-path wipe on change + story column with kicker, h3, copy,
//   two stats and prev/next; AnimatePresence cross-fades text (fade only for reduced motion)
// - Responsive: base/sm the rail scrolls sideways with scroll-snap (tabs 6rem wide) and the
//   panel stacks; md+ the rail fits the width and the panel splits 1.1fr / 1fr

// What it does:
// - active (index) changes on year click, ArrowLeft/Right/Home/End inside the tablist,
//   or the Previous/Next buttons; tabs use role="tab" + aria-selected with roving tabIndex
// - When the rail is scrollable, the active year is scrolled to the centre of the rail
//   (the page itself never scrolls); "Download the 2026 network map" links to #meridian-map
// - The pulsing ring on the active stop stops for reduced motion

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import YearRailAboutStory from '@/TestComponent/PageSections/corporate/AboutStory02';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <YearRailAboutStory />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const img = (id, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const milestones = [
    {
        year: 1998,
        label: 'Founded',
        place: 'Chicago, IL',
        title: 'Two box trucks and a gravel yard',
        story: 'Dana Okafor and Luis Ferreira lease a yard off South Halsted, buy two used box trucks and promise a Loop printing firm next-morning delivery, every morning. They keep that promise 311 days in a row.',
        stats: [
            { value: '2', label: 'Trucks' },
            { value: '311', label: 'On-time days in a row' },
        ],
        image: img('1519501025264-65ba15a82390'),
        alt: 'Downtown Chicago street at dusk with traffic between tall office towers',
    },
    {
        year: 2003,
        label: 'Canada',
        place: 'Calgary, AB',
        title: 'The first cross-border lane',
        story: 'A Chicago–Winnipeg–Calgary lane becomes our first international route. Customs paperwork is still faxed, and every driver carries a binder the size of a phone book.',
        stats: [
            { value: '2,780 km', label: 'Lane length' },
            { value: '18', label: 'Crossings a week' },
        ],
        image: img('1464822759023-fed622ff2c3b'),
        alt: 'Forested mountain valley under snow-capped peaks',
    },
    {
        year: 2007,
        label: 'Sea',
        place: 'Hai Phong, VN',
        title: 'A sea-freight desk in Hai Phong',
        story: 'Three people and one shared fax start consolidating furniture containers for Midwest retailers. Within a year it is our busiest office per square metre.',
        stats: [
            { value: '4,200', label: 'TEU in year one' },
            { value: '3', label: 'People on the desk' },
        ],
        image: img('1528127269322-539801943592'),
        alt: 'Boats moored among limestone karst islands in a green bay',
    },
    {
        year: 2011,
        label: 'Air',
        place: 'O’Hare, IL',
        title: 'Overnight air, before 7 a.m.',
        story: 'Block-space deals on two overnight freighters out of O’Hare let a medical-device client ship implants to 40 hospitals before the first surgery of the day.',
        stats: [
            { value: '40', label: 'Hospitals served' },
            { value: '23:30', label: 'Latest cut-off' },
        ],
        image: img('1530521954074-e64f6810b32d'),
        alt: 'Traveller resting at an airport window as a plane takes off outside',
    },
    {
        year: 2015,
        label: 'Track',
        place: 'Chicago HQ',
        title: 'Meridian Track goes live',
        story: 'Our in-house team ships a live map of every pallet. Customers stop calling to ask where things are, and calls to the service desk drop by almost two thirds.',
        stats: [
            { value: '−62%', label: '“Where is it?” calls' },
            { value: '38,000', label: 'Pallets tracked daily' },
        ],
        image: img('1551288049-bebda4e38f71'),
        alt: 'Dark analytics dashboard with charts on a screen',
    },
    {
        year: 2019,
        label: 'New HQ',
        place: 'Fulton Market',
        title: 'A headquarters with windows',
        story: 'We move 240 people into a converted cold-storage building, with the dispatch floor right in the middle so everyone can still hear the phones ring.',
        stats: [
            { value: '1,140', label: 'Employees' },
            { value: '19', label: 'Hubs' },
        ],
        image: img('1504384308090-c894fdcc538d'),
        alt: 'Large open-plan office with rows of desks',
    },
    {
        year: 2022,
        label: 'Electric',
        place: 'Joliet, IL',
        title: 'Solar roofs, electric vans',
        story: 'The Joliet cross-dock gets 9,000 solar panels and 60 charging bays. Forty percent of our urban last-mile deliveries now run on electric vans.',
        stats: [
            { value: '40%', label: 'Electric last-mile' },
            { value: '11,800 t', label: 'CO₂ avoided a year' },
        ],
        image: img('1509391366360-2e959784a276'),
        alt: 'Rows of solar panels under a clear sky',
    },
    {
        year: 2026,
        label: 'Today',
        place: '14 countries',
        title: 'Today: 31 hubs, one promise',
        story: 'Twenty-eight years on, the promise is the one Dana made on South Halsted: if we say tomorrow morning, it is there tomorrow morning. Last year we kept it 98.7% of the time.',
        stats: [
            { value: '31', label: 'Hubs in 14 countries' },
            { value: '98.7%', label: 'On time in 2025' },
        ],
        image: img('1451187580459-43490279c0fa'),
        alt: 'City lights across the Earth at night seen from space',
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]'

export function YearRailAboutStory({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [active, setActive] = useState(0)
    const [previous, setPrevious] = useState(null)
    const railRef = useRef(null)
    const tabRefs = useRef([])
    const count = milestones.length
    const current = milestones[active]

    useEffect(() => {
        const rail = railRef.current
        const tab = tabRefs.current[active]
        if (!rail || !tab || rail.scrollWidth <= rail.clientWidth) return
        const left = tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2
        rail.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' })
    }, [active, reduceMotion])

    const goTo = (index, focus = false) => {
        const next = (index + count) % count
        if (next === active) return
        setPrevious(active)
        setActive(next)
        if (focus) tabRefs.current[next]?.focus()
    }

    const onKeyDown = (event) => {
        const keys = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: count - 1 }
        if (!(event.key in keys)) return
        event.preventDefault()
        goTo(keys[event.key], true)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0b1f3a] py-16 font-sans text-base font-normal text-[#e8eef7] md:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(232,238,247,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(232,238,247,0.04)_1px,transparent_1px)] [background-size:64px_64px]"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff6b1a]">
                            <span aria-hidden="true" className="inline-block size-2 rounded-full bg-[#ff6b1a]" />
                            Meridian Logistics · Our route so far
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-tight text-[#e8eef7] sm:text-5xl lg:text-6xl">
                            From two box trucks to 31 hubs,{' '}
                            <span className="text-[#e8eef7]/45">one promise at a time.</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 md:flex-col md:items-end">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#e8eef7]/60">
                            1998 → 2026 · 8 stops
                        </p>
                        <a
                            href="#meridian-map"
                            className={cn(
                                'group inline-flex min-h-11 items-center gap-2 border-b border-[#ff6b1a] text-sm font-semibold text-[#e8eef7] hover:text-[#ff6b1a]',
                                focusRing,
                            )}
                        >
                            Download the 2026 network map
                            <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>

                <div
                    ref={railRef}
                    className="relative -mx-4 mt-12 snap-x snap-mandatory overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
                >
                    <div
                        role="tablist"
                        aria-label="Milestones by year"
                        className="relative flex w-max md:w-full"
                        onKeyDown={onKeyDown}
                    >
                        <span
                            aria-hidden="true"
                            className="absolute top-[1.3rem] h-px bg-[#e8eef7]/20"
                            style={{ left: `${50 / count}%`, right: `${50 / count}%` }}
                        />
                        <motion.span
                            aria-hidden="true"
                            className="absolute top-[1.2rem] h-[3px] rounded-full bg-[#ff6b1a]"
                            style={{ left: `${50 / count}%` }}
                            initial={false}
                            animate={{ width: `${(active * 100) / count}%` }}
                            transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                        {milestones.map((milestone, index) => {
                            const selected = index === active
                            const visited = index < active
                            return (
                                <button
                                    key={milestone.year}
                                    ref={(node) => {
                                        tabRefs.current[index] = node
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`${uid}-tab-${index}`}
                                    aria-selected={selected}
                                    aria-controls={`${uid}-panel`}
                                    tabIndex={selected ? 0 : -1}
                                    className={cn(
                                        'group relative flex w-24 shrink-0 snap-center flex-col items-center gap-3 rounded-lg pb-2 pt-3 text-center md:w-auto md:flex-1',
                                        focusRing,
                                    )}
                                    onClick={() => goTo(index)}
                                >
                                    <span className="relative grid size-5 place-items-center">
                                        {selected && !reduceMotion && (
                                            <motion.span
                                                aria-hidden="true"
                                                className="absolute inset-0 rounded-full bg-[#ff6b1a]"
                                                animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                                                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                                            />
                                        )}
                                        <span
                                            className={cn(
                                                'relative rounded-full border-2 transition-all duration-300',
                                                selected
                                                    ? 'size-5 border-[#ff6b1a] bg-[#ff6b1a]'
                                                    : visited
                                                      ? 'size-3 border-[#ff6b1a] bg-[#ff6b1a]'
                                                      : 'size-3 border-[#e8eef7]/50 bg-[#0b1f3a] group-hover:border-[#e8eef7]',
                                            )}
                                        />
                                    </span>
                                    <span
                                        className={cn(
                                            'text-xl font-semibold tabular-nums tracking-tight transition-colors sm:text-2xl',
                                            selected ? 'text-[#e8eef7]' : 'text-[#e8eef7]/50 group-hover:text-[#e8eef7]/80',
                                        )}
                                    >
                                        {milestone.year}
                                    </span>
                                    <span
                                        className={cn(
                                            'font-mono text-[10px] uppercase tracking-[0.18em]',
                                            selected ? 'text-[#ff6b1a]' : 'text-[#e8eef7]/40',
                                        )}
                                    >
                                        {milestone.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div
                    id={`${uid}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${uid}-tab-${active}`}
                    className="mt-10 grid overflow-hidden rounded-2xl border border-[#e8eef7]/10 bg-[#081830] md:grid-cols-[1.1fr_1fr]"
                >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#13294b] md:aspect-auto md:min-h-[26rem]">
                        {previous !== null && (
                            <img
                                key={`previous-${milestones[previous].year}`}
                                src={milestones[previous].image}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        )}
                        <motion.img
                            key={current.year}
                            src={current.image}
                            alt={current.alt}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                            initial={
                                previous === null
                                    ? false
                                    : reduceMotion
                                      ? { opacity: 0 }
                                      : { clipPath: 'inset(0% 100% 0% 0%)', scale: 1.08 }
                            }
                            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                            transition={{ duration: reduceMotion ? 0.2 : 0.9, ease: [0.65, 0, 0.35, 1] }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-linear-to-t from-[#081830] via-[#081830]/10 to-transparent"
                        />
                        <p
                            aria-hidden="true"
                            className="absolute -bottom-4 left-4 text-[5.5rem] font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(255,107,26,0.85)] sm:text-[8rem] lg:text-[10rem]"
                        >
                            {current.year}
                        </p>
                        <p className="absolute left-4 top-4 rounded-full bg-[#081830]/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#e8eef7] backdrop-blur">
                            MRD-{current.year} · {current.place}
                        </p>
                    </div>

                    <div className="flex min-h-[25rem] flex-col p-6 sm:p-8 lg:p-10">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={current.year}
                                className="flex-1"
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#ff6b1a]">
                                    Stop {String(active + 1).padStart(2, '0')} of {String(count).padStart(2, '0')}
                                </p>
                                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-[#e8eef7] sm:text-3xl">
                                    {current.title}
                                </h3>
                                <p className="mt-4 leading-relaxed text-[#e8eef7]/75">{current.story}</p>
                                <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-[#e8eef7]/10 pt-6">
                                    {current.stats.map((stat) => (
                                        <div key={stat.label}>
                                            <dt className="text-xs uppercase tracking-[0.14em] text-[#e8eef7]/55">{stat.label}</dt>
                                            <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-[#ff6b1a] sm:text-4xl">
                                                {stat.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-8 flex items-center justify-between gap-4">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#e8eef7]/10">
                                <motion.div
                                    className="h-full rounded-full bg-[#ff6b1a]"
                                    initial={false}
                                    animate={{ width: `${((active + 1) / count) * 100}%` }}
                                    transition={{ duration: reduceMotion ? 0 : 0.5 }}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    aria-label="Previous milestone"
                                    className={cn(
                                        'grid size-11 place-items-center rounded-full border border-[#e8eef7]/25 text-[#e8eef7] transition-colors hover:border-[#ff6b1a] hover:text-[#ff6b1a]',
                                        focusRing,
                                    )}
                                    onClick={() => goTo(active - 1)}
                                >
                                    <HiArrowLeft aria-hidden="true" className="size-5" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next milestone"
                                    className={cn(
                                        'grid size-11 place-items-center rounded-full bg-[#ff6b1a] text-[#0b1f3a] transition-colors hover:bg-[#ff8a4a]',
                                        focusRing,
                                    )}
                                    onClick={() => goTo(active + 1)}
                                >
                                    <HiArrowRight aria-hidden="true" className="size-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default YearRailAboutStory

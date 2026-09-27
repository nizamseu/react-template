// CategoryTabsAmenityChecklist

// AmenityChecklist03 · Booking & Reservations › Amenity & Service Checklist

// Description:
// A luxury amenities showcase for the Grand Aurelia Hotel in Vienna. Under the serif
// heading "Every comfort, quietly considered" four tabs — Room, Wellness, Dining, Family
// — each reveal an arched photo pair, an opening-hours line and a two-column icon list
// (e.g. "Pillow menu — seven fillings from buckwheat to goose down"). Use it on hotel
// home or rooms pages where guests compare what the property offers.

// Design:
// - Split header (heading left; intro + rotating "Since 1873" seal right), a 4-up tab row
//   with a gold underline, then lg: 5/12 photos + 7/12 list; stacks below lg
// - Ivory #f8f4ec page, navy #1b2a4a type, gold #b8975a accents and hairlines, muted
//   #6b7280-ish navy for details; icons sit in 40px gold-ringed circles
// - Serif display type (text-4xl → lg: 6xl), main photo with an arched top (rounded-t-full)
//   and a small square photo overlapping its corner with an ivory border
// - framer-motion slides the gold underline between tabs, cross-fades panels and staggers
//   list rows; the seal rotates slowly unless reduced motion is on
// - Tabs keep icons hidden below sm; list is 1 → sm: 2 columns

// What it does:
// - active (role="tablist" / "tab" / "tabpanel") switches categories by click, arrow
//   keys, Home and End; only the active tab is in the tab order
// - Each category lists 7 amenities with details, a count on its tab and an hours line
// - "Ask the concierge" links to #concierge-request; photos and the seal are visual-only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CategoryTabsAmenityChecklist from '@/TestComponent/PageSections/booking/AmenityChecklist03';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <CategoryTabsAmenityChecklist />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    LuArrowRight,
    LuBaby,
    LuBath,
    LuBedDouble,
    LuBookOpen,
    LuCake,
    LuChefHat,
    LuClock,
    LuCoffee,
    LuConciergeBell,
    LuDumbbell,
    LuFlower2,
    LuHeartPulse,
    LuMartini,
    LuMoon,
    LuPalette,
    LuPuzzle,
    LuShirt,
    LuSmile,
    LuSparkles,
    LuTv,
    LuUsers,
    LuUtensils,
    LuWaves,
    LuWine,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const tabs = [
    {
        id: 'room',
        label: 'Room',
        Icon: LuBedDouble,
        lead: 'Suites dressed in walnut and silk, with windows that open onto the Ring.',
        hours: 'Turndown from 18:00 · housekeeping twice daily',
        photos: [
            {
                src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80',
                alt: 'Warm suite with a dark-wood headboard, lamps and a made bed',
            },
            {
                src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=500&q=80',
                alt: 'Classic room with a sofa at the foot of the bed',
            },
        ],
        caption: 'The Aurelia Suite, fourth floor',
        items: [
            { name: 'Frette linens', detail: '400-thread-count Egyptian cotton', Icon: LuBedDouble },
            { name: 'Pillow menu', detail: 'Seven fillings, buckwheat to goose down', Icon: LuMoon },
            { name: 'Marble bathroom', detail: 'Heated floors and a deep soaking tub', Icon: LuBath },
            { name: 'Viennese tea & coffee', detail: 'Loose-leaf teas and a bean-to-cup machine', Icon: LuCoffee },
            { name: 'Evening turndown', detail: 'With chocolates from a Graben confiserie', Icon: LuSparkles },
            { name: 'Pressing service', detail: 'Two garments pressed free each stay', Icon: LuShirt },
            { name: '55" smart TV', detail: 'Cast from your phone, 120 channels', Icon: LuTv },
        ],
    },
    {
        id: 'wellness',
        label: 'Wellness',
        Icon: LuFlower2,
        lead: 'A vaulted spa beneath the courtyard, lit by candles and warmed by stone.',
        hours: 'Spa 07:00 – 22:00 · pool until 21:00',
        photos: [
            {
                src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
                alt: 'Therapist giving a guest a calming facial treatment',
            },
            {
                src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80',
                alt: 'Hotel pool glowing blue at dusk',
            },
        ],
        caption: 'Treatment room three, the Aurelia Spa',
        items: [
            { name: '20 m indoor pool', detail: 'Salt-water, heated to 29 °C', Icon: LuWaves },
            { name: 'Finnish sauna & steam', detail: 'Plus an ice fountain between rounds', Icon: LuSparkles },
            { name: 'Six treatment rooms', detail: 'Massages from €95 for 50 minutes', Icon: LuFlower2 },
            { name: '24-hour fitness studio', detail: 'Free weights, rowers and a Pilates reformer', Icon: LuDumbbell },
            { name: 'Rooftop yoga', detail: 'Saturday and Sunday at 08:00', Icon: LuHeartPulse },
            { name: 'Robes & slippers', detail: 'Waiting in every room', Icon: LuShirt },
            { name: 'Hammam ritual', detail: 'Two-hour ritual for couples, book a day ahead', Icon: LuBath },
        ],
    },
    {
        id: 'dining',
        label: 'Dining',
        Icon: LuUtensils,
        lead: 'Three rooms, one kitchen, and a cellar that has been filling since 1873.',
        hours: 'Breakfast 06:30 – 10:30 · bar until 01:00',
        photos: [
            {
                src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
                alt: 'Plated fine-dining course on a set table',
            },
            {
                src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80',
                alt: 'Dark, modern dining room with low lighting',
            },
        ],
        caption: 'Restaurant Lindenhof, seven-course menu',
        items: [
            { name: 'Aurelia Salon', detail: 'À la carte breakfast under the chandeliers', Icon: LuCoffee },
            { name: 'Restaurant Lindenhof', detail: 'Seasonal Austrian tasting menu, €145', Icon: LuChefHat },
            { name: 'Bar 1873', detail: 'Cocktails and a 40-strong gin list', Icon: LuMartini },
            { name: 'In-room dining', detail: 'Full menu around the clock', Icon: LuConciergeBell },
            { name: 'Afternoon tea', detail: 'Chocolate torte and finger sandwiches, 15:00', Icon: LuCake },
            { name: 'Cellar tastings', detail: 'Wachau whites every Thursday', Icon: LuWine },
            { name: 'Private dining', detail: 'The Library seats twelve', Icon: LuUsers },
        ],
    },
    {
        id: 'family',
        label: 'Family',
        Icon: LuSmile,
        lead: 'Small guests get the same welcome as the grown-ups — and their own concierge.',
        hours: 'Kids’ club 09:00 – 18:00 · ages 4 – 12',
        photos: [
            {
                src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
                alt: 'Bright family suite living room with two sofas',
            },
            {
                src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=80',
                alt: 'Stack of colourful children’s books',
            },
        ],
        caption: 'A two-bedroom family suite',
        items: [
            { name: 'Connecting rooms', detail: 'And six two-bedroom family suites', Icon: LuUsers },
            { name: 'Kids’ club', detail: 'Crafts, a puppet theatre and garden games', Icon: LuPuzzle },
            { name: 'Babysitting', detail: 'Vetted sitters from €18 an hour', Icon: LuBaby },
            { name: 'Cots & baby baths', detail: 'Free, set up before you arrive', Icon: LuBedDouble },
            { name: 'Children’s menu', detail: 'Plus high chairs in every restaurant', Icon: LuUtensils },
            { name: 'Welcome bag', detail: 'A Vienna colouring book and pencils', Icon: LuPalette },
            { name: 'Story hour', detail: 'In the library, Sundays at 17:00', Icon: LuBookOpen },
        ],
    },
]

export function CategoryTabsAmenityChecklist({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [active, setActive] = useState(tabs[0].id)
    const tabRefs = useRef([])
    const tab = tabs.find((t) => t.id === active) ?? tabs[0]

    const onKeyDown = (e, index) => {
        const last = tabs.length - 1
        let next = null
        if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1
        if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
        if (e.key === 'Home') next = 0
        if (e.key === 'End') next = last
        if (next === null) return
        e.preventDefault()
        setActive(tabs[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#f8f4ec] py-16 text-base font-normal text-[#1b2a4a] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b8975a]">
                            <span className="h-px w-10 bg-[#b8975a]" aria-hidden="true" />
                            Grand Aurelia Hotel · Amenities
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-tight text-[#1b2a4a] sm:text-5xl lg:text-6xl">
                            Every comfort, <em className="text-[#b8975a]">quietly</em> considered
                        </h2>
                    </div>
                    <div className="flex items-center gap-6 lg:col-span-5 lg:justify-end">
                        <p className="max-w-sm text-sm leading-relaxed text-[#1b2a4a]/70">
                            One hundred and twelve rooms on the Kärntner Ring, looked after by a team that
                            still writes your name on the breakfast card.
                        </p>
                        <motion.svg
                            viewBox="0 0 100 100"
                            className="size-20 shrink-0 text-[#b8975a] sm:size-24"
                            animate={reduceMotion ? undefined : { rotate: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                            aria-hidden="true"
                        >
                            <defs>
                                <path id={`${uid}-seal`} d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
                            </defs>
                            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.8" />
                            <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.8" />
                            <text fontSize="8.4" letterSpacing="2.2" fill="currentColor" fontFamily="ui-serif, Georgia, serif">
                                <textPath href={`#${uid}-seal`}>GRAND AURELIA · VIENNA · SINCE 1873 ·</textPath>
                            </text>
                            <text x="50" y="57" textAnchor="middle" fontSize="20" fill="currentColor" fontFamily="ui-serif, Georgia, serif">
                                GA
                            </text>
                        </motion.svg>
                    </div>
                </div>

                <div role="tablist" aria-label="Amenity categories" className="mt-12 grid grid-cols-4 border-b border-[#b8975a]/30">
                    {tabs.map((t, i) => {
                        const on = t.id === active
                        const Icon = t.Icon
                        return (
                            <button
                                key={t.id}
                                ref={(el) => {
                                    tabRefs.current[i] = el
                                }}
                                type="button"
                                role="tab"
                                id={`${uid}-tab-${t.id}`}
                                aria-selected={on}
                                aria-controls={`${uid}-panel`}
                                tabIndex={on ? 0 : -1}
                                className={cn(
                                    'relative flex min-h-14 items-center justify-center gap-2 px-1 pb-4 pt-2 font-serif text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a] sm:justify-start sm:text-lg md:text-xl',
                                    on ? 'text-[#1b2a4a]' : 'text-[#1b2a4a]/45 hover:text-[#1b2a4a]/80',
                                )}
                                onClick={() => setActive(t.id)}
                                onKeyDown={(e) => onKeyDown(e, i)}
                            >
                                <Icon className="hidden size-5 text-[#b8975a] sm:block" aria-hidden="true" />
                                {t.label}
                                <sup className="hidden font-sans text-[10px] font-semibold text-[#b8975a] sm:inline">{t.items.length}</sup>
                                {on && (
                                    <motion.span
                                        layoutId={`${uid}-underline`}
                                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38 }}
                                        className="absolute inset-x-0 -bottom-px h-[3px] bg-[#b8975a]"
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>

                <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab.id}`} className="mt-10 lg:mt-14">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={tab.id}
                            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="grid gap-12 lg:grid-cols-12 lg:gap-14"
                        >
                            <figure className="lg:col-span-5">
                                <div className="relative pb-8 pr-8 sm:pb-10 sm:pr-10">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[28px] bg-[#ece3d2]">
                                        <img src={tab.photos[0].src} alt={tab.photos[0].alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                                        <span className="pointer-events-none absolute inset-3 rounded-t-full rounded-b-[20px] border border-[#f8f4ec]/60" aria-hidden="true" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 aspect-square w-2/5 overflow-hidden rounded-[22px] border-[6px] border-[#f8f4ec] bg-[#ece3d2] shadow-[0_24px_40px_-24px_rgba(27,42,74,0.6)]">
                                        <img src={tab.photos[1].src} alt={tab.photos[1].alt} loading="lazy" className="h-full w-full object-cover" />
                                    </div>
                                </div>
                                <figcaption className="mt-4 font-serif text-sm italic text-[#1b2a4a]/60">{tab.caption}</figcaption>
                            </figure>

                            <div className="lg:col-span-7">
                                <p className="max-w-xl font-serif text-2xl leading-snug text-[#1b2a4a] sm:text-[28px]">{tab.lead}</p>
                                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#b8975a]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1b2a4a]/80">
                                    <LuClock className="size-4 text-[#b8975a]" aria-hidden="true" />
                                    {tab.hours}
                                </p>
                                <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                    {tab.items.map((item, i) => {
                                        const Icon = item.Icon
                                        return (
                                            <motion.li
                                                key={item.name}
                                                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.05 + i * 0.04 }}
                                                className="flex gap-4"
                                            >
                                                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#b8975a]/60 text-[#b8975a]">
                                                    <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden="true" />
                                                </span>
                                                <span className="flex-1 border-b border-[#b8975a]/20 pb-4">
                                                    <span className="block text-[15px] font-semibold text-[#1b2a4a]">{item.name}</span>
                                                    <span className="mt-1 block text-sm leading-snug text-[#1b2a4a]/60">{item.detail}</span>
                                                </span>
                                            </motion.li>
                                        )
                                    })}
                                </ul>
                                <a
                                    href="#concierge-request"
                                    className="group mt-10 inline-flex min-h-11 items-center gap-3 font-serif text-lg text-[#1b2a4a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b8975a]"
                                >
                                    <span className="border-b border-[#b8975a] pb-0.5">Anything else? Ask the concierge</span>
                                    <LuArrowRight className="size-5 text-[#b8975a] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                                </a>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default CategoryTabsAmenityChecklist

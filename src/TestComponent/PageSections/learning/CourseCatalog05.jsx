// PastelStickerBoardCourseCatalog

// CourseCatalog05 · Learning Management Systems › Course Catalog

// Description:
// A playful sticker-board catalogue for Little Sprouts Learning, a fictional after-school
// studio for kids. Under "Little hands, big ideas." parents switch between Art, Music,
// Science and Words tabs and narrow by age (All ages / 3–5 / 6–8 / 9–12); each class is a
// tilted sticker card with a big friendly icon, age range, day and time, number of weeks,
// price, spots left and a "Save a spot" toggle. Use it on a children's class or holiday
// club page where the tone should feel warm and hands-on.

// Design:
// - Cream #fff8ec board with doodled SVG stars, squiggles and dots; ink #2b2340 text; each
//   topic owns a pastel: Art peach #ffd6c0, Music lilac #e3d7ff, Science mint #c7f0db,
//   Words butter #fff1a8
// - Cards are rounded-3xl stickers with a 4px white die-cut border, a hard 6px drop shadow
//   and a peeled corner; each sits at a small tilt (-2° to 2.5°) and straightens and lifts
//   on hover/focus (tilt kept, no motion for reduced motion)
// - Chunky rounded-full tabs with icons and a 2px ink outline; age chips below; heading
//   font-black text-4xl → md:text-6xl with a butter blob behind "big ideas"
// - Grid grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4; tabs and chips wrap on small
//   screens, cards pop in with a springy scale when the tab or age changes

// What it does:
// - topic and age state: tabs (role="tablist", arrow keys / Home / End move between them)
//   pick the topic; age chips (aria-pressed) keep classes whose age range overlaps
// - saved state: "Save a spot" toggles to "Spot saved" with a check icon per class
//   (aria-pressed); an aria-live line under the grid counts the saved spots
// - If a topic has no class for the chosen age, a friendly empty card suggests "Show all
//   ages"; "See the term calendar" links to #sprouts-calendar

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PastelStickerBoardCourseCatalog from '@/TestComponent/PageSections/learning/CourseCatalog05';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <PastelStickerBoardCourseCatalog />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    LuArrowRight,
    LuBookOpen,
    LuBug,
    LuCalendarDays,
    LuCheck,
    LuCloudSun,
    LuDrama,
    LuDrum,
    LuFeather,
    LuFlaskConical,
    LuGuitar,
    LuMicVocal,
    LuMusic,
    LuPaintbrush,
    LuPalette,
    LuRocket,
    LuScissors,
    LuSearch,
    LuShapes,
    LuSprout,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const topics = [
    { id: 'art', label: 'Art', icon: LuPalette, tint: 'bg-[#ffd6c0]' },
    { id: 'music', label: 'Music', icon: LuMusic, tint: 'bg-[#e3d7ff]' },
    { id: 'science', label: 'Science', icon: LuFlaskConical, tint: 'bg-[#c7f0db]' },
    { id: 'words', label: 'Words', icon: LuBookOpen, tint: 'bg-[#fff1a8]' },
]

const ages = [
    { id: 'all', label: 'All ages', range: [0, 99] },
    { id: '3-5', label: '3–5', range: [3, 5] },
    { id: '6-8', label: '6–8', range: [6, 8] },
    { id: '9-12', label: '9–12', range: [9, 12] },
]

const classes = [
    { id: 'messy-painting', topic: 'art', title: 'Messy Painting Club', icon: LuPaintbrush, ages: [3, 5], when: 'Sat 9:30–10:30', weeks: 6, price: 84, spots: 3 },
    { id: 'collage', topic: 'art', title: 'Collage & Cut-outs', icon: LuScissors, ages: [4, 7], when: 'Wed 15:45–16:45', weeks: 6, price: 78, spots: 6 },
    { id: 'clay-creatures', topic: 'art', title: 'Clay Creatures', icon: LuShapes, ages: [6, 8], when: 'Sat 11:00–12:15', weeks: 8, price: 126, spots: 2 },
    { id: 'comic-studio', topic: 'art', title: 'Comic Strip Studio', icon: LuPalette, ages: [9, 12], when: 'Thu 16:00–17:15', weeks: 8, price: 118, spots: 5 },
    { id: 'rhythm-rhymes', topic: 'music', title: 'Rhythm & Rhymes', icon: LuDrum, ages: [3, 5], when: 'Tue 10:00–10:45', weeks: 6, price: 72, spots: 4 },
    { id: 'little-choir', topic: 'music', title: 'Little Choir', icon: LuMicVocal, ages: [5, 8], when: 'Fri 16:00–17:00', weeks: 10, price: 110, spots: 9 },
    { id: 'first-ukulele', topic: 'music', title: 'My First Ukulele', icon: LuGuitar, ages: [6, 9], when: 'Sat 10:00–11:00', weeks: 8, price: 132, spots: 1 },
    { id: 'beat-lab', topic: 'music', title: 'Beat-Making Lab', icon: LuMusic, ages: [9, 12], when: 'Wed 17:00–18:15', weeks: 6, price: 108, spots: 7 },
    { id: 'bug-detectives', topic: 'science', title: 'Bug Detectives', icon: LuBug, ages: [4, 6], when: 'Sat 9:00–10:00', weeks: 5, price: 70, spots: 5 },
    { id: 'weather-watchers', topic: 'science', title: 'Weather Watchers', icon: LuCloudSun, ages: [5, 8], when: 'Mon 15:45–16:45', weeks: 6, price: 80, spots: 8 },
    { id: 'kitchen-chemistry', topic: 'science', title: 'Kitchen Chemistry', icon: LuFlaskConical, ages: [7, 10], when: 'Thu 16:00–17:15', weeks: 6, price: 96, spots: 2 },
    { id: 'rocket-club', topic: 'science', title: 'Build a Rocket', icon: LuRocket, ages: [9, 12], when: 'Sat 13:00–14:30', weeks: 8, price: 144, spots: 4 },
    { id: 'story-sprouts', topic: 'words', title: 'Story Sprouts', icon: LuBookOpen, ages: [3, 5], when: 'Sun 10:00–10:45', weeks: 6, price: 66, spots: 10 },
    { id: 'puppet-stories', topic: 'words', title: 'Puppet Theatre Stories', icon: LuDrama, ages: [5, 7], when: 'Wed 15:30–16:30', weeks: 6, price: 82, spots: 3 },
    { id: 'young-poets', topic: 'words', title: 'Young Poets', icon: LuFeather, ages: [8, 11], when: 'Tue 16:30–17:30', weeks: 6, price: 76, spots: 6 },
    { id: 'mystery-writers', topic: 'words', title: 'Mystery Writers Club', icon: LuSearch, ages: [10, 12], when: 'Fri 17:00–18:00', weeks: 8, price: 98, spots: 5 },
]

const tilts = [-2, 1.5, -1, 2.5]

export function PastelStickerBoardCourseCatalog({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [topic, setTopic] = useState('art')
    const [age, setAge] = useState('all')
    const [saved, setSaved] = useState([])
    const tabRefs = useRef([])

    const current = topics.find((t) => t.id === topic)
    const [minAge, maxAge] = ages.find((a) => a.id === age).range
    const visible = classes.filter((c) => c.topic === topic && c.ages[0] <= maxAge && c.ages[1] >= minAge)

    const onTabKeyDown = (event, index) => {
        const last = topics.length - 1
        let next = null
        if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
        if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = last
        if (next === null) return
        event.preventDefault()
        setTopic(topics[next].id)
        tabRefs.current[next]?.focus()
    }

    const toggleSaved = (id) => {
        setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fff8ec] px-4 py-16 text-base font-normal text-[#2b2340] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <svg className="pointer-events-none absolute left-[6%] top-10 h-10 w-10 text-[#ffd6c0]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 1l2.9 7.1L22 9l-5.5 4.9L18 21l-6-3.7L6 21l1.5-7.1L2 9l7.1-.9z" fill="currentColor" />
            </svg>
            <svg className="pointer-events-none absolute right-[8%] top-24 hidden h-8 w-28 text-[#e3d7ff] md:block" viewBox="0 0 120 30" aria-hidden="true">
                <path d="M2 15 Q 17 0, 32 15 T 62 15 T 92 15 T 118 15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <span className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#c7f0db]/70" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-24 right-[5%] h-5 w-5 rounded-full bg-[#fff1a8]" aria-hidden="true" />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-[#c7f0db] px-4 py-2 text-sm font-bold text-[#2b2340]">
                            <LuSprout className="h-4 w-4" aria-hidden="true" />
                            Little Sprouts Learning · Spring term
                        </p>
                        <h2 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-[#2b2340] sm:text-5xl md:text-6xl">
                            Little hands,{' '}
                            <span className="relative inline-block">
                                <span
                                    className="absolute -inset-x-2 inset-y-1 -rotate-2 rounded-[40%_60%_55%_45%] bg-[#fff1a8]"
                                    aria-hidden="true"
                                />
                                <span className="relative">big ideas.</span>
                            </span>
                        </h2>
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-[#2b2340]/75">
                            Small groups of eight, real materials and teachers who love the mess.
                            Classes run after school and on weekends from 12 January.
                        </p>
                    </div>
                    <a
                        href="#sprouts-calendar"
                        className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border-2 border-[#2b2340] bg-white px-5 text-sm font-bold text-[#2b2340] shadow-[0_4px_0_#2b2340] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2b2340] md:self-end"
                    >
                        <LuCalendarDays className="h-4 w-4" aria-hidden="true" />
                        See the term calendar
                    </a>
                </div>

                <div className="mt-10 flex flex-col gap-5 md:mt-12 lg:flex-row lg:items-center lg:justify-between">
                    <div role="tablist" aria-label="Class topics" className="flex flex-wrap gap-2 sm:gap-3">
                        {topics.map((t, index) => {
                            const Icon = t.icon
                            const selected = t.id === topic
                            return (
                                <button
                                    key={t.id}
                                    ref={(el) => {
                                        tabRefs.current[index] = el
                                    }}
                                    id={`sprouts-tab-${t.id}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls="sprouts-panel"
                                    tabIndex={selected ? 0 : -1}
                                    className={cn(
                                        'inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[#2b2340] px-4 text-base font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2b2340] sm:px-5',
                                        selected
                                            ? cn(t.tint, 'text-[#2b2340] shadow-[0_4px_0_#2b2340]')
                                            : 'bg-white/60 text-[#2b2340]/70 hover:bg-white hover:text-[#2b2340]',
                                    )}
                                    onClick={() => setTopic(t.id)}
                                    onKeyDown={(event) => onTabKeyDown(event, index)}
                                >
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                    {t.label}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by age">
                        <span className="mr-1 text-sm font-bold text-[#2b2340]/70">Ages</span>
                        {ages.map((a) => {
                            const on = a.id === age
                            return (
                                <button
                                    key={a.id}
                                    type="button"
                                    aria-pressed={on}
                                    className={cn(
                                        'min-h-10 rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2340]',
                                        on ? 'bg-[#2b2340] text-[#fff8ec]' : 'bg-white text-[#2b2340] ring-1 ring-[#2b2340]/15 hover:ring-[#2b2340]/40',
                                    )}
                                    onClick={() => setAge(a.id)}
                                >
                                    {a.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div
                    id="sprouts-panel"
                    role="tabpanel"
                    aria-labelledby={`sprouts-tab-${topic}`}
                    className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {visible.map((item, index) => {
                        const Icon = item.icon
                        const isSaved = saved.includes(item.id)
                        const tilt = tilts[index % tilts.length]
                        return (
                            <motion.article
                                key={`${topic}-${age}-${item.id}`}
                                initial={reduceMotion ? false : { scale: 0.85, rotate: tilt }}
                                animate={{ scale: 1, rotate: tilt }}
                                whileHover={reduceMotion ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 20, delay: reduceMotion ? 0 : index * 0.04 }}
                                className={cn(
                                    'group relative flex flex-col rounded-3xl border-4 border-white p-5 shadow-[0_6px_0_rgba(43,35,64,0.18),0_22px_30px_-18px_rgba(43,35,64,0.45)] focus-within:ring-2 focus-within:ring-[#2b2340] focus-within:ring-offset-4 focus-within:ring-offset-[#fff8ec]',
                                    current.tint,
                                )}
                            >
                                <span
                                    className="absolute -right-1 -top-1 h-9 w-9 rounded-bl-[18px] rounded-tr-[20px] bg-white shadow-[-3px_3px_6px_-2px_rgba(43,35,64,0.25)]"
                                    aria-hidden="true"
                                />
                                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/80 text-[#2b2340] shadow-[inset_0_-3px_0_rgba(43,35,64,0.08)]">
                                    <Icon className="h-9 w-9" aria-hidden="true" />
                                </span>
                                <span className="mt-4 inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-[#2b2340]">
                                    Ages {item.ages[0]}–{item.ages[1]}
                                </span>
                                <h3 className="mt-3 text-xl font-black leading-tight text-[#2b2340]">{item.title}</h3>
                                <ul className="mt-3 space-y-1 text-sm text-[#2b2340]/80">
                                    <li>{item.when}</li>
                                    <li>
                                        {item.weeks} weeks · <span className="font-bold text-[#2b2340]">${item.price}</span>
                                    </li>
                                </ul>
                                <p className={cn('mt-2 text-xs font-bold', item.spots <= 3 ? 'text-[#c2410c]' : 'text-[#2b2340]/60')}>
                                    {item.spots === 1 ? 'Last spot!' : `${item.spots} spots left`}
                                </p>
                                <button
                                    type="button"
                                    aria-pressed={isSaved}
                                    className={cn(
                                        'mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-[#2b2340] px-4 text-sm font-black transition-colors focus-visible:outline-none',
                                        isSaved ? 'bg-[#2b2340] text-white' : 'bg-white text-[#2b2340] hover:bg-[#fff8ec]',
                                    )}
                                    onClick={() => toggleSaved(item.id)}
                                >
                                    {isSaved ? (
                                        <>
                                            <LuCheck className="h-4 w-4" aria-hidden="true" />
                                            Spot saved
                                        </>
                                    ) : (
                                        <>
                                            Save a spot
                                            <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                                        </>
                                    )}
                                    <span className="sr-only"> in {item.title}</span>
                                </button>
                            </motion.article>
                        )
                    })}

                    {visible.length === 0 && (
                        <div className="col-span-full flex flex-col items-center rounded-3xl border-4 border-dashed border-[#2b2340]/20 bg-white/70 px-6 py-12 text-center">
                            <LuSprout className="h-12 w-12 text-[#2b2340]/40" aria-hidden="true" />
                            <h3 className="mt-3 text-2xl font-black text-[#2b2340]">
                                No {current.label.toLowerCase()} class for ages {ages.find((a) => a.id === age).label} yet
                            </h3>
                            <p className="mt-2 max-w-sm text-sm text-[#2b2340]/70">
                                Our teachers are planting new ideas every term. Peek at another age group
                                meanwhile!
                            </p>
                            <button
                                type="button"
                                className="mt-5 min-h-11 rounded-full bg-[#2b2340] px-5 text-sm font-black text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2b2340]"
                                onClick={() => setAge('all')}
                            >
                                Show all ages
                            </button>
                        </div>
                    )}
                </div>

                <p className="mt-10 text-sm font-bold text-[#2b2340]/70" aria-live="polite">
                    {saved.length === 0
                        ? 'Tap “Save a spot” on any sticker to hold it for 48 hours.'
                        : `${saved.length} spot${saved.length === 1 ? '' : 's'} saved · we will hold them for 48 hours.`}
                </p>
            </div>
        </section>
    )
}

export default PastelStickerBoardCourseCatalog

// SpotlightMaestroInstructorProfiles

// InstructorProfiles02 · Learning Management Systems › Instructor / Mentor Profiles

// Description:
// A concert-hall spotlight for the fictional Maestro Music Lab. Under "Learn from the ones
// who still play every night." one featured mentor fills a large stage-lit portrait next
// to their instrument, credential, a serif pull quote, three stats (students, rating,
// years) and a "Book a trial lesson" CTA. A row of five avatar buttons (piano, jazz
// guitar, voice, drums, violin) swaps the featured mentor. Use it on a music-school or
// masterclass landing page.

// Design:
// - Black #0b0b0b stage with ivory #f6f1e3 text and gold #c9a227 hairlines, eyebrow,
//   quote marks, active ring and CTA; a gold glow over the stage and an ivory
//   spotlight on the portrait
// - Two columns from lg (portrait 5fr / copy 6fr); portrait aspect-[4/5] rounded-[28px]
//   with a bottom scrim, instrument chip and "01 / 05" counter
// - Serif name text-5xl → lg:text-7xl, italic serif pull quote, stats in a 3-column dl
//   between gold rules with tabular numerals
// - Portrait and copy crossfade with AnimatePresence (images overlap, copy fades up);
//   durations drop to 0 for reduced motion
// - Responsive: single column with the portrait first; avatars scroll-snap horizontally
//   below lg and become a 5-column grid from lg; everything centred in max-w-7xl

// What it does:
// - activeIndex state; avatar buttons set it (aria-pressed), ArrowLeft/ArrowRight/Home/
//   End move between avatars and focus follows, the counter and an aria-live line update
// - "Book a trial lesson" links to #trial-<mentor-slug>, "Watch a free lesson" to
//   #free-lesson-<mentor-slug>; the spotlight and rules are decorative only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SpotlightMaestroInstructorProfiles from '@/TestComponent/PageSections/learning/InstructorProfiles02';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <SpotlightMaestroInstructorProfiles />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiOutlinePlay, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const mentors = [
    {
        id: 'eleanor-vance',
        name: 'Eleanor Vance',
        instrument: 'Piano',
        credential: 'Former principal pianist, Halden Symphony Orchestra',
        quote: 'Slow practice isn’t the punishment. It’s the shortcut nobody wants to take.',
        students: '3,120',
        rating: '4.9',
        years: 22,
        next: 'Chopin Nocturnes, bar by bar · Sat 10 Oct',
        image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1000&q=80',
        alt: 'Eleanor Vance photographed against a dark backdrop',
    },
    {
        id: 'julian-okafor',
        name: 'Julian Okafor',
        instrument: 'Jazz guitar',
        credential: 'Session guitarist with 400+ studio credits',
        quote: 'Learn the melody first. The chords are just the furniture it sits on.',
        students: '1,870',
        rating: '4.8',
        years: 14,
        next: 'Comping for Singers · Tue 13 Oct',
        image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=1000&q=80',
        alt: 'Julian Okafor photographed against a dark backdrop',
    },
    {
        id: 'sofia-marchetti',
        name: 'Sofia Marchetti',
        instrument: 'Voice · soprano',
        credential: 'Opera soprano with 60 principal roles',
        quote: 'Your voice is already there. My job is to get the tension out of its way.',
        students: '2,460',
        rating: '5.0',
        years: 19,
        next: 'Breath Before Belting · Thu 15 Oct',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
        alt: 'Sofia Marchetti with long hair against a dark backdrop',
    },
    {
        id: 'rafael-mendes',
        name: 'Rafael Mendes',
        instrument: 'Drums & percussion',
        credential: 'Touring drummer, 31 countries and counting',
        quote: 'Groove is a promise to the band: I’ll be exactly where you expect me.',
        students: '1,540',
        rating: '4.9',
        years: 17,
        next: 'Ghost Notes & Pocket · Mon 19 Oct',
        image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=1000&q=80',
        alt: 'Black-and-white portrait of Rafael Mendes, bearded and bald',
    },
    {
        id: 'mei-lin',
        name: 'Mei Lin',
        instrument: 'Violin',
        credential: 'First violin, Aster String Quartet',
        quote: 'Intonation is listening, not fingers. We’ll spend a lot of time just listening.',
        students: '2,050',
        rating: '4.9',
        years: 16,
        next: 'Bach Partitas for Adults · Wed 21 Oct',
        image: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=1000&q=80',
        alt: 'Black-and-white portrait of Mei Lin against a dark backdrop',
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a227]'

export function SpotlightMaestroInstructorProfiles({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [activeIndex, setActiveIndex] = useState(0)
    const avatarRefs = useRef([])
    const mentor = mentors[activeIndex]
    const fade = reduceMotion ? 0 : 0.6

    const select = (index, moveFocus = false) => {
        const next = (index + mentors.length) % mentors.length
        setActiveIndex(next)
        if (moveFocus) avatarRefs.current[next]?.focus()
    }

    const onAvatarKeyDown = (event, index) => {
        const keys = {
            ArrowRight: index + 1,
            ArrowDown: index + 1,
            ArrowLeft: index - 1,
            ArrowUp: index - 1,
            Home: 0,
            End: mentors.length - 1,
        }
        if (!(event.key in keys)) return
        event.preventDefault()
        select(keys[event.key], true)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0b0b0b] px-4 py-16 text-base font-normal text-[#f6f1e3] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] max-w-none -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.16),transparent_65%)]"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 border-b border-[#c9a227]/25 pb-10 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c9a227]">
                            Maestro Music Lab · Faculty spotlight
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#f6f1e3] sm:text-5xl lg:text-6xl">
                            Learn from the ones who still <em className="text-[#c9a227]">play every night</em>.
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-[#f6f1e3]/65">
                        Weekly 1:1 video lessons, recorded masterclasses and a practice plan written for
                        your hands, your voice, your schedule.
                    </p>
                </div>

                <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
                    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[28px] bg-[#161616] ring-1 ring-[#c9a227]/25 lg:max-w-none">
                        <AnimatePresence initial={false}>
                            <motion.img
                                key={mentor.id}
                                src={mentor.image}
                                alt={mentor.alt}
                                initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: fade * 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </AnimatePresence>
                        <div
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-5%,rgba(246,241,227,0.22),transparent_55%)] mix-blend-screen"
                            aria-hidden="true"
                        />
                        <div
                            className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0b0b0b] via-[#0b0b0b]/10 to-transparent"
                            aria-hidden="true"
                        />
                        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 sm:inset-x-7 sm:bottom-7">
                            <span className="rounded-full border border-[#c9a227]/70 bg-[#0b0b0b]/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a227] backdrop-blur">
                                {mentor.instrument}
                            </span>
                            <span className="font-serif text-lg tabular-nums text-[#f6f1e3]/85" aria-hidden="true">
                                0{activeIndex + 1}
                                <span className="text-[#f6f1e3]/40"> / 0{mentors.length}</span>
                            </span>
                        </div>
                    </div>

                    <div className="min-w-0">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={mentor.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                                transition={{ duration: fade * 0.6, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a227]">
                                    Now in the spotlight
                                </p>
                                <h3 className="mt-3 font-serif text-5xl font-normal leading-[0.95] tracking-tight text-[#f6f1e3] sm:text-6xl lg:text-7xl">
                                    {mentor.name}
                                </h3>
                                <p className="mt-3 text-sm text-[#f6f1e3]/65 sm:text-base">{mentor.credential}</p>

                                <blockquote className="relative mt-8 pl-9 sm:pl-12">
                                    <span
                                        className="absolute -top-3 left-0 font-serif text-6xl leading-none text-[#c9a227] sm:text-7xl"
                                        aria-hidden="true"
                                    >
                                        “
                                    </span>
                                    <p className="font-serif text-2xl italic leading-snug text-[#f6f1e3] sm:text-3xl">
                                        {mentor.quote}
                                    </p>
                                </blockquote>

                                <dl className="mt-9 grid grid-cols-3 divide-x divide-[#c9a227]/25 border-y border-[#c9a227]/25">
                                    <div className="py-4 pr-3">
                                        <dt className="text-[10px] uppercase tracking-[0.2em] text-[#f6f1e3]/55 sm:text-[11px]">
                                            Students
                                        </dt>
                                        <dd className="mt-1 font-serif text-2xl tabular-nums text-[#f6f1e3] sm:text-4xl">
                                            {mentor.students}
                                        </dd>
                                    </div>
                                    <div className="px-3 py-4 sm:px-5">
                                        <dt className="text-[10px] uppercase tracking-[0.2em] text-[#f6f1e3]/55 sm:text-[11px]">
                                            Rating
                                        </dt>
                                        <dd className="mt-1 flex items-center gap-1.5 font-serif text-2xl tabular-nums text-[#f6f1e3] sm:text-4xl">
                                            {mentor.rating}
                                            <HiStar className="h-4 w-4 text-[#c9a227] sm:h-5 sm:w-5" aria-hidden="true" />
                                        </dd>
                                    </div>
                                    <div className="py-4 pl-3 sm:pl-5">
                                        <dt className="text-[10px] uppercase tracking-[0.2em] text-[#f6f1e3]/55 sm:text-[11px]">
                                            Years teaching
                                        </dt>
                                        <dd className="mt-1 font-serif text-2xl tabular-nums text-[#f6f1e3] sm:text-4xl">
                                            {mentor.years}
                                        </dd>
                                    </div>
                                </dl>

                                <p className="mt-6 text-sm text-[#f6f1e3]/65">
                                    <span className="text-[#c9a227]">Next masterclass —</span> {mentor.next}
                                </p>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <a
                                        href={`#trial-${mentor.id}`}
                                        className={cn(
                                            'group/cta inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c9a227] px-7 text-sm font-semibold text-[#0b0b0b] transition-colors hover:bg-[#e0bb3f]',
                                            focusRing,
                                        )}
                                    >
                                        Book a trial lesson
                                        <HiArrowRight
                                            className="h-4 w-4 transition-transform group-hover/cta:translate-x-1"
                                            aria-hidden="true"
                                        />
                                    </a>
                                    <a
                                        href={`#free-lesson-${mentor.id}`}
                                        className={cn(
                                            'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#f6f1e3]/25 px-6 text-sm font-semibold text-[#f6f1e3] transition-colors hover:border-[#c9a227] hover:text-[#c9a227]',
                                            focusRing,
                                        )}
                                    >
                                        <HiOutlinePlay className="h-4 w-4" aria-hidden="true" />
                                        Watch a free lesson
                                    </a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-14 border-t border-[#c9a227]/25 pt-8">
                    <p id="maestro-picker-label" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f6f1e3]/55">
                        Choose your maestro
                    </p>
                    <p className="sr-only" aria-live="polite">
                        {`Showing ${mentor.name}, ${mentor.instrument}, ${activeIndex + 1} of ${mentors.length}`}
                    </p>
                    <div
                        role="group"
                        aria-labelledby="maestro-picker-label"
                        className="-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0"
                    >
                        {mentors.map((person, index) => {
                            const isActive = index === activeIndex
                            return (
                                <button
                                    key={person.id}
                                    ref={(node) => {
                                        avatarRefs.current[index] = node
                                    }}
                                    type="button"
                                    aria-pressed={isActive}
                                    aria-label={`${person.name}, ${person.instrument}`}
                                    onClick={() => select(index)}
                                    onKeyDown={(event) => onAvatarKeyDown(event, index)}
                                    className={cn(
                                        'group flex min-h-14 shrink-0 snap-start items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-4 text-left transition-colors lg:pr-3',
                                        isActive
                                            ? 'border-[#c9a227] bg-[#c9a227]/10'
                                            : 'border-[#f6f1e3]/15 hover:border-[#f6f1e3]/40',
                                        focusRing,
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-[#0b0b0b] transition',
                                            isActive ? 'ring-[#c9a227]' : 'ring-transparent grayscale',
                                        )}
                                    >
                                        <img
                                            src={person.image}
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    </span>
                                    <span className="min-w-0">
                                        <span
                                            className={cn(
                                                'block truncate text-sm font-semibold',
                                                isActive ? 'text-[#f6f1e3]' : 'text-[#f6f1e3]/70',
                                            )}
                                        >
                                            {person.name}
                                        </span>
                                        <span className="block truncate text-[11px] uppercase tracking-[0.14em] text-[#c9a227]/80">
                                            {person.instrument}
                                        </span>
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SpotlightMaestroInstructorProfiles

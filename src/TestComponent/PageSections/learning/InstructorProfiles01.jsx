// PolaroidWallInstructorProfiles

// InstructorProfiles01 · Learning Management Systems › Instructor / Mentor Profiles

// Description:
// A cork-board faculty wall for the fictional Wildframe Photo School. Under the heading
// "The people who’ll talk you out of auto mode." six instructors hang as taped, slightly
// rotated polaroids (Street & documentary, Portrait & studio light, Film & darkroom, …).
// Clicking a print opens a pinned index-card bio with years shooting, students taught, the
// instructor’s kit list and courses. Use it on a school or course page to put faces to
// the faculty.

// Design:
// - Cork-neutral #e9dfcf background with a faint dotted grain layer, black ink #141210
//   text; serif display heading (text-4xl → lg:text-7xl) with an italic underlined word
// - Polaroids: white frames with a thick bottom margin, square photos with a light
//   grayscale that clears on hover, serif-italic name + mono specialty caption, a torn
//   translucent tape strip (clip-path) and a different tilt per print (-3° … 3°)
// - Hover straightens, lifts and scales a print, focus straightens it (CSS); prints fade and
//   rise into view with a small stagger (framer-motion, offset removed for reduced motion)
// - Bio card: off-white index card with a red push-pin, mini polaroid, three stat boxes,
//   gear list and course links; bottom sheet on mobile, centred card from sm
// - Responsive: header stacks, then splits at md; grid-cols-2 → md:grid-cols-3 with
//   generous gaps; captions and frame margins grow from sm

// What it does:
// - activeId state: clicking a polaroid (aria-haspopup="dialog") opens its bio in a
//   role="dialog" card; Escape, the close button or a backdrop click close it
// - While open, focus moves to the close button, Tab is kept inside the card, and focus
//   returns to the polaroid that opened it
// - Course links point to #course-<slug>; "See all 14 faculty" to #wildframe-faculty;
//   tape, pin and grain are decorative only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PolaroidWallInstructorProfiles from '@/TestComponent/PageSections/learning/InstructorProfiles01';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <PolaroidWallInstructorProfiles />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight, HiOutlineCamera, HiOutlineMapPin, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const instructors = [
    {
        id: 'ines-carvalho',
        name: 'Inês Carvalho',
        specialty: 'Street & documentary',
        city: 'Lisbon, Portugal',
        years: 12,
        students: '1,240',
        tilt: '-rotate-3',
        tape: '-rotate-6',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        alt: 'Inês Carvalho in a denim jacket with the hood up',
        note: 'Leads the Saturday photo-walk through Alfama at golden hour, rain or shine.',
        gear: ['35mm rangefinder, fully manual', '28mm f/2 prime', 'ISO 400 colour negative film'],
        courses: [
            { slug: 'street-reading-the-crowd', title: 'Street Photography: Reading the Crowd', meta: '8 weeks · 24 lessons' },
            { slug: 'the-photo-essay', title: 'The Photo Essay', meta: '4 weeks · 11 lessons' },
        ],
    },
    {
        id: 'marcus-oyelaran',
        name: 'Marcus Oyelaran',
        specialty: 'Portrait & studio light',
        city: 'London, UK',
        years: 15,
        students: '2,080',
        tilt: 'rotate-2',
        tape: 'rotate-3',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
        alt: 'Marcus Oyelaran in a dark sweater against a plain backdrop',
        note: 'Shot more than 40 magazine covers before teaching full-time in 2019.',
        gear: ['Full-frame mirrorless body', '85mm f/1.4 portrait lens', 'Two strobes + 120 cm octabox'],
        courses: [
            { slug: 'light-a-face-with-one-lamp', title: 'Light a Face with One Lamp', meta: '6 weeks · 18 lessons' },
            { slug: 'studio-portrait-masterclass', title: 'Studio Portrait Masterclass', meta: '10 weeks · 32 lessons' },
        ],
    },
    {
        id: 'hana-sato',
        name: 'Hana Sato',
        specialty: 'Landscape & long exposure',
        city: 'Sapporo, Japan',
        years: 9,
        students: '860',
        tilt: '-rotate-1',
        tape: 'rotate-6',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
        alt: 'Hana Sato smiling, her hair tied in a bun',
        note: 'Plans every shoot around tide tables and has waited nine hours for one frame.',
        gear: ['Medium-format body', '10-stop ND filter kit', 'Carbon tripod, 1.4 kg'],
        courses: [
            { slug: 'slow-water-long-exposure', title: 'Slow Water: Long Exposure Basics', meta: '5 weeks · 14 lessons' },
            { slug: 'planning-the-blue-hour', title: 'Planning the Perfect Blue Hour', meta: '3 weeks · 9 lessons' },
        ],
    },
    {
        id: 'tomasz-wierzbicki',
        name: 'Tomasz Wierzbicki',
        specialty: 'Film & darkroom',
        city: 'Kraków, Poland',
        years: 27,
        students: '3,410',
        tilt: 'rotate-3',
        tape: '-rotate-3',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
        alt: 'Tomasz Wierzbicki, an older man with glasses, smiling',
        note: 'Still develops every roll by hand and keeps a 30-year-old notebook of times.',
        gear: ['Twin-lens reflex, 6×6 format', 'Black-and-white film, ISO 125', 'Condenser enlarger, home darkroom'],
        courses: [
            { slug: 'develop-your-first-roll', title: 'Develop Your First Roll', meta: '3 weeks · 8 lessons' },
            { slug: 'silver-gelatin-printing', title: 'Silver Gelatin Printing', meta: '8 weeks · 20 lessons' },
        ],
    },
    {
        id: 'aoife-brennan',
        name: 'Aoife Brennan',
        specialty: 'Weddings & events',
        city: 'Galway, Ireland',
        years: 11,
        students: '1,515',
        tilt: '-rotate-2',
        tape: 'rotate-2',
        image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=80',
        alt: 'Aoife Brennan laughing, with long red hair',
        note: 'Has photographed 310 weddings and never once asked a guest to say cheese.',
        gear: ['Two bodies with dual card slots', '35mm f/1.4 + 70–200mm f/2.8', 'Flash with a bounce card'],
        courses: [
            { slug: 'wedding-day-start-to-finish', title: 'Wedding Day, Start to Finish', meta: '7 weeks · 21 lessons' },
            { slug: 'candid-moments-under-pressure', title: 'Candid Moments Under Pressure', meta: '4 weeks · 12 lessons' },
        ],
    },
    {
        id: 'diego-fuentes',
        name: 'Diego Fuentes',
        specialty: 'Wildlife & telephoto',
        city: 'San José, Costa Rica',
        years: 14,
        students: '990',
        tilt: 'rotate-1',
        tape: '-rotate-2',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80',
        alt: 'Diego Fuentes, a bearded man with glasses',
        note: 'Spent two rainy seasons in a hide to photograph a single quetzal nest.',
        gear: ['APS-C body, 30 fps burst', '150–600mm zoom lens', 'Camouflage hide + beanbag rest'],
        courses: [
            { slug: 'birds-in-flight', title: 'Birds in Flight', meta: '6 weeks · 17 lessons' },
            { slug: 'ethics-of-the-wild-shot', title: 'Ethics of the Wild Shot', meta: '2 weeks · 6 lessons' },
        ],
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141210]'

export function PolaroidWallInstructorProfiles({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [activeId, setActiveId] = useState(null)
    const triggerRef = useRef(null)
    const dialogRef = useRef(null)
    const closeRef = useRef(null)

    const active = instructors.find((person) => person.id === activeId)

    const openBio = (id, element) => {
        triggerRef.current = element
        setActiveId(id)
    }

    const closeBio = () => {
        setActiveId(null)
        triggerRef.current?.focus()
    }

    useEffect(() => {
        if (!activeId) return undefined
        closeRef.current?.focus()

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                setActiveId(null)
                triggerRef.current?.focus()
                return
            }
            if (event.key !== 'Tab' || !dialogRef.current) return
            const nodes = dialogRef.current.querySelectorAll('a[href], button:not([disabled])')
            if (!nodes.length) return
            const first = nodes[0]
            const last = nodes[nodes.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [activeId])

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#e9dfcf] px-4 py-16 text-base font-normal text-[#141210] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(74,52,28,0.16)_1px,transparent_1.6px)] bg-size-[13px_13px] opacity-70"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d8c7a8] opacity-60 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.26em] text-[#141210]/70">
                            <HiOutlineCamera className="h-4 w-4" aria-hidden="true" />
                            Wildframe Photo School · Faculty wall
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#141210] sm:text-5xl lg:text-7xl">
                            The people who’ll talk you out of{' '}
                            <em className="underline decoration-[#b3261e] decoration-2 underline-offset-[6px]">
                                auto mode
                            </em>
                            .
                        </h2>
                    </div>
                    <div className="relative max-w-xs rotate-1 bg-[#fdf6d8] p-5 shadow-[0_14px_24px_-16px_rgba(20,18,16,0.55)] md:mb-2">
                        <span
                            className="absolute -top-2.5 left-6 h-5 w-5 rounded-full bg-[#b3261e] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.25)]"
                            aria-hidden="true"
                        />
                        <p className="font-serif text-lg italic leading-snug text-[#141210]">
                            Six working photographers, 88 years behind the viewfinder.
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[#141210]/70">
                            Pick a print to read their bio, kit list and courses.
                        </p>
                    </div>
                </div>

                <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 md:mt-20 md:grid-cols-3 lg:gap-x-14 lg:gap-y-16">
                    {instructors.map((person, index) => (
                        <motion.li
                            key={person.id}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <button
                                type="button"
                                aria-haspopup="dialog"
                                aria-label={`Open bio: ${person.name}, ${person.specialty}`}
                                onClick={(event) => openBio(person.id, event.currentTarget)}
                                className={cn(
                                    'group relative block w-full bg-white p-2 pb-14 text-left shadow-[0_22px_30px_-20px_rgba(40,28,14,0.6),0_2px_5px_rgba(40,28,14,0.14)] transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:rotate-0 hover:scale-[1.03] focus-visible:rotate-0 motion-reduce:transition-none sm:p-3 sm:pb-20',
                                    person.tilt,
                                    focusRing,
                                )}
                            >
                                <span
                                    className={cn(
                                        'absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 bg-[#f4ecd6]/85 shadow-[0_1px_2px_rgba(0,0,0,0.12)] [clip-path:polygon(4%_0,96%_6%,100%_48%,95%_100%,3%_94%,0_52%)] sm:w-24',
                                        person.tape,
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="block aspect-square overflow-hidden bg-[#d9cdb8]">
                                    <img
                                        src={person.image}
                                        alt={person.alt}
                                        loading="lazy"
                                        className="h-full w-full object-cover contrast-[1.05] grayscale-[40%] transition duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0"
                                    />
                                </span>
                                <span className="absolute inset-x-2 bottom-2.5 block sm:inset-x-3 sm:bottom-4">
                                    <span className="block truncate font-serif text-[15px] italic leading-tight text-[#141210] sm:text-2xl">
                                        {person.name}
                                    </span>
                                    <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-[#141210]/60 sm:text-[11px]">
                                        {person.specialty}
                                    </span>
                                </span>
                            </button>
                        </motion.li>
                    ))}
                </ul>

                <div className="mt-16 flex flex-col gap-4 border-t border-dashed border-[#141210]/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#141210]/60">
                        Open studio every Thursday · 18:00–21:00 · Rua das Flores 41
                    </p>
                    <a
                        href="#wildframe-faculty"
                        className={cn(
                            'group/link inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-[#141210] sm:self-auto',
                            focusRing,
                        )}
                    >
                        <span className="border-b-2 border-[#141210] pb-0.5">See all 14 faculty</span>
                        <HiArrowLongRight
                            className="h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>

            <AnimatePresence>
                {active && (
                    <motion.div
                        key="bio-backdrop"
                        className="fixed inset-0 z-50 flex items-end justify-center bg-[#1c150d]/50 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                        onClick={closeBio}
                    >
                        <motion.div
                            key={active.id}
                            ref={dialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="wildframe-bio-title"
                            onClick={(event) => event.stopPropagation()}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 36, rotate: reduceMotion ? 0 : -3 }}
                            animate={{ opacity: 1, y: 0, rotate: reduceMotion ? 0 : -0.6 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto bg-[#fbf7ee] p-5 text-[#141210] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] bg-[linear-gradient(transparent_31px,rgba(179,38,30,0.08)_32px)] bg-size-[100%_32px] sm:p-7"
                        >
                            <span
                                className="absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full bg-[#b3261e] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.25),0_3px_4px_rgba(0,0,0,0.25)]"
                                aria-hidden="true"
                            />
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={closeBio}
                                aria-label="Close bio"
                                className={cn(
                                    'absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-[#141210] transition-colors hover:bg-[#141210]/10',
                                    focusRing,
                                )}
                            >
                                <HiXMark className="h-5 w-5" aria-hidden="true" />
                            </button>

                            <div className="mt-4 flex items-start gap-4">
                                <span className="block w-20 shrink-0 -rotate-3 bg-white p-1.5 pb-5 shadow-[0_8px_16px_-10px_rgba(0,0,0,0.5)] sm:w-24">
                                    <img
                                        src={active.image}
                                        alt=""
                                        className="aspect-square w-full object-cover"
                                    />
                                </span>
                                <div className="min-w-0 pr-8">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#b3261e]">
                                        {active.specialty}
                                    </p>
                                    <h3
                                        id="wildframe-bio-title"
                                        className="mt-1 font-serif text-3xl font-normal leading-tight text-[#141210]"
                                    >
                                        {active.name}
                                    </h3>
                                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#141210]/70">
                                        <HiOutlineMapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        {active.city}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-5 font-serif text-lg italic leading-snug text-[#141210]/85">
                                “{active.note}”
                            </p>

                            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                                {[
                                    { label: 'Years shooting', value: active.years },
                                    { label: 'Students', value: active.students },
                                    { label: 'Courses', value: active.courses.length },
                                ].map((stat) => (
                                    <div key={stat.label} className="border border-[#141210]/15 bg-white/70 px-2 py-3">
                                        <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#141210]/60 sm:text-[10px]">
                                            {stat.label}
                                        </dt>
                                        <dd className="mt-1 font-serif text-2xl text-[#141210]">{stat.value}</dd>
                                    </div>
                                ))}
                            </dl>

                            <h4 className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141210]">
                                In the camera bag
                            </h4>
                            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[#141210]/80">
                                {active.gear.map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b3261e]" aria-hidden="true" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <h4 className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141210]">
                                Teaches
                            </h4>
                            <ul className="mt-2 divide-y divide-[#141210]/15 border-y border-[#141210]/15">
                                {active.courses.map((course) => (
                                    <li key={course.slug}>
                                        <a
                                            href={`#course-${course.slug}`}
                                            className={cn(
                                                'group/course flex min-h-12 items-center justify-between gap-3 py-2.5',
                                                focusRing,
                                            )}
                                        >
                                            <span>
                                                <span className="block font-serif text-base leading-snug text-[#141210]">
                                                    {course.title}
                                                </span>
                                                <span className="font-mono text-[11px] text-[#141210]/60">{course.meta}</span>
                                            </span>
                                            <HiArrowUpRight
                                                className="h-4 w-4 shrink-0 transition-transform group-hover/course:-translate-y-0.5 group-hover/course:translate-x-0.5"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default PolaroidWallInstructorProfiles

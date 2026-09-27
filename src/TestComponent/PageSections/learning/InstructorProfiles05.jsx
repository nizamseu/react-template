// MentorMatchInstructorProfiles

// InstructorProfiles05 · Learning Management Systems › Instructor / Mentor Profiles

// Description:
// A mentor-matching board for the fictional career accelerator Launchpad Careers. Under
// "Find the mentor who’s already done your next job." skill chips (Product, Design,
// Engineering, Data) filter six mentor cards showing company, years of experience, star
// rating, a short track record and the next free slot. Each card's "Book intro call"
// button toggles to "Requested ✓" and a counter tracks the requests. Use it on a
// career-coaching, bootcamp or mentorship landing page.

// Design:
// - Soft blue #eef4ff section, navy #0f1f3d text, coral #ff6b6b for the eyebrow, active
//   chips, stars, CTA and highlights; white rounded-[28px] cards with a navy-tinted shadow
// - Bold sans heading text-4xl → lg:text-6xl with a coral underline swash (inline SVG);
//   chips are pill buttons with outline icons, skill tags are tinted pills per skill
// - Stars: five outline-grey stars with a coral overlay clipped to the exact rating (4.7
//   shows 70% of the fifth star)
// - Cards reflow with AnimatePresence popLayout + layout when filters change; the CTA
//   swaps coral → navy with a check; motion is instant for reduced motion
// - Responsive: grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3; chip row wraps; the
//   header's request counter moves under the heading on mobile

// What it does:
// - skills state (multi-select): each chip toggles its skill (aria-pressed); "All
//   mentors" clears the selection; a card shows when it matches any selected skill
// - requested state: "Book intro call" toggles to "Requested ✓" (aria-pressed); the
//   header counter and an aria-live line report how many calls are requested
// - "See how matching works" links to #launchpad-matching; no network calls are made

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MentorMatchInstructorProfiles from '@/TestComponent/PageSections/learning/InstructorProfiles05';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <MentorMatchInstructorProfiles />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowLongRight,
    HiCheck,
    HiOutlineChartBar,
    HiOutlineClock,
    HiOutlineCodeBracket,
    HiOutlineLightBulb,
    HiOutlineSquares2X2,
    HiOutlineSwatch,
    HiStar,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const skills = [
    { id: 'Product', icon: HiOutlineLightBulb, tag: 'bg-[#ffe3e3] text-[#b42318]' },
    { id: 'Design', icon: HiOutlineSwatch, tag: 'bg-[#efe7ff] text-[#5b3cc4]' },
    { id: 'Engineering', icon: HiOutlineCodeBracket, tag: 'bg-[#dbe8ff] text-[#1d4ed8]' },
    { id: 'Data', icon: HiOutlineChartBar, tag: 'bg-[#dcf5ea] text-[#0f7a4f]' },
]

const mentors = [
    {
        id: 'priya-raman',
        name: 'Priya Raman',
        title: 'Group Product Manager',
        company: 'Tidewater Pay',
        skills: ['Product'],
        years: 11,
        rating: 4.9,
        reviews: 212,
        record: 'Took two fintech apps from zero to 1M users; now coaches first-time PMs on discovery.',
        next: 'Tue 29 Sep · 18:00',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        alt: 'Priya Raman in a grey blazer',
    },
    {
        id: 'jonah-whitfield',
        name: 'Jonah Whitfield',
        title: 'Staff Software Engineer',
        company: 'Northbeam Cloud',
        skills: ['Engineering'],
        years: 9,
        rating: 4.8,
        reviews: 164,
        record: 'Ex-hiring manager for 30+ engineers. Runs mock system-design interviews every Friday.',
        next: 'Wed 30 Sep · 12:30',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
        alt: 'Jonah Whitfield against a grey backdrop',
    },
    {
        id: 'leila-farouk',
        name: 'Leila Farouk',
        title: 'Design Lead',
        company: 'Kitebird',
        skills: ['Design'],
        years: 8,
        rating: 5,
        reviews: 97,
        record: 'Has reviewed 600+ portfolios. Her teardowns focus on the story, not the pixels.',
        next: 'Thu 1 Oct · 09:00',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80',
        alt: 'Leila Farouk in a white collared top in warm light',
    },
    {
        id: 'marco-silva',
        name: 'Marco Silva',
        title: 'Analytics Manager',
        company: 'Brightloop',
        skills: ['Data'],
        years: 7,
        rating: 4.7,
        reviews: 143,
        record: 'SQL take-homes, experiment design and turning dashboards into decisions leaders act on.',
        next: 'Thu 1 Oct · 17:30',
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=300&q=80',
        alt: 'Marco Silva smiling, wearing a scarf',
    },
    {
        id: 'grace-liu',
        name: 'Grace Liu',
        title: 'Principal Product Designer',
        company: 'Pebble Health',
        skills: ['Design', 'Product'],
        years: 12,
        rating: 4.9,
        reviews: 188,
        record: 'Moved from agency to in-house product design; helps career-switchers do the same.',
        next: 'Fri 2 Oct · 08:00',
        image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=300&q=80',
        alt: 'Grace Liu smiling, with a fringe',
    },
    {
        id: 'tunde-adebayo',
        name: 'Tunde Adebayo',
        title: 'Machine Learning Engineer',
        company: 'Orbital Freight',
        skills: ['Engineering', 'Data'],
        years: 6,
        rating: 4.8,
        reviews: 76,
        record: 'Self-taught into ML; shares the exact study plan that landed him three offers.',
        next: 'Mon 5 Oct · 19:00',
        image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=300&q=80',
        alt: 'Tunde Adebayo smiling in a striped shirt in front of a graffiti wall',
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f1f3d]'

function Stars({ rating }) {
    return (
        <span className="flex items-center gap-0.5" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((index) => {
                const fill = Math.max(0, Math.min(1, rating - index))
                return (
                    <span key={index} className="relative h-4 w-4">
                        <HiStar className="absolute inset-0 h-4 w-4 text-[#0f1f3d]/15" />
                        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                            <HiStar className="h-4 w-4 text-[#ff6b6b]" />
                        </span>
                    </span>
                )
            })}
        </span>
    )
}

export function MentorMatchInstructorProfiles({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [selected, setSelected] = useState([])
    const [requested, setRequested] = useState([])

    const toggleSkill = (id) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((skill) => skill !== id) : [...prev, id]))

    const toggleRequest = (id) =>
        setRequested((prev) => (prev.includes(id) ? prev.filter((mentor) => mentor !== id) : [...prev, id]))

    const visible = selected.length
        ? mentors.filter((mentor) => mentor.skills.some((skill) => selected.includes(skill)))
        : mentors

    const requestLabel = requested.length
        ? `${requested.length} intro call${requested.length === 1 ? '' : 's'} requested`
        : 'No intro calls requested yet'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#eef4ff] px-4 py-16 text-base font-normal text-[#0f1f3d] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#ff6b6b]/15 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ff6b6b]">
                            Launchpad Careers · Mentor match
                        </p>
                        <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0f1f3d] sm:text-5xl lg:text-6xl">
                            Find the mentor who’s already done{' '}
                            <span className="relative inline-block">
                                your next job.
                                <svg
                                    viewBox="0 0 300 16"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-2 left-0 h-3 w-full text-[#ff6b6b]"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2 11 C 60 3, 140 3, 298 9"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                        </h2>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#0f1f3d]/70">
                            Pick the skills you want to grow. Every mentor offers one free 20-minute intro call
                            a month, then 45-minute sessions from $40.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-3 self-start rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#0f1f3d] shadow-[0_10px_30px_-18px_rgba(15,31,61,0.5)] lg:self-auto">
                        <span
                            className={cn(
                                'grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-xs font-bold tabular-nums',
                                requested.length ? 'bg-[#ff6b6b] text-white' : 'bg-[#0f1f3d]/10 text-[#0f1f3d]',
                            )}
                        >
                            {requested.length}
                        </span>
                        <span aria-live="polite">{requestLabel}</span>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div role="group" aria-label="Filter mentors by skill" className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            aria-pressed={selected.length === 0}
                            onClick={() => setSelected([])}
                            className={cn(
                                'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors',
                                selected.length === 0
                                    ? 'border-[#0f1f3d] bg-[#0f1f3d] text-white'
                                    : 'border-[#0f1f3d]/15 bg-white text-[#0f1f3d] hover:border-[#0f1f3d]/40',
                                focusRing,
                            )}
                        >
                            <HiOutlineSquares2X2 className="h-4 w-4" aria-hidden="true" />
                            All mentors
                        </button>
                        {skills.map((skill) => {
                            const isOn = selected.includes(skill.id)
                            const Icon = skill.icon
                            return (
                                <button
                                    key={skill.id}
                                    type="button"
                                    aria-pressed={isOn}
                                    onClick={() => toggleSkill(skill.id)}
                                    className={cn(
                                        'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors',
                                        isOn
                                            ? 'border-[#ff6b6b] bg-[#ff6b6b] text-white'
                                            : 'border-[#0f1f3d]/15 bg-white text-[#0f1f3d] hover:border-[#ff6b6b]',
                                        focusRing,
                                    )}
                                >
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                    {skill.id}
                                    {isOn && <HiCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                                </button>
                            )
                        })}
                    </div>
                    <p className="text-sm text-[#0f1f3d]/60" aria-live="polite">
                        Showing {visible.length} of {mentors.length} mentors
                    </p>
                </div>

                <motion.ul layout={!reduceMotion} className="relative mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {visible.map((mentor) => {
                            const isRequested = requested.includes(mentor.id)
                            return (
                                <motion.li
                                    key={mentor.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-col rounded-[28px] bg-white p-5 shadow-[0_24px_48px_-32px_rgba(15,31,61,0.55)] ring-1 ring-[#0f1f3d]/5 sm:p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={mentor.image}
                                            alt={mentor.alt}
                                            loading="lazy"
                                            className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-bold leading-tight text-[#0f1f3d]">
                                                {mentor.name}
                                            </h3>
                                            <p className="mt-0.5 text-sm text-[#0f1f3d]/70">{mentor.title}</p>
                                            <p className="text-sm font-semibold text-[#0f1f3d]">
                                                at <span className="text-[#ff6b6b]">{mentor.company}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
                                        {mentor.skills.map((id) => (
                                            <li
                                                key={id}
                                                className={cn(
                                                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                                                    skills.find((skill) => skill.id === id)?.tag,
                                                )}
                                            >
                                                {id}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Stars rating={mentor.rating} />
                                            <span className="font-semibold text-[#0f1f3d]">
                                                {mentor.rating.toFixed(1)}
                                            </span>
                                            <span className="text-[#0f1f3d]/55">({mentor.reviews})</span>
                                            <span className="sr-only">{`Rated ${mentor.rating.toFixed(1)} out of 5`}</span>
                                        </span>
                                        <span className="text-[#0f1f3d]/70">
                                            <span className="font-semibold text-[#0f1f3d]">{mentor.years} yrs</span>{' '}
                                            experience
                                        </span>
                                    </div>

                                    <p className="mt-4 text-sm leading-relaxed text-[#0f1f3d]/75">{mentor.record}</p>

                                    <div className="mt-auto pt-5">
                                        <p className="flex items-center gap-2 border-t border-dashed border-[#0f1f3d]/15 pt-4 text-xs text-[#0f1f3d]/60">
                                            <HiOutlineClock className="h-4 w-4" aria-hidden="true" />
                                            Next free intro slot:{' '}
                                            <span className="font-semibold text-[#0f1f3d]">{mentor.next}</span>
                                        </p>
                                        <button
                                            type="button"
                                            aria-pressed={isRequested}
                                            onClick={() => toggleRequest(mentor.id)}
                                            className={cn(
                                                'mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors',
                                                isRequested
                                                    ? 'bg-[#0f1f3d] text-white hover:bg-[#1c3563]'
                                                    : 'bg-[#ff6b6b] text-white hover:bg-[#f25454]',
                                                focusRing,
                                            )}
                                        >
                                            {isRequested ? 'Requested ✓' : 'Book intro call'}
                                        </button>
                                    </div>
                                </motion.li>
                            )
                        })}
                    </AnimatePresence>
                </motion.ul>

                <a
                    href="#launchpad-matching"
                    className={cn(
                        'group/how mt-10 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#0f1f3d]',
                        focusRing,
                    )}
                >
                    <span className="border-b-2 border-[#ff6b6b] pb-0.5">See how matching works</span>
                    <HiArrowLongRight
                        className="h-5 w-5 transition-transform group-hover/how:translate-x-1"
                        aria-hidden="true"
                    />
                </a>
            </div>
        </section>
    )
}

export default MentorMatchInstructorProfiles

// FlipCardInstructorProfiles

// InstructorProfiles03 · Learning Management Systems › Instructor / Mentor Profiles

// Description:
// A mentor grid for the fictional CodeCraft Mentors, headed "Pair with engineers who ship
// for a living." Four cards show a photo, name, role and rating; each card flips in 3D to
// reveal the mentor's expertise tags, spoken languages, next open 1:1 session with price
// and a "Book this slot" link. Use it on a bootcamp, mentoring or tutoring page where
// visitors compare mentors before booking.

// Design:
// - Indigo #312e81 section with a faint 40px code-grid overlay, white text and lime
//   #a3e635 accents (eyebrow, highlighted words, card back); mono eyebrow and labels
// - Card front: white rounded-[26px] card, photo top (h-56) with an "Open this week" lime
//   chip, name/role, rating and sessions row, mono "flip for stack" hint
// - Card back: lime face with deep-indigo #1e1b4b text, indigo mono tag chips, a white/55
//   session panel and an indigo pill CTA; a round indigo flip button sits in the corner
// - 3D flip: perspective-[1400px] wrapper, preserve-3d flipper rotated 180° on Y with
//   framer-motion (0.7 s), backface-hidden faces; reduced motion flips instantly
// - Responsive: grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4, fixed h-[460px] cards;
//   header stacks on mobile and splits from md

// What it does:
// - flipped state per card: mouse hover flips to the back and leaving flips it back;
//   keyboard focus (focus-visible) anywhere in a card shows the back until focus leaves
// - Clicking a card or its corner button (aria-pressed) toggles the face, so touch users
//   can flip it; the hidden face gets aria-hidden, no pointer events and tabIndex -1
// - "Book this slot" links to #book-<mentor-slug>; "Browse all 62 mentors" to
//   #codecraft-mentors; the grid overlay is decorative only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FlipCardInstructorProfiles from '@/TestComponent/PageSections/learning/InstructorProfiles03';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <FlipCardInstructorProfiles />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowPath, HiArrowUpRight, HiOutlineCalendarDays, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const mentors = [
    {
        id: 'ada-mensah',
        name: 'Ada Mensah',
        role: 'Senior Frontend Engineer',
        rating: '4.9',
        sessions: 212,
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80',
        alt: 'Ada Mensah smiling, with curly hair and a blazer',
        expertise: ['React', 'TypeScript', 'Accessibility', 'Design systems'],
        languages: ['English', 'Twi', 'French'],
        session: 'Thu 8 Oct · 18:30 GMT',
        price: '45 min · $48',
    },
    {
        id: 'kenji-watanabe',
        name: 'Kenji Watanabe',
        role: 'Staff Backend Engineer',
        rating: '4.8',
        sessions: 187,
        image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=700&q=80',
        alt: 'Kenji Watanabe wearing glasses and a striped T-shirt',
        expertise: ['Go', 'PostgreSQL', 'Kafka', 'System design'],
        languages: ['Japanese', 'English'],
        session: 'Sat 10 Oct · 09:00 JST',
        price: '60 min · $65',
    },
    {
        id: 'lucia-romero',
        name: 'Lucía Romero',
        role: 'Machine Learning Engineer',
        rating: '5.0',
        sessions: 96,
        image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=700&q=80',
        alt: 'Lucía Romero, a young woman with freckles',
        expertise: ['Python', 'PyTorch', 'MLOps', 'Data pipelines'],
        languages: ['Spanish', 'Catalan', 'English'],
        session: 'Mon 12 Oct · 19:00 CEST',
        price: '45 min · $55',
    },
    {
        id: 'samir-haddad',
        name: 'Samir Haddad',
        role: 'Platform & DevOps Lead',
        rating: '4.9',
        sessions: 158,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
        alt: 'Samir Haddad in a grey sweater',
        expertise: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
        languages: ['Arabic', 'French', 'English'],
        session: 'Wed 14 Oct · 17:00 GST',
        price: '60 min · $60',
    },
]

const limeRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a3e635]'
const inkRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1e1b4b]'

function isFocusVisible(element) {
    try {
        return element.matches(':focus-visible')
    } catch {
        return true
    }
}

export function FlipCardInstructorProfiles({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [flipped, setFlipped] = useState({})

    const setFlip = (id, value) =>
        setFlipped((prev) => (Boolean(prev[id]) === value ? prev : { ...prev, [id]: value }))

    const toggle = (id) => setFlipped((prev) => ({ ...prev, [id]: !prev[id] }))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#312e81] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="font-mono text-xs text-[#a3e635]">
                            {'<CodeCraftMentors />'}
                            <span className="text-white/60"> · 1:1 pairing & code review</span>
                        </p>
                        <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Pair with engineers who ship{' '}
                            <span className="relative whitespace-nowrap text-[#a3e635]">for a living.</span>
                        </h2>
                    </div>
                    <div className="max-w-sm">
                        <p className="text-sm leading-relaxed text-white/70">
                            Every mentor works in industry today. Hover, focus or tap a card to see their
                            stack, languages and next open slot.
                        </p>
                        <a
                            href="#codecraft-mentors"
                            className={cn(
                                'group/all mt-4 inline-flex min-h-10 items-center gap-2 font-mono text-sm text-[#a3e635]',
                                limeRing,
                            )}
                        >
                            Browse all 62 mentors
                            <HiArrowLongRight
                                className="h-5 w-5 transition-transform group-hover/all:translate-x-1"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                </div>

                <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
                    {mentors.map((mentor) => {
                        const isFlipped = Boolean(flipped[mentor.id])
                        return (
                            <li
                                key={mentor.id}
                                className="relative h-[460px] perspective-[1400px]"
                                onPointerEnter={(event) => {
                                    if (event.pointerType === 'mouse') setFlip(mentor.id, true)
                                }}
                                onPointerLeave={(event) => {
                                    if (event.pointerType === 'mouse') setFlip(mentor.id, false)
                                }}
                                onFocus={(event) => {
                                    if (isFocusVisible(event.target)) setFlip(mentor.id, true)
                                }}
                                onBlur={(event) => {
                                    if (!event.currentTarget.contains(event.relatedTarget)) setFlip(mentor.id, false)
                                }}
                            >
                                <motion.div
                                    className="relative h-full w-full cursor-pointer transform-3d"
                                    initial={false}
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={(event) => {
                                        if (event.target.closest('a, button')) return
                                        toggle(mentor.id)
                                    }}
                                >
                                    <div
                                        aria-hidden={isFlipped}
                                        className={cn(
                                            'absolute inset-0 flex flex-col overflow-hidden rounded-[26px] bg-white text-[#1e1b4b] shadow-[0_30px_50px_-30px_rgba(10,8,40,0.8)] backface-hidden',
                                            isFlipped && 'pointer-events-none',
                                        )}
                                        style={{ WebkitBackfaceVisibility: 'hidden' }}
                                    >
                                        <div className="relative h-56 shrink-0 overflow-hidden bg-[#e0e7ff]">
                                            <img
                                                src={mentor.image}
                                                alt={mentor.alt}
                                                loading="lazy"
                                                className="h-full w-full object-cover"
                                            />
                                            <span className="absolute bottom-3 left-3 rounded-full bg-[#a3e635] px-3 py-1 font-mono text-[11px] font-semibold text-[#1e1b4b]">
                                                ● Open this week
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col p-5">
                                            <h3 className="text-2xl font-bold tracking-tight text-[#1e1b4b]">
                                                {mentor.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-[#1e1b4b]/70">{mentor.role}</p>
                                            <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#1e1b4b]">
                                                <HiStar className="h-4 w-4 text-[#65a30d]" aria-hidden="true" />
                                                {mentor.rating}
                                                <span className="font-normal text-[#1e1b4b]/60">
                                                    · {mentor.sessions} sessions
                                                </span>
                                            </p>
                                            <p className="mt-auto flex items-center justify-between border-t border-dashed border-[#312e81]/20 pt-4 font-mono text-xs text-[#312e81]">
                                                <span>{'// flip for stack'}</span>
                                                <span aria-hidden="true">↻</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        aria-hidden={!isFlipped}
                                        className={cn(
                                            'absolute inset-0 flex flex-col rounded-[26px] bg-[#a3e635] p-5 text-[#1e1b4b] shadow-[0_30px_50px_-30px_rgba(10,8,40,0.8)] backface-hidden sm:p-6',
                                            !isFlipped && 'pointer-events-none',
                                        )}
                                        style={{ transform: 'rotateY(180deg)', WebkitBackfaceVisibility: 'hidden' }}
                                    >
                                        <p className="pr-12 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1e1b4b]/70">
                                            {mentor.role}
                                        </p>
                                        <p className="mt-1 pr-12 text-xl font-bold leading-tight text-[#1e1b4b]">
                                            {mentor.name}
                                        </p>

                                        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1e1b4b]/70">
                                            Expertise
                                        </p>
                                        <ul className="mt-2 flex flex-wrap gap-1.5">
                                            {mentor.expertise.map((tag) => (
                                                <li
                                                    key={tag}
                                                    className="rounded-full bg-[#312e81] px-3 py-1 font-mono text-xs text-[#a3e635]"
                                                >
                                                    {tag}
                                                </li>
                                            ))}
                                        </ul>

                                        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1e1b4b]/70">
                                            Speaks
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#1e1b4b]">
                                            {mentor.languages.join(' · ')}
                                        </p>

                                        <div className="mt-auto rounded-2xl bg-white/55 p-4">
                                            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1e1b4b]/70">
                                                <HiOutlineCalendarDays className="h-4 w-4" aria-hidden="true" />
                                                Next open session
                                            </p>
                                            <p className="mt-1.5 text-base font-bold text-[#1e1b4b]">{mentor.session}</p>
                                            <p className="text-sm text-[#1e1b4b]/70">{mentor.price}</p>
                                        </div>
                                        <a
                                            href={`#book-${mentor.id}`}
                                            tabIndex={isFlipped ? 0 : -1}
                                            className={cn(
                                                'group/book mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#312e81] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1e1b4b]',
                                                inkRing,
                                            )}
                                        >
                                            Book this slot
                                            <HiArrowUpRight
                                                className="h-4 w-4 transition-transform group-hover/book:-translate-y-0.5 group-hover/book:translate-x-0.5"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </div>
                                </motion.div>

                                <button
                                    type="button"
                                    aria-pressed={isFlipped}
                                    aria-label={isFlipped ? `Show ${mentor.name}’s profile` : `Show ${mentor.name}’s stack and next session`}
                                    onClick={() => toggle(mentor.id)}
                                    className={cn(
                                        'absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-[#312e81] text-[#a3e635] shadow-[0_8px_18px_-8px_rgba(10,8,40,0.9)] transition-colors hover:bg-[#1e1b4b]',
                                        limeRing,
                                    )}
                                >
                                    <HiArrowPath
                                        className={cn(
                                            'h-5 w-5 transition-transform duration-500 motion-reduce:transition-none',
                                            isFlipped && 'rotate-180',
                                        )}
                                        aria-hidden="true"
                                    />
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default FlipCardInstructorProfiles

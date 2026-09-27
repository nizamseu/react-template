// CareerLeapSuccessStories

// SuccessStories02 · Learning Management Systems › Student Success Stories & Certificates

// Description:
// A bold, high-contrast wall of career-switch stories for the fictional bootcamp Pivot
// Academy. Under "Same person. New career." six story cards show a graduate portrait, the
// old role struck through ("Barista") and the new one in large type ("UX Designer"), time to
// hire and salary change, with a "Read Maya’s story" toggle and an "Apply for the 12 Oct
// cohort" call to action. Use it on a bootcamp or career-track landing page.

// Design:
// - Black #000 section with white type and electric blue #3a86ff for arrows, stats, focus
//   rings, hover borders and the CTA; cards are #0b0b0b with white/10 borders, rounded-3xl
// - Portraits in a 4:5 frame render grayscale and switch to colour with a 1.04 zoom on
//   hover or keyboard focus inside the card; a blue track chip sits top-left
// - Heavy sans display heading (text-5xl → lg:text-8xl, tracking-tighter) with a blue arrow
//   glyph; old roles in small uppercase with line-through, new roles text-2xl → lg:3xl
// - The middle column drops 48px on lg for an editorial stagger; cards rise in on scroll
//   and stories expand with a height animation (both instant for reduced motion)
// - Responsive: grid-cols-1 → md:grid-cols-3; header stacks on mobile, splits on md

// What it does:
// - openId state expands one story at a time; each toggle is a button with aria-expanded
//   and aria-controls, and its label switches between "Read" and "Hide"
// - Everything else is visual: the grayscale → colour swap and zoom run on hover/focus
// - "Apply for the 12 Oct cohort" links to #apply; "See all 214 stories" to #all-stories

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CareerLeapSuccessStories from '@/TestComponent/PageSections/learning/SuccessStories02';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <CareerLeapSuccessStories />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const stories = [
    {
        id: 'maya',
        first: 'Maya',
        name: 'Maya Chen',
        track: 'UX Design',
        before: 'Barista',
        after: 'UX Designer',
        months: 5,
        salary: '+$31k',
        company: 'Lumaform',
        story: 'Maya sketched app ideas on the back of order tickets for two years. Her capstone — a queue-free ordering flow for a local café chain — became the case study that got her hired.',
        image: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=800&q=80',
        alt: 'Smiling young woman in a denim jacket',
    },
    {
        id: 'daniel',
        first: 'Daniel',
        name: 'Daniel Okoro',
        track: 'Data Analytics',
        before: 'Warehouse lead',
        after: 'Data Analyst',
        months: 7,
        salary: '+$24k',
        company: 'Kestrel Retail',
        story: 'Daniel already ran pick-rate spreadsheets for his shift. Evening classes in SQL and dashboards turned that habit into a portfolio, and a former supplier hired him first.',
        image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80',
        alt: 'Smiling man in a striped shirt in front of a graffiti wall',
    },
    {
        id: 'sofia',
        first: 'Sofia',
        name: 'Sofia Marín',
        track: 'Product',
        before: 'Primary teacher',
        after: 'Product Manager',
        months: 6,
        salary: '+$38k',
        company: 'Brightloop',
        story: 'Eleven years of planning lessons for 28 kids at once turned out to be excellent roadmap practice. Sofia now runs the classroom app she used to teach with.',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
        alt: 'Smiling woman with curly hair wearing a blazer',
    },
    {
        id: 'jonah',
        first: 'Jonah',
        name: 'Jonah Price',
        track: 'Frontend',
        before: 'Line cook',
        after: 'Frontend Developer',
        months: 8,
        salary: '+$42k',
        company: 'Parcelwise',
        story: 'Jonah coded between lunch and dinner service on a borrowed laptop. He shipped 14 projects in the programme and now builds the tracking pages for a delivery start-up.',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=800&q=80',
        alt: 'Young man against a plain grey backdrop',
    },
    {
        id: 'aisha',
        first: 'Aisha',
        name: 'Aisha Bello',
        track: 'QA Engineering',
        before: 'Retail manager',
        after: 'QA Engineer',
        months: 4,
        salary: '+$19k',
        company: 'Tallgrass Health',
        story: 'Aisha was the person who always spotted what was wrong with the till system. Test automation gave that instinct a job title — and a four-day week.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
        alt: 'Smiling woman with her hair in a bun',
    },
    {
        id: 'leo',
        first: 'Leo',
        name: 'Leo Brandt',
        track: 'Data Analytics',
        before: 'Ward nurse',
        after: 'Health Data Analyst',
        months: 6,
        salary: '+$22k',
        company: 'Meridian Clinics',
        story: 'After nine years of night shifts, Leo wanted to fix the scheduling data he fought with every week. He now models staffing for a network of 30 clinics.',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80',
        alt: 'Man with glasses and a beard',
    },
]

export function CareerLeapSuccessStories({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [openId, setOpenId] = useState(null)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-black px-4 py-16 text-base font-normal text-white antialiased sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3a86ff]">Pivot Academy · Graduate outcomes</p>
                        <h2 className="mt-5 text-5xl font-black leading-[0.92] tracking-tighter text-white sm:text-6xl lg:text-8xl">
                            Same person.
                            <br />
                            New career<span className="text-[#3a86ff]">→</span>
                        </h2>
                    </div>
                    <div className="max-w-sm md:text-right">
                        <p className="text-base leading-relaxed text-white/70">
                            2,140 career switchers hired since 2022. Median time from first lesson to signed
                            offer: <span className="font-semibold text-white">5.2 months</span>.
                        </p>
                        <a
                            href="#all-stories"
                            className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white underline decoration-[#3a86ff] decoration-2 underline-offset-8 hover:text-[#3a86ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3a86ff]"
                        >
                            See all 214 stories
                            <HiArrowLongRight className="h-5 w-5" aria-hidden="true" />
                        </a>
                    </div>
                </div>

                <ul className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8 lg:pb-12">
                    {stories.map((s, i) => {
                        const open = openId === s.id
                        return (
                            <motion.li
                                key={s.id}
                                initial={reduce ? false : { opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className={cn(i % 3 === 1 && 'lg:translate-y-12')}
                            >
                                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] transition-colors hover:border-[#3a86ff] focus-within:border-[#3a86ff]">
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={s.image}
                                            alt={s.alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover grayscale transition-[filter,scale] duration-700 group-hover:scale-[1.04] group-hover:grayscale-0 group-focus-within:scale-[1.04] group-focus-within:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0b] via-transparent to-transparent" aria-hidden="true" />
                                        <span className="absolute left-4 top-4 rounded-full bg-[#3a86ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                                            {s.track}
                                        </span>
                                        <p className="absolute bottom-4 left-5 text-sm font-semibold text-white">{s.name}</p>
                                    </div>

                                    <div className="flex flex-1 flex-col p-5 lg:p-6">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45 line-through decoration-[#3a86ff] decoration-2">
                                            <span className="sr-only">Before: </span>
                                            {s.before}
                                        </p>
                                        <h3 className="mt-2 flex items-start gap-2 text-2xl font-black leading-tight tracking-tight text-white lg:text-3xl">
                                            <HiArrowRight className="mt-1.5 h-5 w-5 shrink-0 text-[#3a86ff] lg:mt-2" aria-hidden="true" />
                                            <span>
                                                <span className="sr-only">Now: </span>
                                                {s.after}
                                            </span>
                                        </h3>
                                        <p className="mt-1 pl-7 text-sm text-white/60">at {s.company}</p>

                                        <dl className="mt-5 grid grid-cols-2 border-t border-white/10 pt-4">
                                            <div>
                                                <dt className="text-[11px] uppercase tracking-[0.16em] text-white/50">Time to hire</dt>
                                                <dd className="mt-1 text-xl font-bold tabular-nums text-white">{s.months} mo</dd>
                                            </div>
                                            <div className="border-l border-white/10 pl-4">
                                                <dt className="text-[11px] uppercase tracking-[0.16em] text-white/50">Salary</dt>
                                                <dd className="mt-1 text-xl font-bold tabular-nums text-[#3a86ff]">{s.salary}</dd>
                                            </div>
                                        </dl>

                                        <AnimatePresence initial={false}>
                                            {open && (
                                                <motion.div
                                                    key="story"
                                                    id={`pivot-story-${s.id}`}
                                                    initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                                    transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="pt-4 text-sm leading-relaxed text-white/75">{s.story}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button
                                            type="button"
                                            aria-expanded={open}
                                            aria-controls={`pivot-story-${s.id}`}
                                            className="mt-auto flex min-h-11 items-center justify-between gap-3 pt-5 text-left text-sm font-semibold text-white transition-colors hover:text-[#3a86ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3a86ff]"
                                            onClick={() => setOpenId(open ? null : s.id)}
                                        >
                                            {open ? 'Hide' : 'Read'} {s.first}’s story
                                            <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20" aria-hidden="true">
                                                {open ? <HiMinus className="h-4 w-4" /> : <HiPlus className="h-4 w-4" />}
                                            </span>
                                        </button>
                                    </div>
                                </article>
                            </motion.li>
                        )
                    })}
                </ul>

                <div className="mt-14 flex flex-col items-start gap-5 rounded-3xl bg-[#3a86ff] p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                    <p className="max-w-xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                        Your “before” is the hard part. We’ll help with the “after”.
                    </p>
                    <a
                        href="#apply"
                        className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-black px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                    >
                        Apply for the 12 Oct cohort
                        <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CareerLeapSuccessStories

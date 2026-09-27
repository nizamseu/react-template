// GraduateWallSuccessStories

// SuccessStories03 · Learning Management Systems › Student Success Stories & Certificates

// Description:
// A quiet, yearbook-style wall of graduates for the fictional online university Northlake
// Online. A large count-up reads "12,480 graduates" beside the serif line "Faces behind the
// number.", and a grid of eleven portraits (plus a "Your name here" enrolment tile) reveals
// each graduate's quote, programme and class year on hover, focus or tap. Use it on an
// admissions, alumni or programme page to add human proof.

// Design:
// - Navy #14213d section with warm white #f8f1e5 type and sand #e9d8b4 accents; portraits
//   sit on #1d2d50 with mix-blend-luminosity for a navy duotone, switching to full colour
// - Serif display for the heading and the count (text-7xl → xl:text-9xl, tabular-nums);
//   small uppercase tracking for labels; tiles are rounded-2xl with a 3:4 ratio
// - The quote panel slides up from the bottom of a tile (translate + opacity, 500ms) and the
//   photo zooms 1.05; the count-up runs 2 s when scrolled into view
// - Responsive: stacked on mobile; lg:grid-cols-[360px_1fr] with a sticky intro column;
//   portrait grid 2 → sm:3 → xl:4 columns (12 tiles, so rows always fill)

// What it does:
// - The count is a MotionValue: the server renders 12,480, on mount it resets to 0 and
//   useInView (once) starts animate(); reduced motion keeps the final value; screen
//   readers get the full figure from sr-only text
// - activeId state toggles a tile's quote on tap/click (aria-expanded) for touch devices;
//   hover and keyboard focus reveal it with CSS; Escape or pointer leave closes it
// - "Join the class of 2027" links to #enrol and "Browse the alumni directory" to #alumni

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GraduateWallSuccessStories from '@/TestComponent/PageSections/learning/SuccessStories03';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <GraduateWallSuccessStories />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const TOTAL = 12480

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const graduates = [
    { id: 'amelia', name: 'Amelia Brooks', program: 'BSc Nursing', year: '2025', quote: 'I studied on night shifts between ward rounds. Northlake bent around my life, not the other way round.', image: img('1494790108377-be9c29b29330'), alt: 'Smiling woman in a red sweater' },
    { id: 'harold', name: 'Harold Mensah', program: 'MA History', year: '2024', quote: 'Retired at 64, graduated at 68. My grandchildren came to the ceremony in the same hall I watched online.', image: img('1472099645785-5658abf4ff4e'), alt: 'Older man with glasses smiling' },
    { id: 'freya', name: 'Freya Lund', program: 'BA Psychology', year: '2025', quote: 'The discussion boards were livelier than any lecture hall I have sat in.', image: img('1554151228-14d9def656e4'), alt: 'Young woman with freckles' },
    { id: 'ravi', name: 'Ravi Deshmukh', program: 'MSc Computer Science', year: '2023', quote: 'My dissertation supervisor was eight time zones away and still answered faster than my office manager.', image: img('1506794778202-cad84cf45f1d'), alt: 'Man in a dark sweater' },
    { id: 'cara', name: 'Cara Doyle', program: 'BA English', year: '2024', quote: 'First in my family with a degree. My mum framed the email before the certificate even arrived.', image: img('1502685104226-ee32379fefbe'), alt: 'Laughing woman with red hair' },
    { id: 'tomas', name: 'Tomás Herrera', program: 'MBA', year: '2025', quote: 'I got promoted in my second term and used my capstone to plan the team I now lead.', image: img('1560250097-0b93528c311a'), alt: 'Man with glasses wearing a suit' },
    { id: 'june', name: 'June Park', program: 'BSc Environmental Science', year: '2024', quote: 'Field weeks in the Lake District were the best seven days of my twenties.', image: img('1487412720507-e7ab37603c6f'), alt: 'Smiling woman wearing a beanie' },
    { id: 'kwame', name: 'Kwame Asante', program: 'BEng Civil Engineering', year: '2023', quote: 'I finished my degree while building the bridge I had been studying. Literally.', image: img('1542909168-82c3e7fdca5c'), alt: 'Young man against a dark backdrop' },
    { id: 'lea', name: 'Léa Moreau', program: 'MA Education', year: '2025', quote: 'Every assignment went straight back into my Year 4 classroom the next morning.', image: img('1520813792240-56fc4a3765a7'), alt: 'Smiling woman with a fringe' },
    { id: 'sam', name: 'Sam Whitaker', program: 'BSc Sport Science', year: '2024', quote: 'Coaching on Saturdays, lectures on Sundays. Somehow it all fit.', image: img('1506277886164-e25aa3f4ef7f'), alt: 'Smiling man in a football shirt' },
    { id: 'noor', name: 'Noor Haddad', program: 'MSc Public Health', year: '2025', quote: 'My cohort spanned 23 countries. Our group chat is still going two years later.', image: img('1619895862022-09114b41f16f'), alt: 'Woman in a striped top outdoors' },
]

export function GraduateWallSuccessStories({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [activeId, setActiveId] = useState(null)
    const countRef = useRef(null)
    const inView = useInView(countRef, { once: true, amount: 0.6 })
    const count = useMotionValue(TOTAL)
    const display = useTransform(count, (v) => Math.round(v).toLocaleString('en-US'))

    useEffect(() => {
        if (reduce) {
            count.set(TOTAL)
            return undefined
        }
        if (!inView) {
            count.set(0)
            return undefined
        }
        const controls = animate(count, TOTAL, { duration: 2, ease: [0.16, 1, 0.3, 1] })
        return () => controls.stop()
    }, [inView, reduce, count])

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#14213d] px-4 py-16 text-base font-normal text-[#f8f1e5] antialiased sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[360px_1fr] lg:gap-14">
                <div className="lg:sticky lg:top-10 lg:self-start">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#e9d8b4]">Northlake Online · Alumni</p>
                    <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#f8f1e5] sm:text-5xl">
                        Faces behind the <em className="text-[#e9d8b4]">number.</em>
                    </h2>
                    <div className="mt-10 border-t border-[#f8f1e5]/20 pt-6">
                        <p ref={countRef} className="font-serif text-7xl leading-none tracking-tight tabular-nums text-[#f8f1e5] sm:text-8xl xl:text-9xl">
                            <motion.span aria-hidden="true">{display}</motion.span>
                            <span className="sr-only">{TOTAL.toLocaleString('en-US')}</span>
                        </p>
                        <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[#e9d8b4]">graduates since 2014</p>
                    </div>
                    <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[#f8f1e5]/20 pt-6">
                        {[
                            ['71', 'countries'],
                            ['94%', 'recommend us'],
                            ['4.7', 'avg. rating'],
                        ].map(([v, k]) => (
                            <div key={k}>
                                <dt className="sr-only">{k}</dt>
                                <dd className="font-serif text-2xl tabular-nums text-[#f8f1e5] sm:text-3xl">{v}</dd>
                                <dd aria-hidden="true" className="mt-1 text-xs text-[#f8f1e5]/60">
                                    {k}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <a
                        href="#alumni"
                        className="mt-8 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#f8f1e5] underline decoration-[#e9d8b4]/60 underline-offset-8 hover:decoration-[#e9d8b4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9d8b4]"
                    >
                        Browse the alumni directory
                        <HiArrowLongRight className="h-5 w-5" aria-hidden="true" />
                    </a>
                </div>

                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                    {graduates.map((g) => {
                        const active = activeId === g.id
                        return (
                            <li key={g.id}>
                                <button
                                    type="button"
                                    aria-expanded={active}
                                    className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#1d2d50] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9d8b4]"
                                    onClick={() => setActiveId(active ? null : g.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') setActiveId(null)
                                    }}
                                    onMouseLeave={() => active && setActiveId(null)}
                                >
                                    <img
                                        src={g.image}
                                        alt={g.alt}
                                        loading="lazy"
                                        className={cn(
                                            'absolute inset-0 h-full w-full object-cover opacity-85 mix-blend-luminosity transition-[scale,opacity] duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:mix-blend-normal group-focus-visible:scale-105 group-focus-visible:mix-blend-normal motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                                            active && 'scale-105 mix-blend-normal',
                                        )}
                                    />
                                    <span className="absolute inset-0 bg-linear-to-t from-[#14213d] via-[#14213d]/10 to-transparent" aria-hidden="true" />
                                    <span
                                        className={cn(
                                            'absolute inset-x-0 bottom-0 block p-3 transition-opacity duration-300 sm:p-4 group-hover:opacity-0 group-focus-visible:opacity-0',
                                            active && 'opacity-0',
                                        )}
                                        aria-hidden="true"
                                    >
                                        <span className="block truncate text-sm font-semibold text-[#f8f1e5]">{g.name}</span>
                                        <span className="block truncate text-[11px] uppercase tracking-[0.14em] text-[#e9d8b4]">
                                            Class of {g.year}
                                        </span>
                                    </span>
                                    <span
                                        className={cn(
                                            'absolute inset-x-0 bottom-0 flex max-h-full translate-y-full flex-col justify-end bg-[#14213d]/92 p-3 opacity-0 backdrop-blur-sm transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none sm:p-4',
                                            active && 'translate-y-0 opacity-100',
                                        )}
                                    >
                                        <span className="block font-serif text-[13px] leading-snug text-[#f8f1e5] sm:text-base">“{g.quote}”</span>
                                        <span className="mt-2 block text-xs font-semibold text-[#f8f1e5]">{g.name}</span>
                                        <span className="block text-[11px] text-[#e9d8b4]">
                                            {g.program} · {g.year}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                    <li>
                        <a
                            href="#enrol"
                            className="group flex aspect-[3/4] w-full flex-col justify-between rounded-2xl border border-dashed border-[#e9d8b4]/50 p-4 transition-colors hover:border-[#e9d8b4] hover:bg-[#e9d8b4]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9d8b4]"
                        >
                            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9d8b4] text-[#14213d]" aria-hidden="true">
                                <HiArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45 motion-reduce:transition-none" />
                            </span>
                            <span>
                                <span className="block font-serif text-xl leading-tight text-[#f8f1e5] sm:text-2xl">Your name here.</span>
                                <span className="mt-2 block text-xs leading-relaxed text-[#f8f1e5]/70">
                                    Join the class of 2027. Applications open 1 November.
                                </span>
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default GraduateWallSuccessStories

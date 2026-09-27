// ScrollTimelineCourseSyllabus

// CourseSyllabus02 · Learning Management Systems › Course Overview & Syllabus

// Description:
// A week-by-week syllabus for the Home Cook Diploma at the fictional Hearth Culinary School.
// Under "Six weeks from knife skills to a dinner party for eight." a vertical timeline
// fills with tomato red as you scroll; each week card has a photo, the week's theme, the
// dishes you cook with time estimates, technique chips and weekly stove time. It ends with
// a "Reserve your apron" call to action. Use it on a cooking or hands-on course page.

// Design:
// - Cream #fff4e6 section, dark roast #2a1d14 text, tomato #d9480f for the progress line,
//   reached week nodes and labels, olive #5c6b2f for technique chips and the idle track
// - Serif display heading text-4xl → md:text-6xl; mono uppercase week labels; dish lists
//   with dotted leaders and right-aligned times; cards rounded-[28px] with a soft shadow
// - Timeline: a 3px olive/15 track with a tomato fill bound to useScroll progress (scaleY,
//   origin-top); round week nodes turn tomato once the fill passes them
// - Mobile: single column with the rail on the left; md+: rail centred and cards alternate
//   left / right; photos keep a 16:10 ratio and zoom slightly on hover
// - Cards fade up when they enter the viewport (no offset for reduced motion)

// What it does:
// - useScroll({ target, offset: ['start 60%', 'end 60%'] }) drives the line fill;
//   useMotionValueEvent turns the progress into the number of reached weeks (state)
// - Reached nodes swap to a filled tomato style and their week label is announced as
//   "reached" to screen readers; everything else is static content
// - "Reserve your apron" links to #hearth-enrol and "Download the full recipe list" to
//   #hearth-recipes

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ScrollTimelineCourseSyllabus from '@/TestComponent/PageSections/learning/CourseSyllabus02';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <ScrollTimelineCourseSyllabus />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import { LuChefHat, LuClock, LuUtensils } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

const weeks = [
    {
        id: 'knife',
        title: 'Knife Skills & Mise en Place',
        stove: '5 h',
        image: photo('photo-1551218808-94e220e084d2'),
        alt: 'A chef chopping vegetables on a wooden board',
        dishes: [
            ['Classic French omelette', '20 min'],
            ['Pico de gallo & guacamole', '35 min'],
            ['Minestrone on a slow soffritto', '1 h 10 min'],
        ],
        techniques: ['Julienne', 'Brunoise', 'Chiffonade', 'Honing'],
    },
    {
        id: 'sauces',
        title: 'Stocks, Sauces & Emulsions',
        stove: '6 h 30 min',
        image: photo('photo-1498837167922-ddd27525d352'),
        alt: 'Bowls of colourful fresh ingredients laid out on a table',
        dishes: [
            ['Brown chicken stock', '3 h, mostly hands-off'],
            ['Hollandaise over asparagus', '30 min'],
            ['Beurre blanc with pan-seared cod', '40 min'],
        ],
        techniques: ['Deglazing', 'Emulsifying', 'Reduction'],
    },
    {
        id: 'bread',
        title: 'Bread, Dough & Fresh Pasta',
        stove: '7 h',
        image: photo('photo-1509440159596-0249088772ff'),
        alt: 'Rustic loaves of bread with a dark crust',
        dishes: [
            ['Overnight country loaf', '45 min hands-on'],
            ['Rosemary focaccia', '3 h'],
            ['Fresh egg tagliatelle', '1 h'],
        ],
        techniques: ['Autolyse', 'Stretch & fold', 'Proofing'],
    },
    {
        id: 'fire',
        title: 'Fire, Pizza & Flatbreads',
        stove: '6 h',
        image: photo('photo-1565299624946-b28f40a0ae38'),
        alt: 'A freshly baked pizza on a wooden board',
        dishes: [
            ['Neapolitan-style pizza', '2 h'],
            ['Charred za’atar flatbreads', '45 min'],
            ['Grilled lamb kofta with yoghurt', '50 min'],
        ],
        techniques: ['High-heat baking', 'Charring', 'Resting meat'],
    },
    {
        id: 'vegetables',
        title: 'Vegetables at the Centre',
        stove: '5 h 30 min',
        image: photo('photo-1512621776951-a57141f2eefd'),
        alt: 'A colourful healthy salad bowl with vegetables and grains',
        dishes: [
            ['Roast squash, brown butter & sage', '55 min'],
            ['Warm puy lentil salad', '40 min'],
            ['Cauliflower steak with romesco', '50 min'],
        ],
        techniques: ['Roasting', 'Blanching', 'Layered seasoning'],
    },
    {
        id: 'dinner',
        title: 'The Dinner Party',
        stove: '8 h',
        image: photo('photo-1414235077428-338989a2e8c0'),
        alt: 'An elegantly plated dish on a restaurant table',
        dishes: [
            ['Three-course menu for eight', '4 h'],
            ['Plating workshop', '1 h'],
            ['Timeline & shopping plan', '30 min'],
        ],
        techniques: ['Menu planning', 'Plating', 'Service timing'],
    },
]

const pad = (n) => String(n).padStart(2, '0')

export function ScrollTimelineCourseSyllabus({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const timelineRef = useRef(null)
    const [reached, setReached] = useState(0)
    const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 60%', 'end 60%'] })

    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        const count = weeks.filter((_, i) => value > i / weeks.length + 0.01).length
        setReached((prev) => (prev === count ? prev : count))
    })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fff4e6] px-4 py-16 text-base font-normal text-[#2a1d14] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#d9480f]">
                        <LuChefHat className="h-4 w-4" aria-hidden="true" />
                        Hearth Culinary School · Home Cook Diploma
                    </p>
                    <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#2a1d14] sm:text-5xl md:text-6xl">
                        Six weeks from knife skills to a <em className="text-[#d9480f]">dinner party</em> for eight.
                    </h2>
                    <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#2a1d14]/70">
                        <li>6 weeks</li>
                        <li aria-hidden="true" className="text-[#d9480f]">•</li>
                        <li>18 dishes</li>
                        <li aria-hidden="true" className="text-[#d9480f]">•</li>
                        <li>2 live kitchen classes a week</li>
                        <li aria-hidden="true" className="text-[#d9480f]">•</li>
                        <li>Small groups of 10</li>
                    </ul>
                </div>

                <div ref={timelineRef} className="relative mt-14 md:mt-20">
                    <div
                        className="absolute bottom-0 left-5 top-0 w-[3px] -translate-x-1/2 rounded-full bg-[#5c6b2f]/15 md:left-1/2"
                        aria-hidden="true"
                    >
                        <motion.div
                            className="h-full w-full origin-top rounded-full bg-[#d9480f]"
                            style={{ scaleY: scrollYProgress }}
                        />
                    </div>

                    <ol className="space-y-10 md:space-y-16">
                        {weeks.map((week, index) => {
                            const isReached = index < reached
                            const right = index % 2 === 1
                            return (
                                <li key={week.id} className="relative pl-14 md:pl-0">
                                    <span
                                        className={cn(
                                            'absolute left-5 top-5 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border-[3px] font-mono text-xs font-bold transition-colors duration-300 md:left-1/2',
                                            isReached
                                                ? 'border-[#d9480f] bg-[#d9480f] text-[#fff4e6]'
                                                : 'border-[#5c6b2f]/30 bg-[#fff4e6] text-[#5c6b2f]',
                                        )}
                                        aria-hidden="true"
                                    >
                                        {pad(index + 1)}
                                    </span>

                                    <motion.article
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        className={cn(
                                            'group overflow-hidden rounded-[28px] border border-[#5c6b2f]/15 bg-white/70 shadow-[0_24px_50px_-30px_rgba(42,29,20,0.45)] md:w-[calc(50%-3rem)]',
                                            right && 'md:ml-auto',
                                        )}
                                    >
                                        <div className="aspect-[16/10] overflow-hidden">
                                            <img
                                                src={week.image}
                                                alt={week.alt}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                                            />
                                        </div>
                                        <div className="p-5 sm:p-7">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#d9480f]">
                                                    Week {pad(index + 1)}
                                                    <span className="sr-only">{isReached ? ', reached' : ''}</span>
                                                </p>
                                                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c6b2f]">
                                                    <LuClock className="h-3.5 w-3.5" aria-hidden="true" />
                                                    ≈ {week.stove} at the stove
                                                </p>
                                            </div>
                                            <h3 className="mt-3 font-serif text-2xl font-normal leading-tight text-[#2a1d14] sm:text-3xl">
                                                {week.title}
                                            </h3>

                                            <p className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2a1d14]/55">
                                                <LuUtensils className="h-3.5 w-3.5" aria-hidden="true" />
                                                You will cook
                                            </p>
                                            <ul className="mt-2 space-y-2">
                                                {week.dishes.map(([dish, time]) => (
                                                    <li key={dish} className="flex items-baseline gap-2 text-sm sm:text-base">
                                                        <span className="text-[#2a1d14]">{dish}</span>
                                                        <span
                                                            className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-[#2a1d14]/30"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="shrink-0 text-right font-mono text-xs text-[#2a1d14]/65">{time}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Techniques">
                                                {week.techniques.map((technique) => (
                                                    <li
                                                        key={technique}
                                                        className="rounded-full bg-[#5c6b2f]/10 px-3 py-1 text-xs font-semibold text-[#5c6b2f]"
                                                    >
                                                        {technique}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.article>
                                </li>
                            )
                        })}
                    </ol>
                </div>

                <div className="mt-16 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
                    <a
                        href="#hearth-enrol"
                        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#d9480f] px-7 text-base font-semibold text-[#fff4e6] transition-colors hover:bg-[#b83c0b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9480f]"
                    >
                        Reserve your apron · from £640
                        <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a
                        href="#hearth-recipes"
                        className="inline-flex min-h-12 items-center text-sm font-semibold text-[#5c6b2f] underline decoration-[#5c6b2f]/40 underline-offset-4 hover:decoration-[#5c6b2f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5c6b2f]"
                    >
                        Download the full recipe list
                    </a>
                </div>
                <p className="mt-4 text-center text-xs text-[#2a1d14]/55">Next intake starts Monday 9 November 2026</p>
            </div>
        </section>
    )
}

export default ScrollTimelineCourseSyllabus

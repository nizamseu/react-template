// StatRibbonSuccessStories

// SuccessStories04 · Learning Management Systems › Student Success Stories & Certificates

// Description:
// An energetic outcomes section for the fictional online skills platform Upskill Nation.
// Under "Proof, in numbers and in their words." a tilted orange-to-pink ribbon counts up
// three big stats (87% placed within six months, +34% average salary increase, 4.8 / 5
// rating) and two rows of learner testimonials glide past in opposite directions. Use it
// on a course marketplace home page or a pricing page to back up claims with evidence.

// Design:
// - White #fff section, ink #111 text; the ribbon is a full-bleed bg-linear-to-r from
//   #ff7a00 to #ff2d95, skewed -3deg with its content counter-skewed so text stays level
// - Huge white sans numerals (text-7xl → lg:text-9xl, font-black, tabular-nums) with
//   white/30 dividers; the heading word "numbers" uses the same gradient via bg-clip-text
// - Testimonial cards are white rounded-2xl with a gray-200 border, gradient stars, a
//   quote and an avatar; row edges fade out with a CSS mask-image gradient
// - Marquee rows move with useAnimationFrame (row one left, row two right) and pause on
//   hover; reduced motion stops them and turns each row into a swipeable scroll-snap strip
// - Responsive: stats stack with horizontal dividers on mobile and sit in 3 columns from
//   md; cards are w-72 → sm:w-80; the root is overflow-hidden so nothing spills sideways

// What it does:
// - Each stat is a MotionValue: server renders the final value, on mount it resets to 0 and
//   useInView (once) runs animate(); sr-only text carries the real figure
// - paused state (Pause / Play button, aria-pressed) stops both rows; hovering a row also
//   pauses it; rows loop seamlessly by rendering two copies (the copy is aria-hidden)
// - "Browse 140 courses" links to #courses and "Read the outcomes report" to #outcomes-report

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StatRibbonSuccessStories from '@/TestComponent/PageSections/learning/SuccessStories04';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <StatRibbonSuccessStories />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import {
    animate,
    motion,
    useAnimationFrame,
    useInView,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from 'framer-motion';
import { HiArrowRight, HiPause, HiPlay, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const stats = [
    { id: 'placed', to: 87, decimals: 0, prefix: '', suffix: '%', label: 'placed in a new role within six months', sr: '87 percent' },
    { id: 'salary', to: 34, decimals: 0, prefix: '+', suffix: '%', label: 'average salary increase after finishing', sr: 'plus 34 percent' },
    { id: 'rating', to: 4.8, decimals: 1, prefix: '', suffix: '/5', label: 'average rating from 9,200 reviews', sr: '4.8 out of 5' },
]

const avatar = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=200&q=80`

const rowOne = [
    { id: 'r1', name: 'Hana Suzuki', course: 'Data Analysis with Python', quote: 'Three months of evenings and I automated the report that ate my Mondays. My manager noticed.', image: avatar('1544005313-94ddf0286df2'), alt: 'Woman in a striped shirt' },
    { id: 'r2', name: 'Marcus Bell', course: 'Cloud Fundamentals', quote: 'Passed the associate exam first try. The practice labs were closer to the real thing than the exam guide.', image: avatar('1500648767791-00dcc994a43e'), alt: 'Man in a grey sweater' },
    { id: 'r3', name: 'Zara Ahmed', course: 'UX Writing', quote: 'I went from support agent to content designer at the same company. The portfolio brief did the talking.', image: avatar('1488426862026-3ee34a7d66df'), alt: 'Woman in a denim jacket against a pink wall' },
    { id: 'r4', name: 'Olu Adeyemi', course: 'Project Management', quote: 'Real templates, real stakeholder drama in the role-plays. I use the RACI sheet every week.', image: avatar('1566492031773-4f4e44671857'), alt: 'Man with glasses in a striped tee' },
    { id: 'r5', name: 'Grace Whitfield', course: 'Digital Marketing', quote: 'Cut our cost per lead by 41% in my first campaign after the course. Paid for itself in a fortnight.', image: avatar('1573496359142-b8d87734a5a2'), alt: 'Professional woman in a grey blazer' },
]

const rowTwo = [
    { id: 's1', name: 'Diego Ramos', course: 'Frontend Development', quote: 'The code reviews from mentors were brutal in the best way. Six weeks later I shipped my first PR at work.', image: avatar('1535713875002-d1d0cf377fde'), alt: 'Young man in a dark shirt' },
    { id: 's2', name: 'Priyanka Iyer', course: 'Financial Modelling', quote: 'Finally understand what the finance team is talking about in budget season. And now I am on it.', image: avatar('1531746020798-e6953c6e8e04'), alt: 'Woman against a pink backdrop' },
    { id: 's3', name: 'Tom Gallagher', course: 'Cybersecurity Essentials', quote: 'Moved from IT help desk to a SOC analyst role. The capture-the-flag weekends sealed it.', image: avatar('1507003211169-0a1dd7228f2d'), alt: 'Smiling man in a white tee' },
    { id: 's4', name: 'Leila Nasser', course: 'Product Analytics', quote: 'I set up our first funnel dashboard two weeks into the course. It is still the one everyone opens.', image: avatar('1614644147724-2d4785d69962'), alt: 'Laughing woman in a pink jacket' },
    { id: 's5', name: 'Ben Okafor', course: 'Excel to SQL', quote: 'Bite-sized lessons I could do on the train. 22 minutes each way, 40 lessons, one new job.', image: avatar('1552058544-f2b08422138a'), alt: 'Bearded bald man in black and white' },
]

function Stat({ stat, start, reduce, delay }) {
    const value = useMotionValue(stat.to)
    const text = useTransform(value, (v) => `${stat.prefix}${v.toFixed(stat.decimals)}`)

    useEffect(() => {
        if (reduce) {
            value.set(stat.to)
            return undefined
        }
        if (!start) {
            value.set(0)
            return undefined
        }
        const controls = animate(value, stat.to, { duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] })
        return () => controls.stop()
    }, [start, reduce, delay, stat.to, value])

    return (
        <div className="py-6 md:px-8 md:py-2 first:md:pl-0 last:md:pr-0">
            <p className="flex items-start text-7xl font-black leading-none tracking-tighter tabular-nums text-white sm:text-8xl lg:text-9xl">
                <motion.span aria-hidden="true">{text}</motion.span>
                <span aria-hidden="true" className="ml-1 mt-2 text-2xl font-bold tracking-tight text-white/85 sm:text-3xl lg:mt-4 lg:text-4xl">
                    {stat.suffix}
                </span>
                <span className="sr-only">{stat.sr}</span>
            </p>
            <p className="mt-3 max-w-[16rem] text-sm font-medium leading-snug text-white/90 sm:text-base">{stat.label}</p>
        </div>
    )
}

function Card({ t }) {
    return (
        <figure className="flex w-72 shrink-0 snap-start flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(255,45,149,0.45)] sm:w-80">
            <div className="flex gap-0.5" aria-label="Rated 5 out of 5" role="img">
                {[0, 1, 2, 3, 4].map((i) => (
                    <HiStar key={i} className={cn('h-4 w-4', i < 3 ? 'text-[#ff7a00]' : 'text-[#ff2d95]')} aria-hidden="true" />
                ))}
            </div>
            <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-[#111]">“{t.quote}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
                <img src={t.image} alt={t.alt} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#111]">{t.name}</span>
                    <span className="block truncate text-xs text-gray-500">{t.course}</span>
                </span>
            </figcaption>
        </figure>
    )
}

function MarqueeRow({ items, direction, paused, reduce, label }) {
    const x = useMotionValue(0)
    const setRef = useRef(null)
    const [hovering, setHovering] = useState(false)

    useAnimationFrame((_, delta) => {
        if (reduce || paused || hovering) return
        const width = setRef.current ? setRef.current.offsetWidth : 0
        if (!width) return
        let next = x.get() - direction * 40 * (Math.min(delta, 64) / 1000)
        if (next <= -width) next += width
        if (next > 0) next -= width
        x.set(next)
    })

    if (reduce) {
        return (
            <ul aria-label={label} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-10">
                {items.map((t) => (
                    <li key={t.id} className="flex">
                        <Card t={t} />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div
            className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <motion.div className="flex w-max" style={{ x }}>
                <ul ref={setRef} aria-label={label} className="flex gap-4 pr-4">
                    {items.map((t) => (
                        <li key={t.id} className="flex">
                            <Card t={t} />
                        </li>
                    ))}
                </ul>
                <ul aria-hidden="true" className="flex gap-4 pr-4">
                    {items.map((t) => (
                        <li key={t.id} className="flex">
                            <Card t={t} />
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    )
}

export function StatRibbonSuccessStories({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [paused, setPaused] = useState(false)
    const ribbonRef = useRef(null)
    const inView = useInView(ribbonRef, { once: true, amount: 0.4 })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white py-16 text-base font-normal text-[#111] antialiased md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ff2d95]">Upskill Nation · 2025 outcomes</p>
                        <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-[#111] sm:text-5xl lg:text-6xl">
                            Proof, in{' '}
                            <span className="bg-linear-to-r from-[#ff7a00] to-[#ff2d95] bg-clip-text text-transparent">numbers</span> and in
                            their words.
                        </h2>
                    </div>
                    <a
                        href="#outcomes-report"
                        className="inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-[#111] underline decoration-[#ff2d95] decoration-2 underline-offset-8 hover:text-[#ff2d95] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2d95] md:self-auto"
                    >
                        Read the outcomes report
                        <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                </div>
            </div>

            <div ref={ribbonRef} className="relative mt-14 -skew-y-3 bg-linear-to-r from-[#ff7a00] to-[#ff2d95] py-10 md:mt-20 md:py-14">
                <div className="mx-auto max-w-7xl skew-y-3 px-4 sm:px-6 lg:px-10">
                    <div className="grid divide-y divide-white/30 md:grid-cols-3 md:divide-x md:divide-y-0">
                        {stats.map((s, i) => (
                            <Stat key={s.id} stat={s} start={inView} reduce={reduce} delay={i * 0.15} />
                        ))}
                    </div>
                    <p className="mt-6 text-xs text-white/80">
                        Based on 12,300 learners who finished a career track in 2025. Audited by Clearline Partners.
                    </p>
                </div>
            </div>

            <div className="mt-16 md:mt-24">
                <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
                    <h3 className="text-lg font-bold tracking-tight text-[#111] sm:text-xl">What 9,200 reviewers say</h3>
                    {!reduce && (
                        <button
                            type="button"
                            aria-pressed={paused}
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-gray-300 px-4 text-sm font-semibold text-[#111] transition-colors hover:border-[#ff2d95] hover:text-[#ff2d95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2d95]"
                            onClick={() => setPaused((p) => !p)}
                        >
                            {paused ? <HiPlay className="h-4 w-4" aria-hidden="true" /> : <HiPause className="h-4 w-4" aria-hidden="true" />}
                            {paused ? 'Play' : 'Pause'}
                            <span className="sr-only"> testimonials</span>
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    <MarqueeRow items={rowOne} direction={1} paused={paused} reduce={reduce} label="Testimonials, row one" />
                    <MarqueeRow items={rowTwo} direction={-1} paused={paused} reduce={reduce} label="Testimonials, row two" />
                </div>
                <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-10">
                    <a
                        href="#courses"
                        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-linear-to-r from-[#ff7a00] to-[#ff2d95] px-7 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(255,45,149,0.7)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2d95] motion-reduce:transition-none"
                    >
                        Browse 140 courses
                        <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default StatRibbonSuccessStories

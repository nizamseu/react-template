// CenterLineExperienceTimeline

// ExperienceTimeline01 · Portfolios & Personal Websites › Experience & Education Timeline

// Description:
// A centred, editorial career timeline for product designer Elena Rossi. Under the serif
// heading "Thirteen years, five rooms, one thread." five entries (Fernwood, Atelier Nove,
// Brightline Health, the MA at Accademia Lumen and Studio Carta) alternate left and right
// of a central line. Each shows large italic years, place, role, company and exactly two
// quantified achievements. Use it on a designer's about or CV page.

// Design:
// - Blush #f7e8e1 page, espresso #3b2a24 type, cards in #fcf3ee with hairline borders,
//   rounded-[28px] and a soft espresso shadow; font-serif for years, roles and heading
// - Central 1px line (left-6 on mobile, centred from md) with an espresso progress line
//   that grows with scroll; round nodes fill espresso as their entry enters view
// - Entries alternate sides from md (years on one side, card on the other, even/odd);
//   education cards use a dashed border and a cap icon, work cards a briefcase
// - Card hover lifts 4px; entries fade/rise in on view (no offsets for reduced motion)
// - Responsive: single column with a left rail below md, two columns from md, max 72rem

// What it does:
// - A passive, rAF-throttled window scroll/resize listener maps the list position (top at
//   75% of the viewport → bottom at 55%) to a springed scaleY on the progress line;
//   listeners are removed on unmount; reduced motion shows the full line, no tracking
// - Nodes and cards animate once with whileInView; no other state
// - Footer links: "Download CV" → #elena-cv and "Let’s talk" → #elena-contact

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CenterLineExperienceTimeline from '@/TestComponent/PageSections/portfolio/ExperienceTimeline01';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <CenterLineExperienceTimeline />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { HiArrowDownTray, HiArrowLongRight, HiOutlineAcademicCap, HiOutlineBriefcase } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const entries = [
    {
        id: 'fernwood',
        type: 'work',
        from: '2023',
        to: 'Now',
        place: 'Milan · hybrid',
        role: 'Lead Product Designer',
        org: 'Fernwood',
        orgNote: 'home-goods marketplace',
        wins: [
            'Rebuilt the Fernwood design system (v4): 212 components, design-to-dev handoff 38% faster.',
            'Led the mobile checkout redesign that lifted conversion by 11.4% in its first quarter.',
        ],
    },
    {
        id: 'atelier-nove',
        type: 'work',
        from: '2020',
        to: '2023',
        place: 'Turin',
        role: 'Senior Product Designer',
        org: 'Atelier Nove',
        orgNote: 'fintech product studio',
        wins: [
            'Designed onboarding for the Quercia Bank app, cutting sign-up drop-off from 46% to 19%.',
            'Mentored six junior designers; two of them now lead product squads.',
        ],
    },
    {
        id: 'brightline',
        type: 'work',
        from: '2018',
        to: '2020',
        place: 'London',
        role: 'Product Designer',
        org: 'Brightline Health',
        orgNote: 'patient care app',
        wins: [
            'Shipped a medication-reminder flow now used by 280,000 patients each month.',
            'Ran 64 usability sessions with patients over 65 and rewrote the app’s type scale for them.',
        ],
    },
    {
        id: 'lumen',
        type: 'education',
        from: '2016',
        to: '2018',
        place: 'Milan',
        role: 'MA Interaction Design',
        org: 'Accademia Lumen',
        orgNote: 'graduated with distinction',
        wins: [
            'Thesis “Slow Interfaces” on calm notifications, shown at the 2018 Lumen degree show.',
            'Teaching assistant for Typography II, two semesters, 48 students.',
        ],
    },
    {
        id: 'carta',
        type: 'work',
        from: '2013',
        to: '2016',
        place: 'Bologna',
        role: 'Junior Graphic Designer',
        org: 'Studio Carta',
        orgNote: 'editorial & brand studio',
        wins: [
            'Designed 30+ book covers for the Collana Blu paperback series.',
            'Built the studio’s first responsive website, which still runs today.',
        ],
    },
]

export function CenterLineExperienceTimeline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const listRef = useRef(null)
    const rawProgress = useMotionValue(0)
    const progress = useSpring(rawProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

    useEffect(() => {
        if (reduceMotion) return undefined
        let raf = 0
        const update = () => {
            raf = 0
            const el = listRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight
            // 0 when the list top reaches 75% of the viewport, 1 when its bottom reaches 55%
            const value = (vh * 0.75 - rect.top) / (rect.height + vh * 0.2)
            rawProgress.set(Math.min(1, Math.max(0, value)))
        }
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update)
        }
        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
    }, [reduceMotion, rawProgress])

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#f7e8e1] text-base font-normal text-[#3b2a24]', className)}
            {...props}
        >
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#3b2a24]/60">
                        Elena Rossi · Experience &amp; education
                    </p>
                    <h2 className="mt-5 font-serif text-5xl font-normal leading-[1.02] tracking-tight text-[#3b2a24] sm:text-6xl lg:text-7xl">
                        Thirteen years, <em className="italic">five rooms,</em> one thread.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#3b2a24]/70">
                        From book covers in Bologna to design systems in Milan, the thread is the same:
                        make complicated things feel calm.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#3b2a24]/70">
                        <span className="inline-flex items-center gap-2">
                            <HiOutlineBriefcase aria-hidden="true" className="size-4" /> Work
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <HiOutlineAcademicCap aria-hidden="true" className="size-4" /> Education
                        </span>
                    </div>
                </div>

                <div ref={listRef} className="relative mt-16 md:mt-24">
                    <div aria-hidden="true" className="absolute inset-y-0 left-6 w-px -translate-x-1/2 bg-[#3b2a24]/15 md:left-1/2" />
                    <motion.div
                        aria-hidden="true"
                        className="absolute inset-y-0 left-6 w-[2px] origin-top -translate-x-1/2 bg-[#3b2a24] md:left-1/2"
                        style={{ scaleY: reduceMotion ? 1 : progress }}
                    />

                    <ol className="relative space-y-14 md:space-y-20">
                        {entries.map((entry, index) => {
                            const flip = index % 2 === 1
                            const isEdu = entry.type === 'education'
                            const TypeIcon = isEdu ? HiOutlineAcademicCap : HiOutlineBriefcase
                            return (
                                <li key={entry.id} className="relative grid gap-4 pl-16 md:grid-cols-2 md:gap-24 md:pl-0">
                                    <motion.span
                                        aria-hidden="true"
                                        className="absolute left-6 top-2 grid size-5 -translate-x-1/2 place-items-center rounded-full border-2 border-[#3b2a24] md:left-1/2 md:top-6"
                                        initial={{ backgroundColor: reduceMotion ? '#3b2a24' : '#f7e8e1' }}
                                        whileInView={{ backgroundColor: '#3b2a24' }}
                                        viewport={{ once: true, margin: '0px 0px -45% 0px' }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <span className="size-1.5 rounded-full bg-[#f7e8e1]" />
                                    </motion.span>

                                    <motion.div
                                        className={cn(
                                            'md:row-start-1 md:pt-3',
                                            flip ? 'md:col-start-2 md:text-left' : 'md:col-start-1 md:text-right',
                                        )}
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <p className="font-serif text-4xl italic leading-none text-[#3b2a24] sm:text-5xl lg:text-6xl">
                                            {entry.from}
                                            <span className="text-[#3b2a24]/35"> – {entry.to}</span>
                                        </p>
                                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#3b2a24]/60">
                                            {entry.place}
                                        </p>
                                    </motion.div>

                                    <motion.article
                                        className={cn(
                                            'group rounded-[28px] border bg-[#fcf3ee] p-6 shadow-[0_24px_50px_-34px_rgba(59,42,36,0.55)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0 sm:p-8 md:row-start-1',
                                            flip ? 'md:col-start-1' : 'md:col-start-2',
                                            isEdu ? 'border-dashed border-[#3b2a24]/35' : 'border-[#3b2a24]/10',
                                        )}
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="font-serif text-2xl font-normal leading-tight text-[#3b2a24] sm:text-3xl">
                                                    {entry.role}
                                                </h3>
                                                <p className="mt-1.5 text-sm text-[#3b2a24]/70">
                                                    <span className="font-semibold text-[#3b2a24]">{entry.org}</span>
                                                    <span aria-hidden="true"> · </span>
                                                    <span className="italic">{entry.orgNote}</span>
                                                </p>
                                            </div>
                                            <span
                                                className="grid size-10 shrink-0 place-items-center rounded-full border border-[#3b2a24]/20 text-[#3b2a24]"
                                                title={isEdu ? 'Education' : 'Work'}
                                            >
                                                <TypeIcon aria-hidden="true" className="size-5" />
                                                <span className="sr-only">{isEdu ? 'Education' : 'Work'}</span>
                                            </span>
                                        </div>
                                        <ul className="mt-6 space-y-3 border-t border-[#3b2a24]/10 pt-5">
                                            {entry.wins.map((win, i) => (
                                                <li key={win} className="flex gap-3 text-[15px] leading-relaxed text-[#3b2a24]/85">
                                                    <span className="mt-0.5 shrink-0 font-serif text-sm italic text-[#3b2a24]/50">
                                                        {i === 0 ? 'i.' : 'ii.'}
                                                    </span>
                                                    <span>{win}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.article>
                                </li>
                            )
                        })}
                    </ol>
                </div>

                <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-24">
                    <a
                        href="#elena-cv"
                        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#3b2a24] px-6 text-sm font-semibold text-[#f7e8e1] transition-colors duration-300 hover:bg-[#2a1d18] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3b2a24]"
                    >
                        <HiArrowDownTray aria-hidden="true" className="size-4" />
                        Download CV
                    </a>
                    <a
                        href="#elena-contact"
                        className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-[#3b2a24]/30 px-6 text-sm font-semibold text-[#3b2a24] transition-colors duration-300 hover:border-[#3b2a24] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3b2a24]"
                    >
                        Let’s talk
                        <HiArrowLongRight
                            aria-hidden="true"
                            className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CenterLineExperienceTimeline

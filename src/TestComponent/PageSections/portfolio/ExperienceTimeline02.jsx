// WorkStudyTabsExperienceTimeline

// ExperienceTimeline02 · Portfolios & Personal Websites › Experience & Education Timeline

// Description:
// A crisp, Swiss-style résumé section for frontend developer Rafi Chowdhury. A sliding
// "Work 05 / Education 03" switch swaps between two lists, and every row (years, role,
// company, location) expands like an accordion into a summary, three results, the stack
// used and one headline metric (e.g. "−59% JS on first load" at Loomwork). The heading
// "Where I’ve worked & what I’ve learned." sits beside summary stats and a "Download
// résumé" link. Use it as the experience block of a developer portfolio.

// Design:
// - White #ffffff page, ink #0a0a0a, cobalt #1f3fff for the active pill, company names,
//   metric and the left accent bar of an open row; hairline #0a0a0a/12 dividers
// - Grotesk display heading (text-5xl → lg:text-7xl, tracking-tighter), mono eyebrows and
//   years; rows use text-xl → sm:text-2xl roles with a 40px round +/− toggle
// - Tab switch: rounded-full track with a cobalt pill that slides via shared layoutId
// - Motion: list cross-fades on tab change, details open with a height/opacity tween, the
//   toggle icon rotates 45°; all offsets and tweens are dropped for reduced motion
// - Layout: stacked on mobile; lg 12-col with a sticky intro (5 cols) and list (7 cols);
//   the location column appears from sm

// What it does:
// - tab ("work" | "education") uses the WAI-ARIA tabs pattern with Arrow keys, Home, End;
//   switching tabs opens the first row of that list
// - open (row id) toggles one row at a time; row buttons expose aria-expanded and
//   aria-controls, and the details region is labelled by its row
// - "Download résumé" links to #rafi-resume, "Say hello" to #rafi-contact

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import WorkStudyTabsExperienceTimeline from '@/TestComponent/PageSections/portfolio/ExperienceTimeline02';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <WorkStudyTabsExperienceTimeline />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowDownTray, HiArrowUpRight, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const lists = {
    work: [
        {
            id: 'loomwork',
            years: '2023 — Now',
            role: 'Senior Frontend Engineer',
            org: 'Loomwork',
            place: 'Berlin · remote',
            summary: 'Collaborative whiteboard for design teams, 180k weekly users.',
            points: [
                'Rebuilt the canvas renderer in React + WebGL; holds 60fps with 5,000 objects.',
                'Owns the design-system package used by 11 product teams.',
                'Cut JavaScript on first load from 412 kB to 168 kB.',
            ],
            stack: ['React', 'TypeScript', 'WebGL', 'Vite'],
            metric: ['−59%', 'JS on first load'],
        },
        {
            id: 'kestrel',
            years: '2021 — 2023',
            role: 'Frontend Engineer',
            org: 'Kestrel Analytics',
            place: 'Dhaka · hybrid',
            summary: 'Self-serve analytics for mid-size retailers.',
            points: [
                'Led the dashboard rewrite from a legacy SPA to Next.js with streaming SSR.',
                'Introduced visual regression tests; UI bugs in production fell by half.',
                'Built a chart kit of 14 accessible, keyboard-navigable chart types.',
            ],
            stack: ['Next.js', 'D3', 'Storybook', 'Playwright'],
            metric: ['3.1×', 'faster time to interactive'],
        },
        {
            id: 'tidepool',
            years: '2019 — 2021',
            role: 'Frontend Developer',
            org: 'Tidepool Commerce',
            place: 'Dhaka',
            summary: 'Storefront platform for independent shops.',
            points: [
                'Built the theme engine behind 1,800 live storefronts.',
                'Shipped a checkout that works on 2G connections under 3 seconds.',
                'Ran the frontend guild: 9 engineers, fortnightly talks.',
            ],
            stack: ['Vue', 'Nuxt', 'Sass', 'GraphQL'],
            metric: ['1.2M', 'monthly shoppers served'],
        },
        {
            id: 'hexa',
            years: '2018 — 2019',
            role: 'Junior Web Developer',
            org: 'Hexa Studio',
            place: 'Chattogram',
            summary: 'Digital agency for brands and NGOs.',
            points: [
                'Coded marketing sites and microsites for 22 clients.',
                'Introduced Git and code review to a team of six.',
                'Built the studio’s reusable landing-page starter.',
            ],
            stack: ['JavaScript', 'Webpack', 'WordPress', 'GSAP'],
            metric: ['22', 'sites shipped in 14 months'],
        },
        {
            id: 'freelance',
            years: '2016 — 2018',
            role: 'Freelance Web Developer',
            org: 'Self-employed',
            place: 'Sylhet',
            summary: 'Websites for local shops, schools and restaurants.',
            points: [
                'Designed and built 40+ sites, most still online.',
                'Learned to estimate, invoice and say no politely.',
                'Taught two clients to update their own content.',
            ],
            stack: ['HTML', 'CSS', 'jQuery', 'PHP'],
            metric: ['40+', 'small-business clients'],
        },
    ],
    education: [
        {
            id: 'must',
            years: '2014 — 2018',
            role: 'BSc Computer Science & Engineering',
            org: 'Meghna University of Science & Technology',
            place: 'Sylhet',
            summary: 'CGPA 3.78 / 4.00, Dean’s list for six semesters.',
            points: [
                'Thesis: accessible data visualisation for screen-reader users.',
                'Ran the university web club and its first hackathon (120 students).',
                'Teaching assistant for Web Technologies, 2017.',
            ],
            stack: ['Algorithms', 'HCI', 'Databases', 'Networks'],
            metric: ['3.78', 'CGPA out of 4.00'],
        },
        {
            id: 'studio-nine',
            years: '2020',
            role: 'Certificate, Motion for Interfaces',
            org: 'Studio Nine School of Interface Design',
            place: 'Online · 12 weeks',
            summary: 'Animation principles applied to product UI.',
            points: [
                'Final project: a gesture-driven photo viewer, awarded best in cohort.',
                'Studied easing, choreography and reduced-motion alternatives.',
                'Paired weekly with a motion designer from the industry.',
            ],
            stack: ['Motion', 'Prototyping', 'Framer', 'After Effects'],
            metric: ['1st', 'in a cohort of 64'],
        },
        {
            id: 'owc',
            years: '2022',
            role: 'Web Accessibility Specialist Program',
            org: 'Open Web Collective',
            place: 'Online · 16 weeks',
            summary: 'Hands-on WCAG 2.2 auditing and remediation.',
            points: [
                'Audited three production apps and published the remediation plans.',
                'Screen-reader testing with NVDA, VoiceOver and TalkBack.',
                'Now leads accessibility reviews at Loomwork.',
            ],
            stack: ['WCAG 2.2', 'ARIA', 'Auditing', 'Testing'],
            metric: ['3', 'production audits published'],
        },
    ],
}

const tabs = [
    { id: 'work', label: 'Work' },
    { id: 'education', label: 'Education' },
]

export function WorkStudyTabsExperienceTimeline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const [tab, setTab] = useState('work')
    const [open, setOpen] = useState(lists.work[0].id)
    const tabRefs = useRef([])
    const items = lists[tab]

    const selectTab = (id) => {
        if (id === tab) return
        setTab(id)
        setOpen(lists[id][0].id)
    }

    const onKeyDown = (event) => {
        const index = tabs.findIndex((t) => t.id === tab)
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = tabs.length - 1
        if (next === null) return
        event.preventDefault()
        selectTab(tabs[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white text-base font-normal text-[#0a0a0a]', className)}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12 lg:gap-16 lg:px-8">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-10">
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#0a0a0a]/60">
                            (04) Path · Rafi Chowdhury
                        </p>
                        <h2 className="mt-6 font-sans text-5xl font-semibold leading-[0.95] tracking-tighter text-[#0a0a0a] sm:text-6xl lg:text-7xl">
                            Where I’ve worked <span className="text-[#1f3fff]">&amp; what I’ve learned.</span>
                        </h2>
                        <p className="mt-6 max-w-md text-base leading-relaxed text-[#0a0a0a]/70">
                            Eight years building interfaces people use every day, from a Sylhet freelance desk
                            to a Berlin whiteboard startup.
                        </p>

                        <div
                            role="tablist"
                            aria-label="Experience type"
                            className="mt-10 inline-flex rounded-full border border-[#0a0a0a]/12 bg-[#f5f6fa] p-1"
                            onKeyDown={onKeyDown}
                        >
                            {tabs.map((t, index) => {
                                const selected = t.id === tab
                                return (
                                    <button
                                        key={t.id}
                                        ref={(el) => {
                                            tabRefs.current[index] = el
                                        }}
                                        id={`${uid}-tab-${t.id}`}
                                        type="button"
                                        role="tab"
                                        aria-selected={selected}
                                        aria-controls={`${uid}-panel`}
                                        tabIndex={selected ? 0 : -1}
                                        className={cn(
                                            'relative min-h-11 rounded-full px-5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff] sm:px-6',
                                            selected ? 'text-white' : 'text-[#0a0a0a]/70 hover:text-[#0a0a0a]',
                                        )}
                                        onClick={() => selectTab(t.id)}
                                    >
                                        {selected && (
                                            <motion.span
                                                layoutId={`${uid}-pill`}
                                                aria-hidden="true"
                                                className="absolute inset-0 rounded-full bg-[#1f3fff]"
                                                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                            />
                                        )}
                                        <span className="relative inline-flex items-baseline gap-2">
                                            {t.label}
                                            <span className={cn('font-mono text-[11px]', selected ? 'text-white/70' : 'text-[#0a0a0a]/45')}>
                                                {String(lists[t.id].length).padStart(2, '0')}
                                            </span>
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[#0a0a0a]/12 pt-6">
                            {[
                                ['8', 'years in industry'],
                                ['4', 'product teams'],
                                ['2.4M', 'people reached'],
                            ].map(([value, label]) => (
                                <div key={label}>
                                    <dt className="sr-only">{label}</dt>
                                    <dd className="text-3xl font-semibold tracking-tight text-[#0a0a0a]">{value}</dd>
                                    <dd className="mt-1 text-xs leading-snug text-[#0a0a0a]/60">{label}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-10 flex flex-wrap gap-3">
                            <a
                                href="#rafi-resume"
                                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0a0a0a] px-5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#1f3fff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]"
                            >
                                <HiArrowDownTray aria-hidden="true" className="size-4" />
                                Download résumé
                            </a>
                            <a
                                href="#rafi-contact"
                                className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0a0a0a]/15 px-5 text-sm font-semibold text-[#0a0a0a] transition-colors duration-300 hover:border-[#1f3fff] hover:text-[#1f3fff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]"
                            >
                                Say hello
                                <HiArrowUpRight
                                    aria-hidden="true"
                                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div
                    id={`${uid}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${uid}-tab-${tab}`}
                    className="lg:col-span-7"
                >
                    <div className="hidden grid-cols-[8.5rem_minmax(0,1fr)_9rem_2.5rem] gap-4 border-b border-[#0a0a0a] pb-3 pl-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0a0a0a]/55 sm:grid">
                        <span>Years</span>
                        <span>{tab === 'work' ? 'Role · Company' : 'Programme · School'}</span>
                        <span>Location</span>
                        <span className="sr-only">Toggle</span>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.ol
                            key={tab}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="border-t border-[#0a0a0a] sm:border-t-0"
                        >
                            {items.map((item) => {
                                const isOpen = open === item.id
                                const rowId = `${uid}-row-${item.id}`
                                const panelId = `${uid}-details-${item.id}`
                                return (
                                    <li key={item.id} className="relative border-b border-[#0a0a0a]/12">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'absolute left-0 top-0 w-[3px] bg-[#1f3fff] transition-all duration-500',
                                                isOpen ? 'h-full opacity-100' : 'h-0 opacity-0',
                                            )}
                                        />
                                        <h3 className="text-base font-normal text-[#0a0a0a]">
                                            <button
                                                id={rowId}
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                                className="group grid w-full grid-cols-[minmax(0,1fr)_2.5rem] items-start gap-x-4 gap-y-1 py-5 pl-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1f3fff] sm:grid-cols-[8.5rem_minmax(0,1fr)_9rem_2.5rem] sm:items-center sm:pl-3"
                                                onClick={() => setOpen(isOpen ? null : item.id)}
                                            >
                                                <span className="col-span-2 font-mono text-xs text-[#0a0a0a]/55 sm:col-span-1 sm:text-[13px]">
                                                    {item.years}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-xl font-medium leading-tight tracking-tight text-[#0a0a0a] transition-colors duration-300 group-hover:text-[#1f3fff] sm:text-2xl">
                                                        {item.role}
                                                    </span>
                                                    <span className="mt-1 block text-sm font-medium text-[#1f3fff]">{item.org}</span>
                                                    <span className="mt-0.5 block text-xs text-[#0a0a0a]/50 sm:hidden">{item.place}</span>
                                                </span>
                                                <span className="hidden text-sm text-[#0a0a0a]/60 sm:block">{item.place}</span>
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'grid size-10 place-items-center rounded-full border transition-all duration-300',
                                                        isOpen
                                                            ? 'rotate-45 border-[#1f3fff] bg-[#1f3fff] text-white'
                                                            : 'border-[#0a0a0a]/15 text-[#0a0a0a] group-hover:border-[#1f3fff] group-hover:text-[#1f3fff]',
                                                        reduceMotion && 'transition-none',
                                                    )}
                                                >
                                                    <HiPlus className="size-4" />
                                                </span>
                                            </button>
                                        </h3>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    id={panelId}
                                                    key="details"
                                                    role="region"
                                                    aria-labelledby={rowId}
                                                    initial={{ height: reduceMotion ? 'auto' : 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: reduceMotion ? 'auto' : 0, opacity: 0 }}
                                                    transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="grid gap-6 pb-7 pl-4 pr-2 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4 sm:pl-3">
                                                        <div className="order-2 sm:order-1">
                                                            <p className="text-4xl font-semibold tracking-tighter text-[#1f3fff]">
                                                                {item.metric[0]}
                                                            </p>
                                                            <p className="mt-1 text-xs leading-snug text-[#0a0a0a]/60">{item.metric[1]}</p>
                                                        </div>
                                                        <div className="order-1 sm:order-2">
                                                            <p className="text-base text-[#0a0a0a]/80">{item.summary}</p>
                                                            <ul className="mt-4 space-y-2">
                                                                {item.points.map((point) => (
                                                                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-[#0a0a0a]/75">
                                                                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-[#1f3fff]" />
                                                                        {point}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
                                                                {item.stack.map((s) => (
                                                                    <li
                                                                        key={s}
                                                                        className="rounded-full border border-[#0a0a0a]/12 px-2.5 py-1 font-mono text-[11px] text-[#0a0a0a]/70"
                                                                    >
                                                                        {s}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                )
                            })}
                        </motion.ol>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default WorkStudyTabsExperienceTimeline

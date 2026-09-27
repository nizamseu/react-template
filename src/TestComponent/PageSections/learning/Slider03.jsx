// LearningPathStepperSlider

// Slider03 · Learning Management Systems › Animated Slider

// Description:
// Stage-by-stage walkthrough of Pathwise's 24-week "Frontend Engineer" learning path,
// headed "Five stages from first line of code to first offer." A horizontal stepper
// (Foundations, JavaScript Core, React & State, Testing & Tooling, Capstone & Career)
// drives a content panel that slides in with the stage's weeks, lessons, modules, skills,
// portfolio project and photo. Use it on a programme or career-track landing page.

// Design:
// - White section, royal blue #1d4ed8 accent, ink #0f172a headings, slate #475569 body,
//   pale blue #eff4ff / #dbe3f4 chips, borders and connector track.
// - Stepper: grid-cols-5 of 44px round nodes (done = blue with a check, active = blue ring
//   + pulse, upcoming = slate outline) on a connector line; stage names and weeks appear
//   under the nodes from md.
// - Panel: rounded-[1.75rem] white card with a blue-tinted shadow; one column on mobile
//   (photo first, aspect-[16/10]), lg:grid-cols-[1.15fr_0.85fr] with the photo on the
//   right; modules as a numbered list with durations, skills as pill chips. Invisible,
//   image-free copies of every panel share its grid cell so the height never jumps.
// - Type: semibold sans heading text-[2rem] → sm:text-5xl → lg:text-[3.4rem]; stage title
//   text-3xl → sm:text-4xl; mono uppercase eyebrows, counters and durations.
// - Motion: the blue connector fill springs to the active node, a lighter segment fills
//   toward the next node with the 7 s autoplay timer, the panel slides in from the travel
//   direction (AnimatePresence mode="wait"), modules stagger in and the photo wipes open.

// What it does:
// - State: [index, direction], hover/focus/drag flags and a play/pause preference; a
//   framer-motion animate() fills a 0→1 progress value over 7 s and advances (wrapping
//   from Capstone back to Foundations). It resumes where it stopped and is cleaned up.
// - Stage nodes, prev/next buttons, ←/→/Home/End keys (anywhere in the carousel; the panel
//   itself is focusable) and dragging/swiping the panel (70 px or a flick) change the
//   stage; a click right after a drag is ignored.
// - Autoplay pauses on mouse hover, keyboard focus and while dragging, and is off for
//   prefers-reduced-motion users until they press Play; they never see the node pulse.
// - The active node has aria-current="step"; an sr-only live region announces "Stage 3 of
//   5: React & State" (polite only while autoplay is stopped). Links: #start-pathwise-path
//   and #preview-<stage-id>.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LearningPathStepperSlider from '@/TestComponent/PageSections/learning/Slider03';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <LearningPathStepperSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiCheck, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { LuFlag, LuRoute } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 7
const EASE = [0.22, 1, 0.36, 1]

const stages = [
    {
        id: 'foundations',
        name: 'Foundations',
        weeks: 'Weeks 1–4',
        span: '4 weeks',
        lessons: 18,
        hours: '~6 h/week',
        summary: 'Learn how the web really works: semantic markup, modern CSS layout and shipping a site you are proud to share.',
        modules: [
            { title: 'Semantic HTML & accessibility basics', time: '3h 10m' },
            { title: 'Modern CSS layout with flex and grid', time: '4h 40m' },
            { title: 'Responsive design & fluid type', time: '3h 25m' },
            { title: 'Git, the terminal & your first deploy', time: '2h 50m' },
        ],
        skills: ['HTML', 'CSS Grid', 'Accessibility', 'Git'],
        project: 'Personal portfolio site, live by day 21',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80',
        alt: 'Open laptop and a paper notebook on a tidy study desk',
    },
    {
        id: 'javascript-core',
        name: 'JavaScript Core',
        weeks: 'Weeks 5–9',
        span: '5 weeks',
        lessons: 24,
        hours: '~8 h/week',
        summary: 'Get fluent in the language itself: functions, the DOM, async code and the debugging habits that save whole afternoons.',
        modules: [
            { title: 'Values, functions & closures', time: '4h 05m' },
            { title: 'The DOM, events & forms', time: '3h 50m' },
            { title: 'Async JavaScript: promises & fetch', time: '4h 20m' },
            { title: 'Debugging with browser DevTools', time: '2h 15m' },
        ],
        skills: ['ES2024', 'DOM', 'Fetch API', 'DevTools'],
        project: 'Weather dashboard on a live public API',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=80',
        alt: 'Close-up of colourful code on a dark computer screen',
    },
    {
        id: 'react-state',
        name: 'React & State',
        weeks: 'Weeks 10–15',
        span: '6 weeks',
        lessons: 30,
        hours: '~8 h/week',
        summary: 'Build real interfaces with components and hooks, manage state that grows, and fetch data without the spinners of doom.',
        modules: [
            { title: 'Components, props & hooks', time: '5h 30m' },
            { title: 'Reducers, context & state design', time: '4h 45m' },
            { title: 'Data fetching, caching & loading UI', time: '4h 10m' },
            { title: 'Accessible forms & validation', time: '3h 20m' },
        ],
        skills: ['React 19', 'Hooks', 'TanStack Query', 'Forms'],
        project: 'Kanban board with drag-and-drop & offline sync',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
        alt: 'Code editor open on a computer monitor',
    },
    {
        id: 'testing-tooling',
        name: 'Testing & Tooling',
        weeks: 'Weeks 16–19',
        span: '4 weeks',
        lessons: 20,
        hours: '~7 h/week',
        summary: 'Write tests you trust, automate the boring parts and learn to review pull requests the way senior engineers do.',
        modules: [
            { title: 'Unit tests with Vitest', time: '3h 15m' },
            { title: 'Component tests with Testing Library', time: '3h 40m' },
            { title: 'End-to-end flows with Playwright', time: '3h 05m' },
            { title: 'CI pipelines & code review', time: '2h 30m' },
        ],
        skills: ['Vitest', 'Testing Library', 'Playwright', 'CI'],
        project: '90% test coverage + CI for your Kanban app',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
        alt: 'Team of developers working together on laptops around a table',
    },
    {
        id: 'capstone-career',
        name: 'Capstone & Career',
        weeks: 'Weeks 20–24',
        span: '5 weeks',
        lessons: 16,
        hours: '~10 h/week',
        summary: 'Ship a production app with a four-person squad, then turn it into a case study, a portfolio and interview confidence.',
        modules: [
            { title: 'Team capstone in two-week sprints', time: '12h 00m' },
            { title: 'Portfolio & case-study writing', time: '2h 40m' },
            { title: 'Mock technical interviews', time: '3h 00m' },
            { title: 'Offer negotiation workshop', time: '1h 30m' },
        ],
        skills: ['Teamwork', 'Scrum', 'Case studies', 'Interviews'],
        project: 'Production app shipped with a 4-person squad',
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80',
        alt: 'Colleagues high-fiving across a desk in a bright office',
    },
]

const total = stages.length
const pad = (n) => String(n).padStart(2, '0')

const panelVariants = {
    enter: (dir) => ({ x: dir < 0 ? -80 : 80, opacity: 0 }),
    center: {
        x: 0,
        opacity: 1,
        transition: { x: { type: 'spring', stiffness: 190, damping: 26 }, opacity: { duration: 0.35 } },
    },
    exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }),
}

const listGroup = {
    enter: {},
    center: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
    exit: {},
}

const itemRise = {
    enter: { y: 14, opacity: 0 },
    center: { y: 0, opacity: 1, transition: { duration: 0.45, ease: EASE } },
    exit: { opacity: 0 },
}

const photoWipe = {
    enter: { clipPath: 'inset(0% 0% 0% 100%)' },
    center: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.9, ease: EASE, delay: 0.1 } },
    exit: { opacity: 0 },
}

const PANEL = 'grid overflow-hidden rounded-[1.75rem] border border-[#dbe3f4] bg-white lg:min-h-[520px] lg:grid-cols-[1.15fr_0.85fr]'

// One stage panel body. `sizer` renders an image-free copy (p instead of h3) that only reserves height.
function StagePanel({ stage, index, sizer = false }) {
    const Title = sizer ? 'p' : 'h3'
    return (
        <>
            <div className="flex flex-col p-5 sm:p-8 lg:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#1d4ed8]">
                    Stage {pad(index + 1)} / {pad(total)} · {stage.weeks}
                </p>
                <Title className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#0f172a] sm:text-4xl">
                    {stage.name}
                </Title>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#475569]">
                    {stage.summary}
                </p>

                <dl className="mt-6 grid grid-cols-3 divide-x divide-[#dbe3f4] rounded-2xl border border-[#dbe3f4] bg-[#f8faff]">
                    {[
                        { label: 'Length', value: stage.span },
                        { label: 'Lessons', value: stage.lessons },
                        { label: 'Effort', value: stage.hours },
                    ].map((stat) => (
                        <div key={stat.label} className="px-3 py-3 sm:px-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#64748b]">
                                {stat.label}
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-[#0f172a] sm:text-base">
                                {stat.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <motion.ol variants={listGroup} className="mt-6 divide-y divide-[#e8edf7]">
                    {stage.modules.map((module, i) => (
                        <motion.li
                            key={module.title}
                            variants={itemRise}
                            className="flex items-center gap-3 py-3"
                        >
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eff4ff] font-mono text-[11px] font-semibold text-[#1d4ed8]">
                                {i + 1}
                            </span>
                            <span className="min-w-0 flex-1 text-sm font-medium text-[#0f172a]">
                                {module.title}
                            </span>
                            <span className="shrink-0 font-mono text-[11px] text-[#64748b]">
                                {module.time}
                            </span>
                        </motion.li>
                    ))}
                </motion.ol>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 lg:mt-auto lg:pt-6">
                    <ul className="flex flex-wrap gap-2" aria-label="Skills you will practise">
                        {stage.skills.map((skill) => (
                            <li
                                key={skill}
                                className="rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-semibold text-[#1d4ed8]"
                            >
                                {skill}
                            </li>
                        ))}
                    </ul>
                    <a
                        href={`#preview-${stage.id}`}
                        draggable={false}
                        className="group/link inline-flex min-h-10 items-center gap-1.5 rounded-full text-sm font-semibold text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4ed8]"
                    >
                        <span className="border-b border-[#1d4ed8]/30 pb-0.5 group-hover/link:border-[#1d4ed8]">
                            Preview this stage
                        </span>
                        <HiArrowUpRight
                            className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>

            <div className="relative order-first p-3 lg:order-none lg:pl-0">
                <motion.div
                    variants={photoWipe}
                    className="relative aspect-[16/10] h-full w-full overflow-hidden rounded-[1.25rem] bg-[#eff4ff] lg:aspect-auto"
                >
                    {!sizer && (
                        <img
                            src={stage.image}
                            alt={stage.alt}
                            loading="lazy"
                            draggable={false}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    )}
                    <div
                        className="absolute inset-0 bg-linear-to-t from-[#0f172a]/55 via-transparent to-transparent"
                        aria-hidden="true"
                    />
                    <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-[0_12px_30px_-12px_rgba(15,23,42,0.45)] sm:inset-x-4 sm:bottom-4 sm:p-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1d4ed8] text-white">
                            <LuFlag className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 leading-tight">
                            <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#64748b]">
                                Portfolio project
                            </span>
                            <span className="mt-1 block text-sm font-semibold text-[#0f172a]">
                                {stage.project}
                            </span>
                        </span>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export function LearningPathStepperSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [[index, direction], setPage] = useState([0, 0])
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const stageRef = useRef(null)
    const dragMoved = useRef(false)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const stage = stages[index]

    const paginate = useCallback(
        (dir) => {
            progress.jump(0)
            setPage(([current]) => [(current + dir + total) % total, dir])
        },
        [progress],
    )

    const goTo = (target) => {
        if (target === index) return
        progress.jump(0)
        setPage([target, target > index ? 1 : -1])
    }

    useEffect(() => {
        setHydrated(true)
    }, [])

    // Autoplay: fill the next connector segment 0 → 1, then advance; resumes where it stopped.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        const isMove = event.key in moves
        if (!isMove && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        // Keep focus inside the carousel when the focused link belongs to the leaving panel.
        const stageEl = stageRef.current
        if (stageEl && stageEl !== event.target && stageEl.contains(event.target)) {
            stageEl.focus({ preventScroll: true })
        }
        if (isMove) paginate(moves[event.key])
        else goTo(event.key === 'Home' ? 0 : total - 1)
    }

    const handleFocus = (event) => {
        let visible = true
        try {
            visible = event.target.matches(':focus-visible')
        } catch {
            visible = true
        }
        if (visible) setFocused(true)
    }

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
    }

    const handleDragEnd = (_, info) => {
        setDragging(false)
        const { offset, velocity } = info
        if (offset.x < -70 || velocity.x < -550) paginate(1)
        else if (offset.x > 70 || velocity.x > 550) paginate(-1)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#475569] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-[#1d4ed8]">
                                <LuRoute className="h-4 w-4" aria-hidden="true" />
                                Pathwise · Frontend Engineer path
                            </p>
                            <h2 className="mt-4 text-[2rem] font-semibold leading-[1.04] tracking-[-0.035em] text-[#0f172a] sm:text-5xl lg:text-[3.4rem]">
                                Five stages from first line of code to{' '}
                                <span className="text-[#1d4ed8]">first offer.</span>
                            </h2>
                        </div>
                        <div className="flex flex-col gap-4 lg:items-end">
                            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#475569]">
                                24 weeks · 108 lessons · 3 portfolio projects
                            </p>
                            <a
                                href="#start-pathwise-path"
                                className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-[#1d4ed8] py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4ed8] lg:self-end"
                            >
                                Start the path, 7 days free
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                                    <HiArrowLongRight className="h-4 w-4" aria-hidden="true" />
                                </span>
                            </a>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Frontend Engineer path stages"
                        className="mt-12 md:mt-14"
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onPointerEnter={(event) => {
                            if (event.pointerType === 'mouse') setHovered(true)
                        }}
                        onPointerLeave={(event) => {
                            if (event.pointerType === 'mouse') setHovered(false)
                        }}
                    >
                        <p className="sr-only" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
                            {`Stage ${index + 1} of ${total}: ${stage.name}, ${stage.weeks}`}
                        </p>

                        <div className="relative">
                            <div
                                className="absolute left-[10%] right-[10%] top-[22px] h-1 -translate-y-1/2 rounded-full bg-[#dbe3f4]"
                                aria-hidden="true"
                            >
                                {index < total - 1 && (
                                    <motion.div
                                        className="absolute inset-y-0 origin-left rounded-full bg-[#93b4ff]"
                                        style={{
                                            left: `${(index / (total - 1)) * 100}%`,
                                            width: `${100 / (total - 1)}%`,
                                            scaleX: progress,
                                        }}
                                    />
                                )}
                                <motion.div
                                    className="absolute inset-0 origin-left rounded-full bg-[#1d4ed8]"
                                    initial={false}
                                    animate={{ scaleX: index / (total - 1) }}
                                    transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                                />
                            </div>

                            <ol className="relative grid grid-cols-5" aria-label="Path stages">
                                {stages.map((item, i) => {
                                    const done = i < index
                                    const active = i === index
                                    return (
                                        <li key={item.id} className="flex justify-center">
                                            <button
                                                type="button"
                                                aria-label={`Stage ${i + 1}: ${item.name}, ${item.weeks}${done ? ', completed' : ''}`}
                                                aria-current={active ? 'step' : undefined}
                                                onClick={() => goTo(i)}
                                                className="group flex flex-col items-center rounded-2xl text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4ed8]"
                                            >
                                                <span className="relative grid h-11 w-11 place-items-center">
                                                    {active && !reduce && (
                                                        <motion.span
                                                            className="absolute inset-0 rounded-full border-2 border-[#1d4ed8]"
                                                            initial={{ scale: 1, opacity: 0.55 }}
                                                            animate={{ scale: 1.55, opacity: 0 }}
                                                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    <span
                                                        className={cn(
                                                            'relative grid h-11 w-11 place-items-center rounded-full border-2 font-mono text-sm font-semibold transition-colors duration-300',
                                                            done && 'border-[#1d4ed8] bg-[#1d4ed8] text-white',
                                                            active && 'border-[#1d4ed8] bg-white text-[#1d4ed8] shadow-[0_0_0_6px_rgba(29,78,216,0.12)]',
                                                            !done && !active && 'border-[#cbd5e1] bg-white text-[#64748b] group-hover:border-[#1d4ed8]/60',
                                                        )}
                                                    >
                                                        {done ? <HiCheck className="h-5 w-5" aria-hidden="true" /> : pad(i + 1)}
                                                    </span>
                                                </span>
                                                <span className="mt-3 hidden max-w-[10rem] flex-col px-1 md:flex">
                                                    <span
                                                        className={cn(
                                                            'text-sm font-semibold leading-tight transition-colors',
                                                            active ? 'text-[#1d4ed8]' : 'text-[#0f172a]',
                                                        )}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#64748b]">
                                                        {item.weeks}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ol>
                        </div>

                        <motion.div
                            ref={stageRef}
                            role="group"
                            tabIndex={0}
                            aria-label="Stage details, use the left and right arrow keys to browse"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            className="mt-8 grid cursor-grab select-none rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4ed8] active:cursor-grabbing md:mt-10"
                            onPointerDownCapture={() => {
                                dragMoved.current = false
                            }}
                            onClickCapture={(event) => {
                                if (dragMoved.current) {
                                    event.preventDefault()
                                    event.stopPropagation()
                                }
                            }}
                            onDragStart={() => {
                                dragMoved.current = true
                                setDragging(true)
                            }}
                            onDragEnd={handleDragEnd}
                        >
                            {stages.map((item, i) => (
                                <div key={item.id} aria-hidden="true" inert className={cn(PANEL, 'invisible [grid-area:1/1]')}>
                                    <StagePanel stage={item} index={i} sizer />
                                </div>
                            ))}
                            <AnimatePresence mode="wait" initial={false} custom={direction}>
                                <motion.article
                                    key={stage.id}
                                    custom={direction}
                                    variants={panelVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    aria-roledescription="slide"
                                    aria-label={`${index + 1} of ${total}: ${stage.name}`}
                                    className={cn(PANEL, 'shadow-[0_30px_70px_-45px_rgba(29,78,216,0.55)] [grid-area:1/1]')}
                                >
                                    <StagePanel stage={stage} index={index} />
                                </motion.article>
                            </AnimatePresence>
                        </motion.div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#64748b]" aria-hidden="true">
                                Stage <span className="text-[#1d4ed8]">{pad(index + 1)}</span> of {pad(total)}
                                <span className="hidden sm:inline"> · drag, swipe or use ← →</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    aria-pressed={!autoplayOn}
                                    onClick={() => setPlayPref(!autoplayOn)}
                                    className="grid h-11 w-11 place-items-center rounded-full text-[#0f172a] transition-colors hover:bg-[#eff4ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                >
                                    {autoplayOn ? (
                                        <HiMiniPause className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <HiMiniPlay className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous stage"
                                    onClick={() => paginate(-1)}
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#cbd5e1] text-[#0f172a] transition-colors hover:border-[#1d4ed8] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                >
                                    <HiArrowLongLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next stage"
                                    onClick={() => paginate(1)}
                                    className="grid h-11 w-11 place-items-center rounded-full bg-[#1d4ed8] text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                                >
                                    <HiArrowLongRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default LearningPathStepperSlider

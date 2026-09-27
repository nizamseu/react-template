// CourseSpotlightSlider

// Slider01 · Learning Management Systems › Animated Slider

// Description:
// Full-width course spotlight carousel for Orbit Learning under the heading "Courses
// worth clearing your calendar for." Four courses (UX Research Methods, Data Storytelling
// with Python, The Short Story Writing Studio, Production React & TypeScript) each get a
// photo in an arched window, the instructor, level + duration + lesson chips, the next
// start date, the price and an "Enrol now" CTA. Use it on a course marketplace home or
// term launch page.

// Design:
// - Deep plum #2b124c section, #371a5c stage card, peach #ffb4a2 accent (progress bar,
//   chips, CTA, planet disc) and blush #fbeee9 text; dark plum #1e0b38 text on peach.
// - Stage: stacked on mobile (arched photo on top, aspect-[5/4] → sm:aspect-[16/10]), two
//   columns on lg (content 1.08fr / photo 0.92fr) at a fixed lg:h-[560px], rounded-[2rem];
//   a giant outlined slide number sits behind the copy from lg. Invisible, image-free copies
//   of every slide share the grid cell so the stage keeps the tallest slide's height.
// - Type: semibold sans title text-[1.85rem] → sm:text-4xl → lg:text-[3.1rem] with tight
//   tracking; mono uppercase eyebrows, counter and chips; pill buttons, 44px round controls.
// - Motion: direction-aware slide + fade of the copy with a staggered rise, clip-path
//   circle reveal and slow zoom on the photo, peach progress bar at the top of the stage,
//   spring "planet" thumbnails; MotionConfig reducedMotion="user" drops transforms.
// - Below the stage: an orbit track of round course thumbnails (names from sm), then the
//   counter, pause/play and prev/next buttons; the row wraps on narrow screens.

// What it does:
// - State: [index, direction], hover/focus/drag flags and a play/pause preference. A
//   framer-motion animate() drives a 0→1 progress value over 6 s and advances on complete;
//   it resumes from where it stopped and is cleaned up on unmount.
// - Autoplay pauses on mouse hover, keyboard focus and while dragging; it is off for
//   prefers-reduced-motion users until they press Play. Drag/swipe the stage (70 px or a
//   flick), ←/→/Home/End keys, prev/next buttons and the thumbnails all change slides.
// - The active thumbnail has aria-current and an sr-only live region announces "Course 2
//   of 4: …" (polite only while autoplay is stopped). A click right after a drag is ignored.
// - CTAs link to #enrol-<course-id>, "View syllabus" to #syllabus-<course-id> and "Browse
//   all 120 courses" to #all-courses.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CourseSpotlightSlider from '@/TestComponent/PageSections/learning/Slider01';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <CourseSpotlightSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniPause, HiMiniPlay, HiStar } from 'react-icons/hi2';
import { LuBookOpen, LuClock3, LuOrbit, LuSignal } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6
const EASE = [0.22, 1, 0.36, 1]

const courses = [
    {
        id: 'ux-research-methods',
        short: 'UX Research',
        track: 'Design · Live cohort',
        title: 'UX Research Methods, End to End',
        blurb: 'Plan interviews, run five-second tests and turn messy notes into insight decks your product team will actually read.',
        level: 'Intermediate',
        duration: '6 weeks',
        lessons: '24 lessons',
        rating: '4.9',
        reviews: '1,284',
        price: '$249',
        cohort: 'Starts Oct 12',
        instructor: 'Hana Lindqvist',
        role: 'Lead Researcher, ex-Northstar Health',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
        alt: 'Team arranging sticky notes on a glass wall during a research synthesis session',
    },
    {
        id: 'data-storytelling-python',
        short: 'Data Stories',
        track: 'Data · Self-paced + clinics',
        title: 'Data Storytelling with Python',
        blurb: 'Go from a raw CSV to a clear chart narrative with pandas and Plotly, then present it to people who never open notebooks.',
        level: 'Beginner',
        duration: '8 weeks',
        lessons: '32 lessons',
        rating: '4.8',
        reviews: '2,016',
        price: '$199',
        cohort: 'Starts Oct 19',
        instructor: 'Marcus Ellery',
        role: 'Data Journalist, The Ledger Review',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
        alt: 'Laptop screen showing colourful analytics charts and graphs',
    },
    {
        id: 'short-story-studio',
        short: 'Short Story',
        track: 'Writing · Small-group studio',
        title: 'The Short Story Writing Studio',
        blurb: 'Draft, workshop and polish one 4,000-word story with weekly line edits and a live reading on the final night.',
        level: 'All levels',
        duration: '5 weeks',
        lessons: '15 lessons',
        rating: '5.0',
        reviews: '438',
        price: '$179',
        cohort: 'Starts Nov 2',
        instructor: 'Elena Duarte',
        role: 'Novelist & fiction editor',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
        alt: 'Hand writing in a paper notebook next to a cup of coffee',
    },
    {
        id: 'production-react',
        short: 'React & TS',
        track: 'Engineering · Live cohort',
        title: 'Production React & TypeScript',
        blurb: 'Ship a real dashboard with typed data fetching, accessible components, tests and a CI pipeline reviewed line by line.',
        level: 'Advanced',
        duration: '10 weeks',
        lessons: '40 lessons',
        rating: '4.9',
        reviews: '967',
        price: '$329',
        cohort: 'Starts Nov 9',
        instructor: 'Tomás Reyes',
        role: 'Staff Engineer, Lattice Systems',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
        alt: 'Laptop showing code in an editor on a desk beside a small plant',
    },
]

const total = courses.length
const pad = (n) => String(n).padStart(2, '0')

const slideVariants = {
    enter: (dir) => ({ x: dir < 0 ? -56 : 56, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { x: { type: 'spring', stiffness: 170, damping: 26 }, opacity: { duration: 0.4 } } },
    exit: (dir) => ({ x: dir < 0 ? 56 : -56, opacity: 0, transition: { duration: 0.35, ease: EASE } }),
}

const copyGroup = {
    enter: {},
    center: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
    exit: {},
}

const rise = {
    enter: { y: 22, opacity: 0 },
    center: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
}

const photoReveal = {
    enter: { clipPath: 'circle(0% at 50% 60%)' },
    center: { clipPath: 'circle(120% at 50% 60%)', transition: { duration: 1, ease: EASE } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
}

// One slide body. `sizer` renders an image-free copy (p instead of h3) that only reserves height.
function CourseSlide({ course, index, sizer = false }) {
    const Title = sizer ? 'p' : motion.h3
    return (
        <>
            <span
                className="pointer-events-none absolute right-6 top-8 hidden font-mono text-[10rem] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,180,162,0.22)] lg:left-[44%] lg:right-auto lg:block"
                aria-hidden="true"
            >
                {pad(index + 1)}
            </span>

            <motion.div
                variants={copyGroup}
                className="relative flex flex-col p-5 pt-6 sm:p-8 lg:p-12 lg:pt-14"
            >
                <motion.p
                    variants={rise}
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ffb4a2] sm:text-[11px]"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffb4a2]" aria-hidden="true" />
                    {course.track}
                </motion.p>
                <Title
                    variants={sizer ? undefined : rise}
                    className="mt-3 max-w-xl text-[1.85rem] font-semibold leading-[1.04] tracking-[-0.03em] text-[#fbeee9] sm:mt-4 sm:text-4xl lg:text-[3.1rem]"
                >
                    {course.title}
                </Title>
                <motion.p
                    variants={rise}
                    className="mt-3 max-w-md text-[15px] leading-relaxed text-[#fbeee9]/70 sm:mt-4"
                >
                    {course.blurb}
                </motion.p>

                <motion.ul variants={rise} className="mt-5 flex flex-wrap gap-2" aria-label="Course details">
                    {[
                        { icon: LuSignal, text: course.level },
                        { icon: LuClock3, text: course.duration },
                        { icon: LuBookOpen, text: course.lessons },
                    ].map(({ icon: Icon, text }) => (
                        <li
                            key={text}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#ffb4a2]/35 bg-[#ffb4a2]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ffd9cf]"
                        >
                            <Icon className="h-3.5 w-3.5 text-[#ffb4a2]" aria-hidden="true" />
                            {text}
                        </li>
                    ))}
                </motion.ul>

                <motion.div variants={rise} className="mt-6 flex items-center gap-3">
                    {sizer ? (
                        <span className="h-11 w-11 shrink-0" />
                    ) : (
                        <img
                            src={course.avatar}
                            alt=""
                            draggable={false}
                            loading="lazy"
                            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#ffb4a2] ring-offset-2 ring-offset-[#371a5c]"
                        />
                    )}
                    <div className="min-w-0 leading-tight">
                        <p className="text-sm font-semibold text-[#fbeee9]">{course.instructor}</p>
                        <p className="mt-0.5 truncate text-xs text-[#fbeee9]/60">{course.role}</p>
                    </div>
                </motion.div>

                <motion.div
                    variants={rise}
                    className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5 lg:mt-auto"
                >
                    <p className="leading-none">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#fbeee9]/55">
                            {course.cohort}
                        </span>
                        <span className="mt-1.5 block text-2xl font-semibold tracking-tight text-[#fbeee9]">
                            {course.price}
                        </span>
                    </p>
                    <a
                        href={`#enrol-${course.id}`}
                        draggable={false}
                        className="group/cta inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ffb4a2] py-2 pl-5 pr-2 text-sm font-semibold text-[#1e0b38] transition-colors hover:bg-[#ffc9bb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb4a2]"
                    >
                        Enrol now
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1e0b38] text-[#ffb4a2] transition-transform duration-300 group-hover/cta:rotate-45">
                            <HiArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                    </a>
                    <a
                        href={`#syllabus-${course.id}`}
                        draggable={false}
                        className="inline-flex min-h-10 items-center rounded-full text-sm font-medium text-[#fbeee9]/75 underline decoration-[#ffb4a2]/50 underline-offset-4 hover:text-[#fbeee9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb4a2]"
                    >
                        View syllabus
                    </a>
                </motion.div>
            </motion.div>

            <div className="relative order-first px-4 pt-6 sm:px-8 sm:pt-8 lg:order-none lg:h-full lg:px-10 lg:pb-10 lg:pt-14">
                <div className="relative aspect-[5/4] sm:aspect-[16/10] lg:aspect-auto lg:h-full">
                    <div
                        className="absolute -right-3 -top-3 aspect-square w-[42%] rounded-full bg-[#ffb4a2] sm:w-[32%] lg:-right-4 lg:-top-6 lg:w-[58%]"
                        aria-hidden="true"
                    >
                        <span className="absolute left-1/2 top-1/2 h-[42%] w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border border-[#ffb4a2]/60" />
                    </div>
                    <motion.div
                        variants={photoReveal}
                        className="relative h-full w-full overflow-hidden rounded-b-[1.25rem] rounded-t-[7rem] bg-[#4a2675] sm:rounded-t-[10rem] lg:rounded-t-[999px]"
                    >
                        {!sizer && (
                            <motion.img
                                src={course.image}
                                alt={course.alt}
                                draggable={false}
                                initial={{ scale: 1.12 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 6, ease: 'easeOut' }}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        )}
                        <div
                            className="absolute inset-0 bg-linear-to-t from-[#2b124c]/70 via-transparent to-transparent"
                            aria-hidden="true"
                        />
                    </motion.div>
                    <p className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#fbeee9] px-3 py-1.5 text-xs font-semibold text-[#1e0b38] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] sm:bottom-4 sm:left-4">
                        <HiStar className="h-3.5 w-3.5 text-[#e36b50]" aria-hidden="true" />
                        {course.rating}
                        <span className="font-normal text-[#1e0b38]/60">· {course.reviews} reviews</span>
                    </p>
                </div>
            </div>
        </>
    )
}

export function CourseSpotlightSlider({
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
    const course = courses[index]

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

    // Autoplay: fill the progress bar 0 → 1, then advance; resumes from the current value.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    // Warm the cache for the next course photo.
    useEffect(() => {
        const preload = new window.Image()
        preload.src = courses[(index + 1) % total].image
    }, [index])

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        const isMove = event.key in moves
        if (!isMove && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        // Keep focus inside the carousel when the focused link belongs to the leaving slide.
        const stage = stageRef.current
        if (stage && stage !== event.target && stage.contains(event.target)) {
            stage.focus({ preventScroll: true })
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
                'relative overflow-hidden bg-[#2b124c] px-4 py-14 text-base font-normal text-[#fbeee9] sm:px-6 md:py-20 lg:px-10',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div
                    className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#ffb4a2]/10 blur-3xl"
                    aria-hidden="true"
                />
                <div className="relative mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-[#ffb4a2]">
                                <LuOrbit className="h-4 w-4" aria-hidden="true" />
                                Orbit Learning · Autumn term 2026
                            </p>
                            <h2 className="mt-4 text-[2rem] font-semibold leading-[1.02] tracking-[-0.035em] text-[#fbeee9] sm:text-5xl lg:text-6xl">
                                Courses worth clearing your{' '}
                                <span className="text-[#ffb4a2]">calendar</span> for.
                            </h2>
                        </div>
                        <a
                            href="#all-courses"
                            className="group inline-flex min-h-10 items-center gap-2 self-start rounded-full text-sm font-medium text-[#fbeee9]/80 transition-colors hover:text-[#fbeee9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb4a2] md:self-end"
                        >
                            <span className="border-b border-[#ffb4a2]/60 pb-0.5">Browse all 120 courses</span>
                            <HiArrowLongRight
                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </a>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Orbit Learning course spotlight"
                        className="mt-10 md:mt-12"
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
                            {`Course ${index + 1} of ${total}: ${course.title}`}
                        </p>

                        <div
                            ref={stageRef}
                            role="group"
                            tabIndex={0}
                            aria-label="Featured courses, use the left and right arrow keys to browse"
                            className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#371a5c] ring-1 ring-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb4a2] lg:rounded-[2rem]"
                        >
                            <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/10" aria-hidden="true">
                                <motion.div
                                    className="h-full origin-left bg-[#ffb4a2]"
                                    style={{ scaleX: progress }}
                                />
                            </div>

                            <motion.div
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.22}
                                className="grid cursor-grab select-none active:cursor-grabbing lg:h-[560px]"
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
                                {courses.map((item, i) => (
                                    <div
                                        key={item.id}
                                        aria-hidden="true"
                                        inert
                                        className="invisible relative grid [grid-area:1/1] lg:h-full lg:grid-cols-[1.08fr_0.92fr]"
                                    >
                                        <CourseSlide course={item} index={i} sizer />
                                    </div>
                                ))}
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.article
                                        key={course.id}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        aria-roledescription="slide"
                                        aria-label={`${index + 1} of ${total}: ${course.title}`}
                                        className="relative grid [grid-area:1/1] lg:h-full lg:grid-cols-[1.08fr_0.92fr]"
                                    >
                                        <CourseSlide course={course} index={index} />
                                    </motion.article>
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
                            <div className="relative flex min-w-0 flex-1 items-center">
                                <span className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-[#ffb4a2]/25 sm:top-6" aria-hidden="true" />
                                <ol className="relative flex w-full max-w-2xl items-center justify-between gap-2">
                                    {courses.map((item, i) => {
                                        const active = i === index
                                        return (
                                            <li key={item.id}>
                                                <button
                                                    type="button"
                                                    aria-label={`Show course ${i + 1}: ${item.title}`}
                                                    aria-current={active ? 'true' : undefined}
                                                    onClick={() => goTo(i)}
                                                    className="group flex flex-col items-center gap-2 rounded-2xl p-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb4a2]"
                                                >
                                                    <motion.span
                                                        animate={{ scale: active ? 1.1 : 0.9 }}
                                                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                                                        className={cn(
                                                            'block h-11 w-11 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-[#2b124c] transition-[box-shadow,opacity]',
                                                            active ? 'ring-[#ffb4a2]' : 'ring-transparent opacity-55 group-hover:opacity-90',
                                                        )}
                                                    >
                                                        <img
                                                            src={item.thumb}
                                                            alt=""
                                                            loading="lazy"
                                                            draggable={false}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </motion.span>
                                                    <span
                                                        className={cn(
                                                            'hidden font-mono text-[10px] uppercase tracking-[0.16em] transition-colors sm:block',
                                                            active ? 'text-[#ffb4a2]' : 'text-[#fbeee9]/50',
                                                        )}
                                                    >
                                                        {item.short}
                                                    </span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ol>
                            </div>

                            <div className="flex items-center gap-2">
                                <p className="mr-2 font-mono text-sm tabular-nums text-[#fbeee9]/70" aria-hidden="true">
                                    <span className="text-[#fbeee9]">{pad(index + 1)}</span> / {pad(total)}
                                </p>
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    aria-pressed={!autoplayOn}
                                    onClick={() => setPlayPref(!autoplayOn)}
                                    className="grid h-11 w-11 place-items-center rounded-full text-[#fbeee9]/80 transition-colors hover:bg-white/10 hover:text-[#fbeee9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb4a2]"
                                >
                                    {autoplayOn ? (
                                        <HiMiniPause className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <HiMiniPlay className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous course"
                                    onClick={() => paginate(-1)}
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#ffb4a2]/40 text-[#fbeee9] transition-colors hover:border-[#ffb4a2] hover:bg-[#ffb4a2] hover:text-[#1e0b38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb4a2]"
                                >
                                    <HiArrowLongLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next course"
                                    onClick={() => paginate(1)}
                                    className="grid h-11 w-11 place-items-center rounded-full bg-[#ffb4a2] text-[#1e0b38] transition-colors hover:bg-[#ffc9bb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb4a2]"
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

export default CourseSpotlightSlider

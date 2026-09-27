// TestimonialDeckSlider

// Slider02 · Learning Management Systems › Animated Slider

// Description:
// A throwable deck of mentee testimonials for the mentorship platform Mentora, under the
// serif heading "Mentees don’t just finish. They leap." Six story cards (e.g. "Barista →
// Junior UX Designer", "Analyst → Data Scientist") show a quote, the career move, the
// programme, mentor and session count and an outcome chip; a 4.9 rating block and two
// stats sit beside the deck (above it on mobile). Use it on a mentoring or course landing
// page as social proof.

// Design:
// - Off-white #f6f3ec section, forest #1f4d3a headings/controls, ink #1b2a22 body; cards
//   rotate through four themes: forest (#1f4d3a + leaf #b9d8a6), cream #fffdf7, sage
//   #d9e5d3 and sand #eee2c9, rounded-[1.75rem] with a soft green shadow.
// - Stack: the top card plus two cards peeking 16 px lower, scaled 0.945 / 0.89 and tilted
//   3.5° / -3°; deck height h-[500px] → sm:h-[460px], max-w-[30rem].
// - Type: serif heading text-[2.35rem] → sm:text-5xl → lg:text-[3.6rem] with an italic
//   line, serif quotes text-[1.15rem] → sm:text-[1.3rem], mono uppercase eyebrows/labels.
// - Layout: single column on mobile (intro, deck, controls); from lg two columns with the
//   intro + controls on the left and the deck on the right. The outcome chip on each card
//   shows from 400px wide.
// - Motion: the top card follows the pointer with a drag-linked tilt and is thrown off in
//   the drag direction; cards spring up the stack; "previous" flies a card back in from
//   the left; a ring around pause/play shows the 7 s autoplay timer.

// What it does:
// - State: [index, direction, throw side], hover/focus/drag flags and a play/pause
//   preference; a framer-motion animate() fills a 0→1 progress value over 7 s, then the top
//   card is thrown left. It resumes where it stopped and is cleaned up on unmount.
// - Dragging the top card past 110 px (or flicking it) throws it left or right and reveals
//   the next story; shorter drags spring back. Next/→ throw it left, Previous/← bring the
//   last card back, Home/End jump to the first/last, dots jump to any story.
// - Autoplay pauses on mouse hover, keyboard focus and while dragging and is off for
//   prefers-reduced-motion users until they press Play. Cards under the top one are inert.
// - Active dot has aria-current; an sr-only live region announces "Story 2 of 6: …"
//   (polite only while autoplay is stopped). "Find your mentor" links to #find-a-mentor.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TestimonialDeckSlider from '@/TestComponent/PageSections/learning/Slider02';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <TestimonialDeckSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniPause, HiMiniPlay, HiStar } from 'react-icons/hi2';
import { LuArrowRight, LuMoveHorizontal, LuQuote, LuSprout } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 7
const THROW_DISTANCE = 110
const STACK = 3
const PEEK = 16
const EASE = [0.22, 1, 0.36, 1]
const TILT = [0, 3.5, -3]

const stories = [
    {
        id: 'amara',
        name: 'Amara Okafor',
        before: 'Associate PM',
        after: 'Product Manager, Fernway',
        program: 'Product',
        sessions: 12,
        mentor: 'Dana Whitfield',
        outcome: 'Promoted in 4 months',
        quote: 'My mentor rewrote exactly zero of my docs. She asked sharper questions until I could. Four months later I was leading the checkout squad.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        theme: 'forest',
    },
    {
        id: 'daniel',
        name: 'Daniel Kovač',
        before: 'Bootcamp grad',
        after: 'Frontend Engineer, Tidewell',
        program: 'Engineering',
        sessions: 6,
        mentor: 'Ravi Menon',
        outcome: '3 offers in 5 weeks',
        quote: 'Sixty applications, zero callbacks. Six sessions on how to tell the story behind my projects and I had three offers on the table.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        theme: 'cream',
    },
    {
        id: 'saoirse',
        name: 'Saoirse Byrne',
        before: 'Barista',
        after: 'Junior UX Designer',
        program: 'Design',
        sessions: 10,
        mentor: 'Lotte Brandt',
        outcome: 'First design role',
        quote: 'Having someone from the industry tear through my portfolio every fortnight changed everything. Blunt, kind and always right.',
        avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80',
        theme: 'sage',
    },
    {
        id: 'jonah',
        name: 'Jonah Whitaker',
        before: 'Analyst',
        after: 'Data Scientist, Kestrel Bank',
        program: 'Data',
        sessions: 11,
        mentor: 'Imogen Hart',
        outcome: '+28% salary',
        quote: 'We spent one session on SQL and nine on explaining a model to a sceptical VP. That second part is what got me the new title.',
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80',
        theme: 'sand',
    },
    {
        id: 'mei-lin',
        name: 'Mei-Lin Zhou',
        before: 'Teacher',
        after: 'Learning Designer, Brightwell',
        program: 'Career switch',
        sessions: 14,
        mentor: 'Carla Jensen',
        outcome: 'Switched careers at 38',
        quote: 'I thought changing careers at 38 was a fantasy. My mentor had made the same move and handed me the map she wished she had had.',
        avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=400&q=80',
        theme: 'forest',
    },
    {
        id: 'rafael',
        name: 'Rafael Moreno',
        before: 'Freelancer',
        after: 'Design Lead, Quarry Studio',
        program: 'Leadership',
        sessions: 8,
        mentor: 'Owen Blake',
        outcome: 'Lead role, +40% rate',
        quote: 'The negotiation practice alone paid for the programme ten times over. I walked into the final interview knowing my number.',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80',
        theme: 'cream',
    },
]

const themes = {
    forest: {
        card: 'bg-[#1f4d3a] text-[#f3efe3]',
        muted: 'text-[#f3efe3]/65',
        badge: 'bg-[#f3efe3]/10 text-[#b9d8a6]',
        chip: 'bg-[#b9d8a6] text-[#12301f]',
        pill: 'border-[#f3efe3]/25 text-[#f3efe3]/85',
        rule: 'border-[#f3efe3]/15',
        ring: 'ring-[#b9d8a6]',
    },
    cream: {
        card: 'bg-[#fffdf7] text-[#1b2a22] ring-1 ring-[#1f4d3a]/10',
        muted: 'text-[#1b2a22]/60',
        badge: 'bg-[#1f4d3a] text-[#f3efe3]',
        chip: 'bg-[#1f4d3a] text-[#f3efe3]',
        pill: 'border-[#1f4d3a]/20 text-[#1b2a22]/80',
        rule: 'border-[#1f4d3a]/10',
        ring: 'ring-[#1f4d3a]',
    },
    sage: {
        card: 'bg-[#d9e5d3] text-[#15291e]',
        muted: 'text-[#15291e]/60',
        badge: 'bg-[#1f4d3a] text-[#d9e5d3]',
        chip: 'bg-[#fffdf7] text-[#1f4d3a]',
        pill: 'border-[#1f4d3a]/25 text-[#15291e]/80',
        rule: 'border-[#1f4d3a]/15',
        ring: 'ring-[#1f4d3a]',
    },
    sand: {
        card: 'bg-[#eee2c9] text-[#2a2317]',
        muted: 'text-[#2a2317]/60',
        badge: 'bg-[#2a2317] text-[#eee2c9]',
        chip: 'bg-[#1f4d3a] text-[#f3efe3]',
        pill: 'border-[#2a2317]/20 text-[#2a2317]/80',
        rule: 'border-[#2a2317]/12',
        ring: 'ring-[#2a2317]',
    },
}

const total = stories.length
const pad = (n) => String(n).padStart(2, '0')

const stackTarget = (depth) => ({
    x: 0,
    y: depth * PEEK,
    rotate: TILT[depth],
    scale: 1 - depth * 0.055,
    opacity: 1,
    zIndex: 10 - depth,
    transition: { type: 'spring', stiffness: 260, damping: 28, zIndex: { duration: 0 } },
})

const enterTarget = (dir, depth) =>
    dir < 0 && depth === 0
        ? { x: '-115%', y: 0, rotate: -14, scale: 1, opacity: 0, zIndex: 30 }
        : { x: 0, y: STACK * PEEK, rotate: 0, scale: 0.84, opacity: 0, zIndex: 0 }

const cardVariants = {
    exit: ({ dir, side }) =>
        dir > 0
            ? {
                  x: `${side * 125}%`,
                  rotate: side * 18,
                  opacity: 0,
                  zIndex: 40,
                  transition: { duration: 0.55, ease: EASE, zIndex: { duration: 0 } },
              }
            : {
                  y: STACK * PEEK,
                  scale: 0.84,
                  opacity: 0,
                  zIndex: 0,
                  transition: { duration: 0.3, zIndex: { duration: 0 } },
              },
}

function DeckCard({ story, depth, dir, onThrow, onDragChange }) {
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-280, 0, 280], [-14, 0, 14])
    const isTop = depth === 0
    const theme = themes[story.theme]

    const handleDragEnd = (_, info) => {
        onDragChange(false)
        const { offset, velocity } = info
        const far = Math.abs(offset.x) > THROW_DISTANCE
        if (far || Math.abs(velocity.x) > 650) {
            onThrow(Math.sign(far ? offset.x : velocity.x) || -1)
        } else {
            animate(x, 0, { type: 'spring', stiffness: 380, damping: 30 })
        }
    }

    return (
        <motion.li
            variants={cardVariants}
            initial={enterTarget(dir, depth)}
            animate={stackTarget(depth)}
            exit="exit"
            aria-hidden={isTop ? undefined : true}
            inert={!isTop}
            className="absolute inset-x-0 bottom-10 top-0"
        >
            <motion.figure
                drag={isTop ? 'x' : false}
                dragMomentum={false}
                style={{ x, rotate }}
                onDragStart={() => onDragChange(true)}
                onDragEnd={handleDragEnd}
                className={cn(
                    'flex h-full select-none flex-col overflow-hidden rounded-[1.75rem] p-6 shadow-[0_30px_60px_-30px_rgba(31,77,58,0.55)] sm:p-8',
                    theme.card,
                    isTop && 'cursor-grab active:cursor-grabbing',
                )}
            >
                <div className="flex items-center justify-between gap-3">
                    <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full', theme.badge)}>
                        <LuQuote className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span
                        className={cn(
                            'truncate rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]',
                            theme.pill,
                        )}
                    >
                        {story.program} · {story.sessions} sessions
                    </span>
                </div>

                <blockquote className="mt-5 font-serif text-[1.15rem] leading-snug tracking-[-0.01em] sm:mt-6 sm:text-[1.3rem]">
                    <p>“{story.quote}”</p>
                </blockquote>

                <figcaption className="mt-auto pt-5">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
                        <span className={cn('line-through decoration-1', theme.muted)}>{story.before}</span>
                        <LuArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="sr-only">to</span>
                        <span>{story.after}</span>
                    </span>
                    <span className={cn('mt-4 flex items-center justify-between gap-3 border-t pt-4', theme.rule)}>
                        <span className="flex min-w-0 items-center gap-3">
                            <img
                                src={story.avatar}
                                alt=""
                                loading="lazy"
                                draggable={false}
                                className={cn('h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-offset-0', theme.ring)}
                            />
                            <span className="min-w-0 leading-tight">
                                <span className="block truncate text-sm font-semibold">{story.name}</span>
                                <span className={cn('mt-0.5 block truncate text-xs', theme.muted)}>
                                    Mentored by {story.mentor}
                                </span>
                            </span>
                        </span>
                        <span
                            className={cn(
                                'hidden shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold min-[400px]:inline-block',
                                theme.chip,
                            )}
                        >
                            {story.outcome}
                        </span>
                    </span>
                </figcaption>
            </motion.figure>
        </motion.li>
    )
}

export function TestimonialDeckSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [[index, direction, side], setDeck] = useState([0, 0, -1])
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const story = stories[index]

    const go = useCallback(
        (delta, throwSide = -1) => {
            progress.jump(0)
            setDeck(([current]) => [(current + delta + total) % total, delta > 0 ? 1 : -1, throwSide])
        },
        [progress],
    )

    const goTo = (target) => {
        if (target === index) return
        progress.jump(0)
        setDeck([target, target > index ? 1 : -1, -1])
    }

    useEffect(() => {
        setHydrated(true)
    }, [])

    // Autoplay: fill the ring 0 → 1, then throw the top card; resumes from the current value.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => go(1),
        })
        return () => controls.stop()
    }, [playing, index, go, progress])

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        const isMove = event.key in moves
        if (!isMove && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        if (isMove) go(moves[event.key])
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

    const visible = Array.from({ length: STACK }, (_, depth) => ({
        item: stories[(index + depth) % total],
        depth,
    }))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f6f3ec] px-4 py-16 text-base font-normal text-[#1b2a22] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Mentora mentee stories"
                    className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-12"
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
                        {`Story ${index + 1} of ${total}: ${story.name}, ${story.before} to ${story.after}`}
                    </p>

                    <div className="lg:col-start-1 lg:row-start-1">
                        <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-[#1f4d3a]">
                            <LuSprout className="h-4 w-4" aria-hidden="true" />
                            Mentora · Mentee stories
                        </p>
                        <h2 className="mt-5 font-serif text-[2.35rem] font-normal leading-[1.02] tracking-[-0.02em] text-[#1f4d3a] sm:text-5xl lg:text-[3.6rem]">
                            Mentees don’t just finish.{' '}
                            <em className="block italic text-[#1b2a22]">They leap.</em>
                        </h2>
                        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#1b2a22]/70">
                            Every Mentora pairing is one-to-one with a practitioner who has done the
                            job. These are notes mentees left after their final session.
                        </p>

                        <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-6 border-t border-[#1f4d3a]/15 pt-6">
                            <div>
                                <p className="flex items-baseline gap-3">
                                    <span className="font-serif text-5xl leading-none text-[#1f4d3a]">4.9</span>
                                    <span className="flex gap-0.5 text-[#1f4d3a]" aria-hidden="true">
                                        {[0, 1, 2, 3, 4].map((star) => (
                                            <HiStar key={star} className="h-4 w-4" />
                                        ))}
                                    </span>
                                </p>
                                <p className="mt-2 text-xs text-[#1b2a22]/60">
                                    <span className="sr-only">Rated 4.9 out of 5 </span>
                                    from 2,318 verified session reviews
                                </p>
                            </div>
                            <dl className="flex gap-8">
                                <div>
                                    <dt className="sr-only">Goal reached</dt>
                                    <dd className="font-serif text-3xl leading-none text-[#1b2a22]">86%</dd>
                                    <dd className="mt-2 max-w-[9rem] text-xs leading-snug text-[#1b2a22]/60">
                                        reach their goal within 6 months
                                    </dd>
                                </div>
                                <div>
                                    <dt className="sr-only">Average sessions</dt>
                                    <dd className="font-serif text-3xl leading-none text-[#1b2a22]">11</dd>
                                    <dd className="mt-2 max-w-[9rem] text-xs leading-snug text-[#1b2a22]/60">
                                        sessions on average before the leap
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
                        <ul
                            tabIndex={0}
                            aria-label="Story deck, drag the top card or use the left and right arrow keys"
                            className="relative mx-auto h-[500px] w-full max-w-[30rem] rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#1f4d3a] sm:h-[460px]"
                        >
                            <AnimatePresence initial={false} custom={{ dir: direction, side }}>
                                {visible.map(({ item, depth }) => (
                                    <DeckCard
                                        key={item.id}
                                        story={item}
                                        depth={depth}
                                        dir={direction}
                                        onDragChange={setDragging}
                                        onThrow={(throwSide) => go(1, throwSide)}
                                    />
                                ))}
                            </AnimatePresence>
                        </ul>
                        <p className="mt-2 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1b2a22]/50">
                            <LuMoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                            Drag the card away · or use ← →
                        </p>
                    </div>

                    <div className="flex flex-col gap-5 lg:col-start-1 lg:row-start-2 lg:self-end">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label="Previous story"
                                    onClick={() => go(-1)}
                                    className="grid h-12 w-12 place-items-center rounded-full border border-[#1f4d3a]/30 text-[#1f4d3a] transition-colors hover:border-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-[#f6f3ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3a]"
                                >
                                    <HiArrowLongLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next story"
                                    onClick={() => go(1)}
                                    className="grid h-12 w-12 place-items-center rounded-full bg-[#1f4d3a] text-[#f6f3ec] transition-colors hover:bg-[#173a2c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3a]"
                                >
                                    <HiArrowLongRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    aria-pressed={!autoplayOn}
                                    onClick={() => setPlayPref(!autoplayOn)}
                                    className="relative grid h-12 w-12 place-items-center rounded-full text-[#1f4d3a] transition-colors hover:bg-[#1f4d3a]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3a]"
                                >
                                    <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                                        <circle cx="24" cy="24" r="22" fill="none" stroke="#1f4d3a" strokeOpacity="0.15" strokeWidth="2" />
                                        <motion.circle
                                            cx="24"
                                            cy="24"
                                            r="22"
                                            fill="none"
                                            stroke="#1f4d3a"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            style={{ pathLength: progress }}
                                        />
                                    </svg>
                                    {autoplayOn ? (
                                        <HiMiniPause className="h-4 w-4" aria-hidden="true" />
                                    ) : (
                                        <HiMiniPlay className="h-4 w-4" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            <p className="font-mono text-sm tabular-nums text-[#1b2a22]/60" aria-hidden="true">
                                <span className="text-[#1f4d3a]">{pad(index + 1)}</span> / {pad(total)}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                            <ol className="flex items-center" aria-label="Choose a story">
                                {stories.map((item, i) => (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            aria-label={`Story ${i + 1}: ${item.name}`}
                                            aria-current={i === index ? 'true' : undefined}
                                            onClick={() => goTo(i)}
                                            className="group grid h-10 w-7 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#1f4d3a]"
                                        >
                                            <span
                                                className={cn(
                                                    'block h-2 rounded-full transition-all duration-300',
                                                    i === index
                                                        ? 'w-5 bg-[#1f4d3a]'
                                                        : 'w-2 bg-[#1f4d3a]/25 group-hover:bg-[#1f4d3a]/50',
                                                )}
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ol>
                            <a
                                href="#find-a-mentor"
                                className="group inline-flex min-h-10 items-center gap-2 rounded-full text-sm font-semibold text-[#1f4d3a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f4d3a]"
                            >
                                <span className="border-b border-[#1f4d3a]/40 pb-0.5 group-hover:border-[#1f4d3a]">
                                    Find your mentor
                                </span>
                                <HiArrowUpRight
                                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default TestimonialDeckSlider

// MemberSpotlightSlider

// Slider03 · Social Networks & Communities › Animated Slider

// Description:
// Guildhall member spotlight under the headline "The people who keep the lamps lit."
// Five members (Maya Okafor, Omar Haddad, Lucía Ferrer, Theo Lindqvist, Priya Raman) each
// get a framed member card with portrait, member number and a wax rank seal, plus a large
// quote, three earned badges, three stats, "Read …'s profile" and a Follow toggle. Use it
// on a community home, about or recognition page to celebrate contributors.

// Design:
// - Parchment #f6f1e7 with faint ledger lines, ink #1c1917 / stone #57534e text, burgundy
//   #7f1d1d frame, seals and buttons, gold #b8860b rules and seal rings, cream #fbf7ef card
//   and badge surfaces; two tilted blank cards form a deck behind the active card.
// - lg: two columns (5fr card / 7fr story); below lg the card (max 320px → sm 360px) sits
//   above the story. Badges stack on mobile and go three-up from sm; stats are a 3-column
//   ruled row.
// - Serif display type (text-[2.1rem] → sm:text-5xl → lg:text-[3.6rem]) and serif quotes,
//   mono uppercase labels with roman numerals ("Member II of V"), SVG wax seals and badge
//   emblems (shield, hexagon, scalloped seal).
// - Motion: the card flips in 3D (rotateY ±180° with hidden backfaces, direction-aware) and
//   leans with the pointer while dragging; the story fades up after the flip; a ring around
//   the play button tracks autoplay; the active portrait coin ring glides (layoutId).
// - Reduced motion: the flip becomes a crossfade and autoplay is off unless Play is pressed.

// What it does:
// - State: [index, direction], follows, hover/focus/drag flags and a play-pause preference.
//   Autoplay advances every 6.5 s via a framer-motion animate() on a progress value, pauses
//   on mouse hover, keyboard focus and drag, resumes where it stopped and stops on unmount.
// - Drag or swipe the card (60 px or a flick; left = next member, right = previous), use the
//   arrow buttons, the portrait coins, or ←/→/Home/End while the spotlight has focus; it
//   loops at both ends.
// - Every member's story is stacked in one grid cell so the height never jumps; only the
//   active one is visible to people and screen readers. Follow toggles per member; profile
//   links point to #member-<id>, "Nominate a member" → #guildhall-nominate.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MemberSpotlightSlider from '@/TestComponent/PageSections/community/Slider03';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <MemberSpotlightSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
    AnimatePresence,
    MotionConfig,
    animate,
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniCheck, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import {
    PiBookOpenTextFill,
    PiChatsCircleFill,
    PiCrownSimpleFill,
    PiFeatherFill,
    PiFlameFill,
    PiHammerFill,
    PiHandshakeFill,
    PiLightbulbFill,
    PiQuotesFill,
    PiShieldStarFill,
    PiSparkleFill,
    PiStarFourFill,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6.5
const EASE = [0.22, 1, 0.36, 1]
const FLIP_EASE = [0.65, 0, 0.35, 1]
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

const scallop = (lobes, outer, inner, c = 32) => {
    const points = []
    for (let i = 0; i < lobes * 2; i += 1) {
        const angle = (i / (lobes * 2)) * Math.PI * 2
        const r = i % 2 ? inner : outer
        points.push(`${(c + r * Math.cos(angle)).toFixed(2)} ${(c + r * Math.sin(angle)).toFixed(2)}`)
    }
    return `M${points.join(' L')} Z`
}

const SEAL_PATH = scallop(18, 31, 28.5)
const SHAPES = {
    shield: 'M32 5 L55 13 V31 C55 45 45 54 32 59 C19 54 9 45 9 31 V13 Z',
    hex: 'M32 4 L56 18 V46 L32 60 L8 46 V18 Z',
    seal: scallop(12, 29, 25),
}

const members = [
    {
        id: 'maya-okafor',
        name: 'Maya Okafor',
        first: 'Maya',
        hall: 'Design Hall',
        role: 'Steward of the Critique Circle',
        number: 'No. 0412',
        since: 'Mar 2021',
        rank: 'IV',
        portrait: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
        alt: 'Smiling woman with curly hair wearing a dark blazer',
        quote: 'The best critique I ever got here was three words: “Show me why.” I’ve paid it forward every Thursday since.',
        badges: [
            { name: 'Mentor', detail: '96 mentees guided', shape: 'shield', Icon: PiHandshakeFill },
            { name: 'Critique Circle', detail: '212 reviews given', shape: 'hex', Icon: PiChatsCircleFill },
            { name: 'Founding 500', detail: 'Joined in year one', shape: 'seal', Icon: PiCrownSimpleFill },
        ],
        stats: [
            ['1,284', 'Replies'],
            ['96', 'Mentees'],
            ['5.2k', 'Thanks'],
        ],
    },
    {
        id: 'omar-haddad',
        name: 'Omar Haddad',
        first: 'Omar',
        hall: 'Code Hall',
        role: 'Mentor of the Month, September',
        number: 'No. 0087',
        since: 'Jun 2019',
        rank: 'V',
        portrait: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80',
        alt: 'Man with glasses and a beard smiling at the camera',
        quote: 'Nobody asks a “stupid” question in the Code Hall. They ask the one twenty lurkers were too shy to type.',
        badges: [
            { name: 'Top Answerer', detail: '1,020 accepted answers', shape: 'hex', Icon: PiLightbulbFill },
            { name: 'Mentor', detail: '41 mentees guided', shape: 'shield', Icon: PiHandshakeFill },
            { name: 'Night Watch', detail: '365-day streak', shape: 'seal', Icon: PiFlameFill },
        ],
        stats: [
            ['2,317', 'Answers'],
            ['41', 'Mentees'],
            ['365', 'Day streak'],
        ],
    },
    {
        id: 'lucia-ferrer',
        name: 'Lucía Ferrer',
        first: 'Lucía',
        hall: 'Writing Hall',
        role: 'Archivist and zine editor',
        number: 'No. 1193',
        since: 'Jan 2022',
        rank: 'III',
        portrait: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=800&q=80',
        alt: 'Laughing woman with red hair photographed outdoors',
        quote: 'I keep the Hall’s archive: 1,400 threads, tagged and bound. Good advice deserves a second life.',
        badges: [
            { name: 'Archivist', detail: '1,400 threads tagged', shape: 'shield', Icon: PiBookOpenTextFill },
            { name: 'Quill', detail: '12 zine issues edited', shape: 'hex', Icon: PiFeatherFill },
            { name: 'Lamplighter', detail: '300 newcomers welcomed', shape: 'seal', Icon: PiSparkleFill },
        ],
        stats: [
            ['1,400', 'Threads'],
            ['12', 'Zine issues'],
            ['300', 'Welcomes'],
        ],
    },
    {
        id: 'theo-lindqvist',
        name: 'Theo Lindqvist',
        first: 'Theo',
        hall: 'Workshop Hall',
        role: 'Host of Wednesday Build Night',
        number: 'No. 0009',
        since: 'Sep 2018',
        rank: 'VI',
        portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
        alt: 'Older man with glasses and a short beard smiling',
        quote: 'Every Wednesday at eight we build something small, out loud. Two hundred nights on, the table is still full.',
        badges: [
            { name: 'Host', detail: '212 build nights run', shape: 'hex', Icon: PiHammerFill },
            { name: 'Founding 500', detail: 'Member number nine', shape: 'seal', Icon: PiCrownSimpleFill },
            { name: 'Guild Elder', detail: 'Eight years in the hall', shape: 'shield', Icon: PiShieldStarFill },
        ],
        stats: [
            ['212', 'Build nights'],
            ['8', 'Years'],
            ['3.9k', 'Attendees'],
        ],
    },
    {
        id: 'priya-raman',
        name: 'Priya Raman',
        first: 'Priya',
        hall: 'Research Hall',
        role: 'Top Answerer, Research Hall',
        number: 'No. 2468',
        since: 'Nov 2023',
        rank: 'III',
        portrait: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
        alt: 'Smiling woman with her hair in a bun',
        quote: 'I joined to ask one question about survey design. Now I answer ten a week, and I still learn from every one.',
        badges: [
            { name: 'Top Answerer', detail: 'Top 1% this year', shape: 'hex', Icon: PiLightbulbFill },
            { name: 'Rising Star', detail: 'Fastest to Rank III', shape: 'seal', Icon: PiStarFourFill },
            { name: 'Mentor', detail: '18 mentees guided', shape: 'shield', Icon: PiHandshakeFill },
        ],
        stats: [
            ['864', 'Answers'],
            ['18', 'Mentees'],
            ['Top 1%', 'This year'],
        ],
    },
]

const total = members.length

const flipVariants = {
    enter: (dir) => ({ rotateY: dir < 0 ? -180 : 180, opacity: 1 }),
    center: { rotateY: 0, opacity: 1, transition: { duration: 0.95, ease: FLIP_EASE } },
    exit: (dir) => ({ rotateY: dir < 0 ? 180 : -180, opacity: 1, transition: { duration: 0.95, ease: FLIP_EASE } }),
}

const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.4 } },
}

function WaxSeal({ rank, className }) {
    return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
            <path d={SEAL_PATH} fill="#7f1d1d" />
            <circle cx="32" cy="32" r="23" fill="#8f2323" />
            <circle cx="32" cy="32" r="20.5" fill="none" stroke="#b8860b" strokeWidth="1.2" strokeDasharray="2 2.6" />
            <text
                x="32"
                y="37.5"
                textAnchor="middle"
                className="fill-[#f6e7c1] font-serif text-[15px] font-bold"
            >
                {rank}
            </text>
        </svg>
    )
}

function Emblem({ shape, Icon }) {
    return (
        <span className="relative grid h-11 w-11 shrink-0 place-items-center">
            <svg viewBox="0 0 64 64" aria-hidden="true" className="absolute inset-0 h-full w-full">
                <path d={SHAPES[shape]} fill="#7f1d1d" stroke="#b8860b" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <Icon aria-hidden="true" className="relative text-lg text-[#f6e7c1]" />
        </span>
    )
}

export function MemberSpotlightSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const [[index, direction], setPage] = useState([0, 0])
    const [follows, setFollows] = useState({})
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dragX = useMotionValue(0)
    const leanRotate = useTransform(dragX, [-260, 0, 260], [-38, 0, 38])
    const leanX = useTransform(dragX, (v) => v * 0.12)
    const stageRef = useRef(null)
    const storyRef = useRef(null)
    const panning = useRef(false)
    const pressedAt = useRef(0)
    const springRef = useRef(null)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const member = members[index]

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

    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    useEffect(() => {
        const preload = new window.Image()
        preload.src = members[(index + 1) % total].portrait
    }, [index])

    useEffect(() => {
        const spring = springRef
        return () => {
            if (spring.current) spring.current.stop()
        }
    }, [])

    // framer-motion calls onPan before (the deferred) onPanStart, so the first onPan call
    // sets the drag state up; onPanEnd reads only the gesture info it is given.
    const handlePan = (_, info) => {
        if (!panning.current) {
            panning.current = true
            if (springRef.current) springRef.current.stop()
            setDragging(true)
        }
        dragX.set(info.offset.x)
    }

    const handlePanEnd = (_, info) => {
        panning.current = false
        setDragging(false)
        if (springRef.current) springRef.current.stop()
        springRef.current = animate(dragX, 0, reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 })
        const { offset, velocity } = info
        if (Math.abs(offset.x) < Math.abs(offset.y)) return
        // Pan velocity reads low after an idle frame loop, so a short, fast swipe also counts.
        const flick = performance.now() - pressedAt.current < 250 && Math.abs(offset.x) > 24
        if (offset.x < -60 || (offset.x < -16 && velocity.x < -450) || (flick && offset.x < 0)) paginate(1)
        else if (offset.x > 60 || (offset.x > 16 && velocity.x > 450) || (flick && offset.x > 0)) paginate(-1)
    }

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        const isMove = event.key in moves
        if (!isMove && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        setFocused(true)
        // Focus inside the story that is about to hide moves to the card instead.
        if (storyRef.current && storyRef.current.contains(event.target) && stageRef.current) {
            stageRef.current.focus({ preventScroll: true })
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

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#f6f1e7] px-4 py-14 text-base font-normal text-[#1c1917] sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(transparent_35px,rgba(28,25,23,0.05)_36px)] bg-[size:100%_36px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
                />
                <svg
                    aria-hidden="true"
                    viewBox="0 0 400 400"
                    className="pointer-events-none absolute -left-40 top-1/3 -z-10 hidden w-[36rem] text-[#7f1d1d]/[0.07] lg:block"
                >
                    <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" />
                    <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="18" />
                </svg>

                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-6 border-b border-[#1c1917]/15 pb-8 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-[#7f1d1d]">
                                <svg viewBox="0 0 64 64" aria-hidden="true" className="h-5 w-5">
                                    <path d={SEAL_PATH} fill="#7f1d1d" />
                                    <circle cx="32" cy="32" r="12" fill="none" stroke="#b8860b" strokeWidth="4" />
                                </svg>
                                Guildhall · Member spotlight · Autumn 2026
                            </p>
                            <h2 className="mt-4 font-serif text-[2.1rem] font-normal leading-[1.02] tracking-[-0.02em] text-[#1c1917] sm:text-5xl lg:text-[3.6rem]">
                                The people who keep the <em className="italic text-[#7f1d1d]">lamps lit.</em>
                            </h2>
                        </div>
                        <div className="max-w-xs md:text-right">
                            <p className="text-sm leading-6 text-[#57534e]">
                                Chosen each season by the hall stewards from 312 nominations.
                            </p>
                            <a
                                href="#guildhall-nominate"
                                className="group mt-2 inline-flex min-h-10 items-center gap-1.5 rounded-full text-sm font-semibold text-[#7f1d1d] underline decoration-[#b8860b] decoration-2 underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f1d1d]"
                            >
                                Nominate a member
                                <HiArrowUpRight
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Guildhall member spotlight"
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
                        <div className="grid items-center gap-10 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:pt-14">
                            <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px]">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 translate-x-3 translate-y-2 rotate-[5deg] rounded-[1.25rem] border border-[#1c1917]/10 bg-[#ece3d0]"
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 -translate-x-2 translate-y-3 -rotate-[3deg] rounded-[1.25rem] border border-[#1c1917]/10 bg-[#e4d8bf]"
                                />
                                <motion.div
                                    ref={stageRef}
                                    role="group"
                                    tabIndex={0}
                                    aria-label="Member card, drag or use the left and right arrow keys to change member"
                                    className={cn(
                                        'relative aspect-[3/4] touch-pan-y select-none rounded-[1.25rem] perspective-[1600px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#7f1d1d]',
                                        dragging ? 'cursor-grabbing' : 'cursor-grab',
                                    )}
                                    onPointerDownCapture={() => {
                                        pressedAt.current = performance.now()
                                    }}
                                    onPan={handlePan}
                                    onPanEnd={handlePanEnd}
                                >
                                    <motion.div
                                        className="absolute inset-0 transform-3d"
                                        style={{ rotateY: leanRotate, x: leanX }}
                                    >
                                        <AnimatePresence initial={false} custom={direction}>
                                            <motion.article
                                                key={member.id}
                                                role="group"
                                                aria-roledescription="slide"
                                                aria-label={`${index + 1} of ${total}: ${member.name}`}
                                                aria-current="true"
                                                custom={direction}
                                                variants={reduce ? fadeVariants : flipVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                className="absolute inset-0 backface-hidden"
                                            >
                                                <div className="flex h-full flex-col rounded-[1.25rem] bg-[#7f1d1d] p-2 shadow-[0_34px_50px_-28px_rgba(28,25,23,0.75)]">
                                                    <div className="relative flex min-h-0 flex-1 flex-col rounded-[0.9rem] border border-[#b8860b]/70 bg-[#fbf7ef] p-2.5">
                                                        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[0.6rem] bg-[#e4d8bf]">
                                                            <img
                                                                src={member.portrait}
                                                                alt={member.alt}
                                                                loading="lazy"
                                                                draggable={false}
                                                                className="h-full w-full object-cover object-[50%_25%]"
                                                            />
                                                            <span className="absolute left-2 top-2 rounded-full bg-[#fbf7ef]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#7f1d1d] backdrop-blur">
                                                                {member.hall}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-end justify-between gap-2 px-1 pt-3">
                                                            <div className="min-w-0">
                                                                <h3 className="truncate font-serif text-xl font-normal leading-tight text-[#1c1917] sm:text-2xl">
                                                                    {member.name}
                                                                </h3>
                                                                <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[#57534e]">
                                                                    {member.number} · since {member.since}
                                                                </p>
                                                            </div>
                                                            <WaxSeal
                                                                rank={member.rank}
                                                                className="-mt-12 h-16 w-16 shrink-0 drop-shadow-[0_6px_8px_rgba(127,29,29,0.35)]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.article>
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>
                            </div>

                            <div ref={storyRef} className="grid grid-cols-1">
                                {members.map((item, i) => {
                                    const on = i === index
                                    const following = Boolean(follows[item.id])
                                    return (
                                        <motion.figure
                                            key={item.id}
                                            aria-hidden={on ? undefined : true}
                                            initial={false}
                                            animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                                            transition={on ? { duration: 0.6, ease: EASE, delay: reduce ? 0 : 0.35 } : { duration: 0 }}
                                            className={cn('col-start-1 row-start-1 min-w-0', on ? 'visible' : 'invisible')}
                                        >
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#7f1d1d]">
                                                    Member {ROMAN[i]} of {ROMAN[total - 1]}
                                                </span>
                                                <span className="h-px w-8 bg-[#b8860b]" />
                                                <span className="rounded-full border border-[#1c1917]/15 px-2.5 py-0.5 text-xs text-[#57534e]">
                                                    {item.hall}
                                                </span>
                                            </div>
                                            <blockquote className="mt-5">
                                                <PiQuotesFill aria-hidden="true" className="text-4xl text-[#7f1d1d]" />
                                                <p className="mt-2 font-serif text-[1.55rem] leading-[1.25] tracking-[-0.01em] text-[#1c1917] sm:text-3xl lg:text-[2.1rem]">
                                                    {item.quote}
                                                </p>
                                            </blockquote>
                                            <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                                                <span className="font-semibold text-[#1c1917]">{item.name}</span>
                                                <span className="text-[#57534e]">{item.role}</span>
                                            </figcaption>
                                            <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
                                                {item.badges.map((badge) => (
                                                    <li
                                                        key={badge.name}
                                                        className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#1c1917]/10 bg-[#fbf7ef] p-2.5 pr-3"
                                                    >
                                                        <Emblem shape={badge.shape} Icon={badge.Icon} />
                                                        <span className="min-w-0">
                                                            <span className="block truncate text-sm font-semibold text-[#1c1917]">
                                                                {badge.name}
                                                            </span>
                                                            <span className="block text-xs leading-snug text-[#57534e]">
                                                                {badge.detail}
                                                            </span>
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <dl className="mt-6 grid grid-cols-3 divide-x divide-[#1c1917]/10 border-y border-[#1c1917]/10 py-4">
                                                {item.stats.map(([value, label]) => (
                                                    <div key={label} className="min-w-0 px-2 text-center first:pl-0 last:pr-0 sm:px-4">
                                                        <dt className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[#57534e]">
                                                            {label}
                                                        </dt>
                                                        <dd className="mt-1 font-serif text-2xl text-[#1c1917] sm:text-3xl">{value}</dd>
                                                    </div>
                                                ))}
                                            </dl>
                                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                                <a
                                                    href={`#member-${item.id}`}
                                                    className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#7f1d1d] pl-5 pr-4 text-sm font-semibold text-[#f6f1e7] transition-colors hover:bg-[#6b1717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]"
                                                >
                                                    Read {item.first}’s profile
                                                    <HiArrowLongRight
                                                        aria-hidden="true"
                                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                                    />
                                                </a>
                                                <button
                                                    type="button"
                                                    aria-pressed={following}
                                                    aria-label={`${following ? 'Unfollow' : 'Follow'} ${item.name}`}
                                                    className={cn(
                                                        'inline-flex h-11 items-center gap-1.5 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]',
                                                        following
                                                            ? 'border-[#b8860b] bg-[#b8860b]/15 text-[#1c1917]'
                                                            : 'border-[#1c1917]/25 text-[#1c1917] hover:border-[#1c1917]',
                                                    )}
                                                    onClick={() => setFollows((map) => ({ ...map, [item.id]: !map[item.id] }))}
                                                >
                                                    {following && <HiMiniCheck aria-hidden="true" className="text-[#b8860b]" />}
                                                    {following ? 'Following' : 'Follow'}
                                                </button>
                                            </div>
                                        </motion.figure>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-[#1c1917]/15 pt-6">
                            <div role="group" aria-label="Choose a member" className="flex items-center gap-2">
                                {members.map((item, i) => {
                                    const on = i === index
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            aria-label={`Show ${item.name}`}
                                            aria-current={on ? 'true' : undefined}
                                            className="group relative grid h-12 w-12 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]"
                                            onClick={() => goTo(i)}
                                        >
                                            {on && (
                                                <motion.span
                                                    layoutId={`${uid}-coin`}
                                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                                    className="absolute inset-0 rounded-full border-2 border-[#7f1d1d]"
                                                />
                                            )}
                                            <img
                                                src={item.portrait.replace('w=800', 'w=400')}
                                                alt=""
                                                loading="lazy"
                                                draggable={false}
                                                className={cn(
                                                    'h-10 w-10 rounded-full object-cover transition duration-300',
                                                    on ? '' : 'opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0',
                                                )}
                                            />
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex items-center gap-2">
                                <p className="mr-2 font-serif text-lg tabular-nums text-[#1c1917]">
                                    {ROMAN[index]}
                                    <span className="text-[#57534e]"> / {ROMAN[total - 1]}</span>
                                </p>
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="relative grid h-11 w-11 place-items-center rounded-full text-lg text-[#1c1917] transition-colors hover:bg-[#1c1917]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    <svg viewBox="0 0 44 44" aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90">
                                        <circle cx="22" cy="22" r="20" fill="none" stroke="#1c1917" strokeOpacity="0.12" strokeWidth="2" />
                                        <motion.circle
                                            cx="22"
                                            cy="22"
                                            r="20"
                                            fill="none"
                                            stroke="#b8860b"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            style={{ pathLength: autoplayOn ? progress : 0 }}
                                        />
                                    </svg>
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous member"
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#1c1917]/25 text-lg text-[#1c1917] transition-colors hover:border-[#7f1d1d] hover:bg-[#7f1d1d] hover:text-[#f6f1e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]"
                                    onClick={() => paginate(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next member"
                                    className="grid h-11 w-11 place-items-center rounded-full bg-[#7f1d1d] text-lg text-[#f6f1e7] transition-colors hover:bg-[#6b1717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]"
                                    onClick={() => paginate(1)}
                                >
                                    <HiArrowLongRight aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                            Member {index + 1} of {total}: {member.name}, {member.role}
                        </p>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default MemberSpotlightSlider

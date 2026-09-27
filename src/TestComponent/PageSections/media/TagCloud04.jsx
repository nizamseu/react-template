// TossChipsTagCloud

// TagCloud04 · Blogs & Digital Media › Tag Cloud & Categories

// Description:
// A playful, hands-on tag picker for Playground, a blog of activities for kids and parents.
// Under "Toss the tags. Keep the fun ones." fourteen chunky chips (Rainy day, Messy play,
// Science at home…) lie scattered on a dotted play mat; they can be dragged and tossed
// around inside it and tapped to pick. A "Your pile" panel counts the matching activities
// and lists the best ones. Use it on family, parenting or hobby blogs as a playful filter.

// Design:
// - White section, ink #16181d; bright primaries red #ef3e36, yellow #ffc62b, blue #2f6bff,
//   green #17a34a on chips, a yellow #fff4cc panel and decorative corner shapes
// - Chips: 48px pills with a 3px ink border, hard 4px ink drop shadow and a round icon
//   badge; picked chips fill with their colour and swap the icon for a check
// - Mat: rounded-[32px], 3px ink border, dot-grid background; chips flow in a wrapped pile
//   at base and are scattered at fixed tilted positions from md (md:h-[460px])
// - Drag uses framer-motion drag with the mat as constraints, momentum and a springy
//   bounce; dragged chips scale up and straighten; heading has a hand-drawn blue squiggle
// - Responsive: stacked at base, lg:grid-cols-[minmax(0,1fr)_340px] with the panel beside
//   the mat; controls wrap below the mat

// What it does:
// - picked (chip ids, two preset) toggles on click, Enter or Space (aria-pressed); a click
//   that ends a drag is ignored so tossing never toggles by accident
// - The panel filters 22 activities by any picked tag and shows the count, the picked tags
//   and up to four matches with ages and time; announced via aria-live
// - "Tidy the mat" remounts the chips at their start positions, "Clear picks" empties the
//   pile; "See all ideas" links to #playground-ideas, activities to #idea-<slug>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TossChipsTagCloud from '@/TestComponent/PageSections/media/TagCloud04';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <TossChipsTagCloud />
//     </main>
// )
// ```

'use client'

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TbArrowRight,
    TbBug,
    TbCake,
    TbCheck,
    TbCloudRain,
    TbCookie,
    TbCar,
    TbDeviceTvOff,
    TbDice5,
    TbFlask,
    TbHandFinger,
    TbHandGrab,
    TbMoon,
    TbMusic,
    TbPalette,
    TbPlayFootball,
    TbRefresh,
    TbScissors,
    TbX,
} from 'react-icons/tb';
import { cn } from '@/design-system/lib/cn';

const COLORS = {
    red: { fill: 'bg-[#ef3e36]', text: 'text-white', dot: 'bg-[#ef3e36]' },
    yellow: { fill: 'bg-[#ffc62b]', text: 'text-[#16181d]', dot: 'bg-[#ffc62b]' },
    blue: { fill: 'bg-[#2f6bff]', text: 'text-white', dot: 'bg-[#2f6bff]' },
    green: { fill: 'bg-[#17a34a]', text: 'text-white', dot: 'bg-[#17a34a]' },
}

const chips = [
    { id: 'rainy-day', label: 'Rainy day', icon: TbCloudRain, color: 'blue', rot: -6, pos: 'md:left-[4%] md:top-[6%]' },
    { id: 'messy-play', label: 'Messy play', icon: TbPalette, color: 'red', rot: 5, pos: 'md:left-[31%] md:top-[10%]' },
    { id: 'science', label: 'Science at home', icon: TbFlask, color: 'green', rot: -3, pos: 'md:left-[57%] md:top-[5%]' },
    { id: 'outdoor', label: 'Outdoor games', icon: TbPlayFootball, color: 'yellow', rot: 4, pos: 'md:left-[11%] md:top-[27%]' },
    { id: 'crafts', label: 'Crafts', icon: TbScissors, color: 'red', rot: -8, pos: 'md:left-[44%] md:top-[30%]' },
    { id: 'baking', label: 'Baking together', icon: TbCookie, color: 'blue', rot: 3, pos: 'md:left-[64%] md:top-[25%]' },
    { id: 'road-trips', label: 'Road trips', icon: TbCar, color: 'green', rot: 7, pos: 'md:left-[3%] md:top-[49%]' },
    { id: 'board-games', label: 'Board games', icon: TbDice5, color: 'yellow', rot: -4, pos: 'md:left-[32%] md:top-[52%]' },
    { id: 'music', label: 'Music & dance', icon: TbMusic, color: 'red', rot: 6, pos: 'md:left-[62%] md:top-[47%]' },
    { id: 'bugs', label: 'Garden bugs', icon: TbBug, color: 'green', rot: -5, pos: 'md:left-[8%] md:top-[71%]' },
    { id: 'sensory', label: 'Sensory play', icon: TbHandFinger, color: 'blue', rot: 3, pos: 'md:left-[38%] md:top-[74%]' },
    { id: 'screen-free', label: 'Screen-free', icon: TbDeviceTvOff, color: 'yellow', rot: -7, pos: 'md:left-[68%] md:top-[69%]' },
    { id: 'birthday', label: 'Birthday ideas', icon: TbCake, color: 'red', rot: 5, pos: 'md:left-[20%] md:top-[85%]' },
    { id: 'quiet-time', label: 'Quiet time', icon: TbMoon, color: 'blue', rot: -3, pos: 'md:left-[56%] md:top-[85%]' },
]

const activities = [
    { slug: 'kitchen-volcano', title: 'Kitchen-table volcano', ages: '4–8', time: '30 min', tags: ['science', 'messy-play'] },
    { slug: 'puddle-course', title: 'Puddle-jump obstacle course', ages: '3–7', time: '20 min', tags: ['rainy-day', 'outdoor'] },
    { slug: 'marble-run', title: 'Cardboard-box marble run', ages: '5–10', time: '45 min', tags: ['crafts', 'science', 'rainy-day'] },
    { slug: 'banana-cookies', title: 'No-bake banana oat cookies', ages: '3–8', time: '25 min', tags: ['baking'] },
    { slug: 'car-bingo', title: 'Car-window bingo cards', ages: '4–10', time: 'Any length', tags: ['road-trips', 'board-games', 'screen-free'] },
    { slug: 'pot-drums', title: 'Kitchen-pot drum circle', ages: '2–6', time: '15 min', tags: ['music', 'messy-play'] },
    { slug: 'bug-hotel', title: 'Bug hotel from garden scraps', ages: '5–10', time: '60 min', tags: ['bugs', 'outdoor', 'crafts'] },
    { slug: 'dino-dig', title: 'Frozen dinosaur dig', ages: '2–6', time: '40 min', tags: ['sensory', 'messy-play', 'science'] },
    { slug: 'blanket-fort', title: 'Blanket-fort story hour', ages: '3–8', time: '30 min', tags: ['quiet-time', 'rainy-day', 'screen-free'] },
    { slug: 'homemade-board-game', title: 'Invent a board game in an afternoon', ages: '6–11', time: '90 min', tags: ['board-games', 'crafts'] },
    { slug: 'treasure-hunt', title: 'Birthday treasure hunt kit', ages: '4–9', time: '45 min', tags: ['birthday', 'outdoor'] },
    { slug: 'rainbow-rice', title: 'Rainbow rice sensory bin', ages: '1–4', time: '20 min', tags: ['sensory', 'quiet-time'] },
    { slug: 'snail-racing', title: 'Snail racing (gently)', ages: '4–9', time: '30 min', tags: ['bugs', 'outdoor', 'science'] },
    { slug: 'pizza-faces', title: 'Pizza-face party pizzas', ages: '3–10', time: '35 min', tags: ['baking', 'birthday'] },
    { slug: 'freeze-dance', title: 'Freeze-dance playlist for wet days', ages: '2–8', time: '15 min', tags: ['music', 'rainy-day'] },
    { slug: 'magnet-tins', title: 'Travel-tin magnet puzzles', ages: '3–7', time: '20 min', tags: ['road-trips', 'quiet-time', 'crafts'] },
    { slug: 'chalk-golf', title: 'Pavement-chalk mini golf', ages: '4–10', time: '40 min', tags: ['outdoor', 'screen-free'] },
    { slug: 'salt-dough', title: 'Salt-dough keepsakes', ages: '3–9', time: '50 min', tags: ['crafts', 'baking', 'sensory'] },
    { slug: 'moth-walk', title: 'Moth-spotting night walk', ages: '6–11', time: '45 min', tags: ['bugs', 'outdoor', 'quiet-time'] },
    { slug: 'marbled-cards', title: 'Shaving-foam marbled cards', ages: '3–8', time: '30 min', tags: ['messy-play', 'crafts', 'birthday'] },
    { slug: 'backseat-rhythm', title: 'Backseat rhythm games', ages: '4–10', time: 'Any length', tags: ['road-trips', 'music', 'screen-free'] },
    { slug: 'games-cafe', title: 'Board-game café at home', ages: '5–12', time: '60 min', tags: ['board-games', 'birthday', 'screen-free'] },
]

const chipById = Object.fromEntries(chips.map((c) => [c.id, c]))
const dots = {
    backgroundImage: 'radial-gradient(rgba(22,24,29,0.16) 1.5px, transparent 1.5px)',
    backgroundSize: '22px 22px',
}

export function TossChipsTagCloud({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const matRef = useRef(null)
    const dragged = useRef(false)
    const [picked, setPicked] = useState(['rainy-day', 'crafts'])
    const [round, setRound] = useState(0)

    const matches = useMemo(
        () => activities.filter((a) => a.tags.some((t) => picked.includes(t))),
        [picked],
    )

    const toggle = (id) => setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#16181d] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <span aria-hidden="true" className="absolute -right-16 -top-16 size-48 rounded-full bg-[#ffc62b] md:size-64" />
            <svg
                aria-hidden="true"
                viewBox="0 0 120 40"
                className="absolute -left-6 top-40 hidden w-40 text-[#2f6bff] md:block"
            >
                <path
                    d="M4 20 q 14 -18 28 0 t 28 0 t 28 0 t 28 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 60 52" className="absolute bottom-10 right-8 hidden w-16 rotate-12 lg:block">
                <path d="M30 2 L58 50 L2 50 Z" fill="#ef3e36" />
            </svg>

            <div className="relative mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <p className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-[#16181d] bg-white px-4 py-1.5 text-sm font-extrabold text-[#16181d]">
                        <span aria-hidden="true" className="flex gap-1">
                            <span className="size-2.5 rounded-full bg-[#ef3e36]" />
                            <span className="size-2.5 rounded-full bg-[#ffc62b]" />
                            <span className="size-2.5 rounded-full bg-[#2f6bff]" />
                        </span>
                        Playground · ideas for small people
                    </p>
                    <h2 className="mt-6 text-4xl font-black leading-[1] tracking-tight text-[#16181d] sm:text-5xl lg:text-6xl">
                        Toss the tags. Keep the{' '}
                        <span className="relative inline-block text-[#2f6bff]">
                            fun
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 100 16"
                                preserveAspectRatio="none"
                                className="absolute -bottom-2 left-0 h-3 w-full text-[#ffc62b]"
                            >
                                <path d="M2 10 q 12 -9 24 0 t 24 0 t 24 0 t 24 0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                            </svg>
                        </span>{' '}
                        ones.
                    </h2>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#16181d]/70">
                        Every chip is a kind of afternoon. Drag them around the mat, tap the ones that fit your
                        crew, and we’ll build today’s plan from 22 tried-and-tested activities.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
                    <div className="min-w-0">
                        <div
                            ref={matRef}
                            className="relative flex min-h-[380px] flex-wrap content-center justify-center gap-3 overflow-hidden rounded-[32px] border-[3px] border-[#16181d] bg-[#f7f8fb] p-5 md:block md:h-[460px] md:p-0"
                            style={dots}
                        >
                            {chips.map((chip) => {
                                const on = picked.includes(chip.id)
                                const tone = COLORS[chip.color]
                                const Icon = on ? TbCheck : chip.icon
                                return (
                                    <motion.button
                                        key={`${chip.id}-${round}`}
                                        drag
                                        type="button"
                                        aria-pressed={on}
                                        dragConstraints={matRef}
                                        dragElastic={0.2}
                                        dragTransition={{ power: 0.35, timeConstant: 220, bounceStiffness: 420, bounceDamping: 16 }}
                                        initial={false}
                                        animate={{ rotate: chip.rot, scale: on ? 1.05 : 1 }}
                                        whileDrag={{ scale: 1.1, rotate: 0, zIndex: 40 }}
                                        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                                        className={cn(
                                            'relative z-0 inline-flex min-h-12 cursor-grab touch-none select-none items-center gap-2 whitespace-nowrap rounded-full border-[3px] border-[#16181d] py-1 pl-1 pr-4 text-sm font-extrabold shadow-[0_4px_0_#16181d] transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#2f6bff] active:cursor-grabbing md:absolute',
                                            chip.pos,
                                            on ? cn(tone.fill, tone.text) : 'bg-white text-[#16181d] hover:bg-[#fffbea]',
                                        )}
                                        onPointerDown={() => {
                                            dragged.current = false
                                        }}
                                        onDragStart={() => {
                                            dragged.current = true
                                        }}
                                        onClick={(event) => {
                                            if (dragged.current && event.detail !== 0) {
                                                dragged.current = false
                                                return
                                            }
                                            toggle(chip.id)
                                        }}
                                    >
                                        <span
                                            className={cn(
                                                'grid size-8 shrink-0 place-items-center rounded-full',
                                                on ? 'bg-white text-[#16181d]' : cn(tone.fill, tone.text),
                                            )}
                                        >
                                            <Icon aria-hidden="true" className="size-[18px]" />
                                        </span>
                                        {chip.label}
                                    </motion.button>
                                )
                            })}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#16181d]/65">
                                <TbHandGrab aria-hidden="true" className="size-5 text-[#2f6bff]" />
                                Drag to toss · tap to pick
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-[3px] border-[#16181d] bg-white px-4 text-sm font-extrabold text-[#16181d] transition-colors hover:bg-[#fff4cc] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#2f6bff]"
                                    onClick={() => setRound((n) => n + 1)}
                                >
                                    <TbRefresh aria-hidden="true" className="size-4" />
                                    Tidy the mat
                                </button>
                                <button
                                    type="button"
                                    disabled={!picked.length}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-[3px] border-[#16181d] bg-white px-4 text-sm font-extrabold text-[#16181d] transition-colors hover:bg-[#ffe3e1] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#2f6bff] disabled:cursor-not-allowed disabled:opacity-40"
                                    onClick={() => setPicked([])}
                                >
                                    <TbX aria-hidden="true" className="size-4" />
                                    Clear picks
                                </button>
                            </div>
                        </div>
                    </div>

                    <aside className="rounded-[28px] border-[3px] border-[#16181d] bg-[#fff4cc] p-6 shadow-[6px_6px_0_#16181d] lg:self-start">
                        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#16181d]/70">Your pile</p>
                        <p aria-live="polite" className="mt-2 flex items-baseline gap-2">
                            <span className="text-6xl font-black leading-none tabular-nums text-[#16181d]">
                                {picked.length ? matches.length : activities.length}
                            </span>
                            <span className="text-lg font-extrabold text-[#16181d]">
                                {picked.length ? (matches.length === 1 ? 'idea fits' : 'ideas fit') : 'ideas to play with'}
                            </span>
                        </p>

                        {picked.length > 0 ? (
                            <ul aria-label="Picked tags" className="mt-4 flex flex-wrap gap-1.5">
                                {picked.map((id) => (
                                    <li
                                        key={id}
                                        className={cn(
                                            'rounded-full border-2 border-[#16181d] px-2.5 py-0.5 text-xs font-extrabold',
                                            COLORS[chipById[id].color].fill,
                                            COLORS[chipById[id].color].text,
                                        )}
                                    >
                                        {chipById[id].label}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-4 text-sm leading-relaxed text-[#16181d]/70">
                                Tap a few chips on the mat to build this afternoon’s plan.
                            </p>
                        )}

                        {picked.length > 0 && (
                            <ul className="mt-5 space-y-2">
                                {matches.slice(0, 4).map((activity) => (
                                    <li key={activity.slug}>
                                        <a
                                            href={`#idea-${activity.slug}`}
                                            className="group flex items-start gap-3 rounded-2xl border-2 border-[#16181d] bg-white p-3 transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#2f6bff] motion-reduce:transition-none"
                                        >
                                            <span aria-hidden="true" className="mt-1.5 flex shrink-0 gap-0.5">
                                                {activity.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className={cn('size-2 rounded-full', COLORS[chipById[tag].color].dot)} />
                                                ))}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-sm font-extrabold leading-snug text-[#16181d] group-hover:text-[#2f6bff]">
                                                    {activity.title}
                                                </span>
                                                <span className="mt-0.5 block text-xs font-semibold text-[#16181d]/55">
                                                    Ages {activity.ages} · {activity.time}
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                                {matches.length === 0 && (
                                    <li className="text-sm text-[#16181d]/70">No ideas for that mix yet. Try another chip!</li>
                                )}
                            </ul>
                        )}

                        <a
                            href="#playground-ideas"
                            className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-[3px] border-[#16181d] bg-[#2f6bff] px-5 text-sm font-extrabold text-white shadow-[0_4px_0_#16181d] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#16181d] motion-reduce:transition-none"
                        >
                            See all {picked.length ? matches.length : activities.length} ideas
                            <TbArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default TossChipsTagCloud

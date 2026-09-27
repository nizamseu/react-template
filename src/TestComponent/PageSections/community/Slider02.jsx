// EventCardsSlider

// Slider02 · Social Networks & Communities › Animated Slider

// Description:
// Draggable row of Meetwell community event cards for Leeds, under the headline "Plans
// worth leaving the house for." Eight ticket-style cards (Track Night Intervals, Silent
// Book Club, Wheel-throwing for Beginners, Harvest Long-Table Supper …) show a calendar
// date block, category, host group, venue, time, a capacity bar, attendee faces and an RSVP
// toggle. Use it on a community home page or a group directory to surface upcoming meet-ups.

// Design:
// - Cream #fffbeb background with a faint indigo dot grid, ink #1e1b4b text, indigo #4338ca
//   accents, #e0e7ff tints and amber #fcd34d "few spots left" chips; a ghost outlined
//   "October" sits behind the header on lg.
// - Cards: white, rounded-[1.5rem], 16:10 photo with an indigo date tile, ticket
//   perforation (dashed rule + cream notches) above an attendee/RSVP stub; soft indigo
//   shadow.
// - Heavy tight sans headline (text-[2.1rem] → sm:text-5xl → lg:text-6xl) with a hand-drawn
//   SVG underline that draws in on view; mono counters and labels.
// - Row shows 1.2 cards (base) → 2 (sm) → 3 (lg); the row is clipped horizontally only, so
//   card shadows stay visible and the page never scrolls sideways.
// - Motion: spring snap between stops, rubber-band at the ends, the active dot stretches
//   and fills with the autoplay timer, capacity bars slide and the check pops on RSVP.

// What it does:
// - State: active stop, measured stops (one per scroll position, re-measured on resize),
//   cards per view, RSVPs, hover/focus/drag flags and a play-pause preference.
// - Drag/swipe the row (framer-motion drag="x", touch keeps vertical scrolling): release
//   snaps to the nearest stop, a 30 px drag or a flick moves at least one stop, never
//   against the drag. Arrows, dots and ←/→/Home/End also move it; arrows wrap at the ends.
// - Autoplay steps every 4.5 s (rewinds at the end), pauses on hover, keyboard focus and
//   drag, is off for prefers-reduced-motion (snaps jump instead) and is cleaned up on unmount.
// - Tabbing to an off-screen card brings it into view; RSVP toggles "Going" (+1) or the
//   waitlist for full events; a click that ends a drag is ignored. "All 24 events" →
//   #meetwell-events, cards link to #event-<id>.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EventCardsSlider from '@/TestComponent/PageSections/community/Slider02';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <EventCardsSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniCheck, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { LuCalendarDays, LuClock3, LuMapPin } from 'react-icons/lu';
import { PiHandSwipeLeft } from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 4.5
const EASE = [0.22, 1, 0.36, 1]
const SPRING = { type: 'spring', stiffness: 260, damping: 34, mass: 0.9 }

const faces = {
    amara: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    josh: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    freya: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    dev: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
    hana: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    callum: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    zoe: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80',
    ade: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80',
    rosa: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=400&q=80',
}

const events = [
    {
        id: 'track-night',
        month: 'Oct',
        day: '06',
        weekday: 'Tue',
        title: 'Track Night Intervals',
        group: 'Riverside Runners',
        category: 'Running',
        venue: 'Kirkstall athletics track, gate B',
        time: '6:30 – 8:00 pm',
        going: 38,
        capacity: 50,
        price: 'Free',
        people: [faces.josh, faces.freya, faces.ade],
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        alt: 'Sprinter pushing off from the starting line on a red running track',
    },
    {
        id: 'silent-book-club',
        month: 'Oct',
        day: '07',
        weekday: 'Wed',
        title: 'Silent Book Club: October Reads',
        group: 'Northside Readers',
        category: 'Book club',
        venue: 'The Reading Room, Chapel Allerton',
        time: '7:00 – 9:00 pm',
        going: 24,
        capacity: 30,
        price: 'Free',
        people: [faces.hana, faces.callum, faces.rosa],
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
        alt: 'Stack of open books with pages fanned out',
    },
    {
        id: 'wheel-throwing',
        month: 'Oct',
        day: '10',
        weekday: 'Sat',
        title: 'Wheel-throwing for Beginners',
        group: 'Clay Collective',
        category: 'Pottery',
        venue: 'Kiln & Co. Studio, Holbeck',
        time: '10:00 am – 1:00 pm',
        going: 11,
        capacity: 12,
        price: '£28',
        people: [faces.zoe, faces.amara, faces.dev],
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        alt: 'Handmade white ceramic cups and vessels on a shelf',
    },
    {
        id: 'photo-walk',
        month: 'Oct',
        day: '11',
        weekday: 'Sun',
        title: 'Golden Hour Photo Walk',
        group: 'Lens & Lanes',
        category: 'Photography',
        venue: 'Granary Wharf steps',
        time: '5:15 – 7:00 pm',
        going: 19,
        capacity: 25,
        price: 'Free',
        people: [faces.dev, faces.rosa, faces.josh],
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        alt: 'Camera body and lenses laid out on a table',
    },
    {
        id: 'language-exchange',
        month: 'Oct',
        day: '14',
        weekday: 'Wed',
        title: 'Spanish ⇄ English Exchange',
        group: 'Hablamos Leeds',
        category: 'Languages',
        venue: 'Café Colibrí, Call Lane',
        time: '6:30 – 8:30 pm',
        going: 42,
        capacity: 60,
        price: 'Free',
        people: [faces.amara, faces.ade, faces.hana],
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
        alt: 'Friends chatting and laughing around a café table',
    },
    {
        id: 'woodland-walk',
        month: 'Oct',
        day: '17',
        weekday: 'Sat',
        title: 'Autumn Woodland Walk & Litter Pick',
        group: 'Meanwood Volunteers',
        category: 'Volunteering',
        venue: 'Meanwood Valley Trail, Parkside',
        time: '9:30 am – 12:30 pm',
        going: 27,
        capacity: 40,
        price: 'Free',
        people: [faces.callum, faces.zoe, faces.freya],
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
        alt: 'Sunlit path through a green forest',
    },
    {
        id: 'peak-hike',
        month: 'Oct',
        day: '18',
        weekday: 'Sun',
        title: 'Peak District Day Hike',
        group: 'Trail Mix Hikers',
        category: 'Hiking',
        venue: 'Edale station, off the 7:52 from Leeds',
        time: '9:15 am – 5:30 pm',
        going: 16,
        capacity: 20,
        price: '£12',
        people: [faces.freya, faces.josh, faces.dev],
        image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80',
        alt: 'Group of hikers with backpacks walking along a mountain ridge',
    },
    {
        id: 'harvest-supper',
        month: 'Oct',
        day: '22',
        weekday: 'Thu',
        title: 'Harvest Long-Table Supper',
        group: 'Long Table Suppers',
        category: 'Food',
        venue: 'The Old Chapel, Kirkgate',
        time: '7:30 – 10:30 pm',
        going: 48,
        capacity: 48,
        price: '£22',
        people: [faces.rosa, faces.hana, faces.callum],
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
        alt: 'Friends sharing dishes around a long dinner table',
    },
]

const total = events.length
const pad = (n) => String(n).padStart(2, '0')

function EventCard({ event, index, isVisible, rsvp, onToggle, onReveal }) {
    const full = event.going >= event.capacity
    const going = event.going + (rsvp && !full ? 1 : 0)
    const left = Math.max(0, event.capacity - going)
    const fill = Math.min(1, going / event.capacity)

    return (
        <div
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${total}: ${event.title}, ${event.weekday} ${Number(event.day)} ${event.month}`}
            aria-current={isVisible ? 'true' : undefined}
            className="w-[84%] shrink-0 px-2.5 sm:w-1/2 lg:w-1/3 lg:px-3"
            onFocus={onReveal}
        >
            <article className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#1e1b4b]/10 bg-white shadow-[0_1px_0_rgba(30,27,75,0.05),0_28px_44px_-30px_rgba(67,56,202,0.55)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#e0e7ff]">
                    <img
                        src={event.image}
                        alt={event.alt}
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1e1b4b]/35 to-transparent" />
                    <div className="absolute left-3 top-3 w-[3.75rem] overflow-hidden rounded-2xl bg-[#4338ca] text-center text-white shadow-[0_10px_24px_-8px_rgba(30,27,75,0.6)]">
                        <span className="block bg-[#312e81] py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                            {event.month}
                        </span>
                        <span className="block pt-1.5 text-[1.7rem] font-black leading-none tracking-[-0.04em]">
                            {event.day}
                        </span>
                        <span className="block pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">
                            {event.weekday}
                        </span>
                    </div>
                    <span className="absolute right-3 top-3 rounded-full bg-[#fffbeb]/95 px-3 py-1 text-xs font-semibold text-[#312e81] backdrop-blur">
                        {event.category}
                    </span>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4338ca]">{event.group}</p>
                    <h3 className="mt-1.5 text-xl font-bold leading-tight tracking-[-0.02em] text-[#1e1b4b]">
                        <a
                            href={`#event-${event.id}`}
                            draggable={false}
                            className="rounded-sm decoration-[#a5b4fc] decoration-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]"
                        >
                            {event.title}
                        </a>
                    </h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-[#1e1b4b]/75">
                        <li className="flex items-start gap-2">
                            <LuMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-[#4338ca]" />
                            <span>{event.venue}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <LuClock3 aria-hidden="true" className="mt-0.5 shrink-0 text-[#4338ca]" />
                            <span>
                                {event.weekday} {Number(event.day)} {event.month} · {event.time}
                            </span>
                        </li>
                    </ul>
                    <div className="mt-auto pt-4">
                        <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="font-semibold tabular-nums text-[#1e1b4b]">
                                {going} / {event.capacity} going
                            </span>
                            {full ? (
                                <span className="rounded-full bg-[#1e1b4b] px-2 py-0.5 font-semibold text-[#fffbeb]">
                                    Full · waitlist
                                </span>
                            ) : left <= 5 ? (
                                <span className="rounded-full bg-[#fcd34d] px-2 py-0.5 font-semibold text-[#1e1b4b]">
                                    {left} {left === 1 ? 'spot' : 'spots'} left
                                </span>
                            ) : (
                                <span className="text-[#1e1b4b]/55">{left} spots left</span>
                            )}
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e0e7ff]">
                            <motion.div
                                className="h-full origin-left rounded-full bg-[#4338ca]"
                                initial={false}
                                animate={{ scaleX: fill }}
                                transition={{ duration: 0.7, ease: EASE }}
                            />
                        </div>
                    </div>
                </div>

                <div aria-hidden="true" className="relative h-0">
                    <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-[#1e1b4b]/10 bg-[#fffbeb]" />
                    <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-[#1e1b4b]/10 bg-[#fffbeb]" />
                    <span className="absolute inset-x-5 top-0 border-t-2 border-dashed border-[#1e1b4b]/12" />
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-4">
                    <div className="flex min-w-0 items-center">
                        <div className="flex -space-x-2">
                            {event.people.map((src) => (
                                <img
                                    key={src}
                                    src={src}
                                    alt=""
                                    loading="lazy"
                                    draggable={false}
                                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                                />
                            ))}
                        </div>
                        <span className="ml-2 truncate text-xs text-[#1e1b4b]/60">+{going - event.people.length}</span>
                    </div>
                    <button
                        type="button"
                        aria-pressed={rsvp}
                        aria-label={
                            full
                                ? `${rsvp ? 'Leave' : 'Join'} the waitlist for ${event.title}`
                                : `${rsvp ? 'Cancel RSVP for' : 'RSVP to'} ${event.title}, ${event.price}`
                        }
                        className={cn(
                            'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]',
                            rsvp
                                ? 'border-[#4338ca] bg-[#4338ca] text-white hover:bg-[#3730a3]'
                                : 'border-[#4338ca] text-[#4338ca] hover:bg-[#e0e7ff]',
                        )}
                        onClick={onToggle}
                    >
                        {rsvp && (
                            <motion.span
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                                className="inline-flex"
                            >
                                <HiMiniCheck aria-hidden="true" />
                            </motion.span>
                        )}
                        {full ? (rsvp ? 'On waitlist' : 'Waitlist') : rsvp ? 'Going' : `RSVP · ${event.price}`}
                    </button>
                </div>
            </article>
        </div>
    )
}

export function EventCardsSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [active, setActive] = useState(0)
    const [stops, setStops] = useState(null)
    const [perView, setPerView] = useState(1)
    const [rsvps, setRsvps] = useState({ 'silent-book-club': true })
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const x = useMotionValue(0)
    const progress = useMotionValue(0)
    const viewportRef = useRef(null)
    const trackRef = useRef(null)
    const controlsRef = useRef(null)
    const activeRef = useRef(0)
    const stopsRef = useRef([0])
    const moved = useRef(false)
    const pressedAt = useRef(0)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging

    const stopCount = stops ? stops.length : total
    const maxOffset = stops ? stops[stops.length - 1] : 0
    const first = Math.min(active, total - perView)
    const last = Math.min(first + perView, total)

    const settle = useCallback(
        (target, instant = false) => {
            const list = stopsRef.current
            const next = Math.max(0, Math.min(list.length - 1, target))
            // Only a real move restarts the autoplay timer (jump() also stops its animation).
            if (next !== activeRef.current) {
                activeRef.current = next
                progress.jump(0)
                setActive(next)
            }
            if (controlsRef.current) controlsRef.current.stop()
            controlsRef.current = animate(x, -list[next], instant || reduce ? { duration: 0 } : SPRING)
        },
        [progress, reduce, x],
    )

    const step = useCallback(
        (dir) => {
            const count = stopsRef.current.length
            settle((activeRef.current + dir + count) % count)
        },
        [settle],
    )

    const measure = useCallback(() => {
        const viewport = viewportRef.current
        const track = trackRef.current
        if (!viewport || !track || !track.children.length) return
        const cards = [...track.children]
        const lastCard = cards[cards.length - 1]
        const max = Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth - track.clientWidth)
        const list = []
        cards.forEach((card) => {
            const offset = Math.min(card.offsetLeft, max)
            if (!list.length || offset - list[list.length - 1] > 1) list.push(offset)
        })
        stopsRef.current = list
        setStops(list)
        setPerView(Math.max(1, Math.floor((track.clientWidth + 1) / cards[0].offsetWidth)))
        const clamped = Math.min(activeRef.current, list.length - 1)
        activeRef.current = clamped
        setActive(clamped)
        if (controlsRef.current) controlsRef.current.stop()
        x.jump(-list[clamped])
    }, [x])

    useEffect(() => {
        setHydrated(true)
        measure()
        const viewport = viewportRef.current
        if (!viewport || typeof ResizeObserver === 'undefined') return undefined
        const observer = new ResizeObserver(() => measure())
        observer.observe(viewport)
        return () => observer.disconnect()
    }, [measure])

    useEffect(() => {
        const controls = controlsRef
        return () => {
            if (controls.current) controls.current.stop()
        }
    }, [])

    // Autoplay: fill the active dot over 4.5 s, then step (rewinding after the last stop).
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => step(1),
        })
        return () => controls.stop()
    }, [playing, active, progress, step])

    const handleDragStart = () => {
        moved.current = true
        setDragging(true)
    }

    const handleDragEnd = (_, info) => {
        setDragging(false)
        const list = stopsRef.current
        const from = activeRef.current
        const projected = -(x.get() + info.velocity.x * 0.2)
        let target = 0
        list.forEach((stop, i) => {
            if (Math.abs(stop - projected) < Math.abs(list[target] - projected)) target = i
        })
        // A deliberate drag (30 px, or a swipe under 250 ms past 24 px, since pan velocity
        // reads low after an idle frame loop) moves at least one stop, never against the drag.
        const flick = performance.now() - pressedAt.current < 250 && Math.abs(info.offset.x) > 24
        if ((info.offset.x < -30 || (flick && info.offset.x < 0)) && target <= from) target = from + 1
        if ((info.offset.x > 30 || (flick && info.offset.x > 0)) && target >= from) target = from - 1
        if (info.offset.x < 0 && target < from) target = from
        if (info.offset.x > 0 && target > from) target = from
        settle(target)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') step(1)
        else if (event.key === 'ArrowLeft') step(-1)
        else if (event.key === 'Home') settle(0)
        else if (event.key === 'End') settle(stopsRef.current.length - 1)
        else return
        event.preventDefault()
        setFocused(true)
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

    const revealCard = (i) => {
        const count = stopsRef.current.length
        const start = Math.min(activeRef.current, total - perView)
        if (i < start) settle(Math.min(i, count - 1))
        else if (i > start + perView - 1) settle(Math.min(i - perView + 1, count - 1))
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#fffbeb] px-4 py-14 text-base font-normal text-[#1e1b4b] sm:px-6 sm:py-16 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(67,56,202,0.09)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
                />
                <p
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-6 right-[-2rem] -z-10 hidden select-none text-[11rem] font-black leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(67,56,202,0.16)] lg:block"
                >
                    October
                </p>

                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#4338ca]">
                                <LuCalendarDays aria-hidden="true" className="text-sm" />
                                Meetwell · Leeds & around
                            </p>
                            <h2 className="mt-3 text-[2.1rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#1e1b4b] sm:text-5xl lg:text-6xl">
                                Plans worth{' '}
                                <span className="relative inline-block whitespace-nowrap">
                                    leaving the house
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 300 14"
                                        preserveAspectRatio="none"
                                        className="absolute -bottom-2 left-0 h-3 w-full sm:-bottom-3 sm:h-4"
                                    >
                                        <motion.path
                                            d="M3 10 C 62 3, 128 2, 186 7 S 272 12, 297 4"
                                            fill="none"
                                            stroke="#818cf8"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            initial={{ pathLength: reduce ? 1 : 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            viewport={{ once: true, amount: 0.6 }}
                                            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                                        />
                                    </svg>
                                </span>{' '}
                                for.
                            </h2>
                            <p className="mt-5 max-w-lg text-sm leading-6 text-[#1e1b4b]/70 sm:text-base sm:leading-7">
                                Eight meet-ups from groups you follow this month, from track nights to a
                                long-table harvest supper. 225 neighbours have already said yes.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                className="grid h-12 w-12 place-items-center rounded-full text-lg text-[#1e1b4b]/70 transition-colors hover:bg-[#e0e7ff] hover:text-[#1e1b4b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]"
                                onClick={() => setPlayPref(!autoplayOn)}
                            >
                                {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                            </button>
                            <button
                                type="button"
                                aria-label="Previous events"
                                className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#1e1b4b]/15 text-xl text-[#1e1b4b] transition-colors hover:border-[#4338ca] hover:text-[#4338ca] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]"
                                onClick={() => step(-1)}
                            >
                                <HiArrowLongLeft aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next events"
                                className="grid h-12 w-12 place-items-center rounded-full bg-[#4338ca] text-xl text-white shadow-[0_12px_24px_-10px_rgba(67,56,202,0.8)] transition-colors hover:bg-[#3730a3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338ca]"
                                onClick={() => step(1)}
                            >
                                <HiArrowLongRight aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Upcoming Meetwell events"
                        className="mt-10 sm:mt-12"
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
                        <div
                            ref={viewportRef}
                            role="group"
                            tabIndex={0}
                            aria-label="Event cards, drag or use the left and right arrow keys to browse"
                            className="rounded-[1.75rem] overflow-x-clip focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#4338ca]"
                        >
                            <motion.div
                                ref={trackRef}
                                drag="x"
                                dragConstraints={{ left: -maxOffset, right: 0 }}
                                dragElastic={0.14}
                                dragMomentum={false}
                                style={{ x }}
                                className={cn(
                                    'relative -mx-2.5 flex select-none lg:-mx-3',
                                    dragging ? 'cursor-grabbing' : 'cursor-grab',
                                )}
                                onPointerDownCapture={() => {
                                    moved.current = false
                                    pressedAt.current = performance.now()
                                }}
                                onPointerUp={() => {
                                    // A press can stop a running snap; finish it if no drag followed.
                                    if (!moved.current) settle(activeRef.current)
                                }}
                                onClickCapture={(event) => {
                                    if (moved.current) {
                                        event.preventDefault()
                                        event.stopPropagation()
                                    }
                                }}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                {events.map((item, i) => (
                                    <EventCard
                                        key={item.id}
                                        event={item}
                                        index={i}
                                        isVisible={i >= first && i < last}
                                        rsvp={Boolean(rsvps[item.id])}
                                        onToggle={() => setRsvps((map) => ({ ...map, [item.id]: !map[item.id] }))}
                                        onReveal={() => revealCard(i)}
                                    />
                                ))}
                            </motion.div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <p className="shrink-0 font-mono text-sm tabular-nums text-[#1e1b4b]/55">
                                    <span className="text-[#1e1b4b]">
                                        {pad(first + 1)}
                                        {last - first > 1 ? `–${pad(last)}` : ''}
                                    </span>{' '}
                                    / {pad(total)}
                                </p>
                                <div role="group" aria-label="Choose a position" className="flex min-w-0 flex-wrap items-center">
                                    {Array.from({ length: stopCount }, (_, i) => {
                                        const current = i === active
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                aria-label={`Show from ${events[Math.max(0, Math.min(i, total - perView))].title}`}
                                                aria-current={current ? 'true' : undefined}
                                                className={cn(
                                                    'group grid h-10 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#4338ca]',
                                                    current ? 'w-11' : 'w-7',
                                                )}
                                                onClick={() => settle(i)}
                                            >
                                                <span
                                                    className={cn(
                                                        'relative block h-2 overflow-hidden rounded-full transition-all duration-500',
                                                        current
                                                            ? 'w-8 bg-[#c7d2fe]'
                                                            : 'w-2 bg-[#1e1b4b]/20 group-hover:bg-[#1e1b4b]/45',
                                                    )}
                                                >
                                                    {current && (
                                                        <motion.span
                                                            className="absolute inset-0 origin-left rounded-full bg-[#4338ca]"
                                                            style={{ scaleX: autoplayOn ? progress : 1 }}
                                                        />
                                                    )}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4 sm:justify-end">
                                <p className="flex items-center gap-2 text-sm text-[#1e1b4b]/60">
                                    <PiHandSwipeLeft aria-hidden="true" className="text-lg text-[#4338ca]" />
                                    Drag or swipe
                                </p>
                                <a
                                    href="#meetwell-events"
                                    className="group inline-flex min-h-10 items-center gap-1.5 rounded-full text-sm font-semibold text-[#4338ca] underline decoration-[#a5b4fc] decoration-2 underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4338ca]"
                                >
                                    All 24 events
                                    <HiArrowUpRight
                                        aria-hidden="true"
                                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </a>
                            </div>
                        </div>

                        <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                            Showing events {first + 1}
                            {last - first > 1 ? ` to ${last}` : ''} of {total}: {events[first].title}
                        </p>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default EventCardsSlider

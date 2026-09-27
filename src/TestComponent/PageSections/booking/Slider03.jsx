// ExperienceCardsSlider

// Slider03 · Booking & Reservations › Animated Slider

// Description:
// Saffron Room's "Seven ways to spend an evening." — seven bookable experiences
// (Monsoon Tasting Menu, Chef's Counter, Sommelier's Cellar Pairing, Spice Market
// Brunch, Tandoor Masterclass, Diwali Feast, Midnight Chai & Mithai) arranged on a 3D
// drum that turns to bring one card to the front. A detail panel under the drum shows
// the front card's story, timing, seats and price with a "Reserve this experience"
// link. Use it on a restaurant homepage or an events and private-dining page.

// Design:
// - Burgundy #4a0e1a → #2a0710 gradient section, cream #f6ecd9 cards and text, gold
//   #c9a44c numerals, rules and a soft gold glow behind the drum; serif display, mono
//   labels
// - Drum: cards (210px → sm:250px → lg:290px) sit 34° apart on a cylinder whose radius
//   follows the card width; each card gets rotateY/translateZ/x from one position
//   motion value under a perspective-[1300px] stage; the centre card faces front, two
//   per side turn away and dim, cards further round fade out; a soft floor shadow sits
//   beneath
// - Stage height is fixed (420px → sm:470px → lg:520px) so nothing jumps; the detail
//   panel below is a 2-col grid from md with a min height, controls on the right
// - Motion: spring rotation between cards, live-follow while dragging, detail text
//   swaps with AnimatePresence; reduced motion snaps instantly and disables autoplay

// What it does:
// - State: continuous position (virtual index), the rounded centre, hover/focus/drag
//   flags and a play preference. Autoplay turns one card every 4.5 s via a progress
//   motion value; it pauses on mouse hover, keyboard focus and drag and stops on
//   unmount
// - Drag/swipe the drum (framer-motion pan, touch-action pan-y): distance picks how
//   many cards to turn, a fast flick (> 400 px/s, or < 250 ms and > 24 px) turns one,
//   never against the drag direction; clicking a side card turns to it; ←/→/Home/End
//   keys, the arrow buttons and dots also work
// - The front card is marked aria-current and announced in an aria-live panel; its
//   "Reserve" link (and the panel CTA) point to #saffron-<experience>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ExperienceCardsSlider from '@/TestComponent/PageSections/booking/Slider03';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <ExperienceCardsSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    AnimatePresence,
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useTransform,
} from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 4.5
const SPRING = { type: 'spring', stiffness: 120, damping: 22 }

const experiences = [
    {
        id: 'monsoon',
        title: 'Monsoon Tasting Menu',
        meta: '9 courses · 2 h 30 m',
        when: 'Tue–Sat, 6 pm & 8:45 pm',
        seats: '38 seats',
        price: 128,
        story: 'Nine small plates tracing the Konkan coast in the rains: kokum, mud crab, green jackfruit and slow smoke.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80',
        alt: 'A plated fine-dining course on a set table',
    },
    {
        id: 'counter',
        title: "Chef's Counter",
        meta: '12 seats at the pass',
        when: 'Thu–Sat, 7:30 pm',
        seats: '12 seats',
        price: 185,
        story: 'Front-row seats at the pass with chef Anjali Rao, three off-menu courses and the kitchen playlist.',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=700&q=80',
        alt: 'Chef chopping vegetables on a wooden board',
    },
    {
        id: 'cellar',
        title: "Sommelier's Cellar Pairing",
        meta: '6 wines · add-on',
        when: 'With any tasting menu',
        seats: 'Per guest',
        price: 68,
        story: 'Natural wines from Nashik and the Loire, poured and explained by our sommelier Theo Marsh.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=80',
        alt: 'Two glasses of wine raised in a toast',
    },
    {
        id: 'brunch',
        title: 'Spice Market Brunch',
        meta: 'Courtyard · family style',
        when: 'Sundays, 11 am–3 pm',
        seats: '60 seats',
        price: 64,
        story: 'Chaat, dosa and kulfi carts around the courtyard, with bottomless masala lemonade and live tabla.',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80',
        alt: 'Colourful bowls of fresh ingredients seen from above',
    },
    {
        id: 'tandoor',
        title: 'Tandoor Masterclass',
        meta: '3 hours · lunch included',
        when: 'Saturdays, 10 am',
        seats: '10 places',
        price: 95,
        story: 'Knead, slap and blister naan and kulcha in our clay ovens, then sit down to lunch on what you baked.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
        alt: 'Rustic loaves of freshly baked bread',
    },
    {
        id: 'diwali',
        title: 'Diwali Feast',
        meta: '14 dishes · long table',
        when: 'Sun 8 Nov 2026, 7 pm',
        seats: '80 seats',
        price: 142,
        story: 'One long table, fourteen dishes and two hundred diyas for the festival of lights. Sparklers at dessert.',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=700&q=80',
        alt: 'Friends sharing dishes around a long dinner table',
    },
    {
        id: 'chai',
        title: 'Midnight Chai & Mithai',
        meta: 'Dessert flight · 45 m',
        when: 'Fri–Sat, 10 pm',
        seats: 'Bar & lounge',
        price: 38,
        story: 'A late dessert flight of saffron rasmalai, jalebi and pista kulfi with a cardamom chai tasting.',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80',
        alt: 'A lit candle glowing in a cosy, dim room',
    },
]

const total = experiences.length
const STEP = 34
const HIDE_AT = STEP * 2.6
const wrap = (i) => ((i % total) + total) % total
const pad = (n) => String(n).padStart(2, '0')
const nearest = (i, from) => {
    let delta = wrap(i) - wrap(Math.round(from))
    if (delta > total / 2) delta -= total
    if (delta < -total / 2) delta += total
    return Math.round(from) + delta
}

function DrumCard({ item, index, pos, radius, active, onSelect, moved }) {
    const angle = useTransform(pos, (p) => {
        let d = index - p
        d = ((((d + total / 2) % total) + total) % total) - total / 2
        return d * STEP
    })
    const x = useTransform([angle, radius], ([a, r]) => Math.sin((a * Math.PI) / 180) * r)
    const z = useTransform([angle, radius], ([a, r]) => (Math.cos((a * Math.PI) / 180) - 1) * r)
    const zIndex = useTransform(angle, (a) => Math.round((Math.cos((a * Math.PI) / 180) + 1) * 50))
    const shade = useTransform(angle, (a) => Math.min(0.7, (1 - Math.cos((a * Math.PI) / 180)) * 0.85))
    const opacity = useTransform(angle, (a) => Math.max(0, Math.min(1, (HIDE_AT - Math.abs(a)) / (STEP * 0.6))))
    const pointerEvents = useTransform(angle, (a) => (Math.abs(a) > STEP * 2.2 ? 'none' : 'auto'))

    return (
        <motion.article
            aria-hidden={active ? undefined : true}
            aria-current={active ? 'true' : undefined}
            style={{ x, z, rotateY: angle, zIndex, opacity, pointerEvents, backfaceVisibility: 'hidden' }}
            className="relative col-start-1 row-start-1 w-[210px] overflow-hidden rounded-[1.4rem] bg-[#f6ecd9] text-[#3a0a14] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.65)] sm:w-[250px] lg:w-[290px]"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#2a0710]">
                <img
                    src={item.image}
                    alt={active ? item.alt : ''}
                    loading={index < 2 || index === total - 1 ? undefined : 'lazy'}
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[#4a0e1a]/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a44c] backdrop-blur">
                    No. {pad(index + 1)}
                </span>
            </div>
            <div className="p-4 lg:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a0e1a]/60">{item.meta}</p>
                <h3 className="mt-1.5 min-h-[3.25rem] font-serif text-xl font-normal leading-tight text-[#3a0a14] lg:text-2xl lg:min-h-[4rem]">
                    {item.title}
                </h3>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#4a0e1a]/15 pt-3">
                    <p className="text-sm text-[#3a0a14]">
                        <span className="font-serif text-xl text-[#4a0e1a]">${item.price}</span>
                        <span className="text-xs text-[#3a0a14]/60"> pp</span>
                    </p>
                    <a
                        href={`#saffron-${item.id}`}
                        tabIndex={active ? undefined : -1}
                        draggable={false}
                        className="inline-flex min-h-10 items-center gap-1 rounded-full bg-[#4a0e1a] px-3.5 text-xs font-semibold text-[#f6ecd9] transition-colors hover:bg-[#6b1627] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]"
                        onClickCapture={(event) => {
                            if (moved.current && event.detail > 0) {
                                event.preventDefault()
                                event.stopPropagation()
                            }
                        }}
                    >
                        Reserve
                        <HiArrowUpRight aria-hidden="true" />
                    </a>
                </div>
            </div>
            <motion.div
                aria-hidden="true"
                style={{ opacity: shade }}
                className="pointer-events-none absolute inset-0 bg-[#1a0308]"
            />
            {active ? null : (
                <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`Turn to ${item.title}`}
                    className="absolute inset-0 cursor-pointer"
                    onClick={(event) => {
                        if (moved.current && event.detail > 0) return
                        onSelect(index)
                    }}
                />
            )}
        </motion.article>
    )
}

export function ExperienceCardsSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [center, setCenter] = useState(0)
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const pos = useMotionValue(0)
    const radius = useMotionValue(320)
    const progress = useMotionValue(0)
    const placeholderRef = useRef(null)
    const stageRef = useRef(null)
    const controlsRef = useRef(null)
    const target = useRef(0)
    const panStart = useRef(0)
    const panUnit = useRef(220)
    const panning = useRef(false)
    const moved = useRef(false)
    const downAt = useRef(0)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const activeIndex = wrap(center)
    const active = experiences[activeIndex]

    useMotionValueEvent(pos, 'change', (v) => {
        const r = Math.round(v)
        setCenter((c) => (c === r ? c : r))
    })

    useEffect(() => {
        setHydrated(true)
        const el = placeholderRef.current
        if (!el) return undefined
        const measure = () => {
            const w = el.offsetWidth || 250
            panUnit.current = w * 0.9
            radius.set((w / 2 / Math.tan((STEP * Math.PI) / 360)) * 1.08)
        }
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [radius])

    useEffect(() => {
        const controls = controlsRef
        return () => controls.current?.stop()
    }, [])

    const settle = useCallback(
        (next) => {
            controlsRef.current?.stop()
            target.current = next
            progress.jump(0)
            controlsRef.current = animate(pos, next, reduce ? { duration: 0 } : SPRING)
        },
        [pos, progress, reduce],
    )

    const turn = useCallback((dir) => settle(target.current + dir), [settle])
    const turnTo = (i) => settle(nearest(i, target.current))

    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => turn(1),
        })
        return () => controls.stop()
    }, [playing, center, turn, progress])

    // framer-motion runs onPan before onPanStart, so whichever fires first sets up the drag.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        controlsRef.current?.stop()
        panStart.current = pos.get()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        pos.set(panStart.current - info.offset.x / panUnit.current)
    }

    const handlePanEnd = (_, info) => {
        beginPan()
        panning.current = false
        setDragging(false)
        const base = Math.round(panStart.current)
        const dx = info.offset.x
        const elapsed = performance.now() - downAt.current
        let steps = Math.round(pos.get() - base)
        const flick = Math.abs(info.velocity.x) > 400 || (elapsed < 250 && Math.abs(dx) > 24)
        if (steps === 0 && flick && dx !== 0) steps = dx < 0 ? 1 : -1
        // Never turn against the drag direction, and never more than half the drum.
        if (steps !== 0 && Math.sign(steps) === Math.sign(dx)) steps = 0
        const max = Math.floor((total - 1) / 2)
        settle(base + Math.max(-max, Math.min(max, steps)))
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') turn(1)
        else if (event.key === 'ArrowLeft') turn(-1)
        else if (event.key === 'Home') turnTo(0)
        else if (event.key === 'End') turnTo(total - 1)
        else return
        event.preventDefault()
        setFocused(true)
        // Keep focus on the stage when the focused link belongs to a card that turns away.
        const stage = stageRef.current
        if (stage && stage !== event.target && stage.contains(event.target)) stage.focus({ preventScroll: true })
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

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-linear-to-b from-[#4a0e1a] via-[#3d0b16] to-[#2a0710] px-4 py-14 text-base font-normal text-[#f6ecd9] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[38%] h-[30rem] w-[46rem] max-w-none -translate-x-1/2 rounded-full bg-[#c9a44c]/10 blur-3xl"
            />
            <div className="relative mx-auto max-w-6xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#c9a44c]">
                        Saffron Room · Experiences
                    </p>
                    <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#f6ecd9] sm:text-5xl lg:text-6xl">
                        Seven ways to spend <em className="text-[#c9a44c]">an evening.</em>
                    </h2>
                </div>

                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Saffron Room experiences"
                    className="mt-8 sm:mt-10"
                    onFocus={handleFocus}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
                    }}
                    onPointerEnter={(event) => {
                        if (event.pointerType === 'mouse') setHovered(true)
                    }}
                    onPointerLeave={(event) => {
                        if (event.pointerType === 'mouse') setHovered(false)
                    }}
                >
                    <motion.div
                        ref={stageRef}
                        role="group"
                        tabIndex={0}
                        aria-label="Experience cards, drag or use the left and right arrow keys to turn"
                        className={cn(
                            'relative grid h-[420px] touch-pan-y select-none place-items-center rounded-[2rem] perspective-[1300px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a44c] sm:h-[470px] lg:h-[520px]',
                            dragging ? 'cursor-grabbing' : 'cursor-grab',
                        )}
                        onKeyDown={handleKeyDown}
                        onPointerDownCapture={() => {
                            moved.current = false
                            downAt.current = performance.now()
                        }}
                        onPanStart={beginPan}
                        onPan={handlePan}
                        onPanEnd={handlePanEnd}
                    >
                        <div
                            ref={placeholderRef}
                            aria-hidden="true"
                            className="invisible col-start-1 row-start-1 h-px w-[210px] sm:w-[250px] lg:w-[290px]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-3 left-1/2 h-10 w-[70%] max-w-xl -translate-x-1/2 rounded-[100%] bg-black/45 blur-2xl"
                        />
                        {experiences.map((item, i) => (
                            <DrumCard
                                key={item.id}
                                item={item}
                                index={i}
                                pos={pos}
                                radius={radius}
                                active={i === activeIndex}
                                moved={moved}
                                onSelect={turnTo}
                            />
                        ))}
                    </motion.div>

                    <div className="mt-8 grid gap-6 border-t border-[#c9a44c]/30 pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
                        <div aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="min-h-[9.5rem] sm:min-h-[8rem]">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={active.id}
                                    initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="font-mono text-xs text-[#c9a44c]">
                                        {pad(activeIndex + 1)} / {pad(total)}
                                        <span className="sr-only">: {active.title}</span>
                                    </p>
                                    <p className="mt-2 max-w-2xl text-base leading-7 text-[#f6ecd9]/85">{active.story}</p>
                                    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                                        <div className="flex gap-1.5">
                                            <dt className="text-[#f6ecd9]/50">When</dt>
                                            <dd className="text-[#f6ecd9]">{active.when}</dd>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <dt className="text-[#f6ecd9]/50">Seats</dt>
                                            <dd className="text-[#f6ecd9]">{active.seats}</dd>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <dt className="text-[#f6ecd9]/50">Price</dt>
                                            <dd className="text-[#f6ecd9]">${active.price} per guest</dd>
                                        </div>
                                    </dl>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:flex-col md:items-end">
                            <a
                                href={`#saffron-${active.id}`}
                                className="group inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-[#c9a44c] pl-5 pr-2 text-sm font-semibold text-[#2a0710] transition-colors hover:bg-[#d8b765] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6ecd9]"
                            >
                                Reserve this experience
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2a0710] text-[#c9a44c] transition-transform duration-300 group-hover:rotate-45">
                                    <HiArrowUpRight aria-hidden="true" />
                                </span>
                            </a>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="grid h-11 w-11 place-items-center rounded-full text-lg text-[#f6ecd9]/75 transition-colors hover:bg-[#f6ecd9]/10 hover:text-[#f6ecd9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous experience"
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#c9a44c]/50 text-lg text-[#c9a44c] transition-colors hover:bg-[#c9a44c] hover:text-[#2a0710] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]"
                                    onClick={() => turn(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next experience"
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#c9a44c]/50 text-lg text-[#c9a44c] transition-colors hover:bg-[#c9a44c] hover:text-[#2a0710] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44c]"
                                    onClick={() => turn(1)}
                                >
                                    <HiArrowLongRight aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div role="group" aria-label="Choose an experience" className="mt-6 flex justify-center gap-1">
                        {experiences.map((item, i) => (
                            <button
                                key={item.id}
                                type="button"
                                aria-label={`Show ${item.title}`}
                                aria-current={i === activeIndex ? 'true' : undefined}
                                className="group grid h-10 w-9 place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-[#c9a44c]"
                                onClick={() => turnTo(i)}
                            >
                                <span className="relative block h-1 w-full overflow-hidden rounded-full bg-[#f6ecd9]/20 group-hover:bg-[#f6ecd9]/35">
                                    {i === activeIndex ? (
                                        <motion.span
                                            className="absolute inset-0 origin-left rounded-full bg-[#c9a44c]"
                                            style={{ scaleX: autoplayOn ? progress : 1 }}
                                        />
                                    ) : null}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExperienceCardsSlider

// RoomTourSlider

// Slider02 · Booking & Reservations › Animated Slider

// Description:
// A photo tour of the Grand Aurelia Hotel's "Aurelia Grand Suite": six room photos (the
// bedroom, salon corner, evening light, garden view, living room and rooftop pool)
// crossfade on a large stage with a numbered caption, while a thumbnail filmstrip below
// shows every shot and the autoplay progress. "View fullscreen" opens a lightbox with
// the same controls. Use it on a hotel room-type page, above rates and amenities.

// Design:
// - Ivory #f8f4ec section, navy #14213d text, gold #b08d57 accents and active frames;
//   serif display heading and captions, mono counters and labels
// - lg: 320px info column (specs, animated caption, price + CTA) beside the stage
//   (h-[560px], rounded-[2rem]); below lg the info stacks above/below the stage, which
//   is aspect-[4/3] → sm:aspect-[16/10] so the height never jumps between photos
// - Stage overlays: counter chip bottom-left, round prev/next buttons bottom-right,
//   "View fullscreen" pill top-right; gold hairline frame inset in the photo
// - Filmstrip: 7rem thumbnails in a horizontal snap row that scrolls inside itself (the
//   active one is kept in view without moving the page), gold ring and progress bar on
//   the active thumbnail
// - Motion: crossfade with a gentle 1.06 → 1 settle, the stage follows the drag at 25%;
//   lightbox fades in on a deep navy #0b1224 backdrop; reduced motion = plain fades

// What it does:
// - State: index, hover/focus/drag flags, play preference and lightbox open. Autoplay
//   advances every 5.5 s via a progress motion value (pauses on hover, keyboard focus,
//   drag or while the lightbox is open; off for prefers-reduced-motion until Play)
// - Drag/swipe the stage or the lightbox photo (80 px, a > 500 px/s flick or a < 250 ms
//   swipe over 24 px), ←/→/Home/End on the focused stage, prev/next buttons, thumbnails
// - Lightbox: role="dialog" with Escape to close, ←/→ keys, Tab trapped, body scroll
//   locked, focus returned to the trigger. The active photo is announced via aria-live;
//   "Check availability" links to #aurelia-grand-suite

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RoomTourSlider from '@/TestComponent/PageSections/booking/Slider02';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <RoomTourSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import {
    HiArrowLongRight,
    HiArrowsPointingOut,
    HiChevronLeft,
    HiChevronRight,
    HiMiniPause,
    HiMiniPlay,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 5.5
const EASE = [0.22, 1, 0.36, 1]

const photos = [
    {
        id: 'bedroom',
        title: 'The bedroom',
        text: 'A hand-tufted headboard, Frette linen and blackout drapes that close with one switch.',
        src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
        alt: 'Suite bedroom with a tufted headboard, crisp white linen and bedside lamps',
    },
    {
        id: 'salon',
        title: 'Salon corner',
        text: 'A velvet sofa and writing desk by the tall windows, set apart from the bed.',
        src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
        alt: 'Classic suite with a sofa and armchair in front of the bed',
    },
    {
        id: 'evening',
        title: 'Evening light',
        text: 'Walnut panelling and warm dimmers turn the suite golden after sunset.',
        src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
        alt: 'Warm, dark-wood hotel suite lit by lamps in the evening',
    },
    {
        id: 'garden',
        title: 'Garden view',
        text: 'Wake to the cypress garden and the old dome through floor-to-ceiling glass.',
        src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        alt: 'Bedroom with a wooden bed facing a large window with a green view',
    },
    {
        id: 'living',
        title: 'Living room',
        text: 'Twenty square metres for breakfast in, a record player and a stocked bar cart.',
        src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        alt: 'Bright open-plan living room with sofas and large windows',
    },
    {
        id: 'pool',
        title: 'Rooftop pool',
        text: 'Suite guests have evening access to the heated rooftop pool until midnight.',
        src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        alt: 'Lit infinity pool at night looking out over the sea',
    },
]

const img = (src, w) => `${src}?auto=format&fit=crop&w=${w}&q=80`
const total = photos.length
const wrap = (i) => ((i % total) + total) % total
const pad = (n) => String(n).padStart(2, '0')

export function RoomTourSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const [index, setIndex] = useState(0)
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [lightbox, setLightbox] = useState(false)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dragX = useMotionValue(0)
    const stageRef = useRef(null)
    const stripRef = useRef(null)
    const triggerRef = useRef(null)
    const dialogRef = useRef(null)
    const panning = useRef(false)
    const moved = useRef(false)
    const downAt = useRef(0)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging && !lightbox
    const photo = photos[index]

    const goTo = useCallback(
        (target) => {
            progress.jump(0)
            setIndex(wrap(target))
        },
        [progress],
    )
    const paginate = useCallback(
        (dir) => {
            progress.jump(0)
            setIndex((i) => wrap(i + dir))
        },
        [progress],
    )

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

    // Keep the active thumbnail in view by scrolling the filmstrip only (never the page).
    useEffect(() => {
        const strip = stripRef.current
        const thumb = strip?.children[index]
        if (!strip || !thumb) return
        const stripBox = strip.getBoundingClientRect()
        const thumbBox = thumb.getBoundingClientRect()
        const left = strip.scrollLeft + thumbBox.left - stripBox.left - (stripBox.width - thumbBox.width) / 2
        strip.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' })
    }, [index, reduce])

    useEffect(() => {
        const preload = new window.Image()
        preload.src = img(photos[wrap(index + 1)].src, 1400)
    }, [index])

    useEffect(() => {
        if (!lightbox) return undefined
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        dialogRef.current?.querySelector('button')?.focus()
        return () => {
            document.body.style.overflow = previous
        }
    }, [lightbox])

    const closeLightbox = () => {
        setLightbox(false)
        triggerRef.current?.focus({ preventScroll: true })
    }

    // framer-motion runs onPan before onPanStart, so whichever fires first sets up the drag.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        dragX.stop()
        setDragging(true)
    }

    const panHandlers = (factor) => ({
        onPointerDownCapture: () => {
            moved.current = false
            downAt.current = performance.now()
        },
        // A pointer click that ends a drag must not also press a button under the pointer
        // (keyboard clicks have detail 0 and always pass).
        onClickCapture: (event) => {
            if (moved.current && event.detail > 0) {
                event.preventDefault()
                event.stopPropagation()
            }
        },
        onPanStart: beginPan,
        onPan: (_, info) => {
            beginPan()
            dragX.set(info.offset.x * factor)
        },
        onPanEnd: (_, info) => {
            beginPan()
            panning.current = false
            setDragging(false)
            const dx = info.offset.x
            const elapsed = performance.now() - downAt.current
            let dir = 0
            if (Math.abs(dx) > 80) dir = dx < 0 ? 1 : -1
            else if (Math.abs(info.velocity.x) > 500 && Math.sign(info.velocity.x) === Math.sign(dx)) dir = dx < 0 ? 1 : -1
            else if (elapsed < 250 && Math.abs(dx) > 24) dir = dx < 0 ? 1 : -1
            if (dir) paginate(dir)
            animate(dragX, 0, reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 })
        },
    })

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(total - 1)
        else return
        event.preventDefault()
        setFocused(true)
    }

    const handleDialogKeys = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault()
            closeLightbox()
        } else if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Tab' && dialogRef.current) {
            const items = [...dialogRef.current.querySelectorAll('button')]
            const first = items[0]
            const last = items[items.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }
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

    const fade = {
        initial: reduce ? { opacity: 0, zIndex: 1 } : { opacity: 0, scale: 1.06, zIndex: 1 },
        animate: {
            opacity: 1,
            scale: 1,
            zIndex: 1,
            transition: { opacity: { duration: 0.7 }, scale: { duration: 1.4, ease: EASE } },
        },
        // The outgoing photo stays opaque underneath until the new one has faded in.
        exit: { opacity: 0, zIndex: 0, transition: { opacity: { duration: 0.3, delay: 0.6 } } },
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f8f4ec] px-4 py-14 text-base font-normal text-[#14213d] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <div
                role="region"
                aria-roledescription="carousel"
                aria-label="Aurelia Grand Suite photo tour"
                className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12"
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
                <div className="flex flex-col lg:py-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#b08d57]">
                        Grand Aurelia Hotel · Room tour
                    </p>
                    <h2 className="mt-3 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#14213d] sm:text-5xl">
                        The Aurelia <em className="text-[#b08d57]">Grand Suite</em>
                    </h2>
                    <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-[#14213d]/10 py-4 text-sm text-[#14213d]/80">
                        <li>68 m² · 4th floor</li>
                        <li>King bed · sofa bed</li>
                        <li>Dome & garden view</li>
                        <li>Sleeps 3</li>
                    </ul>

                    <div className="mt-6 hidden min-h-[11rem] lg:block">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                                transition={{ duration: 0.35 }}
                            >
                                <p className="font-mono text-sm text-[#b08d57]">
                                    {pad(index + 1)} <span className="text-[#14213d]/35">/ {pad(total)}</span>
                                </p>
                                <h3 className="mt-2 font-serif text-3xl font-normal italic text-[#14213d]">{photo.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-[#14213d]/70">{photo.text}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-auto hidden items-end justify-between gap-4 pt-6 lg:flex">
                        <p className="text-sm text-[#14213d]/60">
                            From
                            <span className="block font-serif text-3xl text-[#14213d]">$1,140</span>
                            per night
                        </p>
                        <a
                            href="#aurelia-grand-suite"
                            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#14213d] px-5 text-sm font-semibold text-[#f8f4ec] transition-colors hover:bg-[#23355e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                        >
                            Check availability
                            <HiArrowLongRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>

                <div className="min-w-0">
                    <motion.div
                        ref={stageRef}
                        role="group"
                        tabIndex={0}
                        aria-label="Suite photos, drag or use the left and right arrow keys to browse"
                        className={cn(
                            'relative aspect-[4/3] touch-pan-y select-none overflow-hidden rounded-[1.5rem] bg-[#e7ddc9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b08d57] sm:aspect-[16/10] lg:aspect-auto lg:h-[560px] lg:rounded-[2rem]',
                            dragging ? 'cursor-grabbing' : 'cursor-grab',
                        )}
                        onKeyDown={handleKeyDown}
                        {...panHandlers(0.25)}
                    >
                        <motion.div style={{ x: dragX }} className="absolute -inset-x-[6%] inset-y-0 z-0">
                            <AnimatePresence initial={false}>
                                <motion.img
                                    key={photo.id}
                                    src={img(photo.src, 1400)}
                                    alt={photo.alt}
                                    draggable={false}
                                    variants={fade}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            </AnimatePresence>
                        </motion.div>
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-3 rounded-[1.1rem] border border-[#f8f4ec]/40 sm:inset-4 lg:inset-5 lg:rounded-[1.5rem]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#14213d]/55 to-transparent"
                        />

                        <button
                            ref={triggerRef}
                            type="button"
                            aria-haspopup="dialog"
                            className="absolute right-4 top-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#f8f4ec]/90 px-4 text-xs font-semibold text-[#14213d] backdrop-blur transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57] sm:right-6 sm:top-6"
                            onClick={() => setLightbox(true)}
                        >
                            <HiArrowsPointingOut aria-hidden="true" className="h-4 w-4" />
                            <span>
                                View fullscreen<span className="sr-only">: {photo.title}</span>
                            </span>
                        </button>

                        <p
                            aria-hidden="true"
                            className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-[#14213d]/70 px-3 py-1.5 font-mono text-xs text-[#f8f4ec] backdrop-blur sm:bottom-6 sm:left-6"
                        >
                            <span className="text-[#d9b779]">{pad(index + 1)}</span>/ {pad(total)}
                            <span className="hidden font-sans sm:inline">· {photo.title}</span>
                        </p>

                        <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-5 sm:right-5">
                            <button
                                type="button"
                                aria-label="Previous photo"
                                className="grid h-11 w-11 place-items-center rounded-full bg-[#f8f4ec]/90 text-lg text-[#14213d] backdrop-blur transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                                onClick={() => paginate(-1)}
                            >
                                <HiChevronLeft aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next photo"
                                className="grid h-11 w-11 place-items-center rounded-full bg-[#b08d57] text-lg text-[#14213d] transition-colors hover:bg-[#c7a36a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213d]"
                                onClick={() => paginate(1)}
                            >
                                <HiChevronRight aria-hidden="true" />
                            </button>
                        </div>
                    </motion.div>

                    <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                        Photo {index + 1} of {total}: {photo.title}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                        <button
                            type="button"
                            aria-label={autoplayOn ? 'Pause slideshow' : 'Play slideshow'}
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#14213d]/15 text-lg text-[#14213d] transition-colors hover:border-[#b08d57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                            onClick={() => setPlayPref(!autoplayOn)}
                        >
                            {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                        </button>
                        <div
                            ref={stripRef}
                            role="group"
                            aria-label="Choose a photo"
                            className="flex min-w-0 flex-1 snap-x gap-2.5 overflow-x-auto scroll-px-1 px-1 py-1.5 [scrollbar-width:none] sm:gap-3"
                        >
                            {photos.map((p, i) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    aria-label={`Show photo ${i + 1}: ${p.title}`}
                                    aria-current={i === index ? 'true' : undefined}
                                    className={cn(
                                        'group relative h-[4.5rem] w-28 shrink-0 snap-start overflow-hidden rounded-xl transition-[box-shadow,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213d] sm:h-20 sm:w-32',
                                        i === index ? 'ring-2 ring-[#b08d57] ring-offset-2 ring-offset-[#f8f4ec]' : 'opacity-60 hover:opacity-100',
                                    )}
                                    onClick={() => goTo(i)}
                                >
                                    <img
                                        src={img(p.src, 400)}
                                        alt=""
                                        loading="lazy"
                                        draggable={false}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                                    />
                                    <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#14213d]/80 to-transparent px-2 pb-1.5 pt-4 text-left text-[10px] font-semibold text-[#f8f4ec]">
                                        {p.title}
                                    </span>
                                    {i === index ? (
                                        <motion.span
                                            aria-hidden="true"
                                            className="absolute inset-x-0 top-0 h-[3px] origin-left bg-[#d9b779]"
                                            style={{ scaleX: autoplayOn ? progress : 1 }}
                                        />
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 min-h-[8.5rem] lg:hidden">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="font-serif text-2xl font-normal italic text-[#14213d]">{photo.title}</h3>
                                <p className="mt-1.5 text-sm leading-6 text-[#14213d]/70">{photo.text}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#14213d]/10 pt-5 lg:hidden">
                        <p className="text-sm text-[#14213d]/60">
                            From <span className="font-serif text-2xl text-[#14213d]">$1,140</span> / night
                        </p>
                        <a
                            href="#aurelia-grand-suite"
                            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#14213d] px-5 text-sm font-semibold text-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                        >
                            Check availability
                            <HiArrowLongRight aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {lightbox ? (
                    <motion.div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`${uid}-lb-title`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] flex flex-col bg-[#0b1224]/95 text-[#f8f4ec] backdrop-blur-sm"
                        onKeyDown={handleDialogKeys}
                    >
                        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
                            <p id={`${uid}-lb-title`} className="min-w-0 truncate text-sm">
                                <span className="font-mono text-[#d9b779]">
                                    {pad(index + 1)} / {pad(total)}
                                </span>{' '}
                                · Aurelia Grand Suite · {photo.title}
                            </p>
                            <button
                                type="button"
                                aria-label="Close fullscreen"
                                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-xl transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#d9b779]"
                                onClick={closeLightbox}
                            >
                                <HiXMark aria-hidden="true" />
                            </button>
                        </div>
                        <motion.div
                            className="relative min-h-0 flex-1 touch-pan-y select-none px-4 sm:px-20"
                            {...panHandlers(0.4)}
                        >
                            <motion.div style={{ x: dragX }} className="relative z-0 h-full w-full">
                                <AnimatePresence initial={false}>
                                    <motion.img
                                        key={photo.id}
                                        src={img(photo.src, 1600)}
                                        alt={photo.alt}
                                        draggable={false}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.45 }}
                                        className="absolute inset-0 h-full w-full object-contain"
                                    />
                                </AnimatePresence>
                            </motion.div>
                            <button
                                type="button"
                                aria-label="Previous photo"
                                className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#d9b779] sm:left-5"
                                onClick={() => paginate(-1)}
                            >
                                <HiChevronLeft aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next photo"
                                className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#d9b779] sm:right-5"
                                onClick={() => paginate(1)}
                            >
                                <HiChevronRight aria-hidden="true" />
                            </button>
                        </motion.div>
                        <div className="flex justify-center gap-2 px-4 py-5">
                            {photos.map((p, i) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    aria-label={`Show photo ${i + 1}: ${p.title}`}
                                    aria-current={i === index ? 'true' : undefined}
                                    className="grid h-10 w-8 place-items-center rounded focus-visible:outline-2 focus-visible:outline-[#d9b779]"
                                    onClick={() => goTo(i)}
                                >
                                    <span
                                        className={cn(
                                            'block h-1.5 rounded-full transition-all',
                                            i === index ? 'w-6 bg-[#d9b779]' : 'w-1.5 bg-white/35',
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </section>
    )
}

export default RoomTourSlider

// VideoReelSlider

// Slider03 · Blogs & Digital Media › Animated Slider

// Description:
// "Reels of the week" strip for the short-video platform Reelhouse, headed "Reels that
// stopped the scroll." Eight tall 9:16 video posters (e.g. "Tokyo after the rain" by
// @nightwalker.jp, 0:48, 1.2M views) sit in a horizontal snap slider; each has a play
// overlay, category chip and duration, and the centred reel scales up, gets a magenta
// ring and reveals its title plus a play/pause preview with a running scrubber. Use it on
// a media homepage, creator hub or newsletter landing page to surface short videos.

// Design:
// - Near-black #111111 page, white #fafafa type, hot magenta #ff2d78 for the ring, play
//   button, dots and highlights; card base #1c1c1c; zinc greys for meta; a blurred
//   magenta glow behind the centre and film-sprocket rows above and below the track.
// - Cards are aspect-[9/16], rounded-[1.4rem], w-[11.5rem] → sm:w-[13.5rem] →
//   lg:w-[15.5rem] (CSS variables); neighbours sit at 0.84 scale and are shaded; the
//   strip bleeds to the viewport edge and is clipped by the root's overflow-hidden.
// - Type: extra-bold tight sans heading text-[2.35rem] → sm:text-6xl → lg:text-[4.5rem];
//   mono chips, counter and timecodes; 64px magenta play button with a pulse ring.
// - Motion: one continuous position value drives every card's x, scale, shade, play
//   button size and title reveal (useTransform); it springs to the snapped card and
//   follows the pointer live while dragging, with rubber-banding at both ends. A slow
//   poster zoom runs while a preview plays. Reduced motion jumps instead of springing.
// - Controls: header row (logo, heading, hint, link) stacks on mobile and splits from md;
//   bottom row has counter + title, prev / dots / next and an autoplay toggle, wrapping on
//   small screens.

// What it does:
// - State: target reel (position), the live centred reel, hover/focus/drag flags, a
//   play/pause preference and a previewing flag. Autoplay fills the active dot over 5 s
//   (framer-motion animate()) and moves to the next reel, wrapping at the end.
// - Autoplay pauses on mouse hover, keyboard focus inside the slider, while dragging and
//   while a preview plays; it is off for prefers-reduced-motion unless Play is pressed.
// - Drag/swipe with mouse or touch (left = next, right = previous; distance picks the
//   reel, a quick flick moves one), click a side reel to centre it, ←/→/Home/End while
//   focused, prev/next buttons or dots. A click that ends a drag is ignored.
// - The play button runs a simulated preview: the scrubber and "0:12 / 0:48" timecode run
//   for the reel's length, then stop; changing reel resets it. "All reels" → #reelhouse-reels.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VideoReelSlider from '@/TestComponent/PageSections/media/Slider03';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <VideoReelSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    MotionConfig,
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useTransform,
} from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { PiEyeBold, PiHandSwipeLeft, PiPauseFill, PiPlayFill } from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 5
const spring = { type: 'spring', stiffness: 190, damping: 28, mass: 0.9 }

const reels = [
    {
        id: 'tokyo-after-rain',
        title: 'Tokyo after the rain',
        creator: '@nightwalker.jp',
        seconds: 48,
        views: '1.2M',
        tag: 'Travel',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        alt: 'Neon-lit Tokyo street at night lined with glowing shop signs',
    },
    {
        id: 'main-stage',
        title: 'One take on the main stage',
        creator: '@stagedoor',
        seconds: 59,
        views: '842K',
        tag: 'Live music',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
        alt: 'Performer on a smoky stage lit from behind',
    },
    {
        id: 'arcade-restore',
        title: 'Restoring a 1984 arcade cabinet',
        creator: '@pixelgarage',
        seconds: 52,
        views: '390K',
        tag: 'Retro tech',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        alt: 'Retro computers and screens glowing under pink neon light',
    },
    {
        id: 'front-row',
        title: 'Front row, festival night',
        creator: '@festfolk',
        seconds: 29,
        views: '2.4M',
        tag: 'Festival',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        alt: 'Festival crowd silhouetted against bright coloured stage lights',
    },
    {
        id: 'blue-hour-portraits',
        title: 'Portraits in blue light',
        creator: '@lenslocal',
        seconds: 34,
        views: '677K',
        tag: 'Portrait',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        alt: 'Close portrait of a woman lit by cool blue light',
    },
    {
        id: 'kitchen-rush',
        title: 'Kitchen rush, 9 p.m.',
        creator: '@linecook',
        seconds: 44,
        views: '1.8M',
        tag: 'Food',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
        alt: 'Chef chopping vegetables on a board in a busy kitchen',
    },
    {
        id: 'summit-shot',
        title: 'How I got the summit shot',
        creator: '@mara.frames',
        seconds: 57,
        views: '516K',
        tag: 'Behind the lens',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
        alt: 'Photographer with a camera standing on a mountain top',
    },
    {
        id: 'tape-session',
        title: 'Late-night tape session',
        creator: '@tapeandtone',
        seconds: 41,
        views: '203K',
        tag: 'Studio',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
        alt: 'Recording studio with guitars hanging on the wall',
    },
]

const total = reels.length
const last = total - 1
const pad = (n) => String(n).padStart(2, '0')
const clock = (s) => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`
const clamp = (n) => Math.max(0, Math.min(last, n))

function ReelCard({ reel, i, pos, isActive, previewing, previewProgress, previewTime, reduce, onSelect, onTogglePreview }) {
    const distance = useTransform(pos, (p) => i - p)
    const x = useTransform(
        distance,
        (d) => `calc(${d.toFixed(4)} * (var(--reel-w) * 0.9 + var(--reel-gap)) - 50%)`,
    )
    const scale = useTransform(distance, (d) => 1 - Math.min(Math.abs(d), 1) * 0.16)
    const zIndex = useTransform(distance, (d) => 40 - Math.round(Math.abs(d) * 4))
    const shade = useTransform(distance, (d) => Math.min(Math.abs(d), 1.6) * 0.42)
    const playScale = useTransform(distance, (d) => 1 - Math.min(Math.abs(d), 1) * 0.42)
    const titleOpacity = useTransform(distance, (d) => Math.max(0, 1 - Math.abs(d) * 2.4))
    const titleY = useTransform(distance, (d) => Math.min(Math.abs(d), 1) * 18)
    const duration = clock(reel.seconds)

    return (
        <motion.div
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}: ${reel.title} by ${reel.creator}, ${duration}`}
            aria-current={isActive ? 'true' : undefined}
            aria-hidden={isActive ? undefined : true}
            style={{ x, scale, zIndex }}
            className={cn(
                'absolute left-1/2 top-0 aspect-[9/16] w-(--reel-w)',
                isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
            )}
            onClick={() => onSelect(i)}
        >
            <div
                className={cn(
                    'relative h-full w-full overflow-hidden rounded-[1.4rem] bg-[#1c1c1c] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] transition-shadow duration-500',
                    isActive ? 'ring-2 ring-[#ff2d78] ring-offset-4 ring-offset-[#111111]' : 'ring-1 ring-white/10',
                )}
            >
                <motion.img
                    src={reel.image}
                    alt={reel.alt}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    draggable={false}
                    animate={{ scale: previewing && !reduce ? 1.14 : 1 }}
                    transition={previewing ? { duration: reel.seconds, ease: 'linear' } : { duration: 0.6, ease: 'easeOut' }}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/0 via-45% to-black/90" />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                    <span className="truncate rounded-full bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                        {reel.tag}
                    </span>
                    <span
                        className={cn(
                            'shrink-0 rounded-full px-2 py-1 font-mono text-[10px] tabular-nums',
                            isActive ? 'bg-[#ff2d78] text-white' : 'bg-black/45 text-white/90 backdrop-blur-sm',
                        )}
                    >
                        {isActive ? (
                            <>
                                <motion.span>{previewTime}</motion.span> / {duration}
                            </>
                        ) : (
                            duration
                        )}
                    </span>
                </div>

                <div className="absolute inset-0 grid place-items-center">
                    <motion.div style={{ scale: playScale }} className="relative">
                        {isActive && !previewing && !reduce && (
                            <motion.span
                                aria-hidden="true"
                                className="absolute inset-0 rounded-full bg-[#ff2d78]"
                                animate={{ scale: [1, 1.6], opacity: [0.55, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                            />
                        )}
                        <button
                            type="button"
                            tabIndex={isActive ? 0 : -1}
                            aria-label={previewing ? `Pause preview of ${reel.title}` : `Play preview of ${reel.title}`}
                            className={cn(
                                'relative grid h-16 w-16 place-items-center rounded-full text-2xl text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
                                isActive
                                    ? 'bg-[#ff2d78] shadow-[0_12px_30px_-6px_rgba(255,45,120,0.7)] hover:bg-[#ff4d8f]'
                                    : 'pointer-events-none bg-white/20 backdrop-blur-sm',
                            )}
                            onClick={(event) => {
                                event.stopPropagation()
                                onTogglePreview(i)
                            }}
                        >
                            {previewing ? (
                                <PiPauseFill aria-hidden="true" />
                            ) : (
                                <PiPlayFill aria-hidden="true" className="translate-x-[2px]" />
                            )}
                        </button>
                    </motion.div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                    <motion.div style={{ opacity: titleOpacity, y: titleY }}>
                        <h3 className="text-lg font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-xl">
                            {reel.title}
                        </h3>
                    </motion.div>
                    <p className="mt-1.5 flex items-center justify-between gap-2 text-xs text-white/75">
                        <span className="truncate font-semibold">{reel.creator}</span>
                        <span className="flex shrink-0 items-center gap-1 font-mono tabular-nums">
                            <PiEyeBold aria-hidden="true" />
                            {reel.views}
                        </span>
                    </p>
                    <span className="mt-3 block h-1 overflow-hidden rounded-full bg-white/20">
                        <motion.span
                            className="block h-full origin-left rounded-full bg-[#ff2d78]"
                            style={{ scaleX: isActive ? previewProgress : 0 }}
                        />
                    </span>
                </div>

                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#111111]"
                    style={{ opacity: shade }}
                />
            </div>
        </motion.div>
    )
}

export function VideoReelSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [position, setPosition] = useState(0)
    const [center, setCenter] = useState(0)
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [previewing, setPreviewing] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const pos = useMotionValue(0)
    const progress = useMotionValue(0)
    const previewProgress = useMotionValue(0)
    const previewTime = useTransform(previewProgress, (v) => clock(v * reels[position].seconds))
    const controlsRef = useRef(null)
    const rulerRef = useRef(null)
    const panStart = useRef(0)
    const panUnit = useRef(1)
    const panning = useRef(false)
    const moved = useRef(false)
    const panAt = useRef(0)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging && !previewing
    const active = reels[center]

    useMotionValueEvent(pos, 'change', (latest) => setCenter(clamp(Math.round(latest))))

    const settle = useCallback(
        (target) => {
            const next = clamp(target)
            if (controlsRef.current) controlsRef.current.stop()
            progress.jump(0)
            previewProgress.jump(0)
            setPreviewing(false)
            setPosition(next)
            controlsRef.current = animate(pos, next, reduce ? { duration: 0 } : spring)
        },
        [pos, progress, previewProgress, reduce],
    )

    const step = useCallback((dir) => settle((position + dir + total) % total), [position, settle])

    useEffect(() => {
        setHydrated(true)
        const controls = controlsRef
        return () => {
            if (controls.current) controls.current.stop()
        }
    }, [])

    // Autoplay: fill the active dot 0 → 1, then move to the next reel.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => step(1),
        })
        return () => controls.stop()
    }, [playing, progress, step])

    // Simulated preview: run the scrubber for the reel's length, then stop.
    useEffect(() => {
        if (!previewing) return undefined
        if (previewProgress.get() >= 1) previewProgress.jump(0)
        const controls = animate(previewProgress, 1, {
            duration: reels[position].seconds * (1 - previewProgress.get()),
            ease: 'linear',
            onComplete: () => setPreviewing(false),
        })
        return () => controls.stop()
    }, [previewing, position, previewProgress])

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') step(1)
        else if (event.key === 'ArrowLeft') step(-1)
        else if (event.key === 'Home') settle(0)
        else if (event.key === 'End') settle(last)
        else return
        event.preventDefault()
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

    // framer-motion calls onPan synchronously but defers onPanStart to the next frame,
    // so whichever handler runs first captures the start position and pixel scale.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        panAt.current = performance.now()
        if (controlsRef.current) controlsRef.current.stop()
        panStart.current = pos.get()
        panUnit.current = (rulerRef.current ? rulerRef.current.offsetWidth : 0) || 180
        setDragging(true)
        setPreviewing(false)
    }

    const handlePan = (_, info) => {
        beginPan()
        let next = panStart.current - info.offset.x / panUnit.current
        if (next < 0) next *= 0.3
        else if (next > last) next = last + (next - last) * 0.3
        pos.set(next)
    }

    const handlePanEnd = (_, info) => {
        beginPan()
        panning.current = false
        setDragging(false)
        const base = Math.round(panStart.current)
        let target = Math.round(pos.get())
        // A quick flick moves one reel; never move against the drag direction. Pan velocity
        // reads low when the frame loop was idle, so a short, quick swipe (< 250 ms, > 24 px)
        // also counts as a flick.
        const flick = performance.now() - panAt.current < 250 && Math.abs(info.offset.x) > 24
        if (target === base && flick) target = base + (info.offset.x < 0 ? 1 : -1)
        else if (target === base && Math.abs(info.offset.x) > 8 && Math.abs(info.velocity.x) > 350) {
            target = base + (info.velocity.x < 0 ? 1 : -1)
        }
        if (target !== base && Math.sign(target - base) === Math.sign(info.offset.x)) target = base
        settle(target)
    }

    const handleSelect = (i) => {
        if (moved.current || i === position) return
        settle(i)
    }

    const handleTogglePreview = (i) => {
        if (moved.current) return
        if (i !== position) {
            settle(i)
            return
        }
        setPreviewing((value) => !value)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#111111] px-4 py-14 text-base font-normal text-[#fafafa] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="flex items-center gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="grid h-9 w-9 place-items-center rounded-[0.7rem] bg-[#ff2d78] text-base text-white"
                                    >
                                        <PiPlayFill className="translate-x-px" />
                                    </span>
                                    <span className="text-xl font-extrabold lowercase tracking-[-0.04em] text-white">
                                        reelhouse
                                    </span>
                                </span>
                                <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/65">
                                    Reels of the week · Wk 39
                                </span>
                            </div>
                            <h2 className="mt-5 max-w-2xl text-[2.35rem] font-extrabold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.5rem]">
                                Reels that stopped the <span className="text-[#ff2d78]">scroll.</span>
                            </h2>
                            <p className="mt-4 max-w-md text-base leading-7 text-white/65">
                                Eight under-a-minute films from the Reelhouse community, picked by our editors every
                                Friday.
                            </p>
                        </div>
                        <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                            <p className="flex items-center gap-2 text-sm text-white/65">
                                <PiHandSwipeLeft aria-hidden="true" className="text-lg text-[#ff2d78]" />
                                Drag, swipe or use ← →
                            </p>
                            <a
                                href="#reelhouse-reels"
                                className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white hover:text-[#ff2d78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2d78]"
                            >
                                All reels
                                <HiArrowRight
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </a>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Reelhouse reels of the week"
                        className="mt-10 sm:mt-14"
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
                            aria-hidden="true"
                            className="-mx-[50vw] h-2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.09)_0_14px,transparent_14px_30px)]"
                        />
                        <motion.div
                            role="group"
                            tabIndex={0}
                            aria-label="Reels, drag or use the left and right arrow keys to browse"
                            className={cn(
                                'relative my-6 touch-pan-y select-none rounded-[1.6rem] [--reel-gap:0.75rem] [--reel-w:11.5rem] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#ff2d78] sm:my-8 sm:[--reel-gap:1rem] sm:[--reel-w:13.5rem] lg:[--reel-gap:1.25rem] lg:[--reel-w:15.5rem]',
                                dragging ? 'cursor-grabbing' : 'cursor-grab',
                            )}
                            onPointerDownCapture={() => {
                                moved.current = false
                            }}
                            onClickCapture={(event) => {
                                // Swallow only the click that ends a drag.
                                if (moved.current) {
                                    moved.current = false
                                    event.preventDefault()
                                    event.stopPropagation()
                                }
                            }}
                            onKeyDownCapture={() => {
                                moved.current = false
                            }}
                            onPanStart={beginPan}
                            onPan={handlePan}
                            onPanEnd={handlePanEnd}
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff2d78]/25 blur-3xl sm:w-[40%] lg:w-[26%]"
                            />
                            <div aria-hidden="true" className="invisible mx-auto aspect-[9/16] w-(--reel-w)" />
                            <div
                                ref={rulerRef}
                                aria-hidden="true"
                                className="invisible absolute left-0 top-0 h-0 w-[calc(var(--reel-w)_*_0.9_+_var(--reel-gap))]"
                            />
                            {reels.map((reel, i) => (
                                <ReelCard
                                    key={reel.id}
                                    reel={reel}
                                    i={i}
                                    pos={pos}
                                    isActive={i === center}
                                    previewing={previewing && i === center}
                                    previewProgress={previewProgress}
                                    previewTime={previewTime}
                                    reduce={reduce}
                                    onSelect={handleSelect}
                                    onTogglePreview={handleTogglePreview}
                                />
                            ))}
                        </motion.div>
                        <div
                            aria-hidden="true"
                            className="-mx-[50vw] h-2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.09)_0_14px,transparent_14px_30px)]"
                        />

                        <div className="mt-8 grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                            <div className="flex min-w-0 items-baseline gap-3">
                                <span className="shrink-0 font-mono text-2xl font-bold tabular-nums text-[#ff2d78]">
                                    {pad(center + 1)}
                                </span>
                                <span className="shrink-0 whitespace-nowrap font-mono text-sm text-white/40">/ {pad(total)}</span>
                                <p
                                    aria-live={playing ? 'off' : 'polite'}
                                    aria-atomic="true"
                                    className="min-w-0 truncate text-sm text-white/75"
                                >
                                    <span className="sr-only">
                                        Reel {center + 1} of {total}:{' '}
                                    </span>
                                    {active.title}
                                    <span className="text-white/40"> · {active.creator}</span>
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    aria-label="Previous reel"
                                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-lg transition-colors hover:border-[#ff2d78] hover:bg-[#ff2d78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2d78]"
                                    onClick={() => step(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <div role="group" aria-label="Choose a reel" className="flex items-center">
                                    {reels.map((reel, i) => (
                                        <button
                                            key={reel.id}
                                            type="button"
                                            aria-label={`Show ${reel.title}`}
                                            aria-current={i === center ? 'true' : undefined}
                                            className="group grid h-10 w-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#ff2d78] sm:w-7"
                                            onClick={() => settle(i)}
                                        >
                                            <span
                                                className={cn(
                                                    'relative block h-1.5 overflow-hidden rounded-full transition-all duration-500',
                                                    i === center ? 'w-5 bg-white/20 sm:w-6' : 'w-1.5 bg-white/35 group-hover:bg-white/70',
                                                )}
                                            >
                                                {i === center && (
                                                    <motion.span
                                                        className="absolute inset-0 origin-left rounded-full bg-[#ff2d78]"
                                                        style={{ scaleX: autoplayOn && !previewing ? progress : 1 }}
                                                    />
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    aria-label="Next reel"
                                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-lg transition-colors hover:border-[#ff2d78] hover:bg-[#ff2d78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2d78]"
                                    onClick={() => step(1)}
                                >
                                    <HiArrowLongRight aria-hidden="true" />
                                </button>
                            </div>

                            <div className="flex justify-center md:justify-end">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2d78]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? (
                                        <HiMiniPause aria-hidden="true" className="text-base" />
                                    ) : (
                                        <HiMiniPlay aria-hidden="true" className="text-base" />
                                    )}
                                    Autoplay {autoplayOn ? 'on' : 'off'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default VideoReelSlider

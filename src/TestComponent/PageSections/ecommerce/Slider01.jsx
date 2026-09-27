// AutoplayHeroProductSlider

// Slider01 · E-commerce & Marketplaces › Animated Slider

// Description:
// Full-width hero carousel for Solstice Store's "Midsummer Edit": four campaign slides
// (Golden Hour tracksuits, Sunwear, Equinox outerwear and the "Solstice Weekend" sale),
// each with a photo, split sans/serif headline such as "Golden hour, all day long.", a
// round price sticker and a CTA like "Shop the sets". Use it at the top of a storefront
// or campaign landing page to rotate between the season's key edits.

// Design:
// - Stage is aspect-[4/5] on mobile → sm:aspect-[4/3] → lg:h-[560px], rounded; a
//   full-bleed image with a bottom (mobile) / left (lg) black gradient and text over it.
// - Warm night #140f0b background, cream #fbf4ea text; each slide has its own accent
//   (#ffb547, #ff6b4a, #9cc0ff, #f6e05e) for the eyebrow bar, sticker, CTA and progress.
// - Headline: semibold tight sans line + italic serif line (text-[2rem] → sm:text-5xl →
//   lg:text-7xl); mono uppercase eyebrow/labels; pill CTA with a rotating arrow disc.
// - Motion: AnimatePresence slide + crossfade (spring x, direction-aware), masked
//   headline lines and staggered copy, sticker spring-in, slow Ken Burns zoom, rolling
//   counter digits; MotionConfig reducedMotion="user" drops transforms.
// - Controls row under the stage: counter + live label (visible from sm), segmented dots
//   that double as the 5 s progress bar (labels on lg), pause/prev/next buttons; wraps
//   into two rows on mobile. An "Up next" thumbnail card sits bottom-right on lg.

// What it does:
// - State: [index, direction] of the current slide, hover/focus/drag flags and a
//   play/pause preference. A framer-motion animate() drives a 0→1 progress motion value
//   over 5 s and advances on complete; it is stopped (and resumed from where it was) when
//   paused and cleaned up on unmount. No autoplay for prefers-reduced-motion users unless
//   they press Play.
// - Autoplay pauses on mouse hover, keyboard focus or key presses inside the carousel and
//   while dragging. Slides can be dragged/swiped (80 px or a fast flick), ←/→/Home/End
//   keys work when the carousel has focus, and a click after a drag never follows a CTA.
// - CTAs link to #shop-golden-hour, #shop-sunwear, #shop-outerwear, #shop-solstice-sale;
//   "All edits" → #solstice-edits. The next slide's photo is preloaded.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AutoplayHeroProductSlider from '@/TestComponent/PageSections/ecommerce/Slider01';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <AutoplayHeroProductSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { LuSunrise } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 5
const EASE = [0.22, 1, 0.36, 1]

const slides = [
    {
        id: 'golden-hour',
        label: 'Golden Hour',
        eyebrow: 'Midsummer drop — new in',
        title: ['Golden hour,', 'all day long.'],
        copy: 'Heavyweight cotton-terry tracksuits in marigold, dune and salt. Cut roomy, garment-washed soft.',
        badge: ['Sets from', '$128'],
        cta: 'Shop the sets',
        href: '#shop-golden-hour',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
        alt: 'Model in a marigold cropped hoodie and joggers under a clear blue summer sky',
        focus: 'object-[50%_18%] lg:object-[50%_8%]',
        accentBg: 'bg-[#ffb547]',
        accentText: 'text-[#ffb547]',
    },
    {
        id: 'sunwear',
        label: 'Sunwear',
        eyebrow: 'Sunwear — polarised',
        title: ['Throw some', 'serious shade.'],
        copy: 'Hand-polished acetate frames with UV400 polarised lenses and a lifetime hinge guarantee.',
        badge: ['Frames from', '$89'],
        cta: 'Shop sunwear',
        href: '#shop-sunwear',
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80',
        alt: 'Blonde woman in colourful retro sunglasses holding a daisy against a teal backdrop',
        focus: 'object-[50%_20%]',
        accentBg: 'bg-[#ff6b4a]',
        accentText: 'text-[#ff6b4a]',
    },
    {
        id: 'equinox',
        label: 'Outerwear',
        eyebrow: 'Equinox outerwear',
        title: ['Coats for the', 'in-between days.'],
        copy: 'Double-faced wool and recycled nylon shells for cool mornings and warm afternoons.',
        badge: ['Coats from', '$245'],
        cta: 'Shop outerwear',
        href: '#shop-outerwear',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80',
        alt: 'Woman in sunglasses, a headscarf and a long blue coat among pigeons outside a cathedral',
        focus: 'object-[50%_20%] lg:object-[50%_12%]',
        accentBg: 'bg-[#9cc0ff]',
        accentText: 'text-[#9cc0ff]',
    },
    {
        id: 'solstice-weekend',
        label: 'Solstice Sale',
        eyebrow: 'Solstice Weekend · Jun 20–23',
        title: ['Up to 40% off.', 'Three days of sun.'],
        copy: 'Over 1,200 styles across women, men and home. Ends Sunday, June 23 at 11:59 pm.',
        badge: ['Up to', '40% off'],
        cta: 'Shop the sale',
        href: '#shop-solstice-sale',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
        alt: 'Woman in sunglasses and a burgundy coat carrying a handful of shopping bags',
        focus: 'object-[50%_30%] lg:object-[50%_22%]',
        accentBg: 'bg-[#f6e05e]',
        accentText: 'text-[#f6e05e]',
    },
]

const total = slides.length
const pad = (n) => String(n).padStart(2, '0')

const slideVariants = {
    enter: (dir) => ({ x: dir < 0 ? '-24%' : '24%', opacity: 0, zIndex: 2 }),
    center: {
        x: '0%',
        opacity: 1,
        zIndex: 2,
        transition: {
            x: { type: 'spring', stiffness: 160, damping: 26 },
            opacity: { duration: 0.55, ease: 'easeOut' },
        },
    },
    exit: (dir) => ({
        x: dir < 0 ? '14%' : '-14%',
        opacity: 0,
        zIndex: 1,
        transition: { duration: 0.75, ease: EASE },
    }),
}

const textGroup = {
    enter: {},
    center: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}

const rise = {
    enter: { y: 26, opacity: 0 },
    center: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
    exit: { y: -10, opacity: 0, transition: { duration: 0.25 } },
}

const lineMask = {
    enter: { y: '110%' },
    center: { y: '0%', transition: { duration: 0.85, ease: EASE } },
    exit: { y: '-105%', transition: { duration: 0.35, ease: 'easeIn' } },
}

const sticker = {
    enter: { scale: 0.4, rotate: -40, opacity: 0 },
    center: {
        scale: 1,
        rotate: -10,
        opacity: 1,
        transition: { type: 'spring', stiffness: 260, damping: 16, delay: 0.45 },
    },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
}

export function AutoplayHeroProductSlider({
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

    const slide = slides[index]
    const nextSlide = slides[(index + 1) % total]

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

    // Autoplay: animate progress 0 → 1, resume from the current value after a pause.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    // Warm the cache for the next slide's photo.
    useEffect(() => {
        const preload = new window.Image()
        preload.src = slides[(index + 1) % total].image
    }, [index])

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        const isMove = event.key in moves
        if (!isMove && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        setFocused(true)
        // Keep focus alive when the focused CTA belongs to the slide that is leaving.
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
        if (offset.x < -80 || velocity.x < -600) paginate(1)
        else if (offset.x > 80 || velocity.x > 600) paginate(-1)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden bg-[#140f0b] px-4 py-10 text-[#fbf4ea] sm:px-6 sm:py-14 lg:px-10 lg:py-16 text-base font-normal',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffb547] text-lg text-[#140f0b]">
                                <LuSunrise aria-hidden="true" />
                            </span>
                            <div className="leading-tight">
                                <p className="text-sm font-semibold tracking-tight">Solstice Store</p>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fbf4ea]/50">
                                    Midsummer Edit · 2026
                                </p>
                            </div>
                        </div>
                        <a
                            href="#solstice-edits"
                            className="group inline-flex min-h-10 items-center gap-2 rounded-full px-1 text-sm text-[#fbf4ea]/75 transition-colors hover:text-[#fbf4ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb547]"
                        >
                            All edits
                            <HiArrowLongRight
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Solstice Store featured edits"
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
                            ref={stageRef}
                            role="group"
                            tabIndex={0}
                            aria-label="Slides, use the left and right arrow keys to browse"
                            className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-[#261c14] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb547] sm:aspect-[4/3] lg:aspect-auto lg:h-[560px] lg:rounded-[2rem]"
                        >
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={slide.id}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${index + 1} of ${total}: ${slide.label}`}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.35}
                                    className="absolute inset-0 cursor-grab select-none active:cursor-grabbing"
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
                                    <motion.img
                                        src={slide.image}
                                        alt={slide.alt}
                                        draggable={false}
                                        initial={{ scale: 1.14 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 6.5, ease: 'easeOut' }}
                                        className={cn('absolute inset-0 h-full w-full object-cover', slide.focus)}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/5 lg:bg-linear-to-r lg:from-black/80 lg:via-black/35 lg:to-black/0" />

                                    <motion.div
                                        variants={sticker}
                                        className={cn(
                                            'absolute right-4 top-4 grid h-[4.75rem] w-[4.75rem] place-content-center rounded-full text-center text-[#140f0b] shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:right-6 sm:top-6 sm:h-24 sm:w-24 lg:right-8 lg:top-8 lg:h-28 lg:w-28',
                                            slide.accentBg,
                                        )}
                                    >
                                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] sm:text-[10px]">
                                            {slide.badge[0]}
                                        </span>
                                        <span className="text-lg font-bold leading-none tracking-tight sm:text-2xl lg:text-[1.7rem]">
                                            {slide.badge[1]}
                                        </span>
                                    </motion.div>

                                    <motion.div
                                        variants={textGroup}
                                        className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:inset-y-0 lg:right-auto lg:flex lg:w-[58%] lg:flex-col lg:justify-end lg:p-12"
                                    >
                                        <motion.p
                                            variants={rise}
                                            className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#fbf4ea]/85 sm:text-[11px]"
                                        >
                                            <span className={cn('h-px w-8', slide.accentBg)} />
                                            {slide.eyebrow}
                                        </motion.p>
                                        <h2 className="mt-3 text-[2rem] leading-[0.98] tracking-[-0.035em] sm:mt-4 sm:text-5xl lg:text-7xl text-[#fbf4ea] font-normal">
                                            <span className="block overflow-hidden pb-1">
                                                <motion.span variants={lineMask} className="block font-semibold">
                                                    {slide.title[0]}
                                                </motion.span>
                                            </span>
                                            <span className="block overflow-hidden pb-1">
                                                <motion.span
                                                    variants={lineMask}
                                                    className={cn('block font-serif font-normal italic', slide.accentText)}
                                                >
                                                    {slide.title[1]}
                                                </motion.span>
                                            </span>
                                        </h2>
                                        <motion.p
                                            variants={rise}
                                            className="mt-3 max-w-md text-sm leading-6 text-[#fbf4ea]/80 sm:mt-4 sm:text-base sm:leading-7"
                                        >
                                            {slide.copy}
                                        </motion.p>
                                        <motion.div variants={rise} className="mt-5 sm:mt-7">
                                            <a
                                                href={slide.href}
                                                draggable={false}
                                                className={cn(
                                                    'group inline-flex h-12 items-center gap-3 rounded-full pl-5 pr-1.5 text-sm font-semibold text-[#140f0b] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fbf4ea]',
                                                    slide.accentBg,
                                                )}
                                            >
                                                {slide.cta}
                                                <span
                                                    className={cn(
                                                        'grid h-9 w-9 place-items-center rounded-full bg-[#140f0b] transition-transform duration-300 group-hover:rotate-45',
                                                        slide.accentText,
                                                    )}
                                                >
                                                    <HiArrowUpRight aria-hidden="true" />
                                                </span>
                                            </a>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>

                            <button
                                type="button"
                                aria-label={`Next slide: ${nextSlide.label}`}
                                className="absolute bottom-8 right-8 z-10 hidden w-64 items-center gap-3 rounded-2xl border border-white/15 bg-black/35 p-2 pr-4 text-left backdrop-blur-md transition-colors hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fbf4ea] lg:flex"
                                onClick={() => paginate(1)}
                            >
                                <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-white/10">
                                    <AnimatePresence initial={false}>
                                        <motion.img
                                            key={nextSlide.id}
                                            src={nextSlide.thumb}
                                            alt={nextSlide.alt}
                                            loading="lazy"
                                            draggable={false}
                                            initial={{ opacity: 0, scale: 1.25 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6, ease: EASE }}
                                            className={cn('absolute inset-0 h-full w-full object-cover', nextSlide.focus)}
                                        />
                                    </AnimatePresence>
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                                        Up next
                                    </span>
                                    <span className="block truncate text-sm font-semibold">{nextSlide.label}</span>
                                </span>
                                <HiArrowLongRight aria-hidden="true" className="ml-auto shrink-0 text-white/70" />
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 sm:mt-5 lg:grid-cols-[15rem_minmax(0,1fr)_auto] lg:gap-x-10">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="relative inline-flex h-8 overflow-hidden font-mono text-3xl leading-8 tabular-nums">
                                    <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                                        <motion.span
                                            key={index}
                                            custom={direction}
                                            initial={{ y: direction < 0 ? '-100%' : '100%' }}
                                            animate={{ y: '0%' }}
                                            exit={{ y: direction < 0 ? '100%' : '-100%' }}
                                            transition={{ duration: 0.5, ease: EASE }}
                                            className="block"
                                        >
                                            {pad(index + 1)}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <span className="whitespace-nowrap font-mono text-sm text-[#fbf4ea]/40">/ {pad(total)}</span>
                                <p
                                    aria-live={playing ? 'off' : 'polite'}
                                    aria-atomic="true"
                                    className="sr-only min-w-0 truncate text-sm text-[#fbf4ea]/70 sm:not-sr-only"
                                >
                                    <span className="sr-only">
                                        Slide {index + 1} of {total}:{' '}
                                    </span>
                                    {slide.label}
                                </p>
                            </div>

                            <div
                                role="group"
                                aria-label="Choose a slide"
                                className="col-span-2 row-start-2 flex gap-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:gap-3"
                            >
                                {slides.map((item, i) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-label={`Go to slide ${i + 1}: ${item.label}`}
                                        aria-current={i === index ? 'true' : undefined}
                                        className="group flex h-10 min-w-0 flex-1 flex-col justify-center gap-2 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb547] lg:h-12"
                                        onClick={() => goTo(i)}
                                    >
                                        <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-[#fbf4ea]/20 transition-colors group-hover:bg-[#fbf4ea]/35">
                                            <motion.span
                                                className={cn(
                                                    'absolute inset-0 origin-left rounded-full',
                                                    i === index ? item.accentBg : 'bg-[#fbf4ea]/80',
                                                )}
                                                style={{
                                                    scaleX: i === index ? (reduce ? 1 : progress) : i < index ? 1 : 0,
                                                }}
                                            />
                                        </span>
                                        <span
                                            className={cn(
                                                'hidden truncate font-mono text-[10px] uppercase tracking-[0.18em] transition-colors lg:block',
                                                i === index ? 'text-[#fbf4ea]' : 'text-[#fbf4ea]/45 group-hover:text-[#fbf4ea]/70',
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 lg:col-start-3">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="grid h-11 w-11 place-items-center rounded-full text-lg text-[#fbf4ea]/80 transition-colors hover:bg-[#fbf4ea]/10 hover:text-[#fbf4ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb547]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous slide"
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#fbf4ea]/25 text-lg transition-colors hover:border-[#fbf4ea] hover:bg-[#fbf4ea] hover:text-[#140f0b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb547]"
                                    onClick={() => paginate(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next slide"
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#fbf4ea]/25 text-lg transition-colors hover:border-[#fbf4ea] hover:bg-[#fbf4ea] hover:text-[#140f0b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb547]"
                                    onClick={() => paginate(1)}
                                >
                                    <HiArrowLongRight aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default AutoplayHeroProductSlider

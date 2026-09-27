// SplitRevealCollectionSlider

// Slider03 · E-commerce & Marketplaces › Animated Slider

// Description:
// Editorial collection switcher for Maison Verre, a glass & ceramics atelier. A list of
// five collections (Porcelain Blanc, Bleu de Four, Verre Soufflé, Jardin d'Hiver, Terre
// Cuite) sits beside a large photo that changes with a clip-path wipe; the active
// collection shows a 01 / 05 counter, a short story, "24 pieces · from $38" and an
// "Explore …" CTA. Use it on a homepage or category landing page to introduce ranges.

// Design:
// - Bone #f2eee7 background, ink #1c1a17, bottle-glass green #2f5d50 accents, sea-glass
//   #cfe0d8 offset panel behind the photo (lg) plus a per-collection pastel curtain.
// - md+: two columns (1fr / 1fr → lg 5fr / 7fr); left = eyebrow, serif heading, counter,
//   vertical list of serif names (md:text-3xl → lg:text-[2.6rem]) with mono index (and
//   piece count on lg), story + CTA; right = photo spanning the full height (min-h 520px
//   → lg 600px), rounded-[1.25rem].
// - Mobile: the list becomes a horizontally scrolling row of pill chips above a
//   aspect-[4/5] (sm:aspect-[5/4]) photo, with the story, CTA and controls below.
// - Motion: tinted curtain then photo wipe in with clip-path inset() (from below going
//   forward, from above going back), counter-zoom on the new photo, the old one darkens
//   and zooms out beneath; rolling counter digits; AnimatePresence text swaps.
// - Reduced motion: wipes become crossfades (MotionConfig reducedMotion="user" too) and
//   autoplay is off unless the visitor presses Play.

// What it does:
// - State: [active, direction], hover/focus flags and a play/pause preference. Autoplay
//   advances every 6 s via a framer-motion animate() on a progress motion value (shown as
//   a line under the active name); it pauses on mouse hover or keyboard focus, resumes
//   where it stopped and is stopped on unmount.
// - Names are ARIA tabs (roving tabIndex) controlling the photo tabpanel: click, or use
//   ↑/↓/←/→/Home/End; ←/→ also work on the photo. Swipe/drag the photo to change too.
// - On mobile the active chip is scrolled into view inside the chip row only (the page
//   never scrolls). CTAs link to #collection-<id>; "All collections" → #maison-verre-shop.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SplitRevealCollectionSlider from '@/TestComponent/PageSections/ecommerce/Slider03';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <SplitRevealCollectionSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6
const EASE = [0.22, 1, 0.36, 1]
const WIPE = [0.76, 0, 0.24, 1]

const collections = [
    {
        id: 'porcelain-blanc',
        name: 'Porcelain Blanc',
        kind: 'Hand-thrown porcelain',
        pieces: 24,
        from: 38,
        copy: 'Eggshell-thin cups and vessels thrown on the wheel in Caldas da Rainha and fired twice at 1,280 °C until they glow when held to the light.',
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1400&q=80',
        alt: 'White porcelain cups and vessels grouped on a pale surface',
        tint: 'bg-[#e6e0d4]',
    },
    {
        id: 'bleu-de-four',
        name: 'Bleu de Four',
        kind: 'Reactive-glaze stoneware',
        pieces: 18,
        from: 42,
        copy: 'Dinner plates and bowls dipped in a cobalt glaze that pools and breaks differently in every firing, so no two stacks match.',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1400&q=80',
        alt: 'Stack of blue reactive-glaze ceramic plates on a wooden table',
        tint: 'bg-[#c9d6e8]',
    },
    {
        id: 'verre-souffle',
        name: 'Verre Soufflé',
        kind: 'Mouth-blown glassware',
        pieces: 12,
        from: 56,
        copy: 'Featherweight stemware and tumblers blown by a third-generation family studio in Marinha Grande. Thin rims, sturdy stems.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1400&q=80',
        alt: 'Two hand-blown wine glasses raised in a toast',
        tint: 'bg-[#cfe0d8]',
    },
    {
        id: 'jardin-d-hiver',
        name: 'Jardin d’Hiver',
        kind: 'Stoneware vases',
        pieces: 15,
        from: 64,
        copy: 'Matte bud vases and bottle vessels sized for a single branch, finished with a raw, unglazed foot that shows the clay.',
        image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1400&q=80',
        alt: 'White stoneware vases holding a blossom branch on a wooden tray',
        tint: 'bg-[#efe3dc]',
    },
    {
        id: 'terre-cuite',
        name: 'Terre Cuite',
        kind: 'Terracotta planters',
        pieces: 9,
        from: 29,
        copy: 'Breathable raw-clay planters pressed by hand from Alentejo earth, each with a matching drainage saucer.',
        image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1400&q=80',
        alt: 'Cactus growing in a terracotta pot against a soft pink backdrop',
        tint: 'bg-[#f1d9cf]',
    },
]

const total = collections.length
const pad = (n) => String(n).padStart(2, '0')
const hiddenClip = (dir) => (dir < 0 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)')
const shownClip = 'inset(0% 0% 0% 0%)'

const wipeVariants = {
    frame: {
        enter: { zIndex: 2, filter: 'brightness(1)' },
        center: { zIndex: 2, filter: 'brightness(1)' },
        exit: { zIndex: 1, filter: 'brightness(0.82)', transition: { duration: 1.1, ease: EASE } },
    },
    curtain: {
        enter: (dir) => ({ clipPath: hiddenClip(dir) }),
        center: { clipPath: shownClip, transition: { duration: 0.75, ease: WIPE } },
    },
    reveal: {
        enter: (dir) => ({ clipPath: hiddenClip(dir) }),
        center: { clipPath: shownClip, transition: { duration: 1, ease: WIPE, delay: 0.14 } },
    },
    zoom: {
        enter: { scale: 1.22 },
        center: { scale: 1, transition: { duration: 1.6, ease: EASE, delay: 0.1 } },
        exit: { scale: 1.08, transition: { duration: 1.1, ease: EASE } },
    },
}

const fadeVariants = {
    frame: {
        enter: { zIndex: 2, opacity: 0 },
        center: { zIndex: 2, opacity: 1, transition: { duration: 0.4 } },
        exit: { zIndex: 1, opacity: 0, transition: { duration: 0.4 } },
    },
    curtain: { enter: {}, center: {} },
    reveal: { enter: {}, center: {} },
    zoom: { enter: {}, center: {}, exit: {} },
}

export function SplitRevealCollectionSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [[active, direction], setState] = useState([0, 0])
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const listRef = useRef(null)
    const tabRefs = useRef([])
    const uid = useId()

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused
    const variants = reduce ? fadeVariants : wipeVariants
    const current = collections[active]
    const panelId = `${uid}-panel`
    const tabId = (i) => `${uid}-tab-${i}`

    const step = useCallback(
        (dir) => {
            progress.jump(0)
            setState(([prev]) => [(prev + dir + total) % total, dir])
        },
        [progress],
    )

    const select = (target) => {
        if (target === active) return
        progress.jump(0)
        setState([target, target > active ? 1 : -1])
    }

    useEffect(() => {
        setHydrated(true)
    }, [])

    // Autoplay: progress 0 → 1 over 6 s, resumed from the current value after a pause.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => step(1),
        })
        return () => controls.stop()
    }, [playing, active, step, progress])

    // Keep the active chip visible inside the horizontal chip row (mobile) without
    // scrolling the page itself.
    useEffect(() => {
        const list = listRef.current
        const tab = tabRefs.current[active]
        if (!list || !tab || list.scrollWidth <= list.clientWidth + 1) return
        const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2
        list.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' })
    }, [active, reduce])

    useEffect(() => {
        const preload = new window.Image()
        preload.src = collections[(active + 1) % total].image
    }, [active])

    const handleKeyDown = (event) => {
        const onTab = event.target.getAttribute('role') === 'tab'
        const forward = event.key === 'ArrowRight' || (onTab && event.key === 'ArrowDown')
        const back = event.key === 'ArrowLeft' || (onTab && event.key === 'ArrowUp')
        let target = null
        if (forward) target = (active + 1) % total
        else if (back) target = (active - 1 + total) % total
        else if (onTab && event.key === 'Home') target = 0
        else if (onTab && event.key === 'End') target = total - 1
        if (target === null) return
        event.preventDefault()
        setFocused(true)
        if (forward) step(1)
        else if (back) step(-1)
        else select(target)
        if (onTab && tabRefs.current[target]) tabRefs.current[target].focus()
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

    const handlePanEnd = (_, info) => {
        if (info.offset.x < -60 || info.velocity.x < -500) step(1)
        else if (info.offset.x > 60 || info.velocity.x > 500) step(-1)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden bg-[#f2eee7] px-4 py-12 text-[#1c1a17] sm:px-6 sm:py-16 lg:px-10 lg:py-20 text-base font-normal',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Maison Verre collections"
                    className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr_auto] md:gap-x-10 md:gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16"
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
                    <div className="md:col-start-1 md:row-start-1">
                        <div className="flex items-center justify-between gap-4">
                            <p className="flex items-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.24em] text-[#2f5d50]">
                                <span className="h-px w-6 bg-[#2f5d50]" />
                                Maison Verre<span className="hidden sm:inline md:hidden lg:inline"> · Collections</span>
                            </p>
                            <a
                                href="#maison-verre-shop"
                                className="inline-flex min-h-10 shrink-0 items-center text-sm underline decoration-[#1c1a17]/30 underline-offset-4 transition-colors hover:decoration-[#1c1a17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f5d50]"
                            >
                                All collections
                            </a>
                        </div>
                        <div className="mt-4 flex items-end justify-between gap-4 sm:mt-6">
                            <h2 className="font-serif text-[1.75rem] leading-[1.05] tracking-[-0.01em] sm:text-4xl md:text-3xl lg:text-4xl text-[#1c1a17] font-normal">
                                Glass &amp; clay,
                                <br />
                                <em className="text-[#2f5d50]">shaped by hand.</em>
                            </h2>
                            <p className="flex shrink-0 items-baseline gap-1.5 font-mono tabular-nums">
                                <span className="sr-only">Collection </span>
                                <span className="relative inline-flex h-9 overflow-hidden text-3xl leading-9 sm:h-11 sm:text-4xl sm:leading-[2.75rem]">
                                    <AnimatePresence initial={false} mode="popLayout">
                                        <motion.span
                                            key={active}
                                            initial={{ y: direction < 0 ? '-100%' : '100%' }}
                                            animate={{ y: '0%' }}
                                            exit={{ y: direction < 0 ? '100%' : '-100%' }}
                                            transition={{ duration: 0.6, ease: EASE }}
                                            className="block"
                                        >
                                            {pad(active + 1)}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <span className="text-sm text-[#1c1a17]/45">
                                    <span className="sr-only">of</span> / {pad(total)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div
                        ref={listRef}
                        role="tablist"
                        aria-label="Collections"
                        className="relative -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:flex-col md:gap-0 md:self-center md:overflow-visible md:border-t md:border-[#1c1a17]/15 md:p-0 [&::-webkit-scrollbar]:hidden"
                    >
                        {collections.map((item, i) => {
                            const isActive = i === active
                            return (
                                <button
                                    key={item.id}
                                    ref={(el) => {
                                        tabRefs.current[i] = el
                                    }}
                                    id={tabId(i)}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={panelId}
                                    tabIndex={isActive ? 0 : -1}
                                    className={cn(
                                        'group relative flex h-11 shrink-0 snap-start items-center gap-3 overflow-hidden rounded-full border px-4 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f5d50]',
                                        'md:h-auto md:w-full md:overflow-visible md:rounded-none md:border-0 md:border-b md:border-[#1c1a17]/15 md:px-0 md:py-4 md:text-left lg:py-5',
                                        isActive
                                            ? 'border-[#1c1a17] bg-[#1c1a17] text-[#f2eee7] md:bg-transparent md:text-[#1c1a17]'
                                            : 'border-[#1c1a17]/20 text-[#1c1a17]/70 hover:border-[#1c1a17]/50 md:text-[#1c1a17]/35 md:hover:text-[#1c1a17]/70',
                                    )}
                                    onClick={() => select(i)}
                                >
                                    <span className="hidden w-6 shrink-0 font-mono text-[11px] tabular-nums text-[#1c1a17]/45 md:inline">
                                        {pad(i + 1)}
                                    </span>
                                    <span className="flex min-w-0 items-center whitespace-nowrap md:font-serif md:text-3xl md:leading-[1.1] md:tracking-[-0.02em] lg:text-[2.6rem]">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'hidden h-px shrink-0 bg-[#2f5d50] transition-all duration-500 md:block',
                                                isActive ? 'mr-3 w-8' : 'mr-0 w-0',
                                            )}
                                        />
                                        <span className="truncate">{item.name}</span>
                                    </span>
                                    <span className="ml-auto hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1c1a17]/45 lg:inline">
                                        {item.pieces} pcs
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-x-4 bottom-1.5 h-[2px] overflow-hidden rounded-full md:inset-x-0 md:-bottom-px"
                                    >
                                        {isActive && (
                                            <motion.span
                                                className="block h-full origin-left bg-[#cfe0d8] md:bg-[#2f5d50]"
                                                style={{ scaleX: reduce ? 1 : progress }}
                                            />
                                        )}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="relative md:col-start-2 md:row-span-3 md:row-start-1">
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 hidden translate-x-4 translate-y-4 rounded-[1.25rem] bg-[#cfe0d8] lg:block"
                        />
                        <motion.div
                            id={panelId}
                            role="tabpanel"
                            aria-labelledby={tabId(active)}
                            tabIndex={0}
                            className="relative aspect-[4/5] touch-pan-y select-none overflow-hidden rounded-[1.25rem] bg-[#e6e0d4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2f5d50] sm:aspect-[5/4] md:aspect-auto md:h-full md:min-h-[520px] lg:min-h-[600px]"
                            onPanEnd={handlePanEnd}
                        >
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={current.id}
                                    custom={direction}
                                    variants={variants.frame}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="absolute inset-0"
                                >
                                    <motion.div
                                        custom={direction}
                                        variants={variants.curtain}
                                        className={cn('absolute inset-0', current.tint)}
                                    />
                                    <motion.div
                                        custom={direction}
                                        variants={variants.reveal}
                                        className="absolute inset-0 overflow-hidden"
                                    >
                                        <motion.img
                                            src={current.image}
                                            alt={current.alt}
                                            draggable={false}
                                            variants={variants.zoom}
                                            className="h-full w-full object-cover"
                                        />
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="pointer-events-none absolute left-3 top-3 z-10 sm:left-5 sm:top-5">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.p
                                        key={current.id}
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.4 } }}
                                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                        className="rounded-full bg-[#f2eee7]/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1c1a17] backdrop-blur-md"
                                    >
                                        Nº {pad(active + 1)} — {current.kind}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    <div className="md:col-start-1 md:row-start-3">
                        <div aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="min-h-[10rem] sm:min-h-[9.5rem] md:min-h-[9rem]">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={current.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.35, ease: EASE }}
                                >
                                    <p className="font-serif text-2xl italic md:hidden">{current.name}</p>
                                    <p className="mt-2 max-w-md text-[15px] leading-7 text-[#1c1a17]/75 md:mt-0">
                                        {current.copy}
                                    </p>
                                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#2f5d50]">
                                        {current.pieces} pieces · from ${current.from}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <a
                                href={`#collection-${current.id}`}
                                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#1c1a17] px-6 text-sm font-medium text-[#f2eee7] transition-colors duration-300 hover:bg-[#2f5d50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f5d50]"
                            >
                                Explore {current.name}
                                <HiArrowLongRight
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </a>
                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="grid h-11 w-11 place-items-center rounded-full text-lg text-[#1c1a17]/70 transition-colors hover:bg-[#1c1a17]/5 hover:text-[#1c1a17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f5d50]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous collection"
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#1c1a17]/20 text-lg transition-colors hover:border-[#1c1a17] hover:bg-[#1c1a17] hover:text-[#f2eee7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f5d50]"
                                    onClick={() => step(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next collection"
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#1c1a17]/20 text-lg transition-colors hover:border-[#1c1a17] hover:bg-[#1c1a17] hover:text-[#f2eee7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f5d50]"
                                    onClick={() => step(1)}
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

export default SplitRevealCollectionSlider

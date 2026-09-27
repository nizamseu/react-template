// CoverflowProductSlider

// Slider02 · E-commerce & Marketplaces › Animated Slider

// Description:
// 3D coverflow carousel for Orbit Kicks' sneaker "Drop 07": five shoes (Apogee Runner,
// Lunar Suede Low, Orbit Court '87, Crater Canvas, Nebula Runner) fan out around a
// scaled-up centre card, under the headline "Fresh off the launch pad." The active shoe's
// name, colourway, rating, price, specs and a "Shop …" link sit directly under the stack.
// Use it to showcase a small, visual product range such as a drop or a capsule.

// Design:
// - Ultramarine #1f23d8 background, cream #f3f0e6 text, lime #d4ff3f accent, ink #0b0c2a;
//   tilted dashed orbit ellipses with lime "planets" and a soft #6c70ff glow behind the
//   stack.
// - Cards are aspect-[4/5], rounded-[1.6rem], w-[60%] → sm:w-[40%] → lg:w-[27%]; the
//   centre card is scale 1, side cards rotateY ±45° (perspective-[1400px]), shrink and
//   are tinted blue; "No. 0x" mono chip and a lime tag chip on every card.
// - Heavy uppercase sans type (font-black, tracking-[-0.04em]) text-4xl → sm:text-6xl →
//   lg:text-7xl; mono eyebrows; lime price pill; round 48px arrow buttons; pill dots.
// - Motion: one continuous offset motion value positions every card (x, rotateY, scale,
//   tint, opacity via useTransform), springs to the target slide and follows the pointer
//   live while dragging; info text swaps with AnimatePresence; ring dashes drift slowly.
// - Shows 1 side card per side below lg and 2 per side from lg (matchMedia); side cards
//   bleed to the viewport edge and are clipped by the root's overflow-hidden.

// What it does:
// - State: position (virtual, endlessly wrapping slide index), the rounded live centre
//   used for the active product, a dragging flag and whether the lg layout is active.
// - Drag/swipe with mouse or touch (framer-motion pan, touch-action pan-y): the cards
//   follow the pointer, drag distance picks the slide (max 2 per gesture) and a quick
//   flick moves one; click a side card, the arrows, the dots or use ←/→/Home/End while
//   the carousel has focus. A click that ends a drag is ignored.
// - No autoplay (user-driven); the decorative ring animation stops and slide changes jump
//   instead of spring for prefers-reduced-motion. Animations are stopped on unmount.
// - "Shop …" links point to #orbit-<product-id>; "All Drop 07" → #orbit-drop-07.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CoverflowProductSlider from '@/TestComponent/PageSections/ecommerce/Slider02';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <CoverflowProductSlider />
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
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniStar } from 'react-icons/hi2';
import { PiHandSwipeLeft } from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]

const products = [
    {
        id: 'apogee-runner',
        name: 'Apogee Runner',
        colorway: 'Obsidian / Bone',
        price: 168,
        tag: 'New drop',
        rating: 4.8,
        reviews: '1,204',
        specs: ['248 g', '8 mm drop', 'Carbon plate'],
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
        alt: 'Black knit running sneaker floating against a white background',
    },
    {
        id: 'lunar-suede-low',
        name: 'Lunar Suede Low',
        colorway: 'Lagoon Teal',
        price: 134,
        tag: 'Restocked',
        rating: 4.7,
        reviews: '386',
        specs: ['Water-repellent suede', 'Gum outsole', '272 g'],
        image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80',
        alt: 'Teal suede low-top shoe on a pastel backdrop next to fresh oranges',
    },
    {
        id: 'court-87',
        name: 'Orbit Court ’87',
        colorway: 'Solar Tan',
        price: 119,
        tag: 'Bestseller',
        rating: 4.9,
        reviews: '2,318',
        specs: ['Full-grain leather', 'Stitched cupsole', 'Made in Portugal'],
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        alt: 'Tan leather court sneaker resting on mustard-yellow fabric',
    },
    {
        id: 'crater-canvas',
        name: 'Crater Canvas',
        colorway: 'Merlot / Egg Yolk',
        price: 78,
        tag: 'Under $80',
        rating: 4.6,
        reviews: '512',
        specs: ['12 oz organic canvas', 'Vulcanised sole', 'Vegan'],
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
        alt: 'Maroon canvas sneaker photographed on a bright yellow background',
    },
    {
        id: 'nebula-runner',
        name: 'Nebula Runner',
        colorway: 'Prism Multi',
        price: 148,
        tag: 'Limited',
        rating: 4.8,
        reviews: '97',
        specs: ['Recycled mesh', 'Supercritical foam', '4 colourways'],
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
        alt: 'Several colourful running sneakers stacked on a white box',
    },
]

const total = products.length
const wrap = (n) => ((n % total) + total) % total
const pad = (n) => String(n).padStart(2, '0')

const spring = { type: 'spring', stiffness: 210, damping: 30, mass: 0.9 }

function CoverCard({ virtualIndex, product, number, offset, side, isActive, onSelect }) {
    const distance = useTransform(offset, (o) => virtualIndex - o)
    const x = useTransform(distance, (d) => {
        const a = Math.abs(d)
        const shift = a <= 1 ? a * 64 : 64 + (a - 1) * 46
        return `${Math.sign(d) * shift}%`
    })
    const rotateY = useTransform(distance, (d) => -Math.max(-1, Math.min(1, d)) * 45)
    const scale = useTransform(distance, (d) => 1 - Math.min(Math.abs(d), 2.5) * 0.12)
    const zIndex = useTransform(distance, (d) => 50 - Math.round(Math.abs(d) * 10))
    const tint = useTransform(distance, (d) => Math.min(Math.abs(d), 2) * 0.3)
    const opacity = useTransform(distance, (d) => {
        const a = Math.abs(d)
        return a <= side ? 1 : Math.max(0, 1 - (a - side) * 1.6)
    })
    const visibility = useTransform(opacity, (o) => (o < 0.02 ? 'hidden' : 'visible'))

    return (
        <motion.div
            role="group"
            aria-roledescription="slide"
            aria-label={`${number} of ${total}: ${product.name}, $${product.price}`}
            aria-current={isActive ? 'true' : undefined}
            aria-hidden={isActive ? undefined : true}
            style={{ x, rotateY, scale, zIndex, opacity, visibility }}
            className={cn(
                'absolute inset-x-0 top-0 mx-auto aspect-[4/5] w-[60%] sm:w-[40%] lg:w-[27%]',
                isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
            )}
            onClick={() => onSelect(virtualIndex)}
        >
            <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-[#f3f0e6] shadow-[0_40px_60px_-24px_rgba(5,6,40,0.75)]">
                <img
                    src={product.image}
                    alt={product.alt}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3 sm:p-4">
                    <span className="rounded-full bg-[#0b0c2a]/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f3f0e6] backdrop-blur">
                        No. {pad(number)}
                    </span>
                    <span className="truncate rounded-full bg-[#d4ff3f] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0b0c2a]">
                        {product.tag}
                    </span>
                </div>
                <motion.div aria-hidden="true" className="absolute inset-0 bg-[#0d0f6b]" style={{ opacity: tint }} />
            </div>
        </motion.div>
    )
}

export function CoverflowProductSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [position, setPosition] = useState(0)
    const [center, setCenter] = useState(0)
    const [dragging, setDragging] = useState(false)
    const [wide, setWide] = useState(false)
    const reduce = useReducedMotion()
    const offset = useMotionValue(0)
    const controlsRef = useRef(null)
    const placeholderRef = useRef(null)
    const panStart = useRef(0)
    const panUnit = useRef(1)
    const moved = useRef(false)
    const panning = useRef(false)

    const side = wide ? 2 : 1
    const activeIndex = wrap(center)
    const product = products[activeIndex]

    useMotionValueEvent(offset, 'change', (latest) => setCenter(Math.round(latest)))

    const settle = useCallback(
        (target) => {
            if (controlsRef.current) controlsRef.current.stop()
            setPosition(target)
            controlsRef.current = animate(offset, target, reduce ? { duration: 0 } : spring)
        },
        [offset, reduce],
    )

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        const update = () => setWide(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    useEffect(() => {
        const controls = controlsRef
        return () => {
            if (controls.current) controls.current.stop()
        }
    }, [])

    const goToProduct = (i) => {
        let delta = i - wrap(position)
        if (delta > total / 2) delta -= total
        if (delta < -total / 2) delta += total
        if (delta !== 0) settle(position + delta)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') settle(position + 1)
        else if (event.key === 'ArrowLeft') settle(position - 1)
        else if (event.key === 'Home') goToProduct(0)
        else if (event.key === 'End') goToProduct(total - 1)
        else return
        event.preventDefault()
    }

    // framer-motion calls onPan synchronously but defers onPanStart to the next frame,
    // so whichever handler runs first captures the starting offset and pixel scale.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        if (controlsRef.current) controlsRef.current.stop()
        panStart.current = offset.get()
        panUnit.current = (placeholderRef.current ? placeholderRef.current.offsetWidth : 240) * 0.64 || 1
    }

    const handlePanStart = () => {
        beginPan()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        offset.set(panStart.current - info.offset.x / panUnit.current)
    }

    const handlePanEnd = (_, info) => {
        beginPan()
        panning.current = false
        setDragging(false)
        const base = Math.round(panStart.current)
        // Distance decides how many slides to move; a quick flick moves one. Never move
        // against the drag direction and never more than half the loop (so a long drag
        // cannot wrap round and look like it went the other way).
        let steps = Math.round(offset.get() - base)
        if (steps === 0 && Math.abs(info.velocity.x) > 400) steps = info.velocity.x < 0 ? 1 : -1
        if (steps !== 0 && Math.sign(steps) === Math.sign(info.offset.x)) steps = 0
        const maxSteps = Math.floor((total - 1) / 2)
        settle(base + Math.max(-maxSteps, Math.min(maxSteps, steps)))
    }

    const handleSelect = (virtualIndex) => {
        if (moved.current) return
        settle(virtualIndex)
    }

    const cards = []
    for (let v = center - side - 1; v <= center + side + 1; v += 1) cards.push(v)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#1f23d8] px-4 py-14 text-[#f3f0e6] sm:px-6 sm:py-16 lg:px-10 lg:py-20 text-base font-normal',
                className,
            )}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-x-0 top-[48%] flex -translate-y-1/2 justify-center">
                    <svg viewBox="0 0 1000 420" className="w-[190%] max-w-none shrink-0 -rotate-6 sm:w-[140%] lg:w-[110%]">
                        <motion.ellipse
                            cx="500"
                            cy="210"
                            rx="490"
                            ry="150"
                            fill="none"
                            stroke="#f3f0e6"
                            strokeOpacity="0.28"
                            strokeWidth="1.2"
                            strokeDasharray="2 10"
                            animate={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -240] }}
                            transition={reduce ? { duration: 0 } : { duration: 18, ease: 'linear', repeat: Infinity }}
                        />
                        <ellipse
                            cx="500"
                            cy="210"
                            rx="380"
                            ry="112"
                            fill="none"
                            stroke="#f3f0e6"
                            strokeOpacity="0.16"
                        />
                        <motion.ellipse
                            cx="500"
                            cy="210"
                            rx="270"
                            ry="76"
                            fill="none"
                            stroke="#d4ff3f"
                            strokeOpacity="0.45"
                            strokeWidth="1.2"
                            strokeDasharray="1 14"
                            animate={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, 300] }}
                            transition={reduce ? { duration: 0 } : { duration: 24, ease: 'linear', repeat: Infinity }}
                        />
                        <circle cx="120" cy="248" r="7" fill="#d4ff3f" />
                        <circle cx="872" cy="150" r="4" fill="#f3f0e6" fillOpacity="0.8" />
                        <circle cx="745" cy="278" r="3" fill="#d4ff3f" />
                    </svg>
                </div>
            </div>

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f3f0e6]/70">
                            <span className="h-2 w-2 rounded-full bg-[#d4ff3f]" />
                            Orbit Kicks — Drop 07 · SS26
                        </p>
                        <h2 className="mt-3 max-w-2xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.04em] sm:text-6xl lg:text-7xl text-[#f3f0e6]">
                            Fresh off the <span className="text-[#d4ff3f]">launch pad.</span>
                        </h2>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                        <p className="flex items-center gap-2 whitespace-nowrap text-sm text-[#f3f0e6]/70">
                            <PiHandSwipeLeft aria-hidden="true" className="text-lg text-[#d4ff3f]" />
                            Drag, swipe or use ← →
                        </p>
                        <a
                            href="#orbit-drop-07"
                            className="group inline-flex min-h-10 items-center gap-2 rounded-full text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4ff3f]"
                        >
                            All Drop 07
                            <HiArrowLongRight
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                    </div>
                </div>

                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Orbit Kicks Drop 07 sneakers"
                    className="mt-10 sm:mt-14"
                >
                    <motion.div
                        role="group"
                        tabIndex={0}
                        aria-label="Sneakers, drag or use the left and right arrow keys to browse"
                        className={cn(
                            'relative touch-pan-y select-none rounded-[2rem] perspective-[1400px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#d4ff3f]',
                            dragging ? 'cursor-grabbing' : 'cursor-grab',
                        )}
                        onKeyDown={handleKeyDown}
                        onPointerDownCapture={() => {
                            moved.current = false
                        }}
                        onPanStart={handlePanStart}
                        onPan={handlePan}
                        onPanEnd={handlePanEnd}
                    >
                        <div
                            ref={placeholderRef}
                            aria-hidden="true"
                            className="invisible mx-auto aspect-[4/5] w-[60%] sm:w-[40%] lg:w-[27%]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6c70ff]/45 blur-3xl sm:w-[48%] lg:w-[34%]"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute -bottom-6 left-1/2 h-10 w-[46%] -translate-x-1/2 rounded-[100%] bg-[#070a5c]/70 blur-2xl lg:w-[24%]"
                        />
                        {cards.map((v) => (
                            <CoverCard
                                key={`${v}-${side}`}
                                virtualIndex={v}
                                product={products[wrap(v)]}
                                number={wrap(v) + 1}
                                offset={offset}
                                side={side}
                                isActive={v === center}
                                onSelect={handleSelect}
                            />
                        ))}
                    </motion.div>

                    <div aria-live="polite" aria-atomic="true" className="mt-10 text-center sm:mt-12">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                                transition={{ duration: 0.3, ease: EASE }}
                            >
                                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#f3f0e6]/60">
                                    <span className="sr-only">Showing </span>
                                    No. {pad(activeIndex + 1)} / {pad(total)} · {product.colorway}
                                </p>
                                <h3 className="mt-2 text-3xl font-black uppercase leading-none tracking-[-0.03em] sm:text-5xl text-[#f3f0e6]">
                                    {product.name}
                                </h3>
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
                                    <span className="rounded-full bg-[#d4ff3f] px-4 py-1.5 text-lg font-black tabular-nums text-[#0b0c2a]">
                                        ${product.price}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm text-[#f3f0e6]/80">
                                        <HiMiniStar aria-hidden="true" className="text-[#d4ff3f]" />
                                        {product.rating}
                                        <span className="text-[#f3f0e6]/50">({product.reviews} reviews)</span>
                                    </span>
                                    <a
                                        href={`#orbit-${product.id}`}
                                        className="group inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold underline decoration-[#d4ff3f] decoration-2 underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4ff3f]"
                                    >
                                        Shop {product.name}
                                        <HiArrowUpRight
                                            aria-hidden="true"
                                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </a>
                                </div>
                                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                                    {product.specs.map((spec) => (
                                        <li
                                            key={spec}
                                            className="rounded-full border border-[#f3f0e6]/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f3f0e6]/75"
                                        >
                                            {spec}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-3 sm:gap-5">
                        <button
                            type="button"
                            aria-label="Previous sneaker"
                            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#f3f0e6]/30 text-xl transition-colors hover:border-[#d4ff3f] hover:bg-[#d4ff3f] hover:text-[#0b0c2a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4ff3f]"
                            onClick={() => settle(position - 1)}
                        >
                            <HiArrowLongLeft aria-hidden="true" />
                        </button>
                        <div role="group" aria-label="Choose a sneaker" className="flex items-center">
                            {products.map((item, i) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-label={`Show ${item.name}`}
                                    aria-current={i === activeIndex ? 'true' : undefined}
                                    className="group grid h-10 w-8 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#d4ff3f] sm:w-9"
                                    onClick={() => goToProduct(i)}
                                >
                                    <span
                                        className={cn(
                                            'block h-2 rounded-full transition-all duration-500',
                                            i === activeIndex
                                                ? 'w-6 bg-[#d4ff3f]'
                                                : 'w-2 bg-[#f3f0e6]/40 group-hover:bg-[#f3f0e6]/80',
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            aria-label="Next sneaker"
                            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#f3f0e6]/30 text-xl transition-colors hover:border-[#d4ff3f] hover:bg-[#d4ff3f] hover:text-[#0b0c2a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4ff3f]"
                            onClick={() => settle(position + 1)}
                        >
                            <HiArrowLongRight aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CoverflowProductSlider

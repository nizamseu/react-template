// TiltMotionProductCard

// ProductQuickView04 · E-commerce & Marketplaces › Product Card / Quick View

// Description:
// A playful, tactile sneaker showcase for the fictional footwear brand Stride Lab, headed
// "Built to be tested." Three product cards, each on its own vivid colour, tilt in 3D as
// the pointer moves over them, with a moving glare, layered depth, US size chips and an
// "Add to cart" button that confirms with "Added ✓". Use it for product drops, launch
// pages or any small hero set of products that deserves extra attention.

// Design:
// - Warm off-white #f4f1ec section with black type; heavy uppercase heading (text-5xl →
//   lg:text-8xl) with mono lab labels; "See the lab notes" arrow link on the right
// - Cards: rounded-[32px] panels in orange #ff6b35, blue #00a6fb and purple #9b5de5 with
//   black text, a huge black/10 model number watermark, a rounded-[24px] aspect-4/3 photo
// - Depth: preserve-3d card with the photo at translateZ(60px), text at 30-40px and a
//   soft drop shadow so layers separate while tilting
// - Chips: 40px round buttons (black when selected, struck-through at 40% when sold out);
//   full-width black pill button, disabled until a size is picked
// - Responsive: single centred column (max-w-md) below lg, then lg:grid-cols-3

// What it does:
// - Pointer position feeds useMotionValue → useSpring → useTransform for rotateX/rotateY
//   (±10°/±12°) and a radial glare; leaving resets to flat; tilt and glare are off for
//   touch pointers and when useReducedMotion() is true
// - Each card keeps its own selected size (aria-pressed chips, sold-out sizes disabled) and
//   added flag; "Add to cart · US 9" → "Added ✓", reset when the size changes
// - "See the lab notes" links to #stride-lab-notes

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TiltMotionProductCard from '@/TestComponent/PageSections/ecommerce/ProductQuickView04';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <TiltMotionProductCard />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const SIZES = [7, 8, 9, 10, 11, 12]

const products = [
    {
        id: 'sprint-canvas',
        code: 'SL-01',
        name: 'Sprint Canvas Low',
        tagline: 'Vulcanised sole · 280 g',
        price: 110,
        bg: '#ff6b35',
        soldOut: [7],
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
        alt: 'Maroon canvas low-top sneaker on a yellow background',
    },
    {
        id: 'vapor-knit',
        code: 'SL-02',
        name: 'Vapor Knit Runner',
        tagline: 'Foam midsole · 8 mm drop',
        price: 165,
        bg: '#00a6fb',
        soldOut: [12],
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
        alt: 'Black knit running sneaker floating against a white background',
    },
    {
        id: 'terrace-suede',
        code: 'SL-03',
        name: 'Terrace Suede Trainer',
        tagline: 'Gum sole · Italian suede',
        price: 140,
        bg: '#9b5de5',
        soldOut: [8, 11],
        image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80',
        alt: 'Teal suede trainer on a pastel backdrop with oranges',
    },
]

function TiltCard({ product, index, reduce }) {
    const [shoeSize, setShoeSize] = useState(null)
    const [added, setAdded] = useState(false)

    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.6 })
    const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.6 })
    const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10])
    const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12])
    const glareX = useTransform(sx, [-0.5, 0.5], ['10%', '90%'])
    const glareY = useTransform(sy, [-0.5, 0.5], ['10%', '90%'])
    const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.45), transparent 55%)`

    const onPointerMove = (event) => {
        if (reduce || event.pointerType === 'touch') return
        const rect = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - rect.left) / rect.width - 0.5)
        y.set((event.clientY - rect.top) / rect.height - 0.5)
    }

    const onPointerLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <div className="mx-auto w-full max-w-md [perspective:1200px] lg:max-w-none">
            <motion.article
                className="group relative flex h-full flex-col rounded-[32px] p-5 text-black shadow-[0_40px_60px_-40px_rgba(0,0,0,0.55)] sm:p-6"
                style={{
                    backgroundColor: product.bg,
                    rotateX: reduce ? 0 : rotateX,
                    rotateY: reduce ? 0 : rotateY,
                    transformStyle: 'preserve-3d',
                }}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
            >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
                    <span className="absolute -bottom-10 -right-4 select-none text-[11rem] font-black leading-none tracking-tighter text-black/10">
                        0{index + 1}
                    </span>
                    {!reduce && (
                        <motion.div
                            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            style={{ backgroundImage: glare }}
                        />
                    )}
                </div>

                <div className="relative flex items-center justify-between" style={{ transform: 'translateZ(30px)' }}>
                    <span className="rounded-full bg-black px-3 py-1 font-mono text-[11px] font-bold tracking-[0.2em] text-white">
                        {product.code}
                    </span>
                    <span className="text-2xl font-black tabular-nums">${product.price}</span>
                </div>

                <div
                    className="relative mt-5 aspect-[4/3] overflow-hidden rounded-[24px] bg-black/10 shadow-[0_30px_40px_-24px_rgba(0,0,0,0.6)]"
                    style={{ transform: 'translateZ(60px)' }}
                >
                    <img src={product.image} alt={product.alt} loading="lazy" className="size-full object-cover" />
                </div>

                <div className="relative mt-6 flex flex-1 flex-col" style={{ transform: 'translateZ(40px)' }}>
                    <h3 className="text-2xl font-black uppercase leading-none tracking-tight sm:text-3xl text-black">{product.name}</h3>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-black/70">{product.tagline}</p>

                    <fieldset className="mt-5">
                        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/70">
                            Size (US){shoeSize ? ` · ${shoeSize} selected` : ''}
                        </legend>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {SIZES.map((s) => {
                                const soldOut = product.soldOut.includes(s)
                                const selected = shoeSize === s
                                return (
                                    <button
                                        key={s}
                                        type="button"
                                        aria-pressed={selected}
                                        aria-label={soldOut ? `US ${s}, sold out` : `US ${s}`}
                                        disabled={soldOut}
                                        className={cn(
                                            'flex size-10 items-center justify-center rounded-full text-sm font-bold tabular-nums transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
                                            selected ? 'bg-black text-white' : 'bg-black/10 hover:bg-black/20',
                                            soldOut && 'cursor-not-allowed line-through opacity-40 hover:bg-black/10',
                                        )}
                                        onClick={() => {
                                            setShoeSize(s)
                                            setAdded(false)
                                        }}
                                    >
                                        {s}
                                    </button>
                                )
                            })}
                        </div>
                    </fieldset>

                    <div className="mt-auto pt-6">
                        <button
                            type="button"
                            aria-pressed={added}
                            disabled={!shoeSize}
                            className={cn(
                                'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:bg-black/25 disabled:text-black/60',
                                added ? 'bg-white text-black' : 'bg-black text-white hover:bg-black/85',
                            )}
                            onClick={() => setAdded(true)}
                        >
                            {!shoeSize ? 'Select a size' : added ? 'Added ✓' : `Add to cart · US ${shoeSize}`}
                        </button>
                    </div>
                </div>
            </motion.article>
        </div>
    )
}

export function TiltMotionProductCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('overflow-hidden bg-[#f4f1ec] py-16 text-black md:py-24 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/60">
                            Stride Lab / Drop 07 — Field tests
                        </p>
                        <h2 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-tighter sm:text-7xl lg:text-8xl text-black">
                            Built to be
                            <br />
                            tested.
                        </h2>
                    </div>
                    <div className="max-w-sm lg:pb-2">
                        <p className="text-base leading-relaxed text-black/70">
                            Three prototypes that survived 1,200 km of lab and street testing. Move your cursor over a
                            card to inspect it from every angle.
                        </p>
                        <a
                            href="#stride-lab-notes"
                            className="group mt-4 inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                        >
                            See the lab notes
                            <span className="flex size-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                                <HiArrowUpRight className="size-4" />
                            </span>
                        </a>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-3">
                    {products.map((product, index) => (
                        <TiltCard key={product.id} product={product} index={index} reduce={reduce} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TiltMotionProductCard

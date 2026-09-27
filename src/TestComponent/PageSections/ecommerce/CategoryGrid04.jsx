// TypographicIndexCategoryGrid

// CategoryGrid04 · E-commerce & Marketplaces › Category Grid

// Description:
// A quiet, typographic category index for the furniture house Atelier Nord. Under "The
// collection, indexed." seven numbered rows (01 Sofas to 07 Objects) list each family in
// huge serif type with its materials and a mono piece count; on desktop a photo preview
// floats after the cursor. Ends with a "View the full catalogue" link. Use it for premium
// furniture, design or gallery stores that want an editorial, text-led entry point.

// Design:
// - Full-width list of rows with 1px ink hairlines; each row is a grid of number · name ·
//   count (+ materials column on lg and an arrow on md+)
// - Paper #ecebe7 background, ink #161616 text, muted #161616/55 for meta; the only image
//   surfaces are the preview card and mobile thumbnails
// - Serif names text-4xl → md:text-7xl, leading-none, turn italic and slide 12px on hover;
//   numbers, counts and header meta in mono uppercase
// - md+: a 288×352 floating preview follows the pointer on a spring (framer-motion
//   useMotionValue + useSpring) and cross-fades between photos; other rows dim to 30%
// - Below md: every row shows a 48×56 inline thumbnail instead of the preview; reduced
//   motion makes the preview track the pointer directly without the spring

// What it does:
// - active state = the hovered or focused row; pointer movement over the list updates
//   the preview position, leaving the list hides it
// - Keyboard focus (:focus-visible) on a row also shows the preview, parked beside that
//   row; blur hides it
// - Rows link to #atelier-<family> (e.g. #atelier-sofas); the footer link points to
//   #atelier-catalogue

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TypographicIndexCategoryGrid from '@/TestComponent/PageSections/ecommerce/CategoryGrid04';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <TypographicIndexCategoryGrid />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const families = [
    {
        id: 'sofas',
        name: 'Sofas',
        count: 38,
        materials: 'Aniline leather, bouclé, oak frames',
        image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
        alt: 'Tan leather sofa in a bright room',
    },
    {
        id: 'lounge',
        name: 'Lounge',
        count: 24,
        materials: 'Easy chairs, daybeds, ottomans',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
        alt: 'Modern living room with lounge chairs and a floor lamp',
    },
    {
        id: 'stools',
        name: 'Stools',
        count: 17,
        materials: 'Solid ash, walnut, turned legs',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
        alt: 'Wooden three-legged stool against a blue wall',
    },
    {
        id: 'lighting',
        name: 'Lighting',
        count: 41,
        materials: 'Pendants, table and floor lamps',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
        alt: 'White pendant lamp hanging in front of a teal wall',
    },
    {
        id: 'storage',
        name: 'Storage',
        count: 22,
        materials: 'Dressers, sideboards, shelving',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        alt: 'Living room with a navy sofa and a white dresser',
    },
    {
        id: 'textiles',
        name: 'Textiles',
        count: 56,
        materials: 'Wool throws, linen cushions, rugs',
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80',
        alt: 'Beige sofa dressed with linen cushions and pampas grass',
    },
    {
        id: 'objects',
        name: 'Objects',
        count: 73,
        materials: 'Stoneware, vessels, candle holders',
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        alt: 'White stoneware cups and vessels',
    },
]

const totalPieces = families.reduce((sum, family) => sum + family.count, 0)

export function TypographicIndexCategoryGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [active, setActive] = useState(null)
    const listRef = useRef(null)
    const reduceMotion = useReducedMotion()
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 })
    const springY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 })

    const moveTo = (clientX, clientY, jump = false) => {
        const rect = listRef.current?.getBoundingClientRect()
        if (!rect) return
        const nextX = clientX - rect.left
        const nextY = clientY - rect.top
        if (jump) {
            x.jump(nextX)
            y.jump(nextY)
            springX.jump(nextX)
            springY.jump(nextY)
        } else {
            x.set(nextX)
            y.set(nextY)
        }
    }

    const handleRowEnter = (event, index) => {
        if (event.pointerType !== 'mouse') return
        moveTo(event.clientX, event.clientY, active === null)
        setActive(index)
    }

    const handleRowFocus = (event, index) => {
        if (!event.currentTarget.matches?.(':focus-visible')) return
        const row = event.currentTarget.getBoundingClientRect()
        moveTo(row.right - 220, row.top + row.height / 2, true)
        setActive(index)
    }

    const visible = active !== null

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#ecebe7] px-4 py-16 font-normal text-[#161616] sm:px-6 md:py-24 lg:px-10 text-base',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-2 gap-y-2 border-b border-[#161616] pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#161616]/60 md:grid-cols-3">
                    <span className="text-[#161616]">Atelier Nord</span>
                    <span className="text-right md:text-center">Index — AW 2026</span>
                    <span className="hidden text-right md:block">{totalPieces} pieces · 7 families</span>
                </div>

                <div className="mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
                    <h2 className="max-w-3xl font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#161616] sm:text-5xl md:text-6xl">
                        The collection, <em>indexed.</em>
                    </h2>
                    <p className="max-w-xs text-sm leading-relaxed text-[#161616]/65">
                        Every piece is made to order in our Tampere workshop and delivered
                        white-glove within six weeks.
                    </p>
                </div>

                <ul
                    ref={listRef}
                    className="relative mt-10 border-t border-[#161616] md:mt-16"
                    onPointerMove={(event) => {
                        if (event.pointerType === 'mouse') moveTo(event.clientX, event.clientY)
                    }}
                    onPointerLeave={() => setActive(null)}
                >
                    {families.map((family, index) => {
                        const isActive = active === index
                        const number = String(index + 1).padStart(2, '0')

                        return (
                            <li key={family.id} className="border-b border-[#161616]/80">
                                <a
                                    href={`#atelier-${family.id}`}
                                    className={cn(
                                        'group grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 py-4 transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161616] sm:gap-5 md:grid-cols-[3rem_minmax(0,1fr)_auto_2.5rem] md:py-6 lg:grid-cols-[3rem_minmax(0,1fr)_16rem_auto_2.5rem]',
                                        visible && !isActive && 'md:opacity-30',
                                    )}
                                    onPointerEnter={(event) => handleRowEnter(event, index)}
                                    onFocus={(event) => handleRowFocus(event, index)}
                                    onBlur={() => setActive(null)}
                                >
                                    <span className="self-start pt-2 font-mono text-xs text-[#161616]/55 md:pt-4">
                                        {number}
                                    </span>
                                    <span className="flex min-w-0 items-center gap-4">
                                        <img
                                            src={family.image}
                                            alt={family.alt}
                                            loading="lazy"
                                            className="h-14 w-12 shrink-0 object-cover md:hidden"
                                        />
                                        <span className="truncate font-serif text-4xl leading-[1.1] tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 md:text-7xl md:group-hover:italic">
                                            {family.name}
                                        </span>
                                    </span>
                                    <span className="hidden text-sm leading-snug text-[#161616]/60 lg:block">
                                        {family.materials}
                                    </span>
                                    <span className="text-right font-mono text-xs uppercase tracking-wider md:text-sm">
                                        {family.count}
                                        <span className="hidden sm:inline"> pcs</span>
                                    </span>
                                    <span
                                        className="hidden h-10 w-10 place-items-center rounded-full border border-[#161616]/30 transition-colors duration-300 group-hover:bg-[#161616] group-hover:text-[#ecebe7] md:grid"
                                        aria-hidden="true"
                                    >
                                        <HiArrowUpRight className="h-4 w-4" />
                                    </span>
                                </a>
                            </li>
                        )
                    })}

                    <motion.li
                        className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
                        style={{ x: reduceMotion ? x : springX, y: reduceMotion ? y : springY }}
                        aria-hidden="true"
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                opacity: visible ? 1 : 0,
                                scale: visible ? 1 : 0.85,
                                rotate: visible || reduceMotion ? 0 : -6,
                            }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="relative -ml-36 -mt-44 h-88 w-72 overflow-hidden bg-[#d6d3cc] shadow-[0_40px_80px_-30px_rgba(22,22,22,0.55)]"
                        >
                            {families.map((family, index) => (
                                <motion.img
                                    key={family.id}
                                    src={family.image}
                                    alt=""
                                    loading="lazy"
                                    initial={false}
                                    animate={{
                                        opacity: active === index ? 1 : 0,
                                        scale: active === index || reduceMotion ? 1 : 1.12,
                                    }}
                                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            ))}
                            <span className="absolute bottom-3 left-3 bg-[#ecebe7] px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[#161616]">
                                {visible ? `${families[active].count} pieces` : ''}
                            </span>
                        </motion.div>
                    </motion.li>
                </ul>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#161616]/55">
                        <span className="hidden md:inline">Hover a family to preview · </span>
                        Free design consultation on every order
                    </p>
                    <a
                        href="#atelier-catalogue"
                        className="group/link inline-flex min-h-10 items-center gap-3 self-start font-serif text-xl italic text-[#161616] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#161616]"
                    >
                        View the full catalogue
                        <HiArrowLongRight
                            className="h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default TypographicIndexCategoryGrid

// PastelArchCategoryGrid

// CategoryGrid05 · E-commerce & Marketplaces › Category Grid

// Description:
// A soft, feminine category grid for the beauty brand Bloom Ritual. Under "Rituals for
// skin, hair & body" shoppers filter ten categories (Cleansers, Facial Masks, Complexion,
// Glow & SPF, Hair Masks, Scalp & Oils, Colour Care, Bath & Soak, Body Mists, Body Oils)
// with All / Skin / Hair / Body tabs; each sits in an arch-shaped photo frame. Ends with
// "Take the 2-minute skin quiz". Use it on beauty, wellness or self-care storefronts.

// Design:
// - Grid grid-cols-2 → sm:grid-cols-3 → lg:grid-cols-5 (gap-y-10); tabs scroll sideways
//   if they ever outgrow a narrow screen
// - Blush #fbf3ef page, plum-brown #3b2626 ink, rose #b76e79 accents; each card is a
//   pastel panel (peach, lavender, butter, sky, mint, pink) rounded-[28px]
// - Arch frames: aspect-[3/4] rounded-t-full images with an inset white/70 hairline arch;
//   a white group chip overlaps the base of the arch; serif names, tiny uppercase counts
// - Tabs are a rounded-full pill bar; the active pill is a plum background that glides
//   between tabs (framer-motion layoutId inside a per-instance LayoutGroup)
// - Filtering animates with AnimatePresence popLayout + layout cards (leavers fade/scale
//   out, the rest glide into place); hover lifts the panel and zooms the photo;
//   MotionConfig reducedMotion="user" drops the movement for reduced motion

// What it does:
// - filter state ("all" | "skin" | "hair" | "body") changes on tab click; tabs are
//   role="tab" with aria-selected, ArrowLeft / ArrowRight move between them
// - The visible list is derived with useMemo; tab labels show live counts per group
// - Cards link to #bloom-<category> (e.g. #bloom-cleansers); the quiz link points to
//   #bloom-skin-quiz

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PastelArchCategoryGrid from '@/TestComponent/PageSections/ecommerce/CategoryGrid05';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <PastelArchCategoryGrid />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tabs = [
    { id: 'all', label: 'All' },
    { id: 'skin', label: 'Skin' },
    { id: 'hair', label: 'Hair' },
    { id: 'body', label: 'Body' },
]

const categories = [
    {
        id: 'cleansers',
        name: 'Cleansers',
        group: 'skin',
        count: 18,
        bg: 'bg-[#f7d9cf]',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        alt: 'Skincare tube resting on soft white sheets',
    },
    {
        id: 'facial-masks',
        name: 'Facial Masks',
        group: 'skin',
        count: 12,
        bg: 'bg-[#e6dcf4]',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        alt: 'Woman relaxing during a facial treatment',
    },
    {
        id: 'complexion',
        name: 'Complexion',
        group: 'skin',
        count: 26,
        bg: 'bg-[#fbe5c6]',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
        alt: 'Smiling woman with a fresh, glowing complexion in a red sweater',
    },
    {
        id: 'glow-spf',
        name: 'Glow & SPF',
        group: 'skin',
        count: 9,
        bg: 'bg-[#d6e8f3]',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        alt: 'Portrait of a woman with luminous skin in soft blue light',
    },
    {
        id: 'hair-masks',
        name: 'Hair Masks',
        group: 'hair',
        count: 11,
        bg: 'bg-[#d8ecdc]',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        alt: 'Woman with soft, glossy brown hair in a striped shirt',
    },
    {
        id: 'scalp-oils',
        name: 'Scalp & Oils',
        group: 'hair',
        count: 14,
        bg: 'bg-[#f6d7e2]',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
        alt: 'Woman with long glossy hair against a dark backdrop',
    },
    {
        id: 'colour-care',
        name: 'Colour Care',
        group: 'hair',
        count: 8,
        bg: 'bg-[#fde0cc]',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
        alt: 'Portrait of a smiling woman with vivid red hair',
    },
    {
        id: 'bath-soak',
        name: 'Bath & Soak',
        group: 'body',
        count: 16,
        bg: 'bg-[#e4def6]',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
        alt: 'Candle glowing softly in a calm, cosy corner',
    },
    {
        id: 'body-mists',
        name: 'Body Mists',
        group: 'body',
        count: 7,
        bg: 'bg-[#f9dad5]',
        image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=600&q=80',
        alt: 'White vases holding a pink blossom branch',
    },
    {
        id: 'body-oils',
        name: 'Body Oils',
        group: 'body',
        count: 10,
        bg: 'bg-[#dcebd6]',
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
        alt: 'White ceramic vase holding a fresh green plant',
    },
]

const groupLabel = { skin: 'Skin', hair: 'Hair', body: 'Body' }

export function PastelArchCategoryGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [filter, setFilter] = useState('all')
    const tabRefs = useRef([])
    const uid = useId()

    const visible = useMemo(
        () => (filter === 'all' ? categories : categories.filter((category) => category.group === filter)),
        [filter],
    )

    const counts = useMemo(() => {
        const result = { all: categories.length }
        categories.forEach((category) => {
            result[category.group] = (result[category.group] ?? 0) + 1
        })
        return result
    }, [])

    const handleKeyDown = (event, index) => {
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
        if (next === null) return
        event.preventDefault()
        setFilter(tabs[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fbf3ef] px-4 py-16 font-normal text-[#3b2626] sm:px-6 md:py-24 lg:px-10 text-base',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f6d7e2] opacity-70 blur-3xl"
                aria-hidden="true"
            />
            <MotionConfig reducedMotion="user">
                <div className="relative mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#b76e79]">
                            Bloom Ritual · Shop by ritual
                        </p>
                        <h2 className="mt-4 text-balance font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#3b2626] sm:text-5xl md:text-6xl">
                            Rituals for skin, <em className="text-[#b76e79]">hair</em> &amp; body
                        </h2>
                        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#3b2626]/70">
                            Clean, fragrance-optional formulas made in small batches. Every
                            category ships with a free travel-size sample.
                        </p>
                    </div>

                    <LayoutGroup id={uid}>
                        <div className="mt-10 flex justify-center">
                            <div
                                role="tablist"
                                aria-label="Filter categories"
                                className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-[#3b2626]/10 bg-white/70 p-1.5 shadow-[0_10px_30px_-18px_rgba(59,38,38,0.45)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >
                                {tabs.map((tab, index) => {
                                    const isActive = tab.id === filter

                                    return (
                                        <button
                                            key={tab.id}
                                            ref={(node) => {
                                                tabRefs.current[index] = node
                                            }}
                                            type="button"
                                            role="tab"
                                            aria-selected={isActive}
                                            aria-controls={`${uid}-grid`}
                                            tabIndex={isActive ? 0 : -1}
                                            className={cn(
                                                'relative min-h-10 shrink-0 rounded-full px-4 text-sm font-medium text-[#3b2626]/70 transition-colors duration-300 hover:text-[#3b2626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79] sm:px-5',
                                                isActive && 'text-[#fbf3ef] hover:text-[#fbf3ef]',
                                            )}
                                            onClick={() => setFilter(tab.id)}
                                            onKeyDown={(event) => handleKeyDown(event, index)}
                                        >
                                            {isActive && (
                                                <motion.span
                                                    layoutId="bloom-tab-pill"
                                                    className="absolute inset-0 rounded-full bg-[#3b2626]"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <span className="relative">
                                                {tab.label}
                                                <span
                                                    className={cn(
                                                        'ml-1.5 text-[11px] text-[#b76e79]',
                                                        isActive && 'text-[#f6d7e2]',
                                                    )}
                                                >
                                                    {counts[tab.id]}
                                                </span>
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <motion.ul
                            id={`${uid}-grid`}
                            role="tabpanel"
                            aria-label={`${tabs.find((tab) => tab.id === filter)?.label} categories`}
                            className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5"
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                {visible.map((category) => (
                                    <motion.li
                                        key={category.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.92 }}
                                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <a
                                            href={`#bloom-${category.id}`}
                                            className="group block rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b76e79]"
                                        >
                                            <div
                                                className={cn(
                                                    'relative rounded-[28px] p-2.5 pb-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 sm:p-3 sm:pb-6',
                                                    category.bg,
                                                )}
                                            >
                                                <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-white/40">
                                                    <img
                                                        src={category.image}
                                                        alt={category.alt}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                                                    />
                                                    <span
                                                        className="pointer-events-none absolute inset-2 rounded-t-full border border-white/70"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3b2626] shadow-sm sm:bottom-3">
                                                    {groupLabel[category.group]}
                                                </span>
                                            </div>
                                            <p className="mt-4 text-center font-serif text-lg leading-tight text-[#3b2626] sm:text-xl">
                                                {category.name}
                                            </p>
                                            <p className="mt-1 text-center text-[11px] uppercase tracking-[0.2em] text-[#3b2626]/55">
                                                {category.count} products
                                            </p>
                                        </a>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </motion.ul>
                    </LayoutGroup>

                    <div className="mt-14 flex justify-center">
                        <a
                            href="#bloom-skin-quiz"
                            className="group/quiz inline-flex min-h-11 items-center gap-3 rounded-full border border-[#3b2626]/15 bg-white px-6 text-sm font-medium text-[#3b2626] transition-colors duration-300 hover:bg-[#3b2626] hover:text-[#fbf3ef] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b76e79]"
                        >
                            <span>
                                <span className="hidden sm:inline">Not sure where to start? </span>
                                Take the 2-minute skin quiz
                            </span>
                            <HiArrowLongRight
                                className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/quiz:translate-x-1"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default PastelArchCategoryGrid

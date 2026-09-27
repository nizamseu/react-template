// DarkIconRailCategoryGrid

// CategoryGrid03 · E-commerce & Marketplaces › Category Grid

// Description:
// A dark, techy category picker for the electronics store Voltline. Under "Find your next
// upgrade." six icon tiles (Phones, Laptops, Audio, Wearables, Cameras, Gaming) show a
// product count and a "from $" price; choosing one lights it up and opens a detail strip
// with its three top picks and a "Shop all <category>" link. Use it on gadget or
// electronics storefronts where categories are best recognised by icon.

// Design:
// - Mobile to md: a horizontal scroll-snap rail (snap-x, 172px tiles, hidden scrollbar,
//   bleeds to the screen edge); lg: a 6-column grid of equal tiles
// - #0b0b0f background with a faint 48px grid-line pattern and a lime #c6ff3d radial glow;
//   tiles are #14141b with white/10 borders, rounded-2xl
// - Selected tile: lime ring-2 plus an outer glow shadow-[0_0_48px_-12px_#c6ff3d], lime icon
//   chip with black icon; others show a white/5 icon chip and lift on hover
// - Mono uppercase labels (counts, "from $", "Top picks"), bold sans heading text-4xl →
//   md:text-6xl with a lime underline stroke
// - Detail strip: rounded-3xl panel, lime left rule, picks in 1 → md:3 columns; content
//   cross-fades and slides (AnimatePresence, reduced-motion safe)

// What it does:
// - selected state (default "audio") changes on tile click; tiles are role="tab" with
//   aria-selected, the strip is the role="tabpanel"
// - ArrowLeft / ArrowRight / Home / End move the selection and focus between tiles; on
//   the rail the chosen tile is scrolled to the centre (also once on mount for "audio")
// - Picks are text only; each pick and the "Shop all" link point to #shop-<category>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DarkIconRailCategoryGrid from '@/TestComponent/PageSections/ecommerce/CategoryGrid03';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <DarkIconRailCategoryGrid />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuCamera, LuGamepad2, LuHeadphones, LuLaptop, LuSmartphone, LuWatch } from 'react-icons/lu';
import { HiArrowRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const categories = [
    {
        id: 'phones',
        name: 'Phones',
        icon: LuSmartphone,
        count: 142,
        from: 199,
        tagline: 'Flagships, foldables and rugged daily drivers.',
        picks: [
            { name: 'Voltline Arc 9 Pro', spec: '6.7" 120Hz OLED · 512 GB', price: 1099 },
            { name: 'Voltline Fold Mini', spec: 'Pocket foldable · 256 GB', price: 1349 },
            { name: 'Voltline Terra X', spec: 'IP69 rugged · 6,000 mAh', price: 429 },
        ],
    },
    {
        id: 'laptops',
        name: 'Laptops',
        icon: LuLaptop,
        count: 96,
        from: 549,
        tagline: 'Thin-and-lights, creator rigs and student picks.',
        picks: [
            { name: 'Voltline Book 14 Air', spec: '1.1 kg · 20 h battery', price: 1199 },
            { name: 'Voltline Studio 16', spec: 'RTX 4070 · 3.2K mini-LED', price: 2399 },
            { name: 'Voltline Campus 13', spec: 'Fanless · 16 GB RAM', price: 649 },
        ],
    },
    {
        id: 'audio',
        name: 'Audio',
        icon: LuHeadphones,
        count: 188,
        from: 39,
        tagline: 'Noise cancelling, studio monitors and earbuds.',
        picks: [
            { name: 'Voltline Pulse ANC', spec: 'Over-ear · 50 h battery', price: 249 },
            { name: 'Voltline Buds Neo', spec: 'Hybrid ANC · IPX5', price: 129 },
            { name: 'Voltline Monitor M2', spec: 'Open-back · 40 mm drivers', price: 189 },
        ],
    },
    {
        id: 'wearables',
        name: 'Wearables',
        icon: LuWatch,
        count: 64,
        from: 79,
        tagline: 'Smartwatches, rings and trackers for every sport.',
        picks: [
            { name: 'Voltline Pace 3', spec: 'Dual-band GPS · 14-day battery', price: 299 },
            { name: 'Voltline Loop Ring', spec: 'Sleep + HRV · titanium', price: 219 },
            { name: 'Voltline Band 5', spec: 'AMOLED · SpO₂', price: 79 },
        ],
    },
    {
        id: 'cameras',
        name: 'Cameras',
        icon: LuCamera,
        count: 57,
        from: 149,
        tagline: 'Mirrorless bodies, action cams and lenses.',
        picks: [
            { name: 'Voltline Frame Z6', spec: '33 MP full-frame · 4K120', price: 1899 },
            { name: 'Voltline Go Action 4', spec: '5.3K · HyperSteady', price: 349 },
            { name: 'Voltline 35mm f/1.8', spec: 'Prime lens · 280 g', price: 499 },
        ],
    },
    {
        id: 'gaming',
        name: 'Gaming',
        icon: LuGamepad2,
        count: 113,
        from: 29,
        tagline: 'Handhelds, controllers and low-latency gear.',
        picks: [
            { name: 'Voltline Deck OLED', spec: 'Handheld PC · 1 TB', price: 649 },
            { name: 'Voltline Pro Pad', spec: 'Hall-effect sticks · 1 kHz', price: 89 },
            { name: 'Voltline Kast 27', spec: '27" QHD · 240 Hz', price: 379 },
        ],
    },
]

const formatPrice = (value) => `$${value.toLocaleString('en-US')}`

export function DarkIconRailCategoryGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [selected, setSelected] = useState('audio')
    const tabRefs = useRef([])
    const railRef = useRef(null)
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const active = categories.find((category) => category.id === selected) ?? categories[0]

    const centerInRail = (index, behavior) => {
        const rail = railRef.current
        const node = tabRefs.current[index]
        if (!rail || !node || rail.scrollWidth <= rail.clientWidth) return
        rail.scrollTo({ left: node.offsetLeft - (rail.clientWidth - node.offsetWidth) / 2, behavior })
    }

    useEffect(() => {
        centerInRail(categories.findIndex((category) => category.id === 'audio'), 'auto')
    }, [])

    const selectIndex = (index) => {
        const next = (index + categories.length) % categories.length
        setSelected(categories[next].id)
        tabRefs.current[next]?.focus({ preventScroll: true })
        centerInRail(next, reduceMotion ? 'auto' : 'smooth')
    }

    const handleKeyDown = (event, index) => {
        if (event.key === 'ArrowRight') selectIndex(index + 1)
        else if (event.key === 'ArrowLeft') selectIndex(index - 1)
        else if (event.key === 'Home') selectIndex(0)
        else if (event.key === 'End') selectIndex(categories.length - 1)
        else return
        event.preventDefault()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0b0b0f] px-4 py-16 font-normal text-white sm:px-6 md:py-24 lg:px-10 text-base',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-[#c6ff3d]/15 blur-3xl"
                aria-hidden="true"
            />

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#c6ff3d]">
                            Voltline / Shop by category
                        </p>
                        <h2 className="mt-4 text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl">
                            Find your next{' '}
                            <span className="relative inline-block">
                                upgrade.
                                <span
                                    className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-[#c6ff3d]"
                                    aria-hidden="true"
                                />
                            </span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-white/60">
                        660 in-stock devices, 2-year Voltline Care on everything and next-day
                        delivery before 9 pm.
                    </p>
                </div>

                <div
                    ref={railRef}
                    role="tablist"
                    aria-label="Voltline product categories"
                    className="relative -mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-8 pt-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mt-12 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
                >
                    {categories.map((category, index) => {
                        const Icon = category.icon
                        const isActive = category.id === selected

                        return (
                            <button
                                key={category.id}
                                ref={(node) => {
                                    tabRefs.current[index] = node
                                }}
                                type="button"
                                role="tab"
                                id={`${uid}-tab-${category.id}`}
                                aria-selected={isActive}
                                aria-controls={`${uid}-panel`}
                                tabIndex={isActive ? 0 : -1}
                                className={cn(
                                    'group relative flex min-w-[172px] shrink-0 snap-start flex-col items-start rounded-2xl border border-white/10 bg-[#14141b] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6ff3d] lg:min-w-0',
                                    isActive &&
                                        'border-transparent bg-[#17181d] shadow-[0_0_48px_-12px_#c6ff3d] ring-2 ring-[#c6ff3d] hover:translate-y-0 hover:border-transparent',
                                )}
                                onClick={() => setSelected(category.id)}
                                onKeyDown={(event) => handleKeyDown(event, index)}
                            >
                                <span
                                    className={cn(
                                        'grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-white/80 transition-colors duration-300 group-hover:text-white',
                                        isActive && 'bg-[#c6ff3d] text-black group-hover:text-black',
                                    )}
                                >
                                    <Icon className="h-6 w-6" aria-hidden="true" />
                                </span>
                                <span className="mt-6 text-lg font-semibold tracking-tight text-white">
                                    {category.name}
                                </span>
                                <span className="mt-1 font-mono text-[11px] uppercase tracking-wider text-white/50">
                                    {category.count} products
                                </span>
                                <span
                                    className={cn(
                                        'mt-4 font-mono text-xs text-white/70',
                                        isActive && 'text-[#c6ff3d]',
                                    )}
                                >
                                    from {formatPrice(category.from)}
                                </span>
                                <span
                                    className={cn(
                                        'absolute right-4 top-4 h-2 w-2 rounded-full bg-white/15',
                                        isActive && 'bg-[#c6ff3d] shadow-[0_0_12px_#c6ff3d]',
                                    )}
                                    aria-hidden="true"
                                />
                            </button>
                        )
                    })}
                </div>
                <p className="-mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 lg:hidden" aria-hidden="true">
                    Swipe for more →
                </p>

                <div
                    role="tabpanel"
                    id={`${uid}-panel`}
                    aria-labelledby={`${uid}-tab-${active.id}`}
                    className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] lg:mt-10"
                >
                    <span className="absolute inset-y-0 left-0 w-1 bg-[#c6ff3d]" aria-hidden="true" />
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="grid gap-6 p-6 pl-7 md:p-8 md:pl-10 lg:grid-cols-[minmax(0,15rem)_1fr_auto] lg:items-center lg:gap-10"
                        >
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#c6ff3d]">
                                    Top picks · {active.name}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-white/60">{active.tagline}</p>
                            </div>
                            <ol className="grid gap-3 md:grid-cols-3">
                                {active.picks.map((pick, index) => (
                                    <li key={pick.name}>
                                        <a
                                            href={`#shop-${active.id}`}
                                            className="flex h-full flex-col rounded-xl border border-white/10 bg-[#0b0b0f]/60 p-4 transition-colors duration-200 hover:border-[#c6ff3d]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6ff3d]"
                                        >
                                            <span className="flex items-center justify-between gap-3 font-mono text-xs">
                                                <span className="text-[#c6ff3d]">0{index + 1}</span>
                                                <span className="text-sm text-white">{formatPrice(pick.price)}</span>
                                            </span>
                                            <span className="mt-3 text-sm font-semibold leading-snug text-white">{pick.name}</span>
                                            <span className="mt-1 font-mono text-[11px] leading-snug text-white/50">{pick.spec}</span>
                                        </a>
                                    </li>
                                ))}
                            </ol>
                            <a
                                href={`#shop-${active.id}`}
                                className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-[#c6ff3d] px-5 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6ff3d] lg:self-center"
                            >
                                Shop all {active.name.toLowerCase()}
                                <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default DarkIconRailCategoryGrid

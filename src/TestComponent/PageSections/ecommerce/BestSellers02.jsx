// TabbedCollectionBestSellers

// BestSellers02 · E-commerce & Marketplaces › Featured / Best Sellers

// Description:
// A crisp, utilitarian product shelf for the outdoor-gear brand Fieldhouse Goods. Under
// "Gear that earned its miles." three tabs (Best sellers, New in, Trending) swap a grid of
// four product cards, each with a SKU label, colour count, price and a round "+" quick-add
// that flips to ✓. A mono "Bag (n)" counter and a "View all gear" link sit in the header.
// Use it on apparel, outdoor or lifestyle stores to surface several curated collections.

// Design:
// - Product grid grid-cols-2 → lg:grid-cols-4 (gap-x-4, gap-y-10); header stacks on
//   mobile and becomes a row on md; the tab bar scrolls sideways if it runs out of room
// - Pure white background, black #0a0a0a ink, #f2f2f0 image wells, grey #6b6b6b
//   meta; the only filled surfaces are black (active quick-add, bag counter)
// - Mono uppercase labels everywhere (SKUs, counts, badges, tab indices); bold tight sans
//   heading text-4xl → md:text-6xl; images aspect-[4/5], no radius, 1px hairlines
// - Active tab gets a 2px black underline that glides between tabs (framer-motion
//   layoutId in a per-instance LayoutGroup)
// - Tab switch: AnimatePresence mode="wait" fades the old grid out and staggers the new
//   cards up; the quick-add icon rotates between + and ✓; reduced motion drops movement

// What it does:
// - tab state picks the collection (role="tab" + aria-selected, ArrowLeft / ArrowRight
//   move between tabs); the grid is the role="tabpanel"
// - added state (a Set of product ids) toggles on each quick-add button (aria-pressed);
//   the header "Bag (n)" count and a polite live region announce the change
// - Product images and names link to #fieldhouse-<product>; "View all gear" points to
//   #fieldhouse-all

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TabbedCollectionBestSellers from '@/TestComponent/PageSections/ecommerce/BestSellers02';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <TabbedCollectionBestSellers />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { HiArrowRight, HiCheck, HiPlus } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const collections = [
    {
        id: 'best',
        label: 'Best sellers',
        products: [
            {
                id: 'ridgeline-28',
                name: 'Ridgeline 28L Daypack',
                sku: 'FH-2041',
                colours: 4,
                price: 148,
                badge: 'No. 1 seller',
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
                alt: 'Navy canvas daypack with leather details',
            },
            {
                id: 'scree-trail',
                name: 'Scree Trail Sneaker',
                sku: 'FH-3310',
                colours: 3,
                price: 165,
                badge: '4.9 ★ · 2,140',
                image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80',
                alt: 'Pair of colourful trail sneakers displayed on a white box',
            },
            {
                id: 'summit-crew',
                name: 'Summit Merino Crew',
                sku: 'FH-1187',
                colours: 5,
                price: 120,
                badge: 'Restocked',
                image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
                alt: 'Rail of neutral merino knitwear',
            },
            {
                id: 'glare-polarised',
                name: 'Glare Polarised Shades',
                sku: 'FH-5022',
                colours: 2,
                price: 89,
                badge: 'Low stock',
                image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
                alt: 'Black polarised sunglasses',
            },
        ],
    },
    {
        id: 'new',
        label: 'New in',
        products: [
            {
                id: 'cinder-bomber',
                name: 'Cinder Insulated Bomber',
                sku: 'FH-4406',
                colours: 2,
                price: 210,
                badge: 'Just landed',
                image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
                alt: 'Terracotta insulated bomber jacket on a hanger',
            },
            {
                id: 'canyon-sling',
                name: 'Canyon Leather Sling',
                sku: 'FH-2095',
                colours: 2,
                price: 95,
                badge: 'New',
                image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=600&q=80',
                alt: 'Brown leather crossbody sling bag',
            },
            {
                id: 'basecamp-hoodie',
                name: 'Basecamp Fleece Hoodie',
                sku: 'FH-1240',
                colours: 3,
                price: 98,
                badge: 'New',
                image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
                alt: 'Grey fleece hoodie seen from the back',
            },
            {
                id: 'ridge-denim',
                name: 'Ridge Worn-In Denim',
                sku: 'FH-6120',
                colours: 2,
                price: 118,
                badge: 'Pre-order',
                image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
                alt: 'Person walking outdoors in light-wash distressed jeans',
            },
        ],
    },
    {
        id: 'trending',
        label: 'Trending',
        products: [
            {
                id: 'altitude-watch',
                name: 'Altitude GPS Watch',
                sku: 'FH-7001',
                colours: 2,
                price: 299,
                badge: '+312% this week',
                image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
                alt: 'Outdoor GPS smartwatch worn on a wrist',
            },
            {
                id: 'drift-poncho',
                name: 'Drift Knit Poncho',
                sku: 'FH-1302',
                colours: 2,
                price: 135,
                badge: 'Viral',
                image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
                alt: 'Cream knit poncho hanging on a hanger',
            },
            {
                id: 'market-tote',
                name: 'Woven Market Tote',
                sku: 'FH-2150',
                colours: 1,
                price: 78,
                badge: 'Trending',
                image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
                alt: 'Tan woven straw tote bag',
            },
            {
                id: 'everyday-tee',
                name: 'Everyday Merino Tee',
                sku: 'FH-1005',
                colours: 6,
                price: 68,
                badge: 'Staff fave',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
                alt: 'Man wearing a plain white merino t-shirt',
            },
        ],
    },
]

const productIndex = Object.fromEntries(
    collections.flatMap((collection) => collection.products.map((product) => [product.id, product])),
)

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
}

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export function TabbedCollectionBestSellers({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [tab, setTab] = useState('best')
    const [added, setAdded] = useState(() => new Set())
    const [announcement, setAnnouncement] = useState('')
    const tabRefs = useRef([])
    const uid = useId()
    const active = collections.find((collection) => collection.id === tab)

    const toggleAdded = (id) => {
        const wasAdded = added.has(id)
        setAdded((previous) => {
            const next = new Set(previous)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
        setAnnouncement(`${productIndex[id].name} ${wasAdded ? 'removed from' : 'added to'} your bag`)
    }

    const handleKeyDown = (event, index) => {
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % collections.length
        if (event.key === 'ArrowLeft') next = (index - 1 + collections.length) % collections.length
        if (next === null) return
        event.preventDefault()
        setTab(collections[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-16 font-normal text-[#0a0a0a] sm:px-6 md:py-24 lg:px-10 text-base', className)}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b6b6b]">
                        <span>
                            Fieldhouse Goods<span className="hidden sm:inline"> / FW26 / Index 03</span>
                        </span>
                        <span
                            className="inline-flex min-h-8 items-center gap-2 bg-[#0a0a0a] px-3 text-white"
                            aria-hidden="true"
                        >
                            Bag
                            <motion.span
                                key={added.size}
                                initial={{ y: -8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="tabular-nums"
                            >
                                ({added.size})
                            </motion.span>
                        </span>
                    </div>
                    <p className="sr-only" aria-live="polite">
                        {announcement}
                    </p>

                    <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <h2 className="max-w-2xl text-4xl font-bold leading-[0.98] tracking-tight text-[#0a0a0a] sm:text-5xl md:text-6xl">
                            Gear that earned its miles.
                        </h2>
                        <a
                            href="#fieldhouse-all"
                            className="group/link inline-flex min-h-10 items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.2em] text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a] md:self-auto"
                        >
                            <span className="border-b border-[#0a0a0a] pb-0.5">View all gear</span>
                            <HiArrowRight
                                className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                                aria-hidden="true"
                            />
                        </a>
                    </div>

                    <LayoutGroup id={uid}>
                        <div
                            role="tablist"
                            aria-label="Product collections"
                            className="mt-10 flex gap-6 overflow-x-auto border-b border-[#e5e5e5] [scrollbar-width:none] sm:gap-10 [&::-webkit-scrollbar]:hidden"
                        >
                            {collections.map((collection, index) => {
                                const isActive = collection.id === tab

                                return (
                                    <button
                                        key={collection.id}
                                        ref={(node) => {
                                            tabRefs.current[index] = node
                                        }}
                                        type="button"
                                        role="tab"
                                        id={`${uid}-tab-${collection.id}`}
                                        aria-selected={isActive}
                                        aria-controls={`${uid}-panel`}
                                        tabIndex={isActive ? 0 : -1}
                                        className={cn(
                                            'relative flex min-h-12 shrink-0 items-baseline gap-2 pb-3 pt-2 text-base font-semibold text-[#a3a3a3] transition-colors duration-200 hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a] sm:text-lg',
                                            isActive && 'text-[#0a0a0a]',
                                        )}
                                        onClick={() => setTab(collection.id)}
                                        onKeyDown={(event) => handleKeyDown(event, index)}
                                    >
                                        <span className="font-mono text-[10px] font-normal tracking-widest">
                                            0{index + 1}
                                        </span>
                                        {collection.label}
                                        {isActive && (
                                            <motion.span
                                                layoutId="fieldhouse-tab-underline"
                                                className="absolute inset-x-0 -bottom-px h-0.5 bg-[#0a0a0a]"
                                                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </LayoutGroup>

                    <div
                        role="tabpanel"
                        id={`${uid}-panel`}
                        aria-labelledby={`${uid}-tab-${active.id}`}
                        className="mt-8 min-h-[24rem]"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.ul
                                key={active.id}
                                variants={gridVariants}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6"
                            >
                                {active.products.map((product) => {
                                    const isAdded = added.has(product.id)

                                    return (
                                        <motion.li key={product.id} variants={cardVariants} className="group">
                                            <div className="relative aspect-[4/5] overflow-hidden bg-[#f2f2f0]">
                                                <a
                                                    href={`#fieldhouse-${product.id}`}
                                                    tabIndex={-1}
                                                    aria-hidden="true"
                                                    className="block h-full w-full"
                                                >
                                                    <img
                                                        src={product.image}
                                                        alt={product.alt}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                                                    />
                                                </a>
                                                <span className="pointer-events-none absolute left-2 top-2 bg-white px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-[#0a0a0a] sm:left-3 sm:top-3 sm:text-[10px]">
                                                    {product.badge}
                                                </span>
                                                <button
                                                    type="button"
                                                    aria-pressed={isAdded}
                                                    aria-label={
                                                        isAdded
                                                            ? `Remove ${product.name} from bag`
                                                            : `Quick add ${product.name} to bag`
                                                    }
                                                    className={cn(
                                                        'absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full border border-[#0a0a0a] bg-white text-[#0a0a0a] shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] transition-colors duration-200 hover:bg-[#0a0a0a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a] sm:bottom-3 sm:right-3',
                                                        isAdded && 'bg-[#0a0a0a] text-white',
                                                    )}
                                                    onClick={() => toggleAdded(product.id)}
                                                >
                                                    <AnimatePresence mode="wait" initial={false}>
                                                        <motion.span
                                                            key={isAdded ? 'added' : 'add'}
                                                            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                                                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                                            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                                                            transition={{ duration: 0.18 }}
                                                            className="grid place-items-center"
                                                        >
                                                            {isAdded ? (
                                                                <HiCheck className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <HiPlus className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </motion.span>
                                                    </AnimatePresence>
                                                </button>
                                            </div>
                                            <div className="mt-3 flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-semibold leading-snug text-[#0a0a0a] sm:text-base">
                                                        <a
                                                            href={`#fieldhouse-${product.id}`}
                                                            className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a]"
                                                        >
                                                            {product.name}
                                                        </a>
                                                    </h3>
                                                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#6b6b6b] sm:text-[11px]">
                                                        {product.sku} · {product.colours}{' '}
                                                        {product.colours === 1 ? 'colour' : 'colours'}
                                                    </p>
                                                </div>
                                                <p className="shrink-0 font-mono text-sm text-[#0a0a0a]">${product.price}</p>
                                            </div>
                                        </motion.li>
                                    )
                                })}
                            </motion.ul>
                        </AnimatePresence>
                    </div>

                    <p className="mt-12 border-t border-[#e5e5e5] pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b6b6b]">
                        Free returns for 60 days · Lifetime repairs on every pack
                    </p>
                </div>
            </MotionConfig>
        </section>
    )
}

export default TabbedCollectionBestSellers

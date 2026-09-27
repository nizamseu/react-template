// ModalQuickViewProductCard

// ProductQuickView01 · E-commerce & Marketplaces › Product Card / Quick View

// Description:
// A minimal black-and-white product grid for the fictional bag brand Studio Nomad, headed
// "Carry less, carry better." Each of the three product cards has a "Quick view" button
// that opens an animated modal with a thumbnail gallery, colour choice, quantity stepper
// and an "Add to cart" button that confirms with "Added to cart". Use it on collection or
// category pages where shoppers should inspect a product without leaving the grid.

// Design:
// - White section, neutral-950 ink, neutral-100 image wells; max-w-7xl container, header
//   with eyebrow, large tracking-tight heading and a "Shop all bags" underline link
// - Cards: aspect-4/5 rounded-2xl photos, white "Bestseller"/"New" pill, a frosted white
//   "Quick view" pill pinned to the bottom, name/price row and tiny colour dots below
// - Modal: black/55 blurred backdrop; full-screen white sheet on mobile, md: centred
//   max-w-5xl rounded-3xl two-column dialog (gallery | details) capped at 88vh
// - Motion: dialog springs up/fades in (framer-motion AnimatePresence), gallery images
//   crossfade; reduced motion falls back to a plain fade; photos zoom slightly on hover
// - Responsive: grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-3; "Quick view" is always
//   visible on touch screens and slides in on hover/focus where a fine pointer exists

// What it does:
// - activeId opens the modal for one product; opening resets image, colour, quantity (1)
//   and the added flag; the backdrop, close button and Escape all close it and focus
//   returns to the card button; Tab is kept inside the dialog
// - Thumbnails switch the main image (aria-pressed); swatches pick the colour; the stepper
//   clamps quantity to 1-10; "Add to cart" flips to "Added to cart" until colour/qty change
// - Body scroll is not locked; "Shop all bags" → #studio-nomad-bags and "Full details"
//   links point to #studio-nomad-<product id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ModalQuickViewProductCard from '@/TestComponent/PageSections/ecommerce/ProductQuickView01';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <ModalQuickViewProductCard />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiCheck, HiMinus, HiOutlineEye, HiPlus, HiStar, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&q=80`

const products = [
    {
        id: 'rolltop-24',
        name: 'Nomad Roll-Top Backpack',
        subtitle: '24L · Waxed canvas',
        badge: 'Bestseller',
        price: 148,
        rating: 4.8,
        reviews: 212,
        description:
            'A weatherproof roll-top in waxed canvas with a padded 16" laptop sleeve, magnetic buckle and a hidden passport pocket that sits against your back.',
        features: ['Padded 16" laptop sleeve', 'Water-resistant waxed canvas', 'Free lifetime repairs'],
        colors: [
            { name: 'Midnight Navy', hex: '#1f2a44' },
            { name: 'Moss', hex: '#4b5a3c' },
            { name: 'Sand', hex: '#cdb892' },
        ],
        images: [
            { src: photo('1553062407-98eeb64c6a62'), alt: 'Navy roll-top backpack standing upright' },
            { src: photo('1539635278303-d4002c07eae3'), alt: 'Two hikers with backpacks walking a mountain trail' },
            { src: photo('1449158743715-0a90ebb6d2d8'), alt: 'Wooden cabin among tall pine trees' },
        ],
    },
    {
        id: 'atlas-crossbody',
        name: 'Atlas Leather Crossbody',
        subtitle: 'Vegetable-tanned leather',
        badge: 'New',
        price: 196,
        rating: 4.9,
        reviews: 87,
        description:
            'Cut from a single hide of vegetable-tanned leather that darkens with wear. Fits a phone, passport and a paperback, with a detachable 48" strap.',
        features: ['Detachable adjustable strap', 'Solid brass hardware', 'Ages to a rich patina'],
        colors: [
            { name: 'Cognac', hex: '#9a5b2e' },
            { name: 'Espresso', hex: '#3b2518' },
            { name: 'Black', hex: '#111111' },
        ],
        images: [
            { src: photo('1600857062241-98e5dba7f214'), alt: 'Brown leather crossbody bag on a white background' },
            { src: photo('1483985988355-763728e1935b'), alt: 'Woman in sunglasses carrying shopping bags in the city' },
            { src: photo('1519501025264-65ba15a82390'), alt: 'City street glowing at dusk' },
        ],
    },
    {
        id: 'tide-tote',
        name: 'Tide Wicker Top-Handle',
        subtitle: 'Hand-woven rattan & leather',
        badge: 'Limited',
        price: 124,
        rating: 4.7,
        reviews: 154,
        description:
            'A rattan basket body hand-woven by a family workshop, topped with a smooth leather flap, a turn-lock clasp and a detachable shoulder strap. Summer, sorted.',
        features: ['Detachable shoulder strap', 'Cotton-lined interior', 'Made in small batches'],
        colors: [
            { name: 'Tangerine', hex: '#e8672a' },
            { name: 'Natural Rattan', hex: '#d8b98a' },
            { name: 'Charcoal', hex: '#3a3a3a' },
        ],
        images: [
            { src: photo('1590874103328-eac38a683ce7'), alt: 'Orange woven wicker handbag with a leather flap and top handle' },
            { src: photo('1533105079780-92b9be482077'), alt: 'White coastal houses above a blue sea' },
            { src: photo('1507525428034-b723cf961d3e'), alt: 'Beach at sunset with gentle waves' },
        ],
    },
]

export function ModalQuickViewProductCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const titleId = useId()
    const [activeId, setActiveId] = useState(null)
    const [imageIndex, setImageIndex] = useState(0)
    const [colorIndex, setColorIndex] = useState(0)
    const [qty, setQty] = useState(1)
    const [added, setAdded] = useState(false)
    const triggerRef = useRef(null)
    const closeRef = useRef(null)
    const dialogRef = useRef(null)

    const active = products.find((p) => p.id === activeId) || null

    const openQuickView = (id, event) => {
        triggerRef.current = event.currentTarget
        setActiveId(id)
        setImageIndex(0)
        setColorIndex(0)
        setQty(1)
        setAdded(false)
    }

    const close = useCallback(() => {
        setActiveId(null)
        if (triggerRef.current) triggerRef.current.focus()
    }, [])

    useEffect(() => {
        if (!activeId) return undefined
        if (closeRef.current) closeRef.current.focus()
        const onKey = (event) => {
            if (event.key === 'Escape') close()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [activeId, close])

    const trapFocus = (event) => {
        if (event.key !== 'Tab' || !dialogRef.current) return
        const nodes = dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }

    const changeQty = (delta) => {
        setQty((q) => Math.min(10, Math.max(1, q + delta)))
        setAdded(false)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('bg-white py-16 text-neutral-950 md:py-24 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
                            Studio Nomad · Fall ’26 carry
                        </p>
                        <h2 className="mt-4 text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl text-neutral-950">
                            Carry less,
                            <br />
                            carry better.
                        </h2>
                    </div>
                    <a
                        href="#studio-nomad-bags"
                        className="group inline-flex min-h-11 items-center gap-2 self-start border-b border-neutral-950 text-sm font-medium md:self-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"
                    >
                        Shop all bags
                        <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <article key={product.id} className="group">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
                                <img
                                    src={product.images[0].src}
                                    alt={product.images[0].alt}
                                    loading="lazy"
                                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                />
                                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-medium">
                                    {product.badge}
                                </span>
                                <button
                                    type="button"
                                    aria-haspopup="dialog"
                                    aria-label={`Quick view ${product.name}`}
                                    className="absolute inset-x-4 bottom-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white/90 text-sm font-medium text-neutral-950 shadow-lg backdrop-blur transition duration-300 hover:bg-neutral-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white pointer-fine:translate-y-3 pointer-fine:opacity-0 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-visible:translate-y-0 pointer-fine:focus-visible:opacity-100"
                                    onClick={(event) => openQuickView(product.id, event)}
                                >
                                    <HiOutlineEye aria-hidden="true" className="size-4" />
                                    Quick view
                                </button>
                            </div>
                            <div className="mt-4 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-medium text-neutral-950">{product.name}</h3>
                                    <p className="mt-0.5 text-sm text-neutral-500">{product.subtitle}</p>
                                </div>
                                <p className="text-base font-medium tabular-nums">${product.price}</p>
                            </div>
                            <div className="mt-3 flex items-center gap-1.5">
                                {product.colors.map((color) => (
                                    <span
                                        key={color.name}
                                        title={color.name}
                                        className="size-3 rounded-full ring-1 ring-black/10"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                ))}
                                <span className="ml-1 text-xs text-neutral-500">{product.colors.length} colours</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {active && (
                    <motion.div
                        key="quick-view"
                        className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <motion.div
                            aria-hidden="true"
                            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                            transition={{ duration: 0.25 }}
                            onClick={close}
                        />
                        <motion.div
                            ref={dialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={titleId}
                            className="relative h-dvh w-full overflow-hidden bg-white text-neutral-950 shadow-2xl md:h-auto md:max-h-[88vh] md:max-w-5xl md:rounded-3xl"
                            variants={{
                                hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 64, scale: 0.98 },
                                visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            transition={reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 280, damping: 30 }}
                            onKeyDown={trapFocus}
                        >
                            <button
                                ref={closeRef}
                                type="button"
                                aria-label="Close quick view"
                                className="absolute right-3 top-3 z-10 flex size-11 items-center justify-center rounded-full bg-white/90 text-neutral-950 shadow-md backdrop-blur transition-colors hover:bg-neutral-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
                                onClick={close}
                            >
                                <HiXMark className="size-5" />
                            </button>

                            <div className="grid h-full overflow-y-auto md:max-h-[88vh] md:grid-cols-2">
                                <div className="relative aspect-[4/5] bg-neutral-100 md:aspect-auto md:min-h-[560px]">
                                    <AnimatePresence initial={false}>
                                        <motion.img
                                            key={active.images[imageIndex].src}
                                            src={active.images[imageIndex].src}
                                            alt={active.images[imageIndex].alt}
                                            className="absolute inset-0 size-full object-cover"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: reduce ? 0 : 0.35 }}
                                        />
                                    </AnimatePresence>
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        {active.images.map((image, i) => (
                                            <button
                                                key={image.src}
                                                type="button"
                                                aria-pressed={i === imageIndex}
                                                aria-label={`Show image ${i + 1} of ${active.images.length}`}
                                                className={cn(
                                                    'size-14 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-neutral-100 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-16',
                                                    i === imageIndex ? 'ring-white' : 'ring-transparent opacity-75 hover:opacity-100',
                                                )}
                                                onClick={() => setImageIndex(i)}
                                            >
                                                <img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                                    <div className="flex items-center gap-3 pr-12 text-sm">
                                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium">
                                            {active.badge}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-neutral-600">
                                            <HiStar aria-hidden="true" className="size-4 text-neutral-950" />
                                            {active.rating}
                                            <span className="text-neutral-400">({active.reviews} reviews)</span>
                                        </span>
                                    </div>
                                    <h2 id={titleId} className="mt-5 text-3xl font-medium leading-tight tracking-tight text-neutral-950">
                                        {active.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-neutral-500">{active.subtitle}</p>
                                    <p className="mt-4 text-2xl font-medium tabular-nums">${active.price}</p>
                                    <p className="mt-4 text-sm leading-relaxed text-neutral-600">{active.description}</p>

                                    <div className="mt-6">
                                        <p className="text-sm">
                                            <span className="text-neutral-500">Colour — </span>
                                            <span className="font-medium">{active.colors[colorIndex].name}</span>
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            {active.colors.map((color, i) => (
                                                <button
                                                    key={color.name}
                                                    type="button"
                                                    aria-pressed={i === colorIndex}
                                                    aria-label={`Colour: ${color.name}`}
                                                    className={cn(
                                                        'flex size-11 items-center justify-center rounded-full ring-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950',
                                                        i === colorIndex ? 'ring-neutral-950' : 'ring-transparent hover:ring-neutral-300',
                                                    )}
                                                    onClick={() => {
                                                        setColorIndex(i)
                                                        setAdded(false)
                                                    }}
                                                >
                                                    <span
                                                        className="size-8 rounded-full ring-1 ring-inset ring-black/10"
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap items-center gap-3">
                                        <div className="flex items-center rounded-full border border-neutral-200">
                                            <button
                                                type="button"
                                                aria-label="Decrease quantity"
                                                disabled={qty <= 1}
                                                className="flex size-12 items-center justify-center rounded-full transition hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-neutral-950"
                                                onClick={() => changeQty(-1)}
                                            >
                                                <HiMinus className="size-4" />
                                            </button>
                                            <output aria-live="polite" className="w-8 text-center text-sm font-medium tabular-nums">
                                                {qty}
                                            </output>
                                            <button
                                                type="button"
                                                aria-label="Increase quantity"
                                                disabled={qty >= 10}
                                                className="flex size-12 items-center justify-center rounded-full transition hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-neutral-950"
                                                onClick={() => changeQty(1)}
                                            >
                                                <HiPlus className="size-4" />
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            aria-pressed={added}
                                            className={cn(
                                                'inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950',
                                                added
                                                    ? 'border border-neutral-950 bg-white text-neutral-950'
                                                    : 'bg-neutral-950 text-white hover:bg-neutral-800',
                                            )}
                                            onClick={() => setAdded(true)}
                                        >
                                            {added && <HiCheck aria-hidden="true" className="size-4" />}
                                            {added ? 'Added to cart' : `Add to cart · $${active.price * qty}`}
                                        </button>
                                    </div>

                                    <ul className="mt-6 space-y-2 border-t border-neutral-100 pt-6 text-sm text-neutral-600">
                                        {active.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2">
                                                <HiCheck aria-hidden="true" className="size-4 text-neutral-950" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={`#studio-nomad-${active.id}`}
                                        className="group mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
                                    >
                                        Full details
                                        <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default ModalQuickViewProductCard

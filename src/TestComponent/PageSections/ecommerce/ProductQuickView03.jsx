// SplitDetailProductCard

// ProductQuickView03 · E-commerce & Marketplaces › Product Card / Quick View

// Description:
// A luxury product-detail card for the fictional watchmaker Chronos & Co., featuring the
// "Meridian 38 Automatic". A large gallery with a thumbnail strip sits beside the name,
// price, key specs, strap size pills, an "Add to cart" button and a Shipping / Warranty /
// Care accordion. Use it as a product page hero, an expanded quick view or a featured
// product block for high-consideration items.

// Design:
// - Charcoal #1f1f1f section, sand #e8dcc8 text, brass #b08d57 accents; lg:grid-cols-12
//   split with the gallery in 7 columns and the details in 5
// - Gallery: rounded-[28px] aspect-4/5 main image with a mono "01 / 04" counter and caption,
//   thumbnails 64-80px rounded-2xl with a brass ring when active
// - Details: serif name (text-4xl → sm:text-5xl), brass stars, three-up spec grid split by
//   sand/15 hairlines, rounded-2xl strap size buttons, full-width brass button, hairline
//   accordion with a rotating plus icon
// - Motion: main image crossfades with a slight scale settle; accordion panels animate
//   height auto (framer-motion); both become instant with reduced motion
// - Responsive: stacks on mobile with thumbnails in a row under the image; on lg the
//   thumbnails become a vertical rail to the left of the image

// What it does:
// - imageIndex (state) is set by the thumbnails (aria-pressed) or the arrow keys while the
//   main image has focus; the counter and caption follow it
// - strapSize (state, default "M") is picked with pills (aria-pressed); "Add to cart"
//   flips to "Added to cart ✓" until another size is chosen
// - openPanel (state) keeps one accordion item open at a time (aria-expanded,
//   aria-controls); breadcrumb and "Size guide" links point to #chronos-* anchors

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SplitDetailProductCard from '@/TestComponent/PageSections/ecommerce/ProductQuickView03';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <SplitDetailProductCard />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheck, HiPlus, HiStar } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`

const gallery = [
    {
        src: photo('1524592094714-0f0654e20314'),
        alt: 'Hand holding an automatic wristwatch with a leather strap',
        caption: 'Hand-finished dial',
    },
    {
        src: photo('1522312346375-d1a52e2b99b3'),
        alt: 'Rose-gold wristwatch against a teal backdrop',
        caption: 'Rose-gold case',
    },
    {
        src: photo('1507679799987-c73779587ccf'),
        alt: 'Man in a tailored navy suit',
        caption: 'Worn with tailoring',
    },
    {
        src: photo('1455390582262-044cdead277a'),
        alt: 'Fountain pen writing on cream paper',
        caption: 'Signed, numbered, yours',
    },
]

const specs = [
    { label: 'Case', value: '38 mm' },
    { label: 'Reserve', value: '42 h' },
    { label: 'Water', value: '100 m' },
]

const straps = [
    { id: 'S', fit: '150–180 mm' },
    { id: 'M', fit: '165–200 mm' },
    { id: 'L', fit: '180–215 mm' },
]

const panels = [
    {
        id: 'shipping',
        title: 'Shipping',
        body: 'Free insured express shipping in 1–3 business days, signature on delivery. Every watch travels in a leather roll inside a numbered oak box, with free 30-day returns.',
    },
    {
        id: 'warranty',
        title: 'Warranty',
        body: 'A 5-year international warranty covers the movement, case and crystal. Your first full service within the warranty period is on us, including pickup and return.',
    },
    {
        id: 'care',
        title: 'Care',
        body: 'Give the crown 30 turns if the watch has stopped. Rinse in fresh water after swimming in the sea, and condition the leather strap twice a year with a soft cloth.',
    },
]

const pad = (n) => String(n).padStart(2, '0')

export function SplitDetailProductCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const baseId = useId()
    const [imageIndex, setImageIndex] = useState(0)
    const [strapSize, setStrapSize] = useState('M')
    const [added, setAdded] = useState(false)
    const [openPanel, setOpenPanel] = useState('shipping')

    const image = gallery[imageIndex]
    const strap = straps.find((s) => s.id === strapSize)

    const onGalleryKey = (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault()
            setImageIndex((i) => (i + 1) % gallery.length)
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault()
            setImageIndex((i) => (i - 1 + gallery.length) % gallery.length)
        }
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('bg-[#1f1f1f] py-14 text-[#e8dcc8] md:py-24 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#e8dcc8]/50">
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <li>
                            <a href="#chronos-watches" className="hover:text-[#b08d57] focus-visible:outline-2 focus-visible:outline-[#b08d57]">
                                Watches
                            </a>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li>
                            <a href="#chronos-meridian" className="hover:text-[#b08d57] focus-visible:outline-2 focus-visible:outline-[#b08d57]">
                                Meridian Collection
                            </a>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" className="text-[#e8dcc8]/80">
                            Meridian 38
                        </li>
                    </ol>
                </nav>

                <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="flex flex-col gap-3 lg:col-span-7 lg:flex-row-reverse lg:gap-4">
                        <div
                            tabIndex={0}
                            role="group"
                            aria-roledescription="gallery"
                            aria-label={`Image ${imageIndex + 1} of ${gallery.length}: ${image.caption}. Use arrow keys to browse.`}
                            className="relative aspect-[4/5] w-full min-w-0 overflow-hidden rounded-[28px] lg:w-auto lg:flex-1 bg-[#2a2a2a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b08d57]"
                            onKeyDown={onGalleryKey}
                        >
                            <AnimatePresence initial={false}>
                                <motion.img
                                    key={image.src}
                                    src={image.src}
                                    alt={image.alt}
                                    className="absolute inset-0 size-full object-cover"
                                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </AnimatePresence>
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-5 pt-16 sm:p-6">
                                <span className="font-mono text-xs tracking-[0.3em] text-[#e8dcc8]">
                                    {pad(imageIndex + 1)} / {pad(gallery.length)}
                                </span>
                                <span className="font-serif text-sm italic text-[#e8dcc8]/85">{image.caption}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 lg:flex-col">
                            {gallery.map((item, i) => (
                                <button
                                    key={item.src}
                                    type="button"
                                    aria-pressed={i === imageIndex}
                                    aria-label={`Show ${item.caption.toLowerCase()}`}
                                    className={cn(
                                        'size-16 shrink-0 overflow-hidden rounded-2xl bg-[#2a2a2a] transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57] sm:size-20',
                                        i === imageIndex
                                            ? 'ring-2 ring-[#b08d57] ring-offset-2 ring-offset-[#1f1f1f]'
                                            : 'opacity-50 hover:opacity-90',
                                    )}
                                    onClick={() => setImageIndex(i)}
                                >
                                    <img src={item.src} alt={item.alt} loading="lazy" className="size-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 lg:pt-2">
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#b08d57]">
                            Chronos & Co. · Meridian Collection
                        </p>
                        <h2 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl text-[#e8dcc8] font-normal">Meridian 38 Automatic</h2>
                        <p className="mt-2 text-sm text-[#e8dcc8]/60">Rose-gold case · Cognac calfskin strap</p>

                        <div className="mt-5 flex items-center gap-3 text-sm">
                            <span className="flex text-[#b08d57]" aria-hidden="true">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <HiStar key={i} className="size-4" />
                                ))}
                            </span>
                            <span className="text-[#e8dcc8]/70">
                                <span className="sr-only">Rated </span>4.9 · 318 reviews
                            </span>
                        </div>

                        <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                            <p className="text-3xl font-light tabular-nums tracking-tight">$1,450</p>
                            <p className="text-xs text-[#e8dcc8]/55">or 4 interest-free payments of $362.50</p>
                        </div>

                        <p className="mt-5 text-sm leading-relaxed text-[#e8dcc8]/75 sm:text-base">
                            A slim dress watch built around a Swiss-made automatic movement, a domed sapphire crystal
                            and a hand-brushed dial. Numbered and signed in our workshop.
                        </p>

                        <dl className="mt-7 grid grid-cols-3 divide-x divide-[#e8dcc8]/15 border-y border-[#e8dcc8]/15">
                            {specs.map((spec) => (
                                <div key={spec.label} className="px-3 py-4 text-center first:pl-0 last:pr-0">
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#e8dcc8]/50">
                                        {spec.label}
                                    </dt>
                                    <dd className="mt-1 font-serif text-xl">{spec.value}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-7">
                            <div className="flex items-center justify-between text-sm">
                                <p>
                                    <span className="text-[#e8dcc8]/60">Strap size — </span>
                                    {strap.id} · fits {strap.fit} wrists
                                </p>
                                <a
                                    href="#chronos-size-guide"
                                    className="inline-flex min-h-10 items-center text-xs uppercase tracking-[0.2em] text-[#b08d57] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#b08d57]"
                                >
                                    Size guide
                                </a>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                                {straps.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        aria-pressed={option.id === strapSize}
                                        aria-label={`Strap size ${option.id}, fits ${option.fit} wrists`}
                                        className={cn(
                                            'flex min-h-14 flex-col items-center justify-center rounded-2xl border text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]',
                                            option.id === strapSize
                                                ? 'border-[#e8dcc8] bg-[#e8dcc8] text-[#1f1f1f]'
                                                : 'border-[#e8dcc8]/25 hover:border-[#e8dcc8]/70',
                                        )}
                                        onClick={() => {
                                            setStrapSize(option.id)
                                            setAdded(false)
                                        }}
                                    >
                                        <span className="font-medium">{option.id}</span>
                                        <span className="text-[10px] opacity-60">{option.fit}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            aria-pressed={added}
                            className={cn(
                                'mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold uppercase tracking-[0.2em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]',
                                added
                                    ? 'border border-[#b08d57] text-[#b08d57]'
                                    : 'bg-[#b08d57] text-[#1f1f1f] hover:bg-[#c29f68]',
                            )}
                            onClick={() => setAdded(true)}
                        >
                            {added ? `Added to cart ✓ · Size ${strapSize}` : 'Add to cart'}
                        </button>
                        <p className="mt-3 text-center text-xs text-[#e8dcc8]/50">Complimentary engraving · Ships in 1–3 days</p>

                        <div className="mt-8 border-t border-[#e8dcc8]/15">
                            {panels.map((panel) => {
                                const isOpen = openPanel === panel.id
                                const buttonId = `${baseId}-${panel.id}-button`
                                const panelId = `${baseId}-${panel.id}-panel`
                                return (
                                    <div key={panel.id} className="border-b border-[#e8dcc8]/15">
                                        <h3 className="text-[#e8dcc8] text-base font-normal">
                                            <button
                                                id={buttonId}
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                                className="flex min-h-14 w-full items-center justify-between gap-4 text-left text-sm uppercase tracking-[0.2em] transition-colors hover:text-[#b08d57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b08d57]"
                                                onClick={() => setOpenPanel(isOpen ? null : panel.id)}
                                            >
                                                {panel.title}
                                                <HiPlus
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'size-4 shrink-0 text-[#b08d57] transition-transform duration-300',
                                                        isOpen && 'rotate-45',
                                                    )}
                                                />
                                            </button>
                                        </h3>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    key="panel"
                                                    id={panelId}
                                                    role="region"
                                                    aria-labelledby={buttonId}
                                                    className="overflow-hidden"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                >
                                                    <p className="pb-5 pr-8 text-sm leading-relaxed text-[#e8dcc8]/70">
                                                        {panel.body}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>

                        <p className="mt-6 flex items-center gap-2 text-xs text-[#e8dcc8]/55">
                            <HiCheck aria-hidden="true" className="size-4 text-[#b08d57]" />
                            In stock at the workshop — 7 of 50 left in this edition
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SplitDetailProductCard

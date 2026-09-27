// LinenKimonoProductCardWithSwatches

// Card01 · E-commerce & Marketplaces › Cards

// Description:
// Fashion product card for Studio Nord's "The Relaxed Atelier Kimono" (SS26, "Drop 04 •
// Look 08"). Shows the product photo with a drop label and a save (heart) button, a 4.95
// (48) rating, a material line (100% Belgian washed linen, hand-stitched cuffs), three
// colour swatches with the selected colour name, the $185 price and an "Add to Bag" button.

// Design:
// - Vertical article: image block (h-72) → brand/rating row → serif title → material line
//   → swatch/price row (border-t) → full-width button.
// - Warm light palette: #fbf9f5 card, #e8e4dc border, #1e1c1a text, #efe9de image
//   background, #766b5e muted, #9a704b accent; swatches #b35d45 / #614d3b / #ebe5da; button
//   #1c1b19 → hover #9a704b; amber-400 star, rose-500 saved heart. No dark-mode variants.
// - rounded-xl card with shadow-sm → hover:shadow-md; rounded-lg image; mono uppercase
//   micro-labels (text-[10px]); serif bold title text-lg; round h-4 w-4 swatches that
//   scale-125 with a black border when selected; frosted white/90 chips over the photo;
//   the photo zooms (scale-105, duration-700) on card hover.
// - No breakpoint-specific classes: the card fills the width of its grid cell.

// What it does:
// - State: saved (boolean) toggled by the heart button, which fills the heart rose;
//   selectedColor (default 'Terracotta') set by clicking a swatch and echoed as a label.
// - The local swatches array ({ name, bg }) is mapped to swatch buttons (colour via inline
//   style, name as title). "Add to Bag" is a button with no handler. No content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LinenKimonoProductCardWithSwatches from '@/TestComponent/SectionDesigns/Sections/ecommerce/Card01';

// const ProductGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <LinenKimonoProductCardWithSwatches />
//     </div>
// )
// ```

'use client'

import { useState } from 'react';
import { HiOutlineHeart, HiOutlineShoppingBag, HiStar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LinenKimonoProductCardWithSwatches({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [saved, setSaved] = useState(false)
    const [selectedColor, setSelectedColor] = useState('Terracotta')

    const swatches = [
        { name: 'Terracotta', bg: '#b35d45' },
        { name: 'Raw Umber', bg: '#614d3b' },
        { name: 'Bone Chalk', bg: '#ebe5da' },
    ]

    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'group overflow-hidden rounded-xl border border-[#e8e4dc] bg-[#fbf9f5] p-4 text-[#1e1c1a] shadow-sm hover:shadow-md transition-shadow',
                className,
            )}
            {...props}
        >
            <div className="relative overflow-hidden rounded-lg bg-[#efe9de]">
                <img
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85"
                    alt="The Relaxed Atelier Linen Kimono"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-sm shadow-sm">
                    Drop 04 &bull; Look 08
                </span>
                <button
                    type="button"
                    onClick={() => setSaved(!saved)}
                    aria-label="Save this look"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black backdrop-blur-sm hover:scale-110 transition-transform"
                >
                    <HiOutlineHeart className={saved ? 'fill-rose-500 text-rose-500' : ''} />
                </button>
            </div>

            <div className="pt-4">
                <div className="flex items-center justify-between text-xs text-[#766b5e]">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#9a704b]">
                        STUDIO NORD &bull; SS26
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                        <HiStar className="text-amber-400 fill-amber-400" /> 4.95 (48)
                    </span>
                </div>

                <h3 className="mt-1 font-serif text-lg font-bold">
                    The Relaxed Atelier Kimono
                </h3>
                <p className="mt-0.5 text-xs text-[#766b5e]">
                    100% Belgian Washed Linen &bull; Hand-stitched cuffs
                </p>

                {/* Color Swatches */}
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#e8e4dc]">
                    <div className="flex items-center gap-2">
                        {swatches.map((s) => (
                            <button
                                key={s.name}
                                type="button"
                                onClick={() => setSelectedColor(s.name)}
                                title={s.name}
                                className={`h-4 w-4 rounded-full border-2 transition-transform ${
                                    selectedColor === s.name
                                        ? 'border-black scale-125'
                                        : 'border-transparent'
                                }`}
                                style={{ backgroundColor: s.bg }}
                            />
                        ))}
                        <span className="text-[11px] text-[#766b5e] ml-1">{selectedColor}</span>
                    </div>
                    <span className="font-serif text-base font-bold">$185</span>
                </div>

                <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1c1b19] py-2.5 text-xs font-bold text-white hover:bg-[#9a704b] transition-colors"
                >
                    <HiOutlineShoppingBag className="text-sm" />
                    <span>Add to Bag</span>
                </button>
            </div>
        </article>
    )
}

export default LinenKimonoProductCardWithSwatches

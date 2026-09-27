// ShigarakiVesselMakerProvenanceCard

// Card04 · E-commerce & Marketplaces › Cards

// Description:
// Artisan ceramics card for the "Shigaraki Volcanic Ash Vessel" ($320) from "Maker
// Provenance • Vol. 18". It shows a "VERIFIED KILN" badge, the product photo with an
// audio chip, a firing note (7 days in an anagama kiln), a provenance table (potter Kenji
// Sawada, Shiga Prefecture, numbered 08 of 15) and an "Acquire Handcrafted Piece" button.

// Design:
// - Header row (border-b) → h-60 image with a bottom-left chip → title/price row →
//   description → metadata box → full-width button.
// - Warm clay palette: #f5ede4 card, #d8c8ba border, #2a231d text, #9a704b accent (badge at
//   /15), #e2d5c8 divider, #e6dbce image background, #6e5e52 muted, white/60 table box;
//   black/80 chip with amber-400 pulsing icon while "playing"; button #2a231d → hover
//   #9a704b. No dark-mode variants.
// - rounded-2xl card with shadow-md, rounded-xl image; serif bold title text-lg; mono
//   text-[11px] provenance rows; rounded-full badge and chip; image hover:scale-105.
// - No breakpoint-specific classes: the card fills the width of its grid cell.

// What it does:
// - State: isPlaying (boolean) toggled by the chip button; the label switches between
//   "Listen to Kiln Audio" and "Playing Kiln Sound (0:45)..." and the speaker icon pulses
//   amber. No audio is actually loaded or played.
// - "Acquire Handcrafted Piece" is a button with no handler. No content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ShigarakiVesselMakerProvenanceCard from '@/TestComponent/SectionDesigns/Sections/ecommerce/Card04';

// const ProductGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <ShigarakiVesselMakerProvenanceCard />
//     </div>
// )
// ```

'use client'

import { useState } from 'react';
import { HiOutlineCheck, HiOutlineShoppingBag, HiOutlineVolumeUp } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ShigarakiVesselMakerProvenanceCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-2xl border border-[#d8c8ba] bg-[#f5ede4] p-5 text-[#2a231d] shadow-md',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-[#e2d5c8] pb-3">
                <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#9a704b]">
                    MAKER PROVENANCE &bull; VOL. 18
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#9a704b]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#9a704b]">
                    <HiOutlineCheck /> VERIFIED KILN
                </span>
            </div>

            <div className="relative mt-4 h-60 overflow-hidden rounded-xl bg-[#e6dbce]">
                <img
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=85"
                    alt="Hand-thrown Shigaraki volcanic clay vessel"
                />
                {/* Audio Soundbite Button */}
                <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-mono text-white backdrop-blur-sm hover:bg-black transition-colors"
                >
                    <HiOutlineVolumeUp className={isPlaying ? 'text-amber-400 animate-pulse' : ''} />
                    <span>{isPlaying ? 'Playing Kiln Sound (0:45)...' : 'Listen to Kiln Audio'}</span>
                </button>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg font-bold">
                        Shigaraki Volcanic Ash Vessel
                    </h3>
                    <span className="font-serif text-base font-bold text-[#9a704b]">$320</span>
                </div>
                <p className="mt-1 text-xs text-[#6e5e52]">
                    Fired for 7 days in wood-burning anagama kiln. Natural ash glaze.
                </p>

                {/* Provenance Metadata Table */}
                <div className="mt-3 rounded-lg bg-white/60 p-2.5 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between">
                        <span className="text-black/50">POTTER:</span>
                        <span className="font-bold">Kenji Sawada (3rd Gen)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-black/50">LOCATION:</span>
                        <span>Shiga Prefecture, Japan</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-black/50">EDITION:</span>
                        <span>Numbered 08 of 15</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2a231d] py-2.5 text-xs font-bold text-white hover:bg-[#9a704b] transition-colors"
                >
                    <HiOutlineShoppingBag className="text-sm" />
                    <span>Acquire Handcrafted Piece</span>
                </button>
            </div>
        </article>
    )
}

export default ShigarakiVesselMakerProvenanceCard

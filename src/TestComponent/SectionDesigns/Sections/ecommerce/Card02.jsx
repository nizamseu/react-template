// NeoBrutalistHoodieQuickDropCard

// Card02 · E-commerce & Marketplaces › Cards

// Description:
// Limited-stock streetwear drop card for the "MONOLITH HOODIE v2" at $240. The header
// shows "QUICK DROP • 04/50" and "STOCK: 4 REMAINING", followed by a grayscale product
// photo tagged "#480-GSM FLEECE", a spec line (oversized boxy cut, cobalt dye, YKK zips),
// a 92% "ALLOCATION SOLD" progress bar and a "CLAIM INSTANT DROP" button.

// Design:
// - Stacked article: header row (border-b-2) → framed image → title/price row → specs →
//   progress bar → full-width button.
// - Lime #d6f36a background with black text and borders; black chips with lime text;
//   white/60 progress track with a black fill; no dark-mode variants.
// - Neo-brutalist styling: rounded-none, border-2 border-black, hard offset shadow
//   shadow-[6px_6px_0px_0px_#000], monospace font-black uppercase type; the photo is
//   grayscale contrast-125 and returns to colour on hover (duration-500); the button
//   inverts to white/black on hover.
// - No breakpoint-specific classes: the card fills the width of its grid cell.

// What it does:
// - Purely presentational: no content props, no state; the 92% bar is a static w-[92%] fill.
// - "CLAIM INSTANT DROP" is a button with no handler; icons HiOutlineLightningBolt and
//   HiOutlineShoppingBag from react-icons/hi.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NeoBrutalistHoodieQuickDropCard from '@/TestComponent/SectionDesigns/Sections/ecommerce/Card02';

// const ProductGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <NeoBrutalistHoodieQuickDropCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineLightningBolt, HiOutlineShoppingBag } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NeoBrutalistHoodieQuickDropCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-none border-2 border-black bg-[#d6f36a] p-5 text-black shadow-[6px_6px_0px_0px_#000]',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-black uppercase tracking-wider bg-black text-[#d6f36a] px-2 py-0.5">
                    <HiOutlineLightningBolt /> QUICK DROP &bull; 04/50
                </span>
                <span className="font-mono text-xs font-black">
                    STOCK: 4 REMAINING
                </span>
            </div>

            <div className="relative mt-4 overflow-hidden border-2 border-black bg-black">
                <img
                    className="h-60 w-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85"
                    alt="Technical Heavyweight Cyber Hoodie"
                />
                <span className="absolute bottom-2 right-2 bg-black px-2 py-0.5 font-mono text-xs font-bold text-white">
                    #480-GSM FLEECE
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="font-mono text-lg font-black uppercase tracking-tight">
                        MONOLITH HOODIE v2
                    </h3>
                    <span className="font-mono text-xl font-black">$240</span>
                </div>
                <p className="mt-1 font-mono text-xs text-black/70">
                    Oversized boxy cut &bull; Industrial cobalt dye &bull; YKK raw zips
                </p>

                {/* Stock Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between font-mono text-[10px] font-bold">
                        <span>ALLOCATION SOLD</span>
                        <span>92%</span>
                    </div>
                    <div className="mt-1 h-2.5 w-full border border-black bg-white/60 p-0.5">
                        <div className="h-full w-[92%] bg-black" />
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 border-2 border-black bg-black py-2.5 font-mono text-xs font-black uppercase tracking-wider text-[#d6f36a] hover:bg-white hover:text-black transition-colors"
                >
                    <HiOutlineShoppingBag className="text-sm" />
                    <span>CLAIM INSTANT DROP</span>
                </button>
            </div>
        </article>
    )
}

export default NeoBrutalistHoodieQuickDropCard

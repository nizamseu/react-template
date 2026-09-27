// VariableFontWeightSpecimenCard

// Card03 · Portfolios & Personal Websites › Cards

// Description:
// Light type-specimen card for a designer's custom typeface "JP-MONUMENTAL"
// (640 glyphs, OpenType). The word "Aesthetics" is rendered large and its
// weight follows a slider (200-900), with a quoted tagline, a "Commercial &
// Studio License" note and a "Test Full Alphabet →" link.

// Design:
// - Header row with meta labels (border-b), centred specimen word and quote,
//   a slider panel (bg-black/5, rounded-lg) and a footer row (border-t).
// - Light palette: paper #f9f7f4, borders #ded8cf, ink #241d1a, coral #ef6a4b
//   (label, slider accent, link), muted quote #736a61.
// - Specimen font-serif text-5xl → sm:text-6xl with an inline fontWeight;
//   font-mono 9-10px axis labels; rounded-xl card with shadow-md.
// - Only the specimen size changes (at sm); otherwise the card is fluid.

// What it does:
// - Local state `weight` (useState, 600); the range input (min 200, max 900)
//   updates it, the value is shown next to "WEIGHT AXIS [wght]:" and applied
//   as fontWeight with a 150ms transition. font-serif resolves to system serif
//   fonts, so visible steps depend on the weights that font provides.
// - Anchor "Test Full Alphabet →" → #buy-font.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VariableFontWeightSpecimenCard from '@/TestComponent/SectionDesigns/Sections/portfolio/Card03';

// const TypefacesGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <VariableFontWeightSpecimenCard />
//     </div>
// )
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function VariableFontWeightSpecimenCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [weight, setWeight] = useState(600)

    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-xl border border-[#ded8cf] bg-[#f9f7f4] p-6 text-[#241d1a] shadow-md',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-[#ded8cf] pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ef6a4b] font-bold">
                    VARIABLE TYPE SPECIMEN &bull; JP-MONUMENTAL
                </span>
                <span className="font-mono text-xs text-[#241d1a]/50">
                    640 GLYPHS &bull; OPENTYPE
                </span>
            </div>

            <div className="mt-4">
                {/* Large typographic specimen */}
                <div
                    className="py-4 text-center font-serif text-5xl sm:text-6xl tracking-tight transition-all duration-150"
                    style={{ fontWeight: weight }}
                >
                    Aesthetics
                </div>

                <div className="mt-2 text-center text-xs text-[#736a61]">
                    &ldquo;Form follows sensation in the post-digital space.&rdquo;
                </div>

                {/* Interactive weight slider */}
                <div className="mt-6 rounded-lg bg-black/5 p-3">
                    <div className="flex justify-between font-mono text-[10px] text-[#241d1a]/70 mb-1">
                        <span>WEIGHT AXIS [wght]:</span>
                        <span className="font-bold">{weight}</span>
                    </div>
                    <input
                        type="range"
                        min="200"
                        max="900"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full accent-[#ef6a4b] cursor-pointer"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-[#241d1a]/40 mt-1">
                        <span>200 (Thin)</span>
                        <span>500 (Regular)</span>
                        <span>900 (Black)</span>
                    </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#ded8cf] flex items-center justify-between text-xs">
                    <span className="font-mono text-black/50">Commercial & Studio License</span>
                    <a href="#buy-font" className="font-bold text-[#ef6a4b] hover:underline">
                        Test Full Alphabet &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default VariableFontWeightSpecimenCard

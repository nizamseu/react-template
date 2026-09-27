// HinokiGiftBoxConciergeCTA

// CTA05 · E-commerce & Marketplaces › Banner CTAs

// Description:
// Warm gifting banner "GIFTING CONCIERGE • COMPLIMENTARY" with the headline "Thoughtfully
// Packaged in Hinoki Cypress Boxes". Copy explains that orders above $200 include
// hand-lettered washi notes, botanical drying herbs and reusable cedar ribbon packaging,
// with a "Configure Gift Box" button.

// Design:
// - flex-col → md:flex-row (items-center, justify-between): copy (max-w-xl) left, button
//   right (shrink-0).
// - Blush palette: #f5ede4 background, #241f1b text, #d8c8ba border, #9a704b eyebrow,
//   #685b52 copy; button #241f1b → hover #9a704b; no dark-mode variants.
// - Serif type throughout (bold headline text-3xl leading-tight); rounded-full button;
//   rounded-xl shell with a 1px border.
// - Stacks below md; padding p-8 → sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One anchor CTA "Configure Gift Box" → #gift-service (HiOutlineGift and HiArrowRight
//   icons).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HinokiGiftBoxConciergeCTA from '@/TestComponent/SectionDesigns/Sections/ecommerce/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <HinokiGiftBoxConciergeCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineGift } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function HinokiGiftBoxConciergeCTA({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-xl border border-[#d8c8ba] bg-[#f5ede4] p-8 text-[#241f1b] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-serif text-xs font-bold uppercase tracking-wider text-[#9a704b]">
                        <HiOutlineGift /> GIFTING CONCIERGE &bull; COMPLIMENTARY
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Thoughtfully Packaged in Hinoki Cypress Boxes
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[#685b52]">
                        Every order above $200 includes custom hand-lettered washi notes, organic botanical drying herbs, and reusable Japanese cedar ribbon packaging.
                    </p>
                </div>

                <a
                    href="#gift-service"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#241f1b] px-6 py-3.5 text-xs font-serif font-bold text-white hover:bg-[#9a704b] transition-colors shrink-0"
                >
                    <span>Configure Gift Box</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default HinokiGiftBoxConciergeCTA

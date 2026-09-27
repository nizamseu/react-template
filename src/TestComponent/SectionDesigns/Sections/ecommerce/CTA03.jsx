// DesignTradeProgramCTA

// CTA03 · E-commerce & Marketplaces › Banner CTAs

// Description:
// B2B banner "FOR ARCHITECTS & INTERIOR STUDIOS" promoting the "Design Trade Program &
// Bespoke Curation": trade discounts up to 30%, custom millwork sizing, material swatch
// dispatch and dedicated project management, with "Apply for Trade Membership" and
// "Request Material Swatch Box" buttons.

// Design:
// - Grid lg:grid-cols-[1.2fr_0.8fr] (items-center): copy left, button group right; the
//   button group is flex-col → sm:flex-row → lg:flex-col.
// - Light palette: #faf9f5 background, #1e1c1a text, #e8e4dc border, #9a704b eyebrow and
//   hover, #766b5e copy; primary button #1e1c1a, secondary outline black/20; no dark-mode
//   variants.
// - Serif headline text-3xl → sm:text-4xl leading-tight; mono eyebrow text-[10px]
//   tracking-[.25em]; rounded-full buttons; rounded-xl shell.
// - Stacks below lg; padding p-8 → sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - Anchor CTAs "Apply for Trade Membership" → #apply-trade and "Request Material Swatch
//   Box" → #order-swatches.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DesignTradeProgramCTA from '@/TestComponent/SectionDesigns/Sections/ecommerce/CTA03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DesignTradeProgramCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DesignTradeProgramCTA({
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
                'rounded-xl border border-[#e8e4dc] bg-[#faf9f5] p-8 text-[#1e1c1a] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#9a704b]">
                        FOR ARCHITECTS & INTERIOR STUDIOS
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                        Design Trade Program & Bespoke Curation
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#766b5e]">
                        Exclusive trade discounts up to 30%, custom millwork sizing, material swatch library dispatch, and dedicated project management for residential and hospitality projects.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                    <a
                        href="#apply-trade"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1e1c1a] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#9a704b] transition-colors"
                    >
                        <span>Apply for Trade Membership</span>
                        <HiArrowRight />
                    </a>
                    <a
                        href="#order-swatches"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-6 py-3 text-xs font-semibold text-[#1e1c1a] hover:bg-black/5 transition-colors"
                    >
                        <span>Request Material Swatch Box</span>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default DesignTradeProgramCTA

// AgencyFractionalPartnershipCTA

// CTA02 · Portfolios & Personal Websites › Banner CTAs

// Description:
// Neo-brutalist black banner pitching white-label executive creative direction
// to design agencies. Under the label "AGENCY FRACTIONAL PARTNERSHIP" it asks
// "NEED EXECUTIVE CREATIVE WEIGHT ON YOUR HIGH-STAKES PITCH?", mentions
// agencies in London, Amsterdam and Tokyo, and offers a "Request Agency Deck".

// Design:
// - Flex layout: text block and button stacked, side by side from lg
//   (lg:flex-row lg:items-center, justify-between).
// - Dark palette: #111111 background, white text (body at white/70), coral
//   #ef6a4b label and button (black text, hover white); border-2 white/20
//   with a hard shadow-[8px_8px_0px_0px_#ef6a4b].
// - Headline text-2xl → sm:text-4xl font-black uppercase tracking-tight;
//   mono xs label, body and button; square corners (rounded-none) throughout.
// - Stacks until lg; padding p-8 → sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "Request Agency Deck" → #partner-inquiry
//   (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AgencyFractionalPartnershipCTA from '@/TestComponent/SectionDesigns/Sections/portfolio/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <AgencyFractionalPartnershipCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AgencyFractionalPartnershipCTA({
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
                'overflow-hidden rounded-none border-2 border-white/20 bg-[#111111] p-8 text-white sm:p-12 shadow-[8px_8px_0px_0px_#ef6a4b]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#ef6a4b]">
                        AGENCY FRACTIONAL PARTNERSHIP
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight">
                        NEED EXECUTIVE CREATIVE WEIGHT ON YOUR HIGH-STAKES PITCH?
                    </h2>
                    <p className="mt-2 font-mono text-xs text-white/70 max-w-xl">
                        White-label executive creative direction for leading design agencies in London, Amsterdam, and Tokyo pitching global enterprise brands.
                    </p>
                </div>

                <a
                    href="#partner-inquiry"
                    className="inline-flex items-center justify-center gap-2 rounded-none border border-[#ef6a4b] bg-[#ef6a4b] px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-black hover:bg-white transition-colors shrink-0"
                >
                    <span>Request Agency Deck</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default AgencyFractionalPartnershipCTA

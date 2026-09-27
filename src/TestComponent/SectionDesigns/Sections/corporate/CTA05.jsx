// EnterpriseRFPDeskCTA

// CTA05 · Corporate & Business › Banner CTAs

// Description:
// Square-edged dark banner for the "ENTERPRISE STRATEGIC RFP DESK". The serif question
// "Submitting an Enterprise Advisory or Restructuring Tender?" is followed by copy on
// 48-hour turnarounds for fee structures, conflict checks and partner staffing, and a
// "Submit RFP Documents" button.

// Design:
// - flex-col -> md:flex-row md:items-center justify-between gap-6; copy max-w-xl, button
//   shrink-0
// - Near-black #0a0f17 background with border-2 #84b9ff/30; sky-blue #84b9ff eyebrow and
//   filled button (text #0a0f17, hover:bg-white); body copy white/60
// - Headline font-serif text-3xl font-light; font-mono uppercase eyebrow and button;
//   square section (rounded-none), rounded button
// - Below md the button stacks under the copy; padding p-8 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor CTA -> #submit-rfp with an HiArrowRight icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EnterpriseRFPDeskCTA from '@/TestComponent/SectionDesigns/Sections/corporate/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <EnterpriseRFPDeskCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function EnterpriseRFPDeskCTA({
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
                'overflow-hidden rounded-none border-2 border-[#84b9ff]/30 bg-[#0a0f17] p-8 text-white sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#84b9ff]">
                        ENTERPRISE STRATEGIC RFP DESK
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Submitting an Enterprise Advisory or Restructuring Tender?
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Our specialized bids team reviews enterprise RFPs with guaranteed 48-hour turnarounds on fee structures, conflict checks, and multidisciplinary partner staffing.
                    </p>
                </div>

                <a
                    href="#submit-rfp"
                    className="inline-flex items-center justify-center gap-2 rounded bg-[#84b9ff] px-6 py-3.5 font-mono text-xs font-bold text-[#0a0f17] hover:bg-white transition-colors shrink-0"
                >
                    <span>Submit RFP Documents</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default EnterpriseRFPDeskCTA

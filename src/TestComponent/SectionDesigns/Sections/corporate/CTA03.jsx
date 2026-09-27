// ESGDisclosureDownloadCTA

// CTA03 · Corporate & Business › Banner CTAs

// Description:
// Light banner promoting the "2026 CORPORATE GOVERNANCE DISCLOSURE": headline "Download
// Our Complete 2026 ESG & Impact Disclosures", a line describing 140 pages of carbon,
// board-independence and climate-risk data assured by KPMG, and a "Download ESG Audit
// (PDF)" pill button.

// Design:
// - flex-col -> md:flex-row md:items-center justify-between gap-6; copy max-w-xl, button
//   shrink-0
// - Off-white #f5f7f9 background, gray-200 border, ink #182434 text, blue #3476c5 eyebrow;
//   dark #182434 button that turns #3476c5 on hover; gray-600 body copy - light feel
// - Headline font-serif text-3xl bold; font-mono text-[10px] eyebrow with a
//   HiOutlineDocumentDownload icon; rounded-xl section, shadow-sm, rounded-full button
// - Below md the button stacks under the copy; padding p-8 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor CTA -> #download-esg with an HiArrowRight icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ESGDisclosureDownloadCTA from '@/TestComponent/SectionDesigns/Sections/corporate/CTA03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ESGDisclosureDownloadCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineDocumentDownload } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ESGDisclosureDownloadCTA({
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
                'rounded-xl border border-gray-200 bg-[#f5f7f9] p-8 text-[#182434] sm:p-12 shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#3476c5]">
                        <HiOutlineDocumentDownload className="text-sm" /> 2026 CORPORATE GOVERNANCE DISCLOSURE
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Download Our Complete 2026 ESG & Impact Disclosures
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        140 pages of carbon reduction metrics, board independence statistics, and climate risk scenario modeling independently assured by KPMG.
                    </p>
                </div>

                <a
                    href="#download-esg"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#182434] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-[#3476c5] transition-colors shrink-0"
                >
                    <span>Download ESG Audit (PDF)</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default ESGDisclosureDownloadCTA

// CrossBorderMACaseStudyCard

// Card02 · Corporate & Business › Cards

// Description:
// Light deal case-study card for a cross-border M&A mandate marked "CLOSED Q2 2026": a
// $2.4 Billion USD "Acquisition of Nordic Clean Grid by Sovereign Infrastructure Fund",
// a short note on sole counsel across 4 European jurisdictions, two deal stats (3.4x Net
// IRR, 114 Days) and a "Read Deal Memorandum" link.

// Design:
// - <article> stacked as: header label + status pill, deal value, serif deal title,
//   description, white 2-column stat panel, footer row with practice name and link
// - Off-white #f5f7f9 background, ink #182434, blue #3476c5 accents (label, pill on
//   #3476c5/10, stat value, link), gray-200 borders, gray-400/500/600 secondary text
// - rounded-xl, shadow-sm, p-5; deal value font-mono text-2xl font-black; title font-serif
//   text-lg bold; font-mono micro labels (text-[9px] / text-[10px])
// - No breakpoints: fixed internal layout that stretches to the width of its grid cell

// What it does:
// - Purely presentational: no content props, no state; all copy and figures are hard-coded
// - Link "Read Deal Memorandum" -> #case-study with an HiArrowRight icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CrossBorderMACaseStudyCard from '@/TestComponent/SectionDesigns/Sections/corporate/Card02';

// const CaseStudyGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <CrossBorderMACaseStudyCard />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CrossBorderMACaseStudyCard({
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
                'overflow-hidden rounded-xl border border-gray-200 bg-[#f5f7f9] p-5 text-[#182434] shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#3476c5] font-bold">
                    CROSS-BORDER M&A ADVISORY &bull; CASE STUDY
                </span>
                <span className="rounded bg-[#3476c5]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#3476c5]">
                    CLOSED Q2 2026
                </span>
            </div>

            <div className="mt-4">
                <span className="block font-mono text-2xl font-black text-[#182434]">$2.4 Billion USD</span>
                <h3 className="mt-1 font-serif text-lg font-bold leading-tight">
                    Acquisition of Nordic Clean Grid by Sovereign Infrastructure Fund
                </h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    Sole financial and regulatory counsel. Orchestrated cross-border clearance across 4 European jurisdictions with zero divestiture mandates.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-white p-3 font-mono text-xs border border-gray-200">
                    <div>
                        <span className="block text-[9px] text-gray-400">EQUITY MULTIPLE</span>
                        <span className="font-bold text-[#3476c5]">3.4x Net IRR</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-400">TRANSACTION CYCLE</span>
                        <span className="font-bold">114 Days</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-mono">Infrastructure Practice</span>
                    <a href="#case-study" className="font-bold text-[#3476c5] hover:underline flex items-center gap-1">
                        <span>Read Deal Memorandum</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

export default CrossBorderMACaseStudyCard

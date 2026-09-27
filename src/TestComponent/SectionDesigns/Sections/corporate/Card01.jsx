// Q3FinancialResultsMetricCard

// Card01 · Corporate & Business › Cards

// Description:
// Dark investor-relations card summarising Northstar's (NYSE: NST) Q3 financial report:
// a +18.4% YoY trend badge, $18.4 Billion in total assets advised, a 3.82% dividend yield,
// a 41.8% operating margin and an EPS delta of $3.42 (+12%). The footer notes "Audited by
// PwC" and offers a "Download 10-Q PDF" link.

// Design:
// - <article> with a header row (label + trend) and bottom divider, a headline figure vs
//   dividend yield row (flex justify-between, items-baseline), an inset 2-column stat
//   grid, and a footer row with a top divider
// - Dark navy #0e1724 background, #d9e4f2 body text, sky-blue #84b9ff accents,
//   emerald-400 for positive changes, inset panel bg-black/40 with a white/5 border
// - rounded-2xl, border white/10, shadow-2xl, p-5; serif text-3xl bold headline figure;
//   font-mono uppercase micro labels (text-[9px] / text-[10px]) with white/40-50 tone
// - No breakpoints: fixed internal layout that stretches to the width of its grid cell

// What it does:
// - Purely presentational: no content props, no state; all figures are hard-coded
// - Link "Download 10-Q PDF" -> #download-q3 with HiOutlineDocumentReport and HiArrowRight
//   icons; HiOutlineTrendingUp marks the YoY badge

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import Q3FinancialResultsMetricCard from '@/TestComponent/SectionDesigns/Sections/corporate/Card01';

// const InvestorHighlights = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <Q3FinancialResultsMetricCard />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineDocumentReport, HiOutlineTrendingUp } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function Q3FinancialResultsMetricCard({
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
                'overflow-hidden rounded-2xl border border-white/10 bg-[#0e1724] p-5 text-[#d9e4f2] shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#84b9ff] font-bold">
                    Q3 FINANCIAL REPORT &bull; NYSE: NST
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-bold">
                    <HiOutlineTrendingUp /> +18.4% YoY
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <div>
                        <span className="block font-mono text-[10px] text-white/50 uppercase">TOTAL ASSETS ADVISED</span>
                        <span className="text-3xl font-serif font-bold text-white">$18.4 Billion</span>
                    </div>
                    <div className="text-right">
                        <span className="block font-mono text-[10px] text-white/50 uppercase">DIVIDEND YIELD</span>
                        <span className="text-lg font-bold text-[#84b9ff]">3.82%</span>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-black/40 p-3 font-mono text-xs border border-white/5">
                    <div>
                        <span className="block text-[9px] text-white/40">OPERATING MARGIN</span>
                        <span className="font-bold text-white">41.8%</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-white/40">EPS DELTA</span>
                        <span className="font-bold text-emerald-400">$3.42 (+12%)</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/50">Audited by PwC</span>
                    <a
                        href="#download-q3"
                        className="inline-flex items-center gap-1 font-bold text-[#84b9ff] hover:underline"
                    >
                        <HiOutlineDocumentReport />
                        <span>Download 10-Q PDF</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

export default Q3FinancialResultsMetricCard

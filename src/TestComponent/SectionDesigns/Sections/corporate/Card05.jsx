// MacroResearchMemorandumCard

// Card05 · Corporate & Business › Cards

// Description:
// Square-edged research card from "NORTHSTAR INSTITUTE · MACRO RESEARCH" (Memorandum #44)
// presenting "The 2027 Global Liquidity Rebalancing" with a one-line summary, a mini bar
// chart of capital expenditure projections for 2025-2030, a "44 Pages · PDF" note and a
// "Download Whitepaper" button.

// Design:
// - <article> with header row, serif title + summary, chart panel (flex items-end h-16 with
//   six flex-1 columns, each a bar over a year label) and footer row
// - Near-black #0a0f17 background with border-2 #84b9ff/30; bars #84b9ff/80, filled
//   #84b9ff button (text #0a0f17, hover:bg-white); chart panel bg-black/60; white/40-70 text
// - rounded-none article, shadow-2xl, p-5; title font-serif text-xl bold; font-mono
//   text-[11px] / text-[9px] chart text; bars rounded-t-sm; rounded button
// - No breakpoints: fixed internal layout that stretches to the width of its grid cell

// What it does:
// - Purely presentational: no content props, no state
// - Bars are mapped from the inline array [25, 40, 58, 75, 92, 100] (inline style height
//   in %), with year labels computed from the index (2025-2030)
// - Link "Download Whitepaper" -> #download-macro with an HiOutlineDocumentText icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MacroResearchMemorandumCard from '@/TestComponent/SectionDesigns/Sections/corporate/Card05';

// const ResearchGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <MacroResearchMemorandumCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineDocumentText } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MacroResearchMemorandumCard({
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
                'overflow-hidden rounded-none border-2 border-[#84b9ff]/30 bg-[#0a0f17] p-5 text-white shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-[#84b9ff]/20 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#84b9ff] font-bold">
                    NORTHSTAR INSTITUTE &bull; MACRO RESEARCH
                </span>
                <span className="font-mono text-xs text-white/50">MEMORANDUM #44</span>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-xl font-bold leading-tight text-white">
                    The 2027 Global Liquidity Rebalancing
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    How sovereign wealth allocation into artificial intelligence data infrastructure is reshaping debt markets across the G10.
                </p>

                {/* Graph preview */}
                <div className="mt-4 rounded bg-black/60 p-3 border border-white/10 font-mono text-[11px]">
                    <div className="text-white/40">// Capital Expenditure Projections (2025–2030)</div>
                    <div className="flex items-end gap-2 h-16 mt-2">
                        {[25, 40, 58, 75, 92, 100].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full bg-[#84b9ff]/80 rounded-t-sm" style={{ height: `${h}%` }} />
                                <span className="text-[9px] text-white/40">202{5 + i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-xs text-white/40">44 Pages &bull; PDF</span>
                    <a
                        href="#download-macro"
                        className="inline-flex items-center gap-1.5 rounded bg-[#84b9ff] px-4 py-1.5 font-mono text-xs font-bold text-[#0a0f17] hover:bg-white transition-colors"
                    >
                        <HiOutlineDocumentText />
                        <span>Download Whitepaper</span>
                    </a>
                </div>
            </div>
        </article>
    )
}

export default MacroResearchMemorandumCard

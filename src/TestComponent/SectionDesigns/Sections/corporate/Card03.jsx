// ESGAuditScorecardCard

// Card03 · Corporate & Business › Cards

// Description:
// Dark sustainability scorecard for a 2026 ESG audit with an "AAA MSCI RATING" badge. It
// shows 1.8M tons of CO2e abated, a progress bar at "84% ON TRACK" toward the 2030
// net-zero target, Scope 1 & 2 emissions at -42% YoY, KPMG LLP as independent assurance,
// and a "View Full Disclosures" link.

// Design:
// - <article> with header row, headline figure row, labelled progress bar (h-2 track
//   bg-white/10, #84b9ff fill at w-[84%]), inset key-value panel and footer row
// - Deep navy #101b2a background, white text, sky-blue #84b9ff accents, emerald-400 on
//   emerald-500/20 for the rating and positive values, inset panel bg-black/30
// - rounded-2xl, border white/10, shadow-2xl, p-5; serif text-3xl bold figure; font-mono
//   text-[10px] / text-xs labels; rounded-full progress track
// - No breakpoints: fixed internal layout that stretches to the width of its grid cell

// What it does:
// - Purely presentational: no content props, no state; the 84% progress is a static class
// - Link "View Full Disclosures" -> #esg-report; HiOutlineGlobeAlt and HiCheck icons

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ESGAuditScorecardCard from '@/TestComponent/SectionDesigns/Sections/corporate/Card03';

// const SustainabilityGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <ESGAuditScorecardCard />
//     </div>
// )
// ```

'use client'

import { HiCheck, HiOutlineGlobeAlt } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ESGAuditScorecardCard({
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
                'overflow-hidden rounded-2xl border border-white/10 bg-[#101b2a] p-5 text-white shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#84b9ff] font-bold">
                    <HiOutlineGlobeAlt /> 2026 ESG AUDIT SCORECARD
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-bold">
                    AAA MSCI RATING
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <div>
                        <span className="block font-mono text-[10px] text-white/50 uppercase">PORTFOLIO DECARBONIZATION</span>
                        <span className="text-3xl font-serif font-bold text-white">1.8M Tons</span>
                    </div>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                        CO2e Abated
                    </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                    <div className="flex justify-between font-mono text-[10px] text-white/60 mb-1">
                        <span>2030 NET-ZERO TARGET GLIDEPATH</span>
                        <span className="text-[#84b9ff] font-bold">84% ON TRACK</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#84b9ff] w-[84%]" />
                    </div>
                </div>

                <div className="mt-4 space-y-1.5 rounded-xl bg-black/30 p-3 font-mono text-xs border border-white/5">
                    <div className="flex justify-between">
                        <span className="text-white/60">Scope 1 & 2 Emissions:</span>
                        <span className="text-white font-bold flex items-center gap-1">
                            <HiCheck className="text-emerald-400" /> -42% YoY
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/60">Independent Assurance:</span>
                        <span className="text-white font-bold">KPMG LLP</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/40 font-mono">GRI & SASB Aligned</span>
                    <a href="#esg-report" className="font-bold text-[#84b9ff] hover:underline">
                        View Full Disclosures &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default ESGAuditScorecardCard

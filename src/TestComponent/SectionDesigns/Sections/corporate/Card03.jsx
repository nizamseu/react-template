import { HiCheck, HiOutlineGlobeAlt } from 'react-icons/hi'

export default function Card03() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#101b2a] p-5 text-white shadow-2xl">
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

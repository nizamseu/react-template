import { HiOutlineDocumentText } from 'react-icons/hi'

export default function Card05() {
    return (
        <article className="overflow-hidden rounded-none border-2 border-[#84b9ff]/30 bg-[#0a0f17] p-5 text-white shadow-2xl">
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

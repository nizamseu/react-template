import { HiArrowRight, HiOutlineDocumentReport, HiOutlineTrendingUp } from 'react-icons/hi'

export default function Card01() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e1724] p-5 text-[#d9e4f2] shadow-2xl">
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

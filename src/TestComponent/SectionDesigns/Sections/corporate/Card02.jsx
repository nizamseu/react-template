import { HiArrowRight } from 'react-icons/hi'

export default function Card02() {
    return (
        <article className="overflow-hidden rounded-xl border border-gray-200 bg-[#f5f7f9] p-5 text-[#182434] shadow-sm">
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

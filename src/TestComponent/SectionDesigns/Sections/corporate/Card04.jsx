import { HiOutlineBriefcase } from 'react-icons/hi'

export default function Card04() {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#3476c5]/30 bg-[#0d1520] p-5 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#84b9ff] font-bold">
                    SENIOR MANAGING PARTNER &bull; LONDON
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-white/50">
                    <HiOutlineBriefcase /> 28 Yrs Advisory
                </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
                <img
                    className="h-16 w-16 rounded-xl object-cover border border-[#84b9ff]/40"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="Sir Alistair Vance"
                />
                <div>
                    <h3 className="font-serif text-lg font-bold text-white">Sir Alistair Vance</h3>
                    <p className="font-mono text-xs text-[#84b9ff]">Head of Sovereign & Global M&A</p>
                    <span className="text-[11px] text-white/50">Former HM Treasury Special Advisor</span>
                </div>
            </div>

            <div className="mt-4 rounded-xl bg-black/40 p-3 text-xs font-mono space-y-1 border border-white/5">
                <div className="flex justify-between">
                    <span className="text-white/50">MANDATE:</span>
                    <span className="text-white font-bold">Cross-Border Antitrust & M&A</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/50">DEAL VOLUME:</span>
                    <span className="text-white font-bold">$48B+ Lifetime Closed</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/50">BOARD ROLES:</span>
                    <span className="text-[#84b9ff]">Rolls-Royce, Bank of England Advisory</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/40">Registered FINRA / FCA</span>
                <button
                    type="button"
                    className="rounded-full bg-[#84b9ff] px-3.5 py-1.5 font-mono text-xs font-bold text-[#0d1520] hover:bg-white transition-colors"
                >
                    Request Executive Meeting
                </button>
            </div>
        </article>
    )
}

import { HiOutlineClock, HiOutlineEye } from 'react-icons/hi'

export default function Card05() {
    return (
        <article className="overflow-hidden rounded-xl border border-white/10 bg-[#1c1b18] p-5 text-[#f3eee6] shadow-2xl">
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-rose-400">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    LIVE VAULT AUCTION &bull; LOT #408
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-white/50">
                    <HiOutlineEye /> 84 watching
                </span>
            </div>

            <div className="relative mt-4 h-60 overflow-hidden rounded-lg bg-black">
                <img
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=85"
                    alt="Vintage 1974 Brazilian Rosewood Armchair"
                />
                <div className="absolute top-3 right-3 rounded bg-black/80 px-2 py-1 font-mono text-[10px] text-amber-300 backdrop-blur-sm">
                    CONDITION: MINT (A+)
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
                            ARCHIVE VAULT &bull; DESIGNED 1974
                        </span>
                        <h3 className="mt-1 font-serif text-lg font-bold text-white">
                            Brazilian Rosewood Lounge Chair
                        </h3>
                    </div>
                </div>

                {/* Auction Live Clock & Current Bid */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-white/5 p-3 font-mono border border-white/10">
                    <div>
                        <span className="block text-[10px] text-white/40">CURRENT BID (18 BIDS)</span>
                        <span className="text-lg font-black text-amber-300">$2,450</span>
                    </div>
                    <div className="text-right">
                        <span className="flex items-center justify-end gap-1 text-[10px] text-white/40">
                            <HiOutlineClock /> TIME LEFT
                        </span>
                        <span className="text-base font-black text-rose-400">04h 18m 32s</span>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        className="flex-1 rounded-lg bg-amber-400 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-black hover:bg-white transition-colors"
                    >
                        Place Bid ($2,500)
                    </button>
                    <button
                        type="button"
                        className="rounded-lg border border-white/20 px-3 py-2.5 text-xs font-mono text-white/80 hover:bg-white/10 transition-colors"
                    >
                        History
                    </button>
                </div>
            </div>
        </article>
    )
}

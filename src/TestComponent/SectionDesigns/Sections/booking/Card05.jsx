import { HiOutlineClock } from 'react-icons/hi'

export default function Card05() {
    return (
        <article className="overflow-hidden rounded-2xl border-2 border-[#e07d5b]/40 bg-[#0e1d24] p-5 text-[#dae6ec] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#e07d5b] font-bold">
                    <HiOutlineClock /> FLASH ESCAPE DEAL &bull; THIS WEEKEND
                </span>
                <span className="rounded bg-[#e07d5b]/20 px-2 py-0.5 font-mono text-[10px] text-[#e07d5b] font-bold">
                    SAVE 35%
                </span>
            </div>

            <div className="mt-4">
                <span className="font-mono text-[10px] text-white/50">2H DRIVE FROM NYC &bull; CATSKILLS</span>
                <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    The Modernist Timber Lodge
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    Canceled reservation opening for Fri 16 &ndash; Sun 18 Oct. Heated soaking cedar tub, indoor wood stove, 40 private forested acres.
                </p>

                {/* Price and Timer Box */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-black/40 p-3 font-mono border border-white/5">
                    <div>
                        <span className="block text-[9px] text-white/40">SPECIAL RATE</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-[#e07d5b]">$420</span>
                            <span className="text-xs line-through text-white/40">$650/nt</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-[9px] text-white/40">DEAL EXPIRES</span>
                        <span className="text-sm font-bold text-amber-300">06h 42m 14s</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#e07d5b] py-2.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#0e1d24] transition-colors"
                >
                    Claim Weekend Stay
                </button>
            </div>
        </article>
    )
}

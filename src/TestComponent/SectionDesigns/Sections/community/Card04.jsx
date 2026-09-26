import { HiStar } from 'react-icons/hi'

export default function Card04() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#1e1715] p-5 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffccad] font-bold">
                    GUILD MEMBER SPOTLIGHT &bull; OCT 2026
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-amber-300 font-bold">
                    <HiStar className="fill-amber-400" /> TOP 1% CONTRIBUTOR
                </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
                <img
                    className="h-14 w-14 rounded-full object-cover border-2 border-[#ffccad]"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Member avatar"
                />
                <div>
                    <h3 className="text-base font-bold text-white">Elena Rostova</h3>
                    <p className="font-mono text-xs text-[#ffccad]">@elena_design &bull; Berlin Chapter Lead</p>
                    <span className="text-[11px] text-white/50">Focus: Spatial Typography & Sound Design</span>
                </div>
            </div>

            {/* Contribution Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-black/40 p-3 text-center text-xs font-mono border border-white/5">
                <div>
                    <span className="block text-[9px] text-white/40">PRs MERGED</span>
                    <span className="font-bold text-[#ffccad]">84</span>
                </div>
                <div>
                    <span className="block text-[9px] text-white/40">CRITS GIVEN</span>
                    <span className="font-bold text-[#ffccad]">142</span>
                </div>
                <div>
                    <span className="block text-[9px] text-white/40">COMMUNITY KARMA</span>
                    <span className="font-bold text-[#ffccad]">6,480</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/50">Member since 2022</span>
                <button
                    type="button"
                    className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                >
                    View Guild Profile
                </button>
            </div>
        </article>
    )
}

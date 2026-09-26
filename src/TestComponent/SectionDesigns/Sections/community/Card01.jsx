import { HiOutlineMicrophone } from 'react-icons/hi'

export default function Card01() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#241c19] p-5 text-[#f7e6de] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-2 font-mono text-[10px] text-[#ffccad] uppercase tracking-wider font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE VOICE STAGE &bull; 84 TUNED IN
                </span>
                <span className="font-mono text-xs text-white/50">STAGE #04</span>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-xl font-bold text-white leading-tight">
                    Bootstrapping to $50k MRR: Real Metrics & Brutal Hardships
                </h3>
                <p className="mt-1 text-xs text-white/60">
                    Open microphone roundtable with 4 indie founders on churn reduction, pricing tiers, and surviving founder burnout.
                </p>

                {/* Speaker avatars & pulsing voice indicator */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-black/40 p-3 border border-white/5">
                    <div className="flex -space-x-2">
                        {[
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
                        ].map((src, idx) => (
                            <img
                                key={idx}
                                src={src}
                                alt="Speaker"
                                className="h-9 w-9 rounded-full object-cover border-2 border-[#241c19]"
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-[#ffccad]">
                        <HiOutlineMicrophone className="text-emerald-400 animate-pulse" />
                        <span>Elena Speaking...</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-xs text-white/40">Free to join</span>
                    <button
                        type="button"
                        className="rounded-full bg-[#ffccad] px-4 py-1.5 font-mono text-xs font-bold text-[#241c19] hover:bg-white transition-colors"
                    >
                        Join Stage Audio
                    </button>
                </div>
            </div>
        </article>
    )
}

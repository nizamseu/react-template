import { HiOutlineCode, HiOutlineLightningBolt } from 'react-icons/hi'

export default function Card05() {
    return (
        <article className="overflow-hidden rounded-xl border border-white/10 bg-[#291f1b] p-5 text-white shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 text-xs text-[#ffccad] font-bold">
                    <HiOutlineLightningBolt /> ACTIVE COMMUNITY BOUNTY #89
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    FUNDED IN ESCROW
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="font-sans text-base font-bold text-white">
                        Build a GLSL Fluid Particle Collision Hook
                    </h3>
                    <span className="text-xl font-black text-[#ffccad]">$850 USD</span>
                </div>
                <p className="mt-1 font-sans text-xs text-white/60">
                    Create a lightweight React 19 hook that handles 50,000 instanced particles colliding with pointer vectors at 60fps.
                </p>

                <div className="mt-4 space-y-1.5 rounded-lg bg-black/40 p-3 text-xs border border-white/5">
                    <div className="flex justify-between">
                        <span className="text-white/40">TECH STACK:</span>
                        <span className="text-white/80">React Three Fiber &bull; Three.js</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/40">DEADLINE:</span>
                        <span className="text-white/80">14 Days Remaining</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/40">SUBMISSIONS:</span>
                        <span className="text-[#ffccad]">3 Draft PRs Under Review</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">Difficulty: Medium</span>
                    <a
                        href="#claim-bounty"
                        className="inline-flex items-center gap-1 rounded bg-[#ffccad] px-3 py-1.5 text-xs font-bold text-[#291f1b] hover:bg-white transition-colors"
                    >
                        <HiOutlineCode />
                        <span>Claim Quest</span>
                    </a>
                </div>
            </div>
        </article>
    )
}

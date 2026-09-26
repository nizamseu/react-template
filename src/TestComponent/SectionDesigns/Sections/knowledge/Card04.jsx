import { HiArrowRight, HiOutlineTerminal } from 'react-icons/hi'

export default function Card04() {
    return (
        <article className="overflow-hidden rounded-none border border-white/20 bg-[#101c17] p-5 text-white shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 text-xs text-[#9bd2a7] font-bold">
                    <HiOutlineTerminal /> COOKBOOK RECIPE #24
                </span>
                <span className="text-[10px] text-white/40">15 MIN IMPLEMENTATION</span>
            </div>

            <div className="mt-4">
                <h3 className="font-sans text-base font-bold text-white">
                    Real-Time Multiplayer Presence with WebSockets & Redis Pub/Sub
                </h3>
                <p className="mt-1 font-sans text-xs text-white/60">
                    Production recipe for handling 100,000 concurrent cursor positions with delta-compression binary protocols.
                </p>

                <div className="mt-3 space-y-1.5 rounded-lg bg-black/40 p-3 text-xs border border-white/5">
                    <div className="flex justify-between">
                        <span className="text-white/40">STACK:</span>
                        <span className="text-white/80">Next.js 15 &bull; Node.js &bull; Upstash Redis</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/40">MEMORY OVERHEAD:</span>
                        <span className="text-emerald-400 font-bold">&lt; 14 MB per pod</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">Tested on Edge</span>
                    <a
                        href="#deploy-recipe"
                        className="inline-flex items-center gap-1 rounded bg-[#41715d] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                    >
                        <span>Clone Recipe</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

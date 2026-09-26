import { HiOutlineCube, HiOutlineServer } from 'react-icons/hi'

export default function Card05() {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#263640] bg-[#17232c] p-5 text-white shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-[#263640] pb-3">
                <span className="flex items-center gap-1.5 text-xs text-[#65e6b4]">
                    <HiOutlineCube /> DISTRIBUTED TOPOLOGY
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                    3 ACTIVE CLUSTERS
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-sans text-base font-bold text-white">
                    Multi-Region Microservice Graph
                </h3>
                <p className="mt-1 font-sans text-xs text-white/60">
                    Self-healing service mesh with automatic geo-steering and circuit breaker failover.
                </p>

                {/* Node Graph Mockup */}
                <div className="mt-4 rounded-xl bg-black/40 p-3 space-y-2 text-xs border border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-white/80">edge-gateway (Envoy)</span>
                        </div>
                        <span className="text-white/40">0.8ms &bull; 99.99%</span>
                    </div>
                    <div className="flex items-center justify-between pl-4 border-l border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-white/80">auth-service (OAuth2)</span>
                        </div>
                        <span className="text-white/40">2.1ms &bull; 100%</span>
                    </div>
                    <div className="flex items-center justify-between pl-4 border-l border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-white/80">db-replica (CockroachDB)</span>
                        </div>
                        <span className="text-white/40">4.6ms &bull; In Sync</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#263640] flex items-center justify-between text-xs">
                    <span className="text-white/50">Auto-scale: Nominal</span>
                    <a href="#view-mesh" className="text-[#65e6b4] hover:underline font-bold">
                        Inspect Mesh &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

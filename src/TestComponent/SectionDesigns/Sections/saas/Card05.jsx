// MultiRegionServiceMeshTopologyCard

// Card05 · SaaS Platforms › Cards

// Description:
// A dark infrastructure card labelled "Distributed topology", showing "3 active
// clusters". It describes a "Multi-Region Microservice Graph" (a self-healing
// service mesh with geo-steering and circuit-breaker failover). It lists three
// healthy nodes (edge-gateway / Envoy, auth-service / OAuth2, db-replica /
// CockroachDB) with latency and availability, and ends with "Auto-scale: Nominal"
// and an "Inspect Mesh" link.

// Design:
// - <article> with a header row, a title and summary, a black/40 node box whose
//   child rows are indented (pl-4 border-l) to suggest a tree, and a border-t
//   footer row.
// - Dark base #17232c with #263640 borders, a mint #65e6b4 accent, emerald-400
//   status dots and white/40-80 text.
// - Typography: font-mono by default, with a font-sans text-base bold title and
//   summary. The card is rounded-2xl with shadow-xl, and the node box rounded-xl.
// - Responsive: no breakpoint classes. The card fills its grid cell.

// What it does:
// - Purely presentational: no content props, no state.
// - One link to `#view-mesh` ("Inspect Mesh →"). The node rows are hard-coded (not
//   mapped).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MultiRegionServiceMeshTopologyCard from '@/TestComponent/SectionDesigns/Sections/saas/Card05';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <MultiRegionServiceMeshTopologyCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineCube, HiOutlineServer } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MultiRegionServiceMeshTopologyCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-2xl border border-[#263640] bg-[#17232c] p-5 text-white shadow-xl font-mono',
                className,
            )}
            {...props}
        >
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

export default MultiRegionServiceMeshTopologyCard

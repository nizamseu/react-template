// AIModelRouterTokenUsageCard

// Card04 · SaaS Platforms › Cards

// Description:
// A light card for an AI "Model orchestration pipeline" (router: optimal latency).
// It shows monthly token velocity (18.4M), a "99.8% cache hit" pill and two
// allocation bars: "Claude 3.7 Sonnet (Complex Reasoning)" at 64% and "DeepSeek R1 /
// Gemini 2.0 (Fast Retrieval)" at 36%. The footer notes "Dynamic fallback active"
// and links to "Tune Routing Weights".

// Design:
// - <article> with a header row, a metric row with a pill, two labelled progress
//   bars and a border-t footer row.
// - Light sage base #edf3ee with ink #111a22 text and a green #17a878 accent. The
//   bars run on gray-200 tracks filled with #111a22 (64%) and #17a878 (36%).
//   Borders are black/10 and secondary text gray-500.
// - Typography: 10-11px mono labels and a text-3xl font-black metric. The card is
//   rounded-2xl with shadow-xl, and the pill and bar tracks are rounded-full.
// - Responsive: no breakpoint classes. The card fills its grid cell.

// What it does:
// - Purely presentational: no content props, no state.
// - One link to `#configure-router`. Bar widths are fixed arbitrary values
//   (w-[64%], w-[36%]). Uses HiOutlineSparkles and HiOutlineLightningBolt icons.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AIModelRouterTokenUsageCard from '@/TestComponent/SectionDesigns/Sections/saas/Card04';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <AIModelRouterTokenUsageCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineLightningBolt, HiOutlineSparkles } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AIModelRouterTokenUsageCard({
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
                'overflow-hidden rounded-2xl border border-black/10 bg-[#edf3ee] p-5 text-[#111a22] shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#17a878]">
                    <HiOutlineSparkles /> MODEL ORCHESTRATION PIPELINE
                </span>
                <span className="font-mono text-xs font-bold text-gray-500">
                    ROUTER: OPTIMAL LATENCY
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <div>
                        <span className="block font-mono text-[10px] text-gray-500 uppercase">MONTHLY TOKEN VELOCITY</span>
                        <span className="text-3xl font-black text-[#111a22]">18.4M</span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#17a878]">
                        <HiOutlineLightningBolt /> 99.8% CACHE HIT
                    </span>
                </div>

                {/* Model Router Allocation */}
                <div className="mt-4 space-y-2 text-xs">
                    <div>
                        <div className="flex justify-between font-mono text-[11px] mb-1">
                            <span>Claude 3.7 Sonnet (Complex Reasoning)</span>
                            <span className="font-bold">64%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full bg-[#111a22] w-[64%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between font-mono text-[11px] mb-1">
                            <span>DeepSeek R1 / Gemini 2.0 (Fast Retrieval)</span>
                            <span className="font-bold">36%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full bg-[#17a878] w-[36%]" />
                        </div>
                    </div>
                </div>

                <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-mono">Dynamic fallback active</span>
                    <a href="#configure-router" className="font-bold text-[#17a878] hover:underline">
                        Tune Routing Weights &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default AIModelRouterTokenUsageCard

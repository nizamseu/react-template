import { HiOutlineLightningBolt, HiOutlineSparkles } from 'react-icons/hi'

export default function Card04() {
    return (
        <article className="overflow-hidden rounded-2xl border border-black/10 bg-[#edf3ee] p-5 text-[#111a22] shadow-xl">
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

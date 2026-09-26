import { HiOutlineLightningBolt, HiOutlineTrendingUp } from 'react-icons/hi'

export default function Card01() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1319] p-5 text-[#e3edf2] shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-2 text-xs text-[#17a878]">
                    <span className="h-2 w-2 rounded-full bg-[#17a878] animate-pulse" />
                    GLOBAL EDGE TELEMETRY
                </span>
                <span className="text-[10px] text-white/40">UPDATED 1S AGO</span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
                <div>
                    <span className="block text-[10px] text-white/50">P99 GLOBAL LATENCY</span>
                    <span className="text-3xl font-black text-white">14.2 ms</span>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] text-white/50">LIVE THROUGHPUT</span>
                    <span className="text-lg font-bold text-[#17a878]">482.4k req/s</span>
                </div>
            </div>

            {/* Sparkline Visual */}
            <div className="mt-4 flex h-14 items-end gap-1 border-b border-white/10 pb-2">
                {[45, 62, 58, 80, 75, 90, 84, 95, 88, 100, 92, 98, 94].map((h, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-[#17a878]/70 hover:bg-[#17a878] transition-colors"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>

            {/* Regional breakdown */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-white/60 pt-1">
                <div>
                    <span className="block text-white/40">US-EAST</span>
                    <span className="font-bold text-white">8.4ms</span>
                </div>
                <div>
                    <span className="block text-white/40">EU-CENTRAL</span>
                    <span className="font-bold text-white">11.2ms</span>
                </div>
                <div>
                    <span className="block text-white/40">AP-NORTHEAST</span>
                    <span className="font-bold text-white">16.8ms</span>
                </div>
            </div>
        </article>
    )
}

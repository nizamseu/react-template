import { HiCheck } from 'react-icons/hi'

export default function Card04() {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#ef6a4b]/40 bg-[#241d1a] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ef6a4b] font-bold">
                    SPRINT RETAINER &bull; 2-WEEK IMMERSIVE
                </span>
                <span className="rounded bg-[#ef6a4b]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#ef6a4b]">
                    1 SLOT LEFT FOR Q4
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-2xl font-bold text-white">
                        Brand Identity & Digital Foundation
                    </h3>
                    <span className="font-mono text-xl font-bold text-[#ef6a4b]">$14,000</span>
                </div>
                <p className="mt-1 text-xs text-white/60">
                    A hyper-focused 14-day sprint directly with Jamie Park. No account managers, no layers, pure high-velocity creative execution.
                </p>

                {/* Deliverables checklist */}
                <div className="mt-4 space-y-2 rounded-xl bg-black/40 p-3.5 text-xs font-mono border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Complete Design System Tokens</span>
                        <HiCheck className="text-[#ef6a4b]" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Hero WebGL / Motion Concept</span>
                        <HiCheck className="text-[#ef6a4b]" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Figma Production File + Guidelines</span>
                        <HiCheck className="text-[#ef6a4b]" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Live Video Handover & Dev Sync</span>
                        <HiCheck className="text-[#ef6a4b]" />
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center rounded-full bg-[#ef6a4b] py-2.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                >
                    Apply for Next Available Sprint
                </button>
            </div>
        </article>
    )
}

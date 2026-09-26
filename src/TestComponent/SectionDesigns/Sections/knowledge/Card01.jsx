import { HiOutlineCode } from 'react-icons/hi'

export default function Card01() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a16] p-5 text-[#e0ece6] shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        GET
                    </span>
                    <span className="text-xs font-bold text-white">/v2/orders/:id</span>
                </div>
                <span className="text-[10px] text-white/50">OPENAPI 3.1 SPEC</span>
            </div>

            <div className="mt-4">
                <h3 className="font-sans text-sm font-bold text-white">
                    Retrieve Single Order by Idempotency Key
                </h3>
                <p className="mt-1 font-sans text-xs text-white/60">
                    Returns complete customer object, fulfillment tracking webhooks, and cryptographic proof of payment.
                </p>

                {/* Parameters table mockup */}
                <div className="mt-3 rounded-lg bg-black/40 p-3 space-y-2 text-xs border border-white/5">
                    <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[10px] text-white/40">
                        <span>PARAMETER</span>
                        <span>TYPE & STATUS</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-emerald-300 font-bold">order_id</span>
                        <span className="text-[10px] text-amber-300">UUID &bull; Required</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-emerald-300 font-bold">expand[]</span>
                        <span className="text-[10px] text-white/50">Array[str] &bull; Optional</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-emerald-400">Response: 200 OK (application/json)</span>
                    <a href="#test-endpoint" className="text-[#9bd2a7] hover:underline font-bold flex items-center gap-1">
                        <HiOutlineCode />
                        <span>Interactive Console &rarr;</span>
                    </a>
                </div>
            </div>
        </article>
    )
}

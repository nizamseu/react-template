import { HiOutlineKey, HiOutlineShieldCheck } from 'react-icons/hi'

export default function Card03() {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#41715d] bg-[#121f1a] p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#9bd2a7] font-bold">
                    <HiOutlineKey /> CRYPTOGRAPHIC TRUST PATTERNS
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-bold">
                    RFC 7231
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-sans text-base font-bold text-white">
                    Guaranteeing Exactly-Once Execution with Idempotency Keys
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    How Northstar prevents duplicate financial charges during transient network timeouts and client retries using Redis TTL leases.
                </p>

                {/* Architecture diagram simulation */}
                <div className="mt-4 rounded-xl bg-black/40 p-3 font-mono text-xs border border-white/5 space-y-1.5">
                    <div className="text-white/40">// Request Header Specification</div>
                    <div className="text-emerald-300">Idempotency-Key: &quot;usr_9a4f_charge_4821&quot;</div>
                    <div className="text-white/40">// Cache Layer Behavior</div>
                    <div className="text-white/80">Redis SETNX &bull; TTL 24 Hours &bull; Lock: Acquired</div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-white/50">
                        <HiOutlineShieldCheck className="text-emerald-400" /> Replay-Attack Proof
                    </span>
                    <a href="#idempotency-spec" className="font-bold text-[#9bd2a7] hover:underline">
                        Read Architecture Whitepaper &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

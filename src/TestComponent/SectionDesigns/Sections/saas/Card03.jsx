import { HiCheck, HiOutlineShieldCheck } from 'react-icons/hi'

export default function Card03() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#121c24] p-5 text-[#d9e5ed] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <HiOutlineShieldCheck className="text-xl text-[#17a878]" />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        ENTERPRISE ASSURANCE
                    </span>
                </div>
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                    AUDIT PASSED
                </span>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-bold text-white">
                    Continuous Zero-Trust Security Mesh
                </h3>
                <p className="mt-1 text-xs text-white/60">
                    Automated cryptographic proofs, end-to-end envelope encryption, and real-time vulnerability monitoring.
                </p>

                {/* Compliance checklist */}
                <div className="mt-4 space-y-2 rounded-xl bg-black/30 p-3.5 text-xs font-mono border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">SOC2 Type II (Continuous)</span>
                        <HiCheck className="text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">HIPAA & HITECH Ready</span>
                        <HiCheck className="text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">ISO 27001 Certified Data Centers</span>
                        <HiCheck className="text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">AES-256 GCM Hardware HSM</span>
                        <HiCheck className="text-emerald-400" />
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/50 font-mono">Last audit: Sep 2026</span>
                    <a href="#compliance" className="font-bold text-[#17a878] hover:underline">
                        Request Security Packet &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

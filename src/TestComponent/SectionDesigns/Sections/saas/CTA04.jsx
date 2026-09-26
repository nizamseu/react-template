import { HiArrowRight, HiOutlineShieldCheck } from 'react-icons/hi'

export default function CTA04() {
    return (
        <section className="rounded-2xl border border-black/10 bg-[#edf3ee] p-8 text-[#111a22] sm:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#17a878]">
                        <HiOutlineShieldCheck className="text-sm" /> SECURITY AUDIT ARTIFACTS
                    </span>
                    <h2 className="mt-2 text-3xl font-black leading-tight">
                        Download Our Complete SOC2 Type II Audit Packet
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Includes independent auditor attestation report, third-party penetration test executive summaries, and continuous compliance control mappings.
                    </p>
                </div>

                <a
                    href="#download-audit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111a22] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-[#17a878] transition-colors shrink-0"
                >
                    <span>Instant Security Packet Access</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

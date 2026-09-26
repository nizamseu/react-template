import { HiArrowRight, HiOutlineShieldCheck, HiOutlineDocumentDownload } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="rounded-2xl border border-gray-200 bg-[#f9fafb] p-8 text-[#111827] sm:p-12 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#41715d]/10 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#41715d]">
                        <HiOutlineShieldCheck className="text-base" /> MISSION-CRITICAL ARCHITECTURE SUPPORT
                    </span>

                    <h2 className="mt-3 font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                        Deploying for Millions of Users? Get a Direct Architecture Audit &amp; 15-Min SLA.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        Enterprise tiers receive dedicated Technical Account Managers (TAM), private Slack channels with core engineers, throughput pre-provisioning, and custom contract terms.
                    </p>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
                            <span className="block font-mono text-xl font-bold text-[#41715d]">99.999%</span>
                            <span className="block text-[11px] text-gray-500 font-medium mt-0.5">Financially Backed SLA</span>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
                            <span className="block font-mono text-xl font-bold text-[#41715d]">&lt; 15 min</span>
                            <span className="block text-[11px] text-gray-500 font-medium mt-0.5">P1 Urgent Response</span>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
                            <span className="block font-mono text-xl font-bold text-[#41715d]">Slack/Teams</span>
                            <span className="block text-[11px] text-gray-500 font-medium mt-0.5">Direct TAM Access</span>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
                            <span className="block font-mono text-xl font-bold text-[#41715d]">SOC2 Type II</span>
                            <span className="block text-[11px] text-gray-500 font-medium mt-0.5">Certified &amp; HIPAA</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                    <a
                        href="#enterprise-consult"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17231f] px-6 py-3.5 font-sans text-xs font-bold text-white hover:bg-[#41715d] transition-colors shadow-md text-center"
                    >
                        <span>Schedule Architecture Review</span>
                        <HiArrowRight />
                    </a>
                    <a
                        href="#whitepaper"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-sans text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors text-center shadow-xs"
                    >
                        <HiOutlineDocumentDownload className="text-base text-gray-500" />
                        <span>Enterprise Whitepaper (PDF)</span>
                    </a>
                </div>
            </div>
        </section>
    )
}

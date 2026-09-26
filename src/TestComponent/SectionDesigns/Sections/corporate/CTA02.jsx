import { HiArrowRight } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="rounded-xl border border-white/20 bg-[#0b111a] p-8 text-white sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#84b9ff]">
                        2026 GLOBAL INVESTOR SYMPOSIUM &bull; ZURICH
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">
                        Annual Institutional Partners & LP Summit
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                        Join 250 sovereign wealth CIOs, private equity general partners, and Fortune 50 executives for two days of closed-door macroeconomic intelligence and direct bilateral dealmaking.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#register-symposium"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#84b9ff] px-6 py-3.5 font-mono text-xs font-bold text-[#0b111a] hover:bg-white transition-colors"
                    >
                        <span>Request Institutional Delegate Invitation</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-white/50 text-center">
                        Strict accreditation verification required
                    </span>
                </div>
            </div>
        </section>
    )
}

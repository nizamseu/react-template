import { HiArrowRight, HiOutlineBell, HiOutlineShieldCheck, HiCheck } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a110e] p-8 text-white sm:p-12 shadow-2xl font-mono">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            99.998% EDGES OPERATIONAL
                        </span>
                        <span className="text-xs text-white/40">CVE &bull; TLS 1.3 &bull; ZERO-DAY DISPATCH</span>
                    </div>

                    <h2 className="mt-3 font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        Instant Real-Time Alerts for Breaking Changes &amp; Security Advisories
                    </h2>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-white/70">
                        Never get caught off-guard by scheduled gateway maintenance, protocol deprecations, or security patches. Stream instant machine-readable alerts directly to your incident pipeline.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-white">
                            <HiCheck className="text-emerald-400" /> Webhook Payload
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-white">
                            <HiCheck className="text-emerald-400" /> PagerDuty Service
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-white">
                            <HiCheck className="text-emerald-400" /> Slack Channel
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-white">
                            <HiCheck className="text-emerald-400" /> Encrypted Email
                        </span>
                    </div>
                </div>

                <div className="w-full lg:w-96 rounded-xl border border-white/10 bg-black/50 p-5 shrink-0">
                    <div className="flex items-center gap-2 text-xs text-white/80 font-bold mb-3">
                        <HiOutlineBell className="text-emerald-400 text-base" />
                        <span>Incident Dispatch Subscription</span>
                    </div>
                    <div className="space-y-3">
                        <input
                            type="email"
                            placeholder="ops-oncall@company.com"
                            className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 font-sans text-xs font-bold text-black hover:bg-emerald-400 transition-colors shadow"
                        >
                            <span>Subscribe to Incident Alerts</span>
                            <HiArrowRight className="text-xs" />
                        </button>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                        <span className="flex items-center gap-1">
                            <HiOutlineShieldCheck className="text-emerald-400" /> Verified Feed
                        </span>
                        <a href="#status-page" className="text-emerald-400 hover:underline">
                            status.platform.dev &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

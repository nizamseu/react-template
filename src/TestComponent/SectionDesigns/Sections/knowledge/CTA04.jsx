import { HiArrowRight, HiOutlineCube, HiCheck, HiOutlineExternalLink } from 'react-icons/hi'

export default function CTA04() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1411] p-8 text-white sm:p-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#9bd2a7]">
                            <HiOutlineCube className="text-sm" /> PUBLIC RFC ROADMAP
                        </span>
                        <span className="font-mono text-xs text-white/40">Q4 2026 Cycle</span>
                    </div>

                    <h2 className="mt-4 font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        Need Native SDKs for Rust, Elixir, or Swift? Vote on What We Ship Next.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                        Our core engine protocol bindings are open-source. Help us prioritize official clients by upvoting open proposals or submit a formal Request for Comments (RFC).
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <a
                            href="#submit-rfc"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#41715d] px-5 py-3 font-sans text-xs font-bold text-white hover:bg-emerald-600 transition-colors shadow"
                        >
                            <span>Author New RFC Spec</span>
                            <HiArrowRight />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-sans text-xs font-bold text-white hover:bg-white/10 transition-colors"
                        >
                            <span>GitHub Projects Board</span>
                            <HiOutlineExternalLink className="text-sm text-white/60" />
                        </a>
                    </div>
                </div>

                <div className="w-full lg:w-[420px] space-y-2.5 font-mono shrink-0">
                    <div className="rounded-xl border border-[#9bd2a7]/30 bg-emerald-950/30 p-3.5 flex items-center justify-between">
                        <div>
                            <span className="block text-xs font-bold text-white">Rust Async SDK (tokio / hyper)</span>
                            <span className="text-[10px] text-emerald-400 font-semibold">RFC #142 &bull; In Code Review</span>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/40"
                        >
                            <HiCheck className="text-sm" /> 842 Upvoted
                        </button>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 flex items-center justify-between hover:border-white/25 transition-colors">
                        <div>
                            <span className="block text-xs font-bold text-white">Elixir OTP &amp; Broadway Producer</span>
                            <span className="text-[10px] text-white/50">RFC #156 &bull; Community Vote</span>
                        </div>
                        <button
                            type="button"
                            className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/80 hover:bg-white/15 transition-colors"
                        >
                            +618 Upvote
                        </button>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 flex items-center justify-between hover:border-white/25 transition-colors">
                        <div>
                            <span className="block text-xs font-bold text-white">Swift 6 Concurrency Bindings</span>
                            <span className="text-[10px] text-white/50">RFC #163 &bull; Needs 88 more votes</span>
                        </div>
                        <button
                            type="button"
                            className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/80 hover:bg-white/15 transition-colors"
                        >
                            +412 Upvote
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

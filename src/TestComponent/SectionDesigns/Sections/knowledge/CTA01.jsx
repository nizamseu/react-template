import { HiArrowRight, HiOutlineCode, HiOutlineExternalLink } from 'react-icons/hi'

export default function CTA01() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1714] p-8 text-white sm:p-12 shadow-2xl font-mono">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#41715d]/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#41715d]/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9bd2a7] border border-[#41715d]/40">
                            <HiOutlineCode className="text-sm" /> Docs-as-Code &bull; Apache 2.0
                        </span>
                        <span className="text-xs text-white/40">1,420+ Engineers Contributed</span>
                    </div>

                    <h2 className="mt-4 font-sans text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                        Spotted a Typo or Missing Recipe? Edit This Page on GitHub.
                    </h2>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-white/70">
                        Our entire knowledge base, distributed SDK references, and interactive tutorials are open-source. Submit a pull request, get reviewed by our core engineers within 24 hours, and earn official contributor recognition.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#9bd2a7] px-6 py-3 font-sans text-xs font-bold text-[#0f1714] hover:bg-white transition-all shadow-md"
                        >
                            <span>Fork & Edit on GitHub</span>
                            <HiOutlineExternalLink className="text-sm" />
                        </a>
                        <a
                            href="#good-first-issues"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-sans text-xs font-bold text-white hover:bg-white/10 transition-colors"
                        >
                            <span>Good First Issues (24)</span>
                            <HiArrowRight className="text-xs text-[#9bd2a7]" />
                        </a>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="rounded-xl border border-white/10 bg-black/60 p-4 shadow-inner">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white/40">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
                                <span className="ml-2 font-mono text-[11px] text-white/60">git-workflow.sh</span>
                            </div>
                            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">PR #1,492 MERGED</span>
                        </div>
                        <div className="mt-3 space-y-1.5 text-xs text-white/80 font-mono">
                            <p className="text-white/40"># Fork and create branch</p>
                            <p><span className="text-[#9bd2a7]">$</span> git checkout -b docs/fix-websocket-auth</p>
                            <p className="text-white/40 mt-2"># Validate markdown schema & run linter</p>
                            <p><span className="text-[#9bd2a7]">$</span> pnpm docs:lint --fix</p>
                            <p className="text-emerald-400 font-bold mt-2">&check; All 482 docstring tests passing</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

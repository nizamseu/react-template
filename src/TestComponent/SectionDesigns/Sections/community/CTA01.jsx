import { HiArrowRight } from 'react-icons/hi'

export default function CTA01() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#241c19] p-8 text-white sm:p-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffccad]">
                    PRIVATE DISCORD GUILD &bull; 24,000+ BUILDERS
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Where the World’s Most Ambitious Independent Creators Congregate.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Get access to private design teardown voice stages, co-founder match channels, and weekly live project demos. Zero spam, strictly moderated.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#discord-invite"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffccad] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#241c19] hover:bg-white transition-colors"
                    >
                        <span>Join Discord Community</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Free membership &bull; Invite links expire weekly
                    </span>
                </div>
            </div>
        </section>
    )
}

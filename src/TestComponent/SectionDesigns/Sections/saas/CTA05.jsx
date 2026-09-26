import { HiArrowRight } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="overflow-hidden rounded-none border-2 border-[#263640] bg-[#17232c] p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#65e6b4]">
                        OPEN-SOURCE CORE &bull; 14.8K GITHUB STARS
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-black">
                        Built in Public. Powered by 350+ Global Contributors.
                    </h2>
                    <p className="mt-2 font-mono text-xs text-white/70 max-w-xl">
                        Our core routing engine and edge proxy are 100% open source under the Apache 2.0 license. Join our weekly engineering office hours on Discord.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded border border-white/30 px-5 py-3 font-mono text-xs font-bold text-white hover:bg-white/10 transition-colors"
                    >
                        <span>Star on GitHub (14.8k)</span>
                    </a>
                    <a
                        href="#discord"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded bg-[#65e6b4] px-5 py-3 font-mono text-xs font-bold text-[#17232c] hover:bg-white transition-colors"
                    >
                        <span>Join 12,000+ on Discord</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'

export default function CTA01() {
    return (
        <section className="relative overflow-hidden rounded-none border-y-2 border-black bg-[#ef6a4b] p-8 text-[#241d1a] sm:p-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#241d1a]/80">
                    Q4 2026 COMMISSION AVAILABILITY &bull; 1 RESERVATION OPEN
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    Let’s Build Something That Redefines Your Category.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#241d1a]/80">
                    Typically engaged for comprehensive 8-to-12 week creative direction programs: foundational brand identity, custom typography systems, and boundary-pushing WebGL digital flagships.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#book-intro"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#241d1a] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-colors"
                    >
                        <span>Schedule 20-Min Intro Call</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-[#241d1a]/70 text-center sm:text-left">
                        NDA executed prior to review
                    </span>
                </div>
            </div>
        </section>
    )
}

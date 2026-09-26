import { HiArrowRight } from 'react-icons/hi'

export default function CTA01() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e272f] p-8 text-[#e8f3ea] sm:p-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#c8ef70]">
                    2026 EMERGING VOICES FELLOWSHIP &bull; 5 FULL-RIDE SCHOLARSHIPS
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Never Let Tuition Stand in the Way of Extraordinary Craft.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    We reserve 5 fully funded seats per cohort for underrepresented creatives. Includes 1-on-1 career coaching, equipment stipends, and placement introductions.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#apply-fellowship"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c8ef70] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0e272f] hover:bg-white transition-colors"
                    >
                        <span>Apply for Fellowship</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Deadline: Oct 30, 2026
                    </span>
                </div>
            </div>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="rounded-2xl border border-[#3c7e5d]/30 bg-[#12282e] p-8 text-white sm:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#c8ef70]">
                        PRIVATE MENTOR RESIDENCY &bull; Q4 APPLICATION WINDOW
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Six Months of Dedicated 1-on-1 Direction
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                        Paired with a design director suited to your career trajectory. Bi-weekly project feedback, portfolio re-architecture, and direct partner intros.
                    </p>
                </div>

                <a
                    href="#apply-residency"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c8ef70] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#12282e] hover:bg-white transition-colors shrink-0"
                >
                    <span>Apply for 1-on-1 Cohort</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

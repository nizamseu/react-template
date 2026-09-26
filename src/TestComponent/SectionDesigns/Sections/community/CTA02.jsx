import { HiArrowRight } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="rounded-xl border border-[#ebded7] bg-[#fcf8f5] p-8 text-[#2c1d18] sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#a34c38]">
                        CHAPTER AMBASSADOR FELLOWSHIP &bull; 2026 COHORT
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-black leading-tight">
                        Launch a CommonRoom Community in Your City
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#2c1d18]/70">
                        We provide up to $1,500 in quarterly venue stipends, event ticketing software, branded merchandise kits, and direct intros to world-class visiting speakers.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#apply-ambassador"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#a34c38] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-black transition-colors"
                    >
                        <span>Apply to Lead a Chapter</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-black/50 text-center">
                        Active in Tokyo, Berlin, London, New York, Seoul
                    </span>
                </div>
            </div>
        </section>
    )
}

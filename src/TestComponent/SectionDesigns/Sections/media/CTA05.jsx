import { HiArrowRight, HiOutlineAcademicCap } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="rounded-xl border border-[#443e39] bg-[#1a1816] p-8 text-[#ede8e1] sm:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#e7a37c]">
                        <HiOutlineAcademicCap className="text-sm" /> ACADEMIC DISPATCH &bull; FREE LICENSE
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Free Vault Access for Students, Educators & Public Libraries
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        We believe foundational cultural criticism belongs in public custody. Instant academic passes granted to all verified university institutions and public research collections.
                    </p>
                </div>

                <a
                    href="#academic-license"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e7a37c] px-6 py-3.5 font-mono text-xs font-bold text-[#e7a37c] hover:bg-[#e7a37c] hover:text-[#1a1816] transition-colors shrink-0"
                >
                    <span>Verify with .EDU Email</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

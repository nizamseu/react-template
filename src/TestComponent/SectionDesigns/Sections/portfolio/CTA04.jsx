import { HiArrowRight, HiOutlineSparkles } from 'react-icons/hi'

export default function CTA04() {
    return (
        <section className="rounded-2xl border border-[#ef6a4b]/30 bg-[#241d1a] p-8 text-white sm:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#ef6a4b]">
                        <HiOutlineSparkles className="text-sm" /> SPECULATIVE EXPERIMENTS LAB
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Have an Unhinged WebGL / 3D Spatial Idea?
                    </h2>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed">
                        I regularly partner with sound designers, creative technologists, and generative artists on non-commercial experiments aimed at pushing web graphics beyond current paradigms.
                    </p>
                </div>

                <a
                    href="#pitch-collab"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef6a4b] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#241d1a] transition-colors shrink-0"
                >
                    <span>Pitch Collaborative Project</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

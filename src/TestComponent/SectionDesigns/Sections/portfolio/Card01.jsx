import { HiArrowRight, HiOutlineSparkles } from 'react-icons/hi'

export default function Card01() {
    return (
        <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#1c1816] p-5 text-[#ede4de] shadow-2xl">
            <div className="relative h-64 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85"
                    alt="Aura Spatial Computing OS Case Study"
                />
                <div className="absolute top-3 left-3 rounded-full bg-black/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#ef6a4b] backdrop-blur-sm border border-[#ef6a4b]/30">
                    AWWWARDS SOTM &bull; 8.84 SCORE
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#ef6a4b]">
                    <span>CLIENT: AURA LABS &bull; SAN FRANCISCO</span>
                    <span className="flex items-center gap-1">
                        <HiOutlineSparkles /> 2026 CASE STUDY
                    </span>
                </div>

                <h3 className="mt-1 font-serif text-2xl font-bold text-white group-hover:text-[#ef6a4b] transition-colors">
                    Spatial Operating System & Kinetic Identity
                </h3>
                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                    Designed the complete visual architecture for a next-generation neural spatial interface, including 3D type geometry and custom WebGL shaders.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono text-white/70">
                    <span className="rounded bg-white/5 px-2 py-1">Spatial Design</span>
                    <span className="rounded bg-white/5 px-2 py-1">Custom Typeface</span>
                    <span className="rounded bg-white/5 px-2 py-1">Three.js Canvas</span>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-xs text-white/40">Read time: 8 min</span>
                    <a
                        href="#case-study"
                        className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#ef6a4b] hover:underline"
                    >
                        <span>View Project Case Study</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

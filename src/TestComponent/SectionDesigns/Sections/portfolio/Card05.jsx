import { HiOutlineBookmark } from 'react-icons/hi'

export default function Card05() {
    return (
        <article className="overflow-hidden rounded-none border border-white/20 bg-[#181412] p-5 text-[#e3deda] shadow-xl">
            <div className="relative h-56 overflow-hidden bg-black border border-white/10">
                <img
                    className="h-full w-full object-cover opacity-85 transition duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85"
                    alt="Atelier workspace in Stockholm"
                />
                <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-[#ef6a4b]">
                    STOCKHOLM &bull; STUDIO NOTE 84
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span>OCT 2026 &bull; 6 MIN READ</span>
                    <button aria-label="Save note" className="hover:text-white transition-colors">
                        <HiOutlineBookmark />
                    </button>
                </div>

                <h3 className="mt-1 font-serif text-xl font-normal text-white">
                    Reflections on Brutalist Screen Space: Why We Crave Texture Again
                </h3>
                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                    Flat corporate software flattened our emotional palette. Why high-fidelity typography, palpable grain, and deliberate spatial friction represent the next creative revolution.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/40">Field Dispatch</span>
                    <a href="#read-note" className="font-bold text-[#ef6a4b] hover:underline">
                        Read Studio Essay &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

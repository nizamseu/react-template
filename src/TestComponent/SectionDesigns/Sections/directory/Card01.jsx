import { HiOutlineCheck, HiOutlineLocationMarker, HiStar } from 'react-icons/hi'

export default function Card01() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#14201e] p-5 text-[#e3ece9] shadow-2xl">
            <div className="relative h-56 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                    alt="Fuglen Tokyo cafe"
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#14201e]/80 px-3 py-1 font-mono text-[10px] font-bold uppercase text-[#d9f064] backdrop-blur-sm border border-[#d9f064]/30">
                    SPECIALTY ROASTERY &bull; VINYL
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    <HiStar className="fill-amber-400" /> 4.9 (184 reviews)
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <HiOutlineLocationMarker className="text-[#d9f064]" />
                    <span>Tomigaya, Shibuya-ku &bull; Tokyo</span>
                </div>

                <h3 className="mt-1 font-bold text-xl text-white">
                    Fuglen Tokyo
                </h3>
                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Norwegian vintage furniture showroom by day, craft cocktail and jazz vinyl salon after dusk. Exceptional Nordic light roasts.
                </p>

                {/* Vibe and specs */}
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-black/30 p-2.5 font-mono text-[11px] border border-white/5">
                    <div>
                        <span className="text-white/40">ACOUSTIC LEVEL:</span>
                        <span className="block font-bold text-white">Low &bull; Vinyl Only</span>
                    </div>
                    <div>
                        <span className="text-white/40">WIFI & POWER:</span>
                        <span className="block font-bold text-[#d9f064]">180 Mbps &bull; Plugs</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                        <HiOutlineCheck /> Verified Anonymous Critique
                    </span>
                    <a href="#place" className="font-bold text-[#d9f064] hover:underline">
                        View Field Notes &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

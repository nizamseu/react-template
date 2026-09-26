import { HiOutlineLocationMarker, HiStar } from 'react-icons/hi'

export default function Card05() {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#527354] bg-[#1b2b27] p-5 text-white shadow-xl">
            <div className="relative h-56 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                    alt="Atmospheric courtyard dining bar"
                />
                <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-[#d9f064]">
                    NATURAL WINE &bull; TAPAS
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    <HiStar className="fill-amber-400" /> 4.92 (310 critiques)
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <HiOutlineLocationMarker className="text-[#d9f064]" />
                    <span>El Born &bull; Barcelona, Spain</span>
                </div>

                <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    Bar Brutal & Can Cisa
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    Low-intervention biodynamic wines poured straight from barrels in a 19th-century cellar. Wild fermentation tapas with zero pretension.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-serif italic text-white/50">&ldquo;A cathedral of natural wine.&rdquo;</span>
                    <a href="#view-tavern" className="font-bold text-[#d9f064] hover:underline">
                        Read Scout Review &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

import { HiOutlineLocationMarker, HiStar } from 'react-icons/hi'

export default function Card03() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#14232c] p-5 text-[#dce7ee] shadow-2xl">
            <div className="relative h-60 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80"
                    alt="Dolomites Alpine Glass Pavilion"
                />
                <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2.5 py-1 font-mono text-xs font-bold text-[#e07d5b]">
                    $720 / night
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    <HiStar className="fill-amber-400" /> 4.96 (51 stays)
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <HiOutlineLocationMarker className="text-[#e07d5b]" />
                    <span>South Tyrol, Italy &bull; Altitude 2,100m</span>
                </div>

                <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    Dolomites Alpine Glass Pavilion
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    360° unobstructed panoramic views of the jagged peaks. Includes private Finnish cedar barrel sauna and local biodynamic wine cellar.
                </p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <span className="font-mono text-white/40">Includes Alpine Guide</span>
                    <a href="#book-pavilion" className="font-bold text-[#e07d5b] hover:underline">
                        Explore Dates &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

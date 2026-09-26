import { HiOutlineLocationMarker, HiStar } from 'react-icons/hi'

export default function Card04() {
    return (
        <article className="overflow-hidden rounded-none border border-white/20 bg-[#12201c] p-5 text-white shadow-xl">
            <div className="relative h-56 overflow-hidden bg-black border border-white/10">
                <img
                    className="h-full w-full object-cover opacity-85 transition duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
                    alt="Independent bookshop interior"
                />
                <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-[#d9f064]">
                    BERLIN &bull; KREUZBERG
                </span>
                <span className="absolute top-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    <HiStar className="fill-amber-400" /> 4.95
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#d9f064]">
                    <span>ART &bull; CRITICAL THEORY &bull; ZINES</span>
                    <span className="text-white/40">OPEN TIL 8PM</span>
                </div>

                <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    Motto Books & Print Press
                </h3>
                <p className="mt-1 text-xs text-white/60">
                    An uncompromising library and distribution hub for self-published artist monographs, underground poetry zines, and risograph typography prints.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-white/50">
                        <HiOutlineLocationMarker /> Skalitzer Str. 68
                    </div>
                    <a href="#view-bookshop" className="font-bold text-[#d9f064] hover:underline">
                        Explore Inventory &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

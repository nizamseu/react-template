import { HiOutlinePhotograph } from 'react-icons/hi'

export default function Card04() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/15 bg-[#181614] p-5 text-[#ede8e1] shadow-2xl">
            <div className="relative h-64 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover grayscale contrast-125 transition duration-700 hover:scale-105 hover:grayscale-0"
                    src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=85"
                    alt="Rain-slicked alleyway in Shinjuku, Tokyo"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded bg-black/80 px-3 py-1 font-mono text-[10px] text-white/80 backdrop-blur-sm">
                    <span>LEICA M10 &bull; 35MM SUMMICRON</span>
                    <span>1/125S &bull; F/2.0 &bull; ISO 800</span>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#e7a37c]">
                    <span>VISUAL MONOGRAPH &bull; FOLIO 14</span>
                    <span className="flex items-center gap-1">
                        <HiOutlinePhotograph /> 18 PRINTS
                    </span>
                </div>

                <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    The Neon Rain of Kabukicho
                </h3>
                <p className="mt-1 text-xs text-white/60">
                    A three-year documentation of nocturnal transit workers and neon sign electricians by photojournalist Marcus Chen.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/40">Archival silver gelatin prints</span>
                    <a href="#view-gallery" className="font-bold text-[#e7a37c] hover:underline">
                        View Complete Folio &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

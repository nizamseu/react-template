import { HiStar } from 'react-icons/hi'

export default function Card04() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a2d36] p-5 text-white shadow-xl">
            <div className="relative h-56 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
                    alt="Japanese tea ceremony and ceramics in Kyoto"
                />
                <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2 py-0.5 font-mono text-xs text-[#e07d5b]">
                    $190 / guest
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    <HiStar className="fill-amber-400" /> 5.0 (48 reviews)
                </span>
            </div>

            <div className="mt-4">
                <span className="font-mono text-[10px] text-[#e07d5b] uppercase tracking-widest">
                    CRAFT MASTERCLASS &bull; 4 HOURS
                </span>
                <h3 className="mt-1 font-serif text-lg font-bold text-white">
                    Raku Pottery & Zen Tea with Master Chiba
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    Throw and fire your own ceramic tea bowl in a 200-year-old studio in Uji, followed by a private ceremonial matcha tasting.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/40">Keep hand-thrown chawan</span>
                    <a href="#reserve-masterclass" className="font-bold text-[#e07d5b] hover:underline">
                        Reserve Spot &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

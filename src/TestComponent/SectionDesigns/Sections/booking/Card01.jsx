import { HiOutlineLocationMarker, HiStar } from 'react-icons/hi'

export default function Card01() {
    return (
        <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#102530] p-5 text-[#e3edf2] shadow-2xl">
            <div className="relative h-64 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                    alt="The Clifftop Monolith Villa"
                />
                <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2.5 py-1 font-mono text-xs font-bold text-[#e07d5b] backdrop-blur-sm">
                    $680 / night
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300 backdrop-blur-sm">
                    <HiStar className="fill-amber-400" /> 4.98 (42 stays)
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <HiOutlineLocationMarker className="text-[#e07d5b]" />
                    <span>Big Sur, California &bull; Ocean Bluff</span>
                </div>

                <h3 className="mt-1 font-serif text-xl font-bold text-white group-hover:text-[#e07d5b] transition-colors">
                    The Clifftop Monolith Sanctuary
                </h3>
                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Designed by Studio Olson Kundig. 100% off-grid solar, private heated saltwater infinity pool, and dedicated private chef on call.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-1 rounded-lg bg-white/5 p-2 text-center font-mono text-[10px] text-white/70 border border-white/5">
                    <div>4 GUESTS</div>
                    <div>2 SUITES</div>
                    <div>PRIVATE SPA</div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/40">Verified Architecture</span>
                    <a href="#reserve-villa" className="font-bold text-[#e07d5b] hover:underline">
                        Reserve Villa &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

import { HiOutlineSparkles, HiStar } from 'react-icons/hi'

export default function Card03() {
    return (
        <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#161412] p-5 text-[#f5ede4] shadow-2xl">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#c5a880] tracking-widest uppercase">
                <span>HAUTE JOAILLERIE &bull; NO. 012</span>
                <span className="flex items-center gap-1">
                    <HiOutlineSparkles /> 1 OF 1 UNIQUE
                </span>
            </div>

            <div className="relative mt-4 h-64 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110 opacity-90"
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85"
                    alt="Hand-forged raw emerald monolith ring"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#c5a880] bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
                        ZAMBIA &bull; ETHICAL MINE
                    </span>
                    <span className="font-mono text-[10px] text-white/70">
                        2.4 CT RAW
                    </span>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-xl font-light tracking-wide text-white">
                    The Solstice Raw Emerald Ring
                </h3>
                <p className="mt-1 text-xs text-[#c5a880]/80">
                    Solid 18k recycled molten gold &bull; Lost-wax casting
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 border-y border-white/10 py-3 text-xs">
                    <div>
                        <span className="block text-[10px] font-mono text-white/40 uppercase">CERTIFICATION</span>
                        <span className="font-medium text-white/90">GIA Verified #841</span>
                    </div>
                    <div>
                        <span className="block text-[10px] font-mono text-white/40 uppercase">VALUATION</span>
                        <span className="font-serif text-sm font-bold text-[#c5a880]">$1,850 USD</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <button
                        type="button"
                        className="flex-1 rounded-full border border-[#c5a880] bg-[#c5a880]/10 py-2.5 text-center text-xs font-serif font-bold text-[#c5a880] hover:bg-[#c5a880] hover:text-black transition-colors"
                    >
                        Acquire Piece
                    </button>
                    <button
                        type="button"
                        className="rounded-full border border-white/20 px-3.5 py-2.5 text-xs text-white/70 hover:text-white transition-colors"
                    >
                        Inquire
                    </button>
                </div>
            </div>
        </article>
    )
}

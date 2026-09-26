import { HiOutlineLightningBolt, HiOutlineShoppingBag } from 'react-icons/hi'

export default function Card02() {
    return (
        <article className="overflow-hidden rounded-none border-2 border-black bg-[#d6f36a] p-5 text-black shadow-[6px_6px_0px_0px_#000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-black uppercase tracking-wider bg-black text-[#d6f36a] px-2 py-0.5">
                    <HiOutlineLightningBolt /> QUICK DROP &bull; 04/50
                </span>
                <span className="font-mono text-xs font-black">
                    STOCK: 4 REMAINING
                </span>
            </div>

            <div className="relative mt-4 overflow-hidden border-2 border-black bg-black">
                <img
                    className="h-60 w-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85"
                    alt="Technical Heavyweight Cyber Hoodie"
                />
                <span className="absolute bottom-2 right-2 bg-black px-2 py-0.5 font-mono text-xs font-bold text-white">
                    #480-GSM FLEECE
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="font-mono text-lg font-black uppercase tracking-tight">
                        MONOLITH HOODIE v2
                    </h3>
                    <span className="font-mono text-xl font-black">$240</span>
                </div>
                <p className="mt-1 font-mono text-xs text-black/70">
                    Oversized boxy cut &bull; Industrial cobalt dye &bull; YKK raw zips
                </p>

                {/* Stock Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between font-mono text-[10px] font-bold">
                        <span>ALLOCATION SOLD</span>
                        <span>92%</span>
                    </div>
                    <div className="mt-1 h-2.5 w-full border border-black bg-white/60 p-0.5">
                        <div className="h-full w-[92%] bg-black" />
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 border-2 border-black bg-black py-2.5 font-mono text-xs font-black uppercase tracking-wider text-[#d6f36a] hover:bg-white hover:text-black transition-colors"
                >
                    <HiOutlineShoppingBag className="text-sm" />
                    <span>CLAIM INSTANT DROP</span>
                </button>
            </div>
        </article>
    )
}

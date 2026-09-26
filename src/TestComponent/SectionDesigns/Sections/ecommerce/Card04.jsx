import { useState } from 'react'
import { HiOutlineCheck, HiOutlineShoppingBag, HiOutlineVolumeUp } from 'react-icons/hi'

export default function Card04() {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <article className="overflow-hidden rounded-2xl border border-[#d8c8ba] bg-[#f5ede4] p-5 text-[#2a231d] shadow-md">
            <div className="flex items-center justify-between border-b border-[#e2d5c8] pb-3">
                <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#9a704b]">
                    MAKER PROVENANCE &bull; VOL. 18
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#9a704b]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#9a704b]">
                    <HiOutlineCheck /> VERIFIED KILN
                </span>
            </div>

            <div className="relative mt-4 h-60 overflow-hidden rounded-xl bg-[#e6dbce]">
                <img
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=85"
                    alt="Hand-thrown Shigaraki volcanic clay vessel"
                />
                {/* Audio Soundbite Button */}
                <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-mono text-white backdrop-blur-sm hover:bg-black transition-colors"
                >
                    <HiOutlineVolumeUp className={isPlaying ? 'text-amber-400 animate-pulse' : ''} />
                    <span>{isPlaying ? 'Playing Kiln Sound (0:45)...' : 'Listen to Kiln Audio'}</span>
                </button>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg font-bold">
                        Shigaraki Volcanic Ash Vessel
                    </h3>
                    <span className="font-serif text-base font-bold text-[#9a704b]">$320</span>
                </div>
                <p className="mt-1 text-xs text-[#6e5e52]">
                    Fired for 7 days in wood-burning anagama kiln. Natural ash glaze.
                </p>

                {/* Provenance Metadata Table */}
                <div className="mt-3 rounded-lg bg-white/60 p-2.5 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between">
                        <span className="text-black/50">POTTER:</span>
                        <span className="font-bold">Kenji Sawada (3rd Gen)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-black/50">LOCATION:</span>
                        <span>Shiga Prefecture, Japan</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-black/50">EDITION:</span>
                        <span>Numbered 08 of 15</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2a231d] py-2.5 text-xs font-bold text-white hover:bg-[#9a704b] transition-colors"
                >
                    <HiOutlineShoppingBag className="text-sm" />
                    <span>Acquire Handcrafted Piece</span>
                </button>
            </div>
        </article>
    )
}

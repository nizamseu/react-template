import { useState } from 'react'
import { HiOutlineHeart, HiOutlineShoppingBag, HiStar } from 'react-icons/hi'

export default function Card01() {
    const [saved, setSaved] = useState(false)
    const [selectedColor, setSelectedColor] = useState('Terracotta')

    const swatches = [
        { name: 'Terracotta', bg: '#b35d45' },
        { name: 'Raw Umber', bg: '#614d3b' },
        { name: 'Bone Chalk', bg: '#ebe5da' },
    ]

    return (
        <article className="group overflow-hidden rounded-xl border border-[#e8e4dc] bg-[#fbf9f5] p-4 text-[#1e1c1a] shadow-sm hover:shadow-md transition-shadow">
            <div className="relative overflow-hidden rounded-lg bg-[#efe9de]">
                <img
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85"
                    alt="The Relaxed Atelier Linen Kimono"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-sm shadow-sm">
                    Drop 04 &bull; Look 08
                </span>
                <button
                    type="button"
                    onClick={() => setSaved(!saved)}
                    aria-label="Save this look"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black backdrop-blur-sm hover:scale-110 transition-transform"
                >
                    <HiOutlineHeart className={saved ? 'fill-rose-500 text-rose-500' : ''} />
                </button>
            </div>

            <div className="pt-4">
                <div className="flex items-center justify-between text-xs text-[#766b5e]">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#9a704b]">
                        STUDIO NORD &bull; SS26
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                        <HiStar className="text-amber-400 fill-amber-400" /> 4.95 (48)
                    </span>
                </div>

                <h3 className="mt-1 font-serif text-lg font-bold">
                    The Relaxed Atelier Kimono
                </h3>
                <p className="mt-0.5 text-xs text-[#766b5e]">
                    100% Belgian Washed Linen &bull; Hand-stitched cuffs
                </p>

                {/* Color Swatches */}
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#e8e4dc]">
                    <div className="flex items-center gap-2">
                        {swatches.map((s) => (
                            <button
                                key={s.name}
                                type="button"
                                onClick={() => setSelectedColor(s.name)}
                                title={s.name}
                                className={`h-4 w-4 rounded-full border-2 transition-transform ${
                                    selectedColor === s.name
                                        ? 'border-black scale-125'
                                        : 'border-transparent'
                                }`}
                                style={{ backgroundColor: s.bg }}
                            />
                        ))}
                        <span className="text-[11px] text-[#766b5e] ml-1">{selectedColor}</span>
                    </div>
                    <span className="font-serif text-base font-bold">$185</span>
                </div>

                <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1c1b19] py-2.5 text-xs font-bold text-white hover:bg-[#9a704b] transition-colors"
                >
                    <HiOutlineShoppingBag className="text-sm" />
                    <span>Add to Bag</span>
                </button>
            </div>
        </article>
    )
}

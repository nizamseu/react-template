import { useState } from 'react'

export default function Card03() {
    const [weight, setWeight] = useState(600)

    return (
        <article className="overflow-hidden rounded-xl border border-[#ded8cf] bg-[#f9f7f4] p-6 text-[#241d1a] shadow-md">
            <div className="flex items-center justify-between border-b border-[#ded8cf] pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ef6a4b] font-bold">
                    VARIABLE TYPE SPECIMEN &bull; JP-MONUMENTAL
                </span>
                <span className="font-mono text-xs text-[#241d1a]/50">
                    640 GLYPHS &bull; OPENTYPE
                </span>
            </div>

            <div className="mt-4">
                {/* Large typographic specimen */}
                <div
                    className="py-4 text-center font-serif text-5xl sm:text-6xl tracking-tight transition-all duration-150"
                    style={{ fontWeight: weight }}
                >
                    Aesthetics
                </div>

                <div className="mt-2 text-center text-xs text-[#736a61]">
                    &ldquo;Form follows sensation in the post-digital space.&rdquo;
                </div>

                {/* Interactive weight slider */}
                <div className="mt-6 rounded-lg bg-black/5 p-3">
                    <div className="flex justify-between font-mono text-[10px] text-[#241d1a]/70 mb-1">
                        <span>WEIGHT AXIS [wght]:</span>
                        <span className="font-bold">{weight}</span>
                    </div>
                    <input
                        type="range"
                        min="200"
                        max="900"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full accent-[#ef6a4b] cursor-pointer"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-[#241d1a]/40 mt-1">
                        <span>200 (Thin)</span>
                        <span>500 (Regular)</span>
                        <span>900 (Black)</span>
                    </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#ded8cf] flex items-center justify-between text-xs">
                    <span className="font-mono text-black/50">Commercial & Studio License</span>
                    <a href="#buy-font" className="font-bold text-[#ef6a4b] hover:underline">
                        Test Full Alphabet &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

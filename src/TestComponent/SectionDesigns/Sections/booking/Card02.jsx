export default function Card02() {
    return (
        <article className="overflow-hidden rounded-xl border border-[#d8e2e6] bg-[#f7f5f0] text-[#1c2c34] shadow-md">
            <div className="bg-[#1c2c34] p-4 text-white flex items-center justify-between">
                <span className="font-serif text-sm font-bold tracking-tight">ELSEWHERE AIRLINES &bull; FIRST SUITE</span>
                <span className="font-mono text-xs text-[#e07d5b]">FLIGHT EW-842</span>
            </div>

            <div className="p-5 font-mono">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl sm:text-3xl font-black">HND</span>
                        <span className="block text-[10px] text-gray-500 font-sans">Tokyo Haneda</span>
                    </div>
                    <div className="text-center text-xs text-gray-400">
                        <span>11h 45m</span>
                        <div className="w-16 border-t border-gray-400 my-1" />
                        <span>Direct</span>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black">KEF</span>
                        <span className="block text-[10px] text-gray-500 font-sans">Reykjavik Island</span>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-y border-gray-200 py-3 text-xs">
                    <div>
                        <span className="block text-[9px] text-gray-400">SEAT</span>
                        <span className="font-bold">02A (Suite)</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-400">GATE</span>
                        <span className="font-bold">Gate 14B</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-400">BOARDING</span>
                        <span className="font-bold text-[#b65f47]">22:15 JST</span>
                    </div>
                </div>

                {/* Barcode Graphic */}
                <div className="mt-4 flex items-center justify-between pt-1">
                    <div className="text-[10px] text-gray-400">
                        ||| | |||| | ||| || |||| | ||| || |
                    </div>
                    <a
                        href="#boarding-pass"
                        className="rounded bg-[#b65f47] px-3 py-1 text-xs font-sans font-bold text-white hover:bg-[#1c2c34] transition-colors"
                    >
                        View Itinerary
                    </a>
                </div>
            </div>
        </article>
    )
}

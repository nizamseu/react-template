import { HiOutlineClock, HiOutlineMap } from 'react-icons/hi'

export default function Card03() {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#527354] bg-[#182622] p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#d9f064] font-bold">
                    <HiOutlineMap /> CURATED WALKING ROUTE #06
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-white/50">
                    <HiOutlineClock /> 2.5 HOURS
                </span>
            </div>

            <div className="mt-4">
                <span className="font-mono text-[10px] text-white/40 uppercase">TOKYO &bull; CHIYODA-KU</span>
                <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    The Antiquarian Bookstores of Kanda-Jinbocho
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    A quiet afternoon trail traversing century-old woodblock print shops, Taisho-era kissaten coffee houses, and architectural monograph archives.
                </p>

                {/* Waypoint timeline */}
                <div className="mt-4 space-y-2 rounded-xl bg-black/40 p-3 font-mono text-xs border border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#d9f064]" />
                        <span className="text-white/80">Stop 1: Komiyama Book Store (Photography)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-1 border-l border-white/10 ml-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                        <span className="text-white/60">Stop 2: Saboru Kissaten (1955 Hand-Drip)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-1 border-l border-white/10 ml-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                        <span className="text-white/60">Stop 3: Ohya Shobo (Edo Maps & Scrolls)</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/40">Includes offline GPS map</span>
                    <a href="#open-route" className="font-bold text-[#d9f064] hover:underline">
                        Start Route on Mobile &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

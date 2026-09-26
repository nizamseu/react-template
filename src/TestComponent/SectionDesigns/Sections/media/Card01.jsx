import { HiArrowRight, HiOutlineBookmark } from 'react-icons/hi'

export default function Card01() {
    return (
        <article className="overflow-hidden rounded-xl border border-[#ded8cb] bg-[#f2efe9] p-6 text-[#1c1d1a] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#ded8cb] pb-3">
                <span className="font-bold text-[#a8472b] uppercase tracking-widest">
                    COVER ESSAY &bull; ISSUE NO. 48
                </span>
                <div className="flex items-center gap-3">
                    <span className="text-black/50">14 MIN READ</span>
                    <button aria-label="Bookmark essay" className="hover:text-[#a8472b] transition-colors">
                        <HiOutlineBookmark className="text-sm" />
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-2xl font-normal leading-tight hover:text-[#a8472b] transition-colors cursor-pointer">
                    The Architecture of Silence: In Praise of Tokyo’s Third Places
                </h3>
                <p className="mt-1 font-mono text-[11px] text-[#787163]">
                    BY DR. HARUKI TANAKA &bull; PHOTOGRAPHY BY TADAO SHIN
                </p>

                {/* Excerpt with drop cap styling */}
                <div className="mt-4 text-xs leading-relaxed text-[#45423a]">
                    <span className="float-left mr-2 font-serif text-3xl font-bold leading-none text-[#a8472b]">
                        W
                    </span>
                    hen the Yamanote train slows to a halt at 01:14 AM, the city sheds its metallic skin. What remains are the cedar-lined kissaten counters and five-seat jazz bars that shelter Tokyo’s late-night solitary thinkers.
                </div>

                <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#ded8cb] text-xs">
                    <span className="font-mono text-[10px] text-black/50 uppercase">ANTHROPOLOGY &bull; CITIES</span>
                    <a href="#read" className="inline-flex items-center gap-1 font-bold text-[#a8472b] hover:underline">
                        <span>Read Full Essay</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

import { HiOutlineCalendar, HiOutlineLocationMarker } from 'react-icons/hi'

export default function Card03() {
    return (
        <article className="overflow-hidden rounded-2xl border border-black/10 bg-[#ffccad] p-5 text-[#27201d] shadow-md">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider font-black text-[#a34c38]">
                    OFFLINE CHAPTER MEETUP #14
                </span>
                <span className="rounded bg-black/10 px-2 py-0.5 font-mono text-[10px] font-bold">
                    FREE ENTRY
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#a34c38]">
                    <HiOutlineCalendar /> THU, NOV 07 &bull; 6:30 PM JST
                </div>
                <h3 className="mt-1 font-serif text-xl font-bold leading-tight">
                    Tokyo Creative Technology & Generative Aesthetics
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#27201d]/75">
                    <HiOutlineLocationMarker /> Roppongi Hills Hub, Studio 4, Minato City
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-white/70 p-3 text-xs border border-black/5">
                    <div>
                        <span className="block font-mono text-[10px] text-black/50">CONFIRMED RSVPS</span>
                        <span className="font-black text-sm text-[#27201d]">42 / 50 Attendees</span>
                    </div>
                    <span className="font-mono text-[10px] text-rose-700 font-bold">
                        Only 8 Seats Left
                    </span>
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#27201d] py-2.5 font-mono text-xs font-bold text-white hover:bg-[#a34c38] transition-colors"
                >
                    <span>RSVP for Free Pass</span>
                </button>
            </div>
        </article>
    )
}

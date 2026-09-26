import { HiOutlineCalendar, HiOutlineTicket } from 'react-icons/hi'

export default function Card02() {
    return (
        <article className="overflow-hidden rounded-xl border-2 border-[#102d36] bg-[#f5f1e8] text-[#102d36] shadow-[5px_5px_0px_0px_#102d36]">
            {/* Ticket Header */}
            <div className="bg-[#102d36] p-4 text-white flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#c8ef70]">
                    WEEKEND MASTERCLASS PASS
                </span>
                <span className="font-mono text-xs text-white/70">TICKET #8402</span>
            </div>

            {/* Perforated Divider Simulation */}
            <div className="relative border-b-2 border-dashed border-[#102d36]/30 my-0.5">
                <span className="absolute -left-2 -top-2.5 h-5 w-5 rounded-full bg-white border border-[#102d36]" />
                <span className="absolute -right-2 -top-2.5 h-5 w-5 rounded-full bg-white border border-[#102d36]" />
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#3c7e5d]">
                    <HiOutlineCalendar /> SAT, OCT 26 &bull; 10:00AM EST (3 HOURS)
                </div>
                <h3 className="mt-2 font-serif text-xl font-bold leading-tight">
                    GLSL Shaders & WebGL Real-Time Graphics
                </h3>
                <p className="mt-1 text-xs text-[#102d36]/75">
                    Live coding workshop creating fluid simulations, vertex displacement, and post-processing filters with Bruno Simon.
                </p>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-white/70 p-3 text-xs border border-[#102d36]/10">
                    <div>
                        <span className="block text-[10px] font-mono text-gray-500">ADMISSION FEE</span>
                        <span className="font-bold text-base">$120 USD</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] font-mono text-rose-600 font-bold">AVAILABILITY</span>
                        <span className="font-bold">6 Seats Left</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#102d36] py-2.5 font-mono text-xs font-bold text-white hover:bg-[#3c7e5d] transition-colors"
                >
                    <HiOutlineTicket className="text-base text-[#c8ef70]" />
                    <span>CLAIM WORKSHOP PASS</span>
                </button>
            </div>
        </article>
    )
}

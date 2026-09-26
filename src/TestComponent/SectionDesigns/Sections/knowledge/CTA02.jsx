import { HiArrowRight, HiCalendar, HiClock, HiOutlineVideoCamera } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-[#41715d]/40 bg-[#12201a] p-8 text-white sm:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#9bd2a7]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#9bd2a7]">
                            LIVE ENGINEERING OFFICE HOURS &bull; EVERY WEDNESDAY
                        </span>
                    </div>

                    <h2 className="mt-3 font-sans text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                        Deep-Dive Architecture AMA with Core Systems Maintainers
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                        Join our Principal Distributed Systems Architects and SRE Leads for unscripted technical discussions on query latency optimization, consensus failover, and multi-region synchronization.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-white/60 font-mono">
                        <span className="flex items-center gap-1.5 text-white/90">
                            <HiCalendar className="text-[#9bd2a7]" /> Every Wed @ 11:00 AM PT
                        </span>
                        <span className="flex items-center gap-1.5 text-white/90">
                            <HiClock className="text-[#9bd2a7]" /> 45 Minutes Live Q&amp;A
                        </span>
                        <span className="flex items-center gap-1.5 text-white/90">
                            <HiOutlineVideoCamera className="text-[#9bd2a7]" /> Google Meet / YouTube Live
                        </span>
                    </div>
                </div>

                <div className="w-full lg:w-96 rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm shrink-0">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-3">
                        Submit Question for Next Session
                    </span>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="e.g., How do you handle split-brain in raft?"
                            className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#9bd2a7] focus:outline-none"
                        />
                        <input
                            type="email"
                            placeholder="your.email@company.com"
                            className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#9bd2a7] focus:outline-none"
                        />
                        <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#9bd2a7] px-4 py-2.5 font-sans text-xs font-bold text-[#12201a] hover:bg-white transition-all shadow"
                        >
                            <span>RSVP &amp; Add to Calendar</span>
                            <HiArrowRight className="text-xs" />
                        </button>
                    </div>
                    <p className="mt-2.5 text-center text-[10px] text-white/40 font-mono">
                        Calendar invite (.ics) sent immediately.
                    </p>
                </div>
            </div>
        </section>
    )
}

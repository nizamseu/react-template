import { HiArrowRight } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="overflow-hidden rounded-none border-2 border-white/20 bg-[#111111] p-8 text-white sm:p-12 shadow-[8px_8px_0px_0px_#ef6a4b]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#ef6a4b]">
                        AGENCY FRACTIONAL PARTNERSHIP
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight">
                        NEED EXECUTIVE CREATIVE WEIGHT ON YOUR HIGH-STAKES PITCH?
                    </h2>
                    <p className="mt-2 font-mono text-xs text-white/70 max-w-xl">
                        White-label executive creative direction for leading design agencies in London, Amsterdam, and Tokyo pitching global enterprise brands.
                    </p>
                </div>

                <a
                    href="#partner-inquiry"
                    className="inline-flex items-center justify-center gap-2 rounded-none border border-[#ef6a4b] bg-[#ef6a4b] px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-black hover:bg-white transition-colors shrink-0"
                >
                    <span>Request Agency Deck</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

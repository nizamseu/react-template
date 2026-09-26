import { HiArrowRight } from 'react-icons/hi'

export default function CTA01() {
    return (
        <section className="rounded-none border-y-2 border-black bg-[#f2efe9] p-8 text-[#1c1d1a] sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#a8472b]">
                        WEEKEND PRINT EDITION &bull; HOME DELIVERY
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                        Hold the Sunday Broadsheet in Your Hands.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#59554d]">
                        Printed every Friday evening on 90gsm uncoated Swedish broadsheet paper. Hand-delivered to subscribers across 14 cities in North America, Europe, and Japan.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                    <a
                        href="#subscribe-print"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1d1a] px-6 py-3.5 font-serif text-xs font-bold text-white hover:bg-[#a8472b] transition-colors"
                    >
                        <span>Subscribe for $12 / Month</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-black/50 text-center">
                        Includes unmetered digital vault access & audio feeds
                    </span>
                </div>
            </div>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'

export default function CTA01() {
    return (
        <section className="relative overflow-hidden rounded-none border-t-2 border-[#84b9ff] border-b border-white/10 bg-[#0e1724] p-8 text-white sm:p-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#84b9ff]">
                    CONFIDENTIAL ADVISORY MANDATES &bull; BOARD LEVEL
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-white leading-tight">
                    Strategic Counsel for Defining Moments in Enterprise History.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Direct engagement with our senior managing partners in London, Zurich, and New York. Strictly confidential discussions regarding acquisitions, recapitalizations, and sovereign alignment.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#request-consultation"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#84b9ff] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0e1724] hover:bg-white transition-colors"
                    >
                        <span>Schedule Confidential Advisory Call</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Signed mutual NDA guaranteed prior to call
                    </span>
                </div>
            </div>
        </section>
    )
}

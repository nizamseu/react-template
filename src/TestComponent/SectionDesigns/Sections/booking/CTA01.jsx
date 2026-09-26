import { HiArrowRight } from 'react-icons/hi'

export default function CTA01() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#102530] p-8 text-white sm:p-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e07d5b]">
                    PRIVATE ISLAND & RESIDENCE BUYOUTS &bull; BESPOKE ACCESS
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-normal leading-tight">
                    Exclusive Solitude for What Matters Most.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Complete sanctuary buyouts for multi-generational sabbaticals, executive summits, and creative retreats. Dedicated private aviation liaisons and discrete on-site staff.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#inquire-concierge"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e07d5b] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-[#102530] transition-colors"
                    >
                        <span>Inquire with Private Concierge</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Responses within 4 hours &bull; Strict confidentiality
                    </span>
                </div>
            </div>
        </section>
    )
}

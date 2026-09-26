import { HiArrowRight } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="rounded-xl border border-[#e8e4dc] bg-[#faf9f5] p-8 text-[#1e1c1a] sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#9a704b]">
                        FOR ARCHITECTS & INTERIOR STUDIOS
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                        Design Trade Program & Bespoke Curation
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#766b5e]">
                        Exclusive trade discounts up to 30%, custom millwork sizing, material swatch library dispatch, and dedicated project management for residential and hospitality projects.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                    <a
                        href="#apply-trade"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1e1c1a] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#9a704b] transition-colors"
                    >
                        <span>Apply for Trade Membership</span>
                        <HiArrowRight />
                    </a>
                    <a
                        href="#order-swatches"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-6 py-3 text-xs font-semibold text-[#1e1c1a] hover:bg-black/5 transition-colors"
                    >
                        <span>Request Material Swatch Box</span>
                    </a>
                </div>
            </div>
        </section>
    )
}

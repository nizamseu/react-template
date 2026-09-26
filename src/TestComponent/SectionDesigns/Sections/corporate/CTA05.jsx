import { HiArrowRight } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="overflow-hidden rounded-none border-2 border-[#84b9ff]/30 bg-[#0a0f17] p-8 text-white sm:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#84b9ff]">
                        ENTERPRISE STRATEGIC RFP DESK
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Submitting an Enterprise Advisory or Restructuring Tender?
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Our specialized bids team reviews enterprise RFPs with guaranteed 48-hour turnarounds on fee structures, conflict checks, and multidisciplinary partner staffing.
                    </p>
                </div>

                <a
                    href="#submit-rfp"
                    className="inline-flex items-center justify-center gap-2 rounded bg-[#84b9ff] px-6 py-3.5 font-mono text-xs font-bold text-[#0a0f17] hover:bg-white transition-colors shrink-0"
                >
                    <span>Submit RFP Documents</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

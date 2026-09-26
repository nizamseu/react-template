import { HiArrowRight } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="rounded-xl border border-white/10 bg-[#191919] p-8 text-white sm:p-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                    <span className="font-mono text-xs text-[#e7a37c] font-bold uppercase tracking-widest">
                        ZERO CORPORATE SPONSORSHIP &bull; 100% PATRON BACKED
                    </span>
                    <h2 className="mt-3 font-serif text-3xl font-light leading-tight">
                        Critical Journalism Without Advertisers or Paywall Clickbait
                    </h2>
                    <p className="mt-3 text-sm text-white/70 leading-relaxed">
                        We refuse affiliate revenue, brand activations, and sponsored listicles. Every investigation is funded entirely by small recurring pledges from 42,000 patrons.
                    </p>
                </div>

                <div className="rounded-xl bg-white/5 p-5 border border-white/10 shrink-0 sm:w-80">
                    <span className="block font-mono text-[10px] text-white/50 mb-3">SELECT PATRON TIER:</span>
                    <div className="grid grid-cols-3 gap-2 font-mono text-xs font-bold mb-4">
                        <button type="button" className="rounded border border-white/20 p-2 hover:border-[#e7a37c] hover:text-[#e7a37c]">
                            $5/mo
                        </button>
                        <button type="button" className="rounded border-2 border-[#e7a37c] p-2 bg-[#e7a37c]/10 text-[#e7a37c]">
                            $15/mo
                        </button>
                        <button type="button" className="rounded border border-white/20 p-2 hover:border-[#e7a37c] hover:text-[#e7a37c]">
                            $50/mo
                        </button>
                    </div>
                    <a
                        href="#pledge"
                        className="flex items-center justify-center gap-2 w-full rounded bg-[#e7a37c] py-2.5 font-mono text-xs font-bold text-[#191919] hover:bg-white transition-colors"
                    >
                        <span>Join Patron Fellowship</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

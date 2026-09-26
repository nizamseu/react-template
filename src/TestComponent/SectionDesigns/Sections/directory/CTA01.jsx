import { HiArrowRight, HiOutlineShieldCheck } from 'react-icons/hi'

export default function CTA01() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#14201e] p-8 text-white sm:p-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#d9f064]">
                    <HiOutlineShieldCheck className="text-sm" /> PROPRIETOR VERIFICATION &bull; ZERO ADS
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold leading-tight">
                    Own an Independent Workshop, Roastery, or Bookstore?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Claim your official verified directory marker. Update operating hours, respond directly to patron notes, and showcase your maker story. 100% free forever.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#claim-listing"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9f064] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#14201e] hover:bg-white transition-colors"
                    >
                        <span>Claim Your Independent Listing</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Verified via business registration or postal dispatch
                    </span>
                </div>
            </div>
        </section>
    )
}

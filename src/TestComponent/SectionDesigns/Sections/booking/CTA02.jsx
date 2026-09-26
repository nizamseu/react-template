import { HiArrowRight } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="rounded-xl border border-[#d8e2e6] bg-[#f7f5f0] p-8 text-[#1c2c34] sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#b65f47]">
                        THE ELSEWHERE ANNUAL KEY &bull; 14 NIGHTS GLOBALLY
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
                        One Flexible Membership. 48 Extraordinary Residences.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#1c2c34]/70">
                        Enjoy 14 redeemable nights throughout the year across our entire global portfolio of architectural sanctuaries. Priority dates, waived deposit fees, and dedicated private chef services.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#request-key"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#b65f47] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-[#1c2c34] transition-colors"
                    >
                        <span>Request Keyholder Portfolio</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-gray-500 text-center">
                        Limited to 150 members globally per year
                    </span>
                </div>
            </div>
        </section>
    )
}

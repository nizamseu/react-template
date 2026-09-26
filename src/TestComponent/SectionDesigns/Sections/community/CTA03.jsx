import { HiArrowRight } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="overflow-hidden rounded-none border-2 border-black bg-[#ffccad] p-8 text-[#27201d] sm:p-12 shadow-[8px_8px_0px_0px_#000]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-black text-[#ffccad] px-2 py-0.5">
                        GLOBAL VIRTUAL HACKATHON &bull; $50,000 PRIZE POOL
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-black">
                        48 Hours. 1,000 Builders. Build Something You Love.
                    </h2>
                    <p className="mt-2 text-sm text-[#27201d]/80 max-w-xl">
                        Free cloud credits, design mentorship from industry icons, and instant angel syndicate review for the top 5 winning teams.
                    </p>
                </div>

                <a
                    href="#hackathon-register"
                    className="inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#ffccad] hover:bg-white hover:text-black transition-colors shrink-0"
                >
                    <span>Register Hackathon Team</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'

export default function CTA04() {
    return (
        <section className="overflow-hidden rounded-none border-2 border-black bg-[#c8ef70] p-8 text-[#102d36] shadow-[8px_8px_0px_0px_#000]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-black text-[#c8ef70] px-2 py-0.5">
                        OPEN OFFICE HOURS &bull; THURSDAYS 12:00 PM EST
                    </span>
                    <h2 className="mt-3 font-mono text-2xl sm:text-4xl font-black uppercase tracking-tight">
                        GET YOUR PORTFOLIO TEARDOWN LIVE BY AGENCY DIRECTORS.
                    </h2>
                    <p className="mt-2 font-mono text-xs text-black/75 max-w-xl">
                        Submit your Figma file or live URL. 3 designers selected every week for brutal, constructive 20-minute live critique.
                    </p>
                </div>

                <a
                    href="#submit-portfolio"
                    className="inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#c8ef70] hover:bg-white hover:text-black transition-colors shrink-0"
                >
                    <span>Submit Portfolio Link</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

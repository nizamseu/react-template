import { HiArrowRight } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="overflow-hidden rounded-none border-2 border-black/10 bg-[#d9f064] p-8 text-[#1a2826] sm:p-12 shadow-[8px_8px_0px_0px_#1a2826]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-[#1a2826] text-[#d9f064] px-2 py-0.5">
                        COMMUNITY FIELD SCOUTING
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-black">
                        Know an Unsung Local Gem in Your Neighborhood?
                    </h2>
                    <p className="mt-2 text-sm text-[#1a2826]/80 max-w-xl">
                        Submit third places, heritage tailors, ceramic kilns, and listening bars. Our anonymous editorial scouts visit every submission unannounced before listing.
                    </p>
                </div>

                <a
                    href="#submit-spot"
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#1a2826] bg-[#1a2826] px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#d9f064] hover:bg-white hover:text-[#1a2826] transition-colors shrink-0"
                >
                    <span>Submit Spot for Scout Review</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

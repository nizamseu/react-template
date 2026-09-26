import { HiArrowRight } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="rounded-none border-y-2 border-[#b65f47] bg-[#14232c] p-8 text-[#dce7ee] sm:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                    <span className="font-mono text-xs text-[#e07d5b] uppercase tracking-wider font-bold">
                        BESPOKE EXPEDITIONS &bull; PRIVATE RESIDENCE ODYSSEYS
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-white">
                        Curate a 30-Day Architectural Journey Across Three Continents
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        Our regional scouts design bespoke multi-residence expeditions: from modernist post-and-beam desert homes in Palm Springs to volcanic hot spring sanctuaries in Hakone.
                    </p>
                </div>

                <a
                    href="#custom-itinerary"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e07d5b] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#14232c] transition-colors shrink-0"
                >
                    <span>Design Custom Odyssey</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

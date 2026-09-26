import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#d4ddd1] bg-white p-7 text-[#1a2826] sm:p-9">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#527354]">
                        THE NEIGHBORHOOD NOTE
                    </p>
                    <h2 className="mt-2 text-3xl font-black">
                        A short list of places worth knowing.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Local openings, useful guides, and community
                        recommendations.
                    </p>
                </div>
                <a
                    href="#local-letter"
                    className="inline-flex items-center gap-2 rounded-md bg-[#1a2826] px-5 py-3 text-sm text-white"
                >
                    Get the local list <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

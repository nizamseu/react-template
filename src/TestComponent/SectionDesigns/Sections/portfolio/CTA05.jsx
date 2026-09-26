import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#d5c8b7] bg-white p-7 text-[#241d1a] sm:p-9">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ef6a4b]">
                        A LOW-VOLUME STUDIO LETTER
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">
                        Things I&apos;m making, when there&apos;s something to
                        share.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Occasional notes, no noise.
                    </p>
                </div>
                <a
                    href="#letter"
                    className="inline-flex items-center gap-2 rounded-md bg-[#241d1a] px-5 py-3 text-sm text-white"
                >
                    Get the studio letter <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

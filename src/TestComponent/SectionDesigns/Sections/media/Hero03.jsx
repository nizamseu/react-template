import { HiArrowRight } from 'react-icons/hi'
export default function Hero03() {
    return (
        <section className="rounded-lg bg-[#e7d9c7] p-7 text-[#28221e] sm:p-12">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a84f34]">
                        MARGIN / FIELD NOTES
                    </p>
                    <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[.94] sm:text-7xl">
                        Take the long way around.
                    </h2>
                </div>
                <div className="max-w-sm">
                    <p className="text-sm leading-6">
                        Dispatches from people following a question further than
                        expected.
                    </p>
                    <a
                        href="#dispatches"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#a84f34] pb-2 text-sm font-semibold"
                    >
                        Read the dispatches <HiArrowRight />
                    </a>
                </div>
            </div>
            <div className="mt-9 border-t border-[#c4ae98] pt-4 text-xs">
                PEOPLE / PLACES / SMALL OBSERVATIONS
            </div>
        </section>
    )
}

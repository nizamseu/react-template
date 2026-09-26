import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#d7e0da] bg-white p-7 text-[#132d3a] sm:p-9">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#346a62]">
                        THE ELSEWHERE LETTER
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">
                        A few good places for your next long weekend.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Local favorites, once a month.
                    </p>
                </div>
                <a
                    href="#letter"
                    className="inline-flex items-center gap-2 rounded-md bg-[#132d3a] px-5 py-3 text-sm text-white"
                >
                    Get the field notes <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

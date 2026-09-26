import { HiArrowRight } from 'react-icons/hi'
export default function Hero05() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f0e6d8] text-[#132d3a] sm:grid-cols-[.85fr_1.15fr]">
            <div className="p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#b65f47]">
                    HOSTED BY THE LOCALS
                </p>
                <h2 className="mt-4 font-serif text-5xl leading-[.96]">
                    Come for the view. Stay for the stories.
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                    Book small-group experiences led by people who know the
                    place by heart.
                </p>
                <a
                    href="#experiences"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#132d3a] px-5 py-3 text-sm text-white"
                >
                    Meet your local host <HiArrowRight />
                </a>
            </div>
            <img
                className="h-64 w-full object-cover sm:h-full"
                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1000&q=85"
                alt="Travelers exploring a local street with a guide"
            />
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'
export default function Hero04() {
    return (
        <section className="relative isolate flex min-h-[410px] items-end overflow-hidden rounded-lg bg-[#132d3a] text-white">
            <img
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=85"
                alt="Sunlit Mediterranean coastline"
            />
            <div className="max-w-3xl p-7 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-white/75">
                    THE SLOW COAST / SUMMER GUIDE
                </p>
                <h2 className="mt-4 font-serif text-5xl leading-[.94] sm:text-7xl">
                    Go where the day takes its time.
                </h2>
                <a
                    href="#guide"
                    className="mt-6 inline-flex items-center gap-2 border-b border-white pb-2 text-sm"
                >
                    Explore the coast <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

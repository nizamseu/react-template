import { HiArrowRight } from 'react-icons/hi'
export default function Hero01() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#f1eee6] text-[#1f201c]">
            <div className="border-b border-[#c8c2b5] px-6 py-3 text-center text-[10px] font-bold uppercase tracking-[.2em]">
                Volume 08 · The attention issue · Autumn 2026
            </div>
            <div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[1.15fr_.85fr]">
                <div className="flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#a8472b]">
                            The Sunday edition
                        </p>
                        <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[.94] sm:text-7xl">
                            The art of paying attention.
                        </h2>
                    </div>
                    <div className="mt-8 flex items-end justify-between gap-4">
                        <p className="max-w-xs text-sm leading-6 text-[#626159]">
                            A field guide to noticing more, scrolling less, and
                            making room for wonder.
                        </p>
                        <a
                            href="#story"
                            aria-label="Read the feature"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#a8472b] text-white"
                        >
                            <HiArrowRight />
                        </a>
                    </div>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85"
                        alt="Warm morning light across a quiet landscape"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#f1eee6] px-3 py-2 text-[10px] uppercase">
                        Long read · 12 min
                    </span>
                </div>
            </div>
        </section>
    )
}

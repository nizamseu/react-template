import { HiArrowRight, HiCalendar } from 'react-icons/hi'
export default function Hero03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#132d3a] text-white md:grid-cols-[.8fr_1.2fr]">
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#f0aa8d]">
                    PLAN LESS / FEEL MORE
                </p>
                <h2 className="my-10 font-serif text-5xl leading-[.95]">
                    Find the place.
                    <br />
                    Leave the rest.
                </h2>
                <p className="max-w-sm text-sm text-white/65">
                    Small stays, open calendars, and local people who make a
                    place feel real.
                </p>
                <a
                    href="#stays"
                    className="mt-6 inline-flex items-center gap-2 text-sm"
                >
                    See the stays <HiArrowRight />
                </a>
            </div>
            <div className="relative min-h-64">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1000&q=85"
                    alt="Cozy cabin tucked among trees"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-4 py-3 text-xs text-[#132d3a]">
                    <HiCalendar /> Dates open through November
                </div>
            </div>
        </section>
    )
}

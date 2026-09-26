import { HiArrowRight, HiCalendar } from 'react-icons/hi'
export default function Hero01() {
    return (
        <section className="relative isolate overflow-hidden rounded-lg bg-[#132d3a] text-white">
            <img
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
                src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1500&q=85"
                alt="Colorful seaside village on a sunny day"
            />
            <div className="flex min-h-[430px] flex-col justify-between p-7 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[.17em]">
                    STAY A LITTLE LONGER
                </p>
                <div>
                    <h2 className="max-w-2xl font-serif text-5xl leading-[.95] sm:text-7xl">
                        A place that changes the pace.
                    </h2>
                    <p className="mt-4 max-w-md text-sm text-white/80">
                        Small stays and local experiences, found by people who
                        know the place.
                    </p>
                    <div className="mt-7 flex max-w-xl flex-col gap-2 rounded-lg bg-white p-2 text-[#182833] sm:flex-row">
                        <input
                            aria-label="Destination"
                            placeholder="Where to?"
                            className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                        />
                        <button className="flex items-center justify-center gap-2 border-l border-gray-200 px-4 text-sm">
                            <HiCalendar /> Add dates
                        </button>
                        <a
                            href="#search"
                            className="flex items-center justify-center gap-2 rounded-md bg-[#e07d5b] px-5 py-3 text-sm font-semibold text-white"
                        >
                            Find a stay <HiArrowRight />
                        </a>
                    </div>
                </div>
                <p className="text-xs text-white/70">
                    Thoughtful stays · Honest pricing · Local hosts
                </p>
            </div>
        </section>
    )
}

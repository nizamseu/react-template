import { HiArrowRight } from 'react-icons/hi'
export default function Hero01() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#121c2c] text-white">
            <div className="grid min-h-[420px] md:grid-cols-[1fr_1fr]">
                <div className="flex flex-col justify-between p-7 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#84b9ff]">
                        NORTHSTAR / ADVISORY
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-lg text-5xl font-semibold leading-[.98] sm:text-6xl">
                            Complex change. Clear direction.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
                            We help ambitious teams turn their next challenge
                            into lasting progress.
                        </p>
                        <a
                            href="#work"
                            className="mt-6 inline-flex items-center gap-3 rounded-md bg-[#84b9ff] px-5 py-3 text-sm font-semibold text-[#121c2c]"
                        >
                            Explore our work <HiArrowRight />
                        </a>
                    </div>
                    <p className="text-xs text-white/40">
                        Strategy · People · Transformation
                    </p>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85"
                        alt="Modern city architecture seen from below"
                    />
                    <span className="absolute bottom-5 right-5 bg-[#121c2c] px-4 py-3 text-xs">
                        Independent thinking since 2008
                    </span>
                </div>
            </div>
        </section>
    )
}

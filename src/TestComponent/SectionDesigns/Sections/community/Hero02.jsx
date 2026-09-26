import { HiArrowRight } from 'react-icons/hi'
export default function Hero02() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f7ede6] text-[#27201d] md:grid-cols-[.8fr_1.2fr]">
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a34c38]">
                    COMMONROOM / FIND YOUR PEOPLE
                </p>
                <h2 className="my-10 text-5xl font-black leading-[.93] sm:text-6xl">
                    Interest is a good place to meet.
                </h2>
                <a
                    href="#groups"
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                >
                    Explore the rooms <HiArrowRight />
                </a>
                <p className="mt-6 text-xs text-gray-500">
                    Good conversations start with a shared thing.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 sm:p-6">
                {[
                    ['Book club', '#ffccad'],
                    ['Gardeners', '#d5e6bb'],
                    ['Indie games', '#c6d9f0'],
                    ['Sunday cooks', '#efbb90'],
                ].map(([name, color]) => (
                    <div
                        key={name}
                        className="flex min-h-32 items-end rounded-lg p-4 text-sm font-bold"
                        style={{ backgroundColor: color }}
                    >
                        {name}
                    </div>
                ))}
            </div>
        </section>
    )
}

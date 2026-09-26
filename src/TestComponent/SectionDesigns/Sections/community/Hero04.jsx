import { HiArrowRight } from 'react-icons/hi'
export default function Hero04() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#f7ede6] text-[#27201d]">
            <div className="grid md:grid-cols-[1fr_1fr]">
                <div className="p-7 sm:p-11">
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a34c38]">
                        COMMUNITY / IN REAL LIFE
                    </p>
                    <h2 className="mt-4 font-serif text-5xl leading-[.95]">
                        The internet,
                        <br />
                        with a front porch.
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
                        Find welcoming local meetups around the interests you
                        already love.
                    </p>
                    <a
                        href="#events"
                        className="mt-6 inline-flex items-center gap-2 border-b border-[#a34c38] pb-2 text-sm font-semibold"
                    >
                        See what&apos;s happening <HiArrowRight />
                    </a>
                </div>
                <img
                    className="h-64 w-full object-cover md:h-full"
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=85"
                    alt="Friends gathering together outside"
                />
            </div>
        </section>
    )
}

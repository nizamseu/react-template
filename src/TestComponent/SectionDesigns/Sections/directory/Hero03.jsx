import { HiArrowRight } from 'react-icons/hi'
export default function Hero03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#d9f064] text-[#1a2826] md:grid-cols-[1fr_.85fr]">
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em]">
                    A LOCAL INDEX FOR EVERYDAY NEEDS
                </p>
                <h2 className="my-9 text-5xl font-black leading-[.92] sm:text-6xl">
                    Find your kind of local.
                </h2>
                <div className="flex flex-wrap gap-2">
                    {['Home', 'Food', 'Care', 'Creative'].map((tag) => (
                        <a
                            key={tag}
                            href="#category"
                            className="rounded-full border border-[#9bae4b] px-4 py-2 text-xs"
                        >
                            {tag}
                        </a>
                    ))}
                </div>
                <a
                    href="#browse"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold"
                >
                    Browse all categories <HiArrowRight />
                </a>
            </div>
            <img
                className="h-64 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85"
                alt="A lively neighborhood with independent shops"
            />
        </section>
    )
}

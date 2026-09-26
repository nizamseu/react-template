import { HiArrowRight } from 'react-icons/hi'
export default function Hero01() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#102d36] text-white md:grid-cols-[1fr_1.05fr]">
            <div className="flex flex-col justify-between p-7 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#c8ef70]">
                    FIELDNOTE / LEARNING STUDIO
                </p>
                <div className="my-10">
                    <h2 className="max-w-lg font-serif text-5xl leading-[.98] sm:text-6xl">
                        Learn the thing you came here for.
                    </h2>
                    <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
                        Short lessons, real projects, and a clear next step
                        every time you log in.
                    </p>
                    <a
                        href="#courses"
                        className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#c8ef70] px-5 py-3 text-sm font-bold text-[#102d36]"
                    >
                        Find your path <HiArrowRight />
                    </a>
                </div>
                <p className="text-xs text-white/45">
                    A good skill changes your next chapter.
                </p>
            </div>
            <div className="relative min-h-72 bg-[#d9d7c9]">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85"
                    alt="Learners collaborating around a table"
                />
                <div className="absolute bottom-5 left-5 bg-white p-4 text-[#102d36]">
                    <p className="text-[10px] font-bold uppercase">
                        Your learning streak
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                        4 days <span className="text-[#3c7e5d]">↗</span>
                    </p>
                </div>
            </div>
        </section>
    )
}

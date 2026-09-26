import { HiArrowRight } from 'react-icons/hi'
export default function Hero01() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#ef6a4b] text-[#241d1a]">
            <div className="grid min-h-[430px] md:grid-cols-[1.1fr_.9fr]">
                <div className="flex flex-col justify-between p-7 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[.16em]">
                        JAMIE PARK / INDEPENDENT DESIGNER
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-xl text-6xl font-black uppercase leading-[.84] sm:text-8xl">
                            Make it
                            <br />
                            matter.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm">
                            Digital products and identities for people building
                            a better everyday.
                        </p>
                    </div>
                    <a
                        href="#selected-work"
                        className="flex items-center gap-2 text-xs font-bold uppercase"
                    >
                        Selected work <HiArrowRight />
                    </a>
                </div>
                <div className="relative min-h-64 bg-[#e5cfc0]">
                    <img
                        className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
                        src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85"
                        alt="Graphic design experiments and printed color studies"
                    />
                    <span className="absolute bottom-5 right-5 bg-[#241d1a] px-3 py-2 text-xs text-white">
                        Scroll to explore ↓
                    </span>
                </div>
            </div>
        </section>
    )
}

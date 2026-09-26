import { HiArrowRight } from 'react-icons/hi'
export default function Hero05() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f1e9de] text-[#241d1a] md:grid-cols-[1.1fr_.9fr]">
            <div className="p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#ef6a4b]">
                    CURRENTLY / AVAILABLE FOR A FEW GOOD PROJECTS
                </p>
                <h2 className="mt-5 text-5xl font-black leading-[.9]">
                    Let&apos;s make the useful thing, beautifully.
                </h2>
                <p className="mt-4 max-w-sm text-sm text-gray-600">
                    Brand systems, digital products, and collaborative
                    experiments.
                </p>
                <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#241d1a] px-5 py-3 text-sm text-white"
                >
                    Get in touch <HiArrowRight />
                </a>
            </div>
            <div className="relative min-h-64 bg-[#e8b6a7]">
                <img
                    className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
                    src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85"
                    alt="Color and type explorations pinned up in a studio"
                />
            </div>
        </section>
    )
}

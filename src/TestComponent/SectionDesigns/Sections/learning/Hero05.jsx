import { HiArrowRight, HiPlay } from 'react-icons/hi'
export default function Hero05() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#dce8df] text-[#102d36] md:grid-cols-[1fr_1fr]">
            <div className="p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3c7e5d]">
                    THE STUDIO CLASS
                </p>
                <h2 className="mt-4 font-serif text-5xl leading-[.96]">
                    Turn a good idea into something real.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6">
                    Follow a mentor through the messy, rewarding middle of the
                    work.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <a
                        href="#class"
                        className="inline-flex items-center gap-2 rounded-full bg-[#102d36] px-5 py-3 text-sm text-white"
                    >
                        Explore classes <HiArrowRight />
                    </a>
                    <a
                        href="#preview"
                        className="inline-flex items-center gap-2 px-3 text-sm"
                    >
                        <HiPlay /> Preview a lesson
                    </a>
                </div>
            </div>
            <img
                className="h-64 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1000&q=85"
                alt="Instructor guiding a hands-on class"
            />
        </section>
    )
}

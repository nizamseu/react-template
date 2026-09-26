import { HiArrowRight } from 'react-icons/hi'
export default function Hero02() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#28221e] text-[#f3eee5] md:grid-cols-[1fr_.8fr]">
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs uppercase tracking-[.18em] text-[#e7a37c]">
                    ISSUE 018 / THE CREATIVE LIFE
                </p>
                <h2 className="my-10 font-serif text-5xl leading-[.94] sm:text-7xl">
                    What we make
                    <br />
                    when no one asks.
                </h2>
                <div className="flex items-center justify-between border-t border-white/20 pt-4 text-xs">
                    <span>Essay by Nina Cole / 9 min read</span>
                    <a href="#read" aria-label="Read this essay">
                        <HiArrowRight className="text-xl" />
                    </a>
                </div>
            </div>
            <img
                className="h-64 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85"
                alt="Writer working in a notebook"
            />
        </section>
    )
}

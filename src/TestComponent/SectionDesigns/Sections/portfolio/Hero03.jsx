import { HiArrowRight } from 'react-icons/hi'
export default function Hero03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#ef6a4b] text-[#241d1a] md:grid-cols-[1fr_1fr]">
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em]">
                    JAMIE PARK / DESIGNER
                </p>
                <h2 className="my-10 font-serif text-5xl leading-[.94] sm:text-6xl">
                    Useful things
                    <br />
                    with feeling.
                </h2>
                <p className="max-w-sm text-sm">
                    Product, identity, and experiments for teams with good
                    questions.
                </p>
                <a
                    href="#about"
                    className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold"
                >
                    A little about me <HiArrowRight />
                </a>
            </div>
            <img
                className="h-64 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85"
                alt="Independent creative studio workspace"
            />
        </section>
    )
}

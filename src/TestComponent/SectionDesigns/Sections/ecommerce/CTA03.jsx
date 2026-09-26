import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f3eee6] text-[#1c1b19] sm:grid-cols-[1fr_1fr]">
            <div className="p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8a6144]">
                    SELL WITH GOODFORM
                </p>
                <h2 className="mt-3 font-serif text-3xl">
                    Your work deserves a thoughtful shop window.
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                    Meet customers who care about who made the thing.
                </p>
                <a
                    href="#makers"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                >
                    Become a maker <HiArrowRight />
                </a>
            </div>
            <img
                className="h-52 w-full object-cover sm:h-full"
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85"
                alt="Maker's workspace with handmade objects"
            />
        </section>
    )
}

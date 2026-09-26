import { HiArrowRight } from 'react-icons/hi'
export default function Card04() {
    return (
        <article className="grid overflow-hidden rounded-lg bg-[#1d2118] text-white sm:grid-cols-[.8fr_1.2fr]">
            <div className="flex flex-col justify-between p-6">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#d6f36a]">
                    Meet the maker
                </p>
                <div className="my-8">
                    <h3 className="font-serif text-3xl">
                        Good things, made slowly.
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                        Inez builds everyday objects by hand in her sunlit
                        Rotterdam studio.
                    </p>
                </div>
                <a
                    href="#inez"
                    className="inline-flex items-center gap-2 text-sm"
                >
                    Visit Inez online <HiArrowRight />
                </a>
            </div>
            <img
                className="h-56 w-full object-cover sm:h-full"
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=85"
                alt="Independent maker at work in a ceramics studio"
            />
        </article>
    )
}

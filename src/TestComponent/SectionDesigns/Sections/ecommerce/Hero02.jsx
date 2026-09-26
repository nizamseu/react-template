import { HiArrowRight } from 'react-icons/hi'
export default function Hero02() {
    return (
        <section className="relative isolate min-h-[440px] overflow-hidden rounded-lg bg-[#211d18] text-white">
            <img
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1500&q=85"
                alt="Friends exploring a clothing collection"
            />
            <div className="flex min-h-[440px] flex-col justify-end p-7 sm:p-12">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6f36a]">
                    Good finds, no rush
                </span>
                <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[.95] sm:text-7xl">
                    A different kind
                    <br />
                    of department store.
                </h2>
                <a
                    href="#departments"
                    className="mt-7 inline-flex items-center gap-3 self-start border-b border-white pb-2 text-sm"
                >
                    Browse the edit <HiArrowRight />
                </a>
            </div>
            <span className="absolute right-8 top-8 hidden text-xs sm:block">
                Curated in Copenhagen / 2026
            </span>
        </section>
    )
}

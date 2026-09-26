import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
export default function Hero02() {
    return (
        <section className="rounded-lg bg-[#1a2826] p-7 text-white sm:p-11">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#d9f064]">
                THE NEIGHBORHOOD INDEX
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[.94] sm:text-7xl">
                Good people for the work ahead.
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/60">
                Find a local expert. Compare the useful details. Choose with
                confidence.
            </p>
            <form
                className="mt-7 flex max-w-2xl items-center gap-3 rounded-lg bg-white p-2 text-[#1a2826]"
                onSubmit={(e) => e.preventDefault()}
            >
                <HiOutlineSearch className="ml-2 shrink-0 text-[#527354]" />
                <input
                    aria-label="Search the directory"
                    placeholder="Try 'bike repair' or 'tax advisor'"
                    className="min-w-0 flex-1 py-2 text-sm outline-none"
                />
                <a
                    href="#search"
                    className="flex items-center gap-2 rounded-md bg-[#d9f064] px-4 py-3 text-xs font-bold"
                >
                    Search <HiArrowRight />
                </a>
            </form>
            <p className="mt-5 text-xs text-white/40">
                Independent · Verified · Nearby
            </p>
        </section>
    )
}

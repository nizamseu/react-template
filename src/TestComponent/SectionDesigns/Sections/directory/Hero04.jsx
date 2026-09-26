import { HiArrowRight } from 'react-icons/hi'
export default function Hero04() {
    return (
        <section className="relative isolate min-h-[390px] overflow-hidden rounded-lg bg-[#d9f064] p-7 text-[#1a2826] sm:p-11">
            <div className="absolute right-0 top-0 -z-10 h-full w-[42%] bg-[#1a2826]" />
            <p className="text-xs font-bold uppercase tracking-[.15em]">
                GOOD NEIGHBOR / CITY GUIDE
            </p>
            <h2 className="mt-5 max-w-2xl text-5xl font-black leading-[.92] sm:text-7xl">
                A shortcut to people who care about their work.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-sm text-sm">
                    Trusted recommendations from the neighborhoods you call
                    home.
                </p>
                <a
                    href="#nearby"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1a2826] px-5 py-3 text-sm text-white"
                >
                    See who&apos;s nearby <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

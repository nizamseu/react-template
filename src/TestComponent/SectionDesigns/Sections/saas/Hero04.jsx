import { HiArrowRight } from 'react-icons/hi'
export default function Hero04() {
    return (
        <section className="relative isolate overflow-hidden rounded-lg bg-[#111a22] p-8 text-white sm:p-12">
            <div className="absolute -right-16 -top-20 -z-10 h-80 w-80 rounded-full border border-[#65e6b4]/30" />
            <div className="absolute -right-4 -top-8 -z-10 h-56 w-56 rounded-full border border-[#65e6b4]/20" />
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#65e6b4]">
                BUILT FOR THE WHOLE JOURNEY
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[.95] sm:text-7xl">
                From first signal
                <br />
                to shipped work.
            </h2>
            <div className="mt-7 flex flex-wrap items-center gap-5">
                <a
                    href="#platform"
                    className="inline-flex items-center gap-2 rounded-md bg-[#65e6b4] px-5 py-3 text-sm font-bold text-[#111a22]"
                >
                    Explore the platform <HiArrowRight />
                </a>
                <span className="text-xs text-white/50">
                    One workspace / Every team
                </span>
            </div>
        </section>
    )
}

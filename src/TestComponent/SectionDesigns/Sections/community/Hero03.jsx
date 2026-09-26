import { HiArrowRight } from 'react-icons/hi'
export default function Hero03() {
    return (
        <section className="relative isolate overflow-hidden rounded-lg bg-[#27201d] p-7 text-white sm:p-12">
            <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-[#a34c38]" />
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#ffccad]">
                A SMALLER, KINDER INTERNET
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[.92] sm:text-7xl">
                Find a corner
                <br />
                that feels like yours.
            </h2>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
                <p className="max-w-sm text-sm leading-6 text-white/65">
                    Join groups where people show up curious, generous, and
                    ready to listen.
                </p>
                <a
                    href="#join"
                    className="inline-flex items-center gap-2 rounded-full bg-[#ffccad] px-5 py-3 text-sm font-semibold text-[#27201d]"
                >
                    Come on in <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

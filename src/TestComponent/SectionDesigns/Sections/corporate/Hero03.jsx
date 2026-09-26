import { HiArrowRight } from 'react-icons/hi'
export default function Hero03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#121c2c] text-white md:grid-cols-[1fr_.82fr]">
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#84b9ff]">
                    A PARTNER IN WHAT&apos;S NEXT
                </p>
                <h2 className="my-10 max-w-lg text-5xl font-semibold leading-[.96]">
                    Turn ambition into measurable change.
                </h2>
                <a
                    href="#conversation"
                    className="inline-flex items-center gap-2 self-start rounded-md bg-[#84b9ff] px-5 py-3 text-sm font-semibold text-[#121c2c]"
                >
                    Start a conversation <HiArrowRight />
                </a>
                <p className="mt-8 text-xs text-white/40">
                    People first / Evidence led / Built to last
                </p>
            </div>
            <div className="m-5 flex flex-col justify-between rounded-lg border border-white/15 p-5">
                <p className="text-xs text-white/45">A DECADE OF PARTNERSHIP</p>
                <p className="my-8 text-7xl font-semibold text-[#84b9ff]">
                    94<span className="text-4xl">%</span>
                </p>
                <p className="border-t border-white/15 pt-4 text-sm text-white/70">
                    of clients return for the next challenge.
                </p>
            </div>
        </section>
    )
}

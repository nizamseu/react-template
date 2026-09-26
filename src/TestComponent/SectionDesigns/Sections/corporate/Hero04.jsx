import { HiArrowRight } from 'react-icons/hi'
export default function Hero04() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#e9edf1] text-[#182434] md:grid-cols-[.78fr_1.22fr]">
            <div className="flex flex-col justify-between p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#3476c5]">
                    BUILT AROUND YOUR BUSINESS
                </p>
                <h2 className="my-10 text-5xl font-semibold leading-[.96]">
                    Better questions. Better outcomes.
                </h2>
                <a
                    href="#approach"
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                >
                    Our approach <HiArrowRight />
                </a>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 sm:p-6">
                <div className="flex min-h-36 items-end rounded-lg bg-[#3476c5] p-4 text-sm text-white">
                    Strategy that meets reality
                </div>
                <div className="mt-8 flex min-h-36 items-end rounded-lg bg-[#c4d9ee] p-4 text-sm sm:mt-12">
                    Change people can own
                </div>
                <div className="flex min-h-36 items-end rounded-lg bg-[#c9d1d8] p-4 text-sm">
                    Progress you can measure
                </div>
                <div className="mt-8 flex min-h-36 items-end rounded-lg bg-[#d5e6f4] p-4 text-sm sm:mt-12">
                    Partnership that lasts
                </div>
            </div>
        </section>
    )
}

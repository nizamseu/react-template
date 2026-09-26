import { HiArrowRight } from 'react-icons/hi'
export default function Hero02() {
    return (
        <section className="rounded-lg bg-[#dce9f6] p-7 text-[#121c2c] sm:p-11">
            <div className="grid gap-8 md:grid-cols-[1fr_.65fr] md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#3476c5]">
                        INDEPENDENT THINKING / SHARED PROGRESS
                    </p>
                    <h2 className="mt-4 max-w-3xl text-5xl font-semibold leading-[.95] sm:text-7xl">
                        The next move belongs to you.
                    </h2>
                </div>
                <div>
                    <p className="text-sm leading-6 text-gray-600">
                        We bring the perspective and practical expertise to help
                        your team move with confidence.
                    </p>
                    <a
                        href="#expertise"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#3476c5] pb-2 text-sm font-semibold"
                    >
                        Where we help <HiArrowRight />
                    </a>
                </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#b9cee1] pt-4 text-xs">
                STRATEGY <span>TRANSFORMATION</span>
                <span>ORGANIZATION</span>
                <span>GROWTH</span>
            </div>
        </section>
    )
}

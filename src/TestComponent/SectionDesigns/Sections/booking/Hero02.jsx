import { HiArrowRight } from 'react-icons/hi'
export default function Hero02() {
    return (
        <section className="rounded-lg bg-[#e5ede8] p-7 text-[#132d3a] sm:p-11">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#346a62]">
                A WEEKEND, WELL SPENT
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_.7fr] md:items-end">
                <h2 className="font-serif text-5xl leading-[.95] sm:text-7xl">
                    Leave the itinerary open.
                </h2>
                <div>
                    <p className="text-sm leading-6 text-gray-600">
                        Find a place that gives the day room to surprise you.
                    </p>
                    <a
                        href="#places"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#346a62] pb-2 text-sm font-semibold"
                    >
                        Find your somewhere <HiArrowRight />
                    </a>
                </div>
            </div>
            <div className="mt-10 border-t border-[#bdcfc5] pt-4 text-xs">
                LOCAL HOSTS <span className="mx-3">/</span> FLEXIBLE DATES{' '}
                <span className="mx-3">/</span> PLACES WITH CHARACTER
            </div>
        </section>
    )
}

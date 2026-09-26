import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#cbd5df] bg-white p-7 text-[#182434] sm:p-9">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3476c5]">
                        THE NORTHSTAR BRIEFING
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold">
                        Ideas for leaders navigating change.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Occasional notes on strategy, organization, and lasting
                        growth.
                    </p>
                </div>
                <a
                    href="#briefing"
                    className="inline-flex items-center gap-2 rounded-md bg-[#121c2c] px-5 py-3 text-sm text-white"
                >
                    Get the briefing <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

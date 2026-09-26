import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f0e6d8] text-[#132d3a] sm:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#b65f47]">
                    FLEXIBLE PLANS / CLEAR PRICES
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                    Find a stay you can book with confidence.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    See cancellation terms and the real total before checkout.
                </p>
            </div>
            <div className="flex items-center p-7 pt-0 sm:p-8">
                <a
                    href="#flexible"
                    className="inline-flex items-center gap-2 rounded-md bg-[#132d3a] px-5 py-3 text-sm text-white"
                >
                    Browse flexible stays <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

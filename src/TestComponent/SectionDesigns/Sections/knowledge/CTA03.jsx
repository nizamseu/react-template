import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f6f7f4] text-[#17231f] sm:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#41715d]">
                    SHARE WHAT YOUR TEAM KNOWS
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                    Give your best answers a home.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Build a knowledge base people can actually find their way
                    around.
                </p>
            </div>
            <div className="flex items-center p-7 pt-0 sm:p-8">
                <a
                    href="#team-docs"
                    className="inline-flex items-center gap-2 rounded-md bg-[#17231f] px-5 py-3 text-sm text-white"
                >
                    Explore team docs <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

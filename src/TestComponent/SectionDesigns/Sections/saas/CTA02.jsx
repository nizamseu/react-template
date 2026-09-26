import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="rounded-lg bg-[#111a22] p-8 text-white sm:p-11">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#65e6b4]">
                        SEE YOUR WORKFLOW IN NORTHSTAR
                    </p>
                    <h2 className="mt-2 max-w-xl text-3xl font-semibold">
                        Bring your real process. We&apos;ll bring a useful demo.
                    </h2>
                </div>
                <a
                    href="#demo"
                    className="inline-flex items-center gap-2 self-start rounded-md bg-[#65e6b4] px-5 py-3 text-sm font-bold text-[#111a22]"
                >
                    Book a product tour <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

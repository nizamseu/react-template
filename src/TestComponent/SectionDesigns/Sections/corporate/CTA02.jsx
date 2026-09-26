import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="rounded-lg bg-[#121c2c] p-8 text-white sm:p-11">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#84b9ff]">
                        FOR LEADERS SHAPING WHAT&apos;S NEXT
                    </p>
                    <h2 className="mt-2 max-w-xl text-3xl font-semibold">
                        Get perspective that makes the next decision clearer.
                    </h2>
                </div>
                <a
                    href="#insights"
                    className="inline-flex items-center gap-2 self-start rounded-md border border-[#84b9ff] px-5 py-3 text-sm"
                >
                    Read the latest insights <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

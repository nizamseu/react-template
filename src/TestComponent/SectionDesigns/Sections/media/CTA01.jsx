import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#e7d9c7] p-7 text-[#28221e] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a84f34]">
                    THE SUNDAY EDITION
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                    One letter. A few stories worth keeping.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Our editors&apos; best reads, once a week.
                </p>
            </div>
            <a
                href="#subscribe"
                className="inline-flex items-center gap-2 self-start border-b border-[#a84f34] pb-2 text-sm font-semibold"
            >
                Subscribe to Margin <HiArrowRight />
            </a>
        </section>
    )
}

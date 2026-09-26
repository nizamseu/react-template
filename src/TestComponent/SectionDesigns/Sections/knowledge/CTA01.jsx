import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#e8f0eb] p-7 text-[#17231f] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#41715d]">
                    KEEP BUILDING
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                    Find the answer and get back to the good part.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Search guides, docs, and practical examples.
                </p>
            </div>
            <a
                href="#help"
                className="inline-flex items-center gap-2 self-start rounded-md bg-[#41715d] px-5 py-3 text-sm text-white"
            >
                Open the help center <HiArrowRight />
            </a>
        </section>
    )
}

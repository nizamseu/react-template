import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#d9f064] p-7 text-[#1a2826] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em]">
                    GOOD WORK, FOUND
                </p>
                <h2 className="mt-2 text-3xl font-black">
                    Find the right local expert for the job.
                </h2>
                <p className="mt-2 text-sm">
                    Useful details help you choose with confidence.
                </p>
            </div>
            <a
                href="#search"
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#1a2826] px-5 py-3 text-sm text-white"
            >
                Search nearby <HiArrowRight />
            </a>
        </section>
    )
}

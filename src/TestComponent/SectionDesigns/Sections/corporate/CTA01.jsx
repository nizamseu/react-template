import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#dce9f6] p-7 text-[#121c2c] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3476c5]">
                    A CLEARER WAY FORWARD
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                    Bring us the question your team is working through.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    We&apos;ll help you find the practical first step.
                </p>
            </div>
            <a
                href="#contact"
                className="inline-flex items-center gap-2 self-start rounded-md bg-[#121c2c] px-5 py-3 text-sm text-white"
            >
                Start a conversation <HiArrowRight />
            </a>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#d7cec0] bg-white p-7 text-[#28221e] sm:p-9">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a84f34]">
                        LISTEN TO MARGIN
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">
                        Take the conversation with you.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        New voices and long-form ideas, wherever you listen.
                    </p>
                </div>
                <a
                    href="#podcast"
                    className="inline-flex items-center gap-2 rounded-full bg-[#28221e] px-5 py-3 text-sm text-white"
                >
                    Find the podcast <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

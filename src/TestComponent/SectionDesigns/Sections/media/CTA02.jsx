import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="rounded-lg bg-[#28221e] p-8 text-[#f3eee5] sm:p-11">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#e7a37c]">
                        KEEP GOOD JOURNALISM INDEPENDENT
                    </p>
                    <h2 className="mt-2 max-w-xl font-serif text-3xl">
                        Help us keep asking the questions that matter.
                    </h2>
                </div>
                <a
                    href="#membership"
                    className="inline-flex items-center gap-2 rounded-full bg-[#e7a37c] px-5 py-3 text-sm font-semibold text-[#28221e]"
                >
                    Become a member <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

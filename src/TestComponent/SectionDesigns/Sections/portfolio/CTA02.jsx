import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="rounded-lg bg-[#241d1a] p-8 text-[#f5eee5] sm:p-11">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ef6a4b]">
                        AVAILABLE FOR SELECT PROJECTS
                    </p>
                    <h2 className="mt-3 max-w-2xl font-serif text-4xl">
                        The best work starts with a good question.
                    </h2>
                </div>
                <a
                    href="#email"
                    className="inline-flex items-center gap-2 border-b border-[#ef6a4b] pb-2 text-sm"
                >
                    Tell me what you&apos;re making <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f1e9de] text-[#241d1a] md:grid-cols-[1fr_.75fr]">
            <div className="p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a84934]">
                    THE OPEN NOTEBOOK
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                    Process, experiments, and the occasional wrong turn.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    A working journal from the studio floor.
                </p>
            </div>
            <div className="flex items-center p-7 pt-0 md:p-8">
                <a
                    href="#journal"
                    className="inline-flex items-center gap-2 border-b border-[#ef6a4b] pb-2 text-sm font-semibold"
                >
                    Read the notes <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

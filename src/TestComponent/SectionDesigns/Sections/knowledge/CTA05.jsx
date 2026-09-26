import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#dce3dd] bg-white p-7 text-[#17231f] sm:p-9">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#41715d]">
                        NORTHSTAR / DOCS DIGEST
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold">
                        Small product notes. Better ways to work.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Occasional docs updates from the team that maintains
                        them.
                    </p>
                </div>
                <a
                    href="#docs-digest"
                    className="inline-flex items-center gap-2 rounded-md bg-[#41715d] px-5 py-3 text-sm text-white"
                >
                    Get the docs digest <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

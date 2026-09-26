import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#edf1e6] text-[#1a2826] sm:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#527354]">
                    A PLACE YOU TRUST?
                </p>
                <h2 className="mt-2 text-3xl font-black">
                    Help your neighbors find good people.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Your recommendation makes the local index more useful.
                </p>
            </div>
            <div className="flex items-center p-7 pt-0 sm:p-8">
                <a
                    href="#recommend"
                    className="inline-flex items-center gap-2 rounded-md bg-[#527354] px-5 py-3 text-sm text-white"
                >
                    Recommend a business <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

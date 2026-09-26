import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f3eee5] text-[#28221e] sm:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a84f34]">
                    HAVE A STORY IN MIND?
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                    We want to hear the part nobody&apos;s written yet.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Pitch a perspective, a person, or a place worth a closer
                    look.
                </p>
            </div>
            <div className="flex items-center p-7 pt-0 sm:p-8">
                <a
                    href="#pitch"
                    className="inline-flex items-center gap-2 rounded-md bg-[#a84f34] px-5 py-3 text-sm text-white"
                >
                    Pitch the editors <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#e3ebdd] text-[#102d36] sm:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3c7e5d]">
                    TEACH WHAT YOU KNOW
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                    Your experience could unlock someone else&apos;s next step.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Bring your craft to a studio class or mentor session.
                </p>
            </div>
            <div className="flex items-center p-7 pt-0 sm:p-8">
                <a
                    href="#teach"
                    className="inline-flex items-center gap-2 rounded-md bg-[#3c7e5d] px-5 py-3 text-sm text-white"
                >
                    Teach with us <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

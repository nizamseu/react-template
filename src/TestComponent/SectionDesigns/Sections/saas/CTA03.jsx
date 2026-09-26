import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#d9e5ff] text-[#111a22] md:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#375899]">
                    READY TO MOVE THE WORK FORWARD?
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                    Meet your team&apos;s next operating system.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Simple to start. Flexible as the work gets bigger.
                </p>
            </div>
            <div className="flex items-center p-7 pt-0 md:p-8">
                <a
                    href="#workspace"
                    className="inline-flex items-center gap-2 rounded-md bg-[#111a22] px-5 py-3 text-sm text-white"
                >
                    Build your workspace <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

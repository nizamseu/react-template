import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#65e6b4] p-7 text-[#111a22] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em]">
                    YOUR WORK, LESS SCATTERED
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                    Make the next week run smoother.
                </h2>
                <p className="mt-2 text-sm">
                    Bring the team into one clear workspace.
                </p>
            </div>
            <a
                href="#trial"
                className="inline-flex items-center gap-2 self-start rounded-md bg-[#111a22] px-5 py-3 text-sm text-white"
            >
                Start your free trial <HiArrowRight />
            </a>
        </section>
    )
}

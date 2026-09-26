import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#ef6a4b] p-7 text-[#241d1a] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em]">
                    HAVE A GOOD ONE IN MIND?
                </p>
                <h2 className="mt-2 text-3xl font-black">
                    Let&apos;s make something useful.
                </h2>
                <p className="mt-2 text-sm">
                    Thoughtful work for teams with something to say.
                </p>
            </div>
            <a
                href="#contact"
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#241d1a] px-5 py-3 text-sm text-white"
            >
                Start a conversation <HiArrowRight />
            </a>
        </section>
    )
}

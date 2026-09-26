import { HiArrowRight } from 'react-icons/hi'
export default function Hero04() {
    return (
        <section className="rounded-lg bg-[#241d1a] p-7 text-[#f5eee5] sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ef6a4b]">
                DESIGN IS A WAY OF ASKING
            </p>
            <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[.95] sm:text-7xl">
                What if the thing you need doesn&apos;t exist yet?
            </h2>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
                <p className="max-w-md text-sm leading-6 text-white/60">
                    I work with thoughtful teams to turn first questions into
                    useful, lasting experiences.
                </p>
                <a
                    href="#projects"
                    className="inline-flex items-center gap-2 border-b border-[#ef6a4b] pb-2 text-sm"
                >
                    See what we&apos;ve made <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

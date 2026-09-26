import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#41715d] px-6 py-10 text-center text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                START WITH WHAT YOU NEED
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
                The next useful answer is a search away.
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
                Jump into topics, guides, or quickstarts made for real work.
            </p>
            <a
                href="#docs"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#41715d]"
            >
                Browse the docs <HiArrowRight />
            </a>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#a84f34] px-6 py-10 text-center text-[#fff7ee] sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                THE MARGIN ARCHIVE
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                There&apos;s more to find between the covers.
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
                Explore essays, conversations, and field notes from every issue.
            </p>
            <a
                href="#archive"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f3eee5] px-5 py-3 text-sm font-semibold text-[#28221e]"
            >
                Explore the archive <HiArrowRight />
            </a>
        </section>
    )
}

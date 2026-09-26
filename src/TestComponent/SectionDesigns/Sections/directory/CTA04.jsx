import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#527354] px-6 py-10 text-center text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                A BETTER LOCAL SEARCH STARTS HERE
            </p>
            <h2 className="mt-3 text-3xl font-black">
                Find what&apos;s good around the corner.
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
                Browse independent shops and services recommended by neighbors.
            </p>
            <a
                href="#browse"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d9f064] px-5 py-3 text-sm font-bold text-[#1a2826]"
            >
                Browse the index <HiArrowRight />
            </a>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#3c7e5d] px-6 py-10 text-center text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                START WHERE YOU ARE
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                Your first lesson is waiting.
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
                No perfect plan required. Just curiosity and ten minutes.
            </p>
            <a
                href="#start"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#c8ef70] px-5 py-3 text-sm font-bold text-[#102d36]"
            >
                Try a free lesson <HiArrowRight />
            </a>
        </section>
    )
}

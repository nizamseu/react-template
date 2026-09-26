import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#ef6a4b] px-6 py-10 text-center text-[#241d1a] sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.14em]">
                LET&apos;S MAKE ROOM FOR A NEW IDEA
            </p>
            <h2 className="mt-3 text-3xl font-black">
                Have a project that needs a thoughtful eye?
            </h2>
            <a
                href="#hello"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#241d1a] px-5 py-3 text-sm text-white"
            >
                Say hello <HiArrowRight />
            </a>
        </section>
    )
}

import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#9a704b] px-6 py-10 text-center text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-white/70">
                A LITTLE GIFT GOES A LONG WAY
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                Make someone&apos;s ordinary day.
            </h2>
            <a
                href="#gifts"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#5b402b]"
            >
                Open the gift guide <HiArrowRight />
            </a>
        </section>
    )
}

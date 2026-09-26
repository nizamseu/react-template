import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#a34c38] px-6 py-10 text-center text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                A SMALLER, KINDER INTERNET
            </p>
            <h2 className="mt-3 text-3xl font-black">
                Come as you are. Bring what you&apos;re into.
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
                Your corner is waiting. Make a profile and say hello.
            </p>
            <a
                href="#join"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ffccad] px-5 py-3 text-sm font-bold text-[#27201d]"
            >
                Join Commonroom <HiArrowRight />
            </a>
        </section>
    )
}

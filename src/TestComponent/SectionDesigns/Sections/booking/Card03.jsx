import { HiArrowRight, HiClock } from 'react-icons/hi'
export default function Card03() {
    return (
        <article className="rounded-lg bg-[#132d3a] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-[#f0aa8d]">
                A LOCAL AFTERNOON / LISBON
            </p>
            <h3 className="mt-4 font-serif text-3xl">
                Learn to cook the thing your host grew up with.
            </h3>
            <div className="mt-5 flex justify-between border-t border-white/15 pt-4 text-xs text-white/60">
                <span className="flex items-center gap-2">
                    <HiClock />3 hours · 6 guests
                </span>
                <span>From $64</span>
            </div>
            <a
                href="#experience"
                className="mt-5 inline-flex items-center gap-2 text-sm"
            >
                See this experience <HiArrowRight />
            </a>
        </article>
    )
}

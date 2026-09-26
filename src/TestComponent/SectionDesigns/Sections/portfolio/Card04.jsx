import { HiArrowRight } from 'react-icons/hi'
export default function Card04() {
    return (
        <article className="rounded-lg border border-[#d5c8b7] bg-[#f1e9de] p-5 text-[#241d1a]">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a84934]">
                THE PROCESS / 01
            </p>
            <h3 className="mt-3 font-serif text-2xl">
                Start with the question under the brief.
            </h3>
            <p className="mt-2 text-sm text-gray-600">
                Good research makes the eventual answer feel obvious.
            </p>
            <a
                href="#process"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
            >
                How I work <HiArrowRight />
            </a>
        </article>
    )
}

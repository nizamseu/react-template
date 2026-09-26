import { HiArrowRight } from 'react-icons/hi'
export default function Card03() {
    return (
        <article className="rounded-lg bg-[#241d1a] p-6 text-[#f5eee5]">
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#ef6a4b]">
                PRODUCT DESIGN / CASE STUDY
            </p>
            <h3 className="mt-4 font-serif text-3xl">
                A calmer dashboard for a noisier world.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/60">
                How a growing team made their product feel smaller, clearer, and
                more human.
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs">
                <span>Research · Systems · Product</span>
                <a href="#case" aria-label="Read case study">
                    <HiArrowRight className="text-lg text-[#ef6a4b]" />
                </a>
            </div>
        </article>
    )
}

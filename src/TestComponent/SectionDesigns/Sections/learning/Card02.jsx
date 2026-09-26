import { HiArrowRight } from 'react-icons/hi'
export default function Card02() {
    return (
        <article className="rounded-lg bg-[#102d36] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[.13em] text-[#c8ef70]">
                LEARNING PATH / 6 WEEKS
            </p>
            <h3 className="mt-4 font-serif text-3xl">
                From first sketch to confident interface.
            </h3>
            <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-white/60">
                <span>6 courses · 3 projects</span>
                <HiArrowRight className="text-lg text-[#c8ef70]" />
            </div>
        </article>
    )
}

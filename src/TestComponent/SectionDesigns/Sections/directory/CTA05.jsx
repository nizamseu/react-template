import { HiArrowRight, HiOutlineHeart } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="rounded-2xl border border-[#527354]/40 bg-[#1b2b27] p-8 text-[#e3ece9] sm:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#d9f064]">
                        <HiOutlineHeart className="text-sm text-rose-400" /> HERITAGE CRAFT & VENUE SOLIDARITY FUND
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Protect Historic Brick-and-Mortar Spaces Against Commercial Displacement
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        Our solidarity fund awards emergency zero-interest micro-grants to 50+ year-old bookstores, print shops, and heritage tailors facing commercial rent hikes.
                    </p>
                </div>

                <a
                    href="#solidarity-fund"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9f064] px-6 py-3.5 font-mono text-xs font-bold text-[#d9f064] hover:bg-[#d9f064] hover:text-[#1b2b27] transition-colors shrink-0"
                >
                    <span>Donate to Heritage Fund</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

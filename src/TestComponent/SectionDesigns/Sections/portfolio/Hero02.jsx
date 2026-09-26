import { HiArrowRight } from 'react-icons/hi'
export default function Hero02() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#f1e9de] p-7 text-[#241d1a] sm:p-11">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#ef6a4b]">
                        INDEPENDENT DESIGN / 2026
                    </p>
                    <h2 className="mt-4 text-6xl font-black uppercase leading-[.82] sm:text-8xl">
                        Make
                        <br />
                        room.
                    </h2>
                </div>
                <div className="max-w-sm">
                    <p className="text-sm leading-6">
                        A small, independent practice for brands and digital
                        products with something to say.
                    </p>
                    <a
                        href="#work"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#ef6a4b] pb-2 text-sm font-semibold"
                    >
                        Selected work <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-10 border-t border-[#d5c8b7] pt-3 text-[10px] uppercase tracking-[.18em]">
                Brooklyn / Everywhere
            </p>
        </section>
    )
}

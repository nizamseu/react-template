import { HiArrowRight } from 'react-icons/hi'

export default function CTA04() {
    return (
        <section className="overflow-hidden rounded-none border-2 border-black bg-[#a84f34] p-8 text-white sm:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-black text-[#a84f34] px-2 py-0.5">
                        DIGITAL VAULT ACCESS &bull; 2004–2026
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                        Unlock 22 Years of Unfiltered Critical Cultural Archives
                    </h2>
                    <p className="mt-2 text-sm text-white/80 max-w-xl">
                        Over 4,200 longform investigations, historic audio tapes, and rare out-of-print monograph scans indexed in high-resolution searchable PDF.
                    </p>
                </div>

                <a
                    href="#unlock-vault"
                    className="inline-flex items-center justify-center gap-2 border-2 border-white bg-white px-6 py-3.5 font-serif text-xs font-bold text-[#a84f34] hover:bg-black hover:text-white transition-colors shrink-0"
                >
                    <span>Unlock Full Archive Pass</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

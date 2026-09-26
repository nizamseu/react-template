import { HiArrowRight } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="overflow-hidden rounded-none border-2 border-black bg-[#d6f36a] p-8 text-black shadow-[8px_8px_0px_0px_#000]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-black text-[#d6f36a] px-2 py-0.5">
                        CIRCULAR BUYBACK VOUCHER
                    </span>
                    <h2 className="mt-3 font-mono text-2xl sm:text-4xl font-black uppercase tracking-tight">
                        SEND US YOUR WORN GOODS. GET $50 STORE CREDIT.
                    </h2>
                    <p className="mt-2 font-mono text-xs text-black/80 max-w-xl">
                        Any authentic piece from past seasons cleaned and refurbished into our circular marketplace. Free shipping label provided immediately.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                    <div className="font-mono text-[9px] text-center border border-black p-2 bg-white">
                        <div className="tracking-widest">||| | |||| | ||| || |||</div>
                        <div className="font-bold">#RECYCLE-2026</div>
                    </div>
                    <a
                        href="#buyback"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 border-2 border-black bg-black px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#d6f36a] hover:bg-white hover:text-black transition-colors"
                    >
                        <span>Generate Label</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

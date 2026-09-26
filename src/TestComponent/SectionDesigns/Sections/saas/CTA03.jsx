import { HiArrowRight } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="rounded-xl border border-[#263640] bg-[#121c24] p-8 text-white sm:p-12 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                    <span className="font-mono text-xs text-[#65e6b4] uppercase tracking-wider font-bold">
                        TRANSPARENT EGRESS & COMPUTE ECONOMICS
                    </span>
                    <h2 className="mt-2 text-3xl font-black">
                        Slash 42% Off Your Hyperscaler Cloud Bill
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        Zero data egress fees between availability zones, predictable per-minute billing, and automated instance right-sizing save our customers an average of $142,000 annually.
                    </p>
                </div>

                <div className="rounded-xl bg-black/40 border border-white/10 p-5 font-mono text-xs space-y-3 shrink-0 sm:w-80">
                    <div className="flex justify-between text-white/60">
                        <span>AWS / GCP EGRESS:</span>
                        <span className="line-through text-rose-400">$0.09 / GB</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                        <span>NORTHSTAR MESH:</span>
                        <span className="text-[#65e6b4] font-bold">$0.00 / GB</span>
                    </div>
                    <a
                        href="#roi-calculator"
                        className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-[#17a878] py-2.5 font-bold text-white hover:bg-emerald-600 transition-colors"
                    >
                        <span>Calculate Team Savings</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

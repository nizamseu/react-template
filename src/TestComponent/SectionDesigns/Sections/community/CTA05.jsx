import { HiArrowRight, HiOutlineHeart } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="rounded-2xl border border-white/20 bg-[#1b1513] p-8 text-[#f7e6de] sm:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#ffccad]">
                        <HiOutlineHeart className="text-sm text-rose-400" /> CREATOR MUTUAL AID & TRAVEL GRANTS
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Powered Transparently via Open Collective
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        100% of community patronage goes toward conference flight bursaries, childcare stipends for workshop hosts, and open-source bounties. View our public ledger.
                    </p>
                </div>

                <a
                    href="#open-collective"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffccad] px-6 py-3.5 font-mono text-xs font-bold text-[#ffccad] hover:bg-[#ffccad] hover:text-[#1b1513] transition-colors shrink-0"
                >
                    <span>View Public Ledger on Open Collective</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

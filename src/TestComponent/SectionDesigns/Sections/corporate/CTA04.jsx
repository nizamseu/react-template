import { HiArrowRight, HiOutlineKey } from 'react-icons/hi'

export default function CTA04() {
    return (
        <section className="rounded-none border-b border-[#3476c5]/20 bg-[#0d1520] p-8 text-white sm:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#84b9ff]">
                        <HiOutlineKey /> INSTITUTIONAL LP PORTAL &bull; FUND VI DATA ROOM
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-black">
                        Access Confidential Fund Audits & Quarterly Performance Portfolios
                    </h2>
                    <p className="mt-2 font-mono text-xs text-white/60 max-w-xl">
                        Authenticated access for qualified institutional buyers (QIBs) and family office partners. Includes vintage-year IRR metrics, portfolio debt profiles, and capital call schedules.
                    </p>
                </div>

                <a
                    href="#lp-dataroom"
                    className="inline-flex items-center justify-center gap-2 rounded border border-[#84b9ff] px-6 py-3.5 font-mono text-xs font-bold text-[#84b9ff] hover:bg-[#84b9ff] hover:text-[#0d1520] transition-colors shrink-0"
                >
                    <span>Request LP Data Room Token</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

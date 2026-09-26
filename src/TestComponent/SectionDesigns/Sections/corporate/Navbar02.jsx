import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-b border-white/10 bg-[#0b111a] px-5 py-3.5 text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left with Stock Ticker */}
                <div className="flex items-center gap-4 shrink-0">
                    <a href="#home" className="font-mono text-xs font-bold tracking-[.18em] text-[#84b9ff]">
                        NORTHSTAR / IR
                    </a>
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
                        NYSE: NST $148.60 ▲ +3.2%
                    </span>
                </div>

                {/* Right-Flush Navigation & Annual Report Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-mono text-white/70 md:flex">
                        <MegaMenu
                            category="corporate"
                            accent="#84b9ff"
                            variant={2}
                            label="Investor Relations"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#84b9ff] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#earnings" className="hover:text-white transition-colors">
                            Q3 Earnings
                        </a>
                        <a href="#governance" className="hover:text-white transition-colors">
                            Board & ESG
                        </a>
                        <a href="#filings" className="hover:text-white transition-colors">
                            SEC Filings
                        </a>
                    </nav>

                    <a
                        href="#annual-report"
                        className="inline-flex items-center gap-1.5 rounded border border-[#84b9ff]/40 px-3.5 py-1.5 font-mono text-xs text-[#84b9ff] hover:bg-[#84b9ff] hover:text-[#0b111a] transition-colors shrink-0"
                    >
                        <span>2026 Annual Report</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y border-[#3476c5]/20 bg-[#0e1724] text-white shadow-xl">
            {/* Top Micro-Ticker */}
            <div className="border-b border-white/10 px-5 py-1.5 font-mono text-[10px] text-[#84b9ff] flex items-center justify-between sm:px-8">
                <span>GLOBAL ENTERPRISE COUNSEL &bull; $18.4B ASSETS ADVISED WORLDWIDE</span>
                <span className="hidden sm:inline">NEW YORK &bull; LONDON &bull; ZURICH &bull; SINGAPORE</span>
                <span className="text-white/60">EST. 1994</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    Northstar Strategic Partners
                </a>
                <a
                    href="#briefing"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#84b9ff] hover:underline"
                >
                    <span>Request Executive Briefing &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-white/10 bg-[#0a111a] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="corporate"
                            accent="#84b9ff"
                            variant={3}
                            label="Quantified Impact"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#84b9ff] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#energy" className="text-white/70 hover:text-white transition-colors">
                            Energy Transition
                        </a>
                        <a href="#private-equity" className="text-white/70 hover:text-white transition-colors">
                            Private Equity Advisory
                        </a>
                        <a href="#sovereign" className="text-white/70 hover:text-white transition-colors">
                            Sovereign Wealth
                        </a>
                        <a href="#esg" className="text-white/70 hover:text-white transition-colors">
                            Verified ESG
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 hidden lg:inline">
                        GLOBAL PRACTICE LEADERSHIP
                    </span>
                </nav>
            </div>
        </header>
    )
}

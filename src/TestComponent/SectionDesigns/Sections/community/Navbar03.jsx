import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y-2 border-black/15 bg-[#241c19] text-[#f7e6de] shadow-xl">
            {/* Top Micro-Ticker */}
            <div className="border-b border-white/10 px-5 py-1.5 font-mono text-[10px] text-[#ffccad] flex items-center justify-between sm:px-8">
                <span>120+ PRACTICE GUILDS WORLDWIDE &bull; 42,000 CREATIVE PRACTITIONERS</span>
                <span className="hidden sm:inline">ZERO TOLERANCE HARASSMENT POLICY &bull; CODE OF CONDUCT v3.2</span>
                <span className="text-white/60">EST. 2021</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    THE INDEPENDENT CREATOR COMMONS
                </a>
                <a
                    href="#manifesto"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#ffccad] hover:underline"
                >
                    <span>Read Community Charter &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-white/10 bg-[#1c1513] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="community"
                            accent="#ffccad"
                            variant={3}
                            label="Topic Radar"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#ffccad] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#ethics" className="text-white/70 hover:text-white transition-colors">
                            Design Ethics
                        </a>
                        <a href="#indie" className="text-white/70 hover:text-white transition-colors">
                            Indie Founders
                        </a>
                        <a href="#oss" className="text-white/70 hover:text-white transition-colors">
                            Open Source
                        </a>
                        <a href="#local" className="text-white/70 hover:text-white transition-colors">
                            City Chapters
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 hidden lg:inline">
                        DECENTRALIZED GOVERNANCE
                    </span>
                </nav>
            </div>
        </header>
    )
}

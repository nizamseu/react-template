import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y-2 border-black/15 bg-[#ef6a4b] text-[#241d1a] shadow-lg">
            {/* Top Micro-Ticker */}
            <div className="border-b border-black/15 px-5 py-1.5 font-mono text-[10px] text-[#241d1a]/80 flex items-center justify-between sm:px-8">
                <span>INDEPENDENT DESIGN DIRECTION &bull; STOCKHOLM & NEW YORK</span>
                <span className="hidden sm:inline">AWWWARDS JURY MEMBER &bull; 26 SITE OF THE DAY HONORS</span>
                <span>EST. 2016</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                    JAMIE PARK &mdash; ATELIER OF FORM
                </a>
                <a
                    href="#manifesto"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#241d1a] hover:underline"
                >
                    <span>Read Studio Manifesto &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-black/15 bg-[#e05e40] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="portfolio"
                            accent="#241d1a"
                            variant={3}
                            label="Design Manifesto"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#241d1a] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#monographs" className="text-[#241d1a]/80 hover:text-white transition-colors">
                            Monographs
                        </a>
                        <a href="#typefaces" className="text-[#241d1a]/80 hover:text-white transition-colors">
                            Custom Typefaces
                        </a>
                        <a href="#spatial" className="text-[#241d1a]/80 hover:text-white transition-colors">
                            Spatial Web
                        </a>
                        <a href="#archive" className="text-[#241d1a]/80 hover:text-white transition-colors">
                            Archive (2016–2026)
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-[#241d1a]/70 hidden lg:inline">
                        1 COMMISSION AVAILABLE
                    </span>
                </nav>
            </div>
        </header>
    )
}

import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y border-gray-200 bg-white text-[#1a2826] shadow-sm">
            {/* Top Micro-Ticker */}
            <div className="border-b border-gray-100 px-5 py-1.5 font-mono text-[10px] text-gray-500 flex items-center justify-between sm:px-8">
                <span>ANONYMOUS LOCAL CRITIQUES &bull; ZERO SPONSORED LISTINGS</span>
                <span className="hidden sm:inline">COVERING 24 METROPOLITAN HUBS WORLDWIDE</span>
                <span>VERIFIED INDEPENDENT</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    The City Compass & Independent Index
                </a>
                <a
                    href="#submit-gem"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#527354] hover:underline"
                >
                    <span>Submit a Hidden Gem &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="directory"
                            accent="#527354"
                            variant={3}
                            label="Curated Guides"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#527354] hover:text-[#1a2826] transition-colors cursor-pointer"
                        />
                        <a href="#roasters" className="text-gray-600 hover:text-black transition-colors">
                            Artisan Roasters
                        </a>
                        <a href="#vinyl" className="text-gray-600 hover:text-black transition-colors">
                            Listening Bars
                        </a>
                        <a href="#bakeries" className="text-gray-600 hover:text-black transition-colors">
                            Sourdough Bakeries
                        </a>
                        <a href="#bookshops" className="text-gray-600 hover:text-black transition-colors">
                            Rare Books
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400 hidden lg:inline">
                        100% UNADVERTISED
                    </span>
                </nav>
            </div>
        </header>
    )
}

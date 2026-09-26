import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y border-gray-200 bg-white text-[#102d36] shadow-sm">
            {/* Top Micro-Ticker */}
            <div className="border-b border-gray-100 px-5 py-1.5 font-mono text-[10px] text-gray-500 flex items-center justify-between sm:px-8">
                <span>FALL 2026 ADMISSIONS OPEN &bull; ACCREDITED CERTIFICATION</span>
                <span className="hidden sm:inline">94% GRADUATE PLACEMENT AT TOP TIER STUDIOS</span>
                <span>BERLIN & ONLINE</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    Fieldnote Academy of Practical Craft
                </a>
                <a
                    href="#scholarship"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#3c7e5d] hover:underline"
                >
                    <span>Tuition Assistance &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="learning"
                            accent="#3c7e5d"
                            variant={3}
                            label="Career Roadmap"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#3c7e5d] hover:text-[#102d36] transition-colors cursor-pointer"
                        />
                        <a href="#design-systems" className="text-gray-600 hover:text-black transition-colors">
                            Design Systems
                        </a>
                        <a href="#creative-coding" className="text-gray-600 hover:text-black transition-colors">
                            Creative Coding
                        </a>
                        <a href="#typography" className="text-gray-600 hover:text-black transition-colors">
                            Spatial & Type
                        </a>
                        <a href="#alumni" className="text-gray-600 hover:text-black transition-colors">
                            Alumni Work
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400 hidden lg:inline">
                        12-WEEK IMMERSIVES
                    </span>
                </nav>
            </div>
        </header>
    )
}

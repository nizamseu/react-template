import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y border-[#d8e2e6] bg-[#f8f5ef] text-[#132d3a] shadow-sm">
            {/* Top Micro-Ticker */}
            <div className="border-b border-black/10 px-5 py-1.5 font-mono text-[10px] text-black/60 flex items-center justify-between sm:px-8">
                <span>100% CARBON-NEUTRAL ARCHITECTURAL RESIDENCES &bull; PRIVATE CHEF ON DEMAND</span>
                <span className="hidden sm:inline">48 PRIVATELY OWNED SANCTUARIES WORLDWIDE</span>
                <span>EST. 2019</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    Elsewhere Residences & Sanctuaries
                </a>
                <a
                    href="#membership"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#b65f47] hover:underline"
                >
                    <span>Membership Portfolio &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-black/10 bg-[#f0ece1] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="booking"
                            accent="#b65f47"
                            variant={3}
                            label="Stays by Typology"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#b65f47] hover:text-[#132d3a] transition-colors cursor-pointer"
                        />
                        <a href="#mid-century" className="text-black/70 hover:text-black transition-colors">
                            Mid-Century Modern
                        </a>
                        <a href="#wilderness" className="text-black/70 hover:text-black transition-colors">
                            Wilderness Cabins
                        </a>
                        <a href="#bastions" className="text-black/70 hover:text-black transition-colors">
                            Historic Bastions
                        </a>
                        <a href="#overwater" className="text-black/70 hover:text-black transition-colors">
                            Overwater Pods
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-black/50 hidden lg:inline">
                        SCOUTED & VERIFIED
                    </span>
                </nav>
            </div>
        </header>
    )
}

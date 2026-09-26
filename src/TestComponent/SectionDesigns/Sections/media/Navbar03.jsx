import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y-2 border-black bg-[#f6f3eb] text-[#1e1e1a]">
            {/* Top Micro-Ticker */}
            <div className="border-b border-black/15 px-5 py-1.5 font-mono text-[10px] text-black/60 flex items-center justify-between sm:px-8">
                <span>THE DAILY MARGINALIAN &bull; EST. 2004 &bull; GLOBAL CRITICISM</span>
                <span className="hidden sm:inline">PRINT EDITION AVAILABLE IN LONDON, TOKYO & NEW YORK</span>
                <span>VOL. 22 &bull; NO. 842</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-5 text-center sm:px-8 flex items-center justify-between">
                <span className="hidden sm:block font-mono text-[10px] text-black/40 uppercase">
                    PRICE: $4.00 USD
                </span>
                <a
                    href="#home"
                    className="font-serif text-3xl sm:text-5xl font-black tracking-tight uppercase hover:opacity-85 transition-opacity mx-auto sm:mx-0"
                >
                    The Margin Journal
                </a>
                <a
                    href="#patron"
                    className="hidden sm:inline-flex items-center gap-1 font-mono text-xs font-bold text-[#a8472b] hover:underline"
                >
                    <span>Patron Pledge &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t-2 border-black bg-[#efeae0] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-serif font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="media"
                            accent="#a8472b"
                            variant={3}
                            label="Gazette Archive"
                            triggerClassName="inline-flex items-center gap-1 font-serif text-xs font-bold uppercase tracking-wider text-[#a8472b] hover:text-black transition-colors cursor-pointer"
                        />
                        <a href="#culture" className="text-black/70 hover:text-black transition-colors">
                            Culture & Art
                        </a>
                        <a href="#architecture" className="text-black/70 hover:text-black transition-colors">
                            Architecture
                        </a>
                        <a href="#philosophy" className="text-black/70 hover:text-black transition-colors">
                            Philosophy
                        </a>
                        <a href="#critical-reading" className="text-black/70 hover:text-black transition-colors">
                            Critical Reading
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-black/50 hidden lg:inline">
                        100% INDEPENDENT JOURNALISM
                    </span>
                </nav>
            </div>
        </header>
    )
}

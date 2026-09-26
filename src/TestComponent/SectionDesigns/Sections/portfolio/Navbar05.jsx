import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-white/20 bg-[#181412] text-[#e3deda]">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/20">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg tracking-widest text-white">
                        JAMIE PARK <span className="font-mono text-xs text-[#ef6a4b]">/ WORK</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/50">2026</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="portfolio"
                            accent="#ef6a4b"
                            variant={5}
                            label="Visual Notes"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#ef6a4b] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#systems" className="text-white/70 hover:text-white transition-colors">
                            Brand Systems
                        </a>
                        <a href="#interactive" className="text-white/70 hover:text-white transition-colors">
                            Interactive Art
                        </a>
                        <a href="#exhibitions" className="text-white/70 hover:text-white transition-colors">
                            Exhibitions
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#ef6a4b]">
                        TOKYO & STOCKHOLM
                    </span>
                </div>

                {/* Column 3: Commissions Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span className="text-[#ef6a4b]">1 COMMISSION LEFT</span>
                    <a
                        href="#inquire"
                        className="flex items-center gap-1 text-white hover:text-[#ef6a4b] transition-colors"
                    >
                        <span>INQUIRE &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

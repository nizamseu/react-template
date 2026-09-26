import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-[#527354] bg-[#edf1e6] text-[#1a2826]">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#527354]/30">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-mono text-sm font-black uppercase tracking-wider">
                        DISTRICT <span className="text-[#527354]">/ WALKS</span>
                    </a>
                    <span className="font-mono text-[10px] text-[#527354]">MAPS</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="directory"
                            accent="#527354"
                            variant={5}
                            label="District Walks"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#527354] hover:text-black transition-colors cursor-pointer"
                        />
                        <a href="#shibuya" className="hover:text-[#527354] transition-colors">
                            Shimokitazawa
                        </a>
                        <a href="#kreuzberg" className="hover:text-[#527354] transition-colors">
                            Kreuzberg
                        </a>
                        <a href="#marais" className="hover:text-[#527354] transition-colors">
                            Le Marais
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#527354]">
                        CURATED WALKING ROUTES
                    </span>
                </div>

                {/* Column 3: Stops Count */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span>4,820 STOPS</span>
                    <a
                        href="#all-walks"
                        className="flex items-center gap-1 text-[#527354] hover:underline"
                    >
                        <span>EXPLORE &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

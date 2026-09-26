import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-[#84b9ff]/30 bg-[#0a0f17] text-white">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#84b9ff]/20">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg tracking-widest text-white">
                        NORTHSTAR <span className="font-mono text-xs text-[#84b9ff]">CAPITAL</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/40">FUND VI</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="corporate"
                            accent="#84b9ff"
                            variant={5}
                            label="Private Capital"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#84b9ff] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#portfolio" className="text-white/70 hover:text-white transition-colors">
                            Portfolio
                        </a>
                        <a href="#criteria" className="text-white/70 hover:text-white transition-colors">
                            Mandate
                        </a>
                        <a href="#team" className="text-white/70 hover:text-white transition-colors">
                            General Partners
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#84b9ff]">
                        GLOBAL PRIVATE EQUITY
                    </span>
                </div>

                {/* Column 3: AUM Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span>$18.4B AUM</span>
                    <a
                        href="#lp-login"
                        className="flex items-center gap-1 text-[#84b9ff] hover:underline"
                    >
                        <span>LP PORTAL &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

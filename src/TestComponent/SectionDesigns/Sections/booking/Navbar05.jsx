import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-[#e07d5b] bg-[#0e1d24] text-[#dae6ec]">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#e07d5b]/40">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg font-bold tracking-tight text-white">
                        ELSEWHERE <span className="font-mono text-xs font-normal text-[#e07d5b]">/ FLASH</span>
                    </a>
                    <span className="font-mono text-[10px] text-[#e07d5b]">WEEKEND</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="booking"
                            accent="#e07d5b"
                            variant={5}
                            label="Weekend Escapes"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#e07d5b] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#deals" className="text-white/70 hover:text-white transition-colors">
                            35% Off Deals
                        </a>
                        <a href="#unbooked" className="text-white/70 hover:text-white transition-colors">
                            Secret Season
                        </a>
                        <a href="#drives" className="text-white/70 hover:text-white transition-colors">
                            Under 2h Drive
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#e07d5b]">
                        LIMITED TIME DISCOUNTS
                    </span>
                </div>

                {/* Column 3: Expiration status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span className="text-[#e07d5b]">ENDS IN 14H</span>
                    <a
                        href="#instant-book"
                        className="flex items-center gap-1 text-white hover:text-[#e07d5b] transition-colors"
                    >
                        <span>BOOK &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

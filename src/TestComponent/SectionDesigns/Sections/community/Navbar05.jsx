import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-white/20 bg-[#1b1513] text-white">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_200px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/20">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg font-bold tracking-tight">
                        COMMON <span className="font-sans text-xs font-normal text-white/50">/ GUILDS</span>
                    </a>
                    <span className="font-mono text-[10px] text-[#ffccad]">HUB 05</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="community"
                            accent="#ffccad"
                            variant={5}
                            label="Discord Hub"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#ffccad] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#voice" className="text-white/70 hover:text-white transition-colors">
                            Voice Stages
                        </a>
                        <a href="#study" className="text-white/70 hover:text-white transition-colors">
                            Study Halls
                        </a>
                        <a href="#collabs" className="text-white/70 hover:text-white transition-colors">
                            Project Drops
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#ffccad]">
                        INVITE ONLY
                    </span>
                </div>

                {/* Column 3: Live Community Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span>24.8K BUILDERS</span>
                    <a
                        href="#join-discord"
                        className="flex items-center gap-1 text-[#ffccad] hover:underline"
                    >
                        <span>DISCORD &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

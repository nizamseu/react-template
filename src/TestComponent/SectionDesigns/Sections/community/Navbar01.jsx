import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b-2 border-black/10 bg-[#ffccad] px-5 py-4 text-[#27201d] sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="text-xl font-black tracking-tight shrink-0">
                        COMMON<span className="text-[#a34c38]">ROOM</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="community"
                            accent="#a34c38"
                            variant={1}
                            label="Guilds & Spaces"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#a34c38] hover:text-[#27201d] transition-colors cursor-pointer"
                        />
                        <a href="#spaces" className="text-[#27201d]/75 hover:text-[#27201d] transition-colors">
                            Explore Spaces
                        </a>
                        <a href="#directory" className="text-[#27201d]/75 hover:text-[#27201d] transition-colors">
                            Member Directory
                        </a>
                        <a href="#manifesto" className="text-[#27201d]/75 hover:text-[#27201d] transition-colors">
                            Community Charter
                        </a>
                    </nav>
                </div>

                {/* Right Live Active & Join Action */}
                <div className="flex items-center gap-5">
                    <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-[#a34c38]">
                        <span className="h-2 w-2 rounded-full bg-[#a34c38] animate-pulse" />
                        2,420 Online
                    </span>
                    <a
                        href="#join"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#a34c38] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-black transition-colors"
                    >
                        <span>Join Guild</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

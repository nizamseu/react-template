import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b-2 border-[#d9f064] bg-[#14201e] px-5 py-4 text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#home"
                        className="font-mono text-sm font-black uppercase tracking-[.18em] shrink-0"
                    >
                        GOOD NEIGHBOR<span className="text-[#d9f064]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs text-white/70 md:flex">
                        <MegaMenu
                            category="directory"
                            accent="#d9f064"
                            variant={1}
                            label="Local Guilds"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#d9f064] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#neighborhoods" className="hover:text-white transition-colors">
                            Neighborhoods
                        </a>
                        <a href="#guides" className="hover:text-white transition-colors">
                            Field Guides
                        </a>
                        <a href="#map" className="hover:text-white transition-colors">
                            Map Index
                        </a>
                    </nav>
                </div>

                {/* Right Status & Suggest Spot Action */}
                <div className="flex items-center gap-5 font-mono text-xs">
                    <span className="hidden sm:inline text-white/50">
                        4,820 PLACES VERIFIED
                    </span>
                    <a
                        href="#suggest"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#d9f064] px-4 py-2 font-bold text-[#14201e] hover:bg-white transition-colors"
                    >
                        <span>Suggest Place</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

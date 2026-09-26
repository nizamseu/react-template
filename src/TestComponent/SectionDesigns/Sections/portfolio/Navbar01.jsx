import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b-2 border-black/15 bg-[#ef6a4b] px-5 py-4 text-[#241d1a] sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#home"
                        className="text-base font-black uppercase tracking-[.14em] shrink-0"
                    >
                        JP<span className="ml-2 font-normal text-xs">/ Design Director</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs uppercase font-bold tracking-wider md:flex">
                        <MegaMenu
                            category="portfolio"
                            accent="#241d1a"
                            variant={1}
                            label="Selected Works"
                            triggerClassName="inline-flex items-center gap-1 text-xs uppercase font-bold tracking-wider hover:opacity-75 transition-opacity cursor-pointer"
                        />
                        <a href="#about" className="hover:opacity-75 transition-opacity">
                            About
                        </a>
                        <a href="#awards" className="hover:opacity-75 transition-opacity">
                            Awards (26)
                        </a>
                        <a href="#notes" className="hover:opacity-75 transition-opacity">
                            Field Notes
                        </a>
                    </nav>
                </div>

                {/* Right Availability & Action */}
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline font-mono text-xs text-[#241d1a]/80 font-bold">
                        AVAILABLE Q4
                    </span>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#241d1a] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-black transition-colors"
                    >
                        <span>Commission Work</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

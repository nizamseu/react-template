import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-b-2 border-black/10 bg-[#d9f064] px-5 py-4 text-[#1a2826] sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="text-sm font-black uppercase tracking-wider shrink-0">
                    GOOD NEIGHBOR <span className="text-[#527354]">/</span> INDEX
                </a>

                {/* Right-Flush Navigation & Filter Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-wider md:flex">
                        <MegaMenu
                            category="directory"
                            accent="#1a2826"
                            variant={2}
                            label="Power Search"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#1a2826] hover:opacity-75 transition-opacity cursor-pointer"
                        />
                        <a href="#coffee" className="hover:opacity-75 transition-opacity">
                            Specialty Coffee
                        </a>
                        <a href="#books" className="hover:opacity-75 transition-opacity">
                            Independent Books
                        </a>
                        <a href="#ateliers" className="hover:opacity-75 transition-opacity">
                            Ateliers
                        </a>
                    </nav>

                    <a
                        href="#filter-matrix"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#1a2826] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-black transition-colors shrink-0"
                    >
                        <span>Filter Matrix</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

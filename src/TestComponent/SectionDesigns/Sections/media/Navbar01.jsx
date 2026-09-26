import { HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b-2 border-black/15 bg-[#f1eee6] px-5 py-4 text-[#1f201c] sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#home"
                        className="font-serif text-3xl font-bold tracking-tight shrink-0"
                    >
                        MARGIN<span className="text-[#a8472b]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-serif sm:order-none sm:w-auto sm:border-0 sm:pt-0 md:flex">
                        <MegaMenu
                            category="media"
                            accent="#a84f34"
                            variant={1}
                            label="Sunday Edition"
                            triggerClassName="inline-flex items-center gap-1 font-serif text-xs font-semibold text-[#a8472b] hover:text-[#1f201c] transition-colors cursor-pointer"
                        />
                        <a href="#longform" className="text-[#1f201c]/70 hover:text-black transition-colors">
                            Longform Essays
                        </a>
                        <a href="#dialogues" className="text-[#1f201c]/70 hover:text-black transition-colors">
                            Dialogues
                        </a>
                        <a href="#dispatch" className="text-[#1f201c]/70 hover:text-black transition-colors">
                            Dispatch
                        </a>
                        <a href="#archive" className="text-[#1f201c]/70 hover:text-black transition-colors">
                            Archive (2004–2026)
                        </a>
                    </nav>
                </div>

                {/* Right Issue No & Search */}
                <div className="flex items-center gap-5 text-xs font-mono">
                    <span className="hidden sm:inline text-black/50">
                        ISSUE NO. 48 &bull; OCT 2026
                    </span>
                    <button
                        aria-label="Search articles"
                        className="flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 hover:bg-black/5 transition-colors"
                    >
                        <HiOutlineSearch className="text-sm" />
                        <span className="hidden sm:inline">Search Index</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar02() {
    return (
        <header className="rounded-lg border-b border-[#e7d4c8] bg-[#f7ede6] px-5 py-4 text-[#27201d]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="text-sm font-black uppercase">
                    COMMONROOM<span className="text-[#a34c38]">.</span>
                </a>
                <nav className="order-3 flex w-full gap-5 border-t border-[#e7d4c8] pt-3 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#groups">Groups</a>
                    <a href="#events">Events</a>
                    <a href="#people">People</a>
                    <a href="#guidelines">Our values</a>

                    <MegaMenu
                        category="community"
                        accent="#a34c38"
                        variant={2}
                    />
                </nav>
                <div className="flex items-center gap-3">
                    <button aria-label="Search communities">
                        <HiOutlineSearch />
                    </button>
                    <a
                        href="#join"
                        className="flex items-center gap-1 rounded-full bg-[#27201d] px-4 py-2 text-xs text-white"
                    >
                        Join <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

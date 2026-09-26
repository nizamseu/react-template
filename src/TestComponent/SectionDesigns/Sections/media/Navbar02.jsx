import { HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar02() {
    return (
        <header className="rounded-lg border-y border-[#bdb3a4] bg-[#f3eee5] px-5 py-4 text-[#28221e]">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <a href="#home" className="font-serif text-3xl font-bold">
                    MARGIN
                </a>
                <nav className="flex gap-5 overflow-x-auto text-[10px] font-bold uppercase tracking-[.13em]">
                    <a href="#culture">Culture</a>
                    <a href="#ideas">Ideas</a>
                    <a href="#people">People</a>
                    <a href="#places">Places</a>

                    <MegaMenu category="media" accent="#a84f34" variant={2} />
                </nav>
                <div className="flex items-center gap-3 text-xs">
                    <button aria-label="Search">
                        <HiOutlineSearch className="text-lg" />
                    </button>
                    <a
                        href="#subscribe"
                        className="border-b border-[#a84f34] pb-1"
                    >
                        Subscribe
                    </a>
                </div>
            </div>
        </header>
    )
}

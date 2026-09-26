import { HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar01() {
    return (
        <header className="rounded-lg bg-[#f1eee6] px-5 py-4 text-[#1f201c]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a
                    href="#home"
                    className="font-serif text-3xl font-bold tracking-tight"
                >
                    MARGIN<span className="text-[#a8472b]">.</span>
                </a>
                <nav className="order-3 flex w-full gap-6 overflow-x-auto border-t border-[#c8c2b5] pt-3 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#latest">Latest</a>
                    <a href="#culture">Culture</a>
                    <a href="#ideas">Ideas</a>
                    <a href="#field-notes">Field notes</a>

                    <MegaMenu category="media" accent="#a84f34" variant={1} />
                </nav>
                <div className="flex items-center gap-4 text-xs">
                    <button aria-label="Search stories">
                        <HiOutlineSearch className="text-lg" />
                    </button>
                    <a
                        href="#subscribe"
                        className="border-b border-[#a8472b] pb-1 font-semibold"
                    >
                        Subscribe
                    </a>
                </div>
            </div>
        </header>
    )
}

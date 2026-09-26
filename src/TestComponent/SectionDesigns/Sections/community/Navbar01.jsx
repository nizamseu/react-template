import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar01() {
    return (
        <header className="rounded-lg bg-[#ffccad] px-5 py-4 text-[#27201d] sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="text-xl font-black">
                    COMMON<span className="text-[#a34c38]">ROOM</span>
                </a>
                <nav className="order-3 flex w-full gap-6 overflow-x-auto border-t border-[#d99477] pt-3 text-xs font-medium sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#groups">Find a group</a>
                    <a href="#events">Events</a>
                    <a href="#stories">Member stories</a>

                    <MegaMenu
                        category="community"
                        accent="#a34c38"
                        variant={1}
                    />
                </nav>
                <div className="flex items-center gap-3">
                    <button aria-label="Search community">
                        <HiOutlineSearch />
                    </button>
                    <a
                        href="#join"
                        className="inline-flex items-center gap-2 rounded-full bg-[#27201d] px-4 py-2 text-xs font-semibold text-white"
                    >
                        Join us <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

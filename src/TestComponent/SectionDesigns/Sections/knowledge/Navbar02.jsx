import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-lg border border-[#dce3dd] bg-white px-5 py-4 text-[#17231f]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#docs" className="font-serif text-xl font-semibold">
                    FIELDGUIDE <span className="text-[#41715d]">/</span> HELP
                </a>
                <nav className="order-3 flex w-full gap-6 border-t border-[#edf0ec] pt-3 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#getting-started">Start here</a>
                    <a href="#account">Account</a>
                    <a href="#billing">Plans</a>
                    <a href="#contact">Contact</a>

                    <MegaMenu
                        category="knowledge"
                        accent="#41715d"
                        variant={2}
                    />
                </nav>
                <div className="flex items-center gap-3">
                    <button aria-label="Search help" className="text-lg">
                        <HiOutlineSearch />
                    </button>
                    <a
                        href="#support"
                        className="inline-flex items-center gap-1 rounded-md bg-[#41715d] px-3 py-2 text-xs text-white"
                    >
                        Get help <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

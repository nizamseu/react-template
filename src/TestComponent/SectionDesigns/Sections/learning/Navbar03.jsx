import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar03() {
    return (
        <header className="rounded-lg border border-[#dce5dc] bg-white px-5 py-3 text-[#102d36]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a
                    href="#home"
                    className="flex items-center gap-2 font-semibold"
                >
                    <span className="h-3 w-3 rounded-full bg-[#3c7e5d]" />{' '}
                    FIELDNOTE / SCHOOL
                </a>
                <nav className="order-3 flex w-full gap-6 border-t pt-3 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#catalog">Course catalog</a>
                    <a href="#mentors">Mentors</a>
                    <a href="#about">Our approach</a>

                    <MegaMenu
                        category="learning"
                        accent="#3c7e5d"
                        variant={3}
                    />
                </nav>
                <div className="flex items-center gap-3">
                    <button aria-label="Search classes">
                        <HiOutlineSearch />
                    </button>
                    <a href="#account" className="text-xs">
                        Sign in
                    </a>
                    <a
                        href="#start"
                        className="rounded bg-[#3c7e5d] px-3 py-2 text-xs text-white"
                    >
                        Start here <HiArrowRight className="ml-1 inline" />
                    </a>
                </div>
            </div>
        </header>
    )
}

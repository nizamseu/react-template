import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-lg border-b border-[#dce3dd] bg-[#f6f7f4] px-5 py-4 text-[#17231f]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <a
                    href="#docs"
                    className="text-xs font-bold uppercase tracking-[.14em]"
                >
                    NORTHSTAR / DOCS 4.12
                </a>
                <nav className="flex gap-5 overflow-x-auto text-xs text-gray-600">
                    <a href="#quickstart">Quickstart</a>
                    <a href="#api">API</a>
                    <a href="#guides">Guides</a>
                    <a href="#status">Status</a>

                    <MegaMenu
                        category="knowledge"
                        accent="#41715d"
                        variant={5}
                    />
                </nav>
                <div className="flex items-center gap-3">
                    <button aria-label="Search docs">
                        <HiOutlineSearch />
                    </button>
                    <a
                        href="#support"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#41715d]"
                    >
                        Ask support <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

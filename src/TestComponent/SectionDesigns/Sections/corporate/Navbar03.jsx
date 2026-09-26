import { HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar03() {
    return (
        <header className="rounded-lg border-y border-[#cbd5df] bg-[#f5f7f9] px-5 py-3 text-[#182434]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="text-sm font-bold">
                    Northstar<span className="text-[#3476c5]">/</span> Insights
                </a>
                <nav className="flex gap-5 overflow-x-auto text-xs text-gray-600">
                    <a href="#leadership">Leadership</a>
                    <a href="#markets">Markets</a>
                    <a href="#operations">Operations</a>

                    <MegaMenu
                        category="corporate"
                        accent="#3476c5"
                        variant={3}
                    />
                </nav>
                <div className="flex items-center gap-3 text-xs">
                    <button aria-label="Search insights">
                        <HiOutlineSearch />
                    </button>
                    <a
                        href="#subscribe"
                        className="border-b border-[#3476c5] pb-1"
                    >
                        Subscribe
                    </a>
                </div>
            </div>
        </header>
    )
}

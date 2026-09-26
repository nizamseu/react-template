import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar01() {
    return (
        <header className="rounded-lg border border-[#e2e7e2] bg-white px-5 py-3 text-[#17231f] sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a
                    href="#home"
                    className="flex items-center gap-2 font-semibold"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-[#41715d] text-xs text-white">
                        N
                    </span>{' '}
                    northstar docs
                </a>
                <nav className="order-3 flex w-full gap-6 border-t border-gray-100 pt-3 text-xs text-gray-600 sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#guides">Guides</a>
                    <a href="#api">API reference</a>
                    <a href="#changelog">Changelog</a>
                    <a href="#support">Support</a>

                    <MegaMenu
                        category="knowledge"
                        accent="#41715d"
                        variant={1}
                    />
                </nav>
                <div className="flex items-center gap-4">
                    <button
                        aria-label="Search documentation"
                        className="flex items-center gap-2 text-xs text-gray-500"
                    >
                        <HiOutlineSearch />{' '}
                        <span className="hidden sm:block">Search docs</span>
                    </button>
                    <a
                        href="#app"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#41715d]"
                    >
                        Open app <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

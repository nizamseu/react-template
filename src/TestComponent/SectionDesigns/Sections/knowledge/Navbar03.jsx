import { HiOutlineCode, HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-lg bg-[#17231f] px-5 py-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a
                    href="#developer"
                    className="flex items-center gap-2 font-semibold"
                >
                    <HiOutlineCode className="text-[#9bd2a7]" /> northstar{' '}
                    <span className="text-[#9bd2a7]">developers</span>
                </a>
                <nav className="order-3 flex w-full gap-6 border-t border-white/15 pt-3 text-xs text-white/70 sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#api">API reference</a>
                    <a href="#sdks">SDKs</a>
                    <a href="#tutorials">Tutorials</a>
                    <a href="#changelog">Changelog</a>

                    <MegaMenu
                        category="knowledge"
                        accent="#9bd2a7"
                        variant={3}
                    />
                </nav>
                <div className="flex items-center gap-3 text-sm">
                    <button aria-label="Search developer docs">
                        <HiOutlineSearch />
                    </button>
                    <a
                        href="#console"
                        className="rounded-md bg-[#9bd2a7] px-3 py-2 text-xs font-semibold text-[#17231f]"
                    >
                        Open console
                    </a>
                </div>
            </div>
        </header>
    )
}

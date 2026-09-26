import { HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b border-gray-200 bg-white px-5 py-3.5 text-[#17231f] dark:border-gray-800 dark:bg-[#0f1a16] dark:text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#home"
                        className="flex items-center gap-2.5 font-bold tracking-tight text-sm shrink-0"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-[#41715d] text-xs text-white font-mono">
                            N
                        </span>
                        <span>northstar docs</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="knowledge"
                            accent="#41715d"
                            variant={1}
                            label="Developer Docs"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#41715d] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#quickstarts" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            Quickstarts
                        </a>
                        <a href="#sdks" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            SDK References
                        </a>
                        <a href="#api" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            API v4.2
                        </a>
                    </nav>
                </div>

                {/* Right Version Switcher & Search */}
                <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[#41715d] font-bold border border-emerald-500/20">
                        v4.2 (Latest)
                    </span>
                    <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                        <HiOutlineSearch className="text-sm" />
                        <span>Search docs (⌘K)</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

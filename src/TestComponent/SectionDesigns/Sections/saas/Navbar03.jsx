import { HiOutlineBell, HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar03() {
    return (
        <header className="rounded-lg border border-[#263640] bg-[#111a22] px-5 py-3 text-white">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#65e6b4]" />
                    <a href="#app" className="text-sm font-semibold">
                        northstar
                    </a>
                    <span className="text-xs text-white/35">/</span>
                    <span className="text-xs text-white/55">
                        Platform overview
                    </span>
                </div>
                <nav className="hidden gap-6 text-xs text-white/55 md:flex">
                    <a href="#workspaces">Workspaces</a>
                    <a href="#reports">Reports</a>
                    <a href="#settings">Settings</a>

                    <MegaMenu category="saas" accent="#17a878" variant={3} />
                </nav>
                <div className="flex gap-4 text-lg text-white/65">
                    <button aria-label="Search">
                        <HiOutlineSearch />
                    </button>
                    <button aria-label="Notifications">
                        <HiOutlineBell />
                    </button>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#65e6b4] text-[10px] font-bold text-[#111a22]">
                        AM
                    </span>
                </div>

                <MegaMenu
                    category="saas"
                    accent="#17a878"
                    variant={3}
                    className="md:hidden"
                />
            </div>
        </header>
    )
}

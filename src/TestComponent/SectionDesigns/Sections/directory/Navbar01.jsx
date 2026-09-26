import { HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar01() {
    return (
        <header className="rounded-lg bg-[#1a2826] px-5 py-4 text-white sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a
                    href="#home"
                    className="text-sm font-black uppercase tracking-[.12em]"
                >
                    GOOD NEIGHBOR<span className="text-[#d9f064]">.</span>
                </a>
                <nav className="order-3 flex w-full gap-6 overflow-x-auto border-t border-white/15 pt-3 text-xs text-white/70 sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#categories">Categories</a>
                    <a href="#nearby">Near me</a>
                    <a href="#recommendations">Recommended</a>
                    <a href="#owners">For businesses</a>

                    <MegaMenu
                        category="directory"
                        accent="#527354"
                        variant={1}
                    />
                </nav>
                <a
                    href="#search"
                    className="flex items-center gap-2 rounded-full bg-[#d9f064] px-4 py-2 text-xs font-bold text-[#1a2826]"
                >
                    <HiOutlineSearch /> Find a local
                </a>
            </div>
        </header>
    )
}

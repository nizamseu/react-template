import {
    HiOutlineSearch,
    HiOutlineShoppingBag,
    HiOutlineUser,
} from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b border-black/10 bg-[#f3eee6] px-5 py-4 text-[#1c1b19] dark:bg-[#1f1d1b] dark:text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="font-serif text-2xl font-bold tracking-tight shrink-0">
                        goodform<span className="text-[#9a704b]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="ecommerce"
                            accent="#9a704b"
                            variant={1}
                            label="Lookbook Drop"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#1c1b19] dark:text-white hover:text-[#9a704b] transition-colors cursor-pointer"
                        />
                        <a href="#new" className="hover:text-[#9a704b] transition-colors">
                            New Arrivals
                        </a>
                        <a href="#objects" className="hover:text-[#9a704b] transition-colors">
                            Objects
                        </a>
                        <a href="#makers" className="hover:text-[#9a704b] transition-colors">
                            Makers
                        </a>
                        <a href="#journal" className="hover:text-[#9a704b] transition-colors">
                            Journal
                        </a>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-5 text-sm">
                    <button aria-label="Search" className="flex items-center gap-2 text-xs font-medium text-[#766b5e] hover:text-black dark:hover:text-white transition-colors">
                        <HiOutlineSearch className="text-base" />
                        <span className="hidden sm:inline">Search</span>
                    </button>
                    <button aria-label="Account" className="hover:opacity-70 transition-opacity">
                        <HiOutlineUser className="text-base" />
                    </button>
                    <button
                        aria-label="Shopping bag"
                        className="relative flex items-center gap-1.5 rounded-full bg-[#1c1b19] px-3.5 py-1.5 text-xs font-bold text-white dark:bg-white dark:text-[#1c1b19] hover:opacity-85 transition-opacity"
                    >
                        <HiOutlineShoppingBag className="text-sm" />
                        <span>Bag (2)</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

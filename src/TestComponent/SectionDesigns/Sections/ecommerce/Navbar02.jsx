import { HiArrowRight, HiOutlineShoppingBag } from 'react-icons/hi'
export default function Navbar02() {
    return (
        <header className="rounded-lg bg-[#211d18] px-5 py-3 text-white sm:px-8">
            <div className="flex items-center justify-between gap-4">
                <a
                    href="#home"
                    className="text-xs font-black uppercase tracking-[.16em]"
                >
                    MATERIAL<span className="text-[#d6f36a]">/</span>MATTERS
                </a>
                <nav className="hidden items-center gap-7 text-xs text-white/75 md:flex">
                    <a href="#shop">Shop all</a>
                    <a href="#circular">Circular edit</a>
                    <a href="#studio">Our studio</a>
                </nav>
                <div className="flex items-center gap-4">
                    <a href="#search" className="hidden text-xs sm:block">
                        Search
                    </a>
                    <a
                        href="#bag"
                        aria-label="Open shopping bag"
                        className="flex items-center gap-2 rounded-full bg-[#d6f36a] px-4 py-2 text-xs font-bold text-[#202315]"
                    >
                        Bag 0 <HiOutlineShoppingBag />
                    </a>
                    <a
                        href="#shop"
                        className="hidden items-center gap-1 text-xs md:flex"
                    >
                        Explore <HiArrowRight />
                    </a>
                </div>
            </div>
            <nav className="mt-3 flex gap-5 overflow-x-auto border-t border-white/15 pt-3 text-xs text-white/65 md:hidden">
                <a href="#shop">Shop all</a>
                <a href="#circular">Circular edit</a>
                <a href="#studio">Our studio</a>
            </nav>
        </header>
    )
}

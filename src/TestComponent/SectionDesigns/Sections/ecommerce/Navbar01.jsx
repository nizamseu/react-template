import {
    HiOutlineSearch,
    HiOutlineShoppingBag,
    HiOutlineUser,
} from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar01() {
    return (
        <header className="rounded-lg bg-[#f3eee6] px-5 py-4 text-[#1c1b19] dark:bg-[#26231f] dark:text-white sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="font-serif text-2xl font-bold">
                    goodform<span className="text-[#2a85ff]">.</span>
                </a>
                <nav className="order-3 flex w-full gap-6 overflow-x-auto border-t border-black/10 pt-3 text-xs font-semibold sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#new">New arrivals</a>
                    <a href="#objects">Objects</a>
                    <a href="#makers">Makers</a>
                    <a href="#journal">Journal</a>

                    <MegaMenu
                        category="ecommerce"
                        accent="#9a704b"
                        variant={1}
                    />
                </nav>
                <div className="flex gap-4 text-lg">
                    <button aria-label="Search">
                        <HiOutlineSearch />
                    </button>
                    <button aria-label="Account">
                        <HiOutlineUser />
                    </button>
                    <button aria-label="Shopping bag">
                        <HiOutlineShoppingBag />
                    </button>
                </div>
            </div>
        </header>
    )
}

import {
    HiArrowRight,
    HiOutlineMenu,
    HiOutlineShoppingBag,
} from 'react-icons/hi'
export default function Navbar05() {
    return (
        <header className="rounded-lg bg-[#f4ebe4] px-5 py-4 text-[#241f1b] dark:bg-gray-800 dark:text-white sm:px-8">
            <div className="flex items-center justify-between">
                <button aria-label="Open menu" className="text-xl md:hidden">
                    <HiOutlineMenu />
                </button>
                <a href="#home" className="font-serif text-2xl">
                    Sunday Supply
                </a>
                <nav className="hidden gap-6 text-xs md:flex">
                    <a href="#gifts">Gifts</a>
                    <a href="#home">Home</a>
                    <a href="#ritual">Ritual</a>
                </nav>
                <button
                    aria-label="Open basket"
                    className="flex items-center gap-2 text-sm"
                >
                    <HiOutlineShoppingBag />
                    <span className="hidden sm:inline">Basket · 0</span>
                    <HiArrowRight className="hidden sm:block" />
                </button>
            </div>
            <div className="mt-3 flex justify-center border-t border-black/10 pt-3 text-[10px] uppercase tracking-[.16em] md:hidden">
                A little something for someone
            </div>
        </header>
    )
}

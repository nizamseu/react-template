import { HiArrowRight, HiOutlineMenu } from 'react-icons/hi'
export default function Navbar04() {
    return (
        <header className="rounded-lg bg-[#a84f34] px-5 py-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="font-serif text-2xl">
                    Margin / Weekly
                </a>
                <nav className="order-3 flex w-full gap-5 border-t border-white/25 pt-3 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#dispatches">Dispatches</a>
                    <a href="#books">Books</a>
                    <a href="#podcasts">Podcasts</a>
                </nav>
                <div className="flex items-center gap-3">
                    <button
                        aria-label="Open menu"
                        className="text-xl md:hidden"
                    >
                        <HiOutlineMenu />
                    </button>
                    <a
                        href="#subscribe"
                        className="flex items-center gap-1 rounded-full bg-[#f3eee5] px-4 py-2 text-xs font-bold text-[#28221e]"
                    >
                        Subscribe <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

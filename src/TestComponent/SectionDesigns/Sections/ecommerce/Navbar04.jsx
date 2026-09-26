import {
    HiArrowRight,
    HiOutlineSearch,
    HiOutlineShoppingCart,
} from 'react-icons/hi'
export default function Navbar04() {
    return (
        <header className="rounded-lg bg-[#d6f36a] px-5 py-4 text-[#202315] sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a
                    href="#home"
                    className="text-2xl font-black uppercase leading-none"
                >
                    GOOD
                    <br />
                    CIRCULAR
                </a>
                <div className="order-3 flex w-full overflow-hidden rounded-full border border-[#86934a] bg-white/40 sm:order-none sm:max-w-xs">
                    <input
                        aria-label="Search products"
                        placeholder="Search pre-loved pieces"
                        className="min-w-0 flex-1 bg-transparent px-4 py-2 text-xs outline-none placeholder:text-[#555d32]"
                    />
                    <button aria-label="Search" className="px-3">
                        <HiOutlineSearch />
                    </button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <a href="#sell" className="hidden sm:block">
                        Sell with us
                    </a>
                    <a
                        href="#bag"
                        className="flex items-center gap-2 rounded-full bg-[#202315] px-4 py-2 text-xs text-white"
                    >
                        Bag <HiOutlineShoppingCart />
                    </a>
                    <a
                        href="#browse"
                        className="hidden items-center gap-1 text-xs font-bold lg:flex"
                    >
                        Browse <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

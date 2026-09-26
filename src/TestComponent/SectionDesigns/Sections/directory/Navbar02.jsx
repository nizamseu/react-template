import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
export default function Navbar02() {
    return (
        <header className="rounded-lg bg-[#d9f064] px-5 py-4 text-[#1a2826]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="text-sm font-black uppercase">
                    GOOD NEIGHBOR / INDEX
                </a>
                <div className="order-3 flex w-full items-center gap-2 rounded-full bg-white px-3 py-2 sm:order-none sm:w-auto">
                    <HiOutlineSearch className="text-[#527354]" />
                    <input
                        aria-label="Search listings"
                        placeholder="Find a local business"
                        className="min-w-0 text-xs outline-none"
                    />
                </div>
                <nav className="flex gap-4 text-xs">
                    <a href="#browse">Browse</a>
                    <a href="#list">List your business</a>
                    <HiArrowRight />
                </nav>
            </div>
        </header>
    )
}

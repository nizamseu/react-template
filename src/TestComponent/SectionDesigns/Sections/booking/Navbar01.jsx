import { HiOutlineGlobeAlt, HiOutlineUserCircle } from 'react-icons/hi'
export default function Navbar01() {
    return (
        <header className="rounded-lg bg-[#132d3a] px-5 py-4 text-white sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="font-serif text-2xl">
                    elsewhere<span className="text-[#e07d5b]">.</span>
                </a>
                <nav className="order-3 flex w-full gap-6 overflow-x-auto border-t border-white/15 pt-3 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#stays">Stays</a>
                    <a href="#experiences">Experiences</a>
                    <a href="#journal">Field notes</a>
                    <a href="#hosts">Become a host</a>
                </nav>
                <div className="flex items-center gap-4 text-sm">
                    <button aria-label="Choose language">
                        <HiOutlineGlobeAlt />
                    </button>
                    <a href="#account" aria-label="Account">
                        <HiOutlineUserCircle className="text-xl" />
                    </a>
                    <a
                        href="#search"
                        className="rounded-full bg-[#e07d5b] px-4 py-2 text-xs font-semibold"
                    >
                        Plan a stay
                    </a>
                </div>
            </div>
        </header>
    )
}

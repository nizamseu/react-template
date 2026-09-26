import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
export default function Navbar01() {
    return (
        <header className="rounded-lg bg-[#102d36] px-5 py-4 text-white sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="font-serif text-xl">
                    fieldnote<span className="text-[#c8ef70]">.</span>
                </a>
                <nav className="order-3 flex w-full gap-6 overflow-x-auto border-t border-white/15 pt-3 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#paths">Learning paths</a>
                    <a href="#courses">Courses</a>
                    <a href="#mentors">Mentors</a>
                    <a href="#community">Community</a>
                </nav>
                <div className="flex items-center gap-4">
                    <button aria-label="Search courses">
                        <HiOutlineSearch />
                    </button>
                    <a
                        href="#continue"
                        className="inline-flex items-center gap-2 rounded-full bg-[#c8ef70] px-4 py-2 text-xs font-bold text-[#102d36]"
                    >
                        My learning <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

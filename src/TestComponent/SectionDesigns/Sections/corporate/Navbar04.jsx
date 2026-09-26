import { HiArrowRight, HiOutlineMenu } from 'react-icons/hi'
export default function Navbar04() {
    return (
        <header className="rounded-lg bg-[#dce9f6] px-5 py-4 text-[#121c2c]">
            <div className="flex items-center justify-between gap-4">
                <a href="#home" className="font-semibold">
                    NORTHSTAR<span className="ml-1 text-[#3476c5]">/</span>
                </a>
                <nav className="hidden gap-6 text-xs md:flex">
                    <a href="#who">Who we are</a>
                    <a href="#work">What we do</a>
                    <a href="#impact">Impact</a>
                    <a href="#news">News</a>
                </nav>
                <div className="flex items-center gap-3">
                    <button
                        aria-label="Open menu"
                        className="text-xl md:hidden"
                    >
                        <HiOutlineMenu />
                    </button>
                    <a href="#careers" className="hidden text-xs sm:block">
                        Careers
                    </a>
                    <a
                        href="#contact"
                        className="flex items-center gap-1 rounded bg-[#121c2c] px-4 py-2 text-xs text-white"
                    >
                        Contact <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

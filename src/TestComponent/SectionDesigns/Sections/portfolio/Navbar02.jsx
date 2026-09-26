import { HiArrowRight } from 'react-icons/hi'
export default function Navbar02() {
    return (
        <header className="rounded-lg bg-[#f1e9de] px-5 py-4 text-[#241d1a]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a
                    href="#home"
                    className="text-xs font-black uppercase tracking-[.14em]"
                >
                    JAMIE PARK / DESIGN
                </a>
                <nav className="order-3 flex w-full gap-6 border-t border-[#d5c8b7] pt-3 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#work">Work</a>
                    <a href="#about">About</a>
                    <a href="#writing">Writing</a>
                </nav>
                <a
                    href="#contact"
                    className="flex items-center gap-1 text-xs font-semibold"
                >
                    Have a project? <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

import { HiArrowRight } from 'react-icons/hi'
export default function Navbar01() {
    return (
        <header className="rounded-lg bg-[#ef6a4b] px-5 py-4 text-[#241d1a] sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a
                    href="#home"
                    className="text-sm font-black uppercase tracking-[.12em]"
                >
                    JP<span className="ml-2 font-normal">/ Designer</span>
                </a>
                <nav className="order-3 flex w-full gap-6 border-t border-black/20 pt-3 text-xs uppercase sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#work">Work</a>
                    <a href="#about">About</a>
                    <a href="#notes">Notes</a>
                </nav>
                <a
                    href="#contact"
                    className="flex items-center gap-2 text-xs font-bold uppercase"
                >
                    Available for select work <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

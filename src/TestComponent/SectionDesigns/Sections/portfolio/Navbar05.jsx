import { HiArrowRight } from 'react-icons/hi'
export default function Navbar05() {
    return (
        <header className="rounded-lg bg-[#241d1a] px-5 py-4 text-[#f5eee5]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <a href="#home" className="font-serif text-xl">
                    J / P
                </a>
                <nav className="flex gap-5 overflow-x-auto text-xs text-white/60">
                    <a href="#projects">Projects</a>
                    <a href="#experiments">Experiments</a>
                    <a href="#journal">Journal</a>
                    <a href="#about">About</a>
                </nav>
                <a
                    href="#instagram"
                    className="flex items-center gap-1 self-start text-xs text-[#ef6a4b]"
                >
                    Follow along <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

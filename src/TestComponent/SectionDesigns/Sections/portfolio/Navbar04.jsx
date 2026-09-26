import { HiOutlineMenu } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar04() {
    return (
        <header className="rounded-lg border border-[#d5c8b7] bg-white px-5 py-4 text-[#241d1a]">
            <div className="flex items-center justify-between gap-4">
                <button
                    aria-label="Open portfolio menu"
                    className="text-xl md:hidden"
                >
                    <HiOutlineMenu />
                </button>
                <a href="#home" className="font-serif text-2xl">
                    Jamie Park
                </a>
                <nav className="hidden gap-7 text-xs md:flex">
                    <a href="#selected">Selected</a>
                    <a href="#archive">Archive</a>
                    <a href="#about">About</a>

                    <MegaMenu
                        category="portfolio"
                        accent="#ef6a4b"
                        variant={4}
                    />
                </nav>
                <span className="text-[10px] uppercase tracking-wide text-gray-500">
                    Available / 2026
                </span>

                <MegaMenu
                    category="portfolio"
                    accent="#ef6a4b"
                    variant={4}
                    className="md:hidden"
                />
            </div>
        </header>
    )
}

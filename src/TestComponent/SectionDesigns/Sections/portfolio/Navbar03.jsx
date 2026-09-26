import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar03() {
    return (
        <header className="rounded-lg bg-[#ef6a4b] px-5 py-4 text-[#241d1a]">
            <div className="flex items-center justify-between">
                <a href="#home" className="text-lg font-black uppercase">
                    JP
                    <span className="ml-2 text-xs font-normal">
                        Independent / Brooklyn
                    </span>
                </a>
                <nav className="hidden gap-6 text-xs uppercase md:flex">
                    <a href="#selected">Selected work</a>
                    <a href="#practice">Practice</a>
                    <a href="#notes">Notes</a>

                    <MegaMenu
                        category="portfolio"
                        accent="#ef6a4b"
                        variant={3}
                    />
                </nav>
                <a
                    href="#say-hello"
                    className="flex items-center gap-2 text-xs font-bold uppercase"
                >
                    Say hello <HiArrowRight />
                </a>

                <MegaMenu
                    category="portfolio"
                    accent="#ef6a4b"
                    variant={3}
                    className="md:hidden"
                />
            </div>
        </header>
    )
}

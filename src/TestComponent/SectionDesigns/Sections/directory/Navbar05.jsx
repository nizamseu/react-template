import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar05() {
    return (
        <header className="rounded-lg border-b border-[#d4ddd1] bg-[#edf1e6] px-5 py-4 text-[#1a2826]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <a href="#home" className="text-xl font-black">
                    GOOD / NEARBY
                </a>
                <nav className="flex gap-5 overflow-x-auto text-xs">
                    <a href="#home">Home services</a>
                    <a href="#food">Food</a>
                    <a href="#care">Care</a>
                    <a href="#creative">Creative</a>

                    <MegaMenu
                        category="directory"
                        accent="#527354"
                        variant={5}
                    />
                </nav>
                <a
                    href="#owner"
                    className="flex items-center gap-1 text-xs font-semibold"
                >
                    For business owners <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

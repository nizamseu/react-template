import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar05() {
    return (
        <header className="rounded-lg border-b border-[#d7e0da] bg-white px-5 py-4 text-[#132d3a]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <a href="#home" className="font-serif text-2xl">
                    A place, well found.
                </a>
                <nav className="flex gap-5 overflow-x-auto text-xs">
                    <a href="#coast">Coast</a>
                    <a href="#countryside">Countryside</a>
                    <a href="#city">City stays</a>
                    <a href="#host">Local hosts</a>

                    <MegaMenu category="booking" accent="#b65f47" variant={5} />
                </nav>
                <a
                    href="#availability"
                    className="flex items-center gap-1 text-xs font-semibold"
                >
                    Check dates <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

import { HiOutlineMenu } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar04() {
    return (
        <header className="rounded-lg bg-[#e5ede8] px-5 py-4 text-[#132d3a]">
            <div className="flex items-center justify-between gap-4">
                <button
                    aria-label="Open travel navigation"
                    className="text-xl md:hidden"
                >
                    <HiOutlineMenu />
                </button>
                <a
                    href="#home"
                    className="text-xs font-bold uppercase tracking-[.13em]"
                >
                    SLOW COAST / TRAVEL
                </a>
                <nav className="hidden gap-6 text-xs md:flex">
                    <a href="#guides">Guides</a>
                    <a href="#stays">Places to stay</a>
                    <a href="#experiences">Experiences</a>

                    <MegaMenu category="booking" accent="#b65f47" variant={4} />
                </nav>
                <a
                    href="#trip"
                    className="rounded-full bg-[#132d3a] px-4 py-2 text-xs text-white"
                >
                    Plan a trip
                </a>

                <MegaMenu
                    category="booking"
                    accent="#b65f47"
                    variant={4}
                    className="md:hidden"
                />
            </div>
        </header>
    )
}

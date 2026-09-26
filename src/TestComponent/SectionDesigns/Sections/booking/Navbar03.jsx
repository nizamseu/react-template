import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar03() {
    return (
        <header className="rounded-lg border border-[#d7e0da] bg-[#f8f5ef] px-5 py-3 text-[#132d3a]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="font-serif text-xl">
                    Elsewhere / Places
                </a>
                <div className="order-3 flex w-full items-center gap-2 rounded-full border border-[#d7e0da] bg-white px-3 py-2 sm:order-none sm:w-auto">
                    <HiOutlineSearch className="text-[#346a62]" />
                    <input
                        aria-label="Search by destination"
                        placeholder="Search by destination"
                        className="min-w-0 text-xs outline-none"
                    />
                </div>
                <a href="#saved" className="flex items-center gap-2 text-xs">
                    Saved <HiArrowRight />
                </a>
                <MegaMenu category="booking" accent="#b65f47" variant={3} />
            </div>
        </header>
    )
}

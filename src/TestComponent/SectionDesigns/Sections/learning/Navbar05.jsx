import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar05() {
    return (
        <header className="rounded-lg bg-[#102d36] px-5 py-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="font-serif text-xl">
                    fieldnote / mentors
                </a>
                <div className="order-3 flex w-full justify-between border-t border-white/15 pt-3 text-xs text-white/60 sm:order-none sm:w-auto sm:justify-start sm:gap-6 sm:border-0 sm:pt-0">
                    <a href="#people">People</a>
                    <a href="#disciplines">Disciplines</a>
                    <a href="#sessions">Sessions</a>
                </div>
                <a
                    href="#mentor"
                    className="flex items-center gap-2 rounded-md bg-[#c8ef70] px-4 py-2 text-xs font-bold text-[#102d36]"
                >
                    Find a mentor <HiArrowRight />
                </a>
                <MegaMenu category="learning" accent="#95c77b" variant={5} />
            </div>
        </header>
    )
}

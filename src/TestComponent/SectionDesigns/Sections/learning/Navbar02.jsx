import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-b border-[#dce5dc] bg-[#f5f1e8] px-5 py-4 text-[#102d36] sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-serif text-2xl font-bold tracking-tight shrink-0">
                    FIELDNOTE CLASS
                </a>

                {/* Right-Flush Navigation & Student Portal Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="learning"
                            accent="#3c7e5d"
                            variant={2}
                            label="Live Studio"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#3c7e5d] hover:text-[#102d36] transition-colors cursor-pointer"
                        />
                        <a href="#workshops" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                            Workshops
                        </a>
                        <a href="#syllabus" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                            Syllabus Index
                        </a>
                        <a href="#mentors" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                            Mentorship
                        </a>
                    </nav>

                    <a
                        href="#portal"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#102d36] px-4 py-1.5 text-xs font-semibold text-[#102d36] hover:bg-[#102d36] hover:text-white transition-colors shrink-0"
                    >
                        <span>Student Portal</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-b-2 border-[#a34c38] bg-[#fcf8f5] px-5 py-4 text-[#2c1d18] sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-mono text-sm font-black uppercase tracking-wider shrink-0">
                    COMMONROOM <span className="text-[#a34c38]">&bull; CITY</span>
                </a>

                {/* Right-Flush Navigation & RSVP Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="community"
                            accent="#a34c38"
                            variant={2}
                            label="City Chapters"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#a34c38] hover:text-[#2c1d18] transition-colors cursor-pointer"
                        />
                        <a href="#meetups" className="text-[#2c1d18]/70 hover:text-[#2c1d18] transition-colors">
                            Upcoming Meetups
                        </a>
                        <a href="#host" className="text-[#2c1d18]/70 hover:text-[#2c1d18] transition-colors">
                            Host Chapter
                        </a>
                        <a href="#grants" className="text-[#2c1d18]/70 hover:text-[#2c1d18] transition-colors">
                            Event Grants
                        </a>
                    </nav>

                    <a
                        href="#rsvp"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#a34c38] px-4 py-1.5 text-xs font-bold text-[#a34c38] hover:bg-[#a34c38] hover:text-white transition-colors shrink-0"
                    >
                        <span>RSVP Pass</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-b border-[#d1e2d7] bg-[#f4f8f5] px-5 py-3.5 text-[#162720] sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#docs" className="font-serif text-lg font-bold shrink-0">
                    FIELDGUIDE <span className="font-sans text-xs font-normal text-[#41715d]">/ HELP</span>
                </a>

                {/* Right-Flush Navigation & Ask Support Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="knowledge"
                            accent="#41715d"
                            variant={2}
                            label="Instant Answers"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#41715d] hover:text-[#162720] transition-colors cursor-pointer"
                        />
                        <a href="#troubleshooting" className="text-[#162720]/75 hover:text-[#162720] transition-colors">
                            Troubleshooting
                        </a>
                        <a href="#architecture" className="text-[#162720]/75 hover:text-[#162720] transition-colors">
                            Architecture
                        </a>
                        <a href="#status" className="text-[#162720]/75 hover:text-[#162720] transition-colors">
                            System Status
                        </a>
                    </nav>

                    <a
                        href="#ask-support"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#41715d] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#162720] transition-colors shrink-0"
                    >
                        <span>Ask Support</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

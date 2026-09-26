import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-b border-[#d8e2e6] bg-[#f7f5f0] px-5 py-4 text-[#1c2c34] sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-serif text-2xl font-bold tracking-tight shrink-0">
                    ELSEWHERE <span className="text-[#b65f47]">/ DESTINATIONS</span>
                </a>

                {/* Right-Flush Navigation & Reserve Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-medium md:flex">
                        <MegaMenu
                            category="booking"
                            accent="#b65f47"
                            variant={2}
                            label="Destination Finder"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#b65f47] hover:text-[#1c2c34] transition-colors cursor-pointer"
                        />
                        <a href="#typology" className="hover:text-[#b65f47] transition-colors">
                            Typologies
                        </a>
                        <a href="#experiences" className="hover:text-[#b65f47] transition-colors">
                            Experiences
                        </a>
                        <a href="#private-key" className="hover:text-[#b65f47] transition-colors">
                            Private Key
                        </a>
                    </nav>

                    <a
                        href="#reserve"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#b65f47] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-[#1c2c34] transition-colors shrink-0"
                    >
                        <span>Reserve Villa</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

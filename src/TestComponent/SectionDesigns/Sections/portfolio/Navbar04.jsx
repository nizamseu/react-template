import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="py-2 px-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-[#ef6a4b]/30 bg-[#241d1a] px-6 py-2.5 text-white shadow-xl backdrop-blur-md">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-serif text-lg font-bold tracking-tight shrink-0"
                >
                    Jamie Park
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-medium md:flex">
                    <MegaMenu
                        category="portfolio"
                        accent="#ef6a4b"
                        variant={4}
                        label="Services & Retainers"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#ef6a4b] hover:text-white transition-colors cursor-pointer"
                    />
                    <a href="#selected" className="text-white/70 hover:text-white transition-colors">
                        Selected Cases
                    </a>
                    <a href="#retainers" className="text-white/70 hover:text-white transition-colors">
                        Sprint Retainers
                    </a>
                    <a href="#press" className="text-white/70 hover:text-white transition-colors">
                        Monographs
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#book-call"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#ef6a4b] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#241d1a] transition-colors shrink-0"
                >
                    <span>Book Discovery</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

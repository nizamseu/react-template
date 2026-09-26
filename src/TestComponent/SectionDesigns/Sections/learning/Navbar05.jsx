import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-white/20 bg-[#102d36] text-white">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_200px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/20">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg tracking-tight">
                        FIELDNOTE <span className="font-mono text-xs text-[#c8ef70]">/ MENTOR</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/50">COHORT 08</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="learning"
                            accent="#c8ef70"
                            variant={5}
                            label="Mentorship Residency"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#c8ef70] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#roster" className="text-white/70 hover:text-white transition-colors">
                            1-on-1 Crits
                        </a>
                        <a href="#guest" className="text-white/70 hover:text-white transition-colors">
                            Guest Directors
                        </a>
                        <a href="#outcomes" className="text-white/70 hover:text-white transition-colors">
                            Placement
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#c8ef70]">
                        12 STUDENTS PER COHORT
                    </span>
                </div>

                {/* Column 3: Admissions Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span className="text-[#c8ef70]">3 SPOTS REMAIN</span>
                    <a
                        href="#apply-residency"
                        className="flex items-center gap-1 text-white hover:text-[#c8ef70] transition-colors"
                    >
                        <span>APPLY &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

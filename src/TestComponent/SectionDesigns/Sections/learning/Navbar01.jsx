import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b border-white/10 bg-[#0e272f] px-5 py-4 text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="font-serif text-2xl font-bold tracking-tight shrink-0">
                        fieldnote<span className="text-[#c8ef70]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="learning"
                            accent="#c8ef70"
                            variant={1}
                            label="Curriculum Tracks"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#c8ef70] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#cohorts" className="text-white/80 hover:text-white transition-colors">
                            Live Cohorts
                        </a>
                        <a href="#faculty" className="text-white/80 hover:text-white transition-colors">
                            Faculty
                        </a>
                        <a href="#tuition" className="text-white/80 hover:text-white transition-colors">
                            Tuition & Aid
                        </a>
                    </nav>
                </div>

                {/* Right Status & Application CTA */}
                <div className="flex items-center gap-4">
                    <span className="hidden lg:inline-flex items-center gap-2 rounded-full bg-[#1b3e49] px-3 py-1 font-mono text-[10px] text-[#c8ef70]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#c8ef70] animate-pulse" />
                        Next Cohort: Oct 15
                    </span>
                    <a
                        href="#apply"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#c8ef70] px-4 py-2 font-mono text-xs font-black uppercase text-[#0e272f] hover:bg-white transition-colors"
                    >
                        <span>Apply Now</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

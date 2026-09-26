import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="py-2 px-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-black/10 bg-[#c8ef70] px-6 py-2.5 text-[#102d36] shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-black uppercase tracking-[.2em] shrink-0"
                >
                    LEARN<span className="text-[#3c7e5d]">/</span>LAB
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wider md:flex">
                    <MegaMenu
                        category="learning"
                        accent="#102d36"
                        variant={4}
                        label="Experiment Lab"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#102d36] hover:opacity-75 transition-opacity cursor-pointer"
                    />
                    <a href="#sandbox" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                        Sandboxes
                    </a>
                    <a href="#challenges" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                        Weekly Crits
                    </a>
                    <a href="#shaders" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                        GLSL Shaders
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#enroll"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#102d36] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-black transition-colors shrink-0"
                >
                    <span>Enroll (4 Left)</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

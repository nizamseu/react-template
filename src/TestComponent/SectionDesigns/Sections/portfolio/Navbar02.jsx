import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-b border-white/20 bg-[#111111] px-5 py-3.5 text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a
                    href="#home"
                    className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#ef6a4b] shrink-0"
                >
                    JP / KINETIC LAB
                </a>

                {/* Right-Flush Navigation & Reel Action Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 font-mono text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0 md:flex">
                        <MegaMenu
                            category="portfolio"
                            accent="#ef6a4b"
                            variant={2}
                            label="Shader Laboratory"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#ef6a4b] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#experiments" className="text-white/70 hover:text-white transition-colors">
                            Experiments
                        </a>
                        <a href="#shaders" className="text-white/70 hover:text-white transition-colors">
                            GLSL Shaders
                        </a>
                        <a href="#source" className="text-white/70 hover:text-white transition-colors">
                            Source
                        </a>
                    </nav>

                    <a
                        href="#reel"
                        className="inline-flex items-center gap-1.5 rounded-none border border-[#ef6a4b] px-3.5 py-1.5 font-mono text-xs font-bold text-[#ef6a4b] hover:bg-[#ef6a4b] hover:text-black transition-colors shrink-0"
                    >
                        <span>Launch Reel</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

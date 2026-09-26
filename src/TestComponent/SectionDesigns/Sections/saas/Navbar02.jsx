import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-b border-[#263640] bg-[#0e161c] px-5 py-3.5 text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-mono text-sm font-bold tracking-tight shrink-0 flex items-center gap-2">
                    <span className="text-[#65e6b4]">&gt;_</span>
                    <span>signal<span className="text-[#65e6b4]">.dev</span></span>
                </a>

                {/* Right-Flush Navigation & Console Login Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 font-mono text-xs text-white/75 md:flex">
                        <MegaMenu
                            category="saas"
                            accent="#65e6b4"
                            variant={2}
                            label="Developers & API"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#65e6b4] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#docs" className="hover:text-white transition-colors">
                            Documentation
                        </a>
                        <a href="#benchmarks" className="hover:text-white transition-colors">
                            Benchmarks
                        </a>
                        <a href="#status" className="hover:text-white transition-colors">
                            Status
                        </a>
                    </nav>

                    <a
                        href="#console"
                        className="inline-flex items-center gap-1.5 rounded border border-[#65e6b4] px-3.5 py-1.5 font-mono text-xs font-bold text-[#65e6b4] hover:bg-[#65e6b4] hover:text-[#0e161c] transition-colors shrink-0"
                    >
                        <span>Console Login</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

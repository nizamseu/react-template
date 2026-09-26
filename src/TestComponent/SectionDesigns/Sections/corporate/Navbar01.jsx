import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b border-white/10 bg-[#0e1724] px-5 py-4 text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="text-sm font-bold tracking-[.18em] shrink-0">
                        NORTHSTAR<span className="text-[#84b9ff]">/</span>ADVISORY
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-medium text-white/75 md:flex">
                        <MegaMenu
                            category="corporate"
                            accent="#84b9ff"
                            variant={1}
                            label="Advisory Practices"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#84b9ff] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#capabilities" className="hover:text-white transition-colors">
                            Capabilities
                        </a>
                        <a href="#case-studies" className="hover:text-white transition-colors">
                            Case Studies
                        </a>
                        <a href="#partners" className="hover:text-white transition-colors">
                            Senior Partners
                        </a>
                    </nav>
                </div>

                {/* Right Client Portal & Consultation Action */}
                <div className="flex items-center gap-5">
                    <a href="#portal" className="hidden sm:inline font-mono text-xs text-white/60 hover:text-white transition-colors">
                        Client Portal
                    </a>
                    <a
                        href="#consultation"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#84b9ff] px-4 py-2 font-mono text-xs font-bold text-[#0e1724] hover:bg-white transition-colors"
                    >
                        <span>Schedule Advisory</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

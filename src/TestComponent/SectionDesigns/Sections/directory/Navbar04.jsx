import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="py-2 px-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[#1a2826] px-6 py-2.5 text-white shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-black uppercase tracking-[.18em] shrink-0"
                >
                    LOCAL<span className="text-[#d9f064]">/</span>LIST
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs text-white/70 md:flex">
                    <MegaMenu
                        category="directory"
                        accent="#d9f064"
                        variant={4}
                        label="Creative Studios"
                        triggerClassName="inline-flex items-center gap-1 text-xs text-[#d9f064] hover:text-white transition-colors cursor-pointer"
                    />
                    <a href="#agencies" className="hover:text-white transition-colors">
                        Design Agencies
                    </a>
                    <a href="#architects" className="hover:text-white transition-colors">
                        Architects
                    </a>
                    <a href="#workshops" className="hover:text-white transition-colors">
                        Craft Guilds
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#agency-index"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#d9f064] px-4 py-1.5 font-mono text-xs font-bold text-[#1a2826] hover:bg-white transition-colors shrink-0"
                >
                    <span>Studio Index</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

import { HiOutlineCode } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="py-2 px-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-[#cde0d3] bg-[#e8f0eb] px-6 py-2.5 text-[#17231f] shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-bold uppercase tracking-[.18em] shrink-0"
                >
                    HANDBOOK<span className="text-[#41715d]">/</span>TEAM
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-semibold md:flex">
                    <MegaMenu
                        category="knowledge"
                        accent="#41715d"
                        variant={4}
                        label="Cookbook Recipes"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#41715d] hover:text-black transition-colors cursor-pointer"
                    />
                    <a href="#standards" className="text-[#17231f]/75 hover:text-[#17231f] transition-colors">
                        Engineering Standards
                    </a>
                    <a href="#onboarding" className="text-[#17231f]/75 hover:text-[#17231f] transition-colors">
                        Day-One Setup
                    </a>
                    <a href="#ci-cd" className="text-[#17231f]/75 hover:text-[#17231f] transition-colors">
                        CI/CD Pipelines
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#git-clone"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#17231f] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#41715d] transition-colors shrink-0"
                >
                    <HiOutlineCode />
                    <span>Clone Template</span>
                </a>
            </div>
        </header>
    )
}

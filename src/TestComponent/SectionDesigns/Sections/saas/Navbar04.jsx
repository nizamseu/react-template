import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="py-2 px-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-black/10 bg-[#edf3ee] px-6 py-2.5 text-[#111a22] shadow-xl backdrop-blur-md">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-bold uppercase tracking-[.18em] shrink-0"
                >
                    FLOWSTATE<span className="text-[#17a878]">/</span>AI
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-semibold md:flex">
                    <MegaMenu
                        category="saas"
                        accent="#17a878"
                        variant={4}
                        label="AI Command Center"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#17a878] hover:text-black transition-colors cursor-pointer"
                    />
                    <a href="#models" className="text-gray-600 hover:text-black transition-colors">
                        Model Router
                    </a>
                    <a href="#evals" className="text-gray-600 hover:text-black transition-colors">
                        Live Evals
                    </a>
                    <a href="#agents" className="text-gray-600 hover:text-black transition-colors">
                        Agent Mesh
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#sandbox"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#111a22] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#17a878] transition-colors shrink-0"
                >
                    <span>Launch Sandbox</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

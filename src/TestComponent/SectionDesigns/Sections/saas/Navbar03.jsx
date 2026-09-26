import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y border-[#263640] bg-[#111a22] text-white shadow-lg">
            {/* Top Micro-Ticker */}
            <div className="border-b border-[#263640] px-5 py-1.5 font-mono text-[10px] text-white/50 flex items-center justify-between sm:px-8">
                <span>NORTHSTAR GLOBAL EDGE MESH &bull; 142 LOCATIONS WORLDWIDE</span>
                <span className="hidden sm:inline">SOC2 TYPE II &bull; HIPAA &bull; ISO 27001 AUDITED</span>
                <span className="text-[#65e6b4]">ALL SYSTEMS NORMAL</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="text-xl sm:text-2xl font-bold tracking-tight">
                    NORTHSTAR ENTERPRISE PLATFORM
                </a>
                <a
                    href="#talk-architect"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#65e6b4] hover:underline"
                >
                    <span>Contact Solutions Architect &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-[#263640] bg-[#0c1318] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="saas"
                            accent="#65e6b4"
                            variant={3}
                            label="Solutions Matrix"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#65e6b4] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#pipelines" className="text-white/70 hover:text-white transition-colors">
                            Real-Time Data Pipelines
                        </a>
                        <a href="#security" className="text-white/70 hover:text-white transition-colors">
                            Zero-Trust Mesh
                        </a>
                        <a href="#serverless" className="text-white/70 hover:text-white transition-colors">
                            Edge Functions
                        </a>
                        <a href="#sla" className="text-white/70 hover:text-white transition-colors">
                            99.999% SLA
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 hidden lg:inline">
                        ENTERPRISE TIER
                    </span>
                </nav>
            </div>
        </header>
    )
}

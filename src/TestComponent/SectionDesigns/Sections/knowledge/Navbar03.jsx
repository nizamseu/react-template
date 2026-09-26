import { HiArrowRight, HiOutlineCode } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y border-[#41715d]/30 bg-[#121f1a] text-white shadow-xl">
            {/* Top Micro-Ticker */}
            <div className="border-b border-white/10 px-5 py-1.5 font-mono text-[10px] text-[#9bd2a7] flex items-center justify-between sm:px-8">
                <span>OPENAPI 3.1 SPECIFICATION &bull; REST &bull; GRAPHQL &bull; GRPC SCHEMAS</span>
                <span className="hidden sm:inline">OFFICIAL SDKS FOR TYPESCRIPT, PYTHON, GO, RUST</span>
                <span className="text-white/60">KERNEL v4.12</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a
                    href="#home"
                    className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider text-white"
                >
                    <HiOutlineCode className="text-lg text-[#9bd2a7]" />
                    <span>NORTHSTAR DEVELOPER KNOWLEDGE BASE & KERNEL</span>
                </a>
                <a
                    href="#api-keys"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#9bd2a7] hover:underline"
                >
                    <span>Manage API Keys &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-white/10 bg-[#0e1713] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="knowledge"
                            accent="#9bd2a7"
                            variant={3}
                            label="Trust Architecture"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#9bd2a7] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#idempotency" className="text-white/70 hover:text-white transition-colors">
                            Idempotency Keys
                        </a>
                        <a href="#rate-limits" className="text-white/70 hover:text-white transition-colors">
                            Rate Limit Algorithms
                        </a>
                        <a href="#webhooks" className="text-white/70 hover:text-white transition-colors">
                            Signed Webhooks
                        </a>
                        <a href="#benchmarks" className="text-white/70 hover:text-white transition-colors">
                            RPC Benchmarks
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 hidden lg:inline">
                        PRODUCTION GRADE
                    </span>
                </nav>
            </div>
        </header>
    )
}

import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-[#263640] bg-[#17232c] text-white">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#263640]">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-mono text-sm font-bold tracking-tight">
                        SIGNAL <span className="text-[#65e6b4]">/ STACK</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/50">v4.18</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="saas"
                            accent="#65e6b4"
                            variant={5}
                            label="Integrations"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#65e6b4] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#kafka" className="text-white/70 hover:text-white transition-colors">
                            Kafka Bus
                        </a>
                        <a href="#postgres" className="text-white/70 hover:text-white transition-colors">
                            Distributed PG
                        </a>
                        <a href="#otel" className="text-white/70 hover:text-white transition-colors">
                            OpenTelemetry
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#65e6b4]">
                        ZERO EGRESS FEES
                    </span>
                </div>

                {/* Column 3: Live Telemetry Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs">14ms P99</span>
                    </div>
                    <a
                        href="#docs"
                        className="flex items-center gap-1 text-[#65e6b4] hover:underline"
                    >
                        <span>CONSOLE &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

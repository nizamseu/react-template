import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-[#41715d] bg-[#172721] text-[#e0eee6]">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#41715d]/40">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#docs" className="font-mono text-xs font-bold uppercase tracking-[.18em] text-white">
                        NORTHSTAR <span className="text-[#9bd2a7]">/ RUNTIME</span>
                    </a>
                    <span className="font-mono text-[10px] text-[#9bd2a7]">KERNEL</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="knowledge"
                            accent="#41715d"
                            variant={5}
                            label="Support Escalation"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#9bd2a7] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#error-codes" className="text-white/70 hover:text-white transition-colors">
                            Error Codes (5xx)
                        </a>
                        <a href="#diagnostics" className="text-white/70 hover:text-white transition-colors">
                            Trace Diagnostics
                        </a>
                        <a href="#pagerduty" className="text-white/70 hover:text-white transition-colors">
                            PagerDuty Sync
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#9bd2a7]">
                        99.999% SLA MONITOR
                    </span>
                </div>

                {/* Column 3: Live Incident Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>OPERATIONAL</span>
                    </div>
                    <a
                        href="#escalate"
                        className="flex items-center gap-1 text-[#9bd2a7] hover:underline"
                    >
                        <span>P1 PAGER &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

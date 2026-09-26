import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b border-gray-200 bg-white px-5 py-3.5 text-[#111a22] dark:border-gray-800 dark:bg-[#0b1319] dark:text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#workspace"
                        className="font-bold tracking-tight text-sm shrink-0 flex items-center gap-1.5"
                    >
                        <span className="h-2 w-2 rounded-full bg-[#17a878]" />
                        <span>northstar<span className="text-[#17a878]">/</span></span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="saas"
                            accent="#17a878"
                            variant={1}
                            label="Platform Suite"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#17a878] hover:text-[#111a22] dark:hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#solutions" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            Solutions
                        </a>
                        <a href="#changelog" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            Changelog
                        </a>
                        <a href="#pricing" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            Pricing
                        </a>
                    </nav>
                </div>

                {/* Right Status & Deploy CTA */}
                <div className="flex items-center gap-5">
                    <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] text-gray-500 dark:text-white/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        99.994% Uptime
                    </span>
                    <a
                        href="#deploy"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#17a878] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                    >
                        <span>Deploy Free</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

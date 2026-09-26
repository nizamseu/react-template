import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar01() {
    return (
        <header className="rounded-none border-b border-white/10 bg-[#102530] px-5 py-4 text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="font-serif text-2xl tracking-tight shrink-0">
                        elsewhere<span className="text-[#e07d5b]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0 md:flex">
                        <MegaMenu
                            category="booking"
                            accent="#e07d5b"
                            variant={1}
                            label="Architectural Stays"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#e07d5b] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#sanctuaries" className="text-white/80 hover:text-white transition-colors">
                            Sanctuaries
                        </a>
                        <a href="#journal" className="text-white/80 hover:text-white transition-colors">
                            Field Journal
                        </a>
                        <a href="#membership" className="text-white/80 hover:text-white transition-colors">
                            Membership
                        </a>
                    </nav>
                </div>

                {/* Right Concierge & Check Availability */}
                <div className="flex items-center gap-5">
                    <span className="hidden sm:inline font-mono text-xs text-white/50">
                        CONCIERGE ON CALL
                    </span>
                    <a
                        href="#availability"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#e07d5b] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#102530] transition-colors"
                    >
                        <span>Check Availability</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

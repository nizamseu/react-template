import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-y-2 border-[#191919] bg-[#191919] px-5 py-3.5 text-[#e0e0e0] sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-serif text-2xl font-bold tracking-widest text-white shrink-0">
                    MARGIN / BROADCAST
                </a>

                {/* Right-Flush Navigation & Subscriber Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-6 text-[11px] font-mono uppercase tracking-[.15em] md:flex">
                        <MegaMenu
                            category="media"
                            accent="#e7a37c"
                            variant={2}
                            label="Broadcast Audio"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[.15em] text-[#e7a37c] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#episodes" className="hover:text-white transition-colors">
                            Episodes (48)
                        </a>
                        <a href="#transcripts" className="hover:text-white transition-colors">
                            Transcripts
                        </a>
                        <a href="#patron" className="hover:text-white transition-colors">
                            Patron Feed
                        </a>
                    </nav>

                    <a
                        href="#subscribe"
                        className="inline-flex items-center gap-1.5 rounded-none border border-[#e7a37c] px-3.5 py-1.5 font-mono text-xs font-bold text-[#e7a37c] hover:bg-[#e7a37c] hover:text-[#191919] transition-colors shrink-0"
                    >
                        <span>Listen Live</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

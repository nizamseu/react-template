import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="py-2 px-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-[#a34c38] bg-[#291f1b] px-6 py-2.5 text-white shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-black uppercase tracking-[.18em] shrink-0"
                >
                    COMMON<span className="text-[#ffccad]">/</span>Q&A
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-semibold md:flex">
                    <MegaMenu
                        category="community"
                        accent="#ffccad"
                        variant={4}
                        label="Peer Q&A"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#ffccad] hover:text-white transition-colors cursor-pointer"
                    />
                    <a href="#unanswered" className="text-white/70 hover:text-white transition-colors">
                        Unanswered (14)
                    </a>
                    <a href="#bounties" className="text-white/70 hover:text-white transition-colors">
                        Active Bounties
                    </a>
                    <a href="#karma" className="text-white/70 hover:text-white transition-colors">
                        Leaderboard
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#ask"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#ffccad] px-4 py-1.5 font-mono text-xs font-bold text-[#291f1b] hover:bg-white transition-colors shrink-0"
                >
                    <span>Ask Question</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

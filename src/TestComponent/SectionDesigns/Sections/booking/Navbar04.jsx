import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="py-2 px-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-[#c8d8cf] bg-[#e5ede8] px-6 py-2.5 text-[#132d3a] shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-bold uppercase tracking-[.18em] shrink-0"
                >
                    SLOW COAST <span className="text-[#b65f47]">/</span> TRAVEL
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-semibold md:flex">
                    <MegaMenu
                        category="booking"
                        accent="#b65f47"
                        variant={4}
                        label="Host Experiences"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#b65f47] hover:text-[#132d3a] transition-colors cursor-pointer"
                    />
                    <a href="#workshops" className="text-[#132d3a]/75 hover:text-[#132d3a] transition-colors">
                        Craft Workshops
                    </a>
                    <a href="#foraging" className="text-[#132d3a]/75 hover:text-[#132d3a] transition-colors">
                        Alpine Foraging
                    </a>
                    <a href="#hosts" className="text-[#132d3a]/75 hover:text-[#132d3a] transition-colors">
                        Meet Hosts
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#host-stay"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#132d3a] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#b65f47] transition-colors shrink-0"
                >
                    <span>Host a Stay</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

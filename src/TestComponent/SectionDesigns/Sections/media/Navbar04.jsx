import { HiOutlineRss } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="py-2 px-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-black/10 bg-[#a84f34] px-6 py-2.5 text-white shadow-xl">
                {/* Micro Brand */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    <a
                        href="#home"
                        className="font-serif text-lg font-bold tracking-tight"
                    >
                        Margin <span className="font-sans text-xs uppercase tracking-widest font-normal opacity-80">/ Wire</span>
                    </a>
                </div>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-medium md:flex">
                    <MegaMenu
                        category="media"
                        accent="#ffffff"
                        variant={4}
                        label="Live Wire Feed"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-bold text-white hover:opacity-80 transition-opacity cursor-pointer"
                    />
                    <a href="#breaking" className="text-white/80 hover:text-white transition-colors">
                        Dispatches
                    </a>
                    <a href="#fieldnotes" className="text-white/80 hover:text-white transition-colors">
                        Field Transcripts
                    </a>
                    <a href="#dossiers" className="text-white/80 hover:text-white transition-colors">
                        Investigations
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#rss"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#a84f34] hover:bg-black hover:text-white transition-colors shrink-0"
                >
                    <HiOutlineRss />
                    <span>Live RSS</span>
                </a>
            </div>
        </header>
    )
}

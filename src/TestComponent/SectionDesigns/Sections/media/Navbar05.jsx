import { HiOutlineBookOpen } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-[#443e39] bg-[#1a1816] text-[#e8e4df]">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_200px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#443e39]">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-xl tracking-widest text-white">
                        MARGIN <span className="font-mono text-xs text-[#e7a37c]">FOLIO</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/40">NO. 018</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="media"
                            accent="#e7a37c"
                            variant={5}
                            label="Visual Folios"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#e7a37c] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#photography" className="text-white/70 hover:text-white transition-colors">
                            Photo Essays
                        </a>
                        <a href="#documentary" className="text-white/70 hover:text-white transition-colors">
                            Documentary
                        </a>
                        <a href="#interviews" className="text-white/70 hover:text-white transition-colors">
                            Interviews
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#e7a37c]">
                        PRINTED ARCHIVE
                    </span>
                </div>

                {/* Column 3: Print Edition status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span>1,000 COPIES</span>
                    <a
                        href="#order-print"
                        className="flex items-center gap-1 text-[#e7a37c] hover:underline"
                    >
                        <HiOutlineBookOpen />
                        <span>ORDER &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

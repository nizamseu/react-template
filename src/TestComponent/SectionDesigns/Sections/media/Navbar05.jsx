import { HiArrowRight } from 'react-icons/hi'
export default function Navbar05() {
    return (
        <header className="rounded-lg bg-[#28221e] px-5 py-4 text-[#f3eee5]">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center justify-between">
                    <a href="#home" className="font-serif text-2xl">
                        MARGIN
                    </a>
                    <span className="text-[10px] text-white/45 md:hidden">
                        VOL. 018
                    </span>
                </div>
                <nav className="flex gap-6 overflow-x-auto text-xs text-white/65">
                    <a href="#latest">Latest</a>
                    <a href="#longreads">Long reads</a>
                    <a href="#audio">Audio</a>
                    <a href="#newsletter">Newsletter</a>
                </nav>
                <a
                    href="#support"
                    className="inline-flex items-center gap-2 self-start text-xs text-[#e7a37c]"
                >
                    Support independent media <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

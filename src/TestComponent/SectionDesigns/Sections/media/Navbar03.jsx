import { HiArrowRight } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar03() {
    return (
        <header className="rounded-lg bg-[#28221e] px-5 py-4 text-[#f3eee5]">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <div className="flex items-center gap-3 justify-self-start">
                    <a
                        href="#menu"
                        className="text-xs uppercase tracking-widest"
                    >
                        Menu
                    </a>
                    <MegaMenu category="media" accent="#c57a56" variant={3} />
                </div>
                <a href="#home" className="font-serif text-xl">
                    The Sunday Paper
                </a>
                <a
                    href="#join"
                    className="flex items-center gap-1 justify-self-end text-xs"
                >
                    Join <HiArrowRight />
                </a>
            </div>
            <p className="mt-3 border-t border-white/15 pt-3 text-center text-[9px] uppercase tracking-[.2em] text-white/45">
                Independent stories for a curious life
            </p>
        </header>
    )
}

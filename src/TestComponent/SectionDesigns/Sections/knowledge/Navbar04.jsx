import { HiArrowRight, HiOutlineMenu } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="rounded-lg bg-[#e8f0eb] px-5 py-4 text-[#17231f]">
            <div className="flex items-center justify-between gap-4">
                <a href="#handbook" className="font-semibold">
                    handbook<span className="text-[#41715d]">/</span>team
                </a>
                <nav className="hidden gap-6 text-xs md:flex">
                    <a href="#people">People</a>
                    <a href="#how-we-work">How we work</a>
                    <a href="#policies">Policies</a>
                    <a href="#tools">Tools</a>

                    <MegaMenu
                        category="knowledge"
                        accent="#41715d"
                        variant={4}
                    />
                </nav>
                <div className="flex items-center gap-3">
                    <button
                        aria-label="Open handbook menu"
                        className="text-xl md:hidden"
                    >
                        <HiOutlineMenu />
                    </button>
                    <a
                        href="#contribute"
                        className="inline-flex items-center gap-1 rounded-full bg-[#17231f] px-4 py-2 text-xs text-white"
                    >
                        Add knowledge <HiArrowRight />
                    </a>
                </div>

                <MegaMenu
                    category="knowledge"
                    accent="#41715d"
                    variant={4}
                    className="md:hidden"
                />
            </div>
        </header>
    )
}

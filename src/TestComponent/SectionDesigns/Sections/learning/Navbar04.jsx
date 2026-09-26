import { HiArrowRight, HiOutlineMenu } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar04() {
    return (
        <header className="rounded-lg bg-[#c8ef70] px-5 py-4 text-[#102d36]">
            <div className="flex items-center justify-between gap-4">
                <a href="#home" className="text-lg font-black uppercase">
                    LEARN / LAB
                </a>
                <nav className="hidden gap-7 text-xs font-semibold md:flex">
                    <a href="#skills">Skills</a>
                    <a href="#projects">Projects</a>
                    <a href="#guides">Guides</a>
                    <a href="#events">Events</a>

                    <MegaMenu
                        category="learning"
                        accent="#3c7e5d"
                        variant={4}
                    />
                </nav>
                <div className="flex items-center gap-3">
                    <button
                        aria-label="Open navigation"
                        className="text-xl md:hidden"
                    >
                        <HiOutlineMenu />
                    </button>
                    <a
                        href="#join"
                        className="flex items-center gap-2 rounded-full bg-[#102d36] px-4 py-2 text-xs text-white"
                    >
                        Join a workshop <HiArrowRight />
                    </a>
                </div>

                <MegaMenu
                    category="learning"
                    accent="#3c7e5d"
                    variant={4}
                    className="md:hidden"
                />
            </div>
        </header>
    )
}

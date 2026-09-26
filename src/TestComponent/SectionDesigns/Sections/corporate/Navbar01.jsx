import { HiArrowRight, HiOutlineMenu } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar01() {
    return (
        <header className="rounded-lg bg-[#121c2c] px-5 py-4 text-white sm:px-8">
            <div className="flex items-center justify-between gap-4">
                <a href="#home" className="text-sm font-bold tracking-[.12em]">
                    NORTHSTAR<span className="text-[#84b9ff]">/</span>
                </a>
                <nav className="hidden gap-7 text-xs text-white/70 md:flex">
                    <a href="#services">What we do</a>
                    <a href="#work">Our work</a>
                    <a href="#people">People</a>
                    <a href="#insights">Insights</a>

                    <MegaMenu
                        category="corporate"
                        accent="#3476c5"
                        variant={1}
                    />
                </nav>
                <div className="flex items-center gap-4">
                    <button
                        aria-label="Open menu"
                        className="text-xl md:hidden"
                    >
                        <HiOutlineMenu />
                    </button>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 border-b border-[#84b9ff] pb-1 text-xs"
                    >
                        Let&apos;s talk <HiArrowRight />
                    </a>
                </div>

                <MegaMenu
                    category="corporate"
                    accent="#3476c5"
                    variant={1}
                    className="md:hidden"
                />
            </div>
        </header>
    )
}

import { HiArrowRight, HiOutlineMenu } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar04() {
    return (
        <header className="rounded-lg bg-[#edf3ee] px-5 py-4 text-[#111a22]">
            <div className="flex items-center justify-between gap-4">
                <a
                    href="#home"
                    className="text-sm font-bold uppercase tracking-[.12em]"
                >
                    FLOWSTATE / AI
                </a>
                <nav className="hidden gap-7 text-xs md:flex">
                    <a href="#product">Product</a>
                    <a href="#use-cases">Use cases</a>
                    <a href="#resources">Resources</a>
                    <a href="#company">Company</a>

                    <MegaMenu category="saas" accent="#17a878" variant={4} />
                </nav>
                <div className="flex items-center gap-3">
                    <a href="#signin" className="hidden text-xs sm:block">
                        Sign in
                    </a>
                    <button
                        aria-label="Open menu"
                        className="text-xl md:hidden"
                    >
                        <HiOutlineMenu />
                    </button>
                    <a
                        href="#demo"
                        className="flex items-center gap-2 rounded-md bg-[#111a22] px-4 py-2 text-xs text-white"
                    >
                        Book a demo <HiArrowRight />
                    </a>
                </div>

                <MegaMenu
                    category="saas"
                    accent="#17a878"
                    variant={4}
                    className="md:hidden"
                />
            </div>
        </header>
    )
}

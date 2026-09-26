import { HiOutlineShoppingBag } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar02() {
    return (
        <header className="rounded-none border-2 border-white/20 bg-[#181614] px-5 py-3.5 text-white sm:px-8">
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a
                    href="#home"
                    className="font-mono text-xs font-black uppercase tracking-[.2em] shrink-0"
                >
                    MATERIAL<span className="text-[#d6f36a]">/</span>MATTERS <span className="hidden sm:inline text-[10px] text-white/40 ml-2">[FW26]</span>
                </a>

                {/* Right-Flush Navigation & Cart Action Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-mono text-white/75 md:flex">
                        <MegaMenu
                            category="ecommerce"
                            accent="#d6f36a"
                            variant={2}
                            label="Department Archive"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#d6f36a] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#shop" className="hover:text-white transition-colors">
                            Shop All
                        </a>
                        <a href="#circular" className="hover:text-white transition-colors">
                            Circular Trade
                        </a>
                        <a href="#studio" className="hover:text-white transition-colors">
                            Atelier Lab
                        </a>
                    </nav>

                    <a
                        href="#bag"
                        aria-label="Open shopping bag"
                        className="flex items-center gap-2 rounded-none border border-[#d6f36a] bg-[#d6f36a] px-3.5 py-1.5 font-mono text-xs font-bold text-[#181614] hover:bg-white hover:border-white transition-colors shrink-0"
                    >
                        <span>BAG [3] $420</span>
                        <HiOutlineShoppingBag className="text-sm" />
                    </a>
                </div>
            </div>

            {/* Mobile Nav */}
            <nav className="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5 font-mono text-xs text-white/70 md:hidden">
                <MegaMenu
                    category="ecommerce"
                    accent="#d6f36a"
                    variant={2}
                    label="Department Archive"
                    triggerClassName="inline-flex items-center gap-1 font-mono text-xs text-[#d6f36a]"
                />
                <a href="#shop">Shop</a>
                <a href="#circular">Circular</a>
            </nav>
        </header>
    )
}

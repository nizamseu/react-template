import { HiOutlineSearch, HiOutlineShoppingCart } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar04() {
    return (
        <header className="py-2 px-3">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[#1c1f13] px-6 py-2.5 text-[#d6f36a] shadow-2xl backdrop-blur-md">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-black uppercase tracking-[.2em] shrink-0 hover:text-white transition-colors"
                >
                    CIRCULAR<span className="text-white">/</span>HUB
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-mono uppercase tracking-wider md:flex">
                    <MegaMenu
                        category="ecommerce"
                        accent="#d6f36a"
                        variant={4}
                        label="Pre-Loved Market"
                        triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#d6f36a] hover:text-white transition-colors cursor-pointer"
                    />
                    <a href="#drops" className="text-white/70 hover:text-white transition-colors">
                        Drops (06)
                    </a>
                    <a href="#trade" className="text-white/70 hover:text-white transition-colors">
                        Instant Buyback
                    </a>
                    <a href="#verified" className="text-white/70 hover:text-white transition-colors">
                        Verified Auth
                    </a>
                </nav>

                {/* Search & Cart Pill Action */}
                <div className="flex items-center gap-3">
                    <button
                        aria-label="Search verified inventory"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        <HiOutlineSearch className="text-sm" />
                    </button>
                    <a
                        href="#cart"
                        className="flex items-center gap-2 rounded-full bg-[#d6f36a] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1c1f13] hover:bg-white transition-colors"
                    >
                        <HiOutlineShoppingCart className="text-sm" />
                        <span>CART ($84)</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

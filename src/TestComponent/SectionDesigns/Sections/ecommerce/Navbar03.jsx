import { HiOutlineSearch, HiOutlineShoppingBag } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar03() {
    return (
        <header className="rounded-none border-y border-[#e8e4dc] bg-[#faf9f6] text-[#1e1c1a] dark:border-gray-800 dark:bg-gray-900 dark:text-white">
            {/* Top Micro-Ticker */}
            <div className="border-b border-[#e8e4dc]/70 px-5 py-1.5 text-[10px] font-mono tracking-widest text-[#766b5e] dark:border-gray-800 flex items-center justify-between sm:px-8">
                <span>PARIS & KYOTO &bull; S/S 2026 SALON</span>
                <span className="hidden sm:inline">COMPLIMENTARY WORLDWIDE COURIER OVER $200</span>
                <span>CURRENCY: USD ($)</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 text-center sm:px-8 flex items-center justify-between">
                <span className="text-[10px] font-serif uppercase tracking-[.25em] text-[#766b5e] hidden sm:block">
                    EST. 2018
                </span>
                <a
                    href="#home"
                    className="font-serif text-3xl font-light tracking-widest uppercase hover:opacity-80 transition-opacity mx-auto sm:mx-0"
                >
                    Maison D&apos;Or
                </a>
                <div className="flex items-center gap-4 text-sm">
                    <button aria-label="Search collection" className="hover:opacity-60 transition-opacity">
                        <HiOutlineSearch className="text-base" />
                    </button>
                    <button
                        aria-label="Shopping bag"
                        className="flex items-center gap-1.5 hover:opacity-60 transition-opacity text-xs font-serif"
                    >
                        <HiOutlineShoppingBag className="text-base" />
                        <span className="hidden sm:inline">Bag (1)</span>
                    </button>
                </div>
            </div>

            {/* Bottom Shelf Navigation - Authentic Broadsheet Shelf */}
            <div className="border-t border-[#e8e4dc] px-5 py-2.5 dark:border-gray-800 sm:px-8">
                <nav className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[.18em]">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="ecommerce"
                            accent="#9a704b"
                            variant={3}
                            label="Maison Atelier"
                            triggerClassName="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[.18em] text-[#9a704b] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#living" className="text-[#1e1c1a]/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors">
                            Objects of Living
                        </a>
                        <a href="#wear" className="text-[#1e1c1a]/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors">
                            Linen Wear
                        </a>
                        <a href="#ceramics" className="text-[#1e1c1a]/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors">
                            Sculptural Ceramics
                        </a>
                        <a href="#archive" className="text-[#1e1c1a]/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors">
                            Vault Archive
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-[#766b5e] hidden lg:inline">
                        SPRING SALON OPEN
                    </span>
                </nav>
            </div>
        </header>
    )
}

import { HiOutlineShoppingBag } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'

export default function Navbar05() {
    return (
        <header className="rounded-none border-2 border-[#241f1b] bg-[#f4ebe4] text-[#241f1b] dark:border-white/20 dark:bg-[#1a1715] dark:text-white">
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_180px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#241f1b] dark:divide-white/20">
                {/* Column 1: Monospace Index & Brand */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg font-black tracking-tight">
                        SUNDAY SUPPLY
                    </a>
                    <span className="font-mono text-[10px] text-[#9a704b] font-bold">
                        VOL. 05
                    </span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="ecommerce"
                            accent="#9a704b"
                            variant={5}
                            label="Artisan Provisions"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#9a704b] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#provisions" className="hover:text-[#9a704b] transition-colors">
                            Ceramics
                        </a>
                        <a href="#woodwork" className="hover:text-[#9a704b] transition-colors">
                            Woodcraft
                        </a>
                        <a href="#textiles" className="hover:text-[#9a704b] transition-colors">
                            Textiles
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-black/50 dark:text-white/50">
                        SMALL BATCH ONLY
                    </span>
                </div>

                {/* Column 3: Cart status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span>CART: [0]</span>
                    <a
                        href="#checkout"
                        className="flex items-center gap-1.5 text-[#9a704b] hover:underline"
                    >
                        <span>CHECKOUT &rarr;</span>
                        <HiOutlineShoppingBag />
                    </a>
                </div>
            </div>
        </header>
    )
}

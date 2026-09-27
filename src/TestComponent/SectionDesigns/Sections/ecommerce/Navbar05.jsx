// SundaySupplyLedgerGridNavbar

// Navbar05 · E-commerce & Marketplaces › Navbars

// Description:
// Bordered three-column "ledger" header for "SUNDAY SUPPLY" (VOL. 05), an artisan goods
// shop: a brand column, a nav strip (the "Artisan Provisions" mega menu, Ceramics,
// Woodcraft, Textiles and a "SMALL BATCH ONLY" tag) and a cart column showing "CART: [0]"
// with a "CHECKOUT →" link.

// Design:
// - CSS grid: one column with horizontal dividers (divide-y-2) on mobile, then
//   md:grid-cols-[220px_1fr_180px] with vertical dividers (md:divide-x-2).
// - #f4ebe4 background, #241f1b text, border and dividers, #9a704b accent. Dark mode:
//   #1a1715 background, white text, white/20 border and dividers.
// - Serif font-black brand text-lg; mono uppercase text-xs nav and cart; border-2 square
//   shell (rounded-none); checkout link underlines on hover.
// - The nav strip scrolls horizontally when narrow (overflow-x-auto); the "SMALL BATCH
//   ONLY" tag appears from lg.

// What it does:
// - Renders MegaMenu (category "ecommerce", variant 5, "Artisan Provisions", accent
//   #9a704b): opens on click or focus, closes on pointer leave (about 160ms), blur or
//   Escape, and shows the Sunday Supply artisan market panel below the header.
// - Anchors #home, #provisions (labelled "Ceramics"), #woodwork, #textiles and #checkout;
//   the cart count is static text. No content props, no local state.
// - Its mega menu panel is SundaySupplyArtisanProvisionsMegaMenu in MegaMenus/ecommerce/MegaMenu05.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SundaySupplyLedgerGridNavbar from '@/TestComponent/SectionDesigns/Sections/ecommerce/Navbar05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SundaySupplyLedgerGridNavbar />
//     </main>
// )
// ```

'use client'

import { HiOutlineShoppingBag } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function SundaySupplyLedgerGridNavbar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <header
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-none border-2 border-[#241f1b] bg-[#f4ebe4] text-[#241f1b] dark:border-white/20 dark:bg-[#1a1715] dark:text-white',
                className,
            )}
            {...props}
        >
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

export default SundaySupplyLedgerGridNavbar

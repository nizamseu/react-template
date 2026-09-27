// MaisonDOrThreeTierCoutureNavbar

// Navbar03 · E-commerce & Marketplaces › Navbars

// Description:
// Luxury three-tier masthead for "Maison D'Or" (Paris & Kyoto S/S 2026 Salon). A
// micro-ticker (salon, complimentary worldwide courier over $200, currency USD), a
// masthead row with "EST. 2018", the serif brand, search and "Bag (1)", and a shelf nav
// with the "Maison Atelier" mega menu plus Objects of Living, Linen Wear, Sculptural
// Ceramics, Vault Archive and a "SPRING SALON OPEN" tag.

// Design:
// - Three stacked rows separated by borders: ticker (flex justify-between), masthead
//   (EST label · brand · icons) and shelf nav (links left, tag right).
// - #faf9f6 background, #1e1c1a text, #e8e4dc borders, #766b5e muted, #9a704b accent on the
//   mega trigger. Dark mode: gray-900 background, gray-800 borders, white text (links
//   white/70).
// - Serif uppercase brand text-3xl font-light tracking-widest; mono text-[10px] ticker;
//   shelf links text-[11px] semibold uppercase tracking-[.18em]; square border-y shell.
// - Below sm the courier notice, "EST. 2018" and the "Bag (1)" label are hidden and the
//   brand centres (mx-auto); shelf links scroll horizontally (overflow-x-auto); the
//   "SPRING SALON OPEN" tag appears from lg.

// What it does:
// - Renders MegaMenu (category "ecommerce", variant 3, "Maison Atelier", accent #9a704b):
//   opens on click or focus, closes on pointer leave (about 160ms), blur or Escape, and
//   shows a haute-couture panel (numbered collections, personal styling) below the header.
// - Anchors #home, #living, #wear, #ceramics, #archive; search and bag are buttons with
//   aria-labels but no handlers. No content props, no local state.
// - Its mega menu panel is MaisonHauteCoutureAtelierMegaMenu in MegaMenus/ecommerce/MegaMenu03.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MaisonDOrThreeTierCoutureNavbar from '@/TestComponent/SectionDesigns/Sections/ecommerce/Navbar03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MaisonDOrThreeTierCoutureNavbar />
//     </main>
// )
// ```

'use client'

import { HiOutlineSearch, HiOutlineShoppingBag } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function MaisonDOrThreeTierCoutureNavbar({
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
                'rounded-none border-y border-[#e8e4dc] bg-[#faf9f6] text-[#1e1c1a] dark:border-gray-800 dark:bg-gray-900 dark:text-white',
                className,
            )}
            {...props}
        >
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

export default MaisonDOrThreeTierCoutureNavbar

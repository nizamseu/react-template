// MaterialMattersBrutalistDarkNavbar

// Navbar02 · E-commerce & Marketplaces › Navbars

// Description:
// Dark monospace header for the "MATERIAL/MATTERS [FW26]" store. The brand sits far left;
// on the right are the nav (a "Department Archive" mega menu, Shop All, Circular Trade,
// Atelier Lab) and a lime "BAG [3] $420" button. On mobile a second row shows the mega
// menu trigger plus short Shop and Circular links.

// Design:
// - flex justify-between row with the right group pushed by ml-auto (gap-8); a separate
//   mobile nav row below with border-t white/15.
// - Always dark: #181614 background, white text (white/75, white/70, white/40), lime
//   accent #d6f36a for the brand slash, mega trigger and bag; border-2 border-white/20.
// - Mono uppercase type: brand text-xs font-black tracking-[.2em]; square corners
//   (rounded-none) everywhere; the bag inverts to white on hover.
// - Desktop nav shown from md; the mobile nav row is md:hidden; the "[FW26]" tag is
//   hidden below sm; padding px-5 → sm:px-8.

// What it does:
// - Renders MegaMenu (category "ecommerce", variant 2, "Department Archive", accent
//   #d6f36a) twice, once in the desktop nav and once in the mobile row; each opens on
//   click or focus and closes on pointer leave (about 160ms), blur or Escape, showing the
//   neo-brutalist archive panel portalled below the header.
// - Anchors #home, #shop, #circular, #studio and #bag (aria-label "Open shopping bag").
//   No content props, no local state.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MaterialMattersBrutalistDarkNavbar from '@/TestComponent/SectionDesigns/Sections/ecommerce/Navbar02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MaterialMattersBrutalistDarkNavbar />
//     </main>
// )
// ```

'use client'

import { HiOutlineShoppingBag } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function MaterialMattersBrutalistDarkNavbar({
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
                'rounded-none border-2 border-white/20 bg-[#181614] px-5 py-3.5 text-white sm:px-8',
                className,
            )}
            {...props}
        >
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

export default MaterialMattersBrutalistDarkNavbar

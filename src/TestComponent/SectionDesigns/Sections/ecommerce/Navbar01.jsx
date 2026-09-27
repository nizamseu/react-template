// GoodformEditorialShopNavbar

// Navbar01 · E-commerce & Marketplaces › Navbars

// Description:
// Light editorial storefront header for "goodform." with the brand and left-aligned
// navigation (a "Lookbook Drop" mega menu, New Arrivals, Objects, Makers, Journal) and
// right-side actions: Search, Account and a pill "Bag (2)" button.

// Design:
// - Single flex row (justify-between): brand + nav grouped on the left (gap-10), actions on
//   the right (gap-5).
// - #f3eee6 background, #1c1b19 text, #9a704b accent (brand dot and link hover), #766b5e
//   search label, border-b black/10. Dark mode: #1f1d1b background, white text, and the bag
//   pill inverts to white with #1c1b19 text.
// - Serif bold brand text-2xl; nav text-xs font-semibold; rounded-full dark bag pill;
//   square header (rounded-none).
// - The nav links are hidden below md with no mobile menu replacement; the "Search" label
//   is hidden below sm (icon only); padding px-5 → sm:px-8.

// What it does:
// - Renders MegaMenu (category "ecommerce", variant 1, label "Lookbook Drop", accent
//   #9a704b): opens on trigger click or keyboard focus, closes about 160ms after the
//   pointer leaves, on blur or on Escape; the panel (editorial lookbook with a campaign
//   banner and department columns) is portalled to document.body and pinned flush under
//   this header.
// - Anchors #home, #new, #objects, #makers, #journal; Search, Account and Bag are buttons
//   with aria-labels but no handlers. No content props, no local state.
// - Its mega menu panel is EditorialLookbookDropMegaMenu in MegaMenus/ecommerce/MegaMenu01.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GoodformEditorialShopNavbar from '@/TestComponent/SectionDesigns/Sections/ecommerce/Navbar01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <GoodformEditorialShopNavbar />
//     </main>
// )
// ```

'use client'

import {
    HiOutlineSearch,
    HiOutlineShoppingBag,
    HiOutlineUser,
} from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function GoodformEditorialShopNavbar({
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
                'rounded-none border-b border-black/10 bg-[#f3eee6] px-5 py-4 text-[#1c1b19] dark:bg-[#1f1d1b] dark:text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="font-serif text-2xl font-bold tracking-tight shrink-0">
                        goodform<span className="text-[#9a704b]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="ecommerce"
                            accent="#9a704b"
                            variant={1}
                            label="Lookbook Drop"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#1c1b19] dark:text-white hover:text-[#9a704b] transition-colors cursor-pointer"
                        />
                        <a href="#new" className="hover:text-[#9a704b] transition-colors">
                            New Arrivals
                        </a>
                        <a href="#objects" className="hover:text-[#9a704b] transition-colors">
                            Objects
                        </a>
                        <a href="#makers" className="hover:text-[#9a704b] transition-colors">
                            Makers
                        </a>
                        <a href="#journal" className="hover:text-[#9a704b] transition-colors">
                            Journal
                        </a>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-5 text-sm">
                    <button aria-label="Search" className="flex items-center gap-2 text-xs font-medium text-[#766b5e] hover:text-black dark:hover:text-white transition-colors">
                        <HiOutlineSearch className="text-base" />
                        <span className="hidden sm:inline">Search</span>
                    </button>
                    <button aria-label="Account" className="hover:opacity-70 transition-opacity">
                        <HiOutlineUser className="text-base" />
                    </button>
                    <button
                        aria-label="Shopping bag"
                        className="relative flex items-center gap-1.5 rounded-full bg-[#1c1b19] px-3.5 py-1.5 text-xs font-bold text-white dark:bg-white dark:text-[#1c1b19] hover:opacity-85 transition-opacity"
                    >
                        <HiOutlineShoppingBag className="text-sm" />
                        <span>Bag (2)</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default GoodformEditorialShopNavbar

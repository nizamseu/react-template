// CircularHubFloatingPillNavbar

// Navbar04 · E-commerce & Marketplaces › Navbars

// Description:
// Floating capsule header for the "CIRCULAR/HUB" pre-loved and resale marketplace: the
// brand, a "Pre-Loved Market" mega menu, Drops (06), Instant Buyback and Verified Auth
// links, a round search button and a lime "CART ($84)" pill.

// Design:
// - Outer header with py-2 px-3; inner bar centred at max-w-5xl, rounded-full, flex
//   justify-between.
// - Dark olive #1c1f13 bar with lime #d6f36a text and accent, white highlights (white/70,
//   white/10), border white/10, shadow-2xl and backdrop-blur-md; no dark-mode variants.
// - Mono uppercase type: brand text-xs font-black tracking-[.2em], nav text-xs
//   tracking-wider; round h-8 w-8 search button; rounded-full cart pill that turns white on
//   hover.
// - The nav links are hidden below md with no mobile alternative; brand, search and cart
//   stay visible.

// What it does:
// - Renders MegaMenu (category "ecommerce", variant 4, "Pre-Loved Market", accent
//   #d6f36a): opens on click or focus, closes on pointer leave (about 160ms), blur or
//   Escape, and shows a circular-resale panel (impact banner, flash drop, trade-in box)
//   flush under the header.
// - Anchors #home, #drops, #trade, #verified, #cart; the search button has an aria-label
//   but no handler. No content props, no local state.
// - Its mega menu panel is CircularPreLovedMarketMegaMenu in MegaMenus/ecommerce/MegaMenu04.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CircularHubFloatingPillNavbar from '@/TestComponent/SectionDesigns/Sections/ecommerce/Navbar04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CircularHubFloatingPillNavbar />
//     </main>
// )
// ```

'use client'

import { HiOutlineSearch, HiOutlineShoppingCart } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function CircularHubFloatingPillNavbar({
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
            className={cn('py-2 px-3', className)}
            {...props}
        >
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

export default CircularHubFloatingPillNavbar

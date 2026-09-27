// DestinationFinderNavbar

// Navbar02 · Booking & Reservations › Navbars

// Description:
// A light, editorial header for "ELSEWHERE / DESTINATIONS". The wordmark sits
// far left; a right-aligned group holds a "Destination Finder" MegaMenu,
// links to Typologies, Experiences and Private Key, and a "Reserve Villa" button.

// Design:
// - Flex row: brand on the left, nav + CTA pushed right with ml-auto
// - Warm paper #f7f5f0 background, ink #1c2c34 text, rust #b65f47 accent
//   (wordmark suffix, MegaMenu trigger, link hover, CTA which hovers to
//   #1c2c34), #d8e2e6 bottom border
// - Serif text-2xl bold wordmark, text-xs medium links, mono bold CTA in a
//   rounded-lg button; square header corners (rounded-none)
// - Nav links are hidden below md with no mobile replacement; the CTA stays
//   visible; padding px-5 → sm:px-8

// What it does:
// - No content props or state of its own; renders MegaMenu (category "booking",
//   variant 2, accent #b65f47) whose trigger opens the destination-search
//   panel (read-only where / when / guests widget) on click or keyboard
//   focus; portaled below the header, it closes on mouse-leave/blur after
//   160ms or on Escape
// - Anchors: wordmark → #home, #typology, #experiences, #private-key;
//   "Reserve Villa" (HiArrowRight) → #reserve
// - Its mega menu panel is DestinationFinderMegaMenu in MegaMenus/booking/MegaMenu02.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DestinationFinderNavbar from '@/TestComponent/SectionDesigns/Sections/booking/Navbar02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DestinationFinderNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function DestinationFinderNavbar({
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
                'rounded-none border-b border-[#d8e2e6] bg-[#f7f5f0] px-5 py-4 text-[#1c2c34] sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-serif text-2xl font-bold tracking-tight shrink-0">
                    ELSEWHERE <span className="text-[#b65f47]">/ DESTINATIONS</span>
                </a>

                {/* Right-Flush Navigation & Reserve Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-medium md:flex">
                        <MegaMenu
                            category="booking"
                            accent="#b65f47"
                            variant={2}
                            label="Destination Finder"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#b65f47] hover:text-[#1c2c34] transition-colors cursor-pointer"
                        />
                        <a href="#typology" className="hover:text-[#b65f47] transition-colors">
                            Typologies
                        </a>
                        <a href="#experiences" className="hover:text-[#b65f47] transition-colors">
                            Experiences
                        </a>
                        <a href="#private-key" className="hover:text-[#b65f47] transition-colors">
                            Private Key
                        </a>
                    </nav>

                    <a
                        href="#reserve"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#b65f47] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-[#1c2c34] transition-colors shrink-0"
                    >
                        <span>Reserve Villa</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default DestinationFinderNavbar

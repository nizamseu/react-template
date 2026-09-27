// ResidencesThreeTierMastheadNavbar

// Navbar03 · Booking & Reservations › Navbars

// Description:
// A newspaper-style, three-tier header for "Elsewhere Residences &
// Sanctuaries": a mono micro-ticker (carbon-neutral residences, 48 sanctuaries,
// EST. 2019), a masthead with the wordmark and a "Membership Portfolio" link,
// and a shelf of stay-typology links led by a "Stays by Typology" MegaMenu.

// Design:
// - Three stacked rows: ticker (flex, justify-between), masthead row and a
//   bottom nav shelf, separated by black/10 rules
// - Cream #f8f5ef header and #f0ece1 bottom shelf, deep teal #132d3a text,
//   rust #b65f47 accent (membership link, MegaMenu trigger), black/50-70
//   muted text, #d8e2e6 top/bottom border and shadow-sm
// - Mono text-[10px] ticker and tag, serif text-2xl → sm:text-3xl bold
//   wordmark, text-xs semibold nav; square corners (rounded-none)
// - Middle ticker item and "Membership Portfolio" are hidden below sm,
//   "SCOUTED & VERIFIED" below lg; the link row stays visible on mobile and
//   scrolls horizontally (overflow-x-auto)

// What it does:
// - No content props or state of its own; renders MegaMenu (category "booking",
//   variant 3, accent #b65f47) whose trigger opens the "Stays by Design
//   Philosophy" panel on click or keyboard focus; portaled below the header,
//   it closes on mouse-leave/blur after 160ms or on Escape
// - Anchors: wordmark → #home, #membership, #mid-century, #wilderness,
//   #bastions, #overwater

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ResidencesThreeTierMastheadNavbar from '@/TestComponent/SectionDesigns/Sections/booking/Navbar03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ResidencesThreeTierMastheadNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function ResidencesThreeTierMastheadNavbar({
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
                'rounded-none border-y border-[#d8e2e6] bg-[#f8f5ef] text-[#132d3a] shadow-sm',
                className,
            )}
            {...props}
        >
            {/* Top Micro-Ticker */}
            <div className="border-b border-black/10 px-5 py-1.5 font-mono text-[10px] text-black/60 flex items-center justify-between sm:px-8">
                <span>100% CARBON-NEUTRAL ARCHITECTURAL RESIDENCES &bull; PRIVATE CHEF ON DEMAND</span>
                <span className="hidden sm:inline">48 PRIVATELY OWNED SANCTUARIES WORLDWIDE</span>
                <span>EST. 2019</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    Elsewhere Residences & Sanctuaries
                </a>
                <a
                    href="#membership"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#b65f47] hover:underline"
                >
                    <span>Membership Portfolio &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-black/10 bg-[#f0ece1] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="booking"
                            accent="#b65f47"
                            variant={3}
                            label="Stays by Typology"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#b65f47] hover:text-[#132d3a] transition-colors cursor-pointer"
                        />
                        <a href="#mid-century" className="text-black/70 hover:text-black transition-colors">
                            Mid-Century Modern
                        </a>
                        <a href="#wilderness" className="text-black/70 hover:text-black transition-colors">
                            Wilderness Cabins
                        </a>
                        <a href="#bastions" className="text-black/70 hover:text-black transition-colors">
                            Historic Bastions
                        </a>
                        <a href="#overwater" className="text-black/70 hover:text-black transition-colors">
                            Overwater Pods
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-black/50 hidden lg:inline">
                        SCOUTED & VERIFIED
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default ResidencesThreeTierMastheadNavbar

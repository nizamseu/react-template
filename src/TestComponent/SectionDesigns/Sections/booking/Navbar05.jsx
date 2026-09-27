// FlashWeekendDealsGridNavbar

// Navbar05 · Booking & Reservations › Navbars

// Description:
// A bold, brutalist header for "ELSEWHERE / FLASH" weekend deals. Three
// bordered cells hold the wordmark with a WEEKEND tag, a mono nav strip
// ("Weekend Escapes" MegaMenu, 35% Off Deals, Secret Season, Under 2h Drive)
// and an "ENDS IN 14H" notice with a "BOOK →" link.

// Design:
// - Grid: 1 column on mobile with divide-y-2, md:grid-cols-[240px_1fr_220px]
//   with divide-x-2 vertical rules in #e07d5b at 40%
// - Near-black teal #0e1d24 background, #dae6ec text, white wordmark and
//   white/70 links, coral #e07d5b border-2 and accents
// - Serif text-lg bold wordmark with a mono suffix, mono uppercase
//   tracking-wider text-xs nav, mono bold status cell; square corners
// - Cells stack below md; the nav cell is always visible and scrolls
//   horizontally; "LIMITED TIME DISCOUNTS" is hidden below lg

// What it does:
// - No content props or state of its own; renders MegaMenu (category "booking",
//   variant 5, accent #e07d5b) whose trigger opens the "Save Up to 35% on
//   Unbooked Dates" panel on click or keyboard focus; portaled below the
//   header, it closes on mouse-leave/blur after 160ms or on Escape.
//   "ENDS IN 14H" is static text
// - Anchors: wordmark → #home, #deals, #unbooked (Secret Season), #drives,
//   "BOOK →" → #instant-book

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FlashWeekendDealsGridNavbar from '@/TestComponent/SectionDesigns/Sections/booking/Navbar05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <FlashWeekendDealsGridNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FlashWeekendDealsGridNavbar({
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
                'rounded-none border-2 border-[#e07d5b] bg-[#0e1d24] text-[#dae6ec]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#e07d5b]/40">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg font-bold tracking-tight text-white">
                        ELSEWHERE <span className="font-mono text-xs font-normal text-[#e07d5b]">/ FLASH</span>
                    </a>
                    <span className="font-mono text-[10px] text-[#e07d5b]">WEEKEND</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="booking"
                            accent="#e07d5b"
                            variant={5}
                            label="Weekend Escapes"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#e07d5b] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#deals" className="text-white/70 hover:text-white transition-colors">
                            35% Off Deals
                        </a>
                        <a href="#unbooked" className="text-white/70 hover:text-white transition-colors">
                            Secret Season
                        </a>
                        <a href="#drives" className="text-white/70 hover:text-white transition-colors">
                            Under 2h Drive
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#e07d5b]">
                        LIMITED TIME DISCOUNTS
                    </span>
                </div>

                {/* Column 3: Expiration status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span className="text-[#e07d5b]">ENDS IN 14H</span>
                    <a
                        href="#instant-book"
                        className="flex items-center gap-1 text-white hover:text-[#e07d5b] transition-colors"
                    >
                        <span>BOOK &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default FlashWeekendDealsGridNavbar

// ArchitecturalStaysConciergeNavbar

// Navbar01 · Booking & Reservations › Navbars

// Description:
// A dark header for the "elsewhere." sanctuary-stays brand. The wordmark sits
// left next to a nav group led by an "Architectural Stays" MegaMenu trigger
// plus Sanctuaries, Field Journal and Membership links; the right side shows
// a "CONCIERGE ON CALL" label and a "Check Availability" pill button.

// Design:
// - Single flex row, justify-between: brand + nav grouped on the left,
//   concierge label + CTA on the right
// - Deep teal #102530 background, white text with white/80 links and a
//   white/50 concierge label, coral #e07d5b logo dot, MegaMenu trigger and
//   CTA (CTA hovers to white with #102530 text), white/10 bottom border
// - Serif text-2xl wordmark, text-xs links, mono bold CTA in a rounded-full
//   pill; square header corners (rounded-none)
// - Nav links are hidden below md with no mobile menu to replace them; the
//   concierge label is hidden below sm; padding px-5 → sm:px-8

// What it does:
// - No content props or state of its own; renders MegaMenu (category "booking",
//   variant 1, accent #e07d5b) whose trigger opens the "Rare Stays Designed
//   to Stay with You" sanctuaries panel on click or keyboard focus; the panel
//   is portaled to document.body below the header, stays open while hovered
//   and closes on mouse-leave/blur (160ms delay) or Escape
// - Anchors: logo → #home, #sanctuaries, #journal, #membership;
//   "Check Availability" (HiArrowRight) → #availability
// - Its mega menu panel is ArchitecturalStaysMegaMenu in MegaMenus/booking/MegaMenu01.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ArchitecturalStaysConciergeNavbar from '@/TestComponent/SectionDesigns/Sections/booking/Navbar01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ArchitecturalStaysConciergeNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function ArchitecturalStaysConciergeNavbar({
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
                'rounded-none border-b border-white/10 bg-[#102530] px-5 py-4 text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="font-serif text-2xl tracking-tight shrink-0">
                        elsewhere<span className="text-[#e07d5b]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0 md:flex">
                        <MegaMenu
                            category="booking"
                            accent="#e07d5b"
                            variant={1}
                            label="Architectural Stays"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#e07d5b] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#sanctuaries" className="text-white/80 hover:text-white transition-colors">
                            Sanctuaries
                        </a>
                        <a href="#journal" className="text-white/80 hover:text-white transition-colors">
                            Field Journal
                        </a>
                        <a href="#membership" className="text-white/80 hover:text-white transition-colors">
                            Membership
                        </a>
                    </nav>
                </div>

                {/* Right Concierge & Check Availability */}
                <div className="flex items-center gap-5">
                    <span className="hidden sm:inline font-mono text-xs text-white/50">
                        CONCIERGE ON CALL
                    </span>
                    <a
                        href="#availability"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#e07d5b] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#102530] transition-colors"
                    >
                        <span>Check Availability</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default ArchitecturalStaysConciergeNavbar

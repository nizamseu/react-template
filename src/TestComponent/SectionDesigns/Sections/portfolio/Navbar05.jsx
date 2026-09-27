// ContactSheetGridNavbar

// Navbar05 · Portfolios & Personal Websites › Navbars

// Description:
// Dark, three-cell grid header for "JAMIE PARK / WORK": an index cell with the
// brand and year 2026, a nav strip with a "Visual Notes" mega menu, links to
// Brand Systems, Interactive Art and Exhibitions plus a "TOKYO & STOCKHOLM"
// tag, and a status cell reading "1 COMMISSION LEFT" with an "INQUIRE →" link.

// Design:
// - CSS grid: one column on mobile, md:grid-cols-[240px_1fr_220px] from md,
//   with 2px white/20 dividers (divide-y-2 on mobile, divide-x-2 from md).
// - Dark palette: #181412 background, text #e3deda, coral #ef6a4b accents,
//   muted white/50-70 links, border-2 white/20.
// - Serif brand with tracking-widest; mono uppercase xs nav and status text;
//   square corners (rounded-none).
// - Below md the three cells stack into rows; the nav strip scrolls
//   horizontally (overflow-x-auto); the location tag appears only from lg.

// What it does:
// - No content props or local state; "Visual Notes" is a MegaMenu (category
//   "portfolio", variant 5) that toggles on click or keyboard focus, closes on
//   pointer leave (160ms), blur or Escape, and portals a "Forms, Light & Found
//   Typography" photo contact-sheet panel below the header.
// - Anchors: brand → #home, #systems, #interactive, #exhibitions;
//   "INQUIRE →" → #inquire.
// - Its mega menu panel is VisualNotesMegaMenu in MegaMenus/portfolio/MegaMenu05.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ContactSheetGridNavbar from '@/TestComponent/SectionDesigns/Sections/portfolio/Navbar05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ContactSheetGridNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function ContactSheetGridNavbar({
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
                'rounded-none border-2 border-white/20 bg-[#181412] text-[#e3deda]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/20">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg tracking-widest text-white">
                        JAMIE PARK <span className="font-mono text-xs text-[#ef6a4b]">/ WORK</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/50">2026</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="portfolio"
                            accent="#ef6a4b"
                            variant={5}
                            label="Visual Notes"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#ef6a4b] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#systems" className="text-white/70 hover:text-white transition-colors">
                            Brand Systems
                        </a>
                        <a href="#interactive" className="text-white/70 hover:text-white transition-colors">
                            Interactive Art
                        </a>
                        <a href="#exhibitions" className="text-white/70 hover:text-white transition-colors">
                            Exhibitions
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#ef6a4b]">
                        TOKYO & STOCKHOLM
                    </span>
                </div>

                {/* Column 3: Commissions Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span className="text-[#ef6a4b]">1 COMMISSION LEFT</span>
                    <a
                        href="#inquire"
                        className="flex items-center gap-1 text-white hover:text-[#ef6a4b] transition-colors"
                    >
                        <span>INQUIRE &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default ContactSheetGridNavbar

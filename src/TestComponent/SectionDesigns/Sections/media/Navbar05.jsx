// FolioPrintEditionGridNavbar

// Navbar05 · Blogs & Digital Media › Navbars

// Description:
// A dark, ruled three-column header for "MARGIN FOLIO", a photography and
// art-book imprint. It shows the wordmark and issue "NO. 018", a strip with
// a "Visual Folios" mega menu and links to Photo Essays, Documentary and
// Interviews, and a print-run panel ("1,000 COPIES") with an "ORDER" link.

// Design:
// - Grid `md:grid-cols-[240px_1fr_200px]` with 2px dividers between cells:
//   brand cell, navigation cell, print-order cell
// - Dark archival palette: background #1a1816, text #e8e4df (links white/70
//   → white on hover), border and dividers #443e39, peach accent #e7a37c
// - Serif text-xl wide-tracked wordmark with a monospace "FOLIO" tag;
//   monospace xs uppercase nav; square corners with a 2px outer border
// - Below md the three cells stack as rows with horizontal dividers (vertical
//   dividers from md); the nav stays visible and scrolls horizontally
//   (overflow-x-auto); "PRINTED ARCHIVE" shows only from lg

// What it does:
// - Renders `MegaMenu` (category "media", variant 5, label "Visual
//   Folios"): opens on click or keyboard focus, stays open while hovered,
//   closes 160ms after the pointer leaves, on blur, or on Escape. The panel
//   is portalled to document.body, fixed just below this header at its
//   width, and shows a dark art-book menu of photographic folios
// - Plain anchor links: `#home`, `#photography`, `#documentary`,
//   `#interviews`, `#order-print`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FolioPrintEditionGridNavbar from '@/TestComponent/SectionDesigns/Sections/media/Navbar05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <FolioPrintEditionGridNavbar />
//     </main>
// )
// ```

'use client'

import { HiOutlineBookOpen } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FolioPrintEditionGridNavbar({
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
                'rounded-none border-2 border-[#443e39] bg-[#1a1816] text-[#e8e4df]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_200px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#443e39]">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-xl tracking-widest text-white">
                        MARGIN <span className="font-mono text-xs text-[#e7a37c]">FOLIO</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/40">NO. 018</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="media"
                            accent="#e7a37c"
                            variant={5}
                            label="Visual Folios"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#e7a37c] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#photography" className="text-white/70 hover:text-white transition-colors">
                            Photo Essays
                        </a>
                        <a href="#documentary" className="text-white/70 hover:text-white transition-colors">
                            Documentary
                        </a>
                        <a href="#interviews" className="text-white/70 hover:text-white transition-colors">
                            Interviews
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#e7a37c]">
                        PRINTED ARCHIVE
                    </span>
                </div>

                {/* Column 3: Print Edition status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span>1,000 COPIES</span>
                    <a
                        href="#order-print"
                        className="flex items-center gap-1 text-[#e7a37c] hover:underline"
                    >
                        <HiOutlineBookOpen />
                        <span>ORDER &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default FolioPrintEditionGridNavbar

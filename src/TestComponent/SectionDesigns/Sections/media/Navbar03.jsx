// ThreeTierNewspaperMastheadNavbar

// Navbar03 · Blogs & Digital Media › Navbars

// Description:
// A classic printed-newspaper masthead for "The Margin Journal". A thin
// ticker ("THE DAILY MARGINALIAN · EST. 2004", print-city note, "VOL. 22 ·
// NO. 842") tops a large centred title with a cover price and a "Patron
// Pledge" link, above a section shelf with a "Gazette Archive" mega menu and
// links to Culture & Art, Architecture, Philosophy and Critical Reading.

// Design:
// - Three stacked bands: monospace ticker row, masthead row (price / title
//   / pledge link) and a bottom navigation shelf separated by a 2px rule
// - Newsprint palette: background #f6f3eb, shelf #efeae0, ink #1e1e1a,
//   links black/70 → black on hover, terracotta accent #a8472b (pledge link,
//   menu trigger), 2px black top and bottom borders
// - Serif font-black uppercase title text-3xl → sm:text-5xl; serif xs bold
//   uppercase tracked shelf links; monospace 10px meta text; square corners
// - Below sm the print-city note, price and pledge link hide and the title
//   centres; the shelf stays visible and its links scroll horizontally
//   (overflow-x-auto); "100% INDEPENDENT JOURNALISM" shows only from lg

// What it does:
// - Renders `MegaMenu` (category "media", variant 3, label "Gazette
//   Archive"): opens on click or keyboard focus, stays open while hovered,
//   closes 160ms after the pointer leaves, on blur, or on Escape. The panel
//   is portalled to document.body, fixed just below this header at its
//   width, and shows a black high-contrast gazette menu of story lists
// - Plain anchor links: `#home`, `#patron`, `#culture`, `#architecture`,
//   `#philosophy`, `#critical-reading`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ThreeTierNewspaperMastheadNavbar from '@/TestComponent/SectionDesigns/Sections/media/Navbar03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ThreeTierNewspaperMastheadNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function ThreeTierNewspaperMastheadNavbar({
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
                'rounded-none border-y-2 border-black bg-[#f6f3eb] text-[#1e1e1a]',
                className,
            )}
            {...props}
        >
            {/* Top Micro-Ticker */}
            <div className="border-b border-black/15 px-5 py-1.5 font-mono text-[10px] text-black/60 flex items-center justify-between sm:px-8">
                <span>THE DAILY MARGINALIAN &bull; EST. 2004 &bull; GLOBAL CRITICISM</span>
                <span className="hidden sm:inline">PRINT EDITION AVAILABLE IN LONDON, TOKYO & NEW YORK</span>
                <span>VOL. 22 &bull; NO. 842</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-5 text-center sm:px-8 flex items-center justify-between">
                <span className="hidden sm:block font-mono text-[10px] text-black/40 uppercase">
                    PRICE: $4.00 USD
                </span>
                <a
                    href="#home"
                    className="font-serif text-3xl sm:text-5xl font-black tracking-tight uppercase hover:opacity-85 transition-opacity mx-auto sm:mx-0"
                >
                    The Margin Journal
                </a>
                <a
                    href="#patron"
                    className="hidden sm:inline-flex items-center gap-1 font-mono text-xs font-bold text-[#a8472b] hover:underline"
                >
                    <span>Patron Pledge &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t-2 border-black bg-[#efeae0] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-serif font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="media"
                            accent="#a8472b"
                            variant={3}
                            label="Gazette Archive"
                            triggerClassName="inline-flex items-center gap-1 font-serif text-xs font-bold uppercase tracking-wider text-[#a8472b] hover:text-black transition-colors cursor-pointer"
                        />
                        <a href="#culture" className="text-black/70 hover:text-black transition-colors">
                            Culture & Art
                        </a>
                        <a href="#architecture" className="text-black/70 hover:text-black transition-colors">
                            Architecture
                        </a>
                        <a href="#philosophy" className="text-black/70 hover:text-black transition-colors">
                            Philosophy
                        </a>
                        <a href="#critical-reading" className="text-black/70 hover:text-black transition-colors">
                            Critical Reading
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-black/50 hidden lg:inline">
                        100% INDEPENDENT JOURNALISM
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default ThreeTierNewspaperMastheadNavbar

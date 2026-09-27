// CityCompassThreeTierMastheadNavbar

// Navbar03 · Directories & Search Aggregators › Navbars

// Description:
// Newspaper-style white header for "The City Compass & Independent Index". A
// mono micro-ticker (anonymous critiques, zero sponsored listings, 24 hubs)
// sits above a serif masthead with a "Submit a Hidden Gem" link and a gray
// shelf of category links led by the "Curated Guides" MegaMenu (variant 3).

// Design:
// - Three stacked rows: ticker (py-1.5), masthead (py-4, justify-between),
//   bottom nav shelf (bg-gray-50, border-t); px-5 → sm:px-8 throughout
// - White background, #1a2826 text, gray-100/200 dividers, gray-400/500/600
//   secondary text, green #527354 accent for the gem link and MegaMenu trigger
// - Ticker font-mono 10px; masthead font-serif text-2xl → sm:text-3xl bold
//   tracking-tight; shelf links text-xs semibold; square edges with shadow-sm
// - Below sm the middle ticker item and "Submit a Hidden Gem" are hidden;
//   "100% UNADVERTISED" appears only from lg; shelf links stay visible at all
//   widths and scroll horizontally (overflow-x-auto)

// What it does:
// - Renders MegaMenu (category="directory", variant={3}, accent="#527354"): its
//   trigger opens a portal panel under this header on focus and toggles it on
//   click; Escape closes it, as does leaving it with the pointer (~160ms delay)
// - Links: masthead → #home, gem link → #submit-gem, Artisan Roasters →
//   #roasters, Listening Bars → #vinyl, Sourdough Bakeries → #bakeries,
//   Rare Books → #bookshops

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CityCompassThreeTierMastheadNavbar from '@/TestComponent/SectionDesigns/Sections/directory/Navbar03';

// const AppShell = ({ children }) => (
//     <>
//         <CityCompassThreeTierMastheadNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function CityCompassThreeTierMastheadNavbar({
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
                'rounded-none border-y border-gray-200 bg-white text-[#1a2826] shadow-sm',
                className,
            )}
            {...props}
        >
            {/* Top Micro-Ticker */}
            <div className="border-b border-gray-100 px-5 py-1.5 font-mono text-[10px] text-gray-500 flex items-center justify-between sm:px-8">
                <span>ANONYMOUS LOCAL CRITIQUES &bull; ZERO SPONSORED LISTINGS</span>
                <span className="hidden sm:inline">COVERING 24 METROPOLITAN HUBS WORLDWIDE</span>
                <span>VERIFIED INDEPENDENT</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    The City Compass & Independent Index
                </a>
                <a
                    href="#submit-gem"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#527354] hover:underline"
                >
                    <span>Submit a Hidden Gem &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="directory"
                            accent="#527354"
                            variant={3}
                            label="Curated Guides"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#527354] hover:text-[#1a2826] transition-colors cursor-pointer"
                        />
                        <a href="#roasters" className="text-gray-600 hover:text-black transition-colors">
                            Artisan Roasters
                        </a>
                        <a href="#vinyl" className="text-gray-600 hover:text-black transition-colors">
                            Listening Bars
                        </a>
                        <a href="#bakeries" className="text-gray-600 hover:text-black transition-colors">
                            Sourdough Bakeries
                        </a>
                        <a href="#bookshops" className="text-gray-600 hover:text-black transition-colors">
                            Rare Books
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400 hidden lg:inline">
                        100% UNADVERTISED
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default CityCompassThreeTierMastheadNavbar

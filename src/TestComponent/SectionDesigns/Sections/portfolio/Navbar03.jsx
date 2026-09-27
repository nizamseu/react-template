// AtelierOfFormMastheadNavbar

// Navbar03 · Portfolios & Personal Websites › Navbars

// Description:
// Newspaper-style, three-tier header for "JAMIE PARK — ATELIER OF FORM": a
// mono micro-ticker (Stockholm & New York, Awwwards jury credential, EST. 2016),
// a large uppercase masthead with a "Read Studio Manifesto →" link, and a darker
// shelf nav with a "Design Manifesto" mega menu and four section links.

// Design:
// - Three stacked bands separated by black/15 borders, each a flex row
//   (justify-between): ticker, masthead, bottom shelf nav.
// - Warm palette: coral #ef6a4b, darker coral shelf #e05e40, text #241d1a
//   (links at /80, hover white); border-y-2 black/15 and shadow-lg.
// - Masthead text-2xl → sm:text-3xl font-black uppercase tracking-wider;
//   10px mono ticker; xs bold uppercase shelf links; square corners.
// - Below sm the middle ticker item and the manifesto link are hidden; the
//   "1 COMMISSION AVAILABLE" note appears only from lg; the shelf links are
//   always shown and scroll horizontally (overflow-x-auto); px-5 → sm:px-8.

// What it does:
// - No content props or local state; "Design Manifesto" is a MegaMenu (category
//   "portfolio", variant 3) that toggles on click or keyboard focus, closes on
//   pointer leave (160ms), blur or Escape, and portals a light studio-ethos
//   panel (manifesto quote, keynotes list, CV download link) below the header.
// - Anchors: masthead → #home, #manifesto, #monographs, #typefaces, #spatial,
//   #archive ("Archive (2016–2026)").
// - Its mega menu panel is DesignManifestoMegaMenu in MegaMenus/portfolio/MegaMenu03.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AtelierOfFormMastheadNavbar from '@/TestComponent/SectionDesigns/Sections/portfolio/Navbar03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <AtelierOfFormMastheadNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function AtelierOfFormMastheadNavbar({
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
                'rounded-none border-y-2 border-black/15 bg-[#ef6a4b] text-[#241d1a] shadow-lg',
                className,
            )}
            {...props}
        >
            {/* Top Micro-Ticker */}
            <div className="border-b border-black/15 px-5 py-1.5 font-mono text-[10px] text-[#241d1a]/80 flex items-center justify-between sm:px-8">
                <span>INDEPENDENT DESIGN DIRECTION &bull; STOCKHOLM & NEW YORK</span>
                <span className="hidden sm:inline">AWWWARDS JURY MEMBER &bull; 26 SITE OF THE DAY HONORS</span>
                <span>EST. 2016</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                    JAMIE PARK &mdash; ATELIER OF FORM
                </a>
                <a
                    href="#manifesto"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#241d1a] hover:underline"
                >
                    <span>Read Studio Manifesto &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-black/15 bg-[#e05e40] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="portfolio"
                            accent="#241d1a"
                            variant={3}
                            label="Design Manifesto"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#241d1a] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#monographs" className="text-[#241d1a]/80 hover:text-white transition-colors">
                            Monographs
                        </a>
                        <a href="#typefaces" className="text-[#241d1a]/80 hover:text-white transition-colors">
                            Custom Typefaces
                        </a>
                        <a href="#spatial" className="text-[#241d1a]/80 hover:text-white transition-colors">
                            Spatial Web
                        </a>
                        <a href="#archive" className="text-[#241d1a]/80 hover:text-white transition-colors">
                            Archive (2016–2026)
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-[#241d1a]/70 hidden lg:inline">
                        1 COMMISSION AVAILABLE
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default AtelierOfFormMastheadNavbar

// CreatorCommonsThreeTierMastheadNavbar

// Navbar03 · Social Networks & Communities › Navbars

// Description:
// A dark, newspaper-style header for "THE INDEPENDENT CREATOR COMMONS" with three stacked tiers:
// a mono ticker (120+ practice guilds, 42,000 creative practitioners, code-of-conduct note,
// "EST. 2021"), the main masthead with a "Read Community Charter →" link, and a bottom navigation
// shelf with a "Topic Radar" mega menu plus Design Ethics, Indie Founders, Open Source and City
// Chapters links.

// Design:
// - Three full-width rows separated by white/10 borders; the bottom shelf has its own darker background
// - Palette: dark brown #241c19 with #f7e6de text, darker shelf #1c1513, peach #ffccad for the
//   ticker, charter link and mega-menu trigger, white wordmark and white/70 links; dark theme with
//   shadow-xl
// - Typography & shapes: 10px mono ticker, font-black xl → sm:text-2xl wordmark, xs semibold nav;
//   square bar (rounded-none) with 2px top and bottom borders
// - Responsive: the code-of-conduct ticker item and the charter link hide below sm; the
//   "DECENTRALIZED GOVERNANCE" tag shows only from lg; the nav shelf stays visible on mobile and
//   scrolls horizontally (overflow-x-auto)

// What it does:
// - Renders the shared MegaMenu (category "community", variant 3, label "Topic Radar", accent
//   #ffccad): the trigger toggles on click and opens on keyboard focus; the panel is portaled to
//   document.body below this header and closes on Escape, on blur or shortly after the pointer leaves
// - No own props or state; anchors: wordmark → #home, charter → #manifesto, #ethics, #indie, #oss,
//   #local
// - Its mega menu panel is TopicRadarLeaderboardMegaMenu in MegaMenus/community/MegaMenu03.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CreatorCommonsThreeTierMastheadNavbar from '@/TestComponent/SectionDesigns/Sections/community/Navbar03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CreatorCommonsThreeTierMastheadNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function CreatorCommonsThreeTierMastheadNavbar({
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
                'rounded-none border-y-2 border-black/15 bg-[#241c19] text-[#f7e6de] shadow-xl',
                className,
            )}
            {...props}
        >
            {/* Top Micro-Ticker */}
            <div className="border-b border-white/10 px-5 py-1.5 font-mono text-[10px] text-[#ffccad] flex items-center justify-between sm:px-8">
                <span>120+ PRACTICE GUILDS WORLDWIDE &bull; 42,000 CREATIVE PRACTITIONERS</span>
                <span className="hidden sm:inline">ZERO TOLERANCE HARASSMENT POLICY &bull; CODE OF CONDUCT v3.2</span>
                <span className="text-white/60">EST. 2021</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    THE INDEPENDENT CREATOR COMMONS
                </a>
                <a
                    href="#manifesto"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#ffccad] hover:underline"
                >
                    <span>Read Community Charter &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-white/10 bg-[#1c1513] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="community"
                            accent="#ffccad"
                            variant={3}
                            label="Topic Radar"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#ffccad] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#ethics" className="text-white/70 hover:text-white transition-colors">
                            Design Ethics
                        </a>
                        <a href="#indie" className="text-white/70 hover:text-white transition-colors">
                            Indie Founders
                        </a>
                        <a href="#oss" className="text-white/70 hover:text-white transition-colors">
                            Open Source
                        </a>
                        <a href="#local" className="text-white/70 hover:text-white transition-colors">
                            City Chapters
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 hidden lg:inline">
                        DECENTRALIZED GOVERNANCE
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default CreatorCommonsThreeTierMastheadNavbar

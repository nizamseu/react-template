// MarginBroadsheetSearchNavbar

// Navbar01 · Blogs & Digital Media › Navbars

// Description:
// A light, newspaper-style header for the "MARGIN." publication. The serif
// wordmark sits beside a "Sunday Edition" mega menu and links to Longform
// Essays, Dialogues, Dispatch and the 2004–2026 Archive; the right side
// shows the current issue ("ISSUE NO. 48 · OCT 2026") and a search pill.

// Design:
// - One flex row: left group (wordmark + nav, gap-10) and right group
//   (issue label + search button) pushed apart with justify-between
// - Warm paper palette: background #f1eee6, ink #1f201c (links at 70%
//   opacity), terracotta accent #a8472b on the wordmark dot and menu
//   trigger (MegaMenu accent #a84f34), bottom border black/15
// - Serif text-3xl bold wordmark; serif xs nav links; monospace xs right
//   group; square header (rounded-none) with a 2px bottom rule; rounded-full
//   outlined search pill
// - Nav (including the mega menu) is hidden below md and there is no mobile
//   menu toggle; the issue label and the "Search Index" text hide below sm,
//   leaving only the search icon; padding px-5 → sm:px-8

// What it does:
// - Renders `MegaMenu` (category "media", variant 1, label "Sunday
//   Edition"): the trigger opens on click or keyboard focus, stays open while
//   hovered, and closes 160ms after the pointer leaves, on blur, or on
//   Escape; its chevron rotates when open. The panel is portalled to
//   document.body and fixed flush under this header at the header's width,
//   showing the broadsheet-style Sunday Edition menu
// - Plain anchor links: `#home`, `#longform`, `#dialogues`, `#dispatch`,
//   `#archive`; the search button (aria-label "Search articles") has no
//   click handler
// - Its mega menu panel is SundayBroadsheetMegaMenu in MegaMenus/media/MegaMenu01.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MarginBroadsheetSearchNavbar from '@/TestComponent/SectionDesigns/Sections/media/Navbar01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MarginBroadsheetSearchNavbar />
//     </main>
// )
// ```

'use client'

import { HiOutlineSearch } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function MarginBroadsheetSearchNavbar({
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
                'rounded-none border-b-2 border-black/15 bg-[#f1eee6] px-5 py-4 text-[#1f201c] sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#home"
                        className="font-serif text-3xl font-bold tracking-tight shrink-0"
                    >
                        MARGIN<span className="text-[#a8472b]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-serif sm:order-none sm:w-auto sm:border-0 sm:pt-0 md:flex">
                        <MegaMenu
                            category="media"
                            accent="#a84f34"
                            variant={1}
                            label="Sunday Edition"
                            triggerClassName="inline-flex items-center gap-1 font-serif text-xs font-semibold text-[#a8472b] hover:text-[#1f201c] transition-colors cursor-pointer"
                        />
                        <a href="#longform" className="text-[#1f201c]/70 hover:text-black transition-colors">
                            Longform Essays
                        </a>
                        <a href="#dialogues" className="text-[#1f201c]/70 hover:text-black transition-colors">
                            Dialogues
                        </a>
                        <a href="#dispatch" className="text-[#1f201c]/70 hover:text-black transition-colors">
                            Dispatch
                        </a>
                        <a href="#archive" className="text-[#1f201c]/70 hover:text-black transition-colors">
                            Archive (2004–2026)
                        </a>
                    </nav>
                </div>

                {/* Right Issue No & Search */}
                <div className="flex items-center gap-5 text-xs font-mono">
                    <span className="hidden sm:inline text-black/50">
                        ISSUE NO. 48 &bull; OCT 2026
                    </span>
                    <button
                        aria-label="Search articles"
                        className="flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 hover:bg-black/5 transition-colors"
                    >
                        <HiOutlineSearch className="text-sm" />
                        <span className="hidden sm:inline">Search Index</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default MarginBroadsheetSearchNavbar

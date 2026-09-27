// FieldnoteAcademyThreeTierMastheadNavbar

// Navbar03 · Learning Management & EdTech › Navbars

// Description:
// White, institutional three-tier header for "Fieldnote Academy of Practical
// Craft": a mono ticker (Fall 2026 admissions, 94% graduate placement, Berlin &
// Online), a masthead with the academy name and a "Tuition Assistance" link, and
// a grey shelf nav with a "Career Roadmap" mega menu plus programme links.

// Design:
// - Three stacked rows (ticker, masthead, bottom shelf) separated by borders,
//   each a flex row with justify-between
// - Light palette: white background, #102d36 text, forest green #3c7e5d link
//   and mega menu trigger, gray-50 shelf, gray-100/200 borders, gray-400 to
//   gray-600 secondary text, shadow-sm
// - Mono 10px ticker, serif text-2xl -> sm:text-3xl bold academy name, mono xs
//   bold link, xs semibold nav; square header (rounded-none, border-y)
// - Middle ticker item and "Tuition Assistance" hidden below sm; "12-WEEK
//   IMMERSIVES" tag from lg; the nav stays visible on mobile and scrolls
//   horizontally (overflow-x-auto); padding px-5 -> sm:px-8

// What it does:
// - No content props and no local state; interactivity comes from MegaMenu
//   (category="learning", variant={3}, accent #3c7e5d): its trigger toggles on
//   click and opens on focus, rendering the career-roadmap panel (salary and
//   hire-rate stats) in a portal fixed below the header; it closes 160 ms after
//   the pointer leaves, when focus moves outside, or on Escape
// - Anchors: #home, #scholarship, #design-systems, #creative-coding,
//   #typography, #alumni

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FieldnoteAcademyThreeTierMastheadNavbar from '@/TestComponent/SectionDesigns/Sections/learning/Navbar03';

// const SiteLayout = ({ children }) => (
//     <>
//         <FieldnoteAcademyThreeTierMastheadNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FieldnoteAcademyThreeTierMastheadNavbar({
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
                'rounded-none border-y border-gray-200 bg-white text-[#102d36] shadow-sm',
                className,
            )}
            {...props}
        >
            {/* Top Micro-Ticker */}
            <div className="border-b border-gray-100 px-5 py-1.5 font-mono text-[10px] text-gray-500 flex items-center justify-between sm:px-8">
                <span>FALL 2026 ADMISSIONS OPEN &bull; ACCREDITED CERTIFICATION</span>
                <span className="hidden sm:inline">94% GRADUATE PLACEMENT AT TOP TIER STUDIOS</span>
                <span>BERLIN & ONLINE</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    Fieldnote Academy of Practical Craft
                </a>
                <a
                    href="#scholarship"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#3c7e5d] hover:underline"
                >
                    <span>Tuition Assistance &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="learning"
                            accent="#3c7e5d"
                            variant={3}
                            label="Career Roadmap"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#3c7e5d] hover:text-[#102d36] transition-colors cursor-pointer"
                        />
                        <a href="#design-systems" className="text-gray-600 hover:text-black transition-colors">
                            Design Systems
                        </a>
                        <a href="#creative-coding" className="text-gray-600 hover:text-black transition-colors">
                            Creative Coding
                        </a>
                        <a href="#typography" className="text-gray-600 hover:text-black transition-colors">
                            Spatial & Type
                        </a>
                        <a href="#alumni" className="text-gray-600 hover:text-black transition-colors">
                            Alumni Work
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400 hidden lg:inline">
                        12-WEEK IMMERSIVES
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default FieldnoteAcademyThreeTierMastheadNavbar

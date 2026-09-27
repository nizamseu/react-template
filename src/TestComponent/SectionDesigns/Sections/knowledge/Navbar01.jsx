// NorthstarDeveloperDocsNavbar

// Navbar01 · Knowledge Bases & Documentation › Navbars

// Description:
// A clean developer-documentation header for "northstar docs". A monogram
// brand and left-aligned links (Developer Docs mega menu, Quickstarts, SDK
// References, API v4.2) sit on the left; a "v4.2 (Latest)" version badge and a
// "Search docs (⌘K)" pill sit on the right. Supports Tailwind dark mode.

// Design:
// - Single-row flex header (justify-between) with a bottom border: brand + nav
//   grouped on the left (gap-10), version badge + search pill on the right.
// - Light: white background, text #17231f, accent #41715d (monogram tile, mega
//   menu trigger, badge text), gray-600 links, gray-50 search pill with gray-200
//   border, emerald-500/10 badge. Dark: background #0f1a16, border gray-800,
//   white text, white/70 links, gray-800 search pill.
// - text-sm bold brand with a 24px rounded "N" monospace tile; text-xs semibold
//   links; monospace right-hand group; square-cornered header (rounded-none),
//   rounded badge and rounded-lg search pill.
// - Padding px-5 → sm:px-8; the nav (mega menu + links) is hidden below md and
//   the search pill below sm. There is no mobile menu toggle, so on small screens
//   only the brand and version badge remain.

// What it does:
// - No content props or own state. "Developer Docs" is the shared MegaMenu (category
//   "knowledge", variant 1, accent #41715d): it toggles on click or opens on
//   keyboard focus, closes 160ms after the pointer leaves, on Escape or when focus
//   moves away, and portals a "Production Guides & Architecture References" panel
//   to document.body aligned to this header's width.
// - Anchors: brand → #home, #quickstarts, #sdks, #api. The search pill is a
//   static div (not an input) and ⌘K has no keyboard handler.
// - Its mega menu panel is APISDKDocsMegaMenu in MegaMenus/knowledge/MegaMenu01.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NorthstarDeveloperDocsNavbar from '@/TestComponent/SectionDesigns/Sections/knowledge/Navbar01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NorthstarDeveloperDocsNavbar />
//     </main>
// )
// ```

'use client'

import { HiOutlineSearch } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function NorthstarDeveloperDocsNavbar({
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
                'rounded-none border-b border-gray-200 bg-white px-5 py-3.5 text-[#17231f] dark:border-gray-800 dark:bg-[#0f1a16] dark:text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#home"
                        className="flex items-center gap-2.5 font-bold tracking-tight text-sm shrink-0"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-[#41715d] text-xs text-white font-mono">
                            N
                        </span>
                        <span>northstar docs</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="knowledge"
                            accent="#41715d"
                            variant={1}
                            label="Developer Docs"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#41715d] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#quickstarts" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            Quickstarts
                        </a>
                        <a href="#sdks" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            SDK References
                        </a>
                        <a href="#api" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            API v4.2
                        </a>
                    </nav>
                </div>

                {/* Right Version Switcher & Search */}
                <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[#41715d] font-bold border border-emerald-500/20">
                        v4.2 (Latest)
                    </span>
                    <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                        <HiOutlineSearch className="text-sm" />
                        <span>Search docs (⌘K)</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default NorthstarDeveloperDocsNavbar

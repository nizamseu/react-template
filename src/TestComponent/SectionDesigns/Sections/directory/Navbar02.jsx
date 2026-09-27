// PowerSearchLimeNavbar

// Navbar02 · Directories & Search Aggregators › Navbars

// Description:
// Bright lime header for "GOOD NEIGHBOR / INDEX" with the brand on the far left
// and a right-aligned group of category links (Specialty Coffee, Independent
// Books, Ateliers) plus a dark "Filter Matrix" pill. The "Power Search" item
// opens the directory MegaMenu (variant 2: faceted search and quick filters).

// Design:
// - Flex row: brand left; nav + CTA pushed right with ml-auto (gap-8);
//   px-5 → sm:px-8, py-4
// - Lime #d9f064 background, #1a2826 text, #527354 brand slash, black/10 2px
//   bottom border; dark #1a2826 pill with white text (hover black)
// - Brand text-sm font-black uppercase tracking-wider; links text-xs bold
//   uppercase tracking-wider with hover:opacity-75; square header, rounded-full
//   pill
// - The nav (MegaMenu + links) is hidden below md, leaving brand and pill; no
//   mobile menu is provided

// What it does:
// - Renders MegaMenu (category="directory", variant={2}, accent="#1a2826"): its
//   trigger opens a portal panel under this header on focus and toggles it on
//   click; Escape closes it, as does leaving it with the pointer (~160ms delay)
// - Links: brand → #home, Specialty Coffee → #coffee, Independent Books →
//   #books, Ateliers → #ateliers, "Filter Matrix" → #filter-matrix
// - Its mega menu panel is PowerSearchMegaMenu in MegaMenus/directory/MegaMenu02.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PowerSearchLimeNavbar from '@/TestComponent/SectionDesigns/Sections/directory/Navbar02';

// const AppShell = ({ children }) => (
//     <>
//         <PowerSearchLimeNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function PowerSearchLimeNavbar({
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
                'rounded-none border-b-2 border-black/10 bg-[#d9f064] px-5 py-4 text-[#1a2826] sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="text-sm font-black uppercase tracking-wider shrink-0">
                    GOOD NEIGHBOR <span className="text-[#527354]">/</span> INDEX
                </a>

                {/* Right-Flush Navigation & Filter Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-wider md:flex">
                        <MegaMenu
                            category="directory"
                            accent="#1a2826"
                            variant={2}
                            label="Power Search"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#1a2826] hover:opacity-75 transition-opacity cursor-pointer"
                        />
                        <a href="#coffee" className="hover:opacity-75 transition-opacity">
                            Specialty Coffee
                        </a>
                        <a href="#books" className="hover:opacity-75 transition-opacity">
                            Independent Books
                        </a>
                        <a href="#ateliers" className="hover:opacity-75 transition-opacity">
                            Ateliers
                        </a>
                    </nav>

                    <a
                        href="#filter-matrix"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#1a2826] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-black transition-colors shrink-0"
                    >
                        <span>Filter Matrix</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default PowerSearchLimeNavbar

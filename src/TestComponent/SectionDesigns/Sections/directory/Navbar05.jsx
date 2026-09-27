// DistrictWalksGridNavbar

// Navbar05 · Directories & Search Aggregators › Navbars

// Description:
// Bordered three-cell header for "DISTRICT / WALKS", a guide to curated
// neighbourhood walking routes. The cells hold the brand with a "MAPS" tag, a
// nav strip ("District Walks" MegaMenu, variant 5, plus Shimokitazawa,
// Kreuzberg and Le Marais) and a "4,820 STOPS" counter with an "EXPLORE" link.

// Design:
// - Grid 1 column → md:grid-cols-[240px_1fr_220px]; cells separated by
//   divide-y-2 (mobile) / md:divide-x-2 in #527354/30; each cell p-3.5
// - Pale sage #edf1e6 background, #1a2826 text, 2px #527354 outer border,
//   green #527354 accents (brand suffix, tags, trigger, link hovers)
// - All text in font-mono (text-sm black brand, text-xs uppercase
//   tracking-wider nav, 10px tags); square corners, no shadow
// - Stacks into three rows below md; the nav strip stays visible and scrolls
//   horizontally (overflow-x-auto); "CURATED WALKING ROUTES" shows only from lg

// What it does:
// - Renders MegaMenu (category="directory", variant={5}, accent="#527354"): its
//   trigger opens a portal panel under this header on focus and toggles it on
//   click; Escape closes it, as does leaving it with the pointer (~160ms delay)
// - Links: brand → #home, Shimokitazawa → #shibuya, Kreuzberg → #kreuzberg,
//   Le Marais → #marais, "EXPLORE →" → #all-walks
// - Its mega menu panel is DistrictWalksMegaMenu in MegaMenus/directory/MegaMenu05.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DistrictWalksGridNavbar from '@/TestComponent/SectionDesigns/Sections/directory/Navbar05';

// const AppShell = ({ children }) => (
//     <>
//         <DistrictWalksGridNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function DistrictWalksGridNavbar({
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
                'rounded-none border-2 border-[#527354] bg-[#edf1e6] text-[#1a2826]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#527354]/30">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-mono text-sm font-black uppercase tracking-wider">
                        DISTRICT <span className="text-[#527354]">/ WALKS</span>
                    </a>
                    <span className="font-mono text-[10px] text-[#527354]">MAPS</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="directory"
                            accent="#527354"
                            variant={5}
                            label="District Walks"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#527354] hover:text-black transition-colors cursor-pointer"
                        />
                        <a href="#shibuya" className="hover:text-[#527354] transition-colors">
                            Shimokitazawa
                        </a>
                        <a href="#kreuzberg" className="hover:text-[#527354] transition-colors">
                            Kreuzberg
                        </a>
                        <a href="#marais" className="hover:text-[#527354] transition-colors">
                            Le Marais
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#527354]">
                        CURATED WALKING ROUTES
                    </span>
                </div>

                {/* Column 3: Stops Count */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span>4,820 STOPS</span>
                    <a
                        href="#all-walks"
                        className="flex items-center gap-1 text-[#527354] hover:underline"
                    >
                        <span>EXPLORE &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default DistrictWalksGridNavbar

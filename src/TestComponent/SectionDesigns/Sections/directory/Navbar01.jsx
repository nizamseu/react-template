// LocalGuildsDarkNavbar

// Navbar01 · Directories & Search Aggregators › Navbars

// Description:
// Dark single-row header for "GOOD NEIGHBOR." with the brand and navigation
// grouped on the left and a "4,820 places verified" counter plus a "Suggest
// Place" pill on the right. The "Local Guilds" item opens the directory
// MegaMenu (variant 1: verified local establishments panel).

// Design:
// - Flex row justify-between: [brand + nav] left group (gap-10), [counter +
//   CTA] right group; px-5 → sm:px-8, py-4
// - Dark #14201e background, white text (white/70 links, white/50 counter),
//   lime #d9f064 2px bottom border, brand dot, MegaMenu trigger and CTA pill
//   (#14201e text, hover white)
// - Brand font-mono text-sm font-black uppercase tracking-[.18em]; links
//   text-xs; square header (rounded-none) with a rounded-full CTA pill
// - The nav (MegaMenu + links) is hidden below md and the counter below sm; no
//   mobile menu is provided

// What it does:
// - Renders MegaMenu (category="directory", variant={1}, accent="#d9f064"): its
//   trigger opens a portal panel under this header on focus and toggles it on
//   click; Escape closes it, as does leaving it with the pointer (~160ms delay)
// - Links: brand → #home, Neighborhoods → #neighborhoods, Field Guides →
//   #guides, Map Index → #map, "Suggest Place" → #suggest

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LocalGuildsDarkNavbar from '@/TestComponent/SectionDesigns/Sections/directory/Navbar01';

// const AppShell = ({ children }) => (
//     <>
//         <LocalGuildsDarkNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function LocalGuildsDarkNavbar({
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
                'rounded-none border-b-2 border-[#d9f064] bg-[#14201e] px-5 py-4 text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#home"
                        className="font-mono text-sm font-black uppercase tracking-[.18em] shrink-0"
                    >
                        GOOD NEIGHBOR<span className="text-[#d9f064]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs text-white/70 md:flex">
                        <MegaMenu
                            category="directory"
                            accent="#d9f064"
                            variant={1}
                            label="Local Guilds"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#d9f064] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#neighborhoods" className="hover:text-white transition-colors">
                            Neighborhoods
                        </a>
                        <a href="#guides" className="hover:text-white transition-colors">
                            Field Guides
                        </a>
                        <a href="#map" className="hover:text-white transition-colors">
                            Map Index
                        </a>
                    </nav>
                </div>

                {/* Right Status & Suggest Spot Action */}
                <div className="flex items-center gap-5 font-mono text-xs">
                    <span className="hidden sm:inline text-white/50">
                        4,820 PLACES VERIFIED
                    </span>
                    <a
                        href="#suggest"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#d9f064] px-4 py-2 font-bold text-[#14201e] hover:bg-white transition-colors"
                    >
                        <span>Suggest Place</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default LocalGuildsDarkNavbar

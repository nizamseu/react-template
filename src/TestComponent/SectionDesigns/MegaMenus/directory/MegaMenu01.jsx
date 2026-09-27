// LocalGuildsMegaMenu

// MegaMenu01 · Directories & Search Aggregators › Mega menus

// Description:
// A dark category index for an independent city directory ("Good Neighbor"). The title
// "4,820 Personally Verified Local Establishments" sits beside a "ZERO SPONSORED ADS •
// ANONYMOUS FIELD CRITIQUES" note, then come three numbered link lists (01 / FOOD &
// PROVISIONS, 02 / HOME & ARCHITECTURE, 03 / CRAFT & REPAIR) and a "Guide of the Month"
// card for Shimokitazawa, Tokyo (28 venues) with a "Download Offline Map" link.

// Design:
// - Header row (kicker + title left, check-icon note right), then a category matrix of 1
//   column on mobile, 2 from md: and 4 from lg: (three link lists + the guide card)
// - Deep green #14201e surface with #e3ece9 text; lime #d9f064 for the 2px top border,
//   kicker, note, column headings and guide link; white/70 links turning white on hover
// - Bold text-2xl white title; font-mono uppercase headings at text-[10px] and text-xs;
//   bulleted text-xs links; rounded-lg white/5 guide card with a white/10 border
// - Header row uses flex-wrap, so the note drops below the title on narrow screens

// What it does:
// - The twelve category links all point to #cat and "Download Offline Map" to #guide-pdf;
//   each calls closeMenu on click
// - Header note and guide card copy are static text; no state or effects
// - Used by LocalGuildsDarkNavbar: <MegaMenu category="directory" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-none border-t-2 border-[#d9f064] shadow-2xl bg-[#14201e]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LocalGuildsMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/directory/MegaMenu01';

// // Inside LocalGuildsDarkNavbar it opens from <MegaMenu category="directory" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-t-2 border-[#d9f064] shadow-2xl bg-[#14201e]">
//         <LocalGuildsMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LocalGuildsMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#14201e] text-[#e3ece9] p-8 border-t-2 border-[#d9f064]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                    <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-[.25em]">
                        GOOD NEIGHBOR &bull; INDEPENDENT CITY DIRECTORY
                    </span>
                    <h3 className="mt-1 font-bold text-2xl text-white">4,820 Personally Verified Local Establishments</h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#d9f064]">
                    <HiOutlineCheck /> ZERO SPONSORED ADS &bull; ANONYMOUS FIELD CRITIQUES
                </div>
            </div>

            {/* 4 Category Matrix */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <span className="font-mono text-xs font-bold text-[#d9f064] uppercase">
                        01 / FOOD & PROVISIONS
                    </span>
                    <ul className="mt-3 space-y-2 text-xs">
                        {['Heritage Sourdough Bakeries', 'Third-Wave Micro Roasters', 'Natural Low-Intervention Wine', 'Heirloom Produce Markets'].map((c) => (
                            <li key={c}>
                                <a href="#cat" onClick={closeMenu} className="block py-1 text-white/70 hover:text-white">
                                    &bull; {c}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <span className="font-mono text-xs font-bold text-[#d9f064] uppercase">
                        02 / HOME & ARCHITECTURE
                    </span>
                    <ul className="mt-3 space-y-2 text-xs">
                        {['Mid-Century Vintage Dealers', 'Ceramic Studios & Kilns', 'Architectural Salvage', 'Japanese Joinery & Carpentry'].map((c) => (
                            <li key={c}>
                                <a href="#cat" onClick={closeMenu} className="block py-1 text-white/70 hover:text-white">
                                    &bull; {c}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <span className="font-mono text-xs font-bold text-[#d9f064] uppercase">
                        03 / CRAFT & REPAIR
                    </span>
                    <ul className="mt-3 space-y-2 text-xs">
                        {['Bespoke Shoemakers & Cobblers', 'Mechanical Watch Restorers', 'Loom & Weaving Ateliers', 'Vintage Audio Repair'].map((c) => (
                            <li key={c}>
                                <a href="#cat" onClick={closeMenu} className="block py-1 text-white/70 hover:text-white">
                                    &bull; {c}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Spotlight City Guide */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-wider block">
                            GUIDE OF THE MONTH
                        </span>
                        <h4 className="mt-2 text-sm font-bold text-white">Shimokitazawa, Tokyo &bull; 28 Venues</h4>
                        <p className="mt-1 text-xs text-white/60">
                            The definitive pocket index of independent vinyl dens, kissaten cafes, and vintage clothing archives.
                        </p>
                    </div>
                    <a
                        href="#guide-pdf"
                        onClick={closeMenu}
                        className="mt-4 flex items-center justify-between text-xs font-bold text-[#d9f064] underline hover:text-white"
                    >
                        <span>Download Offline Map</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default LocalGuildsMegaMenu

// HighContrastGazetteMegaMenu

// MegaMenu03 · Blogs & Digital Media › Mega menus

// Description:
// The "High-Contrast Gazette" panel for a news, essay or culture-magazine navbar. A mono
// masthead reads "GAZETTE EDITION • OCTOBER 2026" and "CIRCULATION: 120,000", then three
// numbered columns ("01 THE LONG ESSAYS", "02 CRITIQUE & REVIEWS", "03 FIELD REPORTS")
// list three story links each, and a footer offers "Explore Full 10-Year Archive →".

// Design:
// - Masthead row, a grid-cols-1 md:grid-cols-3 grid of story columns, then a footer row
// - Near-black #121212 surface, white text, white top border (border-t-2); white/80
//   links that turn white and underline on hover, white/40 numerals, white/10-20 rules
// - font-mono masthead and numerals, bold uppercase text-xs section heads, text-xs story
//   links with bullet prefixes; no radius, shadow or accent colour
// - Columns stack on mobile and sit three across from md:; the masthead and footer rows
//   do not wrap, so their two halves squeeze side by side on narrow screens

// What it does:
// - All nine story links (#gazette-story) and the archive link (#archive) call
//   closeMenu on click; there is no state or effect
// - Used by ThreeTierNewspaperMastheadNavbar: <MegaMenu category="media" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-none border-2 border-white shadow-2xl bg-[#121212]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HighContrastGazetteMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/media/MegaMenu03';

// // Inside ThreeTierNewspaperMastheadNavbar it opens from <MegaMenu category="media" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-2 border-white shadow-2xl bg-[#121212]">
//         <HighContrastGazetteMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function HighContrastGazetteMegaMenu({
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
                'bg-[#121212] text-white p-8 border-t-2 border-white',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/20 pb-4 font-mono text-xs">
                <span className="tracking-[.25em]">GAZETTE EDITION &bull; OCTOBER 2026</span>
                <span className="text-white/50">CIRCULATION: 120,000 &bull; GLOBAL PRINT & DIGITAL</span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        num: '01',
                        section: 'THE LONG ESSAYS',
                        stories: [
                            'The Death of the Physical Book Has Been Greatly Exaggerated',
                            'Sub-Antarctic Weather Stations and the Poetry of Isolation',
                            'Can AI Write a Genuinely Devastating Elegiac Poem?',
                        ],
                    },
                    {
                        num: '02',
                        section: 'CRITIQUE & REVIEWS',
                        stories: [
                            'Venice Architecture Biennale: The Monolith Strikes Back',
                            'Tarkovsky in 8K: Does High Resolution Ruin Mystery?',
                            'Review: The Uncomfortable Chairs of Gaetano Pesce',
                        ],
                    },
                    {
                        num: '03',
                        section: 'FIELD REPORTS',
                        stories: [
                            'From the Salt Mines of Maras, Peru: An Ancient Cooperative',
                            'Building Wooden Sailboats in the Lofoten Islands',
                            'Night Shifts at the Tokyo Central Fish Auction',
                        ],
                    },
                ].map((col) => (
                    <div key={col.num} className="space-y-4">
                        <div className="flex items-baseline gap-2 border-b border-white/10 pb-2">
                            <span className="font-mono text-sm text-white/40">{col.num}</span>
                            <span className="text-xs font-bold uppercase tracking-wider">{col.section}</span>
                        </div>
                        <ul className="space-y-3 text-xs leading-relaxed">
                            {col.stories.map((s) => (
                                <li key={s}>
                                    <a
                                        href="#gazette-story"
                                        onClick={closeMenu}
                                        className="block text-white/80 hover:text-white hover:underline transition-colors"
                                    >
                                        &bull; {s}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t border-white/20 pt-4 flex items-center justify-between text-xs text-white/50">
                <span>Curated independently without sponsored native advertising.</span>
                <a href="#archive" onClick={closeMenu} className="font-bold text-white underline">
                    Explore Full 10-Year Archive &rarr;
                </a>
            </div>
        </div>
    )
}

export default HighContrastGazetteMegaMenu

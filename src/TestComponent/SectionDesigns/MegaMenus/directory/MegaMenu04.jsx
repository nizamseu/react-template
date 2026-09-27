// VerifiedStudiosMegaMenu

// MegaMenu04 · Directories & Search Aggregators › Mega menus

// Description:
// A dark B2B directory panel for finding verified creative studios. The kicker "VERIFIED
// CREATIVE PARTNERS • B2B DIRECTORY" sits over the serif title "Independent Studios &
// Specialized Agencies" and a "Post Anonymous RFP (Get 3 Proposals)" pill, followed by
// three category cards (Brand Identity & Art Direction, Creative Dev & Three.js Shaders,
// Hardware & Industrial Design) with studio count, minimum project and example studios.

// Design:
// - Header row (stacked on mobile, side by side with items-end from md:), then category
//   cards in 1 column on mobile and 3 from md:
// - Very dark green #12201c surface, white text, white/15 top border; lime #d9f064 kicker,
//   card labels, card links and the rounded-full RFP pill (#12201c text, white on hover)
// - Serif bold text-2xl title; font-mono text-[10px] card labels, text-xs meta and lists;
//   rounded-lg white/5 cards with white/10 borders and a divider above each card link
// - Cards use flex-col justify-between so the links line up at the bottom

// What it does:
// - "Post Anonymous RFP (Get 3 Proposals)" links to #rfp and each "View Studios & Verified
//   Reviews →" to #view-studios; all call closeMenu on click
// - Example studio names are plain list items; studio-count lines hold "&bull;" inside JS
//   strings, so it renders as literal text; no state or effects
// - Used by FloatingPillStudioIndexNavbar: <MegaMenu category="directory" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-none border border-white/20 shadow-2xl bg-[#12201c]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VerifiedStudiosMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/directory/MegaMenu04';

// // Inside FloatingPillStudioIndexNavbar it opens from <MegaMenu category="directory" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border border-white/20 shadow-2xl bg-[#12201c]">
//         <VerifiedStudiosMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function VerifiedStudiosMegaMenu({
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
                'bg-[#12201c] text-white p-8 border-t border-white/15',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-[.25em]">
                        VERIFIED CREATIVE PARTNERS &bull; B2B DIRECTORY
                    </span>
                    <h3 className="mt-1 text-2xl font-bold font-serif">Independent Studios & Specialized Agencies</h3>
                </div>
                <a
                    href="#rfp"
                    onClick={closeMenu}
                    className="rounded-full bg-[#d9f064] px-4 py-1.5 text-xs font-bold text-[#12201c] hover:bg-white"
                >
                    Post Anonymous RFP (Get 3 Proposals)
                </a>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        category: 'BRAND IDENTITY & ART DIRECTION',
                        studios: '34 Verified Studios &bull; Min Project: $25k',
                        examples: ['Pentagram Alums', 'Studio Koto', 'Order NY'],
                    },
                    {
                        category: 'CREATIVE DEV & THREE.JS SHADERS',
                        studios: '28 Verified Studios &bull; Min Project: $30k',
                        examples: ['Locomotive Montreal', 'Active Theory', 'Resn'],
                    },
                    {
                        category: 'HARDWARE & INDUSTRIAL DESIGN',
                        studios: '18 Verified Studios &bull; Min Project: $40k',
                        examples: ['Layer Design', 'Minimal Inc.', 'Teague'],
                    },
                ].map((cat) => (
                    <div key={cat.category} className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-[10px] text-[#d9f064] block">{cat.category}</span>
                            <span className="text-xs text-white/50 mt-1 block">{cat.studios}</span>
                            <ul className="mt-3 space-y-1 text-xs text-white/80">
                                {cat.examples.map((ex) => (
                                    <li key={ex}>&bull; {ex}</li>
                                ))}
                            </ul>
                        </div>
                        <a href="#view-studios" onClick={closeMenu} className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-[#d9f064] underline">
                            View Studios & Verified Reviews &rarr;
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VerifiedStudiosMegaMenu

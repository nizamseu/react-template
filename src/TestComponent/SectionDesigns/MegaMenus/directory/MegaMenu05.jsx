// DistrictWalksMegaMenu

// MegaMenu05 · Directories & Search Aggregators › Mega menus

// Description:
// A dark "spatial explorer" panel for a city directory that suggests walking routes. The
// kicker "SPATIAL EXPLORER • DISTRICT WALKS" sits over the serif title "Neighbourhoods
// with High Craft Density" and an "Average Walking Score: 98/100 • Transit Connected" note,
// followed by three district cards (Mitte & Kreuzberg in Berlin, Yanaka & Nezu in Tokyo,
// Red Hook & Gowanus in Brooklyn) with loop length, highlights and a GPS loop link.

// Design:
// - Header row (stacked on mobile, side by side with items-end from md:), then district
//   cards in 1 column on mobile and 3 from md:
// - Dark green #1b2b27 surface with #d9e6e2 text and a #527354 top border; lime #d9f064
//   kicker, city lines and map links (white on hover); white/60 highlights
// - Serif text-2xl title, text-base bold district names, font-mono text-[10px] city lines;
//   rounded-lg white/5 cards with white/10 borders
// - Cards use flex-col justify-between so the map links sit at the bottom

// What it does:
// - Each "Open GPS Walking Loop" link (with a map icon) points to #map-loop and calls
//   closeMenu on click
// - City lines hold "&bull;" inside JS strings, so it renders as literal text; no state or
//   effects
// - Used by DistrictWalksGridNavbar: <MegaMenu category="directory" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-2xl border border-[#527354] shadow-2xl bg-[#1b2b27]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DistrictWalksMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/directory/MegaMenu05';

// // Inside DistrictWalksGridNavbar it opens from <MegaMenu category="directory" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-2xl border border-[#527354] shadow-2xl bg-[#1b2b27]">
//         <DistrictWalksMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineMap } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DistrictWalksMegaMenu({
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
                'bg-[#1b2b27] text-[#d9e6e2] p-8 border-t border-[#527354]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-[.25em]">
                        SPATIAL EXPLORER &bull; DISTRICT WALKS
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Neighbourhoods with High Craft Density</h3>
                </div>
                <div className="font-mono text-xs text-white/60">
                    Average Walking Score: 98/100 &bull; Transit Connected
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        district: 'Mitte & Kreuzberg',
                        city: 'Berlin &bull; 4.2 km Walking Loop',
                        highlights: '14 galleries, 6 third-wave roasters, 3 brutalist chapels',
                    },
                    {
                        district: 'Yanaka & Nezu',
                        city: 'Tokyo &bull; 3.8 km Walking Loop',
                        highlights: 'Ancient wooden nagaya houses, wagashi makers, cat cafes',
                    },
                    {
                        district: 'Red Hook & Gowanus',
                        city: 'Brooklyn, NY &bull; 5.1 km Walking Loop',
                        highlights: 'Working shipyards, glassblowing workshops, natural cideries',
                    },
                ].map((d) => (
                    <div key={d.district} className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-[10px] text-[#d9f064]">{d.city}</span>
                            <h4 className="mt-1 text-base font-bold text-white">{d.district}</h4>
                            <p className="mt-2 text-xs text-white/60">{d.highlights}</p>
                        </div>
                        <a
                            href="#map-loop"
                            onClick={closeMenu}
                            className="mt-4 flex items-center justify-between text-xs text-[#d9f064] underline hover:text-white"
                        >
                            <span>Open GPS Walking Loop</span>
                            <HiOutlineMap />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DistrictWalksMegaMenu

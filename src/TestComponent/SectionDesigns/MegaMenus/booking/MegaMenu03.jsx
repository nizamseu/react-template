// StaysByTypologyMegaMenu

// MegaMenu03 · Booking & Reservations › Mega menus

// Description:
// A dark collections dropdown for a boutique stays / travel-booking site. A mono kicker
// "CURATED COLLECTIONS BY TYPOLOGY" tops the serif headline "Stays by Design Philosophy",
// with "Each property personally scouted and verified" alongside. Four collection cards
// (Mid-Century Modern, Wilderness Treehouses, Historic Watchtowers, Overwater Sanctuaries)
// each show a property count, a one-line blurb and an "Explore Collection" link.

// Design:
// - p-8 panel with a 1px #b65f47 top border: a header that stacks on mobile and becomes an
//   end-aligned row at md:, then a card grid of one column, two at sm: and four at lg:
// - Deep teal #14232c surface with #dce7ee text; terracotta #e07d5b kicker, counts, card
//   hover border and links, set against the darker #b65f47 top rule
// - Serif text-2xl headline, bold text-sm card titles and font-mono text-[10px] counts;
//   cards are rounded-lg with a white/10 border on white/5 and a rule above the link
// - No images: each card is text only, with an arrow icon at the right of its link row

// What it does:
// - Each "Explore Collection" link calls closeMenu and goes to #browse-type; nothing
//   else is interactive. Header text and card copy are display only; no state or effect
// - Used by ResidencesThreeTierMastheadNavbar: <MegaMenu category="booking" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-none border-b-2 border-[#b65f47] shadow-2xl bg-[#14232c]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StaysByTypologyMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/booking/MegaMenu03';

// // Inside ResidencesThreeTierMastheadNavbar it opens from <MegaMenu category="booking" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-b-2 border-[#b65f47] shadow-2xl bg-[#14232c]">
//         <StaysByTypologyMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function StaysByTypologyMegaMenu({
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
                'bg-[#14232c] text-[#dce7ee] p-8 border-t border-[#b65f47]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#e07d5b] uppercase tracking-[.25em]">
                        CURATED COLLECTIONS BY TYPOLOGY
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Stays by Design Philosophy</h3>
                </div>
                <span className="text-xs text-white/50">Each property personally scouted and verified</span>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        type: 'Mid-Century Modern',
                        desc: 'Desert post-and-beam homes and Palm Springs icons.',
                        count: '24 Properties',
                    },
                    {
                        type: 'Wilderness Treehouses',
                        desc: 'Architectural cedar pods high in the Pacific Northwest canopy.',
                        count: '18 Properties',
                    },
                    {
                        type: 'Historic Watchtowers',
                        desc: 'Converted medieval stone bastions in Tuscany and Provence.',
                        count: '14 Properties',
                    },
                    {
                        type: 'Overwater Sanctuaries',
                        desc: 'Off-grid stilt pavilions over untouched coral lagoons.',
                        count: '11 Properties',
                    },
                ].map((col) => (
                    <div
                        key={col.type}
                        className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between hover:border-[#e07d5b] transition-colors"
                    >
                        <div>
                            <span className="font-mono text-[10px] text-[#e07d5b]">{col.count}</span>
                            <h4 className="mt-2 font-bold text-sm text-white">{col.type}</h4>
                            <p className="mt-1 text-xs text-white/60">{col.desc}</p>
                        </div>
                        <a
                            href="#browse-type"
                            onClick={closeMenu}
                            className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#e07d5b] font-semibold"
                        >
                            <span>Explore Collection</span>
                            <HiArrowRight />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StaysByTypologyMegaMenu

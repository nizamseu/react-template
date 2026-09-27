// ArchitecturalStaysMegaMenu

// MegaMenu01 · Booking & Reservations › Mega menus

// Description:
// A dark villa-showcase dropdown for a boutique stays / travel-booking site. A mono
// kicker "ELSEWHERE SANCTUARIES • ARCHITECTURAL RESIDENCES" tops the serif headline "Rare
// Stays Designed to Stay with You", with "100% CARBON-NEUTRAL STAYS • PRIVATE CHEF ON
// DEMAND" on the right. Three villa cards (The Clifftop Monolith, Hakone Forest Ryokan,
// Dolomites Glass Pavilion) show a photo, nightly price, rating and "Reserve Sanctuary".

// Design:
// - p-8 panel with a 2px #e07d5b top border: a wrapping flex header row over a white/10
//   bottom border, then a card grid that is one column on mobile and three at md:
// - Deep teal #102530 surface with #e3edf2 text; terracotta #e07d5b kicker, price badges,
//   card hover border, title hover and links; amber-300/400 star ratings
// - Serif text-2xl headline and bold serif card titles, font-mono text-[10px] kicker and
//   price tags; cards are rounded-lg with a white/10 border on white/5
// - The h-44 photo zooms to scale-105 on group-hover (duration-700) under a black/75 price
//   badge bottom-left; each card footer reads "Verified Architecture" beside the link

// What it does:
// - Only the three "Reserve Sanctuary" links are interactive; each calls closeMenu and goes
//   to #book-villa. Cards, photos and header text are display only; no state or effect
// - Amenity lines are JS strings, so their &bull; shows as literal "&bull;" text (e.g.
//   "Private saltwater pool &bull; Off-grid solar"); the header's JSX &bull; renders fine
// - Used by ArchitecturalStaysConciergeNavbar: <MegaMenu category="booking" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-2xl border-t-2 border-[#e07d5b] shadow-2xl bg-[#102530]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ArchitecturalStaysMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/booking/MegaMenu01';

// // Inside ArchitecturalStaysConciergeNavbar it opens from <MegaMenu category="booking" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-2xl border-t-2 border-[#e07d5b] shadow-2xl bg-[#102530]">
//         <ArchitecturalStaysMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineStar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ArchitecturalStaysMegaMenu({
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
                'bg-[#102530] text-[#e3edf2] p-8 border-t-2 border-[#e07d5b]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#e07d5b]">
                        ELSEWHERE SANCTUARIES &bull; ARCHITECTURAL RESIDENCES
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">
                        Rare Stays Designed to Stay with You
                    </h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                    <span>100% CARBON-NEUTRAL STAYS</span>
                    <span>&bull;</span>
                    <span>PRIVATE CHEF ON DEMAND</span>
                </div>
            </div>

            {/* 3 Architectural Villas */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        name: 'The Clifftop Monolith',
                        loc: 'Big Sur, California',
                        price: '$680 / night',
                        rating: '4.98 (42 stays)',
                        amenity: 'Private saltwater pool &bull; Off-grid solar',
                        img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
                    },
                    {
                        name: 'Hakone Forest Ryokan',
                        loc: 'Kanagawa, Japan',
                        price: '$540 / night',
                        rating: '5.00 (36 stays)',
                        amenity: 'Private volcanic onsen &bull; Kaiseki included',
                        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
                    },
                    {
                        name: 'Dolomites Glass Pavilion',
                        loc: 'South Tyrol, Italy',
                        price: '$720 / night',
                        rating: '4.96 (51 stays)',
                        amenity: '360° Alpine panorama &bull; Cedar sauna',
                        img: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80',
                    },
                ].map((villa) => (
                    <div
                        key={villa.name}
                        className="group overflow-hidden rounded-lg border border-white/10 bg-white/5 flex flex-col justify-between hover:border-[#e07d5b] transition-all"
                    >
                        <div className="relative h-44 overflow-hidden">
                            <img
                                src={villa.img}
                                alt={villa.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 font-mono text-[10px] text-[#e07d5b]">
                                {villa.price}
                            </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between text-[11px] text-white/50">
                                    <span>{villa.loc}</span>
                                    <span className="flex items-center gap-1 text-amber-300">
                                        <HiOutlineStar className="fill-amber-400" /> {villa.rating}
                                    </span>
                                </div>
                                <h4 className="mt-1 text-base font-serif font-bold text-white group-hover:text-[#e07d5b] transition-colors">
                                    {villa.name}
                                </h4>
                                <p className="mt-1 text-xs text-white/60">{villa.amenity}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                                <span className="text-white/40">Verified Architecture</span>
                                <a
                                    href="#book-villa"
                                    onClick={closeMenu}
                                    className="font-bold text-[#e07d5b] underline hover:text-white"
                                >
                                    Reserve Sanctuary
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ArchitecturalStaysMegaMenu

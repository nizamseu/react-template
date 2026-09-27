// CuratedGuidesMegaMenu

// MegaMenu03 · Directories & Search Aggregators › Mega menus

// Description:
// A dark editorial panel for a city directory's curated guides. The kicker "EDITORIAL
// FIELD GUIDES • TOP 25 SERIES" sits over the serif title "Curated by Architects, Chefs &
// Critics" and an "Updated Bi-Weekly" note, followed by three guide cards (Pacific
// Northwest coffee houses, Canal Saint-Martin wine cellars, Kyoto soba masters), each with
// an Unsplash cover image, title and author/location line.

// Design:
// - Header row (stacked on mobile, side by side with items-end from md:), then a card grid
//   of 1 column on mobile and 3 from md:
// - Forest #182622 surface with #d6e5df text and a #527354 top border; lime #d9f064 kicker
//   and hovered card titles; black/40 cards with white/10 borders, white/50 meta text
// - Serif text-2xl title and text-sm bold card titles; h-36 object-cover images in
//   rounded, overflow-hidden cards
// - Hover via `group`: the image zooms to scale-105 over 500ms and the title turns lime

// What it does:
// - No links or buttons: the cards look clickable (hover effects) but have no href or
//   handler, so closeMenu is never called
// - Author lines hold "&bull;" inside JS strings, so it renders as literal text; no state
//   or effects
// - Used by CityCompassThreeTierMastheadNavbar: <MegaMenu category="directory" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-lg border border-[#527354] shadow-2xl bg-[#182622]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: accepted like the other panels, but nothing in this design calls it
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CuratedGuidesMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/directory/MegaMenu03';

// // Inside CityCompassThreeTierMastheadNavbar it opens from <MegaMenu category="directory" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-lg border border-[#527354] shadow-2xl bg-[#182622]">
//         <CuratedGuidesMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function CuratedGuidesMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    // eslint-disable-next-line no-unused-vars -- kept so it is not spread onto the <div>
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
                'bg-[#182622] text-[#d6e5df] p-8 border-t border-[#527354]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-[.25em]">
                        EDITORIAL FIELD GUIDES &bull; TOP 25 SERIES
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Curated by Architects, Chefs & Critics</h3>
                </div>
                <span className="text-xs text-white/50">Updated Bi-Weekly</span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'The 25 Best Architectural Coffee Houses in the Pacific Northwest',
                        author: 'By Marcus Vance &bull; Portland & Seattle',
                        img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
                    },
                    {
                        title: 'Natural Wine Cellars & Cave à Mangers Along the Canal Saint-Martin',
                        author: 'By Chloe Laurent &bull; Paris 10ème',
                        img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
                    },
                    {
                        title: 'Secret Soba Masters & Hidden Noren Curtains of Kyoto',
                        author: 'By Kenjiro Morita &bull; Gion & Arashiyama',
                        img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
                    },
                ].map((g) => (
                    <div key={g.title} className="group overflow-hidden rounded bg-black/40 border border-white/10">
                        <img
                            src={g.img}
                            alt={g.title}
                            className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="p-4">
                            <h4 className="font-serif text-sm font-bold text-white group-hover:text-[#d9f064] transition-colors">
                                {g.title}
                            </h4>
                            <span className="mt-1 block text-[11px] text-white/50">{g.author}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CuratedGuidesMegaMenu

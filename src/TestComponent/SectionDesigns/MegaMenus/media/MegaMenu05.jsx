// ArtBookMonographMegaMenu

// MegaMenu05 · Blogs & Digital Media › Mega menus

// Description:
// The "Art Book Monograph" panel for a photography magazine or art-publisher navbar.
// Under "VISUAL ESSAYS • MONOGRAPH SERIE NO. 03" and "Photographic Folios from the
// Periphery" it shows three photo-folio cards (image, photo count, title, photographer)
// and a pre-order line ($45 USD) with an "Order Limited Print Edition →" link.

// Design:
// - Header row, a grid-cols-1 md:grid-cols-3 grid of folio cards, then a footer row
// - Dark brown #1a1816 surface, #e8e4df text, #443e39 borders and rules; peach #e7a37c
//   eyebrow, photo-count badges and order link; black/40 card fill, black/80 badges
// - Serif text-2xl title and text-sm card titles, font-mono eyebrow and badges; rounded
//   cards with h-44 images; no shadow of its own
// - Cards stack on mobile and sit three across from md:, where the header splits
//   left/right; the footer row does not wrap

// What it does:
// - Only "Order Limited Print Edition" (#order-book) calls closeMenu on click
// - The folio cards are not links: hover only zooms the image (scale-105 over 700ms)
//   and underlines the title via `group`; no state or effect
// - Used by FolioPrintEditionGridNavbar: <MegaMenu category="media" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-none border border-[#443e39] shadow-2xl bg-[#1a1816]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ArtBookMonographMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/media/MegaMenu05';

// // Inside FolioPrintEditionGridNavbar it opens from <MegaMenu category="media" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border border-[#443e39] shadow-2xl bg-[#1a1816]">
//         <ArtBookMonographMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function ArtBookMonographMegaMenu({
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
                'bg-[#1a1816] text-[#e8e4df] p-8 border-t border-[#443e39]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#443e39] pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#e7a37c] uppercase tracking-[.25em]">
                        VISUAL ESSAYS &bull; MONOGRAPH SERIE NO. 03
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Photographic Folios from the Periphery</h3>
                </div>
                <div className="text-xs text-white/50">
                    Munken Lynx Paper &bull; Printed in Gotland &bull; Limited Run of 1,000
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'The Silent Fjord: Winter in Western Greenland',
                        photographer: 'Soren Aabye',
                        image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
                        pages: '38 Photographs',
                    },
                    {
                        title: 'Shadows of Brutalism: Concrete Across the Balkans',
                        photographer: 'Milica Jovanovic',
                        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
                        pages: '44 Photographs',
                    },
                    {
                        title: 'Night Workers of the Tsukiji Archipelago',
                        photographer: 'Kenjiro Morita',
                        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
                        pages: '52 Photographs',
                    },
                ].map((folio) => (
                    <div key={folio.title} className="group overflow-hidden rounded bg-black/40 border border-[#443e39]">
                        <div className="relative h-44 overflow-hidden">
                            <img
                                src={folio.image}
                                alt={folio.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] text-[#e7a37c]">
                                {folio.pages}
                            </span>
                        </div>
                        <div className="p-4">
                            <h4 className="font-serif text-sm font-bold text-white group-hover:underline">
                                {folio.title}
                            </h4>
                            <p className="mt-1 text-xs text-white/50">By {folio.photographer}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#443e39] flex items-center justify-between text-xs">
                <span className="text-white/60">Hardcover Monograph No. 03 available for pre-order ($45 USD)</span>
                <a href="#order-book" onClick={closeMenu} className="font-bold text-[#e7a37c] underline">
                    Order Limited Print Edition &rarr;
                </a>
            </div>
        </div>
    )
}

export default ArtBookMonographMegaMenu

// VisualNotesMegaMenu

// MegaMenu05 · Portfolios & Personal Websites › Mega menus

// Description:
// A dark photo-journal dropdown for a photographer's or designer's personal site. The
// header reads "VISUAL OBSERVATIONS • CONTACT SHEET ARCHIVE" over the serif title "Forms,
// Light & Found Typography", with "Kyoto • Belgrade • Mexico City • Gotland" on the right.
// Below is a four-shot contact sheet (Daisen-in Zen Stones, Brutalist Concrete Spomenik,
// Hand-Painted Signage, Winter Baltic Sea Fog), each with a title and location caption.

// Design:
// - p-8 panel: header stacks on mobile and becomes a row at md: (md:items-end), then a grid
//   of two columns on mobile and four at md:
// - Near-black #181412 surface with #e3deda text and a white/15 border-t; coral #ef6a4b
//   appears only on the tracked font-mono eyebrow; the serif text-2xl title is white
// - Tiles are rounded black/40 cards with white/10 borders, h-32 object-cover photos and
//   a p-2.5 caption (text-xs white title, font-mono text-[9px] white/40 location)
// - Photos zoom to scale-105 on group-hover (duration-500)

// What it does:
// - Contains no links or buttons and never calls closeMenu (the prop is accepted but
//   unused), so the tiles look clickable with their hover zoom yet go nowhere
// - Purely presentational: no state or effect
// - Used by ContactSheetGridNavbar: <MegaMenu category="portfolio" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-none border border-white/20 shadow-2xl bg-[#181412]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: accepted like the other panels, but nothing in this design calls it
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VisualNotesMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/portfolio/MegaMenu05';

// // Inside ContactSheetGridNavbar it opens from <MegaMenu category="portfolio" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border border-white/20 shadow-2xl bg-[#181412]">
//         <VisualNotesMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function VisualNotesMegaMenu({
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
                'bg-[#181412] text-[#e3deda] p-8 border-t border-white/15',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#ef6a4b] uppercase tracking-[.25em]">
                        VISUAL OBSERVATIONS &bull; CONTACT SHEET ARCHIVE
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Forms, Light & Found Typography</h3>
                </div>
                <div className="text-xs text-white/50">Kyoto &bull; Belgrade &bull; Mexico City &bull; Gotland</div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        title: 'Daisen-in Zen Stones',
                        loc: 'Kyoto, Japan',
                        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
                    },
                    {
                        title: 'Brutalist Concrete Spomenik',
                        loc: 'Balkans',
                        img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
                    },
                    {
                        title: 'Hand-Painted Signage',
                        loc: 'Oaxaca, Mexico',
                        img: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=400&q=80',
                    },
                    {
                        title: 'Winter Baltic Sea Fog',
                        loc: 'Fårö, Sweden',
                        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
                    },
                ].map((shot) => (
                    <div key={shot.title} className="group overflow-hidden rounded bg-black/40 border border-white/10">
                        <img
                            src={shot.img}
                            alt={shot.title}
                            className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="p-2.5">
                            <span className="block text-xs font-semibold text-white">{shot.title}</span>
                            <span className="font-mono text-[9px] text-white/40">{shot.loc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VisualNotesMegaMenu

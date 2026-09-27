// PhotojournalismFolioGalleryCard

// Card04 · Blogs & Digital Media › Cards

// Description:
// A photo-essay card for "The Neon Rain of Kabukicho" (Visual Monograph,
// Folio 14, 18 prints) by photojournalist Marcus Chen. A black-and-white
// Tokyo street photo carries a camera/exposure data strip, followed by the
// title, a one-line summary and a "View Complete Folio" link.

// Design:
// - Single `article`: 256px-tall image frame (h-64) with an overlay strip at
//   the bottom, then meta row, title, summary and a ruled footer row
// - Dark gallery palette: card #181614, text #ede8e1 and white, peach
//   accent #e7a37c (meta row, link), overlay bg black/80 with backdrop blur,
//   borders white/15 and white/10
// - Serif text-xl bold title; monospace 10-11px meta text; rounded-2xl card
//   with rounded-xl image frame and shadow-2xl
// - No breakpoint classes: fluid width; the image uses object-cover inside
//   a fixed-height frame

// What it does:
// - Purely presentational: no content props, no state
// - Hover effect (CSS only): the photo goes from grayscale with extra
//   contrast to full colour and zooms to 105% over 700ms
// - "View Complete Folio" link points to `#view-gallery`; image is a remote
//   Unsplash photo

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PhotojournalismFolioGalleryCard from '@/TestComponent/SectionDesigns/Sections/media/Card04';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <PhotojournalismFolioGalleryCard />
//     </div>
// )
// ```

'use client'

import { HiOutlinePhotograph } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PhotojournalismFolioGalleryCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-2xl border border-white/15 bg-[#181614] p-5 text-[#ede8e1] shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative h-64 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover grayscale contrast-125 transition duration-700 hover:scale-105 hover:grayscale-0"
                    src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=85"
                    alt="Rain-slicked alleyway in Shinjuku, Tokyo"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded bg-black/80 px-3 py-1 font-mono text-[10px] text-white/80 backdrop-blur-sm">
                    <span>LEICA M10 &bull; 35MM SUMMICRON</span>
                    <span>1/125S &bull; F/2.0 &bull; ISO 800</span>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#e7a37c]">
                    <span>VISUAL MONOGRAPH &bull; FOLIO 14</span>
                    <span className="flex items-center gap-1">
                        <HiOutlinePhotograph /> 18 PRINTS
                    </span>
                </div>

                <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    The Neon Rain of Kabukicho
                </h3>
                <p className="mt-1 text-xs text-white/60">
                    A three-year documentation of nocturnal transit workers and neon sign electricians by photojournalist Marcus Chen.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/40">Archival silver gelatin prints</span>
                    <a href="#view-gallery" className="font-bold text-[#e7a37c] hover:underline">
                        View Complete Folio &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default PhotojournalismFolioGalleryCard

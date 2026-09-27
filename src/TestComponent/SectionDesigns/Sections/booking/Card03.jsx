// DolomitesGlassPavilionCard

// Card03 · Booking & Reservations › Cards

// Description:
// A dark alpine-stay listing card for the "Dolomites Alpine Glass Pavilion"
// in South Tyrol, Italy (2,100m): photo with $720 / night and 4.96 (51 stays)
// badges, a blurb on panoramic views, cedar sauna and wine cellar, an
// "Includes Alpine Guide" note and an "Explore Dates" link.

// Design:
// - Padded article: h-60 image frame with overlay price (bottom-left) and
//   rating (top-right) badges, then location row, title, blurb and a
//   bordered footer row
// - Slate #14232c surface, #dce7ee text, coral #e07d5b price, pin and CTA,
//   amber-300/400 rating star, black/80 and black/70 badges, white/10 borders
// - Serif text-xl bold title, mono badges and footer note; rounded-2xl card,
//   rounded-xl image, shadow-2xl
// - No breakpoints of its own; it fills the width of its grid cell

// What it does:
// - No content props, no state; the image itself scales to 105% on hover (700ms)
// - "Explore Dates →" is an anchor to #book-pavilion

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DolomitesGlassPavilionCard from '@/TestComponent/SectionDesigns/Sections/booking/Card03';

// const StaysGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <DolomitesGlassPavilionCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineLocationMarker, HiStar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DolomitesGlassPavilionCard({
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
                'overflow-hidden rounded-2xl border border-white/10 bg-[#14232c] p-5 text-[#dce7ee] shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative h-60 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80"
                    alt="Dolomites Alpine Glass Pavilion"
                />
                <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2.5 py-1 font-mono text-xs font-bold text-[#e07d5b]">
                    $720 / night
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    <HiStar className="fill-amber-400" /> 4.96 (51 stays)
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <HiOutlineLocationMarker className="text-[#e07d5b]" />
                    <span>South Tyrol, Italy &bull; Altitude 2,100m</span>
                </div>

                <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    Dolomites Alpine Glass Pavilion
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    360° unobstructed panoramic views of the jagged peaks. Includes private Finnish cedar barrel sauna and local biodynamic wine cellar.
                </p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <span className="font-mono text-white/40">Includes Alpine Guide</span>
                    <a href="#book-pavilion" className="font-bold text-[#e07d5b] hover:underline">
                        Explore Dates &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default DolomitesGlassPavilionCard

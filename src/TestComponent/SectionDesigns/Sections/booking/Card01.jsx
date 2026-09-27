// ClifftopVillaListingCard

// Card01 · Booking & Reservations › Cards

// Description:
// A dark luxury-stay listing card for "The Clifftop Monolith Sanctuary" in
// Big Sur, California. It shows a villa photo with price ($680 / night) and
// rating (4.98, 42 stays) badges, the location, a short architectural blurb,
// a 4 GUESTS / 2 SUITES / PRIVATE SPA spec strip and a "Reserve Villa" link.

// Design:
// - Padded article: h-64 image frame with overlay badges (price bottom-left,
//   rating top-right), then location row, title, blurb, a 3-column spec
//   grid and a footer row with "Verified Architecture" and the CTA
// - Deep teal #102530 surface, #e3edf2 text, coral #e07d5b accents (price,
//   location pin, CTA, title on hover), amber-300/400 rating star,
//   black/80 and black/70 blurred badges, white/5 spec strip
// - Serif text-xl bold title; font-mono badges and specs at text-xs and
//   text-[10px]; rounded-2xl card, rounded-xl image, white/10 borders, shadow-2xl
// - No breakpoints of its own; it fills the width of its grid cell

// What it does:
// - No content props, no state; CSS-only hover via `group`: the image zooms to
//   scale-105 over 700ms and the title turns coral
// - "Reserve Villa →" is an anchor to #reserve-villa

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ClifftopVillaListingCard from '@/TestComponent/SectionDesigns/Sections/booking/Card01';

// const StaysGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <ClifftopVillaListingCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineLocationMarker, HiStar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ClifftopVillaListingCard({
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
                'group overflow-hidden rounded-2xl border border-white/10 bg-[#102530] p-5 text-[#e3edf2] shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative h-64 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                    alt="The Clifftop Monolith Villa"
                />
                <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2.5 py-1 font-mono text-xs font-bold text-[#e07d5b] backdrop-blur-sm">
                    $680 / night
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300 backdrop-blur-sm">
                    <HiStar className="fill-amber-400" /> 4.98 (42 stays)
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <HiOutlineLocationMarker className="text-[#e07d5b]" />
                    <span>Big Sur, California &bull; Ocean Bluff</span>
                </div>

                <h3 className="mt-1 font-serif text-xl font-bold text-white group-hover:text-[#e07d5b] transition-colors">
                    The Clifftop Monolith Sanctuary
                </h3>
                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Designed by Studio Olson Kundig. 100% off-grid solar, private heated saltwater infinity pool, and dedicated private chef on call.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-1 rounded-lg bg-white/5 p-2 text-center font-mono text-[10px] text-white/70 border border-white/5">
                    <div>4 GUESTS</div>
                    <div>2 SUITES</div>
                    <div>PRIVATE SPA</div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/40">Verified Architecture</span>
                    <a href="#reserve-villa" className="font-bold text-[#e07d5b] hover:underline">
                        Reserve Villa &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default ClifftopVillaListingCard

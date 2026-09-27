// RakuPotteryMasterclassCard

// Card04 · Booking & Reservations › Cards

// Description:
// An experience-booking card for a 4-hour craft masterclass, "Raku Pottery &
// Zen Tea with Master Chiba", in a 200-year-old studio in Uji. It shows a
// Kyoto tea-ceremony photo with $190 / guest and 5.0 (48 reviews) badges,
// the description, a "Keep hand-thrown chawan" perk and a "Reserve Spot" link.

// Design:
// - Padded article: h-56 image frame with overlay price and rating badges,
//   then a mono category label, title, blurb and a bordered footer row
// - Dark teal #1a2d36 surface with white text, coral #e07d5b label, price
//   and CTA, amber-300/400 rating star, white/70 and white/40 muted copy
// - Mono uppercase tracking-widest text-[10px] label, serif text-lg bold
//   title; rounded-2xl card, rounded-xl image, white/10 border, shadow-xl
// - No breakpoints of its own; it fills the width of its grid cell

// What it does:
// - No content props, no state; the image scales to 105% on hover (700ms)
// - "Reserve Spot →" is an anchor to #reserve-masterclass

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RakuPotteryMasterclassCard from '@/TestComponent/SectionDesigns/Sections/booking/Card04';

// const ExperiencesGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <RakuPotteryMasterclassCard />
//     </div>
// )
// ```

'use client'

import { HiStar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function RakuPotteryMasterclassCard({
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
                'overflow-hidden rounded-2xl border border-white/10 bg-[#1a2d36] p-5 text-white shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="relative h-56 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
                    alt="Japanese tea ceremony and ceramics in Kyoto"
                />
                <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2 py-0.5 font-mono text-xs text-[#e07d5b]">
                    $190 / guest
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    <HiStar className="fill-amber-400" /> 5.0 (48 reviews)
                </span>
            </div>

            <div className="mt-4">
                <span className="font-mono text-[10px] text-[#e07d5b] uppercase tracking-widest">
                    CRAFT MASTERCLASS &bull; 4 HOURS
                </span>
                <h3 className="mt-1 font-serif text-lg font-bold text-white">
                    Raku Pottery & Zen Tea with Master Chiba
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    Throw and fire your own ceramic tea bowl in a 200-year-old studio in Uji, followed by a private ceremonial matcha tasting.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/40">Keep hand-thrown chawan</span>
                    <a href="#reserve-masterclass" className="font-bold text-[#e07d5b] hover:underline">
                        Reserve Spot &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default RakuPotteryMasterclassCard

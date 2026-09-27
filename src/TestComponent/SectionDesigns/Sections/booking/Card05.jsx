// FlashWeekendDealCard

// Card05 · Booking & Reservations › Cards

// Description:
// A last-minute deal card for "The Modernist Timber Lodge" in the Catskills
// (2h drive from NYC), advertising a canceled-reservation opening for
// Fri 16 – Sun 18 Oct. It highlights "SAVE 35%", a $420 special rate against
// a struck-through $650/nt, a deal-expiry readout and a "Claim Weekend Stay" button.

// Design:
// - Image-free article: header row (clock-icon deal label + SAVE 35% chip),
//   location label, title, blurb, a 2-column rate / expiry box and a
//   full-width button
// - Near-black teal #0e1d24 surface, #dae6ec text, coral #e07d5b accents
//   (40% border, 20% chip fill, rate, button), amber-300 expiry time,
//   black/40 inner box
// - Mostly font-mono with text-[9px]/[10px] labels and a text-lg font-black
//   price; serif text-xl bold title; rounded-2xl card with border-2,
//   rounded-xl box, rounded-lg button, shadow-2xl
// - No breakpoints of its own; it fills the width of its grid cell

// What it does:
// - No content props, no state; the "06h 42m 14s" countdown is static text, not a timer
// - "Claim Weekend Stay" is a type="button" with no click handler; on hover
//   it inverts to white with #0e1d24 text. No links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FlashWeekendDealCard from '@/TestComponent/SectionDesigns/Sections/booking/Card05';

// const DealsGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <FlashWeekendDealCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineClock } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function FlashWeekendDealCard({
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
                'overflow-hidden rounded-2xl border-2 border-[#e07d5b]/40 bg-[#0e1d24] p-5 text-[#dae6ec] shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#e07d5b] font-bold">
                    <HiOutlineClock /> FLASH ESCAPE DEAL &bull; THIS WEEKEND
                </span>
                <span className="rounded bg-[#e07d5b]/20 px-2 py-0.5 font-mono text-[10px] text-[#e07d5b] font-bold">
                    SAVE 35%
                </span>
            </div>

            <div className="mt-4">
                <span className="font-mono text-[10px] text-white/50">2H DRIVE FROM NYC &bull; CATSKILLS</span>
                <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    The Modernist Timber Lodge
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    Canceled reservation opening for Fri 16 &ndash; Sun 18 Oct. Heated soaking cedar tub, indoor wood stove, 40 private forested acres.
                </p>

                {/* Price and Timer Box */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-black/40 p-3 font-mono border border-white/5">
                    <div>
                        <span className="block text-[9px] text-white/40">SPECIAL RATE</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-[#e07d5b]">$420</span>
                            <span className="text-xs line-through text-white/40">$650/nt</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-[9px] text-white/40">DEAL EXPIRES</span>
                        <span className="text-sm font-bold text-amber-300">06h 42m 14s</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#e07d5b] py-2.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#0e1d24] transition-colors"
                >
                    Claim Weekend Stay
                </button>
            </div>
        </article>
    )
}

export default FlashWeekendDealCard

// FirstSuiteBoardingPassCard

// Card02 · Booking & Reservations › Cards

// Description:
// A boarding-pass style card for a flight reservation: "ELSEWHERE AIRLINES •
// FIRST SUITE", flight EW-842 from Tokyo Haneda (HND) to KEF ("Reykjavik
// Island"), 11h 45m direct. It lists seat 02A (Suite), gate 14B and a
// 22:15 JST boarding time, with a faux text barcode and a "View Itinerary" link.

// Design:
// - Dark header strip (airline + flight number), then a monospaced body with
//   an origin / duration rule / destination row, a 3-column seat / gate /
//   boarding grid between top and bottom rules, and a barcode + CTA row
// - Light paper #f7f5f0 surface, #d8e2e6 border, ink #1c2c34 text and
//   header; coral #e07d5b flight number, rust #b65f47 boarding time and CTA
//   (hover #1c2c34), gray-400/500 labels
// - Serif bold header title; mono body with font-black airport codes,
//   text-[9px]/[10px] labels; rounded-xl card with shadow-md, rounded CTA
// - Airport codes grow from text-2xl to sm:text-3xl; otherwise a fixed layout
//   that fills its grid cell

// What it does:
// - No content props, no state; the CTA background transitions on hover
// - "View Itinerary" is an anchor to #boarding-pass

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FirstSuiteBoardingPassCard from '@/TestComponent/SectionDesigns/Sections/booking/Card02';

// const TripsGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <FirstSuiteBoardingPassCard />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function FirstSuiteBoardingPassCard({
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
                'overflow-hidden rounded-xl border border-[#d8e2e6] bg-[#f7f5f0] text-[#1c2c34] shadow-md',
                className,
            )}
            {...props}
        >
            <div className="bg-[#1c2c34] p-4 text-white flex items-center justify-between">
                <span className="font-serif text-sm font-bold tracking-tight">ELSEWHERE AIRLINES &bull; FIRST SUITE</span>
                <span className="font-mono text-xs text-[#e07d5b]">FLIGHT EW-842</span>
            </div>

            <div className="p-5 font-mono">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl sm:text-3xl font-black">HND</span>
                        <span className="block text-[10px] text-gray-500 font-sans">Tokyo Haneda</span>
                    </div>
                    <div className="text-center text-xs text-gray-400">
                        <span>11h 45m</span>
                        <div className="w-16 border-t border-gray-400 my-1" />
                        <span>Direct</span>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black">KEF</span>
                        <span className="block text-[10px] text-gray-500 font-sans">Reykjavik Island</span>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-y border-gray-200 py-3 text-xs">
                    <div>
                        <span className="block text-[9px] text-gray-400">SEAT</span>
                        <span className="font-bold">02A (Suite)</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-400">GATE</span>
                        <span className="font-bold">Gate 14B</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-400">BOARDING</span>
                        <span className="font-bold text-[#b65f47]">22:15 JST</span>
                    </div>
                </div>

                {/* Barcode Graphic */}
                <div className="mt-4 flex items-center justify-between pt-1">
                    <div className="text-[10px] text-gray-400">
                        ||| | |||| | ||| || |||| | ||| || |
                    </div>
                    <a
                        href="#boarding-pass"
                        className="rounded bg-[#b65f47] px-3 py-1 text-xs font-sans font-bold text-white hover:bg-[#1c2c34] transition-colors"
                    >
                        View Itinerary
                    </a>
                </div>
            </div>
        </article>
    )
}

export default FirstSuiteBoardingPassCard

// StudioNordXGoodformDropCalendarCTA

// CTA04 · E-commerce & Marketplaces › Banner CTAs

// Description:
// Dark launch banner for the "STUDIO NORD × GOODFORM: Volcanic Ceramics & Raw Wool"
// collaboration ("100 PIECES WORLDWIDE", drop date Oct 24, 2026 · 18:00 CET). Copy
// mentions numbered pieces with engraved brass plaques and an SMS unlock link, next to a
// "Sync Drop to Calendar" toggle button.

// Design:
// - Two rows: a header (title + drop date) with border-b white/10, then copy + button;
//   the header is flex-col → md:flex-row, the action row flex-col → sm:flex-row.
// - Always dark: #1c1b18 background, white text, white/60–70 secondary text, amber-300
//   eyebrow and button hover; the button is white by default and emerald-500 once added.
// - Serif light headline text-2xl → sm:text-3xl; mono labels; rounded-full button;
//   rounded-2xl shell; padding p-8 → sm:p-10.
// - Header row stacks below md; action row stacks below sm.

// What it does:
// - State: added (boolean) toggled by the button; it swaps HiOutlineCalendar for HiCheck,
//   the label "Sync Drop to Calendar" for "Drop Added to Calendar" and white for emerald.
//   No real calendar integration.
// - No links, no content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StudioNordXGoodformDropCalendarCTA from '@/TestComponent/SectionDesigns/Sections/ecommerce/CTA04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <StudioNordXGoodformDropCalendarCTA />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { HiOutlineCalendar, HiCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function StudioNordXGoodformDropCalendarCTA({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [added, setAdded] = useState(false)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-2xl border border-white/10 bg-[#1c1b18] p-8 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                <div>
                    <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest">
                        UPCOMING COLLABORATION &bull; 100 PIECES WORLDWIDE
                    </span>
                    <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-light text-white">
                        STUDIO NORD &times; GOODFORM: Volcanic Ceramics & Raw Wool
                    </h2>
                </div>
                <div className="font-mono text-xs text-white/60 shrink-0">
                    DROP DATE: OCT 24, 2026 &bull; 18:00 CET
                </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs text-white/70 max-w-lg">
                    Each piece comes numbered with an engraved brass certification plaque. Patrons with calendar sync receive an instant SMS unlock link 10 minutes prior to drop.
                </p>

                <button
                    type="button"
                    onClick={() => setAdded(!added)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-mono font-bold transition-colors shrink-0 ${
                        added
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white text-black hover:bg-amber-300'
                    }`}
                >
                    {added ? <HiCheck /> : <HiOutlineCalendar />}
                    <span>{added ? 'Drop Added to Calendar' : 'Sync Drop to Calendar'}</span>
                </button>
            </div>
        </section>
    )
}

export default StudioNordXGoodformDropCalendarCTA

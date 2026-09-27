// OnDemandGuestMasterclassVideoCard

// Card05 · Learning Management & EdTech › Cards

// Description:
// Dark video-course card for an on-demand guest masterclass, "The Art of
// Pitching Non-Obvious Ideas" with Michael Bierut. It shows a thumbnail with a
// centred play button and "2h 38m TOTAL" runtime tag, a chapter list (one Free,
// one Locked), the price line "Lifetime Access • $85" and a "Preview" link.

// Design:
// - Single <article>: h-48 thumbnail frame with an absolutely centred play
//   button and bottom-right duration badge, then label, title, description,
//   chapter panel and a border-t footer row
// - Dark palette: #12282e background, white text (white/70, /60, /40), lime
//   #c8ef70 label, badge text and play button (#0e272f icon), black/30-80
//   overlays, image at opacity-80
// - Mono 10-11px labels, serif text-xl bold title; rounded-2xl card with
//   white/10 border and shadow-xl, rounded-xl thumbnail, rounded-full play
//   button and preview pill
// - No breakpoint classes: fluid width; image zooms on hover (scale-105) and
//   the play button grows on hover (scale-110)

// What it does:
// - No content props, no state; the play button (type="button", aria-label) and the
//   chapter rows (cursor-pointer, hover:text-white) have no click handlers
// - Single anchor "Preview" -> #watch; chapters are hard-coded, not mapped

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OnDemandGuestMasterclassVideoCard from '@/TestComponent/SectionDesigns/Sections/learning/Card05';

// const MasterclassGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <OnDemandGuestMasterclassVideoCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineClock, HiPlay } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function OnDemandGuestMasterclassVideoCard({
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
                'overflow-hidden rounded-2xl border border-white/10 bg-[#12282e] p-5 text-white shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="relative h-48 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=85"
                    alt="Masterclass lecture with industry icon"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        type="button"
                        aria-label="Play masterclass preview"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c8ef70] text-[#0e272f] shadow-lg hover:scale-110 transition-transform"
                    >
                        <HiPlay className="text-xl ml-0.5" />
                    </button>
                </div>
                <span className="absolute bottom-2.5 right-2.5 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-[#c8ef70]">
                    2h 38m TOTAL
                </span>
            </div>

            <div className="mt-4">
                <span className="font-mono text-[10px] text-[#c8ef70] uppercase tracking-widest">
                    GUEST MASTERCLASS &bull; ON DEMAND
                </span>
                <h3 className="mt-1 font-serif text-xl font-bold">
                    The Art of Pitching Non-Obvious Ideas
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    With Michael Bierut (Partner, Pentagram NY). Deconstructing 40 years of boardroom presentations.
                </p>

                {/* Chapter Timestamps */}
                <div className="mt-3 rounded-lg bg-black/30 p-2.5 text-[11px] font-mono space-y-1 text-white/70">
                    <div className="flex justify-between hover:text-white cursor-pointer">
                        <span>00:15 &bull; Deconstructing Rejection</span>
                        <span className="text-[#c8ef70]">Free</span>
                    </div>
                    <div className="flex justify-between hover:text-white cursor-pointer">
                        <span>01:05 &bull; The Anatomy of a Decisive Deck</span>
                        <span className="text-white/40">Locked</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-mono text-xs text-white/60">
                        <HiOutlineClock /> Lifetime Access &bull; $85
                    </span>
                    <a
                        href="#watch"
                        className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                    >
                        Preview &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default OnDemandGuestMasterclassVideoCard

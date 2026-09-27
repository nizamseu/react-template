// StudioEssayJournalCard

// Card05 · Portfolios & Personal Websites › Cards

// Description:
// Dark editorial card for a studio essay or field note. It shows a Stockholm
// atelier photo tagged "STOCKHOLM • STUDIO NOTE 84", an "OCT 2026 • 6 MIN READ"
// row with a bookmark icon button, the serif title "Reflections on Brutalist
// Screen Space: Why We Crave Texture Again", an excerpt and a read link.

// Design:
// - h-56 image on top, then meta row, title, excerpt and a footer row
//   ("Field Dispatch" label and link) separated by border-t.
// - Dark palette: surface #181412, text #e3deda, coral #ef6a4b (photo tag,
//   link), muted white/40-60, borders white/10-20.
// - font-serif text-xl regular title; font-mono 10-11px meta; square corners
//   (rounded-none) with shadow-xl; image at opacity-85.
// - No breakpoint classes: the card fills the width given by its parent.

// What it does:
// - No content props, no state; hovering the image zooms it to 105% (700ms).
// - Bookmark button (aria-label "Save note", HiOutlineBookmark) has no handler;
//   anchor "Read Studio Essay →" → #read-note.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StudioEssayJournalCard from '@/TestComponent/SectionDesigns/Sections/portfolio/Card05';

// const JournalGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <StudioEssayJournalCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineBookmark } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function StudioEssayJournalCard({
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
                'overflow-hidden rounded-none border border-white/20 bg-[#181412] p-5 text-[#e3deda] shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="relative h-56 overflow-hidden bg-black border border-white/10">
                <img
                    className="h-full w-full object-cover opacity-85 transition duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85"
                    alt="Atelier workspace in Stockholm"
                />
                <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-[#ef6a4b]">
                    STOCKHOLM &bull; STUDIO NOTE 84
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span>OCT 2026 &bull; 6 MIN READ</span>
                    <button aria-label="Save note" className="hover:text-white transition-colors">
                        <HiOutlineBookmark />
                    </button>
                </div>

                <h3 className="mt-1 font-serif text-xl font-normal text-white">
                    Reflections on Brutalist Screen Space: Why We Crave Texture Again
                </h3>
                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                    Flat corporate software flattened our emotional palette. Why high-fidelity typography, palpable grain, and deliberate spatial friction represent the next creative revolution.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/40">Field Dispatch</span>
                    <a href="#read-note" className="font-bold text-[#ef6a4b] hover:underline">
                        Read Studio Essay &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default StudioEssayJournalCard

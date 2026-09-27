// NeoBrutalistInvestigativeDispatchCard

// Card03 · Blogs & Digital Media › Cards

// Description:
// A breaking investigative-journalism card, "WIRE NO. 408", for the story
// "Leaked Blueprint Archives Reveal Forgotten 1968 Brutalist Masterplan".
// A pulsing red dot marks it as posted "18 MIN AGO"; an evidence box lists
// the primary source and verification status, and a link opens the dossier.

// Design:
// - Single `article`: meta row, headline and summary, a small evidence box
//   with two label/value rows, then a footer row with word count and link;
//   rows are split by 2px black rules
// - High-contrast black on white, red accent rose-600 (#e11d48) for the
//   live label and link hover, emerald-700 (#047857) for the verification
//   value, evidence box bg neutral-100 (#f5f5f5)
// - Serif text-2xl font-black headline; monospace labels; square corners
//   (rounded-none), 2px black border and a hard offset shadow
//   `6px 6px 0 #000`
// - No breakpoint classes: fluid width that fills its grid cell

// What it does:
// - Purely presentational: no content props, no state (the dot uses Tailwind's
//   `animate-ping` CSS animation)
// - "Open Dossier" link points to `#read-dispatch`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NeoBrutalistInvestigativeDispatchCard from '@/TestComponent/SectionDesigns/Sections/media/Card03';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <NeoBrutalistInvestigativeDispatchCard />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NeoBrutalistInvestigativeDispatchCard({
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
                'overflow-hidden rounded-none border-2 border-black bg-white p-5 text-black shadow-[6px_6px_0px_0px_#000]',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <span className="flex items-center gap-2 font-mono text-[10px] font-black uppercase text-rose-600">
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                    INVESTIGATIVE DISPATCH &bull; 18 MIN AGO
                </span>
                <span className="font-mono text-xs font-black">
                    WIRE NO. 408
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-2xl font-black leading-tight">
                    Leaked Blueprint Archives Reveal Forgotten 1968 Brutalist Masterplan
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-black/80 font-serif">
                    Confidential municipal dockets uncovered in Vienna disclose an unbuilt network of elevated pedestrian skyways intended to replace private automobile arteries.
                </p>

                {/* Evidence metadata badge */}
                <div className="mt-4 rounded border border-black bg-neutral-100 p-2.5 font-mono text-[11px] space-y-1">
                    <div className="flex justify-between">
                        <span className="text-black/60">PRIMARY SOURCE:</span>
                        <span className="font-bold">Vienna Municipal Archives Box 44</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-black/60">VERIFICATION:</span>
                        <span className="text-emerald-700 font-bold">Double-Blind Corroborated</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                    <span className="font-mono text-xs text-black/60">6,400 words</span>
                    <a
                        href="#read-dispatch"
                        className="inline-flex items-center gap-1 font-mono text-xs font-black uppercase tracking-wider text-black hover:text-rose-600 transition-colors"
                    >
                        <span>Open Dossier</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

export default NeoBrutalistInvestigativeDispatchCard

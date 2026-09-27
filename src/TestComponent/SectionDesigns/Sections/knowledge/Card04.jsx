// WebSocketPresenceCookbookRecipeCard

// Card04 · Knowledge Bases & Documentation › Cards

// Description:
// A terminal-style cookbook card, "COOKBOOK RECIPE #24", for "Real-Time
// Multiplayer Presence with WebSockets & Redis Pub/Sub". It notes a "15 MIN
// IMPLEMENTATION", lists the stack (Next.js 15, Node.js, Upstash Redis) and
// memory overhead, and offers a "Clone Recipe" button.

// Design:
// - Single article: header row (terminal icon + recipe number | time estimate),
//   title and summary, an inset key/value spec box, and a footer row with a top border.
// - Dark palette: background #101c17, border white/20, white text, mint accent
//   #9bd2a7 for the label, spec box black/40, emerald-400 memory value; button
//   #41715d hovering to emerald-600; shadow-xl.
// - Monospace base font with sans-serif text-base bold title; square card
//   corners (rounded-none) contrasted with a rounded-lg spec box and rounded button.
// - No breakpoint classes: the card is fluid and fills its grid cell.

// What it does:
// - Purely presentational: no content props, no state; content is hard-coded.
// - One CTA anchor, "Clone Recipe" (HiArrowRight) → #deploy-recipe.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import WebSocketPresenceCookbookRecipeCard from '@/TestComponent/SectionDesigns/Sections/knowledge/Card04';

// const DocsGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <WebSocketPresenceCookbookRecipeCard />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineTerminal } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function WebSocketPresenceCookbookRecipeCard({
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
                'overflow-hidden rounded-none border border-white/20 bg-[#101c17] p-5 text-white shadow-xl font-mono',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 text-xs text-[#9bd2a7] font-bold">
                    <HiOutlineTerminal /> COOKBOOK RECIPE #24
                </span>
                <span className="text-[10px] text-white/40">15 MIN IMPLEMENTATION</span>
            </div>

            <div className="mt-4">
                <h3 className="font-sans text-base font-bold text-white">
                    Real-Time Multiplayer Presence with WebSockets & Redis Pub/Sub
                </h3>
                <p className="mt-1 font-sans text-xs text-white/60">
                    Production recipe for handling 100,000 concurrent cursor positions with delta-compression binary protocols.
                </p>

                <div className="mt-3 space-y-1.5 rounded-lg bg-black/40 p-3 text-xs border border-white/5">
                    <div className="flex justify-between">
                        <span className="text-white/40">STACK:</span>
                        <span className="text-white/80">Next.js 15 &bull; Node.js &bull; Upstash Redis</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/40">MEMORY OVERHEAD:</span>
                        <span className="text-emerald-400 font-bold">&lt; 14 MB per pod</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">Tested on Edge</span>
                    <a
                        href="#deploy-recipe"
                        className="inline-flex items-center gap-1 rounded bg-[#41715d] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                    >
                        <span>Clone Recipe</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

export default WebSocketPresenceCookbookRecipeCard

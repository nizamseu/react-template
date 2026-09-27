// CommunityCodeBountyCard

// Card05 · Social Networks & Communities › Cards

// Description:
// A dark, developer-oriented card for "ACTIVE COMMUNITY BOUNTY #89": build a GLSL fluid particle
// collision React hook, paying $850 USD and "FUNDED IN ESCROW". It lists the tech stack (React Three
// Fiber, Three.js), the deadline (14 days remaining), review status (3 draft PRs), the difficulty
// and offers a "Claim Quest" link.

// Design:
// - Stacked card: header row (bounty label + escrow badge), title with the reward aligned right
//   (items-baseline), description, a key/value details panel, then a footer row
// - Palette: dark brown #291f1b with white text, peach #ffccad accents and CTA, emerald-400 on
//   emerald-500/20 escrow badge, white/40-80 secondary text, black/40 details panel; dark theme
// - Typography & shapes: the whole card is font-mono with a font-sans title and description;
//   font-black xl reward; rounded-xl card with shadow-xl, rounded-lg panel, rounded CTA
// - Responsive: no breakpoint classes; the card fills the width of its grid cell

// What it does:
// - Purely presentational: no content props, no state
// - Anchor "Claim Quest" → #claim-bounty with a code icon and a hover-to-white background

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CommunityCodeBountyCard from '@/TestComponent/SectionDesigns/Sections/community/Card05';

// const CommunityCards = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <CommunityCodeBountyCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineCode, HiOutlineLightningBolt } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CommunityCodeBountyCard({
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
                'overflow-hidden rounded-xl border border-white/10 bg-[#291f1b] p-5 text-white shadow-xl font-mono',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 text-xs text-[#ffccad] font-bold">
                    <HiOutlineLightningBolt /> ACTIVE COMMUNITY BOUNTY #89
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    FUNDED IN ESCROW
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="font-sans text-base font-bold text-white">
                        Build a GLSL Fluid Particle Collision Hook
                    </h3>
                    <span className="text-xl font-black text-[#ffccad]">$850 USD</span>
                </div>
                <p className="mt-1 font-sans text-xs text-white/60">
                    Create a lightweight React 19 hook that handles 50,000 instanced particles colliding with pointer vectors at 60fps.
                </p>

                <div className="mt-4 space-y-1.5 rounded-lg bg-black/40 p-3 text-xs border border-white/5">
                    <div className="flex justify-between">
                        <span className="text-white/40">TECH STACK:</span>
                        <span className="text-white/80">React Three Fiber &bull; Three.js</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/40">DEADLINE:</span>
                        <span className="text-white/80">14 Days Remaining</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/40">SUBMISSIONS:</span>
                        <span className="text-[#ffccad]">3 Draft PRs Under Review</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">Difficulty: Medium</span>
                    <a
                        href="#claim-bounty"
                        className="inline-flex items-center gap-1 rounded bg-[#ffccad] px-3 py-1.5 text-xs font-bold text-[#291f1b] hover:bg-white transition-colors"
                    >
                        <HiOutlineCode />
                        <span>Claim Quest</span>
                    </a>
                </div>
            </div>
        </article>
    )
}

export default CommunityCodeBountyCard

// GuildMemberSpotlightCard

// Card04 · Social Networks & Communities › Cards

// Description:
// A dark profile card for the monthly "GUILD MEMBER SPOTLIGHT" (Oct 2026) featuring Elena Rostova
// (@elena_design, Berlin Chapter Lead), flagged as a top 1% contributor. It shows her avatar, focus
// areas, three contribution stats (84 PRs merged, 142 crits given, 6,480 community karma), her
// membership year and a "View Guild Profile" button.

// Design:
// - Stacked card: header row (spotlight label + star badge), avatar + identity row, a 3-column stats
//   panel, then a footer row with "Member since 2022" and a button
// - Palette: near-black brown #1e1715 with white text, peach #ffccad labels, avatar ring and stat
//   values, amber-300 / amber-400 star badge, white/10 borders and a black/40 stats panel; dark theme
// - Typography & shapes: mono uppercase micro-labels (9-10px), bold base-size name; rounded-2xl card
//   with shadow-xl, 56px round avatar with a 2px border, rounded-xl stats panel, pill button
// - Responsive: no breakpoint classes; the stats grid stays three columns at all widths

// What it does:
// - Purely presentational: no content props, no state
// - "View Guild Profile" is a type="button" that inverts on hover (white background, black text)
//   but has no click handler (visual only)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GuildMemberSpotlightCard from '@/TestComponent/SectionDesigns/Sections/community/Card04';

// const CommunityCards = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <GuildMemberSpotlightCard />
//     </div>
// )
// ```

'use client'

import { HiStar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function GuildMemberSpotlightCard({
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
                'overflow-hidden rounded-2xl border border-white/10 bg-[#1e1715] p-5 text-white shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffccad] font-bold">
                    GUILD MEMBER SPOTLIGHT &bull; OCT 2026
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-amber-300 font-bold">
                    <HiStar className="fill-amber-400" /> TOP 1% CONTRIBUTOR
                </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
                <img
                    className="h-14 w-14 rounded-full object-cover border-2 border-[#ffccad]"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Member avatar"
                />
                <div>
                    <h3 className="text-base font-bold text-white">Elena Rostova</h3>
                    <p className="font-mono text-xs text-[#ffccad]">@elena_design &bull; Berlin Chapter Lead</p>
                    <span className="text-[11px] text-white/50">Focus: Spatial Typography & Sound Design</span>
                </div>
            </div>

            {/* Contribution Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-black/40 p-3 text-center text-xs font-mono border border-white/5">
                <div>
                    <span className="block text-[9px] text-white/40">PRs MERGED</span>
                    <span className="font-bold text-[#ffccad]">84</span>
                </div>
                <div>
                    <span className="block text-[9px] text-white/40">CRITS GIVEN</span>
                    <span className="font-bold text-[#ffccad]">142</span>
                </div>
                <div>
                    <span className="block text-[9px] text-white/40">COMMUNITY KARMA</span>
                    <span className="font-bold text-[#ffccad]">6,480</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/50">Member since 2022</span>
                <button
                    type="button"
                    className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                >
                    View Guild Profile
                </button>
            </div>
        </article>
    )
}

export default GuildMemberSpotlightCard

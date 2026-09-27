// LiveVoiceStageRoomCard

// Card01 · Social Networks & Communities › Cards

// Description:
// A dark "live audio room" card announcing a voice-stage session, "Bootstrapping to $50k MRR:
// Real Metrics & Brutal Hardships", an open-mic roundtable with four indie founders. It shows the
// live listener count (84 tuned in), overlapping speaker avatars, who is currently speaking
// ("Elena Speaking...") and a "Join Stage Audio" button.

// Design:
// - Stacked card: header row (live badge + "STAGE #04"), serif title and summary, an inset speaker
//   panel (avatars left, mic indicator right) and a footer row with a "Free to join" note + button
// - Palette: very dark brown #241c19 with #f7e6de text, peach #ffccad accents and button,
//   emerald-400 live dot and mic, white/10 borders and a black/40 inset panel; dark theme
// - Typography & shapes: mono uppercase micro-labels (10px / xs), serif xl bold title; rounded-2xl
//   card with shadow-2xl, rounded-xl inset panel, round avatars overlapping (-space-x-2), pill button
// - Responsive: no breakpoint classes; the card fills the width of its grid cell

// What it does:
// - No content props or state; the live dot and microphone icon pulse via Tailwind animate-pulse
// - Speaker avatars are mapped from an inline array of three Unsplash image URLs
// - "Join Stage Audio" is a type="button" with a hover colour change but no click handler (visual only)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LiveVoiceStageRoomCard from '@/TestComponent/SectionDesigns/Sections/community/Card01';

// const CommunityCards = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <LiveVoiceStageRoomCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineMicrophone } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LiveVoiceStageRoomCard({
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
                'overflow-hidden rounded-2xl border border-white/10 bg-[#241c19] p-5 text-[#f7e6de] shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-2 font-mono text-[10px] text-[#ffccad] uppercase tracking-wider font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE VOICE STAGE &bull; 84 TUNED IN
                </span>
                <span className="font-mono text-xs text-white/50">STAGE #04</span>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-xl font-bold text-white leading-tight">
                    Bootstrapping to $50k MRR: Real Metrics & Brutal Hardships
                </h3>
                <p className="mt-1 text-xs text-white/60">
                    Open microphone roundtable with 4 indie founders on churn reduction, pricing tiers, and surviving founder burnout.
                </p>

                {/* Speaker avatars & pulsing voice indicator */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-black/40 p-3 border border-white/5">
                    <div className="flex -space-x-2">
                        {[
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
                        ].map((src, idx) => (
                            <img
                                key={idx}
                                src={src}
                                alt="Speaker"
                                className="h-9 w-9 rounded-full object-cover border-2 border-[#241c19]"
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-[#ffccad]">
                        <HiOutlineMicrophone className="text-emerald-400 animate-pulse" />
                        <span>Elena Speaking...</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-xs text-white/40">Free to join</span>
                    <button
                        type="button"
                        className="rounded-full bg-[#ffccad] px-4 py-1.5 font-mono text-xs font-bold text-[#241c19] hover:bg-white transition-colors"
                    >
                        Join Stage Audio
                    </button>
                </div>
            </div>
        </article>
    )
}

export default LiveVoiceStageRoomCard

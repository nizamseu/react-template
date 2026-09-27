// TokyoChapterMeetupRSVPCard

// Card03 · Social Networks & Communities › Cards

// Description:
// A peach event card for in-person "OFFLINE CHAPTER MEETUP #14": "Tokyo Creative Technology &
// Generative Aesthetics" on THU, NOV 07 at 6:30 PM JST, Roppongi Hills Hub (Studio 4, Minato City).
// It highlights free entry and RSVP progress (42 / 50 attendees, only 8 seats left) and ends with a
// full-width "RSVP for Free Pass" button.

// Design:
// - Stacked card: header row (meetup label + FREE ENTRY chip), date line, serif title, location
//   line, an RSVP-status panel, then a full-width button
// - Palette: peach #ffccad card, dark brown #27201d text and button, rust #a34c38 labels, date and
//   button hover, white/70 inset panel, rose-700 scarcity note; light and warm
// - Typography & shapes: mono uppercase micro-labels, serif xl bold title, font-black attendee
//   count; rounded-2xl card with shadow-md, rounded-xl panel, rounded-lg button
// - Responsive: no breakpoint classes; the card fills the width of its grid cell

// What it does:
// - No content props or state; calendar and location-marker icons from react-icons/hi
// - "RSVP for Free Pass" is a type="button" with a hover colour change but no click handler (visual only)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TokyoChapterMeetupRSVPCard from '@/TestComponent/SectionDesigns/Sections/community/Card03';

// const CommunityCards = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <TokyoChapterMeetupRSVPCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineCalendar, HiOutlineLocationMarker } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TokyoChapterMeetupRSVPCard({
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
                'overflow-hidden rounded-2xl border border-black/10 bg-[#ffccad] p-5 text-[#27201d] shadow-md',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider font-black text-[#a34c38]">
                    OFFLINE CHAPTER MEETUP #14
                </span>
                <span className="rounded bg-black/10 px-2 py-0.5 font-mono text-[10px] font-bold">
                    FREE ENTRY
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#a34c38]">
                    <HiOutlineCalendar /> THU, NOV 07 &bull; 6:30 PM JST
                </div>
                <h3 className="mt-1 font-serif text-xl font-bold leading-tight">
                    Tokyo Creative Technology & Generative Aesthetics
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#27201d]/75">
                    <HiOutlineLocationMarker /> Roppongi Hills Hub, Studio 4, Minato City
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-white/70 p-3 text-xs border border-black/5">
                    <div>
                        <span className="block font-mono text-[10px] text-black/50">CONFIRMED RSVPS</span>
                        <span className="font-black text-sm text-[#27201d]">42 / 50 Attendees</span>
                    </div>
                    <span className="font-mono text-[10px] text-rose-700 font-bold">
                        Only 8 Seats Left
                    </span>
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#27201d] py-2.5 font-mono text-xs font-bold text-white hover:bg-[#a34c38] transition-colors"
                >
                    <span>RSVP for Free Pass</span>
                </button>
            </div>
        </article>
    )
}

export default TokyoChapterMeetupRSVPCard

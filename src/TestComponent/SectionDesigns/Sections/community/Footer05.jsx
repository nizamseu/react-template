// CommunityCalendarCenteredFooter

// Footer05 · Social Networks & Communities › Footers

// Description:
// A minimal, centred white footer that promotes the community calendar: the eyebrow "The community
// calendar", the headline "Save a seat for something good." and a note about monthly meetups, new
// groups and member-made things, followed by a "See upcoming events" button and the copyright line
// "© Commonroom · Made for people, not feeds."

// Design:
// - Single centred column (max-w-xl, text-center) above a full-width copyright row with a border-t
// - Palette: white background, beige #e7d4c8 outer border and #eee4de divider, dark brown #27201d
//   text and pill button, rust #a34c38 eyebrow, gray-500 body; light and clean
// - Typography & shapes: uppercase bold eyebrow (tracking .14em), font-black text-3xl headline,
//   text-sm body; rounded-lg footer with a 1px border, rounded-full CTA
// - Responsive: no breakpoint classes; the centred layout simply narrows on small screens

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "See upcoming events" → #calendar (HiArrowRight icon); no other footer links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CommunityCalendarCenteredFooter from '@/TestComponent/SectionDesigns/Sections/community/Footer05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CommunityCalendarCenteredFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CommunityCalendarCenteredFooter({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <footer
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-lg border border-[#e7d4c8] bg-white p-7 text-[#27201d]',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-xl text-center">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a34c38]">
                    The community calendar
                </p>
                <h2 className="mt-2 text-3xl font-black">
                    Save a seat for something good.
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Monthly meetups, new groups, and member-made things.
                </p>
                <a
                    href="#calendar"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#27201d] px-5 py-3 text-sm text-white"
                >
                    See upcoming events <HiArrowRight />
                </a>
            </div>
            <p className="mt-8 border-t border-[#eee4de] pt-4 text-center text-xs text-gray-500">
                © Commonroom · Made for people, not feeds.
            </p>
        </footer>
    )
}

export default CommunityCalendarCenteredFooter

// CityChaptersRightAlignedNavbar

// Navbar02 · Social Networks & Communities › Navbars

// Description:
// A light header for "COMMONROOM • CITY", the in-person city-chapter side of the community. The
// mono wordmark sits alone on the left while everything else is pushed right: a "City Chapters"
// mega menu, links to Upcoming Meetups, Host Chapter and Event Grants, and an outlined "RSVP Pass"
// button.

// Design:
// - Flex row with the brand far left and a right-flush group (ml-auto) holding the nav + CTA
// - Palette: off-white #fcf8f5 background, dark brown #2c1d18 text (links at 70% opacity), rust
//   #a34c38 for the "• CITY" suffix, the mega-menu trigger, the 2px bottom border and the outlined
//   CTA; light feel
// - Typography & shapes: mono uppercase wordmark (text-sm, font-black, tracking-wider), xs semibold
//   links; square bar (rounded-none) with a rounded-full outline button that fills rust on hover
// - Responsive: the nav (including the mega menu) is hidden below md with no mobile toggle, leaving
//   the logo and the "RSVP Pass" button; padding px-5 → sm:px-8

// What it does:
// - Renders the shared MegaMenu (category "community", variant 2, label "City Chapters", accent
//   #a34c38): the trigger toggles on click and opens on keyboard focus; the panel is portaled to
//   document.body below this header and closes on Escape, on blur or shortly after the pointer leaves
// - No own props or state; anchors: logo → #home, #meetups, #host, #grants, CTA → #rsvp
// - Its mega menu panel is CityChaptersMegaMenu in MegaMenus/community/MegaMenu02.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CityChaptersRightAlignedNavbar from '@/TestComponent/SectionDesigns/Sections/community/Navbar02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CityChaptersRightAlignedNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function CityChaptersRightAlignedNavbar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <header
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-none border-b-2 border-[#a34c38] bg-[#fcf8f5] px-5 py-4 text-[#2c1d18] sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-mono text-sm font-black uppercase tracking-wider shrink-0">
                    COMMONROOM <span className="text-[#a34c38]">&bull; CITY</span>
                </a>

                {/* Right-Flush Navigation & RSVP Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="community"
                            accent="#a34c38"
                            variant={2}
                            label="City Chapters"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#a34c38] hover:text-[#2c1d18] transition-colors cursor-pointer"
                        />
                        <a href="#meetups" className="text-[#2c1d18]/70 hover:text-[#2c1d18] transition-colors">
                            Upcoming Meetups
                        </a>
                        <a href="#host" className="text-[#2c1d18]/70 hover:text-[#2c1d18] transition-colors">
                            Host Chapter
                        </a>
                        <a href="#grants" className="text-[#2c1d18]/70 hover:text-[#2c1d18] transition-colors">
                            Event Grants
                        </a>
                    </nav>

                    <a
                        href="#rsvp"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#a34c38] px-4 py-1.5 text-xs font-bold text-[#a34c38] hover:bg-[#a34c38] hover:text-white transition-colors shrink-0"
                    >
                        <span>RSVP Pass</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default CityChaptersRightAlignedNavbar

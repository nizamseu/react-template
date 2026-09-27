// CommonroomGuildsPeachNavbar

// Navbar01 · Social Networks & Communities › Navbars

// Description:
// A light peach site header for the COMMONROOM community. The wordmark sits on the left next to a
// left-aligned nav (a "Guilds & Spaces" mega menu plus Explore Spaces, Member Directory and
// Community Charter links); on the right are a pulsing "2,420 Online" indicator and a "Join Guild"
// pill button.

// Design:
// - Single flex row (justify-between): brand + nav grouped on the left (gap-10), live counter + CTA
//   on the right
// - Palette: peach #ffccad background, dark brown #27201d text (links at 75% opacity), rust #a34c38
//   for "ROOM", the mega-menu trigger, the online dot/label and the CTA (hover black); black/10
//   bottom border; light and warm
// - Typography & shapes: font-black xl wordmark, xs semibold links, mono xs counter and CTA;
//   square-edged bar (rounded-none, border-b-2) with a rounded-full button
// - Responsive: the nav links and mega menu are hidden below md, the online counter below sm;
//   there is no mobile menu toggle, so small screens show only the logo and "Join Guild"

// What it does:
// - Renders the shared MegaMenu (category "community", variant 1, label "Guilds & Spaces", accent
//   #a34c38): the trigger toggles on click and opens on keyboard focus; the panel is portaled to
//   document.body below this header and closes on Escape, on blur or shortly after the pointer leaves
// - No own props or state; anchors: logo → #home, #spaces, #directory, #manifesto, CTA → #join
// - Its mega menu panel is GuildsSpacesMegaMenu in MegaMenus/community/MegaMenu01.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CommonroomGuildsPeachNavbar from '@/TestComponent/SectionDesigns/Sections/community/Navbar01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CommonroomGuildsPeachNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function CommonroomGuildsPeachNavbar({
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
                'rounded-none border-b-2 border-black/10 bg-[#ffccad] px-5 py-4 text-[#27201d] sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="text-xl font-black tracking-tight shrink-0">
                        COMMON<span className="text-[#a34c38]">ROOM</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="community"
                            accent="#a34c38"
                            variant={1}
                            label="Guilds & Spaces"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#a34c38] hover:text-[#27201d] transition-colors cursor-pointer"
                        />
                        <a href="#spaces" className="text-[#27201d]/75 hover:text-[#27201d] transition-colors">
                            Explore Spaces
                        </a>
                        <a href="#directory" className="text-[#27201d]/75 hover:text-[#27201d] transition-colors">
                            Member Directory
                        </a>
                        <a href="#manifesto" className="text-[#27201d]/75 hover:text-[#27201d] transition-colors">
                            Community Charter
                        </a>
                    </nav>
                </div>

                {/* Right Live Active & Join Action */}
                <div className="flex items-center gap-5">
                    <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-[#a34c38]">
                        <span className="h-2 w-2 rounded-full bg-[#a34c38] animate-pulse" />
                        2,420 Online
                    </span>
                    <a
                        href="#join"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#a34c38] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-black transition-colors"
                    >
                        <span>Join Guild</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default CommonroomGuildsPeachNavbar

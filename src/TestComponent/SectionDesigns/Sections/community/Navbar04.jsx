// PeerQAFloatingPillNavbar

// Navbar04 · Social Networks & Communities › Navbars

// Description:
// A floating, capsule-shaped dark header for "COMMON/Q&A", a peer question-and-answer community.
// It holds a "Peer Q&A" mega menu, links to Unanswered (14), Active Bounties and Leaderboard, and a
// peach "Ask Question" pill on the right.

// Design:
// - Transparent outer header (py-2 px-3) wrapping a centred max-w-5xl rounded-full bar with brand,
//   nav and CTA in one justify-between row
// - Palette: dark brown #291f1b bar with white text, rust #a34c38 border, peach #ffccad for the
//   slash, the mega-menu trigger and the CTA (hover white), white/70 links; a dark pill that sits on
//   any page background
// - Typography & shapes: mono uppercase micro-brand with wide tracking (.18em), xs semibold links;
//   fully rounded bar with shadow-xl and a rounded-full button
// - Responsive: the nav (including the mega menu) is hidden below md with no mobile toggle, leaving
//   the brand and "Ask Question"; the bar is capped at max-w-5xl and centred on wide screens

// What it does:
// - Renders the shared MegaMenu (category "community", variant 4, label "Peer Q&A", accent
//   #ffccad): the trigger toggles on click and opens on keyboard focus; the panel is portaled to
//   document.body below this header and closes on Escape, on blur or shortly after the pointer leaves
// - No own props or state; anchors: brand → #home, #unanswered, #bounties, #karma, CTA → #ask
// - Its mega menu panel is PeerQAMegaMenu in MegaMenus/community/MegaMenu04.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PeerQAFloatingPillNavbar from '@/TestComponent/SectionDesigns/Sections/community/Navbar04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PeerQAFloatingPillNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function PeerQAFloatingPillNavbar({
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
            className={cn('py-2 px-3', className)}
            {...props}
        >
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-[#a34c38] bg-[#291f1b] px-6 py-2.5 text-white shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-black uppercase tracking-[.18em] shrink-0"
                >
                    COMMON<span className="text-[#ffccad]">/</span>Q&A
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-semibold md:flex">
                    <MegaMenu
                        category="community"
                        accent="#ffccad"
                        variant={4}
                        label="Peer Q&A"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#ffccad] hover:text-white transition-colors cursor-pointer"
                    />
                    <a href="#unanswered" className="text-white/70 hover:text-white transition-colors">
                        Unanswered (14)
                    </a>
                    <a href="#bounties" className="text-white/70 hover:text-white transition-colors">
                        Active Bounties
                    </a>
                    <a href="#karma" className="text-white/70 hover:text-white transition-colors">
                        Leaderboard
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#ask"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#ffccad] px-4 py-1.5 font-mono text-xs font-bold text-[#291f1b] hover:bg-white transition-colors shrink-0"
                >
                    <span>Ask Question</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

export default PeerQAFloatingPillNavbar

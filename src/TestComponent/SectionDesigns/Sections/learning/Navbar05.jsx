// MentorResidencyThreeColumnGridNavbar

// Navbar05 · Learning Management & EdTech › Navbars

// Description:
// Dark, ruled three-cell header for "FIELDNOTE / MENTOR". The brand cell shows a
// "COHORT 08" tag; the middle strip holds a "Mentorship Residency" mega menu plus
// links to 1-on-1 Crits, Guest Directors and Placement; the admissions cell shows
// "3 SPOTS REMAIN" with an "APPLY" link.

// Design:
// - Grid: one column on mobile, `md:grid-cols-[240px_1fr_200px]` on desktop,
//   with 2px white/20 dividers (divide-y-2 -> md:divide-x-2)
// - Dark palette: #102d36 background, white / white-70 text, lime #c8ef70
//   accents (wordmark suffix, trigger, status), border-2 white/20
// - Serif text-lg wordmark with a mono xs suffix, mono uppercase tracking-wider
//   nav, mono xs bold status; square corners (rounded-none), editorial grid feel
// - Cells stack vertically below md with horizontal dividers; the nav strip stays
//   visible and scrolls horizontally (overflow-x-auto); "12 STUDENTS PER
//   COHORT" appears from lg

// What it does:
// - No content props and no local state; interactivity comes from MegaMenu
//   (category="learning", variant={5}, accent #c8ef70): its trigger toggles on
//   click and opens on focus, rendering the mentor directory / 1-on-1 office
//   hours panel in a portal fixed below the header; it closes 160 ms after the
//   pointer leaves, when focus moves outside, or on Escape
// - Anchors: #home, #roster, #guest, #outcomes, and "APPLY" -> #apply-residency

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MentorResidencyThreeColumnGridNavbar from '@/TestComponent/SectionDesigns/Sections/learning/Navbar05';

// const SiteLayout = ({ children }) => (
//     <>
//         <MentorResidencyThreeColumnGridNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function MentorResidencyThreeColumnGridNavbar({
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
                'rounded-none border-2 border-white/20 bg-[#102d36] text-white',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_200px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/20">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg tracking-tight">
                        FIELDNOTE <span className="font-mono text-xs text-[#c8ef70]">/ MENTOR</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/50">COHORT 08</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="learning"
                            accent="#c8ef70"
                            variant={5}
                            label="Mentorship Residency"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#c8ef70] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#roster" className="text-white/70 hover:text-white transition-colors">
                            1-on-1 Crits
                        </a>
                        <a href="#guest" className="text-white/70 hover:text-white transition-colors">
                            Guest Directors
                        </a>
                        <a href="#outcomes" className="text-white/70 hover:text-white transition-colors">
                            Placement
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#c8ef70]">
                        12 STUDENTS PER COHORT
                    </span>
                </div>

                {/* Column 3: Admissions Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span className="text-[#c8ef70]">3 SPOTS REMAIN</span>
                    <a
                        href="#apply-residency"
                        className="flex items-center gap-1 text-white hover:text-[#c8ef70] transition-colors"
                    >
                        <span>APPLY &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default MentorResidencyThreeColumnGridNavbar

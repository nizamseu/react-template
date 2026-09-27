// FieldnoteClassStudentPortalNavbar

// Navbar02 · Learning Management & EdTech › Navbars

// Description:
// Light cream header with the serif "FIELDNOTE CLASS" wordmark on the far left
// and a right-flush group: a "Live Studio" mega menu, links to Workshops,
// Syllabus Index and Mentorship, and an outlined "Student Portal" button for
// enrolled learners.

// Design:
// - Flex row, justify-between; nav and portal button pushed right (ml-auto, gap-8)
// - Light palette: cream #f5f1e8 background, #102d36 text (links at /75),
//   forest green #3c7e5d mega menu trigger/accent, #dce5dc bottom border;
//   portal button fills #102d36 with white text on hover
// - Serif text-2xl bold wordmark, xs semibold links; square header
//   (rounded-none), rounded-full outlined button with a 1px #102d36 border
// - Nav (including the mega menu) is hidden below md with no mobile toggle, so
//   only the wordmark and "Student Portal" remain; padding px-5 -> sm:px-8

// What it does:
// - No content props and no local state; interactivity comes from MegaMenu
//   (category="learning", variant={2}, accent #3c7e5d): its trigger toggles on
//   click and opens on focus, rendering the weekly live-session calendar panel
//   in a portal fixed below the header; it closes 160 ms after the pointer
//   leaves, when focus moves outside, or on Escape
// - Anchors: #home, #workshops, #syllabus, #mentors, and "Student Portal"
//   -> #portal (HiArrowRight)
// - Its mega menu panel is LiveStudioCalendarMegaMenu in MegaMenus/learning/MegaMenu02.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FieldnoteClassStudentPortalNavbar from '@/TestComponent/SectionDesigns/Sections/learning/Navbar02';

// const SiteLayout = ({ children }) => (
//     <>
//         <FieldnoteClassStudentPortalNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FieldnoteClassStudentPortalNavbar({
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
                'rounded-none border-b border-[#dce5dc] bg-[#f5f1e8] px-5 py-4 text-[#102d36] sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-serif text-2xl font-bold tracking-tight shrink-0">
                    FIELDNOTE CLASS
                </a>

                {/* Right-Flush Navigation & Student Portal Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="learning"
                            accent="#3c7e5d"
                            variant={2}
                            label="Live Studio"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#3c7e5d] hover:text-[#102d36] transition-colors cursor-pointer"
                        />
                        <a href="#workshops" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                            Workshops
                        </a>
                        <a href="#syllabus" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                            Syllabus Index
                        </a>
                        <a href="#mentors" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                            Mentorship
                        </a>
                    </nav>

                    <a
                        href="#portal"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#102d36] px-4 py-1.5 text-xs font-semibold text-[#102d36] hover:bg-[#102d36] hover:text-white transition-colors shrink-0"
                    >
                        <span>Student Portal</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default FieldnoteClassStudentPortalNavbar

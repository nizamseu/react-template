// FieldnoteCohortAdmissionsNavbar

// Navbar01 · Learning Management & EdTech › Navbars

// Description:
// Dark full-width header for the "fieldnote." learning studio. On the left the
// serif wordmark sits next to a "Curriculum Tracks" mega menu and links to Live
// Cohorts, Faculty and Tuition & Aid; on the right a pulsing "Next Cohort: Oct 15"
// status chip and a lime "Apply Now" button drive admissions.

// Design:
// - One flex row, justify-between: left group (wordmark + nav, gap-10) and
//   right group (status chip + CTA, gap-4)
// - Dark palette: #0e272f background, white / white-80 links, lime #c8ef70
//   accent (wordmark dot, mega menu trigger, chip text and dot, CTA), #1b3e49
//   chip, white/10 bottom border
// - Serif text-2xl bold wordmark, xs semibold links, mono 10px chip, mono xs
//   font-black uppercase CTA; square header (rounded-none), rounded-full chip
//   and CTA, animate-pulse status dot
// - Nav (including the mega menu) is hidden below md and there is no mobile
//   menu toggle; status chip appears from lg; padding px-5 -> sm:px-8

// What it does:
// - No content props and no local state; interactivity comes from MegaMenu
//   (category="learning", variant={1}, accent #c8ef70): its trigger toggles on
//   click and opens on focus, rendering the curriculum-tracks / cohort panel in
//   a portal fixed below the header; it closes 160 ms after the pointer leaves,
//   when focus moves outside, or on Escape
// - Anchors: #home (wordmark), #cohorts, #faculty, #tuition, and "Apply Now"
//   -> #apply (HiArrowRight)
// - Its mega menu panel is AcademyCurriculumTracksMegaMenu in MegaMenus/learning/MegaMenu01.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FieldnoteCohortAdmissionsNavbar from '@/TestComponent/SectionDesigns/Sections/learning/Navbar01';

// const SiteLayout = ({ children }) => (
//     <>
//         <FieldnoteCohortAdmissionsNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FieldnoteCohortAdmissionsNavbar({
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
                'rounded-none border-b border-white/10 bg-[#0e272f] px-5 py-4 text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="font-serif text-2xl font-bold tracking-tight shrink-0">
                        fieldnote<span className="text-[#c8ef70]">.</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="learning"
                            accent="#c8ef70"
                            variant={1}
                            label="Curriculum Tracks"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#c8ef70] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#cohorts" className="text-white/80 hover:text-white transition-colors">
                            Live Cohorts
                        </a>
                        <a href="#faculty" className="text-white/80 hover:text-white transition-colors">
                            Faculty
                        </a>
                        <a href="#tuition" className="text-white/80 hover:text-white transition-colors">
                            Tuition & Aid
                        </a>
                    </nav>
                </div>

                {/* Right Status & Application CTA */}
                <div className="flex items-center gap-4">
                    <span className="hidden lg:inline-flex items-center gap-2 rounded-full bg-[#1b3e49] px-3 py-1 font-mono text-[10px] text-[#c8ef70]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#c8ef70] animate-pulse" />
                        Next Cohort: Oct 15
                    </span>
                    <a
                        href="#apply"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#c8ef70] px-4 py-2 font-mono text-xs font-black uppercase text-[#0e272f] hover:bg-white transition-colors"
                    >
                        <span>Apply Now</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default FieldnoteCohortAdmissionsNavbar

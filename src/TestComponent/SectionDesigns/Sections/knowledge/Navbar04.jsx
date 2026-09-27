// TeamHandbookFloatingPillNavbar

// Navbar04 · Knowledge Bases & Documentation › Navbars

// Description:
// A floating, pill-shaped header for an internal engineering handbook branded
// "HANDBOOK/TEAM". It offers a "Cookbook Recipes" mega menu, links to
// Engineering Standards, Day-One Setup and CI/CD Pipelines, and a dark "Clone
// Template" pill button.

// Design:
// - Outer header with small padding (py-2 px-3) wrapping a centered pill
//   (max-w-5xl mx-auto, rounded-full) laid out as brand · nav · action.
// - Light sage palette: pill background #e8f0eb, border #cde0d3, text #17231f,
//   accent #41715d (slash in the wordmark, mega menu trigger, button hover),
//   links #17231f/75; button background #17231f with white text; shadow-xl.
// - Monospace bold uppercase text-xs wordmark with wide tracking (.18em);
//   text-xs semibold links; fully rounded pill container and button.
// - The nav is hidden below md with no mobile menu toggle; the wordmark and
//   "Clone Template" button remain on small screens.

// What it does:
// - No content props or own state. "Cookbook Recipes" is the shared MegaMenu (category
//   "knowledge", variant 4, accent #41715d): toggles on click or opens on focus,
//   closes on pointer leave (160ms delay), Escape or blur, and portals a
//   "1-Click Deployable Production Architectures" panel below the header.
// - Anchors: brand → #home, #standards, #onboarding, #ci-cd, and the "Clone
//   Template" CTA (HiOutlineCode icon) → #git-clone.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TeamHandbookFloatingPillNavbar from '@/TestComponent/SectionDesigns/Sections/knowledge/Navbar04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <TeamHandbookFloatingPillNavbar />
//     </main>
// )
// ```

'use client'

import { HiOutlineCode } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function TeamHandbookFloatingPillNavbar({
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
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-[#cde0d3] bg-[#e8f0eb] px-6 py-2.5 text-[#17231f] shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-bold uppercase tracking-[.18em] shrink-0"
                >
                    HANDBOOK<span className="text-[#41715d]">/</span>TEAM
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-semibold md:flex">
                    <MegaMenu
                        category="knowledge"
                        accent="#41715d"
                        variant={4}
                        label="Cookbook Recipes"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#41715d] hover:text-black transition-colors cursor-pointer"
                    />
                    <a href="#standards" className="text-[#17231f]/75 hover:text-[#17231f] transition-colors">
                        Engineering Standards
                    </a>
                    <a href="#onboarding" className="text-[#17231f]/75 hover:text-[#17231f] transition-colors">
                        Day-One Setup
                    </a>
                    <a href="#ci-cd" className="text-[#17231f]/75 hover:text-[#17231f] transition-colors">
                        CI/CD Pipelines
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#git-clone"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#17231f] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#41715d] transition-colors shrink-0"
                >
                    <HiOutlineCode />
                    <span>Clone Template</span>
                </a>
            </div>
        </header>
    )
}

export default TeamHandbookFloatingPillNavbar

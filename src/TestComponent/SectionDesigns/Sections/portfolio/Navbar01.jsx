// CoralDesignDirectorNavbar

// Navbar01 · Portfolios & Personal Websites › Navbars

// Description:
// Coral header for "JP / Design Director". The monogram brand is followed by a
// left-flush nav: a "Selected Works" mega menu plus About, Awards (26) and
// Field Notes links. The right side shows an "AVAILABLE Q4" status and a dark
// "Commission Work" pill button.

// Design:
// - One flex row (justify-between): brand and nav grouped on the left (gap-10),
//   availability and CTA grouped on the right.
// - Warm palette: coral #ef6a4b background, text #241d1a, border-b-2 black/15;
//   CTA #241d1a (hover black) with white text; MegaMenu accent #241d1a.
// - Brand font-black uppercase with tracking-[.14em]; xs bold uppercase nav
//   links (hover opacity-75); mono availability text; rounded-full CTA; square
//   header (rounded-none).
// - The nav is hidden below md with no mobile menu in its place; the
//   availability text is hidden below sm; padding px-5 → sm:px-8.

// What it does:
// - No content props or local state; "Selected Works" is a MegaMenu (category
//   "portfolio", variant 1). It toggles on click or keyboard focus, stays open
//   while hovered, closes 160ms after the pointer leaves, on blur or on Escape,
//   and portals a dark case-study panel (four selected works) below the header.
// - Anchors: brand → #home, #about, #awards, #notes; CTA → #contact.
// - Its mega menu panel is SelectedWorksMegaMenu in MegaMenus/portfolio/MegaMenu01.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CoralDesignDirectorNavbar from '@/TestComponent/SectionDesigns/Sections/portfolio/Navbar01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CoralDesignDirectorNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function CoralDesignDirectorNavbar({
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
                'rounded-none border-b-2 border-black/15 bg-[#ef6a4b] px-5 py-4 text-[#241d1a] sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#home"
                        className="text-base font-black uppercase tracking-[.14em] shrink-0"
                    >
                        JP<span className="ml-2 font-normal text-xs">/ Design Director</span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs uppercase font-bold tracking-wider md:flex">
                        <MegaMenu
                            category="portfolio"
                            accent="#241d1a"
                            variant={1}
                            label="Selected Works"
                            triggerClassName="inline-flex items-center gap-1 text-xs uppercase font-bold tracking-wider hover:opacity-75 transition-opacity cursor-pointer"
                        />
                        <a href="#about" className="hover:opacity-75 transition-opacity">
                            About
                        </a>
                        <a href="#awards" className="hover:opacity-75 transition-opacity">
                            Awards (26)
                        </a>
                        <a href="#notes" className="hover:opacity-75 transition-opacity">
                            Field Notes
                        </a>
                    </nav>
                </div>

                {/* Right Availability & Action */}
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline font-mono text-xs text-[#241d1a]/80 font-bold">
                        AVAILABLE Q4
                    </span>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#241d1a] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-black transition-colors"
                    >
                        <span>Commission Work</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default CoralDesignDirectorNavbar

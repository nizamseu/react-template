// LearnLabFloatingPillNavbar

// Navbar04 · Learning Management & EdTech › Navbars

// Description:
// Floating lime pill navigation for the "LEARN/LAB" creative-coding lab. It holds
// the mono wordmark, an "Experiment Lab" mega menu, links to Sandboxes, Weekly
// Crits and GLSL Shaders, and a dark "Enroll (4 Left)" button that signals
// scarcity.

// Design:
// - Padded <header> wrapping a centred max-w-5xl rounded-full bar; flex row
//   with justify-between
// - Bright palette: lime #c8ef70 bar, #102d36 text and CTA background (black on
//   hover), #3c7e5d slash in the wordmark, black/10 border, shadow-xl
// - Mono xs font-black uppercase wordmark (.2em tracking), xs bold uppercase
//   tracking-wider links, mono xs bold CTA; fully rounded pill shapes
// - Nav (including the mega menu) is hidden below md with no mobile toggle, so
//   only the wordmark and Enroll button remain

// What it does:
// - No content props and no local state; interactivity comes from MegaMenu
//   (category="learning", variant={4}, accent #102d36): its trigger toggles on
//   click and opens on focus, rendering the weekend experiment-lab panel in a
//   portal fixed below the header; it closes 160 ms after the pointer leaves,
//   when focus moves outside, or on Escape
// - Anchors: #home, #sandbox, #challenges, #shaders, and "Enroll (4 Left)"
//   -> #enroll (HiArrowRight)
// - Its mega menu panel is CreativeExperimentLabMegaMenu in MegaMenus/learning/MegaMenu04.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LearnLabFloatingPillNavbar from '@/TestComponent/SectionDesigns/Sections/learning/Navbar04';

// const SiteLayout = ({ children }) => (
//     <>
//         <LearnLabFloatingPillNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function LearnLabFloatingPillNavbar({
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
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-black/10 bg-[#c8ef70] px-6 py-2.5 text-[#102d36] shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-black uppercase tracking-[.2em] shrink-0"
                >
                    LEARN<span className="text-[#3c7e5d]">/</span>LAB
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wider md:flex">
                    <MegaMenu
                        category="learning"
                        accent="#102d36"
                        variant={4}
                        label="Experiment Lab"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#102d36] hover:opacity-75 transition-opacity cursor-pointer"
                    />
                    <a href="#sandbox" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                        Sandboxes
                    </a>
                    <a href="#challenges" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                        Weekly Crits
                    </a>
                    <a href="#shaders" className="text-[#102d36]/75 hover:text-[#102d36] transition-colors">
                        GLSL Shaders
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#enroll"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#102d36] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-black transition-colors shrink-0"
                >
                    <span>Enroll (4 Left)</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

export default LearnLabFloatingPillNavbar

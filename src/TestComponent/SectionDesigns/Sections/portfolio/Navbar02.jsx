// KineticLabTerminalNavbar

// Navbar02 · Portfolios & Personal Websites › Navbars

// Description:
// Black, monospace header for "JP / KINETIC LAB", a creative-coding identity.
// The brand sits far left; a right-aligned group holds a "Shader Laboratory"
// mega menu, links to Experiments, GLSL Shaders and Source, and an outlined
// "Launch Reel" button.

// Design:
// - One flex row: brand on the left, then an ml-auto group (nav + CTA, gap-8)
//   pushed to the right.
// - Dark palette: #111111 background, white text, border-b white/20; coral
//   #ef6a4b for the brand, mega menu trigger and CTA outline (the CTA fills
//   coral with black text on hover); links white/70 → white.
// - font-mono xs throughout; brand bold uppercase with tracking-[.2em];
//   square (rounded-none) outlined CTA.
// - The nav is hidden below md with no mobile menu in its place; brand and
//   "Launch Reel" stay visible; padding px-5 → sm:px-8.

// What it does:
// - No content props or local state; "Shader Laboratory" is a MegaMenu (category
//   "portfolio", variant 2) that toggles on click or keyboard focus, closes on
//   pointer leave (160ms), blur or Escape, and portals a "WebGL / WebGPU
//   Sandbox" panel of experiments below the header.
// - Anchors: brand → #home, #experiments, #shaders, #source; CTA → #reel.
// - Its mega menu panel is ShaderLaboratoryMegaMenu in MegaMenus/portfolio/MegaMenu02.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import KineticLabTerminalNavbar from '@/TestComponent/SectionDesigns/Sections/portfolio/Navbar02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <KineticLabTerminalNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function KineticLabTerminalNavbar({
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
                'rounded-none border-b border-white/20 bg-[#111111] px-5 py-3.5 text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a
                    href="#home"
                    className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#ef6a4b] shrink-0"
                >
                    JP / KINETIC LAB
                </a>

                {/* Right-Flush Navigation & Reel Action Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 font-mono text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0 md:flex">
                        <MegaMenu
                            category="portfolio"
                            accent="#ef6a4b"
                            variant={2}
                            label="Shader Laboratory"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#ef6a4b] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#experiments" className="text-white/70 hover:text-white transition-colors">
                            Experiments
                        </a>
                        <a href="#shaders" className="text-white/70 hover:text-white transition-colors">
                            GLSL Shaders
                        </a>
                        <a href="#source" className="text-white/70 hover:text-white transition-colors">
                            Source
                        </a>
                    </nav>

                    <a
                        href="#reel"
                        className="inline-flex items-center gap-1.5 rounded-none border border-[#ef6a4b] px-3.5 py-1.5 font-mono text-xs font-bold text-[#ef6a4b] hover:bg-[#ef6a4b] hover:text-black transition-colors shrink-0"
                    >
                        <span>Launch Reel</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default KineticLabTerminalNavbar

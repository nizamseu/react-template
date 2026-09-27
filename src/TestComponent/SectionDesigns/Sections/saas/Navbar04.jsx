// FlowstateAIFloatingPillNavbar

// Navbar04 · SaaS Platforms › Navbars

// Description:
// A floating, pill-shaped light header for "FLOWSTATE/AI", an AI tooling product.
// It holds the mono wordmark, an "AI Command Center" mega menu, the links Model
// Router, Live Evals and Agent Mesh, and a dark "Launch Sandbox" pill button.

// Design:
// - The outer <header> has small padding (py-2 px-3) and wraps a centred max-w-5xl
//   capsule laid out as a flex row (justify-between).
// - Sage #edf3ee capsule with a black/10 border, ink #111a22 text and gray-600
//   links. The green accent #17a878 is used for the slash, the trigger and the CTA
//   hover. The CTA background is #111a22, and the capsule has shadow-xl and
//   backdrop-blur-md.
// - Typography: mono xs bold uppercase wordmark with tracking-[.18em]; xs semibold
//   links. The capsule and CTA are rounded-full.
// - Responsive: nav links are hidden below md (md:flex), leaving the brand and CTA.
//   There is no mobile menu toggle.

// What it does:
// - Embeds <MegaMenu category="saas" variant={4} label="AI Command Center"
//   accent="#17a878" />, which opens the "Command Center & Feature Matrix" panel
//   (command-palette style search bar, quick action chips). Clicking the trigger
//   toggles it and focusing it opens it. The panel is portal-rendered below the
//   header and closes on mouse leave (160 ms delay), blur or Escape.
// - Anchors: `#home`, `#models`, `#evals`, `#agents`, CTA `#sandbox`. No content props or
//   local state.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FlowstateAIFloatingPillNavbar from '@/TestComponent/SectionDesigns/Sections/saas/Navbar04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <FlowstateAIFloatingPillNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FlowstateAIFloatingPillNavbar({
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
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-black/10 bg-[#edf3ee] px-6 py-2.5 text-[#111a22] shadow-xl backdrop-blur-md">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-bold uppercase tracking-[.18em] shrink-0"
                >
                    FLOWSTATE<span className="text-[#17a878]">/</span>AI
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-semibold md:flex">
                    <MegaMenu
                        category="saas"
                        accent="#17a878"
                        variant={4}
                        label="AI Command Center"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#17a878] hover:text-black transition-colors cursor-pointer"
                    />
                    <a href="#models" className="text-gray-600 hover:text-black transition-colors">
                        Model Router
                    </a>
                    <a href="#evals" className="text-gray-600 hover:text-black transition-colors">
                        Live Evals
                    </a>
                    <a href="#agents" className="text-gray-600 hover:text-black transition-colors">
                        Agent Mesh
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#sandbox"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#111a22] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#17a878] transition-colors shrink-0"
                >
                    <span>Launch Sandbox</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

export default FlowstateAIFloatingPillNavbar

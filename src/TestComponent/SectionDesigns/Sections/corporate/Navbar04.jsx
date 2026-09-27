// ResearchInstituteFloatingPillNavbar

// Navbar04 · Corporate & Business › Navbars

// Description:
// Floating pill-shaped header for the "NORTHSTAR/INSTITUTE" research arm. It holds the
// wordmark, a nav with a "Research Institute" mega menu plus Macro Outlook, Geopolitical
// Risk and Whitepapers links, and a "Subscribe to Dispatch" pill button.

// Design:
// - Transparent outer <header> (py-2 px-3) wrapping a centred pill bar (mx-auto max-w-5xl,
//   flex justify-between, px-6 py-2.5)
// - Pill bar in navy #0d1520 with a #3476c5/30 border, shadow-xl and backdrop-blur-md;
//   sky-blue #84b9ff wordmark, trigger and button (text #0d1520, hover:bg-white); nav
//   links white/70 -> hover white
// - All font-mono text-xs; wordmark bold uppercase tracking-[.18em]; rounded-full bar and
//   button
// - Below md the nav (mega menu included) hides with no mobile menu, leaving the wordmark
//   and the subscribe button

// What it does:
// - No content props or local state; MegaMenu (category="corporate", variant={4}, accent #84b9ff)
//   toggles on trigger click, opens on keyboard focus, and closes on Escape, focus loss,
//   ~160 ms after the pointer leaves, or when a panel link is clicked
// - Its panel is sized against the outer <header> (not the pill) and lists three mapped
//   peer-reviewed papers with dates, citations and preprint links
// - Anchors: #home, #macro, #geopolitics, #quarterly (labelled "Whitepapers") and the CTA
//   #subscribe-research (with HiArrowRight)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ResearchInstituteFloatingPillNavbar from '@/TestComponent/SectionDesigns/Sections/corporate/Navbar04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ResearchInstituteFloatingPillNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function ResearchInstituteFloatingPillNavbar({
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
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-[#3476c5]/30 bg-[#0d1520] px-6 py-2.5 text-white shadow-xl backdrop-blur-md">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-bold uppercase tracking-[.18em] text-[#84b9ff] shrink-0"
                >
                    NORTHSTAR<span className="text-white/40">/</span>INSTITUTE
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-mono text-white/70 md:flex">
                    <MegaMenu
                        category="corporate"
                        accent="#84b9ff"
                        variant={4}
                        label="Research Institute"
                        triggerClassName="inline-flex items-center gap-1 font-mono text-xs text-[#84b9ff] hover:text-white transition-colors cursor-pointer"
                    />
                    <a href="#macro" className="hover:text-white transition-colors">
                        Macro Outlook
                    </a>
                    <a href="#geopolitics" className="hover:text-white transition-colors">
                        Geopolitical Risk
                    </a>
                    <a href="#quarterly" className="hover:text-white transition-colors">
                        Whitepapers
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#subscribe-research"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#84b9ff] px-4 py-1.5 font-mono text-xs font-bold text-[#0d1520] hover:bg-white transition-colors shrink-0"
                >
                    <span>Subscribe to Dispatch</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

export default ResearchInstituteFloatingPillNavbar

// AdvisoryPracticesMegaMenuNavbar

// Navbar01 · Corporate & Business › Navbars

// Description:
// Dark single-row header for "NORTHSTAR/ADVISORY". The wordmark sits next to a
// left-aligned nav with an "Advisory Practices" mega menu plus Capabilities, Case Studies
// and Senior Partners links; the right side holds a "Client Portal" link and a
// "Schedule Advisory" pill button.

// Design:
// - flex justify-between: left group (brand + nav, gap-10) and right group (portal link +
//   pill, gap-5)
// - Navy #0e1724 background with a white/10 bottom border; white text, nav links white/75
//   -> hover white; sky-blue #84b9ff for the wordmark slash, mega menu trigger and pill
//   (text #0e1724, hover:bg-white)
// - Wordmark text-sm bold tracking-[.18em]; nav text-xs font-medium; font-mono portal link
//   and pill; square header (rounded-none), rounded-full pill
// - Below md the whole nav (mega menu included) is hidden with no mobile menu or
//   hamburger; below sm the Client Portal link is hidden; padding px-5 -> sm:px-8

// What it does:
// - No content props or local state; MegaMenu (category="corporate", variant={1}, accent #84b9ff)
//   manages its own open state: clicking the trigger toggles the panel and keyboard focus
//   opens it; it closes on Escape, when focus leaves, ~160 ms after the pointer leaves
//   trigger and panel, or when a panel link is clicked
// - The panel is portalled to document.body and fixed flush under this header at its full
//   width; it shows office cities, practice columns (M&A & Capital Strategy, AI & Digital
//   Transformation, ESG & Energy Transition) and an Executive Briefing download card
// - Anchors: #home, #capabilities, #case-studies, #partners, #portal and the CTA
//   #consultation (with HiArrowRight)
// - Its mega menu panel is GlobalAdvisoryPracticesMegaMenu in MegaMenus/corporate/MegaMenu01.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AdvisoryPracticesMegaMenuNavbar from '@/TestComponent/SectionDesigns/Sections/corporate/Navbar01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <AdvisoryPracticesMegaMenuNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function AdvisoryPracticesMegaMenuNavbar({
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
                'rounded-none border-b border-white/10 bg-[#0e1724] px-5 py-4 text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a href="#home" className="text-sm font-bold tracking-[.18em] shrink-0">
                        NORTHSTAR<span className="text-[#84b9ff]">/</span>ADVISORY
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-medium text-white/75 md:flex">
                        <MegaMenu
                            category="corporate"
                            accent="#84b9ff"
                            variant={1}
                            label="Advisory Practices"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#84b9ff] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#capabilities" className="hover:text-white transition-colors">
                            Capabilities
                        </a>
                        <a href="#case-studies" className="hover:text-white transition-colors">
                            Case Studies
                        </a>
                        <a href="#partners" className="hover:text-white transition-colors">
                            Senior Partners
                        </a>
                    </nav>
                </div>

                {/* Right Client Portal & Consultation Action */}
                <div className="flex items-center gap-5">
                    <a href="#portal" className="hidden sm:inline font-mono text-xs text-white/60 hover:text-white transition-colors">
                        Client Portal
                    </a>
                    <a
                        href="#consultation"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#84b9ff] px-4 py-2 font-mono text-xs font-bold text-[#0e1724] hover:bg-white transition-colors"
                    >
                        <span>Schedule Advisory</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default AdvisoryPracticesMegaMenuNavbar

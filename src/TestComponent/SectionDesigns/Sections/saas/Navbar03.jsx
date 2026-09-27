// NorthstarEnterpriseThreeTierMastheadNavbar

// Navbar03 · SaaS Platforms › Navbars

// Description:
// A dark, three-tier enterprise header:
// - a monospace micro-ticker ("Northstar global edge mesh • 142 locations
//   worldwide", compliance badges, "All systems normal");
// - a masthead with the "NORTHSTAR ENTERPRISE PLATFORM" wordmark and a "Contact
//   Solutions Architect" link;
// - a bottom nav shelf ("Solutions Matrix" mega menu, Real-Time Data Pipelines,
//   Zero-Trust Mesh, Edge Functions, 99.999% SLA) with an "Enterprise tier" tag.

// Design:
// - <header> made of three stacked rows separated by #263640 borders. The bottom
//   shelf uses a darker #0c1318 background.
// - Base #111a22 with #263640 borders (border-y), a mint #65e6b4 accent and
//   white/40-70 secondary text. The header has shadow-lg.
// - Typography: 10px mono ticker, a bold tracking-tight masthead at
//   text-xl -> sm:text-2xl, and xs semibold nav links. The header is rounded-none.
// - Responsive: the ticker's compliance text and the architect link are hidden
//   below sm, and the "Enterprise tier" tag only shows from lg. The bottom nav is
//   always visible and scrolls horizontally (overflow-x-auto) on narrow screens.

// What it does:
// - Embeds <MegaMenu category="saas" variant={3} label="Solutions Matrix"
//   accent="#65e6b4" />, which opens the "Solutions by Team & Industry Matrix"
//   panel. Clicking the trigger toggles it and focusing it opens it. The panel is
//   portal-rendered below the header and closes on mouse leave (160 ms delay),
//   blur or Escape.
// - Anchors: `#home`, `#talk-architect`, `#pipelines`, `#security`, `#serverless`,
//   `#sla`. No content props or local state.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NorthstarEnterpriseThreeTierMastheadNavbar from '@/TestComponent/SectionDesigns/Sections/saas/Navbar03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NorthstarEnterpriseThreeTierMastheadNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function NorthstarEnterpriseThreeTierMastheadNavbar({
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
                'rounded-none border-y border-[#263640] bg-[#111a22] text-white shadow-lg',
                className,
            )}
            {...props}
        >
            {/* Top Micro-Ticker */}
            <div className="border-b border-[#263640] px-5 py-1.5 font-mono text-[10px] text-white/50 flex items-center justify-between sm:px-8">
                <span>NORTHSTAR GLOBAL EDGE MESH &bull; 142 LOCATIONS WORLDWIDE</span>
                <span className="hidden sm:inline">SOC2 TYPE II &bull; HIPAA &bull; ISO 27001 AUDITED</span>
                <span className="text-[#65e6b4]">ALL SYSTEMS NORMAL</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="text-xl sm:text-2xl font-bold tracking-tight">
                    NORTHSTAR ENTERPRISE PLATFORM
                </a>
                <a
                    href="#talk-architect"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#65e6b4] hover:underline"
                >
                    <span>Contact Solutions Architect &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-[#263640] bg-[#0c1318] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="saas"
                            accent="#65e6b4"
                            variant={3}
                            label="Solutions Matrix"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#65e6b4] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#pipelines" className="text-white/70 hover:text-white transition-colors">
                            Real-Time Data Pipelines
                        </a>
                        <a href="#security" className="text-white/70 hover:text-white transition-colors">
                            Zero-Trust Mesh
                        </a>
                        <a href="#serverless" className="text-white/70 hover:text-white transition-colors">
                            Edge Functions
                        </a>
                        <a href="#sla" className="text-white/70 hover:text-white transition-colors">
                            99.999% SLA
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 hidden lg:inline">
                        ENTERPRISE TIER
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default NorthstarEnterpriseThreeTierMastheadNavbar

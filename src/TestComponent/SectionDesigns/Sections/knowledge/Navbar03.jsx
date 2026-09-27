// NorthstarAPIKernelThreeTierMasthead

// Navbar03 · Knowledge Bases & Documentation › Navbars

// Description:
// A dark, three-row developer knowledge-base header for "NORTHSTAR DEVELOPER
// KNOWLEDGE BASE & KERNEL". A monospace ticker lists spec formats and SDK
// languages, the masthead shows the brand and a "Manage API Keys" link, and a
// bottom shelf holds the "Trust Architecture" mega menu plus deep-dive topics
// (Idempotency Keys, Rate Limit Algorithms, Signed Webhooks, RPC Benchmarks).

// Design:
// - Three stacked rows separated by white/10 borders: top micro-ticker, middle
//   masthead (brand left, API-keys link right), bottom navigation shelf on a
//   darker band.
// - Dark forest palette: background #121f1a, shelf #0e1713, outer border-y
//   #41715d/30, mint accent #9bd2a7 (ticker, icon, trigger, link), links white/70,
//   meta white/60 and white/40; shadow-xl.
// - Monospace text-[10px] ticker; monospace bold text-sm tracking-wider brand
//   with a HiOutlineCode icon; text-xs semibold links; square corners (rounded-none).
// - Padding px-5 → sm:px-8; the middle ticker item and "Manage API Keys" are
//   hidden below sm, "PRODUCTION GRADE" shows only from lg. The bottom nav stays
//   visible on all sizes and scrolls horizontally (overflow-x-auto).

// What it does:
// - No content props or own state. "Trust Architecture" is the shared MegaMenu (category
//   "knowledge", variant 3, accent #9bd2a7): toggles on click or opens on focus,
//   closes on pointer leave (160ms delay), Escape or blur, and portals an
//   "Enterprise Compliance & Guarantees" panel below the header.
// - Anchors: brand → #home, #api-keys, #idempotency, #rate-limits, #webhooks and
//   #benchmarks.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NorthstarAPIKernelThreeTierMasthead from '@/TestComponent/SectionDesigns/Sections/knowledge/Navbar03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NorthstarAPIKernelThreeTierMasthead />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineCode } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function NorthstarAPIKernelThreeTierMasthead({
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
                'rounded-none border-y border-[#41715d]/30 bg-[#121f1a] text-white shadow-xl',
                className,
            )}
            {...props}
        >
            {/* Top Micro-Ticker */}
            <div className="border-b border-white/10 px-5 py-1.5 font-mono text-[10px] text-[#9bd2a7] flex items-center justify-between sm:px-8">
                <span>OPENAPI 3.1 SPECIFICATION &bull; REST &bull; GRAPHQL &bull; GRPC SCHEMAS</span>
                <span className="hidden sm:inline">OFFICIAL SDKS FOR TYPESCRIPT, PYTHON, GO, RUST</span>
                <span className="text-white/60">KERNEL v4.12</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a
                    href="#home"
                    className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider text-white"
                >
                    <HiOutlineCode className="text-lg text-[#9bd2a7]" />
                    <span>NORTHSTAR DEVELOPER KNOWLEDGE BASE & KERNEL</span>
                </a>
                <a
                    href="#api-keys"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#9bd2a7] hover:underline"
                >
                    <span>Manage API Keys &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-white/10 bg-[#0e1713] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="knowledge"
                            accent="#9bd2a7"
                            variant={3}
                            label="Trust Architecture"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#9bd2a7] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#idempotency" className="text-white/70 hover:text-white transition-colors">
                            Idempotency Keys
                        </a>
                        <a href="#rate-limits" className="text-white/70 hover:text-white transition-colors">
                            Rate Limit Algorithms
                        </a>
                        <a href="#webhooks" className="text-white/70 hover:text-white transition-colors">
                            Signed Webhooks
                        </a>
                        <a href="#benchmarks" className="text-white/70 hover:text-white transition-colors">
                            RPC Benchmarks
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 hidden lg:inline">
                        PRODUCTION GRADE
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default NorthstarAPIKernelThreeTierMasthead

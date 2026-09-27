// SignalStackModularGridNavbar

// Navbar05 · SaaS Platforms › Navbars

// Description:
// A dark, modular three-cell header for "SIGNAL / STACK" (v4.18):
// - a brand cell with a version tag;
// - a navigation strip ("Integrations" mega menu, Kafka Bus, Distributed PG,
//   OpenTelemetry) with a "Zero egress fees" note;
// - a live telemetry cell with a pulsing "14ms P99" and a "CONSOLE →" link.

// Design:
// - <header> with a 2px #263640 border. The inner grid is
//   `md:grid-cols-[240px_1fr_220px]`, split by 2px dividers (divide-y-2 on mobile,
//   md:divide-x-2 from md).
// - Base #17232c with #263640 dividers, a mint #65e6b4 accent, an emerald-400
//   pulse dot and white/50-70 secondary text.
// - Typography: font-mono throughout; xs uppercase tracking-wider nav and 10px
//   tags. Everything is rounded-none, giving a blocky, brutalist feel.
// - Responsive: below md the cells stack in one column with horizontal dividers;
//   from md they form three columns. The nav strip scrolls horizontally
//   (overflow-x-auto), and "Zero egress fees" only shows from lg.

// What it does:
// - Embeds <MegaMenu category="saas" variant={5} label="Integrations"
//   accent="#65e6b4" />, which opens the "App Ecosystem & Integration Marketplace"
//   panel. Clicking the trigger toggles it and focusing it opens it. The panel is
//   portal-rendered below the header and closes on mouse leave (160 ms delay),
//   blur or Escape.
// - Anchors: `#home`, `#kafka`, `#postgres`, `#otel`. "CONSOLE →" points to
//   `#docs`. The status dot uses animate-pulse. No content props or local state.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SignalStackModularGridNavbar from '@/TestComponent/SectionDesigns/Sections/saas/Navbar05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SignalStackModularGridNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function SignalStackModularGridNavbar({
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
                'rounded-none border-2 border-[#263640] bg-[#17232c] text-white',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#263640]">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-mono text-sm font-bold tracking-tight">
                        SIGNAL <span className="text-[#65e6b4]">/ STACK</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/50">v4.18</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="saas"
                            accent="#65e6b4"
                            variant={5}
                            label="Integrations"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#65e6b4] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#kafka" className="text-white/70 hover:text-white transition-colors">
                            Kafka Bus
                        </a>
                        <a href="#postgres" className="text-white/70 hover:text-white transition-colors">
                            Distributed PG
                        </a>
                        <a href="#otel" className="text-white/70 hover:text-white transition-colors">
                            OpenTelemetry
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#65e6b4]">
                        ZERO EGRESS FEES
                    </span>
                </div>

                {/* Column 3: Live Telemetry Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs">14ms P99</span>
                    </div>
                    <a
                        href="#docs"
                        className="flex items-center gap-1 text-[#65e6b4] hover:underline"
                    >
                        <span>CONSOLE &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default SignalStackModularGridNavbar

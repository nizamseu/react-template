// SignalDevDeveloperConsoleNavbar

// Navbar02 · SaaS Platforms › Navbars

// Description:
// A dark, terminal-flavoured header for the developer platform "signal.dev", with a
// ">_" prompt glyph in the logo. The navigation is right-aligned: a "Developers &
// API" mega menu, then Documentation, Benchmarks and Status, followed by an
// outlined "Console Login" button.

// Design:
// - <header> with a flex row. The brand is far left, and the nav + CTA group is
//   pushed right with ml-auto (gap-8).
// - Dark #0e161c background with a #263640 bottom border and white text (nav
//   white/75). The mint accent #65e6b4 is used for the prompt, ".dev", the trigger
//   and the outlined CTA, which fills mint with #0e161c text on hover.
// - Typography: font-mono throughout; xs links and an uppercase tracking-wider
//   trigger. The header is rounded-none, and the CTA is rounded with a 1px mint
//   border.
// - Responsive: nav links are hidden below md (md:flex), leaving only the brand and
//   Console Login. Padding goes px-5 -> sm:px-8. There is no mobile menu toggle.

// What it does:
// - Embeds <MegaMenu category="saas" variant={2} label="Developers & API"
//   accent="#65e6b4" />, which opens the "Modern Developer & API Hub" panel (SDKs,
//   code snippet preview, changelog). Clicking the trigger toggles it and focusing
//   it opens it. The panel is portal-rendered below the header and closes on mouse
//   leave (160 ms delay), blur or Escape.
// - Anchors: `#home`, `#docs`, `#benchmarks`, `#status`, `#console`. No content props or
//   local state.
// - Its mega menu panel is DeveloperAPIHubMegaMenu in MegaMenus/saas/MegaMenu02.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SignalDevDeveloperConsoleNavbar from '@/TestComponent/SectionDesigns/Sections/saas/Navbar02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SignalDevDeveloperConsoleNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function SignalDevDeveloperConsoleNavbar({
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
                'rounded-none border-b border-[#263640] bg-[#0e161c] px-5 py-3.5 text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-mono text-sm font-bold tracking-tight shrink-0 flex items-center gap-2">
                    <span className="text-[#65e6b4]">&gt;_</span>
                    <span>signal<span className="text-[#65e6b4]">.dev</span></span>
                </a>

                {/* Right-Flush Navigation & Console Login Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 font-mono text-xs text-white/75 md:flex">
                        <MegaMenu
                            category="saas"
                            accent="#65e6b4"
                            variant={2}
                            label="Developers & API"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#65e6b4] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#docs" className="hover:text-white transition-colors">
                            Documentation
                        </a>
                        <a href="#benchmarks" className="hover:text-white transition-colors">
                            Benchmarks
                        </a>
                        <a href="#status" className="hover:text-white transition-colors">
                            Status
                        </a>
                    </nav>

                    <a
                        href="#console"
                        className="inline-flex items-center gap-1.5 rounded border border-[#65e6b4] px-3.5 py-1.5 font-mono text-xs font-bold text-[#65e6b4] hover:bg-[#65e6b4] hover:text-[#0e161c] transition-colors shrink-0"
                    >
                        <span>Console Login</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default SignalDevDeveloperConsoleNavbar

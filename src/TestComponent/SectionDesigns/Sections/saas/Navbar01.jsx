// NorthstarPlatformSuiteNavbar

// Navbar01 · SaaS Platforms › Navbars

// Description:
// A clean product header for "northstar/" that adapts to dark mode. It has a
// green-dot wordmark, a left-aligned nav group ("Platform Suite" mega menu,
// Solutions, Changelog, Pricing) and, on the right, a pulsing "99.994% Uptime"
// status and a pill "Deploy Free" button.

// Design:
// - <header> with one flex row (justify-between): the left group holds the brand
//   and nav (gap-10), and the right group holds the status and CTA.
// - Light: white background, #111a22 text, gray-200 bottom border. Dark (dark:
//   variants): #0b1319 background, gray-800 border, white text. The accent #17a878
//   is used for the dot, slash, mega menu trigger and CTA (hover emerald-600).
// - Typography: xs semibold nav links, 10px mono status and a mono xs bold CTA. The
//   header is rounded-none with border-b, and the CTA and dots are rounded-full.
// - Responsive: nav links are hidden below md (md:flex) and the uptime badge below
//   sm. Padding goes px-5 -> sm:px-8. There is no mobile menu toggle, so only the
//   brand and CTA remain on small screens.

// What it does:
// - Embeds <MegaMenu category="saas" variant={1} label="Platform Suite"
//   accent="#17a878" />. Clicking the trigger toggles it, and focusing it opens it.
//   It renders the SaasMegaMenu "Enterprise Multi-Tier Platform Suite" panel
//   through a portal, fixed just below the header. The panel closes 160 ms after
//   the mouse leaves, on blur, or on Escape.
// - Anchors: brand `#workspace`, `#solutions`, `#changelog`, `#pricing`, CTA
//   `#deploy`. The uptime dot uses animate-pulse. The navbar has no content props or
//   local state of its own.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NorthstarPlatformSuiteNavbar from '@/TestComponent/SectionDesigns/Sections/saas/Navbar01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NorthstarPlatformSuiteNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function NorthstarPlatformSuiteNavbar({
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
                'rounded-none border-b border-gray-200 bg-white px-5 py-3.5 text-[#111a22] dark:border-gray-800 dark:bg-[#0b1319] dark:text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand & Left-Flush Navigation Group */}
                <div className="flex items-center gap-10">
                    <a
                        href="#workspace"
                        className="font-bold tracking-tight text-sm shrink-0 flex items-center gap-1.5"
                    >
                        <span className="h-2 w-2 rounded-full bg-[#17a878]" />
                        <span>northstar<span className="text-[#17a878]">/</span></span>
                    </a>

                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="saas"
                            accent="#17a878"
                            variant={1}
                            label="Platform Suite"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#17a878] hover:text-[#111a22] dark:hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#solutions" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            Solutions
                        </a>
                        <a href="#changelog" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            Changelog
                        </a>
                        <a href="#pricing" className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                            Pricing
                        </a>
                    </nav>
                </div>

                {/* Right Status & Deploy CTA */}
                <div className="flex items-center gap-5">
                    <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] text-gray-500 dark:text-white/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        99.994% Uptime
                    </span>
                    <a
                        href="#deploy"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#17a878] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                    >
                        <span>Deploy Free</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default NorthstarPlatformSuiteNavbar

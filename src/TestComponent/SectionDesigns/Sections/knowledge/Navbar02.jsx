// FieldguideHelpCenterNavbar

// Navbar02 · Knowledge Bases & Documentation › Navbars

// Description:
// A light help-center header branded "FIELDGUIDE / HELP". The serif wordmark
// sits far left; on the right are an "Instant Answers" mega menu, links to
// Troubleshooting, Architecture and System Status, and a solid "Ask Support"
// button.

// Design:
// - Single-row flex header with a bottom border: wordmark on the left, a
//   right-flushed group (ml-auto) holding the nav and the support button.
// - Pale mint palette: background #f4f8f5, border #d1e2d7, text #162720, accent
//   #41715d ("/ HELP" suffix, mega menu trigger, button background), links at
//   #162720/75; the button hovers to #162720.
// - Serif bold text-lg "FIELDGUIDE" with a sans text-xs suffix; text-xs semibold
//   links; monospace bold text-xs button with rounded-lg corners and HiArrowRight.
// - Padding px-5 → sm:px-8; the nav is hidden below md with no mobile menu
//   toggle, so small screens show only the wordmark and "Ask Support".

// What it does:
// - No content props or own state. "Instant Answers" is the shared MegaMenu (category
//   "knowledge", variant 2, accent #41715d): toggles on click or opens on focus,
//   closes on pointer leave (160ms delay), Escape or blur, and portals a
//   self-service panel (read-only search prompt plus popular articles) below the header.
// - Anchors: brand → #docs, #troubleshooting, #architecture, #status, and the
//   "Ask Support" CTA → #ask-support.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FieldguideHelpCenterNavbar from '@/TestComponent/SectionDesigns/Sections/knowledge/Navbar02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <FieldguideHelpCenterNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FieldguideHelpCenterNavbar({
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
                'rounded-none border-b border-[#d1e2d7] bg-[#f4f8f5] px-5 py-3.5 text-[#162720] sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#docs" className="font-serif text-lg font-bold shrink-0">
                    FIELDGUIDE <span className="font-sans text-xs font-normal text-[#41715d]">/ HELP</span>
                </a>

                {/* Right-Flush Navigation & Ask Support Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-semibold md:flex">
                        <MegaMenu
                            category="knowledge"
                            accent="#41715d"
                            variant={2}
                            label="Instant Answers"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#41715d] hover:text-[#162720] transition-colors cursor-pointer"
                        />
                        <a href="#troubleshooting" className="text-[#162720]/75 hover:text-[#162720] transition-colors">
                            Troubleshooting
                        </a>
                        <a href="#architecture" className="text-[#162720]/75 hover:text-[#162720] transition-colors">
                            Architecture
                        </a>
                        <a href="#status" className="text-[#162720]/75 hover:text-[#162720] transition-colors">
                            System Status
                        </a>
                    </nav>

                    <a
                        href="#ask-support"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#41715d] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#162720] transition-colors shrink-0"
                    >
                        <span>Ask Support</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default FieldguideHelpCenterNavbar

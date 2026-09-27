// FloatingPillDiscoveryNavbar

// Navbar04 · Portfolios & Personal Websites › Navbars

// Description:
// Floating capsule navbar for Jamie Park: a serif name wordmark, a "Services &
// Retainers" mega menu with links to Selected Cases, Sprint Retainers and
// Monographs, and a coral "Book Discovery" pill button for booking a call.

// Design:
// - Outer header with small padding (py-2 px-3); inner capsule is centred
//   (mx-auto max-w-5xl) and laid out as one flex row (justify-between).
// - Dark palette: capsule #241d1a with white text, coral #ef6a4b (border at
//   /30, mega menu trigger, CTA; CTA hovers to white with #241d1a text);
//   links white/70 → white.
// - Brand font-serif text-lg bold; xs medium nav; mono bold CTA; rounded-full
//   capsule and button, shadow-xl, backdrop-blur-md.
// - The nav is hidden below md with no mobile menu in its place; brand and
//   "Book Discovery" stay visible at every width.

// What it does:
// - No content props or local state; "Services & Retainers" is a MegaMenu (category
//   "portfolio", variant 4) that toggles on click or keyboard focus, closes on
//   pointer leave (160ms), blur or Escape, and portals a "Ways We Can
//   Collaborate" services panel below the header.
// - Anchors: brand → #home, #selected, #retainers, "Monographs" → #press;
//   CTA → #book-call.
// - Its mega menu panel is ServicesRetainersMegaMenu in MegaMenus/portfolio/MegaMenu04.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FloatingPillDiscoveryNavbar from '@/TestComponent/SectionDesigns/Sections/portfolio/Navbar04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <FloatingPillDiscoveryNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FloatingPillDiscoveryNavbar({
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
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-[#ef6a4b]/30 bg-[#241d1a] px-6 py-2.5 text-white shadow-xl backdrop-blur-md">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-serif text-lg font-bold tracking-tight shrink-0"
                >
                    Jamie Park
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-medium md:flex">
                    <MegaMenu
                        category="portfolio"
                        accent="#ef6a4b"
                        variant={4}
                        label="Services & Retainers"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#ef6a4b] hover:text-white transition-colors cursor-pointer"
                    />
                    <a href="#selected" className="text-white/70 hover:text-white transition-colors">
                        Selected Cases
                    </a>
                    <a href="#retainers" className="text-white/70 hover:text-white transition-colors">
                        Sprint Retainers
                    </a>
                    <a href="#press" className="text-white/70 hover:text-white transition-colors">
                        Monographs
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#book-call"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#ef6a4b] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#241d1a] transition-colors shrink-0"
                >
                    <span>Book Discovery</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

export default FloatingPillDiscoveryNavbar

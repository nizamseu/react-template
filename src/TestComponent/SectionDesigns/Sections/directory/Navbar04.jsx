// FloatingPillStudioIndexNavbar

// Navbar04 · Directories & Search Aggregators › Navbars

// Description:
// Floating capsule navbar for "LOCAL/LIST", a directory of creative studios.
// Inside the dark pill: the micro brand, a "Creative Studios" MegaMenu
// (variant 4: independent studios & agencies panel), links to Design Agencies,
// Architects and Craft Guilds, and a lime "Studio Index" button.

// Design:
// - Transparent header (py-2 px-3) wrapping a centred max-w-5xl rounded-full
//   bar; flex justify-between: brand / nav / CTA
// - Deep green #1a2826 pill with border-white/10 and shadow-xl, white/70 links
//   (hover white), lime #d9f064 slash, trigger and CTA (#1a2826 text, hover
//   white)
// - Brand font-mono text-xs font-black uppercase tracking-[.18em]; links
//   text-xs; CTA font-mono text-xs bold rounded-full
// - The nav (MegaMenu + links) is hidden below md, leaving brand and CTA; no
//   mobile menu is provided

// What it does:
// - Renders MegaMenu (category="directory", variant={4}, accent="#d9f064"): its
//   trigger opens a portal panel under this header on focus and toggles it on
//   click; Escape closes it, as does leaving it with the pointer (~160ms delay)
// - Links: brand → #home, Design Agencies → #agencies, Architects →
//   #architects, Craft Guilds → #workshops, "Studio Index" → #agency-index

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FloatingPillStudioIndexNavbar from '@/TestComponent/SectionDesigns/Sections/directory/Navbar04';

// const AppShell = ({ children }) => (
//     <>
//         <FloatingPillStudioIndexNavbar />
//         <main className="space-y-6">{children}</main>
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FloatingPillStudioIndexNavbar({
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
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[#1a2826] px-6 py-2.5 text-white shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-black uppercase tracking-[.18em] shrink-0"
                >
                    LOCAL<span className="text-[#d9f064]">/</span>LIST
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs text-white/70 md:flex">
                    <MegaMenu
                        category="directory"
                        accent="#d9f064"
                        variant={4}
                        label="Creative Studios"
                        triggerClassName="inline-flex items-center gap-1 text-xs text-[#d9f064] hover:text-white transition-colors cursor-pointer"
                    />
                    <a href="#agencies" className="hover:text-white transition-colors">
                        Design Agencies
                    </a>
                    <a href="#architects" className="hover:text-white transition-colors">
                        Architects
                    </a>
                    <a href="#workshops" className="hover:text-white transition-colors">
                        Craft Guilds
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#agency-index"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#d9f064] px-4 py-1.5 font-mono text-xs font-bold text-[#1a2826] hover:bg-white transition-colors shrink-0"
                >
                    <span>Studio Index</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

export default FloatingPillStudioIndexNavbar

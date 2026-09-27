// MarginBroadcastAudioNavbar

// Navbar02 · Blogs & Digital Media › Navbars

// Description:
// A dark header for the audio arm of the publication, "MARGIN / BROADCAST".
// The wordmark sits on the far left; on the right are a "Broadcast Audio"
// mega menu, links to Episodes (48), Transcripts and the Patron Feed, and an
// outlined "Listen Live" button.

// Design:
// - One flex row: wordmark left, and a right-aligned group (ml-auto) with
//   the nav and the action button
// - Dark studio palette: background and 2px top/bottom border #191919, text
//   #e0e0e0 with white on hover, peach accent #e7a37c for the menu trigger
//   and button
// - Serif text-2xl bold wordmark with very wide tracking; monospace 11px
//   uppercase nav tracked at .15em; square (rounded-none) header and button;
//   the button fills with peach and turns #191919 text on hover
// - Nav (including the mega menu) is hidden below md with no mobile menu
//   toggle, leaving only the wordmark and "Listen Live"; padding
//   px-5 → sm:px-8

// What it does:
// - Renders `MegaMenu` (category "media", variant 2, label "Broadcast
//   Audio"): opens on click or keyboard focus, stays open while hovered,
//   closes 160ms after the pointer leaves, on blur, or on Escape. The panel
//   is portalled to document.body, fixed just below this header at its
//   width, and shows a rounded dark podcast/broadcast menu
// - Plain anchor links: `#home`, `#episodes`, `#transcripts`, `#patron`;
//   the "Listen Live" button links to `#subscribe`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MarginBroadcastAudioNavbar from '@/TestComponent/SectionDesigns/Sections/media/Navbar02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MarginBroadcastAudioNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function MarginBroadcastAudioNavbar({
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
                'rounded-none border-y-2 border-[#191919] bg-[#191919] px-5 py-3.5 text-[#e0e0e0] sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left */}
                <a href="#home" className="font-serif text-2xl font-bold tracking-widest text-white shrink-0">
                    MARGIN / BROADCAST
                </a>

                {/* Right-Flush Navigation & Subscriber Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-6 text-[11px] font-mono uppercase tracking-[.15em] md:flex">
                        <MegaMenu
                            category="media"
                            accent="#e7a37c"
                            variant={2}
                            label="Broadcast Audio"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[.15em] text-[#e7a37c] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#episodes" className="hover:text-white transition-colors">
                            Episodes (48)
                        </a>
                        <a href="#transcripts" className="hover:text-white transition-colors">
                            Transcripts
                        </a>
                        <a href="#patron" className="hover:text-white transition-colors">
                            Patron Feed
                        </a>
                    </nav>

                    <a
                        href="#subscribe"
                        className="inline-flex items-center gap-1.5 rounded-none border border-[#e7a37c] px-3.5 py-1.5 font-mono text-xs font-bold text-[#e7a37c] hover:bg-[#e7a37c] hover:text-[#191919] transition-colors shrink-0"
                    >
                        <span>Listen Live</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default MarginBroadcastAudioNavbar

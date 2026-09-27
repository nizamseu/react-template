// FloatingLiveWirePillNavbar

// Navbar04 · Blogs & Digital Media › Navbars

// Description:
// A floating, pill-shaped header for "Margin / Wire", a live news-wire
// section. A pulsing white dot sits before the wordmark; the centre holds a
// "Live Wire Feed" mega menu and links to Dispatches, Field Transcripts and
// Investigations; a white "Live RSS" pill sits on the right.

// Design:
// - Outer header with small padding wraps a centred pill (max-w-5xl) laid
//   out as a flex row: brand, nav, action
// - Solid terracotta pill #a84f34 with white text (links at 80% opacity),
//   border black/10, shadow-xl; the RSS pill is white with #a84f34 text and
//   turns black with white text on hover
// - Serif text-lg bold "Margin" with a small sans uppercase "/ Wire" suffix;
//   xs nav text; rounded-full container and button
// - Nav (including the mega menu) is hidden below md with no mobile menu
//   toggle, leaving only the brand and "Live RSS"

// What it does:
// - Renders `MegaMenu` (category "media", variant 4, label "Live Wire
//   Feed", accent #ffffff): opens on click or keyboard focus, stays open
//   while hovered, closes 160ms after the pointer leaves, on blur, or on
//   Escape. The panel is portalled to document.body, fixed just below this
//   header at its width, and shows a light breaking-news wire feed menu
// - The dot uses Tailwind's `animate-ping`; plain anchor links: `#home`,
//   `#breaking` (Dispatches), `#fieldnotes`, `#dossiers`, `#rss`
// - Its mega menu panel is BreakingNewsWireMegaMenu in MegaMenus/media/MegaMenu04.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FloatingLiveWirePillNavbar from '@/TestComponent/SectionDesigns/Sections/media/Navbar04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <FloatingLiveWirePillNavbar />
//     </main>
// )
// ```

'use client'

import { HiOutlineRss } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function FloatingLiveWirePillNavbar({
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
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-black/10 bg-[#a84f34] px-6 py-2.5 text-white shadow-xl">
                {/* Micro Brand */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    <a
                        href="#home"
                        className="font-serif text-lg font-bold tracking-tight"
                    >
                        Margin <span className="font-sans text-xs uppercase tracking-widest font-normal opacity-80">/ Wire</span>
                    </a>
                </div>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-medium md:flex">
                    <MegaMenu
                        category="media"
                        accent="#ffffff"
                        variant={4}
                        label="Live Wire Feed"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-bold text-white hover:opacity-80 transition-opacity cursor-pointer"
                    />
                    <a href="#breaking" className="text-white/80 hover:text-white transition-colors">
                        Dispatches
                    </a>
                    <a href="#fieldnotes" className="text-white/80 hover:text-white transition-colors">
                        Field Transcripts
                    </a>
                    <a href="#dossiers" className="text-white/80 hover:text-white transition-colors">
                        Investigations
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#rss"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#a84f34] hover:bg-black hover:text-white transition-colors shrink-0"
                >
                    <HiOutlineRss />
                    <span>Live RSS</span>
                </a>
            </div>
        </header>
    )
}

export default FloatingLiveWirePillNavbar

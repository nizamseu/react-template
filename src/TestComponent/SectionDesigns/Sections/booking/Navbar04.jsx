// SlowCoastFloatingPillNavbar

// Navbar04 · Booking & Reservations › Navbars

// Description:
// A floating, pill-shaped header for "SLOW COAST / TRAVEL" focused on hosted
// experiences. It shows the mono wordmark, a "Host Experiences" MegaMenu with
// Craft Workshops, Alpine Foraging and Meet Hosts links, and a "Host a Stay"
// pill button.

// Design:
// - Transparent header (py-2 px-3) wrapping a centered max-w-5xl rounded-full
//   bar laid out brand / nav / CTA with justify-between
// - Sage #e5ede8 pill with a #c8d8cf border and shadow-xl, deep teal #132d3a
//   text (links at 75% opacity), rust #b65f47 slash and MegaMenu trigger;
//   the #132d3a CTA hovers to #b65f47
// - Mono uppercase text-xs bold wordmark with tracking-[.18em]; text-xs
//   semibold links; rounded-full bar and CTA
// - Nav is hidden below md (no mobile menu), leaving only wordmark and CTA

// What it does:
// - No content props or state of its own; renders MegaMenu (category "booking",
//   variant 4, accent #b65f47) whose trigger opens the "Led by Local
//   Craftsmen, Foragers & Scientists" experiences panel on click or keyboard
//   focus; portaled below the header, it closes on mouse-leave/blur after
//   160ms or on Escape
// - Anchors: wordmark → #home, #workshops, #foraging, #hosts;
//   "Host a Stay" (HiArrowRight) → #host-stay
// - Its mega menu panel is HostExperiencesMegaMenu in MegaMenus/booking/MegaMenu04.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SlowCoastFloatingPillNavbar from '@/TestComponent/SectionDesigns/Sections/booking/Navbar04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SlowCoastFloatingPillNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function SlowCoastFloatingPillNavbar({
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
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-[#c8d8cf] bg-[#e5ede8] px-6 py-2.5 text-[#132d3a] shadow-xl">
                {/* Micro Brand */}
                <a
                    href="#home"
                    className="font-mono text-xs font-bold uppercase tracking-[.18em] shrink-0"
                >
                    SLOW COAST <span className="text-[#b65f47]">/</span> TRAVEL
                </a>

                {/* Pill Links & MegaMenu */}
                <nav className="hidden items-center gap-6 text-xs font-semibold md:flex">
                    <MegaMenu
                        category="booking"
                        accent="#b65f47"
                        variant={4}
                        label="Host Experiences"
                        triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#b65f47] hover:text-[#132d3a] transition-colors cursor-pointer"
                    />
                    <a href="#workshops" className="text-[#132d3a]/75 hover:text-[#132d3a] transition-colors">
                        Craft Workshops
                    </a>
                    <a href="#foraging" className="text-[#132d3a]/75 hover:text-[#132d3a] transition-colors">
                        Alpine Foraging
                    </a>
                    <a href="#hosts" className="text-[#132d3a]/75 hover:text-[#132d3a] transition-colors">
                        Meet Hosts
                    </a>
                </nav>

                {/* Pill Action */}
                <a
                    href="#host-stay"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#132d3a] px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#b65f47] transition-colors shrink-0"
                >
                    <span>Host a Stay</span>
                    <HiArrowRight />
                </a>
            </div>
        </header>
    )
}

export default SlowCoastFloatingPillNavbar

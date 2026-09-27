// BringYourPeopleDarkCTAFooter

// Footer04 · Social Networks & Communities › Footers

// Description:
// A dark footer that doubles as a final sign-up prompt: the eyebrow "A little more human online",
// the headline "Bring your people. We'll make room." and a "Join Commonroom" pill button, with a
// compact About, Groups, Help and Contact link block on the right and a "Better together."
// copyright line.

// Design:
// - Grid md:grid-cols-[1fr_auto]: headline + CTA left, a 2×2 nav grid right aligned to the bottom
//   (self-end); a bottom copyright row with a border-t
// - Palette: dark brown #27201d background, white text, peach #ffccad eyebrow and CTA (with a dark
//   #27201d label), white/60 links, white/40 copyright, white/15 divider; dark theme
// - Typography & shapes: uppercase bold eyebrow (tracking .14em), font-black text-4xl headline,
//   bold text-sm CTA; rounded-lg footer, rounded-full button
// - Responsive: the nav moves below the headline block under md; padding p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: CTA "Join Commonroom" → #join (HiArrowRight icon); nav → #about, #groups, #help, #contact

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BringYourPeopleDarkCTAFooter from '@/TestComponent/SectionDesigns/Sections/community/Footer04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <BringYourPeopleDarkCTAFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BringYourPeopleDarkCTAFooter({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <footer
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-lg bg-[#27201d] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ffccad]">
                        A little more human online
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-black">
                        Bring your people. We&apos;ll make room.
                    </h2>
                    <a
                        href="#join"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ffccad] px-5 py-3 text-sm font-bold text-[#27201d]"
                    >
                        Join Commonroom <HiArrowRight />
                    </a>
                </div>
                <nav className="grid grid-cols-2 gap-x-8 gap-y-4 self-end text-sm text-white/60">
                    <a href="#about">About</a>
                    <a href="#groups">Groups</a>
                    <a href="#help">Help</a>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
            <p className="mt-9 border-t border-white/15 pt-4 text-xs text-white/40">
                © Commonroom · Better together.
            </p>
        </footer>
    )
}

export default BringYourPeopleDarkCTAFooter

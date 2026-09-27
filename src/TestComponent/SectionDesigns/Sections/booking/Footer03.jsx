// ThreeColumnBrandFooter

// Footer03 · Booking & Reservations › Footers

// Description:
// A compact dark footer for "elsewhere." in three columns: the wordmark with
// the tagline "Travel less like a checklist. More like a guest.", a 2x2 grid
// of site links, and a "For thoughtful travelers" note with an Instagram
// link; a bottom line reads "© Elsewhere · Terms · Privacy · Local impact".

// Design:
// - md:grid-cols-[1fr_1fr_1fr] (brand | links | social), then a bordered
//   copyright row
// - Deep teal #132d3a background, white text at 55-65% for copy and links,
//   peach #f0aa8d Instagram link, white/15 divider, white/40 copyright
// - Serif text-2xl wordmark, text-sm links, text-xs copyright; rounded-lg shell
// - Columns stack below md; padding p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: wordmark → #home, #stays, #hosts, #experiences, #journal,
//   "Instagram" (HiArrowRight) → #instagram; Terms / Privacy / Local impact
//   are plain text, not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ThreeColumnBrandFooter from '@/TestComponent/SectionDesigns/Sections/booking/Footer03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ThreeColumnBrandFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ThreeColumnBrandFooter({
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
                'rounded-lg bg-[#132d3a] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="font-serif text-2xl">
                        elsewhere.
                    </a>
                    <p className="mt-3 text-sm text-white/55">
                        Travel less like a checklist. More like a guest.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/65">
                    <a href="#stays">Stays</a>
                    <a href="#hosts">Hosts</a>
                    <a href="#experiences">Experiences</a>
                    <a href="#journal">Journal</a>
                </div>
                <div className="text-sm text-white/55">
                    <p>For thoughtful travelers</p>
                    <a
                        href="#instagram"
                        className="mt-3 inline-flex items-center gap-1 text-[#f0aa8d]"
                    >
                        Instagram <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © Elsewhere · Terms · Privacy · Local impact
            </p>
        </footer>
    )
}

export default ThreeColumnBrandFooter

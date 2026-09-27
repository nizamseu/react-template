// DigitalVaultArchiveUnlockCTA

// CTA04 · Blogs & Digital Media › Banner CTAs

// Description:
// A bold terracotta banner selling access to the publication's digital
// archive, "DIGITAL VAULT ACCESS · 2004–2026". The headline "Unlock 22 Years
// of Unfiltered Critical Cultural Archives" mentions 4,200+ investigations,
// audio tapes and monograph scans, with an "Unlock Full Archive Pass" button.

// Design:
// - Flex row from lg (stacked below): copy on the left, button on the right
//   (shrink-0), vertically centred
// - Solid terracotta #a84f34 with white text (copy white/80); black label
//   chip with terracotta text; white button with terracotta text that turns
//   black with white text on hover
// - Serif text-3xl → sm:text-4xl normal-weight headline; monospace font-black
//   uppercase chip tracked at .2em; square corners (rounded-none): 2px black
//   border on the banner, 2px white border on the button
// - Stacks below lg; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Button links to `#unlock-vault`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DigitalVaultArchiveUnlockCTA from '@/TestComponent/SectionDesigns/Sections/media/CTA04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DigitalVaultArchiveUnlockCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DigitalVaultArchiveUnlockCTA({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-none border-2 border-black bg-[#a84f34] p-8 text-white sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-black text-[#a84f34] px-2 py-0.5">
                        DIGITAL VAULT ACCESS &bull; 2004–2026
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                        Unlock 22 Years of Unfiltered Critical Cultural Archives
                    </h2>
                    <p className="mt-2 text-sm text-white/80 max-w-xl">
                        Over 4,200 longform investigations, historic audio tapes, and rare out-of-print monograph scans indexed in high-resolution searchable PDF.
                    </p>
                </div>

                <a
                    href="#unlock-vault"
                    className="inline-flex items-center justify-center gap-2 border-2 border-white bg-white px-6 py-3.5 font-serif text-xs font-bold text-[#a84f34] hover:bg-black hover:text-white transition-colors shrink-0"
                >
                    <span>Unlock Full Archive Pass</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default DigitalVaultArchiveUnlockCTA

// AdvisoryBrandSitemapFooter

// Footer03 · Corporate & Business › Footers

// Description:
// Compact dark footer led by the "NORTHSTAR / ADVISORY" wordmark and the tagline
// "Independent perspective for complex moments.", followed by a 2x2 link grid (Expertise,
// People, Sectors, Careers), an offices line with a LinkedIn link, and the legal line
// "© 2026 Northstar · Legal · Privacy · Accessibility".

// Design:
// - Grid md:grid-cols-[1.2fr_1fr_1fr] gap-8 (brand | links | offices) above a copyright
//   row separated by a white/15 top border
// - Dark navy #121c2c background, white wordmark, sky-blue #84b9ff LinkedIn link, muted
//   text in white/50-65, legal line white/40
// - Wordmark text-sm bold tracking-[.12em]; body text-sm; rounded-lg footer
// - Below md the columns stack into one; padding p-7 -> sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: #home, #expertise, #people, #sectors, #careers and #linkedin (with
//   HiArrowRight); Legal / Privacy / Accessibility are plain text, not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AdvisoryBrandSitemapFooter from '@/TestComponent/SectionDesigns/Sections/corporate/Footer03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <AdvisoryBrandSitemapFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AdvisoryBrandSitemapFooter({
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
                'rounded-lg bg-[#121c2c] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
                <div>
                    <a
                        href="#home"
                        className="text-sm font-bold tracking-[.12em]"
                    >
                        NORTHSTAR / ADVISORY
                    </a>
                    <p className="mt-4 max-w-xs text-sm text-white/50">
                        Independent perspective for complex moments.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/65">
                    <a href="#expertise">Expertise</a>
                    <a href="#people">People</a>
                    <a href="#sectors">Sectors</a>
                    <a href="#careers">Careers</a>
                </div>
                <div className="text-sm text-white/60">
                    <p>New York / London / Singapore</p>
                    <a
                        href="#linkedin"
                        className="mt-4 inline-flex items-center gap-1 text-[#84b9ff]"
                    >
                        LinkedIn <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © 2026 Northstar · Legal · Privacy · Accessibility
            </p>
        </footer>
    )
}

export default AdvisoryBrandSitemapFooter

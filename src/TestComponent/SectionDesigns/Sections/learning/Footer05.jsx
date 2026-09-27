// MinimalWhiteWordmarkFooter

// Footer05 · Learning Management & EdTech › Footers

// Description:
// Minimal light footer with the "fieldnote." wordmark and the tagline "Learn one
// thing deeply. Then pass it on.", a row of links (Our story, Teach with us,
// Support, Community) and a bottom bar with "© 2026 Fieldnote" and a "Follow the
// work" link.

// Design:
// - Flex column that becomes a row on md (md:items-end, justify-between), plus
//   a border-t bottom bar with justify-between
// - Light palette: white background, #102d36 text, #dce5dc border and divider,
//   gray-500 secondary text
// - Serif text-2xl wordmark, sm tagline, xs links; rounded-lg footer with a
//   1px border
// - Stacks below md; link row wraps; padding p-7 -> sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: #home, #about, #teach, #support, #community, and "Follow the
//   work" -> #social (HiArrowRight)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MinimalWhiteWordmarkFooter from '@/TestComponent/SectionDesigns/Sections/learning/Footer05';

// const SiteLayout = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <MinimalWhiteWordmarkFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MinimalWhiteWordmarkFooter({
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
                'rounded-lg border border-[#dce5dc] bg-white p-7 text-[#102d36] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                    <a href="#home" className="font-serif text-2xl">
                        fieldnote.
                    </a>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Learn one thing deeply. Then pass it on.
                    </p>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs">
                    <a href="#about">Our story</a>
                    <a href="#teach">Teach with us</a>
                    <a href="#support">Support</a>
                    <a href="#community">Community</a>
                </div>
            </div>
            <div className="mt-8 flex justify-between border-t border-[#dce5dc] pt-4 text-xs text-gray-500">
                <span>© 2026 Fieldnote</span>
                <a href="#social" className="flex items-center gap-1">
                    Follow the work <HiArrowRight />
                </a>
            </div>
        </footer>
    )
}

export default MinimalWhiteWordmarkFooter
